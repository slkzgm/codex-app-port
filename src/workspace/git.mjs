import { spawn as defaultSpawn } from "node:child_process";
import { lstat, mkdir, open, readFile, readdir, unlink } from "node:fs/promises";
import { basename, dirname, join, relative, resolve, sep } from "node:path";

const MAX_HEAD_BYTES = 8 * 1024;
const MAX_CONFIG_BYTES = 256 * 1024;
const MAX_REF_BYTES = 256;
const MAX_PACKED_REFS_BYTES = 512 * 1024;
const MAX_REF_SCAN_ENTRIES = 500;
const MAX_RETURNED_BRANCHES = 40;
const MAX_RETURNED_WORKTREES = 20;
const MAX_INDEX_BYTES = 2 * 1024 * 1024;
const MAX_INDEX_ENTRIES = 1000;
const MAX_STATUS_CHECKS = 200;
const MAX_UNTRACKED_SCAN_ENTRIES = 500;
const MAX_BRANCH_SWITCH_SAFETY_SCAN_ENTRIES = 500;
const MAX_BRANCH_SWITCH_SAFETY_SCAN_DEPTH = 3;
const DEFAULT_GIT_ACTION_TIMEOUT_MS = 10_000;
const MAX_GIT_COMMAND_OUTPUT_BYTES = 16 * 1024;
const MAX_GIT_COMMIT_MESSAGE_CHARS = 2_000;
const MAX_GIT_WORKTREE_PATH_CHARS = 240;
const SAFE_GIT_CONFIG_ARGS = [
  "-c",
  "core.hooksPath=/dev/null",
  "-c",
  "core.fsmonitor=false",
  "-c",
  "core.untrackedCache=false",
  "-c",
  "core.pager=cat",
  "-c",
  "advice.detachedHead=false",
  "-c",
  "commit.gpgsign=false",
  "-c",
  "tag.gpgsign=false",
  "-c",
  "diff.external=",
];

export async function summarizeGitWorktree(workspace) {
  const gitPath = join(workspace.cwd, ".git");
  const summary = emptySummary();

  let gitInfo;
  try {
    gitInfo = await lstat(gitPath);
  } catch (error) {
    if (error.code === "ENOENT") {
      return summary;
    }
    return withWarning(summary, "git-metadata-unreadable");
  }

  if (gitInfo.isSymbolicLink()) {
    return withWarning(
      {
        ...summary,
        gitMetadataType: "symlink",
      },
      "git-metadata-symlink-not-followed",
    );
  }

  if (gitInfo.isFile()) {
    const gitFile = await readSmallTextFile(gitPath, MAX_HEAD_BYTES);
    const linked = parseGitDirFile(gitFile.text);
    return {
      ...summary,
      isRepository: Boolean(linked),
      gitMetadataType: "file",
      isLinkedWorktree: Boolean(linked),
      followsLinkedGitDir: false,
      warnings: [
        ...summary.warnings,
        ...gitFile.warnings,
        ...(linked ? ["linked-gitdir-not-followed"] : ["git-file-not-recognized"]),
      ],
    };
  }

  if (!gitInfo.isDirectory()) {
    return withWarning(
      {
        ...summary,
        gitMetadataType: "other",
      },
      "git-metadata-not-directory",
    );
  }

  const head = await readSmallTextFile(join(gitPath, "HEAD"), MAX_HEAD_BYTES);
  const config = await readSmallTextFile(join(gitPath, "config"), MAX_CONFIG_BYTES, {
    optional: true,
  });
  const parsedHead = parseHead(head.text);
  const remoteCount = countRemoteSections(config.text);
  const branches = await readLocalBranches(gitPath, parsedHead.branch);
  const worktrees = await readLinkedWorktrees(join(gitPath, "worktrees"));
  const status = await readIndexStatus(workspace.cwd, join(gitPath, "index"));
  const branchSwitchSafety = await readBranchSwitchSafety(workspace.cwd, gitPath, config.text);

  return {
    ...summary,
    isRepository: true,
    gitMetadataType: "directory",
    headKind: parsedHead.kind,
    branch: parsedHead.branch,
    commitShort: parsedHead.commitShort,
    hasRemotes: remoteCount > 0,
    remoteCount,
    localBranchCount: branches.count,
    returnedBranchCount: branches.items.length,
    branches: branches.items,
    linkedWorktreeCount: worktrees.count,
    returnedLinkedWorktreeCount: worktrees.items.length,
    linkedWorktrees: worktrees.items,
    statusAvailable: status.available,
    statusMode: status.mode,
    trackedFileCount: status.trackedFileCount,
    checkedTrackedFileCount: status.checkedTrackedFileCount,
    modifiedTrackedCount: status.modifiedTrackedCount,
    missingTrackedCount: status.missingTrackedCount,
    untrackedTopLevelCount: status.untrackedTopLevelCount,
    statusTruncated: status.truncated,
    branchSwitchSafety,
    branchSwitchAvailable: false,
    commitActionsAvailable: false,
    warnings: [
      ...head.warnings,
      ...config.warnings,
      ...branches.warnings,
      ...worktrees.warnings,
      ...status.warnings,
      ...branchSwitchSafety.warnings,
    ],
  };
}

export async function runGitBranchSwitch({
  workspace,
  branch,
  gitBin = "git",
  timeoutMs = DEFAULT_GIT_ACTION_TIMEOUT_MS,
  spawn = defaultSpawn,
} = {}) {
  if (!workspace || typeof workspace.cwd !== "string") {
    throwGitActionError("Workspace is required for Git branch switching", 400);
  }
  const targetName = validateBranchActionTarget(branch);
  const before = await summarizeGitWorktree(workspace);
  const target = assertBranchSwitchPreconditions(before, targetName);
  const beforeStatus = summarizeSwitchStatus(before);

  if (target.current) {
    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      action: {
        type: "git-branch-switch",
        execution: "skipped",
        branchSwitchExecuted: false,
        gitSubprocess: false,
        filesystemWrites: false,
        appServerTouched: false,
        reason: "branch-already-current",
      },
      target: {
        branch: target.name,
        current: true,
        commitShort: target.commitShort,
      },
      before: summarizeSwitchHead(before),
      after: summarizeSwitchHead(before),
      status: {
        before: beforeStatus,
        after: beforeStatus,
      },
      safety: before.branchSwitchSafety,
      subprocess: {
        invoked: false,
        command: "git switch",
        exitCode: null,
      },
    };
  }

  const porcelain = await runGitCommand(
    [...SAFE_GIT_CONFIG_ARGS, "status", "--porcelain=v1", "-z", "--untracked-files=normal"],
    { cwd: workspace.cwd, gitBin, timeoutMs, spawn },
  );
  if (porcelain.exitCode !== 0) {
    throwGitActionError("Git clean-status verification failed before branch switch", 409);
  }
  if (porcelain.stdout.length > 0) {
    throwGitActionError("Git branch switch requires a clean worktree", 409);
  }

  const switched = await runGitCommand(
    [...SAFE_GIT_CONFIG_ARGS, "switch", "--no-guess", "--", target.name],
    { cwd: workspace.cwd, gitBin, timeoutMs, spawn },
  );
  if (switched.exitCode !== 0) {
    throwGitActionError("Git branch switch failed", 409);
  }

  const after = await summarizeGitWorktree(workspace);
  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    action: {
      type: "git-branch-switch",
      execution: "completed",
      branchSwitchExecuted: true,
      gitSubprocess: true,
      filesystemWrites: true,
      appServerTouched: false,
      reason: null,
    },
    target: {
      branch: target.name,
      current: false,
      commitShort: target.commitShort,
    },
    before: summarizeSwitchHead(before),
    after: summarizeSwitchHead(after),
    status: {
      before: beforeStatus,
      after: summarizeSwitchStatus(after),
    },
    safety: before.branchSwitchSafety,
    subprocess: {
      invoked: true,
      command: "git switch",
      exitCode: switched.exitCode,
    },
  };
}

export async function runGitBranchCreate({ workspace, branch } = {}) {
  if (!workspace || typeof workspace.cwd !== "string") {
    throwGitActionError("Workspace is required for Git branch creation", 400);
  }
  const targetName = validateBranchActionTarget(branch);
  const before = await summarizeGitWorktree(workspace);
  assertBranchCreatePreconditions(before, targetName);

  const gitPath = join(workspace.cwd, ".git");
  const headCommit = await readFullHeadCommit(gitPath, before);
  if (!headCommit) {
    throwGitActionError("Git branch creation requires a readable HEAD commit", 409);
  }

  const branchParts = targetName.split("/");
  const parent = await ensureSafeRefDirectory(
    join(gitPath, "refs", "heads"),
    branchParts.slice(0, -1),
  );
  const refPath = join(parent, branchParts.at(-1));

  let handle;
  try {
    handle = await open(refPath, "wx", 0o600);
    await handle.writeFile(`${headCommit}\n`, "utf8");
  } catch (error) {
    if (error.code === "EEXIST") {
      throwGitActionError("Git branch already exists", 409);
    }
    throwGitActionError("Git branch ref could not be written", 500);
  } finally {
    await handle?.close();
  }

  const after = await summarizeGitWorktree(workspace);
  const created = after.branches.find((candidate) => candidate.name === targetName) ?? null;
  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    action: {
      type: "git-branch-create",
      execution: "completed",
      branchCreated: true,
      refWrite: true,
      gitSubprocess: false,
      filesystemWrites: true,
      appServerTouched: false,
      reason: null,
    },
    target: {
      branch: targetName,
      current: false,
      commitShort: created?.commitShort ?? headCommit.slice(0, 12),
    },
    source: summarizeSwitchHead(before),
    status: {
      before: {
        localBranchCount: before.localBranchCount,
      },
      after: {
        localBranchCount: after.localBranchCount,
      },
    },
    subprocess: {
      invoked: false,
      command: null,
      exitCode: null,
    },
  };
}

export async function runGitBranchDelete({ workspace, branch } = {}) {
  if (!workspace || typeof workspace.cwd !== "string") {
    throwGitActionError("Workspace is required for Git branch deletion", 400);
  }
  const targetName = validateBranchActionTarget(branch);
  const before = await summarizeGitWorktree(workspace);
  const target = assertBranchDeletePreconditions(before, targetName);

  const gitPath = join(workspace.cwd, ".git");
  const refPath = join(gitPath, "refs", "heads", ...targetName.split("/"));
  const info = await lstat(refPath).catch((error) => {
    if (error.code === "ENOENT") {
      throwGitActionError("Git branch deletion supports loose local refs only", 409);
    }
    throwGitActionError("Git branch ref is not safely readable", 409);
  });
  if (info.isSymbolicLink() || !info.isFile()) {
    throwGitActionError("Git branch ref is not safely deletable", 409);
  }
  const ref = await readSmallTextFile(refPath, MAX_REF_BYTES);
  const fullCommit = parseCommitFull(ref.text);
  if (!fullCommit || (target.commitShort && !fullCommit.startsWith(target.commitShort))) {
    throwGitActionError("Git branch ref changed before deletion", 409);
  }
  await unlink(refPath);

  const after = await summarizeGitWorktree(workspace);
  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    action: {
      type: "git-branch-delete",
      execution: "completed",
      branchDeleted: true,
      refDelete: true,
      gitSubprocess: false,
      filesystemWrites: true,
      appServerTouched: false,
      reason: null,
    },
    target: {
      branch: target.name,
      current: false,
      commitShort: target.commitShort,
    },
    status: {
      before: {
        localBranchCount: before.localBranchCount,
      },
      after: {
        localBranchCount: after.localBranchCount,
      },
    },
    subprocess: {
      invoked: false,
      command: null,
      exitCode: null,
    },
  };
}

export async function runGitCommit({
  workspace,
  message,
  gitBin = "git",
  timeoutMs = DEFAULT_GIT_ACTION_TIMEOUT_MS,
  spawn = defaultSpawn,
} = {}) {
  if (!workspace || typeof workspace.cwd !== "string") {
    throwGitActionError("Workspace is required for Git commit creation", 400);
  }
  const commitMessage = validateGitCommitMessageInput(message);
  const before = await summarizeGitWorktree(workspace);
  const gitPath = join(workspace.cwd, ".git");
  const sourceCommit = await readFullHeadCommit(gitPath, before);
  assertGitCommitPreconditions(before, sourceCommit);
  const beforeStatus = summarizeSwitchStatus(before);

  const staged = await runGitCommand(
    [
      ...SAFE_GIT_CONFIG_ARGS,
      "diff",
      "--cached",
      "--quiet",
      "--no-ext-diff",
      "--no-textconv",
      "--exit-code",
      "--",
    ],
    { cwd: workspace.cwd, gitBin, timeoutMs, spawn },
  );
  if (staged.exitCode === 0) {
    throwGitActionError("Git commit requires staged changes", 409);
  }
  if (staged.exitCode !== 1) {
    throwGitActionError("Git staged-change verification failed before commit", 409);
  }

  const committed = await runGitCommand(
    [
      ...SAFE_GIT_CONFIG_ARGS,
      "commit",
      "--quiet",
      "--no-verify",
      "--no-gpg-sign",
      "--no-status",
      "--cleanup=verbatim",
      "--file",
      "-",
    ],
    {
      cwd: workspace.cwd,
      gitBin,
      timeoutMs,
      spawn,
      stdin: commitMessage.endsWith("\n") ? commitMessage : `${commitMessage}\n`,
    },
  );
  if (committed.exitCode !== 0) {
    throwGitActionError("Git commit failed", 409);
  }

  const after = await summarizeGitWorktree(workspace);
  const resultCommit = await readFullHeadCommit(gitPath, after);
  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    action: {
      type: "git-commit",
      execution: "completed",
      commitCreated: true,
      gitSubprocess: true,
      objectWrites: true,
      refWrites: true,
      filesystemWrites: true,
      appServerTouched: false,
      reason: null,
    },
    source: {
      branch: cleanRefName(before.branch),
      headKind: before.headKind,
      commitShort: sourceCommit.slice(0, 12),
    },
    result: {
      branch: cleanRefName(after.branch),
      headKind: after.headKind,
      commitShort: resultCommit?.slice(0, 12) ?? null,
      previousCommitShort: sourceCommit.slice(0, 12),
    },
    message: {
      charCount: commitMessage.length,
      lineCount: commitMessage.split(/\r\n|\r|\n/).length,
      subjectCharCount: commitMessage.split(/\r?\n/, 1)[0]?.trim().length ?? 0,
      textReturned: false,
    },
    status: {
      before: beforeStatus,
      after: summarizeSwitchStatus(after),
    },
    subprocess: {
      invoked: true,
      command: "git commit",
      exitCode: committed.exitCode,
    },
  };
}

export async function runGitWorktreeAction({
  workspace,
  action,
  path,
  branch = null,
  gitBin = "git",
  timeoutMs = DEFAULT_GIT_ACTION_TIMEOUT_MS,
  spawn = defaultSpawn,
} = {}) {
  if (!workspace || typeof workspace.cwd !== "string") {
    throwGitActionError("Workspace is required for Git worktree actions", 400);
  }
  const worktreeAction = validateGitWorktreeActionInput(action);
  if (worktreeAction === "create") {
    return runGitWorktreeCreate({
      workspace,
      path,
      branch,
      gitBin,
      timeoutMs,
      spawn,
    });
  }
  return runGitWorktreeRemove({
    workspace,
    path,
    gitBin,
    timeoutMs,
    spawn,
  });
}

async function runGitWorktreeCreate({
  workspace,
  path,
  branch,
  gitBin,
  timeoutMs,
  spawn,
}) {
  const target = await prepareGitWorktreeTarget(workspace, path, { mode: "create" });
  const targetBranchName = validateBranchActionTarget(branch);
  const before = await summarizeGitWorktree(workspace);
  const branchInfo = assertGitWorktreeCreatePreconditions(before, targetBranchName);

  const created = await runGitCommand(
    [
      ...SAFE_GIT_CONFIG_ARGS,
      "worktree",
      "add",
      "--no-guess-remote",
      "--",
      target.relativePath,
      branchInfo.name,
    ],
    { cwd: workspace.cwd, gitBin, timeoutMs, spawn },
  );
  if (created.exitCode !== 0) {
    throwGitActionError("Git worktree creation failed", 409);
  }

  const after = await summarizeGitWorktree(workspace);
  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    action: {
      type: "git-worktree",
      worktreeAction: "create",
      execution: "completed",
      worktreeCreated: true,
      worktreeRemoved: false,
      gitSubprocess: true,
      filesystemWrites: true,
      appServerTouched: false,
      reason: null,
    },
    target: {
      basename: target.basename,
      depth: target.depth,
      pathReturned: false,
    },
    branch: {
      branch: branchInfo.name,
      current: Boolean(branchInfo.current),
      commitShort: branchInfo.commitShort,
    },
    status: {
      before: summarizeWorktreeCounts(before),
      after: summarizeWorktreeCounts(after),
    },
    safety: before.branchSwitchSafety,
    subprocess: {
      invoked: true,
      command: "git worktree add",
      exitCode: created.exitCode,
    },
  };
}

async function runGitWorktreeRemove({ workspace, path, gitBin, timeoutMs, spawn }) {
  const target = await prepareGitWorktreeTarget(workspace, path, { mode: "remove" });
  const before = await summarizeGitWorktree(workspace);
  assertGitWorktreeRemovePreconditions(before);

  const removed = await runGitCommand(
    [...SAFE_GIT_CONFIG_ARGS, "worktree", "remove", "--", target.relativePath],
    { cwd: workspace.cwd, gitBin, timeoutMs, spawn },
  );
  if (removed.exitCode !== 0) {
    throwGitActionError("Git worktree removal failed", 409);
  }

  const after = await summarizeGitWorktree(workspace);
  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    action: {
      type: "git-worktree",
      worktreeAction: "remove",
      execution: "completed",
      worktreeCreated: false,
      worktreeRemoved: true,
      gitSubprocess: true,
      filesystemWrites: true,
      appServerTouched: false,
      reason: null,
    },
    target: {
      basename: target.basename,
      depth: target.depth,
      pathReturned: false,
    },
    branch: null,
    status: {
      before: summarizeWorktreeCounts(before),
      after: summarizeWorktreeCounts(after),
    },
    safety: before.branchSwitchSafety,
    subprocess: {
      invoked: true,
      command: "git worktree remove",
      exitCode: removed.exitCode,
    },
  };
}

function emptySummary() {
  return {
    isRepository: false,
    gitMetadataType: "absent",
    isLinkedWorktree: false,
    followsLinkedGitDir: false,
    headKind: null,
    branch: null,
    commitShort: null,
    hasRemotes: false,
    remoteCount: 0,
    localBranchCount: 0,
    returnedBranchCount: 0,
    branches: [],
    linkedWorktreeCount: 0,
    returnedLinkedWorktreeCount: 0,
    linkedWorktrees: [],
    statusAvailable: false,
    statusMode: null,
    trackedFileCount: 0,
    checkedTrackedFileCount: 0,
    modifiedTrackedCount: 0,
    missingTrackedCount: 0,
    untrackedTopLevelCount: 0,
    statusTruncated: false,
    branchSwitchSafety: emptyBranchSwitchSafety(),
    branchSwitchAvailable: false,
    commitActionsAvailable: false,
    warnings: [],
  };
}

function emptyBranchSwitchSafety() {
  return {
    hookFileCount: 0,
    filterConfigCount: 0,
    attributesFileCount: 0,
    configExecutionCount: 0,
    hooksPresent: false,
    filtersPresent: false,
    attributesPresent: false,
    configExecutionPresent: false,
    riskPresent: false,
    scanTruncated: false,
    warnings: [],
  };
}

async function readSmallTextFile(path, maxBytes, { optional = false } = {}) {
  try {
    const info = await lstat(path);
    if (info.isSymbolicLink()) {
      return { text: null, warnings: ["git-file-symlink-not-followed"] };
    }
    if (!info.isFile()) {
      return {
        text: null,
        warnings: optional ? [] : ["git-file-not-regular"],
      };
    }
    if (info.size > maxBytes) {
      return { text: null, warnings: ["git-file-too-large"] };
    }
    return {
      text: await readFile(path, "utf8"),
      warnings: [],
    };
  } catch (error) {
    if (optional && error.code === "ENOENT") {
      return { text: null, warnings: [] };
    }
    return { text: null, warnings: ["git-file-unreadable"] };
  }
}

async function readSmallBufferFile(path, maxBytes, { optional = false } = {}) {
  try {
    const info = await lstat(path);
    if (info.isSymbolicLink()) {
      return { buffer: null, warnings: ["git-file-symlink-not-followed"] };
    }
    if (!info.isFile()) {
      return { buffer: null, warnings: optional ? [] : ["git-file-not-regular"] };
    }
    if (info.size > maxBytes) {
      return { buffer: null, warnings: ["git-index-too-large"] };
    }
    return {
      buffer: await readFile(path),
      warnings: [],
    };
  } catch (error) {
    if (optional && error.code === "ENOENT") {
      return { buffer: null, warnings: [] };
    }
    return { buffer: null, warnings: ["git-index-unreadable"] };
  }
}

async function countDirectoryChildren(path) {
  try {
    const info = await lstat(path);
    if (info.isSymbolicLink()) {
      return { count: 0, warnings: ["git-worktrees-symlink-not-followed"] };
    }
    if (!info.isDirectory()) {
      return { count: 0, warnings: [] };
    }
    const entries = await readdir(path, { withFileTypes: true });
    return {
      count: entries.filter((entry) => entry.isDirectory()).length,
      warnings: [],
    };
  } catch (error) {
    if (error.code === "ENOENT") {
      return { count: 0, warnings: [] };
    }
    return { count: 0, warnings: ["git-worktrees-unreadable"] };
  }
}

async function readLocalBranches(gitPath, currentBranch) {
  const warnings = [];
  const branches = new Map();
  const scan = { count: 0, capped: false };

  await collectLooseBranches(join(gitPath, "refs", "heads"), "", branches, warnings, scan);

  const packed = await readSmallTextFile(join(gitPath, "packed-refs"), MAX_PACKED_REFS_BYTES, {
    optional: true,
  });
  warnings.push(...packed.warnings);
  for (const branch of parsePackedBranches(packed.text)) {
    if (!branches.has(branch.name)) {
      branches.set(branch.name, branch.commitShort);
    }
  }

  const items = [...branches.entries()]
    .map(([name, commitShort]) => ({
      name,
      current: name === currentBranch,
      commitShort,
    }))
    .sort((a, b) => Number(b.current) - Number(a.current) || a.name.localeCompare(b.name));

  return {
    count: items.length,
    items: items.slice(0, MAX_RETURNED_BRANCHES),
    warnings: [...new Set(warnings)],
  };
}

async function collectLooseBranches(path, prefix, branches, warnings, scan) {
  let entries;
  try {
    const info = await lstat(path);
    if (info.isSymbolicLink()) {
      warnings.push("git-refs-symlink-not-followed");
      return;
    }
    if (!info.isDirectory()) {
      return;
    }
    entries = await readdir(path, { withFileTypes: true });
  } catch (error) {
    if (error.code !== "ENOENT") {
      warnings.push("git-refs-unreadable");
    }
    return;
  }

  for (const entry of entries) {
    if (scan.count >= MAX_REF_SCAN_ENTRIES) {
      if (!scan.capped) {
        warnings.push("git-refs-scan-capped");
        scan.capped = true;
      }
      return;
    }
    scan.count += 1;

    const child = join(path, entry.name);
    const refName = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) {
      warnings.push("git-ref-symlink-not-followed");
      continue;
    }
    if (entry.isDirectory()) {
      await collectLooseBranches(child, refName, branches, warnings, scan);
      continue;
    }
    if (!entry.isFile()) {
      continue;
    }

    const branchName = cleanRefName(refName);
    if (!branchName) {
      continue;
    }
    const ref = await readSmallTextFile(child, MAX_REF_BYTES, { optional: true });
    warnings.push(...ref.warnings);
    const commitShort = parseCommitShort(ref.text);
    branches.set(branchName, commitShort);
  }
}

function parsePackedBranches(text) {
  if (typeof text !== "string") {
    return [];
  }
  const branches = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line || line.startsWith("#") || line.startsWith("^")) {
      continue;
    }
    const match = line.match(/^([0-9a-f]{40})\s+refs\/heads\/(.+)$/i);
    if (!match) {
      continue;
    }
    const name = cleanRefName(match[2]);
    if (name) {
      branches.push({ name, commitShort: match[1].slice(0, 12) });
    }
  }
  return branches;
}

async function readLinkedWorktrees(path) {
  try {
    const info = await lstat(path);
    if (info.isSymbolicLink()) {
      return { count: 0, items: [], warnings: ["git-worktrees-symlink-not-followed"] };
    }
    if (!info.isDirectory()) {
      return { count: 0, items: [], warnings: [] };
    }
    const entries = await readdir(path, { withFileTypes: true });
    const symlinkCount = entries.filter((entry) => entry.isSymbolicLink()).length;
    const directories = entries.filter((entry) => entry.isDirectory() && !entry.isSymbolicLink());
    const items = [];
    const warnings = symlinkCount > 0 ? ["git-worktree-entry-symlink-not-followed"] : [];
    for (const entry of directories.slice(0, MAX_RETURNED_WORKTREES)) {
      const head = await readSmallTextFile(join(path, entry.name, "HEAD"), MAX_HEAD_BYTES, {
        optional: true,
      });
      warnings.push(...head.warnings);
      const parsedHead = parseHead(head.text);
      items.push({
        label: cleanDisplayText(entry.name, 80) ?? "worktree",
        headKind: parsedHead.kind,
        branch: parsedHead.branch,
        commitShort: parsedHead.commitShort,
        gitDirFollowed: false,
      });
    }
    return {
      count: directories.length,
      items,
      warnings: [...new Set(warnings)],
    };
  } catch (error) {
    if (error.code === "ENOENT") {
      return { count: 0, items: [], warnings: [] };
    }
    return { count: 0, items: [], warnings: ["git-worktrees-unreadable"] };
  }
}

async function readIndexStatus(workspacePath, indexPath) {
  const index = await readSmallBufferFile(indexPath, MAX_INDEX_BYTES, { optional: true });
  const parsed = parseIndexEntries(index.buffer);
  const warnings = [...index.warnings, ...parsed.warnings];
  if (!index.buffer || !parsed.available) {
    return emptyStatus(warnings);
  }

  const entries = parsed.entries.slice(0, MAX_STATUS_CHECKS);
  let checkedTrackedFileCount = 0;
  let modifiedTrackedCount = 0;
  let missingTrackedCount = 0;
  for (const entry of entries) {
    try {
      const info = await lstat(join(workspacePath, entry.path));
      checkedTrackedFileCount += 1;
      if (info.isSymbolicLink()) {
        if (entry.modeType !== "symlink") {
          modifiedTrackedCount += 1;
        }
        continue;
      }
      if (!info.isFile()) {
        modifiedTrackedCount += 1;
        continue;
      }
      const mtimeSeconds = Math.floor(info.mtimeMs / 1000);
      if (entry.fileSize !== info.size || entry.mtimeSeconds !== mtimeSeconds) {
        modifiedTrackedCount += 1;
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        missingTrackedCount += 1;
      } else {
        warnings.push("git-status-file-unreadable");
      }
    }
  }

  const untracked = await countTopLevelUntracked(workspacePath, parsed.trackedTopLevels);
  warnings.push(...untracked.warnings);
  return {
    available: true,
    mode: "index-mtime-size",
    trackedFileCount: parsed.count,
    checkedTrackedFileCount,
    modifiedTrackedCount,
    missingTrackedCount,
    untrackedTopLevelCount: untracked.count,
    truncated:
      parsed.truncated ||
      parsed.count > checkedTrackedFileCount ||
      untracked.truncated,
    warnings: [...new Set(warnings)],
  };
}

async function readBranchSwitchSafety(workspacePath, gitPath, configText) {
  const hooks = await countHookFiles(join(gitPath, "hooks"));
  const attributes = await countAttributeFiles(workspacePath, gitPath);
  const filterConfigCount = countFilterSections(configText);
  const configExecutionCount = countBranchSwitchExecutionConfig(configText);
  const warnings = [...hooks.warnings, ...attributes.warnings];
  const hooksPresent = hooks.count > 0;
  const filtersPresent = filterConfigCount > 0;
  const attributesPresent = attributes.count > 0;
  const configExecutionPresent = configExecutionCount > 0;
  const riskPresent =
    hooksPresent || filtersPresent || attributesPresent || configExecutionPresent;
  return {
    hookFileCount: hooks.count,
    filterConfigCount,
    attributesFileCount: attributes.count,
    configExecutionCount,
    hooksPresent,
    filtersPresent,
    attributesPresent,
    configExecutionPresent,
    riskPresent,
    scanTruncated: attributes.truncated,
    warnings: [
      ...new Set([
        ...warnings,
        ...(riskPresent ? ["git-branch-switch-risk-present"] : []),
        ...(attributes.truncated ? ["git-branch-switch-safety-scan-truncated"] : []),
      ]),
    ],
  };
}

async function countHookFiles(hooksPath) {
  try {
    const info = await lstat(hooksPath);
    if (info.isSymbolicLink()) {
      return { count: 1, warnings: ["git-hooks-symlink-not-followed"] };
    }
    if (!info.isDirectory()) {
      return { count: 0, warnings: [] };
    }
    const entries = await readdir(hooksPath, { withFileTypes: true });
    const count = entries.filter(
      (entry) =>
        (entry.isFile() || entry.isSymbolicLink()) &&
        !entry.name.endsWith(".sample") &&
        !entry.name.startsWith("."),
    ).length;
    return {
      count,
      warnings: entries.some((entry) => entry.isSymbolicLink())
        ? ["git-hook-symlink-not-followed"]
        : [],
    };
  } catch (error) {
    if (error.code === "ENOENT") {
      return { count: 0, warnings: [] };
    }
    return { count: 0, warnings: ["git-hooks-unreadable"] };
  }
}

async function countAttributeFiles(workspacePath, gitPath) {
  const warnings = [];
  let count = 0;
  const infoAttributes = await countFileIfRegular(join(gitPath, "info", "attributes"), {
    symlinkWarning: "git-info-attributes-symlink-not-followed",
    unreadableWarning: "git-info-attributes-unreadable",
  });
  count += infoAttributes.count;
  warnings.push(...infoAttributes.warnings);

  const scan = {
    count: 0,
    truncated: false,
  };
  count += await countWorktreeAttributes(workspacePath, { warnings, scan, depth: 0 });
  return {
    count,
    truncated: scan.truncated,
    warnings: [...new Set(warnings)],
  };
}

async function countFileIfRegular(path, { symlinkWarning, unreadableWarning }) {
  try {
    const info = await lstat(path);
    if (info.isSymbolicLink()) {
      return { count: 1, warnings: [symlinkWarning] };
    }
    return { count: info.isFile() ? 1 : 0, warnings: [] };
  } catch (error) {
    if (error.code === "ENOENT") {
      return { count: 0, warnings: [] };
    }
    return { count: 0, warnings: [unreadableWarning] };
  }
}

async function countWorktreeAttributes(path, { warnings, scan, depth }) {
  if (
    scan.truncated ||
    scan.count >= MAX_BRANCH_SWITCH_SAFETY_SCAN_ENTRIES ||
    depth > MAX_BRANCH_SWITCH_SAFETY_SCAN_DEPTH
  ) {
    scan.truncated = true;
    return 0;
  }

  let entries;
  try {
    entries = await readdir(path, { withFileTypes: true });
  } catch (error) {
    if (error.code !== "ENOENT") {
      warnings.push("git-attributes-scan-unreadable");
    }
    return 0;
  }

  let count = 0;
  for (const entry of entries) {
    if (scan.count >= MAX_BRANCH_SWITCH_SAFETY_SCAN_ENTRIES) {
      scan.truncated = true;
      break;
    }
    scan.count += 1;
    if (entry.name === ".git") {
      continue;
    }
    if (entry.isSymbolicLink()) {
      warnings.push("git-attributes-symlink-not-followed");
      continue;
    }
    const child = join(path, entry.name);
    if (entry.name === ".gitattributes" && entry.isFile()) {
      count += 1;
      continue;
    }
    if (entry.isDirectory() && depth < MAX_BRANCH_SWITCH_SAFETY_SCAN_DEPTH) {
      count += await countWorktreeAttributes(child, {
        warnings,
        scan,
        depth: depth + 1,
      });
    }
  }
  return count;
}

function emptyStatus(warnings = []) {
  return {
    available: false,
    mode: null,
    trackedFileCount: 0,
    checkedTrackedFileCount: 0,
    modifiedTrackedCount: 0,
    missingTrackedCount: 0,
    untrackedTopLevelCount: 0,
    truncated: false,
    warnings: [...new Set(warnings)],
  };
}

function parseIndexEntries(buffer) {
  const warnings = [];
  if (!Buffer.isBuffer(buffer)) {
    return { available: false, count: 0, entries: [], trackedTopLevels: new Set(), truncated: false, warnings };
  }
  if (buffer.length < 12 || buffer.toString("ascii", 0, 4) !== "DIRC") {
    return {
      available: false,
      count: 0,
      entries: [],
      trackedTopLevels: new Set(),
      truncated: false,
      warnings: ["git-index-unrecognized"],
    };
  }
  const version = buffer.readUInt32BE(4);
  if (version !== 2 && version !== 3) {
    return {
      available: false,
      count: 0,
      entries: [],
      trackedTopLevels: new Set(),
      truncated: false,
      warnings: ["git-index-version-unsupported"],
    };
  }

  const declaredCount = buffer.readUInt32BE(8);
  const entries = [];
  const trackedTopLevels = new Set();
  let offset = 12;
  let truncated = declaredCount > MAX_INDEX_ENTRIES;
  const limit = Math.min(declaredCount, MAX_INDEX_ENTRIES);
  for (let index = 0; index < limit; index += 1) {
    if (offset + 62 > buffer.length) {
      warnings.push("git-index-entry-truncated");
      truncated = true;
      break;
    }
    const entryStart = offset;
    const mtimeSeconds = buffer.readUInt32BE(offset + 8);
    const mode = buffer.readUInt32BE(offset + 24);
    const fileSize = buffer.readUInt32BE(offset + 36);
    const flags = buffer.readUInt16BE(offset + 60);
    offset += 62;

    let pathEnd = offset;
    while (pathEnd < buffer.length && buffer[pathEnd] !== 0) {
      pathEnd += 1;
    }
    if (pathEnd >= buffer.length) {
      warnings.push("git-index-path-truncated");
      truncated = true;
      break;
    }
    const rawPath = buffer.toString("utf8", offset, pathEnd);
    offset = pathEnd + 1;
    offset = entryStart + Math.ceil((offset - entryStart) / 8) * 8;

    const path = cleanIndexPath(rawPath, flags);
    if (!path) {
      warnings.push("git-index-path-unsafe");
      continue;
    }
    const topLevel = path.split("/", 1)[0];
    if (topLevel) {
      trackedTopLevels.add(topLevel);
    }
    entries.push({
      path,
      fileSize,
      mtimeSeconds,
      modeType: gitModeType(mode),
    });
  }

  return {
    available: true,
    count: declaredCount,
    entries,
    trackedTopLevels,
    truncated,
    warnings: [...new Set(warnings)],
  };
}

async function countTopLevelUntracked(workspacePath, trackedTopLevels) {
  try {
    const entries = await readdir(workspacePath, { withFileTypes: true });
    let count = 0;
    let scanned = 0;
    let truncated = false;
    for (const entry of entries) {
      if (entry.name === ".git") {
        continue;
      }
      scanned += 1;
      if (scanned > MAX_UNTRACKED_SCAN_ENTRIES) {
        truncated = true;
        break;
      }
      if (entry.isSymbolicLink()) {
        continue;
      }
      if (!trackedTopLevels.has(entry.name)) {
        count += 1;
      }
    }
    return {
      count,
      truncated,
      warnings: truncated ? ["git-untracked-scan-capped"] : [],
    };
  } catch {
    return { count: 0, truncated: false, warnings: ["git-untracked-scan-unavailable"] };
  }
}

function parseGitDirFile(text) {
  if (typeof text !== "string") {
    return false;
  }
  return /^gitdir:\s*\S+/i.test(text.trim());
}

function parseCommitShort(text) {
  if (typeof text !== "string") {
    return null;
  }
  const firstLine = text.split(/\r?\n/, 1)[0]?.trim() ?? "";
  return /^[0-9a-f]{40}$/i.test(firstLine) ? firstLine.slice(0, 12) : null;
}

function parseCommitFull(text) {
  if (typeof text !== "string") {
    return null;
  }
  const firstLine = text.split(/\r?\n/, 1)[0]?.trim() ?? "";
  return /^[0-9a-f]{40}$/i.test(firstLine) ? firstLine.toLowerCase() : null;
}

function parsePackedBranchCommit(text, branch) {
  if (typeof text !== "string") {
    return null;
  }
  for (const line of text.split(/\r?\n/)) {
    if (!line || line.startsWith("#") || line.startsWith("^")) {
      continue;
    }
    const match = line.match(/^([0-9a-f]{40})\s+refs\/heads\/(.+)$/i);
    if (match && cleanRefName(match[2]) === branch) {
      return match[1].toLowerCase();
    }
  }
  return null;
}

function cleanRefName(value) {
  if (typeof value !== "string") {
    return null;
  }
  const clean = value
    .replace(/\\/g, "/")
    .split("/")
    .map((part) => cleanDisplayText(part, 80))
    .filter(Boolean)
    .join("/");
  if (!clean || clean.length > 120) {
    return null;
  }
  if (
    clean.startsWith("/") ||
    clean.endsWith("/") ||
    clean.includes("//") ||
    clean.includes("..") ||
    clean.includes("@{") ||
    clean.endsWith(".lock")
  ) {
    return null;
  }
  if (clean.split("/").some((part) => part === "." || part.startsWith(".") || part.endsWith(".lock"))) {
    return null;
  }
  return clean;
}

function cleanIndexPath(value, flags) {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }
  const expectedLength = flags & 0x0fff;
  if (expectedLength !== 0x0fff && value.length !== expectedLength) {
    return null;
  }
  const clean = value.replace(/\\/g, "/").replace(/[^\x20-\x7E]/g, "");
  if (
    !clean ||
    clean.startsWith("/") ||
    clean.endsWith("/") ||
    clean.includes("//") ||
    clean.includes("..") ||
    clean === ".git" ||
    clean.startsWith(".git/")
  ) {
    return null;
  }
  return clean;
}

function gitModeType(mode) {
  const type = mode & 0o170000;
  if (type === 0o120000) {
    return "symlink";
  }
  if (type === 0o040000) {
    return "tree";
  }
  if (type === 0o160000) {
    return "submodule";
  }
  return "file";
}

function parseHead(text) {
  if (typeof text !== "string") {
    return {
      kind: null,
      branch: null,
      commitShort: null,
    };
  }

  const firstLine = text.split(/\r?\n/, 1)[0]?.trim() ?? "";
  if (firstLine.startsWith("ref:")) {
    const ref = firstLine.slice(4).trim();
    if (ref.startsWith("refs/heads/")) {
      return {
        kind: "branch",
        branch: cleanDisplayText(ref.slice("refs/heads/".length), 120),
        commitShort: null,
      };
    }
    return {
      kind: "ref",
      branch: null,
      commitShort: null,
    };
  }

  if (/^[0-9a-f]{40}$/i.test(firstLine)) {
    return {
      kind: "detached",
      branch: null,
      commitShort: firstLine.slice(0, 12),
    };
  }

  return {
    kind: firstLine ? "unknown" : null,
    branch: null,
    commitShort: null,
  };
}

function countRemoteSections(text) {
  if (typeof text !== "string") {
    return 0;
  }
  const names = new Set();
  for (const match of text.matchAll(/^\s*\[remote\s+"([^"]+)"\]\s*$/gm)) {
    const clean = cleanDisplayText(match[1], 120);
    if (clean) {
      names.add(clean);
    }
  }
  return names.size;
}

function countFilterSections(text) {
  if (typeof text !== "string") {
    return 0;
  }
  const names = new Set();
  for (const match of text.matchAll(/^\s*\[filter\s+"([^"]+)"\]\s*$/gm)) {
    const clean = cleanDisplayText(match[1], 120);
    if (clean) {
      names.add(clean);
    }
  }
  return names.size;
}

function countBranchSwitchExecutionConfig(text) {
  if (typeof text !== "string") {
    return 0;
  }
  let count = 0;
  let section = null;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || line.startsWith(";")) {
      continue;
    }
    const sectionMatch = line.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      section = sectionMatch[1].trim().toLowerCase();
      continue;
    }
    const key = line.split(/[=\s]/, 1)[0]?.trim().toLowerCase();
    if (section === "core" && (key === "hookspath" || key === "fsmonitor")) {
      count += 1;
    }
  }
  return count;
}

function validateBranchActionTarget(value) {
  const clean = cleanRefName(value);
  if (!clean || clean !== value) {
    throwGitActionError("Branch target is invalid", 400);
  }
  return clean;
}

function assertBranchSwitchPreconditions(summary, targetName) {
  if (!summary.isRepository || summary.gitMetadataType !== "directory") {
    throwGitActionError("Git repository is not available for branch switching", 409);
  }
  if (summary.isLinkedWorktree || summary.followsLinkedGitDir) {
    throwGitActionError("Linked Git worktrees are not switchable", 409);
  }
  const target = summary.branches.find((branch) => branch.name === targetName);
  if (!target) {
    throwGitActionError("Branch target was not found in read-only inventory", 404);
  }
  if (!summary.statusAvailable || summary.statusTruncated) {
    throwGitActionError("Git branch switch requires complete clean-status metadata", 409);
  }
  if (summary.warnings.length > 0) {
    throwGitActionError("Git branch switch requires warning-free metadata", 409);
  }
  const changedCount =
    summary.modifiedTrackedCount + summary.missingTrackedCount + summary.untrackedTopLevelCount;
  if (changedCount > 0) {
    throwGitActionError("Git branch switch requires a clean worktree", 409);
  }
  const safety = summary.branchSwitchSafety;
  if (
    safety.riskPresent ||
    safety.scanTruncated ||
    safety.warnings.length > 0 ||
    safety.hookFileCount > 0 ||
    safety.filterConfigCount > 0 ||
    safety.attributesFileCount > 0 ||
    safety.configExecutionCount > 0
  ) {
    throwGitActionError("Git branch switch requires a zero-risk hook/filter/attribute scan", 409);
  }
  return target;
}

function assertBranchCreatePreconditions(summary, targetName) {
  if (!summary.isRepository || summary.gitMetadataType !== "directory") {
    throwGitActionError("Git repository is not available for branch creation", 409);
  }
  if (summary.isLinkedWorktree || summary.followsLinkedGitDir) {
    throwGitActionError("Linked Git worktrees are not writable", 409);
  }
  if (summary.warnings.length > 0) {
    throwGitActionError("Git branch creation requires warning-free metadata", 409);
  }
  if (summary.branches.some((candidate) => candidate.name === targetName)) {
    throwGitActionError("Git branch already exists", 409);
  }
  if (summary.headKind !== "branch" && summary.headKind !== "detached") {
    throwGitActionError("Git branch creation requires a branch or detached HEAD", 409);
  }
}

function assertBranchDeletePreconditions(summary, targetName) {
  if (!summary.isRepository || summary.gitMetadataType !== "directory") {
    throwGitActionError("Git repository is not available for branch deletion", 409);
  }
  if (summary.isLinkedWorktree || summary.followsLinkedGitDir) {
    throwGitActionError("Linked Git worktrees are not writable", 409);
  }
  if (summary.warnings.length > 0) {
    throwGitActionError("Git branch deletion requires warning-free metadata", 409);
  }
  const target = summary.branches.find((candidate) => candidate.name === targetName);
  if (!target) {
    throwGitActionError("Git branch was not found in read-only inventory", 404);
  }
  if (target.current) {
    throwGitActionError("Current branch cannot be deleted", 409);
  }
  if (summary.linkedWorktrees.some((worktree) => worktree.branch === targetName)) {
    throwGitActionError("Branch is checked out by a linked worktree", 409);
  }
  return target;
}

function assertGitCommitPreconditions(summary, sourceCommit) {
  if (!summary.isRepository || summary.gitMetadataType !== "directory") {
    throwGitActionError("Git repository is not available for commit creation", 409);
  }
  if (summary.isLinkedWorktree || summary.followsLinkedGitDir) {
    throwGitActionError("Linked Git worktrees are not writable", 409);
  }
  if (summary.headKind !== "branch" || !cleanRefName(summary.branch)) {
    throwGitActionError("Git commit creation requires a current local branch", 409);
  }
  if (!sourceCommit) {
    throwGitActionError("Git commit creation requires a readable HEAD commit", 409);
  }
  if (!summary.statusAvailable || summary.statusTruncated) {
    throwGitActionError("Git commit creation requires complete clean-status metadata", 409);
  }
  if (summary.warnings.length > 0) {
    throwGitActionError("Git commit creation requires warning-free metadata", 409);
  }
  const changedCount =
    summary.modifiedTrackedCount + summary.missingTrackedCount + summary.untrackedTopLevelCount;
  if (changedCount > 0) {
    throwGitActionError("Git commit creation requires no unstaged or untracked changes", 409);
  }
}

function assertGitWorktreeCreatePreconditions(summary, targetName) {
  if (!summary.isRepository || summary.gitMetadataType !== "directory") {
    throwGitActionError("Git repository is not available for worktree creation", 409);
  }
  if (summary.isLinkedWorktree || summary.followsLinkedGitDir) {
    throwGitActionError("Linked Git worktrees cannot create worktrees", 409);
  }
  if (summary.warnings.length > 0) {
    throwGitActionError("Git worktree creation requires warning-free metadata", 409);
  }
  const target = summary.branches.find((candidate) => candidate.name === targetName);
  if (!target) {
    throwGitActionError("Git worktree branch was not found in read-only inventory", 404);
  }
  if (target.current || summary.linkedWorktrees.some((worktree) => worktree.branch === targetName)) {
    throwGitActionError("Git worktree branch is already checked out", 409);
  }
  const safety = summary.branchSwitchSafety;
  if (
    safety.riskPresent ||
    safety.scanTruncated ||
    safety.warnings.length > 0 ||
    safety.hookFileCount > 0 ||
    safety.filterConfigCount > 0 ||
    safety.attributesFileCount > 0 ||
    safety.configExecutionCount > 0
  ) {
    throwGitActionError("Git worktree creation requires a zero-risk hook/filter/attribute scan", 409);
  }
  return target;
}

function assertGitWorktreeRemovePreconditions(summary) {
  if (!summary.isRepository || summary.gitMetadataType !== "directory") {
    throwGitActionError("Git repository is not available for worktree removal", 409);
  }
  if (summary.isLinkedWorktree || summary.followsLinkedGitDir) {
    throwGitActionError("Linked Git worktrees cannot remove worktrees", 409);
  }
  if (summary.warnings.length > 0) {
    throwGitActionError("Git worktree removal requires warning-free metadata", 409);
  }
}

async function readFullHeadCommit(gitPath, summary) {
  const head = await readSmallTextFile(join(gitPath, "HEAD"), MAX_HEAD_BYTES);
  const parsed = parseHead(head.text);
  if (parsed.kind === "detached" && typeof head.text === "string") {
    return parseCommitFull(head.text);
  }
  const branch = cleanRefName(summary.branch);
  if (!branch) {
    return null;
  }
  const loose = await readSmallTextFile(join(gitPath, "refs", "heads", ...branch.split("/")), MAX_REF_BYTES, {
    optional: true,
  });
  const looseCommit = parseCommitFull(loose.text);
  if (looseCommit) {
    return looseCommit;
  }
  const packed = await readSmallTextFile(join(gitPath, "packed-refs"), MAX_PACKED_REFS_BYTES, {
    optional: true,
  });
  return parsePackedBranchCommit(packed.text, branch);
}

async function ensureSafeRefDirectory(basePath, parts) {
  let current = basePath;
  await ensureDirectoryNoSymlink(current);
  for (const part of parts) {
    current = join(current, part);
    try {
      await ensureDirectoryNoSymlink(current);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
      await mkdir(current, { mode: 0o700 });
      await ensureDirectoryNoSymlink(current);
    }
  }
  return current;
}

async function ensureDirectoryNoSymlink(path) {
  const info = await lstat(path);
  if (info.isSymbolicLink() || !info.isDirectory()) {
    throwGitActionError("Git ref directory is not safely writable", 409);
  }
}

function summarizeSwitchHead(summary) {
  return {
    branch: cleanRefName(summary.branch),
    headKind: summary.headKind,
    commitShort: summary.commitShort,
  };
}

function summarizeSwitchStatus(summary) {
  return {
    statusAvailable: Boolean(summary.statusAvailable),
    changedCount:
      summary.modifiedTrackedCount + summary.missingTrackedCount + summary.untrackedTopLevelCount,
    modifiedTrackedCount: summary.modifiedTrackedCount,
    missingTrackedCount: summary.missingTrackedCount,
    untrackedTopLevelCount: summary.untrackedTopLevelCount,
    statusTruncated: Boolean(summary.statusTruncated),
  };
}

function summarizeWorktreeCounts(summary) {
  return {
    localBranchCount: summary.localBranchCount,
    linkedWorktreeCount: summary.linkedWorktreeCount,
    returnedLinkedWorktreeCount: summary.returnedLinkedWorktreeCount,
  };
}

async function prepareGitWorktreeTarget(workspace, value, { mode }) {
  const target = validateGitWorktreeActionPath(value, workspace.cwd);
  const parentPath = dirname(target.absolutePath);
  const parentParts = target.parts.slice(0, -1);
  if (mode === "create") {
    await ensureSafeWorkspaceDirectory(workspace.cwd, parentParts, { create: true });
    try {
      await lstat(target.absolutePath);
      throwGitActionError("Git worktree target already exists", 409);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
    await ensureDirectoryNoSymlink(parentPath);
    return target;
  }

  await ensureSafeWorkspaceDirectory(workspace.cwd, parentParts, { create: false });
  const targetInfo = await lstat(target.absolutePath).catch((error) => {
    if (error.code === "ENOENT") {
      throwGitActionError("Git worktree target does not exist", 404);
    }
    throwGitActionError("Git worktree target is not safely readable", 409);
  });
  if (targetInfo.isSymbolicLink() || !targetInfo.isDirectory()) {
    throwGitActionError("Git worktree target is not safely removable", 409);
  }
  const gitFile = await readSmallTextFile(join(target.absolutePath, ".git"), MAX_HEAD_BYTES);
  if (!parseGitDirFile(gitFile.text)) {
    throwGitActionError("Git worktree target is not a linked Git worktree", 409);
  }
  return target;
}

async function ensureSafeWorkspaceDirectory(basePath, parts, { create }) {
  let current = basePath;
  await ensureDirectoryNoSymlink(current);
  for (const part of parts) {
    current = join(current, part);
    try {
      await ensureDirectoryNoSymlink(current);
    } catch (error) {
      if (error.code !== "ENOENT" || !create) {
        throw error;
      }
      await mkdir(current, { mode: 0o700 });
      await ensureDirectoryNoSymlink(current);
    }
  }
}

function runGitCommand(args, { cwd, gitBin, timeoutMs, spawn, stdin = null }) {
  return new Promise((resolve, reject) => {
    const child = spawn(gitBin, args, {
      cwd,
      env: safeGitEnv(),
      stdio: stdin === null ? ["ignore", "pipe", "pipe"] : ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) {
        return;
      }
      settled = true;
      child.kill("SIGTERM");
      const error = new Error("Git subprocess timed out");
      error.statusCode = 504;
      reject(error);
    }, timeoutMs);

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout = boundedAppend(stdout, chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr = boundedAppend(stderr, chunk);
    });
    if (stdin !== null) {
      child.stdin.end(stdin, "utf8");
    }
    child.on("error", (error) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      error.statusCode = 502;
      reject(error);
    });
    child.on("exit", (code, signal) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      resolve({
        exitCode: code ?? (signal ? 128 : 1),
        signal,
        stdout,
        stderr,
      });
    });
  });
}

function validateGitCommitMessageInput(value) {
  if (typeof value !== "string") {
    throwGitActionError("Commit message must be a string", 400);
  }
  const normalized = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (normalized.trim().length === 0) {
    throwGitActionError("Commit message is required", 400);
  }
  if (normalized.length > MAX_GIT_COMMIT_MESSAGE_CHARS) {
    throwGitActionError(
      `Commit message must be ${MAX_GIT_COMMIT_MESSAGE_CHARS} characters or fewer`,
      400,
    );
  }
  return normalized;
}

function validateGitWorktreeActionInput(value) {
  const action = cleanDisplayText(value, 40);
  if (!["create", "remove"].includes(action)) {
    throwGitActionError("Git worktree action is unsupported", 400);
  }
  return action;
}

function validateGitWorktreeActionPath(value, workspacePath) {
  if (typeof value !== "string") {
    throwGitActionError("Git worktree path must be a string", 400);
  }
  const clean = value.trim().replace(/\\/g, "/");
  if (clean.length === 0) {
    throwGitActionError("Git worktree path is required", 400);
  }
  if (clean.length > MAX_GIT_WORKTREE_PATH_CHARS) {
    throwGitActionError(
      `Git worktree path must be ${MAX_GIT_WORKTREE_PATH_CHARS} characters or fewer`,
      400,
    );
  }
  if (
    clean.startsWith("/") ||
    /^[A-Za-z]:\//.test(clean) ||
    clean.includes("\0") ||
    clean.includes("//") ||
    clean.includes("..")
  ) {
    throwGitActionError("Git worktree path is invalid", 400);
  }
  const parts = clean.split("/").filter(Boolean);
  if (
    parts.length === 0 ||
    parts.length > 6 ||
    parts.some(
      (part) =>
        part === "." ||
        part.startsWith(".") ||
        part === ".git" ||
        part.startsWith(".git") ||
        part.endsWith(".lock"),
    )
  ) {
    throwGitActionError("Git worktree path is invalid", 400);
  }
  const absolutePath = resolve(workspacePath, ...parts);
  const relativePath = relative(workspacePath, absolutePath);
  if (!relativePath || relativePath.startsWith("..") || relativePath.includes(`..${sep}`)) {
    throwGitActionError("Git worktree path is invalid", 400);
  }
  return {
    absolutePath,
    relativePath,
    parts,
    basename: cleanDisplayText(basename(absolutePath), 80) ?? "worktree",
    depth: parts.length,
  };
}

function boundedAppend(current, chunk) {
  const next = `${current}${chunk}`;
  if (next.length <= MAX_GIT_COMMAND_OUTPUT_BYTES) {
    return next;
  }
  return next.slice(-MAX_GIT_COMMAND_OUTPUT_BYTES);
}

function safeGitEnv() {
  return {
    PATH: process.env.PATH ?? "/usr/bin:/bin",
    HOME: "/nonexistent",
    XDG_CONFIG_HOME: "/nonexistent",
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_CONFIG_GLOBAL: "/dev/null",
    GIT_TERMINAL_PROMPT: "0",
    GIT_ASKPASS: "",
    SSH_ASKPASS: "",
    GIT_EDITOR: ":",
    GIT_SEQUENCE_EDITOR: ":",
    GIT_PAGER: "cat",
    PAGER: "cat",
    GIT_OPTIONAL_LOCKS: "0",
    LANG: "C",
    LC_ALL: "C",
  };
}

function throwGitActionError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
}

function cleanDisplayText(value, maxLength) {
  if (typeof value !== "string") {
    return null;
  }
  const clean = value.replace(/[^\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim();
  if (!clean) {
    return null;
  }
  if (clean.length <= maxLength) {
    return clean;
  }
  return `${clean.slice(0, Math.max(0, maxLength - 3))}...`;
}

function withWarning(summary, warning) {
  return {
    ...summary,
    warnings: [...summary.warnings, warning],
  };
}

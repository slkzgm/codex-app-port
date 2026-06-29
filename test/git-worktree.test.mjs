import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, stat, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import {
  runGitBranchCreate,
  runGitBranchDelete,
  runGitBranchSwitch,
  runGitCommit,
  runGitWorktreeAction,
  summarizeGitWorktree,
} from "../src/workspace/git.mjs";

test("summarizeGitWorktree reads regular git metadata without remote URLs or paths", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "codex-app-port-git-"));
  try {
    await mkdir(join(workspace, ".git", "worktrees", "linked-one"), { recursive: true });
    await mkdir(join(workspace, ".git", "hooks"), { recursive: true });
    await mkdir(join(workspace, ".git", "info"), { recursive: true });
    await mkdir(join(workspace, ".git", "refs", "heads", "feature"), { recursive: true });
    await writeFile(join(workspace, ".git", "HEAD"), "ref: refs/heads/feature/safe\n", "utf8");
    await writeFile(
      join(workspace, ".git", "refs", "heads", "feature", "safe"),
      "1111111111111111111111111111111111111111\n",
      "utf8",
    );
    await writeFile(
      join(workspace, ".git", "refs", "heads", "main"),
      "2222222222222222222222222222222222222222\n",
      "utf8",
    );
    await writeFile(
      join(workspace, ".git", "packed-refs"),
      "# pack-refs with: peeled fully-peeled sorted\n3333333333333333333333333333333333333333 refs/heads/release/packed\n",
      "utf8",
    );
    await writeFile(
      join(workspace, ".git", "worktrees", "linked-one", "HEAD"),
      "ref: refs/heads/release/linked\n",
      "utf8",
    );
    await writeFile(
      join(workspace, ".git", "config"),
      '[core]\n\tfsmonitor = secret-helper\n\thooksPath = /tmp/private-hooks\n[remote "origin"]\n\turl = git@example.test:secret/private.git\n[filter "private-filter"]\n\tprocess = secret-helper\n',
      "utf8",
    );
    await writeFile(join(workspace, ".git", "hooks", "post-checkout"), "echo secret\n", "utf8");
    await writeFile(join(workspace, ".git", "hooks", "pre-commit.sample"), "sample\n", "utf8");
    await writeFile(join(workspace, ".git", "info", "attributes"), "*.bin filter=private-filter\n", "utf8");
    await writeFile(join(workspace, ".gitattributes"), "*.dat filter=private-filter\n", "utf8");
    await writeFile(join(workspace, "clean.txt"), "clean", "utf8");
    await writeFile(join(workspace, "modified.txt"), "changed", "utf8");
    await writeFile(join(workspace, "untracked.txt"), "local", "utf8");
    await writeGitIndex(join(workspace, ".git", "index"), [
      await indexEntry(workspace, "clean.txt"),
      { path: "modified.txt", size: 1, mtimeSeconds: 1 },
      { path: "missing.txt", size: 7, mtimeSeconds: 1 },
    ]);

    const summary = await summarizeGitWorktree({ cwd: workspace });
    assert.equal(summary.isRepository, true);
    assert.equal(summary.gitMetadataType, "directory");
    assert.equal(summary.headKind, "branch");
    assert.equal(summary.branch, "feature/safe");
    assert.equal(summary.remoteCount, 1);
    assert.equal(summary.localBranchCount, 3);
    assert.equal(summary.returnedBranchCount, 3);
    assert.deepEqual(
      summary.branches.find((branch) => branch.name === "feature/safe"),
      { name: "feature/safe", current: true, commitShort: "111111111111" },
    );
    assert.deepEqual(
      summary.branches.find((branch) => branch.name === "release/packed"),
      { name: "release/packed", current: false, commitShort: "333333333333" },
    );
    assert.equal(summary.linkedWorktreeCount, 1);
    assert.equal(summary.returnedLinkedWorktreeCount, 1);
    assert.deepEqual(summary.linkedWorktrees[0], {
      label: "linked-one",
      headKind: "branch",
      branch: "release/linked",
      commitShort: null,
      gitDirFollowed: false,
    });
    assert.equal(summary.branchSwitchAvailable, false);
    assert.deepEqual(summary.branchSwitchSafety, {
      hookFileCount: 1,
      filterConfigCount: 1,
      attributesFileCount: 2,
      configExecutionCount: 2,
      hooksPresent: true,
      filtersPresent: true,
      attributesPresent: true,
      configExecutionPresent: true,
      riskPresent: true,
      scanTruncated: false,
      warnings: ["git-branch-switch-risk-present"],
    });
    assert.equal(summary.commitActionsAvailable, false);
    assert.equal(summary.statusAvailable, true);
    assert.equal(summary.statusMode, "index-mtime-size");
    assert.equal(summary.trackedFileCount, 3);
    assert.equal(summary.checkedTrackedFileCount, 2);
    assert.equal(summary.modifiedTrackedCount, 1);
    assert.equal(summary.missingTrackedCount, 1);
    assert.equal(summary.untrackedTopLevelCount, 2);
    const serialized = JSON.stringify(summary);
    assert.equal(serialized.includes(workspace), false);
    assert.equal(serialized.includes("git@example.test"), false);
    assert.equal(serialized.includes("secret/private"), false);
    assert.equal(serialized.includes("secret-helper"), false);
    assert.equal(serialized.includes("post-checkout"), false);
    assert.equal(serialized.includes("private-filter"), false);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test("runGitBranchSwitch switches only clean zero-risk repositories", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "codex-app-port-git-switch-"));
  try {
    await runGit(workspace, ["init", "-q"]);
    await runGit(workspace, ["config", "user.email", "test@example.invalid"]);
    await runGit(workspace, ["config", "user.name", "Codex App Port Test"]);
    await writeFile(join(workspace, "tracked.txt"), "main\n", "utf8");
    await runGit(workspace, ["add", "tracked.txt"]);
    await runGit(workspace, ["commit", "-q", "-m", "main"]);
    await runGit(workspace, ["branch", "-M", "main"]);
    await runGit(workspace, ["branch", "release/api"]);

    const result = await runGitBranchSwitch({
      workspace: { cwd: workspace },
      branch: "release/api",
      timeoutMs: 10_000,
    });
    assert.equal(result.ok, true);
    assert.equal(result.action.execution, "completed");
    assert.equal(result.action.branchSwitchExecuted, true);
    assert.equal(result.action.gitSubprocess, true);
    assert.equal(result.action.filesystemWrites, true);
    assert.equal(result.before.branch, "main");
    assert.equal(result.after.branch, "release/api");
    assert.equal(result.status.before.changedCount, 0);
    assert.equal(result.status.after.changedCount, 0);
    assert.equal(result.subprocess.command, "git switch");
    assert.equal(JSON.stringify(result).includes(workspace), false);

    await writeFile(join(workspace, "local.txt"), "dirty\n", "utf8");
    await assert.rejects(
      () =>
        runGitBranchSwitch({
          workspace: { cwd: workspace },
          branch: "main",
          timeoutMs: 10_000,
        }),
      /clean worktree/,
    );
    const summary = await summarizeGitWorktree({ cwd: workspace });
    assert.equal(summary.branch, "release/api");
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test("runGitBranchCreate writes a local branch ref without a git subprocess", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "codex-app-port-git-create-"));
  try {
    await runGit(workspace, ["init", "-q"]);
    await runGit(workspace, ["config", "user.email", "test@example.invalid"]);
    await runGit(workspace, ["config", "user.name", "Codex App Port Test"]);
    await writeFile(join(workspace, "tracked.txt"), "main\n", "utf8");
    await runGit(workspace, ["add", "tracked.txt"]);
    await runGit(workspace, ["commit", "-q", "-m", "main"]);
    await runGit(workspace, ["branch", "-M", "main"]);

    const result = await runGitBranchCreate({
      workspace: { cwd: workspace },
      branch: "feature/local",
    });
    assert.equal(result.ok, true);
    assert.equal(result.action.execution, "completed");
    assert.equal(result.action.branchCreated, true);
    assert.equal(result.action.refWrite, true);
    assert.equal(result.action.gitSubprocess, false);
    assert.equal(result.action.filesystemWrites, true);
    assert.equal(result.target.branch, "feature/local");
    assert.equal(result.source.branch, "main");
    assert.equal(result.status.before.localBranchCount, 1);
    assert.equal(result.status.after.localBranchCount, 2);
    assert.equal(result.subprocess.invoked, false);
    assert.equal(JSON.stringify(result).includes(workspace), false);

    const summary = await summarizeGitWorktree({ cwd: workspace });
    assert.equal(
      summary.branches.some((branch) => branch.name === "feature/local"),
      true,
    );
    await assert.rejects(
      () =>
        runGitBranchCreate({
          workspace: { cwd: workspace },
          branch: "feature/local",
        }),
      /already exists/,
    );
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test("runGitBranchDelete removes only a non-current loose local branch ref", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "codex-app-port-git-delete-"));
  try {
    await runGit(workspace, ["init", "-q"]);
    await runGit(workspace, ["config", "user.email", "test@example.invalid"]);
    await runGit(workspace, ["config", "user.name", "Codex App Port Test"]);
    await writeFile(join(workspace, "tracked.txt"), "main\n", "utf8");
    await runGit(workspace, ["add", "tracked.txt"]);
    await runGit(workspace, ["commit", "-q", "-m", "main"]);
    await runGit(workspace, ["branch", "-M", "main"]);
    await runGit(workspace, ["branch", "feature/local"]);

    const result = await runGitBranchDelete({
      workspace: { cwd: workspace },
      branch: "feature/local",
    });
    assert.equal(result.ok, true);
    assert.equal(result.action.execution, "completed");
    assert.equal(result.action.branchDeleted, true);
    assert.equal(result.action.refDelete, true);
    assert.equal(result.action.gitSubprocess, false);
    assert.equal(result.action.filesystemWrites, true);
    assert.equal(result.target.branch, "feature/local");
    assert.equal(result.status.before.localBranchCount, 2);
    assert.equal(result.status.after.localBranchCount, 1);
    assert.equal(result.subprocess.invoked, false);
    assert.equal(JSON.stringify(result).includes(workspace), false);

    const summary = await summarizeGitWorktree({ cwd: workspace });
    assert.equal(
      summary.branches.some((branch) => branch.name === "feature/local"),
      false,
    );
    await assert.rejects(
      () =>
        runGitBranchDelete({
          workspace: { cwd: workspace },
          branch: "main",
        }),
      /Current branch cannot be deleted/,
    );
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test("runGitCommit creates a commit only from staged clean worktrees", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "codex-app-port-git-commit-"));
  try {
    await runGit(workspace, ["init", "-q"]);
    await runGit(workspace, ["config", "user.email", "test@example.invalid"]);
    await runGit(workspace, ["config", "user.name", "Codex App Port Test"]);
    await writeFile(join(workspace, "tracked.txt"), "main\n", "utf8");
    await runGit(workspace, ["add", "tracked.txt"]);
    await runGit(workspace, ["commit", "-q", "-m", "main"]);
    await runGit(workspace, ["branch", "-M", "main"]);

    await writeFile(join(workspace, "tracked.txt"), "next\n", "utf8");
    await runGit(workspace, ["add", "tracked.txt"]);
    const before = await summarizeGitWorktree({ cwd: workspace });
    assert.equal(before.modifiedTrackedCount, 0);
    assert.equal(before.untrackedTopLevelCount, 0);

    const result = await runGitCommit({
      workspace: { cwd: workspace },
      message: "safe subject\n\nsafe body",
      timeoutMs: 10_000,
    });
    assert.equal(result.ok, true);
    assert.equal(result.action.execution, "completed");
    assert.equal(result.action.commitCreated, true);
    assert.equal(result.action.gitSubprocess, true);
    assert.equal(result.action.objectWrites, true);
    assert.equal(result.action.refWrites, true);
    assert.equal(result.action.filesystemWrites, true);
    assert.equal(result.source.branch, "main");
    assert.equal(result.result.branch, "main");
    assert.notEqual(result.result.commitShort, result.result.previousCommitShort);
    assert.equal(result.message.charCount, 23);
    assert.equal(result.message.textReturned, false);
    assert.equal(result.status.before.changedCount, 0);
    assert.equal(result.status.after.changedCount, 0);
    assert.equal(result.subprocess.command, "git commit");
    const serialized = JSON.stringify(result);
    assert.equal(serialized.includes(workspace), false);
    assert.equal(serialized.includes("safe subject"), false);
    assert.equal(serialized.includes("safe body"), false);

    await assert.rejects(
      () =>
        runGitCommit({
          workspace: { cwd: workspace },
          message: "no staged changes",
          timeoutMs: 10_000,
        }),
      /staged changes/,
    );
    await writeFile(join(workspace, "untracked.txt"), "local\n", "utf8");
    await writeFile(join(workspace, "tracked.txt"), "dirty\n", "utf8");
    await runGit(workspace, ["add", "tracked.txt"]);
    await assert.rejects(
      () =>
        runGitCommit({
          workspace: { cwd: workspace },
          message: "blocked dirty",
          timeoutMs: 10_000,
        }),
      /unstaged or untracked/,
    );
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test("runGitWorktreeAction creates and removes linked worktrees behind safe path policy", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "codex-app-port-git-worktree-action-"));
  try {
    await runGit(workspace, ["init", "-q"]);
    await runGit(workspace, ["config", "user.email", "test@example.invalid"]);
    await runGit(workspace, ["config", "user.name", "Codex App Port Test"]);
    await writeFile(join(workspace, "tracked.txt"), "main\n", "utf8");
    await runGit(workspace, ["add", "tracked.txt"]);
    await runGit(workspace, ["commit", "-q", "-m", "main"]);
    await runGit(workspace, ["branch", "-M", "main"]);
    await runGit(workspace, ["branch", "feature/worktree"]);

    const created = await runGitWorktreeAction({
      workspace: { cwd: workspace },
      action: "create",
      path: "worktrees/local",
      branch: "feature/worktree",
      timeoutMs: 10_000,
    });
    assert.equal(created.ok, true);
    assert.equal(created.action.execution, "completed");
    assert.equal(created.action.worktreeAction, "create");
    assert.equal(created.action.worktreeCreated, true);
    assert.equal(created.action.gitSubprocess, true);
    assert.equal(created.action.filesystemWrites, true);
    assert.deepEqual(created.target, {
      basename: "local",
      depth: 2,
      pathReturned: false,
    });
    assert.equal(created.branch.branch, "feature/worktree");
    assert.equal(created.status.before.linkedWorktreeCount, 0);
    assert.equal(created.status.after.linkedWorktreeCount, 1);
    assert.equal(created.subprocess.command, "git worktree add");
    let serialized = JSON.stringify(created);
    assert.equal(serialized.includes(workspace), false);
    assert.equal(serialized.includes("worktrees/local"), false);

    const removed = await runGitWorktreeAction({
      workspace: { cwd: workspace },
      action: "remove",
      path: "worktrees/local",
      timeoutMs: 10_000,
    });
    assert.equal(removed.ok, true);
    assert.equal(removed.action.execution, "completed");
    assert.equal(removed.action.worktreeAction, "remove");
    assert.equal(removed.action.worktreeRemoved, true);
    assert.equal(removed.target.basename, "local");
    assert.equal(removed.status.before.linkedWorktreeCount, 1);
    assert.equal(removed.status.after.linkedWorktreeCount, 0);
    assert.equal(removed.subprocess.command, "git worktree remove");
    serialized = JSON.stringify(removed);
    assert.equal(serialized.includes(workspace), false);
    assert.equal(serialized.includes("worktrees/local"), false);

    await writeFile(join(workspace, ".gitattributes"), "*.bin filter=unsafe\n", "utf8");
    await assert.rejects(
      () =>
        runGitWorktreeAction({
          workspace: { cwd: workspace },
          action: "create",
          path: "worktrees/risky",
          branch: "feature/worktree",
          timeoutMs: 10_000,
        }),
      /warning-free|zero-risk/,
    );
    await assert.rejects(
      () =>
        runGitWorktreeAction({
          workspace: { cwd: workspace },
          action: "remove",
          path: "../outside",
          timeoutMs: 10_000,
        }),
      /path is invalid/,
    );
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

function runGit(cwd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn("git", args, {
      cwd,
      env: {
        PATH: process.env.PATH ?? "/usr/bin:/bin",
        HOME: "/nonexistent",
        XDG_CONFIG_HOME: "/nonexistent",
        GIT_CONFIG_NOSYSTEM: "1",
        GIT_CONFIG_GLOBAL: "/dev/null",
        GIT_TERMINAL_PROMPT: "0",
      },
      stdio: ["ignore", "ignore", "pipe"],
    });
    let stderr = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`git ${args[0]} failed with ${code}: ${stderr}`));
      }
    });
  });
}

async function indexEntry(workspace, path) {
  const info = await stat(join(workspace, path));
  return {
    path,
    size: info.size,
    mtimeSeconds: Math.floor(info.mtimeMs / 1000),
  };
}

async function writeGitIndex(path, entries) {
  const header = Buffer.alloc(12);
  header.write("DIRC", 0, "ascii");
  header.writeUInt32BE(2, 4);
  header.writeUInt32BE(entries.length, 8);
  const chunks = [header];
  for (const entry of entries) {
    const pathBytes = Buffer.from(entry.path, "utf8");
    const record = Buffer.alloc(62);
    record.writeUInt32BE(entry.mtimeSeconds, 8);
    record.writeUInt32BE(0o100644, 24);
    record.writeUInt32BE(entry.size, 36);
    record.writeUInt16BE(pathBytes.length, 60);
    const raw = Buffer.concat([record, pathBytes, Buffer.from([0])]);
    const padding = Buffer.alloc((8 - (raw.length % 8)) % 8);
    chunks.push(raw, padding);
  }
  await writeFile(path, Buffer.concat(chunks));
}

test("summarizeGitWorktree detects linked worktrees without following gitdir", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "codex-app-port-git-linked-"));
  try {
    await writeFile(
      join(workspace, ".git"),
      "gitdir: /tmp/private/main/.git/worktrees/linked\n",
      "utf8",
    );

    const summary = await summarizeGitWorktree({ cwd: workspace });
    assert.equal(summary.isRepository, true);
    assert.equal(summary.gitMetadataType, "file");
    assert.equal(summary.isLinkedWorktree, true);
    assert.equal(summary.followsLinkedGitDir, false);
    assert.equal(summary.headKind, null);
    assert.equal(summary.warnings.includes("linked-gitdir-not-followed"), true);
    const serialized = JSON.stringify(summary);
    assert.equal(serialized.includes("/tmp/private"), false);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test("summarizeGitWorktree refuses symlink git metadata", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "codex-app-port-git-symlink-"));
  const target = await mkdtemp(join(tmpdir(), "codex-app-port-git-target-"));
  try {
    await symlink(target, join(workspace, ".git"));

    const summary = await summarizeGitWorktree({ cwd: workspace });
    assert.equal(summary.isRepository, false);
    assert.equal(summary.gitMetadataType, "symlink");
    assert.equal(summary.warnings.includes("git-metadata-symlink-not-followed"), true);
    assert.equal(JSON.stringify(summary).includes(target), false);
  } finally {
    await rm(workspace, { recursive: true, force: true });
    await rm(target, { recursive: true, force: true });
  }
});

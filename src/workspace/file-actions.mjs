import { constants as fsConstants } from "node:fs";
import { copyFile, lstat, mkdir, open, rmdir, unlink } from "node:fs/promises";
import { basename, dirname, join, relative, resolve, sep } from "node:path";

export const MAX_FILE_ACTION_PATH_CHARS = 1_000;
export const MAX_FILE_ACTION_CONTENT_CHARS = 4_000;
export const MAX_FILE_COPY_BYTES = 1024 * 1024;

export async function runFileAction({
  workspace,
  action,
  path,
  content = null,
  sourcePath = null,
  targetPath = null,
} = {}) {
  if (!workspace || typeof workspace.cwd !== "string") {
    throwFileActionError("Workspace is required for file actions", 400);
  }
  const fileAction = validateFileActionType(action);
  switch (fileAction) {
    case "writeFile":
      return runWriteFileAction({ workspace, path, content });
    case "remove":
      return runRemoveAction({ workspace, path });
    case "copy":
      return runCopyAction({ workspace, sourcePath, targetPath });
    case "createDirectory":
      return runCreateDirectoryAction({ workspace, path });
    default:
      throwFileActionError("File action is unsupported", 400);
  }
}

async function runWriteFileAction({ workspace, path, content }) {
  const target = validateFileActionPath(path, workspace.cwd, { label: "Target path" });
  const fileContent = validateFileActionContent(content);
  await ensureSafeParent(workspace.cwd, target.parts);
  await ensureWritableFileTarget(target.absolutePath);
  const handle = await open(
    target.absolutePath,
    fsConstants.O_WRONLY |
      fsConstants.O_CREAT |
      fsConstants.O_TRUNC |
      noFollowFlag(),
    0o600,
  );
  try {
    await handle.writeFile(fileContent, "utf8");
  } finally {
    await handle.close();
  }
  return buildFileActionResult({
    action: "writeFile",
    target,
    source: null,
    content: fileContent,
    filesystem: {
      wroteFile: true,
      removed: false,
      copied: false,
      createdDirectory: false,
    },
  });
}

async function runRemoveAction({ workspace, path }) {
  const target = validateFileActionPath(path, workspace.cwd, { label: "Target path" });
  await ensureSafeParent(workspace.cwd, target.parts);
  const info = await safeLstat(target.absolutePath, "File action target does not exist");
  if (info.isSymbolicLink()) {
    throwFileActionError("File action target must not be a symlink", 409);
  }
  if (info.isFile()) {
    await unlink(target.absolutePath);
  } else if (info.isDirectory()) {
    await rmdir(target.absolutePath);
  } else {
    throwFileActionError("File action target is unsupported", 409);
  }
  return buildFileActionResult({
    action: "remove",
    target,
    source: null,
    content: null,
    filesystem: {
      wroteFile: false,
      removed: true,
      copied: false,
      createdDirectory: false,
    },
  });
}

async function runCopyAction({ workspace, sourcePath, targetPath }) {
  const source = validateFileActionPath(sourcePath, workspace.cwd, { label: "Source path" });
  const target = validateFileActionPath(targetPath, workspace.cwd, { label: "Target path" });
  await ensureSafeParent(workspace.cwd, source.parts);
  await ensureSafeParent(workspace.cwd, target.parts);
  const sourceInfo = await safeLstat(source.absolutePath, "File action source does not exist");
  if (sourceInfo.isSymbolicLink() || !sourceInfo.isFile()) {
    throwFileActionError("File action source must be a regular file", 409);
  }
  if (sourceInfo.size > MAX_FILE_COPY_BYTES) {
    throwFileActionError("File action source is too large to copy", 413);
  }
  await assertTargetMissing(target.absolutePath);
  await copyFile(source.absolutePath, target.absolutePath, fsConstants.COPYFILE_EXCL);
  return buildFileActionResult({
    action: "copy",
    target,
    source,
    content: null,
    filesystem: {
      wroteFile: false,
      removed: false,
      copied: true,
      createdDirectory: false,
    },
  });
}

async function runCreateDirectoryAction({ workspace, path }) {
  const target = validateFileActionPath(path, workspace.cwd, { label: "Target path" });
  await ensureSafeParent(workspace.cwd, target.parts);
  await assertTargetMissing(target.absolutePath);
  await mkdir(target.absolutePath, { mode: 0o700 });
  return buildFileActionResult({
    action: "createDirectory",
    target,
    source: null,
    content: null,
    filesystem: {
      wroteFile: false,
      removed: false,
      copied: false,
      createdDirectory: true,
    },
  });
}

function buildFileActionResult({ action, target, source, content, filesystem }) {
  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    action: {
      type: "file-action",
      fileAction: action,
      method: fileActionMethod(action),
      execution: "completed",
      filesystemWrites: true,
      appServerTouched: false,
      reason: null,
    },
    target: publicPathMetadata(target),
    source: source ? publicPathMetadata(source) : null,
    content: {
      present: content !== null,
      charCount: content?.length ?? 0,
      lineCount: content ? content.split(/\r\n|\r|\n/).length : 0,
      textReturned: false,
    },
    filesystem,
  };
}

function validateFileActionType(value) {
  const action = cleanDisplayText(value, 40);
  if (!["writeFile", "remove", "copy", "createDirectory"].includes(action)) {
    throwFileActionError("File action is unsupported", 400);
  }
  return action;
}

function validateFileActionPath(value, workspacePath, { label }) {
  if (typeof value !== "string") {
    throwFileActionError(`${label} must be a string`, 400);
  }
  const clean = value.trim().replace(/\\/g, "/");
  if (clean.length === 0) {
    throwFileActionError(`${label} is required`, 400);
  }
  if (clean.length > MAX_FILE_ACTION_PATH_CHARS) {
    throwFileActionError(`${label} must be ${MAX_FILE_ACTION_PATH_CHARS} characters or fewer`, 400);
  }
  if (
    clean.startsWith("/") ||
    /^[A-Za-z]:\//.test(clean) ||
    clean.includes("\0") ||
    clean.includes("//") ||
    clean.includes("..")
  ) {
    throwFileActionError(`${label} is invalid`, 400);
  }
  const parts = clean.split("/").filter(Boolean);
  if (
    parts.length === 0 ||
    parts.some(
      (part) =>
        part === "." ||
        part.startsWith(".") ||
        part === ".git" ||
        part.startsWith(".git") ||
        part.endsWith(".lock"),
    )
  ) {
    throwFileActionError(`${label} is invalid`, 400);
  }
  const absolutePath = resolve(workspacePath, ...parts);
  const relativePath = relative(workspacePath, absolutePath);
  if (!relativePath || relativePath.startsWith("..") || relativePath.includes(`..${sep}`)) {
    throwFileActionError(`${label} is invalid`, 400);
  }
  return {
    absolutePath,
    relativePath,
    parts,
    basename: cleanDisplayText(basename(absolutePath), 80) ?? "file",
    depth: parts.length,
  };
}

function validateFileActionContent(value) {
  if (typeof value !== "string") {
    throwFileActionError("File content must be a string", 400);
  }
  if (value.length > MAX_FILE_ACTION_CONTENT_CHARS) {
    throwFileActionError(
      `File content must be ${MAX_FILE_ACTION_CONTENT_CHARS} characters or fewer`,
      400,
    );
  }
  return value;
}

async function ensureSafeParent(workspacePath, parts) {
  let current = workspacePath;
  await ensureDirectoryNoSymlink(current);
  for (const part of parts.slice(0, -1)) {
    current = join(current, part);
    await ensureDirectoryNoSymlink(current);
  }
}

async function ensureDirectoryNoSymlink(path) {
  const info = await safeLstat(path, "File action parent does not exist");
  if (info.isSymbolicLink() || !info.isDirectory()) {
    throwFileActionError("File action parent is not a safe directory", 409);
  }
}

async function ensureWritableFileTarget(path) {
  try {
    const info = await lstat(path);
    if (info.isSymbolicLink() || !info.isFile()) {
      throwFileActionError("File action target must be a regular file", 409);
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    }
    throw error;
  }
}

async function assertTargetMissing(path) {
  try {
    await lstat(path);
    throwFileActionError("File action target already exists", 409);
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    }
    throw error;
  }
}

async function safeLstat(path, missingMessage) {
  try {
    return await lstat(path);
  } catch (error) {
    if (error.code === "ENOENT") {
      throwFileActionError(missingMessage, 404);
    }
    throwFileActionError("File action path is not safely readable", 409);
  }
}

function publicPathMetadata(pathInfo) {
  return {
    basename: pathInfo.basename,
    depth: pathInfo.depth,
    pathReturned: false,
  };
}

function fileActionMethod(action) {
  switch (action) {
    case "writeFile":
      return "fs/writeFile";
    case "remove":
      return "fs/remove";
    case "copy":
      return "fs/copy";
    case "createDirectory":
      return "fs/createDirectory";
    default:
      return null;
  }
}

function noFollowFlag() {
  return Number.isInteger(fsConstants.O_NOFOLLOW) ? fsConstants.O_NOFOLLOW : 0;
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

function throwFileActionError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
}

import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { runFileAction } from "../src/workspace/file-actions.mjs";

test("runFileAction mutates only safe workspace-relative paths", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "codex-app-port-file-actions-"));
  try {
    await mkdir(join(workspace, "src"), { recursive: true });
    await mkdir(join(workspace, "dist"), { recursive: true });
    await writeFile(join(workspace, "src", "input.txt"), "copy me\n", "utf8");

    const write = await runFileAction({
      workspace: { cwd: workspace },
      action: "writeFile",
      path: "src/output.txt",
      content: "token=sk-proj-secret\nSensitive body",
    });
    assert.equal(write.ok, true);
    assert.equal(write.action.execution, "completed");
    assert.equal(write.action.fileAction, "writeFile");
    assert.equal(write.action.filesystemWrites, true);
    assert.equal(write.target.basename, "output.txt");
    assert.equal(write.target.pathReturned, false);
    assert.equal(write.content.charCount, 35);
    assert.equal(write.content.textReturned, false);
    assert.equal(await readFile(join(workspace, "src", "output.txt"), "utf8"), "token=sk-proj-secret\nSensitive body");
    let serialized = JSON.stringify(write);
    assert.equal(serialized.includes(workspace), false);
    assert.equal(serialized.includes("src/output.txt"), false);
    assert.equal(serialized.includes("sk-proj-secret"), false);
    assert.equal(serialized.includes("Sensitive body"), false);

    const copy = await runFileAction({
      workspace: { cwd: workspace },
      action: "copy",
      sourcePath: "src/input.txt",
      targetPath: "dist/copied.txt",
    });
    assert.equal(copy.action.fileAction, "copy");
    assert.equal(copy.source.basename, "input.txt");
    assert.equal(copy.target.basename, "copied.txt");
    assert.equal(await readFile(join(workspace, "dist", "copied.txt"), "utf8"), "copy me\n");
    serialized = JSON.stringify(copy);
    assert.equal(serialized.includes("src/input.txt"), false);
    assert.equal(serialized.includes("dist/copied.txt"), false);

    const directory = await runFileAction({
      workspace: { cwd: workspace },
      action: "createDirectory",
      path: "dist/local-dir",
    });
    assert.equal(directory.action.fileAction, "createDirectory");
    assert.equal(directory.filesystem.createdDirectory, true);
    assert.equal(directory.target.basename, "local-dir");

    const removeFile = await runFileAction({
      workspace: { cwd: workspace },
      action: "remove",
      path: "dist/copied.txt",
    });
    assert.equal(removeFile.action.fileAction, "remove");
    assert.equal(removeFile.filesystem.removed, true);

    const removeDirectory = await runFileAction({
      workspace: { cwd: workspace },
      action: "remove",
      path: "dist/local-dir",
    });
    assert.equal(removeDirectory.action.fileAction, "remove");
    assert.equal(removeDirectory.filesystem.removed, true);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test("runFileAction rejects traversal, hidden paths, symlinks, and unsafe copies", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "codex-app-port-file-actions-reject-"));
  const outside = await mkdtemp(join(tmpdir(), "codex-app-port-file-outside-"));
  try {
    await mkdir(join(workspace, "src"), { recursive: true });
    await writeFile(join(workspace, "src", "input.txt"), "copy me\n", "utf8");
    await symlink(outside, join(workspace, "src", "linked-dir"));
    await symlink(join(workspace, "src", "input.txt"), join(workspace, "src", "linked-file"));

    await assert.rejects(
      () =>
        runFileAction({
          workspace: { cwd: workspace },
          action: "writeFile",
          path: "../outside.txt",
          content: "no",
        }),
      /path is invalid/,
    );
    await assert.rejects(
      () =>
        runFileAction({
          workspace: { cwd: workspace },
          action: "writeFile",
          path: ".env",
          content: "no",
        }),
      /path is invalid/,
    );
    await assert.rejects(
      () =>
        runFileAction({
          workspace: { cwd: workspace },
          action: "writeFile",
          path: "src/linked-dir/file.txt",
          content: "no",
        }),
      /parent is not a safe directory/,
    );
    await assert.rejects(
      () =>
        runFileAction({
          workspace: { cwd: workspace },
          action: "remove",
          path: "src/linked-file",
        }),
      /must not be a symlink/,
    );
    await assert.rejects(
      () =>
        runFileAction({
          workspace: { cwd: workspace },
          action: "copy",
          sourcePath: "src/linked-file",
          targetPath: "src/copied.txt",
        }),
      /source must be a regular file/,
    );
    await assert.rejects(
      () =>
        runFileAction({
          workspace: { cwd: workspace },
          action: "copy",
          sourcePath: "src/input.txt",
          targetPath: "src/input.txt",
        }),
      /target already exists/,
    );
  } finally {
    await rm(workspace, { recursive: true, force: true });
    await rm(outside, { recursive: true, force: true });
  }
});

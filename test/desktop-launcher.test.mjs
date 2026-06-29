import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildDesktopServerOptions,
  openUrl,
  parseLauncherArgs,
} from "../src/desktop/launcher.mjs";

test("parseLauncherArgs defaults to safe loopback launch", () => {
  const options = parseLauncherArgs([], {});
  assert.equal(options.host, "127.0.0.1");
  assert.equal(options.port, 14570);
  assert.equal(options.codexBin, "codex");
  assert.equal(options.open, true);
  assert.deepEqual(options.workspaceInputs, []);
  assert.deepEqual(options.projectRootInputs, []);
  assert.equal(options.approvalAuditLogPath, null);
  assert.equal(options.actionAuditLogPath, null);
});

test("parseLauncherArgs supports no-open, audit logs, and numeric options", () => {
  const options = parseLauncherArgs(
    [
      "--no-open",
      "--port",
      "14590",
      "--timeout-ms",
      "1234",
      "--thread-limit",
      "2",
      "--workspace",
      "/tmp/workspace",
      "--project-root",
      "/tmp/projects",
      "--approval-audit-log",
      "/tmp/approval-decisions.jsonl",
      "--action-audit-log",
      "/tmp/actions.jsonl",
    ],
    {},
  );
  assert.equal(options.open, false);
  assert.equal(options.port, 14590);
  assert.equal(options.timeoutMs, 1234);
  assert.equal(options.threadLimit, 2);
  assert.deepEqual(options.workspaceInputs, ["/tmp/workspace"]);
  assert.deepEqual(options.projectRootInputs, ["/tmp/projects"]);
  assert.equal(options.approvalAuditLogPath, "/tmp/approval-decisions.jsonl");
  assert.equal(options.actionAuditLogPath, "/tmp/actions.jsonl");
});

test("parseLauncherArgs accepts desktop audit log paths from environment", () => {
  const options = parseLauncherArgs([], {
    CODEX_APP_PORT_APPROVAL_AUDIT_LOG: "/tmp/env-approval.jsonl",
    CODEX_APP_PORT_ACTION_AUDIT_LOG: "/tmp/env-actions.jsonl",
  });
  assert.equal(options.approvalAuditLogPath, "/tmp/env-approval.jsonl");
  assert.equal(options.actionAuditLogPath, "/tmp/env-actions.jsonl");
});

test("buildDesktopServerOptions injects persistent audit logs into the desktop server", () => {
  const options = parseLauncherArgs(
    [
      "--codex",
      "/usr/bin/codex",
      "--workspace",
      "/tmp/workspace",
      "--project-root",
      "/tmp/projects",
      "--approval-audit-log",
      "/tmp/approval-decisions.jsonl",
      "--action-audit-log",
      "/tmp/actions.jsonl",
    ],
    {},
  );
  const factoryCalls = [];
  const serverOptions = buildDesktopServerOptions(options, {
    cwd: "/tmp/current",
    createApprovalAuditLogFn(factoryOptions) {
      factoryCalls.push({ type: "approval", options: factoryOptions });
      return { persistent: true, kind: "approval" };
    },
    createActionAuditLogFn(factoryOptions) {
      factoryCalls.push({ type: "action", options: factoryOptions });
      return { persistent: true, kind: "action" };
    },
  });

  assert.equal(serverOptions.codexBin, "/usr/bin/codex");
  assert.equal(serverOptions.cwd, "/tmp/current");
  assert.deepEqual(serverOptions.workspaceInputs, ["/tmp/workspace"]);
  assert.deepEqual(serverOptions.projectRootInputs, ["/tmp/projects"]);
  assert.deepEqual(serverOptions.approvalAuditLog, { persistent: true, kind: "approval" });
  assert.deepEqual(serverOptions.actionAuditLog, { persistent: true, kind: "action" });
  assert.deepEqual(factoryCalls, [
    {
      type: "approval",
      options: { path: "/tmp/approval-decisions.jsonl" },
    },
    {
      type: "action",
      options: { path: "/tmp/actions.jsonl" },
    },
  ]);
});

test("parseLauncherArgs refuses non-loopback hosts by default", () => {
  assert.throws(
    () => parseLauncherArgs(["--host", "0.0.0.0"], {}),
    /Refusing to bind non-loopback host/,
  );
});

test("openUrl uses xdg-open style argv without a shell", () => {
  const calls = [];
  const child = openUrl("http://127.0.0.1:14570/", {
    opener: "xdg-open",
    spawnFn(command, args, options) {
      calls.push({ command, args, options });
      return {
        unref() {
          calls.push({ unref: true });
        },
      };
    },
  });

  assert.equal(typeof child.unref, "function");
  assert.deepEqual(calls, [
    {
      command: "xdg-open",
      args: ["http://127.0.0.1:14570/"],
      options: {
        detached: true,
        stdio: "ignore",
      },
    },
    { unref: true },
  ]);
});

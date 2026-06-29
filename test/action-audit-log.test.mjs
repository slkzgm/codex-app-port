import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import {
  createActionAuditLog,
  sanitizeActionAuditRecord,
} from "../src/dev-server/action-audit-log.mjs";

test("action audit log writes sanitized live-session control JSONL", async () => {
  const dir = await mkdtemp(join(tmpdir(), "codex-action-audit-"));
  const path = join(dir, "actions.jsonl");
  try {
    const log = createActionAuditLog({
      path,
      now: () => "2026-05-16T00:00:00.000Z",
    });
    assert.equal(log.ensureWritable(), true);
    log.append({
      event: "live-session-control-recorded",
      payload: liveSessionControlPayload(),
    });

    const records = (await readFile(path, "utf8"))
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    assert.equal(records.length, 1);
    assert.equal(records[0].event, "live-session-control-recorded");
    assert.equal(records[0].action.liveSessionAction, "steer");
    assert.equal(records[0].action.method, "turn/steer");
    assert.equal(records[0].action.modelTraffic, true);
    assert.equal(records[0].target.threadIdSuffix, "abcd1234");
    assert.equal(records[0].prompt.charCount, 22);
    assert.equal(records[0].preflight.tokenConsumed, true);
    assert.equal(records[0].preflight.tokenReturned, false);
    assert.equal(records[0].policy.sensitivePayloadLogged, false);

    const serialized = JSON.stringify(records);
    for (const marker of [
      "preflight-private-token",
      "Sensitive steer prompt",
      "thread-private-full-id",
      "/tmp/private-workspace",
      "secret.txt",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("action audit log writes sanitized live-session bulk control JSONL", async () => {
  const dir = await mkdtemp(join(tmpdir(), "codex-action-audit-bulk-"));
  const path = join(dir, "actions.jsonl");
  try {
    const log = createActionAuditLog({
      path,
      now: () => "2026-05-16T00:00:00.000Z",
    });
    log.append({
      event: "live-session-bulk-control-recorded",
      payload: liveSessionBulkControlPayload(),
    });

    const records = (await readFile(path, "utf8"))
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    assert.equal(records.length, 1);
    assert.equal(records[0].event, "live-session-bulk-control-recorded");
    assert.equal(records[0].action.type, "live-session-bulk-control");
    assert.equal(records[0].action.liveSessionAction, "unsubscribe");
    assert.equal(records[0].action.method, "thread/unsubscribe");
    assert.equal(records[0].action.bulkLiveSessionMutation, true);
    assert.equal(records[0].target.targetScope, "all-loaded");
    assert.equal(records[0].target.threadIdSuffixesReturned, false);
    assert.equal(records[0].result.succeededSessionCount, 2);
    assert.equal(records[0].preflight.tokenConsumed, true);
    assert.equal(records[0].preflight.tokenReturned, false);
    assert.equal(records[0].policy.sensitivePayloadLogged, false);

    const serialized = JSON.stringify(records);
    for (const marker of [
      "preflight-private-token",
      "Sensitive bulk prompt",
      "thread-private-full-id",
      "/tmp/private-workspace",
      "secret.txt",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("action audit log writes sanitized local mutation JSONL", async () => {
  const dir = await mkdtemp(join(tmpdir(), "codex-local-action-audit-"));
  const path = join(dir, "actions.jsonl");
  try {
    const log = createActionAuditLog({
      path,
      now: () => "2026-05-16T00:00:00.000Z",
    });
    log.append({
      event: "file-action-recorded",
      payload: fileActionPayload(),
    });
    log.append({
      event: "account-logout-recorded",
      payload: accountLogoutPayload(),
    });
    log.append({
      event: "terminal-background-clean-recorded",
      payload: terminalBackgroundCleanPayload(),
    });
    log.append({
      event: "terminal-control-recorded",
      payload: terminalControlPayload(),
    });
    log.append({
      event: "thread-archive-recorded",
      payload: threadArchivePayload(),
    });
    log.append({
      event: "thread-rollback-recorded",
      payload: threadRollbackPayload(),
    });
    log.append({
      event: "thread-safety-lock-recorded",
      payload: threadSafetyLockPayload(),
    });
    log.append({
      event: "skills-extra-roots-clear-recorded",
      payload: skillsExtraRootsClearPayload(),
    });
    log.append({
      event: "thread-compact-recorded",
      payload: threadCompactPayload(),
    });

    const records = (await readFile(path, "utf8"))
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    assert.equal(records.length, 9);
    assert.equal(records[0].event, "file-action-recorded");
    assert.equal(records[0].action.fileAction, "writeFile");
    assert.equal(records[0].target.depth, 2);
    assert.equal(records[0].target.basenameReturned, false);
    assert.equal(records[0].content.charCount, 44);
    assert.equal(records[0].filesystem.wroteFile, true);
    assert.equal(records[1].event, "account-logout-recorded");
    assert.equal(records[1].action.type, "account-logout");
    assert.equal(records[1].action.method, "account/logout");
    assert.equal(records[1].target.tokensReturned, false);
    assert.equal(records[1].result.accountIdentifiersReturned, false);
    assert.equal(records[2].event, "terminal-background-clean-recorded");
    assert.equal(records[2].action.method, "thread/backgroundTerminals/clean");
    assert.equal(records[2].target.threadIdSuffix, "abcd1234");
    assert.equal(records[2].result.outputTextReturned, false);
    assert.equal(records[3].event, "terminal-control-recorded");
    assert.equal(records[3].action.type, "terminal-control");
    assert.equal(records[3].action.terminalAction, "write");
    assert.equal(records[3].action.method, "command/exec/write");
    assert.equal(records[3].target.sessionSelectorCharCount, 20);
    assert.equal(records[3].target.sessionIdentifierReturned, false);
    assert.equal(records[3].result.outputTextReturned, false);
    assert.equal(records[4].event, "thread-archive-recorded");
    assert.equal(records[4].action.type, "thread-archive");
    assert.equal(records[4].action.method, "thread/archive");
    assert.equal(records[4].target.threadIdSuffix, "deadbeef");
    assert.equal(records[4].target.archived, true);
    assert.equal(records[4].result.threadContentReturned, false);
    assert.equal(records[5].event, "thread-rollback-recorded");
    assert.equal(records[5].action.type, "thread-rollback");
    assert.equal(records[5].action.method, "thread/rollback");
    assert.equal(records[5].target.threadIdSuffix, "facebeef");
    assert.equal(records[5].target.rolledBack, true);
    assert.equal(records[5].target.numTurns, 2);
    assert.equal(records[5].result.rolledBack, true);
    assert.equal(records[5].result.threadContentReturned, false);
    assert.equal(records[6].event, "thread-safety-lock-recorded");
    assert.equal(records[6].action.type, "thread-safety-lock");
    assert.equal(records[6].action.method, "thread/settings/update");
    assert.equal(records[6].target.threadIdSuffix, "cab005e1");
    assert.equal(records[6].target.locked, true);
    assert.equal(records[6].target.approvalPolicy, "on-request");
    assert.equal(records[6].target.sandboxPolicyType, "readOnly");
    assert.equal(records[6].result.locked, true);
    assert.equal(records[6].result.threadContentReturned, false);
    assert.equal(records[7].event, "skills-extra-roots-clear-recorded");
    assert.equal(records[7].action.type, "skills-extra-roots-clear");
    assert.equal(records[7].action.method, "skills/extraRoots/set");
    assert.equal(records[7].action.skillsExtraRootsClear, true);
    assert.equal(records[7].appServer.skillsExtraRootsTraffic, true);
    assert.equal(records[7].target.requestedExtraRootCount, 0);
    assert.equal(records[7].target.browserRootsAccepted, false);
    assert.equal(records[7].result.status, "cleared");
    assert.equal(records[7].result.extraRootsReturned, false);
    assert.equal(records[7].result.pathsReturned, false);
    assert.equal(records[8].event, "thread-compact-recorded");
    assert.equal(records[8].action.type, "thread-compact");
    assert.equal(records[8].action.method, "thread/compact/start");
    assert.equal(records[8].action.modelTraffic, true);
    assert.equal(records[8].target.threadIdSuffix, "feedbeef");
    assert.equal(records[8].result.loadedSessionCount, 1);
    assert.equal(records[8].result.threadContentReturned, false);

    const serialized = JSON.stringify(records);
    for (const marker of [
      "preflight-private-token",
      "src/secret.txt",
      "secret.txt",
      "token=sk-proj-privatevalue",
      "Sensitive file body",
      "/tmp/private-workspace",
      "/tmp/private-home",
      "terminal-private-id",
      "process-private-id",
      "Sensitive terminal input",
      "Sensitive terminal output",
      "thread-private-full-id",
      "Sensitive archived content",
      "Sensitive rollback content",
      "Sensitive safety lock content",
      "safety-lock-secret",
      "private-extra-roots-secret",
      "private-extra-root",
      "rollback-secret",
      "Sensitive compacted content",
      "private@example.com",
      "sk-proj-private-auth-token",
      "acct-private",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("action audit log refuses symlink log files", async () => {
  const dir = await mkdtemp(join(tmpdir(), "codex-action-audit-symlink-"));
  try {
    await mkdir(join(dir, "target"), { recursive: true });
    await writeFile(join(dir, "target", "real.jsonl"), "", "utf8");
    const linkPath = join(dir, "actions.jsonl");
    await symlink(join(dir, "target", "real.jsonl"), linkPath);
    const log = createActionAuditLog({ path: linkPath });
    assert.throws(() => log.ensureWritable(), /ELOOP|too many symbolic links/i);
    assert.throws(
      () =>
        log.append({
          payload: liveSessionControlPayload(),
        }),
      /ELOOP|too many symbolic links/i,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("sanitizeActionAuditRecord keeps only bounded action metadata", () => {
  const record = sanitizeActionAuditRecord(
    {
      payload: liveSessionControlPayload(),
    },
    { generatedAt: "2026-05-16T00:00:00.000Z" },
  );
  assert.equal(record.version, 1);
  assert.equal(record.action.type, "live-session-control");
  assert.equal(record.action.liveSessionAction, "steer");
  assert.equal(record.prompt.textReturned, false);
  assert.equal(record.policy.rawRequestBodyReturned, false);
  assert.equal(JSON.stringify(record).includes("Sensitive steer prompt"), false);
});

function liveSessionControlPayload() {
  return {
    ok: true,
    generatedAt: "2026-05-16T00:00:00.000Z",
    workspace: {
      id: "default",
      label: "codex-app-port-test",
      isDefault: true,
      cwd: "/tmp/private-workspace",
    },
    appServer: {
      touched: true,
      modelTraffic: true,
      commandTraffic: false,
      auditedMethods: ["thread/loaded/list", "thread/read", "turn/steer"],
    },
    action: {
      type: "live-session-control",
      liveSessionAction: "steer",
      method: "turn/steer",
      execution: "completed",
      appServerTouched: true,
      modelTraffic: true,
      sendsPromptToAppServer: true,
    },
    target: {
      threadIdSuffix: "abcd1234",
      turnIdSuffix: "turn5678",
      responseTurnIdSuffix: "turn5678",
      fullId: "thread-private-full-id-abcd1234",
      path: "/tmp/private-workspace/secret.txt",
    },
    prompt: {
      present: true,
      charCount: 22,
      lineCount: 1,
      text: "Sensitive steer prompt",
      textReturned: true,
    },
    result: {
      status: "steer-submitted",
      loadedSessionCount: 1,
      fullIds: ["thread-private-full-id-abcd1234"],
      threadContent: "Sensitive content",
    },
    preflight: {
      tokenConsumed: true,
      tokenReturned: false,
      token: "preflight-private-token",
      scope: {
        kind: "live-session-control-preflight",
        workspaceId: "default",
      },
      oneTimeUseEnforced: true,
    },
  };
}

function liveSessionBulkControlPayload() {
  return {
    ok: true,
    generatedAt: "2026-05-16T00:00:00.000Z",
    workspace: {
      id: "default",
      label: "codex-app-port-test",
      isDefault: true,
      cwd: "/tmp/private-workspace",
    },
    appServer: {
      touched: true,
      modelTraffic: false,
      commandTraffic: false,
      auditedMethods: ["thread/loaded/list", "thread/unsubscribe"],
    },
    action: {
      type: "live-session-bulk-control",
      liveSessionAction: "unsubscribe",
      method: "thread/unsubscribe",
      execution: "completed",
      liveSessionMutation: true,
      bulkLiveSessionMutation: true,
      appServerTouched: true,
      modelTraffic: false,
      sendsPromptToAppServer: false,
    },
    target: {
      targetScope: "all-loaded",
      threadIdSuffixes: ["abcd1234", "feedbeef"],
      fullIds: ["thread-private-full-id-abcd1234"],
      path: "/tmp/private-workspace/secret.txt",
    },
    prompt: {
      present: false,
      charCount: 0,
      lineCount: 0,
      text: "Sensitive bulk prompt",
      textReturned: true,
    },
    result: {
      status: "completed",
      loadedSessionCount: 2,
      attemptedSessionCount: 2,
      succeededSessionCount: 2,
      failedSessionCount: 0,
      fullIds: ["thread-private-full-id-abcd1234"],
      threadContent: "Sensitive content",
    },
    preflight: {
      tokenConsumed: true,
      tokenReturned: false,
      token: "preflight-private-token",
      scope: {
        kind: "live-session-bulk-control-preflight",
        workspaceId: "default",
      },
      oneTimeUseEnforced: true,
    },
  };
}

function fileActionPayload() {
  return {
    ok: true,
    workspace: {
      id: "default",
      label: "codex-app-port-test",
      isDefault: true,
      cwd: "/tmp/private-workspace",
    },
    appServer: {
      touched: false,
      modelTraffic: false,
      commandTraffic: false,
    },
    action: {
      type: "file-action",
      fileAction: "writeFile",
      method: "fs/writeFile",
      execution: "completed",
      filesystemWrites: true,
      appServerTouched: false,
    },
    target: {
      basename: "secret.txt",
      depth: 2,
      path: "src/secret.txt",
      pathReturned: true,
    },
    source: null,
    content: {
      present: true,
      charCount: 44,
      lineCount: 2,
      text: "token=sk-proj-privatevalue\nSensitive file body",
      textReturned: true,
    },
    filesystem: {
      wroteFile: true,
      removed: false,
      copied: false,
      createdDirectory: false,
      path: "/tmp/private-workspace/src/secret.txt",
    },
    preflight: {
      tokenConsumed: true,
      token: "preflight-private-token",
      scope: {
        kind: "file-action-preflight",
        workspaceId: "default",
      },
      oneTimeUseEnforced: true,
    },
  };
}

function accountLogoutPayload() {
  return {
    ok: true,
    workspace: {
      id: "default",
      label: "codex-app-port-test",
      isDefault: true,
      cwd: "/tmp/private-workspace",
    },
    appServer: {
      touched: true,
      modelTraffic: false,
      commandTraffic: false,
      auditedMethods: ["account/logout"],
    },
    action: {
      type: "account-logout",
      method: "account/logout",
      execution: "logged-out",
      authMutation: true,
      appServerTouched: true,
      modelTraffic: false,
    },
    target: {
      accountId: "acct-private-12345678",
      email: "private@example.com",
      token: "sk-proj-private-auth-token",
      authUrl: "https://auth.example.invalid/private",
    },
    result: {
      status: "logged-out",
      token: "sk-proj-private-auth-token",
      accountId: "acct-private-12345678",
      email: "private@example.com",
      rawPayload: {
        token: "sk-proj-private-auth-token",
        accountId: "acct-private-12345678",
      },
    },
    preflight: {
      tokenConsumed: true,
      token: "preflight-private-token",
      scope: {
        kind: "account-logout-preflight",
        workspaceId: "default",
      },
      oneTimeUseEnforced: true,
    },
  };
}

function terminalBackgroundCleanPayload() {
  return {
    ok: true,
    workspace: {
      id: "default",
      label: "codex-app-port-test",
      isDefault: true,
      cwd: "/tmp/private-workspace",
    },
    appServer: {
      touched: true,
      modelTraffic: false,
      commandTraffic: false,
      auditedMethods: ["thread/loaded/list", "thread/backgroundTerminals/clean"],
    },
    action: {
      type: "terminal-background-clean",
      method: "thread/backgroundTerminals/clean",
      execution: "completed",
      terminalCleanup: true,
      terminalSessionTouched: true,
      appServerTouched: true,
    },
    target: {
      threadIdSuffix: "abcd1234",
      fullId: "thread-private-full-id-abcd1234",
    },
    result: {
      status: "clean-requested",
      loadedSessionCount: 2,
      outputTextReturned: true,
      output: "Sensitive terminal output",
      terminalSessionIdentifiersReturned: true,
      terminalSessionIdentifier: "terminal-private-id",
      fullIdsReturned: true,
    },
    preflight: {
      tokenConsumed: true,
      token: "preflight-private-token",
      scope: {
        kind: "terminal-background-clean-preflight",
        workspaceId: "default",
      },
      oneTimeUseEnforced: true,
    },
  };
}

function terminalControlPayload() {
  return {
    ok: true,
    workspace: {
      id: "default",
      label: "codex-app-port-test",
      isDefault: true,
      cwd: "/tmp/private-workspace",
    },
    appServer: {
      touched: true,
      modelTraffic: false,
      commandTraffic: false,
      auditedMethods: ["command/exec/write"],
    },
    action: {
      type: "terminal-control",
      terminalAction: "write",
      method: "command/exec/write",
      execution: "completed",
      terminalWrite: true,
      terminalSessionTouched: true,
      appServerTouched: true,
    },
    target: {
      sessionSelectorCharCount: 20,
      sessionIdentifier: "process-private-id",
      path: "/tmp/private-workspace/secret.txt",
    },
    terminalControl: {
      input: {
        present: true,
        charCount: 24,
        lineCount: 1,
        text: "Sensitive terminal input",
        textReturned: true,
      },
    },
    result: {
      status: "completed",
      output: "Sensitive terminal output",
      terminalSessionIdentifier: "process-private-id",
    },
    preflight: {
      tokenConsumed: true,
      token: "preflight-private-token",
      scope: {
        kind: "terminal-control-preflight",
        workspaceId: "default",
      },
      oneTimeUseEnforced: true,
    },
  };
}

function threadArchivePayload() {
  return {
    ok: true,
    workspace: {
      id: "default",
      label: "codex-app-port-test",
      isDefault: true,
      cwd: "/tmp/private-workspace",
    },
    appServer: {
      touched: true,
      modelTraffic: false,
      commandTraffic: false,
      auditedMethods: ["thread/list", "thread/archive"],
    },
    action: {
      type: "thread-archive",
      method: "thread/archive",
      execution: "completed",
      threadArchiveAction: "archive",
      threadStateMutated: true,
      appServerTouched: true,
    },
    target: {
      threadIdSuffix: "deadbeef",
      archived: true,
      fullId: "thread-private-full-id-deadbeef",
      path: "/tmp/private-workspace/secret.txt",
    },
    result: {
      status: "completed",
      archived: true,
      threadContent: "Sensitive archived content",
      fullIds: ["thread-private-full-id-deadbeef"],
    },
    preflight: {
      tokenConsumed: true,
      token: "preflight-private-token",
      scope: {
        kind: "thread-archive-preflight",
        workspaceId: "default",
      },
      oneTimeUseEnforced: true,
    },
  };
}

function threadRollbackPayload() {
  return {
    ok: true,
    workspace: {
      id: "default",
      label: "codex-app-port-test",
      isDefault: true,
      cwd: "/tmp/private-workspace",
    },
    appServer: {
      touched: true,
      modelTraffic: false,
      commandTraffic: false,
      auditedMethods: ["thread/list", "thread/rollback"],
    },
    action: {
      type: "thread-rollback",
      method: "thread/rollback",
      execution: "rolled-back",
      threadRolledBack: true,
      threadStateMutated: true,
      appServerTouched: true,
      modelTraffic: false,
    },
    target: {
      threadIdSuffix: "facebeef",
      rolledBack: true,
      numTurns: 2,
      returnedTurnCount: 3,
      fullId: "thread-private-full-id-facebeef",
      path: "/tmp/private-workspace/rollback-secret.txt",
    },
    result: {
      status: "rolled-back",
      rolledBack: true,
      numTurns: 2,
      returnedTurnCount: 3,
      threadContent: "Sensitive rollback content",
      fullIds: ["thread-private-full-id-facebeef"],
    },
    preflight: {
      tokenConsumed: true,
      token: "preflight-private-token",
      scope: {
        kind: "thread-rollback-preflight",
        workspaceId: "default",
      },
      oneTimeUseEnforced: true,
    },
  };
}

function threadSafetyLockPayload() {
  return {
    ok: true,
    workspace: {
      id: "default",
      label: "codex-app-port-test",
      isDefault: true,
      cwd: "/tmp/private-workspace",
    },
    appServer: {
      touched: true,
      modelTraffic: false,
      commandTraffic: false,
      settingsTraffic: true,
      auditedMethods: ["thread/list", "thread/settings/update"],
    },
    action: {
      type: "thread-safety-lock",
      method: "thread/settings/update",
      execution: "safety-locked",
      threadSafetyLocked: true,
      threadSettingsMutated: true,
      threadStateMutated: true,
      appServerTouched: true,
      modelTraffic: false,
    },
    target: {
      threadIdSuffix: "cab005e1",
      locked: true,
      approvalPolicy: "on-request",
      approvalsReviewer: "user",
      sandboxPolicyType: "readOnly",
      networkAccessAllowed: false,
      fullId: "thread-private-full-id-cab005e1",
      path: "/tmp/private-workspace/safety-lock-secret.txt",
    },
    result: {
      status: "safety-locked",
      locked: true,
      responseObject: true,
      responseTopLevelKeyCount: 1,
      threadContent: "Sensitive safety lock content",
      fullIds: ["thread-private-full-id-cab005e1"],
    },
    preflight: {
      tokenConsumed: true,
      token: "preflight-private-token",
      scope: {
        kind: "thread-safety-lock-preflight",
        workspaceId: "default",
      },
      oneTimeUseEnforced: true,
    },
  };
}

function skillsExtraRootsClearPayload() {
  return {
    ok: true,
    workspace: {
      id: "default",
      label: "codex-app-port-test",
      isDefault: true,
      cwd: "/tmp/private-workspace",
    },
    appServer: {
      touched: true,
      modelTraffic: false,
      commandTraffic: false,
      skillsExtraRootsTraffic: true,
      auditedMethods: ["skills/extraRoots/set"],
    },
    action: {
      type: "skills-extra-roots-clear",
      method: "skills/extraRoots/set",
      execution: "completed",
      skillsExtraRootsClear: true,
      appServerTouched: true,
      modelTraffic: false,
    },
    target: {
      requestedExtraRootCount: 0,
      browserRootsAccepted: false,
      extraRoots: ["/tmp/private-workspace/private-extra-root"],
      privateSettings: "private-extra-roots-secret",
    },
    result: {
      status: "cleared",
      requestedExtraRootCount: 0,
      responseObject: true,
      responseTopLevelKeyCount: 3,
      extraRoots: ["/tmp/private-workspace/private-extra-root"],
      privateSettings: "private-extra-roots-secret",
    },
    preflight: {
      tokenConsumed: true,
      token: "preflight-private-token",
      scope: {
        kind: "skills-extra-roots-clear-preflight",
        workspaceId: "default",
      },
      oneTimeUseEnforced: true,
    },
  };
}

function threadCompactPayload() {
  return {
    ok: true,
    workspace: {
      id: "default",
      label: "codex-app-port-test",
      isDefault: true,
      cwd: "/tmp/private-workspace",
    },
    appServer: {
      touched: true,
      modelTraffic: true,
      commandTraffic: false,
      auditedMethods: ["thread/loaded/list", "thread/compact/start"],
    },
    action: {
      type: "thread-compact",
      method: "thread/compact/start",
      execution: "started",
      threadCompactionStarted: true,
      appServerTouched: true,
      modelTraffic: true,
      sendsPromptToAppServer: false,
    },
    target: {
      threadIdSuffix: "feedbeef",
      fullId: "thread-private-full-id-feedbeef",
      path: "/tmp/private-workspace/secret.txt",
    },
    result: {
      status: "compact-started",
      loadedSessionCount: 1,
      threadContent: "Sensitive compacted content",
      fullIds: ["thread-private-full-id-feedbeef"],
    },
    preflight: {
      tokenConsumed: true,
      token: "preflight-private-token",
      scope: {
        kind: "thread-compact-preflight",
        workspaceId: "default",
      },
      oneTimeUseEnforced: true,
    },
  };
}

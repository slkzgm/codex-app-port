import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { test } from "node:test";

import { createAppServerSessionManager } from "../src/app-server/session-manager.mjs";
import { createApprovalAuditLog } from "../src/dev-server/approval-audit-log.mjs";

const mockServer = new URL("./fixtures/mock-app-server.mjs", import.meta.url);

test("app-server session manager keeps a persistent sanitized live-session client", async () => {
  const manager = createAppServerSessionManager({
    codexBin: process.execPath,
    codexArgs: [mockServer.pathname],
    timeoutMs: 1_000,
  });
  const workspace = {
    id: "default",
    cwd: process.cwd(),
  };

  try {
    const started = await manager.startTurn({
      workspace,
      threadIdSuffix: "00000001",
      prompt: "Sensitive managed prompt must not be returned",
    });
    const turnStart = started.probes.turnStart;
    assert.equal(started.ok, true);
    assert.equal(started.sessionManager.enabled, true);
    assert.equal(started.sessionManager.persistentClient, true);
    assert.equal(turnStart.threadIdSuffix, "00000001");
    assert.equal(turnStart.turnIdSuffix, "turn-1");
    assert.equal(turnStart.eventCount >= 2, true);
    assert.equal(
      turnStart.events.some((event) => event.method === "item/agentMessage/delta"),
      true,
    );

    const loaded = await manager.listLoadedSessions({
      workspace,
      limit: 5,
    });
    assert.equal(loaded.ok, true);
    assert.equal(loaded.probes.loadedSessions.returnedThreadCount, 2);
    assert.deepEqual(loaded.probes.loadedSessions.threadIdSuffixes, ["00000001", "00000002"]);

    const steered = await manager.controlLiveSession({
      workspace,
      action: "steer",
      threadIdSuffix: "00000001",
      turnIdSuffix: "00000002",
      prompt: "Sensitive managed steer must not be returned",
      timeoutMs: 1_000,
    });
    const control = steered.probes.liveSessionControl;
    assert.equal(control.method, "turn/steer");
    assert.equal(control.threadIdSuffix, "00000001");
    assert.equal(control.turnIdSuffix, "00000002");
    assert.equal(control.responseTurnIdSuffix, "00000002");
    assert.deepEqual(control.methodsUsed, ["thread/loaded/list", "thread/read", "turn/steer"]);
    assert.equal(control.promptTextReturned, false);

    const bulkUnsubscribed = await manager.bulkControlLiveSessions({
      workspace,
      action: "unsubscribe",
      limit: 5,
      timeoutMs: 1_000,
    });
    const bulkControl = bulkUnsubscribed.probes.liveSessionBulkControl;
    assert.equal(bulkControl.action, "unsubscribe");
    assert.equal(bulkControl.method, "thread/unsubscribe");
    assert.equal(bulkControl.resultStatus, "completed");
    assert.equal(bulkControl.loadedSessionCount, 2);
    assert.equal(bulkControl.attemptedSessionCount, 2);
    assert.equal(bulkControl.succeededSessionCount, 2);
    assert.equal(bulkControl.failedSessionCount, 0);
    assert.deepEqual(bulkControl.methodsUsed, ["thread/loaded/list", "thread/unsubscribe"]);
    assert.equal(bulkControl.promptTextReturned, false);
    assert.equal(bulkControl.fullIdsReturned, false);
    assert.equal(bulkControl.threadContentReturned, false);

    const cleaned = await manager.cleanBackgroundTerminals({
      workspace,
      threadIdSuffix: "00000001",
      timeoutMs: 1_000,
    });
    const terminalClean = cleaned.probes.terminalBackgroundClean;
    assert.equal(terminalClean.method, "thread/backgroundTerminals/clean");
    assert.equal(terminalClean.threadIdSuffix, "00000001");
    assert.equal(terminalClean.resultStatus, "clean-requested");
    assert.deepEqual(terminalClean.methodsUsed, [
      "thread/loaded/list",
      "thread/backgroundTerminals/clean",
    ]);
    assert.equal(terminalClean.outputTextReturned, false);
    assert.equal(terminalClean.fullIdsReturned, false);

    const listedTerminals = await manager.listBackgroundTerminals({
      workspace,
      threadIdSuffix: "00000001",
      timeoutMs: 1_000,
    });
    const terminalList = listedTerminals.probes.terminalBackgroundList;
    assert.equal(terminalList.method, "thread/backgroundTerminals/list");
    assert.equal(terminalList.threadIdSuffix, "00000001");
    assert.equal(terminalList.resultStatus, "listed");
    assert.equal(terminalList.terminalCount, 1);
    assert.equal(terminalList.hasNextPage, true);
    assert.deepEqual(terminalList.methodsUsed, [
      "thread/loaded/list",
      "thread/backgroundTerminals/list",
    ]);
    assert.equal(terminalList.commandTextReturned, false);
    assert.equal(terminalList.cwdReturned, false);
    assert.equal(terminalList.processIdsReturned, false);

    const terminatedTerminal = await manager.terminateBackgroundTerminal({
      workspace,
      threadIdSuffix: "00000001",
      processId: "bg-process-private-1",
      timeoutMs: 1_000,
    });
    const terminalTerminate = terminatedTerminal.probes.terminalBackgroundTerminate;
    assert.equal(terminalTerminate.method, "thread/backgroundTerminals/terminate");
    assert.equal(terminalTerminate.threadIdSuffix, "00000001");
    assert.equal(terminalTerminate.resultStatus, "terminated");
    assert.equal(terminalTerminate.terminated, true);
    assert.deepEqual(terminalTerminate.methodsUsed, [
      "thread/loaded/list",
      "thread/backgroundTerminals/terminate",
    ]);
    assert.equal(terminalTerminate.commandTextReturned, false);
    assert.equal(terminalTerminate.cwdReturned, false);
    assert.equal(terminalTerminate.processIdsReturned, false);

    const threadShell = await manager.runThreadShellCommand({
      workspace,
      threadIdSuffix: "00000001",
      command: "printf safe",
      timeoutMs: 1_000,
    });
    const shell = threadShell.probes.threadShellCommand;
    assert.equal(shell.method, "thread/shellCommand");
    assert.equal(shell.threadIdSuffix, "00000001");
    assert.equal(shell.resultStatus, "submitted");
    assert.equal(shell.loadedSessionCount, 2);
    assert.deepEqual(shell.methodsUsed, ["thread/loaded/list", "thread/shellCommand"]);
    assert.equal(shell.commandCharCount, 11);
    assert.equal(shell.commandLineCount, 1);
    assert.equal(shell.commandTextReturned, false);
    assert.equal(shell.outputTextReturned, false);
    assert.equal(shell.fullIdsReturned, false);
    assert.equal(JSON.stringify(threadShell).includes("printf safe"), false);

    const terminalControl = await manager.controlTerminalSession({
      workspace,
      terminalAction: "write",
      method: "command/exec/write",
      session: "process00000003",
      input: "Sensitive terminal input",
      timeoutMs: 1_000,
    });
    const controlTerminal = terminalControl.probes.terminalControl;
    assert.equal(controlTerminal.method, "command/exec/write");
    assert.equal(controlTerminal.terminalAction, "write");
    assert.equal(controlTerminal.resultStatus, "completed");
    assert.equal(controlTerminal.sessionSelectorCharCount, 15);
    assert.equal(controlTerminal.inputCharCount, 24);
    assert.equal(controlTerminal.inputLineCount, 1);
    assert.deepEqual(controlTerminal.methodsUsed, ["command/exec/write"]);
    assert.equal(controlTerminal.inputTextReturned, false);
    assert.equal(controlTerminal.outputTextReturned, false);
    assert.equal(controlTerminal.sessionIdentifierReturned, false);

    const processControl = await manager.controlTerminalSession({
      workspace,
      terminalAction: "terminate",
      method: "process/kill",
      session: "process00000004",
      timeoutMs: 1_000,
    });
    const controlProcess = processControl.probes.terminalControl;
    assert.equal(controlProcess.method, "process/kill");
    assert.equal(controlProcess.terminalAction, "terminate");
    assert.equal(controlProcess.resultStatus, "completed");
    assert.equal(controlProcess.sessionSelectorCharCount, 15);
    assert.deepEqual(controlProcess.methodsUsed, ["process/kill"]);
    assert.equal(controlProcess.inputTextReturned, false);
    assert.equal(controlProcess.outputTextReturned, false);
    assert.equal(controlProcess.sessionIdentifierReturned, false);

    const compacted = await manager.compactThread({
      workspace,
      threadIdSuffix: "00000001",
      timeoutMs: 1_000,
    });
    const compact = compacted.probes.threadCompact;
    assert.equal(compact.method, "thread/compact/start");
    assert.equal(compact.threadIdSuffix, "00000001");
    assert.equal(compact.resultStatus, "compact-started");
    assert.equal(compact.modelTraffic, true);
    assert.deepEqual(compact.methodsUsed, ["thread/loaded/list", "thread/compact/start"]);
    assert.equal(compact.promptTextReturned, false);
    assert.equal(compact.threadContentReturned, false);
    assert.equal(compact.fullIdsReturned, false);

    const terminal = await manager.startTurn({
      workspace,
      threadIdSuffix: "00000001",
      prompt: "terminal lifecycle without returning secrets",
      timeoutMs: 1_000,
    });
    const terminalEvents = terminal.probes.turnStart.events.filter((event) => event.terminalLifecycle);
    assert.equal(terminalEvents.length >= 3, true);
    assert.deepEqual(
      terminalEvents.map((event) => event.terminalLifecycle.kind),
      ["command-execution-output", "terminal-interaction", "process-exited"],
    );
    assert.equal(terminalEvents[0].terminalLifecycle.output.textReturned, false);
    assert.equal(terminalEvents[1].terminalLifecycle.input.textReturned, false);
    assert.equal(terminalEvents[1].terminalLifecycle.process.valueReturned, false);
    assert.equal(terminalEvents[2].terminalLifecycle.stdout.textReturned, false);
    assert.equal(terminalEvents[2].terminalLifecycle.stderr.capReached, true);

    const lifecycle = manager.describeWorkspace({ workspace });
    assert.equal(lifecycle.enabled, true);
    assert.equal(lifecycle.persistentClient, true);
    assert.equal(lifecycle.state, "idle");
    assert.equal(lifecycle.clientStarted, true);
    assert.equal(lifecycle.activeTurn, null);
    assert.equal(lifecycle.notificationCount > 0, true);
    assert.equal(lifecycle.promptTextReturned, false);
    assert.equal(lifecycle.fullIdsReturned, false);
    assert.equal(lifecycle.pathsReturned, false);
    assert.equal(lifecycle.decisionTokensReturned, false);
    assert.equal(lifecycle.rawEventsReturned, false);

    const serialized = JSON.stringify([
      started,
      loaded,
      steered,
      bulkUnsubscribed,
      cleaned,
      terminalControl,
      processControl,
      compacted,
      terminal,
      lifecycle,
    ]);
    for (const marker of [
      "Sensitive managed prompt",
      "Sensitive managed steer",
      "Sensitive terminal input",
      "terminal lifecycle",
      "Sensitive command output",
      "Sensitive stdout",
      "Sensitive stderr",
      "Sensitive compact",
      "/tmp/mock-workspace",
      "secret.txt",
      "sk-proj-secretvalue",
      "process-sensitive-00000007",
      "process-handle-sensitive-00000008",
      "process00000004",
      "thread-private-loaded-00000001",
      "turn-sensitive-00000002",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    await manager.closeAll();
  }
});

test("app-server session manager can forward pending deny-only approval decisions", async () => {
  const auditDir = await mkdtemp(join(tmpdir(), "codex-session-manager-approval-audit-"));
  const auditLogPath = join(auditDir, "approval-decisions.jsonl");
  const manager = createAppServerSessionManager({
    codexBin: process.execPath,
    codexArgs: [mockServer.pathname],
    timeoutMs: 1_000,
    approvalForwardingEnabled: true,
    approvalDecisionTimeoutMs: 1_000,
    approvalAuditLog: createApprovalAuditLog({ path: auditLogPath }),
    randomDecisionToken: () => "approvaldecisiontoken0001",
  });
  const workspace = {
    id: "default",
    label: "workspace",
    isDefault: true,
    cwd: process.cwd(),
  };

  try {
    const startedPromise = manager.startTurn({
      workspace,
      threadIdSuffix: "00000001",
      prompt: "Trigger approval without returning prompt",
    });
    const pending = await waitForPendingApproval(manager, { workspace });
    assert.equal(pending.length, 1);
    assert.match(pending[0].sessionId, /^managed-/);
    assert.equal(pending[0].request.kind, "command");
    assert.equal(pending[0].request.command.charCount, 34);
    assert.deepEqual(pending[0].request.safeApproveDecisions, ["accept"]);
    assert.deepEqual(pending[0].request.safeDenyDecisions, ["decline", "cancel"]);
    assert.equal(pending[0].request.approvalDetail, undefined);

    const detailedPending = manager.listApprovalRequests({ workspace, includeDetails: true });
    assert.equal(detailedPending.length, 1);
    assert.equal(detailedPending[0].request.approvalDetail.command.text, "cat <path>");
    assert.equal(detailedPending[0].request.approvalDetail.command.rawTextReturned, false);
    assert.equal(detailedPending[0].request.approvalDetail.command.pathsRedacted, 1);

    const decision = manager.recordApprovalDecision({
      workspace,
      sessionId: pending[0].sessionId,
      requestKey: pending[0].request.requestKey,
      decisionToken: pending[0].request.decisionToken,
      decision: "decline",
    });
    assert.equal(decision.browserDecision.forwarded, true);
    assert.equal(decision.browserDecision.appServerTouched, true);
    assert.equal(decision.browserDecision.auditLogged, true);
    assert.equal(decision.request.decision, "decline");

    const started = await startedPromise;
    const approval = started.probes.turnStart.approvalRequests[0];
    assert.equal(approval.handled, true);
    assert.equal(approval.decision, "decline");
    assert.equal(started.sessionManager.approvalForwardingEnabled, true);

    const auditRecords = (await readFile(auditLogPath, "utf8"))
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    assert.equal(auditRecords.length, 1);
    assert.equal(auditRecords[0].event, "approval-decision-recorded");
    assert.equal(auditRecords[0].decision.decision, "decline");
    assert.equal(auditRecords[0].decision.forwarded, true);
    assert.equal(auditRecords[0].outcome.appServerTouched, true);

    const serialized = JSON.stringify([pending, detailedPending, decision, started]);
    assert.equal(JSON.stringify([decision, started]).includes("approvaldecisiontoken0001"), false);
    for (const marker of [
      "Trigger approval",
      "/tmp/mock-workspace",
      "secret.txt",
      "cat /tmp",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
    const auditSerialized = JSON.stringify(auditRecords);
    for (const marker of [
      "Trigger approval",
      "/tmp/mock-workspace",
      "secret.txt",
      "cat /tmp",
      "approvaldecisiontoken0001",
    ]) {
      assert.equal(auditSerialized.includes(marker), false, `audit leaked ${marker}`);
    }
  } finally {
    await manager.closeAll();
    await rm(auditDir, { recursive: true, force: true });
  }
});

test("app-server session manager forwards permissions approvals only as empty decline", async () => {
  const auditDir = await mkdtemp(join(tmpdir(), "codex-session-manager-permissions-audit-"));
  const auditLogPath = join(auditDir, "approval-decisions.jsonl");
  const manager = createAppServerSessionManager({
    codexBin: process.execPath,
    codexArgs: [mockServer.pathname],
    timeoutMs: 1_000,
    approvalForwardingEnabled: true,
    approvalDecisionTimeoutMs: 1_000,
    approvalAuditLog: createApprovalAuditLog({ path: auditLogPath }),
    randomDecisionToken: () => "approvaldecisiontoken-permissions",
  });
  const workspace = {
    id: "default",
    label: "workspace",
    isDefault: true,
    cwd: process.cwd(),
  };

  try {
    const startedPromise = manager.startTurn({
      workspace,
      threadIdSuffix: "00000001",
      prompt: "Trigger permissions approval without returning prompt",
    });
    const pending = await waitForPendingApproval(manager, { workspace });
    assert.equal(pending.length, 1);
    assert.match(pending[0].sessionId, /^managed-/);
    assert.equal(pending[0].request.kind, "permissions");
    assert.equal(pending[0].request.hasPermissionsProfile, true);
    assert.equal(pending[0].request.hasAdditionalPermissions, true);
    assert.deepEqual(pending[0].request.safeApproveDecisions, []);
    assert.deepEqual(pending[0].request.safeDenyDecisions, ["decline"]);
    assert.throws(
      () =>
        manager.recordApprovalDecision({
          workspace,
          sessionId: pending[0].sessionId,
          requestKey: pending[0].request.requestKey,
          decisionToken: pending[0].request.decisionToken,
          decision: "accept",
        }),
      (error) =>
        error?.statusCode === 400 &&
        error.message === "Unsupported approval decision",
    );

    const decision = manager.recordApprovalDecision({
      workspace,
      sessionId: pending[0].sessionId,
      requestKey: pending[0].request.requestKey,
      decisionToken: pending[0].request.decisionToken,
      decision: "decline",
    });
    assert.equal(decision.browserDecision.forwarded, true);
    assert.equal(decision.browserDecision.appServerTouched, true);
    assert.equal(decision.browserDecision.auditLogged, true);
    assert.equal(decision.browserDecision.decision, "decline");
    assert.equal(decision.request.decision, "decline");

    const started = await startedPromise;
    const approval = started.probes.turnStart.approvalRequests[0];
    assert.equal(approval.kind, "permissions");
    assert.equal(approval.handled, true);
    assert.equal(approval.decision, "decline");
    assert.equal(started.probes.turnStart.unsupportedApprovalCount, 0);

    const auditRecords = (await readFile(auditLogPath, "utf8"))
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    assert.equal(auditRecords.length, 1);
    assert.equal(auditRecords[0].event, "approval-decision-recorded");
    assert.equal(auditRecords[0].request.kind, "permissions");
    assert.equal(auditRecords[0].request.hasPermissionsProfile, true);
    assert.equal(auditRecords[0].request.hasAdditionalPermissions, true);
    assert.equal(auditRecords[0].request.safeApproveDecisionCount, 0);
    assert.equal(auditRecords[0].request.safeDenyDecisionCount, 1);
    assert.equal(auditRecords[0].decision.decision, "decline");
    assert.equal(auditRecords[0].outcome.appServerTouched, true);

    const serialized = JSON.stringify([pending, decision, started]);
    assert.equal(JSON.stringify([decision, started]).includes("approvaldecisiontoken-permissions"), false);
    for (const marker of [
      "Trigger permissions approval",
      "/tmp/mock-workspace",
      "private-read",
      "private-write",
      "private-token-value",
      "\"fileSystem\"",
      "\"network\"",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
    const auditSerialized = JSON.stringify(auditRecords);
    for (const marker of [
      "Trigger permissions approval",
      "/tmp/mock-workspace",
      "private-read",
      "private-write",
      "private-token-value",
      "approvaldecisiontoken-permissions",
      "\"fileSystem\"",
      "\"network\"",
    ]) {
      assert.equal(auditSerialized.includes(marker), false, `audit leaked ${marker}`);
    }
  } finally {
    await manager.closeAll();
    await rm(auditDir, { recursive: true, force: true });
  }
});

test("app-server session manager can forward opt-in accept-once approval decisions", async () => {
  const auditDir = await mkdtemp(join(tmpdir(), "codex-session-manager-approval-accept-audit-"));
  const auditLogPath = join(auditDir, "approval-decisions.jsonl");
  const manager = createAppServerSessionManager({
    codexBin: process.execPath,
    codexArgs: [mockServer.pathname],
    timeoutMs: 1_000,
    approvalForwardingEnabled: true,
    approvalDecisionTimeoutMs: 1_000,
    approvalAuditLog: createApprovalAuditLog({ path: auditLogPath }),
    randomDecisionToken: () => "approvaldecisiontoken0003",
  });
  const workspace = {
    id: "default",
    label: "workspace",
    isDefault: true,
    cwd: process.cwd(),
  };

  try {
    const startedPromise = manager.startTurn({
      workspace,
      threadIdSuffix: "00000001",
      prompt: "Trigger approval without returning prompt",
    });
    const pending = await waitForPendingApproval(manager, { workspace });
    assert.equal(pending.length, 1);
    assert.deepEqual(pending[0].request.safeApproveDecisions, ["accept"]);
    assert.throws(
      () =>
        manager.recordApprovalDecision({
          workspace,
          sessionId: pending[0].sessionId,
          requestKey: pending[0].request.requestKey,
          decisionToken: pending[0].request.decisionToken,
          decision: "accept",
        }),
      (error) =>
        error?.statusCode === 403 &&
        error.message === "Approval accept decisions are disabled",
    );

    const accepted = manager.recordApprovalDecision({
      workspace,
      sessionId: pending[0].sessionId,
      requestKey: pending[0].request.requestKey,
      decisionToken: pending[0].request.decisionToken,
      decision: "accept",
      allowApprove: true,
    });
    assert.equal(accepted.browserDecision.decision, "accept");
    assert.equal(accepted.browserDecision.forwarded, true);
    assert.equal(accepted.browserDecision.reason, "approval-decision-forwarded-accept-once");
    assert.equal(accepted.request.decision, "accept");

    const started = await startedPromise;
    assert.equal(started.probes.turnStart.approvalRequests[0].decision, "accept");

    const auditRecords = (await readFile(auditLogPath, "utf8"))
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    assert.equal(auditRecords.length, 1);
    assert.equal(auditRecords[0].event, "approval-decision-recorded");
    assert.equal(auditRecords[0].decision.decision, "accept");
    assert.equal(auditRecords[0].outcome.forwarded, true);

    const serialized = JSON.stringify([pending, accepted, started, auditRecords]);
    assert.equal(JSON.stringify([accepted, started, auditRecords]).includes("approvaldecisiontoken0003"), false);
    for (const marker of [
      "Trigger approval",
      "/tmp/mock-workspace",
      "secret.txt",
      "cat /tmp",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    await manager.closeAll();
    await rm(auditDir, { recursive: true, force: true });
  }
});

test("app-server session manager fails closed before forwarding when approval audit log is unavailable", async () => {
  const manager = createAppServerSessionManager({
    codexBin: process.execPath,
    codexArgs: [mockServer.pathname],
    timeoutMs: 1_000,
    approvalForwardingEnabled: true,
    approvalDecisionTimeoutMs: 25,
    approvalAuditLog: {
      persistent: true,
      hasRecordedDecision() {
        return false;
      },
      append() {
        throw new Error("audit log unavailable");
      },
    },
    randomDecisionToken: () => "approvaldecisiontoken0002",
  });
  const workspace = {
    id: "default",
    label: "workspace",
    isDefault: true,
    cwd: process.cwd(),
  };
  const startedPromise = manager.startTurn({
    workspace,
    threadIdSuffix: "00000001",
    prompt: "Trigger approval without returning prompt",
  });

  try {
    const pending = await waitForPendingApproval(manager, { workspace });
    assert.equal(pending.length, 1);
    assert.throws(
      () =>
        manager.recordApprovalDecision({
          workspace,
          sessionId: pending[0].sessionId,
          requestKey: pending[0].request.requestKey,
          decisionToken: pending[0].request.decisionToken,
          decision: "decline",
        }),
      (error) =>
        error?.statusCode === 500 &&
        error.message === "Approval decision audit log unavailable",
    );
    const stillPending = manager.listApprovalRequests({ workspace });
    assert.equal(stillPending.length, 1);
    assert.equal(stillPending[0].request.decision, null);
    const started = await startedPromise;
    assert.equal(started.probes.turnStart.approvalRequests[0].decision, "cancel");
  } finally {
    await manager.closeAll();
  }
});

async function waitForPendingApproval(manager, { workspace }) {
  for (let index = 0; index < 20; index += 1) {
    const pending = manager.listApprovalRequests({ workspace });
    if (pending.length > 0) {
      return pending;
    }
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  return [];
}

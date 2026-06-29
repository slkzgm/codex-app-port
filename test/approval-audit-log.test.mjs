import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import {
  approvalAuditReplayKey,
  createApprovalAuditLog,
  readRecordedApprovalReplayKeys,
  sanitizeApprovalAuditRecord,
} from "../src/dev-server/approval-audit-log.mjs";
import { createTurnSessionRegistry } from "../src/dev-server/turn-sessions.mjs";

test("approval audit log writes sanitized append-only JSONL", async () => {
  const dir = await mkdtemp(join(tmpdir(), "codex-approval-audit-"));
  const path = join(dir, "approval-decisions.jsonl");
  try {
    const log = createApprovalAuditLog({
      path,
      now: () => "2026-05-16T00:00:00.000Z",
    });
    log.append({
      event: "approval-decision-recorded",
      sessionId: "session-private",
      workspace: {
        id: "default",
        label: "codex-app-port-test",
        isDefault: true,
      },
      target: {
        threadIdSuffix: "abcd1234",
        turnIdSuffix: "turn5678",
      },
      request: {
        requestKey: "request1234-command-0",
        decisionToken: "privateapprovaltoken1234",
        kind: "command",
        method: "item/commandExecution/requestApproval",
        command: {
          present: true,
          charCount: 32,
          lineCount: 1,
          text: "cat /tmp/private/secret.txt",
        },
        safeDenyDecisions: ["decline", "cancel"],
      },
      browserDecision: {
        decision: "decline",
      },
    });
    log.append({
      event: "approval-decision-replay-rejected",
      sessionId: "session-private",
      request: {
        requestKey: "request1234-command-0",
        kind: "command",
      },
    });
    log.append({
      event: "approval-decision-recorded",
      sessionId: "session-private",
      workspace: {
        id: "default",
        label: "codex-app-port-test",
        isDefault: true,
      },
      target: {
        threadIdSuffix: "abcd1234",
        turnIdSuffix: "turn5678",
      },
      request: {
        requestKey: "request1234-file-1",
        decisionToken: "privatefileapprovaltoken1234",
        kind: "file-change",
        method: "item/fileChange/requestApproval",
        hasGrantRoot: true,
        grantRootBasename: "private-workspace",
        approvalDetail: {
          fileChange: {
            present: true,
            text: "Patch /tmp/private/secret.txt token=private-token-value",
            charCount: 53,
            lineCount: 2,
            returnedCharCount: 53,
            textReturned: true,
            grantRootPresent: true,
            grantRootBasename: "private-workspace",
            grantRootBasenameReturned: true,
            patchTextReturned: true,
            fileContentsReturned: true,
          },
        },
        safeDenyDecisions: ["decline", "cancel"],
      },
      browserDecision: {
        decision: "decline",
      },
    });

    const records = (await readFile(path, "utf8"))
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    assert.equal(records.length, 3);
    assert.equal(records[0].event, "approval-decision-recorded");
    assert.equal(records[1].event, "approval-decision-replay-rejected");
    assert.equal(records[2].event, "approval-decision-recorded");
    assert.equal(records[0].decision.decision, "decline");
    assert.equal(records[0].request.command.charCount, 32);
    assert.equal(records[2].request.fileChange.present, true);
    assert.equal(records[2].request.fileChange.grantRootPresent, true);
    assert.equal(records[2].request.fileChange.approvalPreview.charCount, 53);
    assert.equal(records[2].request.fileChange.approvalPreview.textReturned, false);
    assert.equal(records[2].request.fileChange.approvalPreview.patchTextReturned, false);
    assert.equal(records[2].request.fileChange.approvalPreview.fileContentsReturned, false);
    assert.equal(records[2].request.fileChange.pathsReturned, false);
    const serialized = JSON.stringify(records);
    assert.equal(serialized.includes("cat /tmp/private/secret.txt"), false);
    assert.equal(serialized.includes("secret.txt"), false);
    assert.equal(serialized.includes("private-workspace"), false);
    assert.equal(serialized.includes("private-token-value"), false);
    assert.equal(serialized.includes("privateapprovaltoken1234"), false);
    assert.equal(serialized.includes("privatefileapprovaltoken1234"), false);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("approval audit log exposes durable replay keys without sensitive payloads", async () => {
  const dir = await mkdtemp(join(tmpdir(), "codex-approval-replay-"));
  const path = join(dir, "approval-decisions.jsonl");
  try {
    const log = createApprovalAuditLog({
      path,
      now: () => "2026-05-16T00:00:00.000Z",
    });
    const record = approvalDecisionRecord();
    const written = log.append(record);
    const replayKey = approvalAuditReplayKey(written);

    assert.equal(typeof replayKey, "string");
    assert.equal(log.hasRecordedDecision(record), true);
    assert.equal(
      log.hasRecordedDecision({
        ...record,
        request: {
          ...record.request,
          requestKey: "different-request",
        },
      }),
      false,
    );
    assert.equal(readRecordedApprovalReplayKeys(path).has(replayKey), true);

    const serialized = await readFile(path, "utf8");
    assert.equal(serialized.includes("cat /tmp/private/secret.txt"), false);
    assert.equal(serialized.includes("privateapprovaltoken1234"), false);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("turn session registry rejects decisions already recorded in persistent audit log", async () => {
  const dir = await mkdtemp(join(tmpdir(), "codex-approval-durable-replay-"));
  const path = join(dir, "approval-decisions.jsonl");
  const now = () => "2026-05-16T00:00:00.000Z";
  try {
    const log = createApprovalAuditLog({ path, now });
    const firstRegistry = createTurnSessionRegistry({
      approvalAuditLog: log,
      now,
      randomId: () => "fixed001",
      randomDecisionToken: () => "decisiontoken0001",
    });
    const firstSession = firstRegistry.record(turnStartPayloadWithApproval());
    const firstRequest = firstSession.approvals.requests[0];
    firstRegistry.recordApprovalDecision({
      sessionId: firstSession.sessionId,
      requestKey: firstRequest.requestKey,
      decisionToken: firstRequest.decisionToken,
      decision: "decline",
    });

    const secondRegistry = createTurnSessionRegistry({
      approvalAuditLog: log,
      now,
      randomId: () => "fixed001",
      randomDecisionToken: () => "decisiontoken0001",
    });
    const secondSession = secondRegistry.record(turnStartPayloadWithApproval());
    const secondRequest = secondSession.approvals.requests[0];
    assert.throws(
      () =>
        secondRegistry.recordApprovalDecision({
          sessionId: secondSession.sessionId,
          requestKey: secondRequest.requestKey,
          decisionToken: secondRequest.decisionToken,
          decision: "decline",
        }),
      /already recorded in audit log/,
    );

    const records = (await readFile(path, "utf8"))
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    assert.deepEqual(
      records.map((record) => record.event),
      ["approval-decision-recorded", "approval-decision-replay-rejected"],
    );
    const serialized = JSON.stringify(records);
    assert.equal(serialized.includes("Sensitive prompt"), false);
    assert.equal(serialized.includes("cat /tmp/private"), false);
    assert.equal(serialized.includes("decisiontoken0001"), false);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("approval audit log refuses symlink log files", async () => {
  const dir = await mkdtemp(join(tmpdir(), "codex-approval-audit-symlink-"));
  try {
    await mkdir(join(dir, "target"), { recursive: true });
    await writeFile(join(dir, "target", "real.jsonl"), "", "utf8");
    const linkPath = join(dir, "approval-decisions.jsonl");
    await symlink(join(dir, "target", "real.jsonl"), linkPath);
    const log = createApprovalAuditLog({ path: linkPath });
    assert.throws(
      () =>
        log.append({
          event: "approval-decision-recorded",
          request: {
            kind: "command",
          },
        }),
      /ELOOP|too many symbolic links/i,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("sanitizeApprovalAuditRecord keeps only bounded metadata", () => {
  const record = sanitizeApprovalAuditRecord(
    {
      event: "unknown",
      workspace: {
        id: "default",
        label: "workspace",
        isDefault: true,
      },
      request: {
        kind: "command",
        command: {
          present: true,
          charCount: 5000,
          lineCount: 3,
          text: "rm -rf /tmp/private",
        },
      },
    },
    { generatedAt: "2026-05-16T00:00:00.000Z" },
  );
  assert.equal(record.event, "approval-decision-replay-rejected");
  assert.equal(record.request.command.charCount, 5000);
  assert.equal(record.request.fileChange.present, false);
  assert.equal(record.request.fileChange.approvalPreview.textReturned, false);
  assert.equal(JSON.stringify(record).includes("rm -rf"), false);
});

function approvalDecisionRecord() {
  return {
    event: "approval-decision-recorded",
    sessionId: "session-private",
    workspace: {
      id: "default",
      label: "codex-app-port-test",
      isDefault: true,
    },
    target: {
      threadIdSuffix: "abcd1234",
      turnIdSuffix: "turn5678",
    },
    request: {
      requestKey: "request1234-command-0",
      decisionToken: "privateapprovaltoken1234",
      kind: "command",
      method: "item/commandExecution/requestApproval",
      requestIdSuffix: "request1234",
      itemIdSuffix: "item9999",
      command: {
        present: true,
        charCount: 32,
        lineCount: 1,
        text: "cat /tmp/private/secret.txt",
      },
      safeDenyDecisions: ["decline", "cancel"],
    },
    browserDecision: {
      decision: "decline",
    },
  };
}

function turnStartPayloadWithApproval() {
  return {
    ok: true,
    generatedAt: "2026-05-16T00:00:00.000Z",
    workspace: {
      id: "default",
      label: "workspace",
      isDefault: true,
    },
    action: {
      execution: "started",
      modelTraffic: true,
      appServerTouched: true,
      approvalMode: "deny-only",
    },
    target: {
      threadIdSuffix: "abcd1234",
      turnIdSuffix: "turn5678",
    },
    prompt: {
      charCount: 16,
      lineCount: 1,
      text: "Sensitive prompt",
    },
    probes: {
      turnStart: {
        completedStatus: "completed",
        approvalRequestCount: 1,
        deniedApprovalCount: 0,
        unsupportedApprovalCount: 0,
        approvalRequests: [
          {
            kind: "command",
            method: "item/commandExecution/requestApproval",
            requestIdSuffix: "request1234",
            itemIdSuffix: "item9999",
            command: {
              present: true,
              charCount: 32,
              lineCount: 1,
              text: "cat /tmp/private/secret.txt",
            },
            safeDenyDecisions: ["decline", "cancel"],
            handled: false,
            decision: null,
          },
        ],
        eventCount: 0,
        returnedEventCount: 0,
        events: [],
      },
    },
    notifications: {},
  };
}

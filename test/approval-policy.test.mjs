import assert from "node:assert/strict";
import { test } from "node:test";

import {
  SERVER_REQUEST_METHODS,
  buildApprovalDecisionResponse,
  buildDenyOnlyApprovalResponse,
  summarizeApprovalRequestDetail,
  summarizeApprovalRequest,
} from "../src/app-server/approval-policy.mjs";

test("summarizeApprovalRequest strips raw command strings and paths", () => {
  const summary = summarizeApprovalRequest({
    id: "request-1234567890abcdef",
    method: SERVER_REQUEST_METHODS.commandApproval,
    params: {
      threadId: "thread-sensitive-1234567890",
      turnId: "turn-sensitive-1234567890",
      itemId: "item-sensitive-1234567890",
      approvalId: "approval-sensitive-1234567890",
      startedAtMs: 1778929000000,
      reason: "Needs network",
      command: "cat /tmp/private-workspace/secret.txt",
      cwd: "/tmp/private-workspace",
      networkApprovalContext: { host: "private.example.test" },
      additionalPermissions: { fileSystem: "danger-full-access" },
      proposedExecpolicyAmendment: ["private-command"],
      proposedNetworkPolicyAmendments: [{ host: "private.example.test" }],
      availableDecisions: ["accept", "decline", "cancel"],
    },
  });

  const serialized = JSON.stringify(summary);
  assert.equal(summary.kind, "command");
  assert.equal(summary.command.present, true);
  assert.equal(summary.command.charCount, 37);
  assert.equal(summary.cwdBasename, "private-workspace");
  assert.equal(summary.hasNetworkApprovalContext, true);
  assert.deepEqual(summary.safeApproveDecisions, ["accept"]);
  assert.deepEqual(summary.safeDenyDecisions, ["decline", "cancel"]);
  assert.equal(serialized.includes("cat /tmp/private-workspace/secret.txt"), false);
  assert.equal(serialized.includes("/tmp/private-workspace"), false);
  assert.equal(serialized.includes("secret.txt"), false);
  assert.equal(serialized.includes("private.example.test"), false);
});

test("summarizeApprovalRequest redacts approval reasons", () => {
  const summary = summarizeApprovalRequest({
    id: "request-1234567890abcdef",
    method: SERVER_REQUEST_METHODS.fileChangeApproval,
    params: {
      threadId: "thread-sensitive-1234567890",
      turnId: "turn-sensitive-1234567890",
      itemId: "item-sensitive-1234567890",
      startedAtMs: 1778929000000,
      reason: "Write /tmp/private-workspace/secret.txt with token=sk-proj-secretvalue",
      grantRoot: "/tmp/private-workspace",
    },
  });

  const serialized = JSON.stringify(summary);
  assert.equal(summary.kind, "file-change");
  assert.equal(summary.reason, "Write <path> with token=<secret>");
  assert.equal(summary.hasGrantRoot, true);
  assert.equal(summary.grantRootBasename, "private-workspace");
  assert.equal(serialized.includes("/tmp/private-workspace"), false);
  assert.equal(serialized.includes("secret.txt"), false);
  assert.equal(serialized.includes("sk-proj-secretvalue"), false);
});

test("summarizeApprovalRequest exposes permissions requests as deny-only without permission details", () => {
  const summary = summarizeApprovalRequest({
    id: "request-permissions-1234567890abcdef",
    method: SERVER_REQUEST_METHODS.permissionsApproval,
    params: {
      threadId: "thread-sensitive-1234567890",
      turnId: "turn-sensitive-1234567890",
      itemId: "item-sensitive-1234567890",
      startedAtMs: 1778929000000,
      reason: "Need write access to /tmp/private-workspace/secret.txt with token=sk-proj-secretvalue",
      cwd: "/tmp/private-workspace",
      permissions: {
        fileSystem: {
          read: ["/tmp/private-workspace"],
          write: ["/tmp/private-workspace/secret.txt"],
        },
        network: {
          enabled: true,
        },
      },
    },
  });

  const serialized = JSON.stringify(summary);
  assert.equal(summary.kind, "permissions");
  assert.equal(summary.cwdBasename, "private-workspace");
  assert.equal(summary.hasPermissionsProfile, true);
  assert.equal(summary.hasAdditionalPermissions, true);
  assert.deepEqual(summary.safeApproveDecisions, []);
  assert.deepEqual(summary.safeDenyDecisions, ["decline"]);
  assert.equal(summary.unsupported, undefined);
  for (const marker of [
    "/tmp/private-workspace",
    "secret.txt",
    "sk-proj-secretvalue",
    "\"fileSystem\"",
    "\"network\"",
  ]) {
    assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
  }
});

test("summarizeApprovalRequest classifies unsupported server requests without leaking payloads", () => {
  const requests = [
    {
      message: {
        id: "request-tool-input-1234567890abcdef",
        method: SERVER_REQUEST_METHODS.toolRequestUserInput,
        params: {
          threadId: "thread-sensitive-1234567890",
          turnId: "turn-sensitive-1234567890",
          itemId: "item-sensitive-1234567890",
          questions: [
            {
              id: "private-question-id",
              header: "Secret",
              question: "Enter token sk-proj-secretvalue",
            },
          ],
          autoResolutionMs: 120000,
        },
      },
      kind: "tool-user-input",
      assertions: (summary) => {
        assert.equal(summary.questionCount, 1);
        assert.equal(summary.autoResolutionMsPresent, true);
        assert.equal(summary.questionsReturned, false);
        assert.equal(summary.promptTextReturned, false);
      },
      forbidden: ["private-question-id", "sk-proj-secretvalue", "Enter token"],
    },
    {
      message: {
        id: "request-elicitation-1234567890abcdef",
        method: SERVER_REQUEST_METHODS.mcpServerElicitationRequest,
        params: {
          threadId: "thread-sensitive-1234567890",
          turnId: "turn-sensitive-1234567890",
          serverName: "private-mcp-server",
          mode: "openai/form",
          message: "Authorize https://private.example.test",
          requestedSchema: {
            properties: {
              token: { type: "string", description: "sk-proj-secretvalue" },
            },
          },
        },
      },
      kind: "mcp-elicitation",
      assertions: (summary) => {
        assert.equal(summary.mode, "openai/form");
        assert.equal(summary.hasServerName, true);
        assert.equal(summary.hasRequestedSchema, true);
        assert.equal(summary.serverNameReturned, false);
        assert.equal(summary.messageReturned, false);
        assert.equal(summary.requestedSchemaReturned, false);
      },
      forbidden: ["private-mcp-server", "private.example.test", "sk-proj-secretvalue"],
    },
    {
      message: {
        id: "request-dynamic-tool-1234567890abcdef",
        method: SERVER_REQUEST_METHODS.dynamicToolCall,
        params: {
          threadId: "thread-sensitive-1234567890",
          turnId: "turn-sensitive-1234567890",
          callId: "private-call-id",
          namespace: "private-namespace",
          tool: "private-tool",
          arguments: {
            path: "/tmp/private-workspace/secret.txt",
            token: "sk-proj-secretvalue",
          },
        },
      },
      kind: "dynamic-tool-call",
      assertions: (summary) => {
        assert.equal(summary.hasCallId, true);
        assert.equal(summary.hasTool, true);
        assert.equal(summary.hasNamespace, true);
        assert.equal(summary.argumentKeyCount, 2);
        assert.equal(summary.toolNameReturned, false);
        assert.equal(summary.argumentsReturned, false);
        assert.equal(summary.executed, false);
      },
      forbidden: [
        "private-call-id",
        "private-namespace",
        "private-tool",
        "/tmp/private-workspace",
        "secret.txt",
        "sk-proj-secretvalue",
      ],
    },
    {
      message: {
        id: "request-auth-refresh-1234567890abcdef",
        method: SERVER_REQUEST_METHODS.chatgptAuthTokensRefresh,
        params: {
          previousAccountId: "private-account-id",
          reason: "unauthorized",
        },
      },
      kind: "auth-token-refresh",
      assertions: (summary) => {
        assert.equal(summary.hasPreviousAccountId, true);
        assert.equal(summary.reason, "unauthorized");
        assert.equal(summary.previousAccountIdReturned, false);
        assert.equal(summary.authTokensReturned, false);
      },
      forbidden: ["private-account-id"],
    },
    {
      message: {
        id: "request-attestation-1234567890abcdef",
        method: SERVER_REQUEST_METHODS.attestationGenerate,
        params: { nonce: "private-attestation-nonce" },
      },
      kind: "attestation",
      assertions: (summary) => {
        assert.equal(summary.parameterKeyCount, 1);
        assert.equal(summary.attestationReturned, false);
      },
      forbidden: ["private-attestation-nonce"],
    },
    {
      message: {
        id: "request-current-time-1234567890abcdef",
        method: SERVER_REQUEST_METHODS.currentTimeRead,
        params: {
          threadId: "thread-sensitive-1234567890",
        },
      },
      kind: "current-time",
      assertions: (summary) => {
        assert.equal(summary.currentTimeReturned, false);
      },
      forbidden: ["thread-sensitive-1234567890"],
    },
  ];

  for (const { message, kind, assertions, forbidden } of requests) {
    const summary = summarizeApprovalRequest(message);
    const serialized = JSON.stringify(summary);
    assert.equal(summary.kind, kind);
    assert.equal(summary.unsupported, true);
    assert.deepEqual(summary.safeApproveDecisions, []);
    assert.deepEqual(summary.safeDenyDecisions, []);
    assert.equal(summary.rawParamsReturned, false);
    assert.equal(summary.rawPayloadReturned, false);
    assertions(summary);
    for (const marker of forbidden) {
      assert.equal(serialized.includes(marker), false, `${kind} leaked ${marker}`);
    }
  }
});

test("summarizeApprovalRequestDetail returns redacted command preview only", () => {
  const detail = summarizeApprovalRequestDetail({
    method: SERVER_REQUEST_METHODS.commandApproval,
    params: {
      command:
        "curl https://private.example.test/token?x=1 -H token=sk-proj-secretvalue -o /tmp/private-workspace/secret.txt",
    },
  });

  const serialized = JSON.stringify(detail);
  assert.equal(detail.command.textReturned, true);
  assert.equal(detail.command.rawTextReturned, false);
  assert.equal(detail.rawCommandReturned, false);
  assert.equal(detail.pathsReturned, false);
  assert.equal(detail.secretsReturned, false);
  assert.equal(detail.command.text.includes("<url>"), true);
  assert.equal(detail.command.text.includes("<secret>"), true);
  assert.equal(detail.command.text.includes("<path>"), true);
  for (const marker of [
    "private.example.test",
    "sk-proj-secretvalue",
    "/tmp/private-workspace",
    "secret.txt",
  ]) {
    assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
  }
});

test("summarizeApprovalRequestDetail returns redacted file-change preview only", () => {
  const detail = summarizeApprovalRequestDetail({
    method: SERVER_REQUEST_METHODS.fileChangeApproval,
    params: {
      reason: "Write /tmp/private-workspace/secret.txt with token=sk-proj-secretvalue",
      grantRoot: "/tmp/private-workspace",
    },
  });

  const serialized = JSON.stringify(detail);
  assert.equal(detail.command.textReturned, false);
  assert.equal(detail.fileChange.textReturned, true);
  assert.equal(detail.fileChange.rawTextReturned, false);
  assert.equal(detail.fileChange.patchTextReturned, false);
  assert.equal(detail.fileChange.fileContentsReturned, false);
  assert.equal(detail.fileChange.grantRootBasename, "private-workspace");
  assert.equal(detail.rawFileChangeReturned, false);
  assert.equal(detail.pathsReturned, false);
  assert.equal(detail.secretsReturned, false);
  assert.equal(detail.fileChange.text.includes("<path>"), true);
  assert.equal(detail.fileChange.text.includes("<secret>"), true);
  for (const marker of [
    "/tmp/private-workspace",
    "secret.txt",
    "sk-proj-secretvalue",
  ]) {
    assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
  }
});

test("buildApprovalDecisionResponse accepts only single-use command and file approvals", () => {
  assert.deepEqual(
    buildApprovalDecisionResponse({
      method: SERVER_REQUEST_METHODS.commandApproval,
      params: {},
    }, { decision: "accept" }),
    {
      handled: true,
      method: SERVER_REQUEST_METHODS.commandApproval,
      response: { decision: "accept" },
      accepted: true,
      reason: "approval-decision-forwarded-accept-once",
    },
  );
  assert.equal(
    buildApprovalDecisionResponse({
      method: SERVER_REQUEST_METHODS.commandApproval,
      params: {},
    }, { decision: "acceptForSession" }).handled,
    false,
  );
  assert.equal(
    buildApprovalDecisionResponse({
      method: SERVER_REQUEST_METHODS.permissionsApproval,
      params: {},
    }, { decision: "accept" }).handled,
    false,
  );
  const deniedPermissions = buildApprovalDecisionResponse({
    method: SERVER_REQUEST_METHODS.permissionsApproval,
    params: {},
  }, { decision: "decline" });
  assert.deepEqual(deniedPermissions, {
    handled: true,
    method: SERVER_REQUEST_METHODS.permissionsApproval,
    decision: "decline",
    response: {
      permissions: {
        fileSystem: null,
        network: null,
      },
      scope: "turn",
      strictAutoReview: true,
    },
    accepted: false,
    reason: "approval-decision-forwarded-deny-only",
  });
  for (const decision of ["cancel", "denied", "abort"]) {
    const response = buildApprovalDecisionResponse({
      method: SERVER_REQUEST_METHODS.permissionsApproval,
      params: {},
    }, { decision });
    assert.equal(response.handled, false, `${decision} should not answer permissions approval`);
    assert.equal(response.reason, "unsupported-approval-decision");
  }
});

test("buildDenyOnlyApprovalResponse denies command, file-change, and permissions approvals", () => {
  assert.deepEqual(
    buildDenyOnlyApprovalResponse({
      method: SERVER_REQUEST_METHODS.commandApproval,
      params: {},
    }),
    {
      handled: true,
      method: SERVER_REQUEST_METHODS.commandApproval,
      response: { decision: "decline" },
    },
  );
  assert.deepEqual(
    buildDenyOnlyApprovalResponse(
      {
        method: SERVER_REQUEST_METHODS.fileChangeApproval,
        params: {},
      },
      { interrupt: true },
    ),
    {
      handled: true,
      method: SERVER_REQUEST_METHODS.fileChangeApproval,
      response: { decision: "cancel" },
    },
  );
  assert.deepEqual(
    buildDenyOnlyApprovalResponse({
      method: SERVER_REQUEST_METHODS.permissionsApproval,
      params: {
        cwd: "/tmp/private-workspace",
        permissions: {},
      },
    }),
    {
      handled: true,
      method: SERVER_REQUEST_METHODS.permissionsApproval,
      decision: "decline",
      response: {
        permissions: {
          fileSystem: null,
          network: null,
        },
        scope: "turn",
        strictAutoReview: true,
      },
    },
  );
});

test("buildDenyOnlyApprovalResponse refuses unsupported approval requests", () => {
  for (const method of [
    SERVER_REQUEST_METHODS.toolRequestUserInput,
    SERVER_REQUEST_METHODS.mcpServerElicitationRequest,
    SERVER_REQUEST_METHODS.dynamicToolCall,
    SERVER_REQUEST_METHODS.chatgptAuthTokensRefresh,
    SERVER_REQUEST_METHODS.attestationGenerate,
    SERVER_REQUEST_METHODS.currentTimeRead,
  ]) {
    const response = buildDenyOnlyApprovalResponse({
      method,
      params: {},
    });

    assert.equal(response.handled, false);
    assert.equal(response.method, method);
    assert.equal(response.response, null);
    assert.equal(response.reason, "unsupported-approval-request");
  }
});

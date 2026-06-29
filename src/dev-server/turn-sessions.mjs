import { randomBytes, timingSafeEqual } from "node:crypto";

export const MAX_TURN_SESSION_RECORDS = 20;
export const MAX_TURN_SESSION_APPROVALS = 20;
export const MAX_TURN_SESSION_EVENTS = 100;
export const APPROVAL_DECISION_TOKEN_BYTES = 16;

export function createTurnSessionRegistry({
  now = () => new Date().toISOString(),
  randomId = () => randomBytes(4).toString("hex"),
  randomDecisionToken = () => randomBytes(APPROVAL_DECISION_TOKEN_BYTES).toString("hex"),
  approvalAuditLog = null,
} = {}) {
  const sessions = [];
  return {
    record(turnStartPayload) {
      const session = sanitizeTurnSession(turnStartPayload, {
        recordedAt: now(),
        sessionId: `session-${randomId()}`,
        decisionToken: () => randomDecisionToken(),
      });
      sessions.unshift(session);
      sessions.splice(MAX_TURN_SESSION_RECORDS);
      return clone(session);
    },
    list({ workspaceId = null } = {}) {
      return sessions
        .filter((session) => !workspaceId || session.workspace?.id === workspaceId)
        .map(clone);
    },
    listApprovalRequests({ workspaceId = null } = {}) {
      return sessions
        .filter((session) => !workspaceId || session.workspace?.id === workspaceId)
        .flatMap((session) =>
          session.approvals.requests.map((request) => ({
            sessionId: session.sessionId,
            workspace: session.workspace,
            target: session.target,
            request,
            browserDecision: session.browserDecisions[request.requestKey] ?? null,
          })),
        )
        .map(clone);
    },
    recordApprovalDecision({ workspaceId = null, sessionId, requestKey, decision, decisionToken }) {
      const session = sessions.find(
        (candidate) =>
          candidate.sessionId === sessionId &&
          (!workspaceId || candidate.workspace?.id === workspaceId),
      );
      if (!session) {
        const error = new Error("Unknown turn session");
        error.statusCode = 404;
        throw error;
      }
      const request = session.approvals.requests.find(
        (candidate) => candidate.requestKey === requestKey,
      );
      if (!request) {
        const error = new Error("Unknown approval request");
        error.statusCode = 404;
        throw error;
      }
      if (!approvalTokensEqual(request.decisionToken, decisionToken)) {
        const error = new Error("Invalid approval decision token");
        error.statusCode = 403;
        throw error;
      }
      if (session.browserDecisions[request.requestKey]) {
        writeApprovalAuditLog(approvalAuditLog, {
          event: "approval-decision-replay-rejected",
          sessionId: session.sessionId,
          workspace: session.workspace,
          target: session.target,
          request,
        });
        const error = new Error("Approval decision already recorded");
        error.statusCode = 409;
        throw error;
      }
      const safeDecisions = new Set(request.safeDenyDecisions);
      if (!safeDecisions.has(decision)) {
        const error = new Error("Only deny-only approval decisions are accepted");
        error.statusCode = 400;
        throw error;
      }
      const replayRecord = {
        event: "approval-decision-recorded",
        sessionId: session.sessionId,
        workspace: session.workspace,
        target: session.target,
        request,
      };
      if (hasRecordedApprovalDecision(approvalAuditLog, replayRecord)) {
        writeApprovalAuditLog(approvalAuditLog, {
          ...replayRecord,
          event: "approval-decision-replay-rejected",
        });
        const error = new Error("Approval decision already recorded in audit log");
        error.statusCode = 409;
        throw error;
      }
      const browserDecision = {
        decision: safeString(decision, 40),
        recordedAt: now(),
        forwarded: false,
        appServerTouched: false,
        reason: "approval-decision-forwarding-not-implemented",
      };
      browserDecision.auditLogged = writeApprovalAuditLog(approvalAuditLog, {
        event: "approval-decision-recorded",
        sessionId: session.sessionId,
        workspace: session.workspace,
        target: session.target,
        request,
        browserDecision,
      });
      session.browserDecisions[request.requestKey] = browserDecision;
      return clone({
        sessionId: session.sessionId,
        workspace: session.workspace,
        target: session.target,
        request,
        browserDecision,
      });
    },
    clear() {
      sessions.splice(0, sessions.length);
    },
  };
}

function hasRecordedApprovalDecision(approvalAuditLog, record) {
  if (!approvalAuditLog || typeof approvalAuditLog.hasRecordedDecision !== "function") {
    return false;
  }
  try {
    return Boolean(approvalAuditLog.hasRecordedDecision(record));
  } catch {
    const error = new Error("Approval decision audit log unavailable");
    error.statusCode = 500;
    throw error;
  }
}

function writeApprovalAuditLog(approvalAuditLog, record) {
  if (!approvalAuditLog || typeof approvalAuditLog.append !== "function") {
    return false;
  }
  try {
    approvalAuditLog.append(record);
    return true;
  } catch {
    const error = new Error("Approval decision audit log unavailable");
    error.statusCode = 500;
    throw error;
  }
}

function sanitizeTurnSession(payload, { recordedAt, sessionId, decisionToken }) {
  const turnStart = payload?.probes?.turnStart ?? {};
  const approvals = Array.isArray(turnStart.approvalRequests) ? turnStart.approvalRequests : [];
  return {
    sessionId,
    recordedAt: safeString(recordedAt, 40),
    generatedAt: safeString(payload?.generatedAt, 40),
    workspace: sanitizeWorkspace(payload?.workspace),
    action: {
      execution: safeString(payload?.action?.execution, 40) ?? "started",
      modelTraffic: Boolean(payload?.action?.modelTraffic),
      appServerTouched: Boolean(payload?.action?.appServerTouched),
      approvalMode: safeString(payload?.action?.approvalMode, 40),
    },
    target: {
      threadIdSuffix: safeString(payload?.target?.threadIdSuffix, 16),
      turnIdSuffix: safeString(payload?.target?.turnIdSuffix, 16),
    },
    prompt: {
      charCount: safeCount(payload?.prompt?.charCount),
      lineCount: safeCount(payload?.prompt?.lineCount),
      textReturned: false,
    },
    status: safeString(turnStart.completedStatus, 40),
    approvals: {
      requestCount: safeCount(turnStart.approvalRequestCount),
      deniedCount: safeCount(turnStart.deniedApprovalCount),
      unsupportedCount: safeCount(turnStart.unsupportedApprovalCount),
      returnedRequestCount: Math.min(approvals.length, MAX_TURN_SESSION_APPROVALS),
      requests: approvals
        .slice(0, MAX_TURN_SESSION_APPROVALS)
        .map((approval, index) => sanitizeApproval(approval, index, { decisionToken })),
    },
    browserDecisions: {},
    events: sanitizeTurnEvents(turnStart),
    notifications: sanitizeCounts(payload?.notifications),
  };
}

function sanitizeWorkspace(workspace) {
  if (!workspace || typeof workspace !== "object") {
    return null;
  }
  return {
    id: safeString(workspace.id, 80),
    label: safeString(workspace.label, 120),
    isDefault: Boolean(workspace.isDefault),
  };
}

function sanitizeApproval(approval, index, { decisionToken }) {
  return {
    requestKey: approvalKey(approval, index),
    decisionToken: safeDecisionToken(decisionToken()),
    kind: safeString(approval?.kind, 60) ?? "unknown",
    method: safeString(approval?.method, 100),
    requestIdSuffix: safeString(approval?.requestIdSuffix, 16),
    turnIdSuffix: safeString(approval?.turnIdSuffix, 16),
    itemIdSuffix: safeString(approval?.itemIdSuffix, 16),
    approvalIdSuffix: safeString(approval?.approvalIdSuffix, 16),
    reason: safeString(approval?.reason, 160),
    command: {
      present: Boolean(approval?.command?.present),
      charCount: safeCount(approval?.command?.charCount),
      lineCount: safeCount(approval?.command?.lineCount),
    },
    hasGrantRoot: Boolean(approval?.hasGrantRoot),
    grantRootBasename: safeString(approval?.grantRootBasename, 64),
    hasPermissionsProfile: Boolean(approval?.hasPermissionsProfile),
    hasAdditionalPermissions: Boolean(approval?.hasAdditionalPermissions),
    safeDenyDecisions: Array.isArray(approval?.safeDenyDecisions)
      ? approval.safeDenyDecisions.map((value) => safeString(value, 40)).filter(Boolean).slice(0, 4)
      : [],
    handled: Boolean(approval?.handled),
    decision: safeString(approval?.decision, 40),
  };
}

function sanitizeTurnEvents(turnStart) {
  const events = Array.isArray(turnStart?.events) ? turnStart.events : [];
  const items = events.slice(-MAX_TURN_SESSION_EVENTS).map(sanitizeTurnEvent).filter(Boolean);
  return {
    eventCount: safeCount(turnStart?.eventCount ?? events.length),
    returnedEventCount: items.length,
    items,
  };
}

function sanitizeTurnEvent(event) {
  if (!event || typeof event !== "object" || Array.isArray(event)) {
    return null;
  }
  const method = safeString(event.method, 100);
  if (!method) {
    return null;
  }
  const output = {
    method,
    threadIdSuffix: safeString(event.threadIdSuffix, 16),
    turnIdSuffix: safeString(event.turnIdSuffix, 16),
    itemType: safeString(event.itemType, 80),
    status: safeStatus(event.status),
  };
  const liveText = sanitizeLiveText(event.liveText);
  if (liveText) {
    output.liveText = liveText;
  }
  const terminalLifecycle = sanitizeTerminalLifecycle(event.terminalLifecycle);
  if (terminalLifecycle) {
    output.terminalLifecycle = terminalLifecycle;
  }
  return output;
}

function sanitizeLiveText(liveText) {
  if (!liveText || typeof liveText !== "object" || Array.isArray(liveText)) {
    return null;
  }
  const text = cleanEventText(liveText.text, 1_000);
  if (!text) {
    return null;
  }
  return {
    role: safeString(liveText.role, 40) ?? "agent",
    text,
    textCharCount: text.length,
    truncated: Boolean(liveText.truncated),
  };
}

function sanitizeTerminalLifecycle(lifecycle) {
  if (!lifecycle || typeof lifecycle !== "object" || Array.isArray(lifecycle)) {
    return null;
  }
  const kind = safeString(lifecycle.kind, 80);
  if (!kind) {
    return null;
  }
  const output = {
    kind,
    itemIdSuffix: safeString(lifecycle.itemIdSuffix, 16),
    stream: ["stdout", "stderr", "unknown"].includes(lifecycle.stream)
      ? lifecycle.stream
      : null,
    process: sanitizeTerminalIdentifier(lifecycle.process),
    input: sanitizeTerminalTextSummary(lifecycle.input),
    output: sanitizeTerminalOutputSummary(lifecycle.output),
    stdout: sanitizeTerminalTextSummary(lifecycle.stdout),
    stderr: sanitizeTerminalTextSummary(lifecycle.stderr),
    exitCode: Number.isSafeInteger(lifecycle.exitCode) ? lifecycle.exitCode : null,
    capReached: Boolean(lifecycle.capReached),
    inputTextReturned: false,
    outputTextReturned: false,
    commandTextReturned: false,
    sessionIdentifierReturned: false,
  };
  if (!output.itemIdSuffix) {
    delete output.itemIdSuffix;
  }
  if (!output.stream) {
    delete output.stream;
  }
  if (!output.process.present) {
    delete output.process;
  }
  if (!output.input.present) {
    delete output.input;
  }
  if (!output.output.present) {
    delete output.output;
  }
  if (!output.stdout.present) {
    delete output.stdout;
  }
  if (!output.stderr.present) {
    delete output.stderr;
  }
  if (output.exitCode === null) {
    delete output.exitCode;
  }
  if (!output.capReached) {
    delete output.capReached;
  }
  return output;
}

function sanitizeTerminalIdentifier(value) {
  return {
    present: Boolean(value?.present),
    charCount: safeCount(value?.charCount),
    valueReturned: false,
    suffixReturned: false,
  };
}

function sanitizeTerminalTextSummary(value) {
  return {
    present: Boolean(value?.present),
    charCount: safeCount(value?.charCount),
    lineCount: safeCount(value?.lineCount),
    textReturned: false,
    capReached: Boolean(value?.capReached),
  };
}

function sanitizeTerminalOutputSummary(value) {
  const textSummary = sanitizeTerminalTextSummary(value);
  return {
    ...textSummary,
    encodedCharCount: safeCount(value?.encodedCharCount),
    estimatedByteCount: safeCount(value?.estimatedByteCount),
  };
}

function approvalTokensEqual(expected, actual) {
  const expectedToken = safeDecisionToken(expected);
  const actualToken = safeDecisionToken(actual);
  if (!expectedToken || !actualToken) {
    return false;
  }
  const expectedBuffer = Buffer.from(expectedToken, "utf8");
  const actualBuffer = Buffer.from(actualToken, "utf8");
  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }
  return timingSafeEqual(expectedBuffer, actualBuffer);
}

function safeDecisionToken(value) {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]{16,128}$/.test(value)) {
    return null;
  }
  return value;
}

function approvalKey(approval, index) {
  const key = [
    safeString(approval?.requestIdSuffix, 16),
    safeString(approval?.approvalIdSuffix, 16),
    safeString(approval?.itemIdSuffix, 16),
    safeString(approval?.kind, 40),
    String(index),
  ]
    .filter(Boolean)
    .join("-");
  return key || `approval-${index}`;
}

function sanitizeCounts(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  const output = {};
  for (const [key, count] of Object.entries(value).slice(0, 50)) {
    const safeKey = safeString(key, 100);
    if (safeKey) {
      output[safeKey] = safeCount(count);
    }
  }
  return output;
}

function safeString(value, maxLength) {
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

function safeStatus(value) {
  if (typeof value === "string") {
    return safeString(value, 80);
  }
  if (value && typeof value === "object" && typeof value.type === "string") {
    return safeString(value.type, 80);
  }
  return null;
}

function cleanEventText(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }
  const clean = value
    .replace(/\r\n|\r/g, "\n")
    .replace(/[^\x09\x0A\x20-\x7E]/g, " ")
    .replace(/~\/[^\s"'`<>]+/g, "[path]")
    .replace(/(?:\/[A-Za-z0-9._@-]+){2,}/g, "[path]")
    .replace(/[A-Za-z]:\\[^\s"'`<>]+/g, "[path]")
    .replace(/\bsk(?:-proj)?-[A-Za-z0-9_-]{8,}\b/g, "[secret]")
    .replace(/\bgh[opsu]_[A-Za-z0-9_]{8,}\b/g, "[secret]")
    .replace(/\bAKIA[0-9A-Z]{16}\b/g, "[secret]")
    .replace(
      /\b(password|token|api[_-]?key|secret)(\s*[:=]\s*)(["']?)[^\s"'`]+/gi,
      "$1$2$3[secret]",
    )
    .replace(/\bSensitive\b/g, "[redacted]")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
  if (clean.length <= maxLength) {
    return clean;
  }
  return `${clean.slice(0, Math.max(0, maxLength - 3))}...`;
}

function safeCount(value) {
  return Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

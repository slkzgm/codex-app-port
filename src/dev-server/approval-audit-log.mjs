import {
  constants,
  closeSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  writeSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import process from "node:process";

export const APPROVAL_AUDIT_LOG_VERSION = 1;
export const MAX_APPROVAL_AUDIT_LINE_BYTES = 4096;
export const MAX_APPROVAL_AUDIT_REPLAY_LINES = 5000;

const APPROVAL_AUDIT_EVENTS = new Set([
  "approval-decision-recorded",
  "approval-decision-replay-rejected",
]);

export function defaultApprovalAuditLogPath(env = process.env) {
  const stateHome = env.XDG_STATE_HOME || join(homedir(), ".local", "state");
  return join(stateHome, "codex-app-port", "approval-decisions.jsonl");
}

export function createApprovalAuditLog({
  path = defaultApprovalAuditLogPath(),
  now = () => new Date().toISOString(),
} = {}) {
  if (typeof path !== "string" || path.length === 0) {
    throw new Error("Approval audit log path must be a non-empty string");
  }

  return {
    persistent: true,
    append(record) {
      const auditRecord = sanitizeApprovalAuditRecord(record, { generatedAt: now() });
      const line = `${JSON.stringify(auditRecord)}\n`;
      if (Buffer.byteLength(line, "utf8") > MAX_APPROVAL_AUDIT_LINE_BYTES) {
        throw new Error("Approval audit log record exceeded size limit");
      }
      appendLineNoFollow(path, line);
      return auditRecord;
    },
    hasRecordedDecision(record) {
      const auditRecord = sanitizeApprovalAuditRecord(
        { ...record, event: "approval-decision-recorded" },
        { generatedAt: now() },
      );
      const key = approvalAuditReplayKey(auditRecord);
      if (!key) {
        return false;
      }
      return readRecordedApprovalReplayKeys(path).has(key);
    },
  };
}

export function sanitizeApprovalAuditRecord(record, { generatedAt = null } = {}) {
  const event = APPROVAL_AUDIT_EVENTS.has(record?.event)
    ? record.event
    : "approval-decision-replay-rejected";
  const request = record?.request && typeof record.request === "object" ? record.request : {};
  const command = request.command && typeof request.command === "object" ? request.command : {};
  const fileChange = sanitizeFileChangeAuditMetadata(request);
  const browserDecision =
    record?.browserDecision && typeof record.browserDecision === "object"
      ? record.browserDecision
      : null;

  return {
    version: APPROVAL_AUDIT_LOG_VERSION,
    event,
    generatedAt: safeString(generatedAt, 40),
    workspace: sanitizeWorkspace(record?.workspace),
    sessionId: safeString(record?.sessionId, 40),
    target: {
      threadIdSuffix: safeString(record?.target?.threadIdSuffix, 16),
      turnIdSuffix: safeString(record?.target?.turnIdSuffix, 16),
    },
    request: {
      requestKey: safeString(request.requestKey, 80),
      kind: safeString(request.kind, 60) ?? "unknown",
      method: safeString(request.method, 100),
      requestIdSuffix: safeString(request.requestIdSuffix, 16),
      threadIdSuffix: safeString(request.threadIdSuffix, 16),
      turnIdSuffix: safeString(request.turnIdSuffix, 16),
      itemIdSuffix: safeString(request.itemIdSuffix, 16),
      approvalIdSuffix: safeString(request.approvalIdSuffix, 16),
      command: {
        present: Boolean(command.present),
        charCount: safeCount(command.charCount),
        lineCount: safeCount(command.lineCount),
      },
      fileChange,
      safeDenyDecisionCount: Array.isArray(request.safeDenyDecisions)
        ? Math.min(request.safeDenyDecisions.length, 8)
        : 0,
      safeApproveDecisionCount: Array.isArray(request.safeApproveDecisions)
        ? Math.min(request.safeApproveDecisions.length, 4)
        : 0,
      hasPermissionsProfile: Boolean(request.hasPermissionsProfile),
      hasAdditionalPermissions: Boolean(request.hasAdditionalPermissions),
    },
    decision: browserDecision
      ? {
          decision: safeString(browserDecision.decision, 40),
          forwarded: Boolean(browserDecision.forwarded),
          appServerTouched: Boolean(browserDecision.appServerTouched),
        }
      : null,
    outcome: {
      accepted: event === "approval-decision-recorded",
      replayRejected: event === "approval-decision-replay-rejected",
      forwarded: Boolean(browserDecision?.forwarded),
      appServerTouched: Boolean(browserDecision?.appServerTouched),
    },
  };
}

function sanitizeFileChangeAuditMetadata(request) {
  const fileChange = request?.fileChange && typeof request.fileChange === "object"
    ? request.fileChange
    : {};
  const preview =
    fileChange.approvalPreview && typeof fileChange.approvalPreview === "object"
      ? fileChange.approvalPreview
      : request?.approvalDetail?.fileChange && typeof request.approvalDetail.fileChange === "object"
        ? request.approvalDetail.fileChange
        : {};
  const grantRootPresent =
    Boolean(request?.hasGrantRoot) || Boolean(preview.grantRootPresent);
  return {
    present: request?.kind === "file-change" || grantRootPresent || Boolean(preview.present),
    grantRootPresent,
    approvalPreview: {
      present: Boolean(preview.present),
      charCount: safeCount(preview.charCount),
      lineCount: safeCount(preview.lineCount),
      returnedCharCount: 0,
      textReturned: false,
      rawTextReturned: false,
      patchTextReturned: false,
      fileContentsReturned: false,
      pathsReturned: false,
    },
    rawTextReturned: false,
    patchTextReturned: false,
    fileContentsReturned: false,
    pathsReturned: false,
  };
}

export function readRecordedApprovalReplayKeys(
  path,
  { maxLines = MAX_APPROVAL_AUDIT_REPLAY_LINES } = {},
) {
  const content = readFileNoFollow(path);
  const keys = new Set();
  if (!content) {
    return keys;
  }

  const lines = content.split(/\r?\n/).filter(Boolean).slice(-maxLines);
  for (const line of lines) {
    let parsed = null;
    try {
      parsed = JSON.parse(line);
    } catch {
      continue;
    }
    const record = sanitizeApprovalAuditRecord(parsed);
    if (record.event !== "approval-decision-recorded") {
      continue;
    }
    const key = approvalAuditReplayKey(record);
    if (key) {
      keys.add(key);
    }
  }
  return keys;
}

export function approvalAuditReplayKey(record) {
  const request = record?.request && typeof record.request === "object" ? record.request : {};
  const target = record?.target && typeof record.target === "object" ? record.target : {};
  const workspace = record?.workspace && typeof record.workspace === "object" ? record.workspace : {};
  const parts = [
    APPROVAL_AUDIT_LOG_VERSION,
    workspace.id,
    record?.sessionId,
    target.threadIdSuffix,
    target.turnIdSuffix,
    request.requestKey,
    request.kind,
    request.method,
    request.requestIdSuffix,
    request.itemIdSuffix,
    request.approvalIdSuffix,
  ].map((value) => safeString(String(value ?? ""), 120));
  if (!parts.some(Boolean)) {
    return null;
  }
  return parts.map((part) => part ?? "").join("|");
}

function readFileNoFollow(path) {
  let fd = null;
  try {
    fd = openSync(path, constants.O_RDONLY | noFollowFlag());
    return readFileSync(fd, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") {
      return "";
    }
    throw error;
  } finally {
    if (fd !== null) {
      closeSync(fd);
    }
  }
}

function appendLineNoFollow(path, line) {
  const directory = dirname(path);
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const directoryStat = lstatSync(directory);
  if (!directoryStat.isDirectory() || directoryStat.isSymbolicLink()) {
    throw new Error("Approval audit log directory is unsafe");
  }
  const flags = constants.O_APPEND | constants.O_CREAT | constants.O_WRONLY | noFollowFlag();
  const fd = openSync(path, flags, 0o600);
  try {
    writeSync(fd, line, null, "utf8");
  } finally {
    closeSync(fd);
  }
}

function noFollowFlag() {
  return Number.isSafeInteger(constants.O_NOFOLLOW) ? constants.O_NOFOLLOW : 0;
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

function safeCount(value) {
  return Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

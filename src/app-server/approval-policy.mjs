import { basename } from "node:path";

export const SERVER_REQUEST_METHODS = Object.freeze({
  commandApproval: "item/commandExecution/requestApproval",
  fileChangeApproval: "item/fileChange/requestApproval",
  permissionsApproval: "item/permissions/requestApproval",
  legacyExecCommandApproval: "execCommandApproval",
  legacyApplyPatchApproval: "applyPatchApproval",
});

const COMMAND_DENIAL = Object.freeze({
  continue: "decline",
  interrupt: "cancel",
});
const LEGACY_COMMAND_DENIAL = Object.freeze({
  continue: "denied",
  interrupt: "abort",
});
const EMPTY_PERMISSION_DENIAL = Object.freeze({
  fileSystem: null,
  network: null,
});
const DEFAULT_APPROVAL_COMMAND_PREVIEW_CHARS = 1_000;
const DEFAULT_APPROVAL_FILE_CHANGE_PREVIEW_CHARS = 600;

export function summarizeApprovalRequest(message) {
  const method = stringOrNull(message?.method);
  const params = objectOrEmpty(message?.params);
  const base = {
    method,
    requestIdSuffix: idSuffix(message?.id),
    threadIdSuffix: idSuffix(params.threadId),
    turnIdSuffix: idSuffix(params.turnId),
    itemIdSuffix: idSuffix(params.itemId),
    startedAtMs: safeNumber(params.startedAtMs),
    reason: summarizeApprovalReason(params.reason, { maxChars: 160 }),
  };

  switch (method) {
    case SERVER_REQUEST_METHODS.commandApproval:
      return {
        ...base,
        kind: "command",
        approvalIdSuffix: idSuffix(params.approvalId),
        command: summarizeCommand(params.command),
        cwdBasename: safeBasename(params.cwd),
        hasNetworkApprovalContext: Boolean(params.networkApprovalContext),
        hasAdditionalPermissions: Boolean(params.additionalPermissions),
        hasExecpolicyAmendment: Boolean(params.proposedExecpolicyAmendment),
        networkPolicyAmendmentCount: safeArray(params.proposedNetworkPolicyAmendments).length,
        availableDecisionCount: safeArray(params.availableDecisions).length,
        safeApproveDecisions: includesDecision(params.availableDecisions, "accept")
          ? ["accept"]
          : [],
        safeDenyDecisions: ["decline", "cancel"],
      };
    case SERVER_REQUEST_METHODS.fileChangeApproval:
      return {
        ...base,
        kind: "file-change",
        hasGrantRoot: typeof params.grantRoot === "string" && params.grantRoot.length > 0,
        grantRootBasename: safeBasename(params.grantRoot),
        safeApproveDecisions: ["accept"],
        safeDenyDecisions: ["decline", "cancel"],
      };
    case SERVER_REQUEST_METHODS.permissionsApproval:
      return {
        ...base,
        kind: "permissions",
        cwdBasename: safeBasename(params.cwd),
        hasPermissionsProfile: Boolean(params.permissions),
        hasAdditionalPermissions: Boolean(params.permissions),
        availableDecisionCount: 1,
        safeApproveDecisions: [],
        safeDenyDecisions: ["decline"],
      };
    case SERVER_REQUEST_METHODS.legacyExecCommandApproval:
      return {
        ...base,
        kind: "legacy-command",
        command: summarizeCommand(params.command),
        cwdBasename: safeBasename(params.cwd),
        safeApproveDecisions: [],
        safeDenyDecisions: ["denied", "abort"],
      };
    case SERVER_REQUEST_METHODS.legacyApplyPatchApproval:
      return {
        ...base,
        kind: "legacy-patch",
        safeApproveDecisions: [],
        safeDenyDecisions: ["denied", "abort"],
      };
    default:
      return {
        ...base,
        kind: "unknown",
        safeApproveDecisions: [],
        safeDenyDecisions: [],
        unsupported: true,
      };
  }
}

export function buildApprovalDecisionResponse(message, { decision }) {
  const method = stringOrNull(message?.method);
  if (method === SERVER_REQUEST_METHODS.permissionsApproval && decision !== "decline") {
    return {
      handled: false,
      method,
      response: null,
      accepted: false,
      reason: "unsupported-approval-decision",
    };
  }
  if (
    decision === "accept" &&
    (method === SERVER_REQUEST_METHODS.commandApproval ||
      method === SERVER_REQUEST_METHODS.fileChangeApproval)
  ) {
    return {
      handled: true,
      method,
      response: {
        decision: "accept",
      },
      accepted: true,
      reason: "approval-decision-forwarded-accept-once",
    };
  }
  if (decision === "decline" || decision === "denied") {
    return {
      ...buildDenyOnlyApprovalResponse(message, { interrupt: false }),
      accepted: false,
      reason: "approval-decision-forwarded-deny-only",
    };
  }
  if (decision === "cancel" || decision === "abort") {
    return {
      ...buildDenyOnlyApprovalResponse(message, { interrupt: true }),
      accepted: false,
      reason: "approval-decision-forwarded-deny-only",
    };
  }
  return {
    handled: false,
    method,
    response: null,
    accepted: false,
    reason: "unsupported-approval-decision",
  };
}

export function buildDenyOnlyApprovalResponse(message, { interrupt = false } = {}) {
  const method = stringOrNull(message?.method);
  switch (method) {
    case SERVER_REQUEST_METHODS.commandApproval:
    case SERVER_REQUEST_METHODS.fileChangeApproval:
      return {
        handled: true,
        method,
        response: {
          decision: interrupt ? COMMAND_DENIAL.interrupt : COMMAND_DENIAL.continue,
        },
      };
    case SERVER_REQUEST_METHODS.legacyExecCommandApproval:
    case SERVER_REQUEST_METHODS.legacyApplyPatchApproval:
      return {
        handled: true,
        method,
        response: {
          decision: interrupt ? LEGACY_COMMAND_DENIAL.interrupt : LEGACY_COMMAND_DENIAL.continue,
        },
      };
    case SERVER_REQUEST_METHODS.permissionsApproval:
      return {
        handled: true,
        method,
        decision: "decline",
        response: {
          permissions: { ...EMPTY_PERMISSION_DENIAL },
          scope: "turn",
          strictAutoReview: true,
        },
      };
    default:
      return {
        handled: false,
        method,
        response: null,
        reason: "unsupported-approval-request",
      };
  }
}

export function summarizeApprovalRequestDetail(
  message,
  {
    commandPreviewChars = DEFAULT_APPROVAL_COMMAND_PREVIEW_CHARS,
    fileChangePreviewChars = DEFAULT_APPROVAL_FILE_CHANGE_PREVIEW_CHARS,
  } = {},
) {
  const method = stringOrNull(message?.method);
  const params = objectOrEmpty(message?.params);
  if (
    method === SERVER_REQUEST_METHODS.commandApproval ||
    method === SERVER_REQUEST_METHODS.legacyExecCommandApproval
  ) {
    return {
      command: redactApprovalText(params.command, { maxChars: commandPreviewChars }),
      fileChange: emptyFileChangePreview(),
      rawCommandReturned: false,
      rawFileChangeReturned: false,
      pathsReturned: false,
      secretsReturned: false,
    };
  }
  if (
    method === SERVER_REQUEST_METHODS.fileChangeApproval ||
    method === SERVER_REQUEST_METHODS.legacyApplyPatchApproval
  ) {
    return {
      command: {
        present: false,
        textReturned: false,
        rawTextReturned: false,
        charCount: 0,
        lineCount: 0,
        returnedCharCount: 0,
        truncated: false,
        redactionCount: 0,
      },
      fileChange: summarizeFileChangeApprovalPreview(params, {
        maxChars: fileChangePreviewChars,
      }),
      rawCommandReturned: false,
      rawFileChangeReturned: false,
      pathsReturned: false,
      secretsReturned: false,
    };
  }
  return {
    command: {
      present: false,
      textReturned: false,
      rawTextReturned: false,
      charCount: 0,
      lineCount: 0,
      returnedCharCount: 0,
      truncated: false,
      redactionCount: 0,
    },
    fileChange: emptyFileChangePreview(),
    rawCommandReturned: false,
    rawFileChangeReturned: false,
    pathsReturned: false,
    secretsReturned: false,
  };
}

function summarizeApprovalReason(value, { maxChars }) {
  const redacted = redactApprovalText(value, { maxChars });
  return redacted.textReturned ? redacted.text : null;
}

function summarizeFileChangeApprovalPreview(params, { maxChars }) {
  const lines = ["file change approval"];
  const reason = summarizeApprovalReason(params.reason, { maxChars });
  const grantRootBasename = safeBasename(params.grantRoot);
  if (reason) {
    lines.push(`reason: ${reason}`);
  }
  if (grantRootBasename) {
    lines.push(`grant root basename: ${grantRootBasename}`);
  }
  lines.push("patch/content: not returned");
  const text = lines.join("\n");
  const redacted = redactApprovalText(text, { maxChars });
  return {
    ...redacted,
    present: true,
    textReturned: Boolean(redacted.text),
    rawTextReturned: false,
    grantRootPresent: typeof params.grantRoot === "string" && params.grantRoot.length > 0,
    grantRootBasename,
    grantRootBasenameReturned: Boolean(grantRootBasename),
    patchTextReturned: false,
    fileContentsReturned: false,
  };
}

function emptyFileChangePreview() {
  return {
    present: false,
    textReturned: false,
    rawTextReturned: false,
    charCount: 0,
    lineCount: 0,
    returnedCharCount: 0,
    truncated: false,
    redactionCount: 0,
    grantRootPresent: false,
    grantRootBasename: null,
    grantRootBasenameReturned: false,
    patchTextReturned: false,
    fileContentsReturned: false,
  };
}

function summarizeCommand(command) {
  if (typeof command !== "string" || command.length === 0) {
    return {
      present: false,
      charCount: 0,
    };
  }
  return {
    present: true,
    charCount: command.length,
    lineCount: command.split(/\r\n|\r|\n/).length,
  };
}

function redactApprovalText(value, { maxChars }) {
  if (typeof value !== "string" || value.length === 0) {
    return {
      present: false,
      textReturned: false,
      rawTextReturned: false,
      charCount: 0,
      lineCount: 0,
      returnedCharCount: 0,
      truncated: false,
      redactionCount: 0,
    };
  }

  const lineCount = value.split(/\r\n|\r|\n/).length;
  let text = value.replace(/\r\n|\r/g, "\n").replace(/[^\x09\x0A\x20-\x7E]/g, " ");
  const counts = {
    secrets: 0,
    urls: 0,
    emails: 0,
    paths: 0,
  };

  text = replaceAndCount(
    text,
    /\b(?:sk-[A-Za-z0-9_-]{8,}|gh[pousr]_[A-Za-z0-9_]{8,}|xox[baprs]-[A-Za-z0-9-]{8,})\b/g,
    "<secret>",
    counts,
    "secrets",
  );
  text = replaceAndCount(
    text,
    /\b((?:api[_-]?key|token|password|passwd|secret)=)[^\s"'`]+/gi,
    "$1<secret>",
    counts,
    "secrets",
  );
  text = replaceAndCount(
    text,
    /\bhttps?:\/\/[^\s"'`<>]+/gi,
    "<url>",
    counts,
    "urls",
  );
  text = replaceAndCount(
    text,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    "<email>",
    counts,
    "emails",
  );
  text = replaceAndCount(
    text,
    /(^|[\s"'`=:/])~\/[^\s"'`<>]+/g,
    "$1<path>",
    counts,
    "paths",
  );
  text = replaceAndCount(
    text,
    /\b[A-Za-z]:\\[^\s"'`<>]+/g,
    "<path>",
    counts,
    "paths",
  );
  text = replaceAndCount(
    text,
    /(^|[\s"'`=:/])\/[^\s"'`<>]+/g,
    "$1<path>",
    counts,
    "paths",
  );

  const truncated = text.length > maxChars;
  const returnedText = text.slice(0, maxChars).trimEnd();
  const redactionCount = counts.secrets + counts.urls + counts.emails + counts.paths;
  return {
    present: true,
    text: returnedText,
    textReturned: returnedText.length > 0,
    rawTextReturned: false,
    charCount: value.length,
    lineCount,
    returnedCharCount: returnedText.length,
    truncated,
    redactionCount,
    secretsRedacted: counts.secrets,
    urlsRedacted: counts.urls,
    emailsRedacted: counts.emails,
    pathsRedacted: counts.paths,
  };
}

function replaceAndCount(text, pattern, replacement, counts, key) {
  return text.replace(pattern, (...args) => {
    counts[key] += 1;
    const match = args[0];
    if (typeof replacement === "function") {
      return replacement(match);
    }
    return replacement.replace(/\$(\d+)/g, (_, index) => args[Number(index)] ?? "");
  });
}

function idSuffix(value) {
  if (typeof value === "number" && Number.isSafeInteger(value)) {
    return String(value);
  }
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }
  return cleanDisplayText(value.slice(-12), 12);
}

function safeBasename(value) {
  if (typeof value !== "string") {
    return null;
  }
  return cleanDisplayText(basename(value) || null, 64);
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function includesDecision(value, decision) {
  return safeArray(value).some((entry) => entry === decision);
}

function safeNumber(value) {
  return Number.isFinite(value) ? value : null;
}

function objectOrEmpty(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function stringOrNull(value) {
  return typeof value === "string" ? value : null;
}

function cleanDisplayText(value, maxLength) {
  if (typeof value !== "string") {
    return null;
  }
  const clean = value.replace(/[^\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim();
  if (clean.length === 0) {
    return null;
  }
  if (clean.length <= maxLength) {
    return clean;
  }
  return `${clean.slice(0, Math.max(0, maxLength - 1))}.`;
}

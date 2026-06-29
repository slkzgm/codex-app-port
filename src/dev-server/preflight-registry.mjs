import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const DEFAULT_PREFLIGHT_TTL_MS = 5 * 60 * 1000;
export const MAX_PREFLIGHT_RECORDS = 100;
export const PREFLIGHT_TOKEN_BYTES = 16;

export function createPreflightRegistry({
  nowMs = () => Date.now(),
  randomToken = () => randomBytes(PREFLIGHT_TOKEN_BYTES).toString("hex"),
  ttlMs = DEFAULT_PREFLIGHT_TTL_MS,
  maxRecords = MAX_PREFLIGHT_RECORDS,
} = {}) {
  const records = [];
  return {
    register({ kind, workspace, intent }) {
      const issuedAtMs = nowMs();
      const record = {
        token: `preflight-${safeTokenPart(randomToken())}`,
        kind: safeString(kind, 80),
        workspaceId: safeString(workspace?.id, 80),
        issuedAtMs,
        expiresAtMs: issuedAtMs + ttlMs,
        intentHash: hashIntent(intent),
        used: false,
      };
      if (!record.kind || !record.workspaceId) {
        throw new Error("Preflight record is missing scope metadata");
      }
      records.unshift(record);
      pruneRecords(records, { nowMs: issuedAtMs, maxRecords });
      return publicPreflight(record);
    },
    consume({ token, kind, workspace, intent }) {
      const record = records.find((candidate) => tokenEqual(candidate.token, token));
      if (!record) {
        throwPreflightError("Unknown preflight token", 404);
      }
      if (record.expiresAtMs < nowMs()) {
        throwPreflightError("Expired preflight token", 410);
      }
      if (record.used) {
        throwPreflightError("Preflight token already consumed", 409);
      }
      const sameScope =
        record.kind === safeString(kind, 80) && record.workspaceId === safeString(workspace?.id, 80);
      if (!sameScope || record.intentHash !== hashIntent(intent)) {
        throwPreflightError("Preflight token scope mismatch", 403);
      }
      record.used = true;
      return publicPreflight(record);
    },
    count() {
      pruneRecords(records, { nowMs: nowMs(), maxRecords });
      return records.length;
    },
  };
}

export function publicPreflight(record) {
  return {
    token: record.token,
    tokenIssued: true,
    issuedAt: new Date(record.issuedAtMs).toISOString(),
    expiresAt: new Date(record.expiresAtMs).toISOString(),
    scope: {
      kind: record.kind,
      workspaceId: record.workspaceId,
    },
    rawIntentStored: false,
    rawIntentReturned: false,
    intentHashReturned: false,
    oneTimeUseRequiredForMutation: true,
    consumed: Boolean(record.used),
  };
}

function pruneRecords(records, { nowMs, maxRecords }) {
  for (let index = records.length - 1; index >= 0; index -= 1) {
    if (records[index].expiresAtMs < nowMs) {
      records.splice(index, 1);
    }
  }
  records.splice(Math.max(0, maxRecords));
}

function hashIntent(intent) {
  return createHash("sha256").update(JSON.stringify(stableIntent(intent))).digest("hex");
}

function stableIntent(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(stableIntent);
  }
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, stableIntent(value[key])]),
  );
}

function tokenEqual(expected, actual) {
  if (typeof expected !== "string" || typeof actual !== "string") {
    return false;
  }
  const expectedBuffer = Buffer.from(expected, "utf8");
  const actualBuffer = Buffer.from(actual, "utf8");
  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }
  return timingSafeEqual(expectedBuffer, actualBuffer);
}

function throwPreflightError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
}

function safeTokenPart(value) {
  return typeof value === "string" && /^[A-Za-z0-9_-]{16,128}$/.test(value)
    ? value
    : randomBytes(PREFLIGHT_TOKEN_BYTES).toString("hex");
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

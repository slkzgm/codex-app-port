import { randomBytes } from "node:crypto";
import { lstat, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename as pathBasename, relative, resolve, sep, join } from "node:path";
import process from "node:process";

import {
  buildDenyOnlyApprovalResponse,
  summarizeApprovalRequest,
} from "./approval-policy.mjs";
import { JsonlRpcClient } from "./jsonl-rpc.mjs";
import {
  APP_SERVER_METHODS,
  normalizeConfigReadResponse,
  normalizeInitializeResponse,
  normalizeNotification,
  normalizeThread,
  normalizeThreadItem,
  normalizeThreadListResponse,
  normalizeThreadReadResponse,
  normalizeThreadSearchResponse,
  normalizeThreadStartResponse,
  normalizeTurn,
  normalizeTurnStartResponse,
} from "./protocol.mjs";

export const DEFAULT_TIMEOUT_MS = 10_000;
export const DEFAULT_THREAD_LIMIT = 5;
export const DEFAULT_THREAD_DETAIL_SCAN_LIMIT = 100;
export const DEFAULT_THREAD_DETAIL_TURN_LIMIT = 12;
export const DEFAULT_THREAD_DETAIL_ITEM_LIMIT = 80;
export const DEFAULT_THREAD_TURNS_PAGE_LIMIT = 25;
export const DEFAULT_THREAD_TURN_ITEMS_PAGE_LIMIT = 50;
export const DEFAULT_FS_DIRECTORY_ENTRY_LIMIT = 100;
export const DEFAULT_FS_DIRECTORY_ENTRY_SCAN_LIMIT = 1_000;
export const DEFAULT_FS_DIRECTORY_PATH_LIMIT = 500;
export const DEFAULT_TRANSCRIPT_TURN_LIMIT = 20;
export const DEFAULT_TRANSCRIPT_ITEM_LIMIT = 120;
export const DEFAULT_TRANSCRIPT_ITEM_TEXT_LIMIT = 2_000;
export const DEFAULT_TRANSCRIPT_TOTAL_TEXT_LIMIT = 20_000;
export const DEFAULT_CHANGES_TURN_LIMIT = 20;
export const DEFAULT_CHANGES_ITEM_LIMIT = 120;
export const DEFAULT_CHANGES_PER_ITEM_LIMIT = 50;
export const DEFAULT_CHANGE_DIFF_LINE_LIMIT = 200;
export const DEFAULT_CHANGE_DIFF_TEXT_LIMIT = 6_000;
export const DEFAULT_STREAM_DELTA_TEXT_LIMIT = 1_000;
export const DEFAULT_LOADED_SESSION_LIMIT = 50;
export const DEFAULT_THREAD_SEARCH_LIMIT = 20;
export const DEFAULT_THREAD_SEARCH_TERM_LIMIT = 200;
export const DEFAULT_THREAD_RENAME_LIMIT = 120;
export const DEFAULT_THREAD_GOAL_OBJECTIVE_LIMIT = 4_000;
export const DEFAULT_THREAD_GOAL_TOKEN_BUDGET_LIMIT = 10_000_000;
export const DEFAULT_THREAD_ROLLBACK_MAX_TURNS = 50;
export const DEFAULT_STEER_PROMPT_LIMIT = 4_000;
export const DEFAULT_TURN_EVENT_LOG_LIMIT = 100;
export const DEFAULT_INTEGRATION_ITEM_LIMIT = 20;
export const DEFAULT_INTEGRATION_NAME_LIMIT = 80;
export const DEFAULT_TERMINAL_COMMAND_TIMEOUT_MS = 5_000;
export const DEFAULT_PROCESS_SPAWN_TIMEOUT_MS = 5_000;

const TRANSCRIPT_ITEM_TYPES = new Set(["agentMessage", "userMessage"]);
const THREAD_GOAL_STATUSES = new Set([
  "active",
  "paused",
  "blocked",
  "usageLimited",
  "budgetLimited",
  "complete",
]);
const THREAD_MEMORY_MODES = new Set(["enabled", "disabled"]);
const REALTIME_VOICES = new Set([
  "alloy",
  "arbor",
  "ash",
  "ballad",
  "breeze",
  "cedar",
  "coral",
  "cove",
  "echo",
  "ember",
  "juniper",
  "maple",
  "marin",
  "sage",
  "shimmer",
  "sol",
  "spruce",
  "vale",
  "verse",
]);
const CHANGE_PATH_FIELDS = [
  "path",
  "file",
  "filePath",
  "relativePath",
  "targetPath",
  "sourcePath",
];
const CHANGE_OLD_PATH_FIELDS = ["oldPath", "previousPath", "fromPath", "from"];
const CHANGE_NEW_PATH_FIELDS = ["newPath", "nextPath", "toPath", "to"];
const RAW_CHANGE_FIELD_NAMES = new Set([
  "command",
  "content",
  "diff",
  "newContent",
  "oldContent",
  "patch",
  "stderr",
  "stdout",
  "text",
  "unifiedDiff",
  "unified_diff",
]);
const EXTERNAL_AGENT_CONFIG_ITEM_TYPES = new Set([
  "AGENTS_MD",
  "CONFIG",
  "SKILLS",
  "PLUGINS",
  "MCP_SERVER_CONFIG",
  "SUBAGENTS",
  "HOOKS",
  "COMMANDS",
  "SESSIONS",
]);
const WORKSPACE_MESSAGE_TYPES = new Set(["headline", "announcement", "unknown"]);
const REMOTE_CONTROL_STATUSES = new Set(["disabled", "connecting", "connected", "errored", "unknown"]);
const REASONING_EFFORTS = new Set(["none", "minimal", "low", "medium", "high", "xhigh"]);
const COLLABORATION_MODE_KINDS = new Set(["default", "plan"]);

export function summarizeConfig(response) {
  const { config, origins, layers } = normalizeConfigReadResponse(response);
  return {
    model: config.model ?? null,
    modelProvider: config.model_provider ?? null,
    approvalPolicy: config.approval_policy ?? null,
    sandboxMode: config.sandbox_mode ?? null,
    profile: config.profile ?? null,
    profilesCount: config.profiles ? Object.keys(config.profiles).length : 0,
    originsCount: origins ? Object.keys(origins).length : 0,
    layersIncluded: Array.isArray(layers),
  };
}

export function summarizeInitialize(response) {
  const initialize = normalizeInitializeResponse(response);
  return {
    platformFamily: initialize.platformFamily,
    platformOs: initialize.platformOs,
  };
}

export function summarizeThreadList(response, { archived = false, unavailable = false } = {}) {
  const threads = normalizeThreadListResponse(response);
  const data = threads.data;
  return {
    count: data.length,
    hasNextCursor: Boolean(threads.nextCursor),
    hasBackwardsCursor: Boolean(threads.backwardsCursor),
    archived: Boolean(archived),
    unavailable: Boolean(unavailable),
    items: data.map((thread) => ({
      idSuffix: suffix(thread.id),
      archived: Boolean(archived),
      hasName: Boolean(thread.name),
      hasPreview: Boolean(thread.preview),
      status: statusLabel(thread.status),
      source: thread.source ?? null,
      modelProvider: thread.modelProvider ?? null,
      createdAt: thread.createdAt ?? null,
      updatedAt: thread.updatedAt ?? null,
      cwdBasename: basename(thread.cwd),
      hasGitInfo: Boolean(thread.gitInfo),
    })),
  };
}

export function summarizeThreadSearch(
  response,
  { archived = null, limit = DEFAULT_THREAD_SEARCH_LIMIT, searchTerm = "" } = {},
) {
  const results = normalizeThreadSearchResponse(response);
  const data = results.data;
  return {
    method: APP_SERVER_METHODS.threadSearch,
    searchTermCharCount: typeof searchTerm === "string" ? searchTerm.length : 0,
    searchTermLineCount: typeof searchTerm === "string" ? countLines(searchTerm) : 0,
    count: data.length,
    returnedCount: Math.min(data.length, limit),
    hasNextCursor: Boolean(results.nextCursor),
    hasBackwardsCursor: Boolean(results.backwardsCursor),
    archivedFilter: typeof archived === "boolean" ? archived : null,
    snippetCount: data.filter((result) => Boolean(result.snippet)).length,
    threadNameCount: data.filter((result) => Boolean(result.thread.name)).length,
    previewCount: data.filter((result) => Boolean(result.thread.preview)).length,
    cwdBasenameCount: data.filter((result) => Boolean(basename(result.thread.cwd))).length,
    items: data.slice(0, limit).map((result) => ({
      idSuffix: suffix(result.thread.id),
      hasSnippet: Boolean(result.snippet),
      hasName: Boolean(result.thread.name),
      hasPreview: Boolean(result.thread.preview),
      status: statusLabel(result.thread.status),
      source: result.thread.source ?? null,
      modelProvider: result.thread.modelProvider ?? null,
      createdAt: result.thread.createdAt ?? null,
      updatedAt: result.thread.updatedAt ?? null,
      cwdBasename: basename(result.thread.cwd),
      hasGitInfo: Boolean(result.thread.gitInfo),
    })),
    searchTermReturned: false,
    snippetsReturned: false,
    namesReturned: false,
    previewsReturned: false,
    fullIdsReturned: false,
    pathsReturned: false,
    cursorsReturned: false,
    rawPayloadReturned: false,
  };
}

export function summarizeThreadDetail(
  rawThread,
  {
    turnLimit = DEFAULT_THREAD_DETAIL_TURN_LIMIT,
    itemLimit = DEFAULT_THREAD_DETAIL_ITEM_LIMIT,
  } = {},
) {
  const thread = normalizeThread(rawThread);
  const turns = Array.isArray(thread?.turns) ? thread.turns : [];
  return {
    idSuffix: suffix(thread?.id),
    hasName: Boolean(thread?.name),
    hasPreview: Boolean(thread?.preview),
    ephemeral: Boolean(thread?.ephemeral),
    status: statusLabel(thread?.status),
    source: thread?.source ?? null,
    threadSource: thread?.threadSource ?? null,
    modelProvider: thread?.modelProvider ?? null,
    createdAt: thread?.createdAt ?? null,
    updatedAt: thread?.updatedAt ?? null,
    cwdBasename: basename(thread?.cwd),
    hasGitInfo: Boolean(thread?.gitInfo),
    turnCount: turns.length,
    returnedTurnCount: Math.min(turns.length, turnLimit),
    turns: turns.slice(-turnLimit).map((turn) => summarizeTurn(turn, { itemLimit })),
  };
}

export function summarizeThreadGoal(response, { threadIdSuffix = null } = {}) {
  const goal = response?.goal && typeof response.goal === "object" ? response.goal : null;
  const objective = typeof goal?.objective === "string" ? goal.objective : "";
  return {
    method: APP_SERVER_METHODS.threadGoalGet,
    threadIdSuffix: suffix(goal?.threadId) ?? (isValidSuffix(threadIdSuffix) ? threadIdSuffix : null),
    goalPresent: Boolean(goal),
    status: goal ? statusLabel(goal.status) : null,
    tokenBudgetPresent: Number.isFinite(goal?.tokenBudget),
    tokenBudget: Number.isFinite(goal?.tokenBudget) ? Math.max(0, Math.trunc(goal.tokenBudget)) : null,
    tokensUsed: Number.isFinite(goal?.tokensUsed) ? Math.max(0, Math.trunc(goal.tokensUsed)) : 0,
    timeUsedSeconds: Number.isFinite(goal?.timeUsedSeconds)
      ? Math.max(0, Math.trunc(goal.timeUsedSeconds))
      : 0,
    objectiveCharCount: objective.length,
    objectiveLineCount: objective ? countLines(objective) : 0,
    createdTimestampPresent: Number.isFinite(goal?.createdAt),
    updatedTimestampPresent: Number.isFinite(goal?.updatedAt),
    objectiveReturned: false,
    fullIdsReturned: false,
    timestampsReturned: false,
    rawPayloadReturned: false,
  };
}

export function summarizeThreadTurnsPage(response, { threadIdSuffix = null, limit = DEFAULT_THREAD_TURNS_PAGE_LIMIT } = {}) {
  const data = Array.isArray(response?.data) ? response.data : [];
  const safeLimit = Math.max(
    0,
    Math.min(
      DEFAULT_THREAD_TURNS_PAGE_LIMIT,
      Number.isFinite(limit) ? Math.trunc(limit) : DEFAULT_THREAD_TURNS_PAGE_LIMIT,
    ),
  );
  return {
    method: APP_SERVER_METHODS.threadTurnsList,
    threadIdSuffix: isValidSuffix(threadIdSuffix) ? threadIdSuffix : null,
    count: data.length,
    returnedTurnCount: Math.min(data.length, safeLimit),
    hasNextCursor: Boolean(response?.nextCursor),
    hasBackwardsCursor: Boolean(response?.backwardsCursor),
    itemsView: "notLoaded",
    sortDirection: "desc",
    turns: data.slice(0, safeLimit).map((turn) => ({
      idSuffix: suffix(turn?.id),
      status: statusLabel(turn?.status),
      itemsView: "notLoaded",
      startedTimestampPresent: Number.isFinite(turn?.startedAt),
      completedTimestampPresent: Number.isFinite(turn?.completedAt),
      durationMs: Number.isFinite(turn?.durationMs) ? Math.max(0, Math.trunc(turn.durationMs)) : null,
      itemCount: Array.isArray(turn?.items) ? turn.items.length : 0,
      itemsReturned: false,
    })),
    cursorValuesReturned: false,
    fullIdsReturned: false,
    timestampsReturned: false,
    itemContentReturned: false,
    pathsReturned: false,
    rawPayloadReturned: false,
  };
}

export function summarizeThreadTurnItemsPage(
  response,
  {
    threadIdSuffix = null,
    turnIdSuffix = null,
    limit = DEFAULT_THREAD_TURN_ITEMS_PAGE_LIMIT,
  } = {},
) {
  const data = Array.isArray(response?.data) ? response.data : [];
  const safeLimit = Math.max(
    0,
    Math.min(
      DEFAULT_THREAD_TURN_ITEMS_PAGE_LIMIT,
      Number.isFinite(limit) ? Math.trunc(limit) : DEFAULT_THREAD_TURN_ITEMS_PAGE_LIMIT,
    ),
  );
  return {
    method: APP_SERVER_METHODS.threadTurnsItemsList,
    threadIdSuffix: isValidSuffix(threadIdSuffix) ? threadIdSuffix : null,
    turnIdSuffix: isValidSuffix(turnIdSuffix) ? turnIdSuffix : null,
    count: data.length,
    returnedItemCount: Math.min(data.length, safeLimit),
    hasNextCursor: Boolean(response?.nextCursor),
    hasBackwardsCursor: Boolean(response?.backwardsCursor),
    sortDirection: "asc",
    items: data.slice(0, safeLimit).map(summarizeThreadTurnPageItem),
    cursorValuesReturned: false,
    fullIdsReturned: false,
    timestampsReturned: false,
    textReturned: false,
    commandReturned: false,
    outputReturned: false,
    pathsReturned: false,
    patchReturned: false,
    rawPayloadReturned: false,
  };
}

export function summarizeThreadRealtimeVoices(response) {
  const voices = response?.voices && typeof response.voices === "object" ? response.voices : {};
  const v1 = safeRealtimeVoices(voices.v1);
  const v2 = safeRealtimeVoices(voices.v2);
  const defaultV1 = safeRealtimeVoice(voices.defaultV1);
  const defaultV2 = safeRealtimeVoice(voices.defaultV2);
  return {
    method: APP_SERVER_METHODS.threadRealtimeListVoices,
    defaultV1,
    defaultV2,
    v1,
    v2,
    v1Count: v1.length,
    v2Count: v2.length,
    totalKnownVoiceCount: new Set([...v1, ...v2]).size,
    unknownVoiceCount:
      countUnknownRealtimeVoices(voices.v1) +
      countUnknownRealtimeVoices(voices.v2) +
      (voices.defaultV1 && !defaultV1 ? 1 : 0) +
      (voices.defaultV2 && !defaultV2 ? 1 : 0),
    paramsAccepted: false,
    modelTraffic: false,
    threadContentReturned: false,
    fullIdsReturned: false,
    pathsReturned: false,
    rawPayloadReturned: false,
  };
}

export function summarizeFsDirectory(
  response,
  {
    metadata = null,
    target = null,
    limit = DEFAULT_FS_DIRECTORY_ENTRY_LIMIT,
    scanLimit = DEFAULT_FS_DIRECTORY_ENTRY_SCAN_LIMIT,
  } = {},
) {
  const entries = Array.isArray(response?.entries) ? response.entries : [];
  const safeLimit = Math.max(
    0,
    Math.min(
      DEFAULT_FS_DIRECTORY_ENTRY_LIMIT,
      Number.isFinite(limit) ? Math.trunc(limit) : DEFAULT_FS_DIRECTORY_ENTRY_LIMIT,
    ),
  );
  const safeScanLimit = Math.max(
    safeLimit,
    Math.min(
      DEFAULT_FS_DIRECTORY_ENTRY_SCAN_LIMIT,
      Number.isFinite(scanLimit)
        ? Math.trunc(scanLimit)
        : DEFAULT_FS_DIRECTORY_ENTRY_SCAN_LIMIT,
    ),
  );
  const sanitizedEntries = [];
  let hiddenEntryCount = 0;
  let unsafeEntryNameCount = 0;
  let fileCount = 0;
  let directoryCount = 0;
  let otherCount = 0;

  for (const entry of entries.slice(0, safeScanLimit)) {
    const name = safeFsEntryName(entry?.fileName ?? entry?.name);
    if (!name) {
      unsafeEntryNameCount += 1;
      continue;
    }
    if (isHiddenFsName(name)) {
      hiddenEntryCount += 1;
      continue;
    }
    const isDirectory = Boolean(entry?.isDirectory);
    const isFile = Boolean(entry?.isFile);
    if (isDirectory) {
      directoryCount += 1;
    } else if (isFile) {
      fileCount += 1;
    } else {
      otherCount += 1;
    }
    if (sanitizedEntries.length < safeLimit) {
      sanitizedEntries.push({
        name,
        isDirectory,
        isFile,
      });
    }
  }

  return {
    method: APP_SERVER_METHODS.fsReadDirectory,
    methodsUsed: [APP_SERVER_METHODS.fsGetMetadata, APP_SERVER_METHODS.fsReadDirectory],
    target: {
      basename: target?.basename ?? null,
      depth: Number.isFinite(target?.depth) ? Math.max(0, Math.trunc(target.depth)) : 0,
      isWorkspaceRoot: Boolean(target?.isWorkspaceRoot),
      isDirectory: Boolean(metadata?.isDirectory),
      isFile: Boolean(metadata?.isFile),
      isSymlink: Boolean(metadata?.isSymlink),
      createdTimestampPresent: Number.isFinite(metadata?.createdAtMs) && metadata.createdAtMs > 0,
      modifiedTimestampPresent:
        Number.isFinite(metadata?.modifiedAtMs) && metadata.modifiedAtMs > 0,
      pathReturned: false,
      timestampsReturned: false,
    },
    entryCount: entries.length,
    scannedEntryCount: Math.min(entries.length, safeScanLimit),
    returnedEntryCount: sanitizedEntries.length,
    fileCount,
    directoryCount,
    otherCount,
    hiddenEntryCount,
    unsafeEntryNameCount,
    truncated: entries.length > safeScanLimit || sanitizedEntries.length < fileCount + directoryCount + otherCount,
    entries: sanitizedEntries,
    entryNamesReturned: true,
    fullPathsReturned: false,
    absolutePathReturned: false,
    fileContentsReturned: false,
    timestampsReturned: false,
    rawPayloadReturned: false,
  };
}

function safeFsEntryName(value) {
  const clean = cleanDisplayText(value, 120);
  if (!clean) {
    return null;
  }
  if (
    clean.includes("/") ||
    clean.includes("\\") ||
    clean.includes("\0") ||
    clean.includes("..") ||
    clean.endsWith(".lock") ||
    /:\/\/|www\./i.test(clean) ||
    /\b(?:sk-[A-Za-z0-9_-]{8,}|gh[pousr]_[A-Za-z0-9_]{8,}|xox[baprs]-[A-Za-z0-9-]{8,})\b/.test(clean)
  ) {
    return null;
  }
  return clean;
}

function isHiddenFsName(name) {
  return name.startsWith(".") || name === ".git" || name.startsWith(".git");
}

function safeRealtimeVoices(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return [...new Set(value.filter((voice) => REALTIME_VOICES.has(voice)))];
}

function safeRealtimeVoice(value) {
  return REALTIME_VOICES.has(value) ? value : null;
}

function countUnknownRealtimeVoices(value) {
  if (!Array.isArray(value)) {
    return 0;
  }
  return value.filter((voice) => !REALTIME_VOICES.has(voice)).length;
}

function summarizeThreadTurnPageItem(item) {
  return {
    idSuffix: suffix(item?.id),
    type: typeof item?.type === "string" ? item.type : "unknown",
    status: statusLabel(item?.status),
    phase: typeof item?.phase === "string" ? item.phase : null,
    hasText:
      typeof item?.text === "string" ||
      typeof item?.content === "string" ||
      Array.isArray(item?.content) ||
      Array.isArray(item?.contentItems),
    textLength: textLength(item),
    contentTypes: contentTypes(item),
    changeCount: Array.isArray(item?.changes) ? item.changes.length : 0,
    unsafeFieldsOmitted: hasUnsafeFields(item),
  };
}

export function summarizeTurn(turn, { itemLimit = DEFAULT_THREAD_DETAIL_ITEM_LIMIT } = {}) {
  const safeTurn = normalizeTurn(turn);
  const items = Array.isArray(safeTurn?.items) ? safeTurn.items : [];
  return {
    idSuffix: suffix(safeTurn?.id),
    status: statusLabel(safeTurn?.status),
    itemsView: typeof safeTurn?.itemsView === "string" ? safeTurn.itemsView : null,
    startedAt: safeTurn?.startedAt ?? null,
    completedAt: safeTurn?.completedAt ?? null,
    durationMs: safeTurn?.durationMs ?? null,
    itemCount: items.length,
    returnedItemCount: Math.min(items.length, itemLimit),
    items: items.slice(-itemLimit).map(summarizeThreadItem),
  };
}

export function summarizeThreadItem(item) {
  const safeItem = normalizeThreadItem(item);
  return {
    idSuffix: suffix(safeItem?.id),
    type: typeof safeItem?.type === "string" ? safeItem.type : "unknown",
    status: statusLabel(safeItem?.status),
    phase: typeof safeItem?.phase === "string" ? safeItem.phase : null,
    hasText: typeof safeItem?.text === "string" || typeof safeItem?.content === "string",
    textLength: textLength(safeItem),
    contentTypes: contentTypes(safeItem),
    changeCount: Array.isArray(safeItem?.changes) ? safeItem.changes.length : 0,
  };
}

export function summarizeThreadTranscript(
  rawThread,
  {
    turnLimit = DEFAULT_TRANSCRIPT_TURN_LIMIT,
    itemLimit = DEFAULT_TRANSCRIPT_ITEM_LIMIT,
    itemTextLimit = DEFAULT_TRANSCRIPT_ITEM_TEXT_LIMIT,
    totalTextLimit = DEFAULT_TRANSCRIPT_TOTAL_TEXT_LIMIT,
  } = {},
) {
  const thread = normalizeThread(rawThread);
  const turns = Array.isArray(thread?.turns) ? thread.turns : [];
  let remainingText = totalTextLimit;
  let totalTextCharCount = 0;
  let truncated = false;

  const transcriptTurns = turns.slice(-turnLimit).map((turn) => {
    const items = Array.isArray(turn?.items) ? turn.items : [];
    const transcriptItems = [];
    for (const item of items.slice(-itemLimit)) {
      if (!TRANSCRIPT_ITEM_TYPES.has(item?.type)) {
        continue;
      }
      const rawText = extractTranscriptText(item);
      if (!rawText) {
        continue;
      }

      const clean = cleanTranscriptText(rawText);
      if (!clean) {
        continue;
      }

      const allowed = Math.max(0, Math.min(itemTextLimit, remainingText));
      const text = clean.slice(0, allowed);
      const itemTruncated = clean.length > text.length || remainingText < clean.length;
      if (itemTruncated) {
        truncated = true;
      }
      remainingText -= text.length;
      totalTextCharCount += text.length;

      transcriptItems.push({
        idSuffix: suffix(item?.id),
        type: item.type,
        role: item.type === "userMessage" ? "user" : "assistant",
        status: statusLabel(item?.status),
        phase: typeof item?.phase === "string" ? item.phase : null,
        text,
        textCharCount: text.length,
        truncated: itemTruncated,
      });

      if (remainingText <= 0) {
        break;
      }
    }

    return {
      idSuffix: suffix(turn?.id),
      status: statusLabel(turn?.status),
      startedAt: turn?.startedAt ?? null,
      completedAt: turn?.completedAt ?? null,
      itemCount: items.length,
      returnedItemCount: transcriptItems.length,
      items: transcriptItems,
    };
  });

  return {
    idSuffix: suffix(thread?.id),
    status: statusLabel(thread?.status),
    cwdBasename: basename(thread?.cwd),
    turnCount: turns.length,
    returnedTurnCount: transcriptTurns.length,
    totalTextCharCount,
    truncated,
    limits: {
      turnLimit,
      itemLimit,
      itemTextLimit,
      totalTextLimit,
    },
    turns: transcriptTurns,
  };
}

export function summarizeThreadChanges(
  rawThread,
  {
    turnLimit = DEFAULT_CHANGES_TURN_LIMIT,
    itemLimit = DEFAULT_CHANGES_ITEM_LIMIT,
    changeLimit = DEFAULT_CHANGES_PER_ITEM_LIMIT,
    diffLineLimit = DEFAULT_CHANGE_DIFF_LINE_LIMIT,
    diffTextLimit = DEFAULT_CHANGE_DIFF_TEXT_LIMIT,
  } = {},
) {
  const thread = normalizeThread(rawThread);
  const turns = Array.isArray(rawThread?.turns) ? rawThread.turns.slice(-500) : [];
  const allChangeItems = [];
  let totalChangeCount = 0;

  for (const turn of turns) {
    const items = Array.isArray(turn?.items) ? turn.items : [];
    for (const item of items) {
      if (!isFileChangeItem(item)) {
        continue;
      }
      allChangeItems.push(item);
      totalChangeCount += Array.isArray(item?.changes) ? item.changes.length : 0;
    }
  }

  let returnedChangeItemCount = 0;
  let returnedChangeCount = 0;
  const changeTurns = [];

  for (const turn of turns.slice(-turnLimit)) {
    const items = Array.isArray(turn?.items) ? turn.items : [];
    const changeItems = items
      .slice(-itemLimit)
      .filter(isFileChangeItem)
      .map((item) =>
        summarizeChangeItem(item, {
          changeLimit,
          diffLineLimit,
          diffTextLimit,
        }),
      );

    if (changeItems.length === 0) {
      continue;
    }

    returnedChangeItemCount += changeItems.length;
    returnedChangeCount += changeItems.reduce(
      (sum, item) => sum + item.returnedChangeCount,
      0,
    );

    changeTurns.push({
      idSuffix: suffix(turn?.id),
      status: statusLabel(turn?.status),
      startedAt: turn?.startedAt ?? null,
      completedAt: turn?.completedAt ?? null,
      itemCount: items.length,
      changeItemCount: changeItems.length,
      items: changeItems,
    });
  }

  return {
    idSuffix: suffix(thread?.id),
    status: statusLabel(thread?.status),
    cwdBasename: basename(thread?.cwd),
    turnCount: turns.length,
    returnedTurnCount: Math.min(turns.length, turnLimit),
    changeItemCount: allChangeItems.length,
    returnedChangeItemCount,
    changeCount: totalChangeCount,
    returnedChangeCount,
    truncated:
      turns.length > turnLimit ||
      allChangeItems.length > returnedChangeItemCount ||
      totalChangeCount > returnedChangeCount,
    limits: {
      turnLimit,
      itemLimit,
      changeLimit,
      diffLineLimit,
      diffTextLimit,
    },
    turns: changeTurns,
  };
}

export function notificationCounts(notifications) {
  const counts = {};
  for (const notification of notifications) {
    const method = normalizeNotification(notification).method;
    counts[method] = (counts[method] || 0) + 1;
  }
  return counts;
}

function summarizeMcpResourceRead(response) {
  const contents = Array.isArray(response?.contents) ? response.contents : [];
  let textContentCount = 0;
  let blobContentCount = 0;
  let mimeTypeCount = 0;
  let textCharCount = 0;
  let blobCharCount = 0;
  let maxContentCharCount = 0;

  for (const content of contents) {
    if (typeof content?.text === "string") {
      textContentCount += 1;
      textCharCount += content.text.length;
      maxContentCharCount = Math.max(maxContentCharCount, content.text.length);
    }
    if (typeof content?.blob === "string") {
      blobContentCount += 1;
      blobCharCount += content.blob.length;
      maxContentCharCount = Math.max(maxContentCharCount, content.blob.length);
    }
    if (typeof content?.mimeType === "string" && content.mimeType.length > 0) {
      mimeTypeCount += 1;
    }
  }

  return {
    contentCount: contents.length,
    textContentCount,
    blobContentCount,
    mimeTypeCount,
    textCharCount,
    blobCharCount,
    maxContentCharCount,
    contentReturned: false,
    urisReturned: false,
    mimeTypesReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizeMcpServerReload(response) {
  const objectResponse = response && typeof response === "object" && !Array.isArray(response);
  return {
    method: APP_SERVER_METHODS.configMcpServerReload,
    responseObject: objectResponse,
    responseTopLevelKeyCount: objectResponse ? Object.keys(response).length : 0,
    responseReturned: false,
    namesReturned: false,
    pathsReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizeMcpServerOauthLogin(response) {
  const objectResponse = response && typeof response === "object" && !Array.isArray(response);
  return {
    method: APP_SERVER_METHODS.mcpServerOauthLogin,
    responseObject: objectResponse,
    responseTopLevelKeyCount: objectResponse ? Object.keys(response).length : 0,
    authorizationUrl:
      typeof response?.authorizationUrl === "string" ? response.authorizationUrl : null,
    authorizationUrlReturned: typeof response?.authorizationUrl === "string",
    namesReturned: false,
    tokensReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizeAccountLoginStart(response) {
  const objectResponse = response && typeof response === "object" && !Array.isArray(response);
  const type = typeof response?.type === "string" ? response.type : "unknown";
  return {
    method: APP_SERVER_METHODS.accountLoginStart,
    resultType: type,
    deviceCodeFlow: type === "chatgptDeviceCode",
    responseObject: objectResponse,
    responseTopLevelKeyCount: objectResponse ? Object.keys(response).length : 0,
    userCode: typeof response?.userCode === "string" ? response.userCode : null,
    verificationUrl:
      typeof response?.verificationUrl === "string" ? response.verificationUrl : null,
    loginIdReturned: typeof response?.loginId === "string",
    authUrlReturned: typeof response?.authUrl === "string",
    userCodeReturned: typeof response?.userCode === "string",
    verificationUrlReturned: typeof response?.verificationUrl === "string",
    apiKeyFlowAccepted: false,
    chatgptAuthTokensAccepted: false,
    tokensReturned: false,
    accountIdentifiersReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizeAccountLoginCancel(response) {
  const objectResponse = response && typeof response === "object" && !Array.isArray(response);
  const status = typeof response?.status === "string" ? response.status : "unknown";
  return {
    method: APP_SERVER_METHODS.accountLoginCancel,
    resultStatus: status,
    canceled: status === "canceled",
    notFound: status === "notFound",
    responseObject: objectResponse,
    responseTopLevelKeyCount: objectResponse ? Object.keys(response).length : 0,
    responseReturned: false,
    loginIdReturned: false,
    tokensReturned: false,
    accountIdentifiersReturned: false,
    authUrlsReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizeConfigValueWrite(response) {
  const objectResponse = response && typeof response === "object" && !Array.isArray(response);
  return {
    method: APP_SERVER_METHODS.configValueWrite,
    responseObject: objectResponse,
    responseTopLevelKeyCount: objectResponse ? Object.keys(response).length : 0,
    responseReturned: false,
    keyPathReturned: false,
    valueReturned: false,
    pathsReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizeConfigBatchWrite(response) {
  const objectResponse = response && typeof response === "object" && !Array.isArray(response);
  return {
    method: APP_SERVER_METHODS.configBatchWrite,
    responseObject: objectResponse,
    responseTopLevelKeyCount: objectResponse ? Object.keys(response).length : 0,
    responseReturned: false,
    keyPathsReturned: false,
    valuesReturned: false,
    pathsReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizeExperimentalFeatureEnablementSet(response) {
  const objectResponse = response && typeof response === "object" && !Array.isArray(response);
  const enablement =
    response?.enablement && typeof response.enablement === "object" && !Array.isArray(response.enablement)
      ? response.enablement
      : {};
  const values = Object.values(enablement);
  return {
    method: APP_SERVER_METHODS.experimentalFeatureEnablementSet,
    responseObject: objectResponse,
    responseTopLevelKeyCount: objectResponse ? Object.keys(response).length : 0,
    updatedFeatureCount: values.length,
    enabledCount: values.filter((value) => value === true).length,
    disabledCount: values.filter((value) => value === false).length,
    responseReturned: false,
    featureNamesReturned: false,
    enablementValuesReturned: false,
    pathsReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizeMcpToolCall(response) {
  const content = Array.isArray(response?.content) ? response.content : [];
  const structuredContent =
    response?.structuredContent && typeof response.structuredContent === "object"
      ? response.structuredContent
      : null;
  let textContentCount = 0;
  let textCharCount = 0;
  let maxContentCharCount = 0;
  let resourceContentCount = 0;
  let imageContentCount = 0;
  let otherContentCount = 0;

  for (const item of content) {
    if (typeof item?.text === "string") {
      textContentCount += 1;
      textCharCount += item.text.length;
      maxContentCharCount = Math.max(maxContentCharCount, item.text.length);
    }
    if (item?.type === "resource" || item?.resource) {
      resourceContentCount += 1;
      continue;
    }
    if (item?.type === "image" || typeof item?.data === "string") {
      imageContentCount += 1;
      if (typeof item?.data === "string") {
        maxContentCharCount = Math.max(maxContentCharCount, item.data.length);
      }
      continue;
    }
    if (typeof item?.text !== "string") {
      otherContentCount += 1;
    }
  }

  return {
    contentCount: content.length,
    textContentCount,
    resourceContentCount,
    imageContentCount,
    otherContentCount,
    textCharCount,
    maxContentCharCount,
    structuredContentPresent: Boolean(structuredContent),
    structuredContentTopLevelKeyCount: structuredContent ? Object.keys(structuredContent).length : 0,
    isError: Boolean(response?.isError),
    contentReturned: false,
    structuredContentReturned: false,
    namesReturned: false,
    idsReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizePluginRead(response) {
  const plugin = response?.plugin && typeof response.plugin === "object" ? response.plugin : null;
  const apps = Array.isArray(plugin?.apps) ? plugin.apps : [];
  const hooks = Array.isArray(plugin?.hooks) ? plugin.hooks : [];
  const mcpServers = Array.isArray(plugin?.mcpServers) ? plugin.mcpServers : [];
  const skills = Array.isArray(plugin?.skills) ? plugin.skills : [];
  const summary = plugin?.summary && typeof plugin.summary === "object" ? plugin.summary : null;
  const keywords = Array.isArray(summary?.keywords) ? summary.keywords : [];

  return {
    pluginPresent: Boolean(plugin),
    appCount: apps.length,
    hookCount: hooks.length,
    mcpServerCount: mcpServers.length,
    skillCount: skills.length,
    keywordCount: keywords.length,
    descriptionCharCount: typeof plugin?.description === "string" ? plugin.description.length : 0,
    marketplaceNameCharCount:
      typeof plugin?.marketplaceName === "string" ? plugin.marketplaceName.length : 0,
    summaryFieldCount: summary ? Object.keys(summary).length : 0,
    pluginReturned: false,
    namesReturned: false,
    idsReturned: false,
    pathsReturned: false,
    urlsReturned: false,
    descriptionsReturned: false,
    hookCommandsReturned: false,
    mcpServerNamesReturned: false,
    skillContentsReturned: false,
    shareContextReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizePluginContentRead(method, response) {
  if (method === APP_SERVER_METHODS.pluginSkillRead) {
    const contents = typeof response?.contents === "string" ? response.contents : "";
    return {
      method,
      skillContentPresent: contents.length > 0,
      contentCharCount: contents.length,
      contentLineCount: contents.length > 0 ? contents.split(/\r\n|\r|\n/).length : 0,
      itemCount: 0,
      shareUrlCount: 0,
      localPathCount: 0,
      installedCount: 0,
      enabledCount: 0,
      contentReturned: false,
      namesReturned: false,
      idsReturned: false,
      pathsReturned: false,
      urlsReturned: false,
      descriptionsReturned: false,
      principalsReturned: false,
      rawPayloadReturned: false,
    };
  }

  const items = Array.isArray(response?.data) ? response.data : [];
  let shareUrlCount = 0;
  let localPathCount = 0;
  let installedCount = 0;
  let enabledCount = 0;
  for (const item of items) {
    if (typeof item?.shareUrl === "string" && item.shareUrl.length > 0) {
      shareUrlCount += 1;
    }
    if (typeof item?.localPluginPath === "string" && item.localPluginPath.length > 0) {
      localPathCount += 1;
    }
    if (item?.plugin?.installed === true) {
      installedCount += 1;
    }
    if (item?.plugin?.enabled === true) {
      enabledCount += 1;
    }
  }

  return {
    method,
    skillContentPresent: false,
    contentCharCount: 0,
    contentLineCount: 0,
    itemCount: items.length,
    shareUrlCount,
    localPathCount,
    installedCount,
    enabledCount,
    contentReturned: false,
    namesReturned: false,
    idsReturned: false,
    pathsReturned: false,
    urlsReturned: false,
    descriptionsReturned: false,
    principalsReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizePluginUninstall(response) {
  const objectResponse = response && typeof response === "object" && !Array.isArray(response);
  return {
    method: APP_SERVER_METHODS.pluginUninstall,
    responseObject: objectResponse,
    responseTopLevelKeyCount: objectResponse ? Object.keys(response).length : 0,
    responseReturned: false,
    pluginIdReturned: false,
    namesReturned: false,
    pathsReturned: false,
    urlsReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizeSkillsConfigWrite(response) {
  return {
    effectiveEnabled: Boolean(response?.effectiveEnabled),
    responseReturned: false,
    namesReturned: false,
    pathsReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizeSkillsExtraRootsClear(response) {
  const objectResponse = response && typeof response === "object" && !Array.isArray(response);
  return {
    method: APP_SERVER_METHODS.skillsExtraRootsSet,
    status: "cleared",
    requestedExtraRootCount: 0,
    responseObject: objectResponse,
    responseTopLevelKeyCount: objectResponse ? Object.keys(response).length : 0,
    extraRootsReturned: false,
    pathsReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizeRemoteControlDisable(response) {
  const objectResponse = response && typeof response === "object" && !Array.isArray(response);
  const status = safeRemoteControlStatus(response?.status);
  return {
    method: APP_SERVER_METHODS.remoteControlDisable,
    status,
    statusKnown: status !== "unknown",
    responseObject: objectResponse,
    responseTopLevelKeyCount: objectResponse ? Object.keys(response).length : 0,
    paramsAcceptedFromBrowser: false,
    statusValueReturned: false,
    environmentIdReturned: false,
    installationIdReturned: false,
    serverNameReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizeRemoteControlClientsList(response, { environmentId = null } = {}) {
  const data = Array.isArray(response?.data) ? response.data : [];
  const clients = data.slice(0, 20).map((client) => ({
    clientId: typeof client?.clientId === "string" ? client.clientId : "",
    displayNamePresent: Boolean(firstSafeString(client?.displayName)),
    deviceModelPresent: Boolean(firstSafeString(client?.deviceModel)),
    deviceTypePresent: Boolean(firstSafeString(client?.deviceType)),
    platformPresent: Boolean(firstSafeString(client?.platform)),
    osVersionPresent: Boolean(firstSafeString(client?.osVersion)),
    appVersionPresent: Boolean(firstSafeString(client?.appVersion)),
    lastSeenAtPresent: typeof client?.lastSeenAt === "number",
  }));
  const summary = {
    method: APP_SERVER_METHODS.remoteControlClientList,
    status: "listed-with-redactions",
    responseObject: Boolean(response && typeof response === "object" && !Array.isArray(response)),
    responseTopLevelKeyCount:
      response && typeof response === "object" && !Array.isArray(response)
        ? Object.keys(response).length
        : 0,
    clientCount: data.length,
    returnedClientCount: clients.filter((client) => client.clientId).length,
    hasNextCursor: typeof response?.nextCursor === "string" && response.nextCursor.length > 0,
    environmentIdPresent: Boolean(environmentId),
    clientIdsReturned: false,
    clientNamesReturned: false,
    deviceMetadataReturned: false,
    cursorsReturned: false,
    rawPayloadReturned: false,
  };
  Object.defineProperty(summary, "_privateEnvironmentId", {
    value: environmentId,
    enumerable: false,
  });
  Object.defineProperty(summary, "_privateClients", {
    value: clients.filter((client) => client.clientId),
    enumerable: false,
  });
  return summary;
}

function summarizeRemoteControlClientRevoke(response) {
  const objectResponse = response && typeof response === "object" && !Array.isArray(response);
  return {
    method: APP_SERVER_METHODS.remoteControlClientRevoke,
    status: "revoked-with-redactions",
    responseObject: objectResponse,
    responseTopLevelKeyCount: objectResponse ? Object.keys(response).length : 0,
    environmentIdReturned: false,
    clientIdReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizeEnvironmentAdd(response) {
  const objectResponse = response && typeof response === "object" && !Array.isArray(response);
  return {
    method: APP_SERVER_METHODS.environmentAdd,
    status: "added-with-redactions",
    responseObject: objectResponse,
    responseTopLevelKeyCount: objectResponse ? Object.keys(response).length : 0,
    environmentIdReturned: false,
    execServerUrlReturned: false,
    urlsReturned: false,
    pathsReturned: false,
    rawPayloadReturned: false,
  };
}

export function summarizeLoadedSessions(
  response,
  { limit = DEFAULT_LOADED_SESSION_LIMIT } = {},
) {
  const data = Array.isArray(response?.data) ? response.data : [];
  const threadIdSuffixes = data
    .slice(0, limit)
    .map((id) => suffix(id))
    .filter(isValidSuffix);
  return {
    count: data.length,
    returnedThreadCount: threadIdSuffixes.length,
    hasNextCursor: typeof response?.nextCursor === "string" && response.nextCursor.length > 0,
    threadIdSuffixes,
    fullIdsReturned: false,
  };
}

export function sanitizeNotification(notification, { threadId = null, turnId = null } = {}) {
  const safeNotification = normalizeNotification(notification);
  const params = safeNotification.params ?? {};
  const output = {
    method: safeNotification.method,
    threadIdSuffix: suffix(params.threadId ?? params.thread_id ?? threadId),
    turnIdSuffix: suffix(params.turnId ?? params.turn_id ?? params.turn?.id ?? turnId),
    itemType:
      typeof params.item?.type === "string"
        ? params.item.type
        : safeNotification.method === "item/agentMessage/delta"
          ? "agentMessage"
          : null,
    status: statusFromParams(params),
  };
  const liveText = summarizeLiveTextDelta(notification);
  if (liveText) {
    output.liveText = liveText;
  }
  const terminalLifecycle = summarizeTerminalLifecycleNotification(notification);
  if (terminalLifecycle) {
    output.terminalLifecycle = terminalLifecycle;
  }
  return output;
}

export function summarizeTerminalLifecycleNotification(notification) {
  const method = typeof notification?.method === "string" ? notification.method : "";
  const params = notification?.params && typeof notification.params === "object" ? notification.params : {};

  switch (method) {
    case "item/commandExecution/outputDelta":
      return {
        kind: "command-execution-output",
        itemIdSuffix: suffix(params.itemId),
        output: terminalTextSummary(params.delta),
        outputTextReturned: false,
        commandTextReturned: false,
        sessionIdentifierReturned: false,
      };
    case "item/commandExecution/terminalInteraction":
      return {
        kind: "terminal-interaction",
        itemIdSuffix: suffix(params.itemId),
        process: terminalIdentifierSummary(params.processId),
        input: terminalTextSummary(params.stdin),
        inputTextReturned: false,
        commandTextReturned: false,
        sessionIdentifierReturned: false,
      };
    case "command/exec/outputDelta":
      return {
        kind: "command-exec-output",
        process: terminalIdentifierSummary(params.processId),
        stream: safeTerminalStream(params.stream),
        output: terminalBase64Summary(params.deltaBase64),
        outputTextReturned: false,
        commandTextReturned: false,
        sessionIdentifierReturned: false,
        capReached: Boolean(params.capReached),
      };
    case "process/outputDelta":
      return {
        kind: "process-output",
        process: terminalIdentifierSummary(params.processHandle),
        stream: safeTerminalStream(params.stream),
        output: terminalBase64Summary(params.deltaBase64),
        outputTextReturned: false,
        commandTextReturned: false,
        sessionIdentifierReturned: false,
        capReached: Boolean(params.capReached),
      };
    case "process/exited":
      return {
        kind: "process-exited",
        process: terminalIdentifierSummary(params.processHandle),
        exitCode: Number.isSafeInteger(params.exitCode) ? params.exitCode : null,
        stdout: {
          ...terminalTextSummary(params.stdout),
          capReached: Boolean(params.stdoutCapReached),
        },
        stderr: {
          ...terminalTextSummary(params.stderr),
          capReached: Boolean(params.stderrCapReached),
        },
        outputTextReturned: false,
        commandTextReturned: false,
        sessionIdentifierReturned: false,
      };
    default:
      return null;
  }
}

export async function openReadOnlyNotificationStream({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  onEvent = null,
} = {}) {
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      onEvent?.(sanitizeNotification(notification));
    },
  });

  await client.start();

  const initialize = normalizeInitializeResponse(
    await client.request("initialize", {
      clientInfo: {
        name: "codex_app_port",
        title: "Codex App Port",
        version: "0.1.0",
      },
      capabilities: {
        experimentalApi: false,
        requestAttestation: false,
      },
    }),
  );

  client.notify("initialized");

  return {
    initialize: summarizeInitialize(initialize),
    close() {
      return client.close();
    },
  };
}

export async function runThreadDetailProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  threadIdSuffix,
  threadScanLimit = DEFAULT_THREAD_DETAIL_SCAN_LIMIT,
  turnLimit = DEFAULT_THREAD_DETAIL_TURN_LIMIT,
  itemLimit = DEFAULT_THREAD_DETAIL_ITEM_LIMIT,
  onNotification = null,
} = {}) {
  if (!isValidSuffix(threadIdSuffix)) {
    throwRequestError("Thread selector must be an 8-character id suffix", 400);
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request("initialize", {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify("initialized");

    const thread = await selectThreadBySuffixFromLists(client, {
      threadIdSuffix,
      threadScanLimit,
    });
    const detail = normalizeThreadReadResponse(
      await client.request("thread/read", {
        threadId: thread.id,
        includeTurns: true,
      }),
    );

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        threadDetail: summarizeThreadDetail(detail.thread, { turnLimit, itemLimit }),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runThreadGoalProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  threadIdSuffix,
  threadScanLimit = DEFAULT_THREAD_DETAIL_SCAN_LIMIT,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_THREAD_GOAL !== "1") {
    throw new Error(
      "thread/goal/get requires CODEX_APP_PORT_ALLOW_THREAD_GOAL=1 because it can inspect user goal intent",
    );
  }
  if (!isValidSuffix(threadIdSuffix)) {
    throwRequestError("Thread selector must be an 8-character id suffix", 400);
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request("initialize", {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify("initialized");

    const thread = await selectThreadBySuffixFromLists(client, {
      threadIdSuffix,
      threadScanLimit,
    });
    const goal = await client.request(APP_SERVER_METHODS.threadGoalGet, {
      threadId: thread.id,
    });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        threadGoal: summarizeThreadGoal(goal, { threadIdSuffix }),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runThreadGoalSetProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  threadIdSuffix,
  objective,
  status = "active",
  tokenBudget = null,
  threadScanLimit = DEFAULT_THREAD_DETAIL_SCAN_LIMIT,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_THREAD_GOAL_SET !== "1") {
    throw new Error(
      "thread/goal/set requires CODEX_APP_PORT_ALLOW_THREAD_GOAL_SET=1 because it mutates persisted goal metadata",
    );
  }
  if (!isValidSuffix(threadIdSuffix)) {
    throwRequestError("Thread selector must be an 8-character id suffix", 400);
  }
  const safeObjective = validateThreadGoalObjective(objective);
  const safeStatus = validateThreadGoalStatus(status);
  const safeTokenBudget = validateThreadGoalTokenBudget(tokenBudget);

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const thread = await selectThreadBySuffixFromLists(client, {
      threadIdSuffix,
      threadScanLimit,
    });
    const goal = await client.request(
      APP_SERVER_METHODS.threadGoalSet,
      {
        threadId: thread.id,
        objective: safeObjective,
        status: safeStatus,
        tokenBudget: safeTokenBudget,
      },
      { timeoutMs },
    );

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        threadGoalSet: {
          ...summarizeThreadGoal(goal, { threadIdSuffix }),
          method: APP_SERVER_METHODS.threadGoalSet,
          status: "set",
          methodsUsed: [APP_SERVER_METHODS.threadList, APP_SERVER_METHODS.threadGoalSet],
          objectiveCharCount: safeObjective.length,
          objectiveLineCount: countLines(safeObjective),
          requestedStatus: safeStatus,
          tokenBudgetPresent: safeTokenBudget !== null,
          tokenBudget: safeTokenBudget,
          objectiveReturned: false,
          threadContentReturned: false,
          fullIdsReturned: false,
          cwdReturned: false,
          pathsReturned: false,
          rawPayloadReturned: false,
        },
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runThreadGoalClearProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  threadIdSuffix,
  threadScanLimit = DEFAULT_THREAD_DETAIL_SCAN_LIMIT,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_THREAD_GOAL_CLEAR !== "1") {
    throw new Error(
      "thread/goal/clear requires CODEX_APP_PORT_ALLOW_THREAD_GOAL_CLEAR=1 because it mutates persisted goal metadata",
    );
  }
  if (!isValidSuffix(threadIdSuffix)) {
    throwRequestError("Thread selector must be an 8-character id suffix", 400);
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const thread = await selectThreadBySuffixFromLists(client, {
      threadIdSuffix,
      threadScanLimit,
    });
    const clear = await client.request(
      APP_SERVER_METHODS.threadGoalClear,
      {
        threadId: thread.id,
      },
      { timeoutMs },
    );

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        threadGoalClear: {
          method: APP_SERVER_METHODS.threadGoalClear,
          threadIdSuffix: suffix(thread.id),
          status: "cleared",
          cleared: Boolean(clear?.cleared),
          methodsUsed: [APP_SERVER_METHODS.threadList, APP_SERVER_METHODS.threadGoalClear],
          objectiveReturned: false,
          threadContentReturned: false,
          fullIdsReturned: false,
          cwdReturned: false,
          pathsReturned: false,
          rawPayloadReturned: false,
        },
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runThreadMemoryModeSetProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  threadIdSuffix,
  mode,
  threadScanLimit = DEFAULT_THREAD_DETAIL_SCAN_LIMIT,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_THREAD_MEMORY_MODE_SET !== "1") {
    throw new Error(
      "thread/memoryMode/set requires CODEX_APP_PORT_ALLOW_THREAD_MEMORY_MODE_SET=1 because it mutates future thread memory behavior",
    );
  }
  if (!isValidSuffix(threadIdSuffix)) {
    throwRequestError("Thread selector must be an 8-character id suffix", 400);
  }
  const safeMode = validateThreadMemoryMode(mode);

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const thread = await selectThreadBySuffixFromLists(client, {
      threadIdSuffix,
      threadScanLimit,
    });
    await client.request(
      APP_SERVER_METHODS.threadMemoryModeSet,
      {
        threadId: thread.id,
        mode: safeMode,
      },
      { timeoutMs },
    );

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        threadMemoryModeSet: {
          method: APP_SERVER_METHODS.threadMemoryModeSet,
          threadIdSuffix: suffix(thread.id),
          status: "set",
          mode: safeMode,
          methodsUsed: [APP_SERVER_METHODS.threadList, APP_SERVER_METHODS.threadMemoryModeSet],
          threadContentReturned: false,
          fullIdsReturned: false,
          cwdReturned: false,
          pathsReturned: false,
          rawPayloadReturned: false,
        },
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runThreadTurnsProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  threadIdSuffix,
  threadScanLimit = DEFAULT_THREAD_DETAIL_SCAN_LIMIT,
  limit = DEFAULT_THREAD_TURNS_PAGE_LIMIT,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_THREAD_TURNS !== "1") {
    throw new Error(
      "thread/turns/list requires CODEX_APP_PORT_ALLOW_THREAD_TURNS=1 because it can inspect persisted turn metadata",
    );
  }
  if (!isValidSuffix(threadIdSuffix)) {
    throwRequestError("Thread selector must be an 8-character id suffix", 400);
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request("initialize", {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify("initialized");

    const thread = await selectThreadBySuffixFromLists(client, {
      threadIdSuffix,
      threadScanLimit,
    });
    const safeLimit = Number.isFinite(limit)
      ? Math.max(0, Math.min(DEFAULT_THREAD_TURNS_PAGE_LIMIT, Math.trunc(limit)))
      : DEFAULT_THREAD_TURNS_PAGE_LIMIT;
    const turns = await client.request(APP_SERVER_METHODS.threadTurnsList, {
      threadId: thread.id,
      limit: safeLimit,
      itemsView: "notLoaded",
      sortDirection: "desc",
      cursor: null,
    });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        threadTurns: summarizeThreadTurnsPage(turns, { threadIdSuffix, limit: safeLimit }),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runThreadTurnItemsProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  threadIdSuffix,
  turnIdSuffix,
  threadScanLimit = DEFAULT_THREAD_DETAIL_SCAN_LIMIT,
  turnScanLimit = DEFAULT_THREAD_TURNS_PAGE_LIMIT,
  limit = DEFAULT_THREAD_TURN_ITEMS_PAGE_LIMIT,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_THREAD_TURN_ITEMS !== "1") {
    throw new Error(
      "thread/turns/items/list requires CODEX_APP_PORT_ALLOW_THREAD_TURN_ITEMS=1 because items can contain persisted conversation, command, patch, and path data",
    );
  }
  if (!isValidSuffix(threadIdSuffix)) {
    throwRequestError("Thread selector must be an 8-character id suffix", 400);
  }
  if (!isValidSuffix(turnIdSuffix)) {
    throwRequestError("Turn selector must be an 8-character id suffix", 400);
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request("initialize", {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify("initialized");

    const thread = await selectThreadBySuffixFromLists(client, {
      threadIdSuffix,
      threadScanLimit,
    });
    const safeTurnScanLimit = Number.isFinite(turnScanLimit)
      ? Math.max(1, Math.min(DEFAULT_THREAD_TURNS_PAGE_LIMIT, Math.trunc(turnScanLimit)))
      : DEFAULT_THREAD_TURNS_PAGE_LIMIT;
    const turns = await client.request(APP_SERVER_METHODS.threadTurnsList, {
      threadId: thread.id,
      limit: safeTurnScanLimit,
      itemsView: "notLoaded",
      sortDirection: "desc",
      cursor: null,
    });
    const turnId = selectTurnIdBySuffix(turns?.data, turnIdSuffix);
    const safeLimit = Number.isFinite(limit)
      ? Math.max(0, Math.min(DEFAULT_THREAD_TURN_ITEMS_PAGE_LIMIT, Math.trunc(limit)))
      : DEFAULT_THREAD_TURN_ITEMS_PAGE_LIMIT;
    const items = await client.request(APP_SERVER_METHODS.threadTurnsItemsList, {
      threadId: thread.id,
      turnId,
      limit: safeLimit,
      sortDirection: "asc",
      cursor: null,
    });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        threadTurnItems: summarizeThreadTurnItemsPage(items, {
          threadIdSuffix,
          turnIdSuffix,
          limit: safeLimit,
        }),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runThreadRealtimeVoicesProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_THREAD_REALTIME_VOICES !== "1") {
    throw new Error(
      "thread/realtime/listVoices requires CODEX_APP_PORT_ALLOW_THREAD_REALTIME_VOICES=1 because realtime voice metadata is experimental",
    );
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request("initialize", {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify("initialized");

    const voices = await client.request(APP_SERVER_METHODS.threadRealtimeListVoices, {});

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        threadRealtimeVoices: summarizeThreadRealtimeVoices(voices),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runFsDirectoryProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  relativePath = "",
  limit = DEFAULT_FS_DIRECTORY_ENTRY_LIMIT,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_FS_DIRECTORY !== "1") {
    throw new Error(
      "fs/readDirectory requires CODEX_APP_PORT_ALLOW_FS_DIRECTORY=1 because directory names can reveal local project structure",
    );
  }

  const target = await validateFsDirectoryTarget(relativePath, cwd);
  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request("initialize", {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify("initialized");

    const metadata = await client.request(APP_SERVER_METHODS.fsGetMetadata, {
      path: target.absolutePath,
    });
    const directory = await client.request(APP_SERVER_METHODS.fsReadDirectory, {
      path: target.absolutePath,
    });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        fsDirectory: summarizeFsDirectory(directory, {
          metadata,
          target,
          limit,
        }),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runThreadTranscriptProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  threadIdSuffix,
  threadScanLimit = DEFAULT_THREAD_DETAIL_SCAN_LIMIT,
  turnLimit = DEFAULT_TRANSCRIPT_TURN_LIMIT,
  itemLimit = DEFAULT_TRANSCRIPT_ITEM_LIMIT,
  itemTextLimit = DEFAULT_TRANSCRIPT_ITEM_TEXT_LIMIT,
  totalTextLimit = DEFAULT_TRANSCRIPT_TOTAL_TEXT_LIMIT,
  onNotification = null,
} = {}) {
  if (!isValidSuffix(threadIdSuffix)) {
    throwRequestError("Thread selector must be an 8-character id suffix", 400);
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request("initialize", {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify("initialized");

    const thread = await selectThreadBySuffixFromLists(client, {
      threadIdSuffix,
      threadScanLimit,
    });
    const detail = normalizeThreadReadResponse(
      await client.request("thread/read", {
        threadId: thread.id,
        includeTurns: true,
      }),
    );

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        threadTranscript: summarizeThreadTranscript(detail.thread, {
          turnLimit,
          itemLimit,
          itemTextLimit,
          totalTextLimit,
        }),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runThreadChangesProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  threadIdSuffix,
  threadScanLimit = DEFAULT_THREAD_DETAIL_SCAN_LIMIT,
  turnLimit = DEFAULT_CHANGES_TURN_LIMIT,
  itemLimit = DEFAULT_CHANGES_ITEM_LIMIT,
  changeLimit = DEFAULT_CHANGES_PER_ITEM_LIMIT,
  diffLineLimit = DEFAULT_CHANGE_DIFF_LINE_LIMIT,
  diffTextLimit = DEFAULT_CHANGE_DIFF_TEXT_LIMIT,
  onNotification = null,
} = {}) {
  if (!isValidSuffix(threadIdSuffix)) {
    throwRequestError("Thread selector must be an 8-character id suffix", 400);
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request("initialize", {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify("initialized");

    const thread = await selectThreadBySuffixFromLists(client, {
      threadIdSuffix,
      threadScanLimit,
    });
    const detail = normalizeThreadReadResponse(
      await client.request("thread/read", {
        threadId: thread.id,
        includeTurns: true,
      }),
    );

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        threadChanges: summarizeThreadChanges(detail.thread, {
          turnLimit,
          itemLimit,
          changeLimit,
          diffLineLimit,
          diffTextLimit,
        }),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runThreadSearchProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  searchTerm,
  archived = false,
  limit = DEFAULT_THREAD_SEARCH_LIMIT,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_THREAD_SEARCH !== "1") {
    throw new Error(
      "thread/search requires CODEX_APP_PORT_ALLOW_THREAD_SEARCH=1 because it can inspect past thread content",
    );
  }
  const safeSearchTerm = validateThreadSearchTerm(searchTerm);
  const safeArchived = archived === true;
  const safeLimit = validateThreadSearchLimit(limit);

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const search = await client.request(APP_SERVER_METHODS.threadSearch, {
      searchTerm: safeSearchTerm,
      archived: safeArchived,
      limit: safeLimit,
      cursor: null,
    });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        threadSearch: summarizeThreadSearch(search, {
          archived: safeArchived,
          limit: safeLimit,
          searchTerm: safeSearchTerm,
        }),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runTurnStartProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  threadIdSuffix,
  prompt,
  threadScanLimit = DEFAULT_THREAD_DETAIL_SCAN_LIMIT,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_TURN_START !== "1") {
    throw new Error(
      "turn/start requires CODEX_APP_PORT_ALLOW_TURN_START=1 because it sends authenticated model traffic",
    );
  }
  if (!isValidSuffix(threadIdSuffix)) {
    throwRequestError("Thread selector must be an 8-character id suffix", 400);
  }
  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    throwRequestError("Prompt is required", 400);
  }

  const notifications = [];
  const eventLog = [];
  const approvalRequests = [];
  let threadId = null;
  let turnId = null;
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      eventLog.push(sanitizeNotification(notification, { threadId, turnId }));
      if (eventLog.length > DEFAULT_TURN_EVENT_LOG_LIMIT) {
        eventLog.splice(0, eventLog.length - DEFAULT_TURN_EVENT_LOG_LIMIT);
      }
      onNotification?.(notification);
    },
    onServerRequest(message) {
      const summary = summarizeApprovalRequest(message);
      const denial = buildDenyOnlyApprovalResponse(message, { interrupt: true });
      approvalRequests.push({
        ...summary,
        handled: denial.handled,
        decision: denial.response?.decision ?? denial.decision ?? null,
      });
      if (!denial.handled) {
        throw new Error(denial.reason || "unsupported approval request");
      }
      return denial.response;
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request("initialize", {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify("initialized");

    const threads = normalizeThreadListResponse(
      await client.request("thread/list", {
        limit: threadScanLimit,
        archived: false,
        useStateDbOnly: true,
      }),
    );
    const thread = selectThreadBySuffix(threads.data, threadIdSuffix);
    threadId = thread.id;
    const turnStart = normalizeTurnStartResponse(
      await client.request(
        "turn/start",
        {
          threadId,
          input: [
            {
              type: "text",
              text: prompt,
              text_elements: [],
            },
          ],
          approvalPolicy: "on-request",
          approvalsReviewer: "user",
          sandboxPolicy: {
            type: "readOnly",
            networkAccess: false,
          },
          environments: [],
        },
        { timeoutMs },
      ),
    );

    turnId = turnStart.turn?.id ?? null;
    let completed = null;
    if (turnId) {
      completed = normalizeNotification(
        await client.waitForNotification(
          (notification) =>
            notification.method === "turn/completed" &&
            notification.params?.threadId === threadId &&
            notificationTurnId(notification) === turnId,
          { timeoutMs },
        ),
      );
    }

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        turnStart: {
          threadIdSuffix: suffix(threadId),
          turnIdSuffix: suffix(turnId),
          completedStatus: statusFromParams(completed?.params ?? {}) ?? turnStart.turn?.status ?? null,
          approvalRequestCount: approvalRequests.length,
          deniedApprovalCount: approvalRequests.filter((request) => request.handled).length,
          unsupportedApprovalCount: approvalRequests.filter((request) => !request.handled).length,
          approvalRequests,
          eventCount: eventLog.length,
          returnedEventCount: eventLog.length,
          events: eventLog,
        },
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runIntegrationsInventoryProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  includeNames = process.env.CODEX_APP_PORT_ALLOW_INTEGRATION_NAMES === "1",
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_INTEGRATION_INVENTORY !== "1") {
    throw new Error(
      "integration inventory requires CODEX_APP_PORT_ALLOW_INTEGRATION_INVENTORY=1 because it may inspect local integration metadata",
    );
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request("initialize", {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify("initialized");

    const [
      requirements,
      models,
      modelProviderCapabilities,
      collaborationModes,
      permissionProfiles,
      account,
      rateLimits,
      accountUsage,
      workspaceMessages,
      remoteControlStatus,
      apps,
      mcp,
      skills,
      plugins,
      installedPlugins,
      hooks,
      externalAgentConfig,
      externalAgentConfigImportHistories,
      experimentalFeatures,
    ] = await Promise.all([
      readInventorySection(() => client.request("configRequirements/read", null)),
      readInventorySection(() =>
        client.request(APP_SERVER_METHODS.modelList, {
          cursor: null,
          includeHidden: false,
          limit: 50,
        }),
      ),
      readInventorySection(() =>
        client.request(APP_SERVER_METHODS.modelProviderCapabilitiesRead, {}),
      ),
      readInventorySection(() => client.request(APP_SERVER_METHODS.collaborationModeList, {})),
      readInventorySection(() =>
        client.request(APP_SERVER_METHODS.permissionProfileList, {
          cursor: null,
          cwd,
          limit: 50,
        }),
      ),
      readInventorySection(() => client.request("account/read", { refreshToken: false })),
      readInventorySection(() => client.request("account/rateLimits/read", null)),
      readInventorySection(() => client.request(APP_SERVER_METHODS.accountUsageRead, null)),
      readInventorySection(() =>
        client.request(APP_SERVER_METHODS.accountWorkspaceMessagesRead, null),
      ),
      readInventorySection(() => client.request(APP_SERVER_METHODS.remoteControlStatusRead, null)),
      readInventorySection(() =>
        client.request("app/list", {
          cursor: null,
          forceRefetch: false,
          limit: 50,
          threadId: null,
        }),
      ),
      readInventorySection(() =>
        client.request("mcpServerStatus/list", {
          detail: "toolsAndAuthOnly",
          limit: 50,
        }),
      ),
      readInventorySection(() =>
        client.request("skills/list", {
          cwds: [cwd],
          forceReload: false,
        }),
      ),
      readInventorySection(() =>
        client.request("plugin/list", {
          cwds: [cwd],
          marketplaceKinds: ["local", "workspace-directory"],
        }),
      ),
      readInventorySection(() =>
        client.request(APP_SERVER_METHODS.pluginInstalled, {
          cwds: [cwd],
          installSuggestionPluginNames: null,
        }),
      ),
      readInventorySection(() =>
        client.request("hooks/list", {
          cwds: [cwd],
        }),
      ),
      readInventorySection(() =>
        client.request("externalAgentConfig/detect", {
          cwds: [cwd],
          includeHome: false,
        }),
      ),
      readInventorySection(() =>
        client.request(APP_SERVER_METHODS.externalAgentConfigImportReadHistories, null),
      ),
      readInventorySection(() =>
        client.request(APP_SERVER_METHODS.experimentalFeatureList, {
          cursor: null,
          limit: 50,
        }),
      ),
    ]);

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        integrationsInventory: {
          requirements: summarizeConfigRequirementsInventory(requirements),
          models: summarizeModelsInventory(models, { includeNames }),
          modelProviderCapabilities:
            summarizeModelProviderCapabilitiesInventory(modelProviderCapabilities),
          collaborationModes: summarizeCollaborationModesInventory(collaborationModes, {
            includeNames,
          }),
          permissionProfiles: summarizePermissionProfilesInventory(permissionProfiles),
          account: summarizeAccountInventory(account),
          rateLimits: summarizeAccountRateLimitsInventory(rateLimits),
          accountUsage: summarizeAccountUsageInventory(accountUsage),
          workspaceMessages: summarizeWorkspaceMessagesInventory(workspaceMessages),
          remoteControlStatus: summarizeRemoteControlStatusInventory(remoteControlStatus),
          apps: summarizeAppsInventory(apps, { includeNames }),
          mcp: summarizeMcpInventory(mcp, { includeNames }),
          skills: summarizeSkillsInventory(skills, { includeNames }),
          plugins: summarizePluginsInventory(plugins, { includeNames }),
          installedPlugins: summarizeInstalledPluginsInventory(installedPlugins),
          hooks: summarizeHooksInventory(hooks),
          externalAgentConfig: summarizeExternalAgentConfigInventory(externalAgentConfig),
          externalAgentConfigImportHistories:
            summarizeExternalAgentConfigImportHistoriesInventory(
              externalAgentConfigImportHistories,
            ),
          experimentalFeatures: summarizeExperimentalFeaturesInventory(experimentalFeatures, {
            includeNames,
          }),
        },
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runMcpServerReloadProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_MCP_SERVER_RELOAD !== "1") {
    throw new Error(
      "MCP server reload requires CODEX_APP_PORT_ALLOW_MCP_SERVER_RELOAD=1 because it may restart configured integration servers",
    );
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const reload = await client.request(APP_SERVER_METHODS.configMcpServerReload, null);

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        mcpServerReload: summarizeMcpServerReload(reload),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runMcpServerOauthLoginProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  serverName,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_MCP_OAUTH_LOGIN !== "1") {
    throw new Error(
      "MCP OAuth login requires CODEX_APP_PORT_ALLOW_MCP_OAUTH_LOGIN=1 because it starts an integration auth flow",
    );
  }
  if (typeof serverName !== "string" || serverName.length === 0) {
    throw new Error("MCP OAuth login requires a server name");
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const oauthLogin = await client.request(APP_SERVER_METHODS.mcpServerOauthLogin, {
      name: serverName,
    });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        mcpServerOauthLogin: summarizeMcpServerOauthLogin(oauthLogin),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runMcpResourceReadProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  server,
  resource,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_MCP_RESOURCE_READ !== "1") {
    throw new Error(
      "MCP resource reads require CODEX_APP_PORT_ALLOW_MCP_RESOURCE_READ=1 because they may retrieve integration-controlled content",
    );
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const resourceRead = await client.request(APP_SERVER_METHODS.mcpResourceRead, {
      server,
      uri: resource,
      threadId: null,
    });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        mcpResourceRead: summarizeMcpResourceRead(resourceRead),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runConfigValueWriteProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  keyPath,
  value,
  mergeStrategy,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_CONFIG_VALUE_WRITE !== "1") {
    throw new Error(
      "config value writes require CODEX_APP_PORT_ALLOW_CONFIG_VALUE_WRITE=1 because they mutate local Codex configuration",
    );
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const configValueWrite = await client.request(APP_SERVER_METHODS.configValueWrite, {
      keyPath,
      value,
      mergeStrategy,
      expectedVersion: null,
      filePath: null,
    });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        configValueWrite: summarizeConfigValueWrite(configValueWrite),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runConfigBatchWriteProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  edits = [],
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_CONFIG_BATCH_WRITE !== "1") {
    throw new Error(
      "config batch writes require CODEX_APP_PORT_ALLOW_CONFIG_BATCH_WRITE=1 because they mutate local Codex configuration",
    );
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const configBatchWrite = await client.request(APP_SERVER_METHODS.configBatchWrite, {
      edits,
      expectedVersion: null,
      filePath: null,
      reloadUserConfig: false,
    });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        configBatchWrite: summarizeConfigBatchWrite(configBatchWrite),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runExperimentalFeatureEnablementSetProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  feature,
  enabled,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_EXPERIMENTAL_FEATURE_SET !== "1") {
    throw new Error(
      "experimental feature enablement changes require CODEX_APP_PORT_ALLOW_EXPERIMENTAL_FEATURE_SET=1 because they mutate runtime feature flags",
    );
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const experimentalFeatureSet = await client.request(
      APP_SERVER_METHODS.experimentalFeatureEnablementSet,
      {
        enablement: {
          [feature]: Boolean(enabled),
        },
      },
    );

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        experimentalFeatureSet: summarizeExperimentalFeatureEnablementSet(experimentalFeatureSet),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runMcpToolCallProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  server,
  tool,
  args = {},
  threadIdSuffix,
  threadScanLimit = DEFAULT_THREAD_DETAIL_SCAN_LIMIT,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_MCP_TOOL_CALL !== "1") {
    throw new Error(
      "MCP tool calls require CODEX_APP_PORT_ALLOW_MCP_TOOL_CALL=1 because tools can perform arbitrary integration work",
    );
  }
  if (!isValidSuffix(threadIdSuffix)) {
    throwRequestError("Thread selector must be an 8-character id suffix", 400);
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const thread = await selectThreadBySuffixFromLists(client, {
      threadIdSuffix,
      threadScanLimit,
    });
    const toolCall = await client.request(APP_SERVER_METHODS.mcpToolCall, {
      server,
      tool,
      arguments: args && typeof args === "object" && !Array.isArray(args) ? args : {},
      threadId: thread.id,
    });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        mcpToolCall: {
          ...summarizeMcpToolCall(toolCall),
          threadIdSuffix: suffix(thread.id),
          fullIdsReturned: false,
        },
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runPluginReadProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  pluginName,
  remoteMarketplaceName = null,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_PLUGIN_READ !== "1") {
    throw new Error(
      "plugin reads require CODEX_APP_PORT_ALLOW_PLUGIN_READ=1 because they may retrieve plugin metadata, paths, URLs, and skill context",
    );
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const pluginRead = await client.request(APP_SERVER_METHODS.pluginRead, {
      pluginName,
      marketplacePath: null,
      remoteMarketplaceName,
    });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        pluginRead: summarizePluginRead(pluginRead),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runPluginContentReadProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  method,
  remoteMarketplaceName,
  remotePluginId,
  skillName,
  onNotification = null,
} = {}) {
  if (
    method === APP_SERVER_METHODS.pluginSkillRead &&
    process.env.CODEX_APP_PORT_ALLOW_PLUGIN_CONTENT_READ !== "1"
  ) {
    throw new Error(
      "plugin skill reads require CODEX_APP_PORT_ALLOW_PLUGIN_CONTENT_READ=1 because they may retrieve plugin-provided skill text",
    );
  }
  if (
    method === APP_SERVER_METHODS.pluginShareList &&
    process.env.CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_LIST !== "1"
  ) {
    throw new Error(
      "plugin share-list reads require CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_LIST=1 because they may retrieve remote sharing context",
    );
  }
  if (![APP_SERVER_METHODS.pluginSkillRead, APP_SERVER_METHODS.pluginShareList].includes(method)) {
    throw new Error("unsupported plugin content read method");
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const params =
      method === APP_SERVER_METHODS.pluginSkillRead
        ? {
            remoteMarketplaceName,
            remotePluginId,
            skillName,
          }
        : {};
    const pluginContentRead = await client.request(method, params);

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        pluginContentRead: summarizePluginContentRead(method, pluginContentRead),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runPluginUninstallProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  pluginId,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_PLUGIN_UNINSTALL !== "1") {
    throw new Error(
      "plugin uninstall requires CODEX_APP_PORT_ALLOW_PLUGIN_UNINSTALL=1 because it mutates installed plugin state",
    );
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const pluginUninstall = await client.request(APP_SERVER_METHODS.pluginUninstall, {
      pluginId,
    });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        pluginUninstall: summarizePluginUninstall(pluginUninstall),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export function summarizePluginShareCheckout(response) {
  const object = response && typeof response === "object" && !Array.isArray(response) ? response : {};
  return {
    method: APP_SERVER_METHODS.pluginShareCheckout,
    responseObject: Boolean(response && typeof response === "object" && !Array.isArray(response)),
    responseTopLevelKeyCount: Object.keys(object).length,
    marketplaceNamePresent: typeof object.marketplaceName === "string" && object.marketplaceName.length > 0,
    marketplacePathPresent: typeof object.marketplacePath === "string" && object.marketplacePath.length > 0,
    pluginIdPresent: typeof object.pluginId === "string" && object.pluginId.length > 0,
    pluginNamePresent: typeof object.pluginName === "string" && object.pluginName.length > 0,
    pluginPathPresent: typeof object.pluginPath === "string" && object.pluginPath.length > 0,
    remotePluginIdPresent:
      typeof object.remotePluginId === "string" && object.remotePluginId.length > 0,
    remoteVersionPresent:
      typeof object.remoteVersion === "string" && object.remoteVersion.length > 0,
    namesReturned: false,
    idsReturned: false,
    pathsReturned: false,
    urlsReturned: false,
    rawPayloadReturned: false,
  };
}

export async function runPluginShareCheckoutProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  remotePluginId,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_CHECKOUT !== "1") {
    throw new Error(
      "plugin share checkout requires CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_CHECKOUT=1 because it materializes shared plugin code",
    );
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const pluginShareCheckout = await client.request(APP_SERVER_METHODS.pluginShareCheckout, {
      remotePluginId,
    });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        pluginShareCheckout: summarizePluginShareCheckout(pluginShareCheckout),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runSkillsConfigWriteProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  skillName,
  enabled,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_SKILLS_CONFIG_WRITE !== "1") {
    throw new Error(
      "skills config writes require CODEX_APP_PORT_ALLOW_SKILLS_CONFIG_WRITE=1 because they mutate local Codex configuration",
    );
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const skillsConfigWrite = await client.request(APP_SERVER_METHODS.skillsConfigWrite, {
      name: skillName,
      path: null,
      enabled: Boolean(enabled),
    });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        skillsConfigWrite: summarizeSkillsConfigWrite(skillsConfigWrite),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runSkillsExtraRootsClearProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_SKILLS_EXTRA_ROOTS_CLEAR !== "1") {
    throw new Error(
      "skills extra roots clearing requires CODEX_APP_PORT_ALLOW_SKILLS_EXTRA_ROOTS_CLEAR=1 because it mutates local Codex skill root configuration",
    );
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const skillsExtraRootsClear = await client.request(APP_SERVER_METHODS.skillsExtraRootsSet, {
      extraRoots: [],
    });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        skillsExtraRootsClear: summarizeSkillsExtraRootsClear(skillsExtraRootsClear),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runRemoteControlDisableProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_DISABLE !== "1") {
    throw new Error(
      "remote control disable requires CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_DISABLE=1 because it mutates local Codex remote-control state",
    );
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const remoteControlDisable = await client.request(APP_SERVER_METHODS.remoteControlDisable, null);

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        remoteControlDisable: summarizeRemoteControlDisable(remoteControlDisable),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runRemoteControlClientsListProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  limit = 20,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_LIST !== "1") {
    throw new Error(
      "remote control client listing requires CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_LIST=1 because it inspects paired remote-control devices",
    );
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const status = await client.request(APP_SERVER_METHODS.remoteControlStatusRead, null);
    const environmentId = firstSafeString(status?.environmentId);
    if (!environmentId) {
      throwRequestError("Remote control environment is unavailable", 409);
    }
    const remoteControlClients = await client.request(APP_SERVER_METHODS.remoteControlClientList, {
      environmentId,
      cursor: null,
      limit,
      order: "desc",
    });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        remoteControlClients: summarizeRemoteControlClientsList(remoteControlClients, {
          environmentId,
        }),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runRemoteControlClientRevokeProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  environmentId,
  clientId,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_REVOKE !== "1") {
    throw new Error(
      "remote control client revoke requires CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_REVOKE=1 because it mutates paired remote-control devices",
    );
  }
  if (typeof environmentId !== "string" || environmentId.length === 0) {
    throwRequestError("Remote control environment is required", 400);
  }
  if (typeof clientId !== "string" || clientId.length === 0) {
    throwRequestError("Remote control client id is required", 400);
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const remoteControlClientRevoke = await client.request(
      APP_SERVER_METHODS.remoteControlClientRevoke,
      { environmentId, clientId },
    );

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        remoteControlClientRevoke: summarizeRemoteControlClientRevoke(remoteControlClientRevoke),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runEnvironmentAddProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  environmentId,
  execServerUrl,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_ENVIRONMENT_ADD !== "1") {
    throw new Error(
      "remote environment add requires CODEX_APP_PORT_ALLOW_ENVIRONMENT_ADD=1 because it mutates Codex remote environment configuration",
    );
  }
  if (typeof environmentId !== "string" || environmentId.length === 0) {
    throwRequestError("Remote environment id is required", 400);
  }
  if (typeof execServerUrl !== "string" || execServerUrl.length === 0) {
    throwRequestError("Remote environment exec server URL is required", 400);
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const environmentAdd = await client.request(APP_SERVER_METHODS.environmentAdd, {
      environmentId,
      execServerUrl,
      connectTimeoutMs: null,
    });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        environmentAdd: summarizeEnvironmentAdd(environmentAdd),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runLoadedSessionsProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  limit = DEFAULT_LOADED_SESSION_LIMIT,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_LOADED_SESSIONS !== "1") {
    throw new Error(
      "loaded session inventory requires CODEX_APP_PORT_ALLOW_LOADED_SESSIONS=1 because it inspects live app-server memory state",
    );
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request("initialize", {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify("initialized");

    const loadedSessions = await client.request("thread/loaded/list", {
      limit,
    });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        loadedSessions: summarizeLoadedSessions(loadedSessions, { limit }),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runThreadStartProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_THREAD_START !== "1") {
    throw new Error(
      "thread/start requires CODEX_APP_PORT_ALLOW_THREAD_START=1 because it creates app-server thread state",
    );
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const response = await client.request(
      APP_SERVER_METHODS.threadStart,
      {
        cwd,
        approvalPolicy: "on-request",
        approvalsReviewer: "user",
        sandbox: "read-only",
        ephemeral: false,
        environments: [],
        baseInstructions: null,
        developerInstructions: null,
        dynamicTools: null,
        threadSource: "user",
      },
      { timeoutMs },
    );
    const threadStart = normalizeThreadStartResponse(response);

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        threadStart: {
          method: APP_SERVER_METHODS.threadStart,
          threadIdSuffix: suffix(threadStart.thread?.id),
          status: statusLabel(threadStart.thread?.status),
          source: threadStart.thread?.source ?? null,
          modelProvider: firstSafeString(response?.modelProvider ?? threadStart.thread?.modelProvider),
          cwdBasename: basename(threadStart.thread?.cwd ?? response?.cwd),
          ephemeral: Boolean(threadStart.thread?.ephemeral),
          approvalPolicy: response?.approvalPolicy === "on-request" ? "on-request" : "unknown",
          approvalsReviewer: response?.approvalsReviewer === "user" ? "user" : "unknown",
          sandbox: summarizeThreadStartSandbox(response?.sandbox),
          environmentCount: 0,
          promptTextReturned: false,
          threadContentReturned: false,
          fullIdsReturned: false,
          cwdReturned: false,
          pathsReturned: false,
          instructionSourcesReturned: false,
        },
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runThreadArchiveProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  action = "archive",
  threadIdSuffix,
  threadScanLimit = DEFAULT_THREAD_DETAIL_SCAN_LIMIT,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_THREAD_ARCHIVE !== "1") {
    throw new Error(
      "thread/archive requires CODEX_APP_PORT_ALLOW_THREAD_ARCHIVE=1 because it mutates app-server thread state",
    );
  }
  const archiveAction = validateThreadArchiveAction(action);
  if (!isValidSuffix(threadIdSuffix)) {
    throwRequestError("Thread selector must be an 8-character id suffix", 400);
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const sourceArchived = archiveAction === "unarchive";
    const threads = await requestThreadList(client, {
      limit: threadScanLimit,
      archived: sourceArchived,
    });
    const thread = selectThreadBySuffix(threads.data, threadIdSuffix);
    const method =
      archiveAction === "archive"
        ? APP_SERVER_METHODS.threadArchive
        : APP_SERVER_METHODS.threadUnarchive;
    await client.request(method, { threadId: thread.id }, { timeoutMs });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        threadArchive: {
          method,
          action: archiveAction,
          threadIdSuffix: suffix(thread.id),
          sourceArchived,
          targetArchived: archiveAction === "archive",
          status: "completed",
          methodsUsed: [APP_SERVER_METHODS.threadList, method],
          threadContentReturned: false,
          fullIdsReturned: false,
          cwdReturned: false,
          pathsReturned: false,
          namesReturned: false,
          previewsReturned: false,
        },
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runThreadDeleteProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  threadIdSuffix,
  archived = false,
  threadScanLimit = DEFAULT_THREAD_DETAIL_SCAN_LIMIT,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_THREAD_DELETE !== "1") {
    throw new Error(
      "thread/delete requires CODEX_APP_PORT_ALLOW_THREAD_DELETE=1 because it deletes local thread history",
    );
  }
  if (!isValidSuffix(threadIdSuffix)) {
    throwRequestError("Thread selector must be an 8-character id suffix", 400);
  }

  const sourceArchived = archived === true;
  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const threads = await requestThreadList(client, {
      limit: threadScanLimit,
      archived: sourceArchived,
    });
    const thread = selectThreadBySuffix(threads.data, threadIdSuffix);
    await client.request(APP_SERVER_METHODS.threadDelete, { threadId: thread.id }, { timeoutMs });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        threadDelete: {
          method: APP_SERVER_METHODS.threadDelete,
          threadIdSuffix: suffix(thread.id),
          sourceArchived,
          status: "deleted",
          methodsUsed: [APP_SERVER_METHODS.threadList, APP_SERVER_METHODS.threadDelete],
          threadContentReturned: false,
          fullIdsReturned: false,
          cwdReturned: false,
          pathsReturned: false,
          namesReturned: false,
          previewsReturned: false,
          rawPayloadReturned: false,
        },
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runThreadForkProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  threadIdSuffix,
  threadScanLimit = DEFAULT_THREAD_DETAIL_SCAN_LIMIT,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_THREAD_FORK !== "1") {
    throw new Error(
      "thread/fork requires CODEX_APP_PORT_ALLOW_THREAD_FORK=1 because it creates local thread metadata",
    );
  }
  if (!isValidSuffix(threadIdSuffix)) {
    throwRequestError("Thread selector must be an 8-character id suffix", 400);
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const sourceThread = await selectThreadBySuffixFromLists(client, {
      threadIdSuffix,
      threadScanLimit,
    });
    const fork = normalizeThreadStartResponse(
      await client.request(
        APP_SERVER_METHODS.threadFork,
        {
          threadId: sourceThread.id,
          excludeTurns: true,
        },
        { timeoutMs },
      ),
    );

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        threadFork: {
          method: APP_SERVER_METHODS.threadFork,
          sourceThreadIdSuffix: suffix(sourceThread.id),
          threadIdSuffix: suffix(fork.thread.id),
          status: statusLabel(fork.thread.status),
          methodsUsed: [APP_SERVER_METHODS.threadList, APP_SERVER_METHODS.threadFork],
          excludeTurns: true,
          threadContentReturned: false,
          fullIdsReturned: false,
          cwdReturned: false,
          pathsReturned: false,
          namesReturned: false,
          previewsReturned: false,
          rawPayloadReturned: false,
        },
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runThreadRenameProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  threadIdSuffix,
  name,
  threadScanLimit = DEFAULT_THREAD_DETAIL_SCAN_LIMIT,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_THREAD_RENAME !== "1") {
    throw new Error(
      "thread/name/set requires CODEX_APP_PORT_ALLOW_THREAD_RENAME=1 because it mutates local thread metadata",
    );
  }
  if (!isValidSuffix(threadIdSuffix)) {
    throwRequestError("Thread selector must be an 8-character id suffix", 400);
  }
  const safeName = validateThreadRenameName(name);

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const thread = await selectThreadBySuffixFromLists(client, {
      threadIdSuffix,
      threadScanLimit,
    });
    await client.request(
      APP_SERVER_METHODS.threadSetName,
      {
        threadId: thread.id,
        name: safeName,
      },
      { timeoutMs },
    );

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        threadRename: {
          method: APP_SERVER_METHODS.threadSetName,
          threadIdSuffix: suffix(thread.id),
          status: "renamed",
          methodsUsed: [APP_SERVER_METHODS.threadList, APP_SERVER_METHODS.threadSetName],
          nameCharCount: safeName.length,
          nameLineCount: countLines(safeName),
          nameReturned: false,
          threadContentReturned: false,
          fullIdsReturned: false,
          cwdReturned: false,
          pathsReturned: false,
          previewsReturned: false,
          rawPayloadReturned: false,
        },
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runThreadRollbackProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  threadIdSuffix,
  numTurns,
  threadScanLimit = DEFAULT_THREAD_DETAIL_SCAN_LIMIT,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_THREAD_ROLLBACK !== "1") {
    throw new Error(
      "thread/rollback requires CODEX_APP_PORT_ALLOW_THREAD_ROLLBACK=1 because it mutates local thread history",
    );
  }
  if (!isValidSuffix(threadIdSuffix)) {
    throwRequestError("Thread selector must be an 8-character id suffix", 400);
  }
  const safeNumTurns = validateThreadRollbackTurns(numTurns);

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const thread = await selectThreadBySuffixFromLists(client, {
      threadIdSuffix,
      threadScanLimit,
    });
    const rollback = normalizeThreadReadResponse(
      await client.request(
        APP_SERVER_METHODS.threadRollback,
        {
          threadId: thread.id,
          numTurns: safeNumTurns,
        },
        { timeoutMs },
      ),
    );
    const returnedTurns = Array.isArray(rollback.thread?.turns) ? rollback.thread.turns : [];

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        threadRollback: {
          method: APP_SERVER_METHODS.threadRollback,
          threadIdSuffix: suffix(thread.id),
          numTurns: safeNumTurns,
          status: statusLabel(rollback.thread.status),
          returnedTurnCount: returnedTurns.length,
          methodsUsed: [APP_SERVER_METHODS.threadList, APP_SERVER_METHODS.threadRollback],
          threadContentReturned: false,
          fullIdsReturned: false,
          cwdReturned: false,
          pathsReturned: false,
          namesReturned: false,
          previewsReturned: false,
          rawPayloadReturned: false,
        },
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runThreadSafetyLockProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  threadIdSuffix,
  threadScanLimit = DEFAULT_THREAD_DETAIL_SCAN_LIMIT,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_THREAD_SAFETY_LOCK !== "1") {
    throw new Error(
      "thread/settings/update safety lock requires CODEX_APP_PORT_ALLOW_THREAD_SAFETY_LOCK=1 because it mutates future thread execution policy",
    );
  }
  if (!isValidSuffix(threadIdSuffix)) {
    throwRequestError("Thread selector must be an 8-character id suffix", 400);
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const thread = await selectThreadBySuffixFromLists(client, {
      threadIdSuffix,
      threadScanLimit,
    });
    const response = await client.request(
      APP_SERVER_METHODS.threadSettingsUpdate,
      {
        threadId: thread.id,
        approvalPolicy: "on-request",
        approvalsReviewer: "user",
        sandboxPolicy: {
          type: "readOnly",
          networkAccess: false,
        },
      },
      { timeoutMs },
    );

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        threadSafetyLock: {
          method: APP_SERVER_METHODS.threadSettingsUpdate,
          threadIdSuffix: suffix(thread.id),
          status: "safety-locked",
          methodsUsed: [APP_SERVER_METHODS.threadList, APP_SERVER_METHODS.threadSettingsUpdate],
          approvalPolicy: "on-request",
          approvalsReviewer: "user",
          sandboxPolicyType: "readOnly",
          networkAccessAllowed: false,
          responseObject: Boolean(response && typeof response === "object"),
          responseTopLevelKeyCount:
            response && typeof response === "object" ? Object.keys(response).length : 0,
          modelAcceptedFromBrowser: false,
          cwdAcceptedFromBrowser: false,
          permissionsAcceptedFromBrowser: false,
          fullIdsReturned: false,
          cwdReturned: false,
          pathsReturned: false,
          threadContentReturned: false,
          rawPayloadReturned: false,
        },
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runAccountLogoutProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_ACCOUNT_LOGOUT !== "1") {
    throw new Error(
      "account/logout requires CODEX_APP_PORT_ALLOW_ACCOUNT_LOGOUT=1 because it mutates local auth state",
    );
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);
    await client.request(APP_SERVER_METHODS.accountLogout, null, { timeoutMs });

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        accountLogout: {
          method: APP_SERVER_METHODS.accountLogout,
          resultStatus: "logged-out",
          modelTraffic: false,
          authMutation: true,
          tokensReturned: false,
          accountIdentifiersReturned: false,
          urlsReturned: false,
          rawPayloadReturned: false,
        },
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runAccountCreditsNudgeProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  creditType,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_ACCOUNT_CREDITS_NUDGE !== "1") {
    throw new Error(
      "account/sendAddCreditsNudgeEmail requires CODEX_APP_PORT_ALLOW_ACCOUNT_CREDITS_NUDGE=1 because it sends an account email",
    );
  }

  if (!["credits", "usage_limit"].includes(creditType)) {
    throw new Error("account credits nudge requires a supported credit type");
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);
    const result = await client.request(
      APP_SERVER_METHODS.accountSendAddCreditsNudgeEmail,
      { creditType },
      { timeoutMs },
    );
    const status = ["sent", "cooldown_active"].includes(result?.status)
      ? result.status
      : "unknown";

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        accountCreditsNudge: {
          method: APP_SERVER_METHODS.accountSendAddCreditsNudgeEmail,
          creditType,
          resultStatus: status,
          emailSideEffect: true,
          modelTraffic: false,
          authMutation: true,
          tokensReturned: false,
          accountIdentifiersReturned: false,
          urlsReturned: false,
          rawPayloadReturned: false,
        },
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runAccountRateLimitResetCreditConsumeProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  idempotencyKey,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_ACCOUNT_RESET_CREDIT_CONSUME !== "1") {
    throw new Error(
      "account/rateLimitResetCredit/consume requires CODEX_APP_PORT_ALLOW_ACCOUNT_RESET_CREDIT_CONSUME=1 because it mutates account quota state",
    );
  }

  if (typeof idempotencyKey !== "string" || idempotencyKey.length < 16) {
    throw new Error("account rate-limit reset credit consume requires a server idempotency key");
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);
    const result = await client.request(
      APP_SERVER_METHODS.accountRateLimitResetCreditConsume,
      { idempotencyKey },
      { timeoutMs },
    );
    const outcome = sanitizeRateLimitResetCreditOutcome(result?.outcome);

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        accountRateLimitResetCreditConsume: {
          method: APP_SERVER_METHODS.accountRateLimitResetCreditConsume,
          outcome,
          responseObject: result && typeof result === "object",
          responseTopLevelKeyCount:
            result && typeof result === "object" ? Object.keys(result).length : 0,
          idempotencyKeyReturned: false,
          quotaMutation: true,
          modelTraffic: false,
          tokensReturned: false,
          accountIdentifiersReturned: false,
          urlsReturned: false,
          rateLimitValuesReturned: false,
          rawPayloadReturned: false,
        },
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runAccountLoginStartProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  onLoginStarted = null,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_ACCOUNT_LOGIN !== "1") {
    throw new Error(
      "account login requires CODEX_APP_PORT_ALLOW_ACCOUNT_LOGIN=1 because it starts an auth flow",
    );
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);
    const accountLoginStart = await client.request(
      APP_SERVER_METHODS.accountLoginStart,
      { type: "chatgptDeviceCode" },
      { timeoutMs },
    );
    if (typeof accountLoginStart?.loginId === "string") {
      onLoginStarted?.({
        loginId: accountLoginStart.loginId,
        resultType: typeof accountLoginStart.type === "string" ? accountLoginStart.type : "unknown",
      });
    }

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        accountLoginStart: summarizeAccountLoginStart(accountLoginStart),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runAccountLoginCancelProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  loginId,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_ACCOUNT_LOGIN_CANCEL !== "1") {
    throw new Error(
      "account login cancel requires CODEX_APP_PORT_ALLOW_ACCOUNT_LOGIN_CANCEL=1 because it mutates an auth flow",
    );
  }
  if (typeof loginId !== "string" || loginId.length === 0) {
    throw new Error("account login cancel requires a server-side login id");
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);
    const accountLoginCancel = await client.request(
      APP_SERVER_METHODS.accountLoginCancel,
      { loginId },
      { timeoutMs },
    );

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        accountLoginCancel: summarizeAccountLoginCancel(accountLoginCancel),
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runLiveSessionControlProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  action,
  threadIdSuffix,
  turnIdSuffix = null,
  prompt = null,
  onNotification = null,
} = {}) {
  if (action === "steer" && process.env.CODEX_APP_PORT_ALLOW_TURN_STEER !== "1") {
    throw new Error(
      "turn/steer requires CODEX_APP_PORT_ALLOW_TURN_STEER=1 because it sends authenticated model traffic",
    );
  }
  if (action !== "steer" && process.env.CODEX_APP_PORT_ALLOW_LIVE_SESSION_CONTROL !== "1") {
    throw new Error(
      "live session control requires CODEX_APP_PORT_ALLOW_LIVE_SESSION_CONTROL=1 because it mutates loaded app-server session state",
    );
  }
  if (!["interrupt", "unsubscribe", "steer"].includes(action)) {
    throwRequestError("Live session control action is unsupported", 400);
  }
  if (!isValidSuffix(threadIdSuffix)) {
    throwRequestError("Thread selector must be an 8-character id suffix", 400);
  }
  if ((action === "interrupt" || action === "steer") && !isValidSuffix(turnIdSuffix)) {
    throwRequestError("Turn selector must be an 8-character id suffix", 400);
  }
  const steerPrompt = action === "steer" ? validateSteerPrompt(prompt) : null;

  const notifications = [];
  const methodsUsed = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request("initialize", {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify("initialized");

    const loadedSessions = await client.request("thread/loaded/list", {
      limit: DEFAULT_LOADED_SESSION_LIMIT,
    });
    methodsUsed.push("thread/loaded/list");
    const threadId = selectLoadedThreadIdBySuffix(loadedSessions, threadIdSuffix);
    const loadedSessionCount = Array.isArray(loadedSessions?.data) ? loadedSessions.data.length : 0;

    let turnId = null;
    let resultStatus = null;
    if (action === "interrupt" || action === "steer") {
      const detail = normalizeThreadReadResponse(
        await client.request("thread/read", {
          threadId,
          includeTurns: true,
        }),
      );
      methodsUsed.push("thread/read");
      turnId = selectTurnIdBySuffix(detail.thread?.turns, turnIdSuffix);
    }

    let responseTurnId = null;
    if (action === "interrupt") {
      await client.request(
        "turn/interrupt",
        {
          threadId,
          turnId,
        },
        { timeoutMs },
      );
      methodsUsed.push("turn/interrupt");
      resultStatus = "interrupt-requested";
    } else if (action === "steer") {
      const result = await client.request(
        "turn/steer",
        {
          threadId,
          expectedTurnId: turnId,
          input: [
            {
              type: "text",
              text: steerPrompt,
              text_elements: [],
            },
          ],
        },
        { timeoutMs },
      );
      methodsUsed.push("turn/steer");
      responseTurnId = typeof result?.turnId === "string" ? result.turnId : null;
      resultStatus = "steer-submitted";
    } else {
      const result = await client.request(
        "thread/unsubscribe",
        {
          threadId,
        },
        { timeoutMs },
      );
      methodsUsed.push("thread/unsubscribe");
      resultStatus = typeof result?.status === "string" ? result.status : "unknown";
    }

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        liveSessionControl: {
          action,
          method: liveSessionControlMethod(action),
          threadIdSuffix: suffix(threadId),
          turnIdSuffix: suffix(turnId),
          responseTurnIdSuffix: suffix(responseTurnId),
          resultStatus,
          loadedSessionCount,
          methodsUsed,
          promptCharCount: steerPrompt?.length ?? 0,
          promptLineCount: steerPrompt ? steerPrompt.split(/\r\n|\r|\n/).length : 0,
          promptTextReturned: false,
          fullIdsReturned: false,
          threadContentReturned: false,
        },
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runTerminalCommandExecProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  argv,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_TERMINAL_COMMAND !== "1") {
    throw new Error(
      "command/exec requires CODEX_APP_PORT_ALLOW_TERMINAL_COMMAND=1 because it executes host commands through app-server",
    );
  }
  if (!Array.isArray(argv) || argv.length === 0 || !argv.every((item) => typeof item === "string")) {
    throwRequestError("Command argv is invalid", 400);
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const commandTimeoutMs = Math.min(timeoutMs, DEFAULT_TERMINAL_COMMAND_TIMEOUT_MS);
    const result = await client.request(
      APP_SERVER_METHODS.commandExec,
      {
        command: argv,
        cwd,
        sandboxPolicy: {
          type: "readOnly",
          networkAccess: false,
        },
        env: null,
        outputBytesCap: 0,
        timeoutMs: commandTimeoutMs,
        streamStdin: false,
        streamStdoutStderr: false,
        tty: false,
      },
      { timeoutMs: commandTimeoutMs + 1_000 },
    );

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        terminalCommandExec: {
          method: APP_SERVER_METHODS.commandExec,
          resultStatus: "completed",
          exitCode: Number.isSafeInteger(result?.exitCode) ? result.exitCode : null,
          argvCount: argv.length,
          timeoutMs: commandTimeoutMs,
          sandboxPolicy: "readOnly",
          networkAccess: false,
          stdout: terminalTextSummary(result?.stdout),
          stderr: terminalTextSummary(result?.stderr),
          commandTextReturned: false,
          argvReturned: false,
          cwdReturned: false,
          outputTextReturned: false,
          processIdReturned: false,
          stdinEnabled: false,
          ttyEnabled: false,
          streamedOutputEnabled: false,
          environmentReturned: false,
        },
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runProcessSpawnProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = ["app-server", "--listen", "stdio://"],
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  argv,
  processHandle = `codex-app-port-${randomBytes(12).toString("hex")}`,
  onNotification = null,
} = {}) {
  if (process.env.CODEX_APP_PORT_ALLOW_PROCESS_SPAWN !== "1") {
    throw new Error(
      "process/spawn requires CODEX_APP_PORT_ALLOW_PROCESS_SPAWN=1 because it starts an unsandboxed host process through app-server",
    );
  }
  if (!Array.isArray(argv) || argv.length === 0 || !argv.every((item) => typeof item === "string")) {
    throwRequestError("Process argv is invalid", 400);
  }

  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: codexArgs,
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify(APP_SERVER_METHODS.initialized);

    const processTimeoutMs = Math.min(timeoutMs, DEFAULT_PROCESS_SPAWN_TIMEOUT_MS);
    await client.request(
      APP_SERVER_METHODS.processSpawn,
      {
        command: argv,
        cwd,
        env: null,
        outputBytesCap: 0,
        processHandle,
        size: null,
        streamStdin: false,
        streamStdoutStderr: false,
        timeoutMs: processTimeoutMs,
        tty: false,
      },
      { timeoutMs: processTimeoutMs + 1_000 },
    );

    const exited = await client.waitForNotification(
      (notification) =>
        notification?.method === "process/exited" &&
        notification?.params?.processHandle === processHandle,
      { timeoutMs: processTimeoutMs + 1_000 },
    );
    const params = exited?.params ?? {};

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: summarizeInitialize(initialize),
      probes: {
        processSpawn: {
          method: APP_SERVER_METHODS.processSpawn,
          resultStatus: "exited",
          exitCode: Number.isSafeInteger(params.exitCode) ? params.exitCode : null,
          argvCount: argv.length,
          timeoutMs: processTimeoutMs,
          sandboxPolicy: "none",
          networkAccess: true,
          stdout: terminalTextSummary(params.stdout),
          stderr: terminalTextSummary(params.stderr),
          stdoutCapReached: Boolean(params.stdoutCapReached),
          stderrCapReached: Boolean(params.stderrCapReached),
          commandTextReturned: false,
          argvReturned: false,
          cwdReturned: false,
          outputTextReturned: false,
          processHandleReturned: false,
          stdinEnabled: false,
          ttyEnabled: false,
          streamedOutputEnabled: false,
          environmentReturned: false,
          environmentInherited: true,
        },
      },
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runAppServerProbe({
  codexBin = process.env.CODEX_BIN || "codex",
  cwd = process.cwd(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  readonly = true,
  threadLimit = DEFAULT_THREAD_LIMIT,
  allowAgentTurn = false,
  turnTimeoutMs = null,
  onNotification = null,
} = {}) {
  const notifications = [];
  const client = new JsonlRpcClient({
    command: codexBin,
    args: ["app-server", "--listen", "stdio://"],
    cwd,
    timeoutMs,
    onNotification(notification) {
      notifications.push({
        method: notification.method,
      });
      onNotification?.(notification);
    },
  });

  await client.start();

  try {
    const initialize = normalizeInitializeResponse(
      await client.request("initialize", {
        clientInfo: {
          name: "codex_app_port",
          title: "Codex App Port",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );

    client.notify("initialized");

    const probes = {};
    if (readonly) {
      const config = normalizeConfigReadResponse(
        await client.request("config/read", {
          includeLayers: false,
          cwd,
        }),
      );
      probes.config = summarizeConfig(config);

      const threads = normalizeThreadListResponse(
        await client.request("thread/list", {
          limit: threadLimit,
          archived: false,
          useStateDbOnly: true,
        }),
      );
      probes.threads = summarizeThreadList(threads, { archived: false });

      try {
        const archivedThreads = normalizeThreadListResponse(
          await client.request("thread/list", {
            limit: threadLimit,
            archived: true,
            useStateDbOnly: true,
          }),
        );
        probes.archivedThreads = summarizeThreadList(archivedThreads, { archived: true });
      } catch {
        probes.archivedThreads = summarizeThreadList({ data: [] }, {
          archived: true,
          unavailable: true,
        });
      }
    }

    if (allowAgentTurn) {
      probes.agentTurn = await runAgentTurnSmoke(client, {
        timeoutMs: turnTimeoutMs ?? timeoutMs,
      });
      probes.agentTurn.workspaceRemoved = true;
    }

    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      codex: {
        bin: codexBin,
      },
      initialize: summarizeInitialize(initialize),
      probes,
      notifications: notificationCounts(notifications),
    };
  } finally {
    await client.close();
  }
}

export async function runAgentTurnSmoke(client, { timeoutMs }) {
  if (process.env.CODEX_APP_PORT_ALLOW_AGENT_TURN !== "1") {
    throw new Error(
      "--allow-agent-turn requires CODEX_APP_PORT_ALLOW_AGENT_TURN=1 because it can use authenticated model traffic",
    );
  }

  const workspace = await mkdtemp(join(tmpdir(), "codex-app-port-smoke-"));
  const eventLog = [];
  let threadId = null;
  let turnId = null;
  const eventListener = (notification) => {
    eventLog.push(sanitizeNotification(notification, { threadId, turnId }));
  };
  client.addNotificationListener(eventListener);
  try {
    await writeFile(
      join(workspace, "README.md"),
      "Temporary workspace for the Codex app-server smoke harness.\n",
      "utf8",
    );

    const threadStart = normalizeThreadStartResponse(
      await client.request(
        "thread/start",
        {
          cwd: workspace,
          approvalPolicy: "on-request",
          approvalsReviewer: "user",
          sandbox: "read-only",
          ephemeral: true,
          developerInstructions:
            "This is a smoke test. Do not inspect files, run commands, use tools, or modify files. Reply with exactly PONG.",
        },
        { timeoutMs },
      ),
    );

    threadId = threadStart?.thread?.id;
    if (!threadId) {
      throw new Error("thread/start did not return a thread id");
    }

    const turnStart = normalizeTurnStartResponse(
      await client.request(
        "turn/start",
        {
          threadId,
          input: [
            {
              type: "text",
              text: "Reply with exactly PONG.",
              textElements: [],
            },
          ],
          approvalPolicy: "on-request",
        },
        { timeoutMs },
      ),
    );

    turnId = turnStart?.turn?.id ?? null;
    const completed = normalizeNotification(
      await client.waitForNotification(
        (notification) =>
          notification.method === "turn/completed" &&
          notification.params?.threadId === threadId &&
          notificationTurnId(notification) === turnId,
        { timeoutMs },
      ),
    );

    return {
      workspaceRemoved: false,
      threadIdSuffix: suffix(threadId),
      turnIdSuffix: suffix(turnId),
      completedStatus: completed.params?.turn?.status ?? null,
      events: eventLog,
    };
  } finally {
    client.removeNotificationListener(eventListener);
    await rm(workspace, { recursive: true, force: true });
  }
}

async function readInventorySection(requestFn) {
  try {
    return {
      ok: true,
      result: await requestFn(),
    };
  } catch {
    return {
      ok: false,
      result: null,
    };
  }
}

function summarizeThreadStartSandbox(sandbox) {
  if (typeof sandbox === "string") {
    return sandbox === "read-only" ? "read-only" : "unknown";
  }
  if (sandbox && typeof sandbox === "object") {
    if (sandbox.mode === "read-only" || sandbox.type === "readOnly") {
      return "read-only";
    }
  }
  return "unknown";
}

function summarizeAccountInventory(section) {
  const result = section.ok ? section.result ?? {} : {};
  const account = result.account && typeof result.account === "object" ? result.account : null;
  return {
    ok: section.ok,
    requiresOpenaiAuth: Boolean(result.requiresOpenaiAuth),
    hasAccount: Boolean(account),
    accountType: firstSafeString(account?.type),
    tokenReturned: false,
    emailReturned: false,
  };
}

function summarizeAccountRateLimitsInventory(section) {
  const result = section.ok && section.result && typeof section.result === "object"
    ? section.result
    : {};
  const byLimitId =
    result.rateLimitsByLimitId &&
    typeof result.rateLimitsByLimitId === "object" &&
    !Array.isArray(result.rateLimitsByLimitId)
      ? Object.values(result.rateLimitsByLimitId)
      : [];
  const snapshots =
    byLimitId.length > 0
      ? byLimitId
      : result.rateLimits && typeof result.rateLimits === "object"
      ? [result.rateLimits]
      : [];

  let primaryWindowCount = 0;
  let secondaryWindowCount = 0;
  let creditsBucketCount = 0;
  let limitedCreditsBucketCount = 0;
  let hasCreditsBucketCount = 0;
  let reachedBucketCount = 0;

  for (const snapshot of snapshots) {
    if (!snapshot || typeof snapshot !== "object") {
      continue;
    }
    if (snapshot.primary && typeof snapshot.primary === "object") {
      primaryWindowCount += 1;
    }
    if (snapshot.secondary && typeof snapshot.secondary === "object") {
      secondaryWindowCount += 1;
    }
    if (snapshot.credits && typeof snapshot.credits === "object") {
      creditsBucketCount += 1;
      if (snapshot.credits.hasCredits === true) {
        hasCreditsBucketCount += 1;
      }
      if (snapshot.credits.unlimited === false) {
        limitedCreditsBucketCount += 1;
      }
    }
    if (firstSafeString(snapshot.rateLimitReachedType)) {
      reachedBucketCount += 1;
    }
  }

  return {
    ok: section.ok,
    bucketCount: snapshots.length,
    primaryWindowCount,
    secondaryWindowCount,
    creditsBucketCount,
    limitedCreditsBucketCount,
    hasCreditsBucketCount,
    reachedBucketCount,
    rateLimitReached: reachedBucketCount > 0,
    planTypesReturned: false,
    limitIdsReturned: false,
    limitNamesReturned: false,
    balancesReturned: false,
    usedPercentsReturned: false,
    resetTimesReturned: false,
    windowDurationsReturned: false,
  };
}

function summarizeAccountUsageInventory(section) {
  const result = section.ok && section.result && typeof section.result === "object"
    ? section.result
    : {};
  const summary = result.summary && typeof result.summary === "object" ? result.summary : {};
  const dailyUsageBuckets = Array.isArray(result.dailyUsageBuckets)
    ? result.dailyUsageBuckets
    : [];
  const summaryFields = [
    "currentStreakDays",
    "lifetimeTokens",
    "longestRunningTurnSec",
    "longestStreakDays",
    "peakDailyTokens",
  ];

  return {
    ok: section.ok,
    summaryMetricCount: summaryFields.filter((field) => summary[field] != null).length,
    dailyBucketCount: dailyUsageBuckets.length,
    bucketWithTokenCount: dailyUsageBuckets.filter((bucket) => bucket?.tokens != null).length,
    bucketWithStartDateCount: dailyUsageBuckets.filter((bucket) => firstSafeString(bucket?.startDate))
      .length,
    usageValuesReturned: false,
    dailyBucketDatesReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizeWorkspaceMessagesInventory(section) {
  const result = section.ok && section.result && typeof section.result === "object"
    ? section.result
    : {};
  const messages = Array.isArray(result.messages) ? result.messages : [];
  const messageTypeCounts = {};
  let archivedTimestampCount = 0;
  let createdTimestampCount = 0;
  let bodyCount = 0;

  for (const message of messages) {
    incrementCount(messageTypeCounts, safeWorkspaceMessageType(message?.messageType));
    if (message?.archivedAt != null) {
      archivedTimestampCount += 1;
    }
    if (message?.createdAt != null) {
      createdTimestampCount += 1;
    }
    if (firstSafeString(message?.messageBody)) {
      bodyCount += 1;
    }
  }

  return {
    ok: section.ok,
    featureEnabled: result.featureEnabled === true,
    messageCount: messages.length,
    messageTypeCounts,
    bodyCount,
    archivedTimestampCount,
    createdTimestampCount,
    messageIdsReturned: false,
    messageBodiesReturned: false,
    timestampsReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizeRemoteControlStatusInventory(section) {
  const result = section.ok && section.result && typeof section.result === "object"
    ? section.result
    : {};
  const status = safeRemoteControlStatus(result.status);
  const statusCounts = {};
  incrementCount(statusCounts, status);
  const identityFieldCount = [
    result.environmentId,
    result.installationId,
    result.serverName,
  ].filter((value) => firstSafeString(value)).length;

  return {
    ok: section.ok,
    statusKnown: status !== "unknown",
    statusCounts,
    identityFieldCount,
    environmentIdPresent: Boolean(firstSafeString(result.environmentId)),
    installationIdPresent: Boolean(firstSafeString(result.installationId)),
    serverNamePresent: Boolean(firstSafeString(result.serverName)),
    statusValueReturned: false,
    environmentIdReturned: false,
    installationIdReturned: false,
    serverNameReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizeModelsInventory(section, { includeNames = false } = {}) {
  const data = section.ok && Array.isArray(section.result?.data) ? section.result.data : [];
  let defaultCount = 0;
  let hiddenCount = 0;
  let visibleCount = 0;
  let textInputCount = 0;
  let imageInputCount = 0;
  let personalityCount = 0;
  let upgradeCount = 0;
  let upgradeInfoCount = 0;
  let availabilityNuxCount = 0;
  let serviceTierCount = 0;
  let additionalSpeedTierCount = 0;
  let reasoningEffortOptionCount = 0;
  let descriptionCount = 0;
  let displayNameCount = 0;
  let nameRedactedCount = 0;
  const defaultReasoningEffortCounts = {};
  const items = [];

  for (const model of data) {
    if (model?.isDefault === true) {
      defaultCount += 1;
    }
    if (model?.hidden === true) {
      hiddenCount += 1;
    } else {
      visibleCount += 1;
    }
    const inputModalities = Array.isArray(model?.inputModalities) ? model.inputModalities : [];
    if (inputModalities.includes("text")) {
      textInputCount += 1;
    }
    if (inputModalities.includes("image")) {
      imageInputCount += 1;
    }
    if (model?.supportsPersonality === true) {
      personalityCount += 1;
    }
    if (firstSafeString(model?.upgrade)) {
      upgradeCount += 1;
    }
    if (model?.upgradeInfo && typeof model.upgradeInfo === "object") {
      upgradeInfoCount += 1;
    }
    if (model?.availabilityNux && typeof model.availabilityNux === "object") {
      availabilityNuxCount += 1;
    }
    if (Array.isArray(model?.serviceTiers)) {
      serviceTierCount += model.serviceTiers.length;
    }
    if (Array.isArray(model?.additionalSpeedTiers)) {
      additionalSpeedTierCount += model.additionalSpeedTiers.length;
    }
    const reasoningOptions = Array.isArray(model?.supportedReasoningEfforts)
      ? model.supportedReasoningEfforts
      : [];
    reasoningEffortOptionCount += reasoningOptions.length;
    const defaultReasoningEffort = safeReasoningEffort(model?.defaultReasoningEffort);
    defaultReasoningEffortCounts[defaultReasoningEffort] =
      (defaultReasoningEffortCounts[defaultReasoningEffort] ?? 0) + 1;
    if (firstSafeString(model?.description)) {
      descriptionCount += 1;
    }
    if (firstSafeString(model?.displayName)) {
      displayNameCount += 1;
    }
    if (includeNames && items.length < DEFAULT_INTEGRATION_ITEM_LIMIT) {
      const safeName = safeIntegrationDisplayName(model?.displayName);
      if (!safeName && typeof model?.displayName === "string") {
        nameRedactedCount += 1;
      }
      items.push({
        name: safeName,
        hidden: model?.hidden === true,
        default: model?.isDefault === true,
        textInput: inputModalities.includes("text"),
        imageInput: inputModalities.includes("image"),
        serviceTierCount: Array.isArray(model?.serviceTiers) ? model.serviceTiers.length : 0,
        reasoningEffortCount: reasoningOptions.length,
      });
    }
  }

  return {
    ok: section.ok,
    modelCount: data.length,
    defaultCount,
    hiddenCount,
    visibleCount,
    textInputCount,
    imageInputCount,
    personalityCount,
    upgradeCount,
    upgradeInfoCount,
    availabilityNuxCount,
    serviceTierCount,
    additionalSpeedTierCount,
    reasoningEffortOptionCount,
    descriptionCount,
    displayNameCount,
    defaultReasoningEffortCounts,
    hasNextCursor: typeof section.result?.nextCursor === "string",
    returnedModelCount: items.length,
    items,
    namesReturned: includeNames && items.some((item) => item.name),
    nameRedactedCount,
    modelIdsReturned: false,
    descriptionsReturned: false,
    upgradeCopyReturned: false,
    availabilityMessagesReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizeModelProviderCapabilitiesInventory(section) {
  const result = section.ok && section.result && typeof section.result === "object"
    ? section.result
    : {};
  const capabilityEntries = [
    ["imageGeneration", result.imageGeneration],
    ["namespaceTools", result.namespaceTools],
    ["webSearch", result.webSearch],
  ];
  const enabledCapabilityCount = capabilityEntries.filter(([, value]) => value === true).length;
  const disabledCapabilityCount = capabilityEntries.filter(([, value]) => value === false).length;
  return {
    ok: section.ok,
    capabilityCount: capabilityEntries.length,
    enabledCapabilityCount,
    disabledCapabilityCount,
    imageGenerationEnabled: result.imageGeneration === true,
    namespaceToolsEnabled: result.namespaceTools === true,
    webSearchEnabled: result.webSearch === true,
    rawPayloadReturned: false,
  };
}

function summarizeCollaborationModesInventory(section, { includeNames = false } = {}) {
  const data = section.ok && Array.isArray(section.result?.data) ? section.result.data : [];
  const modeKindCounts = {};
  const reasoningEffortCounts = {};
  let modelOverrideCount = 0;
  let reasoningEffortOverrideCount = 0;
  let nameRedactedCount = 0;
  const items = [];

  for (const mode of data) {
    const modeKind = safeCollaborationModeKind(mode?.mode);
    modeKindCounts[modeKind] = (modeKindCounts[modeKind] ?? 0) + 1;
    if (firstSafeString(mode?.model)) {
      modelOverrideCount += 1;
    }
    const reasoningEffort = safeReasoningEffort(mode?.reasoning_effort, null);
    if (reasoningEffort) {
      reasoningEffortOverrideCount += 1;
      reasoningEffortCounts[reasoningEffort] = (reasoningEffortCounts[reasoningEffort] ?? 0) + 1;
    }
    if (includeNames && items.length < DEFAULT_INTEGRATION_ITEM_LIMIT) {
      const safeName = safeIntegrationDisplayName(mode?.name);
      if (!safeName && typeof mode?.name === "string") {
        nameRedactedCount += 1;
      }
      items.push({
        name: safeName,
        mode: modeKind,
        hasModelOverride: Boolean(firstSafeString(mode?.model)),
        hasReasoningEffortOverride: Boolean(reasoningEffort),
      });
    }
  }

  return {
    ok: section.ok,
    modeCount: data.length,
    modeKindCounts,
    modelOverrideCount,
    reasoningEffortOverrideCount,
    reasoningEffortCounts,
    returnedModeCount: items.length,
    items,
    namesReturned: includeNames && items.some((item) => item.name),
    nameRedactedCount,
    modelIdsReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizePermissionProfilesInventory(section) {
  const data = section.ok && Array.isArray(section.result?.data) ? section.result.data : [];
  let allowedCount = 0;
  let blockedCount = 0;
  let descriptionCount = 0;

  for (const profile of data) {
    if (profile?.allowed === true) {
      allowedCount += 1;
    } else {
      blockedCount += 1;
    }
    if (firstSafeString(profile?.description)) {
      descriptionCount += 1;
    }
  }

  return {
    ok: section.ok,
    profileCount: data.length,
    allowedCount,
    blockedCount,
    descriptionCount,
    hasNextCursor: typeof section.result?.nextCursor === "string",
    idsReturned: false,
    descriptionsReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizeAppsInventory(section, { includeNames = false } = {}) {
  const data = section.ok && Array.isArray(section.result?.data) ? section.result.data : [];
  let enabledCount = 0;
  let disabledCount = 0;
  let accessibleCount = 0;
  let inaccessibleCount = 0;
  let discoverableCount = 0;
  let metadataCount = 0;
  let brandingCount = 0;
  let developerCount = 0;
  let categoryValueCount = 0;
  let distributionChannelValueCount = 0;
  let firstPartyTypeValueCount = 0;
  let reviewStatusValueCount = 0;
  let labelKeyCount = 0;
  let pluginDisplayNameCount = 0;
  let screenshotCount = 0;
  let urlFieldCount = 0;
  let nameRedactedCount = 0;
  let pluginDisplayNameRedactedCount = 0;
  const items = [];

  for (const app of data) {
    if (app?.isEnabled === false) {
      disabledCount += 1;
    } else {
      enabledCount += 1;
    }
    if (app?.isAccessible === true) {
      accessibleCount += 1;
    } else {
      inaccessibleCount += 1;
    }
    if (app?.branding && typeof app.branding === "object") {
      brandingCount += 1;
      if (app.branding.isDiscoverableApp === true) {
        discoverableCount += 1;
      }
      if (firstSafeString(app.branding.developer)) {
        developerCount += 1;
      }
      if (firstSafeString(app.branding.category)) {
        categoryValueCount += 1;
      }
      for (const field of ["privacyPolicy", "termsOfService", "website"]) {
        if (firstSafeString(app.branding[field])) {
          urlFieldCount += 1;
        }
      }
    }
    if (app?.appMetadata && typeof app.appMetadata === "object") {
      metadataCount += 1;
      const categories = Array.isArray(app.appMetadata.categories)
        ? app.appMetadata.categories
        : [];
      const subCategories = Array.isArray(app.appMetadata.subCategories)
        ? app.appMetadata.subCategories
        : [];
      categoryValueCount += categories.length + subCategories.length;
      if (firstSafeString(app.appMetadata.developer)) {
        developerCount += 1;
      }
      if (firstSafeString(app.appMetadata.firstPartyType)) {
        firstPartyTypeValueCount += 1;
      }
      if (firstSafeString(app.appMetadata.review?.status)) {
        reviewStatusValueCount += 1;
      }
      if (Array.isArray(app.appMetadata.screenshots)) {
        screenshotCount += app.appMetadata.screenshots.length;
      }
    }
    if (firstSafeString(app?.distributionChannel)) {
      distributionChannelValueCount += 1;
    }
    if (app?.labels && typeof app.labels === "object" && !Array.isArray(app.labels)) {
      labelKeyCount += Object.keys(app.labels).length;
    }
    for (const field of ["installUrl", "logoUrl", "logoUrlDark"]) {
      if (firstSafeString(app?.[field])) {
        urlFieldCount += 1;
      }
    }

    const rawPluginDisplayNames = Array.isArray(app?.pluginDisplayNames)
      ? app.pluginDisplayNames
      : [];
    pluginDisplayNameCount += rawPluginDisplayNames.length;

    if (includeNames && items.length < DEFAULT_INTEGRATION_ITEM_LIMIT) {
      const safeName = safeIntegrationDisplayName(app?.name);
      if (!safeName && typeof app?.name === "string") {
        nameRedactedCount += 1;
      }
      const pluginDisplayNames = [];
      for (const displayName of rawPluginDisplayNames.slice(0, DEFAULT_INTEGRATION_ITEM_LIMIT)) {
        const safe = safeIntegrationDisplayName(displayName);
        if (safe) {
          pluginDisplayNames.push(safe);
        } else if (typeof displayName === "string") {
          pluginDisplayNameRedactedCount += 1;
        }
      }
      items.push({
        name: safeName,
        enabled: app?.isEnabled !== false,
        accessible: app?.isAccessible === true,
        discoverable: app?.branding?.isDiscoverableApp === true,
        pluginDisplayNameCount: rawPluginDisplayNames.length,
        returnedPluginDisplayNameCount: pluginDisplayNames.length,
        pluginDisplayNames,
      });
    }
  }

  return {
    ok: section.ok,
    appCount: data.length,
    enabledCount,
    disabledCount,
    accessibleCount,
    inaccessibleCount,
    discoverableCount,
    metadataCount,
    brandingCount,
    developerCount,
    categoryValueCount,
    distributionChannelValueCount,
    firstPartyTypeValueCount,
    reviewStatusValueCount,
    labelKeyCount,
    pluginDisplayNameCount,
    screenshotCount,
    urlFieldCount,
    hasNextCursor: typeof section.result?.nextCursor === "string",
    returnedAppCount: items.length,
    items,
    namesReturned: includeNames && items.some((item) => item.name),
    pluginDisplayNamesReturned:
      includeNames && items.some((item) => item.pluginDisplayNames.length > 0),
    nameRedactedCount,
    pluginDisplayNameRedactedCount,
    idsReturned: false,
    descriptionsReturned: false,
    labelsReturned: false,
    logosReturned: false,
    urlsReturned: false,
    screenshotsReturned: false,
  };
}

function summarizeConfigRequirementsInventory(section) {
  const requirements =
    section.ok && section.result?.requirements && typeof section.result.requirements === "object"
      ? section.result.requirements
      : null;
  const featureRequirements =
    requirements?.featureRequirements && typeof requirements.featureRequirements === "object"
      ? requirements.featureRequirements
      : null;
  const hooks = requirements?.hooks && typeof requirements.hooks === "object" ? requirements.hooks : null;
  const network =
    requirements?.network && typeof requirements.network === "object" ? requirements.network : null;
  return {
    ok: section.ok,
    hasRequirements: Boolean(requirements),
    allowedApprovalPolicyCount: Array.isArray(requirements?.allowedApprovalPolicies)
      ? requirements.allowedApprovalPolicies.length
      : 0,
    allowedApprovalsReviewerCount: Array.isArray(requirements?.allowedApprovalsReviewers)
      ? requirements.allowedApprovalsReviewers.length
      : 0,
    allowedSandboxModeCount: Array.isArray(requirements?.allowedSandboxModes)
      ? requirements.allowedSandboxModes.length
      : 0,
    allowedWebSearchModeCount: Array.isArray(requirements?.allowedWebSearchModes)
      ? requirements.allowedWebSearchModes.length
      : 0,
    featureRequirementCount: featureRequirements ? Object.keys(featureRequirements).length : 0,
    hasResidencyRequirement: Boolean(requirements?.enforceResidency),
    hookRequirementGroupCount: countHookRequirementGroups(hooks),
    hookRequirementHandlerCount: countHookRequirementHandlers(hooks),
    networkRequirementKeyCount: network ? Object.keys(network).length : 0,
    valuesReturned: false,
    domainsReturned: false,
    hookCommandsReturned: false,
    pathsReturned: false,
  };
}

function summarizeExperimentalFeaturesInventory(section, { includeNames = false } = {}) {
  const data = section.ok && Array.isArray(section.result?.data) ? section.result.data : [];
  const stageCounts = {};
  let enabledCount = 0;
  let disabledCount = 0;
  let defaultEnabledCount = 0;
  let betaCount = 0;
  let stableCount = 0;
  let deprecatedCount = 0;
  let displayNameCount = 0;
  let descriptionCount = 0;
  let announcementCount = 0;
  let nameRedactedCount = 0;
  const items = [];

  for (const feature of data) {
    const stage = firstSafeString(feature?.stage) ?? "unknown";
    stageCounts[stage] = (stageCounts[stage] ?? 0) + 1;
    if (feature?.enabled === true) {
      enabledCount += 1;
    } else {
      disabledCount += 1;
    }
    if (feature?.defaultEnabled === true) {
      defaultEnabledCount += 1;
    }
    if (stage === "beta") {
      betaCount += 1;
    }
    if (stage === "stable") {
      stableCount += 1;
    }
    if (stage === "deprecated" || stage === "removed") {
      deprecatedCount += 1;
    }
    if (firstSafeString(feature?.displayName)) {
      displayNameCount += 1;
    }
    if (firstSafeString(feature?.description)) {
      descriptionCount += 1;
    }
    if (firstSafeString(feature?.announcement)) {
      announcementCount += 1;
    }
    if (includeNames && items.length < DEFAULT_INTEGRATION_ITEM_LIMIT) {
      const safeName = safeIntegrationDisplayName(feature?.name);
      if (!safeName && typeof feature?.name === "string") {
        nameRedactedCount += 1;
      }
      items.push({
        name: safeName,
        enabled: feature?.enabled === true,
        defaultEnabled: feature?.defaultEnabled === true,
        stage,
      });
    }
  }

  return {
    ok: section.ok,
    featureCount: data.length,
    enabledCount,
    disabledCount,
    defaultEnabledCount,
    betaCount,
    stableCount,
    deprecatedCount,
    stageCounts,
    displayNameCount,
    descriptionCount,
    announcementCount,
    hasNextCursor: typeof section.result?.nextCursor === "string",
    returnedFeatureCount: items.length,
    items,
    namesReturned: includeNames && items.some((item) => item.name),
    nameRedactedCount,
    descriptionsReturned: false,
    announcementsReturned: false,
    rawPayloadReturned: false,
  };
}

function summarizeMcpInventory(section, { includeNames = false } = {}) {
  const data = section.ok && Array.isArray(section.result?.data) ? section.result.data : [];
  const authStatusCounts = {};
  let toolCount = 0;
  let resourceCount = 0;
  let resourceTemplateCount = 0;
  let nameRedactedCount = 0;
  let toolNameRedactedCount = 0;

  for (const server of data) {
    const authStatus = firstSafeString(server?.authStatus) ?? "unknown";
    authStatusCounts[authStatus] = (authStatusCounts[authStatus] ?? 0) + 1;
    if (server?.tools && typeof server.tools === "object" && !Array.isArray(server.tools)) {
      toolCount += Object.keys(server.tools).length;
    }
    if (Array.isArray(server?.resources)) {
      resourceCount += server.resources.length;
    }
    if (Array.isArray(server?.resourceTemplates)) {
      resourceTemplateCount += server.resourceTemplates.length;
    }
  }

  const items = includeNames
    ? data.slice(0, DEFAULT_INTEGRATION_ITEM_LIMIT).map((server) => {
        const rawToolNames =
          server?.tools && typeof server.tools === "object" && !Array.isArray(server.tools)
            ? Object.keys(server.tools)
            : [];
        const toolNames = [];
        for (const name of rawToolNames.slice(0, DEFAULT_INTEGRATION_ITEM_LIMIT)) {
          const safe = safeIntegrationDisplayName(name);
          if (safe) {
            toolNames.push(safe);
          } else {
            toolNameRedactedCount += 1;
          }
        }
        const safeName = safeIntegrationDisplayName(server?.name);
        if (!safeName && typeof server?.name === "string") {
          nameRedactedCount += 1;
        }
        return {
          name: safeName,
          authStatus: firstSafeString(server?.authStatus) ?? "unknown",
          toolCount: rawToolNames.length,
          returnedToolNameCount: toolNames.length,
          toolNames,
          resourceCount: Array.isArray(server?.resources) ? server.resources.length : 0,
          resourceTemplateCount: Array.isArray(server?.resourceTemplates)
            ? server.resourceTemplates.length
            : 0,
        };
      })
    : [];

  return {
    ok: section.ok,
    serverCount: data.length,
    authStatusCounts,
    toolCount,
    resourceCount,
    resourceTemplateCount,
    hasNextCursor: typeof section.result?.nextCursor === "string",
    returnedServerCount: items.length,
    items,
    namesReturned: includeNames && items.some((item) => item.name || item.toolNames.length > 0),
    nameRedactedCount,
    toolNameRedactedCount,
    toolSchemasReturned: false,
  };
}

function summarizeHooksInventory(section) {
  const entries = section.ok && Array.isArray(section.result?.data) ? section.result.data : [];
  const eventCounts = {};
  const handlerTypeCounts = {};
  const sourceCounts = {};
  const trustStatusCounts = {};
  let hookCount = 0;
  let enabledCount = 0;
  let disabledCount = 0;
  let managedCount = 0;
  let errorCount = 0;
  let warningCount = 0;

  for (const entry of entries) {
    const hooks = Array.isArray(entry?.hooks) ? entry.hooks : [];
    const errors = Array.isArray(entry?.errors) ? entry.errors : [];
    const warnings = Array.isArray(entry?.warnings) ? entry.warnings : [];
    errorCount += errors.length;
    warningCount += warnings.length;
    hookCount += hooks.length;
    for (const hook of hooks) {
      if (hook?.enabled === true) {
        enabledCount += 1;
      } else {
        disabledCount += 1;
      }
      if (hook?.isManaged === true) {
        managedCount += 1;
      }
      incrementCount(eventCounts, firstSafeString(hook?.eventName) ?? "unknown");
      incrementCount(handlerTypeCounts, firstSafeString(hook?.handlerType) ?? "unknown");
      incrementCount(sourceCounts, firstSafeString(hook?.source) ?? "unknown");
      incrementCount(trustStatusCounts, firstSafeString(hook?.trustStatus) ?? "unknown");
    }
  }

  return {
    ok: section.ok,
    workspaceCount: entries.length,
    hookCount,
    enabledCount,
    disabledCount,
    managedCount,
    errorCount,
    warningCount,
    eventCounts,
    handlerTypeCounts,
    sourceCounts,
    trustStatusCounts,
    commandsReturned: false,
    pathsReturned: false,
    keysReturned: false,
    matchersReturned: false,
    pluginIdsReturned: false,
  };
}

function summarizeExternalAgentConfigInventory(section) {
  const items = section.ok && Array.isArray(section.result?.items) ? section.result.items : [];
  const itemTypeCounts = {};
  let repoScopedItemCount = 0;
  let homeScopedItemCount = 0;
  let detailItemCount = 0;
  let commandCount = 0;
  let hookCount = 0;
  let mcpServerCount = 0;
  let pluginGroupCount = 0;
  let pluginNameCount = 0;
  let sessionCount = 0;
  let subagentCount = 0;

  for (const item of items) {
    const itemType = safeExternalAgentConfigItemType(item?.itemType);
    itemTypeCounts[itemType] = (itemTypeCounts[itemType] ?? 0) + 1;
    if (firstSafeString(item?.cwd)) {
      repoScopedItemCount += 1;
    } else {
      homeScopedItemCount += 1;
    }
    const details = item?.details && typeof item.details === "object" ? item.details : null;
    if (!details) {
      continue;
    }
    detailItemCount += 1;
    commandCount += Array.isArray(details.commands) ? details.commands.length : 0;
    hookCount += Array.isArray(details.hooks) ? details.hooks.length : 0;
    mcpServerCount += Array.isArray(details.mcpServers) ? details.mcpServers.length : 0;
    const plugins = Array.isArray(details.plugins) ? details.plugins : [];
    pluginGroupCount += plugins.length;
    for (const plugin of plugins) {
      pluginNameCount += Array.isArray(plugin?.pluginNames) ? plugin.pluginNames.length : 0;
    }
    sessionCount += Array.isArray(details.sessions) ? details.sessions.length : 0;
    subagentCount += Array.isArray(details.subagents) ? details.subagents.length : 0;
  }

  return {
    ok: section.ok,
    itemCount: items.length,
    repoScopedItemCount,
    homeScopedItemCount,
    detailItemCount,
    itemTypeCounts,
    commandCount,
    hookCount,
    mcpServerCount,
    pluginGroupCount,
    pluginNameCount,
    sessionCount,
    subagentCount,
    importEnabled: false,
    descriptionsReturned: false,
    cwdReturned: false,
    pathsReturned: false,
    namesReturned: false,
    marketplaceNamesReturned: false,
    pluginNamesReturned: false,
    sessionTitlesReturned: false,
    rawMigrationItemsReturned: false,
  };
}

function summarizeExternalAgentConfigImportHistoriesInventory(section) {
  const histories = section.ok && Array.isArray(section.result?.data) ? section.result.data : [];
  const successItemTypeCounts = {};
  const failureItemTypeCounts = {};
  let successCount = 0;
  let failureCount = 0;
  let completedTimestampCount = 0;
  let importIdCount = 0;
  let cwdCount = 0;
  let sourceCount = 0;
  let targetCount = 0;
  let messageCount = 0;
  let failureStageCount = 0;
  let errorTypeCount = 0;

  for (const history of histories) {
    if (history?.completedAtMs != null) {
      completedTimestampCount += 1;
    }
    if (firstSafeString(history?.importId)) {
      importIdCount += 1;
    }
    const successes = Array.isArray(history?.successes) ? history.successes : [];
    const failures = Array.isArray(history?.failures) ? history.failures : [];
    successCount += successes.length;
    failureCount += failures.length;

    for (const item of successes) {
      incrementCount(successItemTypeCounts, safeExternalAgentConfigItemType(item?.itemType));
      if (firstSafeString(item?.cwd)) {
        cwdCount += 1;
      }
      if (firstSafeString(item?.source)) {
        sourceCount += 1;
      }
      if (firstSafeString(item?.target)) {
        targetCount += 1;
      }
    }

    for (const item of failures) {
      incrementCount(failureItemTypeCounts, safeExternalAgentConfigItemType(item?.itemType));
      if (firstSafeString(item?.cwd)) {
        cwdCount += 1;
      }
      if (firstSafeString(item?.source)) {
        sourceCount += 1;
      }
      if (firstSafeString(item?.message)) {
        messageCount += 1;
      }
      if (firstSafeString(item?.failureStage)) {
        failureStageCount += 1;
      }
      if (firstSafeString(item?.errorType)) {
        errorTypeCount += 1;
      }
    }
  }

  return {
    ok: section.ok,
    historyCount: histories.length,
    successCount,
    failureCount,
    successItemTypeCounts,
    failureItemTypeCounts,
    completedTimestampCount,
    importIdCount,
    cwdCount,
    sourceCount,
    targetCount,
    messageCount,
    failureStageCount,
    errorTypeCount,
    importIdsReturned: false,
    timestampsReturned: false,
    cwdReturned: false,
    sourcesReturned: false,
    targetsReturned: false,
    messagesReturned: false,
    failureStagesReturned: false,
    errorTypesReturned: false,
    rawPayloadReturned: false,
  };
}

function safeExternalAgentConfigItemType(value) {
  const clean = firstSafeString(value);
  return EXTERNAL_AGENT_CONFIG_ITEM_TYPES.has(clean) ? clean : "unknown";
}

function safeReasoningEffort(value, fallback = "unknown") {
  const clean = firstSafeString(value);
  return REASONING_EFFORTS.has(clean) ? clean : fallback;
}

function safeCollaborationModeKind(value) {
  const clean = firstSafeString(value);
  return COLLABORATION_MODE_KINDS.has(clean) ? clean : "unknown";
}

function safeWorkspaceMessageType(value) {
  const clean = firstSafeString(value);
  return WORKSPACE_MESSAGE_TYPES.has(clean) ? clean : "unknown";
}

function safeRemoteControlStatus(value) {
  const clean = firstSafeString(value);
  return REMOTE_CONTROL_STATUSES.has(clean) ? clean : "unknown";
}

function summarizeSkillsInventory(section, { includeNames = false } = {}) {
  const entries = section.ok && Array.isArray(section.result?.data) ? section.result.data : [];
  const scopeCounts = {};
  let skillCount = 0;
  let enabledCount = 0;
  let disabledCount = 0;
  let errorCount = 0;
  let dependencyToolCount = 0;
  let nameRedactedCount = 0;
  const items = [];

  for (const entry of entries) {
    const skills = Array.isArray(entry?.skills) ? entry.skills : [];
    const errors = Array.isArray(entry?.errors) ? entry.errors : [];
    errorCount += errors.length;
    skillCount += skills.length;
    for (const skill of skills) {
      if (skill?.enabled === true) {
        enabledCount += 1;
      } else {
        disabledCount += 1;
      }
      const scope = firstSafeString(skill?.scope) ?? "unknown";
      scopeCounts[scope] = (scopeCounts[scope] ?? 0) + 1;
      if (Array.isArray(skill?.dependencies?.tools)) {
        dependencyToolCount += skill.dependencies.tools.length;
      }
      if (includeNames && items.length < DEFAULT_INTEGRATION_ITEM_LIMIT) {
        const safeName = safeIntegrationDisplayName(skill?.name);
        if (!safeName && typeof skill?.name === "string") {
          nameRedactedCount += 1;
        }
        items.push({
          name: safeName,
          enabled: skill?.enabled === true,
          scope,
          dependencyToolCount: Array.isArray(skill?.dependencies?.tools)
            ? skill.dependencies.tools.length
            : 0,
        });
      }
    }
  }

  return {
    ok: section.ok,
    workspaceCount: entries.length,
    skillCount,
    enabledCount,
    disabledCount,
    errorCount,
    dependencyToolCount,
    scopeCounts,
    returnedSkillCount: items.length,
    items,
    namesReturned: includeNames && items.some((item) => item.name),
    nameRedactedCount,
    pathsReturned: false,
    descriptionsReturned: false,
  };
}

function summarizePluginsInventory(section, { includeNames = false } = {}) {
  const marketplaces =
    section.ok && Array.isArray(section.result?.marketplaces) ? section.result.marketplaces : [];
  const marketplaceErrors = Array.isArray(section.result?.marketplaceLoadErrors)
    ? section.result.marketplaceLoadErrors
    : [];
  const featuredPluginIds = Array.isArray(section.result?.featuredPluginIds)
    ? section.result.featuredPluginIds
    : [];
  const sourceTypeCounts = {};
  const installPolicyCounts = {};
  let pluginCount = 0;
  let installedCount = 0;
  let enabledCount = 0;
  let nameRedactedCount = 0;
  const items = [];

  for (const marketplace of marketplaces) {
    const plugins = Array.isArray(marketplace?.plugins) ? marketplace.plugins : [];
    pluginCount += plugins.length;
    for (const plugin of plugins) {
      if (plugin?.installed === true) {
        installedCount += 1;
      }
      if (plugin?.enabled === true) {
        enabledCount += 1;
      }
      const sourceType = firstSafeString(plugin?.source?.type) ?? "unknown";
      sourceTypeCounts[sourceType] = (sourceTypeCounts[sourceType] ?? 0) + 1;
      const installPolicy = firstSafeString(plugin?.installPolicy) ?? "unknown";
      installPolicyCounts[installPolicy] = (installPolicyCounts[installPolicy] ?? 0) + 1;
      if (includeNames && items.length < DEFAULT_INTEGRATION_ITEM_LIMIT) {
        const safeName = safeIntegrationDisplayName(plugin?.name);
        if (!safeName && typeof plugin?.name === "string") {
          nameRedactedCount += 1;
        }
        items.push({
          name: safeName,
          installed: plugin?.installed === true,
          enabled: plugin?.enabled === true,
          sourceType,
          installPolicy,
        });
      }
    }
  }

  return {
    ok: section.ok,
    marketplaceCount: marketplaces.length,
    pluginCount,
    installedCount,
    enabledCount,
    loadErrorCount: marketplaceErrors.length,
    featuredCount: featuredPluginIds.length,
    sourceTypeCounts,
    installPolicyCounts,
    returnedPluginCount: items.length,
    items,
    namesReturned: includeNames && items.some((item) => item.name),
    nameRedactedCount,
    idsReturned: false,
    pathsReturned: false,
    urlsReturned: false,
  };
}

function summarizeInstalledPluginsInventory(section) {
  const summary = summarizePluginsInventory(section, { includeNames: false });
  return {
    ...summary,
    installSuggestionNamesReturned: false,
    marketplaceNamesReturned: false,
    descriptionsReturned: false,
    defaultPromptsReturned: false,
    capabilityNamesReturned: false,
    screenshotsReturned: false,
    rawPayloadReturned: false,
  };
}

function countHookRequirementGroups(hooks) {
  if (!hooks || typeof hooks !== "object") {
    return 0;
  }
  let count = 0;
  for (const value of Object.values(hooks)) {
    if (Array.isArray(value)) {
      count += value.length;
    }
  }
  return count;
}

function countHookRequirementHandlers(hooks) {
  if (!hooks || typeof hooks !== "object") {
    return 0;
  }
  let count = 0;
  for (const group of Object.values(hooks)) {
    if (!Array.isArray(group)) {
      continue;
    }
    for (const matcherGroup of group) {
      if (Array.isArray(matcherGroup?.hooks)) {
        count += matcherGroup.hooks.length;
      }
    }
  }
  return count;
}

function incrementCount(counts, key) {
  counts[key] = (counts[key] ?? 0) + 1;
}

function selectThreadBySuffix(threads, threadIdSuffix) {
  const matches = (Array.isArray(threads) ? threads : []).filter(
    (thread) => suffix(thread?.id) === threadIdSuffix,
  );
  if (matches.length === 0) {
    throwRequestError("Thread not found in local thread metadata", 404);
  }
  if (matches.length > 1) {
    throwRequestError("Thread id suffix is ambiguous", 409);
  }
  return matches[0];
}

function selectLoadedThreadIdBySuffix(loadedSessions, threadIdSuffix) {
  const matches = (Array.isArray(loadedSessions?.data) ? loadedSessions.data : []).filter(
    (id) => typeof id === "string" && suffix(id) === threadIdSuffix,
  );
  if (matches.length === 0) {
    throwRequestError("Thread not found in loaded session inventory", 404);
  }
  if (matches.length > 1) {
    throwRequestError("Loaded thread id suffix is ambiguous", 409);
  }
  return matches[0];
}

function selectTurnIdBySuffix(turns, turnIdSuffix) {
  const matches = (Array.isArray(turns) ? turns : []).filter(
    (turn) => suffix(turn?.id) === turnIdSuffix,
  );
  if (matches.length === 0) {
    throwRequestError("Turn not found in loaded thread metadata", 404);
  }
  if (matches.length > 1) {
    throwRequestError("Turn id suffix is ambiguous", 409);
  }
  return matches[0].id;
}

async function validateFsDirectoryTarget(value, workspacePath) {
  if (typeof workspacePath !== "string" || workspacePath.length === 0) {
    throwRequestError("Workspace is required for directory reads", 400);
  }
  const clean = typeof value === "string" ? value.trim().replace(/\\/g, "/") : "";
  if (clean.length > DEFAULT_FS_DIRECTORY_PATH_LIMIT) {
    throwRequestError(
      `Directory path must be ${DEFAULT_FS_DIRECTORY_PATH_LIMIT} characters or fewer`,
      400,
    );
  }
  if (
    clean.startsWith("/") ||
    /^[A-Za-z]:\//.test(clean) ||
    clean.includes("\0") ||
    clean.includes("//") ||
    clean.includes("..")
  ) {
    throwRequestError("Directory path is invalid", 400);
  }
  const parts = clean.length === 0 || clean === "." ? [] : clean.split("/").filter(Boolean);
  if (
    parts.some(
      (part) =>
        part === "." ||
        part.startsWith(".") ||
        part === ".git" ||
        part.startsWith(".git") ||
        part.endsWith(".lock"),
    )
  ) {
    throwRequestError("Directory path is invalid", 400);
  }
  const workspaceRoot = resolve(workspacePath);
  const absolutePath = resolve(workspaceRoot, ...parts);
  const relativePath = relative(workspaceRoot, absolutePath);
  if (relativePath.startsWith("..") || relativePath.includes(`..${sep}`)) {
    throwRequestError("Directory path is invalid", 400);
  }
  await ensureFsDirectoryNoSymlink(workspaceRoot);
  let current = workspaceRoot;
  for (const part of parts) {
    current = resolve(current, part);
    await ensureFsDirectoryNoSymlink(current);
  }
  return {
    absolutePath,
    relativePath,
    parts,
    basename: parts.length > 0 ? cleanDisplayText(pathBasename(absolutePath), 80) : null,
    depth: parts.length,
    isWorkspaceRoot: parts.length === 0,
  };
}

async function ensureFsDirectoryNoSymlink(path) {
  let info;
  try {
    info = await lstat(path);
  } catch (error) {
    if (error.code === "ENOENT") {
      throwRequestError("Directory path does not exist", 404);
    }
    throwRequestError("Directory path is not safely readable", 409);
  }
  if (info.isSymbolicLink() || !info.isDirectory()) {
    throwRequestError("Directory path is not a safe directory", 409);
  }
}

function liveSessionControlMethod(action) {
  switch (action) {
    case "interrupt":
      return "turn/interrupt";
    case "unsubscribe":
      return "thread/unsubscribe";
    case "steer":
      return "turn/steer";
    default:
      return "unknown";
  }
}

function validateThreadArchiveAction(value) {
  if (value === "archive" || value === "unarchive") {
    return value;
  }
  throwRequestError("Thread archive action is unsupported", 400);
}

function validateSteerPrompt(value) {
  if (typeof value !== "string") {
    throwRequestError("Steer prompt must be a string", 400);
  }
  if (value.trim().length === 0) {
    throwRequestError("Steer prompt is required", 400);
  }
  if (value.length > DEFAULT_STEER_PROMPT_LIMIT) {
    throwRequestError(`Steer prompt must be ${DEFAULT_STEER_PROMPT_LIMIT} characters or fewer`, 400);
  }
  return value;
}

function validateThreadSearchTerm(value) {
  if (typeof value !== "string") {
    throwRequestError("Thread search term must be a string", 400);
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throwRequestError("Thread search term is required", 400);
  }
  if (value.includes("\0")) {
    throwRequestError("Thread search term contains unsupported text", 400);
  }
  if (value.length > DEFAULT_THREAD_SEARCH_TERM_LIMIT) {
    throwRequestError(
      `Thread search term must be ${DEFAULT_THREAD_SEARCH_TERM_LIMIT} characters or fewer`,
      400,
    );
  }
  return value;
}

function validateThreadRenameName(value) {
  if (typeof value !== "string") {
    throwRequestError("Thread name must be a string", 400);
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throwRequestError("Thread name is required", 400);
  }
  if (value.includes("\0")) {
    throwRequestError("Thread name contains unsupported text", 400);
  }
  if (value.length > DEFAULT_THREAD_RENAME_LIMIT) {
    throwRequestError(`Thread name must be ${DEFAULT_THREAD_RENAME_LIMIT} characters or fewer`, 400);
  }
  return trimmed;
}

function validateThreadGoalObjective(value) {
  if (typeof value !== "string") {
    throwRequestError("Thread goal objective must be a string", 400);
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throwRequestError("Thread goal objective is required", 400);
  }
  if (value.includes("\0")) {
    throwRequestError("Thread goal objective contains unsupported text", 400);
  }
  if (value.length > DEFAULT_THREAD_GOAL_OBJECTIVE_LIMIT) {
    throwRequestError(
      `Thread goal objective must be ${DEFAULT_THREAD_GOAL_OBJECTIVE_LIMIT} characters or fewer`,
      400,
    );
  }
  return trimmed;
}

function validateThreadGoalStatus(value) {
  const status = value === null || value === undefined || value === "" ? "active" : String(value);
  if (!THREAD_GOAL_STATUSES.has(status)) {
    throwRequestError("Thread goal status is unsupported", 400);
  }
  return status;
}

function validateThreadGoalTokenBudget(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const number = Number(value);
  if (
    !Number.isSafeInteger(number) ||
    number < 0 ||
    number > DEFAULT_THREAD_GOAL_TOKEN_BUDGET_LIMIT
  ) {
    throwRequestError(
      `Thread goal token budget must be an integer between 0 and ${DEFAULT_THREAD_GOAL_TOKEN_BUDGET_LIMIT}`,
      400,
    );
  }
  return number;
}

function validateThreadMemoryMode(value) {
  const mode = String(value ?? "").trim();
  if (!THREAD_MEMORY_MODES.has(mode)) {
    throwRequestError("Thread memory mode must be enabled or disabled", 400);
  }
  return mode;
}

function validateThreadRollbackTurns(value) {
  const number = Number(value);
  if (
    !Number.isSafeInteger(number) ||
    number < 1 ||
    number > DEFAULT_THREAD_ROLLBACK_MAX_TURNS
  ) {
    throwRequestError(
      `Thread rollback turns must be an integer between 1 and ${DEFAULT_THREAD_ROLLBACK_MAX_TURNS}`,
      400,
    );
  }
  return number;
}

function validateThreadSearchLimit(value) {
  const number = Number(value ?? DEFAULT_THREAD_SEARCH_LIMIT);
  if (!Number.isSafeInteger(number) || number < 1 || number > DEFAULT_THREAD_SEARCH_LIMIT) {
    return DEFAULT_THREAD_SEARCH_LIMIT;
  }
  return number;
}

async function selectThreadBySuffixFromLists(client, { threadIdSuffix, threadScanLimit }) {
  const activeThreads = await requestThreadList(client, {
    limit: threadScanLimit,
    archived: false,
  });
  let archivedThreads = { data: [] };
  try {
    archivedThreads = await requestThreadList(client, {
      limit: threadScanLimit,
      archived: true,
    });
  } catch {
    archivedThreads = { data: [] };
  }
  return selectThreadBySuffix([...activeThreads.data, ...archivedThreads.data], threadIdSuffix);
}

async function requestThreadList(client, { limit, archived }) {
  return normalizeThreadListResponse(
    await client.request("thread/list", {
      limit,
      archived,
      useStateDbOnly: true,
    }),
  );
}

function basename(value) {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }
  const parts = value.split(/[\\/]/).filter(Boolean);
  return parts.at(-1) ?? "/";
}

function countLines(value) {
  if (typeof value !== "string" || value.length === 0) {
    return 0;
  }
  return value.split(/\r\n|\r|\n/).length;
}

function suffix(value) {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }
  return value.slice(-8);
}

function isValidSuffix(value) {
  return typeof value === "string" && /^[A-Za-z0-9_-]{8}$/.test(value);
}

function textLength(item) {
  if (typeof item?.text === "string") {
    return item.text.length;
  }
  if (typeof item?.content === "string") {
    return item.content.length;
  }
  return 0;
}

function contentTypes(item) {
  const collections = [item?.contentItems, item?.content].filter(Array.isArray);
  const types = new Set();
  for (const collection of collections) {
    for (const entry of collection) {
      if (entry && typeof entry.type === "string") {
        types.add(entry.type);
      }
    }
  }
  return [...types].sort();
}

function isFileChangeItem(item) {
  return item?.type === "fileChange" || Array.isArray(item?.changes);
}

function summarizeChangeItem(item, { changeLimit, diffLineLimit, diffTextLimit }) {
  const changes = Array.isArray(item?.changes) ? item.changes : [];
  const returnedChanges = changes
    .slice(0, changeLimit)
    .map((change, index) =>
      summarizeFileChange(change, index, {
        diffLineLimit,
        diffTextLimit,
      }),
    );

  return {
    idSuffix: suffix(item?.id),
    type: typeof item?.type === "string" ? item.type : "fileChange",
    status: statusLabel(item?.status),
    phase: typeof item?.phase === "string" ? item.phase : null,
    changeCount: changes.length,
    returnedChangeCount: returnedChanges.length,
    unsafeFieldsOmitted: hasUnsafeFields(item),
    changes: returnedChanges,
  };
}

function summarizeFileChange(change, index, { diffLineLimit, diffTextLimit }) {
  const fileBasename = basenameFromFields(change, CHANGE_PATH_FIELDS);
  const fromBasename = basenameFromFields(change, CHANGE_OLD_PATH_FIELDS);
  const toBasename = basenameFromFields(change, CHANGE_NEW_PATH_FIELDS);
  return {
    index,
    kind: firstSafeString(change?.kind, change?.type, change?.operation),
    fileBasename: fileBasename ?? toBasename ?? fromBasename,
    fromBasename,
    toBasename,
    hasFileReference: Boolean(fileBasename ?? fromBasename ?? toBasename),
    additions: firstSafeCount(
      change?.additions,
      change?.addedLines,
      change?.linesAdded,
      change?.insertions,
    ),
    deletions: firstSafeCount(
      change?.deletions,
      change?.deletedLines,
      change?.linesDeleted,
      change?.removals,
    ),
    diffPreview: summarizeDiffPreview(change, {
      diffLineLimit,
      diffTextLimit,
    }),
    unsafeFieldsOmitted: hasUnsafeFields(change),
  };
}

function summarizeDiffPreview(change, { diffLineLimit, diffTextLimit }) {
  const rawDiff = firstRawDiffText(change);
  if (!rawDiff) {
    return null;
  }

  const lines = cleanDiffText(rawDiff).split("\n");
  const lineLimit = Math.max(0, Math.min(firstSafeCount(diffLineLimit), DEFAULT_CHANGE_DIFF_LINE_LIMIT));
  const textLimit = Math.max(0, Math.min(firstSafeCount(diffTextLimit), DEFAULT_CHANGE_DIFF_TEXT_LIMIT));
  const limitedLines = lines.slice(0, lineLimit);
  let text = limitedLines.join("\n").trim();
  let truncated = lines.length > limitedLines.length;

  if (text.length > textLimit) {
    text = text.slice(0, textLimit).trimEnd();
    truncated = true;
  }

  if (!text) {
    return null;
  }

  return {
    text,
    textCharCount: text.length,
    lineCount: lines.length,
    returnedLineCount: limitedLines.length,
    truncated,
  };
}

function firstRawDiffText(change) {
  for (const field of ["diff", "unifiedDiff", "unified_diff", "patch"]) {
    if (typeof change?.[field] === "string" && change[field].length > 0) {
      return change[field];
    }
  }
  return "";
}

function cleanDiffText(value) {
  return String(value)
    .replace(/\r\n|\r/g, "\n")
    .replace(/\0/g, "")
    .split("\n")
    .map(cleanDiffLine)
    .join("\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

function cleanDiffLine(value) {
  const ascii = value.replace(/[^\x09\x20-\x7E]/g, " ");
  return redactSensitiveDiffText(redactPathLikeText(simplifyDiffHeaderLine(ascii))).slice(0, 1_000);
}

function simplifyDiffHeaderLine(line) {
  let match = line.match(/^(diff --git)\s+(\S+)\s+(\S+)$/);
  if (match) {
    return `${match[1]} ${simplifyDiffPathToken(match[2])} ${simplifyDiffPathToken(match[3])}`;
  }

  match = line.match(/^(---|\+\+\+)\s+(\S+)(.*)$/);
  if (match) {
    return `${match[1]} ${simplifyDiffPathToken(match[2])}${match[3]}`;
  }

  match = line.match(/^(rename from|rename to|copy from|copy to)\s+(.+)$/);
  if (match) {
    return `${match[1]} ${simplifyDiffPathToken(match[2].trim())}`;
  }

  return line;
}

function simplifyDiffPathToken(token) {
  if (token === "/dev/null") {
    return token;
  }

  let prefix = "";
  let path = token.replace(/^["']|["']$/g, "");
  if (/^[ab]\//.test(path)) {
    prefix = path.slice(0, 2);
    path = path.slice(2);
  }
  if (path.startsWith("/") || path.startsWith("~/") || /^[A-Za-z]:\\/.test(path)) {
    return `${prefix}[path]`;
  }

  return `${prefix}${basename(path) ?? "[path]"}`;
}

function redactPathLikeText(value) {
  return value
    .replace(/~\/[^\s"'`<>]+/g, "[path]")
    .replace(/(?:\/[A-Za-z0-9._@+-]+){2,}/g, "[path]")
    .replace(/[A-Za-z]:\\[^\s"'`<>]+/g, "[path]");
}

function redactSensitiveDiffText(value) {
  return value
    .replace(/\bsk(?:-proj)?-[A-Za-z0-9_-]{8,}\b/g, "[secret]")
    .replace(/\bgh[opsu]_[A-Za-z0-9_]{8,}\b/g, "[secret]")
    .replace(/\bAKIA[0-9A-Z]{16}\b/g, "[secret]")
    .replace(
      /\b(password|token|api[_-]?key|secret)(\s*[:=]\s*)(["']?)[^\s"'`]+/gi,
      "$1$2$3[secret]",
    )
    .replace(/\bSensitive\b/g, "[redacted]");
}

function basenameFromFields(object, fields) {
  for (const field of fields) {
    const value = object?.[field];
    if (typeof value === "string" && value.length > 0) {
      return basename(value);
    }
  }
  return null;
}

function firstSafeString(...values) {
  for (const value of values) {
    if (typeof value !== "string") {
      continue;
    }
    const clean = value.replace(/[^\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim();
    if (clean.length > 0) {
      return clean.slice(0, 80);
    }
  }
  return null;
}

function safeIntegrationDisplayName(value) {
  const clean = firstSafeString(value);
  if (!clean) {
    return null;
  }
  if (
    /[\\/]/.test(clean) ||
    /:\/\/|www\./i.test(clean) ||
    /\.\./.test(clean) ||
    /^\.{1,2}$/.test(clean) ||
    /\b(?:sk-[A-Za-z0-9_-]{8,}|gh[pousr]_[A-Za-z0-9_]{8,}|xox[baprs]-[A-Za-z0-9-]{8,})\b/.test(clean)
  ) {
    return null;
  }
  return clean.slice(0, DEFAULT_INTEGRATION_NAME_LIMIT);
}

function firstSafeCount(...values) {
  for (const value of values) {
    if (Number.isSafeInteger(value) && value >= 0) {
      return value;
    }
  }
  return 0;
}

function hasUnsafeFields(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  return (
    value.unsafeFieldsPresent === true ||
    Object.keys(value).some((key) => RAW_CHANGE_FIELD_NAMES.has(key))
  );
}

function extractTranscriptText(item) {
  if (typeof item?.text === "string") {
    return item.text;
  }
  if (typeof item?.content === "string") {
    return item.content;
  }

  const chunks = [];
  for (const collection of [item?.contentItems, item?.content].filter(Array.isArray)) {
    for (const entry of collection) {
      if (typeof entry?.text === "string") {
        chunks.push(entry.text);
      }
    }
  }
  return chunks.join("\n");
}

function cleanTranscriptText(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value
    .replace(/\r\n|\r/g, "\n")
    .replace(/[^\x09\x0A\x20-\x7E]/g, " ")
    .replace(/~\/[^\s"'`<>]+/g, "[path]")
    .replace(/(?:\/[A-Za-z0-9._@-]+){2,}/g, "[path]")
    .replace(/[A-Za-z]:\\[^\s"'`<>]+/g, "[path]")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

function summarizeLiveTextDelta(notification) {
  const method = typeof notification?.method === "string" ? notification.method : "";
  const params = notification?.params && typeof notification.params === "object" ? notification.params : {};
  if (method !== "item/agentMessage/delta" && method !== "thread/realtime/transcript/delta") {
    return null;
  }
  if (method === "thread/realtime/transcript/delta" && params.role !== "assistant") {
    return null;
  }
  if (typeof params.delta !== "string" || params.delta.length === 0) {
    return null;
  }

  const clean = cleanStreamDeltaText(params.delta);
  if (!clean) {
    return null;
  }
  const text = clean.slice(0, DEFAULT_STREAM_DELTA_TEXT_LIMIT);
  return {
    role: method === "thread/realtime/transcript/delta" ? "assistant" : "agent",
    text,
    textCharCount: text.length,
    truncated: clean.length > text.length,
  };
}

function terminalTextSummary(value) {
  if (typeof value !== "string" || value.length === 0) {
    return {
      present: false,
      charCount: 0,
      lineCount: 0,
      textReturned: false,
    };
  }
  return {
    present: true,
    charCount: value.length,
    lineCount: value.split(/\r\n|\r|\n/).length,
    textReturned: false,
  };
}

function terminalBase64Summary(value) {
  if (typeof value !== "string" || value.length === 0) {
    return {
      present: false,
      encodedCharCount: 0,
      estimatedByteCount: 0,
      textReturned: false,
    };
  }
  return {
    present: true,
    encodedCharCount: value.length,
    estimatedByteCount: estimateBase64ByteLength(value),
    textReturned: false,
  };
}

function terminalIdentifierSummary(value) {
  if (typeof value !== "string" || value.length === 0) {
    return {
      present: false,
      charCount: 0,
      valueReturned: false,
      suffixReturned: false,
    };
  }
  return {
    present: true,
    charCount: value.length,
    valueReturned: false,
    suffixReturned: false,
  };
}

function safeTerminalStream(value) {
  return value === "stdout" || value === "stderr" ? value : "unknown";
}

function estimateBase64ByteLength(value) {
  const clean = value.replace(/\s+/g, "");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean) || clean.length === 0) {
    return 0;
  }
  const padding = clean.endsWith("==") ? 2 : clean.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((clean.length * 3) / 4) - padding);
}

function cleanStreamDeltaText(value) {
  return cleanTranscriptText(value)
    .replace(/\bsk(?:-proj)?-[A-Za-z0-9_-]{8,}\b/g, "[secret]")
    .replace(/\bgh[opsu]_[A-Za-z0-9_]{8,}\b/g, "[secret]")
    .replace(/\bAKIA[0-9A-Z]{16}\b/g, "[secret]")
    .replace(
      /\b(password|token|api[_-]?key|secret)(\s*[:=]\s*)(["']?)[^\s"'`]+/gi,
      "$1$2$3[secret]",
    )
    .replace(/\bSensitive\b/g, "[redacted]");
}

function sanitizeRateLimitResetCreditOutcome(value) {
  return ["reset", "nothingToReset", "noCredit", "alreadyRedeemed"].includes(value)
    ? value
    : "unknown";
}

function throwRequestError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
}

function statusFromParams(params) {
  const status = params.status ?? params.turn?.status ?? params.thread?.status;
  return statusLabel(status);
}

function notificationTurnId(notification) {
  const params = notification?.params && typeof notification.params === "object" ? notification.params : {};
  return typeof params.turnId === "string"
    ? params.turnId
    : typeof params.turn_id === "string"
      ? params.turn_id
      : typeof params.turn?.id === "string"
        ? params.turn.id
        : null;
}

function statusLabel(status) {
  if (typeof status === "string") {
    return status;
  }
  if (status && typeof status.type === "string") {
    return status.type;
  }
  return null;
}

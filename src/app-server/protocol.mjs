export const APP_SERVER_METHODS = Object.freeze({
  initialize: "initialize",
  initialized: "initialized",
  accountUsageRead: "account/usage/read",
  accountWorkspaceMessagesRead: "account/workspaceMessages/read",
  accountLoginStart: "account/login/start",
  accountLoginCancel: "account/login/cancel",
  accountLogout: "account/logout",
  accountRateLimitResetCreditConsume: "account/rateLimitResetCredit/consume",
  accountSendAddCreditsNudgeEmail: "account/sendAddCreditsNudgeEmail",
  configRead: "config/read",
  modelList: "model/list",
  modelProviderCapabilitiesRead: "modelProvider/capabilities/read",
  collaborationModeList: "collaborationMode/list",
  permissionProfileList: "permissionProfile/list",
  threadList: "thread/list",
  threadSearch: "thread/search",
  threadRead: "thread/read",
  threadArchive: "thread/archive",
  threadUnarchive: "thread/unarchive",
  threadDelete: "thread/delete",
  threadSetName: "thread/name/set",
  threadFork: "thread/fork",
  threadRollback: "thread/rollback",
  threadSettingsUpdate: "thread/settings/update",
  threadStart: "thread/start",
  threadCompactStart: "thread/compact/start",
  threadLoadedList: "thread/loaded/list",
  threadUnsubscribe: "thread/unsubscribe",
  threadBackgroundTerminalsClean: "thread/backgroundTerminals/clean",
  threadBackgroundTerminalsList: "thread/backgroundTerminals/list",
  threadBackgroundTerminalsTerminate: "thread/backgroundTerminals/terminate",
  threadShellCommand: "thread/shellCommand",
  commandExec: "command/exec",
  commandExecWrite: "command/exec/write",
  commandExecResize: "command/exec/resize",
  commandExecTerminate: "command/exec/terminate",
  processSpawn: "process/spawn",
  processWriteStdin: "process/writeStdin",
  processResizePty: "process/resizePty",
  processKill: "process/kill",
  configValueWrite: "config/value/write",
  configBatchWrite: "config/batchWrite",
  experimentalFeatureList: "experimentalFeature/list",
  experimentalFeatureEnablementSet: "experimentalFeature/enablement/set",
  environmentAdd: "environment/add",
  externalAgentConfigImportReadHistories: "externalAgentConfig/import/readHistories",
  configMcpServerReload: "config/mcpServer/reload",
  mcpServerOauthLogin: "mcpServer/oauth/login",
  mcpToolCall: "mcpServer/tool/call",
  mcpResourceRead: "mcpServer/resource/read",
  pluginInstalled: "plugin/installed",
  pluginRead: "plugin/read",
  pluginShareCheckout: "plugin/share/checkout",
  pluginShareList: "plugin/share/list",
  pluginSkillRead: "plugin/skill/read",
  pluginUninstall: "plugin/uninstall",
  remoteControlClientList: "remoteControl/client/list",
  remoteControlClientRevoke: "remoteControl/client/revoke",
  remoteControlDisable: "remoteControl/disable",
  remoteControlStatusRead: "remoteControl/status/read",
  skillsConfigWrite: "skills/config/write",
  skillsExtraRootsSet: "skills/extraRoots/set",
  turnStart: "turn/start",
  turnInterrupt: "turn/interrupt",
  turnSteer: "turn/steer",
});

const MAX_THREAD_TURNS = 500;
const MAX_TURN_ITEMS = 500;
const MAX_ITEM_CONTENT_ENTRIES = 200;
const MAX_ITEM_CHANGES = 1_000;
const RAW_FILE_CHANGE_FIELDS = new Set([
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

export function normalizeInitializeResponse(value) {
  const object = objectOrEmpty(value);
  return {
    platformFamily: stringOrNull(object.platformFamily),
    platformOs: stringOrNull(object.platformOs),
  };
}

export function normalizeConfigReadResponse(value) {
  const object = objectOrEmpty(value);
  const config = objectOrEmpty(object.config);
  return {
    config: {
      model: stringOrNull(config.model),
      model_provider: stringOrNull(config.model_provider),
      approval_policy: stringOrNull(config.approval_policy),
      sandbox_mode: stringOrNull(config.sandbox_mode),
      profile: stringOrNull(config.profile),
      profiles: plainObjectOrEmpty(config.profiles),
    },
    origins: plainObjectOrEmpty(object.origins),
    layers: Array.isArray(object.layers) ? [] : null,
  };
}

export function normalizeThreadListResponse(value) {
  const object = objectOrEmpty(value);
  const data = Array.isArray(object.data) ? object.data : [];
  return {
    data: data.map(normalizeThreadSummary).filter((thread) => thread.id),
    nextCursor: stringOrNull(object.nextCursor),
    backwardsCursor: stringOrNull(object.backwardsCursor),
  };
}

export function normalizeThreadSearchResponse(value) {
  const object = objectOrEmpty(value);
  const data = Array.isArray(object.data) ? object.data : [];
  return {
    data: data.map(normalizeThreadSearchResult).filter((result) => result.thread.id),
    nextCursor: stringOrNull(object.nextCursor),
    backwardsCursor: stringOrNull(object.backwardsCursor),
  };
}

function normalizeThreadSearchResult(value) {
  const object = objectOrEmpty(value);
  return {
    snippet: stringOrNull(object.snippet),
    thread: normalizeThreadSummary(object.thread),
  };
}

export function normalizeThreadReadResponse(value) {
  return {
    thread: normalizeThread(objectOrEmpty(value).thread),
  };
}

export function normalizeThreadStartResponse(value) {
  return {
    thread: normalizeThreadSummary(objectOrEmpty(value).thread),
  };
}

export function normalizeTurnStartResponse(value) {
  return {
    turn: normalizeTurn(objectOrEmpty(value).turn),
  };
}

export function normalizeNotification(value) {
  const object = objectOrEmpty(value);
  const params = objectOrEmpty(object.params);
  return {
    method: stringOrNull(object.method) ?? "unknown",
    params: {
      threadId: stringOrNull(params.threadId),
      thread_id: stringOrNull(params.thread_id),
      turnId: stringOrNull(params.turnId),
      turn_id: stringOrNull(params.turn_id),
      status: normalizeStatus(params.status),
      thread: normalizeNotificationThread(params.thread),
      turn: normalizeNotificationTurn(params.turn),
      item: normalizeNotificationItem(params.item),
    },
  };
}

export function normalizeThread(value) {
  const thread = normalizeThreadSummary(value);
  const turns = Array.isArray(value?.turns) ? value.turns : [];
  return {
    ...thread,
    turns: turns.slice(-MAX_THREAD_TURNS).map(normalizeTurn),
  };
}

export function normalizeThreadSummary(value) {
  const object = objectOrEmpty(value);
  return {
    id: stringOrNull(object.id),
    name: stringOrNull(object.name),
    preview: stringOrNull(object.preview),
    ephemeral: Boolean(object.ephemeral),
    modelProvider: stringOrNull(object.modelProvider),
    createdAt: numberOrNull(object.createdAt),
    updatedAt: numberOrNull(object.updatedAt),
    status: normalizeStatus(object.status),
    cwd: stringOrNull(object.cwd),
    source: stringOrNull(object.source),
    threadSource: stringOrNull(object.threadSource),
    gitInfo: object.gitInfo && typeof object.gitInfo === "object" ? {} : null,
  };
}

export function normalizeTurn(value) {
  const object = objectOrEmpty(value);
  const items = Array.isArray(object.items) ? object.items : [];
  return {
    id: stringOrNull(object.id),
    status: normalizeStatus(object.status),
    itemsView: stringOrNull(object.itemsView),
    startedAt: numberOrNull(object.startedAt),
    completedAt: numberOrNull(object.completedAt),
    durationMs: numberOrNull(object.durationMs),
    items: items.slice(-MAX_TURN_ITEMS).map(normalizeThreadItem),
  };
}

export function normalizeThreadItem(value) {
  const object = objectOrEmpty(value);
  const type = stringOrNull(object.type) ?? "unknown";
  const isMessage = type === "agentMessage" || type === "userMessage";
  const item = {
    id: stringOrNull(object.id),
    type,
    status: normalizeStatus(object.status),
    phase: stringOrNull(object.phase),
    unsafeFieldsPresent: hasRawFileChangeFields(object),
  };

  if (isMessage) {
    if (typeof object.text === "string") {
      item.text = object.text;
    }
    const content = normalizeContent(object.content);
    if (content !== undefined) {
      item.content = content;
    }
    const contentItems = normalizeContentArray(object.contentItems);
    if (contentItems.length > 0) {
      item.contentItems = contentItems;
    }
  }

  if (Array.isArray(object.changes)) {
    item.changes = object.changes.slice(0, MAX_ITEM_CHANGES).map(normalizeFileChange);
  }

  return item;
}

export function normalizeFileChange(value) {
  const object = objectOrEmpty(value);
  return {
    path: stringOrNull(object.path),
    file: stringOrNull(object.file),
    filePath: stringOrNull(object.filePath),
    relativePath: stringOrNull(object.relativePath),
    targetPath: stringOrNull(object.targetPath),
    sourcePath: stringOrNull(object.sourcePath),
    oldPath: stringOrNull(object.oldPath),
    previousPath: stringOrNull(object.previousPath),
    fromPath: stringOrNull(object.fromPath),
    from: stringOrNull(object.from),
    newPath: stringOrNull(object.newPath),
    nextPath: stringOrNull(object.nextPath),
    toPath: stringOrNull(object.toPath),
    to: stringOrNull(object.to),
    kind: stringOrNull(object.kind),
    type: stringOrNull(object.type),
    operation: stringOrNull(object.operation),
    additions: safeCountOrNull(object.additions),
    addedLines: safeCountOrNull(object.addedLines),
    linesAdded: safeCountOrNull(object.linesAdded),
    insertions: safeCountOrNull(object.insertions),
    deletions: safeCountOrNull(object.deletions),
    deletedLines: safeCountOrNull(object.deletedLines),
    linesDeleted: safeCountOrNull(object.linesDeleted),
    removals: safeCountOrNull(object.removals),
    unsafeFieldsPresent: hasRawFileChangeFields(object),
  };
}

function normalizeStatus(value) {
  if (typeof value === "string") {
    return value;
  }
  if (value && typeof value === "object" && typeof value.type === "string") {
    return {
      type: value.type,
    };
  }
  return null;
}

function normalizeNotificationThread(value) {
  const object = objectOrEmpty(value);
  return {
    id: stringOrNull(object.id),
    status: normalizeStatus(object.status),
  };
}

function normalizeNotificationTurn(value) {
  const object = objectOrEmpty(value);
  return {
    id: stringOrNull(object.id),
    status: normalizeStatus(object.status),
  };
}

function normalizeNotificationItem(value) {
  const object = objectOrEmpty(value);
  return {
    id: stringOrNull(object.id),
    type: stringOrNull(object.type),
    status: normalizeStatus(object.status),
    phase: stringOrNull(object.phase),
  };
}

function normalizeContent(value) {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return normalizeContentArray(value);
  }
  return undefined;
}

function normalizeContentArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.slice(0, MAX_ITEM_CONTENT_ENTRIES).map((entry) => {
    const object = objectOrEmpty(entry);
    const normalized = {
      type: stringOrNull(object.type),
    };
    if (typeof object.text === "string") {
      normalized.text = object.text;
    }
    return normalized;
  });
}

function hasRawFileChangeFields(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  return (
    value.unsafeFieldsPresent === true ||
    Object.keys(value).some((key) => RAW_FILE_CHANGE_FIELDS.has(key))
  );
}

function objectOrEmpty(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function plainObjectOrEmpty(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry && typeof entry === "object"),
  );
}

function stringOrNull(value) {
  return typeof value === "string" ? value : null;
}

function numberOrNull(value) {
  return Number.isFinite(value) ? value : null;
}

function safeCountOrNull(value) {
  return Number.isSafeInteger(value) && value >= 0 ? value : null;
}

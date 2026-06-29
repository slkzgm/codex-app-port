import {
  constants,
  closeSync,
  lstatSync,
  mkdirSync,
  openSync,
  writeSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import process from "node:process";

export const ACTION_AUDIT_LOG_VERSION = 1;
export const MAX_ACTION_AUDIT_LINE_BYTES = 4096;

const ACTION_AUDIT_EVENTS = new Set([
  "account-login-cancel-recorded",
  "account-credits-nudge-recorded",
  "account-login-recorded",
  "account-logout-recorded",
  "account-reset-credit-consume-recorded",
  "config-batch-write-recorded",
  "config-value-write-recorded",
  "environment-add-recorded",
  "experimental-feature-set-recorded",
  "file-action-recorded",
  "live-session-bulk-control-recorded",
  "live-session-control-recorded",
  "mcp-oauth-login-recorded",
  "mcp-server-reload-recorded",
  "mcp-tool-call-recorded",
  "mcp-resource-read-recorded",
  "plugin-content-read-recorded",
  "plugin-read-recorded",
  "plugin-share-checkout-recorded",
  "plugin-uninstall-recorded",
  "process-spawn-recorded",
  "remote-control-client-revoke-recorded",
  "remote-control-disable-recorded",
  "skills-config-write-recorded",
  "skills-extra-roots-clear-recorded",
  "terminal-background-clean-recorded",
  "terminal-background-terminate-recorded",
  "terminal-control-recorded",
  "terminal-command-recorded",
  "thread-shell-command-recorded",
  "thread-archive-recorded",
  "thread-compact-recorded",
  "thread-delete-recorded",
  "thread-fork-recorded",
  "thread-goal-clear-recorded",
  "thread-goal-set-recorded",
  "thread-memory-mode-set-recorded",
  "thread-rename-recorded",
  "thread-rollback-recorded",
  "thread-safety-lock-recorded",
  "thread-start-recorded",
  "turn-start-recorded",
]);

export function defaultActionAuditLogPath(env = process.env) {
  const stateHome = env.XDG_STATE_HOME || join(homedir(), ".local", "state");
  return join(stateHome, "codex-app-port", "actions.jsonl");
}

export function createActionAuditLog({
  path = defaultActionAuditLogPath(),
  now = () => new Date().toISOString(),
} = {}) {
  if (typeof path !== "string" || path.length === 0) {
    throw new Error("Action audit log path must be a non-empty string");
  }

  return {
    persistent: true,
    ensureWritable() {
      ensureAppendableNoFollow(path);
      return true;
    },
    append(record) {
      const auditRecord = sanitizeActionAuditRecord(record, { generatedAt: now() });
      const line = `${JSON.stringify(auditRecord)}\n`;
      if (Buffer.byteLength(line, "utf8") > MAX_ACTION_AUDIT_LINE_BYTES) {
        throw new Error("Action audit log record exceeded size limit");
      }
      appendLineNoFollow(path, line);
      return auditRecord;
    },
  };
}

export function sanitizeActionAuditRecord(record, { generatedAt = null } = {}) {
  const payload = record?.payload && typeof record.payload === "object" ? record.payload : record;
  const action = payload?.action && typeof payload.action === "object" ? payload.action : {};
  const actionType = sanitizeActionType(action.type);
  const event = ACTION_AUDIT_EVENTS.has(record?.event)
    ? record.event
    : actionAuditEvent(actionType);
  const appServer =
    payload?.appServer && typeof payload.appServer === "object" ? payload.appServer : {};
  const target = payload?.target && typeof payload.target === "object" ? payload.target : {};
  const source = payload?.source && typeof payload.source === "object" ? payload.source : null;
  const prompt = payload?.prompt && typeof payload.prompt === "object" ? payload.prompt : {};
  const content = payload?.content && typeof payload.content === "object" ? payload.content : {};
  const result = payload?.result && typeof payload.result === "object" ? payload.result : {};
  const filesystem =
    payload?.filesystem && typeof payload.filesystem === "object" ? payload.filesystem : {};
  const preflight =
    payload?.preflight && typeof payload.preflight === "object" ? payload.preflight : {};
  const scope = preflight.scope && typeof preflight.scope === "object" ? preflight.scope : {};

  return {
    version: ACTION_AUDIT_LOG_VERSION,
    event,
    generatedAt: safeString(generatedAt, 40),
    workspace: sanitizeWorkspace(payload?.workspace ?? record?.workspace),
    action: sanitizeAction(action, actionType, { appServer }),
    appServer: {
      touched: Boolean(appServer.touched),
      modelTraffic: Boolean(appServer.modelTraffic),
      commandTraffic:
        actionType === "terminal-command" ||
        actionType === "process-spawn" ||
        actionType === "thread-shell-command"
          ? Boolean(appServer.commandTraffic)
          : false,
      settingsTraffic:
        actionType === "mcp-server-reload" ||
        actionType === "config-batch-write" ||
        actionType === "config-value-write" ||
        actionType === "experimental-feature-set" ||
        actionType === "environment-add" ||
        actionType === "thread-safety-lock"
          ? Boolean(appServer.settingsTraffic)
          : false,
      toolTraffic:
        actionType === "mcp-tool-call" ? Boolean(appServer.toolTraffic) : false,
      resourceTraffic:
        actionType === "mcp-resource-read" ? Boolean(appServer.resourceTraffic) : false,
      authTraffic:
        actionType === "mcp-oauth-login" ? Boolean(appServer.authTraffic) : false,
      pluginReadTraffic:
        actionType === "plugin-read" ? Boolean(appServer.pluginReadTraffic) : false,
      pluginContentTraffic:
        actionType === "plugin-content-read" ? Boolean(appServer.pluginContentTraffic) : false,
      pluginMutationTraffic:
        actionType === "plugin-uninstall" || actionType === "plugin-share-checkout"
          ? Boolean(appServer.pluginMutationTraffic)
          : false,
      skillsConfigTraffic:
        actionType === "skills-config-write" ? Boolean(appServer.skillsConfigTraffic) : false,
      skillsExtraRootsTraffic:
        actionType === "skills-extra-roots-clear"
          ? Boolean(appServer.skillsExtraRootsTraffic)
          : false,
      remoteControlTraffic:
        actionType === "remote-control-disable" || actionType === "remote-control-client-revoke"
          ? Boolean(appServer.remoteControlTraffic)
          : false,
      remoteEnvironmentTraffic:
        actionType === "environment-add"
          ? Boolean(appServer.remoteEnvironmentTraffic)
          : false,
      auditedMethods: sanitizeMethodList(appServer.auditedMethods),
    },
    target: sanitizeTarget(target, actionType),
    source: sanitizeSource(source, actionType),
    prompt: {
      present: Boolean(prompt.present),
      charCount: safeCount(prompt.charCount),
      lineCount: safeCount(prompt.lineCount),
      textReturned: false,
    },
    content: {
      present: Boolean(content.present),
      charCount: safeCount(content.charCount),
      lineCount: safeCount(content.lineCount),
      textReturned: false,
    },
    result: sanitizeResult(result, actionType),
    filesystem: sanitizeFilesystem(filesystem, actionType),
    preflight: {
      tokenConsumed: Boolean(preflight.tokenConsumed),
      tokenReturned: false,
      scope: {
        kind: safeString(scope.kind, 80),
        workspaceId: safeString(scope.workspaceId, 80),
      },
      rawIntentStored: false,
      rawIntentReturned: false,
      intentHashReturned: false,
      oneTimeUseEnforced: Boolean(preflight.oneTimeUseEnforced),
    },
    policy: {
      auditLogPathReturned: false,
      preflightTokensReturned: false,
      promptTextReturned: false,
      fileContentsReturned: false,
      fullIdsReturned: false,
      pathsReturned: false,
      fileBasenamesReturned: false,
      threadContentReturned: false,
      terminalOutputReturned: false,
      terminalSessionIdentifiersReturned: false,
      rawRequestBodyReturned: false,
      sensitivePayloadLogged: false,
    },
  };
}

function actionAuditEvent(actionType) {
  switch (actionType) {
    case "account-login-cancel":
      return "account-login-cancel-recorded";
    case "account-credits-nudge":
      return "account-credits-nudge-recorded";
    case "account-login":
      return "account-login-recorded";
    case "account-logout":
      return "account-logout-recorded";
    case "account-reset-credit-consume":
      return "account-reset-credit-consume-recorded";
    case "config-value-write":
      return "config-value-write-recorded";
    case "config-batch-write":
      return "config-batch-write-recorded";
    case "experimental-feature-set":
      return "experimental-feature-set-recorded";
    case "environment-add":
      return "environment-add-recorded";
    case "file-action":
      return "file-action-recorded";
    case "mcp-tool-call":
      return "mcp-tool-call-recorded";
    case "mcp-server-reload":
      return "mcp-server-reload-recorded";
    case "mcp-resource-read":
      return "mcp-resource-read-recorded";
    case "mcp-oauth-login":
      return "mcp-oauth-login-recorded";
    case "plugin-read":
      return "plugin-read-recorded";
    case "plugin-uninstall":
      return "plugin-uninstall-recorded";
    case "plugin-share-checkout":
      return "plugin-share-checkout-recorded";
    case "plugin-content-read":
      return "plugin-content-read-recorded";
    case "process-spawn":
      return "process-spawn-recorded";
    case "remote-control-client-revoke":
      return "remote-control-client-revoke-recorded";
    case "remote-control-disable":
      return "remote-control-disable-recorded";
    case "skills-config-write":
      return "skills-config-write-recorded";
    case "skills-extra-roots-clear":
      return "skills-extra-roots-clear-recorded";
    case "terminal-background-clean":
      return "terminal-background-clean-recorded";
    case "terminal-background-terminate":
      return "terminal-background-terminate-recorded";
    case "terminal-control":
      return "terminal-control-recorded";
    case "terminal-command":
      return "terminal-command-recorded";
    case "thread-shell-command":
      return "thread-shell-command-recorded";
    case "thread-archive":
      return "thread-archive-recorded";
    case "thread-compact":
      return "thread-compact-recorded";
    case "thread-delete":
      return "thread-delete-recorded";
    case "thread-fork":
      return "thread-fork-recorded";
    case "thread-goal-set":
      return "thread-goal-set-recorded";
    case "thread-goal-clear":
      return "thread-goal-clear-recorded";
    case "thread-memory-mode-set":
      return "thread-memory-mode-set-recorded";
    case "thread-rename":
      return "thread-rename-recorded";
    case "thread-rollback":
      return "thread-rollback-recorded";
    case "thread-safety-lock":
      return "thread-safety-lock-recorded";
    case "thread-start":
      return "thread-start-recorded";
    case "turn-start":
      return "turn-start-recorded";
    case "live-session-control":
      return "live-session-control-recorded";
    case "live-session-bulk-control":
      return "live-session-bulk-control-recorded";
    default:
      return "live-session-control-recorded";
  }
}

function sanitizeAction(action, actionType, { appServer }) {
  if (actionType === "account-login-cancel") {
    return {
      type: "account-login-cancel",
      method: "account/login/cancel",
      execution: safeString(action.execution, 40) ?? "canceled",
      authMutation: Boolean(action.authMutation),
      authFlowStarted: false,
      authFlowCanceled: Boolean(action.authFlowCanceled),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "account-login") {
    return {
      type: "account-login",
      method: "account/login/start",
      execution: safeString(action.execution, 40) ?? "started-with-redactions",
      authMutation: Boolean(action.authMutation),
      authFlowStarted: Boolean(action.authFlowStarted),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "account-credits-nudge") {
    return {
      type: "account-credits-nudge",
      method: "account/sendAddCreditsNudgeEmail",
      execution: safeCreditsNudgeStatus(action.execution),
      authMutation: Boolean(action.authMutation),
      emailSideEffect: Boolean(action.emailSideEffect),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "account-logout") {
    return {
      type: "account-logout",
      method: "account/logout",
      execution: safeString(action.execution, 40) ?? "logged-out",
      authMutation: Boolean(action.authMutation),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "account-reset-credit-consume") {
    return {
      type: "account-reset-credit-consume",
      method: "account/rateLimitResetCredit/consume",
      execution: safeRateLimitResetCreditOutcome(action.execution),
      authMutation: Boolean(action.authMutation),
      quotaMutation: Boolean(action.quotaMutation),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "file-action") {
    const fileAction = sanitizeFileAction(action.fileAction);
    return {
      type: "file-action",
      fileAction,
      method: safeString(action.method, 100) ?? fileActionMethod(fileAction),
      execution: safeString(action.execution, 40) ?? "completed",
      filesystemWrites: Boolean(action.filesystemWrites),
      appServerTouched: false,
      modelTraffic: false,
    };
  }
  if (actionType === "terminal-background-clean") {
    return {
      type: "terminal-background-clean",
      method: "thread/backgroundTerminals/clean",
      execution: safeString(action.execution, 40) ?? "completed",
      terminalCleanup: Boolean(action.terminalCleanup),
      terminalSessionTouched: Boolean(action.terminalSessionTouched),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "terminal-background-terminate") {
    return {
      type: "terminal-background-terminate",
      method: "thread/backgroundTerminals/terminate",
      execution: safeString(action.execution, 40) ?? "completed",
      terminalTerminate: Boolean(action.terminalTerminate),
      terminalSessionTouched: Boolean(action.terminalSessionTouched),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "mcp-resource-read") {
    return {
      type: "mcp-resource-read",
      method: "mcpServer/resource/read",
      execution: safeString(action.execution, 40) ?? "completed",
      resourceRead: Boolean(action.resourceRead),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "mcp-tool-call") {
    return {
      type: "mcp-tool-call",
      method: "mcpServer/tool/call",
      execution: safeString(action.execution, 40) ?? "completed",
      toolInvocation: Boolean(action.toolInvocation),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "mcp-server-reload") {
    return {
      type: "mcp-server-reload",
      method: "config/mcpServer/reload",
      execution: safeString(action.execution, 40) ?? "completed",
      mcpServersReloaded: Boolean(action.mcpServersReloaded),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "mcp-oauth-login") {
    return {
      type: "mcp-oauth-login",
      method: "mcpServer/oauth/login",
      execution: safeString(action.execution, 40) ?? "completed",
      authFlowStarted: Boolean(action.authFlowStarted),
      mcpOauthLogin: Boolean(action.mcpOauthLogin),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "config-value-write") {
    return {
      type: "config-value-write",
      method: "config/value/write",
      execution: safeString(action.execution, 40) ?? "completed",
      settingsWrite: Boolean(action.settingsWrite),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "config-batch-write") {
    return {
      type: "config-batch-write",
      method: "config/batchWrite",
      execution: safeString(action.execution, 40) ?? "completed",
      settingsWrite: Boolean(action.settingsWrite),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "experimental-feature-set") {
    return {
      type: "experimental-feature-set",
      method: "experimentalFeature/enablement/set",
      execution: safeString(action.execution, 40) ?? "completed",
      settingsWrite: Boolean(action.settingsWrite),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "plugin-read") {
    return {
      type: "plugin-read",
      method: "plugin/read",
      execution: safeString(action.execution, 40) ?? "completed",
      pluginRead: Boolean(action.pluginRead),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "plugin-uninstall") {
    return {
      type: "plugin-uninstall",
      method: "plugin/uninstall",
      execution: safeString(action.execution, 40) ?? "completed",
      pluginMutation: Boolean(action.pluginMutation),
      pluginUninstall: Boolean(action.pluginUninstall),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "plugin-share-checkout") {
    return {
      type: "plugin-share-checkout",
      method: "plugin/share/checkout",
      execution: safeString(action.execution, 40) ?? "completed",
      pluginMutation: Boolean(action.pluginMutation),
      pluginShareCheckout: Boolean(action.pluginShareCheckout),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "plugin-content-read") {
    const method = safeString(action.method, 100) ?? "plugin/skill/read";
    return {
      type: "plugin-content-read",
      method,
      execution: safeString(action.execution, 40) ?? "completed",
      pluginContentRead: method === "plugin/skill/read" && Boolean(action.pluginContentRead),
      pluginShareList: method === "plugin/share/list" && Boolean(action.pluginShareList),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "skills-config-write") {
    return {
      type: "skills-config-write",
      method: "skills/config/write",
      execution: safeString(action.execution, 40) ?? "completed",
      skillsConfigWrite: Boolean(action.skillsConfigWrite),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "skills-extra-roots-clear") {
    return {
      type: "skills-extra-roots-clear",
      method: "skills/extraRoots/set",
      execution: safeString(action.execution, 40) ?? "completed",
      skillsExtraRootsClear: Boolean(action.skillsExtraRootsClear),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "remote-control-disable") {
    return {
      type: "remote-control-disable",
      method: "remoteControl/disable",
      execution: safeString(action.execution, 40) ?? "completed",
      remoteControlDisable: Boolean(action.remoteControlDisable),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "remote-control-client-revoke") {
    return {
      type: "remote-control-client-revoke",
      method: "remoteControl/client/revoke",
      execution: safeString(action.execution, 40) ?? "completed",
      remoteControlClientRevoke: Boolean(action.remoteControlClientRevoke),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "environment-add") {
    return {
      type: "environment-add",
      method: "environment/add",
      execution: safeString(action.execution, 40) ?? "completed",
      remoteEnvironmentMutation: Boolean(action.remoteEnvironmentMutation),
      environmentAdd: Boolean(action.environmentAdd),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "terminal-command") {
    return {
      type: "terminal-command",
      method: "command/exec",
      execution: safeString(action.execution, 40) ?? "completed",
      commandExecution: Boolean(action.commandExecution),
      terminalSessionCreated: false,
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "thread-shell-command") {
    return {
      type: "thread-shell-command",
      method: "thread/shellCommand",
      execution: safeString(action.execution, 40) ?? "completed",
      commandExecution: Boolean(action.commandExecution),
      threadShellCommand: Boolean(action.threadShellCommand),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "process-spawn") {
    return {
      type: "process-spawn",
      method: "process/spawn",
      execution: safeString(action.execution, 40) ?? "completed",
      commandExecution: Boolean(action.commandExecution),
      hostProcessExecution: Boolean(action.hostProcessExecution),
      terminalSessionCreated: false,
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "terminal-control") {
    const terminalAction = sanitizeTerminalControlAction(action.terminalAction);
    const method = safeString(action.method, 100) ?? terminalControlMethod(terminalAction);
    return {
      type: "terminal-control",
      terminalAction,
      method,
      execution: safeString(action.execution, 40) ?? "completed",
      terminalWrite: terminalAction === "write" && Boolean(action.terminalWrite),
      terminalResize: terminalAction === "resize" && Boolean(action.terminalResize),
      terminalTerminate: terminalAction === "terminate" && Boolean(action.terminalTerminate),
      commandExecTerminalControl: method.startsWith("command/exec/"),
      processTerminalControl: method.startsWith("process/"),
      terminalSessionTouched: Boolean(action.terminalSessionTouched),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "thread-start") {
    return {
      type: "thread-start",
      method: "thread/start",
      execution: safeString(action.execution, 40) ?? "created",
      threadCreated: Boolean(action.threadCreated),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "turn-start") {
    return {
      type: "turn-start",
      method: "turn/start",
      execution: safeString(action.execution, 40) ?? "started",
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: Boolean(action.modelTraffic ?? appServer.modelTraffic),
      sendsPromptToAppServer: Boolean(action.sendsPromptToAppServer),
      approvalMode: safeString(action.approvalMode, 40) ?? "deny-only",
    };
  }
  if (actionType === "thread-archive") {
    const archiveAction = sanitizeThreadArchiveAction(action.threadArchiveAction);
    return {
      type: "thread-archive",
      method: archiveAction === "unarchive" ? "thread/unarchive" : "thread/archive",
      execution: safeString(action.execution, 40) ?? "completed",
      threadArchiveAction: archiveAction,
      threadStateMutated: Boolean(action.threadStateMutated),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "thread-delete") {
    return {
      type: "thread-delete",
      method: "thread/delete",
      execution: safeString(action.execution, 40) ?? "deleted",
      threadDeleted: Boolean(action.threadDeleted),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "thread-fork") {
    return {
      type: "thread-fork",
      method: "thread/fork",
      execution: safeString(action.execution, 40) ?? "forked",
      threadForked: Boolean(action.threadForked),
      threadStateMutated: Boolean(action.threadStateMutated),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "thread-rename") {
    return {
      type: "thread-rename",
      method: "thread/name/set",
      execution: safeString(action.execution, 40) ?? "renamed",
      threadRenamed: Boolean(action.threadRenamed),
      threadStateMutated: Boolean(action.threadStateMutated),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "thread-goal-set") {
    return {
      type: "thread-goal-set",
      method: "thread/goal/set",
      execution: safeString(action.execution, 40) ?? "set",
      goalSet: Boolean(action.goalSet),
      threadStateMutated: Boolean(action.threadStateMutated),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "thread-goal-clear") {
    return {
      type: "thread-goal-clear",
      method: "thread/goal/clear",
      execution: safeString(action.execution, 40) ?? "cleared",
      goalCleared: Boolean(action.goalCleared),
      threadStateMutated: Boolean(action.threadStateMutated),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "thread-memory-mode-set") {
    return {
      type: "thread-memory-mode-set",
      method: "thread/memoryMode/set",
      execution: safeString(action.execution, 40) ?? "set",
      memoryModeSet: Boolean(action.memoryModeSet),
      threadSettingsMutated: Boolean(action.threadSettingsMutated),
      threadStateMutated: Boolean(action.threadStateMutated),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "thread-rollback") {
    return {
      type: "thread-rollback",
      method: "thread/rollback",
      execution: safeString(action.execution, 40) ?? "rolled-back",
      threadRolledBack: Boolean(action.threadRolledBack),
      threadStateMutated: Boolean(action.threadStateMutated),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "thread-safety-lock") {
    return {
      type: "thread-safety-lock",
      method: "thread/settings/update",
      execution: safeString(action.execution, 40) ?? "safety-locked",
      threadSafetyLocked: Boolean(action.threadSafetyLocked),
      threadSettingsMutated: Boolean(action.threadSettingsMutated),
      threadStateMutated: Boolean(action.threadStateMutated),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
    };
  }
  if (actionType === "thread-compact") {
    return {
      type: "thread-compact",
      method: "thread/compact/start",
      execution: safeString(action.execution, 40) ?? "started",
      threadCompactionStarted: Boolean(action.threadCompactionStarted ?? action.threadCompacted),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: true,
      sendsPromptToAppServer: false,
    };
  }
  if (actionType === "live-session-bulk-control") {
    return {
      type: "live-session-bulk-control",
      liveSessionAction: "unsubscribe",
      method: "thread/unsubscribe",
      execution: safeString(action.execution, 40) ?? "completed",
      liveSessionMutation: Boolean(action.liveSessionMutation),
      bulkLiveSessionMutation: Boolean(action.bulkLiveSessionMutation),
      appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
      modelTraffic: false,
      sendsPromptToAppServer: false,
    };
  }
  const liveSessionAction = sanitizeLiveSessionControlAction(action.liveSessionAction);
  return {
    type: "live-session-control",
    liveSessionAction,
    method: safeString(action.method, 100) ?? liveSessionControlMethod(liveSessionAction),
    execution: safeString(action.execution, 40) ?? "completed",
    appServerTouched: Boolean(action.appServerTouched ?? appServer.touched),
    modelTraffic: Boolean(action.modelTraffic ?? appServer.modelTraffic),
    sendsPromptToAppServer: Boolean(action.sendsPromptToAppServer),
  };
}

function sanitizeTarget(target, actionType) {
  if (actionType === "account-login-cancel") {
    return {
      loginRefReturned: false,
      loginIdReturned: false,
      accountIdentifiersReturned: false,
      tokensReturned: false,
      authUrlReturned: false,
      urlsReturned: false,
    };
  }
  if (actionType === "account-login") {
    return {
      loginType: safeString(target.loginType, 40) ?? "chatgptDeviceCode",
      accountIdentifiersReturned: false,
      tokensReturned: false,
      loginIdReturned: false,
      authUrlReturned: false,
      verificationUrlReturned: false,
      userCodeReturned: false,
      urlsReturned: false,
    };
  }
  if (actionType === "account-credits-nudge") {
    return {
      creditType: safeCreditsNudgeType(target.creditType),
      creditTypeReturned: true,
      accountIdentifiersReturned: false,
      tokensReturned: false,
      urlsReturned: false,
    };
  }
  if (actionType === "account-logout") {
    return {
      accountIdentifiersReturned: false,
      tokensReturned: false,
      urlsReturned: false,
    };
  }
  if (actionType === "account-reset-credit-consume") {
    return {
      idempotencyKeyGeneratedServerSide: true,
      idempotencyKeyReturned: false,
      accountIdentifiersReturned: false,
      tokensReturned: false,
      urlsReturned: false,
      rateLimitValuesReturned: false,
    };
  }
  if (actionType === "file-action") {
    return {
      depth: safeCount(target.depth),
      basenameReturned: false,
      pathReturned: false,
    };
  }
  if (actionType === "terminal-background-clean") {
    return {
      threadIdSuffix: safeString(target.threadIdSuffix, 16),
      fullIdsReturned: false,
      pathsReturned: false,
    };
  }
  if (actionType === "terminal-background-terminate") {
    return {
      threadIdSuffix: safeString(target.threadIdSuffix, 16),
      terminalRefReturned: false,
      processIdReturned: false,
      fullIdsReturned: false,
      pathsReturned: false,
    };
  }
  if (actionType === "mcp-resource-read") {
    return {
      serverCharCount: safeCount(target.serverCharCount),
      resourceCharCount: safeCount(target.resourceCharCount),
      namesReturned: false,
      resourceUriReturned: false,
      pathsReturned: false,
    };
  }
  if (actionType === "mcp-tool-call") {
    return {
      serverCharCount: safeCount(target.serverCharCount),
      toolCharCount: safeCount(target.toolCharCount),
      argumentCharCount: safeCount(target.argumentCharCount),
      argumentTopLevelKeyCount: safeCount(target.argumentTopLevelKeyCount),
      namesReturned: false,
      argumentTextReturned: false,
      threadIdSuffixReturned: false,
      fullIdsReturned: false,
      pathsReturned: false,
    };
  }
  if (actionType === "mcp-server-reload") {
    return {
      argumentCount: safeCount(target.argumentCount),
      namesReturned: false,
      pathsReturned: false,
      rawPayloadReturned: false,
    };
  }
  if (actionType === "mcp-oauth-login") {
    return {
      serverCharCount: safeCount(target.serverCharCount),
      namesReturned: false,
      pathsReturned: false,
      rawPayloadReturned: false,
    };
  }
  if (actionType === "config-value-write") {
    return {
      keyPathCharCount: safeCount(target.keyPathCharCount),
      valueCharCount: safeCount(target.valueCharCount),
      valueLineCount: safeCount(target.valueLineCount),
      valueTopLevelKeyCount: safeCount(target.valueTopLevelKeyCount),
      valueArrayItemCount: safeCount(target.valueArrayItemCount),
      mergeStrategy: safeString(target.mergeStrategy, 20),
      keyPathReturned: false,
      valueReturned: false,
      pathsReturned: false,
      rawPayloadReturned: false,
    };
  }
  if (actionType === "config-batch-write") {
    return {
      editCount: safeCount(target.editCount),
      editsJsonCharCount: safeCount(target.editsJsonCharCount),
      keyPathCharCount: safeCount(target.keyPathCharCount),
      valueCharCount: safeCount(target.valueCharCount),
      valueLineCount: safeCount(target.valueLineCount),
      valueTopLevelKeyCount: safeCount(target.valueTopLevelKeyCount),
      valueArrayItemCount: safeCount(target.valueArrayItemCount),
      keyPathsReturned: false,
      valuesReturned: false,
      pathsReturned: false,
      rawPayloadReturned: false,
    };
  }
  if (actionType === "experimental-feature-set") {
    return {
      featureCharCount: safeCount(target.featureCharCount),
      enabledValueCount: safeCount(target.enabledValueCount),
      featureNameReturned: false,
      enablementValuesReturned: false,
      pathsReturned: false,
      rawPayloadReturned: false,
    };
  }
  if (actionType === "plugin-read") {
    return {
      targetCharCount: safeCount(target.targetCharCount),
      argumentCharCount: safeCount(target.argumentCharCount),
      argumentTopLevelKeyCount: safeCount(target.argumentTopLevelKeyCount),
      targetReturned: false,
      argumentTextReturned: false,
      namesReturned: false,
      pathsReturned: false,
      urlsReturned: false,
    };
  }
  if (actionType === "plugin-uninstall") {
    return {
      targetCharCount: safeCount(target.targetCharCount),
      pluginIdReturned: false,
      namesReturned: false,
      pathsReturned: false,
      urlsReturned: false,
      rawPayloadReturned: false,
    };
  }
  if (actionType === "plugin-share-checkout") {
    return {
      targetCharCount: safeCount(target.targetCharCount),
      remotePluginIdReturned: false,
      marketplaceNamesReturned: false,
      pluginNamesReturned: false,
      idsReturned: false,
      pathsReturned: false,
      urlsReturned: false,
      rawPayloadReturned: false,
    };
  }
  if (actionType === "plugin-content-read") {
    return {
      targetCharCount: safeCount(target.targetCharCount),
      argumentCharCount: safeCount(target.argumentCharCount),
      argumentTopLevelKeyCount: safeCount(target.argumentTopLevelKeyCount),
      targetReturned: false,
      argumentTextReturned: false,
      namesReturned: false,
      pathsReturned: false,
      urlsReturned: false,
    };
  }
  if (actionType === "skills-config-write") {
    return {
      targetCharCount: safeCount(target.targetCharCount),
      argumentCharCount: safeCount(target.argumentCharCount),
      argumentTopLevelKeyCount: safeCount(target.argumentTopLevelKeyCount),
      targetReturned: false,
      argumentTextReturned: false,
      namesReturned: false,
      pathsReturned: false,
    };
  }
  if (actionType === "skills-extra-roots-clear") {
    return {
      requestedExtraRootCount: 0,
      browserRootsAccepted: false,
      extraRootsReturned: false,
      pathsReturned: false,
      rawPayloadReturned: false,
    };
  }
  if (actionType === "remote-control-disable") {
    return {
      paramsAcceptedFromBrowser: false,
      ephemeralAccepted: false,
      statusValueReturned: false,
      environmentIdReturned: false,
      installationIdReturned: false,
      serverNameReturned: false,
      rawPayloadReturned: false,
    };
  }
  if (actionType === "remote-control-client-revoke") {
    return {
      remoteClientRefAccepted: Boolean(target.remoteClientRefAccepted),
      remoteClientRefReturned: false,
      clientIdReturned: false,
      environmentIdReturned: false,
      rawPayloadReturned: false,
    };
  }
  if (actionType === "environment-add") {
    return {
      environmentIdCharCount: safeCount(target.environmentIdCharCount),
      execServerUrlCharCount: safeCount(target.execServerUrlCharCount),
      connectTimeoutAcceptedFromBrowser: false,
      environmentIdReturned: false,
      execServerUrlReturned: false,
      urlsReturned: false,
      pathsReturned: false,
      rawPayloadReturned: false,
    };
  }
  if (actionType === "terminal-command") {
    return {
      commandTextReturned: false,
      argvReturned: false,
      executableReturned: false,
      cwdReturned: false,
      pathsReturned: false,
    };
  }
  if (actionType === "thread-shell-command") {
    return {
      threadIdSuffix: safeString(target.threadIdSuffix, 16),
      commandTextReturned: false,
      outputTextReturned: false,
      terminalSessionIdentifiersReturned: false,
      fullIdsReturned: false,
      pathsReturned: false,
    };
  }
  if (actionType === "terminal-control") {
    return {
      sessionSelectorCharCount: safeCount(target.sessionSelectorCharCount),
      sessionIdentifierReturned: false,
      pathsReturned: false,
    };
  }
  if (actionType === "thread-start") {
    return {
      threadIdSuffix: safeString(target.threadIdSuffix, 16),
      fullIdsReturned: false,
      pathsReturned: false,
    };
  }
  if (actionType === "turn-start") {
    return {
      threadIdSuffix: safeString(target.threadIdSuffix, 16),
      turnIdSuffix: safeString(target.turnIdSuffix, 16),
      fullIdsReturned: false,
      pathsReturned: false,
    };
  }
  if (actionType === "thread-archive") {
    return {
      threadIdSuffix: safeString(target.threadIdSuffix, 16),
      archived: Boolean(target.archived),
      fullIdsReturned: false,
      pathsReturned: false,
    };
  }
  if (actionType === "thread-delete") {
    return {
      threadIdSuffix: safeString(target.threadIdSuffix, 16),
      deleted: Boolean(target.deleted),
      sourceArchived: Boolean(target.sourceArchived),
      fullIdsReturned: false,
      pathsReturned: false,
    };
  }
  if (actionType === "thread-fork") {
    return {
      sourceThreadIdSuffix: safeString(target.sourceThreadIdSuffix, 16),
      threadIdSuffix: safeString(target.threadIdSuffix, 16),
      forked: Boolean(target.forked),
      excludeTurns: target.excludeTurns !== false,
      fullIdsReturned: false,
      pathsReturned: false,
    };
  }
  if (actionType === "thread-rename") {
    return {
      threadIdSuffix: safeString(target.threadIdSuffix, 16),
      renamed: Boolean(target.renamed),
      nameCharCount: safeCount(target.nameCharCount),
      nameLineCount: safeCount(target.nameLineCount),
      fullIdsReturned: false,
      pathsReturned: false,
    };
  }
  if (actionType === "thread-goal-set") {
    return {
      threadIdSuffix: safeString(target.threadIdSuffix, 16),
      goalSet: Boolean(target.goalSet),
      objectiveCharCount: safeCount(target.objectiveCharCount),
      objectiveLineCount: safeCount(target.objectiveLineCount),
      fullIdsReturned: false,
      pathsReturned: false,
    };
  }
  if (actionType === "thread-goal-clear") {
    return {
      threadIdSuffix: safeString(target.threadIdSuffix, 16),
      goalCleared: Boolean(target.goalCleared),
      fullIdsReturned: false,
      pathsReturned: false,
    };
  }
  if (actionType === "thread-memory-mode-set") {
    return {
      threadIdSuffix: safeString(target.threadIdSuffix, 16),
      mode: safeString(target.mode, 16) === "disabled" ? "disabled" : "enabled",
      memoryModeSet: Boolean(target.memoryModeSet),
      fullIdsReturned: false,
      pathsReturned: false,
    };
  }
  if (actionType === "thread-rollback") {
    return {
      threadIdSuffix: safeString(target.threadIdSuffix, 16),
      rolledBack: Boolean(target.rolledBack),
      numTurns: safeCount(target.numTurns),
      returnedTurnCount: safeCount(target.returnedTurnCount),
      fullIdsReturned: false,
      pathsReturned: false,
    };
  }
  if (actionType === "thread-safety-lock") {
    return {
      threadIdSuffix: safeString(target.threadIdSuffix, 16),
      locked: Boolean(target.locked),
      approvalPolicy: "on-request",
      approvalsReviewer: "user",
      sandboxPolicyType: "readOnly",
      networkAccessAllowed: false,
      fullIdsReturned: false,
      pathsReturned: false,
    };
  }
  if (actionType === "thread-compact") {
    return {
      threadIdSuffix: safeString(target.threadIdSuffix, 16),
      fullIdsReturned: false,
      pathsReturned: false,
    };
  }
  if (actionType === "live-session-bulk-control") {
    return {
      targetScope: safeString(target.targetScope, 40) ?? "all-loaded",
      threadIdSuffixesReturned: false,
      fullIdsReturned: false,
      pathsReturned: false,
    };
  }
  return {
    threadIdSuffix: safeString(target.threadIdSuffix, 16),
    turnIdSuffix: safeString(target.turnIdSuffix, 16),
    responseTurnIdSuffix: safeString(target.responseTurnIdSuffix, 16),
    fullIdsReturned: false,
  };
}

function sanitizeSource(source, actionType) {
  if (actionType !== "file-action" || !source) {
    return null;
  }
  return {
    depth: safeCount(source.depth),
    basenameReturned: false,
    pathReturned: false,
  };
}

function sanitizeResult(result, actionType) {
  if (actionType === "account-login-cancel") {
    return {
      status: safeString(result.status, 80) ?? "canceled",
      canceled: Boolean(result.canceled),
      notFound: Boolean(result.notFound),
      responseReturned: false,
      loginRefReturned: false,
      loginIdReturned: false,
      authUrlReturned: false,
      tokensReturned: false,
      accountIdentifiersReturned: false,
      urlsReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "account-login") {
    return {
      status: safeString(result.status, 80) ?? "started-with-redactions",
      resultType: safeString(result.resultType, 40),
      deviceCodeFlow: Boolean(result.deviceCodeFlow),
      userCodeReturned: false,
      verificationUrlReturned: false,
      loginIdReturned: false,
      authUrlReturned: false,
      tokensReturned: false,
      accountIdentifiersReturned: false,
      urlsReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "account-logout") {
    return {
      status: safeString(result.status, 80) ?? "logged-out",
      tokensReturned: false,
      accountIdentifiersReturned: false,
      urlsReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "account-credits-nudge") {
    return {
      status: safeCreditsNudgeStatus(result.status),
      emailSideEffect: true,
      tokensReturned: false,
      accountIdentifiersReturned: false,
      urlsReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "account-reset-credit-consume") {
    return {
      outcome: safeRateLimitResetCreditOutcome(result.outcome),
      outcomeReturned: true,
      quotaMutation: true,
      idempotencyKeyReturned: false,
      tokensReturned: false,
      accountIdentifiersReturned: false,
      urlsReturned: false,
      rateLimitValuesReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "terminal-background-clean") {
    return {
      status: safeString(result.status, 80),
      loadedSessionCount: safeCount(result.loadedSessionCount),
      outputTextReturned: false,
      terminalSessionIdentifiersReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "terminal-background-terminate") {
    return {
      status: safeString(result.status, 80),
      loadedSessionCount: safeCount(result.loadedSessionCount),
      terminated: Boolean(result.terminated),
      outputTextReturned: false,
      terminalSessionIdentifiersReturned: false,
      processIdsReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "mcp-resource-read") {
    return {
      status: safeString(result.status, 80) ?? "completed",
      contentCount: safeCount(result.contentCount),
      textContentCount: safeCount(result.textContentCount),
      blobContentCount: safeCount(result.blobContentCount),
      textCharCount: safeCount(result.textCharCount),
      blobCharCount: safeCount(result.blobCharCount),
      contentReturned: false,
      resourceUriReturned: false,
      mimeTypesReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "mcp-tool-call") {
    return {
      status: safeString(result.status, 80) ?? "completed",
      contentCount: safeCount(result.contentCount),
      textContentCount: safeCount(result.textContentCount),
      resourceContentCount: safeCount(result.resourceContentCount),
      imageContentCount: safeCount(result.imageContentCount),
      otherContentCount: safeCount(result.otherContentCount),
      textCharCount: safeCount(result.textCharCount),
      maxContentCharCount: safeCount(result.maxContentCharCount),
      structuredContentPresent: Boolean(result.structuredContentPresent),
      structuredContentTopLevelKeyCount: safeCount(result.structuredContentTopLevelKeyCount),
      isError: Boolean(result.isError),
      contentReturned: false,
      structuredContentReturned: false,
      namesReturned: false,
      idsReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "mcp-server-reload") {
    return {
      status: safeString(result.status, 80) ?? "completed",
      responseObject: Boolean(result.responseObject),
      responseTopLevelKeyCount: safeCount(result.responseTopLevelKeyCount),
      responseReturned: false,
      namesReturned: false,
      pathsReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "mcp-oauth-login") {
    return {
      status: safeString(result.status, 80) ?? "completed",
      responseObject: Boolean(result.responseObject),
      responseTopLevelKeyCount: safeCount(result.responseTopLevelKeyCount),
      authorizationUrlReturned: false,
      authorizationUrlCharCount: safeCount(result.authorizationUrlCharCount),
      namesReturned: false,
      tokensReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "config-value-write") {
    return {
      status: safeString(result.status, 80) ?? "completed",
      responseObject: Boolean(result.responseObject),
      responseTopLevelKeyCount: safeCount(result.responseTopLevelKeyCount),
      responseReturned: false,
      keyPathReturned: false,
      valueReturned: false,
      pathsReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "config-batch-write") {
    return {
      status: safeString(result.status, 80) ?? "completed",
      editCount: safeCount(result.editCount),
      responseObject: Boolean(result.responseObject),
      responseTopLevelKeyCount: safeCount(result.responseTopLevelKeyCount),
      responseReturned: false,
      keyPathsReturned: false,
      valuesReturned: false,
      pathsReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "experimental-feature-set") {
    return {
      status: safeString(result.status, 80) ?? "completed",
      responseObject: Boolean(result.responseObject),
      responseTopLevelKeyCount: safeCount(result.responseTopLevelKeyCount),
      updatedFeatureCount: safeCount(result.updatedFeatureCount),
      enabledCount: safeCount(result.enabledCount),
      disabledCount: safeCount(result.disabledCount),
      responseReturned: false,
      featureNamesReturned: false,
      enablementValuesReturned: false,
      pathsReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "plugin-read") {
    return {
      status: safeString(result.status, 80) ?? "completed",
      pluginPresent: Boolean(result.pluginPresent),
      appCount: safeCount(result.appCount),
      hookCount: safeCount(result.hookCount),
      mcpServerCount: safeCount(result.mcpServerCount),
      skillCount: safeCount(result.skillCount),
      keywordCount: safeCount(result.keywordCount),
      descriptionCharCount: safeCount(result.descriptionCharCount),
      pluginReturned: false,
      namesReturned: false,
      idsReturned: false,
      pathsReturned: false,
      urlsReturned: false,
      descriptionsReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "plugin-uninstall") {
    return {
      status: safeString(result.status, 80) ?? "completed",
      responseObject: Boolean(result.responseObject),
      responseTopLevelKeyCount: safeCount(result.responseTopLevelKeyCount),
      responseReturned: false,
      pluginIdReturned: false,
      namesReturned: false,
      pathsReturned: false,
      urlsReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "plugin-share-checkout") {
    return {
      status: safeString(result.status, 80) ?? "completed",
      responseObject: Boolean(result.responseObject),
      responseTopLevelKeyCount: safeCount(result.responseTopLevelKeyCount),
      marketplaceNamePresent: Boolean(result.marketplaceNamePresent),
      marketplacePathPresent: Boolean(result.marketplacePathPresent),
      pluginIdPresent: Boolean(result.pluginIdPresent),
      pluginNamePresent: Boolean(result.pluginNamePresent),
      pluginPathPresent: Boolean(result.pluginPathPresent),
      remotePluginIdPresent: Boolean(result.remotePluginIdPresent),
      remoteVersionPresent: Boolean(result.remoteVersionPresent),
      remotePluginIdReturned: false,
      marketplaceNamesReturned: false,
      pluginNamesReturned: false,
      idsReturned: false,
      pathsReturned: false,
      urlsReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "plugin-content-read") {
    return {
      status: safeString(result.status, 80) ?? "completed",
      method: safeString(result.method, 100),
      skillContentPresent: Boolean(result.skillContentPresent),
      contentCharCount: safeCount(result.contentCharCount),
      contentLineCount: safeCount(result.contentLineCount),
      itemCount: safeCount(result.itemCount),
      shareUrlCount: safeCount(result.shareUrlCount),
      localPathCount: safeCount(result.localPathCount),
      installedCount: safeCount(result.installedCount),
      enabledCount: safeCount(result.enabledCount),
      contentReturned: false,
      namesReturned: false,
      idsReturned: false,
      pathsReturned: false,
      urlsReturned: false,
      descriptionsReturned: false,
      principalsReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "skills-config-write") {
    return {
      status: safeString(result.status, 80) ?? "completed",
      effectiveEnabled: Boolean(result.effectiveEnabled),
      responseReturned: false,
      namesReturned: false,
      pathsReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "skills-extra-roots-clear") {
    return {
      status: safeString(result.status, 80) ?? "cleared",
      requestedExtraRootCount: 0,
      responseObject: Boolean(result.responseObject),
      responseTopLevelKeyCount: safeCount(result.responseTopLevelKeyCount),
      extraRootsReturned: false,
      pathsReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "remote-control-disable") {
    return {
      status: safeString(result.status, 80) ?? "unknown",
      statusKnown: Boolean(result.statusKnown),
      responseObject: Boolean(result.responseObject),
      responseTopLevelKeyCount: safeCount(result.responseTopLevelKeyCount),
      paramsAcceptedFromBrowser: false,
      statusValueReturned: false,
      environmentIdReturned: false,
      installationIdReturned: false,
      serverNameReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "remote-control-client-revoke") {
    return {
      status: safeString(result.status, 80) ?? "revoked-with-redactions",
      responseObject: Boolean(result.responseObject),
      responseTopLevelKeyCount: safeCount(result.responseTopLevelKeyCount),
      clientIdReturned: false,
      environmentIdReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "environment-add") {
    return {
      status: safeString(result.status, 80) ?? "added-with-redactions",
      responseObject: Boolean(result.responseObject),
      responseTopLevelKeyCount: safeCount(result.responseTopLevelKeyCount),
      environmentIdReturned: false,
      execServerUrlReturned: false,
      urlsReturned: false,
      pathsReturned: false,
      rawPayloadReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "terminal-command") {
    return {
      status: safeString(result.status, 80) ?? "completed",
      exitCode: Number.isSafeInteger(result.exitCode) ? result.exitCode : null,
      stdoutCharCount: safeCount(result.stdoutCharCount),
      stderrCharCount: safeCount(result.stderrCharCount),
      stdoutReturned: false,
      stderrReturned: false,
      outputTextReturned: false,
      processIdReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "thread-shell-command") {
    return {
      status: safeString(result.status, 80) ?? "submitted",
      loadedSessionCount: safeCount(result.loadedSessionCount),
      outputTextReturned: false,
      terminalSessionIdentifiersReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "process-spawn") {
    return {
      status: safeString(result.status, 80) ?? "completed",
      exitCode: Number.isSafeInteger(result.exitCode) ? result.exitCode : null,
      stdoutCharCount: safeCount(result.stdoutCharCount),
      stderrCharCount: safeCount(result.stderrCharCount),
      stdoutReturned: false,
      stderrReturned: false,
      outputTextReturned: false,
      processHandleReturned: false,
      processIdReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "terminal-control") {
    return {
      status: safeString(result.status, 80) ?? "completed",
      outputTextReturned: false,
      terminalSessionIdentifiersReturned: false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "thread-start") {
    return {
      status: safeString(result.status, 80) ?? "created",
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "turn-start") {
    return {
      status: safeString(result.status, 80) ?? "started",
      fullIdsReturned: false,
      threadContentReturned: false,
      promptTextReturned: false,
    };
  }
  if (actionType === "thread-archive") {
    return {
      status: safeString(result.status, 80) ?? "completed",
      archived: Boolean(result.archived),
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "thread-delete") {
    return {
      status: safeString(result.status, 80) ?? "deleted",
      deleted: Boolean(result.deleted),
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "thread-fork") {
    return {
      status: safeString(result.status, 80) ?? "forked",
      forked: Boolean(result.forked),
      excludeTurns: result.excludeTurns !== false,
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "thread-rename") {
    return {
      status: safeString(result.status, 80) ?? "renamed",
      renamed: Boolean(result.renamed),
      nameCharCount: safeCount(result.nameCharCount),
      nameLineCount: safeCount(result.nameLineCount),
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "thread-goal-set") {
    return {
      status: safeString(result.status, 80) ?? "set",
      goalSet: Boolean(result.goalSet),
      objectiveCharCount: safeCount(result.objectiveCharCount),
      objectiveLineCount: safeCount(result.objectiveLineCount),
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "thread-goal-clear") {
    return {
      status: safeString(result.status, 80) ?? "cleared",
      goalCleared: Boolean(result.goalCleared),
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "thread-memory-mode-set") {
    return {
      status: safeString(result.status, 80) ?? "set",
      mode: safeString(result.mode, 16) === "disabled" ? "disabled" : "enabled",
      memoryModeSet: Boolean(result.memoryModeSet),
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "thread-rollback") {
    return {
      status: safeString(result.status, 80) ?? "rolled-back",
      rolledBack: Boolean(result.rolledBack),
      numTurns: safeCount(result.numTurns),
      returnedTurnCount: safeCount(result.returnedTurnCount),
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "thread-safety-lock") {
    return {
      status: safeString(result.status, 80) ?? "safety-locked",
      locked: Boolean(result.locked),
      responseObject: Boolean(result.responseObject),
      responseTopLevelKeyCount: safeCount(result.responseTopLevelKeyCount),
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "thread-compact") {
    return {
      status: safeString(result.status, 80) ?? "compact-started",
      loadedSessionCount: safeCount(result.loadedSessionCount),
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "live-session-bulk-control") {
    return {
      status: safeString(result.status, 80) ?? "completed",
      loadedSessionCount: safeCount(result.loadedSessionCount),
      attemptedSessionCount: safeCount(result.attemptedSessionCount),
      succeededSessionCount: safeCount(result.succeededSessionCount),
      failedSessionCount: safeCount(result.failedSessionCount),
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  if (actionType === "file-action") {
    return {
      status: safeString(result.status, 80) ?? "completed",
      fullIdsReturned: false,
      threadContentReturned: false,
    };
  }
  return {
    status: safeString(result.status, 80),
    loadedSessionCount: safeCount(result.loadedSessionCount),
    fullIdsReturned: false,
    threadContentReturned: false,
  };
}

function sanitizeFilesystem(filesystem, actionType) {
  if (actionType !== "file-action") {
    return null;
  }
  return {
    wroteFile: Boolean(filesystem.wroteFile),
    removed: Boolean(filesystem.removed),
    copied: Boolean(filesystem.copied),
    createdDirectory: Boolean(filesystem.createdDirectory),
    pathsReturned: false,
    fileContentsReturned: false,
  };
}

function ensureAppendableNoFollow(path) {
  const directory = dirname(path);
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const directoryStat = lstatSync(directory);
  if (!directoryStat.isDirectory() || directoryStat.isSymbolicLink()) {
    throw new Error("Action audit log directory is unsafe");
  }
  const fd = openSync(
    path,
    constants.O_APPEND | constants.O_CREAT | constants.O_WRONLY | noFollowFlag(),
    0o600,
  );
  closeSync(fd);
}

function appendLineNoFollow(path, line) {
  const directory = dirname(path);
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const directoryStat = lstatSync(directory);
  if (!directoryStat.isDirectory() || directoryStat.isSymbolicLink()) {
    throw new Error("Action audit log directory is unsafe");
  }
  const fd = openSync(
    path,
    constants.O_APPEND | constants.O_CREAT | constants.O_WRONLY | noFollowFlag(),
    0o600,
  );
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

function sanitizeMethodList(methods) {
  if (!Array.isArray(methods)) {
    return [];
  }
  return methods
    .map((method) => safeString(method, 100))
    .filter(Boolean)
    .slice(0, 12);
}

function safeCreditsNudgeType(value) {
  const clean = safeString(value, 16);
  return clean === "credits" || clean === "usage_limit" ? clean : "credits";
}

function safeCreditsNudgeStatus(value) {
  const clean = safeString(value, 32);
  return clean === "sent" || clean === "cooldown_active" ? clean : "unknown";
}

function safeRateLimitResetCreditOutcome(value) {
  const clean = safeString(value, 32);
  return ["reset", "nothingToReset", "noCredit", "alreadyRedeemed"].includes(clean)
    ? clean
    : "unknown";
}

function sanitizeActionType(value) {
  return [
    "account-login-cancel",
    "account-credits-nudge",
    "account-login",
    "account-logout",
    "account-reset-credit-consume",
    "config-batch-write",
    "config-value-write",
    "environment-add",
    "experimental-feature-set",
    "file-action",
    "live-session-bulk-control",
    "live-session-control",
    "mcp-server-reload",
    "mcp-tool-call",
    "mcp-resource-read",
    "mcp-oauth-login",
    "plugin-content-read",
    "plugin-read",
    "plugin-share-checkout",
    "plugin-uninstall",
    "process-spawn",
    "remote-control-client-revoke",
    "remote-control-disable",
    "skills-config-write",
    "skills-extra-roots-clear",
    "terminal-control",
    "terminal-background-clean",
    "terminal-background-terminate",
    "terminal-command",
    "thread-shell-command",
    "thread-archive",
    "thread-compact",
    "thread-delete",
    "thread-fork",
    "thread-goal-set",
    "thread-goal-clear",
    "thread-memory-mode-set",
    "thread-rename",
    "thread-rollback",
    "thread-safety-lock",
    "thread-start",
    "turn-start",
  ].includes(value)
    ? value
    : "live-session-control";
}

function sanitizeFileAction(value) {
  return ["copy", "createDirectory", "remove", "writeFile"].includes(value) ? value : "writeFile";
}

function fileActionMethod(action) {
  switch (action) {
    case "copy":
      return "fs/copy";
    case "createDirectory":
      return "fs/mkdir";
    case "remove":
      return "fs/remove";
    default:
      return "fs/writeFile";
  }
}

function sanitizeLiveSessionControlAction(value) {
  return ["interrupt", "unsubscribe", "steer"].includes(value) ? value : "interrupt";
}

function sanitizeTerminalControlAction(value) {
  return ["write", "resize", "terminate"].includes(value) ? value : "terminate";
}

function sanitizeThreadArchiveAction(value) {
  return value === "unarchive" ? "unarchive" : "archive";
}

function liveSessionControlMethod(action) {
  switch (action) {
    case "unsubscribe":
      return "thread/unsubscribe";
    case "steer":
      return "turn/steer";
    default:
      return "turn/interrupt";
  }
}

function terminalControlMethod(action) {
  switch (action) {
    case "write":
      return "command/exec/write";
    case "resize":
      return "command/exec/resize";
    default:
      return "command/exec/terminate";
  }
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

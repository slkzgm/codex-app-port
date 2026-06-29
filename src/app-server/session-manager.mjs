import { randomBytes, timingSafeEqual } from "node:crypto";

import {
  buildApprovalDecisionResponse,
  buildDenyOnlyApprovalResponse,
  summarizeApprovalRequestDetail,
  summarizeApprovalRequest,
} from "./approval-policy.mjs";
import { JsonlRpcClient } from "./jsonl-rpc.mjs";
import {
  APP_SERVER_METHODS,
  normalizeInitializeResponse,
  normalizeNotification,
  normalizeThreadListResponse,
  normalizeThreadReadResponse,
  normalizeTurnStartResponse,
} from "./protocol.mjs";
import {
  DEFAULT_LOADED_SESSION_LIMIT,
  DEFAULT_STEER_PROMPT_LIMIT,
  DEFAULT_THREAD_DETAIL_SCAN_LIMIT,
  DEFAULT_TIMEOUT_MS,
  DEFAULT_TURN_EVENT_LOG_LIMIT,
  notificationCounts,
  sanitizeNotification,
  summarizeInitialize,
  summarizeLoadedSessions,
} from "./probe.mjs";

const CLIENT_INFO = Object.freeze({
  name: "codex_app_port",
  title: "Codex App Port",
  version: "0.1.0",
});

const DEFAULT_CODEX_ARGS = ["app-server", "--listen", "stdio://"];
const MAX_MANAGER_NOTIFICATION_RECORDS = 500;
const DEFAULT_APPROVAL_DECISION_TIMEOUT_MS = 30_000;
const APPROVAL_DECISION_TOKEN_BYTES = 16;
const DEFAULT_TERMINAL_INPUT_LIMIT = 2_000;
const DEFAULT_TERMINAL_SESSION_SELECTOR_LIMIT = 80;
const DEFAULT_TERMINAL_DIMENSION_LIMIT = 500;
const DEFAULT_THREAD_SHELL_COMMAND_LIMIT = 2_000;

export function createAppServerSessionManager({
  codexBin = process.env.CODEX_BIN || "codex",
  codexArgs = DEFAULT_CODEX_ARGS,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  clientFactory = (options) => new JsonlRpcClient(options),
  approvalForwardingEnabled = process.env.CODEX_APP_PORT_ALLOW_APPROVAL_FORWARDING === "1",
  approvalDecisionTimeoutMs = DEFAULT_APPROVAL_DECISION_TIMEOUT_MS,
  approvalAuditLog = null,
  now = () => new Date().toISOString(),
  randomDecisionToken = () => randomBytes(APPROVAL_DECISION_TOKEN_BYTES).toString("hex"),
} = {}) {
  const sessions = new Map();

  return {
    async startTurn({ workspace, cwd, threadIdSuffix, prompt, timeoutMs: requestTimeoutMs } = {}) {
      return workspaceSession(workspace, cwd).startTurn({
        workspace,
        threadIdSuffix,
        prompt,
        timeoutMs: requestTimeoutMs ?? timeoutMs,
      });
    },
    async listLoadedSessions({ workspace, cwd, limit = DEFAULT_LOADED_SESSION_LIMIT, timeoutMs: requestTimeoutMs } = {}) {
      return workspaceSession(workspace, cwd).listLoadedSessions({
        limit,
        timeoutMs: requestTimeoutMs ?? timeoutMs,
      });
    },
    async controlLiveSession({
      workspace,
      cwd,
      action,
      threadIdSuffix,
      turnIdSuffix = null,
      prompt = null,
      timeoutMs: requestTimeoutMs,
    } = {}) {
      return workspaceSession(workspace, cwd).controlLiveSession({
        action,
        threadIdSuffix,
        turnIdSuffix,
        prompt,
        timeoutMs: requestTimeoutMs ?? timeoutMs,
      });
    },
    async bulkControlLiveSessions({
      workspace,
      cwd,
      action,
      limit = DEFAULT_LOADED_SESSION_LIMIT,
      timeoutMs: requestTimeoutMs,
    } = {}) {
      return workspaceSession(workspace, cwd).bulkControlLiveSessions({
        action,
        limit,
        timeoutMs: requestTimeoutMs ?? timeoutMs,
      });
    },
    async cleanBackgroundTerminals({
      workspace,
      cwd,
      threadIdSuffix,
      timeoutMs: requestTimeoutMs,
    } = {}) {
      return workspaceSession(workspace, cwd).cleanBackgroundTerminals({
        threadIdSuffix,
        timeoutMs: requestTimeoutMs ?? timeoutMs,
      });
    },
    async listBackgroundTerminals({
      workspace,
      cwd,
      threadIdSuffix,
      limit,
      timeoutMs: requestTimeoutMs,
    } = {}) {
      return workspaceSession(workspace, cwd).listBackgroundTerminals({
        threadIdSuffix,
        limit,
        timeoutMs: requestTimeoutMs ?? timeoutMs,
      });
    },
    async terminateBackgroundTerminal({
      workspace,
      cwd,
      threadIdSuffix,
      processId,
      timeoutMs: requestTimeoutMs,
    } = {}) {
      return workspaceSession(workspace, cwd).terminateBackgroundTerminal({
        threadIdSuffix,
        processId,
        timeoutMs: requestTimeoutMs ?? timeoutMs,
      });
    },
    async runThreadShellCommand({
      workspace,
      cwd,
      threadIdSuffix,
      command,
      timeoutMs: requestTimeoutMs,
    } = {}) {
      return workspaceSession(workspace, cwd).runThreadShellCommand({
        threadIdSuffix,
        command,
        timeoutMs: requestTimeoutMs ?? timeoutMs,
      });
    },
    async controlTerminalSession({
      workspace,
      cwd,
      terminalAction,
      method,
      session,
      input,
      rows,
      cols,
      timeoutMs: requestTimeoutMs,
    } = {}) {
      return workspaceSession(workspace, cwd).controlTerminalSession({
        terminalAction,
        method,
        session,
        input,
        rows,
        cols,
        timeoutMs: requestTimeoutMs ?? timeoutMs,
      });
    },
    async compactThread({
      workspace,
      cwd,
      threadIdSuffix,
      timeoutMs: requestTimeoutMs,
    } = {}) {
      return workspaceSession(workspace, cwd).compactThread({
        threadIdSuffix,
        timeoutMs: requestTimeoutMs ?? timeoutMs,
      });
    },
    listApprovalRequests({ workspace, cwd, includeDetails = false } = {}) {
      return workspaceSession(workspace, cwd).listApprovalRequests({ includeDetails });
    },
    recordApprovalDecision({
      workspace,
      cwd,
      sessionId,
      requestKey,
      decision,
      decisionToken,
      allowApprove = false,
    } = {}) {
      return workspaceSession(workspace, cwd).recordApprovalDecision({
        sessionId,
        requestKey,
        decision,
        decisionToken,
        allowApprove,
      });
    },
    describeWorkspace({ workspace, cwd } = {}) {
      const key = sessionKey(workspace, cwd);
      const session = key ? sessions.get(key) : null;
      if (!session) {
        return {
          enabled: true,
          persistentClient: true,
          state: "idle",
          workspace: sanitizeWorkspaceForRecord(workspace),
          clientStarted: false,
          starting: false,
          activeTurn: null,
          pendingApprovalCount: 0,
          resolvedApprovalCount: 0,
          notificationCount: 0,
          approvalForwardingEnabled,
          promptTextReturned: false,
          fullIdsReturned: false,
          pathsReturned: false,
          decisionTokensReturned: false,
          rawEventsReturned: false,
        };
      }
      return session.describe({ workspace });
    },
    async closeAll() {
      const openSessions = Array.from(sessions.values());
      sessions.clear();
      await Promise.all(openSessions.map((session) => session.close()));
    },
  };

  function workspaceSession(workspace, cwd) {
    const workspaceCwd = workspace?.cwd ?? cwd;
    if (typeof workspaceCwd !== "string" || workspaceCwd.length === 0) {
      throwRequestError("Workspace cwd is required for app-server session manager", 500);
    }
    const key = sessionKey(workspace, workspaceCwd);
    let session = sessions.get(key);
    if (!session) {
      session = new ManagedWorkspaceSession({
        codexBin,
        codexArgs,
        cwd: workspaceCwd,
        timeoutMs,
        clientFactory,
        approvalForwardingEnabled,
        approvalDecisionTimeoutMs,
        approvalAuditLog,
        now,
        randomDecisionToken,
      });
      sessions.set(key, session);
    }
    return session;
  }
}

class ManagedWorkspaceSession {
  constructor({
    codexBin,
    codexArgs,
    cwd,
    timeoutMs,
    clientFactory,
    approvalForwardingEnabled,
    approvalDecisionTimeoutMs,
    approvalAuditLog,
    now,
    randomDecisionToken,
  }) {
    this.codexBin = codexBin;
    this.codexArgs = codexArgs;
    this.cwd = cwd;
    this.timeoutMs = timeoutMs;
    this.clientFactory = clientFactory;
    this.approvalForwardingEnabled = Boolean(approvalForwardingEnabled);
    this.approvalDecisionTimeoutMs = approvalDecisionTimeoutMs;
    this.approvalAuditLog = approvalAuditLog;
    this.now = now;
    this.randomDecisionToken = randomDecisionToken;
    this.client = null;
    this.initialize = null;
    this.notifications = [];
    this.activeTurn = null;
    this.starting = null;
    this.pendingApprovals = new Map();
    this.resolvedApprovals = new Set();
    this.nextApprovalIndex = 1;
  }

  async startTurn({ workspace, threadIdSuffix, prompt, timeoutMs }) {
    validateSuffix(threadIdSuffix, "Thread selector");
    const safePrompt = validatePrompt(prompt);
    await this.ensureStarted();

    if (this.activeTurn) {
      throwRequestError("A managed turn is already active for this workspace", 409);
    }

    const threads = normalizeThreadListResponse(
      await this.client.request(
        APP_SERVER_METHODS.threadList,
        {
          limit: DEFAULT_THREAD_DETAIL_SCAN_LIMIT,
          archived: false,
          useStateDbOnly: true,
        },
        { timeoutMs },
      ),
    );
    const thread = selectThreadBySuffix(threads.data, threadIdSuffix);
    const activeTurn = {
      sessionId: `managed-${randomBytes(4).toString("hex")}`,
      workspace: sanitizeWorkspaceForRecord(workspace),
      threadId: thread.id,
      turnId: null,
      events: [],
      approvalRequests: [],
    };
    this.activeTurn = activeTurn;

    try {
      const turnStart = normalizeTurnStartResponse(
        await this.client.request(
          APP_SERVER_METHODS.turnStart,
          {
            threadId: thread.id,
            input: [
              {
                type: "text",
                text: safePrompt,
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

      activeTurn.turnId = turnStart.turn?.id ?? null;
      let completed = null;
      if (activeTurn.turnId) {
        completed = normalizeNotification(
          await this.client.waitForNotification(
            (notification) =>
              notification.method === "turn/completed" &&
              notification.params?.threadId === activeTurn.threadId &&
              notificationTurnId(notification) === activeTurn.turnId,
            { timeoutMs },
          ),
        );
      }

      return this.payload({
        turnStart: {
          threadIdSuffix: suffix(activeTurn.threadId),
          turnIdSuffix: suffix(activeTurn.turnId),
          completedStatus:
            statusFromParams(completed?.params ?? {}) ?? turnStart.turn?.status ?? null,
          approvalRequestCount: activeTurn.approvalRequests.length,
          deniedApprovalCount: activeTurn.approvalRequests.filter((request) => request.handled).length,
          unsupportedApprovalCount: activeTurn.approvalRequests.filter((request) => !request.handled).length,
          approvalRequests: activeTurn.approvalRequests,
          eventCount: activeTurn.events.length,
          returnedEventCount: activeTurn.events.length,
          events: activeTurn.events,
        },
      });
    } finally {
      this.resolvePendingApprovalsForActiveTurn();
      this.activeTurn = null;
    }
  }

  async listLoadedSessions({ limit, timeoutMs }) {
    await this.ensureStarted();
    const loadedSessions = await this.client.request(
      APP_SERVER_METHODS.threadLoadedList,
      { limit },
      { timeoutMs },
    );
    return this.payload({
      loadedSessions: summarizeLoadedSessions(loadedSessions, { limit }),
    });
  }

  async controlLiveSession({ action, threadIdSuffix, turnIdSuffix, prompt, timeoutMs }) {
    validateLiveSessionAction(action);
    validateSuffix(threadIdSuffix, "Thread selector");
    if (action === "interrupt" || action === "steer") {
      validateSuffix(turnIdSuffix, "Turn selector");
    }
    const steerPrompt = action === "steer" ? validatePrompt(prompt) : null;
    const methodsUsed = [];

    await this.ensureStarted();
    const loadedSessions = await this.client.request(
      APP_SERVER_METHODS.threadLoadedList,
      { limit: DEFAULT_LOADED_SESSION_LIMIT },
      { timeoutMs },
    );
    methodsUsed.push(APP_SERVER_METHODS.threadLoadedList);
    const threadId = selectLoadedThreadIdBySuffix(loadedSessions, threadIdSuffix);
    const loadedSessionCount = Array.isArray(loadedSessions?.data) ? loadedSessions.data.length : 0;

    let turnId = null;
    let resultStatus = null;
    if (action === "interrupt" || action === "steer") {
      const detail = normalizeThreadReadResponse(
        await this.client.request(
          APP_SERVER_METHODS.threadRead,
          { threadId, includeTurns: true },
          { timeoutMs },
        ),
      );
      methodsUsed.push(APP_SERVER_METHODS.threadRead);
      turnId = selectTurnIdBySuffix(detail.thread?.turns, turnIdSuffix);
    }

    let responseTurnId = null;
    if (action === "interrupt") {
      await this.client.request(
        APP_SERVER_METHODS.turnInterrupt,
        { threadId, turnId },
        { timeoutMs },
      );
      methodsUsed.push(APP_SERVER_METHODS.turnInterrupt);
      resultStatus = "interrupt-requested";
    } else if (action === "steer") {
      const result = await this.client.request(
        APP_SERVER_METHODS.turnSteer,
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
      methodsUsed.push(APP_SERVER_METHODS.turnSteer);
      responseTurnId = typeof result?.turnId === "string" ? result.turnId : null;
      resultStatus = "steer-submitted";
    } else {
      const result = await this.client.request(
        APP_SERVER_METHODS.threadUnsubscribe,
        { threadId },
        { timeoutMs },
      );
      methodsUsed.push(APP_SERVER_METHODS.threadUnsubscribe);
      resultStatus = typeof result?.status === "string" ? result.status : "unknown";
    }

    return this.payload({
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
    });
  }

  async bulkControlLiveSessions({ action, limit = DEFAULT_LOADED_SESSION_LIMIT, timeoutMs }) {
    validateLiveSessionBulkAction(action);
    const methodsUsed = [];

    await this.ensureStarted();
    const loadedSessions = await this.client.request(
      APP_SERVER_METHODS.threadLoadedList,
      { limit },
      { timeoutMs },
    );
    methodsUsed.push(APP_SERVER_METHODS.threadLoadedList);
    const threadIds = Array.isArray(loadedSessions?.data)
      ? loadedSessions.data.filter((threadId) => typeof threadId === "string").slice(0, limit)
      : [];

    let succeededSessionCount = 0;
    let failedSessionCount = 0;
    if (threadIds.length > 0) {
      methodsUsed.push(APP_SERVER_METHODS.threadUnsubscribe);
    }
    for (const threadId of threadIds) {
      try {
        await this.client.request(APP_SERVER_METHODS.threadUnsubscribe, { threadId }, { timeoutMs });
        succeededSessionCount += 1;
      } catch {
        failedSessionCount += 1;
      }
    }

    return this.payload({
      liveSessionBulkControl: {
        action,
        method: APP_SERVER_METHODS.threadUnsubscribe,
        resultStatus: failedSessionCount > 0 ? "partial" : "completed",
        loadedSessionCount: threadIds.length,
        attemptedSessionCount: threadIds.length,
        succeededSessionCount,
        failedSessionCount,
        methodsUsed,
        promptTextReturned: false,
        fullIdsReturned: false,
        threadContentReturned: false,
      },
    });
  }

  async cleanBackgroundTerminals({ threadIdSuffix, timeoutMs }) {
    validateSuffix(threadIdSuffix, "Thread selector");
    const methodsUsed = [];

    await this.ensureStarted();
    const loadedSessions = await this.client.request(
      APP_SERVER_METHODS.threadLoadedList,
      { limit: DEFAULT_LOADED_SESSION_LIMIT },
      { timeoutMs },
    );
    methodsUsed.push(APP_SERVER_METHODS.threadLoadedList);
    const threadId = selectLoadedThreadIdBySuffix(loadedSessions, threadIdSuffix);
    const loadedSessionCount = Array.isArray(loadedSessions?.data) ? loadedSessions.data.length : 0;

    await this.client.request(
      APP_SERVER_METHODS.threadBackgroundTerminalsClean,
      { threadId },
      { timeoutMs },
    );
    methodsUsed.push(APP_SERVER_METHODS.threadBackgroundTerminalsClean);

    return this.payload({
      terminalBackgroundClean: {
        method: APP_SERVER_METHODS.threadBackgroundTerminalsClean,
        threadIdSuffix: suffix(threadId),
        resultStatus: "clean-requested",
        loadedSessionCount,
        methodsUsed,
        promptTextReturned: false,
        outputTextReturned: false,
        fullIdsReturned: false,
        threadContentReturned: false,
      },
    });
  }

  async listBackgroundTerminals({ threadIdSuffix, limit = DEFAULT_LOADED_SESSION_LIMIT, timeoutMs }) {
    validateSuffix(threadIdSuffix, "Thread selector");
    const safeLimit = Number.isSafeInteger(limit)
      ? Math.max(0, Math.min(limit, DEFAULT_LOADED_SESSION_LIMIT))
      : DEFAULT_LOADED_SESSION_LIMIT;
    const methodsUsed = [];

    await this.ensureStarted();
    const loadedSessions = await this.client.request(
      APP_SERVER_METHODS.threadLoadedList,
      { limit: DEFAULT_LOADED_SESSION_LIMIT },
      { timeoutMs },
    );
    methodsUsed.push(APP_SERVER_METHODS.threadLoadedList);
    const threadId = selectLoadedThreadIdBySuffix(loadedSessions, threadIdSuffix);
    const loadedSessionCount = Array.isArray(loadedSessions?.data) ? loadedSessions.data.length : 0;

    const terminalList = await this.client.request(
      APP_SERVER_METHODS.threadBackgroundTerminalsList,
      { threadId, limit: safeLimit, cursor: null },
      { timeoutMs },
    );
    methodsUsed.push(APP_SERVER_METHODS.threadBackgroundTerminalsList);
    const terminals = Array.isArray(terminalList?.data) ? terminalList.data : [];

    return this.payload({
      terminalBackgroundList: {
        method: APP_SERVER_METHODS.threadBackgroundTerminalsList,
        threadIdSuffix: suffix(threadId),
        resultStatus: "listed",
        loadedSessionCount,
        terminalCount: terminals.length,
        hasNextPage: Boolean(terminalList?.nextCursor),
        terminals: terminals.map((terminal) => ({
          processId: typeof terminal?.processId === "string" ? terminal.processId : "",
          itemIdPresent: typeof terminal?.itemId === "string" && terminal.itemId.length > 0,
          commandPresent: typeof terminal?.command === "string" && terminal.command.length > 0,
          cwdPresent: typeof terminal?.cwd === "string" && terminal.cwd.length > 0,
          osPidPresent: terminal?.osPid !== null && terminal?.osPid !== undefined,
          cpuPercentPresent: terminal?.cpuPercent !== null && terminal?.cpuPercent !== undefined,
          rssKbPresent: terminal?.rssKb !== null && terminal?.rssKb !== undefined,
        })),
        methodsUsed,
        promptTextReturned: false,
        outputTextReturned: false,
        commandTextReturned: false,
        cwdReturned: false,
        pathsReturned: false,
        fullIdsReturned: false,
        itemIdsReturned: false,
        processIdsReturned: false,
        osPidsReturned: false,
        threadContentReturned: false,
        rawPayloadReturned: false,
      },
    });
  }

  async terminateBackgroundTerminal({ threadIdSuffix, processId, timeoutMs }) {
    validateSuffix(threadIdSuffix, "Thread selector");
    if (typeof processId !== "string" || processId.length === 0) {
      throw new Error("Background terminal process selector is unavailable");
    }
    const methodsUsed = [];

    await this.ensureStarted();
    const loadedSessions = await this.client.request(
      APP_SERVER_METHODS.threadLoadedList,
      { limit: DEFAULT_LOADED_SESSION_LIMIT },
      { timeoutMs },
    );
    methodsUsed.push(APP_SERVER_METHODS.threadLoadedList);
    const threadId = selectLoadedThreadIdBySuffix(loadedSessions, threadIdSuffix);
    const loadedSessionCount = Array.isArray(loadedSessions?.data) ? loadedSessions.data.length : 0;

    const result = await this.client.request(
      APP_SERVER_METHODS.threadBackgroundTerminalsTerminate,
      { threadId, processId },
      { timeoutMs },
    );
    methodsUsed.push(APP_SERVER_METHODS.threadBackgroundTerminalsTerminate);

    return this.payload({
      terminalBackgroundTerminate: {
        method: APP_SERVER_METHODS.threadBackgroundTerminalsTerminate,
        threadIdSuffix: suffix(threadId),
        resultStatus: result?.terminated === true ? "terminated" : "not-terminated",
        loadedSessionCount,
        terminated: result?.terminated === true,
        methodsUsed,
        promptTextReturned: false,
        outputTextReturned: false,
        commandTextReturned: false,
        cwdReturned: false,
        pathsReturned: false,
        fullIdsReturned: false,
        itemIdsReturned: false,
        processIdsReturned: false,
        osPidsReturned: false,
        threadContentReturned: false,
        rawPayloadReturned: false,
      },
    });
  }

  async runThreadShellCommand({ threadIdSuffix, command, timeoutMs }) {
    validateSuffix(threadIdSuffix, "Thread selector");
    const safeCommand = validateThreadShellCommand(command);
    const methodsUsed = [];

    await this.ensureStarted();
    const loadedSessions = await this.client.request(
      APP_SERVER_METHODS.threadLoadedList,
      { limit: DEFAULT_LOADED_SESSION_LIMIT },
      { timeoutMs },
    );
    methodsUsed.push(APP_SERVER_METHODS.threadLoadedList);
    const threadId = selectLoadedThreadIdBySuffix(loadedSessions, threadIdSuffix);
    const loadedSessionCount = Array.isArray(loadedSessions?.data) ? loadedSessions.data.length : 0;

    await this.client.request(
      APP_SERVER_METHODS.threadShellCommand,
      { threadId, command: safeCommand },
      { timeoutMs },
    );
    methodsUsed.push(APP_SERVER_METHODS.threadShellCommand);

    return this.payload({
      threadShellCommand: {
        method: APP_SERVER_METHODS.threadShellCommand,
        threadIdSuffix: suffix(threadId),
        resultStatus: "submitted",
        loadedSessionCount,
        methodsUsed,
        commandCharCount: safeCommand.length,
        commandLineCount: 1,
        commandTextReturned: false,
        outputTextReturned: false,
        terminalSessionIdentifierReturned: false,
        fullIdsReturned: false,
        threadContentReturned: false,
      },
    });
  }

  async controlTerminalSession({
    terminalAction,
    method,
    session,
    input,
    rows,
    cols,
    timeoutMs,
  }) {
    validateTerminalControlAction(terminalAction);
    validateTerminalControlMethod(method, terminalAction);
    const sessionSelector = validateTerminalSessionSelector(session);
    const writeInput =
      terminalAction === "write" ? validateTerminalInput(input) : validateNoTerminalInput(input);
    const resize =
      terminalAction === "resize"
        ? {
            rows: validateTerminalDimension(rows, "Rows"),
            cols: validateTerminalDimension(cols, "Columns"),
          }
        : validateNoTerminalDimensions(rows, cols);

    await this.ensureStarted();
    const params = terminalControlParams({
      terminalAction,
      method,
      session: sessionSelector.value,
      input: writeInput,
      resize,
    });
    await this.client.request(method, params, { timeoutMs });

    return this.payload({
      terminalControl: {
        terminalAction,
        method,
        resultStatus: "completed",
        sessionSelectorCharCount: sessionSelector.charCount,
        inputCharCount: writeInput?.length ?? 0,
        inputLineCount: writeInput ? writeInput.split(/\r\n|\r|\n/).length : 0,
        rows: resize?.rows ?? null,
        cols: resize?.cols ?? null,
        methodsUsed: [method],
        inputTextReturned: false,
        outputTextReturned: false,
        sessionIdentifierReturned: false,
      },
    });
  }

  async compactThread({ threadIdSuffix, timeoutMs }) {
    validateSuffix(threadIdSuffix, "Thread selector");
    const methodsUsed = [];

    await this.ensureStarted();
    const loadedSessions = await this.client.request(
      APP_SERVER_METHODS.threadLoadedList,
      { limit: DEFAULT_LOADED_SESSION_LIMIT },
      { timeoutMs },
    );
    methodsUsed.push(APP_SERVER_METHODS.threadLoadedList);
    const threadId = selectLoadedThreadIdBySuffix(loadedSessions, threadIdSuffix);
    const loadedSessionCount = Array.isArray(loadedSessions?.data) ? loadedSessions.data.length : 0;

    await this.client.request(
      APP_SERVER_METHODS.threadCompactStart,
      { threadId },
      { timeoutMs },
    );
    methodsUsed.push(APP_SERVER_METHODS.threadCompactStart);

    return this.payload({
      threadCompact: {
        method: APP_SERVER_METHODS.threadCompactStart,
        threadIdSuffix: suffix(threadId),
        resultStatus: "compact-started",
        loadedSessionCount,
        methodsUsed,
        modelTraffic: true,
        promptTextReturned: false,
        threadContentReturned: false,
        fullIdsReturned: false,
        cwdReturned: false,
        pathsReturned: false,
      },
    });
  }

  async close() {
    if (!this.client) {
      return;
    }
    const client = this.client;
    this.client = null;
    this.initialize = null;
    this.activeTurn = null;
    this.starting = null;
    this.rejectPendingApprovals();
    await client.close();
  }

  describe({ workspace } = {}) {
    const activeTurn = this.activeTurn
      ? {
          sessionIdSuffix: suffix(this.activeTurn.sessionId),
          threadIdSuffix: suffix(this.activeTurn.threadId),
          turnIdSuffix: suffix(this.activeTurn.turnId),
          eventCount: Array.isArray(this.activeTurn.events) ? this.activeTurn.events.length : 0,
          approvalRequestCount: Array.isArray(this.activeTurn.approvalRequests)
            ? this.activeTurn.approvalRequests.length
            : 0,
          promptTextReturned: false,
          fullIdsReturned: false,
          pathsReturned: false,
          rawEventsReturned: false,
        }
      : null;
    const state = activeTurn
      ? "active-turn"
      : this.pendingApprovals.size > 0
        ? "pending-approval"
        : this.client
          ? "idle"
          : this.starting
            ? "starting"
            : "created";
    return {
      enabled: true,
      persistentClient: true,
      state,
      workspace: sanitizeWorkspaceForRecord(workspace),
      clientStarted: Boolean(this.client),
      starting: Boolean(this.starting),
      activeTurn,
      pendingApprovalCount: this.pendingApprovals.size,
      resolvedApprovalCount: this.resolvedApprovals.size,
      notificationCount: this.notifications.length,
      approvalForwardingEnabled: this.approvalForwardingEnabled,
      promptTextReturned: false,
      fullIdsReturned: false,
      pathsReturned: false,
      decisionTokensReturned: false,
      rawEventsReturned: false,
    };
  }

  listApprovalRequests({ includeDetails = false } = {}) {
    return Array.from(this.pendingApprovals.values()).map((entry) => {
      const record = clone(entry.record);
      if (includeDetails) {
        record.request.approvalDetail = summarizeApprovalRequestDetail(entry.message);
      }
      return record;
    });
  }

  recordApprovalDecision({ sessionId, requestKey, decision, decisionToken, allowApprove = false }) {
    const key = approvalRecordKey(sessionId, requestKey);
    if (this.resolvedApprovals.has(key)) {
      throwRequestError("Approval decision already recorded", 409);
    }
    const entry = this.pendingApprovals.get(key);
    if (!entry) {
      throwRequestError("Unknown pending approval request", 404);
    }
    if (!approvalTokensEqual(entry.record.request.decisionToken, decisionToken)) {
      throwRequestError("Invalid approval decision token", 403);
    }
    const safeDecisions = new Set(entry.record.request.safeDenyDecisions);
    const safeApproveDecisions = new Set(entry.record.request.safeApproveDecisions);
    const wantsApprove = safeApproveDecisions.has(decision);
    if (!safeDecisions.has(decision) && !wantsApprove) {
      throwRequestError("Unsupported approval decision", 400);
    }
    if (wantsApprove && !allowApprove) {
      throwRequestError("Approval accept decisions are disabled", 403);
    }

    const approval = buildApprovalDecisionResponse(entry.message, { decision });
    if (!approval.handled || !approval.response) {
      throwRequestError("Unsupported approval decision", 400);
    }
    const browserDecision = {
      decision: approval.response?.decision ?? decision,
      recordedAt: this.now(),
      forwarded: true,
      appServerTouched: true,
      auditLogged: false,
      reason: approval.reason,
    };
    const auditRecord = {
      event: "approval-decision-recorded",
      sessionId: entry.record.sessionId,
      workspace: entry.record.workspace,
      target: entry.record.target,
      request: entry.record.request,
      browserDecision,
    };
    if (hasRecordedApprovalDecision(this.approvalAuditLog, auditRecord)) {
      writeApprovalAuditLog(this.approvalAuditLog, {
        ...auditRecord,
        event: "approval-decision-replay-rejected",
      });
      throwRequestError("Approval decision already recorded in audit log", 409);
    }
    browserDecision.auditLogged = writeApprovalAuditLog(this.approvalAuditLog, auditRecord);

    clearTimeout(entry.timer);
    this.pendingApprovals.delete(key);
    this.resolvedApprovals.add(key);
    entry.record.request.handled = true;
    entry.record.request.decision = browserDecision.decision;
    delete entry.record.request.decisionToken;
    entry.record.browserDecision = browserDecision;
    entry.resolve(approval.response);
    return clone(entry.record);
  }

  async ensureStarted() {
    if (this.client && this.initialize) {
      return;
    }
    if (this.starting) {
      await this.starting;
      return;
    }
    this.starting = this.start();
    try {
      await this.starting;
    } finally {
      this.starting = null;
    }
  }

  async start() {
    const client = this.clientFactory({
      command: this.codexBin,
      args: this.codexArgs,
      cwd: this.cwd,
      timeoutMs: this.timeoutMs,
      onNotification: (notification) => this.handleNotification(notification),
      onServerRequest: (message) => this.handleServerRequest(message),
    });
    await client.start();
    const initialize = normalizeInitializeResponse(
      await client.request(APP_SERVER_METHODS.initialize, {
        clientInfo: CLIENT_INFO,
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      }),
    );
    client.notify(APP_SERVER_METHODS.initialized);
    this.client = client;
    this.initialize = summarizeInitialize(initialize);
  }

  handleNotification(notification) {
    this.notifications.push({ method: notification.method });
    if (this.notifications.length > MAX_MANAGER_NOTIFICATION_RECORDS) {
      this.notifications.splice(0, this.notifications.length - MAX_MANAGER_NOTIFICATION_RECORDS);
    }

    if (!this.activeTurn) {
      return;
    }
    this.activeTurn.events.push(
      sanitizeNotification(notification, {
        threadId: this.activeTurn.threadId,
        turnId: this.activeTurn.turnId,
      }),
    );
    if (this.activeTurn.events.length > DEFAULT_TURN_EVENT_LOG_LIMIT) {
      this.activeTurn.events.splice(
        0,
        this.activeTurn.events.length - DEFAULT_TURN_EVENT_LOG_LIMIT,
      );
    }
  }

  handleServerRequest(message) {
    const summary = summarizeApprovalRequest(message);
    const denial = buildDenyOnlyApprovalResponse(message, { interrupt: true });
    if (this.activeTurn) {
      const request = {
        ...summary,
        handled: denial.handled,
        decision: denial.response?.decision ?? denial.decision ?? null,
      };
      if (this.approvalForwardingEnabled && denial.handled) {
        request.handled = false;
        request.decision = null;
        return this.waitForBrowserDenyDecision(message, request);
      }
      this.activeTurn.approvalRequests.push(request);
    }
    if (!denial.handled) {
      throw new Error(denial.reason || "unsupported approval request");
    }
    return denial.response;
  }

  waitForBrowserDenyDecision(message, request) {
    const activeTurn = this.activeTurn;
    const requestKey = approvalRequestKey(request, this.nextApprovalIndex);
    this.nextApprovalIndex += 1;
    const pendingRequest = {
      ...request,
      requestKey,
      decisionToken: safeDecisionToken(this.randomDecisionToken()),
      handled: false,
      decision: null,
    };
    activeTurn.approvalRequests.push(pendingRequest);
    const record = {
      sessionId: activeTurn.sessionId,
      workspace: activeTurn.workspace,
      target: {
        threadIdSuffix: suffix(activeTurn.threadId),
        turnIdSuffix: suffix(activeTurn.turnId),
      },
      request: pendingRequest,
      browserDecision: null,
    };
    const key = approvalRecordKey(record.sessionId, requestKey);

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.pendingApprovals.delete(key);
        this.resolvedApprovals.add(key);
        const timeoutDenial = buildDenyOnlyApprovalResponse(message, { interrupt: true });
        pendingRequest.handled = timeoutDenial.handled;
        pendingRequest.decision = timeoutDenial.response?.decision ?? timeoutDenial.decision ?? null;
        resolve(timeoutDenial.response);
      }, this.approvalDecisionTimeoutMs);
      this.pendingApprovals.set(key, {
        message,
        record,
        resolve,
        timer,
      });
    });
  }

  resolvePendingApprovalsForActiveTurn() {
    if (!this.activeTurn) {
      return;
    }
    for (const [key, entry] of this.pendingApprovals) {
      if (entry.record.sessionId !== this.activeTurn.sessionId) {
        continue;
      }
      clearTimeout(entry.timer);
      this.pendingApprovals.delete(key);
      this.resolvedApprovals.add(key);
      const denial = buildDenyOnlyApprovalResponse(entry.message, { interrupt: true });
      entry.record.request.handled = denial.handled;
      entry.record.request.decision = denial.response?.decision ?? denial.decision ?? null;
      entry.resolve(denial.response);
    }
  }

  rejectPendingApprovals() {
    for (const [key, entry] of this.pendingApprovals) {
      clearTimeout(entry.timer);
      this.pendingApprovals.delete(key);
      this.resolvedApprovals.add(key);
      const denial = buildDenyOnlyApprovalResponse(entry.message, { interrupt: true });
      entry.record.request.handled = denial.handled;
      entry.record.request.decision = denial.response?.decision ?? denial.decision ?? null;
      entry.resolve(denial.response);
    }
  }

  payload(probes) {
    return {
      ok: true,
      generatedAt: new Date().toISOString(),
      transport: "stdio-jsonl",
      protocol: "json-rpc-2.0-without-jsonrpc-field",
      initialize: this.initialize,
      probes,
      notifications: notificationCounts(this.notifications),
      sessionManager: {
        enabled: true,
        persistentClient: true,
        approvalForwardingEnabled: this.approvalForwardingEnabled,
        promptTextReturned: false,
        fullIdsReturned: false,
      },
    };
  }
}

function sessionKey(workspace, cwd) {
  return workspace?.id ?? cwd ?? null;
}

function sanitizeWorkspaceForRecord(workspace) {
  if (!workspace || typeof workspace !== "object") {
    return null;
  }
  return {
    id: cleanString(workspace.id, 80),
    label: cleanString(workspace.label, 120),
    isDefault: Boolean(workspace.isDefault),
  };
}

function hasRecordedApprovalDecision(approvalAuditLog, record) {
  if (!approvalAuditLog || typeof approvalAuditLog.hasRecordedDecision !== "function") {
    return false;
  }
  try {
    return Boolean(approvalAuditLog.hasRecordedDecision(record));
  } catch {
    throwRequestError("Approval decision audit log unavailable", 500);
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
    throwRequestError("Approval decision audit log unavailable", 500);
  }
}

function approvalRequestKey(request, index) {
  return [
    request.requestIdSuffix,
    request.approvalIdSuffix,
    request.itemIdSuffix,
    request.kind,
    String(index),
  ]
    .filter(Boolean)
    .join("-") || `approval-${index}`;
}

function approvalRecordKey(sessionId, requestKey) {
  return `${sessionId || ""}:${requestKey || ""}`;
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
    return randomBytes(APPROVAL_DECISION_TOKEN_BYTES).toString("hex");
  }
  return value;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function validateLiveSessionAction(action) {
  if (!["interrupt", "unsubscribe", "steer"].includes(action)) {
    throwRequestError("Live session control action is unsupported", 400);
  }
}

function validateLiveSessionBulkAction(action) {
  if (action !== "unsubscribe") {
    throwRequestError("Live session bulk control action is unsupported", 400);
  }
}

function validateTerminalControlAction(action) {
  if (!["write", "resize", "terminate"].includes(action)) {
    throwRequestError("Terminal control action is unsupported", 400);
  }
}

function validateTerminalControlMethod(method, action) {
  const allowedByAction = {
    write: [APP_SERVER_METHODS.commandExecWrite, APP_SERVER_METHODS.processWriteStdin],
    resize: [APP_SERVER_METHODS.commandExecResize, APP_SERVER_METHODS.processResizePty],
    terminate: [APP_SERVER_METHODS.commandExecTerminate, APP_SERVER_METHODS.processKill],
  };
  if (!allowedByAction[action]?.includes(method)) {
    throwRequestError("Terminal control method is unsupported", 400);
  }
}

function validateTerminalSessionSelector(value) {
  if (typeof value !== "string") {
    throwRequestError("Terminal session selector is required", 400);
  }
  const clean = value.trim();
  if (
    clean.length < 8 ||
    clean.length > DEFAULT_TERMINAL_SESSION_SELECTOR_LIMIT ||
    !/^[A-Za-z0-9_-]+$/.test(clean)
  ) {
    throwRequestError("Terminal session selector is invalid", 400);
  }
  return { value: clean, charCount: clean.length };
}

function validateTerminalInput(value) {
  if (typeof value !== "string" || value.length === 0) {
    throwRequestError("Terminal input is required", 400);
  }
  if (value.length > DEFAULT_TERMINAL_INPUT_LIMIT) {
    throwRequestError(`Terminal input must be ${DEFAULT_TERMINAL_INPUT_LIMIT} characters or fewer`, 400);
  }
  return value;
}

function validateNoTerminalInput(value) {
  if (value != null && value !== "") {
    throwRequestError("Terminal input is invalid for this action", 400);
  }
  return null;
}

function validateTerminalDimension(value, label) {
  if (typeof value === "string" && !/^\d+$/.test(value.trim())) {
    throwRequestError(`${label} must be between 1 and ${DEFAULT_TERMINAL_DIMENSION_LIMIT}`, 400);
  }
  const parsed = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  if (
    !Number.isSafeInteger(parsed) ||
    parsed < 1 ||
    parsed > DEFAULT_TERMINAL_DIMENSION_LIMIT
  ) {
    throwRequestError(`${label} must be between 1 and ${DEFAULT_TERMINAL_DIMENSION_LIMIT}`, 400);
  }
  return parsed;
}

function validateThreadShellCommand(value) {
  if (typeof value !== "string") {
    throwRequestError("Thread shell command is required", 400);
  }
  const clean = value.trim();
  if (clean.length === 0) {
    throwRequestError("Thread shell command is required", 400);
  }
  if (clean.length > DEFAULT_THREAD_SHELL_COMMAND_LIMIT) {
    throwRequestError(
      `Thread shell command must be ${DEFAULT_THREAD_SHELL_COMMAND_LIMIT} characters or fewer`,
      400,
    );
  }
  if (/[\0\r\n]/.test(clean) || /[^\x20-\x7E]/.test(clean)) {
    throwRequestError("Thread shell command contains unsupported text", 400);
  }
  return clean;
}

function validateNoTerminalDimensions(rows, cols) {
  if (rows != null || cols != null) {
    throwRequestError("Terminal dimensions are invalid for this action", 400);
  }
  return null;
}

function terminalControlParams({ terminalAction, method, session, input, resize }) {
  if (method === APP_SERVER_METHODS.commandExecWrite && terminalAction === "write") {
    return {
      processId: session,
      deltaBase64: Buffer.from(input, "utf8").toString("base64"),
      closeStdin: false,
    };
  }
  if (method === APP_SERVER_METHODS.commandExecResize && terminalAction === "resize") {
    return {
      processId: session,
      size: {
        rows: resize.rows,
        cols: resize.cols,
      },
    };
  }
  if (method === APP_SERVER_METHODS.commandExecTerminate && terminalAction === "terminate") {
    return {
      processId: session,
    };
  }
  if (method === APP_SERVER_METHODS.processWriteStdin && terminalAction === "write") {
    return {
      processHandle: session,
      deltaBase64: Buffer.from(input, "utf8").toString("base64"),
      closeStdin: false,
    };
  }
  if (method === APP_SERVER_METHODS.processResizePty && terminalAction === "resize") {
    return {
      processHandle: session,
      size: {
        rows: resize.rows,
        cols: resize.cols,
      },
    };
  }
  if (method === APP_SERVER_METHODS.processKill && terminalAction === "terminate") {
    return {
      processHandle: session,
    };
  }
  throwRequestError("Terminal control method is unsupported", 400);
}

function validatePrompt(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throwRequestError("Prompt is required", 400);
  }
  if (value.length > DEFAULT_STEER_PROMPT_LIMIT) {
    throwRequestError(`Prompt must be ${DEFAULT_STEER_PROMPT_LIMIT} characters or fewer`, 400);
  }
  return value;
}

function validateSuffix(value, label) {
  if (!isValidSuffix(value)) {
    throwRequestError(`${label} must be an 8-character id suffix`, 400);
  }
}

function selectThreadBySuffix(threads, threadIdSuffix) {
  const matches = (Array.isArray(threads) ? threads : []).filter((thread) =>
    typeof thread.id === "string" && suffix(thread.id) === threadIdSuffix,
  );
  if (matches.length === 0) {
    throwRequestError("Thread selector did not match any thread", 404);
  }
  if (matches.length > 1) {
    throwRequestError("Thread selector matched multiple threads", 409);
  }
  return matches[0];
}

function selectLoadedThreadIdBySuffix(loadedSessions, threadIdSuffix) {
  const data = Array.isArray(loadedSessions?.data) ? loadedSessions.data : [];
  const matches = data.filter((threadId) => suffix(threadId) === threadIdSuffix);
  if (matches.length === 0) {
    throwRequestError("Loaded thread selector did not match any live session", 404);
  }
  if (matches.length > 1) {
    throwRequestError("Loaded thread selector matched multiple live sessions", 409);
  }
  return matches[0];
}

function selectTurnIdBySuffix(turns, turnIdSuffix) {
  const matches = (Array.isArray(turns) ? turns : []).filter((turn) =>
    typeof turn.id === "string" && suffix(turn.id) === turnIdSuffix,
  );
  if (matches.length === 0) {
    throwRequestError("Turn selector did not match the loaded thread", 404);
  }
  if (matches.length > 1) {
    throwRequestError("Turn selector matched multiple turns", 409);
  }
  return matches[0].id;
}

function liveSessionControlMethod(action) {
  if (action === "interrupt") {
    return APP_SERVER_METHODS.turnInterrupt;
  }
  if (action === "unsubscribe") {
    return APP_SERVER_METHODS.threadUnsubscribe;
  }
  return APP_SERVER_METHODS.turnSteer;
}

function cleanString(value, maxLength) {
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

function statusFromParams(params) {
  if (typeof params?.status === "string") {
    return params.status;
  }
  if (typeof params?.turn?.status === "string") {
    return params.turn.status;
  }
  if (params?.turn?.status && typeof params.turn.status === "object") {
    return params.turn.status.type ?? null;
  }
  return null;
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

function suffix(value) {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }
  return value.slice(-8);
}

function isValidSuffix(value) {
  return typeof value === "string" && /^[A-Za-z0-9_-]{8}$/.test(value);
}

function throwRequestError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
}

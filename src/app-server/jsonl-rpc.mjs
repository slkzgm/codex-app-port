import { spawn as defaultSpawn } from "node:child_process";

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_CLOSE_TIMEOUT_MS = 1_000;
const MAX_STDERR_BYTES = 16 * 1024;
const MAX_RECENT_NOTIFICATIONS = 100;

export class JsonlRpcError extends Error {
  constructor(message, { code = null, data = null, id = null } = {}) {
    super(message);
    this.name = "JsonlRpcError";
    this.code = code;
    this.data = data;
    this.id = id;
  }
}

export class JsonlRpcClient {
  constructor({
    command,
    args = [],
    cwd = process.cwd(),
    env = process.env,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    spawn = defaultSpawn,
    onNotification = () => {},
    onServerRequest = null,
  }) {
    if (!command) {
      throw new Error("JsonlRpcClient requires a command");
    }
    this.command = command;
    this.args = args;
    this.cwd = cwd;
    this.env = env;
    this.timeoutMs = timeoutMs;
    this.spawn = spawn;
    this.onNotification = onNotification;
    this.notificationListeners = new Set();
    this.onServerRequest = onServerRequest;

    this.child = null;
    this.nextId = 1;
    this.pending = new Map();
    this.notificationWaiters = [];
    this.recentNotifications = [];
    this.stdoutBuffer = "";
    this.stderrBuffer = "";
    this.started = false;
    this.closing = false;
    this.exitCode = null;
    this.exitSignal = null;
    this.exitPromise = null;
  }

  async start() {
    if (this.started) {
      return;
    }
    this.started = true;
    this.child = this.spawn(this.command, this.args, {
      cwd: this.cwd,
      env: this.env,
      stdio: ["pipe", "pipe", "pipe"],
    });

    this.child.stdout.setEncoding("utf8");
    this.child.stderr.setEncoding("utf8");

    this.child.stdout.on("data", (chunk) => this.#handleStdout(chunk));
    this.child.stderr.on("data", (chunk) => this.#appendStderr(chunk));
    this.child.on("error", (error) => this.#rejectAll(error));

    this.exitPromise = new Promise((resolve) => {
      this.child.once("exit", (code, signal) => {
        this.exitCode = code;
        this.exitSignal = signal;
        const reason = new Error(
          `JSONL-RPC process exited before completing pending requests: code=${code} signal=${signal}`,
        );
        if (!this.closing) {
          this.#rejectAll(reason);
        }
        resolve({ code, signal });
      });
    });
  }

  async request(method, params, { timeoutMs = this.timeoutMs } = {}) {
    const id = this.nextId;
    this.nextId += 1;

    const message = { method, id };
    if (params !== undefined) {
      message.params = params;
    }

    const response = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Timed out waiting for response to ${method} (${id})`));
      }, timeoutMs);
      this.pending.set(id, { method, resolve, reject, timer });
    });

    try {
      this.#write(message);
    } catch (error) {
      const pending = this.pending.get(id);
      if (pending) {
        clearTimeout(pending.timer);
        this.pending.delete(id);
      }
      throw error;
    }

    return response;
  }

  notify(method, params) {
    const message = { method };
    if (params !== undefined) {
      message.params = params;
    }
    this.#write(message);
  }

  waitForNotification(predicate, { timeoutMs = this.timeoutMs } = {}) {
    for (const notification of this.recentNotifications) {
      if (predicate(notification)) {
        return Promise.resolve(notification);
      }
    }

    return new Promise((resolve, reject) => {
      const waiter = {
        predicate,
        resolve,
        reject,
        timer: setTimeout(() => {
          this.notificationWaiters = this.notificationWaiters.filter((entry) => entry !== waiter);
          reject(new Error("Timed out waiting for JSONL-RPC notification"));
        }, timeoutMs),
      };
      this.notificationWaiters.push(waiter);
    });
  }

  addNotificationListener(listener) {
    this.notificationListeners.add(listener);
  }

  removeNotificationListener(listener) {
    this.notificationListeners.delete(listener);
  }

  async close({ killAfterMs = DEFAULT_CLOSE_TIMEOUT_MS } = {}) {
    if (!this.child) {
      return;
    }

    this.closing = true;
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(new Error("JSONL-RPC client closed before response arrived"));
    }
    this.pending.clear();
    for (const waiter of this.notificationWaiters) {
      clearTimeout(waiter.timer);
      waiter.reject(new Error("JSONL-RPC client closed before notification arrived"));
    }
    this.notificationWaiters = [];

    if (this.child.stdin.writable) {
      this.child.stdin.end();
    }

    const killTimer = setTimeout(() => {
      if (this.exitCode === null && this.exitSignal === null) {
        this.child.kill("SIGTERM");
      }
    }, killAfterMs);

    try {
      await this.exitPromise;
    } finally {
      clearTimeout(killTimer);
    }
  }

  getStderr() {
    return this.stderrBuffer;
  }

  #write(message) {
    if (!this.child || !this.child.stdin.writable) {
      throw new Error("JSONL-RPC process stdin is not writable");
    }
    this.child.stdin.write(`${JSON.stringify(message)}\n`);
  }

  #handleStdout(chunk) {
    this.stdoutBuffer += chunk;

    while (true) {
      const newlineIndex = this.stdoutBuffer.indexOf("\n");
      if (newlineIndex === -1) {
        break;
      }

      const line = this.stdoutBuffer.slice(0, newlineIndex).trim();
      this.stdoutBuffer = this.stdoutBuffer.slice(newlineIndex + 1);
      if (line.length === 0) {
        continue;
      }

      try {
        this.#handleMessage(JSON.parse(line));
      } catch (error) {
        this.#rejectAll(error);
      }
    }
  }

  #handleMessage(message) {
    if (Object.hasOwn(message, "id") && Object.hasOwn(message, "result")) {
      this.#resolve(message.id, message.result);
      return;
    }

    if (Object.hasOwn(message, "id") && Object.hasOwn(message, "error")) {
      const error = message.error || {};
      this.#reject(
        message.id,
        new JsonlRpcError(error.message || "JSONL-RPC request failed", {
          code: error.code ?? null,
          data: error.data ?? null,
          id: message.id,
        }),
      );
      return;
    }

    if (message.method && !Object.hasOwn(message, "id")) {
      this.#rememberNotification(message);
      this.onNotification(message);
      for (const listener of this.notificationListeners) {
        listener(message);
      }
      this.#resolveNotificationWaiters(message);
      return;
    }

    if (message.method && Object.hasOwn(message, "id")) {
      this.#handleServerRequest(message);
      return;
    }

    throw new Error(`Unsupported JSONL-RPC message: ${JSON.stringify(message)}`);
  }

  #handleServerRequest(message) {
    if (!this.onServerRequest) {
      this.#write({
        id: message.id,
        error: {
          code: -32601,
          message: `Server request not supported by smoke client: ${message.method}`,
        },
      });
      return;
    }

    Promise.resolve(this.onServerRequest(message))
      .then((result) => {
        this.#write({ id: message.id, result: result ?? null });
      })
      .catch((error) => {
        this.#write({
          id: message.id,
          error: {
            code: -32000,
            message: error.message,
          },
        });
      });
  }

  #resolve(id, result) {
    const pending = this.pending.get(id);
    if (!pending) {
      return;
    }
    clearTimeout(pending.timer);
    this.pending.delete(id);
    pending.resolve(result);
  }

  #reject(id, error) {
    const pending = this.pending.get(id);
    if (!pending) {
      return;
    }
    clearTimeout(pending.timer);
    this.pending.delete(id);
    pending.reject(error);
  }

  #rejectAll(error) {
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(error);
    }
    this.pending.clear();
    for (const waiter of this.notificationWaiters) {
      clearTimeout(waiter.timer);
      waiter.reject(error);
    }
    this.notificationWaiters = [];
  }

  #appendStderr(chunk) {
    this.stderrBuffer += chunk;
    if (this.stderrBuffer.length > MAX_STDERR_BYTES) {
      this.stderrBuffer = this.stderrBuffer.slice(-MAX_STDERR_BYTES);
    }
  }

  #resolveNotificationWaiters(notification) {
    const remaining = [];
    for (const waiter of this.notificationWaiters) {
      let matched = false;
      try {
        matched = waiter.predicate(notification);
      } catch (error) {
        clearTimeout(waiter.timer);
        waiter.reject(error);
        continue;
      }

      if (matched) {
        clearTimeout(waiter.timer);
        waiter.resolve(notification);
      } else {
        remaining.push(waiter);
      }
    }
    this.notificationWaiters = remaining;
  }

  #rememberNotification(notification) {
    this.recentNotifications.push(notification);
    if (this.recentNotifications.length > MAX_RECENT_NOTIFICATIONS) {
      this.recentNotifications.splice(0, this.recentNotifications.length - MAX_RECENT_NOTIFICATIONS);
    }
  }
}

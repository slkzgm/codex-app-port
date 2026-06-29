import { spawn } from "node:child_process";
import process from "node:process";

import {
  DEFAULT_HOST,
  DEFAULT_PORT,
  isLoopbackHost,
  parseWorkspaceEnv,
} from "../dev-server/server.mjs";
import { DEFAULT_TIMEOUT_MS } from "../app-server/probe.mjs";

export function launcherUsage() {
  return `Usage: node scripts/desktop-launcher.mjs [options]

Options:
  --host <host>          Bind host (default: 127.0.0.1)
  --port <number>        Bind port (default: 14570)
  --codex <path>         Codex binary for app-server probes
  --workspace <path>     Add an allowed workspace (repeatable)
  --project-root <path>  Discover direct child Git projects from this root
  --approval-audit-log <path>
                         Append sanitized approval decision audit JSONL here
  --action-audit-log <path>
                         Append sanitized local action audit JSONL here
  --timeout-ms <number>  Probe timeout in milliseconds (default: 10000)
  --thread-limit <n>     Thread metadata rows to count (default: 8)
  --no-open              Do not open the browser after launch
  -h, --help             Show this help
`;
}

export function parseLauncherArgs(argv, env = process.env) {
  const options = {
    host: env.CODEX_APP_PORT_HOST || DEFAULT_HOST,
    port: Number.parseInt(env.CODEX_APP_PORT_PORT || `${DEFAULT_PORT}`, 10),
    codexBin: env.CODEX_BIN || "codex",
    timeoutMs: DEFAULT_TIMEOUT_MS,
    threadLimit: 8,
    workspaceInputs: parseWorkspaceEnv(env.CODEX_APP_PORT_WORKSPACES),
    projectRootInputs: parseWorkspaceEnv(env.CODEX_APP_PORT_PROJECT_ROOTS),
    approvalAuditLogPath: env.CODEX_APP_PORT_APPROVAL_AUDIT_LOG || null,
    actionAuditLogPath: env.CODEX_APP_PORT_ACTION_AUDIT_LOG || null,
    open: true,
    opener: "xdg-open",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case "--host":
        options.host = requireValue(argv, ++i, arg);
        break;
      case "--port":
        options.port = parsePositiveInt(requireValue(argv, ++i, arg), arg);
        break;
      case "--codex":
        options.codexBin = requireValue(argv, ++i, arg);
        break;
      case "--workspace":
        options.workspaceInputs.push(requireValue(argv, ++i, arg));
        break;
      case "--project-root":
        options.projectRootInputs.push(requireValue(argv, ++i, arg));
        break;
      case "--approval-audit-log":
        options.approvalAuditLogPath = requireValue(argv, ++i, arg);
        break;
      case "--action-audit-log":
        options.actionAuditLogPath = requireValue(argv, ++i, arg);
        break;
      case "--timeout-ms":
        options.timeoutMs = parsePositiveInt(requireValue(argv, ++i, arg), arg);
        break;
      case "--thread-limit":
        options.threadLimit = parsePositiveInt(requireValue(argv, ++i, arg), arg);
        break;
      case "--no-open":
        options.open = false;
        break;
      default:
        throw new Error(`Unknown option: ${arg}\n\n${launcherUsage()}`);
    }
  }

  if (!Number.isSafeInteger(options.port) || options.port <= 0) {
    throw new Error("Configured port must be a positive integer");
  }

  if (!isLoopbackHost(options.host) && env.CODEX_APP_PORT_ALLOW_NON_LOOPBACK !== "1") {
    throw new Error(
      `Refusing to bind non-loopback host ${options.host}. Set CODEX_APP_PORT_ALLOW_NON_LOOPBACK=1 to override.`,
    );
  }

  return options;
}

export function buildDesktopServerOptions(
  options,
  {
    cwd = process.cwd(),
    createApprovalAuditLogFn,
    createActionAuditLogFn,
  } = {},
) {
  if (typeof createApprovalAuditLogFn !== "function") {
    throw new Error("Desktop launcher requires an approval audit log factory");
  }
  if (typeof createActionAuditLogFn !== "function") {
    throw new Error("Desktop launcher requires an action audit log factory");
  }
  return {
    codexBin: options.codexBin,
    cwd,
    timeoutMs: options.timeoutMs,
    threadLimit: options.threadLimit,
    workspaceInputs: options.workspaceInputs,
    projectRootInputs: options.projectRootInputs,
    approvalAuditLog: createApprovalAuditLogFn({
      path: options.approvalAuditLogPath ?? undefined,
    }),
    actionAuditLog: createActionAuditLogFn({
      path: options.actionAuditLogPath ?? undefined,
    }),
  };
}

export function openUrl(url, { opener = "xdg-open", spawnFn = spawn } = {}) {
  const child = spawnFn(opener, [url], {
    detached: true,
    stdio: "ignore",
  });
  if (typeof child.unref === "function") {
    child.unref();
  }
  return child;
}

function requireValue(argv, index, flag) {
  const value = argv[index];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

function parsePositiveInt(value, flag) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Error(`${flag} must be a positive integer`);
  }
  return parsed;
}

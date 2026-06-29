#!/usr/bin/env node
import process from "node:process";

import {
  DEFAULT_THREAD_LIMIT,
  DEFAULT_TIMEOUT_MS,
  runAppServerProbe,
} from "../src/app-server/probe.mjs";

function usage() {
  return `Usage: node scripts/app-server-smoke.mjs [options]

Options:
  --codex <path>          Codex binary to execute (default: CODEX_BIN or codex)
  --timeout-ms <number>   Per-request timeout in milliseconds (default: 10000)
  --thread-limit <number> Max threads to count in read-only probe (default: 5)
  --no-readonly           Only perform initialize/initialized handshake
  --allow-agent-turn      Opt into a real throwaway thread/turn smoke test
  --turn-timeout-ms <n>   Agent turn notification timeout (default: timeout-ms)
  --json                  Emit sanitized JSON output
  -h, --help              Show this help

Agent turn safety gate:
  --allow-agent-turn also requires CODEX_APP_PORT_ALLOW_AGENT_TURN=1.
  This can use authenticated model traffic. It is never enabled by default.
`;
}

function parseArgs(argv) {
  const options = {
    codexBin: process.env.CODEX_BIN || "codex",
    timeoutMs: DEFAULT_TIMEOUT_MS,
    readonly: true,
    json: false,
    threadLimit: DEFAULT_THREAD_LIMIT,
    allowAgentTurn: false,
    turnTimeoutMs: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case "--codex":
        options.codexBin = requireValue(argv, ++i, arg);
        break;
      case "--timeout-ms":
        options.timeoutMs = parsePositiveInt(requireValue(argv, ++i, arg), arg);
        break;
      case "--thread-limit":
        options.threadLimit = parsePositiveInt(requireValue(argv, ++i, arg), arg);
        break;
      case "--no-readonly":
        options.readonly = false;
        break;
      case "--allow-agent-turn":
        options.allowAgentTurn = true;
        break;
      case "--turn-timeout-ms":
        options.turnTimeoutMs = parsePositiveInt(requireValue(argv, ++i, arg), arg);
        break;
      case "--json":
        options.json = true;
        break;
      case "-h":
      case "--help":
        process.stdout.write(usage());
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown option: ${arg}\n\n${usage()}`);
    }
  }

  return options;
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

function printHuman(summary) {
  process.stdout.write("app-server smoke ok\n");
  process.stdout.write(`codex: ${summary.codex.bin}\n`);
  process.stdout.write(
    `platform: ${summary.initialize.platformOs}/${summary.initialize.platformFamily}\n`,
  );

  if (summary.probes.config) {
    const config = summary.probes.config;
    process.stdout.write(
      `config: model=${config.model ?? "unset"} provider=${config.modelProvider ?? "unset"} ` +
        `sandbox=${config.sandboxMode ?? "unset"} approval=${formatValue(config.approvalPolicy)}\n`,
    );
  }

  if (summary.probes.threads) {
    process.stdout.write(`threads: count=${summary.probes.threads.count}\n`);
  }

  if (summary.probes.agentTurn) {
    process.stdout.write(
      `agentTurn: completedStatus=${summary.probes.agentTurn.completedStatus ?? "unknown"}\n`,
    );
  }

  const notificationEntries = Object.entries(summary.notifications);
  if (notificationEntries.length > 0) {
    process.stdout.write(
      `notifications: ${notificationEntries.map(([name, count]) => `${name}=${count}`).join(", ")}\n`,
    );
  }
}

function formatValue(value) {
  if (value == null) return "unset";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const summary = await runAppServerProbe({
    codexBin: options.codexBin,
    cwd: process.cwd(),
    timeoutMs: options.timeoutMs,
    readonly: options.readonly,
    threadLimit: options.threadLimit,
    allowAgentTurn: options.allowAgentTurn,
    turnTimeoutMs: options.turnTimeoutMs,
  });

  if (options.json) {
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  } else {
    printHuman(summary);
  }
}

main().catch((error) => {
  const payload = {
    ok: false,
    error: error.message,
    code: error.code ?? null,
  };

  if (process.argv.includes("--json")) {
    process.stderr.write(`${JSON.stringify(payload, null, 2)}\n`);
  } else {
    process.stderr.write(`app-server smoke failed: ${error.message}\n`);
  }
  process.exitCode = 1;
});

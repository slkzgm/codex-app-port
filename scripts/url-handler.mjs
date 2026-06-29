#!/usr/bin/env node
import process from "node:process";

import {
  buildBlockedUrlHandlerResult,
  openRegisteredUrl,
} from "../src/desktop/url-handler.mjs";

function usage() {
  return `Usage: node scripts/url-handler.mjs [options] <url>

Options:
  --json      Print machine-readable output
  --open      Open the validated target in the local loopback UI
  --origin    Local UI origin for --open (default: http://127.0.0.1:14570/)
  -h, --help  Show this help
`;
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("-h") || argv.includes("--help")) {
    process.stdout.write(usage());
    return;
  }

  const json = argv.includes("--json");
  const open = argv.includes("--open");
  const originIndex = argv.indexOf("--origin");
  const origin = originIndex === -1 ? undefined : argv[originIndex + 1];
  const originValueIndex = originIndex === -1 ? -1 : originIndex + 1;
  const url = argv.filter((arg, index) =>
    arg !== "--json" &&
    arg !== "--open" &&
    arg !== "--origin" &&
    index !== originValueIndex
  )[0];
  const result = open
    ? openRegisteredUrl(url, {
        origin,
        opener: process.env.CODEX_APP_PORT_OPENER || "xdg-open",
      })
    : buildBlockedUrlHandlerResult(url);

  if (json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }

  process.stdout.write(`URL handler validation: ${result.action}\n`);
  process.stdout.write(
    open
      ? `Opened local UI target: ${result.localUiUrl}\n`
      : "Execution blocked: desktop URL handler is not registered.\n",
  );
}

main().catch((error) => {
  const payload = {
    ok: false,
    accepted: false,
    error: error.message,
    code: error.code ?? "url-handler-error",
  };
  if (process.argv.includes("--json")) {
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  } else {
    process.stderr.write(`url handler rejected: ${error.message}\n`);
  }
  process.exitCode = 1;
});

#!/usr/bin/env node
import process from "node:process";

import { createActionAuditLog } from "../src/dev-server/action-audit-log.mjs";
import { createApprovalAuditLog } from "../src/dev-server/approval-audit-log.mjs";
import { createDevServer, listenWithFallback } from "../src/dev-server/server.mjs";
import {
  buildDesktopServerOptions,
  launcherUsage,
  openUrl,
  parseLauncherArgs,
} from "../src/desktop/launcher.mjs";

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("-h") || argv.includes("--help")) {
    process.stdout.write(launcherUsage());
    return;
  }

  const options = parseLauncherArgs(argv);
  const server = createDevServer(
    buildDesktopServerOptions(options, {
      cwd: process.cwd(),
      createApprovalAuditLogFn: createApprovalAuditLog,
      createActionAuditLogFn: createActionAuditLog,
    }),
  );

  const actualPort = await listenWithFallback(server, {
    host: options.host,
    port: options.port,
  });
  const url = `http://${options.host}:${actualPort}/`;
  process.stdout.write(`Codex App Port desktop launcher: ${url}\n`);
  process.stdout.write("Close this process to stop the local UI server.\n");

  if (options.open) {
    openUrl(url, { opener: options.opener });
  }

  await waitForShutdown(server);
}

function waitForShutdown(server) {
  return new Promise((resolve, reject) => {
    let closing = false;
    const close = () => {
      if (closing) {
        return;
      }
      closing = true;
      server.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    };

    process.once("SIGINT", close);
    process.once("SIGTERM", close);
  });
}

main().catch((error) => {
  process.stderr.write(`desktop launcher failed: ${error.message}\n`);
  process.exitCode = 1;
});

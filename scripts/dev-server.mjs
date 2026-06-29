#!/usr/bin/env node
import process from "node:process";

import { createActionAuditLog } from "../src/dev-server/action-audit-log.mjs";
import { createApprovalAuditLog } from "../src/dev-server/approval-audit-log.mjs";
import { createDevServer, listenWithFallback, parseDevServerArgs, usage } from "../src/dev-server/server.mjs";

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("-h") || argv.includes("--help")) {
    process.stdout.write(usage());
    return;
  }

  const options = parseDevServerArgs(argv);
  const server = createDevServer({
    codexBin: options.codexBin,
    cwd: process.cwd(),
    timeoutMs: options.timeoutMs,
    threadLimit: options.threadLimit,
    workspaceInputs: options.workspaceInputs,
    projectRootInputs: options.projectRootInputs,
    approvalAuditLog: createApprovalAuditLog({ path: options.approvalAuditLogPath ?? undefined }),
    actionAuditLog: createActionAuditLog({ path: options.actionAuditLogPath ?? undefined }),
  });

  const actualPort = await listenWithFallback(server, options);
  process.stdout.write(`Codex App Port dev server: http://${options.host}:${actualPort}/\n`);
  process.stdout.write("Serving read-only app-server status over loopback.\n");
}

main().catch((error) => {
  process.stderr.write(`dev server failed: ${error.message}\n`);
  process.exitCode = 1;
});

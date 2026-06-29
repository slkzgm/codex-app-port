#!/usr/bin/env node
import process from "node:process";

import { installLocal, installUsage, parseInstallArgs } from "../src/desktop/install.mjs";

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("-h") || argv.includes("--help")) {
    process.stdout.write(installUsage());
    return;
  }

  const options = parseInstallArgs(argv);
  const result = await installLocal(options);

  if (options.json) {
    process.stdout.write(`${JSON.stringify(sanitizeResult(result), null, 2)}\n`);
    return;
  }

  process.stdout.write(`${options.dryRun ? "Install plan" : "Installed"}: ${result.installDir}\n`);
  if (result.desktopPath) {
    process.stdout.write(`Desktop entry: ${result.desktopPath}\n`);
  }
  if (result.urlHandlerDesktopPath) {
    process.stdout.write(`URL handler entry: ${result.urlHandlerDesktopPath}\n`);
  }
}

function sanitizeResult(result) {
  return {
    ok: Boolean(result.ok),
    written: Boolean(result.written),
    installDir: result.installDir,
    desktopDir: result.desktopDir,
    desktopPath: result.desktopPath,
    urlHandlerDesktopPath: result.urlHandlerDesktopPath,
    copyEntries: result.copyEntries,
    guardrails: result.guardrails,
    desktopEntry: result.desktopEntry,
    urlHandlerDesktopEntry: result.urlHandlerDesktopEntry,
  };
}

main().catch((error) => {
  process.stderr.write(`local install failed: ${error.message}\n`);
  process.exitCode = 1;
});

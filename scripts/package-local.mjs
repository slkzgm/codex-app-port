#!/usr/bin/env node
import process from "node:process";

import { packageLocal, packageUsage, parsePackageArgs } from "../src/desktop/package.mjs";

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("-h") || argv.includes("--help")) {
    process.stdout.write(packageUsage());
    return;
  }

  const options = await parsePackageArgs(argv);
  const result = await packageLocal(options);

  if (options.json) {
    process.stdout.write(`${JSON.stringify(sanitizeResult(result), null, 2)}\n`);
    return;
  }

  process.stdout.write(`${options.dryRun ? "Package plan" : "Packaged"}: ${result.archivePath}\n`);
  if (result.sha256Path) {
    process.stdout.write(`Checksum: ${result.sha256Path}\n`);
  }
}

function sanitizeResult(result) {
  return {
    ok: Boolean(result.ok),
    written: Boolean(result.written),
    name: result.name,
    version: result.version,
    archiveRoot: result.archiveRoot,
    archiveFilename: result.archiveFilename,
    archivePath: result.archivePath,
    sha256Path: result.sha256Path,
    sha256: result.sha256 ?? null,
    packageEntries: result.packageEntries,
    guardrails: result.guardrails,
  };
}

main().catch((error) => {
  process.stderr.write(`local package failed: ${error.message}\n`);
  process.exitCode = 1;
});

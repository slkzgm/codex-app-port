#!/usr/bin/env node
import process from "node:process";

import {
  archPackageUsage,
  packageArch,
  parseArchPackageArgs,
} from "../src/desktop/arch-package.mjs";

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("-h") || argv.includes("--help")) {
    process.stdout.write(archPackageUsage());
    return;
  }

  const options = parseArchPackageArgs(argv);
  const result = await packageArch(options);

  if (options.json) {
    process.stdout.write(`${JSON.stringify(sanitizeResult(result), null, 2)}\n`);
    return;
  }

  process.stdout.write(`Arch recipe: ${result.pkgbuildPath}\n`);
  process.stdout.write(`Source archive: ${result.archivePath}\n`);
  process.stdout.write(`Checksum: ${result.sha256Path}\n`);
}

function sanitizeResult(result) {
  return {
    ok: Boolean(result.ok),
    written: Boolean(result.written),
    name: result.name,
    version: result.version,
    pkgbuildPath: result.pkgbuildPath,
    archivePath: result.archivePath,
    archiveFilename: result.archiveFilename,
    sha256Path: result.sha256Path,
    sha256: result.sha256,
    sourceLocal: result.sourceLocal,
    guardrails: result.guardrails,
  };
}

main().catch((error) => {
  process.stderr.write(`Arch package recipe failed: ${error.message}\n`);
  process.exitCode = 1;
});

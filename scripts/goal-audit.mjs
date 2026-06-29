#!/usr/bin/env node
import process from "node:process";

import { formatGoalAudit, runGoalAudit } from "../src/goal/audit.mjs";

function usage() {
  return `Usage: node scripts/goal-audit.mjs [options]

Options:
  --json                Print machine-readable audit output
  --fail-on-incomplete  Exit non-zero if any requirement is partial or missing
  -h, --help            Show this help
`;
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("-h") || argv.includes("--help")) {
    process.stdout.write(usage());
    return;
  }

  const json = argv.includes("--json");
  const failOnIncomplete = argv.includes("--fail-on-incomplete");
  const unknown = argv.find((arg) => !["--json", "--fail-on-incomplete"].includes(arg));
  if (unknown) {
    throw new Error(`Unknown option: ${unknown}\n\n${usage()}`);
  }

  const audit = await runGoalAudit();
  process.stdout.write(json ? `${JSON.stringify(audit, null, 2)}\n` : formatGoalAudit(audit));
  if (failOnIncomplete && !audit.complete) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  process.stderr.write(`goal audit failed: ${error.message}\n`);
  process.exitCode = 1;
});

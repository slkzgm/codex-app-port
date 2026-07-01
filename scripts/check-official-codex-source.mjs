#!/usr/bin/env node
import { spawn } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import process from "node:process";

import { officialCodexSourceAudit } from "../src/app-server/upstream-drift.mjs";

const ROOT = new URL("../", import.meta.url).pathname;
const SCHEMA_ROOT = join(ROOT, "src", "app-server", "generated-schemas");
const JSON_SCHEMA_ROOT = join(SCHEMA_ROOT, "json");
const OPENAI_CODEX_REPO = "https://github.com/openai/codex.git";
const NPM_VIEW_COMMAND_LABEL = "npm view";
const GIT_LS_REMOTE_COMMAND_LABEL = "git ls-remote";

export async function buildOfficialCodexSourceReport({
  npmJson = null,
  gitLsRemote = null,
  codexVersion = null,
  manifest = null,
  schemaCount = null,
  checkedAt = new Date().toISOString(),
} = {}) {
  const snapshot = officialCodexSourceAudit();
  const resolvedManifest =
    manifest ?? JSON.parse(await readFile(join(SCHEMA_ROOT, "manifest.json"), "utf8"));
  const resolvedSchemaCount = schemaCount ?? (await countFiles(JSON_SCHEMA_ROOT));
  const current = {
    stablePackage: null,
    stableCodexVersion: codexVersion,
    stableSchemaCount: resolvedSchemaCount,
    stableDistTag: null,
    alphaDistTag: null,
    openaiCodexHead: null,
    localSchemaStatus: null,
    manifestCodexVersion: resolvedManifest.codexVersion,
    manifestSchemaCount: resolvedManifest.schemaCount,
  };

  if (npmJson) {
    const npm = parseNpmCodexView(npmJson);
    current.stablePackage = `@openai/codex@${npm.latest}`;
    current.stableDistTag = "latest";
    current.alphaDistTag = npm.alpha;
  }
  if (gitLsRemote) {
    current.openaiCodexHead = parseGitLsRemoteHead(gitLsRemote);
  }
  if (
    current.manifestCodexVersion === snapshot.stableCodexVersion &&
    current.manifestSchemaCount === snapshot.stableSchemaCount &&
    current.stableSchemaCount === snapshot.stableSchemaCount
  ) {
    current.localSchemaStatus = "matches-stable-cli";
  } else {
    current.localSchemaStatus = "schema-drift";
  }

  const drift = compareOfficialSnapshot(snapshot, current);
  return {
    ok: drift.length === 0,
    checkedAt,
    commands: {
      npm: NPM_VIEW_COMMAND_LABEL,
      git: GIT_LS_REMOTE_COMMAND_LABEL,
    },
    snapshot,
    current,
    drift,
    policy: {
      stablePackageOnly: true,
      alphaPackageNotExecuted: true,
      browserRoutesBlockedUntilAudited: true,
      globalGitConfigIgnoredForHeadCheck: true,
    },
  };
}

export function parseNpmCodexView(text) {
  const payload = JSON.parse(text);
  const latest = payload?.distTags?.latest ?? payload?.["dist-tags"]?.latest ?? payload?.version;
  const alpha = payload?.distTags?.alpha ?? payload?.["dist-tags"]?.alpha ?? null;
  if (typeof latest !== "string" || latest.length === 0) {
    throw new Error("npm @openai/codex latest dist-tag was not returned");
  }
  return { latest, alpha };
}

export function parseGitLsRemoteHead(text) {
  const line = text
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .find((entry) => entry.endsWith("\tHEAD") || entry.endsWith(" HEAD"));
  const hash = line?.split(/\s+/)[0];
  if (!/^[0-9a-f]{40}$/i.test(hash ?? "")) {
    throw new Error("openai/codex HEAD was not returned by git ls-remote");
  }
  return hash;
}

export function compareOfficialSnapshot(snapshot, current) {
  const fields = [
    "stablePackage",
    "stableCodexVersion",
    "stableSchemaCount",
    "stableDistTag",
    "alphaDistTag",
    "openaiCodexHead",
    "localSchemaStatus",
  ];
  const drift = [];
  for (const field of fields) {
    if (current[field] === null || current[field] === undefined) {
      continue;
    }
    if (snapshot[field] !== current[field]) {
      drift.push({
        field,
        snapshot: snapshot[field],
        current: current[field],
      });
    }
  }
  if (current.manifestCodexVersion !== snapshot.stableCodexVersion) {
    drift.push({
      field: "manifestCodexVersion",
      snapshot: snapshot.stableCodexVersion,
      current: current.manifestCodexVersion,
    });
  }
  if (current.manifestSchemaCount !== snapshot.stableSchemaCount) {
    drift.push({
      field: "manifestSchemaCount",
      snapshot: snapshot.stableSchemaCount,
      current: current.manifestSchemaCount,
    });
  }
  return drift;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const [npmJson, gitLsRemote, codexVersion, manifest, schemaCount] = await Promise.all([
    options.offline
      ? Promise.resolve(null)
      : runCapture("npm", ["view", "@openai/codex", "dist-tags", "version", "--json"]),
    options.offline
      ? Promise.resolve(null)
      : runCapture("git", ["ls-remote", OPENAI_CODEX_REPO, "HEAD", "refs/heads/main"], {
          env: {
            GIT_CONFIG_GLOBAL: "/dev/null",
            GIT_CONFIG_NOSYSTEM: "1",
          },
        }),
    options.offline ? Promise.resolve(null) : runCapture("codex", ["--version"]),
    readFile(join(SCHEMA_ROOT, "manifest.json"), "utf8").then(JSON.parse),
    countFiles(JSON_SCHEMA_ROOT),
  ]);
  const report = await buildOfficialCodexSourceReport({
    npmJson,
    gitLsRemote,
    codexVersion: codexVersion?.trim() ?? null,
    manifest,
    schemaCount,
  });
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!report.ok && !options.noFail) {
    process.exitCode = 2;
  }
}

function parseArgs(argv) {
  const options = {
    noFail: false,
    offline: false,
  };
  for (const arg of argv) {
    switch (arg) {
      case "--no-fail":
        options.noFail = true;
        break;
      case "--offline":
        options.offline = true;
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

function usage() {
  return `Usage: node scripts/check-official-codex-source.mjs [options]

Options:
  --offline   Check only the local schema manifest against the audited snapshot.
  --no-fail   Print drift but exit successfully.
  -h, --help  Show this help.
`;
}

async function countFiles(dir) {
  let count = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      count += await countFiles(path);
    } else if (entry.isFile()) {
      count += 1;
    }
  }
  return count;
}

async function runCapture(command, args, { env = {} } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        ...env,
      },
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve(stdout);
        return;
      }
      reject(
        new Error(
          `${command} ${args.join(" ")} failed with code=${code} signal=${signal}: ${stderr.trim()}`,
        ),
      );
    });
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  });
}

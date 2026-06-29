#!/usr/bin/env node
import { spawn } from "node:child_process";
import { mkdtemp, mkdir, readdir, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import process from "node:process";

const ROOT = new URL("../", import.meta.url).pathname;
const DEFAULT_OUT = join(ROOT, "src", "app-server", "generated-schemas", "json");

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const outDir = resolve(ROOT, options.outDir);
  await mkdir(dirname(outDir), { recursive: true });
  const tempRoot = await mkdtemp(join(dirname(outDir), ".schema-tmp-"));
  const tempOut = join(tempRoot, "json");

  try {
    const version = await runCapture(options.codexBin, ["--version"]);
    await runInherited(options.codexBin, [
      "app-server",
      "generate-json-schema",
      "--experimental",
      "--out",
      tempOut,
    ]);
    const schemaCount = await countFiles(tempOut);

    await rm(outDir, { recursive: true, force: true });
    await rename(tempOut, outDir);
    await writeFile(
      join(dirname(outDir), "manifest.json"),
      `${JSON.stringify(
        {
          generator: "codex app-server generate-json-schema --experimental",
          codexVersion: version.trim(),
          schemaCount,
          output: "json",
        },
        null,
        2,
      )}\n`,
      "utf8",
    );
    process.stdout.write(`wrote ${schemaCount} schemas to ${relative(outDir)}\n`);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

function parseArgs(argv) {
  const options = {
    codexBin: "codex",
    outDir: DEFAULT_OUT,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case "--codex":
        options.codexBin = requireValue(argv, ++i, arg);
        break;
      case "--out":
        options.outDir = requireValue(argv, ++i, arg);
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
  return `Usage: node scripts/generate-protocol-schemas.mjs [options]

Options:
  --codex <path>  Codex binary to use (default: codex)
  --out <dir>     Output JSON schema directory
  -h, --help      Show this help
`;
}

function requireValue(argv, index, flag) {
  const value = argv[index];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
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

async function runCapture(command, args) {
  const result = await run(command, args, "pipe");
  return result.stdout;
}

async function runInherited(command, args) {
  await run(command, args, "inherit");
}

async function run(command, args, stdioMode) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      stdio: ["ignore", stdioMode, stdioMode],
    });

    let stdout = "";
    let stderr = "";
    if (child.stdout) {
      child.stdout.setEncoding("utf8");
      child.stdout.on("data", (chunk) => {
        stdout += chunk;
      });
    }
    if (child.stderr) {
      child.stderr.setEncoding("utf8");
      child.stderr.on("data", (chunk) => {
        stderr += chunk;
      });
    }
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolvePromise({ stdout, stderr });
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} failed with code=${code} signal=${signal}`));
    });
  });
}

function relative(path) {
  return path.startsWith(ROOT) ? path.slice(ROOT.length) : path;
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});

import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { copyFile, lstat, mkdir, mkdtemp, readdir, readFile, realpath, rm, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import process from "node:process";

export const PACKAGE_ENTRIES = Object.freeze([
  ".gitignore",
  "README.md",
  "assets",
  "docs",
  "package.json",
  "packaging",
  "scripts",
  "src",
  "test",
  "ui",
]);

export function packageUsage() {
  return `Usage: node scripts/package-local.mjs [options]

Options:
  --source <path>  Source repository root (default: current repo)
  --out-dir <dir>  Output directory (default: ./dist)
  --name <name>    Package name (default: package.json name)
  --version <ver>  Package version (default: package.json version)
  --dry-run        Print the plan without writing files
  --json           Print machine-readable output
  -h, --help       Show this help
`;
}

export function parsePackageArgs(argv, env = process.env) {
  const options = {
    sourceRoot: resolve(new URL("../../", import.meta.url).pathname),
    outDir: null,
    name: null,
    version: null,
    dryRun: false,
    json: false,
    tarBin: "tar",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case "--source":
        options.sourceRoot = requireValue(argv, ++i, arg);
        break;
      case "--out-dir":
        options.outDir = requireValue(argv, ++i, arg);
        break;
      case "--name":
        options.name = requireValue(argv, ++i, arg);
        break;
      case "--version":
        options.version = requireValue(argv, ++i, arg);
        break;
      case "--dry-run":
        options.dryRun = true;
        break;
      case "--json":
        options.json = true;
        break;
      default:
        throw new Error(`Unknown option: ${arg}\n\n${packageUsage()}`);
    }
  }

  return normalizePackageOptions(options);
}

export async function packageLocal(options = {}) {
  const normalized = await normalizePackageOptions(options);
  const plan = await buildPackagePlan(normalized);
  if (normalized.dryRun) {
    return plan;
  }

  const tempRoot = await mkdtemp(join(tmpdir(), "codex-app-port-package-"));
  try {
    const stagingRoot = join(tempRoot, plan.archiveRoot);
    await mkdir(stagingRoot, { recursive: true });
    for (const entry of plan.packageEntries) {
      await copyTree(join(normalized.sourceRoot, entry), join(stagingRoot, entry));
    }
    await writeFile(
      join(stagingRoot, "package-manifest.json"),
      `${JSON.stringify(buildArchiveManifest(plan), null, 2)}\n`,
      "utf8",
    );

    await mkdir(dirname(plan.archivePath), { recursive: true });
    await runTar(normalized.tarBin, [
      "--sort=name",
      "--mtime=@0",
      "--owner=0",
      "--group=0",
      "--numeric-owner",
      "-czf",
      plan.archivePath,
      "-C",
      tempRoot,
      plan.archiveRoot,
    ]);
    const sha256 = await sha256File(plan.archivePath);
    await writeFile(plan.sha256Path, `${sha256}  ${plan.archiveFilename}\n`, "utf8");
    return {
      ...plan,
      written: true,
      sha256,
    };
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

export async function buildPackagePlan(options = {}) {
  const normalized = await normalizePackageOptions(options);
  await assertReadableDirectory(normalized.sourceRoot, "source root");
  for (const entry of PACKAGE_ENTRIES) {
    await assertAllowedSourceEntry(normalized.sourceRoot, entry);
  }

  const archiveRoot = `${normalized.name}-${normalized.version}`;
  const archiveFilename = `${archiveRoot}.tar.gz`;
  const archivePath = join(normalized.outDir, archiveFilename);
  return {
    ok: true,
    written: false,
    sourceRoot: normalized.sourceRoot,
    outDir: normalized.outDir,
    name: normalized.name,
    version: normalized.version,
    archiveRoot,
    archiveFilename,
    archivePath,
    sha256Path: `${archivePath}.sha256`,
    packageEntries: [...PACKAGE_ENTRIES],
    guardrails: {
      network: false,
      sudo: false,
      globalPackages: false,
      autoUpdate: false,
      urlHandler: false,
      symlinksAllowed: false,
    },
  };
}

export async function normalizePackageOptions(options = {}) {
  const sourceRoot = resolveRequiredPath(options.sourceRoot, "source root");
  const manifest = await readPackageManifest(sourceRoot);
  const name = cleanPackageName(options.name || manifest.name || "codex-app-port");
  const version = cleanPackageVersion(options.version || manifest.version || "0.0.0");
  const outDir = resolve(sourceRoot, options.outDir || "dist");
  assertSafeOutputDirectory(outDir, sourceRoot);

  return {
    sourceRoot,
    outDir,
    name,
    version,
    dryRun: Boolean(options.dryRun),
    json: Boolean(options.json),
    tarBin: options.tarBin || "tar",
  };
}

function buildArchiveManifest(plan) {
  return {
    name: plan.name,
    version: plan.version,
    packageEntries: plan.packageEntries,
    guardrails: plan.guardrails,
    updatePolicy: {
      automaticUpdates: false,
      digestRequired: true,
      operatorDriven: true,
    },
  };
}

async function readPackageManifest(sourceRoot) {
  const text = await readFile(join(sourceRoot, "package.json"), "utf8");
  return JSON.parse(text);
}

async function copyTree(source, destination) {
  const info = await lstat(source);
  if (info.isSymbolicLink()) {
    throw new Error(`Refusing to package symlink: ${source}`);
  }
  if (info.isDirectory()) {
    await mkdir(destination, { recursive: true });
    const entries = await readdir(source, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isSymbolicLink()) {
        throw new Error(`Refusing to package symlink: ${join(source, entry.name)}`);
      }
      await copyTree(join(source, entry.name), join(destination, entry.name));
    }
    return;
  }
  if (!info.isFile()) {
    throw new Error(`Refusing to package non-file entry: ${source}`);
  }
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
}

async function assertAllowedSourceEntry(sourceRoot, entry) {
  if (!PACKAGE_ENTRIES.includes(entry)) {
    throw new Error(`Unexpected package entry: ${entry}`);
  }
  const source = join(sourceRoot, entry);
  const info = await lstat(source);
  if (info.isSymbolicLink()) {
    throw new Error(`Refusing to package symlink entry: ${entry}`);
  }
  if (!info.isDirectory() && !info.isFile()) {
    throw new Error(`Package entry is neither file nor directory: ${entry}`);
  }
  const root = await realpath(sourceRoot);
  const realSource = await realpath(source);
  if (relative(root, realSource).startsWith("..")) {
    throw new Error(`Package entry escapes source root: ${entry}`);
  }
}

async function assertReadableDirectory(path, label) {
  const info = await lstat(path);
  if (!info.isDirectory()) {
    throw new Error(`${label} must be a directory`);
  }
}

function resolveRequiredPath(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} is required`);
  }
  if (value.includes("\0")) {
    throw new Error(`${label} contains an invalid NUL byte`);
  }
  return resolve(value);
}

function cleanPackageName(value) {
  const text = String(value);
  if (!/^[A-Za-z0-9._-]+$/.test(text)) {
    throw new Error("package name must contain only letters, numbers, dot, underscore, or dash");
  }
  return text;
}

function cleanPackageVersion(value) {
  const text = String(value);
  if (!/^[A-Za-z0-9._+-]+$/.test(text)) {
    throw new Error("package version must contain only letters, numbers, dot, underscore, dash, or plus");
  }
  return text;
}

function assertSafeOutputDirectory(outDir, sourceRoot) {
  const rel = relative(sourceRoot, outDir);
  if (!rel) {
    throw new Error("output directory must not be the source root");
  }
  if (rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
    return;
  }
  const [topLevel] = rel.split(sep);
  if (topLevel === ".git" || PACKAGE_ENTRIES.includes(topLevel)) {
    throw new Error("output directory must not be inside a packaged source entry");
  }
}

async function sha256File(path) {
  const hash = createHash("sha256");
  hash.update(await readFile(path));
  return hash.digest("hex");
}

function runTar(tarBin, args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(tarBin, args, {
      stdio: ["ignore", "ignore", "pipe"],
    });
    let stderr = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolvePromise();
        return;
      }
      reject(new Error(`tar failed with code=${code} signal=${signal}: ${stderr.trim()}`));
    });
  });
}

function requireValue(argv, index, flag) {
  const value = argv[index];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

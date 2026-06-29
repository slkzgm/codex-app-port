import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";

import { packageLocal } from "./package.mjs";

const REPO_ROOT = new URL("../../", import.meta.url).pathname;
const ARCH_TEMPLATE = "packaging/arch/PKGBUILD.in";
const DEFAULT_ARCH_OUT_DIR = "dist/arch";

const ARCH_FORBIDDEN_PATTERNS = Object.freeze([
  { pattern: /^\s*install\s*=/m, label: "install script hook" },
  { pattern: /\b(?:pre|post)_(?:install|upgrade|remove)\s*\(/, label: "install hook function" },
  { pattern: /\b(?:curl|wget)\b/, label: "network downloader" },
  { pattern: /\bsudo\b/, label: "privilege escalation" },
  { pattern: /\bsystemctl\b/, label: "systemd mutation" },
  { pattern: /\bxdg-mime\b/, label: "URL handler registration" },
  { pattern: /\bpacman\s+-S\b/, label: "package manager install" },
  { pattern: /\bnpm\s+install\s+-g\b/, label: "global npm install" },
  { pattern: /^\s*MimeType\s*=/m, label: "desktop URL handler registration" },
]);

export function archPackageUsage() {
  return `Usage: node scripts/package-arch.mjs [options]

Options:
  --source <path>  Source repository root (default: current repo)
  --out-dir <dir>  Output directory (default: ./dist/arch)
  --name <name>    Package name (default: package.json name)
  --version <ver>  Package version (default: package.json version)
  --json           Print machine-readable output
  -h, --help       Show this help
`;
}

export function parseArchPackageArgs(argv) {
  const options = {
    sourceRoot: REPO_ROOT,
    outDir: DEFAULT_ARCH_OUT_DIR,
    name: null,
    version: null,
    json: false,
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
      case "--json":
        options.json = true;
        break;
      default:
        throw new Error(`Unknown option: ${arg}\n\n${archPackageUsage()}`);
    }
  }

  return options;
}

export async function packageArch(options = {}) {
  const sourceRoot = resolveRequiredPath(options.sourceRoot || REPO_ROOT, "source root");
  const outDir = resolve(sourceRoot, options.outDir || DEFAULT_ARCH_OUT_DIR);
  const localPackage = await packageLocal({
    sourceRoot,
    outDir,
    name: options.name,
    version: options.version,
  });

  const template = await readFile(join(sourceRoot, ARCH_TEMPLATE), "utf8");
  const pkgbuild = renderArchPkgbuild(template, {
    name: localPackage.name,
    version: localPackage.version,
    archiveFilename: localPackage.archiveFilename,
    sha256: localPackage.sha256,
  });
  validateArchPkgbuild(pkgbuild, { archiveFilename: localPackage.archiveFilename });

  const pkgbuildPath = join(outDir, "PKGBUILD");
  await mkdir(outDir, { recursive: true });
  await writeFile(pkgbuildPath, pkgbuild, "utf8");

  return {
    ok: true,
    written: true,
    sourceRoot,
    outDir,
    pkgbuildPath,
    archivePath: localPackage.archivePath,
    archiveFilename: localPackage.archiveFilename,
    sha256Path: localPackage.sha256Path,
    sha256: localPackage.sha256,
    name: localPackage.name,
    version: localPackage.version,
    sourceLocal: true,
    guardrails: archPackageGuardrails(),
  };
}

export function renderArchPkgbuild(template, values) {
  const replacements = {
    "@NAME@": safeArchToken(values.name, "package name"),
    "@VERSION@": safeArchToken(values.version, "package version"),
    "@ARCHIVE_FILENAME@": safeArchToken(values.archiveFilename, "archive filename"),
    "@SHA256@": safeSha256(values.sha256),
  };
  let rendered = template;
  for (const [placeholder, value] of Object.entries(replacements)) {
    rendered = rendered.replaceAll(placeholder, value);
  }
  return rendered;
}

export function validateArchPkgbuild(content, { archiveFilename } = {}) {
  if (/@[A-Z_]+@/.test(content)) {
    throw new Error("Arch PKGBUILD contains unresolved placeholders");
  }
  const source = matchPkgbuildArray(content, "source");
  if (!source) {
    throw new Error("Arch PKGBUILD is missing source array");
  }
  if (/(?:https?|ftp|ssh):\/\//i.test(source) || /\bgit\+/.test(source)) {
    throw new Error("Arch PKGBUILD source must be a local archive");
  }
  if (archiveFilename && !source.includes(`'${archiveFilename}'`)) {
    throw new Error("Arch PKGBUILD source does not reference the generated archive");
  }
  if (!/\.tar\.gz['"]?/.test(source)) {
    throw new Error("Arch PKGBUILD source must reference a tar.gz archive");
  }

  const sha256sums = matchPkgbuildArray(content, "sha256sums");
  if (!sha256sums) {
    throw new Error("Arch PKGBUILD is missing sha256sums array");
  }
  if (/\bSKIP\b/.test(sha256sums)) {
    throw new Error("Arch PKGBUILD must not skip SHA-256 verification");
  }
  if (!/[a-f0-9]{64}/.test(sha256sums)) {
    throw new Error("Arch PKGBUILD must pin a SHA-256 digest");
  }

  for (const { pattern, label } of ARCH_FORBIDDEN_PATTERNS) {
    if (pattern.test(content)) {
      throw new Error(`Arch PKGBUILD contains forbidden ${label}`);
    }
  }

  return true;
}

export function archPackageGuardrails() {
  return {
    network: false,
    sudo: false,
    postInstall: false,
    systemd: false,
    packageManagerInstall: false,
    autoUpdate: false,
    urlHandler: false,
    scriptInstallsPackage: false,
  };
}

function matchPkgbuildArray(content, name) {
  return content.match(new RegExp(`^\\s*${name}=\\(([^)]*)\\)`, "m"))?.[1] ?? null;
}

function safeArchToken(value, label) {
  const text = String(value ?? "");
  if (!/^[A-Za-z0-9._+-]+$/.test(text)) {
    throw new Error(`${label} contains unsafe characters`);
  }
  if (basename(text) !== text) {
    throw new Error(`${label} must not contain path separators`);
  }
  return text;
}

function safeSha256(value) {
  const text = String(value ?? "");
  if (!/^[a-f0-9]{64}$/.test(text)) {
    throw new Error("SHA-256 digest is missing or invalid");
  }
  return text;
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

function requireValue(argv, index, flag) {
  const value = argv[index];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

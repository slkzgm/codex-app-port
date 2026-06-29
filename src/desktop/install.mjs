import { copyFile, lstat, mkdir, readdir, realpath, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import process from "node:process";

export const DEFAULT_INSTALL_DIR = ".local/share/codex-app-port";
export const DEFAULT_DESKTOP_DIR = ".local/share/applications";
export const DESKTOP_FILENAME = "codex-app-port.desktop";
export const URL_HANDLER_DESKTOP_FILENAME = "codex-app-port-url-handler.desktop";

const COPY_ENTRIES = ["assets", "package.json", "scripts", "src", "ui"];

export function installUsage() {
  return `Usage: node scripts/install-local.mjs [options]

Options:
  --home <path>         Home directory to install under (default: $HOME)
  --prefix <path>       Install directory (default: ~/.local/share/codex-app-port)
  --desktop-dir <path>  Desktop entry directory (default: ~/.local/share/applications)
  --no-desktop          Copy runtime files without writing a desktop entry
  --url-handler         Write a user-scoped codex-app-port:// handler entry
  --dry-run             Print the plan without writing files
  --json                Print machine-readable output
  -h, --help            Show this help
`;
}

export function parseInstallArgs(argv, env = process.env) {
  const home = env.HOME || "";
  const options = {
    home,
    prefix: null,
    desktopDir: null,
    desktop: true,
    urlHandler: false,
    dryRun: false,
    json: false,
    sourceRoot: resolve(new URL("../../", import.meta.url).pathname),
    nodeBin: "node",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case "--home":
        options.home = requireValue(argv, ++i, arg);
        break;
      case "--prefix":
        options.prefix = requireValue(argv, ++i, arg);
        break;
      case "--desktop-dir":
        options.desktopDir = requireValue(argv, ++i, arg);
        break;
      case "--no-desktop":
        options.desktop = false;
        break;
      case "--url-handler":
        options.urlHandler = true;
        break;
      case "--dry-run":
        options.dryRun = true;
        break;
      case "--json":
        options.json = true;
        break;
      default:
        throw new Error(`Unknown option: ${arg}\n\n${installUsage()}`);
    }
  }

  return normalizeInstallOptions(options);
}

export function normalizeInstallOptions(options = {}) {
  const home = resolveRequiredPath(options.home, "home");
  const installDir = resolve(home, options.prefix || DEFAULT_INSTALL_DIR);
  const desktopDir = resolve(home, options.desktopDir || DEFAULT_DESKTOP_DIR);
  const sourceRoot = resolveRequiredPath(options.sourceRoot, "source root");

  assertInsideHome(installDir, home, "install directory");
  assertInsideHome(desktopDir, home, "desktop directory");
  assertNotSamePath(installDir, home, "install directory");
  assertNotSamePath(desktopDir, home, "desktop directory");
  if (options.desktop === false && options.urlHandler) {
    throw new Error("URL handler registration requires desktop entry installation");
  }

  return {
    home,
    installDir,
    desktopDir,
    desktopPath: join(desktopDir, DESKTOP_FILENAME),
    urlHandlerDesktopPath: join(desktopDir, URL_HANDLER_DESKTOP_FILENAME),
    desktop: options.desktop !== false,
    urlHandler: Boolean(options.urlHandler),
    dryRun: Boolean(options.dryRun),
    json: Boolean(options.json),
    sourceRoot,
    nodeBin: options.nodeBin || "node",
  };
}

export async function installLocal(options = {}) {
  const normalized = normalizeInstallOptions(options);
  const plan = await buildInstallPlan(normalized);

  if (normalized.dryRun) {
    return plan;
  }

  await mkdir(normalized.installDir, { recursive: true });
  for (const entry of COPY_ENTRIES) {
    await copyTree(join(normalized.sourceRoot, entry), join(normalized.installDir, entry));
  }

  if (normalized.desktop) {
    await mkdir(dirname(normalized.desktopPath), { recursive: true });
    await writeFile(normalized.desktopPath, plan.desktopEntry, { mode: 0o644 });
    if (normalized.urlHandler) {
      await writeFile(normalized.urlHandlerDesktopPath, plan.urlHandlerDesktopEntry, { mode: 0o644 });
    }
  }

  return {
    ...plan,
    written: true,
  };
}

export async function buildInstallPlan(options = {}) {
  const normalized = normalizeInstallOptions(options);
  await assertReadableDirectory(normalized.sourceRoot, "source root");
  for (const entry of COPY_ENTRIES) {
    await assertAllowedSourceEntry(normalized.sourceRoot, entry);
  }

  return {
    ok: true,
    written: false,
    installDir: normalized.installDir,
    desktopDir: normalized.desktopDir,
    desktopPath: normalized.desktop ? normalized.desktopPath : null,
    urlHandlerDesktopPath:
      normalized.desktop && normalized.urlHandler ? normalized.urlHandlerDesktopPath : null,
    copyEntries: [...COPY_ENTRIES],
    desktopEntry: normalized.desktop ? buildDesktopEntry(normalized) : null,
    urlHandlerDesktopEntry:
      normalized.desktop && normalized.urlHandler ? buildUrlHandlerDesktopEntry(normalized) : null,
    guardrails: {
      network: false,
      sudo: false,
      globalPackages: false,
      urlHandler: normalized.urlHandler,
      officialCodexUrlHandler: false,
      startsServerFromUrl: false,
      electronSandboxDisabled: false,
      symlinksAllowed: false,
    },
  };
}

export function buildUrlHandlerDesktopEntry({ installDir, nodeBin = "node" }) {
  const handlerPath = join(installDir, "scripts", "url-handler.mjs");
  const iconPath = join(installDir, "assets", "app-icon.svg");
  return `[Desktop Entry]
Type=Application
Name=Codex App Port URL Handler
Comment=Open validated codex-app-port links in the local UI
NoDisplay=true
Exec=${quoteDesktopExecArg(nodeBin)} ${quoteDesktopExecArg(handlerPath)} --open %u
Icon=${quoteDesktopExecArg(iconPath)}
Terminal=false
MimeType=x-scheme-handler/codex-app-port;
Categories=Development;
StartupNotify=false
`;
}

export function buildDesktopEntry({ installDir, nodeBin = "node" }) {
  const launcherPath = join(installDir, "scripts", "desktop-launcher.mjs");
  const iconPath = join(installDir, "assets", "app-icon.svg");
  return `[Desktop Entry]
Type=Application
Name=Codex App Port
Comment=Local Codex app-server UI for Omarchy/Linux
Exec=${quoteDesktopExecArg(nodeBin)} ${quoteDesktopExecArg(launcherPath)}
Icon=${quoteDesktopExecArg(iconPath)}
Terminal=false
Categories=Development;
StartupNotify=false
`;
}

export function quoteDesktopExecArg(value) {
  const text = String(value);
  if (/^[A-Za-z0-9_./:-]+$/.test(text)) {
    return text;
  }
  return `"${text.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
}

async function copyTree(source, destination) {
  const info = await lstat(source);
  if (info.isSymbolicLink()) {
    throw new Error(`Refusing to copy symlink: ${source}`);
  }
  if (info.isDirectory()) {
    await mkdir(destination, { recursive: true });
    const entries = await readdir(source, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isSymbolicLink()) {
        throw new Error(`Refusing to copy symlink: ${join(source, entry.name)}`);
      }
      await copyTree(join(source, entry.name), join(destination, entry.name));
    }
    return;
  }
  if (!info.isFile()) {
    throw new Error(`Refusing to copy non-file entry: ${source}`);
  }
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
}

async function assertAllowedSourceEntry(sourceRoot, entry) {
  if (!COPY_ENTRIES.includes(entry)) {
    throw new Error(`Unexpected install entry: ${entry}`);
  }
  const source = join(sourceRoot, entry);
  const info = await lstat(source);
  if (info.isSymbolicLink()) {
    throw new Error(`Refusing to install symlink entry: ${entry}`);
  }
  if (!info.isDirectory() && !info.isFile()) {
    throw new Error(`Install entry is neither file nor directory: ${entry}`);
  }
  const root = await realpath(sourceRoot);
  const realSource = await realpath(source);
  if (relative(root, realSource).startsWith("..")) {
    throw new Error(`Install entry escapes source root: ${entry}`);
  }
}

async function assertReadableDirectory(path, label) {
  const info = await lstat(path);
  if (!info.isDirectory()) {
    throw new Error(`${label} must be a directory`);
  }
}

function assertInsideHome(path, home, label) {
  const rel = relative(home, path);
  if (!rel || rel === ".." || rel.startsWith(`..${sep}`)) {
    throw new Error(`${label} must be inside the selected home directory`);
  }
}

function assertNotSamePath(path, other, label) {
  if (path === other) {
    throw new Error(`${label} must not be the home directory`);
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

function requireValue(argv, index, flag) {
  const value = argv[index];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

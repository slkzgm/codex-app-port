import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import {
  buildDesktopEntry,
  buildUrlHandlerDesktopEntry,
  installLocal,
  parseInstallArgs,
  quoteDesktopExecArg,
} from "../src/desktop/install.mjs";

test("parseInstallArgs defaults to local user install paths", () => {
  const options = parseInstallArgs(["--dry-run"], {
    HOME: "/tmp/codex-home",
  });

  assert.equal(options.home, "/tmp/codex-home");
  assert.equal(options.installDir, "/tmp/codex-home/.local/share/codex-app-port");
  assert.equal(options.desktopDir, "/tmp/codex-home/.local/share/applications");
  assert.equal(options.desktopPath, "/tmp/codex-home/.local/share/applications/codex-app-port.desktop");
  assert.equal(
    options.urlHandlerDesktopPath,
    "/tmp/codex-home/.local/share/applications/codex-app-port-url-handler.desktop",
  );
  assert.equal(options.desktop, true);
  assert.equal(options.urlHandler, false);
  assert.equal(options.dryRun, true);
});

test("parseInstallArgs refuses install targets outside the selected home", () => {
  assert.throws(
    () =>
      parseInstallArgs(["--prefix", "/opt/codex-app-port"], {
        HOME: "/tmp/codex-home",
      }),
    /inside the selected home/,
  );
  assert.throws(
    () =>
      parseInstallArgs(["--desktop-dir", "/usr/share/applications"], {
        HOME: "/tmp/codex-home",
      }),
    /inside the selected home/,
  );
});

test("parseInstallArgs allows ordinary names containing dot characters", () => {
  const options = parseInstallArgs(["--prefix", ".local/share/codex..app"], {
    HOME: "/tmp/codex-home",
  });
  assert.equal(options.installDir, "/tmp/codex-home/.local/share/codex..app");
});

test("buildDesktopEntry uses safe launcher without URL handler", () => {
  const content = buildDesktopEntry({
    installDir: "/home/example/.local/share/codex app port",
    nodeBin: "node",
  });

  assert.match(content, /Type=Application/);
  assert.match(content, /Exec=node "\/home\/example\/.local\/share\/codex app port\/scripts\/desktop-launcher.mjs"/);
  assert.match(content, /Icon="\/home\/example\/.local\/share\/codex app port\/assets\/app-icon\.svg"/);
  assert.equal(content.includes("MimeType="), false);
  assert.equal(content.includes("x-scheme-handler"), false);
  assert.equal(content.includes(`--no-${"sandbox"}`), false);
});

test("buildUrlHandlerDesktopEntry registers only the local port scheme", () => {
  const content = buildUrlHandlerDesktopEntry({
    installDir: "/home/example/.local/share/codex app port",
    nodeBin: "node",
  });

  assert.match(content, /NoDisplay=true/);
  assert.match(content, /Exec=node "\/home\/example\/.local\/share\/codex app port\/scripts\/url-handler\.mjs" --open %u/);
  assert.match(content, /MimeType=x-scheme-handler\/codex-app-port;/);
  assert.equal(content.includes("x-scheme-handler/codex;"), false);
  assert.equal(content.includes(`--no-${"sandbox"}`), false);
});

test("quoteDesktopExecArg quotes only when needed", () => {
  assert.equal(quoteDesktopExecArg("node"), "node");
  assert.equal(quoteDesktopExecArg("/path/with space/node"), '"/path/with space/node"');
  assert.equal(quoteDesktopExecArg('/path/with"quote'), '"/path/with\\"quote"');
});

test("installLocal copies runtime files and writes a user desktop entry", async () => {
  const home = await mkdtemp(join(tmpdir(), "codex-install-home-"));
  try {
    const result = await installLocal({
      home,
      sourceRoot: new URL("../", import.meta.url).pathname,
    });

    assert.equal(result.written, true);
    assert.deepEqual(result.copyEntries, ["assets", "package.json", "scripts", "src", "ui"]);
    const launcher = await readFile(
      join(home, ".local/share/codex-app-port/scripts/desktop-launcher.mjs"),
      "utf8",
    );
    assert.match(launcher, /desktop launcher failed/);
    const icon = await readFile(
      join(home, ".local/share/codex-app-port/assets/app-icon.svg"),
      "utf8",
    );
    assert.match(icon, /<svg/);
    assert.equal((await stat(join(home, ".local/share/codex-app-port/assets/app-icon.svg"))).isFile(), true);

    const desktop = await readFile(
      join(home, ".local/share/applications/codex-app-port.desktop"),
      "utf8",
    );
    assert.match(desktop, /Exec=node .*scripts\/desktop-launcher\.mjs/);
    assert.match(desktop, /Icon=.*assets\/app-icon\.svg/);
    assert.equal(desktop.includes("MimeType="), false);
    assert.equal(desktop.includes("x-scheme-handler"), false);
    assert.equal(desktop.includes(`--no-${"sandbox"}`), false);
  } finally {
    await rm(home, { recursive: true, force: true });
  }
});

test("installLocal can write an opt-in user URL handler entry", async () => {
  const home = await mkdtemp(join(tmpdir(), "codex-install-url-home-"));
  try {
    const result = await installLocal({
      home,
      sourceRoot: new URL("../", import.meta.url).pathname,
      urlHandler: true,
    });

    assert.equal(result.written, true);
    assert.equal(result.guardrails.urlHandler, true);
    assert.equal(result.guardrails.officialCodexUrlHandler, false);
    assert.equal(result.guardrails.startsServerFromUrl, false);
    assert.match(result.urlHandlerDesktopEntry, /x-scheme-handler\/codex-app-port/);
    assert.equal(result.urlHandlerDesktopEntry.includes("x-scheme-handler/codex;"), false);

    const handlerDesktop = await readFile(
      join(home, ".local/share/applications/codex-app-port-url-handler.desktop"),
      "utf8",
    );
    assert.match(handlerDesktop, /scripts\/url-handler\.mjs"? --open %u/);
    assert.match(handlerDesktop, /MimeType=x-scheme-handler\/codex-app-port;/);
    assert.equal(handlerDesktop.includes("x-scheme-handler/codex;"), false);
  } finally {
    await rm(home, { recursive: true, force: true });
  }
});

test("installLocal dry run does not write files", async () => {
  const home = await mkdtemp(join(tmpdir(), "codex-install-dry-run-"));
  try {
    const result = await installLocal({
      home,
      sourceRoot: new URL("../", import.meta.url).pathname,
      dryRun: true,
    });

    assert.equal(result.written, false);
    assert.match(result.desktopEntry, /Codex App Port/);
    await assert.rejects(
      () => readFile(join(home, ".local/share/applications/codex-app-port.desktop"), "utf8"),
      /ENOENT/,
    );
  } finally {
    await rm(home, { recursive: true, force: true });
  }
});

test("installLocal refuses source symlinks", async () => {
  const sourceRoot = await mkdtemp(join(tmpdir(), "codex-install-source-"));
  const home = await mkdtemp(join(tmpdir(), "codex-install-home-"));
  try {
    await symlink(new URL("../assets", import.meta.url).pathname, join(sourceRoot, "assets"));
    await assert.rejects(
      () => installLocal({ home, sourceRoot, dryRun: true }),
      /symlink/,
    );
  } finally {
    await rm(sourceRoot, { recursive: true, force: true });
    await rm(home, { recursive: true, force: true });
  }
});

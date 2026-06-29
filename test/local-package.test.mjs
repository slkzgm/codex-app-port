import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import {
  packageArch,
  validateArchPkgbuild,
} from "../src/desktop/arch-package.mjs";
import {
  buildPackagePlan,
  packageLocal,
  parsePackageArgs,
} from "../src/desktop/package.mjs";

test("parsePackageArgs defaults to local dist archive", async () => {
  const options = await parsePackageArgs(["--dry-run"], { TAR: "/tmp/unsafe-tar" });

  assert.equal(options.name, "codex-app-port");
  assert.equal(options.version, "0.1.0");
  assert.equal(options.outDir.endsWith("/dist"), true);
  assert.equal(options.dryRun, true);
  assert.equal(options.tarBin, "tar");
});

test("buildPackagePlan refuses unsafe package names", async () => {
  await assert.rejects(
    () =>
      parsePackageArgs(["--name", "../../codex-app-port"], {}),
    /package name/,
  );
});

test("buildPackagePlan refuses output inside packaged source entries", async () => {
  const repoRoot = new URL("../", import.meta.url).pathname;
  await assert.rejects(
    () =>
      buildPackagePlan({
        sourceRoot: repoRoot,
        outDir: join(repoRoot, "src", "dist"),
      }),
    /output directory/,
  );
});

test("packageLocal creates a tarball, checksum, and manifest", async () => {
  const outDir = await mkdtemp(join(tmpdir(), "codex-package-out-"));
  const repoRoot = new URL("../", import.meta.url).pathname;
  try {
    const result = await packageLocal({
      sourceRoot: repoRoot,
      outDir,
    });

    assert.equal(result.written, true);
    assert.equal(result.archiveFilename, "codex-app-port-0.1.0.tar.gz");
    assert.match(result.sha256, /^[a-f0-9]{64}$/);
    assert.deepEqual(result.guardrails, {
      network: false,
      sudo: false,
      globalPackages: false,
      autoUpdate: false,
      urlHandler: false,
      symlinksAllowed: false,
    });

    const checksum = await readFile(result.sha256Path, "utf8");
    assert.equal(checksum, `${result.sha256}  ${result.archiveFilename}\n`);
    const archive = await readFile(result.archivePath);
    assert.equal(archive.length > 0, true);
  } finally {
    await rm(outDir, { recursive: true, force: true });
  }
});

test("packageLocal dry run does not write archive files", async () => {
  const repoRoot = new URL("../", import.meta.url).pathname;
  const plan = await buildPackagePlan({
    sourceRoot: repoRoot,
    dryRun: true,
  });

  assert.equal(plan.written, false);
  assert.equal(plan.packageEntries.includes("assets"), true);
  assert.equal(plan.packageEntries.includes("src"), true);
  assert.equal(plan.guardrails.autoUpdate, false);
});

test("packageLocal refuses source symlinks", async () => {
  const sourceRoot = await mkdtemp(join(tmpdir(), "codex-package-source-"));
  try {
    await writeFile(join(sourceRoot, ".gitignore"), "dist/\n", "utf8");
    await writeFile(join(sourceRoot, "README.md"), "# Test\n", "utf8");
    await writeFile(
      join(sourceRoot, "package.json"),
      JSON.stringify({ name: "codex-app-port", version: "0.1.0" }),
      "utf8",
    );
    for (const entry of ["docs", "packaging", "scripts", "src", "test", "ui"]) {
      await mkdir(join(sourceRoot, entry), { recursive: true });
    }
    await symlink(new URL("../assets", import.meta.url).pathname, join(sourceRoot, "assets"));
    await assert.rejects(
      () => packageLocal({ sourceRoot, dryRun: true }),
      /symlink/,
    );
  } finally {
    await rm(sourceRoot, { recursive: true, force: true });
  }
});

test("packageArch creates a local Arch PKGBUILD with checksum guardrails", async () => {
  const outDir = await mkdtemp(join(tmpdir(), "codex-arch-package-out-"));
  const repoRoot = new URL("../", import.meta.url).pathname;
  try {
    const result = await packageArch({
      sourceRoot: repoRoot,
      outDir,
    });

    assert.equal(result.written, true);
    assert.equal(result.sourceLocal, true);
    assert.equal(result.pkgbuildPath.endsWith("/PKGBUILD"), true);
    assert.equal(result.archiveFilename, "codex-app-port-0.1.0.tar.gz");
    assert.match(result.sha256, /^[a-f0-9]{64}$/);
    assert.deepEqual(result.guardrails, {
      network: false,
      sudo: false,
      postInstall: false,
      systemd: false,
      packageManagerInstall: false,
      autoUpdate: false,
      urlHandler: false,
      scriptInstallsPackage: false,
    });

    const pkgbuild = await readFile(result.pkgbuildPath, "utf8");
    assert.equal(validateArchPkgbuild(pkgbuild, { archiveFilename: result.archiveFilename }), true);
    assert.match(pkgbuild, /source=\('codex-app-port-0\.1\.0\.tar\.gz'\)/);
    assert.match(pkgbuild, new RegExp(`sha256sums=\\('${result.sha256}'\\)`));
    assert.match(pkgbuild, /\/opt\/codex-app-port/);
    for (const forbidden of [
      "SKIP",
      "post_install",
      "install=",
      "curl",
      "systemctl",
      "xdg-mime",
      "MimeType=",
    ]) {
      assert.equal(pkgbuild.includes(forbidden), false, `PKGBUILD included ${forbidden}`);
    }
  } finally {
    await rm(outDir, { recursive: true, force: true });
  }
});

test("validateArchPkgbuild rejects skipped checksums and install hooks", () => {
  const safe = `pkgname=codex-app-port
pkgver=0.1.0
source=('codex-app-port-0.1.0.tar.gz')
sha256sums=('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
package() {
  install -dm755 "$pkgdir/opt/codex-app-port"
}
`;

  assert.equal(validateArchPkgbuild(safe, { archiveFilename: "codex-app-port-0.1.0.tar.gz" }), true);
  assert.throws(
    () => validateArchPkgbuild(safe.replace(/a{64}/, "SKIP")),
    /skip SHA-256/,
  );
  assert.throws(
    () => validateArchPkgbuild(`${safe}\npost_install() { systemctl restart test; }\n`),
    /forbidden install hook function/,
  );
  assert.throws(
    () => validateArchPkgbuild(safe.replace("source=('codex", "source=('https://example.invalid/codex")),
    /local archive/,
  );
});

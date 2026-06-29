# Static Audit: areu01or00/Codex-App-Linux

Date: 2026-05-16

Repository: `https://github.com/areu01or00/Codex-App-Linux`

Audited commit: `9fde221c2dca49282a453c815a273658ff709ca7`

Files present:

- `install-codex-linux.sh`
- `README.md`
- `Reverse-engineering-guide.md`
- `.gitignore`
- `demo/codex-mobile-pairing.png`

No code from this repository was executed.

## Checks Performed

- Cloned the repository into `/tmp/codex-app-linux-audit`.
- Reviewed the current installer script and docs.
- Reviewed full commit history after unshallowing the clone.
- Searched for network fetches, shell execution, global installs, token/secret
  handling, destructive file operations, URL handler registration, and sandbox
  flags.
- Computed current file hashes:
  - `install-codex-linux.sh`:
    `acd6d82906e9c30323aa2687a37641777e9c0119a2a90127886540dcc214195e`
  - `README.md`:
    `c9a44ca6c8be9be5ccc6d266c6c0610cd56c432dfabfaf720b35b615bd2ef925`
  - `Reverse-engineering-guide.md`:
    `74814d5b93171c7c378ffed0b67655ba2ca696c842a9eba732465446cd3588a8`
  - `.gitignore`:
    `f3509b334c0ce31c04937331b3fcd17287b8fbc53c0babe3f56c45ef701aee5b`
  - `demo/codex-mobile-pairing.png`:
    `ee41c29f55cd54da7b14713a2a6964aa85f540f7a7cf56843066dc30f6a57b04`

## Findings

### High Risk: Remote Script Execution Pattern

The README recommends a `curl ... | bash` install path. That is not acceptable
for this project because it removes review, pinning, and rollback.

### High Risk: Unpinned Network Dependencies

The installer downloads:

- the latest Codex DMG from OpenAI CDN
- a portable 7zip tarball
- npm packages through `npm install`
- `@electron/asar` through `npm exec --yes`
- `@openai/codex@latest` through `npx` fallback

These are legitimate-looking dependencies, but the flow is not reproducible or
locked.

### High Risk: Global Install Attempt

If `codex` is not found, the installer attempts `npm install -g
@openai/codex@latest`. This mutates host state and depends on live package
resolution.

### High Risk: Electron Runs With `--no-sandbox`

The generated launcher runs Electron with `--no-sandbox`. That may be necessary
in some packaging contexts, but it is a major hardening regression for a desktop
app that handles credentials, local files, terminal I/O, and rendered web UI.

### Medium Risk: Patching Minified Web Assets

The installer modifies extracted production bundles to expose mobile pairing
feature gates on Linux. This is fragile and should not be inherited without
re-validating the exact upstream bundle and feature semantics.

### Medium Risk: Desktop URL Handler Registration

The installer writes a `.desktop` file and registers `x-scheme-handler/codex`.
This is expected for auth callbacks, but it affects host desktop state and needs
strict callback validation in our implementation.

### Medium Risk: Destructive Output Replacement

The installer removes the selected output directory with `rm -rf "$OUTPUT_DIR"`.
The argument is quoted, but our installer should still add path guards to prevent
accidental deletion of important directories.

## Positive Notes

- The repository is small and easy to audit.
- It does not vendor OpenAI app binaries.
- It uses the official OpenAI CDN for the DMG URL.
- It stores build diagnostics including DMG SHA-256.
- The main installer is straightforward Bash/Node glue, not obfuscated code.

## Decision

Do not execute or import this installer as-is.

Use it as research material only. If a compatibility packager is later needed,
write our own smaller implementation with pinned artifacts, isolated builds, no
global installs, no `@latest`, explicit path guards, and a documented sandbox
strategy.


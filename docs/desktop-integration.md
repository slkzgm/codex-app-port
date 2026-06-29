# Desktop Integration

The current launcher is local and non-installing:

```sh
npm run launch
```

It starts the loopback UI server in the foreground and opens the local URL with
`xdg-open`. Closing the launcher process stops the server.

For terminal-only testing:

```sh
npm run launch -- --no-open
```

The launcher accepts the same workspace selection inputs as the dev server:

```sh
npm run launch -- --workspace /absolute/path/to/repo
npm run launch -- --project-root /absolute/path/to/projects
```

`--project-root` discovery is opt-in and server-side; only direct child Git
projects are added to the workspace selector, and the browser receives opaque
workspace ids plus basename labels rather than absolute paths.

The launcher also wires the same persistent sanitized audit logs as the dev
server. By default they are under
`${XDG_STATE_HOME:-~/.local/state}/codex-app-port/actions.jsonl` and
`${XDG_STATE_HOME:-~/.local/state}/codex-app-port/approval-decisions.jsonl`.
Override them explicitly when needed:

```sh
npm run launch -- --action-audit-log /path/to/actions.jsonl
npm run launch -- --approval-audit-log /path/to/approval-decisions.jsonl
```

The action log is checked for append safety before local or app-server
mutations. The approval log is used for durable replay checks before forwarded
managed decisions. Neither log stores prompts, command text, file contents,
full ids, paths, preflight tokens, decision tokens, raw approval details, or raw
app-server payloads.

## Local User Install

Preview the install plan:

```sh
npm run install:local -- --dry-run
```

Install for the current user:

```sh
npm run install:local
```

The installer copies only the runtime files to
`~/.local/share/codex-app-port` and writes
`~/.local/share/applications/codex-app-port.desktop`. It does not use sudo,
fetch network artifacts, install global packages, register URL handlers, or
remove existing directories. Source symlinks are refused during copy so the
installer cannot accidentally pull files from outside the repository runtime
tree.

The installed desktop entry references the local SVG icon copied to
`~/.local/share/codex-app-port/assets/app-icon.svg`.

For isolated testing:

```sh
npm run install:local -- --home /tmp/codex-app-port-home --dry-run --json
```

## Local Release Package

Preview the release archive plan:

```sh
npm run package:local -- --dry-run --json
```

Build the local release archive:

```sh
npm run package:local -- --json
```

The packager writes `dist/codex-app-port-0.1.0.tar.gz` and
`dist/codex-app-port-0.1.0.tar.gz.sha256`. The archive contains an internal
`package-manifest.json` with the package entries, guardrails, and update
policy. It copies only an allowlisted set of repo entries and refuses symlinks,
so local files outside the runtime tree are not pulled into the release.

The local release package does not fetch network artifacts, use sudo, install
global packages, register URL handlers, or enable automatic updates. Updates
remain operator-driven and must be verified against the published SHA-256
digest before replacing an installed runtime tree.

## Arch/Omarchy Package Recipe

Build the local Arch recipe:

```sh
npm run package:arch -- --json
```

The generator writes `dist/arch/PKGBUILD`, a fresh
`dist/arch/codex-app-port-0.1.0.tar.gz`, and its `.sha256` sidecar. The
PKGBUILD consumes only that adjacent local archive, pins the SHA-256 digest, and
copies the runtime tree under `/opt/codex-app-port` with the packaged Omarchy
desktop template. It contains no install script, post-install hook, network
source, downloader, `sudo`, `systemctl`, package-manager install, automatic
updater, or URL handler registration.

`makepkg` and any package installation command are intentionally not run by the
project scripts. The operator reviews `dist/arch/PKGBUILD`, builds it locally,
and installs the resulting package manually if desired.

## Omarchy Desktop Entry

Template:

```text
packaging/omarchy/codex-app-port.desktop
```

The packaged template assumes the project is installed under
`/opt/codex-app-port`. The local installer generates a separate user desktop
entry with the actual `~/.local/share/codex-app-port` path.

Before installing the template, update `Exec=` and `Icon=` to the actual project
path if it is not `/opt/codex-app-port`.

## Update Policy

There is no automatic updater in the current port. Updates are manual,
operator-driven replacements of the local source or installed runtime tree,
followed by:

```sh
npm run verify
npm run install:local
```

Future packaged releases must be pinned by version and digest. Any update
metadata, downloader, or self-update flow must go through the same threat model
as third-party installers before it is enabled.

## URL Handler

The repo includes a validate-only handler by default:

```sh
npm run url:validate -- --json 'codex-app-port://thread/b0153f06?workspace=default'
```

It accepts only the local `codex-app-port://` scheme, rejects the official
`codex://` scheme until callback behavior is audited, rejects callback/auth
parameters, and always returns `accepted: false`. It does not open a browser,
start the server, call app-server, execute commands, or register a desktop URL
handler.

For user-scoped Linux integration, opt in during local install:

```sh
npm run install:local -- --url-handler
```

This writes a separate hidden desktop entry,
`~/.local/share/applications/codex-app-port-url-handler.desktop`, with
`MimeType=x-scheme-handler/codex-app-port;`. It does not register the official
`codex://` scheme. The handler validates the URL, rejects unknown or
callback/auth parameters, then opens a loopback UI URL such as
`http://127.0.0.1:14570/#thread=b0153f06&workspace=default` with `xdg-open`.
It does not start the server, call app-server, send model traffic, or execute
commands.

## Guardrails

- The launcher uses the same loopback-only server guard as `npm run dev`.
- Non-loopback binds require `CODEX_APP_PORT_ALLOW_NON_LOOPBACK=1`.
- Agent-turn remains disabled unless `CODEX_APP_PORT_ALLOW_AGENT_TURN=1` is set
  before launch.
- URL handler registration is user-scoped, opt-in, and limited to
  `codex-app-port://`; the packaged Omarchy template still avoids scheme
  registration by default.
- No global packages are installed.
- No automatic updater is installed or enabled.
- The local installer is user-scoped and refuses install targets outside the
  selected home directory.
- Desktop launcher audit logs use `XDG_STATE_HOME` or explicit paths; runtime
  files stay under `~/.local/share/codex-app-port` for the local installer.

`npm run verify` validates that the desktop template still points at the safe
launcher and local icon, that the desktop launcher wires persistent sanitized
audit logs, that the local installer can dry-run and install into a temporary
home, that the local package can dry-run and build with a checksum, and that
neither desktop entry registers URL handlers.

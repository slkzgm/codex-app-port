# App Server Smoke Client

The first executable artifact is a dependency-free JSONL-RPC smoke client for
the official `codex app-server` transport.

Run:

```sh
npm run smoke:app-server
```

The default probe:

1. starts `codex app-server --listen stdio://`
2. sends `initialize`
3. sends the required `initialized` notification
4. reads effective config with `config/read`
5. counts active and archived thread metadata with `thread/list`

It does not install packages, mutate Codex config, start an agent turn, execute
commands, or expose a socket.
Responses are normalized through `src/app-server/protocol.mjs`, which currently
covers only the app-server methods exercised by this prototype.

Useful options:

```sh
npm run smoke:app-server -- --json
npm run smoke:app-server -- --no-readonly
npm run smoke:app-server -- --codex /absolute/path/to/codex
```

The output is intentionally sanitized. It summarizes config and thread counts
instead of dumping full config, instructions, thread previews, repository paths,
`codexHome`, `userAgent`, or auth state.

## Opt-In Agent Turn Probe

There is an intentionally gated probe for `thread/start` and `turn/start`:

```sh
CODEX_APP_PORT_ALLOW_AGENT_TURN=1 npm run smoke:app-server -- --allow-agent-turn
```

This is disabled by default because it can use authenticated model traffic. When
enabled, it creates a temporary workspace, starts an ephemeral thread with
`sandbox: "read-only"` and `approvalPolicy: "on-request"`, sends a minimal
"reply PONG" turn, waits for `turn/completed`, and removes the temporary
workspace.

Unexpected server requests are rejected by the smoke client, so approval flows
cannot silently proceed.

## Verified Locally

On 2026-06-29, the smoke client and schema generator were recalibrated against
local `codex-cli 0.142.4` on Linux. The generated app-server snapshot contains
335 JSON Schema files. The smoke path confirms:

- stdio JSONL transport works
- the wire format omits the `jsonrpc` field
- `initialize` returns `platformOs: "linux"`
- `initialized` triggers a remote-control status notification
- `config/read` and `thread/list` respond after the initialization lifecycle is
  completed

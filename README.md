# Codex App Port for Omarchy

This repository tracks a Linux/Omarchy port of the Codex desktop app experience.

Security posture: treat every third-party installer, extracted application
bundle, generated dependency tree, and remote update flow as untrusted until it
has been reviewed, pinned, and reproduced locally.

## Current Direction

Prefer a native Linux client built around the official open-source Codex
app-server protocol. Use existing unofficial Linux ports only as research
material, not as code to execute.

Why:

- OpenAI documents Codex App Server as the interface used by rich clients.
- The app-server protocol covers authentication, history, approvals, and
  streamed agent events.
- A native client avoids patching minified proprietary desktop bundles.
- Omarchy support can be designed directly for Linux, Wayland, desktop entries,
  URL handlers, and package management.

## Checked Sources

- OpenAI Codex app documentation, checked 2026-06-29.
- OpenAI Codex changelog, checked 2026-06-29.
- OpenAI Codex open-source documentation, checked 2026-06-29.
- OpenAI `openai/codex` repository at `ccdfb4f342a2e659be7ab878309cc5d81683d737`.
- Local official `codex app-server` schema snapshot from `codex-cli 0.142.4`
  with 335 JSON Schema files.
- Unofficial `areu01or00/Codex-App-Linux` repository at
  `9fde221c2dca49282a453c815a273658ff709ca7`.

## Repo Map

- `package.json`: dependency-free Node scripts for protocol smoke testing.
- `scripts/app-server-smoke.mjs`: local `codex app-server` smoke client.
- `scripts/dev-server.mjs`: loopback dev server for the local UI shell.
- `scripts/desktop-launcher.mjs`: foreground desktop launcher for the local UI.
- `scripts/goal-audit.mjs`: objective checklist for completion evidence.
- `scripts/install-local.mjs`: user-scoped Omarchy desktop install helper.
- `scripts/package-local.mjs`: local release tarball and SHA-256 packager.
- `scripts/url-handler.mjs`: local `codex-app-port://` URL handler validator
  and opt-in opener for the user-scoped desktop entry.
- `assets/app-icon.svg`: local desktop icon used by the install helper and
  Omarchy desktop template.
- `src/app-server/jsonl-rpc.mjs`: small JSONL-RPC transport client.
- `src/app-server/protocol.mjs`: runtime contracts for the app-server subset
  currently used by the prototype.
- `src/workspace/git.mjs`: read-only Git metadata reader for allowlisted
  workspaces.
- `test/jsonl-rpc.test.mjs`: mock app-server tests for the transport client.
- `ui/`: dependency-free browser UI prototype.
- `docs/goal.md`: project goal, constraints, assumptions.
- `docs/architecture.md`: proposed implementation route.
- `docs/app-server-smoke.md`: usage and safety notes for the smoke client.
- `docs/dev-ui.md`: local UI server usage and guardrails.
- `docs/desktop-integration.md`: launcher and Omarchy `.desktop` notes.
- `docs/security/threat-model.md`: assets, threats, hard rules.
- `docs/audits/2026-05-16-codex-app-linux.md`: static audit notes for the
  referenced unofficial Linux port.

## Current Smoke Test

```sh
npm test
npm run smoke:app-server
npm run dev
npm run launch
npm run goal:audit
npm run install:local -- --dry-run
npm run package:local -- --dry-run --json
npm run package:arch -- --json
npm run verify
```

The smoke client starts the local `codex app-server` over stdio, performs the
required `initialize` / `initialized` handshake, and runs read-only probes. It
does not install dependencies, start agent turns, execute shell commands, or
open network listeners. App-server responses are normalized through local
runtime contracts before the prototype summarizes or exposes them.

The dev UI server binds to loopback and exposes only sanitized read-only status.
It exposes workspace ids from a server-side allowlist and rejects arbitrary
browser-provided paths. Thread detail reads are metadata-only: no transcript
text, thread titles, previews, file paths, or raw item payloads are returned.
Transcript reads use a separate route that returns only bounded user/assistant
message text with path-like strings redacted; raw app-server payloads and
file-change paths are still excluded. File-change review uses its own route
that exposes bounded change metadata, file basenames, and sanitized diff
previews. Diff text is line-capped, char-capped, path-redacted, and
secret-pattern-redacted; commands, file contents, unbounded raw patches, and
full paths remain excluded.
The workspace selector uses server-side allowlists: explicit `--workspace`
entries plus opt-in `--project-root` discovery of direct child Git projects.
Only opaque ids and basename labels reach the browser; arbitrary browser paths
are still rejected. The thread list shows active metadata by default, can
include archived metadata, and filters locally over sanitized
suffix/status/source/workspace fields only.
Server-side thread search is a separate, disabled-by-default surface. When the
server starts with `CODEX_APP_PORT_ALLOW_THREAD_SEARCH=1`, `/api/thread-search`
may send the entered search term to the local app-server `thread/search`
method, but the browser response is reduced to counts, cursor-presence
booleans, and bounded thread id suffix metadata. It never returns the search
term, snippets, thread names, previews, full ids, paths, cursors, raw thread
payloads, or raw app-server payloads.
The live event stream is bounded and emits sanitized notification metadata plus
bounded, path/secret-redacted agent-message deltas. Reasoning, command/process,
file-change, prompt, and user transcript deltas remain excluded. When a thread
is selected, the UI requests a suffix-filtered stream so unrelated thread
notifications are dropped server-side after sanitation.
Loaded-session inventory is blocked by default. When
`CODEX_APP_PORT_ALLOW_LOADED_SESSIONS=1` is explicitly set, `/api/live-sessions`
may call `thread/loaded/list` and returns only counts, pagination state, and
bounded thread id suffixes. It does not return full ids, prompts, transcript
content, titles, paths, terminal output, commands, or model traffic.
The same response includes a capped process-local history of live-session
controls performed through this server with action, method, suffix, status,
count, and token-consumption metadata only. It does not return preflight
tokens, prompt text, full ids, paths, or thread content.
It also includes a sanitized lifecycle summary for the UI: loaded-session
visibility, loaded/control counts, available control preflight status, and which
explicit interrupt/unsubscribe/steer gates are currently enabled. That summary
still returns no raw session identifiers, prompts, paths, or preflight tokens.
The same lifecycle includes an active-session management summary derived only
from suffix visibility, action gates, preflight requirements, bulk target scope,
and latest sanitized control metadata. It exposes no full ids, prompt text,
paths, preflight tokens, thread content, or raw app-server payloads.
It also exposes `activeSessionReadiness`, a UI readiness summary derived only
from the active-session operations and management summaries, with suffix-only
targets, dedicated control routes, one-time preflight requirements, enabled
operation counts, and the same redaction guarantees.
`activeSessionRoutingContract` renders the live-session route boundary from
those same sanitized summaries: loaded-session inventory route, dedicated
single-session and bulk control routes, model-traffic steer route, session
manager requirements, suffix-only targets, and one-time preflight requirements
without returning prompts, ids, paths, preflight tokens, thread content, raw
control payloads, or app-server payloads.
`activeSessionWorkflowContract` renders the live-session browser workflow from
the same summaries: client-side grouping for inventory, single-session
controls, bulk controls, and history, visible row controls, preflight
requirements, suffix-only targets, and route state. It returns no prompts, ids,
paths, preflight tokens, thread content, raw control payloads, or app-server
payloads.
`activeSessionSafetyContract` renders the live-session safety boundary from
the same summaries: gated-control state, required preflight tokens, dedicated
control routes, separate model-traffic opt-in for steering, session-manager
requirement for bulk controls, suffix-only targets, and no session-wide
controls. It returns no prompts, ids, paths, preflight tokens, thread content,
raw control payloads, or app-server payloads.
`activeSessionAuditContract` renders the live-session audit boundary from the
same summaries: bounded process-local control history, persistent action-audit
availability, sanitized action-audit guarantees, dedicated route requirements,
separate model-traffic opt-in for steering, and no session-wide controls. It
returns no prompts, ids, paths, preflight tokens, thread content, raw control
payloads, or app-server payloads.
Turn-session history has the same shape of read-only lifecycle summary:
`/api/turn-sessions` reports session counts, pending/decided approval counts,
returned event counts, latest sanitized status, and explicit turn-start/
session-manager/approval-forwarding gates. When the persistent session manager
is enabled, the same summary also reports sanitized managed-client state,
active-turn suffix metadata, notification counts, and pending/resolved approval
counts without prompts, full ids, paths, decision tokens, or raw events.
It also includes sanitized turn-session management metadata for the UI:
blocked/local/managed/history-only state, enabled operation counts, manager
counts, suffix-only target selection, and request-scoped approval gate flags
without preflight tokens, prompts, full ids, paths, decision tokens, raw
approval details, raw events, or app-server payloads.
`turnSessionReadiness` renders the same boundary as execution readiness:
blocked/local-ready/managed-ready/pending-approval/history state, turn-start
route, model-traffic gate, request-scoped approval state, and explicit
session-wide/exec/network/root-grant blocks, without widening execution or
returning prompts, full ids, paths, decision tokens, raw approval details, raw
events, or app-server payloads.
`turnSessionRoutingContract` renders the route contract from those same
sanitized summaries: local-probe versus session-manager routing, preflight and
decision-token requirements, request-scoped approval gates, manager counters,
and the explicit session-wide/exec/network/root-grant blocks, without returning
prompts, ids, paths, tokens, raw approval details, raw events, or app-server
payloads.
`turnSessionWorkflowContract` renders the browser workflow boundary from the
same safe summaries: client-side session grouping, local versus managed turn
start, pending-approval state, one-preflight-token-per-turn-action
requirements, request-scoped approval workflow visibility, and the same
privileged-scope blocks. It returns no prompts, ids, paths, tokens, raw
approval details, raw events, or app-server payloads.
`turnSessionSafetyContract` renders a compact safety boundary from the same
safe summaries: preflight-token requirements, model-traffic gate state,
request-scoped approval-token requirements, dedicated approval routing,
suffix-only targets, and the same rejected privileged scopes. It returns no
preflight tokens, prompts, ids, paths, decision tokens, raw approval details,
raw events, or app-server payloads.
`turnSessionAuditContract` renders a compact audit boundary from the same
safe summaries: bounded process-local session ledger state, persistent
approval-audit availability, preflight requirements, request-scoped approval
scope, sanitized live-event text policy, and the same rejected privileged
scopes. It returns no preflight tokens, prompts, ids, paths, decision tokens,
request keys, raw approval details, raw events, or app-server payloads.
The approval queue likewise includes `approvalDecisionContract`: a UI-facing
summary of the decision intake mode, accepted decision count, request-scoped
token/replay/audit gates, local/forwarded deny and accept-once availability,
and explicit privileged-scope blocks. It is derived from sanitized queue,
policy, and lifecycle counts only, and returns no decision tokens, request
keys, raw approval details, preview text, paths, prompts, ids, or app-server
payloads.
It also includes `approvalRoutingContract`, a sanitized routing summary for
local deny versus managed deny/accept-once forwarding. It reports only gate
state, request/history counts, route labels, replay/audit status, and the same
request-scoped privileged-scope blocks without returning decision tokens,
request keys, raw approval details, preview text, paths, prompts, ids, or
app-server payloads.
Live-session control is separate and blocked by default. When
`CODEX_APP_PORT_ALLOW_LIVE_SESSION_CONTROL=1` is set, `/api/live-session-control`
can consume a matching one-time preflight token and call only `turn/interrupt`
or `thread/unsubscribe` for a loaded thread suffix; it may read bounded thread
metadata to resolve a turn suffix, but returns no full ids, prompts, transcript
content, paths, terminal output, or model text. User-authored turn steering is
separately disabled by default; when `CODEX_APP_PORT_ALLOW_TURN_STEER=1` is set,
the same preflight/action route may call `turn/steer` with a bounded prompt and
explicit model-traffic metadata, while returning only prompt counts and suffixes
and never echoing prompt text, transcript content, full ids, paths, or terminal
output.
Bulk live-session unsubscribe is an even narrower separate gate. When both
`CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` and
`CODEX_APP_PORT_ALLOW_LIVE_SESSION_BULK_CONTROL=1` are set,
`/api/live-session-bulk-control` can consume a matching one-time
`/api/live-session-bulk-control-preflight` token and call only
`thread/unsubscribe` for the currently loaded sessions through the persistent
session manager. It returns only loaded/attempted/succeeded/failed counts and
method metadata; no thread suffix array, full ids, prompt text, transcript
content, paths, terminal output, or raw app-server payload is returned.
When launched through `scripts/dev-server.mjs` or the desktop launcher,
successful thread creation, thread archive/unarchive actions, thread deletion, thread forking, thread renaming,
individual and bulk live-session controls, allowlisted terminal command executions,
allowlisted process spawn executions, background terminal cleanup requests, and
local file actions are also written to a sanitized append-only action audit log
under the user state directory by default. Override it with
`--action-audit-log` or `CODEX_APP_PORT_ACTION_AUDIT_LOG`. The log is checked
for append safety before the app-server or local filesystem mutation and stores
only action/method/suffix/status/count and preflight-consumption metadata. It
never stores prompts, command text, argv, stdout/stderr, file contents,
preflight tokens, full ids, paths, terminal output, thread content, or file
basenames; the browser response never returns the audit path.
The Terminal & Actions panel exposes a schema-backed local audit of terminal,
process, shell, turn-control, and filesystem-write app-server methods.
Terminal sessions are not listed, thread shell stays blocked, and
command/exec stdin/resize/terminate calls require their separate
terminal-control opt-in gate. Process stdin/resize/kill controls require their
own separate process-terminal-control opt-in gate. `process/spawn` has a
separate disabled-by-default gate and exact executable allowlist.
Terminal lifecycle notifications received from opt-in turns or streams are
reduced to method names, suffixes, counts, exit codes, stream labels, and
redaction flags; raw output, stdin, command text, cwd, and process/session ids
are not returned. A
command preflight can validate a draft command shape locally and return only
command length and line counts; it does not echo the command, create a terminal
session, or call app-server. Action preflights issue short-lived local tokens
bound to a hashed intent for future mutation gates; raw intent is not stored or
returned.
`/api/terminal-command` is disabled unless
`CODEX_APP_PORT_ALLOW_TERMINAL_COMMAND=1` and
`CODEX_APP_PORT_TERMINAL_COMMAND_ALLOWLIST=cmd1,cmd2` are set before startup.
When enabled, it consumes the matching one-time command preflight token and
calls only `command/exec` with a shell-free argv vector, the selected workspace
cwd, a read-only sandbox policy, network disabled, no stdin, no PTY, no streamed
output, and an output cap. Browser responses and audit records return only
argument counts, exit code, stdout/stderr character counts, and policy flags;
they do not return the command text, executable, argv, cwd, environment,
process id, stdout, or stderr. `/api/terminal-actions` also exposes a
process-local recent command ledger with the same sanitized status/count
metadata only, never command text, argv, cwd, output, process ids, environment,
or preflight tokens.
`/api/process-spawn` is disabled unless
`CODEX_APP_PORT_ALLOW_PROCESS_SPAWN=1` and
`CODEX_APP_PORT_PROCESS_SPAWN_ALLOWLIST=cmd1,cmd2` are set before startup. When
enabled, it consumes a matching one-time process-spawn preflight token and calls
only `process/spawn` with a shell-free argv vector, the selected workspace cwd,
no browser-provided environment, no stdin, no PTY, no streamed output, and an
output cap of zero. Browser responses, process-local history, and audit records
return only argument counts, exit status/code, stdout/stderr character counts,
sandbox/network flags, and policy flags; they do not return command text,
executable names, argv, cwd, environment, process handles, process ids, stdout,
stderr, or preflight tokens. Shell execution remains blocked.
`/api/terminal-actions` also returns a compact action scope summary with enabled
gated local action labels and high-risk blocked method names/counts, without
command text, argv, terminal output, session ids, paths, or raw payloads.
Terminal control preflight similarly validates draft write/resize/terminate
intent against an audited `command/exec/*` or `process/*` session-control
method and returns only selector/input counts or resize dimensions. It does not
echo terminal input, return session ids, touch sessions, write stdin, resize,
terminate, or call app-server. `/api/terminal-actions`
keeps capped process-local terminal-control preflight and confirmation
histories with only action/method, selector/input counts, resize dimensions,
token-issued or token-consumed status, and redaction flags. Those histories do
not return preflight tokens, session selectors, session ids, terminal input,
raw intent, intent hashes, output, or execute terminal control.
`/api/terminal-control` is a separate mutation route and is disabled unless
`CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` plus an action-family gate are set
before startup. `CODEX_APP_PORT_ALLOW_TERMINAL_CONTROL=1` enables only
`command/exec/write`, `command/exec/resize`, and `command/exec/terminate`.
`CODEX_APP_PORT_ALLOW_PROCESS_TERMINAL_CONTROL=1` separately enables only
`process/writeStdin`, `process/resizePty`, and `process/kill`. Both families
consume matching one-time terminal-control preflight tokens and route through
the persistent app-server session manager. Responses and action audit records
return only action, method, selector/input/dimension counts, status,
token-consumption, and policy flags; they never return terminal input, session
selectors, session ids, process handles, terminal output, raw intent, cwd,
paths, or app-server payloads.
Successful opt-in file actions are also visible in a capped process-local
history from `/api/terminal-actions`. It records only action/method,
target/source depth, content counts, filesystem result booleans, token-consumed
status, and audit flags; it never returns preflight tokens, full paths,
basenames, file contents, raw intent, or app-server payloads.
Background terminal cleanup is a separate terminal mutation and it is disabled
unless both `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` and
`CODEX_APP_PORT_ALLOW_TERMINAL_CLEAN=1` are set before startup. The browser
must first obtain a matching one-time `/api/terminal-background-clean-preflight`
token for a loaded thread suffix, and `/api/terminal-background-clean` returns
only suffix/count/status metadata; it does not return terminal output, session
ids, full thread ids, transcript content, paths, or command text.
Background terminal inventory and termination are separate opt-ins. Listing
requires `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` and
`CODEX_APP_PORT_ALLOW_TERMINAL_LIST=1`; it calls only
`thread/backgroundTerminals/list` for a loaded thread suffix and returns counts
plus short-lived opaque terminal refs, not process ids, item ids, commands,
cwd, OS pids, paths, output, or raw payloads. Termination additionally requires
`CODEX_APP_PORT_ALLOW_TERMINAL_TERMINATE=1`, a terminal ref issued by the local
list route, and a matching one-time
`/api/terminal-background-terminate-preflight` token. The browser never sends or
receives the app-server process id; it is resolved server-side and action audit
records remain suffix/status/count-only.
`/api/action-preflight-confirm` can consume such a token once against the same
intent and still returns a blocked response, so future mutation paths have a
tested provenance gate before they are enabled.
File action preflight similarly validates write/remove/copy/create-directory
intent against workspace-relative paths only, returns basenames and counts, and
does not write files, echo content, return full paths, or call app-server. Real
file actions are separately opt-in behind `CODEX_APP_PORT_ALLOW_FILE_ACTION=1`
and a matching one-time preflight token; they reject hidden, `.git`, lock,
absolute, traversal, and symlinked parent/target paths, never return file
contents or full paths, and still avoid app-server traffic.
The Settings & Integrations panel similarly exposes a schema-backed local audit
of settings/auth/apps/MCP/skills/plugins methods. Default mode still does not touch
app-server; the opt-in inventory remains counts-only for config requirements,
model picker metadata, model-provider capabilities, collaboration-mode presets,
permission-profile counts, remote-control status buckets, account, account
usage presence/counts, workspace message counts, account rate-limit buckets,
apps/connectors, external agent
configuration migration candidates, external agent import-history counts, MCP,
skills, plugins, installed-plugin counts, experimental features, and hooks. It omits model ids, descriptions, upgrade copy,
availability messages, app ids, URLs, logos, descriptions, labels, screenshots,
external config descriptions, cwd values, paths, names, marketplace names,
plugin names, session titles, raw migration items, rate-limit plan types, limit
ids/names, balances, used percentages, reset times, permission-profile ids,
permission-profile descriptions, remote-control status strings, server names,
installation ids, environment ids, token-usage values, usage bucket dates,
workspace message ids, workspace message bodies, workspace message timestamps,
external import ids, import timestamps, import paths, import messages, import
failure stages, installed plugin ids, installed plugin names, installed plugin
paths, installed plugin URLs, installed plugin prompts, installed plugin
capabilities,
experimental feature names, display text, descriptions, announcements, and cursors. Auth callbacks, app
linking/installs,
external config import mutations, ungated MCP tool/resource calls and server reloads,
plugin detail reads, config writes, ungated config-value writes, ungated
config-batch writes, ungated
experimental feature writes, ungated skill writes, plugin skill reads, plugin
share-list reads, hook commands, plugin installs/uninstalls/sharing, and marketplace
mutations are blocked.
`/api/settings-integrations` also returns a compact integration scope summary
with active read methods, local preflight/login/login-cancel/logout gates, and
blocked mutation method names/counts, including MCP reload, config-value,
config-batch, plugin-uninstall, skills-config, and experimental-feature gates when enabled; it never
returns secrets, auth tokens, names unless the name gate is enabled, paths,
URLs, hook commands, rate-limit details, or raw payloads.
Its lifecycle response also includes sanitized integration management and
execution-readiness metadata for the UI: blocked/read-only/preflight-only/
actionable/inventory/history-only state, surface counts, preflight/executable
actionability, active-login counts, latest-action availability, and explicit
generic-mutation/auth/install/import blocks. It does not return selectors,
tokens, auth tokens, names, arguments, resources, skill content, URLs, paths,
secrets, raw payloads, or app-server payloads.
`integrationSafetyContract` renders the same boundary as a compact security
contract: read/local/preflight/executable gate counts, enabled action-family
counts, dedicated-route-only mutation policy, generic mutation/auth callback/
token/app install/linking/import/marketplace/plugin install/share/hook-command
blocks, and redaction flags. It is derived from sanitized integration metadata
only and returns no tokens, targets, arguments, resource content, skill content,
names, URLs, paths, secrets, raw payloads, or app-server payloads.
`integrationRoutingContract` renders the route boundary from the same sanitized
metadata: local preflight versus dedicated executable routes, allowlist
requirements for MCP/plugin/settings/config/experimental-feature actions,
device-code-only auth routing, generic mutation blocks, and redaction flags
without tokens, targets, arguments, resource content, skill content, names,
URLs, paths, secrets, raw payloads, or app-server payloads.
`integrationWorkflowContract` renders the browser workflow boundary from the
same sanitized counters: client-side grouping, preflight-only versus executable
action visibility, history visibility, one-preflight-token-per-action
requirements, allowlist requirements, and explicit generic mutation/auth
callback/token/install/import/marketplace/plugin share/hook-command blocks. It
does not return tokens, targets, arguments, resource content, skill content,
names, URLs, paths, secrets, raw payloads, or app-server payloads.
`integrationAuditContract` renders the audit boundary from the same sanitized
metadata: preflight-audit versus persistent-action-audit mode, bounded history
counters and limits, allowlist requirements, sanitized action-audit guarantees,
and hard token/target/argument/resource/URL/path/secret/raw-payload non-logging
flags. It returns no tokens, targets, arguments, resource content, skill
content, names, URLs, paths, secrets, raw payloads, or app-server payloads.
`integrationProvenanceContract` renders the third-party code provenance
boundary from the same sanitized metadata: counts-only inventory provenance,
allowlisted executable route provenance, explicit install/import/marketplace/
hook-command/plugin-skill execution blocks, per-family allowlist requirements,
and sanitized audit requirements. It returns no tokens, targets, arguments,
resource content, skill content, names, URLs, paths, secrets, raw payloads, or
app-server payloads.
`integrationExternalCodeContract` renders the MCP/plugin/skills external-code
boundary from the same sanitized metadata: counts-only inventory versus
allowlisted executable route modes, explicit install/execution/import/
marketplace/hook-command blocks, preflight and allowlist requirements, and
sanitized audit requirements. It returns no tokens, targets, arguments,
resource content, skill content, names, URLs, paths, secrets, raw payloads, or
app-server payloads.
Browser-facing auth mutations are limited to device-code login, login cancel,
and logout.
`/api/account-login-preflight` is local-only, and `/api/account-login-start` is
disabled unless `CODEX_APP_PORT_ALLOW_ACCOUNT_LOGIN=1` is set. When enabled it
consumes a matching one-time token before calling only `account/login/start`
with `{ "type": "chatgptDeviceCode" }`. The protected browser response may show
the device `userCode`, a verified OpenAI/ChatGPT HTTPS verification URL, and an
opaque cancel reference, but audit records and history omit those fields plus
login IDs, cancel references, OAuth URLs, auth tokens, account identifiers, raw
app-server payloads, cwd, and paths.
`/api/account-login-cancel-preflight` and `/api/account-login-cancel` are
separately gated behind `CODEX_APP_PORT_ALLOW_ACCOUNT_LOGIN_CANCEL=1`. Cancel
uses only the opaque process-local reference from the immediate login response;
the private app-server `loginId` stays server-side and is never returned,
logged, or shown in history.
`/api/account-logout-preflight` and `/api/account-logout` remain separately
gated behind `CODEX_APP_PORT_ALLOW_ACCOUNT_LOGOUT=1` and call only
`account/logout`.
`/api/settings-integrations` also exposes capped process-local account login,
login-cancel, and logout histories for actions performed through this server.
They return only
workspace label/id, method/status, token-consumed state, audit flags, and
redaction flags; they never return auth tokens, account identifiers, auth URLs,
device codes, verification URLs, login IDs, cancel references, preflight tokens,
paths, raw intents, or raw app-server payloads. Callback handlers, app linking,
and auth token access remain blocked.
When `CODEX_APP_PORT_ALLOW_INTEGRATION_NAMES=1` is also set with the inventory
flag, the panel may show bounded display names for apps/connectors, their
plugin display names, model display names, collaboration-mode names, MCP
servers/tools, skills, plugins, and safe experimental feature names. The server
still strips path-like, URL-like, and token-like names, and continues to omit
account emails/tokens, model ids/descriptions/upgrade copy/availability
messages, collaboration-mode model overrides, app ids/URLs/descriptions/labels/
logos/screenshots, MCP schemas/resources, skill descriptions/paths, plugin ids/
paths/URLs, hook commands/paths/keys/matchers, external config descriptions/
cwds/paths/names/plugin names/session titles/raw migration items, and config
requirement values/domains, plus experimental feature display text,
descriptions, and announcements.
MCP tool preflight accepts only draft server/tool/argument intent, an optional
8-character thread suffix, and returns count metadata; it does not echo names
or arguments, invoke tools, or touch app-server. Its token uses the same local
preflight registry and does not expose the MCP names or argument hash.
`/api/mcp-tool-call` can execute `mcpServer/tool/call` only when
`CODEX_APP_PORT_ALLOW_MCP_TOOL_CALL=1` is set, the requested `server/tool`
exactly matches `CODEX_APP_PORT_MCP_TOOL_ALLOWLIST`, and a matching one-time
preflight token plus thread suffix are supplied. Arguments must parse as a JSON
object. The response and action audit log return content counts, text/image/
resource/structured-content counts, and error state only; server names, tool
names, arguments, thread ids, tool output, structured content, paths, tokens,
and raw payloads remain omitted.
MCP server reload preflight is local-only and has no browser-provided app-server
arguments. `/api/mcp-server-reload` can execute `config/mcpServer/reload` only
when `CODEX_APP_PORT_ALLOW_MCP_SERVER_RELOAD=1` is set and a matching one-time
preflight token is supplied. The response and action audit log return only
status plus response shape counts; MCP server names, config paths, command
details, tokens, and raw app-server payloads remain omitted.
MCP OAuth login preflight accepts only a draft server name for local validation
and allowlist checks. `/api/mcp-oauth-login` can call `mcpServer/oauth/login`
only when `CODEX_APP_PORT_ALLOW_MCP_OAUTH_LOGIN=1` is set, the server name
exactly matches `CODEX_APP_PORT_MCP_OAUTH_ALLOWLIST`, and a matching one-time
preflight token is supplied. The protected immediate response may return a
sanitized HTTPS authorization URL so the user can continue the OAuth flow, but
histories and action audit logs keep only counts and redaction flags; server
names, tokens, paths, raw payloads, and the authorization URL are omitted there.
MCP resource preflight accepts only draft server/resource URI intent and
returns count metadata; it does not echo the server name, resource URI,
resource content, schemas, or touch app-server. Its token uses the same local
preflight registry and does not expose the MCP resource intent hash.
`/api/mcp-resource-read` can execute that resource read only when
`CODEX_APP_PORT_ALLOW_MCP_RESOURCE_READ=1` is set and a matching one-time
preflight token is supplied. The response and action audit log return content
counts, text/blob counts, and character counts only; resource URIs, MIME types,
resource content, server names, paths, tokens, and raw payloads remain omitted.
Plugin read preflight accepts only draft plugin-read intent and returns plugin
target plus argument counts. `/api/plugin-read` can execute `plugin/read` only
when `CODEX_APP_PORT_ALLOW_PLUGIN_READ=1` is set, after rebuilding the matching
preflight and consuming its one-time token. Execution is limited to safe plugin
names plus optional safe `remoteMarketplaceName`; `marketplacePath` and unknown
argument keys are rejected before app-server traffic. Responses and action
audit records return plugin structure counts only and omit plugin names,
marketplace names, ids, paths, URLs, descriptions, hook keys, skill content,
MCP server names, share context, tokens, and raw payloads.
Plugin uninstall is a separate mutation path, disabled unless
`CODEX_APP_PORT_ALLOW_PLUGIN_UNINSTALL=1` is set and the plugin id exactly
matches `CODEX_APP_PORT_PLUGIN_UNINSTALL_ALLOWLIST`. `/api/plugin-uninstall`
must consume a matching one-time `/api/plugin-uninstall-preflight` token before
calling `plugin/uninstall`; responses and action audit records return only
target length and response-shape counts, with plugin ids/names, paths, URLs,
tokens, and raw app-server payloads omitted.
Plugin content preflight accepts only audited blocked `plugin/skill/read` and
`plugin/share/list` intent and returns method plus target/argument counts. It
does not echo skill text, sharing URLs, sharing principals, plugin names,
marketplace names, paths, URLs, descriptions, hook keys, MCP server names, or
touch app-server. `/api/plugin-content-read` can execute `plugin/skill/read`
only when `CODEX_APP_PORT_ALLOW_PLUGIN_CONTENT_READ=1` is set, and can execute
`plugin/share/list` only when `CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_LIST=1` is set.
Both paths require a matching one-time preflight token. Skill reads accept only
safe remote plugin id, remote marketplace name, and skill name inputs; share
list reads accept no app-server parameters. Responses and action audit records
return only content character/line counts or share item counts, while skill
text, share URLs, principals, names, ids, paths, descriptions, tokens, and raw
payloads stay omitted.
Skills config preflight accepts only a safe skill name plus `{"enabled":boolean}`
intent and returns target/argument counts only. `/api/skills-config-write` can
execute `skills/config/write` only when `CODEX_APP_PORT_ALLOW_SKILLS_CONFIG_WRITE=1`
is set and a matching one-time preflight token is supplied. Browser-provided
paths and unknown argument keys are rejected before app-server traffic, the
app-server call uses the skill name selector only, and responses plus action
audit records return only target/argument counts and the effective enabled
boolean; skill names, paths, argument text, tokens, and raw payloads stay
omitted.
Config value preflight accepts only a safe dotted key path, JSON-text value, and
`replace` or `upsert` merge strategy, then returns key/value shape counts only.
`/api/config-value-write` can execute `config/value/write` only when
`CODEX_APP_PORT_ALLOW_CONFIG_VALUE_WRITE=1` is set, the key exactly matches
`CODEX_APP_PORT_CONFIG_VALUE_WRITE_ALLOWLIST`, and a matching one-time token is
supplied. The browser cannot provide `filePath` or `expectedVersion`; the
app-server call forces both to `null`. Responses and action audit records return
only response shape and value/key counts, while key paths, values, config paths,
tokens, and raw payloads stay omitted.
Config batch preflight accepts only a JSON-text array of up to 10 edits, where
each edit has a safe dotted `keyPath`, a JSON value, and a `replace` or
`upsert` merge strategy. `/api/config-batch-write` can execute
`config/batchWrite` only when `CODEX_APP_PORT_ALLOW_CONFIG_BATCH_WRITE=1` is
set, every key exactly matches `CODEX_APP_PORT_CONFIG_BATCH_WRITE_ALLOWLIST`,
and a matching one-time token is supplied. Browser-provided `filePath`,
`expectedVersion`, and reload controls are rejected; the app-server call forces
file/version selectors to `null` and reload to `false`. Responses and action
audit records return only edit/key/value counts and response shape metadata,
while key paths, values, config paths, tokens, and raw payloads stay omitted.
Experimental feature preflight accepts only a safe feature identifier and a
boolean enablement value, then returns feature-character and enablement counts
only. `/api/experimental-feature-set` can execute
`experimentalFeature/enablement/set` only when
`CODEX_APP_PORT_ALLOW_EXPERIMENTAL_FEATURE_SET=1` is set, the feature exactly
matches `CODEX_APP_PORT_EXPERIMENTAL_FEATURE_ALLOWLIST`, and a matching
one-time token is supplied. Responses and action audit records return only
updated/enabled/disabled counts plus response shape metadata; feature names,
enablement values, config paths, tokens, and raw payloads stay omitted.
Integration action preflight covers audited settings/auth/MCP/skills/plugins
mutation methods such as config writes, auth flows, plugin installs/uninstalls, sharing,
and marketplace actions. It accepts only allowlisted blocked methods, returns
target/argument counts only, and does not echo targets, names, URLs, arguments,
invoke tools, install or uninstall plugins, write settings, start auth callbacks, or touch
app-server.
`/api/settings-integrations` also includes a capped process-local history of
successful MCP server-reload/OAuth/tool/resource, plugin-read/plugin-uninstall/plugin-content,
skills-config, config-value, config-batch, experimental-feature, and integration mutation preflights from this server. It shows only action type,
audited method/category,
target/name/resource/argument counts, and redaction flags; it does not return
preflight tokens, names, resource URIs, resource content, targets,
arguments, schemas, URLs, paths, raw payloads, or execute mutations.
Successful fail-closed confirmations for those preflights are recorded in a
separate capped history with token-consumed and one-time-use status only; it
still omits tokens, names, targets, arguments, schemas, URLs, paths, raw
payloads, intent hashes, tool invocation, and mutation execution.
The Git Worktree panel reads only `.git` metadata from the selected allowlisted
workspace, including bounded local branch refs and linked-worktree `HEAD`
files. It also performs a bounded best-effort `.git/index` status scan using
mtime/size metadata and top-level untracked counts, plus a path-free safety
scan for hook files, filter config sections, and attributes files that could
make checkout execute local code or transforms, plus local `core.hooksPath` and
`core.fsmonitor` config that could redirect execution. It does not invoke `git`,
follow linked `gitdir:` paths, read file contents, expose remote URLs, or return
absolute paths for inventory/preflight reads. Branch switch preflight validates a
selected branch against the read-only inventory and returns status and safety
counts. A real branch switch is available only when
`CODEX_APP_PORT_ALLOW_GIT_BRANCH_SWITCH=1` is set, the matching one-time
preflight token is consumed, the worktree is clean, and all switch-safety counts
are zero; the response still returns no paths, argv, stdout, or stderr. Branch
creation is separately opt-in behind `CODEX_APP_PORT_ALLOW_GIT_BRANCH_CREATE=1`
and writes only a new local loose ref from the current HEAD after consuming a
matching one-time preflight token. Branch deletion is opt-in behind
`CODEX_APP_PORT_ALLOW_GIT_BRANCH_DELETE=1` and removes only a non-current loose
local ref after consuming a matching one-time preflight token. Commit preflight
validates message shape and returns only message/status counts without echoing
message text. A real commit is separately opt-in behind
`CODEX_APP_PORT_ALLOW_GIT_COMMIT=1`; it consumes a matching one-time preflight
token, requires a current local branch, complete warning-free status metadata,
no unstaged/untracked changes, and staged changes verified by `git diff
--cached`, then runs `git commit` with hooks, GPG, editor prompts, stdout,
stderr, argv, and stdin disclosure disabled. Worktree action preflight validates
draft create/remove intent with a workspace-relative target path and inventoried
branch for creation, returning only basename/depth and branch metadata. Real
worktree create/remove is opt-in behind `CODEX_APP_PORT_ALLOW_GIT_WORKTREE=1`,
consumes a matching one-time preflight token, revalidates the target, rejects
symlinked/hidden/traversal paths, requires zero hook/filter/attribute risk for
creation, and never returns full paths, stdout, stderr, argv, or app-server
traffic.
Thread creation is also gated. `/api/thread-start-preflight` validates only the
selected workspace and returns a one-time local token without touching
app-server. `/api/thread-start` is disabled unless
`CODEX_APP_PORT_ALLOW_THREAD_START=1` is set; when enabled it consumes the
matching token before calling only `thread/start` with the allowlisted workspace
cwd, read-only sandbox, user-routed approvals, empty environments, and no model
traffic. Browser responses and action audit records expose only the new thread
suffix plus status/count/policy metadata; they do not return full ids, prompt
text, cwd, paths, instruction sources, or app-server raw payloads.
Thread archive actions follow the same gate. `/api/thread-archive-preflight`
validates a selected thread suffix plus `archive` or `unarchive` without
app-server traffic. `/api/thread-archive-action` is disabled unless
`CODEX_APP_PORT_ALLOW_THREAD_ARCHIVE=1` is set; when enabled it consumes the
matching token, resolves the suffix through sanitized `thread/list` metadata,
and calls only `thread/archive` or `thread/unarchive`. Responses and action
audit records return suffix/state/method metadata only, never full ids, names,
previews, transcript content, cwd, or paths.
Thread deletion has its own destructive gate. `/api/thread-delete-preflight`
validates only a selected thread suffix and archived-state selector without
app-server traffic. `/api/thread-delete-action` is disabled unless
`CODEX_APP_PORT_ALLOW_THREAD_DELETE=1` is set; when enabled it consumes the
matching token, resolves the suffix through sanitized `thread/list` metadata,
and calls only `thread/delete`. Responses and action audit records return
suffix/state/method metadata only, never full ids, names, previews, transcript
content, cwd, paths, raw app-server payloads, or the preflight token.
Thread forking is separately gated. `/api/thread-fork-preflight` validates only
a selected source thread suffix without app-server traffic.
`/api/thread-fork-action` is disabled unless
`CODEX_APP_PORT_ALLOW_THREAD_FORK=1` is set; when enabled it consumes the
matching token, resolves the source suffix through sanitized `thread/list`
metadata, and calls only `thread/fork` with `excludeTurns: true` and no
browser-supplied path, cwd, model, sandbox, instructions, or permissions
overrides. Responses and action audit records return source suffix, forked
suffix, status, method, and exclude-turns metadata only, never full ids, names,
previews, transcript content, cwd, paths, raw app-server payloads, or the
preflight token.
Thread renaming is separately gated. `/api/thread-rename-preflight` validates a
selected thread suffix and bounded name locally without app-server traffic.
`/api/thread-rename-action` is disabled unless
`CODEX_APP_PORT_ALLOW_THREAD_RENAME=1` is set; when enabled it consumes the
matching token, resolves the suffix through sanitized `thread/list` metadata,
and calls only `thread/name/set`. Responses and action audit records return
suffix/status/name-count/method metadata only, never the name text, full ids,
previews, transcript content, cwd, paths, raw app-server payloads, or the
preflight token.
Thread rollback is separately gated because the app-server response can include
populated turns. `/api/thread-rollback-preflight` validates a selected thread
suffix and a bounded turn count locally without app-server traffic.
`/api/thread-rollback-action` is disabled unless
`CODEX_APP_PORT_ALLOW_THREAD_ROLLBACK=1` is set; when enabled it consumes the
matching token, resolves the suffix through sanitized `thread/list` metadata,
and calls only `thread/rollback` with `numTurns` from 1 to 50. Responses and
action audit records return suffix/status/count/method metadata only, never full
ids, names, previews, transcript content, cwd, paths, raw app-server payloads,
or the preflight token. This is conversation-history rollback only; it does not
revert workspace files.
Thread compaction is more sensitive because it can trigger model traffic.
`/api/thread-compact-preflight` validates a selected thread suffix locally and
returns a one-time token without app-server traffic. `/api/thread-compact-start`
requires both `CODEX_APP_PORT_ALLOW_THREAD_COMPACT=1` and
`CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1`, consumes the matching token, resolves
only a loaded-session suffix through the persistent app-server client, and calls
only `thread/compact/start`. Responses and action audit records mark model
traffic explicitly but return only suffix/status/count/method metadata, never
prompt text, full ids, transcript content, cwd, paths, or app-server raw
payloads.
Server-side thread search is intentionally not a content browsing surface.
`/api/thread-search` is disabled unless
`CODEX_APP_PORT_ALLOW_THREAD_SEARCH=1` is set before startup, accepts only
`POST`, and sends the search term to app-server only after workspace and body
validation. Responses expose accepted-state, search-term length/line counts,
result counts, cursor-presence booleans, and per-result suffix/status/source
metadata only. Search terms, snippets, names, previews, full ids, paths,
cursors, and raw payloads are omitted.
`/api/execution-gate` also returns a capped process-local thread lifecycle
history for successful start/archive/delete/fork/rename/rollback/compact actions. That history is UI-facing
metadata only: action type/method, suffix, status/counts, token-consumed state,
and audit flags. It never returns preflight tokens, prompts, full ids, paths,
names, previews, transcript content, or raw app-server payloads.
The same endpoint exposes sanitized `turnExecutionReadiness` derived only from
gate flags and counts: blocked/local/managed/pending-approval/history state,
turn-start route, preflight requirement, request-scoped approval gates, pending
approval count, thread-lifecycle history count, and redaction flags without
tokens, prompts, ids, paths, raw approval details, or app-server payloads.
It also exposes sanitized `turnExecutionAuthority` derived from the same safe
gate/readiness counters: blocked/model-traffic authority mode, turn-start
route, read-only sandbox, no-network policy, one-preflight-token per turn,
request-scoped approval authority, and hard browser prompt/cwd/sandbox/
approval-policy/environment blocks without tokens, prompts, ids, paths, raw
approval details, or app-server payloads.
Draft turn preflight validates prompt size and target thread locally but keeps
execution blocked, returns a local preflight token for a future execution gate,
and does not call `codex app-server`. The separate `/api/turn-start` route is
also present as a tested guard; with the turn-start opt-in disabled it returns
`403` after local validation and does not touch app-server. `/api/execution-gate`
exposes that approval boundary to the UI without app-server traffic by default,
without browser prompt echo, and without session-wide approval decisions.
When `CODEX_APP_PORT_ALLOW_TURN_START=1` is explicitly set, successful starts
must also consume a matching one-time `/api/turn-preflight` token before any
app-server call. They are recorded in a capped, in-memory `/api/turn-sessions`
ledger that keeps only sanitized id suffixes, prompt counts, completion status,
notification counts, bounded sanitized live event snapshots, and deny-only
approval summaries. Its lifecycle summary also exposes safe session/event/model
traffic counts, approval-session counts, session-wide decision status, and
latest suffix/status/event metadata for the UI; it does not return prompts,
full ids, paths, tokens, or raw events.
When `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` is also set, opt-in
`/api/turn-start`, `/api/live-sessions`, and `/api/live-session-control` share a
persistent per-workspace app-server client instead of throwaway probes. The same
turn-session lifecycle summary exposes only the managed client state, whether a
client is started, active thread/turn suffixes, notification counts, and
pending/resolved approval counts; it does not return prompts, full ids, cwd,
paths, decision tokens, or raw events.
The same preflight tokens, explicit action gates, prompt non-echo, suffix-only ids, and
sanitized event/approval summaries still apply, and the client is closed with
the dev server.
`/api/approval-decisions` can record local deny-only browser decisions against
those summaries for UI state, and it can forward deny-only decisions for
pending managed approvals when both `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1`
and `CODEX_APP_PORT_ALLOW_APPROVAL_FORWARDING=1` are set. With the additional
`CODEX_APP_PORT_ALLOW_APPROVAL_DETAILS=1` and
`CODEX_APP_PORT_ALLOW_APPROVAL_ACCEPT=1` gates, pending managed command or
file-change approvals may also forward a single `accept` decision. Session-wide
approvals, permission grants, execpolicy/network amendments, and local
historical approve records remain rejected. Permissions approval requests expose
only `decline` and answer app-server with an empty turn-scoped permission
profile. Each approval request accepts at most one local browser
decision per server process, and when the persistent audit log is configured
the server also rejects decisions whose sanitized decision key is already
journaled; duplicate decisions are rejected as replay.
Each pending approval also carries a process-local decision token that is
required on the POST path and removed from responses after a decision is
recorded. The same POST route accepts a bounded `decisions` array for queue
denial actions and, when the accept-once gate is enabled, request-scoped
`accept` actions, but each entry still needs its own session/request selector,
safe decision, and process-local decision token before anything is recorded or
forwarded.
The approval queue also returns a count-only summary of pending/decided,
local/managed, command/file-change/permissions, safe deny/accept,
token-required, and redacted-preview totals. That summary never includes
decision tokens, request keys, session identifiers, raw approval details, paths,
permission profiles, patches, or file contents.
The GET response also includes a capped process-local decision history for
decisions recorded through this server. It returns only sanitized
kind/method/suffix/count/decision/audit metadata and explicit redaction flags;
it does not return decision tokens, request keys, raw commands, file-change
patches, file contents, full paths, prompt text, session ids, or full ids.
Local turn-session approval summaries preserve file-change request shape as
bounded metadata only: a redacted reason plus grant-root basename when present;
permissions approvals preserve only permission-presence booleans. They still
omit full paths, permission profiles, patches, file contents, prompt text, and
tokens.
When `CODEX_APP_PORT_ALLOW_APPROVAL_DETAILS=1` is set alongside managed
approval forwarding, pending managed command approvals may include a bounded
redacted command preview, and pending managed file-change approvals may include
a bounded redacted metadata preview with reason and grant-root basename only.
Those previews strip path-like, URL-like, email-like, and token-like content,
never return file-change patches or file contents, are never written to the
approval audit log, and do not enable session-wide decisions.
The approval queue also exposes a request-scoped policy summary for the UI:
local deny, forwarded deny, accept-once gate state, supported approval kind
labels, and explicit rejected session-wide/execpolicy/network/root-grant
scopes. It returns no decision tokens, request keys, raw approval details,
commands, patches, file contents, paths, prompts, or app-server payloads.
The same response includes sanitized approval management metadata for the UI:
actionable/pending/history state, visible request counts, forward/accept/batch
availability, and rejected privileged-scope flags derived only from sanitized
queue, policy, and history summaries. It still returns no selectors, tokens,
raw approval details, commands, patches, file contents, paths, prompts, or
app-server payloads.
It also includes sanitized approval execution-readiness metadata for the UI:
actionable/pending/history state, request/action counts, request-scoped routing,
batch availability, and explicit session-wide/permission/exec/network/root-grant
blocks. It still omits decision tokens, request keys, raw approval details,
commands, patches, file contents, paths, prompts, ids, and app-server payloads.
It also includes `approvalWorkflowContract`, a sanitized UI workflow summary
for client-side filters, row controls, visible-subset batch actions, replay and
audit protections, detail-preview gates, and request-scoped decision-token
requirements. It returns no selectors, tokens, raw approval details, preview
text, commands, patches, file contents, paths, prompts, ids, or app-server
payloads.
It also includes `approvalSafetyContract`, a compact sanitized approval safety
summary for request-scoped decision tokens, replay protection, persistent audit
state, batch validation, forwarding/detail gates, and explicit rejected
privileged-scope decisions. It returns no tokens, request keys, selectors, raw
approval details, preview text, commands, patches, file contents, paths,
prompts, ids, or app-server payloads.
It also includes `approvalAuditContract`, a compact sanitized audit/replay
summary for bounded decision history, persistent versus process-local audit
mode, audit-log path redaction, replay-protection scope, batch validation, and
hard non-logging flags for decision tokens, request keys, session identifiers,
approval details, command text, patches, file contents, previews, paths,
prompts, and app-server payloads.
It also includes `approvalAuthorityContract`, a compact sanitized authority
summary for request-scoped local deny, managed deny, or accept-once authority,
command/file-change accept-once limits, permission-approval rejection, and hard
session-wide/permission/exec/network/root-grant blocks. It returns no tokens,
request keys, selectors, raw approval details, preview text, commands, patches,
file contents, paths, prompts, ids, or app-server payloads.
It also includes `approvalInteractionContract`, a compact sanitized interaction
summary for row controls, visible-subset batch controls, client-side filtering,
row busy/disabled sibling-button behavior, refresh-after-decision requirements,
published client-side batch limit enforcement, and request-scoped
route/token/audit gates. It returns no tokens, request keys, selectors, raw
approval details, preview text, commands, patches, file contents, paths,
prompts, ids, or app-server payloads.
The browser UI renders a dedicated approval queue from
`/api/approval-decisions` and polls it while a turn-start request is pending, so
managed approval prompts can be denied or, when
`CODEX_APP_PORT_ALLOW_APPROVAL_ACCEPT=1` is also enabled with the details and
forwarding gates, accepted once without accepting session-wide decisions. The
queue can be filtered locally by pending/decided state, local versus managed
source, and command/file-change/permissions kind. Each row has request-scoped
deny or gated accept-once controls that disable during submission, use only the
process-local token already attached to that sanitized request, and refresh the
sanitized queue after completion. The visible-subset deny and gated accept queue
controls submit one bounded tokenized batch for the current filter and cap the
visible window to the server-advertised batch limit before POST.
The desktop launcher writes an append-only sanitized approval audit log under
the user state directory by default; override it with
`--approval-audit-log` or `CODEX_APP_PORT_APPROVAL_AUDIT_LOG`. It excludes
prompt text, command text, absolute paths, file-change basenames, patch text,
file contents, and decision tokens, storing command counts and file-change
grant-root/preview counts only. Forwarded managed deny and accept-once
decisions, including file-change accept-once decisions, are journaled before
the browser decision is forwarded, so an unavailable persistent audit log fails
closed for that browser-originated decision.
The launcher also writes successful account logout, thread creation, thread
archive/unarchive actions, thread deletion, thread forking, thread renaming, thread rollback actions, thread compaction starts, live-session controls,
allowlisted terminal command executions, allowlisted process spawn executions,
background terminal cleanup requests, and local file actions to the sanitized
action audit log described above.
API calls require a per-process token injected into the served UI, so unrelated
local web pages cannot call the loopback API directly. Browser JSON `POST`
bodies are strict: unsupported fields are rejected before probes, app-server
calls, filesystem access, token consumption, or audit-log writes, and errors do
not echo field names or values. Audited write/preflight routes are also listed
in the immutable `BROWSER_POST_BODY_CONTRACTS` registry, and handlers fail
closed if their strict-reader fields drift from that registry. Each declared
field also maps to `BROWSER_POST_FIELD_POLICIES` for accepted JSON types,
generic size caps, NUL rejection, sensitivity labels, and raw-value non-return
metadata. `BROWSER_POST_RESPONSE_CONTRACTS` fail-closes audited `POST`
responses that would return unsafe token strings, token fields, secret patterns,
NUL text, absolute-path-like values outside the explicit preflight token issue
path, or unexpected top-level response keys. The agent-turn probe UI stays disabled unless
the server is started with
`CODEX_APP_PORT_ALLOW_AGENT_TURN=1`.

The local installer is user-scoped: it copies runtime files under
`~/.local/share/codex-app-port` and writes a desktop entry under
`~/.local/share/applications`. It does not use sudo, fetch network artifacts,
or install global packages. URL handler registration is opt-in with
`npm run install:local -- --url-handler`; it registers only
`codex-app-port://`, rejects callbacks/auth and the official `codex://` scheme,
and opens loopback UI URLs without app-server or model traffic.
It installs a local icon asset and has no automatic updater; updates remain a
manual replace-and-verify flow.
The local packager builds `dist/codex-app-port-0.1.0.tar.gz` plus a SHA-256
sidecar from allowlisted repo entries only. It refuses symlinks, includes a
package manifest with the no-auto-update policy, and performs no network,
sudo, global package, or URL-handler work.
`npm run package:arch -- --json` writes `dist/arch/PKGBUILD` next to a freshly
generated local source archive and SHA-256 sidecar. The recipe uses only the
adjacent archive as `source`, pins its digest, and has no install hook,
post-install hook, network fetch, `sudo`, `systemctl`, package-manager install,
automatic updater, or URL handler registration. Running `makepkg` and
installing the resulting package remain explicit operator actions outside this
repo's scripts.
URL handler validation exists for the local `codex-app-port://` scheme, and
desktop registration is user-scoped and opt-in only.

`npm run goal:audit` is the current completion audit. It maps the requested full
Omarchy/Linux Codex App port to concrete repo evidence and reports remaining
partial or missing deliverables. It is expected to report `complete: false`
until real turn execution, approvals, terminal/actions, and richer
Git/worktree flows are implemented and verified.

`npm run verify` is the current safety gate: it runs syntax checks, tests,
read-only app-server smoke probes, loopback guards, API sanitation checks
including opt-in plugin uninstall redaction, installer/packager checks, and a
small executable-pattern scan.

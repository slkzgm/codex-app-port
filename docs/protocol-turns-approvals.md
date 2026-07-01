# Turn Start and Approval Protocol Audit

Source audited locally: `codex-cli 0.142.5`.

Commands used:

```sh
codex --version
npm run protocol:generate
```

Generated evidence:

- `src/app-server/generated-schemas/manifest.json`
- `src/app-server/generated-schemas/json/ClientRequest.json`
- `src/app-server/generated-schemas/json/ServerRequest.json`
- `src/app-server/generated-schemas/json/v2/TurnStartParams.json`
- `src/app-server/generated-schemas/json/CommandExecutionRequestApprovalParams.json`
- `src/app-server/generated-schemas/json/FileChangeRequestApprovalParams.json`
- `src/app-server/generated-schemas/json/PermissionsRequestApprovalParams.json`

No real turn was started during this audit.

## 2026-07-01 Upstream HEAD Drift

Official source refresh:

- OpenAI `openai/codex` HEAD:
  `d059658ad1920bdb36e98798f44009a5f4c51735`
- stable npm `@openai/codex` latest: `0.142.5`
- alpha npm dist-tag observed: `0.143.0-alpha.32`
- local stable schema regeneration check: 335 JSON Schema files, matching the
  committed `codex-cli 0.142.5` manifest

The HEAD source contains app-server protocol methods that are not present in
the stable local schema:

- `environment/info`: connects to a configured execution environment and
  returns shell metadata plus a default cwd file URI. This stays blocked until
  a stable generated schema exposes it, then it needs an exact environment
  allowlist, disabled-by-default gate, no raw cwd URI, no environment id, no
  paths, and no raw app-server payloads.
- `thread/items/list`: HEAD successor/extension for persisted item paging.
  Stable `0.142.5` still exposes `thread/turns/items/list`, which this port
  already gates through the item-count/suffix/type/status-only route. The HEAD
  method stays blocked until schema regeneration, route versioning, and a
  fresh response contract prove that no message text, commands, output,
  patches, full ids, timestamps, paths, cursors, or raw payloads cross the
  browser boundary.

Tracking lives in `src/app-server/upstream-drift.mjs` and is asserted by
`test/protocol-schema.test.mjs`. The browser must not silently alias HEAD-only
methods to stable methods.

## 2026-06-29 Recalibration

The local official schema snapshot moved from `codex-cli 0.130.0` to
`codex-cli 0.142.4`: 286 JSON Schema files became 335. Compared with the
previous packaged snapshot, app-server added 22 client request methods,
server request methods/request-shape changes, and 5 server notifications
without removing existing top-level methods.

New client request methods:

- `account/rateLimitResetCredit/consume`
- `account/usage/read`
- `account/workspaceMessages/read`
- `environment/add`
- `externalAgentConfig/import/readHistories`
- `permissionProfile/list`
- `plugin/installed`
- `plugin/share/checkout`
- `remoteControl/client/list`
- `remoteControl/client/revoke`
- `remoteControl/disable`
- `remoteControl/enable`
- `remoteControl/pairing/start`
- `remoteControl/pairing/status`
- `remoteControl/status/read`
- `skills/extraRoots/set`
- `thread/backgroundTerminals/list`
- `thread/backgroundTerminals/terminate`
- `thread/delete`
- `thread/turns/list`
- `thread/turns/items/list`
- `thread/inject_items`
- `thread/resume`
- `thread/metadata/update`
- `thread/memoryMode/set`
- `thread/goal/get`
- `thread/goal/set`
- `thread/goal/clear`
- `thread/increment_elicitation`
- `thread/decrement_elicitation`
- `thread/approveGuardianDeniedAction`
- `thread/realtime/start`
- `thread/realtime/appendAudio`
- `thread/realtime/appendText`
- `thread/realtime/appendSpeech`
- `thread/realtime/stop`
- `thread/realtime/listVoices`
- `review/start`
- `feedback/upload`
- `memory/reset`
- `fs/getMetadata`
- `fs/readDirectory`
- `fs/readFile`
- `fs/watch`
- `fs/unwatch`
- `fuzzyFileSearch/sessionStart`
- `fuzzyFileSearch/sessionUpdate`
- `fuzzyFileSearch/sessionStop`
- `windowsSandbox/readiness`
- `windowsSandbox/setupStart`
- `thread/search`
- `thread/settings/update`

`memory/reset` remains blocked as a generic browser mutation and is exposed only
through `/api/memory-reset-preflight` for local validation. The route accepts no
browser params, requires the official null-params shape, has no execution route,
deletes no memories, performs no app-server traffic, and returns no memory
files, memory content, memory paths, secrets, or raw payloads.

`thread/metadata/update` remains blocked as a browser mutation and is exposed
only through `/api/thread-metadata-update-preflight` for local validation. The
route accepts a selected thread suffix plus optional `gitInfo` branch/origin/SHA
shape, rejects unsupported keys and unsafe values, has no execution route,
performs no app-server traffic, mutates no thread metadata, and returns no full
ids, branch names, origin URLs, SHAs, paths, secrets, arguments, or raw
payloads.

`thread/resume` and `thread/inject_items` remain blocked as browser mutations
and are exposed only through `/api/thread-resume-inject-preflight` for local
validation. The route accepts a selected thread suffix, an explicit official
method name, and JSON-object arguments, rejects unsupported keys such as
browser-supplied full `threadId`, has no execution route, performs no
app-server or model traffic, resumes no thread, injects no items, and returns
only counts/presence metadata with no full ids, thread content, paths,
argument text, secrets, or raw payloads.

`thread/realtime/start`, `thread/realtime/appendAudio`,
`thread/realtime/appendText`, `thread/realtime/appendSpeech`, and
`thread/realtime/stop` remain blocked as browser mutations and are exposed only
through `/api/thread-realtime-preflight` for local validation. The route accepts
a selected thread suffix, an explicit official method name, and JSON-object
arguments, rejects unsupported keys such as browser-supplied full `threadId`,
has no execution route, performs no app-server, realtime, or model traffic,
starts no realtime session, sends no audio/text/speech, stops no session, and
returns only enum/count/presence metadata with no full ids, thread content,
prompt text, audio data, text, SDP, realtime session ids, paths, secrets, or raw
payloads.

`thread/increment_elicitation`, `thread/decrement_elicitation`, and
`thread/approveGuardianDeniedAction` remain blocked as browser mutations and are
exposed only through `/api/thread-guardian-preflight` for local validation. The
route accepts a selected thread suffix, an explicit official method name, and
JSON-object arguments, rejects unsupported keys such as browser-supplied full
`threadId`, has no execution route, performs no app-server, thread-state, or
model traffic, changes no elicitation counters, approves no guarded action, and
returns only count/presence metadata with no full ids, thread content, guardian
event details, paths, secrets, or raw payloads.

Current local status: `permissionProfile/list`, `skills/list`,
`remoteControl/status/read`, `plugin/installed`,
`externalAgentConfig/import/readHistories`, `hooks/list`,
`account/usage/read`, `account/workspaceMessages/read`,
`configRequirements/read`, and `mcpServerStatus/list` have dedicated
disabled-by-default GET routes behind
`CODEX_APP_PORT_ALLOW_PERMISSION_PROFILES=1`,
`CODEX_APP_PORT_ALLOW_SKILLS_LIST=1`,
`CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_STATUS=1`,
`CODEX_APP_PORT_ALLOW_INSTALLED_PLUGINS=1`,
`CODEX_APP_PORT_ALLOW_EXTERNAL_AGENT_IMPORT_HISTORIES=1`,
`CODEX_APP_PORT_ALLOW_HOOKS_LIST=1`,
`CODEX_APP_PORT_ALLOW_ACCOUNT_USAGE=1`, and
`CODEX_APP_PORT_ALLOW_ACCOUNT_WORKSPACE_MESSAGES=1`, and
`CODEX_APP_PORT_ALLOW_CONFIG_REQUIREMENTS=1`, and
`CODEX_APP_PORT_ALLOW_MCP_SERVER_STATUS=1`. These surfaces return counts
plus bounded categorical totals only. They do not return permission profile
names, profile ids, descriptions, usage values, bucket dates, workspace message
ids, message bodies, message timestamps, policy values, domains, requirement
keys, policy snippets, import ids, import paths, import messages, import
failure stages, hook commands, hook paths, hook keys, hook matchers, hook plugin
ids, hook status messages, hook timeouts, hook trust hashes, plugin ids, plugin
names, plugin paths, plugin URLs, plugin prompts, plugin descriptions, plugin
capabilities, plugin screenshots, install suggestion names, remote-control
status strings, skill names, skill paths, skill descriptions, skill display
names, skill prompts, skill icon paths, dependency values, dependency commands,
dependency URLs, MCP server names, MCP tool names, MCP resource URIs,
MCP resource-template URIs, MCP tool schemas, server names, installation ids,
environment ids, cursors, hook execution, skill execution, installs, MCP tool
invocation, MCP resource reads, config writes, import execution, filesystem
access, or raw payloads.
`thread/search` has a separate
disabled-by-default
`POST /api/thread-search` path behind `CODEX_APP_PORT_ALLOW_THREAD_SEARCH=1`;
it accepts the search term only in the request body and returns only
accepted-state, counts, cursor-presence booleans, and suffix/status/source
metadata, never the search term, snippets, thread names, previews, full ids,
paths, cursors, thread content, or raw payloads. `thread/turns/items/list` has
a separate disabled-by-default `GET /api/thread-turn-items` path behind
`CODEX_APP_PORT_ALLOW_THREAD_TURN_ITEMS=1`; it resolves the thread suffix
through `thread/list`, resolves the turn suffix through `thread/turns/list`
with `itemsView:notLoaded`, and returns only item suffix/type/status/count
metadata plus redaction flags, never message text, prompts, commands, output,
patches, paths, cursor values, full ids, timestamps, or raw payloads.
`thread/realtime/listVoices` has a separate disabled-by-default
`GET /api/thread-realtime-voices` path behind
`CODEX_APP_PORT_ALLOW_THREAD_REALTIME_VOICES=1`; it sends an empty parameter
object and filters the response to the generated official voice enum, returning
only known voice names/defaults and never unknown strings, SDP, audio,
transcript content, thread content, ids, paths, model traffic, or raw payloads.
The other realtime methods are covered only by the local-only
`POST /api/thread-realtime-preflight` path above and still have no execution
route.
`fs/getMetadata` and `fs/readDirectory` have a separate disabled-by-default
`GET /api/fs-directory` path behind `CODEX_APP_PORT_ALLOW_FS_DIRECTORY=1`; it
accepts only workspace-relative non-hidden directory selectors, rejects
symlinked path segments before app-server traffic, and returns bounded direct
child names plus type/count metadata, never absolute paths, relative paths,
timestamps, file contents, hidden entries, token-like names, URLs, or raw
payloads.
`fs/readFile` has only a local `POST /api/fs-read-file-preflight` guard for
now. It validates workspace-relative visible path shape and creates a local
confirmation token, but there is no execution route, filesystem read, app-server
traffic, path or basename disclosure, file content, `dataBase64`, or raw
payload output.
`fs/watch` and `fs/unwatch` have only a local
`POST /api/fs-watch-preflight` guard for now. It validates workspace-relative
visible path shape for watch plus bounded safe watch-id shape for both methods,
but there is no execution route, watcher creation/removal, `fs/changed`
subscription, app-server traffic, path/canonical-path/basename disclosure,
watch-id disclosure, watcher handle, notification output, or raw payload.
`fuzzyFileSearch/sessionStart`, `fuzzyFileSearch/sessionUpdate`, and
`fuzzyFileSearch/sessionStop` have only a local
`POST /api/fuzzy-file-search-preflight` guard for now. It validates
workspace-relative visible roots, query length, and bounded safe session-id
shape, but there is no execution route, search session start/update/stop,
app-server traffic, returned roots, query text, session ids, file names, paths,
scores, match indices, notification output, or raw payload.
`thread/delete` also has a
separate disabled-by-default destructive path:
`POST /api/thread-delete-preflight` validates only suffix and archived-state
metadata without app-server traffic, and `POST /api/thread-delete-action`
requires `CODEX_APP_PORT_ALLOW_THREAD_DELETE=1` plus the matching one-time
token before resolving the suffix through `thread/list` and calling only
`thread/delete`. It returns suffix/state/method metadata only, with no full ids,
names, previews, paths, thread content, preflight tokens, or raw payloads. The
new `thread/fork` route is similarly disabled by default:
`POST /api/thread-fork-preflight` validates only the source suffix without
app-server traffic, and `POST /api/thread-fork-action` requires
`CODEX_APP_PORT_ALLOW_THREAD_FORK=1` plus the matching one-time token before
resolving the source suffix through `thread/list` and calling only
`thread/fork` with `excludeTurns: true`. Browser-supplied path, cwd, model,
sandbox, instruction, permission, and runtime-root overrides are rejected by
omission from the route body contract. It returns source suffix, forked suffix,
status, method, and exclude-turns metadata only, with no full ids, names,
previews, paths, thread content, preflight tokens, or raw payloads. The
`environment/add` method now has a separate disabled-by-default route:
`POST /api/environment-add-preflight` validates only a safe environment id and
`https:`/`wss:` exec-server URL without app-server traffic, and
`POST /api/environment-add` requires `CODEX_APP_PORT_ALLOW_ENVIRONMENT_ADD=1`,
an exact `CODEX_APP_PORT_ENVIRONMENT_ADD_ALLOWLIST`
`environmentId=execServerUrl` match, and the matching one-time token before
calling `environment/add`. Browser-supplied timeout or extra app-server
parameters are rejected; the server fixes `connectTimeoutMs` to `null`.
Responses and action audit records expose only status/count/shape metadata,
with no environment ids, exec-server URLs, paths, tokens, or raw payloads. The
other refreshed 0.142 client methods are now classified in local policy as
blocked; `/api/settings-integrations` exposes only method names/counts and no
browser route executes them until separately audited.

Server request methods and request-shape changes tracked by the local audit:

- `item/tool/requestUserInput`
- `mcpServer/elicitation/request` can carry the `openai/form` mode when clients
  opt into OpenAI form elicitation.
- `item/tool/call`
- `account/chatgptAuthTokens/refresh`
- `attestation/generate`
- `currentTime/read`

Local status: all non-approval top-level server requests are explicitly listed
in the server-request audit. The browser port does not service tool input,
dynamic tool calls, MCP elicitation, ChatGPT auth-token refresh, attestation, or
external time reads. `/api/settings-integrations` exposes this as a
fail-closed `serverRequestBoundary` summary with audited method names, category
counts, and redaction flags only; it returns no prompts, schemas, forms, tool
arguments, server names, auth tokens, attestation tokens, timestamps, paths,
URLs, or raw request payloads.

New server notifications:

- `externalAgentConfig/import/progress`
- `model/safetyBuffering/updated`
- `thread/deleted`
- `thread/settings/updated`
- `turn/moderationMetadata`
- `thread/realtime/started`
- `thread/realtime/itemAdded`
- `thread/realtime/transcript/delta`
- `thread/realtime/transcript/done`
- `thread/realtime/outputAudio/delta`
- `thread/realtime/sdp`
- `thread/realtime/error`
- `thread/realtime/closed`

Local status: import-progress, model-safety, turn-moderation, and realtime
notifications are explicitly listed in the server-notification audit. Existing
browser streams keep their separate sanitizers and do not expose raw realtime
transport, audio, moderation, or import payloads. `/api/settings-integrations`
also exposes a fail-closed `serverNotificationBoundary` summary with audited
method names, category counts, and redaction flags only; it returns no progress
details, safety metadata, moderation metadata, realtime session metadata,
transcript text, audio data, SDP, error details, paths, URLs, or raw
notification payloads.

Implication for this port: keep all new mutation/control-plane methods blocked
until each has a dedicated route, preflight, allowlist, audit record, and
sanitized response contract. Treat new server requests as fail-closed until a
dedicated response policy exists; in particular, do not enable tool input,
dynamic tool calls, OpenAI form elicitation, auth-token refresh, attestation, or
external time reads from the browser path without a separate audit.

## Methods Found

Client-to-server methods relevant to execution:

- `turn/start`
- `turn/interrupt`
- `command/exec`
- `command/exec/write`
- `command/exec/resize`
- `command/exec/terminate`
- `process/spawn`
- `process/writeStdin`
- `process/kill`
- `process/resizePty`
- `fs/writeFile`
- `fs/remove`
- `fs/copy`

Server-to-client requests relevant to turn execution and approvals:

- `item/commandExecution/requestApproval`
- `item/fileChange/requestApproval`
- `item/permissions/requestApproval`
- `item/tool/requestUserInput`
- `mcpServer/elicitation/request`
- `account/chatgptAuthTokens/refresh`
- `attestation/generate`
- `currentTime/read`

## Turn Start Risk

`turn/start` requires a full `threadId` and an `input` array. The prompt text
lives inside `input`, so the browser API must continue to avoid echoing it in
errors, logs, or status responses.

The schema also allows turn-scoped overrides such as `cwd`, `approvalPolicy`,
`approvalsReviewer`, `sandboxPolicy`, `permissions`, and `model`. These must not
be accepted from the browser in the first real implementation. The server should
construct a minimal request from a server-side thread mapping and fixed policy.

Required gate before enabling real turns:

- Browser sends only workspace id, thread suffix, and prompt text.
- Server resolves the full thread id internally without returning it.
- Server forces `approvalPolicy` to a reviewed mode and keeps reviewer as `user`.
- Browser cannot set `cwd`, sandbox, permissions, model, environment, schema, or
  reviewer fields.
- Prompt text is never written to logs, rejected error bodies, or non-transcript
  APIs.
- A bounded sanitized live event snapshot is recorded for the started turn;
  persistent session-owned streaming remains a separate implementation step.
- Every server request listed in the approval section has an explicit handler.

## Approval Risk

Command approvals can include raw command strings, cwd, parsed command actions,
network policy amendments, extra permissions, and an optional opaque
`approvalId`. File approvals can include `grantRoot`. Permissions approvals can
include cwd and a requested permission profile.

Initial approval implementation must be fail-closed:

- Unknown server request method: deny or interrupt according to a documented
  policy, never auto-accept.
- Unknown decision variant: reject locally and do not answer the server request.
- Command approvals: default decisions limited to decline/abort; accept-once
  forwarding requires explicit opt-in and a redacted pending-approval preview.
- File approvals: default decisions limited to decline/cancel; accept-once
  forwarding requires explicit opt-in and remains request-scoped.
- Permissions approvals: only a local `decline` decision is exposed; the
  protocol response returns an empty turn-scoped permission profile with
  `fileSystem: null`, `network: null`, and `strictAutoReview: true`.
- Session-wide, execpolicy, network-policy, root-grant, or persistent decisions
  stay disabled until separately audited.
- Auth-token refresh requests are never handled by the browser path.

Implemented local policy:

- `src/app-server/approval-policy.mjs` summarizes approval requests without raw
  command strings or absolute paths.
- Command and file-change requests can be answered with deny decisions:
  `decline` or `cancel`, and pending managed command/file-change requests can
  be answered with one request-scoped `accept` decision only when the accept
  opt-in gates are enabled.
- Legacy command/patch approval requests can be answered with deny-only
  decisions: `denied` or `abort`.
- Permissions approval requests can be answered only with `decline`; no browser
  approve, cancel, session scope, file-system grant, or network grant is
  accepted. Tool input, dynamic tool calls, MCP elicitation, auth-token refresh,
  attestation, and current-time reads are unsupported and must block the real
  turn path until an explicit handler exists.
- MCP OAuth login is not handled inside a turn or approval callback path. The
  only browser route that may start it is the separate
  `/api/mcp-oauth-login` integration route, which is disabled by default,
  exact-allowlisted, one-time-preflight-tokened, and audited without storing
  server names, authorization URLs, tokens, paths, or raw app-server payloads.
- Browser-originated approval decisions can only be recorded locally as
  deny-only decisions or forwarded for pending managed app-server approval
  requests. Forwarding requires `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` plus
  `CODEX_APP_PORT_ALLOW_APPROVAL_FORWARDING=1`; accept-once forwarding also
  requires `CODEX_APP_PORT_ALLOW_APPROVAL_DETAILS=1` and
  `CODEX_APP_PORT_ALLOW_APPROVAL_ACCEPT=1`.
- Each pending approval summary includes a process-local decision token. The
  token is required on `/api/approval-decisions` POST requests and is removed
  from responses after a decision is recorded.
- `CODEX_APP_PORT_ALLOW_APPROVAL_DETAILS=1` can add bounded redacted command
  previews for pending managed approvals only. Those previews strip path-like,
  URL-like, email-like, and token-like substrings, are not returned after a
  decision is recorded, and are not persisted to the audit log.
- The desktop launcher appends accepted local deny decisions, forwarded managed
  accept-once/deny decisions, and replay rejections to a sanitized JSONL audit
  log. The log contains suffixes, counts, request kind/method, and decision
  state only; it does not contain prompt text, command text, full paths,
  decision tokens, or app-server responses.

## Current Implementation

Keep `/api/thread-start`, `/api/thread-archive-action`,
`/api/thread-delete-action`, `/api/thread-compact-start`, and `/api/turn-start`
returning `403` by default. Keep `/api/thread-goal` and `/api/thread-turns`
blocked by default without app-server traffic.

When the server is started with `CODEX_APP_PORT_ALLOW_THREAD_START=1`,
`/api/thread-start` may call `thread/start` only after consuming a matching
one-time `/api/thread-start-preflight` token. Missing, stale, or
intent-mismatched tokens fail before app-server traffic. That opt-in path uses
the allowlisted workspace cwd, read-only sandbox, user-routed approvals, empty
environments, and no model traffic. Browser responses and action audit records
return only suffix/status/policy metadata without full ids, cwd, paths,
instruction sources, prompt text, raw app-server payloads, or preflight tokens.

When the server is started with `CODEX_APP_PORT_ALLOW_THREAD_GOAL=1`,
`/api/thread-goal` may call `thread/list` to resolve the selected suffix and
then `thread/goal/get` for that thread. Browser responses return only suffix,
goal presence/status, token/time usage, token budget presence/value, and
objective length/line counts. They do not return objective text, full ids,
exact goal timestamps, cwd, paths, thread content, raw app-server payloads, or
preflight tokens.

When the server is started with `CODEX_APP_PORT_ALLOW_THREAD_GOAL_SET=1` or
`CODEX_APP_PORT_ALLOW_THREAD_GOAL_CLEAR=1`,
`/api/thread-goal-set-action` and `/api/thread-goal-clear-action` may mutate
goal state only after a matching one-time preflight token is consumed. Both
routes resolve the selected suffix through `thread/list`, call only
`thread/goal/set` or `thread/goal/clear`, and write sanitized action-audit
records. Goal set accepts bounded objective text, status, and token budget as
input, but responses and audit records return only objective counts plus
status/budget metadata, not objective text, full ids, cwd, paths, thread
content, raw app-server payloads, or preflight tokens.

When the server is started with
`CODEX_APP_PORT_ALLOW_THREAD_MEMORY_MODE_SET=1`,
`/api/thread-memory-mode-set-action` may call `thread/memoryMode/set` only
after consuming a matching one-time preflight token. It resolves the selected
suffix through `thread/list`, accepts only `enabled` or `disabled`, writes a
sanitized action-audit record, and returns only suffix/mode/status metadata.
It does not return full ids, cwd, paths, thread content, raw app-server
payloads, or preflight tokens.

`/api/thread-metadata-update-preflight` validates a selected thread suffix and
optional `gitInfo` branch/origin/SHA arguments locally without app-server
traffic. It rejects unsupported keys or unsafe values, issues only a local
confirmation token for the blocked intent, and has no matching execution route.
Browser responses return only count/presence metadata plus explicit blocked
policy flags, not full ids, branch names, origin URLs, SHAs, cwd, paths,
argument text, secrets, raw app-server payloads, or preflight tokens outside the
standard protected token field.

`/api/thread-resume-inject-preflight` validates selected-thread
`thread/resume` and `thread/inject_items` intent locally without app-server
traffic. It summarizes official argument shapes such as resume history/path/cwd
overrides or inject item counts, issues only a local confirmation token for the
blocked intent, and has no matching execution route. Browser responses return
only counts and safety flags, not full ids, thread content, paths, argument
text, secrets, raw app-server payloads, or raw request payloads.

`/api/thread-realtime-preflight` validates selected-thread
`thread/realtime/start`, `thread/realtime/appendAudio`,
`thread/realtime/appendText`, `thread/realtime/appendSpeech`, and
`thread/realtime/stop` intent locally without app-server traffic. It summarizes
official argument shapes such as output modality, voice/version enums,
transport kind, SDP size, audio sizes, text size, role, and stop intent, issues
only a local confirmation token for the blocked intent, and has no matching
execution route. Browser responses return only enum/count/presence metadata and
safety flags, not full ids, thread content, prompt text, audio data, text, SDP,
realtime session ids, paths, secrets, raw app-server payloads, or raw request
payloads.

`/api/thread-guardian-preflight` validates selected-thread
`thread/increment_elicitation`, `thread/decrement_elicitation`, and
`thread/approveGuardianDeniedAction` intent locally without app-server traffic.
It summarizes official argument shapes such as empty elicitation params, guardian
event presence, event size, object key counts, and URL/path/secret-like counters,
issues only a local confirmation token for the blocked intent, and has no
matching execution route. Browser responses return only count/presence metadata
and safety flags, not full ids, thread content, guardian event details, paths,
secrets, raw app-server payloads, or raw request payloads.

When the server is started with `CODEX_APP_PORT_ALLOW_THREAD_TURNS=1`,
`/api/thread-turns` may call `thread/list` to resolve the selected suffix and
then `thread/turns/list` with `itemsView:notLoaded` for that thread. Browser
responses return only suffix, turn status/count metadata, cursor-presence
booleans, and redaction flags. They do not return item content, cursor values,
full ids, exact turn timestamps, cwd, paths, thread content, raw app-server
payloads, or preflight tokens.

When the server is started with `CODEX_APP_PORT_ALLOW_THREAD_ARCHIVE=1`,
`/api/thread-archive-action` may call `thread/archive` or `thread/unarchive`
only after consuming a matching one-time `/api/thread-archive-preflight` token.
Missing, stale, or intent-mismatched tokens fail before app-server traffic.
That opt-in path resolves the thread by suffix through `thread/list`, sends no
prompt or model request, and returns only suffix/state/method/status metadata.
Browser responses and action audit records exclude full ids, names, previews,
thread content, cwd, paths, raw app-server payloads, and preflight tokens.

When the server is started with `CODEX_APP_PORT_ALLOW_THREAD_DELETE=1`,
`/api/thread-delete-action` may call `thread/delete` only after consuming a
matching one-time `/api/thread-delete-preflight` token. Missing, stale, or
intent-mismatched tokens fail before app-server traffic. That opt-in path
resolves the thread by suffix through `thread/list`, sends no prompt or model
request, and returns only suffix/source-archive/method/status metadata. Browser
responses and action audit records exclude full ids, names, previews, thread
content, cwd, paths, raw app-server payloads, and preflight tokens.

When the server is started with `CODEX_APP_PORT_ALLOW_THREAD_FORK=1`,
`/api/thread-fork-action` may call `thread/fork` only after consuming a matching
one-time `/api/thread-fork-preflight` token. Missing, stale, or
intent-mismatched tokens fail before app-server traffic. That opt-in path
resolves the source thread by suffix through `thread/list`, sends no prompt or
model request, passes only the resolved `threadId` plus `excludeTurns: true`,
and returns only source suffix, forked suffix, method, status, and
exclude-turns metadata. Browser responses and action audit records exclude full
ids, names, previews, thread content, cwd, paths, raw app-server payloads, and
preflight tokens.

When the server is started with `CODEX_APP_PORT_ALLOW_THREAD_ROLLBACK=1`,
`/api/thread-rollback-action` may call `thread/rollback` only after consuming a
matching one-time `/api/thread-rollback-preflight` token. Missing, stale, or
intent-mismatched tokens fail before app-server traffic. That opt-in path
resolves the target thread by suffix through `thread/list`, sends no prompt or
model request, passes only the resolved `threadId` plus a bounded `numTurns`,
and returns only suffix, requested-turn count, returned-turn count,
method/status metadata, and policy metadata. Browser responses and action audit
records exclude full ids, names, previews, returned turn content, cwd, paths,
raw app-server payloads, and preflight tokens. The route mutates conversation
history only and does not revert workspace files.

When the server is started with `CODEX_APP_PORT_ALLOW_THREAD_SAFETY_LOCK=1`,
`/api/thread-safety-lock-action` may call `thread/settings/update` only after
consuming a matching one-time `/api/thread-safety-lock-preflight` token.
Missing, stale, or intent-mismatched tokens fail before app-server traffic.
That opt-in path resolves the target thread by suffix through `thread/list`,
sends no prompt or model request, and passes only fixed safe future-turn policy:
`approvalPolicy: "on-request"`, `approvalsReviewer: "user"`, and read-only
sandbox with network disabled. Browser bodies cannot supply cwd, model,
permissions, service tier, summary, sandbox policy, or arbitrary settings.
Browser responses and action audit records exclude full ids, cwd, paths,
settings payloads, raw app-server payloads, and preflight tokens.

When the server is started with both `CODEX_APP_PORT_ALLOW_THREAD_COMPACT=1`
and `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1`, `/api/thread-compact-start` may
call `thread/compact/start` only after consuming a matching one-time
`/api/thread-compact-preflight` token. Missing, stale, or intent-mismatched
tokens fail before app-server traffic. That opt-in path resolves only a loaded
session suffix through the persistent app-server client and marks the operation
as model traffic. Browser responses and action audit records return only
suffix/status/count/method/policy metadata without prompt text, full ids,
thread content, cwd, paths, raw app-server payloads, or preflight tokens.

When the server is started with `CODEX_APP_PORT_ALLOW_TURN_START=1`,
`/api/turn-start` may send the drafted prompt to `turn/start` only after
consuming a matching one-time `/api/turn-preflight` token. Missing, stale, or
intent-mismatched tokens fail before app-server traffic. That opt-in path forces
`approvalPolicy: "on-request"`, `approvalsReviewer: "user"`, a read-only sandbox
policy with network disabled, empty environments, automatic deny handling on the
throwaway path, and request-scoped managed deny/accept-once handling when the
session-manager approval gates are enabled. The browser cannot provide
turn-scoped cwd, sandbox, permissions, model, environment, output schema, or
reviewer overrides.
Successful starts are also recorded in `/api/turn-sessions` with sanitized id
suffixes, prompt counts, completion status, notification counts, bounded
sanitized live event snapshots, and sanitized approval summaries.
When `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` is also set, opt-in turn-start,
loaded-session inventory, live-session-control routes, and separately opted-in
live-session bulk unsubscribe reuse a persistent per-workspace app-server
client. This is still gated by the same action-specific opt-ins and preflight
tokens. If
`CODEX_APP_PORT_ALLOW_APPROVAL_FORWARDING=1` is also set, pending managed
approval requests may wait for a browser deny-only decision and forward that
deny response to app-server. Permissions approval forwarding remains
decline-only and returns an empty turn-scoped permission profile. If
`CODEX_APP_PORT_ALLOW_APPROVAL_DETAILS=1` and
`CODEX_APP_PORT_ALLOW_APPROVAL_ACCEPT=1` are also set, pending managed command
and file-change approval requests may forward one request-scoped `accept`
decision. Session-wide approve decisions remain blocked.

Keep `/api/execution-gate`, `/api/terminal-actions`, and
`/api/settings-integrations` as read-only status surfaces. The generated
schemas, `src/app-server/terminal-policy.mjs`,
`src/app-server/integration-policy.mjs`, and deny-only policy are local evidence
for the next implementation step. `/api/terminal-actions` and
`/api/settings-integrations` expose audited method names as blocked browser
methods plus fail-closed server-request/server-notification boundaries without
app-server traffic by default, and the terminal/action status
now reflects opt-in allowlisted `command/exec`, local file actions, background
terminal cleanup, command/exec terminal control, separately gated process
terminal control, exact-allowlisted thread shell commands, and accept-once
approval forwarding without enabling broad shell or `process/spawn`.
The terminal-command, process-spawn, and thread-shell-command preflight and
execution routes use route-specific nested response schemas. Process-spawn and
thread-shell-command responses also disallow a top-level command response key,
so command text can only be represented as sanitized count metadata inside the
approved route object.
The terminal-control preflight also validates matching audited `command/exec/*`
and `process/*` session-control methods locally, but still returns only
selector/input counts or resize dimensions and never writes stdin, resizes,
terminates, lists sessions, or touches app-server; responses use a
route-specific nested schema. The separate
`/api/terminal-control` mutation route is opt-in behind
`CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` plus an action-family gate:
`CODEX_APP_PORT_ALLOW_TERMINAL_CONTROL=1` for `command/exec/write`,
`command/exec/resize`, and `command/exec/terminate`, or
`CODEX_APP_PORT_ALLOW_PROCESS_TERMINAL_CONTROL=1` for `process/writeStdin`,
`process/resizePty`, and `process/kill`. Both consume a matching one-time
preflight token, enforce route-specific nested response schemas, and route
through the persistent session manager.
The settings surface also audits opt-in `model/list`,
`modelProvider/capabilities/read`, `collaborationMode/list`, `app/list`
connector inventory, and `externalAgentConfig/detect` migration discovery.
Model and collaboration-mode inventory may expose only sanitized counts or,
behind the display-name gate, bounded names with model ids, descriptions,
upgrade copy, availability messages, and mode model overrides omitted. App
inventory may expose only sanitized counts or, behind the display-name gate,
bounded names with ids, URLs, logos, labels, descriptions, and screenshots
omitted; external config detection remains counts-only and
`externalAgentConfig/import` stays blocked.
`/api/apps-list` is the stricter dedicated app inventory route: it is disabled
by default, may call only `app/list` behind `CODEX_APP_PORT_ALLOW_APPS_LIST=1`,
and never returns app names, ids, plugin display names, descriptions, labels,
logos, URLs, screenshots, cwd, filesystem access, installs, auth-linking
actions, or raw payloads.
It also keeps `plugin/read` behind a local preflight that returns only plugin
target and argument counts, with plugin names, marketplace names/paths,
descriptions, hook keys, skill content, MCP server names, and app-server reads
omitted. `/api/plugin-read` can execute the detail read only behind
`CODEX_APP_PORT_ALLOW_PLUGIN_READ=1` and a matching one-time preflight token;
it rejects `marketplacePath` and unknown argument keys before app-server
traffic and returns only plugin structure counts without plugin names, ids,
paths, URLs, descriptions, skill content, share context, or raw payloads.
`plugin/uninstall` is separately exposed only through
`/api/plugin-uninstall-preflight` and `/api/plugin-uninstall`; the mutation
route requires `CODEX_APP_PORT_ALLOW_PLUGIN_UNINSTALL=1`, an exact
`CODEX_APP_PORT_PLUGIN_UNINSTALL_ALLOWLIST` plugin-id match, safe plugin-id
validation, and a matching one-time preflight token, and returns only target
length plus response-shape counts without plugin ids/names, paths, URLs,
tokens, or raw payloads.
Plugin enablement uses its own settings-write pair,
`/api/plugin-enablement-preflight` and `/api/plugin-enablement-set`, for the
official `plugins."<plugin-id>".enabled` config shape. The mutation route
requires `CODEX_APP_PORT_ALLOW_PLUGIN_ENABLEMENT_SET=1`, an exact
`CODEX_APP_PORT_PLUGIN_ENABLEMENT_ALLOWLIST` plugin-id match, safe plugin-id
validation, and a matching one-time preflight token. The browser never supplies
the key path or merge strategy; the server constructs the key path, forces
`upsert`, and calls `config/value/write` with only the requested boolean.
Responses and action audit records return only plugin-id length, requested
enablement state, and response-shape counts without plugin ids, key paths,
values, config paths, tokens, or raw payloads.
`plugin/share/checkout` is exposed through its own
`/api/plugin-share-checkout-preflight` and `/api/plugin-share-checkout` pair,
not through generic plugin sharing. The execution route requires
`CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_CHECKOUT=1`, an exact
`CODEX_APP_PORT_PLUGIN_SHARE_CHECKOUT_ALLOWLIST` remote-plugin-id match, safe
target validation, and a matching one-time preflight token. It calls
app-server with only `{remotePluginId}` and returns only target length,
allowlist status, response-shape counts, and field-presence booleans without
remote plugin ids, marketplace/plugin names, paths, versions, tokens, or raw
payloads.
`plugin/skill/read` and `plugin/share/list` stay behind the same local
preflight pattern through `/api/plugin-content-preflight`; it returns only the
audited method plus target/argument counts and omits skill text, sharing URLs,
sharing principals, plugin names, marketplace names/paths, hook keys, MCP
server names, and app-server reads. `/api/plugin-content-read` can execute
`plugin/skill/read` behind `CODEX_APP_PORT_ALLOW_PLUGIN_CONTENT_READ=1` or
`plugin/share/list` behind `CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_LIST=1`, each
with a matching one-time preflight token. The skill route accepts only safe
remote plugin id, marketplace name, and skill name inputs, while the share-list
route sends no browser-provided parameters; both return only count metadata
without skill text, sharing URLs/principals, names, ids, paths, descriptions,
or raw payloads.
`skills/config/write` is exposed only through the dedicated local
`/api/skills-config-preflight` and `/api/skills-config-write` pair. The write
route is disabled unless `CODEX_APP_PORT_ALLOW_SKILLS_CONFIG_WRITE=1` is set,
requires a matching one-time preflight token, accepts only a safe skill name
with `{"enabled":boolean}`, rejects path selectors and unknown keys before
app-server traffic, and returns only target/argument counts plus the effective
enabled boolean. Skill names, paths, argument text, tokens, and raw payloads
remain omitted from responses and action audit records.
`skills/extraRoots/set` remains blocked as a generic browser mutation and is
exposed only through the dedicated local clear pair:
`/api/skills-extra-roots-clear-preflight` and
`/api/skills-extra-roots-clear`. The action route is disabled unless
`CODEX_APP_PORT_ALLOW_SKILLS_EXTRA_ROOTS_CLEAR=1` is set, requires a matching
one-time preflight token, accepts no browser roots/paths/arguments, calls
app-server only with `{"extraRoots":[]}`, and returns status/count/shape
metadata only. Extra roots, paths, notifications, tokens, and raw payloads
remain omitted from responses and action audit records.
`remoteControl/disable` remains blocked as a generic browser mutation and is
exposed only through the dedicated local defensive pair:
`/api/remote-control-disable-preflight` and `/api/remote-control-disable`.
The action route is disabled unless `CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_DISABLE=1`
is set, requires a matching one-time preflight token, accepts no browser
remote-control params, calls app-server only with `null` params, and returns
status/count/shape metadata only. Raw remote-control status payloads, server names,
installation ids, environment ids, notifications, tokens, and raw payloads
remain omitted from responses and action audit records.
`remoteControl/pairing/start` and `remoteControl/pairing/status` remain blocked
as generic browser mutations and are exposed only through
`/api/remote-control-pairing-preflight` for local validation. The route accepts
draft params only for count-only `manualCode`, pairing-code input,
unknown-param, URL/path, and secret-like metadata, but has no pairing execution
route, creates no pairing code, polls no claim state, performs no app-server
traffic, and returns no pairing codes, claim state, controller info,
environment ids, server names, paths, URLs, secrets, argument text, or raw
payloads.
`remoteControl/client/list` and `remoteControl/client/revoke` are exposed only
through the dedicated remote-client routes. Listing is disabled unless
`CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_LIST=1` is set, resolves
`environmentId` with `remoteControl/status/read` inside the server, and returns
only opaque process-local client refs plus count and presence metadata. Revoke
is disabled unless `CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_REVOKE=1` is set,
requires a matching one-time preflight token, resolves the real `environmentId`
and `clientId` only from the server-side registry, marks refs used after
success, and writes sanitized action audit records. Client ids, environment ids,
device names, device metadata values, cursors, notifications, tokens, and raw
payloads remain omitted from responses and action audit records.
`config/value/write` is exposed only through the dedicated local
`/api/config-value-preflight` and `/api/config-value-write` pair. The write
route is disabled unless `CODEX_APP_PORT_ALLOW_CONFIG_VALUE_WRITE=1` is set,
the key exactly matches `CODEX_APP_PORT_CONFIG_VALUE_WRITE_ALLOWLIST`, and a
matching one-time preflight token is supplied. The server accepts only safe
dotted key paths, JSON-text values, and `replace` or `upsert`, parses the value
server-side, and forces `filePath` plus `expectedVersion` to `null`. Key paths,
values, config paths, tokens, and raw payloads remain omitted from responses and
action audit records.
`config/batchWrite` is exposed only through the dedicated local
`/api/config-batch-preflight` and `/api/config-batch-write` pair. The write
route is disabled unless `CODEX_APP_PORT_ALLOW_CONFIG_BATCH_WRITE=1` is set,
every edit key exactly matches `CODEX_APP_PORT_CONFIG_BATCH_WRITE_ALLOWLIST`,
and a matching one-time preflight token is supplied. The server accepts only a
JSON-text array of up to 10 edits with safe dotted key paths, JSON values, and
`replace` or `upsert`, then forces `filePath` plus `expectedVersion` to `null`
and reload to `false`. Key paths, values, config paths, tokens, and raw
payloads remain omitted from responses and action audit records.
`experimentalFeature/enablement/set` is exposed only through the dedicated
local `/api/experimental-feature-preflight` and
`/api/experimental-feature-set` pair. The write route is disabled unless
`CODEX_APP_PORT_ALLOW_EXPERIMENTAL_FEATURE_SET=1` is set, the feature exactly
matches `CODEX_APP_PORT_EXPERIMENTAL_FEATURE_ALLOWLIST`, and a matching
one-time preflight token is supplied. The server accepts only safe feature
identifiers and boolean enablement values. Feature names, enablement values,
config paths, tokens, and raw payloads remain omitted from responses and action
audit records.
`config/mcpServer/reload` has a separate opt-in browser route,
`/api/mcp-server-reload`, that requires
`CODEX_APP_PORT_ALLOW_MCP_SERVER_RELOAD=1` and a matching one-time preflight
token. It accepts no browser-provided app-server arguments, returns only reload
status and response-shape counts, and omits MCP server names, config paths,
command details, tokens, and raw app-server payloads from responses and action
audit records.
`mcpServer/tool/call` has a separate opt-in browser route,
`/api/mcp-tool-call`, that requires `CODEX_APP_PORT_ALLOW_MCP_TOOL_CALL=1`, an
exact `CODEX_APP_PORT_MCP_TOOL_ALLOWLIST=server/tool` match, an 8-character
thread suffix, and a matching one-time preflight token. It accepts only
JSON-object arguments, returns only result counts and error state, and omits
server/tool names, arguments, thread ids, tool output, structured content,
paths, tokens, and raw app-server payloads from responses and action audit
records.
`mcpServer/resource/read` has a separate opt-in browser route,
`/api/mcp-resource-read`, that requires `CODEX_APP_PORT_ALLOW_MCP_RESOURCE_READ=1`
and a matching one-time preflight token. It returns only count metadata for the
resource contents and omits resource URIs, MIME-type values, content, server
names, paths, tokens, and raw app-server payloads.
`/api/execution-gate` likewise reflects explicit turn-start, deny forwarding,
accept-once forwarding, and pending-approval counts while keeping session-wide
approval decisions disabled. It also returns sanitized `turnExecutionReadiness`
derived from those gates and counts only, with no tokens, prompts, ids, paths,
raw approval details, or raw app-server payloads. `/api/live-session-control`
adds opt-in, preflight-tokened interrupt/unsubscribe actions for loaded session
suffixes and a separate `CODEX_APP_PORT_ALLOW_TURN_STEER=1` path for bounded
`turn/steer` model traffic that returns prompt counts only; its preflight and
execution responses use route-specific nested schemas.
`/api/live-session-bulk-control` adds a separate
`CODEX_APP_PORT_ALLOW_LIVE_SESSION_BULK_CONTROL=1` plus session-manager gate for
loaded-session `thread/unsubscribe`, uses route-specific nested response
schemas, and returns only aggregate counts.
`/api/live-sessions` additionally exposes a sanitized lifecycle breakdown for
individual and bulk controls: recent action counts, succeeded/failed counts, and
latest-control method/status/suffix/count metadata only, with no prompt text,
preflight tokens, full ids, paths, thread content, or raw app-server payloads.
It also exposes sanitized active-session interaction metadata for UI-only row
draft/preflight controls, bulk controls, client-side grouping,
refresh-after-control behavior, route labels, suffix-only targets, action-audit requirements,
one-time preflight requirements, and hard session-wide-control rejection.
Persistent action audit logging is available through `scripts/dev-server.mjs`: successful
device-code account login, account login cancel, account credits nudge, account logout, thread creation, thread archive/unarchive, thread deletion, thread forking, thread renaming, thread rollback, thread safety lock, thread compaction,
individual and bulk live-session controls, allowlisted terminal command executions, separate
allowlisted process-spawn executions, exact-allowlisted thread shell command
submissions, background terminal cleanup requests,
local file actions, MCP server reloads, MCP
tool/resource reads, plugin reads, plugin uninstalls, plugin content reads, and skills config
writes are written as sanitized JSONL
after a preflight appendability check and never include prompt text, command
text, argv, stdout/stderr, file contents, MCP output, structured content,
preflight tokens, full ids, names, arguments, paths, file basenames, terminal
session identifiers, process handles, process ids, cwd, environment values,
thread content, auth tokens, account identifiers, auth URLs, device codes,
verification URLs, login IDs, cancel references, raw request bodies,
raw app-server payloads, or the audit-log path.
Session-owned streaming now has an opt-in per-workspace client foundation, and
deny/accept-once forwarding exists for pending managed approvals behind the
explicit approval gates above.
The Approvals UI now includes a client-side selected-request detail pane derived
only from the already sanitized `/api/approval-decisions` queue item. It renders
kind, route, pending/decided state, local/managed scope, command/file metric
counts, permissions presence, safe decision counts, and audit-policy flags. It
does not render decision tokens, request keys, session ids, raw commands, raw
approval details, patch text, file contents, full ids, paths, prompts, or raw
app-server payloads.
Terminal/process notifications are treated as lifecycle metadata only:
`item/commandExecution/outputDelta`,
`item/commandExecution/terminalInteraction`, `command/exec/outputDelta`,
`process/outputDelta`, and `process/exited` are reduced to method names,
suffixes, stream labels, counts, exit codes, cap flags, and explicit
raw-omission flags. Raw output, stdin, command text, cwd, process handles, and
terminal session ids remain excluded from browser responses and persisted turn
session snapshots.
`/api/approval-decisions` records local deny-only browser decisions for
prototype UI state and can forward deny-only decisions for pending managed
requests when explicitly enabled. It can also forward one request-scoped
`accept` for pending managed command/file-change approvals when the details and
accept gates are enabled. Permissions requests expose only `decline`; the
server reply grants no file-system or network permissions. The bounded batch
path can carry those same request-scoped `accept` decisions only under the
accept gate and otherwise only the safe deny choices already present in the
sanitized queue. Session-wide approve decisions remain rejected.
Repeated decisions for the same sanitized approval request are
rejected with `409` instead of overwriting prior state. When the persistent
approval audit log is configured, the POST path also checks sanitized replay
keys already journaled on disk before accepting a local deny decision, so a
re-created process-local session/request cannot silently re-accept the same
decision.
When launched through `scripts/dev-server.mjs`, the endpoint also writes the
sanitized append-only audit log. Managed forwarded deny and accept-once
decisions are written before the browser decision is forwarded to the pending
app-server approval request; an unavailable persistent audit log therefore
fails closed for that browser-originated decision. The browser response reports
that persistent audit logging is enabled but never returns the audit-log path.
The audit log stores command counts and file-change grant-root/preview counts
only; it does not persist file-change basenames, patch text, file contents,
paths, prompts, raw approval details, or decision tokens. File-change
accept-once forwarding is exercised through the same managed-session audit path
as command accept-once forwarding.
Missing or invalid decision tokens are rejected before decision validation.
The POST path accepts either a single decision or a bounded `decisions` array
for queue denial actions and gated request-scoped accept-once actions. Batch
entries use the same session/request selector, decision, and process-local
decision token shape as the single-decision path and reject unsupported nested
fields, duplicate request selectors, NUL text, and missing tokens before audit
writes or forwarding.
The browser applies the same published batch limit before POST, so a filtered
visible queue larger than the server limit is split by user action instead of
submitting an over-limit request.
The browser approval queue is a separate view over the same endpoint. It is
refreshed during pending turn-start requests so managed approval prompts can be
answered with deny or opt-in accept-once decisions while the original start
waits. Local turn-session file-change approvals preserve only redacted reason
metadata and the grant-root basename, never full paths, patches, file contents,
or tokens. With `CODEX_APP_PORT_ALLOW_APPROVAL_DETAILS=1`, pending managed command
approvals may include a bounded redacted command preview, and pending managed
file-change approvals may include bounded redacted metadata containing reason
and grant-root basename only. Permissions approvals expose only kind, suffixes,
cwd basename, safe `decline`, and permission-presence booleans; the requested
permission profile is never returned. File-change patches, file contents, full paths,
and raw approval payloads are not returned, and previews are omitted after a
decision is recorded. The queue summary is count-only for pending/decided,
local/managed, request kinds, safe deny/accept choices, token-required
requests, grant-root presence, and redacted previews; it omits decision tokens,
request keys, session identifiers, raw approval details, paths, permission
profiles, patches, and file contents. Browser filtering for pending/decided state, local versus
managed source, and command/file-change/permissions kind is applied only to that
already sanitized queue. The visible-subset deny and gated accept controls still
submit the same bounded tokenized `decisions` batch and cannot bypass
decision-token checks or server-side safe-decision validation.
The approval panel also exposes a client-only manual refresh control and
Manual/Polling/Refreshing state indicator. That control reuses the existing
sanitized approval, turn-session, and execution-gate refresh paths and does not
add API fields, decision scopes, tokens, raw approval details, commands,
patches, file contents, paths, prompts, ids, or app-server payloads.
The same GET payload exposes an `approvalLifecycle` summary derived only from
the already sanitized queue and process-local decision history. It can return
state labels, aggregate queue/history counts, local versus forwarded decision
counts, and latest sanitized decision metadata, but no decision tokens, request
keys, session identifiers, raw command text, raw approval details, file-change
patches, file contents, full paths, prompts, or app-server payloads.

# Architecture

## Preferred Route: Native Linux Client

Build an Omarchy/Linux desktop client that talks to Codex through the official
app-server protocol.

High-level shape:

1. Desktop shell: Tauri or Electron, selected after an initial spike. The
   current prototype is a dependency-free browser shell served from loopback.
2. Backend connection: `codex app-server` over stdio or a local Unix socket.
3. Protocol types: generated from the official app-server JSON schemas where
   practical. The current prototype uses dependency-free runtime contracts for
   the subset already exercised.
4. UI: local React/TypeScript client implementing project, thread, approval,
   diff, terminal, settings, and integration workflows.
5. Packaging: Arch/Omarchy-first packaging, with reproducible pinned builds.

The initial transport should be stdio unless a Unix socket is needed for
multi-window behavior. WebSocket transport is marked experimental upstream and
requires explicit auth if exposed beyond loopback.

## 2026-06-29 Upstream Recalibration

The reference app-server snapshot was refreshed from local `codex-cli 0.142.4`
after checking the official app docs, changelog, and `openai/codex` at
`ccdfb4f342a2e659be7ab878309cc5d81683d737`. The protocol now exposes 335 JSON
Schema files and adds remote-control, permission-profile, account-usage,
environment, plugin checkout/install, skill extra-root, thread
delete/search/settings/background-terminal, thread goal/memory/metadata,
realtime audio/text/speech, review/feedback, filesystem read/watch, fuzzy file
search, Windows sandbox, attestation, external-time, import-progress,
model-safety-buffering, and turn-moderation surfaces.

Plan adjustment: before implementing new parity work, classify each new method
as read-only, local mutation, model-traffic, external-control,
filesystem/process, auth/account, or external-code surface. Keep unimplemented
surfaces blocked from browser routes until they have strict request schemas,
one-time preflights where needed, explicit operator opt-ins, allowlists for
targets, sanitized response contracts, and action/audit records.
`permissionProfile/list`, `account/usage/read`,
`account/workspaceMessages/read`, `externalAgentConfig/import/readHistories`,
`plugin/installed`, and `remoteControl/status/read` are the first refreshed
0.142 surfaces promoted into the opt-in inventory path, with counts-only output
and no profile ids, profile descriptions, usage values, bucket dates, message
ids, message bodies, message timestamps, import ids, import paths, import
messages, plugin ids, plugin names, plugin paths, plugin URLs, plugin prompts,
remote-control status strings, server names, installation ids, environment ids,
or raw payloads.
`thread/search` is promoted separately through a disabled-by-default POST route
behind `CODEX_APP_PORT_ALLOW_THREAD_SEARCH=1`; it returns only accepted-state,
counts, cursor-presence, and suffix/status/source metadata, never the search
term, snippets, names, previews, full ids, paths, cursors, or raw payloads.
`thread/goal/get` is promoted separately through a disabled-by-default GET
route behind `CODEX_APP_PORT_ALLOW_THREAD_GOAL=1`; it resolves the target by
suffix through `thread/list` and returns only goal presence/status plus
usage/count metadata, never the objective text, full ids, timestamps, paths, or
raw payloads.
`thread/goal/set` and `thread/goal/clear` are promoted separately through
disabled-by-default POST routes behind
`CODEX_APP_PORT_ALLOW_THREAD_GOAL_SET=1` and
`CODEX_APP_PORT_ALLOW_THREAD_GOAL_CLEAR=1`; each requires a matching one-time
preflight token, resolves the target by suffix through `thread/list`, writes
sanitized action-audit records, and returns only suffix/status/count metadata,
never objective text, full ids, cwd, paths, thread content, preflight tokens,
or raw payloads.
`thread/memoryMode/set` is promoted separately through a disabled-by-default
POST route behind `CODEX_APP_PORT_ALLOW_THREAD_MEMORY_MODE_SET=1`; it accepts
only `enabled` or `disabled`, requires a matching one-time preflight token,
resolves the target by suffix through `thread/list`, writes sanitized
action-audit records, and returns only suffix/mode/status metadata, never full
ids, cwd, paths, thread content, preflight tokens, or raw payloads.
`thread/turns/list` is promoted separately through a disabled-by-default GET
route behind `CODEX_APP_PORT_ALLOW_THREAD_TURNS=1`; it resolves the target by
suffix through `thread/list`, requests `itemsView:notLoaded`, and returns only
turn status/count/cursor-presence metadata, never item content, cursor values,
full ids, timestamps, paths, or raw payloads.
`thread/turns/items/list` is promoted separately through a disabled-by-default
GET route behind `CODEX_APP_PORT_ALLOW_THREAD_TURN_ITEMS=1`; it resolves the
thread suffix through `thread/list`, resolves the turn suffix through
`thread/turns/list` with `itemsView:notLoaded`, requests a capped item page,
and returns only item suffix/type/status/count metadata and redaction flags,
never message text, prompts, commands, output, patches, paths, cursor values,
full ids, timestamps, or raw payloads.
`thread/realtime/listVoices` is promoted separately through a
disabled-by-default GET route behind
`CODEX_APP_PORT_ALLOW_THREAD_REALTIME_VOICES=1`; it sends no browser
parameters, filters results to the official generated voice enum, and returns
only known voice names/defaults without starting realtime sessions, sending
audio/text/speech, triggering model traffic, or exposing SDP, transcript
content, ids, paths, unknown strings, or raw payloads.
`thread/delete` is promoted through a separate disabled-by-default destructive
POST route behind `CODEX_APP_PORT_ALLOW_THREAD_DELETE=1`; it requires a
matching one-time preflight token, resolves targets by suffix through
`thread/list`, calls only `thread/delete`, and returns only suffix/state/method
metadata without full ids, names, previews, thread content, paths, tokens, or
raw payloads.
Remote-control mutations and pairing/client lists, environment add, plugin checkout/install, skills extra roots,
thread settings, thread goal/memory/metadata, realtime audio/text/speech,
review/feedback, filesystem read/watch, fuzzy file search, Windows sandbox,
background terminal termination, tool input, dynamic tool-call, MCP
elicitation, auth-token refresh, attestation, current-time requests, import
progress, model safety, and moderation notifications are classified in local
fail-closed policies and must not be implicitly inherited from the updated
schema.

## Compatibility Fallback

A second path can package the official macOS DMG into a Linux Electron runtime,
similar to the unofficial port. This is riskier and should remain fallback-only.

Required safeguards before this path is allowed:

- no `curl | bash`
- no global installs
- no `@latest` dependency resolution
- no automatic updater loop
- no unaudited patching of minified production assets
- all downloaded binaries pinned by version and digest
- dependency installation performed in an isolated build environment
- generated output scanned before first launch
- Electron sandbox decision documented and tested

## First Implementable Milestones

M0: Repository framing and security baseline.

M1: Minimal app-server smoke client.

- start or connect to local `codex app-server`
- perform initialize handshake
- list/read basic account or config state
- start one test thread in a throwaway workspace
- stream events to a log-only UI

Current M1 status:

- done: dependency-free JSONL-RPC client for stdio transport
- done: dependency-free runtime protocol contracts for the methods currently
  used by the prototype
- done: official generated JSON Schema snapshot for the experimental
  app-server protocol from local `codex-cli 0.142.4`
- done: executable goal audit that maps the full objective to concrete repo
  evidence and keeps incomplete work visible
- done: `initialize` request and required `initialized` notification
- done: read-only `config/read` and `thread/list` smoke probes
- done: mock app-server unit tests
- done: gated opt-in throwaway-thread harness in code and mock tests
- done: POST-only `/api/agent-turn` endpoint and UI button behind explicit env
  gate
- pending: real throwaway-thread verification, because that can invoke
  authenticated model traffic and must remain an explicit operator action
- done: first read-only loopback UI shell for connection/config/thread metadata
- done: sanitized event log for the gated agent-turn probe
- done: workspace selector backed by explicit server-side allowlists,
  opt-in direct-child Git project discovery, and opaque browser ids
- done: active and archived thread metadata listing with client-side
  search/filtering over sanitized fields
- done: opt-in server-side `thread/search` route with strict POST body
  validation, explicit `CODEX_APP_PORT_ALLOW_THREAD_SEARCH=1` gate, and
  suffix/count-only browser responses that omit search terms, snippets, names,
  previews, full ids, paths, cursors, and raw payloads
- done: opt-in destructive `thread/delete` route with strict POST body
  validation, explicit `CODEX_APP_PORT_ALLOW_THREAD_DELETE=1` gate, matching
  one-time preflight consumption, suffix resolution through `thread/list`,
  `thread/delete` only, and suffix/state/method responses plus sanitized action
  audit records without full ids, names, previews, thread content, cwd, paths,
  tokens, or raw app-server payloads
- done: read-only Git worktree branch/worktree inventory for the selected
  allowlisted workspace, without Git subprocesses, remote URLs, linked gitdir
  following, or absolute paths
- done: bounded best-effort `.git/index` status counts using mtime/size
  metadata and top-level untracked counts, without file contents or paths in
  browser responses
- done: blocked Git branch-switch preflight that validates a target branch
  against read-only inventory without Git subprocesses, ref writes, or path
  disclosure; successful preflights issue a local token for future mutation
  gating
- done: path-free Git branch-switch safety counts for hook files, filter config
  sections, and attributes files so checkout/switch risks are visible before
  enabling real Git mutations
- done: selected-thread metadata timeline using `thread/read` without exposing
  transcript text or raw item payloads
- done: selected-thread transcript text panel with length bounds, path
  redaction, and no raw payloads
- done: selected-thread file-change review with file basenames, bounded
  redacted diff previews, no file contents, and no complete paths
- done: bounded read-only notification streaming over sanitized SSE with
  redacted agent-message deltas
- done: selected-thread suffix filtering for read-only live notifications,
  validated before opening SSE and applied after sanitation
- done: blocked-by-default `/api/live-sessions` boundary with opt-in
  suffix-only `thread/loaded/list` reads behind
  `CODEX_APP_PORT_ALLOW_LOADED_SESSIONS=1`
- done: blocked-by-default `/api/live-session-control` boundary with opt-in
  `turn/interrupt` and `thread/unsubscribe` execution behind
  `CODEX_APP_PORT_ALLOW_LIVE_SESSION_CONTROL=1`, matching one-time preflight
  token consumption, plus separately opted-in `turn/steer` execution behind
  `CODEX_APP_PORT_ALLOW_TURN_STEER=1` with bounded prompt input, explicit
  model-traffic metadata, prompt-count-only responses, suffix-only target
  metadata, route-specific nested response schemas, and no prompt
  text/transcript/path/terminal-output disclosure
- done: separately gated `/api/live-session-bulk-control` boundary behind
  `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` and
  `CODEX_APP_PORT_ALLOW_LIVE_SESSION_BULK_CONTROL=1`, matching one-time
  preflight token consumption, `thread/unsubscribe` only for loaded sessions,
  route-specific nested response schemas, count-only responses/history/audit
  records, and no full ids, suffix arrays, prompt text, thread content, paths,
  terminal output, or raw app-server payloads
- done: process-local live-session control history returned through
  `/api/live-sessions`, capped and sanitized to action/method/suffix/status/
  count/token-consumption metadata only, with no preflight tokens, prompt text,
  full ids, paths, or thread content
- done: richer sanitized live-session lifecycle summary and UI counters for
  recent interrupt/unsubscribe/steer/bulk action counts, succeeded/failed
  control counts, and latest-control method/status/suffix/count metadata,
  without prompts, full ids, paths, tokens, or thread content
- done: sanitized active-session operations summary and UI counters for
  suffix-only inventory visibility, enabled single-session controls, enabled
  bulk controls, session-manager routing, model-traffic-control state, and
  one-time preflight requirements without prompts, full ids, paths, tokens,
  thread content, or raw app-server payloads
- done: sanitized append-only action audit log for successful thread creation,
  thread archive/unarchive actions, thread deletion, thread forking, thread renaming, thread rollback actions, thread safety locks, thread compaction starts, individual and
  bulk live-session controls, allowlisted terminal command executions,
  background terminal cleanup requests, and local file actions launched through
  `scripts/dev-server.mjs`, with appendability checked before app-server or
  local filesystem mutation and no prompt text, command text, argv,
  stdout/stderr, file contents, preflight tokens, full ids, cwd, paths,
  instruction sources, file basenames, terminal output, terminal session
  identifiers, thread content, raw request body, or audit path exposure
- done: local turn draft preflight with prompt non-echo and execution blocked
- done: opt-in `/api/thread-start` path behind
  `CODEX_APP_PORT_ALLOW_THREAD_START=1`, with matching one-time
  thread-start-preflight token consumption, route-specific nested response
  schemas, `thread/start` only, read-only sandbox, user-routed approvals, empty
  environments, no model traffic, sanitized suffix-only response metadata, and
  sanitized action audit records without prompt text, full ids, cwd, paths,
  instruction sources, or raw app-server payloads
- done: opt-in `/api/thread-archive-action` path behind
  `CODEX_APP_PORT_ALLOW_THREAD_ARCHIVE=1`, with matching one-time
  thread-archive-preflight token consumption, route-specific nested response
  schemas, suffix resolution through `thread/list`, `thread/archive` or
  `thread/unarchive` only, no model traffic, sanitized suffix/state/method
  response metadata, and sanitized action audit records without names,
  previews, transcript content, full ids, cwd, paths, or raw app-server payloads
- done: opt-in `/api/thread-rollback-action` path behind
  `CODEX_APP_PORT_ALLOW_THREAD_ROLLBACK=1`, with matching one-time
  thread-rollback-preflight token consumption, route-specific nested response
  schemas, suffix resolution through `thread/list`, `thread/rollback` only with
  bounded `numTurns`, no model traffic, sanitized suffix/count/status/method
  response metadata, and sanitized action audit records without names,
  previews, transcript content, full ids, cwd, paths, returned turn content, or
  raw app-server payloads
- done: opt-in `/api/thread-safety-lock-action` path behind
  `CODEX_APP_PORT_ALLOW_THREAD_SAFETY_LOCK=1`, with matching one-time
  thread-safety-lock-preflight token consumption, route-specific nested response
  schemas, suffix resolution through `thread/list`, `thread/settings/update`
  only with fixed safe future-turn policy (`on-request`, `user`, read-only
  sandbox, network disabled), no browser-supplied cwd/model/permissions/settings
  controls, no model traffic, sanitized suffix/policy/status response metadata,
  and sanitized action audit records without settings payloads, full ids, cwd,
  paths, or raw app-server payloads
- done: local-only `/api/thread-metadata-update-preflight` path for
  `thread/metadata/update`, with route-specific nested response schemas,
  selected-thread suffix validation, optional `gitInfo` branch/origin/SHA shape
  validation, no execution route, no app-server traffic, no metadata mutation,
  no model traffic, and sanitized count/presence metadata without full ids,
  branch names, origin URLs, SHAs, cwd, paths, arguments, secrets, or raw
  payloads
- done: local-only `/api/thread-resume-inject-preflight` path for
  `thread/resume` and `thread/inject_items`, with route-specific nested
  response schemas, selected-thread suffix validation, official method
  allowlisting, resume/inject argument shape validation, no execution route, no
  app-server traffic, no model traffic, no thread resume or item injection, and
  sanitized count/presence metadata without full ids, thread content, cwd,
  paths, item text, arguments, secrets, or raw payloads
- done: local-only `/api/thread-realtime-preflight` path for
  `thread/realtime/start`, `thread/realtime/appendAudio`,
  `thread/realtime/appendText`, `thread/realtime/appendSpeech`, and
  `thread/realtime/stop`, with route-specific nested response schemas,
  selected-thread suffix validation, official method allowlisting, realtime
  argument shape validation, no execution route, no app-server traffic, no
  model traffic, no realtime start/audio/text/speech/stop side effects, and
  sanitized enum/count/presence metadata without full ids, thread content,
  prompt text, audio data, text, SDP, realtime session ids, paths, arguments,
  secrets, or raw payloads
- done: local-only `/api/thread-guardian-preflight` path for
  `thread/increment_elicitation`, `thread/decrement_elicitation`, and
  `thread/approveGuardianDeniedAction`, with route-specific nested response
  schemas, selected-thread suffix validation, official method allowlisting,
  guardian/elicitation argument shape validation, no execution route, no
  app-server traffic, no model traffic, no elicitation counter or guarded-action
  side effects, and sanitized count/presence metadata without full ids, thread
  content, guardian event details, paths, arguments, secrets, or raw payloads
- done: opt-in `/api/thread-compact-start` path behind both
  `CODEX_APP_PORT_ALLOW_THREAD_COMPACT=1` and
  `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1`, with matching one-time
  thread-compact-preflight token consumption, route-specific nested response
  schemas, loaded-session suffix resolution through the persistent app-server
  client, `thread/compact/start` only, explicit model-traffic metadata, and
  sanitized action audit records without prompt text, transcript content, full
  ids, cwd, paths, or raw app-server payloads
- done: capped process-local thread lifecycle action history exposed through
  `/api/execution-gate` and the UI for start/archive/delete/fork/rename/rollback/safety-lock/compact actions, with only
  suffix/count/status/token-consumed/audit metadata and no prompts, tokens, full
  ids, cwd, paths, names, previews, transcript content, or raw app-server
  payloads
- done: explicit `/api/turn-start` guard that validates locally and returns
  `403` before any app-server traffic
- done: opt-in `/api/turn-start` path behind `CODEX_APP_PORT_ALLOW_TURN_START=1`
  with matching one-time turn-preflight token consumption, read-only sandbox
  policy, network disabled, user-routed approvals, empty environments,
  automatic deny handling on the throwaway path, request-scoped managed
  deny/accept-once approval handling when the approval-forwarding gates are
  enabled, and sanitized response metadata
- done: read-only process-local `/api/turn-sessions` ledger for sanitized
  opt-in turn-start records and bounded sanitized live event snapshots without
  prompt text, full ids, paths, decision tokens, or raw approval details
- done: client-side Approvals detail pane derived only from sanitized queue
  metadata, showing request kind/route/state/scope, command/file counts,
  permissions presence, safe decision counts, and audit flags without decision
  tokens, request keys, raw approval details, command text, patch text, file
  contents, session ids, prompts, paths, or raw app-server payloads
- done: sanitized turn-session lifecycle summary with session counts,
  pending/decided approval counts, returned event counts, latest sanitized
  status, explicit turn/session/approval gates, and request-scoped approval
  policy state, without prompts, full ids, paths, decision tokens, raw approval
  details, permission profiles, raw app-server payloads, or raw events
- done: turn-session operations summary in `/api/turn-sessions` and the UI,
  derived only from sanitized lifecycle counts and gate state, with enabled
  thread/turn operation counts, local/session-manager routing, model-traffic
  gate state, manager approval/notification counts, and redaction flags without
  prompts, full ids, paths, preflight tokens, decision tokens, raw approval
  details, raw events, or app-server payloads
- done: opt-in persistent per-workspace app-server session manager behind
  `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` for gated turn-start,
  loaded-session inventory, and live-session-control routes, with close-on-server
  shutdown and the existing suffix/prompt/event sanitation boundaries
- done: read-only `/api/execution-gate` status for turn execution and the
  approval pipeline, with default browser decisions and app-server traffic
  disabled, and explicit turn-start, pending-approval, deny-forwarding, and
  accept-once-forwarding status reflected when those gates are enabled
- done: sanitized turn-execution readiness summary in `/api/execution-gate` and
  the UI, derived only from gate flags and counts, with blocked/local/managed/
  pending-approval/history state, turn-start route, preflight requirement,
  request-scoped approval gates, pending approval count, history count, and
  redaction flags without tokens, prompts, full ids, paths, raw approval
  details, or app-server payloads
- done: sanitized turn-execution authority summary in `/api/execution-gate` and
  the UI, derived only from gate/readiness counters, with blocked/model-traffic
  authority mode, turn-start route, read-only sandbox, no-network policy,
  one-preflight-token-per-turn requirement, request-scoped approval authority,
  and hard browser prompt/cwd/sandbox/approval-policy/environment blocks
  without tokens, prompts, full ids, paths, raw approval details, or app-server
  payloads
- done: approval policy for command/file-change, permissions, and legacy
  command/patch requests that defaults to deny-only handling; permissions
  approvals can only decline with an empty turn-scoped permission profile, with
  opt-in deny forwarding for pending managed approvals behind
  `CODEX_APP_PORT_ALLOW_APPROVAL_FORWARDING=1`
  and opt-in accept-once forwarding for pending managed command/file-change
  approvals behind `CODEX_APP_PORT_ALLOW_APPROVAL_DETAILS=1` plus
  `CODEX_APP_PORT_ALLOW_APPROVAL_ACCEPT=1`
- done: process-local `/api/approval-decisions` intake that requires decision
  tokens, supports a bounded tokenized batch for queue denial and gated
  accept-once actions, rejects missing/invalid tokens and duplicate decisions,
  records local deny decisions only, forwards pending managed accept-once/deny
  decisions only when explicitly enabled, and still rejects session-wide
  approve, permission grants, execpolicy/network amendments, and persistent
  root-grant decisions
- done: capped process-local approval decision history in
  `/api/approval-decisions` and the UI, exposing only sanitized
  kind/method/suffix/count/decision/forwarding/audit metadata while omitting
  decision tokens, request keys, raw approval details, prompts, paths, patches,
  file contents, session ids, and full ids
- done: sanitized approval lifecycle summary in `/api/approval-decisions` and
  the UI, derived only from the sanitized queue and decision history, with
  state/count/latest-decision metadata and no tokens, request keys, raw command
  text, raw approval details, patches, file contents, paths, prompts, or
  app-server payloads
- done: sanitized approval queue action summary in `/api/approval-decisions`
  and the UI, derived only from the sanitized queue and request-scoped policy,
  with denyable/approvable/token-required counts, local/forwarded deny and
  accept-once availability, and bounded visible-subset batch metadata while
  omitting decision tokens, request keys, session identifiers, raw approval
  details, raw commands, patches, file contents, paths, prompts, and app-server
  payloads
- done: sanitized approval management summary in `/api/approval-decisions` and
  the UI, derived only from sanitized queue, request-scoped policy, and
  process-local history summaries, with actionable/pending/history state,
  visible request counts, forward/accept/batch availability, and explicit
  rejected privileged-scope flags while omitting selectors, tokens, raw approval
  details, commands, patches, file contents, paths, prompts, ids, and app-server
  payloads
- done: sanitized approval execution-readiness summary in
  `/api/approval-decisions` and the UI, derived only from sanitized queue,
  queue-action, management, policy, and history metadata, with actionable state,
  request/action counts, request-scoped routing, batch support,
  latest-decision availability, and explicit session-wide/permission/exec/
  network/root-grant blocks while omitting tokens, request keys, raw approval
  details, preview text, commands, patches, file contents, paths, prompts, ids,
  and app-server payloads
- done: sanitized approval routing contract in `/api/approval-decisions` and
  the UI, derived only from sanitized queue/action/management/readiness/policy
  and history counts, with local deny versus managed deny/accept-once route
  state, forwarding gates, route labels, token/replay/audit state, and explicit
  request-scoped privileged-scope blocks while omitting tokens, request keys,
  raw approval details, preview text, commands, patches, file contents, paths,
  prompts, ids, and app-server payloads
- done: local turn-session approval ledger preserves command counts plus
  file-change approval reason/grant-root metadata and permissions-presence
  booleans only after browser-bound redaction, with full paths, permission
  profiles, patches, file contents, prompts, and tokens omitted
- done: dedicated approval queue in the UI, backed by `/api/approval-decisions`,
  with polling while turn-start is pending, local sanitized filters, row-level
  request-scoped deny/gated accept-once controls with in-flight disablement, and
  single bounded visible-subset deny plus gated accept batches so managed
  approvals can be accepted once or denied without enabling session-wide
  approvals; the queue also has a client-only manual refresh control plus
  Manual/Polling/Refreshing status that reuses the existing sanitized approval,
  turn-session, and execution-gate refreshes without adding API fields, tokens,
  raw approval details, commands, patches, file contents, paths, prompts, ids,
  or app-server payloads
- done: sanitized approval workflow contract in `/api/approval-decisions` and
  the UI for client-side filters, row controls, visible-subset batch support,
  replay/audit protection state, detail-preview gates, and request-scoped
  decision-token requirements without selectors, tokens, raw approval details,
  preview text, commands, patches, file contents, paths, prompts, ids, or
  app-server payloads
- done: sanitized approval safety contract in `/api/approval-decisions` and
  the UI for request-scoped decision-token requirements, replay protection,
  audit persistence, forwarding/detail gates, batch validation, and explicit
  rejected session-wide/permission/exec/network/root-grant decisions without
  tokens, request keys, selectors, raw approval details, preview text,
  commands, patches, file contents, paths, prompts, ids, or app-server payloads
- done: sanitized approval audit contract in `/api/approval-decisions` and
  the UI for bounded decision history, persistent versus process-local audit
  mode, replay-protection scope, audit-log path redaction, batch validation,
  and hard non-logging flags without decision tokens, request keys, session
  identifiers, approval details, command text, patches, file contents,
  previews, paths, prompts, ids, or app-server payloads
- done: approval decision history rows include sanitized per-decision
  replay-protection mode/scope and audit-persistence flags while still omitting
  decision tokens, request keys, selectors, raw approval details, commands,
  patches, file contents, paths, prompts, ids, and app-server payloads
- done: sanitized approval authority contract in `/api/approval-decisions` and
  the UI for request-scoped local deny, managed deny, or accept-once authority,
  command/file-change accept-once limits, permission-approval rejection, and
  hard session-wide/permission/exec/network/root-grant blocks without tokens,
  request keys, selectors, raw approval details, preview text, commands,
  patches, file contents, paths, prompts, ids, or app-server payloads
- done: sanitized approval interaction contract in `/api/approval-decisions`
  and the UI for row controls, visible-subset batch controls, client-side
  filters, row busy/disabled sibling-button behavior, refresh-after-decision
  requirements, client-side enforcement of the published batch limit, and
  request-scoped route/token/audit gates without tokens, request keys,
  selectors, raw approval details, preview text, commands, patches, file
  contents, paths, prompts, ids, or app-server payloads
- done: request-scoped approval policy summary in `/api/approval-decisions`
  and the UI, exposing local deny, forwarded deny, accept-once gate state,
  supported approval kind labels/counts, and explicit rejected session-wide/
  execpolicy/network/root-grant scopes/counts without tokens, request keys, raw
  approval details, commands, patches, file contents, paths, prompts, or
  app-server payloads
- done: desktop-launcher approval audit log that appends sanitized JSONL records
  for accepted local deny decisions, forwarded managed accept-once/deny
  decisions, and replay rejections, and provides durable replay-key checks for already
  journaled sanitized decisions without exposing the audit path or decision
  tokens to the browser after a decision is recorded
- done: read-only `/api/settings-integrations` boundary for
  Settings/Auth/Apps/MCP/Skills/Plugins, with auth callbacks, installs, tool
  invocation, mutations, filesystem reads, and app-server traffic disabled; the
  UI includes a client-only manual refresh control and Ready/Refreshing/Failed
  status that reuses the same sanitized endpoint without adding API fields,
  tokens, names, targets, argument text, resource content, skill content, URLs,
  paths, secrets, or raw payloads
- done: browser-facing `/api/settings-integrations` Codex app settings parity
  summary aligned to the current official Settings section list, returning only
  static section keys, section states, and counts while keeping local setting
  values, profile names, paths, URLs, secrets, raw payloads, app-server payloads,
  browser handlers, and settings writes omitted; unimplemented sections stay
  explicitly blocked
- done: read-only General settings catalog inside that settings parity summary,
  exposing only static file-opening, command-output, terminal-tab,
  multiline-prompt, and prevent-sleep keys/groups/states/counts, with current
  values, local file-open targets, command-output preferences, terminal
  preferences, sleep-prevention state, paths, URLs, secrets, raw payloads,
  mutations, and app-server traffic blocked
- done: read-only Profile settings catalog inside that settings parity summary,
  exposing only static activity insight, token metric, profile detail,
  profile-card, and invitation keys/groups/states/counts, with activity
  metrics, token values, profile pictures, display names, usernames, profile
  cards, sharing URLs, invitation eligibility or links, paths, URLs, secrets,
  raw payloads, mutations, and app-server traffic blocked
- done: read-only keyboard-shortcuts catalog inside that settings parity summary,
  exposing only static shortcut keys/bindings/counts for official tracked
  shortcuts and local accessibility shortcuts, with command labels, custom/user
  bindings, keystroke search, reset/edit mutations, paths, URLs, secrets, raw
  payloads, and app-server traffic blocked
- done: read-only Agent configuration settings catalog inside that settings
  parity summary, exposing only static shared CLI/IDE inheritance, in-app common
  controls, advanced `config.toml`, Codex security reference, and config-basics
  keys/groups/states/counts, with current config values, `config.toml` content
  or paths, model settings, sandbox settings, approval settings, instruction
  values, security policy values, paths, URLs, secrets, raw payloads, config
  writes, mutations, and app-server traffic blocked
- done: read-only Appearance settings catalog inside the settings parity
  summary, exposing only static base-theme/color/font/sharing control
  keys/groups/states/counts, with active theme values, color values, font names,
  custom theme payloads, sharing URLs, paths, secrets, raw payloads, mutations,
  and app-server traffic blocked
- done: read-only Codex pets settings catalog inside the settings parity
  summary, exposing only static pet picker, `/pet`, Wake Pet, Tuck Away Pet,
  custom-pet refresh, and `hatch-pet` install control keys/groups/states/counts,
  with selected pet values, pet names, custom pet assets, local Codex home
  scans, overlay state, active-thread overlay data, skill install/reload,
  slash-command execution, paths, URLs, secrets, raw payloads, mutations, and
  app-server traffic blocked
- done: read-only Git settings catalog inside the settings parity summary,
  exposing only static branch-naming, force-push, commit-message prompt, and
  pull-request description prompt keys/groups/states/counts, with branch naming
  values, force-push preferences, prompt text, generated commit or pull-request
  text, repository names, repository paths, remote URLs, paths, URLs, secrets,
  raw payloads, mutations, and app-server traffic blocked
- done: read-only Integrations & MCP settings catalog inside the settings
  parity summary, exposing only static external-tool MCP connection,
  recommended-server, custom-server, OAuth, shared `config.toml`, and
  plugin-provided MCP server keys/groups/states/counts, with server listings,
  server names, server URLs, commands, environment variables, bearer-token
  variables, OAuth URLs/tokens, `config.toml` content or paths, tool names,
  tool allowlists, server instructions, plugin ids, setting values, config
  writes, mutations, paths, URLs, secrets, raw payloads, and app-server traffic
  blocked
- done: read-only Skills & Plugins catalog in `/api/settings-integrations`,
  exposing only static official Skills/Plugins documentation keys plus local
  preflight boundary keys/groups/states/sources/counts/redaction flags for
  progressive disclosure, scope locations, enablement config, optional app
  metadata, plugin directory/capabilities/permissions/disable config, and
  install/share/marketplace/read/uninstall/enablement/share-checkout/skills
  config boundaries, with skill names/descriptions/paths/content/scripts/
  metadata, dependency tools, plugin names/ids/paths/URLs/descriptions/
  manifests/default prompts/screenshots, marketplace names/sources, app names,
  MCP server names, hook commands, share links/principals, setting values,
  installs, uninstalls, writes, mutations, external code, paths, URLs, secrets,
  raw payloads, and app-server traffic blocked
- done: read-only Automations catalog in `/api/settings-integrations`,
  exposing only static official Automations documentation keys plus local
  boundary keys/groups/states/sources/counts/redaction flags for the
  automations pane, Triage concept, standalone/project/thread automation modes,
  custom schedules, worktree/local run modes, model/reasoning defaults,
  skills/plugins usage, prompt drafting, run review, worktree cleanup, sandbox
  security, managed-requirement fallback, and create/update/schedule/run/
  triage/worktree boundaries, with automation names, run ids/results, triage
  items, findings, prompt text, schedule or cron values, project names,
  workspace/worktree paths, model/reasoning values, skill/plugin names,
  sandbox/admin policy values, app names, notification payloads, filesystem
  access, network access, app control, unattended execution, schedule writes,
  run starts/archives, worktree creation, mutations, secrets, raw payloads, and
  app-server traffic blocked
- done: read-only Codex app Commands catalog in `/api/settings-integrations`,
  exposing only static official Commands documentation keys plus local boundary
  keys/groups/states/sources/counts/redaction flags for documented general and
  thread keyboard shortcuts, slash commands, thread/settings/skills/
  automations/plugin/pet deep-link destinations, shortcut customization,
  slash-command execution, deep-link opening, thread-search content, workspace
  path query, and pet install boundaries, with shortcut bindings, custom
  shortcuts, slash command text, deep-link templates, query parameters, thread
  ids, prompt text, workspace paths, origin URLs, SSH host aliases, plugin
  identifiers, marketplace names/paths, pet names, pet image URLs, settings
  opens, browser launches, command/slash/deep-link execution, mutations, paths,
  URLs, secrets, raw payloads, and app-server traffic blocked
- done: read-only Codex Chrome extension catalog in `/api/settings-integrations`,
  exposing only static official Chrome extension documentation keys plus local
  boundary keys/groups/states/sources/counts/redaction flags for signed-in
  browser-state use cases, Plugins setup, extension permissions, website
  allow/block workflows, browser-history prompts, Memories/data controls,
  troubleshooting, file upload file-access setup, native host, profile,
  website access, Chrome launch, tab-group control, and page-content capture
  boundaries, with extension state, Chrome profile data, site hosts,
  allowlists, blocklists, browser history entries, page content, screenshots,
  bookmarks, downloads, tab groups, permission states, memory content, plugin
  names, setting values, paths, URLs, secrets, raw payloads, native host touch,
  Chrome launch, installs, website allow, browser-history read, file-access
  enablement, network access, mutations, and app-server traffic blocked
- done: read-only Codex In-app Browser catalog in `/api/settings-integrations`,
  exposing only static official In-app Browser documentation keys plus local
  boundary keys/groups/states/sources/counts/redaction flags for rendered
  previews, web-app debugging, visual comments, local/file/public preview
  targets, unsupported auth/profile/cookie/extension/existing-tab cases,
  Browser Use, website approval settings, review flows, annotation shortcuts,
  styling feedback, scoped browser tasks, and developer-mode CDP boundaries,
  with browser state, URLs, page content, screenshots, downloads, DOM, styles,
  console output, network traffic, cookies, browser profiles, extension state,
  existing tabs, comment text, annotations, styling values, plugin names,
  setting values, routes, visual states, site hosts, allowlists, blocklists,
  CDP access, browser launch, navigation, Browser Use execution, inspection JS,
  comments, styling feedback, network access, mutations, paths, URLs, secrets,
  raw payloads, and app-server traffic blocked
- done: read-only Codex app Features catalog in `/api/settings-integrations`,
  exposing only static official Features documentation keys plus local
  boundary keys/groups/states/sources/counts/redaction flags for project
  multitasking, skills, automations, Local/Worktree/Cloud modes, built-in Git,
  worktrees, integrated terminal, local-environment actions, Windows sandbox,
  voice dictation, pop-out windows, in-app browser, Browser Use, Computer Use,
  non-code artifacts, task sidebar, IDE sync/context, thread automations,
  approvals/sandboxing, MCP, web search, and image generation, with project
  names, thread ids/content, mode selections, workspace/worktree paths, cloud
  environment names, diff content, terminal output, command text, local action
  definitions, voice audio/transcripts, window state, browser URLs/content/
  screenshots, desktop screenshots, app identifiers, artifact content/paths,
  IDE file context/state, web-search queries/results, generated images, image
  prompts, MCP server names, skill/automation names, setting values, browser
  launch, desktop control, voice capture, model/network/filesystem traffic,
  mutations, paths, URLs, secrets, raw payloads, and app-server traffic blocked
- done: read-only Browser settings catalog inside the settings parity summary,
  exposing only static Browser plugin, Chrome extension, site permission,
  ask-before-use, and full-CDP developer-mode control keys/groups/states/counts,
  with plugin/extension state, allowed/blocked site lists, origins, permission
  values, CDP state, organization policy, Chrome profile data, browser launch,
  network traffic, paths, URLs, secrets, raw payloads, mutations, and app-server
  traffic blocked
- done: read-only Computer Use settings catalog inside the settings parity
  summary, exposing only static availability, plugin install, system
  permission, app approval, Windows app policy, locked-use, sensitive-action
  approval, and safety guidance keys/groups/states/counts, with plugin install
  state, Screen Recording or Accessibility permission state, allowed/denied app
  lists, app identifiers, window titles, screen content, screenshots, clipboard
  state, locked-use state, admin policy, desktop control, permission prompts,
  paths, URLs, secrets, raw payloads, mutations, and app-server traffic blocked
- done: read-only Notifications settings catalog inside the settings parity
  summary, exposing only static notification setting keys/groups/states/counts
  plus local server-notification boundary counts, with setting values, browser
  permission state, subscriptions, notification payloads, browser Notification
  API prompts, paths, URLs, secrets, raw payloads, and app-server traffic
  blocked
- done: read-only Personalization settings catalog inside the settings parity
  summary, exposing only static personality option and custom-instructions
  boundary keys/groups/states/counts, with active personality, custom
  instructions, personal `AGENTS.md` content or paths, paths, URLs, secrets,
  raw payloads, mutations, and app-server traffic blocked
- done: read-only Context-aware Suggestions settings catalog inside the
  settings parity summary, exposing only static follow-up/resume suggestion
  keys/groups/states/counts, with suggestion text, task content, thread content
  or ids, project/workspace names, source context, ranking signals, resume
  targets, generation triggers, paths, URLs, secrets, raw payloads, mutations,
  and app-server traffic blocked
- done: read-only Memories settings catalog inside the settings parity summary,
  exposing only static global enablement, config flag, generation/use,
  external-context privacy, rate-limit threshold, extraction/consolidation
  model, per-thread control, review-memory-files boundary, and local
  memory-reset preflight keys/groups/states/counts, with current values, config
  values, memory files, memory content, memory paths, storage paths, per-thread
  choices, rate-limit values, model names, generation/injection triggers, reset
  execution, paths, URLs, secrets, raw payloads, mutations, and app-server
  traffic blocked
- done: read-only Archived threads settings catalog inside the settings parity
  summary, exposing only static archived-list, date metadata, project-context,
  and unarchive-action keys/groups/states/counts, with archived thread lists,
  dates, project context, thread names, ids, content, unarchive execution, paths,
  URLs, secrets, raw payloads, mutations, and app-server traffic blocked
- done: opt-in `/api/account-login-start` path behind
  `CODEX_APP_PORT_ALLOW_ACCOUNT_LOGIN=1`, with matching one-time
  account-login-preflight token consumption, `account/login/start` device-code
  flow only, no model traffic, protected immediate device code plus verified
  OpenAI/ChatGPT HTTPS verification URL plus an opaque process-local cancel
  reference, and sanitized action audit records without device codes,
  verification URLs, login IDs, cancel references, OAuth URLs, tokens, account
  identifiers, cwd, paths, or raw app-server payloads
- done: opt-in `/api/account-login-cancel` path behind
  `CODEX_APP_PORT_ALLOW_ACCOUNT_LOGIN_CANCEL=1`, with matching one-time
  account-login-cancel-preflight token consumption, opaque process-local cancel
  references, `account/login/cancel` only, no model traffic, and sanitized
  responses/action audit records without login references, login IDs, tokens,
  account identifiers, auth URLs, cwd, paths, or raw app-server payloads
- done: opt-in `/api/account-credits-nudge` path behind
  `CODEX_APP_PORT_ALLOW_ACCOUNT_CREDITS_NUDGE=1`, with matching one-time
  account-credits-nudge-preflight token consumption, `account/sendAddCreditsNudgeEmail`
  only, `credits`/`usage_limit` enum validation, no model traffic, and sanitized
  responses/action audit records without email addresses, tokens, account
  identifiers, auth URLs, cwd, paths, or raw app-server payloads
- done: opt-in `/api/account-reset-credit-consume` path behind
  `CODEX_APP_PORT_ALLOW_ACCOUNT_RESET_CREDIT_CONSUME=1`, with matching one-time
  account-reset-credit-consume-preflight token consumption,
  `account/rateLimitResetCredit/consume` only, server-generated idempotency key,
  no model traffic, and sanitized responses/action audit records with only a
  bounded outcome and no idempotency key, quota values, account identifiers,
  auth URLs, tokens, cwd, paths, or raw app-server payloads
- done: capped process-local `/api/settings-integrations` reset-credit consume
  history with workspace/action/outcome/token-consumed/audit metadata only, and
  explicit redaction flags for idempotency keys, quota values, rate-limit IDs,
  balances, tokens, account identifiers, URLs, paths, and raw app-server payloads
- done: opt-in `/api/account-logout` path behind
  `CODEX_APP_PORT_ALLOW_ACCOUNT_LOGOUT=1`, with matching one-time
  account-logout-preflight token consumption, `account/logout` only, no model
  traffic, and sanitized action audit records without tokens, account
  identifiers, auth URLs, cwd, paths, or raw app-server payloads
- done: capped process-local account login/cancel/credits-nudge/logout history exposed through
  `/api/settings-integrations` with workspace label/id,
  method/status, token-consumed status, and audit/redaction flags only, without
  auth tokens, account identifiers, auth URLs, email addresses, device codes,
  verification URLs, login IDs, cancel references, preflight tokens, paths, raw intents, or raw
  app-server payloads
- done: schema-backed Settings/Auth/Apps/MCP/Skills/Plugins method audit covering
  opt-in read inventory plus blocked auth callbacks, ungated MCP tool/resource
  calls, ungated MCP server reloads, settings writes, ungated skill config
  writes, ungated experimental feature writes, plugin installs/uninstalls/enablement/sharing, and
  marketplace mutations
- done: browser-facing `/api/settings-integrations` integration scope summary
  exposes only active read method names, local preflight/login/login-cancel/
  credits-nudge/logout gates, and blocked mutation method names/counts, without secrets, auth tokens, hook
  commands, rate-limit details, ungated names, paths, URLs, or raw payloads
- done: browser-facing `/api/settings-integrations` integration lifecycle summary
  and UI counters derived only from sanitized surfaces, scope, and bounded
  histories, with state/count/latest-action metadata and no preflight tokens,
  names, targets, arguments, resource content, skill content, paths, URLs,
  secrets, raw intents, or raw app-server payloads
- done: browser-facing `/api/settings-integrations` integration action summary
  and UI counters derived only from sanitized scope and histories, with
  read-method, preflight-only gate, executable opt-in action, action-family, and
  blocked mutation counts while omitting tokens, names, targets, arguments,
  resource content, skill content, paths, URLs, secrets, raw payloads, and
  app-server payloads
- done: browser-facing `/api/settings-integrations` integration management
  summary and UI counter derived only from sanitized surfaces, scope, action
  summary, and histories, with management state, surface counts,
  preflight/executable actionability, active-login counts, latest-action
  availability, and redaction flags while omitting tokens, auth tokens, names,
  targets, arguments, resources, skill content, paths, URLs, secrets, raw
  payloads, and app-server payloads
- done: browser-facing `/api/settings-integrations` execution-readiness summary
  and UI counter derived only from sanitized scope/action/management metadata,
  with blocked/preflight-only/actionable/inventory/history-only state, action
  family counts, latest-action availability, and explicit generic mutation,
  auth, install, import, marketplace, token, target, argument, path, URL, raw
  payload, and app-server payload blocks
- done: browser-facing `/api/settings-integrations` safety-contract summary
  and UI counter derived only from sanitized integration scope/action/
  management/readiness metadata, with read/local/preflight/executable gate
  counts, dedicated-route-only mutation policy, action-family counts, and
  explicit generic mutation, auth callback/token, install/linking, import,
  marketplace, plugin install/share, hook-command, token, target, argument,
  resource, skill-content, name, path, URL, secret, raw-payload, and app-server
  payload blocks
- done: browser-facing `/api/settings-integrations` routing-contract summary
  and UI counter derived only from sanitized integration scope/action/
  management/readiness metadata, with local-preflight versus dedicated-route
  action state, MCP/plugin/settings/config/experimental-feature allowlist
  requirements, device-code-only auth routing, generic mutation blocks, and
  token, target, argument, resource, skill-content, name, path, URL, secret,
  raw-payload, and app-server payload redaction flags
- done: browser-facing `/api/settings-integrations` audit-contract summary and
  UI counter derived only from sanitized integration scope/action/management/
  readiness/routing/workflow metadata, with preflight-audit versus persistent
  action-audit mode, bounded history counters and limits, allowlist
  requirements, sanitized action-audit guarantees, and token, target,
  argument, resource, skill-content, name, URL, path, secret, raw-payload, and
  app-server payload non-logging/redaction flags
- done: browser-facing `/api/settings-integrations` provenance-contract summary
  and UI counter derived only from sanitized integration scope/action/
  management/readiness/routing/workflow/audit metadata, with counts-only
  inventory provenance, allowlisted executable-route provenance, explicit
  install/import/marketplace/hook-command/plugin-skill execution blocks,
  per-family allowlist requirements, sanitized audit requirements, and token,
  target, argument, resource, skill-content, name, URL, path, secret,
  raw-payload, and app-server payload redaction flags
- done: browser-facing `/api/settings-integrations` upstream-drift summary
  derived only from static audited OpenAI HEAD method names and stable-schema
  status, with `environment/info` and `thread/items/list` blocked until a
  stable generated schema exposes them; no source paths, requirements, raw
  payloads, URLs, secrets, or app-server traffic are returned
- done: browser-facing `/api/settings-integrations` server-request and
  server-notification boundaries derived only from local audit method lists,
  with blocked method/category counts and redaction flags for tool-user-input,
  MCP elicitation, dynamic tool calls, auth-token refresh, attestation,
  current-time, import-progress, model-safety, moderation, and realtime
  notifications, without prompts, schemas, forms, tool arguments, server names,
  tokens, timestamps, transcript text, audio, SDP, progress details, paths,
  URLs, raw payloads, or browser handlers
- done: opt-in counts-only integration inventory behind
  `CODEX_APP_PORT_ALLOW_INTEGRATION_INVENTORY=1` for
  `configRequirements/read`, `model/list`, `modelProvider/capabilities/read`,
  `collaborationMode/list`, `account/read`, `account/rateLimits/read`,
  `app/list`, `mcpServerStatus/list`, `skills/list`, `plugin/list`,
  `experimentalFeature/list`, `hooks/list`, and `externalAgentConfig/detect`,
  without returning account
  emails/tokens, model ids/descriptions/upgrade copy/availability messages,
  app ids/URLs/logos/descriptions/labels/screenshots, external config
  descriptions/cwds/paths/names/marketplaces/plugin names/session titles/raw
  migration items, rate-limit plan types, limit ids/names, balances, used
  percentages, reset times, MCP names/schemas, skill paths/descriptions, plugin
  ids/paths/URLs, experimental feature names/display text/descriptions/
  announcements/cursors, hook commands/paths/keys/matchers/plugin IDs, or
  config requirement values/domains
- done: second-gate integration display inventory behind
  `CODEX_APP_PORT_ALLOW_INTEGRATION_NAMES=1`, returning bounded model display
  names, collaboration-mode names, app/connector, app plugin display, MCP
  server/tool, skill, plugin, and safe experimental feature display names only
  after path-like, URL-like, and token-like values are stripped, while still
  omitting model ids/descriptions/upgrade copy/availability messages,
  collaboration-mode model overrides, app ids/URLs/descriptions/labels/logos/
  screenshots, MCP schemas/resource URIs, skill descriptions/paths, plugin ids/
  paths/URLs, hook details,
  external config descriptions/cwds/paths/names/plugin names/session titles/raw
  migration items, account emails/tokens, rate-limit details, and config
  requirement values/domains, plus experimental feature descriptions/
  announcements
- done: MCP tool-call preflight with server/tool/argument count metadata only,
  no names returned, no argument echo, no schemas, no resource content, no tool
  invocation, no app-server traffic, and a local preflight token for mutation
  gating
- done: opt-in `/api/mcp-tool-call` behind
  `CODEX_APP_PORT_ALLOW_MCP_TOOL_CALL=1`, exact
  `CODEX_APP_PORT_MCP_TOOL_ALLOWLIST=server/tool`, a thread suffix, and a
  matching one-time preflight token, returning only result counts and sanitized
  action audit records without server/tool names, arguments, thread ids, tool
  output, structured content, paths, tokens, or raw payloads
- done: opt-in `/api/mcp-server-reload` behind
  `CODEX_APP_PORT_ALLOW_MCP_SERVER_RELOAD=1` and a matching one-time preflight
  token, calling only `config/mcpServer/reload` and returning status/response
  shape counts plus sanitized action audit records without MCP server names,
  config paths, command details, tokens, or raw payloads
- done: opt-in `/api/mcp-oauth-login` behind
  `CODEX_APP_PORT_ALLOW_MCP_OAUTH_LOGIN=1`, exact
  `CODEX_APP_PORT_MCP_OAUTH_ALLOWLIST` server-name match, safe server-name
  validation, and a matching one-time preflight token, calling only
  `mcpServer/oauth/login`, returning a sanitized HTTPS authorization URL only
  in the protected immediate response, and reducing histories plus action audit
  records to counts/redaction flags without server names, OAuth URLs, tokens,
  paths, or raw payloads
- done: opt-in account device-code login, login cancel, and logout behind
  separate local enablement gates and matching one-time preflight tokens, with
  route-specific nested response schemas, calling only `account/login/start`,
  `account/login/cancel`, or `account/logout`, returning device-code login
  values only in the protected immediate response, and reducing histories plus
  action audit records to status/redaction flags without login ids, cancel
  references, auth tokens, account identifiers, paths, or raw payloads
- done: blocked MCP resource-read preflight with server/resource count metadata
  only, no names returned, no resource URI/content echo, no schemas, no
  app-server traffic, and a local preflight token for future read gating
- done: opt-in `/api/mcp-resource-read` behind
  `CODEX_APP_PORT_ALLOW_MCP_RESOURCE_READ=1` and a matching one-time preflight
  token, with route-specific nested response schemas, returning only content
  counts/text-blob counts/character counts and sanitized action audit records
  without resource URIs, MIME types, content, server names, paths, tokens, or
  raw payloads
- done: opt-in `/api/plugin-read` behind `CODEX_APP_PORT_ALLOW_PLUGIN_READ=1`
  and a matching one-time preflight token, with preflight-only validation by
  default, route-specific nested response schemas, safe plugin-name and
  `remoteMarketplaceName` execution inputs, `marketplacePath`/unknown-argument
  rejection before app-server traffic, and responses plus action audit records
  reduced to plugin/app/hook/MCP server/skill/keyword counts and character
  counts without plugin or marketplace names, ids, descriptions, paths, URLs,
  hook keys, skill content, share context, tokens, or raw payloads
- done: local-only `/api/plugin-install-preflight` for audited `plugin/install`
  intent, with route-specific nested response schemas, target/argument counts,
  URL/path/secret-like counters, install field-presence booleans, short-lived
  preflight confirmation/history, and no install/download/materialization
  route, app-server traffic, target/argument echo, plugin names, marketplace
  names, paths, URLs, secrets, or raw payloads
- done: local-only `/api/marketplace-action-preflight` for audited
  `marketplace/add`, `marketplace/remove`, and `marketplace/upgrade` intent,
  with route-specific nested response schemas, target/argument counts,
  URL/path/secret-like counters, source/ref/sparse-path/name presence booleans,
  short-lived preflight confirmation/history, and no marketplace mutation,
  download, checkout, materialization route, app-server traffic, target/argument
  echo, marketplace names, sources, refs, paths, URLs, secrets, or raw payloads
- done: opt-in `/api/plugin-uninstall` behind
  `CODEX_APP_PORT_ALLOW_PLUGIN_UNINSTALL=1`, exact
  `CODEX_APP_PORT_PLUGIN_UNINSTALL_ALLOWLIST` plugin-id match, safe plugin-id
  validation, and a matching one-time preflight token, with preflight-only
  validation by default, route-specific nested response schemas, and responses
  plus action audit records reduced to target length and response-shape counts
  without plugin ids/names, paths, URLs, tokens, or raw payloads
- done: opt-in `/api/plugin-enablement-set` behind
  `CODEX_APP_PORT_ALLOW_PLUGIN_ENABLEMENT_SET=1`, exact
  `CODEX_APP_PORT_PLUGIN_ENABLEMENT_ALLOWLIST` plugin-id match, safe plugin-id
  validation, and a matching one-time preflight token, with preflight-only
  validation by default, a server-constructed `plugins."<plugin-id>".enabled`
  key path, forced `upsert`, boolean values only, route-specific nested
  response schemas, and responses plus action audit records reduced to
  plugin-id length, requested state, and response-shape counts without plugin
  ids, key paths, values, config paths, tokens, or raw payloads
- done: opt-in `/api/plugin-share-checkout` behind
  `CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_CHECKOUT=1`, exact
  `CODEX_APP_PORT_PLUGIN_SHARE_CHECKOUT_ALLOWLIST` remote-plugin-id match, safe
  target validation, and a matching one-time preflight token, with preflight-only
  validation by default, route-specific nested response schemas, a fixed
  `{remotePluginId}` app-server payload, and responses plus action audit records
  reduced to target length, allowlist status, response-shape counts, and
  field-presence booleans without remote plugin ids, marketplace/plugin names,
  paths, versions, tokens, or raw payloads
- done: local-only `/api/plugin-share-action-preflight` for audited
  `plugin/share/save`, `plugin/share/updateTargets`, and `plugin/share/delete`
  intent, with route-specific nested response schemas, target/argument counts,
  URL/path/secret-like counters, share-target/principal counters,
  field-presence booleans, short-lived preflight confirmation/history, and no
  share mutation route, app-server traffic, share-target/principal echo, plugin
  names, principal ids, paths, URLs, secrets, or raw payloads
- done: local-only `/api/external-config-import-preflight` for audited
  `externalAgentConfig/import` intent, with route-specific nested response
  schemas, target/argument counts, URL/path/secret-like counters, migration
  item/plugin/marketplace/session/command/hook/MCP/subagent counters,
  short-lived preflight confirmation/history, and no import execution route,
  app-server traffic, migration item echo, plugin names, marketplace names,
  session titles, commands, hook commands, MCP server names, subagent names,
  paths, URLs, secrets, or raw payloads
- done: local-only `/api/review-feedback-preflight` for audited
  `review/start` and `feedback/upload` intent, with route-specific nested
  response schemas, target/argument counts, review target/delivery/thread-id
  presence, feedback classification/reason/log/tag counters, URL/path/secret
  counters, short-lived preflight confirmation/history, and no review or
  feedback execution route, app-server traffic, thread ids, branches, SHAs,
  titles, instructions, feedback reason, log paths, tags, URLs, secrets, or raw
  payloads
- done: local-only `/api/memory-reset-preflight` for audited `memory/reset`
  intent, with route-specific nested response schemas, no browser params,
  official null-params requirement, short-lived preflight confirmation/history,
  and no memory reset execution route, app-server traffic, memory deletion,
  memory files, memory content, memory paths, secrets, or raw payloads
- done: opt-in `/api/plugin-content-read` behind
  `CODEX_APP_PORT_ALLOW_PLUGIN_CONTENT_READ=1` for `plugin/skill/read` and
  `CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_LIST=1` for `plugin/share/list`, with
  preflight-only validation by default, route-specific nested response schemas,
  matching one-time token consumption, strict safe remote plugin/marketplace/skill
  input for skill reads, no browser-provided app-server parameters for
  share-list reads, and responses plus action audit records reduced to content
  character/line counts or share item counts without skill text, share URLs,
  principals, plugin or marketplace names, ids, paths, descriptions, hook keys,
  MCP server names, tokens, or raw payloads
- done: opt-in `/api/skills-config-write` behind
  `CODEX_APP_PORT_ALLOW_SKILLS_CONFIG_WRITE=1` and a matching one-time
  preflight token, with preflight-only validation by default, safe skill-name
  selector only, `{"enabled":boolean}` as the only accepted argument object,
  path/unknown-key rejection before app-server traffic, and responses plus
  action audit records reduced to target/argument counts and the effective
  enabled boolean without skill names, paths, argument text, tokens, or raw
  payloads
- done: opt-in `/api/skills-extra-roots-clear` behind
  `CODEX_APP_PORT_ALLOW_SKILLS_EXTRA_ROOTS_CLEAR=1` and a matching one-time
  preflight token, with preflight-only validation by default, no browser
  roots/paths/arguments accepted, `{"extraRoots":[]}` as the fixed
  `skills/extraRoots/set` payload, and responses plus action audit records
  reduced to status/count/shape metadata without extra roots, paths,
  notifications, tokens, or raw payloads
- done: opt-in `/api/remote-control-disable` behind
  `CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_DISABLE=1` and a matching one-time
  preflight token, with preflight-only validation by default, no browser
  remote-control params accepted, `null` as the fixed `remoteControl/disable`
  payload, and responses plus action audit records reduced to
  status/count/shape metadata without raw status payloads, server names, installation
  ids, environment ids, notifications, tokens, or raw payloads
- done: local-only `/api/remote-control-enable-preflight` for audited
  `remoteControl/enable` intent, with route-specific nested response schemas,
  argument/key counts, optional `ephemeral` presence, unknown-param and
  URL/path/secret counters, short-lived confirmation/history, and no enable
  execution route, relay enrollment, pairing-code creation, app-server traffic,
  identity/status output, paths, URLs, secrets, argument echo, or raw payloads
- done: local-only `/api/remote-control-pairing-preflight` for audited
  `remoteControl/pairing/start` and `remoteControl/pairing/status` intent, with
  route-specific nested response schemas, argument/key counts, `manualCode`,
  pairing-code input, unknown-param and URL/path/secret counters, short-lived
  confirmation/history, and no pairing execution route, pairing-code creation,
  claim polling, app-server traffic, pairing-code output, controller info,
  identity/status output, paths, URLs, secrets, argument echo, or raw payloads
- done: opt-in `/api/remote-control-clients` plus
  `/api/remote-control-client-revoke` behind separate
  `CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_LIST=1` and
  `CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_REVOKE=1` gates, with
  server-side environment resolution, process-local opaque client refs,
  one-time revoke preflight tokens, sanitized persistent action audit, and no
  browser-supplied or returned client ids, environment ids, device names,
  device metadata values, cursors, notifications, tokens, or raw payloads
- done: opt-in `/api/config-value-write` behind
  `CODEX_APP_PORT_ALLOW_CONFIG_VALUE_WRITE=1`, an exact
  `CODEX_APP_PORT_CONFIG_VALUE_WRITE_ALLOWLIST` key match, and a matching
  one-time preflight token, with preflight-only validation by default, safe
  dotted key paths, JSON-text values parsed server-side, `replace`/`upsert`
  merge strategies only, `filePath`/`expectedVersion` forced to `null`, and
  responses plus action audit records reduced to count/shape metadata without
  key paths, values, config paths, tokens, or raw payloads
- done: opt-in `/api/config-batch-write` behind
  `CODEX_APP_PORT_ALLOW_CONFIG_BATCH_WRITE=1`, exact
  `CODEX_APP_PORT_CONFIG_BATCH_WRITE_ALLOWLIST` key matches for every edit, and
  a matching one-time preflight token, with preflight-only validation by
  default, a JSON-text array capped at 10 edits, safe dotted key paths, JSON
  values parsed server-side, `replace`/`upsert` merge strategies only,
  `filePath`/`expectedVersion` forced to `null`, reload disabled, and responses
  plus action audit records reduced to edit/key/value counts without key paths,
  values, config paths, tokens, or raw payloads
- done: opt-in `/api/experimental-feature-set` behind
  `CODEX_APP_PORT_ALLOW_EXPERIMENTAL_FEATURE_SET=1`, an exact
  `CODEX_APP_PORT_EXPERIMENTAL_FEATURE_ALLOWLIST` feature match, and a
  matching one-time preflight token, with preflight-only validation by default,
  safe feature identifiers, boolean enablement values, and responses plus
  action audit records reduced to feature/enabled and updated/enabled/disabled
  counts without feature names, enablement values, config paths, tokens, or raw
  payloads
- done: blocked integration mutation preflight plus dedicated plugin-install
  preflight for audited settings/auth/MCP/skills/plugins mutation methods, with
  target/argument counts only, no target or argument echo, no tool invocation,
  no installs, no auth callbacks, no settings writes, no sharing or marketplace
  mutation, and no app-server traffic
- done: capped process-local settings/MCP/integration preflight history exposed
  through `/api/settings-integrations` and the UI with action type, audited
  method/category, target/name/resource/argument counts, and redaction flags
  only, without preflight tokens, names, resource URIs, resource content,
  targets, argument text, schemas, URLs, paths, raw payloads, tool/resource
  invocation, or mutation execution
- done: capped process-local settings/MCP/integration preflight-confirmation
  history exposed through `/api/settings-integrations` and the UI with blocked
  action type, audited method/category, target/name/argument counts, token
  consumed status, one-time-use status, and redaction flags only, without
  preflight tokens, names, targets, argument text, schemas, URLs, paths, raw
  payloads, intent hashes, tool invocation, or mutation execution
- done: sanitized integration lifecycle UI state/activity/latest-action summary
  for settings/auth/MCP/skills/plugins derived from those sanitized histories and
  scope metadata only, without tokens, names, targets, argument text, paths,
  URLs, raw intents, or raw payloads
- done: read-only `/api/terminal-actions` boundary with a schema-backed audit of
  command, process, shell, terminal-control, turn-control, and filesystem-write
  methods; process/shell method calls, session listing, process spawn, and
  shell execution remain disabled, while the status reflects opt-in
  allowlisted `command/exec`, command/exec terminal control, local file
  actions, background terminal cleanup, and managed accept-once approval
  forwarding when those existing gates are enabled
- done: terminal-control preflight covers matching audited
  `command/exec/*` and `process/*` session-control methods with selector/input
  counts or resize dimensions only, no session ids, no input echo, no terminal
  mutation, no app-server traffic, and route-specific nested response schemas
- done: opt-in `/api/terminal-control` behind
  `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1`,
  an action-family gate, and a matching one-time preflight token; it can call
  only `command/exec/write`, `command/exec/resize`, or
  `command/exec/terminate` when `CODEX_APP_PORT_ALLOW_TERMINAL_CONTROL=1` is
  set, and only `process/writeStdin`, `process/resizePty`, or `process/kill`
  when `CODEX_APP_PORT_ALLOW_PROCESS_TERMINAL_CONTROL=1` is set, through the
  persistent session manager, with route-specific nested response schemas
- done: browser-facing `/api/terminal-actions` action scope summary exposes
  only enabled gated action labels and high-risk blocked method names/counts,
  without command text, argv, terminal output, session ids, paths, or raw
  payloads
- done: sanitized terminal lifecycle snapshots for notifications received
  through opt-in turns, persistent sessions, and read-only streams; snapshots
  expose only methods, suffixes, stream labels, counts, exit codes, and
  redaction flags, never raw output, stdin, commands, cwd, process handles, or
  terminal session ids
- done: terminal command preflight that accepts a draft command only for local
  count metadata and optional allowlist eligibility, does not echo command text
  or argv, create sessions, execute commands, or touch app-server, and issues a
  short-lived local token bound to a non-returned intent hash under a
  route-specific nested response schema
- done: opt-in `/api/terminal-command` behind
  `CODEX_APP_PORT_ALLOW_TERMINAL_COMMAND=1`, an executable allowlist, and a
  matching one-time preflight token; it calls only `command/exec` with a
  shell-free argv vector, read-only sandbox policy, network disabled, no stdin,
  no PTY, no streamed output, output capped, sanitized responses, and sanitized
  action audit records without command text, argv, cwd, environment, process ids,
  stdout, stderr, or preflight tokens; route-specific nested response schemas
  constrain command/result/sandbox/probe metadata
- done: separate process-spawn preflight/execution gates behind
  `CODEX_APP_PORT_ALLOW_PROCESS_SPAWN=1`, an executable allowlist, and a
  matching one-time preflight token, using shell-free argv, no browser-provided
  environment, no stdin/PTY/streamed output, zero requested output bytes,
  route-specific nested response schemas, and no top-level command response key
- done: exact-allowlisted thread shell command preflight/execution behind
  `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1`,
  `CODEX_APP_PORT_ALLOW_THREAD_SHELL_COMMAND=1`, a JSON exact-command
  allowlist, loaded-thread ownership checks through the persistent session
  manager, matching one-time preflight consumption, route-specific nested
  response schemas, and no top-level command response key
- done: process-local terminal command history exposed through
  `/api/terminal-actions` as sanitized status/count metadata only, without
  command text, executable names, argv, cwd, environment, process ids, stdout,
  stderr, or preflight tokens
- done: terminal control preflight that accepts draft write, resize, or
  terminate intent plus a matching audited `command/exec/*` or `process/*`
  session-control method only for count/dimension metadata and does not echo
  input, return session ids, touch terminal sessions, or touch app-server
- done: opt-in command/exec terminal control execution with sanitized
  responses and action audit records; process controls remain preflight-only
- done: process-local terminal control preflight and confirmation histories
  exposed through `/api/terminal-actions` as sanitized action/method,
  selector/input count, resize dimension, token-issued/token-consumed, and
  redaction metadata only, without preflight tokens, session selectors, session
  ids, input text, raw intent, intent hashes, output, or terminal control
  execution
- done: opt-in background terminal cleanup behind
  `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` and
  `CODEX_APP_PORT_ALLOW_TERMINAL_CLEAN=1`, with matching one-time preflight
  consumption, route-specific nested response schemas, loaded-thread suffix
  targeting, and sanitized suffix/count/status responses that omit terminal
  output, terminal session ids, full thread ids, transcript content, paths, and
  command text, plus sanitized persistent action audit records that omit
  terminal output and session identifiers when configured
- done: process-local file action history exposed through
  `/api/terminal-actions` as sanitized action/method, target/source depth,
  content count, filesystem result, token-consumed, and audit metadata only,
  without preflight tokens, full paths, basenames, file contents, raw intent,
  intent hashes, or app-server payloads
- done: disabled-by-default `/api/fs-directory` behind
  `CODEX_APP_PORT_ALLOW_FS_DIRECTORY=1` that accepts only workspace-relative
  non-hidden directory selectors, rejects symlinked path segments before
  app-server traffic, calls only `fs/getMetadata` and `fs/readDirectory` with a
  server-resolved absolute path, and returns bounded direct child names plus
  type/count metadata without absolute paths, relative paths, timestamps, file
  contents, hidden entries, token-like names, URLs, or raw payloads
- done: local-only `/api/fs-read-file-preflight` for official `fs/readFile`
  path-shape validation, with no execution route, no filesystem reads, no
  app-server traffic, no path or basename disclosure, and no file contents,
  `dataBase64`, or raw payloads returned
- done: local-only `/api/fs-watch-preflight` for official `fs/watch` and
  `fs/unwatch` shape validation, with no execution route, no watcher
  creation/removal, no `fs/changed` subscription, no app-server traffic, no path
  or canonical-path disclosure, no watch ids or handles returned, and no
  notification/raw payload output
- done: local-only `/api/fuzzy-file-search-preflight` for official
  `fuzzyFileSearch/sessionStart`, `fuzzyFileSearch/sessionUpdate`, and
  `fuzzyFileSearch/sessionStop` shape validation, with no execution route, no
  search session lifecycle mutation, no app-server traffic, no roots/query/
  session-id/result disclosure, and no file names, paths, scores, match
  indices, notifications, or raw payload output
- done: fail-closed action-preflight confirmation route that consumes local
  tokens once against the same hashed intent and still blocks all mutations
- done: strict browser JSON POST body validation for preflight, confirmation,
  turn-start, and approval-decision routes before probes, token consumption,
  audit-log writes, app-server traffic, or filesystem access
- done: centralized immutable browser POST body contract registry for audited
  write/preflight routes, with runtime mismatch checks between route handlers
  and declared allowed fields
- done: shared browser POST field policies for audited write/preflight routes,
  covering accepted JSON types, generic size caps, NUL rejection, and
  raw-value-return metadata before route-specific validation or side effects
- done: centralized browser POST response contracts for audited write/preflight
  routes, fail-closing responses that would return unsafe preflight tokens,
  token fields, secret patterns, NUL text, absolute-path-like strings outside
  the explicit preflight token issue path, or unexpected top-level keys
- done: route-specific top-level response-key allowlists for audited browser
  POST routes, so keys used by one mutation family are rejected on unrelated
  preflight or write routes before the response reaches the browser
- done: nested sensitive return-flag checks for audited browser POST responses,
  fail-closing if redaction flags such as `pathsReturned`, `rawPayloadReturned`,
  `tokensReturned`, `textReturned`, `stdoutReturned`, or `threadContentReturned`
  become truthy outside the explicitly protected auth/device-code return fields
- done: shared forbidden nested response-key checks for audited browser POST
  responses, fail-closing if raw-data, path, token-secret, process-handle,
  terminal-output, resource-URI, sharing-principal, or structured-tool-content
  keys such as `rawPayload`, `rawText`, `rawCommandText`, `cwd`, `path`,
  `accessToken`, or `structuredContent` appear in browser-bound nested objects
- done: route-specific nested response-key schemas for high-risk turn-start,
  approval-decision, MCP tool-call preflight/execution, MCP resource-read
  execution, MCP OAuth-login preflight/execution, MCP server-reload
  preflight/execution, plugin-install preflight, plugin-share-checkout
  preflight, plugin-share-action preflight, marketplace-action preflight, plugin-uninstall
  preflight/execution, plugin-enablement preflight/execution, skills-config preflight/execution, config-value preflight/execution, config-batch
  preflight/execution, experimental-feature preflight/execution,
  Git branch/commit/worktree preflight/execution, file-action
  preflight/execution, action-preflight confirmation, and generic integration
  mutation preflight routes,
  fail-closing unexpected keys inside
  sanitized turn/probe/event, decision, queue, history, target, argument/risk,
  Git status/safety/subprocess, file metadata/content/filesystem summaries,
  result, method-specific risk summary, `policy`, and `preflight` objects before
  turn/approval/MCP/auth/settings/plugin/Git/file-action responses reach the browser
- done: method-specific high-risk summaries for generic integration mutation
  preflights, classifying auth callbacks/mutations, MCP OAuth/tool calls,
  settings writes/mutations, plugin installs, plugin sharing, marketplace
  mutations, and external config imports with counts only and no target,
  argument, URL, path, token, principal, setting key/value, or raw payload echo
- done: Settings & Integrations UI selector lists every audited blocked
  integration mutation method so generic preflight coverage is visible without
  enabling app-server traffic
- done: Settings & Integrations lifecycle includes a sanitized workflow
  contract for client-side grouping, preflight/executable visibility, history
  visibility, one-token-per-action requirements, allowlist requirements, and
  explicit generic mutation/auth/install/import/plugin share/hook-command
  blocks without tokens, targets, arguments, resource content, skill content,
  names, URLs, paths, secrets, raw payloads, or app-server payloads
- done: opt-in `/api/git-branch-switch` route behind
  `CODEX_APP_PORT_ALLOW_GIT_BRANCH_SWITCH=1`, matching one-time branch preflight
  token consumption, clean-worktree checks, zero hook/filter/attributes/config
  execution-risk counts, sanitized response metadata, and no app-server traffic
- done: opt-in `/api/git-branch-create` route behind
  `CODEX_APP_PORT_ALLOW_GIT_BRANCH_CREATE=1`, matching one-time branch-create
  preflight token consumption, validated non-existing branch names, direct loose
  local ref writes from current HEAD, sanitized response metadata, no Git
  subprocess, and no app-server traffic
- done: opt-in `/api/git-branch-delete` route behind
  `CODEX_APP_PORT_ALLOW_GIT_BRANCH_DELETE=1`, matching one-time branch-delete
  preflight token consumption, inventoried non-current branch validation,
  linked-worktree checkout rejection, direct loose local ref deletion, sanitized
  response metadata, no Git subprocess, and no app-server traffic
- done: blocked `/api/git-commit-preflight` route for commit-message and
  worktree-status count validation, with no message echo, no staged-content
  inspection, no Git subprocess, no object/ref writes, and no app-server traffic
- done: opt-in `/api/git-commit` route behind
  `CODEX_APP_PORT_ALLOW_GIT_COMMIT=1`, matching one-time commit preflight token
  consumption, current-local-branch and clean-worktree requirements,
  staged-change verification, hooks/GPG/editor disabled, sanitized response
  metadata, and no message/stdin/stdout/stderr/argv/path disclosure
- done: blocked `/api/git-worktree-preflight` route for worktree create/remove
  intent validation, with inventoried branch checks for create, basename/depth
  only target metadata, no full path echo, no Git subprocess, no checkout, no
  filesystem writes, and no app-server traffic
- done: opt-in `/api/git-worktree-action` route behind
  `CODEX_APP_PORT_ALLOW_GIT_WORKTREE=1`, matching one-time worktree preflight
  token consumption, workspace-relative path policy, symlink target/parent
  rejection, zero hook/filter/attribute risk for create, no forced removal,
  sanitized response metadata, and no path/stdout/stderr/argv disclosure
- done: route-specific nested response-key schemas for all Git branch,
  commit, and worktree POST routes, fail-closing unexpected keys inside
  workspace, app-server, action, target, source, branch, status, safety,
  subprocess, policy, result/message, and preflight scope summaries
- done: blocked file action preflight for write/remove/copy/create-directory
  intent with workspace-relative path validation, basename/count-only metadata,
  no file contents returned, no filesystem writes, no app-server traffic, and a
  local token for filesystem-action gating
- done: opt-in `/api/file-action` route behind
  `CODEX_APP_PORT_ALLOW_FILE_ACTION=1`, matching one-time file-action preflight
  token consumption, workspace-relative path policy, hidden/`.git`/lock/traversal
  rejection, symlink parent/target rejection, sanitized response metadata, and
  no path/content/stdout/stderr/argv disclosure, plus sanitized persistent
  action audit records that omit paths, basenames, and contents when configured
- done: route-specific nested response-key schemas for file-action preflight,
  file-action execution, and action-preflight confirmation, fail-closing
  unexpected keys inside workspace, app-server, action, source/target, content,
  filesystem, policy, result, and preflight scope summaries
- done: sanitized active-session lifecycle summary and UI state for
  blocked/idle/active/history-only loaded sessions, loaded/control counts, and
  explicit interrupt/unsubscribe/steer gate status without raw session ids,
  prompts, paths, or preflight tokens
- done: active-session operations summary in `/api/live-sessions` and the UI for
  inventory/control/bulk/routing state derived from sanitized lifecycle gates,
  without raw session ids, prompts, paths, preflight tokens, thread content, or
  raw payloads
- done: active-session management summary in `/api/live-sessions` and the UI
  for inspectable/actionable/history-only state, suffix-only selection
  requirements, preflight requirements, model-traffic management gates, bulk
  target scope, and latest sanitized action metadata without full ids, prompts,
  paths, preflight tokens, thread content, or raw payloads
- done: active-session readiness summary in `/api/live-sessions` and the UI
  derived only from active-session operations and management summaries, covering
  blocked/inspectable/actionable/history readiness, enabled operation counts,
  suffix-only targets, dedicated routes, one-time preflight requirements, and
  redaction flags without full ids, prompts, paths, tokens, thread content, or
  raw payloads
- done: active-session routing contract in `/api/live-sessions` and the UI
  derived only from active-session operations, management, and readiness
  summaries, covering loaded-session inventory routing, dedicated
  single-session and bulk control routes, model-traffic steer routing,
  session-manager requirements, suffix-only targets, one-time preflight
  requirements, and redaction flags without full ids, prompts, paths, tokens,
  thread content, raw control payloads, or app-server payloads
- done: active-session workflow contract in `/api/live-sessions` and the UI
  derived only from active-session operations, management, readiness, and
  routing summaries, covering client-side grouping for inventory,
  single-session controls, bulk controls, and history, visible row controls,
  route state, suffix-only targets, one-time preflight requirements, and
  redaction flags without full ids, prompts, paths, tokens, thread content, raw
  control payloads, or app-server payloads
- done: richer sanitized turn-session lifecycle detail and UI counters for
  pending/decided approval sessions, event sessions, model-traffic sessions,
  session-wide approval status, request-scoped approval policy, rejected scope
  count, latest suffix/status/event metadata, and explicit gate flags without
  prompts, full ids, paths, tokens, raw approvals, or raw events
- done: sanitized persistent-session-manager lifecycle state in
  `/api/turn-sessions` and the UI with managed-client state, client-started
  status, active thread/turn suffixes, notification counts, and
  pending/resolved approval counts only, without prompts, full ids, cwd, paths,
  decision tokens, raw approval details, or raw events
- done: sanitized turn-session operations counters in `/api/turn-sessions` and
  the UI for enabled operation count, turn-start route, preflight/model-traffic
  gates, and manager counts without prompts, ids, paths, tokens, raw approval
  details, raw events, or app-server payloads
- done: sanitized turn-session management summary in `/api/turn-sessions` and
  the UI for blocked/local/managed/thread-lifecycle/history-only state, enabled
  operations, turn-start route, manager counts, request-scoped approval gates,
  suffix-only target selection, and redaction flags without prompts, ids,
  paths, preflight tokens, decision tokens, raw approval details, raw events, or
  app-server payloads
- done: sanitized turn-session readiness summary in `/api/turn-sessions` and
  the UI for blocked/local-ready/managed-ready/pending-approval/history state,
  turn-start route, model-traffic gate, request-scoped approval state, manager
  counts, and explicit session-wide/exec/network/root-grant blocks without
  prompts, ids, paths, preflight tokens, decision tokens, raw approval details,
  raw events, or app-server payloads
- done: sanitized turn-session routing contract in `/api/turn-sessions` and the
  UI for local-probe versus session-manager routing, preflight and
  decision-token requirements, request-scoped approval gates, manager counters,
  and explicit session-wide/exec/network/root-grant blocks without prompts,
  ids, paths, tokens, raw approval details, raw events, or app-server payloads
- done: sanitized turn-session workflow contract in `/api/turn-sessions` and
  the UI for client-side grouping, local versus managed turn start,
  pending-approval state, one-preflight-token-per-turn-action requirements,
  request-scoped approval workflow visibility, suffix-only targets, and
  privileged-scope blocks without prompts, ids, paths, tokens, raw approval
  details, raw events, or app-server payloads
- done: sanitized turn-session safety contract in `/api/turn-sessions` and the
  UI for preflight-token requirements, model-traffic gate state,
  request-scoped approval-token requirements, dedicated approval routing,
  suffix-only targets, and rejected privileged scopes without preflight tokens,
  prompts, ids, paths, decision tokens, raw approval details, raw events, or
  app-server payloads
- done: sanitized turn-session audit contract in `/api/turn-sessions` and the
  UI for bounded process-local session ledger state, persistent approval-audit
  availability, session/request/event history limits, sanitized live-event text
  policy, preflight requirements, request-scoped approval scope, and rejected
  privileged scopes without preflight tokens, prompts, ids, paths, decision
  tokens, request keys, raw approval details, raw events, or app-server
  payloads
- done: sanitized active-session safety contract in `/api/live-sessions` and
  the UI for gated-control safety state, required preflight tokens, dedicated
  live-session control routes, separate model-traffic opt-in, session-manager
  bulk-control requirement, suffix-only targets, and no session-wide controls
  without prompts, ids, paths, preflight tokens, thread content, raw control
  payloads, or app-server payloads
- done: sanitized active-session audit contract in `/api/live-sessions` and
  the UI for bounded process-local control history, persistent action-audit
  availability, sanitized action-audit guarantees, dedicated route
  requirements, separate model-traffic opt-in, session-manager bulk-control
  requirement, suffix-only targets, and no session-wide controls without
  prompts, ids, paths, preflight tokens, thread content, raw control payloads,
  or app-server payloads
- done: sanitized active-session interaction contract in `/api/live-sessions`
  and the UI for row draft/preflight controls, bulk preflight/execution
  visibility, client-side grouping, refresh-after-control behavior, route state,
  suffix-only targets, one-time preflight requirements, action-audit
  requirements, and no session-wide controls without prompts, ids, paths,
  preflight tokens, thread content, raw control payloads, or app-server payloads
- done: sanitized approval decision contract summary in
  `/api/approval-decisions` and the UI for decision-intake mode, accepted
  decision-kind count, request-scoped token/replay/audit gates, local/forwarded
  deny and accept-once availability, batch support, and privileged-scope blocks
  without decision tokens, request keys, raw approval details, preview text,
  command text, file-change patches, file contents, ids, paths, prompts, or
  app-server payloads
- done: request-scoped real `turn/start` parity behind explicit execution and
  approval gates, with session-wide approval, permission grant, execpolicy,
  network, and persistent-root-grant escalation deliberately blocked
- pending: broader active-session workflows beyond sanitized operation/
  management, readiness, routing, workflow, safety, audit, and interaction
  summaries, gate flags, execution-readiness state, managed-client state,
  loaded-session suffixes, latest suffix/status/event metadata, and
  recent-control metadata
- done: every audited browser POST response contract now has route-specific
  nested object-shape validation; new POST routes must add nested schemas before
  passing the verifier

M2: Omarchy desktop shell.

- project selector beyond the first allowlisted prototype
- thread list
- done: first read-only Git worktree metadata panel
- done: sanitized thread transcript
- turn input
- event streaming
- done: explicit request-scoped approval queue and prompts

M3: Review workflow.

- done: sanitized file-change view
- done: bounded sanitized diff rendering
- done: request-scoped approve/deny controls
- command output panel
- done: opt-in command/exec terminal resize/write/terminate support where the
  protocol permits it, with process controls still blocked
- done: blocked command preflight without command echo or execution
- done: sanitized terminal command history without command/output/token echo
- done: terminal control preflight for audited `command/exec/*` and
  `process/*` session-control methods without session/input echo or terminal
  session mutation
- done: opt-in file action execution without full paths, content echo, shell
  execution, app-server traffic, stdout/stderr, or argv disclosure

M3.5: Git/worktree workflows.

- done: read-only repository/head/remote/local-branch/linked-worktree metadata
- done: best-effort read-only working-tree status counts
- done: blocked branch-switch preflight with aggregate status counts
- done: blocked commit preflight with message/status counts and no commit
  object or ref writes
- done: blocked worktree create/remove preflight with path-safe metadata and no
  Git subprocess or filesystem writes
- branch and worktree actions behind explicit review/approval

M4: Desktop integration.

- done: user-scoped local installer for Omarchy desktop entry, with no sudo,
  network fetches, global packages, default URL handler, or symlink copying
- done: local SVG app icon wired into the user installer and Omarchy desktop
  template
- done: manual update policy with no automatic updater
- done: opt-in user-scoped URL handler for `codex-app-port://` only; it rejects
  callbacks, sensitive official deep-link params, unknown params in registered
  mode, unsupported official subpaths, and the official `codex://` scheme, while
  mapping only audited local thread, new-thread, settings, skills, and
  automations destinations to loopback UI fragments
- done: packaged Omarchy `.desktop` template pointing at the safe launcher and
  local icon, with no default URL handler registration
- done: local desktop launcher wires persistent sanitized approval/action audit
  logs under `XDG_STATE_HOME` by default, with explicit override paths
- done: config/state location policy for local integration: runtime files under
  `~/.local/share/codex-app-port`, desktop entries under
  `~/.local/share/applications`, and audit state under `XDG_STATE_HOME`
- done: local release tarball package format with allowlisted entries,
  reproducible tar options, package manifest, and SHA-256 sidecar
- done: Arch/Omarchy PKGBUILD generator that wraps the local tarball with a
  pinned SHA-256 digest and no network source, install hooks, `sudo`,
  `systemctl`, package-manager installs, updater, or URL handler registration

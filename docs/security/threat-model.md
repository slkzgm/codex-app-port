# Threat Model

## Assets

- OpenAI and ChatGPT auth tokens.
- OpenAI API keys.
- `~/.codex` state, sessions, memories, config, and managed binaries.
- Source repositories opened in the app.
- SSH keys and Git credentials.
- Browser/session cookies reachable through local integrations.
- Local shell access and file-system write permissions.
- URL scheme handlers such as `codex://`.

## Main Adversaries

- Malicious third-party installer maintainers.
- Compromised GitHub repositories or raw-file URLs.
- Compromised npm packages or lifecycle scripts.
- Tampered binary downloads.
- Malicious repository content trying to prompt-inject or trigger unsafe tool
  use.
- Local web content trying to reach an unauthenticated app-server listener.

## Hard Rules

- Do not execute remote shell scripts directly from the network.
- Do not run third-party installers before audit.
- Do not install `@latest` packages in production flows.
- Do not use global installs for app runtime dependencies.
- Arch/Omarchy package recipes must consume only local source archives with
  pinned SHA-256 digests. They must not use `SKIP`, network sources,
  downloader commands, install or post-install hooks, `sudo`, `systemctl`,
  `xdg-mime`, package-manager install commands, automatic updaters, or URL
  handler registration.
- Do not enable auto-update loops that fetch and execute remote code without
  explicit provenance.
- Do not expose unauthenticated app-server listeners on non-loopback
  interfaces.
- Do not expose loopback API actions without a local session token or an
  equivalent same-origin guard.
- Browser-facing JSON `POST` routes must have a centralized audited body
  contract before side effects. Unsupported fields must be rejected before
  probes, app-server calls, filesystem access, token consumption, or audit-log
  writes, and rejection responses must not echo field names or values. Declared
  fields must also carry shared type/size/sensitivity policies, reject NUL text,
  and mark that raw browser-supplied values are not returned.
- Browser-facing JSON `POST` responses must pass centralized response-contract
  checks before they are written. Unsafe preflight-token strings, token fields,
  secret patterns, NUL text, absolute-path-like values, and unexpected top-level
  keys must fail closed to a generic error unless the value is the explicitly
  issued preflight token on a preflight response. Top-level response keys must
  also be allowlisted per route, so an unrelated route cannot smuggle another
  mutation family's sanitized object through a broader shared response shape.
  Sensitive nested redaction flags, including path/raw-payload/token/text/output
  return markers, must also fail closed if they become truthy, except for the
  explicitly protected auth/device-code fields that are intentionally returned
  to the local UI.
- Browser-facing JSON `POST` responses must also reject forbidden nested raw
  object keys, including raw payload/text, cwd/path, access-token,
  process-handle, terminal-output, resource-URI, sharing-principal, and
  structured-tool-content key names. Sanitized summaries may expose only
  count/suffix/redaction-flag metadata through route-specific schemas.
- High-risk browser-facing preflight and decision routes should add per-path
  nested object key schemas before any matching mutation route is broadened.
  The turn-start and approval-decision routes plus MCP tool-call
  preflight/execution, MCP resource-read execution, MCP OAuth-login
  preflight/execution, MCP server-reload preflight/execution, skills-config
  preflight/execution, config-value preflight/execution, config-batch
  preflight/execution, experimental-feature preflight/execution, and generic
  integration mutation preflights already
  enforce these schemas for their sanitized turn/probe/event, decision, queue,
  history, target, argument/risk summary, result, auth, policy, and preflight
  objects.
- Do not expose unbounded local streams; streaming endpoints need a duration or
  resource cap and must project events through a sanitizer.
- Browser-facing live output may expose only bounded, path-redacted,
  secret-pattern-redacted assistant/agent message deltas. Reasoning, command,
  process, file-change, prompt, and user transcript streams must stay excluded
  unless separately audited. Thread-filtered live streams must validate the
  thread selector as an id suffix and drop unrelated notifications server-side.
- Do not send user-authored prompts to `codex app-server` until an explicit
  execution gate, approval policy, and prompt non-echo checks are in place.
- Any browser-facing `turn/start` route must fail closed until the execution
  gate and approval pipeline are implemented and verified.
- Any opt-in browser-facing `turn/start` route must consume a matching
  short-lived, one-time turn-preflight token before app-server traffic. Missing,
  replayed, stale, wrong-workspace, wrong-action, or intent-mismatched tokens
  must fail before prompt forwarding.
- Browser-facing turn-session ledgers may expose only bounded, prompt-free,
  path-free, suffix-only metadata, sanitized live event snapshots, and sanitized
  approval summaries. Turn-session lifecycle summaries may expose only counts,
  latest sanitized suffix/status/event metadata, prompt counts, explicit gate
  booleans, and request-scoped approval policy summaries derived from those
  sanitized counts/gates. Those policy summaries may show local-deny,
  forwarded-deny, accept-once, rejected session-wide/execpolicy/network/root
  grant state, and redaction flags only. Persistent-session-manager lifecycle
  state may expose only
  client-started/starting booleans, safe state labels, active thread/turn
  suffixes, notification counts, pending/resolved approval counts, and
  redaction flags. These surfaces must not expose prompts, full ids, cwd, paths,
  decision tokens, raw approval details, raw events, or app-server payloads.
- Browser-facing turn-session operation summaries may expose only aggregate
  enabled thread/turn operation counts, preflight and model-traffic gate state,
  local/session-manager routing state, manager approval/notification counts,
  request-scoped approval state, and redaction flags derived from sanitized
  lifecycle counts and gate booleans. They must not expose preflight tokens,
  prompts, full ids, paths, decision tokens, raw approval details, raw events,
  or app-server payloads, and they must not enable session-wide approvals.
- Browser-facing turn-session management summaries may expose only
  blocked/local/managed/thread-lifecycle/history-only state, enabled operation
  counts, turn-start route, manager counts, request-scoped approval gate flags,
  suffix-only target selection, preflight requirements, and redaction flags
  derived from sanitized turn-session lifecycle and operation summaries. They
  must not expose preflight tokens, prompts, full ids, cwd, paths, decision
  tokens, raw approval details, raw events, or app-server payloads.
- Browser-facing thread creation must be blocked by default and opt-in only.
  When `CODEX_APP_PORT_ALLOW_THREAD_START=1` is enabled, `/api/thread-start`
  must consume a matching one-time preflight token before calling only
  `thread/start` with an allowlisted workspace cwd, read-only sandbox,
  user-routed approvals, empty environments, and no model traffic. Responses and
  action audit records must not return full ids, prompt text, cwd, paths,
  instruction sources, raw app-server payloads, or preflight tokens. The
  preflight and execution responses are constrained by route-specific nested
  response schemas.
- Browser-facing thread archive/unarchive must be blocked by default and opt-in
  only. When `CODEX_APP_PORT_ALLOW_THREAD_ARCHIVE=1` is enabled,
  `/api/thread-archive-action` must consume a matching one-time preflight token
  before resolving a suffix through `thread/list` and calling only
  `thread/archive` or `thread/unarchive`. Responses and action audit records
  must not return full ids, names, previews, transcript content, cwd, paths,
  raw app-server payloads, or preflight tokens. The preflight and execution
  responses are constrained by route-specific nested response schemas.
- Browser-facing thread deletion must be blocked by default and opt-in only.
  When `CODEX_APP_PORT_ALLOW_THREAD_DELETE=1` is enabled,
  `/api/thread-delete-action` must consume a matching one-time preflight token
  before resolving a suffix through `thread/list` and calling only
  `thread/delete`. Responses and action audit records must not return full ids,
  names, previews, transcript content, cwd, paths, raw app-server payloads,
  raw thread payloads, or preflight tokens. The preflight and execution
  responses are constrained by route-specific nested response schemas.
- Browser-facing thread compaction must be blocked by default and opt-in only.
  Because `thread/compact/start` can trigger model traffic, it also requires the
  persistent session manager gate. When `CODEX_APP_PORT_ALLOW_THREAD_COMPACT=1`
  and `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` are enabled,
  `/api/thread-compact-start` must consume a matching one-time preflight token
  before resolving a loaded-session suffix and calling only
  `thread/compact/start`. Responses and action audit records must mark model
  traffic and must not return prompt text, full ids, transcript content, cwd,
  paths, raw app-server payloads, or preflight tokens. The preflight and
  execution responses are constrained by route-specific nested response schemas.
- Browser-facing server-side thread search must be blocked by default and
  opt-in only. When `CODEX_APP_PORT_ALLOW_THREAD_SEARCH=1` is enabled,
  `/api/thread-search` may call only `thread/search` with a validated workspace,
  bounded search term, optional archived filter, and capped limit. Responses
  must expose only accepted-state, search-term length/line counts, result
  counts, cursor-presence booleans, and suffix/status/source metadata. They
  must not return the search term, snippets, thread names, previews, full ids,
  cwd, paths, cursors, thread content, raw thread payloads, or raw app-server
  payloads.
- Browser-facing thread lifecycle histories must be process-local, capped, and
  sanitized. They may expose only action type/method, thread suffix, safe
  status/count metadata, token-consumed state, model-traffic booleans, and audit
  flags; they must not expose preflight tokens, prompts, full ids, cwd, paths,
  names, previews, transcript content, raw intents, or raw app-server payloads.
- Browser-facing persistent app-server session management must be opt-in only.
  When enabled, it may reuse a per-workspace client only for audited
  turn-start, loaded-session inventory, and live-session-control routes, and it
  must preserve the same preflight-token, prompt non-echo, suffix-only, event
  redaction, and close-on-server-shutdown guarantees.
- Browser-facing loaded-session inventory must be blocked by default and
  opt-in only. When enabled, it may expose only bounded counts, pagination
  state, and short thread id suffixes; full ids, prompts, paths, titles,
  transcript text, terminal output, and command output remain excluded.
- Browser-facing live-session lifecycle summaries may expose only state labels,
  counts, explicit control gate booleans, recent control action/result
  breakdowns, latest-control method/status/suffix/count metadata, and
  active-session operation summaries derived from those counts and gate flags.
  Operation summaries may show suffix-only inventory visibility, enabled control
  counts, bulk-control state, session-manager routing, model-traffic-control
  state, and one-time preflight requirements only. They must not return raw
  session identifiers, prompt text, preflight tokens, paths, transcript content,
  terminal output, command output, or raw app-server payloads.
- Browser-facing active-session management summaries may expose only
  inspectable/actionable/history-only state, loaded-session suffix counts,
  actionability counts, suffix-only selection requirements, preflight
  requirements, bulk target scope, model-traffic gate state, and latest
  sanitized control metadata derived from already sanitized control history.
  They must not expose full ids, prompt text, preflight tokens, paths,
  transcript content, terminal output, command output, or raw app-server
  payloads.
- Browser-facing live-session control must be blocked by default and opt-in
  only. `turn/interrupt` and `thread/unsubscribe` require
  `CODEX_APP_PORT_ALLOW_LIVE_SESSION_CONTROL=1`; `turn/steer` requires the
  separate `CODEX_APP_PORT_ALLOW_TURN_STEER=1` model-traffic opt-in because it
  forwards bounded user-authored text. All actions must consume a matching
  one-time preflight token. Responses must not return full ids, prompt text,
  transcript content, paths, terminal output, command output, or raw app-server
  payloads; steer responses may expose only prompt counts and sanitized
  suffix/status metadata.
- Browser-facing live-session bulk control must be a separate blocked-by-default
  opt-in. It may run only when `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` and
  `CODEX_APP_PORT_ALLOW_LIVE_SESSION_BULK_CONTROL=1` are both set, may call only
  `thread/unsubscribe` for loaded sessions through the persistent session
  manager, and must consume a matching one-time preflight token. Responses and
  audit/history records may expose only aggregate counts, method names, and
  explicit redaction flags; they must not return full ids, suffix arrays,
  prompt text, transcript content, paths, terminal output, command output, or
  raw app-server payloads.
- Browser-originated local action mutations must have sanitized persistent
  audit support when launched through the desktop/dev-server entry point. This
  currently covers thread creation, thread archive/unarchive actions, thread
  deletion, thread compaction starts, individual and bulk live-session control,
  allowlisted terminal command execution, allowlisted process-spawn execution,
  background terminal cleanup, local file actions, and plugin uninstalls. The
  action audit log must be checked for append safety before app-server or local
  filesystem mutation, must not follow symlink log files, and may contain only
  metadata: workspace label/id, action, method, suffixes, prompt/content counts,
  command argument counts, stdout/stderr counts, result status, app-server
  method names, filesystem operation booleans, and token-consumption flags. It
  must not log prompt text, command text, argv, stdout/stderr text, file
  contents, preflight tokens, full ids, cwd, paths, instruction sources, file
  basenames, terminal output, terminal session identifiers, thread content, raw
  request bodies, or app-server payloads.
- Browser-facing approval-decision routes may record local deny-only decisions
  and may forward pending managed decisions only when
  `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` and
  `CODEX_APP_PORT_ALLOW_APPROVAL_FORWARDING=1` are both set. Accept decisions
  may be forwarded only for pending managed command/file-change approvals when
  `CODEX_APP_PORT_ALLOW_APPROVAL_DETAILS=1` and
  `CODEX_APP_PORT_ALLOW_APPROVAL_ACCEPT=1` are also set. Session-wide approve,
  execpolicy/network amendments, persistent root grants, and local historical
  approve records must remain rejected. Permissions approval requests may only
  expose and forward `decline`, and the app-server response must contain an
  empty turn-scoped permission profile with no file-system or network grants.
  Duplicate decisions for the same
  sanitized request must be rejected in the current server process, persistent
  audit logs must reject already journaled sanitized decision keys when
  available, and the process-local decision token issued with the sanitized
  pending approval summary is required. Bulk browser controls may only submit a
  bounded `decisions` batch of the per-request deny decisions, or gated
  request-scoped `accept` decisions, already exposed by the sanitized queue.
  Batch entries must reject unsupported nested fields, duplicate request
  selectors, NUL text, and missing tokens before any audit write or forwarding.
  Browser-facing approval queue summaries may expose
  only aggregate counts for pending/decided, local/managed, request kind,
  available safe decisions, token-required requests, grant-root presence, and
  redacted preview availability; permissions summaries may expose only
  permission-presence booleans, never the requested permission profile. They
  must not expose decision tokens, request keys, session identifiers, raw
  approval details, paths, patches, file contents, permission paths, or network
  grant details. Browser-side approval queue filters must operate only on the
  already sanitized queue payload, and visible-subset deny/accept actions must
  still submit the bounded tokenized decision batch through the normal approval
  route. They must not create session-wide decisions or bypass decision-token
  checks.
- Browser-facing approval queue action summaries may expose only aggregate
  pending, denyable, approvable, token-required, safe-decision, gate, and batch
  limit metadata derived from the sanitized approval queue and request-scoped
  policy. They must not expose decision tokens, request keys, session
  identifiers, raw approval details, command text, file-change patches, file
  contents, paths, prompts, app-server payloads, or any full approval selector.
- Browser-facing approval management summaries may expose only
  actionable/pending/history state, aggregate request and preview counts,
  request-scoped deny/accept/batch availability, latest-decision availability,
  and explicit rejected privileged-scope booleans derived from sanitized
  approval queue, policy, and history summaries. They must not expose decision
  tokens, request keys, session identifiers, full ids, raw approval details,
  command text, file-change patches, file contents, paths, prompts,
  app-server payloads, or any full approval selector.
- Browser-facing pending approval details may expose command previews and
  file-change approval metadata only when
  `CODEX_APP_PORT_ALLOW_APPROVAL_DETAILS=1` is set with managed approval
  forwarding. Those previews must be bounded and redacted before reaching the
  browser, must replace path-like, URL-like, email-like, and token-like
  substrings, must not return file-change patches or file contents, must not be
  returned after a decision is recorded, and must not be written to the approval
  audit log.
- Browser-facing local turn-session approval summaries may expose file-change
  grant-root basenames and redacted reasons only. They must not expose full
  grant roots, file paths, patches, file contents, prompt text, or decision
  tokens after a decision is recorded.
- Browser-facing approval decision history may expose only sanitized
  kind/method/suffix/count/decision/forwarding/audit metadata for decisions
  recorded through the current server process. It must not expose decision
  tokens, request keys, session ids, full ids, command text, file-change
  patches, file contents, full paths, prompt text, or raw approval details.
- Browser-facing approval lifecycle summaries may combine only sanitized queue
  and decision-history counts, state labels, request-scoped policy booleans, and
  latest-decision metadata. They must not expose decision tokens, request keys,
  session identifiers, full ids, raw commands, raw approval details,
  file-change patches, file contents, paths, prompts, or app-server payloads.
- Browser-facing approval policy summaries may expose only request-scoped
  decision capability metadata: local deny, forwarded deny, accept-once gate
  state, supported approval kind labels, and explicit rejected session-wide /
  execpolicy / network / persistent-root scopes. They must not expose decision
  tokens, request keys, raw approval details, prompts, commands, patches, file
  contents, paths, or app-server payloads.
- Approval audit logs may contain only sanitized metadata: workspace labels,
  local session ids, suffixes, request kind/method, counts, accepted
  accept-once/deny decisions, file-change grant-root presence, file-change
  preview counts, permissions-presence booleans, and replay outcomes. They must
  not contain prompts, command text, patch text, file contents, full paths, file
  basenames, permission profiles, decision tokens, secrets, auth state,
  app-server responses, or browser-returned log paths.
- Browser-facing settings/MCP/integration preflight history may expose only
  sanitized action type, audited method/category, and target/name/argument
  counts for preflights performed through the current server process. It must
  not expose preflight tokens, server names, tool names, targets, arguments,
  schemas, URLs, paths, raw payloads, or execute the preflighted mutation.
- Browser-facing settings/MCP/integration preflight-confirmation history may
  expose only sanitized action type, audited method/category, target/name/
  argument counts, token-consumed status, one-time-use status, and redaction
  flags for confirmations performed through the current server process. It must
  not expose preflight tokens, server names, tool names, targets, arguments,
  schemas, URLs, paths, raw payloads, intent hashes, or execute the confirmed
  mutation.
- Browser-facing settings/integration lifecycle summaries may combine only the
  already sanitized Settings/Auth/Apps/MCP/Skills/Plugins surface states,
  integration scope counts, bounded process-local history counts, enabled-gate
  booleans, and latest sanitized action method/status/source metadata. They
  must not expose preflight tokens, names, targets, argument text, resource
  content, skill content, URLs, paths, secrets, raw intents, raw payloads, or
  enable browser method calls.
- Browser-facing `skills/config/write` must be blocked by default and opt-in
  only. When `CODEX_APP_PORT_ALLOW_SKILLS_CONFIG_WRITE=1` is enabled,
  `/api/skills-config-write` must consume a matching one-time preflight token,
  select the skill by safe name only, accept only `{"enabled":boolean}`, and
  reject path selectors or unknown argument keys before app-server traffic.
  Responses and action audit records may expose only target/argument counts and
  the effective enabled boolean; they must not expose skill names, paths,
  argument text, preflight tokens, or raw app-server payloads.
- Browser-facing `config/value/write` must be blocked by default and opt-in
  only. When `CODEX_APP_PORT_ALLOW_CONFIG_VALUE_WRITE=1` is enabled,
  `/api/config-value-write` must require an exact
  `CODEX_APP_PORT_CONFIG_VALUE_WRITE_ALLOWLIST` key match, consume a matching
  one-time preflight token, parse JSON values server-side, accept only
  `replace` or `upsert`, and force `filePath` and `expectedVersion` to `null`.
  Responses and action audit records may expose only key/value counts and
  response-shape metadata; they must not expose key paths, values, config paths,
  preflight tokens, or raw app-server payloads.
- Browser-facing `config/batchWrite` must be blocked by default and opt-in
  only. When `CODEX_APP_PORT_ALLOW_CONFIG_BATCH_WRITE=1` is enabled,
  `/api/config-batch-write` must require every edit key to match
  `CODEX_APP_PORT_CONFIG_BATCH_WRITE_ALLOWLIST`, consume a matching one-time
  preflight token, parse a JSON-text array server-side, cap batches at 10
  edits, accept only `replace` or `upsert`, and force `filePath` and
  `expectedVersion` to `null` while disabling reload. Responses and action
  audit records may expose only edit/key/value counts and response-shape
  metadata; they must not expose key paths, values, config paths, preflight
  tokens, or raw app-server payloads.
- Browser-facing `experimentalFeature/enablement/set` must be blocked by
  default and opt-in only. When
  `CODEX_APP_PORT_ALLOW_EXPERIMENTAL_FEATURE_SET=1` is enabled,
  `/api/experimental-feature-set` must require an exact
  `CODEX_APP_PORT_EXPERIMENTAL_FEATURE_ALLOWLIST` feature match, consume a
  matching one-time preflight token, accept only a safe feature identifier and
  boolean enablement value, and reject unallowlisted features before app-server
  traffic. Responses and action audit records may expose only
  feature-character counts, enablement-value counts, updated/enabled/disabled
  counts, and response-shape metadata; they must not expose feature names,
  enablement values, config paths, preflight tokens, or raw app-server payloads.
- Browser-facing settings/integration scope summaries may expose only active
  read method names, local preflight/login/login-cancel/logout gate labels, and
  blocked mutation method names/counts. They must not expose secrets, auth tokens, account
  identifiers, callback state, hook commands, rate-limit details, display names
  without the name gate, paths, URLs, raw intents, or raw app-server payloads,
  and they must not enable browser method calls.
- Browser-facing settings/integration action summaries may expose only aggregate
  read-method counts, local preflight gate counts, executable opt-in action
  counts, action-family counts, blocked mutation method counts, history counts,
  and redaction flags derived from the sanitized integration scope and histories.
  They must not expose preflight tokens, names, targets, arguments, resource
  content, skill content, URLs, paths, secrets, raw payloads, or app-server
  payloads, and they must not enable browser method calls.
- Browser-facing settings/integration management summaries may expose only
  management state, surface counts, preflight/executable actionability counts,
  active-login counts, latest-action availability, and redaction flags derived
  from sanitized surfaces, scope, action summaries, and histories. They must not
  expose preflight tokens, auth tokens, names, targets, arguments, resource
  content, skill content, URLs, paths, secrets, raw payloads, or app-server
  payloads, and they must not enable browser method calls.
- Browser-facing terminal/action routes must not call terminal, process, shell,
  or filesystem-write app-server methods until live session ownership, approval
  provenance, replay protection, and method-specific execution policy are implemented
  and tested. Terminal lifecycle notifications may be stored and rendered only
  as sanitized metadata: method names, suffixes, stream labels, counts, exit
  codes, and redaction flags, with raw output, stdin, command text, cwd,
  process handles, and terminal session ids omitted. Local filesystem mutations
  may execute only through the audited file-action route below, background
  terminal cleanup may execute only through the audited terminal-clean route,
  allowlisted terminal command execution may execute only through the audited
  terminal-command route below, allowlisted process-spawn execution may execute
  only through the audited process-spawn route below,
  and live-session interrupt/unsubscribe/steer mutations may execute only
  through the audited live-session-control route with their action-specific
  opt-ins and route-specific nested response schemas. Bulk live-session
  unsubscribe uses its own preflight/execution schema behind the persistent
  session-manager opt-in.
- Browser-facing terminal/action scope summaries may expose only enabled gated
  action labels and high-risk blocked method names/counts. They must not expose
  command text, executable names, argv, terminal output, session selectors or
  identifiers, paths, raw intents, or raw app-server payloads, and they must not
  enable browser method calls.
- Browser-facing terminal command preflight may accept draft command text only
  for local validation, aggregate counts, and allowlist eligibility. It must not
  echo command text, executable names, argv, create sessions, write stdin,
  mutate files, or touch app-server.
- Browser-facing terminal command execution must remain disabled unless
  `CODEX_APP_PORT_ALLOW_TERMINAL_COMMAND=1`, a configured
  `CODEX_APP_PORT_TERMINAL_COMMAND_ALLOWLIST`, and a matching one-time
  preflight token are all present. It may call only `command/exec` with a
  shell-free argv vector, selected workspace cwd, read-only sandbox policy,
  network disabled, no stdin, no PTY, no streamed output, and output capped.
  Responses and audit records must not return command text, executable names,
  argv, cwd, environment values, process ids, stdout, stderr, or preflight
  tokens. `thread/shellCommand` and terminal control outside their dedicated
  routes remain blocked. The terminal-command, process-spawn,
  thread-shell-command, terminal-control, and terminal-background-clean routes
  use route-specific nested response schemas so command/process/thread/output
  metadata cannot be added accidentally.
- Browser-facing terminal command history may report only recent sanitized
  status/count metadata for commands that already passed the audited
  terminal-command route. It must not return command text, executable names,
  argv, cwd, environment values, process ids, stdout, stderr, or preflight
  tokens.
- Browser-facing process-spawn preflight may accept draft command text only for
  local shell-free argv validation, aggregate counts, and exact executable
  allowlist eligibility. It must not echo command text, executable names, argv,
  process handles, create sessions, write stdin, accept browser environment
  values, touch app-server, or allow a top-level command response key.
- Browser-facing process-spawn execution must remain disabled unless
  `CODEX_APP_PORT_ALLOW_PROCESS_SPAWN=1`, a configured
  `CODEX_APP_PORT_PROCESS_SPAWN_ALLOWLIST`, and a matching one-time preflight
  token are all present. It may call only `process/spawn` with a shell-free argv
  vector, selected workspace cwd, no browser-provided environment, no stdin, no
  PTY, no streamed output, and zero output bytes requested. Responses and audit
  records must not return command text, executable names, argv, cwd,
  environment values, process handles, process ids, stdout, stderr, or
  preflight tokens.
- Browser-facing process-spawn history may report only recent sanitized
  status/count metadata for processes that already passed the audited
  process-spawn route. It must not return command text, executable names, argv,
  cwd, environment values, process handles, process ids, stdout, stderr, or
  preflight tokens.
- Browser-facing thread shell command preflight may accept draft command text
  only for exact JSON allowlist matching and aggregate counts. It must not echo
  command text, return full thread ids, return paths, touch app-server, or allow
  a top-level command response key.
- Browser-facing thread shell command execution must remain disabled unless
  `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1`,
  `CODEX_APP_PORT_ALLOW_THREAD_SHELL_COMMAND=1`, a configured
  `CODEX_APP_PORT_THREAD_SHELL_COMMAND_ALLOWLIST`, and a matching one-time
  preflight token are all present. It may call only `thread/shellCommand`
  through the persistent session manager after loaded-thread ownership is
  proven. Responses and audit records must not return command text, terminal
  output, terminal session identifiers, full ids, thread content, cwd, paths,
  or preflight tokens, and route-specific nested response schemas must reject
  unexpected nested command/process/session metadata.
- Browser-facing terminal control preflight may accept draft write, resize, or
  terminate intent plus a matching audited `command/exec/*` or `process/*`
  session-control method only for local validation and aggregate counts. It
  must not return session ids, echo terminal input, list sessions, write stdin,
  resize, terminate, execute commands, mutate files, or touch app-server.
- Browser-facing terminal control execution must remain disabled unless
  `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1`, a matching one-time preflight
  token, and an action-family gate are all present.
  `CODEX_APP_PORT_ALLOW_TERMINAL_CONTROL=1` may call only
  `command/exec/write`, `command/exec/resize`, or `command/exec/terminate`;
  `CODEX_APP_PORT_ALLOW_PROCESS_TERMINAL_CONTROL=1` separately may call only
  `process/writeStdin`, `process/resizePty`, or `process/kill`. Both must route
  through the persistent app-server session manager, never expose terminal
  input, session selectors, session ids, process handles, terminal output, cwd,
  paths, raw intent, or raw app-server payloads, and write only sanitized
  action-audit metadata when an action audit log is configured.
- Browser-facing terminal control preflight and confirmation histories may
  expose only capped process-local action/method metadata, selector/input
  counts, resize dimensions, token-issued or token-consumed status,
  one-time-use status, and redaction flags. They must not expose preflight
  tokens, session selectors, session ids, terminal input, raw intent, intent
  hashes, terminal output, or execute terminal control.
- Browser-facing terminal background cleanup execution must remain disabled
  unless `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` and
  `CODEX_APP_PORT_ALLOW_TERMINAL_CLEAN=1` are both set and a matching one-time
  preflight token is consumed. It may target only a loaded thread suffix and
  call only `thread/backgroundTerminals/clean`; route-specific nested response
  schemas are enforced, and responses must not return terminal output, terminal
  session identifiers, full thread ids, transcript content, paths, or command
  text.
- Browser-facing background terminal inventory must remain disabled unless
  `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` and
  `CODEX_APP_PORT_ALLOW_TERMINAL_LIST=1` are both set. It may call only
  `thread/backgroundTerminals/list` for a loaded thread suffix and may return
  only counts plus opaque process-local refs; process ids, item ids, commands,
  cwd, OS pids, paths, output, raw payloads, full ids, and thread content must
  stay server-side. Background terminal termination additionally requires
  `CODEX_APP_PORT_ALLOW_TERMINAL_TERMINATE=1`, a listed opaque ref, and a
  matching one-time preflight token before calling only
  `thread/backgroundTerminals/terminate`; responses and action audit records
  must not return the opaque ref, process id, command text, cwd, paths, output,
  or raw payloads.
- Browser-facing live-session control history may contain only capped,
  process-local metadata for controls already performed through this server:
  action, method, target suffixes or bulk target scope, prompt/count metadata,
  result status, loaded-session counts, and token-consumption flags. It must not
  return preflight tokens, prompt text, full ids, suffix arrays for bulk
  controls, paths, or thread content. The live-session lifecycle may summarize
  that history as action counts, succeeded/failed counts, and latest-control
  suffix/status/count metadata only, plus active-session operation counts and
  gate/routing state derived from the same sanitized lifecycle.
- Browser-facing file action preflight may accept workspace-relative paths and
  draft content only for local validation and aggregate counts. It must reject
  absolute paths, parent traversal, hidden paths, `.git` targets, and lock
  paths, and must not echo full paths, file contents, mutate files, or touch
  app-server. Browser-facing file action execution must remain disabled unless
  `CODEX_APP_PORT_ALLOW_FILE_ACTION=1` is set and a matching one-time preflight
  token is consumed. It must revalidate target ownership, reject symlinked
  parents/targets, avoid shell/app-server execution, and never return full
  paths or file contents.
- Browser-facing file action history may expose only capped process-local
  action/method metadata, target/source depth, content counts, filesystem
  result booleans, token-consumed status, and audit flags for file actions that
  already passed the audited file-action route. It must not expose preflight
  tokens, full paths, basenames, file contents, raw intent, intent hashes, or
  app-server payloads.
- Browser-facing integration routes must not call auth callback, ungated MCP
  OAuth/tool/resource/reload, settings write, ungated config-value write, ungated
  config-batch write, ungated
  experimental feature writes, ungated
  skill config write, plugin install/uninstall/share, or marketplace mutation methods until callback provenance,
  install provenance, replay protection, and secret/path redaction are
  implemented and tested.
- Browser-facing device-code account login, login cancel, and account logout are
  the only auth mutation exceptions. They must be blocked by default. Login may
  call only `account/login/start` with `{"type":"chatgptDeviceCode"}` when
  `CODEX_APP_PORT_ALLOW_ACCOUNT_LOGIN=1` is enabled and a matching one-time
  `/api/account-login-preflight` token has been consumed before app-server
  traffic. Login cancel may call only `account/login/cancel` when
  `CODEX_APP_PORT_ALLOW_ACCOUNT_LOGIN_CANCEL=1` is enabled, a matching one-time
  `/api/account-login-cancel-preflight` token has been consumed, and the browser
  supplies only the opaque process-local cancel reference issued by the protected
  immediate login response; the private app-server `loginId` must remain
  server-side. Logout may call only `account/logout` under the separate
  `CODEX_APP_PORT_ALLOW_ACCOUNT_LOGOUT=1` gate. The protected immediate login
  response may return only a sanitized device code, a verified OpenAI/ChatGPT
  HTTPS verification URL, and the opaque cancel reference. All account
  login/cancel/logout preflight and execution responses are constrained by
  route-specific nested response schemas. Histories and action
  audit records must not return device codes, verification URLs, login IDs,
  cancel references, OAuth URLs, auth tokens, account identifiers, raw
  app-server payloads, cwd, paths, or preflight tokens; linking, callback
  handling, and token access remain blocked.
- Browser-facing account login/cancel/logout history may expose only capped
  process-local metadata for auth actions already performed through this server: workspace
  label/id, action type/method, result status, token-consumed state, audit
  flags, and redaction flags. It must not expose auth tokens, account
  identifiers, auth URLs, login IDs, cancel references, preflight tokens, cwd,
  paths, raw intents, intent hashes, raw app-server payloads, or enable
  additional auth mutations.
- Browser-facing MCP tool preflight may accept server/tool names and argument
  text only for local validation and counts. It must not echo names, arguments,
  schemas, resources, invoke tools, or touch app-server.
- Browser-facing MCP tool calls may call `mcpServer/tool/call` only when
  `CODEX_APP_PORT_ALLOW_MCP_TOOL_CALL=1` is set, the requested `server/tool`
  exactly matches `CODEX_APP_PORT_MCP_TOOL_ALLOWLIST`, an 8-character thread
  suffix is supplied, and the matching one-time local preflight token is
  consumed before app-server traffic. Browser responses and action audit
  records may expose only result counts, content-type counts, character counts,
  structured-content presence/counts, error state, audit status, and redaction
  flags; they must not return server names, tool names, arguments, thread ids,
  tool output, structured content, paths, URLs, secrets, preflight tokens, raw
  request bodies, or raw app-server payloads.
- Browser-facing MCP server reload may call `config/mcpServer/reload` only when
  `CODEX_APP_PORT_ALLOW_MCP_SERVER_RELOAD=1` is set and the matching one-time
  local preflight token is consumed before app-server traffic. It must accept no
  browser-provided app-server arguments. Browser responses and action audit
  records may expose only reload status, response-shape counts, audit status,
  and redaction flags; they must not return MCP server names, config paths,
  command details, URLs, secrets, preflight tokens, raw request bodies, or raw
  app-server payloads.
- Browser-facing MCP OAuth login preflight may accept an MCP server name only
  for local validation, counts, and exact allowlist checks. It must not echo the
  name, start auth, or touch app-server. MCP OAuth login may call
  `mcpServer/oauth/login` only when
  `CODEX_APP_PORT_ALLOW_MCP_OAUTH_LOGIN=1` is set, the requested server name
  exactly matches `CODEX_APP_PORT_MCP_OAUTH_ALLOWLIST`, and the matching
  one-time local preflight token is consumed before app-server traffic. The
  protected immediate response may return only a sanitized HTTPS authorization
  URL with no embedded token-like query keys; histories and action audit records
  may expose only URL-present status, URL character count, response-shape
  counts, audit status, and redaction flags. They must not return server names,
  authorization URLs, OAuth tokens, paths, secrets, preflight tokens, raw
  request bodies, or raw app-server payloads.
- Browser-facing MCP resource preflight may accept server names and resource
  URI text only for local validation and counts, behind a route-specific nested
  response-key schema. It must not echo names, resource URIs, resource content,
  schemas, paths, URLs, or secrets, and it must not call
  `mcpServer/resource/read` or touch app-server.
- Browser-facing MCP resource reads may call `mcpServer/resource/read` only
  when `CODEX_APP_PORT_ALLOW_MCP_RESOURCE_READ=1` is set, after rebuilding the
  matching preflight and consuming the one-time local token. Browser responses
  are constrained by a route-specific nested response-key schema, and responses
  plus action audit records may expose only content counts, text/blob counts,
  MIME-type counts, and character counts; they must not return server names,
  resource URIs, MIME-type values, resource content, paths, URLs, secrets,
  preflight tokens, raw request bodies, or raw app-server payloads.
- Browser-facing plugin-read preflight may accept plugin target and optional
  marketplace argument text only for local validation and counts, behind a
  route-specific nested response-key schema. It must not echo plugin names,
  marketplace names, marketplace paths, descriptions, hook keys, skill contents,
  MCP server names, URLs, schemas, or secrets, and it must not call
  `plugin/read` or touch app-server.
- Browser-facing plugin detail reads may call `plugin/read` only when
  `CODEX_APP_PORT_ALLOW_PLUGIN_READ=1` is set, after rebuilding the matching
  preflight and consuming the one-time local token. Execution responses are
  constrained by a route-specific nested response-key schema, and execution
  must accept only safe plugin names and optional safe `remoteMarketplaceName`;
  `marketplacePath`
  and unknown argument keys must be rejected before app-server traffic. Browser
  responses and action audit records may expose only structure counts and
  character counts; they must not return plugin names, marketplace names, ids,
  paths, URLs, descriptions, hook keys, skill content, MCP server names, share
  context, secrets, preflight tokens, raw request bodies, or raw app-server
  payloads.
- Browser-facing plugin uninstall preflight and execution responses are
  constrained by route-specific nested response-key schemas. The execution
  route may call `plugin/uninstall` only when
  `CODEX_APP_PORT_ALLOW_PLUGIN_UNINSTALL=1` is set, after rebuilding the
  matching preflight, requiring an exact
  `CODEX_APP_PORT_PLUGIN_UNINSTALL_ALLOWLIST` plugin-id match, and consuming
  the one-time local token. Execution must accept only safe plugin ids. Browser
  responses and action audit records may expose only target length and
  response-shape counts; they must not return plugin ids, plugin names, paths,
  URLs, secrets, preflight tokens, raw request bodies, or raw app-server
  payloads.
- Browser-facing plugin content preflight may accept only audited
  `plugin/skill/read` or `plugin/share/list` intent for local validation and
  counts, behind a route-specific nested response-key schema. It must not echo
  skill text, sharing URLs, sharing principals, plugin names, marketplace names,
  paths, descriptions, hook keys, MCP server names, schemas, or secrets, and it
  must not call either plugin read method or touch app-server.
- Browser-facing plugin content reads may call `plugin/skill/read` only when
  `CODEX_APP_PORT_ALLOW_PLUGIN_CONTENT_READ=1` is set, or `plugin/share/list`
  only when `CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_LIST=1` is set, after rebuilding
  the matching preflight and consuming the one-time local token. Execution
  responses are constrained by a route-specific nested response-key schema.
  Skill reads must accept only safe remote plugin id, remote marketplace name,
  and skill name inputs; share-list reads must send no browser-provided
  parameters to app-server. Browser responses and action audit records may
  expose only skill content counts or share item counts; they must not return
  skill text, sharing
  URLs, sharing principals, plugin names, marketplace names, ids, paths,
  descriptions, hook keys, MCP server names, secrets, preflight tokens, raw
  request bodies, or raw app-server payloads.
- Browser-facing integration mutation preflight may accept only audited blocked
  settings/auth/MCP/skills/plugins mutation methods for local validation and
  counts. High-risk method summaries for auth callbacks/mutations, MCP
  OAuth/tool calls, settings writes/mutations, plugin installs, plugin sharing,
  marketplace mutations, and external config imports may expose only sanitized
  counts and family flags, never raw target, argument, URL, path, token,
  marketplace name, plugin name, principal id, share URL, setting key/value,
  MCP server/tool/thread id, login id, account id, migration item, or payload
  text. It must not echo targets, arguments, names, URLs, paths, schemas,
  principals, setting values, or secrets, invoke tools, install/uninstall
  plugins, write settings, start auth callbacks, mutate sharing/marketplace
  state, or touch app-server.
- Browser-facing integration inventory may call opt-in read methods only.
  Without the second name gate it may return counts only. With
  `CODEX_APP_PORT_ALLOW_INTEGRATION_NAMES=1`, it may return bounded model
  display names, collaboration-mode names, app/connector, app plugin, MCP
  server/tool, skill, plugin, and experimental feature display names only after
  path-like, URL-like, and token-like values are stripped. It must not
  return config requirement values/domains, model ids, model descriptions,
  model upgrade copy, model availability messages, collaboration-mode model
  overrides, app ids, app URLs, logos, labels, descriptions, screenshots,
  external config descriptions, external config
  cwd values, migration paths, migration names, marketplace names, plugin names,
  session titles, raw migration items, import ids/messages/failure stages,
  installed plugin ids/names/prompts/capabilities, remote-control status
  strings, server names, installation ids, environment ids, hook commands, hook
  paths, hook keys, hook matchers, hook plugin IDs, account emails/tokens,
  rate-limit plan types, limit ids/names, balances, used percentages, reset
  times, MCP schemas/resource URIs, skill descriptions/paths, plugin
  ids/paths/URLs, or experimental feature descriptions/announcements/raw payloads.
  External agent config import
  must remain a blocked mutation.
- Browser-facing action preflights may issue short-lived process-local tokens
  for future mutation gates. The registry may store only token metadata and a
  non-returned hash of the intent; it must not store or return raw prompts,
  command text, file contents, full paths, MCP names, arguments, or intent
  hashes.
- Browser-facing action preflight confirmations must consume those tokens only
  once, validate the same action type, workspace, and hashed intent, and still
  block execution until the specific mutation pipeline is separately audited.
  Confirmation responses must not return the consumed token or raw intent.
- Browser-facing JSON POST routes must reject unsupported fields before any
  probe, app-server call, filesystem read/write, token consume, or audit-log
  write. Rejection responses must not echo unsupported field names or values.
- Browser-facing file-change review routes may expose only bounded,
  path-redacted, secret-pattern-redacted diff previews. They must not expose
  commands, file contents, complete local paths, or unbounded raw patches before
  the approval pipeline is implemented.
- Browser-facing Git/worktree routes must be read-only until explicit workflow
  actions are designed; they must not execute `git`, follow symlinked `.git`
  metadata, follow linked `gitdir:` targets, or expose remote URLs. Branch and
  linked-worktree inventory and status counts must stay bounded and path-free,
  and status checks must not read file contents.
- Browser-facing Git branch-switch preflight may validate only branch names
  already present in the read-only inventory. It must not execute `git`, write
  refs, change HEAD, expose file names or paths, or echo unknown branch inputs.
- Git branch-switch safety scans may count hook files, filter config sections,
  attributes files, and local `core.hooksPath` / `core.fsmonitor` config because
  real checkout can execute hooks, content filters, or configured helpers. The
  scan must stay bounded and path-free.
- Real browser-facing Git branch switching must stay opt-in, consume a matching
  one-time preflight token, accept only inventoried local branch names, require a
  clean worktree and zero switch-safety counts, disable global/system Git config
  and hooks/fsmonitor for the subprocess, and return no argv, stdout, stderr,
  paths, or remote URLs.
- Real browser-facing Git branch creation must stay opt-in, consume a matching
  one-time preflight token, accept only a validated non-existing local branch
  name, write only a loose local ref under `.git/refs/heads`, avoid Git
  subprocesses and checkout, and return no ref paths or full commit ids.
- Real browser-facing Git branch deletion must stay opt-in, consume a matching
  one-time preflight token, accept only an inventoried non-current local branch
  name, reject linked-worktree checkouts, delete only a loose local ref under
  `.git/refs/heads`, avoid Git subprocesses and checkout, and return no ref
  paths or full commit ids. Packed refs must not be edited by this route.
- Browser-facing Git commit preflight may accept a draft commit message only for
  local validation and aggregate counts. It must not echo the message text,
  inspect staged content, create commit objects, update refs, execute `git`, or
  touch app-server. Browser-facing Git commit execution must remain disabled
  unless `CODEX_APP_PORT_ALLOW_GIT_COMMIT=1` is set and a matching one-time
  preflight token is consumed. It may commit only on a current local branch with
  complete warning-free status metadata, no unstaged or untracked changes, and
  staged changes verified immediately before commit. It must run `git commit`
  with hooks, GPG signing, editor prompts, stdout, stderr, argv, stdin echo, and
  app-server traffic blocked from browser responses.
- Browser-facing Git worktree preflight may accept draft create/remove intent
  only for local validation and aggregate counts. It must accept only
  workspace-relative target paths, reject absolute paths, parent traversal,
  hidden paths, `.git` targets, and lock paths, and for create it must accept
  only branches already present in the read-only inventory. Browser-facing Git
  worktree execution must remain disabled unless
  `CODEX_APP_PORT_ALLOW_GIT_WORKTREE=1` is set and a matching one-time
  preflight token is consumed. It must revalidate target ownership, reject
  symlinked targets or parents, require zero hook/filter/attribute risk for
  creation, avoid forced removal, and never return full paths, stdout, stderr,
  argv, unknown branch inputs, or app-server traffic.
- Project discovery must be opt-in, capped, shallow, and server-side only. The
  browser may receive opaque workspace ids and basename labels, but never
  arbitrary path selection or discovered absolute paths.
- URL handler registration must be user-scoped and opt-in. It may register only
  `codex-app-port://`, must reject auth/callback parameters and the official
  `codex://` scheme, and must not start app-server, model traffic, shell
  commands, or host-wide registration.
- App-server response handling must pass through maintained protocol contracts
  before browser-facing sanitizers rely on the shape of a payload.
- Do not silently widen Codex permissions beyond the user's configured policy.
- Do not store secrets in repo files, logs, screenshots, or generated build
  manifests.
- Do not register URL handlers without validating expected schemes and callback
  handling.
- URL handler validation must reject callback/auth parameters and stay blocked
  until desktop registration and callback behavior are explicitly audited.
- Do not disable Electron/Chromium sandboxing without a documented reason and a
  compensating containment plan.

## Build Requirements

- All remote artifacts must have a pinned source URL and digest.
- Dependency lockfiles are required before reproducible builds.
- Build and extraction should happen in an isolated workspace.
- Generated app output must be scanned before first launch.
- Any patch to upstream app assets must be represented as a minimal, reviewed,
  deterministic transform.
- Install logs must redact secrets and avoid absolute paths unless needed for
  diagnostics.
- Local desktop installers must be user-scoped by default, avoid sudo, avoid
  network fetches, and refuse symlinks in the copied runtime tree.

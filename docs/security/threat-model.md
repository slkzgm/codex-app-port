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
  preflight/execution, environment-add preflight/execution, config-value
  preflight/execution, config-batch preflight/execution, experimental-feature
  preflight/execution, Git branch/commit/worktree preflight/execution,
  file-action preflight/execution, action-preflight confirmation, and generic
  integration mutation preflights already enforce these schemas for their
  sanitized turn/probe/event, decision, queue, history, target, argument/risk
  summary, Git status/safety/subprocess, file metadata/content/filesystem,
  result, auth, policy, and preflight objects.
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
- Browser-facing thread fork must be blocked by default and opt-in only. When
  `CODEX_APP_PORT_ALLOW_THREAD_FORK=1` is enabled, `/api/thread-fork-action`
  must consume a matching one-time preflight token before resolving a source
  suffix through `thread/list` and calling only `thread/fork` with
  `excludeTurns: true`. The browser must not provide app-server `path`, `cwd`,
  model, sandbox, instruction, permission, or runtime-root overrides. Responses
  and action audit records must not return full ids, names, previews,
  transcript content, cwd, paths, raw app-server payloads, raw thread payloads,
  or preflight tokens. The preflight and execution responses are constrained by
  route-specific nested response schemas.
- Browser-facing thread rename must be blocked by default and opt-in only.
  When `CODEX_APP_PORT_ALLOW_THREAD_RENAME=1` is enabled,
  `/api/thread-rename-action` must consume a matching one-time preflight token
  before resolving a suffix through `thread/list` and calling only
  `thread/name/set`. Responses and action audit records must not return the
  name text, full ids, previews, transcript content, cwd, paths, raw app-server
  payloads, raw thread payloads, or preflight tokens. The preflight and
  execution responses are constrained by route-specific nested response
  schemas.
- Browser-facing thread rollback must be blocked by default and opt-in only.
  When `CODEX_APP_PORT_ALLOW_THREAD_ROLLBACK=1` is enabled,
  `/api/thread-rollback-action` must consume a matching one-time preflight
  token before resolving a suffix through `thread/list` and calling only
  `thread/rollback` with a bounded `numTurns` value. Because the app-server
  rollback response can include populated turns, browser responses and action
  audit records must not return full ids, names, previews, transcript content,
  cwd, paths, raw app-server payloads, raw thread payloads, returned turn
  content, or preflight tokens. Rollback must be documented as conversation
  history mutation only, not workspace file rollback. The preflight and
  execution responses are constrained by route-specific nested response
  schemas.
- Browser-facing thread settings updates must not expose arbitrary
  `thread/settings/update`. The only implemented path is a blocked-by-default
  safety lock. When `CODEX_APP_PORT_ALLOW_THREAD_SAFETY_LOCK=1` is enabled,
  `/api/thread-safety-lock-action` must consume a matching one-time preflight
  token before resolving a suffix through `thread/list` and calling only
  `thread/settings/update` with fixed safe values: `approvalPolicy:
  "on-request"`, `approvalsReviewer: "user"`, and read-only sandbox with
  network disabled. Browser bodies must not accept cwd, model, permissions,
  service tier, summary, sandbox policy, or arbitrary settings. Responses and
  action audit records must not return full ids, cwd, paths, settings payloads,
  raw app-server payloads, or preflight tokens. The preflight and execution
  responses are constrained by route-specific nested response schemas.
- Browser-facing thread resume and item injection must not expose arbitrary
  `thread/resume` or `thread/inject_items`. The only implemented surface is a
  local-only `/api/thread-resume-inject-preflight` check with selected-thread
  suffix validation, official method allowlisting, JSON-object argument shape
  validation, and no execution route. It must not touch app-server, resume a
  thread, inject items, create model traffic, or return full ids, thread
  content, cwd, paths, item text, argument text, secrets, raw app-server
  payloads, or raw request payloads.
- Browser-facing realtime start/audio/text/speech/stop must not expose
  arbitrary `thread/realtime/*` execution. The only implemented surface for
  these methods is a local-only `/api/thread-realtime-preflight` check with
  selected-thread suffix validation, official method allowlisting, JSON-object
  argument shape validation, and no execution route. It must not touch
  app-server, start realtime, send audio/text/speech, stop realtime, create
  model traffic, or return full ids, thread content, prompt text, audio data,
  text, SDP, realtime session ids, cwd, paths, secrets, raw app-server payloads,
  or raw request payloads.
- Browser-facing elicitation counters and guardian-denied-action approvals must
  not expose arbitrary `thread/increment_elicitation`,
  `thread/decrement_elicitation`, or `thread/approveGuardianDeniedAction`
  execution. The only implemented surface is a local-only
  `/api/thread-guardian-preflight` check with selected-thread suffix validation,
  official method allowlisting, JSON-object argument shape validation, and no
  execution route. It must not touch app-server, mutate counters, approve guarded
  actions, create model traffic, or return full ids, thread content, guardian
  event details, cwd, paths, secrets, raw app-server payloads, or raw request
  payloads.
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
- Browser-facing thread goal reads must be blocked by default and opt-in only.
  When `CODEX_APP_PORT_ALLOW_THREAD_GOAL=1` is enabled, `/api/thread-goal` may
  call only `thread/list` for suffix resolution and `thread/goal/get` for the
  selected thread. Responses must expose only suffix, goal presence/status,
  bounded usage values, and objective length/line counts. They must not return
  objective text, full ids, exact goal timestamps, cwd, paths, thread content,
  or raw app-server payloads.
- Browser-facing thread goal mutations must be blocked by default and opt-in
  only. `thread/goal/set` and `thread/goal/clear` must use separate
  `CODEX_APP_PORT_ALLOW_THREAD_GOAL_SET=1` and
  `CODEX_APP_PORT_ALLOW_THREAD_GOAL_CLEAR=1` gates, dedicated preflight
  routes, one-time token consumption before app-server traffic, suffix-only
  target resolution, sanitized action-audit records, and responses that never
  return objective text, full ids, cwd, paths, thread content, raw payloads, or
  preflight tokens.
- Browser-facing thread memory mode mutations must be blocked by default and
  opt-in only. `thread/memoryMode/set` must accept only `enabled` or
  `disabled`, use `CODEX_APP_PORT_ALLOW_THREAD_MEMORY_MODE_SET=1`, consume a
  matching one-time preflight token before app-server traffic, resolve targets
  by suffix only, write sanitized action-audit records, and never return full
  ids, cwd, paths, thread content, raw payloads, or preflight tokens.
- Browser-facing paged turn reads must be blocked by default and opt-in only.
  When `CODEX_APP_PORT_ALLOW_THREAD_TURNS=1` is enabled, `/api/thread-turns`
  may call only `thread/list` for suffix resolution and `thread/turns/list`
  with `itemsView:notLoaded`. Responses must expose only suffix, turn
  status/count metadata, cursor-presence booleans, and redaction flags. They
  must not return item content, cursor values, full ids, exact turn timestamps,
  cwd, paths, thread content, or raw app-server payloads.
- Browser-facing paged turn-item reads must be blocked by default and opt-in
  only. When `CODEX_APP_PORT_ALLOW_THREAD_TURN_ITEMS=1` is enabled,
  `/api/thread-turn-items` may call only `thread/list` for suffix resolution,
  `thread/turns/list` with `itemsView:notLoaded` to resolve the selected turn,
  and `thread/turns/items/list` for the capped item page. Responses must expose
  only item suffix, type, status/phase, content-type labels, text-length/count
  metadata, change counts, cursor-presence booleans, and redaction flags. They
  must not return message text, prompt text, command text, stdout/stderr,
  aggregated output, patches, file paths, cursor values, full ids, exact
  timestamps, raw item payloads, raw thread payloads, or raw app-server
  payloads.
- Browser-facing realtime voice catalog reads must be blocked by default and
  opt-in only. When `CODEX_APP_PORT_ALLOW_THREAD_REALTIME_VOICES=1` is
  enabled, `/api/thread-realtime-voices` may call only
  `thread/realtime/listVoices` with an empty parameter object. Responses must
  be filtered to the official generated voice enum and may expose only known
  voice names plus default voice names. They must not accept browser realtime
  parameters, start realtime sessions, send audio/text/speech, expose SDP,
  audio, transcript content, prompt text, full ids, cwd, paths, unknown voice
  strings, raw app-server payloads, or model traffic.
- Browser-facing app-server filesystem directory reads must be blocked by
  default and opt-in only. When `CODEX_APP_PORT_ALLOW_FS_DIRECTORY=1` is
  enabled, `/api/fs-directory` may accept only a workspace-relative directory
  selector. Absolute paths, traversal, dotfiles, `.git`, lockfiles, path-like
  segments, and symlinked workspace/path segments must be rejected before
  app-server traffic. Execution may call only `fs/getMetadata` and
  `fs/readDirectory` with a server-resolved absolute path. Responses may expose
  only bounded direct child names, file/directory booleans, target depth,
  counts, and redaction flags. They must not return absolute paths, relative
  paths, timestamps, file contents, symlink targets, hidden entries, token-like
  names, URLs, raw filesystem payloads, or raw app-server payloads.
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
- Browser-facing active-session interaction summaries may expose only UI
  interaction modes, row draft/preflight visibility, bulk control visibility,
  client-side grouping, refresh-after-control requirements, route labels,
  suffix-only target requirements, action-audit requirements, and sanitized
  history/control counts. They must not grant session-wide authority or expose
  full ids, prompt text, preflight tokens, paths, transcript content, raw control
  payloads, or raw app-server payloads.
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
  must keep tool user-input requests, dynamic tool calls, MCP elicitation,
  ChatGPT auth-token refresh, attestation generation, and current-time reads
  unsupported until each has a dedicated response policy.
  `/api/settings-integrations` may expose only fail-closed
  server-request/server-notification boundary metadata: method/category counts,
  blocked method names, and redaction flags. It must not return prompts, form
  schemas, server names, tool names, tool arguments, account ids, auth tokens,
  attestation tokens, timestamps, realtime transcript text, audio, SDP,
  moderation metadata, progress details, URLs, paths, raw params, raw
  notifications, or raw app-server payloads. Approval summaries must not expose
  decision tokens, request keys, session identifiers, raw approval details,
  paths, patches, file contents, permission paths, or network grant details.
  Its Codex app settings parity summary may expose only static official section
  keys, states, and counts; it must not return local setting values, profile
  names, paths, URLs, secrets, raw payloads, app-server payloads, browser
  handlers, or settings writes. Its General settings catalog may expose only
  static setting keys, groups, states, sources, and counts; it must not return
  current file-opening locations, command-output preferences, terminal tab
  preferences, multiline prompt values, sleep-prevention state, paths, URLs,
  secrets, raw payloads, app-server payloads, or General settings mutations.
  Its Agent configuration settings catalog may expose only static setting keys,
  groups, states, sources, and counts; it must not return current config
  values, `config.toml` content or paths, model settings, sandbox settings,
  approval settings, instruction values, security policy values, paths, URLs,
  secrets, raw payloads, app-server payloads, config writes, or agent
  configuration mutations.
  Its Profile settings catalog may expose only
  static setting keys, groups, states, sources, and counts; it must not return
  activity metrics, token values, profile pictures, display names, usernames,
  profile cards, profile-card sharing URLs, invitation eligibility, invitation
  links, paths, URLs, secrets, raw payloads, app-server payloads, or profile
  mutations. Its keyboard-shortcuts catalog may expose only
  static shortcut keys, groups, bindings, states, sources, and counts; it must
  not expose command labels, custom or user bindings, paths, URLs, secrets, raw
  payloads, app-server payloads, or shortcut editing/reset mutations. Its
  Appearance settings catalog may expose only static setting keys, groups,
  states, sources, and counts; it must not return active theme values, color
  values, font names, custom theme payloads, sharing URLs, paths, secrets, raw
  payloads, app-server payloads, or appearance mutations. Its
  Codex pets settings catalog may expose only static setting keys, groups,
  states, sources, and counts; it must not return selected pet values, pet
  names, custom pet assets, local Codex home scan results, overlay state,
  active-thread overlay data, paths, URLs, secrets, raw payloads, app-server
  payloads, or pet mutations, and must not install or reload skills, execute
  `/pet`, launch overlays, or refresh custom pets. Its Git settings catalog may
  expose only static setting keys, groups, states, sources, and counts; it must
  not return branch naming values, force-push preferences, prompt text, generated
  commit or pull-request text, repository names, repository paths, remote URLs,
  paths, URLs, secrets, raw payloads, app-server payloads, or Git settings
  mutations. Its Integrations & MCP settings catalog may expose only static
  setting keys, groups, states, sources, counts, and redaction flags; it must
  not return MCP server listings, server names, recommended/custom server names,
  server URLs, commands, environment variables, bearer-token environment
  variables, OAuth URLs or tokens, `config.toml` content or paths, tool names,
  tool allowlists, server instructions, plugin ids, setting values, config
  writes, mutations, paths, URLs, secrets, raw payloads, app-server payloads, or
  start OAuth/app-server traffic. Its Skills & Plugins catalog may expose only
  static official-documentation keys plus local boundary keys, groups, states,
  sources, counts, and redaction flags; it must not return skill names,
  descriptions, paths, content, scripts, metadata, dependency tools, plugin
  names, ids, paths, URLs, descriptions, manifests, default prompts,
  screenshots, marketplace names or sources, app names, MCP server names, hook
  commands, share links or principals, setting values, secrets, raw payloads,
  app-server payloads, or app-server traffic, and must not materialize external
  code, install or uninstall plugins, write plugin enablement, write skill
  config, clear extra roots, mutate sharing, or mutate marketplaces. Static
  skill coverage may include only documentation keys for progressive
  disclosure, initial context budget, explicit and implicit invocation,
  description matching, creator/manual authoring, scope locations and
  precedence, symlink support, plugin distribution, curated installation,
  enablement config, optional app metadata, and best practices. Static plugin
  coverage may include only documentation keys for overview, app and
  CLI directory browsing, marketplace sharing, install/auth timing,
  new-thread usage, direct-task and `@` invocation, bundled skills/apps/MCP
  setup, external app data terms, uninstall semantics, disable config, and
  plugin guide references. Its Codex Authentication catalog may expose only
  static official-documentation keys plus local boundary keys, groups, states,
  sources, counts, and redaction flags; it must not return account or workspace
  identifiers, access tokens, API keys, device codes, verification URLs, OAuth
  callbacks, auth caches or files, credential-store state, login logs, CA
  paths, MFA/SSO state, managed restriction values, provider credentials or
  env vars, billing or entitlement values, auth commands, auth URLs,
  credential/config/env values, paths, URLs, secrets, raw payloads,
  app-server payloads, or app-server traffic, and must not start login/logout,
  read auth storage, read credential stores or logs, access files or network,
  create model traffic, or mutate auth state. Its
  Codex Access tokens catalog may expose only static official-documentation
  keys plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return token names, token values, prefixes, hashes, user
  or workspace identities/names, admin URLs, secret-manager locations, CI
  secret names, expiration values, auth storage paths, environment values,
  command text, governance records, permission states, paths, URLs, secrets,
  raw payloads, app-server payloads, or app-server traffic, and must not create,
  list, revoke, rotate, or persist tokens, run `codex login`, run `codex exec`,
  trigger workspace agents, open admin consoles, read environment variables,
  read auth storage, access files or network, or mutate access-token state. Its
  Codex Admin Setup catalog may expose only static official-documentation keys
  plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return workspace setting values, enterprise policy values,
  owner/group/user/role/policy names, user emails, policy contents,
  requirements snippets, admin or analytics URLs, compliance API data, GitHub
  org/repo/token data, Slack workspace data, allowlist domains, environment
  names, Team Config paths, config paths, paths, URLs, secrets, raw payloads,
  app-server payloads, or app-server traffic, and must not open admin consoles
  or analytics, call compliance APIs, start GitHub connectors, look up user
  policies, read or write Team Config files, mutate RBAC, workspace settings,
  managed policies, Slack settings, cloud environments, or internet allowlists.
  Its
  Codex Governance catalog may expose only static official-documentation keys
  plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return dashboard values, usage metrics, code-review
  metrics, skill invocation metrics, agent identities, access-token usage,
  export data, user emails, workspace ids, API keys, prompt text, response
  text, audit identifiers, model names, token usage, timestamps, pagination
  cursors, analytics or compliance URLs, warehouse/SIEM targets, paths, URLs,
  secrets, raw payloads, app-server payloads, or app-server traffic, and must
  not open dashboards, call Analytics or Compliance APIs, start exports, read
  API keys, or write warehouse/SIEM targets. Its Codex Bedrock catalog may
  expose only static official-documentation keys plus local boundary keys,
  groups, states, sources, counts, and redaction flags; it must not return
  provider names, AWS accounts, Regions, profiles, credentials, API keys,
  access keys, secret keys, session tokens, identities, model ids/names,
  provider config, config paths, environment variables, IAM policies, billing
  usage, request/response payloads, error details, feature availability values,
  paths, URLs, secrets, raw payloads, app-server payloads, or app-server
  traffic, and must not read credentials, profiles, environment variables,
  config files, start status or Bedrock requests, run credential processes,
  create model traffic, access files/network, or mutate provider state. Its
  Codex Pricing and Feature Maturity catalog may expose only static
  official-documentation keys plus local boundary keys, groups, states, sources,
  counts, and redaction flags; it must not return plan names, prices, billing
  cadences, checkout URLs, plan features, model names, model availability,
  usage limits, credit values, API pricing, workspace requirements, security/
  compliance/data-control values, maturity labels, support expectations, user
  plan, subscription state, billing accounts, payment methods, usage meters,
  rate limits, credit balances, enterprise contracts, paths, URLs, secrets, raw
  payloads, app-server payloads, or app-server traffic, and must not read
  billing or usage state, open checkout/billing URLs, access files/network, or
  mutate subscription, billing, or provider state. Its Codex Configuration
  catalog may expose only static official-documentation keys plus local
  boundary keys, groups, states, sources, counts, and redaction flags; it must
  not return config paths, `config.toml`, config values, profile names, model
  names, provider names, base URLs, environment variable names or values,
  header names or values, auth or hook commands, approval policies, sandbox
  modes, permission profiles, feature flags, telemetry payloads, MCP server
  names, state files, log paths, cloud task data, command text, paths, URLs,
  sample snippets, default or recommended values, connector identifiers,
  permission or network rules, telemetry endpoints, Windows values, secrets,
  raw payloads, app-server payloads, or app-server traffic, and must not read
  or write config, copy sample config, inspect state files, start telemetry,
  access filesystem or network, create model traffic, or mutate configuration state.
  Its Codex Workflow Guidance
  catalog may expose only static official-documentation keys plus local
  boundary keys, groups, states, sources, counts, and redaction flags; it must
  not return prompt text, file paths, repository content, command text/output,
  test output, diff content, review instructions, thread content/ids, goal
  text, plan text, config values, MCP server names, skill/automation names,
  model/reasoning values, credit rates, cloud task data, speech audio,
  screenshots, context-window values, paths, URLs, secrets, raw payloads,
  app-server payloads, or app-server traffic, and must not read prompts/files/
  diffs, execute commands/tests, start reviews/cloud tasks, mutate goals/config/
  Fast Mode/model selection, access files/network, or create model traffic. Its
  Codex Overview and Quickstart catalog may expose only static
  official-documentation keys plus local boundary keys, groups, states, sources,
  counts, and redaction flags; it must not return surface names, plan names,
  account state, API keys, auth URLs, install commands, project paths,
  repository content, prompt text, generated code, review findings, debug
  traces, automation names, cloud task data, user/workspace identities, paths,
  URLs, secrets, raw payloads, app-server payloads, or app-server traffic, and
  must not read auth/API keys/projects, generate code, start reviews/debugging/
  automations/cloud tasks, open app/CLI/IDE surfaces, access files/network,
  create model traffic, or mutate state. Its Codex Troubleshooting catalog may
  expose only static official-documentation keys plus local boundary keys,
  groups, states, sources, counts, and redaction flags; it must not return Git
  state, project/thread names, thread ids, prompt text, worktree/local-
  environment/log paths, permission states, automation names, version values,
  feedback session ids, issue URLs, log content, terminal commands/output, font
  values, paths, URLs, secrets, raw payloads, app-server payloads, or app-server
  traffic, and must not read Git/logs/local environments, remove projects,
  unarchive threads, run setup/version/terminal commands, upload feedback, open
  issues/settings, trigger permissions, archive automations, recover prompts,
  access files/network, or mutate state. Its Codex Worktrees catalog may expose
  only static official-documentation keys plus local boundary keys, groups,
  states, sources, counts, and redaction flags; it must not return project
  names, repository/worktree paths, branch names, commit SHAs, Git state,
  thread ids, prompt text, local-environment names, ignored-file patterns, file
  names, snapshot content, terminal commands, IDE names, setting values, paths,
  URLs, secrets, raw payloads, app-server payloads, or app-server traffic, and
  must not read Git repositories or branches, create worktrees, run handoff,
  create branches, commit, push, open PRs, open IDEs or terminals, copy ignored
  files, restore snapshots, change cleanup settings, create permanent
  worktrees, run local-environment setup, access files/network, or mutate
  Git/app state. Its Codex Local Environments catalog may expose only static
  official-documentation keys plus local boundary keys, groups, states,
  sources, counts, and redaction flags; it must not return project names,
  project roots, config paths, config content, setup commands, action names,
  action commands, action icons, platform names, dependency state, worktree
  paths, terminal output, setting values, paths, URLs, secrets, raw payloads,
  app-server payloads, or app-server traffic, and must not read or write local
  environment config, run setup scripts, run actions or terminal commands, open
  settings, access files/network, or mutate state. Its Codex Review catalog may
  expose only static official-documentation keys plus local boundary keys,
  groups, states, sources, counts, and redaction flags; it must not return
  project names, repository paths, Git state, diff content, file paths or
  names, line numbers, comment text, review findings, pull request context,
  reviewer feedback, GitHub identities, command text, branch names, commit
  SHAs, editor names, paths, URLs, secrets, raw payloads, app-server payloads,
  or app-server traffic, and must not read Git/diffs/PR context, open editors,
  create inline comments, start reviews, invoke GitHub CLI, stage, unstage,
  revert, commit, push, open PRs, access files/network, create model traffic,
  or mutate state. Its
  Codex Auto-review catalog may expose only static official-documentation keys
  plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return approval requests, reviewer rationales,
  transcripts, tool calls or outputs, prompt text, user messages, policy
  content, denial records, override markers, session transcript paths, config
  policies, paths, URLs, secrets, raw payloads, app-server payloads, or
  app-server traffic, and must not start reviewer agents, forward approvals,
  apply overrides, read config or session transcripts, change sandbox, network,
  writable-root, or protected-path policy, create model traffic, access files
  or network, or mutate Auto-review state. Its
  Codex Chronicle catalog may expose only static official-documentation keys
  plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return actual availability values, plan names, platform
  states, memory setting values, screen content, screen captures, OCR/context
  values, window titles, app names, browser/document/dashboard/PR/meeting/
  communication context, temporary capture paths, memory paths, memory content,
  generated summaries, prompt context, rate limits, paths, URLs, secrets, raw
  payloads, app-server payloads, or app-server traffic, and must not start
  background agents or screen recording, touch menu-bar controls, write
  settings, generate or inject memories, read screen captures or memory files,
  create model traffic, access filesystem or network, or mutate Chronicle
  state. Its
  Codex Custom Prompts catalog may expose only static official-documentation
  keys plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return prompt names, descriptions, argument hints, prompt
  content, prompt paths, prompt arguments, expanded prompts, slash commands,
  local-home paths, command text, paths, URLs, secrets, raw payloads,
  app-server payloads, or app-server traffic, and must not read prompt
  directories, read/write/delete prompt files, expand prompts, execute slash
  commands, access filesystem, create model traffic, or mutate Custom Prompts
  state. Its
  Codex Customization catalog may expose only static official-documentation
  keys plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return guidance files, global or repo guidance, memory
  content, skill names/content/scripts, plugin names, MCP server/tool/resource/
  prompt data, subagent names, automation names, workflow instructions, local
  paths, file contents, config values, external system identifiers, URLs,
  secrets, raw payloads, app-server payloads, or app-server traffic, and must
  not read/write files, call MCP tools, read MCP resources, load MCP prompts,
  load skills, install plugins, start subagents or automations, create model
  traffic, or mutate customization state. Its
  Codex Agents guidance catalog may expose only static official-documentation
  keys plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return instruction file names/content,
  global/project/override guidance, fallback filenames, config values, profile
  homes, workspace roots, directory names, loaded sources, command text, log
  paths, session log paths, external URLs, paths, secrets, raw payloads,
  app-server payloads, or app-server traffic, and must not read plaintext logs,
  session logs, config, or guidance files, run verification commands, access
  filesystem, create model traffic, or mutate guidance state. Its
  Codex third-party integrations catalog may expose only static official Linear
  and Slack documentation keys plus local boundary keys, groups, states,
  sources, counts, and redaction flags; it must not return Linear issue
  content/metadata/comments/workspace/account/connector/MCP data, Slack
  messages/thread history/workspace/channel/connector data, cloud task data,
  task links/results, environment names, repo names, admin setting values,
  external/policy URLs, MCP server names/config, paths, secrets, raw payloads,
  app-server payloads, or app-server traffic, and must not install connectors
  or Slack apps, link accounts, assign issues, post comments or messages, write
  triage rules, start cloud tasks, configure or log into MCP, access
  filesystem/network, create model traffic, or mutate integration state. Its
  Codex MCP catalog may expose only static official-documentation keys plus
  local boundary keys, groups, states, sources, counts, and redaction flags; it
  must not return server listings/names/URLs, command text, arguments, env var
  names/values, bearer-token env vars, header names/values, OAuth URLs/tokens,
  callback ports/URLs, scope values, config.toml content/paths, tool names/
  allowlists, approval modes, server instructions, plugin ids/names, example
  server names, external URLs, paths, secrets, raw payloads, app-server
  payloads, or app-server traffic, and must not read local/remote environments,
  read/write config, start/reload MCP servers, start OAuth login, call tools,
  read resources, load prompts, access filesystem/network, create model traffic,
  or mutate MCP state. Its
  Codex Security catalog may expose only static official-documentation keys
  plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return plugin install state, scan prompts, setup
  workspaces, repository names, branches, commits, scan areas, threat model
  guidance, findings, finding evidence, code excerpts, file paths, report
  paths, structured artifact paths/content, export artifacts, issue or PR
  payloads, destinations, GitHub org/repo names, environment names, cloud scan
  state, validation output, model/reasoning values, paths, URLs, secrets, raw
  payloads, app-server payloads, or app-server traffic, and must not install
  plugins, start local/deep/cloud scans, export findings, track issues, start
  remediation, write threat models or configuration, create model traffic,
  access filesystem or network, or mutate Codex Security state. Its
  Codex Open Source catalog may expose only static official-documentation keys
  plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return component names, repository URLs, issue URLs,
  discussion URLs, program application URLs, component versions, issue content,
  discussion content, contribution content, external code, paths, URLs,
  secrets, raw payloads, app-server payloads, or app-server traffic, and must
  not fetch repositories, create issues, post discussions, submit
  contributions, start OSS program applications, access filesystem or network,
  or import external code. Its
  Codex Windows Platform catalog may expose only static official-documentation
  keys plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return platform values, Windows versions, sandbox modes,
  private desktop values, managed policy content, config values, command text,
  WSL distributions, WSL paths, Windows paths, repository paths, VS Code state,
  winget state, administrator state, firewall state, user accounts, install
  state, paths, URLs, secrets, raw payloads, app-server payloads, or app-server
  traffic, and must not configure sandboxes, change private desktop settings,
  write managed policy, modify firewall or sandbox users, install WSL, invoke
  winget, open VS Code, execute commands, access filesystem or network, or
  mutate Windows/WSL state. Its
  Codex Managed configuration catalog may expose only static
  official-documentation keys plus local boundary keys, groups, states,
  sources, counts, and redaction flags; it must not return requirement names or
  values, managed default values, policy content, group names, user identities,
  cache entries or signatures, profile names, permission profiles, sandbox
  modes, approval policies, reviewer policies, feature keys or values, host
  patterns, domain rules, admin URLs, local paths, command text, paths, URLs,
  secrets, raw payloads, app-server payloads, or app-server traffic, and must
  not read local config or managed caches, fetch or write policies, write
  config/features, apply network rules, apply auto-review policy, change
  Appshots or remote-control settings, access files or network, or mutate
  managed configuration state. Its
  Codex Appshots catalog may expose only static official-documentation keys
  plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return platform values, hotkey values, window titles, app
  names, screenshots, available text, attachment content, session paths, thread
  IDs, permission states, setting values, plugin names, document content,
  sensitive content, paths, URLs, secrets, raw payloads, app-server payloads, or
  app-server traffic, and must not start capture, hotkey listeners,
  accessibility reads, plugin access, model traffic, write attachments/session
  files/settings, create or update threads, prompt permissions, open settings,
  access filesystem or network, or mutate Appshots state. Its
  Codex GitHub Action catalog may expose only static official-documentation
  keys plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return workflow names/YAML, repository names, pull request
  numbers, issue comments, prompt text, prompt files, output files, final
  messages, action versions, runner labels, permission scopes, API keys, GitHub
  tokens, Codex args, model/effort/sandbox values, shared config paths, allowlist
  users/bots, logs, artifact contents, command text, paths, URLs, secrets, raw
  payloads, app-server payloads, or app-server traffic, and must not start
  workflows, invoke GitHub Actions, install the CLI, start the proxy, run
  `codex exec`, apply patches, post reviews/comments, upload artifacts, change
  sudo/users, read repository checkouts, call GitHub APIs, access filesystem or
  network, create model traffic, or mutate GitHub Action state. Its
  Codex SDK catalog may expose only static official-documentation keys plus
  local boundary keys, groups, states, sources, counts, and redaction flags; it
  must not return package names/versions, runtime versions, thread IDs, prompt
  text, final responses, app-server payloads, JSON-RPC payloads, model values,
  sandbox modes, executable paths, config values, dependency versions, command
  text, repository URLs, paths, URLs, secrets, raw payloads, app-server
  payloads, or app-server traffic, and must not install packages, import SDKs,
  start app-server/JSON-RPC, start/resume/run threads, start async runtimes,
  change sandboxes, launch executables, access filesystem or network, create
  model traffic, or mutate SDK state. Its Codex non-interactive mode catalog
  may expose only static official-documentation keys plus local boundary keys,
  groups, states, sources, counts, and redaction flags; it must not return
  prompt text, stdin/stdout/stderr contents, JSONL events/items, schema content,
  output files, session IDs, auth files, API keys, config values, rules files,
  MCP server names, sandbox modes, command text, workflow YAML, patch artifacts,
  GitHub tokens, repository names, paths, URLs, secrets, raw payloads,
  app-server payloads, or app-server traffic, and must not run `codex exec`,
  start processes, read stdin, write outputs, stream JSONL, load schemas, resume
  sessions, read auth files/API keys/config/rules, start MCP servers, override
  sandboxes, bypass Git checks, write patch artifacts, invoke GitHub CLI, access
  filesystem or network, create model traffic, or mutate non-interactive state.
  Its Codex Agents SDK catalog may expose only static official-documentation keys
  plus local boundary keys, groups, states, sources, counts, and redaction flags;
  it must not return tool names, tool schemas, prompt text, thread references,
  response content, approval prompts, config values, cwd, instruction text, model
  values, profile names, sandbox modes, API keys, dependency names, command text,
  script content, agent names, trace content, artifact content, paths, URLs,
  secrets, raw payloads, app-server payloads, or app-server traffic, and must not
  start MCP servers or inspectors, list/call tools, continue sessions, forward
  approvals, install dependencies, execute scripts, run agents, start handoffs,
  create traces, write artifacts, access filesystem or network, create model
  traffic, or mutate Agents SDK state. Its Codex Memories catalog may expose
  only static official-documentation keys plus local boundary keys, groups,
  states, sources, counts, and redaction flags; it must not return setting
  values, config values or paths, memory files or contents, memory paths, thread
  ids or contents, rate-limit values, model names, generated summaries, prompt
  context, secret values, paths, URLs, secrets, raw payloads, app-server
  payloads, or app-server traffic, and must not read/write config, read memory
  files, generate or inject memories, access filesystem or network, create model
  traffic, or mutate Memories state. Its Codex Custom Prompts catalog may
  expose only static official-documentation keys plus local boundary keys,
  groups, states, sources, counts, and redaction flags; it must not return
  prompt names, descriptions, argument hints, prompt content, prompt paths,
  prompt arguments, expanded prompts, slash commands, local-home paths, command
  text, paths, URLs, secrets, raw payloads, app-server payloads, or app-server
  traffic, and must not read prompt directories, read/write/delete prompt
  files, expand prompts, execute slash commands, access filesystem, create model
  traffic, or mutate Custom Prompts state. Its Codex Customization catalog may
  expose only static official-documentation keys plus local boundary keys,
  groups, states, sources, counts, and redaction flags; it must not return
  guidance files, global or repo guidance, memory content, skill names/content/
  scripts, plugin names, MCP server/tool/resource/prompt data, subagent names,
  automation names, workflow instructions, local paths, file contents, config
  values, external system identifiers, URLs, secrets, raw payloads, app-server
  payloads, or app-server traffic, and must not read/write files, call MCP
  tools, read MCP resources, load MCP prompts, load skills, install plugins,
  start subagents or automations, create model traffic, or mutate customization
  state. Its Codex Agents guidance catalog may expose only static
  official-documentation keys plus local boundary keys, groups, states,
  sources, counts, and redaction flags; it must not return instruction file
  names/content, global/project/override guidance, fallback filenames, config
  values, profile homes, workspace roots, directory names, loaded sources,
  command text, log paths, session log paths, external URLs, paths, secrets,
  raw payloads, app-server payloads, or app-server traffic, and must not read
  plaintext logs, session logs, config, or guidance files, run verification
  commands, access filesystem, create model traffic, or mutate guidance state.
  Its Codex third-party integrations catalog may expose only static official
  Linear and Slack documentation keys plus local boundary keys, groups, states,
  sources, counts, and redaction flags; it must not return Linear issue
  content/metadata/comments/workspace/account/connector/MCP data, Slack
  messages/thread history/workspace/channel/connector data, cloud task data,
  task links/results, environment names, repo names, admin setting values,
  external/policy URLs, MCP server names/config, paths, secrets, raw payloads,
  app-server payloads, or app-server traffic, and must not install connectors
  or Slack apps, link accounts, assign issues, post comments or messages, write
  triage rules, start cloud tasks, configure or log into MCP, access
  filesystem/network, create model traffic, or mutate integration state. Its
  Codex MCP catalog may expose only static official-documentation keys plus
  local boundary keys, groups, states, sources, counts, and redaction flags; it
  must not return server listings/names/URLs, command text, arguments, env var
  names/values, bearer-token env vars, header names/values, OAuth URLs/tokens,
  callback ports/URLs, scope values, config.toml content/paths, tool names/
  allowlists, approval modes, server instructions, plugin ids/names, example
  server names, external URLs, paths, secrets, raw payloads, app-server
  payloads, or app-server traffic, and must not read local/remote environments,
  read/write config, start/reload MCP servers, start OAuth login, call tools,
  read resources, load prompts, access filesystem/network, create model traffic,
  or mutate MCP state. Its
  Codex CLI command reference catalog
  may expose only static official-documentation keys plus local boundary keys,
  groups, states, sources, counts, and redaction flags; it must not return exact
  command names, flag names, option values, prompt text, config keys or values,
  profile names, model names, sandbox policies, remote URLs, auth tokens,
  workspace or image paths, session IDs, cloud task or environment IDs,
  completion output, stdout, JSON payloads, diagnostic reports, transport
  values, installer URLs, paths, URLs, secrets, raw payloads, app-server
  payloads, or app-server traffic, and must not invoke Codex, start processes,
  generate shell completions, start app-server, launch installers, start or list
  cloud tasks, mutate sessions, apply diffs, mutate MCP/plugins, access
  filesystem or network, create model traffic, or mutate CLI state. Its Codex
  CLI features catalog may expose only static official-documentation keys plus
  local boundary keys, groups, states, sources, counts, and redaction flags; it
  must not return command names or text, slash commands, prompts, drafts,
  transcripts, session IDs, remote URLs, auth tokens, model names, feature
  flags, image paths or content, generated images, theme names or files, review
  diffs, web-search queries or results, cloud task or environment IDs, shell
  completion output, MCP server names, config values, cwd, output text, paths,
  URLs, secrets, raw payloads, app-server payloads, or app-server traffic, and
  must not invoke Codex, start processes, open composers or editors, resume
  sessions, connect remotes, write feature flags, start subagents, attach or
  generate images, write themes, start reviews, run web search or shell
  completions, change approval modes, run exec/cloud tasks, start MCP servers,
  access filesystem or network, create model traffic, or mutate CLI state. Its
  Codex CLI slash commands catalog may expose only static
  official-documentation keys plus local boundary keys, groups, states, sources,
  counts, and redaction flags; it must not return exact slash commands,
  arguments, prompt text, transcripts, session IDs, config values, file paths or
  content, model names, approval policies, plugin/skill/app/hook names, import
  artifacts, feedback logs, terminal output, paths, URLs, secrets, raw payloads,
  app-server payloads, or app-server traffic, and must not open slash popups,
  queue or execute commands, mutate sessions/config/files/plugins/skills/hooks/
  imports, switch models or approval policy, control terminals, access
  filesystem or network, create model traffic, or mutate CLI state. Its Codex
  IDE extension catalog may expose only static official-documentation keys plus
  local boundary keys, groups, states, sources, counts, and redaction flags; it
  must not return command IDs or names, keybindings, editor selections, file
  paths or content, prompt text, model names, reasoning values, approval modes,
  cloud environments or tasks, web-search queries or results, image paths or
  content, generated images, setting names or values, CLI executable paths,
  feedback or log contents, slash commands, config values, paths, URLs, secrets,
  raw payloads, app-server payloads, or app-server traffic, and must not start
  IDE processes, execute commands, write keybindings/settings/config, read
  editor or file context, start threads/panels/sidebar/cloud follow-ups, switch
  model/reasoning or approval modes, run web search, attach or generate images,
  submit feedback, attach logs, execute slash commands, access filesystem or
  network, create model traffic, or mutate IDE state. Its Codex
  web catalog may expose only static official-documentation keys plus local
  boundary keys, groups, states, sources, counts, and redaction flags; it must
  not return web URLs, GitHub accounts or tokens, repository names or content,
  branch names, commit SHAs, pull request numbers or content, plan names,
  entitlement details, enterprise policies, admin setup state, prompt text,
  workflow prompts, cloud task IDs or content, browser sessions, cookies, auth
  state, paths, URLs, secrets, raw payloads, app-server payloads, or app-server
  traffic, and must not open Codex web, connect GitHub, read or write
  repositories, create or update pull requests, start or review cloud tasks,
  submit prompts, start workflows, open admin setup, call GitHub APIs, access
  network, create model traffic, or mutate web state. Its Codex
  agent internet access catalog
  may expose only static official-documentation keys plus local boundary keys,
  groups, states, sources, counts, and redaction flags; it must not return
  environment names, domain allowlists, preset domain values, HTTP method
  values, prompt examples, resource URLs, work logs, setup script content,
  config values, paths, URLs, secrets, raw payloads, app-server payloads, or
  app-server traffic, and must not enable agent internet, apply domain or
  method allowlists, enable unrestricted internet, run setup scripts, start
  network probes, review work logs, write config, access filesystem or network,
  create model traffic, or mutate agent internet access state. Its Codex Cloud
  environments catalog may expose only static official-documentation keys plus
  local boundary keys, groups, states, sources, counts, and redaction flags; it
  must not return environment names, settings URLs, repository names, branches,
  SHAs, setup or maintenance script content, package manager values, runtime
  versions, environment variable values, secret values, image references,
  command text, diffs, PR URLs, cache state, proxy values, task output, paths,
  URLs, secrets, raw payloads, app-server payloads, or app-server traffic, and
  must not start cloud tasks, create containers, check out repositories, run
  setup or maintenance scripts, install dependencies, pin package versions,
  apply variables, decrypt secrets, reset caches, open PRs, ask follow-ups,
  configure proxies, run agent commands, access filesystem or network, create
  model traffic, or mutate Cloud environment state. Its
  Codex Environment variables catalog may expose only static
  official-documentation keys plus local boundary keys, groups, states,
  sources, counts, and redaction flags; it must not read `process.env`, return
  variable names, variable values, default values, API keys, access tokens,
  certificate paths, state paths, install paths, provider secret names, log
  filters, log paths, command text, paths, URLs, secrets, raw payloads,
  app-server payloads, or app-server traffic, and must not start installers,
  run `codex exec`, run `codex login`, start diagnostics, access files or
  network, or mutate environment, config, or auth state. Its
  Codex Sites catalog may expose only static official-documentation keys plus
  local boundary keys, groups, states, sources, counts, and redaction flags; it
  must not return Sites projects, project ids, `.openai/hosting.json`, storage
  bindings, version ids, deployment URLs, production URLs, access modes,
  audiences, user groups, environment keys or values, secret values,
  migrations, build output or logs, source commits, plugin names, local paths,
  setting values, site content, screenshots, raw payloads, app-server payloads,
  or app-server traffic, and must not create sites, save versions, deploy,
  change access, write environment values or secrets, start builds, provision
  storage, install plugins, access network, read or write files, or mutate Sites
  state. Its
  Codex Permissions catalog may expose only static official-documentation keys
  plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return permission profiles, profile names, filesystem
  rules, paths, access values, deny globs, glob patterns, workspace roots,
  network rules, domains, proxy URLs, local/private policy values, Unix socket
  paths, sandbox modes, managed requirements, `config.toml`, platform paths,
  setting values, secrets, raw payloads, app-server payloads, or app-server
  traffic, and must not write profiles or rules, expand globs or workspace
  roots, migrate sandbox settings, access network, read or write files, or
  mutate permission state. Its
  Codex Plugin Build catalog may expose only static official-documentation keys
  plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return plugin manifests, plugin names, versions,
  descriptions, skill names or content, MCP configs, app integrations,
  marketplace files, entries, names, sources, paths, display names, local
  plugin paths, workspace principals, share links, admin requirements, command
  text, external code, paths, URLs, secrets, raw payloads, app-server payloads,
  or app-server traffic, and must not scaffold plugins, write marketplaces,
  write manifests, copy plugins, share plugins, run marketplace CLI commands,
  materialize external code, access files, or mutate plugin authoring state. Its
  Codex Hooks catalog may expose only static official-documentation keys plus
  local boundary keys, groups, states, sources, counts, and redaction flags; it
  must not return hook files, paths, commands, matchers, keys, sources, status
  messages, timeouts, trust hashes, outputs, input payloads, configs, plugin
  ids, admin requirements, feature values, URLs, secrets, raw payloads,
  app-server payloads, or app-server traffic, and must not execute commands,
  trust hooks, disable hooks, bypass hook trust, write hook configs, access
  files, or mutate hook state. Its
  Import to Codex catalog may expose only static official-documentation keys
  plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return source agent names, instruction files, settings
  JSON, skill or plugin names, project folders, session titles, MCP server
  names, hook commands, slash-command prompts, subagent names, auth details,
  environment variables, prompt templates, import-history details, raw
  migration items, paths, URLs, secrets, raw payloads, app-server payloads, or
  app-server traffic, and must not detect setup, start imports, write config,
  AGENTS.md, skills, plugins, MCP config, hooks, threads, or projects, start
  auth flows, show runtime status cards, access files, or mutate import state.
  Its
  Codex Record & Replay catalog may expose only static official-documentation
  keys plus local boundary keys, groups, states, sources, counts, and
  redaction flags; it must not return availability values, regional
  eligibility, Computer Use state, recording prompts, workflow inputs, screen
  content, window content, desktop actions, recording artifacts, generated
  skills, skill content or names, app names, plugin ids, managed requirements,
  permission states, paths, URLs, secrets, raw payloads, app-server payloads,
  or app-server traffic, and must not start recordings, replay workflows, write
  skills, invoke Computer Use, run browser or plugin actions, prompt for
  permissions, access files or network, or mutate Record & Replay state. Its
  Codex Remote Connections catalog may expose only static official-documentation
  keys plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return host names or ids, device names or ids, QR codes,
  pairing codes, relay endpoints, remote status values, SSH config, aliases,
  commands, remote project paths, remote filesystem content, remote shell
  output, credentials, plugin/MCP server/skill names, browser or Computer Use
  state, approval details, notification payloads, screenshots, terminal output,
  setting values, paths, URLs, secrets, raw payloads, app-server payloads, or
  app-server traffic, and must not enable hosts, start pairing, revoke devices,
  write keep-awake settings, open SSH connections, start remote app servers,
  execute remote commands, read or write remote files, send relay traffic,
  access files or network, or mutate Remote Connections state. Its
  Codex Subagents catalog may expose only static official-documentation keys
  plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return agent names, nicknames, agent files, paths,
  developer instructions, model values, reasoning effort values, sandbox
  values, MCP configs, skill configs, thread ids, thread content, subagent
  outputs, approval details, prompt text, config values, command output,
  secrets, raw payloads, app-server payloads, or app-server traffic, and must
  not spawn subagents, switch agent threads, steer, stop, or close subagents,
  write config or agent files, start model traffic or tool work, forward
  approvals, enable recursive delegation, access files, or mutate subagent
  state. Its
  Codex Rules catalog may expose only static official-documentation keys plus
  local boundary keys, groups, states, sources, counts, and redaction flags; it
  must not return rule files, rule paths, rule content, prefix patterns,
  decision values, justifications, match examples, config layers, admin
  requirements, command text, shell scripts, execpolicy results, Starlark
  content, paths, URLs, secrets, raw payloads, app-server payloads, or
  app-server traffic, and must not write rule files, write prefix rules, write
  command policies, create Smart approval rules, run execpolicy checks, parse
  shell scripts, execute commands, access files, or mutate rules state. Its
  Automations catalog may expose only static official-documentation keys plus
  local boundary keys, groups, states, sources, counts, and redaction flags; it
  must not return automation names, run ids, run results, triage items,
  findings, prompt text, schedule values, cron expressions, project names,
  workspace paths, worktree paths, model/reasoning values, skill/plugin names,
  sandbox values, admin-policy values, app names, notification payloads,
  secrets, raw payloads, app-server payloads, or app-server traffic, and must
  not create/update automations, write schedules, start or archive runs,
  materialize worktrees, read triage inbox contents, perform unattended
  execution, read or write files, access network, control apps, or mutate
  automation state. Its
  Codex app Commands catalog may expose only static official-documentation keys
  plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return shortcut bindings, custom shortcuts, slash command
  text, deep-link templates, query parameters, thread ids, prompt text,
  workspace paths, origin URLs, SSH host aliases, plugin identifiers,
  marketplace names, marketplace paths, pet names, pet image URLs, paths, URLs,
  secrets, raw payloads, app-server payloads, or app-server traffic, and must
  not open settings, launch browsers, execute commands, execute slash commands,
  open deep links, or mutate command state. Its
  Codex Chrome extension catalog may expose only static official-documentation
  keys plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return extension state, Chrome profile data, site hosts,
  allowlists, blocklists, browser history entries, page content, screenshots,
  bookmarks, downloads, tab groups, permission states, memory content, plugin
  names, setting values, paths, URLs, secrets, raw payloads, app-server
  payloads, or app-server traffic, and must not touch native hosts, launch
  Chrome, install extensions or plugins, allow websites, read browser history,
  enable file access, access network, or mutate Chrome extension state. Its
  Codex In-app Browser catalog may expose only static official-documentation
  keys plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return browser state, browser URLs, page content,
  screenshots, downloads, DOM, styles, console output, network traffic,
  cookies, browser profiles, extension state, existing tabs, comment text,
  annotations, styling values, plugin names, setting values, route names,
  visual states, site hosts, allowlists, blocklists, paths, URLs, secrets, raw
  payloads, app-server payloads, or app-server traffic, and must not start CDP,
  launch a browser, navigate pages, start Browser Use, capture screenshots,
  download assets, execute inspection JavaScript, create comments, create
  styling feedback, access network, or mutate browser state. Its
  Codex app Features catalog may expose only static official-documentation keys
  plus local boundary keys, groups, states, sources, counts, and redaction
  flags; it must not return project names, thread ids, thread content, mode
  selections, workspace paths, worktree paths, cloud environment names, diff
  content, terminal output, command text, local action definitions, voice audio,
  transcripts, window state, browser URLs, browser content, browser
  screenshots, desktop screenshots, app identifiers, artifact content, artifact
  paths, IDE file context, IDE state, web-search queries or results, generated
  images, image prompts, MCP server names, skill names, automation names,
  setting values, secrets, raw payloads, app-server payloads, model traffic, or
  app-server traffic, and must not launch browsers, start desktop control,
  capture voice, run web search, generate images, read or write files, access
  network, or mutate feature state. Its
  Browser settings catalog may expose only
  static setting keys,
  groups, states, sources, and counts; it must not return Browser plugin or
  Chrome extension state, allowed or blocked site lists, origins, website
  permission values, CDP state, organization policy, Chrome profile data,
  browser launches, network traffic, paths, URLs, secrets, raw payloads,
  app-server payloads, or Browser
  mutations. Its
  Computer Use settings catalog may expose only static setting keys, groups,
  states, sources, and counts; it must not return plugin install state, Screen
  Recording or Accessibility permission state, allowed or denied app lists, app
  identifiers, window titles, screen content, screenshots, clipboard state,
  locked-use state, admin policy, paths, URLs, secrets, raw payloads, or
  app-server payloads, and must not install plugins, prompt for system
  permissions, start desktop control, unlock a desktop, or mutate Computer Use
  settings. Its
  Notifications settings catalog may expose only static setting keys, groups,
  states, sources, and counts plus local server-notification boundary counts;
  it must not return notification setting values, browser permission state,
  subscriptions, notification payloads, paths, URLs, secrets, raw payloads,
  app-server payloads, browser Notification API prompts, or notification
  mutations. Its Personalization settings catalog may expose only static
  setting keys, groups, states, sources, and counts; it must not return active
  personality values, custom instructions, personal `AGENTS.md` content or
  paths, paths, URLs, secrets, raw payloads, app-server payloads, or
  personalization mutations. Its Context-aware Suggestions settings catalog may
  expose only static setting keys, groups, states, sources, and counts; it must
  not return suggestion text, task content, thread content or ids,
  project/workspace names, source context, ranking signals, resume targets,
  paths, URLs, secrets, raw payloads, or app-server payloads, and must not
  trigger suggestion generation or suggestion mutations. Its Memories settings
  catalog may expose only static setting keys, groups, states, sources, and
  counts; it must not return current memory setting values, config values,
  memory files, memory content, memory paths, storage paths, thread-level
  choices, rate-limit values, model names, paths, URLs, secrets, raw payloads,
  or app-server payloads, and must not trigger memory generation, memory
  injection, memory reset, or memory mutations. Its Archived threads settings
  catalog may expose only static setting keys, groups, states, sources, and
  counts; it must not return archived thread lists, dates, project context,
  thread names, ids, content, paths, URLs, secrets, raw payloads, app-server
  payloads, or execute unarchive/thread mutations.
  Browser-side approval queue filters must operate only on the already sanitized
  queue payload, and visible-subset deny/accept actions must still submit the
  bounded tokenized decision batch through the normal approval route. They must
  not create session-wide decisions or bypass decision-token checks.
- Browser-facing approval-decision history may expose only sanitized replay
  protection mode/scope and audit-persistence flags per recorded decision. It
  must not expose decision tokens, request keys, session identifiers, raw
  approval details, command text, file-change patches, file contents, paths,
  prompts, app-server payloads, or any full approval selector.
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
- Approval detail UI may only derive from already sanitized queue metadata and
  may show kind, route, state, local/managed scope, command/file counts,
  permissions presence, safe decision counts, and audit flags. It must not
  expose decision tokens, request keys, session ids, raw command text, patch
  text, file contents, full ids, paths, prompts, raw approval objects, or raw
  app-server payloads.
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
- Browser-facing `skills/extraRoots/set` must stay blocked as a generic
  mutation. The only allowed route is the disabled-by-default clear action:
  when `CODEX_APP_PORT_ALLOW_SKILLS_EXTRA_ROOTS_CLEAR=1` is enabled,
  `/api/skills-extra-roots-clear` must consume a matching one-time preflight
  token, reject all browser roots/paths/arguments, and call app-server only with
  `{"extraRoots":[]}`. Responses and action audit records may expose only
  status/count/shape metadata; they must not expose extra roots, paths,
  notifications, preflight tokens, or raw app-server payloads.
- Browser-facing `remoteControl/disable` must stay blocked as a generic
  mutation. The only allowed route is the disabled-by-default defensive action:
  when `CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_DISABLE=1` is enabled,
  `/api/remote-control-disable` must consume a matching one-time preflight
  token, reject all browser remote-control params, and call app-server only with
  `null` params. Responses and action audit records may expose only
  status/count/shape metadata; they must not expose raw remote-control status
  payloads, server names, installation ids, environment ids, notifications,
  preflight tokens, or raw app-server payloads.
- Browser-facing remote-control client management must use opaque local refs.
  `/api/remote-control-clients` may list paired clients only when
  `CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_LIST=1` is enabled, must resolve
  the environment server-side, and may expose only `remoteclientref-*` selectors,
  counts, and presence booleans. `/api/remote-control-client-revoke` may revoke
  only when `CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_REVOKE=1` is enabled,
  must consume a matching one-time preflight token, and must resolve
  `environmentId` and `clientId` only from the process-local ref registry.
  Responses and action audit records must not expose client ids, environment ids,
  names, device metadata values, cursors, notifications, preflight tokens, or raw
  app-server payloads.
- Browser-facing `environment/add` must be blocked by default and exact
  allowlist only. When `CODEX_APP_PORT_ALLOW_ENVIRONMENT_ADD=1` is enabled,
  `/api/environment-add` must consume a matching one-time preflight token,
  require an exact `CODEX_APP_PORT_ENVIRONMENT_ADD_ALLOWLIST`
  `environmentId=execServerUrl` match, accept only safe environment ids and
  `https:`/`wss:` exec-server URLs, reject browser timeout or extra app-server
  parameters, and call app-server with `connectTimeoutMs: null`. Responses and
  action audit records may expose only status/count/shape metadata; they must
  not expose environment ids, exec-server URLs, paths, notifications, preflight
  tokens, or raw app-server payloads.
- Browser-facing `config/value/write` must be blocked by default and opt-in
  only. When `CODEX_APP_PORT_ALLOW_CONFIG_VALUE_WRITE=1` is enabled,
  `/api/config-value-write` must require an exact
  `CODEX_APP_PORT_CONFIG_VALUE_WRITE_ALLOWLIST` key match, consume a matching
  one-time preflight token, parse JSON values server-side, accept only
  `replace` or `upsert`, and force `filePath` and `expectedVersion` to `null`.
  Responses and action audit records may expose only key/value counts and
  response-shape metadata; they must not expose key paths, values, config paths,
  preflight tokens, or raw app-server payloads.
- Browser-facing plugin enablement writes must be blocked by default and
  opt-in only. When `CODEX_APP_PORT_ALLOW_PLUGIN_ENABLEMENT_SET=1` is enabled,
  `/api/plugin-enablement-set` must require an exact
  `CODEX_APP_PORT_PLUGIN_ENABLEMENT_ALLOWLIST` plugin-id match, consume a
  matching one-time preflight token, construct
  `plugins."<plugin-id>".enabled` server-side, force `upsert`, and accept only a
  boolean enablement value. Responses and action audit records may expose only
  plugin-id length, requested state, and response-shape metadata; they must not
  expose plugin ids, key paths, values, config paths, preflight tokens, or raw
  app-server payloads.
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
  plugin enablement write, ungated config-batch write, ungated
  experimental feature writes, ungated
  skill config write, plugin install/uninstall/share, or marketplace mutation methods until callback provenance,
  install provenance, replay protection, and secret/path redaction are
  implemented and tested.
- Browser-facing device-code account login, login cancel, account credits nudge,
  account reset credit consumption, and account logout are the only account
  auth/quota mutation exceptions. They must be blocked by default. Login may
  call only `account/login/start` with `{"type":"chatgptDeviceCode"}` when
  `CODEX_APP_PORT_ALLOW_ACCOUNT_LOGIN=1` is enabled and a matching one-time
  `/api/account-login-preflight` token has been consumed before app-server
  traffic. Login cancel may call only `account/login/cancel` when
  `CODEX_APP_PORT_ALLOW_ACCOUNT_LOGIN_CANCEL=1` is enabled, a matching one-time
  `/api/account-login-cancel-preflight` token has been consumed, and the browser
  supplies only the opaque process-local cancel reference issued by the protected
  immediate login response; the private app-server `loginId` must remain
  server-side. Account credits nudge may call only
  `account/sendAddCreditsNudgeEmail` with a `credits` or `usage_limit` enum value
  when `CODEX_APP_PORT_ALLOW_ACCOUNT_CREDITS_NUDGE=1` is enabled and a matching
  one-time `/api/account-credits-nudge-preflight` token has been consumed.
  Account reset credit consumption may call only
  `account/rateLimitResetCredit/consume` when
  `CODEX_APP_PORT_ALLOW_ACCOUNT_RESET_CREDIT_CONSUME=1` is enabled and a
  matching one-time `/api/account-reset-credit-consume-preflight` token has been
  consumed; its idempotency key must be generated server-side and must never be
  returned or logged. It may expose only a bounded outcome enum and must not
  return or log quota values, rate-limit IDs, balances, account identifiers,
  auth tokens, URLs, raw app-server payloads, cwd, paths, or preflight tokens.
  Logout may call only `account/logout` under the separate
  `CODEX_APP_PORT_ALLOW_ACCOUNT_LOGOUT=1` gate. The protected immediate login
  response may return only a sanitized device code, a verified OpenAI/ChatGPT
  HTTPS verification URL, and the opaque cancel reference. All account
  login/cancel/credits-nudge/reset-credit-consume/logout preflight and execution
  responses are constrained by route-specific nested response schemas. Histories and action
  audit records must not return device codes, verification URLs, login IDs,
  cancel references, OAuth URLs, auth tokens, account identifiers, email addresses, raw
  app-server payloads, cwd, paths, or preflight tokens; linking, callback
  handling, and token access remain blocked.
- Browser-facing account login/cancel/credits-nudge/reset-credit-consume/logout
  history may expose only capped process-local metadata for auth actions already
  performed through this server: workspace label/id, action type/method, result
  status or bounded outcome, token-consumed state, audit flags, and redaction
  flags. It must not expose idempotency keys, quota values, rate-limit IDs,
  balances, auth tokens, account identifiers, auth URLs, login IDs, cancel
  references, preflight tokens, cwd, paths, raw intents, intent hashes, raw
  app-server payloads, or enable additional auth mutations.
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
- Browser-facing shared plugin checkout preflight and execution responses are
  constrained by route-specific nested response-key schemas. The execution
  route may call `plugin/share/checkout` only when
  `CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_CHECKOUT=1` is set, after rebuilding the
  matching preflight, requiring an exact
  `CODEX_APP_PORT_PLUGIN_SHARE_CHECKOUT_ALLOWLIST` remote-plugin-id match, and
  consuming the one-time local token. Execution must pass only
  `{remotePluginId}` to app-server. Browser responses and action audit records
  may expose only target length, allowlist status, response shape, and
  field-presence booleans; they must not return remote plugin ids,
  marketplace/plugin names, paths, versions, secrets, preflight tokens, raw
  request bodies, or raw app-server payloads.
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
- Browser-facing Git branch, commit, and worktree POST responses must remain
  constrained by route-specific nested response schemas for workspace,
  app-server, action, target/source/branch, status, safety, subprocess, policy,
  result/message, and preflight scope summaries, so unexpected sanitized-looking
  Git metadata fails closed before reaching the browser.
- Project discovery must be opt-in, capped, shallow, and server-side only. The
  browser may receive opaque workspace ids and basename labels, but never
  arbitrary path selection or discovered absolute paths.
- URL handler registration must be user-scoped and opt-in. It may register only
  `codex-app-port://`, must reject auth/callback parameters and the official
  `codex://` scheme, and must not start app-server, model traffic, shell
  commands, or host-wide registration. Local scheme destinations may map only to
  audited loopback UI fragments, and official deep-link parameters that can carry
  prompts, paths, origin URLs, marketplace/plugin targets, pet metadata, or auth
  data must fail closed without echoing values.
- App-server response handling must pass through maintained protocol contracts
  before browser-facing sanitizers rely on the shape of a payload.
- Do not silently widen Codex permissions beyond the user's configured policy.
- Do not store secrets in repo files, logs, screenshots, or generated build
  manifests.
- Do not register URL handlers without validating expected schemes and callback
  handling.
- URL handler validation must reject callback/auth parameters and stay blocked
  until desktop registration and callback behavior are explicitly audited.
  Registered local mode must still reject unknown parameters before opening a
  browser target.
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

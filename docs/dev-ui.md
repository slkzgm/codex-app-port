# Local Dev UI

Run:

```sh
npm run dev
```

The server binds to `127.0.0.1` by default and serves:

- `/`: dependency-free local UI
- `/api/workspaces`: sanitized workspace allowlist, with ids and labels only
- `/api/status`: sanitized read-only `codex app-server` probe
- `/api/thread-detail`: sanitized metadata timeline for one local thread
- `/api/thread-transcript`: bounded sanitized transcript text for one thread
- `/api/thread-changes`: bounded sanitized file-change metadata and diff
  previews for one thread
- `/api/thread-search`: disabled-by-default server-side search with
  suffix/count-only results when explicitly enabled
- `/api/thread-metadata-update-preflight`: local-only metadata update
  validation for selected threads, with execution blocked and branch/origin/SHA
  values omitted
- `/api/thread-resume-inject-preflight`: local-only `thread/resume` and
  `thread/inject_items` validation for selected threads, with execution blocked
  and thread content, paths, full ids, argument text, and raw payloads omitted
- `/api/thread-realtime-preflight`: local-only `thread/realtime/start`,
  `appendAudio`, `appendText`, `appendSpeech`, and `stop` validation for
  selected threads, with execution blocked and prompt text, audio data, text,
  SDP, session ids, paths, full ids, and raw payloads omitted
- `/api/thread-guardian-preflight`: local-only `thread/increment_elicitation`,
  `thread/decrement_elicitation`, and `thread/approveGuardianDeniedAction`
  validation for selected threads, with execution blocked and guardian event
  details, paths, full ids, argument text, and raw payloads omitted
- `/api/thread-turn-items`: disabled-by-default paged turn-item metadata with
  text, commands, output, patches, paths, cursors, and full ids omitted
- `/api/git-worktree`: sanitized read-only Git metadata for the selected
  workspace
- `/api/git-branch-preflight`: validates a branch-switch target from the
  read-only inventory while keeping execution blocked
- `/api/git-branch-switch`: opt-in real branch switch behind
  `CODEX_APP_PORT_ALLOW_GIT_BRANCH_SWITCH=1`, a matching one-time preflight
  token, clean-worktree checks, and zero switch-safety risks
- `/api/git-branch-create-preflight` and `/api/git-branch-create`: opt-in local
  branch ref creation behind a matching one-time preflight token
- `/api/git-branch-delete-preflight` and `/api/git-branch-delete`: opt-in local
  non-current loose-ref deletion behind a matching one-time preflight token
- `/api/git-commit-preflight` and `/api/git-commit`: local commit-message and
  status validation, plus opt-in commit creation behind
  `CODEX_APP_PORT_ALLOW_GIT_COMMIT=1` and a matching one-time preflight token
- `/api/git-worktree-preflight` and `/api/git-worktree-action`: local Git
  worktree create/remove validation plus opt-in execution behind
  `CODEX_APP_PORT_ALLOW_GIT_WORKTREE=1` and a matching one-time preflight token
- `/api/settings-integrations`: read-only Settings/Auth/Apps/MCP/Skills/Plugins
  boundary; optional counts-only integration inventory when explicitly enabled;
  sanitized integration lifecycle state/count/latest-action metadata without
  tokens, names, targets, arguments, paths, URLs, or raw payloads; non-approval
  server requests and sensitive server notifications are exposed only as
  fail-closed method/category counts and redaction flags
- `/api/thread-realtime-voices`: disabled-by-default enum-only
  `thread/realtime/listVoices` bridge for supported realtime voice names
- `/api/fs-directory`: disabled-by-default workspace-relative
  `fs/getMetadata` + `fs/readDirectory` bridge with hidden/symlink/path
  redaction
- `/api/fs-read-file-preflight`: local-only blocked `fs/readFile` preflight
  that validates path shape without filesystem reads, app-server traffic,
  paths, basenames, contents, or `dataBase64`
- `/api/fs-watch-preflight`: local-only blocked `fs/watch` / `fs/unwatch`
  preflight that validates path/watch-id shape without watchers, app-server
  traffic, canonical paths, watch ids, handles, or notifications
- `/api/fuzzy-file-search-preflight`: local-only blocked
  `fuzzyFileSearch/sessionStart|sessionUpdate|sessionStop` preflight that
  validates roots/query/session-id shape without search sessions, results,
  paths, file names, notifications, or app-server traffic
- `/api/account-login-preflight` and `/api/account-login-start`: local auth
  login confirmation plus opt-in app-server `account/login/start` device-code
  flow behind `CODEX_APP_PORT_ALLOW_ACCOUNT_LOGIN=1` and a matching one-time
  preflight token; the protected immediate response may show the device code and
  verified OpenAI/ChatGPT HTTPS verification URL plus an opaque cancel
  reference, while history and audit omit device codes, verification URLs,
  login IDs, cancel references, auth URLs, tokens, raw payloads, cwd, and paths
- `/api/account-login-cancel-preflight` and `/api/account-login-cancel`: local
  auth-flow cancel confirmation plus opt-in app-server `account/login/cancel`
  behind `CODEX_APP_PORT_ALLOW_ACCOUNT_LOGIN_CANCEL=1`; the route accepts only
  the opaque process-local cancel reference from the immediate login response
  plus a matching one-time preflight token, keeps the private app-server
  `loginId` server-side, and returns no login reference, login ID, auth URL,
  token, account identifier, raw payload, cwd, or path
- `/api/account-logout-preflight` and `/api/account-logout`: local auth logout
  confirmation plus opt-in app-server `account/logout` behind
  `CODEX_APP_PORT_ALLOW_ACCOUNT_LOGOUT=1` and a matching one-time preflight
  token; responses omit tokens, account identifiers, URLs, raw payloads, cwd, and
  paths, while `/api/settings-integrations` shows only capped sanitized logout
  history metadata
- `/api/mcp-tool-preflight`: local MCP tool-call validation with invocation
  blocked and server/tool/argument text omitted from responses
- `/api/mcp-tool-call`: opt-in MCP tool invocation behind
  `CODEX_APP_PORT_ALLOW_MCP_TOOL_CALL=1`, exact
  `CODEX_APP_PORT_MCP_TOOL_ALLOWLIST=server/tool`, an 8-character thread
  suffix, and a matching one-time preflight token; responses and audit records
  return only result counts and omit server/tool names, arguments, thread ids,
  output, structured content, paths, tokens, and raw payloads
- `/api/mcp-server-reload-preflight` and `/api/mcp-server-reload`: local
  confirmation plus opt-in `config/mcpServer/reload` behind
  `CODEX_APP_PORT_ALLOW_MCP_SERVER_RELOAD=1`; responses and audit records
  return only reload status/shape counts and omit names, config paths, command
  details, tokens, and raw payloads
- `/api/mcp-resource-preflight`: local MCP resource-read validation with
  resource URI/content omitted and app-server resource reads blocked by default
- `/api/mcp-resource-read`: opt-in MCP resource read behind
  `CODEX_APP_PORT_ALLOW_MCP_RESOURCE_READ=1` plus a matching one-time preflight
  token; responses and audit records return only content counts and omit URIs,
  MIME types, content, server names, paths, tokens, and raw payloads
- `/api/plugin-read-preflight`: local plugin detail-read validation with
  plugin/marketplace/argument text omitted and app-server plugin reads blocked
- `/api/plugin-read`: opt-in plugin detail read behind
  `CODEX_APP_PORT_ALLOW_PLUGIN_READ=1` plus a matching one-time preflight
  token; responses and audit records return only plugin structure counts and
  omit plugin names, marketplace names, ids, paths, URLs, descriptions, hook
  keys, skill content, MCP server names, share context, tokens, and raw payloads
- `/api/plugin-install-preflight`: local-only `plugin/install` validation with
  target/argument counts and install-risk booleans only; no download, install,
  external-code materialization, app-server traffic, or execution route
- `/api/plugin-uninstall-preflight` and `/api/plugin-uninstall`: opt-in
  `plugin/uninstall` behind `CODEX_APP_PORT_ALLOW_PLUGIN_UNINSTALL=1`, an
  exact `CODEX_APP_PORT_PLUGIN_UNINSTALL_ALLOWLIST` plugin-id match, and a
  matching one-time preflight token; responses and audit records return only
  target length and response-shape counts and omit plugin ids/names, paths,
  URLs, tokens, and raw payloads
- `/api/plugin-share-checkout-preflight` and `/api/plugin-share-checkout`:
  opt-in `plugin/share/checkout` behind
  `CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_CHECKOUT=1`, an exact
  `CODEX_APP_PORT_PLUGIN_SHARE_CHECKOUT_ALLOWLIST` remote-plugin-id match, and
  a matching one-time preflight token; execution sends only `{remotePluginId}`,
  returns only allowlist/target/response-shape metadata, and omits remote
  plugin ids, marketplace/plugin names, paths, versions, tokens, and raw
  payloads
- `/api/plugin-share-action-preflight`: local-only validation for
  `plugin/share/save`, `plugin/share/updateTargets`, and `plugin/share/delete`;
  it returns only target/argument counts, URL/path/secret-like counters,
  share-target/principal counters, and field-presence booleans, with no
  app-server traffic, no share mutation route, and no plugin names, principal
  ids, principals, paths, URLs, secrets, target/argument text, or raw payloads
- `/api/external-config-import-preflight`: local-only validation for
  `externalAgentConfig/import`; it returns only target/argument counts,
  URL/path/secret-like counters, and migration item/plugin/marketplace/session/
  command/hook/MCP/subagent counters, with no app-server traffic, no import
  route, and no migration item echo, plugin names, marketplace names, session
  titles, commands, hook commands, MCP server names, subagent names, paths,
  URLs, secrets, target/argument text, or raw payloads
- `/api/review-feedback-preflight`: local-only validation for `review/start`
  and `feedback/upload`; it returns only target/argument counts, review
  target/delivery/thread-id presence, feedback classification/reason/log/tag
  counters, and URL/path/secret-like counters, with no app-server traffic, no
  review or feedback route, and no thread ids, branches, SHAs, titles,
  instructions, feedback reason, log paths, tags, URLs, secrets,
  target/argument text, or raw payloads
- `/api/memory-reset-preflight`: local-only validation for `memory/reset`; it
  accepts no browser params, never deletes memories, never touches app-server,
  and returns no memory files, memory content, memory paths, secrets, or raw
  payloads
- `/api/plugin-content-preflight`: local plugin skill/share-list validation
  with skill text, sharing state, plugin/marketplace text, and app-server reads
  blocked
- `/api/plugin-content-read`: opt-in plugin skill/share-list read behind
  `CODEX_APP_PORT_ALLOW_PLUGIN_CONTENT_READ=1` for `plugin/skill/read` or
  `CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_LIST=1` for `plugin/share/list`, plus a
  matching one-time preflight token; responses and audit records return only
  skill content counts or share item counts and omit skill text, sharing URLs,
  principals, names, ids, paths, descriptions, tokens, and raw payloads
- `/api/skills-config-preflight` and `/api/skills-config-write`: opt-in
  `skills/config/write` behind `CODEX_APP_PORT_ALLOW_SKILLS_CONFIG_WRITE=1`
  plus a matching one-time preflight token; execution accepts only a safe skill
  name and `{"enabled":boolean}`, rejects paths/unknown keys before app-server
  traffic, and returns only counts plus the effective enabled boolean
- `/api/skills-extra-roots-clear-preflight` and
  `/api/skills-extra-roots-clear`: opt-in `skills/extraRoots/set` clear action
  behind `CODEX_APP_PORT_ALLOW_SKILLS_EXTRA_ROOTS_CLEAR=1` plus a matching
  one-time preflight token; execution accepts no browser roots, paths, or
  arguments and sends only `{"extraRoots":[]}`, returning status/count/shape
  metadata only
- `/api/remote-control-disable-preflight` and `/api/remote-control-disable`:
  opt-in defensive `remoteControl/disable` behind
  `CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_DISABLE=1` plus a matching one-time
  preflight token; execution accepts no browser remote-control params and sends
  `null`, returning status/count/shape metadata only without identities
- `/api/remote-control-enable-preflight`: local-only `remoteControl/enable`
  validation; it accepts draft JSON params for count-only analysis, including
  optional `ephemeral`, but has no execution route, no app-server traffic, no
  relay enrollment, no pairing code creation, and no identity/status/argument
  echo
- `/api/remote-control-pairing-preflight`: local-only
  `remoteControl/pairing/start` and `remoteControl/pairing/status` validation;
  it accepts draft JSON params for count-only analysis, including `manualCode`,
  `pairingCode`, and `manualPairingCode` presence, but has no execution route,
  no app-server traffic, no pairing-code creation, no pairing-status polling,
  and no code, claim-state, controller, identity, status, or argument echo
- `/api/remote-control-clients`,
  `/api/remote-control-client-revoke-preflight`, and
  `/api/remote-control-client-revoke`: opt-in remote connection inventory and
  revoke. Listing is gated by
  `CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_LIST=1`, resolves the environment
  server-side, and returns only opaque `remoteclientref-*` selectors plus counts
  and presence booleans. Revoke is separately gated by
  `CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_REVOKE=1`, consumes a matching
  one-time preflight token, resolves the real ids only from the server-side ref
  registry, and writes sanitized action audit metadata without returning ids,
  names, device metadata values, cursors, tokens, or raw payloads.
- `/api/environment-add-preflight` and `/api/environment-add`: opt-in
  `environment/add` behind `CODEX_APP_PORT_ALLOW_ENVIRONMENT_ADD=1`, an exact
  `CODEX_APP_PORT_ENVIRONMENT_ADD_ALLOWLIST` `environmentId=execServerUrl`
  match, and a matching one-time preflight token; execution accepts only the
  allowlisted remote environment id and `https:`/`wss:` exec-server URL, fixes
  `connectTimeoutMs` server-side to `null`, and returns only count/shape
  metadata without ids, URLs, paths, tokens, or raw payloads
- `/api/config-value-preflight` and `/api/config-value-write`: opt-in
  `config/value/write` behind `CODEX_APP_PORT_ALLOW_CONFIG_VALUE_WRITE=1`, an
  exact `CODEX_APP_PORT_CONFIG_VALUE_WRITE_ALLOWLIST` key match, and a matching
  one-time preflight token; execution accepts only safe key paths, JSON-text
  values, and `replace`/`upsert`, forces app-server file/version selectors to
  `null`, and returns only count/shape metadata
- `/api/config-batch-preflight` and `/api/config-batch-write`: opt-in
  `config/batchWrite` behind `CODEX_APP_PORT_ALLOW_CONFIG_BATCH_WRITE=1`, exact
  `CODEX_APP_PORT_CONFIG_BATCH_WRITE_ALLOWLIST` matches for every edit key, and
  a matching one-time preflight token; execution accepts only a JSON-text array
  of up to 10 safe edits, rejects browser file/version/reload controls, forces
  app-server file/version selectors to `null` plus reload to `false`, and
  returns only edit/key/value count metadata
- `/api/experimental-feature-preflight` and `/api/experimental-feature-set`:
  opt-in `experimentalFeature/enablement/set` behind
  `CODEX_APP_PORT_ALLOW_EXPERIMENTAL_FEATURE_SET=1`, an exact
  `CODEX_APP_PORT_EXPERIMENTAL_FEATURE_ALLOWLIST` feature match, and a matching
  one-time preflight token; responses and audit records return only
  updated/enabled/disabled counts and omit feature names, enablement values,
  paths, tokens, and raw payloads
- `/api/marketplace-action-preflight`: local-only `marketplace/add`,
  `marketplace/remove`, and `marketplace/upgrade` validation with
  target/argument/source/ref/path text omitted and execution/download blocked
- `/api/integration-action-preflight`: local settings/auth/MCP/skills/plugins
  mutation validation with target/argument text omitted and mutation blocked
- `/api/terminal-actions`: read-only Terminal/Actions boundary with terminal
  writes blocked and allowlisted command/process-spawn execution visible only
  behind separate opt-ins
- `/api/terminal-command-preflight`: local command-shape validation with
  route-specific nested response schemas, execution blocked, and command text
  omitted from responses
- `/api/terminal-command`: opt-in, allowlisted `command/exec` execution after a
  matching one-time preflight token; command text, argv, cwd, stdout, and stderr
  are omitted from route-specific responses
- `/api/process-spawn-preflight`: local `process/spawn` command-shape validation
  with route-specific nested response schemas, host process execution blocked,
  and command text omitted from responses
- `/api/process-spawn`: separate opt-in, allowlisted `process/spawn` execution
  after a matching one-time preflight token; command text, argv, cwd,
  environment, process handles, stdout, and stderr are omitted from
  route-specific responses and no top-level command response key is allowed
- `/api/terminal-control-preflight`: local terminal write/resize/terminate
  validation with route-specific nested response schemas, session/input text
  omitted, and control blocked
- `/api/terminal-control`: opt-in command/exec or separately opted-in process
  terminal write/resize/terminate after a matching one-time preflight token;
  route-specific nested response schemas are enforced and session/input/output
  text and process handles are omitted from responses
- `/api/file-action-preflight` and `/api/file-action`: local file-action
  validation plus opt-in execution behind
  `CODEX_APP_PORT_ALLOW_FILE_ACTION=1` and a matching one-time preflight token;
  content and full paths are omitted from responses
- `/api/event-stream`: bounded SSE stream of sanitized app-server notifications
  and agent-message text deltas
- `/api/live-sessions`: blocked-by-default loaded-session inventory; optional
  suffix-only `thread/loaded/list` read when explicitly enabled; may reuse the
  opt-in persistent session manager
- `/api/live-session-control-preflight` and `/api/live-session-control`: local
  interrupt/unsubscribe validation plus opt-in execution behind
  `CODEX_APP_PORT_ALLOW_LIVE_SESSION_CONTROL=1`, and local steer validation plus
  separate opt-in execution behind `CODEX_APP_PORT_ALLOW_TURN_STEER=1`; both
  paths consume matching one-time preflight tokens and use route-specific nested
  response schemas, and responses omit full ids, prompt text, transcript
  content, paths, and terminal output
- `/api/live-session-bulk-control-preflight` and
  `/api/live-session-bulk-control`: separate opt-in bulk unsubscribe for loaded
  sessions behind `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` and
  `CODEX_APP_PORT_ALLOW_LIVE_SESSION_BULK_CONTROL=1`; it consumes a matching
  one-time preflight token, uses route-specific nested response schemas, and
  returns counts only, with no full ids, suffix array, prompts, thread content,
  paths, or raw app-server payload
- `/api/thread-search`: disabled-by-default app-server `thread/search` bridge
  behind `CODEX_APP_PORT_ALLOW_THREAD_SEARCH=1`; accepts the search term only
  in a strict `POST` body and returns accepted-state, counts, cursor-presence,
  and suffix/status/source metadata only, with no search term, snippets, names,
  previews, full ids, paths, cursors, thread content, or raw payloads
- `/api/execution-gate`: blocked approval/execution state with no app-server
  traffic plus a capped, sanitized process-local history of successful thread
  start/archive/delete/fork/rename/compact actions
- `/api/approval-decisions`: request-scoped browser decision intake for
  sanitized turn-session approvals, including a bounded tokenized `decisions`
  batch for queue denial and gated accept-once actions; pending managed
  approvals may be deny-forwarded only when
  `CODEX_APP_PORT_ALLOW_APPROVAL_FORWARDING=1` is explicitly enabled, and
  request-scoped accept forwarding also requires
  `CODEX_APP_PORT_ALLOW_APPROVAL_ACCEPT=1`; the queue summary is counts-only,
  and the lifecycle summary exposes only state/count/latest sanitized decision
  metadata. Both omit tokens, request keys, session ids, raw approval details,
  raw commands, paths, patches, and file contents
- `/api/turn-preflight`: local validation for a drafted turn, with execution
  blocked
- `/api/thread-start-preflight` and `/api/thread-start`: local thread creation
  validation plus opt-in app-server `thread/start` behind
  `CODEX_APP_PORT_ALLOW_THREAD_START=1` and a matching one-time preflight
  token; responses omit full ids, cwd, paths, prompts, and instruction sources
- `/api/thread-archive-preflight` and `/api/thread-archive-action`: local
  archive/unarchive validation plus opt-in app-server `thread/archive` or
  `thread/unarchive` behind `CODEX_APP_PORT_ALLOW_THREAD_ARCHIVE=1` and a
  matching one-time preflight token; responses omit full ids, names, previews,
  cwd, paths, and conversation content
- `/api/thread-delete-preflight` and `/api/thread-delete-action`: local
  destructive delete validation plus opt-in app-server `thread/delete` behind
  `CODEX_APP_PORT_ALLOW_THREAD_DELETE=1` and a matching one-time preflight
  token; responses omit full ids, names, previews, cwd, paths, conversation
  content, raw app-server payloads, and preflight tokens
- `/api/thread-fork-preflight` and `/api/thread-fork-action`: local fork
  validation plus opt-in app-server `thread/fork` behind
  `CODEX_APP_PORT_ALLOW_THREAD_FORK=1` and a matching one-time preflight token;
  execution resolves the source suffix through `thread/list`, sends only
  `threadId` plus `excludeTurns: true`, and omits full ids, names, previews,
  cwd, paths, conversation content, raw app-server payloads, and preflight
  tokens
- `/api/thread-rename-preflight` and `/api/thread-rename-action`: local rename
  validation plus opt-in app-server `thread/name/set` behind
  `CODEX_APP_PORT_ALLOW_THREAD_RENAME=1` and a matching one-time preflight
  token; responses omit the name text, full ids, previews, cwd, paths,
  conversation content, raw app-server payloads, and preflight tokens
- `/api/thread-rollback-preflight` and `/api/thread-rollback-action`: local
  rollback validation plus opt-in app-server `thread/rollback` behind
  `CODEX_APP_PORT_ALLOW_THREAD_ROLLBACK=1` and a matching one-time preflight
  token; execution resolves the suffix through `thread/list`, sends only
  `threadId` plus bounded `numTurns`, and omits full ids, names, previews, cwd,
  paths, conversation content, raw app-server payloads, and preflight tokens
- `/api/thread-safety-lock-preflight` and `/api/thread-safety-lock-action`:
  local safety-lock validation plus opt-in app-server `thread/settings/update`
  behind `CODEX_APP_PORT_ALLOW_THREAD_SAFETY_LOCK=1` and a matching one-time
  preflight token; execution resolves the suffix through `thread/list`, sends
  only fixed safe settings (`on-request`, `user`, read-only sandbox, network
  disabled), and omits full ids, cwd, paths, settings payloads, raw app-server
  payloads, and preflight tokens
- `/api/thread-compact-preflight` and `/api/thread-compact-start`: local
  compaction validation plus opt-in persistent app-server
  `thread/compact/start` behind `CODEX_APP_PORT_ALLOW_THREAD_COMPACT=1`,
  `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1`, and a matching one-time preflight
  token; responses mark model traffic but omit prompt text, full ids, cwd,
  paths, and conversation content
- `/api/turn-start`: local validation by default, then a hard `403` execution
  block; real starts require `CODEX_APP_PORT_ALLOW_TURN_START=1` and a matching
  one-time turn-preflight token; `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` can
  route the started turn through a persistent per-workspace app-server client
- `/api/turn-sessions`: read-only in-memory ledger of sanitized opt-in
  turn-start records with bounded sanitized live event snapshots

The server refuses non-loopback hosts unless
`CODEX_APP_PORT_ALLOW_NON_LOOPBACK=1` is set. The API uses the same read-only
probe as `npm run smoke:app-server`; it does not start turns, execute commands,
install packages, or expose full thread ids, names, previews, or absolute
workspace paths. `/api/status` accepts only workspace ids returned by
`/api/workspaces`; browser-provided filesystem paths are rejected.
Browser-facing JSON `POST` routes use strict request-body contracts: unsupported
fields are rejected before probes, app-server calls, filesystem access, token
consumption, or audit-log writes, and errors do not echo field names or values.
The allowed field sets live in the immutable `BROWSER_POST_BODY_CONTRACTS`
registry; route handlers fail closed if their local strict-reader field list
drifts from the audited contract. Each allowed field also maps to an immutable
`BROWSER_POST_FIELD_POLICIES` entry with accepted JSON types, generic size
limits, NUL rejection, sensitivity labels, and `returnedRawValue: false`
metadata before route-specific validation runs. The dynamic preflight-confirm
route declares its union of possible fields in the same registry and narrows
them by `actionType` before consuming a token.
`BROWSER_POST_RESPONSE_CONTRACTS` also guards audited `POST` responses before
they are written: unsafe token strings, secret patterns, NUL text,
absolute-path-like values, and unexpected top-level response keys fail closed to
a generic error, with only the intended `preflight.token` issue path allowed for
preflight routes. Each audited route also uses its own top-level response-key
allowlist, so keys from unrelated routes, such as MCP tool-call metadata on a
turn preflight, are rejected before reaching the browser.
The same response contract rejects truthy sensitive redaction flags like
`pathsReturned`, `rawPayloadReturned`, `tokensReturned`, `textReturned`,
`stdoutReturned`, and `threadContentReturned`; protected auth/device-code return
flags remain explicitly allowed for the immediate local UI response.
It also rejects forbidden nested raw-data keys such as `rawPayload`, `rawText`,
`rawCommandText`, `cwd`, `path`, `accessToken`, and `structuredContent`, while
leaving sanitized summary keys and intentionally protected auth URLs to their
route-specific policies.
The turn-start and approval-decision routes plus high-risk MCP tool-call
preflight/execution, MCP resource-read execution, MCP OAuth-login
preflight/execution, MCP server-reload preflight/execution, skills-config
preflight/execution, config-value preflight/execution, config-batch
preflight/execution, experimental-feature preflight/execution,
Git branch/commit/worktree preflight/execution, file-action
preflight/execution, action-preflight confirmation, and generic integration
mutation preflight routes
additionally have route-specific nested key schemas for their sanitized
turn/probe/event, decision/queue/history, target, argument/risk, result, policy,
Git status/safety/subprocess, file metadata/content/filesystem, and preflight
objects so unexpected sanitized-looking fields fail closed before the response
reaches the browser.
App-server responses are first normalized through local runtime protocol
contracts for the methods this prototype uses, then reduced again by
browser-facing sanitizers.
`/api/status` reads both active and archived `thread/list` metadata with
`useStateDbOnly: true`; the UI can filter the sanitized rows locally and opt in
to showing archived rows. `/api/thread-detail` reads the selected thread with `thread/read`, but returns
only metadata such as turn ids suffixes, statuses, item types, counts, and text
lengths. It does not return prompt text, assistant text, thread titles,
previews, file paths, command strings, or raw item payloads.
`/api/thread-transcript` is the separate text surface. It also uses
`thread/read`, but returns only user/assistant message text, bounded by server
limits, with path-like strings redacted and non-conversation items excluded.
It does not expose raw app-server payloads, file-change paths, thread titles,
or previews.

`/api/thread-changes` is the first review-workflow surface. It also uses
`thread/read`, but returns only item/change counts, statuses, small line-count
metadata when present, file basenames, and bounded diff previews. Diff preview
text is ASCII-normalized, path-redacted, secret-pattern-redacted, line-capped,
and char-capped before it reaches the browser. The route does not return
complete paths, unbounded raw patch payloads, file contents, command strings,
thread titles, or previews. The route is intentionally not an approval surface
yet.
`/api/thread-search` is the separate server-side search surface for past
threads. It is disabled unless `CODEX_APP_PORT_ALLOW_THREAD_SEARCH=1` is set
before server startup. When enabled, it calls only `thread/search` with a
validated workspace, bounded search term, optional archived filter, and capped
limit. The browser receives only accepted-state, search-term length/line counts,
result counts, cursor-presence booleans, and per-result suffix/status/source
metadata. It does not receive the search term, snippets, thread names,
previews, full ids, cwd/path values, cursors, raw thread payloads, or raw
app-server payloads.

`/api/thread-goal` is the separate goal-state read surface for selected
threads. It is disabled unless `CODEX_APP_PORT_ALLOW_THREAD_GOAL=1` is set
before server startup. When enabled, it resolves the selected thread by suffix
through `thread/list` and calls only `thread/goal/get`. The browser receives
goal presence/status, token/time usage, token budget presence/value, and
objective length/line counts. It does not receive objective text, full ids,
exact goal timestamps, cwd/path values, raw thread payloads, or raw app-server
payloads.

The same thread panel also exposes explicit goal mutation controls:
`Goal Set Check`, `Set Goal`, `Goal Clear Check`, and `Clear Goal`.
`/api/thread-goal-set-action` is disabled unless
`CODEX_APP_PORT_ALLOW_THREAD_GOAL_SET=1` is set before server startup, and
`/api/thread-goal-clear-action` is disabled unless
`CODEX_APP_PORT_ALLOW_THREAD_GOAL_CLEAR=1` is set. Both routes require a
matching one-time preflight token, resolve the selected thread by suffix
through `thread/list`, and return only suffix/status/count metadata. Objective
text is accepted only as bounded input for set; it is not returned to the
browser or written to sanitized action-audit records.

The thread panel also exposes `Memory Check` and `Set Memory` controls for
`thread/memoryMode/set`. The action route is disabled unless
`CODEX_APP_PORT_ALLOW_THREAD_MEMORY_MODE_SET=1` is set before server startup.
It requires a one-time preflight token, accepts only `enabled` or `disabled`,
resolves the selected thread by suffix through `thread/list`, and displays only
mode/status metadata.

The same panel exposes `Metadata Check` for `thread/metadata/update`. It is
local-only: the route validates only a selected thread suffix and optional
`gitInfo` branch/origin/SHA JSON shape, rejects unsupported keys and unsafe
values, keeps execution blocked, and displays only count/presence metadata.
It does not touch app-server, mutate metadata, or return full ids, branch
names, origin URLs, SHAs, paths, secrets, argument text, or raw payloads.

`/api/thread-turns` is the separate paged-turn metadata surface for selected
threads. It is disabled unless `CODEX_APP_PORT_ALLOW_THREAD_TURNS=1` is set
before server startup. When enabled, it resolves the selected thread by suffix
through `thread/list` and calls only `thread/turns/list` with
`itemsView:notLoaded`. The browser receives turn counts, status metadata,
cursor-presence booleans, and redaction flags. It does not receive item
content, cursor values, full ids, exact turn timestamps, cwd/path values, raw
thread payloads, or raw app-server payloads.

`/api/thread-turn-items` is the separate paged item metadata surface for a
selected thread and turn. It is disabled unless
`CODEX_APP_PORT_ALLOW_THREAD_TURN_ITEMS=1` is set before server startup. When
enabled, it resolves the thread suffix through `thread/list`, resolves the turn
suffix through `thread/turns/list` with `itemsView:notLoaded`, and calls only
`thread/turns/items/list` with a capped page size. The browser receives item
suffixes, types, status/phase labels, text-length/count metadata, content type
labels, change counts, cursor-presence booleans, and redaction flags. It does
not receive message text, user prompts, command text, stdout/stderr or
aggregated output, patches, file paths, cursor values, full ids, timestamps,
raw item payloads, raw thread payloads, or raw app-server payloads.

`/api/thread-realtime-voices` is the separate realtime voice catalog surface.
It is disabled unless `CODEX_APP_PORT_ALLOW_THREAD_REALTIME_VOICES=1` is set
before server startup. When enabled, it calls only
`thread/realtime/listVoices` with an empty parameter object and filters the
response to the exact voice enum from the generated official schema. The
browser may receive known voice names and default voice names only. It does not
accept browser parameters, start realtime sessions, send audio/text/speech,
touch threads, trigger model traffic, or return paths, ids, raw payloads, SDP,
audio, transcript content, or unknown voice strings.

`/api/fs-directory` is the separate app-server filesystem directory metadata
surface. It is disabled unless `CODEX_APP_PORT_ALLOW_FS_DIRECTORY=1` is set
before server startup. The browser may send only a workspace-relative directory
path; absolute paths, traversal, dotfiles, `.git`, lockfiles, and path-like
segments are rejected before app-server traffic. When enabled, the server
locally verifies that the workspace path and every requested path segment are
non-symlink directories, then calls only `fs/getMetadata` and
`fs/readDirectory` with the server-resolved absolute path. The browser receives
bounded direct child names plus file/directory booleans, target depth,
entry/type counts, and redaction flags. It does not receive absolute paths,
relative paths, timestamps, file contents, symlink targets, dotfile entries,
hidden entries, token-like names, URLs, raw filesystem payloads, or raw
app-server payloads.

`/api/fs-read-file-preflight` is the intentionally blocked `fs/readFile`
surface. The browser can submit only a workspace-relative visible path for
local shape validation. The route rejects absolute paths, drive roots,
traversal, hidden paths, `.git`, lock files, and NUL/duplicate-separator input,
then returns only path character count, path depth, blocked execution flags,
and content-redaction booleans. It does not resolve the path, check existence,
follow symlinks, read file content, call app-server, or return the path,
basename, file bytes, `dataBase64`, raw payload, or any execution route.

`/api/fs-watch-preflight` is the intentionally blocked `fs/watch` /
`fs/unwatch` surface. The browser can submit `fs/watch` with a
workspace-relative visible path and a bounded safe watch id, or `fs/unwatch`
with only the watch id. The route rejects absolute paths, drive roots,
traversal, hidden paths, `.git`, lock files, path-bearing unwatch requests, and
unsafe watch ids. It returns only path depth/count, watch-id length, blocked
execution flags, and notification-redaction booleans. It does not resolve
paths, check existence, follow symlinks, start or stop watchers, subscribe to
`fs/changed`, call app-server, or return paths, canonical paths, basenames,
watch ids, watcher handles, notifications, raw payloads, or any execution
route.

`/api/fuzzy-file-search-preflight` is the intentionally blocked fuzzy file
search surface. The browser can submit method-specific draft params for
`sessionStart`, `sessionUpdate`, or `sessionStop`; the server validates only
workspace-relative visible roots, query length, and safe session-id shape. The
route rejects absolute roots, traversal, hidden roots, `.git`, lock files,
roots on update/stop, and query text on start/stop. It returns only root count,
root character count, query character count, session-id length, blocked
execution flags, and result/notification redaction booleans. It does not start,
update, or stop fuzzy-search sessions, call app-server, or return roots,
queries, session ids, file names, paths, scores, match indices, notifications,
or raw payloads.

Every `/api/*` route also requires a per-process session token. The server
injects this token into the served HTML and the browser sends it back in the
`X-Codex-App-Port-Token` header. The token is not stored on disk and is meant to
block unrelated local web pages from calling the loopback API.

The event stream is deliberately short-lived. The server caps stream duration
at 60 seconds and the UI currently asks for a 15 second window. The stream only
performs the `initialize` / `initialized` lifecycle and emits sanitized
notification metadata plus bounded `item/agentMessage/delta` and assistant
`thread/realtime/transcript/delta` text. Live text is path-redacted,
secret-pattern-redacted, and char-capped. Reasoning text, command/process
output, file-change output, user transcript deltas, prompts, and raw transcript
payloads are not returned. When a thread is selected, the UI adds the selected
8-character suffix as a stream filter; the server validates it before opening
SSE and drops unrelated notifications after sanitation.

The live-sessions endpoint is fail-closed by default and does not touch
`codex app-server`. When the server is started with
`CODEX_APP_PORT_ALLOW_LOADED_SESSIONS=1`, it may call `thread/loaded/list` with
a bounded limit. The response is suffix-only: loaded thread count, returned
suffix count, pagination state, and short thread id suffixes. Full ids, prompts,
thread titles, transcript text, paths, terminal output, command output, and
session control methods are not returned or accepted.
The same response also includes a capped process-local history of recent
live-session controls already performed through this server. That history is
metadata-only: action, method, thread/turn suffixes, prompt counts, result
status, loaded-session count, and token-consumption flags. It never returns
preflight tokens, prompt text, full ids, paths, or thread content.
The response also carries a sanitized lifecycle summary for UI state:
blocked/idle/active/history-only state, loaded/control counts, available control
preflight, explicit interrupt/unsubscribe/steer gate status, and whether steer
would be a model-traffic control. It also reports recent interrupt,
unsubscribe, steer, and bulk-unsubscribe counts, succeeded/failed control
counts, and the latest control as method/status/suffix/count metadata only. It
now includes an active-session operations summary for the UI: suffix-only
inventory visibility, single-session control count/enabled count, bulk-control
count/enabled count, session-manager routing, model-traffic-control state, and
one-time preflight requirement. That summary is derived only from lifecycle
counts and gate flags.
does not return raw session identifiers, prompt text, preflight tokens, paths,
thread content, terminal output, command output, or raw app-server payloads.

Live-session control uses a separate preflight/action pair and remains blocked
unless the action-specific opt-in is present at server start.
`CODEX_APP_PORT_ALLOW_LIVE_SESSION_CONTROL=1` enables `turn/interrupt` and
`thread/unsubscribe`; `CODEX_APP_PORT_ALLOW_TURN_STEER=1` separately enables
`turn/steer` because it forwards user-authored text and is marked as model
traffic. The action consumes a matching one-time preflight token, resolves only
supplied 8-character suffixes against loaded-session/thread metadata, and
returns method, status, suffix, and count metadata. Steer responses return
prompt character/line counts only, never prompt text, full ids, transcript
content, paths, terminal output, or command output.
Successful controls are appended to the same sanitized recent-control history
used by `/api/live-sessions`, so the UI can show the active-session lifecycle
without replaying prompts or exposing raw session identifiers.
Bulk unsubscribe uses its own preflight/action pair:
`/api/live-session-bulk-control-preflight` and
`/api/live-session-bulk-control`. It is disabled unless the persistent session
manager and `CODEX_APP_PORT_ALLOW_LIVE_SESSION_BULK_CONTROL=1` are both enabled,
supports only `thread/unsubscribe` across the loaded-session list, and reports
only loaded/attempted/succeeded/failed counts. It never returns a thread suffix
array, full ids, prompt text, transcript content, paths, terminal output, or raw
app-server payloads.
When launched through `scripts/dev-server.mjs`, successful controls are also
written to a sanitized append-only action audit log under the user state
directory by default, or to `--action-audit-log` /
`CODEX_APP_PORT_ACTION_AUDIT_LOG` when configured. The same log covers thread
archive/unarchive actions, thread deletion, thread forking, thread renaming, thread compaction starts, background terminal
cleanup, and local file actions. The server checks that log is appendable before
the app-server or local filesystem mutation and logs only metadata: action,
method, thread/turn suffixes, prompt/content counts, result status, method names, and
preflight-consumption flags. Prompt text, file
contents, preflight tokens, full ids, paths, file basenames, terminal output,
thread content, and the audit path are not returned or logged.
When `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` is also set, loaded-session
inventory and live-session control reuse the same persistent per-workspace
app-server client as opt-in turn-start instead of spawning separate probes.

The Git worktree endpoint reads only metadata files under the selected
allowlisted workspace, including bounded local branch refs, `packed-refs`, and
linked-worktree `HEAD` files. It also performs a bounded best-effort
`.git/index` status scan using mtime/size metadata and top-level untracked
counts. It does not execute `git`, does not follow symlinked `.git` entries,
does not follow linked-worktree `gitdir:` targets, does not read file contents,
and does not expose remote URLs or absolute paths. Status mutation and worktree
mutation actions remain blocked.

The git-branch-preflight endpoint accepts only `POST`, requires the local
session token, and validates that the requested branch exists in the read-only
branch inventory. It returns the target branch name, short commit, and aggregate
status counts. It also returns path-free switch-safety counts for hook files,
filter config sections, attributes files, and local `core.hooksPath` /
`core.fsmonitor` config, because real checkout/switch could otherwise trigger
local hooks, content filters, or configured helper execution. It does not execute
`git`, write the worktree, change HEAD, or expose file names, paths, remotes, or
unknown branch input.

The git-branch-switch endpoint is disabled by default. When
`CODEX_APP_PORT_ALLOW_GIT_BRANCH_SWITCH=1` is set, it consumes the matching
one-time branch preflight token, revalidates the same branch intent, requires a
clean worktree and zero switch-safety counts, disables global/system Git config,
disables hooks/fsmonitor for the subprocess, and runs only `git switch
--no-guess -- <inventoried-branch>`. The browser response returns branch/status
metadata only; it does not return argv, stdout, stderr, paths, or remote URLs.
Unknown branch requests fail without echoing the requested branch. Successful
preflights issue a short-lived local token bound to a hashed intent; the raw
intent and hash are not returned.

The git-branch-create endpoint is also disabled by default. When
`CODEX_APP_PORT_ALLOW_GIT_BRANCH_CREATE=1` is set, it consumes the matching
one-time branch-create preflight token, revalidates the requested new branch
name, rejects existing branches, and writes only a new loose
`.git/refs/heads/*` ref pointing at the current HEAD. It does not execute `git`,
does not checkout files, and does not return ref paths or the full commit id.

The git-branch-delete endpoint is disabled by default. When
`CODEX_APP_PORT_ALLOW_GIT_BRANCH_DELETE=1` is set, it consumes the matching
one-time branch-delete preflight token, revalidates that the target branch is a
known non-current local branch, rejects branches checked out by linked
worktrees, and deletes only a loose `.git/refs/heads/*` ref. Packed refs are not
edited. It does not execute `git`, does not checkout files, and does not return
ref paths or full commit ids.

The git-commit-preflight endpoint accepts a draft commit message only to
validate the future commit action shape. It returns message character, line,
and subject counts plus aggregate worktree status counts. It does not echo the
message, inspect staged content, create commits, write objects, write refs,
execute `git`, or touch `codex app-server`. The response carries a local
preflight token. The `/api/git-commit` route is disabled unless
`CODEX_APP_PORT_ALLOW_GIT_COMMIT=1` is set; when enabled, it revalidates and
consumes that token, requires a current local branch, complete warning-free
status metadata, no unstaged or untracked changes, and staged changes verified
by `git diff --cached`, then runs `git commit` with hooks, GPG signing, editor
prompts, stdout, stderr, argv, stdin echo, and app-server traffic blocked from
browser responses.

The git-worktree-preflight endpoint accepts draft create/remove intent only to
validate the worktree action shape. Create intent must name a branch already
present in the read-only branch inventory; unknown branch requests fail without
echoing the requested branch. Target paths must be workspace-relative and cannot
be absolute, parent traversals, hidden paths, `.git` targets, or lock paths. The
response returns only the target basename/depth, aggregate worktree counts, and
safe branch metadata for create. The `/api/git-worktree-action` route is
disabled unless `CODEX_APP_PORT_ALLOW_GIT_WORKTREE=1` is set; when enabled, it
revalidates and consumes the token, rejects symlinked targets/parents, requires
zero hook/filter/attribute risk for create, and runs `git worktree add/remove`
without returning full paths, stdout, stderr, argv, or app-server traffic.

The settings-integrations endpoint is fail-closed by default. It reports that
sanitized `config/read` settings are available through `/api/status`, but it
does not read auth state, tokens, app/connectors, MCP servers, skills, or
plugins. It returns a local method audit for settings/auth/apps/MCP/skills/
plugins methods and keeps browser calls blocked for auth callbacks, app
linking/installs, ungated MCP tool/resource calls, ungated MCP server reloads,
config writes, ungated config-value writes, ungated config-batch writes, ungated plugin enablement writes, ungated skill config writes, plugin
installs/uninstalls/sharing, and marketplace mutations. It performs no filesystem reads, no app-server
traffic, no installs, no callbacks, and no tool invocation.
The Settings & Integrations panel has a dedicated manual refresh control and
Manual/Ready/Refreshing/Failed status. That control calls only the existing
sanitized `/api/settings-integrations` route and does not add API fields,
tokens, names, targets, argument text, resource content, skill content, URLs,
paths, secrets, or raw payloads.
The same response now includes a read-only `codexAppSettings` parity summary
for the current official Codex app Settings sections. It returns only static
section keys, section states, and counts, and keeps local setting values,
profile names, paths, URLs, secrets, raw payloads, app-server payloads, browser
handlers, and settings writes omitted. Unimplemented sections such as Computer
Use and Context-aware Suggestions are reported as blocked.
Within that summary, `keyboardShortcuts` exposes a static review-only shortcut
catalog with official shortcut keys that still need Linux implementation plus
local accessibility bindings that already exist in the UI. Custom binding
editing, reset, keystroke search, command labels, user bindings, paths, URLs,
raw payloads, and app-server traffic remain blocked.
Within that same summary, `appearance` exposes a static review-only catalog for
the official theme, color, font, and custom-theme sharing controls. The UI shows
only setting keys, groups, state/source chips, catalog counts, and redaction
chips; active theme values, color values, font names, custom theme payloads,
sharing URLs, paths, raw payloads, mutations, and app-server traffic remain
blocked.
Within that same summary, `general` exposes a static review-only catalog for
file-opening location, command-output display, terminal tab default,
multiline-prompt submission, and prevent-sleep controls. The UI shows only
setting keys, groups, state/source chips, catalog counts, and redaction chips;
current values, local file-open targets, command-output preferences, terminal
preferences, sleep-prevention state, paths, URLs, raw payloads, mutations, and
app-server traffic remain blocked.
Within that same summary, `agentConfiguration` exposes a static review-only
catalog for shared CLI/IDE configuration inheritance, in-app common controls,
advanced `config.toml` editing, Codex security reference, and config-basics
reference. The UI shows only setting keys, groups, state/source chips, catalog
counts, and redaction chips; current config values, `config.toml` content or
paths, model settings, sandbox settings, approval settings, instruction values,
security policy values, paths, URLs, raw payloads, config writes, mutations,
and app-server traffic remain blocked.
Within that same summary, `profile` exposes a static review-only catalog for
activity insights, lifetime and peak token metrics, streaks, longest task,
token activity, profile detail update surfaces, profile-card sharing, and
invitation controls. The UI shows only setting keys, groups, state/source
chips, catalog counts, and redaction chips; activity metrics, token values,
profile pictures, display names, usernames, profile cards, profile-card
sharing URLs, invitation eligibility or links, paths, URLs, raw payloads,
mutations, and app-server traffic remain blocked.
Within that same summary, `codexPets` exposes a static review-only catalog for
the official pet picker, `/pet`, Wake Pet, Tuck Away Pet, custom-pet refresh,
and `hatch-pet` install surfaces. The UI shows only setting keys, groups,
state/source chips, catalog counts, and redaction chips; selected pet values,
pet names, custom pet assets, local Codex home scans, overlay state,
active-thread overlay data, skill install/reload, slash-command execution,
paths, URLs, raw payloads, mutations, and app-server traffic remain blocked.
Within that same summary, `git` exposes a static review-only catalog for
branch-naming standardization, force-push preference, commit-message prompt, and
pull-request description prompt controls. The UI shows only setting keys,
groups, state/source chips, catalog counts, and redaction chips; branch naming
values, force-push preferences, prompt text, generated commit or pull-request
text, repository names, repository paths, remote URLs, paths, URLs, raw payloads,
mutations, and app-server traffic remain blocked.
Within that same summary, `integrationsMcp` exposes a static review-only
catalog for official external-tool MCP connections, recommended servers, custom
servers, MCP OAuth authentication, shared CLI/IDE `config.toml`, and
plugin-provided MCP servers. The UI shows only setting keys, groups,
state/source chips, catalog counts, and redaction chips; server listings,
server names, recommended or custom server names, server URLs, command details,
environment variables, bearer-token environment variables, OAuth URLs or
tokens, `config.toml` content or paths, tool names, tool allowlists, server
instructions, plugin ids, setting values, config writes, mutations, paths,
URLs, raw payloads, and app-server traffic remain blocked.
The same Settings & Integrations response also exposes `skillsPluginsCatalog`
as a static review-only Skills & Plugins catalog. The UI shows only catalog
counts, setting keys, groups, state/source chips, and redaction chips for
official Skills runtime/discovery/config metadata, official Plugin directory/
capability/permission/disable surfaces, and local preflight boundaries for
plugin install/share/marketplace/read/content/uninstall/enablement/share
checkout plus skills config/extra-roots writes. It does not show skill names,
descriptions, paths, content, scripts, metadata, dependency tools, plugin
names, ids, paths, URLs, descriptions, manifests, default prompts,
screenshots, marketplace names or sources, app names, MCP server names, hook
commands, share links or principals, setting values, external code, paths,
URLs, raw payloads, app-server traffic, installs, uninstalls, enablement writes,
skill config writes, extra-root writes, share mutations, or marketplace
mutations.
The same response exposes `codexSites` as a static review-only catalog for the
official Sites plugin. The UI shows only catalog counts, entry keys, groups,
state/source chips, and redaction chips for hosted website, web app, and game
workflows, project/version/deployment concepts, supported site shapes, D1/R2
storage guidance, workspace or external identity options, access modes, runtime
environment values, review-before-share guidance, and local high-risk
boundaries. It does not show Sites projects, project ids, `.openai/hosting.json`,
storage bindings, version ids, deployment URLs, production URLs, access modes,
audiences, user groups, environment keys or values, secrets, migrations, build
output/logs, source commits, plugin names, local paths, setting values, site
content, screenshots, raw payloads, app-server traffic, site creation, version
saving, deployment, access changes, environment/secret writes, builds, storage
provisioning, plugin installs, network access, filesystem access, or mutations.
The same response exposes `codexPermissions` as a static review-only catalog
for official Codex Permissions. The UI shows only catalog counts, entry keys,
groups, state/source chips, and redaction chips for filesystem access levels
and precedence, supported path forms, workspace-root scoping, deny exact/glob
rules, glob scan depth, network domain/proxy rules, local/private-network
guardrails, Unix socket rules, migration from older sandbox settings, built-in
profiles, `danger-full-access` caution, and managed requirements. It does not
show permission profiles, profile names, filesystem rules, paths, access
values, deny globs, glob patterns, workspace roots, network rules, domains,
proxy URLs, local/private policy values, Unix socket paths, sandbox modes,
managed requirements, `config.toml`, platform paths, setting values, profile or
rule writes, glob/workspace-root expansion, sandbox migration, network access,
filesystem access, mutations, secrets, raw payloads, or app-server traffic.
The same response exposes `automationsCatalog` as a static review-only
Automations catalog. The UI shows only catalog counts, keys, groups,
state/source chips, and redaction chips for official automation pane, Triage,
standalone/project/thread automation, custom schedule, worktree/local mode,
model/reasoning default, skills/plugins usage, prompt drafting, run review,
worktree cleanup, sandbox security, and managed requirement fallback concepts,
plus local create/update/schedule/run/triage/worktree boundaries. It does not
show automation names, run ids, run results, triage items, findings, prompt
text, schedules, cron expressions, project names, workspace or worktree paths,
model or reasoning values, skill or plugin names, sandbox/admin policy values,
app names, notification payloads, filesystem access, network access, app
control, unattended execution, schedule writes, run starts, run archives,
worktree creation, mutations, URLs, paths, raw payloads, or app-server traffic.
The same response exposes `codexAppCommands` as a static review-only catalog
for official Codex app commands. The UI shows only catalog counts, command
keys, groups, state/source chips, and redaction chips for documented keyboard
shortcuts, slash commands, deep-link destinations, and local high-risk command
boundaries. It does not show shortcut bindings, custom shortcuts, slash command
text, deep-link templates, query parameters, thread ids, prompt text, workspace
paths, origin URLs, SSH host aliases, plugin identifiers, marketplace names or
paths, pet names, pet image URLs, settings opens, browser launches, command or
slash-command execution, deep-link openings, mutations, URLs, paths, raw
payloads, or app-server traffic.
The same response exposes `codexChromeExtension` as a static review-only
catalog for the official Codex Chrome extension. The UI shows only catalog
counts, entry keys, groups, state/source chips, and redaction chips for
signed-in browser-state use cases, setup, extension permissions, website
allow/block workflows, browser history prompts, Memories/data-control
boundaries, troubleshooting, file upload file-access setup, and local high-risk
boundaries. It does not show extension state, Chrome profile data, site hosts,
allowlists, blocklists, browser history entries, page content, screenshots,
bookmarks, downloads, tab groups, permission states, memory content, plugin
names, setting values, paths, URLs, raw payloads, native host activity, Chrome
launches, installs, website allow actions, browser-history reads, file-access
enablement, network access, mutations, or app-server traffic.
The same response exposes `codexInAppBrowser` as a static review-only catalog
for the official Codex In-app Browser. The UI shows only catalog counts, entry
keys, groups, state/source chips, and redaction chips for rendered previews,
web-app debugging, visual comments, local/file/public preview targets,
unsupported auth/profile/cookie/extension/existing-tab cases, Browser Use,
website approval settings, review flows, annotation shortcuts, styling
feedback, scoped browser tasks, and developer-mode CDP boundaries. It does not
show browser state, URLs, page content, screenshots, downloads, DOM, styles,
console output, network traffic, cookies, browser profiles, extension state,
existing tabs, comment text, annotations, styling values, plugin names, setting
values, routes, visual states, site hosts, allowlists, blocklists, paths, raw
payloads, browser launches, navigation, Browser Use execution, inspection JS,
comments, styling feedback, network access, mutations, or app-server traffic.
The same response exposes `codexAppFeatures` as a static review-only catalog
for official Codex app features. The UI shows only catalog counts, feature keys,
groups, state/source chips, and redaction chips for project multitasking,
skills, automations, Local/Worktree/Cloud modes, Git/worktree/terminal
features, local environment actions, Windows sandbox, voice dictation, pop-out
windows, in-app browser, Browser Use, Computer Use, non-code artifacts, task
sidebar, IDE sync/context, thread automations, approvals/sandboxing, MCP, web
search, and image generation plus local high-risk boundaries. It does not show
project names, thread ids or content, mode selections, workspace/worktree
paths, cloud environment names, diff content, terminal output, command text,
local action definitions, voice audio, transcripts, window state, browser URLs,
browser content, browser or desktop screenshots, app identifiers, artifact
content or paths, IDE context/state, web-search queries or results, generated
images, image prompts, MCP server names, skill or automation names, setting
values, browser launch, desktop control, voice capture, model/network/
filesystem traffic, mutations, URLs, paths, raw payloads, or app-server traffic.
Within that same summary, `browser` exposes a static review-only catalog for
the official Browser plugin, Chrome extension, site permission, ask-before-use,
and full-CDP developer-mode controls. The UI shows only setting keys, groups,
state/source chips, catalog counts, and redaction chips; plugin/extension
state, allowed or blocked site lists, origins, website permission values, CDP
state, organization policy, Chrome profile data, browser launch, network
traffic, paths, URLs, raw payloads, mutations, and app-server traffic remain
blocked.
Within that same summary, `computerUse` exposes a static review-only catalog
for Computer Use availability, plugin install, system permissions, app
approval prompts, always-allow and denied app policy, Windows app policy,
locked use, sensitive-action approvals, and safety guidance. The UI shows only
setting keys, groups, state/source chips, catalog counts, and redaction chips;
plugin install state, Screen Recording or Accessibility permission state,
allowed or denied app lists, app identifiers, window titles, screen content,
screenshots, clipboard state, locked-use state, admin policy, desktop control,
permission prompts, paths, URLs, raw payloads, and app-server traffic remain
blocked.
Within that same summary, `notifications` exposes a static review-only catalog
for official turn-completion notification and permission-prompt settings plus
the local server-notification boundary. The UI shows only setting keys, groups,
state/source chips, boundary counts, and redaction chips; notification values,
browser permission state, subscriptions, payloads, browser Notification API
prompts, paths, URLs, raw payloads, and app-server traffic remain blocked.
Within that same summary, `contextAwareSuggestions` exposes a static
review-only catalog for documented follow-up and resume suggestions when
starting or returning to Codex. The UI shows only setting keys, groups,
state/source chips, catalog counts, and redaction chips; suggestion text, task
content, thread content or ids, project/workspace names, source context,
ranking signals, resume targets, generation triggers, paths, URLs, raw
payloads, mutations, and app-server traffic remain blocked.
Within that same summary, `memories` exposes a static review-only catalog for
global memory enablement, the `features.memories` config flag,
generation/use controls, external-context privacy, rate-limit threshold,
extraction/consolidation model controls, per-thread controls,
review-memory-files, and the existing memory-reset preflight boundary. The UI
shows only setting keys, groups, state/source chips, catalog counts, and
redaction chips; current values, config values, memory files, memory content,
memory paths, storage paths, per-thread choices, rate-limit values, model
names, generation/injection triggers, reset execution, paths, URLs, raw
payloads, and app-server traffic remain blocked.
Within that same summary, `archivedThreads` exposes a static review-only catalog
for the archived-list, date metadata, project-context, and unarchive-action
surfaces. The UI shows only setting keys, groups, state/source chips, catalog
counts, and redaction chips; archived thread lists, dates, project context,
thread names, ids, content, unarchive execution, paths, URLs, raw payloads,
mutations, and app-server traffic remain blocked.
Within that same summary, `personalization` exposes a static review-only
catalog for the official personality-mode options and custom-instructions
boundary. The UI shows only setting keys, groups, state/source chips, catalog
counts, and redaction chips; active personality, custom instructions, personal
`AGENTS.md` content or paths, paths, URLs, raw payloads, mutations, and
app-server traffic remain blocked.
The same response also exposes static upstream-drift metadata for head-only
app-server methods absent from the stable generated schema. It returns only
method names, count/status metadata, and local blocked policy; it does not
return source paths, response requirements, URLs, secrets, raw payloads, or
perform app-server traffic.
It also exposes `serverRequestBoundary` and `serverNotificationBoundary`
contracts for non-approval app-server requests and high-risk notifications.
Those contracts return audited method names, category counts, blocked state, and
redaction flags only. They do not service tool-user-input, MCP elicitation,
dynamic tool-call, auth-token refresh, attestation, or current-time requests and
do not expose prompts, schemas, forms, tool arguments, server names, tokens,
timestamps, realtime transcripts, audio, SDP, moderation metadata, progress
details, URLs, paths, or raw payloads.
It also exposes a compact integration scope summary with active read methods,
local preflight/login/login-cancel/logout gates, and blocked mutation method
names/counts. That summary still omits secrets, auth tokens, paths, URLs, hook commands,
rate-limit details, raw payloads, and display names unless the separate name
gate is enabled.
The same response includes a sanitized `integrationLifecycle` summary for the
UI. It is derived only from the already sanitized surfaces, scope, and bounded
histories, and exposes state, surface/history/gate counts, enabled-gate booleans,
and latest action method/status/source only. It never returns preflight tokens,
names, targets, argument text, resource content, skill content, URLs, paths,
secrets, or raw payloads, and it does not enable browser method calls.
The lifecycle summary also includes sanitized `integrationActions` metadata for
the UI counters: read-method count, local preflight gate count, executable
opt-in action count, action-family counts, blocked mutation method count, and
explicit redaction flags. It is derived from the integration scope and histories
only, and never returns tokens, names, targets, arguments, resource content,
skill content, URLs, paths, secrets, or app-server payloads.
The UI also renders sanitized `integrationManagement` metadata derived from the
same surfaces, scope, action summary, and histories. It exposes only management
state, surface counts, preflight/executable actionability, latest-action
availability, active-login counts, and redaction flags; it never returns
preflight tokens, auth tokens, names, targets, argument text, resource content,
skill content, URLs, paths, secrets, raw payloads, or app-server payloads.
The same lifecycle object includes sanitized `integrationExecutionReadiness`
metadata for the Settings grid. It reports only whether actions are blocked,
preflight-only, actionable, inventory-backed, or history-only, plus already
sanitized action counts and explicit false flags for generic mutation execution,
auth callbacks/token access, app installs/linking, external config imports, and
marketplace mutations.
It also includes sanitized `integrationSafetyContract` metadata derived only
from scope, action, management, and execution-readiness summaries. The UI shows
read/local/preflight/executable gate counts, enabled action-family counts,
dedicated-route-only mutation policy, explicit auth callback/token, install,
linking, import, marketplace, plugin install/share, hook-command, and generic
mutation blocks, and redaction flags without tokens, targets, arguments,
resource content, skill content, names, URLs, paths, secrets, raw payloads, or
app-server payloads.
It also renders sanitized `integrationRoutingContract` metadata derived from
the same summaries. The UI shows local preflight versus dedicated executable
routes, allowlist requirements for MCP/plugin/settings/config/experimental
feature actions, device-code-only auth routing, generic mutation blocks, and
redaction flags without tokens, targets, arguments, resource content, skill
content, names, URLs, paths, secrets, raw payloads, or app-server payloads.
It also renders sanitized `integrationWorkflowContract` metadata derived from
the same safe summaries. The UI shows client-side grouping, preflight-only
versus executable action visibility, history visibility, one-preflight-token per
action requirements, allowlist requirements, and explicit generic
mutation/auth callback/token/install/import/marketplace/plugin share/hook
command blocks without tokens, targets, arguments, resource content, skill
content, names, URLs, paths, secrets, raw payloads, or app-server payloads.
It also renders sanitized `integrationAuditContract` metadata derived from the
same safe summaries. The UI shows preflight-audit versus persistent-action-audit
mode, bounded history counters and limits, allowlist requirements, sanitized
action-audit guarantees, and hard token/target/argument/resource/URL/path/
secret/raw-payload non-logging flags without tokens, targets, arguments,
resource content, skill content, names, URLs, paths, secrets, raw payloads, or
app-server payloads.
It also renders sanitized `integrationProvenanceContract` metadata derived from
the same safe summaries. The UI shows counts-only inventory provenance versus
allowlisted executable route provenance, explicit install/import/marketplace/
hook-command/plugin-skill execution blocks, per-family allowlist requirements,
and sanitized audit requirements without tokens, targets, arguments, resource
content, skill content, names, URLs, paths, secrets, raw payloads, or app-server
payloads.
It also renders sanitized `integrationExternalCodeContract` metadata derived
from the same safe summaries. The UI shows the MCP/plugin/skills external-code
boundary, counts-only inventory versus allowlisted executable route modes,
explicit install/execution/import/marketplace/hook-command blocks, preflight and
allowlist requirements, and sanitized audit requirements without tokens,
targets, arguments, resource content, skill content, names, URLs, paths,
secrets, raw payloads, or app-server payloads.

Device-code account login, login cancel, account credits nudge, account reset
credit consumption, and account logout are the only dedicated account
auth/quota mutation routes. Their preflight endpoints do not touch app-server,
return one-time local tokens, and all ten account auth/quota preflight/execution
responses are constrained by route-specific nested response schemas.
`/api/account-login-start` is
disabled unless
`CODEX_APP_PORT_ALLOW_ACCOUNT_LOGIN=1` is set; when enabled, it consumes the
token before calling only `account/login/start` with
`{"type":"chatgptDeviceCode"}`. Its protected browser response may show the
device `userCode`, a verified OpenAI/ChatGPT HTTPS verification URL, and an
opaque cancel reference, while sanitized action audit records and history omit
those fields plus login IDs, cancel references, OAuth URLs, auth tokens,
account IDs, emails, raw app-server payloads, cwd, paths, and preflight tokens.
`/api/account-login-cancel` is separately gated by
`CODEX_APP_PORT_ALLOW_ACCOUNT_LOGIN_CANCEL=1`, accepts only the opaque
process-local cancel reference plus a matching one-time token, calls only
`account/login/cancel`, and never returns or logs the private app-server
`loginId`. `/api/account-credits-nudge` is separately gated by
`CODEX_APP_PORT_ALLOW_ACCOUNT_CREDITS_NUDGE=1`, accepts only `credits` or
`usage_limit`, consumes a matching one-time token, calls only
`account/sendAddCreditsNudgeEmail`, and never returns or logs email addresses,
auth tokens, account IDs, URLs, cwd, paths, or raw app-server payloads.
`/api/account-reset-credit-consume` is separately gated by
`CODEX_APP_PORT_ALLOW_ACCOUNT_RESET_CREDIT_CONSUME=1`, accepts only the
matching one-time token, generates the idempotency key server-side, calls only
`account/rateLimitResetCredit/consume`, and returns/logs only a bounded outcome
enum without idempotency keys, quota values, account IDs, auth tokens, URLs,
cwd, paths, or raw app-server payloads.
`/api/account-logout` remains separately gated by
`CODEX_APP_PORT_ALLOW_ACCOUNT_LOGOUT=1` and calls only `account/logout`.
Auth callbacks, login/linking flows that need OAuth callback handling, and token
access remain blocked. Successful account login/cancel/credits-nudge/reset-credit
consume/logout actions are also visible in capped process-local histories
returned by `/api/settings-integrations`, with quota values, idempotency keys,
rate-limit IDs, tokens, account identifiers, URLs, paths, and raw payloads
omitted.

When the server is started with `CODEX_APP_PORT_ALLOW_INTEGRATION_INVENTORY=1`,
the same endpoint may call `configRequirements/read`, `model/list`,
`modelProvider/capabilities/read`, `collaborationMode/list`, `account/read`,
`account/rateLimits/read`, `account/usage/read`,
`account/workspaceMessages/read`, `remoteControl/status/read`, `app/list`,
`mcpServerStatus/list`, `skills/list`, `plugin/list`, `plugin/installed`,
`experimentalFeature/list`, `hooks/list`, `externalAgentConfig/detect`, and
`externalAgentConfig/import/readHistories`. The response is
counts-only: no account email, tokens, model ids/descriptions/upgrade copy/
availability messages, app ids/URLs/logos/descriptions/labels/screenshots,
external config descriptions/cwds/paths/names/marketplaces/plugin names/
session titles/raw migration items, import ids/messages/paths/stages, remote
control status strings/server names/installation ids/environment ids,
rate-limit plan types, limit ids/names, balances, used percentages, reset
times, MCP server names, MCP tool schemas, skill names/descriptions/paths,
plugin names/ids/paths/URLs/prompts/capabilities, hook commands/paths/keys/
matchers/plugin IDs, experimental feature names/display text/descriptions/
announcements/cursors, config requirement values/domains, imports, installs,
callbacks, or tool invocations are returned.

When `CODEX_APP_PORT_ALLOW_INTEGRATION_NAMES=1` is also set, the inventory may
include bounded display names for models, collaboration modes, apps/connectors,
app plugin labels, MCP servers/tools, skills, plugins, and safe experimental
feature names. This is still a read-only inventory mode:
path-like, URL-like, and token-like names are redacted, and the response still
omits account emails/tokens, model ids/descriptions/upgrade copy/availability
messages, collaboration-mode model overrides, app ids/URLs/descriptions/labels/
logos/screenshots, MCP schemas and resource URIs, skill descriptions/paths,
plugin ids/paths/URLs, hook commands/paths/keys/matchers/plugin IDs,
rate-limit details, external config descriptions/cwds/paths/names/marketplaces/
plugin names/session titles/raw migration items, config requirement values/
domains, experimental feature display text/descriptions/announcements, imports,
installs, callbacks, and tool invocations.

The mcp-tool-preflight endpoint accepts draft MCP server, tool, argument
intent, and optional 8-character thread suffix only for local validation. It
returns name character counts, argument character and line counts, JSON-object
validity, top-level key count, and whether the opt-in execution gate is
available. It does not return server names, tool names, argument text, schemas,
resource content, or call `mcpServer/tool/call`. The returned local preflight
token is bound to hashed intent only and does not expose names, arguments,
schemas, or hashes.
The matching `/api/mcp-tool-call` route is fail-closed unless
`CODEX_APP_PORT_ALLOW_MCP_TOOL_CALL=1` is set before launch, the requested
`server/tool` exactly matches `CODEX_APP_PORT_MCP_TOOL_ALLOWLIST`, and the
matching local token is consumed once. It requires the thread suffix resolved
through app-server thread metadata, accepts only JSON-object arguments, calls
`mcpServer/tool/call`, and reduces the result to content counts,
text/image/resource/structured-content counts, character counts, and error
state. It does not return or audit server names, tool names, arguments, thread
ids, tool output, structured content, paths, tokens, or raw app-server payloads.
The `/api/mcp-server-reload-preflight` endpoint validates a no-argument reload
intent locally and issues a token only for that action. The matching
`/api/mcp-server-reload` route is fail-closed unless
`CODEX_APP_PORT_ALLOW_MCP_SERVER_RELOAD=1` is set before launch. It consumes the
matching token once, calls only `config/mcpServer/reload`, and reduces the
result to completion status plus response-shape counts. It does not return or
audit MCP server names, config paths, command details, tokens, or raw
app-server payloads.
The `/api/mcp-oauth-login-preflight` endpoint accepts only a draft MCP server
name for local validation and exact allowlist checks. The matching
`/api/mcp-oauth-login` route is fail-closed unless
`CODEX_APP_PORT_ALLOW_MCP_OAUTH_LOGIN=1` is set before launch and the server
name exactly matches `CODEX_APP_PORT_MCP_OAUTH_ALLOWLIST`. It rebuilds the same
preflight, consumes the matching token once, calls only `mcpServer/oauth/login`,
and may return a sanitized HTTPS authorization URL in the protected immediate
response. Histories and action audit logs keep only server-name length,
response-shape counts, URL-present status, and redaction flags; they do not
return or audit server names, OAuth URLs, tokens, paths, or raw app-server
payloads.
The mcp-resource-preflight endpoint accepts draft MCP server and resource URI
intent only for local validation behind a route-specific nested response
schema. It returns server/resource character counts only, does not return the
server name, resource URI, resource content, schemas, or call
`mcpServer/resource/read`, and stores only hashed intent in the local preflight
registry.
The matching `/api/mcp-resource-read` route is fail-closed unless
`CODEX_APP_PORT_ALLOW_MCP_RESOURCE_READ=1` is set before launch. It rebuilds the
same preflight, consumes a matching local token once, calls
`mcpServer/resource/read`, and reduces the result to content counts,
text/blob counts, MIME-type count, and character counts behind its own nested
response schema. It does not return or
audit resource URIs, MIME types, resource content, server names, paths, tokens,
or raw app-server payloads.

The plugin-read-preflight endpoint accepts draft `plugin/read` intent only for
local validation behind a route-specific nested response schema. It returns
plugin target and argument counts only, does not return plugin names,
marketplace names, marketplace paths, descriptions, hook keys, skill contents,
MCP server names, URLs, schemas, or call `plugin/read`, and stores only hashed
intent in the local preflight registry. The matching `/api/plugin-read` route is
fail-closed unless `CODEX_APP_PORT_ALLOW_PLUGIN_READ=1` is set before launch.
It rebuilds the same preflight, rejects unsafe plugin names, `marketplacePath`,
and unknown argument keys, consumes a matching token once, calls `plugin/read`,
and reduces the result to plugin/app/hook/MCP server/skill/keyword counts and
character counts only behind its own nested response schema. It does not return
or audit plugin names, marketplace names, ids, paths, URLs, descriptions, hook
keys, skill content, MCP server names, share context, tokens, or raw payloads.

The plugin-install-preflight endpoint accepts draft `plugin/install` intent for
local validation behind a route-specific nested response schema. It returns
only target length, argument length/key counts, URL/path/secret-like counters,
and plugin-install field-presence booleans. It issues a short-lived local
preflight token for confirmation and history, but there is no
`/api/plugin-install` execution route. It does not download, install, check out,
materialize external code, touch app-server, or return plugin names,
marketplace names, paths, URLs, secrets, target text, argument text, or raw
payloads.

The marketplace-action-preflight endpoint accepts draft `marketplace/add`,
`marketplace/remove`, and `marketplace/upgrade` intent for local validation
behind a route-specific nested response schema. It returns only target length,
argument length/key counts, URL/path/secret-like counters, and
source/ref/sparse-path/marketplace-name presence booleans. It issues a
short-lived local preflight token for confirmation and history, but there is no
marketplace execution route. It does not add, remove, upgrade, download, check
out, materialize external code, touch app-server, or return marketplace names,
sources, refs, paths, URLs, secrets, target text, argument text, or raw
payloads.

The plugin-uninstall-preflight endpoint accepts draft `plugin/uninstall` intent
only for local validation behind a route-specific nested response schema. It
returns plugin-id length and allowlist state only, does not return plugin
ids/names, paths, URLs, schemas, secrets, or call app-server, and stores only
hashed intent in the local preflight registry. The matching
`/api/plugin-uninstall` route is fail-closed unless
`CODEX_APP_PORT_ALLOW_PLUGIN_UNINSTALL=1` is set before launch and the plugin id
exactly matches `CODEX_APP_PORT_PLUGIN_UNINSTALL_ALLOWLIST`. It rebuilds the
same preflight, consumes a matching token once, calls `plugin/uninstall`, and
reduces the result to target length and response-shape counts only behind its
own nested response schema. It does not return or audit plugin ids/names, paths,
URLs, tokens, or raw payloads.
The plugin-enablement-preflight endpoint accepts only plugin enablement intent
for local validation behind a route-specific nested response schema. It returns
plugin-id length, requested state, allowlist state, and server-side key-path
construction metadata only. The matching `/api/plugin-enablement-set` route is
fail-closed unless `CODEX_APP_PORT_ALLOW_PLUGIN_ENABLEMENT_SET=1` is set and
the plugin id exactly matches `CODEX_APP_PORT_PLUGIN_ENABLEMENT_ALLOWLIST`. It
rebuilds the same preflight, consumes a matching token once, constructs
`plugins."<plugin-id>".enabled` on the server, forces `upsert`, and calls
`config/value/write` with only the boolean value. It does not return or audit
plugin ids, key paths, values, config paths, tokens, or raw payloads.
The Settings & Integrations UI exposes this as a dedicated plugin enablement
panel with plugin-id and boolean state inputs. The Apply button stays disabled
until the route-specific preflight returns an executable one-time token, and
the UI renders only plugin-id character count, requested state, gate status,
and response-key count.

The plugin-share-checkout-preflight endpoint accepts only a safe remote plugin
id and validates whether the dedicated checkout gate and exact allowlist match
without touching app-server. The matching `/api/plugin-share-checkout` route is
fail-closed unless `CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_CHECKOUT=1` was set before
launch, the target exactly matches
`CODEX_APP_PORT_PLUGIN_SHARE_CHECKOUT_ALLOWLIST`, and the one-time preflight
token matches the rebuilt intent. Execution calls `plugin/share/checkout` with
only `{remotePluginId}` and reduces the app-server result to response-shape and
field-presence metadata. It does not return or audit remote plugin ids,
marketplace/plugin names, paths, versions, tokens, or raw payloads.

The plugin-share-action-preflight endpoint accepts draft `plugin/share/save`,
`plugin/share/updateTargets`, and `plugin/share/delete` intent for local
validation behind a route-specific nested response schema. It returns only
target length, argument length/key counts, URL/path/secret-like counters,
share-target/principal counters, and field-presence booleans. It issues a
short-lived local preflight token for confirmation and history, but there is no
plugin-share mutation execution route. It does not save, update, delete, expose
share targets, touch app-server, or return plugin names, share targets,
principal ids, principals, paths, URLs, secrets, target text, argument text, or
raw payloads.

The external-config-import-preflight endpoint accepts draft
`externalAgentConfig/import` intent for local validation behind a route-specific
nested response schema. It returns only target length, argument length/key
counts, URL/path/secret-like counters, and migration item/plugin/marketplace/
session/command/hook/MCP/subagent counters. It issues a short-lived local
preflight token for confirmation and history, but there is no external config
import execution route. It does not import, write config, install plugins, touch
app-server, or return migration items, plugin names, marketplace names, session
titles, commands, hook commands, MCP server names, subagent names, paths, URLs,
secrets, target text, argument text, or raw payloads.

The review-feedback-preflight endpoint accepts draft `review/start` and
`feedback/upload` intent for local validation behind a route-specific nested
response schema. It returns only target length, argument length/key counts,
review target/delivery/thread-id presence, feedback classification/reason/log/
tag counters, and URL/path/secret-like counters. It issues a short-lived local
preflight token for confirmation and history, but there is no review or
feedback execution route. It does not start review, upload feedback or logs,
touch app-server, or return thread ids, branch names, SHAs, titles,
instructions, feedback reason, log paths, tags, URLs, secrets, target text,
argument text, or raw payloads.

The memory-reset-preflight endpoint accepts no browser parameters beyond the
workspace selector and validates only the audited `memory/reset` method shape.
It requires the official null-params contract, issues a short-lived local
preflight token for confirmation/history, and has no execution route. It does
not delete memories, touch app-server, or return memory files, memory content,
memory paths, secrets, argument text, or raw payloads.

The plugin-content-preflight endpoint accepts only audited blocked
`plugin/skill/read` and `plugin/share/list` intent for local validation behind a
route-specific nested response schema. It returns method, target, and argument
counts only, does not return skill text, sharing URLs, sharing principals,
plugin names, marketplace names, paths, descriptions, hook keys, MCP server
names, schemas, or call either plugin read method, and stores only hashed intent
in the local preflight registry. The matching `/api/plugin-content-read` route
is fail-closed unless the method's dedicated gate is enabled before launch:
`CODEX_APP_PORT_ALLOW_PLUGIN_CONTENT_READ=1` for `plugin/skill/read` and
`CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_LIST=1` for `plugin/share/list`. It rebuilds
the same preflight, consumes a matching token once, rejects unknown skill-read
arguments before app-server traffic, sends no parameters for share-list reads,
and reduces results to content character/line counts or share item counts only
behind its own nested response schema. It does not return or audit skill text,
sharing URLs, sharing principals, names, ids, paths, descriptions, hook keys,
MCP server names, tokens, or raw payloads.

The skills-config-preflight endpoint accepts only audited `skills/config/write`
intent for local validation. It returns the skill-name and argument counts only,
does not return the skill name, argument text, paths, descriptions, schemas, or
call app-server, and stores only hashed intent in the local preflight registry.
The matching `/api/skills-config-write` route is fail-closed unless
`CODEX_APP_PORT_ALLOW_SKILLS_CONFIG_WRITE=1` is enabled before launch. It
rebuilds the same preflight, consumes a matching token once, accepts only
`{"enabled":boolean}`, rejects path selectors and unknown keys before
app-server traffic, calls `skills/config/write` by safe skill name only, and
reduces the result to target/argument counts plus the effective enabled boolean.
It does not return or audit skill names, paths, argument text, tokens, or raw
payloads.

The skills-extra-roots-clear-preflight endpoint accepts no root/path input and
creates only a local one-time confirmation token. The matching
`/api/skills-extra-roots-clear` route is fail-closed unless
`CODEX_APP_PORT_ALLOW_SKILLS_EXTRA_ROOTS_CLEAR=1` is enabled before launch. It
rebuilds the same empty-intent preflight, consumes a matching token once,
rejects browser-provided roots, paths, and unknown fields before app-server
traffic, calls `skills/extraRoots/set` only with `{"extraRoots":[]}`, and
reduces the result to status/count/shape metadata. It does not return or audit
extra roots, paths, tokens, notifications, or raw payloads.

The remote-control-disable-preflight endpoint accepts no remote-control params
and creates only a local one-time confirmation token. The matching
`/api/remote-control-disable` route is fail-closed unless
`CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_DISABLE=1` is enabled before launch. It
rebuilds the same empty-intent preflight, consumes a matching token once,
rejects browser-provided `ephemeral`, identity, pairing, enable, and client
fields before app-server traffic, calls `remoteControl/disable` only with
`null` params, and reduces the result to status/count/shape metadata. It does
not return or audit raw remote-control status payloads, server names, installation
ids, environment ids, tokens, notifications, or raw payloads.

The remote-control-enable-preflight endpoint accepts draft `remoteControl/enable`
params only for local validation. It counts argument length, top-level keys,
optional `ephemeral` presence, unknown params, and URL/path/secret-like values,
then issues a short-lived local token for confirmation/history. There is no
remote-control enable execution route. It does not touch app-server, enable
remote control, enroll relay state, create pairing codes, or return
remote-control status, server names, installation ids, environment ids,
argument text, paths, URLs, secrets, or raw payloads.

The remote-control-pairing-preflight endpoint accepts draft
`remoteControl/pairing/start` and `remoteControl/pairing/status` params only for
local validation. It counts argument length, top-level keys, `manualCode`
presence, pairing-code input presence/length, unknown params, and
URL/path/secret-like values, then issues a short-lived local token for
confirmation/history. There is no remote-control pairing execution route. It
does not touch app-server, create pairing codes, poll claim state, or return
pairing codes, manual pairing codes, claim state, controller info, environment
ids, server names, argument text, paths, URLs, secrets, or raw payloads.

The remote-control client list endpoint is fail-closed unless
`CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_LIST=1` is enabled before launch.
It calls `remoteControl/status/read` only to resolve the current environment
server-side, then calls `remoteControl/client/list` and stores returned
`clientId` values in a process-local registry keyed by `remoteclientref-*`
selectors. The browser receives only counts, refs, and device-field presence
booleans. The matching revoke preflight accepts only a server-issued ref and
creates a one-time confirmation token. `/api/remote-control-client-revoke` is
fail-closed unless `CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_REVOKE=1` is
enabled, consumes the token once, resolves `environmentId` and `clientId`
server-side, calls `remoteControl/client/revoke`, marks the ref used, and writes
sanitized action audit metadata. It does not return or audit remote client ids,
environment ids, display names, device metadata values, cursors, tokens,
notifications, or raw payloads.

The config-value-preflight endpoint accepts only `config/value/write` intent for
local validation. It returns key-path/value shape counts only, does not return
the key path, value text, config paths, tokens, schemas, or call app-server, and
stores only hashed intent in the local preflight registry. The matching
`/api/config-value-write` route is fail-closed unless
`CODEX_APP_PORT_ALLOW_CONFIG_VALUE_WRITE=1` is enabled before launch and the key
exactly matches `CODEX_APP_PORT_CONFIG_VALUE_WRITE_ALLOWLIST`. It rebuilds the
same preflight, consumes a matching token once, parses the value as JSON
server-side, accepts only `replace` or `upsert`, sends `filePath:null` and
`expectedVersion:null`, and reduces the result to count/shape metadata. It does
not return or audit key paths, values, config paths, tokens, or raw payloads.

The experimental-feature-preflight endpoint accepts only
`experimentalFeature/enablement/set` intent for local validation. It returns
feature-character and enablement-value counts only, does not return the feature
name, enablement value, paths, tokens, schemas, or call app-server, and stores
only hashed intent in the local preflight registry. The matching
`/api/experimental-feature-set` route is fail-closed unless
`CODEX_APP_PORT_ALLOW_EXPERIMENTAL_FEATURE_SET=1` is enabled before launch and
the feature exactly matches `CODEX_APP_PORT_EXPERIMENTAL_FEATURE_ALLOWLIST`. It
rebuilds the same preflight, consumes a matching token once, accepts only a safe
feature identifier plus a boolean enablement value, and reduces the result to
updated/enabled/disabled counts plus response-shape metadata. It does not
return or audit feature names, enablement values, config paths, tokens, or raw
payloads.

The integration-action-preflight endpoint accepts draft mutation intent only
for methods that are already in the audited blocked mutation allowlist:
settings writes, auth callbacks/mutations, MCP auth/tool calls, skill writes,
plugin install/uninstall/enablement/share actions, marketplace mutations, and external
config imports. The UI selector lists that full blocked mutation allowlist. It
returns the audited method/category plus target and argument counts, and adds a
sanitized risk summary for auth callbacks/mutations, MCP OAuth/tool calls,
settings writes/mutations, plugin installs, plugin sharing, marketplace
mutations, and external config imports with URL-like, path-like, secret-like,
share-target, principal type, schema-shape, setting-shape, tool-argument,
auth-credential, and migration counts only. It does not return target text,
argument text, names, URLs, schemas, paths, principals, setting keys or values,
invoke tools, install or uninstall plugins, write settings, start auth flows, or
touch `codex app-server`.
Successful MCP server-reload/OAuth/tool/resource, plugin-read/plugin-install/plugin-share-action/plugin-uninstall/plugin-enablement/plugin-content,
skills-config, config-value, config-batch, experimental-feature, review/feedback, memory-reset, and integration mutation preflights are also recorded in a capped process-local
history returned by `/api/settings-integrations`. That history keeps only
action type, audited method/category, target/name/resource/
argument counts, JSON top-level key counts, sanitized high-risk summaries, and
redaction flags. It never
returns preflight tokens, server names, tool names, resource URIs, resource
content, plugin names, marketplace names, skill text, sharing state, target
text, argument text, schemas, paths, URLs, or app-server payloads, and it does
not execute the preflighted action.
The lifecycle panel summarizes those same histories as read-only/inventory/
gated/history-only state, total history count, enabled mutation-gate count, and
latest sanitized method/status/source/app-server-local metadata only.
It also shows integration action counters for preflight-only gates versus
currently executable opt-in actions, without exposing target names, argument
text, tokens, URLs, paths, or app-server payloads.
The management counter condenses the same sanitized actionability into
blocked/read-only/preflight-only/actionable/inventory/history-only state without
showing target names, arguments, tokens, URLs, paths, resources, skill content,
or app-server payloads.
Successful fail-closed confirmations are recorded in a separate capped
process-local history. That history records only the blocked action type,
audited method/category, target/name/argument counts, token-consumed status,
one-time-use status, and redaction flags; it never returns preflight tokens,
raw intent, intent hashes, names, targets, arguments, schemas, paths, URLs, or
app-server payloads, and it still executes no mutation.

The terminal-actions endpoint is another fail-closed inventory surface. It
returns the locally audited terminal/action method list from the generated
schema snapshot. By default every method is browser-blocked: `command/exec`,
`command/exec/write`, `command/exec/resize`, `command/exec/terminate`,
`process/spawn`, `process/writeStdin`, `process/resizePty`, `process/kill`,
`thread/shellCommand`, `thread/backgroundTerminals/clean`, `turn/interrupt`,
and filesystem write methods. It does not list terminal sessions, write
terminal input, resize or terminate terminals, run shell commands, spawn host
processes, or accept session-wide approval decisions. By default it performs no
file writes and does not touch `codex app-server`; when explicit gates are
enabled, the status reflects opt-in allowlisted `command/exec`, local file
actions, command/exec terminal control, separately gated process terminal
control, background terminal cleanup, and managed accept-once approval
forwarding while shell access and `process/spawn` stay blocked unless their
own gates are enabled.
It also exposes a compact action scope summary with enabled gated action labels
and high-risk blocked method names/counts, while still omitting command text,
argv, terminal output, session identifiers, paths, and raw app-server payloads.
Terminal/process lifecycle notifications that arrive through opt-in turn-start,
managed sessions, agent-turn smoke tests, or the read-only event stream are
sanitized before storage and rendering: the UI may show method names, thread and
turn suffixes, item suffixes, stream labels, exit codes, and input/output
counts, but it never returns raw terminal output, stdin, command text, cwd,
process handles, or terminal session ids.

The terminal-command-preflight endpoint accepts a draft command only to validate
the command action shape. It returns command character and line counts, selected
workspace public metadata, and a blocked execution policy. If
`CODEX_APP_PORT_ALLOW_TERMINAL_COMMAND=1` and
`CODEX_APP_PORT_TERMINAL_COMMAND_ALLOWLIST=cmd1,cmd2` are set, it also reports
whether the shell-free argv parse is supported and allowlisted. It does not echo
the command text, executable, or argv, create a terminal session, execute a
command, write stdin, resize or terminate a terminal, perform file writes, or
touch `codex app-server`. It returns a short-lived local preflight token without
storing or returning raw command text.

The matching `/api/terminal-command` route is disabled unless the command gate
and executable allowlist are both enabled. It consumes the one-time preflight
token before calling only `command/exec` with the selected workspace cwd,
read-only sandbox policy, network disabled, no stdin, no PTY, no streamed
output, and an output cap. Responses and action audit records expose only
argument counts, exit code, stdout/stderr character counts, method names, and
policy flags. They do not return command text, executable names, argv, cwd,
environment values, process ids, stdout, stderr, or preflight tokens.
The Terminal & Actions status endpoint keeps a process-local recent command
history that repeats only those sanitized status/count fields for already
executed commands; it does not return command text, executable names, argv, cwd,
environment values, process ids, stdout, stderr, or preflight tokens.
Both terminal-command routes enforce route-specific nested response schemas so
future app-server probe metadata cannot add command text, argv, cwd, stdout,
stderr, environment, or process ids by accident.

The separate `/api/process-spawn-preflight` endpoint accepts draft process
commands only to validate shell-free argv support and executable allowlist
eligibility. `/api/process-spawn` remains disabled unless
`CODEX_APP_PORT_ALLOW_PROCESS_SPAWN=1` and
`CODEX_APP_PORT_PROCESS_SPAWN_ALLOWLIST=cmd1,cmd2` are set. When enabled, it
consumes a matching one-time preflight token before calling only
`process/spawn` with no stdin, no PTY, no streamed output, no browser-provided
environment, and zero output bytes requested. Responses, history, and audit
records expose only argument counts, exit status/code, stdout/stderr character
counts, sandbox/network flags, and policy flags. They do not return command
text, executable names, argv, cwd, environment values, process handles, process
ids, stdout, stderr, or preflight tokens. Both process-spawn routes enforce
route-specific nested response schemas and disallow a top-level command
response key.

The `/api/thread-shell-command-preflight` endpoint validates a loaded thread
suffix plus an exact-command allowlist entry without touching app-server or
echoing command text. The matching `/api/thread-shell-command` route is
disabled unless `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1`,
`CODEX_APP_PORT_ALLOW_THREAD_SHELL_COMMAND=1`, and
`CODEX_APP_PORT_THREAD_SHELL_COMMAND_ALLOWLIST` are configured and a matching
one-time preflight token is consumed. It routes only through the persistent
session manager after loaded-thread ownership is proven. Both routes enforce
route-specific nested response schemas, disallow a top-level command response
key, and return only suffix/count/status metadata without command text, output
text, terminal session identifiers, full ids, thread content, cwd, paths, or
tokens.

The terminal-control-preflight endpoint accepts draft write, resize, or
terminate intent to validate terminal-control action shape. The requested
method must match an audited `command/exec/*` or `process/*` session-control
method. It returns session selector length, input counts for write, and resize
dimensions for resize. It does not return session ids, echo terminal input,
list sessions, write stdin, resize, terminate, execute commands, or touch
`codex app-server`. The route enforces a terminal-control-specific nested
response schema and also issues the same local preflight token for future
gating.
The matching `/api/terminal-control` mutation route is disabled unless
`CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` and one of the action-family gates are
both set. `CODEX_APP_PORT_ALLOW_TERMINAL_CONTROL=1` enables only
`command/exec/write`, `command/exec/resize`, and `command/exec/terminate`;
`CODEX_APP_PORT_ALLOW_PROCESS_TERMINAL_CONTROL=1` separately enables only
`process/writeStdin`, `process/resizePty`, and `process/kill`. Both consume the
one-time preflight token and use the persistent session manager. Responses
expose only sanitized action/method, selector/input/dimension counts, status,
token consumption, audit flags, and policy metadata through a route-specific
nested response schema.
The Terminal & Actions status endpoint records capped process-local
terminal-control preflight and confirmation histories. They keep only
action/method, selector/input counts, resize dimensions, token-issued or
token-consumed status, one-time-use status, and redaction flags. They never
return preflight tokens, session selectors, session ids, terminal input, raw
intent, intent hashes, output, or execute terminal control.

The terminal-background-clean-preflight endpoint validates a loaded thread
suffix for future background terminal cleanup and issues a local preflight
token without touching `codex app-server`. The matching
`/api/terminal-background-clean` route is disabled unless
`CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` and
`CODEX_APP_PORT_ALLOW_TERMINAL_CLEAN=1` are both set; when enabled, it consumes
the one-time token before calling only `thread/backgroundTerminals/clean`.
Both routes enforce route-specific nested response schemas.
Responses are suffix-only and count/status-only: no terminal output, terminal
session ids, full thread ids, transcript content, paths, or command text are
returned. Successful cleanup requests are written to the sanitized action audit
log when configured, after appendability is checked and without terminal output,
session identifiers, full ids, paths, or thread content.

The background terminal list and terminate controls are separate from cleanup.
`/api/terminal-background-list` is disabled unless
`CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` and
`CODEX_APP_PORT_ALLOW_TERMINAL_LIST=1` are both set. When enabled, it calls only
`thread/backgroundTerminals/list` and returns terminal counts plus opaque
process-local refs; process ids, item ids, commands, cwd, OS pids, paths,
output, and raw payloads stay server-side. Termination requires the additional
`CODEX_APP_PORT_ALLOW_TERMINAL_TERMINATE=1` gate, a listed opaque ref, and a
matching one-time `/api/terminal-background-terminate-preflight` token before
the dev server resolves the app-server process id privately and calls only
`thread/backgroundTerminals/terminate`. Responses and action audit records omit
the opaque ref, process id, command text, cwd, paths, output, and raw payloads.

The action-preflight-confirm endpoint consumes one of those tokens against the
same action type, workspace, and hashed intent, then still returns a blocked
response. Replay, missing-token, expired-token, or mismatched-intent requests
are rejected without echoing the attempted command, path, prompt, or MCP
arguments. Successful Settings/MCP/Integrations confirmations are visible only
as sanitized process-local history with the token marked consumed and no
mutation executed. This is the provenance gate future mutation endpoints must
pass before any real app-server or filesystem write is enabled.

The file-action-preflight endpoint accepts write/remove/copy/create-directory
intent only to validate the filesystem action shape. Paths must be
workspace-relative and cannot target hidden paths, `.git`, lock files, parent
directories, absolute paths, or drive roots. The response returns basenames,
path depth, content character and line counts, and a blocked policy. It does
not return full paths, file contents, command strings, or touch `codex
app-server`. The `/api/file-action` route is disabled unless
`CODEX_APP_PORT_ALLOW_FILE_ACTION=1` is set; when enabled, it revalidates and
consumes the token, rejects symlinked parent/target paths, performs only the
requested workspace-local write/remove/copy/create-directory action, and still
returns no paths, file contents, stdout, stderr, argv, or app-server traffic.
Both file-action routes and the shared action-preflight-confirm response are
constrained by route-specific nested response schemas.
Successful file actions are written to the sanitized action audit log when
configured, after appendability is checked and without paths, file basenames,
file contents, stdout, stderr, or argv.
They are also recorded in a capped process-local history returned by
`/api/terminal-actions`. That history keeps only action/method, target/source
depth, content counts, filesystem result booleans, token-consumed status, and
audit flags; it never returns preflight tokens, paths, basenames, file
contents, raw intent, or app-server payloads.

The file-read preflight is intentionally weaker than file actions: it has no
execution route, no app-server bridge, and no local filesystem read. Its UI
shows only blocked status, path depth, path character count, hidden-content
state, and no-traffic state so the route can be audited before any future
`fs/readFile` enablement is considered.

The filesystem-watch preflight follows the same blocked pattern for
`fs/watch` and `fs/unwatch`: the UI shows blocked status, path depth, hidden
watch-id state, notifications off, and no-traffic state. It never shows the
watch id, path, canonical path, or any `fs/changed` notification state.

The fuzzy-file-search preflight follows the same blocked pattern for
`fuzzyFileSearch/sessionStart`, `sessionUpdate`, and `sessionStop`: the UI shows
blocked status, root count, query character count, hidden session-id state, and
hidden results. It never shows roots, query text, session ids, file names,
paths, scores, match indices, or fuzzy-search notifications.

The turn preflight endpoint accepts draft text so the UI can validate the
future turn-start shape, but it does not call `codex app-server`, start a turn,
or return the prompt text. Its response contains only counts, selected thread
suffix, workspace id/label, the explicit blocked execution policy, and a local
preflight token bound to hashed intent. The opt-in turn-start route must consume
that matching token before it can call app-server. Turn preflight and the
thread start/archive/delete/fork/rename/compact preflight and execution routes are all constrained
by route-specific nested response schemas.

The thread-start preflight endpoint validates only the selected workspace for a
future thread creation and returns a local token bound to that intent without
touching app-server. The matching `/api/thread-start` route is disabled unless
`CODEX_APP_PORT_ALLOW_THREAD_START=1` is set; when enabled, it consumes the
one-time token before calling only `thread/start` with the allowlisted workspace
cwd, read-only sandbox, user-routed approvals, empty environments, and no model
traffic. Browser responses and sanitized action audit records return only the
thread id suffix, status/count metadata, and policy flags. They do not return
full ids, prompt text, cwd, paths, instruction sources, raw app-server payloads,
or preflight tokens.

The thread archive preflight endpoint validates only a selected thread suffix
and `archive` or `unarchive` intent, then returns a local token without touching
app-server. The matching `/api/thread-archive-action` route is disabled unless
`CODEX_APP_PORT_ALLOW_THREAD_ARCHIVE=1` is set; when enabled, it consumes the
one-time token, resolves the suffix through `thread/list`, and calls only
`thread/archive` or `thread/unarchive`. Browser responses and sanitized action
audit records return suffix, target archive state, method, status, and policy
metadata only. They do not return full ids, names, previews, transcript content,
cwd, paths, raw app-server payloads, or preflight tokens.

The thread delete preflight endpoint validates only a selected thread suffix
and archived-state selector, then returns a local token without touching
app-server. The matching `/api/thread-delete-action` route is disabled unless
`CODEX_APP_PORT_ALLOW_THREAD_DELETE=1` is set; when enabled, it consumes the
one-time token, resolves the suffix through `thread/list`, and calls only
`thread/delete`. Browser responses and sanitized action audit records return
suffix, source archive state, method, status, and policy metadata only. They do
not return full ids, names, previews, transcript content, cwd, paths, raw
app-server payloads, or preflight tokens.

The thread fork preflight endpoint validates only a selected source thread
suffix, then returns a local token without touching app-server. The matching
`/api/thread-fork-action` route is disabled unless
`CODEX_APP_PORT_ALLOW_THREAD_FORK=1` is set; when enabled, it consumes the
one-time token, resolves the source suffix through `thread/list`, and calls
only `thread/fork` with `excludeTurns: true`. The browser cannot provide
app-server path, cwd, model, sandbox, instruction, permission, or runtime-root
overrides. Browser responses and sanitized action audit records return source
suffix, forked suffix, method, status, exclude-turns, and policy metadata only.
They do not return full ids, names, previews, transcript content, cwd, paths,
raw app-server payloads, or preflight tokens.

The thread rename preflight endpoint validates only a selected thread suffix
and bounded name, then returns a local token without touching app-server. The
matching `/api/thread-rename-action` route is disabled unless
`CODEX_APP_PORT_ALLOW_THREAD_RENAME=1` is set; when enabled, it consumes the
one-time token, resolves the suffix through `thread/list`, and calls only
`thread/name/set`. Browser responses and sanitized action audit records return
suffix, name character/line counts, method, status, and policy metadata only.
They do not return the name text, full ids, previews, transcript content, cwd,
paths, raw app-server payloads, or preflight tokens.

The thread rollback preflight endpoint validates only a selected thread suffix
and a turn count from 1 to 50, then returns a local token without touching
app-server. The matching `/api/thread-rollback-action` route is disabled unless
`CODEX_APP_PORT_ALLOW_THREAD_ROLLBACK=1` is set; when enabled, it consumes the
one-time token, resolves the suffix through `thread/list`, and calls only
`thread/rollback` with `numTurns`. Browser responses and sanitized action audit
records return suffix, turn count, returned-turn count, method, status, and
policy metadata only. They do not return full ids, names, previews, transcript
content, cwd, paths, raw app-server payloads, raw returned turns, or preflight
tokens. This rolls back conversation history only and does not revert workspace
files.

The thread safety-lock preflight endpoint validates only a selected thread
suffix and returns a local token without touching app-server. The matching
`/api/thread-safety-lock-action` route is disabled unless
`CODEX_APP_PORT_ALLOW_THREAD_SAFETY_LOCK=1` is set; when enabled, it consumes
the one-time token, resolves the suffix through `thread/list`, and calls only
`thread/settings/update` with a fixed safe payload: `approvalPolicy:
"on-request"`, `approvalsReviewer: "user"`, and read-only sandbox with network
disabled. Browser responses and sanitized action audit records return suffix,
fixed-policy labels, method, status, response-shape count, and policy metadata
only. They do not return full ids, cwd, paths, thread content, raw settings
payloads, raw app-server payloads, or preflight tokens. Browser bodies cannot
provide cwd, model, permissions, service tier, summary, sandbox policy, or
arbitrary settings.

The thread metadata-update preflight endpoint validates selected-thread metadata
intent locally and has no matching execution route. It accepts only optional
`gitInfo` with `branch`, `originUrl`, and `sha` string-or-null fields, returns
blocked policy metadata, and omits full ids, branch/origin/SHA values, cwd,
paths, argument text, secrets, raw app-server payloads, and raw request
payloads.

The thread resume/inject preflight endpoint validates selected-thread
`thread/resume` and `thread/inject_items` intent locally and has no matching
execution route. It accepts only the explicit official method name plus
JSON-object arguments, rejects browser-supplied full `threadId` and unsupported
keys, returns blocked policy metadata, and omits full ids, thread content, cwd,
paths, item text, argument text, secrets, raw app-server payloads, and raw
request payloads.

The thread realtime preflight endpoint validates selected-thread
`thread/realtime/start`, `thread/realtime/appendAudio`,
`thread/realtime/appendText`, `thread/realtime/appendSpeech`, and
`thread/realtime/stop` intent locally and has no matching execution route. It
accepts only the explicit official method name plus JSON-object arguments,
rejects browser-supplied full `threadId` and unsupported keys, returns blocked
policy metadata, and omits full ids, thread content, prompt text, audio data,
text, SDP, realtime session ids, paths, secrets, raw app-server payloads, and raw
request payloads.

The thread guardian preflight endpoint validates selected-thread
`thread/increment_elicitation`, `thread/decrement_elicitation`, and
`thread/approveGuardianDeniedAction` intent locally and has no matching execution
route. It accepts only the explicit official method name plus JSON-object
arguments, rejects browser-supplied full `threadId` and unsupported keys, returns
blocked policy metadata, and omits full ids, thread content, guardian event
details, paths, secrets, raw app-server payloads, and raw request payloads.

The thread compact preflight endpoint validates only a selected thread suffix
and returns a local token without touching app-server. The matching
`/api/thread-compact-start` route is disabled unless both
`CODEX_APP_PORT_ALLOW_THREAD_COMPACT=1` and
`CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` are set. When enabled, it consumes the
one-time token, resolves only a loaded-session suffix through the persistent
app-server client, and calls only `thread/compact/start`. Browser responses and
sanitized action audit records mark model traffic explicitly and return only
suffix, loaded-session count, method, status, and policy metadata. They do not
return prompt text, full ids, transcript content, cwd, paths, raw app-server
payloads, or preflight tokens.

Successful thread start/archive/delete/fork/rename/rollback/safety-lock/compact actions are also visible in the
Execution Gate panel through a capped process-local lifecycle history. The
history keeps only action type/method, thread suffix, archive/delete/fork/rename/rollback/safety-lock/model-traffic
status, safe counts, token-consumed state, and audit flags. It omits preflight
tokens, prompts, full ids, cwd, paths, names, previews, transcript content, and
raw app-server payloads.

The turn-start endpoint exists to keep the execution boundary explicit and
tested. By default it accepts the same local draft shape, returns `403`, does
not echo the prompt, and does not touch `codex app-server`. When explicitly
enabled with `CODEX_APP_PORT_ALLOW_TURN_START=1`, it first consumes the matching
one-time turn-preflight token, then sends the prompt to `turn/start` with
read-only sandbox policy, network disabled, user-routed approvals, empty
environments, automatic deny handling on the throwaway path, and
request-scoped managed deny/accept-once handling when the session-manager
approval gates are enabled. The browser still cannot provide turn-scoped cwd,
sandbox, permissions, model, environment, output schema, or reviewer overrides.
With `CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1`, this opt-in route uses a
persistent per-workspace app-server client that remains alive for subsequent
loaded-session inventory and interrupt/unsubscribe/steer actions; without that
flag, the existing throwaway probe path remains the default.

Successful opt-in starts are recorded in an in-memory turn-session ledger. The
ledger is read-only, process-local, capped, and prompt-free: it exposes only
workspace public metadata, id suffixes, prompt counts, completion status,
notification counts, bounded sanitized live event snapshots, and sanitized
approval summaries. Local file-change approval summaries keep only redacted
reason metadata and the grant-root basename when present; full paths, patches,
file contents, prompt text, and tokens stay omitted.
The same response includes a sanitized turn-session lifecycle summary for the
UI: session count, sessions with pending or decided approvals, event-session
count, model-traffic session count, pending/decided approval counts, returned
event counts, latest suffix/status/event metadata, and which
turn-start/session-manager/approval-forwarding gates are currently enabled. It
also includes a request-scoped approval policy summary derived only from those
sanitized counts and gate flags: local-deny, forwarded-deny, accept-once, and
session-wide/execpolicy/network/root-grant rejection state. That policy summary
does not return reusable request keys, decision tokens, raw approval details,
permission profiles, prompts, full ids, paths, raw events, or app-server
payloads. The lifecycle response also includes sanitized `turnSessionOperations`
metadata for UI counters: enabled thread/turn operation counts, preflight and
model-traffic gate state, local versus session-manager turn-start routing,
manager approval/notification counts, and explicit redaction flags. It is
derived only from sanitized lifecycle counts and gate state, and it does not
return preflight tokens, prompts, full ids, paths, decision tokens, raw approval
details, raw events, or app-server payloads. The lifecycle response also includes
sanitized `turnSessionManagement` metadata for the UI: blocked/local/managed/
thread-lifecycle/history-only state, enabled operation counts, turn-start
route, manager counts, approval forwarding/accept gates, suffix-only target
selection, and redaction flags. It returns no preflight tokens, prompts, full
ids, paths, decision tokens, raw approval details, raw events, or app-server
payloads. The lifecycle response also includes sanitized `turnSessionReadiness`
metadata for the UI: blocked/local-ready/managed-ready/pending-approval/history
state, turn-start route, model-traffic gate, request-scoped approval state,
pending approval counts, manager state, and explicit session-wide/exec/network/
root-grant blocks. It returns no preflight tokens, prompts, full ids, paths,
decision tokens, raw approval details, raw events, or app-server payloads. The
lifecycle response also includes sanitized `turnSessionRoutingContract`
metadata derived from those already sanitized summaries: local-probe versus
session-manager routing, preflight and decision-token requirements,
request-scoped approval gates, manager counters, and explicit session-wide/
exec/network/root-grant blocks. It returns no prompts, ids, paths, tokens, raw
approval details, raw events, or app-server payloads. The lifecycle response
also includes sanitized `turnSessionWorkflowContract` metadata derived from the
same summaries: client-side session grouping, local versus managed turn-start
workflow, pending-approval state, one-preflight-token-per-turn-action
requirements, approval workflow visibility, suffix-only targets, and explicit
session-wide/exec/network/root-grant blocks. It returns no prompts, ids, paths,
tokens, raw approval details, raw events, or app-server payloads. The lifecycle
response also includes sanitized `turnSessionSafetyContract` metadata derived
from the same summaries: preflight-token requirements, model-traffic gate
state, request-scoped approval-token requirements, dedicated approval routing,
suffix-only targets, and explicit session-wide/exec/network/root-grant blocks.
It returns no preflight tokens, prompts, ids, paths, decision tokens, raw
approval details, raw events, or app-server payloads. The lifecycle response
also includes sanitized `turnSessionAuditContract` metadata derived from the
same summaries: bounded process-local session ledger state, persistent
approval-audit availability, session/request/event history limits, sanitized
live-event text policy, preflight requirements, request-scoped approval scope,
and explicit session-wide/exec/network/root-grant blocks. It returns no
preflight tokens, prompts, ids, paths, decision tokens, request keys, raw
approval details, raw events, or app-server payloads. The lifecycle response
also includes sanitized
persistent-session-manager state when that opt-in is
enabled: client-started state, active thread/turn suffixes, notification counts,
and pending/resolved approval counts. It does not return prompts, full ids,
cwd, paths, decision tokens, or raw events.

The execution-gate endpoint is a read-only status surface for turn execution and
the approval pipeline. By default it returns the selected workspace id/label,
blocked state, zero pending approvals, disabled browser approval decisions, and
no app-server traffic. When explicit turn-start and approval-forwarding gates
are enabled, it reflects those opt-ins, pending approval counts, and
accept-once forwarding status while keeping session-wide approvals disabled.
It also exposes the sanitized thread lifecycle history count/list for the UI
without returning tokens, prompts, full ids, paths, or raw payloads.
The same payload includes sanitized `turnExecutionReadiness` for the Execution
Gate panel: blocked/local/managed/pending-approval/history state, turn-start
route, preflight requirement, request-scoped approval gates, pending approval
count, history count, and redaction flags only. It returns no preflight tokens,
prompts, full ids, paths, decision tokens, raw approval details, or app-server
payloads.
It also includes sanitized `turnExecutionAuthority` for the same panel:
blocked/model-traffic authority mode, turn-start route, read-only sandbox,
no-network policy, one-preflight-token per turn, request-scoped approval
authority, and hard browser prompt/cwd/sandbox/approval-policy/environment
blocks. It returns no preflight tokens, prompts, full ids, paths, decision
tokens, raw approval details, or app-server payloads.

The approval-decisions endpoint is fail-closed. It can record browser deny
decisions (`decline`, `cancel`, `denied`, `abort`) against sanitized approval
summaries in the turn-session ledger. When both
`CODEX_APP_PORT_ALLOW_SESSION_MANAGER=1` and
`CODEX_APP_PORT_ALLOW_APPROVAL_FORWARDING=1` are enabled, the same endpoint can
forward those deny-only decisions to pending managed app-server approval
requests. If `CODEX_APP_PORT_ALLOW_APPROVAL_DETAILS=1` and
`CODEX_APP_PORT_ALLOW_APPROVAL_ACCEPT=1` are also enabled, pending managed
command and file-change approvals may forward a single `accept` decision.
Session-wide approvals, execpolicy/network amendments, persistent root grants,
permission grants, and local historical approve records remain rejected.
Permissions approvals expose only `decline` and answer app-server with an empty
turn-scoped permission profile. Each pending approval carries a process-local
decision token required by the POST path. Duplicate
decisions for the same request are rejected as process-local replay, and when a
persistent audit log is configured a sanitized replay key prevents a re-created
session/request from accepting a decision already journaled on disk. No raw
command, file-change patch, file content, path, prompt, or token is returned
after a decision is recorded. The same GET response includes a capped
process-local decision history for decisions recorded through this server, with
only sanitized kind, method, suffix, command/file-change counts, decision,
forwarding, audit-log metadata, and per-decision replay-protection mode/scope
flags. It omits decision tokens, request keys, raw approval details, command
text, file-change patches, file contents, paths, prompts, session ids, and full
ids. The same response includes an
`approvalLifecycle` summary for the UI: queue state, queue/history counts,
local versus forwarded result counts, and latest-decision metadata, without
decision tokens, request keys, session identifiers, raw approval details, raw
command text, patches, file contents, paths, prompts, or app-server payloads.
It also includes a sanitized `approvalQueueActions` summary derived from the
queue and policy only: pending, denyable, approvable, and token-required counts,
local/forwarded deny and accept-once availability, visible-subset batch support,
and the batch limit, without returning decision tokens, request keys, session
identifiers, raw approval details, command text, patches, file contents, paths,
prompts, or app-server payloads.
The UI also renders sanitized `approvalManagement` metadata derived from that
same queue, policy, and process-local history: actionable/pending/history state,
visible request counts, local/forwarded deny and accept-once availability,
visible-subset batch support, and explicit rejected privileged-scope flags.
It returns no decision tokens, request keys, session identifiers, raw approval
details, command text, file-change patches, file contents, paths, prompts, or
app-server payloads.
The lifecycle object also includes sanitized `approvalExecutionReadiness`
metadata for the Approvals grid. It is derived only from the queue, queue-action
summary, management summary, policy, and history count, and reports request
counts, actionable state, request-scoped routing, batch support, latest-decision
availability, and explicit session-wide/permission/exec/network/root-grant
blocks without returning tokens, request keys, raw approval details, preview
text, command text, file-change patches, file contents, paths, prompts, ids, or
app-server payloads.
It also exposes `approvalDecisionContract`, derived from the same sanitized
queue, policy, management, and readiness objects. The UI renders the decision
intake mode, accepted decision-kind count, request-scoped token/replay/audit
requirements, local/forwarded deny and accept-once availability, batch support,
and privileged-scope blocks without returning tokens, request keys, raw approval
details, preview text, command text, file-change patches, file contents, paths,
prompts, ids, or app-server payloads.
The approval queue also keeps a client-side selected row and renders a sanitized
detail pane for the visible request. The pane is derived from the already
sanitized queue object and shows only kind/route/state/scope labels, command and
file-change counts, permissions presence, safe decision counts, and audit-policy
flags. It never displays decision tokens, request keys, session ids, raw command
text, patch text, file contents, paths, prompts, raw approval objects, or raw
app-server payloads.
It also exposes `approvalRoutingContract`, derived only from sanitized queue,
policy, action, management, readiness, and history counters. The UI renders
local deny versus managed deny/accept-once routing, route labels, forwarding
gates, token/replay/audit state, and request-scoped privileged-scope blocks
without returning decision tokens, request keys, raw approval details, preview
text, command text, file-change patches, file contents, paths, prompts, ids, or
app-server payloads.
The
desktop launcher also keeps a sanitized append-only JSONL audit log for local
accepted deny decisions, forwarded managed deny decisions, and replay
rejections, plus forwarded managed accept-once decisions. That persistent log
stores command counts and file-change grant-root/preview counts only; it does
not persist file-change basenames, permission profiles, patch text, file
contents, paths, prompts, or decision tokens. File-change accept-once forwarding uses the same sanitized
audit path as command accept-once forwarding. Forwarded managed decisions are
journaled before the browser decision is forwarded, so a
persistent audit-log failure blocks that browser-originated decision.
The GET response also includes a request-scoped approval policy summary for
the UI: local deny, forwarded deny, accept-once gate state, supported approval
kind labels/counts, and explicit rejected session-wide/execpolicy/network/root-
grant scopes/counts. It returns no decision tokens, request keys, raw approval
details, commands, patches, file contents, paths, prompts, or app-server
payloads.
The POST path accepts either one tokenized decision or a bounded `decisions`
array. Batch entries are validated for supported keys, string types, size, NUL
text, duplicate request selectors, and per-request decision tokens before any
decision is recorded or forwarded. Batch `accept` entries are accepted only
when the same request-scoped accept-once gate is enabled; session-wide approval
decisions remain rejected.
The GET response also includes sanitized `approvalWorkflowContract` metadata
for the UI workflow: client-side filters, row decision controls,
visible-subset batch support, replay/audit protection state, detail-preview
gates, request-scoped decision-token requirements, and explicit privileged-scope
blocks. It returns no selectors, tokens, raw approval details, preview text,
commands, patches, file contents, paths, prompts, ids, or app-server payloads.
The same response includes sanitized `approvalSafetyContract` metadata for the
approval safety boundary: request-scoped token requirements, replay protection,
audit persistence, batch validation, forwarding/detail gates, and explicit
rejected session-wide/permission/exec/network/root-grant scopes. It returns no
tokens, request keys, selectors, raw approval details, preview text, commands,
patches, file contents, paths, prompts, ids, or app-server payloads.
The same response includes sanitized `approvalAuditContract` metadata for the
approval audit/replay boundary: bounded decision history, persistent versus
process-local audit mode, replay-protection scope, audit-log path redaction,
batch validation, and hard non-logging flags for decision tokens, request keys,
session identifiers, approval details, command text, patches, file contents,
previews, paths, prompts, and app-server payloads.
The same response includes sanitized `approvalAuthorityContract` metadata for
the browser decision authority boundary: request-scoped local deny, managed
deny, or accept-once authority, command/file-change accept-once limits,
permission-approval rejection, and hard session-wide/permission/exec/network/
root-grant blocks. It returns no tokens, request keys, selectors, raw approval
details, preview text, commands, patches, file contents, paths, prompts, ids,
or app-server payloads.
The same response includes sanitized `approvalInteractionContract` metadata for
the browser interaction boundary: row controls, visible-subset batch controls,
client-side filters, row busy/disabled sibling-button behavior,
refresh-after-decision requirements, published client-side batch limit
enforcement, and request-scoped route/token/audit gates. It returns no tokens,
request keys, selectors, raw approval details, preview text, commands, patches,
file contents, paths, prompts, ids, or app-server payloads.
When `CODEX_APP_PORT_ALLOW_APPROVAL_DETAILS=1` is enabled with managed
approval forwarding, the read-only approval queue may include a bounded
redacted command preview for pending managed command approvals and a bounded
redacted metadata preview for pending managed file-change approvals. File-change
previews may show a sanitized reason and grant-root basename, but never patches
or file contents. Path-like, URL-like, email-like, and token-like substrings
are replaced before reaching the browser; previews are not returned after a
decision is recorded and are not written to the approval audit log. Permissions
approvals show only kind/suffix metadata, cwd basename, safe `decline`, and
permission-presence booleans; the requested permission profile is never
returned. This does not enable session-wide decisions.
The UI renders a dedicated approval queue backed by
`/api/approval-decisions` and polls that queue while a turn-start request is
pending, so managed approval prompts can be denied or, behind the explicit
details plus accept gates, accepted once from the browser without adding
session-wide approvals. The queue can be filtered locally by pending/decided
state, local versus managed source, and command/file-change/permissions kind
without requesting more server data. Each row provides request-scoped deny or
gated accept-once controls that disable while the POST is in flight, use only the
process-local token already attached to that sanitized request, and refresh the
sanitized queue after completion. The queue also provides deny and gated accept
controls for the currently visible filtered subset that apply the first safe
decision exposed for each still-pending request, using the same per-request
decision tokens in one bounded batch capped to the server-advertised limit and
refreshing the sanitized queue once the batch completes. It also renders the
sanitized decision history so a completed decision remains visible without
returning reusable request keys or decision tokens.
The queue also has a dedicated manual refresh control and Manual/Polling/
Refreshing state indicator. That control reuses the existing sanitized
approval, turn-session, and execution-gate refresh paths and does not add API
fields, decision scopes, tokens, raw approval details, commands, patches, file
contents, paths, prompts, ids, or app-server payloads.
The queue summary gives operators counts for local versus managed requests,
safe deny and accept choices, token-required requests,
command/file-change/permissions requests, and redacted preview availability
without exposing the underlying tokens, request keys, session identifiers, raw
approval details, paths, permission profiles, patches, or file contents.
The lifecycle counters on the same panel show pending/history-only/idle state,
local versus forwarded decision result counts, and the latest sanitized
decision label without exposing raw request selectors, approval tokens,
commands, paths, prompts, or app-server payloads.
The action counters in that panel show the currently denyable/approvable queue
counts and bounded visible-subset batch window while keeping per-request tokens,
request keys, raw approval details, and app-server payloads server-side only.
The same execution panel exposes sanitized turn-session lifecycle counters for
pending approval sessions, decided approval sessions, model-traffic sessions,
session-wide approval status, request-scoped approval policy, and rejected
scope count without returning prompts, full ids, paths, tokens, raw approvals,
or raw events.
It also shows turn-session operation and routing counters derived from
`turnSessionOperations`, without exposing prompts, ids, paths, tokens, raw
approval details, raw events, or app-server payloads.
The same panel renders `turnSessionManagement`, a sanitized management summary
for blocked/local/managed/history-only state, enabled operations, manager
counts, request-scoped approval gates, and suffix-only target selection without
prompts, ids, paths, preflight tokens, decision tokens, raw approvals, raw
events, or app-server payloads.
The live-session panel also renders `activeSessionManagement`, a sanitized
management summary for inspectable/actionable/history-only state, suffix-only
selection requirements, enabled single-session controls, bulk scope,
model-traffic control state, and latest sanitized action metadata. It does not
return full ids, prompts, paths, preflight tokens, thread content, or raw
app-server payloads.
It also renders `activeSessionReadiness`, derived only from active-session
operation and management summaries, to show blocked/inspectable/actionable/
history readiness, enabled operation counts, dedicated route usage, and
one-time preflight requirements without returning ids, prompts, paths, tokens,
thread content, or raw app-server payloads.
It also renders `activeSessionRoutingContract`, derived only from the same
sanitized summaries, to show loaded-session inventory routing, dedicated
single-session and bulk control routes, model-traffic steer routing,
session-manager requirements, suffix-only targets, and one-time preflight
requirements without returning ids, prompts, paths, tokens, thread content, raw
control payloads, or app-server payloads.
It also renders `activeSessionWorkflowContract`, derived only from the same
sanitized summaries, to show client-side grouping for inventory,
single-session controls, bulk controls, and history, visible row controls,
route state, suffix-only targets, and one-time preflight requirements without
returning ids, prompts, paths, tokens, thread content, raw control payloads, or
app-server payloads.
It also renders `activeSessionSafetyContract`, derived only from the same
sanitized summaries, to show gated-control safety state, preflight-token
requirements, dedicated control routes, separate model-traffic opt-in for
steering, session-manager requirement for bulk controls, suffix-only targets,
and no session-wide controls without returning ids, prompts, paths, tokens,
thread content, raw control payloads, or app-server payloads.
It also renders `activeSessionAuditContract`, derived only from the same
sanitized summaries, to show bounded process-local control history, persistent
action-audit availability, sanitized action-audit guarantees, dedicated route
requirements, separate model-traffic opt-in for steering, and no session-wide
controls without returning ids, prompts, paths, tokens, thread content, raw
control payloads, or app-server payloads.
It also renders `activeSessionInteractionContract`, derived only from the same
sanitized summaries, to show row draft/preflight controls, bulk control
visibility, client-side grouping, refresh-after-control behavior, route state,
suffix-only targets, one-time preflight requirements, action-audit requirements,
and no session-wide controls without returning ids, prompts, paths, tokens,
thread content, raw control payloads, or app-server payloads.
Session-wide acceptance remains blocked.

Useful options:

```sh
npm run dev -- --port 14570
npm run dev -- --codex /absolute/path/to/codex
npm run dev -- --workspace /absolute/path/to/repo
npm run dev -- --project-root /absolute/path/to/projects
npm run dev -- --thread-limit 12
```

Additional allowed workspaces can also be configured before launch:

```sh
CODEX_APP_PORT_WORKSPACES=/repo/one:/repo/two npm run dev
```

Project roots can also be configured before launch:

```sh
CODEX_APP_PORT_PROJECT_ROOTS=/repo-parent:/other-parent npm run dev
```

The default workspace is always the server process cwd. Extra workspace paths
and discovered projects are resolved by the server at startup, assigned opaque
ids such as `workspace-2`, and exposed to the UI only as basename labels.
Project discovery is opt-in: the server scans only direct children of configured
roots, caps roots and entries, includes only directories with non-symlink `.git`
metadata, skips hidden directories, and refuses symlinked project roots.

Current UI scope:

- app-server connection status
- allowlisted workspace selector
- per-process local API session token
- platform and transport metadata
- effective config summary
- read-only Git worktree branch/worktree inventory without Git subprocesses
- blocked Git branch-switch preflight without Git subprocesses
- opt-in Git branch switch behind one-time preflight token, clean-worktree
  checks, and zero switch-safety risks
- opt-in Git branch creation behind one-time preflight token and direct local
  ref write
- opt-in Git branch deletion behind one-time preflight token and direct local
  loose-ref removal
- opt-in Git commit creation behind one-time preflight token, staged-change
  verification, clean-worktree checks, hooks/GPG/editor disabled, and no
  message/stdin/stdout/stderr/argv disclosure
- opt-in Git worktree create/remove behind one-time preflight token,
  workspace-relative path policy, zero hook/filter/attribute risk for create,
  and no path/stdout/stderr/argv disclosure
- route-specific nested response schemas on all Git branch, commit, and worktree
  POST routes
- Settings/Auth/Apps/MCP/Skills/Plugins boundary with opt-in counts-only
  inventory, including config requirement, app, external config migration,
  account rate-limit, and hook metadata counts, plus integration scope and
  lifecycle summaries without secrets, paths, URLs, raw payloads, tokens,
  targets, arguments, or ungated display names
- opt-in account logout behind one-time preflight token, with `account/logout`
  only and no auth token/account identifier/URL/raw-payload disclosure
- opt-in device-code account login behind one-time preflight token, with
  `account/login/start` only and no login ID/OAuth URL/token/account identifier
  disclosure outside the protected immediate device-code response
- opt-in account login cancel behind one-time preflight token, with
  `account/login/cancel` only, opaque cancel references, and no login reference,
  login ID, auth URL, token, account identifier, path, raw payload, or token echo
- opt-in account credits nudge behind one-time preflight token, with
  `account/sendAddCreditsNudgeEmail` only, `credits`/`usage_limit` validation,
  and no email address, token, account identifier, URL, path, raw payload, or
  token echo
- opt-in account reset credit consumption behind one-time preflight token, with
  `account/rateLimitResetCredit/consume` only, server-generated idempotency key,
  bounded outcome-only UI status, and no idempotency key, quota value, account
  identifier, URL, path, raw payload, or token echo
- sanitized account logout history with method/status/audit metadata only and
  no auth token, account identifier, URL, path, raw payload, or token echo
- sanitized account login history with method/status/audit metadata only and no
  device code, verification URL, login ID, cancel reference, auth token, path,
  raw payload, or token echo
- schema-backed Settings/Auth/Apps/MCP/Skills/Plugins method audit with mutations
  blocked
- MCP tool-call preflight without names, argument echo, schemas, or invocation
- opt-in allowlisted MCP tool calls behind one-time preflight tokens and thread
  suffixes, returning result counts only without names, arguments, output,
  structured content, paths, tokens, or raw payloads
- opt-in MCP server reload behind one-time preflight tokens, returning status
  and response-shape counts only without names, config paths, command details,
  tokens, or raw payloads
- opt-in allowlisted MCP OAuth login behind one-time preflight tokens, returning
  a protected immediate HTTPS authorization URL while histories and audit logs
  omit URLs, server names, tokens, paths, and raw payloads
- read-only Codex app Integrations & MCP settings catalog with static
  keys/groups/states/counts only, and no server names, server URLs, commands,
  environment variables, OAuth URLs/tokens, `config.toml` content/paths, tool
  names, plugin ids, config writes, mutations, or app-server traffic
- MCP resource-read preflight without names, URI echo, content, schemas, or
  app-server traffic, plus opt-in one-time-token MCP resource reads returning
  count-only content metadata
- integration mutation preflight without target/argument echo, tool invocation,
  installs, auth callbacks, settings writes, sharing, or marketplace mutation
- Terminal/Actions boundary with schema-backed method audit, opt-in
  allowlisted `command/exec`, separate opt-in allowlisted `process/spawn`,
  opt-in command/exec terminal control, and shell plus broad filesystem-write
  app-server methods blocked, plus action scope and high-risk blocked-method
  summaries without command/output/session/path/raw-payload disclosure
- terminal command preflight/execution without command echo, argv echo, stdout,
  stderr, cwd, process id, shell access, or unexpected nested response keys
- sanitized terminal command history with status/count metadata only and no
  command, argv, cwd, stdout/stderr, process id, environment, or token echo
- process-spawn preflight/execution without command echo, argv echo, stdout,
  stderr, cwd, environment, process handle, process id, stdin, PTY, streaming, or
  shell access, with no top-level command response key
- sanitized process-spawn history with status/count metadata only and no command,
  argv, executable, cwd, stdout/stderr, environment, process handle/id, or token
  echo
- thread-shell-command preflight/execution without command echo, output text,
  terminal session identifiers, full ids, paths, thread content, or top-level
  command response keys
- terminal control preflight for audited `command/exec/*` and `process/*`
  session-control methods without session id or input echo, and without
  write/resize/terminate execution
- sanitized terminal control preflight/confirmation histories without token,
  session selector/id, input, raw intent, intent hash, output, or control
  execution
- file action preflight without full paths, content echo, or filesystem writes
- sanitized file action history without tokens, paths, basenames, file
  contents, raw intent, intent hashes, or app-server payloads
- active and archived thread metadata without conversation content, with
  client-side search/filtering
- opt-in server-side `thread/search` with suffix/count-only results and no
  search term, snippets, names, previews, full ids, paths, cursors, or raw
  payloads returned
- opt-in destructive `thread/delete` with one-time preflight tokens,
  suffix-only target resolution, sanitized audit records, and no full ids,
  names, previews, paths, thread content, raw payloads, or token return
- selected thread metadata timeline without transcript text
- selected thread transcript text with path redaction and length bounds
- selected thread file-change review with bounded diff previews and no full
  paths
- bounded read-only notification stream with redacted agent-message deltas
- selected-thread notification filtering for the bounded stream
- blocked-by-default loaded-session inventory with opt-in suffix-only reads
- opt-in live-session interrupt/unsubscribe control and separately opt-in
  `turn/steer` control with one-time preflight tokens and suffix/count-only
  responses
- separately opted-in live-session bulk unsubscribe with one-time preflight
  tokens and count-only responses, history, and audit records
- process-local live-session control history with suffix/status/count metadata
  only
- sanitized live-session lifecycle UI with loaded/control counts and explicit
  interrupt/unsubscribe/steer gate status
- richer sanitized live-session lifecycle UI with recent action breakdown,
  succeeded/failed counts, and latest-control method/status/suffix metadata
  without prompts, tokens, full ids, paths, or thread content
- active-session operations UI summary for inventory/control/bulk/routing state
  without prompts, tokens, full ids, paths, thread content, or raw payloads
- blocked execution-gate status for future approvals
- process-local thread lifecycle action history for start/archive/delete/fork/rename/rollback/safety-lock/compact with
  suffix/status/count/token-consumed/audit metadata only
- deny-only browser approval decision intake without app-server forwarding
- request-scoped approval policy UI showing local deny, forwarded deny,
  accept-once, approval kind count, and rejected session-wide/exec/network/root
  scopes without sensitive payloads
- turn draft preflight without model traffic
- blocked-by-default turn-start guard with an opt-in, preflight-tokened real
  start path
- read-only turn-session ledger for sanitized opt-in turn-start records and
  bounded live event snapshots
- turn-session lifecycle UI counters for approval sessions, model-traffic
  sessions, and blocked session-wide approvals
- richer turn-session lifecycle UI counters for pending/decided approval
  sessions, event sessions, model-traffic sessions, and latest suffix/event
  metadata
- sanitized persistent-session-manager lifecycle UI with managed-client state,
  active suffixes, notification counts, and pending/resolved approval counts
- sanitized active-session management UI for suffix-only actionability,
  preflight requirements, bulk scope, and latest control metadata
- sanitized active-session interaction UI for row draft/preflight controls,
  bulk controls, client-side grouping, refresh-after-control behavior,
  suffix-only targets, one-time preflight requirements, and no session-wide
  controls
- gated agent-turn probe surface
- sanitized agent-turn event log
- security guardrail status

This is a browser-hosted prototype for the desktop shell. The packaging decision
for the final Omarchy app remains open.

## Agent Turn Gate

The UI includes an agent-turn probe button, but it is disabled unless the server
was started with:

```sh
CODEX_APP_PORT_ALLOW_AGENT_TURN=1 npm run dev
```

When disabled, `/api/agent-turn` returns `403` and does not touch
`codex app-server`.

When enabled, `/api/agent-turn` accepts only `POST`, starts the fixed
throwaway-thread harness, and returns only sanitized suffix/status data. It does
not accept arbitrary prompts from the browser. Event data is reduced to method
name, status, item type, thread/turn suffixes, and bounded redacted agent-message
deltas; raw payloads are not returned.

## Verification

Run:

```sh
npm run verify
```

The verifier checks that the dev server still refuses non-loopback binds by
default, that local API routes reject missing session tokens, that `/api/status`
returns sanitized thread metadata, that `/api/thread-detail` returns metadata
only, that `/api/thread-transcript` returns bounded sanitized text without raw
paths or thread titles, that `/api/thread-changes` returns file-change metadata
and bounded diff previews without commands, content, or full paths, that
`/api/thread-search` is blocked without app-server traffic by default and
returns suffix/count-only metadata without the search term, snippets, names,
previews, full ids, paths, cursors, or raw payloads when explicitly enabled,
that `/api/event-stream` returns sanitized
notifications and bounded live agent text only with validated thread filtering,
that `/api/live-sessions` is
blocked by default and suffix-only when explicitly enabled, and that its
lifecycle summary exposes only sanitized control breakdown/result/latest-control
metadata without prompt text, tokens, full ids, paths, or thread content, that
`/api/live-session-control` consumes a matching preflight token before any
opt-in interrupt/unsubscribe mutation or separately opted-in `turn/steer` model
traffic, returning no full ids, prompt text, transcript content, paths, or
terminal output, enforcing route-specific nested response schemas, and writing
only sanitized action audit records when configured,
that `/api/live-session-bulk-control` is separately gated by the persistent
session manager plus `CODEX_APP_PORT_ALLOW_LIVE_SESSION_BULK_CONTROL=1` and
returns/logs only count metadata after a matching one-time preflight token while
enforcing route-specific nested response schemas,
that `/api/thread-metadata-update-preflight` validates `thread/metadata/update`
locally without app-server traffic or metadata mutation and omits full ids,
branch names, origin URLs, SHAs, paths, secrets, argument text, and raw payloads,
that `/api/thread-resume-inject-preflight` validates `thread/resume` and
`thread/inject_items` locally without app-server traffic, thread resume, or item
injection and omits full ids, thread content, paths, secrets, argument text, and
raw payloads,
that `/api/thread-realtime-preflight` validates realtime start/audio/text/speech
and stop intent locally without app-server traffic, realtime execution, audio or
text append, or model traffic and omits full ids, thread content, prompt text,
audio data, text, SDP, session ids, paths, secrets, arguments, and raw payloads,
that `/api/thread-guardian-preflight` validates elicitation increment/decrement
and guardian-denied-action approval intent locally without app-server traffic,
counter changes, guarded-action approval, or model traffic and omits full ids,
thread content, guardian event details, paths, secrets, arguments, and raw
payloads,
that opt-in terminal-background cleanup and file actions also write sanitized
action audit records without terminal output, session ids, paths, basenames, or
file contents, that `/api/git-worktree` returns read-only Git metadata
without paths or remote URLs, that `/api/git-branch-preflight` keeps branch
switching blocked without Git subprocesses, that `/api/git-branch-switch`
consumes a matching preflight token before any opt-in Git mutation, that
`/api/git-branch-create` consumes a matching preflight token before any opt-in
local ref write, that `/api/git-branch-delete` consumes a matching preflight
token before any opt-in local loose-ref removal, that
`/api/git-commit` consumes a matching preflight token before any opt-in commit
object/ref write and does not return message text, stdin, stdout, stderr, argv,
or full paths, that
`/api/git-worktree-action` consumes a matching preflight token before any
opt-in worktree create/remove and does not return full paths, stdout, stderr,
or argv, that
`/api/settings-integrations` remains
blocked without app-server traffic by default, that its opt-in inventory is
counts-only for config requirements, account, app/connectors, external config
migration candidates, rate-limit buckets, MCP, skills, plugins, experimental
features, and hooks, that its server-request and server-notification boundaries
remain fail-closed and payload-free,
that successful account login cancel and account logout actions are tracked only
as sanitized method/status/audit history without auth tokens, account
identifiers, URLs, login references, login IDs, paths, raw payloads, or
preflight tokens,
that `/api/mcp-tool-preflight` validates tool-call shape without
names, argument echo, or invocation, that `/api/mcp-tool-call` is opt-in,
allowlist-bound, one-time-tokened, thread-suffix-bound, and count-only without
tool output, arguments, names, paths, tokens, or raw payloads, that
`/api/mcp-server-reload` is opt-in, one-time-tokened, and count-only without
names, config paths, command details, tokens, or raw payloads, that
`/api/mcp-oauth-login` is opt-in, exact-allowlisted, one-time-tokened, and
returns OAuth URLs only in the protected immediate response while histories and
audits omit URLs, names, tokens, paths, and raw payloads, that
schema-backed `/api/mcp-resource-preflight` blocks resource reads without URI/content echo,
that schema-backed `/api/plugin-read-preflight`
blocks plugin detail reads without plugin/marketplace/path echo, that
schema-backed `/api/plugin-read` can execute only as opt-in count-only plugin
metadata traffic without plugin names, paths, URLs, descriptions, skill content,
share context, tokens, or raw payloads, that schema-backed
`/api/plugin-uninstall-preflight` and `/api/plugin-uninstall` can execute only
as opt-in allowlisted count-only plugin mutation traffic without plugin
ids/names, paths, URLs, tokens, or raw payloads, that
schema-backed `/api/plugin-share-action-preflight` blocks plugin share mutations
without share targets, principals, paths, URLs, secrets, target/argument echo,
or app-server traffic, that
schema-backed `/api/external-config-import-preflight` blocks external config
imports without migration items, plugin names, marketplace names, session
titles, commands, hook commands, MCP server names, subagent names, paths, URLs,
secrets, target/argument echo, or app-server traffic, that
schema-backed `/api/review-feedback-preflight` blocks review and feedback
actions without thread ids, branches, SHAs, titles, instructions, feedback
reason, log paths, tags, URLs, secrets, target/argument echo, or app-server
traffic, that
schema-backed `/api/memory-reset-preflight` blocks memory reset execution
without deleting memories, returning memory files/content/paths, or app-server
traffic, that
schema-backed `/api/plugin-content-preflight` blocks plugin skill/share-list
reads without skill text, sharing URLs/principals, plugin/marketplace/path
echo, that schema-backed `/api/plugin-content-read` can execute only as
method-specific opt-in count-only skill/share metadata traffic without skill
text, sharing URLs, principals, names, ids, paths, descriptions, tokens, or raw
payloads, that
`/api/skills-config-write` can execute only as opt-in name-only
`skills/config/write` traffic with `{"enabled":boolean}` and sanitized
target/argument counts plus effective enabled state, without skill names,
paths, argument text, tokens, or raw payloads, that
`/api/skills-extra-roots-clear` can execute only as opt-in empty
`skills/extraRoots/set` traffic with `{"extraRoots":[]}` and sanitized
status/count/shape metadata, without accepting or returning extra roots, paths,
tokens, notifications, or raw payloads, that
`/api/remote-control-disable` can execute only as opt-in defensive
`remoteControl/disable` traffic with `null` params and sanitized
status/count/shape metadata, without accepting browser params or returning
remote-control identities, tokens, notifications, or raw payloads, that
`/api/remote-control-enable-preflight` blocks remote-control enablement without
relay enrollment, pairing codes, app-server traffic, identity/status output,
argument echo, paths, URLs, secrets, or raw payloads, that
`/api/remote-control-pairing-preflight` blocks pairing start/status without
pairing-code creation, claim polling, app-server traffic, pairing-code output,
controller info, identity/status output, argument echo, paths, URLs, secrets,
or raw payloads, that
`/api/remote-control-clients` can execute only as opt-in remote-control client
inventory with server-side environment resolution, opaque refs, and
count/presence metadata, and that `/api/remote-control-client-revoke` can
execute only as opt-in `remoteControl/client/revoke` traffic with a matching
one-time preflight token and server-side ref resolution, without returning or
auditing client ids, environment ids, names, device metadata values, cursors,
tokens, notifications, or raw payloads, that
`/api/config-value-write` can execute only as opt-in allowlisted
`config/value/write` traffic with JSON-text values, one-time tokens, and
`filePath`/`expectedVersion` forced to `null`, returning only count/shape
metadata without key paths, values, config paths, tokens, or raw payloads, that
`/api/plugin-enablement-set` can execute only as opt-in allowlisted plugin
enablement settings traffic with a server-constructed key path, forced `upsert`,
one-time tokens, and boolean values only, returning only plugin-id length,
requested state, and response-shape counts without plugin ids, key paths,
values, config paths, tokens, or raw payloads, that
`/api/config-batch-write` can execute only as opt-in allowlisted
`config/batchWrite` traffic with JSON-text edit arrays, one-time tokens, forced
`filePath`/`expectedVersion` `null`, and reload disabled, returning only
edit/key/value count metadata without key paths, values, config paths, tokens,
or raw payloads, that
`/api/experimental-feature-set` can execute only as opt-in allowlisted
`experimentalFeature/enablement/set` traffic with one-time tokens, returning
only updated/enabled/disabled and response-shape counts without feature names,
enablement values, paths, tokens, or raw payloads, that
`/api/marketplace-action-preflight`
validates marketplace mutation shape without source/ref/path/target/argument
echo, downloads, checkout, materialization, marketplace mutation, or app-server
traffic, that
`/api/integration-action-preflight`
validates audited integration mutation shape without target/argument echo,
tool invocation, installs, auth callbacks, settings writes, sharing, or
marketplace mutation, that successful Settings/MCP/Integrations confirmations
are tracked only as sanitized token-consumed/no-mutation history without
tokens, raw intent, intent hashes, names, targets, arguments, paths, URLs, or
tool invocation, that `/api/terminal-actions` remains blocked without app-server
traffic by default, that `/api/terminal-command-preflight` validates command
shape without command execution or command echo while enforcing route-specific
nested response schemas, that opt-in
`/api/terminal-command` consumes a matching preflight token before sanitized
allowlisted `command/exec` execution under the same response schemas, that
`/api/process-spawn-preflight` validates process command shape without host
process execution or command echo,
that opt-in `/api/process-spawn` consumes a matching preflight token before
sanitized allowlisted `process/spawn` execution without stdin, PTY, streaming,
browser environment, process handles, output text, or top-level command
response keys, that `/api/thread-shell-command` consumes a matching preflight
token before exact-allowlisted session-managed shell command submission and
returns only suffix/count/status metadata under route-specific nested response
schemas, that
`/api/terminal-control-preflight` validates terminal write/resize/terminate
shape for audited `command/exec/*` and `process/*` session-control methods
without session ids, input echo, or terminal control calls, that opt-in
`/api/terminal-control` consumes a matching preflight token before sanitized
command/exec terminal-control execution, and separately gated
`process/writeStdin`, `process/resizePty`, or `process/kill` execution when
`CODEX_APP_PORT_ALLOW_PROCESS_TERMINAL_CONTROL=1` is set, with route-specific
nested response schemas on both terminal-control routes, that
terminal-control histories expose only sanitized counts plus token-issued or
token-consumed status without tokens, selectors, input, raw intent, intent
hashes, output, or control execution, that terminal lifecycle snapshots keep
only method/count/exit metadata and omit output,
stdin, commands, cwd, process handles, and terminal ids, that
`/api/file-action` consumes a matching preflight token before any opt-in
filesystem mutation and returns no path/content data, that file action history
keeps only sanitized action/depth/count/result/audit metadata without tokens,
paths, basenames, contents, raw intent, intent hashes, or app-server payloads,
that the execution gate remains blocked without app-server
traffic, that the turn
preflight does not start model traffic or echo prompt content, that
`/api/turn-start` refuses execution before touching app-server by default, that
the opt-in start path requires and consumes a matching preflight token while
sanitizing its response and session-owned event snapshots, that
`/api/turn-sessions` exposes managed-session lifecycle state only as sanitized
counts, gate flags, client state, and id suffixes without prompts, paths, full
ids, tokens, or raw events, that the
agent-turn gate blocks implicit model traffic, and that the executable source
tree does not contain known high-risk install/runtime patterns such as
`curl | sh`, global npm installs, floating `@latest` package usage, or Electron
`--no-sandbox` flags.

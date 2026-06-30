# Goal

Build a full, secure, maintainable Codex desktop experience for Omarchy/Linux.

The project must not rely on blind execution of remote scripts or unpinned
dependency trees. Any borrowed idea, script, package, or extracted artifact must
be reviewed before use.

## Scope

Target parity with the Codex desktop workflow:

- project selection
- local Codex threads
- concurrent project/thread management
- streamed agent output
- command and file-change approvals
- diff review
- Git/worktree workflows
- terminal/action surfaces
- settings, auth, MCP, skills, plugins where app-server supports them
- Linux desktop integration, including URL handlers

## Non-goals

- Redistribute OpenAI proprietary desktop binaries.
- Execute third-party install scripts with `curl | bash`.
- Patch minified desktop bundles unless a narrower compatibility fallback is
  explicitly chosen and audited.
- Install global npm packages or auto-update binaries without user-visible,
  pinned provenance.

## Facts Checked On 2026-06-30

- The official Codex app documentation describes macOS and Windows desktop
  app features. Linux is still not listed as a desktop app target in the
  checked docs, so this repo remains a native Omarchy/Linux port effort rather
  than a repackaged official Linux client.
- OpenAI documents Codex App Server as the interface for rich clients.
- OpenAI lists Codex CLI, SDK, and App Server as open-source components.
- The stable npm `@openai/codex` latest dist-tag is `0.142.4`; the available
  `0.143.0-alpha.31` alpha dist-tag was not executed or used as a baseline.
- The OpenAI `openai/codex` HEAD checked for source drift is
  `cfead68e5d3984b247cf0758e3e53b19165de848`.
- The local official `codex-cli 0.142.4` app-server schema snapshot contains
  335 JSON Schema files, up from the prior `0.130.0` snapshot of 286.
- The local schema was regenerated into a temporary directory and still
  produced 335 files, matching the committed stable manifest.
- OpenAI HEAD includes `environment/info` and renames/extends the persisted
  item page surface as `thread/items/list`; neither method exists in the
  stable `0.142.4` generated schema, so both are tracked as blocked
  upstream drift until a stable schema exposes them.
- The refreshed protocol adds remote control, permission profiles, account
  usage/credits/messages, remote environments, plugin checkout/install,
  skills extra roots, thread name set/delete/search/settings/background terminal,
  goal/memory/metadata, realtime audio/text/speech, review/feedback,
  filesystem read/watch, fuzzy file search, Windows sandbox, attestation,
  current time, import progress, model safety buffering, and turn moderation
  metadata surfaces that must be classified before parity work continues.
- `permissionProfile/list` has an opt-in, counts-only inventory path; it
  returns profile counts and allowed/blocked totals only, not profile ids or
  descriptions.
- `account/usage/read` and `account/workspaceMessages/read` also have opt-in,
  counts-only inventory paths; they omit token usage values, bucket dates,
  workspace message ids, bodies, timestamps, and raw payloads.
- `externalAgentConfig/import/readHistories` and `plugin/installed` also have
  opt-in, counts-only inventory paths; they omit import ids, paths, messages,
  timestamps, plugin ids, plugin names, plugin paths, URLs, prompts, and raw
  payloads.
- `remoteControl/status/read` has an opt-in, counts-only inventory path; it
  reports status buckets and identity-field presence only, not status strings,
  server names, installation ids, environment ids, or raw payloads.
- `account/sendAddCreditsNudgeEmail` has a separate disabled-by-default
  `POST /api/account-credits-nudge` path behind
  `CODEX_APP_PORT_ALLOW_ACCOUNT_CREDITS_NUDGE=1`; it consumes a matching
  one-time preflight token, accepts only `credits` or `usage_limit`, and returns
  only sanitized status/audit metadata, not email addresses, tokens, account
  identifiers, URLs, cwd, paths, or raw payloads.
- `thread/search` has a separate disabled-by-default `POST /api/thread-search`
  path behind `CODEX_APP_PORT_ALLOW_THREAD_SEARCH=1`; it may send the bounded
  search term to the local app-server, but returns only counts, cursor-presence,
  and suffix/status/source metadata, not the search term, snippets, names,
  previews, full ids, paths, cursors, or raw payloads.
- `thread/goal/get` has a separate disabled-by-default `GET /api/thread-goal`
  path behind `CODEX_APP_PORT_ALLOW_THREAD_GOAL=1`; it resolves the target by
  suffix through `thread/list` and returns only goal presence/status plus
  bounded usage/count metadata, not the objective text, full ids, timestamps,
  paths, or raw payloads.
- `thread/goal/set` and `thread/goal/clear` have separate disabled-by-default
  POST paths behind `CODEX_APP_PORT_ALLOW_THREAD_GOAL_SET=1` and
  `CODEX_APP_PORT_ALLOW_THREAD_GOAL_CLEAR=1`; each requires a matching
  one-time preflight token, resolves the target by suffix through
  `thread/list`, and returns only suffix/status/count metadata, not objective
  text, thread content, full ids, cwd, paths, preflight tokens, or raw payloads.
- `thread/turns/list` has a separate disabled-by-default
  `GET /api/thread-turns` path behind `CODEX_APP_PORT_ALLOW_THREAD_TURNS=1`;
  it resolves the target by suffix through `thread/list`, calls
  `thread/turns/list` with `itemsView:notLoaded`, and returns only turn
  status/count/cursor-presence metadata, not item content, cursor values, full
  ids, timestamps, paths, or raw payloads.
- `thread/turns/items/list` has a separate disabled-by-default
  `GET /api/thread-turn-items` path behind
  `CODEX_APP_PORT_ALLOW_THREAD_TURN_ITEMS=1`; it resolves the thread suffix
  through `thread/list`, resolves the turn suffix through `thread/turns/list`
  with `itemsView:notLoaded`, and returns only item suffix/type/status/count
  metadata plus redaction flags, not message text, prompts, commands, output,
  patches, paths, cursor values, full ids, timestamps, or raw payloads.
- `thread/realtime/listVoices` has a separate disabled-by-default
  `GET /api/thread-realtime-voices` path behind
  `CODEX_APP_PORT_ALLOW_THREAD_REALTIME_VOICES=1`; it sends an empty
  parameter object and returns only voice names that match the official schema
  enum plus default voice names, not unknown strings, SDP, audio, transcript
  content, thread content, ids, paths, model traffic, or raw payloads.
- `fs/getMetadata` and `fs/readDirectory` have a separate disabled-by-default
  `GET /api/fs-directory` path behind `CODEX_APP_PORT_ALLOW_FS_DIRECTORY=1`;
  it accepts only workspace-relative non-hidden directory selectors, rejects
  symlinked path segments before app-server traffic, and returns bounded direct
  child names plus type/count metadata, not absolute paths, relative paths,
  timestamps, file contents, hidden entries, token-like names, URLs, or raw
  payloads.
- `thread/delete` has a separate disabled-by-default destructive
  `POST /api/thread-delete-action` path behind
  `CODEX_APP_PORT_ALLOW_THREAD_DELETE=1`; it consumes a matching one-time
  preflight token, resolves the target by suffix through `thread/list`, and
  returns only suffix/state/method metadata, not full ids, names, previews,
  paths, thread content, preflight tokens, or raw payloads.
- `thread/fork` has a separate disabled-by-default
  `POST /api/thread-fork-action` path behind
  `CODEX_APP_PORT_ALLOW_THREAD_FORK=1`; it consumes a matching one-time
  preflight token, resolves the source by suffix through `thread/list`, calls
  `thread/fork` only with `excludeTurns: true`, and returns only source suffix,
  forked suffix, status/method metadata, and exclude-turns state, not full ids,
  names, previews, paths, thread content, preflight tokens, or raw payloads.
- `thread/rollback` has a separate disabled-by-default destructive
  `POST /api/thread-rollback-action` path behind
  `CODEX_APP_PORT_ALLOW_THREAD_ROLLBACK=1`; it consumes a matching one-time
  preflight token, resolves the target by suffix through `thread/list`, calls
  `thread/rollback` only with a bounded `numTurns` count, and returns only
  suffix/status/method/count metadata, not full ids, names, previews, paths,
  thread content, preflight tokens, or raw payloads.
- `thread/settings/update` has a separate disabled-by-default safety-lock path
  behind `CODEX_APP_PORT_ALLOW_THREAD_SAFETY_LOCK=1`; it consumes a matching
  one-time preflight token, resolves the target by suffix through `thread/list`,
  sends only a fixed safe settings payload (`on-request`, `user`, read-only
  sandbox, network disabled), rejects browser-supplied cwd/model/permissions
  controls by omission from the route contract, and returns only suffix/status
  metadata, not full ids, paths, settings payloads, preflight tokens, or raw
  payloads.
- `thread/memoryMode/set` has a separate disabled-by-default
  `POST /api/thread-memory-mode-set-action` path behind
  `CODEX_APP_PORT_ALLOW_THREAD_MEMORY_MODE_SET=1`; it consumes a matching
  one-time preflight token, resolves the target by suffix through `thread/list`,
  accepts only `enabled` or `disabled`, and returns only suffix/mode/status
  metadata, not full ids, paths, thread content, preflight tokens, or raw
  payloads.
- `skills/extraRoots/set` has a separate disabled-by-default clear-only path
  behind `CODEX_APP_PORT_ALLOW_SKILLS_EXTRA_ROOTS_CLEAR=1`; it consumes a
  matching one-time preflight token, accepts no browser roots/paths/arguments,
  sends only `{"extraRoots":[]}`, and returns only status/count/shape metadata,
  not extra roots, paths, notifications, preflight tokens, or raw payloads.
- `memory/reset` has a separate local-only preflight path. It accepts no browser
  params, requires the official null-params contract, never deletes memories,
  never touches app-server, and returns no memory files, memory content, memory
  paths, secrets, preflight tokens, or raw payloads. There is no memory reset
  execution route.
- `remoteControl/disable` has a separate disabled-by-default defensive path
  behind `CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_DISABLE=1`; it consumes a
  matching one-time preflight token, accepts no browser remote-control params,
  sends `null`, and returns only status/count/shape metadata, not status
  payloads, server names, installation ids, environment ids, notifications,
  preflight tokens, or raw payloads.
- `remoteControl/pairing/start` and `remoteControl/pairing/status` have a
  separate local-only preflight path. It validates draft pairing params with
  count-only `manualCode`, pairing-code input, unknown-param, URL/path, and
  secret-like metadata, but never creates pairing codes, polls claim state,
  calls app-server, or returns codes, controller info, identities, arguments,
  paths, URLs, secrets, preflight tokens, or raw payloads.
- `remoteControl/client/list` and `remoteControl/client/revoke` have dedicated
  disabled-by-default remote connection routes. Listing is gated by
  `CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_LIST=1`, resolves the environment
  server-side, and returns only opaque refs plus count/presence metadata.
  Revoke is separately gated by
  `CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_REVOKE=1`, consumes a matching
  one-time preflight token, resolves real ids only from the server-side ref
  registry, and writes sanitized action audit records without client ids,
  environment ids, names, device metadata values, cursors, tokens, or raw
  payloads.
- The referenced unofficial Linux port converts the macOS DMG into a Linux
  Electron bundle and patches/stubs platform-specific pieces.

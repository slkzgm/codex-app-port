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

## Facts Checked On 2026-06-29

- The official Codex app documentation says the desktop app is available on
  macOS and Windows, with Linux as a notification option.
- OpenAI documents Codex App Server as the interface for rich clients.
- OpenAI lists Codex CLI, SDK, and App Server as open-source components.
- The local official `codex-cli 0.142.4` app-server schema snapshot contains
  335 JSON Schema files, up from the prior `0.130.0` snapshot of 286.
- The refreshed protocol adds remote control, permission profiles, account
  usage/credits/messages, remote environments, plugin checkout/install,
  skills extra roots, thread name set/delete/search/settings/background terminal
  controls, realtime speech, attestation, current time, import progress,
  model safety buffering, and turn moderation metadata surfaces that must be
  classified before parity work continues.
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
- `thread/search` has a separate disabled-by-default `POST /api/thread-search`
  path behind `CODEX_APP_PORT_ALLOW_THREAD_SEARCH=1`; it may send the bounded
  search term to the local app-server, but returns only counts, cursor-presence,
  and suffix/status/source metadata, not the search term, snippets, names,
  previews, full ids, paths, cursors, or raw payloads.
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
- The referenced unofficial Linux port converts the macOS DMG into a Linux
  Electron bundle and patches/stubs platform-specific pieces.

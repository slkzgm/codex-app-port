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
  filesystem read/watch, fuzzy file search, Windows sandbox, tool input,
  dynamic tool-call, MCP elicitation, auth-token refresh, attestation, current
  time, import progress, model safety buffering, and turn moderation metadata
  surfaces that must be classified before parity work continues.
- `/api/settings-integrations` now exposes fail-closed
  `serverRequestBoundary` and `serverNotificationBoundary` summaries for the
  non-approval server requests and sensitive server notifications in that
  refreshed protocol. They are method/category/count/flag only and do not handle
  browser responses or return prompts, schemas, tool arguments, auth or
  attestation tokens, current-time values, realtime transcripts/audio/SDP,
  moderation/progress details, paths, URLs, raw requests, raw notifications, or
  raw app-server payloads.
- `/api/settings-integrations` now also exposes a read-only Codex app Settings
  parity summary aligned to the current official Settings section list, with
  static section keys/states/counts only and no local setting values, profile
  names, paths, URLs, secrets, raw payloads, app-server payloads, browser
  handlers, or settings writes.
- The same summary now includes a read-only General settings catalog for the
  official file-opening location, command-output display, terminal tab default,
  multiline prompt submission, and prevent-sleep controls. It returns only
  keys, groups, states, sources, and counts; current values, local file-open
  targets, command-output preferences, terminal preferences, sleep-prevention
  state, paths, URLs, secrets, raw payloads, mutations, and app-server traffic
  remain blocked.
- The same summary now includes a read-only Profile settings catalog for the
  official activity insights, token metrics, profile detail update surfaces,
  profile-card sharing, and invitation controls. It returns only keys, groups,
  states, sources, and counts; activity metrics, token values, profile pictures,
  display names, usernames, profile cards, profile-card sharing URLs,
  invitation eligibility or links, paths, URLs, secrets, raw payloads,
  mutations, and app-server traffic remain blocked.
- The same settings parity summary now includes a read-only keyboard-shortcuts
  catalog with static official/local shortcut keys, bindings, states, sources,
  and counts only; custom/user bindings, command labels, keystroke search,
  reset/edit mutations, paths, URLs, secrets, raw payloads, and app-server
  traffic remain blocked.
- The same summary now includes a read-only Agent configuration settings
  catalog for the official shared CLI/IDE configuration inheritance, in-app
  common controls, advanced `config.toml` editing surface, Codex security
  reference, and config-basics reference. It returns only keys, groups, states,
  sources, and counts; current config values, `config.toml` content or paths,
  model settings, sandbox settings, approval settings, instruction values,
  security policy values, paths, URLs, secrets, raw payloads, config writes,
  mutations, and app-server traffic remain blocked.
- The same summary now includes a read-only Appearance settings catalog for the
  official base theme, color, font, and custom-theme sharing controls. It
  returns only keys, groups, states, sources, and counts; active theme values,
  color values, font names, custom theme payloads, sharing URLs, paths, secrets,
  raw payloads, mutations, and app-server traffic remain blocked.
- The same summary now includes a read-only Codex pets settings catalog for the
  official pet picker, `/pet`, Wake Pet, Tuck Away Pet, custom-pet refresh, and
  `hatch-pet` install surfaces. It returns only keys, groups, states, sources,
  and counts; selected pet values, pet names, custom pet assets, local Codex
  home scans, overlay state, active-thread overlay data, skill install/reload,
  slash-command execution, paths, URLs, secrets, raw payloads, mutations, and
  app-server traffic remain blocked.
- The same summary now includes a read-only Git settings catalog for the
  official branch-naming, force-push, commit-message prompt, and pull-request
  description prompt controls. It returns only keys, groups, states, sources,
  and counts; branch naming values, force-push preferences, prompt text,
  generated commit or pull-request text, repository names, repository paths,
  remote URLs, paths, URLs, secrets, raw payloads, mutations, and app-server
  traffic remain blocked.
- The same summary now includes a read-only Integrations & MCP settings catalog
  for the official external-tool MCP connections, recommended servers, custom
  servers, OAuth authentication, shared CLI/IDE `config.toml`, and
  plugin-provided MCP server surfaces. It returns only keys, groups, states,
  sources, counts, and redaction flags; server listings, server names,
  recommended or custom server names, server URLs, command details, environment
  variables, bearer-token environment variables, OAuth URLs or tokens,
  `config.toml` content or paths, tool names, tool allowlists, server
  instructions, plugin ids, setting values, config writes, mutations, paths,
  URLs, secrets, raw payloads, and app-server traffic remain blocked.
- `/api/settings-integrations` now also exposes a read-only Skills & Plugins
  catalog aligned to the official Skills and Plugins documentation. It returns
  only static keys, groups, states, sources, counts, and redaction flags for
  skills progressive disclosure, skill scope locations, skill enablement
  config, optional skill app metadata, plugin directory browsing, bundled
  skills/apps/MCP capabilities, plugin permissions/data-sharing, plugin
  disable config, and local install/share/marketplace/preflight plus opt-in
  read/uninstall/enablement/share-checkout/skills-config boundaries. It does
  not return skill names, descriptions, paths, content, scripts, metadata,
  dependency tools, plugin names, ids, paths, URLs, descriptions, manifests,
  default prompts, screenshots, marketplace names or sources, app names, MCP
  server names, hook commands, share links or principals, setting values,
  secrets, raw payloads, app-server traffic, external code, installs,
  uninstalls, enablement writes, config writes, extra-root writes, share
  mutations, or marketplace mutations.
- `/api/settings-integrations` now also exposes a read-only Codex Sites catalog
  aligned to the official Sites plugin documentation. It returns only static
  keys, groups, states, sources, counts, and redaction flags for hosted website,
  web app, and game workflows, project/version/deployment concepts, supported
  site shapes, D1/R2 storage guidance, workspace or external identity options,
  access modes, runtime environment values, review-before-share guidance, and
  local high-risk boundaries. It does not return Sites projects, project ids,
  `.openai/hosting.json`, storage bindings, version ids, deployment URLs,
  production URLs, access modes, audiences, user groups, environment keys or
  values, secrets, migrations, build output/logs, source commits, plugin names,
  local paths, setting values, site content, screenshots, raw payloads, or
  app-server traffic, and it does not create sites, save versions, deploy,
  change access, write environment values/secrets, start builds, provision
  storage, install plugins, access network, read/write files, or mutate Sites.
- `/api/settings-integrations` now also exposes a read-only Codex Permissions
  catalog aligned to the official Permissions documentation. It returns only
  static keys, groups, states, sources, counts, and redaction flags for
  filesystem access levels and precedence, supported path forms, workspace-root
  scoping, deny exact/glob rules, glob scan depth, network domain and proxy
  rules, local/private-network guardrails, Unix socket rules, migration from
  older sandbox settings, built-in profiles, `danger-full-access` caution, and
  managed requirements. It does not return permission profiles, profile names,
  filesystem rules, paths, access values, deny globs, glob patterns, workspace
  roots, network rules, domains, proxy URLs, local/private policy values, Unix
  socket paths, sandbox modes, managed requirements, `config.toml`, platform
  paths, setting values, secrets, raw payloads, or app-server traffic, and it
  does not write profiles/rules, expand globs/workspace roots, migrate
  sandbox settings, access network, read/write files, or mutate permissions.
- `/api/settings-integrations` now also exposes a read-only Codex Plugin Build
  catalog aligned to the official Build plugins documentation. It returns only
  static keys, groups, states, sources, counts, and redaction flags for plugin
  creator scaffolding, local marketplace entries, repo/personal marketplace
  locations, marketplace source/display fields, marketplace CLI actions,
  minimal plugin manifests, stable plugin names, bundled skills/MCP configs,
  local repo/personal install flows, restart requirements, workspace sharing,
  admin sharing disablement, and marketplace-vs-workspace distribution. It
  does not return plugin manifests, plugin names, versions, descriptions,
  skill names/content, MCP configs, app integrations, marketplace files,
  entries, names, sources, paths, display names, local plugin paths, workspace
  principals, share links, admin requirements, command text, external code,
  paths, URLs, secrets, raw payloads, or app-server traffic, and it does not
  scaffold plugins, write marketplaces, write manifests, copy plugins, share
  plugins, run marketplace CLI commands, materialize external code, access
  files, or mutate plugin authoring state.
- `/api/settings-integrations` now also exposes a read-only Codex Hooks catalog
  aligned to the official Hooks documentation. It returns only static keys,
  groups, states, sources, counts, and redaction flags for default enablement,
  feature disable keys, deprecated aliases, managed disable requirements,
  multiple/concurrent hook runtime behavior, trust review, turn/thread scoped
  events, `hooks.json` and inline config sources, plugin-bundled hooks, project
  trust boundaries, managed hooks, bypass-trust guidance, config shape, command
  handler fields, unsupported handler types, matcher semantics, and supported
  matcher events. It does not return hook files, paths, commands, matchers,
  keys, sources, status messages, timeouts, trust hashes, outputs, input
  payloads, configs, plugin ids, admin requirements, feature values, URLs,
  secrets, raw payloads, or app-server traffic, and it does not execute
  commands, trust hooks, disable hooks, bypass hook trust, write hook configs,
  read/write files, or mutate hook state.
- `/api/settings-integrations` now also exposes a read-only Codex Record &
  Replay catalog aligned to the official Record & Replay documentation. It
  returns only static keys, groups, states, sources, counts, and redaction
  flags for macOS/regional availability, Computer Use requirements,
  demonstrated workflow use cases, skill generation, Plugins menu start flow,
  recording permission, focused demonstration guidance, workflow inspection,
  skill replay, current-environment tool reuse, sensitive-data avoidance,
  post-recording skill refinement, plugin packaging escalation, managed
  requirements, and local recording/replay boundaries. It does not return
  availability values, region eligibility, Computer Use state, recording
  prompts, workflow inputs, screen content, window content, desktop actions,
  recording artifacts, generated skills, skill content or names, app names,
  plugin ids, managed requirements, permission states, paths, URLs, secrets,
  raw payloads, or app-server traffic, and it does not start recordings,
  replay workflows, write skills, invoke Computer Use, run browser/plugin
  actions, start permission prompts, access files/network, or mutate Record &
  Replay state.
- `/api/settings-integrations` now also exposes a read-only Codex Rules catalog
  aligned to the official Rules documentation. It returns only static keys,
  groups, states, sources, counts, and redaction flags for `.rules` file
  locations, active config-layer scanning, project trust boundaries,
  `prefix_rule` shape/pattern/decision/example concepts, user allow-list
  writes, Smart approval suggestions, admin-enforced requirements, command
  prefix matching, shell-wrapper splitting/fallback behavior, `execpolicy`
  testing, and Starlark syntax. It does not return rule files, rule paths,
  rule content, prefix patterns, decision values, justifications, match
  examples, config layers, admin requirements, command text, shell scripts,
  execpolicy results, Starlark content, paths, URLs, secrets, raw payloads, or
  app-server traffic, and it does not write rule files, write prefix rules,
  write command policies, create Smart approval rules, run execpolicy checks,
  parse shell scripts, execute commands, read/write files, or mutate rules.
- `/api/settings-integrations` now also exposes a read-only Automations catalog
  aligned to the official Codex app Automations documentation. It returns only
  static keys, groups, states, sources, counts, and redaction flags for the
  automations pane, Triage inbox concept, standalone/project/thread automation
  modes, custom schedules, worktree/local run modes, model/reasoning defaults,
  skills/plugins usage, prompt drafting, run review, worktree cleanup, sandbox
  security, managed-requirement fallback, and local create/update/schedule/run/
  triage/worktree boundaries. It does not return automation names, run ids,
  run results, triage items, findings, prompt text, schedules, cron
  expressions, project names, workspace or worktree paths, model or reasoning
  values, skill or plugin names, sandbox/admin policy values, app names,
  notification payloads, secrets, raw payloads, app-server traffic, filesystem
  access, network access, app control, unattended execution, schedule writes,
  run starts, run archives, worktree creation, or automation mutations.
- `/api/settings-integrations` now also exposes a read-only Codex app Commands
  catalog aligned to the official Codex app Commands documentation. It returns
  only static keys, groups, states, sources, counts, and redaction flags for
  documented general/thread keyboard shortcuts, slash commands, thread/settings/
  skills/automations/plugin/pet deep-link destinations, and local execution
  boundaries. It does not return shortcut bindings, custom shortcuts, slash
  command text, deep-link templates, query parameters, thread ids, prompt text,
  workspace paths, origin URLs, SSH host aliases, plugin identifiers,
  marketplace names or paths, pet names, pet image URLs, paths, URLs, secrets,
  raw payloads, app-server traffic, browser launches, settings opens, command
  execution, slash-command execution, deep-link opening, or mutations.
- `/api/settings-integrations` now also exposes a read-only Codex Chrome
  extension catalog aligned to the official Codex Chrome extension
  documentation. It returns only static keys, groups, states, sources, counts,
  and redaction flags for signed-in browser-state use cases, setup through
  Plugins, extension permissions, website allow/block workflows, browser
  history prompts, Memories/data-control boundaries, troubleshooting, file
  upload file-access setup, and local high-risk boundaries. It does not return
  extension state, Chrome profile data, site hosts, allowlists, blocklists,
  browser history entries, page content, screenshots, bookmarks, downloads,
  tab groups, permission states, memory content, plugin names, setting values,
  paths, URLs, secrets, raw payloads, or app-server traffic, and it does not
  touch native hosts, launch Chrome, install extensions/plugins, allow
  websites, read browser history, enable file access, access network, or
  mutate Chrome extension state.
- `/api/settings-integrations` now also exposes a read-only Codex In-app
  Browser catalog aligned to the official Codex In-app Browser documentation.
  It returns only static keys, groups, states, sources, counts, and redaction
  flags for shared rendered previews, web-app debugging, visual comments,
  local/file/public preview targets, unsupported auth/profile/cookie/extension
  cases, Browser Use, website approval settings, review flows, annotation
  shortcuts, styling feedback, scoped browser tasks, and full-CDP developer-mode
  boundaries. It does not return browser state, URLs, page content,
  screenshots, downloads, DOM, styles, console output, network traffic, cookies,
  browser profiles, extension state, existing tabs, comment text, annotations,
  styling values, plugin names, setting values, routes, visual states, site
  hosts, allowlists, blocklists, paths, secrets, raw payloads, or app-server
  traffic, and it does not launch browsers, navigate pages, start Browser Use,
  execute inspection JavaScript, create comments or styling feedback, start CDP,
  access network, or mutate browser state.
- `/api/settings-integrations` now also exposes a read-only Codex app Features
  catalog aligned to the official Codex app Features documentation. It returns
  only static keys, groups, states, sources, counts, and redaction flags for
  multitasking across projects, skills, automations, Local/Worktree/Cloud
  modes, built-in Git, worktrees, integrated terminal, local-environment
  actions, Windows sandbox, voice dictation, pop-out windows, in-app browser,
  Browser Use, Computer Use, non-code artifacts, task sidebar, IDE sync,
  thread automations, approvals/sandboxing, MCP, web search, and image
  generation plus local high-risk boundaries. It does not return project names,
  thread ids or content, mode selections, workspace/worktree paths, cloud
  environment names, diff content, terminal output, command text, local action
  definitions, voice audio, transcripts, window state, browser URLs/content/
  screenshots, desktop screenshots, app identifiers, artifact content or
  paths, IDE file context/state, web-search queries/results, generated images,
  image prompts, MCP server names, skill or automation names, setting values,
  secrets, raw payloads, app-server traffic, model traffic, network access,
  filesystem access, browser launch, desktop control, voice capture, web
  search, image generation, or mutations.
- The same summary now includes a read-only Browser settings catalog for the
  official Browser plugin, Chrome extension, site permission, ask-before-use,
  and full-CDP developer-mode controls. It returns only keys, groups, states,
  sources, and counts; plugin/extension state, allowed/blocked site lists,
  origins, website permission values, CDP state, organization policy, Chrome
  profile data, browser launch, network traffic, paths, URLs, secrets, raw
  payloads, mutations, and app-server traffic remain blocked.
- The same summary now includes a read-only Computer Use settings catalog for
  the official availability, plugin install, system permission, app approval,
  Windows app policy, locked-use, sensitive-action approval, and safety
  guidance surfaces. It returns only keys, groups, states, sources, and counts;
  plugin install state, Screen Recording or Accessibility permission state,
  allowed or denied app lists, app identifiers, window titles, screen content,
  screenshots, clipboard state, locked-use state, admin policy, desktop
  control, permission prompts, paths, URLs, secrets, raw payloads, mutations,
  and app-server traffic remain blocked.
- The same summary now includes a read-only Notifications settings catalog for
  the official turn-completion and permission-prompt controls plus the local
  server-notification boundary. It returns only keys, groups, states, sources,
  and counts; notification values, browser permission state, subscriptions,
  notification payloads, browser Notification API prompts, paths, URLs, secrets,
  raw payloads, and app-server traffic remain blocked.
- The same summary now includes a read-only Personalization settings catalog for
  the official personality modes and custom-instructions boundary. It returns
  only keys, groups, states, sources, and counts; the active personality,
  custom instructions, personal `AGENTS.md` content or paths, paths, URLs,
  secrets, raw payloads, mutations, and app-server traffic remain blocked.
- The same summary now includes a read-only Context-aware Suggestions settings
  catalog for documented follow-up and resume suggestions when starting or
  returning to Codex. It returns only keys, groups, states, sources, and counts;
  suggestion text, task content, thread content or ids, project/workspace names,
  source context, ranking signals, resume targets, paths, URLs, secrets, raw
  payloads, mutations, generation triggers, and app-server traffic remain
  blocked.
- The same summary now includes a read-only Memories settings catalog for the
  official global enablement, config flag, generation/use controls,
  external-context privacy control, rate-limit threshold, extraction and
  consolidation model controls, per-thread controls, review-memory-files
  boundary, and local memory-reset preflight boundary. It returns only keys,
  groups, states, sources, and counts; current values, config values, memory
  files, memory content, memory paths, storage paths, per-thread choices,
  rate-limit values, model names, generation/injection triggers, reset
  execution, paths, URLs, secrets, raw payloads, mutations, and app-server
  traffic remain blocked.
- The same summary now includes a read-only Archived threads settings catalog
  for the official archived-list, date metadata, project-context, and unarchive
  action surfaces. It returns only keys, groups, states, sources, and counts;
  archived thread lists, dates, project context, thread names, ids, content,
  unarchive execution, paths, URLs, secrets, raw payloads, mutations, and
  app-server traffic remain blocked.
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
- `thread/realtime/start`, `thread/realtime/appendAudio`,
  `thread/realtime/appendText`, `thread/realtime/appendSpeech`, and
  `thread/realtime/stop` have only a local-only
  `POST /api/thread-realtime-preflight` path; it validates selected-thread
  intent and official argument shapes without app-server traffic, realtime
  execution, model traffic, audio/text/speech append, or stop side effects, and
  returns only enum/count/presence metadata with no full ids, thread content,
  prompt text, audio data, text, SDP, session ids, paths, secrets, or raw
  payloads.
- `thread/increment_elicitation`, `thread/decrement_elicitation`, and
  `thread/approveGuardianDeniedAction` have only a local-only
  `POST /api/thread-guardian-preflight` path; it validates selected-thread
  intent and official argument shapes without app-server traffic, thread-state
  mutation, counter changes, guarded-action approval, or model traffic, and
  returns only count/presence metadata with no full ids, thread content,
  guardian event details, paths, secrets, or raw payloads.
- `fs/getMetadata` and `fs/readDirectory` have a separate disabled-by-default
  `GET /api/fs-directory` path behind `CODEX_APP_PORT_ALLOW_FS_DIRECTORY=1`;
  it accepts only workspace-relative non-hidden directory selectors, rejects
  symlinked path segments before app-server traffic, and returns bounded direct
  child names plus type/count metadata, not absolute paths, relative paths,
  timestamps, file contents, hidden entries, token-like names, URLs, or raw
  payloads.
- `fs/readFile` has only a local `POST /api/fs-read-file-preflight` guard for
  now. It validates a workspace-relative visible path shape, issues a local
  confirmation token, and keeps execution blocked without filesystem reads,
  app-server traffic, path/basename disclosure, file contents, `dataBase64`, or
  raw payloads.
- `fs/watch` and `fs/unwatch` have only a local
  `POST /api/fs-watch-preflight` guard for now. It validates
  workspace-relative visible path shape for watch, safe watch-id shape for both
  methods, and keeps execution blocked without watcher creation/removal,
  `fs/changed` subscriptions, app-server traffic, path/canonical-path/basename
  disclosure, watch-id disclosure, handles, notifications, or raw payloads.
- `fuzzyFileSearch/sessionStart`, `fuzzyFileSearch/sessionUpdate`, and
  `fuzzyFileSearch/sessionStop` have only a local
  `POST /api/fuzzy-file-search-preflight` guard for now. It validates
  workspace-relative visible roots, query length, and safe session-id shape,
  and keeps execution blocked without search session lifecycle changes,
  app-server traffic, returned roots, query text, session ids, file names,
  paths, scores, match indices, notifications, or raw payloads.
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
- `thread/metadata/update` has a separate local-only preflight path. It accepts
  only optional `gitInfo` branch/origin/SHA shape, rejects unsupported keys and
  unsafe values before app-server traffic, never mutates metadata, and returns
  only count/presence metadata, not full ids, branch names, origin URLs, SHAs,
  paths, secrets, arguments, preflight tokens, or raw payloads. There is no
  metadata update execution route.
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

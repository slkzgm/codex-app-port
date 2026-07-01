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

## Facts Checked On 2026-07-01

- The official Codex app documentation describes macOS and Windows desktop
  app features. Linux is still not listed as a desktop app target in the
  checked docs, so this repo remains a native Omarchy/Linux port effort rather
  than a repackaged official Linux client.
- OpenAI documents Codex App Server as the interface for rich clients.
- OpenAI lists Codex CLI, SDK, and App Server as open-source components.
- The stable npm `@openai/codex` latest dist-tag is `0.142.5`; the available
  `0.143.0-alpha.32` alpha dist-tag was not executed or used as a baseline.
- The OpenAI `openai/codex` HEAD checked for source drift is
  `db887d03e1f907467e33271572dffb73bceecd6b`.
- The local official `codex-cli 0.142.5` app-server schema snapshot contains
  335 JSON Schema files, up from the prior `0.130.0` snapshot of 286.
- The local schema was regenerated into a temporary directory and still
  produced 335 files, matching the committed stable manifest.
- OpenAI HEAD includes `environment/info` and renames/extends the persisted
  item page surface as `thread/items/list`; neither method exists in the
  stable `0.142.5` generated schema, so both are tracked as blocked
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
- `/api/settings-integrations` now also exposes a read-only Codex
  Authentication catalog aligned to the official Authentication and sessions
  documentation. It returns only static keys, groups, states, sources, counts,
  and redaction flags for sign-in methods, session and credential-storage
  guidance, headless/device-code flows, provider auth modes, MFA/SSO, custom CA
  bundles, and CI/CD references; account/workspace ids, tokens, API keys,
  device codes, verification URLs, OAuth callbacks, auth caches/files,
  credential-store state, logs, CA paths, provider envs, billing/entitlement
  values, commands, URLs, paths, secrets, raw payloads, app-server traffic, auth
  reads, login/logout, network/filesystem access, model traffic, and mutations
  remain blocked.
- `/api/settings-integrations` now also exposes a read-only Codex Access tokens
  catalog aligned to the official access-token documentation. It returns only
  static keys, groups, states, sources, counts, and redaction flags for
  ChatGPT workspace identity automation, Business/Enterprise availability,
  admin-console creation, credential-choice guidance, non-interactive CLI
  usage, governance, secret storage, trusted-runner risks, finite expiration,
  permission model, troubleshooting, and related docs. It does not return token
  names, token values, prefixes, hashes, user or workspace identities/names,
  admin URLs, secret-manager locations, CI secret names, expiration values,
  auth storage paths, environment values, command text, governance records,
  permission states, paths, URLs, secrets, raw payloads, or app-server traffic,
  and it does not create/list/revoke/rotate/persist tokens, run `codex login`,
  run `codex exec`, trigger workspace agents, open admin consoles, read
  environment variables, read auth storage, access files/network, or mutate
  auth state.
- `/api/settings-integrations` now also exposes a read-only Codex Admin Setup
  catalog aligned to the official enterprise admin setup guide. It returns only
  static keys, groups, states, sources, counts, and redaction flags for
  security/privacy posture, rollout owners, local/cloud surface selection,
  workspace toggles, access-token and device-code setup, GitHub/Slack/cloud
  prerequisites, RBAC, Codex Admin responsibilities, managed
  `requirements.toml` policy rollout, Team Config, repository connection, and
  least-privilege GitHub token guidance. It does not return workspace setting
  values, enterprise policy values, owner/group/user/role/policy names, user
  emails, policy contents, requirements snippets, admin or analytics URLs,
  compliance API data, GitHub org/repo/token data, Slack workspace data,
  allowlist domains, environment names, Team Config paths, config paths, URLs,
  paths, secrets, raw payloads, or app-server traffic, and it does not open
  admin consoles or analytics, call compliance APIs, start GitHub connectors,
  look up user policies, read/write Team Config files, mutate RBAC, workspace
  settings, managed policies, Slack settings, cloud environments, or internet
  allowlists.
- `/api/settings-integrations` now also exposes a read-only Codex Auto-review
  catalog aligned to the official Auto-review guide. It returns only static
  keys, groups, states, sources, counts, and redaction flags for reviewer-swap
  behavior, interactive approval requirements, escalation triggers, blocked
  risk categories, reviewer context, denial behavior, rejection circuit breaker,
  timeout semantics, explicit denial override, managed/local policy
  configuration, review-volume guidance, transcript retention, and documented
  limits. It does not return approval requests, reviewer rationales,
  transcripts, tool calls or outputs, prompt text, user messages, policy
  content, denial records, override markers, session transcript paths, config
  policies, paths, URLs, secrets, raw payloads, or app-server traffic, and it
  does not start reviewer agents, forward approvals, apply overrides, read
  config or session transcripts, change sandbox/network/writable-root/protected
  path policy, create model traffic, access files/network, or mutate
  Auto-review state.
- `/api/settings-integrations` now also exposes a read-only Codex Chronicle
  catalog aligned to the current official Chronicle guide. It returns only
  static keys, groups, states, sources, counts, and redaction flags for the
  research preview, Pro/macOS availability, Screen Recording and Accessibility
  permissions, Memories prerequisites, consent/setup controls, pause/disable
  controls, screen-context augmentation, background agents, rate-limit pressure,
  privacy guidance, temporary capture retention, unencrypted local Markdown
  memories, memory summarization/loading, selected frame/OCR/timing processing,
  server-side memory generation, data-control implications, and prompt
  injection risk. It does not return availability values, plan names, platform
  states, memory setting values, screen content, captures, window titles, app
  names, browser/document/dashboard/PR/meeting/communication context, capture
  paths, memory paths/content, generated summaries, prompt context, rate-limit
  values, paths, URLs, secrets, raw payloads, or app-server traffic, and it
  does not start background agents, screen recording, menu-bar controls,
  settings writes, memory generation/injection, capture reads, memory-file
  reads, model traffic, filesystem/network access, or Chronicle mutations.
- `/api/settings-integrations` now also exposes a read-only Codex Security
  catalog aligned to the current official Codex Security docs. It returns only
  static keys, groups, states, sources, counts, and redaction flags for plugin
  overview, authorized code assessment, local plugin setup, first scan workflow,
  setup workspace confirmation, scan context, findings workspace, reports,
  structured artifacts, standard/deep/code-change/backlog/fix/export
  workflows, CLI install guidance, cloud research preview, connected GitHub
  repository scanning, commit-by-commit context, validation evidence, suggested
  fixes, access plans, environment prerequisites, initial backfill, findings
  review, and threat-model editing. It does not return plugin install state,
  scan prompts, setup workspaces, repository/branch/commit identity, scan
  areas, threat model guidance, findings, evidence, code excerpts, file paths,
  report paths, artifact paths/content, export artifacts, issue or PR payloads,
  destinations, GitHub org/repo names, environment names, cloud scan states,
  validation outputs, model/reasoning values, paths, URLs, secrets, raw
  payloads, or app-server traffic, and it does not install plugins, start
  local/deep/cloud scans, export findings, track issues, create remediation,
  write threat models/config, create model traffic, access files/network, or
  mutate Codex Security state.
- `/api/settings-integrations` now also exposes a read-only Codex Open Source
  catalog aligned to the current official Open Source docs. It returns only
  static keys, groups, states, sources, counts, and redaction flags for Codex
  CLI, SDK, app-server, skills, universal cloud environment, closed IDE/web
  surfaces, the Codex for OSS program, issue tracker, discussion forum, and
  issue-report metadata guidance. It does not return component names,
  repository URLs, issue URLs, discussion URLs, program application URLs,
  component versions, issue/discussion/contribution content, external code,
  paths, URLs, secrets, raw payloads, or app-server traffic, and it does not
  fetch repositories, create issues, post discussions, submit contributions,
  start OSS program applications, access files/network, or import code.
- `/api/settings-integrations` now also exposes a read-only Codex Windows
  Platform catalog aligned to the current official Windows platform docs. It
  returns only static keys, groups, states, sources, counts, and redaction flags
  for native Windows app workflows, Microsoft Store and winget install
  guidance, enterprise Store distribution, preferred editor and integrated
  terminal settings, elevated/unelevated sandbox modes, WSL2 Linux sandbox
  routing, config.toml sandbox settings, managed sandbox requirements, private
  desktop behavior, full-access risk, Windows version guidance, winget/admin
  prerequisites, sandbox read-dir guidance, WSL2 use cases, WSL1 support
  cutoff, VS Code WSL workflow, repository placement, Explorer access,
  developer tools, GitHub CLI auth, administrator launch, PowerShell policy,
  local environment scripts, settings directory sharing with WSL, Git detection, and
  Cmder troubleshooting. It does not return platform values, Windows versions,
  sandbox modes, private desktop values, managed policies, config values,
  commands, Store URLs, default editor or terminal settings, developer tool
  state, GitHub auth state, PowerShell policy values, settings directory paths, WSL
  distributions, WSL/Windows/repository paths, VS Code or winget state,
  administrator/firewall/user/install state, paths, URLs, secrets, raw payloads,
  or app-server traffic, and it does not configure sandboxes, change private
  desktop settings, write managed policy, modify firewall/users, install WSL,
  invoke winget, open VS Code, launch the Store, start GitHub auth, sync the
  settings directory, execute commands, access files/network, or mutate
  Windows/WSL state.
- `/api/settings-integrations` now also exposes a read-only Codex Bedrock
  catalog aligned to the current official Amazon Bedrock guide. It returns only
  static keys, groups, states, sources, counts, and redaction flags for the
  Bedrock Mantle request path, AWS-native authentication, supported model/Region
  prerequisites, `config.toml` provider setup, authentication order, Bedrock API
  key and AWS SDK credential-chain paths, shared config/credentials files,
  environment credentials, console credentials, SSO/named profiles,
  `credential_process` federation, desktop `.env` restart guidance, setup
  verification, exact-model-id guidance, feature availability limits, Fast Mode
  unavailability, and cloud-discovery limitations. It does not return provider
  names, AWS accounts, Regions, profiles, credentials, API keys, access keys,
  secret keys, session tokens, identities, model ids/names, provider config,
  config paths, environment variables, IAM policies, billing usage, request or
  response payloads, error details, feature availability values, paths, URLs,
  secrets, raw payloads, or app-server traffic, and it does not read credentials,
  profiles, environment, config files, start status/Bedrock requests, run
  credential processes, create model traffic, access files/network, or mutate
  provider state.
- `/api/settings-integrations` now also exposes a read-only Codex Pricing and
  Feature Maturity catalog aligned to the current official pricing and maturity
  docs. It returns only static keys, groups, states, sources, counts, and
  redaction flags for documented plan surfaces, cloud integrations, credits,
  higher-limit tiers, API-key usage, API token billing, business workspace
  controls, enterprise security/compliance/data controls, and maturity-label
  guidance. It does not return plan names, prices, billing cadences, checkout
  URLs, plan features, model names, model availability, usage limits, credit
  values, API pricing, workspace requirements, security/compliance/data-control
  values, maturity labels, support expectations, user plan, subscription state,
  billing accounts, payment methods, usage meters, rate limits, credit balances,
  enterprise contracts, paths, URLs, secrets, raw payloads, or app-server
  traffic, and it does not read billing or usage state, open checkout/billing
  URLs, access files/network, or mutate subscription/billing/provider state.
- `/api/settings-integrations` now also exposes a read-only Codex
  Configuration catalog aligned to the current official config basics,
  advanced config, sample configuration, and model-selection docs. It returns only static keys,
  groups, states, sources, counts, and redaction flags for configuration
  reference/basics, user/project config files, precedence, trusted project
  layers, CLI overrides, profiles, Codex home/state files, provider setup,
  project ignored keys, hooks, subagents, project-root detection, custom and
  built-in providers, model reasoning/verbosity/limits, approval/sandbox
  settings, permission profiles, shell environment policy, MCP config,
  telemetry, default/temporary/cloud model-selection boundaries, feature
  flags, web search mode, TUI keymap, log directory concepts, and sample
  configuration section concepts for models, reasoning, instructions,
  notifications, approvals/sandboxing, auth/login, project docs, history/file
  openers, UI controls, web search, agents, skills, workspace sandboxing, shell
  environment policy, sandboxed networking, permission profiles, TUI,
  analytics/feedback/notices, features, memories, hooks, MCP servers, model
  providers, apps/connectors, tool suggestions, profiles, project trust, tools,
  telemetry, and Windows. It does not
  return config paths, `config.toml`, config values, profile names, model
  names, provider names, base URLs, environment variable names or values,
  header names or values, auth/hook commands, approval policies, sandbox modes,
  permission profiles, feature flags, telemetry payloads, MCP server names,
  state files, log paths, cloud task data, command text, sample snippets,
  default or recommended values, connector identifiers, permission/network
  rules, telemetry endpoints, Windows values, paths, URLs, secrets, raw
  payloads, or app-server traffic, and it does not read or write config, copy
  sample config, start telemetry, access files/network, create model traffic,
  or mutate configuration state.
- `/api/settings-integrations` now also exposes a read-only Codex Workflow
  Guidance catalog aligned to the current official Best Practices, Workflows,
  Prompting, and Speed docs. It returns only static keys, groups, states,
  sources, counts, and redaction flags for task context structure, reasoning
  selection, app dictation, Plan mode, interview-style planning, PLANS.md,
  reusable AGENTS.md guidance, config defaults, approval/sandbox defaults,
  validation/review loops, example workflow categories, prompting loop, thread
  model, local/cloud threads, projectless chats, context compaction, Goal mode,
  steering/side chats, Fast Mode, and Codex-Spark. It does not return prompt
  text, file paths, repository content, command text/output, test output, diff
  content, review instructions, thread content/ids, goal text, plan text, config
  values, MCP server names, skill/automation names, model/reasoning values,
  credit rates, cloud task data, speech audio, screenshots, context-window
  values, paths, URLs, secrets, raw payloads, or app-server traffic, and it does
  not read prompts/files/diffs, execute commands/tests, start reviews/cloud
  tasks, mutate goals/config/Fast Mode/model selection, access files/network, or
  create model traffic.
- `/api/settings-integrations` now also exposes a read-only Codex Overview and
  Quickstart catalog aligned to the current official overview and quickstart
  docs. It returns only static keys, groups, states, sources, counts, and
  redaction flags for the coding-agent framing, write/understand/review/debug/
  automate capability categories, ChatGPT plan access, and API-credit sign-in
  entry point. It does not return surface names, plan names, account state, API
  keys, auth URLs, install commands, project paths, repository content, prompt
  text, generated code, review findings, debug traces, automation names, cloud
  task data, user/workspace identities, paths, URLs, secrets, raw payloads, or
  app-server traffic, and it does not read auth/API keys/projects, generate
  code, start reviews/debugging/automations/cloud tasks, open app/CLI/IDE
  surfaces, access files/network, create model traffic, or mutate state.
- `/api/settings-integrations` now also exposes a read-only Codex
  Troubleshooting catalog aligned to the current official app troubleshooting
  docs. It returns only static keys, groups, states, sources, counts, and
  redaction flags for review-panel Git-state guidance, sidebar project removal,
  archived/sidebar thread recovery, worktree/local-environment setup, macOS
  file-access approval, automation worktree cleanup, wrong-target prompt
  recovery, CLI/app version mismatch, feedback/GitHub issue guidance, log
  location/review guidance, stuck-thread recovery, terminal recovery, and font
  settings. It does not return Git state, project/thread names, thread ids,
  prompt text, worktree/local-environment/log paths, permission states,
  automation names, version values, feedback session ids, issue URLs, log
  content, terminal commands/output, font values, paths, URLs, secrets, raw
  payloads, or app-server traffic, and it does not read Git/logs/local
  environments, remove projects, unarchive threads, run setup/version/terminal
  commands, upload feedback, open issues/settings, trigger permissions, archive
  automations, recover prompts, access files/network, or mutate state.
- `/api/settings-integrations` now also exposes a read-only Codex Worktrees
  catalog aligned to the current official app worktrees docs. It returns only
  static keys, groups, states, sources, counts, and redaction flags for
  worktree concepts, Git-repository requirements, Local/Worktree/Handoff
  terminology, parallel/background workflows, setup flow, branch selection,
  detached-HEAD behavior, handoff safety, exclusive worktree branch flow,
  managed/permanent worktrees, managed worktree location, ignored-file copy
  guidance, branch checkout limits, cleanup retention, and snapshot restore.
  It does not return project names, repository/worktree paths, branch names,
  commit SHAs, Git state, thread ids, prompt text, local-environment names,
  ignored-file patterns, file names, snapshot content, terminal commands, IDE
  names, setting values, paths, URLs, secrets, raw payloads, or app-server
  traffic, and it does not read Git repositories/branches, create worktrees,
  run handoff, create branches, commit, push, open PRs, open IDEs/terminals,
  copy ignored files, restore snapshots, change cleanup settings, create
  permanent worktrees, run local-environment setup, access files/network, or
  mutate Git/app state.
- `/api/settings-integrations` now also exposes a read-only Codex Local
  Environments catalog aligned to the current official app local-environments
  docs. It returns only static keys, groups, states, sources, counts, and
  redaction flags for worktree setup configuration, project action
  configuration, settings-pane setup, shared repository configuration,
  project-root selection, setup script auto-run semantics, dependency
  preparation guidance, platform-specific setup/actions, top-bar actions,
  integrated-terminal action execution, and action icon selection. It does not
  return project names, project roots, config paths, config content, setup
  commands, action names/commands/icons, platform names, dependency state,
  worktree paths, terminal output, setting values, paths, URLs, secrets, raw
  payloads, or app-server traffic, and it does not read/write local
  environment config, run setup scripts/actions/terminal commands, open
  settings, access files/network, or mutate state.
- `/api/settings-integrations` now also exposes a read-only Codex Review
  catalog aligned to the current official app review docs. It returns only
  static keys, groups, states, sources, counts, and redaction flags for review
  pane behavior, Git repository requirements, reflected Git state categories,
  uncommitted/all-branch/last-turn/staged/unstaged scopes, diff navigation,
  inline comments, `/review` result placement, pull request review context,
  GitHub CLI prerequisite guidance, PR fix loop, staging/reverting levels, and
  staged/unstaged same-file behavior. It does not return project names,
  repository paths, Git state, diff content, file paths/names, line numbers,
  comment text, review findings, pull request context, reviewer feedback,
  GitHub identities, command text, branch names, commit SHAs, editor names,
  paths, URLs, secrets, raw payloads, or app-server traffic, and it does not
  read Git/diffs/PR context, open editors, create inline comments, start
  reviews, invoke GitHub CLI, stage/unstage/revert/commit/push, open PRs,
  access files/network, create model traffic, or mutate state.
- `/api/settings-integrations` now also exposes a read-only Codex Governance
  catalog aligned to the official enterprise governance guide. It returns only
  static keys, groups, states, sources, counts, and redaction flags for
  Analytics Dashboard tracking, Analytics API reporting, Compliance API export
  concepts, dashboard views, dashboard usage lag, daily/weekly windows,
  product-surface usage, workspace/personal usage breakdowns, thread/turn/code
  review/skill/agent/access-token metric categories, CSV/JSON export options,
  Analytics API endpoint categories, pagination/lookback/scoped-key concepts,
  compliance audit logs, retention, ChatGPT-auth scope, audit metadata, and
  SIEM/eDiscovery use cases. It does not return dashboard values, usage
  metrics, code-review metrics, skill invocation metrics, agent identities,
  access-token usage, export data, user emails, workspace ids, API keys, prompt
  text, response text, audit identifiers, model names, token usage, timestamps,
  pagination cursors, analytics or compliance URLs, warehouse/SIEM targets,
  paths, URLs, secrets, raw payloads, or app-server traffic, and it does not
  open dashboards, call Analytics or Compliance APIs, start exports, read API
  keys, write warehouses/SIEM pipelines, access files/network, or mutate
  governance state.
- `/api/settings-integrations` now also exposes a read-only Codex Appshots
  catalog aligned to the official appshots guide. It returns only static keys,
  groups, states, sources, counts, and redaction flags for macOS availability,
  frontmost-window capture concepts, visible image and available text capture,
  thread attachment storage/routing, hotkey settings, screen-capture and
  accessibility permission concepts, sensitive-content guidance, CLI creation
  limits, limited-text apps, plugin fallback, permissions troubleshooting, and
  restart guidance. It does not return platform values, hotkey values, window
  titles, app names, screenshots, available text, attachment content, session
  paths, thread IDs, permission states, setting values, plugin names, document
  content, sensitive content, paths, URLs, secrets, raw payloads, or app-server
  traffic, and it does not start capture, hotkey listeners, accessibility
  reads, plugin access, or model traffic, write attachments/session files/
  settings, create/update threads, prompt permissions, open settings, access
  files/network, or mutate state.
- `/api/settings-integrations` now also exposes a read-only Codex Memories
  catalog aligned to the official Memories guide. It returns only static keys,
  groups, states, sources, counts, and redaction flags for default-disabled
  state, regional consent requirements, stable preference recall, team guidance
  boundaries, Chronicle linkage, app/config enablement, eligible prior-thread
  inputs, background generation, idle-delay and rate-limit gating, local memory
  storage, generated-state review, per-thread controls, global use/generation
  controls, external-context exclusion, model override controls, and secret
  review guidance. It does not return setting values, config values or paths,
  memory files or contents, memory paths, thread ids or contents, rate-limit
  values, model names, generated summaries, prompt context, secret values,
  paths, URLs, secrets, raw payloads, or app-server traffic, and it does not
  read/write config, read memory files, generate or inject memories, access
  files/network, create model traffic, or mutate Memories state.
- `/api/settings-integrations` now also exposes a read-only Codex Agents
  guidance catalog aligned to the official AGENTS guidance. It returns only
  static keys, groups, states, sources, counts, and redaction flags for
  discovery timing, global/project scope selection, override precedence,
  directory traversal, merge order, empty-file skipping, size limits, fallback
  filename configuration, custom profile homes, setup verification,
  loaded-source audit, restart/reload semantics, troubleshooting, and prompting
  pairing. It does not return instruction file names or contents,
  global/project/override guidance, fallback names, config values, profile
  homes, workspace roots, directory names, loaded sources, command text, log
  paths, session log paths, external URLs, paths, secrets, raw payloads, or
  app-server traffic, and it does not read plaintext logs, session logs,
  config, or guidance files, run verification commands, access files, create
  model traffic, or mutate guidance state.
- `/api/settings-integrations` now also exposes a read-only Codex third-party
  integrations catalog aligned to the official Linear and Slack guides. It
  returns only static keys, groups, states, sources, counts, and redaction flags
  for issue delegation, connector setup, account linking, issue assignment,
  comment mentions, repo pinning, progress tracking, environment selection,
  triage rules, data usage, Linear MCP setup, Slack app setup, channel mention
  workflow, thread context, environment/repo hints, task links, enterprise
  answer controls, connection/environment/code-context troubleshooting,
  long-thread guidance, and workspace-posting troubleshooting. It does not return Linear issue content
  or metadata, Linear comments, Linear workspace/account/connector/MCP data,
  Slack messages, Slack thread history, Slack workspace/channel/connector data,
  cloud task data, task links or results, environment names, repo names, admin
  setting values, external or policy URLs, MCP server names/config, paths,
  secrets, raw payloads, or app-server traffic, and it does not install
  connectors or Slack apps, link accounts, assign issues, post comments or
  messages, write triage rules, start cloud tasks, configure or log into MCP,
  access files/network, create model traffic, or mutate integration state.
  Test and verification contracts also walk the static catalog recursively and
  fail if any string field outside `key`, `group`, `state`, `source`, and
  `officialSource` appears, or if any truthy boolean appears outside explicit
  catalog-presence flags.
- `/api/settings-integrations` now also exposes a read-only Codex MCP catalog
  aligned to the official Model Context Protocol guide. It returns only static
  keys, groups, states, sources, counts, and redaction flags for MCP purpose,
  CLI/IDE support, STDIO and streamable HTTP transports, bearer-token and OAuth
  authentication, server instructions, config scoping, CLI/config/TUI
  management paths, STDIO and HTTP options, runtime timeouts, enablement and
  required flags, tool allow/deny lists, approval modes, OAuth callback/scopes
  behavior, derived redirect URI and callback binding guidance, OAuth scope
  fallback behavior, plugin-provided servers, plugin policy overrides, and
  documented example-server categories for docs, browser, design, observability,
  and source-control workflows. It does not return server listings, server names or URLs, command
  text, arguments, env var names or values, bearer-token env vars, header names
  or values, OAuth URLs or tokens, callback ports or URLs, scopes, config.toml,
  config paths, tool names, tool allowlists, approval modes, server
  instructions, plugin ids or names, example server names, external URLs,
  paths, secrets, raw payloads, or app-server traffic, and it does not read
  local or remote environments, read/write config, start/reload MCP servers,
  start OAuth login, call tools, read resources, load prompts, access
  files/network, create model traffic, or mutate MCP state.
  Test and verification contracts also walk the static catalog recursively and
  fail if any string field outside `key`, `group`, `state`, `source`, and
  `officialSource` appears, or if any truthy boolean appears outside explicit
  catalog-presence flags.
- `/api/settings-integrations` now also exposes a read-only Codex Custom
  Prompts catalog aligned to the official Custom Prompts guidance. It returns
  only static keys, groups, states, sources, counts, and redaction flags for the
  deprecated lifecycle, skills migration guidance, reusable local Markdown
  prompt files, CLI/IDE slash invocation, local Codex-home storage, repository
  sharing boundaries, prompt-file setup, front-matter metadata, argument
  placeholders, reload/top-level Markdown loading rules, expanded-instruction
  sending, and file-based management. It does not return prompt names,
  descriptions, argument hints, prompt content, prompt paths, prompt arguments,
  expanded prompts, slash commands, local-home paths, command text, paths, URLs,
  secrets, raw payloads, or app-server traffic, and it does not read prompt
  directories, read/write/delete prompt files, expand prompts, execute slash
  commands, access files, create model traffic, or mutate Custom Prompts state.
- `/api/settings-integrations` now also exposes a read-only Codex
  Customization catalog aligned to the official Customization guide. It returns
  only static keys, groups, states, sources, counts, and redaction flags for
  AGENTS guidance, Memories, Skills, MCP, Subagents, plugin distribution, scope
  precedence, feedback-loop, automation-drift, MCP capability, and build-order
  concepts. It does not return guidance files, global or repo guidance, memory
  content, skill names/content/scripts, plugin names, MCP server/tool/resource/
  prompt data, subagent names, automation names, workflow instructions, local
  paths, file contents, config values, external system identifiers, URLs,
  secrets, raw payloads, or app-server traffic, and it does not read/write
  files, call MCP tools, read MCP resources, load MCP prompts, load skills,
  install plugins, start subagents or automations, create model traffic, or
  mutate customization state.
- `/api/settings-integrations` now also exposes a read-only Codex GitHub Action
  catalog aligned to the official GitHub Action guide. It returns only static
  keys, groups, states, sources, counts, and redaction flags for CI workflow
  jobs, patch/review use cases, pull-request feedback workflows, CLI install,
  Responses proxy startup, `codex exec` invocation, runner requirements,
  checkout requirements, prompt and prompt-file inputs, `codex-args`,
  model/effort/sandbox inputs, output files, CLI version pinning, shared config
  directory setup, sudo-dropping and unprivileged-user strategies, read-only caveats,
  trigger allowlists, final-message and structured-output concepts, security
  checklist items, and troubleshooting categories. It does not return workflow
  names/YAML, repository names, pull request numbers, issue comments, prompt
  text, prompt files, output files, final messages, action versions, runner
  labels, permission scopes, API keys, GitHub tokens, Codex args, model/effort/
  sandbox values, shared config paths, allowlist users/bots, logs, artifact
  contents, command text, paths, URLs, secrets, raw payloads, or app-server
  traffic, and it does not start workflows, invoke GitHub Actions, install the
  CLI, start the proxy, run `codex exec`, apply patches, post reviews/comments,
  upload artifacts, change sudo/users, read repository checkouts, call GitHub
  APIs, access files/network, create model traffic, or mutate state.
- `/api/settings-integrations` now also exposes a read-only Codex SDK catalog
  aligned to the official SDK guide. It returns only static keys, groups,
  states, sources, counts, and redaction flags for programmatic Codex control,
  CI/CD, custom-agent, internal-tool, and application-integration use cases,
  TypeScript server-side usage, package install concepts, start/continue/resume
  thread flows, Python JSON-RPC control of local app-server, runtime
  requirements, pinned CLI runtime dependency, prerelease selection, async
  usage, sandbox presets, turn-scoped sandbox overrides, and default sandbox
  behavior. It does not return package names/versions, runtime versions, thread
  IDs, prompt text, final responses, app-server or JSON-RPC payloads, model
  values, sandbox modes, executable paths, config values, dependency versions,
  command text, repository URLs, paths, URLs, secrets, raw payloads, or
  app-server traffic, and it does not install packages, import SDKs, start
  app-server/JSON-RPC, start/resume/run threads, start async runtimes, change
  sandboxes, launch executables, access files/network, create model traffic, or
  mutate state.
- `/api/settings-integrations` now also exposes a read-only Codex
  non-interactive mode catalog aligned to the official non-interactive guide. It
  returns only static keys, groups, states, sources, counts, and redaction flags
  for `codex exec` use cases, prompt/stdin patterns, stdout/stderr separation,
  ephemeral sessions, sandbox and approval guidance, ignored config/rules
  switches, required MCP failure behavior, JSONL event/item concepts,
  last-message output, structured-output schemas, CLI/auth automation guidance,
  session resume, Git repository checks, GitHub Action autofix workflows, patch
  artifact separation, and advanced stdin piping patterns. It does not return
  prompt text, stdin/stdout/stderr contents, JSONL events/items, schema content,
  output files, session IDs, auth files, API keys, config values, rules files,
  MCP server names, sandbox modes, command text, workflow YAML, patch artifacts,
  GitHub tokens, repository names, paths, URLs, secrets, raw payloads, or
  app-server traffic, and it does not run `codex exec`, start processes, read
  stdin, write outputs, stream JSONL, load schemas, resume sessions, read auth
  files or API keys, read config/rules, start MCP servers, override sandboxes,
  bypass Git checks, write patch artifacts, invoke GitHub CLI, access
  files/network, create model traffic, or mutate state.
- `/api/settings-integrations` now also exposes a read-only Codex Agents SDK
  catalog aligned to the official guide for using Codex with the Agents SDK. It
  returns only static keys, groups, states, sources, counts, and redaction flags
  for Codex-as-MCP-server concepts, Agents SDK MCP integration, tool discovery,
  start/reply tool surfaces, configuration parameters, thread-reference
  propagation, structured-content compatibility, deterministic workflows,
  long-running MCP server orchestration, single-agent and multi-agent handoff
  patterns, guardrails/traces, local prerequisites, dependency isolation, and
  runner orchestration. It does not return tool names, tool schemas, prompt text,
  thread references, response content, approval prompts, config values, cwd,
  instruction text, model values, profile names, sandbox modes, API keys,
  dependency names, command text, script content, agent names, traces, artifact
  content, paths, URLs, secrets, raw payloads, or app-server traffic, and it does
  not start MCP servers or inspectors, list/call tools, continue sessions,
  forward approvals, install dependencies, execute scripts, run agents, start
  handoffs, create traces, write artifacts, access files/network, create model
  traffic, or mutate state.
- `/api/settings-integrations` now also exposes a read-only Codex CLI command
  reference catalog aligned to the official CLI command reference. It returns
  only static keys, groups, states, sources, counts, and redaction flags for
  documented global flag categories, command categories, command details, remote
  connection concepts, app-server transport concepts, desktop launch behavior,
  debug flows, cloud task CLI concepts, archive/delete safety, and shell
  completion generation. It does not return exact command names, flag names,
  option values, prompts, config keys or values, profile names, model names,
  sandbox policies, remote URLs, auth tokens, workspace or image paths, session
  IDs, cloud task or environment IDs, completion output, stdout, JSON payloads,
  diagnostic reports, transport values, installer URLs, paths, URLs, secrets,
  raw payloads, or app-server traffic, and it does not invoke Codex, start
  processes, generate shell completions, start app-server, launch installers,
  start/list cloud tasks, mutate sessions, apply diffs, mutate MCP/plugins,
  access files/network, create model traffic, or mutate state.
- `/api/settings-integrations` now also exposes a read-only Codex CLI features
  catalog aligned to the official CLI features guide. It returns only static
  keys, groups, states, sources, counts, and redaction flags for interactive
  TUI behavior, composer ergonomics, resume flows, remote TUI concepts, model
  and feature-flag concepts, subagents, image input/generation, themes, local
  review presets, web search, quick prompt runs, shell completions, approval
  modes, exec automation, cloud task triage, slash-command workflows, prompt
  editor behavior, and MCP integration. It does not return command names,
  command text, slash commands, prompts, drafts, transcripts, session IDs,
  remote URLs, auth tokens, model names, feature flags, image paths or content,
  generated images, theme names/files, review diffs, web-search queries or
  results, cloud task or environment IDs, shell completion output, MCP server
  names, config values, cwd, output text, paths, URLs, secrets, raw payloads,
  or app-server traffic, and it does not invoke Codex, start processes, open
  composers/editors, resume sessions, connect remotes, write feature flags,
  start subagents, attach/generate images, write themes, start reviews, run web
  search or shell completions, change approval modes, run exec/cloud tasks,
  start MCP servers, access files/network, create model traffic, or mutate
  state.
- `/api/settings-integrations` now also exposes a read-only Codex CLI slash
  commands catalog aligned to the official CLI slash-command guide. It returns
  only static keys, groups, states, sources, counts, and redaction flags for
  slash workflow categories such as discovery, queued parsing, completion,
  permissions, editor context, terminal UI, composer controls, sandbox read
  grants, subagents, apps, plugins, hooks, session management, transcript
  compaction, clipboard, Git review, experimental features, review retry
  approval, memory, skills, imports, auth, MCP, file mentions, model controls,
  planning, goals, response style, background terminal controls, side
  conversations, status, usage, diagnostics, and terminal display
  configuration. It does not return exact slash commands, arguments, prompts,
  transcripts, session IDs, config values, file paths or content, model names,
  approval policies, plugin/skill/app/hook names, import artifacts, feedback
  logs, terminal output, paths, URLs, secrets, raw payloads, or app-server
  traffic, and it does not open slash popups, queue or execute commands, mutate
  sessions/config/files/plugins/skills/hooks/imports, switch models or approval
  policy, control terminals, access files/network, create model traffic, or
  mutate state.
- `/api/settings-integrations` now also exposes a read-only Codex IDE extension
  catalog aligned to the official IDE extension commands, features, settings,
  and slash-command guides. It returns only static keys, groups, states,
  sources, counts, and redaction flags for Command Palette control, keybinding
  assignment, thread/context commands, panel/sidebar commands, supported editor
  concepts, shared CLI configuration, editor-context prompting, file references,
  model/reasoning/approval controls, cloud delegation and follow-up, web search,
  image context/generation, IDE settings, and IDE slash-command categories. It
  does not return command IDs or names, keybindings, editor selections, file
  paths or content, prompt text, model names, reasoning values, approval modes,
  cloud environments or tasks, web-search queries or results, image paths or
  content, generated images, setting names or values, CLI executable paths,
  feedback/log contents, slash commands, config values, paths, URLs, secrets,
  raw payloads, or app-server traffic, and it does not start IDE processes,
  execute commands, write keybindings/settings/config, read editor or file
  context, start threads/panels/sidebar/cloud follow-ups, switch model/reasoning
  or approval modes, run web search, attach/generate images, submit feedback,
  attach logs, execute slash commands, access files/network, create model
  traffic, or mutate state.
- `/api/settings-integrations` now also exposes a read-only Codex web catalog
  aligned to the official Codex web overview. It returns only static keys,
  groups, states, sources, counts, and redaction flags for the web entry point,
  GitHub connection, repository work surface, pull-request creation, included
  plan access, enterprise admin prerequisites, prompting guidance, and common
  delegation/review/PR workflows. It does not return web URLs, GitHub accounts
  or tokens, repository names or content, branch names, commit SHAs, pull
  request numbers or content, plan names, entitlement details, enterprise
  policies, admin setup state, prompt text, workflow prompts, cloud task IDs or
  content, browser sessions, cookies, auth state, paths, URLs, secrets, raw
  payloads, or app-server traffic, and it does not open Codex web, connect
  GitHub, read/write repositories, create/update pull requests, start/review
  cloud tasks, submit prompts, start workflows, open admin setup, call GitHub
  APIs, access network, create model traffic, or mutate state.
- `/api/settings-integrations` now also exposes a read-only Codex agent
  internet access catalog aligned to the official Agent internet access guide.
  It returns only static keys, groups, states, sources, counts, and redaction
  flags for the default blocked agent-phase network policy, setup-script
  boundary, per-environment enablement, risk categories, off/on modes,
  domain-preset concepts, HTTP-method concepts, and local blocked boundaries.
  It does not return environment names, domain allowlists, preset domain
  values, HTTP method values, prompt examples, resource URLs, work logs, setup
  script content, config values, paths, secrets, raw payloads, or app-server
  traffic, and it does not enable agent internet, apply domain or method
  allowlists, run setup scripts, start network probes, review work logs, write
  config, create model traffic, access files/network, or mutate state.
- `/api/settings-integrations` now also exposes a read-only Codex Cloud
  environments catalog aligned to the official Cloud environments guide. It
  returns only static keys, groups, states, sources, counts, and redaction flags
  for cloud task lifecycle, container checkout, setup and maintenance phases,
  default image, package-version pinning, environment variable and secret
  behavior, automatic/manual setup, cache behavior, setup/agent internet
  policy, and network proxy concepts. It does not return environment names,
  settings URLs, repository names, branches, SHAs, setup or maintenance script
  content, package manager values, runtime versions, environment variable
  values, secret values, image references, command text, diffs, PR URLs, cache
  state, proxy values, task output, paths, URLs, secrets, raw payloads, or
  app-server traffic, and it does not start cloud tasks, create containers,
  check out repositories, run setup or maintenance scripts, install
  dependencies, pin package versions, apply variables, decrypt secrets, reset
  caches, open PRs, ask follow-ups, configure proxies, run agent commands,
  access files/network, create model traffic, or mutate state.
- `/api/settings-integrations` now also exposes a read-only Codex Managed
  configuration catalog aligned to the official managed-configuration guide. It
  returns only static keys, groups, states, sources, counts, and redaction flags
  for admin-enforced requirements, managed defaults, source precedence, cloud
  assignment, local cache behavior, permission profiles, sandbox/web-search/
  network requirements, feature pins, Appshots, remote control, locked
  Computer Use, and automatic-review policy concepts. It does not return
  requirement names or values, managed default values, policy content, group
  names, user identities, cache entries or signatures, profile names,
  permission profiles, sandbox modes, approval policies, reviewer policies,
  feature keys or values, host patterns, domain rules, admin URLs, local paths,
  command text, paths, URLs, secrets, raw payloads, or app-server traffic, and
  it does not read local config or managed caches, fetch or write policies,
  write config/features, apply network rules, apply auto-review policy, change
  Appshots or remote-control settings, access files/network, or mutate managed
  configuration state.
- `/api/settings-integrations` now also exposes a read-only Codex Environment
  variables catalog aligned to the official environment variables guide. It
  returns only static keys, groups, states, sources, counts, and redaction flags
  for durable `config.toml` guidance, shell-scoped overrides, stable public
  variable scope, Codex state roots, standalone installer controls, API-key and
  access-token automation use, CA bundle overrides, provider `env_key`
  indirection, `RUST_LOG`, and opt-in plaintext diagnostics. It does not read
  `process.env`, return variable names, variable values, default values, API
  keys, access tokens, certificate paths, state paths, install paths, provider
  secret names, log filters, log paths, command text, paths, URLs, secrets, raw
  payloads, or app-server traffic, and it does not start installers, run
  `codex exec`, run `codex login`, start diagnostics, access files/network, or
  mutate environment/config/auth state.
- `/api/settings-integrations` now also exposes a read-only Skills & Plugins
  catalog aligned to the official Skills and Plugins documentation. It returns
  only static keys, groups, states, sources, counts, and redaction flags for
  skills progressive disclosure, initial context budget, explicit and implicit
  invocation, description matching, creator/manual authoring, scope locations
  and precedence, symlink support, plugin distribution, curated installation,
  skill enablement config, optional skill app metadata, skill best practices,
  plugin overview, app and CLI directory browsing, curated/shared/created
  directory categories, marketplace sharing, documented plugin workflow
  examples, install/auth timing, new-thread usage, direct-task and `@`
  invocation flows, bundled skills/apps/MCP setup,
  external app data terms, uninstall semantics, plugin disable config, plugin
  guide references, and local install/share/marketplace/preflight plus opt-in
  read/uninstall/enablement/share-checkout/skills-config boundaries. It does
  not return skill names, descriptions, paths, content, scripts, metadata,
  dependency tools, plugin names, ids, paths, URLs, descriptions, manifests,
  default prompts, screenshots, marketplace names or sources, app names, MCP
  server names, hook commands, share links or principals, setting values,
  secrets, raw payloads, app-server traffic, external code, installs,
  uninstalls, enablement writes, config writes, extra-root writes, share
  mutations, or marketplace mutations.
  Test and verification contracts also walk the static catalog recursively and
  fail if any string field outside `key`, `group`, `state`, `source`, and
  `officialSource` appears, or if any truthy boolean appears outside explicit
  catalog-presence flags.
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
- `/api/settings-integrations` now also exposes a read-only Import to Codex
  catalog aligned to the official import documentation. It returns only static
  keys, groups, states, sources, counts, and redaction flags for the import
  flow, supported items, finish-setup follow-up, post-import review guidance,
  and local import boundaries. It does not return source agent names,
  instruction files, `settings.json`, skill or plugin names, project folders,
  session titles, MCP server names, hook commands, slash-command prompts,
  subagent names, auth details, environment variables, prompt templates,
  import-history details, raw migration items, paths, URLs, secrets, raw
  payloads, or app-server traffic, and it does not detect setup, start imports,
  write config/`AGENTS.md`/skills/plugins/MCP/hooks/threads/projects, start
  auth flows, show runtime status cards, access files, or mutate import state.
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
- `/api/settings-integrations` now also exposes a read-only Codex Remote
  Connections catalog aligned to the official Remote connections documentation.
  It returns only static keys, groups, states, sources, counts, and redaction
  flags for mobile and multi-device remote access, connected-host environment
  inheritance, remote thread/follow-up/approval/review/notification workflows,
  host/platform availability, same-account/workspace setup, admin policy, QR
  pairing flow, Settings > Connections management, keep-awake/Computer
  Use/Chrome options, laptop/always-on/SSH host choices, connected-host
  projects/plugins/MCP/skills and sandbox approvals, secure relay, SSH alias
  discovery, OpenSSH resolution, remote app-server startup, and SSH security
  expectations. It does not return host names or ids, device names or ids, QR
  codes, pairing codes, relay endpoints, remote status values, SSH config,
  aliases or commands, remote project paths, remote filesystem content, remote
  shell output, credentials, plugin/MCP server/skill names, browser or Computer
  Use state, approval details, notification payloads, screenshots, terminal
  output, setting values, paths, URLs, secrets, raw payloads, or app-server
  traffic, and it does not enable hosts, start pairing, revoke devices, write
  keep-awake settings, open SSH connections, start remote app servers, execute
  remote commands, read/write remote files, send relay traffic, access
  files/network, or mutate Remote Connections state.
- `/api/settings-integrations` now also exposes a read-only Codex Subagents
  catalog aligned to the official Subagents documentation. It returns only
  static keys, groups, states, sources, counts, and redaction flags for
  parallel specialized agents, context pollution/rot, main-agent focus,
  summarized subagent results, read-heavy and write-heavy workflow guidance,
  core terms, explicit triggering, prompt division/wait/summary guidance, model
  and reasoning guidance, default availability, app/CLI visibility, token usage
  caution, orchestration, consolidated responses, `/agent` management, direct
  steering/stop/close guidance, sandbox and runtime-override inheritance,
  inactive-thread approvals, non-interactive approval failure, built-in agents,
  custom-agent locations/config layers/required and optional fields, global
  `[agents]` settings, `max_threads`, `max_depth`, job runtime settings,
  custom-agent schema, name source of truth, display nicknames, nickname
  constraints, narrow-agent guidance, and local subagent boundaries. It does
  not return agent names, nicknames, agent files, paths, developer
  instructions, model values, reasoning effort values, sandbox values, MCP
  configs, skill configs, thread ids, thread content, subagent outputs,
  approval details, prompt text, config values, command output, paths, URLs,
  secrets, raw payloads, or app-server traffic, and it does not spawn
  subagents, switch agent threads, steer/stop/close subagents, write config or
  agent files, start model traffic or tool work, forward approvals, enable
  recursive delegation, read/write files, or mutate subagent state.
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
- The same summary now includes a read-only Connections settings catalog for
  the official mobile remote access, connected-device management,
  control-other-devices, keep-awake, Computer Use, Chrome extension, SSH remote
  project, secure relay, and connected-host inheritance surfaces. It returns
  only keys, groups, states, sources, and counts; host or device identifiers,
  QR or pairing codes, relay endpoints, remote status values, SSH config or
  aliases, project paths, credentials, plugin/MCP/skill names, browser or
  Computer Use state, setting values, paths, URLs, secrets, raw payloads,
  mutations, remote traffic, and app-server traffic remain blocked.
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
- `permissionProfile/list` has an opt-in, counts-only inventory path by default;
  it returns profile counts and allowed/blocked totals only. With
  `CODEX_APP_PORT_ALLOW_INTEGRATION_NAMES=1`, it may also return bounded safe
  profile display names; raw profile ids, descriptions, cursors, and payloads
  remain hidden.
- `account/usage/read` and `account/workspaceMessages/read` also have opt-in,
  counts-only inventory paths; they omit token usage values, bucket dates,
  workspace message ids, bodies, timestamps, and raw payloads.
- `externalAgentConfig/import/readHistories` and `plugin/installed` also have
  opt-in inventory paths. Import histories remain counts-only; installed
  plugins are counts-only by default and may return bounded safe display names
  only when `CODEX_APP_PORT_ALLOW_INTEGRATION_NAMES=1` is also set. They still
  omit import ids, paths, messages, timestamps, plugin ids, plugin paths, URLs,
  prompts, capabilities, and raw payloads.
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

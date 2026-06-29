export const INTEGRATION_METHOD_AUDIT = Object.freeze([
  integrationMethod(
    "config/read",
    "settings-read",
    "Reads sanitized effective configuration; already exposed through /api/status.",
    "read-only",
  ),
  integrationMethod(
    "configRequirements/read",
    "settings-read",
    "Reads requirement metadata for configuration and approvals.",
    "opt-in-read",
  ),
  integrationMethod(
    "model/list",
    "settings-read",
    "Reads model picker metadata; ids, descriptions, upgrade copy, and cursors must not reach the browser unless reduced to safe display-name metadata.",
    "opt-in-read",
  ),
  integrationMethod(
    "modelProvider/capabilities/read",
    "settings-read",
    "Reads model-provider capability flags without model traffic.",
    "opt-in-read",
  ),
  integrationMethod(
    "collaborationMode/list",
    "settings-read",
    "Reads collaboration-mode presets; preset names and model overrides must stay hidden unless sanitized by the display-name gate.",
    "opt-in-read",
  ),
  integrationMethod(
    "account/read",
    "auth-read",
    "Reads account presence and type; token and email fields must not reach the browser.",
    "opt-in-read",
  ),
  integrationMethod(
    "account/rateLimits/read",
    "auth-read",
    "Reads account rate-limit metadata; exact limits, balances, ids, names, percentages, and reset times must not reach the browser.",
    "opt-in-read",
  ),
  integrationMethod(
    "account/usage/read",
    "auth-read",
    "Reads account token-usage metadata that can reveal plan, workspace, or activity details; browser inventory must remain counts-only.",
    "opt-in-read",
  ),
  integrationMethod(
    "account/workspaceMessages/read",
    "auth-read",
    "Reads account workspace messages that can include user- or org-visible content; browser inventory must never return message ids or bodies.",
    "opt-in-read",
  ),
  integrationMethod(
    "account/rateLimitResetCredit/consume",
    "auth-mutation",
    "Consumes a rate-limit reset credit and changes account quota state.",
    "blocked",
  ),
  integrationMethod(
    "app/list",
    "apps-read",
    "Reads available app/connector metadata; ids, URLs, logos, descriptions, labels, and plugin names must not reach the browser unless sanitized by the display-name gate.",
    "opt-in-read",
  ),
  integrationMethod(
    "mcpServerStatus/list",
    "mcp-read",
    "Reads MCP server/tool/resource counts; names and schemas must stay hidden.",
    "opt-in-read",
  ),
  integrationMethod(
    "mcpServer/resource/read",
    "mcp-read",
    "Reads MCP resource content through an integration server.",
    "blocked",
  ),
  integrationMethod(
    "skills/list",
    "skills-read",
    "Reads workspace skill inventory; names, descriptions, and paths must stay hidden.",
    "opt-in-read",
  ),
  integrationMethod(
    "plugin/list",
    "plugins-read",
    "Reads plugin marketplace inventory; names, ids, paths, and URLs must stay hidden.",
    "opt-in-read",
  ),
  integrationMethod(
    "plugin/read",
    "plugins-read",
    "Reads detailed plugin metadata that can include paths, URLs, prompts, and assets.",
    "blocked",
  ),
  integrationMethod(
    "plugin/share/list",
    "plugins-read",
    "Reads plugin sharing state that can include remote sharing context.",
    "blocked",
  ),
  integrationMethod(
    "plugin/skill/read",
    "plugins-read",
    "Reads plugin-provided skill content and metadata.",
    "blocked",
  ),
  integrationMethod(
    "hooks/list",
    "settings-read",
    "Reads hook configuration, plugin linkage, and command-like metadata.",
    "opt-in-read",
  ),
  integrationMethod(
    "externalAgentConfig/detect",
    "settings-import-read",
    "Detects external agent configuration migration candidates; descriptions, names, paths, cwd values, and session titles must not reach the browser.",
    "opt-in-read",
  ),
  integrationMethod(
    "externalAgentConfig/import/readHistories",
    "settings-import-read",
    "Reads external-agent import history that can reveal migrated tools, sessions, paths, failures, and error text; browser inventory must remain counts-only.",
    "opt-in-read",
  ),
  integrationMethod(
    "experimentalFeature/list",
    "settings-read",
    "Reads experimental feature metadata; names and display text must not reach the browser unless sanitized by the display-name gate.",
    "opt-in-read",
  ),
  integrationMethod(
    "permissionProfile/list",
    "settings-read",
    "Reads permission profile ids, descriptions, requirements, and cwd-derived policy state; browser inventory must remain counts-only.",
    "opt-in-read",
  ),
  integrationMethod(
    "thread/search",
    "thread-read",
    "Searches thread history and can surface names, previews, paths, or content-derived snippets.",
    "blocked",
  ),
  integrationMethod(
    "thread/delete",
    "thread-lifecycle",
    "Hard-deletes active or archived threads and descendants.",
    "blocked",
  ),
  integrationMethod(
    "thread/rollback",
    "thread-lifecycle",
    "Drops recent persisted thread turns and returns updated thread history that can contain thread content.",
    "blocked",
  ),
  integrationMethod(
    "thread/settings/update",
    "thread-lifecycle",
    "Mutates loaded thread settings for later turns.",
    "blocked",
  ),
  integrationMethod(
    "thread/realtime/appendSpeech",
    "thread-lifecycle",
    "Injects speech text into a realtime thread session.",
    "blocked",
  ),
  integrationMethod(
    "account/login/start",
    "auth-callback",
    "Starts an auth flow and can open or return callback state.",
    "blocked",
  ),
  integrationMethod(
    "account/login/cancel",
    "auth-callback",
    "Mutates an active auth flow.",
    "blocked",
  ),
  integrationMethod("account/logout", "auth-mutation", "Logs out the active account.", "blocked"),
  integrationMethod(
    "account/sendAddCreditsNudgeEmail",
    "auth-mutation",
    "Triggers an account email side effect.",
    "blocked",
  ),
  integrationMethod(
    "mcpServer/oauth/login",
    "mcp-auth",
    "Starts an MCP OAuth login flow.",
    "blocked",
  ),
  integrationMethod(
    "mcpServer/tool/call",
    "mcp-tool",
    "Invokes an MCP tool and can perform arbitrary integration work.",
    "blocked",
  ),
  integrationMethod(
    "config/value/write",
    "settings-write",
    "Writes a single configuration value.",
    "blocked",
  ),
  integrationMethod(
    "config/batchWrite",
    "settings-write",
    "Writes multiple configuration values.",
    "blocked",
  ),
  integrationMethod(
    "config/mcpServer/reload",
    "settings-mutation",
    "Reloads MCP server configuration.",
    "blocked",
  ),
  integrationMethod(
    "experimentalFeature/enablement/set",
    "settings-write",
    "Changes experimental feature enablement.",
    "blocked",
  ),
  integrationMethod(
    "skills/config/write",
    "skills-write",
    "Writes skill configuration.",
    "blocked",
  ),
  integrationMethod(
    "skills/extraRoots/set",
    "skills-write",
    "Mutates runtime standalone skill roots and can expose or load external skill content.",
    "blocked",
  ),
  integrationMethod(
    "environment/add",
    "remote-environment",
    "Adds or replaces a remote execution environment URL for later turns.",
    "blocked",
  ),
  integrationMethod(
    "remoteControl/status/read",
    "remote-control-read",
    "Reads remote-control state, local server name, installation id, and environment identity; browser inventory must remain counts-only.",
    "opt-in-read",
  ),
  integrationMethod(
    "remoteControl/enable",
    "remote-control",
    "Enables remote control and can enroll the local app-server with backend relay state.",
    "blocked",
  ),
  integrationMethod(
    "remoteControl/disable",
    "remote-control",
    "Disables remote control and mutates persisted remote-control preference.",
    "blocked",
  ),
  integrationMethod(
    "remoteControl/pairing/start",
    "remote-control",
    "Creates short-lived pairing codes for controller devices.",
    "blocked",
  ),
  integrationMethod(
    "remoteControl/pairing/status",
    "remote-control",
    "Polls pairing claim state for remote-control pairing codes.",
    "blocked",
  ),
  integrationMethod(
    "remoteControl/client/list",
    "remote-control",
    "Lists controller device grants for a remote-control environment.",
    "blocked",
  ),
  integrationMethod(
    "remoteControl/client/revoke",
    "remote-control",
    "Revokes a controller device grant for a remote-control environment.",
    "blocked",
  ),
  integrationMethod(
    "plugin/installed",
    "plugins-read",
    "Reads installed plugin rows and install-suggestion names; browser inventory must not return plugin names, ids, paths, prompts, or URLs.",
    "opt-in-read",
  ),
  integrationMethod("plugin/install", "plugins-install", "Installs a plugin.", "blocked"),
  integrationMethod("plugin/uninstall", "plugins-install", "Uninstalls a plugin.", "blocked"),
  integrationMethod(
    "plugin/share/checkout",
    "plugins-share",
    "Checks out or materializes a shared plugin surface.",
    "blocked",
  ),
  integrationMethod("plugin/share/save", "plugins-share", "Saves plugin sharing state.", "blocked"),
  integrationMethod(
    "plugin/share/updateTargets",
    "plugins-share",
    "Updates plugin sharing targets.",
    "blocked",
  ),
  integrationMethod(
    "plugin/share/delete",
    "plugins-share",
    "Deletes plugin sharing state.",
    "blocked",
  ),
  integrationMethod("marketplace/add", "plugins-marketplace", "Adds a marketplace source.", "blocked"),
  integrationMethod(
    "marketplace/remove",
    "plugins-marketplace",
    "Removes a marketplace source.",
    "blocked",
  ),
  integrationMethod(
    "marketplace/upgrade",
    "plugins-marketplace",
    "Upgrades marketplace metadata or installed content.",
    "blocked",
  ),
  integrationMethod(
    "externalAgentConfig/import",
    "settings-import",
    "Imports external agent configuration into Codex settings and plugin state.",
    "blocked",
  ),
]);

export function integrationMethodAudit() {
  return INTEGRATION_METHOD_AUDIT.map((entry) => ({ ...entry }));
}

export function integrationMethodNames() {
  return INTEGRATION_METHOD_AUDIT.map((entry) => entry.method);
}

export function optInIntegrationReadMethods() {
  return INTEGRATION_METHOD_AUDIT.filter((entry) => entry.status === "opt-in-read").map(
    (entry) => entry.method,
  );
}

export function blockedIntegrationMutationMethods() {
  return INTEGRATION_METHOD_AUDIT.filter((entry) =>
    [
      "auth-callback",
      "auth-mutation",
      "mcp-auth",
      "mcp-tool",
      "settings-write",
      "settings-mutation",
      "settings-import",
      "skills-write",
      "plugins-install",
      "plugins-share",
      "plugins-marketplace",
      "remote-control",
      "remote-environment",
      "thread-lifecycle",
    ].includes(entry.category),
  ).map((entry) => entry.method);
}

function integrationMethod(method, category, risk, status) {
  return Object.freeze({
    method,
    category,
    risk,
    status,
    browserEnabled: status === "read-only",
    requiresExplicitEnablement: status === "opt-in-read",
  });
}

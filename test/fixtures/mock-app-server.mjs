#!/usr/bin/env node
import process from "node:process";

let buffer = "";
const pendingResponses = new Map();

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  while (true) {
    const newlineIndex = buffer.indexOf("\n");
    if (newlineIndex === -1) {
      break;
    }

    const line = buffer.slice(0, newlineIndex).trim();
    buffer = buffer.slice(newlineIndex + 1);
    if (line) {
      handle(JSON.parse(line));
    }
  }
});

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function handle(message) {
  if (Object.hasOwn(message, "id") && pendingResponses.has(message.id)) {
    const handler = pendingResponses.get(message.id);
    pendingResponses.delete(message.id);
    handler(message);
    return;
  }

  if (message.method === "initialize") {
    send({
      id: message.id,
      result: {
        userAgent: "mock-codex/0.0.0 (linux)",
        codexHome: "/tmp/mock-codex-home",
        platformFamily: "unix",
        platformOs: "linux",
      },
    });
    return;
  }

  if (message.method === "initialized") {
    send({
      method: "remoteControl/status/changed",
      params: {
        status: "connected",
        environmentId: "private-remote-environment-id",
        installationId: "private-remote-installation-id",
        serverName: "private-remote-server-name",
      },
    });
    return;
  }

  if (message.method === "remoteControl/status/read") {
    send({
      id: message.id,
      result: {
        status: "connected",
        environmentId: "private-remote-environment-id",
        installationId: "private-remote-installation-id",
        serverName: "private-remote-server-name",
      },
    });
    return;
  }

  if (message.method === "config/read") {
    send({
      id: message.id,
      result: {
        config: {
          model: "gpt-test",
          model_provider: "openai",
          approval_policy: "on-request",
          sandbox_mode: "workspace-write",
          profile: null,
          profiles: {},
        },
        origins: {},
      },
    });
    return;
  }

  if (message.method === "config/value/write") {
    send({
      id: message.id,
      result: {
        ok: true,
        keyPath: message.params?.keyPath,
        value: message.params?.value,
        filePath: "/tmp/mock-workspace/.codex/config.toml",
        privateToken: "sk-proj-private-token",
      },
    });
    return;
  }

  if (message.method === "config/batchWrite") {
    send({
      id: message.id,
      result: {
        ok: true,
        status: "written",
        version: "private-version",
        edits: message.params?.edits,
        filePath: "/tmp/mock-workspace/.codex/config.toml",
        privateToken: "sk-proj-private-token",
      },
    });
    return;
  }

  if (message.method === "model/list") {
    send({
      id: message.id,
      result: {
        data: [
          {
            id: "private-model-id",
            model: "private-model",
            displayName: "private-model-display",
            description: "private model description",
            hidden: false,
            isDefault: true,
            inputModalities: ["text", "image"],
            defaultReasoningEffort: "medium",
            supportedReasoningEfforts: [
              {
                reasoningEffort: "medium",
                description: "private reasoning description",
              },
            ],
            serviceTiers: [
              {
                id: "private-tier-id",
                name: "private tier",
                description: "private tier description",
              },
            ],
            supportsPersonality: true,
            availabilityNux: {
              message: "private availability message",
            },
            upgradeInfo: {
              model: "private-upgrade-model",
              upgradeCopy: "private upgrade copy",
            },
          },
          {
            id: "private-hidden-model-id",
            model: "private-hidden-model",
            displayName: "/tmp/mock-workspace/private-model",
            description: "private hidden model description",
            hidden: true,
            isDefault: false,
            inputModalities: ["text"],
            defaultReasoningEffort: "low",
            supportedReasoningEfforts: [],
            supportsPersonality: false,
          },
        ],
        nextCursor: "private-model-cursor",
      },
    });
    return;
  }

  if (message.method === "modelProvider/capabilities/read") {
    send({
      id: message.id,
      result: {
        imageGeneration: true,
        namespaceTools: true,
        webSearch: false,
      },
    });
    return;
  }

  if (message.method === "collaborationMode/list") {
    send({
      id: message.id,
      result: {
        data: [
          {
            name: "private-mode",
            mode: "default",
            model: "private-model",
            reasoning_effort: "medium",
          },
          {
            name: "/tmp/mock-workspace/private-mode",
            mode: "plan",
            model: null,
            reasoning_effort: null,
          },
        ],
      },
    });
    return;
  }

  if (message.method === "permissionProfile/list") {
    send({
      id: message.id,
      result: {
        data: [
          {
            id: "private-permission-profile",
            description: "private permission profile description",
            allowed: true,
          },
          {
            id: "/tmp/mock-workspace/private-profile",
            description: null,
            allowed: false,
          },
        ],
        nextCursor: "private-permission-profile-cursor",
      },
    });
    return;
  }

  if (message.method === "experimentalFeature/list") {
    send({
      id: message.id,
      result: {
        data: [
          {
            name: "private-experimental-feature",
            displayName: "Private Experimental Feature",
            description: "private feature description",
            announcement: "private announcement",
            stage: "beta",
            enabled: true,
            defaultEnabled: false,
          },
          {
            name: "private-stable-feature",
            displayName: "Private Stable Feature",
            description: null,
            announcement: null,
            stage: "stable",
            enabled: false,
            defaultEnabled: true,
          },
        ],
        nextCursor: "private-feature-cursor",
      },
    });
    return;
  }

  if (message.method === "experimentalFeature/enablement/set") {
    send({
      id: message.id,
      result: {
        enablement: message.params?.enablement ?? {},
        privateToken: "sk-proj-private-feature-token",
        filePath: "/tmp/mock-workspace/.codex/config.toml",
      },
    });
    return;
  }

  if (message.method === "account/logout") {
    send({
      id: message.id,
      result: {
        ok: true,
        token: "sk-proj-private-auth-token",
        accountId: "acct-private-12345678",
        email: "private@example.com",
      },
    });
    send({
      method: "account/updated",
      params: {
        authMode: "chatgpt",
        accountId: "acct-private-12345678",
        email: "private@example.com",
      },
    });
    return;
  }

  if (message.method === "configRequirements/read") {
    send({
      id: message.id,
      result: {
        requirements: {
          allowedApprovalPolicies: ["on-request", "never"],
          allowedApprovalsReviewers: ["user"],
          allowedSandboxModes: ["read-only", "workspace-write"],
          allowedWebSearchModes: ["disabled"],
          enforceResidency: "us",
          featureRequirements: {
            private_feature_a: true,
            private_feature_b: false,
          },
          hooks: {
            PreToolUse: [
              {
                matcher: "private-tool",
                hooks: [
                  {
                    type: "command",
                    command: "cat /tmp/mock-workspace/secret.txt",
                    async: false,
                  },
                ],
              },
            ],
          },
          network: {
            domains: {
              "private.example.test": "allow",
            },
          },
        },
      },
    });
    return;
  }

  if (message.method === "account/read") {
    send({
      id: message.id,
      result: {
        requiresOpenaiAuth: false,
        account: {
          type: "chatgpt",
          email: "person@example.test",
          token: "secret-token",
        },
      },
    });
    return;
  }

  if (message.method === "account/rateLimits/read") {
    send({
      id: message.id,
      result: {
        rateLimits: {
          limitId: "private-limit-id",
          limitName: "private limit name",
          planType: "pro",
          rateLimitReachedType: "rate_limit_reached",
          credits: {
            balance: "123 private credits",
            hasCredits: true,
            unlimited: false,
          },
          primary: {
            usedPercent: 87,
            resetsAt: 1778919807,
            windowDurationMins: 300,
          },
          secondary: {
            usedPercent: 12,
            resetsAt: 1778923407,
            windowDurationMins: 60,
          },
        },
        rateLimitsByLimitId: {
          "private-limit-id": {
            limitId: "private-limit-id",
            limitName: "private limit name",
            planType: "pro",
            rateLimitReachedType: "rate_limit_reached",
            credits: {
              balance: "123 private credits",
              hasCredits: true,
              unlimited: false,
            },
            primary: {
              usedPercent: 87,
              resetsAt: 1778919807,
              windowDurationMins: 300,
            },
          },
        },
      },
    });
    return;
  }

  if (message.method === "account/usage/read") {
    send({
      id: message.id,
      result: {
        summary: {
          currentStreakDays: 7,
          lifetimeTokens: 123456789,
          longestRunningTurnSec: 9876,
          longestStreakDays: 42,
          peakDailyTokens: 654321,
        },
        dailyUsageBuckets: [
          {
            startDate: "2026-06-01-private-date",
            tokens: 12345,
          },
          {
            startDate: "2026-06-02-private-date",
            tokens: 67890,
          },
        ],
      },
    });
    return;
  }

  if (message.method === "account/workspaceMessages/read") {
    send({
      id: message.id,
      result: {
        featureEnabled: true,
        messages: [
          {
            messageId: "private-workspace-message-id",
            messageType: "headline",
            messageBody: "private workspace message body with sk-proj-private-token",
            createdAt: 1782726047,
            archivedAt: null,
          },
          {
            messageId: "private-archived-workspace-message-id",
            messageType: "announcement",
            messageBody: "private archived workspace message body",
            createdAt: 1782726048,
            archivedAt: 1782726049,
          },
        ],
      },
    });
    return;
  }

  if (message.method === "mcpServerStatus/list") {
    send({
      id: message.id,
      result: {
        data: [
          {
            name: "private-mcp",
            authStatus: "oAuth",
            tools: {
              private_tool: {
                inputSchema: {
                  private: true,
                },
              },
            },
            resources: [
              {
                uri: "file:///tmp/mock-workspace/secret.txt",
              },
            ],
            resourceTemplates: [
              {
                uriTemplate: "file:///tmp/mock-workspace/{secret}",
              },
            ],
          },
        ],
      },
    });
    return;
  }

  if (message.method === "mcpServer/resource/read") {
    send({
      id: message.id,
      result: {
        contents: [
          {
            uri: message.params?.uri ?? "file:///tmp/mock-workspace/secret.txt",
            mimeType: "text/plain",
            text: "mock resource secret token sk-proj-private-token from /tmp/mock-workspace/secret.txt",
          },
          {
            uri: "resource://private-binary",
            mimeType: "application/octet-stream",
            blob: "cHJpdmF0ZS1ibG9i",
          },
        ],
      },
    });
    return;
  }

  if (message.method === "mcpServer/tool/call") {
    send({
      id: message.id,
      result: {
        content: [
          {
            type: "text",
            text: `mock tool secret for ${message.params?.server}/${message.params?.tool} with sk-proj-private-token at /tmp/mock-workspace/secret.txt`,
          },
          {
            type: "image",
            data: "cHJpdmF0ZS1pbWFnZQ==",
            mimeType: "image/png",
          },
        ],
        structuredContent: {
          secretPath: "/tmp/mock-workspace/secret.txt",
          token: "sk-proj-private-token",
        },
        isError: false,
      },
    });
    return;
  }

  if (message.method === "config/mcpServer/reload") {
    send({
      id: message.id,
      result: {
        reloaded: true,
        privateServerName: "private-mcp",
        privatePath: "/tmp/mock-workspace/.codex/mcp.json",
        privateToken: "sk-proj-private-token",
      },
    });
    return;
  }

  if (message.method === "mcpServer/oauth/login") {
    send({
      id: message.id,
      result: {
        authorizationUrl:
          `https://auth.example.test/oauth/authorize?server=${encodeURIComponent(message.params?.name ?? "")}&state=private-state&code_challenge=private-challenge`,
        privateServerName: message.params?.name ?? "private-mcp",
        privateToken: "sk-proj-private-mcp-oauth",
      },
    });
    return;
  }

  if (message.method === "plugin/read") {
    send({
      id: message.id,
      result: {
        plugin: {
          marketplaceName: "private-marketplace",
          marketplacePath: "/tmp/mock-workspace/.codex/plugins/private-marketplace",
          description: "private plugin description with sk-proj-private-token",
          apps: [
            {
              id: "private-app-id",
              name: "private-app",
              description: "private app description",
              installUrl: "https://example.test/private/app/install",
              needsAuth: true,
            },
          ],
          hooks: [
            {
              key: "private-hook-key",
              eventName: "PreToolUse",
            },
          ],
          mcpServers: ["private-mcp-server"],
          skills: [
            {
              name: "private-skill",
              description: "private skill description",
              shortDescription: "private short description",
              path: "/tmp/mock-workspace/.codex/plugins/private/SKILL.md",
              enabled: true,
            },
          ],
          summary: {
            id: "private-plugin-id",
            name: message.params?.pluginName ?? "private-plugin",
            installed: true,
            enabled: true,
            installPolicy: "AVAILABLE",
            authPolicy: "none",
            keywords: ["private-keyword"],
            source: {
              type: "local",
              path: "/tmp/mock-workspace/.codex/plugins/private",
              url: "https://example.test/private/plugin",
            },
            shareContext: {
              remotePluginId: "private-remote-plugin-id",
              shareUrl: "https://example.test/private/plugin/share",
            },
          },
        },
      },
    });
    return;
  }

  if (message.method === "plugin/skill/read") {
    send({
      id: message.id,
      result: {
        contents:
          "private skill text for /tmp/mock-workspace/private-skill with sk-proj-private-token",
      },
    });
    return;
  }

  if (message.method === "plugin/uninstall") {
    send({
      id: message.id,
      result: {
        ok: true,
        pluginId: message.params?.pluginId,
        path: "/tmp/mock-workspace/.codex/plugins/private-plugin",
        privateToken: "sk-proj-private-plugin-token",
      },
    });
    return;
  }

  if (message.method === "plugin/share/list") {
    send({
      id: message.id,
      result: {
        data: [
          {
            localPluginPath: "/tmp/mock-workspace/.codex/plugins/private",
            shareUrl: "https://example.test/private/plugin/share",
            plugin: {
              id: "private-plugin-id",
              name: "private-plugin",
              installed: true,
              enabled: true,
              installPolicy: "AVAILABLE",
              authPolicy: "none",
              source: {
                type: "local",
                path: "/tmp/mock-workspace/.codex/plugins/private",
                url: "https://example.test/private/plugin",
              },
            },
          },
        ],
      },
    });
    return;
  }

  if (message.method === "skills/config/write") {
    send({
      id: message.id,
      result: {
        effectiveEnabled: Boolean(message.params?.enabled),
        name: message.params?.name ?? "private-skill",
        path: "/tmp/mock-workspace/.codex/skills/private/SKILL.md",
      },
    });
    return;
  }

  if (message.method === "skills/list") {
    send({
      id: message.id,
      result: {
        data: [
          {
            cwd: "/tmp/mock-workspace",
            errors: [
              {
                message: "private skill error",
                path: "/tmp/mock-workspace/.codex/skills/private",
              },
            ],
            skills: [
              {
                name: "private-skill",
                description: "private description",
                path: "/tmp/mock-workspace/.codex/skills/private/SKILL.md",
                enabled: true,
                scope: "repo",
                dependencies: {
                  tools: ["private-tool"],
                },
              },
            ],
          },
        ],
      },
    });
    return;
  }

  if (message.method === "app/list") {
    send({
      id: message.id,
      result: {
        data: [
          {
            id: "private-app-id",
            name: "private-app",
            description: "private app description",
            distributionChannel: "local",
            installUrl: "https://example.test/private/app/install",
            isAccessible: true,
            isEnabled: true,
            labels: {
              private_label: "private label value",
            },
            logoUrl: "https://example.test/private/app/logo.png",
            logoUrlDark: "https://example.test/private/app/logo-dark.png",
            pluginDisplayNames: ["private-plugin", "/tmp/mock-workspace/private-plugin"],
            branding: {
              category: "private-category",
              developer: "private developer",
              isDiscoverableApp: true,
              privacyPolicy: "https://example.test/private/app/privacy",
              termsOfService: "https://example.test/private/app/terms",
              website: "https://example.test/private/app",
            },
            appMetadata: {
              categories: ["private-category"],
              developer: "private developer",
              firstPartyRequiresInstall: true,
              firstPartyType: "first_party",
              review: {
                status: "private-review",
              },
              screenshots: [
                {
                  fileId: "private-file-id",
                  url: "https://example.test/private/app/screenshot.png",
                  userPrompt: "private screenshot prompt",
                },
              ],
              seoDescription: "private seo description",
              subCategories: ["private-subcategory"],
              version: "private-version",
              versionId: "private-version-id",
              versionNotes: "private version notes",
            },
          },
        ],
        nextCursor: "private-next-cursor",
      },
    });
    return;
  }

  if (message.method === "plugin/list") {
    send({
      id: message.id,
      result: {
        marketplaces: [
          {
            plugins: [
              {
                id: "private-plugin-id",
                name: "private-plugin",
                installed: true,
                enabled: true,
                installPolicy: "AVAILABLE",
                source: {
                  type: "local",
                  path: "/tmp/mock-workspace/.codex/plugins/private",
                  url: "https://example.test/private/plugin",
                },
              },
            ],
          },
        ],
        marketplaceLoadErrors: [
          {
            message: "private marketplace error",
          },
        ],
        featuredPluginIds: ["private-plugin-id"],
      },
    });
    return;
  }

  if (message.method === "plugin/installed") {
    send({
      id: message.id,
      result: {
        marketplaces: [
          {
            displayName: "private-installed-marketplace",
            plugins: [
              {
                id: "private-installed-plugin-id",
                name: "private-installed-plugin",
                installed: true,
                enabled: true,
                installPolicy: "AVAILABLE",
                authPolicy: "ON_USE",
                interface: {
                  defaultPrompt: ["private installed prompt"],
                  screenshotUrls: ["https://example.test/private-installed-screenshot.png"],
                  screenshots: [{ url: "https://example.test/private-installed-screenshot.png" }],
                  capabilities: ["private-capability"],
                },
                source: {
                  type: "local",
                  path: "/tmp/mock-workspace/.codex/plugins/private-installed",
                  url: "https://example.test/private-installed-plugin",
                },
              },
            ],
          },
        ],
        marketplaceLoadErrors: [
          {
            marketplacePath: "/tmp/mock-workspace/.codex/private-installed-marketplace",
            message: "private installed marketplace error",
          },
        ],
      },
    });
    return;
  }

  if (message.method === "hooks/list") {
    send({
      id: message.id,
      result: {
        data: [
          {
            cwd: "/tmp/mock-workspace",
            errors: [
              {
                message: "private hook error",
                path: "/tmp/mock-workspace/.codex/hooks/private.toml",
              },
            ],
            warnings: ["private hook warning"],
            hooks: [
              {
                command: "cat /tmp/mock-workspace/secret.txt",
                currentHash: "private-hash",
                displayOrder: 1,
                enabled: true,
                eventName: "preToolUse",
                handlerType: "command",
                isManaged: false,
                key: "private-hook-key",
                matcher: "private-tool",
                pluginId: "private-plugin-id",
                source: "project",
                sourcePath: "/tmp/mock-workspace/.codex/hooks/private.toml",
                timeoutSec: 10,
                trustStatus: "trusted",
              },
            ],
          },
        ],
      },
    });
    return;
  }

  if (message.method === "externalAgentConfig/detect") {
    send({
      id: message.id,
      result: {
        items: [
          {
            cwd: "/tmp/mock-workspace",
            description: "Import private external agent config",
            itemType: "MCP_SERVER_CONFIG",
            details: {
              mcpServers: [{ name: "private-external-mcp" }],
              plugins: [
                {
                  marketplaceName: "private-marketplace",
                  pluginNames: ["private-external-plugin", "/tmp/mock-workspace/plugin"],
                },
              ],
              hooks: [{ name: "private-external-hook" }],
              commands: [{ name: "private-external-command" }],
              sessions: [
                {
                  cwd: "/tmp/mock-workspace",
                  path: "/tmp/mock-workspace/.claude/session.jsonl",
                  title: "private external session",
                },
              ],
              subagents: [{ name: "private-external-subagent" }],
            },
          },
          {
            cwd: null,
            description: "Import private home config",
            itemType: "SKILLS",
            details: {
              commands: [],
              hooks: [],
              mcpServers: [],
              plugins: [],
              sessions: [],
              subagents: [],
            },
          },
        ],
      },
    });
    return;
  }

  if (message.method === "externalAgentConfig/import/readHistories") {
    send({
      id: message.id,
      result: {
        data: [
          {
            importId: "private-import-id",
            completedAtMs: 1782726047000,
            successes: [
              {
                itemType: "MCP_SERVER_CONFIG",
                cwd: "/tmp/mock-workspace",
                source: "/tmp/mock-workspace/.claude/config.json",
                target: "/tmp/mock-workspace/.codex/mcp.json",
              },
            ],
            failures: [
              {
                itemType: "SESSIONS",
                cwd: "/tmp/mock-workspace",
                source: "/tmp/mock-workspace/.claude/session.jsonl",
                failureStage: "private-stage",
                errorType: "private-error-type",
                message: "private import failure message",
              },
            ],
          },
        ],
      },
    });
    return;
  }

  if (message.method === "command/exec") {
    send({
      id: message.id,
      result: {
        exitCode: 0,
        stdout: "private command stdout /tmp/mock-workspace/secret.txt",
        stderr: "private command stderr sk-proj-privatevalue",
      },
    });
    return;
  }

  if (
    message.method === "command/exec/write" ||
    message.method === "command/exec/resize" ||
    message.method === "command/exec/terminate" ||
    message.method === "process/writeStdin" ||
    message.method === "process/resizePty" ||
    message.method === "process/kill"
  ) {
    send({
      id: message.id,
      result: {
        ok: true,
        processId: message.params?.processId,
        privateOutput: "terminal control touched /tmp/mock-workspace/secret.txt",
        deltaBase64: message.params?.deltaBase64,
      },
    });
    return;
  }

  if (message.method === "thread/list") {
    const archived = message.params?.archived === true;
    send({
      id: message.id,
      result: {
        data: [
          {
            id: archived ? "thread-00000002" : "thread-00000001",
            sessionId: "session-1",
            forkedFromId: null,
            preview: "Sensitive preview must not leave sanitizer",
            ephemeral: false,
            modelProvider: "openai",
            createdAt: 1,
            updatedAt: 2,
            status: { type: archived ? "completed" : "notLoaded" },
            path: null,
            cwd: "/tmp/mock-workspace",
            cliVersion: "0.0.0",
            source: "cli",
            threadSource: null,
            agentNickname: null,
            agentRole: null,
            gitInfo: null,
            name: archived ? "Sensitive archived thread name" : "Sensitive thread name",
            turns: [],
          },
        ],
        nextCursor: null,
        backwardsCursor: null,
      },
    });
    return;
  }

  if (message.method === "thread/search") {
    const archived = message.params?.archived === true;
    send({
      id: message.id,
      result: {
        data: [
          {
            snippet:
              "private search snippet with /tmp/mock-workspace/secret.txt and sk-proj-private-search",
            thread: {
              id: archived ? "thread-search-00000004" : "thread-search-00000003",
              sessionId: "private-session-id",
              forkedFromId: null,
              preview: "Private search preview must not leave sanitizer",
              ephemeral: false,
              modelProvider: "openai",
              createdAt: 11,
              updatedAt: 12,
              status: { type: archived ? "completed" : "notLoaded" },
              path: null,
              cwd: "/tmp/mock-workspace/private-search-cwd",
              cliVersion: "0.0.0",
              source: "cli",
              threadSource: null,
              agentNickname: null,
              agentRole: null,
              gitInfo: { private: true },
              name: "Private search thread name",
              turns: [],
            },
          },
        ],
        nextCursor: "private-search-next-cursor",
        backwardsCursor: "private-search-backwards-cursor",
      },
    });
    return;
  }

  if (message.method === "thread/read") {
    const threadId = message.params?.threadId || "thread-00000001";
    const archived = threadId === "thread-00000002";
    send({
      id: message.id,
      result: {
        thread: {
          id: threadId,
          sessionId: "session-1",
          forkedFromId: null,
          preview: "Sensitive preview must not leave sanitizer",
          ephemeral: false,
          modelProvider: "openai",
          createdAt: 1,
          updatedAt: 2,
          status: archived ? "completed" : "notLoaded",
          path: null,
          cwd: "/tmp/mock-workspace",
          cliVersion: "0.0.0",
          source: "cli",
          threadSource: null,
          agentNickname: null,
          agentRole: null,
          gitInfo: null,
          name: archived ? "Sensitive archived thread name" : "Sensitive thread name",
          turns: [
            {
              id: "turn-sensitive-00000002",
              itemsView: "full",
              status: "completed",
              startedAt: 3,
              completedAt: 4,
              durationMs: 1000,
              items: [
                {
                  type: "userMessage",
                  id: "item-sensitive-00000003",
                  content: "Sensitive user prompt must not leave sanitizer",
                },
                {
                  type: "agentMessage",
                  id: "item-sensitive-00000004",
                  text: "Sensitive assistant answer must not leave sanitizer",
                  phase: "final_answer",
                },
                {
                  type: "fileChange",
                  id: "item-sensitive-00000005",
                  status: "completed",
                  changes: [
                    {
                      path: "/tmp/mock-workspace/secret.txt",
                      kind: "update",
                      diff: "Sensitive patch content must not leave sanitizer",
                      content: "Sensitive file content must not leave sanitizer",
                      command: "rm -rf /tmp/mock-workspace",
                      additions: 2,
                      deletions: 1,
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    });
    return;
  }

  if (message.method === "thread/loaded/list") {
    send({
      id: message.id,
      result: {
        data: [
          "thread-private-loaded-00000001",
          "thread-private-loaded-00000002",
        ],
        nextCursor: null,
      },
    });
    return;
  }

  if (message.method === "thread/start") {
    send({
      id: message.id,
      result: {
        thread: {
          id: "thread-1",
          sessionId: "session-1",
          forkedFromId: null,
          preview: "",
          ephemeral: true,
          modelProvider: "openai",
          createdAt: 0,
          updatedAt: 0,
          status: "idle",
          path: null,
          cwd: "/tmp/mock-workspace",
          cliVersion: "0.0.0",
          source: "appServer",
          threadSource: null,
          agentNickname: null,
          agentRole: null,
          gitInfo: null,
          name: null,
          turns: [],
        },
        model: "gpt-test",
        modelProvider: "openai",
        serviceTier: null,
        cwd: "/tmp/mock-workspace",
        runtimeWorkspaceRoots: [],
        instructionSources: [],
        approvalPolicy: "on-request",
        approvalsReviewer: "user",
        sandbox: {
          mode: "read-only",
        },
        activePermissionProfile: null,
        reasoningEffort: null,
      },
    });
    return;
  }

  if (message.method === "thread/archive" || message.method === "thread/unarchive") {
    send({
      id: message.id,
      result: {
        ok: true,
        threadId: message.params?.threadId,
        privatePath: "/tmp/mock-workspace/secret.txt",
        preview: "Sensitive archive response must not leave sanitizer",
      },
    });
    send({
      method: message.method === "thread/archive" ? "thread/archived" : "thread/unarchived",
      params: {
        threadId: message.params?.threadId,
        cwd: "/tmp/mock-workspace",
        preview: "Sensitive archive notification must not leave sanitizer",
      },
    });
    return;
  }

  if (message.method === "thread/delete") {
    send({
      id: message.id,
      result: {
        ok: true,
        threadId: message.params?.threadId,
        privatePath: "/tmp/mock-workspace/delete-secret.txt",
        preview: "Sensitive delete response must not leave sanitizer",
      },
    });
    send({
      method: "thread/deleted",
      params: {
        threadId: message.params?.threadId,
        cwd: "/tmp/mock-workspace",
        preview: "Sensitive delete notification must not leave sanitizer",
      },
    });
    return;
  }

  if (message.method === "thread/fork") {
    send({
      id: message.id,
      result: {
        thread: {
          id: "thread-fork-private-abcd9999",
          sessionId: "session-fork-private",
          forkedFromId: message.params?.threadId,
          preview: "Sensitive fork preview must not leave sanitizer",
          ephemeral: false,
          modelProvider: "openai",
          createdAt: 0,
          updatedAt: 0,
          status: "idle",
          path: "/tmp/mock-workspace/fork-secret.jsonl",
          cwd: "/tmp/mock-workspace",
          cliVersion: "0.0.0",
          source: "appServer",
          threadSource: null,
          agentNickname: null,
          agentRole: null,
          gitInfo: null,
          name: "Sensitive fork name must not leave sanitizer",
          turns: [
            {
              id: "turn-private-fork",
              items: [
                {
                  type: "agentMessage",
                  text: "Sensitive fork transcript must not leave sanitizer",
                },
              ],
            },
          ],
        },
        model: "gpt-test",
        modelProvider: "openai",
        serviceTier: null,
        cwd: "/tmp/mock-workspace",
        runtimeWorkspaceRoots: ["/tmp/mock-workspace"],
        instructionSources: ["/tmp/mock-workspace/AGENTS.md"],
        approvalPolicy: "on-request",
        approvalsReviewer: "user",
        sandbox: {
          mode: "read-only",
        },
        activePermissionProfile: null,
        reasoningEffort: null,
        privatePath: "/tmp/mock-workspace/fork-response-secret.txt",
      },
    });
    send({
      method: "thread/forked",
      params: {
        threadId: "thread-fork-private-abcd9999",
        forkedFromId: message.params?.threadId,
        cwd: "/tmp/mock-workspace",
        preview: "Sensitive fork notification must not leave sanitizer",
      },
    });
    return;
  }

  if (message.method === "thread/compact/start") {
    send({
      id: message.id,
      result: {
        ok: true,
        threadId: message.params?.threadId,
        privateSummary: "Sensitive compact summary must not leave sanitizer",
        cwd: "/tmp/mock-workspace",
      },
    });
    send({
      method: "thread/compacted",
      params: {
        threadId: message.params?.threadId,
        summary: "Sensitive compact notification must not leave sanitizer",
        cwd: "/tmp/mock-workspace",
      },
    });
    return;
  }

  if (message.method === "turn/start") {
    const promptText = Array.isArray(message.params?.input)
      ? message.params.input.map((item) => item?.text).filter(Boolean).join("\n")
      : "";
    const turn = {
      id: promptText.includes("terminal lifecycle") ? "turn-terminal-00000009" : "turn-1",
      items: [],
      itemsView: "notLoaded",
      status: "completed",
      error: null,
      startedAt: null,
      completedAt: null,
      durationMs: null,
    };

    if (promptText.includes("permissions approval")) {
      const requestId = "server-request-permissions-approval-00000001";
      pendingResponses.set(requestId, () => {
        sendTurnStartResult(message, turn);
      });
      send({
        id: requestId,
        method: "item/permissions/requestApproval",
        params: {
          threadId: message.params?.threadId,
          turnId: turn.id,
          itemId: "item-sensitive-permissions-00000006",
          cwd: "/tmp/mock-workspace",
          reason: "Request /tmp/mock-workspace write with token=private-token-value",
          permissions: {
            fileSystem: {
              read: ["/tmp/mock-workspace/private-read"],
              write: ["/tmp/mock-workspace/private-write"],
            },
            network: {
              enabled: true,
            },
          },
          startedAtMs: 1778930000000,
        },
      });
      return;
    }

    if (promptText.includes("file approval")) {
      const requestId = "server-request-file-approval-00000001";
      pendingResponses.set(requestId, () => {
        sendTurnStartResult(message, turn);
      });
      send({
        id: requestId,
        method: "item/fileChange/requestApproval",
        params: {
          threadId: message.params?.threadId,
          turnId: turn.id,
          itemId: "item-sensitive-file-00000004",
          reason: "Write /tmp/mock-workspace/secret.txt with token=private-token-value",
          grantRoot: "/tmp/mock-workspace",
        },
      });
      return;
    }

    if (promptText.includes("approval")) {
      const requestId = "server-request-approval-00000001";
      pendingResponses.set(requestId, () => {
        sendTurnStartResult(message, turn);
      });
      send({
        id: requestId,
        method: "item/commandExecution/requestApproval",
        params: {
          threadId: message.params?.threadId,
          turnId: turn.id,
          itemId: "item-sensitive-id-00000004",
          approvalId: "approval-sensitive-id-00000005",
          command: "cat /tmp/mock-workspace/secret.txt",
          cwd: "/tmp/mock-workspace",
          availableDecisions: ["accept", "decline", "cancel"],
        },
      });
      return;
    }

    sendTurnStartResult(message, turn);
    return;
  }

  if (message.method === "turn/interrupt") {
    send({
      id: message.id,
      result: {},
    });
    queueMicrotask(() => {
      send({
        method: "turn/completed",
        params: {
          threadId: message.params?.threadId,
          turnId: message.params?.turnId,
          status: "interrupted",
          sensitiveText: "raw interrupted content should not leave sanitizer",
        },
      });
    });
    return;
  }

  if (message.method === "process/spawn") {
    send({
      id: message.id,
      result: {},
    });
    queueMicrotask(() => {
      send({
        method: "process/exited",
        params: {
          processHandle: message.params?.processHandle,
          exitCode: 0,
          stdout: "Sensitive process stdout /tmp/mock-workspace/secret.txt",
          stdoutCapReached: false,
          stderr: "Sensitive process stderr token=private-token-value",
          stderrCapReached: false,
        },
      });
    });
    return;
  }

  if (message.method === "turn/steer") {
    send({
      id: message.id,
      result: {
        turnId: message.params?.expectedTurnId || "turn-sensitive-00000002",
      },
    });
    queueMicrotask(() => {
      send({
        method: "item/agentMessage/delta",
        params: {
          threadId: message.params?.threadId,
          turnId: message.params?.expectedTurnId,
          text: "Sensitive steer response should not leave sanitizer",
        },
      });
    });
    return;
  }

  if (message.method === "thread/unsubscribe") {
    send({
      id: message.id,
      result: {
        status: "unsubscribed",
      },
    });
    return;
  }

  if (message.method === "thread/backgroundTerminals/clean") {
    send({
      id: message.id,
      result: {},
    });
    return;
  }

  if (message.method === "thread/name/set") {
    send({
      id: message.id,
      result: {
        ok: true,
        threadId: message.params?.threadId,
        name: message.params?.name,
        privatePath: "/tmp/mock-workspace/rename-secret.txt",
        preview: "Sensitive rename response must not leave sanitizer",
      },
    });
    send({
      method: "thread/renamed",
      params: {
        threadId: message.params?.threadId,
        name: message.params?.name,
        cwd: "/tmp/mock-workspace",
        preview: "Sensitive rename notification must not leave sanitizer",
      },
    });
    return;
  }

  if (message.method === "thread/backgroundTerminals/list") {
    send({
      id: message.id,
      result: {
        data: [
          {
            processId: "bg-process-private-1",
            itemId: "bg-item-private-1",
            command: "cat /tmp/mock-workspace/terminal-secret.txt",
            cwd: "/tmp/mock-workspace/private-terminal",
            osPid: 4242,
            cpuPercent: 1.5,
            rssKb: 2048,
          },
        ],
        nextCursor: "private-terminal-cursor",
      },
    });
    return;
  }

  if (message.method === "thread/backgroundTerminals/terminate") {
    send({
      id: message.id,
      result: {
        terminated: message.params?.processId === "bg-process-private-1",
      },
    });
    return;
  }

  if (message.method === "thread/shellCommand") {
    send({
      id: message.id,
      result: {},
    });
    return;
  }

  if (message.method === "fail/test") {
    send({
      id: message.id,
      error: {
        code: -32000,
        message: "mock failure",
      },
    });
    return;
  }

  send({
    id: message.id,
    error: {
      code: -32601,
      message: `unknown method: ${message.method}`,
    },
  });
}

function sendTurnStartResult(message, turn) {
    const promptText = turnPromptText(message);
    send({
      id: message.id,
      result: {
        turn,
      },
    });
    queueMicrotask(() => {
      if (promptText.includes("terminal lifecycle")) {
        send({
          method: "item/commandExecution/outputDelta",
          params: {
            threadId: message.params?.threadId,
            turnId: turn.id,
            itemId: "item-sensitive-command-00000006",
            delta: "Sensitive command output from /tmp/mock-workspace/secret.txt",
          },
        });
        send({
          method: "item/commandExecution/terminalInteraction",
          params: {
            threadId: message.params?.threadId,
            turnId: turn.id,
            itemId: "item-sensitive-command-00000006",
            processId: "process-sensitive-00000007",
            stdin: "token=sk-proj-secretvalue\n",
          },
        });
        send({
          method: "process/exited",
          params: {
            processHandle: "process-handle-sensitive-00000008",
            exitCode: 1,
            stdout: "Sensitive stdout from /tmp/mock-workspace",
            stderr: "Sensitive stderr token=sk-proj-secretvalue",
            stdoutCapReached: false,
            stderrCapReached: true,
          },
        });
      }
      send({
        method: "item/agentMessage/delta",
        params: {
          threadId: message.params?.threadId,
          turnId: turn.id,
          itemId: "item-sensitive-id-00000003",
          delta:
            "Live turn output mentions /tmp/mock-workspace/secret.txt and token=sk-proj-secretvalue",
        },
      });
      send({
        method: "turn/completed",
        params: {
          threadId: message.params?.threadId ?? "thread-1",
          turn,
          sensitiveText: "raw assistant content should not leave sanitizer",
        },
      });
    });
}

function turnPromptText(message) {
  return Array.isArray(message.params?.input)
    ? message.params.input.map((item) => item?.text).filter(Boolean).join("\n")
    : "";
}

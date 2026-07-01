import assert from "node:assert/strict";
import { test } from "node:test";
import process from "node:process";

import { JsonlRpcClient, JsonlRpcError } from "../src/app-server/jsonl-rpc.mjs";
import {
  runCollaborationModesReadProbe,
  runAccountLogoutProbe,
  runAccountReadProbe,
  runConfigBatchWriteProbe,
  runConfigRequirementsReadProbe,
  runConfigValueWriteProbe,
  runEnvironmentAddProbe,
  runExperimentalFeatureEnablementSetProbe,
  runAppsListReadProbe,
  runHooksListReadProbe,
  runIntegrationsInventoryProbe,
  runMcpServerOauthLoginProbe,
  runMcpServerReloadProbe,
  runMcpServerStatusReadProbe,
  runModelProviderCapabilitiesReadProbe,
  runModelsListReadProbe,
  runMcpToolCallProbe,
  runMcpResourceReadProbe,
  runPluginContentReadProbe,
  runPluginsListReadProbe,
  runPluginReadProbe,
  runPluginShareCheckoutProbe,
  runPluginUninstallProbe,
  runProcessSpawnProbe,
  runRemoteControlClientRevokeProbe,
  runRemoteControlClientsListProbe,
  runRemoteControlDisableProbe,
  runSkillsConfigWriteProbe,
  runSkillsExtraRootsClearProbe,
  runSkillsListReadProbe,
  runTerminalCommandExecProbe,
  runThreadArchiveProbe,
  runThreadChangesProbe,
  runThreadDeleteProbe,
  runThreadDetailProbe,
  runThreadForkProbe,
  runThreadRenameProbe,
  runThreadRollbackProbe,
  runThreadSafetyLockProbe,
  runThreadSearchProbe,
  runThreadStartProbe,
  runThreadTranscriptProbe,
  runLiveSessionControlProbe,
  runTurnStartProbe,
  sanitizeNotification,
  summarizeLoadedSessions,
  summarizeThreadChanges,
  summarizeThreadDetail,
  summarizeThreadList,
  summarizeThreadTranscript,
} from "../src/app-server/probe.mjs";

const mockServer = new URL("./fixtures/mock-app-server.mjs", import.meta.url);

test("JsonlRpcClient performs initialize and read-only requests", async () => {
  const notifications = [];
  const client = new JsonlRpcClient({
    command: process.execPath,
    args: [mockServer.pathname],
    timeoutMs: 1_000,
    onNotification(notification) {
      notifications.push(notification);
    },
  });

  await client.start();
  try {
    const initialize = await client.request("initialize", {
      clientInfo: {
        name: "test",
        version: "0.0.0",
      },
    });
    assert.equal(initialize.platformOs, "linux");

    client.notify("initialized");

    const config = await client.request("config/read", {
      includeLayers: false,
      cwd: process.cwd(),
    });
    assert.equal(config.config.model, "gpt-test");

    const threads = await client.request("thread/list", {
      limit: 1,
      archived: false,
      useStateDbOnly: true,
    });
    assert.equal(threads.data.length, 1);
    assert.equal(notifications[0].method, "remoteControl/status/changed");
  } finally {
    await client.close();
  }
});

test("JsonlRpcClient rejects JSON-RPC errors", async () => {
  const client = new JsonlRpcClient({
    command: process.execPath,
    args: [mockServer.pathname],
    timeoutMs: 1_000,
  });

  await client.start();
  try {
    await assert.rejects(
      client.request("fail/test", {}),
      (error) => error instanceof JsonlRpcError && error.code === -32000,
    );
  } finally {
    await client.close();
  }
});

test("JsonlRpcClient can wait for notifications", async () => {
  const client = new JsonlRpcClient({
    command: process.execPath,
    args: [mockServer.pathname],
    timeoutMs: 1_000,
  });

  await client.start();
  try {
    await client.request("turn/start", {
      threadId: "thread-1",
      input: [],
    });
    const completed = await client.waitForNotification(
      (notification) => notification.method === "turn/completed",
    );
    assert.equal(completed.params.threadId, "thread-1");
  } finally {
    await client.close();
  }
});

test("runIntegrationsInventoryProbe returns counts without integration secrets", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_INTEGRATION_INVENTORY;
  process.env.CODEX_APP_PORT_ALLOW_INTEGRATION_INVENTORY = "1";
  try {
    const summary = await runIntegrationsInventoryProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
    });

    const inventory = summary.probes.integrationsInventory;
    assert.equal(summary.ok, true);
    assert.equal(inventory.requirements.ok, true);
    assert.equal(inventory.requirements.featureRequirementCount, 2);
    assert.equal(inventory.requirements.hookCommandsReturned, false);
    assert.equal(inventory.requirements.domainsReturned, false);
    assert.equal(inventory.models.ok, true);
    assert.equal(inventory.models.modelCount, 2);
    assert.equal(inventory.models.defaultCount, 1);
    assert.equal(inventory.models.hiddenCount, 1);
    assert.equal(inventory.models.imageInputCount, 1);
    assert.equal(inventory.models.reasoningEffortOptionCount, 1);
    assert.equal(inventory.models.namesReturned, false);
    assert.equal(inventory.models.modelIdsReturned, false);
    assert.equal(inventory.models.descriptionsReturned, false);
    assert.equal(inventory.models.upgradeCopyReturned, false);
    assert.equal(inventory.models.availabilityMessagesReturned, false);
    assert.equal(inventory.modelProviderCapabilities.ok, true);
    assert.equal(inventory.modelProviderCapabilities.enabledCapabilityCount, 2);
    assert.equal(inventory.modelProviderCapabilities.webSearchEnabled, false);
    assert.equal(inventory.modelProviderCapabilities.rawPayloadReturned, false);
    assert.equal(inventory.collaborationModes.ok, true);
    assert.equal(inventory.collaborationModes.modeCount, 2);
    assert.equal(inventory.collaborationModes.modelOverrideCount, 1);
    assert.equal(inventory.collaborationModes.namesReturned, false);
    assert.equal(inventory.collaborationModes.modelIdsReturned, false);
    assert.equal(inventory.collaborationModes.rawPayloadReturned, false);
    assert.equal(inventory.permissionProfiles.ok, true);
    assert.equal(inventory.permissionProfiles.profileCount, 2);
    assert.equal(inventory.permissionProfiles.allowedCount, 1);
    assert.equal(inventory.permissionProfiles.blockedCount, 1);
    assert.equal(inventory.permissionProfiles.descriptionCount, 1);
    assert.equal(inventory.permissionProfiles.hasNextCursor, true);
    assert.equal(inventory.permissionProfiles.returnedProfileCount, 0);
    assert.equal(inventory.permissionProfiles.namesReturned, false);
    assert.deepEqual(inventory.permissionProfiles.items, []);
    assert.equal(inventory.permissionProfiles.idsReturned, false);
    assert.equal(inventory.permissionProfiles.descriptionsReturned, false);
    assert.equal(inventory.permissionProfiles.rawPayloadReturned, false);
    assert.equal(inventory.account.hasAccount, true);
    assert.equal(inventory.account.accountType, "chatgpt");
    assert.equal(inventory.account.emailReturned, false);
    assert.equal(inventory.account.tokenReturned, false);
    assert.equal(inventory.rateLimits.ok, true);
    assert.equal(inventory.rateLimits.bucketCount, 1);
    assert.equal(inventory.rateLimits.primaryWindowCount, 1);
    assert.equal(inventory.rateLimits.reachedBucketCount, 1);
    assert.equal(inventory.rateLimits.rateLimitReached, true);
    assert.equal(inventory.rateLimits.planTypesReturned, false);
    assert.equal(inventory.rateLimits.limitIdsReturned, false);
    assert.equal(inventory.rateLimits.limitNamesReturned, false);
    assert.equal(inventory.rateLimits.balancesReturned, false);
    assert.equal(inventory.rateLimits.usedPercentsReturned, false);
    assert.equal(inventory.rateLimits.resetTimesReturned, false);
    assert.equal(inventory.accountUsage.ok, true);
    assert.equal(inventory.accountUsage.summaryMetricCount, 5);
    assert.equal(inventory.accountUsage.dailyBucketCount, 2);
    assert.equal(inventory.accountUsage.bucketWithTokenCount, 2);
    assert.equal(inventory.accountUsage.bucketWithStartDateCount, 2);
    assert.equal(inventory.accountUsage.usageValuesReturned, false);
    assert.equal(inventory.accountUsage.dailyBucketDatesReturned, false);
    assert.equal(inventory.accountUsage.rawPayloadReturned, false);
    assert.equal(inventory.workspaceMessages.ok, true);
    assert.equal(inventory.workspaceMessages.featureEnabled, true);
    assert.equal(inventory.workspaceMessages.messageCount, 2);
    assert.deepEqual(inventory.workspaceMessages.messageTypeCounts, {
      headline: 1,
      announcement: 1,
    });
    assert.equal(inventory.workspaceMessages.bodyCount, 2);
    assert.equal(inventory.workspaceMessages.archivedTimestampCount, 1);
    assert.equal(inventory.workspaceMessages.createdTimestampCount, 2);
    assert.equal(inventory.workspaceMessages.messageIdsReturned, false);
    assert.equal(inventory.workspaceMessages.messageBodiesReturned, false);
    assert.equal(inventory.workspaceMessages.timestampsReturned, false);
    assert.equal(inventory.workspaceMessages.rawPayloadReturned, false);
    assert.equal(inventory.remoteControlStatus.ok, true);
    assert.equal(inventory.remoteControlStatus.statusKnown, true);
    assert.deepEqual(inventory.remoteControlStatus.statusCounts, { connected: 1 });
    assert.equal(inventory.remoteControlStatus.identityFieldCount, 3);
    assert.equal(inventory.remoteControlStatus.environmentIdPresent, true);
    assert.equal(inventory.remoteControlStatus.installationIdPresent, true);
    assert.equal(inventory.remoteControlStatus.serverNamePresent, true);
    assert.equal(inventory.remoteControlStatus.statusValueReturned, false);
    assert.equal(inventory.remoteControlStatus.environmentIdReturned, false);
    assert.equal(inventory.remoteControlStatus.installationIdReturned, false);
    assert.equal(inventory.remoteControlStatus.serverNameReturned, false);
    assert.equal(inventory.remoteControlStatus.rawPayloadReturned, false);
    assert.equal(inventory.apps.appCount, 1);
    assert.equal(inventory.apps.enabledCount, 1);
    assert.equal(inventory.apps.accessibleCount, 1);
    assert.equal(inventory.apps.pluginDisplayNameCount, 2);
    assert.equal(inventory.apps.namesReturned, false);
    assert.equal(inventory.apps.pluginDisplayNamesReturned, false);
    assert.equal(inventory.apps.idsReturned, false);
    assert.equal(inventory.apps.descriptionsReturned, false);
    assert.equal(inventory.apps.labelsReturned, false);
    assert.equal(inventory.apps.logosReturned, false);
    assert.equal(inventory.apps.urlsReturned, false);
    assert.equal(inventory.apps.screenshotsReturned, false);
    assert.equal(inventory.mcp.serverCount, 1);
    assert.equal(inventory.mcp.toolCount, 1);
    assert.equal(inventory.skills.skillCount, 1);
    assert.deepEqual(inventory.skills.scopeCounts, { repo: 1 });
    assert.equal(inventory.skills.dependencyToolCount, 1);
    assert.equal(inventory.skills.dependencyToolCommandCount, 1);
    assert.equal(inventory.skills.dependencyToolUrlCount, 1);
    assert.equal(inventory.skills.dependencyToolTransportCount, 1);
    assert.equal(inventory.skills.dependencyToolDescriptionCount, 1);
    assert.equal(inventory.skills.displayNameCount, 1);
    assert.equal(inventory.skills.shortDescriptionCount, 1);
    assert.equal(inventory.skills.defaultPromptCount, 1);
    assert.equal(inventory.skills.iconCount, 2);
    assert.equal(inventory.skills.brandColorCount, 1);
    assert.equal(inventory.skills.displayNamesReturned, false);
    assert.equal(inventory.skills.defaultPromptsReturned, false);
    assert.equal(inventory.skills.iconsReturned, false);
    assert.equal(inventory.skills.brandColorsReturned, false);
    assert.equal(inventory.skills.dependencyToolValuesReturned, false);
    assert.equal(inventory.skills.dependencyToolCommandsReturned, false);
    assert.equal(inventory.skills.dependencyToolUrlsReturned, false);
    assert.equal(inventory.skills.dependencyToolDescriptionsReturned, false);
    assert.equal(inventory.plugins.marketplaceCount, 1);
    assert.equal(inventory.plugins.localMarketplaceCount, 1);
    assert.equal(inventory.plugins.remoteMarketplaceCount, 0);
    assert.equal(inventory.plugins.marketplaceDisplayNameCount, 1);
    assert.equal(inventory.plugins.pluginCount, 1);
    assert.equal(inventory.plugins.pluginWithDisplayNameCount, 1);
    assert.equal(inventory.plugins.pluginWithDescriptionCount, 1);
    assert.equal(inventory.plugins.pluginWithDefaultPromptCount, 1);
    assert.equal(inventory.plugins.pluginWithCapabilityCount, 1);
    assert.equal(inventory.plugins.pluginWithScreenshotCount, 1);
    assert.deepEqual(inventory.plugins.sourceTypeCounts, { local: 1 });
    assert.deepEqual(inventory.plugins.installPolicyCounts, { AVAILABLE: 1 });
    assert.deepEqual(inventory.plugins.authPolicyCounts, { ON_USE: 1 });
    assert.equal(inventory.plugins.remotePluginCatalogRequested, false);
    assert.equal(inventory.plugins.requestedMarketplaceKindCount, 2);
    assert.equal(inventory.plugins.marketplaceNamesReturned, false);
    assert.equal(inventory.plugins.marketplaceDisplayNamesReturned, false);
    assert.equal(inventory.plugins.marketplaceKindsReturned, false);
    assert.equal(inventory.plugins.pluginDisplayNamesReturned, false);
    assert.equal(inventory.plugins.descriptionsReturned, false);
    assert.equal(inventory.plugins.defaultPromptsReturned, false);
    assert.equal(inventory.plugins.capabilityNamesReturned, false);
    assert.equal(inventory.plugins.screenshotsReturned, false);
    assert.equal(inventory.installedPlugins.pluginCount, 1);
    assert.equal(inventory.installedPlugins.localMarketplaceCount, 1);
    assert.equal(inventory.installedPlugins.remoteMarketplaceCount, 0);
    assert.equal(inventory.installedPlugins.pluginWithDisplayNameCount, 1);
    assert.equal(inventory.installedPlugins.pluginWithDescriptionCount, 1);
    assert.equal(inventory.installedPlugins.pluginWithDefaultPromptCount, 1);
    assert.equal(inventory.installedPlugins.pluginWithCapabilityCount, 1);
    assert.equal(inventory.installedPlugins.pluginWithScreenshotCount, 1);
    assert.deepEqual(inventory.installedPlugins.authPolicyCounts, { ON_USE: 1 });
    assert.equal(inventory.installedPlugins.installedCount, 1);
    assert.equal(inventory.installedPlugins.enabledCount, 1);
    assert.equal(inventory.installedPlugins.loadErrorCount, 1);
    assert.equal(inventory.installedPlugins.namesReturned, false);
    assert.equal(inventory.installedPlugins.idsReturned, false);
    assert.equal(inventory.installedPlugins.pathsReturned, false);
    assert.equal(inventory.installedPlugins.urlsReturned, false);
    assert.equal(inventory.installedPlugins.installSuggestionNamesReturned, false);
    assert.equal(inventory.installedPlugins.marketplaceNamesReturned, false);
    assert.equal(inventory.installedPlugins.descriptionsReturned, false);
    assert.equal(inventory.installedPlugins.defaultPromptsReturned, false);
    assert.equal(inventory.installedPlugins.capabilityNamesReturned, false);
    assert.equal(inventory.installedPlugins.screenshotsReturned, false);
    assert.equal(inventory.installedPlugins.rawPayloadReturned, false);
    assert.equal(inventory.hooks.hookCount, 1);
    assert.equal(inventory.hooks.commandsReturned, false);
    assert.equal(inventory.hooks.pathsReturned, false);
    assert.equal(inventory.hooks.keysReturned, false);
    assert.equal(inventory.hooks.pluginIdsReturned, false);
    assert.equal(inventory.externalAgentConfig.ok, true);
    assert.equal(inventory.externalAgentConfig.itemCount, 2);
    assert.equal(inventory.externalAgentConfig.repoScopedItemCount, 1);
    assert.equal(inventory.externalAgentConfig.homeScopedItemCount, 1);
    assert.equal(inventory.externalAgentConfig.commandCount, 1);
    assert.equal(inventory.externalAgentConfig.hookCount, 1);
    assert.equal(inventory.externalAgentConfig.mcpServerCount, 1);
    assert.equal(inventory.externalAgentConfig.pluginGroupCount, 1);
    assert.equal(inventory.externalAgentConfig.pluginNameCount, 2);
    assert.equal(inventory.externalAgentConfig.sessionCount, 1);
    assert.equal(inventory.externalAgentConfig.subagentCount, 1);
    assert.equal(inventory.externalAgentConfig.importEnabled, false);
    assert.equal(inventory.externalAgentConfig.descriptionsReturned, false);
    assert.equal(inventory.externalAgentConfig.cwdReturned, false);
    assert.equal(inventory.externalAgentConfig.pathsReturned, false);
    assert.equal(inventory.externalAgentConfig.namesReturned, false);
    assert.equal(inventory.externalAgentConfig.pluginNamesReturned, false);
    assert.equal(inventory.externalAgentConfig.sessionTitlesReturned, false);
    assert.equal(inventory.externalAgentConfig.rawMigrationItemsReturned, false);
    assert.equal(inventory.externalAgentConfigImportHistories.ok, true);
    assert.equal(inventory.externalAgentConfigImportHistories.historyCount, 1);
    assert.equal(inventory.externalAgentConfigImportHistories.successCount, 1);
    assert.equal(inventory.externalAgentConfigImportHistories.failureCount, 1);
    assert.deepEqual(inventory.externalAgentConfigImportHistories.successItemTypeCounts, {
      MCP_SERVER_CONFIG: 1,
    });
    assert.deepEqual(inventory.externalAgentConfigImportHistories.failureItemTypeCounts, {
      SESSIONS: 1,
    });
    assert.equal(inventory.externalAgentConfigImportHistories.completedTimestampCount, 1);
    assert.equal(inventory.externalAgentConfigImportHistories.importIdCount, 1);
    assert.equal(inventory.externalAgentConfigImportHistories.cwdCount, 2);
    assert.equal(inventory.externalAgentConfigImportHistories.sourceCount, 2);
    assert.equal(inventory.externalAgentConfigImportHistories.targetCount, 1);
    assert.equal(inventory.externalAgentConfigImportHistories.messageCount, 1);
    assert.equal(inventory.externalAgentConfigImportHistories.failureStageCount, 1);
    assert.equal(inventory.externalAgentConfigImportHistories.errorTypeCount, 1);
    assert.equal(inventory.externalAgentConfigImportHistories.importIdsReturned, false);
    assert.equal(inventory.externalAgentConfigImportHistories.timestampsReturned, false);
    assert.equal(inventory.externalAgentConfigImportHistories.cwdReturned, false);
    assert.equal(inventory.externalAgentConfigImportHistories.sourcesReturned, false);
    assert.equal(inventory.externalAgentConfigImportHistories.targetsReturned, false);
    assert.equal(inventory.externalAgentConfigImportHistories.messagesReturned, false);
    assert.equal(inventory.externalAgentConfigImportHistories.failureStagesReturned, false);
    assert.equal(inventory.externalAgentConfigImportHistories.errorTypesReturned, false);
    assert.equal(inventory.externalAgentConfigImportHistories.rawPayloadReturned, false);
    assert.equal(inventory.experimentalFeatures.ok, true);
    assert.equal(inventory.experimentalFeatures.featureCount, 2);
    assert.equal(inventory.experimentalFeatures.enabledCount, 1);
    assert.equal(inventory.experimentalFeatures.defaultEnabledCount, 1);
    assert.equal(inventory.experimentalFeatures.betaCount, 1);
    assert.equal(inventory.experimentalFeatures.stableCount, 1);
    assert.equal(inventory.experimentalFeatures.displayNameCount, 2);
    assert.equal(inventory.experimentalFeatures.descriptionsReturned, false);
    assert.equal(inventory.experimentalFeatures.announcementsReturned, false);
    assert.equal(inventory.experimentalFeatures.namesReturned, false);

    const serialized = JSON.stringify(summary);
    for (const marker of [
      "/tmp/mock-workspace",
      "secret.txt",
      "person@example.test",
      "secret-token",
      "private-limit-id",
      "private limit name",
      "123 private credits",
      "rate_limit_reached",
      "1778919807",
      "123456789",
      "2026-06-01-private-date",
      "2026-06-02-private-date",
      "private-workspace-message-id",
      "private-archived-workspace-message-id",
      "private workspace message body",
      "private archived workspace message body",
      "private-remote-environment-id",
      "private-remote-installation-id",
      "private-remote-server-name",
      "1782726047",
      "private-model",
      "private model description",
      "private tier",
      "private availability message",
      "private upgrade copy",
      "private-mode",
      "private-permission-profile",
      "private permission profile description",
      "private-permission-profile-cursor",
      "private-app",
      "private-app-id",
      "private app description",
      "private-category",
      "private developer",
      "private-review",
      "private-file-id",
      "private screenshot prompt",
      "private-version",
      "private-mcp",
      "private-skill",
      "private skill display",
      "private short description",
      "private default prompt",
      "private tool description",
      "private-tool",
      "private-plugin",
      "private-local-marketplace",
      "private local marketplace",
      "private-remote-marketplace",
      "private remote marketplace",
      "private-remote-plugin-id",
      "private-installed-marketplace",
      "private-installed-plugin-id",
      "private-installed-plugin",
      "private installed prompt",
      "private installed marketplace error",
      "private-capability",
      "private-hook-key",
      "private-plugin-id",
      "private-external",
      "private-marketplace",
      "private-experimental-feature",
      "Private Experimental Feature",
      "private feature description",
      "private announcement",
      "private-feature-cursor",
      "private external session",
      "private-import-id",
      "private import failure message",
      "private-stage",
      "private-error-type",
      ".claude",
      "private.example.test",
      "example.test",
      "cat /tmp",
      "codexHome",
      "userAgent",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_INTEGRATION_INVENTORY;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_INTEGRATION_INVENTORY = previous;
    }
  }
});

test("runIntegrationsInventoryProbe can opt into remote plugin catalog counts", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_INTEGRATION_INVENTORY;
  process.env.CODEX_APP_PORT_ALLOW_INTEGRATION_INVENTORY = "1";
  try {
    const summary = await runIntegrationsInventoryProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      includeRemotePluginCatalog: true,
    });

    const inventory = summary.probes.integrationsInventory;
    assert.equal(inventory.plugins.marketplaceCount, 2);
    assert.equal(inventory.plugins.localMarketplaceCount, 1);
    assert.equal(inventory.plugins.remoteMarketplaceCount, 1);
    assert.equal(inventory.plugins.marketplaceDisplayNameCount, 2);
    assert.equal(inventory.plugins.pluginCount, 2);
    assert.equal(inventory.plugins.pluginWithDisplayNameCount, 2);
    assert.equal(inventory.plugins.pluginWithDescriptionCount, 2);
    assert.equal(inventory.plugins.pluginWithDefaultPromptCount, 2);
    assert.equal(inventory.plugins.pluginWithCapabilityCount, 2);
    assert.equal(inventory.plugins.pluginWithScreenshotCount, 2);
    assert.deepEqual(inventory.plugins.sourceTypeCounts, { local: 1, remote: 1 });
    assert.deepEqual(inventory.plugins.installPolicyCounts, { AVAILABLE: 1, NOT_AVAILABLE: 1 });
    assert.deepEqual(inventory.plugins.authPolicyCounts, { ON_USE: 1, ON_INSTALL: 1 });
    assert.equal(inventory.plugins.remotePluginCatalogRequested, true);
    assert.equal(inventory.plugins.requestedMarketplaceKindCount, 5);
    assert.equal(inventory.plugins.marketplaceNamesReturned, false);
    assert.equal(inventory.plugins.marketplaceDisplayNamesReturned, false);
    assert.equal(inventory.plugins.marketplaceKindsReturned, false);
    assert.equal(inventory.plugins.pluginDisplayNamesReturned, false);
    assert.equal(inventory.plugins.descriptionsReturned, false);
    assert.equal(inventory.plugins.defaultPromptsReturned, false);
    assert.equal(inventory.plugins.capabilityNamesReturned, false);
    assert.equal(inventory.plugins.screenshotsReturned, false);

    const serialized = JSON.stringify(summary);
    for (const marker of [
      "private-remote-marketplace",
      "private remote marketplace",
      "private-remote-plugin-id",
      "private remote plugin display",
      "private remote plugin short description",
      "private remote plugin prompt",
      "private remote plugin capability",
      "https://example.test/private-remote-plugin",
      "vertical",
      "shared-with-me",
      "created-by-me-remote",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_INTEGRATION_INVENTORY;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_INTEGRATION_INVENTORY = previous;
    }
  }
});

test("runExperimentalFeatureEnablementSetProbe returns count-only write metadata", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_EXPERIMENTAL_FEATURE_SET;
  process.env.CODEX_APP_PORT_ALLOW_EXPERIMENTAL_FEATURE_SET = "1";
  try {
    const summary = await runExperimentalFeatureEnablementSetProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      feature: "private-experimental-feature",
      enabled: true,
    });

    const write = summary.probes.experimentalFeatureSet;
    assert.equal(summary.ok, true);
    assert.equal(write.method, "experimentalFeature/enablement/set");
    assert.equal(write.responseObject, true);
    assert.equal(write.responseTopLevelKeyCount, 3);
    assert.equal(write.updatedFeatureCount, 1);
    assert.equal(write.enabledCount, 1);
    assert.equal(write.disabledCount, 0);
    assert.equal(write.responseReturned, false);
    assert.equal(write.featureNamesReturned, false);
    assert.equal(write.enablementValuesReturned, false);
    assert.equal(write.pathsReturned, false);
    assert.equal(write.rawPayloadReturned, false);

    const serialized = JSON.stringify(summary);
    for (const marker of [
      "private-experimental-feature",
      "/tmp/mock-workspace",
      "config.toml",
      "sk-proj-private-feature-token",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous == null) {
      delete process.env.CODEX_APP_PORT_ALLOW_EXPERIMENTAL_FEATURE_SET;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_EXPERIMENTAL_FEATURE_SET = previous;
    }
  }
});

test("runConfigValueWriteProbe returns count-only write metadata", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_CONFIG_VALUE_WRITE;
  process.env.CODEX_APP_PORT_ALLOW_CONFIG_VALUE_WRITE = "1";
  try {
    const summary = await runConfigValueWriteProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      keyPath: "private.key",
      value: {
        model: "gpt-private",
        path: "/tmp/mock-workspace/secret.txt",
        token: "sk-proj-private-token",
      },
      mergeStrategy: "replace",
    });

    const write = summary.probes.configValueWrite;
    assert.equal(summary.ok, true);
    assert.equal(write.method, "config/value/write");
    assert.equal(write.responseObject, true);
    assert.equal(write.responseTopLevelKeyCount, 5);
    assert.equal(write.responseReturned, false);
    assert.equal(write.keyPathReturned, false);
    assert.equal(write.valueReturned, false);
    assert.equal(write.pathsReturned, false);
    assert.equal(write.rawPayloadReturned, false);

    const serialized = JSON.stringify(summary);
    for (const marker of [
      "private.key",
      "gpt-private",
      "/tmp/mock-workspace",
      "secret.txt",
      "sk-proj-private-token",
      "config.toml",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous == null) {
      delete process.env.CODEX_APP_PORT_ALLOW_CONFIG_VALUE_WRITE;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_CONFIG_VALUE_WRITE = previous;
    }
  }
});

test("runConfigBatchWriteProbe returns count-only write metadata", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_CONFIG_BATCH_WRITE;
  process.env.CODEX_APP_PORT_ALLOW_CONFIG_BATCH_WRITE = "1";
  try {
    const summary = await runConfigBatchWriteProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      edits: [
        {
          keyPath: "private.batch",
          value: {
            model: "gpt-private",
            path: "/tmp/mock-workspace/secret.txt",
            token: "sk-proj-private-token",
          },
          mergeStrategy: "replace",
        },
      ],
    });

    const write = summary.probes.configBatchWrite;
    assert.equal(summary.ok, true);
    assert.equal(write.method, "config/batchWrite");
    assert.equal(write.responseObject, true);
    assert.equal(write.responseTopLevelKeyCount, 6);
    assert.equal(write.responseReturned, false);
    assert.equal(write.keyPathsReturned, false);
    assert.equal(write.valuesReturned, false);
    assert.equal(write.pathsReturned, false);
    assert.equal(write.rawPayloadReturned, false);

    const serialized = JSON.stringify(summary);
    for (const marker of [
      "private.batch",
      "gpt-private",
      "/tmp/mock-workspace",
      "secret.txt",
      "sk-proj-private-token",
      "config.toml",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous == null) {
      delete process.env.CODEX_APP_PORT_ALLOW_CONFIG_BATCH_WRITE;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_CONFIG_BATCH_WRITE = previous;
    }
  }
});

test("runIntegrationsInventoryProbe can return opt-in display names without paths or schemas", async () => {
  const previousInventory = process.env.CODEX_APP_PORT_ALLOW_INTEGRATION_INVENTORY;
  const previousNames = process.env.CODEX_APP_PORT_ALLOW_INTEGRATION_NAMES;
  process.env.CODEX_APP_PORT_ALLOW_INTEGRATION_INVENTORY = "1";
  process.env.CODEX_APP_PORT_ALLOW_INTEGRATION_NAMES = "1";
  try {
    const summary = await runIntegrationsInventoryProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
    });

    const inventory = summary.probes.integrationsInventory;
    assert.equal(inventory.mcp.namesReturned, true);
    assert.equal(inventory.mcp.toolSchemasReturned, false);
    assert.equal(inventory.mcp.items[0].name, "private-mcp");
    assert.deepEqual(inventory.mcp.items[0].toolNames, ["private_tool"]);
    assert.equal(inventory.apps.namesReturned, true);
    assert.equal(inventory.apps.pluginDisplayNamesReturned, true);
    assert.equal(inventory.apps.idsReturned, false);
    assert.equal(inventory.apps.descriptionsReturned, false);
    assert.equal(inventory.apps.labelsReturned, false);
    assert.equal(inventory.apps.logosReturned, false);
    assert.equal(inventory.apps.urlsReturned, false);
    assert.equal(inventory.apps.screenshotsReturned, false);
    assert.equal(inventory.apps.items[0].name, "private-app");
    assert.deepEqual(inventory.apps.items[0].pluginDisplayNames, ["private-plugin"]);
    assert.equal(inventory.models.namesReturned, true);
    assert.equal(inventory.models.modelIdsReturned, false);
    assert.equal(inventory.models.descriptionsReturned, false);
    assert.equal(inventory.models.items[0].name, "private-model-display");
    assert.equal(inventory.models.items[0].default, true);
    assert.equal(inventory.models.items[1].name, null);
    assert.equal(inventory.collaborationModes.namesReturned, true);
    assert.equal(inventory.collaborationModes.modelIdsReturned, false);
    assert.equal(inventory.collaborationModes.items[0].name, "private-mode");
    assert.equal(inventory.collaborationModes.items[0].hasModelOverride, true);
    assert.equal(inventory.collaborationModes.items[1].name, null);
    assert.equal(inventory.permissionProfiles.namesReturned, true);
    assert.equal(inventory.permissionProfiles.idsReturned, false);
    assert.equal(inventory.permissionProfiles.descriptionsReturned, false);
    assert.equal(inventory.permissionProfiles.rawPayloadReturned, false);
    assert.equal(inventory.permissionProfiles.items[0].name, "safe-permission-profile");
    assert.equal(inventory.permissionProfiles.items[0].allowed, true);
    assert.equal(inventory.permissionProfiles.items[0].hasDescription, true);
    assert.equal(inventory.permissionProfiles.items[1].name, null);
    assert.equal(inventory.permissionProfiles.items[1].allowed, false);
    assert.equal(inventory.permissionProfiles.items[1].hasDescription, false);
    assert.equal(inventory.accountUsage.usageValuesReturned, false);
    assert.equal(inventory.workspaceMessages.messageBodiesReturned, false);
    assert.equal(inventory.skills.namesReturned, true);
    assert.equal(inventory.skills.pathsReturned, false);
    assert.equal(inventory.skills.descriptionsReturned, false);
    assert.equal(inventory.skills.displayNamesReturned, false);
    assert.equal(inventory.skills.defaultPromptsReturned, false);
    assert.equal(inventory.skills.iconsReturned, false);
    assert.equal(inventory.skills.brandColorsReturned, false);
    assert.equal(inventory.skills.dependencyToolCommandsReturned, false);
    assert.equal(inventory.skills.dependencyToolUrlsReturned, false);
    assert.equal(inventory.skills.dependencyToolDescriptionsReturned, false);
    assert.equal(inventory.skills.items[0].name, "private-skill");
    assert.equal(inventory.skills.items[0].hasDisplayName, true);
    assert.equal(inventory.skills.items[0].hasShortDescription, true);
    assert.equal(inventory.skills.items[0].hasDefaultPrompt, true);
    assert.equal(inventory.skills.items[0].iconCount, 2);
    assert.equal(inventory.skills.items[0].hasBrandColor, true);
    assert.equal(inventory.plugins.namesReturned, true);
    assert.equal(inventory.plugins.idsReturned, false);
    assert.equal(inventory.plugins.pathsReturned, false);
    assert.equal(inventory.plugins.urlsReturned, false);
    assert.equal(inventory.plugins.marketplaceNamesReturned, false);
    assert.equal(inventory.plugins.marketplaceDisplayNamesReturned, false);
    assert.equal(inventory.plugins.marketplaceKindsReturned, false);
    assert.equal(inventory.plugins.remotePluginCatalogRequested, false);
    assert.equal(inventory.plugins.requestedMarketplaceKindCount, 2);
    assert.equal(inventory.plugins.items[0].authPolicy, "ON_USE");
    assert.equal(inventory.plugins.items[0].name, "private-plugin");
    assert.equal(inventory.plugins.items[0].hasDisplayName, true);
    assert.equal(inventory.plugins.items[0].hasDescription, true);
    assert.equal(inventory.plugins.items[0].hasDefaultPrompt, true);
    assert.equal(inventory.plugins.items[0].hasCapability, true);
    assert.equal(inventory.plugins.items[0].hasScreenshot, true);
    assert.equal(inventory.installedPlugins.namesReturned, true);
    assert.equal(inventory.installedPlugins.idsReturned, false);
    assert.equal(inventory.installedPlugins.pathsReturned, false);
    assert.equal(inventory.installedPlugins.urlsReturned, false);
    assert.equal(inventory.installedPlugins.items[0].name, "safe-installed-plugin");
    assert.equal(inventory.installedPlugins.items[0].hasDisplayName, true);
    assert.equal(inventory.installedPlugins.items[0].hasDescription, true);
    assert.equal(inventory.installedPlugins.items[0].hasDefaultPrompt, true);
    assert.equal(inventory.installedPlugins.items[0].hasCapability, true);
    assert.equal(inventory.installedPlugins.items[0].hasScreenshot, true);
    assert.equal(inventory.installedPlugins.installSuggestionNamesReturned, false);
    assert.equal(inventory.installedPlugins.defaultPromptsReturned, false);
    assert.equal(inventory.externalAgentConfig.namesReturned, false);
    assert.equal(inventory.experimentalFeatures.namesReturned, true);
    assert.equal(inventory.experimentalFeatures.items[0].name, "private-experimental-feature");
    assert.equal(inventory.experimentalFeatures.items[0].stage, "beta");
    assert.equal(inventory.externalAgentConfig.pluginNamesReturned, false);
    assert.equal(inventory.externalAgentConfig.rawMigrationItemsReturned, false);
    assert.equal(inventory.externalAgentConfigImportHistories.importIdsReturned, false);
    assert.equal(inventory.externalAgentConfigImportHistories.messagesReturned, false);

    const serialized = JSON.stringify(summary);
    for (const marker of [
      "/tmp/mock-workspace",
      "secret.txt",
      "person@example.test",
      "secret-token",
      "private-limit-id",
      "private limit name",
      "123 private credits",
      "rate_limit_reached",
      "123456789",
      "2026-06-01-private-date",
      "private-workspace-message-id",
      "private workspace message body",
      "private description",
      "private skill display",
      "private short description",
      "private default prompt",
      "private tool description",
      "private-tool",
      "private-permission-profile",
      "private permission profile description",
      "private-permission-profile-cursor",
      "private-app-id",
      "private app description",
      "private-category",
      "private developer",
      "private-review",
      "private-file-id",
      "private screenshot prompt",
      "private-version",
      "private-model-id",
      "private model description",
      "private tier",
      "private availability message",
      "private upgrade copy",
      "private-upgrade-model",
      "private-plugin-id",
      "private plugin display",
      "private plugin short description",
      "private plugin long description",
      "private plugin prompt",
      "private plugin capability",
      "private-installed-marketplace",
      "private-installed-plugin-id",
      "private-installed-plugin",
      "private installed plugin display",
      "private installed plugin short description",
      "private installed plugin long description",
      "private installed prompt",
      "private installed marketplace error",
      "private-capability",
      "private-hook-key",
      "private-external",
      "private-marketplace",
      "private external session",
      "private-import-id",
      "private import failure message",
      "private-stage",
      "private-error-type",
      ".claude",
      "private.example.test",
      "example.test",
      "cat /tmp",
      "codexHome",
      "userAgent",
      "inputSchema",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previousInventory === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_INTEGRATION_INVENTORY;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_INTEGRATION_INVENTORY = previousInventory;
    }
    if (previousNames === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_INTEGRATION_NAMES;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_INTEGRATION_NAMES = previousNames;
    }
  }
});

test("runMcpResourceReadProbe returns count-only resource metadata", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_MCP_RESOURCE_READ;
  process.env.CODEX_APP_PORT_ALLOW_MCP_RESOURCE_READ = "1";
  try {
    const summary = await runMcpResourceReadProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      server: "private-mcp",
      resource: "file:///tmp/mock-workspace/secret.txt?token=sk-proj-private-token",
    });
    const resource = summary.probes.mcpResourceRead;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(resource.contentCount, 2);
    assert.equal(resource.textContentCount, 1);
    assert.equal(resource.blobContentCount, 1);
    assert.equal(resource.mimeTypeCount, 2);
    assert.equal(resource.contentReturned, false);
    assert.equal(resource.urisReturned, false);
    assert.equal(resource.mimeTypesReturned, false);
    for (const marker of [
      "private-mcp",
      "secret.txt",
      "sk-proj-private-token",
      "file://",
      "resource://private-binary",
      "text/plain",
      "application/octet-stream",
      "/tmp/mock-workspace",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_MCP_RESOURCE_READ;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_MCP_RESOURCE_READ = previous;
    }
  }
});

test("runMcpServerReloadProbe returns count-only reload metadata", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_MCP_SERVER_RELOAD;
  process.env.CODEX_APP_PORT_ALLOW_MCP_SERVER_RELOAD = "1";
  try {
    const summary = await runMcpServerReloadProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
    });
    const reload = summary.probes.mcpServerReload;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(reload.method, "config/mcpServer/reload");
    assert.equal(reload.responseObject, true);
    assert.equal(reload.responseTopLevelKeyCount, 4);
    assert.equal(reload.responseReturned, false);
    assert.equal(reload.namesReturned, false);
    assert.equal(reload.pathsReturned, false);
    assert.equal(reload.rawPayloadReturned, false);
    for (const marker of [
      "private-mcp",
      "privateServerName",
      "privatePath",
      "privateToken",
      "sk-proj-private-token",
      "/tmp/mock-workspace",
      "mcp.json",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_MCP_SERVER_RELOAD;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_MCP_SERVER_RELOAD = previous;
    }
  }
});

test("runMcpServerOauthLoginProbe returns a protected authorization URL without secrets", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_MCP_OAUTH_LOGIN;
  process.env.CODEX_APP_PORT_ALLOW_MCP_OAUTH_LOGIN = "1";
  try {
    const summary = await runMcpServerOauthLoginProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      serverName: "safe-mcp",
    });
    const login = summary.probes.mcpServerOauthLogin;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(login.method, "mcpServer/oauth/login");
    assert.equal(login.responseObject, true);
    assert.equal(login.responseTopLevelKeyCount, 3);
    assert.equal(login.authorizationUrlReturned, true);
    assert.match(login.authorizationUrl, /^https:\/\/auth\.example\.test\/oauth\/authorize\?/);
    assert.equal(login.namesReturned, false);
    assert.equal(login.tokensReturned, false);
    assert.equal(login.rawPayloadReturned, false);
    for (const marker of [
      "privateServerName",
      "privateToken",
      "sk-proj-private-mcp-oauth",
      "/tmp/mock-workspace",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_MCP_OAUTH_LOGIN;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_MCP_OAUTH_LOGIN = previous;
    }
  }
});

test("runMcpToolCallProbe returns count-only tool metadata", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_MCP_TOOL_CALL;
  process.env.CODEX_APP_PORT_ALLOW_MCP_TOOL_CALL = "1";
  try {
    const summary = await runMcpToolCallProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      server: "private-mcp",
      tool: "private-tool",
      args: {
        path: "/tmp/mock-workspace/secret.txt",
        token: "sk-proj-private-token",
      },
      threadIdSuffix: "00000001",
    });
    const tool = summary.probes.mcpToolCall;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(tool.contentCount, 2);
    assert.equal(tool.textContentCount, 1);
    assert.equal(tool.imageContentCount, 1);
    assert.equal(tool.structuredContentPresent, true);
    assert.equal(tool.structuredContentTopLevelKeyCount, 2);
    assert.equal(tool.contentReturned, false);
    assert.equal(tool.structuredContentReturned, false);
    assert.equal(tool.rawPayloadReturned, false);
    assert.equal(tool.fullIdsReturned, false);
    for (const marker of [
      "private-mcp",
      "private-tool",
      "secret.txt",
      "sk-proj-private-token",
      "/tmp/mock-workspace",
      "thread-00000001",
      "secretPath",
      "cHJpdmF0ZS1pbWFnZQ==",
      "codexHome",
      "userAgent",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_MCP_TOOL_CALL;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_MCP_TOOL_CALL = previous;
    }
  }
});

test("runPluginReadProbe returns count-only plugin metadata", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_PLUGIN_READ;
  process.env.CODEX_APP_PORT_ALLOW_PLUGIN_READ = "1";
  try {
    const summary = await runPluginReadProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      pluginName: "private-plugin",
      remoteMarketplaceName: "private-marketplace",
    });
    const plugin = summary.probes.pluginRead;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(plugin.pluginPresent, true);
    assert.equal(plugin.appCount, 1);
    assert.equal(plugin.hookCount, 1);
    assert.equal(plugin.mcpServerCount, 1);
    assert.equal(plugin.skillCount, 1);
    assert.equal(plugin.keywordCount, 1);
    assert.equal(plugin.pluginReturned, false);
    assert.equal(plugin.namesReturned, false);
    assert.equal(plugin.pathsReturned, false);
    assert.equal(plugin.urlsReturned, false);
    assert.equal(plugin.skillContentsReturned, false);
    for (const marker of [
      "private-plugin",
      "private-marketplace",
      "private-app",
      "private-skill",
      "private-mcp-server",
      "private-hook-key",
      "private-plugin-id",
      "private-remote-plugin-id",
      "sk-proj-private-token",
      "https://example.test",
      "/tmp/mock-workspace",
      "SKILL.md",
      "codexHome",
      "userAgent",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_PLUGIN_READ;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_PLUGIN_READ = previous;
    }
  }
});

test("runPluginContentReadProbe returns count-only plugin content metadata", async () => {
  const previousContent = process.env.CODEX_APP_PORT_ALLOW_PLUGIN_CONTENT_READ;
  const previousShare = process.env.CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_LIST;
  process.env.CODEX_APP_PORT_ALLOW_PLUGIN_CONTENT_READ = "1";
  process.env.CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_LIST = "1";
  try {
    const skillSummary = await runPluginContentReadProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      method: "plugin/skill/read",
      remoteMarketplaceName: "private-marketplace",
      remotePluginId: "private-plugin-id",
      skillName: "private-skill",
    });
    const skill = skillSummary.probes.pluginContentRead;
    assert.equal(skillSummary.ok, true);
    assert.equal(skill.skillContentPresent, true);
    assert.equal(skill.contentCharCount, 83);
    assert.equal(skill.contentReturned, false);

    const shareSummary = await runPluginContentReadProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      method: "plugin/share/list",
    });
    const share = shareSummary.probes.pluginContentRead;
    assert.equal(shareSummary.ok, true);
    assert.equal(share.itemCount, 1);
    assert.equal(share.shareUrlCount, 1);
    assert.equal(share.localPathCount, 1);
    assert.equal(share.urlsReturned, false);
    assert.equal(share.pathsReturned, false);

    const serialized = JSON.stringify({ skillSummary, shareSummary });
    for (const marker of [
      "private-marketplace",
      "private-plugin",
      "private-plugin-id",
      "private-skill",
      "private skill text",
      "sk-proj-private-token",
      "https://example.test",
      "/tmp/mock-workspace",
      "codexHome",
      "userAgent",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previousContent === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_PLUGIN_CONTENT_READ;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_PLUGIN_CONTENT_READ = previousContent;
    }
    if (previousShare === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_LIST;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_LIST = previousShare;
    }
  }
});

test("runPluginUninstallProbe returns count-only plugin mutation metadata", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_PLUGIN_UNINSTALL;
  process.env.CODEX_APP_PORT_ALLOW_PLUGIN_UNINSTALL = "1";
  try {
    const summary = await runPluginUninstallProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      pluginId: "private-plugin",
    });

    const plugin = summary.probes.pluginUninstall;
    assert.equal(summary.ok, true);
    assert.equal(plugin.method, "plugin/uninstall");
    assert.equal(plugin.responseObject, true);
    assert.equal(plugin.responseTopLevelKeyCount, 4);
    assert.equal(plugin.responseReturned, false);
    assert.equal(plugin.pluginIdReturned, false);
    assert.equal(plugin.pathsReturned, false);
    assert.equal(plugin.rawPayloadReturned, false);

    const serialized = JSON.stringify(summary);
    for (const marker of [
      "private-plugin",
      "/tmp/mock-workspace",
      "sk-proj-private-plugin-token",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous == null) {
      delete process.env.CODEX_APP_PORT_ALLOW_PLUGIN_UNINSTALL;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_PLUGIN_UNINSTALL = previous;
    }
  }
});

test("runPluginShareCheckoutProbe returns count-only plugin materialization metadata", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_CHECKOUT;
  process.env.CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_CHECKOUT = "1";
  try {
    const summary = await runPluginShareCheckoutProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      remotePluginId: "private-remote-plugin-id",
    });

    const checkout = summary.probes.pluginShareCheckout;
    assert.equal(summary.ok, true);
    assert.equal(checkout.method, "plugin/share/checkout");
    assert.equal(checkout.responseObject, true);
    assert.equal(checkout.responseTopLevelKeyCount, 7);
    assert.equal(checkout.marketplaceNamePresent, true);
    assert.equal(checkout.marketplacePathPresent, true);
    assert.equal(checkout.pluginIdPresent, true);
    assert.equal(checkout.pluginNamePresent, true);
    assert.equal(checkout.pluginPathPresent, true);
    assert.equal(checkout.remotePluginIdPresent, true);
    assert.equal(checkout.remoteVersionPresent, true);
    assert.equal(checkout.namesReturned, false);
    assert.equal(checkout.idsReturned, false);
    assert.equal(checkout.pathsReturned, false);
    assert.equal(checkout.rawPayloadReturned, false);

    const serialized = JSON.stringify(summary);
    for (const marker of [
      "private-remote-plugin-id",
      "private-share-marketplace",
      "private-checked-out-plugin",
      "private-checked-out-plugin-id",
      "private-remote-version",
      "/tmp/mock-workspace",
      ".codex/plugins",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous == null) {
      delete process.env.CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_CHECKOUT;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_PLUGIN_SHARE_CHECKOUT = previous;
    }
  }
});

test("runEnvironmentAddProbe returns count-only remote environment metadata", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_ENVIRONMENT_ADD;
  process.env.CODEX_APP_PORT_ALLOW_ENVIRONMENT_ADD = "1";
  try {
    const summary = await runEnvironmentAddProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      environmentId: "private-remote-env",
      execServerUrl: "wss://private-env.example.test/exec",
    });

    const environmentAdd = summary.probes.environmentAdd;
    assert.equal(summary.ok, true);
    assert.equal(environmentAdd.method, "environment/add");
    assert.equal(environmentAdd.status, "added-with-redactions");
    assert.equal(environmentAdd.responseObject, true);
    assert.equal(environmentAdd.responseTopLevelKeyCount, 4);
    assert.equal(environmentAdd.environmentIdReturned, false);
    assert.equal(environmentAdd.execServerUrlReturned, false);
    assert.equal(environmentAdd.urlsReturned, false);
    assert.equal(environmentAdd.rawPayloadReturned, false);

    const serialized = JSON.stringify(summary);
    for (const marker of [
      "private-remote-env",
      "private-env.example.test",
      "private-remote-environment-name",
      "sk-proj-private-remote-environment-token",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous == null) {
      delete process.env.CODEX_APP_PORT_ALLOW_ENVIRONMENT_ADD;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_ENVIRONMENT_ADD = previous;
    }
  }
});

test("runSkillsConfigWriteProbe returns sanitized write metadata", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_SKILLS_CONFIG_WRITE;
  process.env.CODEX_APP_PORT_ALLOW_SKILLS_CONFIG_WRITE = "1";
  try {
    const summary = await runSkillsConfigWriteProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      skillName: "private-skill",
      enabled: true,
    });
    const write = summary.probes.skillsConfigWrite;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(write.effectiveEnabled, true);
    assert.equal(write.responseReturned, false);
    assert.equal(write.namesReturned, false);
    assert.equal(write.pathsReturned, false);
    for (const marker of [
      "private-skill",
      "SKILL.md",
      "/tmp/mock-workspace",
      "codexHome",
      "userAgent",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_SKILLS_CONFIG_WRITE;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_SKILLS_CONFIG_WRITE = previous;
    }
  }
});

test("runThreadDetailProbe returns metadata without transcript content", async () => {
  const summary = await runThreadDetailProbe({
    codexBin: process.execPath,
    codexArgs: [mockServer.pathname],
    cwd: process.cwd(),
    timeoutMs: 1_000,
    threadIdSuffix: "00000001",
  });

  assert.equal(summary.ok, true);
  assert.equal(summary.probes.threadDetail.idSuffix, "00000001");
  assert.equal(summary.probes.threadDetail.turnCount, 1);
  assert.equal(summary.probes.threadDetail.turns[0].items.length, 3);
  assert.equal(summary.probes.threadDetail.turns[0].items[1].type, "agentMessage");
  assert.equal(summary.probes.threadDetail.turns[0].items[2].changeCount, 1);
  const serialized = JSON.stringify(summary);
  assert.equal(serialized.includes("Sensitive"), false);
  assert.equal(serialized.includes("secret.txt"), false);
  assert.equal(serialized.includes("/tmp/mock-workspace"), false);
});

test("runThreadDetailProbe can read archived thread metadata", async () => {
  const summary = await runThreadDetailProbe({
    codexBin: process.execPath,
    codexArgs: [mockServer.pathname],
    cwd: process.cwd(),
    timeoutMs: 1_000,
    threadIdSuffix: "00000002",
  });

  assert.equal(summary.ok, true);
  assert.equal(summary.probes.threadDetail.idSuffix, "00000002");
  assert.equal(summary.probes.threadDetail.status, "completed");
  assert.equal(JSON.stringify(summary).includes("Sensitive archived"), false);
});

test("runThreadSearchProbe returns search metadata without snippets or raw thread content", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_THREAD_SEARCH;
  process.env.CODEX_APP_PORT_ALLOW_THREAD_SEARCH = "1";
  try {
    const summary = await runThreadSearchProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      searchTerm: "sensitive query",
      archived: true,
    });

    assert.equal(summary.ok, true);
    const search = summary.probes.threadSearch;
    assert.equal(search.method, "thread/search");
    assert.equal(search.searchTermCharCount, 15);
    assert.equal(search.searchTermLineCount, 1);
    assert.equal(search.archivedFilter, true);
    assert.equal(search.count, 1);
    assert.equal(search.snippetCount, 1);
    assert.equal(search.threadNameCount, 1);
    assert.equal(search.previewCount, 1);
    assert.equal(search.items[0].idSuffix, "00000004");
    assert.equal(search.items[0].hasSnippet, true);
    assert.equal(search.items[0].hasName, true);
    assert.equal(search.items[0].hasPreview, true);
    assert.equal(search.searchTermReturned, false);
    assert.equal(search.snippetsReturned, false);
    assert.equal(search.namesReturned, false);
    assert.equal(search.previewsReturned, false);
    assert.equal(search.fullIdsReturned, false);
    assert.equal(search.pathsReturned, false);
    assert.equal(search.cursorsReturned, false);
    assert.equal(search.rawPayloadReturned, false);

    const serialized = JSON.stringify(summary);
    for (const marker of [
      "sensitive query",
      "private search snippet",
      "Private search preview",
      "Private search thread name",
      "private-search-next-cursor",
      "private-search-backwards-cursor",
      "/tmp/mock-workspace",
      "sk-proj-private-search",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_THREAD_SEARCH;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_THREAD_SEARCH = previous;
    }
  }
});

test("runThreadDeleteProbe deletes by suffix without returning ids, paths, or content", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_THREAD_DELETE;
  process.env.CODEX_APP_PORT_ALLOW_THREAD_DELETE = "1";
  try {
    const summary = await runThreadDeleteProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      threadIdSuffix: "00000001",
    });

    assert.equal(summary.ok, true);
    const deletion = summary.probes.threadDelete;
    assert.equal(deletion.method, "thread/delete");
    assert.equal(deletion.threadIdSuffix, "00000001");
    assert.equal(deletion.sourceArchived, false);
    assert.equal(deletion.status, "deleted");
    assert.deepEqual(deletion.methodsUsed, ["thread/list", "thread/delete"]);
    assert.equal(deletion.threadContentReturned, false);
    assert.equal(deletion.fullIdsReturned, false);
    assert.equal(deletion.cwdReturned, false);
    assert.equal(deletion.pathsReturned, false);
    assert.equal(deletion.namesReturned, false);
    assert.equal(deletion.previewsReturned, false);
    assert.equal(deletion.rawPayloadReturned, false);

    const serialized = JSON.stringify(summary);
    for (const marker of [
      "thread-00000001",
      "Sensitive delete response",
      "Sensitive delete notification",
      "delete-secret.txt",
      "/tmp/mock-workspace",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_THREAD_DELETE;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_THREAD_DELETE = previous;
    }
  }
});

test("runThreadForkProbe forks by suffix without returning ids, paths, names, or content", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_THREAD_FORK;
  process.env.CODEX_APP_PORT_ALLOW_THREAD_FORK = "1";
  try {
    const summary = await runThreadForkProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      threadIdSuffix: "00000001",
    });

    assert.equal(summary.ok, true);
    const fork = summary.probes.threadFork;
    assert.equal(fork.method, "thread/fork");
    assert.equal(fork.sourceThreadIdSuffix, "00000001");
    assert.equal(fork.threadIdSuffix, "abcd9999");
    assert.equal(fork.status, "idle");
    assert.deepEqual(fork.methodsUsed, ["thread/list", "thread/fork"]);
    assert.equal(fork.excludeTurns, true);
    assert.equal(fork.threadContentReturned, false);
    assert.equal(fork.fullIdsReturned, false);
    assert.equal(fork.cwdReturned, false);
    assert.equal(fork.pathsReturned, false);
    assert.equal(fork.namesReturned, false);
    assert.equal(fork.previewsReturned, false);
    assert.equal(fork.rawPayloadReturned, false);

    const serialized = JSON.stringify(summary);
    for (const marker of [
      "thread-00000001",
      "thread-fork-private-abcd9999",
      "Sensitive fork",
      "fork-secret",
      "turn-private-fork",
      "/tmp/mock-workspace",
      "mock-codex-home",
      "userAgent",
      "codexHome",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_THREAD_FORK;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_THREAD_FORK = previous;
    }
  }
});

test("runThreadRollbackProbe rolls back by suffix and count without returning ids, paths, names, or content", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_THREAD_ROLLBACK;
  process.env.CODEX_APP_PORT_ALLOW_THREAD_ROLLBACK = "1";
  try {
    const summary = await runThreadRollbackProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      threadIdSuffix: "00000001",
      numTurns: 2,
    });

    assert.equal(summary.ok, true);
    const rollback = summary.probes.threadRollback;
    assert.equal(rollback.method, "thread/rollback");
    assert.equal(rollback.threadIdSuffix, "00000001");
    assert.equal(rollback.numTurns, 2);
    assert.equal(rollback.status, "idle");
    assert.equal(rollback.returnedTurnCount, 1);
    assert.deepEqual(rollback.methodsUsed, ["thread/list", "thread/rollback"]);
    assert.equal(rollback.threadContentReturned, false);
    assert.equal(rollback.fullIdsReturned, false);
    assert.equal(rollback.cwdReturned, false);
    assert.equal(rollback.pathsReturned, false);
    assert.equal(rollback.namesReturned, false);
    assert.equal(rollback.previewsReturned, false);
    assert.equal(rollback.rawPayloadReturned, false);

    const serialized = JSON.stringify(summary);
    for (const marker of [
      "thread-00000001",
      "Sensitive rollback",
      "rollback-secret",
      "turn-private-rollback",
      "/tmp/mock-workspace",
      "mock-codex-home",
      "userAgent",
      "codexHome",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_THREAD_ROLLBACK;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_THREAD_ROLLBACK = previous;
    }
  }
});

test("runThreadSafetyLockProbe locks future thread policy without accepting unsafe settings", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_THREAD_SAFETY_LOCK;
  process.env.CODEX_APP_PORT_ALLOW_THREAD_SAFETY_LOCK = "1";
  try {
    const summary = await runThreadSafetyLockProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      threadIdSuffix: "00000001",
    });

    assert.equal(summary.ok, true);
    const lock = summary.probes.threadSafetyLock;
    assert.equal(lock.method, "thread/settings/update");
    assert.equal(lock.threadIdSuffix, "00000001");
    assert.equal(lock.status, "safety-locked");
    assert.deepEqual(lock.methodsUsed, ["thread/list", "thread/settings/update"]);
    assert.equal(lock.approvalPolicy, "on-request");
    assert.equal(lock.approvalsReviewer, "user");
    assert.equal(lock.sandboxPolicyType, "readOnly");
    assert.equal(lock.networkAccessAllowed, false);
    assert.equal(lock.modelAcceptedFromBrowser, false);
    assert.equal(lock.cwdAcceptedFromBrowser, false);
    assert.equal(lock.permissionsAcceptedFromBrowser, false);
    assert.equal(lock.threadContentReturned, false);
    assert.equal(lock.fullIdsReturned, false);
    assert.equal(lock.cwdReturned, false);
    assert.equal(lock.pathsReturned, false);
    assert.equal(lock.rawPayloadReturned, false);

    const serialized = JSON.stringify(summary);
    for (const marker of [
      "thread-00000001",
      "safety-lock-secret",
      "safety-lock-notification-secret",
      "private-model",
      "private-permissions",
      "/tmp/mock-workspace",
      "mock-codex-home",
      "userAgent",
      "codexHome",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_THREAD_SAFETY_LOCK;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_THREAD_SAFETY_LOCK = previous;
    }
  }
});

test("runSkillsExtraRootsClearProbe clears extra roots without accepting paths", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_SKILLS_EXTRA_ROOTS_CLEAR;
  process.env.CODEX_APP_PORT_ALLOW_SKILLS_EXTRA_ROOTS_CLEAR = "1";
  try {
    const summary = await runSkillsExtraRootsClearProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
    });

    assert.equal(summary.ok, true);
    const clear = summary.probes.skillsExtraRootsClear;
    assert.equal(clear.method, "skills/extraRoots/set");
    assert.equal(clear.status, "cleared");
    assert.equal(clear.requestedExtraRootCount, 0);
    assert.equal(clear.responseObject, true);
    assert.equal(clear.responseTopLevelKeyCount, 3);
    assert.equal(clear.extraRootsReturned, false);
    assert.equal(clear.pathsReturned, false);
    assert.equal(clear.rawPayloadReturned, false);

    const serialized = JSON.stringify(summary);
    for (const marker of [
      "private-extra-roots-secret",
      "private-extra-root",
      "/tmp/mock-workspace",
      "mock-codex-home",
      "userAgent",
      "codexHome",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_SKILLS_EXTRA_ROOTS_CLEAR;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_SKILLS_EXTRA_ROOTS_CLEAR = previous;
    }
  }
});

test("runRemoteControlDisableProbe disables remote control without returning identities", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_DISABLE;
  process.env.CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_DISABLE = "1";
  try {
    const summary = await runRemoteControlDisableProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
    });

    assert.equal(summary.ok, true);
    const disable = summary.probes.remoteControlDisable;
    assert.equal(disable.method, "remoteControl/disable");
    assert.equal(disable.status, "disabled");
    assert.equal(disable.statusKnown, true);
    assert.equal(disable.responseObject, true);
    assert.equal(disable.responseTopLevelKeyCount, 4);
    assert.equal(disable.paramsAcceptedFromBrowser, false);
    assert.equal(disable.statusValueReturned, false);
    assert.equal(disable.environmentIdReturned, false);
    assert.equal(disable.installationIdReturned, false);
    assert.equal(disable.serverNameReturned, false);
    assert.equal(disable.rawPayloadReturned, false);

    const serialized = JSON.stringify(summary);
    for (const marker of [
      "env_private_remote_control",
      "inst_private_remote_control",
      "private-remote-control-server",
      "mock-codex-home",
      "userAgent",
      "codexHome",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_DISABLE;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_DISABLE = previous;
    }
  }
});

test("runRemoteControlClientsListProbe returns opaque client inventory metadata", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_LIST;
  process.env.CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_LIST = "1";
  try {
    const summary = await runRemoteControlClientsListProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
    });

    assert.equal(summary.ok, true);
    const clients = summary.probes.remoteControlClients;
    assert.equal(clients.method, "remoteControl/client/list");
    assert.equal(clients.status, "listed-with-redactions");
    assert.equal(clients.responseObject, true);
    assert.equal(clients.clientCount, 2);
    assert.equal(clients.returnedClientCount, 2);
    assert.equal(clients.hasNextCursor, true);
    assert.equal(clients.environmentIdPresent, true);
    assert.equal(clients.clientIdsReturned, false);
    assert.equal(clients.clientNamesReturned, false);
    assert.equal(clients.deviceMetadataReturned, false);
    assert.equal(clients.cursorsReturned, false);
    assert.equal(clients.rawPayloadReturned, false);

    const serialized = JSON.stringify(summary);
    for (const marker of [
      "private-remote-environment-id",
      "private-client-id",
      "Private Laptop",
      "PrivateBookPro",
      "private-next-cursor",
      "private-app-version",
      "mock-codex-home",
      "userAgent",
      "codexHome",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_LIST;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_LIST = previous;
    }
  }
});

test("runRemoteControlClientRevokeProbe returns count-only revoke metadata", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_REVOKE;
  process.env.CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_REVOKE = "1";
  try {
    const summary = await runRemoteControlClientRevokeProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      environmentId: "private-remote-environment-id",
      clientId: "private-client-id-1",
    });

    assert.equal(summary.ok, true);
    const revoke = summary.probes.remoteControlClientRevoke;
    assert.equal(revoke.method, "remoteControl/client/revoke");
    assert.equal(revoke.status, "revoked-with-redactions");
    assert.equal(revoke.responseObject, true);
    assert.equal(revoke.responseTopLevelKeyCount, 3);
    assert.equal(revoke.environmentIdReturned, false);
    assert.equal(revoke.clientIdReturned, false);
    assert.equal(revoke.rawPayloadReturned, false);

    const serialized = JSON.stringify(summary);
    for (const marker of [
      "private-remote-environment-id",
      "private-client-id-1",
      "sk-proj-private-remote-client-revoke-token",
      "mock-codex-home",
      "userAgent",
      "codexHome",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_REVOKE;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_REMOTE_CONTROL_CLIENT_REVOKE = previous;
    }
  }
});

test("runThreadTranscriptProbe returns bounded transcript text without paths", async () => {
  const summary = await runThreadTranscriptProbe({
    codexBin: process.execPath,
    codexArgs: [mockServer.pathname],
    cwd: process.cwd(),
    timeoutMs: 1_000,
    threadIdSuffix: "00000001",
  });

  assert.equal(summary.ok, true);
  const transcript = summary.probes.threadTranscript;
  assert.equal(transcript.idSuffix, "00000001");
  assert.equal(transcript.turnCount, 1);
  assert.equal(transcript.turns[0].items.length, 2);
  assert.equal(transcript.turns[0].items[0].role, "user");
  assert.equal(transcript.turns[0].items[1].role, "assistant");
  const serialized = JSON.stringify(summary);
  assert.equal(serialized.includes("Sensitive user prompt must not leave sanitizer"), true);
  assert.equal(serialized.includes("Sensitive assistant answer must not leave sanitizer"), true);
  assert.equal(serialized.includes("secret.txt"), false);
  assert.equal(serialized.includes("/tmp/mock-workspace"), false);
  assert.equal(serialized.includes("Sensitive thread name"), false);
  assert.equal(serialized.includes("Sensitive preview"), false);
});

test("runThreadChangesProbe returns file-change inventory without raw payloads", async () => {
  const summary = await runThreadChangesProbe({
    codexBin: process.execPath,
    codexArgs: [mockServer.pathname],
    cwd: process.cwd(),
    timeoutMs: 1_000,
    threadIdSuffix: "00000001",
  });

  assert.equal(summary.ok, true);
  const changes = summary.probes.threadChanges;
  assert.equal(changes.idSuffix, "00000001");
  assert.equal(changes.changeItemCount, 1);
  assert.equal(changes.changeCount, 1);
  assert.equal(changes.turns[0].items[0].changes[0].fileBasename, "secret.txt");
  assert.equal(changes.turns[0].items[0].changes[0].additions, 2);
  assert.equal(changes.turns[0].items[0].changes[0].deletions, 1);
  assert.equal(changes.turns[0].items[0].changes[0].unsafeFieldsOmitted, true);
  const serialized = JSON.stringify(summary);
  assert.equal(serialized.includes("Sensitive user prompt"), false);
  assert.equal(serialized.includes("Sensitive assistant answer"), false);
  assert.equal(serialized.includes("Sensitive patch content"), false);
  assert.equal(serialized.includes("Sensitive file content"), false);
  assert.equal(serialized.includes("rm -rf"), false);
  assert.equal(serialized.includes("/tmp/mock-workspace"), false);
});

test("runTurnStartProbe captures sanitized session-owned live events", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_TURN_START;
  process.env.CODEX_APP_PORT_ALLOW_TURN_START = "1";
  try {
    const summary = await runTurnStartProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      threadIdSuffix: "00000001",
      prompt: "Sensitive start prompt must not be returned",
    });

    assert.equal(summary.ok, true);
    const turnStart = summary.probes.turnStart;
    assert.equal(turnStart.threadIdSuffix, "00000001");
    assert.equal(turnStart.turnIdSuffix, "turn-1");
    assert.equal(turnStart.eventCount >= 2, true);
    assert.equal(turnStart.returnedEventCount, turnStart.events.length);
    assert.equal(
      turnStart.events.some((event) => event.method === "item/agentMessage/delta"),
      true,
    );
    const liveEvent = turnStart.events.find(
      (event) => event.method === "item/agentMessage/delta",
    );
    assert.equal(liveEvent.liveText.role, "agent");
    assert.match(liveEvent.liveText.text, /Live turn output/);
    const serialized = JSON.stringify(summary);
    assert.equal(serialized.includes("Sensitive start prompt"), false);
    assert.equal(serialized.includes("/tmp/mock-workspace"), false);
    assert.equal(serialized.includes("secret.txt"), false);
    assert.equal(serialized.includes("sk-proj-secretvalue"), false);
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_TURN_START;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_TURN_START = previous;
    }
  }
});

test("runTurnStartProbe handles permissions approvals as decline-only without permission details", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_TURN_START;
  process.env.CODEX_APP_PORT_ALLOW_TURN_START = "1";
  try {
    const summary = await runTurnStartProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      threadIdSuffix: "00000001",
      prompt: "Trigger permissions approval without returning prompt",
    });

    const turnStart = summary.probes.turnStart;
    assert.equal(summary.ok, true);
    assert.equal(turnStart.approvalRequestCount, 1);
    assert.equal(turnStart.deniedApprovalCount, 1);
    assert.equal(turnStart.unsupportedApprovalCount, 0);
    const approval = turnStart.approvalRequests[0];
    assert.equal(approval.kind, "permissions");
    assert.equal(approval.method, "item/permissions/requestApproval");
    assert.equal(approval.cwdBasename, "mock-workspace");
    assert.equal(approval.hasPermissionsProfile, true);
    assert.equal(approval.hasAdditionalPermissions, true);
    assert.deepEqual(approval.safeApproveDecisions, []);
    assert.deepEqual(approval.safeDenyDecisions, ["decline"]);
    assert.equal(approval.handled, true);
    assert.equal(approval.decision, "decline");

    const serialized = JSON.stringify(summary);
    for (const marker of [
      "Trigger permissions approval",
      "/tmp/mock-workspace",
      "private-read",
      "private-write",
      "private-token-value",
      "\"fileSystem\"",
      "\"network\"",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_TURN_START;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_TURN_START = previous;
    }
  }
});

test("runLiveSessionControlProbe controls loaded sessions without returning ids or content", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_LIVE_SESSION_CONTROL;
  process.env.CODEX_APP_PORT_ALLOW_LIVE_SESSION_CONTROL = "1";
  try {
    const summary = await runLiveSessionControlProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      action: "interrupt",
      threadIdSuffix: "00000001",
      turnIdSuffix: "00000002",
    });

    assert.equal(summary.ok, true);
    const control = summary.probes.liveSessionControl;
    assert.equal(control.action, "interrupt");
    assert.equal(control.method, "turn/interrupt");
    assert.equal(control.threadIdSuffix, "00000001");
    assert.equal(control.turnIdSuffix, "00000002");
    assert.equal(control.resultStatus, "interrupt-requested");
    assert.deepEqual(control.methodsUsed, ["thread/loaded/list", "thread/read", "turn/interrupt"]);
    const serialized = JSON.stringify(summary);
    assert.equal(serialized.includes("Sensitive"), false);
    assert.equal(serialized.includes("raw interrupted content"), false);
    assert.equal(serialized.includes("/tmp/mock-workspace"), false);
    assert.equal(serialized.includes("thread-private-loaded-00000001"), false);
    assert.equal(serialized.includes("turn-sensitive-00000002"), false);
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_LIVE_SESSION_CONTROL;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_LIVE_SESSION_CONTROL = previous;
    }
  }
});

test("runLiveSessionControlProbe steers loaded turns behind explicit model-traffic opt-in", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_TURN_STEER;
  process.env.CODEX_APP_PORT_ALLOW_TURN_STEER = "1";
  try {
    const summary = await runLiveSessionControlProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      action: "steer",
      threadIdSuffix: "00000001",
      turnIdSuffix: "00000002",
      prompt: "Sensitive steer prompt must not be returned",
    });

    assert.equal(summary.ok, true);
    const control = summary.probes.liveSessionControl;
    assert.equal(control.action, "steer");
    assert.equal(control.method, "turn/steer");
    assert.equal(control.threadIdSuffix, "00000001");
    assert.equal(control.turnIdSuffix, "00000002");
    assert.equal(control.responseTurnIdSuffix, "00000002");
    assert.equal(control.resultStatus, "steer-submitted");
    assert.equal(control.promptCharCount, 43);
    assert.equal(control.promptTextReturned, false);
    assert.deepEqual(control.methodsUsed, ["thread/loaded/list", "thread/read", "turn/steer"]);
    const serialized = JSON.stringify(summary);
    assert.equal(serialized.includes("Sensitive steer prompt"), false);
    assert.equal(serialized.includes("Sensitive steer response"), false);
    assert.equal(serialized.includes("/tmp/mock-workspace"), false);
    assert.equal(serialized.includes("thread-private-loaded-00000001"), false);
    assert.equal(serialized.includes("turn-sensitive-00000002"), false);
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_TURN_STEER;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_TURN_STEER = previous;
    }
  }
});

test("runTerminalCommandExecProbe executes command/exec without returning command or output text", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_TERMINAL_COMMAND;
  process.env.CODEX_APP_PORT_ALLOW_TERMINAL_COMMAND = "1";
  try {
    const summary = await runTerminalCommandExecProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      argv: ["printf", "safe"],
    });
    const command = summary.probes.terminalCommandExec;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(command.method, "command/exec");
    assert.equal(command.resultStatus, "completed");
    assert.equal(command.exitCode, 0);
    assert.equal(command.argvCount, 2);
    assert.equal(command.sandboxPolicy, "readOnly");
    assert.equal(command.networkAccess, false);
    assert.equal(command.commandTextReturned, false);
    assert.equal(command.argvReturned, false);
    assert.equal(command.cwdReturned, false);
    assert.equal(command.outputTextReturned, false);
    assert.equal(command.processIdReturned, false);
    assert.equal(command.stdinEnabled, false);
    assert.equal(command.ttyEnabled, false);
    assert.equal(command.environmentReturned, false);
    assert.equal(command.stdout.textReturned, false);
    assert.equal(command.stderr.textReturned, false);
    assert.equal(command.stdout.charCount > 0, true);
    assert.equal(command.stderr.charCount > 0, true);
    for (const marker of [
      "printf",
      "safe",
      "private command stdout",
      "private command stderr",
      "sk-proj-privatevalue",
      "/tmp/mock-workspace",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_TERMINAL_COMMAND;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_TERMINAL_COMMAND = previous;
    }
  }
});

test("runProcessSpawnProbe executes process/spawn without returning command or output text", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_PROCESS_SPAWN;
  process.env.CODEX_APP_PORT_ALLOW_PROCESS_SPAWN = "1";
  try {
    const summary = await runProcessSpawnProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      argv: ["printf", "safe"],
      processHandle: "verify-process-handle-private",
    });
    const processSpawn = summary.probes.processSpawn;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(processSpawn.method, "process/spawn");
    assert.equal(processSpawn.resultStatus, "exited");
    assert.equal(processSpawn.exitCode, 0);
    assert.equal(processSpawn.argvCount, 2);
    assert.equal(processSpawn.sandboxPolicy, "none");
    assert.equal(processSpawn.networkAccess, true);
    assert.equal(processSpawn.commandTextReturned, false);
    assert.equal(processSpawn.argvReturned, false);
    assert.equal(processSpawn.cwdReturned, false);
    assert.equal(processSpawn.outputTextReturned, false);
    assert.equal(processSpawn.processHandleReturned, false);
    assert.equal(processSpawn.stdinEnabled, false);
    assert.equal(processSpawn.ttyEnabled, false);
    assert.equal(processSpawn.environmentReturned, false);
    assert.equal(processSpawn.environmentInherited, true);
    assert.equal(processSpawn.stdout.textReturned, false);
    assert.equal(processSpawn.stderr.textReturned, false);
    assert.equal(processSpawn.stdout.charCount > 0, true);
    assert.equal(processSpawn.stderr.charCount > 0, true);
    for (const marker of [
      "printf",
      "safe",
      "verify-process-handle-private",
      "Sensitive process stdout",
      "Sensitive process stderr",
      "private-token-value",
      "/tmp/mock-workspace",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_PROCESS_SPAWN;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_PROCESS_SPAWN = previous;
    }
  }
});

test("runThreadStartProbe creates a thread without model traffic or path leaks", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_THREAD_START;
  process.env.CODEX_APP_PORT_ALLOW_THREAD_START = "1";
  try {
    const summary = await runThreadStartProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
    });
    const threadStart = summary.probes.threadStart;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(threadStart.method, "thread/start");
    assert.equal(threadStart.threadIdSuffix, "thread-1");
    assert.equal(threadStart.approvalPolicy, "on-request");
    assert.equal(threadStart.approvalsReviewer, "user");
    assert.equal(threadStart.sandbox, "read-only");
    assert.equal(threadStart.promptTextReturned, false);
    assert.equal(threadStart.threadContentReturned, false);
    assert.equal(threadStart.fullIdsReturned, false);
    assert.equal(threadStart.cwdReturned, false);
    assert.equal(threadStart.pathsReturned, false);
    assert.equal(threadStart.instructionSourcesReturned, false);
    for (const marker of [
      "/tmp/mock-workspace",
      "mock-codex-home",
      "userAgent",
      "codexHome",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_THREAD_START;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_THREAD_START = previous;
    }
  }
});

test("runThreadRenameProbe renames by suffix without returning names, ids, paths, or content", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_THREAD_RENAME;
  process.env.CODEX_APP_PORT_ALLOW_THREAD_RENAME = "1";
  try {
    const summary = await runThreadRenameProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      threadIdSuffix: "00000001",
      name: "Sensitive private thread name",
    });

    assert.equal(summary.ok, true);
    const rename = summary.probes.threadRename;
    assert.equal(rename.method, "thread/name/set");
    assert.equal(rename.threadIdSuffix, "00000001");
    assert.equal(rename.status, "renamed");
    assert.deepEqual(rename.methodsUsed, ["thread/list", "thread/name/set"]);
    assert.equal(rename.nameCharCount, 29);
    assert.equal(rename.nameLineCount, 1);
    assert.equal(rename.nameReturned, false);
    assert.equal(rename.threadContentReturned, false);
    assert.equal(rename.fullIdsReturned, false);
    assert.equal(rename.cwdReturned, false);
    assert.equal(rename.pathsReturned, false);
    assert.equal(rename.previewsReturned, false);
    assert.equal(rename.rawPayloadReturned, false);

    const serialized = JSON.stringify(summary);
    for (const marker of [
      "thread-00000001",
      "Sensitive private thread name",
      "Sensitive rename",
      "rename-secret.txt",
      "/tmp/mock-workspace",
      "mock-codex-home",
      "userAgent",
      "codexHome",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_THREAD_RENAME;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_THREAD_RENAME = previous;
    }
  }
});

test("runThreadArchiveProbe archives a thread without returning ids or content", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_THREAD_ARCHIVE;
  process.env.CODEX_APP_PORT_ALLOW_THREAD_ARCHIVE = "1";
  try {
    const summary = await runThreadArchiveProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
      action: "archive",
      threadIdSuffix: "00000001",
    });
    const threadArchive = summary.probes.threadArchive;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(threadArchive.method, "thread/archive");
    assert.equal(threadArchive.action, "archive");
    assert.equal(threadArchive.threadIdSuffix, "00000001");
    assert.equal(threadArchive.sourceArchived, false);
    assert.equal(threadArchive.targetArchived, true);
    assert.deepEqual(threadArchive.methodsUsed, ["thread/list", "thread/archive"]);
    assert.equal(threadArchive.threadContentReturned, false);
    assert.equal(threadArchive.fullIdsReturned, false);
    assert.equal(threadArchive.cwdReturned, false);
    assert.equal(threadArchive.pathsReturned, false);
    assert.equal(threadArchive.namesReturned, false);
    assert.equal(threadArchive.previewsReturned, false);
    for (const marker of [
      "thread-00000001",
      "Sensitive",
      "/tmp/mock-workspace",
      "secret.txt",
      "mock-codex-home",
      "userAgent",
      "codexHome",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_THREAD_ARCHIVE;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_THREAD_ARCHIVE = previous;
    }
  }
});

test("runAccountLogoutProbe logs out without returning auth secrets", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_ACCOUNT_LOGOUT;
  process.env.CODEX_APP_PORT_ALLOW_ACCOUNT_LOGOUT = "1";
  try {
    const summary = await runAccountLogoutProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
    });
    const logout = summary.probes.accountLogout;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(logout.method, "account/logout");
    assert.equal(logout.resultStatus, "logged-out");
    assert.equal(logout.authMutation, true);
    assert.equal(logout.modelTraffic, false);
    assert.equal(logout.tokensReturned, false);
    assert.equal(logout.accountIdentifiersReturned, false);
    assert.equal(logout.urlsReturned, false);
    assert.equal(logout.rawPayloadReturned, false);
    for (const marker of [
      "sk-proj-private-auth-token",
      "acct-private",
      "private@example.com",
      "mock-codex-home",
      "userAgent",
      "codexHome",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_ACCOUNT_LOGOUT;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_ACCOUNT_LOGOUT = previous;
    }
  }
});

test("runAccountReadProbe returns account state without identity secrets", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_ACCOUNT_READ;
  process.env.CODEX_APP_PORT_ALLOW_ACCOUNT_READ = "1";
  try {
    const summary = await runAccountReadProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
    });
    const account = summary.probes.accountRead;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(account.method, "account/read");
    assert.equal(account.ok, true);
    assert.equal(account.requiresOpenaiAuth, false);
    assert.equal(account.hasAccount, true);
    assert.equal(account.accountType, "chatgpt");
    assert.equal(account.emailReturned, false);
    assert.equal(account.tokenReturned, false);
    assert.equal(serialized.includes("person@example.test"), false);
    assert.equal(serialized.includes("secret-token"), false);
    assert.equal(serialized.includes("\"emailReturned\":true"), false);
    assert.equal(serialized.includes("\"tokenReturned\":true"), false);
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_ACCOUNT_READ;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_ACCOUNT_READ = previous;
    }
  }
});

test("runHooksListReadProbe returns hook counts without hook details", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_HOOKS_LIST;
  process.env.CODEX_APP_PORT_ALLOW_HOOKS_LIST = "1";
  try {
    const summary = await runHooksListReadProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
    });
    const hooks = summary.probes.hooks;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(hooks.ok, true);
    assert.equal(hooks.workspaceCount, 1);
    assert.equal(hooks.hookCount, 1);
    assert.equal(hooks.enabledCount, 1);
    assert.equal(hooks.errorCount, 1);
    assert.equal(hooks.warningCount, 1);
    assert.deepEqual(hooks.eventCounts, { preToolUse: 1 });
    assert.deepEqual(hooks.handlerTypeCounts, { command: 1 });
    assert.deepEqual(hooks.sourceCounts, { project: 1 });
    assert.deepEqual(hooks.trustStatusCounts, { trusted: 1 });
    assert.equal(hooks.commandsReturned, false);
    assert.equal(hooks.pathsReturned, false);
    assert.equal(hooks.keysReturned, false);
    assert.equal(hooks.matchersReturned, false);
    assert.equal(hooks.pluginIdsReturned, false);
    for (const marker of [
      "/tmp/mock-workspace",
      "secret.txt",
      "private hook error",
      "private hook warning",
      "private-hash",
      "private-hook-key",
      "private-tool",
      "private-plugin-id",
      ".codex/hooks/private.toml",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_HOOKS_LIST;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_HOOKS_LIST = previous;
    }
  }
});

test("runConfigRequirementsReadProbe returns requirement counts without policy values", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_CONFIG_REQUIREMENTS;
  process.env.CODEX_APP_PORT_ALLOW_CONFIG_REQUIREMENTS = "1";
  try {
    const summary = await runConfigRequirementsReadProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
    });
    const requirements = summary.probes.configRequirements;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(requirements.ok, true);
    assert.equal(requirements.hasRequirements, true);
    assert.equal(requirements.allowedApprovalPolicyCount, 2);
    assert.equal(requirements.allowedSandboxModeCount, 2);
    assert.equal(requirements.allowedWebSearchModeCount, 1);
    assert.equal(requirements.featureRequirementCount, 2);
    assert.equal(requirements.hookRequirementHandlerCount, 1);
    assert.equal(requirements.networkRequirementKeyCount, 1);
    assert.equal(requirements.valuesReturned, false);
    assert.equal(requirements.domainsReturned, false);
    assert.equal(requirements.hookCommandsReturned, false);
    assert.equal(requirements.pathsReturned, false);
    for (const marker of [
      "private.example.test",
      "private hook command",
      "private-requirement-key",
      "/tmp/mock-workspace",
      "secret.txt",
      "danger-full-access",
      "on-request",
      "mock-codex-home",
      "codexHome",
      "userAgent",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_CONFIG_REQUIREMENTS;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_CONFIG_REQUIREMENTS = previous;
    }
  }
});

test("runMcpServerStatusReadProbe returns MCP counts without server details", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_MCP_SERVER_STATUS;
  process.env.CODEX_APP_PORT_ALLOW_MCP_SERVER_STATUS = "1";
  try {
    const summary = await runMcpServerStatusReadProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
    });
    const status = summary.probes.mcpServerStatus;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(status.ok, true);
    assert.equal(status.serverCount, 1);
    assert.deepEqual(status.authStatusCounts, { oAuth: 1 });
    assert.equal(status.toolCount, 1);
    assert.equal(status.resourceCount, 1);
    assert.equal(status.resourceTemplateCount, 1);
    assert.equal(status.returnedServerCount, 0);
    assert.equal(status.namesReturned, false);
    assert.equal(status.toolSchemasReturned, false);
    for (const marker of [
      "private-mcp",
      "private_tool",
      "inputSchema",
      "file:///tmp/mock-workspace",
      "secret.txt",
      "mock-codex-home",
      "codexHome",
      "userAgent",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_MCP_SERVER_STATUS;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_MCP_SERVER_STATUS = previous;
    }
  }
});

test("runSkillsListReadProbe returns skill counts without skill details", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_SKILLS_LIST;
  process.env.CODEX_APP_PORT_ALLOW_SKILLS_LIST = "1";
  try {
    const summary = await runSkillsListReadProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
    });
    const skills = summary.probes.skills;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(skills.ok, true);
    assert.equal(skills.workspaceCount, 1);
    assert.equal(skills.skillCount, 1);
    assert.equal(skills.enabledCount, 1);
    assert.equal(skills.disabledCount, 0);
    assert.equal(skills.errorCount, 1);
    assert.deepEqual(skills.scopeCounts, { repo: 1 });
    assert.equal(skills.dependencyToolCount, 1);
    assert.equal(skills.dependencyToolCommandCount, 1);
    assert.equal(skills.dependencyToolUrlCount, 1);
    assert.equal(skills.dependencyToolTransportCount, 1);
    assert.equal(skills.dependencyToolDescriptionCount, 1);
    assert.equal(skills.displayNameCount, 1);
    assert.equal(skills.shortDescriptionCount, 1);
    assert.equal(skills.defaultPromptCount, 1);
    assert.equal(skills.iconCount, 2);
    assert.equal(skills.brandColorCount, 1);
    assert.equal(skills.returnedSkillCount, 0);
    assert.equal(skills.namesReturned, false);
    assert.equal(skills.pathsReturned, false);
    assert.equal(skills.descriptionsReturned, false);
    assert.equal(skills.defaultPromptsReturned, false);
    assert.equal(skills.dependencyToolValuesReturned, false);
    assert.equal(skills.dependencyToolCommandsReturned, false);
    assert.equal(skills.dependencyToolUrlsReturned, false);
    for (const marker of [
      "private-skill",
      "private description",
      "private skill display",
      "private short description",
      "private default prompt",
      "/tmp/mock-workspace",
      "private skill error",
      "private-tool",
      "private tool description",
      "secret.txt",
      "example.test",
      "SKILL.md",
      "small.png",
      "large.png",
      "codexHome",
      "userAgent",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_SKILLS_LIST;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_SKILLS_LIST = previous;
    }
  }
});

test("runAppsListReadProbe returns app counts without app details", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_APPS_LIST;
  process.env.CODEX_APP_PORT_ALLOW_APPS_LIST = "1";
  try {
    const summary = await runAppsListReadProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
    });
    const apps = summary.probes.apps;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(apps.ok, true);
    assert.equal(apps.appCount, 1);
    assert.equal(apps.enabledCount, 1);
    assert.equal(apps.disabledCount, 0);
    assert.equal(apps.accessibleCount, 1);
    assert.equal(apps.inaccessibleCount, 0);
    assert.equal(apps.discoverableCount, 1);
    assert.equal(apps.metadataCount, 1);
    assert.equal(apps.brandingCount, 1);
    assert.equal(apps.developerCount, 2);
    assert.equal(apps.categoryValueCount, 3);
    assert.equal(apps.distributionChannelValueCount, 1);
    assert.equal(apps.firstPartyTypeValueCount, 1);
    assert.equal(apps.reviewStatusValueCount, 1);
    assert.equal(apps.labelKeyCount, 1);
    assert.equal(apps.pluginDisplayNameCount, 2);
    assert.equal(apps.screenshotCount, 1);
    assert.equal(apps.urlFieldCount, 6);
    assert.equal(apps.returnedAppCount, 0);
    assert.equal(apps.namesReturned, false);
    assert.equal(apps.pluginDisplayNamesReturned, false);
    assert.equal(apps.idsReturned, false);
    assert.equal(apps.descriptionsReturned, false);
    assert.equal(apps.labelsReturned, false);
    assert.equal(apps.logosReturned, false);
    assert.equal(apps.urlsReturned, false);
    assert.equal(apps.screenshotsReturned, false);
    for (const marker of [
      "private-app-id",
      "private-app",
      "private app description",
      "private-plugin",
      "private developer",
      "private-category",
      "private-review",
      "private screenshot prompt",
      "private label value",
      "/tmp/mock-workspace",
      "example.test",
      "codexHome",
      "userAgent",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_APPS_LIST;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_APPS_LIST = previous;
    }
  }
});

test("runModelsListReadProbe returns model counts without model details", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_MODELS_LIST;
  process.env.CODEX_APP_PORT_ALLOW_MODELS_LIST = "1";
  try {
    const summary = await runModelsListReadProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
    });
    const models = summary.probes.models;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(models.ok, true);
    assert.equal(models.modelCount, 2);
    assert.equal(models.defaultCount, 1);
    assert.equal(models.hiddenCount, 1);
    assert.equal(models.visibleCount, 1);
    assert.equal(models.textInputCount, 2);
    assert.equal(models.imageInputCount, 1);
    assert.equal(models.personalityCount, 1);
    assert.equal(models.upgradeInfoCount, 1);
    assert.equal(models.availabilityNuxCount, 1);
    assert.equal(models.serviceTierCount, 1);
    assert.equal(models.reasoningEffortOptionCount, 1);
    assert.equal(models.descriptionCount, 2);
    assert.equal(models.displayNameCount, 2);
    assert.equal(models.hasNextCursor, true);
    assert.equal(models.returnedModelCount, 0);
    assert.equal(models.namesReturned, false);
    assert.equal(models.modelIdsReturned, false);
    assert.equal(models.descriptionsReturned, false);
    assert.equal(models.upgradeCopyReturned, false);
    assert.equal(models.availabilityMessagesReturned, false);
    assert.equal(models.rawPayloadReturned, false);
    for (const marker of [
      "private-model-id",
      "private-model",
      "private-model-display",
      "private model description",
      "private reasoning description",
      "private-tier-id",
      "private tier",
      "private tier description",
      "private availability message",
      "private-upgrade-model",
      "private upgrade copy",
      "private-hidden-model-id",
      "private-hidden-model",
      "private hidden model description",
      "private-model-cursor",
      "/tmp/mock-workspace",
      "codexHome",
      "userAgent",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_MODELS_LIST;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_MODELS_LIST = previous;
    }
  }
});

test("runModelProviderCapabilitiesReadProbe returns capability flags without raw provider payload", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_MODEL_PROVIDER_CAPABILITIES;
  process.env.CODEX_APP_PORT_ALLOW_MODEL_PROVIDER_CAPABILITIES = "1";
  try {
    const summary = await runModelProviderCapabilitiesReadProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
    });
    const capabilities = summary.probes.modelProviderCapabilities;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(capabilities.ok, true);
    assert.equal(capabilities.capabilityCount, 3);
    assert.equal(capabilities.enabledCapabilityCount, 2);
    assert.equal(capabilities.disabledCapabilityCount, 1);
    assert.equal(capabilities.imageGenerationEnabled, true);
    assert.equal(capabilities.namespaceToolsEnabled, true);
    assert.equal(capabilities.webSearchEnabled, false);
    assert.equal(capabilities.rawPayloadReturned, false);
    for (const marker of [
      "/tmp/mock-workspace",
      "codexHome",
      "userAgent",
      "\"rawPayloadReturned\":true",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_MODEL_PROVIDER_CAPABILITIES;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_MODEL_PROVIDER_CAPABILITIES = previous;
    }
  }
});

test("runCollaborationModesReadProbe returns mode counts without names or model overrides", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_COLLABORATION_MODES;
  process.env.CODEX_APP_PORT_ALLOW_COLLABORATION_MODES = "1";
  try {
    const summary = await runCollaborationModesReadProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
    });
    const modes = summary.probes.collaborationModes;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(modes.ok, true);
    assert.equal(modes.modeCount, 2);
    assert.equal(modes.modeKindCounts.default, 1);
    assert.equal(modes.modeKindCounts.plan, 1);
    assert.equal(modes.modelOverrideCount, 1);
    assert.equal(modes.reasoningEffortOverrideCount, 1);
    assert.equal(modes.reasoningEffortCounts.medium, 1);
    assert.equal(modes.returnedModeCount, 0);
    assert.deepEqual(modes.items, []);
    assert.equal(modes.namesReturned, false);
    assert.equal(modes.modelIdsReturned, false);
    assert.equal(modes.rawPayloadReturned, false);
    for (const marker of [
      "private-mode",
      "private-model",
      "/tmp/mock-workspace",
      "codexHome",
      "userAgent",
      "\"namesReturned\":true",
      "\"modelIdsReturned\":true",
      "\"rawPayloadReturned\":true",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_COLLABORATION_MODES;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_COLLABORATION_MODES = previous;
    }
  }
});

test("runPluginsListReadProbe returns plugin catalog counts without plugin details", async () => {
  const previous = process.env.CODEX_APP_PORT_ALLOW_PLUGINS_LIST;
  process.env.CODEX_APP_PORT_ALLOW_PLUGINS_LIST = "1";
  try {
    const summary = await runPluginsListReadProbe({
      codexBin: process.execPath,
      codexArgs: [mockServer.pathname],
      cwd: process.cwd(),
      timeoutMs: 1_000,
    });
    const plugins = summary.probes.plugins;
    const serialized = JSON.stringify(summary);
    assert.equal(summary.ok, true);
    assert.equal(plugins.ok, true);
    assert.equal(plugins.marketplaceCount, 1);
    assert.equal(plugins.localMarketplaceCount, 1);
    assert.equal(plugins.remoteMarketplaceCount, 0);
    assert.equal(plugins.marketplaceDisplayNameCount, 1);
    assert.equal(plugins.pluginCount, 1);
    assert.equal(plugins.installedCount, 1);
    assert.equal(plugins.enabledCount, 1);
    assert.equal(plugins.pluginWithDisplayNameCount, 1);
    assert.equal(plugins.pluginWithDescriptionCount, 1);
    assert.equal(plugins.pluginWithDefaultPromptCount, 1);
    assert.equal(plugins.pluginWithCapabilityCount, 1);
    assert.equal(plugins.pluginWithScreenshotCount, 1);
    assert.equal(plugins.loadErrorCount, 1);
    assert.equal(plugins.featuredCount, 1);
    assert.deepEqual(plugins.sourceTypeCounts, { local: 1 });
    assert.deepEqual(plugins.installPolicyCounts, { AVAILABLE: 1 });
    assert.deepEqual(plugins.authPolicyCounts, { ON_USE: 1 });
    assert.equal(plugins.returnedPluginCount, 0);
    assert.equal(plugins.remotePluginCatalogRequested, false);
    assert.equal(plugins.requestedMarketplaceKindCount, 2);
    assert.equal(plugins.namesReturned, false);
    assert.equal(plugins.marketplaceNamesReturned, false);
    assert.equal(plugins.marketplaceDisplayNamesReturned, false);
    assert.equal(plugins.marketplaceKindsReturned, false);
    assert.equal(plugins.pluginDisplayNamesReturned, false);
    assert.equal(plugins.idsReturned, false);
    assert.equal(plugins.pathsReturned, false);
    assert.equal(plugins.urlsReturned, false);
    assert.equal(plugins.descriptionsReturned, false);
    assert.equal(plugins.defaultPromptsReturned, false);
    assert.equal(plugins.capabilityNamesReturned, false);
    assert.equal(plugins.screenshotsReturned, false);
    for (const marker of [
      "private-local-marketplace",
      "private local marketplace",
      "private-plugin-id",
      "private-plugin",
      "private plugin display",
      "private plugin short description",
      "private plugin prompt",
      "private plugin capability",
      "private-plugin-screenshot.png",
      "private marketplace error",
      "private-remote-plugin",
      "/tmp/mock-workspace",
      "example.test",
      "codexHome",
      "userAgent",
    ]) {
      assert.equal(serialized.includes(marker), false, `leaked ${marker}`);
    }
  } finally {
    if (previous === undefined) {
      delete process.env.CODEX_APP_PORT_ALLOW_PLUGINS_LIST;
    } else {
      process.env.CODEX_APP_PORT_ALLOW_PLUGINS_LIST = previous;
    }
  }
});

test("summarizeThreadList omits sensitive thread content", () => {
  const summary = summarizeThreadList({
    data: [
      {
        id: "019e2fe1-e0c1-7840-a565-77c5b0153f06",
        name: "Sensitive user title",
        preview: "Sensitive user prompt body",
        status: { type: "notLoaded" },
        source: "cli",
        modelProvider: "openai",
        createdAt: 1,
        updatedAt: 2,
        cwd: "/home/slk/private/project",
        gitInfo: { branch: "main" },
      },
    ],
  });

  assert.equal(summary.count, 1);
  assert.deepEqual(Object.keys(summary.items[0]).sort(), [
    "archived",
    "createdAt",
    "cwdBasename",
    "hasGitInfo",
    "hasName",
    "hasPreview",
    "idSuffix",
    "modelProvider",
    "source",
    "status",
    "updatedAt",
  ]);
  assert.equal(summary.archived, false);
  assert.equal(summary.unavailable, false);
  assert.equal(summary.items[0].archived, false);
  assert.equal(summary.items[0].idSuffix, "b0153f06");
  assert.equal(summary.items[0].cwdBasename, "project");
  assert.equal(JSON.stringify(summary).includes("Sensitive"), false);
  assert.equal(JSON.stringify(summary).includes("/home/slk/private"), false);
});

test("summarizeLoadedSessions returns bounded suffix-only ids", () => {
  const summary = summarizeLoadedSessions(
    {
      data: [
        "thread-private-full-id-00000001",
        "thread-private-full-id-00000002",
        "/tmp/private/path/00000003",
      ],
      nextCursor: "secret-cursor",
    },
    { limit: 2 },
  );

  assert.deepEqual(summary, {
    count: 3,
    returnedThreadCount: 2,
    hasNextCursor: true,
    threadIdSuffixes: ["00000001", "00000002"],
    fullIdsReturned: false,
  });
});

test("summarizeThreadTranscript keeps only text transcript and redacts paths", () => {
  const summary = summarizeThreadTranscript(
    {
      id: "thread-12345678",
      cwd: "/home/slk/private/project",
      status: "completed",
      turns: [
        {
          id: "turn-87654321",
          status: "completed",
          items: [
            {
              type: "userMessage",
              id: "item-00001111",
              content: "Open /home/slk/private/project/secret.txt please",
            },
            {
              type: "agentMessage",
              id: "item-00002222",
              text: "I will not expose ~/private/token.txt",
              phase: "final_answer",
            },
            {
              type: "fileChange",
              id: "item-00003333",
              changes: [{ path: "/home/slk/private/project/secret.txt" }],
            },
          ],
        },
      ],
    },
    {
      itemTextLimit: 80,
      totalTextLimit: 200,
    },
  );

  assert.equal(summary.idSuffix, "12345678");
  assert.equal(summary.turns[0].items.length, 2);
  assert.equal(summary.turns[0].items[0].text, "Open [path] please");
  assert.equal(summary.turns[0].items[1].text, "I will not expose [path]");
  const serialized = JSON.stringify(summary);
  assert.equal(serialized.includes("/home/slk/private"), false);
  assert.equal(serialized.includes("secret.txt"), false);
  assert.equal(serialized.includes("fileChange"), false);
});

test("summarizeThreadChanges returns sanitized bounded diff previews", () => {
  const summary = summarizeThreadChanges({
    id: "thread-12345678",
    cwd: "/home/slk/private/project",
    status: "completed",
    turns: [
      {
        id: "turn-87654321",
        status: "completed",
        items: [
          {
            type: "agentMessage",
            id: "item-00001111",
            text: "Sensitive assistant content",
          },
          {
            type: "fileChange",
            id: "item-00002222",
            status: "completed",
            changes: [
              {
                path: "/home/slk/private/project/secret.txt",
                kind: "update",
                diff: [
                  "diff --git a/src/secret.txt b/src/secret.txt",
                  "--- /home/slk/private/project/secret.txt",
                  "+++ /home/slk/private/project/secret.txt",
                  "+const answer = 42;",
                  "+const token = \"sk-proj-secretsecret\";",
                  "+Sensitive raw diff marker",
                ].join("\n"),
                content: "Sensitive file content",
                command: "cat /home/slk/private/project/secret.txt",
                additions: 3,
                deletions: 1,
              },
            ],
          },
        ],
      },
    ],
  });

  assert.equal(summary.idSuffix, "12345678");
  assert.equal(summary.changeItemCount, 1);
  assert.equal(summary.changeCount, 1);
  assert.equal(summary.turns[0].items[0].changes[0].fileBasename, "secret.txt");
  assert.equal(summary.turns[0].items[0].changes[0].kind, "update");
  assert.match(summary.turns[0].items[0].changes[0].diffPreview.text, /\+const answer = 42;/);
  assert.equal(summary.turns[0].items[0].changes[0].unsafeFieldsOmitted, true);
  const serialized = JSON.stringify(summary);
  assert.equal(serialized.includes("/home/slk/private"), false);
  assert.equal(serialized.includes("Sensitive raw diff"), false);
  assert.equal(serialized.includes("sk-proj-secretsecret"), false);
  assert.equal(serialized.includes("Sensitive file content"), false);
  assert.equal(serialized.includes("cat /home"), false);
  assert.equal(serialized.includes("Sensitive assistant content"), false);
});

test("summarizeThreadDetail omits transcript content and paths", () => {
  const summary = summarizeThreadDetail({
    id: "thread-12345678",
    name: "Sensitive title",
    preview: "Sensitive preview",
    cwd: "/home/slk/private/project",
    modelProvider: "openai",
    source: "cli",
    status: "completed",
    turns: [
      {
        id: "turn-87654321",
        status: "completed",
        itemsView: "full",
        items: [
          {
            type: "agentMessage",
            id: "item-00001111",
            text: "Sensitive assistant content",
            phase: "final_answer",
          },
          {
            type: "fileChange",
            id: "item-00002222",
            changes: [{ path: "/home/slk/private/project/secret.txt" }],
          },
        ],
      },
    ],
  });

  assert.equal(summary.idSuffix, "12345678");
  assert.equal(summary.cwdBasename, "project");
  assert.equal(summary.turns[0].items[0].hasText, true);
  assert.equal(summary.turns[0].items[1].changeCount, 1);
  const serialized = JSON.stringify(summary);
  assert.equal(serialized.includes("Sensitive"), false);
  assert.equal(serialized.includes("/home/slk/private"), false);
  assert.equal(serialized.includes("secret.txt"), false);
});

test("sanitizeNotification keeps only event metadata", () => {
  const sanitized = sanitizeNotification({
    method: "turn/completed",
    params: {
      threadId: "019e2fe1-e0c1-7840-a565-77c5b0153f06",
      turn: {
        id: "turn-sensitive-id-12345678",
        status: "completed",
      },
      item: {
        type: "agentMessage",
        text: "Sensitive assistant content",
      },
    },
  });

  assert.deepEqual(sanitized, {
    method: "turn/completed",
    threadIdSuffix: "b0153f06",
    turnIdSuffix: "12345678",
    itemType: "agentMessage",
    status: "completed",
  });
  assert.equal(JSON.stringify(sanitized).includes("Sensitive"), false);
});

test("sanitizeNotification keeps bounded redacted agent output deltas", () => {
  const sanitized = sanitizeNotification({
    method: "item/agentMessage/delta",
    params: {
      threadId: "019e2fe1-e0c1-7840-a565-77c5b0153f06",
      turnId: "turn-sensitive-id-12345678",
      itemId: "item-sensitive-id-87654321",
      delta: "Live answer references /home/slk/private/secret.txt and token=sk-proj-secretvalue",
    },
  });

  assert.equal(sanitized.method, "item/agentMessage/delta");
  assert.equal(sanitized.itemType, "agentMessage");
  assert.equal(sanitized.liveText.role, "agent");
  assert.equal(sanitized.liveText.text.includes("Live answer"), true);
  const serialized = JSON.stringify(sanitized);
  assert.equal(serialized.includes("/home/slk/private"), false);
  assert.equal(serialized.includes("secret.txt"), false);
  assert.equal(serialized.includes("sk-proj-secretvalue"), false);
});

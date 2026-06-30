const elements = {
  refreshButton: document.querySelector("#refresh-button"),
  workspaceSelect: document.querySelector("#workspace-select"),
  statusText: document.querySelector("#status-text"),
  platformText: document.querySelector("#platform-text"),
  transportText: document.querySelector("#transport-text"),
  updatedText: document.querySelector("#updated-text"),
  modelText: document.querySelector("#model-text"),
  providerText: document.querySelector("#provider-text"),
  sandboxText: document.querySelector("#sandbox-text"),
  approvalText: document.querySelector("#approval-text"),
  settingsStateText: document.querySelector("#settings-state-text"),
  settingsRefreshButton: document.querySelector("#settings-refresh-button"),
  settingsRefreshState: document.querySelector("#settings-refresh-state"),
  appSettingsParityText: document.querySelector("#app-settings-parity-text"),
  appSettingsBlockedText: document.querySelector("#app-settings-blocked-text"),
  appSettingsValuesText: document.querySelector("#app-settings-values-text"),
  appAppearanceText: document.querySelector("#app-appearance-text"),
  appAppearanceValuesText: document.querySelector("#app-appearance-values-text"),
  appShortcutsText: document.querySelector("#app-shortcuts-text"),
  appShortcutsEditingText: document.querySelector("#app-shortcuts-editing-text"),
  appNotificationsText: document.querySelector("#app-notifications-text"),
  appNotificationsPermissionText: document.querySelector("#app-notifications-permission-text"),
  appPersonalizationText: document.querySelector("#app-personalization-text"),
  appPersonalizationValueText: document.querySelector("#app-personalization-value-text"),
  realtimeVoicesButton: document.querySelector("#realtime-voices-button"),
  realtimeVoicesStateText: document.querySelector("#realtime-voices-state-text"),
  settingsSourceText: document.querySelector("#settings-source-text"),
  requirementsStateText: document.querySelector("#requirements-state-text"),
  modelInventoryStateText: document.querySelector("#model-inventory-state-text"),
  modelCapabilitiesStateText: document.querySelector("#model-capabilities-state-text"),
  collaborationModesStateText: document.querySelector("#collaboration-modes-state-text"),
  permissionProfilesStateText: document.querySelector("#permission-profiles-state-text"),
  remoteControlStateText: document.querySelector("#remote-control-state-text"),
  hooksStateText: document.querySelector("#hooks-state-text"),
  settingsMutationsText: document.querySelector("#settings-mutations-text"),
  authStateText: document.querySelector("#auth-state-text"),
  rateLimitsStateText: document.querySelector("#rate-limits-state-text"),
  accountUsageStateText: document.querySelector("#account-usage-state-text"),
  workspaceMessagesStateText: document.querySelector("#workspace-messages-state-text"),
  authCallbackText: document.querySelector("#auth-callback-text"),
  accountLoginText: document.querySelector("#account-login-text"),
  accountLoginCancelText: document.querySelector("#account-login-cancel-text"),
  accountResetCreditText: document.querySelector("#account-reset-credit-text"),
  activeLoginFlowCount: document.querySelector("#active-login-flow-count"),
  accountLoginHistoryCount: document.querySelector("#account-login-history-count"),
  accountResetCreditHistoryCount: document.querySelector("#account-reset-credit-history-count"),
  accountLogoutText: document.querySelector("#account-logout-text"),
  accountLogoutHistoryCount: document.querySelector("#account-logout-history-count"),
  integrationScopeText: document.querySelector("#integration-scope-text"),
  integrationLifecycleState: document.querySelector("#integration-lifecycle-state"),
  integrationLifecycleActivity: document.querySelector("#integration-lifecycle-activity"),
  integrationLifecycleLatest: document.querySelector("#integration-lifecycle-latest"),
  integrationActionGates: document.querySelector("#integration-action-gates"),
  integrationManagement: document.querySelector("#integration-management"),
  integrationExecutionReadiness: document.querySelector("#integration-execution-readiness"),
  integrationSafetyContract: document.querySelector("#integration-safety-contract"),
  integrationRoutingContract: document.querySelector("#integration-routing-contract"),
  integrationWorkflowContract: document.querySelector("#integration-workflow-contract"),
  integrationAuditContract: document.querySelector("#integration-audit-contract"),
  integrationProvenanceContract: document.querySelector("#integration-provenance-contract"),
  integrationExternalCodeContract: document.querySelector("#integration-external-code-contract"),
  integrationExecutableActions: document.querySelector("#integration-executable-actions"),
  integrationBlockedCount: document.querySelector("#integration-blocked-count"),
  accountLoginPreflightButton: document.querySelector("#account-login-preflight-button"),
  accountLoginButton: document.querySelector("#account-login-button"),
  accountLoginStatus: document.querySelector("#account-login-status"),
  accountLoginCodeText: document.querySelector("#account-login-code-text"),
  accountLoginUrlText: document.querySelector("#account-login-url-text"),
  accountLoginCancelPreflightButton: document.querySelector("#account-login-cancel-preflight-button"),
  accountLoginCancelButton: document.querySelector("#account-login-cancel-button"),
  accountLoginCancelStatus: document.querySelector("#account-login-cancel-status"),
  accountResetCreditPreflightButton: document.querySelector(
    "#account-reset-credit-preflight-button",
  ),
  accountResetCreditButton: document.querySelector("#account-reset-credit-button"),
  accountResetCreditStatus: document.querySelector("#account-reset-credit-status"),
  accountLogoutPreflightButton: document.querySelector("#account-logout-preflight-button"),
  accountLogoutButton: document.querySelector("#account-logout-button"),
  accountLogoutStatus: document.querySelector("#account-logout-status"),
  mcpServerReloadPreflightButton: document.querySelector("#mcp-server-reload-preflight-button"),
  mcpServerReloadButton: document.querySelector("#mcp-server-reload-button"),
  mcpServerReloadStatus: document.querySelector("#mcp-server-reload-status"),
  mcpOauthForm: document.querySelector("#mcp-oauth-form"),
  mcpOauthServerInput: document.querySelector("#mcp-oauth-server-input"),
  mcpOauthButton: document.querySelector("#mcp-oauth-button"),
  mcpOauthRunButton: document.querySelector("#mcp-oauth-run-button"),
  mcpOauthStatus: document.querySelector("#mcp-oauth-status"),
  mcpOauthServerChars: document.querySelector("#mcp-oauth-server-chars"),
  mcpOauthText: document.querySelector("#mcp-oauth-text"),
  mcpOauthUrlText: document.querySelector("#mcp-oauth-url-text"),
  mcpOauthResponseKeys: document.querySelector("#mcp-oauth-response-keys"),
  configValueForm: document.querySelector("#config-value-form"),
  configValueKeyInput: document.querySelector("#config-value-key-input"),
  configValueInput: document.querySelector("#config-value-input"),
  configValueMergeSelect: document.querySelector("#config-value-merge-select"),
  configValueButton: document.querySelector("#config-value-button"),
  configValueRunButton: document.querySelector("#config-value-run-button"),
  configValueStatus: document.querySelector("#config-value-status"),
  configValueKeyChars: document.querySelector("#config-value-key-chars"),
  configValueChars: document.querySelector("#config-value-chars"),
  configValueTypeText: document.querySelector("#config-value-type-text"),
  configValueWriteText: document.querySelector("#config-value-write-text"),
  configBatchForm: document.querySelector("#config-batch-form"),
  configBatchInput: document.querySelector("#config-batch-input"),
  configBatchButton: document.querySelector("#config-batch-button"),
  configBatchRunButton: document.querySelector("#config-batch-run-button"),
  configBatchStatus: document.querySelector("#config-batch-status"),
  configBatchEditCount: document.querySelector("#config-batch-edit-count"),
  configBatchKeyChars: document.querySelector("#config-batch-key-chars"),
  configBatchValueChars: document.querySelector("#config-batch-value-chars"),
  configBatchWriteText: document.querySelector("#config-batch-write-text"),
  experimentalFeatureForm: document.querySelector("#experimental-feature-form"),
  experimentalFeatureInput: document.querySelector("#experimental-feature-input"),
  experimentalFeatureEnabledSelect: document.querySelector("#experimental-feature-enabled-select"),
  experimentalFeatureButton: document.querySelector("#experimental-feature-button"),
  experimentalFeatureRunButton: document.querySelector("#experimental-feature-run-button"),
  experimentalFeatureStatus: document.querySelector("#experimental-feature-status"),
  experimentalFeatureChars: document.querySelector("#experimental-feature-chars"),
  experimentalFeatureValueCount: document.querySelector("#experimental-feature-value-count"),
  experimentalFeatureSetText: document.querySelector("#experimental-feature-set-text"),
  experimentalFeatureUpdatedText: document.querySelector("#experimental-feature-updated-text"),
  mcpStateText: document.querySelector("#mcp-state-text"),
  appsStateText: document.querySelector("#apps-state-text"),
  externalConfigStateText: document.querySelector("#external-config-state-text"),
  externalConfigImportHistoryText: document.querySelector("#external-config-import-history-text"),
  externalConfigImportForm: document.querySelector("#external-config-import-form"),
  externalConfigImportTargetInput: document.querySelector("#external-config-import-target-input"),
  externalConfigImportArgumentsInput: document.querySelector(
    "#external-config-import-arguments-input",
  ),
  externalConfigImportButton: document.querySelector("#external-config-import-button"),
  externalConfigImportStatus: document.querySelector("#external-config-import-status"),
  externalConfigImportTargetChars: document.querySelector(
    "#external-config-import-target-chars",
  ),
  externalConfigImportArgKeys: document.querySelector("#external-config-import-arg-keys"),
  externalConfigImportItemsText: document.querySelector("#external-config-import-items-text"),
  externalConfigImportText: document.querySelector("#external-config-import-text"),
  reviewFeedbackForm: document.querySelector("#review-feedback-form"),
  reviewFeedbackMethodSelect: document.querySelector("#review-feedback-method-select"),
  reviewFeedbackTargetInput: document.querySelector("#review-feedback-target-input"),
  reviewFeedbackArgumentsInput: document.querySelector("#review-feedback-arguments-input"),
  reviewFeedbackButton: document.querySelector("#review-feedback-button"),
  reviewFeedbackStatus: document.querySelector("#review-feedback-status"),
  reviewFeedbackTargetChars: document.querySelector("#review-feedback-target-chars"),
  reviewFeedbackArgKeys: document.querySelector("#review-feedback-arg-keys"),
  reviewFeedbackReviewText: document.querySelector("#review-feedback-review-text"),
  reviewFeedbackLogsText: document.querySelector("#review-feedback-logs-text"),
  memoryResetPreflightButton: document.querySelector("#memory-reset-preflight-button"),
  memoryResetStatus: document.querySelector("#memory-reset-status"),
  memoryResetParamsText: document.querySelector("#memory-reset-params-text"),
  memoryResetDeletedText: document.querySelector("#memory-reset-deleted-text"),
  memoryResetContentText: document.querySelector("#memory-reset-content-text"),
  skillsStateText: document.querySelector("#skills-state-text"),
  pluginsStateText: document.querySelector("#plugins-state-text"),
  installedPluginsStateText: document.querySelector("#installed-plugins-state-text"),
  integrationsTrafficText: document.querySelector("#integrations-traffic-text"),
  integrationsAuditedText: document.querySelector("#integrations-audited-text"),
  upstreamDriftText: document.querySelector("#upstream-drift-text"),
  serverRequestBoundaryText: document.querySelector("#server-request-boundary-text"),
  serverNotificationBoundaryText: document.querySelector("#server-notification-boundary-text"),
  serverBoundaryContractText: document.querySelector("#server-boundary-contract-text"),
  mcpToolForm: document.querySelector("#mcp-tool-form"),
  mcpServerInput: document.querySelector("#mcp-server-input"),
  mcpToolInput: document.querySelector("#mcp-tool-input"),
  mcpToolThreadInput: document.querySelector("#mcp-tool-thread-input"),
  mcpArgumentsInput: document.querySelector("#mcp-arguments-input"),
  mcpToolButton: document.querySelector("#mcp-tool-button"),
  mcpToolRunButton: document.querySelector("#mcp-tool-run-button"),
  mcpToolStatus: document.querySelector("#mcp-tool-status"),
  mcpServerChars: document.querySelector("#mcp-server-chars"),
  mcpToolChars: document.querySelector("#mcp-tool-chars"),
  mcpArgKeys: document.querySelector("#mcp-arg-keys"),
  mcpInvocationText: document.querySelector("#mcp-invocation-text"),
  mcpResourceForm: document.querySelector("#mcp-resource-form"),
  mcpResourceServerInput: document.querySelector("#mcp-resource-server-input"),
  mcpResourceInput: document.querySelector("#mcp-resource-input"),
  mcpResourceButton: document.querySelector("#mcp-resource-button"),
  mcpResourceRunButton: document.querySelector("#mcp-resource-run-button"),
  mcpResourceStatus: document.querySelector("#mcp-resource-status"),
  mcpResourceServerChars: document.querySelector("#mcp-resource-server-chars"),
  mcpResourceChars: document.querySelector("#mcp-resource-chars"),
  mcpResourceReadText: document.querySelector("#mcp-resource-read-text"),
  mcpResourceContentText: document.querySelector("#mcp-resource-content-text"),
  pluginReadForm: document.querySelector("#plugin-read-form"),
  pluginReadTargetInput: document.querySelector("#plugin-read-target-input"),
  pluginReadArgumentsInput: document.querySelector("#plugin-read-arguments-input"),
  pluginReadButton: document.querySelector("#plugin-read-button"),
  pluginReadRunButton: document.querySelector("#plugin-read-run-button"),
  pluginReadStatus: document.querySelector("#plugin-read-status"),
  pluginReadTargetChars: document.querySelector("#plugin-read-target-chars"),
  pluginReadArgKeys: document.querySelector("#plugin-read-arg-keys"),
  pluginReadText: document.querySelector("#plugin-read-text"),
  pluginReadDetailsText: document.querySelector("#plugin-read-details-text"),
  pluginInstallForm: document.querySelector("#plugin-install-form"),
  pluginInstallTargetInput: document.querySelector("#plugin-install-target-input"),
  pluginInstallArgumentsInput: document.querySelector("#plugin-install-arguments-input"),
  pluginInstallButton: document.querySelector("#plugin-install-button"),
  pluginInstallStatus: document.querySelector("#plugin-install-status"),
  pluginInstallTargetChars: document.querySelector("#plugin-install-target-chars"),
  pluginInstallArgKeys: document.querySelector("#plugin-install-arg-keys"),
  pluginInstallText: document.querySelector("#plugin-install-text"),
  pluginInstallProvenanceText: document.querySelector("#plugin-install-provenance-text"),
  marketplaceActionForm: document.querySelector("#marketplace-action-form"),
  marketplaceMethodSelect: document.querySelector("#marketplace-method-select"),
  marketplaceTargetInput: document.querySelector("#marketplace-target-input"),
  marketplaceArgumentsInput: document.querySelector("#marketplace-arguments-input"),
  marketplaceActionButton: document.querySelector("#marketplace-action-button"),
  marketplaceActionStatus: document.querySelector("#marketplace-action-status"),
  marketplaceTargetChars: document.querySelector("#marketplace-target-chars"),
  marketplaceArgKeys: document.querySelector("#marketplace-arg-keys"),
  marketplaceMutationText: document.querySelector("#marketplace-mutation-text"),
  marketplaceSourceText: document.querySelector("#marketplace-source-text"),
  pluginUninstallForm: document.querySelector("#plugin-uninstall-form"),
  pluginUninstallTargetInput: document.querySelector("#plugin-uninstall-target-input"),
  pluginUninstallButton: document.querySelector("#plugin-uninstall-button"),
  pluginUninstallRunButton: document.querySelector("#plugin-uninstall-run-button"),
  pluginUninstallStatus: document.querySelector("#plugin-uninstall-status"),
  pluginUninstallTargetChars: document.querySelector("#plugin-uninstall-target-chars"),
  pluginUninstallText: document.querySelector("#plugin-uninstall-text"),
  pluginUninstallResponseKeys: document.querySelector("#plugin-uninstall-response-keys"),
  pluginUninstallDetailsText: document.querySelector("#plugin-uninstall-details-text"),
  pluginEnablementForm: document.querySelector("#plugin-enablement-form"),
  pluginEnablementTargetInput: document.querySelector("#plugin-enablement-target-input"),
  pluginEnablementEnabledSelect: document.querySelector("#plugin-enablement-enabled-select"),
  pluginEnablementButton: document.querySelector("#plugin-enablement-button"),
  pluginEnablementRunButton: document.querySelector("#plugin-enablement-run-button"),
  pluginEnablementStatus: document.querySelector("#plugin-enablement-status"),
  pluginEnablementTargetChars: document.querySelector("#plugin-enablement-target-chars"),
  pluginEnablementRequestText: document.querySelector("#plugin-enablement-request-text"),
  pluginEnablementText: document.querySelector("#plugin-enablement-text"),
  pluginEnablementResponseKeys: document.querySelector("#plugin-enablement-response-keys"),
  pluginShareCheckoutForm: document.querySelector("#plugin-share-checkout-form"),
  pluginShareCheckoutTargetInput: document.querySelector("#plugin-share-checkout-target-input"),
  pluginShareCheckoutButton: document.querySelector("#plugin-share-checkout-button"),
  pluginShareCheckoutRunButton: document.querySelector("#plugin-share-checkout-run-button"),
  pluginShareCheckoutStatus: document.querySelector("#plugin-share-checkout-status"),
  pluginShareCheckoutTargetChars: document.querySelector("#plugin-share-checkout-target-chars"),
  pluginShareCheckoutText: document.querySelector("#plugin-share-checkout-text"),
  pluginShareCheckoutResponseKeys: document.querySelector(
    "#plugin-share-checkout-response-keys",
  ),
  pluginShareCheckoutDetailsText: document.querySelector(
    "#plugin-share-checkout-details-text",
  ),
  pluginShareActionForm: document.querySelector("#plugin-share-action-form"),
  pluginShareActionMethodSelect: document.querySelector("#plugin-share-action-method-select"),
  pluginShareActionTargetInput: document.querySelector("#plugin-share-action-target-input"),
  pluginShareActionArgumentsInput: document.querySelector("#plugin-share-action-arguments-input"),
  pluginShareActionButton: document.querySelector("#plugin-share-action-button"),
  pluginShareActionStatus: document.querySelector("#plugin-share-action-status"),
  pluginShareActionTargetChars: document.querySelector("#plugin-share-action-target-chars"),
  pluginShareActionArgKeys: document.querySelector("#plugin-share-action-arg-keys"),
  pluginShareActionText: document.querySelector("#plugin-share-action-text"),
  pluginShareActionTargetsText: document.querySelector("#plugin-share-action-targets-text"),
  pluginContentForm: document.querySelector("#plugin-content-form"),
  pluginContentMethodSelect: document.querySelector("#plugin-content-method-select"),
  pluginContentTargetInput: document.querySelector("#plugin-content-target-input"),
  pluginContentArgumentsInput: document.querySelector("#plugin-content-arguments-input"),
  pluginContentButton: document.querySelector("#plugin-content-button"),
  pluginContentRunButton: document.querySelector("#plugin-content-run-button"),
  pluginContentStatus: document.querySelector("#plugin-content-status"),
  pluginContentTargetChars: document.querySelector("#plugin-content-target-chars"),
  pluginContentArgKeys: document.querySelector("#plugin-content-arg-keys"),
  pluginContentReadText: document.querySelector("#plugin-content-read-text"),
  pluginContentDetailsText: document.querySelector("#plugin-content-details-text"),
  skillsConfigForm: document.querySelector("#skills-config-form"),
  skillsConfigTargetInput: document.querySelector("#skills-config-target-input"),
  skillsConfigArgumentsInput: document.querySelector("#skills-config-arguments-input"),
  skillsConfigButton: document.querySelector("#skills-config-button"),
  skillsConfigRunButton: document.querySelector("#skills-config-run-button"),
  skillsConfigStatus: document.querySelector("#skills-config-status"),
  skillsConfigTargetChars: document.querySelector("#skills-config-target-chars"),
  skillsConfigArgKeys: document.querySelector("#skills-config-arg-keys"),
  skillsConfigWriteText: document.querySelector("#skills-config-write-text"),
  skillsConfigEffectiveText: document.querySelector("#skills-config-effective-text"),
  skillsExtraRootsClearPreflightButton: document.querySelector(
    "#skills-extra-roots-clear-preflight-button",
  ),
  skillsExtraRootsClearButton: document.querySelector("#skills-extra-roots-clear-button"),
  skillsExtraRootsClearStatus: document.querySelector("#skills-extra-roots-clear-status"),
  skillsExtraRootsClearCount: document.querySelector("#skills-extra-roots-clear-count"),
  skillsExtraRootsBrowserText: document.querySelector("#skills-extra-roots-browser-text"),
  skillsExtraRootsResultText: document.querySelector("#skills-extra-roots-result-text"),
  remoteControlEnableArgumentsInput: document.querySelector(
    "#remote-control-enable-arguments-input",
  ),
  remoteControlEnablePreflightButton: document.querySelector(
    "#remote-control-enable-preflight-button",
  ),
  remoteControlEnableStatus: document.querySelector("#remote-control-enable-status"),
  remoteControlEnableArgKeys: document.querySelector("#remote-control-enable-arg-keys"),
  remoteControlEnableEphemeralText: document.querySelector(
    "#remote-control-enable-ephemeral-text",
  ),
  remoteControlEnableIdentityText: document.querySelector(
    "#remote-control-enable-identity-text",
  ),
  remoteControlPairingMethodSelect: document.querySelector(
    "#remote-control-pairing-method-select",
  ),
  remoteControlPairingArgumentsInput: document.querySelector(
    "#remote-control-pairing-arguments-input",
  ),
  remoteControlPairingPreflightButton: document.querySelector(
    "#remote-control-pairing-preflight-button",
  ),
  remoteControlPairingStatus: document.querySelector("#remote-control-pairing-status"),
  remoteControlPairingArgKeys: document.querySelector("#remote-control-pairing-arg-keys"),
  remoteControlPairingCodeText: document.querySelector("#remote-control-pairing-code-text"),
  remoteControlPairingClaimText: document.querySelector("#remote-control-pairing-claim-text"),
  remoteControlDisablePreflightButton: document.querySelector(
    "#remote-control-disable-preflight-button",
  ),
  remoteControlDisableButton: document.querySelector("#remote-control-disable-button"),
  remoteControlDisableStatus: document.querySelector("#remote-control-disable-status"),
  remoteControlDisableParamsText: document.querySelector("#remote-control-disable-params-text"),
  remoteControlDisableStatusText: document.querySelector("#remote-control-disable-status-text"),
  remoteControlDisableIdentityText: document.querySelector("#remote-control-disable-identity-text"),
  remoteClientsListButton: document.querySelector("#remote-clients-list-button"),
  remoteClientSelect: document.querySelector("#remote-client-select"),
  remoteClientRevokePreflightButton: document.querySelector(
    "#remote-client-revoke-preflight-button",
  ),
  remoteClientRevokeButton: document.querySelector("#remote-client-revoke-button"),
  remoteClientsStatus: document.querySelector("#remote-clients-status"),
  remoteClientRefCount: document.querySelector("#remote-client-ref-count"),
  remoteClientIdsText: document.querySelector("#remote-client-ids-text"),
  remoteClientNamesText: document.querySelector("#remote-client-names-text"),
  remoteClientRevokeText: document.querySelector("#remote-client-revoke-text"),
  environmentAddForm: document.querySelector("#environment-add-form"),
  environmentAddIdInput: document.querySelector("#environment-add-id-input"),
  environmentAddUrlInput: document.querySelector("#environment-add-url-input"),
  environmentAddButton: document.querySelector("#environment-add-button"),
  environmentAddRunButton: document.querySelector("#environment-add-run-button"),
  environmentAddStatus: document.querySelector("#environment-add-status"),
  environmentAddIdChars: document.querySelector("#environment-add-id-chars"),
  environmentAddUrlChars: document.querySelector("#environment-add-url-chars"),
  environmentAddUrlText: document.querySelector("#environment-add-url-text"),
  environmentAddResultText: document.querySelector("#environment-add-result-text"),
  integrationActionForm: document.querySelector("#integration-action-form"),
  integrationMethodSelect: document.querySelector("#integration-method-select"),
  integrationTargetInput: document.querySelector("#integration-target-input"),
  integrationArgumentsInput: document.querySelector("#integration-arguments-input"),
  integrationActionButton: document.querySelector("#integration-action-button"),
  integrationActionStatus: document.querySelector("#integration-action-status"),
  integrationMethodText: document.querySelector("#integration-method-text"),
  integrationTargetChars: document.querySelector("#integration-target-chars"),
  integrationArgKeys: document.querySelector("#integration-arg-keys"),
  integrationMutationText: document.querySelector("#integration-mutation-text"),
  integrationPreflightHistoryCount: document.querySelector("#integration-preflight-history-count"),
  integrationPreflightHistoryList: document.querySelector("#integration-preflight-history-list"),
  integrationConfirmationHistoryCount: document.querySelector("#integration-confirmation-history-count"),
  integrationConfirmationHistoryList: document.querySelector("#integration-confirmation-history-list"),
  accountLoginHistoryList: document.querySelector("#account-login-history-list"),
  accountResetCreditHistoryList: document.querySelector("#account-reset-credit-history-list"),
  accountLogoutHistoryList: document.querySelector("#account-logout-history-list"),
  integrationsMethodList: document.querySelector("#integrations-method-list"),
  upstreamDriftList: document.querySelector("#upstream-drift-list"),
  integrationsDetailList: document.querySelector("#integrations-detail-list"),
  appSettingsParityList: document.querySelector("#app-settings-parity-list"),
  appAppearanceList: document.querySelector("#app-appearance-list"),
  appKeyboardShortcutsList: document.querySelector("#app-keyboard-shortcuts-list"),
  appNotificationsList: document.querySelector("#app-notifications-list"),
  appPersonalizationList: document.querySelector("#app-personalization-list"),
  gitButton: document.querySelector("#git-button"),
  gitSwitchButton: document.querySelector("#git-switch-button"),
  gitDeleteButton: document.querySelector("#git-delete-button"),
  gitCreateForm: document.querySelector("#git-create-form"),
  gitCreateInput: document.querySelector("#git-create-input"),
  gitCreatePreflightButton: document.querySelector("#git-create-preflight-button"),
  gitCreateButton: document.querySelector("#git-create-button"),
  gitCreateState: document.querySelector("#git-create-state"),
  gitDeleteState: document.querySelector("#git-delete-state"),
  gitCommitForm: document.querySelector("#git-commit-form"),
  gitCommitInput: document.querySelector("#git-commit-input"),
  gitCommitPreflightButton: document.querySelector("#git-commit-preflight-button"),
  gitCommitButton: document.querySelector("#git-commit-button"),
  gitCommitState: document.querySelector("#git-commit-state"),
  gitWorktreeForm: document.querySelector("#git-worktree-form"),
  gitWorktreeAction: document.querySelector("#git-worktree-action"),
  gitWorktreePath: document.querySelector("#git-worktree-path"),
  gitWorktreeBranch: document.querySelector("#git-worktree-branch"),
  gitWorktreePreflightButton: document.querySelector("#git-worktree-preflight-button"),
  gitWorktreeButton: document.querySelector("#git-worktree-button"),
  gitWorktreeState: document.querySelector("#git-worktree-state"),
  gitRepoText: document.querySelector("#git-repo-text"),
  gitHeadText: document.querySelector("#git-head-text"),
  gitRemotesText: document.querySelector("#git-remotes-text"),
  gitLinkedText: document.querySelector("#git-linked-text"),
  gitBranchesText: document.querySelector("#git-branches-text"),
  gitActionsText: document.querySelector("#git-actions-text"),
  gitStatusText: document.querySelector("#git-status-text"),
  gitChangedText: document.querySelector("#git-changed-text"),
  gitSwitchRiskText: document.querySelector("#git-switch-risk-text"),
  gitPreflightState: document.querySelector("#git-preflight-state"),
  gitStateText: document.querySelector("#git-state-text"),
  gitDetailList: document.querySelector("#git-detail-list"),
  threadCount: document.querySelector("#thread-count"),
  threadStartPreflightButton: document.querySelector("#thread-start-preflight-button"),
  threadStartButton: document.querySelector("#thread-start-button"),
  threadStartStatus: document.querySelector("#thread-start-status"),
  threadSearch: document.querySelector("#thread-search"),
  threadServerSearchButton: document.querySelector("#thread-server-search-button"),
  threadServerSearchStatus: document.querySelector("#thread-server-search-status"),
  archivedToggle: document.querySelector("#archived-toggle"),
  threadList: document.querySelector("#thread-list"),
  threadServerSearchList: document.querySelector("#thread-server-search-list"),
  selectedThreadText: document.querySelector("#selected-thread-text"),
  threadArchivePreflightButton: document.querySelector("#thread-archive-preflight-button"),
  threadArchiveButton: document.querySelector("#thread-archive-button"),
  threadArchiveStatus: document.querySelector("#thread-archive-status"),
  threadForkPreflightButton: document.querySelector("#thread-fork-preflight-button"),
  threadForkButton: document.querySelector("#thread-fork-button"),
  threadForkStatus: document.querySelector("#thread-fork-status"),
  threadRenameInput: document.querySelector("#thread-rename-input"),
  threadRenamePreflightButton: document.querySelector("#thread-rename-preflight-button"),
  threadRenameButton: document.querySelector("#thread-rename-button"),
  threadRenameStatus: document.querySelector("#thread-rename-status"),
  threadGoalObjectiveInput: document.querySelector("#thread-goal-objective-input"),
  threadGoalStatusSelect: document.querySelector("#thread-goal-status-select"),
  threadGoalBudgetInput: document.querySelector("#thread-goal-budget-input"),
  threadGoalSetPreflightButton: document.querySelector("#thread-goal-set-preflight-button"),
  threadGoalSetButton: document.querySelector("#thread-goal-set-button"),
  threadGoalClearPreflightButton: document.querySelector("#thread-goal-clear-preflight-button"),
  threadGoalClearButton: document.querySelector("#thread-goal-clear-button"),
  threadGoalMutationStatus: document.querySelector("#thread-goal-mutation-status"),
  threadMemoryModeSelect: document.querySelector("#thread-memory-mode-select"),
  threadMemoryModePreflightButton: document.querySelector("#thread-memory-mode-preflight-button"),
  threadMemoryModeButton: document.querySelector("#thread-memory-mode-button"),
  threadMemoryModeStatus: document.querySelector("#thread-memory-mode-status"),
  threadMetadataArgumentsInput: document.querySelector("#thread-metadata-arguments-input"),
  threadMetadataUpdatePreflightButton: document.querySelector(
    "#thread-metadata-update-preflight-button",
  ),
  threadMetadataUpdateStatus: document.querySelector("#thread-metadata-update-status"),
  threadResumeInjectMethodSelect: document.querySelector("#thread-resume-inject-method-select"),
  threadResumeInjectArgumentsInput: document.querySelector(
    "#thread-resume-inject-arguments-input",
  ),
  threadResumeInjectPreflightButton: document.querySelector(
    "#thread-resume-inject-preflight-button",
  ),
  threadResumeInjectStatus: document.querySelector("#thread-resume-inject-status"),
  threadRealtimeMethodSelect: document.querySelector("#thread-realtime-method-select"),
  threadRealtimeArgumentsInput: document.querySelector("#thread-realtime-arguments-input"),
  threadRealtimePreflightButton: document.querySelector("#thread-realtime-preflight-button"),
  threadRealtimeStatus: document.querySelector("#thread-realtime-status"),
  threadGuardianMethodSelect: document.querySelector("#thread-guardian-method-select"),
  threadGuardianArgumentsInput: document.querySelector("#thread-guardian-arguments-input"),
  threadGuardianPreflightButton: document.querySelector("#thread-guardian-preflight-button"),
  threadGuardianStatus: document.querySelector("#thread-guardian-status"),
  threadRollbackTurnsInput: document.querySelector("#thread-rollback-turns-input"),
  threadRollbackPreflightButton: document.querySelector("#thread-rollback-preflight-button"),
  threadRollbackButton: document.querySelector("#thread-rollback-button"),
  threadRollbackStatus: document.querySelector("#thread-rollback-status"),
  threadSafetyLockPreflightButton: document.querySelector("#thread-safety-lock-preflight-button"),
  threadSafetyLockButton: document.querySelector("#thread-safety-lock-button"),
  threadSafetyLockStatus: document.querySelector("#thread-safety-lock-status"),
  threadDeletePreflightButton: document.querySelector("#thread-delete-preflight-button"),
  threadDeleteButton: document.querySelector("#thread-delete-button"),
  threadDeleteStatus: document.querySelector("#thread-delete-status"),
  threadCompactPreflightButton: document.querySelector("#thread-compact-preflight-button"),
  threadCompactButton: document.querySelector("#thread-compact-button"),
  threadCompactStatus: document.querySelector("#thread-compact-status"),
  threadGoalButton: document.querySelector("#thread-goal-button"),
  threadGoalStatus: document.querySelector("#thread-goal-status"),
  threadTurnsButton: document.querySelector("#thread-turns-button"),
  threadTurnsStatus: document.querySelector("#thread-turns-status"),
  threadTurnItemsInput: document.querySelector("#thread-turn-items-input"),
  threadTurnItemsButton: document.querySelector("#thread-turn-items-button"),
  threadTurnItemsStatus: document.querySelector("#thread-turn-items-status"),
  threadDetailMeta: document.querySelector("#thread-detail-meta"),
  turnTimeline: document.querySelector("#turn-timeline"),
  transcriptButton: document.querySelector("#transcript-button"),
  transcriptThreadText: document.querySelector("#transcript-thread-text"),
  transcriptTurnsText: document.querySelector("#transcript-turns-text"),
  transcriptCharsText: document.querySelector("#transcript-chars-text"),
  transcriptStateText: document.querySelector("#transcript-state-text"),
  transcriptList: document.querySelector("#transcript-list"),
  changesButton: document.querySelector("#changes-button"),
  changesThreadText: document.querySelector("#changes-thread-text"),
  changesItemsText: document.querySelector("#changes-items-text"),
  changesCountText: document.querySelector("#changes-count-text"),
  changesStateText: document.querySelector("#changes-state-text"),
  changesList: document.querySelector("#changes-list"),
  turnForm: document.querySelector("#turn-form"),
  turnInput: document.querySelector("#turn-input"),
  turnButton: document.querySelector("#turn-button"),
  turnStartButton: document.querySelector("#turn-start-button"),
  turnTargetText: document.querySelector("#turn-target-text"),
  turnPreflightStatus: document.querySelector("#turn-preflight-status"),
  turnPreflightGate: document.querySelector("#turn-preflight-gate"),
  turnPreflightChars: document.querySelector("#turn-preflight-chars"),
  turnPreflightLines: document.querySelector("#turn-preflight-lines"),
  turnPreflightTraffic: document.querySelector("#turn-preflight-traffic"),
  executionGateState: document.querySelector("#execution-gate-state"),
  executionEnabledText: document.querySelector("#execution-enabled-text"),
  turnExecutionReadiness: document.querySelector("#turn-execution-readiness"),
  turnExecutionAuthority: document.querySelector("#turn-execution-authority"),
  executionPendingText: document.querySelector("#execution-pending-text"),
  approvalQueueCount: document.querySelector("#approval-queue-count"),
  approvalManagedCount: document.querySelector("#approval-managed-count"),
  approvalSafeDenyCount: document.querySelector("#approval-safe-deny-count"),
  approvalSafeAcceptCount: document.querySelector("#approval-safe-accept-count"),
  approvalPreviewCount: document.querySelector("#approval-preview-count"),
  approvalPolicyText: document.querySelector("#approval-policy-text"),
  approvalScopeText: document.querySelector("#approval-scope-text"),
  approvalForwardDenyText: document.querySelector("#approval-forward-deny-text"),
  approvalAcceptOnceText: document.querySelector("#approval-accept-once-text"),
  approvalKindCount: document.querySelector("#approval-kind-count"),
  approvalRejectedScopeCount: document.querySelector("#approval-rejected-scope-count"),
  executionDecisionsText: document.querySelector("#execution-decisions-text"),
  approvalFilterButtons: Array.from(document.querySelectorAll("[data-approval-filter]")),
  approvalFilterSummary: document.querySelector("#approval-filter-summary"),
  approvalRefreshButton: document.querySelector("#approval-refresh-button"),
  approvalRefreshState: document.querySelector("#approval-refresh-state"),
  approvalAcceptAllButton: document.querySelector("#approval-accept-all-button"),
  approvalDenyAllButton: document.querySelector("#approval-deny-all-button"),
  approvalBulkStatus: document.querySelector("#approval-bulk-status"),
  approvalDetailPanel: document.querySelector("#approval-detail-panel"),
  approvalDetailTitle: document.querySelector("#approval-detail-title"),
  approvalDetailMeta: document.querySelector("#approval-detail-meta"),
  approvalDetailKind: document.querySelector("#approval-detail-kind"),
  approvalDetailRoute: document.querySelector("#approval-detail-route"),
  approvalDetailState: document.querySelector("#approval-detail-state"),
  approvalDetailScope: document.querySelector("#approval-detail-scope"),
  approvalDetailCommand: document.querySelector("#approval-detail-command"),
  approvalDetailFile: document.querySelector("#approval-detail-file"),
  approvalDetailPermissions: document.querySelector("#approval-detail-permissions"),
  approvalDetailChoices: document.querySelector("#approval-detail-choices"),
  approvalDetailAudit: document.querySelector("#approval-detail-audit"),
  approvalDecisionHistoryCount: document.querySelector("#approval-decision-history-count"),
  approvalLifecycleState: document.querySelector("#approval-lifecycle-state"),
  approvalLifecycleResults: document.querySelector("#approval-lifecycle-results"),
  approvalLifecycleLatest: document.querySelector("#approval-lifecycle-latest"),
  approvalQueueActions: document.querySelector("#approval-queue-actions"),
  approvalManagement: document.querySelector("#approval-management"),
  approvalExecutionReadiness: document.querySelector("#approval-execution-readiness"),
  approvalDecisionContract: document.querySelector("#approval-decision-contract"),
  approvalRoutingContract: document.querySelector("#approval-routing-contract"),
  approvalWorkflowContract: document.querySelector("#approval-workflow-contract"),
  approvalSafetyContract: document.querySelector("#approval-safety-contract"),
  approvalAuditContract: document.querySelector("#approval-audit-contract"),
  approvalAuthorityContract: document.querySelector("#approval-authority-contract"),
  approvalInteractionContract: document.querySelector("#approval-interaction-contract"),
  approvalBatchWindow: document.querySelector("#approval-batch-window"),
  threadLifecycleActionHistoryCount: document.querySelector(
    "#thread-lifecycle-action-history-count",
  ),
  executionTrafficText: document.querySelector("#execution-traffic-text"),
  turnSessionCount: document.querySelector("#turn-session-count"),
  turnSessionLifecycleState: document.querySelector("#turn-session-lifecycle-state"),
  turnSessionOperations: document.querySelector("#turn-session-operations"),
  turnSessionManagement: document.querySelector("#turn-session-management"),
  turnSessionReadiness: document.querySelector("#turn-session-readiness"),
  turnSessionRouting: document.querySelector("#turn-session-routing"),
  turnSessionWorkflow: document.querySelector("#turn-session-workflow"),
  turnSessionSafety: document.querySelector("#turn-session-safety"),
  turnSessionAudit: document.querySelector("#turn-session-audit"),
  turnSessionPendingCount: document.querySelector("#turn-session-pending-count"),
  turnSessionApprovalSessions: document.querySelector("#turn-session-approval-sessions"),
  turnSessionEventCount: document.querySelector("#turn-session-event-count"),
  turnSessionModelSessions: document.querySelector("#turn-session-model-sessions"),
  turnSessionDecisionCount: document.querySelector("#turn-session-decision-count"),
  turnSessionWideApproval: document.querySelector("#turn-session-wide-approval"),
  turnSessionApprovalPolicy: document.querySelector("#turn-session-approval-policy"),
  turnSessionRejectedGrants: document.querySelector("#turn-session-rejected-grants"),
  turnSessionManagerState: document.querySelector("#turn-session-manager-state"),
  turnSessionManagerPending: document.querySelector("#turn-session-manager-pending"),
  turnSessionLatestTurn: document.querySelector("#turn-session-latest-turn"),
  turnSessionLatestEvent: document.querySelector("#turn-session-latest-event"),
  approvalQueueList: document.querySelector("#approval-queue-list"),
  approvalDecisionHistoryList: document.querySelector("#approval-decision-history-list"),
  threadLifecycleActionHistoryList: document.querySelector(
    "#thread-lifecycle-action-history-list",
  ),
  turnSessionList: document.querySelector("#turn-session-list"),
  terminalStateText: document.querySelector("#terminal-state-text"),
  terminalSessionsText: document.querySelector("#terminal-sessions-text"),
  terminalLifecycleText: document.querySelector("#terminal-lifecycle-text"),
  terminalWriteText: document.querySelector("#terminal-write-text"),
  terminalResizeText: document.querySelector("#terminal-resize-text"),
  terminalTerminateText: document.querySelector("#terminal-terminate-text"),
  terminalCleanText: document.querySelector("#terminal-clean-text"),
  terminalBackgroundListText: document.querySelector("#terminal-background-list-text"),
  terminalBackgroundTerminateText: document.querySelector("#terminal-background-terminate-text"),
  actionCommandText: document.querySelector("#action-command-text"),
  terminalActionScopeText: document.querySelector("#terminal-action-scope-text"),
  terminalHighRiskCount: document.querySelector("#terminal-high-risk-count"),
  terminalCommandHistoryCount: document.querySelector("#terminal-command-history-count"),
  processSpawnHistoryCount: document.querySelector("#process-spawn-history-count"),
  threadShellCommandHistoryCount: document.querySelector("#thread-shell-command-history-count"),
  terminalControlPreflightHistoryCount: document.querySelector(
    "#terminal-control-preflight-history-count",
  ),
  terminalControlConfirmationHistoryCount: document.querySelector(
    "#terminal-control-confirmation-history-count",
  ),
  actionFileWriteText: document.querySelector("#action-file-write-text"),
  fileActionHistoryCount: document.querySelector("#file-action-history-count"),
  actionDecisionsText: document.querySelector("#action-decisions-text"),
  terminalTrafficText: document.querySelector("#terminal-traffic-text"),
  terminalAuditedText: document.querySelector("#terminal-audited-text"),
  terminalForm: document.querySelector("#terminal-form"),
  terminalInput: document.querySelector("#terminal-input"),
  terminalPreflightButton: document.querySelector("#terminal-preflight-button"),
  terminalCommandButton: document.querySelector("#terminal-command-button"),
  terminalPreflightStatus: document.querySelector("#terminal-preflight-status"),
  terminalCommandChars: document.querySelector("#terminal-command-chars"),
  terminalCommandLines: document.querySelector("#terminal-command-lines"),
  terminalCommandExecution: document.querySelector("#terminal-command-execution"),
  terminalCommandSession: document.querySelector("#terminal-command-session"),
  terminalCommandExit: document.querySelector("#terminal-command-exit"),
  terminalCommandOutput: document.querySelector("#terminal-command-output"),
  processSpawnForm: document.querySelector("#process-spawn-form"),
  processSpawnInput: document.querySelector("#process-spawn-input"),
  processSpawnPreflightButton: document.querySelector("#process-spawn-preflight-button"),
  processSpawnButton: document.querySelector("#process-spawn-button"),
  processSpawnStatus: document.querySelector("#process-spawn-status"),
  processSpawnChars: document.querySelector("#process-spawn-chars"),
  processSpawnArgs: document.querySelector("#process-spawn-args"),
  processSpawnExecution: document.querySelector("#process-spawn-execution"),
  processSpawnExit: document.querySelector("#process-spawn-exit"),
  processSpawnOutput: document.querySelector("#process-spawn-output"),
  processSpawnEnv: document.querySelector("#process-spawn-env"),
  threadShellCommandForm: document.querySelector("#thread-shell-command-form"),
  threadShellCommandThread: document.querySelector("#thread-shell-command-thread"),
  threadShellCommandInput: document.querySelector("#thread-shell-command-input"),
  threadShellCommandPreflightButton: document.querySelector(
    "#thread-shell-command-preflight-button",
  ),
  threadShellCommandButton: document.querySelector("#thread-shell-command-button"),
  threadShellCommandStatus: document.querySelector("#thread-shell-command-status"),
  threadShellCommandThreadText: document.querySelector("#thread-shell-command-thread-text"),
  threadShellCommandChars: document.querySelector("#thread-shell-command-chars"),
  threadShellCommandExecution: document.querySelector("#thread-shell-command-execution"),
  threadShellCommandOutput: document.querySelector("#thread-shell-command-output"),
  terminalControlForm: document.querySelector("#terminal-control-form"),
  terminalControlAction: document.querySelector("#terminal-control-action"),
  terminalControlMethod: document.querySelector("#terminal-control-method"),
  terminalControlSession: document.querySelector("#terminal-control-session"),
  terminalControlRows: document.querySelector("#terminal-control-rows"),
  terminalControlCols: document.querySelector("#terminal-control-cols"),
  terminalControlInput: document.querySelector("#terminal-control-input"),
  terminalControlButton: document.querySelector("#terminal-control-button"),
  terminalControlRunButton: document.querySelector("#terminal-control-run-button"),
  terminalControlStatus: document.querySelector("#terminal-control-status"),
  terminalControlSessionChars: document.querySelector("#terminal-control-session-chars"),
  terminalControlInputChars: document.querySelector("#terminal-control-input-chars"),
  terminalControlDimensions: document.querySelector("#terminal-control-dimensions"),
  terminalControlExecution: document.querySelector("#terminal-control-execution"),
  terminalCleanForm: document.querySelector("#terminal-clean-form"),
  terminalCleanThread: document.querySelector("#terminal-clean-thread"),
  terminalCleanPreflightButton: document.querySelector("#terminal-clean-preflight-button"),
  terminalCleanButton: document.querySelector("#terminal-clean-button"),
  terminalCleanStatus: document.querySelector("#terminal-clean-status"),
  terminalCleanThreadText: document.querySelector("#terminal-clean-thread-text"),
  terminalCleanLoadedText: document.querySelector("#terminal-clean-loaded-text"),
  terminalCleanResultText: document.querySelector("#terminal-clean-result-text"),
  terminalCleanOutputText: document.querySelector("#terminal-clean-output-text"),
  terminalBackgroundListForm: document.querySelector("#terminal-background-list-form"),
  terminalBackgroundListThread: document.querySelector("#terminal-background-list-thread"),
  terminalBackgroundListButton: document.querySelector("#terminal-background-list-button"),
  terminalBackgroundTerminatePreflightButton: document.querySelector(
    "#terminal-background-terminate-preflight-button",
  ),
  terminalBackgroundTerminateButton: document.querySelector(
    "#terminal-background-terminate-button",
  ),
  terminalBackgroundListStatus: document.querySelector("#terminal-background-list-status"),
  terminalBackgroundListThreadText: document.querySelector(
    "#terminal-background-list-thread-text",
  ),
  terminalBackgroundLoadedText: document.querySelector("#terminal-background-loaded-text"),
  terminalBackgroundCountText: document.querySelector("#terminal-background-count-text"),
  terminalBackgroundSelectionText: document.querySelector("#terminal-background-selection-text"),
  terminalBackgroundList: document.querySelector("#terminal-background-list"),
  fsDirectoryForm: document.querySelector("#fs-directory-form"),
  fsDirectoryPath: document.querySelector("#fs-directory-path"),
  fsDirectoryButton: document.querySelector("#fs-directory-button"),
  fsDirectoryStatus: document.querySelector("#fs-directory-status"),
  fsDirectoryEntryCount: document.querySelector("#fs-directory-entry-count"),
  fsDirectoryDirCount: document.querySelector("#fs-directory-dir-count"),
  fsDirectoryFileCount: document.querySelector("#fs-directory-file-count"),
  fsDirectoryTraffic: document.querySelector("#fs-directory-traffic"),
  fsDirectoryList: document.querySelector("#fs-directory-list"),
  fsReadFileForm: document.querySelector("#fs-read-file-form"),
  fsReadFilePath: document.querySelector("#fs-read-file-path"),
  fsReadFileButton: document.querySelector("#fs-read-file-button"),
  fsReadFileStatus: document.querySelector("#fs-read-file-status"),
  fsReadFileDepth: document.querySelector("#fs-read-file-depth"),
  fsReadFileChars: document.querySelector("#fs-read-file-chars"),
  fsReadFileContent: document.querySelector("#fs-read-file-content"),
  fsReadFileTraffic: document.querySelector("#fs-read-file-traffic"),
  fsWatchForm: document.querySelector("#fs-watch-form"),
  fsWatchMethod: document.querySelector("#fs-watch-method"),
  fsWatchPath: document.querySelector("#fs-watch-path"),
  fsWatchId: document.querySelector("#fs-watch-id"),
  fsWatchButton: document.querySelector("#fs-watch-button"),
  fsWatchStatus: document.querySelector("#fs-watch-status"),
  fsWatchDepth: document.querySelector("#fs-watch-depth"),
  fsWatchIdState: document.querySelector("#fs-watch-id-state"),
  fsWatchNotifications: document.querySelector("#fs-watch-notifications"),
  fsWatchTraffic: document.querySelector("#fs-watch-traffic"),
  fuzzyFileSearchForm: document.querySelector("#fuzzy-file-search-form"),
  fuzzyFileSearchMethod: document.querySelector("#fuzzy-file-search-method"),
  fuzzyFileSearchRoots: document.querySelector("#fuzzy-file-search-roots"),
  fuzzyFileSearchQuery: document.querySelector("#fuzzy-file-search-query"),
  fuzzyFileSearchSession: document.querySelector("#fuzzy-file-search-session"),
  fuzzyFileSearchButton: document.querySelector("#fuzzy-file-search-button"),
  fuzzyFileSearchStatus: document.querySelector("#fuzzy-file-search-status"),
  fuzzyFileSearchRootCount: document.querySelector("#fuzzy-file-search-root-count"),
  fuzzyFileSearchQueryChars: document.querySelector("#fuzzy-file-search-query-chars"),
  fuzzyFileSearchSessionState: document.querySelector("#fuzzy-file-search-session-state"),
  fuzzyFileSearchResults: document.querySelector("#fuzzy-file-search-results"),
  fileActionForm: document.querySelector("#file-action-form"),
  fileActionSelect: document.querySelector("#file-action-select"),
  fileActionPath: document.querySelector("#file-action-path"),
  fileActionSource: document.querySelector("#file-action-source"),
  fileActionContent: document.querySelector("#file-action-content"),
  fileActionPreflightButton: document.querySelector("#file-action-preflight-button"),
  fileActionButton: document.querySelector("#file-action-button"),
  fileActionStatus: document.querySelector("#file-action-status"),
  fileActionTarget: document.querySelector("#file-action-target"),
  fileActionChars: document.querySelector("#file-action-chars"),
  fileActionMutation: document.querySelector("#file-action-mutation"),
  fileActionTraffic: document.querySelector("#file-action-traffic"),
  terminalControlPreflightHistoryList: document.querySelector(
    "#terminal-control-preflight-history-list",
  ),
  terminalControlConfirmationHistoryList: document.querySelector(
    "#terminal-control-confirmation-history-list",
  ),
  fileActionHistoryList: document.querySelector("#file-action-history-list"),
  processSpawnHistoryList: document.querySelector("#process-spawn-history-list"),
  threadShellCommandHistoryList: document.querySelector("#thread-shell-command-history-list"),
  terminalCommandHistoryList: document.querySelector("#terminal-command-history-list"),
  terminalMethodList: document.querySelector("#terminal-method-list"),
  streamButton: document.querySelector("#stream-button"),
  streamStatusText: document.querySelector("#stream-status-text"),
  streamEventCount: document.querySelector("#stream-event-count"),
  liveSessionCount: document.querySelector("#live-session-count"),
  liveSessionControlHistoryCount: document.querySelector("#live-session-control-history-count"),
  liveSessionSource: document.querySelector("#live-session-source"),
  liveSessionLifecycleState: document.querySelector("#live-session-lifecycle-state"),
  liveSessionControlGates: document.querySelector("#live-session-control-gates"),
  liveSessionOperations: document.querySelector("#live-session-operations"),
  liveSessionManagement: document.querySelector("#live-session-management"),
  liveSessionReadiness: document.querySelector("#live-session-readiness"),
  liveSessionRouting: document.querySelector("#live-session-routing"),
  liveSessionWorkflow: document.querySelector("#live-session-workflow"),
  liveSessionSafety: document.querySelector("#live-session-safety"),
  liveSessionAudit: document.querySelector("#live-session-audit"),
  liveSessionInteraction: document.querySelector("#live-session-interaction"),
  liveSessionControlBreakdown: document.querySelector("#live-session-control-breakdown"),
  liveSessionControlResultCounts: document.querySelector("#live-session-control-result-counts"),
  liveSessionLatestControl: document.querySelector("#live-session-latest-control"),
  liveSessionTraffic: document.querySelector("#live-session-traffic"),
  liveSessionControlForm: document.querySelector("#live-session-control-form"),
  liveSessionControlAction: document.querySelector("#live-session-control-action"),
  liveSessionControlThread: document.querySelector("#live-session-control-thread"),
  liveSessionControlTurn: document.querySelector("#live-session-control-turn"),
  liveSessionControlPrompt: document.querySelector("#live-session-control-prompt"),
  liveSessionControlPreflightButton: document.querySelector("#live-session-control-preflight-button"),
  liveSessionControlButton: document.querySelector("#live-session-control-button"),
  liveSessionControlStatus: document.querySelector("#live-session-control-status"),
  liveSessionBulkForm: document.querySelector("#live-session-bulk-form"),
  liveSessionBulkPreflightButton: document.querySelector("#live-session-bulk-preflight-button"),
  liveSessionBulkButton: document.querySelector("#live-session-bulk-button"),
  liveSessionBulkStatus: document.querySelector("#live-session-bulk-status"),
  liveSessionControlActionText: document.querySelector("#live-session-control-action-text"),
  liveSessionControlTargetText: document.querySelector("#live-session-control-target-text"),
  liveSessionControlMutationText: document.querySelector("#live-session-control-mutation-text"),
  liveSessionControlMethodsText: document.querySelector("#live-session-control-methods-text"),
  liveSessionControlPromptChars: document.querySelector("#live-session-control-prompt-chars"),
  liveSessionBulkTargetText: document.querySelector("#live-session-bulk-target-text"),
  liveSessionBulkResultText: document.querySelector("#live-session-bulk-result-text"),
  liveSessionBulkMethodsText: document.querySelector("#live-session-bulk-methods-text"),
  liveSessionList: document.querySelector("#live-session-list"),
  streamEventLog: document.querySelector("#stream-event-log"),
  agentButton: document.querySelector("#agent-button"),
  agentGateText: document.querySelector("#agent-gate-text"),
  agentStatusText: document.querySelector("#agent-status-text"),
  agentThreadText: document.querySelector("#agent-thread-text"),
  agentTurnText: document.querySelector("#agent-turn-text"),
  agentEventCount: document.querySelector("#agent-event-count"),
  agentEventLog: document.querySelector("#agent-event-log"),
  errorPanel: document.querySelector("#error-panel"),
  errorText: document.querySelector("#error-text"),
};

const sessionToken =
  document.querySelector('meta[name="codex-app-port-token"]')?.getAttribute("content") ?? "";

let selectedWorkspaceId = null;
let selectedThreadIdSuffix = null;
let selectedThreadArchived = false;
let activeThreadItems = [];
let archivedThreadItems = [];
let lastTurnPreflight = null;
let lastGitBranchPreflight = null;
let lastGitBranchCreatePreflight = null;
let lastGitBranchDeletePreflight = null;
let lastGitCommitPreflight = null;
let lastGitWorktreePreflight = null;
let lastFsReadFilePreflight = null;
let lastFsWatchPreflight = null;
let lastFuzzyFileSearchPreflight = null;
let lastFileActionPreflight = null;
let lastLiveSessionControlPreflight = null;
let lastLiveSessionBulkPreflight = null;
let lastMcpToolPreflight = null;
let lastMcpServerReloadPreflight = null;
let lastMcpOauthPreflight = null;
let lastConfigValuePreflight = null;
let lastConfigBatchPreflight = null;
let lastExperimentalFeaturePreflight = null;
let lastMcpResourcePreflight = null;
let lastPluginContentPreflight = null;
let lastPluginReadPreflight = null;
let lastPluginEnablementPreflight = null;
let lastPluginShareCheckoutPreflight = null;
let lastPluginUninstallPreflight = null;
let lastSkillsConfigPreflight = null;
let lastSkillsExtraRootsClearPreflight = null;
let lastRemoteControlDisablePreflight = null;
let remoteClientRefs = [];
let selectedRemoteClientRef = null;
let lastRemoteClientRevokePreflight = null;
let lastEnvironmentAddPreflight = null;
let lastTerminalCleanPreflight = null;
let lastTerminalBackgroundTerminatePreflight = null;
let selectedTerminalBackgroundRef = null;
let lastTerminalCommandPreflight = null;
let lastProcessSpawnPreflight = null;
let lastThreadShellCommandPreflight = null;
let lastTerminalControlPreflight = null;
let lastThreadStartPreflight = null;
let lastThreadArchivePreflight = null;
let lastThreadForkPreflight = null;
let lastThreadRenamePreflight = null;
let lastThreadGoalSetPreflight = null;
let lastThreadGoalClearPreflight = null;
let lastThreadMemoryModePreflight = null;
let lastThreadMetadataUpdatePreflight = null;
let lastThreadRollbackPreflight = null;
let lastThreadSafetyLockPreflight = null;
let lastThreadDeletePreflight = null;
let lastThreadCompactPreflight = null;
let lastAccountLoginPreflight = null;
let lastAccountLoginCancelPreflight = null;
let lastAccountLoginCancelRef = null;
let lastAccountResetCreditPreflight = null;
let lastAccountLogoutPreflight = null;
let pendingRoute = readInitialRoute();
let streamAbortController = null;
let streamEventCount = 0;
let approvalRefreshTimer = null;
let lastApprovalQueue = [];
let lastApprovalPayload = null;
let approvalQueueFilter = "all";
let selectedApprovalKey = null;

elements.refreshButton.addEventListener("click", () => {
  refreshStatus();
});

elements.workspaceSelect.addEventListener("change", () => {
  selectedWorkspaceId = elements.workspaceSelect.value || null;
  selectedThreadIdSuffix = null;
  selectedThreadArchived = false;
  lastTurnPreflight = null;
  lastGitBranchPreflight = null;
  lastGitBranchCreatePreflight = null;
  lastGitBranchDeletePreflight = null;
  lastGitCommitPreflight = null;
  lastGitWorktreePreflight = null;
  lastFsReadFilePreflight = null;
  lastFileActionPreflight = null;
  lastLiveSessionControlPreflight = null;
  lastLiveSessionBulkPreflight = null;
  lastMcpToolPreflight = null;
  lastMcpServerReloadPreflight = null;
  lastMcpOauthPreflight = null;
  lastConfigValuePreflight = null;
  lastConfigBatchPreflight = null;
  lastExperimentalFeaturePreflight = null;
  lastMcpResourcePreflight = null;
  lastPluginContentPreflight = null;
  lastPluginReadPreflight = null;
  lastPluginEnablementPreflight = null;
  lastPluginShareCheckoutPreflight = null;
  lastPluginUninstallPreflight = null;
  lastSkillsConfigPreflight = null;
  lastSkillsExtraRootsClearPreflight = null;
  lastRemoteControlDisablePreflight = null;
  remoteClientRefs = [];
  selectedRemoteClientRef = null;
  lastRemoteClientRevokePreflight = null;
  renderRemoteClientRefs([]);
  lastEnvironmentAddPreflight = null;
  lastTerminalCleanPreflight = null;
  lastTerminalBackgroundTerminatePreflight = null;
  selectedTerminalBackgroundRef = null;
  lastTerminalCommandPreflight = null;
  lastProcessSpawnPreflight = null;
  lastThreadShellCommandPreflight = null;
  lastTerminalControlPreflight = null;
  lastThreadStartPreflight = null;
  lastThreadArchivePreflight = null;
  lastThreadForkPreflight = null;
  lastThreadRenamePreflight = null;
  lastThreadGoalSetPreflight = null;
  lastThreadGoalClearPreflight = null;
  lastThreadMemoryModePreflight = null;
  lastThreadMetadataUpdatePreflight = null;
  lastThreadRollbackPreflight = null;
  lastThreadSafetyLockPreflight = null;
  lastThreadDeletePreflight = null;
  lastThreadCompactPreflight = null;
  lastAccountLoginPreflight = null;
  lastAccountLoginCancelPreflight = null;
  lastAccountLoginCancelRef = null;
  lastAccountResetCreditPreflight = null;
  lastAccountLogoutPreflight = null;
  lastApprovalPayload = null;
  lastApprovalQueue = [];
  approvalQueueFilter = "all";
  selectedApprovalKey = null;
  elements.fsReadFileStatus.textContent = "Blocked";
  elements.fsReadFileDepth.textContent = "0";
  elements.fsReadFileChars.textContent = "0";
  elements.fsReadFileContent.textContent = "Hidden";
  elements.fsReadFileTraffic.textContent = "None";
  lastFsWatchPreflight = null;
  elements.fsWatchStatus.textContent = "Blocked";
  elements.fsWatchDepth.textContent = "0";
  elements.fsWatchIdState.textContent = "Hidden";
  elements.fsWatchNotifications.textContent = "Off";
  elements.fsWatchTraffic.textContent = "None";
  lastFuzzyFileSearchPreflight = null;
  elements.fuzzyFileSearchStatus.textContent = "Blocked";
  elements.fuzzyFileSearchRootCount.textContent = "0";
  elements.fuzzyFileSearchQueryChars.textContent = "0";
  elements.fuzzyFileSearchSessionState.textContent = "Hidden";
  elements.fuzzyFileSearchResults.textContent = "Hidden";
  elements.fileActionButton.disabled = true;
  elements.liveSessionControlButton.disabled = true;
  elements.liveSessionBulkButton.disabled = true;
  elements.mcpToolRunButton.disabled = true;
  elements.mcpServerReloadButton.disabled = true;
  elements.mcpOauthRunButton.disabled = true;
  elements.configValueRunButton.disabled = true;
  elements.configBatchRunButton.disabled = true;
  elements.experimentalFeatureRunButton.disabled = true;
  elements.mcpResourceRunButton.disabled = true;
  elements.pluginContentRunButton.disabled = true;
  elements.pluginReadRunButton.disabled = true;
  elements.pluginUninstallRunButton.disabled = true;
  elements.pluginShareCheckoutRunButton.disabled = true;
  elements.skillsConfigRunButton.disabled = true;
  elements.skillsExtraRootsClearButton.disabled = true;
  elements.remoteControlDisableButton.disabled = true;
  elements.remoteClientRevokePreflightButton.disabled = true;
  elements.remoteClientRevokeButton.disabled = true;
  elements.environmentAddRunButton.disabled = true;
  elements.terminalCleanButton.disabled = true;
  elements.terminalBackgroundTerminatePreflightButton.disabled = true;
  elements.terminalBackgroundTerminateButton.disabled = true;
  elements.terminalCommandButton.disabled = true;
  elements.processSpawnButton.disabled = true;
  elements.threadShellCommandButton.disabled = true;
  elements.terminalControlRunButton.disabled = true;
  elements.threadStartButton.disabled = true;
  elements.threadArchiveButton.disabled = true;
  elements.threadRenameButton.disabled = true;
  elements.threadRollbackButton.disabled = true;
  elements.threadSafetyLockButton.disabled = true;
  elements.threadCompactButton.disabled = true;
  elements.accountLoginButton.disabled = true;
  elements.accountLoginCancelPreflightButton.disabled = true;
  elements.accountLoginCancelButton.disabled = true;
  elements.accountResetCreditButton.disabled = true;
  elements.accountLogoutButton.disabled = true;
  lastGitWorktreePreflight = null;
  lastThreadRenamePreflight = null;
  lastThreadRollbackPreflight = null;
  lastThreadSafetyLockPreflight = null;
  clearThreadDetail();
  clearGitWorktree();
  stopEventStream();
  stopApprovalPolling();
  refreshStatus();
});

elements.streamButton.addEventListener("click", () => {
  if (streamAbortController) {
    stopEventStream();
  } else {
    startEventStream();
  }
});

elements.liveSessionControlForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runLiveSessionControlPreflight();
});

for (const input of [
  elements.liveSessionControlAction,
  elements.liveSessionControlThread,
  elements.liveSessionControlTurn,
  elements.liveSessionControlPrompt,
]) {
  const resetLiveSessionControlPreflight = () => {
    lastLiveSessionControlPreflight = null;
    elements.liveSessionControlButton.disabled = true;
  };
  input.addEventListener("input", resetLiveSessionControlPreflight);
  input.addEventListener("change", resetLiveSessionControlPreflight);
}

elements.liveSessionControlButton.addEventListener("click", () => {
  runLiveSessionControl();
});

elements.liveSessionBulkForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runLiveSessionBulkPreflight();
});

elements.liveSessionBulkButton.addEventListener("click", () => {
  runLiveSessionBulkControl();
});

elements.gitButton.addEventListener("click", () => {
  refreshGitWorktree();
});

elements.gitSwitchButton.addEventListener("click", () => {
  runGitBranchSwitch();
});

elements.gitDeleteButton.addEventListener("click", () => {
  runGitBranchDelete();
});

elements.gitCreateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runGitBranchCreatePreflight();
});

elements.gitCreateInput.addEventListener("input", () => {
  lastGitBranchCreatePreflight = null;
  elements.gitCreateButton.disabled = true;
});

elements.gitCreateButton.addEventListener("click", () => {
  runGitBranchCreate();
});

elements.gitCommitForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runGitCommitPreflight();
});

elements.gitCommitInput.addEventListener("input", () => {
  lastGitCommitPreflight = null;
  elements.gitCommitButton.disabled = true;
});

elements.gitCommitButton.addEventListener("click", () => {
  runGitCommit();
});

elements.gitWorktreeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runGitWorktreePreflight();
});

for (const input of [elements.gitWorktreeAction, elements.gitWorktreePath, elements.gitWorktreeBranch]) {
  input.addEventListener("input", () => {
    lastGitWorktreePreflight = null;
    elements.gitWorktreeButton.disabled = true;
  });
}

elements.gitWorktreeButton.addEventListener("click", () => {
  runGitWorktreeAction();
});

elements.threadSearch.addEventListener("input", () => {
  renderThreadRows();
});

elements.threadServerSearchButton.addEventListener("click", () => {
  runThreadServerSearch();
});

elements.archivedToggle.addEventListener("change", () => {
  renderThreadRows();
});

elements.threadStartPreflightButton.addEventListener("click", () => {
  runThreadStartPreflight();
});

elements.threadStartButton.addEventListener("click", () => {
  runThreadStart();
});

elements.threadArchivePreflightButton.addEventListener("click", () => {
  runThreadArchivePreflight();
});

elements.threadArchiveButton.addEventListener("click", () => {
  runThreadArchiveAction();
});

elements.threadForkPreflightButton.addEventListener("click", () => {
  runThreadForkPreflight();
});

elements.threadForkButton.addEventListener("click", () => {
  runThreadForkAction();
});

elements.threadRenameInput.addEventListener("input", () => {
  lastThreadRenamePreflight = null;
  updateThreadRenameState();
});

elements.threadRenamePreflightButton.addEventListener("click", () => {
  runThreadRenamePreflight();
});

elements.threadRenameButton.addEventListener("click", () => {
  runThreadRenameAction();
});

elements.threadGoalObjectiveInput.addEventListener("input", () => {
  lastThreadGoalSetPreflight = null;
  updateThreadGoalMutationState();
});

elements.threadGoalStatusSelect.addEventListener("change", () => {
  lastThreadGoalSetPreflight = null;
  updateThreadGoalMutationState();
});

elements.threadGoalBudgetInput.addEventListener("input", () => {
  lastThreadGoalSetPreflight = null;
  updateThreadGoalMutationState();
});

elements.threadGoalSetPreflightButton.addEventListener("click", () => {
  runThreadGoalSetPreflight();
});

elements.threadGoalSetButton.addEventListener("click", () => {
  runThreadGoalSetAction();
});

elements.threadGoalClearPreflightButton.addEventListener("click", () => {
  runThreadGoalClearPreflight();
});

elements.threadGoalClearButton.addEventListener("click", () => {
  runThreadGoalClearAction();
});

elements.threadMemoryModeSelect.addEventListener("change", () => {
  lastThreadMemoryModePreflight = null;
  updateThreadMemoryModeState();
});

elements.threadMemoryModePreflightButton.addEventListener("click", () => {
  runThreadMemoryModePreflight();
});

elements.threadMemoryModeButton.addEventListener("click", () => {
  runThreadMemoryModeAction();
});

elements.threadMetadataArgumentsInput.addEventListener("input", () => {
  lastThreadMetadataUpdatePreflight = null;
  updateThreadMetadataUpdateState();
});

elements.threadMetadataUpdatePreflightButton.addEventListener("click", () => {
  runThreadMetadataUpdatePreflight();
});

for (const input of [
  elements.threadResumeInjectMethodSelect,
  elements.threadResumeInjectArgumentsInput,
]) {
  input.addEventListener("input", () => {
    updateThreadResumeInjectState();
  });
  input.addEventListener("change", () => {
    updateThreadResumeInjectState();
  });
}

elements.threadResumeInjectPreflightButton.addEventListener("click", () => {
  runThreadResumeInjectPreflight();
});

for (const input of [
  elements.threadRealtimeMethodSelect,
  elements.threadRealtimeArgumentsInput,
]) {
  input.addEventListener("input", () => {
    updateThreadRealtimeState();
  });
  input.addEventListener("change", () => {
    updateThreadRealtimeState();
  });
}

elements.threadRealtimePreflightButton.addEventListener("click", () => {
  runThreadRealtimePreflight();
});

for (const input of [
  elements.threadGuardianMethodSelect,
  elements.threadGuardianArgumentsInput,
]) {
  input.addEventListener("input", () => {
    updateThreadGuardianState();
  });
  input.addEventListener("change", () => {
    updateThreadGuardianState();
  });
}

elements.threadGuardianPreflightButton.addEventListener("click", () => {
  runThreadGuardianPreflight();
});

elements.threadRollbackTurnsInput.addEventListener("input", () => {
  lastThreadRollbackPreflight = null;
  updateThreadRollbackState();
});

elements.threadRollbackPreflightButton.addEventListener("click", () => {
  runThreadRollbackPreflight();
});

elements.threadRollbackButton.addEventListener("click", () => {
  runThreadRollbackAction();
});

elements.threadSafetyLockPreflightButton.addEventListener("click", () => {
  runThreadSafetyLockPreflight();
});

elements.threadSafetyLockButton.addEventListener("click", () => {
  runThreadSafetyLockAction();
});

elements.threadDeletePreflightButton.addEventListener("click", () => {
  runThreadDeletePreflight();
});

elements.threadDeleteButton.addEventListener("click", () => {
  runThreadDeleteAction();
});

elements.threadCompactPreflightButton.addEventListener("click", () => {
  runThreadCompactPreflight();
});

elements.threadCompactButton.addEventListener("click", () => {
  runThreadCompactStart();
});

elements.threadGoalButton.addEventListener("click", () => {
  loadThreadGoal();
});

elements.threadTurnsButton.addEventListener("click", () => {
  loadThreadTurns();
});

elements.threadTurnItemsButton.addEventListener("click", () => {
  loadThreadTurnItems();
});

elements.turnForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runTurnPreflight();
});

elements.turnInput.addEventListener("input", () => {
  lastTurnPreflight = null;
});

elements.turnStartButton.addEventListener("click", () => {
  runTurnStart();
});

elements.approvalDenyAllButton.addEventListener("click", () => {
  denyPendingApprovalQueue();
});

elements.approvalAcceptAllButton.addEventListener("click", () => {
  acceptPendingApprovalQueue();
});

elements.approvalRefreshButton.addEventListener("click", () => {
  manualRefreshApprovalDecisions();
});

for (const button of elements.approvalFilterButtons) {
  button.addEventListener("click", () => {
    approvalQueueFilter = button.dataset.approvalFilter || "all";
    if (lastApprovalPayload) {
      renderApprovalDecisions(lastApprovalPayload);
    }
  });
}

elements.transcriptButton.addEventListener("click", () => {
  loadThreadTranscript();
});

elements.changesButton.addEventListener("click", () => {
  loadThreadChanges();
});

elements.agentButton.addEventListener("click", () => {
  runAgentTurnProbe();
});

elements.terminalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runTerminalCommandPreflight();
});

elements.terminalInput.addEventListener("input", () => {
  lastTerminalCommandPreflight = null;
  elements.terminalCommandButton.disabled = true;
});

elements.terminalCommandButton.addEventListener("click", () => {
  runTerminalCommand();
});

elements.processSpawnForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runProcessSpawnPreflight();
});

elements.processSpawnInput.addEventListener("input", () => {
  lastProcessSpawnPreflight = null;
  elements.processSpawnButton.disabled = true;
});

elements.processSpawnButton.addEventListener("click", () => {
  runProcessSpawn();
});

elements.threadShellCommandForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runThreadShellCommandPreflight();
});

for (const input of [elements.threadShellCommandThread, elements.threadShellCommandInput]) {
  input.addEventListener("input", () => {
    lastThreadShellCommandPreflight = null;
    elements.threadShellCommandButton.disabled = true;
  });
}

elements.threadShellCommandButton.addEventListener("click", () => {
  runThreadShellCommand();
});

elements.terminalControlForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runTerminalControlPreflight();
});

elements.terminalControlAction.addEventListener("change", () => {
  syncTerminalControlMethodOptions();
  resetTerminalControlPreflight();
});
syncTerminalControlMethodOptions();

for (const input of [
  elements.terminalControlMethod,
  elements.terminalControlSession,
  elements.terminalControlRows,
  elements.terminalControlCols,
  elements.terminalControlInput,
]) {
  input.addEventListener("input", resetTerminalControlPreflight);
}

elements.terminalControlRunButton.addEventListener("click", () => {
  runTerminalControl();
});

elements.terminalCleanForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runTerminalCleanPreflight();
});

elements.terminalCleanThread.addEventListener("input", () => {
  lastTerminalCleanPreflight = null;
  elements.terminalCleanButton.disabled = true;
});

elements.terminalCleanButton.addEventListener("click", () => {
  runTerminalClean();
});

elements.terminalBackgroundListForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runTerminalBackgroundList();
});

elements.terminalBackgroundListThread.addEventListener("input", () => {
  resetTerminalBackgroundSelection();
});

elements.terminalBackgroundTerminatePreflightButton.addEventListener("click", () => {
  runTerminalBackgroundTerminatePreflight();
});

elements.terminalBackgroundTerminateButton.addEventListener("click", () => {
  runTerminalBackgroundTerminate();
});

elements.fsDirectoryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loadFsDirectory();
});

elements.fsReadFileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runFsReadFilePreflight();
});

elements.fsWatchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runFsWatchPreflight();
});

elements.fuzzyFileSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runFuzzyFileSearchPreflight();
});

elements.fileActionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runFileActionPreflight();
});

elements.fsReadFilePath.addEventListener("input", () => {
  lastFsReadFilePreflight = null;
  elements.fsReadFileStatus.textContent = "Blocked";
});

for (const input of [elements.fsWatchMethod, elements.fsWatchPath, elements.fsWatchId]) {
  input.addEventListener("input", () => {
    lastFsWatchPreflight = null;
    elements.fsWatchStatus.textContent = "Blocked";
    elements.fsWatchNotifications.textContent = "Off";
  });
}

for (const input of [
  elements.fuzzyFileSearchMethod,
  elements.fuzzyFileSearchRoots,
  elements.fuzzyFileSearchQuery,
  elements.fuzzyFileSearchSession,
]) {
  input.addEventListener("input", () => {
    lastFuzzyFileSearchPreflight = null;
    elements.fuzzyFileSearchStatus.textContent = "Blocked";
    elements.fuzzyFileSearchResults.textContent = "Hidden";
  });
}

for (const input of [
  elements.fileActionSelect,
  elements.fileActionPath,
  elements.fileActionSource,
  elements.fileActionContent,
]) {
  input.addEventListener("input", () => {
    lastFileActionPreflight = null;
    elements.fileActionButton.disabled = true;
  });
}

elements.fileActionButton.addEventListener("click", () => {
  runFileAction();
});

elements.settingsRefreshButton.addEventListener("click", () => {
  manualRefreshSettingsIntegrations();
});

elements.realtimeVoicesButton.addEventListener("click", () => {
  loadThreadRealtimeVoices();
});

elements.mcpToolForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runMcpToolPreflight();
});

for (const input of [
  elements.mcpServerInput,
  elements.mcpToolInput,
  elements.mcpToolThreadInput,
  elements.mcpArgumentsInput,
]) {
  input.addEventListener("input", () => {
    lastMcpToolPreflight = null;
    elements.mcpToolRunButton.disabled = true;
  });
}

elements.mcpToolRunButton.addEventListener("click", () => {
  runMcpToolCall();
});

elements.mcpResourceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runMcpResourcePreflight();
});

for (const input of [elements.mcpResourceServerInput, elements.mcpResourceInput]) {
  input.addEventListener("input", () => {
    lastMcpResourcePreflight = null;
    elements.mcpResourceRunButton.disabled = true;
  });
}

elements.mcpResourceRunButton.addEventListener("click", () => {
  runMcpResourceRead();
});

for (const input of [elements.pluginReadTargetInput, elements.pluginReadArgumentsInput]) {
  input.addEventListener("input", () => {
    lastPluginReadPreflight = null;
    elements.pluginReadRunButton.disabled = true;
  });
}

elements.pluginReadForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runPluginReadPreflight();
});

elements.pluginReadRunButton.addEventListener("click", () => {
  runPluginRead();
});

for (const input of [elements.pluginInstallTargetInput, elements.pluginInstallArgumentsInput]) {
  input.addEventListener("input", () => {
    elements.pluginInstallStatus.textContent = "Blocked";
    elements.pluginInstallText.textContent = "Blocked";
    elements.pluginInstallProvenanceText.textContent = "Required";
  });
}

elements.pluginInstallForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runPluginInstallPreflight();
});

elements.marketplaceActionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runMarketplaceActionPreflight();
});

for (const input of [
  elements.marketplaceMethodSelect,
  elements.marketplaceTargetInput,
  elements.marketplaceArgumentsInput,
]) {
  input.addEventListener("input", () => {
    elements.marketplaceActionStatus.textContent = "Blocked";
    elements.marketplaceMutationText.textContent = "Blocked";
    elements.marketplaceSourceText.textContent = "Hidden";
  });
  input.addEventListener("change", () => {
    elements.marketplaceActionStatus.textContent = "Blocked";
    elements.marketplaceMutationText.textContent = "Blocked";
    elements.marketplaceSourceText.textContent = "Hidden";
  });
}

elements.pluginUninstallForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runPluginUninstallPreflight();
});

elements.pluginUninstallTargetInput.addEventListener("input", () => {
  lastPluginUninstallPreflight = null;
  elements.pluginUninstallRunButton.disabled = true;
});

elements.pluginUninstallRunButton.addEventListener("click", () => {
  runPluginUninstall();
});

elements.pluginEnablementForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runPluginEnablementPreflight();
});

for (const input of [
  elements.pluginEnablementTargetInput,
  elements.pluginEnablementEnabledSelect,
]) {
  input.addEventListener("input", () => {
    lastPluginEnablementPreflight = null;
    elements.pluginEnablementRunButton.disabled = true;
  });
  input.addEventListener("change", () => {
    lastPluginEnablementPreflight = null;
    elements.pluginEnablementRunButton.disabled = true;
  });
}

elements.pluginEnablementRunButton.addEventListener("click", () => {
  runPluginEnablementSet();
});

elements.pluginShareCheckoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runPluginShareCheckoutPreflight();
});

elements.pluginShareCheckoutTargetInput.addEventListener("input", () => {
  lastPluginShareCheckoutPreflight = null;
  elements.pluginShareCheckoutRunButton.disabled = true;
});

elements.pluginShareCheckoutRunButton.addEventListener("click", () => {
  runPluginShareCheckout();
});

elements.pluginShareActionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runPluginShareActionPreflight();
});

for (const input of [
  elements.pluginShareActionMethodSelect,
  elements.pluginShareActionTargetInput,
  elements.pluginShareActionArgumentsInput,
]) {
  input.addEventListener("input", () => {
    elements.pluginShareActionStatus.textContent = "Blocked";
    elements.pluginShareActionText.textContent = "Blocked";
    elements.pluginShareActionTargetsText.textContent = "Hidden";
  });
  input.addEventListener("change", () => {
    elements.pluginShareActionStatus.textContent = "Blocked";
    elements.pluginShareActionText.textContent = "Blocked";
    elements.pluginShareActionTargetsText.textContent = "Hidden";
  });
}

elements.pluginContentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runPluginContentPreflight();
});

for (const input of [
  elements.pluginContentMethodSelect,
  elements.pluginContentTargetInput,
  elements.pluginContentArgumentsInput,
]) {
  input.addEventListener("input", () => {
    lastPluginContentPreflight = null;
    elements.pluginContentRunButton.disabled = true;
  });
  input.addEventListener("change", () => {
    lastPluginContentPreflight = null;
    elements.pluginContentRunButton.disabled = true;
  });
}

elements.pluginContentRunButton.addEventListener("click", () => {
  runPluginContentRead();
});

elements.skillsConfigForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runSkillsConfigPreflight();
});

for (const input of [elements.skillsConfigTargetInput, elements.skillsConfigArgumentsInput]) {
  input.addEventListener("input", () => {
    lastSkillsConfigPreflight = null;
    elements.skillsConfigRunButton.disabled = true;
  });
}

elements.skillsConfigRunButton.addEventListener("click", () => {
  runSkillsConfigWrite();
});

elements.skillsExtraRootsClearPreflightButton.addEventListener("click", () => {
  runSkillsExtraRootsClearPreflight();
});

elements.skillsExtraRootsClearButton.addEventListener("click", () => {
  runSkillsExtraRootsClear();
});

elements.remoteControlEnablePreflightButton.addEventListener("click", () => {
  runRemoteControlEnablePreflight();
});

elements.remoteControlEnableArgumentsInput.addEventListener("input", () => {
  elements.remoteControlEnableStatus.textContent = "Blocked";
  elements.remoteControlEnableEphemeralText.textContent = "Unknown";
  elements.remoteControlEnableIdentityText.textContent = "Hidden";
});

elements.remoteControlPairingPreflightButton.addEventListener("click", () => {
  runRemoteControlPairingPreflight();
});

elements.remoteControlPairingMethodSelect.addEventListener("change", () => {
  elements.remoteControlPairingStatus.textContent = "Blocked";
  elements.remoteControlPairingCodeText.textContent = "Hidden";
  elements.remoteControlPairingClaimText.textContent = "Hidden";
});

elements.remoteControlPairingArgumentsInput.addEventListener("input", () => {
  elements.remoteControlPairingStatus.textContent = "Blocked";
  elements.remoteControlPairingCodeText.textContent = "Hidden";
  elements.remoteControlPairingClaimText.textContent = "Hidden";
});

elements.remoteControlDisablePreflightButton.addEventListener("click", () => {
  runRemoteControlDisablePreflight();
});

elements.remoteControlDisableButton.addEventListener("click", () => {
  runRemoteControlDisable();
});

elements.remoteClientsListButton.addEventListener("click", () => {
  runRemoteControlClientsList();
});

elements.remoteClientSelect.addEventListener("change", () => {
  selectedRemoteClientRef = elements.remoteClientSelect.value || null;
  lastRemoteClientRevokePreflight = null;
  elements.remoteClientRevokePreflightButton.disabled = !selectedRemoteClientRef;
  elements.remoteClientRevokeButton.disabled = true;
  elements.remoteClientRevokeText.textContent = selectedRemoteClientRef ? "Check required" : "Blocked";
});

elements.remoteClientRevokePreflightButton.addEventListener("click", () => {
  runRemoteControlClientRevokePreflight();
});

elements.remoteClientRevokeButton.addEventListener("click", () => {
  runRemoteControlClientRevoke();
});

elements.environmentAddForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runEnvironmentAddPreflight();
});

for (const input of [elements.environmentAddIdInput, elements.environmentAddUrlInput]) {
  input.addEventListener("input", () => {
    lastEnvironmentAddPreflight = null;
    elements.environmentAddRunButton.disabled = true;
  });
}

elements.environmentAddRunButton.addEventListener("click", () => {
  runEnvironmentAdd();
});

elements.configValueForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runConfigValuePreflight();
});

for (const input of [
  elements.configValueKeyInput,
  elements.configValueInput,
  elements.configValueMergeSelect,
]) {
  input.addEventListener("input", () => {
    lastConfigValuePreflight = null;
    elements.configValueRunButton.disabled = true;
  });
  input.addEventListener("change", () => {
    lastConfigValuePreflight = null;
    elements.configValueRunButton.disabled = true;
  });
}

elements.configValueRunButton.addEventListener("click", () => {
  runConfigValueWrite();
});

elements.configBatchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runConfigBatchPreflight();
});

elements.configBatchInput.addEventListener("input", () => {
  lastConfigBatchPreflight = null;
  elements.configBatchRunButton.disabled = true;
});

elements.configBatchRunButton.addEventListener("click", () => {
  runConfigBatchWrite();
});

elements.experimentalFeatureForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runExperimentalFeaturePreflight();
});

for (const input of [
  elements.experimentalFeatureInput,
  elements.experimentalFeatureEnabledSelect,
]) {
  input.addEventListener("input", () => {
    lastExperimentalFeaturePreflight = null;
    elements.experimentalFeatureRunButton.disabled = true;
  });
  input.addEventListener("change", () => {
    lastExperimentalFeaturePreflight = null;
    elements.experimentalFeatureRunButton.disabled = true;
  });
}

elements.experimentalFeatureRunButton.addEventListener("click", () => {
  runExperimentalFeatureSet();
});

elements.integrationActionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runIntegrationActionPreflight();
});

elements.externalConfigImportForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runExternalConfigImportPreflight();
});

elements.reviewFeedbackForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runReviewFeedbackPreflight();
});

elements.memoryResetPreflightButton.addEventListener("click", () => {
  runMemoryResetPreflight();
});

for (const input of [
  elements.reviewFeedbackMethodSelect,
  elements.reviewFeedbackTargetInput,
  elements.reviewFeedbackArgumentsInput,
]) {
  input.addEventListener("input", () => {
    elements.reviewFeedbackStatus.textContent = "Blocked";
    elements.reviewFeedbackReviewText.textContent = "Blocked";
    elements.reviewFeedbackLogsText.textContent = "Hidden";
  });
  input.addEventListener("change", () => {
    elements.reviewFeedbackStatus.textContent = "Blocked";
    elements.reviewFeedbackReviewText.textContent = "Blocked";
    elements.reviewFeedbackLogsText.textContent = "Hidden";
  });
}

elements.accountLoginPreflightButton.addEventListener("click", () => {
  runAccountLoginPreflight();
});

elements.accountLoginButton.addEventListener("click", () => {
  runAccountLogin();
});

elements.accountLoginCancelPreflightButton.addEventListener("click", () => {
  runAccountLoginCancelPreflight();
});

elements.accountLoginCancelButton.addEventListener("click", () => {
  runAccountLoginCancel();
});

elements.accountResetCreditPreflightButton.addEventListener("click", () => {
  runAccountResetCreditPreflight();
});

elements.accountResetCreditButton.addEventListener("click", () => {
  runAccountResetCredit();
});

elements.accountLogoutPreflightButton.addEventListener("click", () => {
  runAccountLogoutPreflight();
});

elements.accountLogoutButton.addEventListener("click", () => {
  runAccountLogout();
});

elements.mcpServerReloadPreflightButton.addEventListener("click", () => {
  runMcpServerReloadPreflight();
});

elements.mcpServerReloadButton.addEventListener("click", () => {
  runMcpServerReload();
});

elements.mcpOauthForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runMcpOauthPreflight();
});

elements.mcpOauthServerInput.addEventListener("input", () => {
  lastMcpOauthPreflight = null;
  elements.mcpOauthRunButton.disabled = true;
});

elements.mcpOauthRunButton.addEventListener("click", () => {
  runMcpOauthLogin();
});

initialize();

async function initialize() {
  setLoading(true);
  hideError();

  try {
    await refreshWorkspaces();
    await refreshStatus({ manageLoading: false });
  } catch (error) {
    renderError(error);
  } finally {
    setLoading(false);
  }
}

async function refreshWorkspaces() {
  const response = await fetch("/api/workspaces", {
    method: "GET",
    headers: apiHeaders(),
    cache: "no-store",
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `HTTP ${response.status}`);
  }

  renderWorkspaces(payload.workspaces ?? []);
}

async function refreshStatus({ manageLoading = true } = {}) {
  if (manageLoading) {
    setLoading(true);
  }
  hideError();

  try {
    const response = await fetch(statusEndpoint(), {
      method: "GET",
      headers: apiHeaders(),
      cache: "no-store",
    });

    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }

    renderStatus(payload);
    await refreshExecutionGate();
    await refreshApprovalDecisions();
    await refreshTurnSessions();
    await refreshSettingsIntegrations();
    await refreshTerminalActions();
    await refreshLiveSessions();
    await refreshGitWorktree({ manageLoading: false });
  } catch (error) {
    renderError(error);
  } finally {
    if (manageLoading) {
      setLoading(false);
    }
  }
}

function statusEndpoint() {
  if (!selectedWorkspaceId) {
    return "/api/status";
  }

  const params = new URLSearchParams();
  params.set("workspace", selectedWorkspaceId);
  return `/api/status?${params.toString()}`;
}

function threadStartPreflightEndpoint() {
  return "/api/thread-start-preflight";
}

function threadStartEndpoint() {
  return "/api/thread-start";
}

function threadArchivePreflightEndpoint() {
  return "/api/thread-archive-preflight";
}

function threadArchiveEndpoint() {
  return "/api/thread-archive-action";
}

function threadForkPreflightEndpoint() {
  return "/api/thread-fork-preflight";
}

function threadForkEndpoint() {
  return "/api/thread-fork-action";
}

function threadRenamePreflightEndpoint() {
  return "/api/thread-rename-preflight";
}

function threadRenameEndpoint() {
  return "/api/thread-rename-action";
}

function threadGoalSetPreflightEndpoint() {
  return "/api/thread-goal-set-preflight";
}

function threadGoalSetEndpoint() {
  return "/api/thread-goal-set-action";
}

function threadGoalClearPreflightEndpoint() {
  return "/api/thread-goal-clear-preflight";
}

function threadGoalClearEndpoint() {
  return "/api/thread-goal-clear-action";
}

function threadMemoryModePreflightEndpoint() {
  return "/api/thread-memory-mode-set-preflight";
}

function threadMemoryModeEndpoint() {
  return "/api/thread-memory-mode-set-action";
}

function threadMetadataUpdatePreflightEndpoint() {
  return "/api/thread-metadata-update-preflight";
}

function threadResumeInjectPreflightEndpoint() {
  return "/api/thread-resume-inject-preflight";
}

function threadRealtimePreflightEndpoint() {
  return "/api/thread-realtime-preflight";
}

function threadGuardianPreflightEndpoint() {
  return "/api/thread-guardian-preflight";
}

function threadRollbackPreflightEndpoint() {
  return "/api/thread-rollback-preflight";
}

function threadRollbackEndpoint() {
  return "/api/thread-rollback-action";
}

function threadSafetyLockPreflightEndpoint() {
  return "/api/thread-safety-lock-preflight";
}

function threadSafetyLockEndpoint() {
  return "/api/thread-safety-lock-action";
}

function threadDeletePreflightEndpoint() {
  return "/api/thread-delete-preflight";
}

function threadDeleteEndpoint() {
  return "/api/thread-delete-action";
}

function threadCompactPreflightEndpoint() {
  return "/api/thread-compact-preflight";
}

function threadCompactEndpoint() {
  return "/api/thread-compact-start";
}

function executionGateEndpoint() {
  if (!selectedWorkspaceId) {
    return "/api/execution-gate";
  }

  const params = new URLSearchParams();
  params.set("workspace", selectedWorkspaceId);
  return `/api/execution-gate?${params.toString()}`;
}

function turnSessionsEndpoint() {
  if (!selectedWorkspaceId) {
    return "/api/turn-sessions";
  }

  const params = new URLSearchParams();
  params.set("workspace", selectedWorkspaceId);
  return `/api/turn-sessions?${params.toString()}`;
}

function approvalDecisionsEndpoint() {
  if (!selectedWorkspaceId) {
    return "/api/approval-decisions";
  }

  const params = new URLSearchParams();
  params.set("workspace", selectedWorkspaceId);
  return `/api/approval-decisions?${params.toString()}`;
}

function settingsIntegrationsEndpoint() {
  if (!selectedWorkspaceId) {
    return "/api/settings-integrations";
  }

  const params = new URLSearchParams();
  params.set("workspace", selectedWorkspaceId);
  return `/api/settings-integrations?${params.toString()}`;
}

function threadRealtimeVoicesEndpoint() {
  if (!selectedWorkspaceId) {
    return "/api/thread-realtime-voices";
  }

  const params = new URLSearchParams();
  params.set("workspace", selectedWorkspaceId);
  return `/api/thread-realtime-voices?${params.toString()}`;
}

function mcpToolPreflightEndpoint() {
  return "/api/mcp-tool-preflight";
}

function mcpToolCallEndpoint() {
  return "/api/mcp-tool-call";
}

function mcpResourcePreflightEndpoint() {
  return "/api/mcp-resource-preflight";
}

function mcpResourceReadEndpoint() {
  return "/api/mcp-resource-read";
}

function pluginReadPreflightEndpoint() {
  return "/api/plugin-read-preflight";
}

function pluginReadEndpoint() {
  return "/api/plugin-read";
}

function pluginInstallPreflightEndpoint() {
  return "/api/plugin-install-preflight";
}

function marketplaceActionPreflightEndpoint() {
  return "/api/marketplace-action-preflight";
}

function pluginUninstallPreflightEndpoint() {
  return "/api/plugin-uninstall-preflight";
}

function pluginUninstallEndpoint() {
  return "/api/plugin-uninstall";
}

function pluginEnablementPreflightEndpoint() {
  return "/api/plugin-enablement-preflight";
}

function pluginEnablementSetEndpoint() {
  return "/api/plugin-enablement-set";
}

function pluginShareCheckoutPreflightEndpoint() {
  return "/api/plugin-share-checkout-preflight";
}

function pluginShareCheckoutEndpoint() {
  return "/api/plugin-share-checkout";
}

function pluginShareActionPreflightEndpoint() {
  return "/api/plugin-share-action-preflight";
}

function pluginContentPreflightEndpoint() {
  return "/api/plugin-content-preflight";
}

function pluginContentReadEndpoint() {
  return "/api/plugin-content-read";
}

function skillsConfigPreflightEndpoint() {
  return "/api/skills-config-preflight";
}

function skillsConfigWriteEndpoint() {
  return "/api/skills-config-write";
}

function skillsExtraRootsClearPreflightEndpoint() {
  return "/api/skills-extra-roots-clear-preflight";
}

function skillsExtraRootsClearEndpoint() {
  return "/api/skills-extra-roots-clear";
}

function remoteControlEnablePreflightEndpoint() {
  return "/api/remote-control-enable-preflight";
}

function remoteControlPairingPreflightEndpoint() {
  return "/api/remote-control-pairing-preflight";
}

function remoteControlDisablePreflightEndpoint() {
  return "/api/remote-control-disable-preflight";
}

function remoteControlDisableEndpoint() {
  return "/api/remote-control-disable";
}

function remoteControlClientsEndpoint() {
  return "/api/remote-control-clients";
}

function remoteControlClientRevokePreflightEndpoint() {
  return "/api/remote-control-client-revoke-preflight";
}

function remoteControlClientRevokeEndpoint() {
  return "/api/remote-control-client-revoke";
}

function environmentAddPreflightEndpoint() {
  return "/api/environment-add-preflight";
}

function environmentAddEndpoint() {
  return "/api/environment-add";
}

function configValuePreflightEndpoint() {
  return "/api/config-value-preflight";
}

function configValueWriteEndpoint() {
  return "/api/config-value-write";
}

function configBatchPreflightEndpoint() {
  return "/api/config-batch-preflight";
}

function configBatchWriteEndpoint() {
  return "/api/config-batch-write";
}

function experimentalFeaturePreflightEndpoint() {
  return "/api/experimental-feature-preflight";
}

function experimentalFeatureSetEndpoint() {
  return "/api/experimental-feature-set";
}

function integrationActionPreflightEndpoint() {
  return "/api/integration-action-preflight";
}

function externalConfigImportPreflightEndpoint() {
  return "/api/external-config-import-preflight";
}

function reviewFeedbackPreflightEndpoint() {
  return "/api/review-feedback-preflight";
}

function memoryResetPreflightEndpoint() {
  return "/api/memory-reset-preflight";
}

function accountLoginPreflightEndpoint() {
  return "/api/account-login-preflight";
}

function accountLoginEndpoint() {
  return "/api/account-login-start";
}

function accountLoginCancelPreflightEndpoint() {
  return "/api/account-login-cancel-preflight";
}

function accountLoginCancelEndpoint() {
  return "/api/account-login-cancel";
}

function accountResetCreditPreflightEndpoint() {
  return "/api/account-reset-credit-consume-preflight";
}

function accountResetCreditEndpoint() {
  return "/api/account-reset-credit-consume";
}

function accountLogoutPreflightEndpoint() {
  return "/api/account-logout-preflight";
}

function accountLogoutEndpoint() {
  return "/api/account-logout";
}

function mcpServerReloadPreflightEndpoint() {
  return "/api/mcp-server-reload-preflight";
}

function mcpServerReloadEndpoint() {
  return "/api/mcp-server-reload";
}

function mcpOauthPreflightEndpoint() {
  return "/api/mcp-oauth-login-preflight";
}

function mcpOauthEndpoint() {
  return "/api/mcp-oauth-login";
}

function terminalActionsEndpoint() {
  if (!selectedWorkspaceId) {
    return "/api/terminal-actions";
  }

  const params = new URLSearchParams();
  params.set("workspace", selectedWorkspaceId);
  return `/api/terminal-actions?${params.toString()}`;
}

function terminalCommandPreflightEndpoint() {
  return "/api/terminal-command-preflight";
}

function terminalCommandEndpoint() {
  return "/api/terminal-command";
}

function processSpawnPreflightEndpoint() {
  return "/api/process-spawn-preflight";
}

function processSpawnEndpoint() {
  return "/api/process-spawn";
}

function threadShellCommandPreflightEndpoint() {
  return "/api/thread-shell-command-preflight";
}

function threadShellCommandEndpoint() {
  return "/api/thread-shell-command";
}

function terminalControlPreflightEndpoint() {
  return "/api/terminal-control-preflight";
}

function terminalControlEndpoint() {
  return "/api/terminal-control";
}

function terminalCleanPreflightEndpoint() {
  return "/api/terminal-background-clean-preflight";
}

function terminalCleanEndpoint() {
  return "/api/terminal-background-clean";
}

function terminalBackgroundListEndpoint() {
  return "/api/terminal-background-list";
}

function terminalBackgroundTerminatePreflightEndpoint() {
  return "/api/terminal-background-terminate-preflight";
}

function terminalBackgroundTerminateEndpoint() {
  return "/api/terminal-background-terminate";
}

function fsDirectoryEndpoint() {
  const params = new URLSearchParams();
  if (selectedWorkspaceId) {
    params.set("workspace", selectedWorkspaceId);
  }
  const directoryPath = elements.fsDirectoryPath.value.trim();
  if (directoryPath) {
    params.set("path", directoryPath);
  }
  const query = params.toString();
  return query ? `/api/fs-directory?${query}` : "/api/fs-directory";
}

function fsReadFilePreflightEndpoint() {
  return "/api/fs-read-file-preflight";
}

function fsWatchPreflightEndpoint() {
  return "/api/fs-watch-preflight";
}

function fuzzyFileSearchPreflightEndpoint() {
  return "/api/fuzzy-file-search-preflight";
}

function fileActionPreflightEndpoint() {
  return "/api/file-action-preflight";
}

function fileActionEndpoint() {
  return "/api/file-action";
}

function liveSessionsEndpoint() {
  if (!selectedWorkspaceId) {
    return "/api/live-sessions";
  }

  const params = new URLSearchParams();
  params.set("workspace", selectedWorkspaceId);
  return `/api/live-sessions?${params.toString()}`;
}

function liveSessionControlPreflightEndpoint() {
  return "/api/live-session-control-preflight";
}

function liveSessionControlEndpoint() {
  return "/api/live-session-control";
}

function liveSessionBulkPreflightEndpoint() {
  return "/api/live-session-bulk-control-preflight";
}

function liveSessionBulkEndpoint() {
  return "/api/live-session-bulk-control";
}

function gitWorktreeEndpoint() {
  if (!selectedWorkspaceId) {
    return "/api/git-worktree";
  }

  const params = new URLSearchParams();
  params.set("workspace", selectedWorkspaceId);
  return `/api/git-worktree?${params.toString()}`;
}

function gitBranchPreflightEndpoint() {
  return "/api/git-branch-preflight";
}

function gitBranchSwitchEndpoint() {
  return "/api/git-branch-switch";
}

function gitBranchCreatePreflightEndpoint() {
  return "/api/git-branch-create-preflight";
}

function gitBranchCreateEndpoint() {
  return "/api/git-branch-create";
}

function gitBranchDeletePreflightEndpoint() {
  return "/api/git-branch-delete-preflight";
}

function gitBranchDeleteEndpoint() {
  return "/api/git-branch-delete";
}

function gitCommitPreflightEndpoint() {
  return "/api/git-commit-preflight";
}

function gitCommitEndpoint() {
  return "/api/git-commit";
}

function gitWorktreePreflightEndpoint() {
  return "/api/git-worktree-preflight";
}

function gitWorktreeActionEndpoint() {
  return "/api/git-worktree-action";
}

async function refreshExecutionGate() {
  const response = await fetch(executionGateEndpoint(), {
    method: "GET",
    headers: apiHeaders(),
    cache: "no-store",
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `HTTP ${response.status}`);
  }

  renderExecutionGate(payload);
}

async function refreshTurnSessions() {
  const response = await fetch(turnSessionsEndpoint(), {
    method: "GET",
    headers: apiHeaders(),
    cache: "no-store",
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `HTTP ${response.status}`);
  }

  renderTurnSessions(payload);
}

async function refreshApprovalDecisions() {
  const response = await fetch(approvalDecisionsEndpoint(), {
    method: "GET",
    headers: apiHeaders(),
    cache: "no-store",
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `HTTP ${response.status}`);
  }

  renderApprovalDecisions(payload);
}

async function manualRefreshApprovalDecisions() {
  elements.approvalRefreshButton.disabled = true;
  setApprovalRefreshState("Refreshing");
  hideError();

  try {
    await refreshApprovalDecisions();
    await refreshTurnSessions();
    await refreshExecutionGate();
    setApprovalRefreshState(approvalRefreshTimer ? "Polling" : "Manual");
  } catch (error) {
    setApprovalRefreshState("Failed");
    renderError(error);
  } finally {
    elements.approvalRefreshButton.disabled = false;
  }
}

async function recordApprovalDecision(
  { sessionId, requestKey, decisionToken, decision },
  { refresh = true } = {},
) {
  const response = await fetch(approvalDecisionsEndpoint(), {
    method: "POST",
    headers: jsonHeaders(),
    cache: "no-store",
    body: JSON.stringify({
      workspace: selectedWorkspaceId,
      session: sessionId,
      request: requestKey,
      decisionToken,
      decision,
    }),
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `HTTP ${response.status}`);
  }
  if (refresh) {
    await refreshApprovalDecisions();
    await refreshTurnSessions();
    await refreshExecutionGate();
  }
}

async function recordApprovalDecisionBatch(decisions) {
  const response = await fetch(approvalDecisionsEndpoint(), {
    method: "POST",
    headers: jsonHeaders(),
    cache: "no-store",
    body: JSON.stringify({
      workspace: selectedWorkspaceId,
      decisions: decisions.map(({ sessionId, requestKey, decisionToken, decision }) => ({
        session: sessionId,
        request: requestKey,
        decisionToken,
        decision,
      })),
    }),
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `HTTP ${response.status}`);
  }
  return payload;
}

async function denyPendingApprovalQueue() {
  const visibleApprovals = filterApprovalQueue(lastApprovalQueue, approvalQueueFilter);
  const allDecisions = pendingDenyableApprovals(visibleApprovals);
  const decisions = limitApprovalDecisionBatch(allDecisions);
  if (decisions.length === 0) {
    elements.approvalBulkStatus.textContent = "No visible pending deny decisions.";
    elements.approvalDenyAllButton.disabled = true;
    return;
  }

  elements.approvalAcceptAllButton.disabled = true;
  elements.approvalDenyAllButton.disabled = true;
  elements.approvalBulkStatus.textContent = approvalBulkProgressText({
    action: "Denying",
    count: decisions.length,
    total: allDecisions.length,
  });
  hideError();

  try {
    await recordApprovalDecisionBatch(decisions);
    elements.approvalBulkStatus.textContent = `${decisions.length} visible deny decisions recorded.`;
  } catch (error) {
    elements.approvalBulkStatus.textContent = "Deny queue failed.";
    renderError(error);
  } finally {
    await refreshApprovalDecisions();
    await refreshTurnSessions();
    await refreshExecutionGate();
  }
}

async function acceptPendingApprovalQueue() {
  const visibleApprovals = filterApprovalQueue(lastApprovalQueue, approvalQueueFilter);
  const allDecisions = pendingApprovableApprovals(visibleApprovals);
  const decisions = limitApprovalDecisionBatch(allDecisions);
  if (decisions.length === 0) {
    elements.approvalBulkStatus.textContent = "No visible pending accept decisions.";
    elements.approvalAcceptAllButton.disabled = true;
    return;
  }

  elements.approvalAcceptAllButton.disabled = true;
  elements.approvalDenyAllButton.disabled = true;
  elements.approvalBulkStatus.textContent = approvalBulkProgressText({
    action: "Accepting",
    count: decisions.length,
    total: allDecisions.length,
  });
  hideError();

  try {
    await recordApprovalDecisionBatch(decisions);
    elements.approvalBulkStatus.textContent = `${decisions.length} visible accept decisions recorded.`;
  } catch (error) {
    elements.approvalBulkStatus.textContent = "Accept queue failed.";
    renderError(error);
  } finally {
    await refreshApprovalDecisions();
    await refreshTurnSessions();
    await refreshExecutionGate();
  }
}

function pendingDenyableApprovals(approvals) {
  return (Array.isArray(approvals) ? approvals : [])
    .map((approval) => {
      const request = approval.request ?? {};
      const browserDecision = approval.browserDecision ?? request.browserDecision ?? null;
      const denyDecision = preferredDenyDecision(request.safeDenyDecisions);
      if (
        browserDecision ||
        !approval.sessionId ||
        !request.requestKey ||
        !request.decisionToken ||
        !denyDecision
      ) {
        return null;
      }
      return {
        sessionId: approval.sessionId,
        requestKey: request.requestKey,
        decisionToken: request.decisionToken,
        decision: denyDecision,
      };
    })
    .filter(Boolean);
}

function pendingApprovableApprovals(approvals) {
  return (Array.isArray(approvals) ? approvals : [])
    .map((approval) => {
      const request = approval.request ?? {};
      const browserDecision = approval.browserDecision ?? request.browserDecision ?? null;
      const approveDecision = preferredApproveDecision(request.safeApproveDecisions);
      if (
        browserDecision ||
        !approval.sessionId ||
        !request.requestKey ||
        !request.decisionToken ||
        !approveDecision
      ) {
        return null;
      }
      return {
        sessionId: approval.sessionId,
        requestKey: request.requestKey,
        decisionToken: request.decisionToken,
        decision: approveDecision,
      };
    })
    .filter(Boolean);
}

function approvalBatchDecisionLimit(payload = lastApprovalPayload) {
  const limit =
    payload?.approvalLifecycle?.approvalQueueActions?.maxBatchDecisionCount ??
    payload?.approvalLifecycle?.approvalInteractionContract?.maxBatchDecisionCount ??
    payload?.policy?.decisionBatchLimit;
  return Number.isSafeInteger(limit) && limit > 0 ? limit : null;
}

function limitApprovalDecisionBatch(decisions, payload = lastApprovalPayload) {
  const items = Array.isArray(decisions) ? decisions : [];
  const limit = approvalBatchDecisionLimit(payload);
  return limit ? items.slice(0, limit) : items;
}

function filterApprovalQueue(approvals, filter) {
  const items = Array.isArray(approvals) ? approvals : [];
  return items.filter((approval) => approvalFilterMatches(approval, filter));
}

function approvalFilterMatches(approval, filter) {
  const request = approval?.request ?? {};
  switch (filter) {
    case "pending":
      return !approvalBrowserDecision(approval);
    case "decided":
      return Boolean(approvalBrowserDecision(approval));
    case "managed":
      return approvalIsManaged(approval);
    case "local":
      return !approvalIsManaged(approval);
    case "command":
      return request.kind === "command" || request.kind === "legacy-command";
    case "file-change":
      return request.kind === "file-change" || request.kind === "legacy-patch";
    case "permissions":
      return request.kind === "permissions";
    case "all":
    default:
      return true;
  }
}

function approvalBrowserDecision(approval) {
  const request = approval?.request ?? {};
  return approval?.browserDecision ?? request.browserDecision ?? null;
}

function approvalIsManaged(approval) {
  return typeof approval?.sessionId === "string" && approval.sessionId.startsWith("managed-");
}

function approvalFilterLabel(filter) {
  switch (filter) {
    case "pending":
      return "Pending";
    case "decided":
      return "Decided";
    case "managed":
      return "Managed";
    case "local":
      return "Local";
    case "command":
      return "Command";
    case "file-change":
      return "File";
    case "permissions":
      return "Permissions";
    case "all":
    default:
      return "All";
  }
}

function preferredDenyDecision(decisions) {
  const safeDecisions = Array.isArray(decisions) ? decisions : [];
  return (
    ["decline", "cancel", "denied", "abort"].find((decision) =>
      safeDecisions.includes(decision),
    ) ?? null
  );
}

function preferredApproveDecision(decisions) {
  const safeDecisions = Array.isArray(decisions) ? decisions : [];
  return safeDecisions.includes("accept") ? "accept" : null;
}

function approvalBulkStatusText({
  approvableCount,
  denyableCount,
  approvableTotal = approvableCount,
  denyableTotal = denyableCount,
}) {
  const parts = [];
  if (approvableCount > 0) {
    parts.push(
      `${visibleApprovalLabel(approvableCount, approvableTotal)} can be accepted`,
    );
  }
  if (denyableCount > 0) {
    parts.push(`${visibleApprovalLabel(denyableCount, denyableTotal)} can be denied`);
  }
  return parts.length > 0 ? `${parts.join("; ")}.` : "No visible pending decisions.";
}

function approvalBulkProgressText({ action, count, total }) {
  const capped = total > count ? ` of ${total}` : "";
  return `${action} ${count}${capped} visible approval${count === 1 ? "" : "s"}.`;
}

function visibleApprovalLabel(count, total = count) {
  const capped = total > count ? ` of ${total}` : "";
  return `${count}${capped} visible approval${count === 1 ? "" : "s"}`;
}

async function refreshSettingsIntegrations() {
  const response = await fetch(settingsIntegrationsEndpoint(), {
    method: "GET",
    headers: apiHeaders(),
    cache: "no-store",
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `HTTP ${response.status}`);
  }

  renderSettingsIntegrations(payload);
}

async function loadThreadRealtimeVoices() {
  elements.realtimeVoicesButton.disabled = true;
  elements.realtimeVoicesStateText.textContent = "Loading";
  hideError();

  try {
    const response = await fetch(threadRealtimeVoicesEndpoint(), {
      method: "GET",
      headers: apiHeaders(),
      cache: "no-store",
    });

    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }

    renderThreadRealtimeVoices(payload.probes?.threadRealtimeVoices ?? null, payload.policy ?? null);
  } catch (error) {
    elements.realtimeVoicesStateText.textContent = "Failed";
    renderError(error);
  } finally {
    elements.realtimeVoicesButton.disabled = false;
  }
}

async function manualRefreshSettingsIntegrations() {
  elements.settingsRefreshButton.disabled = true;
  setSettingsRefreshState("Refreshing");
  hideError();

  try {
    await refreshSettingsIntegrations();
    setSettingsRefreshState("Ready");
  } catch (error) {
    setSettingsRefreshState("Failed");
    renderError(error);
  } finally {
    elements.settingsRefreshButton.disabled = false;
  }
}

function setSettingsRefreshState(state) {
  elements.settingsRefreshState.textContent = state;
}

async function runMcpToolPreflight() {
  setMcpToolLoading(true);
  lastMcpToolPreflight = null;
  elements.mcpToolRunButton.disabled = true;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    thread: elements.mcpToolThreadInput.value,
    server: elements.mcpServerInput.value,
    tool: elements.mcpToolInput.value,
    arguments: elements.mcpArgumentsInput.value,
  };

  try {
    const response = await fetch(mcpToolPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastMcpToolPreflight = {
      body,
      token: payload.preflight?.token,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderMcpToolPreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.mcpToolStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setMcpToolLoading(false);
  }
}

async function runMcpToolCall() {
  if (!lastMcpToolPreflight?.token || !lastMcpToolPreflight?.body) {
    return;
  }

  setMcpToolLoading(true);
  hideError();

  try {
    const response = await fetch(mcpToolCallEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastMcpToolPreflight.body,
        preflightToken: lastMcpToolPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderMcpToolCall(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.mcpToolStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastMcpToolPreflight = null;
    elements.mcpToolRunButton.disabled = true;
    setMcpToolLoading(false);
  }
}

async function runMcpResourcePreflight() {
  setMcpResourceLoading(true);
  lastMcpResourcePreflight = null;
  elements.mcpResourceRunButton.disabled = true;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    server: elements.mcpResourceServerInput.value,
    resource: elements.mcpResourceInput.value,
  };

  try {
    const response = await fetch(mcpResourcePreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastMcpResourcePreflight = {
      body,
      token: payload.preflight?.token ?? null,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderMcpResourcePreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.mcpResourceStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setMcpResourceLoading(false);
  }
}

async function runMcpResourceRead() {
  if (!lastMcpResourcePreflight?.token || !lastMcpResourcePreflight?.body) {
    elements.mcpResourceStatus.textContent = "Run resource check first";
    return;
  }

  elements.mcpResourceRunButton.disabled = true;
  elements.mcpResourceStatus.textContent = "Reading";
  hideError();

  try {
    const response = await fetch(mcpResourceReadEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastMcpResourcePreflight.body,
        preflightToken: lastMcpResourcePreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderMcpResourceRead(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.mcpResourceStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastMcpResourcePreflight = null;
    elements.mcpResourceRunButton.disabled = true;
  }
}

async function runPluginReadPreflight() {
  setPluginReadLoading(true);
  hideError();

  try {
    lastPluginReadPreflight = null;
    elements.pluginReadRunButton.disabled = true;
    const body = {
      workspace: selectedWorkspaceId,
      target: elements.pluginReadTargetInput.value,
      arguments: elements.pluginReadArgumentsInput.value,
    };
    const response = await fetch(pluginReadPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastPluginReadPreflight = {
      body,
      token: payload.preflight?.token,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderPluginReadPreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.pluginReadStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setPluginReadLoading(false);
  }
}

async function runPluginRead() {
  if (!lastPluginReadPreflight?.token || !lastPluginReadPreflight?.body) {
    return;
  }

  setPluginReadLoading(true);
  hideError();

  try {
    const response = await fetch(pluginReadEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastPluginReadPreflight.body,
        preflightToken: lastPluginReadPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderPluginRead(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.pluginReadStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastPluginReadPreflight = null;
    elements.pluginReadRunButton.disabled = true;
    setPluginReadLoading(false);
  }
}

async function runPluginInstallPreflight() {
  setPluginInstallLoading(true);
  hideError();

  try {
    const body = {
      workspace: selectedWorkspaceId,
      target: elements.pluginInstallTargetInput.value,
      arguments: elements.pluginInstallArgumentsInput.value,
    };
    const response = await fetch(pluginInstallPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderPluginInstallPreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.pluginInstallStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setPluginInstallLoading(false);
  }
}

async function runMarketplaceActionPreflight() {
  setMarketplaceActionLoading(true);
  hideError();

  try {
    const body = {
      workspace: selectedWorkspaceId,
      method: elements.marketplaceMethodSelect.value,
      target: elements.marketplaceTargetInput.value,
      arguments: elements.marketplaceArgumentsInput.value,
    };
    const response = await fetch(marketplaceActionPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderMarketplaceActionPreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.marketplaceActionStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setMarketplaceActionLoading(false);
  }
}

async function runPluginUninstallPreflight() {
  setPluginUninstallLoading(true);
  hideError();

  try {
    lastPluginUninstallPreflight = null;
    elements.pluginUninstallRunButton.disabled = true;
    const body = {
      workspace: selectedWorkspaceId,
      target: elements.pluginUninstallTargetInput.value,
    };
    const response = await fetch(pluginUninstallPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastPluginUninstallPreflight = {
      body,
      token: payload.preflight?.token,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderPluginUninstallPreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.pluginUninstallStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setPluginUninstallLoading(false);
  }
}

async function runPluginUninstall() {
  if (!lastPluginUninstallPreflight?.token || !lastPluginUninstallPreflight?.body) {
    return;
  }

  setPluginUninstallLoading(true);
  hideError();

  try {
    const response = await fetch(pluginUninstallEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastPluginUninstallPreflight.body,
        preflightToken: lastPluginUninstallPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderPluginUninstall(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.pluginUninstallStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastPluginUninstallPreflight = null;
    elements.pluginUninstallRunButton.disabled = true;
    setPluginUninstallLoading(false);
  }
}

async function runPluginEnablementPreflight() {
  setPluginEnablementLoading(true);
  hideError();

  try {
    lastPluginEnablementPreflight = null;
    elements.pluginEnablementRunButton.disabled = true;
    const body = {
      workspace: selectedWorkspaceId,
      target: elements.pluginEnablementTargetInput.value,
      enabled: elements.pluginEnablementEnabledSelect.value === "true",
    };
    const response = await fetch(pluginEnablementPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastPluginEnablementPreflight = {
      body,
      token: payload.preflight?.token,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderPluginEnablementPreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.pluginEnablementStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setPluginEnablementLoading(false);
  }
}

async function runPluginEnablementSet() {
  if (!lastPluginEnablementPreflight?.token || !lastPluginEnablementPreflight?.body) {
    return;
  }

  setPluginEnablementLoading(true);
  hideError();

  try {
    const response = await fetch(pluginEnablementSetEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastPluginEnablementPreflight.body,
        preflightToken: lastPluginEnablementPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderPluginEnablementSet(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.pluginEnablementStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastPluginEnablementPreflight = null;
    elements.pluginEnablementRunButton.disabled = true;
    setPluginEnablementLoading(false);
  }
}

async function runPluginShareCheckoutPreflight() {
  setPluginShareCheckoutLoading(true);
  hideError();

  try {
    lastPluginShareCheckoutPreflight = null;
    elements.pluginShareCheckoutRunButton.disabled = true;
    const body = {
      workspace: selectedWorkspaceId,
      target: elements.pluginShareCheckoutTargetInput.value,
    };
    const response = await fetch(pluginShareCheckoutPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastPluginShareCheckoutPreflight = {
      body,
      token: payload.preflight?.token,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderPluginShareCheckoutPreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.pluginShareCheckoutStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setPluginShareCheckoutLoading(false);
  }
}

async function runPluginShareCheckout() {
  if (!lastPluginShareCheckoutPreflight?.token || !lastPluginShareCheckoutPreflight?.body) {
    return;
  }

  setPluginShareCheckoutLoading(true);
  hideError();

  try {
    const response = await fetch(pluginShareCheckoutEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastPluginShareCheckoutPreflight.body,
        preflightToken: lastPluginShareCheckoutPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderPluginShareCheckout(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.pluginShareCheckoutStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastPluginShareCheckoutPreflight = null;
    elements.pluginShareCheckoutRunButton.disabled = true;
    setPluginShareCheckoutLoading(false);
  }
}

async function runPluginShareActionPreflight() {
  setPluginShareActionLoading(true);
  hideError();

  try {
    const body = {
      workspace: selectedWorkspaceId,
      method: elements.pluginShareActionMethodSelect.value,
      target: elements.pluginShareActionTargetInput.value,
      arguments: elements.pluginShareActionArgumentsInput.value,
    };
    const response = await fetch(pluginShareActionPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderPluginShareActionPreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.pluginShareActionStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setPluginShareActionLoading(false);
  }
}

async function runPluginContentPreflight() {
  setPluginContentLoading(true);
  hideError();

  try {
    lastPluginContentPreflight = null;
    elements.pluginContentRunButton.disabled = true;
    const body = {
      workspace: selectedWorkspaceId,
      method: elements.pluginContentMethodSelect.value,
      target: elements.pluginContentTargetInput.value,
      arguments: elements.pluginContentArgumentsInput.value,
    };
    const response = await fetch(pluginContentPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastPluginContentPreflight = {
      body,
      token: payload.preflight?.token,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderPluginContentPreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.pluginContentStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setPluginContentLoading(false);
  }
}

async function runPluginContentRead() {
  if (!lastPluginContentPreflight?.token || !lastPluginContentPreflight?.body) {
    return;
  }

  setPluginContentLoading(true);
  hideError();

  try {
    const response = await fetch(pluginContentReadEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastPluginContentPreflight.body,
        preflightToken: lastPluginContentPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderPluginContentRead(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.pluginContentStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastPluginContentPreflight = null;
    elements.pluginContentRunButton.disabled = true;
    setPluginContentLoading(false);
  }
}

async function runSkillsConfigPreflight() {
  setSkillsConfigLoading(true);
  hideError();

  try {
    lastSkillsConfigPreflight = null;
    elements.skillsConfigRunButton.disabled = true;
    const body = {
      workspace: selectedWorkspaceId,
      target: elements.skillsConfigTargetInput.value,
      arguments: elements.skillsConfigArgumentsInput.value,
    };
    const response = await fetch(skillsConfigPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastSkillsConfigPreflight = {
      body,
      token: payload.preflight?.token,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderSkillsConfigPreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.skillsConfigStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setSkillsConfigLoading(false);
  }
}

async function runSkillsConfigWrite() {
  if (!lastSkillsConfigPreflight?.token || !lastSkillsConfigPreflight?.body) {
    return;
  }

  setSkillsConfigLoading(true);
  hideError();

  try {
    const response = await fetch(skillsConfigWriteEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastSkillsConfigPreflight.body,
        preflightToken: lastSkillsConfigPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderSkillsConfigWrite(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.skillsConfigStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastSkillsConfigPreflight = null;
    elements.skillsConfigRunButton.disabled = true;
    setSkillsConfigLoading(false);
  }
}

async function runSkillsExtraRootsClearPreflight() {
  setSkillsExtraRootsClearLoading(true);
  hideError();

  try {
    lastSkillsExtraRootsClearPreflight = null;
    elements.skillsExtraRootsClearButton.disabled = true;
    const body = {
      workspace: selectedWorkspaceId,
    };
    const response = await fetch(skillsExtraRootsClearPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastSkillsExtraRootsClearPreflight = {
      body,
      token: payload.preflight?.token,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderSkillsExtraRootsClearPreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.skillsExtraRootsClearStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setSkillsExtraRootsClearLoading(false);
  }
}

async function runSkillsExtraRootsClear() {
  if (!lastSkillsExtraRootsClearPreflight?.token || !lastSkillsExtraRootsClearPreflight?.body) {
    return;
  }

  setSkillsExtraRootsClearLoading(true);
  hideError();

  try {
    const response = await fetch(skillsExtraRootsClearEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastSkillsExtraRootsClearPreflight.body,
        preflightToken: lastSkillsExtraRootsClearPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderSkillsExtraRootsClear(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.skillsExtraRootsClearStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastSkillsExtraRootsClearPreflight = null;
    elements.skillsExtraRootsClearButton.disabled = true;
    setSkillsExtraRootsClearLoading(false);
  }
}

async function runRemoteControlDisablePreflight() {
  setRemoteControlDisableLoading(true);
  hideError();

  try {
    lastRemoteControlDisablePreflight = null;
    elements.remoteControlDisableButton.disabled = true;
    const body = {
      workspace: selectedWorkspaceId,
    };
    const response = await fetch(remoteControlDisablePreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastRemoteControlDisablePreflight = {
      body,
      token: payload.preflight?.token,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderRemoteControlDisablePreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.remoteControlDisableStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setRemoteControlDisableLoading(false);
  }
}

async function runRemoteControlEnablePreflight() {
  setRemoteControlEnableLoading(true);
  hideError();

  try {
    const response = await fetch(remoteControlEnablePreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        workspace: selectedWorkspaceId,
        arguments: elements.remoteControlEnableArgumentsInput.value,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderRemoteControlEnablePreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.remoteControlEnableStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setRemoteControlEnableLoading(false);
  }
}

async function runRemoteControlPairingPreflight() {
  setRemoteControlPairingLoading(true);
  hideError();

  try {
    const response = await fetch(remoteControlPairingPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        workspace: selectedWorkspaceId,
        method: elements.remoteControlPairingMethodSelect.value,
        arguments: elements.remoteControlPairingArgumentsInput.value,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderRemoteControlPairingPreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.remoteControlPairingStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setRemoteControlPairingLoading(false);
  }
}

async function runRemoteControlDisable() {
  if (!lastRemoteControlDisablePreflight?.token || !lastRemoteControlDisablePreflight?.body) {
    return;
  }

  setRemoteControlDisableLoading(true);
  hideError();

  try {
    const response = await fetch(remoteControlDisableEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastRemoteControlDisablePreflight.body,
        preflightToken: lastRemoteControlDisablePreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderRemoteControlDisable(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.remoteControlDisableStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastRemoteControlDisablePreflight = null;
    elements.remoteControlDisableButton.disabled = true;
    setRemoteControlDisableLoading(false);
  }
}

async function runRemoteControlClientsList() {
  setRemoteControlClientsLoading(true);
  hideError();

  try {
    remoteClientRefs = [];
    selectedRemoteClientRef = null;
    lastRemoteClientRevokePreflight = null;
    renderRemoteClientRefs([]);
    const response = await fetch(remoteControlClientsEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        workspace: selectedWorkspaceId,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderRemoteControlClients(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.remoteClientsStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setRemoteControlClientsLoading(false);
  }
}

async function runRemoteControlClientRevokePreflight() {
  if (!selectedRemoteClientRef) {
    return;
  }

  setRemoteControlClientRevokeLoading(true);
  hideError();

  try {
    lastRemoteClientRevokePreflight = null;
    elements.remoteClientRevokeButton.disabled = true;
    const body = {
      workspace: selectedWorkspaceId,
      remoteClientRef: selectedRemoteClientRef,
    };
    const response = await fetch(remoteControlClientRevokePreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastRemoteClientRevokePreflight = {
      body,
      token: payload.preflight?.token,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderRemoteControlClientRevokePreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.remoteClientsStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setRemoteControlClientRevokeLoading(false);
  }
}

async function runRemoteControlClientRevoke() {
  if (!lastRemoteClientRevokePreflight?.token || !lastRemoteClientRevokePreflight?.body) {
    return;
  }

  setRemoteControlClientRevokeLoading(true);
  hideError();

  try {
    const response = await fetch(remoteControlClientRevokeEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastRemoteClientRevokePreflight.body,
        preflightToken: lastRemoteClientRevokePreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderRemoteControlClientRevoke(payload);
    remoteClientRefs = remoteClientRefs.filter((item) => item.remoteClientRef !== selectedRemoteClientRef);
    selectedRemoteClientRef = null;
    renderRemoteClientRefs(remoteClientRefs);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.remoteClientsStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastRemoteClientRevokePreflight = null;
    elements.remoteClientRevokeButton.disabled = true;
    setRemoteControlClientRevokeLoading(false);
  }
}

async function runEnvironmentAddPreflight() {
  const environmentId = elements.environmentAddIdInput.value.trim();
  const execServerUrl = elements.environmentAddUrlInput.value.trim();
  if (!environmentId || !execServerUrl) {
    elements.environmentAddStatus.textContent = "Target required";
    return;
  }

  setEnvironmentAddLoading(true);
  hideError();

  try {
    lastEnvironmentAddPreflight = null;
    elements.environmentAddRunButton.disabled = true;
    const body = {
      workspace: selectedWorkspaceId,
      environmentId,
      execServerUrl,
    };
    const response = await fetch(environmentAddPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastEnvironmentAddPreflight = {
      body,
      token: payload.preflight?.token,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderEnvironmentAddPreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.environmentAddStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setEnvironmentAddLoading(false);
  }
}

async function runEnvironmentAdd() {
  if (!lastEnvironmentAddPreflight?.token || !lastEnvironmentAddPreflight?.body) {
    return;
  }

  setEnvironmentAddLoading(true);
  hideError();

  try {
    const response = await fetch(environmentAddEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastEnvironmentAddPreflight.body,
        preflightToken: lastEnvironmentAddPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderEnvironmentAdd(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.environmentAddStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastEnvironmentAddPreflight = null;
    elements.environmentAddRunButton.disabled = true;
    setEnvironmentAddLoading(false);
  }
}

async function runConfigValuePreflight() {
  setConfigValueLoading(true);
  hideError();

  try {
    lastConfigValuePreflight = null;
    elements.configValueRunButton.disabled = true;
    const body = {
      workspace: selectedWorkspaceId,
      keyPath: elements.configValueKeyInput.value,
      value: elements.configValueInput.value,
      mergeStrategy: elements.configValueMergeSelect.value,
    };
    const response = await fetch(configValuePreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastConfigValuePreflight = {
      body,
      token: payload.preflight?.token,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderConfigValuePreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.configValueStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setConfigValueLoading(false);
  }
}

async function runConfigValueWrite() {
  if (!lastConfigValuePreflight?.token || !lastConfigValuePreflight?.body) {
    return;
  }

  setConfigValueLoading(true);
  hideError();

  try {
    const response = await fetch(configValueWriteEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastConfigValuePreflight.body,
        preflightToken: lastConfigValuePreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderConfigValueWrite(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.configValueStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastConfigValuePreflight = null;
    elements.configValueRunButton.disabled = true;
    setConfigValueLoading(false);
  }
}

async function runConfigBatchPreflight() {
  setConfigBatchLoading(true);
  hideError();

  try {
    lastConfigBatchPreflight = null;
    elements.configBatchRunButton.disabled = true;
    const body = {
      workspace: selectedWorkspaceId,
      edits: elements.configBatchInput.value,
    };
    const response = await fetch(configBatchPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastConfigBatchPreflight = {
      body,
      token: payload.preflight?.token,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderConfigBatchPreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.configBatchStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setConfigBatchLoading(false);
  }
}

async function runConfigBatchWrite() {
  if (!lastConfigBatchPreflight?.token || !lastConfigBatchPreflight?.body) {
    return;
  }

  setConfigBatchLoading(true);
  hideError();

  try {
    const response = await fetch(configBatchWriteEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastConfigBatchPreflight.body,
        preflightToken: lastConfigBatchPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderConfigBatchWrite(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.configBatchStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastConfigBatchPreflight = null;
    elements.configBatchRunButton.disabled = true;
    setConfigBatchLoading(false);
  }
}

async function runExperimentalFeaturePreflight() {
  setExperimentalFeatureLoading(true);
  hideError();

  try {
    lastExperimentalFeaturePreflight = null;
    elements.experimentalFeatureRunButton.disabled = true;
    const body = {
      workspace: selectedWorkspaceId,
      feature: elements.experimentalFeatureInput.value,
      enabled: elements.experimentalFeatureEnabledSelect.value,
    };
    const response = await fetch(experimentalFeaturePreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastExperimentalFeaturePreflight = {
      body,
      token: payload.preflight?.token,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderExperimentalFeaturePreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.experimentalFeatureStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setExperimentalFeatureLoading(false);
  }
}

async function runExperimentalFeatureSet() {
  if (!lastExperimentalFeaturePreflight?.token || !lastExperimentalFeaturePreflight?.body) {
    return;
  }

  setExperimentalFeatureLoading(true);
  hideError();

  try {
    const response = await fetch(experimentalFeatureSetEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastExperimentalFeaturePreflight.body,
        preflightToken: lastExperimentalFeaturePreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderExperimentalFeatureSet(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.experimentalFeatureStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastExperimentalFeaturePreflight = null;
    elements.experimentalFeatureRunButton.disabled = true;
    setExperimentalFeatureLoading(false);
  }
}

async function runIntegrationActionPreflight() {
  setIntegrationActionLoading(true);
  hideError();

  try {
    const response = await fetch(integrationActionPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        workspace: selectedWorkspaceId,
        method: elements.integrationMethodSelect.value,
        target: elements.integrationTargetInput.value,
        arguments: elements.integrationArgumentsInput.value,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderIntegrationActionPreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.integrationActionStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setIntegrationActionLoading(false);
  }
}

async function runExternalConfigImportPreflight() {
  setExternalConfigImportLoading(true);
  hideError();

  try {
    const response = await fetch(externalConfigImportPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        workspace: selectedWorkspaceId,
        target: elements.externalConfigImportTargetInput.value,
        arguments: elements.externalConfigImportArgumentsInput.value,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderExternalConfigImportPreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.externalConfigImportStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setExternalConfigImportLoading(false);
  }
}

async function runReviewFeedbackPreflight() {
  setReviewFeedbackLoading(true);
  hideError();

  try {
    const response = await fetch(reviewFeedbackPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        workspace: selectedWorkspaceId,
        method: elements.reviewFeedbackMethodSelect.value,
        target: elements.reviewFeedbackTargetInput.value,
        arguments: elements.reviewFeedbackArgumentsInput.value,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderReviewFeedbackPreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.reviewFeedbackStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setReviewFeedbackLoading(false);
  }
}

async function runMemoryResetPreflight() {
  setMemoryResetLoading(true);
  hideError();

  try {
    const response = await fetch(memoryResetPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        workspace: selectedWorkspaceId,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderMemoryResetPreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.memoryResetStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setMemoryResetLoading(false);
  }
}

async function runAccountLoginPreflight() {
  setAccountLoginLoading(true);
  lastAccountLoginPreflight = null;
  lastAccountLoginCancelPreflight = null;
  lastAccountLoginCancelRef = null;
  elements.accountLoginButton.disabled = true;
  elements.accountLoginCancelPreflightButton.disabled = true;
  elements.accountLoginCancelButton.disabled = true;
  elements.accountLoginCodeText.textContent = "-";
  elements.accountLoginUrlText.textContent = "-";
  elements.accountLoginCancelStatus.textContent = "No active device login.";
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
  };

  try {
    const response = await fetch(accountLoginPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastAccountLoginPreflight = {
      body,
      token: payload.preflight?.token ?? null,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderAccountLoginPreflight(payload);
  } catch (error) {
    elements.accountLoginStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setAccountLoginLoading(false);
  }
}

async function runAccountLogin() {
  if (!lastAccountLoginPreflight?.token || !lastAccountLoginPreflight?.body) {
    elements.accountLoginStatus.textContent = "Run login check first";
    return;
  }

  elements.accountLoginButton.disabled = true;
  elements.accountLoginStatus.textContent = "Starting login";
  hideError();

  try {
    const response = await fetch(accountLoginEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastAccountLoginPreflight.body,
        preflightToken: lastAccountLoginPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderAccountLogin(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.accountLoginStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastAccountLoginPreflight = null;
    elements.accountLoginButton.disabled = true;
  }
}

async function runAccountLoginCancelPreflight() {
  if (!lastAccountLoginCancelRef) {
    elements.accountLoginCancelStatus.textContent = "Start login first";
    return;
  }

  setAccountLoginCancelLoading(true);
  lastAccountLoginCancelPreflight = null;
  elements.accountLoginCancelButton.disabled = true;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    loginRef: lastAccountLoginCancelRef,
  };

  try {
    const response = await fetch(accountLoginCancelPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastAccountLoginCancelPreflight = {
      body,
      token: payload.preflight?.token ?? null,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderAccountLoginCancelPreflight(payload);
  } catch (error) {
    elements.accountLoginCancelStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setAccountLoginCancelLoading(false);
  }
}

async function runAccountLoginCancel() {
  if (!lastAccountLoginCancelPreflight?.token || !lastAccountLoginCancelPreflight?.body) {
    elements.accountLoginCancelStatus.textContent = "Run cancel check first";
    return;
  }

  elements.accountLoginCancelButton.disabled = true;
  elements.accountLoginCancelStatus.textContent = "Canceling login";
  hideError();
  let completed = false;

  try {
    const response = await fetch(accountLoginCancelEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastAccountLoginCancelPreflight.body,
        preflightToken: lastAccountLoginCancelPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderAccountLoginCancel(payload);
    completed = true;
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.accountLoginCancelStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastAccountLoginCancelPreflight = null;
    if (completed) {
      lastAccountLoginCancelRef = null;
    }
    elements.accountLoginCancelPreflightButton.disabled = !lastAccountLoginCancelRef;
    elements.accountLoginCancelButton.disabled = true;
  }
}

async function runAccountResetCreditPreflight() {
  setAccountResetCreditLoading(true);
  lastAccountResetCreditPreflight = null;
  elements.accountResetCreditButton.disabled = true;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
  };

  try {
    const response = await fetch(accountResetCreditPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastAccountResetCreditPreflight = {
      body,
      token: payload.preflight?.token ?? null,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderAccountResetCreditPreflight(payload);
  } catch (error) {
    elements.accountResetCreditStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setAccountResetCreditLoading(false);
  }
}

async function runAccountResetCredit() {
  if (!lastAccountResetCreditPreflight?.token || !lastAccountResetCreditPreflight?.body) {
    elements.accountResetCreditStatus.textContent = "Run reset check first";
    return;
  }

  elements.accountResetCreditButton.disabled = true;
  elements.accountResetCreditStatus.textContent = "Using reset credit";
  hideError();

  try {
    const response = await fetch(accountResetCreditEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastAccountResetCreditPreflight.body,
        preflightToken: lastAccountResetCreditPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderAccountResetCredit(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.accountResetCreditStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastAccountResetCreditPreflight = null;
    elements.accountResetCreditButton.disabled = true;
  }
}

async function runAccountLogoutPreflight() {
  setAccountLogoutLoading(true);
  lastAccountLogoutPreflight = null;
  elements.accountLogoutButton.disabled = true;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
  };

  try {
    const response = await fetch(accountLogoutPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastAccountLogoutPreflight = {
      body,
      token: payload.preflight?.token ?? null,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderAccountLogoutPreflight(payload);
  } catch (error) {
    elements.accountLogoutStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setAccountLogoutLoading(false);
  }
}

async function runAccountLogout() {
  if (!lastAccountLogoutPreflight?.token || !lastAccountLogoutPreflight?.body) {
    elements.accountLogoutStatus.textContent = "Run logout check first";
    return;
  }

  elements.accountLogoutButton.disabled = true;
  elements.accountLogoutStatus.textContent = "Logging out";
  hideError();

  try {
    const response = await fetch(accountLogoutEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastAccountLogoutPreflight.body,
        preflightToken: lastAccountLogoutPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderAccountLogout(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.accountLogoutStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastAccountLogoutPreflight = null;
    elements.accountLogoutButton.disabled = true;
  }
}

async function runMcpServerReloadPreflight() {
  setMcpServerReloadLoading(true);
  lastMcpServerReloadPreflight = null;
  elements.mcpServerReloadButton.disabled = true;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
  };

  try {
    const response = await fetch(mcpServerReloadPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastMcpServerReloadPreflight = {
      body,
      token: payload.preflight?.token ?? null,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderMcpServerReloadPreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.mcpServerReloadStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setMcpServerReloadLoading(false);
  }
}

async function runMcpServerReload() {
  if (!lastMcpServerReloadPreflight?.token || !lastMcpServerReloadPreflight?.body) {
    elements.mcpServerReloadStatus.textContent = "Run reload check first";
    return;
  }

  elements.mcpServerReloadButton.disabled = true;
  elements.mcpServerReloadStatus.textContent = "Reloading";
  hideError();

  try {
    const response = await fetch(mcpServerReloadEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastMcpServerReloadPreflight.body,
        preflightToken: lastMcpServerReloadPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderMcpServerReload(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.mcpServerReloadStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastMcpServerReloadPreflight = null;
    elements.mcpServerReloadButton.disabled = true;
  }
}

async function runMcpOauthPreflight() {
  setMcpOauthLoading(true);
  lastMcpOauthPreflight = null;
  elements.mcpOauthRunButton.disabled = true;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    target: elements.mcpOauthServerInput.value,
  };

  try {
    const response = await fetch(mcpOauthPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastMcpOauthPreflight = {
      body,
      token: payload.preflight?.token ?? null,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderMcpOauthPreflight(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.mcpOauthStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setMcpOauthLoading(false);
  }
}

async function runMcpOauthLogin() {
  if (!lastMcpOauthPreflight?.token || !lastMcpOauthPreflight?.body) {
    elements.mcpOauthStatus.textContent = "Run OAuth check first";
    return;
  }

  setMcpOauthLoading(true);
  hideError();

  try {
    const response = await fetch(mcpOauthEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastMcpOauthPreflight.body,
        preflightToken: lastMcpOauthPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderMcpOauthLogin(payload);
    await refreshSettingsIntegrations().catch(() => {});
  } catch (error) {
    elements.mcpOauthStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastMcpOauthPreflight = null;
    elements.mcpOauthRunButton.disabled = true;
    setMcpOauthLoading(false);
  }
}

async function refreshTerminalActions() {
  const response = await fetch(terminalActionsEndpoint(), {
    method: "GET",
    headers: apiHeaders(),
    cache: "no-store",
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `HTTP ${response.status}`);
  }

  renderTerminalActions(payload);
}

async function runTerminalCommandPreflight() {
  setTerminalPreflightLoading(true);
  lastTerminalCommandPreflight = null;
  elements.terminalCommandButton.disabled = true;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    command: elements.terminalInput.value,
  };

  try {
    const response = await fetch(terminalCommandPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastTerminalCommandPreflight = {
      body,
      token: payload.preflight?.token ?? null,
    };
    renderTerminalCommandPreflight(payload);
  } catch (error) {
    elements.terminalPreflightStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setTerminalPreflightLoading(false);
  }
}

async function runTerminalCommand() {
  if (!lastTerminalCommandPreflight?.token || !lastTerminalCommandPreflight?.body) {
    elements.terminalPreflightStatus.textContent = "Run preflight first";
    return;
  }

  elements.terminalCommandButton.disabled = true;
  elements.terminalPreflightStatus.textContent = "Running";
  hideError();

  try {
    const response = await fetch(terminalCommandEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastTerminalCommandPreflight.body,
        preflightToken: lastTerminalCommandPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderTerminalCommand(payload);
    await refreshTerminalActions().catch(() => {});
  } catch (error) {
    elements.terminalPreflightStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastTerminalCommandPreflight = null;
    elements.terminalCommandButton.disabled = true;
  }
}

async function runProcessSpawnPreflight() {
  setProcessSpawnLoading(true);
  lastProcessSpawnPreflight = null;
  elements.processSpawnButton.disabled = true;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    command: elements.processSpawnInput.value,
  };

  try {
    const response = await fetch(processSpawnPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastProcessSpawnPreflight = {
      body,
      token: payload.preflight?.token ?? null,
    };
    renderProcessSpawnPreflight(payload);
  } catch (error) {
    elements.processSpawnStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setProcessSpawnLoading(false);
  }
}

async function runProcessSpawn() {
  if (!lastProcessSpawnPreflight?.token || !lastProcessSpawnPreflight?.body) {
    elements.processSpawnStatus.textContent = "Run preflight first";
    return;
  }

  elements.processSpawnButton.disabled = true;
  elements.processSpawnStatus.textContent = "Running";
  hideError();

  try {
    const response = await fetch(processSpawnEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastProcessSpawnPreflight.body,
        preflightToken: lastProcessSpawnPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderProcessSpawn(payload);
    await refreshTerminalActions().catch(() => {});
  } catch (error) {
    elements.processSpawnStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastProcessSpawnPreflight = null;
    elements.processSpawnButton.disabled = true;
  }
}

async function runThreadShellCommandPreflight() {
  setThreadShellCommandLoading(true);
  lastThreadShellCommandPreflight = null;
  elements.threadShellCommandButton.disabled = true;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    thread: elements.threadShellCommandThread.value,
    command: elements.threadShellCommandInput.value,
  };

  try {
    const response = await fetch(threadShellCommandPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastThreadShellCommandPreflight = {
      body,
      token: payload.preflight?.token ?? null,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderThreadShellCommandPreflight(payload);
  } catch (error) {
    elements.threadShellCommandStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setThreadShellCommandLoading(false);
  }
}

async function runThreadShellCommand() {
  if (
    !lastThreadShellCommandPreflight?.token ||
    !lastThreadShellCommandPreflight?.body ||
    lastThreadShellCommandPreflight.enabled !== true
  ) {
    elements.threadShellCommandStatus.textContent = "Run shell check first";
    return;
  }

  elements.threadShellCommandButton.disabled = true;
  elements.threadShellCommandStatus.textContent = "Running";
  hideError();

  try {
    const response = await fetch(threadShellCommandEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastThreadShellCommandPreflight.body,
        preflightToken: lastThreadShellCommandPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadShellCommand(payload);
    await refreshTerminalActions().catch(() => {});
  } catch (error) {
    elements.threadShellCommandStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastThreadShellCommandPreflight = null;
    elements.threadShellCommandButton.disabled = true;
  }
}

async function runTerminalControlPreflight() {
  setTerminalControlLoading(true);
  lastTerminalControlPreflight = null;
  elements.terminalControlRunButton.disabled = true;
  hideError();

  const action = elements.terminalControlAction.value;
  const body = {
    workspace: selectedWorkspaceId,
    action,
    method: elements.terminalControlMethod.value,
    session: elements.terminalControlSession.value,
  };
  if (action === "write") {
    body.input = elements.terminalControlInput.value;
  }
  if (action === "resize") {
    body.rows = elements.terminalControlRows.value;
    body.cols = elements.terminalControlCols.value;
  }

  try {
    const response = await fetch(terminalControlPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastTerminalControlPreflight =
      payload.policy?.executionGateEnabled === true
        ? {
            body,
            token: payload.preflight?.token ?? null,
          }
        : null;
    renderTerminalControlPreflight(payload);
    await refreshTerminalActions().catch(() => {});
  } catch (error) {
    elements.terminalControlStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setTerminalControlLoading(false);
  }
}

async function runTerminalControl() {
  if (!lastTerminalControlPreflight?.token || !lastTerminalControlPreflight?.body) {
    elements.terminalControlStatus.textContent = "Run preflight first";
    return;
  }

  elements.terminalControlRunButton.disabled = true;
  elements.terminalControlStatus.textContent = "Executing";
  hideError();

  try {
    const response = await fetch(terminalControlEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastTerminalControlPreflight.body,
        preflightToken: lastTerminalControlPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderTerminalControl(payload);
    await refreshTerminalActions().catch(() => {});
  } catch (error) {
    elements.terminalControlStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastTerminalControlPreflight = null;
    elements.terminalControlRunButton.disabled = true;
  }
}

function resetTerminalControlPreflight() {
  lastTerminalControlPreflight = null;
  elements.terminalControlRunButton.disabled = true;
}

function resetTerminalBackgroundSelection() {
  selectedTerminalBackgroundRef = null;
  lastTerminalBackgroundTerminatePreflight = null;
  elements.terminalBackgroundTerminatePreflightButton.disabled = true;
  elements.terminalBackgroundTerminateButton.disabled = true;
  elements.terminalBackgroundSelectionText.textContent = "None";
  elements.terminalBackgroundList.replaceChildren();
}

function syncTerminalControlMethodOptions() {
  const action = elements.terminalControlAction.value;
  let firstEnabled = null;
  let selectedStillValid = false;
  for (const option of elements.terminalControlMethod.options) {
    const isEnabled = option.dataset.action === action;
    option.disabled = !isEnabled;
    if (isEnabled && firstEnabled === null) {
      firstEnabled = option.value;
    }
    if (isEnabled && option.selected) {
      selectedStillValid = true;
    }
  }
  if (!selectedStillValid && firstEnabled !== null) {
    elements.terminalControlMethod.value = firstEnabled;
  }
}

async function runTerminalCleanPreflight() {
  const body = {
    workspace: selectedWorkspaceId,
    thread: elements.terminalCleanThread.value,
  };
  lastTerminalCleanPreflight = null;
  elements.terminalCleanButton.disabled = true;
  setTerminalCleanLoading(true);
  hideError();

  try {
    const response = await fetch(terminalCleanPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastTerminalCleanPreflight = {
      body,
      token: payload.preflight?.token ?? null,
    };
    renderTerminalCleanPreflight(payload);
  } catch (error) {
    elements.terminalCleanStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setTerminalCleanLoading(false);
  }
}

async function runTerminalClean() {
  if (!lastTerminalCleanPreflight?.token || !lastTerminalCleanPreflight?.body) {
    elements.terminalCleanStatus.textContent = "Run preflight first";
    return;
  }

  elements.terminalCleanButton.disabled = true;
  elements.terminalCleanStatus.textContent = "Cleaning";
  hideError();

  try {
    const response = await fetch(terminalCleanEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastTerminalCleanPreflight.body,
        preflightToken: lastTerminalCleanPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderTerminalClean(payload);
  } catch (error) {
    elements.terminalCleanStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastTerminalCleanPreflight = null;
    elements.terminalCleanButton.disabled = true;
  }
}

async function runTerminalBackgroundList() {
  const body = {
    workspace: selectedWorkspaceId,
    thread: elements.terminalBackgroundListThread.value,
  };
  resetTerminalBackgroundSelection();
  setTerminalBackgroundListLoading(true);
  hideError();

  try {
    const response = await fetch(terminalBackgroundListEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderTerminalBackgroundList(payload);
    await refreshTerminalActions().catch(() => {});
  } catch (error) {
    elements.terminalBackgroundListStatus.textContent = "Failed";
    renderTerminalBackgroundListItems([]);
    renderError(error);
  } finally {
    setTerminalBackgroundListLoading(false);
  }
}

async function runTerminalBackgroundTerminatePreflight() {
  if (!selectedTerminalBackgroundRef) {
    elements.terminalBackgroundListStatus.textContent = "Select a terminal";
    return;
  }

  const body = {
    workspace: selectedWorkspaceId,
    thread: elements.terminalBackgroundListThread.value,
    terminalRef: selectedTerminalBackgroundRef,
  };
  lastTerminalBackgroundTerminatePreflight = null;
  elements.terminalBackgroundTerminateButton.disabled = true;
  setTerminalBackgroundTerminatePreflightLoading(true);
  hideError();

  try {
    const response = await fetch(terminalBackgroundTerminatePreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastTerminalBackgroundTerminatePreflight =
      payload.policy?.executionGateEnabled === true
        ? {
            body,
            token: payload.preflight?.token ?? null,
          }
        : null;
    renderTerminalBackgroundTerminatePreflight(payload);
  } catch (error) {
    elements.terminalBackgroundListStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setTerminalBackgroundTerminatePreflightLoading(false);
  }
}

async function runTerminalBackgroundTerminate() {
  if (
    !lastTerminalBackgroundTerminatePreflight?.token ||
    !lastTerminalBackgroundTerminatePreflight?.body
  ) {
    elements.terminalBackgroundListStatus.textContent = "Run terminate check first";
    return;
  }

  elements.terminalBackgroundTerminateButton.disabled = true;
  elements.terminalBackgroundListStatus.textContent = "Terminating";
  hideError();

  try {
    const response = await fetch(terminalBackgroundTerminateEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastTerminalBackgroundTerminatePreflight.body,
        preflightToken: lastTerminalBackgroundTerminatePreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderTerminalBackgroundTerminate(payload);
    await refreshTerminalActions().catch(() => {});
  } catch (error) {
    elements.terminalBackgroundListStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastTerminalBackgroundTerminatePreflight = null;
    selectedTerminalBackgroundRef = null;
    elements.terminalBackgroundTerminatePreflightButton.disabled = true;
    elements.terminalBackgroundTerminateButton.disabled = true;
  }
}

async function loadFsDirectory() {
  elements.fsDirectoryButton.disabled = true;
  elements.fsDirectoryStatus.textContent = "Loading";
  hideError();

  try {
    const response = await fetch(fsDirectoryEndpoint(), {
      method: "GET",
      headers: apiHeaders(),
      cache: "no-store",
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderFsDirectory(payload.probes?.fsDirectory ?? null, payload.policy ?? null, payload.appServer);
  } catch (error) {
    elements.fsDirectoryStatus.textContent = "Failed";
    elements.fsDirectoryList.replaceChildren();
    renderError(error);
  } finally {
    elements.fsDirectoryButton.disabled = false;
  }
}

async function runFsReadFilePreflight() {
  lastFsReadFilePreflight = null;
  setFsReadFileLoading(true);
  hideError();
  const body = {
    workspace: selectedWorkspaceId,
    path: elements.fsReadFilePath.value,
  };

  try {
    const response = await fetch(fsReadFilePreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastFsReadFilePreflight = {
      body,
      token: payload.preflight?.token ?? null,
    };
    renderFsReadFilePreflight(payload);
  } catch (error) {
    elements.fsReadFileStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setFsReadFileLoading(false);
  }
}

async function runFsWatchPreflight() {
  lastFsWatchPreflight = null;
  setFsWatchLoading(true);
  hideError();
  const body = {
    workspace: selectedWorkspaceId,
    method: elements.fsWatchMethod.value,
    path: elements.fsWatchPath.value,
    watchId: elements.fsWatchId.value,
  };

  try {
    const response = await fetch(fsWatchPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastFsWatchPreflight = {
      body,
      token: payload.preflight?.token ?? null,
    };
    renderFsWatchPreflight(payload);
  } catch (error) {
    elements.fsWatchStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setFsWatchLoading(false);
  }
}

async function runFuzzyFileSearchPreflight() {
  lastFuzzyFileSearchPreflight = null;
  setFuzzyFileSearchLoading(true);
  hideError();
  const body = buildFuzzyFileSearchRequestBody();

  try {
    const response = await fetch(fuzzyFileSearchPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastFuzzyFileSearchPreflight = {
      body,
      token: payload.preflight?.token ?? null,
    };
    renderFuzzyFileSearchPreflight(payload);
  } catch (error) {
    elements.fuzzyFileSearchStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setFuzzyFileSearchLoading(false);
  }
}

function buildFuzzyFileSearchRequestBody() {
  const method = elements.fuzzyFileSearchMethod.value;
  const body = {
    workspace: selectedWorkspaceId,
    method,
    sessionId: elements.fuzzyFileSearchSession.value,
  };
  if (method === "fuzzyFileSearch/sessionStart") {
    body.roots = parseFuzzyFileSearchRoots(elements.fuzzyFileSearchRoots.value);
    body.query = null;
  } else if (method === "fuzzyFileSearch/sessionUpdate") {
    body.roots = null;
    body.query = elements.fuzzyFileSearchQuery.value;
  } else {
    body.roots = null;
    body.query = null;
  }
  return body;
}

function parseFuzzyFileSearchRoots(value) {
  return value
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

async function runFileActionPreflight() {
  const body = buildFileActionRequestBody();
  lastFileActionPreflight = null;
  elements.fileActionButton.disabled = true;
  setFileActionLoading(true);
  hideError();

  try {
    const response = await fetch(fileActionPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastFileActionPreflight = {
      body,
      token: payload.preflight?.token ?? null,
    };
    renderFileActionPreflight(payload);
  } catch (error) {
    elements.fileActionStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setFileActionLoading(false);
  }
}

async function runFileAction() {
  if (!lastFileActionPreflight?.token || !lastFileActionPreflight?.body) {
    elements.fileActionStatus.textContent = "Run preflight first";
    return;
  }

  elements.fileActionButton.disabled = true;
  elements.fileActionStatus.textContent = "Applying";
  hideError();

  try {
    const response = await fetch(fileActionEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastFileActionPreflight.body,
        preflightToken: lastFileActionPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderFileAction(payload);
    await refreshTerminalActions().catch(() => {});
  } catch (error) {
    elements.fileActionStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastFileActionPreflight = null;
    elements.fileActionButton.disabled = true;
  }
}

function buildFileActionRequestBody() {
  return {
    workspace: selectedWorkspaceId,
    action: elements.fileActionSelect.value,
    path: elements.fileActionPath.value,
    targetPath: elements.fileActionPath.value,
    sourcePath: elements.fileActionSource.value,
    content: elements.fileActionContent.value,
  };
}

async function refreshLiveSessions() {
  const response = await fetch(liveSessionsEndpoint(), {
    method: "GET",
    headers: apiHeaders(),
    cache: "no-store",
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `HTTP ${response.status}`);
  }

  renderLiveSessions(payload);
}

async function runLiveSessionControlPreflight() {
  setLiveSessionControlLoading(true);
  lastLiveSessionControlPreflight = null;
  elements.liveSessionControlButton.disabled = true;
  const body = buildLiveSessionControlRequestBody();
  try {
    const response = await fetch(liveSessionControlPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastLiveSessionControlPreflight = {
      body,
      token: payload.preflight?.token ?? null,
    };
    renderLiveSessionControlPreflight(payload);
  } catch (error) {
    elements.liveSessionControlStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setLiveSessionControlLoading(false);
  }
}

async function runLiveSessionControl() {
  if (!lastLiveSessionControlPreflight?.token) {
    elements.liveSessionControlStatus.textContent = "Preflight required";
    return;
  }
  setLiveSessionControlLoading(true);
  try {
    const response = await fetch(liveSessionControlEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({
        ...lastLiveSessionControlPreflight.body,
        preflightToken: lastLiveSessionControlPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderLiveSessionControl(payload);
    await refreshLiveSessions();
  } catch (error) {
    elements.liveSessionControlStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastLiveSessionControlPreflight = null;
    elements.liveSessionControlButton.disabled = true;
    setLiveSessionControlLoading(false);
  }
}

async function runLiveSessionBulkPreflight() {
  setLiveSessionBulkLoading(true);
  lastLiveSessionBulkPreflight = null;
  elements.liveSessionBulkButton.disabled = true;
  const body = buildLiveSessionBulkRequestBody();
  try {
    const response = await fetch(liveSessionBulkPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastLiveSessionBulkPreflight = {
      body,
      token: payload.preflight?.token ?? null,
    };
    renderLiveSessionBulkPreflight(payload);
  } catch (error) {
    elements.liveSessionBulkStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setLiveSessionBulkLoading(false);
  }
}

async function runLiveSessionBulkControl() {
  if (!lastLiveSessionBulkPreflight?.token) {
    elements.liveSessionBulkStatus.textContent = "Preflight required";
    return;
  }
  setLiveSessionBulkLoading(true);
  try {
    const response = await fetch(liveSessionBulkEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({
        ...lastLiveSessionBulkPreflight.body,
        preflightToken: lastLiveSessionBulkPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderLiveSessionBulkControl(payload);
    await refreshLiveSessions();
  } catch (error) {
    elements.liveSessionBulkStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastLiveSessionBulkPreflight = null;
    elements.liveSessionBulkButton.disabled = true;
    setLiveSessionBulkLoading(false);
  }
}

function buildLiveSessionBulkRequestBody() {
  return {
    workspace: selectedWorkspaceId,
    action: "unsubscribe",
  };
}

function buildLiveSessionControlRequestBody() {
  return {
    workspace: selectedWorkspaceId,
    action: elements.liveSessionControlAction.value,
    thread: elements.liveSessionControlThread.value,
    turn: elements.liveSessionControlTurn.value,
    prompt: elements.liveSessionControlPrompt.value,
  };
}

function fillLiveSessionControlDraft({ action, thread }) {
  elements.liveSessionControlAction.value = action;
  elements.liveSessionControlThread.value = thread ?? "";
  elements.liveSessionControlTurn.value = "";
  elements.liveSessionControlPrompt.value = "";
  lastLiveSessionControlPreflight = null;
  elements.liveSessionControlButton.disabled = true;
  elements.liveSessionControlStatus.textContent = "Drafted";
}

async function refreshGitWorktree({ manageLoading = true } = {}) {
  if (manageLoading) {
    setGitLoading(true);
  }
  lastGitBranchPreflight = null;
  lastGitBranchCreatePreflight = null;
  lastGitBranchDeletePreflight = null;
  lastGitCommitPreflight = null;
  lastGitWorktreePreflight = null;
  elements.gitSwitchButton.disabled = true;
  elements.gitDeleteButton.disabled = true;
  elements.gitCreateButton.disabled = true;
  elements.gitCommitButton.disabled = true;
  elements.gitWorktreeButton.disabled = true;

  try {
    const response = await fetch(gitWorktreeEndpoint(), {
      method: "GET",
      headers: apiHeaders(),
      cache: "no-store",
    });

    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }

    renderGitWorktree(payload.git ?? null);
  } catch (error) {
    elements.gitRepoText.textContent = "Failed";
    elements.gitStateText.textContent = error.message;
    renderError(error);
  } finally {
    if (manageLoading) {
      setGitLoading(false);
    }
  }
}

async function runGitBranchPreflight(branchName) {
  hideError();
  lastGitBranchPreflight = null;
  elements.gitSwitchButton.disabled = true;
  elements.gitPreflightState.textContent = "Checking branch switch.";
  try {
    const response = await fetch(gitBranchPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        workspace: selectedWorkspaceId,
        branch: branchName,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderGitBranchPreflight(payload);
  } catch (error) {
    elements.gitPreflightState.textContent = "Branch preflight failed.";
    renderError(error);
  }
}

async function runGitBranchSwitch() {
  if (!lastGitBranchPreflight?.token || !lastGitBranchPreflight?.branch) {
    elements.gitPreflightState.textContent = "Run branch preflight first.";
    return;
  }

  elements.gitSwitchButton.disabled = true;
  elements.gitPreflightState.textContent = "Switching branch.";
  hideError();

  try {
    const response = await fetch(gitBranchSwitchEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        workspace: selectedWorkspaceId,
        branch: lastGitBranchPreflight.branch,
        preflightToken: lastGitBranchPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderGitBranchSwitch(payload);
    await refreshGitWorktree({ manageLoading: false });
  } catch (error) {
    elements.gitPreflightState.textContent = "Branch switch failed.";
    renderError(error);
  } finally {
    lastGitBranchPreflight = null;
    elements.gitSwitchButton.disabled = true;
  }
}

async function runGitBranchCreatePreflight() {
  const branch = elements.gitCreateInput.value.trim();
  if (!branch) {
    elements.gitCreateState.textContent = "Branch name required.";
    return;
  }

  lastGitBranchCreatePreflight = null;
  elements.gitCreateButton.disabled = true;
  elements.gitCreateState.textContent = "Checking branch creation.";
  hideError();

  try {
    const response = await fetch(gitBranchCreatePreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        workspace: selectedWorkspaceId,
        branch,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderGitBranchCreatePreflight(payload);
  } catch (error) {
    elements.gitCreateState.textContent = "Branch create preflight failed.";
    renderError(error);
  }
}

async function runGitBranchCreate() {
  if (!lastGitBranchCreatePreflight?.token || !lastGitBranchCreatePreflight?.branch) {
    elements.gitCreateState.textContent = "Run branch create preflight first.";
    return;
  }

  elements.gitCreateButton.disabled = true;
  elements.gitCreateState.textContent = "Creating branch.";
  hideError();

  try {
    const response = await fetch(gitBranchCreateEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        workspace: selectedWorkspaceId,
        branch: lastGitBranchCreatePreflight.branch,
        preflightToken: lastGitBranchCreatePreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderGitBranchCreate(payload);
    await refreshGitWorktree({ manageLoading: false });
  } catch (error) {
    elements.gitCreateState.textContent = "Branch create failed.";
    renderError(error);
  } finally {
    lastGitBranchCreatePreflight = null;
    elements.gitCreateButton.disabled = true;
  }
}

async function runGitBranchDeletePreflight(branchName) {
  hideError();
  lastGitBranchDeletePreflight = null;
  elements.gitDeleteButton.disabled = true;
  elements.gitDeleteState.textContent = "Checking branch deletion.";

  try {
    const response = await fetch(gitBranchDeletePreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        workspace: selectedWorkspaceId,
        branch: branchName,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderGitBranchDeletePreflight(payload);
  } catch (error) {
    elements.gitDeleteState.textContent = "Branch delete preflight failed.";
    renderError(error);
  }
}

async function runGitBranchDelete() {
  if (!lastGitBranchDeletePreflight?.token || !lastGitBranchDeletePreflight?.branch) {
    elements.gitDeleteState.textContent = "Run branch delete preflight first.";
    return;
  }

  elements.gitDeleteButton.disabled = true;
  elements.gitDeleteState.textContent = "Deleting branch.";
  hideError();

  try {
    const response = await fetch(gitBranchDeleteEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        workspace: selectedWorkspaceId,
        branch: lastGitBranchDeletePreflight.branch,
        preflightToken: lastGitBranchDeletePreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderGitBranchDelete(payload);
    await refreshGitWorktree({ manageLoading: false });
  } catch (error) {
    elements.gitDeleteState.textContent = "Branch delete failed.";
    renderError(error);
  } finally {
    lastGitBranchDeletePreflight = null;
    elements.gitDeleteButton.disabled = true;
  }
}

async function runGitCommitPreflight() {
  const message = elements.gitCommitInput.value;
  if (!message.trim()) {
    elements.gitCommitState.textContent = "Commit message required.";
    return;
  }

  lastGitCommitPreflight = null;
  elements.gitCommitButton.disabled = true;
  setGitCommitLoading(true);
  hideError();

  try {
    const response = await fetch(gitCommitPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        workspace: selectedWorkspaceId,
        message,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderGitCommitPreflight(payload);
  } catch (error) {
    elements.gitCommitState.textContent = "Commit preflight failed.";
    renderError(error);
  } finally {
    setGitCommitLoading(false);
  }
}

async function runGitCommit() {
  if (!lastGitCommitPreflight?.token) {
    elements.gitCommitState.textContent = "Run commit preflight first.";
    return;
  }

  const message = elements.gitCommitInput.value;
  if (!message.trim()) {
    elements.gitCommitState.textContent = "Commit message required.";
    return;
  }

  elements.gitCommitButton.disabled = true;
  elements.gitCommitState.textContent = "Creating commit.";
  hideError();

  try {
    const response = await fetch(gitCommitEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        workspace: selectedWorkspaceId,
        message,
        preflightToken: lastGitCommitPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderGitCommit(payload);
    await refreshGitWorktree({ manageLoading: false });
  } catch (error) {
    elements.gitCommitState.textContent = "Commit failed.";
    renderError(error);
  } finally {
    lastGitCommitPreflight = null;
    elements.gitCommitButton.disabled = true;
  }
}

async function runGitWorktreePreflight() {
  const action = elements.gitWorktreeAction.value;
  const path = elements.gitWorktreePath.value;
  const branch = elements.gitWorktreeBranch.value.trim();
  if (!path.trim()) {
    elements.gitWorktreeState.textContent = "Worktree path required.";
    return;
  }
  if (action === "create" && !branch) {
    elements.gitWorktreeState.textContent = "Branch required for worktree creation.";
    return;
  }

  lastGitWorktreePreflight = null;
  elements.gitWorktreeButton.disabled = true;
  setGitWorktreePreflightLoading(true);
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    action,
    path,
  };
  if (action === "create") {
    body.branch = branch;
  }

  try {
    const response = await fetch(gitWorktreePreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderGitWorktreePreflight(payload);
  } catch (error) {
    elements.gitWorktreeState.textContent = "Worktree preflight failed.";
    renderError(error);
  } finally {
    setGitWorktreePreflightLoading(false);
  }
}

async function runGitWorktreeAction() {
  if (!lastGitWorktreePreflight?.token) {
    elements.gitWorktreeState.textContent = "Run worktree preflight first.";
    return;
  }

  elements.gitWorktreeButton.disabled = true;
  elements.gitWorktreeState.textContent = "Running worktree action.";
  hideError();

  try {
    const body = {
      workspace: selectedWorkspaceId,
      action: lastGitWorktreePreflight.action,
      path: lastGitWorktreePreflight.path,
      preflightToken: lastGitWorktreePreflight.token,
    };
    if (lastGitWorktreePreflight.action === "create") {
      body.branch = lastGitWorktreePreflight.branch;
    }
    const response = await fetch(gitWorktreeActionEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderGitWorktreeAction(payload);
    await refreshGitWorktree({ manageLoading: false });
  } catch (error) {
    elements.gitWorktreeState.textContent = "Worktree action failed.";
    renderError(error);
  } finally {
    lastGitWorktreePreflight = null;
    elements.gitWorktreeButton.disabled = true;
  }
}

function renderWorkspaces(workspaces) {
  elements.workspaceSelect.replaceChildren();

  for (const workspace of workspaces) {
    const option = document.createElement("option");
    option.value = workspace.id;
    option.textContent = workspace.isDefault ? `${workspace.label} (default)` : workspace.label;
    elements.workspaceSelect.append(option);
  }

  const defaultWorkspace = workspaces.find((workspace) => workspace.isDefault) ?? workspaces[0];
  selectedWorkspaceId = defaultWorkspace?.id ?? null;
  if (pendingRoute?.workspaceId && workspaces.some((workspace) => workspace.id === pendingRoute.workspaceId)) {
    selectedWorkspaceId = pendingRoute.workspaceId;
  }
  elements.workspaceSelect.value = selectedWorkspaceId ?? "";
  elements.workspaceSelect.disabled = workspaces.length <= 1;
}

function renderStatus(payload) {
  const config = payload.probes?.config ?? {};
  const threads = payload.probes?.threads ?? {};

  elements.statusText.textContent = "Connected";
  elements.platformText.textContent = joinParts([
    payload.initialize?.platformOs,
    payload.initialize?.platformFamily,
  ]);
  elements.transportText.textContent = payload.transport ?? "-";
  elements.updatedText.textContent = formatTime(payload.generatedAt);
  elements.modelText.textContent = config.model ?? "Unset";
  elements.providerText.textContent = config.modelProvider ?? "Default";
  elements.sandboxText.textContent = config.sandboxMode ?? "Unset";
  elements.approvalText.textContent = formatValue(config.approvalPolicy);
  elements.threadCount.textContent = String(threads.count ?? 0);
  renderAgentCapability(payload.localCapabilities?.agentTurnProbeEnabled === true);
  renderThreads(threads.items ?? [], payload.probes?.archivedThreads?.items ?? []);
}

async function loadThreadDetail(threadIdSuffix, { archived = false } = {}) {
  selectedThreadIdSuffix = threadIdSuffix;
  selectedThreadArchived = Boolean(archived);
  lastTurnPreflight = null;
  lastLiveSessionControlPreflight = null;
  lastMcpToolPreflight = null;
  lastThreadShellCommandPreflight = null;
  lastThreadArchivePreflight = null;
  lastThreadForkPreflight = null;
  lastThreadRenamePreflight = null;
  lastThreadGoalSetPreflight = null;
  lastThreadGoalClearPreflight = null;
  lastThreadMemoryModePreflight = null;
  lastThreadMetadataUpdatePreflight = null;
  lastThreadRollbackPreflight = null;
  lastThreadSafetyLockPreflight = null;
  lastThreadDeletePreflight = null;
  lastThreadCompactPreflight = null;
  elements.liveSessionControlThread.value = threadIdSuffix;
  elements.mcpToolThreadInput.value = threadIdSuffix;
  elements.threadShellCommandThread.value = threadIdSuffix;
  elements.liveSessionControlButton.disabled = true;
  elements.mcpToolRunButton.disabled = true;
  elements.threadShellCommandButton.disabled = true;
  elements.threadGoalButton.disabled = false;
  elements.threadGoalStatus.textContent = "Goal not loaded.";
  elements.threadGoalMutationStatus.textContent = "Goal actions require preflight.";
  elements.threadMemoryModeStatus.textContent = "Memory mode requires preflight.";
  elements.threadMetadataUpdateStatus.textContent = "Metadata update check ready.";
  elements.threadResumeInjectStatus.textContent = "Resume/inject check ready.";
  elements.threadRealtimeStatus.textContent = "Realtime check ready.";
  elements.threadGuardianStatus.textContent = "Guardian check ready.";
  elements.threadTurnsButton.disabled = false;
  elements.threadTurnsStatus.textContent = "Turns page not loaded.";
  elements.threadTurnItemsInput.value = "";
  elements.threadTurnItemsInput.disabled = false;
  elements.threadTurnItemsButton.disabled = false;
  elements.threadTurnItemsStatus.textContent = "Turn items page not loaded.";
  updateThreadArchiveState();
  updateThreadForkState();
  updateThreadRenameState();
  updateThreadGoalMutationState();
  updateThreadMemoryModeState();
  updateThreadMetadataUpdateState();
  updateThreadResumeInjectState();
  updateThreadRealtimeState();
  updateThreadGuardianState();
  updateThreadRollbackState();
  updateThreadSafetyLockState();
  updateThreadDeleteState();
  updateThreadCompactState();
  updateTurnDraftState();
  clearTranscript({ keepThread: true });
  clearChanges({ keepThread: true });
  renderThreadDetailLoading(threadIdSuffix);
  hideError();

  try {
    const params = new URLSearchParams();
    params.set("thread", threadIdSuffix);
    if (selectedWorkspaceId) {
      params.set("workspace", selectedWorkspaceId);
    }

    const response = await fetch(`/api/thread-detail?${params.toString()}`, {
      method: "GET",
      headers: apiHeaders(),
      cache: "no-store",
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadDetail(payload.probes?.threadDetail ?? null);
    renderThreadsSelection();
  } catch (error) {
    renderError(error);
    clearThreadDetail();
  }
}

async function loadThreadGoal() {
  if (!selectedThreadIdSuffix) {
    elements.threadGoalStatus.textContent = "Select thread";
    return;
  }

  elements.threadGoalButton.disabled = true;
  elements.threadGoalStatus.textContent = "Loading goal.";
  hideError();

  try {
    const params = new URLSearchParams();
    params.set("thread", selectedThreadIdSuffix);
    if (selectedWorkspaceId) {
      params.set("workspace", selectedWorkspaceId);
    }

    const response = await fetch(`/api/thread-goal?${params.toString()}`, {
      method: "GET",
      headers: apiHeaders(),
      cache: "no-store",
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadGoal(payload.probes?.threadGoal ?? null, payload.policy ?? null);
  } catch (error) {
    elements.threadGoalStatus.textContent = "Failed";
    renderError(error);
  } finally {
    elements.threadGoalButton.disabled = !selectedThreadIdSuffix;
  }
}

async function loadThreadTurns() {
  if (!selectedThreadIdSuffix) {
    elements.threadTurnsStatus.textContent = "Select thread";
    return;
  }

  elements.threadTurnsButton.disabled = true;
  elements.threadTurnsStatus.textContent = "Loading turns page.";
  hideError();

  try {
    const params = new URLSearchParams();
    params.set("thread", selectedThreadIdSuffix);
    if (selectedWorkspaceId) {
      params.set("workspace", selectedWorkspaceId);
    }

    const response = await fetch(`/api/thread-turns?${params.toString()}`, {
      method: "GET",
      headers: apiHeaders(),
      cache: "no-store",
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadTurns(payload.probes?.threadTurns ?? null, payload.policy ?? null);
  } catch (error) {
    elements.threadTurnsStatus.textContent = "Failed";
    renderError(error);
  } finally {
    elements.threadTurnsButton.disabled = !selectedThreadIdSuffix;
  }
}

async function loadThreadTurnItems() {
  if (!selectedThreadIdSuffix) {
    elements.threadTurnItemsStatus.textContent = "Select thread";
    return;
  }
  const turnIdSuffix = elements.threadTurnItemsInput.value.trim();
  if (!/^[A-Za-z0-9_-]{8}$/.test(turnIdSuffix)) {
    elements.threadTurnItemsStatus.textContent = "Enter 8-character turn suffix";
    return;
  }

  elements.threadTurnItemsButton.disabled = true;
  elements.threadTurnItemsStatus.textContent = "Loading turn items page.";
  hideError();

  try {
    const params = new URLSearchParams();
    params.set("thread", selectedThreadIdSuffix);
    params.set("turn", turnIdSuffix);
    if (selectedWorkspaceId) {
      params.set("workspace", selectedWorkspaceId);
    }

    const response = await fetch(`/api/thread-turn-items?${params.toString()}`, {
      method: "GET",
      headers: apiHeaders(),
      cache: "no-store",
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadTurnItems(payload.probes?.threadTurnItems ?? null, payload.policy ?? null);
  } catch (error) {
    elements.threadTurnItemsStatus.textContent = "Failed";
    renderError(error);
  } finally {
    elements.threadTurnItemsButton.disabled = !selectedThreadIdSuffix;
  }
}

async function loadThreadTranscript() {
  if (!selectedThreadIdSuffix) {
    elements.transcriptStateText.textContent = "Select thread";
    return;
  }

  setTranscriptLoading(true);
  hideError();

  try {
    const params = new URLSearchParams();
    params.set("thread", selectedThreadIdSuffix);
    if (selectedWorkspaceId) {
      params.set("workspace", selectedWorkspaceId);
    }

    const response = await fetch(`/api/thread-transcript?${params.toString()}`, {
      method: "GET",
      headers: apiHeaders(),
      cache: "no-store",
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadTranscript(payload.probes?.threadTranscript ?? null);
  } catch (error) {
    elements.transcriptStateText.textContent = "Failed";
    renderError(error);
  } finally {
    setTranscriptLoading(false);
  }
}

async function loadThreadChanges() {
  if (!selectedThreadIdSuffix) {
    elements.changesStateText.textContent = "Select thread";
    return;
  }

  setChangesLoading(true);
  hideError();

  try {
    const params = new URLSearchParams();
    params.set("thread", selectedThreadIdSuffix);
    if (selectedWorkspaceId) {
      params.set("workspace", selectedWorkspaceId);
    }

    const response = await fetch(`/api/thread-changes?${params.toString()}`, {
      method: "GET",
      headers: apiHeaders(),
      cache: "no-store",
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadChanges(payload.probes?.threadChanges ?? null);
  } catch (error) {
    elements.changesStateText.textContent = "Failed";
    renderError(error);
  } finally {
    setChangesLoading(false);
  }
}

async function runThreadStartPreflight() {
  setThreadStartLoading(true);
  lastThreadStartPreflight = null;
  elements.threadStartButton.disabled = true;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
  };

  try {
    const response = await fetch(threadStartPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastThreadStartPreflight = {
      body,
      token: payload.preflight?.token ?? null,
    };
    renderThreadStartPreflight(payload);
  } catch (error) {
    elements.threadStartStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setThreadStartLoading(false);
  }
}

async function runThreadStart() {
  if (!lastThreadStartPreflight?.token || !lastThreadStartPreflight?.body) {
    elements.threadStartStatus.textContent = "Run preflight first";
    return;
  }

  elements.threadStartButton.disabled = true;
  elements.threadStartStatus.textContent = "Creating";
  hideError();

  try {
    const response = await fetch(threadStartEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastThreadStartPreflight.body,
        preflightToken: lastThreadStartPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadStart(payload);
    const threadIdSuffix = payload.target?.threadIdSuffix;
    if (threadIdSuffix) {
      pendingRoute = {
        workspaceId: selectedWorkspaceId,
        threadIdSuffix,
      };
    }
    await refreshStatus({ manageLoading: false });
  } catch (error) {
    elements.threadStartStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastThreadStartPreflight = null;
    elements.threadStartButton.disabled = true;
  }
}

async function runThreadArchivePreflight() {
  if (!selectedThreadIdSuffix) {
    elements.threadArchiveStatus.textContent = "Select a thread first";
    return;
  }

  setThreadArchiveLoading(true);
  lastThreadArchivePreflight = null;
  elements.threadArchiveButton.disabled = true;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    thread: selectedThreadIdSuffix,
    action: selectedThreadArchived ? "unarchive" : "archive",
  };

  try {
    const response = await fetch(threadArchivePreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastThreadArchivePreflight = {
      body,
      token: payload.preflight?.token ?? null,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderThreadArchivePreflight(payload);
  } catch (error) {
    elements.threadArchiveStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setThreadArchiveLoading(false);
  }
}

async function runThreadArchiveAction() {
  if (!lastThreadArchivePreflight?.token || !lastThreadArchivePreflight?.body) {
    elements.threadArchiveStatus.textContent = "Run preflight first";
    return;
  }

  elements.threadArchiveButton.disabled = true;
  elements.threadArchiveStatus.textContent =
    lastThreadArchivePreflight.body.action === "unarchive" ? "Unarchiving" : "Archiving";
  hideError();

  try {
    const response = await fetch(threadArchiveEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastThreadArchivePreflight.body,
        preflightToken: lastThreadArchivePreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadArchiveAction(payload);
    const threadIdSuffix = payload.target?.threadIdSuffix ?? selectedThreadIdSuffix;
    selectedThreadArchived = payload.target?.archived === true;
    pendingRoute = {
      workspaceId: selectedWorkspaceId,
      threadIdSuffix,
    };
    if (selectedThreadArchived) {
      elements.archivedToggle.checked = true;
    }
    await refreshStatus({ manageLoading: false });
  } catch (error) {
    elements.threadArchiveStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastThreadArchivePreflight = null;
    lastThreadForkPreflight = null;
    lastThreadRenamePreflight = null;
    lastThreadRollbackPreflight = null;
    lastThreadSafetyLockPreflight = null;
    lastThreadDeletePreflight = null;
    updateThreadArchiveState();
    updateThreadForkState();
    updateThreadRenameState();
    updateThreadRollbackState();
    updateThreadSafetyLockState();
    updateThreadDeleteState();
  }
}

async function runThreadForkPreflight() {
  if (!selectedThreadIdSuffix) {
    elements.threadForkStatus.textContent = "Select a thread first";
    return;
  }

  setThreadForkLoading(true);
  lastThreadForkPreflight = null;
  elements.threadForkButton.disabled = true;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    thread: selectedThreadIdSuffix,
  };

  try {
    const response = await fetch(threadForkPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastThreadForkPreflight = {
      body,
      token: payload.preflight?.token ?? null,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderThreadForkPreflight(payload);
  } catch (error) {
    elements.threadForkStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setThreadForkLoading(false);
  }
}

async function runThreadForkAction() {
  if (!lastThreadForkPreflight?.token || !lastThreadForkPreflight?.body) {
    elements.threadForkStatus.textContent = "Run fork check first";
    return;
  }

  elements.threadForkButton.disabled = true;
  elements.threadForkStatus.textContent = "Forking";
  hideError();

  try {
    const response = await fetch(threadForkEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastThreadForkPreflight.body,
        preflightToken: lastThreadForkPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadForkAction(payload);
    const threadIdSuffix = payload.target?.threadIdSuffix;
    if (threadIdSuffix) {
      pendingRoute = {
        workspaceId: selectedWorkspaceId,
        threadIdSuffix,
      };
    }
    await refreshStatus({ manageLoading: false });
  } catch (error) {
    elements.threadForkStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastThreadForkPreflight = null;
    lastThreadRollbackPreflight = null;
    lastThreadSafetyLockPreflight = null;
    updateThreadForkState();
    updateThreadRollbackState();
    updateThreadSafetyLockState();
  }
}

async function runThreadRenamePreflight() {
  if (!selectedThreadIdSuffix) {
    elements.threadRenameStatus.textContent = "Select a thread first";
    return;
  }
  const name = elements.threadRenameInput.value.trim();
  if (!name) {
    elements.threadRenameStatus.textContent = "Name required";
    return;
  }

  setThreadRenameLoading(true);
  lastThreadRenamePreflight = null;
  elements.threadRenameButton.disabled = true;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    thread: selectedThreadIdSuffix,
    name,
  };

  try {
    const response = await fetch(threadRenamePreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastThreadRenamePreflight = {
      body,
      token: payload.preflight?.token ?? null,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderThreadRenamePreflight(payload);
  } catch (error) {
    elements.threadRenameStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setThreadRenameLoading(false);
  }
}

async function runThreadRenameAction() {
  if (!lastThreadRenamePreflight?.token || !lastThreadRenamePreflight?.body) {
    elements.threadRenameStatus.textContent = "Run rename check first";
    return;
  }

  elements.threadRenameButton.disabled = true;
  elements.threadRenameStatus.textContent = "Renaming";
  hideError();

  try {
    const response = await fetch(threadRenameEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastThreadRenamePreflight.body,
        preflightToken: lastThreadRenamePreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadRenameAction(payload);
    lastThreadRenamePreflight = null;
    lastThreadSafetyLockPreflight = null;
    await refreshStatus({ manageLoading: false });
  } catch (error) {
    elements.threadRenameStatus.textContent = "Failed";
    renderError(error);
  } finally {
    updateThreadRenameState();
    updateThreadRollbackState();
    updateThreadSafetyLockState();
    updateThreadForkState();
  }
}

function threadGoalSetBody() {
  const tokenBudgetRaw = elements.threadGoalBudgetInput.value.trim();
  return {
    workspace: selectedWorkspaceId,
    thread: selectedThreadIdSuffix,
    objective: elements.threadGoalObjectiveInput.value.trim(),
    status: elements.threadGoalStatusSelect.value || "active",
    tokenBudget: tokenBudgetRaw ? Number(tokenBudgetRaw) : null,
  };
}

async function runThreadGoalSetPreflight() {
  if (!selectedThreadIdSuffix) {
    elements.threadGoalMutationStatus.textContent = "Select a thread first";
    return;
  }
  const body = threadGoalSetBody();
  if (!body.objective) {
    elements.threadGoalMutationStatus.textContent = "Goal objective required";
    return;
  }

  setThreadGoalSetLoading(true);
  lastThreadGoalSetPreflight = null;
  elements.threadGoalSetButton.disabled = true;
  hideError();

  try {
    const response = await fetch(threadGoalSetPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastThreadGoalSetPreflight = {
      body,
      token: payload.preflight?.token ?? null,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderThreadGoalSetPreflight(payload);
  } catch (error) {
    elements.threadGoalMutationStatus.textContent = "Goal set check failed";
    renderError(error);
  } finally {
    setThreadGoalSetLoading(false);
  }
}

async function runThreadGoalSetAction() {
  if (!lastThreadGoalSetPreflight?.token || !lastThreadGoalSetPreflight?.body) {
    elements.threadGoalMutationStatus.textContent = "Run goal set check first";
    return;
  }

  elements.threadGoalSetButton.disabled = true;
  elements.threadGoalMutationStatus.textContent = "Setting goal";
  hideError();

  try {
    const response = await fetch(threadGoalSetEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastThreadGoalSetPreflight.body,
        preflightToken: lastThreadGoalSetPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadGoalSetAction(payload);
    lastThreadGoalSetPreflight = null;
    await loadThreadGoal().catch(() => {});
  } catch (error) {
    elements.threadGoalMutationStatus.textContent = "Goal set failed";
    renderError(error);
  } finally {
    updateThreadGoalMutationState();
  }
}

async function runThreadGoalClearPreflight() {
  if (!selectedThreadIdSuffix) {
    elements.threadGoalMutationStatus.textContent = "Select a thread first";
    return;
  }

  setThreadGoalClearLoading(true);
  lastThreadGoalClearPreflight = null;
  elements.threadGoalClearButton.disabled = true;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    thread: selectedThreadIdSuffix,
  };

  try {
    const response = await fetch(threadGoalClearPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastThreadGoalClearPreflight = {
      body,
      token: payload.preflight?.token ?? null,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderThreadGoalClearPreflight(payload);
  } catch (error) {
    elements.threadGoalMutationStatus.textContent = "Goal clear check failed";
    renderError(error);
  } finally {
    setThreadGoalClearLoading(false);
  }
}

async function runThreadGoalClearAction() {
  if (!lastThreadGoalClearPreflight?.token || !lastThreadGoalClearPreflight?.body) {
    elements.threadGoalMutationStatus.textContent = "Run goal clear check first";
    return;
  }

  elements.threadGoalClearButton.disabled = true;
  elements.threadGoalMutationStatus.textContent = "Clearing goal";
  hideError();

  try {
    const response = await fetch(threadGoalClearEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastThreadGoalClearPreflight.body,
        preflightToken: lastThreadGoalClearPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadGoalClearAction(payload);
    lastThreadGoalClearPreflight = null;
    await loadThreadGoal().catch(() => {});
  } catch (error) {
    elements.threadGoalMutationStatus.textContent = "Goal clear failed";
    renderError(error);
  } finally {
    updateThreadGoalMutationState();
  }
}

async function runThreadMemoryModePreflight() {
  if (!selectedThreadIdSuffix) {
    elements.threadMemoryModeStatus.textContent = "Select a thread first";
    return;
  }

  setThreadMemoryModeLoading(true);
  lastThreadMemoryModePreflight = null;
  elements.threadMemoryModeButton.disabled = true;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    thread: selectedThreadIdSuffix,
    mode: elements.threadMemoryModeSelect.value || "enabled",
  };

  try {
    const response = await fetch(threadMemoryModePreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastThreadMemoryModePreflight = {
      body,
      token: payload.preflight?.token ?? null,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderThreadMemoryModePreflight(payload);
  } catch (error) {
    elements.threadMemoryModeStatus.textContent = "Memory check failed";
    renderError(error);
  } finally {
    setThreadMemoryModeLoading(false);
  }
}

async function runThreadMemoryModeAction() {
  if (!lastThreadMemoryModePreflight?.token || !lastThreadMemoryModePreflight?.body) {
    elements.threadMemoryModeStatus.textContent = "Run memory check first";
    return;
  }

  elements.threadMemoryModeButton.disabled = true;
  elements.threadMemoryModeStatus.textContent = "Setting memory";
  hideError();

  try {
    const response = await fetch(threadMemoryModeEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastThreadMemoryModePreflight.body,
        preflightToken: lastThreadMemoryModePreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadMemoryModeAction(payload);
    lastThreadMemoryModePreflight = null;
    await refreshStatus({ manageLoading: false }).catch(() => {});
  } catch (error) {
    elements.threadMemoryModeStatus.textContent = "Memory set failed";
    renderError(error);
  } finally {
    updateThreadMemoryModeState();
  }
}

async function runThreadMetadataUpdatePreflight() {
  if (!selectedThreadIdSuffix) {
    elements.threadMetadataUpdateStatus.textContent = "Select a thread first";
    return;
  }

  setThreadMetadataUpdateLoading(true);
  lastThreadMetadataUpdatePreflight = null;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    thread: selectedThreadIdSuffix,
    arguments: elements.threadMetadataArgumentsInput.value,
  };

  try {
    const response = await fetch(threadMetadataUpdatePreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastThreadMetadataUpdatePreflight = {
      body,
      token: payload.preflight?.token ?? null,
      enabled: false,
    };
    renderThreadMetadataUpdatePreflight(payload);
  } catch (error) {
    elements.threadMetadataUpdateStatus.textContent = "Metadata check failed";
    renderError(error);
  } finally {
    setThreadMetadataUpdateLoading(false);
  }
}

async function runThreadResumeInjectPreflight() {
  if (!selectedThreadIdSuffix) {
    elements.threadResumeInjectStatus.textContent = "Select a thread first";
    return;
  }

  setThreadResumeInjectLoading(true);
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    method: elements.threadResumeInjectMethodSelect.value,
    thread: selectedThreadIdSuffix,
    arguments: elements.threadResumeInjectArgumentsInput.value,
  };

  try {
    const response = await fetch(threadResumeInjectPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadResumeInjectPreflight(payload);
  } catch (error) {
    elements.threadResumeInjectStatus.textContent = "Resume/inject check failed";
    renderError(error);
  } finally {
    setThreadResumeInjectLoading(false);
  }
}

async function runThreadRealtimePreflight() {
  if (!selectedThreadIdSuffix) {
    elements.threadRealtimeStatus.textContent = "Select a thread first";
    return;
  }

  setThreadRealtimeLoading(true);
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    method: elements.threadRealtimeMethodSelect.value,
    thread: selectedThreadIdSuffix,
    arguments: elements.threadRealtimeArgumentsInput.value,
  };

  try {
    const response = await fetch(threadRealtimePreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadRealtimePreflight(payload);
  } catch (error) {
    elements.threadRealtimeStatus.textContent = "Realtime check failed";
    renderError(error);
  } finally {
    setThreadRealtimeLoading(false);
  }
}

async function runThreadGuardianPreflight() {
  if (!selectedThreadIdSuffix) {
    elements.threadGuardianStatus.textContent = "Select a thread first";
    return;
  }

  setThreadGuardianLoading(true);
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    method: elements.threadGuardianMethodSelect.value,
    thread: selectedThreadIdSuffix,
    arguments: elements.threadGuardianArgumentsInput.value,
  };

  try {
    const response = await fetch(threadGuardianPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadGuardianPreflight(payload);
  } catch (error) {
    elements.threadGuardianStatus.textContent = "Guardian check failed";
    renderError(error);
  } finally {
    setThreadGuardianLoading(false);
  }
}

async function runThreadRollbackPreflight() {
  if (!selectedThreadIdSuffix) {
    elements.threadRollbackStatus.textContent = "Select a thread first";
    return;
  }
  const numTurns = Number(elements.threadRollbackTurnsInput.value);
  if (!Number.isSafeInteger(numTurns) || numTurns < 1 || numTurns > 50) {
    elements.threadRollbackStatus.textContent = "Turns must be 1-50";
    return;
  }

  setThreadRollbackLoading(true);
  lastThreadRollbackPreflight = null;
  elements.threadRollbackButton.disabled = true;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    thread: selectedThreadIdSuffix,
    numTurns,
  };

  try {
    const response = await fetch(threadRollbackPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastThreadRollbackPreflight = {
      body,
      token: payload.preflight?.token ?? null,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderThreadRollbackPreflight(payload);
  } catch (error) {
    elements.threadRollbackStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setThreadRollbackLoading(false);
  }
}

async function runThreadRollbackAction() {
  if (!lastThreadRollbackPreflight?.token || !lastThreadRollbackPreflight?.body) {
    elements.threadRollbackStatus.textContent = "Run rollback check first";
    return;
  }

  elements.threadRollbackButton.disabled = true;
  elements.threadRollbackStatus.textContent = "Rolling back";
  hideError();

  try {
    const response = await fetch(threadRollbackEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastThreadRollbackPreflight.body,
        preflightToken: lastThreadRollbackPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadRollbackAction(payload);
    await refreshStatus({ manageLoading: false });
  } catch (error) {
    elements.threadRollbackStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastThreadRollbackPreflight = null;
    lastThreadSafetyLockPreflight = null;
    updateThreadRollbackState();
    updateThreadSafetyLockState();
  }
}

async function runThreadSafetyLockPreflight() {
  if (!selectedThreadIdSuffix) {
    elements.threadSafetyLockStatus.textContent = "Select a thread first";
    return;
  }

  setThreadSafetyLockLoading(true);
  lastThreadSafetyLockPreflight = null;
  elements.threadSafetyLockButton.disabled = true;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    thread: selectedThreadIdSuffix,
  };

  try {
    const response = await fetch(threadSafetyLockPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastThreadSafetyLockPreflight = {
      body,
      token: payload.preflight?.token ?? null,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderThreadSafetyLockPreflight(payload);
  } catch (error) {
    elements.threadSafetyLockStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setThreadSafetyLockLoading(false);
  }
}

async function runThreadSafetyLockAction() {
  if (!lastThreadSafetyLockPreflight?.token || !lastThreadSafetyLockPreflight?.body) {
    elements.threadSafetyLockStatus.textContent = "Run safety check first";
    return;
  }

  elements.threadSafetyLockButton.disabled = true;
  elements.threadSafetyLockStatus.textContent = "Locking";
  hideError();

  try {
    const response = await fetch(threadSafetyLockEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastThreadSafetyLockPreflight.body,
        preflightToken: lastThreadSafetyLockPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadSafetyLockAction(payload);
    await refreshStatus({ manageLoading: false });
  } catch (error) {
    elements.threadSafetyLockStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastThreadSafetyLockPreflight = null;
    updateThreadSafetyLockState();
  }
}

async function runThreadDeletePreflight() {
  if (!selectedThreadIdSuffix) {
    elements.threadDeleteStatus.textContent = "Select a thread first";
    return;
  }

  setThreadDeleteLoading(true);
  lastThreadDeletePreflight = null;
  elements.threadDeleteButton.disabled = true;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    thread: selectedThreadIdSuffix,
    archived: selectedThreadArchived,
  };

  try {
    const response = await fetch(threadDeletePreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastThreadDeletePreflight = {
      body,
      token: payload.preflight?.token ?? null,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderThreadDeletePreflight(payload);
  } catch (error) {
    elements.threadDeleteStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setThreadDeleteLoading(false);
  }
}

async function runThreadDeleteAction() {
  if (!lastThreadDeletePreflight?.token || !lastThreadDeletePreflight?.body) {
    elements.threadDeleteStatus.textContent = "Run delete check first";
    return;
  }

  elements.threadDeleteButton.disabled = true;
  elements.threadDeleteStatus.textContent = "Deleting";
  hideError();

  try {
    const response = await fetch(threadDeleteEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastThreadDeletePreflight.body,
        preflightToken: lastThreadDeletePreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadDeleteAction(payload);
    selectedThreadIdSuffix = null;
    selectedThreadArchived = false;
    clearThreadDetail();
    renderThreadDeleteAction(payload);
    await refreshStatus({ manageLoading: false });
  } catch (error) {
    elements.threadDeleteStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastThreadDeletePreflight = null;
    lastThreadForkPreflight = null;
    lastThreadRenamePreflight = null;
    lastThreadRollbackPreflight = null;
    lastThreadSafetyLockPreflight = null;
    updateThreadForkState();
    updateThreadRenameState();
    updateThreadRollbackState();
    updateThreadSafetyLockState();
    updateThreadDeleteState();
  }
}

async function runThreadCompactPreflight() {
  if (!selectedThreadIdSuffix || selectedThreadArchived) {
    elements.threadCompactStatus.textContent = selectedThreadArchived
      ? "Archived thread selected"
      : "Select a thread first";
    return;
  }

  setThreadCompactLoading(true);
  lastThreadCompactPreflight = null;
  elements.threadCompactButton.disabled = true;
  hideError();

  const body = {
    workspace: selectedWorkspaceId,
    thread: selectedThreadIdSuffix,
  };

  try {
    const response = await fetch(threadCompactPreflightEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    lastThreadCompactPreflight = {
      body,
      token: payload.preflight?.token ?? null,
      enabled: payload.policy?.executionGateEnabled === true,
    };
    renderThreadCompactPreflight(payload);
  } catch (error) {
    elements.threadCompactStatus.textContent = "Failed";
    renderError(error);
  } finally {
    setThreadCompactLoading(false);
  }
}

async function runThreadCompactStart() {
  if (!lastThreadCompactPreflight?.token || !lastThreadCompactPreflight?.body) {
    elements.threadCompactStatus.textContent = "Run preflight first";
    return;
  }

  elements.threadCompactButton.disabled = true;
  elements.threadCompactStatus.textContent = "Starting";
  hideError();

  try {
    const response = await fetch(threadCompactEndpoint(), {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        ...lastThreadCompactPreflight.body,
        preflightToken: lastThreadCompactPreflight.token,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadCompactStart(payload);
    await refreshTurnSessions().catch(() => {});
    await refreshExecutionGate().catch(() => {});
  } catch (error) {
    elements.threadCompactStatus.textContent = "Failed";
    renderError(error);
  } finally {
    lastThreadCompactPreflight = null;
    updateThreadCompactState();
  }
}

async function runTurnPreflight() {
  if (!selectedThreadIdSuffix) {
    elements.turnPreflightStatus.textContent = "Select a thread first.";
    return;
  }

  setTurnPreflightLoading(true);
  hideError();

  try {
    const response = await fetch("/api/turn-preflight", {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        workspace: selectedWorkspaceId,
        thread: selectedThreadIdSuffix,
        prompt: elements.turnInput.value,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderTurnPreflight(payload);
  } catch (error) {
    renderError(error);
    elements.turnPreflightStatus.textContent = "Failed";
  } finally {
    setTurnPreflightLoading(false);
  }
}

async function runTurnStart() {
  if (!selectedThreadIdSuffix) {
    elements.turnPreflightStatus.textContent = "Select a thread first.";
    return;
  }

  setTurnStartLoading(true);
  startApprovalPolling();
  hideError();

  try {
    const response = await fetch("/api/turn-start", {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        workspace: selectedWorkspaceId,
        thread: selectedThreadIdSuffix,
        prompt: elements.turnInput.value,
        preflightToken: lastTurnPreflight?.token ?? null,
      }),
    });
    const payload = await response.json();
    if (response.status === 403 && payload.action?.type === "turn-start") {
      renderTurnStartBlocked(payload);
      return;
    }
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderTurnStartStarted(payload);
    await refreshApprovalDecisions();
    await refreshTurnSessions();
  } catch (error) {
    renderError(error);
    elements.turnPreflightStatus.textContent = "Failed";
  } finally {
    stopApprovalPolling();
    await refreshApprovalDecisions().catch(() => {});
    setTurnStartLoading(false);
  }
}

function startApprovalPolling() {
  if (approvalRefreshTimer) {
    return;
  }
  setApprovalRefreshState("Polling");
  approvalRefreshTimer = window.setInterval(() => {
    refreshApprovalDecisions().catch(() => {});
  }, 1000);
}

function stopApprovalPolling() {
  if (!approvalRefreshTimer) {
    setApprovalRefreshState("Manual");
    return;
  }
  window.clearInterval(approvalRefreshTimer);
  approvalRefreshTimer = null;
  setApprovalRefreshState("Manual");
}

function setApprovalRefreshState(state) {
  elements.approvalRefreshState.textContent = state;
}

async function startEventStream() {
  streamAbortController = new AbortController();
  streamEventCount = 0;
  elements.streamEventLog.replaceChildren();
  setStreamState("Connecting", true);
  hideError();

  try {
    const params = new URLSearchParams();
    params.set("durationMs", "15000");
    if (selectedWorkspaceId) {
      params.set("workspace", selectedWorkspaceId);
    }
    if (selectedThreadIdSuffix) {
      params.set("thread", selectedThreadIdSuffix);
    }

    const response = await fetch(`/api/event-stream?${params.toString()}`, {
      method: "GET",
      headers: apiHeaders(),
      cache: "no-store",
      signal: streamAbortController.signal,
    });
    if (!response.ok || !response.body) {
      throw new Error(`HTTP ${response.status}`);
    }

    setStreamState("Listening", true);
    await readEventStream(response.body);
  } catch (error) {
    if (error.name !== "AbortError") {
      renderError(error);
      setStreamState("Failed", false);
    }
  } finally {
    if (streamAbortController?.signal.aborted) {
      setStreamState("Stopped", false);
    } else if (elements.streamStatusText.textContent !== "Failed") {
      setStreamState("Idle", false);
    }
    streamAbortController = null;
  }
}

function stopEventStream() {
  streamAbortController?.abort();
}

async function readEventStream(body) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    let separatorIndex = buffer.indexOf("\n\n");
    while (separatorIndex !== -1) {
      const block = buffer.slice(0, separatorIndex);
      buffer = buffer.slice(separatorIndex + 2);
      handleStreamBlock(block);
      separatorIndex = buffer.indexOf("\n\n");
    }
  }
}

function handleStreamBlock(block) {
  if (!block || block.startsWith(":")) {
    return;
  }

  const lines = block.split("\n");
  const eventName = lines.find((line) => line.startsWith("event: "))?.slice(7) ?? "message";
  const data = lines
    .filter((line) => line.startsWith("data: "))
    .map((line) => line.slice(6))
    .join("\n");
  if (!data) {
    return;
  }

  const payload = JSON.parse(data);
  if (eventName === "notification") {
    appendStreamEvent(payload);
    return;
  }
  if (eventName === "ready") {
    setStreamState("Listening", true);
    return;
  }
  if (eventName === "done") {
    setStreamState("Idle", false);
    return;
  }
  if (eventName === "error") {
    throw new Error(payload.error || "stream failed");
  }
}

function appendStreamEvent(event) {
  streamEventCount += 1;
  elements.streamEventCount.textContent = String(streamEventCount);

  const row = document.createElement("div");
  row.className = "event-row";
  row.setAttribute("role", "listitem");

  const method = document.createElement("span");
  method.className = "event-method";
  method.textContent = event.method ?? "unknown";

  const detail = document.createElement("span");
  detail.className = "event-detail";
  detail.textContent = joinParts([
    event.status,
    event.itemType,
    event.threadIdSuffix ? `thread ${event.threadIdSuffix}` : null,
    event.turnIdSuffix ? `turn ${event.turnIdSuffix}` : null,
  ]);

  row.append(method, detail);
  if (event.liveText?.text) {
    const preview = document.createElement("pre");
    preview.className = "event-preview";
    preview.textContent = event.liveText.text;
    row.append(preview);
  }
  elements.streamEventLog.prepend(row);
}

async function runAgentTurnProbe() {
  setAgentLoading(true);
  hideError();

  try {
    const response = await fetch("/api/agent-turn", {
      method: "POST",
      headers: apiHeaders(),
      cache: "no-store",
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    const result = payload.probes?.agentTurn ?? {};
    elements.agentStatusText.textContent = result.completedStatus ?? "Unknown";
    elements.agentThreadText.textContent = result.threadIdSuffix ?? "-";
    elements.agentTurnText.textContent = result.turnIdSuffix ?? "-";
    renderAgentEvents(result.events ?? []);
  } catch (error) {
    elements.agentStatusText.textContent = "Failed";
    renderError(error);
  } finally {
    setAgentLoading(false);
  }
}

function renderAgentEvents(events) {
  elements.agentEventCount.textContent = String(events.length);
  elements.agentEventLog.replaceChildren();

  if (events.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No events captured.";
    elements.agentEventLog.append(empty);
    return;
  }

  for (const event of events) {
    const row = document.createElement("div");
    row.className = "event-row";
    row.setAttribute("role", "listitem");

    const method = document.createElement("span");
    method.className = "event-method";
    method.textContent = event.method ?? "unknown";

    const detail = document.createElement("span");
    detail.className = "event-detail";
    detail.textContent = joinParts([
      event.status,
      event.itemType,
      event.threadIdSuffix ? `thread ${event.threadIdSuffix}` : null,
      event.turnIdSuffix ? `turn ${event.turnIdSuffix}` : null,
      ...terminalLifecycleParts(event.terminalLifecycle),
    ]);

    row.append(method, detail);
    if (event.liveText?.text) {
      const preview = document.createElement("pre");
      preview.className = "event-preview";
      preview.textContent = event.liveText.text;
      row.append(preview);
    }
    elements.agentEventLog.append(row);
  }
}

function apiHeaders() {
  return {
    Accept: "application/json",
    "X-Codex-App-Port-Token": sessionToken,
  };
}

function jsonHeaders() {
  return {
    ...apiHeaders(),
    "Content-Type": "application/json",
  };
}

function readInitialRoute() {
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : "";
  const params = new URLSearchParams(hash);
  const threadIdSuffix = params.get("thread");
  const workspaceId = params.get("workspace");
  return {
    threadIdSuffix: /^[A-Za-z0-9_-]{8}$/.test(threadIdSuffix ?? "")
      ? threadIdSuffix
      : null,
    workspaceId: /^(?:default|workspace-[0-9]+)$/.test(workspaceId ?? "")
      ? workspaceId
      : null,
  };
}

function renderAgentCapability(enabled) {
  elements.agentGateText.textContent = enabled ? "Enabled" : "Disabled";
  elements.agentButton.disabled = !enabled;
}

function renderThreads(items, archivedItems = []) {
  activeThreadItems = (items ?? []).map((item) => ({ ...item, archived: false }));
  archivedThreadItems = (archivedItems ?? []).map((item) => ({ ...item, archived: true }));
  const allItems = [...activeThreadItems, ...archivedThreadItems];
  if (selectedThreadIdSuffix && !allItems.some((item) => item.idSuffix === selectedThreadIdSuffix)) {
    selectedThreadIdSuffix = null;
    selectedThreadArchived = false;
    clearThreadDetail();
  }

  renderThreadRows();
  applyPendingRoute(allItems);
}

function renderThreadRows() {
  const query = elements.threadSearch.value.trim().toLowerCase();
  const includeArchived = elements.archivedToggle.checked;
  const items = [...activeThreadItems, ...(includeArchived ? archivedThreadItems : [])].filter(
    (item) => threadMatchesQuery(item, query),
  );

  elements.threadList.replaceChildren();
  elements.threadCount.textContent = String(items.length);

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = query || includeArchived
      ? "No matching thread metadata returned."
      : "No recent thread metadata returned.";
    elements.threadList.append(empty);
    return;
  }

  for (const item of items) {
    const row = document.createElement("button");
    row.className = "thread-row";
    row.type = "button";
    row.setAttribute("role", "listitem");
    row.dataset.threadIdSuffix = item.idSuffix ?? "";
    row.addEventListener("click", () => {
      if (item.idSuffix) {
        loadThreadDetail(item.idSuffix, { archived: item.archived === true });
      }
    });

    const title = document.createElement("div");
    title.className = "thread-title";
    title.textContent = `Thread ${item.idSuffix ?? "unknown"}`;

    const meta = document.createElement("div");
    meta.className = "thread-meta";
    meta.textContent = joinParts([
      item.cwdBasename,
      item.archived ? "archived" : "active",
      item.source,
      statusLabel(item.status),
      item.hasPreview ? "preview present" : "no preview",
    ]);

    const updated = document.createElement("time");
    updated.className = "thread-updated";
    updated.textContent = formatUnix(item.updatedAt);

    row.append(title, meta, updated);
    elements.threadList.append(row);
  }
  renderThreadsSelection();
}

async function runThreadServerSearch() {
  const searchTerm = elements.threadSearch.value;
  if (!searchTerm.trim()) {
    elements.threadServerSearchStatus.textContent = "Enter a search term.";
    elements.threadServerSearchList.replaceChildren();
    return;
  }

  elements.threadServerSearchButton.disabled = true;
  elements.threadServerSearchStatus.textContent = "Searching.";
  hideError();

  try {
    const response = await fetch("/api/thread-search", {
      method: "POST",
      headers: jsonHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        workspace: selectedWorkspaceId,
        searchTerm,
        archived: elements.archivedToggle.checked,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      if (payload.threadSearch) {
        renderThreadServerSearch(payload);
        return;
      }
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    renderThreadServerSearch(payload);
  } catch (error) {
    elements.threadServerSearchStatus.textContent = "Server search failed.";
    renderError(error);
  } finally {
    elements.threadServerSearchButton.disabled = false;
  }
}

function renderThreadServerSearch(payload) {
  const search = payload.threadSearch ?? {};
  const items = Array.isArray(search.items) ? search.items : [];
  elements.threadServerSearchList.replaceChildren();
  elements.threadServerSearchStatus.textContent = threadServerSearchStatusText(search);

  if (items.length === 0) {
    elements.threadServerSearchList.append(
      emptyState(search.enabled ? "No server search matches returned." : "Server search blocked."),
    );
    return;
  }

  for (const item of items) {
    const row = document.createElement("button");
    row.className = "thread-row";
    row.type = "button";
    row.setAttribute("role", "listitem");
    row.dataset.threadIdSuffix = item.idSuffix ?? "";
    row.addEventListener("click", () => {
      if (item.idSuffix) {
        loadThreadDetail(item.idSuffix, { archived: item.archived === true });
      }
    });

    const title = document.createElement("div");
    title.className = "thread-title";
    title.textContent = `Thread ${item.idSuffix ?? "unknown"}`;

    const meta = document.createElement("div");
    meta.className = "thread-meta";
    meta.textContent = joinParts([
      "server search",
      item.cwdBasename,
      item.archived ? "archived" : "active",
      item.source,
      statusLabel(item.status),
      item.hasSnippet ? "snippet present" : "no snippet",
    ]);

    const updated = document.createElement("time");
    updated.className = "thread-updated";
    updated.textContent = formatUnix(item.updatedAt);

    row.append(title, meta, updated);
    elements.threadServerSearchList.append(row);
  }
}

function threadServerSearchStatusText(search) {
  if (!search.enabled) {
    return "Server search disabled by default.";
  }
  const count = Number.isSafeInteger(search.count) ? search.count : 0;
  const returned = Number.isSafeInteger(search.returnedCount) ? search.returnedCount : 0;
  return joinParts([
    `${returned} / ${count} returned`,
    search.archivedFilter ? "archived" : "active",
    search.hasNextCursor ? "more" : null,
    search.snippetCount ? `${search.snippetCount} snippets omitted` : "snippets omitted",
  ]);
}

function threadMatchesQuery(item, query) {
  if (!query) {
    return true;
  }
  return [
    item.idSuffix,
    item.cwdBasename,
    item.source,
    item.modelProvider,
    statusLabel(item.status),
    item.archived ? "archived" : "active",
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(query));
}

function applyPendingRoute(items) {
  if (!pendingRoute?.threadIdSuffix) {
    return;
  }
  const match = items.find((item) => item.idSuffix === pendingRoute.threadIdSuffix);
  if (!match) {
    return;
  }
  pendingRoute = null;
  if (match.archived) {
    elements.archivedToggle.checked = true;
    renderThreadRows();
  }
  loadThreadDetail(match.idSuffix, { archived: match.archived === true });
}

function renderThreadsSelection() {
  for (const row of elements.threadList.querySelectorAll(".thread-row")) {
    const isSelected = row.dataset.threadIdSuffix === selectedThreadIdSuffix;
    row.classList.toggle("selected", isSelected);
    row.setAttribute("aria-pressed", String(isSelected));
  }
}

function renderThreadStartPreflight(payload) {
  elements.threadStartStatus.textContent = payload.policy?.executionGateEnabled
    ? "Ready"
    : "Blocked";
  elements.threadStartButton.disabled =
    !lastThreadStartPreflight?.token || payload.policy?.executionGateEnabled !== true;
}

function renderThreadStart(payload) {
  elements.threadStartStatus.textContent = payload.target?.threadIdSuffix
    ? `Thread ${payload.target.threadIdSuffix}`
    : "Created";
}

function renderThreadArchivePreflight(payload) {
  const action = payload.thread?.action === "unarchive" ? "Unarchive" : "Archive";
  elements.threadArchiveStatus.textContent = payload.policy?.executionGateEnabled
    ? `${action} ready`
    : `${action} blocked`;
  elements.threadArchiveButton.disabled =
    !lastThreadArchivePreflight?.token || lastThreadArchivePreflight.enabled !== true;
}

function renderThreadArchiveAction(payload) {
  const archived = payload.target?.archived === true;
  elements.threadArchiveStatus.textContent = archived ? "Archived" : "Unarchived";
}

function renderThreadForkPreflight(payload) {
  elements.threadForkStatus.textContent = payload.policy?.executionGateEnabled
    ? "Fork ready"
    : "Fork blocked";
  elements.threadForkButton.disabled =
    !lastThreadForkPreflight?.token || lastThreadForkPreflight.enabled !== true;
}

function renderThreadForkAction(payload) {
  const suffix = payload.target?.threadIdSuffix;
  elements.threadForkStatus.textContent =
    payload.target?.forked === true && suffix ? `Forked ${suffix}` : "Forked";
}

function renderThreadRenamePreflight(payload) {
  const count = Number.isSafeInteger(payload.name?.charCount) ? payload.name.charCount : 0;
  elements.threadRenameStatus.textContent = payload.policy?.executionGateEnabled
    ? `Rename ready (${count})`
    : "Rename blocked";
  elements.threadRenameButton.disabled =
    !lastThreadRenamePreflight?.token || lastThreadRenamePreflight.enabled !== true;
}

function renderThreadRenameAction(payload) {
  const count = Number.isSafeInteger(payload.target?.nameCharCount)
    ? payload.target.nameCharCount
    : 0;
  elements.threadRenameStatus.textContent =
    payload.target?.renamed === true ? `Renamed (${count})` : "Rename done";
}

function renderThreadGoalSetPreflight(payload) {
  const count = Number.isSafeInteger(payload.goal?.objectiveCharCount)
    ? payload.goal.objectiveCharCount
    : 0;
  elements.threadGoalMutationStatus.textContent = payload.policy?.executionGateEnabled
    ? `Goal set ready (${count})`
    : "Goal set blocked";
  elements.threadGoalSetButton.disabled =
    !lastThreadGoalSetPreflight?.token || lastThreadGoalSetPreflight.enabled !== true;
}

function renderThreadGoalSetAction(payload) {
  const count = Number.isSafeInteger(payload.result?.objectiveCharCount)
    ? payload.result.objectiveCharCount
    : 0;
  elements.threadGoalMutationStatus.textContent =
    payload.result?.goalSet === true ? `Goal set (${count})` : "Goal set done";
}

function renderThreadGoalClearPreflight(payload) {
  elements.threadGoalMutationStatus.textContent = payload.policy?.executionGateEnabled
    ? "Goal clear ready"
    : "Goal clear blocked";
  elements.threadGoalClearButton.disabled =
    !lastThreadGoalClearPreflight?.token || lastThreadGoalClearPreflight.enabled !== true;
}

function renderThreadGoalClearAction(payload) {
  elements.threadGoalMutationStatus.textContent =
    payload.result?.goalCleared === true ? "Goal cleared" : "Goal clear done";
}

function renderThreadMemoryModePreflight(payload) {
  const mode = payload.memory?.mode === "disabled" ? "disabled" : "enabled";
  elements.threadMemoryModeStatus.textContent = payload.policy?.executionGateEnabled
    ? `Memory ${mode} ready`
    : "Memory set blocked";
  elements.threadMemoryModeButton.disabled =
    !lastThreadMemoryModePreflight?.token || lastThreadMemoryModePreflight.enabled !== true;
}

function renderThreadMemoryModeAction(payload) {
  const mode = payload.result?.mode === "disabled" ? "disabled" : "enabled";
  elements.threadMemoryModeStatus.textContent =
    payload.result?.memoryModeSet === true ? `Memory ${mode}` : "Memory set done";
}

function renderThreadMetadataUpdatePreflight(payload) {
  const metadata = payload.metadataUpdate ?? {};
  const parts = [
    metadata.gitInfoNullRequested
      ? "clear git"
      : metadata.gitInfoPresent
        ? "git info"
        : "no git change",
    metadata.branchPresent ? "branch" : null,
    metadata.originUrlPresent ? "origin" : null,
    metadata.shaPresent ? "sha" : null,
  ].filter(Boolean);
  elements.threadMetadataUpdateStatus.textContent = `Metadata blocked (${parts.join(", ")})`;
}

function renderThreadResumeInjectPreflight(payload) {
  const request = payload.request ?? {};
  const method = request.injectItemsRequested ? "inject" : "resume";
  const count = request.injectItemsRequested
    ? `${request.itemCount ?? 0} items`
    : `${request.historyItemCount ?? 0} history`;
  const risky = [
    request.pathPresent ? "path" : null,
    request.cwdPresent ? "cwd" : null,
    request.configOverridePresent ? "config" : null,
    request.sandboxOverridePresent ? "sandbox" : null,
    request.instructionOverrideCount > 0 ? "instructions" : null,
  ].filter(Boolean);
  elements.threadResumeInjectStatus.textContent = `${method} blocked (${count}${
    risky.length > 0 ? `, ${risky.join("/")}` : ""
  })`;
}

function renderThreadRealtimePreflight(payload) {
  const realtime = payload.realtime ?? {};
  const method = String(realtime.method ?? "").replace("thread/realtime/", "") || "realtime";
  const detail = [
    realtime.outputModality ? `mode:${realtime.outputModality}` : null,
    realtime.voice ? `voice:${realtime.voice}` : null,
    realtime.transportType ? realtime.transportType : null,
    realtime.audioPresent ? `${realtime.audioDataCharCount ?? 0} audio chars` : null,
    realtime.textPresent ? `${realtime.textCharCount ?? 0} text chars` : null,
    realtime.promptPresent ? `${realtime.promptCharCount ?? 0} prompt chars` : null,
  ].filter(Boolean);
  elements.threadRealtimeStatus.textContent = `${method} blocked${
    detail.length > 0 ? ` (${detail.join(", ")})` : ""
  }`;
}

function renderThreadGuardianPreflight(payload) {
  const guardian = payload.guardian ?? {};
  const method = String(guardian.method ?? "").replace("thread/", "") || "guardian";
  const detail = [
    guardian.eventPresent ? `${guardian.eventCharCount ?? 0} event chars` : null,
    guardian.eventObjectPresent ? `${guardian.eventTopLevelKeyCount ?? 0} event keys` : null,
    guardian.incrementElicitationRequested ? "increment" : null,
    guardian.decrementElicitationRequested ? "decrement" : null,
    guardian.guardianApprovalRequested ? "approval" : null,
  ].filter(Boolean);
  elements.threadGuardianStatus.textContent = `${method} blocked${
    detail.length > 0 ? ` (${detail.join(", ")})` : ""
  }`;
}

function renderThreadRollbackPreflight(payload) {
  const count = Number.isSafeInteger(payload.thread?.numTurns) ? payload.thread.numTurns : 0;
  elements.threadRollbackStatus.textContent = payload.policy?.executionGateEnabled
    ? `Rollback ready (${count})`
    : "Rollback blocked";
  elements.threadRollbackButton.disabled =
    !lastThreadRollbackPreflight?.token || lastThreadRollbackPreflight.enabled !== true;
}

function renderThreadRollbackAction(payload) {
  const count = Number.isSafeInteger(payload.target?.numTurns) ? payload.target.numTurns : 0;
  elements.threadRollbackStatus.textContent =
    payload.target?.rolledBack === true ? `Rolled back ${count}` : "Rollback done";
}

function renderThreadSafetyLockPreflight(payload) {
  elements.threadSafetyLockStatus.textContent = payload.policy?.executionGateEnabled
    ? "Safety lock ready"
    : "Safety lock blocked";
  elements.threadSafetyLockButton.disabled =
    !lastThreadSafetyLockPreflight?.token || lastThreadSafetyLockPreflight.enabled !== true;
}

function renderThreadSafetyLockAction(payload) {
  elements.threadSafetyLockStatus.textContent =
    payload.target?.locked === true ? "Safety locked" : "Safety lock done";
}

function renderThreadDeletePreflight(payload) {
  elements.threadDeleteStatus.textContent = payload.policy?.executionGateEnabled
    ? "Delete ready"
    : "Delete blocked";
  elements.threadDeleteButton.disabled =
    !lastThreadDeletePreflight?.token || lastThreadDeletePreflight.enabled !== true;
}

function renderThreadDeleteAction(payload) {
  elements.threadDeleteStatus.textContent = payload.target?.deleted === true ? "Deleted" : "Delete done";
}

function renderThreadCompactPreflight(payload) {
  elements.threadCompactStatus.textContent = payload.policy?.executionGateEnabled
    ? "Compact ready"
    : "Compact blocked";
  elements.threadCompactButton.disabled =
    !lastThreadCompactPreflight?.token || lastThreadCompactPreflight.enabled !== true;
}

function renderThreadCompactStart(payload) {
  elements.threadCompactStatus.textContent = payload.target?.threadIdSuffix
    ? `Compacting ${payload.target.threadIdSuffix}`
    : "Compaction started";
}

function renderGitWorktree(git) {
  if (!git) {
    clearGitWorktree();
    return;
  }

  elements.gitRepoText.textContent = git.isRepository ? "Detected" : "Not found";
  elements.gitHeadText.textContent = formatGitHead(git);
  elements.gitRemotesText.textContent = git.hasRemotes ? `${git.remoteCount ?? 0}` : "0";
  elements.gitLinkedText.textContent = git.isLinkedWorktree ? "Yes" : "No";
  elements.gitBranchesText.textContent = git.localBranchCount ? `${git.localBranchCount}` : "0";
  elements.gitActionsText.textContent =
    git.branchSwitchAvailable || git.commitActionsAvailable ? "Enabled" : "Blocked";
  elements.gitStatusText.textContent = git.statusAvailable ? "Index scan" : "Unavailable";
  elements.gitChangedText.textContent = String(
    (git.modifiedTrackedCount ?? 0) +
      (git.missingTrackedCount ?? 0) +
      (git.untrackedTopLevelCount ?? 0),
  );
  elements.gitSwitchRiskText.textContent = gitSwitchRiskText(git.branchSwitchSafety);
  elements.gitStateText.textContent = gitStateText(git);
  renderGitDetails(git);
}

function clearGitWorktree() {
  lastGitBranchPreflight = null;
  lastGitBranchCreatePreflight = null;
  lastGitBranchDeletePreflight = null;
  lastGitCommitPreflight = null;
  elements.gitRepoText.textContent = "Not loaded";
  elements.gitHeadText.textContent = "-";
  elements.gitRemotesText.textContent = "0";
  elements.gitLinkedText.textContent = "No";
  elements.gitBranchesText.textContent = "0";
  elements.gitActionsText.textContent = "Blocked";
  elements.gitStatusText.textContent = "Unavailable";
  elements.gitChangedText.textContent = "0";
  elements.gitSwitchRiskText.textContent = "Unknown";
  elements.gitPreflightState.textContent = "Select a non-current branch to preflight a blocked switch.";
  elements.gitSwitchButton.disabled = true;
  elements.gitDeleteButton.disabled = true;
  elements.gitCreateState.textContent = "Branch creation disabled by default.";
  elements.gitCreateButton.disabled = true;
  elements.gitDeleteState.textContent = "Select a non-current branch to preflight deletion.";
  elements.gitCommitState.textContent = "Commit creation disabled by default.";
  elements.gitCommitButton.disabled = true;
  elements.gitWorktreeState.textContent = "Worktree actions disabled by default.";
  elements.gitWorktreeButton.disabled = true;
  elements.gitStateText.textContent = "No Git metadata loaded.";
  elements.gitDetailList.replaceChildren();
}

function renderGitDetails(git) {
  elements.gitDetailList.replaceChildren();
  if (!git.isRepository) {
    return;
  }

  const branches = Array.isArray(git.branches) ? git.branches : [];
  const linkedWorktrees = Array.isArray(git.linkedWorktrees) ? git.linkedWorktrees : [];
  if (git.statusAvailable) {
    elements.gitDetailList.append(
      gitDetailRow("Status", git.statusMode ?? "index scan", [
        `${git.checkedTrackedFileCount ?? 0}/${git.trackedFileCount ?? 0} tracked checked`,
        `${git.modifiedTrackedCount ?? 0} modified`,
        `${git.missingTrackedCount ?? 0} missing`,
        `${git.untrackedTopLevelCount ?? 0} untracked top-level`,
        git.statusTruncated ? "truncated" : null,
      ]),
    );
  }
  if (git.branchSwitchSafety) {
    elements.gitDetailList.append(
      gitDetailRow("Switch risk", git.branchSwitchSafety.riskPresent ? "Present" : "None detected", [
        `${git.branchSwitchSafety.hookFileCount ?? 0} hooks`,
        `${git.branchSwitchSafety.filterConfigCount ?? 0} filters`,
        `${git.branchSwitchSafety.attributesFileCount ?? 0} attributes`,
        `${git.branchSwitchSafety.configExecutionCount ?? 0} config exec`,
        git.branchSwitchSafety.scanTruncated ? "truncated" : null,
      ]),
    );
  }
  if (branches.length === 0 && linkedWorktrees.length === 0 && !git.statusAvailable) {
    elements.gitDetailList.append(emptyState("No branch or linked worktree inventory returned."));
    return;
  }

  for (const branch of branches) {
    elements.gitDetailList.append(
      gitDetailRow(
        "Branch",
        branch.name,
        [
          branch.current ? "current" : null,
          branch.commitShort ? `commit ${branch.commitShort}` : null,
        ],
        branch.current
          ? null
          : [
              { label: "Switch", action: () => runGitBranchPreflight(branch.name) },
              { label: "Delete", action: () => runGitBranchDeletePreflight(branch.name) },
            ],
      ),
    );
  }

  for (const worktree of linkedWorktrees) {
    elements.gitDetailList.append(
      gitDetailRow("Linked worktree", worktree.label, [
        formatGitWorktreeHead(worktree),
        "gitdir not followed",
      ]),
    );
  }
}

function gitDetailRow(kind, titleText, chips, actions = null) {
  const row = document.createElement("article");
  row.className = "git-row";
  row.setAttribute("role", "listitem");

  const header = document.createElement("div");
  header.className = "git-row-header";

  const title = document.createElement("strong");
  title.textContent = titleText ?? "-";

  const meta = document.createElement("span");
  meta.textContent = kind;

  const rowActions = normalizeGitRowActions(actions);
  if (rowActions.length > 0) {
    const actionRow = document.createElement("div");
    actionRow.className = "button-row";
    for (const item of rowActions) {
      const button = document.createElement("button");
      button.className = "secondary-button compact-button";
      button.type = "button";
      button.textContent = item.label;
      button.addEventListener("click", item.action);
      actionRow.append(button);
    }
    meta.replaceChildren(actionRow);
  }

  const chipList = document.createElement("div");
  chipList.className = "git-chip-list";
  for (const chipText of chips.filter(Boolean)) {
    const chip = document.createElement("span");
    chip.className = "git-chip";
    chip.textContent = chipText;
    chipList.append(chip);
  }

  header.append(title, meta);
  row.append(header, chipList);
  return row;
}

function normalizeGitRowActions(actions) {
  if (typeof actions === "function") {
    return [{ label: "Preflight", action: actions }];
  }
  if (!Array.isArray(actions)) {
    return [];
  }
  return actions.filter(
    (item) =>
      item &&
      typeof item.label === "string" &&
      item.label.length > 0 &&
      typeof item.action === "function",
  );
}

function renderGitBranchPreflight(payload) {
  const target = payload.target ?? {};
  const status = payload.status ?? {};
  const safety = payload.safety ?? {};
  const changedCount = status.changedCount ?? 0;
  lastGitBranchPreflight = {
    branch: target.branch ?? null,
    token: payload.preflight?.token ?? null,
  };
  elements.gitSwitchButton.disabled = !(
    lastGitBranchPreflight.branch &&
    lastGitBranchPreflight.token &&
    payload.policy?.executionGateEnabled === true &&
    changedCount === 0 &&
    safety.riskPresent !== true
  );
  elements.gitPreflightState.textContent = joinParts([
    target.branch ? `Switch to ${target.branch}` : "Branch switch",
    payload.action?.execution ?? "blocked",
    changedCount ? `${changedCount} local changes` : "clean by index scan",
    safety.riskPresent ? "hooks/filters/attributes risk" : "no switch risk detected",
    payload.policy?.gitSubprocess === false ? "no git subprocess" : null,
    payload.policy?.executionGateEnabled === true ? "switch enabled" : "switch disabled",
  ]);
}

function renderGitBranchSwitch(payload) {
  const target = payload.target ?? {};
  elements.gitPreflightState.textContent = joinParts([
    target.branch ? `Switched to ${target.branch}` : "Branch switch completed",
    payload.subprocess?.command ?? null,
    payload.status?.after?.changedCount ? `${payload.status.after.changedCount} local changes` : "clean",
  ]);
}

function renderGitBranchCreatePreflight(payload) {
  const target = payload.target ?? {};
  lastGitBranchCreatePreflight = {
    branch: target.branch ?? null,
    token: payload.preflight?.token ?? null,
  };
  elements.gitCreateButton.disabled = !(
    lastGitBranchCreatePreflight.branch &&
    lastGitBranchCreatePreflight.token &&
    payload.policy?.executionGateEnabled === true
  );
  elements.gitCreateState.textContent = joinParts([
    target.branch ? `Create ${target.branch}` : "Branch create",
    payload.action?.execution ?? "blocked",
    payload.source?.branch ? `from ${payload.source.branch}` : payload.source?.headKind,
    payload.policy?.directRefWrite === false ? "no ref write" : null,
    payload.policy?.executionGateEnabled === true ? "create enabled" : "create disabled",
  ]);
}

function renderGitBranchCreate(payload) {
  const target = payload.target ?? {};
  elements.gitCreateState.textContent = joinParts([
    target.branch ? `Created ${target.branch}` : "Branch created",
    payload.action?.refWrite ? "ref written" : null,
    payload.subprocess?.invoked === false ? "no git subprocess" : null,
  ]);
}

function renderGitBranchDeletePreflight(payload) {
  const target = payload.target ?? {};
  lastGitBranchDeletePreflight = {
    branch: target.branch ?? null,
    token: payload.preflight?.token ?? null,
  };
  elements.gitDeleteButton.disabled = !(
    lastGitBranchDeletePreflight.branch &&
    lastGitBranchDeletePreflight.token &&
    payload.policy?.executionGateEnabled === true
  );
  elements.gitDeleteState.textContent = joinParts([
    target.branch ? `Delete ${target.branch}` : "Branch delete",
    payload.action?.execution ?? "blocked",
    target.commitShort ? `commit ${target.commitShort}` : null,
    payload.policy?.directRefDelete === false ? "no ref delete" : null,
    payload.policy?.executionGateEnabled === true ? "delete enabled" : "delete disabled",
  ]);
}

function renderGitBranchDelete(payload) {
  const target = payload.target ?? {};
  elements.gitDeleteState.textContent = joinParts([
    target.branch ? `Deleted ${target.branch}` : "Branch deleted",
    payload.action?.refDelete ? "ref removed" : null,
    payload.subprocess?.invoked === false ? "no git subprocess" : null,
  ]);
}

function renderGitCommitPreflight(payload) {
  const message = payload.message ?? {};
  const status = payload.status ?? {};
  lastGitCommitPreflight = {
    token: payload.preflight?.token ?? null,
  };
  elements.gitCommitButton.disabled = !(
    lastGitCommitPreflight.token &&
    payload.policy?.executionGateEnabled === true &&
    payload.status?.statusAvailable === true &&
    payload.status?.statusTruncated !== true &&
    (payload.status?.changedCount ?? 0) === 0 &&
    payload.safety?.riskPresent !== true
  );
  elements.gitCommitState.textContent = joinParts([
    "Commit preflight",
    payload.action?.execution ?? "blocked",
    Number.isFinite(message.charCount) ? `${message.charCount} message chars` : null,
    Number.isFinite(message.subjectCharCount) ? `${message.subjectCharCount} subject chars` : null,
    Number.isFinite(status.changedCount) ? `${status.changedCount} local changes` : null,
    status.stagedStateKnown === false ? "staging unknown" : null,
    payload.policy?.gitSubprocess === false ? "no git subprocess" : null,
    payload.policy?.executionGateEnabled === true ? "commit enabled" : "commit disabled",
  ]);
}

function renderGitCommit(payload) {
  const result = payload.result ?? {};
  elements.gitCommitState.textContent = joinParts([
    result.commitShort ? `Committed ${result.commitShort}` : "Commit created",
    result.branch ? `on ${result.branch}` : null,
    payload.action?.objectWrites ? "object written" : null,
    payload.action?.refWrites ? "ref updated" : null,
    payload.subprocess?.command ?? null,
  ]);
}

function renderGitWorktreePreflight(payload) {
  const target = payload.target ?? {};
  const status = payload.status ?? {};
  const action = payload.action?.worktreeAction ?? null;
  lastGitWorktreePreflight = {
    action,
    path: elements.gitWorktreePath.value,
    branch: action === "create" ? elements.gitWorktreeBranch.value.trim() : null,
    token: payload.preflight?.token ?? null,
  };
  elements.gitWorktreeButton.disabled = !(
    lastGitWorktreePreflight.action &&
    lastGitWorktreePreflight.path &&
    lastGitWorktreePreflight.token &&
    payload.policy?.executionGateEnabled === true &&
    (action !== "create" || payload.safety?.riskPresent !== true)
  );
  elements.gitWorktreeState.textContent = joinParts([
    payload.action?.worktreeAction ? `Worktree ${payload.action.worktreeAction}` : "Worktree",
    payload.action?.execution ?? "blocked",
    target.basename ? `target ${target.basename}` : null,
    target.depth ? `${target.depth} path parts` : null,
    payload.branch?.branch ? `branch ${payload.branch.branch}` : null,
    Number.isFinite(status.linkedWorktreeCount)
      ? `${status.linkedWorktreeCount} linked worktrees`
      : null,
    payload.policy?.gitSubprocess === false ? "no git subprocess" : null,
    payload.policy?.executionGateEnabled === true ? "worktree enabled" : "worktree disabled",
  ]);
}

function renderGitWorktreeAction(payload) {
  const target = payload.target ?? {};
  elements.gitWorktreeState.textContent = joinParts([
    payload.action?.worktreeAction === "remove" ? "Worktree removed" : "Worktree created",
    target.basename ? `target ${target.basename}` : null,
    payload.branch?.branch ? `branch ${payload.branch.branch}` : null,
    payload.status?.after?.linkedWorktreeCount !== undefined
      ? `${payload.status.after.linkedWorktreeCount} linked worktrees`
      : null,
    payload.subprocess?.command ?? null,
  ]);
}

function gitSwitchRiskText(safety) {
  if (!safety) {
    return "Unknown";
  }
  if (safety.riskPresent) {
    return `${(safety.hookFileCount ?? 0) + (safety.filterConfigCount ?? 0) + (safety.attributesFileCount ?? 0)} found`;
  }
  return "None detected";
}

function renderThreadDetailLoading(threadIdSuffix) {
  elements.selectedThreadText.textContent = threadIdSuffix ?? "None";
  elements.threadDetailMeta.replaceChildren();
  elements.turnTimeline.replaceChildren(emptyState("Loading thread metadata."));
}

function renderThreadDetail(detail) {
  if (!detail) {
    clearThreadDetail();
    return;
  }

  elements.selectedThreadText.textContent = detail.idSuffix ?? "Unknown";
  elements.threadDetailMeta.replaceChildren(
    metric("Status", statusLabel(detail.status)),
    metric("Turns", String(detail.turnCount ?? 0)),
    metric("Returned", String(detail.returnedTurnCount ?? 0)),
    metric("Workspace", detail.cwdBasename ?? "-"),
  );

  elements.turnTimeline.replaceChildren();
  const turns = detail.turns ?? [];
  if (turns.length === 0) {
    elements.turnTimeline.append(emptyState("No turn metadata returned."));
    return;
  }

  for (const turn of turns) {
    const row = document.createElement("article");
    row.className = "turn-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "turn-header";

    const title = document.createElement("strong");
    title.textContent = `Turn ${turn.idSuffix ?? "unknown"}`;

    const meta = document.createElement("span");
    meta.textContent = joinParts([
      statusLabel(turn.status),
      turn.itemsView,
      `${turn.itemCount ?? 0} items`,
      formatUnix(turn.completedAt),
    ]);

    header.append(title, meta);

    const itemList = document.createElement("div");
    itemList.className = "item-chip-list";
    for (const item of turn.items ?? []) {
      const chip = document.createElement("span");
      chip.className = "item-chip";
      chip.textContent = joinParts([
        item.type,
        item.status,
        item.phase,
        item.changeCount ? `${item.changeCount} changes` : null,
      ]);
      itemList.append(chip);
    }

    row.append(header, itemList);
    elements.turnTimeline.append(row);
  }
}

function renderThreadGoal(goal, policy) {
  if (!goal) {
    elements.threadGoalStatus.textContent = "No goal metadata returned.";
    return;
  }
  const enabled = policy?.goalReadEnabled === true;
  if (!enabled) {
    elements.threadGoalStatus.textContent = "Goal read blocked.";
    return;
  }
  elements.threadGoalStatus.textContent = joinParts([
    goal.goalPresent ? statusLabel(goal.status) : "No active goal",
    goal.goalPresent ? `${goal.tokensUsed ?? 0} tokens` : null,
    goal.tokenBudgetPresent ? `budget ${goal.tokenBudget ?? 0}` : null,
    goal.goalPresent ? `${goal.timeUsedSeconds ?? 0}s` : null,
    goal.objectiveReturned === false ? "objective hidden" : null,
  ]);
}

function renderThreadTurns(page, policy) {
  if (!page) {
    elements.threadTurnsStatus.textContent = "No turn page metadata returned.";
    return;
  }
  const enabled = policy?.turnsReadEnabled === true;
  if (!enabled) {
    elements.threadTurnsStatus.textContent = "Turns page read blocked.";
    return;
  }
  elements.threadTurnsStatus.textContent = joinParts([
    `${page.returnedTurnCount ?? 0} turns`,
    page.hasNextCursor ? "next page" : null,
    page.hasBackwardsCursor ? "previous page" : null,
    page.itemsView === "notLoaded" ? "items hidden" : null,
  ]);
}

function renderThreadTurnItems(page, policy) {
  if (!page) {
    elements.threadTurnItemsStatus.textContent = "No turn item page metadata returned.";
    return;
  }
  const enabled = policy?.turnItemsReadEnabled === true;
  if (!enabled) {
    elements.threadTurnItemsStatus.textContent = "Turn items page read blocked.";
    return;
  }
  const typeCounts = new Map();
  for (const item of Array.isArray(page.items) ? page.items : []) {
    const type = item?.type || "unknown";
    typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1);
  }
  const topTypes = [...typeCounts.entries()]
    .slice(0, 4)
    .map(([type, count]) => `${type} ${count}`)
    .join(", ");
  elements.threadTurnItemsStatus.textContent = joinParts([
    `${page.returnedItemCount ?? 0} items`,
    page.hasNextCursor ? "next page" : null,
    page.hasBackwardsCursor ? "previous page" : null,
    topTypes || null,
    page.textReturned === false ? "text hidden" : null,
    page.commandReturned === false ? "commands hidden" : null,
  ]);
}

function clearThreadDetail() {
  selectedThreadArchived = false;
  lastLiveSessionControlPreflight = null;
  lastThreadArchivePreflight = null;
  lastThreadForkPreflight = null;
  lastThreadRenamePreflight = null;
  lastThreadGoalSetPreflight = null;
  lastThreadGoalClearPreflight = null;
  lastThreadMemoryModePreflight = null;
  lastThreadMetadataUpdatePreflight = null;
  lastThreadRollbackPreflight = null;
  lastThreadSafetyLockPreflight = null;
  lastThreadDeletePreflight = null;
  lastThreadCompactPreflight = null;
  elements.liveSessionControlThread.value = "";
  elements.liveSessionControlButton.disabled = true;
  elements.threadRenameInput.value = "";
  elements.threadRenameInput.disabled = true;
  elements.threadGoalObjectiveInput.value = "";
  elements.threadGoalObjectiveInput.disabled = true;
  elements.threadGoalStatusSelect.value = "active";
  elements.threadGoalStatusSelect.disabled = true;
  elements.threadGoalBudgetInput.value = "";
  elements.threadGoalBudgetInput.disabled = true;
  elements.threadMemoryModeSelect.value = "enabled";
  elements.threadMemoryModeSelect.disabled = true;
  elements.threadMetadataArgumentsInput.value = "";
  elements.threadMetadataArgumentsInput.disabled = true;
  elements.threadMetadataUpdatePreflightButton.disabled = true;
  elements.threadResumeInjectMethodSelect.value = "thread/resume";
  elements.threadResumeInjectMethodSelect.disabled = true;
  elements.threadResumeInjectArgumentsInput.value = "";
  elements.threadResumeInjectArgumentsInput.disabled = true;
  elements.threadResumeInjectPreflightButton.disabled = true;
  elements.threadRealtimeMethodSelect.value = "thread/realtime/start";
  elements.threadRealtimeMethodSelect.disabled = true;
  elements.threadRealtimeArgumentsInput.value = "";
  elements.threadRealtimeArgumentsInput.disabled = true;
  elements.threadRealtimePreflightButton.disabled = true;
  elements.threadGuardianMethodSelect.value = "thread/increment_elicitation";
  elements.threadGuardianMethodSelect.disabled = true;
  elements.threadGuardianArgumentsInput.value = "";
  elements.threadGuardianArgumentsInput.disabled = true;
  elements.threadGuardianPreflightButton.disabled = true;
  elements.threadTurnItemsInput.value = "";
  elements.threadTurnItemsInput.disabled = true;
  elements.threadTurnItemsButton.disabled = true;
  elements.threadRollbackTurnsInput.value = "1";
  elements.threadRollbackTurnsInput.disabled = true;
  elements.selectedThreadText.textContent = "None";
  elements.threadArchiveStatus.textContent = "Select a thread to manage archive state.";
  elements.threadForkStatus.textContent = "Select a thread to fork.";
  elements.threadRenameStatus.textContent = "Select a thread to rename.";
  elements.threadRollbackStatus.textContent = "Select a thread to roll back.";
  elements.threadSafetyLockStatus.textContent = "Select a thread to lock safety settings.";
  elements.threadDeleteStatus.textContent = "Select a thread to delete.";
  elements.threadCompactStatus.textContent = "Select a loaded active thread to compact.";
  elements.threadGoalStatus.textContent = "Select a thread to inspect goal state.";
  elements.threadGoalButton.disabled = true;
  elements.threadGoalMutationStatus.textContent = "Select a thread to update goal state.";
  elements.threadMemoryModeStatus.textContent = "Select a thread to update memory mode.";
  elements.threadMetadataUpdateStatus.textContent = "Select a thread to check metadata updates.";
  elements.threadResumeInjectStatus.textContent = "Select a thread to check resume or inject intent.";
  elements.threadRealtimeStatus.textContent = "Select a thread to check realtime intent.";
  elements.threadGuardianStatus.textContent = "Select a thread to check guardian intent.";
  elements.threadTurnsStatus.textContent = "Select a thread to inspect paged turn metadata.";
  elements.threadTurnsButton.disabled = true;
  elements.threadTurnItemsStatus.textContent = "Select a thread and turn to inspect paged item metadata.";
  elements.threadDetailMeta.replaceChildren();
  elements.turnTimeline.replaceChildren(emptyState("Select a thread to inspect sanitized turn metadata."));
  clearTranscript();
  clearChanges();
  updateTurnDraftState();
  updateThreadArchiveState();
  updateThreadForkState();
  updateThreadRenameState();
  updateThreadGoalMutationState();
  updateThreadMemoryModeState();
  updateThreadMetadataUpdateState();
  updateThreadResumeInjectState();
  updateThreadRealtimeState();
  updateThreadRollbackState();
  updateThreadSafetyLockState();
  updateThreadDeleteState();
  updateThreadCompactState();
  renderThreadsSelection();
}

function clearTranscript({ keepThread = false } = {}) {
  elements.transcriptThreadText.textContent = keepThread
    ? selectedThreadIdSuffix ?? "No thread"
    : "No thread";
  elements.transcriptTurnsText.textContent = "0";
  elements.transcriptCharsText.textContent = "0";
  elements.transcriptStateText.textContent = keepThread ? "Not loaded" : "Idle";
  elements.transcriptList.replaceChildren(
    emptyState(
      keepThread
        ? "Load sanitized transcript text for the selected thread."
        : "Select a thread to load sanitized transcript text.",
    ),
  );
}

function clearChanges({ keepThread = false } = {}) {
  elements.changesThreadText.textContent = keepThread
    ? selectedThreadIdSuffix ?? "No thread"
    : "No thread";
  elements.changesItemsText.textContent = "0";
  elements.changesCountText.textContent = "0";
  elements.changesStateText.textContent = keepThread ? "Not loaded" : "Idle";
  elements.changesList.replaceChildren(
    emptyState(
      keepThread
        ? "Load sanitized file changes for the selected thread."
        : "Select a thread to load sanitized file changes.",
    ),
  );
}

function updateTurnDraftState() {
  const hasThread = Boolean(selectedThreadIdSuffix);
  const canDraft = hasThread && !selectedThreadArchived;
  elements.turnTargetText.textContent = selectedThreadIdSuffix ?? "No thread";
  elements.turnInput.disabled = !canDraft;
  elements.turnButton.disabled = !canDraft;
  elements.turnStartButton.disabled = !canDraft;
  elements.transcriptButton.disabled = !hasThread;
  elements.changesButton.disabled = !hasThread;
  elements.transcriptThreadText.textContent = selectedThreadIdSuffix ?? "No thread";
  elements.changesThreadText.textContent = selectedThreadIdSuffix ?? "No thread";
  if (selectedThreadArchived) {
    elements.turnPreflightStatus.textContent = "Archived thread selected.";
    elements.turnPreflightGate.textContent = "Blocked";
    elements.turnPreflightChars.textContent = "0";
    elements.turnPreflightLines.textContent = "0";
    elements.turnPreflightTraffic.textContent = "None";
  } else if (!hasThread) {
    elements.turnPreflightStatus.textContent = "Select a thread first.";
    elements.turnPreflightGate.textContent = "Blocked";
    elements.turnPreflightChars.textContent = "0";
    elements.turnPreflightLines.textContent = "0";
    elements.turnPreflightTraffic.textContent = "None";
  }
}

function updateThreadArchiveState() {
  const hasThread = Boolean(selectedThreadIdSuffix);
  const actionLabel = selectedThreadArchived ? "Unarchive" : "Archive";
  elements.threadArchivePreflightButton.disabled = !hasThread;
  elements.threadArchiveButton.disabled =
    !lastThreadArchivePreflight?.token || lastThreadArchivePreflight.enabled !== true;
  elements.threadArchiveButton.textContent = actionLabel;
  if (!hasThread) {
    elements.threadArchiveStatus.textContent = "Select a thread to manage archive state.";
  }
}

function updateThreadForkState() {
  const hasThread = Boolean(selectedThreadIdSuffix);
  elements.threadForkPreflightButton.disabled = !hasThread;
  elements.threadForkButton.disabled =
    !lastThreadForkPreflight?.token || lastThreadForkPreflight.enabled !== true;
  if (!hasThread && elements.threadForkStatus.textContent !== "Forked") {
    elements.threadForkStatus.textContent = "Select a thread to fork.";
  }
}

function updateThreadRenameState() {
  const hasThread = Boolean(selectedThreadIdSuffix);
  const hasName = elements.threadRenameInput.value.trim().length > 0;
  elements.threadRenameInput.disabled = !hasThread;
  elements.threadRenamePreflightButton.disabled = !hasThread || !hasName;
  elements.threadRenameButton.disabled =
    !lastThreadRenamePreflight?.token || lastThreadRenamePreflight.enabled !== true;
  if (!hasThread) {
    elements.threadRenameStatus.textContent = "Select a thread to rename.";
  } else if (!hasName && elements.threadRenameStatus.textContent !== "Renamed") {
    elements.threadRenameStatus.textContent = "Name required.";
  }
}

function updateThreadGoalMutationState() {
  const hasThread = Boolean(selectedThreadIdSuffix);
  const hasObjective = elements.threadGoalObjectiveInput.value.trim().length > 0;
  elements.threadGoalObjectiveInput.disabled = !hasThread;
  elements.threadGoalStatusSelect.disabled = !hasThread;
  elements.threadGoalBudgetInput.disabled = !hasThread;
  elements.threadGoalSetPreflightButton.disabled = !hasThread || !hasObjective;
  elements.threadGoalSetButton.disabled =
    !lastThreadGoalSetPreflight?.token || lastThreadGoalSetPreflight.enabled !== true;
  elements.threadGoalClearPreflightButton.disabled = !hasThread;
  elements.threadGoalClearButton.disabled =
    !lastThreadGoalClearPreflight?.token || lastThreadGoalClearPreflight.enabled !== true;
  if (!hasThread) {
    elements.threadGoalMutationStatus.textContent = "Select a thread to update goal state.";
  } else if (!hasObjective && elements.threadGoalMutationStatus.textContent.startsWith("Goal set")) {
    elements.threadGoalMutationStatus.textContent = "Goal objective required for set.";
  }
}

function updateThreadMemoryModeState() {
  const hasThread = Boolean(selectedThreadIdSuffix);
  elements.threadMemoryModeSelect.disabled = !hasThread;
  elements.threadMemoryModePreflightButton.disabled = !hasThread;
  elements.threadMemoryModeButton.disabled =
    !lastThreadMemoryModePreflight?.token || lastThreadMemoryModePreflight.enabled !== true;
  if (!hasThread) {
    elements.threadMemoryModeStatus.textContent = "Select a thread to update memory mode.";
  }
}

function updateThreadMetadataUpdateState() {
  const hasThread = Boolean(selectedThreadIdSuffix);
  elements.threadMetadataArgumentsInput.disabled = !hasThread;
  elements.threadMetadataUpdatePreflightButton.disabled = !hasThread;
  if (!hasThread) {
    elements.threadMetadataUpdateStatus.textContent = "Select a thread to check metadata updates.";
  }
}

function updateThreadResumeInjectState() {
  const hasThread = Boolean(selectedThreadIdSuffix);
  elements.threadResumeInjectMethodSelect.disabled = !hasThread;
  elements.threadResumeInjectArgumentsInput.disabled = !hasThread;
  elements.threadResumeInjectPreflightButton.disabled = !hasThread;
  if (!hasThread) {
    elements.threadResumeInjectStatus.textContent =
      "Select a thread to check resume or inject intent.";
  }
}

function updateThreadRealtimeState() {
  const hasThread = Boolean(selectedThreadIdSuffix);
  elements.threadRealtimeMethodSelect.disabled = !hasThread;
  elements.threadRealtimeArgumentsInput.disabled = !hasThread;
  elements.threadRealtimePreflightButton.disabled = !hasThread;
  if (!hasThread) {
    elements.threadRealtimeStatus.textContent = "Select a thread to check realtime intent.";
  }
}

function updateThreadGuardianState() {
  const hasThread = Boolean(selectedThreadIdSuffix);
  elements.threadGuardianMethodSelect.disabled = !hasThread;
  elements.threadGuardianArgumentsInput.disabled = !hasThread;
  elements.threadGuardianPreflightButton.disabled = !hasThread;
  if (!hasThread) {
    elements.threadGuardianStatus.textContent = "Select a thread to check guardian intent.";
  }
}

function updateThreadRollbackState() {
  const hasThread = Boolean(selectedThreadIdSuffix);
  const numTurns = Number(elements.threadRollbackTurnsInput.value);
  const hasValidTurns = Number.isSafeInteger(numTurns) && numTurns >= 1 && numTurns <= 50;
  elements.threadRollbackTurnsInput.disabled = !hasThread;
  elements.threadRollbackPreflightButton.disabled = !hasThread || !hasValidTurns;
  elements.threadRollbackButton.disabled =
    !lastThreadRollbackPreflight?.token || lastThreadRollbackPreflight.enabled !== true;
  if (!hasThread) {
    elements.threadRollbackStatus.textContent = "Select a thread to roll back.";
  } else if (!hasValidTurns && elements.threadRollbackStatus.textContent !== "Rolled back") {
    elements.threadRollbackStatus.textContent = "Turns must be 1-50.";
  }
}

function updateThreadSafetyLockState() {
  const hasThread = Boolean(selectedThreadIdSuffix);
  elements.threadSafetyLockPreflightButton.disabled = !hasThread;
  elements.threadSafetyLockButton.disabled =
    !lastThreadSafetyLockPreflight?.token || lastThreadSafetyLockPreflight.enabled !== true;
  if (!hasThread) {
    elements.threadSafetyLockStatus.textContent = "Select a thread to lock safety settings.";
  }
}

function updateThreadDeleteState() {
  const hasThread = Boolean(selectedThreadIdSuffix);
  elements.threadDeletePreflightButton.disabled = !hasThread;
  elements.threadDeleteButton.disabled =
    !lastThreadDeletePreflight?.token || lastThreadDeletePreflight.enabled !== true;
  if (!hasThread && elements.threadDeleteStatus.textContent !== "Deleted") {
    elements.threadDeleteStatus.textContent = "Select a thread to delete.";
  }
}

function updateThreadCompactState() {
  const hasActiveThread = Boolean(selectedThreadIdSuffix) && !selectedThreadArchived;
  elements.threadCompactPreflightButton.disabled = !hasActiveThread;
  elements.threadCompactButton.disabled =
    !lastThreadCompactPreflight?.token || lastThreadCompactPreflight.enabled !== true;
  if (!selectedThreadIdSuffix) {
    elements.threadCompactStatus.textContent = "Select a loaded active thread to compact.";
  } else if (selectedThreadArchived) {
    elements.threadCompactStatus.textContent = "Archived thread selected.";
  }
}

function renderThreadTranscript(transcript) {
  if (!transcript) {
    clearTranscript({ keepThread: true });
    return;
  }

  elements.transcriptThreadText.textContent = transcript.idSuffix ?? selectedThreadIdSuffix ?? "-";
  elements.transcriptTurnsText.textContent = String(transcript.returnedTurnCount ?? 0);
  elements.transcriptCharsText.textContent = String(transcript.totalTextCharCount ?? 0);
  elements.transcriptStateText.textContent = transcript.truncated ? "Truncated" : "Loaded";
  elements.transcriptList.replaceChildren();

  const items = [];
  for (const turn of transcript.turns ?? []) {
    for (const item of turn.items ?? []) {
      items.push({ turn, item });
    }
  }

  if (items.length === 0) {
    elements.transcriptList.append(emptyState("No transcript text returned."));
    return;
  }

  for (const { turn, item } of items) {
    const row = document.createElement("article");
    row.className = `transcript-row ${item.role === "user" ? "user" : "assistant"}`;
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "transcript-header";

    const role = document.createElement("strong");
    role.textContent = item.role === "user" ? "User" : "Codex";

    const meta = document.createElement("span");
    meta.textContent = joinParts([
      turn.idSuffix ? `turn ${turn.idSuffix}` : null,
      item.phase,
      item.truncated ? "truncated" : null,
    ]);

    const body = document.createElement("p");
    body.className = "transcript-text";
    body.textContent = item.text ?? "";

    header.append(role, meta);
    row.append(header, body);
    elements.transcriptList.append(row);
  }
}

function renderThreadChanges(changes) {
  if (!changes) {
    clearChanges({ keepThread: true });
    return;
  }

  elements.changesThreadText.textContent = changes.idSuffix ?? selectedThreadIdSuffix ?? "-";
  elements.changesItemsText.textContent = String(changes.returnedChangeItemCount ?? 0);
  elements.changesCountText.textContent = String(changes.returnedChangeCount ?? 0);
  elements.changesStateText.textContent = changes.truncated ? "Truncated" : "Loaded";
  elements.changesList.replaceChildren();

  const rows = [];
  for (const turn of changes.turns ?? []) {
    for (const item of turn.items ?? []) {
      for (const change of item.changes ?? []) {
        rows.push({ turn, item, change });
      }
    }
  }

  if (rows.length === 0) {
    elements.changesList.append(emptyState("No file changes returned."));
    return;
  }

  for (const { turn, item, change } of rows) {
    const row = document.createElement("article");
    row.className = "change-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "change-header";

    const title = document.createElement("strong");
    title.textContent = changeTitle(change);

    const meta = document.createElement("span");
    meta.textContent = joinParts([
      change.kind,
      item.status,
      turn.idSuffix ? `turn ${turn.idSuffix}` : null,
      item.unsafeFieldsOmitted || change.unsafeFieldsOmitted ? "raw payload omitted" : null,
      change.diffPreview?.truncated ? "diff truncated" : null,
    ]);

    const chips = document.createElement("div");
    chips.className = "change-chip-list";
    for (const value of [
      change.additions ? `+${change.additions}` : null,
      change.deletions ? `-${change.deletions}` : null,
      change.fromBasename && change.toBasename
        ? `${change.fromBasename} -> ${change.toBasename}`
        : null,
      change.diffPreview?.text ? `${change.diffPreview.returnedLineCount ?? 0} diff lines` : null,
      change.hasFileReference ? null : "file reference hidden",
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "change-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, chips);
    if (change.diffPreview?.text) {
      const diff = document.createElement("pre");
      diff.className = "diff-preview";
      diff.textContent = change.diffPreview.text;
      row.append(diff);
    }
    elements.changesList.append(row);
  }
}

function renderTurnPreflight(payload) {
  lastTurnPreflight = {
    token: payload.preflight?.token ?? null,
    threadIdSuffix: payload.target?.threadIdSuffix ?? null,
    prompt: elements.turnInput.value,
  };
  elements.turnPreflightStatus.textContent = "Ready";
  elements.turnPreflightGate.textContent = payload.action?.execution ?? "blocked";
  elements.turnPreflightChars.textContent = String(payload.prompt?.charCount ?? 0);
  elements.turnPreflightLines.textContent = String(payload.prompt?.lineCount ?? 0);
  elements.turnPreflightTraffic.textContent = payload.action?.modelTraffic ? "Model" : "None";
}

function renderTurnStartBlocked(payload) {
  lastTurnPreflight = null;
  elements.turnPreflightStatus.textContent = "Start blocked";
  elements.turnPreflightGate.textContent = payload.action?.execution ?? "blocked";
  elements.turnPreflightChars.textContent = String(payload.prompt?.charCount ?? 0);
  elements.turnPreflightLines.textContent = String(payload.prompt?.lineCount ?? 0);
  elements.turnPreflightTraffic.textContent = payload.action?.appServerTouched ? "App-server" : "None";
  renderExecutionGate(payload);
}

function renderTurnStartStarted(payload) {
  lastTurnPreflight = null;
  elements.turnPreflightStatus.textContent = "Started";
  elements.turnPreflightGate.textContent = payload.action?.execution ?? "started";
  elements.turnPreflightChars.textContent = String(payload.prompt?.charCount ?? 0);
  elements.turnPreflightLines.textContent = String(payload.prompt?.lineCount ?? 0);
  elements.turnPreflightTraffic.textContent = payload.action?.modelTraffic ? "Model" : "None";
  if (payload.target?.turnIdSuffix) {
    elements.turnTargetText.textContent = payload.target.turnIdSuffix;
  }
}

function renderExecutionGate(payload) {
  const gate = payload.gate ?? {};
  const action = payload.action ?? {};
  const readiness = payload.turnExecutionReadiness ?? {};
  const authority = payload.turnExecutionAuthority ?? {};
  elements.executionGateState.textContent = gate.state ?? action.execution ?? "blocked";
  elements.executionEnabledText.textContent = gate.executionEnabled ? "Enabled" : "Blocked";
  elements.turnExecutionReadiness.textContent = turnExecutionReadinessText(readiness);
  elements.turnExecutionAuthority.textContent = turnExecutionAuthorityText(authority);
  elements.executionPendingText.textContent = String(gate.pendingApprovalCount ?? 0);
  elements.executionDecisionsText.textContent = gate.approvalDecisionsAccepted
    ? "Enabled"
    : "Disabled";
  elements.executionTrafficText.textContent = action.appServerTouched ? "App-server" : "None";
  renderThreadLifecycleActionHistory(payload.threadLifecycleActionHistory);
}

function turnExecutionReadinessText(readiness) {
  if (!readiness || readiness.returned !== true) {
    return "Blocked";
  }
  return joinParts([
    readiness.state ?? "blocked",
    readiness.turnStartRoute && readiness.turnStartRoute !== "blocked"
      ? readiness.turnStartRoute
      : null,
    readiness.pendingApprovalCount > 0 ? `${readiness.pendingApprovalCount} pending` : null,
    readiness.approvalForwardingEnabled ? "forward" : null,
    readiness.approvalAcceptOnceEnabled ? "accept once" : null,
  ]);
}

function turnExecutionAuthorityText(authority) {
  if (!authority || authority.returned !== true) {
    return "Blocked";
  }
  return joinParts([
    authority.authorityMode ?? authority.state ?? "blocked",
    authority.turnStartRoute && authority.turnStartRoute !== "blocked"
      ? authority.turnStartRoute
      : null,
    authority.sandbox ? `sandbox ${authority.sandbox}` : null,
    authority.networkAccessAllowed ? "network" : "no network",
    authority.requestScopedApprovalOnly ? "request only" : null,
  ]);
}

function renderThreadLifecycleActionHistory(history) {
  const items = Array.isArray(history?.items) ? history.items : [];
  elements.threadLifecycleActionHistoryCount.textContent = String(history?.count ?? items.length);
  elements.threadLifecycleActionHistoryList.replaceChildren();

  if (items.length === 0) {
    elements.threadLifecycleActionHistoryList.append(
      emptyState("No thread lifecycle actions recorded."),
    );
    return;
  }

  for (const item of items) {
    const action = item.action ?? {};
    const target = item.target ?? {};
    const result = item.result ?? {};
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = action.type ?? "thread-action";

    const meta = document.createElement("span");
    meta.textContent = joinParts([
      action.method,
      target.sourceThreadIdSuffix ? `source ${target.sourceThreadIdSuffix}` : null,
      target.threadIdSuffix ? `thread ${target.threadIdSuffix}` : null,
      typeof target.archived === "boolean" ? (target.archived ? "archived" : "active") : null,
      typeof target.forked === "boolean" && target.forked ? "forked" : null,
      typeof target.renamed === "boolean" && target.renamed ? "renamed" : null,
      typeof target.rolledBack === "boolean" && target.rolledBack ? "rolled back" : null,
      target.numTurns ? `${target.numTurns} turns` : null,
      target.nameCharCount ? `${target.nameCharCount} chars` : null,
      action.modelTraffic ? "model traffic" : "no model",
    ]);

    const detail = document.createElement("p");
    detail.className = "boundary-detail";
    detail.textContent = joinParts([
      action.execution,
      result.status,
      item.recordedAt ? `recorded ${item.recordedAt}` : null,
      item.preflight?.tokenConsumed ? "preflight consumed" : "preflight omitted",
    ]);

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      action.appServerTouched ? "app-server" : "local",
      action.threadCreated ? "created" : null,
      action.threadForked ? "forked" : null,
      action.threadRenamed ? "renamed" : null,
      action.threadRolledBack ? "rolled back" : null,
      action.threadStateMutated ? "state changed" : null,
      action.threadCompactionStarted ? "compact started" : null,
      item.policy?.auditLogWritten ? "audit log" : null,
      "token omitted",
      "ids omitted",
      "prompts omitted",
      "raw omitted",
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, detail, chips);
    elements.threadLifecycleActionHistoryList.append(row);
  }
}

function renderApprovalDecisions(payload) {
  const approvals = Array.isArray(payload.approvals) ? payload.approvals : [];
  lastApprovalPayload = payload;
  lastApprovalQueue = approvals;
  const decisionHistory = payload.decisionHistory ?? {};
  const approvalQueue = payload.approvalQueue ?? {};
  const approvalLifecycle = payload.approvalLifecycle ?? {};
  const policy = payload.policy ?? {};
  const decisionScope = policy.decisionScope ?? {};
  const filteredApprovals = filterApprovalQueue(approvals, approvalQueueFilter);
  const approvalRows = filteredApprovals.map((approval) => ({
    approval,
    key: approvalSelectionKey(approval, approvals.indexOf(approval)),
  }));
  const selectedApprovalRow = resolveSelectedApprovalRow(approvalRows);
  const denyableApprovalTotal = pendingDenyableApprovals(filteredApprovals);
  const approvableApprovalTotal = pendingApprovableApprovals(filteredApprovals);
  const denyableApprovals = limitApprovalDecisionBatch(denyableApprovalTotal, payload);
  const approvableApprovals = limitApprovalDecisionBatch(approvableApprovalTotal, payload);
  elements.approvalQueueCount.textContent = String(payload.approvalCount ?? approvals.length);
  elements.approvalManagedCount.textContent = String(
    approvalQueue.managedRequestCount ?? approvalQueue.managedSessionCount ?? 0,
  );
  elements.approvalSafeDenyCount.textContent = String(approvalQueue.safeDenyDecisionCount ?? 0);
  elements.approvalSafeAcceptCount.textContent = String(
    approvalQueue.safeApproveDecisionCount ?? 0,
  );
  elements.approvalPreviewCount.textContent = String(approvalQueue.detailPreviewCount ?? 0);
  elements.approvalDecisionHistoryCount.textContent = String(decisionHistory.count ?? 0);
  elements.approvalLifecycleState.textContent = approvalLifecycle.state ?? "idle";
  elements.approvalLifecycleResults.textContent = `${
    approvalLifecycle.localDecisionHistoryCount ?? 0
  } local / ${approvalLifecycle.forwardedDecisionHistoryCount ?? 0} forwarded`;
  elements.approvalLifecycleLatest.textContent = latestApprovalDecisionText(
    approvalLifecycle.latestDecision,
  );
  const approvalQueueActions = approvalLifecycle.approvalQueueActions ?? {};
  elements.approvalQueueActions.textContent = approvalQueueActionsText(approvalQueueActions);
  elements.approvalManagement.textContent = approvalManagementText(
    approvalLifecycle.approvalManagement,
  );
  elements.approvalExecutionReadiness.textContent = approvalExecutionReadinessText(
    approvalLifecycle.approvalExecutionReadiness,
  );
  elements.approvalDecisionContract.textContent = approvalDecisionContractText(
    approvalLifecycle.approvalDecisionContract,
  );
  elements.approvalRoutingContract.textContent = approvalRoutingContractText(
    approvalLifecycle.approvalRoutingContract,
  );
  elements.approvalWorkflowContract.textContent = approvalWorkflowContractText(
    approvalLifecycle.approvalWorkflowContract,
  );
  elements.approvalSafetyContract.textContent = approvalSafetyContractText(
    approvalLifecycle.approvalSafetyContract,
  );
  elements.approvalAuditContract.textContent = approvalAuditContractText(
    approvalLifecycle.approvalAuditContract,
  );
  elements.approvalAuthorityContract.textContent = approvalAuthorityContractText(
    approvalLifecycle.approvalAuthorityContract,
  );
  elements.approvalInteractionContract.textContent = approvalInteractionContractText(
    approvalLifecycle.approvalInteractionContract,
  );
  elements.approvalBatchWindow.textContent = approvalBatchWindowText(approvalQueueActions);
  elements.approvalAcceptAllButton.disabled = approvableApprovals.length === 0;
  elements.approvalDenyAllButton.disabled = denyableApprovals.length === 0;
  elements.approvalBulkStatus.textContent = approvalBulkStatusText({
    approvableCount: approvableApprovals.length,
    denyableCount: denyableApprovals.length,
    approvableTotal: approvableApprovalTotal.length,
    denyableTotal: denyableApprovalTotal.length,
  });
  renderApprovalFilterState(approvals, filteredApprovals);
  renderApprovalDetail(selectedApprovalRow?.approval ?? null, {
    filteredCount: filteredApprovals.length,
    totalCount: approvals.length,
    policy,
    approvalLifecycle,
  });
  elements.approvalPolicyText.textContent = policy.approveDecisionsAccepted
    ? "Accept once + deny"
    : policy.forwardedToAppServer
      ? "Forwarded deny"
      : "Local deny";
  elements.approvalScopeText.textContent = decisionScope.sessionWideApprovalDecisionsAccepted
    ? "Session"
    : decisionScope.requestScopedOnly
      ? "Request only"
      : "Blocked";
  elements.approvalForwardDenyText.textContent = decisionScope.forwardedDenyDecisionsAccepted
    ? "Enabled"
    : "Blocked";
  elements.approvalAcceptOnceText.textContent = decisionScope.acceptOnceApprovalDecisionsAccepted
    ? "Enabled"
    : "Blocked";
  elements.approvalKindCount.textContent = String(decisionScope.approvalKinds?.length ?? 0);
  elements.approvalRejectedScopeCount.textContent = String(
    [
      decisionScope.sessionWideApprovalDecisionsAccepted,
      decisionScope.execPolicyAmendmentsAccepted,
      decisionScope.networkAmendmentsAccepted,
      decisionScope.persistentRootGrantsAccepted,
    ].filter((accepted) => accepted === false).length,
  );
  elements.approvalQueueList.replaceChildren();
  renderApprovalDecisionHistory(decisionHistory);

  if (approvals.length === 0) {
    elements.approvalQueueList.append(emptyState("No pending approval decisions."));
    return;
  }

  if (filteredApprovals.length === 0) {
    elements.approvalQueueList.append(
      emptyState(
        `No ${approvalFilterLabel(approvalQueueFilter).toLowerCase()} approval decisions.`,
      ),
    );
    return;
  }

  for (const { approval, key } of approvalRows) {
    const row = document.createElement("article");
    const selected = key === selectedApprovalKey;
    row.className = "boundary-row selectable-row";
    row.setAttribute("role", "listitem");
    row.setAttribute("aria-current", selected ? "true" : "false");
    row.tabIndex = 0;
    row.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("button")) {
        return;
      }
      selectApproval(key);
    });
    row.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      selectApproval(key);
    });

    const request = approval.request ?? {};
    const target = approval.target ?? {};
    const decision = approval.browserDecision ?? request.browserDecision ?? null;

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = request.kind ?? "approval";

    const meta = document.createElement("span");
    meta.textContent = joinParts([
      request.method,
      target.threadIdSuffix ? `thread ${target.threadIdSuffix}` : null,
      target.turnIdSuffix ? `turn ${target.turnIdSuffix}` : null,
      approval.sessionId?.startsWith("managed-") ? "managed" : "local",
    ]);

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      request.command?.present ? `${request.command.charCount ?? 0} command chars` : null,
      request.fileChange?.approvalPreview?.grantRootBasenameReturned
        ? `root ${request.fileChange.approvalPreview.grantRootBasename}`
        : null,
      request.hasPermissionsProfile ? "permissions requested" : null,
      decision?.decision ? `denied ${decision.decision}` : "pending",
      request.safeDenyDecisions?.length ? `${request.safeDenyDecisions.length} safe denies` : null,
      request.safeApproveDecisions?.length
        ? `${request.safeApproveDecisions.length} safe accepts`
        : null,
      payload.policy?.forwardedToAppServer ? "forwarding enabled" : "local only",
      payload.policy?.auditLogPersistent ? "audit log" : null,
      payload.policy?.decisionTokenRequired ? "token required" : null,
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, chips);
    appendApprovalPreview(row, request);
    appendApprovalButtons(row, {
      sessionId: approval.sessionId,
      request,
      browserDecision: decision,
    });
    elements.approvalQueueList.append(row);
  }
}

function approvalSelectionKey(approval, index) {
  const request = approval?.request ?? {};
  return [
    approval?.sessionId ?? "local",
    request.requestKey ??
      request.requestIdSuffix ??
      request.itemIdSuffix ??
      request.turnIdSuffix ??
      `index-${index}`,
    request.kind ?? "approval",
    request.method ?? "method",
  ]
    .map((value) => String(value))
    .join("::");
}

function resolveSelectedApprovalRow(approvalRows) {
  const rows = Array.isArray(approvalRows) ? approvalRows : [];
  const selected = rows.find((row) => row.key === selectedApprovalKey) ?? rows[0] ?? null;
  selectedApprovalKey = selected?.key ?? null;
  return selected;
}

function selectApproval(key) {
  selectedApprovalKey = key;
  if (lastApprovalPayload) {
    renderApprovalDecisions(lastApprovalPayload);
  }
}

function renderApprovalDetail(approval, { filteredCount = 0, totalCount = 0, policy = {} } = {}) {
  const request = approval?.request ?? {};
  const target = approval?.target ?? {};
  const decision = approval?.browserDecision ?? request.browserDecision ?? null;
  const managed = approval?.sessionId?.startsWith("managed-") === true;
  const detailTitle = approval ? (request.kind ?? "approval") : "No approval selected";
  const detailMeta = approval
    ? joinParts([
        managed ? "managed" : "local",
        target.threadIdSuffix ? `thread ${target.threadIdSuffix}` : null,
        target.turnIdSuffix ? `turn ${target.turnIdSuffix}` : null,
        `${filteredCount} / ${totalCount} visible`,
      ])
    : `${filteredCount} / ${totalCount} visible`;

  elements.approvalDetailTitle.textContent = detailTitle;
  elements.approvalDetailMeta.textContent = detailMeta;
  elements.approvalDetailKind.textContent = approval ? (request.kind ?? "approval") : "-";
  elements.approvalDetailRoute.textContent = approval ? (request.method ?? "unknown") : "-";
  elements.approvalDetailState.textContent = approval
    ? decision?.decision
      ? `decided ${decision.decision}`
      : "pending"
    : "-";
  elements.approvalDetailScope.textContent = approval
    ? joinParts([
        managed ? "managed" : "local",
        policy?.decisionScope?.requestScopedOnly ? "request scoped" : null,
        policy?.decisionScope?.sessionWideApprovalDecisionsAccepted === false ? "session blocked" : null,
      ])
    : "-";
  elements.approvalDetailCommand.textContent = approvalDetailCommandText(request);
  elements.approvalDetailFile.textContent = approvalDetailFileText(request);
  elements.approvalDetailPermissions.textContent = approval
    ? request.hasPermissionsProfile
      ? "profile present / grants omitted"
      : "none"
    : "-";
  elements.approvalDetailChoices.textContent = approval
    ? `${request.safeDenyDecisions?.length ?? 0} deny / ${
        request.safeApproveDecisions?.length ?? 0
      } accept`
    : "-";
  elements.approvalDetailAudit.textContent = approval
    ? joinParts([
        policy?.decisionTokenRequired ? "token required" : null,
        policy?.replayProtectionImplemented ? "replay protected" : null,
        policy?.auditLogPersistent ? "persistent audit" : "process audit",
        policy?.decisionScope?.rawApprovalDetailsReturned === false ? "raw omitted" : null,
      ])
    : "-";
}

function approvalDetailCommandText(request) {
  if (request?.command?.present !== true) {
    return "none";
  }
  const command = request.command;
  const preview = command.approvalPreview ?? {};
  return joinParts([
    `${command.charCount ?? 0} chars`,
    `${command.lineCount ?? 0} lines`,
    preview.textReturned ? "preview returned" : "preview omitted",
    preview.rawTextReturned === false ? "raw omitted" : null,
  ]);
}

function approvalDetailFileText(request) {
  const preview = request?.fileChange?.approvalPreview;
  if (!preview) {
    return "none";
  }
  return joinParts([
    `${preview.charCount ?? 0} chars`,
    preview.textReturned ? "preview returned" : "preview omitted",
    preview.patchTextReturned ? "patch returned" : "patch omitted",
    preview.fileContentsReturned ? "contents returned" : "contents omitted",
    preview.grantRootPresent ? "root present" : null,
    preview.grantRootBasenameReturned ? "root basename returned" : null,
    preview.pathsReturned === false ? "paths omitted" : null,
  ]);
}

function approvalQueueActionsText(actions) {
  return `${actions?.denyableRequestCount ?? 0} deny / ${actions?.approvableRequestCount ?? 0} accept`;
}

function approvalManagementText(management) {
  if (!management || management.returned !== true) {
    return "Idle";
  }
  const pending = Number.isSafeInteger(management.pendingRequestCount)
    ? management.pendingRequestCount
    : 0;
  return joinParts([
    management.state ?? "idle",
    `${pending} pending`,
    management.forwardedDenyAvailable ? "forward" : null,
    management.acceptOnceAvailable ? "accept" : null,
    pending > 0 && management.visibleSubsetBatchSupported ? "batch" : null,
  ]);
}

function approvalExecutionReadinessText(readiness) {
  if (!readiness || readiness.returned !== true) {
    return "Idle";
  }
  const actionable = Number.isSafeInteger(readiness.actionableRequestCount)
    ? readiness.actionableRequestCount
    : 0;
  const pending = Number.isSafeInteger(readiness.pendingRequestCount)
    ? readiness.pendingRequestCount
    : 0;
  return joinParts([
    readiness.state ?? "idle",
    actionable > 0 ? `${actionable} ready` : null,
    pending > 0 ? `${pending} pending` : null,
    readiness.acceptOnceAvailable ? "accept" : null,
    readiness.forwardedDenyAvailable ? "forward" : null,
    readiness.sessionWideApprovalDecisionsAccepted ? "session" : "request only",
  ]);
}

function approvalDecisionContractText(contract) {
  if (!contract || contract.returned !== true) {
    return "Request only";
  }
  const accepted = Number.isSafeInteger(contract.acceptedDecisionKindCount)
    ? contract.acceptedDecisionKindCount
    : 0;
  return joinParts([
    contract.state ?? "idle",
    contract.requestScopedOnly ? "request only" : "blocked",
    contract.decisionTokenRequired ? "token" : null,
    contract.replayProtectionImplemented ? "replay" : null,
    contract.auditLogPersistent ? "audit" : null,
    accepted > 0 ? `${accepted} choices` : null,
  ]);
}

function approvalRoutingContractText(contract) {
  if (!contract || contract.returned !== true) {
    return "Local deny";
  }
  const pending = Number.isSafeInteger(contract.pendingRequestCount)
    ? contract.pendingRequestCount
    : 0;
  return joinParts([
    contract.routingMode ?? "local-deny-only",
    pending > 0 ? `${pending} pending` : null,
    contract.forwardedDenyAvailable ? "forward" : null,
    contract.acceptOnceAvailable ? "accept" : null,
    contract.decisionTokenRequired ? "token" : null,
    contract.requestScopedOnly ? "request" : null,
  ]);
}

function approvalWorkflowContractText(contract) {
  if (!contract || contract.returned !== true) {
    return "Idle";
  }
  const actionable = Number.isSafeInteger(contract.actionableRequestCount)
    ? contract.actionableRequestCount
    : 0;
  const filters = Number.isSafeInteger(contract.clientFilterCount)
    ? contract.clientFilterCount
    : 0;
  return joinParts([
    contract.workflowMode ?? contract.state ?? "idle",
    actionable > 0 ? `${actionable} actions` : null,
    contract.visibleSubsetBatchSupported ? "batch" : null,
    filters > 0 ? `${filters} filters` : null,
    contract.rowDecisionControlsReturned ? "rows" : null,
    contract.requestScopedOnly ? "request only" : null,
  ]);
}

function approvalSafetyContractText(contract) {
  if (!contract || contract.returned !== true) {
    return "Request only";
  }
  return joinParts([
    contract.state ?? "idle",
    contract.requestScopedOnly ? "request only" : "blocked",
    contract.decisionTokenRequired ? "token" : null,
    contract.replayProtectionImplemented ? "replay" : null,
    contract.auditLogPersistent ? "audit" : null,
    contract.sessionWideApprovalDecisionsAccepted ? "session" : "no session",
  ]);
}

function approvalAuditContractText(contract) {
  if (!contract || contract.returned !== true) {
    return "Replay";
  }
  const history = Number.isSafeInteger(contract.historyCount) ? contract.historyCount : 0;
  return joinParts([
    contract.auditMode ?? contract.state ?? "idle",
    history > 0 ? `${history} history` : null,
    contract.replayProtectionImplemented ? "replay" : null,
    contract.auditLogPersistent ? "persistent" : "process",
    contract.decisionTokenRequired ? "token" : null,
  ]);
}

function approvalAuthorityContractText(contract) {
  if (!contract || contract.returned !== true) {
    return "Request only";
  }
  return joinParts([
    contract.authorityMode ?? contract.state ?? "idle",
    contract.acceptOnceAvailable ? "accept once" : null,
    contract.forwardedDenyAvailable ? "forward deny" : null,
    contract.commandApprovalAcceptOnceOnly ? "command once" : null,
    contract.fileChangeApprovalAcceptOnceOnly ? "file once" : null,
    contract.sessionWideApprovalDecisionsAccepted ? "session" : "no session",
  ]);
}

function approvalInteractionContractText(contract) {
  if (!contract || contract.returned !== true) {
    return "Idle";
  }
  const actionable = Number.isSafeInteger(contract.actionableRequestCount)
    ? contract.actionableRequestCount
    : 0;
  return joinParts([
    contract.interactionMode ?? contract.state ?? "idle",
    actionable > 0 ? `${actionable} actions` : null,
    contract.rowControlsRendered ? "rows" : null,
    contract.bulkControlsRendered ? "batch" : null,
    contract.clientSideBatchLimitApplied ? `limit ${contract.maxBatchDecisionCount ?? 0}` : null,
    contract.rowBusyStateClientOnly ? "busy" : null,
    contract.refreshAfterDecisionRequired ? "refresh" : null,
    contract.requestScopedOnly ? "request only" : null,
  ]);
}

function approvalBatchWindowText(actions) {
  const pending = Number.isSafeInteger(actions?.pendingRequestCount) ? actions.pendingRequestCount : 0;
  const limit = Number.isSafeInteger(actions?.maxBatchDecisionCount)
    ? actions.maxBatchDecisionCount
    : 0;
  return `${Math.min(pending, limit)} / ${limit}`;
}

function renderApprovalFilterState(approvals, filteredApprovals) {
  const total = Array.isArray(approvals) ? approvals.length : 0;
  const visible = Array.isArray(filteredApprovals) ? filteredApprovals.length : 0;
  syncApprovalFilterButtons(approvals);
  elements.approvalFilterSummary.textContent =
    total === 0
      ? "No approval decisions."
      : `${visible} / ${total} visible (${approvalFilterLabel(approvalQueueFilter)}).`;
}

function syncApprovalFilterButtons(approvals) {
  for (const button of elements.approvalFilterButtons) {
    const filter = button.dataset.approvalFilter || "all";
    const selected = filter === approvalQueueFilter;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", selected ? "true" : "false");
    button.textContent = `${approvalFilterLabel(filter)} ${
      filterApprovalQueue(approvals, filter).length
    }`;
  }
}

function renderApprovalDecisionHistory(history) {
  elements.approvalDecisionHistoryList.replaceChildren();
  const items = Array.isArray(history?.items) ? history.items : [];
  if (items.length === 0) {
    elements.approvalDecisionHistoryList.append(
      emptyState("No approval decisions recorded."),
    );
    return;
  }

  for (const item of items) {
    const request = item.request ?? {};
    const decision = item.browserDecision ?? {};
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = decision.decision ?? "decision";

    const meta = document.createElement("span");
    meta.textContent = joinParts([
      request.kind,
      request.method,
      item.target?.threadIdSuffix ? `thread ${item.target.threadIdSuffix}` : null,
      item.target?.turnIdSuffix ? `turn ${item.target.turnIdSuffix}` : null,
    ]);

    const detail = document.createElement("p");
    detail.className = "boundary-detail";
    detail.textContent = joinParts([
      request.command?.present ? `${request.command.charCount ?? 0} command chars` : null,
      request.command?.present ? `${request.command.lineCount ?? 0} command lines` : null,
      request.fileChange?.approvalPreview?.grantRootBasenameReturned
        ? `root ${request.fileChange.approvalPreview.grantRootBasename}`
        : null,
      request.hasPermissionsProfile ? "permissions requested" : null,
      item.recordedAt ? `recorded ${item.recordedAt}` : null,
    ]);

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    const replay = item.replayProtection ?? {};
    for (const value of [
      decision.forwarded ? "forwarded" : "local",
      decision.appServerTouched ? "app-server" : "no app-server",
      decision.auditLogged ? "audit log" : null,
      replay.singleDecisionPerRequest ? "replay protected" : null,
      replay.persistentAudit ? "persistent replay" : replay.processLocal ? "process replay" : null,
      request.safeApproveDecisionCount ? `${request.safeApproveDecisionCount} safe accepts` : null,
      request.safeDenyDecisionCount ? `${request.safeDenyDecisionCount} safe denies` : null,
      "token omitted",
      "request key omitted",
      "raw omitted",
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, detail, chips);
    elements.approvalDecisionHistoryList.append(row);
  }
}

function latestApprovalDecisionText(decision) {
  if (!decision) {
    return "-";
  }
  return joinParts([
    decision.decision,
    decision.kind,
    decision.threadIdSuffix ? `thread ${decision.threadIdSuffix}` : null,
    decision.forwarded ? "forwarded" : "local",
  ]);
}

function turnSessionOperationsText(operations) {
  return `${operations?.enabledOperationCount ?? 0} ops`;
}

function turnSessionRoutingContractText(contract, operations = {}) {
  if (contract?.returned === true) {
    const pending = Number.isSafeInteger(contract.pendingApprovalCount)
      ? contract.pendingApprovalCount
      : 0;
    return joinParts([
      contract.routingMode ?? "blocked",
      contract.turnStartRoute,
      pending > 0 ? `${pending} pending` : null,
      contract.approvalForwardingEnabled ? "forward" : null,
      contract.approvalAcceptEnabled ? "accept once" : null,
      contract.requestScopedApprovalOnly ? "request only" : null,
    ]);
  }
  if (operations?.sessionManagerEnabled) {
    return operations.persistentSessionManager ? "Manager" : "Manager gate";
  }
  return operations?.turnStartEnabled ? "Local" : "Blocked";
}

function turnSessionManagementText(management) {
  if (!management || management.returned !== true) {
    return "Blocked";
  }
  const enabled = Number.isSafeInteger(management.enabledOperationCount)
    ? management.enabledOperationCount
    : 0;
  return joinParts([
    management.state ?? "blocked",
    enabled > 0 ? `${enabled} ops` : null,
    management.pendingApprovalCount > 0 ? `${management.pendingApprovalCount} pending` : null,
    management.sessionManagerEnabled ? "manager" : null,
    management.approvalForwardingEnabled ? "forward" : null,
  ]);
}

function turnSessionReadinessText(readiness) {
  if (!readiness || readiness.returned !== true) {
    return "Blocked";
  }
  const pending = Number.isSafeInteger(readiness.pendingApprovalCount)
    ? readiness.pendingApprovalCount
    : 0;
  return joinParts([
    readiness.state ?? "blocked",
    readiness.turnStartEnabled ? "turn" : null,
    readiness.sessionManagerEnabled ? "manager" : null,
    pending > 0 ? `${pending} pending` : null,
    readiness.requestScopedApprovalOnly ? "request only" : null,
  ]);
}

function turnSessionWorkflowContractText(contract) {
  if (!contract || contract.returned !== true) {
    return "Blocked";
  }
  const pending = Number.isSafeInteger(contract.pendingApprovalCount)
    ? contract.pendingApprovalCount
    : 0;
  const operations = Number.isSafeInteger(contract.enabledOperationCount)
    ? contract.enabledOperationCount
    : 0;
  return joinParts([
    contract.workflowMode ?? contract.state ?? "blocked",
    contract.turnStartRoute,
    operations > 0 ? `${operations} ops` : null,
    pending > 0 ? `${pending} pending` : null,
    contract.approvalWorkflowVisible ? "approvals" : null,
    contract.requestScopedApprovalOnly ? "request only" : null,
  ]);
}

function turnSessionSafetyContractText(contract) {
  if (!contract || contract.returned !== true) {
    return "Request only";
  }
  return joinParts([
    contract.state ?? "blocked",
    contract.turnStartRoute,
    contract.preflightTokenRequired ? "preflight" : null,
    contract.modelTrafficGateEnabled ? "model gate" : null,
    contract.approvalDecisionTokensRequired ? "approval token" : null,
    contract.requestScopedApprovalOnly ? "request only" : null,
    contract.sessionWideApprovalDecisionsAccepted ? "session" : "no session",
  ]);
}

function turnSessionAuditContractText(contract) {
  if (!contract || contract.returned !== true) {
    return "Ledger";
  }
  return joinParts([
    contract.auditMode ?? "process-local-session-ledger",
    contract.sessionLedgerBounded ? "bounded" : null,
    contract.approvalDecisionAuditPersistent ? "approval audit" : null,
    contract.preflightTokenRequired ? "preflight" : null,
    contract.requestScopedApprovalOnly ? "request only" : null,
  ]);
}

function renderTurnSessions(payload) {
  const sessions = Array.isArray(payload.sessions) ? payload.sessions : [];
  const lifecycle = payload.lifecycle ?? {};
  const operations = lifecycle.turnSessionOperations ?? {};
  const management = lifecycle.turnSessionManagement ?? {};
  elements.turnSessionCount.textContent = String(payload.sessionCount ?? sessions.length);
  elements.turnSessionLifecycleState.textContent = lifecycle.state ?? "blocked";
  elements.turnSessionOperations.textContent = turnSessionOperationsText(operations);
  elements.turnSessionManagement.textContent = turnSessionManagementText(management);
  elements.turnSessionReadiness.textContent = turnSessionReadinessText(
    lifecycle.turnSessionReadiness,
  );
  elements.turnSessionRouting.textContent = turnSessionRoutingContractText(
    lifecycle.turnSessionRoutingContract,
    operations,
  );
  elements.turnSessionWorkflow.textContent = turnSessionWorkflowContractText(
    lifecycle.turnSessionWorkflowContract,
  );
  elements.turnSessionSafety.textContent = turnSessionSafetyContractText(
    lifecycle.turnSessionSafetyContract,
  );
  elements.turnSessionAudit.textContent = turnSessionAuditContractText(
    lifecycle.turnSessionAuditContract,
  );
  elements.turnSessionPendingCount.textContent = String(lifecycle.pendingApprovalCount ?? 0);
  elements.turnSessionApprovalSessions.textContent = `${lifecycle.pendingApprovalSessionCount ?? 0} / ${
    lifecycle.decidedApprovalSessionCount ?? 0
  }`;
  elements.turnSessionEventCount.textContent = String(lifecycle.returnedEventCount ?? 0);
  elements.turnSessionModelSessions.textContent = String(lifecycle.modelTrafficSessionCount ?? 0);
  elements.turnSessionDecisionCount.textContent = String(lifecycle.decidedApprovalCount ?? 0);
  const approvalPolicy = lifecycle.approvalPolicy ?? {};
  elements.turnSessionWideApproval.textContent = approvalPolicy.sessionWideApprovalDecisionsAccepted
    ? "Enabled"
    : "Blocked";
  elements.turnSessionApprovalPolicy.textContent = turnSessionApprovalPolicyText(approvalPolicy);
  elements.turnSessionRejectedGrants.textContent = turnSessionRejectedGrantText(approvalPolicy);
  const managedSession = lifecycle.managedSession ?? {};
  elements.turnSessionManagerState.textContent = managedSession.enabled
    ? joinParts([
        managedSession.state,
        managedSession.activeTurn?.threadIdSuffix
          ? `thread ${managedSession.activeTurn.threadIdSuffix}`
          : null,
      ])
    : "Disabled";
  elements.turnSessionManagerPending.textContent = String(managedSession.pendingApprovalCount ?? 0);
  elements.turnSessionLatestTurn.textContent = lifecycle.latest?.turnIdSuffix
    ? lifecycle.latest.turnIdSuffix
    : "-";
  elements.turnSessionLatestEvent.textContent = lifecycle.latest?.eventMethod
    ? joinParts([lifecycle.latest.eventMethod, lifecycle.latest.eventStatus])
    : "-";
  elements.turnSessionList.replaceChildren();

  if (sessions.length === 0) {
    elements.turnSessionList.append(emptyState("No started turn sessions recorded."));
    return;
  }

  for (const session of sessions) {
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = session.target?.turnIdSuffix
      ? `Turn ${session.target.turnIdSuffix}`
      : session.sessionId ?? "Turn session";

    const meta = document.createElement("span");
    meta.textContent = joinParts([
      session.status,
      session.target?.threadIdSuffix ? `thread ${session.target.threadIdSuffix}` : null,
      session.workspace?.label,
    ]);

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      session.action?.approvalMode,
      session.action?.modelTraffic ? "model traffic" : null,
      `${session.prompt?.charCount ?? 0} chars`,
      `${session.approvals?.requestCount ?? 0} approvals`,
      `${session.events?.returnedEventCount ?? 0} events`,
      session.approvals?.unsupportedCount ? `${session.approvals.unsupportedCount} unsupported` : null,
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, chips);
    appendApprovalDecisionRows(row, session);
    appendTurnSessionEventRows(row, session);
    elements.turnSessionList.append(row);
  }
}

function turnSessionApprovalPolicyText(policy) {
  if (policy?.acceptOnceApprovalDecisionsAccepted) {
    return "request-scoped / accept once";
  }
  if (policy?.forwardedDenyDecisionsAccepted) {
    return "request-scoped / deny forwarded";
  }
  if (policy?.localDenyDecisionsAccepted) {
    return "request-scoped / local deny";
  }
  return "request-scoped";
}

function turnSessionRejectedGrantText(policy) {
  const rejectedScopeCount = Number.isSafeInteger(policy?.rejectedScopeCount)
    ? policy.rejectedScopeCount
    : 0;
  return `${rejectedScopeCount} blocked`;
}

function appendApprovalDecisionRows(row, session) {
  const requests = Array.isArray(session.approvals?.requests) ? session.approvals.requests : [];
  if (requests.length === 0) {
    return;
  }

  const list = document.createElement("div");
  list.className = "boundary-list compact";
  for (const request of requests) {
    const item = document.createElement("div");
    item.className = "boundary-subrow";

    const label = document.createElement("span");
    label.textContent = joinParts([
      request.kind,
      request.command?.present ? `${request.command.charCount ?? 0} command chars` : null,
      request.fileChange?.approvalPreview?.grantRootBasenameReturned
        ? `root ${request.fileChange.approvalPreview.grantRootBasename}`
        : null,
      request.decision ? `auto ${request.decision}` : null,
      request.browserDecision?.decision ? `local ${request.browserDecision.decision}` : null,
    ]);

    item.append(
      label,
      approvalButtons({
        sessionId: session.sessionId,
        request,
        browserDecision: request.browserDecision,
      }),
    );
    appendApprovalPreview(item, request);
    list.append(item);
  }
  row.append(list);
}

function appendApprovalPreview(row, request) {
  const preview = request?.command?.approvalPreview?.textReturned
    ? request.command.approvalPreview
    : request?.fileChange?.approvalPreview;
  if (!preview?.textReturned || !preview.text) {
    return;
  }
  const detail = document.createElement("pre");
  detail.className = "approval-preview";
  detail.textContent = preview.text;
  row.append(detail);
}

function appendApprovalButtons(row, approval) {
  row.append(approvalButtons(approval));
}

function approvalButtons({ sessionId, request, browserDecision }) {
  const safeRequest = request ?? {};
  const actions = document.createElement("div");
  actions.className = "boundary-button-list approval-row-actions";
  for (const decision of safeRequest.safeApproveDecisions ?? []) {
    actions.append(
      approvalDecisionButton({
        actions,
        sessionId,
        request: safeRequest,
        browserDecision,
        decision,
        action: "accept",
      }),
    );
  }
  for (const decision of safeRequest.safeDenyDecisions ?? []) {
    actions.append(
      approvalDecisionButton({
        actions,
        sessionId,
        request: safeRequest,
        browserDecision,
        decision,
        action: "deny",
      }),
    );
  }
  return actions;
}

function approvalDecisionButton({
  actions,
  sessionId,
  request,
  browserDecision,
  decision,
  action,
}) {
  const button = document.createElement("button");
  button.className = "secondary-button compact-button";
  button.type = "button";
  button.textContent = approvalDecisionButtonText(decision);
  button.dataset.approvalDecisionAction = action;
  button.dataset.approvalDecisionValue = decision;
  button.setAttribute(
    "aria-label",
    approvalDecisionAriaLabel({ action, decision, request }),
  );
  button.disabled = !approvalDecisionActionReady({ sessionId, request, browserDecision });
  button.addEventListener("click", async () => {
    actions.setAttribute("aria-busy", "true");
    setApprovalActionButtonsDisabled(actions, true);
    elements.approvalBulkStatus.textContent = approvalDecisionProgressText(action);
    hideError();
    try {
      await recordApprovalDecision({
        sessionId,
        requestKey: request.requestKey,
        decisionToken: request.decisionToken,
        decision,
      });
      elements.approvalBulkStatus.textContent = approvalDecisionCompleteText(action);
    } catch (error) {
      actions.removeAttribute("aria-busy");
      setApprovalActionButtonsDisabled(
        actions,
        !approvalDecisionActionReady({ sessionId, request, browserDecision }),
      );
      elements.approvalBulkStatus.textContent = approvalDecisionFailedText(action);
      renderError(error);
    }
  });
  return button;
}

function approvalDecisionActionReady({ sessionId, request, browserDecision }) {
  return Boolean(sessionId && request?.requestKey && request?.decisionToken && !browserDecision);
}

function setApprovalActionButtonsDisabled(actions, disabled) {
  for (const button of actions.querySelectorAll("button")) {
    button.disabled = disabled;
  }
}

function approvalDecisionButtonText(decision) {
  switch (decision) {
    case "accept":
      return "Accept";
    case "decline":
      return "Decline";
    case "cancel":
      return "Cancel";
    case "denied":
      return "Deny";
    case "abort":
      return "Abort";
    default:
      return decision;
  }
}

function approvalDecisionAriaLabel({ action, decision, request }) {
  return joinParts([
    action === "accept" ? "Accept approval once" : "Deny approval",
    request?.kind,
    request?.method,
    `decision ${decision}`,
  ]);
}

function approvalDecisionProgressText(action) {
  return action === "accept" ? "Recording accept-once approval." : "Recording deny decision.";
}

function approvalDecisionCompleteText(action) {
  return action === "accept" ? "Accept-once approval recorded." : "Deny decision recorded.";
}

function approvalDecisionFailedText(action) {
  return action === "accept" ? "Accept-once approval failed." : "Deny decision failed.";
}

function appendTurnSessionEventRows(row, session) {
  const events = Array.isArray(session.events?.items) ? session.events.items : [];
  if (events.length === 0) {
    return;
  }

  const list = document.createElement("div");
  list.className = "event-log compact";
  list.setAttribute("role", "list");

  for (const event of events.slice(-5)) {
    const item = document.createElement("div");
    item.className = "event-row";
    item.setAttribute("role", "listitem");

    const method = document.createElement("span");
    method.className = "event-method";
    method.textContent = event.method ?? "unknown";

    const detail = document.createElement("span");
    detail.className = "event-detail";
    detail.textContent = joinParts([
      event.status,
      event.itemType,
      event.threadIdSuffix ? `thread ${event.threadIdSuffix}` : null,
      event.turnIdSuffix ? `turn ${event.turnIdSuffix}` : null,
      ...terminalLifecycleParts(event.terminalLifecycle),
    ]);

    item.append(method, detail);
    if (event.liveText?.text) {
      const preview = document.createElement("pre");
      preview.className = "event-preview";
      preview.textContent = event.liveText.text;
      item.append(preview);
    }
    list.append(item);
  }

  row.append(list);
}

function terminalLifecycleParts(lifecycle) {
  if (!lifecycle) {
    return [];
  }
  const parts = [lifecycle.kind];
  const inputChars = lifecycle.input?.charCount;
  const outputChars = lifecycle.output?.charCount;
  const encodedChars = lifecycle.output?.encodedCharCount;
  const stdoutChars = lifecycle.stdout?.charCount;
  const stderrChars = lifecycle.stderr?.charCount;
  if (Number.isSafeInteger(inputChars) && inputChars > 0) {
    parts.push(`${inputChars} input chars`);
  }
  if (Number.isSafeInteger(outputChars) && outputChars > 0) {
    parts.push(`${outputChars} output chars`);
  }
  if (Number.isSafeInteger(encodedChars) && encodedChars > 0) {
    parts.push(`${encodedChars} encoded chars`);
  }
  if (Number.isSafeInteger(stdoutChars) && stdoutChars > 0) {
    parts.push(`${stdoutChars} stdout chars`);
  }
  if (Number.isSafeInteger(stderrChars) && stderrChars > 0) {
    parts.push(`${stderrChars} stderr chars`);
  }
  if (Number.isSafeInteger(lifecycle.exitCode)) {
    parts.push(`exit ${lifecycle.exitCode}`);
  }
  if (lifecycle.capReached || lifecycle.stdout?.capReached || lifecycle.stderr?.capReached) {
    parts.push("cap reached");
  }
  if (
    lifecycle.outputTextReturned === false ||
    lifecycle.inputTextReturned === false ||
    lifecycle.sessionIdentifierReturned === false
  ) {
    parts.push("raw omitted");
  }
  return parts.filter(Boolean);
}

function renderSettingsIntegrations(payload) {
  const surfaces = payload.surfaces ?? {};
  const settings = surfaces.settings ?? {};
  const auth = surfaces.auth ?? {};
  const mcp = surfaces.mcp ?? {};
  const apps = surfaces.apps ?? {};
  const externalAgentConfig = surfaces.externalAgentConfig ?? {};
  const skills = surfaces.skills ?? {};
  const plugins = surfaces.plugins ?? {};
  const inventory = payload.inventory ?? {};
  const integrationScope = payload.integrationScope ?? {};
  const integrationLifecycle = payload.integrationLifecycle ?? {};
  const codexAppSettings = payload.codexAppSettings ?? {};

  elements.settingsStateText.textContent = settings.state ?? "blocked";
  elements.settingsSourceText.textContent = payload.appServer?.touched ? "Inventory" : "Config summary";
  elements.appSettingsParityText.textContent = codexAppSettings.returned
    ? `${codexAppSettings.availableSectionCount ?? 0} / ${
        codexAppSettings.officialSectionCount ?? 0
      }`
    : "Blocked";
  elements.appSettingsBlockedText.textContent = codexAppSettings.returned
    ? `${codexAppSettings.blockedSectionCount ?? 0} blocked`
    : "Blocked";
  elements.appSettingsValuesText.textContent =
    codexAppSettings.localSettingValuesReturned || codexAppSettings.settingValuesReturned
      ? "Returned"
      : "Hidden";
  const appearance = codexAppSettings.appearance ?? {};
  elements.appAppearanceText.textContent = appearance.returned
    ? `${appearance.catalogOnlySettingCount ?? 0} catalog / ${
        appearance.settingCount ?? 0
      } tracked`
    : "Blocked";
  elements.appAppearanceValuesText.textContent =
    appearance.themeValuesReturned ||
    appearance.colorValuesReturned ||
    appearance.fontNamesReturned ||
    appearance.customThemeReturned
      ? "Returned"
      : "Hidden";
  const keyboardShortcuts = codexAppSettings.keyboardShortcuts ?? {};
  elements.appShortcutsText.textContent = keyboardShortcuts.returned
    ? `${keyboardShortcuts.localShortcutCount ?? 0} local / ${
        keyboardShortcuts.shortcutCount ?? 0
      } tracked`
    : "Blocked";
  elements.appShortcutsEditingText.textContent =
    keyboardShortcuts.customBindingEditorAvailable || keyboardShortcuts.resetCustomBindingsAvailable
      ? "Enabled"
      : "Blocked";
  const notifications = codexAppSettings.notifications ?? {};
  elements.appNotificationsText.textContent = notifications.returned
    ? `${notifications.boundaryOnlySettingCount ?? 0} boundary / ${
        notifications.settingCount ?? 0
      } tracked`
    : "Blocked";
  elements.appNotificationsPermissionText.textContent =
    notifications.permissionPromptAvailable || notifications.permissionPromptExecuted
      ? "Enabled"
      : "Blocked";
  const personalization = codexAppSettings.personalization ?? {};
  elements.appPersonalizationText.textContent = personalization.returned
    ? `${personalization.catalogOnlySettingCount ?? 0} catalog / ${
        personalization.settingCount ?? 0
      } tracked`
    : "Blocked";
  elements.appPersonalizationValueText.textContent =
    personalization.currentPersonalityReturned ||
    personalization.customInstructionsReturned ||
    personalization.personalInstructionsReturned
      ? "Returned"
      : "Hidden";
  elements.requirementsStateText.textContent = settings.requirementsAvailable
    ? `${inventory.requirements?.featureRequirementCount ?? 0} features`
    : "Blocked";
  elements.modelInventoryStateText.textContent = settings.modelListingAvailable
    ? `${inventory.models?.modelCount ?? 0} models`
    : "Blocked";
  elements.modelCapabilitiesStateText.textContent = settings.modelProviderCapabilitiesAvailable
    ? `${inventory.modelProviderCapabilities?.enabledCapabilityCount ?? 0} enabled`
    : "Blocked";
  elements.collaborationModesStateText.textContent = settings.collaborationModeListingAvailable
    ? `${inventory.collaborationModes?.modeCount ?? 0} modes`
    : "Blocked";
  elements.permissionProfilesStateText.textContent = settings.permissionProfileListingAvailable
    ? `${inventory.permissionProfiles?.profileCount ?? 0} profiles`
    : "Blocked";
  elements.remoteControlStateText.textContent = settings.remoteControlStatusAvailable
    ? remoteControlStatusText(inventory.remoteControlStatus)
    : "Blocked";
  elements.hooksStateText.textContent = settings.hookListingAvailable
    ? `${inventory.hooks?.hookCount ?? 0} hooks`
    : "Blocked";
  elements.settingsMutationsText.textContent = settings.mutationEnabled ? "Enabled" : "Blocked";
  elements.authStateText.textContent = authStateText(inventory.account, auth);
  elements.rateLimitsStateText.textContent = rateLimitsStateText(inventory.rateLimits, auth);
  elements.accountUsageStateText.textContent = auth.usageAvailable
    ? `${inventory.accountUsage?.summaryMetricCount ?? 0} metrics`
    : "Blocked";
  elements.workspaceMessagesStateText.textContent = auth.workspaceMessagesAvailable
    ? `${inventory.workspaceMessages?.messageCount ?? 0} messages`
    : "Blocked";
  elements.authCallbackText.textContent = auth.callbackHandlersEnabled ? "Enabled" : "Blocked";
  elements.accountLoginText.textContent = auth.loginEnabled ? "Enabled" : "Blocked";
  elements.accountLoginCancelText.textContent = auth.loginCancelEnabled ? "Enabled" : "Blocked";
  elements.accountResetCreditText.textContent = auth.resetCreditConsumeEnabled ? "Enabled" : "Blocked";
  elements.activeLoginFlowCount.textContent = String(auth.activeLoginFlowCount ?? 0);
  elements.accountLogoutText.textContent = auth.logoutEnabled ? "Enabled" : "Blocked";
  elements.integrationScopeText.textContent =
    integrationScope.enabledReadMethodCount > 0 || integrationScope.enabledLocalGateCount > 0
      ? `${integrationScope.enabledReadMethodCount ?? 0} read / ${
          integrationScope.enabledLocalGateCount ?? 0
        } gates`
      : "Blocked";
  elements.integrationLifecycleState.textContent =
    integrationLifecycle.state ?? "read-only";
  elements.integrationLifecycleActivity.textContent = `${
    integrationLifecycle.historyCount ?? 0
  } history / ${integrationLifecycle.enabledMutationGateCount ?? 0} enabled`;
  const integrationActions = integrationLifecycle.integrationActions ?? {};
  elements.integrationActionGates.textContent = integrationActionGatesText(integrationActions);
  elements.integrationManagement.textContent = integrationManagementText(
    integrationLifecycle.integrationManagement,
  );
  elements.integrationExecutionReadiness.textContent = integrationExecutionReadinessText(
    integrationLifecycle.integrationExecutionReadiness,
  );
  elements.integrationSafetyContract.textContent = integrationSafetyContractText(
    integrationLifecycle.integrationSafetyContract,
  );
  elements.integrationRoutingContract.textContent = integrationRoutingContractText(
    integrationLifecycle.integrationRoutingContract,
  );
  elements.integrationWorkflowContract.textContent = integrationWorkflowContractText(
    integrationLifecycle.integrationWorkflowContract,
  );
  elements.integrationAuditContract.textContent = integrationAuditContractText(
    integrationLifecycle.integrationAuditContract,
  );
  elements.integrationProvenanceContract.textContent = integrationProvenanceContractText(
    integrationLifecycle.integrationProvenanceContract,
  );
  elements.integrationExternalCodeContract.textContent = integrationExternalCodeContractText(
    integrationLifecycle.integrationExternalCodeContract,
  );
  elements.integrationExecutableActions.textContent =
    integrationExecutableActionsText(integrationActions);
  elements.integrationLifecycleLatest.textContent = latestIntegrationActionText(
    integrationLifecycle.latestAction,
  );
  elements.integrationBlockedCount.textContent = String(
    integrationScope.blockedMutationMethodCount ?? 0,
  );
  elements.mcpStateText.textContent = mcp.serverListingAvailable
    ? `${inventory.mcp?.serverCount ?? 0} servers`
    : mcp.serverReloadEnabled
      ? "Reload gate"
      : mcp.oauthLoginEnabled
      ? "OAuth gate"
      : mcp.toolInvocationEnabled
      ? "Tool gate"
      : mcp.resourceReadEnabled
        ? "Resource gate"
        : "Blocked";
  elements.appsStateText.textContent = apps.listingAvailable
    ? `${inventory.apps?.appCount ?? 0} apps`
    : "Blocked";
  elements.externalConfigStateText.textContent = externalAgentConfig.detectionAvailable
    ? `${inventory.externalAgentConfig?.itemCount ?? 0} items`
    : externalAgentConfig.importPreflightEnabled
      ? "Import check"
      : "Blocked";
  elements.externalConfigImportHistoryText.textContent =
    externalAgentConfig.importHistoriesAvailable
      ? `${inventory.externalAgentConfigImportHistories?.historyCount ?? 0} imports`
      : "Blocked";
  elements.skillsStateText.textContent = skills.listingAvailable
    ? `${inventory.skills?.skillCount ?? 0} skills`
    : skills.configWriteEnabled
      ? "Config gate"
      : "Blocked";
  elements.pluginsStateText.textContent = plugins.listingAvailable
    ? `${inventory.plugins?.pluginCount ?? 0} plugins`
    : plugins.detailReadEnabled || plugins.contentReadEnabled || plugins.shareListEnabled
      ? "Read gates"
      : "Blocked";
  elements.installedPluginsStateText.textContent = plugins.installedListingAvailable
    ? `${inventory.installedPlugins?.installedCount ?? 0} installed`
    : "Blocked";
  elements.integrationsTrafficText.textContent = payload.appServer?.touched ? "App-server" : "None";
  const methodAudit = Array.isArray(payload.methodAudit) ? payload.methodAudit : [];
  elements.integrationsAuditedText.textContent = String(methodAudit.length);
  const upstreamDrift = payload.upstreamDrift ?? {};
  elements.upstreamDriftText.textContent =
    upstreamDrift.methodCount > 0 ? `${upstreamDrift.methodCount} blocked` : "None";
  elements.serverRequestBoundaryText.textContent = serverRequestBoundaryText(
    payload.serverRequestBoundary,
  );
  elements.serverNotificationBoundaryText.textContent = serverNotificationBoundaryText(
    payload.serverNotificationBoundary,
  );
  elements.serverBoundaryContractText.textContent = serverBoundaryContractText(
    payload.serverRequestBoundary,
    payload.serverNotificationBoundary,
  );
  renderAccountLoginHistory(payload.accountLoginHistory);
  renderAccountResetCreditHistory(payload.accountResetCreditHistory);
  renderAccountLogoutHistory(payload.accountLogoutHistory);
  renderIntegrationPreflightHistory(payload.preflightHistory);
  renderIntegrationConfirmationHistory(payload.preflightConfirmationHistory);
  renderIntegrationDetails(inventory);
  renderCodexAppSettingsParity(codexAppSettings);
  renderCodexAppAppearanceSettings(appearance);
  renderCodexAppKeyboardShortcuts(keyboardShortcuts);
  renderCodexAppNotificationSettings(notifications);
  renderCodexAppPersonalizationSettings(personalization);
  renderUpstreamDrift(upstreamDrift);
  renderIntegrationMethodAudit(methodAudit);
}

function renderThreadRealtimeVoices(summary, policy) {
  if (!summary) {
    elements.realtimeVoicesStateText.textContent = "No metadata";
    return;
  }
  if (policy?.realtimeVoicesReadEnabled !== true) {
    elements.realtimeVoicesStateText.textContent = "Blocked";
    return;
  }
  elements.realtimeVoicesStateText.textContent = joinParts([
    `${summary.totalKnownVoiceCount ?? 0} voices`,
    summary.defaultV1 ? `v1 ${summary.defaultV1}` : null,
    summary.defaultV2 ? `v2 ${summary.defaultV2}` : null,
    summary.paramsAccepted === false ? "no params" : null,
  ]);
}

function latestIntegrationActionText(action) {
  if (!action) {
    return "-";
  }
  return joinParts([
    action.method,
    action.status,
    action.source,
    action.appServerTouched ? "app-server" : "local",
  ]);
}

function serverRequestBoundaryText(boundary) {
  if (!boundary?.returned) {
    return "Missing";
  }
  return joinParts([
    `${boundary.blockedMethodCount ?? 0} blocked`,
    boundary.browserHandlersEnabled ? "handlers on" : "handlers off",
  ]);
}

function serverNotificationBoundaryText(boundary) {
  if (!boundary?.returned) {
    return "Missing";
  }
  return joinParts([
    `${boundary.blockedMethodCount ?? 0} blocked`,
    boundary.browserStreamEnabled ? "stream on" : "stream off",
  ]);
}

function serverBoundaryContractText(requestBoundary, notificationBoundary) {
  if (!requestBoundary?.returned || !notificationBoundary?.returned) {
    return "Missing";
  }
  const rawOmitted =
    requestBoundary.rawPayloadsReturned === false &&
    notificationBoundary.rawPayloadsReturned === false;
  const tokensOmitted = requestBoundary.authTokensReturned === false;
  const mediaOmitted =
    notificationBoundary.transcriptTextReturned === false &&
    notificationBoundary.audioDataReturned === false &&
    notificationBoundary.sdpReturned === false;
  return joinParts([
    rawOmitted ? "raw omitted" : "raw visible",
    tokensOmitted ? "tokens hidden" : "tokens visible",
    mediaOmitted ? "media hidden" : "media visible",
  ]);
}

function integrationActionGatesText(actions) {
  const preflightOnlyGateCount = actions.preflightOnlyGateCount ?? 0;
  const localGateCount = actions.localGateCount ?? 0;
  return `${preflightOnlyGateCount} preflight / ${localGateCount} local`;
}

function integrationManagementText(management) {
  if (!management || management.returned !== true) {
    return "Blocked";
  }
  const executable = Number.isSafeInteger(management.executableActionCount)
    ? management.executableActionCount
    : 0;
  const preflight = Number.isSafeInteger(management.preflightOnlyGateCount)
    ? management.preflightOnlyGateCount
    : 0;
  const history = Number.isSafeInteger(management.historyCount) ? management.historyCount : 0;
  return joinParts([
    management.state ?? "blocked",
    executable > 0 ? `${executable} executable` : null,
    preflight > 0 ? `${preflight} preflight` : null,
    management.appServerInventoryVisible ? "inventory" : null,
    history > 0 ? `${history} history` : null,
  ]);
}

function integrationExecutionReadinessText(readiness) {
  if (!readiness || readiness.returned !== true) {
    return "Blocked";
  }
  const executable = Number.isSafeInteger(readiness.executableActionCount)
    ? readiness.executableActionCount
    : 0;
  const preflight = Number.isSafeInteger(readiness.preflightOnlyGateCount)
    ? readiness.preflightOnlyGateCount
    : 0;
  return joinParts([
    readiness.state ?? "blocked",
    executable > 0 ? `${executable} actions` : null,
    preflight > 0 ? `${preflight} checks` : null,
    readiness.genericMutationExecutionEnabled ? "generic enabled" : "generic blocked",
  ]);
}

function integrationSafetyContractText(contract) {
  if (!contract || contract.returned !== true) {
    return "Blocked";
  }
  const executable = Number.isSafeInteger(contract.executableActionCount)
    ? contract.executableActionCount
    : 0;
  const blocked = Number.isSafeInteger(contract.blockedMutationMethodCount)
    ? contract.blockedMutationMethodCount
    : 0;
  return joinParts([
    contract.state ?? "blocked",
    executable > 0 ? `${executable} gated` : null,
    blocked > 0 ? `${blocked} blocked` : null,
    contract.requiresPreflightForMutations ? "preflight" : null,
    contract.dedicatedRoutesOnly ? "dedicated" : null,
  ]);
}

function integrationRoutingContractText(contract) {
  if (!contract || contract.returned !== true) {
    return "Blocked";
  }
  const executable = Number.isSafeInteger(contract.executableActionCount)
    ? contract.executableActionCount
    : 0;
  const preflight = Number.isSafeInteger(contract.preflightOnlyGateCount)
    ? contract.preflightOnlyGateCount
    : 0;
  return joinParts([
    contract.routingMode ?? "blocked",
    executable > 0 ? `${executable} routes` : null,
    preflight > 0 ? `${preflight} preflight` : null,
    contract.localPreflightRouteEnabled ? "local" : null,
    contract.dedicatedRoutesOnly ? "dedicated" : null,
  ]);
}

function integrationWorkflowContractText(contract) {
  if (!contract || contract.returned !== true) {
    return "Blocked";
  }
  const executable = Number.isSafeInteger(contract.executableActionCount)
    ? contract.executableActionCount
    : 0;
  const preflight = Number.isSafeInteger(contract.preflightOnlyGateCount)
    ? contract.preflightOnlyGateCount
    : 0;
  const groups = Number.isSafeInteger(contract.clientGroupCount) ? contract.clientGroupCount : 0;
  return joinParts([
    contract.workflowMode ?? contract.state ?? "blocked",
    executable > 0 ? `${executable} actions` : null,
    preflight > 0 ? `${preflight} checks` : null,
    groups > 0 ? `${groups} groups` : null,
    contract.historyVisible ? "history" : null,
    contract.requestScopedOnly ? "request only" : null,
  ]);
}

function integrationAuditContractText(contract) {
  if (!contract || contract.returned !== true) {
    return "Blocked";
  }
  const history = Number.isSafeInteger(contract.historyCount) ? contract.historyCount : 0;
  const executable = Number.isSafeInteger(contract.executableActionCount)
    ? contract.executableActionCount
    : 0;
  return joinParts([
    contract.auditMode ?? contract.state ?? "blocked",
    executable > 0 ? `${executable} audit` : null,
    history > 0 ? `${history} history` : null,
    contract.persistentActionAuditRequiredForExecution ? "persistent" : null,
    contract.actionAuditRecordsSanitized ? "sanitized" : null,
  ]);
}

function integrationProvenanceContractText(contract) {
  if (!contract || contract.returned !== true) {
    return "Blocked";
  }
  const executable = Number.isSafeInteger(contract.executableActionCount)
    ? contract.executableActionCount
    : 0;
  const history = Number.isSafeInteger(contract.historyCount) ? contract.historyCount : 0;
  return joinParts([
    contract.provenanceMode ?? contract.state ?? "blocked",
    executable > 0 ? `${executable} gated` : null,
    history > 0 ? `${history} history` : null,
    contract.inventoryCountsOnly ? "counts only" : null,
    contract.externalCodeInstallEnabled ? "install enabled" : "install blocked",
  ]);
}

function integrationExternalCodeContractText(contract) {
  if (!contract || contract.returned !== true) {
    return "Blocked";
  }
  const externalActionCount = Number.isSafeInteger(contract.externalActionCount)
    ? contract.externalActionCount
    : 0;
  return joinParts([
    contract.externalCodeMode ?? contract.state ?? "blocked",
    externalActionCount > 0 ? `${externalActionCount} gated` : null,
    contract.pluginInstallEnabled ? "install enabled" : "install blocked",
    contract.hookCommandsEnabled ? "hooks enabled" : "hooks blocked",
    contract.requiresPreflightForMutations ? "preflight" : null,
    contract.requestScopedOnly ? "request only" : null,
  ]);
}

function integrationExecutableActionsText(actions) {
  const executableActionCount = actions.executableActionCount ?? 0;
  const families = [
    actions.accountActionsEnabled ? "auth" : null,
    actions.settingsActionsEnabled ? "settings" : null,
    actions.mcpActionsEnabled ? "mcp" : null,
    actions.pluginActionsEnabled ? "plugins" : null,
    actions.skillsActionsEnabled ? "skills" : null,
  ].filter(Boolean);
  return families.length > 0
    ? `${executableActionCount} ${families.join("/")}`
    : `${executableActionCount} actions`;
}

function renderAccountLoginHistory(history) {
  const items = Array.isArray(history?.items) ? history.items : [];
  elements.accountLoginHistoryCount.textContent = String(history?.count ?? items.length);
  elements.accountLoginHistoryList.replaceChildren();

  if (items.length === 0) {
    elements.accountLoginHistoryList.append(emptyState("No account login actions recorded."));
    return;
  }

  for (const item of items) {
    const isCancel = item.action?.type === "account-login-cancel";
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = item.action?.method ?? "account/login/start";

    const meta = document.createElement("span");
    meta.textContent = joinParts([item.action?.execution, item.recordedAt]);

    const detail = document.createElement("p");
    detail.className = "boundary-detail";
    detail.textContent = joinParts([
      item.result?.status,
      isCancel ? (item.result?.canceled ? "canceled" : item.result?.notFound ? "not found" : null) : item.result?.resultType,
      item.preflight?.tokenConsumed ? "preflight consumed" : "preflight omitted",
      item.workspace?.label,
    ]);

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      isCancel ? "cancel" : item.result?.deviceCodeFlow ? "device code" : null,
      item.action?.authFlowStarted ? "auth flow" : null,
      item.action?.authFlowCanceled ? "auth canceled" : null,
      item.action?.appServerTouched ? "app-server" : null,
      item.policy?.auditLogWritten ? "audit log" : null,
      "code omitted",
      "urls omitted",
      "login ids omitted",
      "login refs omitted",
      "tokens omitted",
      "raw omitted",
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, detail, chips);
    elements.accountLoginHistoryList.append(row);
  }
}

function renderAccountResetCreditHistory(history) {
  const items = Array.isArray(history?.items) ? history.items : [];
  elements.accountResetCreditHistoryCount.textContent = String(history?.count ?? items.length);
  elements.accountResetCreditHistoryList.replaceChildren();

  if (items.length === 0) {
    elements.accountResetCreditHistoryList.append(
      emptyState("No account reset credit actions recorded."),
    );
    return;
  }

  for (const item of items) {
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = item.action?.method ?? "account/rateLimitResetCredit/consume";

    const meta = document.createElement("span");
    meta.textContent = joinParts([item.result?.outcome, item.recordedAt]);

    const detail = document.createElement("p");
    detail.className = "boundary-detail";
    detail.textContent = joinParts([
      item.action?.execution,
      item.preflight?.tokenConsumed ? "preflight consumed" : "preflight omitted",
      item.workspace?.label,
    ]);

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      item.action?.authMutation ? "auth mutation" : null,
      item.action?.quotaMutation ? "quota mutation" : null,
      item.action?.appServerTouched ? "app-server" : null,
      item.policy?.auditLogWritten ? "audit log" : null,
      "idempotency key omitted",
      "quota values omitted",
      "rate limit ids omitted",
      "tokens omitted",
      "account ids omitted",
      "raw omitted",
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, detail, chips);
    elements.accountResetCreditHistoryList.append(row);
  }
}

function renderAccountLogoutHistory(history) {
  const items = Array.isArray(history?.items) ? history.items : [];
  elements.accountLogoutHistoryCount.textContent = String(history?.count ?? items.length);
  elements.accountLogoutHistoryList.replaceChildren();

  if (items.length === 0) {
    elements.accountLogoutHistoryList.append(emptyState("No account logout actions recorded."));
    return;
  }

  for (const item of items) {
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = item.action?.method ?? "account/logout";

    const meta = document.createElement("span");
    meta.textContent = joinParts([item.action?.execution, item.recordedAt]);

    const detail = document.createElement("p");
    detail.className = "boundary-detail";
    detail.textContent = joinParts([
      item.result?.status,
      item.preflight?.tokenConsumed ? "preflight consumed" : "preflight omitted",
      item.workspace?.label,
    ]);

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      item.action?.authMutation ? "auth mutation" : null,
      item.action?.appServerTouched ? "app-server" : null,
      item.policy?.auditLogWritten ? "audit log" : null,
      "tokens omitted",
      "account ids omitted",
      "urls omitted",
      "raw omitted",
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, detail, chips);
    elements.accountLogoutHistoryList.append(row);
  }
}

function renderIntegrationPreflightHistory(history) {
  elements.integrationPreflightHistoryList.replaceChildren();
  const items = Array.isArray(history?.items) ? history.items : [];
  elements.integrationPreflightHistoryCount.textContent = String(history?.count ?? items.length);
  if (items.length === 0) {
    elements.integrationPreflightHistoryList.append(
      emptyState("No integration preflights recorded."),
    );
    return;
  }

  for (const item of items) {
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = item.action?.method ?? "preflight";

    const meta = document.createElement("span");
    meta.textContent = joinParts([item.action?.type, item.recordedAt]);

    const detail = document.createElement("p");
    detail.className = "boundary-detail";
    if (item.action?.type === "mcp-tool-preflight") {
      detail.textContent = joinParts([
        `${item.mcpTool?.serverCharCount ?? 0} server chars`,
        `${item.mcpTool?.toolCharCount ?? 0} tool chars`,
        `${item.mcpTool?.argumentTopLevelKeyCount ?? 0} arg keys`,
      ]);
    } else if (item.action?.type === "mcp-resource-preflight") {
      detail.textContent = joinParts([
        `${item.mcpResource?.serverCharCount ?? 0} server chars`,
        `${item.mcpResource?.resourceCharCount ?? 0} resource chars`,
        "content omitted",
      ]);
    } else if (item.action?.type === "mcp-oauth-login-preflight") {
      detail.textContent = joinParts([
        `${item.integrationAction?.targetCharCount ?? 0} server chars`,
        "authorization URL omitted",
      ]);
    } else if (item.action?.type === "external-config-import-preflight") {
      detail.textContent = joinParts([
        `${item.integrationAction?.targetCharCount ?? 0} target chars`,
        `${item.integrationAction?.argumentTopLevelKeyCount ?? 0} arg keys`,
        "import details omitted",
      ]);
    } else if (item.action?.type === "review-feedback-preflight") {
      detail.textContent = joinParts([
        `${item.integrationAction?.targetCharCount ?? 0} target chars`,
        `${item.integrationAction?.argumentTopLevelKeyCount ?? 0} arg keys`,
        "review feedback details omitted",
      ]);
    } else if (
      item.action?.type === "plugin-read-preflight" ||
      item.action?.type === "plugin-content-preflight" ||
      item.action?.type === "plugin-share-checkout-preflight" ||
      item.action?.type === "plugin-share-action-preflight" ||
      item.action?.type === "plugin-uninstall-preflight"
    ) {
      detail.textContent = joinParts([
        `${item.integrationAction?.targetCharCount ?? 0} plugin chars`,
        `${item.integrationAction?.argumentTopLevelKeyCount ?? 0} arg keys`,
        "details omitted",
      ]);
    } else if (item.action?.type === "skills-config-preflight") {
      detail.textContent = joinParts([
        `${item.integrationAction?.targetCharCount ?? 0} skill chars`,
        `${item.integrationAction?.argumentTopLevelKeyCount ?? 0} arg keys`,
        "target omitted",
      ]);
    } else if (item.action?.type === "config-value-preflight") {
      detail.textContent = joinParts([
        `${item.integrationAction?.targetCharCount ?? 0} key chars`,
        `${item.integrationAction?.argumentCharCount ?? 0} value chars`,
        "value omitted",
      ]);
    } else if (item.action?.type === "config-batch-preflight") {
      detail.textContent = joinParts([
        `${item.integrationAction?.argumentTopLevelKeyCount ?? 0} edits`,
        `${item.integrationAction?.targetCharCount ?? 0} key chars`,
        `${item.integrationAction?.argumentCharCount ?? 0} batch chars`,
      ]);
    } else if (item.action?.type === "experimental-feature-preflight") {
      detail.textContent = joinParts([
        `${item.integrationAction?.targetCharCount ?? 0} feature chars`,
        `${item.integrationAction?.argumentTopLevelKeyCount ?? 0} values`,
        "feature omitted",
      ]);
    } else if (item.action?.type === "environment-add-preflight") {
      detail.textContent = joinParts([
        `${item.integrationAction?.targetCharCount ?? 0} id chars`,
        `${item.integrationAction?.argumentCharCount ?? 0} url chars`,
        "url omitted",
      ]);
    } else {
      detail.textContent = joinParts([
        item.integrationAction?.category,
        `${item.integrationAction?.targetCharCount ?? 0} target chars`,
        `${item.integrationAction?.argumentTopLevelKeyCount ?? 0} arg keys`,
      ]);
    }

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      "blocked",
      item.preflight?.tokenIssued ? "token issued" : null,
      item.integrationAction?.methodAllowedByAudit ? "audited method" : null,
      "names omitted",
      "target omitted",
      "args omitted",
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, detail, chips);
    elements.integrationPreflightHistoryList.append(row);
  }
}

function renderIntegrationConfirmationHistory(history) {
  elements.integrationConfirmationHistoryList.replaceChildren();
  const items = Array.isArray(history?.items) ? history.items : [];
  elements.integrationConfirmationHistoryCount.textContent = String(history?.count ?? items.length);
  if (items.length === 0) {
    elements.integrationConfirmationHistoryList.append(
      emptyState("No integration confirmations recorded."),
    );
    return;
  }

  for (const item of items) {
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = item.action?.method ?? "confirmation";

    const meta = document.createElement("span");
    meta.textContent = joinParts([item.action?.type, item.recordedAt]);

    const detail = document.createElement("p");
    detail.className = "boundary-detail";
    if (item.action?.type === "mcp-tool-preflight") {
      detail.textContent = joinParts([
        `${item.mcpTool?.serverCharCount ?? 0} server chars`,
        `${item.mcpTool?.toolCharCount ?? 0} tool chars`,
        `${item.mcpTool?.argumentTopLevelKeyCount ?? 0} arg keys`,
      ]);
    } else if (item.action?.type === "mcp-resource-preflight") {
      detail.textContent = joinParts([
        `${item.mcpResource?.serverCharCount ?? 0} server chars`,
        `${item.mcpResource?.resourceCharCount ?? 0} resource chars`,
        "content omitted",
      ]);
    } else if (item.action?.type === "mcp-oauth-login-preflight") {
      detail.textContent = joinParts([
        `${item.integrationAction?.targetCharCount ?? 0} server chars`,
        "authorization URL omitted",
      ]);
    } else if (item.action?.type === "external-config-import-preflight") {
      detail.textContent = joinParts([
        `${item.integrationAction?.targetCharCount ?? 0} target chars`,
        `${item.integrationAction?.argumentTopLevelKeyCount ?? 0} arg keys`,
        "import details omitted",
      ]);
    } else if (item.action?.type === "review-feedback-preflight") {
      detail.textContent = joinParts([
        `${item.integrationAction?.targetCharCount ?? 0} target chars`,
        `${item.integrationAction?.argumentTopLevelKeyCount ?? 0} arg keys`,
        "review feedback details omitted",
      ]);
    } else if (
      item.action?.type === "plugin-read-preflight" ||
      item.action?.type === "plugin-content-preflight" ||
      item.action?.type === "plugin-share-checkout-preflight" ||
      item.action?.type === "plugin-share-action-preflight" ||
      item.action?.type === "plugin-uninstall-preflight"
    ) {
      detail.textContent = joinParts([
        `${item.integrationAction?.targetCharCount ?? 0} plugin chars`,
        `${item.integrationAction?.argumentTopLevelKeyCount ?? 0} arg keys`,
        "details omitted",
      ]);
    } else if (item.action?.type === "skills-config-preflight") {
      detail.textContent = joinParts([
        `${item.integrationAction?.targetCharCount ?? 0} skill chars`,
        `${item.integrationAction?.argumentTopLevelKeyCount ?? 0} arg keys`,
        "target omitted",
      ]);
    } else if (item.action?.type === "config-value-preflight") {
      detail.textContent = joinParts([
        `${item.integrationAction?.targetCharCount ?? 0} key chars`,
        `${item.integrationAction?.argumentCharCount ?? 0} value chars`,
        "value omitted",
      ]);
    } else if (item.action?.type === "config-batch-preflight") {
      detail.textContent = joinParts([
        `${item.integrationAction?.argumentTopLevelKeyCount ?? 0} edits`,
        `${item.integrationAction?.targetCharCount ?? 0} key chars`,
        `${item.integrationAction?.argumentCharCount ?? 0} batch chars`,
      ]);
    } else if (item.action?.type === "experimental-feature-preflight") {
      detail.textContent = joinParts([
        `${item.integrationAction?.targetCharCount ?? 0} feature chars`,
        `${item.integrationAction?.argumentTopLevelKeyCount ?? 0} values`,
        "feature omitted",
      ]);
    } else {
      detail.textContent = joinParts([
        item.integrationAction?.category,
        `${item.integrationAction?.targetCharCount ?? 0} target chars`,
        `${item.integrationAction?.argumentTopLevelKeyCount ?? 0} arg keys`,
      ]);
    }

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      "blocked",
      item.preflight?.tokenConsumed ? "token consumed" : null,
      item.preflight?.oneTimeUseEnforced ? "one-time" : null,
      "no mutation",
      "token omitted",
      "args omitted",
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, detail, chips);
    elements.integrationConfirmationHistoryList.append(row);
  }
}

function renderIntegrationDetails(inventory) {
  elements.integrationsDetailList.replaceChildren();

  const rows = [
    ...integrationRows("Model", inventory.models?.items, (item) =>
      [
        item.default ? "default" : null,
        item.hidden ? "hidden" : "visible",
        item.textInput ? "text" : null,
        item.imageInput ? "image" : null,
        `${item.reasoningEffortCount ?? 0} efforts`,
      ]
        .filter(Boolean)
        .join(" | "),
    ),
    ...integrationRows("Mode", inventory.collaborationModes?.items, (item) =>
      [
        item.mode,
        item.hasModelOverride ? "model override" : null,
        item.hasReasoningEffortOverride ? "reasoning override" : null,
      ]
        .filter(Boolean)
        .join(" | "),
    ),
    ...integrationRows("App", inventory.apps?.items, (item) => {
      const pluginText = item.pluginDisplayNames?.length
        ? `${item.pluginDisplayNames.length}/${item.pluginDisplayNameCount ?? 0} plugins named`
        : `${item.pluginDisplayNameCount ?? 0} plugins`;
      return [
        item.enabled ? "enabled" : "disabled",
        item.accessible ? "accessible" : "inaccessible",
        item.discoverable ? "discoverable" : null,
        pluginText,
      ]
        .filter(Boolean)
        .join(" | ");
    }),
    ...integrationRows("MCP", inventory.mcp?.items, (item) => {
      const toolText = item.toolNames?.length
        ? `${item.toolNames.length}/${item.toolCount ?? 0} tools named`
        : `${item.toolCount ?? 0} tools`;
      return [item.authStatus, toolText].filter(Boolean).join(" | ");
    }),
    ...integrationRows("Skill", inventory.skills?.items, (item) =>
      [item.enabled ? "enabled" : "disabled", item.scope, `${item.dependencyToolCount ?? 0} deps`]
        .filter(Boolean)
        .join(" | "),
    ),
    ...integrationRows("Plugin", inventory.plugins?.items, (item) =>
      [
        item.installed ? "installed" : "not installed",
        item.enabled ? "enabled" : "disabled",
        item.sourceType,
        item.installPolicy,
      ]
        .filter(Boolean)
        .join(" | "),
    ),
    ...integrationRows("Feature", inventory.experimentalFeatures?.items, (item) =>
      [
        item.enabled ? "enabled" : "disabled",
        item.defaultEnabled ? "default" : "override",
        item.stage,
      ]
        .filter(Boolean)
        .join(" | "),
    ),
  ];

  if (rows.length === 0) {
    elements.integrationsDetailList.append(
      emptyState("Name inventory disabled or no display names returned."),
    );
    return;
  }

  for (const row of rows) {
    elements.integrationsDetailList.append(row);
  }
}

function integrationRows(kind, items, metadataForItem) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items
    .filter((item) => item?.name)
    .map((item) => {
      const row = document.createElement("article");
      row.className = "boundary-row";
      row.setAttribute("role", "listitem");

      const header = document.createElement("div");
      header.className = "boundary-row-header";

      const title = document.createElement("strong");
      title.textContent = item.name;

      const meta = document.createElement("span");
      meta.textContent = kind;

      const detail = document.createElement("p");
      detail.className = "boundary-detail";
      detail.textContent = metadataForItem(item);

      header.append(title, meta);
      row.append(header, detail);
      return row;
    });
}

function renderMcpToolPreflight(payload) {
  elements.mcpToolStatus.textContent = payload.action?.execution ?? "blocked";
  elements.mcpServerChars.textContent = String(payload.server?.charCount ?? 0);
  elements.mcpToolChars.textContent = String(payload.tool?.charCount ?? 0);
  elements.mcpArgKeys.textContent = String(payload.arguments?.topLevelKeyCount ?? 0);
  elements.mcpInvocationText.textContent = payload.policy?.toolInvocationEnabled
    ? "Enabled"
    : "Blocked";
  elements.mcpToolRunButton.disabled =
    !lastMcpToolPreflight?.token || lastMcpToolPreflight.enabled !== true;
}

function renderMcpToolCall(payload) {
  const toolCall = payload.mcpToolCall ?? {};
  elements.mcpToolStatus.textContent = payload.action?.execution ?? "completed";
  elements.mcpServerChars.textContent = String(toolCall.serverCharCount ?? 0);
  elements.mcpToolChars.textContent = String(toolCall.toolCharCount ?? 0);
  elements.mcpArgKeys.textContent = String(toolCall.argumentTopLevelKeyCount ?? 0);
  elements.mcpInvocationText.textContent = payload.policy?.toolInvocation
    ? `${toolCall.contentCount ?? 0} items`
    : "Blocked";
}

function renderMcpResourcePreflight(payload) {
  elements.mcpResourceStatus.textContent = payload.action?.execution ?? "blocked";
  elements.mcpResourceServerChars.textContent = String(payload.server?.charCount ?? 0);
  elements.mcpResourceChars.textContent = String(payload.resource?.charCount ?? 0);
  elements.mcpResourceReadText.textContent = payload.action?.wouldReadResource
    ? "Enabled"
    : "Blocked";
  elements.mcpResourceContentText.textContent = payload.resource?.contentReturned
    ? "Returned"
    : "Omitted";
  elements.mcpResourceRunButton.disabled =
    !lastMcpResourcePreflight?.token || lastMcpResourcePreflight.enabled !== true;
}

function renderMcpResourceRead(payload) {
  const resourceRead = payload.mcpResourceRead ?? {};
  elements.mcpResourceStatus.textContent = payload.action?.execution ?? "completed";
  elements.mcpResourceServerChars.textContent = String(resourceRead.serverCharCount ?? 0);
  elements.mcpResourceChars.textContent = String(resourceRead.resourceCharCount ?? 0);
  elements.mcpResourceReadText.textContent = payload.policy?.resourceRead ? "Read" : "Blocked";
  elements.mcpResourceContentText.textContent = `${resourceRead.contentCount ?? 0} items`;
}

function renderPluginReadPreflight(payload) {
  const action = payload.integrationAction ?? {};
  elements.pluginReadStatus.textContent = payload.action?.execution ?? "blocked";
  elements.pluginReadTargetChars.textContent = String(action.target?.charCount ?? 0);
  elements.pluginReadArgKeys.textContent = String(action.arguments?.topLevelKeyCount ?? 0);
  elements.pluginReadText.textContent = payload.action?.wouldReadPlugin ? "Enabled" : "Blocked";
  elements.pluginReadDetailsText.textContent = payload.policy?.pluginDetailsReturned
    ? "Returned"
    : "Omitted";
  elements.pluginReadRunButton.disabled =
    !lastPluginReadPreflight?.token || lastPluginReadPreflight.enabled !== true;
}

function renderPluginRead(payload) {
  const pluginRead = payload.pluginRead ?? {};
  elements.pluginReadStatus.textContent = payload.action?.execution ?? "completed";
  elements.pluginReadTargetChars.textContent = String(pluginRead.targetCharCount ?? 0);
  elements.pluginReadArgKeys.textContent = String(pluginRead.argumentTopLevelKeyCount ?? 0);
  elements.pluginReadText.textContent = payload.policy?.pluginRead ? "Read" : "Blocked";
  elements.pluginReadDetailsText.textContent = `${pluginRead.skillCount ?? 0} skills`;
}

function renderPluginInstallPreflight(payload) {
  const install = payload.pluginInstall ?? {};
  elements.pluginInstallStatus.textContent = payload.action?.execution ?? "blocked";
  elements.pluginInstallTargetChars.textContent = String(install.targetCharCount ?? 0);
  elements.pluginInstallArgKeys.textContent = String(install.argumentTopLevelKeyCount ?? 0);
  elements.pluginInstallText.textContent = payload.policy?.pluginInstall ? "Enabled" : "Blocked";
  elements.pluginInstallProvenanceText.textContent = payload.policy?.requiresIntegrationProvenance
    ? "Required"
    : "Unknown";
}

function renderMarketplaceActionPreflight(payload) {
  const marketplace = payload.marketplaceAction ?? {};
  elements.marketplaceActionStatus.textContent = payload.action?.execution ?? "blocked";
  elements.marketplaceTargetChars.textContent = String(marketplace.targetCharCount ?? 0);
  elements.marketplaceArgKeys.textContent = String(marketplace.argumentTopLevelKeyCount ?? 0);
  elements.marketplaceMutationText.textContent = payload.policy?.marketplaceMutation
    ? "Enabled"
    : "Blocked";
  elements.marketplaceSourceText.textContent = marketplace.sourcePresent ? "Present" : "Hidden";
}

function renderPluginUninstallPreflight(payload) {
  const plugin = payload.pluginUninstall ?? {};
  elements.pluginUninstallStatus.textContent = payload.action?.execution ?? "blocked";
  elements.pluginUninstallTargetChars.textContent = String(plugin.targetCharCount ?? 0);
  elements.pluginUninstallResponseKeys.textContent = "0";
  elements.pluginUninstallText.textContent = payload.policy?.executionGateEnabled
    ? "Enabled"
    : "Blocked";
  elements.pluginUninstallDetailsText.textContent = "Omitted";
  elements.pluginUninstallRunButton.disabled =
    !lastPluginUninstallPreflight?.token || lastPluginUninstallPreflight.enabled !== true;
}

function renderPluginUninstall(payload) {
  const plugin = payload.pluginUninstall ?? {};
  elements.pluginUninstallStatus.textContent = payload.action?.execution ?? "completed";
  elements.pluginUninstallTargetChars.textContent = String(plugin.targetCharCount ?? 0);
  elements.pluginUninstallResponseKeys.textContent = String(plugin.responseTopLevelKeyCount ?? 0);
  elements.pluginUninstallText.textContent = payload.policy?.pluginUninstall
    ? "Uninstalled"
    : "Blocked";
  elements.pluginUninstallDetailsText.textContent = "Omitted";
}

function renderPluginEnablementPreflight(payload) {
  const plugin = payload.pluginEnablement ?? {};
  elements.pluginEnablementStatus.textContent = payload.action?.execution ?? "blocked";
  elements.pluginEnablementTargetChars.textContent = String(plugin.pluginIdCharCount ?? 0);
  elements.pluginEnablementRequestText.textContent =
    plugin.requestedEnabled === true ? "Enable" : "Disable";
  elements.pluginEnablementText.textContent = payload.policy?.executionGateEnabled
    ? "Enabled"
    : "Blocked";
  elements.pluginEnablementResponseKeys.textContent = "0";
  elements.pluginEnablementRunButton.disabled =
    !lastPluginEnablementPreflight?.token ||
    lastPluginEnablementPreflight.enabled !== true;
}

function renderPluginEnablementSet(payload) {
  const plugin = payload.pluginEnablement ?? {};
  elements.pluginEnablementStatus.textContent = payload.action?.execution ?? "completed";
  elements.pluginEnablementTargetChars.textContent = String(plugin.pluginIdCharCount ?? 0);
  elements.pluginEnablementRequestText.textContent =
    plugin.requestedEnabled === true ? "Enable" : "Disable";
  elements.pluginEnablementText.textContent = payload.policy?.settingsWrite
    ? "Applied"
    : "Blocked";
  elements.pluginEnablementResponseKeys.textContent = String(
    plugin.responseTopLevelKeyCount ?? 0,
  );
}

function renderPluginShareCheckoutPreflight(payload) {
  const checkout = payload.pluginShareCheckout ?? {};
  elements.pluginShareCheckoutStatus.textContent = payload.action?.execution ?? "blocked";
  elements.pluginShareCheckoutTargetChars.textContent = String(checkout.targetCharCount ?? 0);
  elements.pluginShareCheckoutResponseKeys.textContent = "0";
  elements.pluginShareCheckoutText.textContent = payload.policy?.executionGateEnabled
    ? "Enabled"
    : "Blocked";
  elements.pluginShareCheckoutDetailsText.textContent = "Omitted";
  elements.pluginShareCheckoutRunButton.disabled =
    !lastPluginShareCheckoutPreflight?.token ||
    lastPluginShareCheckoutPreflight.enabled !== true;
}

function renderPluginShareCheckout(payload) {
  const checkout = payload.pluginShareCheckout ?? {};
  elements.pluginShareCheckoutStatus.textContent = payload.action?.execution ?? "completed";
  elements.pluginShareCheckoutTargetChars.textContent = String(checkout.targetCharCount ?? 0);
  elements.pluginShareCheckoutResponseKeys.textContent = String(
    checkout.responseTopLevelKeyCount ?? 0,
  );
  elements.pluginShareCheckoutText.textContent = payload.policy?.pluginShareCheckout
    ? "Checked out"
    : "Blocked";
  elements.pluginShareCheckoutDetailsText.textContent = "Omitted";
}

function renderPluginShareActionPreflight(payload) {
  const shareAction = payload.pluginShareAction ?? {};
  elements.pluginShareActionStatus.textContent = payload.action?.execution ?? "blocked";
  elements.pluginShareActionTargetChars.textContent = String(shareAction.targetCharCount ?? 0);
  elements.pluginShareActionArgKeys.textContent = String(
    shareAction.argumentTopLevelKeyCount ?? 0,
  );
  elements.pluginShareActionText.textContent = payload.policy?.pluginSharingMutation
    ? "Enabled"
    : "Blocked";
  elements.pluginShareActionTargetsText.textContent = shareAction.shareTargetsReturned
    ? `${shareAction.shareTargetCount ?? 0} targets`
    : "Hidden";
}

function renderPluginContentPreflight(payload) {
  const action = payload.integrationAction ?? {};
  elements.pluginContentStatus.textContent = payload.action?.execution ?? "blocked";
  elements.pluginContentTargetChars.textContent = String(action.target?.charCount ?? 0);
  elements.pluginContentArgKeys.textContent = String(action.arguments?.topLevelKeyCount ?? 0);
  elements.pluginContentReadText.textContent =
    payload.action?.wouldReadPluginContent || payload.action?.wouldReadPluginShares
      ? "Enabled"
      : "Blocked";
  elements.pluginContentDetailsText.textContent =
    payload.policy?.pluginSkillContentsReturned ||
    payload.policy?.pluginShareUrlsReturned ||
    payload.policy?.pluginSharePrincipalsReturned
      ? "Returned"
      : "Omitted";
  elements.pluginContentRunButton.disabled =
    !lastPluginContentPreflight?.token || lastPluginContentPreflight.enabled !== true;
}

function renderPluginContentRead(payload) {
  const contentRead = payload.pluginContentRead ?? {};
  elements.pluginContentStatus.textContent = payload.action?.execution ?? "completed";
  elements.pluginContentTargetChars.textContent = String(contentRead.targetCharCount ?? 0);
  elements.pluginContentArgKeys.textContent = String(contentRead.argumentTopLevelKeyCount ?? 0);
  elements.pluginContentReadText.textContent =
    payload.policy?.pluginContentRead || payload.policy?.pluginShareList ? "Read" : "Blocked";
  elements.pluginContentDetailsText.textContent =
    payload.action?.method === "plugin/share/list"
      ? `${contentRead.itemCount ?? 0} shares`
      : `${contentRead.contentCharCount ?? 0} chars`;
}

function renderSkillsConfigPreflight(payload) {
  const action = payload.integrationAction ?? {};
  elements.skillsConfigStatus.textContent = payload.action?.execution ?? "blocked";
  elements.skillsConfigTargetChars.textContent = String(action.target?.charCount ?? 0);
  elements.skillsConfigArgKeys.textContent = String(action.arguments?.topLevelKeyCount ?? 0);
  elements.skillsConfigWriteText.textContent = payload.policy?.skillsConfigWriteEnabled
    ? "Enabled"
    : "Blocked";
  elements.skillsConfigEffectiveText.textContent = "Omitted";
  elements.skillsConfigRunButton.disabled =
    !lastSkillsConfigPreflight?.token || lastSkillsConfigPreflight.enabled !== true;
}

function renderSkillsConfigWrite(payload) {
  const result = payload.skillsConfigWrite ?? {};
  elements.skillsConfigStatus.textContent = payload.action?.execution ?? "completed";
  elements.skillsConfigTargetChars.textContent = String(result.targetCharCount ?? 0);
  elements.skillsConfigArgKeys.textContent = String(result.argumentTopLevelKeyCount ?? 0);
  elements.skillsConfigWriteText.textContent = payload.policy?.skillsConfigWrite
    ? "Written"
    : "Blocked";
  elements.skillsConfigEffectiveText.textContent = result.effectiveEnabled
    ? "Enabled"
    : "Disabled";
}

function renderSkillsExtraRootsClearPreflight(payload) {
  const result = payload.skillsExtraRootsClear ?? {};
  elements.skillsExtraRootsClearStatus.textContent = payload.action?.execution ?? "blocked";
  elements.skillsExtraRootsClearCount.textContent = String(result.requestedExtraRootCount ?? 0);
  elements.skillsExtraRootsBrowserText.textContent = result.browserRootsAccepted
    ? "Accepted"
    : "Rejected";
  elements.skillsExtraRootsResultText.textContent = payload.policy?.skillsExtraRootsClearEnabled
    ? "Ready"
    : "Blocked";
  elements.skillsExtraRootsClearButton.disabled =
    !lastSkillsExtraRootsClearPreflight?.token ||
    lastSkillsExtraRootsClearPreflight.enabled !== true;
}

function renderSkillsExtraRootsClear(payload) {
  const result = payload.skillsExtraRootsClear ?? {};
  elements.skillsExtraRootsClearStatus.textContent = payload.action?.execution ?? "completed";
  elements.skillsExtraRootsClearCount.textContent = String(result.requestedExtraRootCount ?? 0);
  elements.skillsExtraRootsBrowserText.textContent = payload.policy?.browserRootsAccepted
    ? "Accepted"
    : "Rejected";
  elements.skillsExtraRootsResultText.textContent = result.status ?? "cleared";
}

function renderRemoteControlDisablePreflight(payload) {
  const result = payload.remoteControlDisable ?? {};
  elements.remoteControlDisableStatus.textContent = payload.action?.execution ?? "blocked";
  elements.remoteControlDisableParamsText.textContent = result.paramsAcceptedFromBrowser
    ? "Accepted"
    : "Rejected";
  elements.remoteControlDisableStatusText.textContent = payload.policy?.remoteControlDisableEnabled
    ? "Ready"
    : "Blocked";
  elements.remoteControlDisableIdentityText.textContent = result.serverNameReturned
    ? "Returned"
    : "Hidden";
  elements.remoteControlDisableButton.disabled =
    !lastRemoteControlDisablePreflight?.token ||
    lastRemoteControlDisablePreflight.enabled !== true;
}

function renderRemoteControlEnablePreflight(payload) {
  const result = payload.remoteControlEnable ?? {};
  elements.remoteControlEnableStatus.textContent = payload.action?.execution ?? "blocked";
  elements.remoteControlEnableArgKeys.textContent = String(
    result.argumentTopLevelKeyCount ?? 0,
  );
  elements.remoteControlEnableEphemeralText.textContent = result.ephemeralBoolean
    ? result.ephemeralRequested
      ? "Requested"
      : "False"
    : "Unset";
  elements.remoteControlEnableIdentityText.textContent =
    result.serverNameReturned || result.installationIdReturned || result.environmentIdReturned
      ? "Returned"
      : "Hidden";
}

function renderRemoteControlPairingPreflight(payload) {
  const result = payload.remoteControlPairing ?? {};
  elements.remoteControlPairingStatus.textContent = payload.action?.execution ?? "blocked";
  elements.remoteControlPairingArgKeys.textContent = String(
    result.argumentTopLevelKeyCount ?? 0,
  );
  elements.remoteControlPairingCodeText.textContent = result.pairingCodeInputProvided
    ? "Provided"
    : "Hidden";
  elements.remoteControlPairingClaimText.textContent = result.claimStateReturned
    ? "Returned"
    : "Hidden";
}

function renderRemoteControlDisable(payload) {
  const result = payload.remoteControlDisable ?? {};
  elements.remoteControlDisableStatus.textContent = payload.action?.execution ?? "completed";
  elements.remoteControlDisableParamsText.textContent = payload.policy?.paramsAcceptedFromBrowser
    ? "Accepted"
    : "Rejected";
  elements.remoteControlDisableStatusText.textContent = result.statusKnown ? result.status : "Hidden";
  elements.remoteControlDisableIdentityText.textContent = payload.policy?.identityReturned
    ? "Returned"
    : "Hidden";
}

function renderRemoteClientRefs(items) {
  remoteClientRefs = Array.isArray(items) ? items : [];
  elements.remoteClientSelect.innerHTML = "";
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "None";
  elements.remoteClientSelect.append(emptyOption);
  remoteClientRefs.forEach((item, index) => {
    const ref = typeof item?.remoteClientRef === "string" ? item.remoteClientRef : "";
    if (!ref) {
      return;
    }
    const option = document.createElement("option");
    option.value = ref;
    option.textContent = `Client ${index + 1}`;
    elements.remoteClientSelect.append(option);
  });
  elements.remoteClientSelect.disabled = remoteClientRefs.length === 0;
  elements.remoteClientRefCount.textContent = String(remoteClientRefs.length);
  elements.remoteClientRevokePreflightButton.disabled = !selectedRemoteClientRef;
  elements.remoteClientRevokeButton.disabled =
    !lastRemoteClientRevokePreflight?.token ||
    lastRemoteClientRevokePreflight.enabled !== true;
}

function renderRemoteControlClients(payload) {
  const result = payload.remoteClients ?? {};
  const metadata = payload.remoteControlClients ?? {};
  selectedRemoteClientRef = null;
  lastRemoteClientRevokePreflight = null;
  renderRemoteClientRefs(Array.isArray(result.items) ? result.items : []);
  elements.remoteClientsStatus.textContent = payload.action?.execution ?? "completed";
  elements.remoteClientIdsText.textContent =
    result.clientIdsReturned || metadata.clientIdsReturned ? "Returned" : "Hidden";
  elements.remoteClientNamesText.textContent =
    result.namesReturned || metadata.clientNamesReturned ? "Returned" : "Hidden";
  elements.remoteClientRevokeText.textContent = result.count > 0 ? "Select ref" : "No refs";
}

function renderRemoteControlClientRevokePreflight(payload) {
  const result = payload.remoteControlClientRevoke ?? {};
  elements.remoteClientsStatus.textContent = payload.action?.execution ?? "blocked";
  elements.remoteClientIdsText.textContent = result.clientIdReturned ? "Returned" : "Hidden";
  elements.remoteClientNamesText.textContent = "Hidden";
  elements.remoteClientRevokeText.textContent = payload.policy?.executionGateEnabled
    ? "Ready"
    : "Blocked";
  elements.remoteClientRevokeButton.disabled =
    !lastRemoteClientRevokePreflight?.token ||
    lastRemoteClientRevokePreflight.enabled !== true;
}

function renderRemoteControlClientRevoke(payload) {
  const result = payload.remoteControlClientRevoke ?? {};
  elements.remoteClientsStatus.textContent = payload.action?.execution ?? "completed";
  elements.remoteClientIdsText.textContent = result.clientIdReturned ? "Returned" : "Hidden";
  elements.remoteClientNamesText.textContent = "Hidden";
  elements.remoteClientRevokeText.textContent = result.status ?? "revoked-with-redactions";
}

function renderEnvironmentAddPreflight(payload) {
  const result = payload.environmentAdd ?? {};
  elements.environmentAddStatus.textContent = payload.action?.execution ?? "blocked";
  elements.environmentAddIdChars.textContent = String(result.environmentIdCharCount ?? 0);
  elements.environmentAddUrlChars.textContent = String(result.execServerUrlCharCount ?? 0);
  elements.environmentAddUrlText.textContent = result.execServerUrlReturned ? "Returned" : "Hidden";
  elements.environmentAddResultText.textContent = payload.policy?.executionGateEnabled
    ? "Ready"
    : "Blocked";
  elements.environmentAddRunButton.disabled =
    !lastEnvironmentAddPreflight?.token || lastEnvironmentAddPreflight.enabled !== true;
}

function renderEnvironmentAdd(payload) {
  const result = payload.environmentAdd ?? {};
  elements.environmentAddStatus.textContent = payload.action?.execution ?? "completed";
  elements.environmentAddIdChars.textContent = String(result.environmentIdCharCount ?? 0);
  elements.environmentAddUrlChars.textContent = String(result.execServerUrlCharCount ?? 0);
  elements.environmentAddUrlText.textContent = result.execServerUrlReturned ? "Returned" : "Hidden";
  elements.environmentAddResultText.textContent = result.status ?? "added-with-redactions";
}

function renderConfigValuePreflight(payload) {
  const config = payload.configValueWrite ?? {};
  elements.configValueStatus.textContent = payload.action?.execution ?? "blocked";
  elements.configValueKeyChars.textContent = String(config.keyPathCharCount ?? 0);
  elements.configValueChars.textContent = String(config.valueCharCount ?? 0);
  elements.configValueTypeText.textContent = config.valueJsonType ?? "Unknown";
  elements.configValueWriteText.textContent = payload.policy?.executionGateEnabled
    ? "Enabled"
    : "Blocked";
  elements.configValueRunButton.disabled =
    !lastConfigValuePreflight?.token || lastConfigValuePreflight.enabled !== true;
}

function renderConfigValueWrite(payload) {
  const result = payload.configValueWrite ?? {};
  elements.configValueStatus.textContent = payload.action?.execution ?? "completed";
  elements.configValueKeyChars.textContent = String(result.keyPathCharCount ?? 0);
  elements.configValueChars.textContent = String(result.valueCharCount ?? 0);
  elements.configValueTypeText.textContent = result.valueJsonType ?? "Unknown";
  elements.configValueWriteText.textContent = payload.policy?.settingsWrite
    ? "Written"
    : "Blocked";
}

function renderConfigBatchPreflight(payload) {
  const config = payload.configBatchWrite ?? {};
  elements.configBatchStatus.textContent = payload.action?.execution ?? "blocked";
  elements.configBatchEditCount.textContent = String(config.editCount ?? 0);
  elements.configBatchKeyChars.textContent = String(config.keyPathCharCount ?? 0);
  elements.configBatchValueChars.textContent = String(config.valueCharCount ?? 0);
  elements.configBatchWriteText.textContent = payload.policy?.executionGateEnabled
    ? "Enabled"
    : "Blocked";
  elements.configBatchRunButton.disabled =
    !lastConfigBatchPreflight?.token || lastConfigBatchPreflight.enabled !== true;
}

function renderConfigBatchWrite(payload) {
  const result = payload.configBatchWrite ?? {};
  elements.configBatchStatus.textContent = payload.action?.execution ?? "completed";
  elements.configBatchEditCount.textContent = String(result.editCount ?? 0);
  elements.configBatchKeyChars.textContent = String(result.keyPathCharCount ?? 0);
  elements.configBatchValueChars.textContent = String(result.valueCharCount ?? 0);
  elements.configBatchWriteText.textContent = payload.policy?.settingsWrite
    ? "Written"
    : "Blocked";
}

function renderExperimentalFeaturePreflight(payload) {
  const feature = payload.experimentalFeatureSet ?? {};
  elements.experimentalFeatureStatus.textContent = payload.action?.execution ?? "blocked";
  elements.experimentalFeatureChars.textContent = String(feature.featureCharCount ?? 0);
  elements.experimentalFeatureValueCount.textContent = String(feature.enabledValueCount ?? 0);
  elements.experimentalFeatureSetText.textContent = payload.policy?.executionGateEnabled
    ? "Enabled"
    : "Blocked";
  elements.experimentalFeatureUpdatedText.textContent = "0";
  elements.experimentalFeatureRunButton.disabled =
    !lastExperimentalFeaturePreflight?.token || lastExperimentalFeaturePreflight.enabled !== true;
}

function renderExperimentalFeatureSet(payload) {
  const result = payload.experimentalFeatureSet ?? {};
  elements.experimentalFeatureStatus.textContent = payload.action?.execution ?? "completed";
  elements.experimentalFeatureChars.textContent = String(result.featureCharCount ?? 0);
  elements.experimentalFeatureValueCount.textContent = String(result.enabledValueCount ?? 0);
  elements.experimentalFeatureSetText.textContent = payload.policy?.settingsWrite
    ? "Set"
    : "Blocked";
  elements.experimentalFeatureUpdatedText.textContent = String(result.updatedFeatureCount ?? 0);
}

function renderIntegrationActionPreflight(payload) {
  const action = payload.integrationAction ?? {};
  elements.integrationActionStatus.textContent = payload.action?.execution ?? "blocked";
  elements.integrationMethodText.textContent = action.category ?? payload.action?.category ?? "-";
  elements.integrationTargetChars.textContent = String(action.target?.charCount ?? 0);
  elements.integrationArgKeys.textContent = String(action.arguments?.topLevelKeyCount ?? 0);
  elements.integrationMutationText.textContent =
    payload.action?.wouldMutateSettings ||
    payload.action?.wouldStartAuthFlow ||
    payload.action?.wouldInvokeTool ||
    payload.action?.wouldInstallPlugin
      ? "Enabled"
      : "Blocked";
}

function renderExternalConfigImportPreflight(payload) {
  const externalImport = payload.externalConfigImport ?? {};
  elements.externalConfigImportStatus.textContent = payload.action?.execution ?? "blocked";
  elements.externalConfigImportTargetChars.textContent = String(
    externalImport.targetCharCount ?? 0,
  );
  elements.externalConfigImportArgKeys.textContent = String(
    externalImport.argumentTopLevelKeyCount ?? 0,
  );
  elements.externalConfigImportItemsText.textContent = joinParts([
    `${externalImport.migrationItemCount ?? 0} items`,
    `${externalImport.pluginMigrationCount ?? 0} plugins`,
    `${externalImport.sessionMigrationCount ?? 0} sessions`,
    `${externalImport.commandMigrationCount ?? 0} commands`,
    `${externalImport.hookMigrationCount ?? 0} hooks`,
    `${externalImport.mcpServerMigrationCount ?? 0} MCP`,
    `${externalImport.subagentMigrationCount ?? 0} subagents`,
  ]);
  elements.externalConfigImportText.textContent = payload.policy?.externalConfigImport
    ? "Enabled"
    : "Blocked";
  elements.externalConfigStateText.textContent = payload.policy?.externalConfigImportPreflightEnabled
    ? "Import check"
    : "Blocked";
}

function renderReviewFeedbackPreflight(payload) {
  const reviewFeedback = payload.reviewFeedback ?? {};
  elements.reviewFeedbackStatus.textContent = payload.action?.execution ?? "blocked";
  elements.reviewFeedbackTargetChars.textContent = String(
    reviewFeedback.targetCharCount ?? 0,
  );
  elements.reviewFeedbackArgKeys.textContent = String(
    reviewFeedback.argumentTopLevelKeyCount ?? 0,
  );
  elements.reviewFeedbackReviewText.textContent = reviewFeedback.reviewRequested
    ? joinParts([
        "Review blocked",
        reviewFeedback.reviewTargetBaseBranch ? "base branch" : null,
        reviewFeedback.reviewTargetCommit ? "commit" : null,
        reviewFeedback.reviewTargetCustom ? "custom" : null,
        reviewFeedback.reviewDeliveryDetached ? "detached" : null,
      ])
    : "Feedback blocked";
  elements.reviewFeedbackLogsText.textContent = joinParts([
    reviewFeedback.includeLogsRequested ? "logs requested" : "logs hidden",
    `${reviewFeedback.extraLogFileCount ?? 0} files`,
    `${reviewFeedback.tagCount ?? 0} tags`,
  ]);
}

function renderMemoryResetPreflight(payload) {
  const memoryReset = payload.memoryReset ?? {};
  elements.memoryResetStatus.textContent = payload.action?.execution ?? "blocked";
  elements.memoryResetParamsText.textContent = memoryReset.paramsAcceptedFromBrowser
    ? "Accepted"
    : "Rejected";
  elements.memoryResetDeletedText.textContent = memoryReset.memoriesDeleted
    ? "Deleted"
    : "Preserved";
  elements.memoryResetContentText.textContent =
    memoryReset.memoryFilesReturned ||
    memoryReset.memoryContentReturned ||
    memoryReset.memoryPathsReturned
      ? "Returned"
      : "Hidden";
}

function renderAccountLoginPreflight(payload) {
  elements.accountLoginStatus.textContent = payload.policy?.executionGateEnabled
    ? "Login ready"
    : "Login blocked";
  elements.accountLoginText.textContent = payload.policy?.executionGateEnabled ? "Ready" : "Blocked";
  elements.accountLoginCodeText.textContent = "-";
  elements.accountLoginUrlText.textContent = "-";
  elements.accountLoginCancelStatus.textContent = "No active device login.";
  elements.accountLoginCancelPreflightButton.disabled = true;
  elements.accountLoginCancelButton.disabled = true;
  elements.accountLoginButton.disabled =
    !lastAccountLoginPreflight?.token || lastAccountLoginPreflight.enabled !== true;
}

function renderAccountLogin(payload) {
  const auth = payload.auth ?? {};
  const cancelRef = typeof auth.cancelRef === "string" ? auth.cancelRef : null;
  lastAccountLoginCancelRef = cancelRef;
  lastAccountLoginCancelPreflight = null;
  elements.accountLoginStatus.textContent = payload.result?.status ?? "Login started";
  elements.accountLoginText.textContent = "Started";
  elements.accountLoginCancelText.textContent = cancelRef ? "Ready" : "Blocked";
  elements.accountLoginCodeText.textContent = auth.userCode ?? "-";
  elements.accountLoginUrlText.textContent = auth.verificationUrl ?? "-";
  elements.accountLoginCancelStatus.textContent = cancelRef
    ? "Cancel check available"
    : "Cancel unavailable";
  elements.accountLoginCancelPreflightButton.disabled = !cancelRef;
  elements.accountLoginCancelButton.disabled = true;
}

function renderAccountLoginCancelPreflight(payload) {
  elements.accountLoginCancelStatus.textContent = payload.policy?.executionGateEnabled
    ? "Cancel ready"
    : "Cancel blocked";
  elements.accountLoginCancelText.textContent = payload.policy?.executionGateEnabled
    ? "Ready"
    : "Blocked";
  elements.accountLoginCancelButton.disabled =
    !lastAccountLoginCancelPreflight?.token || lastAccountLoginCancelPreflight.enabled !== true;
}

function renderAccountLoginCancel(payload) {
  const canceled = payload.result?.canceled === true;
  elements.accountLoginCancelStatus.textContent = payload.result?.status ?? "Cancel completed";
  elements.accountLoginCancelText.textContent = canceled ? "Canceled" : "Completed";
  elements.accountLoginStatus.textContent = canceled ? "Login canceled" : elements.accountLoginStatus.textContent;
  elements.accountLoginCancelPreflightButton.disabled = true;
  elements.accountLoginCancelButton.disabled = true;
}

function renderAccountResetCreditPreflight(payload) {
  elements.accountResetCreditStatus.textContent = payload.policy?.executionGateEnabled
    ? "Reset ready"
    : "Reset blocked";
  elements.accountResetCreditText.textContent =
    payload.policy?.executionGateEnabled ? "Ready" : "Blocked";
  elements.accountResetCreditButton.disabled =
    !lastAccountResetCreditPreflight?.token ||
    lastAccountResetCreditPreflight.enabled !== true;
}

function renderAccountResetCredit(payload) {
  elements.accountResetCreditStatus.textContent = payload.result?.outcome ?? "Completed";
  elements.accountResetCreditText.textContent = "Completed";
}

function renderAccountLogoutPreflight(payload) {
  elements.accountLogoutStatus.textContent = payload.policy?.executionGateEnabled
    ? "Logout ready"
    : "Logout blocked";
  elements.accountLogoutText.textContent = payload.policy?.executionGateEnabled ? "Ready" : "Blocked";
  elements.accountLogoutButton.disabled =
    !lastAccountLogoutPreflight?.token || lastAccountLogoutPreflight.enabled !== true;
}

function renderAccountLogout(payload) {
  elements.accountLogoutStatus.textContent = payload.result?.status ?? "Logged out";
  elements.accountLogoutText.textContent = "Completed";
}

function renderMcpServerReloadPreflight(payload) {
  elements.mcpServerReloadStatus.textContent = payload.policy?.executionGateEnabled
    ? "Reload ready"
    : "Reload blocked";
  elements.mcpStateText.textContent = payload.policy?.executionGateEnabled ? "Ready" : "Blocked";
  elements.mcpServerReloadButton.disabled =
    !lastMcpServerReloadPreflight?.token || lastMcpServerReloadPreflight.enabled !== true;
}

function renderMcpServerReload(payload) {
  elements.mcpServerReloadStatus.textContent = payload.result?.status ?? "Reloaded";
  elements.mcpStateText.textContent = "Reloaded";
}

function renderMcpOauthPreflight(payload) {
  const oauth = payload.mcpOauthLogin ?? {};
  elements.mcpOauthStatus.textContent = payload.action?.execution ?? "blocked";
  elements.mcpOauthServerChars.textContent = String(oauth.serverCharCount ?? 0);
  elements.mcpOauthResponseKeys.textContent = "0";
  elements.mcpOauthText.textContent = payload.policy?.executionGateEnabled
    ? "Ready"
    : "Blocked";
  elements.mcpOauthUrlText.textContent = "Omitted";
  elements.mcpStateText.textContent = payload.policy?.executionGateEnabled ? "OAuth ready" : "Blocked";
  elements.mcpOauthRunButton.disabled =
    !lastMcpOauthPreflight?.token || lastMcpOauthPreflight.enabled !== true;
}

function renderMcpOauthLogin(payload) {
  const oauth = payload.mcpOauthLogin ?? {};
  elements.mcpOauthStatus.textContent = payload.action?.execution ?? "started";
  elements.mcpOauthServerChars.textContent = String(oauth.serverCharCount ?? 0);
  elements.mcpOauthResponseKeys.textContent = String(oauth.responseTopLevelKeyCount ?? 0);
  elements.mcpOauthText.textContent = payload.policy?.mcpOauthLogin ? "Started" : "Blocked";
  elements.mcpOauthUrlText.textContent = oauth.authorizationUrl ?? "Omitted";
  elements.mcpStateText.textContent = "OAuth started";
}

function authStateText(account, auth) {
  if (!auth?.stateVisible) {
    return "Blocked";
  }
  if (account?.requiresOpenaiAuth && !account?.hasAccount) {
    return "Needs auth";
  }
  if (account?.hasAccount) {
    return account.accountType ?? "Account";
  }
  return "No account";
}

function rateLimitsStateText(rateLimits, auth) {
  if (!auth?.rateLimitsAvailable) {
    return "Blocked";
  }
  const bucketCount = rateLimits?.bucketCount ?? 0;
  if (auth?.rateLimitReached || rateLimits?.rateLimitReached) {
    return `${bucketCount} buckets limited`;
  }
  return `${bucketCount} buckets`;
}

function remoteControlStatusText(remoteControlStatus) {
  const counts = remoteControlStatus?.statusCounts ?? {};
  const parts = ["connected", "connecting", "errored", "disabled", "unknown"]
    .map((status) => {
      const count = counts[status];
      return count > 0 ? `${count} ${status}` : null;
    })
    .filter(Boolean);
  return parts.length > 0 ? parts.join(" / ") : "0 statuses";
}

function renderCodexAppSettingsParity(summary) {
  elements.appSettingsParityList.replaceChildren();
  const sections = Array.isArray(summary?.sections) ? summary.sections : [];
  if (sections.length === 0) {
    elements.appSettingsParityList.append(emptyState("No app settings parity summary returned."));
    return;
  }
  for (const section of sections) {
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = section.key ?? "unknown";

    const meta = document.createElement("span");
    meta.textContent = section.group ?? "settings";

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      section.state ?? "blocked",
      section.source ?? null,
      section.settingValuesReturned ? "values returned" : "values hidden",
      section.localNamesReturned ? "local names returned" : "local names hidden",
      section.pathsReturned ? "paths returned" : "paths hidden",
      section.appServerTraffic ? "app-server traffic" : "local parity",
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, chips);
    elements.appSettingsParityList.append(row);
  }
}

function renderCodexAppAppearanceSettings(summary) {
  elements.appAppearanceList.replaceChildren();
  const settings = Array.isArray(summary?.settings) ? summary.settings : [];
  if (settings.length === 0) {
    elements.appAppearanceList.append(emptyState("No appearance settings catalog returned."));
    return;
  }
  for (const setting of settings) {
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = setting.key ?? "unknown";

    const meta = document.createElement("span");
    meta.textContent = setting.group ?? "appearance";

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      setting.state ?? "blocked",
      setting.source ?? null,
      setting.settingValueReturned ? "value returned" : "value hidden",
      setting.themeValueReturned ? "theme returned" : "theme hidden",
      setting.colorValueReturned ? "color returned" : "color hidden",
      setting.fontNameReturned ? "font returned" : "font hidden",
      setting.customThemeReturned ? "custom theme returned" : "custom theme hidden",
      setting.sharingUrlReturned ? "share URL returned" : "share URL hidden",
      setting.appServerTraffic ? "app-server traffic" : "local catalog",
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, chips);
    elements.appAppearanceList.append(row);
  }
}

function renderCodexAppKeyboardShortcuts(summary) {
  elements.appKeyboardShortcutsList.replaceChildren();
  const shortcuts = Array.isArray(summary?.shortcuts) ? summary.shortcuts : [];
  if (shortcuts.length === 0) {
    elements.appKeyboardShortcutsList.append(emptyState("No keyboard shortcut catalog returned."));
    return;
  }
  for (const shortcut of shortcuts) {
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = shortcut.key ?? "unknown";

    const meta = document.createElement("span");
    meta.textContent = shortcut.group ?? "shortcut";

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      shortcut.state ?? "blocked",
      shortcut.source ?? null,
      shortcut.linuxBinding ? `linux ${shortcut.linuxBinding}` : null,
      shortcut.customBindingReturned ? "custom binding returned" : "custom binding hidden",
      shortcut.commandLabelReturned ? "label returned" : "label hidden",
      shortcut.appServerTraffic ? "app-server traffic" : "local catalog",
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, chips);
    elements.appKeyboardShortcutsList.append(row);
  }
}

function renderCodexAppNotificationSettings(summary) {
  elements.appNotificationsList.replaceChildren();
  const settings = Array.isArray(summary?.settings) ? summary.settings : [];
  if (settings.length === 0) {
    elements.appNotificationsList.append(emptyState("No notification settings catalog returned."));
    return;
  }
  for (const setting of settings) {
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = setting.key ?? "unknown";

    const meta = document.createElement("span");
    meta.textContent = setting.group ?? "notifications";

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      setting.state ?? "blocked",
      setting.source ?? null,
      setting.settingValueReturned ? "value returned" : "value hidden",
      setting.permissionStateReturned ? "permission returned" : "permission hidden",
      setting.notificationPayloadsReturned ? "payloads returned" : "payloads hidden",
      setting.browserNotificationApiTouched ? "browser API touched" : "browser API untouched",
      setting.appServerTraffic ? "app-server traffic" : "local catalog",
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, chips);
    elements.appNotificationsList.append(row);
  }
}

function renderCodexAppPersonalizationSettings(summary) {
  elements.appPersonalizationList.replaceChildren();
  const settings = Array.isArray(summary?.settings) ? summary.settings : [];
  if (settings.length === 0) {
    elements.appPersonalizationList.append(
      emptyState("No personalization settings catalog returned."),
    );
    return;
  }
  for (const setting of settings) {
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = setting.key ?? "unknown";

    const meta = document.createElement("span");
    meta.textContent = setting.group ?? "personalization";

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      setting.state ?? "blocked",
      setting.source ?? null,
      setting.settingValueReturned ? "value returned" : "value hidden",
      setting.currentPersonalityReturned ? "personality returned" : "personality hidden",
      setting.customInstructionsReturned ? "custom instructions returned" : "custom hidden",
      setting.agentsMdContentReturned ? "AGENTS content returned" : "AGENTS content hidden",
      setting.agentsMdPathReturned ? "AGENTS path returned" : "AGENTS path hidden",
      setting.appServerTraffic ? "app-server traffic" : "local catalog",
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, chips);
    elements.appPersonalizationList.append(row);
  }
}

function renderIntegrationMethodAudit(methodAudit) {
  elements.integrationsMethodList.replaceChildren();
  if (methodAudit.length === 0) {
    elements.integrationsMethodList.append(emptyState("No settings or integration method audit returned."));
    return;
  }
  for (const method of methodAudit) {
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = method.method ?? "unknown";

    const meta = document.createElement("span");
    meta.textContent = method.category ?? "method";

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      method.status ?? "blocked",
      method.browserEnabled ? "browser enabled" : "browser blocked",
      method.requiresExplicitEnablement ? "explicit enablement" : null,
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, chips);
    elements.integrationsMethodList.append(row);
  }
}

function renderUpstreamDrift(upstreamDrift) {
  elements.upstreamDriftList.replaceChildren();
  const methods = Array.isArray(upstreamDrift?.methods) ? upstreamDrift.methods : [];
  if (methods.length === 0) {
    elements.upstreamDriftList.append(emptyState("No upstream drift tracked."));
    return;
  }
  for (const method of methods) {
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = method.method ?? "unknown";

    const meta = document.createElement("span");
    meta.textContent = method.kind ?? "upstream";

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      method.localPolicy ?? "blocked-until-stable-schema",
      method.stableSchemaStatus ?? "absent-from-stable-schema",
      method.stablePredecessor ? `stable ${method.stablePredecessor}` : null,
      method.appServerTraffic === false ? "no app-server traffic" : null,
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, chips);
    elements.upstreamDriftList.append(row);
  }
}

function renderTerminalActions(payload) {
  const terminal = payload.terminal ?? {};
  const actions = payload.actions ?? {};
  const actionScope = payload.actionScope ?? {};
  elements.terminalStateText.textContent = terminal.state ?? "blocked";
  elements.terminalSessionsText.textContent = terminal.sessionsVisible ? "Visible" : "Blocked";
  elements.terminalLifecycleText.textContent = terminal.lifecycleSnapshotsVisible
    ? "Snapshots"
    : "Blocked";
  elements.terminalWriteText.textContent = terminal.writeEnabled ? "Enabled" : "Blocked";
  elements.terminalResizeText.textContent = terminal.resizeEnabled ? "Enabled" : "Blocked";
  elements.terminalTerminateText.textContent = terminal.terminateEnabled ? "Enabled" : "Blocked";
  elements.terminalCleanText.textContent = terminal.backgroundCleanEnabled
    ? "Enabled"
    : "Blocked";
  elements.terminalBackgroundListText.textContent = terminal.backgroundListEnabled
    ? "Enabled"
    : "Blocked";
  elements.terminalBackgroundTerminateText.textContent = terminal.backgroundTerminateEnabled
    ? "Enabled"
    : "Blocked";
  elements.actionCommandText.textContent =
    actions.commandExecutionEnabled || actions.threadShellCommandEnabled ? "Enabled" : "Blocked";
  elements.terminalActionScopeText.textContent =
    actionScope.enabledActionCount > 0 ? `${actionScope.enabledActionCount} gated` : "Blocked";
  elements.terminalHighRiskCount.textContent = String(actionScope.blockedHighRiskMethodCount ?? 0);
  const commandHistory = payload.commandHistory ?? {};
  const processSpawnHistory = payload.processSpawnHistory ?? {};
  const threadShellCommandHistory = payload.threadShellCommandHistory ?? {};
  const controlPreflightHistory = payload.terminalControlPreflightHistory ?? {};
  const controlConfirmationHistory = payload.terminalControlConfirmationHistory ?? {};
  const fileActionHistory = payload.fileActionHistory ?? {};
  elements.terminalCommandHistoryCount.textContent = String(commandHistory.count ?? 0);
  elements.processSpawnHistoryCount.textContent = String(processSpawnHistory.count ?? 0);
  elements.threadShellCommandHistoryCount.textContent = String(
    threadShellCommandHistory.count ?? 0,
  );
  elements.terminalControlPreflightHistoryCount.textContent = String(
    controlPreflightHistory.count ?? 0,
  );
  elements.terminalControlConfirmationHistoryCount.textContent = String(
    controlConfirmationHistory.count ?? 0,
  );
  elements.actionFileWriteText.textContent = actions.fileWriteEnabled ? "Enabled" : "Blocked";
  elements.fileActionHistoryCount.textContent = String(fileActionHistory.count ?? 0);
  elements.actionDecisionsText.textContent = actions.approvalDecisionsAccepted
    ? "Enabled"
    : "Disabled";
  elements.terminalTrafficText.textContent = payload.appServer?.touched ? "App-server" : "None";
  const methodAudit = Array.isArray(payload.methodAudit) ? payload.methodAudit : [];
  elements.terminalAuditedText.textContent = String(methodAudit.length);
  renderTerminalControlPreflightHistory(controlPreflightHistory);
  renderTerminalControlConfirmationHistory(controlConfirmationHistory);
  renderFileActionHistory(fileActionHistory);
  renderProcessSpawnHistory(processSpawnHistory);
  renderThreadShellCommandHistory(threadShellCommandHistory);
  renderTerminalCommandHistory(commandHistory);
  renderTerminalMethodAudit(methodAudit);
}

function renderTerminalControlPreflightHistory(history) {
  renderTerminalControlHistory({
    history,
    list: elements.terminalControlPreflightHistoryList,
    emptyText: "No terminal control preflights recorded.",
    tokenLabel: "token issued",
    confirmed: false,
  });
}

function renderTerminalControlConfirmationHistory(history) {
  renderTerminalControlHistory({
    history,
    list: elements.terminalControlConfirmationHistoryList,
    emptyText: "No terminal control confirmations recorded.",
    tokenLabel: "token consumed",
    confirmed: true,
  });
}

function renderTerminalControlHistory({ history, list, emptyText, tokenLabel, confirmed }) {
  list.replaceChildren();
  const items = Array.isArray(history?.items) ? history.items : [];
  if (items.length === 0) {
    list.append(emptyState(emptyText));
    return;
  }

  for (const item of items) {
    const control = item.terminalControl ?? {};
    const input = control.input ?? {};
    const resize = control.resize ?? {};
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = item.action?.method ?? "terminal control";

    const meta = document.createElement("span");
    meta.textContent = joinParts([item.action?.terminalAction, item.recordedAt]);

    const detail = document.createElement("p");
    detail.className = "boundary-detail";
    detail.textContent = joinParts([
      `${control.session?.selectorCharCount ?? 0} session chars`,
      `${input.charCount ?? 0} input chars`,
      resize.dimensionsReturned ? `${resize.rows} x ${resize.cols}` : null,
    ]);

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      "blocked",
      confirmed
        ? item.preflight?.tokenConsumed
          ? tokenLabel
          : null
        : item.preflight?.tokenIssued
          ? tokenLabel
          : null,
      confirmed && item.preflight?.oneTimeUseEnforced ? "one-time" : null,
      "session omitted",
      "input omitted",
      "no control",
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, detail, chips);
    list.append(row);
  }
}

function renderTerminalCommandHistory(history) {
  elements.terminalCommandHistoryList.replaceChildren();
  const items = Array.isArray(history?.items) ? history.items : [];
  if (items.length === 0) {
    elements.terminalCommandHistoryList.append(
      emptyState("No terminal command executions recorded."),
    );
    return;
  }

  for (const item of items) {
    const command = item.command ?? {};
    const result = item.result ?? {};
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = item.action?.method ?? "command/exec";

    const meta = document.createElement("span");
    meta.textContent = item.recordedAt ?? "recent";

    const detail = document.createElement("p");
    detail.className = "boundary-detail";
    detail.textContent = [
      `${command.charCount ?? 0} command chars`,
      `${command.lineCount ?? 0} lines`,
      `${command.argumentCount ?? 0} args`,
      `${(result.stdoutCharCount ?? 0) + (result.stderrCharCount ?? 0)} output chars`,
    ].join(" | ");

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      result.status ?? "unknown",
      Number.isSafeInteger(result.exitCode) ? `exit ${result.exitCode}` : "no exit code",
      item.sandbox?.policy === "readOnly" ? "read-only sandbox" : "sandbox unknown",
      item.preflight?.tokenConsumed ? "token consumed" : "no token",
      "command omitted",
      "argv omitted",
      "output omitted",
    ]) {
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, detail, chips);
    elements.terminalCommandHistoryList.append(row);
  }
}

function renderProcessSpawnHistory(history) {
  elements.processSpawnHistoryList.replaceChildren();
  const items = Array.isArray(history?.items) ? history.items : [];
  if (items.length === 0) {
    elements.processSpawnHistoryList.append(emptyState("No process spawns recorded."));
    return;
  }

  for (const item of items) {
    const processSummary = item.process ?? {};
    const result = item.result ?? {};
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = item.action?.method ?? "process/spawn";

    const meta = document.createElement("span");
    meta.textContent = item.recordedAt ?? "recent";

    const detail = document.createElement("p");
    detail.className = "boundary-detail";
    detail.textContent = [
      `${processSummary.charCount ?? 0} command chars`,
      `${processSummary.argumentCount ?? 0} args`,
      `${(result.stdoutCharCount ?? 0) + (result.stderrCharCount ?? 0)} output chars`,
    ].join(" | ");

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      result.status ?? "unknown",
      Number.isSafeInteger(result.exitCode) ? `exit ${result.exitCode}` : "no exit code",
      item.sandbox?.policy === "none" ? "unsandboxed" : "sandbox unknown",
      item.preflight?.tokenConsumed ? "token consumed" : "no token",
      "argv omitted",
      "output omitted",
      "handle omitted",
    ]) {
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, detail, chips);
    elements.processSpawnHistoryList.append(row);
  }
}

function renderThreadShellCommandHistory(history) {
  elements.threadShellCommandHistoryList.replaceChildren();
  const items = Array.isArray(history?.items) ? history.items : [];
  if (items.length === 0) {
    elements.threadShellCommandHistoryList.append(
      emptyState("No thread shell commands recorded."),
    );
    return;
  }

  for (const item of items) {
    const command = item.command ?? {};
    const result = item.result ?? {};
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = item.action?.method ?? "thread/shellCommand";

    const meta = document.createElement("span");
    meta.textContent = joinParts([item.target?.threadIdSuffix, item.recordedAt]);

    const detail = document.createElement("p");
    detail.className = "boundary-detail";
    detail.textContent = joinParts([
      `${command.charCount ?? 0} command chars`,
      `${command.lineCount ?? 0} lines`,
      `${result.loadedSessionCount ?? 0} loaded`,
    ]);

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      result.status ?? "submitted",
      item.policy?.unsandboxedThreadShell ? "thread shell" : null,
      item.preflight?.tokenConsumed ? "token consumed" : "no token",
      "command omitted",
      "output omitted",
      "full ids omitted",
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, detail, chips);
    elements.threadShellCommandHistoryList.append(row);
  }
}

function renderFileActionHistory(history) {
  elements.fileActionHistoryList.replaceChildren();
  const items = Array.isArray(history?.items) ? history.items : [];
  if (items.length === 0) {
    elements.fileActionHistoryList.append(emptyState("No file actions recorded."));
    return;
  }

  for (const item of items) {
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = item.action?.method ?? "file action";

    const meta = document.createElement("span");
    meta.textContent = joinParts([item.action?.fileAction, item.recordedAt]);

    const detail = document.createElement("p");
    detail.className = "boundary-detail";
    detail.textContent = joinParts([
      `${item.target?.depth ?? 0} target depth`,
      item.source ? `${item.source.depth ?? 0} source depth` : null,
      `${item.content?.charCount ?? 0} content chars`,
    ]);

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      item.action?.execution ?? "unknown",
      item.action?.filesystemWrites ? "filesystem write" : "no write",
      item.preflight?.tokenConsumed ? "token consumed" : null,
      item.policy?.auditLogWritten ? "audit logged" : null,
      "paths omitted",
      "content omitted",
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, detail, chips);
    elements.fileActionHistoryList.append(row);
  }
}

function renderTerminalCommandPreflight(payload) {
  elements.terminalPreflightStatus.textContent = payload.action?.execution ?? "blocked";
  elements.terminalCommandChars.textContent = String(payload.command?.charCount ?? 0);
  elements.terminalCommandLines.textContent = String(payload.command?.lineCount ?? 0);
  elements.terminalCommandExecution.textContent = payload.action?.commandExecution
    ? "Enabled"
    : "Blocked";
  elements.terminalCommandSession.textContent = payload.action?.terminalSessionCreated
    ? "Created"
    : "None";
  elements.terminalCommandExit.textContent = "-";
  elements.terminalCommandOutput.textContent = "0";
  elements.terminalCommandButton.disabled =
    !lastTerminalCommandPreflight?.token || payload.policy?.executionGateEnabled !== true;
}

function renderTerminalCommand(payload) {
  const stdoutChars = payload.result?.stdoutCharCount ?? 0;
  const stderrChars = payload.result?.stderrCharCount ?? 0;
  elements.terminalPreflightStatus.textContent = payload.action?.execution ?? "completed";
  elements.terminalCommandExecution.textContent = payload.action?.commandExecution
    ? "Completed"
    : "Blocked";
  elements.terminalCommandSession.textContent = payload.action?.terminalSessionCreated
    ? "Created"
    : "None";
  elements.terminalCommandExit.textContent =
    Number.isSafeInteger(payload.result?.exitCode) ? String(payload.result.exitCode) : "-";
  elements.terminalCommandOutput.textContent = String(stdoutChars + stderrChars);
}

function renderProcessSpawnPreflight(payload) {
  elements.processSpawnStatus.textContent = payload.action?.execution ?? "blocked";
  elements.processSpawnChars.textContent = String(payload.process?.charCount ?? 0);
  elements.processSpawnArgs.textContent = String(payload.process?.argumentCount ?? 0);
  elements.processSpawnExecution.textContent = payload.action?.hostProcessExecution
    ? "Enabled"
    : "Blocked";
  elements.processSpawnExit.textContent = "-";
  elements.processSpawnOutput.textContent = "0";
  elements.processSpawnEnv.textContent = payload.policy?.environmentReturned ? "Returned" : "Omitted";
  elements.processSpawnButton.disabled =
    !lastProcessSpawnPreflight?.token || payload.policy?.executionGateEnabled !== true;
}

function renderProcessSpawn(payload) {
  const stdoutChars = payload.result?.stdoutCharCount ?? 0;
  const stderrChars = payload.result?.stderrCharCount ?? 0;
  elements.processSpawnStatus.textContent = payload.action?.execution ?? "completed";
  elements.processSpawnExecution.textContent = payload.action?.hostProcessExecution
    ? "Completed"
    : "Blocked";
  elements.processSpawnExit.textContent =
    Number.isSafeInteger(payload.result?.exitCode) ? String(payload.result.exitCode) : "-";
  elements.processSpawnOutput.textContent = String(stdoutChars + stderrChars);
  elements.processSpawnEnv.textContent = payload.sandbox?.environmentReturned
    ? "Returned"
    : "Omitted";
}

function renderThreadShellCommandPreflight(payload) {
  const shell = payload.threadShellCommand ?? {};
  const command = shell.command ?? {};
  elements.threadShellCommandStatus.textContent = payload.action?.execution ?? "blocked";
  elements.threadShellCommandThreadText.textContent = shell.threadIdSuffix ?? "-";
  elements.threadShellCommandChars.textContent = String(command.charCount ?? 0);
  elements.threadShellCommandExecution.textContent =
    payload.policy?.executionGateEnabled === true ? "Enabled" : "Blocked";
  elements.threadShellCommandOutput.textContent = shell.outputTextReturned ? "Returned" : "None";
  elements.threadShellCommandButton.disabled = !(
    lastThreadShellCommandPreflight?.token && lastThreadShellCommandPreflight.enabled === true
  );
}

function renderThreadShellCommand(payload) {
  const shell = payload.threadShellCommand ?? {};
  const command = shell.command ?? {};
  const result = payload.result ?? {};
  elements.threadShellCommandStatus.textContent = payload.action?.execution ?? "completed";
  elements.threadShellCommandThreadText.textContent = payload.target?.threadIdSuffix ?? "-";
  elements.threadShellCommandChars.textContent = String(command.charCount ?? 0);
  elements.threadShellCommandExecution.textContent = payload.action?.threadShellCommand
    ? "Completed"
    : "Blocked";
  elements.threadShellCommandOutput.textContent = result.outputTextReturned ? "Returned" : "None";
}

function renderTerminalControlPreflight(payload) {
  const terminalControl = payload.terminalControl ?? {};
  const input = terminalControl.input ?? {};
  const resize = terminalControl.resize ?? {};
  elements.terminalControlStatus.textContent = payload.action?.execution ?? "blocked";
  elements.terminalControlSessionChars.textContent = String(
    terminalControl.session?.selectorCharCount ?? 0,
  );
  elements.terminalControlInputChars.textContent = String(input.charCount ?? 0);
  elements.terminalControlDimensions.textContent =
    resize.dimensionsReturned && resize.rows && resize.cols ? `${resize.rows} x ${resize.cols}` : "-";
  elements.terminalControlExecution.textContent =
    payload.policy?.executionGateEnabled === true
      ? "Enabled"
      : "Blocked";
  elements.terminalControlRunButton.disabled = !(
    lastTerminalControlPreflight?.token && payload.policy?.executionGateEnabled === true
  );
}

function renderTerminalControl(payload) {
  const terminalControl = payload.terminalControl ?? {};
  const input = terminalControl.input ?? {};
  const resize = terminalControl.resize ?? {};
  elements.terminalControlStatus.textContent = payload.action?.execution ?? "completed";
  elements.terminalControlSessionChars.textContent = String(
    terminalControl.session?.selectorCharCount ?? payload.target?.sessionSelectorCharCount ?? 0,
  );
  elements.terminalControlInputChars.textContent = String(input.charCount ?? 0);
  elements.terminalControlDimensions.textContent =
    resize.dimensionsReturned && resize.rows && resize.cols ? `${resize.rows} x ${resize.cols}` : "-";
  elements.terminalControlExecution.textContent = payload.action?.terminalSessionTouched
    ? "Completed"
    : "Blocked";
}

function renderTerminalCleanPreflight(payload) {
  const clean = payload.terminalBackgroundClean ?? {};
  elements.terminalCleanStatus.textContent = payload.action?.execution ?? "blocked";
  elements.terminalCleanThreadText.textContent = clean.threadIdSuffix ?? "-";
  elements.terminalCleanLoadedText.textContent = "0";
  elements.terminalCleanResultText.textContent = payload.action?.wouldCleanBackgroundTerminals
    ? "Enabled"
    : "Blocked";
  elements.terminalCleanOutputText.textContent = clean.outputTextReturned ? "Returned" : "None";
  elements.terminalCleanButton.disabled = !(
    lastTerminalCleanPreflight?.token && payload.policy?.executionGateEnabled === true
  );
}

function renderTerminalClean(payload) {
  const target = payload.target ?? {};
  const result = payload.result ?? {};
  elements.terminalCleanStatus.textContent = payload.action?.execution ?? "completed";
  elements.terminalCleanThreadText.textContent = target.threadIdSuffix ?? "-";
  elements.terminalCleanLoadedText.textContent = String(result.loadedSessionCount ?? 0);
  elements.terminalCleanResultText.textContent = result.status ?? "completed";
  elements.terminalCleanOutputText.textContent = result.outputTextReturned ? "Returned" : "None";
}

function renderTerminalBackgroundList(payload) {
  const list = payload.terminalBackgroundList ?? {};
  const terminals = payload.terminals ?? {};
  const items = Array.isArray(terminals.items) ? terminals.items : [];
  elements.terminalBackgroundListStatus.textContent = payload.action?.execution ?? "completed";
  elements.terminalBackgroundListThreadText.textContent = list.threadIdSuffix ?? "-";
  elements.terminalBackgroundLoadedText.textContent = String(list.loadedSessionCount ?? 0);
  elements.terminalBackgroundCountText.textContent = String(terminals.count ?? items.length);
  elements.terminalBackgroundSelectionText.textContent = "None";
  renderTerminalBackgroundListItems(items);
}

function renderTerminalBackgroundListItems(items) {
  elements.terminalBackgroundList.replaceChildren();
  selectedTerminalBackgroundRef = null;
  lastTerminalBackgroundTerminatePreflight = null;
  elements.terminalBackgroundTerminatePreflightButton.disabled = true;
  elements.terminalBackgroundTerminateButton.disabled = true;

  if (items.length === 0) {
    elements.terminalBackgroundList.append(emptyState("No background terminals."));
    return;
  }

  for (const item of items) {
    const row = document.createElement("button");
    row.className = "boundary-row selectable-row";
    row.type = "button";
    row.dataset.terminalRef = item.terminalRef ?? "";

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = `Terminal ${item.ordinal ?? ""}`.trim();

    const meta = document.createElement("span");
    meta.textContent = joinParts([
      item.commandPresent ? "command present" : "command absent",
      item.cwdPresent ? "cwd present" : "cwd absent",
      item.osPidPresent ? "os pid present" : "os pid absent",
    ]);

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      item.cpuPercentPresent ? "cpu" : null,
      item.rssKbPresent ? "memory" : null,
      "ids omitted",
      "paths omitted",
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    row.addEventListener("click", () => {
      selectedTerminalBackgroundRef = row.dataset.terminalRef || null;
      lastTerminalBackgroundTerminatePreflight = null;
      for (const sibling of elements.terminalBackgroundList.querySelectorAll(".selectable-row")) {
        sibling.setAttribute("aria-pressed", "false");
      }
      row.setAttribute("aria-pressed", "true");
      elements.terminalBackgroundSelectionText.textContent = title.textContent || "Selected";
      elements.terminalBackgroundTerminatePreflightButton.disabled = !selectedTerminalBackgroundRef;
      elements.terminalBackgroundTerminateButton.disabled = true;
    });

    header.append(title, meta);
    row.append(header, chips);
    elements.terminalBackgroundList.append(row);
  }
}

function renderFsDirectory(summary, policy, appServer) {
  const enabled = policy?.fsDirectoryReadEnabled === true;
  if (!summary) {
    elements.fsDirectoryStatus.textContent = "No directory metadata";
    elements.fsDirectoryEntryCount.textContent = "0";
    elements.fsDirectoryDirCount.textContent = "0";
    elements.fsDirectoryFileCount.textContent = "0";
    elements.fsDirectoryTraffic.textContent = appServer?.touched ? "App-server" : "None";
    elements.fsDirectoryList.replaceChildren();
    return;
  }

  elements.fsDirectoryEntryCount.textContent = String(summary.returnedEntryCount ?? 0);
  elements.fsDirectoryDirCount.textContent = String(summary.directoryCount ?? 0);
  elements.fsDirectoryFileCount.textContent = String(summary.fileCount ?? 0);
  elements.fsDirectoryTraffic.textContent = appServer?.touched ? "App-server" : "None";
  elements.fsDirectoryStatus.textContent = enabled
    ? joinParts([
        summary.target?.isWorkspaceRoot ? "Workspace root" : summary.target?.basename,
        `${summary.returnedEntryCount ?? 0} entries`,
        summary.truncated ? "truncated" : null,
        summary.hiddenEntryCount ? `${summary.hiddenEntryCount} hidden` : null,
      ])
    : "Blocked";

  elements.fsDirectoryList.replaceChildren();
  const entries = Array.isArray(summary.entries) ? summary.entries : [];
  if (!enabled || entries.length === 0) {
    elements.fsDirectoryList.append(
      emptyState(enabled ? "No visible directory entries." : "Directory reads disabled by default."),
    );
    return;
  }

  for (const entry of entries) {
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = entry.name ?? "entry";

    const meta = document.createElement("span");
    meta.textContent = entry.isDirectory ? "directory" : entry.isFile ? "file" : "other";

    const detail = document.createElement("p");
    detail.className = "boundary-detail";
    detail.textContent = "workspace-relative entry name only";

    header.append(title, meta);
    row.append(header, detail);
    elements.fsDirectoryList.append(row);
  }
}

function renderFsReadFilePreflight(payload) {
  const target = payload.target ?? {};
  const content = payload.content ?? {};
  elements.fsReadFileStatus.textContent = payload.action?.execution ?? "blocked";
  elements.fsReadFileDepth.textContent = String(target.pathDepth ?? 0);
  elements.fsReadFileChars.textContent = String(target.pathCharCount ?? 0);
  elements.fsReadFileContent.textContent =
    content.fileContentsReturned === false && content.dataBase64Returned === false
      ? "Hidden"
      : "Unsafe";
  elements.fsReadFileTraffic.textContent = payload.appServer?.touched ? "App-server" : "None";
}

function renderFsWatchPreflight(payload) {
  const target = payload.target ?? {};
  const watch = payload.watch ?? {};
  elements.fsWatchStatus.textContent = payload.action?.execution ?? "blocked";
  elements.fsWatchDepth.textContent = String(target.pathDepth ?? 0);
  elements.fsWatchIdState.textContent =
    watch.watchIdReturned === false && watch.watchIdAccepted === true ? "Hidden" : "Unsafe";
  elements.fsWatchNotifications.textContent =
    watch.watchNotificationsEnabled === false && watch.fsChangedNotificationsReturned === false
      ? "Off"
      : "Unsafe";
  elements.fsWatchTraffic.textContent = payload.appServer?.touched ? "App-server" : "None";
}

function renderFuzzyFileSearchPreflight(payload) {
  const request = payload.request ?? {};
  const results = payload.results ?? {};
  elements.fuzzyFileSearchStatus.textContent = payload.action?.execution ?? "blocked";
  elements.fuzzyFileSearchRootCount.textContent = String(request.rootCount ?? 0);
  elements.fuzzyFileSearchQueryChars.textContent = String(request.queryCharCount ?? 0);
  elements.fuzzyFileSearchSessionState.textContent =
    payload.policy?.sessionIdsReturned === false && request.sessionIdAccepted === true
      ? "Hidden"
      : "Unsafe";
  elements.fuzzyFileSearchResults.textContent =
    results.resultsReturned === false && results.pathsReturned === false ? "Hidden" : "Unsafe";
}

function renderTerminalBackgroundTerminatePreflight(payload) {
  elements.terminalBackgroundListStatus.textContent =
    payload.policy?.executionGateEnabled === true ? "Ready" : "Blocked";
  elements.terminalBackgroundListThreadText.textContent =
    payload.terminalBackgroundTerminate?.threadIdSuffix ?? "-";
  elements.terminalBackgroundTerminateButton.disabled = !(
    lastTerminalBackgroundTerminatePreflight?.token &&
    payload.policy?.executionGateEnabled === true
  );
}

function renderTerminalBackgroundTerminate(payload) {
  const result = payload.result ?? {};
  elements.terminalBackgroundListStatus.textContent = result.terminated
    ? "Terminated"
    : "Not terminated";
  elements.terminalBackgroundListThreadText.textContent =
    payload.target?.threadIdSuffix ?? "-";
  elements.terminalBackgroundLoadedText.textContent = String(result.loadedSessionCount ?? 0);
  elements.terminalBackgroundSelectionText.textContent = "None";
}

function renderFileActionPreflight(payload) {
  elements.fileActionStatus.textContent = payload.action?.execution ?? "blocked";
  elements.fileActionTarget.textContent = payload.target?.basename ?? "-";
  elements.fileActionChars.textContent = String(payload.content?.charCount ?? 0);
  elements.fileActionMutation.textContent = payload.action?.filesystemWrites
    ? "Enabled"
    : "Blocked";
  elements.fileActionTraffic.textContent = payload.appServer?.touched ? "App-server" : "None";
  elements.fileActionButton.disabled = !(
    lastFileActionPreflight?.token && payload.policy?.executionGateEnabled === true
  );
}

function renderFileAction(payload) {
  elements.fileActionStatus.textContent = payload.action?.execution ?? "completed";
  elements.fileActionTarget.textContent = payload.target?.basename ?? "-";
  elements.fileActionChars.textContent = String(payload.content?.charCount ?? 0);
  elements.fileActionMutation.textContent = payload.action?.filesystemWrites ? "Applied" : "Blocked";
  elements.fileActionTraffic.textContent = payload.appServer?.touched ? "App-server" : "None";
}

function renderLiveSessions(payload) {
  const live = payload.liveSessions ?? {};
  const lifecycle = payload.lifecycle ?? {};
  const suffixes = Array.isArray(live.threadIdSuffixes) ? live.threadIdSuffixes : [];
  const recentControls = Array.isArray(payload.recentControls?.items)
    ? payload.recentControls.items
    : [];
  elements.liveSessionCount.textContent = String(live.count ?? suffixes.length);
  elements.liveSessionControlHistoryCount.textContent = String(
    payload.recentControls?.count ?? recentControls.length,
  );
  elements.liveSessionSource.textContent = live.state === "visible" ? live.source ?? "Loaded" : "Blocked";
  elements.liveSessionLifecycleState.textContent = lifecycle.state ?? "blocked";
  elements.liveSessionControlGates.textContent = `${lifecycle.controlActionsEnabled ?? 0} / ${
    lifecycle.controlActionCount ?? 3
  }`;
  const operations = lifecycle.activeSessionOperations ?? {};
  elements.liveSessionOperations.textContent = liveSessionOperationsText(operations);
  elements.liveSessionManagement.textContent = liveSessionManagementText(
    lifecycle.activeSessionManagement,
  );
  elements.liveSessionReadiness.textContent = liveSessionReadinessText(
    lifecycle.activeSessionReadiness,
  );
  elements.liveSessionRouting.textContent = liveSessionRoutingContractText(
    lifecycle.activeSessionRoutingContract,
    operations,
  );
  elements.liveSessionWorkflow.textContent = liveSessionWorkflowContractText(
    lifecycle.activeSessionWorkflowContract,
  );
  elements.liveSessionSafety.textContent = liveSessionSafetyContractText(
    lifecycle.activeSessionSafetyContract,
  );
  elements.liveSessionAudit.textContent = liveSessionAuditContractText(
    lifecycle.activeSessionAuditContract,
  );
  elements.liveSessionInteraction.textContent = liveSessionInteractionContractText(
    lifecycle.activeSessionInteractionContract,
  );
  elements.liveSessionControlBreakdown.textContent = [
    lifecycle.recentInterruptCount ?? 0,
    lifecycle.recentUnsubscribeCount ?? 0,
    lifecycle.recentSteerCount ?? 0,
    lifecycle.recentBulkUnsubscribeCount ?? 0,
  ].join(" / ");
  elements.liveSessionControlResultCounts.textContent = `${
    lifecycle.recentSucceededControlCount ?? 0
  } ok / ${lifecycle.recentFailedControlCount ?? 0} failed`;
  elements.liveSessionLatestControl.textContent = latestLiveSessionControlText(
    lifecycle.latestControl,
  );
  elements.liveSessionTraffic.textContent = payload.appServer?.touched ? "App-server read" : "Read-only";
  elements.liveSessionList.replaceChildren();

  if (suffixes.length === 0 && recentControls.length === 0) {
    elements.liveSessionList.append(
      emptyState(
        live.state === "visible"
          ? "No loaded session suffixes returned."
          : "Loaded session inventory is blocked by default.",
      ),
    );
    return;
  }

  for (const suffix of suffixes) {
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = `Thread ${suffix}`;

    const meta = document.createElement("span");
    meta.textContent = live.hasNextCursor ? "page truncated" : "loaded";

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      live.source ?? "thread/loaded/list",
      lifecycle.interruptEnabled || lifecycle.unsubscribeEnabled ? "control gated" : "control blocked",
      lifecycle.bulkUnsubscribeEnabled ? "bulk gated" : null,
      payload.policy?.fullIdsReturned === false ? "suffix only" : null,
      payload.policy?.threadContentReturned === false ? "no content" : null,
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    const actions = document.createElement("div");
    actions.className = "button-row";

    const useButton = document.createElement("button");
    useButton.className = "secondary-button";
    useButton.type = "button";
    useButton.textContent = "Use";
    useButton.addEventListener("click", () => {
      fillLiveSessionControlDraft({
        action: elements.liveSessionControlAction.value || "unsubscribe",
        thread: suffix,
      });
    });

    const unsubscribeButton = document.createElement("button");
    unsubscribeButton.className = "secondary-button";
    unsubscribeButton.type = "button";
    unsubscribeButton.textContent = "Unsub Check";
    unsubscribeButton.addEventListener("click", () => {
      fillLiveSessionControlDraft({ action: "unsubscribe", thread: suffix });
      runLiveSessionControlPreflight();
    });

    actions.append(useButton, unsubscribeButton);
    row.append(header, chips, actions);
    elements.liveSessionList.append(row);
  }

  for (const control of recentControls) {
    if (control.action?.type === "live-session-bulk-control") {
      const row = document.createElement("article");
      row.className = "boundary-row";
      row.setAttribute("role", "listitem");

      const header = document.createElement("div");
      header.className = "boundary-row-header";

      const title = document.createElement("strong");
      title.textContent = "bulk unsubscribe";

      const meta = document.createElement("span");
      meta.textContent = joinParts([
        control.result?.status,
        `${control.result?.succeededSessionCount ?? 0} applied`,
        control.workspace?.label,
      ]);

      const chips = document.createElement("div");
      chips.className = "boundary-chip-list";
      for (const value of [
        control.action?.method,
        `${control.result?.loadedSessionCount ?? 0} loaded`,
        `${control.result?.failedSessionCount ?? 0} failed`,
        control.preflight?.oneTimeUseEnforced ? "token consumed" : null,
        control.target?.fullIdsReturned === false ? "ids omitted" : null,
        control.result?.threadContentReturned === false ? "no content" : null,
      ]) {
        if (!value) {
          continue;
        }
        const chip = document.createElement("span");
        chip.className = "boundary-chip";
        chip.textContent = value;
        chips.append(chip);
      }

      header.append(title, meta);
      row.append(header, chips);
      elements.liveSessionList.append(row);
      continue;
    }

    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = `${control.action?.liveSessionAction ?? "control"} ${
      control.target?.threadIdSuffix ?? "-"
    }`;

    const meta = document.createElement("span");
    meta.textContent = joinParts([
      control.result?.status,
      control.target?.turnIdSuffix ? `turn ${control.target.turnIdSuffix}` : null,
      control.workspace?.label,
    ]);

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      control.action?.method,
      control.action?.modelTraffic ? "model traffic" : null,
      control.prompt?.present ? `${control.prompt.charCount ?? 0} prompt chars` : null,
      control.preflight?.oneTimeUseEnforced ? "token consumed" : null,
      control.target?.fullIdsReturned === false ? "suffix only" : null,
      control.result?.threadContentReturned === false ? "no content" : null,
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, chips);
    elements.liveSessionList.append(row);
  }
}

function liveSessionOperationsText(operations) {
  const enabled = Number.isSafeInteger(operations?.enabledOperationCount)
    ? operations.enabledOperationCount
    : 0;
  const total = (operations?.inventoryReadAvailable ? 1 : 0) +
    (Number.isSafeInteger(operations?.singleSessionControlCount)
      ? operations.singleSessionControlCount
      : 0) +
    (Number.isSafeInteger(operations?.bulkControlCount) ? operations.bulkControlCount : 0);
  return `${enabled} / ${total}`;
}

function liveSessionManagementText(management) {
  if (!management || management.returned !== true) {
    return "Blocked";
  }
  const state = management.state ?? "blocked";
  const selectable = Number.isSafeInteger(management.selectableThreadSuffixCount)
    ? management.selectableThreadSuffixCount
    : 0;
  const enabled = Number.isSafeInteger(management.enabledSingleSessionControlCount)
    ? management.enabledSingleSessionControlCount
    : 0;
  const bulk = management.bulkManagementEnabled ? "bulk" : null;
  return joinParts([
    state,
    selectable > 0 ? `${selectable} suffixes` : null,
    enabled > 0 ? `${enabled} controls` : null,
    bulk,
    management.modelTrafficManagementEnabled ? "model" : null,
  ]) || "Blocked";
}

function liveSessionReadinessText(readiness) {
  if (!readiness || readiness.returned !== true) {
    return "Blocked";
  }
  const loaded = Number.isSafeInteger(readiness.loadedThreadCount)
    ? readiness.loadedThreadCount
    : 0;
  const enabled = Number.isSafeInteger(readiness.enabledOperationCount)
    ? readiness.enabledOperationCount
    : 0;
  return joinParts([
    readiness.state ?? "blocked",
    loaded > 0 ? `${loaded} loaded` : null,
    enabled > 0 ? `${enabled} ops` : null,
    readiness.preflightRequired ? "preflight" : null,
    readiness.dedicatedRoutesOnly ? "dedicated" : null,
  ]) || "Blocked";
}

function liveSessionRoutingContractText(contract, operations = {}) {
  if (!contract || contract.returned !== true) {
    return operations?.sessionManagerEnabled ? "Session manager" : "Local";
  }
  return joinParts([
    contract.routingMode ?? "blocked",
    contract.preflightRequired ? "preflight" : null,
    contract.targetSelection === "suffix-only" ? "suffix" : null,
    contract.sessionManagerEnabled ? "manager" : null,
    contract.modelTrafficControlEnabled ? "model" : null,
  ]) || "Blocked";
}

function liveSessionWorkflowContractText(contract) {
  if (!contract || contract.returned !== true) {
    return "Blocked";
  }
  const loaded = Number.isSafeInteger(contract.loadedThreadCount)
    ? contract.loadedThreadCount
    : 0;
  const enabled = Number.isSafeInteger(contract.enabledOperationCount)
    ? contract.enabledOperationCount
    : 0;
  return joinParts([
    contract.workflowMode ?? contract.state ?? "blocked",
    loaded > 0 ? `${loaded} loaded` : null,
    enabled > 0 ? `${enabled} ops` : null,
    contract.oneTimePreflightTokensRequired ? "preflight" : null,
    contract.clientSideGroupingOnly ? "groups" : null,
  ]) || "Blocked";
}

function liveSessionSafetyContractText(contract) {
  if (!contract || contract.returned !== true) {
    return "Blocked";
  }
  const enabled = Number.isSafeInteger(contract.enabledOperationCount)
    ? contract.enabledOperationCount
    : 0;
  return joinParts([
    contract.safetyMode ?? contract.state ?? "blocked",
    enabled > 0 ? `${enabled} ops` : null,
    contract.preflightTokenRequired ? "preflight" : null,
    contract.dedicatedControlRoutesOnly ? "dedicated" : null,
    contract.modelTrafficControlRequiresSeparateOptIn ? "model opt-in" : null,
    contract.sessionWideControlsAccepted ? "session" : "no session",
  ]) || "Blocked";
}

function liveSessionAuditContractText(contract) {
  if (!contract || contract.returned !== true) {
    return "History";
  }
  const controls = Number.isSafeInteger(contract.recentControlCount)
    ? contract.recentControlCount
    : 0;
  return joinParts([
    contract.auditMode ?? "process-local-control-history",
    controls > 0 ? `${controls} controls` : null,
    contract.controlHistoryBounded ? "bounded" : null,
    contract.actionAuditPersistent ? "action audit" : null,
    contract.preflightTokenRequired ? "preflight" : null,
  ]) || "History";
}

function liveSessionInteractionContractText(contract) {
  if (!contract || contract.returned !== true) {
    return "Blocked";
  }
  const loaded = Number.isSafeInteger(contract.loadedThreadCount)
    ? contract.loadedThreadCount
    : 0;
  const controls = Number.isSafeInteger(contract.enabledSingleSessionControlCount)
    ? contract.enabledSingleSessionControlCount
    : 0;
  return joinParts([
    contract.interactionMode ?? contract.state ?? "blocked",
    loaded > 0 ? `${loaded} loaded` : null,
    controls > 0 ? `${controls} controls` : null,
    contract.bulkExecutionControlsRendered ? "bulk" : null,
    contract.rowPreflightControlsRendered ? "row check" : null,
    contract.singleSessionExecutionButtonRequiresPreflight ? "preflight" : null,
    contract.sessionWideControlsAccepted ? "session" : "no session",
  ]) || "Blocked";
}

function latestLiveSessionControlText(control) {
  if (!control) {
    return "-";
  }
  return joinParts([
    control.action,
    control.status,
    control.threadIdSuffix ? `thread ${control.threadIdSuffix}` : null,
    control.turnIdSuffix ? `turn ${control.turnIdSuffix}` : null,
    control.targetScope,
    control.modelTraffic ? "model" : null,
  ]) || "-";
}

function renderLiveSessionControlPreflight(payload) {
  const control = payload.liveSessionControl ?? {};
  elements.liveSessionControlStatus.textContent = payload.policy?.executionGateEnabled
    ? "Ready"
    : "Blocked";
  elements.liveSessionControlActionText.textContent = control.method ?? payload.action?.method ?? "-";
  elements.liveSessionControlTargetText.textContent = joinParts([
    control.threadIdSuffix ? `thread ${control.threadIdSuffix}` : null,
    control.turnIdSuffix ? `turn ${control.turnIdSuffix}` : null,
  ]) || "-";
  elements.liveSessionControlMutationText.textContent = payload.action?.wouldControlLiveSession
    ? "Enabled"
    : "Blocked";
  elements.liveSessionControlMethodsText.textContent = payload.action?.method ? "1" : "0";
  elements.liveSessionControlPromptChars.textContent = String(payload.prompt?.charCount ?? 0);
  elements.liveSessionControlButton.disabled =
    !lastLiveSessionControlPreflight?.token || payload.policy?.executionGateEnabled !== true;
}

function renderLiveSessionControl(payload) {
  const methods = Array.isArray(payload.appServer?.auditedMethods)
    ? payload.appServer.auditedMethods
    : [];
  elements.liveSessionControlStatus.textContent = payload.action?.execution ?? "completed";
  elements.liveSessionControlActionText.textContent = payload.action?.method ?? "-";
  elements.liveSessionControlTargetText.textContent = joinParts([
    payload.target?.threadIdSuffix ? `thread ${payload.target.threadIdSuffix}` : null,
    payload.target?.turnIdSuffix ? `turn ${payload.target.turnIdSuffix}` : null,
    payload.result?.status,
  ]) || "-";
  elements.liveSessionControlMutationText.textContent = payload.action?.liveSessionMutation
    ? "Applied"
    : "Blocked";
  elements.liveSessionControlMethodsText.textContent = String(methods.length);
  elements.liveSessionControlPromptChars.textContent = String(payload.prompt?.charCount ?? 0);
}

function renderLiveSessionBulkPreflight(payload) {
  const control = payload.liveSessionBulkControl ?? {};
  elements.liveSessionBulkStatus.textContent = payload.policy?.executionGateEnabled
    ? "Ready"
    : "Blocked";
  elements.liveSessionBulkTargetText.textContent = control.targetScope ?? "all-loaded";
  elements.liveSessionBulkResultText.textContent = payload.action?.wouldControlLiveSessions
    ? "Enabled"
    : "Blocked";
  elements.liveSessionBulkMethodsText.textContent = payload.action?.method ? "1" : "0";
  elements.liveSessionBulkButton.disabled =
    !lastLiveSessionBulkPreflight?.token || payload.policy?.executionGateEnabled !== true;
}

function renderLiveSessionBulkControl(payload) {
  const methods = Array.isArray(payload.appServer?.auditedMethods)
    ? payload.appServer.auditedMethods
    : [];
  elements.liveSessionBulkStatus.textContent = payload.action?.execution ?? "completed";
  elements.liveSessionBulkTargetText.textContent = payload.target?.targetScope ?? "all-loaded";
  elements.liveSessionBulkResultText.textContent = joinParts([
    payload.result?.status,
    `${payload.result?.succeededSessionCount ?? 0} applied`,
    `${payload.result?.failedSessionCount ?? 0} failed`,
  ]);
  elements.liveSessionBulkMethodsText.textContent = String(methods.length);
}

function renderTerminalMethodAudit(methodAudit) {
  elements.terminalMethodList.replaceChildren();
  if (methodAudit.length === 0) {
    elements.terminalMethodList.append(emptyState("No terminal or action method audit returned."));
    return;
  }
  for (const method of methodAudit) {
    const row = document.createElement("article");
    row.className = "boundary-row";
    row.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "boundary-row-header";

    const title = document.createElement("strong");
    title.textContent = method.method ?? "unknown";

    const meta = document.createElement("span");
    meta.textContent = method.category ?? "method";

    const chips = document.createElement("div");
    chips.className = "boundary-chip-list";
    for (const value of [
      method.status ?? "blocked",
      method.browserEnabled ? "browser enabled" : "browser blocked",
      method.reason,
    ]) {
      if (!value) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "boundary-chip";
      chip.textContent = value;
      chips.append(chip);
    }

    header.append(title, meta);
    row.append(header, chips);
    elements.terminalMethodList.append(row);
  }
}

function formatGitHead(git) {
  if (git.headKind === "branch" && git.branch) {
    return git.branch;
  }
  if (git.headKind === "detached" && git.commitShort) {
    return `detached ${git.commitShort}`;
  }
  return git.headKind ?? "-";
}

function gitStateText(git) {
  if (!git.isRepository) {
    if (git.gitMetadataType === "symlink") {
      return "Git metadata is a symlink and was not followed.";
    }
    return "No .git metadata found for this workspace.";
  }
  const parts = [
    git.gitMetadataType === "file" ? "Linked gitdir was not followed." : null,
    git.linkedWorktreeCount ? `${git.linkedWorktreeCount} linked worktrees detected.` : null,
    git.localBranchCount ? `${git.localBranchCount} local branches detected.` : null,
    git.warnings?.length ? `${git.warnings.length} read warnings.` : null,
    git.statusAvailable
      ? `Working tree status checked ${git.checkedTrackedFileCount ?? 0} tracked files.`
      : "Working tree status not computed.",
    git.branchSwitchAvailable || git.commitActionsAvailable ? null : "Branch and commit actions blocked.",
  ];
  return joinParts(parts);
}

function formatGitWorktreeHead(worktree) {
  if (worktree.headKind === "branch" && worktree.branch) {
    return worktree.branch;
  }
  if (worktree.headKind === "detached" && worktree.commitShort) {
    return `detached ${worktree.commitShort}`;
  }
  return worktree.headKind ?? null;
}

function changeTitle(change) {
  return (
    change.fileBasename ??
    change.toBasename ??
    change.fromBasename ??
    `File change ${Number.isFinite(change.index) ? change.index + 1 : ""}`.trim()
  );
}

function metric(label, value) {
  const container = document.createElement("div");
  const term = document.createElement("dt");
  term.textContent = label;
  const description = document.createElement("dd");
  description.textContent = value || "-";
  container.append(term, description);
  return container;
}

function emptyState(message) {
  const empty = document.createElement("p");
  empty.className = "empty-state";
  empty.textContent = message;
  return empty;
}

function renderError(error) {
  elements.statusText.textContent = "Disconnected";
  elements.errorText.textContent = error.message;
  elements.errorPanel.hidden = false;
}

function hideError() {
  elements.errorPanel.hidden = true;
  elements.errorText.textContent = "";
}

function setLoading(isLoading) {
  elements.refreshButton.disabled = isLoading;
  elements.refreshButton.textContent = isLoading ? "Refreshing" : "Refresh";
}

function setGitLoading(isLoading) {
  elements.gitButton.disabled = isLoading;
  elements.gitButton.textContent = isLoading ? "Refreshing" : "Refresh";
  if (isLoading) {
    elements.gitRepoText.textContent = "Checking";
  }
}

function setGitCommitLoading(isLoading) {
  elements.gitCommitPreflightButton.disabled = isLoading;
  elements.gitCommitPreflightButton.textContent = isLoading ? "Checking" : "Preflight";
  if (isLoading) {
    elements.gitCommitButton.disabled = true;
  }
  if (isLoading) {
    elements.gitCommitState.textContent = "Checking commit.";
  }
}

function setGitWorktreePreflightLoading(isLoading) {
  elements.gitWorktreePreflightButton.disabled = isLoading;
  elements.gitWorktreePreflightButton.textContent = isLoading ? "Checking" : "Preflight";
  if (isLoading) {
    elements.gitWorktreeButton.disabled = true;
  }
  if (isLoading) {
    elements.gitWorktreeState.textContent = "Checking worktree action.";
  }
}

function setAgentLoading(isLoading) {
  if (isLoading) {
    elements.agentButton.disabled = true;
    elements.agentButton.textContent = "Running";
    elements.agentStatusText.textContent = "Running";
    return;
  }
  const enabled = elements.agentGateText.textContent === "Enabled";
  elements.agentButton.disabled = !enabled;
  elements.agentButton.textContent = "Run probe";
}

function setTurnPreflightLoading(isLoading) {
  elements.turnButton.disabled = isLoading || !selectedThreadIdSuffix;
  elements.turnStartButton.disabled = isLoading || !selectedThreadIdSuffix;
  elements.turnButton.textContent = isLoading ? "Checking" : "Preflight";
  if (isLoading) {
    elements.turnPreflightStatus.textContent = "Checking";
  }
}

function setThreadStartLoading(isLoading) {
  elements.threadStartPreflightButton.disabled = isLoading;
  elements.threadStartButton.disabled = isLoading || !lastThreadStartPreflight?.token;
  elements.threadStartPreflightButton.textContent = isLoading ? "Checking" : "Preflight";
  if (isLoading) {
    elements.threadStartStatus.textContent = "Checking";
  }
}

function setThreadArchiveLoading(isLoading) {
  elements.threadArchivePreflightButton.disabled = isLoading || !selectedThreadIdSuffix;
  elements.threadArchiveButton.disabled =
    isLoading || !lastThreadArchivePreflight?.token || lastThreadArchivePreflight.enabled !== true;
  elements.threadArchivePreflightButton.textContent = isLoading ? "Checking" : "Preflight";
  if (isLoading) {
    elements.threadArchiveStatus.textContent = "Checking";
  }
}

function setThreadForkLoading(isLoading) {
  elements.threadForkPreflightButton.disabled = isLoading || !selectedThreadIdSuffix;
  elements.threadForkButton.disabled =
    isLoading || !lastThreadForkPreflight?.token || lastThreadForkPreflight.enabled !== true;
  elements.threadForkPreflightButton.textContent = isLoading ? "Checking" : "Fork Check";
  if (isLoading) {
    elements.threadForkStatus.textContent = "Checking";
  }
}

function setThreadRenameLoading(isLoading) {
  const hasThread = Boolean(selectedThreadIdSuffix);
  const hasName = elements.threadRenameInput.value.trim().length > 0;
  elements.threadRenameInput.disabled = isLoading || !hasThread;
  elements.threadRenamePreflightButton.disabled = isLoading || !hasThread || !hasName;
  elements.threadRenameButton.disabled =
    isLoading || !lastThreadRenamePreflight?.token || lastThreadRenamePreflight.enabled !== true;
  elements.threadRenamePreflightButton.textContent = isLoading ? "Checking" : "Rename Check";
  if (isLoading) {
    elements.threadRenameStatus.textContent = "Checking";
  }
}

function setThreadGoalSetLoading(isLoading) {
  const hasThread = Boolean(selectedThreadIdSuffix);
  const hasObjective = elements.threadGoalObjectiveInput.value.trim().length > 0;
  elements.threadGoalObjectiveInput.disabled = isLoading || !hasThread;
  elements.threadGoalStatusSelect.disabled = isLoading || !hasThread;
  elements.threadGoalBudgetInput.disabled = isLoading || !hasThread;
  elements.threadGoalSetPreflightButton.disabled = isLoading || !hasThread || !hasObjective;
  elements.threadGoalSetButton.disabled =
    isLoading || !lastThreadGoalSetPreflight?.token || lastThreadGoalSetPreflight.enabled !== true;
  elements.threadGoalSetPreflightButton.textContent = isLoading ? "Checking" : "Goal Set Check";
  if (isLoading) {
    elements.threadGoalMutationStatus.textContent = "Checking goal set";
  }
}

function setThreadGoalClearLoading(isLoading) {
  const hasThread = Boolean(selectedThreadIdSuffix);
  elements.threadGoalClearPreflightButton.disabled = isLoading || !hasThread;
  elements.threadGoalClearButton.disabled =
    isLoading ||
    !lastThreadGoalClearPreflight?.token ||
    lastThreadGoalClearPreflight.enabled !== true;
  elements.threadGoalClearPreflightButton.textContent = isLoading
    ? "Checking"
    : "Goal Clear Check";
  if (isLoading) {
    elements.threadGoalMutationStatus.textContent = "Checking goal clear";
  }
}

function setThreadMemoryModeLoading(isLoading) {
  const hasThread = Boolean(selectedThreadIdSuffix);
  elements.threadMemoryModeSelect.disabled = isLoading || !hasThread;
  elements.threadMemoryModePreflightButton.disabled = isLoading || !hasThread;
  elements.threadMemoryModeButton.disabled =
    isLoading ||
    !lastThreadMemoryModePreflight?.token ||
    lastThreadMemoryModePreflight.enabled !== true;
  elements.threadMemoryModePreflightButton.textContent = isLoading ? "Checking" : "Memory Check";
  if (isLoading) {
    elements.threadMemoryModeStatus.textContent = "Checking memory mode";
  }
}

function setThreadMetadataUpdateLoading(isLoading) {
  const hasThread = Boolean(selectedThreadIdSuffix);
  elements.threadMetadataArgumentsInput.disabled = isLoading || !hasThread;
  elements.threadMetadataUpdatePreflightButton.disabled = isLoading || !hasThread;
  elements.threadMetadataUpdatePreflightButton.textContent = isLoading
    ? "Checking"
    : "Metadata Check";
  if (isLoading) {
    elements.threadMetadataUpdateStatus.textContent = "Checking metadata";
  }
}

function setThreadResumeInjectLoading(isLoading) {
  const hasThread = Boolean(selectedThreadIdSuffix);
  elements.threadResumeInjectMethodSelect.disabled = isLoading || !hasThread;
  elements.threadResumeInjectArgumentsInput.disabled = isLoading || !hasThread;
  elements.threadResumeInjectPreflightButton.disabled = isLoading || !hasThread;
  elements.threadResumeInjectPreflightButton.textContent = isLoading ? "Checking" : "Resume Check";
  if (isLoading) {
    elements.threadResumeInjectStatus.textContent = "Checking resume/inject";
  }
}

function setThreadRealtimeLoading(isLoading) {
  const hasThread = Boolean(selectedThreadIdSuffix);
  elements.threadRealtimeMethodSelect.disabled = isLoading || !hasThread;
  elements.threadRealtimeArgumentsInput.disabled = isLoading || !hasThread;
  elements.threadRealtimePreflightButton.disabled = isLoading || !hasThread;
  elements.threadRealtimePreflightButton.textContent = isLoading ? "Checking" : "Realtime Check";
  if (isLoading) {
    elements.threadRealtimeStatus.textContent = "Checking realtime";
  }
}

function setThreadGuardianLoading(isLoading) {
  const hasThread = Boolean(selectedThreadIdSuffix);
  elements.threadGuardianMethodSelect.disabled = isLoading || !hasThread;
  elements.threadGuardianArgumentsInput.disabled = isLoading || !hasThread;
  elements.threadGuardianPreflightButton.disabled = isLoading || !hasThread;
  elements.threadGuardianPreflightButton.textContent = isLoading ? "Checking" : "Guardian Check";
  if (isLoading) {
    elements.threadGuardianStatus.textContent = "Checking guardian";
  }
}

function setThreadDeleteLoading(isLoading) {
  elements.threadDeletePreflightButton.disabled = isLoading || !selectedThreadIdSuffix;
  elements.threadDeleteButton.disabled =
    isLoading || !lastThreadDeletePreflight?.token || lastThreadDeletePreflight.enabled !== true;
  elements.threadDeletePreflightButton.textContent = isLoading ? "Checking" : "Delete Check";
  if (isLoading) {
    elements.threadDeleteStatus.textContent = "Checking";
  }
}

function setThreadRollbackLoading(isLoading) {
  const hasThread = Boolean(selectedThreadIdSuffix);
  const numTurns = Number(elements.threadRollbackTurnsInput.value);
  const hasValidTurns = Number.isSafeInteger(numTurns) && numTurns >= 1 && numTurns <= 50;
  elements.threadRollbackTurnsInput.disabled = isLoading || !hasThread;
  elements.threadRollbackPreflightButton.disabled = isLoading || !hasThread || !hasValidTurns;
  elements.threadRollbackButton.disabled =
    isLoading ||
    !lastThreadRollbackPreflight?.token ||
    lastThreadRollbackPreflight.enabled !== true;
  elements.threadRollbackPreflightButton.textContent = isLoading ? "Checking" : "Rollback Check";
  if (isLoading) {
    elements.threadRollbackStatus.textContent = "Checking";
  }
}

function setThreadSafetyLockLoading(isLoading) {
  const hasThread = Boolean(selectedThreadIdSuffix);
  elements.threadSafetyLockPreflightButton.disabled = isLoading || !hasThread;
  elements.threadSafetyLockButton.disabled =
    isLoading ||
    !lastThreadSafetyLockPreflight?.token ||
    lastThreadSafetyLockPreflight.enabled !== true;
  elements.threadSafetyLockPreflightButton.textContent = isLoading ? "Checking" : "Safety Check";
  if (isLoading) {
    elements.threadSafetyLockStatus.textContent = "Checking";
  }
}

function setThreadCompactLoading(isLoading) {
  const hasActiveThread = Boolean(selectedThreadIdSuffix) && !selectedThreadArchived;
  elements.threadCompactPreflightButton.disabled = isLoading || !hasActiveThread;
  elements.threadCompactButton.disabled =
    isLoading || !lastThreadCompactPreflight?.token || lastThreadCompactPreflight.enabled !== true;
  elements.threadCompactPreflightButton.textContent = isLoading ? "Checking" : "Compact Check";
  if (isLoading) {
    elements.threadCompactStatus.textContent = "Checking";
  }
}

function setTranscriptLoading(isLoading) {
  elements.transcriptButton.disabled = isLoading || !selectedThreadIdSuffix;
  elements.transcriptButton.textContent = isLoading ? "Loading" : "Load";
  if (isLoading) {
    elements.transcriptStateText.textContent = "Loading";
  }
}

function setChangesLoading(isLoading) {
  elements.changesButton.disabled = isLoading || !selectedThreadIdSuffix;
  elements.changesButton.textContent = isLoading ? "Loading" : "Load";
  if (isLoading) {
    elements.changesStateText.textContent = "Loading";
  }
}

function setTurnStartLoading(isLoading) {
  elements.turnButton.disabled = isLoading || !selectedThreadIdSuffix;
  elements.turnStartButton.disabled = isLoading || !selectedThreadIdSuffix;
  elements.turnStartButton.textContent = isLoading ? "Starting" : "Start";
  if (isLoading) {
    elements.turnPreflightStatus.textContent = "Checking start";
  }
}

function setStreamState(status, active) {
  elements.streamStatusText.textContent = status;
  elements.streamButton.textContent = active ? "Stop" : "Listen";
}

function setLiveSessionControlLoading(isLoading) {
  elements.liveSessionControlPreflightButton.disabled = isLoading;
  elements.liveSessionControlButton.disabled =
    isLoading || !lastLiveSessionControlPreflight?.token;
  elements.liveSessionControlPreflightButton.textContent = isLoading ? "Checking" : "Preflight";
  if (isLoading) {
    elements.liveSessionControlStatus.textContent = "Checking";
  }
}

function setLiveSessionBulkLoading(isLoading) {
  elements.liveSessionBulkPreflightButton.disabled = isLoading;
  elements.liveSessionBulkButton.disabled = isLoading || !lastLiveSessionBulkPreflight?.token;
  elements.liveSessionBulkPreflightButton.textContent = isLoading ? "Checking" : "Bulk Check";
  if (isLoading) {
    elements.liveSessionBulkStatus.textContent = "Checking";
  }
}

function setTerminalPreflightLoading(isLoading) {
  elements.terminalPreflightButton.disabled = isLoading;
  elements.terminalCommandButton.disabled = isLoading || !lastTerminalCommandPreflight?.token;
  elements.terminalPreflightButton.textContent = isLoading ? "Checking" : "Preflight";
  if (isLoading) {
    elements.terminalPreflightStatus.textContent = "Checking";
  }
}

function setProcessSpawnLoading(isLoading) {
  elements.processSpawnPreflightButton.disabled = isLoading;
  elements.processSpawnButton.disabled = isLoading || !lastProcessSpawnPreflight?.token;
  elements.processSpawnPreflightButton.textContent = isLoading ? "Checking" : "Process Check";
  if (isLoading) {
    elements.processSpawnStatus.textContent = "Checking";
  }
}

function setThreadShellCommandLoading(isLoading) {
  elements.threadShellCommandPreflightButton.disabled = isLoading;
  elements.threadShellCommandButton.disabled =
    isLoading ||
    !lastThreadShellCommandPreflight?.token ||
    lastThreadShellCommandPreflight.enabled !== true;
  elements.threadShellCommandPreflightButton.textContent = isLoading ? "Checking" : "Shell Check";
  if (isLoading) {
    elements.threadShellCommandStatus.textContent = "Checking";
  }
}

function setTerminalControlLoading(isLoading) {
  elements.terminalControlButton.disabled = isLoading;
  elements.terminalControlRunButton.disabled = isLoading || !lastTerminalControlPreflight?.token;
  elements.terminalControlButton.textContent = isLoading ? "Checking" : "Preflight";
  if (isLoading) {
    elements.terminalControlStatus.textContent = "Checking";
  }
}

function setTerminalCleanLoading(isLoading) {
  elements.terminalCleanPreflightButton.disabled = isLoading;
  elements.terminalCleanButton.disabled =
    isLoading || !lastTerminalCleanPreflight?.token;
  elements.terminalCleanPreflightButton.textContent = isLoading ? "Checking" : "Preflight";
  if (isLoading) {
    elements.terminalCleanStatus.textContent = "Checking";
  }
}

function setTerminalBackgroundListLoading(isLoading) {
  elements.terminalBackgroundListButton.disabled = isLoading;
  elements.terminalBackgroundTerminatePreflightButton.disabled =
    isLoading || !selectedTerminalBackgroundRef;
  elements.terminalBackgroundTerminateButton.disabled =
    isLoading || !lastTerminalBackgroundTerminatePreflight?.token;
  elements.terminalBackgroundListButton.textContent = isLoading ? "Listing" : "List";
  if (isLoading) {
    elements.terminalBackgroundListStatus.textContent = "Listing";
  }
}

function setTerminalBackgroundTerminatePreflightLoading(isLoading) {
  elements.terminalBackgroundTerminatePreflightButton.disabled =
    isLoading || !selectedTerminalBackgroundRef;
  elements.terminalBackgroundTerminateButton.disabled =
    isLoading || !lastTerminalBackgroundTerminatePreflight?.token;
  elements.terminalBackgroundTerminatePreflightButton.textContent = isLoading
    ? "Checking"
    : "Terminate Check";
  if (isLoading) {
    elements.terminalBackgroundListStatus.textContent = "Checking";
  }
}

function setFsReadFileLoading(isLoading) {
  elements.fsReadFileButton.disabled = isLoading;
  elements.fsReadFileButton.textContent = isLoading ? "Checking" : "Read Check";
  if (isLoading) {
    elements.fsReadFileStatus.textContent = "Checking";
  }
}

function setFsWatchLoading(isLoading) {
  elements.fsWatchButton.disabled = isLoading;
  elements.fsWatchMethod.disabled = isLoading;
  elements.fsWatchButton.textContent = isLoading ? "Checking" : "Watch Check";
  if (isLoading) {
    elements.fsWatchStatus.textContent = "Checking";
  }
}

function setFuzzyFileSearchLoading(isLoading) {
  elements.fuzzyFileSearchButton.disabled = isLoading;
  elements.fuzzyFileSearchMethod.disabled = isLoading;
  elements.fuzzyFileSearchButton.textContent = isLoading ? "Checking" : "Search Check";
  if (isLoading) {
    elements.fuzzyFileSearchStatus.textContent = "Checking";
  }
}

function setFileActionLoading(isLoading) {
  elements.fileActionPreflightButton.disabled = isLoading;
  elements.fileActionPreflightButton.textContent = isLoading ? "Checking" : "Preflight";
  if (isLoading) {
    elements.fileActionButton.disabled = true;
  }
  if (isLoading) {
    elements.fileActionStatus.textContent = "Checking";
  }
}

function setMcpToolLoading(isLoading) {
  elements.mcpToolButton.disabled = isLoading;
  elements.mcpToolRunButton.disabled =
    isLoading || !lastMcpToolPreflight?.token || lastMcpToolPreflight.enabled !== true;
  elements.mcpToolButton.textContent = isLoading ? "Checking" : "Preflight";
  if (isLoading) {
    elements.mcpToolStatus.textContent = "Checking";
  }
}

function setMcpResourceLoading(isLoading) {
  elements.mcpResourceButton.disabled = isLoading;
  elements.mcpResourceRunButton.disabled =
    isLoading || !lastMcpResourcePreflight?.token || lastMcpResourcePreflight.enabled !== true;
  elements.mcpResourceButton.textContent = isLoading ? "Checking" : "Resource Check";
  if (isLoading) {
    elements.mcpResourceStatus.textContent = "Checking";
  }
}

function setPluginReadLoading(isLoading) {
  elements.pluginReadButton.disabled = isLoading;
  elements.pluginReadRunButton.disabled =
    isLoading || !lastPluginReadPreflight?.token || lastPluginReadPreflight.enabled !== true;
  elements.pluginReadButton.textContent = isLoading ? "Checking" : "Plugin Read Check";
  if (isLoading) {
    elements.pluginReadStatus.textContent = "Checking";
  }
}

function setPluginInstallLoading(isLoading) {
  elements.pluginInstallButton.disabled = isLoading;
  elements.pluginInstallButton.textContent = isLoading ? "Checking" : "Install Check";
  if (isLoading) {
    elements.pluginInstallStatus.textContent = "Checking";
  }
}

function setMarketplaceActionLoading(isLoading) {
  elements.marketplaceActionButton.disabled = isLoading;
  elements.marketplaceActionButton.textContent = isLoading ? "Checking" : "Marketplace Check";
  if (isLoading) {
    elements.marketplaceActionStatus.textContent = "Checking";
  }
}

function setPluginUninstallLoading(isLoading) {
  elements.pluginUninstallButton.disabled = isLoading;
  elements.pluginUninstallRunButton.disabled =
    isLoading ||
    !lastPluginUninstallPreflight?.token ||
    lastPluginUninstallPreflight.enabled !== true;
  elements.pluginUninstallButton.textContent = isLoading ? "Checking" : "Uninstall Check";
  if (isLoading) {
    elements.pluginUninstallStatus.textContent = "Checking";
  }
}

function setPluginEnablementLoading(isLoading) {
  elements.pluginEnablementButton.disabled = isLoading;
  elements.pluginEnablementRunButton.disabled =
    isLoading ||
    !lastPluginEnablementPreflight?.token ||
    lastPluginEnablementPreflight.enabled !== true;
  elements.pluginEnablementButton.textContent = isLoading ? "Checking" : "Enablement Check";
  if (isLoading) {
    elements.pluginEnablementStatus.textContent = "Checking";
  }
}

function setPluginShareCheckoutLoading(isLoading) {
  elements.pluginShareCheckoutButton.disabled = isLoading;
  elements.pluginShareCheckoutRunButton.disabled =
    isLoading ||
    !lastPluginShareCheckoutPreflight?.token ||
    lastPluginShareCheckoutPreflight.enabled !== true;
  elements.pluginShareCheckoutButton.textContent = isLoading ? "Checking" : "Checkout Check";
  if (isLoading) {
    elements.pluginShareCheckoutStatus.textContent = "Checking";
  }
}

function setPluginShareActionLoading(isLoading) {
  elements.pluginShareActionButton.disabled = isLoading;
  elements.pluginShareActionButton.textContent = isLoading ? "Checking" : "Share Check";
  if (isLoading) {
    elements.pluginShareActionStatus.textContent = "Checking";
  }
}

function setPluginContentLoading(isLoading) {
  elements.pluginContentButton.disabled = isLoading;
  elements.pluginContentRunButton.disabled =
    isLoading || !lastPluginContentPreflight?.token || lastPluginContentPreflight.enabled !== true;
  elements.pluginContentButton.textContent = isLoading ? "Checking" : "Plugin Content Check";
  if (isLoading) {
    elements.pluginContentStatus.textContent = "Checking";
  }
}

function setSkillsConfigLoading(isLoading) {
  elements.skillsConfigButton.disabled = isLoading;
  elements.skillsConfigRunButton.disabled =
    isLoading || !lastSkillsConfigPreflight?.token || lastSkillsConfigPreflight.enabled !== true;
  elements.skillsConfigButton.textContent = isLoading ? "Checking" : "Skills Config Check";
  if (isLoading) {
    elements.skillsConfigStatus.textContent = "Checking";
  }
}

function setSkillsExtraRootsClearLoading(isLoading) {
  elements.skillsExtraRootsClearPreflightButton.disabled = isLoading;
  elements.skillsExtraRootsClearButton.disabled =
    isLoading ||
    !lastSkillsExtraRootsClearPreflight?.token ||
    lastSkillsExtraRootsClearPreflight.enabled !== true;
  elements.skillsExtraRootsClearPreflightButton.textContent = isLoading
    ? "Checking"
    : "Extra Roots Check";
  if (isLoading) {
    elements.skillsExtraRootsClearStatus.textContent = "Checking";
  }
}

function setRemoteControlDisableLoading(isLoading) {
  elements.remoteControlDisablePreflightButton.disabled = isLoading;
  elements.remoteControlDisableButton.disabled =
    isLoading ||
    !lastRemoteControlDisablePreflight?.token ||
    lastRemoteControlDisablePreflight.enabled !== true;
  elements.remoteControlDisablePreflightButton.textContent = isLoading
    ? "Checking"
    : "Remote Disable Check";
  if (isLoading) {
    elements.remoteControlDisableStatus.textContent = "Checking";
  }
}

function setRemoteControlEnableLoading(isLoading) {
  elements.remoteControlEnablePreflightButton.disabled = isLoading;
  elements.remoteControlEnablePreflightButton.textContent = isLoading
    ? "Checking"
    : "Remote Enable Check";
  if (isLoading) {
    elements.remoteControlEnableStatus.textContent = "Checking";
  }
}

function setRemoteControlPairingLoading(isLoading) {
  elements.remoteControlPairingPreflightButton.disabled = isLoading;
  elements.remoteControlPairingMethodSelect.disabled = isLoading;
  elements.remoteControlPairingPreflightButton.textContent = isLoading
    ? "Checking"
    : "Pairing Check";
  if (isLoading) {
    elements.remoteControlPairingStatus.textContent = "Checking";
  }
}

function setRemoteControlClientsLoading(isLoading) {
  elements.remoteClientsListButton.disabled = isLoading;
  elements.remoteClientSelect.disabled = isLoading || remoteClientRefs.length === 0;
  elements.remoteClientRevokePreflightButton.disabled = isLoading || !selectedRemoteClientRef;
  elements.remoteClientRevokeButton.disabled =
    isLoading ||
    !lastRemoteClientRevokePreflight?.token ||
    lastRemoteClientRevokePreflight.enabled !== true;
  elements.remoteClientsListButton.textContent = isLoading ? "Listing" : "List Remote Clients";
  if (isLoading) {
    elements.remoteClientsStatus.textContent = "Checking";
  }
}

function setRemoteControlClientRevokeLoading(isLoading) {
  elements.remoteClientRevokePreflightButton.disabled = isLoading || !selectedRemoteClientRef;
  elements.remoteClientRevokeButton.disabled =
    isLoading ||
    !lastRemoteClientRevokePreflight?.token ||
    lastRemoteClientRevokePreflight.enabled !== true;
  elements.remoteClientRevokePreflightButton.textContent = isLoading
    ? "Checking"
    : "Revoke Check";
  if (isLoading) {
    elements.remoteClientsStatus.textContent = "Checking";
  }
}

function setEnvironmentAddLoading(isLoading) {
  elements.environmentAddButton.disabled = isLoading;
  elements.environmentAddRunButton.disabled =
    isLoading || !lastEnvironmentAddPreflight?.token || lastEnvironmentAddPreflight.enabled !== true;
  elements.environmentAddButton.textContent = isLoading ? "Checking" : "Environment Check";
  if (isLoading) {
    elements.environmentAddStatus.textContent = "Checking";
  }
}

function setConfigValueLoading(isLoading) {
  elements.configValueButton.disabled = isLoading;
  elements.configValueRunButton.disabled =
    isLoading || !lastConfigValuePreflight?.token || lastConfigValuePreflight.enabled !== true;
  elements.configValueButton.textContent = isLoading ? "Checking" : "Config Check";
  if (isLoading) {
    elements.configValueStatus.textContent = "Checking";
  }
}

function setConfigBatchLoading(isLoading) {
  elements.configBatchButton.disabled = isLoading;
  elements.configBatchRunButton.disabled =
    isLoading || !lastConfigBatchPreflight?.token || lastConfigBatchPreflight.enabled !== true;
  elements.configBatchButton.textContent = isLoading ? "Checking" : "Batch Check";
  if (isLoading) {
    elements.configBatchStatus.textContent = "Checking";
  }
}

function setExperimentalFeatureLoading(isLoading) {
  elements.experimentalFeatureButton.disabled = isLoading;
  elements.experimentalFeatureRunButton.disabled =
    isLoading ||
    !lastExperimentalFeaturePreflight?.token ||
    lastExperimentalFeaturePreflight.enabled !== true;
  elements.experimentalFeatureButton.textContent = isLoading ? "Checking" : "Feature Check";
  if (isLoading) {
    elements.experimentalFeatureStatus.textContent = "Checking";
  }
}

function setIntegrationActionLoading(isLoading) {
  elements.integrationActionButton.disabled = isLoading;
  elements.integrationActionButton.textContent = isLoading ? "Checking" : "Preflight";
  if (isLoading) {
    elements.integrationActionStatus.textContent = "Checking";
  }
}

function setExternalConfigImportLoading(isLoading) {
  elements.externalConfigImportButton.disabled = isLoading;
  elements.externalConfigImportButton.textContent = isLoading ? "Checking" : "Import Check";
  if (isLoading) {
    elements.externalConfigImportStatus.textContent = "Checking";
  }
}

function setReviewFeedbackLoading(isLoading) {
  elements.reviewFeedbackButton.disabled = isLoading;
  elements.reviewFeedbackButton.textContent = isLoading ? "Checking" : "Review/Feedback Check";
  if (isLoading) {
    elements.reviewFeedbackStatus.textContent = "Checking";
  }
}

function setMemoryResetLoading(isLoading) {
  elements.memoryResetPreflightButton.disabled = isLoading;
  elements.memoryResetPreflightButton.textContent = isLoading ? "Checking" : "Memory Reset Check";
  if (isLoading) {
    elements.memoryResetStatus.textContent = "Checking";
  }
}

function setAccountLoginLoading(isLoading) {
  elements.accountLoginPreflightButton.disabled = isLoading;
  elements.accountLoginButton.disabled =
    isLoading || !lastAccountLoginPreflight?.token || lastAccountLoginPreflight.enabled !== true;
  elements.accountLoginCancelPreflightButton.disabled = isLoading || !lastAccountLoginCancelRef;
  elements.accountLoginCancelButton.disabled =
    isLoading ||
    !lastAccountLoginCancelPreflight?.token ||
    lastAccountLoginCancelPreflight.enabled !== true;
  elements.accountLoginPreflightButton.textContent = isLoading ? "Checking" : "Login Check";
  if (isLoading) {
    elements.accountLoginStatus.textContent = "Checking";
  }
}

function setAccountLoginCancelLoading(isLoading) {
  elements.accountLoginCancelPreflightButton.disabled = isLoading || !lastAccountLoginCancelRef;
  elements.accountLoginCancelButton.disabled =
    isLoading ||
    !lastAccountLoginCancelPreflight?.token ||
    lastAccountLoginCancelPreflight.enabled !== true;
  elements.accountLoginCancelPreflightButton.textContent = isLoading ? "Checking" : "Cancel Check";
  if (isLoading) {
    elements.accountLoginCancelStatus.textContent = "Checking";
  }
}

function setAccountResetCreditLoading(isLoading) {
  elements.accountResetCreditPreflightButton.disabled = isLoading;
  elements.accountResetCreditButton.disabled =
    isLoading ||
    !lastAccountResetCreditPreflight?.token ||
    lastAccountResetCreditPreflight.enabled !== true;
  elements.accountResetCreditPreflightButton.textContent = isLoading ? "Checking" : "Reset Check";
  if (isLoading) {
    elements.accountResetCreditStatus.textContent = "Checking";
  }
}

function setAccountLogoutLoading(isLoading) {
  elements.accountLogoutPreflightButton.disabled = isLoading;
  elements.accountLogoutButton.disabled =
    isLoading || !lastAccountLogoutPreflight?.token || lastAccountLogoutPreflight.enabled !== true;
  elements.accountLogoutPreflightButton.textContent = isLoading ? "Checking" : "Logout Check";
  if (isLoading) {
    elements.accountLogoutStatus.textContent = "Checking";
  }
}

function setMcpServerReloadLoading(isLoading) {
  elements.mcpServerReloadPreflightButton.disabled = isLoading;
  elements.mcpServerReloadButton.disabled =
    isLoading ||
    !lastMcpServerReloadPreflight?.token ||
    lastMcpServerReloadPreflight.enabled !== true;
  elements.mcpServerReloadPreflightButton.textContent = isLoading ? "Checking" : "Reload Check";
  if (isLoading) {
    elements.mcpServerReloadStatus.textContent = "Checking";
  }
}

function setMcpOauthLoading(isLoading) {
  elements.mcpOauthButton.disabled = isLoading;
  elements.mcpOauthRunButton.disabled =
    isLoading || !lastMcpOauthPreflight?.token || lastMcpOauthPreflight.enabled !== true;
  elements.mcpOauthButton.textContent = isLoading ? "Checking" : "OAuth Check";
  if (isLoading) {
    elements.mcpOauthStatus.textContent = "Checking";
  }
}

function formatValue(value) {
  if (value == null) return "Unset";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function joinParts(parts) {
  return parts.filter(Boolean).join(" / ") || "-";
}

function statusLabel(status) {
  if (!status) return "unknown";
  if (typeof status === "string") return status;
  if (typeof status.type === "string") return status.type;
  return "unknown";
}

function formatTime(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

function formatUnix(value) {
  if (!Number.isFinite(value)) return "-";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value * 1000));
}

# Graph Report - ClavisPass  (2026-11-09)

## Corpus Check
- 601 files · ~370,028 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 37 file(s) not represented in the graph (top: .xml 11, (none) 8, .properties 2)

## Summary
- 4073 nodes · 11457 edges · 193 communities (145 shown, 48 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 178 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8a7e4325`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- vaultRecovery.ts
- dependencies
- ModulesEnum
- RecoveryCodesModule.tsx
- package.json
- AnimatedLogo.tsx
- useSetting
- bitwarden.ts
- HomeScreen.tsx
- AnalysisScreen.tsx
- IdentitiesScreen.tsx
- content/index.ts
- shared/types.ts
- popup/App.tsx
- ListItem.tsx
- background/index.ts
- shared/bridge.ts
- mapKdbxToClavisPass.ts
- vitest
- detectTauriEnvironment
- mergeVaultData.ts
- expo
- ClavisPassHubClient.ts
- UpdateManager.tsx
- write.rs
- scripts
- distribution.ts
- manifest.json
- FastAccessPositionPicker.tsx
- forms.ts
- lib.rs
- ClavisPass Native Messaging Bridge
- SettingsScreen.tsx
- CustomBottomTab.tsx
- commands.rs
- logger.ts
- DeviceStorageClient.ts
- state.ts
- ModuleReorderScreen.tsx
- AttachmentModule.tsx
- ClavisPass Passkey Management Roadmap
- host.rs
- vault.rs
- release.js
- VaultProvider.tsx
- isTauri.ts
- ClavisPass Website Marketing Brief
- BrowserExtensionsScreen.tsx
- pairing.rs
- appScheme.test.ts
- Idee: Identity als persönlicher Hauptscreen
- Login.tsx
- ThemeProvider.tsx
- vite.config.ts
- devDependencies
- prepare-msix.js
- totp.ts
- ClavisPass
- AuthProvider.tsx
- useTheme
- compilerOptions
- mobileUpdater.ts
- webauthn.rs
- NavigationContainer.tsx
- reactNativePaper.tsx
- MainApplication.kt
- Vault V2 Key Envelope Roadmap
- model/types.ts
- Datenschutzerklärung
- autofill-preferences.ts
- Privacy Policy
- protocol.rs
- Nutzungsbedingungen
- prepare-native-host-sidecar.js
- BrowserBridgeWriteSync.tsx
- MainActivity.kt
- session.rs
- scripts
- AddModuleModal.tsx
- App.tsx
- hotkeys.ts
- bridge_commands.rs
- Terms Of Use
- UI Context
- Header
- check-tauri-version-sync.js
- prepare-sodium-16kb.js
- ClavisPass Product Strategy Roadmap
- generatePassword.ts
- bundle
- getModuleData
- deriveIdentityClusters.ts
- triggerGlobalError
- AppearanceSettingsSection.tsx
- tauri.conf.json
- withAndroidApplicationId.js
- build-web-demo.js
- ref_react
- plugins
- editHistory.ts
- ValueIconsEnum
- CloudStorageClient.ts
- complete_request
- reactNative.ts
- reactNativeReanimated.tsx
- reactNavigationNative.ts
- devDependencies
- compilerOptions
- GoogleDriveLoginButtonContent
- tsconfig.json
- Store Release Roadmap
- native_host_registration.rs
- CloudProvider.tsx
- container/AnimatedOpacityContainer.tsx
- domain.ts
- serve-webauthn-test-page.js
- store.ts
- macOS
- windows
- gorhomBottomSheet.tsx
- WifiTypeEnum
- build
- vite-env.d.ts
- NoteModule.tsx
- GoogleDriveClient.ts
- BridgeStatusBadge.tsx
- Modal
- linux
- asyncStorage.ts
- react-native
- tokens.ts
- env.d.ts
- DROPBOX_CLIENT_ID
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_ID_ANDROID
- GOOGLE_CLIENT_ID_DESKTOP
- GOOGLE_CLIENT_ID_IOS
- GOOGLE_CLIENT_SECRET_DESKTOP
- ClavisPass
- withIosGoogleOAuthScheme.js
- browser-extension/package.json
- ref_fs
- ExpiryNotificationScheduler.tsx
- Firefox Store Release Notes
- generate-webauthn-test-passkey.js
- ClavisPass Firefox Add-on Reviewer Build
- DevicesScreen.tsx
- Bitwarden Import Roadmap
- Agent Workflow Context
- Build, Release, And Update Context
- Identity Context
- Vault Modules Context
- Desktop And Tauri Context
- CLAUDE.md
- .claude/CLAUDE.md
- GlobalClipboardSnackbar.tsx
- Sync And Storage Context
- errorBus.ts
- SettingsQuickSelect.tsx
- dependencies
- Crypto Context
- DarkModeSwitch.tsx
- RemoteFileContent.ts
- CardDetailsScreen.tsx
- ClavisPassHubDiscoveryResult.ts
- GlassAppearanceSettings.tsx
- BrandHeader.tsx
- InlineNotice.tsx
- DropdownLayer.web.tsx
- expoVectorIcons.tsx

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 283 edges
2. `react-native` - 190 edges
3. `react-native-paper` - 135 edges
4. `ModulesEnum` - 118 edges
5. `react-i18next` - 107 edges
6. `detectTauriEnvironment()` - 80 edges
7. `AnimatedPressable` - 80 edges
8. `Modal()` - 61 edges
9. `useVault()` - 57 edges
10. `SettingsScreen()` - 57 edges

## Surprising Connections (you probably didn't know these)
- `Master Password Lifetime` --references--> `AuthProvider()`  [INFERRED]
  docs/context/security.md → src/app/providers/AuthProvider.tsx
- `Implementation` --references--> `AuthProvider()`  [INFERRED]
  README.md → src/app/providers/AuthProvider.tsx
- `Tokens` --references--> `CloudProvider()`  [INFERRED]
  docs/context/sync-storage.md → src/app/providers/CloudProvider.tsx
- `Current Visual Direction` --references--> `ThemeProvider()`  [INFERRED]
  docs/context/ui-patterns.md → src/app/providers/ThemeProvider.tsx
- `Edge verification` --references--> `getStatus()`  [INFERRED]
  docs/browser-extension/native-messaging.md → src/features/vault/utils/expiry.ts

## Import Cycles
- None detected.

## Communities (193 total, 48 thin omitted)

### Community 0 - "vaultRecovery.ts"
Cohesion: 0.05
Nodes (73): base64-js, react-native-sodium-jsi, VaultDataType, VaultDataTypeSchema, VaultEntryTombstoneSchema, getEmptyData(), createVaultId(), ensureVaultId() (+65 more)

### Community 1 - "dependencies"
Cohesion: 0.02
Nodes (105): dependencies, argon2-browser, @babel/plugin-proposal-export-namespace-from, base64-js, crypto-js, expo, expo-auth-session, expo-blur (+97 more)

### Community 2 - "ModulesEnum"
Cohesion: 0.03
Nodes (106): Shared Module UI, zod, EditRowControlsContainer(), TaskModule(), DIGITAL_CARD_TYPES, AddressModuleType, AddressModuleTypeSchema, regex (+98 more)

### Community 3 - "RecoveryCodesModule.tsx"
Cohesion: 0.21
Nodes (11): FastAccessType, FastAccessTypeSchema, RecoveryCodesModule(), splitKeepingRemainder(), styles, tokenize(), Props, QuickSelect() (+3 more)

### Community 4 - "package.json"
Cohesion: 0.03
Nodes (73): react, react-dom, tldts, @types/react, @types/react-dom, typescript, main, name (+65 more)

### Community 5 - "AnimatedLogo.tsx"
Cohesion: 0.21
Nodes (7): react-native-svg, AnimatedLoginVisual(), AppHeaderBrand(), AnimatedLogo(), AnimatedRect, styles, Logo()

### Community 6 - "useSetting"
Cohesion: 0.08
Nodes (32): DEFAULT_KEYS, loadSettingWithTimeout(), SettingsContext, SettingsContextValue, SettingsProvider(), SettingsState, useSetting(), suppressNextSystemAuthAutoUnlock() (+24 more)

### Community 7 - "bitwarden.ts"
Cohesion: 0.20
Nodes (24): addCardModule(), addCustomField(), addExpiryModule(), addIdentityModules(), addLoginModules(), addNote(), addPasskeyModules(), addSshKeyModule() (+16 more)

### Community 8 - "HomeScreen.tsx"
Cohesion: 0.07
Nodes (37): expo-constants, @gorhom/bottom-sheet, @shopify/flash-list, getActiveRouteName(), LeftSideTabBar(), authenticateUser(), HomeFilterMenu(), ExpiryStatus (+29 more)

### Community 9 - "AnalysisScreen.tsx"
Cohesion: 0.05
Nodes (73): expo-crypto, useAuthMaster(), FilterAnalysisModal(), Props, AnalysisFlags, AnalysisRef, CachedAnalysisItem, CacheResult (+65 more)

### Community 10 - "IdentitiesScreen.tsx"
Cohesion: 0.10
Nodes (21): Common Refactor Targets, Files To Check First, Known Custom Screens, Screen Standardization Context, Standard Checklist, Chips, Compact Search Behavior, Content Panels (+13 more)

### Community 11 - "content/index.ts"
Cohesion: 0.08
Nodes (53): applyTargets(), buildNoFieldsResult(), collectFillTargets(), emitInputEvents(), executeFill(), FillPreviewResult, FillSnapshot, FillTarget (+45 more)

### Community 12 - "shared/types.ts"
Cohesion: 0.05
Nodes (51): BackgroundHandler, BackgroundHandlerMap, BackgroundMessageContext, BackgroundMessageRouter, getActiveDomainContext(), normalizeLookupHost(), parseActiveDomain(), sanitizeHost() (+43 more)

### Community 13 - "popup/App.tsx"
Cohesion: 0.07
Nodes (40): registerContentFrame(), setupWebAuthnProbe(), App(), handleFill(), handleOpenDesktopApp(), handlePasskeyAssertion(), handlePromptResolution(), handleToggleSavePrompts() (+32 more)

### Community 14 - "ListItem.tsx"
Cohesion: 0.09
Nodes (26): Interaction Polish, Item Surfaces, react-native-gesture-handler, Pattern(), Props, extractFastAccessObject(), Props, SettingInfoButton() (+18 more)

### Community 15 - "background/index.ts"
Cohesion: 0.09
Nodes (53): clearAutofillDomainCache(), countPasswordSuggestions(), countVisibleSuggestions(), DomainAutofillCache, DomainAutofillCacheEntry, getAutofillEligibilityForUrl(), getCachedAutofillMatchCountForUrl(), getCachedMatchCount() (+45 more)

### Community 16 - "shared/bridge.ts"
Cohesion: 0.07
Nodes (49): Desktop bridge, deriveAppState(), DesktopBridgeService, getStoredPairingStatus(), normalizeAssertionCredential(), normalizeDesktopStatus(), normalizePasskeyMetadata(), normalizePasskeyRequestCandidates() (+41 more)

### Community 17 - "mapKdbxToClavisPass.ts"
Cohesion: 0.12
Nodes (24): kdbxweb, papaparse, configureKdbxArgon2(), importKdbx(), addCustomField(), addTotpModule(), addValueModule(), binaryToBytes() (+16 more)

### Community 18 - "vitest"
Cohesion: 0.28
Nodes (8): react-test-renderer, vitest, verifyKey, update, devices, renderBare(), renderWithAppProviders(), textContent()

### Community 19 - "detectTauriEnvironment"
Cohesion: 0.10
Nodes (43): @tauri-apps/api, invokeTauriSystemAuth(), FastAccessSessionBridge(), FAST_ACCESS_NOTIFICATION_CATEGORY, FAST_ACCESS_POPUP_LABEL, FAST_ACCESS_POSITION_CHANGED_EVENT, FAST_ACCESS_READY_EVENT, FAST_ACCESS_UPDATE_EVENT (+35 more)

### Community 20 - "mergeVaultData.ts"
Cohesion: 0.17
Nodes (23): VaultEntryTombstone, addLatestTombstones(), areSame(), areVaultDataEqual(), clone(), conflictCopyMatchesBaseEntry(), conflictCopyWasDeleted(), entryContentFingerprint() (+15 more)

### Community 21 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, adaptiveIcon, blockedPermissions, package, permissions, versionCode, projectId (+31 more)

### Community 22 - "ClavisPassHubClient.ts"
Cohesion: 0.12
Nodes (36): calculateExpiresIn(), checkDiscovery(), createHubError(), createHubErrorFromPayload(), DiscoveryResponse, fetchFile(), fetchUserInfo(), getConfiguredHostUrl() (+28 more)

### Community 23 - "UpdateManager.tsx"
Cohesion: 0.20
Nodes (13): expo-updates, react-native-safe-area-context, @tauri-apps/plugin-process, @tauri-apps/plugin-updater, Listener, listeners, publishUpdateCheck(), subscribeUpdateCheck() (+5 more)

### Community 24 - "write.rs"
Cohesion: 0.10
Nodes (34): as_io_error(), BrowserWriteKind, CreateEntryFromBrowser, ReservePasskeyAssertion, UpdateEntryFromBrowser, BrowserWriteRequest, BrowserWriteRequestStore, BrowserWriteResult (+26 more)

### Community 25 - "scripts"
Cohesion: 0.05
Nodes (39): scripts, android, android:build:apk, android:build:store, android:build:store-submit, android:submit:store, extension:build, extension:build:chrome (+31 more)

### Community 26 - "distribution.ts"
Cohesion: 0.31
Nodes (8): AppDistribution, getAppDistribution(), getMobileDistribution(), isStoreDistribution(), MobileDistribution, readDistributionEnv(), readMobileDistributionEnv(), shouldUseDesktopUpdater()

### Community 27 - "manifest.json"
Cohesion: 0.06
Nodes (35): action, default_icon, default_popup, default_title, background, service_worker, type, browser_specific_settings (+27 more)

### Community 28 - "FastAccessPositionPicker.tsx"
Cohesion: 0.33
Nodes (6): Corner, CornerOption(), FastAccessPosition, FastAccessPositionPicker(), Props, StoreValueMap

### Community 29 - "forms.ts"
Cohesion: 0.11
Nodes (34): setupSavePromptListener(), AutofillPlan, buildAutofillPlan(), buildDetachedContainer(), buildFieldKey(), buildFieldText(), buildFormId(), chooseBestField() (+26 more)

### Community 30 - "lib.rs"
Cohesion: 0.11
Nodes (19): clamp_window_size(), clamp_window_size_to_monitor(), DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIDTH, emit_lock_vault(), emit_vault_file_open_request(), get_requested_vault_file_path(), get_window_size_file_path() (+11 more)

### Community 31 - "ClavisPass Native Messaging Bridge"
Cohesion: 0.06
Nodes (30): Architecture, Browser loading notes, ClavisPass Browser Extension, Current feature set, Development, Important note, Working from the repo root, Chosen architecture (+22 more)

### Community 32 - "SettingsScreen.tsx"
Cohesion: 0.09
Nodes (36): simple-icons, useContentProtection(), Auth(), Props, BackupExportButton(), BackupImportButton(), ShowQRCodeButton(), ContentProtectionSettingsToggle() (+28 more)

### Community 33 - "CustomBottomTab.tsx"
Cohesion: 0.60
Nodes (4): @react-navigation/bottom-tabs, CustomBottomTab(), getActiveRouteName(), emitOpenAddValue()

### Community 34 - "commands.rs"
Cohesion: 0.05
Nodes (40): auth_reply(), AUTH_REPLY_DESCRIPTOR, AUTH_REPLY_SIGNATURE, authenticate_with_system(), authenticate_with_system_impl(), AuthReplyBlock, AuthState, _Block_copy() (+32 more)

### Community 35 - "logger.ts"
Cohesion: 0.11
Nodes (35): expo-auth-session, expo-linking, expo-random, expo-web-browser, @fabianlars/tauri-plugin-oauth, @tauri-apps/plugin-shell, useToken(), OnlineContext (+27 more)

### Community 36 - "DeviceStorageClient.ts"
Cohesion: 0.27
Nodes (16): @react-native-async-storage/async-storage, cacheSyncedVault(), fetchFile(), getActiveLocalVaultIdKey(), getLocalSyncKey(), getLocalSyncMetadataKey(), getVaultLocalSyncKey(), getVaultLocalSyncMetadataKey() (+8 more)

### Community 38 - "state.ts"
Cohesion: 0.10
Nodes (18): buildCreatePayload(), buildUpdatePayload(), resolvePromptWithDesktopWrite(), toAppliedResult(), buildPromptTitle(), ExtensionState, normalizeIdentity(), PreparedFillRecord (+10 more)

### Community 39 - "ModuleReorderScreen.tsx"
Cohesion: 0.12
Nodes (30): @hello-pangea/dnd, i18next, react-native-draggable-flatlist, NativeDragHandleScrollLockProvider(), WebDragHandlePropsProvider(), dragDropAnimationConfig, DraggableModulesList(), DraggableModulesFooter() (+22 more)

### Community 40 - "AttachmentModule.tsx"
Cohesion: 0.10
Nodes (33): expo-document-picker, expo-sharing, @tauri-apps/plugin-dialog, @tauri-apps/plugin-fs, AttachmentModule(), canPreviewAttachment(), downloadBrowserAttachment(), formatBytes() (+25 more)

### Community 41 - "ClavisPass Passkey Management Roadmap"
Cohesion: 0.18
Nodes (10): ClavisPass Passkey Management Roadmap, Core Principles, Phase 0: Architecture Decision, Phase 1: Vault Passkey Module, Phase 3: Import And Export Preparation, Phase 5: Platform Integration, Phase 6: Security, UX, And Verification, Product Scope (+2 more)

### Community 42 - "host.rs"
Cohesion: 0.13
Nodes (23): app_scheme(), AssertPasskeyPayload, bridge_result_to_response(), ensure_ready(), FillPayload, handle_request(), is_es256_algorithm(), MatchPasskeysPayload (+15 more)

### Community 43 - "vault.rs"
Cohesion: 0.11
Nodes (39): domain_contains(), entry_match_hosts(), fill_data_for_entry(), FillDataResult, first_string(), FolderRef, has_passkey(), login_entry() (+31 more)

### Community 45 - "release.js"
Cohesion: 0.12
Nodes (19): androidGradleHasVersionCode(), androidGradleHasVersionName(), androidStringsHasRuntimeVersion(), cargoLockHasVersion(), cargoTomlHasVersion(), { execSync }, existingTags, filesToUpdate (+11 more)

### Community 46 - "VaultProvider.tsx"
Cohesion: 0.06
Nodes (36): react-native-crypto-js, VaultContext, VaultContextType, VaultData, DocumentTypeEnum, BITWARDEN, CHROME, FIREFOX (+28 more)

### Community 47 - "isTauri.ts"
Cohesion: 0.12
Nodes (20): getClipboardText(), setClipboardText(), tryNavigatorReadText(), tryNavigatorWriteText(), ClipboardContentKind, clipboardOwnership, fingerprintValue(), OwnedClipboardRecord (+12 more)

### Community 49 - "ClavisPass Website Marketing Brief"
Cohesion: 0.05
Nodes (43): Attachments And Previews, Brand Details, Bring Your Own Sync, Browser Extension, Can I import my existing passwords?, Can my cloud provider read my passwords?, ClavisPass Website Marketing Brief, Conversion Priorities (+35 more)

### Community 50 - "BrowserExtensionsScreen.tsx"
Cohesion: 0.14
Nodes (25): BrowserBridgePairingPrompt(), PairingAction, PromptButton(), styles, actOnBrowserExtensionPairing(), BrowserExtensionPairingChangeListener, buildBrowserClientKey(), listBrowserExtensionPairings() (+17 more)

### Community 51 - "pairing.rs"
Cohesion: 0.21
Nodes (21): approve_pairing(), evaluate_pairing(), list_paired_clients(), list_pending_pairings(), list_rejected_clients(), load_pairing_store(), now_ms(), optional_identity_matches() (+13 more)

### Community 52 - "appScheme.test.ts"
Cohesion: 0.43
Nodes (5): getAppRedirectUri(), getAppScheme(), Constants, resetExpoConfig(), setExpoConfig()

### Community 53 - "Idee: Identity als persönlicher Hauptscreen"
Cohesion: 0.22
Nodes (8): Datenschutz, Einschätzung, Gestaltungsprinzipien und offene Fragen, Idee: Identity als persönlicher Hauptscreen, Mögliche Ausbaustufen, Mögliche Funktionen, Technischer Ansatz, Ziel

### Community 54 - "Login.tsx"
Cohesion: 0.11
Nodes (48): Current Vault Format, Implementation Phases, useAuth(), useVault(), Login(), Props, VaultRecoveryDialog(), VaultRecoverySetupDialog() (+40 more)

### Community 55 - "ThemeProvider.tsx"
Cohesion: 0.07
Nodes (28): @monaco-editor/react, react-native-circular-progress, sidebarWidth, styles, DevModeContext, DevModeContextType, Props, useDevMode() (+20 more)

### Community 57 - "devDependencies"
Cohesion: 0.09
Nodes (23): devDependencies, @babel/core, eslint, eslint-config-universe, patch-package, prettier, react-test-renderer, @tauri-apps/cli (+15 more)

### Community 58 - "prepare-msix.js"
Cohesion: 0.10
Nodes (16): appExe, appVersion, assetsOutputDir, createUnplatedTargetSizeIcons(), escapePowerShellSingleQuoted(), fs, manifest, manifestSource (+8 more)

### Community 62 - "ClavisPass"
Cohesion: 0.07
Nodes (28): 1. VaultSession (Authoritative & Secret-Capable), 2. VaultProvider (UI-Safe Projection), Authentication & Master Secret Handling, Backend / Plattform, CI / CD & Deployment, ClavisPass, Cryptography & Encryption Model, Defensive Defaults (+20 more)

### Community 63 - "AuthProvider.tsx"
Cohesion: 0.23
Nodes (9): AuthContext, AuthContextType, AuthMasterContext, AuthMasterContextType, Props, ScreenLockLogoutController, initScreenLockLogout(), ListenFn (+1 more)

### Community 64 - "useTheme"
Cohesion: 0.04
Nodes (97): expo-image, expo-linear-gradient, useTheme(), FilterItem, FiltersNarrow, FiltersNarrowProps, FiltersWide, FiltersWideProps (+89 more)

### Community 65 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+11 more)

### Community 66 - "mobileUpdater.ts"
Cohesion: 0.33
Nodes (9): shouldUseMobileBinaryUpdater(), checkMobileBinaryUpdate(), compareVersions(), getAppVersion(), getManifestDownloadUrl(), getMobileUpdateManifestUrl(), MobileBinaryUpdate, MobileUpdateManifest (+1 more)

### Community 67 - "webauthn.rs"
Cohesion: 0.06
Nodes (39): AssertionAuthenticatorResponse, AssertionPublicKeyCredential, AssertionSigningContext, base64url_decode(), base64url_encode(), base64url_round_trips_without_padding(), build_assertion_authenticator_data(), build_assertion_public_key_credential() (+31 more)

### Community 68 - "NavigationContainer.tsx"
Cohesion: 0.21
Nodes (13): ProtectedRoute(), getFocusedRouteName(), NavigationnContainer(), titlebarContentDragRoutes, LoginStack(), TabNavigator(), Handler, handlers (+5 more)

### Community 69 - "reactNativePaper.tsx"
Cohesion: 0.11
Nodes (14): ActivityIndicator, baseColors, Button, Chip, Divider, Icon, IconButton, MD3DarkTheme (+6 more)

### Community 71 - "Vault V2 Key Envelope Roadmap"
Cohesion: 0.06
Nodes (28): Always Know, ClavisPass Agent Context, Context Routing, Fast Map, graphify, High-Risk Rules, Core Files, Master Password Lifetime (+20 more)

### Community 72 - "model/types.ts"
Cohesion: 0.08
Nodes (33): @expo/vector-icons, @react-navigation/native-stack, AddTriggerStackParamList, AnalysisStackParamList, AppTabsParamList, IdentityStackParamList, LoginStackParamList, LogoutStackParamList (+25 more)

### Community 73 - "Datenschutzerklärung"
Cohesion: 0.09
Nodes (22): 10. Browser-Erweiterung, 11. Benachrichtigungen, 12. Kontaktaufnahme, 13. Webseite und Hosting, 14. Cookies, Tracking und Analytics, 15. App Stores und Download-Plattformen, 16. Rechtsgrundlagen, 17. Speicherdauer (+14 more)

### Community 74 - "autofill-preferences.ts"
Cohesion: 0.27
Nodes (12): buildPreferenceResult(), DEFAULT_POLICY, DomainPolicyStore, normalizeHost(), normalizeMode(), normalizePolicy(), readPolicyStore(), updateAutofillPolicyForHost() (+4 more)

### Community 76 - "Privacy Policy"
Cohesion: 0.09
Nodes (22): 10. Browser Extension, 11. Notifications, 12. Contact, 13. Website And Hosting, 14. Cookies, Tracking And Analytics, 15. App Stores And Download Platforms, 16. Legal Bases, 17. Retention (+14 more)

### Community 77 - "protocol.rs"
Cohesion: 0.20
Nodes (7): BridgeClientInfo, BridgeError, BridgePairingEnvelope, BridgeRequest, BridgeResponse, HOST_NAME, PROTOCOL_VERSION

### Community 78 - "Nutzungsbedingungen"
Cohesion: 0.10
Nodes (20): 10. Erlaubte Nutzung, 11. Open Source und Lizenzen, 12. Kosten, 13. Drittanbieter, 14. Updates, 15. Haftung, 16. Beendigung der Nutzung, 17. Änderungen (+12 more)

### Community 80 - "prepare-native-host-sidecar.js"
Cohesion: 0.15
Nodes (12): cargoArgs, { copyFileSync, existsSync, mkdirSync, writeFileSync }, detectHostTriple(), { execFileSync }, { join, resolve }, manifestPath, outputDir, outputPath (+4 more)

### Community 81 - "BrowserBridgeWriteSync.tsx"
Cohesion: 0.17
Nodes (19): applyUpdateToEntry(), BrowserBridgeWriteSync(), BrowserWriteKind, BrowserWriteRequest, createBrowserEntry(), CreatePayload, effectiveUrl(), normalizeText() (+11 more)

### Community 84 - "session.rs"
Cohesion: 0.24
Nodes (8): session_store_path(), BridgeSessionSnapshot, clear_session(), load_session(), now_ms(), publish_session(), SESSION_TTL_MS, write_json_atomically()

### Community 85 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, build:chrome, build:firefox, build:firefox-local, dev, package:chrome, package:firefox (+8 more)

### Community 86 - "AddModuleModal.tsx"
Cohesion: 0.17
Nodes (13): AddModuleModalCompactFav(), defineModules(), IdsOf, MissingIds, ModuleCategory, ModuleMeta, Props, TinyFilterChip() (+5 more)

### Community 87 - "App.tsx"
Cohesion: 0.09
Nodes (29): App(), AppShell(), AppWithNavigation(), DemoBootstrap(), getCurrentWindowSafe(), MainWindowReadySignal(), withAlpha(), AuthProvider() (+21 more)

### Community 88 - "hotkeys.ts"
Cohesion: 0.15
Nodes (15): ACTIONS, BLOCKED_HOTKEYS, DEFAULT_HOTKEYS, getDefaultHotkey(), getDefaultHotkeys(), getHotkeyConflict(), HotkeyAction, hotkeyFromKeyboardEvent() (+7 more)

### Community 89 - "bridge_commands.rs"
Cohesion: 0.15
Nodes (8): bridge_approve_pairing(), bridge_claim_pending_writes(), bridge_complete_write_request(), bridge_list_paired_clients(), bridge_list_pending_pairings(), bridge_list_rejected_clients(), bridge_publish_session(), bridge_reject_pairing()

### Community 90 - "Terms Of Use"
Cohesion: 0.10
Nodes (20): 10. Permitted Use, 11. Open Source And Licenses, 12. Costs, 13. Third-Party Providers, 14. Updates, 15. Liability, 16. Ending Use, 17. Changes (+12 more)

### Community 91 - "UI Context"
Cohesion: 0.25
Nodes (7): i18n, Important Files, Menus And Dropdowns, Platform Model, Related UI Context, Titlebar And Chrome, UI Context

### Community 92 - "Header"
Cohesion: 0.08
Nodes (44): Standard Screen Structure, expo-camera, expo-file-system, react-native-pdf, @react-navigation/native, HomeStackParamList, Stack, NoteFullscreenEditor() (+36 more)

### Community 93 - "check-tauri-version-sync.js"
Cohesion: 0.24
Nodes (11): collectMismatches(), fs, getMajorMinor(), getNpmLockVersion(), mismatches, parseCargoLockVersions(), path, readJson() (+3 more)

### Community 94 - "prepare-sodium-16kb.js"
Cohesion: 0.15
Nodes (12): download(), findEndOfCentralDirectory(), fs, https, main(), os, path, readZipEntries() (+4 more)

### Community 95 - "ClavisPass Product Strategy Roadmap"
Cohesion: 0.11
Nodes (17): 1. Browser Extension Polish, 2. Passkeys, 3. Emergency Access / Trusted Contact, 4. Optional Web App, 5. Separate Secrets Sharing SaaS, Bitwarden Gaps To Treat As Strategic, ClavisPass Personal, ClavisPass Product Strategy Roadmap (+9 more)

### Community 96 - "generatePassword.ts"
Cohesion: 0.29
Nodes (5): generatePassword(), LOWERCASE_CHAR_CODES, NUMBER_CHAR_CODES, SYMBOL_CHAR_CODES, UPPERCASE_CHAR_CODES

### Community 97 - "bundle"
Cohesion: 0.17
Nodes (12): bundle, active, category, copyright, createUpdaterArtifacts, externalBin, fileAssociations, icon (+4 more)

### Community 98 - "getModuleData"
Cohesion: 0.11
Nodes (27): Editor(), native, TemplateEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT (+19 more)

### Community 99 - "deriveIdentityClusters.ts"
Cohesion: 0.10
Nodes (25): Confidence And Trust, Core Idea, Data Model Direction, Design Tone, Identity Detail View, Identity Management Concept, Identity Tab, Important Principle (+17 more)

### Community 100 - "triggerGlobalError"
Cohesion: 0.17
Nodes (16): fetchFile(), fetchUserInfo(), refreshAccessToken(), uploadFile(), fetchUserInfo(), ensureDesktop(), fetchFile(), fetchUserInfo() (+8 more)

### Community 101 - "AppearanceSettingsSection.tsx"
Cohesion: 0.15
Nodes (16): expo-clipboard, AppearanceSettingsSection(), Props, I18nBridge(), initI18n(), resources, de, en (+8 more)

### Community 102 - "tauri.conf.json"
Cohesion: 0.18
Nodes (10): app, macOSPrivateApi, security, windows, identifier, mainBinaryName, productName, $schema (+2 more)

### Community 103 - "withAndroidApplicationId.js"
Cohesion: 0.20
Nodes (4): fs, path, { withDangerousMod }, { withXcodeProject }

### Community 104 - "build-web-demo.js"
Cohesion: 0.20
Nodes (8): demoDotenvPath, demoEnv, env, fs, path, result, rewriteDemoPublicPaths(), { spawnSync }

### Community 105 - "ref_react"
Cohesion: 0.07
Nodes (24): react-native-reanimated, Props, styles, Props, styles, ExpiryOverviewEntry, Props, ExpiryOverviewModal() (+16 more)

### Community 106 - "plugins"
Cohesion: 0.20
Nodes (10): args, customProtocol, plugins, cli, deepLink, updater, endpoints, pubkey (+2 more)

### Community 107 - "editHistory.ts"
Cohesion: 0.21
Nodes (13): Editor(), appendLog(), areValuesEqual(), cloneValue(), createLogEntry(), EditHistoryActionType, EditHistoryMeta, EditSessionLogEntry (+5 more)

### Community 108 - "ValueIconsEnum"
Cohesion: 0.14
Nodes (13): ValueIconsEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+5 more)

### Community 109 - "CloudStorageClient.ts"
Cohesion: 0.19
Nodes (10): Props, UserInfoProps, assertUnchangedVault(), pendingVaultOperation, target, v2, v3, FetchFileParams (+2 more)

### Community 112 - "complete_request"
Cohesion: 0.39
Nodes (8): bridge_dir(), BRIDGE_ENV_KEY, ensure_dir(), pairing_store_path(), platform_base_dir(), write_request_store_path(), write_result_store_path(), complete_request()

### Community 113 - "reactNative.ts"
Cohesion: 0.11
Nodes (13): Animated, AnimatedValue, Dimensions, InteractionManager, Platform, Pressable, ScrollView, setPlatform() (+5 more)

### Community 114 - "reactNativeReanimated.tsx"
Cohesion: 0.25
Nodes (4): Animated, AnimatedView, Easing, FadeInDown

### Community 116 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, @types/chrome, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react

### Community 117 - "compilerOptions"
Cohesion: 0.29
Nodes (6): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, include

### Community 118 - "GoogleDriveLoginButtonContent"
Cohesion: 0.23
Nodes (16): getMobileRedirectUri(), GoogleDriveLoginButtonContent(), randState(), readTokenResponse(), base64Url(), createPkcePair(), randomBytes(), toCodeChallenge() (+8 more)

### Community 119 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, moduleResolution, strict, exclude, extends

### Community 120 - "Store Release Roadmap"
Cohesion: 0.17
Nodes (11): Apple Developer Program, Arratel Setup Plan, Chrome Web Store, Goals, Google Play, Microsoft Store, Publisher Naming, References (+3 more)

### Community 121 - "native_host_registration.rs"
Cohesion: 0.18
Nodes (10): CHROME_EXTENSION_IDS, chromium_origins(), CREATE_NO_WINDOW, EDGE_EXTENSION_IDS, find_native_host_exe(), FIREFOX_EXTENSION_ID, native_host_candidates(), NATIVE_HOST_NAME (+2 more)

### Community 122 - "CloudProvider.tsx"
Cohesion: 0.21
Nodes (17): expo-local-authentication, CloudProvider(), isInvalidGrant(), OAuthRefreshError, Props, StoredAuth, TokenContext, TokenContextValue (+9 more)

### Community 123 - "container/AnimatedOpacityContainer.tsx"
Cohesion: 0.31
Nodes (6): AnimatedOpacityContainer(), Props, AnimatedOpacityContainerWeb(), Props, Props, AnimatedOpacityContainer()

### Community 124 - "domain.ts"
Cohesion: 0.24
Nodes (10): buildEntrySuggestions(), normalizeHost(), normalizeLookupHost(), normalizeRpHost(), safeUrl(), scoreUrlMatch(), searchEntries(), validateWebAuthnRpId() (+2 more)

### Community 125 - "serve-webauthn-test-page.js"
Cohesion: 0.25
Nodes (4): __dirname, pagePath, port, server

### Community 126 - "store.ts"
Cohesion: 0.17
Nodes (17): normalizeHotkeySettings(), BooleanDef, DEVICE_RESET_KEYS, EnumDef, get(), isModulesEnumValue(), JsonDef, listeners (+9 more)

### Community 127 - "macOS"
Cohesion: 0.33
Nodes (6): macOS, entitlements, exceptionDomain, frameworks, providerShortName, signingIdentity

### Community 128 - "windows"
Cohesion: 0.33
Nodes (6): windows, installerHooks, certificateThumbprint, digestAlgorithm, nsis, timestampUrl

### Community 129 - "gorhomBottomSheet.tsx"
Cohesion: 0.33
Nodes (3): BottomSheetBackdrop, BottomSheetModal, BottomSheetView

### Community 131 - "WifiTypeEnum"
Cohesion: 0.40
Nodes (4): WifiTypeEnum, BLANK, WEP, WPA

### Community 132 - "build"
Cohesion: 0.40
Nodes (5): build, beforeBuildCommand, beforeDevCommand, devUrl, frontendDist

### Community 134 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): *.jpg, *.png, *.svg

### Community 137 - "NoteModule.tsx"
Cohesion: 0.09
Nodes (26): JsonLine(), NoteCodePreview(), Props, styles, InlinePart, InlineText(), NoteMarkdownPreview(), parseInline() (+18 more)

### Community 138 - "GoogleDriveClient.ts"
Cohesion: 0.14
Nodes (19): buildMultipartBody(), escapeDriveQueryString(), fetchFile(), findFileIdByName(), GoogleTokenRefreshError, readJsonSafe(), readTextSafe(), refreshAccessToken() (+11 more)

### Community 141 - "Modal"
Cohesion: 0.04
Nodes (65): react-qr-code, actionStyle, Props, Props, styles, MobileFastAccessOverlay(), subscribeMobileFastAccess(), Props (+57 more)

### Community 142 - "linux"
Cohesion: 0.67
Nodes (3): linux, depends, deb

### Community 144 - "react-native"
Cohesion: 0.08
Nodes (61): react-i18next, react-native, react-native-paper, Props, PasswordGeneratorModal(), ModuleContainer(), ModuleContainerProps, moduleStyles (+53 more)

### Community 171 - "withIosGoogleOAuthScheme.js"
Cohesion: 0.43
Nodes (5): ensureUrlScheme(), normalizeClientId(), {
  ensureUrlScheme,
  toReverseClientIdScheme,
}, toReverseClientIdScheme(), { withInfoPlist }

### Community 172 - "browser-extension/package.json"
Cohesion: 0.17
Nodes (11): react, react-dom, tldts, @types/react, @types/react-dom, typescript, name, private (+3 more)

### Community 174 - "ExpiryNotificationScheduler.tsx"
Cohesion: 0.39
Nodes (7): expo-notifications, buildPendingExpiryReminders(), cancelScheduledExpiryReminders(), configureNotificationHandler(), ExpiryNotificationScheduler(), getReminderDate(), PendingExpiryReminder

### Community 175 - "Firefox Store Release Notes"
Cohesion: 0.25
Nodes (7): Extension Identity, Firefox Store Release Notes, Listing, Pre-Submit Check, Privacy Policy Draft, Release Artifacts, Reviewer Notes

### Community 178 - "ClavisPass Firefox Add-on Reviewer Build"
Cohesion: 0.33
Nodes (5): Build Steps, ClavisPass Firefox Add-on Reviewer Build, Environment, Firefox Add-on ID, Native Messaging Notes

### Community 179 - "DevicesScreen.tsx"
Cohesion: 0.17
Nodes (15): daysBetween(), DEFAULT_DEVICE_UI_POLICY, deriveDeviceUiStatus(), DeviceUiPolicy, DeviceUiStatus, earliestIso(), hasSameDeviceIdentity(), normalizeDeviceIdentityPart() (+7 more)

### Community 180 - "Bitwarden Import Roadmap"
Cohesion: 0.33
Nodes (5): Bitwarden Import Roadmap, Compatibility Notes, Direction, Implementation Order, Useful References

### Community 181 - "Agent Workflow Context"
Cohesion: 0.33
Nodes (5): Agent Workflow Context, Default Flow, Graphify Commands, Shared Artifacts, Token Budget Rules

### Community 182 - "Build, Release, And Update Context"
Cohesion: 0.33
Nodes (5): Build, Release, And Update Context, Common Scripts, Core Files, Release Notes, Update Handling

### Community 183 - "Identity Context"
Cohesion: 0.33
Nodes (5): Core Files, Current Product Direction, Identity Context, UI Rules, Verification

### Community 184 - "Vault Modules Context"
Cohesion: 0.40
Nodes (4): Important Boundaries, Reorder Flows, Vault Modules Context, Verification

### Community 185 - "Desktop And Tauri Context"
Cohesion: 0.29
Nodes (6): Chrome And Drag Regions, Core Files, Desktop And Tauri Context, Fast Access, Runtime Model, Tauri Responsibilities

### Community 189 - "GlobalClipboardSnackbar.tsx"
Cohesion: 0.25
Nodes (8): clipboardClearScheduler, Handler, handlers, subscribeClipboardCopied(), unsubscribeClipboardCopied(), ClipboardCopyPayload, GlobalClipboardSnackbar(), msToSecCeil()

### Community 191 - "Sync And Storage Context"
Cohesion: 0.25
Nodes (7): Core Files, Providers, Settings Schema, Storage Layers, Sync And Storage Context, Tokens, StoreSchema

### Community 192 - "errorBus.ts"
Cohesion: 0.42
Nodes (6): Listener, listeners, subscribeGlobalError(), unsubscribeGlobalError(), GlobalErrorPayload, GlobalErrorSnackbar()

### Community 193 - "SettingsQuickSelect.tsx"
Cohesion: 0.29
Nodes (7): clampWidth(), Props, SettingsQuickSelect(), styles, QuickSelectItem, DraggableHandle(), HandleProps

### Community 195 - "dependencies"
Cohesion: 0.50
Nodes (4): dependencies, react, react-dom, tldts

### Community 197 - "Crypto Context"
Cohesion: 0.40
Nodes (4): Core Files, Critical Rules, Crypto Context, Verification

### Community 198 - "DarkModeSwitch.tsx"
Cohesion: 0.21
Nodes (10): CheckedType, DarkModeSwitch(), PreviewProps, Props, Size, ThemePreviewCard(), AppColors, AppTheme (+2 more)

### Community 201 - "CardDetailsScreen.tsx"
Cohesion: 0.15
Nodes (22): Applying a preset, Catalog, Verification, Website presets, @kichiyaki/react-native-barcode-generator, CardItem(), Props, styles (+14 more)

### Community 202 - "ClavisPassHubDiscoveryResult.ts"
Cohesion: 0.29
Nodes (6): ClavisPassHubDiscoveryResult, ClavisPassHubDiscoveryStatus, DiscoveryCheckingResult, DiscoveryErrorResult, DiscoveryIdleResult, DiscoverySuccessResult

### Community 206 - "GlassAppearanceSettings.tsx"
Cohesion: 0.21
Nodes (13): @react-native-assets/slider, GlassAppearanceSettings(), Preview(), useIsTauriEnvironment(), AmbientBackground(), AmbientWash(), Props, styles (+5 more)

## Knowledge Gaps
- **132 isolated node(s):** `react`, `react-dom`, `tldts`, `@types/chrome`, `@types/react` (+127 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1730 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **48 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `vaultRecovery.ts`, `package.json`, `bitwarden.ts`, `HomeScreen.tsx`, `GoogleDriveClient.ts`, `ListItem.tsx`, `ClavisPassHubClient.ts`, `DeviceStorageClient.ts`, `ModuleReorderScreen.tsx`, `withIosGoogleOAuthScheme.js`, `VaultProvider.tsx`, `DevicesScreen.tsx`, `appScheme.test.ts`, `vite.config.ts`, `DarkModeSwitch.tsx`, `model/types.ts`, `GlassAppearanceSettings.tsx`, `BrowserBridgeWriteSync.tsx`, `hotkeys.ts`, `generatePassword.ts`, `getModuleData`, `deriveIdentityClusters.ts`, `triggerGlobalError`, `CloudStorageClient.ts`, `GoogleDriveLoginButtonContent`, `domain.ts`, `store.ts`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **What connects `react`, `react-dom`, `tldts` to the rest of the system?**
  _132 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `vaultRecovery.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05171664493698392 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.01904761904761905 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `ModulesEnum`, `RecoveryCodesModule.tsx`, `package.json`, `AnimatedLogo.tsx`, `useSetting`, `HomeScreen.tsx`, `AnalysisScreen.tsx`, `NoteModule.tsx`, `IdentitiesScreen.tsx`, `Modal`, `ListItem.tsx`, `detectTauriEnvironment`, `UpdateManager.tsx`, `distribution.ts`, `FastAccessPositionPicker.tsx`, `SettingsScreen.tsx`, `CustomBottomTab.tsx`, `logger.ts`, `ModuleReorderScreen.tsx`, `AttachmentModule.tsx`, `VaultProvider.tsx`, `ExpiryNotificationScheduler.tsx`, `isTauri.ts`, `BrowserExtensionsScreen.tsx`, `DevicesScreen.tsx`, `Login.tsx`, `ThemeProvider.tsx`, `GlobalClipboardSnackbar.tsx`, `AuthProvider.tsx`, `useTheme`, `SettingsQuickSelect.tsx`, `errorBus.ts`, `mobileUpdater.ts`, `DarkModeSwitch.tsx`, `model/types.ts`, `CardDetailsScreen.tsx`, `GlassAppearanceSettings.tsx`, `AddModuleModal.tsx`, `App.tsx`, `Header`, `ref_react`, `GoogleDriveLoginButtonContent`, `CloudProvider.tsx`, `container/AnimatedOpacityContainer.tsx`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `ModulesEnum` be split into smaller, more focused modules?**
  _Cohesion score 0.03337890179995443 - nodes in this community are weakly interconnected._
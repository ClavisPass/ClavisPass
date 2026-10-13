# Graph Report - ClavisPass  (2026-10-13)

## Corpus Check
- 565 files · ~343,752 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 37 file(s) not represented in the graph (top: .xml 11, (none) 8, .properties 2)

## Summary
- 3792 nodes · 10497 edges · 193 communities (150 shown, 43 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 145 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8a6ba46b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ModulesEnum.ts
- dependencies
- RecoveryCodesModule.tsx
- mergeVaultData.ts
- package.json
- getModule.tsx
- App.tsx
- vitest
- EditScreen.tsx
- expiry.ts
- HomeScreen.tsx
- content/index.ts
- shared/types.ts
- popup/App.tsx
- useVault
- background/index.ts
- shared/bridge.ts
- AnalysisScreen.tsx
- useSetting
- FastAccess.ts
- AnalysisDetailScreen.tsx
- expo
- ClavisPassHubClient.ts
- ref_react
- write.rs
- scripts
- logger.ts
- manifest.json
- useClipboardCopy.ts
- forms.ts
- lib.rs
- decryptVaultContent.ts
- UpdateManager.tsx
- store.ts
- commands.rs
- LoginScreen.tsx
- AttachmentModule.tsx
- CloseBehaviorState
- state.ts
- DraggableModulesList.shared.tsx
- mapKdbxToClavisPass.ts
- useAuth
- host.rs
- vault.rs
- GoogleDriveLoginButton.tsx
- release.js
- Desktop And Tauri Context
- CreditCardModule.tsx
- screen_lock.rs
- ClavisPass Website Marketing Brief
- createUniqueID
- pairing.rs
- CryptoProvider
- background/bridge.ts
- deriveIdentityClusters.ts
- InlineNotice.tsx
- vite.config.ts
- devDependencies
- prepare-msix.js
- GoogleDriveClient.test.ts
- ClavisPass Agent Context
- analysisEngine.ts
- ClavisPass
- bridge_commands.rs
- NoteModule.tsx
- compilerOptions
- GoogleDriveClient.ts
- ValuesType.ts
- ModulesEnum
- reactNativePaper.tsx
- MainApplication.kt
- googleOAuth.ts
- VaultV1.ts
- Datenschutzerklärung
- autofill-preferences.ts
- ObjcId
- Privacy Policy
- vaultDevices.ts
- Nutzungsbedingungen
- model/types.ts
- prepare-native-host-sidecar.js
- reactNative.ts
- EditRowControlsContainer.tsx
- MainActivity.kt
- session.rs
- scripts
- native_host_registration.rs
- Modal
- TemplateEnum
- ClavisPass Browser Extension
- Terms Of Use
- protocol.rs
- generatePassword.ts
- check-tauri-version-sync.js
- prepare-sodium-16kb.js
- ClavisPass Product Strategy Roadmap
- SettingsScreen.tsx
- bundle
- IdentitiesScreen.tsx
- Identity Management Concept
- appScheme.test.ts
- BrowserExtensionsScreen.tsx
- tauri.conf.json
- withAndroidApplicationId.js
- build-web-demo.js
- ThemeProvider.tsx
- plugins
- autofill-cache.ts
- ValueIconsEnum
- container/AnimatedOpacityContainer.tsx
- AuthProvider.tsx
- EditHistoryModal.tsx
- UI Patterns Context
- withIosGoogleOAuthScheme.js
- reactNativeReanimated.tsx
- reactNavigationNative.ts
- devDependencies
- compilerOptions
- Sync.tsx
- tsconfig.json
- Store Release Roadmap
- fill.ts
- LogoutStack.tsx
- rnSodiumProvider.ts
- TotpModule.tsx
- brand.ts
- Header
- macOS
- windows
- gorhomBottomSheet.tsx
- WifiTypeEnum
- build
- vite-env.d.ts
- tab-context.ts
- Vault V2 Key Envelope Roadmap
- BridgeStatusBadge.tsx
- ClavisPass Project Context
- linux
- asyncStorage.ts
- Crypto Context
- tokens.ts
- env.d.ts
- DROPBOX_CLIENT_ID
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_ID_ANDROID
- GOOGLE_CLIENT_ID_DESKTOP
- GOOGLE_CLIENT_ID_IOS
- GOOGLE_CLIENT_SECRET_DESKTOP
- ClavisPass
- AttachmentPreviewScreen.native.tsx
- browser-extension/package.json
- AuthReplyBlock
- ref_fs
- Firefox Store Release Notes
- UI Context
- ClavisPass Firefox Add-on Reviewer Build
- useTheme
- Bitwarden Import Roadmap
- Agent Workflow Context
- Build, Release, And Update Context
- Identity Context
- AddModuleModal.tsx
- dependencies
- CLAUDE.md
- .claude/CLAUDE.md
- CustomTitlebar.tsx
- device_identity.rs
- VaultProvider.tsx
- detectTauriEnvironment
- DocumentTypeEnum

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 266 edges
2. `react-native` - 183 edges
3. `react-native-paper` - 128 edges
4. `ModulesEnum` - 110 edges
5. `react-i18next` - 101 edges
6. `detectTauriEnvironment()` - 80 edges
7. `AnimatedPressable` - 78 edges
8. `Modal()` - 57 edges
9. `SettingsScreen()` - 56 edges
10. `useVault()` - 55 edges

## Surprising Connections (you probably didn't know these)
- `Implementation` --references--> `AuthProvider()`  [INFERRED]
  README.md → src/app/providers/AuthProvider.tsx
- `Tokens` --references--> `CloudProvider()`  [INFERRED]
  docs/context/sync-storage.md → src/app/providers/CloudProvider.tsx
- `High-Risk Rules` --references--> `VaultProvider()`  [INFERRED]
  AGENTS.md → src/app/providers/VaultProvider.tsx
- `Vault Session Boundary` --references--> `VaultProvider()`  [INFERRED]
  docs/context/security.md → src/app/providers/VaultProvider.tsx
- `Reorder Flows` --references--> `Header()`  [INFERRED]
  docs/context/vault-modules.md → src/shared/components/Header.tsx

## Import Cycles
- None detected.

## Communities (193 total, 43 thin omitted)

### Community 0 - "ModulesEnum.ts"
Cohesion: 0.05
Nodes (65): zod, AddressModuleType, AddressModuleTypeSchema, regex, CompanyModuleType, CompanyModuleTypeSchema, regex, CreditCardModuleType (+57 more)

### Community 1 - "dependencies"
Cohesion: 0.02
Nodes (105): dependencies, argon2-browser, @babel/plugin-proposal-export-namespace-from, base64-js, crypto-js, expo, expo-auth-session, expo-blur (+97 more)

### Community 2 - "RecoveryCodesModule.tsx"
Cohesion: 0.16
Nodes (16): RecoveryCodesModule(), splitKeepingRemainder(), styles, tokenize(), Props, QuickSelect(), styles, emitClipboardCopied() (+8 more)

### Community 3 - "mergeVaultData.ts"
Cohesion: 0.19
Nodes (21): addLatestTombstones(), areSame(), clone(), conflictCopyMatchesBaseEntry(), conflictCopyWasDeleted(), entryContentFingerprint(), entryIsDeletedBy(), getConflictCopyBaseId() (+13 more)

### Community 4 - "package.json"
Cohesion: 0.03
Nodes (74): react, react-dom, @types/react, @types/react-dom, typescript, main, name, private (+66 more)

### Community 5 - "getModule.tsx"
Cohesion: 0.08
Nodes (56): react-i18next, FastAccessType, FastAccessTypeSchema, ExpiryPickerModal(), Props, PasswordGeneratorModal(), ModuleContainer(), ModuleContainerProps (+48 more)

### Community 6 - "App.tsx"
Cohesion: 0.08
Nodes (35): App(), AppShell(), AppWithNavigation(), DemoBootstrap(), getCurrentWindowSafe(), withAlpha(), DevModeContext, DevModeContextType (+27 more)

### Community 7 - "vitest"
Cohesion: 0.28
Nodes (7): react-test-renderer, vitest, update, devices, renderBare(), renderWithAppProviders(), textContent()

### Community 8 - "EditScreen.tsx"
Cohesion: 0.05
Nodes (69): extractFastAccessObject(), FolderFilter(), Props, styles, CategoryItem(), Props, ellipsize(), failedFaviconUrls (+61 more)

### Community 9 - "expiry.ts"
Cohesion: 0.47
Nodes (4): ExpiryStatus, formatRelative(), getRelativeInfo(), RelativeExpiryInfo

### Community 10 - "HomeScreen.tsx"
Cohesion: 0.09
Nodes (30): Item Surfaces, CardItem(), Props, styles, TotpItem(), buildFaviconUrl(), DigitalCardPalette, extractUrlFromEntry() (+22 more)

### Community 11 - "content/index.ts"
Cohesion: 0.14
Nodes (32): applyThemeToInlinePicker(), clearInlinePreview(), commitInlineAction(), createCloseIcon(), createInlineLogo(), createPickerLogo(), ensureInlineStyles(), fillSuggestionFromPicker() (+24 more)

### Community 12 - "shared/types.ts"
Cohesion: 0.05
Nodes (46): BackgroundHandler, BackgroundHandlerMap, BackgroundMessageContext, BackgroundMessageRouter, FillPreviewResult, FillStateCardProps, ContentMessage, ContentMessageMap (+38 more)

### Community 13 - "popup/App.tsx"
Cohesion: 0.09
Nodes (33): registerContentFrame(), App(), handleFill(), handleOpenDesktopApp(), handlePromptResolution(), handleToggleSavePrompts(), handleUpdateAutofillMode(), refreshInlineAutofillPreference() (+25 more)

### Community 14 - "useVault"
Cohesion: 0.18
Nodes (18): react-native-progress, useVault(), Login(), Props, authenticateUser(), isUsingAuthentication(), loadAuthentication(), consumeSystemAuthAutoUnlockSuppression() (+10 more)

### Community 15 - "background/index.ts"
Cohesion: 0.12
Nodes (30): clearTabBadge(), delay(), desktopBridge, ensureContentScriptReady(), evaluateSavePromptCandidate(), fillFirstAvailableMatchInActiveTab(), fillPreparedDataInTab(), formatBadgeCount() (+22 more)

### Community 16 - "shared/bridge.ts"
Cohesion: 0.14
Nodes (23): NativeMessagingClient, NativeMessagingError, toBridgeError(), validateBridgeResponse(), withTimeout(), createInstanceId(), getBridgeClientInfo(), getBrowserDisplayName() (+15 more)

### Community 17 - "AnalysisScreen.tsx"
Cohesion: 0.10
Nodes (33): SettingsStackParamList, Stack, FiltersNarrow, Corner, CornerOption(), FastAccessPosition, FastAccessPositionPicker(), Props (+25 more)

### Community 18 - "useSetting"
Cohesion: 0.12
Nodes (19): DEFAULT_KEYS, loadSettingWithTimeout(), SettingsContext, SettingsContextValue, SettingsState, useSetting(), AppearanceSettingsSection(), Props (+11 more)

### Community 19 - "FastAccess.ts"
Cohesion: 0.10
Nodes (38): @tauri-apps/api, FastAccessSessionBridge(), FAST_ACCESS_NOTIFICATION_CATEGORY, FAST_ACCESS_POPUP_LABEL, FAST_ACCESS_POSITION_CHANGED_EVENT, FAST_ACCESS_READY_EVENT, FAST_ACCESS_UPDATE_EVENT, FastAccessPayload (+30 more)

### Community 20 - "AnalysisDetailScreen.tsx"
Cohesion: 0.11
Nodes (27): useAuthMaster(), FilterAnalysisModal(), Props, PasswordStrengthLevel, MEDIUM, STRONG, WEAK, deriveAnalysisPepperFromMaster() (+19 more)

### Community 21 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, adaptiveIcon, blockedPermissions, package, permissions, versionCode, projectId (+31 more)

### Community 22 - "ClavisPassHubClient.ts"
Cohesion: 0.06
Nodes (63): @react-native-async-storage/async-storage, calculateExpiresIn(), checkDiscovery(), createHubError(), createHubErrorFromPayload(), DiscoveryResponse, ensureVaultEtagForUpload(), fetchFile() (+55 more)

### Community 23 - "ref_react"
Cohesion: 0.05
Nodes (47): BrandHeaderProps, react-native, react-native-reanimated, FilterItem, FiltersNarrowProps, FiltersWide, FiltersWideProps, styles (+39 more)

### Community 24 - "write.rs"
Cohesion: 0.12
Nodes (31): write_request_store_path(), as_io_error(), BrowserWriteKind, CreateEntryFromBrowser, UpdateEntryFromBrowser, BrowserWriteRequest, BrowserWriteRequestStore, BrowserWriteResult (+23 more)

### Community 25 - "scripts"
Cohesion: 0.05
Nodes (37): scripts, android, android:build:apk, android:build:store, android:build:store-submit, android:submit:store, extension:build, extension:build:chrome (+29 more)

### Community 26 - "logger.ts"
Cohesion: 0.08
Nodes (33): @tauri-apps/plugin-fs, OAuthRefreshError, Props, StoredAuth, TokenContext, TokenContextValue, OnlineContext, OnlineContextType (+25 more)

### Community 27 - "manifest.json"
Cohesion: 0.06
Nodes (35): action, default_icon, default_popup, default_title, background, service_worker, type, browser_specific_settings (+27 more)

### Community 28 - "useClipboardCopy.ts"
Cohesion: 0.15
Nodes (10): setClipboardText(), clipboardClearScheduler, ClipboardContentKind, clipboardOwnership, fingerprintValue(), OwnedClipboardRecord, TrackClipboardCopyOptions, copyWithAutoClear() (+2 more)

### Community 29 - "forms.ts"
Cohesion: 0.11
Nodes (33): setupSavePromptListener(), AutofillPlan, buildDetachedContainer(), buildFieldKey(), buildFieldText(), buildFormId(), chooseBestField(), ClassifiedField (+25 more)

### Community 30 - "lib.rs"
Cohesion: 0.11
Nodes (19): clamp_window_size(), clamp_window_size_to_monitor(), DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIDTH, emit_lock_vault(), emit_vault_file_open_request(), get_requested_vault_file_path(), get_window_size_file_path() (+11 more)

### Community 31 - "decryptVaultContent.ts"
Cohesion: 0.20
Nodes (14): VaultDataTypeSchema, getEmptyData(), DecryptVaultContentResult, makeV2KeywrapAadBytes(), makeV2PayloadAadBytes(), te, V2_KEYWRAP_AAD_OBJECT, V2_PAYLOAD_AAD_OBJECT (+6 more)

### Community 32 - "UpdateManager.tsx"
Cohesion: 0.14
Nodes (22): expo-updates, react-native-safe-area-context, @tauri-apps/plugin-process, @tauri-apps/plugin-updater, Listener, listeners, publishUpdateCheck(), subscribeUpdateCheck() (+14 more)

### Community 33 - "store.ts"
Cohesion: 0.05
Nodes (52): Core Files, Providers, Settings Schema, Storage Layers, Sync And Storage Context, Tokens, HotkeyRecorderItem(), Props (+44 more)

### Community 34 - "commands.rs"
Cohesion: 0.10
Nodes (10): AUTH_REPLY_SIGNATURE, authenticate_with_system(), BLOCK_HAS_SIGNATURE, CF_UNICODETEXT_FORMAT, get_main_window_hwnd(), LAPOLICY_DEVICE_OWNER_AUTHENTICATION, reset_window_size(), set_content_protection() (+2 more)

### Community 35 - "LoginScreen.tsx"
Cohesion: 0.13
Nodes (31): react-native-svg, useToken(), useOnline(), Auth(), Props, FirstOpened(), Props, Step (+23 more)

### Community 36 - "AttachmentModule.tsx"
Cohesion: 0.13
Nodes (27): expo-document-picker, expo-file-system, expo-sharing, AttachmentModule(), canPreviewAttachment(), downloadBrowserAttachment(), formatBytes(), getAttachmentIcon() (+19 more)

### Community 37 - "CloseBehaviorState"
Cohesion: 0.13
Nodes (10): claim_pending_lock_request(), close_main_window(), CloseBehavior, Exit, Hide, CloseBehaviorState, focus_main_window(), schedule_exit_watchdog() (+2 more)

### Community 38 - "state.ts"
Cohesion: 0.11
Nodes (16): buildCreatePayload(), buildUpdatePayload(), resolvePromptWithDesktopWrite(), toAppliedResult(), buildPromptTitle(), ExtensionState, normalizeIdentity(), PreparedFillRecord (+8 more)

### Community 39 - "DraggableModulesList.shared.tsx"
Cohesion: 0.11
Nodes (27): expo-clipboard, i18next, NativeDragHandleScrollLockProvider(), WebDragHandlePropsProvider(), dragDropAnimationConfig, DraggableModulesList(), DraggableModulesFooter(), DraggableModulesListProps (+19 more)

### Community 40 - "mapKdbxToClavisPass.ts"
Cohesion: 0.12
Nodes (26): kdbxweb, configureKdbxArgon2(), importKdbx(), addCustomField(), addTotpModule(), addValueModule(), binaryToBytes(), binaryWithMetaToAttachment() (+18 more)

### Community 41 - "useAuth"
Cohesion: 0.09
Nodes (36): @expo/vector-icons, @react-navigation/bottom-tabs, Props, ProtectedRoute(), styles, CustomBottomTab(), getActiveRouteName(), getActiveRouteName() (+28 more)

### Community 42 - "host.rs"
Cohesion: 0.16
Nodes (17): app_scheme(), bridge_result_to_response(), ensure_ready(), FillPayload, handle_request(), pairing_required(), PeerInfo, read_frame() (+9 more)

### Community 43 - "vault.rs"
Cohesion: 0.22
Nodes (20): domain_contains(), fill_data_for_entry(), FillDataResult, first_string(), FolderRef, login_entry(), match_domain_score(), normalize_domain() (+12 more)

### Community 44 - "GoogleDriveLoginButton.tsx"
Cohesion: 0.13
Nodes (22): expo-auth-session, expo-random, expo-web-browser, @fabianlars/tauri-plugin-oauth, ANDROID_AUTH_PROMPT_OPTIONS, getMobileRedirectUri(), randState(), SCOPES (+14 more)

### Community 45 - "release.js"
Cohesion: 0.12
Nodes (19): androidGradleHasVersionCode(), androidGradleHasVersionName(), androidStringsHasRuntimeVersion(), cargoLockHasVersion(), cargoTomlHasVersion(), { execSync }, existingTags, filesToUpdate (+11 more)

### Community 46 - "Desktop And Tauri Context"
Cohesion: 0.29
Nodes (6): Chrome And Drag Regions, Core Files, Desktop And Tauri Context, Fast Access, Runtime Model, Tauri Responsibilities

### Community 47 - "CreditCardModule.tsx"
Cohesion: 0.31
Nodes (12): CreditCardModule(), CreditCardState, detectCardBrand(), digitsOnly(), formatCardNumber(), maskCardNumber(), passesLuhn(), concealActiveSecretReveal() (+4 more)

### Community 48 - "screen_lock.rs"
Cohesion: 0.13
Nodes (6): CGSessionCopyCurrentDictionary(), emit(), ScreenLockPayload, Session, start(), wndproc()

### Community 49 - "ClavisPass Website Marketing Brief"
Cohesion: 0.05
Nodes (43): Attachments And Previews, Brand Details, Bring Your Own Sync, Browser Extension, Can I import my existing passwords?, Can my cloud provider read my passwords?, ClavisPass Website Marketing Brief, Conversion Priorities (+35 more)

### Community 50 - "createUniqueID"
Cohesion: 0.21
Nodes (22): addCardModule(), addCustomField(), addExpiryModule(), addIdentityModules(), addLoginModules(), addNote(), addSshKeyModule(), addTotp() (+14 more)

### Community 51 - "pairing.rs"
Cohesion: 0.21
Nodes (21): approve_pairing(), evaluate_pairing(), list_paired_clients(), list_pending_pairings(), list_rejected_clients(), load_pairing_store(), now_ms(), optional_identity_matches() (+13 more)

### Community 52 - "CryptoProvider"
Cohesion: 0.25
Nodes (9): CryptoProvider, assertPositiveSafeInteger(), decryptVaultV1(), encryptVaultV1(), verifyVaultV1Provider(), assertPositiveSafeInteger(), assertV2Lengths(), createWrappedDataKey() (+1 more)

### Community 53 - "background/bridge.ts"
Cohesion: 0.08
Nodes (31): Desktop bridge, deriveAppState(), getStoredPairingStatus(), normalizeDesktopStatus(), normalizeFillData(), normalizeSuggestions(), BrowserWriteResult, CreateEntryFromBrowserPayload (+23 more)

### Community 54 - "deriveIdentityClusters.ts"
Cohesion: 0.35
Nodes (11): buildPasswordUseCounts(), deriveIdentityClusters(), entryHasSimplePasswordRisk(), getEntryDomains(), getEntryModuleTypes(), getEntryPasswordValues(), getEntrySignals(), getModuleValue() (+3 more)

### Community 57 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, @babel/core, eslint, eslint-config-universe, patch-package, prettier, react-test-renderer, @tauri-apps/cli (+14 more)

### Community 58 - "prepare-msix.js"
Cohesion: 0.10
Nodes (16): appExe, appVersion, assetsOutputDir, createUnplatedTargetSizeIcons(), escapePowerShellSingleQuoted(), fs, manifest, manifestSource (+8 more)

### Community 59 - "GoogleDriveClient.test.ts"
Cohesion: 0.20
Nodes (9): DROPBOX_CLIENT_ID, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_ID_ANDROID, GOOGLE_CLIENT_ID_DESKTOP, GOOGLE_CLIENT_ID_IOS, GOOGLE_CLIENT_SECRET_DESKTOP, resetEnv(), setEnv() (+1 more)

### Community 60 - "ClavisPass Agent Context"
Cohesion: 0.29
Nodes (6): Always Know, ClavisPass Agent Context, Context Routing, Fast Map, graphify, High-Risk Rules

### Community 61 - "analysisEngine.ts"
Cohesion: 0.10
Nodes (32): expo-crypto, AnalysisFlags, CachedAnalysisItem, CacheResult, buildAnalysisCache(), canonicalizeForVariants(), findSequentialTriples(), fingerprintPassword() (+24 more)

### Community 62 - "ClavisPass"
Cohesion: 0.07
Nodes (28): 1. VaultSession (Authoritative & Secret-Capable), 2. VaultProvider (UI-Safe Projection), Authentication & Master Secret Handling, Backend / Plattform, CI / CD & Deployment, ClavisPass, Cryptography & Encryption Model, Defensive Defaults (+20 more)

### Community 63 - "bridge_commands.rs"
Cohesion: 0.15
Nodes (8): bridge_approve_pairing(), bridge_claim_pending_writes(), bridge_complete_write_request(), bridge_list_paired_clients(), bridge_list_pending_pairings(), bridge_list_rejected_clients(), bridge_publish_session(), bridge_reject_pairing()

### Community 64 - "NoteModule.tsx"
Cohesion: 0.11
Nodes (22): JsonLine(), NoteCodePreview(), Props, styles, InlinePart, InlineText(), NoteMarkdownPreview(), parseInline() (+14 more)

### Community 65 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+11 more)

### Community 66 - "GoogleDriveClient.ts"
Cohesion: 0.36
Nodes (10): buildMultipartBody(), escapeDriveQueryString(), fetchFile(), findFileIdByName(), GoogleTokenRefreshError, readJsonSafe(), readTextSafe(), refreshAccessToken() (+2 more)

### Community 67 - "ValuesType.ts"
Cohesion: 0.11
Nodes (29): papaparse, VaultContextType, applyUpdateToEntry(), BrowserWriteKind, BrowserWriteRequest, createBrowserEntry(), CreatePayload, effectiveUrl() (+21 more)

### Community 68 - "ModulesEnum"
Cohesion: 0.07
Nodes (30): buildPendingExpiryReminders(), getReminderDate(), PendingExpiryReminder, ExpiryModuleType, ExpiryModuleTypeSchema, regex, ModulesEnum, ADDRESS (+22 more)

### Community 69 - "reactNativePaper.tsx"
Cohesion: 0.11
Nodes (14): ActivityIndicator, baseColors, Button, Chip, Divider, Icon, IconButton, MD3DarkTheme (+6 more)

### Community 71 - "googleOAuth.ts"
Cohesion: 0.47
Nodes (8): buildGoogleLoopbackRedirectUri(), getGoogleClientIdForCurrentPlatform(), getGoogleClientSecretForCurrentPlatform(), getGoogleDesktopClientId(), getGoogleDesktopClientSecret(), getGoogleMobileRedirectUri(), normalizeClientId(), toReverseClientIdScheme()

### Community 72 - "VaultV1.ts"
Cohesion: 0.29
Nodes (6): makeV1AadBytes(), te, V1_AAD_OBJECT, VaultV1, VaultV1Schema, TEST_PAYLOAD

### Community 73 - "Datenschutzerklärung"
Cohesion: 0.09
Nodes (22): 10. Browser-Erweiterung, 11. Benachrichtigungen, 12. Kontaktaufnahme, 13. Webseite und Hosting, 14. Cookies, Tracking und Analytics, 15. App Stores und Download-Plattformen, 16. Rechtsgrundlagen, 17. Speicherdauer (+14 more)

### Community 74 - "autofill-preferences.ts"
Cohesion: 0.29
Nodes (13): buildPreferenceResult(), DEFAULT_POLICY, DomainPolicyStore, getInlineAutofillPreferenceForUrl(), normalizeHost(), normalizeMode(), normalizePolicy(), readPolicyStore() (+5 more)

### Community 75 - "ObjcId"
Cohesion: 0.22
Nodes (15): authenticate_with_system_impl(), _Block_copy(), _Block_release(), check_system_auth_available(), cstring(), new_la_context(), _NSConcreteStackBlock, objc_class() (+7 more)

### Community 76 - "Privacy Policy"
Cohesion: 0.09
Nodes (22): 10. Browser Extension, 11. Notifications, 12. Contact, 13. Website And Hosting, 14. Cookies, Tracking And Analytics, 15. App Stores And Download Platforms, 16. Legal Bases, 17. Retention (+14 more)

### Community 77 - "vaultDevices.ts"
Cohesion: 0.24
Nodes (9): daysBetween(), DEFAULT_DEVICE_UI_POLICY, DeviceUiPolicy, DeviceUiStatus, earliestIso(), hasSameDeviceIdentity(), normalizeDeviceIdentityPart(), parseIso() (+1 more)

### Community 78 - "Nutzungsbedingungen"
Cohesion: 0.10
Nodes (20): 10. Erlaubte Nutzung, 11. Open Source und Lizenzen, 12. Kosten, 13. Drittanbieter, 14. Updates, 15. Haftung, 16. Beendigung der Nutzung, 17. Änderungen (+12 more)

### Community 79 - "model/types.ts"
Cohesion: 0.10
Nodes (21): @react-navigation/native-stack, AddTriggerStackParamList, AnalysisStackParamList, LoginStackParamList, RootStackParamList, AddTriggerStack(), Stack, Stack (+13 more)

### Community 80 - "prepare-native-host-sidecar.js"
Cohesion: 0.14
Nodes (12): cargoArgs, { copyFileSync, existsSync, mkdirSync, writeFileSync }, detectHostTriple(), { execFileSync }, { join, resolve }, manifestPath, outputDir, outputPath (+4 more)

### Community 81 - "reactNative.ts"
Cohesion: 0.12
Nodes (12): Animated, AnimatedValue, Dimensions, InteractionManager, Platform, Pressable, ScrollView, StyleSheet (+4 more)

### Community 82 - "EditRowControlsContainer.tsx"
Cohesion: 0.32
Nodes (6): Shared Module UI, EditRowControlsContainer(), EditRowControlsContainerProps, NativeDragHandleScrollLockContext, WebDragHandlePropsContext, TaskModule()

### Community 84 - "session.rs"
Cohesion: 0.16
Nodes (14): bridge_dir(), BRIDGE_ENV_KEY, ensure_dir(), pairing_store_path(), platform_base_dir(), session_store_path(), write_result_store_path(), BridgeSessionSnapshot (+6 more)

### Community 85 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, build:chrome, build:firefox, build:firefox-local, dev, package:chrome, package:firefox (+6 more)

### Community 86 - "native_host_registration.rs"
Cohesion: 0.21
Nodes (10): CHROME_EXTENSION_IDS, chromium_origins(), CREATE_NO_WINDOW, EDGE_EXTENSION_IDS, find_native_host_exe(), FIREFOX_EXTENSION_ID, native_host_candidates(), NATIVE_HOST_NAME (+2 more)

### Community 87 - "Modal"
Cohesion: 0.10
Nodes (35): react-qr-code, BrowserExtensionsModal(), Props, Props, TokenQRCodeModal(), EntryTagsModal(), Props, splitKeepingRemainder() (+27 more)

### Community 88 - "TemplateEnum"
Cohesion: 0.15
Nodes (13): TemplateEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+5 more)

### Community 89 - "ClavisPass Browser Extension"
Cohesion: 0.13
Nodes (12): Architecture, Browser loading notes, ClavisPass Browser Extension, Current feature set, Development, Important note, Working from the repo root, Browser Extension Store Release (+4 more)

### Community 90 - "Terms Of Use"
Cohesion: 0.10
Nodes (20): 10. Permitted Use, 11. Open Source And Licenses, 12. Costs, 13. Third-Party Providers, 14. Updates, 15. Liability, 16. Ending Use, 17. Changes (+12 more)

### Community 91 - "protocol.rs"
Cohesion: 0.20
Nodes (7): BridgeClientInfo, BridgeError, BridgePairingEnvelope, BridgeRequest, BridgeResponse, HOST_NAME, PROTOCOL_VERSION

### Community 92 - "generatePassword.ts"
Cohesion: 0.29
Nodes (5): generatePassword(), LOWERCASE_CHAR_CODES, NUMBER_CHAR_CODES, SYMBOL_CHAR_CODES, UPPERCASE_CHAR_CODES

### Community 93 - "check-tauri-version-sync.js"
Cohesion: 0.24
Nodes (11): collectMismatches(), fs, getMajorMinor(), getNpmLockVersion(), mismatches, parseCargoLockVersions(), path, readJson() (+3 more)

### Community 94 - "prepare-sodium-16kb.js"
Cohesion: 0.15
Nodes (12): download(), findEndOfCentralDirectory(), fs, https, main(), os, path, readZipEntries() (+4 more)

### Community 95 - "ClavisPass Product Strategy Roadmap"
Cohesion: 0.11
Nodes (17): 1. Browser Extension Polish, 2. Passkeys, 3. Emergency Access / Trusted Contact, 4. Optional Web App, 5. Separate Secrets Sharing SaaS, Bitwarden Gaps To Treat As Strategic, ClavisPass Personal, ClavisPass Product Strategy Roadmap (+9 more)

### Community 96 - "SettingsScreen.tsx"
Cohesion: 0.08
Nodes (36): expo-linking, @gorhom/bottom-sheet, simple-icons, @tauri-apps/plugin-dialog, @tauri-apps/plugin-shell, useContentProtection(), isSystemAuthenticationAvailable(), saveAuthentication() (+28 more)

### Community 97 - "bundle"
Cohesion: 0.17
Nodes (12): bundle, active, category, copyright, createUpdaterArtifacts, externalBin, fileAssociations, icon (+4 more)

### Community 98 - "IdentitiesScreen.tsx"
Cohesion: 0.08
Nodes (25): Common Refactor Targets, Files To Check First, Known Custom Screens, Screen Standardization Context, Standard Checklist, expo-constants, @react-native-masked-view/masked-view, IdentityStackParamList (+17 more)

### Community 99 - "Identity Management Concept"
Cohesion: 0.13
Nodes (14): Confidence And Trust, Core Idea, Data Model Direction, Design Tone, Identity Detail View, Identity Management Concept, Identity Tab, Important Principle (+6 more)

### Community 100 - "appScheme.test.ts"
Cohesion: 0.43
Nodes (5): getAppRedirectUri(), getAppScheme(), Constants, resetExpoConfig(), setExpoConfig()

### Community 101 - "BrowserExtensionsScreen.tsx"
Cohesion: 0.14
Nodes (26): BrowserBridgePairingPrompt(), PairingAction, PromptButton(), styles, actOnBrowserExtensionPairing(), BrowserExtensionPairingChangeListener, buildBrowserClientKey(), listBrowserExtensionPairings() (+18 more)

### Community 102 - "tauri.conf.json"
Cohesion: 0.18
Nodes (10): app, macOSPrivateApi, security, windows, identifier, mainBinaryName, productName, $schema (+2 more)

### Community 103 - "withAndroidApplicationId.js"
Cohesion: 0.20
Nodes (4): fs, path, { withDangerousMod }, { withXcodeProject }

### Community 104 - "build-web-demo.js"
Cohesion: 0.20
Nodes (8): demoDotenvPath, demoEnv, env, fs, path, result, rewriteDemoPublicPaths(), { spawnSync }

### Community 105 - "ThemeProvider.tsx"
Cohesion: 0.07
Nodes (38): expo-linear-gradient, react-native-circular-progress, react-native-paper, react-native-vector-icons, useDevMode(), Props, ThemeContext, ThemeContextType (+30 more)

### Community 106 - "plugins"
Cohesion: 0.20
Nodes (10): args, customProtocol, plugins, cli, deepLink, updater, endpoints, pubkey (+2 more)

### Community 107 - "autofill-cache.ts"
Cohesion: 0.16
Nodes (23): clearAutofillDomainCache(), countPasswordSuggestions(), DomainAutofillCache, DomainAutofillCacheEntry, getAutofillEligibilityForUrl(), getCachedAutofillMatchCountForUrl(), getCachedMatchCount(), isFresh() (+15 more)

### Community 108 - "ValueIconsEnum"
Cohesion: 0.14
Nodes (13): ValueIconsEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+5 more)

### Community 109 - "container/AnimatedOpacityContainer.tsx"
Cohesion: 0.31
Nodes (6): AnimatedOpacityContainer(), Props, AnimatedOpacityContainerWeb(), Props, Props, AnimatedOpacityContainer()

### Community 110 - "AuthProvider.tsx"
Cohesion: 0.13
Nodes (16): Core Files, Master Password Lifetime, Module Policy, Security And Vault Context, UI-Safe Metadata, Vault Session Boundary, AuthContext, AuthContextType (+8 more)

### Community 111 - "EditHistoryModal.tsx"
Cohesion: 0.18
Nodes (15): ACTION_ICON, Props, styles, appendLog(), areValuesEqual(), cloneValue(), createLogEntry(), EditHistoryActionType (+7 more)

### Community 112 - "UI Patterns Context"
Cohesion: 0.14
Nodes (11): Chips, Compact Search Behavior, Content Panels, Current Visual Direction, Headers, UI Patterns Context, Verification, Important Boundaries (+3 more)

### Community 113 - "withIosGoogleOAuthScheme.js"
Cohesion: 0.43
Nodes (5): ensureUrlScheme(), normalizeClientId(), {
  ensureUrlScheme,
  toReverseClientIdScheme,
}, toReverseClientIdScheme(), { withInfoPlist }

### Community 114 - "reactNativeReanimated.tsx"
Cohesion: 0.25
Nodes (4): Animated, AnimatedView, Easing, FadeInDown

### Community 116 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, @types/chrome, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react

### Community 117 - "compilerOptions"
Cohesion: 0.29
Nodes (6): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, include

### Community 118 - "Sync.tsx"
Cohesion: 0.18
Nodes (18): Current Vault Format, Implementation Phases, Props, Sync(), createVaultDeviceId(), DeviceIdentity, getCurrentVaultDeviceId(), getDeviceDisplayName() (+10 more)

### Community 119 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, moduleResolution, strict, exclude, extends

### Community 120 - "Store Release Roadmap"
Cohesion: 0.17
Nodes (11): Apple Developer Program, Arratel Setup Plan, Chrome Web Store, Goals, Google Play, Microsoft Store, Publisher Naming, References (+3 more)

### Community 121 - "fill.ts"
Cohesion: 0.35
Nodes (10): applyTargets(), buildNoFieldsResult(), collectFillTargets(), emitInputEvents(), executeFill(), FillSnapshot, FillTarget, previewFill() (+2 more)

### Community 122 - "LogoutStack.tsx"
Cohesion: 0.38
Nodes (5): LogoutStackParamList, LogoutStack(), Stack, LogoutScreen(), LogoutScreenProps

### Community 123 - "rnSodiumProvider.ts"
Cohesion: 0.14
Nodes (11): base64-js, libsodium-wrappers-sumo, react-native-sodium-jsi, getCryptoProvider(), rnSodiumProvider, td, te, verifyProviderInDev() (+3 more)

### Community 124 - "TotpModule.tsx"
Cohesion: 0.22
Nodes (10): otpauth, Props, styles, styles, Totp(), TotpModule(), TotpModuleModuleProps, codeFromUri() (+2 more)

### Community 125 - "brand.ts"
Cohesion: 0.20
Nodes (7): BrandLogo(), CLAVISPASS_BRAND_NAME, CLAVISPASS_EXTENSION_DESCRIPTION, CLAVISPASS_EXTENSION_NAME, CLAVISPASS_POPUP_DESCRIPTION, CLAVISPASS_POPUP_EYEBROW, CLAVISPASS_POPUP_TITLE

### Community 126 - "Header"
Cohesion: 0.09
Nodes (39): Standard Screen Structure, expo-camera, @hello-pangea/dnd, react-native-draggable-flatlist, @react-navigation/native, HomeStackParamList, Stack, NoteFullscreenEditor() (+31 more)

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

### Community 137 - "tab-context.ts"
Cohesion: 0.60
Nodes (5): getActiveDomainContext(), normalizeLookupHost(), parseActiveDomain(), sanitizeHost(), ActiveDomainContext

### Community 138 - "Vault V2 Key Envelope Roadmap"
Cohesion: 0.18
Nodes (10): Current V1 Behavior, Envelope Design Notes, Goal, Master Password Change, Migration Strategy, Non-Goals, Session Boundary, Testing Plan (+2 more)

### Community 141 - "ClavisPass Project Context"
Cohesion: 0.33
Nodes (5): ClavisPass Project Context, Context Files, Core Mental Model, First Runtime Files, High-Risk Areas

### Community 142 - "linux"
Cohesion: 0.67
Nodes (3): linux, depends, deb

### Community 144 - "Crypto Context"
Cohesion: 0.40
Nodes (4): Core Files, Critical Rules, Crypto Context, Verification

### Community 171 - "AttachmentPreviewScreen.native.tsx"
Cohesion: 0.16
Nodes (16): expo-image, getAttachmentPreview(), previews, AttachmentPreviewScreen(), AttachmentPreviewScreenProps, getDataUri(), getExtension(), iframeStyle (+8 more)

### Community 172 - "browser-extension/package.json"
Cohesion: 0.18
Nodes (10): react, react-dom, @types/react, @types/react-dom, typescript, name, private, type (+2 more)

### Community 173 - "AuthReplyBlock"
Cohesion: 0.29
Nodes (5): auth_reply(), AUTH_REPLY_DESCRIPTOR, AuthReplyBlock, AuthState, BlockDescriptor

### Community 175 - "Firefox Store Release Notes"
Cohesion: 0.25
Nodes (7): Extension Identity, Firefox Store Release Notes, Listing, Pre-Submit Check, Privacy Policy Draft, Release Artifacts, Reviewer Notes

### Community 176 - "UI Context"
Cohesion: 0.22
Nodes (8): i18n, Important Files, Interaction Polish, Menus And Dropdowns, Platform Model, Related UI Context, Titlebar And Chrome, UI Context

### Community 178 - "ClavisPass Firefox Add-on Reviewer Build"
Cohesion: 0.33
Nodes (5): Build Steps, ClavisPass Firefox Add-on Reviewer Build, Environment, Firefox Add-on ID, Native Messaging Notes

### Community 179 - "useTheme"
Cohesion: 0.07
Nodes (31): @monaco-editor/react, react-native-gesture-handler, useTheme(), Pattern(), Props, MobileFastAccessOverlay(), subscribeMobileFastAccess(), Props (+23 more)

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

### Community 184 - "AddModuleModal.tsx"
Cohesion: 0.22
Nodes (9): AddModuleModalCompactFav(), defineModules(), IdsOf, MissingIds, ModuleCategory, ModuleMeta, Props, TinyFilterChip() (+1 more)

### Community 185 - "dependencies"
Cohesion: 0.67
Nodes (3): dependencies, react, react-dom

### Community 189 - "CustomTitlebar.tsx"
Cohesion: 0.12
Nodes (21): MainWindowReadySignal(), showMainWindow(), StartBehavior, CustomTitlebar(), Props, styles, TitlebarHeight(), WindowControls() (+13 more)

### Community 195 - "VaultProvider.tsx"
Cohesion: 0.07
Nodes (33): VaultContext, VaultData, VaultProvider(), demoVault, folders, FolderSchema, ValuesListTypeSchema, VaultDataType (+25 more)

### Community 197 - "detectTauriEnvironment"
Cohesion: 0.11
Nodes (31): expo-local-authentication, expo-screen-capture, CloudProvider(), isInvalidGrant(), applyNativeContentProtection(), applyTauriContentProtection(), ContentProtectionContext, ContentProtectionContextValue (+23 more)

### Community 204 - "DocumentTypeEnum"
Cohesion: 0.33
Nodes (6): DocumentTypeEnum, BITWARDEN, CHROME, FIREFOX, KDBX, PCLOUD

## Knowledge Gaps
- **128 isolated node(s):** `react`, `react-dom`, `@types/chrome`, `@types/react`, `@types/react-dom` (+123 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1638 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **43 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `ModulesEnum.ts`, `store.ts`, `ValuesType.ts`, `package.json`, `VaultProvider.tsx`, `appScheme.test.ts`, `DraggableModulesList.shared.tsx`, `googleOAuth.ts`, `HomeScreen.tsx`, `vaultDevices.ts`, `withIosGoogleOAuthScheme.js`, `createUniqueID`, `ClavisPassHubClient.ts`, `vite.config.ts`, `logger.ts`, `GoogleDriveClient.test.ts`, `generatePassword.ts`, `decryptVaultContent.ts`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **What connects `react`, `react-dom`, `@types/chrome` to the rest of the system?**
  _128 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ModulesEnum.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04519350811485643 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `ref_react` to `RecoveryCodesModule.tsx`, `package.json`, `getModule.tsx`, `App.tsx`, `EditScreen.tsx`, `HomeScreen.tsx`, `useVault`, `AnalysisScreen.tsx`, `useSetting`, `FastAccess.ts`, `AnalysisDetailScreen.tsx`, `ClavisPassHubClient.ts`, `logger.ts`, `UpdateManager.tsx`, `store.ts`, `LoginScreen.tsx`, `AttachmentModule.tsx`, `DraggableModulesList.shared.tsx`, `useAuth`, `AttachmentPreviewScreen.native.tsx`, `GoogleDriveLoginButton.tsx`, `CreditCardModule.tsx`, `useTheme`, `AddModuleModal.tsx`, `CustomTitlebar.tsx`, `NoteModule.tsx`, `ValuesType.ts`, `ModulesEnum`, `detectTauriEnvironment`, `googleOAuth.ts`, `model/types.ts`, `EditRowControlsContainer.tsx`, `Modal`, `SettingsScreen.tsx`, `IdentitiesScreen.tsx`, `BrowserExtensionsScreen.tsx`, `ThemeProvider.tsx`, `container/AnimatedOpacityContainer.tsx`, `AuthProvider.tsx`, `EditHistoryModal.tsx`, `Sync.tsx`, `TotpModule.tsx`, `Header`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.01904761904761905 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.02666666666666667 - nodes in this community are weakly interconnected._
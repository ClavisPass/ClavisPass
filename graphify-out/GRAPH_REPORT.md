# Graph Report - ClavisPass  (2026-10-09)

## Corpus Check
- 564 files · ~340,714 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 36 file(s) not represented in the graph (top: .xml 11, (none) 8, .properties 2)

## Summary
- 3757 nodes · 10410 edges · 195 communities (148 shown, 47 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 145 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `31f48667`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- getModule.tsx
- dependencies
- react-native-paper
- ref_react
- package.json
- EditScreen.tsx
- App.tsx
- SettingsScreen.tsx
- useSetting
- useVault
- riskModel.ts
- content/index.ts
- shared/types.ts
- popup/App.tsx
- AnimatedContainer
- background/index.ts
- shared/bridge.ts
- AuthProvider.tsx
- DigitalCardModule.tsx
- FastAccess.ts
- AnalysisDetailScreen.tsx
- expo
- ClavisPassHubClient.ts
- ScanScreen.tsx
- write.rs
- scripts
- ModuleReorderScreen.tsx
- manifest.json
- GlobalClipboardSnackbar.tsx
- forms.ts
- lib.rs
- model/types.ts
- UpdateManager.tsx
- BrowserExtensionsScreen.tsx
- commands.rs
- LoginScreen.tsx
- verifyVaultV1Provider.ts
- deriveIdentityClusters.ts
- state.ts
- DraggableModulesList.shared.tsx
- mapKdbxToClavisPass.ts
- HotkeyRecorderItem.tsx
- host.rs
- DeviceStorageClient.ts
- GoogleDriveLoginButton.tsx
- release.js
- GoogleDriveClient.ts
- react-native-reanimated
- screen_lock.rs
- ClavisPass Website Marketing Brief
- createUniqueID
- pairing.rs
- CloseBehaviorState
- ClavisPass Native Messaging Bridge
- CardItem.tsx
- TemplateEnum
- vite.config.ts
- devDependencies
- prepare-msix.js
- VaultProvider.tsx
- Vault V2 Key Envelope Roadmap
- mergeVaultData.ts
- ClavisPass
- vault.rs
- useTheme
- compilerOptions
- AttachmentModule.tsx
- SettingsProvider.tsx
- CloudProvider.tsx
- reactNativePaper.tsx
- MainApplication.kt
- ModulesEnum
- NavigationContainer.tsx
- Datenschutzerklärung
- NoteModule.tsx
- reactNative.ts
- Privacy Policy
- native_host_registration.rs
- Nutzungsbedingungen
- ObjcId
- prepare-native-host-sidecar.js
- decryptVaultContent.ts
- react-native
- MainActivity.kt
- session.rs
- scripts
- autofill-preferences.ts
- CryptoProvider
- CreditCardModule.tsx
- ValueIconsEnum
- Terms Of Use
- protocol.rs
- generatePassword.ts
- check-tauri-version-sync.js
- AnalysisScreen.tsx
- ClavisPass Product Strategy Roadmap
- DevicesScreen.tsx
- bundle
- analysisEngine.ts
- Identity Management Concept
- HomeScreen.tsx
- Login.tsx
- tauri.conf.json
- withAndroidApplicationId.js
- build-web-demo.js
- path.rs
- plugins
- domain.ts
- errorBus.ts
- container/AnimatedOpacityContainer.tsx
- AuthState
- editHistory.ts
- logger.ts
- expo-constants
- reactNativeReanimated.tsx
- reactNavigationNative.ts
- devDependencies
- compilerOptions
- withIosGoogleOAuthScheme.js
- tsconfig.json
- Store Release Roadmap
- ClavisPassHubDiscoveryResult.ts
- ref_fs
- vcardExport.ts
- totp.ts
- authenticateUser.ts
- FilterAnalysisModal.tsx
- macOS
- windows
- gorhomBottomSheet.tsx
- WifiTypeEnum
- build
- vite-env.d.ts
- BrandHeader.tsx
- InlineNotice.tsx
- BridgeStatusBadge.tsx
- DropdownLayer.web.tsx
- linux
- asyncStorage.ts
- expoVectorIcons.tsx
- tokens.ts
- env.d.ts
- DROPBOX_CLIENT_ID
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_ID_ANDROID
- GOOGLE_CLIENT_ID_DESKTOP
- GOOGLE_CLIENT_ID_IOS
- GOOGLE_CLIENT_SECRET_DESKTOP
- ClavisPass
- AppearanceSettingsSection.tsx
- browser-extension/package.json
- VaultV1.ts
- Sync And Storage Context
- Firefox Store Release Notes
- UI Context
- Desktop And Tauri Context
- ClavisPass Firefox Add-on Reviewer Build
- tab-context.ts
- Bitwarden Import Roadmap
- Agent Workflow Context
- Build, Release, And Update Context
- Identity Context
- ReorderScreen.tsx
- dependencies
- CLAUDE.md
- .claude/CLAUDE.md
- ClavisPass Agent Context
- Security And Vault Context
- NoteEditorScreen.tsx
- Crypto Context
- SettingsContainer.tsx
- hotkeyRecordingBus.ts

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 265 edges
2. `react-native` - 182 edges
3. `react-native-paper` - 128 edges
4. `ModulesEnum` - 110 edges
5. `react-i18next` - 100 edges
6. `detectTauriEnvironment()` - 80 edges
7. `AnimatedPressable` - 78 edges
8. `Modal()` - 57 edges
9. `SettingsScreen()` - 56 edges
10. `useVault()` - 55 edges

## Surprising Connections (you probably didn't know these)
- `Master Password Lifetime` --references--> `AuthProvider()`  [INFERRED]
  docs/context/security.md → src/app/providers/AuthProvider.tsx
- `Implementation` --references--> `AuthProvider()`  [INFERRED]
  README.md → src/app/providers/AuthProvider.tsx
- `Tokens` --references--> `CloudProvider()`  [INFERRED]
  docs/context/sync-storage.md → src/app/providers/CloudProvider.tsx
- `High-Risk Rules` --references--> `VaultProvider()`  [INFERRED]
  AGENTS.md → src/app/providers/VaultProvider.tsx
- `Vault Session Boundary` --references--> `VaultProvider()`  [INFERRED]
  docs/context/security.md → src/app/providers/VaultProvider.tsx

## Import Cycles
- None detected.

## Communities (195 total, 47 thin omitted)

### Community 0 - "getModule.tsx"
Cohesion: 0.04
Nodes (88): zod, AddressModule(), CompanyModule(), DocumentModule(), KeyModule(), PersonModule(), PinModule(), UsernameModule() (+80 more)

### Community 1 - "dependencies"
Cohesion: 0.02
Nodes (105): dependencies, argon2-browser, @babel/plugin-proposal-export-namespace-from, base64-js, crypto-js, expo, expo-auth-session, expo-blur (+97 more)

### Community 2 - "react-native-paper"
Cohesion: 0.09
Nodes (45): Shared Module UI, react-i18next, react-native-paper, FastAccessType, FastAccessTypeSchema, EditRowControlsContainer(), ModuleContainer(), ModuleContainerProps (+37 more)

### Community 3 - "ref_react"
Cohesion: 0.13
Nodes (14): ClearCompletedTasksModal(), Props, ClearModulesModal(), Props, Props, DeleteModuleModal(), Props, DiscardChangesModal() (+6 more)

### Community 4 - "package.json"
Cohesion: 0.03
Nodes (68): react, react-dom, @types/react, @types/react-dom, typescript, main, name, private (+60 more)

### Community 5 - "EditScreen.tsx"
Cohesion: 0.04
Nodes (93): Interaction Polish, Item Surfaces, expo-image, IdentityStackParamList, Stack, extractFastAccessObject(), IdentityEmailLogo(), IdentityEmailLogoProps (+85 more)

### Community 6 - "App.tsx"
Cohesion: 0.06
Nodes (66): App(), AppShell(), AppWithNavigation(), DemoBootstrap(), getCurrentWindowSafe(), MainWindowReadySignal(), withAlpha(), expo-screen-capture (+58 more)

### Community 7 - "SettingsScreen.tsx"
Cohesion: 0.06
Nodes (38): expo-linear-gradient, react-native-vector-icons, simple-icons, @tauri-apps/plugin-autostart, @tauri-apps/plugin-shell, useContentProtection(), DevModeContext, DevModeContextType (+30 more)

### Community 8 - "useSetting"
Cohesion: 0.07
Nodes (37): Standard Checklist, Chips, Compact Search Behavior, Content Panels, Current Visual Direction, Headers, Standard Screen Structure, UI Patterns Context (+29 more)

### Community 9 - "useVault"
Cohesion: 0.19
Nodes (21): useVault(), BackupExportButton(), ChangeMasterPasswordModal(), Props, Sync(), createVaultDeviceId(), DeviceIdentity, getCurrentVaultDeviceId() (+13 more)

### Community 10 - "riskModel.ts"
Cohesion: 0.18
Nodes (17): buildAnalysisCache(), findSequentialTriples(), hasRepeatedChars(), strengthFromEntropyBits(), CHARSET_SIZES, EntropyOptions, estimateCharsetSize(), hasUnicodeProps (+9 more)

### Community 11 - "content/index.ts"
Cohesion: 0.09
Nodes (49): applyTargets(), buildNoFieldsResult(), collectFillTargets(), emitInputEvents(), executeFill(), FillPreviewResult, FillSnapshot, FillTarget (+41 more)

### Community 12 - "shared/types.ts"
Cohesion: 0.06
Nodes (39): BackgroundHandler, BackgroundHandlerMap, BackgroundMessageContext, BackgroundMessageRouter, FillStateCardProps, GetFillDataForEntryPayload, ExtensionMessage, isExtensionMessage() (+31 more)

### Community 13 - "popup/App.tsx"
Cohesion: 0.07
Nodes (41): registerContentFrame(), setupSavePromptListener(), App(), handleFill(), handleOpenDesktopApp(), handlePromptResolution(), handleToggleSavePrompts(), handleUpdateAutofillMode() (+33 more)

### Community 14 - "AnimatedContainer"
Cohesion: 0.17
Nodes (17): react-native-pdf, getAttachmentPreview(), AttachmentPreviewScreen(), AttachmentPreviewScreenProps, getDataUri(), getExtension(), iframeStyle, AttachmentPreviewScreen() (+9 more)

### Community 15 - "background/index.ts"
Cohesion: 0.10
Nodes (45): clearAutofillDomainCache(), countPasswordSuggestions(), DomainAutofillCache, DomainAutofillCacheEntry, getAutofillEligibilityForUrl(), getCachedAutofillMatchCountForUrl(), getCachedMatchCount(), isFresh() (+37 more)

### Community 16 - "shared/bridge.ts"
Cohesion: 0.07
Nodes (42): Architecture, Browser loading notes, ClavisPass Browser Extension, Current feature set, Desktop bridge, Development, Important note, Working from the repo root (+34 more)

### Community 17 - "AuthProvider.tsx"
Cohesion: 0.13
Nodes (15): ClavisPass Project Context, Context Files, Core Mental Model, First Runtime Files, High-Risk Areas, AuthContext, AuthContextType, AuthMasterContext (+7 more)

### Community 18 - "DigitalCardModule.tsx"
Cohesion: 0.29
Nodes (8): DigitalCardModule(), DigitalCardModuleProps, isDigitalCardType(), styles, DIGITAL_CARD_TYPES, DigitalCardType, DigitalCardModuleType, regex

### Community 19 - "FastAccess.ts"
Cohesion: 0.11
Nodes (30): FastAccessSessionBridge(), MobileFastAccessOverlay(), FAST_ACCESS_NOTIFICATION_CATEGORY, FAST_ACCESS_POPUP_LABEL, FAST_ACCESS_POSITION_CHANGED_EVENT, FAST_ACCESS_READY_EVENT, FAST_ACCESS_UPDATE_EVENT, FastAccessPayload (+22 more)

### Community 20 - "AnalysisDetailScreen.tsx"
Cohesion: 0.14
Nodes (21): useAuthMaster(), canonicalizeForVariants(), deriveAnalysisPepperFromMaster(), fingerprintPassword(), getPasswordStrengthColor(), AnalysisDetailScreen(), AnalysisDetailScreenProps, analyzeCharacterComposition() (+13 more)

### Community 21 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, adaptiveIcon, blockedPermissions, package, permissions, versionCode, projectId (+31 more)

### Community 22 - "ClavisPassHubClient.ts"
Cohesion: 0.13
Nodes (36): calculateExpiresIn(), createHubError(), createHubErrorFromPayload(), DiscoveryResponse, ensureVaultEtagForUpload(), fetchFile(), fetchUserInfo(), fetchVaultMeta() (+28 more)

### Community 23 - "ScanScreen.tsx"
Cohesion: 0.12
Nodes (18): expo-camera, expo-status-bar, @react-navigation/native, HomeStackParamList, SessionQrPayload, BARCODE_TYPE_MAP, DigitalCardScanScreen(), DigitalCardScanScreenProps (+10 more)

### Community 24 - "write.rs"
Cohesion: 0.12
Nodes (31): write_request_store_path(), as_io_error(), BrowserWriteKind, CreateEntryFromBrowser, UpdateEntryFromBrowser, BrowserWriteRequest, BrowserWriteRequestStore, BrowserWriteResult (+23 more)

### Community 25 - "scripts"
Cohesion: 0.05
Nodes (37): scripts, android, android:build:apk, android:build:store, android:build:store-submit, android:submit:store, extension:build, extension:build:chrome (+29 more)

### Community 26 - "ModuleReorderScreen.tsx"
Cohesion: 0.17
Nodes (9): react-native-gesture-handler, Pattern(), Props, EditRowControlsContainerProps, NativeDragHandleScrollLockContext, WebDragHandlePropsContext, dragDropAnimationConfig, ModuleReorderScreenProps (+1 more)

### Community 27 - "manifest.json"
Cohesion: 0.06
Nodes (35): action, default_icon, default_popup, default_title, background, service_worker, type, browser_specific_settings (+27 more)

### Community 28 - "GlobalClipboardSnackbar.tsx"
Cohesion: 0.07
Nodes (27): expo-clipboard, i18next, getClipboardText(), setClipboardText(), tryNavigatorReadText(), tryNavigatorWriteText(), clipboardClearScheduler, ClipboardContentKind (+19 more)

### Community 29 - "forms.ts"
Cohesion: 0.11
Nodes (33): AutofillPlan, buildAutofillPlan(), buildDetachedContainer(), buildFieldKey(), buildFieldText(), buildFormId(), chooseBestField(), ClassifiedField (+25 more)

### Community 30 - "lib.rs"
Cohesion: 0.11
Nodes (19): clamp_window_size(), clamp_window_size_to_monitor(), DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIDTH, emit_lock_vault(), emit_vault_file_open_request(), get_requested_vault_file_path(), get_window_size_file_path() (+11 more)

### Community 31 - "model/types.ts"
Cohesion: 0.10
Nodes (22): AddTriggerStackParamList, AnalysisStackParamList, AppTabsParamList, LogoutStackParamList, RootStackParamList, SettingsStackParamList, AddTriggerStack(), Stack (+14 more)

### Community 32 - "UpdateManager.tsx"
Cohesion: 0.12
Nodes (27): expo-updates, @tauri-apps/plugin-process, @tauri-apps/plugin-updater, Listener, listeners, publishUpdateCheck(), subscribeUpdateCheck(), unsubscribeUpdateCheck() (+19 more)

### Community 33 - "BrowserExtensionsScreen.tsx"
Cohesion: 0.14
Nodes (25): BrowserBridgePairingPrompt(), PairingAction, PromptButton(), styles, actOnBrowserExtensionPairing(), BrowserExtensionPairingChangeListener, buildBrowserClientKey(), listBrowserExtensionPairings() (+17 more)

### Community 34 - "commands.rs"
Cohesion: 0.09
Nodes (12): AUTH_REPLY_DESCRIPTOR, AUTH_REPLY_SIGNATURE, authenticate_with_system(), BLOCK_HAS_SIGNATURE, BlockDescriptor, CF_UNICODETEXT_FORMAT, get_main_window_hwnd(), LAPOLICY_DEVICE_OWNER_AUTHENTICATION (+4 more)

### Community 35 - "LoginScreen.tsx"
Cohesion: 0.15
Nodes (35): expo-network, @react-navigation/native-stack, LoginStackParamList, Stack, useToken(), OnlineContext, OnlineContextType, Props (+27 more)

### Community 36 - "verifyVaultV1Provider.ts"
Cohesion: 0.12
Nodes (13): base64-js, libsodium-wrappers-sumo, react-native-sodium-jsi, getCryptoProvider(), getCryptoProvider(), rnSodiumProvider, td, te (+5 more)

### Community 37 - "deriveIdentityClusters.ts"
Cohesion: 0.29
Nodes (11): buildPasswordUseCounts(), deriveIdentityClusters(), entryHasSimplePasswordRisk(), getEntryDomains(), getEntryModuleTypes(), getEntryPasswordValues(), getEntrySignals(), getModuleValue() (+3 more)

### Community 38 - "state.ts"
Cohesion: 0.12
Nodes (16): buildCreatePayload(), buildUpdatePayload(), resolvePromptWithDesktopWrite(), toAppliedResult(), buildPromptTitle(), ExtensionState, normalizeIdentity(), PreparedFillRecord (+8 more)

### Community 39 - "DraggableModulesList.shared.tsx"
Cohesion: 0.16
Nodes (22): @hello-pangea/dnd, NativeDragHandleScrollLockProvider(), WebDragHandlePropsProvider(), dragDropAnimationConfig, DraggableModulesList(), DraggableModulesFooter(), DraggableModulesListProps, draggableModulesListStyles (+14 more)

### Community 40 - "mapKdbxToClavisPass.ts"
Cohesion: 0.15
Nodes (22): kdbxweb, configureKdbxArgon2(), importKdbx(), addCustomField(), addTotpModule(), addValueModule(), binaryToBytes(), binaryWithMetaToAttachment() (+14 more)

### Community 41 - "HotkeyRecorderItem.tsx"
Cohesion: 0.60
Nodes (4): HotkeyRecorderItem(), Props, getDefaultHotkey(), getHotkeyConflict()

### Community 42 - "host.rs"
Cohesion: 0.16
Nodes (17): app_scheme(), bridge_result_to_response(), ensure_ready(), FillPayload, handle_request(), pairing_required(), PeerInfo, read_frame() (+9 more)

### Community 43 - "DeviceStorageClient.ts"
Cohesion: 0.13
Nodes (28): @react-native-async-storage/async-storage, Props, UserInfoProps, fetchFile(), getActiveLocalVaultIdKey(), getLocalSyncKey(), getLocalSyncMetadataKey(), getVaultLocalSyncKey() (+20 more)

### Community 44 - "GoogleDriveLoginButton.tsx"
Cohesion: 0.12
Nodes (29): expo-auth-session, expo-random, expo-web-browser, @fabianlars/tauri-plugin-oauth, ANDROID_AUTH_PROMPT_OPTIONS, randState(), SCOPES, ANDROID_AUTH_PROMPT_OPTIONS (+21 more)

### Community 45 - "release.js"
Cohesion: 0.12
Nodes (19): androidGradleHasVersionCode(), androidGradleHasVersionName(), androidStringsHasRuntimeVersion(), cargoLockHasVersion(), cargoTomlHasVersion(), { execSync }, existingTags, filesToUpdate (+11 more)

### Community 46 - "GoogleDriveClient.ts"
Cohesion: 0.14
Nodes (19): buildMultipartBody(), escapeDriveQueryString(), fetchFile(), findFileIdByName(), GoogleTokenRefreshError, readJsonSafe(), readTextSafe(), refreshAccessToken() (+11 more)

### Community 47 - "react-native-reanimated"
Cohesion: 0.10
Nodes (30): react-native-reanimated, FilterItem, FiltersNarrowProps, FiltersWide, FiltersWideProps, styles, ExpiryOverviewEntry, ExpiryOverviewItem() (+22 more)

### Community 48 - "screen_lock.rs"
Cohesion: 0.11
Nodes (8): DeviceIdentity, get_device_identity(), CGSessionCopyCurrentDictionary(), emit(), ScreenLockPayload, Session, start(), wndproc()

### Community 49 - "ClavisPass Website Marketing Brief"
Cohesion: 0.05
Nodes (43): Attachments And Previews, Brand Details, Bring Your Own Sync, Browser Extension, Can I import my existing passwords?, Can my cloud provider read my passwords?, ClavisPass Website Marketing Brief, Conversion Priorities (+35 more)

### Community 50 - "createUniqueID"
Cohesion: 0.16
Nodes (27): addCardModule(), addCustomField(), addExpiryModule(), addIdentityModules(), addLoginModules(), addNote(), addSshKeyModule(), addTotp() (+19 more)

### Community 51 - "pairing.rs"
Cohesion: 0.10
Nodes (29): bridge_approve_pairing(), bridge_claim_pending_writes(), bridge_complete_write_request(), bridge_list_paired_clients(), bridge_list_pending_pairings(), bridge_list_rejected_clients(), bridge_publish_session(), bridge_reject_pairing() (+21 more)

### Community 52 - "CloseBehaviorState"
Cohesion: 0.13
Nodes (10): claim_pending_lock_request(), close_main_window(), CloseBehavior, Exit, Hide, CloseBehaviorState, focus_main_window(), schedule_exit_watchdog() (+2 more)

### Community 53 - "ClavisPass Native Messaging Bridge"
Cohesion: 0.08
Nodes (23): Chosen architecture, Chromium and Edge registration, ClavisPass Native Messaging Bridge, Edge verification, Example usage, Expected failure cases, Future hardening, Local development (+15 more)

### Community 54 - "CardItem.tsx"
Cohesion: 0.21
Nodes (18): expo-blur, @kichiyaki/react-native-barcode-generator, react-qr-code, CardItem(), Props, styles, DigitalCardPalette, extractUrlFromEntry() (+10 more)

### Community 55 - "TemplateEnum"
Cohesion: 0.15
Nodes (13): TemplateEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+5 more)

### Community 57 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, @babel/core, eslint, eslint-config-universe, patch-package, prettier, react-test-renderer, @tauri-apps/cli (+14 more)

### Community 58 - "prepare-msix.js"
Cohesion: 0.10
Nodes (16): appExe, appVersion, assetsOutputDir, createUnplatedTargetSizeIcons(), escapePowerShellSingleQuoted(), fs, manifest, manifestSource (+8 more)

### Community 59 - "VaultProvider.tsx"
Cohesion: 0.06
Nodes (54): papaparse, vitest, VaultContext, VaultContextType, VaultData, VaultProvider(), applyUpdateToEntry(), BrowserWriteKind (+46 more)

### Community 60 - "Vault V2 Key Envelope Roadmap"
Cohesion: 0.17
Nodes (11): Current V1 Behavior, Envelope Design Notes, Goal, Implementation Phases, Master Password Change, Migration Strategy, Non-Goals, Session Boundary (+3 more)

### Community 61 - "mergeVaultData.ts"
Cohesion: 0.18
Nodes (22): VaultEntryTombstone, addLatestTombstones(), areSame(), clone(), conflictCopyMatchesBaseEntry(), conflictCopyWasDeleted(), entryContentFingerprint(), entryIsDeletedBy() (+14 more)

### Community 62 - "ClavisPass"
Cohesion: 0.07
Nodes (28): 1. VaultSession (Authoritative & Secret-Capable), 2. VaultProvider (UI-Safe Projection), Authentication & Master Secret Handling, Backend / Plattform, CI / CD & Deployment, ClavisPass, Cryptography & Encryption Model, Defensive Defaults (+20 more)

### Community 63 - "vault.rs"
Cohesion: 0.22
Nodes (20): domain_contains(), fill_data_for_entry(), FillDataResult, first_string(), FolderRef, login_entry(), match_domain_score(), normalize_domain() (+12 more)

### Community 64 - "useTheme"
Cohesion: 0.06
Nodes (63): @gorhom/bottom-sheet, useTheme(), Props, Props, styles, Props, TokenQRCodeModal(), Props (+55 more)

### Community 65 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+11 more)

### Community 66 - "AttachmentModule.tsx"
Cohesion: 0.16
Nodes (20): expo-document-picker, @tauri-apps/plugin-dialog, @tauri-apps/plugin-fs, AttachmentModule(), canPreviewAttachment(), downloadBrowserAttachment(), formatBytes(), getAttachmentIcon() (+12 more)

### Community 67 - "SettingsProvider.tsx"
Cohesion: 0.06
Nodes (45): DEFAULT_KEYS, loadSettingWithTimeout(), SettingsContext, SettingsContextValue, SettingsState, configureMobileFastAccess(), Corner, CornerOption() (+37 more)

### Community 68 - "CloudProvider.tsx"
Cohesion: 0.21
Nodes (13): CloudProvider(), isInvalidGrant(), OAuthRefreshError, Props, StoredAuth, TokenContext, TokenContextValue, refreshAccessToken() (+5 more)

### Community 69 - "reactNativePaper.tsx"
Cohesion: 0.11
Nodes (14): ActivityIndicator, baseColors, Button, Chip, Divider, Icon, IconButton, MD3DarkTheme (+6 more)

### Community 71 - "ModulesEnum"
Cohesion: 0.07
Nodes (27): DEMO_MASTER_PASSWORD, demoVault, folders, ModulesEnum, ADDRESS, ATTACHMENT, COMPANY, CREDIT_CARD (+19 more)

### Community 72 - "NavigationContainer.tsx"
Cohesion: 0.33
Nodes (9): ProtectedRoute(), getFocusedRouteName(), NavigationnContainer(), titlebarContentDragRoutes, titlebarLightRoutes, LoginStack(), TabNavigator(), subscribeOpenAddValueRequest() (+1 more)

### Community 73 - "Datenschutzerklärung"
Cohesion: 0.09
Nodes (22): 10. Browser-Erweiterung, 11. Benachrichtigungen, 12. Kontaktaufnahme, 13. Webseite und Hosting, 14. Cookies, Tracking und Analytics, 15. App Stores und Download-Plattformen, 16. Rechtsgrundlagen, 17. Speicherdauer (+14 more)

### Community 74 - "NoteModule.tsx"
Cohesion: 0.10
Nodes (22): JsonLine(), NoteCodePreview(), Props, styles, InlinePart, InlineText(), parseInline(), Props (+14 more)

### Community 75 - "reactNative.ts"
Cohesion: 0.11
Nodes (13): Animated, AnimatedValue, Dimensions, InteractionManager, Platform, Pressable, ScrollView, setPlatform() (+5 more)

### Community 76 - "Privacy Policy"
Cohesion: 0.09
Nodes (22): 10. Browser Extension, 11. Notifications, 12. Contact, 13. Website And Hosting, 14. Cookies, Tracking And Analytics, 15. App Stores And Download Platforms, 16. Legal Bases, 17. Retention (+14 more)

### Community 77 - "native_host_registration.rs"
Cohesion: 0.19
Nodes (10): CHROME_EXTENSION_IDS, chromium_origins(), CREATE_NO_WINDOW, EDGE_EXTENSION_IDS, find_native_host_exe(), FIREFOX_EXTENSION_ID, native_host_candidates(), NATIVE_HOST_NAME (+2 more)

### Community 78 - "Nutzungsbedingungen"
Cohesion: 0.10
Nodes (20): 10. Erlaubte Nutzung, 11. Open Source und Lizenzen, 12. Kosten, 13. Drittanbieter, 14. Updates, 15. Haftung, 16. Beendigung der Nutzung, 17. Änderungen (+12 more)

### Community 79 - "ObjcId"
Cohesion: 0.19
Nodes (17): auth_reply(), authenticate_with_system_impl(), AuthReplyBlock, _Block_copy(), _Block_release(), check_system_auth_available(), cstring(), new_la_context() (+9 more)

### Community 80 - "prepare-native-host-sidecar.js"
Cohesion: 0.14
Nodes (12): cargoArgs, { copyFileSync, existsSync, mkdirSync, writeFileSync }, detectHostTriple(), { execFileSync }, { join, resolve }, manifestPath, outputDir, outputPath (+4 more)

### Community 81 - "decryptVaultContent.ts"
Cohesion: 0.20
Nodes (13): getEmptyData(), decryptVaultContent(), DecryptVaultContentResult, makeV2KeywrapAadBytes(), makeV2PayloadAadBytes(), te, V2_KEYWRAP_AAD_OBJECT, V2_PAYLOAD_AAD_OBJECT (+5 more)

### Community 82 - "react-native"
Cohesion: 0.04
Nodes (50): @monaco-editor/react, react-native, react-native-circular-progress, Props, styles, Props, ThemeContext, ThemeContextType (+42 more)

### Community 84 - "session.rs"
Cohesion: 0.27
Nodes (8): session_store_path(), BridgeSessionSnapshot, clear_session(), load_session(), now_ms(), publish_session(), SESSION_TTL_MS, write_json_atomically()

### Community 85 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, build:chrome, build:firefox, build:firefox-local, dev, package:chrome, package:firefox (+6 more)

### Community 86 - "autofill-preferences.ts"
Cohesion: 0.32
Nodes (12): buildPreferenceResult(), DEFAULT_POLICY, DomainPolicyStore, getInlineAutofillPreferenceForUrl(), normalizeHost(), normalizeMode(), normalizePolicy(), readPolicyStore() (+4 more)

### Community 87 - "CryptoProvider"
Cohesion: 0.27
Nodes (9): CryptoProvider, decryptVaultV1(), encryptVaultV1(), verifyVaultV1Provider(), assertBytesEqual(), assertV2Lengths(), createWrappedDataKey(), decryptVaultV2() (+1 more)

### Community 88 - "CreditCardModule.tsx"
Cohesion: 0.26
Nodes (13): CreditCardModule(), CreditCardState, detectCardBrand(), digitsOnly(), formatCardNumber(), maskCardNumber(), passesLuhn(), Props (+5 more)

### Community 89 - "ValueIconsEnum"
Cohesion: 0.14
Nodes (13): ValueIconsEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+5 more)

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

### Community 94 - "AnalysisScreen.tsx"
Cohesion: 0.16
Nodes (18): Stack, FiltersNarrow, normalize(), AnalysisScreen(), AnalysisScreenProps, AnalysisTab, FilterItem, filterValuesWithNonEmptySecrets() (+10 more)

### Community 95 - "ClavisPass Product Strategy Roadmap"
Cohesion: 0.11
Nodes (17): 1. Browser Extension Polish, 2. Passkeys, 3. Emergency Access / Trusted Contact, 4. Optional Web App, 5. Separate Secrets Sharing SaaS, Bitwarden Gaps To Treat As Strategic, ClavisPass Personal, ClavisPass Product Strategy Roadmap (+9 more)

### Community 96 - "DevicesScreen.tsx"
Cohesion: 0.16
Nodes (16): daysBetween(), DEFAULT_DEVICE_UI_POLICY, deriveDeviceUiStatus(), DeviceUiPolicy, DeviceUiStatus, earliestIso(), hasSameDeviceIdentity(), normalizeDeviceIdentityPart() (+8 more)

### Community 97 - "bundle"
Cohesion: 0.17
Nodes (12): bundle, active, category, copyright, createUpdaterArtifacts, externalBin, fileAssociations, icon (+4 more)

### Community 98 - "analysisEngine.ts"
Cohesion: 0.20
Nodes (11): expo-crypto, AnalysisFlags, AnalysisRef, CachedAnalysisItem, CacheResult, THRESH_BITS, fetchRange(), getPwnedCountForPassword() (+3 more)

### Community 99 - "Identity Management Concept"
Cohesion: 0.13
Nodes (14): Confidence And Trust, Core Idea, Data Model Direction, Design Tone, Identity Detail View, Identity Management Concept, Identity Tab, Important Principle (+6 more)

### Community 100 - "HomeScreen.tsx"
Cohesion: 0.05
Nodes (40): Common Refactor Targets, Files To Check First, Known Custom Screens, Screen Standardization Context, @react-native-masked-view/masked-view, react-native-svg, @shopify/flash-list, ExpiryModule() (+32 more)

### Community 101 - "Login.tsx"
Cohesion: 0.29
Nodes (12): react-native-progress, Login(), Props, consumeSystemAuthAutoUnlockSuppression(), PasswordModule(), computeEntropyBitsForUi(), ENTROPY_CAP_BITS, entropyToProgress() (+4 more)

### Community 102 - "tauri.conf.json"
Cohesion: 0.18
Nodes (10): app, macOSPrivateApi, security, windows, identifier, mainBinaryName, productName, $schema (+2 more)

### Community 103 - "withAndroidApplicationId.js"
Cohesion: 0.20
Nodes (4): fs, path, { withDangerousMod }, { withXcodeProject }

### Community 104 - "build-web-demo.js"
Cohesion: 0.20
Nodes (8): demoDotenvPath, demoEnv, env, fs, path, result, rewriteDemoPublicPaths(), { spawnSync }

### Community 105 - "path.rs"
Cohesion: 0.48
Nodes (6): bridge_dir(), BRIDGE_ENV_KEY, ensure_dir(), pairing_store_path(), platform_base_dir(), write_result_store_path()

### Community 106 - "plugins"
Cohesion: 0.20
Nodes (10): args, customProtocol, plugins, cli, deepLink, updater, endpoints, pubkey (+2 more)

### Community 107 - "domain.ts"
Cohesion: 0.36
Nodes (8): buildEntrySuggestions(), normalizeHost(), normalizeLookupHost(), safeUrl(), scoreUrlMatch(), searchEntries(), EntrySuggestion, VaultEntry

### Community 108 - "errorBus.ts"
Cohesion: 0.42
Nodes (6): Listener, listeners, subscribeGlobalError(), unsubscribeGlobalError(), GlobalErrorPayload, GlobalErrorSnackbar()

### Community 109 - "container/AnimatedOpacityContainer.tsx"
Cohesion: 0.31
Nodes (6): AnimatedOpacityContainer(), Props, AnimatedOpacityContainerWeb(), Props, Props, AnimatedOpacityContainer()

### Community 111 - "editHistory.ts"
Cohesion: 0.23
Nodes (12): appendLog(), areValuesEqual(), cloneValue(), createLogEntry(), EditHistoryActionType, EditHistoryMeta, EditSessionLogEntry, HistoryEntry (+4 more)

### Community 112 - "logger.ts"
Cohesion: 0.20
Nodes (10): expo-notifications, buildPendingExpiryReminders(), cancelScheduledExpiryReminders(), configureNotificationHandler(), ExpiryNotificationScheduler(), getReminderDate(), PendingExpiryReminder, logger (+2 more)

### Community 113 - "expo-constants"
Cohesion: 0.31
Nodes (7): expo-constants, getMobileRedirectUri(), getAppRedirectUri(), getAppScheme(), Constants, resetExpoConfig(), setExpoConfig()

### Community 114 - "reactNativeReanimated.tsx"
Cohesion: 0.25
Nodes (4): Animated, AnimatedView, Easing, FadeInDown

### Community 116 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, @types/chrome, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react

### Community 117 - "compilerOptions"
Cohesion: 0.29
Nodes (6): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, include

### Community 118 - "withIosGoogleOAuthScheme.js"
Cohesion: 0.43
Nodes (5): ensureUrlScheme(), normalizeClientId(), {
  ensureUrlScheme,
  toReverseClientIdScheme,
}, toReverseClientIdScheme(), { withInfoPlist }

### Community 119 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, moduleResolution, strict, exclude, extends

### Community 120 - "Store Release Roadmap"
Cohesion: 0.17
Nodes (11): Apple Developer Program, Arratel Setup Plan, Chrome Web Store, Goals, Google Play, Microsoft Store, Publisher Naming, References (+3 more)

### Community 121 - "ClavisPassHubDiscoveryResult.ts"
Cohesion: 0.29
Nodes (6): ClavisPassHubDiscoveryResult, ClavisPassHubDiscoveryStatus, DiscoveryCheckingResult, DiscoveryErrorResult, DiscoveryIdleResult, DiscoverySuccessResult

### Community 123 - "vcardExport.ts"
Cohesion: 0.30
Nodes (11): expo-file-system, expo-sharing, buildFormattedName(), buildVCard(), canExportVCard(), clean(), escapeVCardText(), exportVCard() (+3 more)

### Community 125 - "authenticateUser.ts"
Cohesion: 0.36
Nodes (11): expo-local-authentication, isUsingAuthentication(), loadAuthentication(), removeAuthentication(), saveAuthentication(), getData(), getTauriCore(), getWebStorageKey() (+3 more)

### Community 126 - "FilterAnalysisModal.tsx"
Cohesion: 0.27
Nodes (8): FilterAnalysisModal(), Props, PasswordStrengthLevel, MEDIUM, STRONG, WEAK, getPasswordStrengthIcon(), Divider()

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

### Community 142 - "linux"
Cohesion: 0.67
Nodes (3): linux, depends, deb

### Community 171 - "AppearanceSettingsSection.tsx"
Cohesion: 0.27
Nodes (8): AppearanceSettingsSection(), Props, SettingsDropdownItem(), AppLanguage, DEFAULT_LANG, formatAbsoluteDate(), formatAbsoluteLocal(), formatAbsoluteTime()

### Community 172 - "browser-extension/package.json"
Cohesion: 0.18
Nodes (10): react, react-dom, @types/react, @types/react-dom, typescript, name, private, type (+2 more)

### Community 173 - "VaultV1.ts"
Cohesion: 0.28
Nodes (6): makeV1AadBytes(), te, V1_AAD_OBJECT, assertPositiveSafeInteger(), VaultV1, VaultV1Schema

### Community 174 - "Sync And Storage Context"
Cohesion: 0.25
Nodes (7): Core Files, Providers, Settings Schema, Storage Layers, Sync And Storage Context, Tokens, StoreSchema

### Community 175 - "Firefox Store Release Notes"
Cohesion: 0.25
Nodes (7): Extension Identity, Firefox Store Release Notes, Listing, Pre-Submit Check, Privacy Policy Draft, Release Artifacts, Reviewer Notes

### Community 176 - "UI Context"
Cohesion: 0.25
Nodes (7): i18n, Important Files, Menus And Dropdowns, Platform Model, Related UI Context, Titlebar And Chrome, UI Context

### Community 177 - "Desktop And Tauri Context"
Cohesion: 0.29
Nodes (6): Chrome And Drag Regions, Core Files, Desktop And Tauri Context, Fast Access, Runtime Model, Tauri Responsibilities

### Community 178 - "ClavisPass Firefox Add-on Reviewer Build"
Cohesion: 0.33
Nodes (5): Build Steps, ClavisPass Firefox Add-on Reviewer Build, Environment, Firefox Add-on ID, Native Messaging Notes

### Community 179 - "tab-context.ts"
Cohesion: 0.60
Nodes (5): getActiveDomainContext(), normalizeLookupHost(), parseActiveDomain(), sanitizeHost(), ActiveDomainContext

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

### Community 184 - "ReorderScreen.tsx"
Cohesion: 0.36
Nodes (6): react-native-draggable-flatlist, applyVisibleOrder(), dragDropAnimationConfig, moveEntryAfterPreviousVisibleId(), ReorderScreen(), ReorderScreenProps

### Community 185 - "dependencies"
Cohesion: 0.67
Nodes (3): dependencies, react, react-dom

### Community 189 - "ClavisPass Agent Context"
Cohesion: 0.29
Nodes (6): Always Know, ClavisPass Agent Context, Context Routing, Fast Map, graphify, High-Risk Rules

### Community 190 - "Security And Vault Context"
Cohesion: 0.29
Nodes (6): Core Files, Master Password Lifetime, Module Policy, Security And Vault Context, UI-Safe Metadata, Vault Session Boundary

### Community 191 - "NoteEditorScreen.tsx"
Cohesion: 0.38
Nodes (6): react-native-safe-area-context, NoteFullscreenEditor(), NoteMarkdownPreview(), NoteEditorScreen(), NoteEditorScreenProps, styles

### Community 192 - "Crypto Context"
Cohesion: 0.33
Nodes (5): Core Files, Critical Rules, Crypto Context, Current Vault Format, Verification

### Community 193 - "SettingsContainer.tsx"
Cohesion: 0.50
Nodes (4): Props, SettingsContainer(), styles, SubItem()

### Community 194 - "hotkeyRecordingBus.ts"
Cohesion: 0.50
Nodes (4): beginHotkeyRecording(), emit(), Listener, listeners

## Knowledge Gaps
- **128 isolated node(s):** `react`, `react-dom`, `@types/chrome`, `@types/react`, `@types/react-dom` (+123 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1623 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **47 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `VaultProvider.tsx` to `getModule.tsx`, `ref_react`, `package.json`, `ClavisPassHubClient.ts`, `model/types.ts`, `deriveIdentityClusters.ts`, `DraggableModulesList.shared.tsx`, `DeviceStorageClient.ts`, `GoogleDriveLoginButton.tsx`, `GoogleDriveClient.ts`, `createUniqueID`, `vite.config.ts`, `SettingsProvider.tsx`, `decryptVaultContent.ts`, `generatePassword.ts`, `DevicesScreen.tsx`, `HomeScreen.tsx`, `expo-constants`, `withIosGoogleOAuthScheme.js`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **What connects `react`, `react-dom`, `@types/chrome` to the rest of the system?**
  _128 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `getModule.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.04099666811531218 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `react-native-paper`, `package.json`, `EditScreen.tsx`, `App.tsx`, `SettingsScreen.tsx`, `useSetting`, `useVault`, `AnimatedContainer`, `AuthProvider.tsx`, `DigitalCardModule.tsx`, `FastAccess.ts`, `AnalysisDetailScreen.tsx`, `ScanScreen.tsx`, `ModuleReorderScreen.tsx`, `GlobalClipboardSnackbar.tsx`, `model/types.ts`, `UpdateManager.tsx`, `BrowserExtensionsScreen.tsx`, `LoginScreen.tsx`, `DraggableModulesList.shared.tsx`, `HotkeyRecorderItem.tsx`, `GoogleDriveLoginButton.tsx`, `react-native-reanimated`, `CardItem.tsx`, `ReorderScreen.tsx`, `VaultProvider.tsx`, `NoteEditorScreen.tsx`, `useTheme`, `SettingsContainer.tsx`, `AttachmentModule.tsx`, `SettingsProvider.tsx`, `NoteModule.tsx`, `CreditCardModule.tsx`, `AnalysisScreen.tsx`, `DevicesScreen.tsx`, `HomeScreen.tsx`, `Login.tsx`, `errorBus.ts`, `container/AnimatedOpacityContainer.tsx`, `logger.ts`, `vcardExport.ts`, `authenticateUser.ts`, `FilterAnalysisModal.tsx`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.01904761904761905 - nodes in this community are weakly interconnected._
- **Why does `useTheme()` connect `useTheme` to `getModule.tsx`, `react-native-paper`, `ref_react`, `EditScreen.tsx`, `App.tsx`, `SettingsScreen.tsx`, `useSetting`, `useVault`, `AnimatedContainer`, `DigitalCardModule.tsx`, `FastAccess.ts`, `AnalysisDetailScreen.tsx`, `ScanScreen.tsx`, `ModuleReorderScreen.tsx`, `GlobalClipboardSnackbar.tsx`, `UpdateManager.tsx`, `BrowserExtensionsScreen.tsx`, `LoginScreen.tsx`, `DraggableModulesList.shared.tsx`, `HotkeyRecorderItem.tsx`, `react-native-reanimated`, `CardItem.tsx`, `ReorderScreen.tsx`, `VaultProvider.tsx`, `NoteEditorScreen.tsx`, `SettingsContainer.tsx`, `AttachmentModule.tsx`, `SettingsProvider.tsx`, `NavigationContainer.tsx`, `NoteModule.tsx`, `react-native`, `CreditCardModule.tsx`, `AnalysisScreen.tsx`, `DevicesScreen.tsx`, `HomeScreen.tsx`, `Login.tsx`, `errorBus.ts`, `FilterAnalysisModal.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `react-native-paper` be split into smaller, more focused modules?**
  _Cohesion score 0.09428794992175274 - nodes in this community are weakly interconnected._
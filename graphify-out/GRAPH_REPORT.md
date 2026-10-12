# Graph Report - ClavisPass  (2026-10-12)

## Corpus Check
- 564 files · ~342,453 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 37 file(s) not represented in the graph (top: .xml 11, (none) 8, .properties 2)

## Summary
- 3771 nodes · 10464 edges · 195 communities (148 shown, 47 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 145 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dd6915f0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ModulesEnum
- dependencies
- ref_react
- ValuesType.ts
- package.json
- useVault
- App.tsx
- EditScreen.tsx
- AnimatedPressable
- AnimatedLogo.tsx
- BrowserBridgePairingPrompt.tsx
- content/index.ts
- shared/types.ts
- popup/App.tsx
- verifyVaultV1Provider.ts
- background/index.ts
- shared/bridge.ts
- SettingsProvider.tsx
- Modal
- detectTauriEnvironment
- AnalysisDetailScreen.tsx
- expo
- ClavisPassHubClient.ts
- MenuItem
- write.rs
- scripts
- CardDetailsScreen.tsx
- manifest.json
- useClipboardCopy.ts
- forms.ts
- lib.rs
- HomeScreen.tsx
- UpdateManager.tsx
- hotkeys.ts
- commands.rs
- LoginScreen.tsx
- analysisEngine.ts
- BrowserExtensionsScreen.tsx
- state.ts
- DraggableModulesList.shared.tsx
- mapKdbxToClavisPass.ts
- useAuth
- host.rs
- DocumentTypeEnum
- GoogleDriveLoginButton.tsx
- release.js
- useIsTauriEnvironment
- CreditCardModule.tsx
- screen_lock.rs
- ClavisPass Website Marketing Brief
- createUniqueID
- pairing.rs
- CloudStorageClient.ts
- ClavisPass Native Messaging Bridge
- vcardExport.ts
- BrowserBridgeWriteSync.tsx
- vite.config.ts
- devDependencies
- prepare-msix.js
- model/types.ts
- Vault V2 Key Envelope Roadmap
- mergeVaultData.ts
- ClavisPass
- bridge_commands.rs
- useTheme
- compilerOptions
- AttachmentModule.tsx
- getTemplate.ts
- AttachmentPreviewScreen.native.tsx
- reactNativePaper.tsx
- MainApplication.kt
- CloseBehaviorState
- LocalFileClient.ts
- Datenschutzerklärung
- AddModuleModal.tsx
- reactNative.ts
- Privacy Policy
- RecoveryCodesModule.tsx
- Nutzungsbedingungen
- mobileUpdater.ts
- prepare-native-host-sidecar.js
- decryptVaultContent.ts
- AuthProvider.tsx
- MainActivity.kt
- session.rs
- scripts
- distribution.ts
- ObjcId
- BrandHeader.tsx
- ValueIconsEnum
- Terms Of Use
- protocol.rs
- InlineNotice.tsx
- check-tauri-version-sync.js
- errorBus.ts
- ClavisPass Product Strategy Roadmap
- Sync.tsx
- bundle
- DropdownLayer.web.tsx
- Identity Management Concept
- withIosGoogleOAuthScheme.js
- isTauri.ts
- tauri.conf.json
- withAndroidApplicationId.js
- build-web-demo.js
- ThemeProvider.tsx
- plugins
- autofill-cache.ts
- ref_fs
- container/AnimatedOpacityContainer.tsx
- expoVectorIcons.tsx
- editHistory.ts
- vault.rs
- appScheme.test.ts
- reactNativeReanimated.tsx
- reactNavigationNative.ts
- devDependencies
- compilerOptions
- generatePassword.ts
- tsconfig.json
- Store Release Roadmap
- store.ts
- modulePolicy.ts
- CryptoProvider
- totp.ts
- AuthState
- Header
- macOS
- windows
- gorhomBottomSheet.tsx
- WifiTypeEnum
- build
- vite-env.d.ts
- Sync And Storage Context
- UI Patterns Context
- BridgeStatusBadge.tsx
- FastAccessPositionPicker.tsx
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
- SettingsQuickSelect.tsx
- browser-extension/package.json
- ClavisPassHubDiscoveryResult.ts
- path.rs
- Firefox Store Release Notes
- UI Context
- ExpiryNotificationScheduler.tsx
- ClavisPass Firefox Add-on Reviewer Build
- hotkeyRecordingBus.ts
- Bitwarden Import Roadmap
- Agent Workflow Context
- Build, Release, And Update Context
- Identity Context
- native_host_registration.rs
- dependencies
- CLAUDE.md
- .claude/CLAUDE.md
- Desktop And Tauri Context
- VaultProvider.tsx
- GlobalClipboardSnackbar.tsx
- Login.tsx
- Vault Modules Context
- SettingsScreen.tsx

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
- `Master Password Lifetime` --references--> `AuthProvider()`  [INFERRED]
  docs/context/security.md → src/app/providers/AuthProvider.tsx
- `Implementation` --references--> `AuthProvider()`  [INFERRED]
  README.md → src/app/providers/AuthProvider.tsx
- `Tokens` --references--> `CloudProvider()`  [INFERRED]
  docs/context/sync-storage.md → src/app/providers/CloudProvider.tsx
- `Reorder Flows` --references--> `Header()`  [INFERRED]
  docs/context/vault-modules.md → src/shared/components/Header.tsx
- `Chips` --references--> `AppChip()`  [INFERRED]
  docs/context/ui-patterns.md → src/shared/components/chips/AppChip.tsx

## Import Cycles
- None detected.

## Communities (195 total, 47 thin omitted)

### Community 0 - "ModulesEnum"
Cohesion: 0.03
Nodes (96): zod, FastAccessType, FastAccessTypeSchema, AddressModuleType, AddressModuleTypeSchema, regex, CompanyModuleType, CompanyModuleTypeSchema (+88 more)

### Community 1 - "dependencies"
Cohesion: 0.02
Nodes (105): dependencies, argon2-browser, @babel/plugin-proposal-export-namespace-from, base64-js, crypto-js, expo, expo-auth-session, expo-blur (+97 more)

### Community 2 - "ref_react"
Cohesion: 0.08
Nodes (38): react-i18next, react-native, MobileFastAccessOverlay(), subscribeMobileFastAccess(), ChangeMasterPasswordModal(), Props, styles, Backup() (+30 more)

### Community 3 - "ValuesType.ts"
Cohesion: 0.16
Nodes (12): expo-document-picker, papaparse, react-native-crypto-js, PendingKdbxFile, Props, styles, decrypt(), EntryExternalRefsSchema (+4 more)

### Community 4 - "package.json"
Cohesion: 0.03
Nodes (76): react, react-dom, @types/react, @types/react-dom, typescript, main, name, private (+68 more)

### Community 5 - "useVault"
Cohesion: 0.13
Nodes (29): IdentityStackParamList, Stack, useVault(), IdentityEmailLogo(), buildPasswordUseCounts(), deriveIdentityClusters(), entryHasSimplePasswordRisk(), getEntryDomains() (+21 more)

### Community 6 - "App.tsx"
Cohesion: 0.10
Nodes (22): AppShell(), DemoBootstrap(), MainWindowReadySignal(), withAlpha(), applyNativeContentProtection(), applyTauriContentProtection(), ContentProtectionContext, ContentProtectionContextValue (+14 more)

### Community 7 - "EditScreen.tsx"
Cohesion: 0.07
Nodes (36): Common Refactor Targets, Files To Check First, Known Custom Screens, Screen Standardization Context, Standard Checklist, vitest, ClearCompletedTasksModal(), Props (+28 more)

### Community 8 - "AnimatedPressable"
Cohesion: 0.05
Nodes (66): Interaction Polish, extractFastAccessObject(), IdentityEmailLogoProps, styles, EditRowControlsContainerProps, NativeDragHandleScrollLockContext, WebDragHandlePropsContext, FolderFilter() (+58 more)

### Community 9 - "AnimatedLogo.tsx"
Cohesion: 0.25
Nodes (5): react-native-svg, AnimatedLogo(), AnimatedRect, styles, Logo()

### Community 10 - "BrowserBridgePairingPrompt.tsx"
Cohesion: 0.24
Nodes (12): BrowserBridgePairingPrompt(), PairingAction, PromptButton(), styles, actOnBrowserExtensionPairing(), BrowserExtensionPairingChangeListener, buildBrowserClientKey(), listBrowserExtensionPairings() (+4 more)

### Community 11 - "content/index.ts"
Cohesion: 0.10
Nodes (40): executeFill(), applyThemeToInlinePicker(), clearInlinePreview(), commitInlineAction(), createCloseIcon(), createInlineLogo(), createPickerLogo(), ensureInlineStyles() (+32 more)

### Community 12 - "shared/types.ts"
Cohesion: 0.05
Nodes (45): BackgroundHandler, BackgroundHandlerMap, BackgroundMessageContext, BackgroundMessageRouter, getActiveDomainContext(), normalizeLookupHost(), parseActiveDomain(), sanitizeHost() (+37 more)

### Community 13 - "popup/App.tsx"
Cohesion: 0.07
Nodes (40): registerContentFrame(), App(), handleFill(), handleOpenDesktopApp(), handlePromptResolution(), handleToggleSavePrompts(), handleUpdateAutofillMode(), refreshInlineAutofillPreference() (+32 more)

### Community 14 - "verifyVaultV1Provider.ts"
Cohesion: 0.11
Nodes (14): base64-js, libsodium-wrappers-sumo, react-native-sodium-jsi, getCryptoProvider(), rnSodiumProvider, td, te, verifyProviderInDev() (+6 more)

### Community 15 - "background/index.ts"
Cohesion: 0.13
Nodes (34): buildCreatePayload(), buildUpdatePayload(), clearTabBadge(), delay(), desktopBridge, ensureContentScriptReady(), evaluateSavePromptCandidate(), fillFirstAvailableMatchInActiveTab() (+26 more)

### Community 16 - "shared/bridge.ts"
Cohesion: 0.08
Nodes (42): Architecture, Browser loading notes, ClavisPass Browser Extension, Current feature set, Desktop bridge, Development, Important note, Working from the repo root (+34 more)

### Community 17 - "SettingsProvider.tsx"
Cohesion: 0.15
Nodes (12): DEFAULT_KEYS, loadSettingWithTimeout(), SettingsContext, SettingsContextValue, SettingsProvider(), SettingsState, DataKey, I18nBridge() (+4 more)

### Community 18 - "Modal"
Cohesion: 0.07
Nodes (42): react-qr-code, Props, AddValueModal(), CustomFieldInputType, EditCustomFieldModal(), Props, ACTION_ICON, EditHistoryModal() (+34 more)

### Community 19 - "detectTauriEnvironment"
Cohesion: 0.09
Nodes (49): App(), AppWithNavigation(), getCurrentWindowSafe(), Fast Access, @tauri-apps/api, DevModeProvider(), ThemeProvider(), invokeTauriSystemAuth() (+41 more)

### Community 20 - "AnalysisDetailScreen.tsx"
Cohesion: 0.08
Nodes (44): AnalysisStackParamList, Stack, useAuthMaster(), FiltersNarrow, deriveAnalysisPepperFromMaster(), getPasswordStrengthColor(), getPasswordStrengthIcon(), AnalysisDetailScreen() (+36 more)

### Community 21 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, adaptiveIcon, blockedPermissions, package, permissions, versionCode, projectId (+31 more)

### Community 22 - "ClavisPassHubClient.ts"
Cohesion: 0.13
Nodes (38): calculateExpiresIn(), checkDiscovery(), createHubError(), createHubErrorFromPayload(), DiscoveryResponse, ensureVaultEtagForUpload(), fetchFile(), fetchUserInfo() (+30 more)

### Community 23 - "MenuItem"
Cohesion: 0.09
Nodes (32): @gorhom/bottom-sheet, FilterItem, FiltersNarrowProps, FiltersWide, FiltersWideProps, styles, ExpiryOverviewEntry, HomeFilterMenu() (+24 more)

### Community 24 - "write.rs"
Cohesion: 0.12
Nodes (30): as_io_error(), BrowserWriteKind, CreateEntryFromBrowser, UpdateEntryFromBrowser, BrowserWriteRequest, BrowserWriteRequestStore, BrowserWriteResult, BrowserWriteResultStore (+22 more)

### Community 25 - "scripts"
Cohesion: 0.05
Nodes (37): scripts, android, android:build:apk, android:build:store, android:build:store-submit, android:submit:store, extension:build, extension:build:chrome (+29 more)

### Community 26 - "CardDetailsScreen.tsx"
Cohesion: 0.18
Nodes (21): expo-image, @kichiyaki/react-native-barcode-generator, CardItem(), Props, styles, DigitalCardType, buildFaviconUrl(), DigitalCardPalette (+13 more)

### Community 27 - "manifest.json"
Cohesion: 0.06
Nodes (35): action, default_icon, default_popup, default_title, background, service_worker, type, browser_specific_settings (+27 more)

### Community 28 - "useClipboardCopy.ts"
Cohesion: 0.15
Nodes (10): setClipboardText(), clipboardClearScheduler, ClipboardContentKind, clipboardOwnership, fingerprintValue(), OwnedClipboardRecord, TrackClipboardCopyOptions, copyWithAutoClear() (+2 more)

### Community 29 - "forms.ts"
Cohesion: 0.08
Nodes (43): applyTargets(), buildNoFieldsResult(), collectFillTargets(), emitInputEvents(), FillPreviewResult, FillSnapshot, FillTarget, previewFill() (+35 more)

### Community 30 - "lib.rs"
Cohesion: 0.11
Nodes (19): clamp_window_size(), clamp_window_size_to_monitor(), DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIDTH, emit_lock_vault(), emit_vault_file_open_request(), get_requested_vault_file_path(), get_window_size_file_path() (+11 more)

### Community 31 - "HomeScreen.tsx"
Cohesion: 0.08
Nodes (31): expo-constants, react-native-reanimated, useSetting(), MetaInformationModule(), MetaInformationModuleType, subscribeOpenAddValue(), unsubscribeOpenAddValue(), resolveWindowControlsSide() (+23 more)

### Community 32 - "UpdateManager.tsx"
Cohesion: 0.20
Nodes (13): expo-updates, react-native-safe-area-context, @tauri-apps/plugin-process, @tauri-apps/plugin-updater, Listener, listeners, publishUpdateCheck(), subscribeUpdateCheck() (+5 more)

### Community 33 - "hotkeys.ts"
Cohesion: 0.16
Nodes (18): HotkeyRecorderItem(), Props, ACTIONS, BLOCKED_HOTKEYS, DEFAULT_HOTKEYS, getDefaultHotkey(), getDefaultHotkeys(), getHotkeyConflict() (+10 more)

### Community 34 - "commands.rs"
Cohesion: 0.09
Nodes (12): AUTH_REPLY_DESCRIPTOR, AUTH_REPLY_SIGNATURE, authenticate_with_system(), BLOCK_HAS_SIGNATURE, BlockDescriptor, CF_UNICODETEXT_FORMAT, get_main_window_hwnd(), LAPOLICY_DEVICE_OWNER_AUTHENTICATION (+4 more)

### Community 35 - "LoginScreen.tsx"
Cohesion: 0.13
Nodes (35): LoginStackParamList, useToken(), OnlineContext, OnlineContextType, Props, useOnline(), UseOnlineResult, Auth() (+27 more)

### Community 36 - "analysisEngine.ts"
Cohesion: 0.08
Nodes (40): expo-crypto, FilterAnalysisModal(), Props, AnalysisFlags, CachedAnalysisItem, CacheResult, PasswordStrengthLevel, MEDIUM (+32 more)

### Community 37 - "BrowserExtensionsScreen.tsx"
Cohesion: 0.24
Nodes (13): subscribeBrowserExtensionPairingChanges(), ActionButton(), BrowserClientCard(), BrowserExtensionsScreen(), BrowserExtensionsScreenProps, browserIconForClient(), BrowserPairingAction, EmptyState() (+5 more)

### Community 38 - "state.ts"
Cohesion: 0.13
Nodes (11): buildPromptTitle(), ExtensionState, normalizeIdentity(), PreparedFillRecord, RegisteredFrameInfo, SavePromptEvaluation, SuggestionRowProps, FillDataResult (+3 more)

### Community 39 - "DraggableModulesList.shared.tsx"
Cohesion: 0.12
Nodes (26): i18next, NativeDragHandleScrollLockProvider(), WebDragHandlePropsProvider(), dragDropAnimationConfig, DraggableModulesList(), DraggableModulesFooter(), DraggableModulesListProps, draggableModulesListStyles (+18 more)

### Community 40 - "mapKdbxToClavisPass.ts"
Cohesion: 0.15
Nodes (22): kdbxweb, configureKdbxArgon2(), importKdbx(), addCustomField(), addTotpModule(), addValueModule(), binaryToBytes(), binaryWithMetaToAttachment() (+14 more)

### Community 41 - "useAuth"
Cohesion: 0.12
Nodes (26): @expo/vector-icons, CustomBottomTab(), getActiveRouteName(), getActiveRouteName(), LeftSideTabBar(), sidebarWidth, styles, getFocusedRouteName() (+18 more)

### Community 42 - "host.rs"
Cohesion: 0.16
Nodes (17): app_scheme(), bridge_result_to_response(), ensure_ready(), FillPayload, handle_request(), pairing_required(), PeerInfo, read_frame() (+9 more)

### Community 43 - "DocumentTypeEnum"
Cohesion: 0.33
Nodes (6): DocumentTypeEnum, BITWARDEN, CHROME, FIREFOX, KDBX, PCLOUD

### Community 44 - "GoogleDriveLoginButton.tsx"
Cohesion: 0.11
Nodes (31): expo-auth-session, expo-random, expo-web-browser, @fabianlars/tauri-plugin-oauth, ANDROID_AUTH_PROMPT_OPTIONS, getMobileRedirectUri(), randState(), SCOPES (+23 more)

### Community 45 - "release.js"
Cohesion: 0.12
Nodes (19): androidGradleHasVersionCode(), androidGradleHasVersionName(), androidStringsHasRuntimeVersion(), cargoLockHasVersion(), cargoTomlHasVersion(), { execSync }, existingTags, filesToUpdate (+11 more)

### Community 46 - "useIsTauriEnvironment"
Cohesion: 0.17
Nodes (12): Props, ProtectedRoute(), styles, DevModeContext, DevModeContextType, Props, useIsTauriEnvironment(), AmbientBackground() (+4 more)

### Community 47 - "CreditCardModule.tsx"
Cohesion: 0.31
Nodes (12): CreditCardModule(), CreditCardState, detectCardBrand(), digitsOnly(), formatCardNumber(), maskCardNumber(), passesLuhn(), concealActiveSecretReveal() (+4 more)

### Community 48 - "screen_lock.rs"
Cohesion: 0.11
Nodes (8): DeviceIdentity, get_device_identity(), CGSessionCopyCurrentDictionary(), emit(), ScreenLockPayload, Session, start(), wndproc()

### Community 49 - "ClavisPass Website Marketing Brief"
Cohesion: 0.05
Nodes (43): Attachments And Previews, Brand Details, Bring Your Own Sync, Browser Extension, Can I import my existing passwords?, Can my cloud provider read my passwords?, ClavisPass Website Marketing Brief, Conversion Priorities (+35 more)

### Community 50 - "createUniqueID"
Cohesion: 0.21
Nodes (22): addCardModule(), addCustomField(), addExpiryModule(), addIdentityModules(), addLoginModules(), addNote(), addSshKeyModule(), addTotp() (+14 more)

### Community 51 - "pairing.rs"
Cohesion: 0.21
Nodes (21): approve_pairing(), evaluate_pairing(), list_paired_clients(), list_pending_pairings(), list_rejected_clients(), load_pairing_store(), now_ms(), optional_identity_matches() (+13 more)

### Community 52 - "CloudStorageClient.ts"
Cohesion: 0.11
Nodes (34): @react-native-async-storage/async-storage, fetchFile(), getActiveLocalVaultIdKey(), getLocalSyncKey(), getLocalSyncMetadataKey(), getVaultLocalSyncKey(), getVaultLocalSyncMetadataKey(), LocalSyncMetadata (+26 more)

### Community 53 - "ClavisPass Native Messaging Bridge"
Cohesion: 0.06
Nodes (29): Chosen architecture, Chromium and Edge registration, ClavisPass Native Messaging Bridge, Current V1 behavior, Edge verification, Example usage, Expected failure cases, Future hardening (+21 more)

### Community 54 - "vcardExport.ts"
Cohesion: 0.30
Nodes (11): expo-file-system, expo-sharing, buildFormattedName(), buildVCard(), canExportVCard(), clean(), escapeVCardText(), exportVCard() (+3 more)

### Community 55 - "BrowserBridgeWriteSync.tsx"
Cohesion: 0.35
Nodes (10): applyUpdateToEntry(), BrowserWriteKind, BrowserWriteRequest, createBrowserEntry(), CreatePayload, effectiveUrl(), normalizeText(), pickFolder() (+2 more)

### Community 57 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, @babel/core, eslint, eslint-config-universe, patch-package, prettier, react-test-renderer, @tauri-apps/cli (+14 more)

### Community 58 - "prepare-msix.js"
Cohesion: 0.10
Nodes (16): appExe, appVersion, assetsOutputDir, createUnplatedTargetSizeIcons(), escapePowerShellSingleQuoted(), fs, manifest, manifestSource (+8 more)

### Community 59 - "model/types.ts"
Cohesion: 0.11
Nodes (23): @react-navigation/bottom-tabs, @react-navigation/native-stack, AddTriggerStackParamList, AppTabsParamList, LogoutStackParamList, RootStackParamList, SettingsStackParamList, AddTriggerStack() (+15 more)

### Community 60 - "Vault V2 Key Envelope Roadmap"
Cohesion: 0.06
Nodes (29): Always Know, ClavisPass Agent Context, Context Routing, Fast Map, graphify, High-Risk Rules, Core Files, Master Password Lifetime (+21 more)

### Community 61 - "mergeVaultData.ts"
Cohesion: 0.19
Nodes (22): addLatestTombstones(), areSame(), areVaultDataEqual(), clone(), conflictCopyMatchesBaseEntry(), conflictCopyWasDeleted(), entryContentFingerprint(), entryIsDeletedBy() (+14 more)

### Community 62 - "ClavisPass"
Cohesion: 0.07
Nodes (28): 1. VaultSession (Authoritative & Secret-Capable), 2. VaultProvider (UI-Safe Projection), Authentication & Master Secret Handling, Backend / Plattform, CI / CD & Deployment, ClavisPass, Cryptography & Encryption Model, Defensive Defaults (+20 more)

### Community 63 - "bridge_commands.rs"
Cohesion: 0.15
Nodes (8): bridge_approve_pairing(), bridge_claim_pending_writes(), bridge_complete_write_request(), bridge_list_paired_clients(), bridge_list_pending_pairings(), bridge_list_rejected_clients(), bridge_publish_session(), bridge_reject_pairing()

### Community 64 - "useTheme"
Cohesion: 0.06
Nodes (71): Item Surfaces, Shared Module UI, @monaco-editor/react, useTheme(), EditRowControlsContainer(), Props, styles, TotpItem() (+63 more)

### Community 65 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+11 more)

### Community 66 - "AttachmentModule.tsx"
Cohesion: 0.18
Nodes (17): AttachmentModule(), canPreviewAttachment(), downloadBrowserAttachment(), formatBytes(), getAttachmentIcon(), getFileExtension(), getSafeFileName(), pickMobileAttachment() (+9 more)

### Community 67 - "getTemplate.ts"
Cohesion: 0.14
Nodes (18): TemplateEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+10 more)

### Community 68 - "AttachmentPreviewScreen.native.tsx"
Cohesion: 0.31
Nodes (9): react-native-pdf, getAttachmentPreview(), AttachmentPreviewScreen(), AttachmentPreviewScreenProps, getExtension(), getImageDataUri(), getSafeFileName(), PdfComponentType (+1 more)

### Community 69 - "reactNativePaper.tsx"
Cohesion: 0.11
Nodes (14): ActivityIndicator, baseColors, Button, Chip, Divider, Icon, IconButton, MD3DarkTheme (+6 more)

### Community 71 - "CloseBehaviorState"
Cohesion: 0.13
Nodes (10): claim_pending_lock_request(), close_main_window(), CloseBehavior, Exit, Hide, CloseBehaviorState, focus_main_window(), schedule_exit_watchdog() (+2 more)

### Community 72 - "LocalFileClient.ts"
Cohesion: 0.22
Nodes (14): @tauri-apps/plugin-dialog, @tauri-apps/plugin-fs, BackupExportButton(), Import(), getFileNameFromPath(), pickDesktopAttachment(), saveDesktopAttachment(), ensureDesktop() (+6 more)

### Community 73 - "Datenschutzerklärung"
Cohesion: 0.09
Nodes (22): 10. Browser-Erweiterung, 11. Benachrichtigungen, 12. Kontaktaufnahme, 13. Webseite und Hosting, 14. Cookies, Tracking und Analytics, 15. App Stores und Download-Plattformen, 16. Rechtsgrundlagen, 17. Speicherdauer (+14 more)

### Community 74 - "AddModuleModal.tsx"
Cohesion: 0.21
Nodes (11): AddModuleModalCompactFav(), defineModules(), IdsOf, MissingIds, ModuleCategory, ModuleMeta, ModuleTile(), Props (+3 more)

### Community 75 - "reactNative.ts"
Cohesion: 0.08
Nodes (21): DROPBOX_CLIENT_ID, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_ID_ANDROID, GOOGLE_CLIENT_ID_DESKTOP, GOOGLE_CLIENT_ID_IOS, GOOGLE_CLIENT_SECRET_DESKTOP, resetEnv(), setEnv() (+13 more)

### Community 76 - "Privacy Policy"
Cohesion: 0.09
Nodes (22): 10. Browser Extension, 11. Notifications, 12. Contact, 13. Website And Hosting, 14. Cookies, Tracking And Analytics, 15. App Stores And Download Platforms, 16. Legal Bases, 17. Retention (+14 more)

### Community 77 - "RecoveryCodesModule.tsx"
Cohesion: 0.27
Nodes (9): RecoveryCodesModule(), splitKeepingRemainder(), styles, tokenize(), Props, QuickSelect(), styles, emitClipboardCopied() (+1 more)

### Community 78 - "Nutzungsbedingungen"
Cohesion: 0.10
Nodes (20): 10. Erlaubte Nutzung, 11. Open Source und Lizenzen, 12. Kosten, 13. Drittanbieter, 14. Updates, 15. Haftung, 16. Beendigung der Nutzung, 17. Änderungen (+12 more)

### Community 79 - "mobileUpdater.ts"
Cohesion: 0.33
Nodes (9): shouldUseMobileBinaryUpdater(), checkMobileBinaryUpdate(), compareVersions(), getAppVersion(), getManifestDownloadUrl(), getMobileUpdateManifestUrl(), MobileBinaryUpdate, MobileUpdateManifest (+1 more)

### Community 80 - "prepare-native-host-sidecar.js"
Cohesion: 0.14
Nodes (12): cargoArgs, { copyFileSync, existsSync, mkdirSync, writeFileSync }, detectHostTriple(), { execFileSync }, { join, resolve }, manifestPath, outputDir, outputPath (+4 more)

### Community 81 - "decryptVaultContent.ts"
Cohesion: 0.19
Nodes (12): VaultDataTypeSchema, getEmptyData(), decryptVaultContent(), DecryptVaultContentResult, DEFAULT_ENCRYPT_MODE, EncryptMode, EncryptVaultContentResult, getCryptoProvider() (+4 more)

### Community 82 - "AuthProvider.tsx"
Cohesion: 0.22
Nodes (10): AuthContext, AuthContextType, AuthMasterContext, AuthMasterContextType, AuthProvider(), Props, ScreenLockLogoutController, initScreenLockLogout() (+2 more)

### Community 84 - "session.rs"
Cohesion: 0.24
Nodes (7): BridgeSessionSnapshot, clear_session(), load_session(), now_ms(), publish_session(), SESSION_TTL_MS, write_json_atomically()

### Community 85 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, build:chrome, build:firefox, build:firefox-local, dev, package:chrome, package:firefox (+6 more)

### Community 86 - "distribution.ts"
Cohesion: 0.48
Nodes (5): AppDistribution, getAppDistribution(), isStoreDistribution(), readDistributionEnv(), shouldUseDesktopUpdater()

### Community 87 - "ObjcId"
Cohesion: 0.19
Nodes (17): auth_reply(), authenticate_with_system_impl(), AuthReplyBlock, _Block_copy(), _Block_release(), check_system_auth_available(), cstring(), new_la_context() (+9 more)

### Community 89 - "ValueIconsEnum"
Cohesion: 0.14
Nodes (13): ValueIconsEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+5 more)

### Community 90 - "Terms Of Use"
Cohesion: 0.10
Nodes (20): 10. Permitted Use, 11. Open Source And Licenses, 12. Costs, 13. Third-Party Providers, 14. Updates, 15. Liability, 16. Ending Use, 17. Changes (+12 more)

### Community 91 - "protocol.rs"
Cohesion: 0.20
Nodes (7): BridgeClientInfo, BridgeError, BridgePairingEnvelope, BridgeRequest, BridgeResponse, HOST_NAME, PROTOCOL_VERSION

### Community 93 - "check-tauri-version-sync.js"
Cohesion: 0.24
Nodes (11): collectMismatches(), fs, getMajorMinor(), getNpmLockVersion(), mismatches, parseCargoLockVersions(), path, readJson() (+3 more)

### Community 94 - "errorBus.ts"
Cohesion: 0.42
Nodes (6): Listener, listeners, subscribeGlobalError(), unsubscribeGlobalError(), GlobalErrorPayload, GlobalErrorSnackbar()

### Community 95 - "ClavisPass Product Strategy Roadmap"
Cohesion: 0.11
Nodes (17): 1. Browser Extension Polish, 2. Passkeys, 3. Emergency Access / Trusted Contact, 4. Optional Web App, 5. Separate Secrets Sharing SaaS, Bitwarden Gaps To Treat As Strategic, ClavisPass Personal, ClavisPass Product Strategy Roadmap (+9 more)

### Community 96 - "Sync.tsx"
Cohesion: 0.16
Nodes (24): Props, Sync(), createVaultDeviceId(), DeviceIdentity, getCurrentVaultDeviceId(), getDeviceDisplayName(), getPlatformString(), normalizeDeviceIdentityPart() (+16 more)

### Community 97 - "bundle"
Cohesion: 0.17
Nodes (12): bundle, active, category, copyright, createUpdaterArtifacts, externalBin, fileAssociations, icon (+4 more)

### Community 99 - "Identity Management Concept"
Cohesion: 0.13
Nodes (14): Confidence And Trust, Core Idea, Data Model Direction, Design Tone, Identity Detail View, Identity Management Concept, Identity Tab, Important Principle (+6 more)

### Community 100 - "withIosGoogleOAuthScheme.js"
Cohesion: 0.43
Nodes (5): ensureUrlScheme(), normalizeClientId(), {
  ensureUrlScheme,
  toReverseClientIdScheme,
}, toReverseClientIdScheme(), { withInfoPlist }

### Community 101 - "isTauri.ts"
Cohesion: 0.13
Nodes (22): expo-clipboard, getClipboardText(), tryNavigatorReadText(), tryNavigatorWriteText(), detectBrowserWebEnvironment(), isBrowserWebEnvironment(), isMacWebRuntime(), isTauriEnvironment() (+14 more)

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
Cohesion: 0.06
Nodes (38): expo-linear-gradient, react-native-circular-progress, react-native-gesture-handler, react-native-paper, Props, ThemeContext, ThemeContextType, AnalysisEntry() (+30 more)

### Community 106 - "plugins"
Cohesion: 0.20
Nodes (10): args, customProtocol, plugins, cli, deepLink, updater, endpoints, pubkey (+2 more)

### Community 107 - "autofill-cache.ts"
Cohesion: 0.11
Nodes (34): clearAutofillDomainCache(), countPasswordSuggestions(), DomainAutofillCache, DomainAutofillCacheEntry, getAutofillEligibilityForUrl(), getCachedAutofillMatchCountForUrl(), getCachedMatchCount(), isFresh() (+26 more)

### Community 109 - "container/AnimatedOpacityContainer.tsx"
Cohesion: 0.31
Nodes (6): AnimatedOpacityContainer(), Props, AnimatedOpacityContainerWeb(), Props, Props, AnimatedOpacityContainer()

### Community 111 - "editHistory.ts"
Cohesion: 0.23
Nodes (12): appendLog(), areValuesEqual(), cloneValue(), createLogEntry(), EditHistoryActionType, EditHistoryMeta, EditSessionLogEntry, HistoryEntry (+4 more)

### Community 112 - "vault.rs"
Cohesion: 0.22
Nodes (20): domain_contains(), fill_data_for_entry(), FillDataResult, first_string(), FolderRef, login_entry(), match_domain_score(), normalize_domain() (+12 more)

### Community 113 - "appScheme.test.ts"
Cohesion: 0.43
Nodes (5): getAppRedirectUri(), getAppScheme(), Constants, resetExpoConfig(), setExpoConfig()

### Community 114 - "reactNativeReanimated.tsx"
Cohesion: 0.25
Nodes (4): Animated, AnimatedView, Easing, FadeInDown

### Community 116 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, @types/chrome, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react

### Community 117 - "compilerOptions"
Cohesion: 0.29
Nodes (6): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, include

### Community 118 - "generatePassword.ts"
Cohesion: 0.29
Nodes (5): generatePassword(), LOWERCASE_CHAR_CODES, NUMBER_CHAR_CODES, SYMBOL_CHAR_CODES, UPPERCASE_CHAR_CODES

### Community 119 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, moduleResolution, strict, exclude, extends

### Community 120 - "Store Release Roadmap"
Cohesion: 0.17
Nodes (11): Apple Developer Program, Arratel Setup Plan, Chrome Web Store, Goals, Google Play, Microsoft Store, Publisher Naming, References (+3 more)

### Community 121 - "store.ts"
Cohesion: 0.17
Nodes (16): BooleanDef, DEVICE_RESET_KEYS, EnumDef, get(), isModulesEnumValue(), JsonDef, listeners, MODULES_ENUM_VALUES (+8 more)

### Community 122 - "modulePolicy.ts"
Cohesion: 0.17
Nodes (13): buildEntryMeta(), EntryMeta, firstModule(), firstValue(), getSecretFor(), isManagedModule(), MANAGED_MODULE_VALUES, ManagedModules (+5 more)

### Community 123 - "CryptoProvider"
Cohesion: 0.15
Nodes (19): CryptoProvider, makeV1AadBytes(), te, V1_AAD_OBJECT, assertPositiveSafeInteger(), decryptVaultV1(), encryptVaultV1(), verifyVaultV1Provider() (+11 more)

### Community 126 - "Header"
Cohesion: 0.08
Nodes (46): Standard Screen Structure, expo-camera, @hello-pangea/dnd, react-native-draggable-flatlist, @react-navigation/native, HomeStackParamList, Stack, NoteFullscreenEditor() (+38 more)

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

### Community 137 - "Sync And Storage Context"
Cohesion: 0.25
Nodes (7): Core Files, Providers, Settings Schema, Storage Layers, Sync And Storage Context, Tokens, StoreSchema

### Community 138 - "UI Patterns Context"
Cohesion: 0.25
Nodes (7): Chips, Compact Search Behavior, Content Panels, Current Visual Direction, Headers, UI Patterns Context, Verification

### Community 141 - "FastAccessPositionPicker.tsx"
Cohesion: 0.33
Nodes (6): Corner, CornerOption(), FastAccessPosition, FastAccessPositionPicker(), Props, StoreValueMap

### Community 142 - "linux"
Cohesion: 0.67
Nodes (3): linux, depends, deb

### Community 144 - "Crypto Context"
Cohesion: 0.33
Nodes (5): Core Files, Critical Rules, Crypto Context, Current Vault Format, Verification

### Community 171 - "SettingsQuickSelect.tsx"
Cohesion: 0.38
Nodes (5): clampWidth(), Props, SettingsQuickSelect(), styles, QuickSelectItem

### Community 172 - "browser-extension/package.json"
Cohesion: 0.18
Nodes (10): react, react-dom, @types/react, @types/react-dom, typescript, name, private, type (+2 more)

### Community 173 - "ClavisPassHubDiscoveryResult.ts"
Cohesion: 0.29
Nodes (6): ClavisPassHubDiscoveryResult, ClavisPassHubDiscoveryStatus, DiscoveryCheckingResult, DiscoveryErrorResult, DiscoveryIdleResult, DiscoverySuccessResult

### Community 174 - "path.rs"
Cohesion: 0.39
Nodes (8): bridge_dir(), BRIDGE_ENV_KEY, ensure_dir(), pairing_store_path(), platform_base_dir(), session_store_path(), write_request_store_path(), write_result_store_path()

### Community 175 - "Firefox Store Release Notes"
Cohesion: 0.25
Nodes (7): Extension Identity, Firefox Store Release Notes, Listing, Pre-Submit Check, Privacy Policy Draft, Release Artifacts, Reviewer Notes

### Community 176 - "UI Context"
Cohesion: 0.25
Nodes (7): i18n, Important Files, Menus And Dropdowns, Platform Model, Related UI Context, Titlebar And Chrome, UI Context

### Community 177 - "ExpiryNotificationScheduler.tsx"
Cohesion: 0.39
Nodes (7): expo-notifications, buildPendingExpiryReminders(), cancelScheduledExpiryReminders(), configureNotificationHandler(), ExpiryNotificationScheduler(), getReminderDate(), PendingExpiryReminder

### Community 178 - "ClavisPass Firefox Add-on Reviewer Build"
Cohesion: 0.33
Nodes (5): Build Steps, ClavisPass Firefox Add-on Reviewer Build, Environment, Firefox Add-on ID, Native Messaging Notes

### Community 179 - "hotkeyRecordingBus.ts"
Cohesion: 0.50
Nodes (4): beginHotkeyRecording(), emit(), Listener, listeners

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

### Community 184 - "native_host_registration.rs"
Cohesion: 0.19
Nodes (10): CHROME_EXTENSION_IDS, chromium_origins(), CREATE_NO_WINDOW, EDGE_EXTENSION_IDS, find_native_host_exe(), FIREFOX_EXTENSION_ID, native_host_candidates(), NATIVE_HOST_NAME (+2 more)

### Community 185 - "dependencies"
Cohesion: 0.67
Nodes (3): dependencies, react, react-dom

### Community 189 - "Desktop And Tauri Context"
Cohesion: 0.33
Nodes (5): Chrome And Drag Regions, Core Files, Desktop And Tauri Context, Runtime Model, Tauri Responsibilities

### Community 195 - "VaultProvider.tsx"
Cohesion: 0.13
Nodes (18): VaultContext, VaultContextType, VaultData, FolderSchema, ValuesListTypeSchema, VaultDataType, VaultEntryTombstone, VaultEntryTombstoneSchema (+10 more)

### Community 196 - "GlobalClipboardSnackbar.tsx"
Cohesion: 0.38
Nodes (7): Handler, handlers, subscribeClipboardCopied(), unsubscribeClipboardCopied(), ClipboardCopyPayload, GlobalClipboardSnackbar(), msToSecCeil()

### Community 197 - "Login.tsx"
Cohesion: 0.13
Nodes (28): expo-local-authentication, react-native-progress, CloudProvider(), isInvalidGrant(), OAuthRefreshError, Props, StoredAuth, TokenContext (+20 more)

### Community 201 - "Vault Modules Context"
Cohesion: 0.40
Nodes (4): Important Boundaries, Reorder Flows, Vault Modules Context, Verification

### Community 204 - "SettingsScreen.tsx"
Cohesion: 0.09
Nodes (32): simple-icons, useContentProtection(), useDevMode(), AppearanceSettingsSection(), Props, BackupImportButton(), ContentProtectionSettingsToggle(), Props (+24 more)

## Knowledge Gaps
- **128 isolated node(s):** `react`, `react-dom`, `@types/chrome`, `@types/react`, `@types/react-dom` (+123 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1624 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **47 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `EditScreen.tsx` to `ref_react`, `ValuesType.ts`, `package.json`, `ClavisPassHubClient.ts`, `MenuItem`, `hotkeys.ts`, `DraggableModulesList.shared.tsx`, `GoogleDriveLoginButton.tsx`, `createUniqueID`, `CloudStorageClient.ts`, `vite.config.ts`, `getTemplate.ts`, `VaultProvider.tsx`, `reactNative.ts`, `decryptVaultContent.ts`, `Sync.tsx`, `withIosGoogleOAuthScheme.js`, `appScheme.test.ts`, `generatePassword.ts`, `store.ts`, `modulePolicy.ts`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **What connects `react`, `react-dom`, `@types/chrome` to the rest of the system?**
  _128 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ModulesEnum` be split into smaller, more focused modules?**
  _Cohesion score 0.03209366391184573 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `ref_react` to `ValuesType.ts`, `package.json`, `useVault`, `App.tsx`, `EditScreen.tsx`, `AnimatedPressable`, `AnimatedLogo.tsx`, `BrowserBridgePairingPrompt.tsx`, `FastAccessPositionPicker.tsx`, `Modal`, `detectTauriEnvironment`, `AnalysisDetailScreen.tsx`, `MenuItem`, `CardDetailsScreen.tsx`, `HomeScreen.tsx`, `UpdateManager.tsx`, `hotkeys.ts`, `LoginScreen.tsx`, `analysisEngine.ts`, `BrowserExtensionsScreen.tsx`, `DraggableModulesList.shared.tsx`, `useAuth`, `SettingsQuickSelect.tsx`, `GoogleDriveLoginButton.tsx`, `useIsTauriEnvironment`, `CreditCardModule.tsx`, `ExpiryNotificationScheduler.tsx`, `vcardExport.ts`, `model/types.ts`, `useTheme`, `AttachmentModule.tsx`, `AttachmentPreviewScreen.native.tsx`, `Login.tsx`, `GlobalClipboardSnackbar.tsx`, `AddModuleModal.tsx`, `SettingsScreen.tsx`, `RecoveryCodesModule.tsx`, `mobileUpdater.ts`, `AuthProvider.tsx`, `distribution.ts`, `errorBus.ts`, `Sync.tsx`, `isTauri.ts`, `ThemeProvider.tsx`, `container/AnimatedOpacityContainer.tsx`, `Header`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.01904761904761905 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `ref_react` be split into smaller, more focused modules?**
  _Cohesion score 0.07610931531002058 - nodes in this community are weakly interconnected._
# Graph Report - ClavisPass  (2026-10-13)

## Corpus Check
- 564 files · ~343,238 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 37 file(s) not represented in the graph (top: .xml 11, (none) 8, .properties 2)

## Summary
- 3776 nodes · 10476 edges · 185 communities (140 shown, 45 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 145 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e42cbada`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- getModule.tsx
- dependencies
- react-i18next
- CardItem.tsx
- package.json
- distribution.ts
- App.tsx
- reactNative.ts
- EditScreen.tsx
- ExpiryPickerModal.tsx
- useTheme
- content/index.ts
- shared/types.ts
- popup/App.tsx
- path.rs
- background/index.ts
- shared/bridge.ts
- AnalysisScreen.tsx
- I18nBridge.tsx
- FastAccess.ts
- AnalysisDetailScreen.tsx
- expo
- ClavisPassHubClient.ts
- ref_react
- write.rs
- scripts
- decryptVaultContent.ts
- manifest.json
- isTauri.ts
- forms.ts
- lib.rs
- LeftSideBar.tsx
- UpdateManager.tsx
- store.ts
- commands.rs
- LoginScreen.tsx
- AnimatedLogo.tsx
- mergeVaultData.ts
- state.ts
- DraggableModulesList.shared.tsx
- mapKdbxToClavisPass.ts
- NavigationContainer.tsx
- host.rs
- rnSodiumProvider.ts
- GoogleDriveLoginButton.tsx
- release.js
- Desktop And Tauri Context
- CreditCardModule.tsx
- screen_lock.rs
- ClavisPass Website Marketing Brief
- ModulesEnum.ts
- pairing.rs
- DeviceStorageClient.ts
- ClavisPass Native Messaging Bridge
- BrandHeader.tsx
- InlineNotice.tsx
- vite.config.ts
- devDependencies
- prepare-msix.js
- DropdownLayer.web.tsx
- Vault V2 Key Envelope Roadmap
- riskModel.ts
- ClavisPass
- bridge_commands.rs
- NoteModule.tsx
- compilerOptions
- AttachmentModule.tsx
- BrowserBridgeWriteSync.tsx
- ModulesEnum
- reactNativePaper.tsx
- MainApplication.kt
- i18n/index.ts
- modulePolicy.ts
- Datenschutzerklärung
- autofill-preferences.ts
- entropyUi.ts
- Privacy Policy
- vaultDevices.ts
- Nutzungsbedingungen
- analysisEngine.ts
- prepare-native-host-sidecar.js
- VaultV1.ts
- mobileUpdater.ts
- MainActivity.kt
- session.rs
- scripts
- PasswordStrengthLevel
- ModalSurface
- Terms Of Use
- protocol.rs
- detectTauriEnvironment
- check-tauri-version-sync.js
- ExpiryNotificationScheduler.tsx
- ClavisPass Product Strategy Roadmap
- SettingsScreen.tsx
- bundle
- hibp.ts
- deriveIdentityClusters.ts
- withIosGoogleOAuthScheme.js
- BrowserBridgePairingPrompt.tsx
- tauri.conf.json
- withAndroidApplicationId.js
- build-web-demo.js
- react-native
- plugins
- domain.ts
- ref_fs
- container/AnimatedOpacityContainer.tsx
- editHistory.ts
- Vault Modules Context
- appScheme.test.ts
- reactNativeReanimated.tsx
- reactNavigationNative.ts
- devDependencies
- compilerOptions
- vitest
- tsconfig.json
- Store Release Roadmap
- expoVectorIcons.tsx
- CryptoProvider
- Totp
- model/types.ts
- macOS
- windows
- gorhomBottomSheet.tsx
- WifiTypeEnum
- build
- vite-env.d.ts
- tab-context.ts
- BridgeStatusBadge.tsx
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
- Screen Standardization Context
- browser-extension/package.json
- Firefox Store Release Notes
- UI Context
- SettingsProvider.tsx
- ClavisPass Firefox Add-on Reviewer Build
- Bitwarden Import Roadmap
- Agent Workflow Context
- Build, Release, And Update Context
- Identity Context
- HomeScreen.tsx
- dependencies
- CLAUDE.md
- .claude/CLAUDE.md
- CustomTitlebar.tsx
- pkce.web.ts
- VaultProvider.tsx
- GlobalClipboardSnackbar.tsx
- CloudProvider.tsx
- Modal

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
- `Edge verification` --references--> `getStatus()`  [INFERRED]
  docs/browser-extension/native-messaging.md → src/features/vault/utils/expiry.ts
- `Reorder Flows` --references--> `Header()`  [INFERRED]
  docs/context/vault-modules.md → src/shared/components/Header.tsx

## Import Cycles
- None detected.

## Communities (185 total, 45 thin omitted)

### Community 0 - "getModule.tsx"
Cohesion: 0.04
Nodes (81): zod, FastAccessType, FastAccessTypeSchema, DIGITAL_CARD_TYPES, AddressModuleType, AddressModuleTypeSchema, regex, AttachmentFileSchema (+73 more)

### Community 1 - "dependencies"
Cohesion: 0.02
Nodes (105): dependencies, argon2-browser, @babel/plugin-proposal-export-namespace-from, base64-js, crypto-js, expo, expo-auth-session, expo-blur (+97 more)

### Community 2 - "react-i18next"
Cohesion: 0.08
Nodes (52): expo-linking, react-i18next, PasswordGeneratorModal(), Props, styles, ModuleContainer(), ModuleContainerProps, moduleStyles (+44 more)

### Community 3 - "CardItem.tsx"
Cohesion: 0.22
Nodes (11): @kichiyaki/react-native-barcode-generator, Props, styles, DigitalCardType, DigitalCardPalette, extractUrlFromEntry(), getReadableTextColor(), hexToRgb() (+3 more)

### Community 4 - "package.json"
Cohesion: 0.03
Nodes (74): react, react-dom, @types/react, @types/react-dom, typescript, main, name, private (+66 more)

### Community 5 - "distribution.ts"
Cohesion: 0.31
Nodes (8): AppDistribution, getAppDistribution(), getMobileDistribution(), isStoreDistribution(), MobileDistribution, readDistributionEnv(), readMobileDistributionEnv(), shouldUseDesktopUpdater()

### Community 6 - "App.tsx"
Cohesion: 0.10
Nodes (29): AppShell(), DemoBootstrap(), MainWindowReadySignal(), withAlpha(), AuthProvider(), DevModeProvider(), OnlineProvider(), createDemoVault() (+21 more)

### Community 7 - "reactNative.ts"
Cohesion: 0.05
Nodes (34): react-test-renderer, LogoutStackParamList, LogoutStack(), Stack, ClearCompletedTasksModal(), Props, ClearModulesModal(), Props (+26 more)

### Community 8 - "EditScreen.tsx"
Cohesion: 0.06
Nodes (66): Interaction Polish, extractFastAccessObject(), EditRowControlsContainerProps, NativeDragHandleScrollLockContext, WebDragHandlePropsContext, CategoryItem(), Props, ellipsize() (+58 more)

### Community 9 - "ExpiryPickerModal.tsx"
Cohesion: 0.19
Nodes (8): ExpiryPickerModal(), Props, ExpiryModule(), ExpiryStatus, formatRelative(), getRelativeInfo(), RelativeExpiryInfo, toIsoUtcFromLocal()

### Community 10 - "useTheme"
Cohesion: 0.06
Nodes (51): Item Surfaces, @monaco-editor/react, useTheme(), Corner, CornerOption(), FastAccessPosition, FastAccessPositionPicker(), Props (+43 more)

### Community 11 - "content/index.ts"
Cohesion: 0.09
Nodes (49): applyTargets(), buildNoFieldsResult(), collectFillTargets(), emitInputEvents(), executeFill(), FillPreviewResult, FillSnapshot, FillTarget (+41 more)

### Community 12 - "shared/types.ts"
Cohesion: 0.06
Nodes (39): BackgroundHandler, BackgroundHandlerMap, BackgroundMessageContext, BackgroundMessageRouter, FillStateCardProps, GetFillDataForEntryPayload, ExtensionMessage, isExtensionMessage() (+31 more)

### Community 13 - "popup/App.tsx"
Cohesion: 0.07
Nodes (41): registerContentFrame(), setupSavePromptListener(), App(), handleFill(), handleOpenDesktopApp(), handlePromptResolution(), handleToggleSavePrompts(), handleUpdateAutofillMode() (+33 more)

### Community 14 - "path.rs"
Cohesion: 0.39
Nodes (8): bridge_dir(), BRIDGE_ENV_KEY, ensure_dir(), pairing_store_path(), platform_base_dir(), write_request_store_path(), write_result_store_path(), complete_request()

### Community 15 - "background/index.ts"
Cohesion: 0.10
Nodes (45): clearAutofillDomainCache(), countPasswordSuggestions(), DomainAutofillCache, DomainAutofillCacheEntry, getAutofillEligibilityForUrl(), getCachedAutofillMatchCountForUrl(), getCachedMatchCount(), isFresh() (+37 more)

### Community 16 - "shared/bridge.ts"
Cohesion: 0.07
Nodes (42): Architecture, Browser loading notes, ClavisPass Browser Extension, Current feature set, Desktop bridge, Development, Important note, Working from the repo root (+34 more)

### Community 17 - "AnalysisScreen.tsx"
Cohesion: 0.15
Nodes (19): AnalysisStackParamList, Stack, FiltersNarrow, normalize(), AnalysisScreen(), AnalysisScreenProps, AnalysisTab, FilterItem (+11 more)

### Community 18 - "I18nBridge.tsx"
Cohesion: 0.36
Nodes (5): I18nBridge(), initI18n(), AppLanguage, DEFAULT_LANG, toAppLanguage()

### Community 19 - "FastAccess.ts"
Cohesion: 0.11
Nodes (32): FastAccessSessionBridge(), MobileFastAccessOverlay(), FAST_ACCESS_NOTIFICATION_CATEGORY, FAST_ACCESS_POPUP_LABEL, FAST_ACCESS_POSITION_CHANGED_EVENT, FAST_ACCESS_READY_EVENT, FAST_ACCESS_UPDATE_EVENT, FastAccessPayload (+24 more)

### Community 20 - "AnalysisDetailScreen.tsx"
Cohesion: 0.16
Nodes (20): useAuthMaster(), canonicalizeForVariants(), deriveAnalysisPepperFromMaster(), fingerprintPassword(), getPasswordStrengthIcon(), AnalysisDetailScreen(), AnalysisDetailScreenProps, analyzeCharacterComposition() (+12 more)

### Community 21 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, adaptiveIcon, blockedPermissions, package, permissions, versionCode, projectId (+31 more)

### Community 22 - "ClavisPassHubClient.ts"
Cohesion: 0.09
Nodes (49): ClavisPassHubLoginButton(), calculateExpiresIn(), checkDiscovery(), createHubError(), createHubErrorFromPayload(), DiscoveryResponse, ensureVaultEtagForUpload(), fetchFile() (+41 more)

### Community 23 - "ref_react"
Cohesion: 0.06
Nodes (50): react-native-reanimated, Props, styles, FilterItem, FiltersNarrowProps, FiltersWide, FiltersWideProps, styles (+42 more)

### Community 24 - "write.rs"
Cohesion: 0.12
Nodes (29): as_io_error(), BrowserWriteKind, CreateEntryFromBrowser, UpdateEntryFromBrowser, BrowserWriteRequest, BrowserWriteRequestStore, BrowserWriteResult, BrowserWriteResultStore (+21 more)

### Community 25 - "scripts"
Cohesion: 0.05
Nodes (37): scripts, android, android:build:apk, android:build:store, android:build:store-submit, android:submit:store, extension:build, extension:build:chrome (+29 more)

### Community 26 - "decryptVaultContent.ts"
Cohesion: 0.20
Nodes (10): VaultDataTypeSchema, DecryptVaultContentResult, DEFAULT_ENCRYPT_MODE, EncryptMode, EncryptVaultContentResult, getCryptoProvider(), VaultV2, VaultV2Schema (+2 more)

### Community 27 - "manifest.json"
Cohesion: 0.06
Nodes (35): action, default_icon, default_popup, default_title, background, service_worker, type, browser_specific_settings (+27 more)

### Community 28 - "isTauri.ts"
Cohesion: 0.14
Nodes (18): getClipboardText(), setClipboardText(), tryNavigatorReadText(), tryNavigatorWriteText(), ClipboardContentKind, clipboardOwnership, fingerprintValue(), OwnedClipboardRecord (+10 more)

### Community 29 - "forms.ts"
Cohesion: 0.11
Nodes (33): AutofillPlan, buildAutofillPlan(), buildDetachedContainer(), buildFieldKey(), buildFieldText(), buildFormId(), chooseBestField(), ClassifiedField (+25 more)

### Community 30 - "lib.rs"
Cohesion: 0.05
Nodes (49): domain_contains(), fill_data_for_entry(), FillDataResult, first_string(), FolderRef, login_entry(), match_domain_score(), normalize_domain() (+41 more)

### Community 31 - "LeftSideBar.tsx"
Cohesion: 0.12
Nodes (20): @expo/vector-icons, @react-navigation/bottom-tabs, CustomBottomTab(), getActiveRouteName(), getActiveRouteName(), LeftSideTabBar(), sidebarWidth, styles (+12 more)

### Community 32 - "UpdateManager.tsx"
Cohesion: 0.20
Nodes (13): expo-updates, react-native-safe-area-context, @tauri-apps/plugin-process, @tauri-apps/plugin-updater, Listener, listeners, publishUpdateCheck(), subscribeUpdateCheck() (+5 more)

### Community 33 - "store.ts"
Cohesion: 0.06
Nodes (43): Core Files, Providers, Settings Schema, Storage Layers, Sync And Storage Context, Tokens, HotkeyRecorderItem(), Props (+35 more)

### Community 34 - "commands.rs"
Cohesion: 0.05
Nodes (40): auth_reply(), AUTH_REPLY_DESCRIPTOR, AUTH_REPLY_SIGNATURE, authenticate_with_system(), authenticate_with_system_impl(), AuthReplyBlock, AuthState, _Block_copy() (+32 more)

### Community 35 - "LoginScreen.tsx"
Cohesion: 0.13
Nodes (32): LoginStackParamList, Stack, useToken(), OnlineContext, OnlineContextType, Props, useOnline(), UseOnlineResult (+24 more)

### Community 36 - "AnimatedLogo.tsx"
Cohesion: 0.25
Nodes (5): react-native-svg, AnimatedLogo(), AnimatedRect, styles, Logo()

### Community 37 - "mergeVaultData.ts"
Cohesion: 0.17
Nodes (23): VaultEntryTombstone, addLatestTombstones(), areSame(), areVaultDataEqual(), clone(), conflictCopyMatchesBaseEntry(), conflictCopyWasDeleted(), entryContentFingerprint() (+15 more)

### Community 38 - "state.ts"
Cohesion: 0.12
Nodes (16): buildCreatePayload(), buildUpdatePayload(), resolvePromptWithDesktopWrite(), toAppliedResult(), buildPromptTitle(), ExtensionState, normalizeIdentity(), PreparedFillRecord (+8 more)

### Community 39 - "DraggableModulesList.shared.tsx"
Cohesion: 0.20
Nodes (17): dragDropAnimationConfig, DraggableModulesList(), DraggableModulesFooter(), DraggableModulesListProps, draggableModulesListStyles, FooterProps, reorderModules(), DraggableModulesListWeb() (+9 more)

### Community 40 - "mapKdbxToClavisPass.ts"
Cohesion: 0.15
Nodes (22): kdbxweb, configureKdbxArgon2(), importKdbx(), addCustomField(), addTotpModule(), addValueModule(), binaryToBytes(), binaryWithMetaToAttachment() (+14 more)

### Community 41 - "NavigationContainer.tsx"
Cohesion: 0.39
Nodes (8): ProtectedRoute(), getFocusedRouteName(), NavigationnContainer(), titlebarContentDragRoutes, LoginStack(), TabNavigator(), subscribeOpenAddValueRequest(), unsubscribeOpenAddValueRequest()

### Community 42 - "host.rs"
Cohesion: 0.16
Nodes (17): app_scheme(), bridge_result_to_response(), ensure_ready(), FillPayload, handle_request(), pairing_required(), PeerInfo, read_frame() (+9 more)

### Community 43 - "rnSodiumProvider.ts"
Cohesion: 0.14
Nodes (11): base64-js, libsodium-wrappers-sumo, react-native-sodium-jsi, getCryptoProvider(), rnSodiumProvider, td, te, verifyProviderInDev() (+3 more)

### Community 44 - "GoogleDriveLoginButton.tsx"
Cohesion: 0.08
Nodes (44): expo-auth-session, expo-random, expo-web-browser, @fabianlars/tauri-plugin-oauth, ANDROID_AUTH_PROMPT_OPTIONS, getMobileRedirectUri(), randState(), SCOPES (+36 more)

### Community 45 - "release.js"
Cohesion: 0.12
Nodes (19): androidGradleHasVersionCode(), androidGradleHasVersionName(), androidStringsHasRuntimeVersion(), cargoLockHasVersion(), cargoTomlHasVersion(), { execSync }, existingTags, filesToUpdate (+11 more)

### Community 46 - "Desktop And Tauri Context"
Cohesion: 0.29
Nodes (6): Chrome And Drag Regions, Core Files, Desktop And Tauri Context, Fast Access, Runtime Model, Tauri Responsibilities

### Community 47 - "CreditCardModule.tsx"
Cohesion: 0.26
Nodes (13): CreditCardModule(), CreditCardState, detectCardBrand(), digitsOnly(), formatCardNumber(), maskCardNumber(), passesLuhn(), Props (+5 more)

### Community 48 - "screen_lock.rs"
Cohesion: 0.11
Nodes (8): DeviceIdentity, get_device_identity(), CGSessionCopyCurrentDictionary(), emit(), ScreenLockPayload, Session, start(), wndproc()

### Community 49 - "ClavisPass Website Marketing Brief"
Cohesion: 0.05
Nodes (43): Attachments And Previews, Brand Details, Bring Your Own Sync, Browser Extension, Can I import my existing passwords?, Can my cloud provider read my passwords?, ClavisPass Website Marketing Brief, Conversion Priorities (+35 more)

### Community 50 - "ModulesEnum.ts"
Cohesion: 0.12
Nodes (29): papaparse, addCardModule(), addCustomField(), addExpiryModule(), addIdentityModules(), addLoginModules(), addNote(), addSshKeyModule() (+21 more)

### Community 51 - "pairing.rs"
Cohesion: 0.21
Nodes (21): approve_pairing(), evaluate_pairing(), list_paired_clients(), list_pending_pairings(), list_rejected_clients(), load_pairing_store(), now_ms(), optional_identity_matches() (+13 more)

### Community 52 - "DeviceStorageClient.ts"
Cohesion: 0.11
Nodes (31): @react-native-async-storage/async-storage, @tauri-apps/plugin-fs, Props, UserInfoProps, fetchFile(), getActiveLocalVaultIdKey(), getLocalSyncKey(), getLocalSyncMetadataKey() (+23 more)

### Community 53 - "ClavisPass Native Messaging Bridge"
Cohesion: 0.08
Nodes (23): Chosen architecture, Chromium and Edge registration, ClavisPass Native Messaging Bridge, Edge verification, Example usage, Expected failure cases, Future hardening, Local development (+15 more)

### Community 57 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, @babel/core, eslint, eslint-config-universe, patch-package, prettier, react-test-renderer, @tauri-apps/cli (+14 more)

### Community 58 - "prepare-msix.js"
Cohesion: 0.10
Nodes (16): appExe, appVersion, assetsOutputDir, createUnplatedTargetSizeIcons(), escapePowerShellSingleQuoted(), fs, manifest, manifestSource (+8 more)

### Community 60 - "Vault V2 Key Envelope Roadmap"
Cohesion: 0.06
Nodes (28): Always Know, ClavisPass Agent Context, Context Routing, Fast Map, graphify, High-Risk Rules, Core Files, Master Password Lifetime (+20 more)

### Community 61 - "riskModel.ts"
Cohesion: 0.31
Nodes (10): buildAnalysisCache(), findSequentialTriples(), hasRepeatedChars(), strengthFromEntropyBits(), evaluatePasswordForDetail(), IssueKey, riskScoreFromCached(), Severity (+2 more)

### Community 62 - "ClavisPass"
Cohesion: 0.07
Nodes (28): 1. VaultSession (Authoritative & Secret-Capable), 2. VaultProvider (UI-Safe Projection), Authentication & Master Secret Handling, Backend / Plattform, CI / CD & Deployment, ClavisPass, Cryptography & Encryption Model, Defensive Defaults (+20 more)

### Community 63 - "bridge_commands.rs"
Cohesion: 0.15
Nodes (8): bridge_approve_pairing(), bridge_claim_pending_writes(), bridge_complete_write_request(), bridge_list_paired_clients(), bridge_list_pending_pairings(), bridge_list_rejected_clients(), bridge_publish_session(), bridge_reject_pairing()

### Community 64 - "NoteModule.tsx"
Cohesion: 0.13
Nodes (16): clamp(), DISPLAY_MODE_HEIGHTS, DISPLAY_MODES, NOTE_VARIANTS, NoteDisplayMode, NoteLanguage, NoteModule(), noteModuleDataEquals() (+8 more)

### Community 65 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+11 more)

### Community 66 - "AttachmentModule.tsx"
Cohesion: 0.12
Nodes (28): expo-file-system, expo-sharing, AttachmentModule(), canPreviewAttachment(), downloadBrowserAttachment(), formatBytes(), getAttachmentIcon(), getFileExtension() (+20 more)

### Community 67 - "BrowserBridgeWriteSync.tsx"
Cohesion: 0.06
Nodes (44): applyUpdateToEntry(), BrowserBridgeWriteSync(), BrowserWriteKind, BrowserWriteRequest, createBrowserEntry(), CreatePayload, effectiveUrl(), normalizeText() (+36 more)

### Community 68 - "ModulesEnum"
Cohesion: 0.07
Nodes (29): FILTERABLE_MODULES, ModuleFilterModal(), Props, ModulesEnum, ADDRESS, ATTACHMENT, COMPANY, CREDIT_CARD (+21 more)

### Community 69 - "reactNativePaper.tsx"
Cohesion: 0.11
Nodes (14): ActivityIndicator, baseColors, Button, Chip, Divider, Icon, IconButton, MD3DarkTheme (+6 more)

### Community 71 - "i18n/index.ts"
Cohesion: 0.31
Nodes (7): expo-clipboard, i18next, resources, de, en, DEFAULT_NS, TranslationSchema

### Community 72 - "modulePolicy.ts"
Cohesion: 0.19
Nodes (12): EntryMeta, firstModule(), firstValue(), getSecretFor(), isManagedModule(), MANAGED_MODULE_VALUES, ManagedModules, MetaExtractor (+4 more)

### Community 73 - "Datenschutzerklärung"
Cohesion: 0.09
Nodes (22): 10. Browser-Erweiterung, 11. Benachrichtigungen, 12. Kontaktaufnahme, 13. Webseite und Hosting, 14. Cookies, Tracking und Analytics, 15. App Stores und Download-Plattformen, 16. Rechtsgrundlagen, 17. Speicherdauer (+14 more)

### Community 74 - "autofill-preferences.ts"
Cohesion: 0.32
Nodes (12): buildPreferenceResult(), DEFAULT_POLICY, DomainPolicyStore, getInlineAutofillPreferenceForUrl(), normalizeHost(), normalizeMode(), normalizePolicy(), readPolicyStore() (+4 more)

### Community 75 - "entropyUi.ts"
Cohesion: 0.27
Nodes (9): CHARSET_SIZES, EntropyOptions, estimateCharsetSize(), hasUnicodeProps, log2(), passwordEntropy(), passwordEntropyBits(), computeEntropyBitsForUi() (+1 more)

### Community 76 - "Privacy Policy"
Cohesion: 0.09
Nodes (22): 10. Browser Extension, 11. Notifications, 12. Contact, 13. Website And Hosting, 14. Cookies, Tracking And Analytics, 15. App Stores And Download Platforms, 16. Legal Bases, 17. Retention (+14 more)

### Community 77 - "vaultDevices.ts"
Cohesion: 0.24
Nodes (9): daysBetween(), DEFAULT_DEVICE_UI_POLICY, deriveDeviceUiStatus(), DeviceUiPolicy, DeviceUiStatus, earliestIso(), hasSameDeviceIdentity(), normalizeDeviceIdentityPart() (+1 more)

### Community 78 - "Nutzungsbedingungen"
Cohesion: 0.10
Nodes (20): 10. Erlaubte Nutzung, 11. Open Source und Lizenzen, 12. Kosten, 13. Drittanbieter, 14. Updates, 15. Haftung, 16. Beendigung der Nutzung, 17. Änderungen (+12 more)

### Community 79 - "analysisEngine.ts"
Cohesion: 0.33
Nodes (5): AnalysisFlags, AnalysisRef, CachedAnalysisItem, CacheResult, THRESH_BITS

### Community 80 - "prepare-native-host-sidecar.js"
Cohesion: 0.14
Nodes (12): cargoArgs, { copyFileSync, existsSync, mkdirSync, writeFileSync }, detectHostTriple(), { execFileSync }, { join, resolve }, manifestPath, outputDir, outputPath (+4 more)

### Community 81 - "VaultV1.ts"
Cohesion: 0.29
Nodes (6): makeV1AadBytes(), te, V1_AAD_OBJECT, VaultV1, VaultV1Schema, TEST_PAYLOAD

### Community 82 - "mobileUpdater.ts"
Cohesion: 0.33
Nodes (9): shouldUseMobileBinaryUpdater(), checkMobileBinaryUpdate(), compareVersions(), getAppVersion(), getManifestDownloadUrl(), getMobileUpdateManifestUrl(), MobileBinaryUpdate, MobileUpdateManifest (+1 more)

### Community 84 - "session.rs"
Cohesion: 0.27
Nodes (8): session_store_path(), BridgeSessionSnapshot, clear_session(), load_session(), now_ms(), publish_session(), SESSION_TTL_MS, write_json_atomically()

### Community 85 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, build:chrome, build:firefox, build:firefox-local, dev, package:chrome, package:firefox (+6 more)

### Community 86 - "PasswordStrengthLevel"
Cohesion: 0.28
Nodes (6): PasswordStrengthLevel, MEDIUM, STRONG, WEAK, getPasswordStrengthColor(), AppColors

### Community 87 - "ModalSurface"
Cohesion: 0.13
Nodes (19): react-qr-code, ACTION_ICON, EditHistoryModal(), Props, styles, EntryTagsModal(), normalizeTags(), Props (+11 more)

### Community 90 - "Terms Of Use"
Cohesion: 0.10
Nodes (20): 10. Permitted Use, 11. Open Source And Licenses, 12. Costs, 13. Third-Party Providers, 14. Updates, 15. Liability, 16. Ending Use, 17. Changes (+12 more)

### Community 91 - "protocol.rs"
Cohesion: 0.20
Nodes (7): BridgeClientInfo, BridgeError, BridgePairingEnvelope, BridgeRequest, BridgeResponse, HOST_NAME, PROTOCOL_VERSION

### Community 92 - "detectTauriEnvironment"
Cohesion: 0.17
Nodes (21): App(), AppWithNavigation(), getCurrentWindowSafe(), expo-screen-capture, @tauri-apps/api, @tauri-apps/plugin-deep-link, applyNativeContentProtection(), applyTauriContentProtection() (+13 more)

### Community 93 - "check-tauri-version-sync.js"
Cohesion: 0.24
Nodes (11): collectMismatches(), fs, getMajorMinor(), getNpmLockVersion(), mismatches, parseCargoLockVersions(), path, readJson() (+3 more)

### Community 94 - "ExpiryNotificationScheduler.tsx"
Cohesion: 0.39
Nodes (7): expo-notifications, buildPendingExpiryReminders(), cancelScheduledExpiryReminders(), configureNotificationHandler(), ExpiryNotificationScheduler(), getReminderDate(), PendingExpiryReminder

### Community 95 - "ClavisPass Product Strategy Roadmap"
Cohesion: 0.11
Nodes (17): 1. Browser Extension Polish, 2. Passkeys, 3. Emergency Access / Trusted Contact, 4. Optional Web App, 5. Separate Secrets Sharing SaaS, Bitwarden Gaps To Treat As Strategic, ClavisPass Personal, ClavisPass Product Strategy Roadmap (+9 more)

### Community 96 - "SettingsScreen.tsx"
Cohesion: 0.06
Nodes (71): Current Vault Format, Implementation Phases, @gorhom/bottom-sheet, simple-icons, @tauri-apps/plugin-shell, AuthContext, AuthContextType, AuthMasterContext (+63 more)

### Community 97 - "bundle"
Cohesion: 0.17
Nodes (12): bundle, active, category, copyright, createUpdaterArtifacts, externalBin, fileAssociations, icon (+4 more)

### Community 98 - "hibp.ts"
Cohesion: 0.43
Nodes (6): expo-crypto, fetchRange(), getPwnedCountForPassword(), getPwnedCountsForPasswords(), requestCache, sha1Upper()

### Community 99 - "deriveIdentityClusters.ts"
Cohesion: 0.11
Nodes (25): Confidence And Trust, Core Idea, Data Model Direction, Design Tone, Identity Detail View, Identity Management Concept, Identity Tab, Important Principle (+17 more)

### Community 100 - "withIosGoogleOAuthScheme.js"
Cohesion: 0.43
Nodes (5): ensureUrlScheme(), normalizeClientId(), {
  ensureUrlScheme,
  toReverseClientIdScheme,
}, toReverseClientIdScheme(), { withInfoPlist }

### Community 101 - "BrowserBridgePairingPrompt.tsx"
Cohesion: 0.24
Nodes (12): BrowserBridgePairingPrompt(), PairingAction, PromptButton(), styles, actOnBrowserExtensionPairing(), BrowserExtensionPairingChangeListener, buildBrowserClientKey(), listBrowserExtensionPairings() (+4 more)

### Community 102 - "tauri.conf.json"
Cohesion: 0.18
Nodes (10): app, macOSPrivateApi, security, windows, identifier, mainBinaryName, productName, $schema (+2 more)

### Community 103 - "withAndroidApplicationId.js"
Cohesion: 0.20
Nodes (4): fs, path, { withDangerousMod }, { withXcodeProject }

### Community 104 - "build-web-demo.js"
Cohesion: 0.20
Nodes (8): demoDotenvPath, demoEnv, env, fs, path, result, rewriteDemoPublicPaths(), { spawnSync }

### Community 105 - "react-native"
Cohesion: 0.04
Nodes (59): expo-linear-gradient, react-native, react-native-gesture-handler, react-native-paper, DevModeContext, DevModeContextType, Props, Props (+51 more)

### Community 106 - "plugins"
Cohesion: 0.20
Nodes (10): args, customProtocol, plugins, cli, deepLink, updater, endpoints, pubkey (+2 more)

### Community 107 - "domain.ts"
Cohesion: 0.36
Nodes (8): buildEntrySuggestions(), normalizeHost(), normalizeLookupHost(), safeUrl(), scoreUrlMatch(), searchEntries(), EntrySuggestion, VaultEntry

### Community 109 - "container/AnimatedOpacityContainer.tsx"
Cohesion: 0.31
Nodes (6): AnimatedOpacityContainer(), Props, AnimatedOpacityContainerWeb(), Props, Props, AnimatedOpacityContainer()

### Community 111 - "editHistory.ts"
Cohesion: 0.23
Nodes (12): appendLog(), areValuesEqual(), cloneValue(), createLogEntry(), EditHistoryActionType, EditHistoryMeta, EditSessionLogEntry, HistoryEntry (+4 more)

### Community 112 - "Vault Modules Context"
Cohesion: 0.33
Nodes (5): Important Boundaries, Reorder Flows, Shared Module UI, Vault Modules Context, Verification

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

### Community 118 - "vitest"
Cohesion: 0.18
Nodes (7): vitest, generatePassword(), LOWERCASE_CHAR_CODES, NUMBER_CHAR_CODES, SYMBOL_CHAR_CODES, UPPERCASE_CHAR_CODES, devices

### Community 119 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, moduleResolution, strict, exclude, extends

### Community 120 - "Store Release Roadmap"
Cohesion: 0.17
Nodes (11): Apple Developer Program, Arratel Setup Plan, Chrome Web Store, Goals, Google Play, Microsoft Store, Publisher Naming, References (+3 more)

### Community 123 - "CryptoProvider"
Cohesion: 0.18
Nodes (16): CryptoProvider, assertPositiveSafeInteger(), decryptVaultV1(), encryptVaultV1(), verifyVaultV1Provider(), makeV2KeywrapAadBytes(), makeV2PayloadAadBytes(), te (+8 more)

### Community 124 - "Totp"
Cohesion: 0.38
Nodes (5): otpauth, Totp(), codeFromUri(), parseOtpauth(), TotpAlgo

### Community 126 - "model/types.ts"
Cohesion: 0.05
Nodes (85): Standard Screen Structure, expo-camera, expo-image, @hello-pangea/dnd, react-native-draggable-flatlist, react-native-pdf, @react-navigation/native, @react-navigation/native-stack (+77 more)

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

### Community 142 - "linux"
Cohesion: 0.67
Nodes (3): linux, depends, deb

### Community 144 - "Crypto Context"
Cohesion: 0.40
Nodes (4): Core Files, Critical Rules, Crypto Context, Verification

### Community 171 - "Screen Standardization Context"
Cohesion: 0.40
Nodes (4): Common Refactor Targets, Files To Check First, Known Custom Screens, Screen Standardization Context

### Community 172 - "browser-extension/package.json"
Cohesion: 0.18
Nodes (10): react, react-dom, @types/react, @types/react-dom, typescript, name, private, type (+2 more)

### Community 175 - "Firefox Store Release Notes"
Cohesion: 0.25
Nodes (7): Extension Identity, Firefox Store Release Notes, Listing, Pre-Submit Check, Privacy Policy Draft, Release Artifacts, Reviewer Notes

### Community 176 - "UI Context"
Cohesion: 0.25
Nodes (7): i18n, Important Files, Menus And Dropdowns, Platform Model, Related UI Context, Titlebar And Chrome, UI Context

### Community 177 - "SettingsProvider.tsx"
Cohesion: 0.13
Nodes (14): DEFAULT_KEYS, loadSettingWithTimeout(), SettingsContext, SettingsContextValue, SettingsProvider(), SettingsState, ThemeProvider(), DataKey (+6 more)

### Community 178 - "ClavisPass Firefox Add-on Reviewer Build"
Cohesion: 0.33
Nodes (5): Build Steps, ClavisPass Firefox Add-on Reviewer Build, Environment, Firefox Add-on ID, Native Messaging Notes

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

### Community 184 - "HomeScreen.tsx"
Cohesion: 0.04
Nodes (54): Standard Checklist, Chips, Compact Search Behavior, Content Panels, Current Visual Direction, Headers, UI Patterns Context, Verification (+46 more)

### Community 185 - "dependencies"
Cohesion: 0.67
Nodes (3): dependencies, react, react-dom

### Community 189 - "CustomTitlebar.tsx"
Cohesion: 0.16
Nodes (12): StartBehavior, Props, styles, TitlebarHeight(), WindowControls(), WindowControlsProps, WindowsWindowControls(), TITLEBAR_CONTROLS_WIDTH (+4 more)

### Community 190 - "pkce.web.ts"
Cohesion: 0.80
Nodes (4): base64Url(), createPkcePair(), randomBytes(), toCodeChallenge()

### Community 195 - "VaultProvider.tsx"
Cohesion: 0.14
Nodes (16): VaultContext, VaultData, FolderSchema, ValuesListTypeSchema, VaultDataType, VaultEntryTombstoneSchema, VaultDeviceSchema, VaultDeviceType (+8 more)

### Community 196 - "GlobalClipboardSnackbar.tsx"
Cohesion: 0.22
Nodes (8): clipboardClearScheduler, Handler, handlers, subscribeClipboardCopied(), unsubscribeClipboardCopied(), ClipboardCopyPayload, GlobalClipboardSnackbar(), msToSecCeil()

### Community 197 - "CloudProvider.tsx"
Cohesion: 0.12
Nodes (24): expo-local-authentication, CloudProvider(), isInvalidGrant(), OAuthRefreshError, Props, StoredAuth, TokenContext, TokenContextValue (+16 more)

### Community 204 - "Modal"
Cohesion: 0.07
Nodes (35): expo-document-picker, @tauri-apps/plugin-dialog, useContentProtection(), VaultContextType, FilterAnalysisModal(), Props, AppearanceSettingsSection(), Props (+27 more)

## Knowledge Gaps
- **128 isolated node(s):** `react`, `react-dom`, `@types/chrome`, `@types/react`, `@types/react-dom` (+123 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1627 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **45 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `store.ts`, `LoginScreen.tsx`, `withIosGoogleOAuthScheme.js`, `package.json`, `BrowserBridgeWriteSync.tsx`, `reactNative.ts`, `VaultProvider.tsx`, `DraggableModulesList.shared.tsx`, `vite.config.ts`, `GoogleDriveLoginButton.tsx`, `appScheme.test.ts`, `ModulesEnum.ts`, `DeviceStorageClient.ts`, `ClavisPassHubClient.ts`, `HomeScreen.tsx`, `decryptVaultContent.ts`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **What connects `react`, `react-dom`, `@types/chrome` to the rest of the system?**
  _128 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `getModule.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.04240221529941156 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `react-i18next`, `CardItem.tsx`, `package.json`, `distribution.ts`, `App.tsx`, `EditScreen.tsx`, `ExpiryPickerModal.tsx`, `useTheme`, `AnalysisScreen.tsx`, `FastAccess.ts`, `AnalysisDetailScreen.tsx`, `ClavisPassHubClient.ts`, `ref_react`, `isTauri.ts`, `LeftSideBar.tsx`, `UpdateManager.tsx`, `store.ts`, `LoginScreen.tsx`, `AnimatedLogo.tsx`, `DraggableModulesList.shared.tsx`, `GoogleDriveLoginButton.tsx`, `CreditCardModule.tsx`, `SettingsProvider.tsx`, `HomeScreen.tsx`, `CustomTitlebar.tsx`, `NoteModule.tsx`, `AttachmentModule.tsx`, `BrowserBridgeWriteSync.tsx`, `ModulesEnum`, `CloudProvider.tsx`, `GlobalClipboardSnackbar.tsx`, `Modal`, `mobileUpdater.ts`, `ModalSurface`, `detectTauriEnvironment`, `ExpiryNotificationScheduler.tsx`, `SettingsScreen.tsx`, `BrowserBridgePairingPrompt.tsx`, `container/AnimatedOpacityContainer.tsx`, `model/types.ts`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.01904761904761905 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `react-i18next` be split into smaller, more focused modules?**
  _Cohesion score 0.08325008325008325 - nodes in this community are weakly interconnected._
# Graph Report - ClavisPass  (2026-10-13)

## Corpus Check
- 565 files · ~343,519 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 37 file(s) not represented in the graph (top: .xml 11, (none) 8, .properties 2)

## Summary
- 3790 nodes · 10494 edges · 197 communities (152 shown, 45 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 145 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `80a4ae4a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ModulesType.ts
- dependencies
- ModulesEnum.ts
- CardDetailsScreen.tsx
- package.json
- getModule.tsx
- App.tsx
- vitest
- EditScreen.tsx
- ExpiryModule.tsx
- ref_react
- content/index.ts
- shared/types.ts
- popup/App.tsx
- path.rs
- background/index.ts
- shared/bridge.ts
- AnalysisScreen.tsx
- useSetting
- FastAccess.ts
- AnalysisDetailScreen.tsx
- expo
- ClavisPassHubClient.ts
- AnimatedPressable
- write.rs
- scripts
- GoogleDriveClient.ts
- manifest.json
- useClipboardCopy.ts
- forms.ts
- lib.rs
- LeftSideBar.tsx
- UpdateManager.tsx
- store.ts
- commands.rs
- LoginScreen.tsx
- vcardExport.ts
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
- DeviceStorageClient.ts
- background/bridge.ts
- BrandHeader.tsx
- InlineNotice.tsx
- vite.config.ts
- devDependencies
- prepare-msix.js
- DropdownLayer.web.tsx
- VaultProvider
- analysisEngine.ts
- ClavisPass
- bridge_commands.rs
- NoteModule.tsx
- compilerOptions
- AttachmentModule.tsx
- ValuesType.ts
- ModulesEnum
- reactNativePaper.tsx
- MainApplication.kt
- i18n/index.ts
- modulePolicy.ts
- Datenschutzerklärung
- autofill-preferences.ts
- ObjcId
- Privacy Policy
- BrowserExtensionsScreen.tsx
- Nutzungsbedingungen
- model/types.ts
- prepare-native-host-sidecar.js
- reactNative.ts
- mobileUpdater.ts
- MainActivity.kt
- session.rs
- scripts
- native_host_registration.rs
- useTheme
- TemplateEnum
- ClavisPass Browser Extension
- Terms Of Use
- protocol.rs
- ContentProtectionProvider.tsx
- check-tauri-version-sync.js
- prepare-sodium-16kb.js
- ClavisPass Product Strategy Roadmap
- SettingsScreen.tsx
- bundle
- IdentitiesScreen.tsx
- deriveIdentityClusters.ts
- NoteEditorScreen.tsx
- BrowserBridgePairingPrompt.tsx
- tauri.conf.json
- withAndroidApplicationId.js
- build-web-demo.js
- react-native
- plugins
- autofill-cache.ts
- ValueIconsEnum
- container/AnimatedOpacityContainer.tsx
- AuthProvider.tsx
- editHistory.ts
- Vault Modules Context
- CloudStorageClient.ts
- reactNativeReanimated.tsx
- reactNavigationNative.ts
- devDependencies
- compilerOptions
- VaultFileOpenHandler.tsx
- tsconfig.json
- Store Release Roadmap
- fill.ts
- expoVectorIcons.tsx
- decryptVaultContent.ts
- TotpModule.tsx
- brand.ts
- AnimatedContainer
- macOS
- windows
- gorhomBottomSheet.tsx
- WifiTypeEnum
- build
- vite-env.d.ts
- tab-context.ts
- Vault V2 Key Envelope Roadmap
- BridgeStatusBadge.tsx
- DigitalCardModule.tsx
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
- Header
- browser-extension/package.json
- AuthReplyBlock
- errorBus.ts
- Firefox Store Release Notes
- UI Context
- ClavisPassHubDiscoveryResult.ts
- ClavisPass Firefox Add-on Reviewer Build
- NoteFullscreenEditor.web.tsx
- Bitwarden Import Roadmap
- Agent Workflow Context
- Build, Release, And Update Context
- Identity Context
- AddModuleModal.tsx
- dependencies
- CLAUDE.md
- .claude/CLAUDE.md
- isTauri.ts
- pkce.web.ts
- device_identity.rs
- PairingStatus
- VaultProvider.tsx
- GlobalClipboardSnackbar.tsx
- detectTauriEnvironment
- Import.tsx

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

## Communities (197 total, 45 thin omitted)

### Community 0 - "ModulesType.ts"
Cohesion: 0.06
Nodes (47): zod, styles, AddressModuleType, AddressModuleTypeSchema, regex, CreditCardModuleType, CreditCardModuleTypeSchema, regex (+39 more)

### Community 1 - "dependencies"
Cohesion: 0.02
Nodes (105): dependencies, argon2-browser, @babel/plugin-proposal-export-namespace-from, base64-js, crypto-js, expo, expo-auth-session, expo-blur (+97 more)

### Community 2 - "ModulesEnum.ts"
Cohesion: 0.09
Nodes (32): FastAccessType, FastAccessTypeSchema, ModuleContainerProps, moduleStyles, AddressState, CompanyState, DocumentState, moduleFormStyles (+24 more)

### Community 3 - "CardDetailsScreen.tsx"
Cohesion: 0.33
Nodes (10): DigitalCardPalette, getHostnameLabel(), getReadableTextColor(), hexToRgb(), mixColors(), resolveDigitalCardPalette(), resolveDigitalCardPaletteFromUrl(), withAlpha() (+2 more)

### Community 4 - "package.json"
Cohesion: 0.03
Nodes (76): react, react-dom, @types/react, @types/react-dom, typescript, main, name, private (+68 more)

### Community 5 - "getModule.tsx"
Cohesion: 0.12
Nodes (29): expo-linking, ModuleContainer(), AddressModule(), CompanyModule(), CustomFieldModule(), DocumentModule(), EmailModule(), KeyModule() (+21 more)

### Community 6 - "App.tsx"
Cohesion: 0.09
Nodes (30): App(), AppShell(), AppWithNavigation(), DemoBootstrap(), getCurrentWindowSafe(), withAlpha(), DevModeContext, DevModeContextType (+22 more)

### Community 7 - "vitest"
Cohesion: 0.06
Nodes (32): { withXcodeProject }, ensureUrlScheme(), normalizeClientId(), {
  ensureUrlScheme,
  toReverseClientIdScheme,
}, toReverseClientIdScheme(), { withInfoPlist }, react-test-renderer, vitest (+24 more)

### Community 8 - "EditScreen.tsx"
Cohesion: 0.07
Nodes (50): Known Custom Screens, react-i18next, extractFastAccessObject(), ellipsize(), failedFaviconUrls, ListItem(), maskPassword(), Props (+42 more)

### Community 9 - "ExpiryModule.tsx"
Cohesion: 0.22
Nodes (9): ExpiryModule(), styles, ExpiryStatus, ExpiryModuleType, ExpiryModuleTypeSchema, regex, formatRelative(), getRelativeInfo() (+1 more)

### Community 10 - "ref_react"
Cohesion: 0.04
Nodes (58): Item Surfaces, @react-native-masked-view/masked-view, react-native-reanimated, react-native-svg, Corner, CornerOption(), FastAccessPosition, FastAccessPositionPicker() (+50 more)

### Community 11 - "content/index.ts"
Cohesion: 0.14
Nodes (32): applyThemeToInlinePicker(), clearInlinePreview(), commitInlineAction(), createCloseIcon(), createInlineLogo(), createPickerLogo(), ensureInlineStyles(), fillSuggestionFromPicker() (+24 more)

### Community 12 - "shared/types.ts"
Cohesion: 0.05
Nodes (47): BackgroundHandler, BackgroundHandlerMap, BackgroundMessageContext, BackgroundMessageRouter, FillPreviewResult, FillStateCardProps, GetFillDataForEntryPayload, ContentMessage (+39 more)

### Community 13 - "popup/App.tsx"
Cohesion: 0.09
Nodes (33): registerContentFrame(), App(), handleFill(), handleOpenDesktopApp(), handlePromptResolution(), handleToggleSavePrompts(), handleUpdateAutofillMode(), refreshInlineAutofillPreference() (+25 more)

### Community 14 - "path.rs"
Cohesion: 0.39
Nodes (8): bridge_dir(), BRIDGE_ENV_KEY, ensure_dir(), pairing_store_path(), platform_base_dir(), session_store_path(), write_request_store_path(), write_result_store_path()

### Community 15 - "background/index.ts"
Cohesion: 0.12
Nodes (34): buildCreatePayload(), buildUpdatePayload(), clearTabBadge(), delay(), desktopBridge, ensureContentScriptReady(), evaluateSavePromptCandidate(), fillFirstAvailableMatchInActiveTab() (+26 more)

### Community 16 - "shared/bridge.ts"
Cohesion: 0.14
Nodes (22): NativeMessagingClient, NativeMessagingError, toBridgeError(), validateBridgeResponse(), withTimeout(), createInstanceId(), getBridgeClientInfo(), getBrowserDisplayName() (+14 more)

### Community 17 - "AnalysisScreen.tsx"
Cohesion: 0.19
Nodes (17): FiltersNarrow, normalize(), AnalysisScreen(), AnalysisScreenProps, AnalysisTab, FilterItem, filterValuesWithNonEmptySecrets(), getItemRisk() (+9 more)

### Community 18 - "useSetting"
Cohesion: 0.11
Nodes (22): expo-notifications, DEFAULT_KEYS, loadSettingWithTimeout(), SettingsContext, SettingsContextValue, SettingsProvider(), SettingsState, useSetting() (+14 more)

### Community 19 - "FastAccess.ts"
Cohesion: 0.10
Nodes (41): @tauri-apps/api, FastAccessSessionBridge(), MobileFastAccessOverlay(), FAST_ACCESS_NOTIFICATION_CATEGORY, FAST_ACCESS_POPUP_LABEL, FAST_ACCESS_POSITION_CHANGED_EVENT, FAST_ACCESS_READY_EVENT, FAST_ACCESS_UPDATE_EVENT (+33 more)

### Community 20 - "AnalysisDetailScreen.tsx"
Cohesion: 0.10
Nodes (29): useAuthMaster(), FilterAnalysisModal(), Props, PasswordStrengthLevel, MEDIUM, STRONG, WEAK, canonicalizeForVariants() (+21 more)

### Community 21 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, adaptiveIcon, blockedPermissions, package, permissions, versionCode, projectId (+31 more)

### Community 22 - "ClavisPassHubClient.ts"
Cohesion: 0.12
Nodes (40): @react-native-async-storage/async-storage, calculateExpiresIn(), checkDiscovery(), createHubError(), createHubErrorFromPayload(), DiscoveryResponse, ensureVaultEtagForUpload(), fetchFile() (+32 more)

### Community 23 - "AnimatedPressable"
Cohesion: 0.06
Nodes (55): FilterItem, FiltersNarrowProps, FiltersWide, FiltersWideProps, styles, clampWidth(), Props, SettingsQuickSelect() (+47 more)

### Community 24 - "write.rs"
Cohesion: 0.12
Nodes (30): as_io_error(), BrowserWriteKind, CreateEntryFromBrowser, UpdateEntryFromBrowser, BrowserWriteRequest, BrowserWriteRequestStore, BrowserWriteResult, BrowserWriteResultStore (+22 more)

### Community 25 - "scripts"
Cohesion: 0.05
Nodes (37): scripts, android, android:build:apk, android:build:store, android:build:store-submit, android:submit:store, extension:build, extension:build:chrome (+29 more)

### Community 26 - "GoogleDriveClient.ts"
Cohesion: 0.11
Nodes (26): fetchFile(), fetchUserInfo(), refreshAccessToken(), uploadFile(), buildMultipartBody(), escapeDriveQueryString(), fetchFile(), fetchUserInfo() (+18 more)

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

### Community 31 - "LeftSideBar.tsx"
Cohesion: 0.29
Nodes (10): @expo/vector-icons, @react-navigation/bottom-tabs, CustomBottomTab(), getActiveRouteName(), getActiveRouteName(), LeftSideTabBar(), sidebarWidth, styles (+2 more)

### Community 32 - "UpdateManager.tsx"
Cohesion: 0.19
Nodes (14): expo-updates, react-native-safe-area-context, @tauri-apps/plugin-process, @tauri-apps/plugin-updater, Listener, listeners, publishUpdateCheck(), subscribeUpdateCheck() (+6 more)

### Community 33 - "store.ts"
Cohesion: 0.06
Nodes (41): Core Files, Providers, Settings Schema, Storage Layers, Sync And Storage Context, Tokens, ACTIONS, BLOCKED_HOTKEYS (+33 more)

### Community 34 - "commands.rs"
Cohesion: 0.10
Nodes (10): AUTH_REPLY_SIGNATURE, authenticate_with_system(), BLOCK_HAS_SIGNATURE, CF_UNICODETEXT_FORMAT, get_main_window_hwnd(), LAPOLICY_DEVICE_OWNER_AUTHENTICATION, reset_window_size(), set_content_protection() (+2 more)

### Community 35 - "LoginScreen.tsx"
Cohesion: 0.07
Nodes (68): Current Vault Format, Implementation Phases, expo-web-browser, OAuthRefreshError, Props, StoredAuth, TokenContext, useToken() (+60 more)

### Community 36 - "vcardExport.ts"
Cohesion: 0.14
Nodes (23): expo-sharing, @tauri-apps/plugin-dialog, @tauri-apps/plugin-fs, Import(), getFileNameFromPath(), pickDesktopAttachment(), saveDesktopAttachment(), buildFormattedName() (+15 more)

### Community 37 - "CloseBehaviorState"
Cohesion: 0.13
Nodes (10): claim_pending_lock_request(), close_main_window(), CloseBehavior, Exit, Hide, CloseBehaviorState, focus_main_window(), schedule_exit_watchdog() (+2 more)

### Community 38 - "state.ts"
Cohesion: 0.13
Nodes (14): buildPromptTitle(), ExtensionState, normalizeIdentity(), PreparedFillRecord, RegisteredFrameInfo, SavePromptEvaluation, SuggestionRowProps, FillDataResult (+6 more)

### Community 39 - "DraggableModulesList.shared.tsx"
Cohesion: 0.21
Nodes (16): dragDropAnimationConfig, DraggableModulesList(), DraggableModulesFooter(), DraggableModulesListProps, draggableModulesListStyles, FooterProps, reorderModules(), DraggableModulesListWeb() (+8 more)

### Community 40 - "mapKdbxToClavisPass.ts"
Cohesion: 0.15
Nodes (22): kdbxweb, configureKdbxArgon2(), importKdbx(), addCustomField(), addTotpModule(), addValueModule(), binaryToBytes(), binaryWithMetaToAttachment() (+14 more)

### Community 41 - "useAuth"
Cohesion: 0.09
Nodes (30): Props, ProtectedRoute(), styles, AppTabsParamList, getFocusedRouteName(), NavigationnContainer(), titlebarContentDragRoutes, LoginStack() (+22 more)

### Community 42 - "host.rs"
Cohesion: 0.16
Nodes (17): app_scheme(), bridge_result_to_response(), ensure_ready(), FillPayload, handle_request(), pairing_required(), PeerInfo, read_frame() (+9 more)

### Community 43 - "vault.rs"
Cohesion: 0.22
Nodes (20): domain_contains(), fill_data_for_entry(), FillDataResult, first_string(), FolderRef, login_entry(), match_domain_score(), normalize_domain() (+12 more)

### Community 44 - "GoogleDriveLoginButton.tsx"
Cohesion: 0.18
Nodes (21): expo-auth-session, expo-random, @fabianlars/tauri-plugin-oauth, ANDROID_AUTH_PROMPT_OPTIONS, DESKTOP_OAUTH_PORTS, getMobileRedirectUri(), GoogleDriveLoginButtonContent(), randState() (+13 more)

### Community 45 - "release.js"
Cohesion: 0.12
Nodes (19): androidGradleHasVersionCode(), androidGradleHasVersionName(), androidStringsHasRuntimeVersion(), cargoLockHasVersion(), cargoTomlHasVersion(), { execSync }, existingTags, filesToUpdate (+11 more)

### Community 46 - "Desktop And Tauri Context"
Cohesion: 0.29
Nodes (6): Chrome And Drag Regions, Core Files, Desktop And Tauri Context, Fast Access, Runtime Model, Tauri Responsibilities

### Community 47 - "CreditCardModule.tsx"
Cohesion: 0.27
Nodes (13): CreditCardModule(), CreditCardState, detectCardBrand(), digitsOnly(), formatCardNumber(), maskCardNumber(), passesLuhn(), PinModule() (+5 more)

### Community 48 - "screen_lock.rs"
Cohesion: 0.14
Nodes (6): CGSessionCopyCurrentDictionary(), emit(), ScreenLockPayload, Session, start(), wndproc()

### Community 49 - "ClavisPass Website Marketing Brief"
Cohesion: 0.05
Nodes (43): Attachments And Previews, Brand Details, Bring Your Own Sync, Browser Extension, Can I import my existing passwords?, Can my cloud provider read my passwords?, ClavisPass Website Marketing Brief, Conversion Priorities (+35 more)

### Community 50 - "createUniqueID"
Cohesion: 0.21
Nodes (22): addCardModule(), addCustomField(), addExpiryModule(), addIdentityModules(), addLoginModules(), addNote(), addSshKeyModule(), addTotp() (+14 more)

### Community 51 - "pairing.rs"
Cohesion: 0.28
Nodes (17): approve_pairing(), evaluate_pairing(), list_paired_clients(), list_pending_pairings(), list_rejected_clients(), load_pairing_store(), now_ms(), optional_identity_matches() (+9 more)

### Community 52 - "DeviceStorageClient.ts"
Cohesion: 0.38
Nodes (11): fetchFile(), getActiveLocalVaultIdKey(), getLocalSyncKey(), getLocalSyncMetadataKey(), getVaultLocalSyncKey(), getVaultLocalSyncMetadataKey(), LocalSyncMetadata, readLocalSyncMetadata() (+3 more)

### Community 53 - "background/bridge.ts"
Cohesion: 0.08
Nodes (33): Desktop bridge, deriveAppState(), DesktopBridgeService, getStoredPairingStatus(), normalizeDesktopStatus(), normalizeFillData(), normalizeSuggestions(), BrowserWriteResult (+25 more)

### Community 57 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, @babel/core, eslint, eslint-config-universe, patch-package, prettier, react-test-renderer, @tauri-apps/cli (+14 more)

### Community 58 - "prepare-msix.js"
Cohesion: 0.10
Nodes (16): appExe, appVersion, assetsOutputDir, createUnplatedTargetSizeIcons(), escapePowerShellSingleQuoted(), fs, manifest, manifestSource (+8 more)

### Community 60 - "VaultProvider"
Cohesion: 0.10
Nodes (18): Always Know, ClavisPass Agent Context, Context Routing, Fast Map, graphify, High-Risk Rules, Core Files, Master Password Lifetime (+10 more)

### Community 61 - "analysisEngine.ts"
Cohesion: 0.11
Nodes (29): expo-crypto, AnalysisFlags, CachedAnalysisItem, CacheResult, buildAnalysisCache(), findSequentialTriples(), hasRepeatedChars(), strengthFromEntropyBits() (+21 more)

### Community 62 - "ClavisPass"
Cohesion: 0.07
Nodes (28): 1. VaultSession (Authoritative & Secret-Capable), 2. VaultProvider (UI-Safe Projection), Authentication & Master Secret Handling, Backend / Plattform, CI / CD & Deployment, ClavisPass, Cryptography & Encryption Model, Defensive Defaults (+20 more)

### Community 63 - "bridge_commands.rs"
Cohesion: 0.15
Nodes (8): bridge_approve_pairing(), bridge_claim_pending_writes(), bridge_complete_write_request(), bridge_list_paired_clients(), bridge_list_pending_pairings(), bridge_list_rejected_clients(), bridge_publish_session(), bridge_reject_pairing()

### Community 64 - "NoteModule.tsx"
Cohesion: 0.14
Nodes (15): clamp(), DISPLAY_MODE_HEIGHTS, DISPLAY_MODES, NOTE_VARIANTS, NoteDisplayMode, NoteLanguage, NoteModule(), noteModuleDataEquals() (+7 more)

### Community 65 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+11 more)

### Community 66 - "AttachmentModule.tsx"
Cohesion: 0.18
Nodes (17): AttachmentModule(), canPreviewAttachment(), downloadBrowserAttachment(), formatBytes(), getAttachmentIcon(), getFileExtension(), getSafeFileName(), pickMobileAttachment() (+9 more)

### Community 67 - "ValuesType.ts"
Cohesion: 0.13
Nodes (27): papaparse, react-native-crypto-js, applyUpdateToEntry(), BrowserWriteKind, BrowserWriteRequest, createBrowserEntry(), CreatePayload, effectiveUrl() (+19 more)

### Community 68 - "ModulesEnum"
Cohesion: 0.07
Nodes (28): CustomFieldInputType, CustomFieldModuleType, CustomFieldModuleTypeSchema, regex, ModulesEnum, ADDRESS, ATTACHMENT, COMPANY (+20 more)

### Community 69 - "reactNativePaper.tsx"
Cohesion: 0.11
Nodes (14): ActivityIndicator, baseColors, Button, Chip, Divider, Icon, IconButton, MD3DarkTheme (+6 more)

### Community 71 - "i18n/index.ts"
Cohesion: 0.31
Nodes (7): expo-clipboard, i18next, resources, de, en, DEFAULT_NS, TranslationSchema

### Community 72 - "modulePolicy.ts"
Cohesion: 0.17
Nodes (13): buildEntryMeta(), EntryMeta, firstModule(), firstValue(), getSecretFor(), isManagedModule(), MANAGED_MODULE_VALUES, ManagedModules (+5 more)

### Community 73 - "Datenschutzerklärung"
Cohesion: 0.09
Nodes (22): 10. Browser-Erweiterung, 11. Benachrichtigungen, 12. Kontaktaufnahme, 13. Webseite und Hosting, 14. Cookies, Tracking und Analytics, 15. App Stores und Download-Plattformen, 16. Rechtsgrundlagen, 17. Speicherdauer (+14 more)

### Community 74 - "autofill-preferences.ts"
Cohesion: 0.36
Nodes (11): buildPreferenceResult(), DEFAULT_POLICY, DomainPolicyStore, getInlineAutofillPreferenceForUrl(), normalizeHost(), normalizeMode(), normalizePolicy(), readPolicyStore() (+3 more)

### Community 75 - "ObjcId"
Cohesion: 0.23
Nodes (15): authenticate_with_system_impl(), _Block_copy(), _Block_release(), check_system_auth_available(), cstring(), new_la_context(), _NSConcreteStackBlock, objc_class() (+7 more)

### Community 76 - "Privacy Policy"
Cohesion: 0.09
Nodes (22): 10. Browser Extension, 11. Notifications, 12. Contact, 13. Website And Hosting, 14. Cookies, Tracking And Analytics, 15. App Stores And Download Platforms, 16. Legal Bases, 17. Retention (+14 more)

### Community 77 - "BrowserExtensionsScreen.tsx"
Cohesion: 0.09
Nodes (33): @react-navigation/native, SettingsStackParamList, SettingsStack(), Stack, subscribeBrowserExtensionPairingChanges(), daysBetween(), DEFAULT_DEVICE_UI_POLICY, deriveDeviceUiStatus() (+25 more)

### Community 78 - "Nutzungsbedingungen"
Cohesion: 0.10
Nodes (20): 10. Erlaubte Nutzung, 11. Open Source und Lizenzen, 12. Kosten, 13. Drittanbieter, 14. Updates, 15. Haftung, 16. Beendigung der Nutzung, 17. Änderungen (+12 more)

### Community 79 - "model/types.ts"
Cohesion: 0.10
Nodes (20): @react-navigation/native-stack, AddTriggerStackParamList, AnalysisStackParamList, LoginStackParamList, RootStackParamList, AddTriggerStack(), Stack, Stack (+12 more)

### Community 80 - "prepare-native-host-sidecar.js"
Cohesion: 0.14
Nodes (12): cargoArgs, { copyFileSync, existsSync, mkdirSync, writeFileSync }, detectHostTriple(), { execFileSync }, { join, resolve }, manifestPath, outputDir, outputPath (+4 more)

### Community 81 - "reactNative.ts"
Cohesion: 0.11
Nodes (13): Animated, AnimatedValue, Dimensions, InteractionManager, Platform, Pressable, ScrollView, setPlatform() (+5 more)

### Community 82 - "mobileUpdater.ts"
Cohesion: 0.36
Nodes (8): checkMobileBinaryUpdate(), compareVersions(), getAppVersion(), getManifestDownloadUrl(), getMobileUpdateManifestUrl(), MobileBinaryUpdate, MobileUpdateManifest, parseVersion()

### Community 84 - "session.rs"
Cohesion: 0.22
Nodes (7): BridgeSessionSnapshot, clear_session(), load_session(), now_ms(), publish_session(), SESSION_TTL_MS, write_json_atomically()

### Community 85 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, build:chrome, build:firefox, build:firefox-local, dev, package:chrome, package:firefox (+6 more)

### Community 86 - "native_host_registration.rs"
Cohesion: 0.19
Nodes (10): CHROME_EXTENSION_IDS, chromium_origins(), CREATE_NO_WINDOW, EDGE_EXTENSION_IDS, find_native_host_exe(), FIREFOX_EXTENSION_ID, native_host_candidates(), NATIVE_HOST_NAME (+2 more)

### Community 87 - "useTheme"
Cohesion: 0.07
Nodes (55): useTheme(), Props, TokenQRCodeModal(), Props, SettingInfoButton(), styles, AddValueModal(), Props (+47 more)

### Community 88 - "TemplateEnum"
Cohesion: 0.13
Nodes (14): TemplateEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+6 more)

### Community 89 - "ClavisPass Browser Extension"
Cohesion: 0.13
Nodes (12): Architecture, Browser loading notes, ClavisPass Browser Extension, Current feature set, Development, Important note, Working from the repo root, Browser Extension Store Release (+4 more)

### Community 90 - "Terms Of Use"
Cohesion: 0.10
Nodes (20): 10. Permitted Use, 11. Open Source And Licenses, 12. Costs, 13. Third-Party Providers, 14. Updates, 15. Liability, 16. Ending Use, 17. Changes (+12 more)

### Community 91 - "protocol.rs"
Cohesion: 0.20
Nodes (7): BridgeClientInfo, BridgeError, BridgePairingEnvelope, BridgeRequest, BridgeResponse, HOST_NAME, PROTOCOL_VERSION

### Community 92 - "ContentProtectionProvider.tsx"
Cohesion: 0.38
Nodes (5): applyNativeContentProtection(), applyTauriContentProtection(), ContentProtectionContext, ContentProtectionContextValue, ContentProtectionProvider()

### Community 93 - "check-tauri-version-sync.js"
Cohesion: 0.24
Nodes (11): collectMismatches(), fs, getMajorMinor(), getNpmLockVersion(), mismatches, parseCargoLockVersions(), path, readJson() (+3 more)

### Community 94 - "prepare-sodium-16kb.js"
Cohesion: 0.16
Nodes (11): download(), { execFileSync }, extract(), fs, https, main(), os, path (+3 more)

### Community 95 - "ClavisPass Product Strategy Roadmap"
Cohesion: 0.11
Nodes (17): 1. Browser Extension Polish, 2. Passkeys, 3. Emergency Access / Trusted Contact, 4. Optional Web App, 5. Separate Secrets Sharing SaaS, Bitwarden Gaps To Treat As Strategic, ClavisPass Personal, ClavisPass Product Strategy Roadmap (+9 more)

### Community 96 - "SettingsScreen.tsx"
Cohesion: 0.06
Nodes (33): expo-constants, expo-linear-gradient, @gorhom/bottom-sheet, simple-icons, useContentProtection(), useDevMode(), ContentProtectionSettingsToggle(), Props (+25 more)

### Community 97 - "bundle"
Cohesion: 0.17
Nodes (12): bundle, active, category, copyright, createUpdaterArtifacts, externalBin, fileAssociations, icon (+4 more)

### Community 98 - "IdentitiesScreen.tsx"
Cohesion: 0.23
Nodes (11): IdentityStackParamList, IdentityStack(), Stack, IdentityEmailLogo(), getDefaultIdentityName(), countIdentityDomains(), IdentitiesScreen(), IdentitiesScreenProps (+3 more)

### Community 99 - "deriveIdentityClusters.ts"
Cohesion: 0.10
Nodes (25): Confidence And Trust, Core Idea, Data Model Direction, Design Tone, Identity Detail View, Identity Management Concept, Identity Tab, Important Principle (+17 more)

### Community 100 - "NoteEditorScreen.tsx"
Cohesion: 0.21
Nodes (12): NoteFullscreenEditor(), InlinePart, InlineText(), NoteMarkdownPreview(), parseInline(), Props, styles, NoteSelector() (+4 more)

### Community 101 - "BrowserBridgePairingPrompt.tsx"
Cohesion: 0.24
Nodes (12): BrowserBridgePairingPrompt(), PairingAction, PromptButton(), styles, actOnBrowserExtensionPairing(), BrowserExtensionPairingChangeListener, buildBrowserClientKey(), listBrowserExtensionPairings() (+4 more)

### Community 102 - "tauri.conf.json"
Cohesion: 0.18
Nodes (10): app, macOSPrivateApi, security, windows, identifier, mainBinaryName, productName, $schema (+2 more)

### Community 103 - "withAndroidApplicationId.js"
Cohesion: 0.17
Nodes (5): fs, path, { withDangerousMod }, fs, versionData

### Community 104 - "build-web-demo.js"
Cohesion: 0.20
Nodes (8): demoDotenvPath, demoEnv, env, fs, path, result, rewriteDemoPublicPaths(), { spawnSync }

### Community 105 - "react-native"
Cohesion: 0.05
Nodes (42): react-native, react-native-circular-progress, react-native-gesture-handler, react-native-paper, Props, ThemeContext, ThemeContextType, AnalysisEntry() (+34 more)

### Community 106 - "plugins"
Cohesion: 0.20
Nodes (10): args, customProtocol, plugins, cli, deepLink, updater, endpoints, pubkey (+2 more)

### Community 107 - "autofill-cache.ts"
Cohesion: 0.17
Nodes (21): clearAutofillDomainCache(), countPasswordSuggestions(), DomainAutofillCache, DomainAutofillCacheEntry, getAutofillEligibilityForUrl(), getCachedAutofillMatchCountForUrl(), getCachedMatchCount(), isFresh() (+13 more)

### Community 108 - "ValueIconsEnum"
Cohesion: 0.14
Nodes (13): ValueIconsEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+5 more)

### Community 109 - "container/AnimatedOpacityContainer.tsx"
Cohesion: 0.31
Nodes (6): AnimatedOpacityContainer(), Props, AnimatedOpacityContainerWeb(), Props, Props, AnimatedOpacityContainer()

### Community 110 - "AuthProvider.tsx"
Cohesion: 0.22
Nodes (10): AuthContext, AuthContextType, AuthMasterContext, AuthMasterContextType, AuthProvider(), Props, ScreenLockLogoutController, initScreenLockLogout() (+2 more)

### Community 111 - "editHistory.ts"
Cohesion: 0.23
Nodes (12): appendLog(), areValuesEqual(), cloneValue(), createLogEntry(), EditHistoryActionType, EditHistoryMeta, EditSessionLogEntry, HistoryEntry (+4 more)

### Community 112 - "Vault Modules Context"
Cohesion: 0.33
Nodes (5): Important Boundaries, Reorder Flows, Shared Module UI, Vault Modules Context, Verification

### Community 113 - "CloudStorageClient.ts"
Cohesion: 0.38
Nodes (6): TokenContextValue, FetchFileParams, TokenRefreshParams, Provider, RemoteFileContent, UploadFileParams

### Community 114 - "reactNativeReanimated.tsx"
Cohesion: 0.25
Nodes (4): Animated, AnimatedView, Easing, FadeInDown

### Community 116 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, @types/chrome, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react

### Community 117 - "compilerOptions"
Cohesion: 0.29
Nodes (6): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, include

### Community 118 - "VaultFileOpenHandler.tsx"
Cohesion: 0.36
Nodes (10): createVaultDeviceId(), DeviceIdentity, getCurrentVaultDeviceId(), getDeviceDisplayName(), getPlatformString(), normalizeDeviceIdentityPart(), tryGetTauriDeviceIdentity(), getFileName() (+2 more)

### Community 119 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, moduleResolution, strict, exclude, extends

### Community 120 - "Store Release Roadmap"
Cohesion: 0.17
Nodes (11): Apple Developer Program, Arratel Setup Plan, Chrome Web Store, Goals, Google Play, Microsoft Store, Publisher Naming, References (+3 more)

### Community 121 - "fill.ts"
Cohesion: 0.35
Nodes (10): applyTargets(), buildNoFieldsResult(), collectFillTargets(), emitInputEvents(), executeFill(), FillSnapshot, FillTarget, previewFill() (+2 more)

### Community 123 - "decryptVaultContent.ts"
Cohesion: 0.06
Nodes (43): base64-js, libsodium-wrappers-sumo, react-native-sodium-jsi, VaultDataTypeSchema, DecryptVaultContentResult, DEFAULT_ENCRYPT_MODE, EncryptMode, EncryptVaultContentResult (+35 more)

### Community 124 - "TotpModule.tsx"
Cohesion: 0.20
Nodes (11): otpauth, styles, Totp(), TotpModule(), TotpModuleModuleProps, regex, TotpModuleType, TotpModuleTypeSchema (+3 more)

### Community 125 - "brand.ts"
Cohesion: 0.20
Nodes (7): BrandLogo(), CLAVISPASS_BRAND_NAME, CLAVISPASS_EXTENSION_DESCRIPTION, CLAVISPASS_EXTENSION_NAME, CLAVISPASS_POPUP_DESCRIPTION, CLAVISPASS_POPUP_EYEBROW, CLAVISPASS_POPUP_TITLE

### Community 126 - "AnimatedContainer"
Cohesion: 0.10
Nodes (29): expo-camera, @hello-pangea/dnd, react-native-draggable-flatlist, HomeStackParamList, HomeStack(), Stack, NativeDragHandleScrollLockProvider(), WebDragHandlePropsProvider() (+21 more)

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

### Community 141 - "DigitalCardModule.tsx"
Cohesion: 0.27
Nodes (8): DigitalCardModule(), DigitalCardModuleProps, isDigitalCardType(), styles, DIGITAL_CARD_TYPES, DigitalCardModuleType, DigitalCardModuleTypeSchema, regex

### Community 142 - "linux"
Cohesion: 0.67
Nodes (3): linux, depends, deb

### Community 144 - "Crypto Context"
Cohesion: 0.40
Nodes (4): Core Files, Critical Rules, Crypto Context, Verification

### Community 171 - "Header"
Cohesion: 0.08
Nodes (31): Common Refactor Targets, Files To Check First, Screen Standardization Context, Standard Checklist, Chips, Compact Search Behavior, Content Panels, Current Visual Direction (+23 more)

### Community 172 - "browser-extension/package.json"
Cohesion: 0.18
Nodes (10): react, react-dom, @types/react, @types/react-dom, typescript, name, private, type (+2 more)

### Community 173 - "AuthReplyBlock"
Cohesion: 0.25
Nodes (5): auth_reply(), AUTH_REPLY_DESCRIPTOR, AuthReplyBlock, AuthState, BlockDescriptor

### Community 174 - "errorBus.ts"
Cohesion: 0.42
Nodes (6): Listener, listeners, subscribeGlobalError(), unsubscribeGlobalError(), GlobalErrorPayload, GlobalErrorSnackbar()

### Community 175 - "Firefox Store Release Notes"
Cohesion: 0.25
Nodes (7): Extension Identity, Firefox Store Release Notes, Listing, Pre-Submit Check, Privacy Policy Draft, Release Artifacts, Reviewer Notes

### Community 176 - "UI Context"
Cohesion: 0.22
Nodes (8): i18n, Important Files, Interaction Polish, Menus And Dropdowns, Platform Model, Related UI Context, Titlebar And Chrome, UI Context

### Community 177 - "ClavisPassHubDiscoveryResult.ts"
Cohesion: 0.29
Nodes (6): ClavisPassHubDiscoveryResult, ClavisPassHubDiscoveryStatus, DiscoveryCheckingResult, DiscoveryErrorResult, DiscoveryIdleResult, DiscoverySuccessResult

### Community 178 - "ClavisPass Firefox Add-on Reviewer Build"
Cohesion: 0.33
Nodes (5): Build Steps, ClavisPass Firefox Add-on Reviewer Build, Environment, Firefox Add-on ID, Native Messaging Notes

### Community 179 - "NoteFullscreenEditor.web.tsx"
Cohesion: 0.33
Nodes (5): @monaco-editor/react, MONACO_LANGUAGE_BY_NOTE_LANGUAGE, NoteFullscreenEditor(), Props, styles

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
Cohesion: 0.17
Nodes (13): AddModuleModalCompactFav(), defineModules(), IdsOf, MissingIds, ModuleCategory, ModuleMeta, Props, TinyFilterChip() (+5 more)

### Community 185 - "dependencies"
Cohesion: 0.67
Nodes (3): dependencies, react, react-dom

### Community 189 - "isTauri.ts"
Cohesion: 0.08
Nodes (37): MainWindowReadySignal(), getClipboardText(), tryNavigatorReadText(), tryNavigatorWriteText(), detectBrowserWebEnvironment(), isBrowserWebEnvironment(), isMacWebRuntime(), isTauriEnvironment() (+29 more)

### Community 190 - "pkce.web.ts"
Cohesion: 0.80
Nodes (4): base64Url(), createPkcePair(), randomBytes(), toCodeChallenge()

### Community 192 - "PairingStatus"
Cohesion: 0.50
Nodes (4): PairingStatus, Paired, Pending, Unpaired

### Community 195 - "VaultProvider.tsx"
Cohesion: 0.08
Nodes (39): VaultContext, VaultData, FolderSchema, VaultDataType, VaultEntryTombstone, VaultEntryTombstoneSchema, VaultDeviceSchema, VaultDeviceType (+31 more)

### Community 196 - "GlobalClipboardSnackbar.tsx"
Cohesion: 0.38
Nodes (7): Handler, handlers, subscribeClipboardCopied(), unsubscribeClipboardCopied(), ClipboardCopyPayload, GlobalClipboardSnackbar(), msToSecCeil()

### Community 197 - "detectTauriEnvironment"
Cohesion: 0.24
Nodes (19): expo-local-authentication, CloudProvider(), isInvalidGrant(), authenticateUser(), invokeTauriSystemAuth(), invokeTauriSystemAuthAvailable(), isSystemAuthenticationAvailable(), loadAuthentication() (+11 more)

### Community 204 - "Import.tsx"
Cohesion: 0.17
Nodes (11): expo-document-picker, VaultContextType, DocumentTypeEnum, BITWARDEN, CHROME, FIREFOX, KDBX, PCLOUD (+3 more)

## Knowledge Gaps
- **128 isolated node(s):** `react`, `react-dom`, `@types/chrome`, `@types/react`, `@types/react-dom` (+123 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1637 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **45 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `store.ts`, `ModulesEnum.ts`, `deriveIdentityClusters.ts`, `package.json`, `VaultProvider.tsx`, `vite.config.ts`, `DraggableModulesList.shared.tsx`, `modulePolicy.ts`, `GoogleDriveLoginButton.tsx`, `BrowserExtensionsScreen.tsx`, `createUniqueID`, `DeviceStorageClient.ts`, `ClavisPassHubClient.ts`, `TemplateEnum`, `GoogleDriveClient.ts`, `decryptVaultContent.ts`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **What connects `react`, `react-dom`, `@types/chrome` to the rest of the system?**
  _128 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ModulesType.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06001984126984127 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `ModulesType.ts`, `ModulesEnum.ts`, `CardDetailsScreen.tsx`, `package.json`, `getModule.tsx`, `App.tsx`, `EditScreen.tsx`, `ExpiryModule.tsx`, `ref_react`, `DigitalCardModule.tsx`, `AnalysisScreen.tsx`, `useSetting`, `FastAccess.ts`, `AnalysisDetailScreen.tsx`, `AnimatedPressable`, `LeftSideBar.tsx`, `UpdateManager.tsx`, `LoginScreen.tsx`, `vcardExport.ts`, `DraggableModulesList.shared.tsx`, `useAuth`, `Header`, `GoogleDriveLoginButton.tsx`, `errorBus.ts`, `CreditCardModule.tsx`, `NoteFullscreenEditor.web.tsx`, `AddModuleModal.tsx`, `isTauri.ts`, `NoteModule.tsx`, `AttachmentModule.tsx`, `ModulesEnum`, `detectTauriEnvironment`, `GlobalClipboardSnackbar.tsx`, `Import.tsx`, `BrowserExtensionsScreen.tsx`, `model/types.ts`, `mobileUpdater.ts`, `useTheme`, `ContentProtectionProvider.tsx`, `SettingsScreen.tsx`, `IdentitiesScreen.tsx`, `NoteEditorScreen.tsx`, `BrowserBridgePairingPrompt.tsx`, `container/AnimatedOpacityContainer.tsx`, `AuthProvider.tsx`, `VaultFileOpenHandler.tsx`, `TotpModule.tsx`, `AnimatedContainer`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.01904761904761905 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `ModulesEnum.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08874912648497554 - nodes in this community are weakly interconnected._
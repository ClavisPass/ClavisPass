# Graph Report - ClavisPass  (2026-11-08)

## Corpus Check
- 585 files · ~361,353 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 37 file(s) not represented in the graph (top: .xml 11, (none) 8, .properties 2)

## Summary
- 4002 nodes · 11066 edges · 202 communities (155 shown, 47 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 164 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `174f7ab5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CryptoProvider
- dependencies
- getModule.tsx
- ModulesEnum.ts
- package.json
- ModulesEnum
- AnimatedPressable
- UI Patterns Context
- ThemeProvider.tsx
- decryptVaultContent.ts
- hotkeys.ts
- content/index.ts
- shared/types.ts
- popup/App.tsx
- react-i18next
- background/index.ts
- background/bridge.ts
- CloudStorageClient.ts
- Header
- FastAccess.ts
- shared/bridge.ts
- expo
- ClavisPassHubClient.ts
- HomeScreen.tsx
- write.rs
- scripts
- react-native
- manifest.json
- isTauriEnvironment
- forms.ts
- lib.rs
- ClavisPass Native Messaging Bridge
- UpdateManager.tsx
- mergeVaultData.ts
- commands.rs
- LoginScreen.tsx
- AttachmentModule.tsx
- CloseBehaviorState
- state.ts
- DraggableModulesList.shared.tsx
- mapKdbxToClavisPass.ts
- detectTauriEnvironment
- host.rs
- vault.rs
- DevicesScreen.tsx
- release.js
- AuthProvider.tsx
- rnSodiumProvider.ts
- AnalysisDetailScreen.tsx
- ClavisPass Website Marketing Brief
- bitwarden.ts
- pairing.rs
- TotpModule.tsx
- Idee: Identity als persönlicher Hauptscreen
- VaultProvider.tsx
- BrowserExtensionsScreen.tsx
- vite.config.ts
- devDependencies
- prepare-msix.js
- store.ts
- screen_lock.rs
- Crypto Context
- ClavisPass
- AttachmentPreviewScreen.native.tsx
- reactNative.ts
- compilerOptions
- vitest
- webauthn.rs
- deriveIdentityClusters.ts
- reactNativePaper.tsx
- MainApplication.kt
- getModuleData
- appScheme.test.ts
- Datenschutzerklärung
- autofill-preferences.ts
- ObjcId
- Privacy Policy
- SettingsProvider.tsx
- Nutzungsbedingungen
- BrowserBridgeWriteSync.tsx
- prepare-native-host-sidecar.js
- NoteModule.tsx
- LeftSideBar.tsx
- MainActivity.kt
- session.rs
- scripts
- protocol.rs
- App.tsx
- path.rs
- bridge_commands.rs
- Terms Of Use
- UI Context
- container/AnimatedOpacityContainer.tsx
- check-tauri-version-sync.js
- prepare-sodium-16kb.js
- ClavisPass Product Strategy Roadmap
- useTheme
- bundle
- MobileFastAccessOverlay.tsx
- Identity Management Concept
- tab-context.ts
- i18n/index.ts
- tauri.conf.json
- withAndroidApplicationId.js
- build-web-demo.js
- ref_react
- plugins
- editHistory.ts
- AddValueModal.tsx
- DeviceStorageClient.ts
- distribution.ts
- fill.ts
- vcardExport.ts
- ClavisPass Passkey Management Roadmap
- reactNativeReanimated.tsx
- reactNavigationNative.ts
- devDependencies
- compilerOptions
- totp.ts
- tsconfig.json
- Store Release Roadmap
- native_host_registration.rs
- model/types.ts
- AmbientBackground.tsx
- domain.ts
- serve-webauthn-test-page.js
- SettingsScreen.tsx
- macOS
- windows
- gorhomBottomSheet.tsx
- WifiTypeEnum
- build
- vite-env.d.ts
- AppWithNavigation
- errorBus.ts
- BridgeStatusBadge.tsx
- IdentityDetailScreen.tsx
- linux
- asyncStorage.ts
- mobileUpdater.ts
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
- CardDetailsScreen.tsx
- Firefox Store Release Notes
- vaultIdentity.ts
- generate-webauthn-test-passkey.js
- ClavisPass Firefox Add-on Reviewer Build
- BrandHeader.tsx
- Bitwarden Import Roadmap
- Agent Workflow Context
- Build, Release, And Update Context
- Identity Context
- Vault V2 Key Envelope Roadmap
- ClavisPassHubDiscoveryResult.ts
- CLAUDE.md
- .claude/CLAUDE.md
- isTauri.ts
- Sync And Storage Context
- EditScreen.tsx
- Login.tsx
- content-messages.ts
- generatePassword.ts
- dependencies
- AuthState
- expoVectorIcons.tsx
- DocumentTypeEnum
- expiry.ts
- hotkeyRecordingBus.ts
- InlineNotice.tsx

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 274 edges
2. `react-native` - 186 edges
3. `react-native-paper` - 131 edges
4. `ModulesEnum` - 117 edges
5. `react-i18next` - 104 edges
6. `detectTauriEnvironment()` - 80 edges
7. `AnimatedPressable` - 80 edges
8. `Modal()` - 57 edges
9. `SettingsScreen()` - 56 edges
10. `useSetting()` - 55 edges

## Surprising Connections (you probably didn't know these)
- `Master Password Lifetime` --references--> `AuthProvider()`  [INFERRED]
  docs/context/security.md → src/app/providers/AuthProvider.tsx
- `Implementation` --references--> `AuthProvider()`  [INFERRED]
  README.md → src/app/providers/AuthProvider.tsx
- `Tokens` --references--> `CloudProvider()`  [INFERRED]
  docs/context/sync-storage.md → src/app/providers/CloudProvider.tsx
- `Current Visual Direction` --references--> `ThemeProvider()`  [INFERRED]
  docs/context/ui-patterns.md → src/app/providers/ThemeProvider.tsx
- `Chips` --references--> `AppChip()`  [INFERRED]
  docs/context/ui-patterns.md → src/shared/components/chips/AppChip.tsx

## Import Cycles
- None detected.

## Communities (202 total, 47 thin omitted)

### Community 0 - "CryptoProvider"
Cohesion: 0.18
Nodes (16): CryptoProvider, assertPositiveSafeInteger(), decryptVaultV1(), encryptVaultV1(), verifyVaultV1Provider(), makeV2KeywrapAadBytes(), makeV2PayloadAadBytes(), te (+8 more)

### Community 1 - "dependencies"
Cohesion: 0.02
Nodes (105): dependencies, argon2-browser, @babel/plugin-proposal-export-namespace-from, base64-js, crypto-js, expo, expo-auth-session, expo-blur (+97 more)

### Community 2 - "getModule.tsx"
Cohesion: 0.04
Nodes (80): zod, FastAccessType, FastAccessTypeSchema, AddressModuleType, AddressModuleTypeSchema, regex, CompanyModuleType, CompanyModuleTypeSchema (+72 more)

### Community 3 - "ModulesEnum.ts"
Cohesion: 0.11
Nodes (17): papaparse, decrypt(), EntryExternalRefsSchema, ValuesListType, ValuesType, EntryMeta, firstModule(), firstValue() (+9 more)

### Community 4 - "package.json"
Cohesion: 0.03
Nodes (73): react, react-dom, @types/react, @types/react-dom, typescript, main, name, private (+65 more)

### Community 5 - "ModulesEnum"
Cohesion: 0.08
Nodes (25): ModulesEnum, ADDRESS, ATTACHMENT, COMPANY, CREDIT_CARD, CUSTOM_FIELD, DIGITAL_CARD, DOCUMENT (+17 more)

### Community 6 - "AnimatedPressable"
Cohesion: 0.07
Nodes (55): Item Surfaces, FolderFilter(), Props, styles, CategoryItem(), Props, ellipsize(), failedFaviconUrls (+47 more)

### Community 7 - "UI Patterns Context"
Cohesion: 0.29
Nodes (6): Chips, Compact Search Behavior, Content Panels, Current Visual Direction, UI Patterns Context, Verification

### Community 8 - "ThemeProvider.tsx"
Cohesion: 0.07
Nodes (33): @react-native-assets/slider, react-native-gesture-handler, react-native-paper, Props, ThemeContext, ThemeContextType, Pattern(), Props (+25 more)

### Community 9 - "decryptVaultContent.ts"
Cohesion: 0.18
Nodes (12): getEmptyData(), DecryptVaultContentResult, makeV1AadBytes(), te, V1_AAD_OBJECT, VaultV1, VaultV1Schema, TEST_PAYLOAD (+4 more)

### Community 10 - "hotkeys.ts"
Cohesion: 0.16
Nodes (18): HotkeyRecorderItem(), Props, ACTIONS, BLOCKED_HOTKEYS, DEFAULT_HOTKEYS, getDefaultHotkey(), getDefaultHotkeys(), getHotkeyConflict() (+10 more)

### Community 11 - "content/index.ts"
Cohesion: 0.12
Nodes (35): applyThemeToInlinePicker(), clearInlinePreview(), commitInlineAction(), createCloseIcon(), createInlineLogo(), createPickerLogo(), ensureInlineStyles(), fillSuggestionFromPicker() (+27 more)

### Community 12 - "shared/types.ts"
Cohesion: 0.06
Nodes (46): BackgroundHandler, BackgroundHandlerMap, BackgroundMessageContext, BackgroundMessageRouter, FillStateCardProps, GetFillDataForEntryPayload, GetPasskeyMetadataForEntryPayload, ExtensionMessage (+38 more)

### Community 13 - "popup/App.tsx"
Cohesion: 0.07
Nodes (42): registerContentFrame(), setupSavePromptListener(), setupWebAuthnProbe(), App(), handleFill(), handleOpenDesktopApp(), handlePasskeyAssertion(), handlePromptResolution() (+34 more)

### Community 14 - "react-i18next"
Cohesion: 0.07
Nodes (61): react-i18next, PasswordGeneratorModal(), ModuleContainer(), ModuleContainerProps, moduleStyles, AddressModule(), AddressState, CompanyModule() (+53 more)

### Community 15 - "background/index.ts"
Cohesion: 0.09
Nodes (54): clearAutofillDomainCache(), countPasswordSuggestions(), countVisibleSuggestions(), DomainAutofillCache, DomainAutofillCacheEntry, getAutofillEligibilityForUrl(), getCachedAutofillMatchCountForUrl(), getCachedMatchCount() (+46 more)

### Community 16 - "background/bridge.ts"
Cohesion: 0.12
Nodes (26): Desktop bridge, deriveAppState(), DesktopBridgeService, getStoredPairingStatus(), normalizeAssertionCredential(), normalizeDesktopStatus(), normalizeFillData(), normalizePasskeyMetadata() (+18 more)

### Community 17 - "CloudStorageClient.ts"
Cohesion: 0.11
Nodes (32): @tauri-apps/plugin-fs, TokenContextValue, Props, UserInfoProps, fetchFile(), fetchUserInfo(), refreshAccessToken(), uploadFile() (+24 more)

### Community 18 - "Header"
Cohesion: 0.08
Nodes (37): Common Refactor Targets, Files To Check First, Screen Standardization Context, Standard Checklist, Headers, Standard Screen Structure, Important Boundaries, Reorder Flows (+29 more)

### Community 19 - "FastAccess.ts"
Cohesion: 0.16
Nodes (17): FAST_ACCESS_NOTIFICATION_CATEGORY, FAST_ACCESS_POPUP_LABEL, FAST_ACCESS_POSITION_CHANGED_EVENT, FAST_ACCESS_READY_EVENT, FAST_ACCESS_UPDATE_EVENT, animatePopupToPosition(), buildFastAccessKey(), configureMobileFastAccess() (+9 more)

### Community 20 - "shared/bridge.ts"
Cohesion: 0.12
Nodes (25): NativeMessagingClient, NativeMessagingError, toBridgeError(), validateBridgeResponse(), withTimeout(), createInstanceId(), getBridgeClientInfo(), getBrowserDisplayName() (+17 more)

### Community 21 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, adaptiveIcon, blockedPermissions, package, permissions, versionCode, projectId (+31 more)

### Community 22 - "ClavisPassHubClient.ts"
Cohesion: 0.12
Nodes (40): @react-native-async-storage/async-storage, calculateExpiresIn(), checkDiscovery(), createHubError(), createHubErrorFromPayload(), DiscoveryResponse, ensureVaultEtagForUpload(), fetchFile() (+32 more)

### Community 23 - "HomeScreen.tsx"
Cohesion: 0.08
Nodes (31): Known Custom Screens, @gorhom/bottom-sheet, @react-native-masked-view/masked-view, react-native-reanimated, HomeFilterMenu(), AddValueModal(), ModuleFilterModal(), buildEntryMeta() (+23 more)

### Community 24 - "write.rs"
Cohesion: 0.10
Nodes (35): as_io_error(), BrowserWriteKind, CreateEntryFromBrowser, ReservePasskeyAssertion, UpdateEntryFromBrowser, BrowserWriteRequest, BrowserWriteRequestStore, BrowserWriteResult (+27 more)

### Community 25 - "scripts"
Cohesion: 0.05
Nodes (39): scripts, android, android:build:apk, android:build:store, android:build:store-submit, android:submit:store, extension:build, extension:build:chrome (+31 more)

### Community 26 - "react-native"
Cohesion: 0.06
Nodes (30): react-native, FilterItem, FiltersNarrowProps, FiltersWide, FiltersWideProps, styles, Props, Props (+22 more)

### Community 27 - "manifest.json"
Cohesion: 0.06
Nodes (35): action, default_icon, default_popup, default_title, background, service_worker, type, browser_specific_settings (+27 more)

### Community 28 - "isTauriEnvironment"
Cohesion: 0.10
Nodes (23): getClipboardText(), setClipboardText(), tryNavigatorReadText(), tryNavigatorWriteText(), clipboardClearScheduler, ClipboardContentKind, clipboardOwnership, fingerprintValue() (+15 more)

### Community 29 - "forms.ts"
Cohesion: 0.11
Nodes (33): AutofillPlan, buildAutofillPlan(), buildDetachedContainer(), buildFieldKey(), buildFieldText(), buildFormId(), chooseBestField(), ClassifiedField (+25 more)

### Community 30 - "lib.rs"
Cohesion: 0.11
Nodes (19): clamp_window_size(), clamp_window_size_to_monitor(), DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIDTH, emit_lock_vault(), emit_vault_file_open_request(), get_requested_vault_file_path(), get_window_size_file_path() (+11 more)

### Community 31 - "ClavisPass Native Messaging Bridge"
Cohesion: 0.06
Nodes (29): Architecture, Browser loading notes, ClavisPass Browser Extension, Current feature set, Development, Important note, Working from the repo root, Chosen architecture (+21 more)

### Community 32 - "UpdateManager.tsx"
Cohesion: 0.21
Nodes (14): expo-updates, react-native-safe-area-context, @tauri-apps/plugin-process, @tauri-apps/plugin-updater, Listener, listeners, publishUpdateCheck(), subscribeUpdateCheck() (+6 more)

### Community 33 - "mergeVaultData.ts"
Cohesion: 0.09
Nodes (34): DEMO_MASTER_PASSWORD, demoVault, folders, FolderSchema, ValuesListTypeSchema, VaultDataType, VaultDataTypeSchema, VaultEntryTombstone (+26 more)

### Community 34 - "commands.rs"
Cohesion: 0.09
Nodes (12): AUTH_REPLY_DESCRIPTOR, AUTH_REPLY_SIGNATURE, authenticate_with_system(), BLOCK_HAS_SIGNATURE, BlockDescriptor, CF_UNICODETEXT_FORMAT, get_main_window_hwnd(), LAPOLICY_DEVICE_OWNER_AUTHENTICATION (+4 more)

### Community 35 - "LoginScreen.tsx"
Cohesion: 0.09
Nodes (55): expo-auth-session, expo-linking, expo-random, expo-web-browser, @fabianlars/tauri-plugin-oauth, @tauri-apps/plugin-dialog, @tauri-apps/plugin-shell, useToken() (+47 more)

### Community 36 - "AttachmentModule.tsx"
Cohesion: 0.09
Nodes (32): Shared Module UI, Props, styles, EditRowControlsContainer(), EditRowControlsContainerProps, NativeDragHandleScrollLockContext, WebDragHandlePropsContext, AttachmentModule() (+24 more)

### Community 37 - "CloseBehaviorState"
Cohesion: 0.13
Nodes (10): claim_pending_lock_request(), close_main_window(), CloseBehavior, Exit, Hide, CloseBehaviorState, focus_main_window(), schedule_exit_watchdog() (+2 more)

### Community 38 - "state.ts"
Cohesion: 0.12
Nodes (14): buildPromptTitle(), ExtensionState, normalizeIdentity(), PreparedFillRecord, RegisteredFrameInfo, SavePromptEvaluation, SuggestionRowProps, FillDataResult (+6 more)

### Community 39 - "DraggableModulesList.shared.tsx"
Cohesion: 0.18
Nodes (19): dragDropAnimationConfig, DraggableModulesList(), DraggableModulesFooter(), DraggableModulesListProps, draggableModulesListStyles, FooterProps, reorderModules(), DraggableModulesListWeb() (+11 more)

### Community 40 - "mapKdbxToClavisPass.ts"
Cohesion: 0.12
Nodes (26): kdbxweb, configureKdbxArgon2(), importKdbx(), addCustomField(), addTotpModule(), addValueModule(), binaryToBytes(), binaryWithMetaToAttachment() (+18 more)

### Community 41 - "detectTauriEnvironment"
Cohesion: 0.12
Nodes (32): getCurrentWindowSafe(), @tauri-apps/api, CloudProvider(), isInvalidGrant(), OAuthRefreshError, Props, StoredAuth, TokenContext (+24 more)

### Community 42 - "host.rs"
Cohesion: 0.13
Nodes (23): app_scheme(), AssertPasskeyPayload, bridge_result_to_response(), ensure_ready(), FillPayload, handle_request(), is_es256_algorithm(), MatchPasskeysPayload (+15 more)

### Community 43 - "vault.rs"
Cohesion: 0.11
Nodes (39): domain_contains(), entry_match_hosts(), fill_data_for_entry(), FillDataResult, first_string(), FolderRef, has_passkey(), login_entry() (+31 more)

### Community 44 - "DevicesScreen.tsx"
Cohesion: 0.09
Nodes (32): @hello-pangea/dnd, react-native-draggable-flatlist, NativeDragHandleScrollLockProvider(), WebDragHandlePropsProvider(), daysBetween(), DEFAULT_DEVICE_UI_POLICY, deriveDeviceUiStatus(), DeviceUiPolicy (+24 more)

### Community 45 - "release.js"
Cohesion: 0.12
Nodes (19): androidGradleHasVersionCode(), androidGradleHasVersionName(), androidStringsHasRuntimeVersion(), cargoLockHasVersion(), cargoTomlHasVersion(), { execSync }, existingTags, filesToUpdate (+11 more)

### Community 46 - "AuthProvider.tsx"
Cohesion: 0.20
Nodes (10): AuthContext, AuthContextType, AuthMasterContext, AuthMasterContextType, AuthProvider(), Props, ScreenLockLogoutController, initScreenLockLogout() (+2 more)

### Community 47 - "rnSodiumProvider.ts"
Cohesion: 0.14
Nodes (11): base64-js, libsodium-wrappers-sumo, react-native-sodium-jsi, getCryptoProvider(), rnSodiumProvider, td, te, verifyProviderInDev() (+3 more)

### Community 48 - "AnalysisDetailScreen.tsx"
Cohesion: 0.05
Nodes (76): expo-crypto, useAuthMaster(), FiltersNarrow, FilterAnalysisModal(), Props, AnalysisFlags, AnalysisRef, CachedAnalysisItem (+68 more)

### Community 49 - "ClavisPass Website Marketing Brief"
Cohesion: 0.05
Nodes (43): Attachments And Previews, Brand Details, Bring Your Own Sync, Browser Extension, Can I import my existing passwords?, Can my cloud provider read my passwords?, ClavisPass Website Marketing Brief, Conversion Priorities (+35 more)

### Community 50 - "bitwarden.ts"
Cohesion: 0.20
Nodes (24): addCardModule(), addCustomField(), addExpiryModule(), addIdentityModules(), addLoginModules(), addNote(), addPasskeyModules(), addSshKeyModule() (+16 more)

### Community 51 - "pairing.rs"
Cohesion: 0.21
Nodes (21): approve_pairing(), evaluate_pairing(), list_paired_clients(), list_pending_pairings(), list_rejected_clients(), load_pairing_store(), now_ms(), optional_identity_matches() (+13 more)

### Community 52 - "TotpModule.tsx"
Cohesion: 0.13
Nodes (17): react-native-circular-progress, AnalysisEntry(), Props, AnalysisEntryGradient(), Props, Props, styles, TotpItem() (+9 more)

### Community 53 - "Idee: Identity als persönlicher Hauptscreen"
Cohesion: 0.22
Nodes (8): Datenschutz, Einschätzung, Gestaltungsprinzipien und offene Fragen, Idee: Identity als persönlicher Hauptscreen, Mögliche Ausbaustufen, Mögliche Funktionen, Technischer Ansatz, Ziel

### Community 54 - "VaultProvider.tsx"
Cohesion: 0.09
Nodes (43): Current Vault Format, Implementation Phases, expo-document-picker, useAuth(), useVault(), VaultContext, VaultContextType, VaultData (+35 more)

### Community 55 - "BrowserExtensionsScreen.tsx"
Cohesion: 0.15
Nodes (24): BrowserBridgePairingPrompt(), PairingAction, PromptButton(), styles, actOnBrowserExtensionPairing(), BrowserExtensionPairingChangeListener, buildBrowserClientKey(), listBrowserExtensionPairings() (+16 more)

### Community 57 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, @babel/core, eslint, eslint-config-universe, patch-package, prettier, react-test-renderer, @tauri-apps/cli (+14 more)

### Community 58 - "prepare-msix.js"
Cohesion: 0.10
Nodes (16): appExe, appVersion, assetsOutputDir, createUnplatedTargetSizeIcons(), escapePowerShellSingleQuoted(), fs, manifest, manifestSource (+8 more)

### Community 59 - "store.ts"
Cohesion: 0.13
Nodes (20): clampWidth(), SettingsQuickSelect(), BooleanDef, DataKey, DEVICE_RESET_KEYS, EnumDef, get(), isModulesEnumValue() (+12 more)

### Community 60 - "screen_lock.rs"
Cohesion: 0.11
Nodes (8): DeviceIdentity, get_device_identity(), CGSessionCopyCurrentDictionary(), emit(), ScreenLockPayload, Session, start(), wndproc()

### Community 61 - "Crypto Context"
Cohesion: 0.40
Nodes (4): Core Files, Critical Rules, Crypto Context, Verification

### Community 62 - "ClavisPass"
Cohesion: 0.07
Nodes (28): 1. VaultSession (Authoritative & Secret-Capable), 2. VaultProvider (UI-Safe Projection), Authentication & Master Secret Handling, Backend / Plattform, CI / CD & Deployment, ClavisPass, Cryptography & Encryption Model, Defensive Defaults (+20 more)

### Community 63 - "AttachmentPreviewScreen.native.tsx"
Cohesion: 0.15
Nodes (17): expo-file-system, react-native-pdf, getAttachmentPreview(), previews, AttachmentPreviewScreen(), AttachmentPreviewScreenProps, getDataUri(), getExtension() (+9 more)

### Community 64 - "reactNative.ts"
Cohesion: 0.07
Nodes (30): refreshAccessToken(), buildGoogleLoopbackRedirectUri(), getGoogleClientIdForCurrentPlatform(), getGoogleClientSecretForCurrentPlatform(), getGoogleDesktopClientId(), getGoogleDesktopClientSecret(), getGoogleMobileRedirectUri(), normalizeClientId() (+22 more)

### Community 65 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+11 more)

### Community 66 - "vitest"
Cohesion: 0.25
Nodes (9): react-test-renderer, vitest, GlassAppearanceSettings(), Preview(), update, devices, renderBare(), renderWithAppProviders() (+1 more)

### Community 67 - "webauthn.rs"
Cohesion: 0.10
Nodes (31): AssertionAuthenticatorResponse, AssertionPublicKeyCredential, AssertionSigningContext, base64url_decode(), base64url_encode(), base64url_round_trips_without_padding(), build_assertion_authenticator_data(), build_assertion_public_key_credential() (+23 more)

### Community 68 - "deriveIdentityClusters.ts"
Cohesion: 0.36
Nodes (8): buildPasswordUseCounts(), entryHasSimplePasswordRisk(), getEntryDomains(), getEntryPasswordValues(), getEntrySignals(), getModuleValue(), IdentityClusterEntry, normalizeSignal()

### Community 69 - "reactNativePaper.tsx"
Cohesion: 0.11
Nodes (14): ActivityIndicator, baseColors, Button, Chip, Divider, Icon, IconButton, MD3DarkTheme (+6 more)

### Community 71 - "getModuleData"
Cohesion: 0.11
Nodes (25): TemplateEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+17 more)

### Community 72 - "appScheme.test.ts"
Cohesion: 0.43
Nodes (5): getAppRedirectUri(), getAppScheme(), Constants, resetExpoConfig(), setExpoConfig()

### Community 73 - "Datenschutzerklärung"
Cohesion: 0.09
Nodes (22): 10. Browser-Erweiterung, 11. Benachrichtigungen, 12. Kontaktaufnahme, 13. Webseite und Hosting, 14. Cookies, Tracking und Analytics, 15. App Stores und Download-Plattformen, 16. Rechtsgrundlagen, 17. Speicherdauer (+14 more)

### Community 74 - "autofill-preferences.ts"
Cohesion: 0.25
Nodes (13): buildPreferenceResult(), DEFAULT_POLICY, DomainPolicyStore, normalizeHost(), normalizeMode(), normalizePolicy(), readPolicyStore(), setInlineAutofillDisabledForHost() (+5 more)

### Community 75 - "ObjcId"
Cohesion: 0.19
Nodes (17): auth_reply(), authenticate_with_system_impl(), AuthReplyBlock, _Block_copy(), _Block_release(), check_system_auth_available(), cstring(), new_la_context() (+9 more)

### Community 76 - "Privacy Policy"
Cohesion: 0.09
Nodes (22): 10. Browser Extension, 11. Notifications, 12. Contact, 13. Website And Hosting, 14. Cookies, Tracking And Analytics, 15. App Stores And Download Platforms, 16. Legal Bases, 17. Retention (+14 more)

### Community 77 - "SettingsProvider.tsx"
Cohesion: 0.15
Nodes (14): DEFAULT_KEYS, SettingsContext, SettingsContextValue, SettingsState, AppearanceSettingsSection(), Props, I18nBridge(), initI18n() (+6 more)

### Community 78 - "Nutzungsbedingungen"
Cohesion: 0.10
Nodes (20): 10. Erlaubte Nutzung, 11. Open Source und Lizenzen, 12. Kosten, 13. Drittanbieter, 14. Updates, 15. Haftung, 16. Beendigung der Nutzung, 17. Änderungen (+12 more)

### Community 79 - "BrowserBridgeWriteSync.tsx"
Cohesion: 0.15
Nodes (20): applyUpdateToEntry(), BrowserWriteKind, BrowserWriteRequest, createBrowserEntry(), CreatePayload, effectiveUrl(), normalizeText(), pickFolder() (+12 more)

### Community 80 - "prepare-native-host-sidecar.js"
Cohesion: 0.15
Nodes (12): cargoArgs, { copyFileSync, existsSync, mkdirSync, writeFileSync }, detectHostTriple(), { execFileSync }, { join, resolve }, manifestPath, outputDir, outputPath (+4 more)

### Community 81 - "NoteModule.tsx"
Cohesion: 0.09
Nodes (26): JsonLine(), NoteCodePreview(), Props, styles, InlinePart, InlineText(), NoteMarkdownPreview(), parseInline() (+18 more)

### Community 82 - "LeftSideBar.tsx"
Cohesion: 0.19
Nodes (15): @expo/vector-icons, @react-navigation/bottom-tabs, CustomBottomTab(), getActiveRouteName(), getActiveRouteName(), LeftSideTabBar(), sidebarWidth, styles (+7 more)

### Community 84 - "session.rs"
Cohesion: 0.24
Nodes (8): session_store_path(), BridgeSessionSnapshot, clear_session(), load_session(), now_ms(), publish_session(), SESSION_TTL_MS, write_json_atomically()

### Community 85 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, build:chrome, build:firefox, build:firefox-local, dev, package:chrome, package:firefox (+8 more)

### Community 86 - "protocol.rs"
Cohesion: 0.20
Nodes (7): BridgeClientInfo, BridgeError, BridgePairingEnvelope, BridgeRequest, BridgeResponse, HOST_NAME, PROTOCOL_VERSION

### Community 87 - "App.tsx"
Cohesion: 0.14
Nodes (17): AppShell(), DemoBootstrap(), MainWindowReadySignal(), withAlpha(), expo-notifications, OnlineProvider(), createDemoVault(), buildPendingExpiryReminders() (+9 more)

### Community 88 - "path.rs"
Cohesion: 0.43
Nodes (7): bridge_dir(), BRIDGE_ENV_KEY, ensure_dir(), pairing_store_path(), platform_base_dir(), write_request_store_path(), write_result_store_path()

### Community 89 - "bridge_commands.rs"
Cohesion: 0.15
Nodes (8): bridge_approve_pairing(), bridge_claim_pending_writes(), bridge_complete_write_request(), bridge_list_paired_clients(), bridge_list_pending_pairings(), bridge_list_rejected_clients(), bridge_publish_session(), bridge_reject_pairing()

### Community 90 - "Terms Of Use"
Cohesion: 0.10
Nodes (20): 10. Permitted Use, 11. Open Source And Licenses, 12. Costs, 13. Third-Party Providers, 14. Updates, 15. Liability, 16. Ending Use, 17. Changes (+12 more)

### Community 91 - "UI Context"
Cohesion: 0.22
Nodes (8): i18n, Important Files, Interaction Polish, Menus And Dropdowns, Platform Model, Related UI Context, Titlebar And Chrome, UI Context

### Community 92 - "container/AnimatedOpacityContainer.tsx"
Cohesion: 0.31
Nodes (6): AnimatedOpacityContainer(), Props, AnimatedOpacityContainerWeb(), Props, Props, AnimatedOpacityContainer()

### Community 93 - "check-tauri-version-sync.js"
Cohesion: 0.24
Nodes (11): collectMismatches(), fs, getMajorMinor(), getNpmLockVersion(), mismatches, parseCargoLockVersions(), path, readJson() (+3 more)

### Community 94 - "prepare-sodium-16kb.js"
Cohesion: 0.15
Nodes (12): download(), findEndOfCentralDirectory(), fs, https, main(), os, path, readZipEntries() (+4 more)

### Community 95 - "ClavisPass Product Strategy Roadmap"
Cohesion: 0.11
Nodes (17): 1. Browser Extension Polish, 2. Passkeys, 3. Emergency Access / Trusted Contact, 4. Optional Web App, 5. Separate Secrets Sharing SaaS, Bitwarden Gaps To Treat As Strategic, ClavisPass Personal, ClavisPass Product Strategy Roadmap (+9 more)

### Community 96 - "useTheme"
Cohesion: 0.06
Nodes (45): @monaco-editor/react, useTheme(), CustomFieldInputType, EditCustomFieldModal(), Props, ACTION_ICON, Props, styles (+37 more)

### Community 97 - "bundle"
Cohesion: 0.17
Nodes (12): bundle, active, category, copyright, createUpdaterArtifacts, externalBin, fileAssociations, icon (+4 more)

### Community 98 - "MobileFastAccessOverlay.tsx"
Cohesion: 0.27
Nodes (11): FastAccessSessionBridge(), MobileFastAccessOverlay(), FastAccessPayload, cleanupFastAccessOnStartup(), dismissPresentedFastAccessNotifications(), hideFastAccess(), syncFastAccessSession(), hideMobileFastAccess() (+3 more)

### Community 99 - "Identity Management Concept"
Cohesion: 0.13
Nodes (14): Confidence And Trust, Core Idea, Data Model Direction, Design Tone, Identity Detail View, Identity Management Concept, Identity Tab, Important Principle (+6 more)

### Community 100 - "tab-context.ts"
Cohesion: 0.60
Nodes (5): getActiveDomainContext(), normalizeLookupHost(), parseActiveDomain(), sanitizeHost(), ActiveDomainContext

### Community 101 - "i18n/index.ts"
Cohesion: 0.31
Nodes (7): expo-clipboard, i18next, resources, de, en, DEFAULT_NS, TranslationSchema

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
Cohesion: 0.11
Nodes (19): ExpiryOverviewEntry, ExpiryOverviewItem(), styles, Props, ExpiryOverviewModal(), Props, styles, Props (+11 more)

### Community 106 - "plugins"
Cohesion: 0.20
Nodes (10): args, customProtocol, plugins, cli, deepLink, updater, endpoints, pubkey (+2 more)

### Community 107 - "editHistory.ts"
Cohesion: 0.26
Nodes (11): Editor(), appendLog(), areValuesEqual(), cloneValue(), createLogEntry(), EditHistoryMeta, HistoryEntry, HistoryState (+3 more)

### Community 108 - "AddValueModal.tsx"
Cohesion: 0.13
Nodes (14): Props, ValueIconsEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY (+6 more)

### Community 109 - "DeviceStorageClient.ts"
Cohesion: 0.38
Nodes (11): fetchFile(), getActiveLocalVaultIdKey(), getLocalSyncKey(), getLocalSyncMetadataKey(), getVaultLocalSyncKey(), getVaultLocalSyncMetadataKey(), LocalSyncMetadata, readLocalSyncMetadata() (+3 more)

### Community 110 - "distribution.ts"
Cohesion: 0.26
Nodes (10): TitlebarHeight(), AppDistribution, getAppDistribution(), getMobileDistribution(), isDemoDistribution(), isStoreDistribution(), MobileDistribution, readDistributionEnv() (+2 more)

### Community 111 - "fill.ts"
Cohesion: 0.30
Nodes (11): applyTargets(), buildNoFieldsResult(), collectFillTargets(), emitInputEvents(), executeFill(), FillPreviewResult, FillSnapshot, FillTarget (+3 more)

### Community 112 - "vcardExport.ts"
Cohesion: 0.35
Nodes (10): expo-sharing, buildFormattedName(), buildVCard(), canExportVCard(), clean(), escapeVCardText(), exportVCard(), firstModule() (+2 more)

### Community 113 - "ClavisPass Passkey Management Roadmap"
Cohesion: 0.18
Nodes (10): ClavisPass Passkey Management Roadmap, Core Principles, Phase 0: Architecture Decision, Phase 1: Vault Passkey Module, Phase 3: Import And Export Preparation, Phase 5: Platform Integration, Phase 6: Security, UX, And Verification, Product Scope (+2 more)

### Community 114 - "reactNativeReanimated.tsx"
Cohesion: 0.25
Nodes (4): Animated, AnimatedView, Easing, FadeInDown

### Community 116 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, @types/chrome, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react

### Community 117 - "compilerOptions"
Cohesion: 0.29
Nodes (6): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, include

### Community 119 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, moduleResolution, strict, exclude, extends

### Community 120 - "Store Release Roadmap"
Cohesion: 0.17
Nodes (11): Apple Developer Program, Arratel Setup Plan, Chrome Web Store, Goals, Google Play, Microsoft Store, Publisher Naming, References (+3 more)

### Community 121 - "native_host_registration.rs"
Cohesion: 0.19
Nodes (10): CHROME_EXTENSION_IDS, chromium_origins(), CREATE_NO_WINDOW, EDGE_EXTENSION_IDS, find_native_host_exe(), FIREFOX_EXTENSION_ID, native_host_candidates(), NATIVE_HOST_NAME (+2 more)

### Community 122 - "model/types.ts"
Cohesion: 0.10
Nodes (25): @react-navigation/native-stack, AddTriggerStackParamList, AnalysisStackParamList, AppTabsParamList, HomeStackParamList, LoginStackParamList, LogoutStackParamList, RootStackParamList (+17 more)

### Community 123 - "AmbientBackground.tsx"
Cohesion: 0.33
Nodes (8): AmbientBackground(), AmbientWash(), Props, styles, withAlpha(), DEFAULT_GLASS_APPEARANCE, glassLayerOpacity(), normalizeGlassAppearance()

### Community 124 - "domain.ts"
Cohesion: 0.24
Nodes (11): loadPasskeyCandidatesForWebAuthnRequest(), buildEntrySuggestions(), normalizeHost(), normalizeLookupHost(), normalizeRpHost(), safeUrl(), scoreUrlMatch(), searchEntries() (+3 more)

### Community 125 - "serve-webauthn-test-page.js"
Cohesion: 0.25
Nodes (4): __dirname, pagePath, port, server

### Community 126 - "SettingsScreen.tsx"
Cohesion: 0.08
Nodes (34): expo-constants, expo-linear-gradient, simple-icons, useContentProtection(), DevModeContext, DevModeContextType, Props, useDevMode() (+26 more)

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

### Community 137 - "AppWithNavigation"
Cohesion: 0.29
Nodes (9): App(), AppWithNavigation(), loadSettingWithTimeout(), SettingsProvider(), ThemeProvider(), applyStartupDocumentBackground(), STARTUP_BACKGROUND, StartupScreen() (+1 more)

### Community 138 - "errorBus.ts"
Cohesion: 0.42
Nodes (6): Listener, listeners, subscribeGlobalError(), unsubscribeGlobalError(), GlobalErrorPayload, GlobalErrorSnackbar()

### Community 141 - "IdentityDetailScreen.tsx"
Cohesion: 0.14
Nodes (22): IdentityStackParamList, IdentityStack(), Stack, IdentityEmailLogo(), IdentityEmailLogoProps, styles, deriveIdentityClusters(), getEntryModuleTypes() (+14 more)

### Community 142 - "linux"
Cohesion: 0.67
Nodes (3): linux, depends, deb

### Community 144 - "mobileUpdater.ts"
Cohesion: 0.36
Nodes (8): checkMobileBinaryUpdate(), compareVersions(), getAppVersion(), getManifestDownloadUrl(), getMobileUpdateManifestUrl(), MobileBinaryUpdate, MobileUpdateManifest, parseVersion()

### Community 171 - "withIosGoogleOAuthScheme.js"
Cohesion: 0.43
Nodes (5): ensureUrlScheme(), normalizeClientId(), {
  ensureUrlScheme,
  toReverseClientIdScheme,
}, toReverseClientIdScheme(), { withInfoPlist }

### Community 172 - "browser-extension/package.json"
Cohesion: 0.17
Nodes (11): react, react-dom, @types/react, @types/react-dom, typescript, name, private, type (+3 more)

### Community 174 - "CardDetailsScreen.tsx"
Cohesion: 0.13
Nodes (25): Applying a preset, Catalog, Verification, Website presets, expo-blur, expo-image, @kichiyaki/react-native-barcode-generator, react-qr-code (+17 more)

### Community 175 - "Firefox Store Release Notes"
Cohesion: 0.25
Nodes (7): Extension Identity, Firefox Store Release Notes, Listing, Pre-Submit Check, Privacy Policy Draft, Release Artifacts, Reviewer Notes

### Community 176 - "vaultIdentity.ts"
Cohesion: 0.43
Nodes (6): createVaultId(), ensureVaultId(), normalizeVaultId(), resolveMergedVaultId(), VaultData, VaultIdentityMismatchError

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

### Community 184 - "Vault V2 Key Envelope Roadmap"
Cohesion: 0.05
Nodes (34): Always Know, ClavisPass Agent Context, Context Routing, Fast Map, graphify, High-Risk Rules, Chrome And Drag Regions, Core Files (+26 more)

### Community 185 - "ClavisPassHubDiscoveryResult.ts"
Cohesion: 0.29
Nodes (6): ClavisPassHubDiscoveryResult, ClavisPassHubDiscoveryStatus, DiscoveryCheckingResult, DiscoveryErrorResult, DiscoveryIdleResult, DiscoverySuccessResult

### Community 189 - "isTauri.ts"
Cohesion: 0.07
Nodes (37): Props, ProtectedRoute(), styles, getFocusedRouteName(), NavigationnContainer(), titlebarContentDragRoutes, LoginStack(), TabNavigator() (+29 more)

### Community 190 - "Sync And Storage Context"
Cohesion: 0.25
Nodes (7): Core Files, Providers, Settings Schema, Storage Layers, Sync And Storage Context, Tokens, StoreSchema

### Community 191 - "EditScreen.tsx"
Cohesion: 0.08
Nodes (36): extractFastAccessObject(), openFastAccess(), prepareFastAccess(), Corner, CornerOption(), FastAccessPosition, FastAccessPositionPicker(), Props (+28 more)

### Community 192 - "Login.tsx"
Cohesion: 0.16
Nodes (14): react-native-svg, Login(), Props, isUsingAuthentication(), loadAuthentication(), consumeSystemAuthAutoUnlockSuppression(), entropyToProgress(), entropyToStrength() (+6 more)

### Community 193 - "content-messages.ts"
Cohesion: 0.29
Nodes (6): ContentMessage, ContentMessageMap, ContentMessageType, ContentRequestFor, ContentResponseFor, ContentDebugInfo

### Community 194 - "generatePassword.ts"
Cohesion: 0.29
Nodes (5): generatePassword(), LOWERCASE_CHAR_CODES, NUMBER_CHAR_CODES, SYMBOL_CHAR_CODES, UPPERCASE_CHAR_CODES

### Community 195 - "dependencies"
Cohesion: 0.50
Nodes (4): dependencies, react, react-dom, tldts

### Community 198 - "DocumentTypeEnum"
Cohesion: 0.33
Nodes (6): DocumentTypeEnum, BITWARDEN, CHROME, FIREFOX, KDBX, PCLOUD

### Community 199 - "expiry.ts"
Cohesion: 0.47
Nodes (4): ExpiryStatus, formatRelative(), getRelativeInfo(), RelativeExpiryInfo

### Community 200 - "hotkeyRecordingBus.ts"
Cohesion: 0.50
Nodes (4): beginHotkeyRecording(), emit(), Listener, listeners

## Knowledge Gaps
- **130 isolated node(s):** `react`, `react-dom`, `@types/chrome`, `@types/react`, `@types/react-dom` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1710 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **47 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `ModulesEnum.ts`, `package.json`, `decryptVaultContent.ts`, `hotkeys.ts`, `CloudStorageClient.ts`, `ClavisPassHubClient.ts`, `HomeScreen.tsx`, `mergeVaultData.ts`, `DraggableModulesList.shared.tsx`, `withIosGoogleOAuthScheme.js`, `DevicesScreen.tsx`, `bitwarden.ts`, `vite.config.ts`, `store.ts`, `reactNative.ts`, `generatePassword.ts`, `getModuleData`, `appScheme.test.ts`, `BrowserBridgeWriteSync.tsx`, `DeviceStorageClient.ts`, `AmbientBackground.tsx`, `domain.ts`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **What connects `react`, `react-dom`, `@types/chrome` to the rest of the system?**
  _130 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.01904761904761905 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `package.json`, `AnimatedPressable`, `ThemeProvider.tsx`, `AppWithNavigation`, `hotkeys.ts`, `errorBus.ts`, `IdentityDetailScreen.tsx`, `react-i18next`, `mobileUpdater.ts`, `Header`, `FastAccess.ts`, `HomeScreen.tsx`, `isTauriEnvironment`, `UpdateManager.tsx`, `LoginScreen.tsx`, `AttachmentModule.tsx`, `DraggableModulesList.shared.tsx`, `detectTauriEnvironment`, `DevicesScreen.tsx`, `AuthProvider.tsx`, `CardDetailsScreen.tsx`, `AnalysisDetailScreen.tsx`, `TotpModule.tsx`, `VaultProvider.tsx`, `BrowserExtensionsScreen.tsx`, `isTauri.ts`, `EditScreen.tsx`, `Login.tsx`, `reactNative.ts`, `AttachmentPreviewScreen.native.tsx`, `NoteModule.tsx`, `LeftSideBar.tsx`, `App.tsx`, `container/AnimatedOpacityContainer.tsx`, `useTheme`, `MobileFastAccessOverlay.tsx`, `ref_react`, `AddValueModal.tsx`, `distribution.ts`, `vcardExport.ts`, `model/types.ts`, `AmbientBackground.tsx`, `SettingsScreen.tsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `getModule.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.043025921354258506 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `ModulesEnum.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11051693404634581 - nodes in this community are weakly interconnected._
# Graph Report - ClavisPass  (2026-11-09)

## Corpus Check
- 600 files · ~368,865 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 37 file(s) not represented in the graph (top: .xml 11, (none) 8, .properties 2)

## Summary
- 4063 nodes · 11426 edges · 191 communities (142 shown, 49 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 178 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ba6203a0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- VaultV2.ts
- dependencies
- ModulesType.ts
- Login.tsx
- package.json
- ModulesEnum.ts
- EditScreen.tsx
- bitwarden.ts
- useTheme
- AnalysisDetailScreen.tsx
- store.ts
- content/index.ts
- shared/types.ts
- popup/App.tsx
- getModule.tsx
- background/index.ts
- shared/bridge.ts
- mapKdbxToClavisPass.ts
- vitest
- detectTauriEnvironment
- ModulesEnum
- expo
- ClavisPassHubClient.ts
- SettingsScreen.tsx
- write.rs
- scripts
- DigitalCardModule.tsx
- manifest.json
- TemplateEnum
- forms.ts
- lib.rs
- ClavisPass Native Messaging Bridge
- UpdateManager.tsx
- vcardExport.ts
- commands.rs
- LoginScreen.tsx
- DeviceStorageClient.ts
- VaultDataType.ts
- state.ts
- DraggableModulesList.shared.tsx
- AttachmentModule.tsx
- ClavisPass Passkey Management Roadmap
- host.rs
- vault.rs
- isTauri.ts
- release.js
- SettingInfoButton.tsx
- GlobalClipboardSnackbar.tsx
- model/types.ts
- ClavisPass Website Marketing Brief
- BrowserExtensionsScreen.tsx
- pairing.rs
- appScheme.test.ts
- Idee: Identity als persönlicher Hauptscreen
- Sync.tsx
- vaultDevices.ts
- vite.config.ts
- devDependencies
- prepare-msix.js
- TotpModule.tsx
- screen_lock.rs
- Crypto Context
- ClavisPass
- AuthProvider.tsx
- reactNative.ts
- compilerOptions
- vaultIdentity.ts
- webauthn.rs
- LeftSideBar.tsx
- reactNativePaper.tsx
- MainApplication.kt
- modulePolicy.ts
- AddTriggerStack.tsx
- Datenschutzerklärung
- autofill-preferences.ts
- CloudStorageClient.test.ts
- Privacy Policy
- vaultRecovery.ts
- Nutzungsbedingungen
- BrowserBridgeWriteSync.tsx
- prepare-native-host-sidecar.js
- rnSodiumProvider.ts
- MainActivity.kt
- session.rs
- scripts
- protocol.rs
- App.tsx
- path.rs
- bridge_commands.rs
- Terms Of Use
- UI Context
- check-tauri-version-sync.js
- prepare-sodium-16kb.js
- ClavisPass Product Strategy Roadmap
- Modal
- bundle
- getModuleData
- deriveIdentityClusters.ts
- i18n/index.ts
- tauri.conf.json
- withAndroidApplicationId.js
- build-web-demo.js
- ref_react
- plugins
- editHistory.ts
- AddValueModal.tsx
- CloudStorageClient.ts
- CloudProvider.tsx
- reactNativeReanimated.tsx
- reactNavigationNative.ts
- devDependencies
- compilerOptions
- GoogleDriveLoginButton.tsx
- tsconfig.json
- Store Release Roadmap
- native_host_registration.rs
- AppHeaderBrand.tsx
- domain.ts
- serve-webauthn-test-page.js
- useSetting
- macOS
- windows
- gorhomBottomSheet.tsx
- WifiTypeEnum
- build
- vite-env.d.ts
- NoteModule.tsx
- container/AnimatedOpacityContainer.tsx
- BridgeStatusBadge.tsx
- AnalysisScreen.tsx
- linux
- asyncStorage.ts
- BrandHeader.tsx
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
- totp.ts
- Firefox Store Release Notes
- v1/aad.ts
- generate-webauthn-test-passkey.js
- ClavisPass Firefox Add-on Reviewer Build
- AmbientBackground.tsx
- Bitwarden Import Roadmap
- Agent Workflow Context
- Build, Release, And Update Context
- Identity Context
- InlineNotice.tsx
- Desktop And Tauri Context
- CLAUDE.md
- .claude/CLAUDE.md
- DropdownLayer.web.tsx
- errorBus.ts
- dependencies
- LogoutStack.tsx
- DocumentTypeEnum
- ExpiryModule.tsx
- expoVectorIcons.tsx
- RemoteFileContent.ts
- Website presets

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 281 edges
2. `react-native` - 189 edges
3. `react-native-paper` - 134 edges
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
- `Applying a preset` --references--> `buildFaviconUrl()`  [INFERRED]
  docs/website-presets.md → src/features/vault/utils/digitalCardTheme.ts

## Import Cycles
- None detected.

## Communities (191 total, 49 thin omitted)

### Community 0 - "VaultV2.ts"
Cohesion: 0.14
Nodes (26): CryptoProvider, decodeRecoveryKey(), generateRecoveryKey(), makeV3PayloadAad(), recoveryAad(), unwrapRecoveryKey(), wrapRecoveryKey(), makeV1AadBytes() (+18 more)

### Community 1 - "dependencies"
Cohesion: 0.02
Nodes (105): dependencies, argon2-browser, @babel/plugin-proposal-export-namespace-from, base64-js, crypto-js, expo, expo-auth-session, expo-blur (+97 more)

### Community 2 - "ModulesType.ts"
Cohesion: 0.04
Nodes (68): zod, AddressModuleType, AddressModuleTypeSchema, regex, CompanyModuleType, CompanyModuleTypeSchema, regex, CreditCardModuleType (+60 more)

### Community 3 - "Login.tsx"
Cohesion: 0.14
Nodes (27): react-native-progress, PasswordStrengthLevel, MEDIUM, STRONG, WEAK, Login(), Props, Props (+19 more)

### Community 4 - "package.json"
Cohesion: 0.03
Nodes (75): react, react-dom, @types/react, @types/react-dom, typescript, main, name, private (+67 more)

### Community 5 - "ModulesEnum.ts"
Cohesion: 0.10
Nodes (20): expo-document-picker, papaparse, VaultContextType, normalizeCredentialId(), normalizeRpId(), reservePasskeyAssertion(), payload, validCounter() (+12 more)

### Community 6 - "EditScreen.tsx"
Cohesion: 0.06
Nodes (74): Interaction Polish, react-i18next, VaultContext, VaultData, extractFastAccessObject(), EditRowControlsContainer(), EditRowControlsContainerProps, NativeDragHandleScrollLockContext (+66 more)

### Community 7 - "bitwarden.ts"
Cohesion: 0.20
Nodes (24): addCardModule(), addCustomField(), addExpiryModule(), addIdentityModules(), addLoginModules(), addNote(), addPasskeyModules(), addSshKeyModule() (+16 more)

### Community 8 - "useTheme"
Cohesion: 0.04
Nodes (65): @gorhom/bottom-sheet, @monaco-editor/react, react-native-circular-progress, react-native-gesture-handler, react-native-paper, Props, ThemeContext, ThemeContextType (+57 more)

### Community 9 - "AnalysisDetailScreen.tsx"
Cohesion: 0.05
Nodes (61): expo-crypto, AnalysisStackParamList, Stack, useAuthMaster(), AnalysisFlags, AnalysisRef, CachedAnalysisItem, CacheResult (+53 more)

### Community 10 - "store.ts"
Cohesion: 0.05
Nodes (54): Core Files, Providers, Settings Schema, Storage Layers, Sync And Storage Context, Tokens, HotkeyRecorderItem(), Props (+46 more)

### Community 11 - "content/index.ts"
Cohesion: 0.08
Nodes (53): applyTargets(), buildNoFieldsResult(), collectFillTargets(), emitInputEvents(), executeFill(), FillPreviewResult, FillSnapshot, FillTarget (+45 more)

### Community 12 - "shared/types.ts"
Cohesion: 0.05
Nodes (51): BackgroundHandler, BackgroundHandlerMap, BackgroundMessageContext, BackgroundMessageRouter, getActiveDomainContext(), normalizeLookupHost(), parseActiveDomain(), sanitizeHost() (+43 more)

### Community 13 - "popup/App.tsx"
Cohesion: 0.07
Nodes (40): registerContentFrame(), setupWebAuthnProbe(), App(), handleFill(), handleOpenDesktopApp(), handlePasskeyAssertion(), handlePromptResolution(), handleToggleSavePrompts() (+32 more)

### Community 14 - "getModule.tsx"
Cohesion: 0.08
Nodes (56): expo-linking, FastAccessType, FastAccessTypeSchema, ModuleContainer(), ModuleContainerProps, moduleStyles, AddressModule(), AddressState (+48 more)

### Community 15 - "background/index.ts"
Cohesion: 0.09
Nodes (53): clearAutofillDomainCache(), countPasswordSuggestions(), countVisibleSuggestions(), DomainAutofillCache, DomainAutofillCacheEntry, getAutofillEligibilityForUrl(), getCachedAutofillMatchCountForUrl(), getCachedMatchCount() (+45 more)

### Community 16 - "shared/bridge.ts"
Cohesion: 0.07
Nodes (50): Desktop bridge, deriveAppState(), DesktopBridgeService, getStoredPairingStatus(), normalizeAssertionCredential(), normalizeDesktopStatus(), normalizePasskeyMetadata(), normalizePasskeyRequestCandidates() (+42 more)

### Community 17 - "mapKdbxToClavisPass.ts"
Cohesion: 0.12
Nodes (26): base64-js, kdbxweb, configureKdbxArgon2(), importKdbx(), addCustomField(), addTotpModule(), addValueModule(), binaryToBytes() (+18 more)

### Community 18 - "vitest"
Cohesion: 0.27
Nodes (8): react-test-renderer, vitest, verifyKey, update, devices, setPlatform(), renderWithAppProviders(), textContent()

### Community 19 - "detectTauriEnvironment"
Cohesion: 0.11
Nodes (41): getCurrentWindowSafe(), Fast Access, @tauri-apps/api, DevModeProvider(), FastAccessSessionBridge(), MobileFastAccessOverlay(), FAST_ACCESS_NOTIFICATION_CATEGORY, FAST_ACCESS_POPUP_LABEL (+33 more)

### Community 20 - "ModulesEnum"
Cohesion: 0.07
Nodes (30): FILTERABLE_MODULES, ModuleFilterModal(), Props, ModulesEnum, ADDRESS, ATTACHMENT, COMPANY, CREDIT_CARD (+22 more)

### Community 21 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, adaptiveIcon, blockedPermissions, package, permissions, versionCode, projectId (+31 more)

### Community 22 - "ClavisPassHubClient.ts"
Cohesion: 0.09
Nodes (41): calculateExpiresIn(), checkDiscovery(), createHubError(), createHubErrorFromPayload(), DiscoveryResponse, fetchFile(), fetchUserInfo(), getConfiguredHostUrl() (+33 more)

### Community 23 - "SettingsScreen.tsx"
Cohesion: 0.05
Nodes (59): Common Refactor Targets, Files To Check First, Known Custom Screens, Screen Standardization Context, Standard Checklist, expo-constants, expo-linear-gradient, @react-native-masked-view/masked-view (+51 more)

### Community 24 - "write.rs"
Cohesion: 0.10
Nodes (35): as_io_error(), BrowserWriteKind, CreateEntryFromBrowser, ReservePasskeyAssertion, UpdateEntryFromBrowser, BrowserWriteRequest, BrowserWriteRequestStore, BrowserWriteResult (+27 more)

### Community 25 - "scripts"
Cohesion: 0.05
Nodes (39): scripts, android, android:build:apk, android:build:store, android:build:store-submit, android:submit:store, extension:build, extension:build:chrome (+31 more)

### Community 26 - "DigitalCardModule.tsx"
Cohesion: 0.12
Nodes (22): @kichiyaki/react-native-barcode-generator, react-qr-code, CardItem(), Props, styles, Props, DigitalCardModule(), DigitalCardModuleProps (+14 more)

### Community 27 - "manifest.json"
Cohesion: 0.06
Nodes (35): action, default_icon, default_popup, default_title, background, service_worker, type, browser_specific_settings (+27 more)

### Community 28 - "TemplateEnum"
Cohesion: 0.15
Nodes (13): TemplateEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+5 more)

### Community 29 - "forms.ts"
Cohesion: 0.11
Nodes (34): setupSavePromptListener(), AutofillPlan, buildAutofillPlan(), buildDetachedContainer(), buildFieldKey(), buildFieldText(), buildFormId(), chooseBestField() (+26 more)

### Community 30 - "lib.rs"
Cohesion: 0.11
Nodes (19): clamp_window_size(), clamp_window_size_to_monitor(), DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIDTH, emit_lock_vault(), emit_vault_file_open_request(), get_requested_vault_file_path(), get_window_size_file_path() (+11 more)

### Community 31 - "ClavisPass Native Messaging Bridge"
Cohesion: 0.06
Nodes (29): Architecture, Browser loading notes, ClavisPass Browser Extension, Current feature set, Development, Important note, Working from the repo root, Chosen architecture (+21 more)

### Community 32 - "UpdateManager.tsx"
Cohesion: 0.14
Nodes (22): expo-updates, react-native-safe-area-context, @tauri-apps/plugin-process, @tauri-apps/plugin-updater, Listener, listeners, publishUpdateCheck(), subscribeUpdateCheck() (+14 more)

### Community 33 - "vcardExport.ts"
Cohesion: 0.30
Nodes (11): expo-file-system, expo-sharing, buildFormattedName(), buildVCard(), canExportVCard(), clean(), escapeVCardText(), exportVCard() (+3 more)

### Community 34 - "commands.rs"
Cohesion: 0.05
Nodes (40): auth_reply(), AUTH_REPLY_DESCRIPTOR, AUTH_REPLY_SIGNATURE, authenticate_with_system(), authenticate_with_system_impl(), AuthReplyBlock, AuthState, _Block_copy() (+32 more)

### Community 35 - "LoginScreen.tsx"
Cohesion: 0.17
Nodes (29): LoginStackParamList, useToken(), useOnline(), Auth(), Props, FirstOpened(), Props, Step (+21 more)

### Community 36 - "DeviceStorageClient.ts"
Cohesion: 0.26
Nodes (16): @react-native-async-storage/async-storage, cacheSyncedVault(), fetchFile(), getActiveLocalVaultIdKey(), getLocalSyncKey(), getLocalSyncMetadataKey(), getVaultLocalSyncKey(), getVaultLocalSyncMetadataKey() (+8 more)

### Community 37 - "VaultDataType.ts"
Cohesion: 0.13
Nodes (15): DEMO_MASTER_PASSWORD, demoVault, folders, FolderSchema, ValuesListTypeSchema, VaultDataType, VaultEntryTombstone, VaultEntryTombstoneSchema (+7 more)

### Community 38 - "state.ts"
Cohesion: 0.10
Nodes (18): buildCreatePayload(), buildUpdatePayload(), resolvePromptWithDesktopWrite(), toAppliedResult(), buildPromptTitle(), ExtensionState, normalizeIdentity(), PreparedFillRecord (+10 more)

### Community 39 - "DraggableModulesList.shared.tsx"
Cohesion: 0.11
Nodes (26): Important Boundaries, Reorder Flows, Shared Module UI, Vault Modules Context, Verification, @hello-pangea/dnd, NativeDragHandleScrollLockProvider(), WebDragHandlePropsProvider() (+18 more)

### Community 40 - "AttachmentModule.tsx"
Cohesion: 0.16
Nodes (19): AttachmentModule(), canPreviewAttachment(), downloadBrowserAttachment(), formatBytes(), getAttachmentIcon(), getFileExtension(), getFileNameFromPath(), getSafeFileName() (+11 more)

### Community 41 - "ClavisPass Passkey Management Roadmap"
Cohesion: 0.18
Nodes (10): ClavisPass Passkey Management Roadmap, Core Principles, Phase 0: Architecture Decision, Phase 1: Vault Passkey Module, Phase 3: Import And Export Preparation, Phase 5: Platform Integration, Phase 6: Security, UX, And Verification, Product Scope (+2 more)

### Community 42 - "host.rs"
Cohesion: 0.13
Nodes (23): app_scheme(), AssertPasskeyPayload, bridge_result_to_response(), ensure_ready(), FillPayload, handle_request(), is_es256_algorithm(), MatchPasskeysPayload (+15 more)

### Community 43 - "vault.rs"
Cohesion: 0.11
Nodes (39): domain_contains(), entry_match_hosts(), fill_data_for_entry(), FillDataResult, first_string(), FolderRef, has_passkey(), login_entry() (+31 more)

### Community 44 - "isTauri.ts"
Cohesion: 0.08
Nodes (33): detectBrowserWebEnvironment(), isBrowserWebEnvironment(), isMacWebRuntime(), isTauriEnvironment(), isWebPlatform(), Window, StartBehavior, resolveWindowControlsSide() (+25 more)

### Community 45 - "release.js"
Cohesion: 0.12
Nodes (19): androidGradleHasVersionCode(), androidGradleHasVersionName(), androidStringsHasRuntimeVersion(), cargoLockHasVersion(), cargoTomlHasVersion(), { execSync }, existingTags, filesToUpdate (+11 more)

### Community 46 - "SettingInfoButton.tsx"
Cohesion: 0.16
Nodes (15): useContentProtection(), FilterAnalysisModal(), Props, getPasswordStrengthIcon(), ContentProtectionSettingsToggle(), Props, Props, SettingInfo (+7 more)

### Community 47 - "GlobalClipboardSnackbar.tsx"
Cohesion: 0.09
Nodes (24): Props, QuickSelect(), styles, getClipboardText(), setClipboardText(), tryNavigatorReadText(), tryNavigatorWriteText(), clipboardClearScheduler (+16 more)

### Community 48 - "model/types.ts"
Cohesion: 0.05
Nodes (84): Standard Screen Structure, expo-camera, expo-image, react-native-draggable-flatlist, @react-navigation/native, @react-navigation/native-stack, HomeStackParamList, IdentityStackParamList (+76 more)

### Community 49 - "ClavisPass Website Marketing Brief"
Cohesion: 0.05
Nodes (43): Attachments And Previews, Brand Details, Bring Your Own Sync, Browser Extension, Can I import my existing passwords?, Can my cloud provider read my passwords?, ClavisPass Website Marketing Brief, Conversion Priorities (+35 more)

### Community 50 - "BrowserExtensionsScreen.tsx"
Cohesion: 0.12
Nodes (30): BrowserBridgePairingPrompt(), PairingAction, PromptButton(), styles, actOnBrowserExtensionPairing(), BrowserExtensionPairingChangeListener, buildBrowserClientKey(), listBrowserExtensionPairings() (+22 more)

### Community 51 - "pairing.rs"
Cohesion: 0.21
Nodes (21): approve_pairing(), evaluate_pairing(), list_paired_clients(), list_pending_pairings(), list_rejected_clients(), load_pairing_store(), now_ms(), optional_identity_matches() (+13 more)

### Community 52 - "appScheme.test.ts"
Cohesion: 0.43
Nodes (5): getAppRedirectUri(), getAppScheme(), Constants, resetExpoConfig(), setExpoConfig()

### Community 53 - "Idee: Identity als persönlicher Hauptscreen"
Cohesion: 0.22
Nodes (8): Datenschutz, Einschätzung, Gestaltungsprinzipien und offene Fragen, Idee: Identity als persönlicher Hauptscreen, Mögliche Ausbaustufen, Mögliche Funktionen, Technischer Ansatz, Ziel

### Community 54 - "Sync.tsx"
Cohesion: 0.11
Nodes (46): Current Vault Format, Implementation Phases, ChangeMasterPasswordModal(), Props, styles, Props, Sync(), createVaultDeviceId() (+38 more)

### Community 55 - "vaultDevices.ts"
Cohesion: 0.24
Nodes (9): daysBetween(), DEFAULT_DEVICE_UI_POLICY, DeviceUiPolicy, DeviceUiStatus, earliestIso(), hasSameDeviceIdentity(), normalizeDeviceIdentityPart(), parseIso() (+1 more)

### Community 57 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, @babel/core, eslint, eslint-config-universe, patch-package, prettier, react-test-renderer, @tauri-apps/cli (+14 more)

### Community 58 - "prepare-msix.js"
Cohesion: 0.10
Nodes (16): appExe, appVersion, assetsOutputDir, createUnplatedTargetSizeIcons(), escapePowerShellSingleQuoted(), fs, manifest, manifestSource (+8 more)

### Community 59 - "TotpModule.tsx"
Cohesion: 0.13
Nodes (17): Chips, Compact Search Behavior, Content Panels, Current Visual Direction, Headers, Item Surfaces, UI Patterns Context, Verification (+9 more)

### Community 60 - "screen_lock.rs"
Cohesion: 0.11
Nodes (8): DeviceIdentity, get_device_identity(), CGSessionCopyCurrentDictionary(), emit(), ScreenLockPayload, Session, start(), wndproc()

### Community 61 - "Crypto Context"
Cohesion: 0.40
Nodes (4): Core Files, Critical Rules, Crypto Context, Verification

### Community 62 - "ClavisPass"
Cohesion: 0.07
Nodes (28): 1. VaultSession (Authoritative & Secret-Capable), 2. VaultProvider (UI-Safe Projection), Authentication & Master Secret Handling, Backend / Plattform, CI / CD & Deployment, ClavisPass, Cryptography & Encryption Model, Defensive Defaults (+20 more)

### Community 63 - "AuthProvider.tsx"
Cohesion: 0.21
Nodes (9): AuthContext, AuthContextType, AuthMasterContext, AuthMasterContextType, Props, ScreenLockLogoutController, initScreenLockLogout(), ListenFn (+1 more)

### Community 64 - "reactNative.ts"
Cohesion: 0.12
Nodes (12): Animated, AnimatedValue, Dimensions, InteractionManager, Platform, Pressable, ScrollView, StyleSheet (+4 more)

### Community 65 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+11 more)

### Community 66 - "vaultIdentity.ts"
Cohesion: 0.43
Nodes (6): createVaultId(), ensureVaultId(), normalizeVaultId(), resolveMergedVaultId(), VaultData, VaultIdentityMismatchError

### Community 67 - "webauthn.rs"
Cohesion: 0.10
Nodes (31): AssertionAuthenticatorResponse, AssertionPublicKeyCredential, AssertionSigningContext, base64url_decode(), base64url_encode(), base64url_round_trips_without_padding(), build_assertion_authenticator_data(), build_assertion_public_key_credential() (+23 more)

### Community 68 - "LeftSideBar.tsx"
Cohesion: 0.08
Nodes (38): @expo/vector-icons, @react-navigation/bottom-tabs, Props, ProtectedRoute(), styles, CustomBottomTab(), getActiveRouteName(), getActiveRouteName() (+30 more)

### Community 69 - "reactNativePaper.tsx"
Cohesion: 0.11
Nodes (14): ActivityIndicator, baseColors, Button, Chip, Divider, Icon, IconButton, MD3DarkTheme (+6 more)

### Community 71 - "modulePolicy.ts"
Cohesion: 0.05
Nodes (41): Always Know, ClavisPass Agent Context, Context Routing, Fast Map, graphify, High-Risk Rules, Core Files, Master Password Lifetime (+33 more)

### Community 72 - "AddTriggerStack.tsx"
Cohesion: 0.38
Nodes (5): AddTriggerStackParamList, AddTriggerStack(), Stack, AddTriggerScreen(), AddTriggerScreenProps

### Community 73 - "Datenschutzerklärung"
Cohesion: 0.09
Nodes (22): 10. Browser-Erweiterung, 11. Benachrichtigungen, 12. Kontaktaufnahme, 13. Webseite und Hosting, 14. Cookies, Tracking und Analytics, 15. App Stores und Download-Plattformen, 16. Rechtsgrundlagen, 17. Speicherdauer (+14 more)

### Community 74 - "autofill-preferences.ts"
Cohesion: 0.27
Nodes (12): buildPreferenceResult(), DEFAULT_POLICY, DomainPolicyStore, normalizeHost(), normalizeMode(), normalizePolicy(), readPolicyStore(), updateAutofillPolicyForHost() (+4 more)

### Community 75 - "CloudStorageClient.test.ts"
Cohesion: 0.50
Nodes (3): target, v2, v3

### Community 76 - "Privacy Policy"
Cohesion: 0.09
Nodes (22): 10. Browser Extension, 11. Notifications, 12. Contact, 13. Website And Hosting, 14. Cookies, Tracking And Analytics, 15. App Stores And Download Platforms, 16. Legal Bases, 17. Retention (+14 more)

### Community 77 - "vaultRecovery.ts"
Cohesion: 0.16
Nodes (22): VaultDataTypeSchema, getEmptyData(), DecryptVaultContentResult, getCryptoProvider(), webSodiumProvider, VaultV1, VaultV1Schema, TEST_PAYLOAD (+14 more)

### Community 78 - "Nutzungsbedingungen"
Cohesion: 0.10
Nodes (20): 10. Erlaubte Nutzung, 11. Open Source und Lizenzen, 12. Kosten, 13. Drittanbieter, 14. Updates, 15. Haftung, 16. Beendigung der Nutzung, 17. Änderungen (+12 more)

### Community 79 - "BrowserBridgeWriteSync.tsx"
Cohesion: 0.16
Nodes (16): applyNativeContentProtection(), applyTauriContentProtection(), ContentProtectionContext, ContentProtectionContextValue, ContentProtectionProvider(), applyUpdateToEntry(), BrowserWriteKind, BrowserWriteRequest (+8 more)

### Community 80 - "prepare-native-host-sidecar.js"
Cohesion: 0.15
Nodes (12): cargoArgs, { copyFileSync, existsSync, mkdirSync, writeFileSync }, detectHostTriple(), { execFileSync }, { join, resolve }, manifestPath, outputDir, outputPath (+4 more)

### Community 82 - "rnSodiumProvider.ts"
Cohesion: 0.15
Nodes (9): libsodium-wrappers-sumo, react-native-sodium-jsi, getCryptoProvider(), rnSodiumProvider, td, te, verifyProviderInDev(), td (+1 more)

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
Cohesion: 0.08
Nodes (38): App(), AppShell(), AppWithNavigation(), DemoBootstrap(), MainWindowReadySignal(), withAlpha(), expo-network, expo-notifications (+30 more)

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
Cohesion: 0.25
Nodes (7): i18n, Important Files, Menus And Dropdowns, Platform Model, Related UI Context, Titlebar And Chrome, UI Context

### Community 93 - "check-tauri-version-sync.js"
Cohesion: 0.24
Nodes (11): collectMismatches(), fs, getMajorMinor(), getNpmLockVersion(), mismatches, parseCargoLockVersions(), path, readJson() (+3 more)

### Community 94 - "prepare-sodium-16kb.js"
Cohesion: 0.15
Nodes (12): download(), findEndOfCentralDirectory(), fs, https, main(), os, path, readZipEntries() (+4 more)

### Community 95 - "ClavisPass Product Strategy Roadmap"
Cohesion: 0.11
Nodes (17): 1. Browser Extension Polish, 2. Passkeys, 3. Emergency Access / Trusted Contact, 4. Optional Web App, 5. Separate Secrets Sharing SaaS, Bitwarden Gaps To Treat As Strategic, ClavisPass Personal, ClavisPass Product Strategy Roadmap (+9 more)

### Community 96 - "Modal"
Cohesion: 0.07
Nodes (32): Props, styles, VaultRecoverySetupDialog(), Props, RecoveryKeySettingsItem(), ACTION_ICON, EditHistoryModal(), Props (+24 more)

### Community 97 - "bundle"
Cohesion: 0.17
Nodes (12): bundle, active, category, copyright, createUpdaterArtifacts, externalBin, fileAssociations, icon (+4 more)

### Community 98 - "getModuleData"
Cohesion: 0.20
Nodes (15): Editor(), native, ValuesTypeSchema, getModuleData(), getCustomField(), getModules(), getTemplate(), modules() (+7 more)

### Community 99 - "deriveIdentityClusters.ts"
Cohesion: 0.11
Nodes (25): Confidence And Trust, Core Idea, Data Model Direction, Design Tone, Identity Detail View, Identity Management Concept, Identity Tab, Important Principle (+17 more)

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
Cohesion: 0.06
Nodes (38): react-native, react-native-reanimated, IdentityEmailLogoProps, styles, ExpiryOverviewEntry, ExpiryOverviewItem(), styles, Props (+30 more)

### Community 106 - "plugins"
Cohesion: 0.20
Nodes (10): args, customProtocol, plugins, cli, deepLink, updater, endpoints, pubkey (+2 more)

### Community 107 - "editHistory.ts"
Cohesion: 0.21
Nodes (13): Editor(), appendLog(), areValuesEqual(), cloneValue(), createLogEntry(), EditHistoryActionType, EditHistoryMeta, EditSessionLogEntry (+5 more)

### Community 108 - "AddValueModal.tsx"
Cohesion: 0.12
Nodes (15): AddValueModal(), Props, ValueIconsEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT (+7 more)

### Community 109 - "CloudStorageClient.ts"
Cohesion: 0.07
Nodes (46): @tauri-apps/plugin-dialog, @tauri-apps/plugin-fs, TokenContextValue, Import(), Props, UserInfoProps, saveDesktopAttachment(), pendingVaultOperation (+38 more)

### Community 112 - "CloudProvider.tsx"
Cohesion: 0.28
Nodes (14): CloudProvider(), isInvalidGrant(), OAuthRefreshError, Props, StoredAuth, TokenContext, logout(), clearClavisPassHubVaultEtag() (+6 more)

### Community 114 - "reactNativeReanimated.tsx"
Cohesion: 0.25
Nodes (4): Animated, AnimatedView, Easing, FadeInDown

### Community 116 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, @types/chrome, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react

### Community 117 - "compilerOptions"
Cohesion: 0.29
Nodes (6): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, include

### Community 118 - "GoogleDriveLoginButton.tsx"
Cohesion: 0.12
Nodes (29): expo-auth-session, expo-random, expo-web-browser, @fabianlars/tauri-plugin-oauth, ANDROID_AUTH_PROMPT_OPTIONS, getMobileRedirectUri(), randState(), SCOPES (+21 more)

### Community 119 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, moduleResolution, strict, exclude, extends

### Community 120 - "Store Release Roadmap"
Cohesion: 0.17
Nodes (11): Apple Developer Program, Arratel Setup Plan, Chrome Web Store, Goals, Google Play, Microsoft Store, Publisher Naming, References (+3 more)

### Community 121 - "native_host_registration.rs"
Cohesion: 0.19
Nodes (10): CHROME_EXTENSION_IDS, chromium_origins(), CREATE_NO_WINDOW, EDGE_EXTENSION_IDS, find_native_host_exe(), FIREFOX_EXTENSION_ID, native_host_candidates(), NATIVE_HOST_NAME (+2 more)

### Community 123 - "AppHeaderBrand.tsx"
Cohesion: 0.23
Nodes (6): react-native-svg, AppHeaderBrand(), AnimatedLogo(), AnimatedRect, styles, Logo()

### Community 124 - "domain.ts"
Cohesion: 0.27
Nodes (10): buildEntrySuggestions(), normalizeHost(), normalizeLookupHost(), normalizeRpHost(), safeUrl(), scoreUrlMatch(), searchEntries(), validateWebAuthnRpId() (+2 more)

### Community 125 - "serve-webauthn-test-page.js"
Cohesion: 0.25
Nodes (4): __dirname, pagePath, port, server

### Community 126 - "useSetting"
Cohesion: 0.13
Nodes (20): DEFAULT_KEYS, loadSettingWithTimeout(), SettingsContext, SettingsContextValue, SettingsProvider(), SettingsState, useSetting(), AppearanceSettingsSection() (+12 more)

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
Cohesion: 0.10
Nodes (23): JsonLine(), NoteCodePreview(), Props, styles, InlinePart, InlineText(), NoteMarkdownPreview(), parseInline() (+15 more)

### Community 138 - "container/AnimatedOpacityContainer.tsx"
Cohesion: 0.31
Nodes (6): AnimatedOpacityContainer(), Props, AnimatedOpacityContainerWeb(), Props, Props, AnimatedOpacityContainer()

### Community 141 - "AnalysisScreen.tsx"
Cohesion: 0.07
Nodes (37): FilterItem, FiltersNarrow, FiltersNarrowProps, FiltersWide, FiltersWideProps, styles, CategoryItem(), Props (+29 more)

### Community 142 - "linux"
Cohesion: 0.67
Nodes (3): linux, depends, deb

### Community 171 - "withIosGoogleOAuthScheme.js"
Cohesion: 0.43
Nodes (5): ensureUrlScheme(), normalizeClientId(), {
  ensureUrlScheme,
  toReverseClientIdScheme,
}, toReverseClientIdScheme(), { withInfoPlist }

### Community 172 - "browser-extension/package.json"
Cohesion: 0.17
Nodes (11): react, react-dom, @types/react, @types/react-dom, typescript, name, private, type (+3 more)

### Community 175 - "Firefox Store Release Notes"
Cohesion: 0.25
Nodes (7): Extension Identity, Firefox Store Release Notes, Listing, Pre-Submit Check, Privacy Policy Draft, Release Artifacts, Reviewer Notes

### Community 178 - "ClavisPass Firefox Add-on Reviewer Build"
Cohesion: 0.33
Nodes (5): Build Steps, ClavisPass Firefox Add-on Reviewer Build, Environment, Firefox Add-on ID, Native Messaging Notes

### Community 179 - "AmbientBackground.tsx"
Cohesion: 0.33
Nodes (8): AmbientBackground(), AmbientWash(), Props, styles, withAlpha(), DEFAULT_GLASS_APPEARANCE, glassLayerOpacity(), normalizeGlassAppearance()

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

### Community 185 - "Desktop And Tauri Context"
Cohesion: 0.33
Nodes (5): Chrome And Drag Regions, Core Files, Desktop And Tauri Context, Runtime Model, Tauri Responsibilities

### Community 192 - "errorBus.ts"
Cohesion: 0.42
Nodes (6): Listener, listeners, subscribeGlobalError(), unsubscribeGlobalError(), GlobalErrorPayload, GlobalErrorSnackbar()

### Community 195 - "dependencies"
Cohesion: 0.50
Nodes (4): dependencies, react, react-dom, tldts

### Community 196 - "LogoutStack.tsx"
Cohesion: 0.36
Nodes (5): LogoutStackParamList, LogoutStack(), Stack, LogoutScreen(), LogoutScreenProps

### Community 197 - "DocumentTypeEnum"
Cohesion: 0.33
Nodes (6): DocumentTypeEnum, BITWARDEN, CHROME, FIREFOX, KDBX, PCLOUD

### Community 198 - "ExpiryModule.tsx"
Cohesion: 0.17
Nodes (10): ExpiryPickerModal(), ExpiryModule(), styles, ExpiryStatus, ExpiryModuleType, ExpiryModuleTypeSchema, regex, formatRelative() (+2 more)

### Community 201 - "Website presets"
Cohesion: 0.40
Nodes (4): Applying a preset, Catalog, Verification, Website presets

## Knowledge Gaps
- **130 isolated node(s):** `react`, `react-dom`, `@types/chrome`, `@types/react`, `@types/react-dom` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1721 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `package.json`, `ModulesEnum.ts`, `bitwarden.ts`, `useTheme`, `store.ts`, `ClavisPassHubClient.ts`, `SettingsScreen.tsx`, `DeviceStorageClient.ts`, `VaultDataType.ts`, `DraggableModulesList.shared.tsx`, `withIosGoogleOAuthScheme.js`, `AmbientBackground.tsx`, `appScheme.test.ts`, `vaultDevices.ts`, `vite.config.ts`, `LogoutStack.tsx`, `CloudStorageClient.test.ts`, `vaultRecovery.ts`, `Modal`, `getModuleData`, `CloudStorageClient.ts`, `GoogleDriveLoginButton.tsx`, `domain.ts`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **What connects `react`, `react-dom`, `@types/chrome` to the rest of the system?**
  _130 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `VaultV2.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14390243902439023 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `ref_react` to `Login.tsx`, `package.json`, `ModulesEnum.ts`, `EditScreen.tsx`, `useTheme`, `NoteModule.tsx`, `store.ts`, `AnalysisDetailScreen.tsx`, `container/AnimatedOpacityContainer.tsx`, `AnalysisScreen.tsx`, `getModule.tsx`, `detectTauriEnvironment`, `ModulesEnum`, `ClavisPassHubClient.ts`, `SettingsScreen.tsx`, `DigitalCardModule.tsx`, `UpdateManager.tsx`, `vcardExport.ts`, `LoginScreen.tsx`, `DeviceStorageClient.ts`, `DraggableModulesList.shared.tsx`, `AttachmentModule.tsx`, `isTauri.ts`, `SettingInfoButton.tsx`, `GlobalClipboardSnackbar.tsx`, `model/types.ts`, `BrowserExtensionsScreen.tsx`, `AmbientBackground.tsx`, `Sync.tsx`, `TotpModule.tsx`, `AuthProvider.tsx`, `errorBus.ts`, `LeftSideBar.tsx`, `ExpiryModule.tsx`, `BrowserBridgeWriteSync.tsx`, `App.tsx`, `Modal`, `AddValueModal.tsx`, `CloudProvider.tsx`, `GoogleDriveLoginButton.tsx`, `AppHeaderBrand.tsx`, `useSetting`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.01904761904761905 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `ModulesType.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04322344322344322 - nodes in this community are weakly interconnected._
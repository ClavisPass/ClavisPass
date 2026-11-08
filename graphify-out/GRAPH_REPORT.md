# Graph Report - ClavisPass  (2026-11-08)

## Corpus Check
- 581 files · ~360,309 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 37 file(s) not represented in the graph (top: .xml 11, (none) 8, .properties 2)

## Summary
- 3992 nodes · 11006 edges · 199 communities (151 shown, 48 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 163 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `33d395e9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CryptoProvider
- dependencies
- getModule.tsx
- ModulesEnum.ts
- package.json
- ModulesEnum
- EditScreen.tsx
- UI Patterns Context
- DarkModeSwitch.tsx
- decryptVaultContent.ts
- store.ts
- content/index.ts
- shared/types.ts
- popup/App.tsx
- ThemeProvider.tsx
- background/index.ts
- background/bridge.ts
- DeviceStorageClient.ts
- AnalysisScreen.tsx
- FastAccess.ts
- shared/bridge.ts
- expo
- ClavisPassHubClient.ts
- HomeScreen.tsx
- write.rs
- scripts
- AnalysisScreen
- manifest.json
- isTauri.ts
- forms.ts
- lib.rs
- ClavisPass Native Messaging Bridge
- LeftSideBar.tsx
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
- GoogleDriveLoginButton.tsx
- release.js
- VaultProvider.tsx
- rnSodiumProvider.ts
- AnalysisDetailScreen.tsx
- ClavisPass Website Marketing Brief
- bitwarden.ts
- pairing.rs
- riskModel.ts
- Idee: Identity als persönlicher Hauptscreen
- Sync.tsx
- useTheme
- vite.config.ts
- devDependencies
- prepare-msix.js
- GlobalClipboardSnackbar.tsx
- screen_lock.rs
- Crypto Context
- ClavisPass
- analysisEngine.ts
- reactNative.ts
- compilerOptions
- vitest
- webauthn.rs
- deriveIdentityClusters.ts
- reactNativePaper.tsx
- MainApplication.kt
- getModuleData
- expo-constants
- Datenschutzerklärung
- autofill-preferences.ts
- ObjcId
- Privacy Policy
- autofill-cache.ts
- Nutzungsbedingungen
- BrowserBridgeWriteSync.tsx
- prepare-native-host-sidecar.js
- NoteModule.tsx
- modulePolicy.ts
- MainActivity.kt
- session.rs
- scripts
- protocol.rs
- ExpiryNotificationScheduler.tsx
- complete_request
- AnimatedLogo.tsx
- Terms Of Use
- UI Context
- container/AnimatedOpacityContainer.tsx
- check-tauri-version-sync.js
- prepare-sodium-16kb.js
- ClavisPass Product Strategy Roadmap
- ref_react
- bundle
- FilterAnalysisModal.tsx
- Identity Management Concept
- tab-context.ts
- i18n/index.ts
- tauri.conf.json
- withAndroidApplicationId.js
- build-web-demo.js
- react-native
- plugins
- editHistory.ts
- ValueIconsEnum
- CloudProvider.tsx
- GoogleDriveClient.ts
- fill.ts
- Vault Modules Context
- ClavisPass Passkey Management Roadmap
- reactNativeReanimated.tsx
- reactNavigationNative.ts
- devDependencies
- compilerOptions
- totp.ts
- tsconfig.json
- Store Release Roadmap
- native_host_registration.rs
- LogoutStack.tsx
- domain.ts
- serve-webauthn-test-page.js
- SettingsScreen.tsx
- macOS
- windows
- gorhomBottomSheet.tsx
- WifiTypeEnum
- build
- vite-env.d.ts
- Screen Standardization Context
- ClavisPass Agent Context
- BridgeStatusBadge.tsx
- IdentityDetailScreen.tsx
- linux
- asyncStorage.ts
- ClavisPass Project Context
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
- Website presets
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
- App.tsx
- NoteFullscreenEditor.web.tsx
- ConfirmationModal
- useVault
- DropdownLayer.web.tsx
- generatePassword.ts
- dependencies
- AuthState
- expoVectorIcons.tsx
- Desktop And Tauri Context
- InlineNotice.tsx

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 270 edges
2. `react-native` - 185 edges
3. `react-native-paper` - 130 edges
4. `ModulesEnum` - 117 edges
5. `react-i18next` - 103 edges
6. `detectTauriEnvironment()` - 80 edges
7. `AnimatedPressable` - 80 edges
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
- `Applying a preset` --references--> `buildFaviconUrl()`  [INFERRED]
  docs/website-presets.md → src/features/vault/utils/digitalCardTheme.ts
- `Edge verification` --references--> `getStatus()`  [INFERRED]
  docs/browser-extension/native-messaging.md → src/features/vault/utils/expiry.ts

## Import Cycles
- None detected.

## Communities (199 total, 48 thin omitted)

### Community 0 - "CryptoProvider"
Cohesion: 0.18
Nodes (16): CryptoProvider, assertPositiveSafeInteger(), decryptVaultV1(), encryptVaultV1(), verifyVaultV1Provider(), makeV2KeywrapAadBytes(), makeV2PayloadAadBytes(), te (+8 more)

### Community 1 - "dependencies"
Cohesion: 0.02
Nodes (105): dependencies, argon2-browser, @babel/plugin-proposal-export-namespace-from, base64-js, crypto-js, expo, expo-auth-session, expo-blur (+97 more)

### Community 2 - "getModule.tsx"
Cohesion: 0.04
Nodes (78): zod, AddressModuleType, AddressModuleTypeSchema, regex, CompanyModuleType, CompanyModuleTypeSchema, regex, CreditCardModuleType (+70 more)

### Community 3 - "ModulesEnum.ts"
Cohesion: 0.10
Nodes (21): expo-document-picker, papaparse, VaultContextType, normalizeCredentialId(), normalizeRpId(), reservePasskeyAssertion(), ReservePasskeyAssertionPayload, payload (+13 more)

### Community 4 - "package.json"
Cohesion: 0.03
Nodes (76): react, react-dom, @types/react, @types/react-dom, typescript, main, name, private (+68 more)

### Community 5 - "ModulesEnum"
Cohesion: 0.08
Nodes (25): ModulesEnum, ADDRESS, ATTACHMENT, COMPANY, CREDIT_CARD, CUSTOM_FIELD, DIGITAL_CARD, DOCUMENT (+17 more)

### Community 6 - "EditScreen.tsx"
Cohesion: 0.05
Nodes (80): Interaction Polish, Item Surfaces, Shared Module UI, extractFastAccessObject(), EditRowControlsContainer(), EditRowControlsContainerProps, NativeDragHandleScrollLockContext, WebDragHandlePropsContext (+72 more)

### Community 7 - "UI Patterns Context"
Cohesion: 0.29
Nodes (6): Chips, Compact Search Behavior, Content Panels, Current Visual Direction, UI Patterns Context, Verification

### Community 8 - "DarkModeSwitch.tsx"
Cohesion: 0.22
Nodes (9): CheckedType, DarkModeSwitch(), PreviewProps, Props, Size, ThemePreviewCard(), AppTheme, theme (+1 more)

### Community 9 - "decryptVaultContent.ts"
Cohesion: 0.18
Nodes (12): getEmptyData(), DecryptVaultContentResult, makeV1AadBytes(), te, V1_AAD_OBJECT, VaultV1, VaultV1Schema, TEST_PAYLOAD (+4 more)

### Community 10 - "store.ts"
Cohesion: 0.06
Nodes (49): Core Files, Providers, Settings Schema, Storage Layers, Sync And Storage Context, Tokens, HotkeyRecorderItem(), Props (+41 more)

### Community 11 - "content/index.ts"
Cohesion: 0.12
Nodes (35): applyThemeToInlinePicker(), clearInlinePreview(), commitInlineAction(), createCloseIcon(), createInlineLogo(), createPickerLogo(), ensureInlineStyles(), fillSuggestionFromPicker() (+27 more)

### Community 12 - "shared/types.ts"
Cohesion: 0.06
Nodes (44): BackgroundHandler, BackgroundHandlerMap, BackgroundMessageContext, BackgroundMessageRouter, FillStateCardProps, ExtensionMessage, isExtensionMessage(), MessageMap (+36 more)

### Community 13 - "popup/App.tsx"
Cohesion: 0.07
Nodes (42): registerContentFrame(), setupSavePromptListener(), setupWebAuthnProbe(), App(), handleFill(), handleOpenDesktopApp(), handlePasskeyAssertion(), handlePromptResolution() (+34 more)

### Community 14 - "ThemeProvider.tsx"
Cohesion: 0.06
Nodes (72): react-i18next, react-native-paper, Props, ThemeContext, ThemeContextType, FastAccessType, FastAccessTypeSchema, PasswordGeneratorModal() (+64 more)

### Community 15 - "background/index.ts"
Cohesion: 0.12
Nodes (29): activeWebAuthnRequests, assertActiveWebAuthnRequest(), clearTabBadge(), delay(), deliverWebAuthnAssertionToTab(), desktopBridge, ensureContentScriptReady(), fillPreparedDataInTab() (+21 more)

### Community 16 - "background/bridge.ts"
Cohesion: 0.12
Nodes (24): Desktop bridge, deriveAppState(), DesktopBridgeService, getStoredPairingStatus(), normalizeAssertionCredential(), normalizeDesktopStatus(), normalizeFillData(), normalizePasskeyMetadata() (+16 more)

### Community 17 - "DeviceStorageClient.ts"
Cohesion: 0.11
Nodes (32): @react-native-async-storage/async-storage, @tauri-apps/plugin-fs, Import(), fetchFile(), getActiveLocalVaultIdKey(), getLocalSyncKey(), getLocalSyncMetadataKey(), getVaultLocalSyncKey() (+24 more)

### Community 18 - "AnalysisScreen.tsx"
Cohesion: 0.05
Nodes (92): Standard Screen Structure, expo-camera, expo-image, @kichiyaki/react-native-barcode-generator, react-native-draggable-flatlist, @react-navigation/native, @react-navigation/native-stack, react-qr-code (+84 more)

### Community 19 - "FastAccess.ts"
Cohesion: 0.09
Nodes (40): @tauri-apps/api, FastAccessSessionBridge(), MobileFastAccessOverlay(), FAST_ACCESS_NOTIFICATION_CATEGORY, FAST_ACCESS_POPUP_LABEL, FAST_ACCESS_POSITION_CHANGED_EVENT, FAST_ACCESS_READY_EVENT, FAST_ACCESS_UPDATE_EVENT (+32 more)

### Community 20 - "shared/bridge.ts"
Cohesion: 0.13
Nodes (26): NativeMessagingError, toBridgeError(), validateBridgeResponse(), withTimeout(), createInstanceId(), getBridgeClientInfo(), getBrowserDisplayName(), getInstanceId() (+18 more)

### Community 21 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, adaptiveIcon, blockedPermissions, package, permissions, versionCode, projectId (+31 more)

### Community 22 - "ClavisPassHubClient.ts"
Cohesion: 0.12
Nodes (39): calculateExpiresIn(), checkDiscovery(), createHubError(), createHubErrorFromPayload(), DiscoveryResponse, ensureVaultEtagForUpload(), fetchFile(), fetchUserInfo() (+31 more)

### Community 23 - "HomeScreen.tsx"
Cohesion: 0.07
Nodes (32): expo-linear-gradient, useSetting(), ExpiryModule(), ExpiryStatus, extractUrlFromEntry(), formatRelative(), getRelativeInfo(), getStatus() (+24 more)

### Community 24 - "write.rs"
Cohesion: 0.10
Nodes (34): as_io_error(), BrowserWriteKind, CreateEntryFromBrowser, ReservePasskeyAssertion, UpdateEntryFromBrowser, BrowserWriteRequest, BrowserWriteRequestStore, BrowserWriteResult (+26 more)

### Community 25 - "scripts"
Cohesion: 0.05
Nodes (39): scripts, android, android:build:apk, android:build:store, android:build:store-submit, android:submit:store, extension:build, extension:build:chrome (+31 more)

### Community 26 - "AnalysisScreen"
Cohesion: 0.16
Nodes (12): AnalysisStackParamList, Stack, normalize(), AnalysisScreen(), filterValuesWithNonEmptySecrets(), getItemRisk(), matchesQualityBucket(), matchesRiskBucket() (+4 more)

### Community 27 - "manifest.json"
Cohesion: 0.06
Nodes (35): action, default_icon, default_popup, default_title, background, service_worker, type, browser_specific_settings (+27 more)

### Community 28 - "isTauri.ts"
Cohesion: 0.10
Nodes (22): applyNativeContentProtection(), applyTauriContentProtection(), ContentProtectionContext, ContentProtectionContextValue, ContentProtectionProvider(), getClipboardText(), setClipboardText(), tryNavigatorReadText() (+14 more)

### Community 29 - "forms.ts"
Cohesion: 0.11
Nodes (33): AutofillPlan, buildAutofillPlan(), buildDetachedContainer(), buildFieldKey(), buildFieldText(), buildFormId(), chooseBestField(), ClassifiedField (+25 more)

### Community 30 - "lib.rs"
Cohesion: 0.11
Nodes (19): clamp_window_size(), clamp_window_size_to_monitor(), DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIDTH, emit_lock_vault(), emit_vault_file_open_request(), get_requested_vault_file_path(), get_window_size_file_path() (+11 more)

### Community 31 - "ClavisPass Native Messaging Bridge"
Cohesion: 0.06
Nodes (30): Architecture, Browser loading notes, ClavisPass Browser Extension, Current feature set, Development, Important note, Working from the repo root, Chosen architecture (+22 more)

### Community 32 - "LeftSideBar.tsx"
Cohesion: 0.05
Nodes (57): expo-updates, @expo/vector-icons, react-native-safe-area-context, @react-navigation/bottom-tabs, @tauri-apps/plugin-process, @tauri-apps/plugin-updater, ProtectedRoute(), CustomBottomTab() (+49 more)

### Community 33 - "mergeVaultData.ts"
Cohesion: 0.09
Nodes (34): DEMO_MASTER_PASSWORD, demoVault, folders, FolderSchema, ValuesListTypeSchema, VaultDataType, VaultDataTypeSchema, VaultEntryTombstone (+26 more)

### Community 34 - "commands.rs"
Cohesion: 0.09
Nodes (12): AUTH_REPLY_DESCRIPTOR, AUTH_REPLY_SIGNATURE, authenticate_with_system(), BLOCK_HAS_SIGNATURE, BlockDescriptor, CF_UNICODETEXT_FORMAT, get_main_window_hwnd(), LAPOLICY_DEVICE_OWNER_AUTHENTICATION (+4 more)

### Community 35 - "LoginScreen.tsx"
Cohesion: 0.13
Nodes (37): expo-network, LoginStackParamList, Stack, useToken(), OnlineContext, OnlineContextType, Props, useOnline() (+29 more)

### Community 36 - "AttachmentModule.tsx"
Cohesion: 0.10
Nodes (32): expo-file-system, expo-sharing, @tauri-apps/plugin-dialog, AttachmentModule(), canPreviewAttachment(), downloadBrowserAttachment(), formatBytes(), getAttachmentIcon() (+24 more)

### Community 37 - "CloseBehaviorState"
Cohesion: 0.13
Nodes (10): claim_pending_lock_request(), close_main_window(), CloseBehavior, Exit, Hide, CloseBehaviorState, focus_main_window(), schedule_exit_watchdog() (+2 more)

### Community 38 - "state.ts"
Cohesion: 0.08
Nodes (25): buildCreatePayload(), buildUpdatePayload(), resolvePromptWithDesktopWrite(), toAppliedResult(), buildPromptTitle(), ExtensionState, normalizeIdentity(), PreparedFillRecord (+17 more)

### Community 39 - "DraggableModulesList.shared.tsx"
Cohesion: 0.16
Nodes (21): @hello-pangea/dnd, NativeDragHandleScrollLockProvider(), WebDragHandlePropsProvider(), dragDropAnimationConfig, DraggableModulesList(), DraggableModulesFooter(), DraggableModulesListProps, draggableModulesListStyles (+13 more)

### Community 40 - "mapKdbxToClavisPass.ts"
Cohesion: 0.15
Nodes (22): kdbxweb, configureKdbxArgon2(), importKdbx(), addCustomField(), addTotpModule(), addValueModule(), binaryToBytes(), binaryWithMetaToAttachment() (+14 more)

### Community 41 - "detectTauriEnvironment"
Cohesion: 0.18
Nodes (22): CloudProvider(), isInvalidGrant(), authenticateUser(), invokeTauriSystemAuth(), invokeTauriSystemAuthAvailable(), isSystemAuthenticationAvailable(), saveAuthentication(), BrowserBridgePairingPrompt() (+14 more)

### Community 42 - "host.rs"
Cohesion: 0.13
Nodes (23): app_scheme(), AssertPasskeyPayload, bridge_result_to_response(), ensure_ready(), FillPayload, handle_request(), is_es256_algorithm(), MatchPasskeysPayload (+15 more)

### Community 43 - "vault.rs"
Cohesion: 0.11
Nodes (39): domain_contains(), entry_match_hosts(), fill_data_for_entry(), FillDataResult, first_string(), FolderRef, has_passkey(), login_entry() (+31 more)

### Community 44 - "GoogleDriveLoginButton.tsx"
Cohesion: 0.12
Nodes (30): expo-auth-session, expo-random, expo-web-browser, @fabianlars/tauri-plugin-oauth, ANDROID_AUTH_PROMPT_OPTIONS, randState(), SCOPES, ANDROID_AUTH_PROMPT_OPTIONS (+22 more)

### Community 45 - "release.js"
Cohesion: 0.12
Nodes (19): androidGradleHasVersionCode(), androidGradleHasVersionName(), androidStringsHasRuntimeVersion(), cargoLockHasVersion(), cargoTomlHasVersion(), { execSync }, existingTags, filesToUpdate (+11 more)

### Community 46 - "VaultProvider.tsx"
Cohesion: 0.09
Nodes (25): Core Files, Master Password Lifetime, Module Policy, Security And Vault Context, UI-Safe Metadata, Vault Session Boundary, Core Mental Model, Session Boundary (+17 more)

### Community 47 - "rnSodiumProvider.ts"
Cohesion: 0.14
Nodes (11): base64-js, libsodium-wrappers-sumo, react-native-sodium-jsi, getCryptoProvider(), rnSodiumProvider, td, te, verifyProviderInDev() (+3 more)

### Community 48 - "AnalysisDetailScreen.tsx"
Cohesion: 0.14
Nodes (21): useAuthMaster(), canonicalizeForVariants(), deriveAnalysisPepperFromMaster(), fingerprintPassword(), getPasswordStrengthColor(), AnalysisDetailScreen(), AnalysisDetailScreenProps, analyzeCharacterComposition() (+13 more)

### Community 49 - "ClavisPass Website Marketing Brief"
Cohesion: 0.05
Nodes (43): Attachments And Previews, Brand Details, Bring Your Own Sync, Browser Extension, Can I import my existing passwords?, Can my cloud provider read my passwords?, ClavisPass Website Marketing Brief, Conversion Priorities (+35 more)

### Community 50 - "bitwarden.ts"
Cohesion: 0.20
Nodes (24): addCardModule(), addCustomField(), addExpiryModule(), addIdentityModules(), addLoginModules(), addNote(), addPasskeyModules(), addSshKeyModule() (+16 more)

### Community 51 - "pairing.rs"
Cohesion: 0.10
Nodes (29): bridge_approve_pairing(), bridge_claim_pending_writes(), bridge_complete_write_request(), bridge_list_paired_clients(), bridge_list_pending_pairings(), bridge_list_rejected_clients(), bridge_publish_session(), bridge_reject_pairing() (+21 more)

### Community 52 - "riskModel.ts"
Cohesion: 0.16
Nodes (19): buildAnalysisCache(), findSequentialTriples(), hasRepeatedChars(), strengthFromEntropyBits(), CHARSET_SIZES, EntropyOptions, estimateCharsetSize(), hasUnicodeProps (+11 more)

### Community 53 - "Idee: Identity als persönlicher Hauptscreen"
Cohesion: 0.22
Nodes (8): Datenschutz, Einschätzung, Gestaltungsprinzipien und offene Fragen, Idee: Identity als persönlicher Hauptscreen, Mögliche Ausbaustufen, Mögliche Funktionen, Technischer Ansatz, Ziel

### Community 54 - "Sync.tsx"
Cohesion: 0.10
Nodes (33): Current Vault Format, Implementation Phases, Props, Sync(), createVaultDeviceId(), DeviceIdentity, getCurrentVaultDeviceId(), getDeviceDisplayName() (+25 more)

### Community 55 - "useTheme"
Cohesion: 0.05
Nodes (48): react-native-circular-progress, useTheme(), AnalysisEntry(), Props, AnalysisEntryGradient(), Props, Pattern(), Props (+40 more)

### Community 57 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, @babel/core, eslint, eslint-config-universe, patch-package, prettier, react-test-renderer, @tauri-apps/cli (+14 more)

### Community 58 - "prepare-msix.js"
Cohesion: 0.10
Nodes (16): appExe, appVersion, assetsOutputDir, createUnplatedTargetSizeIcons(), escapePowerShellSingleQuoted(), fs, manifest, manifestSource (+8 more)

### Community 59 - "GlobalClipboardSnackbar.tsx"
Cohesion: 0.38
Nodes (7): Handler, handlers, subscribeClipboardCopied(), unsubscribeClipboardCopied(), ClipboardCopyPayload, GlobalClipboardSnackbar(), msToSecCeil()

### Community 60 - "screen_lock.rs"
Cohesion: 0.11
Nodes (8): DeviceIdentity, get_device_identity(), CGSessionCopyCurrentDictionary(), emit(), ScreenLockPayload, Session, start(), wndproc()

### Community 61 - "Crypto Context"
Cohesion: 0.40
Nodes (4): Core Files, Critical Rules, Crypto Context, Verification

### Community 62 - "ClavisPass"
Cohesion: 0.07
Nodes (28): 1. VaultSession (Authoritative & Secret-Capable), 2. VaultProvider (UI-Safe Projection), Authentication & Master Secret Handling, Backend / Plattform, CI / CD & Deployment, ClavisPass, Cryptography & Encryption Model, Defensive Defaults (+20 more)

### Community 63 - "analysisEngine.ts"
Cohesion: 0.20
Nodes (11): expo-crypto, AnalysisFlags, AnalysisRef, CachedAnalysisItem, CacheResult, THRESH_BITS, fetchRange(), getPwnedCountForPassword() (+3 more)

### Community 64 - "reactNative.ts"
Cohesion: 0.12
Nodes (12): Animated, AnimatedValue, Dimensions, InteractionManager, Platform, Pressable, ScrollView, StyleSheet (+4 more)

### Community 65 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+11 more)

### Community 66 - "vitest"
Cohesion: 0.28
Nodes (8): react-test-renderer, vitest, update, Editor(), devices, renderBare(), renderWithAppProviders(), textContent()

### Community 67 - "webauthn.rs"
Cohesion: 0.10
Nodes (31): AssertionAuthenticatorResponse, AssertionPublicKeyCredential, AssertionSigningContext, base64url_decode(), base64url_encode(), base64url_round_trips_without_padding(), build_assertion_authenticator_data(), build_assertion_public_key_credential() (+23 more)

### Community 68 - "deriveIdentityClusters.ts"
Cohesion: 0.29
Nodes (11): buildPasswordUseCounts(), deriveIdentityClusters(), entryHasSimplePasswordRisk(), getEntryDomains(), getEntryModuleTypes(), getEntryPasswordValues(), getEntrySignals(), getModuleValue() (+3 more)

### Community 69 - "reactNativePaper.tsx"
Cohesion: 0.11
Nodes (14): ActivityIndicator, baseColors, Button, Chip, Divider, Icon, IconButton, MD3DarkTheme (+6 more)

### Community 71 - "getModuleData"
Cohesion: 0.11
Nodes (24): TemplateEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+16 more)

### Community 72 - "expo-constants"
Cohesion: 0.31
Nodes (7): expo-constants, getMobileRedirectUri(), getAppRedirectUri(), getAppScheme(), Constants, resetExpoConfig(), setExpoConfig()

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

### Community 77 - "autofill-cache.ts"
Cohesion: 0.21
Nodes (21): clearAutofillDomainCache(), countPasswordSuggestions(), countVisibleSuggestions(), DomainAutofillCache, DomainAutofillCacheEntry, getAutofillEligibilityForUrl(), getCachedAutofillMatchCountForUrl(), getCachedMatchCount() (+13 more)

### Community 78 - "Nutzungsbedingungen"
Cohesion: 0.10
Nodes (20): 10. Erlaubte Nutzung, 11. Open Source und Lizenzen, 12. Kosten, 13. Drittanbieter, 14. Updates, 15. Haftung, 16. Beendigung der Nutzung, 17. Änderungen (+12 more)

### Community 79 - "BrowserBridgeWriteSync.tsx"
Cohesion: 0.33
Nodes (11): applyUpdateToEntry(), BrowserBridgeWriteSync(), BrowserWriteKind, BrowserWriteRequest, createBrowserEntry(), CreatePayload, effectiveUrl(), normalizeText() (+3 more)

### Community 80 - "prepare-native-host-sidecar.js"
Cohesion: 0.15
Nodes (12): cargoArgs, { copyFileSync, existsSync, mkdirSync, writeFileSync }, detectHostTriple(), { execFileSync }, { join, resolve }, manifestPath, outputDir, outputPath (+4 more)

### Community 81 - "NoteModule.tsx"
Cohesion: 0.10
Nodes (23): JsonLine(), NoteCodePreview(), Props, styles, InlinePart, InlineText(), NoteMarkdownPreview(), parseInline() (+15 more)

### Community 82 - "modulePolicy.ts"
Cohesion: 0.20
Nodes (10): EntryMeta, firstModule(), firstValue(), MANAGED_MODULE_VALUES, ManagedModules, MetaExtractor, MODULE_POLICY, ModuleKind (+2 more)

### Community 84 - "session.rs"
Cohesion: 0.24
Nodes (7): BridgeSessionSnapshot, clear_session(), load_session(), now_ms(), publish_session(), SESSION_TTL_MS, write_json_atomically()

### Community 85 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, build:chrome, build:firefox, build:firefox-local, dev, package:chrome, package:firefox (+8 more)

### Community 86 - "protocol.rs"
Cohesion: 0.20
Nodes (7): BridgeClientInfo, BridgeError, BridgePairingEnvelope, BridgeRequest, BridgeResponse, HOST_NAME, PROTOCOL_VERSION

### Community 87 - "ExpiryNotificationScheduler.tsx"
Cohesion: 0.39
Nodes (7): expo-notifications, buildPendingExpiryReminders(), cancelScheduledExpiryReminders(), configureNotificationHandler(), ExpiryNotificationScheduler(), getReminderDate(), PendingExpiryReminder

### Community 88 - "complete_request"
Cohesion: 0.36
Nodes (9): bridge_dir(), BRIDGE_ENV_KEY, ensure_dir(), pairing_store_path(), platform_base_dir(), session_store_path(), write_request_store_path(), write_result_store_path() (+1 more)

### Community 89 - "AnimatedLogo.tsx"
Cohesion: 0.25
Nodes (4): react-native-svg, AnimatedLogo(), AnimatedRect, styles

### Community 90 - "Terms Of Use"
Cohesion: 0.10
Nodes (20): 10. Permitted Use, 11. Open Source And Licenses, 12. Costs, 13. Third-Party Providers, 14. Updates, 15. Liability, 16. Ending Use, 17. Changes (+12 more)

### Community 91 - "UI Context"
Cohesion: 0.25
Nodes (7): i18n, Important Files, Menus And Dropdowns, Platform Model, Related UI Context, Titlebar And Chrome, UI Context

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

### Community 96 - "ref_react"
Cohesion: 0.07
Nodes (43): Props, Props, styles, CustomFieldInputType, EditCustomFieldModal(), Props, ACTION_ICON, EditHistoryModal() (+35 more)

### Community 97 - "bundle"
Cohesion: 0.17
Nodes (12): bundle, active, category, copyright, createUpdaterArtifacts, externalBin, fileAssociations, icon (+4 more)

### Community 98 - "FilterAnalysisModal.tsx"
Cohesion: 0.27
Nodes (8): FilterAnalysisModal(), Props, PasswordStrengthLevel, MEDIUM, STRONG, WEAK, getPasswordStrengthIcon(), Divider()

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

### Community 105 - "react-native"
Cohesion: 0.05
Nodes (45): react-native, react-native-reanimated, Props, styles, FilterItem, FiltersNarrow, FiltersNarrowProps, FiltersWide (+37 more)

### Community 106 - "plugins"
Cohesion: 0.20
Nodes (10): args, customProtocol, plugins, cli, deepLink, updater, endpoints, pubkey (+2 more)

### Community 107 - "editHistory.ts"
Cohesion: 0.23
Nodes (12): appendLog(), areValuesEqual(), cloneValue(), createLogEntry(), EditHistoryActionType, EditHistoryMeta, EditSessionLogEntry, HistoryEntry (+4 more)

### Community 108 - "ValueIconsEnum"
Cohesion: 0.14
Nodes (13): ValueIconsEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+5 more)

### Community 109 - "CloudProvider.tsx"
Cohesion: 0.24
Nodes (10): OAuthRefreshError, Props, StoredAuth, TokenContext, TokenContextValue, FetchFileParams, TokenRefreshParams, Provider (+2 more)

### Community 110 - "GoogleDriveClient.ts"
Cohesion: 0.13
Nodes (20): buildMultipartBody(), escapeDriveQueryString(), fetchFile(), fetchUserInfo(), findFileIdByName(), GoogleTokenRefreshError, readJsonSafe(), readTextSafe() (+12 more)

### Community 111 - "fill.ts"
Cohesion: 0.30
Nodes (11): applyTargets(), buildNoFieldsResult(), collectFillTargets(), emitInputEvents(), executeFill(), FillPreviewResult, FillSnapshot, FillTarget (+3 more)

### Community 112 - "Vault Modules Context"
Cohesion: 0.40
Nodes (4): Important Boundaries, Reorder Flows, Vault Modules Context, Verification

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

### Community 122 - "LogoutStack.tsx"
Cohesion: 0.38
Nodes (5): LogoutStackParamList, LogoutStack(), Stack, LogoutScreen(), LogoutScreenProps

### Community 124 - "domain.ts"
Cohesion: 0.24
Nodes (11): loadPasskeyCandidatesForWebAuthnRequest(), buildEntrySuggestions(), normalizeHost(), normalizeLookupHost(), normalizeRpHost(), safeUrl(), scoreUrlMatch(), searchEntries() (+3 more)

### Community 125 - "serve-webauthn-test-page.js"
Cohesion: 0.25
Nodes (4): __dirname, pagePath, port, server

### Community 126 - "SettingsScreen.tsx"
Cohesion: 0.05
Nodes (51): expo-linking, @gorhom/bottom-sheet, react-native-vector-icons, simple-icons, @tauri-apps/plugin-shell, useContentProtection(), useDevMode(), removeAuthentication() (+43 more)

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

### Community 137 - "Screen Standardization Context"
Cohesion: 0.40
Nodes (4): Common Refactor Targets, Files To Check First, Known Custom Screens, Screen Standardization Context

### Community 138 - "ClavisPass Agent Context"
Cohesion: 0.29
Nodes (6): Always Know, ClavisPass Agent Context, Context Routing, Fast Map, graphify, High-Risk Rules

### Community 141 - "IdentityDetailScreen.tsx"
Cohesion: 0.06
Nodes (45): Standard Checklist, Headers, IdentityStackParamList, Stack, IdentityEmailLogo(), IdentityEmailLogoProps, styles, getDefaultIdentityName() (+37 more)

### Community 142 - "linux"
Cohesion: 0.67
Nodes (3): linux, depends, deb

### Community 144 - "ClavisPass Project Context"
Cohesion: 0.40
Nodes (4): ClavisPass Project Context, Context Files, First Runtime Files, High-Risk Areas

### Community 171 - "withIosGoogleOAuthScheme.js"
Cohesion: 0.43
Nodes (5): ensureUrlScheme(), normalizeClientId(), {
  ensureUrlScheme,
  toReverseClientIdScheme,
}, toReverseClientIdScheme(), { withInfoPlist }

### Community 172 - "browser-extension/package.json"
Cohesion: 0.17
Nodes (11): react, react-dom, @types/react, @types/react-dom, typescript, name, private, type (+3 more)

### Community 174 - "Website presets"
Cohesion: 0.40
Nodes (4): Applying a preset, Catalog, Verification, Website presets

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
Cohesion: 0.20
Nodes (9): Current V1 Behavior, Envelope Design Notes, Goal, Master Password Change, Migration Strategy, Non-Goals, Testing Plan, V2 Behavior (+1 more)

### Community 185 - "ClavisPassHubDiscoveryResult.ts"
Cohesion: 0.29
Nodes (6): ClavisPassHubDiscoveryResult, ClavisPassHubDiscoveryStatus, DiscoveryCheckingResult, DiscoveryErrorResult, DiscoveryIdleResult, DiscoverySuccessResult

### Community 189 - "App.tsx"
Cohesion: 0.06
Nodes (50): App(), AppShell(), AppWithNavigation(), DemoBootstrap(), getCurrentWindowSafe(), MainWindowReadySignal(), withAlpha(), DevModeContext (+42 more)

### Community 190 - "NoteFullscreenEditor.web.tsx"
Cohesion: 0.33
Nodes (5): @monaco-editor/react, MONACO_LANGUAGE_BY_NOTE_LANGUAGE, NoteFullscreenEditor(), Props, styles

### Community 191 - "ConfirmationModal"
Cohesion: 0.19
Nodes (9): ClearCompletedTasksModal(), Props, ClearModulesModal(), Props, DeleteModuleModal(), Props, DiscardChangesModal(), Props (+1 more)

### Community 192 - "useVault"
Cohesion: 0.12
Nodes (30): useAuth(), useVault(), Login(), Props, isUsingAuthentication(), loadAuthentication(), consumeSystemAuthAutoUnlockSuppression(), BrowserBridgeSessionSync() (+22 more)

### Community 194 - "generatePassword.ts"
Cohesion: 0.29
Nodes (5): generatePassword(), LOWERCASE_CHAR_CODES, NUMBER_CHAR_CODES, SYMBOL_CHAR_CODES, UPPERCASE_CHAR_CODES

### Community 195 - "dependencies"
Cohesion: 0.50
Nodes (4): dependencies, react, react-dom, tldts

### Community 198 - "Desktop And Tauri Context"
Cohesion: 0.29
Nodes (6): Chrome And Drag Regions, Core Files, Desktop And Tauri Context, Fast Access, Runtime Model, Tauri Responsibilities

## Knowledge Gaps
- **130 isolated node(s):** `react`, `react-dom`, `@types/chrome`, `@types/react`, `@types/react-dom` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1711 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **48 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `ModulesEnum.ts`, `package.json`, `decryptVaultContent.ts`, `store.ts`, `DeviceStorageClient.ts`, `ClavisPassHubClient.ts`, `HomeScreen.tsx`, `mergeVaultData.ts`, `DraggableModulesList.shared.tsx`, `withIosGoogleOAuthScheme.js`, `GoogleDriveLoginButton.tsx`, `bitwarden.ts`, `Sync.tsx`, `vite.config.ts`, `ConfirmationModal`, `generatePassword.ts`, `deriveIdentityClusters.ts`, `getModuleData`, `expo-constants`, `GoogleDriveClient.ts`, `domain.ts`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **What connects `react`, `react-dom`, `@types/chrome` to the rest of the system?**
  _130 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.01904761904761905 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `ModulesEnum.ts`, `package.json`, `EditScreen.tsx`, `DarkModeSwitch.tsx`, `store.ts`, `IdentityDetailScreen.tsx`, `ThemeProvider.tsx`, `DeviceStorageClient.ts`, `AnalysisScreen.tsx`, `FastAccess.ts`, `HomeScreen.tsx`, `isTauri.ts`, `LeftSideBar.tsx`, `LoginScreen.tsx`, `AttachmentModule.tsx`, `DraggableModulesList.shared.tsx`, `detectTauriEnvironment`, `GoogleDriveLoginButton.tsx`, `VaultProvider.tsx`, `AnalysisDetailScreen.tsx`, `Sync.tsx`, `useTheme`, `GlobalClipboardSnackbar.tsx`, `App.tsx`, `NoteFullscreenEditor.web.tsx`, `useVault`, `NoteModule.tsx`, `ExpiryNotificationScheduler.tsx`, `AnimatedLogo.tsx`, `container/AnimatedOpacityContainer.tsx`, `ref_react`, `FilterAnalysisModal.tsx`, `SettingsScreen.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `getModule.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.04443614637789395 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `ModulesEnum.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09743589743589744 - nodes in this community are weakly interconnected._
# Graph Report - ClavisPass  (2026-11-09)

## Corpus Check
- 590 files · ~363,316 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 37 file(s) not represented in the graph (top: .xml 11, (none) 8, .properties 2)

## Summary
- 4012 nodes · 11118 edges · 198 communities (153 shown, 45 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 165 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `996e8193`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CryptoProvider
- dependencies
- getModule.tsx
- modulePolicy.ts
- package.json
- ModulesEnum
- ListItem.tsx
- useSetting
- react-native
- AnalysisDetailScreen.tsx
- store.ts
- content/index.ts
- shared/types.ts
- popup/App.tsx
- react-native-paper
- background/index.ts
- background/bridge.ts
- vitest
- Header
- FastAccess.ts
- shared/bridge.ts
- expo
- ClavisPassHubClient.ts
- HomeScreen.tsx
- write.rs
- scripts
- EditScreen.tsx
- manifest.json
- detectTauriEnvironment
- forms.ts
- lib.rs
- ClavisPass Native Messaging Bridge
- UpdateManager.tsx
- mergeVaultData.ts
- commands.rs
- LoginScreen.tsx
- AttachmentModule.tsx
- vaultIdentity.ts
- state.ts
- DraggableModulesList.shared.tsx
- mapKdbxToClavisPass.ts
- hotkeys.ts
- host.rs
- vault.rs
- Header.tsx
- release.js
- AuthProvider.tsx
- useClipboardCopy.ts
- CloseBehaviorState
- ClavisPass Website Marketing Brief
- bitwarden.ts
- pairing.rs
- vcardExport.ts
- Idee: Identity als persönlicher Hauptscreen
- VaultProvider.tsx
- useTheme
- vite.config.ts
- devDependencies
- prepare-msix.js
- model/types.ts
- screen_lock.rs
- Crypto Context
- ClavisPass
- SettingsQuickSelect.tsx
- reactNative.ts
- compilerOptions
- Sync And Storage Context
- webauthn.rs
- useAuth
- reactNativePaper.tsx
- MainApplication.kt
- TemplateEnum
- appScheme.test.ts
- Datenschutzerklärung
- autofill-preferences.ts
- AttachmentPreviewScreen.native.tsx
- Privacy Policy
- decryptVaultContent.ts
- Nutzungsbedingungen
- reservePasskeyAssertion.ts
- prepare-native-host-sidecar.js
- NoteModule.tsx
- rnSodiumProvider.ts
- MainActivity.kt
- session.rs
- scripts
- protocol.rs
- App.tsx
- complete_request
- bridge_commands.rs
- Terms Of Use
- UI Context
- deriveIdentityClusters.ts
- check-tauri-version-sync.js
- prepare-sodium-16kb.js
- ClavisPass Product Strategy Roadmap
- ModalSurface
- bundle
- ValuesType.ts
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
- CloudStorageClient.ts
- Vault V2 Key Envelope Roadmap
- fill.ts
- Login.tsx
- ClavisPass Passkey Management Roadmap
- reactNativeReanimated.tsx
- reactNavigationNative.ts
- devDependencies
- compilerOptions
- GoogleDriveLoginButton.tsx
- tsconfig.json
- Store Release Roadmap
- native_host_registration.rs
- ObjcId
- DeviceStorageClient.ts
- domain.ts
- serve-webauthn-test-page.js
- SettingsScreen.tsx
- macOS
- windows
- gorhomBottomSheet.tsx
- WifiTypeEnum
- build
- vite-env.d.ts
- GlobalClipboardSnackbar.tsx
- container/AnimatedOpacityContainer.tsx
- BridgeStatusBadge.tsx
- IdentityDetailScreen.tsx
- linux
- asyncStorage.ts
- AddModuleModal.tsx
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
- TotpModule.tsx
- Firefox Store Release Notes
- ClavisPass Agent Context
- generate-webauthn-test-passkey.js
- ClavisPass Firefox Add-on Reviewer Build
- AuthReplyBlock
- Bitwarden Import Roadmap
- Agent Workflow Context
- Build, Release, And Update Context
- Identity Context
- content-messages.ts
- CustomTitlebar.tsx
- CLAUDE.md
- .claude/CLAUDE.md
- Security And Vault Context
- Vault Modules Context
- CardDetailsScreen.tsx
- serialize
- v2/aad.ts
- generatePassword.ts
- dependencies
- expoVectorIcons.tsx
- InlineNotice.tsx

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 277 edges
2. `react-native` - 187 edges
3. `react-native-paper` - 132 edges
4. `ModulesEnum` - 118 edges
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
- `High-Risk Rules` --references--> `VaultProvider()`  [INFERRED]
  AGENTS.md → src/app/providers/VaultProvider.tsx

## Import Cycles
- None detected.

## Communities (198 total, 45 thin omitted)

### Community 0 - "CryptoProvider"
Cohesion: 0.23
Nodes (13): CryptoProvider, assertPositiveSafeInteger(), decryptVaultV1(), encryptVaultV1(), verifyVaultV1Provider(), makeV2KeywrapAadBytes(), makeV2PayloadAadBytes(), assertBytesEqual() (+5 more)

### Community 1 - "dependencies"
Cohesion: 0.02
Nodes (105): dependencies, argon2-browser, @babel/plugin-proposal-export-namespace-from, base64-js, crypto-js, expo, expo-auth-session, expo-blur (+97 more)

### Community 2 - "getModule.tsx"
Cohesion: 0.05
Nodes (78): zod, AddressModuleType, AddressModuleTypeSchema, regex, CompanyModuleType, CompanyModuleTypeSchema, regex, CreditCardModuleType (+70 more)

### Community 3 - "modulePolicy.ts"
Cohesion: 0.17
Nodes (14): VaultProvider(), buildEntryMeta(), EntryMeta, firstModule(), firstValue(), getSecretFor(), isManagedModule(), MANAGED_MODULE_VALUES (+6 more)

### Community 4 - "package.json"
Cohesion: 0.03
Nodes (72): react, react-dom, @types/react, @types/react-dom, typescript, main, name, private (+64 more)

### Community 5 - "ModulesEnum"
Cohesion: 0.08
Nodes (25): ModulesEnum, ADDRESS, ATTACHMENT, COMPANY, CREDIT_CARD, CUSTOM_FIELD, DIGITAL_CARD, DOCUMENT (+17 more)

### Community 6 - "ListItem.tsx"
Cohesion: 0.06
Nodes (50): extractFastAccessObject(), Props, styles, Props, styles, SubItem(), FolderFilter(), Props (+42 more)

### Community 7 - "useSetting"
Cohesion: 0.09
Nodes (25): expo-notifications, DEFAULT_KEYS, loadSettingWithTimeout(), SettingsContext, SettingsContextValue, SettingsProvider(), SettingsState, useSetting() (+17 more)

### Community 8 - "react-native"
Cohesion: 0.05
Nodes (43): expo-linear-gradient, @expo/vector-icons, @monaco-editor/react, react-native, @react-native-assets/slider, react-native-circular-progress, Props, ThemeContext (+35 more)

### Community 9 - "AnalysisDetailScreen.tsx"
Cohesion: 0.05
Nodes (72): expo-crypto, AnalysisStackParamList, Stack, useAuthMaster(), FiltersNarrow, AnalysisFlags, AnalysisRef, CachedAnalysisItem (+64 more)

### Community 10 - "store.ts"
Cohesion: 0.17
Nodes (17): normalizeHotkeySettings(), BooleanDef, DEVICE_RESET_KEYS, EnumDef, get(), isModulesEnumValue(), JsonDef, listeners (+9 more)

### Community 11 - "content/index.ts"
Cohesion: 0.12
Nodes (35): applyThemeToInlinePicker(), clearInlinePreview(), commitInlineAction(), createCloseIcon(), createInlineLogo(), createPickerLogo(), ensureInlineStyles(), fillSuggestionFromPicker() (+27 more)

### Community 12 - "shared/types.ts"
Cohesion: 0.06
Nodes (46): BackgroundHandler, BackgroundHandlerMap, BackgroundMessageContext, BackgroundMessageRouter, FillStateCardProps, GetFillDataForEntryPayload, GetPasskeyMetadataForEntryPayload, ExtensionMessage (+38 more)

### Community 13 - "popup/App.tsx"
Cohesion: 0.07
Nodes (42): registerContentFrame(), setupSavePromptListener(), setupWebAuthnProbe(), App(), handleFill(), handleOpenDesktopApp(), handlePasskeyAssertion(), handlePromptResolution() (+34 more)

### Community 14 - "react-native-paper"
Cohesion: 0.07
Nodes (68): react-i18next, react-native-paper, FastAccessType, FastAccessTypeSchema, PasswordGeneratorModal(), Props, styles, ModuleContainer() (+60 more)

### Community 15 - "background/index.ts"
Cohesion: 0.09
Nodes (54): clearAutofillDomainCache(), countPasswordSuggestions(), countVisibleSuggestions(), DomainAutofillCache, DomainAutofillCacheEntry, getAutofillEligibilityForUrl(), getCachedAutofillMatchCountForUrl(), getCachedMatchCount() (+46 more)

### Community 16 - "background/bridge.ts"
Cohesion: 0.12
Nodes (26): Desktop bridge, deriveAppState(), DesktopBridgeService, getStoredPairingStatus(), normalizeAssertionCredential(), normalizeDesktopStatus(), normalizeFillData(), normalizePasskeyMetadata() (+18 more)

### Community 17 - "vitest"
Cohesion: 0.23
Nodes (10): react-test-renderer, vitest, GlassAppearanceSettings(), Preview(), update, devices, setPlatform(), renderBare() (+2 more)

### Community 18 - "Header"
Cohesion: 0.08
Nodes (33): Chips, Compact Search Behavior, Content Panels, Current Visual Direction, Headers, Standard Screen Structure, UI Patterns Context, Verification (+25 more)

### Community 19 - "FastAccess.ts"
Cohesion: 0.10
Nodes (41): @tauri-apps/api, invokeTauriSystemAuth(), FastAccessSessionBridge(), MobileFastAccessOverlay(), FAST_ACCESS_NOTIFICATION_CATEGORY, FAST_ACCESS_POPUP_LABEL, FAST_ACCESS_POSITION_CHANGED_EVENT, FAST_ACCESS_READY_EVENT (+33 more)

### Community 20 - "shared/bridge.ts"
Cohesion: 0.12
Nodes (25): NativeMessagingClient, NativeMessagingError, toBridgeError(), validateBridgeResponse(), withTimeout(), createInstanceId(), getBridgeClientInfo(), getBrowserDisplayName() (+17 more)

### Community 21 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, adaptiveIcon, blockedPermissions, package, permissions, versionCode, projectId (+31 more)

### Community 22 - "ClavisPassHubClient.ts"
Cohesion: 0.10
Nodes (43): @react-native-async-storage/async-storage, calculateExpiresIn(), createHubError(), createHubErrorFromPayload(), DiscoveryResponse, ensureVaultEtagForUpload(), fetchFile(), fetchUserInfo() (+35 more)

### Community 23 - "HomeScreen.tsx"
Cohesion: 0.08
Nodes (29): @react-native-masked-view/masked-view, @shopify/flash-list, ExpiryStatus, formatRelative(), getRelativeInfo(), RelativeExpiryInfo, comparePinnedFirst(), isPinnedEntry() (+21 more)

### Community 24 - "write.rs"
Cohesion: 0.10
Nodes (34): as_io_error(), BrowserWriteKind, CreateEntryFromBrowser, ReservePasskeyAssertion, UpdateEntryFromBrowser, BrowserWriteRequest, BrowserWriteRequestStore, BrowserWriteResult (+26 more)

### Community 25 - "scripts"
Cohesion: 0.05
Nodes (39): scripts, android, android:build:apk, android:build:store, android:build:store-submit, android:submit:store, extension:build, extension:build:chrome (+31 more)

### Community 26 - "EditScreen.tsx"
Cohesion: 0.10
Nodes (28): ClearCompletedTasksModal(), Props, ClearModulesModal(), Props, DeleteModal(), Props, DeleteModuleModal(), Props (+20 more)

### Community 27 - "manifest.json"
Cohesion: 0.06
Nodes (35): action, default_icon, default_popup, default_title, background, service_worker, type, browser_specific_settings (+27 more)

### Community 28 - "detectTauriEnvironment"
Cohesion: 0.13
Nodes (23): expo-screen-capture, applyNativeContentProtection(), applyTauriContentProtection(), ContentProtectionContext, ContentProtectionContextValue, ContentProtectionProvider(), DevModeContext, DevModeContextType (+15 more)

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
Cohesion: 0.10
Nodes (30): expo-updates, react-native-safe-area-context, @tauri-apps/plugin-process, @tauri-apps/plugin-updater, Listener, listeners, publishUpdateCheck(), subscribeUpdateCheck() (+22 more)

### Community 33 - "mergeVaultData.ts"
Cohesion: 0.17
Nodes (23): VaultEntryTombstone, addLatestTombstones(), areSame(), areVaultDataEqual(), clone(), conflictCopyMatchesBaseEntry(), conflictCopyWasDeleted(), entryContentFingerprint() (+15 more)

### Community 34 - "commands.rs"
Cohesion: 0.10
Nodes (10): AUTH_REPLY_SIGNATURE, authenticate_with_system(), BLOCK_HAS_SIGNATURE, CF_UNICODETEXT_FORMAT, get_main_window_hwnd(), LAPOLICY_DEVICE_OWNER_AUTHENTICATION, reset_window_size(), set_content_protection() (+2 more)

### Community 35 - "LoginScreen.tsx"
Cohesion: 0.15
Nodes (36): useToken(), useOnline(), Auth(), Props, FirstOpened(), Props, Step, ShowQRCodeButton() (+28 more)

### Community 36 - "AttachmentModule.tsx"
Cohesion: 0.15
Nodes (21): base64-js, AttachmentModule(), canPreviewAttachment(), downloadBrowserAttachment(), formatBytes(), getAttachmentIcon(), getFileExtension(), getFileNameFromPath() (+13 more)

### Community 37 - "vaultIdentity.ts"
Cohesion: 0.27
Nodes (7): VaultDataType, createVaultId(), ensureVaultId(), normalizeVaultId(), resolveMergedVaultId(), VaultData, VaultIdentityMismatchError

### Community 38 - "state.ts"
Cohesion: 0.12
Nodes (14): buildPromptTitle(), ExtensionState, normalizeIdentity(), PreparedFillRecord, RegisteredFrameInfo, SavePromptEvaluation, SuggestionRowProps, FillDataResult (+6 more)

### Community 39 - "DraggableModulesList.shared.tsx"
Cohesion: 0.16
Nodes (20): NativeDragHandleScrollLockProvider(), WebDragHandlePropsProvider(), dragDropAnimationConfig, DraggableModulesList(), DraggableModulesFooter(), DraggableModulesListProps, draggableModulesListStyles, FooterProps (+12 more)

### Community 40 - "mapKdbxToClavisPass.ts"
Cohesion: 0.15
Nodes (22): kdbxweb, configureKdbxArgon2(), importKdbx(), addCustomField(), addTotpModule(), addValueModule(), binaryToBytes(), binaryWithMetaToAttachment() (+14 more)

### Community 41 - "hotkeys.ts"
Cohesion: 0.17
Nodes (13): ACTIONS, BLOCKED_HOTKEYS, DEFAULT_HOTKEYS, getDefaultHotkeys(), HotkeyAction, hotkeyFromKeyboardEvent(), HotkeyPlatform, HotkeySettings (+5 more)

### Community 42 - "host.rs"
Cohesion: 0.13
Nodes (23): app_scheme(), AssertPasskeyPayload, bridge_result_to_response(), ensure_ready(), FillPayload, handle_request(), is_es256_algorithm(), MatchPasskeysPayload (+15 more)

### Community 43 - "vault.rs"
Cohesion: 0.11
Nodes (39): domain_contains(), entry_match_hosts(), fill_data_for_entry(), FillDataResult, first_string(), FolderRef, has_passkey(), login_entry() (+31 more)

### Community 44 - "Header.tsx"
Cohesion: 0.09
Nodes (27): Common Refactor Targets, Files To Check First, Known Custom Screens, Screen Standardization Context, Standard Checklist, @react-navigation/bottom-tabs, CustomBottomTab(), getActiveRouteName() (+19 more)

### Community 45 - "release.js"
Cohesion: 0.12
Nodes (19): androidGradleHasVersionCode(), androidGradleHasVersionName(), androidStringsHasRuntimeVersion(), cargoLockHasVersion(), cargoTomlHasVersion(), { execSync }, existingTags, filesToUpdate (+11 more)

### Community 46 - "AuthProvider.tsx"
Cohesion: 0.13
Nodes (15): ClavisPass Project Context, Context Files, Core Mental Model, First Runtime Files, High-Risk Areas, AuthContext, AuthContextType, AuthMasterContext (+7 more)

### Community 47 - "useClipboardCopy.ts"
Cohesion: 0.15
Nodes (10): setClipboardText(), clipboardClearScheduler, ClipboardContentKind, clipboardOwnership, fingerprintValue(), OwnedClipboardRecord, TrackClipboardCopyOptions, copyWithAutoClear() (+2 more)

### Community 48 - "CloseBehaviorState"
Cohesion: 0.13
Nodes (10): claim_pending_lock_request(), close_main_window(), CloseBehavior, Exit, Hide, CloseBehaviorState, focus_main_window(), schedule_exit_watchdog() (+2 more)

### Community 49 - "ClavisPass Website Marketing Brief"
Cohesion: 0.05
Nodes (43): Attachments And Previews, Brand Details, Bring Your Own Sync, Browser Extension, Can I import my existing passwords?, Can my cloud provider read my passwords?, ClavisPass Website Marketing Brief, Conversion Priorities (+35 more)

### Community 50 - "bitwarden.ts"
Cohesion: 0.20
Nodes (24): addCardModule(), addCustomField(), addExpiryModule(), addIdentityModules(), addLoginModules(), addNote(), addPasskeyModules(), addSshKeyModule() (+16 more)

### Community 51 - "pairing.rs"
Cohesion: 0.21
Nodes (21): approve_pairing(), evaluate_pairing(), list_paired_clients(), list_pending_pairings(), list_rejected_clients(), load_pairing_store(), now_ms(), optional_identity_matches() (+13 more)

### Community 52 - "vcardExport.ts"
Cohesion: 0.30
Nodes (11): expo-file-system, expo-sharing, buildFormattedName(), buildVCard(), canExportVCard(), clean(), escapeVCardText(), exportVCard() (+3 more)

### Community 53 - "Idee: Identity als persönlicher Hauptscreen"
Cohesion: 0.22
Nodes (8): Datenschutz, Einschätzung, Gestaltungsprinzipien und offene Fragen, Idee: Identity als persönlicher Hauptscreen, Mögliche Ausbaustufen, Mögliche Funktionen, Technischer Ansatz, Ziel

### Community 54 - "VaultProvider.tsx"
Cohesion: 0.07
Nodes (48): Current Vault Format, Implementation Phases, expo-document-picker, OnlineContext, OnlineContextType, Props, UseOnlineResult, useVault() (+40 more)

### Community 55 - "useTheme"
Cohesion: 0.05
Nodes (79): Item Surfaces, Shared Module UI, react-native-gesture-handler, useTheme(), Pattern(), Props, BrowserBridgePairingPrompt(), PairingAction (+71 more)

### Community 57 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, @babel/core, eslint, eslint-config-universe, patch-package, prettier, react-test-renderer, @tauri-apps/cli (+14 more)

### Community 58 - "prepare-msix.js"
Cohesion: 0.10
Nodes (16): appExe, appVersion, assetsOutputDir, createUnplatedTargetSizeIcons(), escapePowerShellSingleQuoted(), fs, manifest, manifestSource (+8 more)

### Community 59 - "model/types.ts"
Cohesion: 0.07
Nodes (38): @react-navigation/native-stack, AddTriggerStackParamList, AppTabsParamList, LoginStackParamList, LogoutStackParamList, RootStackParamList, SettingsStackParamList, AddTriggerStack() (+30 more)

### Community 60 - "screen_lock.rs"
Cohesion: 0.13
Nodes (6): CGSessionCopyCurrentDictionary(), emit(), ScreenLockPayload, Session, start(), wndproc()

### Community 61 - "Crypto Context"
Cohesion: 0.40
Nodes (4): Core Files, Critical Rules, Crypto Context, Verification

### Community 62 - "ClavisPass"
Cohesion: 0.07
Nodes (28): 1. VaultSession (Authoritative & Secret-Capable), 2. VaultProvider (UI-Safe Projection), Authentication & Master Secret Handling, Backend / Plattform, CI / CD & Deployment, ClavisPass, Cryptography & Encryption Model, Defensive Defaults (+20 more)

### Community 63 - "SettingsQuickSelect.tsx"
Cohesion: 0.29
Nodes (7): clampWidth(), Props, SettingsQuickSelect(), styles, QuickSelectItem, DraggableHandle(), HandleProps

### Community 64 - "reactNative.ts"
Cohesion: 0.12
Nodes (12): Animated, AnimatedValue, Dimensions, InteractionManager, Platform, Pressable, ScrollView, StyleSheet (+4 more)

### Community 65 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+11 more)

### Community 66 - "Sync And Storage Context"
Cohesion: 0.25
Nodes (7): Core Files, Providers, Settings Schema, Storage Layers, Sync And Storage Context, Tokens, StoreSchema

### Community 67 - "webauthn.rs"
Cohesion: 0.10
Nodes (31): AssertionAuthenticatorResponse, AssertionPublicKeyCredential, AssertionSigningContext, base64url_decode(), base64url_encode(), base64url_round_trips_without_padding(), build_assertion_authenticator_data(), build_assertion_public_key_credential() (+23 more)

### Community 68 - "useAuth"
Cohesion: 0.12
Nodes (22): Props, ProtectedRoute(), styles, getFocusedRouteName(), NavigationnContainer(), titlebarContentDragRoutes, LoginStack(), TabNavigator() (+14 more)

### Community 69 - "reactNativePaper.tsx"
Cohesion: 0.11
Nodes (14): ActivityIndicator, baseColors, Button, Chip, Divider, Icon, IconButton, MD3DarkTheme (+6 more)

### Community 71 - "TemplateEnum"
Cohesion: 0.15
Nodes (13): TemplateEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+5 more)

### Community 72 - "appScheme.test.ts"
Cohesion: 0.43
Nodes (5): getAppRedirectUri(), getAppScheme(), Constants, resetExpoConfig(), setExpoConfig()

### Community 73 - "Datenschutzerklärung"
Cohesion: 0.09
Nodes (22): 10. Browser-Erweiterung, 11. Benachrichtigungen, 12. Kontaktaufnahme, 13. Webseite und Hosting, 14. Cookies, Tracking und Analytics, 15. App Stores und Download-Plattformen, 16. Rechtsgrundlagen, 17. Speicherdauer (+14 more)

### Community 74 - "autofill-preferences.ts"
Cohesion: 0.25
Nodes (13): buildPreferenceResult(), DEFAULT_POLICY, DomainPolicyStore, normalizeHost(), normalizeMode(), normalizePolicy(), readPolicyStore(), setInlineAutofillDisabledForHost() (+5 more)

### Community 75 - "AttachmentPreviewScreen.native.tsx"
Cohesion: 0.19
Nodes (15): expo-image, getAttachmentPreview(), AttachmentPreviewScreen(), AttachmentPreviewScreenProps, getDataUri(), getExtension(), iframeStyle, AttachmentPreviewScreen() (+7 more)

### Community 76 - "Privacy Policy"
Cohesion: 0.09
Nodes (22): 10. Browser Extension, 11. Notifications, 12. Contact, 13. Website And Hosting, 14. Cookies, Tracking And Analytics, 15. App Stores And Download Platforms, 16. Legal Bases, 17. Retention (+14 more)

### Community 77 - "decryptVaultContent.ts"
Cohesion: 0.17
Nodes (13): VaultDataTypeSchema, getEmptyData(), DecryptVaultContentResult, makeV1AadBytes(), te, V1_AAD_OBJECT, VaultV1, VaultV1Schema (+5 more)

### Community 78 - "Nutzungsbedingungen"
Cohesion: 0.10
Nodes (20): 10. Erlaubte Nutzung, 11. Open Source und Lizenzen, 12. Kosten, 13. Drittanbieter, 14. Updates, 15. Haftung, 16. Beendigung der Nutzung, 17. Änderungen (+12 more)

### Community 79 - "reservePasskeyAssertion.ts"
Cohesion: 0.24
Nodes (9): normalizeCredentialId(), normalizeRpId(), reservePasskeyAssertion(), ReservePasskeyAssertionPayload, payload, validCounter(), PasskeyModuleType, PasskeyModuleTypeSchema (+1 more)

### Community 80 - "prepare-native-host-sidecar.js"
Cohesion: 0.15
Nodes (12): cargoArgs, { copyFileSync, existsSync, mkdirSync, writeFileSync }, detectHostTriple(), { execFileSync }, { join, resolve }, manifestPath, outputDir, outputPath (+4 more)

### Community 81 - "NoteModule.tsx"
Cohesion: 0.10
Nodes (23): JsonLine(), NoteCodePreview(), Props, styles, InlinePart, InlineText(), NoteMarkdownPreview(), parseInline() (+15 more)

### Community 82 - "rnSodiumProvider.ts"
Cohesion: 0.14
Nodes (11): libsodium-wrappers-sumo, react-native-sodium-jsi, getCryptoProvider(), getCryptoProvider(), rnSodiumProvider, td, te, verifyProviderInDev() (+3 more)

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
Cohesion: 0.10
Nodes (29): App(), AppShell(), AppWithNavigation(), DemoBootstrap(), getCurrentWindowSafe(), MainWindowReadySignal(), withAlpha(), OnlineProvider() (+21 more)

### Community 88 - "complete_request"
Cohesion: 0.39
Nodes (8): bridge_dir(), BRIDGE_ENV_KEY, ensure_dir(), pairing_store_path(), platform_base_dir(), write_request_store_path(), write_result_store_path(), complete_request()

### Community 89 - "bridge_commands.rs"
Cohesion: 0.15
Nodes (8): bridge_approve_pairing(), bridge_claim_pending_writes(), bridge_complete_write_request(), bridge_list_paired_clients(), bridge_list_pending_pairings(), bridge_list_rejected_clients(), bridge_publish_session(), bridge_reject_pairing()

### Community 90 - "Terms Of Use"
Cohesion: 0.10
Nodes (20): 10. Permitted Use, 11. Open Source And Licenses, 12. Costs, 13. Third-Party Providers, 14. Updates, 15. Liability, 16. Ending Use, 17. Changes (+12 more)

### Community 91 - "UI Context"
Cohesion: 0.22
Nodes (8): i18n, Important Files, Interaction Polish, Menus And Dropdowns, Platform Model, Related UI Context, Titlebar And Chrome, UI Context

### Community 92 - "deriveIdentityClusters.ts"
Cohesion: 0.29
Nodes (11): buildPasswordUseCounts(), deriveIdentityClusters(), entryHasSimplePasswordRisk(), getEntryDomains(), getEntryModuleTypes(), getEntryPasswordValues(), getEntrySignals(), getModuleValue() (+3 more)

### Community 93 - "check-tauri-version-sync.js"
Cohesion: 0.24
Nodes (11): collectMismatches(), fs, getMajorMinor(), getNpmLockVersion(), mismatches, parseCargoLockVersions(), path, readJson() (+3 more)

### Community 94 - "prepare-sodium-16kb.js"
Cohesion: 0.15
Nodes (12): download(), findEndOfCentralDirectory(), fs, https, main(), os, path, readZipEntries() (+4 more)

### Community 95 - "ClavisPass Product Strategy Roadmap"
Cohesion: 0.11
Nodes (17): 1. Browser Extension Polish, 2. Passkeys, 3. Emergency Access / Trusted Contact, 4. Optional Web App, 5. Separate Secrets Sharing SaaS, Bitwarden Gaps To Treat As Strategic, ClavisPass Personal, ClavisPass Product Strategy Roadmap (+9 more)

### Community 96 - "ModalSurface"
Cohesion: 0.08
Nodes (33): react-qr-code, Props, CustomFieldInputType, EditCustomFieldModal(), Props, ACTION_ICON, EditHistoryModal(), Props (+25 more)

### Community 97 - "bundle"
Cohesion: 0.17
Nodes (12): bundle, active, category, copyright, createUpdaterArtifacts, externalBin, fileAssociations, icon (+4 more)

### Community 98 - "ValuesType.ts"
Cohesion: 0.08
Nodes (37): papaparse, applyUpdateToEntry(), BrowserBridgeWriteSync(), BrowserWriteKind, BrowserWriteRequest, createBrowserEntry(), CreatePayload, effectiveUrl() (+29 more)

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
Cohesion: 0.05
Nodes (40): BrandHeaderProps, react-native-reanimated, react-native-svg, FilterItem, FiltersNarrowProps, FiltersWide, FiltersWideProps, styles (+32 more)

### Community 106 - "plugins"
Cohesion: 0.20
Nodes (10): args, customProtocol, plugins, cli, deepLink, updater, endpoints, pubkey (+2 more)

### Community 107 - "editHistory.ts"
Cohesion: 0.26
Nodes (11): Editor(), appendLog(), areValuesEqual(), cloneValue(), createLogEntry(), EditHistoryMeta, HistoryEntry, HistoryState (+3 more)

### Community 108 - "AddValueModal.tsx"
Cohesion: 0.12
Nodes (16): CategoryItem(), AddValueModal(), Props, ValueIconsEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD (+8 more)

### Community 109 - "CloudStorageClient.ts"
Cohesion: 0.09
Nodes (37): @tauri-apps/plugin-fs, fetchFile(), fetchUserInfo(), refreshAccessToken(), uploadFile(), buildMultipartBody(), escapeDriveQueryString(), fetchFile() (+29 more)

### Community 110 - "Vault V2 Key Envelope Roadmap"
Cohesion: 0.18
Nodes (10): Current V1 Behavior, Envelope Design Notes, Goal, Master Password Change, Migration Strategy, Non-Goals, Session Boundary, Testing Plan (+2 more)

### Community 111 - "fill.ts"
Cohesion: 0.30
Nodes (11): applyTargets(), buildNoFieldsResult(), collectFillTargets(), emitInputEvents(), executeFill(), FillPreviewResult, FillSnapshot, FillTarget (+3 more)

### Community 112 - "Login.tsx"
Cohesion: 0.13
Nodes (29): expo-local-authentication, react-native-progress, CloudProvider(), isInvalidGrant(), OAuthRefreshError, Props, StoredAuth, TokenContext (+21 more)

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

### Community 118 - "GoogleDriveLoginButton.tsx"
Cohesion: 0.08
Nodes (38): expo-auth-session, expo-random, expo-web-browser, @fabianlars/tauri-plugin-oauth, ANDROID_AUTH_PROMPT_OPTIONS, getMobileRedirectUri(), randState(), SCOPES (+30 more)

### Community 119 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, moduleResolution, strict, exclude, extends

### Community 120 - "Store Release Roadmap"
Cohesion: 0.17
Nodes (11): Apple Developer Program, Arratel Setup Plan, Chrome Web Store, Goals, Google Play, Microsoft Store, Publisher Naming, References (+3 more)

### Community 121 - "native_host_registration.rs"
Cohesion: 0.19
Nodes (10): CHROME_EXTENSION_IDS, chromium_origins(), CREATE_NO_WINDOW, EDGE_EXTENSION_IDS, find_native_host_exe(), FIREFOX_EXTENSION_ID, native_host_candidates(), NATIVE_HOST_NAME (+2 more)

### Community 122 - "ObjcId"
Cohesion: 0.23
Nodes (15): authenticate_with_system_impl(), _Block_copy(), _Block_release(), check_system_auth_available(), cstring(), new_la_context(), _NSConcreteStackBlock, objc_class() (+7 more)

### Community 123 - "DeviceStorageClient.ts"
Cohesion: 0.38
Nodes (11): fetchFile(), getActiveLocalVaultIdKey(), getLocalSyncKey(), getLocalSyncMetadataKey(), getVaultLocalSyncKey(), getVaultLocalSyncMetadataKey(), LocalSyncMetadata, readLocalSyncMetadata() (+3 more)

### Community 124 - "domain.ts"
Cohesion: 0.24
Nodes (11): loadPasskeyCandidatesForWebAuthnRequest(), buildEntrySuggestions(), normalizeHost(), normalizeLookupHost(), normalizeRpHost(), safeUrl(), scoreUrlMatch(), searchEntries() (+3 more)

### Community 125 - "serve-webauthn-test-page.js"
Cohesion: 0.25
Nodes (4): __dirname, pagePath, port, server

### Community 126 - "SettingsScreen.tsx"
Cohesion: 0.07
Nodes (37): expo-constants, expo-linking, @gorhom/bottom-sheet, simple-icons, @tauri-apps/plugin-dialog, @tauri-apps/plugin-shell, useContentProtection(), useDevMode() (+29 more)

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

### Community 137 - "GlobalClipboardSnackbar.tsx"
Cohesion: 0.38
Nodes (7): Handler, handlers, subscribeClipboardCopied(), unsubscribeClipboardCopied(), ClipboardCopyPayload, GlobalClipboardSnackbar(), msToSecCeil()

### Community 138 - "container/AnimatedOpacityContainer.tsx"
Cohesion: 0.31
Nodes (6): AnimatedOpacityContainer(), Props, AnimatedOpacityContainerWeb(), Props, Props, AnimatedOpacityContainer()

### Community 141 - "IdentityDetailScreen.tsx"
Cohesion: 0.10
Nodes (34): @hello-pangea/dnd, react-native-draggable-flatlist, IdentityStackParamList, Stack, IdentityEmailLogo(), getDefaultIdentityName(), ModulesType, countIdentityDomains() (+26 more)

### Community 142 - "linux"
Cohesion: 0.67
Nodes (3): linux, depends, deb

### Community 144 - "AddModuleModal.tsx"
Cohesion: 0.21
Nodes (10): AddModuleModalCompactFav(), defineModules(), IdsOf, MissingIds, ModuleCategory, ModuleMeta, ModuleTile(), Props (+2 more)

### Community 171 - "withIosGoogleOAuthScheme.js"
Cohesion: 0.43
Nodes (5): ensureUrlScheme(), normalizeClientId(), {
  ensureUrlScheme,
  toReverseClientIdScheme,
}, toReverseClientIdScheme(), { withInfoPlist }

### Community 172 - "browser-extension/package.json"
Cohesion: 0.17
Nodes (11): react, react-dom, @types/react, @types/react-dom, typescript, name, private, type (+3 more)

### Community 174 - "TotpModule.tsx"
Cohesion: 0.29
Nodes (8): otpauth, styles, Totp(), TotpModule(), TotpModuleModuleProps, codeFromUri(), parseOtpauth(), TotpAlgo

### Community 175 - "Firefox Store Release Notes"
Cohesion: 0.25
Nodes (7): Extension Identity, Firefox Store Release Notes, Listing, Pre-Submit Check, Privacy Policy Draft, Release Artifacts, Reviewer Notes

### Community 176 - "ClavisPass Agent Context"
Cohesion: 0.29
Nodes (6): Always Know, ClavisPass Agent Context, Context Routing, Fast Map, graphify, High-Risk Rules

### Community 178 - "ClavisPass Firefox Add-on Reviewer Build"
Cohesion: 0.33
Nodes (5): Build Steps, ClavisPass Firefox Add-on Reviewer Build, Environment, Firefox Add-on ID, Native Messaging Notes

### Community 179 - "AuthReplyBlock"
Cohesion: 0.25
Nodes (5): auth_reply(), AUTH_REPLY_DESCRIPTOR, AuthReplyBlock, AuthState, BlockDescriptor

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

### Community 184 - "content-messages.ts"
Cohesion: 0.29
Nodes (6): ContentMessage, ContentMessageMap, ContentMessageType, ContentRequestFor, ContentResponseFor, ContentDebugInfo

### Community 185 - "CustomTitlebar.tsx"
Cohesion: 0.13
Nodes (16): Chrome And Drag Regions, Core Files, Desktop And Tauri Context, Fast Access, Runtime Model, Tauri Responsibilities, showMainWindow(), StartBehavior (+8 more)

### Community 189 - "Security And Vault Context"
Cohesion: 0.29
Nodes (6): Core Files, Master Password Lifetime, Module Policy, Security And Vault Context, UI-Safe Metadata, Vault Session Boundary

### Community 190 - "Vault Modules Context"
Cohesion: 0.40
Nodes (4): Important Boundaries, Reorder Flows, Vault Modules Context, Verification

### Community 191 - "CardDetailsScreen.tsx"
Cohesion: 0.21
Nodes (14): Applying a preset, Catalog, Verification, Website presets, buildFaviconUrl(), DigitalCardPalette, getHostnameLabel(), getReadableTextColor() (+6 more)

### Community 193 - "v2/aad.ts"
Cohesion: 0.50
Nodes (3): te, V2_KEYWRAP_AAD_OBJECT, V2_PAYLOAD_AAD_OBJECT

### Community 194 - "generatePassword.ts"
Cohesion: 0.29
Nodes (5): generatePassword(), LOWERCASE_CHAR_CODES, NUMBER_CHAR_CODES, SYMBOL_CHAR_CODES, UPPERCASE_CHAR_CODES

### Community 195 - "dependencies"
Cohesion: 0.50
Nodes (4): dependencies, react, react-dom, tldts

## Knowledge Gaps
- **130 isolated node(s):** `react`, `react-dom`, `@types/chrome`, `@types/react`, `@types/react-dom` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1711 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **45 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `getModule.tsx`, `modulePolicy.ts`, `package.json`, `store.ts`, `ClavisPassHubClient.ts`, `HomeScreen.tsx`, `vaultIdentity.ts`, `DraggableModulesList.shared.tsx`, `hotkeys.ts`, `withIosGoogleOAuthScheme.js`, `bitwarden.ts`, `vite.config.ts`, `model/types.ts`, `generatePassword.ts`, `appScheme.test.ts`, `decryptVaultContent.ts`, `reservePasskeyAssertion.ts`, `App.tsx`, `deriveIdentityClusters.ts`, `ValuesType.ts`, `CloudStorageClient.ts`, `GoogleDriveLoginButton.tsx`, `DeviceStorageClient.ts`, `domain.ts`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **What connects `react`, `react-dom`, `@types/chrome` to the rest of the system?**
  _130 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.01904761904761905 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `getModule.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.04603669089650398 - nodes in this community are weakly interconnected._
- **Why does `useTheme()` connect `useTheme` to `ListItem.tsx`, `react-native`, `AnalysisDetailScreen.tsx`, `GlobalClipboardSnackbar.tsx`, `IdentityDetailScreen.tsx`, `react-native-paper`, `AddModuleModal.tsx`, `vitest`, `Header`, `FastAccess.ts`, `HomeScreen.tsx`, `EditScreen.tsx`, `detectTauriEnvironment`, `UpdateManager.tsx`, `LoginScreen.tsx`, `AttachmentModule.tsx`, `Header.tsx`, `TotpModule.tsx`, `VaultProvider.tsx`, `CustomTitlebar.tsx`, `model/types.ts`, `SettingsQuickSelect.tsx`, `CardDetailsScreen.tsx`, `useAuth`, `AttachmentPreviewScreen.native.tsx`, `NoteModule.tsx`, `App.tsx`, `ModalSurface`, `ref_react`, `AddValueModal.tsx`, `CloudStorageClient.ts`, `Login.tsx`, `SettingsScreen.tsx`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0273972602739726 - nodes in this community are weakly interconnected._
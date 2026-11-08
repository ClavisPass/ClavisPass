# Graph Report - ClavisPass  (2026-11-09)

## Corpus Check
- 588 files · ~363,173 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 37 file(s) not represented in the graph (top: .xml 11, (none) 8, .properties 2)

## Summary
- 4009 nodes · 11098 edges · 203 communities (157 shown, 46 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 165 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ef976b12`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CryptoProvider
- dependencies
- ModulesEnum.ts
- modulePolicy.ts
- package.json
- ModulesEnum
- EditScreen.tsx
- SettingsDropdownItem.tsx
- ThemeProvider.tsx
- AnalysisDetailScreen.tsx
- store.ts
- content/index.ts
- shared/types.ts
- popup/App.tsx
- react-i18next
- background/index.ts
- background/bridge.ts
- DeviceStorageClient.ts
- model/types.ts
- detectTauriEnvironment
- shared/bridge.ts
- expo
- ClavisPassHubClient.ts
- HomeScreen.tsx
- write.rs
- scripts
- VaultProvider.tsx
- manifest.json
- isTauri.ts
- forms.ts
- lib.rs
- ClavisPass Native Messaging Bridge
- UpdateManager.tsx
- mergeVaultData.ts
- commands.rs
- LoginScreen.tsx
- AttachmentModule.tsx
- Button.tsx
- state.ts
- ModulesList.tsx
- ValuesType.ts
- CloudProvider.tsx
- host.rs
- vault.rs
- RecoveryCodesModule.tsx
- release.js
- AuthProvider.tsx
- hotkeys.ts
- AnalysisScreen.tsx
- ClavisPass Website Marketing Brief
- bitwarden.ts
- pairing.rs
- TotpModule.tsx
- Idee: Identity als persönlicher Hauptscreen
- useVault
- useTheme
- vite.config.ts
- devDependencies
- prepare-msix.js
- CreditCardModule.tsx
- screen_lock.rs
- Crypto Context
- ClavisPass
- vcardExport.ts
- reactNative.ts
- compilerOptions
- vitest
- webauthn.rs
- NavigationContainer.tsx
- reactNativePaper.tsx
- MainApplication.kt
- AddValueModal.tsx
- appScheme.test.ts
- Datenschutzerklärung
- autofill-preferences.ts
- analysisEngine.ts
- Privacy Policy
- FilterAnalysisModal.tsx
- Nutzungsbedingungen
- reservePasskeyAssertion.ts
- prepare-native-host-sidecar.js
- getModule.tsx
- HotkeyRecorderItem.tsx
- MainActivity.kt
- session.rs
- scripts
- protocol.rs
- App.tsx
- path.rs
- bridge_commands.rs
- Terms Of Use
- UI Context
- DigitalCardModule.tsx
- check-tauri-version-sync.js
- prepare-sodium-16kb.js
- ClavisPass Product Strategy Roadmap
- Modal
- bundle
- AnimatedLogo.tsx
- deriveIdentityClusters.ts
- tab-context.ts
- i18n/index.ts
- tauri.conf.json
- withAndroidApplicationId.js
- build-web-demo.js
- ref_react
- plugins
- editHistory.ts
- ValueIconsEnum
- GoogleDriveClient.ts
- SettingsQuickSelect.tsx
- fill.ts
- riskModel.ts
- ClavisPass Passkey Management Roadmap
- reactNativeReanimated.tsx
- reactNavigationNative.ts
- devDependencies
- compilerOptions
- GoogleDriveLoginButton.tsx
- tsconfig.json
- Store Release Roadmap
- native_host_registration.rs
- TabNavigator.tsx
- errorBus.ts
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
- Sync And Storage Context
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
- ExpiryNotificationScheduler.tsx
- generate-webauthn-test-passkey.js
- ClavisPass Firefox Add-on Reviewer Build
- CachedAnalysisItem.ts
- Bitwarden Import Roadmap
- Agent Workflow Context
- Build, Release, And Update Context
- Identity Context
- ContentProtectionProvider.tsx
- Desktop And Tauri Context
- CLAUDE.md
- .claude/CLAUDE.md
- AddTriggerStack.tsx
- ClavisPassHubDiscoveryResult.ts
- CardItem.tsx
- pkce.web.ts
- content-messages.ts
- generatePassword.ts
- dependencies
- BrandHeader.tsx
- pinnedEntries.ts
- Import.tsx
- ExpiryModule.tsx
- InlineNotice.tsx
- DropdownLayer.web.tsx
- expoVectorIcons.tsx

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 274 edges
2. `react-native` - 186 edges
3. `react-native-paper` - 131 edges
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
- `Applying a preset` --references--> `buildFaviconUrl()`  [INFERRED]
  docs/website-presets.md → src/features/vault/utils/digitalCardTheme.ts

## Import Cycles
- None detected.

## Communities (203 total, 46 thin omitted)

### Community 0 - "CryptoProvider"
Cohesion: 0.08
Nodes (30): base64-js, libsodium-wrappers-sumo, react-native-sodium-jsi, CryptoProvider, getCryptoProvider(), rnSodiumProvider, td, te (+22 more)

### Community 1 - "dependencies"
Cohesion: 0.02
Nodes (105): dependencies, argon2-browser, @babel/plugin-proposal-export-namespace-from, base64-js, crypto-js, expo, expo-auth-session, expo-blur (+97 more)

### Community 2 - "ModulesEnum.ts"
Cohesion: 0.05
Nodes (63): zod, TaskModule(), AddressModuleType, AddressModuleTypeSchema, regex, AttachmentFileSchema, AttachmentModuleType, AttachmentModuleTypeSchema (+55 more)

### Community 3 - "modulePolicy.ts"
Cohesion: 0.05
Nodes (41): Always Know, ClavisPass Agent Context, Context Routing, Fast Map, graphify, High-Risk Rules, Core Files, Master Password Lifetime (+33 more)

### Community 4 - "package.json"
Cohesion: 0.03
Nodes (76): react, react-dom, @types/react, @types/react-dom, typescript, main, name, private (+68 more)

### Community 5 - "ModulesEnum"
Cohesion: 0.07
Nodes (26): ModulesEnum, ADDRESS, ATTACHMENT, COMPANY, CREDIT_CARD, CUSTOM_FIELD, DIGITAL_CARD, DOCUMENT (+18 more)

### Community 6 - "EditScreen.tsx"
Cohesion: 0.07
Nodes (61): expo-image, extractFastAccessObject(), FolderFilter(), Props, styles, ellipsize(), failedFaviconUrls, ListItem() (+53 more)

### Community 7 - "SettingsDropdownItem.tsx"
Cohesion: 0.26
Nodes (9): useContentProtection(), ContentProtectionSettingsToggle(), Props, SettingInfo, SettingInfoButton(), Props, Props, SettingsSwitch() (+1 more)

### Community 8 - "ThemeProvider.tsx"
Cohesion: 0.06
Nodes (39): react-native-circular-progress, react-native-gesture-handler, react-native-paper, Props, ThemeContext, ThemeContextType, AnalysisEntry(), Props (+31 more)

### Community 9 - "AnalysisDetailScreen.tsx"
Cohesion: 0.16
Nodes (18): useAuthMaster(), deriveAnalysisPepperFromMaster(), getPasswordStrengthColor(), AnalysisDetailScreen(), AnalysisDetailScreenProps, analyzeCharacterComposition(), buildStrengthVsRiskExplanation(), buildWhyRisky() (+10 more)

### Community 10 - "store.ts"
Cohesion: 0.13
Nodes (21): BooleanDef, DataKey, DEVICE_RESET_KEYS, EnumDef, get(), isModulesEnumValue(), JsonDef, listeners (+13 more)

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
Cohesion: 0.17
Nodes (18): react-i18next, ModuleContainerProps, moduleStyles, AddressState, CompanyState, CustomFieldInputType, DocumentState, styles (+10 more)

### Community 15 - "background/index.ts"
Cohesion: 0.09
Nodes (54): clearAutofillDomainCache(), countPasswordSuggestions(), countVisibleSuggestions(), DomainAutofillCache, DomainAutofillCacheEntry, getAutofillEligibilityForUrl(), getCachedAutofillMatchCountForUrl(), getCachedMatchCount() (+46 more)

### Community 16 - "background/bridge.ts"
Cohesion: 0.12
Nodes (26): Desktop bridge, deriveAppState(), DesktopBridgeService, getStoredPairingStatus(), normalizeAssertionCredential(), normalizeDesktopStatus(), normalizeFillData(), normalizePasskeyMetadata() (+18 more)

### Community 17 - "DeviceStorageClient.ts"
Cohesion: 0.14
Nodes (27): @react-native-async-storage/async-storage, Props, UserInfoProps, fetchFile(), getActiveLocalVaultIdKey(), getLocalSyncKey(), getLocalSyncMetadataKey(), getVaultLocalSyncKey() (+19 more)

### Community 18 - "model/types.ts"
Cohesion: 0.06
Nodes (73): Standard Screen Structure, expo-camera, @hello-pangea/dnd, react-native-draggable-flatlist, @react-navigation/native, @react-navigation/native-stack, HomeStackParamList, RootStackParamList (+65 more)

### Community 19 - "detectTauriEnvironment"
Cohesion: 0.10
Nodes (44): @tauri-apps/api, invokeTauriSystemAuth(), invokeTauriSystemAuthAvailable(), isSystemAuthenticationAvailable(), FastAccessSessionBridge(), FAST_ACCESS_NOTIFICATION_CATEGORY, FAST_ACCESS_POPUP_LABEL, FAST_ACCESS_POSITION_CHANGED_EVENT (+36 more)

### Community 20 - "shared/bridge.ts"
Cohesion: 0.12
Nodes (25): NativeMessagingClient, NativeMessagingError, toBridgeError(), validateBridgeResponse(), withTimeout(), createInstanceId(), getBridgeClientInfo(), getBrowserDisplayName() (+17 more)

### Community 21 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, adaptiveIcon, blockedPermissions, package, permissions, versionCode, projectId (+31 more)

### Community 22 - "ClavisPassHubClient.ts"
Cohesion: 0.12
Nodes (39): calculateExpiresIn(), checkDiscovery(), createHubError(), createHubErrorFromPayload(), DiscoveryResponse, ensureVaultEtagForUpload(), fetchFile(), fetchUserInfo() (+31 more)

### Community 23 - "HomeScreen.tsx"
Cohesion: 0.11
Nodes (31): @gorhom/bottom-sheet, @react-native-masked-view/masked-view, CloudProvider(), Login(), Props, authenticateUser(), isUsingAuthentication(), loadAuthentication() (+23 more)

### Community 24 - "write.rs"
Cohesion: 0.10
Nodes (35): as_io_error(), BrowserWriteKind, CreateEntryFromBrowser, ReservePasskeyAssertion, UpdateEntryFromBrowser, BrowserWriteRequest, BrowserWriteRequestStore, BrowserWriteResult (+27 more)

### Community 25 - "scripts"
Cohesion: 0.05
Nodes (39): scripts, android, android:build:apk, android:build:store, android:build:store-submit, android:submit:store, extension:build, extension:build:chrome (+31 more)

### Community 26 - "VaultProvider.tsx"
Cohesion: 0.10
Nodes (26): Current Vault Format, Implementation Phases, VaultContext, VaultData, BackupImportButton(), VaultDataType, VaultDataTypeSchema, VaultEntryTombstoneSchema (+18 more)

### Community 27 - "manifest.json"
Cohesion: 0.06
Nodes (35): action, default_icon, default_popup, default_title, background, service_worker, type, browser_specific_settings (+27 more)

### Community 28 - "isTauri.ts"
Cohesion: 0.09
Nodes (27): getClipboardText(), setClipboardText(), tryNavigatorReadText(), tryNavigatorWriteText(), clipboardClearScheduler, ClipboardContentKind, clipboardOwnership, fingerprintValue() (+19 more)

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
Cohesion: 0.14
Nodes (22): expo-updates, react-native-safe-area-context, @tauri-apps/plugin-process, @tauri-apps/plugin-updater, Listener, listeners, publishUpdateCheck(), subscribeUpdateCheck() (+14 more)

### Community 33 - "mergeVaultData.ts"
Cohesion: 0.12
Nodes (28): VaultEntryTombstone, addLatestTombstones(), areSame(), clone(), conflictCopyMatchesBaseEntry(), conflictCopyWasDeleted(), entryContentFingerprint(), entryIsDeletedBy() (+20 more)

### Community 34 - "commands.rs"
Cohesion: 0.05
Nodes (40): auth_reply(), AUTH_REPLY_DESCRIPTOR, AUTH_REPLY_SIGNATURE, authenticate_with_system(), authenticate_with_system_impl(), AuthReplyBlock, AuthState, _Block_copy() (+32 more)

### Community 35 - "LoginScreen.tsx"
Cohesion: 0.14
Nodes (34): expo-network, LoginStackParamList, useToken(), OnlineContext, OnlineContextType, Props, useOnline(), UseOnlineResult (+26 more)

### Community 36 - "AttachmentModule.tsx"
Cohesion: 0.17
Nodes (20): @tauri-apps/plugin-dialog, @tauri-apps/plugin-fs, Import(), AttachmentModule(), canPreviewAttachment(), downloadBrowserAttachment(), formatBytes(), getAttachmentIcon() (+12 more)

### Community 37 - "Button.tsx"
Cohesion: 0.17
Nodes (14): expo-linear-gradient, react-native-vector-icons, DevModeContext, DevModeContextType, Props, useDevMode(), AnalysisEntryGradient(), Props (+6 more)

### Community 38 - "state.ts"
Cohesion: 0.12
Nodes (14): buildPromptTitle(), ExtensionState, normalizeIdentity(), PreparedFillRecord, RegisteredFrameInfo, SavePromptEvaluation, SuggestionRowProps, FillDataResult (+6 more)

### Community 39 - "ModulesList.tsx"
Cohesion: 0.14
Nodes (19): Important Boundaries, Reorder Flows, Shared Module UI, Vault Modules Context, Verification, DraggableModulesList(), DraggableModulesFooter(), reorderModules() (+11 more)

### Community 40 - "ValuesType.ts"
Cohesion: 0.10
Nodes (32): kdbxweb, papaparse, configureKdbxArgon2(), importKdbx(), addCustomField(), addTotpModule(), addValueModule(), binaryToBytes() (+24 more)

### Community 41 - "CloudProvider.tsx"
Cohesion: 0.17
Nodes (13): isInvalidGrant(), OAuthRefreshError, Props, StoredAuth, TokenContext, TokenContextValue, Props, FetchFileParams (+5 more)

### Community 42 - "host.rs"
Cohesion: 0.13
Nodes (23): app_scheme(), AssertPasskeyPayload, bridge_result_to_response(), ensure_ready(), FillPayload, handle_request(), is_es256_algorithm(), MatchPasskeysPayload (+15 more)

### Community 43 - "vault.rs"
Cohesion: 0.11
Nodes (39): domain_contains(), entry_match_hosts(), fill_data_for_entry(), FillDataResult, first_string(), FolderRef, has_passkey(), login_entry() (+31 more)

### Community 44 - "RecoveryCodesModule.tsx"
Cohesion: 0.15
Nodes (15): FastAccessType, FastAccessTypeSchema, RecoveryCodesModule(), splitKeepingRemainder(), styles, tokenize(), Props, QuickSelect() (+7 more)

### Community 45 - "release.js"
Cohesion: 0.12
Nodes (19): androidGradleHasVersionCode(), androidGradleHasVersionName(), androidStringsHasRuntimeVersion(), cargoLockHasVersion(), cargoTomlHasVersion(), { execSync }, existingTags, filesToUpdate (+11 more)

### Community 46 - "AuthProvider.tsx"
Cohesion: 0.23
Nodes (9): AuthContext, AuthContextType, AuthMasterContext, AuthMasterContextType, Props, ScreenLockLogoutController, initScreenLockLogout(), ListenFn (+1 more)

### Community 47 - "hotkeys.ts"
Cohesion: 0.20
Nodes (12): ACTIONS, BLOCKED_HOTKEYS, DEFAULT_HOTKEYS, getDefaultHotkeys(), hotkeyFromKeyboardEvent(), HotkeyPlatform, isAllowedHotkey(), MACOS_DEFAULT_HOTKEYS (+4 more)

### Community 48 - "AnalysisScreen.tsx"
Cohesion: 0.08
Nodes (33): Standard Checklist, Chips, Compact Search Behavior, Content Panels, Current Visual Direction, Headers, UI Patterns Context, Verification (+25 more)

### Community 49 - "ClavisPass Website Marketing Brief"
Cohesion: 0.05
Nodes (43): Attachments And Previews, Brand Details, Bring Your Own Sync, Browser Extension, Can I import my existing passwords?, Can my cloud provider read my passwords?, ClavisPass Website Marketing Brief, Conversion Priorities (+35 more)

### Community 50 - "bitwarden.ts"
Cohesion: 0.18
Nodes (23): addCardModule(), addCustomField(), addExpiryModule(), addIdentityModules(), addLoginModules(), addNote(), addPasskeyModules(), addSshKeyModule() (+15 more)

### Community 51 - "pairing.rs"
Cohesion: 0.21
Nodes (21): approve_pairing(), evaluate_pairing(), list_paired_clients(), list_pending_pairings(), list_rejected_clients(), load_pairing_store(), now_ms(), optional_identity_matches() (+13 more)

### Community 52 - "TotpModule.tsx"
Cohesion: 0.26
Nodes (9): otpauth, styles, Totp(), TotpModule(), TotpModuleModuleProps, TotpModuleType, codeFromUri(), parseOtpauth() (+1 more)

### Community 53 - "Idee: Identity als persönlicher Hauptscreen"
Cohesion: 0.22
Nodes (8): Datenschutz, Einschätzung, Gestaltungsprinzipien und offene Fragen, Idee: Identity als persönlicher Hauptscreen, Mögliche Ausbaustufen, Mögliche Funktionen, Technischer Ansatz, Ziel

### Community 54 - "useVault"
Cohesion: 0.08
Nodes (49): useAuth(), useVault(), BrowserBridgeSessionSync(), applyUpdateToEntry(), BrowserBridgeWriteSync(), BrowserWriteKind, BrowserWriteRequest, createBrowserEntry() (+41 more)

### Community 55 - "useTheme"
Cohesion: 0.07
Nodes (53): Item Surfaces, @monaco-editor/react, useTheme(), BrowserBridgePairingPrompt(), PairingAction, PromptButton(), styles, DarkModeSwitch() (+45 more)

### Community 57 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, @babel/core, eslint, eslint-config-universe, patch-package, prettier, react-test-renderer, @tauri-apps/cli (+14 more)

### Community 58 - "prepare-msix.js"
Cohesion: 0.10
Nodes (16): appExe, appVersion, assetsOutputDir, createUnplatedTargetSizeIcons(), escapePowerShellSingleQuoted(), fs, manifest, manifestSource (+8 more)

### Community 59 - "CreditCardModule.tsx"
Cohesion: 0.28
Nodes (13): CreditCardModule(), CreditCardState, detectCardBrand(), digitsOnly(), formatCardNumber(), maskCardNumber(), passesLuhn(), CreditCardModuleType (+5 more)

### Community 60 - "screen_lock.rs"
Cohesion: 0.11
Nodes (8): DeviceIdentity, get_device_identity(), CGSessionCopyCurrentDictionary(), emit(), ScreenLockPayload, Session, start(), wndproc()

### Community 61 - "Crypto Context"
Cohesion: 0.40
Nodes (4): Core Files, Critical Rules, Crypto Context, Verification

### Community 62 - "ClavisPass"
Cohesion: 0.07
Nodes (28): 1. VaultSession (Authoritative & Secret-Capable), 2. VaultProvider (UI-Safe Projection), Authentication & Master Secret Handling, Backend / Plattform, CI / CD & Deployment, ClavisPass, Cryptography & Encryption Model, Defensive Defaults (+20 more)

### Community 63 - "vcardExport.ts"
Cohesion: 0.30
Nodes (11): expo-file-system, expo-sharing, buildFormattedName(), buildVCard(), canExportVCard(), clean(), escapeVCardText(), exportVCard() (+3 more)

### Community 64 - "reactNative.ts"
Cohesion: 0.11
Nodes (13): Animated, AnimatedValue, Dimensions, InteractionManager, Platform, Pressable, ScrollView, setPlatform() (+5 more)

### Community 65 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+11 more)

### Community 66 - "vitest"
Cohesion: 0.26
Nodes (8): react-test-renderer, vitest, Preview(), update, devices, renderBare(), renderWithAppProviders(), textContent()

### Community 67 - "webauthn.rs"
Cohesion: 0.10
Nodes (31): AssertionAuthenticatorResponse, AssertionPublicKeyCredential, AssertionSigningContext, base64url_decode(), base64url_encode(), base64url_round_trips_without_padding(), build_assertion_authenticator_data(), build_assertion_public_key_credential() (+23 more)

### Community 68 - "NavigationContainer.tsx"
Cohesion: 0.21
Nodes (13): ProtectedRoute(), getFocusedRouteName(), NavigationnContainer(), titlebarContentDragRoutes, LoginStack(), TabNavigator(), Handler, handlers (+5 more)

### Community 69 - "reactNativePaper.tsx"
Cohesion: 0.11
Nodes (14): ActivityIndicator, baseColors, Button, Chip, Divider, Icon, IconButton, MD3DarkTheme (+6 more)

### Community 71 - "AddValueModal.tsx"
Cohesion: 0.10
Nodes (28): Editor(), native, AddValueModal(), Props, TemplateEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD (+20 more)

### Community 72 - "appScheme.test.ts"
Cohesion: 0.36
Nodes (6): getMobileRedirectUri(), getAppRedirectUri(), getAppScheme(), Constants, resetExpoConfig(), setExpoConfig()

### Community 73 - "Datenschutzerklärung"
Cohesion: 0.09
Nodes (22): 10. Browser-Erweiterung, 11. Benachrichtigungen, 12. Kontaktaufnahme, 13. Webseite und Hosting, 14. Cookies, Tracking und Analytics, 15. App Stores und Download-Plattformen, 16. Rechtsgrundlagen, 17. Speicherdauer (+14 more)

### Community 74 - "autofill-preferences.ts"
Cohesion: 0.25
Nodes (13): buildPreferenceResult(), DEFAULT_POLICY, DomainPolicyStore, normalizeHost(), normalizeMode(), normalizePolicy(), readPolicyStore(), setInlineAutofillDisabledForHost() (+5 more)

### Community 75 - "analysisEngine.ts"
Cohesion: 0.27
Nodes (11): expo-crypto, buildAnalysisCache(), canonicalizeForVariants(), fingerprintPassword(), normalize(), THRESH_BITS, fetchRange(), getPwnedCountForPassword() (+3 more)

### Community 76 - "Privacy Policy"
Cohesion: 0.09
Nodes (22): 10. Browser Extension, 11. Notifications, 12. Contact, 13. Website And Hosting, 14. Cookies, Tracking And Analytics, 15. App Stores And Download Platforms, 16. Legal Bases, 17. Retention (+14 more)

### Community 77 - "FilterAnalysisModal.tsx"
Cohesion: 0.27
Nodes (8): FilterAnalysisModal(), Props, PasswordStrengthLevel, MEDIUM, STRONG, WEAK, getPasswordStrengthIcon(), Divider()

### Community 78 - "Nutzungsbedingungen"
Cohesion: 0.10
Nodes (20): 10. Erlaubte Nutzung, 11. Open Source und Lizenzen, 12. Kosten, 13. Drittanbieter, 14. Updates, 15. Haftung, 16. Beendigung der Nutzung, 17. Änderungen (+12 more)

### Community 79 - "reservePasskeyAssertion.ts"
Cohesion: 0.24
Nodes (9): normalizeCredentialId(), normalizeRpId(), reservePasskeyAssertion(), ReservePasskeyAssertionPayload, payload, validCounter(), PasskeyModuleType, PasskeyModuleTypeSchema (+1 more)

### Community 80 - "prepare-native-host-sidecar.js"
Cohesion: 0.15
Nodes (12): cargoArgs, { copyFileSync, existsSync, mkdirSync, writeFileSync }, detectHostTriple(), { execFileSync }, { join, resolve }, manifestPath, outputDir, outputPath (+4 more)

### Community 81 - "getModule.tsx"
Cohesion: 0.09
Nodes (42): expo-linking, Props, styles, ModuleContainer(), AddressModule(), CompanyModule(), CustomFieldModule(), DocumentModule() (+34 more)

### Community 82 - "HotkeyRecorderItem.tsx"
Cohesion: 0.24
Nodes (10): HotkeyRecorderItem(), Props, beginHotkeyRecording(), emit(), Listener, listeners, getDefaultHotkey(), getHotkeyConflict() (+2 more)

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
Cohesion: 0.06
Nodes (54): App(), AppShell(), AppWithNavigation(), DemoBootstrap(), getCurrentWindowSafe(), MainWindowReadySignal(), withAlpha(), Fast Access (+46 more)

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

### Community 92 - "DigitalCardModule.tsx"
Cohesion: 0.27
Nodes (8): DigitalCardModule(), DigitalCardModuleProps, isDigitalCardType(), styles, DIGITAL_CARD_TYPES, DigitalCardModuleType, DigitalCardModuleTypeSchema, regex

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
Cohesion: 0.04
Nodes (64): AddModuleModalCompactFav(), defineModules(), IdsOf, MissingIds, ModuleCategory, ModuleMeta, ModuleTile(), Props (+56 more)

### Community 97 - "bundle"
Cohesion: 0.17
Nodes (12): bundle, active, category, copyright, createUpdaterArtifacts, externalBin, fileAssociations, icon (+4 more)

### Community 98 - "AnimatedLogo.tsx"
Cohesion: 0.25
Nodes (5): react-native-svg, AnimatedLogo(), AnimatedRect, styles, Logo()

### Community 99 - "deriveIdentityClusters.ts"
Cohesion: 0.11
Nodes (25): Confidence And Trust, Core Idea, Data Model Direction, Design Tone, Identity Detail View, Identity Management Concept, Identity Tab, Important Principle (+17 more)

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
Cohesion: 0.06
Nodes (39): react-native, react-native-reanimated, Props, styles, ExpiryOverviewEntry, ExpiryOverviewItem(), styles, Props (+31 more)

### Community 106 - "plugins"
Cohesion: 0.20
Nodes (10): args, customProtocol, plugins, cli, deepLink, updater, endpoints, pubkey (+2 more)

### Community 107 - "editHistory.ts"
Cohesion: 0.21
Nodes (13): Editor(), appendLog(), areValuesEqual(), cloneValue(), createLogEntry(), EditHistoryActionType, EditHistoryMeta, EditSessionLogEntry (+5 more)

### Community 108 - "ValueIconsEnum"
Cohesion: 0.15
Nodes (13): ValueIconsEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+5 more)

### Community 109 - "GoogleDriveClient.ts"
Cohesion: 0.13
Nodes (19): buildMultipartBody(), escapeDriveQueryString(), fetchFile(), fetchUserInfo(), findFileIdByName(), GoogleTokenRefreshError, readJsonSafe(), readTextSafe() (+11 more)

### Community 110 - "SettingsQuickSelect.tsx"
Cohesion: 0.29
Nodes (7): clampWidth(), Props, SettingsQuickSelect(), styles, QuickSelectItem, DraggableHandle(), HandleProps

### Community 111 - "fill.ts"
Cohesion: 0.30
Nodes (11): applyTargets(), buildNoFieldsResult(), collectFillTargets(), emitInputEvents(), executeFill(), FillPreviewResult, FillSnapshot, FillTarget (+3 more)

### Community 112 - "riskModel.ts"
Cohesion: 0.16
Nodes (18): findSequentialTriples(), hasRepeatedChars(), strengthFromEntropyBits(), CHARSET_SIZES, EntropyOptions, estimateCharsetSize(), hasUnicodeProps, log2() (+10 more)

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
Cohesion: 0.14
Nodes (26): expo-auth-session, expo-random, expo-web-browser, @fabianlars/tauri-plugin-oauth, ANDROID_AUTH_PROMPT_OPTIONS, randState(), SCOPES, ANDROID_AUTH_PROMPT_OPTIONS (+18 more)

### Community 119 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, moduleResolution, strict, exclude, extends

### Community 120 - "Store Release Roadmap"
Cohesion: 0.17
Nodes (11): Apple Developer Program, Arratel Setup Plan, Chrome Web Store, Goals, Google Play, Microsoft Store, Publisher Naming, References (+3 more)

### Community 121 - "native_host_registration.rs"
Cohesion: 0.19
Nodes (10): CHROME_EXTENSION_IDS, chromium_origins(), CREATE_NO_WINDOW, EDGE_EXTENSION_IDS, find_native_host_exe(), FIREFOX_EXTENSION_ID, native_host_candidates(), NATIVE_HOST_NAME (+2 more)

### Community 122 - "TabNavigator.tsx"
Cohesion: 0.15
Nodes (15): @expo/vector-icons, @react-navigation/bottom-tabs, CustomBottomTab(), getActiveRouteName(), AppTabsParamList, LogoutStackParamList, HomeStack(), IdentityStack() (+7 more)

### Community 123 - "errorBus.ts"
Cohesion: 0.42
Nodes (6): Listener, listeners, subscribeGlobalError(), unsubscribeGlobalError(), GlobalErrorPayload, GlobalErrorSnackbar()

### Community 124 - "domain.ts"
Cohesion: 0.24
Nodes (11): loadPasskeyCandidatesForWebAuthnRequest(), buildEntrySuggestions(), normalizeHost(), normalizeLookupHost(), normalizeRpHost(), safeUrl(), scoreUrlMatch(), searchEntries() (+3 more)

### Community 125 - "serve-webauthn-test-page.js"
Cohesion: 0.25
Nodes (4): __dirname, pagePath, port, server

### Community 126 - "SettingsScreen.tsx"
Cohesion: 0.05
Nodes (49): Common Refactor Targets, Files To Check First, Known Custom Screens, Screen Standardization Context, expo-constants, simple-icons, getActiveRouteName(), LeftSideTabBar() (+41 more)

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
Cohesion: 0.09
Nodes (29): IdentityStackParamList, Stack, IdentityEmailLogo(), IdentityEmailLogoProps, styles, getDefaultIdentityName(), CategoryItem(), Props (+21 more)

### Community 142 - "linux"
Cohesion: 0.67
Nodes (3): linux, depends, deb

### Community 144 - "Sync And Storage Context"
Cohesion: 0.25
Nodes (7): Core Files, Providers, Settings Schema, Storage Layers, Sync And Storage Context, Tokens, StoreSchema

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

### Community 176 - "ExpiryNotificationScheduler.tsx"
Cohesion: 0.39
Nodes (7): expo-notifications, buildPendingExpiryReminders(), cancelScheduledExpiryReminders(), configureNotificationHandler(), ExpiryNotificationScheduler(), getReminderDate(), PendingExpiryReminder

### Community 178 - "ClavisPass Firefox Add-on Reviewer Build"
Cohesion: 0.33
Nodes (5): Build Steps, ClavisPass Firefox Add-on Reviewer Build, Environment, Firefox Add-on ID, Native Messaging Notes

### Community 179 - "CachedAnalysisItem.ts"
Cohesion: 0.36
Nodes (4): AnalysisFlags, AnalysisRef, CachedAnalysisItem, CacheResult

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

### Community 184 - "ContentProtectionProvider.tsx"
Cohesion: 0.38
Nodes (5): applyNativeContentProtection(), applyTauriContentProtection(), ContentProtectionContext, ContentProtectionContextValue, ContentProtectionProvider()

### Community 185 - "Desktop And Tauri Context"
Cohesion: 0.33
Nodes (5): Chrome And Drag Regions, Core Files, Desktop And Tauri Context, Runtime Model, Tauri Responsibilities

### Community 189 - "AddTriggerStack.tsx"
Cohesion: 0.38
Nodes (5): AddTriggerStackParamList, AddTriggerStack(), Stack, AddTriggerScreen(), AddTriggerScreenProps

### Community 190 - "ClavisPassHubDiscoveryResult.ts"
Cohesion: 0.29
Nodes (6): ClavisPassHubDiscoveryResult, ClavisPassHubDiscoveryStatus, DiscoveryCheckingResult, DiscoveryErrorResult, DiscoveryIdleResult, DiscoverySuccessResult

### Community 191 - "CardItem.tsx"
Cohesion: 0.26
Nodes (10): @kichiyaki/react-native-barcode-generator, Props, styles, DigitalCardPalette, extractUrlFromEntry(), getReadableTextColor(), hexToRgb(), mixColors() (+2 more)

### Community 192 - "pkce.web.ts"
Cohesion: 0.80
Nodes (4): base64Url(), createPkcePair(), randomBytes(), toCodeChallenge()

### Community 193 - "content-messages.ts"
Cohesion: 0.29
Nodes (6): ContentMessage, ContentMessageMap, ContentMessageType, ContentRequestFor, ContentResponseFor, ContentDebugInfo

### Community 194 - "generatePassword.ts"
Cohesion: 0.29
Nodes (5): generatePassword(), LOWERCASE_CHAR_CODES, NUMBER_CHAR_CODES, SYMBOL_CHAR_CODES, UPPERCASE_CHAR_CODES

### Community 195 - "dependencies"
Cohesion: 0.50
Nodes (4): dependencies, react, react-dom, tldts

### Community 197 - "pinnedEntries.ts"
Cohesion: 0.60
Nodes (4): comparePinnedFirst(), isPinnedEntry(), orderPinnedFirst(), sortPinnedFirst()

### Community 198 - "Import.tsx"
Cohesion: 0.17
Nodes (11): expo-document-picker, VaultContextType, DocumentTypeEnum, BITWARDEN, CHROME, FIREFOX, KDBX, PCLOUD (+3 more)

### Community 199 - "ExpiryModule.tsx"
Cohesion: 0.23
Nodes (8): styles, ExpiryStatus, ExpiryModuleType, ExpiryModuleTypeSchema, regex, formatRelative(), getRelativeInfo(), RelativeExpiryInfo

## Knowledge Gaps
- **130 isolated node(s):** `react`, `react-dom`, `@types/chrome`, `@types/react`, `@types/react-dom` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1711 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **46 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `modulePolicy.ts`, `package.json`, `ModulesEnum`, `store.ts`, `DeviceStorageClient.ts`, `ClavisPassHubClient.ts`, `VaultProvider.tsx`, `mergeVaultData.ts`, `ModulesList.tsx`, `ValuesType.ts`, `withIosGoogleOAuthScheme.js`, `hotkeys.ts`, `bitwarden.ts`, `useVault`, `vite.config.ts`, `generatePassword.ts`, `pinnedEntries.ts`, `AddValueModal.tsx`, `appScheme.test.ts`, `reservePasskeyAssertion.ts`, `App.tsx`, `GoogleDriveClient.ts`, `GoogleDriveLoginButton.tsx`, `domain.ts`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **What connects `react`, `react-dom`, `@types/chrome` to the rest of the system?**
  _130 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CryptoProvider` be split into smaller, more focused modules?**
  _Cohesion score 0.07744107744107744 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.01904761904761905 - nodes in this community are weakly interconnected._
- **Why does `useTheme()` connect `useTheme` to `ModulesEnum.ts`, `EditScreen.tsx`, `SettingsDropdownItem.tsx`, `ThemeProvider.tsx`, `AnalysisDetailScreen.tsx`, `GlobalClipboardSnackbar.tsx`, `IdentityDetailScreen.tsx`, `react-i18next`, `model/types.ts`, `detectTauriEnvironment`, `HomeScreen.tsx`, `UpdateManager.tsx`, `LoginScreen.tsx`, `AttachmentModule.tsx`, `Button.tsx`, `CloudProvider.tsx`, `RecoveryCodesModule.tsx`, `AnalysisScreen.tsx`, `TotpModule.tsx`, `useVault`, `CreditCardModule.tsx`, `CardItem.tsx`, `vitest`, `NavigationContainer.tsx`, `Import.tsx`, `ExpiryModule.tsx`, `FilterAnalysisModal.tsx`, `getModule.tsx`, `HotkeyRecorderItem.tsx`, `App.tsx`, `DigitalCardModule.tsx`, `Modal`, `ref_react`, `SettingsQuickSelect.tsx`, `TabNavigator.tsx`, `errorBus.ts`, `SettingsScreen.tsx`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `ModulesEnum.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.049895506792058515 - nodes in this community are weakly interconnected._
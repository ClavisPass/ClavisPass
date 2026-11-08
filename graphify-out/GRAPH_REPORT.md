# Graph Report - ClavisPass  (2026-10-25)

## Corpus Check
- 575 files · ~356,622 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 37 file(s) not represented in the graph (top: .xml 11, (none) 8, .properties 2)

## Summary
- 3972 nodes · 10913 edges · 197 communities (155 shown, 42 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 162 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `00b6c910`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CryptoProvider
- dependencies
- getModule.tsx
- vitest
- package.json
- ModulesEnum
- useTheme
- Header
- EditScreen.tsx
- store.ts
- ValuesType
- content/index.ts
- shared/types.ts
- popup/App.tsx
- ModulesEnum.ts
- background/index.ts
- background/bridge.ts
- triggerGlobalError
- model/types.ts
- FastAccess.ts
- shared/bridge.ts
- expo
- ClavisPassHubClient.ts
- ModuleContainer
- write.rs
- scripts
- AnalysisScreen.tsx
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
- NoteModule.tsx
- state.ts
- DraggableModulesList.shared.tsx
- mapKdbxToClavisPass.ts
- authenticateUser.ts
- host.rs
- vault.rs
- googleOAuth.ts
- release.js
- AuthProvider.tsx
- DeviceStorageClient.ts
- AnalysisDetailScreen.tsx
- ClavisPass Website Marketing Brief
- bitwarden.ts
- pairing.rs
- riskModel.ts
- Idee: Identity als persönlicher Hauptscreen
- react-i18next
- ThemeProvider.tsx
- vite.config.ts
- devDependencies
- prepare-msix.js
- GlobalClipboardSnackbar.tsx
- BrowserBridgeWriteSync.tsx
- Crypto Context
- ClavisPass
- analysisEngine.ts
- reactNative.ts
- compilerOptions
- detectTauriEnvironment
- webauthn.rs
- CustomTitlebar.tsx
- reactNativePaper.tsx
- MainApplication.kt
- TemplateEnum
- appScheme.test.ts
- Datenschutzerklärung
- autofill-preferences.ts
- OnlineProvider.tsx
- Privacy Policy
- autofill-cache.ts
- Nutzungsbedingungen
- bridge_commands.rs
- prepare-native-host-sidecar.js
- BrowserBridgePairingPrompt.tsx
- modulePolicy.ts
- MainActivity.kt
- session.rs
- scripts
- protocol.rs
- ExpiryNotificationScheduler.tsx
- RecoveryCodesModule.tsx
- VaultProvider.tsx
- Terms Of Use
- UI Context
- deriveIdentityClusters.ts
- check-tauri-version-sync.js
- prepare-sodium-16kb.js
- ClavisPass Product Strategy Roadmap
- react-native
- bundle
- FilterAnalysisModal.tsx
- Identity Management Concept
- tab-context.ts
- i18n/index.ts
- tauri.conf.json
- withAndroidApplicationId.js
- build-web-demo.js
- react-native-reanimated
- plugins
- editHistory.ts
- ValueIconsEnum
- Sync.tsx
- GoogleDriveClient.ts
- fill.ts
- Vault Modules Context
- ClavisPass Passkey Management Roadmap
- reactNativeReanimated.tsx
- reactNavigationNative.ts
- devDependencies
- compilerOptions
- TotpModule.tsx
- tsconfig.json
- Store Release Roadmap
- ClavisPassHubLoginButton.tsx
- DocumentTypeEnum
- CardItem.tsx
- DigitalCardModule.tsx
- serve-webauthn-test-page.js
- SettingsScreen.tsx
- macOS
- windows
- gorhomBottomSheet.tsx
- WifiTypeEnum
- build
- vite-env.d.ts
- mobileUpdater.ts
- Vault V2 Key Envelope Roadmap
- BridgeStatusBadge.tsx
- useSetting
- linux
- asyncStorage.ts
- CreditCardModule.tsx
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
- HomeScreen.tsx
- Firefox Store Release Notes
- EmailModule.tsx
- generate-webauthn-test-passkey.js
- ClavisPass Firefox Add-on Reviewer Build
- I18nBridge.tsx
- Bitwarden Import Roadmap
- Agent Workflow Context
- Build, Release, And Update Context
- Identity Context
- NoteMarkdownPreview.tsx
- ClavisPassHubDiscoveryResult.ts
- CLAUDE.md
- .claude/CLAUDE.md
- App.tsx
- NoteFullscreenEditor.web.tsx
- render.tsx
- ref_react
- errorBus.ts
- pkce.web.ts
- dependencies
- container/AnimatedOpacityContainer.tsx

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 268 edges
2. `react-native` - 184 edges
3. `react-native-paper` - 129 edges
4. `ModulesEnum` - 115 edges
5. `react-i18next` - 102 edges
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

## Communities (197 total, 42 thin omitted)

### Community 0 - "CryptoProvider"
Cohesion: 0.07
Nodes (35): base64-js, libsodium-wrappers-sumo, react-native-sodium-jsi, CryptoProvider, getCryptoProvider(), rnSodiumProvider, td, te (+27 more)

### Community 1 - "dependencies"
Cohesion: 0.02
Nodes (105): dependencies, argon2-browser, @babel/plugin-proposal-export-namespace-from, base64-js, crypto-js, expo, expo-auth-session, expo-blur (+97 more)

### Community 2 - "getModule.tsx"
Cohesion: 0.05
Nodes (75): zod, TaskModule(), AddressModuleType, AddressModuleTypeSchema, regex, AttachmentFileSchema, AttachmentModuleType, AttachmentModuleTypeSchema (+67 more)

### Community 3 - "vitest"
Cohesion: 0.12
Nodes (15): vitest, generatePassword(), LOWERCASE_CHAR_CODES, NUMBER_CHAR_CODES, SYMBOL_CHAR_CODES, UPPERCASE_CHAR_CODES, daysBetween(), DEFAULT_DEVICE_UI_POLICY (+7 more)

### Community 4 - "package.json"
Cohesion: 0.03
Nodes (72): react, react-dom, @types/react, @types/react-dom, typescript, main, name, private (+64 more)

### Community 5 - "ModulesEnum"
Cohesion: 0.07
Nodes (29): payload, PasskeyModuleType, PasskeyModuleTypeSchema, regex, ModulesEnum, ADDRESS, ATTACHMENT, COMPANY (+21 more)

### Community 6 - "useTheme"
Cohesion: 0.07
Nodes (56): expo-linear-gradient, react-native-gesture-handler, @react-native-masked-view/masked-view, IdentityStackParamList, IdentityStack(), Stack, useTheme(), Pattern() (+48 more)

### Community 7 - "Header"
Cohesion: 0.06
Nodes (61): Standard Screen Structure, expo-camera, @hello-pangea/dnd, react-native-draggable-flatlist, @react-navigation/native, @react-navigation/native-stack, HomeStackParamList, Stack (+53 more)

### Community 8 - "EditScreen.tsx"
Cohesion: 0.07
Nodes (48): extractFastAccessObject(), EditRowControlsContainerProps, NativeDragHandleScrollLockContext, WebDragHandlePropsContext, ellipsize(), failedFaviconUrls, ListItem(), maskPassword() (+40 more)

### Community 9 - "store.ts"
Cohesion: 0.05
Nodes (54): Core Files, Providers, Settings Schema, Storage Layers, Sync And Storage Context, Tokens, HotkeyRecorderItem(), Props (+46 more)

### Community 10 - "ValuesType"
Cohesion: 0.25
Nodes (11): papaparse, decrypt(), ValuesListType, ValuesType, getModuleData(), getCustomField(), getModules(), getTemplate() (+3 more)

### Community 11 - "content/index.ts"
Cohesion: 0.12
Nodes (35): applyThemeToInlinePicker(), clearInlinePreview(), commitInlineAction(), createCloseIcon(), createInlineLogo(), createPickerLogo(), ensureInlineStyles(), fillSuggestionFromPicker() (+27 more)

### Community 12 - "shared/types.ts"
Cohesion: 0.06
Nodes (43): BackgroundHandler, BackgroundHandlerMap, BackgroundMessageContext, BackgroundMessageRouter, FillStateCardProps, ExtensionMessage, isExtensionMessage(), MessageMap (+35 more)

### Community 13 - "popup/App.tsx"
Cohesion: 0.07
Nodes (42): registerContentFrame(), setupSavePromptListener(), setupWebAuthnProbe(), App(), handleFill(), handleOpenDesktopApp(), handlePasskeyAssertion(), handlePromptResolution() (+34 more)

### Community 14 - "ModulesEnum.ts"
Cohesion: 0.19
Nodes (15): expo-linking, ModuleContainerProps, moduleStyles, AddressState, CompanyState, CustomFieldInputType, DocumentState, moduleFormStyles (+7 more)

### Community 15 - "background/index.ts"
Cohesion: 0.11
Nodes (36): countVisibleSuggestions(), normalizeFillData(), normalizeSuggestions(), activeWebAuthnRequests, assertActiveWebAuthnRequest(), clearTabBadge(), delay(), deliverWebAuthnAssertionToTab() (+28 more)

### Community 16 - "background/bridge.ts"
Cohesion: 0.13
Nodes (23): Desktop bridge, deriveAppState(), DesktopBridgeService, getStoredPairingStatus(), normalizeAssertionCredential(), normalizeDesktopStatus(), normalizePasskeyMetadata(), normalizePasskeyRequestCandidates() (+15 more)

### Community 17 - "triggerGlobalError"
Cohesion: 0.19
Nodes (15): @tauri-apps/plugin-fs, fetchFile(), fetchUserInfo(), refreshAccessToken(), uploadFile(), ensureDesktop(), fetchFile(), fetchUserInfo() (+7 more)

### Community 18 - "model/types.ts"
Cohesion: 0.08
Nodes (35): @expo/vector-icons, @react-navigation/bottom-tabs, ProtectedRoute(), getActiveRouteName(), LeftSideTabBar(), sidebarWidth, styles, AddTriggerStackParamList (+27 more)

### Community 19 - "FastAccess.ts"
Cohesion: 0.11
Nodes (28): FastAccessSessionBridge(), MobileFastAccessOverlay(), FAST_ACCESS_NOTIFICATION_CATEGORY, FAST_ACCESS_POPUP_LABEL, FAST_ACCESS_POSITION_CHANGED_EVENT, FAST_ACCESS_READY_EVENT, FAST_ACCESS_UPDATE_EVENT, FastAccessPayload (+20 more)

### Community 20 - "shared/bridge.ts"
Cohesion: 0.13
Nodes (26): NativeMessagingError, toBridgeError(), validateBridgeResponse(), withTimeout(), createInstanceId(), getBridgeClientInfo(), getBrowserDisplayName(), getInstanceId() (+18 more)

### Community 21 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, adaptiveIcon, blockedPermissions, package, permissions, versionCode, projectId (+31 more)

### Community 22 - "ClavisPassHubClient.ts"
Cohesion: 0.12
Nodes (37): @react-native-async-storage/async-storage, calculateExpiresIn(), createHubError(), createHubErrorFromPayload(), DiscoveryResponse, ensureVaultEtagForUpload(), fetchFile(), fetchUserInfo() (+29 more)

### Community 23 - "ModuleContainer"
Cohesion: 0.11
Nodes (25): Shared Module UI, EditRowControlsContainer(), ExpiryPickerModal(), ModuleContainer(), AddressModule(), CompanyModule(), CustomFieldModule(), DocumentModule() (+17 more)

### Community 24 - "write.rs"
Cohesion: 0.10
Nodes (35): as_io_error(), BrowserWriteKind, CreateEntryFromBrowser, ReservePasskeyAssertion, UpdateEntryFromBrowser, BrowserWriteRequest, BrowserWriteRequestStore, BrowserWriteResult (+27 more)

### Community 25 - "scripts"
Cohesion: 0.05
Nodes (39): scripts, android, android:build:apk, android:build:store, android:build:store-submit, android:submit:store, extension:build, extension:build:chrome (+31 more)

### Community 26 - "AnalysisScreen.tsx"
Cohesion: 0.15
Nodes (19): AnalysisStackParamList, Stack, FiltersNarrow, normalize(), AnalysisScreen(), AnalysisScreenProps, AnalysisTab, FilterItem (+11 more)

### Community 27 - "manifest.json"
Cohesion: 0.06
Nodes (35): action, default_icon, default_popup, default_title, background, service_worker, type, browser_specific_settings (+27 more)

### Community 28 - "isTauri.ts"
Cohesion: 0.13
Nodes (19): configureMobileFastAccess(), getClipboardText(), setClipboardText(), tryNavigatorReadText(), tryNavigatorWriteText(), ClipboardContentKind, clipboardOwnership, fingerprintValue() (+11 more)

### Community 29 - "forms.ts"
Cohesion: 0.11
Nodes (33): AutofillPlan, buildAutofillPlan(), buildDetachedContainer(), buildFieldKey(), buildFieldText(), buildFormId(), chooseBestField(), ClassifiedField (+25 more)

### Community 30 - "lib.rs"
Cohesion: 0.07
Nodes (29): clamp_window_size(), clamp_window_size_to_monitor(), DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIDTH, emit_lock_vault(), emit_vault_file_open_request(), get_requested_vault_file_path(), get_window_size_file_path() (+21 more)

### Community 31 - "ClavisPass Native Messaging Bridge"
Cohesion: 0.06
Nodes (30): Architecture, Browser loading notes, ClavisPass Browser Extension, Current feature set, Development, Important note, Working from the repo root, Chosen architecture (+22 more)

### Community 32 - "UpdateManager.tsx"
Cohesion: 0.20
Nodes (13): expo-updates, react-native-safe-area-context, @tauri-apps/plugin-process, @tauri-apps/plugin-updater, Listener, listeners, publishUpdateCheck(), subscribeUpdateCheck() (+5 more)

### Community 33 - "mergeVaultData.ts"
Cohesion: 0.17
Nodes (23): VaultEntryTombstone, addLatestTombstones(), areSame(), areVaultDataEqual(), clone(), conflictCopyMatchesBaseEntry(), conflictCopyWasDeleted(), entryContentFingerprint() (+15 more)

### Community 34 - "commands.rs"
Cohesion: 0.05
Nodes (40): auth_reply(), AUTH_REPLY_DESCRIPTOR, AUTH_REPLY_SIGNATURE, authenticate_with_system(), authenticate_with_system_impl(), AuthReplyBlock, AuthState, _Block_copy() (+32 more)

### Community 35 - "LoginScreen.tsx"
Cohesion: 0.10
Nodes (49): expo-auth-session, expo-random, expo-web-browser, @fabianlars/tauri-plugin-oauth, OAuthRefreshError, Props, StoredAuth, TokenContext (+41 more)

### Community 36 - "AttachmentModule.tsx"
Cohesion: 0.12
Nodes (29): expo-file-system, expo-sharing, @tauri-apps/plugin-dialog, AttachmentModule(), canPreviewAttachment(), downloadBrowserAttachment(), formatBytes(), getAttachmentIcon() (+21 more)

### Community 37 - "NoteModule.tsx"
Cohesion: 0.15
Nodes (15): JsonLine(), NoteCodePreview(), clamp(), DISPLAY_MODE_HEIGHTS, DISPLAY_MODES, NOTE_VARIANTS, NoteDisplayMode, NoteLanguage (+7 more)

### Community 38 - "state.ts"
Cohesion: 0.08
Nodes (25): buildCreatePayload(), buildUpdatePayload(), resolvePromptWithDesktopWrite(), toAppliedResult(), buildPromptTitle(), ExtensionState, normalizeIdentity(), PreparedFillRecord (+17 more)

### Community 39 - "DraggableModulesList.shared.tsx"
Cohesion: 0.19
Nodes (18): NativeDragHandleScrollLockProvider(), WebDragHandlePropsProvider(), dragDropAnimationConfig, DraggableModulesList(), DraggableModulesFooter(), DraggableModulesListProps, draggableModulesListStyles, FooterProps (+10 more)

### Community 40 - "mapKdbxToClavisPass.ts"
Cohesion: 0.15
Nodes (22): kdbxweb, configureKdbxArgon2(), importKdbx(), addCustomField(), addTotpModule(), addValueModule(), binaryToBytes(), binaryWithMetaToAttachment() (+14 more)

### Community 41 - "authenticateUser.ts"
Cohesion: 0.39
Nodes (9): expo-local-authentication, CloudProvider(), isInvalidGrant(), getData(), getTauriCore(), getWebStorageKey(), removeData(), saveData() (+1 more)

### Community 42 - "host.rs"
Cohesion: 0.13
Nodes (23): app_scheme(), AssertPasskeyPayload, bridge_result_to_response(), ensure_ready(), FillPayload, handle_request(), is_es256_algorithm(), MatchPasskeysPayload (+15 more)

### Community 43 - "vault.rs"
Cohesion: 0.11
Nodes (39): domain_contains(), entry_match_hosts(), fill_data_for_entry(), FillDataResult, first_string(), FolderRef, has_passkey(), login_entry() (+31 more)

### Community 44 - "googleOAuth.ts"
Cohesion: 0.16
Nodes (17): refreshAccessToken(), getGoogleClientIdForCurrentPlatform(), getGoogleClientSecretForCurrentPlatform(), getGoogleDesktopClientId(), getGoogleDesktopClientSecret(), getGoogleMobileRedirectUri(), normalizeClientId(), toReverseClientIdScheme() (+9 more)

### Community 45 - "release.js"
Cohesion: 0.12
Nodes (19): androidGradleHasVersionCode(), androidGradleHasVersionName(), androidStringsHasRuntimeVersion(), cargoLockHasVersion(), cargoTomlHasVersion(), { execSync }, existingTags, filesToUpdate (+11 more)

### Community 46 - "AuthProvider.tsx"
Cohesion: 0.08
Nodes (23): @tauri-apps/plugin-global-shortcut, AuthContext, AuthContextType, AuthMasterContext, AuthMasterContextType, Props, DEFAULT_KEYS, SettingsContext (+15 more)

### Community 47 - "DeviceStorageClient.ts"
Cohesion: 0.38
Nodes (11): fetchFile(), getActiveLocalVaultIdKey(), getLocalSyncKey(), getLocalSyncMetadataKey(), getVaultLocalSyncKey(), getVaultLocalSyncMetadataKey(), LocalSyncMetadata, readLocalSyncMetadata() (+3 more)

### Community 48 - "AnalysisDetailScreen.tsx"
Cohesion: 0.16
Nodes (19): useAuthMaster(), canonicalizeForVariants(), deriveAnalysisPepperFromMaster(), fingerprintPassword(), AnalysisDetailScreen(), AnalysisDetailScreenProps, analyzeCharacterComposition(), buildStrengthVsRiskExplanation() (+11 more)

### Community 49 - "ClavisPass Website Marketing Brief"
Cohesion: 0.05
Nodes (43): Attachments And Previews, Brand Details, Bring Your Own Sync, Browser Extension, Can I import my existing passwords?, Can my cloud provider read my passwords?, ClavisPass Website Marketing Brief, Conversion Priorities (+35 more)

### Community 50 - "bitwarden.ts"
Cohesion: 0.20
Nodes (24): addCardModule(), addCustomField(), addExpiryModule(), addIdentityModules(), addLoginModules(), addNote(), addPasskeyModules(), addSshKeyModule() (+16 more)

### Community 51 - "pairing.rs"
Cohesion: 0.21
Nodes (21): approve_pairing(), evaluate_pairing(), list_paired_clients(), list_pending_pairings(), list_rejected_clients(), load_pairing_store(), now_ms(), optional_identity_matches() (+13 more)

### Community 52 - "riskModel.ts"
Cohesion: 0.18
Nodes (17): buildAnalysisCache(), findSequentialTriples(), hasRepeatedChars(), strengthFromEntropyBits(), CHARSET_SIZES, EntropyOptions, estimateCharsetSize(), hasUnicodeProps (+9 more)

### Community 53 - "Idee: Identity als persönlicher Hauptscreen"
Cohesion: 0.22
Nodes (8): Datenschutz, Einschätzung, Gestaltungsprinzipien und offene Fragen, Idee: Identity als persönlicher Hauptscreen, Mögliche Ausbaustufen, Mögliche Funktionen, Technischer Ansatz, Ziel

### Community 54 - "react-i18next"
Cohesion: 0.08
Nodes (47): Current Vault Format, Implementation Phases, react-i18next, react-native-progress, useAuth(), useVault(), Login(), Props (+39 more)

### Community 55 - "ThemeProvider.tsx"
Cohesion: 0.07
Nodes (32): @gorhom/bottom-sheet, @radix-ui/react-popover, react-native-circular-progress, react-native-paper, Props, ThemeContext, ThemeContextType, AnalysisEntry() (+24 more)

### Community 57 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, @babel/core, eslint, eslint-config-universe, patch-package, prettier, react-test-renderer, @tauri-apps/cli (+14 more)

### Community 58 - "prepare-msix.js"
Cohesion: 0.10
Nodes (16): appExe, appVersion, assetsOutputDir, createUnplatedTargetSizeIcons(), escapePowerShellSingleQuoted(), fs, manifest, manifestSource (+8 more)

### Community 59 - "GlobalClipboardSnackbar.tsx"
Cohesion: 0.25
Nodes (8): clipboardClearScheduler, Handler, handlers, subscribeClipboardCopied(), unsubscribeClipboardCopied(), ClipboardCopyPayload, GlobalClipboardSnackbar(), msToSecCeil()

### Community 60 - "BrowserBridgeWriteSync.tsx"
Cohesion: 0.22
Nodes (16): applyUpdateToEntry(), BrowserBridgeWriteSync(), BrowserWriteKind, BrowserWriteRequest, createBrowserEntry(), CreatePayload, effectiveUrl(), normalizeText() (+8 more)

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

### Community 66 - "detectTauriEnvironment"
Cohesion: 0.13
Nodes (29): App(), AppWithNavigation(), getCurrentWindowSafe(), expo-screen-capture, @tauri-apps/api, @tauri-apps/plugin-deep-link, applyNativeContentProtection(), applyTauriContentProtection() (+21 more)

### Community 67 - "webauthn.rs"
Cohesion: 0.06
Nodes (39): AssertionAuthenticatorResponse, AssertionPublicKeyCredential, AssertionSigningContext, base64url_decode(), base64url_encode(), base64url_round_trips_without_padding(), build_assertion_authenticator_data(), build_assertion_public_key_credential() (+31 more)

### Community 68 - "CustomTitlebar.tsx"
Cohesion: 0.08
Nodes (28): Chrome And Drag Regions, Core Files, Desktop And Tauri Context, Fast Access, Runtime Model, Tauri Responsibilities, showMainWindow(), StartBehavior (+20 more)

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
Cohesion: 0.23
Nodes (15): buildPreferenceResult(), DEFAULT_POLICY, DomainPolicyStore, getInlineAutofillPreferenceForUrl(), normalizeHost(), normalizeMode(), normalizePolicy(), readPolicyStore() (+7 more)

### Community 75 - "OnlineProvider.tsx"
Cohesion: 0.29
Nodes (6): CustomBottomTab(), getActiveRouteName(), OnlineContext, OnlineContextType, Props, UseOnlineResult

### Community 76 - "Privacy Policy"
Cohesion: 0.09
Nodes (22): 10. Browser Extension, 11. Notifications, 12. Contact, 13. Website And Hosting, 14. Cookies, Tracking And Analytics, 15. App Stores And Download Platforms, 16. Legal Bases, 17. Retention (+14 more)

### Community 77 - "autofill-cache.ts"
Cohesion: 0.14
Nodes (26): clearAutofillDomainCache(), countPasswordSuggestions(), DomainAutofillCache, DomainAutofillCacheEntry, getAutofillEligibilityForUrl(), getCachedAutofillMatchCountForUrl(), getCachedMatchCount(), getCachedVisibleMatchCount() (+18 more)

### Community 78 - "Nutzungsbedingungen"
Cohesion: 0.10
Nodes (20): 10. Erlaubte Nutzung, 11. Open Source und Lizenzen, 12. Kosten, 13. Drittanbieter, 14. Updates, 15. Haftung, 16. Beendigung der Nutzung, 17. Änderungen (+12 more)

### Community 79 - "bridge_commands.rs"
Cohesion: 0.15
Nodes (8): bridge_approve_pairing(), bridge_claim_pending_writes(), bridge_complete_write_request(), bridge_list_paired_clients(), bridge_list_pending_pairings(), bridge_list_rejected_clients(), bridge_publish_session(), bridge_reject_pairing()

### Community 80 - "prepare-native-host-sidecar.js"
Cohesion: 0.15
Nodes (12): cargoArgs, { copyFileSync, existsSync, mkdirSync, writeFileSync }, detectHostTriple(), { execFileSync }, { join, resolve }, manifestPath, outputDir, outputPath (+4 more)

### Community 81 - "BrowserBridgePairingPrompt.tsx"
Cohesion: 0.24
Nodes (12): BrowserBridgePairingPrompt(), PairingAction, PromptButton(), styles, actOnBrowserExtensionPairing(), BrowserExtensionPairingChangeListener, buildBrowserClientKey(), listBrowserExtensionPairings() (+4 more)

### Community 82 - "modulePolicy.ts"
Cohesion: 0.19
Nodes (12): buildEntryMeta(), firstModule(), firstValue(), getSecretFor(), isManagedModule(), MANAGED_MODULE_VALUES, ManagedModules, MetaExtractor (+4 more)

### Community 84 - "session.rs"
Cohesion: 0.15
Nodes (15): bridge_dir(), BRIDGE_ENV_KEY, ensure_dir(), pairing_store_path(), platform_base_dir(), session_store_path(), write_request_store_path(), write_result_store_path() (+7 more)

### Community 85 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, build:chrome, build:firefox, build:firefox-local, dev, package:chrome, package:firefox (+8 more)

### Community 86 - "protocol.rs"
Cohesion: 0.20
Nodes (7): BridgeClientInfo, BridgeError, BridgePairingEnvelope, BridgeRequest, BridgeResponse, HOST_NAME, PROTOCOL_VERSION

### Community 87 - "ExpiryNotificationScheduler.tsx"
Cohesion: 0.48
Nodes (6): buildPendingExpiryReminders(), cancelScheduledExpiryReminders(), configureNotificationHandler(), ExpiryNotificationScheduler(), getReminderDate(), PendingExpiryReminder

### Community 88 - "RecoveryCodesModule.tsx"
Cohesion: 0.21
Nodes (11): FastAccessType, FastAccessTypeSchema, RecoveryCodesModule(), splitKeepingRemainder(), styles, tokenize(), Props, QuickSelect() (+3 more)

### Community 89 - "VaultProvider.tsx"
Cohesion: 0.11
Nodes (22): VaultContext, VaultContextType, VaultData, FolderSchema, ModulesTypeSchema, EntryExternalRefsSchema, ValuesListTypeSchema, ValuesTypeSchema (+14 more)

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

### Community 96 - "react-native"
Cohesion: 0.07
Nodes (40): expo-document-picker, react-native, Import(), PendingKdbxFile, Props, styles, CustomFieldInputType, EditCustomFieldModal() (+32 more)

### Community 97 - "bundle"
Cohesion: 0.17
Nodes (12): bundle, active, category, copyright, createUpdaterArtifacts, externalBin, fileAssociations, icon (+4 more)

### Community 98 - "FilterAnalysisModal.tsx"
Cohesion: 0.23
Nodes (9): FilterAnalysisModal(), Props, PasswordStrengthLevel, MEDIUM, STRONG, WEAK, getPasswordStrengthColor(), getPasswordStrengthIcon() (+1 more)

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

### Community 105 - "react-native-reanimated"
Cohesion: 0.11
Nodes (28): react-native-reanimated, FilterItem, FiltersNarrowProps, FiltersWide, FiltersWideProps, styles, ExpiryOverviewEntry, HomeFilterMenu() (+20 more)

### Community 106 - "plugins"
Cohesion: 0.20
Nodes (10): args, customProtocol, plugins, cli, deepLink, updater, endpoints, pubkey (+2 more)

### Community 107 - "editHistory.ts"
Cohesion: 0.23
Nodes (12): appendLog(), areValuesEqual(), cloneValue(), createLogEntry(), EditHistoryActionType, EditHistoryMeta, EditSessionLogEntry, HistoryEntry (+4 more)

### Community 108 - "ValueIconsEnum"
Cohesion: 0.14
Nodes (13): ValueIconsEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+5 more)

### Community 109 - "Sync.tsx"
Cohesion: 0.18
Nodes (19): TokenContextValue, Props, Sync(), createVaultDeviceId(), DeviceIdentity, getCurrentVaultDeviceId(), getDeviceDisplayName(), getPlatformString() (+11 more)

### Community 110 - "GoogleDriveClient.ts"
Cohesion: 0.28
Nodes (11): buildMultipartBody(), escapeDriveQueryString(), fetchFile(), fetchUserInfo(), findFileIdByName(), GoogleTokenRefreshError, readJsonSafe(), readTextSafe() (+3 more)

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

### Community 118 - "TotpModule.tsx"
Cohesion: 0.29
Nodes (8): otpauth, styles, Totp(), TotpModule(), TotpModuleModuleProps, codeFromUri(), parseOtpauth(), TotpAlgo

### Community 119 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, moduleResolution, strict, exclude, extends

### Community 120 - "Store Release Roadmap"
Cohesion: 0.17
Nodes (11): Apple Developer Program, Arratel Setup Plan, Chrome Web Store, Goals, Google Play, Microsoft Store, Publisher Naming, References (+3 more)

### Community 121 - "ClavisPassHubLoginButton.tsx"
Cohesion: 0.38
Nodes (8): ClavisPassHubLoginButton(), checkDiscovery(), looksLikeClavisPassHubHostUrl(), normalizeClavisPassHubHostUrl(), getClavisPassHubLastUsername(), Divider(), ClavisPassProps, LogoColored()

### Community 122 - "DocumentTypeEnum"
Cohesion: 0.33
Nodes (6): DocumentTypeEnum, BITWARDEN, CHROME, FIREFOX, KDBX, PCLOUD

### Community 123 - "CardItem.tsx"
Cohesion: 0.16
Nodes (17): Item Surfaces, expo-image, @kichiyaki/react-native-barcode-generator, react-qr-code, CardItem(), Props, styles, TotpItem() (+9 more)

### Community 124 - "DigitalCardModule.tsx"
Cohesion: 0.27
Nodes (8): DigitalCardModule(), DigitalCardModuleProps, isDigitalCardType(), styles, DIGITAL_CARD_TYPES, DigitalCardModuleType, DigitalCardModuleTypeSchema, regex

### Community 125 - "serve-webauthn-test-page.js"
Cohesion: 0.25
Nodes (4): __dirname, pagePath, port, server

### Community 126 - "SettingsScreen.tsx"
Cohesion: 0.06
Nodes (45): simple-icons, DevModeContext, DevModeContextType, Props, useDevMode(), removeAuthentication(), saveAuthentication(), AppearanceSettingsSection() (+37 more)

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

### Community 137 - "mobileUpdater.ts"
Cohesion: 0.33
Nodes (9): shouldUseMobileBinaryUpdater(), checkMobileBinaryUpdate(), compareVersions(), getAppVersion(), getManifestDownloadUrl(), getMobileUpdateManifestUrl(), MobileBinaryUpdate, MobileUpdateManifest (+1 more)

### Community 138 - "Vault V2 Key Envelope Roadmap"
Cohesion: 0.06
Nodes (28): Always Know, ClavisPass Agent Context, Context Routing, Fast Map, graphify, High-Risk Rules, Core Files, Master Password Lifetime (+20 more)

### Community 141 - "useSetting"
Cohesion: 0.11
Nodes (33): SettingsStackParamList, Stack, useSetting(), subscribeBrowserExtensionPairingChanges(), Props, styles, MetaInformationModule(), MetaInformationModuleType (+25 more)

### Community 142 - "linux"
Cohesion: 0.67
Nodes (3): linux, depends, deb

### Community 144 - "CreditCardModule.tsx"
Cohesion: 0.25
Nodes (14): CreditCardModule(), CreditCardState, detectCardBrand(), digitsOnly(), formatCardNumber(), maskCardNumber(), passesLuhn(), PinModule() (+6 more)

### Community 171 - "withIosGoogleOAuthScheme.js"
Cohesion: 0.43
Nodes (5): ensureUrlScheme(), normalizeClientId(), {
  ensureUrlScheme,
  toReverseClientIdScheme,
}, toReverseClientIdScheme(), { withInfoPlist }

### Community 172 - "browser-extension/package.json"
Cohesion: 0.17
Nodes (11): react, react-dom, @types/react, @types/react-dom, typescript, name, private, type (+3 more)

### Community 174 - "HomeScreen.tsx"
Cohesion: 0.05
Nodes (49): Common Refactor Targets, Files To Check First, Known Custom Screens, Screen Standardization Context, Standard Checklist, Chips, Compact Search Behavior, Content Panels (+41 more)

### Community 175 - "Firefox Store Release Notes"
Cohesion: 0.25
Nodes (7): Extension Identity, Firefox Store Release Notes, Listing, Pre-Submit Check, Privacy Policy Draft, Release Artifacts, Reviewer Notes

### Community 176 - "EmailModule.tsx"
Cohesion: 0.31
Nodes (6): EmailModule(), styles, EmailModuleType, EmnailModuleTypeSchema, regex, validateEmail()

### Community 178 - "ClavisPass Firefox Add-on Reviewer Build"
Cohesion: 0.33
Nodes (5): Build Steps, ClavisPass Firefox Add-on Reviewer Build, Environment, Firefox Add-on ID, Native Messaging Notes

### Community 179 - "I18nBridge.tsx"
Cohesion: 0.36
Nodes (5): I18nBridge(), initI18n(), AppLanguage, DEFAULT_LANG, toAppLanguage()

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

### Community 184 - "NoteMarkdownPreview.tsx"
Cohesion: 0.38
Nodes (6): InlinePart, InlineText(), NoteMarkdownPreview(), parseInline(), Props, styles

### Community 185 - "ClavisPassHubDiscoveryResult.ts"
Cohesion: 0.29
Nodes (6): ClavisPassHubDiscoveryResult, ClavisPassHubDiscoveryStatus, DiscoveryCheckingResult, DiscoveryErrorResult, DiscoveryIdleResult, DiscoverySuccessResult

### Community 189 - "App.tsx"
Cohesion: 0.11
Nodes (24): AppShell(), DemoBootstrap(), MainWindowReadySignal(), withAlpha(), AuthProvider(), DevModeProvider(), OnlineProvider(), createDemoVault() (+16 more)

### Community 190 - "NoteFullscreenEditor.web.tsx"
Cohesion: 0.33
Nodes (5): @monaco-editor/react, MONACO_LANGUAGE_BY_NOTE_LANGUAGE, NoteFullscreenEditor(), Props, styles

### Community 191 - "render.tsx"
Cohesion: 0.11
Nodes (17): react-test-renderer, loadSettingWithTimeout(), SettingsProvider(), ClearCompletedTasksModal(), Props, ClearModulesModal(), Props, Props (+9 more)

### Community 192 - "ref_react"
Cohesion: 0.06
Nodes (15): BrandHeaderProps, InlineNoticeProps, react-native-svg, Props, styles, Props, Props, Props (+7 more)

### Community 193 - "errorBus.ts"
Cohesion: 0.42
Nodes (6): Listener, listeners, subscribeGlobalError(), unsubscribeGlobalError(), GlobalErrorPayload, GlobalErrorSnackbar()

### Community 194 - "pkce.web.ts"
Cohesion: 0.80
Nodes (4): base64Url(), createPkcePair(), randomBytes(), toCodeChallenge()

### Community 195 - "dependencies"
Cohesion: 0.50
Nodes (4): dependencies, react, react-dom, tldts

### Community 203 - "container/AnimatedOpacityContainer.tsx"
Cohesion: 0.31
Nodes (6): AnimatedOpacityContainer(), Props, AnimatedOpacityContainerWeb(), Props, Props, AnimatedOpacityContainer()

## Knowledge Gaps
- **130 isolated node(s):** `react`, `react-dom`, `@types/chrome`, `@types/react`, `@types/react-dom` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1706 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **42 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `package.json`, `ModulesEnum`, `store.ts`, `ValuesType`, `useSetting`, `ModulesEnum.ts`, `triggerGlobalError`, `ClavisPassHubClient.ts`, `LoginScreen.tsx`, `DraggableModulesList.shared.tsx`, `withIosGoogleOAuthScheme.js`, `googleOAuth.ts`, `HomeScreen.tsx`, `DeviceStorageClient.ts`, `bitwarden.ts`, `react-i18next`, `vite.config.ts`, `render.tsx`, `appScheme.test.ts`, `autofill-cache.ts`, `modulePolicy.ts`, `VaultProvider.tsx`, `deriveIdentityClusters.ts`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **What connects `react`, `react-dom`, `@types/chrome` to the rest of the system?**
  _130 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CryptoProvider` be split into smaller, more focused modules?**
  _Cohesion score 0.0703962703962704 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.01904761904761905 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `getModule.tsx`, `package.json`, `useTheme`, `Header`, `EditScreen.tsx`, `store.ts`, `mobileUpdater.ts`, `useSetting`, `ModulesEnum.ts`, `CreditCardModule.tsx`, `model/types.ts`, `FastAccess.ts`, `ModuleContainer`, `AnalysisScreen.tsx`, `isTauri.ts`, `UpdateManager.tsx`, `LoginScreen.tsx`, `AttachmentModule.tsx`, `NoteModule.tsx`, `DraggableModulesList.shared.tsx`, `authenticateUser.ts`, `googleOAuth.ts`, `AuthProvider.tsx`, `HomeScreen.tsx`, `EmailModule.tsx`, `AnalysisDetailScreen.tsx`, `react-i18next`, `ThemeProvider.tsx`, `NoteMarkdownPreview.tsx`, `GlobalClipboardSnackbar.tsx`, `App.tsx`, `NoteFullscreenEditor.web.tsx`, `ref_react`, `errorBus.ts`, `detectTauriEnvironment`, `CustomTitlebar.tsx`, `OnlineProvider.tsx`, `container/AnimatedOpacityContainer.tsx`, `BrowserBridgePairingPrompt.tsx`, `ExpiryNotificationScheduler.tsx`, `RecoveryCodesModule.tsx`, `FilterAnalysisModal.tsx`, `react-native-reanimated`, `Sync.tsx`, `TotpModule.tsx`, `ClavisPassHubLoginButton.tsx`, `CardItem.tsx`, `DigitalCardModule.tsx`, `SettingsScreen.tsx`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `getModule.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.045346534653465345 - nodes in this community are weakly interconnected._
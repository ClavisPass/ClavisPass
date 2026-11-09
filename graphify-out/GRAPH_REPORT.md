# Graph Report - ClavisPass  (2026-11-09)

## Corpus Check
- 601 files · ~369,992 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 37 file(s) not represented in the graph (top: .xml 11, (none) 8, .properties 2)

## Summary
- 4070 nodes · 11452 edges · 207 communities (163 shown, 44 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 178 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bafe0cdb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- VaultV2.ts
- dependencies
- getModule.tsx
- NoteFullscreenEditor.web.tsx
- package.json
- AnalysisScreen.tsx
- AnimatedPressable
- bitwarden.ts
- LeftSideBar.tsx
- analysisEngine.ts
- IdentityDetailScreen.tsx
- content/index.ts
- shared/types.ts
- popup/App.tsx
- ModulesEnum.ts
- background/index.ts
- shared/bridge.ts
- mapKdbxToClavisPass.ts
- vitest
- detectTauriEnvironment
- ThemeProvider.tsx
- expo
- ClavisPassHubClient.ts
- HomeScreen.tsx
- write.rs
- scripts
- CloseBehaviorState
- manifest.json
- ObjcId
- forms.ts
- lib.rs
- ClavisPass Native Messaging Bridge
- SettingsScreen.tsx
- vaultRecovery.ts
- commands.rs
- LoginScreen.tsx
- DeviceStorageClient.ts
- ModulesEnum
- state.ts
- ModulesList.tsx
- AttachmentModule.tsx
- ClavisPass Passkey Management Roadmap
- host.rs
- vault.rs
- SettingInfoButton.tsx
- release.js
- ValuesType.ts
- isTauri.ts
- NoteEditorScreen.tsx
- ClavisPass Website Marketing Brief
- useTheme
- pairing.rs
- appScheme.test.ts
- Idee: Identity als persönlicher Hauptscreen
- useVault
- ref_react
- vite.config.ts
- devDependencies
- prepare-msix.js
- Totp
- screen_lock.rs
- VaultProvider.tsx
- ClavisPass
- AuthProvider.tsx
- EditScreen.tsx
- compilerOptions
- UpdateManager.tsx
- webauthn.rs
- NavigationContainer.tsx
- reactNativePaper.tsx
- MainApplication.kt
- modulePolicy.ts
- model/types.ts
- Datenschutzerklärung
- autofill-preferences.ts
- CreditCardModule.tsx
- Privacy Policy
- protocol.rs
- Nutzungsbedingungen
- BrowserBridgePairingPrompt.tsx
- prepare-native-host-sidecar.js
- BrowserBridgeWriteSync.tsx
- rnSodiumProvider.ts
- MainActivity.kt
- session.rs
- scripts
- AddModuleModal.tsx
- App.tsx
- hotkeys.ts
- bridge_commands.rs
- Terms Of Use
- UI Context
- Header
- check-tauri-version-sync.js
- prepare-sodium-16kb.js
- ClavisPass Product Strategy Roadmap
- generatePassword.ts
- bundle
- getModuleData
- Identity Management Concept
- triggerGlobalError
- i18n/index.ts
- tauri.conf.json
- withAndroidApplicationId.js
- build-web-demo.js
- MenuItem
- plugins
- editHistory.ts
- ValueIconsEnum
- Provider
- DocumentTypeEnum
- vcardExport.ts
- Login.tsx
- reactNative.ts
- reactNativeReanimated.tsx
- reactNavigationNative.ts
- devDependencies
- compilerOptions
- GoogleDriveLoginButton.tsx
- tsconfig.json
- Store Release Roadmap
- native_host_registration.rs
- secureStore.ts
- RecoveryCodesModule.tsx
- domain.ts
- serve-webauthn-test-page.js
- store.ts
- macOS
- windows
- gorhomBottomSheet.tsx
- WifiTypeEnum
- build
- vite-env.d.ts
- NoteModule.tsx
- GoogleDriveClient.ts
- BridgeStatusBadge.tsx
- react-i18next
- linux
- asyncStorage.ts
- extractFastAccessObject.ts
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
- useSetting
- Firefox Store Release Notes
- Button.tsx
- generate-webauthn-test-passkey.js
- ClavisPass Firefox Add-on Reviewer Build
- vaultDevices.ts
- Bitwarden Import Roadmap
- Agent Workflow Context
- Build, Release, And Update Context
- Identity Context
- ScanScreen.tsx
- Desktop And Tauri Context
- CLAUDE.md
- .claude/CLAUDE.md
- GlobalClipboardSnackbar.tsx
- EmailModule.tsx
- Sync And Storage Context
- errorBus.ts
- SettingsQuickSelect.tsx
- ContentProtectionProvider.tsx
- dependencies
- pinnedEntries.ts
- Crypto Context
- SettingsProvider.tsx
- ClavisPass Browser Extension
- RemoteFileContent.ts
- CardDetailsScreen.tsx
- ClavisPassHubDiscoveryResult.ts
- Website presets
- pkce.web.ts
- serialize
- AuthReplyBlock

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 283 edges
2. `react-native` - 190 edges
3. `react-native-paper` - 135 edges
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

## Communities (207 total, 44 thin omitted)

### Community 0 - "VaultV2.ts"
Cohesion: 0.11
Nodes (31): CryptoProvider, getCryptoProvider(), verifyProviderInDev(), decodeRecoveryKey(), makeV3PayloadAad(), recoveryAad(), unwrapRecoveryKey(), wrapRecoveryKey() (+23 more)

### Community 1 - "dependencies"
Cohesion: 0.02
Nodes (105): dependencies, argon2-browser, @babel/plugin-proposal-export-namespace-from, base64-js, crypto-js, expo, expo-auth-session, expo-blur (+97 more)

### Community 2 - "getModule.tsx"
Cohesion: 0.05
Nodes (67): zod, AddressModuleType, AddressModuleTypeSchema, regex, AttachmentFileSchema, AttachmentModuleType, AttachmentModuleTypeSchema, CompanyModuleType (+59 more)

### Community 3 - "NoteFullscreenEditor.web.tsx"
Cohesion: 0.33
Nodes (5): @monaco-editor/react, MONACO_LANGUAGE_BY_NOTE_LANGUAGE, NoteFullscreenEditor(), Props, styles

### Community 4 - "package.json"
Cohesion: 0.03
Nodes (73): react, react-dom, @types/react, @types/react-dom, typescript, main, name, private (+65 more)

### Community 5 - "AnalysisScreen.tsx"
Cohesion: 0.08
Nodes (42): @react-native-masked-view/masked-view, Stack, useAuthMaster(), FiltersNarrow, deriveAnalysisPepperFromMaster(), getPasswordStrengthColor(), AnalysisDetailScreen(), AnalysisDetailScreenProps (+34 more)

### Community 6 - "AnimatedPressable"
Cohesion: 0.12
Nodes (30): FolderFilter(), Props, styles, CategoryItem(), dragDropAnimationConfig, DraggableFolderList(), FolderDragHandle(), fullWidthDividerStyle (+22 more)

### Community 7 - "bitwarden.ts"
Cohesion: 0.20
Nodes (24): addCardModule(), addCustomField(), addExpiryModule(), addIdentityModules(), addLoginModules(), addNote(), addPasskeyModules(), addSshKeyModule() (+16 more)

### Community 8 - "LeftSideBar.tsx"
Cohesion: 0.13
Nodes (18): expo-constants, @expo/vector-icons, @react-navigation/bottom-tabs, CustomBottomTab(), getActiveRouteName(), getActiveRouteName(), LeftSideTabBar(), sidebarWidth (+10 more)

### Community 9 - "analysisEngine.ts"
Cohesion: 0.09
Nodes (34): expo-crypto, AnalysisFlags, AnalysisRef, CachedAnalysisItem, CacheResult, PasswordStrengthLevel, MEDIUM, STRONG (+26 more)

### Community 10 - "IdentityDetailScreen.tsx"
Cohesion: 0.11
Nodes (34): @react-navigation/native, IdentityStackParamList, IdentityStack(), Stack, IdentityEmailLogo(), IdentityEmailLogoProps, styles, buildPasswordUseCounts() (+26 more)

### Community 11 - "content/index.ts"
Cohesion: 0.08
Nodes (48): applyTargets(), buildNoFieldsResult(), collectFillTargets(), emitInputEvents(), executeFill(), FillPreviewResult, FillSnapshot, FillTarget (+40 more)

### Community 12 - "shared/types.ts"
Cohesion: 0.05
Nodes (49): BackgroundHandler, BackgroundHandlerMap, BackgroundMessageContext, BackgroundMessageRouter, getActiveDomainContext(), normalizeLookupHost(), parseActiveDomain(), sanitizeHost() (+41 more)

### Community 13 - "popup/App.tsx"
Cohesion: 0.06
Nodes (44): registerContentFrame(), setupSavePromptListener(), setupWebAuthnProbe(), App(), handleFill(), handleOpenDesktopApp(), handlePasskeyAssertion(), handlePromptResolution() (+36 more)

### Community 14 - "ModulesEnum.ts"
Cohesion: 0.10
Nodes (37): expo-linking, ExpiryPickerModal(), ModuleContainer(), ModuleContainerProps, moduleStyles, AddressModule(), AddressState, CompanyModule() (+29 more)

### Community 15 - "background/index.ts"
Cohesion: 0.10
Nodes (51): clearAutofillDomainCache(), countPasswordSuggestions(), countVisibleSuggestions(), DomainAutofillCache, DomainAutofillCacheEntry, getAutofillEligibilityForUrl(), getCachedAutofillMatchCountForUrl(), getCachedMatchCount() (+43 more)

### Community 16 - "shared/bridge.ts"
Cohesion: 0.07
Nodes (51): Desktop bridge, deriveAppState(), DesktopBridgeService, getStoredPairingStatus(), normalizeAssertionCredential(), normalizeDesktopStatus(), normalizeFillData(), normalizePasskeyMetadata() (+43 more)

### Community 17 - "mapKdbxToClavisPass.ts"
Cohesion: 0.15
Nodes (22): kdbxweb, configureKdbxArgon2(), importKdbx(), addCustomField(), addTotpModule(), addValueModule(), binaryToBytes(), binaryWithMetaToAttachment() (+14 more)

### Community 18 - "vitest"
Cohesion: 0.23
Nodes (10): react-test-renderer, vitest, verifyKey, native, update, devices, setPlatform(), renderBare() (+2 more)

### Community 19 - "detectTauriEnvironment"
Cohesion: 0.10
Nodes (46): App(), AppWithNavigation(), getCurrentWindowSafe(), @tauri-apps/api, ThemeProvider(), BrowserBridgeSessionSync(), FastAccessSessionBridge(), MobileFastAccessOverlay() (+38 more)

### Community 20 - "ThemeProvider.tsx"
Cohesion: 0.08
Nodes (29): @gorhom/bottom-sheet, react-native-circular-progress, react-native-paper, Props, ThemeContext, ThemeContextType, AnalysisEntry(), Props (+21 more)

### Community 21 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, adaptiveIcon, blockedPermissions, package, permissions, versionCode, projectId (+31 more)

### Community 22 - "ClavisPassHubClient.ts"
Cohesion: 0.12
Nodes (34): calculateExpiresIn(), checkDiscovery(), createHubError(), createHubErrorFromPayload(), DiscoveryResponse, fetchFile(), fetchUserInfo(), getConfiguredHostUrl() (+26 more)

### Community 23 - "HomeScreen.tsx"
Cohesion: 0.11
Nodes (23): invokeTauriSystemAuthAvailable(), isSystemAuthenticationAvailable(), saveAuthentication(), ExpiryStatus, extractUrlFromEntry(), formatRelative(), getRelativeInfo(), getStatus() (+15 more)

### Community 24 - "write.rs"
Cohesion: 0.10
Nodes (35): as_io_error(), BrowserWriteKind, CreateEntryFromBrowser, ReservePasskeyAssertion, UpdateEntryFromBrowser, BrowserWriteRequest, BrowserWriteRequestStore, BrowserWriteResult (+27 more)

### Community 25 - "scripts"
Cohesion: 0.05
Nodes (39): scripts, android, android:build:apk, android:build:store, android:build:store-submit, android:submit:store, extension:build, extension:build:chrome (+31 more)

### Community 26 - "CloseBehaviorState"
Cohesion: 0.13
Nodes (10): claim_pending_lock_request(), close_main_window(), CloseBehavior, Exit, Hide, CloseBehaviorState, focus_main_window(), schedule_exit_watchdog() (+2 more)

### Community 27 - "manifest.json"
Cohesion: 0.06
Nodes (35): action, default_icon, default_popup, default_title, background, service_worker, type, browser_specific_settings (+27 more)

### Community 28 - "ObjcId"
Cohesion: 0.22
Nodes (15): authenticate_with_system_impl(), _Block_copy(), _Block_release(), check_system_auth_available(), cstring(), new_la_context(), _NSConcreteStackBlock, objc_class() (+7 more)

### Community 29 - "forms.ts"
Cohesion: 0.11
Nodes (35): getPrimaryPasswordField(), AutofillPlan, buildAutofillPlan(), buildDetachedContainer(), buildFieldKey(), buildFieldText(), buildFormId(), chooseBestField() (+27 more)

### Community 30 - "lib.rs"
Cohesion: 0.11
Nodes (19): clamp_window_size(), clamp_window_size_to_monitor(), DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIDTH, emit_lock_vault(), emit_vault_file_open_request(), get_requested_vault_file_path(), get_window_size_file_path() (+11 more)

### Community 31 - "ClavisPass Native Messaging Bridge"
Cohesion: 0.08
Nodes (23): Chosen architecture, Chromium and Edge registration, ClavisPass Native Messaging Bridge, Edge verification, Example usage, Expected failure cases, Future hardening, Local development (+15 more)

### Community 32 - "SettingsScreen.tsx"
Cohesion: 0.08
Nodes (29): simple-icons, @tauri-apps/plugin-shell, useDevMode(), Corner, CornerOption(), FastAccessPosition, FastAccessPositionPicker(), Props (+21 more)

### Community 33 - "vaultRecovery.ts"
Cohesion: 0.12
Nodes (28): libsodium-wrappers-sumo, VaultDataTypeSchema, DecryptVaultContentResult, DEFAULT_ENCRYPT_MODE, EncryptMode, EncryptVaultContentResult, getCryptoProvider(), td (+20 more)

### Community 34 - "commands.rs"
Cohesion: 0.10
Nodes (10): AUTH_REPLY_SIGNATURE, authenticate_with_system(), BLOCK_HAS_SIGNATURE, CF_UNICODETEXT_FORMAT, get_main_window_hwnd(), LAPOLICY_DEVICE_OWNER_AUTHENTICATION, reset_window_size(), set_content_protection() (+2 more)

### Community 35 - "LoginScreen.tsx"
Cohesion: 0.12
Nodes (41): expo-web-browser, OAuthRefreshError, Props, StoredAuth, TokenContext, useToken(), OnlineContext, OnlineContextType (+33 more)

### Community 36 - "DeviceStorageClient.ts"
Cohesion: 0.27
Nodes (15): cacheSyncedVault(), fetchFile(), getActiveLocalVaultIdKey(), getLocalSyncKey(), getLocalSyncMetadataKey(), getVaultLocalSyncKey(), getVaultLocalSyncMetadataKey(), isVersionedRecoveryVault() (+7 more)

### Community 37 - "ModulesEnum"
Cohesion: 0.07
Nodes (29): payload, PasskeyModuleType, PasskeyModuleTypeSchema, regex, ModulesEnum, ADDRESS, ATTACHMENT, COMPANY (+21 more)

### Community 38 - "state.ts"
Cohesion: 0.10
Nodes (18): buildCreatePayload(), buildUpdatePayload(), resolvePromptWithDesktopWrite(), toAppliedResult(), buildPromptTitle(), ExtensionState, normalizeIdentity(), PreparedFillRecord (+10 more)

### Community 39 - "ModulesList.tsx"
Cohesion: 0.12
Nodes (24): Important Boundaries, Reorder Flows, Shared Module UI, Vault Modules Context, Verification, NativeDragHandleScrollLockProvider(), WebDragHandlePropsProvider(), dragDropAnimationConfig (+16 more)

### Community 40 - "AttachmentModule.tsx"
Cohesion: 0.17
Nodes (19): expo-document-picker, @tauri-apps/plugin-dialog, AttachmentModule(), canPreviewAttachment(), downloadBrowserAttachment(), formatBytes(), getAttachmentIcon(), getFileExtension() (+11 more)

### Community 41 - "ClavisPass Passkey Management Roadmap"
Cohesion: 0.18
Nodes (10): ClavisPass Passkey Management Roadmap, Core Principles, Phase 0: Architecture Decision, Phase 1: Vault Passkey Module, Phase 3: Import And Export Preparation, Phase 5: Platform Integration, Phase 6: Security, UX, And Verification, Product Scope (+2 more)

### Community 42 - "host.rs"
Cohesion: 0.13
Nodes (23): app_scheme(), AssertPasskeyPayload, bridge_result_to_response(), ensure_ready(), FillPayload, handle_request(), is_es256_algorithm(), MatchPasskeysPayload (+15 more)

### Community 43 - "vault.rs"
Cohesion: 0.11
Nodes (39): domain_contains(), entry_match_hosts(), fill_data_for_entry(), FillDataResult, first_string(), FolderRef, has_passkey(), login_entry() (+31 more)

### Community 44 - "SettingInfoButton.tsx"
Cohesion: 0.16
Nodes (15): useContentProtection(), FilterAnalysisModal(), Props, getPasswordStrengthIcon(), ContentProtectionSettingsToggle(), Props, Props, SettingInfo (+7 more)

### Community 45 - "release.js"
Cohesion: 0.12
Nodes (19): androidGradleHasVersionCode(), androidGradleHasVersionName(), androidStringsHasRuntimeVersion(), cargoLockHasVersion(), cargoTomlHasVersion(), { execSync }, existingTags, filesToUpdate (+11 more)

### Community 46 - "ValuesType.ts"
Cohesion: 0.18
Nodes (13): papaparse, VaultContextType, Import(), PendingKdbxFile, Props, styles, decrypt(), ModulesTypeSchema (+5 more)

### Community 47 - "isTauri.ts"
Cohesion: 0.13
Nodes (19): configureMobileFastAccess(), getClipboardText(), setClipboardText(), tryNavigatorReadText(), tryNavigatorWriteText(), ClipboardContentKind, clipboardOwnership, fingerprintValue() (+11 more)

### Community 48 - "NoteEditorScreen.tsx"
Cohesion: 0.19
Nodes (12): NoteFullscreenEditor(), Props, styles, InlinePart, InlineText(), NoteMarkdownPreview(), parseInline(), Props (+4 more)

### Community 49 - "ClavisPass Website Marketing Brief"
Cohesion: 0.05
Nodes (43): Attachments And Previews, Brand Details, Bring Your Own Sync, Browser Extension, Can I import my existing passwords?, Can my cloud provider read my passwords?, ClavisPass Website Marketing Brief, Conversion Priorities (+35 more)

### Community 50 - "useTheme"
Cohesion: 0.11
Nodes (32): Item Surfaces, SettingsStackParamList, SettingsStack(), Stack, useTheme(), subscribeBrowserExtensionPairingChanges(), EditRowControlsContainer(), ExpiryOverviewItem() (+24 more)

### Community 51 - "pairing.rs"
Cohesion: 0.21
Nodes (21): approve_pairing(), evaluate_pairing(), list_paired_clients(), list_pending_pairings(), list_rejected_clients(), load_pairing_store(), now_ms(), optional_identity_matches() (+13 more)

### Community 52 - "appScheme.test.ts"
Cohesion: 0.43
Nodes (5): getAppRedirectUri(), getAppScheme(), Constants, resetExpoConfig(), setExpoConfig()

### Community 53 - "Idee: Identity als persönlicher Hauptscreen"
Cohesion: 0.22
Nodes (8): Datenschutz, Einschätzung, Gestaltungsprinzipien und offene Fragen, Idee: Identity als persönlicher Hauptscreen, Mögliche Ausbaustufen, Mögliche Funktionen, Technischer Ansatz, Ziel

### Community 54 - "useVault"
Cohesion: 0.11
Nodes (42): Current Vault Format, Implementation Phases, useAuth(), useVault(), VaultRecoverySetupDialog(), BackupExportButton(), BackupImportButton(), ChangeMasterPasswordModal() (+34 more)

### Community 55 - "ref_react"
Cohesion: 0.04
Nodes (43): BrandHeaderProps, InlineNoticeProps, react-native, react-native-gesture-handler, react-native-reanimated, react-native-svg, Pattern(), Props (+35 more)

### Community 57 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, @babel/core, eslint, eslint-config-universe, patch-package, prettier, react-test-renderer, @tauri-apps/cli (+14 more)

### Community 58 - "prepare-msix.js"
Cohesion: 0.10
Nodes (16): appExe, appVersion, assetsOutputDir, createUnplatedTargetSizeIcons(), escapePowerShellSingleQuoted(), fs, manifest, manifestSource (+8 more)

### Community 59 - "Totp"
Cohesion: 0.32
Nodes (6): otpauth, Totp(), TotpModule(), codeFromUri(), parseOtpauth(), TotpAlgo

### Community 60 - "screen_lock.rs"
Cohesion: 0.13
Nodes (6): CGSessionCopyCurrentDictionary(), emit(), ScreenLockPayload, Session, start(), wndproc()

### Community 61 - "VaultProvider.tsx"
Cohesion: 0.09
Nodes (36): VaultContext, VaultData, VaultDataType, VaultEntryTombstone, VaultEntryTombstoneSchema, VaultDeviceSchema, VaultDeviceType, VaultSessionState (+28 more)

### Community 62 - "ClavisPass"
Cohesion: 0.07
Nodes (28): 1. VaultSession (Authoritative & Secret-Capable), 2. VaultProvider (UI-Safe Projection), Authentication & Master Secret Handling, Backend / Plattform, CI / CD & Deployment, ClavisPass, Cryptography & Encryption Model, Defensive Defaults (+20 more)

### Community 63 - "AuthProvider.tsx"
Cohesion: 0.17
Nodes (11): AuthContext, AuthContextType, AuthMasterContext, AuthMasterContextType, Props, ScreenLockLogoutController, initScreenLockLogout(), ListenFn (+3 more)

### Community 64 - "EditScreen.tsx"
Cohesion: 0.08
Nodes (42): extractFastAccessObject(), ellipsize(), failedFaviconUrls, ListItem(), maskPassword(), Props, styles, ClearCompletedTasksModal() (+34 more)

### Community 65 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+11 more)

### Community 66 - "UpdateManager.tsx"
Cohesion: 0.11
Nodes (29): expo-updates, react-native-safe-area-context, @tauri-apps/plugin-updater, Listener, listeners, publishUpdateCheck(), subscribeUpdateCheck(), unsubscribeUpdateCheck() (+21 more)

### Community 67 - "webauthn.rs"
Cohesion: 0.10
Nodes (31): AssertionAuthenticatorResponse, AssertionPublicKeyCredential, AssertionSigningContext, base64url_decode(), base64url_encode(), base64url_round_trips_without_padding(), build_assertion_authenticator_data(), build_assertion_public_key_credential() (+23 more)

### Community 68 - "NavigationContainer.tsx"
Cohesion: 0.11
Nodes (23): @tauri-apps/plugin-global-shortcut, Props, ProtectedRoute(), styles, getFocusedRouteName(), NavigationnContainer(), titlebarContentDragRoutes, LoginStack() (+15 more)

### Community 69 - "reactNativePaper.tsx"
Cohesion: 0.11
Nodes (14): ActivityIndicator, baseColors, Button, Chip, Divider, Icon, IconButton, MD3DarkTheme (+6 more)

### Community 71 - "modulePolicy.ts"
Cohesion: 0.05
Nodes (41): Always Know, ClavisPass Agent Context, Context Routing, Fast Map, graphify, High-Risk Rules, Core Files, Master Password Lifetime (+33 more)

### Community 72 - "model/types.ts"
Cohesion: 0.06
Nodes (41): expo-camera, @react-navigation/native-stack, AddTriggerStackParamList, AnalysisStackParamList, AppTabsParamList, HomeStackParamList, LoginStackParamList, LogoutStackParamList (+33 more)

### Community 73 - "Datenschutzerklärung"
Cohesion: 0.09
Nodes (22): 10. Browser-Erweiterung, 11. Benachrichtigungen, 12. Kontaktaufnahme, 13. Webseite und Hosting, 14. Cookies, Tracking und Analytics, 15. App Stores und Download-Plattformen, 16. Rechtsgrundlagen, 17. Speicherdauer (+14 more)

### Community 74 - "autofill-preferences.ts"
Cohesion: 0.25
Nodes (13): buildPreferenceResult(), DEFAULT_POLICY, DomainPolicyStore, normalizeHost(), normalizeMode(), normalizePolicy(), readPolicyStore(), setInlineAutofillDisabledForHost() (+5 more)

### Community 75 - "CreditCardModule.tsx"
Cohesion: 0.31
Nodes (12): CreditCardModule(), CreditCardState, detectCardBrand(), digitsOnly(), formatCardNumber(), maskCardNumber(), passesLuhn(), concealActiveSecretReveal() (+4 more)

### Community 76 - "Privacy Policy"
Cohesion: 0.09
Nodes (22): 10. Browser Extension, 11. Notifications, 12. Contact, 13. Website And Hosting, 14. Cookies, Tracking And Analytics, 15. App Stores And Download Platforms, 16. Legal Bases, 17. Retention (+14 more)

### Community 77 - "protocol.rs"
Cohesion: 0.20
Nodes (7): BridgeClientInfo, BridgeError, BridgePairingEnvelope, BridgeRequest, BridgeResponse, HOST_NAME, PROTOCOL_VERSION

### Community 78 - "Nutzungsbedingungen"
Cohesion: 0.10
Nodes (20): 10. Erlaubte Nutzung, 11. Open Source und Lizenzen, 12. Kosten, 13. Drittanbieter, 14. Updates, 15. Haftung, 16. Beendigung der Nutzung, 17. Änderungen (+12 more)

### Community 79 - "BrowserBridgePairingPrompt.tsx"
Cohesion: 0.24
Nodes (12): BrowserBridgePairingPrompt(), PairingAction, PromptButton(), styles, actOnBrowserExtensionPairing(), BrowserExtensionPairingChangeListener, buildBrowserClientKey(), listBrowserExtensionPairings() (+4 more)

### Community 80 - "prepare-native-host-sidecar.js"
Cohesion: 0.15
Nodes (12): cargoArgs, { copyFileSync, existsSync, mkdirSync, writeFileSync }, detectHostTriple(), { execFileSync }, { join, resolve }, manifestPath, outputDir, outputPath (+4 more)

### Community 81 - "BrowserBridgeWriteSync.tsx"
Cohesion: 0.22
Nodes (16): applyUpdateToEntry(), BrowserBridgeWriteSync(), BrowserWriteKind, BrowserWriteRequest, createBrowserEntry(), CreatePayload, effectiveUrl(), normalizeText() (+8 more)

### Community 82 - "rnSodiumProvider.ts"
Cohesion: 0.22
Nodes (5): base64-js, react-native-sodium-jsi, rnSodiumProvider, td, te

### Community 84 - "session.rs"
Cohesion: 0.15
Nodes (15): bridge_dir(), BRIDGE_ENV_KEY, ensure_dir(), pairing_store_path(), platform_base_dir(), session_store_path(), write_request_store_path(), write_result_store_path() (+7 more)

### Community 85 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, build:chrome, build:firefox, build:firefox-local, dev, package:chrome, package:firefox (+8 more)

### Community 86 - "AddModuleModal.tsx"
Cohesion: 0.17
Nodes (13): AddModuleModalCompactFav(), defineModules(), IdsOf, MissingIds, ModuleCategory, ModuleMeta, Props, TinyFilterChip() (+5 more)

### Community 87 - "App.tsx"
Cohesion: 0.07
Nodes (40): AppShell(), DemoBootstrap(), MainWindowReadySignal(), withAlpha(), @tauri-apps/plugin-process, AuthProvider(), DevModeContext, DevModeContextType (+32 more)

### Community 88 - "hotkeys.ts"
Cohesion: 0.18
Nodes (13): ACTIONS, BLOCKED_HOTKEYS, DEFAULT_HOTKEYS, getDefaultHotkeys(), HotkeyAction, hotkeyFromKeyboardEvent(), HotkeyPlatform, isAllowedHotkey() (+5 more)

### Community 89 - "bridge_commands.rs"
Cohesion: 0.15
Nodes (8): bridge_approve_pairing(), bridge_claim_pending_writes(), bridge_complete_write_request(), bridge_list_paired_clients(), bridge_list_pending_pairings(), bridge_list_rejected_clients(), bridge_publish_session(), bridge_reject_pairing()

### Community 90 - "Terms Of Use"
Cohesion: 0.10
Nodes (20): 10. Permitted Use, 11. Open Source And Licenses, 12. Costs, 13. Third-Party Providers, 14. Updates, 15. Liability, 16. Ending Use, 17. Changes (+12 more)

### Community 91 - "UI Context"
Cohesion: 0.22
Nodes (8): i18n, Important Files, Interaction Polish, Menus And Dropdowns, Platform Model, Related UI Context, Titlebar And Chrome, UI Context

### Community 92 - "Header"
Cohesion: 0.06
Nodes (46): Common Refactor Targets, Files To Check First, Known Custom Screens, Screen Standardization Context, Standard Checklist, Chips, Compact Search Behavior, Content Panels (+38 more)

### Community 93 - "check-tauri-version-sync.js"
Cohesion: 0.24
Nodes (11): collectMismatches(), fs, getMajorMinor(), getNpmLockVersion(), mismatches, parseCargoLockVersions(), path, readJson() (+3 more)

### Community 94 - "prepare-sodium-16kb.js"
Cohesion: 0.15
Nodes (12): download(), findEndOfCentralDirectory(), fs, https, main(), os, path, readZipEntries() (+4 more)

### Community 95 - "ClavisPass Product Strategy Roadmap"
Cohesion: 0.11
Nodes (17): 1. Browser Extension Polish, 2. Passkeys, 3. Emergency Access / Trusted Contact, 4. Optional Web App, 5. Separate Secrets Sharing SaaS, Bitwarden Gaps To Treat As Strategic, ClavisPass Personal, ClavisPass Product Strategy Roadmap (+9 more)

### Community 96 - "generatePassword.ts"
Cohesion: 0.29
Nodes (5): generatePassword(), LOWERCASE_CHAR_CODES, NUMBER_CHAR_CODES, SYMBOL_CHAR_CODES, UPPERCASE_CHAR_CODES

### Community 97 - "bundle"
Cohesion: 0.17
Nodes (12): bundle, active, category, copyright, createUpdaterArtifacts, externalBin, fileAssociations, icon (+4 more)

### Community 98 - "getModuleData"
Cohesion: 0.10
Nodes (26): Editor(), TemplateEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY (+18 more)

### Community 99 - "Identity Management Concept"
Cohesion: 0.13
Nodes (14): Confidence And Trust, Core Idea, Data Model Direction, Design Tone, Identity Detail View, Identity Management Concept, Identity Tab, Important Principle (+6 more)

### Community 100 - "triggerGlobalError"
Cohesion: 0.16
Nodes (17): @tauri-apps/plugin-fs, fetchFile(), fetchUserInfo(), refreshAccessToken(), uploadFile(), fetchUserInfo(), ensureDesktop(), fetchFile() (+9 more)

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

### Community 105 - "MenuItem"
Cohesion: 0.12
Nodes (25): FilterItem, FiltersNarrowProps, FiltersWide, FiltersWideProps, styles, ExpiryOverviewEntry, HomeFilterMenu(), Props (+17 more)

### Community 106 - "plugins"
Cohesion: 0.20
Nodes (10): args, customProtocol, plugins, cli, deepLink, updater, endpoints, pubkey (+2 more)

### Community 107 - "editHistory.ts"
Cohesion: 0.21
Nodes (13): Editor(), appendLog(), areValuesEqual(), cloneValue(), createLogEntry(), EditHistoryActionType, EditHistoryMeta, EditSessionLogEntry (+5 more)

### Community 108 - "ValueIconsEnum"
Cohesion: 0.14
Nodes (13): ValueIconsEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+5 more)

### Community 109 - "Provider"
Cohesion: 0.48
Nodes (4): TokenContextValue, FetchFileParams, TokenRefreshParams, Provider

### Community 110 - "DocumentTypeEnum"
Cohesion: 0.33
Nodes (6): DocumentTypeEnum, BITWARDEN, CHROME, FIREFOX, KDBX, PCLOUD

### Community 111 - "vcardExport.ts"
Cohesion: 0.30
Nodes (11): expo-file-system, expo-sharing, buildFormattedName(), buildVCard(), canExportVCard(), clean(), escapeVCardText(), exportVCard() (+3 more)

### Community 112 - "Login.tsx"
Cohesion: 0.15
Nodes (23): passwordEntropy(), Login(), Props, VaultRecoveryDialog(), authenticateUser(), invokeTauriSystemAuth(), isUsingAuthentication(), loadAuthentication() (+15 more)

### Community 113 - "reactNative.ts"
Cohesion: 0.12
Nodes (12): Animated, AnimatedValue, Dimensions, InteractionManager, Platform, Pressable, ScrollView, StyleSheet (+4 more)

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
Cohesion: 0.18
Nodes (20): expo-auth-session, expo-random, @fabianlars/tauri-plugin-oauth, ANDROID_AUTH_PROMPT_OPTIONS, DESKTOP_OAUTH_PORTS, getMobileRedirectUri(), GoogleDriveLoginButtonContent(), randState() (+12 more)

### Community 119 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, moduleResolution, strict, exclude, extends

### Community 120 - "Store Release Roadmap"
Cohesion: 0.17
Nodes (11): Apple Developer Program, Arratel Setup Plan, Chrome Web Store, Goals, Google Play, Microsoft Store, Publisher Naming, References (+3 more)

### Community 121 - "native_host_registration.rs"
Cohesion: 0.21
Nodes (10): CHROME_EXTENSION_IDS, chromium_origins(), CREATE_NO_WINDOW, EDGE_EXTENSION_IDS, find_native_host_exe(), FIREFOX_EXTENSION_ID, native_host_candidates(), NATIVE_HOST_NAME (+2 more)

### Community 122 - "secureStore.ts"
Cohesion: 0.40
Nodes (10): CloudProvider(), isInvalidGrant(), logout(), clearClavisPassHubVaultEtag(), getData(), getTauriCore(), getWebStorageKey(), removeData() (+2 more)

### Community 123 - "RecoveryCodesModule.tsx"
Cohesion: 0.25
Nodes (9): RecoveryCodesModule(), splitKeepingRemainder(), styles, tokenize(), RecoveryCodeSchema, RecoveryCodesModuleType, RecoveryCodesModuleTypeSchema, regex (+1 more)

### Community 124 - "domain.ts"
Cohesion: 0.27
Nodes (10): buildEntrySuggestions(), normalizeHost(), normalizeLookupHost(), normalizeRpHost(), safeUrl(), scoreUrlMatch(), searchEntries(), validateWebAuthnRpId() (+2 more)

### Community 125 - "serve-webauthn-test-page.js"
Cohesion: 0.25
Nodes (4): __dirname, pagePath, port, server

### Community 126 - "store.ts"
Cohesion: 0.15
Nodes (20): @react-native-async-storage/async-storage, BooleanDef, DEVICE_RESET_KEYS, EnumDef, get(), isModulesEnumValue(), JsonDef, listeners (+12 more)

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
Cohesion: 0.13
Nodes (17): JsonLine(), NoteCodePreview(), Props, styles, clamp(), DISPLAY_MODE_HEIGHTS, DISPLAY_MODES, NOTE_VARIANTS (+9 more)

### Community 138 - "GoogleDriveClient.ts"
Cohesion: 0.14
Nodes (20): buildMultipartBody(), escapeDriveQueryString(), fetchFile(), findFileIdByName(), GoogleTokenRefreshError, readJsonSafe(), readTextSafe(), refreshAccessToken() (+12 more)

### Community 141 - "react-i18next"
Cohesion: 0.08
Nodes (43): react-i18next, actionStyle, Props, Props, styles, BrowserExtensionsModal(), Props, Props (+35 more)

### Community 142 - "linux"
Cohesion: 0.67
Nodes (3): linux, depends, deb

### Community 144 - "extractFastAccessObject.ts"
Cohesion: 0.15
Nodes (12): FastAccessType, FastAccessTypeSchema, Props, QuickSelect(), styles, PasswordModuleType, PasswordModuleTypeSchema, regex (+4 more)

### Community 171 - "withIosGoogleOAuthScheme.js"
Cohesion: 0.43
Nodes (5): ensureUrlScheme(), normalizeClientId(), {
  ensureUrlScheme,
  toReverseClientIdScheme,
}, toReverseClientIdScheme(), { withInfoPlist }

### Community 172 - "browser-extension/package.json"
Cohesion: 0.17
Nodes (11): react, react-dom, @types/react, @types/react-dom, typescript, name, private, type (+3 more)

### Community 174 - "useSetting"
Cohesion: 0.22
Nodes (13): @react-native-assets/slider, useSetting(), AppearanceSettingsSection(), Props, DarkModeSwitch(), ThemePreviewCard(), GlassAppearanceSettings(), Preview() (+5 more)

### Community 175 - "Firefox Store Release Notes"
Cohesion: 0.25
Nodes (7): Extension Identity, Firefox Store Release Notes, Listing, Pre-Submit Check, Privacy Policy Draft, Release Artifacts, Reviewer Notes

### Community 176 - "Button.tsx"
Cohesion: 0.29
Nodes (7): expo-linear-gradient, AnalysisEntryGradient(), Props, Content(), Props, styles, getColors()

### Community 178 - "ClavisPass Firefox Add-on Reviewer Build"
Cohesion: 0.33
Nodes (5): Build Steps, ClavisPass Firefox Add-on Reviewer Build, Environment, Firefox Add-on ID, Native Messaging Notes

### Community 179 - "vaultDevices.ts"
Cohesion: 0.23
Nodes (10): daysBetween(), DEFAULT_DEVICE_UI_POLICY, deriveDeviceUiStatus(), DeviceUiPolicy, DeviceUiStatus, earliestIso(), hasSameDeviceIdentity(), normalizeDeviceIdentityPart() (+2 more)

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

### Community 184 - "ScanScreen.tsx"
Cohesion: 0.33
Nodes (6): refreshAccessToken(), SessionQrPayload, ScanScreen(), ScanScreenProps, styles, isSessionQrPayload()

### Community 185 - "Desktop And Tauri Context"
Cohesion: 0.29
Nodes (6): Chrome And Drag Regions, Core Files, Desktop And Tauri Context, Fast Access, Runtime Model, Tauri Responsibilities

### Community 189 - "GlobalClipboardSnackbar.tsx"
Cohesion: 0.25
Nodes (8): clipboardClearScheduler, Handler, handlers, subscribeClipboardCopied(), unsubscribeClipboardCopied(), ClipboardCopyPayload, GlobalClipboardSnackbar(), msToSecCeil()

### Community 190 - "EmailModule.tsx"
Cohesion: 0.31
Nodes (6): EmailModule(), styles, EmailModuleType, EmnailModuleTypeSchema, regex, validateEmail()

### Community 191 - "Sync And Storage Context"
Cohesion: 0.25
Nodes (7): Core Files, Providers, Settings Schema, Storage Layers, Sync And Storage Context, Tokens, StoreSchema

### Community 192 - "errorBus.ts"
Cohesion: 0.42
Nodes (6): Listener, listeners, subscribeGlobalError(), unsubscribeGlobalError(), GlobalErrorPayload, GlobalErrorSnackbar()

### Community 193 - "SettingsQuickSelect.tsx"
Cohesion: 0.36
Nodes (6): clampWidth(), Props, SettingsQuickSelect(), styles, DraggableHandle(), HandleProps

### Community 194 - "ContentProtectionProvider.tsx"
Cohesion: 0.32
Nodes (6): expo-screen-capture, applyNativeContentProtection(), applyTauriContentProtection(), ContentProtectionContext, ContentProtectionContextValue, ContentProtectionProvider()

### Community 195 - "dependencies"
Cohesion: 0.50
Nodes (4): dependencies, react, react-dom, tldts

### Community 196 - "pinnedEntries.ts"
Cohesion: 0.60
Nodes (4): comparePinnedFirst(), isPinnedEntry(), orderPinnedFirst(), sortPinnedFirst()

### Community 197 - "Crypto Context"
Cohesion: 0.40
Nodes (4): Core Files, Critical Rules, Crypto Context, Verification

### Community 198 - "SettingsProvider.tsx"
Cohesion: 0.10
Nodes (20): expo-notifications, DEFAULT_KEYS, loadSettingWithTimeout(), SettingsContext, SettingsContextValue, SettingsProvider(), SettingsState, buildPendingExpiryReminders() (+12 more)

### Community 199 - "ClavisPass Browser Extension"
Cohesion: 0.29
Nodes (7): Architecture, Browser loading notes, ClavisPass Browser Extension, Current feature set, Development, Important note, Working from the repo root

### Community 201 - "CardDetailsScreen.tsx"
Cohesion: 0.23
Nodes (17): expo-image, @kichiyaki/react-native-barcode-generator, react-qr-code, CardItem(), Props, styles, buildFaviconUrl(), DigitalCardPalette (+9 more)

### Community 202 - "ClavisPassHubDiscoveryResult.ts"
Cohesion: 0.29
Nodes (6): ClavisPassHubDiscoveryResult, ClavisPassHubDiscoveryStatus, DiscoveryCheckingResult, DiscoveryErrorResult, DiscoveryIdleResult, DiscoverySuccessResult

### Community 203 - "Website presets"
Cohesion: 0.40
Nodes (4): Applying a preset, Catalog, Verification, Website presets

### Community 204 - "pkce.web.ts"
Cohesion: 0.80
Nodes (4): base64Url(), createPkcePair(), randomBytes(), toCodeChallenge()

### Community 214 - "AuthReplyBlock"
Cohesion: 0.29
Nodes (5): auth_reply(), AUTH_REPLY_DESCRIPTOR, AuthReplyBlock, AuthState, BlockDescriptor

## Knowledge Gaps
- **130 isolated node(s):** `react`, `react-dom`, `@types/chrome`, `@types/react`, `@types/react-dom` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1726 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **44 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `package.json`, `bitwarden.ts`, `GoogleDriveClient.ts`, `ModulesEnum.ts`, `ClavisPassHubClient.ts`, `vaultRecovery.ts`, `DeviceStorageClient.ts`, `ModulesEnum`, `ModulesList.tsx`, `withIosGoogleOAuthScheme.js`, `ValuesType.ts`, `useSetting`, `vaultDevices.ts`, `appScheme.test.ts`, `useVault`, `vite.config.ts`, `VaultProvider.tsx`, `pinnedEntries.ts`, `modulePolicy.ts`, `hotkeys.ts`, `generatePassword.ts`, `getModuleData`, `triggerGlobalError`, `GoogleDriveLoginButton.tsx`, `domain.ts`, `store.ts`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **What connects `react`, `react-dom`, `@types/chrome` to the rest of the system?**
  _130 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `VaultV2.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11030478955007257 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.01904761904761905 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `ref_react` to `NoteFullscreenEditor.web.tsx`, `package.json`, `AnalysisScreen.tsx`, `AnimatedPressable`, `LeftSideBar.tsx`, `NoteModule.tsx`, `IdentityDetailScreen.tsx`, `react-i18next`, `ModulesEnum.ts`, `extractFastAccessObject.ts`, `detectTauriEnvironment`, `ThemeProvider.tsx`, `HomeScreen.tsx`, `SettingsScreen.tsx`, `LoginScreen.tsx`, `DeviceStorageClient.ts`, `ModulesList.tsx`, `AttachmentModule.tsx`, `SettingInfoButton.tsx`, `useSetting`, `ValuesType.ts`, `Button.tsx`, `NoteEditorScreen.tsx`, `isTauri.ts`, `useTheme`, `useVault`, `ScanScreen.tsx`, `GlobalClipboardSnackbar.tsx`, `EmailModule.tsx`, `AuthProvider.tsx`, `EditScreen.tsx`, `SettingsQuickSelect.tsx`, `ContentProtectionProvider.tsx`, `errorBus.ts`, `NavigationContainer.tsx`, `UpdateManager.tsx`, `SettingsProvider.tsx`, `model/types.ts`, `CardDetailsScreen.tsx`, `CreditCardModule.tsx`, `BrowserBridgePairingPrompt.tsx`, `AddModuleModal.tsx`, `App.tsx`, `Header`, `MenuItem`, `vcardExport.ts`, `Login.tsx`, `GoogleDriveLoginButton.tsx`, `secureStore.ts`, `RecoveryCodesModule.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `getModule.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05005107252298264 - nodes in this community are weakly interconnected._
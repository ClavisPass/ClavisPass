# Graph Report - ClavisPass  (2026-11-09)

## Corpus Check
- 601 files · ~369,716 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 37 file(s) not represented in the graph (top: .xml 11, (none) 8, .properties 2)

## Summary
- 4069 nodes · 11447 edges · 216 communities (167 shown, 49 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 178 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fafc2e3c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- VaultV2.ts
- dependencies
- ModulesEnum
- NoteFullscreenEditor.web.tsx
- package.json
- deriveIdentityClusters.ts
- EditScreen.tsx
- bitwarden.ts
- LeftSideBar.tsx
- AnalysisDetailScreen.tsx
- IdentityDetailScreen.tsx
- content/index.ts
- shared/types.ts
- popup/App.tsx
- useTheme
- background/index.ts
- shared/bridge.ts
- mapKdbxToClavisPass.ts
- vitest
- detectTauriEnvironment
- CachedAnalysisItem.ts
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
- VaultDataType.ts
- state.ts
- DraggableModulesList.shared.tsx
- AttachmentModule.tsx
- ClavisPass Passkey Management Roadmap
- host.rs
- vault.rs
- CustomTitlebar.tsx
- release.js
- decryptVaultContent.ts
- isTauri.ts
- DevicesScreen.tsx
- ClavisPass Website Marketing Brief
- BrowserExtensionsScreen.tsx
- pairing.rs
- appScheme.test.ts
- Idee: Identity als persönlicher Hauptscreen
- VaultProvider.tsx
- ref_react
- vite.config.ts
- devDependencies
- prepare-msix.js
- totp.ts
- screen_lock.rs
- mergeVaultData.ts
- ClavisPass
- screenLockLogout.ts
- glass.ts
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
- VaultV2.test.ts
- Nutzungsbedingungen
- VaultProvider
- prepare-native-host-sidecar.js
- ValuesType.ts
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
- AnimatedContainer
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
- SettingsQuickSelect.tsx
- plugins
- editHistory.ts
- ValueIconsEnum
- UploadFileParams.ts
- Import.tsx
- expiry.ts
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
- AnimatedLoginVisual.tsx
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
- Modal
- linux
- asyncStorage.ts
- RecoveryCodesModule.tsx
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
- GlassAppearanceSettings.tsx
- Firefox Store Release Notes
- vaultIdentity.ts
- generate-webauthn-test-passkey.js
- ClavisPass Firefox Add-on Reviewer Build
- vaultDevices.ts
- Bitwarden Import Roadmap
- Agent Workflow Context
- Build, Release, And Update Context
- Identity Context
- InlineNotice.tsx
- Desktop And Tauri Context
- CLAUDE.md
- .claude/CLAUDE.md
- GlobalClipboardSnackbar.tsx
- Vault V2 Key Envelope Roadmap
- DropdownLayer.web.tsx
- errorBus.ts
- complete_request
- ContentProtectionProvider.tsx
- dependencies
- container/AnimatedOpacityContainer.tsx
- Crypto Context
- ExpiryNotificationScheduler.tsx
- ClavisPass Browser Extension
- RemoteFileContent.ts
- CardDetailsScreen.tsx
- ClavisPassHubDiscoveryResult.ts
- ClavisPass Agent Context
- ClavisPass Project Context
- FastAccessPositionPicker.tsx
- Tech Stack
- Authentication & Master Secret Handling
- Cryptography & Encryption Model
- moduleScrollVisibility.ts
- CloudStorageClient.test.ts
- PairingStatus
- BrowserWriteKind
- BrandHeader.tsx
- AuthState
- expoVectorIcons.tsx

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
- `Implementation` --references--> `AuthProvider()`  [INFERRED]
  README.md → src/app/providers/AuthProvider.tsx
- `Current Visual Direction` --references--> `ThemeProvider()`  [INFERRED]
  docs/context/ui-patterns.md → src/app/providers/ThemeProvider.tsx
- `Edge verification` --references--> `getStatus()`  [INFERRED]
  docs/browser-extension/native-messaging.md → src/features/vault/utils/expiry.ts
- `Master Password Lifetime` --references--> `AuthProvider()`  [INFERRED]
  docs/context/security.md → src/app/providers/AuthProvider.tsx
- `Core Mental Model` --references--> `AuthProvider()`  [INFERRED]
  docs/project-context.md → src/app/providers/AuthProvider.tsx

## Import Cycles
- None detected.

## Communities (216 total, 49 thin omitted)

### Community 0 - "VaultV2.ts"
Cohesion: 0.21
Nodes (17): CryptoProvider, decodeRecoveryKey(), makeV3PayloadAad(), recoveryAad(), unwrapRecoveryKey(), wrapRecoveryKey(), encryptVaultV1(), verifyVaultV1Provider() (+9 more)

### Community 1 - "dependencies"
Cohesion: 0.02
Nodes (105): dependencies, argon2-browser, @babel/plugin-proposal-export-namespace-from, base64-js, crypto-js, expo, expo-auth-session, expo-blur (+97 more)

### Community 2 - "ModulesEnum"
Cohesion: 0.03
Nodes (112): Shared Module UI, zod, EditRowControlsContainer(), DigitalCardModule(), DigitalCardModuleProps, isDigitalCardType(), styles, TaskModule() (+104 more)

### Community 3 - "NoteFullscreenEditor.web.tsx"
Cohesion: 0.33
Nodes (5): @monaco-editor/react, MONACO_LANGUAGE_BY_NOTE_LANGUAGE, NoteFullscreenEditor(), Props, styles

### Community 4 - "package.json"
Cohesion: 0.03
Nodes (73): react, react-dom, @types/react, @types/react-dom, typescript, main, name, private (+65 more)

### Community 5 - "deriveIdentityClusters.ts"
Cohesion: 0.29
Nodes (10): buildPasswordUseCounts(), entryHasSimplePasswordRisk(), getEntryDomains(), getEntryModuleTypes(), getEntryPasswordValues(), getEntrySignals(), getModuleValue(), IdentityClusterEntry (+2 more)

### Community 6 - "EditScreen.tsx"
Cohesion: 0.06
Nodes (62): Interaction Polish, extractFastAccessObject(), FolderFilter(), Props, styles, ellipsize(), failedFaviconUrls, ListItem() (+54 more)

### Community 7 - "bitwarden.ts"
Cohesion: 0.20
Nodes (24): addCardModule(), addCustomField(), addExpiryModule(), addIdentityModules(), addLoginModules(), addNote(), addPasskeyModules(), addSshKeyModule() (+16 more)

### Community 8 - "LeftSideBar.tsx"
Cohesion: 0.11
Nodes (20): expo-constants, @expo/vector-icons, CustomBottomTab(), getActiveRouteName(), getActiveRouteName(), LeftSideTabBar(), sidebarWidth, styles (+12 more)

### Community 9 - "AnalysisDetailScreen.tsx"
Cohesion: 0.06
Nodes (61): expo-crypto, useAuthMaster(), FiltersNarrow, buildAnalysisCache(), canonicalizeForVariants(), deriveAnalysisPepperFromMaster(), findSequentialTriples(), fingerprintPassword() (+53 more)

### Community 10 - "IdentityDetailScreen.tsx"
Cohesion: 0.20
Nodes (16): IdentityStackParamList, Stack, IdentityEmailLogo(), deriveIdentityClusters(), getDefaultIdentityName(), countIdentityDomains(), IdentitiesScreen(), IdentitiesScreenProps (+8 more)

### Community 11 - "content/index.ts"
Cohesion: 0.08
Nodes (48): applyTargets(), buildNoFieldsResult(), collectFillTargets(), emitInputEvents(), executeFill(), FillPreviewResult, FillSnapshot, FillTarget (+40 more)

### Community 12 - "shared/types.ts"
Cohesion: 0.05
Nodes (49): BackgroundHandler, BackgroundHandlerMap, BackgroundMessageContext, BackgroundMessageRouter, getActiveDomainContext(), normalizeLookupHost(), parseActiveDomain(), sanitizeHost() (+41 more)

### Community 13 - "popup/App.tsx"
Cohesion: 0.06
Nodes (44): registerContentFrame(), setupSavePromptListener(), setupWebAuthnProbe(), App(), handleFill(), handleOpenDesktopApp(), handlePasskeyAssertion(), handlePromptResolution() (+36 more)

### Community 14 - "useTheme"
Cohesion: 0.10
Nodes (51): Item Surfaces, react-i18next, useTheme(), TotpItem(), CustomFieldInputType, EditCustomFieldModal(), Props, PasswordGeneratorModal() (+43 more)

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
Nodes (39): @tauri-apps/api, invokeTauriSystemAuth(), invokeTauriSystemAuthAvailable(), BrowserBridgePairingPrompt(), PairingAction, PromptButton(), styles, FAST_ACCESS_NOTIFICATION_CATEGORY (+31 more)

### Community 20 - "CachedAnalysisItem.ts"
Cohesion: 0.36
Nodes (4): AnalysisFlags, AnalysisRef, CachedAnalysisItem, CacheResult

### Community 21 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, adaptiveIcon, blockedPermissions, package, permissions, versionCode, projectId (+31 more)

### Community 22 - "ClavisPassHubClient.ts"
Cohesion: 0.12
Nodes (36): calculateExpiresIn(), checkDiscovery(), createHubError(), createHubErrorFromPayload(), DiscoveryResponse, fetchFile(), fetchUserInfo(), getConfiguredHostUrl() (+28 more)

### Community 23 - "HomeScreen.tsx"
Cohesion: 0.08
Nodes (29): Common Refactor Targets, Files To Check First, Known Custom Screens, Screen Standardization Context, isSystemAuthenticationAvailable(), saveAuthentication(), HomeFilterMenu(), getStatus() (+21 more)

### Community 24 - "write.rs"
Cohesion: 0.11
Nodes (30): as_io_error(), BrowserWriteRequest, BrowserWriteRequestStore, BrowserWriteResult, BrowserWriteResultStore, claim_pending_requests(), CLAIM_STALE_AFTER_MS, CreateEntryFromBrowserPayload (+22 more)

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
Cohesion: 0.19
Nodes (17): auth_reply(), authenticate_with_system_impl(), AuthReplyBlock, _Block_copy(), _Block_release(), check_system_auth_available(), cstring(), new_la_context() (+9 more)

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
Nodes (33): simple-icons, useContentProtection(), useDevMode(), AppearanceSettingsSection(), Props, ContentProtectionSettingsToggle(), Props, Props (+25 more)

### Community 33 - "vaultRecovery.ts"
Cohesion: 0.20
Nodes (14): getEmptyData(), DEFAULT_ENCRYPT_MODE, EncryptMode, EncryptVaultContentResult, getCryptoProvider(), generateRecoveryKey(), createRecoveryKey(), prepareV3VaultPasswordChange() (+6 more)

### Community 34 - "commands.rs"
Cohesion: 0.09
Nodes (12): AUTH_REPLY_DESCRIPTOR, AUTH_REPLY_SIGNATURE, authenticate_with_system(), BLOCK_HAS_SIGNATURE, BlockDescriptor, CF_UNICODETEXT_FORMAT, get_main_window_hwnd(), LAPOLICY_DEVICE_OWNER_AUTHENTICATION (+4 more)

### Community 35 - "LoginScreen.tsx"
Cohesion: 0.10
Nodes (46): expo-linking, @tauri-apps/plugin-dialog, @tauri-apps/plugin-shell, OAuthRefreshError, Props, StoredAuth, TokenContext, useToken() (+38 more)

### Community 36 - "DeviceStorageClient.ts"
Cohesion: 0.27
Nodes (16): @react-native-async-storage/async-storage, cacheSyncedVault(), fetchFile(), getActiveLocalVaultIdKey(), getLocalSyncKey(), getLocalSyncMetadataKey(), getVaultLocalSyncKey(), getVaultLocalSyncMetadataKey() (+8 more)

### Community 37 - "VaultDataType.ts"
Cohesion: 0.28
Nodes (7): VaultDataType, VaultDataTypeSchema, VaultEntryTombstoneSchema, VaultDeviceSchema, VaultDeviceType, VaultSessionState, VaultSession

### Community 38 - "state.ts"
Cohesion: 0.10
Nodes (18): buildCreatePayload(), buildUpdatePayload(), resolvePromptWithDesktopWrite(), toAppliedResult(), buildPromptTitle(), ExtensionState, normalizeIdentity(), PreparedFillRecord (+10 more)

### Community 39 - "DraggableModulesList.shared.tsx"
Cohesion: 0.14
Nodes (23): NativeDragHandleScrollLockProvider(), WebDragHandlePropsProvider(), dragDropAnimationConfig, DraggableModulesList(), DraggableModulesFooter(), DraggableModulesListProps, draggableModulesListStyles, FooterProps (+15 more)

### Community 40 - "AttachmentModule.tsx"
Cohesion: 0.09
Nodes (35): expo-file-system, expo-sharing, @tauri-apps/plugin-fs, AttachmentModule(), canPreviewAttachment(), downloadBrowserAttachment(), formatBytes(), getAttachmentIcon() (+27 more)

### Community 41 - "ClavisPass Passkey Management Roadmap"
Cohesion: 0.18
Nodes (10): ClavisPass Passkey Management Roadmap, Core Principles, Phase 0: Architecture Decision, Phase 1: Vault Passkey Module, Phase 3: Import And Export Preparation, Phase 5: Platform Integration, Phase 6: Security, UX, And Verification, Product Scope (+2 more)

### Community 42 - "host.rs"
Cohesion: 0.13
Nodes (23): app_scheme(), AssertPasskeyPayload, bridge_result_to_response(), ensure_ready(), FillPayload, handle_request(), is_es256_algorithm(), MatchPasskeysPayload (+15 more)

### Community 43 - "vault.rs"
Cohesion: 0.07
Nodes (46): BridgeClientInfo, BridgeError, BridgePairingEnvelope, BridgeRequest, BridgeResponse, HOST_NAME, PROTOCOL_VERSION, domain_contains() (+38 more)

### Community 44 - "CustomTitlebar.tsx"
Cohesion: 0.10
Nodes (23): @tauri-apps/plugin-cli, @tauri-apps/plugin-process, suppressNextSystemAuthAutoUnlock(), showMainWindow(), StartBehavior, CustomTitlebar(), Props, styles (+15 more)

### Community 45 - "release.js"
Cohesion: 0.12
Nodes (19): androidGradleHasVersionCode(), androidGradleHasVersionName(), androidStringsHasRuntimeVersion(), cargoLockHasVersion(), cargoTomlHasVersion(), { execSync }, existingTags, filesToUpdate (+11 more)

### Community 46 - "decryptVaultContent.ts"
Cohesion: 0.25
Nodes (9): DecryptVaultContentResult, makeV1AadBytes(), te, V1_AAD_OBJECT, assertPositiveSafeInteger(), decryptVaultV1(), VaultV1, VaultV1Schema (+1 more)

### Community 47 - "isTauri.ts"
Cohesion: 0.14
Nodes (17): getClipboardText(), setClipboardText(), tryNavigatorReadText(), tryNavigatorWriteText(), ClipboardContentKind, clipboardOwnership, fingerprintValue(), OwnedClipboardRecord (+9 more)

### Community 48 - "DevicesScreen.tsx"
Cohesion: 0.07
Nodes (43): Standard Checklist, Chips, Compact Search Behavior, Content Panels, Current Visual Direction, Headers, Standard Screen Structure, UI Patterns Context (+35 more)

### Community 49 - "ClavisPass Website Marketing Brief"
Cohesion: 0.05
Nodes (43): Attachments And Previews, Brand Details, Bring Your Own Sync, Browser Extension, Can I import my existing passwords?, Can my cloud provider read my passwords?, ClavisPass Website Marketing Brief, Conversion Priorities (+35 more)

### Community 50 - "BrowserExtensionsScreen.tsx"
Cohesion: 0.24
Nodes (13): subscribeBrowserExtensionPairingChanges(), ActionButton(), BrowserClientCard(), BrowserExtensionsScreen(), BrowserExtensionsScreenProps, browserIconForClient(), BrowserPairingAction, EmptyState() (+5 more)

### Community 51 - "pairing.rs"
Cohesion: 0.28
Nodes (17): approve_pairing(), evaluate_pairing(), list_paired_clients(), list_pending_pairings(), list_rejected_clients(), load_pairing_store(), now_ms(), optional_identity_matches() (+9 more)

### Community 52 - "appScheme.test.ts"
Cohesion: 0.43
Nodes (5): getAppRedirectUri(), getAppScheme(), Constants, resetExpoConfig(), setExpoConfig()

### Community 53 - "Idee: Identity als persönlicher Hauptscreen"
Cohesion: 0.22
Nodes (8): Datenschutz, Einschätzung, Gestaltungsprinzipien und offene Fragen, Idee: Identity als persönlicher Hauptscreen, Mögliche Ausbaustufen, Mögliche Funktionen, Technischer Ansatz, Ziel

### Community 54 - "VaultProvider.tsx"
Cohesion: 0.10
Nodes (47): Current Vault Format, Implementation Phases, AuthContext, AuthContextType, AuthMasterContext, AuthMasterContextType, Props, useAuth() (+39 more)

### Community 55 - "ref_react"
Cohesion: 0.03
Nodes (84): expo-linear-gradient, @gorhom/bottom-sheet, react-native, react-native-circular-progress, react-native-gesture-handler, react-native-paper, react-native-reanimated, Props (+76 more)

### Community 57 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, @babel/core, eslint, eslint-config-universe, patch-package, prettier, react-test-renderer, @tauri-apps/cli (+14 more)

### Community 58 - "prepare-msix.js"
Cohesion: 0.10
Nodes (16): appExe, appVersion, assetsOutputDir, createUnplatedTargetSizeIcons(), escapePowerShellSingleQuoted(), fs, manifest, manifestSource (+8 more)

### Community 59 - "totp.ts"
Cohesion: 0.40
Nodes (4): otpauth, codeFromUri(), parseOtpauth(), TotpAlgo

### Community 60 - "screen_lock.rs"
Cohesion: 0.11
Nodes (8): DeviceIdentity, get_device_identity(), CGSessionCopyCurrentDictionary(), emit(), ScreenLockPayload, Session, start(), wndproc()

### Community 61 - "mergeVaultData.ts"
Cohesion: 0.18
Nodes (22): VaultEntryTombstone, addLatestTombstones(), areSame(), clone(), conflictCopyMatchesBaseEntry(), conflictCopyWasDeleted(), entryContentFingerprint(), entryIsDeletedBy() (+14 more)

### Community 62 - "ClavisPass"
Cohesion: 0.12
Nodes (15): 1. VaultSession (Authoritative & Secret-Capable), 2. VaultProvider (UI-Safe Projection), ClavisPass, Defensive Defaults, FAQ, Features, Homepage, Installation (+7 more)

### Community 63 - "screenLockLogout.ts"
Cohesion: 0.40
Nodes (3): ScreenLockLogoutController, ListenFn, ScreenLockPayload

### Community 64 - "glass.ts"
Cohesion: 0.18
Nodes (16): @hello-pangea/dnd, react-native-draggable-flatlist, HomeStackParamList, Stack, dragDropAnimationConfig, ModuleReorderScreen(), ModuleReorderScreenProps, moveModule() (+8 more)

### Community 65 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+11 more)

### Community 66 - "UpdateManager.tsx"
Cohesion: 0.15
Nodes (21): expo-updates, react-native-safe-area-context, @tauri-apps/plugin-updater, Listener, listeners, publishUpdateCheck(), subscribeUpdateCheck(), unsubscribeUpdateCheck() (+13 more)

### Community 67 - "webauthn.rs"
Cohesion: 0.10
Nodes (31): AssertionAuthenticatorResponse, AssertionPublicKeyCredential, AssertionSigningContext, base64url_decode(), base64url_encode(), base64url_round_trips_without_padding(), build_assertion_authenticator_data(), build_assertion_public_key_credential() (+23 more)

### Community 68 - "NavigationContainer.tsx"
Cohesion: 0.12
Nodes (20): @tauri-apps/plugin-global-shortcut, Props, ProtectedRoute(), styles, getFocusedRouteName(), NavigationnContainer(), titlebarContentDragRoutes, LoginStack() (+12 more)

### Community 69 - "reactNativePaper.tsx"
Cohesion: 0.11
Nodes (14): ActivityIndicator, baseColors, Button, Chip, Divider, Icon, IconButton, MD3DarkTheme (+6 more)

### Community 71 - "modulePolicy.ts"
Cohesion: 0.17
Nodes (13): buildEntryMeta(), EntryMeta, firstModule(), firstValue(), getSecretFor(), isManagedModule(), MANAGED_MODULE_VALUES, ManagedModules (+5 more)

### Community 72 - "model/types.ts"
Cohesion: 0.08
Nodes (31): @react-navigation/bottom-tabs, @react-navigation/native-stack, AddTriggerStackParamList, AnalysisStackParamList, AppTabsParamList, LoginStackParamList, LogoutStackParamList, RootStackParamList (+23 more)

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

### Community 77 - "VaultV2.test.ts"
Cohesion: 0.16
Nodes (14): makeV2KeywrapAadBytes(), te, V2_KEYWRAP_AAD_OBJECT, V2_PAYLOAD_AAD_OBJECT, VaultV2, VaultV2Schema, cloneBytes(), cloneSession() (+6 more)

### Community 78 - "Nutzungsbedingungen"
Cohesion: 0.10
Nodes (20): 10. Erlaubte Nutzung, 11. Open Source und Lizenzen, 12. Kosten, 13. Drittanbieter, 14. Updates, 15. Haftung, 16. Beendigung der Nutzung, 17. Änderungen (+12 more)

### Community 79 - "VaultProvider"
Cohesion: 0.18
Nodes (11): High-Risk Rules, Core Files, Master Password Lifetime, Module Policy, Security And Vault Context, UI-Safe Metadata, Vault Session Boundary, Session Boundary (+3 more)

### Community 80 - "prepare-native-host-sidecar.js"
Cohesion: 0.15
Nodes (12): cargoArgs, { copyFileSync, existsSync, mkdirSync, writeFileSync }, detectHostTriple(), { execFileSync }, { join, resolve }, manifestPath, outputDir, outputPath (+4 more)

### Community 81 - "ValuesType.ts"
Cohesion: 0.11
Nodes (28): papaparse, react-native-crypto-js, applyUpdateToEntry(), BrowserBridgeWriteSync(), BrowserWriteKind, BrowserWriteRequest, createBrowserEntry(), CreatePayload (+20 more)

### Community 82 - "rnSodiumProvider.ts"
Cohesion: 0.15
Nodes (10): base64-js, react-native-sodium-jsi, getCryptoProvider(), rnSodiumProvider, td, te, verifyProviderInDev(), td (+2 more)

### Community 84 - "session.rs"
Cohesion: 0.24
Nodes (7): BridgeSessionSnapshot, clear_session(), load_session(), now_ms(), publish_session(), SESSION_TTL_MS, write_json_atomically()

### Community 85 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, build:chrome, build:firefox, build:firefox-local, dev, package:chrome, package:firefox (+8 more)

### Community 86 - "AddModuleModal.tsx"
Cohesion: 0.21
Nodes (10): AddModuleModalCompactFav(), defineModules(), IdsOf, MissingIds, ModuleCategory, ModuleMeta, ModuleTile(), Props (+2 more)

### Community 87 - "App.tsx"
Cohesion: 0.07
Nodes (40): App(), AppShell(), AppWithNavigation(), DemoBootstrap(), getCurrentWindowSafe(), MainWindowReadySignal(), withAlpha(), DevModeProvider() (+32 more)

### Community 88 - "hotkeys.ts"
Cohesion: 0.13
Nodes (22): HotkeyRecorderItem(), Props, beginHotkeyRecording(), emit(), Listener, listeners, ACTIONS, BLOCKED_HOTKEYS (+14 more)

### Community 89 - "bridge_commands.rs"
Cohesion: 0.15
Nodes (8): bridge_approve_pairing(), bridge_claim_pending_writes(), bridge_complete_write_request(), bridge_list_paired_clients(), bridge_list_pending_pairings(), bridge_list_rejected_clients(), bridge_publish_session(), bridge_reject_pairing()

### Community 90 - "Terms Of Use"
Cohesion: 0.10
Nodes (20): 10. Permitted Use, 11. Open Source And Licenses, 12. Costs, 13. Third-Party Providers, 14. Updates, 15. Liability, 16. Ending Use, 17. Changes (+12 more)

### Community 91 - "UI Context"
Cohesion: 0.25
Nodes (7): i18n, Important Files, Menus And Dropdowns, Platform Model, Related UI Context, Titlebar And Chrome, UI Context

### Community 92 - "AnimatedContainer"
Cohesion: 0.19
Nodes (16): getAttachmentPreview(), AttachmentPreviewScreen(), AttachmentPreviewScreenProps, getDataUri(), getExtension(), iframeStyle, AttachmentPreviewScreen(), AttachmentPreviewScreenProps (+8 more)

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
Cohesion: 0.27
Nodes (7): fetchFile(), fetchUserInfo(), refreshAccessToken(), uploadFile(), fetchUserInfo(), TokenRefreshResult, triggerGlobalError()

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

### Community 105 - "SettingsQuickSelect.tsx"
Cohesion: 0.10
Nodes (27): FilterItem, FiltersNarrowProps, FiltersWide, FiltersWideProps, styles, Props, styles, QuickSelectItem (+19 more)

### Community 106 - "plugins"
Cohesion: 0.20
Nodes (10): args, customProtocol, plugins, cli, deepLink, updater, endpoints, pubkey (+2 more)

### Community 107 - "editHistory.ts"
Cohesion: 0.21
Nodes (13): Editor(), appendLog(), areValuesEqual(), cloneValue(), createLogEntry(), EditHistoryActionType, EditHistoryMeta, EditSessionLogEntry (+5 more)

### Community 108 - "ValueIconsEnum"
Cohesion: 0.14
Nodes (13): ValueIconsEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+5 more)

### Community 109 - "UploadFileParams.ts"
Cohesion: 0.26
Nodes (8): TokenContextValue, FetchFileParams, TokenRefreshParams, Provider, UploadContent, UploadFileParams, VaultFetchResult, VaultSnapshot

### Community 110 - "Import.tsx"
Cohesion: 0.17
Nodes (11): expo-document-picker, VaultContextType, DocumentTypeEnum, BITWARDEN, CHROME, FIREFOX, KDBX, PCLOUD (+3 more)

### Community 111 - "expiry.ts"
Cohesion: 0.47
Nodes (4): ExpiryStatus, formatRelative(), getRelativeInfo(), RelativeExpiryInfo

### Community 112 - "Login.tsx"
Cohesion: 0.13
Nodes (26): FilterAnalysisModal(), Props, PasswordStrengthLevel, MEDIUM, STRONG, WEAK, passwordEntropy(), getPasswordStrengthIcon() (+18 more)

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
Cohesion: 0.13
Nodes (22): expo-auth-session, expo-random, expo-web-browser, @fabianlars/tauri-plugin-oauth, ANDROID_AUTH_PROMPT_OPTIONS, getMobileRedirectUri(), randState(), SCOPES (+14 more)

### Community 119 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, moduleResolution, strict, exclude, extends

### Community 120 - "Store Release Roadmap"
Cohesion: 0.17
Nodes (11): Apple Developer Program, Arratel Setup Plan, Chrome Web Store, Goals, Google Play, Microsoft Store, Publisher Naming, References (+3 more)

### Community 121 - "native_host_registration.rs"
Cohesion: 0.19
Nodes (10): CHROME_EXTENSION_IDS, chromium_origins(), CREATE_NO_WINDOW, EDGE_EXTENSION_IDS, find_native_host_exe(), FIREFOX_EXTENSION_ID, native_host_candidates(), NATIVE_HOST_NAME (+2 more)

### Community 122 - "secureStore.ts"
Cohesion: 0.20
Nodes (15): Core Files, Providers, Settings Schema, Storage Layers, Sync And Storage Context, Tokens, CloudProvider(), isInvalidGrant() (+7 more)

### Community 123 - "AnimatedLoginVisual.tsx"
Cohesion: 0.20
Nodes (8): react-native-svg, AnimatedLoginVisual(), Props, styles, AnimatedLogo(), AnimatedRect, styles, Logo()

### Community 124 - "domain.ts"
Cohesion: 0.27
Nodes (10): buildEntrySuggestions(), normalizeHost(), normalizeLookupHost(), normalizeRpHost(), safeUrl(), scoreUrlMatch(), searchEntries(), validateWebAuthnRpId() (+2 more)

### Community 125 - "serve-webauthn-test-page.js"
Cohesion: 0.25
Nodes (4): __dirname, pagePath, port, server

### Community 126 - "store.ts"
Cohesion: 0.11
Nodes (23): DEFAULT_KEYS, loadSettingWithTimeout(), SettingsContext, SettingsContextValue, SettingsState, BooleanDef, DataKey, DEVICE_RESET_KEYS (+15 more)

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

### Community 138 - "GoogleDriveClient.ts"
Cohesion: 0.13
Nodes (26): buildMultipartBody(), escapeDriveQueryString(), fetchFile(), findFileIdByName(), GoogleTokenRefreshError, readJsonSafe(), readTextSafe(), refreshAccessToken() (+18 more)

### Community 141 - "Modal"
Cohesion: 0.07
Nodes (43): react-qr-code, Props, styles, VaultRecoverySetupDialog(), Props, TokenQRCodeModal(), AddValueModal(), Props (+35 more)

### Community 142 - "linux"
Cohesion: 0.67
Nodes (3): linux, depends, deb

### Community 144 - "RecoveryCodesModule.tsx"
Cohesion: 0.19
Nodes (12): FastAccessType, FastAccessTypeSchema, RecoveryCodesModule(), splitKeepingRemainder(), styles, tokenize(), Props, QuickSelect() (+4 more)

### Community 171 - "withIosGoogleOAuthScheme.js"
Cohesion: 0.43
Nodes (5): ensureUrlScheme(), normalizeClientId(), {
  ensureUrlScheme,
  toReverseClientIdScheme,
}, toReverseClientIdScheme(), { withInfoPlist }

### Community 172 - "browser-extension/package.json"
Cohesion: 0.17
Nodes (11): react, react-dom, @types/react, @types/react-dom, typescript, name, private, type (+3 more)

### Community 174 - "GlassAppearanceSettings.tsx"
Cohesion: 0.16
Nodes (16): @react-native-assets/slider, DevModeContext, DevModeContextType, Props, GlassAppearanceSettings(), Preview(), useIsTauriEnvironment(), AmbientBackground() (+8 more)

### Community 175 - "Firefox Store Release Notes"
Cohesion: 0.25
Nodes (7): Extension Identity, Firefox Store Release Notes, Listing, Pre-Submit Check, Privacy Policy Draft, Release Artifacts, Reviewer Notes

### Community 176 - "vaultIdentity.ts"
Cohesion: 0.29
Nodes (6): createVaultId(), ensureVaultId(), normalizeVaultId(), resolveMergedVaultId(), VaultData, VaultIdentityMismatchError

### Community 178 - "ClavisPass Firefox Add-on Reviewer Build"
Cohesion: 0.33
Nodes (5): Build Steps, ClavisPass Firefox Add-on Reviewer Build, Environment, Firefox Add-on ID, Native Messaging Notes

### Community 179 - "vaultDevices.ts"
Cohesion: 0.22
Nodes (8): daysBetween(), DEFAULT_DEVICE_UI_POLICY, DeviceUiPolicy, DeviceUiStatus, earliestIso(), hasSameDeviceIdentity(), normalizeDeviceIdentityPart(), parseIso()

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
Cohesion: 0.29
Nodes (6): Chrome And Drag Regions, Core Files, Desktop And Tauri Context, Fast Access, Runtime Model, Tauri Responsibilities

### Community 189 - "GlobalClipboardSnackbar.tsx"
Cohesion: 0.25
Nodes (8): clipboardClearScheduler, Handler, handlers, subscribeClipboardCopied(), unsubscribeClipboardCopied(), ClipboardCopyPayload, GlobalClipboardSnackbar(), msToSecCeil()

### Community 190 - "Vault V2 Key Envelope Roadmap"
Cohesion: 0.20
Nodes (9): Current V1 Behavior, Envelope Design Notes, Goal, Master Password Change, Migration Strategy, Non-Goals, Testing Plan, V2 Behavior (+1 more)

### Community 192 - "errorBus.ts"
Cohesion: 0.42
Nodes (6): Listener, listeners, subscribeGlobalError(), unsubscribeGlobalError(), GlobalErrorPayload, GlobalErrorSnackbar()

### Community 193 - "complete_request"
Cohesion: 0.36
Nodes (9): bridge_dir(), BRIDGE_ENV_KEY, ensure_dir(), pairing_store_path(), platform_base_dir(), session_store_path(), write_request_store_path(), write_result_store_path() (+1 more)

### Community 194 - "ContentProtectionProvider.tsx"
Cohesion: 0.32
Nodes (6): expo-screen-capture, applyNativeContentProtection(), applyTauriContentProtection(), ContentProtectionContext, ContentProtectionContextValue, ContentProtectionProvider()

### Community 195 - "dependencies"
Cohesion: 0.50
Nodes (4): dependencies, react, react-dom, tldts

### Community 196 - "container/AnimatedOpacityContainer.tsx"
Cohesion: 0.31
Nodes (6): AnimatedOpacityContainer(), Props, AnimatedOpacityContainerWeb(), Props, Props, AnimatedOpacityContainer()

### Community 197 - "Crypto Context"
Cohesion: 0.40
Nodes (4): Core Files, Critical Rules, Crypto Context, Verification

### Community 198 - "ExpiryNotificationScheduler.tsx"
Cohesion: 0.39
Nodes (7): expo-notifications, buildPendingExpiryReminders(), cancelScheduledExpiryReminders(), configureNotificationHandler(), ExpiryNotificationScheduler(), getReminderDate(), PendingExpiryReminder

### Community 199 - "ClavisPass Browser Extension"
Cohesion: 0.29
Nodes (7): Architecture, Browser loading notes, ClavisPass Browser Extension, Current feature set, Development, Important note, Working from the repo root

### Community 201 - "CardDetailsScreen.tsx"
Cohesion: 0.16
Nodes (22): Applying a preset, Catalog, Verification, Website presets, expo-image, @kichiyaki/react-native-barcode-generator, CardItem(), Props (+14 more)

### Community 202 - "ClavisPassHubDiscoveryResult.ts"
Cohesion: 0.29
Nodes (6): ClavisPassHubDiscoveryResult, ClavisPassHubDiscoveryStatus, DiscoveryCheckingResult, DiscoveryErrorResult, DiscoveryIdleResult, DiscoverySuccessResult

### Community 203 - "ClavisPass Agent Context"
Cohesion: 0.33
Nodes (5): Always Know, ClavisPass Agent Context, Context Routing, Fast Map, graphify

### Community 204 - "ClavisPass Project Context"
Cohesion: 0.33
Nodes (5): ClavisPass Project Context, Context Files, Core Mental Model, First Runtime Files, High-Risk Areas

### Community 205 - "FastAccessPositionPicker.tsx"
Cohesion: 0.40
Nodes (5): Corner, CornerOption(), FastAccessPosition, FastAccessPositionPicker(), Props

### Community 206 - "Tech Stack"
Cohesion: 0.40
Nodes (5): Backend / Plattform, CI / CD & Deployment, Frontend, Security, Tech Stack

### Community 207 - "Authentication & Master Secret Handling"
Cohesion: 0.50
Nodes (4): Authentication & Master Secret Handling, Design Goals, Implementation, Session Lifecycle

### Community 208 - "Cryptography & Encryption Model"
Cohesion: 0.50
Nodes (4): Cryptography & Encryption Model, Key Derivation, Platform Consistency, Vault Encryption

### Community 210 - "CloudStorageClient.test.ts"
Cohesion: 0.50
Nodes (3): target, v2, v3

### Community 211 - "PairingStatus"
Cohesion: 0.50
Nodes (4): PairingStatus, Paired, Pending, Unpaired

### Community 212 - "BrowserWriteKind"
Cohesion: 0.50
Nodes (4): BrowserWriteKind, CreateEntryFromBrowser, ReservePasskeyAssertion, UpdateEntryFromBrowser

## Knowledge Gaps
- **130 isolated node(s):** `react`, `react-dom`, `@types/chrome`, `@types/react`, `@types/react-dom` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1725 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `package.json`, `EditScreen.tsx`, `bitwarden.ts`, `GoogleDriveClient.ts`, `ClavisPassHubClient.ts`, `HomeScreen.tsx`, `vaultRecovery.ts`, `DeviceStorageClient.ts`, `VaultDataType.ts`, `DraggableModulesList.shared.tsx`, `withIosGoogleOAuthScheme.js`, `GlassAppearanceSettings.tsx`, `vaultIdentity.ts`, `vaultDevices.ts`, `appScheme.test.ts`, `vite.config.ts`, `modulePolicy.ts`, `VaultV2.test.ts`, `ValuesType.ts`, `moduleScrollVisibility.ts`, `CloudStorageClient.test.ts`, `hotkeys.ts`, `generatePassword.ts`, `getModuleData`, `triggerGlobalError`, `domain.ts`, `store.ts`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **What connects `react`, `react-dom`, `@types/chrome` to the rest of the system?**
  _130 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.01904761904761905 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `ModulesEnum` be split into smaller, more focused modules?**
  _Cohesion score 0.034162421336529816 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `ref_react` to `ModulesEnum`, `NoteFullscreenEditor.web.tsx`, `package.json`, `EditScreen.tsx`, `LeftSideBar.tsx`, `NoteModule.tsx`, `GoogleDriveClient.ts`, `AnalysisDetailScreen.tsx`, `IdentityDetailScreen.tsx`, `Modal`, `useTheme`, `RecoveryCodesModule.tsx`, `detectTauriEnvironment`, `HomeScreen.tsx`, `SettingsScreen.tsx`, `LoginScreen.tsx`, `DraggableModulesList.shared.tsx`, `AttachmentModule.tsx`, `CustomTitlebar.tsx`, `GlassAppearanceSettings.tsx`, `isTauri.ts`, `DevicesScreen.tsx`, `BrowserExtensionsScreen.tsx`, `VaultProvider.tsx`, `GlobalClipboardSnackbar.tsx`, `glass.ts`, `errorBus.ts`, `ContentProtectionProvider.tsx`, `UpdateManager.tsx`, `NavigationContainer.tsx`, `container/AnimatedOpacityContainer.tsx`, `ExpiryNotificationScheduler.tsx`, `model/types.ts`, `CardDetailsScreen.tsx`, `CreditCardModule.tsx`, `FastAccessPositionPicker.tsx`, `AddModuleModal.tsx`, `App.tsx`, `hotkeys.ts`, `AnimatedContainer`, `SettingsQuickSelect.tsx`, `Import.tsx`, `Login.tsx`, `GoogleDriveLoginButton.tsx`, `secureStore.ts`, `AnimatedLoginVisual.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.02702702702702703 - nodes in this community are weakly interconnected._
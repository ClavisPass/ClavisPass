# Graph Report - ClavisPass  (2026-10-13)

## Corpus Check
- 564 files · ~342,774 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 37 file(s) not represented in the graph (top: .xml 11, (none) 8, .properties 2)

## Summary
- 3773 nodes · 10466 edges · 190 communities (149 shown, 41 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 145 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4bc7e3c6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ModulesEnum
- dependencies
- react-native
- logger.ts
- package.json
- useTheme
- App.tsx
- EditScreen.tsx
- ListItem.tsx
- vitest
- BrowserExtensionsScreen.tsx
- content/index.ts
- shared/types.ts
- popup/App.tsx
- useVault
- background/index.ts
- shared/bridge.ts
- AnalysisDetailScreen.tsx
- AnimatedPressable
- FastAccess.ts
- store.ts
- expo
- ClavisPassHubClient.ts
- MenuItem
- write.rs
- scripts
- decryptVaultContent.ts
- manifest.json
- isTauri.ts
- forms.ts
- lib.rs
- Header
- UpdateManager.tsx
- hotkeys.ts
- commands.rs
- LoginScreen.tsx
- Login.tsx
- mergeVaultData.ts
- state.ts
- react-native-reanimated
- mapKdbxToClavisPass.ts
- useAuth
- host.rs
- rnSodiumProvider.ts
- GoogleDriveLoginButton.tsx
- release.js
- ClavisPass Browser Extension
- CreditCardModule.tsx
- screen_lock.rs
- ClavisPass Website Marketing Brief
- createUniqueID
- pairing.rs
- triggerGlobalError
- background/bridge.ts
- vcardExport.ts
- BrowserBridgeWriteSync.tsx
- vite.config.ts
- devDependencies
- prepare-msix.js
- model/types.ts
- Vault V2 Key Envelope Roadmap
- DeviceStorageClient.ts
- ClavisPass
- bridge_commands.rs
- NoteModule.tsx
- compilerOptions
- AttachmentModule.tsx
- getTemplate.ts
- AppChip
- reactNativePaper.tsx
- MainApplication.kt
- i18n/index.ts
- modulePolicy.ts
- Datenschutzerklärung
- autofill-preferences.ts
- reactNative.ts
- Privacy Policy
- AuthProvider.tsx
- Nutzungsbedingungen
- DevModeProvider.tsx
- prepare-native-host-sidecar.js
- CloudStorageClient.ts
- AttachmentPreviewScreen.native.tsx
- MainActivity.kt
- session.rs
- scripts
- deriveIdentityClusters.ts
- fill.ts
- ScanScreen.tsx
- ValueIconsEnum
- Terms Of Use
- protocol.rs
- path.rs
- check-tauri-version-sync.js
- errorBus.ts
- ClavisPass Product Strategy Roadmap
- Sync.tsx
- bundle
- Sync And Storage Context
- Identity Management Concept
- withIosGoogleOAuthScheme.js
- detectTauriEnvironment
- tauri.conf.json
- withAndroidApplicationId.js
- build-web-demo.js
- ref_react
- plugins
- autofill-cache.ts
- ref_fs
- container/AnimatedOpacityContainer.tsx
- SettingsContainer.tsx
- editHistory.ts
- brand.ts
- DropboxLoginButton.tsx
- reactNativeReanimated.tsx
- reactNavigationNative.ts
- devDependencies
- compilerOptions
- generatePassword.ts
- tsconfig.json
- Store Release Roadmap
- GoogleDriveClient.ts
- CryptoProvider
- TotpModule.tsx
- AnimatedContainer
- macOS
- windows
- gorhomBottomSheet.tsx
- WifiTypeEnum
- build
- vite-env.d.ts
- tab-context.ts
- BridgeStatusBadge.tsx
- DocumentTypeEnum
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
- ClavisPassHubDiscoveryResult.ts
- Firefox Store Release Notes
- UI Context
- useSetting
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
- SettingsScreen.tsx

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
- `Chips` --references--> `AppChip()`  [INFERRED]
  docs/context/ui-patterns.md → src/shared/components/chips/AppChip.tsx
- `Core Mental Model` --references--> `AuthProvider()`  [INFERRED]
  docs/project-context.md → src/app/providers/AuthProvider.tsx

## Import Cycles
- None detected.

## Communities (190 total, 41 thin omitted)

### Community 0 - "ModulesEnum"
Cohesion: 0.03
Nodes (97): zod, FastAccessType, FastAccessTypeSchema, AddressModuleType, AddressModuleTypeSchema, regex, AttachmentFileSchema, AttachmentModuleType (+89 more)

### Community 1 - "dependencies"
Cohesion: 0.02
Nodes (105): dependencies, argon2-browser, @babel/plugin-proposal-export-namespace-from, base64-js, crypto-js, expo, expo-auth-session, expo-blur (+97 more)

### Community 2 - "react-native"
Cohesion: 0.12
Nodes (26): expo-linking, react-i18next, react-native, ExpiryPickerModal(), Props, FILTERABLE_MODULES, Props, ModuleContainerProps (+18 more)

### Community 3 - "logger.ts"
Cohesion: 0.19
Nodes (11): papaparse, PendingKdbxFile, Props, styles, decrypt(), EntryExternalRefsSchema, ValuesListType, ValuesType (+3 more)

### Community 4 - "package.json"
Cohesion: 0.03
Nodes (72): react, react-dom, @types/react, @types/react-dom, typescript, main, name, private (+64 more)

### Community 5 - "useTheme"
Cohesion: 0.08
Nodes (51): Item Surfaces, Shared Module UI, useTheme(), EditRowControlsContainer(), PasswordGeneratorModal(), ModuleContainer(), AddressModule(), CompanyModule() (+43 more)

### Community 6 - "App.tsx"
Cohesion: 0.10
Nodes (32): App(), AppShell(), AppWithNavigation(), DemoBootstrap(), getCurrentWindowSafe(), MainWindowReadySignal(), withAlpha(), DevModeProvider() (+24 more)

### Community 7 - "EditScreen.tsx"
Cohesion: 0.13
Nodes (25): ClearCompletedTasksModal(), Props, ClearModulesModal(), Props, DeleteModal(), Props, DeleteModuleModal(), Props (+17 more)

### Community 8 - "ListItem.tsx"
Cohesion: 0.10
Nodes (34): extractFastAccessObject(), ellipsize(), failedFaviconUrls, ListItem(), maskPassword(), Props, styles, dragDropAnimationConfig (+26 more)

### Community 9 - "vitest"
Cohesion: 0.37
Nodes (5): vitest, update, devices, renderWithAppProviders(), textContent()

### Community 10 - "BrowserExtensionsScreen.tsx"
Cohesion: 0.14
Nodes (23): SettingsStackParamList, SettingsStack(), Stack, subscribeBrowserExtensionPairingChanges(), deriveDeviceUiStatus(), sortByLastSeenDesc(), ActionButton(), BrowserClientCard() (+15 more)

### Community 11 - "content/index.ts"
Cohesion: 0.14
Nodes (32): applyThemeToInlinePicker(), clearInlinePreview(), commitInlineAction(), createCloseIcon(), createInlineLogo(), createPickerLogo(), ensureInlineStyles(), fillSuggestionFromPicker() (+24 more)

### Community 12 - "shared/types.ts"
Cohesion: 0.05
Nodes (47): BackgroundHandler, BackgroundHandlerMap, BackgroundMessageContext, BackgroundMessageRouter, FillPreviewResult, FillStateCardProps, GetFillDataForEntryPayload, ContentMessage (+39 more)

### Community 13 - "popup/App.tsx"
Cohesion: 0.09
Nodes (33): registerContentFrame(), App(), handleFill(), handleOpenDesktopApp(), handlePromptResolution(), handleToggleSavePrompts(), handleUpdateAutofillMode(), refreshInlineAutofillPreference() (+25 more)

### Community 14 - "useVault"
Cohesion: 0.10
Nodes (33): @hello-pangea/dnd, react-native-draggable-flatlist, IdentityStackParamList, Stack, useVault(), IdentityEmailLogo(), getDefaultIdentityName(), ModulesType (+25 more)

### Community 15 - "background/index.ts"
Cohesion: 0.12
Nodes (34): buildCreatePayload(), buildUpdatePayload(), clearTabBadge(), delay(), desktopBridge, ensureContentScriptReady(), evaluateSavePromptCandidate(), fillFirstAvailableMatchInActiveTab() (+26 more)

### Community 16 - "shared/bridge.ts"
Cohesion: 0.14
Nodes (22): NativeMessagingClient, NativeMessagingError, toBridgeError(), validateBridgeResponse(), withTimeout(), createInstanceId(), getBridgeClientInfo(), getBrowserDisplayName() (+14 more)

### Community 17 - "AnalysisDetailScreen.tsx"
Cohesion: 0.05
Nodes (77): expo-crypto, AnalysisStackParamList, Stack, useAuthMaster(), FiltersNarrow, FilterAnalysisModal(), Props, AnalysisFlags (+69 more)

### Community 18 - "AnimatedPressable"
Cohesion: 0.09
Nodes (27): CategoryItem(), Props, AddModuleModalCompactFav(), defineModules(), IdsOf, MissingIds, ModuleCategory, ModuleMeta (+19 more)

### Community 19 - "FastAccess.ts"
Cohesion: 0.10
Nodes (39): @tauri-apps/api, invokeTauriSystemAuthAvailable(), FastAccessSessionBridge(), MobileFastAccessOverlay(), FAST_ACCESS_NOTIFICATION_CATEGORY, FAST_ACCESS_POPUP_LABEL, FAST_ACCESS_POSITION_CHANGED_EVENT, FAST_ACCESS_READY_EVENT (+31 more)

### Community 20 - "store.ts"
Cohesion: 0.09
Nodes (32): configureMobileFastAccess(), Corner, CornerOption(), FastAccessPosition, FastAccessPositionPicker(), Props, clampWidth(), Props (+24 more)

### Community 21 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, adaptiveIcon, blockedPermissions, package, permissions, versionCode, projectId (+31 more)

### Community 22 - "ClavisPassHubClient.ts"
Cohesion: 0.13
Nodes (34): calculateExpiresIn(), createHubError(), createHubErrorFromPayload(), DiscoveryResponse, ensureVaultEtagForUpload(), fetchFile(), fetchUserInfo(), fetchVaultMeta() (+26 more)

### Community 23 - "MenuItem"
Cohesion: 0.11
Nodes (27): FilterItem, FiltersNarrowProps, FiltersWide, FiltersWideProps, styles, ExpiryOverviewEntry, HomeFilterMenu(), Props (+19 more)

### Community 24 - "write.rs"
Cohesion: 0.12
Nodes (29): as_io_error(), BrowserWriteKind, CreateEntryFromBrowser, UpdateEntryFromBrowser, BrowserWriteRequest, BrowserWriteRequestStore, BrowserWriteResult, BrowserWriteResultStore (+21 more)

### Community 25 - "scripts"
Cohesion: 0.05
Nodes (37): scripts, android, android:build:apk, android:build:store, android:build:store-submit, android:submit:store, extension:build, extension:build:chrome (+29 more)

### Community 26 - "decryptVaultContent.ts"
Cohesion: 0.15
Nodes (15): getEmptyData(), decryptVaultContent(), DecryptVaultContentResult, getCryptoProvider(), makeV1AadBytes(), te, V1_AAD_OBJECT, assertPositiveSafeInteger() (+7 more)

### Community 27 - "manifest.json"
Cohesion: 0.06
Nodes (35): action, default_icon, default_popup, default_title, background, service_worker, type, browser_specific_settings (+27 more)

### Community 28 - "isTauri.ts"
Cohesion: 0.13
Nodes (17): getClipboardText(), setClipboardText(), tryNavigatorReadText(), tryNavigatorWriteText(), ClipboardContentKind, clipboardOwnership, fingerprintValue(), OwnedClipboardRecord (+9 more)

### Community 29 - "forms.ts"
Cohesion: 0.11
Nodes (33): setupSavePromptListener(), AutofillPlan, buildDetachedContainer(), buildFieldKey(), buildFieldText(), buildFormId(), chooseBestField(), ClassifiedField (+25 more)

### Community 30 - "lib.rs"
Cohesion: 0.05
Nodes (49): domain_contains(), fill_data_for_entry(), FillDataResult, first_string(), FolderRef, login_entry(), match_domain_score(), normalize_domain() (+41 more)

### Community 31 - "Header"
Cohesion: 0.08
Nodes (33): Standard Checklist, Chips, Compact Search Behavior, Content Panels, Current Visual Direction, Headers, Standard Screen Structure, UI Patterns Context (+25 more)

### Community 32 - "UpdateManager.tsx"
Cohesion: 0.11
Nodes (27): expo-constants, react-native-safe-area-context, @tauri-apps/plugin-process, @tauri-apps/plugin-updater, Listener, listeners, publishUpdateCheck(), subscribeUpdateCheck() (+19 more)

### Community 33 - "hotkeys.ts"
Cohesion: 0.13
Nodes (21): HotkeyRecorderItem(), Props, beginHotkeyRecording(), emit(), Listener, listeners, ACTIONS, BLOCKED_HOTKEYS (+13 more)

### Community 34 - "commands.rs"
Cohesion: 0.05
Nodes (40): auth_reply(), AUTH_REPLY_DESCRIPTOR, AUTH_REPLY_SIGNATURE, authenticate_with_system(), authenticate_with_system_impl(), AuthReplyBlock, AuthState, _Block_copy() (+32 more)

### Community 35 - "LoginScreen.tsx"
Cohesion: 0.13
Nodes (30): expo-network, LoginStackParamList, Stack, useToken(), OnlineContext, OnlineContextType, Props, useOnline() (+22 more)

### Community 36 - "Login.tsx"
Cohesion: 0.15
Nodes (15): react-native-progress, react-native-svg, Login(), Props, isUsingAuthentication(), loadAuthentication(), consumeSystemAuthAutoUnlockSuppression(), entropyToProgress() (+7 more)

### Community 37 - "mergeVaultData.ts"
Cohesion: 0.19
Nodes (21): addLatestTombstones(), areSame(), clone(), conflictCopyMatchesBaseEntry(), conflictCopyWasDeleted(), entryContentFingerprint(), entryIsDeletedBy(), getConflictCopyBaseId() (+13 more)

### Community 38 - "state.ts"
Cohesion: 0.13
Nodes (14): buildPromptTitle(), ExtensionState, normalizeIdentity(), PreparedFillRecord, RegisteredFrameInfo, SavePromptEvaluation, SuggestionRowProps, FillDataResult (+6 more)

### Community 39 - "react-native-reanimated"
Cohesion: 0.13
Nodes (24): react-native-reanimated, Props, styles, EditRowControlsContainerProps, NativeDragHandleScrollLockContext, NativeDragHandleScrollLockProvider(), WebDragHandlePropsContext, WebDragHandlePropsProvider() (+16 more)

### Community 40 - "mapKdbxToClavisPass.ts"
Cohesion: 0.15
Nodes (22): kdbxweb, configureKdbxArgon2(), importKdbx(), addCustomField(), addTotpModule(), addValueModule(), binaryToBytes(), binaryWithMetaToAttachment() (+14 more)

### Community 41 - "useAuth"
Cohesion: 0.13
Nodes (22): ProtectedRoute(), getFocusedRouteName(), NavigationnContainer(), titlebarContentDragRoutes, LoginStack(), TabNavigator(), useAuth(), suppressNextSystemAuthAutoUnlock() (+14 more)

### Community 42 - "host.rs"
Cohesion: 0.16
Nodes (17): app_scheme(), bridge_result_to_response(), ensure_ready(), FillPayload, handle_request(), pairing_required(), PeerInfo, read_frame() (+9 more)

### Community 43 - "rnSodiumProvider.ts"
Cohesion: 0.14
Nodes (11): base64-js, libsodium-wrappers-sumo, react-native-sodium-jsi, getCryptoProvider(), rnSodiumProvider, td, te, verifyProviderInDev() (+3 more)

### Community 44 - "GoogleDriveLoginButton.tsx"
Cohesion: 0.20
Nodes (19): expo-auth-session, ANDROID_AUTH_PROMPT_OPTIONS, DESKTOP_OAUTH_PORTS, getMobileRedirectUri(), GoogleDriveLoginButtonContent(), randState(), readTokenResponse(), SCOPES (+11 more)

### Community 45 - "release.js"
Cohesion: 0.12
Nodes (19): androidGradleHasVersionCode(), androidGradleHasVersionName(), androidStringsHasRuntimeVersion(), cargoLockHasVersion(), cargoTomlHasVersion(), { execSync }, existingTags, filesToUpdate (+11 more)

### Community 46 - "ClavisPass Browser Extension"
Cohesion: 0.13
Nodes (12): Architecture, Browser loading notes, ClavisPass Browser Extension, Current feature set, Development, Important note, Working from the repo root, Browser Extension Store Release (+4 more)

### Community 47 - "CreditCardModule.tsx"
Cohesion: 0.20
Nodes (14): BackupStateType, CreditCardModule(), CreditCardState, detectCardBrand(), digitsOnly(), formatCardNumber(), maskCardNumber(), passesLuhn() (+6 more)

### Community 48 - "screen_lock.rs"
Cohesion: 0.11
Nodes (8): DeviceIdentity, get_device_identity(), CGSessionCopyCurrentDictionary(), emit(), ScreenLockPayload, Session, start(), wndproc()

### Community 49 - "ClavisPass Website Marketing Brief"
Cohesion: 0.05
Nodes (43): Attachments And Previews, Brand Details, Bring Your Own Sync, Browser Extension, Can I import my existing passwords?, Can my cloud provider read my passwords?, ClavisPass Website Marketing Brief, Conversion Priorities (+35 more)

### Community 50 - "createUniqueID"
Cohesion: 0.21
Nodes (22): addCardModule(), addCustomField(), addExpiryModule(), addIdentityModules(), addLoginModules(), addNote(), addSshKeyModule(), addTotp() (+14 more)

### Community 51 - "pairing.rs"
Cohesion: 0.21
Nodes (21): approve_pairing(), evaluate_pairing(), list_paired_clients(), list_pending_pairings(), list_rejected_clients(), load_pairing_store(), now_ms(), optional_identity_matches() (+13 more)

### Community 52 - "triggerGlobalError"
Cohesion: 0.20
Nodes (14): @tauri-apps/plugin-fs, fetchFile(), fetchUserInfo(), refreshAccessToken(), uploadFile(), ensureDesktop(), fetchFile(), fetchUserInfo() (+6 more)

### Community 53 - "background/bridge.ts"
Cohesion: 0.08
Nodes (33): Desktop bridge, deriveAppState(), DesktopBridgeService, getStoredPairingStatus(), normalizeDesktopStatus(), normalizeFillData(), normalizeSuggestions(), BrowserWriteResult (+25 more)

### Community 54 - "vcardExport.ts"
Cohesion: 0.35
Nodes (10): expo-sharing, buildFormattedName(), buildVCard(), canExportVCard(), clean(), escapeVCardText(), exportVCard(), firstModule() (+2 more)

### Community 55 - "BrowserBridgeWriteSync.tsx"
Cohesion: 0.35
Nodes (10): applyUpdateToEntry(), BrowserWriteKind, BrowserWriteRequest, createBrowserEntry(), CreatePayload, effectiveUrl(), normalizeText(), pickFolder() (+2 more)

### Community 57 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, @babel/core, eslint, eslint-config-universe, patch-package, prettier, react-test-renderer, @tauri-apps/cli (+14 more)

### Community 58 - "prepare-msix.js"
Cohesion: 0.10
Nodes (16): appExe, appVersion, assetsOutputDir, createUnplatedTargetSizeIcons(), escapePowerShellSingleQuoted(), fs, manifest, manifestSource (+8 more)

### Community 59 - "model/types.ts"
Cohesion: 0.11
Nodes (22): @react-navigation/native-stack, AddTriggerStackParamList, AppTabsParamList, LogoutStackParamList, RootStackParamList, AddTriggerStack(), Stack, HomeStack() (+14 more)

### Community 60 - "Vault V2 Key Envelope Roadmap"
Cohesion: 0.06
Nodes (29): Always Know, ClavisPass Agent Context, Context Routing, Fast Map, graphify, High-Risk Rules, Core Files, Master Password Lifetime (+21 more)

### Community 61 - "DeviceStorageClient.ts"
Cohesion: 0.35
Nodes (12): @react-native-async-storage/async-storage, fetchFile(), getActiveLocalVaultIdKey(), getLocalSyncKey(), getLocalSyncMetadataKey(), getVaultLocalSyncKey(), getVaultLocalSyncMetadataKey(), LocalSyncMetadata (+4 more)

### Community 62 - "ClavisPass"
Cohesion: 0.07
Nodes (28): 1. VaultSession (Authoritative & Secret-Capable), 2. VaultProvider (UI-Safe Projection), Authentication & Master Secret Handling, Backend / Plattform, CI / CD & Deployment, ClavisPass, Cryptography & Encryption Model, Defensive Defaults (+20 more)

### Community 63 - "bridge_commands.rs"
Cohesion: 0.15
Nodes (8): bridge_approve_pairing(), bridge_claim_pending_writes(), bridge_complete_write_request(), bridge_list_paired_clients(), bridge_list_pending_pairings(), bridge_list_rejected_clients(), bridge_publish_session(), bridge_reject_pairing()

### Community 64 - "NoteModule.tsx"
Cohesion: 0.08
Nodes (29): Interaction Polish, Props, styles, JsonLine(), NoteCodePreview(), Props, styles, InlinePart (+21 more)

### Community 65 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+11 more)

### Community 66 - "AttachmentModule.tsx"
Cohesion: 0.17
Nodes (19): expo-document-picker, @tauri-apps/plugin-dialog, AttachmentModule(), canPreviewAttachment(), downloadBrowserAttachment(), formatBytes(), getAttachmentIcon(), getFileExtension() (+11 more)

### Community 67 - "getTemplate.ts"
Cohesion: 0.14
Nodes (18): TemplateEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+10 more)

### Community 68 - "AppChip"
Cohesion: 0.19
Nodes (12): FolderFilter(), Props, styles, assertNever(), getModuleNameByEnum(), AppChip(), IconSource, normalizeIcon() (+4 more)

### Community 69 - "reactNativePaper.tsx"
Cohesion: 0.11
Nodes (14): ActivityIndicator, baseColors, Button, Chip, Divider, Icon, IconButton, MD3DarkTheme (+6 more)

### Community 71 - "i18n/index.ts"
Cohesion: 0.27
Nodes (8): expo-clipboard, i18next, initI18n(), resources, de, en, DEFAULT_NS, TranslationSchema

### Community 72 - "modulePolicy.ts"
Cohesion: 0.19
Nodes (12): buildEntryMeta(), firstModule(), firstValue(), getSecretFor(), isManagedModule(), MANAGED_MODULE_VALUES, ManagedModules, MetaExtractor (+4 more)

### Community 73 - "Datenschutzerklärung"
Cohesion: 0.09
Nodes (22): 10. Browser-Erweiterung, 11. Benachrichtigungen, 12. Kontaktaufnahme, 13. Webseite und Hosting, 14. Cookies, Tracking und Analytics, 15. App Stores und Download-Plattformen, 16. Rechtsgrundlagen, 17. Speicherdauer (+14 more)

### Community 74 - "autofill-preferences.ts"
Cohesion: 0.36
Nodes (11): buildPreferenceResult(), DEFAULT_POLICY, DomainPolicyStore, getInlineAutofillPreferenceForUrl(), normalizeHost(), normalizeMode(), normalizePolicy(), readPolicyStore() (+3 more)

### Community 75 - "reactNative.ts"
Cohesion: 0.11
Nodes (13): Animated, AnimatedValue, Dimensions, InteractionManager, Platform, Pressable, ScrollView, setPlatform() (+5 more)

### Community 76 - "Privacy Policy"
Cohesion: 0.09
Nodes (22): 10. Browser Extension, 11. Notifications, 12. Contact, 13. Website And Hosting, 14. Cookies, Tracking And Analytics, 15. App Stores And Download Platforms, 16. Legal Bases, 17. Retention (+14 more)

### Community 77 - "AuthProvider.tsx"
Cohesion: 0.20
Nodes (10): AuthContext, AuthContextType, AuthMasterContext, AuthMasterContextType, AuthProvider(), Props, ScreenLockLogoutController, initScreenLockLogout() (+2 more)

### Community 78 - "Nutzungsbedingungen"
Cohesion: 0.10
Nodes (20): 10. Erlaubte Nutzung, 11. Open Source und Lizenzen, 12. Kosten, 13. Drittanbieter, 14. Updates, 15. Haftung, 16. Beendigung der Nutzung, 17. Änderungen (+12 more)

### Community 79 - "DevModeProvider.tsx"
Cohesion: 0.24
Nodes (9): expo-linear-gradient, DevModeContext, DevModeContextType, Props, useDevMode(), AnalysisEntryGradient(), Props, SettingsFooter() (+1 more)

### Community 80 - "prepare-native-host-sidecar.js"
Cohesion: 0.14
Nodes (12): cargoArgs, { copyFileSync, existsSync, mkdirSync, writeFileSync }, detectHostTriple(), { execFileSync }, { join, resolve }, manifestPath, outputDir, outputPath (+4 more)

### Community 81 - "CloudStorageClient.ts"
Cohesion: 0.38
Nodes (6): TokenContextValue, FetchFileParams, TokenRefreshParams, Provider, RemoteFileContent, UploadFileParams

### Community 82 - "AttachmentPreviewScreen.native.tsx"
Cohesion: 0.16
Nodes (17): expo-file-system, expo-image, react-native-pdf, getAttachmentPreview(), AttachmentPreviewScreen(), AttachmentPreviewScreenProps, getDataUri(), getExtension() (+9 more)

### Community 84 - "session.rs"
Cohesion: 0.27
Nodes (8): session_store_path(), BridgeSessionSnapshot, clear_session(), load_session(), now_ms(), publish_session(), SESSION_TTL_MS, write_json_atomically()

### Community 85 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, build:chrome, build:firefox, build:firefox-local, dev, package:chrome, package:firefox (+6 more)

### Community 86 - "deriveIdentityClusters.ts"
Cohesion: 0.35
Nodes (11): buildPasswordUseCounts(), deriveIdentityClusters(), entryHasSimplePasswordRisk(), getEntryDomains(), getEntryModuleTypes(), getEntryPasswordValues(), getEntrySignals(), getModuleValue() (+3 more)

### Community 87 - "fill.ts"
Cohesion: 0.35
Nodes (10): applyTargets(), buildNoFieldsResult(), collectFillTargets(), emitInputEvents(), executeFill(), FillSnapshot, FillTarget, previewFill() (+2 more)

### Community 88 - "ScanScreen.tsx"
Cohesion: 0.31
Nodes (6): expo-camera, SessionQrPayload, ScanScreen(), ScanScreenProps, styles, isSessionQrPayload()

### Community 89 - "ValueIconsEnum"
Cohesion: 0.14
Nodes (13): ValueIconsEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+5 more)

### Community 90 - "Terms Of Use"
Cohesion: 0.10
Nodes (20): 10. Permitted Use, 11. Open Source And Licenses, 12. Costs, 13. Third-Party Providers, 14. Updates, 15. Liability, 16. Ending Use, 17. Changes (+12 more)

### Community 91 - "protocol.rs"
Cohesion: 0.20
Nodes (7): BridgeClientInfo, BridgeError, BridgePairingEnvelope, BridgeRequest, BridgeResponse, HOST_NAME, PROTOCOL_VERSION

### Community 92 - "path.rs"
Cohesion: 0.39
Nodes (8): bridge_dir(), BRIDGE_ENV_KEY, ensure_dir(), pairing_store_path(), platform_base_dir(), write_request_store_path(), write_result_store_path(), complete_request()

### Community 93 - "check-tauri-version-sync.js"
Cohesion: 0.24
Nodes (11): collectMismatches(), fs, getMajorMinor(), getNpmLockVersion(), mismatches, parseCargoLockVersions(), path, readJson() (+3 more)

### Community 94 - "errorBus.ts"
Cohesion: 0.42
Nodes (6): Listener, listeners, subscribeGlobalError(), unsubscribeGlobalError(), GlobalErrorPayload, GlobalErrorSnackbar()

### Community 95 - "ClavisPass Product Strategy Roadmap"
Cohesion: 0.11
Nodes (17): 1. Browser Extension Polish, 2. Passkeys, 3. Emergency Access / Trusted Contact, 4. Optional Web App, 5. Separate Secrets Sharing SaaS, Bitwarden Gaps To Treat As Strategic, ClavisPass Personal, ClavisPass Product Strategy Roadmap (+9 more)

### Community 96 - "Sync.tsx"
Cohesion: 0.10
Nodes (34): ChangeMasterPasswordModal(), Props, styles, Props, Sync(), createVaultDeviceId(), DeviceIdentity, getCurrentVaultDeviceId() (+26 more)

### Community 97 - "bundle"
Cohesion: 0.17
Nodes (12): bundle, active, category, copyright, createUpdaterArtifacts, externalBin, fileAssociations, icon (+4 more)

### Community 98 - "Sync And Storage Context"
Cohesion: 0.25
Nodes (7): Core Files, Providers, Settings Schema, Storage Layers, Sync And Storage Context, Tokens, StoreSchema

### Community 99 - "Identity Management Concept"
Cohesion: 0.13
Nodes (14): Confidence And Trust, Core Idea, Data Model Direction, Design Tone, Identity Detail View, Identity Management Concept, Identity Tab, Important Principle (+6 more)

### Community 100 - "withIosGoogleOAuthScheme.js"
Cohesion: 0.43
Nodes (5): ensureUrlScheme(), normalizeClientId(), {
  ensureUrlScheme,
  toReverseClientIdScheme,
}, toReverseClientIdScheme(), { withInfoPlist }

### Community 101 - "detectTauriEnvironment"
Cohesion: 0.16
Nodes (18): applyNativeContentProtection(), applyTauriContentProtection(), ContentProtectionContext, ContentProtectionContextValue, ContentProtectionProvider(), BrowserBridgePairingPrompt(), PairingAction, PromptButton() (+10 more)

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
Cohesion: 0.03
Nodes (69): BrandHeaderProps, InlineNoticeProps, @monaco-editor/react, react-native-gesture-handler, react-native-paper, CustomBottomTab(), getActiveRouteName(), Props (+61 more)

### Community 106 - "plugins"
Cohesion: 0.20
Nodes (10): args, customProtocol, plugins, cli, deepLink, updater, endpoints, pubkey (+2 more)

### Community 107 - "autofill-cache.ts"
Cohesion: 0.17
Nodes (21): clearAutofillDomainCache(), countPasswordSuggestions(), DomainAutofillCache, DomainAutofillCacheEntry, getAutofillEligibilityForUrl(), getCachedAutofillMatchCountForUrl(), getCachedMatchCount(), isFresh() (+13 more)

### Community 109 - "container/AnimatedOpacityContainer.tsx"
Cohesion: 0.31
Nodes (6): AnimatedOpacityContainer(), Props, AnimatedOpacityContainerWeb(), Props, Props, AnimatedOpacityContainer()

### Community 110 - "SettingsContainer.tsx"
Cohesion: 0.50
Nodes (4): Props, SettingsContainer(), styles, SubItem()

### Community 111 - "editHistory.ts"
Cohesion: 0.23
Nodes (12): appendLog(), areValuesEqual(), cloneValue(), createLogEntry(), EditHistoryActionType, EditHistoryMeta, EditSessionLogEntry, HistoryEntry (+4 more)

### Community 112 - "brand.ts"
Cohesion: 0.20
Nodes (7): BrandLogo(), CLAVISPASS_BRAND_NAME, CLAVISPASS_EXTENSION_DESCRIPTION, CLAVISPASS_EXTENSION_NAME, CLAVISPASS_POPUP_DESCRIPTION, CLAVISPASS_POPUP_EYEBROW, CLAVISPASS_POPUP_TITLE

### Community 113 - "DropboxLoginButton.tsx"
Cohesion: 0.17
Nodes (12): expo-random, expo-web-browser, @fabianlars/tauri-plugin-oauth, ANDROID_AUTH_PROMPT_OPTIONS, getMobileRedirectUri(), randState(), SCOPES, getAppRedirectUri() (+4 more)

### Community 114 - "reactNativeReanimated.tsx"
Cohesion: 0.25
Nodes (4): Animated, AnimatedView, Easing, FadeInDown

### Community 116 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, @types/chrome, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react

### Community 117 - "compilerOptions"
Cohesion: 0.29
Nodes (6): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, include

### Community 118 - "generatePassword.ts"
Cohesion: 0.29
Nodes (5): generatePassword(), LOWERCASE_CHAR_CODES, NUMBER_CHAR_CODES, SYMBOL_CHAR_CODES, UPPERCASE_CHAR_CODES

### Community 119 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, moduleResolution, strict, exclude, extends

### Community 120 - "Store Release Roadmap"
Cohesion: 0.17
Nodes (11): Apple Developer Program, Arratel Setup Plan, Chrome Web Store, Goals, Google Play, Microsoft Store, Publisher Naming, References (+3 more)

### Community 122 - "GoogleDriveClient.ts"
Cohesion: 0.13
Nodes (20): buildMultipartBody(), escapeDriveQueryString(), fetchFile(), fetchUserInfo(), findFileIdByName(), GoogleTokenRefreshError, readJsonSafe(), readTextSafe() (+12 more)

### Community 123 - "CryptoProvider"
Cohesion: 0.19
Nodes (15): CryptoProvider, decryptVaultV1(), encryptVaultV1(), verifyVaultV1Provider(), makeV2KeywrapAadBytes(), makeV2PayloadAadBytes(), te, V2_KEYWRAP_AAD_OBJECT (+7 more)

### Community 124 - "TotpModule.tsx"
Cohesion: 0.13
Nodes (16): otpauth, react-native-circular-progress, AnalysisEntry(), Props, Props, styles, TotpItem(), styles (+8 more)

### Community 126 - "AnimatedContainer"
Cohesion: 0.10
Nodes (34): expo-blur, @kichiyaki/react-native-barcode-generator, @react-navigation/native, react-qr-code, HomeStackParamList, Stack, CardItem(), Props (+26 more)

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

### Community 141 - "DocumentTypeEnum"
Cohesion: 0.33
Nodes (6): DocumentTypeEnum, BITWARDEN, CHROME, FIREFOX, KDBX, PCLOUD

### Community 142 - "linux"
Cohesion: 0.67
Nodes (3): linux, depends, deb

### Community 144 - "Crypto Context"
Cohesion: 0.33
Nodes (5): Core Files, Critical Rules, Crypto Context, Current Vault Format, Verification

### Community 171 - "Screen Standardization Context"
Cohesion: 0.40
Nodes (4): Common Refactor Targets, Files To Check First, Known Custom Screens, Screen Standardization Context

### Community 172 - "browser-extension/package.json"
Cohesion: 0.18
Nodes (10): react, react-dom, @types/react, @types/react-dom, typescript, name, private, type (+2 more)

### Community 173 - "ClavisPassHubDiscoveryResult.ts"
Cohesion: 0.29
Nodes (6): ClavisPassHubDiscoveryResult, ClavisPassHubDiscoveryStatus, DiscoveryCheckingResult, DiscoveryErrorResult, DiscoveryIdleResult, DiscoverySuccessResult

### Community 175 - "Firefox Store Release Notes"
Cohesion: 0.25
Nodes (7): Extension Identity, Firefox Store Release Notes, Listing, Pre-Submit Check, Privacy Policy Draft, Release Artifacts, Reviewer Notes

### Community 176 - "UI Context"
Cohesion: 0.25
Nodes (7): i18n, Important Files, Menus And Dropdowns, Platform Model, Related UI Context, Titlebar And Chrome, UI Context

### Community 177 - "useSetting"
Cohesion: 0.10
Nodes (20): expo-notifications, DEFAULT_KEYS, loadSettingWithTimeout(), SettingsContext, SettingsContextValue, SettingsState, useSetting(), buildPendingExpiryReminders() (+12 more)

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
Cohesion: 0.09
Nodes (31): @gorhom/bottom-sheet, @react-native-masked-view/masked-view, @shopify/flash-list, TokenQRCodeModal(), AddValueModal(), ACTION_ICON, EditHistoryModal(), Props (+23 more)

### Community 185 - "dependencies"
Cohesion: 0.67
Nodes (3): dependencies, react, react-dom

### Community 189 - "CustomTitlebar.tsx"
Cohesion: 0.12
Nodes (18): Chrome And Drag Regions, Core Files, Desktop And Tauri Context, Fast Access, Runtime Model, Tauri Responsibilities, showMainWindow(), StartBehavior (+10 more)

### Community 190 - "pkce.web.ts"
Cohesion: 0.80
Nodes (4): base64Url(), createPkcePair(), randomBytes(), toCodeChallenge()

### Community 195 - "VaultProvider.tsx"
Cohesion: 0.11
Nodes (20): VaultContext, VaultContextType, VaultData, FolderSchema, ValuesListTypeSchema, VaultDataType, VaultDataTypeSchema, VaultEntryTombstone (+12 more)

### Community 196 - "GlobalClipboardSnackbar.tsx"
Cohesion: 0.25
Nodes (8): clipboardClearScheduler, Handler, handlers, subscribeClipboardCopied(), unsubscribeClipboardCopied(), ClipboardCopyPayload, GlobalClipboardSnackbar(), msToSecCeil()

### Community 197 - "CloudProvider.tsx"
Cohesion: 0.26
Nodes (15): CloudProvider(), isInvalidGrant(), OAuthRefreshError, Props, StoredAuth, TokenContext, logout(), clearClavisPassHubVaultEtag() (+7 more)

### Community 204 - "SettingsScreen.tsx"
Cohesion: 0.08
Nodes (41): expo-local-authentication, expo-updates, simple-icons, useContentProtection(), Auth(), Props, authenticateUser(), invokeTauriSystemAuth() (+33 more)

## Knowledge Gaps
- **128 isolated node(s):** `react`, `react-dom`, `@types/chrome`, `@types/react`, `@types/react-dom` (+123 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1626 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **41 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `react-native`, `logger.ts`, `package.json`, `store.ts`, `ClavisPassHubClient.ts`, `decryptVaultContent.ts`, `hotkeys.ts`, `react-native-reanimated`, `GoogleDriveLoginButton.tsx`, `createUniqueID`, `triggerGlobalError`, `HomeScreen.tsx`, `vite.config.ts`, `model/types.ts`, `DeviceStorageClient.ts`, `getTemplate.ts`, `VaultProvider.tsx`, `modulePolicy.ts`, `Sync.tsx`, `withIosGoogleOAuthScheme.js`, `DropboxLoginButton.tsx`, `generatePassword.ts`, `GoogleDriveClient.ts`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **What connects `react`, `react-dom`, `@types/chrome` to the rest of the system?**
  _128 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ModulesEnum` be split into smaller, more focused modules?**
  _Cohesion score 0.0318385042677144 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `logger.ts`, `package.json`, `useTheme`, `App.tsx`, `EditScreen.tsx`, `ListItem.tsx`, `BrowserExtensionsScreen.tsx`, `useVault`, `AnalysisDetailScreen.tsx`, `AnimatedPressable`, `FastAccess.ts`, `store.ts`, `MenuItem`, `isTauri.ts`, `Header`, `UpdateManager.tsx`, `hotkeys.ts`, `LoginScreen.tsx`, `Login.tsx`, `react-native-reanimated`, `useAuth`, `GoogleDriveLoginButton.tsx`, `CreditCardModule.tsx`, `useSetting`, `vcardExport.ts`, `HomeScreen.tsx`, `model/types.ts`, `CustomTitlebar.tsx`, `NoteModule.tsx`, `AttachmentModule.tsx`, `AppChip`, `CloudProvider.tsx`, `GlobalClipboardSnackbar.tsx`, `SettingsScreen.tsx`, `AuthProvider.tsx`, `DevModeProvider.tsx`, `AttachmentPreviewScreen.native.tsx`, `ScanScreen.tsx`, `errorBus.ts`, `Sync.tsx`, `detectTauriEnvironment`, `ref_react`, `container/AnimatedOpacityContainer.tsx`, `SettingsContainer.tsx`, `DropboxLoginButton.tsx`, `TotpModule.tsx`, `AnimatedContainer`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.01904761904761905 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `react-native` be split into smaller, more focused modules?**
  _Cohesion score 0.11842105263157894 - nodes in this community are weakly interconnected._
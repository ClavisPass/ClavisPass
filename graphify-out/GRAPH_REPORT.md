# Graph Report - ClavisPass  (2026-10-10)

## Corpus Check
- 564 files · ~340,991 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 36 file(s) not represented in the graph (top: .xml 11, (none) 8, .properties 2)

## Summary
- 3763 nodes · 10434 edges · 201 communities (155 shown, 46 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 145 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d924a3c2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- getModule.tsx
- dependencies
- ModulesEnum.ts
- IdentityDetailScreen.tsx
- package.json
- RecoveryCodesModule.tsx
- App.tsx
- DocumentTypeEnum
- EditScreen.tsx
- HomeScreen.tsx
- useTheme
- content/index.ts
- shared/types.ts
- popup/App.tsx
- AttachmentPreviewScreen.native.tsx
- background/index.ts
- shared/bridge.ts
- useSetting
- UI Patterns Context
- FastAccess.ts
- ClavisPass Browser Extension
- expo
- ClavisPassHubClient.ts
- ThemeProvider.tsx
- write.rs
- scripts
- CardDetailsScreen.tsx
- manifest.json
- useClipboardCopy.ts
- forms.ts
- lib.rs
- DevicesScreen.tsx
- UpdateManager.tsx
- GlobalShortcuts.tsx
- commands.rs
- LoginScreen.tsx
- ModulesEnum
- deriveIdentityClusters.ts
- state.ts
- EditRowControlsContainer.tsx
- mapKdbxToClavisPass.ts
- CloseBehaviorState
- host.rs
- GoogleDriveClient.ts
- GoogleDriveLoginButton.tsx
- release.js
- Security And Vault Context
- react-native
- screen_lock.rs
- ClavisPass Website Marketing Brief
- bitwarden.ts
- pairing.rs
- CloudStorageClient.ts
- background/bridge.ts
- AddModuleModal.tsx
- TemplateEnum
- vite.config.ts
- devDependencies
- prepare-msix.js
- autofill-preferences.ts
- Vault V2 Key Envelope Roadmap
- mergeVaultData.ts
- ClavisPass
- fill.ts
- ref_react
- compilerOptions
- AttachmentModule.tsx
- store.ts
- ObjcId
- reactNativePaper.tsx
- MainApplication.kt
- bridge_commands.rs
- brand.ts
- Datenschutzerklärung
- AuthProvider
- reactNative.ts
- Privacy Policy
- tab-context.ts
- Nutzungsbedingungen
- ExpiryPickerModal
- prepare-native-host-sidecar.js
- screenLockLogout.ts
- NoteFullscreenEditor.web.tsx
- MainActivity.kt
- session.rs
- scripts
- CustomTitlebar
- decryptVaultContent.ts
- CreditCardModule.tsx
- ValueIconsEnum
- Terms Of Use
- protocol.rs
- Tech Stack
- check-tauri-version-sync.js
- AnalysisDetailScreen.tsx
- ClavisPass Product Strategy Roadmap
- vaultDevices.ts
- bundle
- pkce.web.ts
- Identity Management Concept
- ClavisPass Project Context
- detectTauriEnvironment
- tauri.conf.json
- withAndroidApplicationId.js
- build-web-demo.js
- ContentProtectionProvider.tsx
- plugins
- autofill-cache.ts
- DeviceStorageClient.ts
- container/AnimatedOpacityContainer.tsx
- Cryptography & Encryption Model
- editHistory.ts
- device_identity.rs
- appScheme.test.ts
- reactNativeReanimated.tsx
- reactNavigationNative.ts
- devDependencies
- compilerOptions
- withIosGoogleOAuthScheme.js
- tsconfig.json
- Store Release Roadmap
- PairingStatus
- ref_fs
- vcardExport.ts
- TotpModule.tsx
- secureStore.ts
- model/types.ts
- macOS
- windows
- gorhomBottomSheet.tsx
- WifiTypeEnum
- build
- vite-env.d.ts
- AuthReplyBlock
- errorBus.ts
- BridgeStatusBadge.tsx
- path.rs
- linux
- asyncStorage.ts
- vaultIdentity.ts
- tokens.ts
- env.d.ts
- DROPBOX_CLIENT_ID
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_ID_ANDROID
- GOOGLE_CLIENT_ID_DESKTOP
- GOOGLE_CLIENT_ID_IOS
- GOOGLE_CLIENT_SECRET_DESKTOP
- ClavisPass
- BrandHeader.tsx
- browser-extension/package.json
- InlineNotice.tsx
- NoteModule.tsx
- Firefox Store Release Notes
- UI Context
- DigitalCardModule.tsx
- ClavisPass Firefox Add-on Reviewer Build
- ClavisPassHubDiscoveryResult.ts
- Bitwarden Import Roadmap
- Agent Workflow Context
- Build, Release, And Update Context
- Identity Context
- Vault Architecture & Trust Boundaries
- dependencies
- CLAUDE.md
- .claude/CLAUDE.md
- vitest
- Screen Standardization Context
- DropdownLayer.web.tsx
- Crypto Context
- AppearanceSettingsSection.tsx
- BrowserBridgeWriteSync.tsx
- VaultProvider.tsx
- GlobalClipboardSnackbar.tsx
- expoVectorIcons.tsx
- Vault Modules Context
- AnimatedLogo.tsx
- SettingsScreen.tsx

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 266 edges
2. `react-native` - 182 edges
3. `react-native-paper` - 128 edges
4. `ModulesEnum` - 110 edges
5. `react-i18next` - 101 edges
6. `detectTauriEnvironment()` - 80 edges
7. `AnimatedPressable` - 78 edges
8. `Modal()` - 57 edges
9. `SettingsScreen()` - 56 edges
10. `useVault()` - 55 edges

## Surprising Connections (you probably didn't know these)
- `Tokens` --references--> `CloudProvider()`  [INFERRED]
  docs/context/sync-storage.md → src/app/providers/CloudProvider.tsx
- `Vault Session Boundary` --references--> `VaultProvider()`  [INFERRED]
  docs/context/security.md → src/app/providers/VaultProvider.tsx
- `Reorder Flows` --references--> `Header()`  [INFERRED]
  docs/context/vault-modules.md → src/shared/components/Header.tsx
- `Chips` --references--> `AppChip()`  [INFERRED]
  docs/context/ui-patterns.md → src/shared/components/chips/AppChip.tsx
- `Master Password Lifetime` --references--> `AuthProvider()`  [INFERRED]
  docs/context/security.md → src/app/providers/AuthProvider.tsx

## Import Cycles
- None detected.

## Communities (201 total, 46 thin omitted)

### Community 0 - "getModule.tsx"
Cohesion: 0.05
Nodes (72): zod, TaskModule(), AddressModuleType, AddressModuleTypeSchema, regex, CompanyModuleType, CompanyModuleTypeSchema, regex (+64 more)

### Community 1 - "dependencies"
Cohesion: 0.02
Nodes (105): dependencies, argon2-browser, @babel/plugin-proposal-export-namespace-from, base64-js, crypto-js, expo, expo-auth-session, expo-blur (+97 more)

### Community 2 - "ModulesEnum.ts"
Cohesion: 0.11
Nodes (38): Shared Module UI, expo-linking, EditRowControlsContainer(), ModuleContainer(), ModuleContainerProps, moduleStyles, AddressModule(), AddressState (+30 more)

### Community 3 - "IdentityDetailScreen.tsx"
Cohesion: 0.14
Nodes (21): Standard Checklist, Headers, IdentityStackParamList, IdentityStack(), Stack, IdentityEmailLogo(), IdentityEmailLogoProps, styles (+13 more)

### Community 4 - "package.json"
Cohesion: 0.03
Nodes (73): react, react-dom, @types/react, @types/react-dom, typescript, main, name, private (+65 more)

### Community 5 - "RecoveryCodesModule.tsx"
Cohesion: 0.15
Nodes (15): FastAccessType, FastAccessTypeSchema, RecoveryCodesModule(), splitKeepingRemainder(), styles, tokenize(), Props, QuickSelect() (+7 more)

### Community 6 - "App.tsx"
Cohesion: 0.09
Nodes (29): App(), AppShell(), AppWithNavigation(), DemoBootstrap(), getCurrentWindowSafe(), withAlpha(), @expo-google-fonts/lexend-exa, react-native-autocomplete-dropdown (+21 more)

### Community 7 - "DocumentTypeEnum"
Cohesion: 0.33
Nodes (6): DocumentTypeEnum, BITWARDEN, CHROME, FIREFOX, KDBX, PCLOUD

### Community 8 - "EditScreen.tsx"
Cohesion: 0.05
Nodes (61): extractFastAccessObject(), SubItem(), FolderFilter(), CategoryItem(), ExpiryOverviewItem(), ellipsize(), failedFaviconUrls, ListItem() (+53 more)

### Community 9 - "HomeScreen.tsx"
Cohesion: 0.06
Nodes (65): Current Vault Format, Known Custom Screens, Implementation Phases, expo-linear-gradient, AuthContext, AuthContextType, AuthMasterContext, AuthMasterContextType (+57 more)

### Community 10 - "useTheme"
Cohesion: 0.11
Nodes (37): useTheme(), BrowserBridgePairingPrompt(), PairingAction, PromptButton(), styles, CornerOption(), FastAccessPositionPicker(), actOnBrowserExtensionPairing() (+29 more)

### Community 11 - "content/index.ts"
Cohesion: 0.14
Nodes (32): applyThemeToInlinePicker(), clearInlinePreview(), commitInlineAction(), createCloseIcon(), createInlineLogo(), createPickerLogo(), ensureInlineStyles(), fillSuggestionFromPicker() (+24 more)

### Community 12 - "shared/types.ts"
Cohesion: 0.05
Nodes (47): BackgroundHandler, BackgroundHandlerMap, BackgroundMessageContext, BackgroundMessageRouter, FillPreviewResult, FillStateCardProps, GetFillDataForEntryPayload, ContentMessage (+39 more)

### Community 13 - "popup/App.tsx"
Cohesion: 0.09
Nodes (33): registerContentFrame(), App(), handleFill(), handleOpenDesktopApp(), handlePromptResolution(), handleToggleSavePrompts(), handleUpdateAutofillMode(), refreshInlineAutofillPreference() (+25 more)

### Community 14 - "AttachmentPreviewScreen.native.tsx"
Cohesion: 0.19
Nodes (15): expo-image, getAttachmentPreview(), AttachmentPreviewScreen(), AttachmentPreviewScreenProps, getDataUri(), getExtension(), iframeStyle, AttachmentPreviewScreen() (+7 more)

### Community 15 - "background/index.ts"
Cohesion: 0.12
Nodes (34): buildCreatePayload(), buildUpdatePayload(), clearTabBadge(), delay(), desktopBridge, ensureContentScriptReady(), evaluateSavePromptCandidate(), fillFirstAvailableMatchInActiveTab() (+26 more)

### Community 16 - "shared/bridge.ts"
Cohesion: 0.14
Nodes (22): NativeMessagingClient, NativeMessagingError, toBridgeError(), validateBridgeResponse(), withTimeout(), createInstanceId(), getBridgeClientInfo(), getBrowserDisplayName() (+14 more)

### Community 17 - "useSetting"
Cohesion: 0.06
Nodes (36): getActiveRouteName(), LeftSideTabBar(), sidebarWidth, styles, DEFAULT_KEYS, SettingsContext, SettingsContextValue, SettingsState (+28 more)

### Community 18 - "UI Patterns Context"
Cohesion: 0.25
Nodes (7): Chips, Compact Search Behavior, Content Panels, Current Visual Direction, Item Surfaces, UI Patterns Context, Verification

### Community 19 - "FastAccess.ts"
Cohesion: 0.10
Nodes (41): expo-notifications, @tauri-apps/api, FastAccessSessionBridge(), MobileFastAccessOverlay(), FAST_ACCESS_NOTIFICATION_CATEGORY, FAST_ACCESS_POPUP_LABEL, FAST_ACCESS_POSITION_CHANGED_EVENT, FAST_ACCESS_READY_EVENT (+33 more)

### Community 20 - "ClavisPass Browser Extension"
Cohesion: 0.13
Nodes (12): Architecture, Browser loading notes, ClavisPass Browser Extension, Current feature set, Development, Important note, Working from the repo root, Browser Extension Store Release (+4 more)

### Community 21 - "expo"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, adaptiveIcon, blockedPermissions, package, permissions, versionCode, projectId (+31 more)

### Community 22 - "ClavisPassHubClient.ts"
Cohesion: 0.13
Nodes (35): calculateExpiresIn(), checkDiscovery(), createHubError(), createHubErrorFromPayload(), DiscoveryResponse, ensureVaultEtagForUpload(), fetchFile(), fetchUserInfo() (+27 more)

### Community 23 - "ThemeProvider.tsx"
Cohesion: 0.10
Nodes (24): react-native-circular-progress, Props, ThemeContext, ThemeContextType, AnalysisEntry(), Props, AnalysisEntryGradient(), Props (+16 more)

### Community 24 - "write.rs"
Cohesion: 0.12
Nodes (31): write_result_store_path(), as_io_error(), BrowserWriteKind, CreateEntryFromBrowser, UpdateEntryFromBrowser, BrowserWriteRequest, BrowserWriteRequestStore, BrowserWriteResult (+23 more)

### Community 25 - "scripts"
Cohesion: 0.05
Nodes (37): scripts, android, android:build:apk, android:build:store, android:build:store-submit, android:submit:store, extension:build, extension:build:chrome (+29 more)

### Community 26 - "CardDetailsScreen.tsx"
Cohesion: 0.19
Nodes (19): @kichiyaki/react-native-barcode-generator, react-qr-code, CardItem(), Props, styles, DigitalCardType, buildFaviconUrl(), DigitalCardPalette (+11 more)

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
Cohesion: 0.05
Nodes (49): domain_contains(), fill_data_for_entry(), FillDataResult, first_string(), FolderRef, login_entry(), match_domain_score(), normalize_domain() (+41 more)

### Community 31 - "DevicesScreen.tsx"
Cohesion: 0.07
Nodes (45): Standard Screen Structure, expo-camera, @hello-pangea/dnd, react-native-draggable-flatlist, @react-navigation/native, HomeStackParamList, NoteFullscreenEditor(), InlinePart (+37 more)

### Community 32 - "UpdateManager.tsx"
Cohesion: 0.08
Nodes (37): expo-updates, react-native-safe-area-context, @tauri-apps/plugin-updater, ProtectedRoute(), getFocusedRouteName(), NavigationnContainer(), titlebarContentDragRoutes, titlebarLightRoutes (+29 more)

### Community 33 - "GlobalShortcuts.tsx"
Cohesion: 0.12
Nodes (18): CustomBottomTab(), getActiveRouteName(), HotkeyRecorderItem(), Props, beginHotkeyRecording(), emit(), Listener, listeners (+10 more)

### Community 34 - "commands.rs"
Cohesion: 0.10
Nodes (10): AUTH_REPLY_SIGNATURE, authenticate_with_system(), BLOCK_HAS_SIGNATURE, CF_UNICODETEXT_FORMAT, get_main_window_hwnd(), LAPOLICY_DEVICE_OWNER_AUTHENTICATION, reset_window_size(), set_content_protection() (+2 more)

### Community 35 - "LoginScreen.tsx"
Cohesion: 0.14
Nodes (35): OAuthRefreshError, Props, StoredAuth, TokenContext, useToken(), OnlineContext, OnlineContextType, Props (+27 more)

### Community 36 - "ModulesEnum"
Cohesion: 0.08
Nodes (24): ModulesEnum, ADDRESS, ATTACHMENT, COMPANY, CREDIT_CARD, CUSTOM_FIELD, DIGITAL_CARD, DOCUMENT (+16 more)

### Community 37 - "deriveIdentityClusters.ts"
Cohesion: 0.29
Nodes (11): buildPasswordUseCounts(), deriveIdentityClusters(), entryHasSimplePasswordRisk(), getEntryDomains(), getEntryModuleTypes(), getEntryPasswordValues(), getEntrySignals(), getModuleValue() (+3 more)

### Community 38 - "state.ts"
Cohesion: 0.13
Nodes (14): buildPromptTitle(), ExtensionState, normalizeIdentity(), PreparedFillRecord, RegisteredFrameInfo, SavePromptEvaluation, SuggestionRowProps, FillDataResult (+6 more)

### Community 39 - "EditRowControlsContainer.tsx"
Cohesion: 0.16
Nodes (20): EditRowControlsContainerProps, NativeDragHandleScrollLockContext, NativeDragHandleScrollLockProvider(), WebDragHandlePropsContext, WebDragHandlePropsProvider(), dragDropAnimationConfig, DraggableModulesList(), DraggableModulesFooter() (+12 more)

### Community 40 - "mapKdbxToClavisPass.ts"
Cohesion: 0.14
Nodes (25): kdbxweb, Import(), configureKdbxArgon2(), importKdbx(), addCustomField(), addTotpModule(), addValueModule(), binaryToBytes() (+17 more)

### Community 41 - "CloseBehaviorState"
Cohesion: 0.13
Nodes (10): claim_pending_lock_request(), close_main_window(), CloseBehavior, Exit, Hide, CloseBehaviorState, focus_main_window(), schedule_exit_watchdog() (+2 more)

### Community 42 - "host.rs"
Cohesion: 0.16
Nodes (17): app_scheme(), bridge_result_to_response(), ensure_ready(), FillPayload, handle_request(), pairing_required(), PeerInfo, read_frame() (+9 more)

### Community 43 - "GoogleDriveClient.ts"
Cohesion: 0.15
Nodes (19): buildMultipartBody(), escapeDriveQueryString(), fetchFile(), findFileIdByName(), GoogleTokenRefreshError, readJsonSafe(), readTextSafe(), refreshAccessToken() (+11 more)

### Community 44 - "GoogleDriveLoginButton.tsx"
Cohesion: 0.15
Nodes (24): expo-auth-session, expo-random, expo-web-browser, @fabianlars/tauri-plugin-oauth, ANDROID_AUTH_PROMPT_OPTIONS, randState(), SCOPES, ANDROID_AUTH_PROMPT_OPTIONS (+16 more)

### Community 45 - "release.js"
Cohesion: 0.12
Nodes (19): androidGradleHasVersionCode(), androidGradleHasVersionName(), androidStringsHasRuntimeVersion(), cargoLockHasVersion(), cargoTomlHasVersion(), { execSync }, existingTags, filesToUpdate (+11 more)

### Community 46 - "Security And Vault Context"
Cohesion: 0.33
Nodes (5): Core Files, Module Policy, Security And Vault Context, UI-Safe Metadata, Vault Session Boundary

### Community 47 - "react-native"
Cohesion: 0.05
Nodes (48): react-native, react-native-reanimated, Props, styles, FilterItem, FiltersNarrowProps, FiltersWide, FiltersWideProps (+40 more)

### Community 48 - "screen_lock.rs"
Cohesion: 0.14
Nodes (6): CGSessionCopyCurrentDictionary(), emit(), ScreenLockPayload, Session, start(), wndproc()

### Community 49 - "ClavisPass Website Marketing Brief"
Cohesion: 0.05
Nodes (43): Attachments And Previews, Brand Details, Bring Your Own Sync, Browser Extension, Can I import my existing passwords?, Can my cloud provider read my passwords?, ClavisPass Website Marketing Brief, Conversion Priorities (+35 more)

### Community 50 - "bitwarden.ts"
Cohesion: 0.20
Nodes (21): addCardModule(), addCustomField(), addExpiryModule(), addIdentityModules(), addLoginModules(), addNote(), addSshKeyModule(), addTotp() (+13 more)

### Community 51 - "pairing.rs"
Cohesion: 0.26
Nodes (18): approve_pairing(), evaluate_pairing(), list_paired_clients(), list_pending_pairings(), list_rejected_clients(), load_pairing_store(), now_ms(), optional_identity_matches() (+10 more)

### Community 52 - "CloudStorageClient.ts"
Cohesion: 0.13
Nodes (22): @tauri-apps/plugin-fs, TokenContextValue, fetchFile(), fetchUserInfo(), refreshAccessToken(), uploadFile(), fetchUserInfo(), ensureDesktop() (+14 more)

### Community 53 - "background/bridge.ts"
Cohesion: 0.08
Nodes (33): Desktop bridge, deriveAppState(), DesktopBridgeService, getStoredPairingStatus(), normalizeDesktopStatus(), normalizeFillData(), normalizeSuggestions(), BrowserWriteResult (+25 more)

### Community 54 - "AddModuleModal.tsx"
Cohesion: 0.17
Nodes (13): AddModuleModalCompactFav(), defineModules(), IdsOf, MissingIds, ModuleCategory, ModuleMeta, Props, TinyFilterChip() (+5 more)

### Community 55 - "TemplateEnum"
Cohesion: 0.15
Nodes (13): TemplateEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+5 more)

### Community 57 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, @babel/core, eslint, eslint-config-universe, patch-package, prettier, react-test-renderer, @tauri-apps/cli (+14 more)

### Community 58 - "prepare-msix.js"
Cohesion: 0.10
Nodes (16): appExe, appVersion, assetsOutputDir, createUnplatedTargetSizeIcons(), escapePowerShellSingleQuoted(), fs, manifest, manifestSource (+8 more)

### Community 59 - "autofill-preferences.ts"
Cohesion: 0.36
Nodes (11): buildPreferenceResult(), DEFAULT_POLICY, DomainPolicyStore, getInlineAutofillPreferenceForUrl(), normalizeHost(), normalizeMode(), normalizePolicy(), readPolicyStore() (+3 more)

### Community 60 - "Vault V2 Key Envelope Roadmap"
Cohesion: 0.20
Nodes (9): Current V1 Behavior, Envelope Design Notes, Goal, Master Password Change, Migration Strategy, Non-Goals, Testing Plan, V2 Behavior (+1 more)

### Community 61 - "mergeVaultData.ts"
Cohesion: 0.18
Nodes (22): VaultEntryTombstone, addLatestTombstones(), areSame(), clone(), conflictCopyMatchesBaseEntry(), conflictCopyWasDeleted(), entryContentFingerprint(), entryIsDeletedBy() (+14 more)

### Community 62 - "ClavisPass"
Cohesion: 0.15
Nodes (12): ClavisPass, Defensive Defaults, FAQ, Features, Homepage, Installation, License, Module Policy System (+4 more)

### Community 63 - "fill.ts"
Cohesion: 0.35
Nodes (10): applyTargets(), buildNoFieldsResult(), collectFillTargets(), emitInputEvents(), executeFill(), FillSnapshot, FillTarget, previewFill() (+2 more)

### Community 64 - "ref_react"
Cohesion: 0.06
Nodes (52): @expo/vector-icons, react-i18next, react-native-paper, BrowserExtensionsModal(), Props, Props, TokenQRCodeModal(), Props (+44 more)

### Community 65 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+11 more)

### Community 66 - "AttachmentModule.tsx"
Cohesion: 0.14
Nodes (22): expo-document-picker, @tauri-apps/plugin-dialog, AttachmentModule(), canPreviewAttachment(), downloadBrowserAttachment(), formatBytes(), getAttachmentIcon(), getFileExtension() (+14 more)

### Community 67 - "store.ts"
Cohesion: 0.06
Nodes (44): Core Files, Providers, Settings Schema, Storage Layers, Sync And Storage Context, Tokens, clampWidth(), SettingsQuickSelect() (+36 more)

### Community 68 - "ObjcId"
Cohesion: 0.23
Nodes (15): authenticate_with_system_impl(), _Block_copy(), _Block_release(), check_system_auth_available(), cstring(), new_la_context(), _NSConcreteStackBlock, objc_class() (+7 more)

### Community 69 - "reactNativePaper.tsx"
Cohesion: 0.11
Nodes (14): ActivityIndicator, baseColors, Button, Chip, Divider, Icon, IconButton, MD3DarkTheme (+6 more)

### Community 71 - "bridge_commands.rs"
Cohesion: 0.15
Nodes (8): bridge_approve_pairing(), bridge_claim_pending_writes(), bridge_complete_write_request(), bridge_list_paired_clients(), bridge_list_pending_pairings(), bridge_list_rejected_clients(), bridge_publish_session(), bridge_reject_pairing()

### Community 72 - "brand.ts"
Cohesion: 0.20
Nodes (7): BrandLogo(), CLAVISPASS_BRAND_NAME, CLAVISPASS_EXTENSION_DESCRIPTION, CLAVISPASS_EXTENSION_NAME, CLAVISPASS_POPUP_DESCRIPTION, CLAVISPASS_POPUP_EYEBROW, CLAVISPASS_POPUP_TITLE

### Community 73 - "Datenschutzerklärung"
Cohesion: 0.09
Nodes (22): 10. Browser-Erweiterung, 11. Benachrichtigungen, 12. Kontaktaufnahme, 13. Webseite und Hosting, 14. Cookies, Tracking und Analytics, 15. App Stores und Download-Plattformen, 16. Rechtsgrundlagen, 17. Speicherdauer (+14 more)

### Community 74 - "AuthProvider"
Cohesion: 0.29
Nodes (7): Master Password Lifetime, Session Boundary, Authentication & Master Secret Handling, Design Goals, Implementation, Session Lifecycle, AuthProvider()

### Community 75 - "reactNative.ts"
Cohesion: 0.11
Nodes (14): update, Animated, AnimatedValue, Dimensions, InteractionManager, Platform, Pressable, ScrollView (+6 more)

### Community 76 - "Privacy Policy"
Cohesion: 0.09
Nodes (22): 10. Browser Extension, 11. Notifications, 12. Contact, 13. Website And Hosting, 14. Cookies, Tracking And Analytics, 15. App Stores And Download Platforms, 16. Legal Bases, 17. Retention (+14 more)

### Community 77 - "tab-context.ts"
Cohesion: 0.60
Nodes (5): getActiveDomainContext(), normalizeLookupHost(), parseActiveDomain(), sanitizeHost(), ActiveDomainContext

### Community 78 - "Nutzungsbedingungen"
Cohesion: 0.10
Nodes (20): 10. Erlaubte Nutzung, 11. Open Source und Lizenzen, 12. Kosten, 13. Drittanbieter, 14. Updates, 15. Haftung, 16. Beendigung der Nutzung, 17. Änderungen (+12 more)

### Community 79 - "ExpiryPickerModal"
Cohesion: 0.22
Nodes (7): ExpiryPickerModal(), ExpiryModule(), ExpiryStatus, formatRelative(), getRelativeInfo(), RelativeExpiryInfo, toIsoUtcFromLocal()

### Community 80 - "prepare-native-host-sidecar.js"
Cohesion: 0.14
Nodes (12): cargoArgs, { copyFileSync, existsSync, mkdirSync, writeFileSync }, detectHostTriple(), { execFileSync }, { join, resolve }, manifestPath, outputDir, outputPath (+4 more)

### Community 81 - "screenLockLogout.ts"
Cohesion: 0.40
Nodes (4): ScreenLockLogoutController, initScreenLockLogout(), ListenFn, ScreenLockPayload

### Community 82 - "NoteFullscreenEditor.web.tsx"
Cohesion: 0.33
Nodes (5): @monaco-editor/react, MONACO_LANGUAGE_BY_NOTE_LANGUAGE, NoteFullscreenEditor(), Props, styles

### Community 84 - "session.rs"
Cohesion: 0.27
Nodes (8): session_store_path(), BridgeSessionSnapshot, clear_session(), load_session(), now_ms(), publish_session(), SESSION_TTL_MS, write_json_atomically()

### Community 85 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, build:chrome, build:firefox, build:firefox-local, dev, package:chrome, package:firefox (+6 more)

### Community 86 - "CustomTitlebar"
Cohesion: 0.14
Nodes (13): MainWindowReadySignal(), Chrome And Drag Regions, Core Files, Desktop And Tauri Context, Fast Access, Runtime Model, Tauri Responsibilities, @tauri-apps/plugin-cli (+5 more)

### Community 87 - "decryptVaultContent.ts"
Cohesion: 0.06
Nodes (43): base64-js, libsodium-wrappers-sumo, react-native-sodium-jsi, VaultDataTypeSchema, DecryptVaultContentResult, DEFAULT_ENCRYPT_MODE, EncryptMode, EncryptVaultContentResult (+35 more)

### Community 88 - "CreditCardModule.tsx"
Cohesion: 0.31
Nodes (12): CreditCardModule(), CreditCardState, detectCardBrand(), digitsOnly(), formatCardNumber(), maskCardNumber(), passesLuhn(), concealActiveSecretReveal() (+4 more)

### Community 89 - "ValueIconsEnum"
Cohesion: 0.14
Nodes (13): ValueIconsEnum, BANK_ACCOUNT, BLANK, CREDIT_CARD, DIGITAL_CARD, DOCUMENT, IDENTITY, KEY (+5 more)

### Community 90 - "Terms Of Use"
Cohesion: 0.10
Nodes (20): 10. Permitted Use, 11. Open Source And Licenses, 12. Costs, 13. Third-Party Providers, 14. Updates, 15. Liability, 16. Ending Use, 17. Changes (+12 more)

### Community 91 - "protocol.rs"
Cohesion: 0.20
Nodes (7): BridgeClientInfo, BridgeError, BridgePairingEnvelope, BridgeRequest, BridgeResponse, HOST_NAME, PROTOCOL_VERSION

### Community 92 - "Tech Stack"
Cohesion: 0.40
Nodes (5): Backend / Plattform, CI / CD & Deployment, Frontend, Security, Tech Stack

### Community 93 - "check-tauri-version-sync.js"
Cohesion: 0.24
Nodes (11): collectMismatches(), fs, getMajorMinor(), getNpmLockVersion(), mismatches, parseCargoLockVersions(), path, readJson() (+3 more)

### Community 94 - "AnalysisDetailScreen.tsx"
Cohesion: 0.05
Nodes (79): expo-crypto, useAuthMaster(), FiltersNarrow, AnalysisFlags, AnalysisRef, CachedAnalysisItem, CacheResult, PasswordStrengthLevel (+71 more)

### Community 95 - "ClavisPass Product Strategy Roadmap"
Cohesion: 0.11
Nodes (17): 1. Browser Extension Polish, 2. Passkeys, 3. Emergency Access / Trusted Contact, 4. Optional Web App, 5. Separate Secrets Sharing SaaS, Bitwarden Gaps To Treat As Strategic, ClavisPass Personal, ClavisPass Product Strategy Roadmap (+9 more)

### Community 96 - "vaultDevices.ts"
Cohesion: 0.23
Nodes (10): daysBetween(), DEFAULT_DEVICE_UI_POLICY, deriveDeviceUiStatus(), DeviceUiPolicy, DeviceUiStatus, earliestIso(), hasSameDeviceIdentity(), normalizeDeviceIdentityPart() (+2 more)

### Community 97 - "bundle"
Cohesion: 0.17
Nodes (12): bundle, active, category, copyright, createUpdaterArtifacts, externalBin, fileAssociations, icon (+4 more)

### Community 98 - "pkce.web.ts"
Cohesion: 0.80
Nodes (4): base64Url(), createPkcePair(), randomBytes(), toCodeChallenge()

### Community 99 - "Identity Management Concept"
Cohesion: 0.13
Nodes (14): Confidence And Trust, Core Idea, Data Model Direction, Design Tone, Identity Detail View, Identity Management Concept, Identity Tab, Important Principle (+6 more)

### Community 100 - "ClavisPass Project Context"
Cohesion: 0.33
Nodes (5): ClavisPass Project Context, Context Files, Core Mental Model, First Runtime Files, High-Risk Areas

### Community 101 - "detectTauriEnvironment"
Cohesion: 0.16
Nodes (20): @tauri-apps/plugin-global-shortcut, DevModeProvider(), getClipboardText(), tryNavigatorReadText(), tryNavigatorWriteText(), detectBrowserWebEnvironment(), detectTauriEnvironment(), isBrowserWebEnvironment() (+12 more)

### Community 102 - "tauri.conf.json"
Cohesion: 0.18
Nodes (10): app, macOSPrivateApi, security, windows, identifier, mainBinaryName, productName, $schema (+2 more)

### Community 103 - "withAndroidApplicationId.js"
Cohesion: 0.20
Nodes (4): fs, path, { withDangerousMod }, { withXcodeProject }

### Community 104 - "build-web-demo.js"
Cohesion: 0.20
Nodes (8): demoDotenvPath, demoEnv, env, fs, path, result, rewriteDemoPublicPaths(), { spawnSync }

### Community 105 - "ContentProtectionProvider.tsx"
Cohesion: 0.32
Nodes (6): expo-screen-capture, applyNativeContentProtection(), applyTauriContentProtection(), ContentProtectionContext, ContentProtectionContextValue, ContentProtectionProvider()

### Community 106 - "plugins"
Cohesion: 0.20
Nodes (10): args, customProtocol, plugins, cli, deepLink, updater, endpoints, pubkey (+2 more)

### Community 107 - "autofill-cache.ts"
Cohesion: 0.17
Nodes (21): clearAutofillDomainCache(), countPasswordSuggestions(), DomainAutofillCache, DomainAutofillCacheEntry, getAutofillEligibilityForUrl(), getCachedAutofillMatchCountForUrl(), getCachedMatchCount(), isFresh() (+13 more)

### Community 108 - "DeviceStorageClient.ts"
Cohesion: 0.35
Nodes (12): @react-native-async-storage/async-storage, fetchFile(), getActiveLocalVaultIdKey(), getLocalSyncKey(), getLocalSyncMetadataKey(), getVaultLocalSyncKey(), getVaultLocalSyncMetadataKey(), LocalSyncMetadata (+4 more)

### Community 109 - "container/AnimatedOpacityContainer.tsx"
Cohesion: 0.31
Nodes (6): AnimatedOpacityContainer(), Props, AnimatedOpacityContainerWeb(), Props, Props, AnimatedOpacityContainer()

### Community 110 - "Cryptography & Encryption Model"
Cohesion: 0.50
Nodes (4): Cryptography & Encryption Model, Key Derivation, Platform Consistency, Vault Encryption

### Community 111 - "editHistory.ts"
Cohesion: 0.23
Nodes (12): appendLog(), areValuesEqual(), cloneValue(), createLogEntry(), EditHistoryActionType, EditHistoryMeta, EditSessionLogEntry, HistoryEntry (+4 more)

### Community 113 - "appScheme.test.ts"
Cohesion: 0.36
Nodes (6): getMobileRedirectUri(), getAppRedirectUri(), getAppScheme(), Constants, resetExpoConfig(), setExpoConfig()

### Community 114 - "reactNativeReanimated.tsx"
Cohesion: 0.25
Nodes (4): Animated, AnimatedView, Easing, FadeInDown

### Community 116 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, @types/chrome, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react

### Community 117 - "compilerOptions"
Cohesion: 0.29
Nodes (6): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, include

### Community 118 - "withIosGoogleOAuthScheme.js"
Cohesion: 0.43
Nodes (5): ensureUrlScheme(), normalizeClientId(), {
  ensureUrlScheme,
  toReverseClientIdScheme,
}, toReverseClientIdScheme(), { withInfoPlist }

### Community 119 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, moduleResolution, strict, exclude, extends

### Community 120 - "Store Release Roadmap"
Cohesion: 0.17
Nodes (11): Apple Developer Program, Arratel Setup Plan, Chrome Web Store, Goals, Google Play, Microsoft Store, Publisher Naming, References (+3 more)

### Community 121 - "PairingStatus"
Cohesion: 0.50
Nodes (4): PairingStatus, Paired, Pending, Unpaired

### Community 123 - "vcardExport.ts"
Cohesion: 0.30
Nodes (11): expo-file-system, expo-sharing, buildFormattedName(), buildVCard(), canExportVCard(), clean(), escapeVCardText(), exportVCard() (+3 more)

### Community 124 - "TotpModule.tsx"
Cohesion: 0.29
Nodes (8): otpauth, styles, Totp(), TotpModule(), TotpModuleModuleProps, codeFromUri(), parseOtpauth(), TotpAlgo

### Community 125 - "secureStore.ts"
Cohesion: 0.53
Nodes (8): CloudProvider(), isInvalidGrant(), getData(), getTauriCore(), getWebStorageKey(), removeData(), saveData(), useWebFallback()

### Community 126 - "model/types.ts"
Cohesion: 0.08
Nodes (32): @react-navigation/bottom-tabs, @react-navigation/native-stack, AddTriggerStackParamList, AnalysisStackParamList, AppTabsParamList, LoginStackParamList, LogoutStackParamList, RootStackParamList (+24 more)

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

### Community 137 - "AuthReplyBlock"
Cohesion: 0.25
Nodes (5): auth_reply(), AUTH_REPLY_DESCRIPTOR, AuthReplyBlock, AuthState, BlockDescriptor

### Community 138 - "errorBus.ts"
Cohesion: 0.42
Nodes (6): Listener, listeners, subscribeGlobalError(), unsubscribeGlobalError(), GlobalErrorPayload, GlobalErrorSnackbar()

### Community 141 - "path.rs"
Cohesion: 0.43
Nodes (5): bridge_dir(), BRIDGE_ENV_KEY, ensure_dir(), platform_base_dir(), write_request_store_path()

### Community 142 - "linux"
Cohesion: 0.67
Nodes (3): linux, depends, deb

### Community 144 - "vaultIdentity.ts"
Cohesion: 0.26
Nodes (7): getEmptyData(), createVaultId(), ensureVaultId(), normalizeVaultId(), resolveMergedVaultId(), VaultData, VaultIdentityMismatchError

### Community 172 - "browser-extension/package.json"
Cohesion: 0.18
Nodes (10): react, react-dom, @types/react, @types/react-dom, typescript, name, private, type (+2 more)

### Community 174 - "NoteModule.tsx"
Cohesion: 0.13
Nodes (17): JsonLine(), NoteCodePreview(), Props, styles, clamp(), DISPLAY_MODE_HEIGHTS, DISPLAY_MODES, NOTE_VARIANTS (+9 more)

### Community 175 - "Firefox Store Release Notes"
Cohesion: 0.25
Nodes (7): Extension Identity, Firefox Store Release Notes, Listing, Pre-Submit Check, Privacy Policy Draft, Release Artifacts, Reviewer Notes

### Community 176 - "UI Context"
Cohesion: 0.22
Nodes (8): i18n, Important Files, Interaction Polish, Menus And Dropdowns, Platform Model, Related UI Context, Titlebar And Chrome, UI Context

### Community 177 - "DigitalCardModule.tsx"
Cohesion: 0.27
Nodes (8): DigitalCardModule(), DigitalCardModuleProps, isDigitalCardType(), styles, DIGITAL_CARD_TYPES, DigitalCardModuleType, DigitalCardModuleTypeSchema, regex

### Community 178 - "ClavisPass Firefox Add-on Reviewer Build"
Cohesion: 0.33
Nodes (5): Build Steps, ClavisPass Firefox Add-on Reviewer Build, Environment, Firefox Add-on ID, Native Messaging Notes

### Community 179 - "ClavisPassHubDiscoveryResult.ts"
Cohesion: 0.29
Nodes (6): ClavisPassHubDiscoveryResult, ClavisPassHubDiscoveryStatus, DiscoveryCheckingResult, DiscoveryErrorResult, DiscoveryIdleResult, DiscoverySuccessResult

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

### Community 184 - "Vault Architecture & Trust Boundaries"
Cohesion: 0.67
Nodes (3): 1. VaultSession (Authoritative & Secret-Capable), 2. VaultProvider (UI-Safe Projection), Vault Architecture & Trust Boundaries

### Community 185 - "dependencies"
Cohesion: 0.67
Nodes (3): dependencies, react, react-dom

### Community 189 - "vitest"
Cohesion: 0.08
Nodes (26): Always Know, ClavisPass Agent Context, Context Routing, Fast Map, graphify, High-Risk Rules, vitest, VaultProvider() (+18 more)

### Community 190 - "Screen Standardization Context"
Cohesion: 0.50
Nodes (3): Common Refactor Targets, Files To Check First, Screen Standardization Context

### Community 192 - "Crypto Context"
Cohesion: 0.40
Nodes (4): Core Files, Critical Rules, Crypto Context, Verification

### Community 193 - "AppearanceSettingsSection.tsx"
Cohesion: 0.13
Nodes (18): expo-clipboard, i18next, AppearanceSettingsSection(), Props, DarkModeSwitch(), ThemePreviewCard(), I18nBridge(), initI18n() (+10 more)

### Community 194 - "BrowserBridgeWriteSync.tsx"
Cohesion: 0.16
Nodes (21): papaparse, applyUpdateToEntry(), BrowserBridgeWriteSync(), BrowserWriteKind, BrowserWriteRequest, createBrowserEntry(), CreatePayload, effectiveUrl() (+13 more)

### Community 195 - "VaultProvider.tsx"
Cohesion: 0.15
Nodes (18): VaultContext, VaultContextType, VaultData, PendingKdbxFile, Props, styles, FolderSchema, FolderType (+10 more)

### Community 196 - "GlobalClipboardSnackbar.tsx"
Cohesion: 0.38
Nodes (7): Handler, handlers, subscribeClipboardCopied(), unsubscribeClipboardCopied(), ClipboardCopyPayload, GlobalClipboardSnackbar(), msToSecCeil()

### Community 201 - "Vault Modules Context"
Cohesion: 0.40
Nodes (4): Important Boundaries, Reorder Flows, Vault Modules Context, Verification

### Community 203 - "AnimatedLogo.tsx"
Cohesion: 0.25
Nodes (4): react-native-svg, AnimatedLogo(), AnimatedRect, styles

### Community 204 - "SettingsScreen.tsx"
Cohesion: 0.06
Nodes (44): expo-constants, @gorhom/bottom-sheet, @react-native-masked-view/masked-view, simple-icons, @tauri-apps/plugin-shell, useContentProtection(), DevModeContext, DevModeContextType (+36 more)

## Knowledge Gaps
- **128 isolated node(s):** `react`, `react-dom`, `@types/chrome`, `@types/react`, `@types/react-dom` (+123 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1625 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **46 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `ModulesEnum.ts`, `package.json`, `App.tsx`, `EditScreen.tsx`, `HomeScreen.tsx`, `vaultIdentity.ts`, `ClavisPassHubClient.ts`, `DevicesScreen.tsx`, `deriveIdentityClusters.ts`, `EditRowControlsContainer.tsx`, `GoogleDriveClient.ts`, `GoogleDriveLoginButton.tsx`, `bitwarden.ts`, `CloudStorageClient.ts`, `vite.config.ts`, `ref_react`, `BrowserBridgeWriteSync.tsx`, `VaultProvider.tsx`, `store.ts`, `reactNative.ts`, `decryptVaultContent.ts`, `vaultDevices.ts`, `DeviceStorageClient.ts`, `appScheme.test.ts`, `withIosGoogleOAuthScheme.js`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **What connects `react`, `react-dom`, `@types/chrome` to the rest of the system?**
  _128 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `getModule.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.04768041237113402 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `getModule.tsx`, `ModulesEnum.ts`, `IdentityDetailScreen.tsx`, `package.json`, `RecoveryCodesModule.tsx`, `App.tsx`, `EditScreen.tsx`, `HomeScreen.tsx`, `useTheme`, `errorBus.ts`, `AttachmentPreviewScreen.native.tsx`, `useSetting`, `FastAccess.ts`, `ThemeProvider.tsx`, `CardDetailsScreen.tsx`, `DevicesScreen.tsx`, `UpdateManager.tsx`, `GlobalShortcuts.tsx`, `LoginScreen.tsx`, `EditRowControlsContainer.tsx`, `GoogleDriveLoginButton.tsx`, `NoteModule.tsx`, `DigitalCardModule.tsx`, `AddModuleModal.tsx`, `ref_react`, `AttachmentModule.tsx`, `VaultProvider.tsx`, `store.ts`, `GlobalClipboardSnackbar.tsx`, `AnimatedLogo.tsx`, `SettingsScreen.tsx`, `NoteFullscreenEditor.web.tsx`, `CreditCardModule.tsx`, `AnalysisDetailScreen.tsx`, `detectTauriEnvironment`, `ContentProtectionProvider.tsx`, `container/AnimatedOpacityContainer.tsx`, `vcardExport.ts`, `TotpModule.tsx`, `secureStore.ts`, `model/types.ts`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.01904761904761905 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `ModulesEnum.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10625 - nodes in this community are weakly interconnected._
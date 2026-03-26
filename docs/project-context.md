# ClavisPass Project Context

This file is the durable working context for future chats and contributors.
It is meant to complement the README by focusing on actual code structure, runtime behavior, and practical orientation.

## What This Project Is

ClavisPass is a cross-platform password manager built around local encryption and provider-based sync.
The same repository contains:

- The app UI for mobile, web, and desktop via React Native + Expo.
- A Tauri desktop host for Windows, macOS, and Linux.
- Native Rust commands for desktop-only capabilities such as secure key storage, content protection, and device identity.
- A small homepage deployed separately from the application itself.

## High-Level Runtime Model

### Main app shell

The main runtime entry is [App.tsx](/e:/Projects/ClavisPass/App.tsx).

Important behaviors:

- Registers the `clavispass://` deep-link protocol for desktop.
- On desktop, distinguishes between the main app window and a popup-style fast-access window.
- Wraps the app in a provider chain that centralizes settings, theming, auth, sync tokens, vault state, content protection, and UX helpers.

Provider order in the main app:

1. `SettingsProvider`
2. `ContentProtectionProvider`
3. `ThemeProvider`
4. `OnlineProvider`
5. `AuthProvider`
6. `CloudProvider`
7. `VaultProvider`
8. `DevModeProvider`

This order matters. For example, `VaultProvider` relies on auth/cloud-adjacent state, and theme/settings are expected to be available globally.

### Desktop host

The Tauri side lives in [src-tauri/src/lib.rs](/e:/Projects/ClavisPass/src-tauri/src/lib.rs).

Desktop responsibilities include:

- Creating the main window and OAuth popup windows.
- Handling system tray behavior.
- Saving and restoring window size.
- Intercepting close requests and hiding the app instead of exiting.
- Exposing Rust commands to the JS layer.
- Enabling updater, shell, dialog, fs, deep links, OAuth, shortcuts, and autostart plugins.

Notable implementation detail:

- In JS, desktop paths are usually detected with `Platform.OS === "web"` because the Tauri app renders the Expo web bundle.

## Security-Critical Architecture

### Auth and master password lifetime

[src/app/providers/AuthProvider.tsx](/e:/Projects/ClavisPass/src/app/providers/AuthProvider.tsx) is one of the most important files in the project.

Key rules enforced there:

- The master password is stored only in a `useRef`.
- React context exposes `getMaster()` and `requireMaster()`, not the secret value itself.
- The session is time-limited via the `SESSION_DURATION` setting.
- Logout clears the in-memory secret and timers.
- Screen lock integration can force logout.

Why this matters:

- The code intentionally avoids putting the master password into React state, props, or subscribable context values.
- Any future work should preserve that non-reactive handling.

### Vault session boundary

[src/app/providers/VaultProvider.tsx](/e:/Projects/ClavisPass/src/app/providers/VaultProvider.tsx) provides the React-facing vault API.
[src/features/vault/utils/VaultSession.ts](/e:/Projects/ClavisPass/src/features/vault/utils/VaultSession.ts) is the authoritative vault state holder outside React.

Practical mental model:

- `VaultSession` holds the full decrypted vault and dirty state.
- `VaultProvider` only projects UI-safe data into React state.
- Secrets are accessed on demand through `getSecretValue` / `getSecretPayload`.
- Writes go through explicit helpers such as `upsertEntry`, `deleteEntry`, `update`, and `setFolders`.

This is an intentional trust boundary. Avoid bypassing it.

### Module policy registry

[src/features/vault/utils/modulePolicy.ts](/e:/Projects/ClavisPass/src/features/vault/utils/modulePolicy.ts) is the central registry that decides:

- Which modules are metadata-only.
- Which modules are secrets.
- Which modules need structured or hybrid handling.
- How entry metadata is derived for list/search/filter UI.

When adding or changing a vault module:

1. Update the module enum / type definitions.
2. Update rendering components and form/edit behavior.
3. Update `MODULE_POLICY`.
4. Check search/filter/list behaviors that depend on derived metadata.

If `MODULE_POLICY` is missed, you can create silent security or UX regressions.

## Crypto State Of The Repo

The repo contains two encryption paths.

### Legacy path

The default encryption mode in [src/infrastructure/crypto/encryptVaultContent.ts](/e:/Projects/ClavisPass/src/infrastructure/crypto/encryptVaultContent.ts) is still `"legacy"`.

That means current app behavior is not yet exclusively driven by the newer V1 vault format.

### V1 path

The intended newer format lives in:

- [src/infrastructure/crypto/vault/v1/VaultV1.ts](/e:/Projects/ClavisPass/src/infrastructure/crypto/vault/v1/VaultV1.ts)
- [src/infrastructure/crypto/vault/v1/VaultV1Schema.ts](/e:/Projects/ClavisPass/src/infrastructure/crypto/vault/v1/VaultV1Schema.ts)

The V1 design uses:

- Argon2id-style password hashing parameters
- XChaCha20-Poly1305 AEAD
- Structured vault envelope metadata

Important nuance from actual code:

- Decryption only accepts V1 if callers opt in with `allowV1: true` in [src/infrastructure/crypto/decryptVaultContent.ts](/e:/Projects/ClavisPass/src/infrastructure/crypto/decryptVaultContent.ts).
- So the README describes the architectural direction well, but not every path is fully switched over at runtime yet.

Future crypto work should start by verifying which format is currently written and which readers are enabled in the user flows being changed.

## Sync And Storage Model

### Cloud/session tokens

[src/app/providers/CloudProvider.tsx](/e:/Projects/ClavisPass/src/app/providers/CloudProvider.tsx) is the access-token / refresh-token coordinator.

Responsibilities:

- Persisting refresh-token state.
- Restoring provider session information on startup.
- Refreshing access tokens when needed.
- Clearing provider state on logout.
- Special cleanup behavior for `clavispassHub`.

### Provider dispatch

[src/infrastructure/cloud/clients/CloudStorageClient.ts](/e:/Projects/ClavisPass/src/infrastructure/cloud/clients/CloudStorageClient.ts) is the dispatch layer that routes to:

- Dropbox
- Google Drive
- Device storage
- ClavisPass Hub

If sync behavior changes, check both:

- The dispatcher
- The concrete provider client

### Local settings and secure secrets

There are two distinct local storage layers:

- [src/infrastructure/storage/store.ts](/e:/Projects/ClavisPass/src/infrastructure/storage/store.ts) for regular typed app settings in AsyncStorage.
- [src/infrastructure/storage/secureStore.ts](/e:/Projects/ClavisPass/src/infrastructure/storage/secureStore.ts) for secure tokens/secrets.

Current secure storage behavior:

- Mobile uses Expo Secure Store.
- Desktop uses Tauri invoke commands backed by Rust keytar helpers in [src-tauri/src/commands.rs](/e:/Projects/ClavisPass/src-tauri/src/commands.rs).

## Settings That Influence Behavior

The typed schema in [src/infrastructure/storage/store.ts](/e:/Projects/ClavisPass/src/infrastructure/storage/store.ts) is the source of truth for persisted app settings.

Examples with architectural importance:

- `SESSION_DURATION`
- `COPY_DURATION`
- `THEME_PREFERENCE`
- `LANGUAGE`
- `FAST_ACCESS`
- `CLOSE_BEHAVIOR`
- `START_BEHAVIOR`
- `FAVORITE_MODULES`

If a new setting is needed, it should usually be added to `storeSchema` first, not introduced ad hoc.

## UI Structure And Feature Layout

### Top-level code organization

- `src/app`: app shell, navigation, providers.
- `src/screens`: screen containers bound to navigation routes.
- `src/features`: domain features such as auth, vault, analysis, settings, sync, onboarding, fast access.
- `src/shared`: reusable components, i18n, hooks, theme utilities.
- `src/infrastructure`: low-level integrations and platform abstractions.

### Notable feature areas

- `features/vault`: core credential/item editing, rendering, folders, modules, generators, QR helpers.
- `features/analysis`: password strength and risk analysis.
- `features/sync`: provider login buttons, backup/sync UI, user information.
- `features/auth`: login/auth flow and screen-lock logout support.
- `features/settings`: app settings UI and import/export helpers.
- `features/fastaccess`: popup-oriented quick access behavior for desktop.

### Example screen behavior

[src/screens/HomeScreen.tsx](/e:/Projects/ClavisPass/src/screens/HomeScreen.tsx) is a good practical reference for how the app usually works:

- Reads safe vault projections from `useVault()`.
- Uses `auth.getMaster()` only when a real decrypt/sync operation is needed.
- Refreshes remote data through `CloudProvider` token handling plus cloud fetch + decrypt.
- Separates special list modes for cards and TOTP from generic item browsing.

## Platform Notes

### Desktop

- Implemented via Tauri with a web bundle.
- System tray integration is enabled.
- Main-window close is intercepted and converted to hide-to-tray behavior in Rust.
- Content protection is controllable via Tauri command.
- Fast-access uses a separate popup-like window mode.

### Mobile

- Standard Expo / React Native runtime.
- Secure storage uses Expo Secure Store.
- Expo Updates handles OTA-style update checks.

### Update handling

[src/shared/components/UpdateManager.tsx](/e:/Projects/ClavisPass/src/shared/components/UpdateManager.tsx) splits update logic by platform:

- Expo Updates on mobile.
- Tauri updater on desktop.

Because desktop is represented as `Platform.OS === "web"`, be careful when reading update code or other platform-conditional UI.

## Build And Release Surface

Important scripts from [package.json](/e:/Projects/ClavisPass/package.json):

- `npm run web`
- `npm run tauri:dev`
- `npm run tauri:build`
- `npm run android`
- `npm run ios`
- `npm run release`

Other relevant files:

- [release.js](/e:/Projects/ClavisPass/release.js)
- [app.config.js](/e:/Projects/ClavisPass/app.config.js)
- [app.json](/e:/Projects/ClavisPass/app.json)
- [eas.json](/e:/Projects/ClavisPass/eas.json)
- [src-tauri/tauri.conf.json](/e:/Projects/ClavisPass/src-tauri/tauri.conf.json)

## Working Conventions For Future Sessions

When opening a new chat, this is the quickest reliable path:

1. Read [AGENTS.md](/e:/Projects/ClavisPass/AGENTS.md).
2. Read this file.
3. Verify the exact runtime files involved before trusting the README alone.
4. For security-sensitive work, inspect the live code path end-to-end before editing.

Recommended guardrails:

- Do not put secrets into React state.
- Do not bypass `VaultSession` / `VaultProvider` boundaries casually.
- Do not add a new module without updating `MODULE_POLICY`.
- Do not assume desktop is a separate JS codebase; it is usually the Expo web bundle running inside Tauri.
- Do not assume the V1 crypto path is fully active everywhere without checking the call sites.
- Do not add new user-facing copy in only one place; update TranslationSchema.ts plus both de.ts and en.ts together so the typed i18n contract stays in sync.

## Good First Files For Orientation

- [README.md](/e:/Projects/ClavisPass/README.md)
- [App.tsx](/e:/Projects/ClavisPass/App.tsx)
- [src/app/providers/AuthProvider.tsx](/e:/Projects/ClavisPass/src/app/providers/AuthProvider.tsx)
- [src/app/providers/VaultProvider.tsx](/e:/Projects/ClavisPass/src/app/providers/VaultProvider.tsx)
- [src/features/vault/utils/VaultSession.ts](/e:/Projects/ClavisPass/src/features/vault/utils/VaultSession.ts)
- [src/features/vault/utils/modulePolicy.ts](/e:/Projects/ClavisPass/src/features/vault/utils/modulePolicy.ts)
- [src/app/providers/CloudProvider.tsx](/e:/Projects/ClavisPass/src/app/providers/CloudProvider.tsx)
- [src/infrastructure/storage/store.ts](/e:/Projects/ClavisPass/src/infrastructure/storage/store.ts)
- [src/infrastructure/storage/secureStore.ts](/e:/Projects/ClavisPass/src/infrastructure/storage/secureStore.ts)
- [src-tauri/src/lib.rs](/e:/Projects/ClavisPass/src-tauri/src/lib.rs)


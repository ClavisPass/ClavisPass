# ClavisPass Agent Context

ClavisPass is a privacy-focused password manager with a React Native + Expo UI and a Tauri desktop shell.

Keep this file small. Do not read large docs by default. Pick only the context file that matches the task.

## Always Know

- Vault data is encrypted locally before sync.
- Sync providers are `device`, `dropbox`, `googleDrive`, and `clavispassHub`.
- Desktop runs the Expo web bundle inside Tauri, so desktop-only JS often appears behind `Platform.OS === "web"`.
- User-facing text belongs in the typed i18n contract: `src/shared/i18n/TranslationSchema.ts`, plus both `src/shared/i18n/languages/de.ts` and `src/shared/i18n/languages/en.ts`.

## Context Routing

- Security, auth, vault state, module metadata/secrets: read [docs/context/security.md](/e:/Projects/ClavisPass/docs/context/security.md).
- Vault crypto formats, V1/V2 envelope behavior, KDF/AEAD rules: read [docs/context/crypto.md](/e:/Projects/ClavisPass/docs/context/crypto.md).
- UI work, React Native/Web/Tauri layout, menus, dropdowns, titlebar drag regions, i18n: read [docs/context/ui.md](/e:/Projects/ClavisPass/docs/context/ui.md).
- Sync, cloud providers, tokens, storage settings, secure store: read [docs/context/sync-storage.md](/e:/Projects/ClavisPass/docs/context/sync-storage.md).
- Tauri host, tray, desktop windows, fast access popup, native commands: read [docs/context/desktop.md](/e:/Projects/ClavisPass/docs/context/desktop.md).
- Build, release, updates, store/package surface: read [docs/context/build-release.md](/e:/Projects/ClavisPass/docs/context/build-release.md).

## High-Risk Rules

- Do not put secrets, especially the master password, into React state.
- Do not bypass `VaultSession` / `VaultProvider` boundaries casually.
- Do not add or change a vault module without checking `src/features/vault/utils/modulePolicy.ts`.
- Do not change crypto, KDF, AEAD, envelope, or provider parity without reading the live code path end to end.
- When changing app chrome, titlebars, compact headers, search placement, or window controls, verify draggable regions in `src/shared/components/CustomTitlebar.tsx`.

## Fast Map

- `src/app`: app shell, providers, navigation.
- `src/screens`: screen-level containers.
- `src/features`: feature-specific UI, models, utilities.
- `src/infrastructure`: storage, crypto, cloud clients, logging, platform helpers.
- `src/shared`: reusable UI, hooks, i18n, theme.
- `src-tauri`: Rust/Tauri host and native desktop commands.

# ClavisPass Agent Context

This repository is a cross-platform password manager with a React Native + Expo UI and a Tauri desktop shell.
Use this file as the fast-start context for future work, then open [docs/project-context.md](/e:/Projects/ClavisPass/docs/project-context.md) for deeper details.

## Product Summary

- ClavisPass is a privacy-focused password manager.
- Vault data is encrypted locally before sync.
- Sync targets are provider-based: `device`, `dropbox`, `googleDrive`, and `clavispassHub`.
- Desktop runs through Tauri; mobile runs through Expo / React Native.

## Core Architecture

- [App.tsx](/e:/Projects/ClavisPass/App.tsx) wires the provider stack and switches between the main app window and the desktop fast-access popup.
- [src/app/providers/AuthProvider.tsx](/e:/Projects/ClavisPass/src/app/providers/AuthProvider.tsx) keeps the master password in a `useRef`, not in React state.
- [src/app/providers/VaultProvider.tsx](/e:/Projects/ClavisPass/src/app/providers/VaultProvider.tsx) exposes UI-safe metadata and fetches secrets only on demand.
- [src/features/vault/utils/VaultSession.ts](/e:/Projects/ClavisPass/src/features/vault/utils/VaultSession.ts) is the authoritative in-memory vault session outside React.
- [src/features/vault/utils/modulePolicy.ts](/e:/Projects/ClavisPass/src/features/vault/utils/modulePolicy.ts) is the central module classification and secret/meta policy registry.
- [src/app/providers/CloudProvider.tsx](/e:/Projects/ClavisPass/src/app/providers/CloudProvider.tsx) stores refresh tokens securely and refreshes access tokens per provider.
- [src/infrastructure/storage/store.ts](/e:/Projects/ClavisPass/src/infrastructure/storage/store.ts) defines the typed settings schema.
- [src/infrastructure/storage/secureStore.ts](/e:/Projects/ClavisPass/src/infrastructure/storage/secureStore.ts) uses Expo Secure Store on mobile and Tauri keytar commands on desktop.

## Important Reality Check

- The README describes the intended modern vault format (`argon2id` + `xchacha20poly1305`), and that code exists under `src/infrastructure/crypto/vault/v1`.
- Current application code still defaults to `"legacy"` encryption in [src/infrastructure/crypto/encryptVaultContent.ts](/e:/Projects/ClavisPass/src/infrastructure/crypto/encryptVaultContent.ts).
- Decryption only accepts V1 when callers explicitly pass `allowV1: true` in [src/infrastructure/crypto/decryptVaultContent.ts](/e:/Projects/ClavisPass/src/infrastructure/crypto/decryptVaultContent.ts).
- Treat README security statements as directionally important, but verify runtime behavior in code before changing crypto or migration logic.

## Folder Guide

- `src/app`: app shell, providers, navigation.
- `src/screens`: screen-level containers.
- `src/features`: feature-specific UI, models, and utilities.
- `src/infrastructure`: storage, crypto, cloud clients, logging, platform helpers.
- `src/shared`: reusable UI, hooks, i18n, shared utilities.
- `src-tauri`: Rust/Tauri desktop host, key storage commands, tray, window handling, device identity.
- `homepage`: marketing / GitHub Pages site.
- `plugins`: Expo config plugins for platform identifiers.
- `patches`: local package patches, currently including `react-native-sodium-jsi`.

## Working Rules For Future Changes

- Be careful with anything that touches `AuthProvider`, `VaultProvider`, `VaultSession`, `modulePolicy`, or crypto code; those are security-sensitive.
- Prefer derived metadata in React state and on-demand secret access.
- When adding a vault module, update both the model/rendering side and the central `MODULE_POLICY`.
- When changing sync behavior, inspect all provider implementations in `src/infrastructure/cloud/clients`.
- Desktop-only behavior often hides behind `Platform.OS === "web"` because Expo web is used inside Tauri.

## Suggested First Files To Read

1. [README.md](/e:/Projects/ClavisPass/README.md)
2. [docs/project-context.md](/e:/Projects/ClavisPass/docs/project-context.md)
3. [App.tsx](/e:/Projects/ClavisPass/App.tsx)
4. [src/app/providers/AuthProvider.tsx](/e:/Projects/ClavisPass/src/app/providers/AuthProvider.tsx)
5. [src/app/providers/VaultProvider.tsx](/e:/Projects/ClavisPass/src/app/providers/VaultProvider.tsx)
6. [src/features/vault/utils/VaultSession.ts](/e:/Projects/ClavisPass/src/features/vault/utils/VaultSession.ts)
7. [src/features/vault/utils/modulePolicy.ts](/e:/Projects/ClavisPass/src/features/vault/utils/modulePolicy.ts)

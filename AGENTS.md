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

- The active vault format is now the V1 envelope under [src/infrastructure/crypto/vault/v1](/e:/Projects/ClavisPass/src/infrastructure/crypto/vault/v1).
- Vault encryption uses `argon2id` for key derivation and `xchacha20poly1305-ietf` for AEAD in [src/infrastructure/crypto/vault/v1/VaultV1.ts](/e:/Projects/ClavisPass/src/infrastructure/crypto/vault/v1/VaultV1.ts).
- [src/infrastructure/crypto/encryptVaultContent.ts](/e:/Projects/ClavisPass/src/infrastructure/crypto/encryptVaultContent.ts) now writes V1 only.
- [src/infrastructure/crypto/decryptVaultContent.ts](/e:/Projects/ClavisPass/src/infrastructure/crypto/decryptVaultContent.ts) now accepts V1 only.
- The old vault legacy crypto path has been removed; remaining non-V1 crypto usage such as pCloud import is separate from the ClavisPass vault format.
- Crypto changes are still security-sensitive, so verify provider parity and real runtime call paths before changing KDF, AEAD, or envelope behavior.

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
- When adding or changing user-facing text, update the typed i18n contract in src/shared/i18n/TranslationSchema.ts and add matching entries in both src/shared/i18n/languages/de.ts and src/shared/i18n/languages/en.ts.
- Prefer real translation keys over local hardcoded fallbacks; use defaultValue only as a temporary bridge when needed during a change.

## Suggested First Files To Read

1. [README.md](/e:/Projects/ClavisPass/README.md)
2. [docs/project-context.md](/e:/Projects/ClavisPass/docs/project-context.md)
3. [App.tsx](/e:/Projects/ClavisPass/App.tsx)
4. [src/app/providers/AuthProvider.tsx](/e:/Projects/ClavisPass/src/app/providers/AuthProvider.tsx)
5. [src/app/providers/VaultProvider.tsx](/e:/Projects/ClavisPass/src/app/providers/VaultProvider.tsx)
6. [src/features/vault/utils/VaultSession.ts](/e:/Projects/ClavisPass/src/features/vault/utils/VaultSession.ts)
7. [src/features/vault/utils/modulePolicy.ts](/e:/Projects/ClavisPass/src/features/vault/utils/modulePolicy.ts)


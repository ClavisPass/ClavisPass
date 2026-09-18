# ClavisPass Project Context

This file is a compact index for future sessions and contributors. It intentionally does not duplicate the full project model.

Start with `AGENTS.md`, then read only the context file that matches the task.

## Context Files

- `docs/context/security.md`: auth, vault state, session boundaries, module metadata, secret handling.
- `docs/context/crypto.md`: V1/V2 vault formats, key envelope behavior, crypto provider rules.
- `docs/context/ui.md`: screens, shared components, menus, dropdowns, titlebar/chrome, i18n.
- `docs/context/sync-storage.md`: sync providers, cloud tokens, settings, storage layers.
- `docs/context/desktop.md`: Tauri host, windows, tray, native commands, fast access.
- `docs/context/build-release.md`: scripts, updates, release packaging, distribution flags.

## Core Mental Model

ClavisPass is a privacy-focused password manager with local encryption before sync.

- UI: React Native + Expo.
- Desktop: Tauri rendering the Expo web bundle.
- Sync providers: `device`, `dropbox`, `googleDrive`, `clavispassHub`.
- Security-sensitive state lives behind `AuthProvider`, `VaultProvider`, `VaultSession`, and the central module policy registry.
- User-facing copy must stay in the typed i18n contract.

## High-Risk Areas

Before editing these areas, read the matching context file and inspect the live runtime path:

- Master password lifetime and vault session state.
- Vault crypto, KDF, AEAD, envelope, migration, or provider parity.
- Module policy / metadata derivation for vault entries.
- Sync provider behavior and refresh-token storage.
- Tauri window, tray, titlebar, close/minimize, and fast-access behavior.
- Shared UI primitives used across mobile, web, and desktop.

## First Runtime Files

Open only the files relevant to the task, but these are the usual anchors:

- `App.tsx`
- `src/app/providers/AuthProvider.tsx`
- `src/app/providers/VaultProvider.tsx`
- `src/features/vault/utils/VaultSession.ts`
- `src/features/vault/utils/modulePolicy.ts`
- `src/app/providers/CloudProvider.tsx`
- `src/infrastructure/storage/store.ts`
- `src/infrastructure/storage/secureStore.ts`
- `src-tauri/src/lib.rs`

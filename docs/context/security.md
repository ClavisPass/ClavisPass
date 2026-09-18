# Security And Vault Context

Use this when touching auth, vault state, entry metadata, module policies, secrets, import/export semantics, or list/search data derived from vault entries.

## Core Files

- `src/app/providers/AuthProvider.tsx`
- `src/app/providers/VaultProvider.tsx`
- `src/features/vault/utils/VaultSession.ts`
- `src/features/vault/utils/modulePolicy.ts`
- `src/features/vault/model/ModulesEnum.ts`
- `src/features/vault/model/ModulesType.ts`
- `src/features/vault/model/modules/*`

## Master Password Lifetime

- `AuthProvider` keeps the master password in a `useRef`, not React state.
- Context exposes `getMaster()` and `requireMaster()`, not the secret itself.
- Session duration is controlled by settings.
- Logout/session expiry must clear in-memory secret material.

Do not move secrets into state, props, persistent stores, logs, analytics, or derived UI projections.

## Vault Session Boundary

- `VaultSession` is the authoritative decrypted vault holder outside React.
- `VaultProvider` projects UI-safe metadata into React state.
- Secrets should be fetched on demand through provider/session helpers.
- Writes should go through explicit helpers such as `upsertEntry`, `deleteEntry`, `update`, and `setFolders`.

Avoid bypassing this boundary unless you have read the exact runtime path.

## Module Policy

`modulePolicy.ts` classifies modules and controls metadata derivation for list/search/filter UI.

When adding or changing a module:

1. Update enum/type definitions.
2. Update rendering/edit components.
3. Update `MODULE_POLICY`.
4. Check list/search/filter metadata behavior.
5. Check import/export mappings if the module can cross formats.

Missing `MODULE_POLICY` updates can cause silent security or UX regressions.

## UI-Safe Metadata

Be careful when adding fields to list items, search indexes, filters, history views, browser bridge payloads, or sync metadata. If a field can contain a secret, keep it out of derived UI state unless the existing policy explicitly permits it.

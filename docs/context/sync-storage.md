# Sync And Storage Context

Use this for sync providers, cloud sessions, refresh tokens, settings, local storage, secure storage, and backup/import/export plumbing.

## Core Files

- `src/app/providers/CloudProvider.tsx`
- `src/infrastructure/cloud/clients/CloudStorageClient.ts`
- `src/infrastructure/cloud/clients/DropboxClient.ts`
- `src/infrastructure/cloud/clients/GoogleDriveClient.ts`
- `src/infrastructure/cloud/clients/DeviceStorageClient.ts`
- `src/infrastructure/cloud/clients/ClavisPassHubClient.ts`
- `src/infrastructure/storage/store.ts`
- `src/infrastructure/storage/secureStore.ts`
- `src/features/sync/*`
- `src/features/settings/model/documentPicker/*`

## Providers

Sync targets are provider-based:

- `device`
- `dropbox`
- `googleDrive`
- `clavispassHub`

When sync behavior changes, inspect both the dispatcher and each affected concrete provider client.

## Tokens

`CloudProvider` coordinates provider session state:

- Persists refresh-token state.
- Restores provider sessions on startup.
- Refreshes access tokens.
- Clears provider state on logout.
- Handles provider-specific cleanup such as `clavispassHub`.

Refresh tokens must use secure storage.

## Storage Layers

- `store.ts`: typed app settings in AsyncStorage.
- `secureStore.ts`: secure tokens/secrets.

Mobile secure storage uses Expo Secure Store.
Desktop secure storage uses Tauri commands backed by native key storage.

## Settings Schema

Add new persisted settings to `storeSchema` first. Avoid ad hoc storage keys.

Settings with broad behavioral impact include `SESSION_DURATION`, `COPY_DURATION`, `THEME_PREFERENCE`, `LANGUAGE`, `FAST_ACCESS`, `CLOSE_BEHAVIOR`, `START_BEHAVIOR`, and filter settings.

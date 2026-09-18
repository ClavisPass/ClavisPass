# Build, Release, And Update Context

Use this for build scripts, package metadata, updates, releases, EAS, Tauri bundles, MSIX, or store submission work.

## Core Files

- `package.json`
- `app.config.js`
- `app.json`
- `eas.json`
- `release.js`
- `src-tauri/tauri.conf.json`
- `src/shared/components/UpdateManager.tsx`
- `src/shared/utils/desktopUpdater.ts`
- `src/shared/utils/mobileUpdater.ts`
- `src/shared/utils/distribution.ts`

## Common Scripts

- `npm run web`
- `npm run web:build-tauri`
- `npm run tauri:dev`
- `npm run tauri:build`
- `npm run android`
- `npm run ios`
- `npm run test`
- `npm run typecheck`

## Update Handling

Update logic is split by platform:

- Mobile uses Expo Updates.
- Desktop uses the Tauri updater.

Because desktop is the web bundle inside Tauri, update code often combines `Platform.OS === "web"` with Tauri detection.

## Release Notes

Check distribution flags before changing update or release behavior. Store builds, demo builds, and desktop builds can have different expected capabilities.

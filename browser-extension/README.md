# ClavisPass Browser Extension

Browser extension for ClavisPass, built with Manifest V3, React, TypeScript and Vite.

The extension now lives inside the main ClavisPass repository under [`browser-extension/`](./).
That makes it easier to evolve the browser UI, the native messaging client and the desktop bridge together.

## Architecture

The codebase is organized under `src/`:

- `src/popup/`
  React-based popup UI
- `src/background/`
  Manifest V3 service worker, desktop bridge orchestration and prompt state
- `src/content/`
  Content script for form detection, controlled fill and save/update capture
- `src/native/`
  Native messaging client and protocol helpers
- `src/shared/`
  Shared types, message contracts and utilities

## Desktop bridge

The extension talks to the ClavisPass desktop app through the native messaging host:

- `com.clavispass.native_host`

Current desktop commands used by the extension:

- `getStatus`
- `searchEntriesByDomain`
- `getFillDataForEntry`
- `createEntryFromBrowser`
- `updateEntryFromBrowser`

Pairing and host registration are handled in the main repo on the desktop side. The canonical bridge documentation lives here:

- [`../docs/browser-extension/native-messaging.md`](../docs/browser-extension/native-messaging.md)

## Current feature set

- desktop bridge status in the popup
- pairing-aware native messaging connection
- domain-based entry suggestions
- controlled fill-data preparation
- form-submit detection for save/update prompt V1
- browser-initiated create/update requests back into the desktop app

## Development

Install dependencies inside the extension:

```bash
npm install
```

Start Vite dev server:

```bash
npm run dev
```

Run type checking:

```bash
npm run typecheck
```

Create a production build:

```bash
npm run build
```

Package a Firefox test zip:

```bash
npm run package:firefox
```

Build and package Firefox in one step:

```bash
npm run build:firefox
```

The Firefox archive is written to `artifacts/clavispass-firefox-test.zip`.

## Working from the repo root

The main repo now exposes convenience scripts:

- `npm run extension:dev`
- `npm run extension:build`
- `npm run extension:typecheck`
- `npm run extension:package:firefox`

These delegate into `browser-extension/` so you do not need to `cd` for common tasks.

## Browser loading notes

Firefox:

1. open `about:debugging`
2. go to `This Firefox`
3. choose `Load Temporary Add-on`
4. select `browser-extension/dist/manifest.json`

Chromium / Edge:

1. run `npm run build`
2. open the browser extension developer page
3. choose `Load unpacked`
4. select `browser-extension/dist/`

## Important note

The extension and desktop host are now in the same repo, but they still remain separate projects on purpose:

- separate `package.json`
- separate `node_modules`
- separate build outputs

That keeps the extension isolated while still making end-to-end development much easier.

# ClavisPass Native Messaging Bridge

This repository contains the first desktop bridge for browser extensions via Native Messaging.

## Chosen architecture

- The Tauri desktop app remains responsible for UI, auth, and vault lifecycle.
- A separate Rust binary acts as the Native Messaging host:
  - `src-tauri/src/bin/clavispass_native_host.rs`
- Shared bridge logic lives in reusable Rust modules:
  - `src-tauri/src/bridge/*`
- The desktop UI publishes an unlocked vault snapshot into a local bridge session file while the app is unlocked.

This keeps browser IPC out of the Tauri UI layer and is safer and easier to extend than exposing an open localhost API.

## Why this is better than localhost

- Browsers talk only to a registered native host.
- Browser-specific manifest files restrict which extensions may connect.
- There is no always-on local HTTP server.
- Pairing state is explicit and modeled separately from transport.

## Current V1 behavior

Implemented Native Messaging commands:

- `getStatus`
- `searchEntriesByDomain`
- `getFillDataForEntry`
- `createEntryFromBrowser`
- `updateEntryFromBrowser`

Pairing states:

- `unpaired`
- `pending`
- `paired`

Current flow:

1. The browser extension sends a request with its `client.extensionId` and optional `client.instanceId`.
2. If the browser is unknown, the host stores a `pending` pairing request.
3. The desktop app shows these requests in `Settings > Browser Extensions`.
4. The user can explicitly:
   - approve the browser
   - reject the browser
   - remove an already paired browser
5. Only `paired` extensions can call `searchEntriesByDomain`, `getFillDataForEntry`, `createEntryFromBrowser`, or `updateEntryFromBrowser`.

## Pairing persistence

The bridge store lives in a shared local directory:

- Windows default: `%LOCALAPPDATA%\ClavisPass\bridge`
- Override for dev/test: `CLAVISPASS_BRIDGE_DIR`

Stored files:

- `pairings.json`
- `session.json`
- `browser-write-requests.json`
- `browser-write-results.json`

`pairings.json` stores three peer buckets:

- `pending`
- `paired`
- `rejected`

`rejected` is persistent, so a browser that was explicitly rejected does not immediately reappear as pending on the next request.

## Session publishing

The React/Tauri app syncs an unlocked desktop vault snapshot into the bridge store through:

- `bridge_publish_session`
- `bridge_clear_session`

The sync components live here:

- `src/features/browserBridge/components/BrowserBridgeSessionSync.tsx`
- `src/features/browserBridge/components/BrowserBridgeWriteSync.tsx`

## Browser write flow

Save and update requests from the browser are intentionally not written directly by the native host into the vault snapshot.

V1 flow:

1. A paired extension calls `createEntryFromBrowser` or `updateEntryFromBrowser`.
2. The native host validates the payload and checks that the desktop app is currently ready.
3. The request is written into `browser-write-requests.json`.
4. The unlocked desktop app claims pending requests through Tauri commands:
   - `bridge_claim_pending_writes`
   - `bridge_complete_write_request`
5. `BrowserBridgeWriteSync` applies the mutation against the real unlocked vault state in React.
6. The app writes a success or error result into `browser-write-results.json`.
7. The native host waits for that result and returns it to the extension.

This keeps writes inside the same app-side vault mutation path that the UI already uses and avoids letting the native host mutate the browser session snapshot on its own.

## Native Messaging protocol

Request shape:

```json
{
  "id": "req-1",
  "version": 1,
  "command": "getStatus",
  "payload": {},
  "client": {
    "extensionId": "abcdefghijklmnopabcdefghijklmnop",
    "name": "ClavisPass Extension",
    "version": "0.1.0",
    "instanceId": "local-dev-browser-profile"
  },
  "pairing": {
    "clientId": "local-dev-browser-profile"
  }
}
```

Response shape:

```json
{
  "id": "req-1",
  "ok": true,
  "result": {},
  "error": null
}
```

## Manifest templates

Chromium-family template:

- `docs/browser-extension/native-messaging/com.clavispass.native_host.example.json`

Firefox template:

- `docs/browser-extension/native-messaging/com.clavispass.native_host.firefox.example.json`

Firefox uses:

- `allowed_extensions`
- required add-on ID: `clavispass-extension@clavispass.local`

Chromium-family browsers use:

- `allowed_origins`
- origin format: `chrome-extension://<extension-id>/`

This includes:

- Microsoft Edge
- Google Chrome
- Chromium
- other Chromium-based browsers that honor the same native messaging manifest format

## Chromium and Edge registration

The Chromium-family host manifest should contain at least:

```json
{
  "name": "com.clavispass.native_host",
  "description": "ClavisPass Native Messaging Host",
  "path": "E:\\Projects\\ClavisPass\\src-tauri\\target\\debug\\clavispass_native_host.exe",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://<edge-extension-id>/",
    "chrome-extension://<chrome-or-chromium-extension-id>/"
  ]
}
```

The same Chromium-family manifest can be reused for Edge, Chrome, and Chromium as long as every allowed extension origin is explicitly listed in `allowed_origins`.

### Windows registry keys

Chromium-family:

- `HKCU\Software\Google\Chrome\NativeMessagingHosts\com.clavispass.native_host`
- `HKCU\Software\Chromium\NativeMessagingHosts\com.clavispass.native_host`
- `HKCU\Software\Microsoft\Edge\NativeMessagingHosts\com.clavispass.native_host`

Firefox:

- `HKCU\Software\Mozilla\NativeMessagingHosts\com.clavispass.native_host`

The Chromium-family keys should all point to the Chromium manifest file:

- `%LOCALAPPDATA%\ClavisPass\bridge\native-hosts\com.clavispass.native_host.chromium.json`

Firefox should point to the Firefox manifest file:

- `%LOCALAPPDATA%\ClavisPass\bridge\native-hosts\com.clavispass.native_host.firefox.json`

## Windows setup script

This repo includes a setup script:

- `scripts/setup-native-host.ps1`

It can:

- generate the Chromium-family manifest
- generate the Firefox manifest
- register Chrome, Chromium, and Edge keys
- register the Firefox key

### Example usage

Build the host first:

```powershell
cd src-tauri
cargo build --bin clavispass_native_host
```

Then run the setup script from the repo root.

Firefox plus one Chromium-family extension ID:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-native-host.ps1 -ChromiumExtensionId "YOUR_EXTENSION_ID"
```

Separate Edge and Chrome IDs:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-native-host.ps1 `
  -EdgeExtensionId "YOUR_EDGE_EXTENSION_ID" `
  -ChromeExtensionId "YOUR_CHROME_EXTENSION_ID"
```

Multiple Chromium-family IDs:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-native-host.ps1 `
  -ChromiumExtensionIds @(
    "YOUR_EDGE_EXTENSION_ID",
    "YOUR_CHROME_EXTENSION_ID",
    "YOUR_CHROMIUM_EXTENSION_ID"
  )
```

Direct extra origins if needed:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-native-host.ps1 `
  -AdditionalChromiumOrigins @(
    "chrome-extension://abcdefghijklmnopabcdefghijklmnop/"
  )
```

Notes:

- Firefox registration is enabled by default.
- Firefox extension ID defaults to:
  - `clavispass-extension@clavispass.local`
- Chromium-family registration is skipped automatically if no valid Chromium-family origin is provided.
- You can skip one side explicitly with:
  - `-SkipChromium`
  - `-SkipFirefox`

### What the script writes

Default manifest output directory:

- `%LOCALAPPDATA%\ClavisPass\bridge\native-hosts`

Written files:

- `%LOCALAPPDATA%\ClavisPass\bridge\native-hosts\com.clavispass.native_host.chromium.json`
- `%LOCALAPPDATA%\ClavisPass\bridge\native-hosts\com.clavispass.native_host.firefox.json`

## Managing allowed_origins

For Chromium-family browsers, the browser does not use a Firefox-style add-on ID. It uses the extension origin:

- `chrome-extension://<extension-id>/`

That means:

- Edge and Chrome can have different extension IDs for the same codebase
- local dev and store builds can also have different IDs
- every ID that should be able to connect must appear in `allowed_origins`

Recommended strategy:

### Local development

Prefer a stable development extension ID if possible.

Best options:

1. give the extension a fixed key/ID in the Chromium-family build so reloads keep the same ID
2. if that is not available, rerun `setup-native-host.ps1` after loading the extension and copy the currently assigned extension ID into `-EdgeExtensionId` or `-ChromiumExtensionIds`

### Store or packaged builds

Once the final store/package ID is known, add that stable ID to the setup command and installer packaging.

If you want dev and production to coexist, include both IDs in `allowed_origins`.

## Edge verification

1. Build the host:
   - `cargo build --bin clavispass_native_host`
2. Run the setup script with the Edge extension ID.
3. Restart Edge completely.
4. Open the loaded Edge extension.
5. Trigger the code path that calls `chrome.runtime.connectNative("com.clavispass.native_host")`.

Expected results:

- if registration is missing: `No such native application com.clavispass.native_host`
- if `allowed_origins` is wrong: native host connection fails or the request is rejected before a valid status returns
- if setup is correct: `getStatus` returns from the desktop host
- for a new client, `pairingStatus` will likely be `pending` until approved in ClavisPass desktop

Useful checks on Windows:

```powershell
reg query "HKCU\Software\Microsoft\Edge\NativeMessagingHosts\com.clavispass.native_host" /ve
Get-Content "$env:LOCALAPPDATA\ClavisPass\bridge\native-hosts\com.clavispass.native_host.chromium.json"
```

## Expected failure cases

Typical errors if setup is incomplete:

- `No such native application com.clavispass.native_host`
  - registry entry missing or wrong manifest path
- permission / spawn error
  - manifest points to a missing or non-executable file
- access denied / not authorized
  - wrong `allowed_extensions` or wrong Firefox add-on ID
- Chromium/Edge status not returned
  - extension origin missing from `allowed_origins`
- `pairingStatus = pending`
  - browser is waiting for manual approval in the desktop app
- `APP_LOCKED`
  - the browser tried to read or write while the desktop app had no unlocked bridge session
- `WRITE_TIMEOUT`
  - the app did not process the claimed browser write request in time

## Future hardening

This V1 is intentionally minimal. Important next steps:

- add richer peer attestation beyond extension ID and instance ID
- add per-peer shared secret or challenge/response
- replace plain session snapshot persistence with a safer ephemeral encryption model
- add better audit/history for browser approvals and revocations
- narrow returned fill data further by field/action scope
- add explicit desktop UI activity for browser save/update requests

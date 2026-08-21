# ClavisPass Firefox Add-on Reviewer Build

This source package contains the readable source files for the ClavisPass Firefox extension.
The submitted extension ZIP is generated from this source with Vite and the Firefox packaging script.

## Environment

- Node.js 24.14.0 or newer Node 24.x
- npm 11.9.0 or newer npm 11.x
- PowerShell 7.x or Windows PowerShell

The build does not require network access beyond installing npm dependencies from the official npm registry.

## Build Steps

From this directory:

```bash
npm ci
npm run build:firefox
```

The generated Firefox package is written to:

```text
artifacts/clavispass-firefox-0.1.0.zip
```

## Firefox Add-on ID

The Firefox add-on ID used by the extension and ClavisPass native messaging host is:

```text
clavispass@arratel.dev
```

## Native Messaging Notes

ClavisPass requires the ClavisPass Desktop app and its local native messaging host:

```text
com.clavispass.native_host
```

The extension communicates with the local native host only. Vault secrets are requested from the local desktop app for explicit autofill actions and are not transmitted by the extension to Arratel or other remote servers.

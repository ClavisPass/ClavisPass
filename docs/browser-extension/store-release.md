# Browser Extension Store Release

This document tracks the store submission details for the ClavisPass browser extension.

## Shared Listing

Name:

```text
ClavisPass
```

German summary:

```text
Fuelle Passwoerter aus deinem lokalen ClavisPass Desktop-Vault aus.
```

English summary:

```text
Fill passwords from your local ClavisPass desktop vault.
```

German description:

```text
ClavisPass fuer Firefox verbindet Firefox mit der ClavisPass Desktop-App, damit du passende Logins aus deinem lokal verschluesselten Vault ausfuellen kannst.

Die Erweiterung nutzt Firefox Native Messaging, um mit der lokalen ClavisPass Desktop-App zu kommunizieren. Der Browser-Zugriff muss zuerst in ClavisPass freigegeben werden. Passwoerter werden nur fuer explizite Autofill-Aktionen angefragt und von der Erweiterung nicht an Arratel oder andere externe Server uebertragen.
```

English description:

```text
ClavisPass connects your browser to the ClavisPass desktop app so you can fill matching logins from your local encrypted vault.

The extension uses native messaging to communicate with the local ClavisPass desktop app. Browser access must be approved in ClavisPass before vault data can be used. Passwords are requested only for explicit autofill actions and are not sent by the extension to Arratel or other remote servers.
```

Experimental:

```text
No
```

Requires payment, paid services, additional software, or additional hardware:

```text
Yes
```

Reason: the extension requires the separately installed ClavisPass Desktop app and native messaging host.

Primary category:

```text
Privacy & Security
```

Support email:

```text
support@arratel.dev
```

Support page:

```text
https://clavispass.arratel.dev
```

License:

```text
All rights reserved
```

Use an open-source license such as MIT or Apache-2.0 only if the extension is intentionally released under that license.

## Privacy Policy

The add-on has a privacy policy:

```text
Yes
```

Privacy policy text:

```text
ClavisPass for Firefox communicates with the local ClavisPass desktop app through Firefox Native Messaging.

The extension reads the active website domain to ask the local desktop app for matching vault entries. When the user chooses to fill a login, the extension requests the selected login data from the local desktop app and inserts it into the active page.

The extension does not send passwords, vault contents, browsing history, or website data to Arratel or other remote servers. Data exchanged by the extension is used only for local pairing, matching, autofill, and save/update prompts with the ClavisPass desktop app.
```

For Chrome, replace "Firefox Native Messaging" with "browser native messaging" or "Chrome Native Messaging".

## Firefox / AMO

Developer Hub:

```text
https://addons.mozilla.org/developers/
```

Submit page:

```text
https://addons.mozilla.org/developers/addon/submit/distribution
```

Build command:

```powershell
npm run extension:release:firefox
```

Upload package:

```text
browser-extension/artifacts/clavispass-firefox-0.1.0.zip
```

Source package for Mozilla review:

```text
browser-extension/artifacts/clavispass-firefox-source-0.1.0.zip
```

Firefox add-on ID:

```text
clavispass@arratel.dev
```

Native messaging host:

```text
com.clavispass.native_host
```

Firefox category:

```text
Datenschutz & Sicherheit
```

Firefox data collection permission:

```json
{
  "required": ["none"]
}
```

Reviewer notes:

```text
ClavisPass requires the ClavisPass Desktop app and native messaging host.

The extension communicates only with the local native messaging host:
com.clavispass.native_host

No vault secrets are transmitted to remote servers by the extension.

Test steps:
1. Install ClavisPass Desktop.
2. Unlock or create a test vault.
3. Install the extension.
4. Approve the browser pairing request in ClavisPass Desktop.
5. Open a login page with a matching vault entry.
6. Use the popup or inline fill button.

The submitted package was built with:
npm run extension:release:firefox

If source code is requested, use:
browser-extension/artifacts/clavispass-firefox-source-0.1.0.zip

The source package contains REVIEWER_BUILD.md with reproducible build steps.
```

Current AMO lint/review notes:

- ZIP entries are created with `/` path separators.
- Manifest includes `browser_specific_settings.gecko.data_collection_permissions.required = ["none"]`.
- Icon files match their declared manifest sizes.
- The content script does not assign `innerHTML`.
- The Firefox packaging step removes unsafe React DOM `innerHTML` assignment fallbacks from the submitted package.

## Chrome Web Store

Chrome Web Store Developer Dashboard:

```text
https://chrome.google.com/webstore/devconsole
```

Current status:

```text
Not submitted yet.
```

Before Chrome submission:

- Decide whether the Chrome listing uses the same privacy policy text or Chrome-specific wording.
- Build a Chrome-specific release ZIP with `npm run extension:release:chrome`.
- Fill the final Chrome Web Store extension ID into native messaging installer configuration once Google assigns it.
- Update Chromium `allowed_origins` for `com.clavispass.native_host`.
- Add Chrome-specific screenshots and promotional images.

Build command:

```powershell
npm run extension:release:chrome
```

Upload package:

```text
browser-extension/artifacts/clavispass-chrome-0.1.1.zip
```

Chrome package notes:

- The ZIP contains the contents of `browser-extension/dist`, not the `dist` folder itself.
- The package keeps Manifest V3 `background.service_worker`.
- Firefox-only `browser_specific_settings` are removed from the Chrome archive.
- ZIP entries are created with `/` path separators.

Likely category:

```text
Privacy & Security
```

Chrome reviewer notes should mirror Firefox, but mention Chrome Native Messaging and the final Chrome extension ID once known.

# Firefox Store Release Notes

This document contains the current release inputs for submitting ClavisPass to addons.mozilla.org.

## Release Artifacts

Create the Firefox release package and Mozilla source package from the repo root:

```powershell
npm run extension:release:firefox
```

Generated files:

```text
browser-extension/artifacts/clavispass-firefox-0.1.0.zip
browser-extension/artifacts/clavispass-firefox-source-0.1.0.zip
```

Submit `clavispass-firefox-0.1.0.zip` as the add-on package.
When AMO asks for source code, submit `clavispass-firefox-source-0.1.0.zip`.

## Extension Identity

Firefox add-on ID:

```text
clavispass@arratel.dev
```

Native messaging host:

```text
com.clavispass.native_host
```

## Listing

Name:

```text
ClavisPass
```

Summary:

```text
Fill passwords from your local ClavisPass desktop vault.
```

Description:

```text
ClavisPass for Firefox connects Firefox to the ClavisPass desktop app so you can fill matching logins from your local encrypted vault.

The extension uses Firefox Native Messaging to communicate with the local ClavisPass desktop app. Browser access must be approved in ClavisPass before vault data can be used. Passwords are requested only for explicit autofill actions and are not sent by the extension to Arratel or other remote servers.
```

Category:

```text
Privacy & Security
```

## Reviewer Notes

```text
ClavisPass requires the ClavisPass Desktop app and native messaging host.
The extension communicates only with the local native host.
No vault secrets are transmitted to remote servers by the extension.

Test steps:
1. Install ClavisPass Desktop.
2. Unlock or create a test vault.
3. Install the extension.
4. Approve the browser pairing request in ClavisPass Desktop.
5. Open a login page with a matching vault entry.
6. Use the popup or inline fill button.
```

## Privacy Policy Draft

```text
ClavisPass for Firefox communicates with the local ClavisPass desktop app through Firefox Native Messaging.

The extension reads the active website domain to ask the local desktop app for matching vault entries. When the user chooses to fill a login, the extension requests the selected login data from the local desktop app and inserts it into the active page.

The extension does not send passwords, vault contents, browsing history, or website data to Arratel or other remote servers. Data exchanged by the extension is used only for local pairing, matching, autofill, and save/update prompts with the ClavisPass desktop app.
```

## Pre-Submit Check

- Run `npm run extension:release:firefox`.
- Temporarily load the generated Firefox package and test pairing.
- Confirm the desktop installer/native host manifest allows `clavispass@arratel.dev`.
- Confirm screenshots and a hosted privacy policy URL are available before submitting.

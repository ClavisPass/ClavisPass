# Privacy Policy

Last updated: August 28, 2026

This Privacy Policy explains which personal data is processed when using the ClavisPass website, the ClavisPass app, and the ClavisPass browser extension.

## 1. Controller

The controller responsible for data processing is:

```text
Ricardo Valente de Matos
Email: clavispass@arratel.dev
Website: https://clavispass.arratel.dev/
```

## 2. Core Principle Of ClavisPass

ClavisPass is a local, privacy-focused password manager. Vault contents are encrypted on the user's device before they are stored or synced with supported storage providers.

The master password is not transmitted to Arratel or ClavisPass. ClavisPass cannot recover a forgotten master password.

## 3. Local Data Processing In The App

The ClavisPass app primarily processes data locally on the user's device. This may include:

- vault data such as passwords, usernames, URLs, notes, 2FA data, recovery codes, cards, documents, attachments, tags, folders, and other user-created content
- app settings such as language, theme, session duration, clipboard duration, Fast Access settings, and similar configuration
- technical device information where required for vault management, sync, or the device overview
- local session information so the vault can remain unlocked during a usage session

Vault contents are stored in encrypted form. Readable vault contents are not transmitted to ClavisPass or Arratel.

## 4. Encryption And Master Password

ClavisPass uses local encryption for the vault. The current implementation uses modern cryptographic methods, including:

- Argon2id to derive a key from the master password
- XChaCha20-Poly1305 for authenticated encryption

The master password is processed locally and is not transmitted to ClavisPass or Arratel. Encrypted vault data cannot be decrypted without the master password.

## 5. Sync And Storage Providers

ClavisPass can store or sync vault data through providers selected by the user.

Currently relevant storage and sync options include:

- local device storage
- local vault file on desktop
- Dropbox
- Google Drive
- self-hosted ClavisPass Hub

When Dropbox, Google Drive, or a self-hosted ClavisPass Hub is used, vault contents are transmitted and stored in encrypted form. The respective provider or operator may process technical metadata, such as account data, file names, timestamps, IP addresses, OAuth information, or usage data of the respective service.

The privacy notices of the respective third-party provider or self-hosted ClavisPass Hub operator also apply to this processing.

## 6. OAuth And Access Tokens

When users connect Dropbox or Google Drive, the OAuth flow of the respective provider is used. Users may be redirected to pages of the third-party provider.

ClavisPass stores required refresh or access tokens securely and locally where this is necessary for sync. On desktop, secure operating-system storage mechanisms are used. On mobile platforms, secure device storage is used.

## 7. Local Vault Files

On desktop, ClavisPass can use a local vault file as a storage location. In this case, ClavisPass processes the file path selected by the user in order to load and save the vault.

This processing happens locally on the device. The file path is not transmitted to ClavisPass or Arratel.

## 8. Import Features

ClavisPass can import data from other sources, for example:

- browser exports
- Bitwarden exports
- KeePass/KDBX files
- backup files

Imported data is read locally and converted into the ClavisPass data model. Afterwards, it becomes part of the vault and is stored or synced in encrypted form.

For KeePass/KDBX files, the KeePass master password entered by the user is used locally to open the file. It is not transmitted to ClavisPass or Arratel.

## 9. Password Analysis And Have I Been Pwned

ClavisPass can check passwords with the Have I Been Pwned / Pwned Passwords service.

This check uses a k-anonymity approach: the full password is not transmitted. Instead, only a short prefix of a locally calculated hash is sent. The service returns matching hash suffixes, which are compared locally.

This feature requires a network connection to the Pwned Passwords service.

## 10. Browser Extension

The ClavisPass browser extension communicates with the local ClavisPass desktop app through Native Messaging.

The extension may read the active website domain to request matching vault entries from the local desktop app. When the user fills a login, the extension requests the selected login data from the local desktop app and inserts it into the active page.

The extension does not send passwords, vault contents, browsing history, or website data to ClavisPass, Arratel, or other remote servers. Data exchanged between the extension and the desktop app is used only for pairing, matching, autofill, and saving or updating entries.

## 11. Notifications

On mobile devices, ClavisPass may use local notifications, for example for Fast Access or expiry reminders.

Notifications are scheduled or displayed locally by the operating system. Expiry reminders do not contain sensitive vault details.

## 12. Contact

When users contact ClavisPass by email, the submitted information is processed, for example:

- email address
- name, if provided
- message content
- technical metadata of the email communication

The purpose is to handle the request. The legal basis is Art. 6(1)(b) GDPR if the request relates to the use of ClavisPass, or Art. 6(1)(f) GDPR based on the legitimate interest in support and communication.

## 13. Website And Hosting

The ClavisPass website is provided statically through GitHub Pages.

When visiting the website, technical access data may be processed, for example:

- IP address
- date and time of access
- requested page or file
- referrer
- browser and operating system
- transferred data volume

This processing is used for the technical provision, stability, and security of the website. The legal basis is Art. 6(1)(f) GDPR. GitHub's privacy notices also apply to processing by GitHub.

## 14. Cookies, Tracking And Analytics

ClavisPass currently does not use its own tracking cookies or analytics services.

## 15. App Stores And Download Platforms

If ClavisPass is obtained through platforms such as Microsoft Store, Google Play, Apple App Store, GitHub Releases, or browser extension stores, those platforms may process their own personal data. This may include account data, device information, download information, reviews, or crash information.

The privacy notices of the respective platform providers apply to this processing.

## 16. Legal Bases

Depending on the feature, ClavisPass processes data based on the following legal bases:

- Art. 6(1)(b) GDPR where processing is necessary to provide requested features
- Art. 6(1)(f) GDPR where there is a legitimate interest in secure operation, support, abuse prevention, error analysis, or technical provision
- Art. 6(1)(a) GDPR where consent is required, for example for optional notifications
- Art. 6(1)(c) GDPR where legal obligations apply

## 17. Retention

Local vault data remains stored on the user's device or with the selected storage provider until the user deletes it or removes the storage location.

Contact requests are stored only as long as necessary to process the request and possible follow-up questions, unless statutory retention obligations apply.

Technical website logs are processed by GitHub according to GitHub's applicable rules.

## 18. Recipients

Depending on the user's choices, recipients of personal data may include:

- GitHub as hosting and release platform
- the email provider for contact requests
- app store and download platforms
- sync providers selected by the user, such as Dropbox or Google
- Have I Been Pwned / Pwned Passwords, if password checking is used
- a self-hosted ClavisPass Hub, if used by the user

Depending on the provider, data may be transferred to countries outside the EU/EEA. In that case, the respective privacy notices and transfer mechanisms of the providers apply.

## 19. Data Subject Rights

Data subjects have the following rights under the GDPR, subject to the applicable legal requirements:

- access to processed personal data
- rectification of inaccurate data
- deletion
- restriction of processing
- data portability
- objection to processing based on legitimate interests
- withdrawal of consent with effect for the future
- complaint with a data protection supervisory authority

Requests can be sent to `clavispass@arratel.dev`.

## 20. Security

ClavisPass uses technical measures to protect data. These include local vault encryption, secure token storage, and separation of sensitive vault contents from UI metadata.

No system can guarantee absolute security. Users should use a strong master password, keep their devices up to date, and protect backups carefully.

## 21. Changes To This Privacy Policy

This Privacy Policy may be updated if features, providers, legal requirements, or technical processes change.


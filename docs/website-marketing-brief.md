# ClavisPass Website Marketing Brief

This file collects product context, marketing angles, feature highlights, and copy ideas for the separate ClavisPass / Arratel website project.

## Core Positioning

ClavisPass is a privacy-focused password manager by Arratel.

The main idea:

> A modern password manager for people who want strong local encryption, useful organization, and sync through providers they control.

ClavisPass should feel:

- trustworthy
- calm
- technical enough to be credible
- approachable enough for non-expert users
- independent, not enterprise-heavy
- privacy-first without fearmongering

Good short positioning lines:

- `A private password manager that works with your own cloud.`
- `Secure your passwords without handing over your vault.`
- `Local-first password management for desktop and mobile.`
- `Your vault. Your devices. Your sync provider.`
- `A focused password manager built around local encryption.`

Avoid overclaiming:

- Do not claim ClavisPass is externally audited unless that is actually true.
- Prefer `built with modern cryptography` over `military-grade encryption`.
- Prefer `designed for zero-knowledge sync` over absolute claims that depend on user setup.

## Strong Marketing Points

### Local Encryption

ClavisPass encrypts vault data locally before it is stored or synced.

Useful copy:

- `Your vault is encrypted before it leaves your device.`
- `Sync providers store encrypted data, not your readable passwords.`
- `Your master password is used locally and is not sent to a server.`

Technical detail for trust pages:

- Key derivation: Argon2id
- Vault encryption: XChaCha20-Poly1305
- Per-vault salt
- Authenticated encryption for confidentiality and tamper detection

### Bring Your Own Sync

ClavisPass is provider-based. Current / relevant sync paths include:

- Dropbox
- Google Drive
- local device storage
- local vault file on desktop
- ClavisPass Hub architecture exists in the app code

Marketing angle:

- Users are not forced into a single hosted account system.
- The vault can live in a cloud/storage workflow the user already trusts.
- The app can be useful even without a central ClavisPass server.

Useful copy:

- `Use the storage you already trust.`
- `Sync through Dropbox, Google Drive, or a local vault file.`
- `No mandatory ClavisPass account required.`

### Cross-Platform

The app is built for:

- Windows
- macOS
- Linux
- Android
- iOS planned / in development

Desktop uses Tauri. Mobile uses Expo / React Native.

Useful copy:

- `One vault across desktop and mobile.`
- `Built for Windows, macOS, Linux, and Android, with iOS planned.`
- `A familiar experience across your devices.`

### Modular Entries

ClavisPass entries are not just a fixed username/password form. They are built from modules.

Current module types include:

- Password
- Username
- URL
- E-Mail
- Phone number
- TOTP / 2FA
- Recovery codes
- PIN
- Notes
- Custom fields
- WiFi
- Keys
- Digital cards
- Credit cards
- Person
- Company
- Address
- Documents
- Attachments
- Checklists
- Expiry dates
- Tags

Marketing angle:

- ClavisPass can store more than passwords.
- Entries can match real-world data instead of forcing every item into the same template.
- Useful for logins, identity records, documents, cards, WiFi credentials, recovery codes, and structured notes.

Useful copy:

- `Build entries that fit the real thing you want to save.`
- `Passwords, 2FA codes, recovery codes, documents, cards, notes, and more.`
- `Use modules to keep each entry clean instead of dumping everything into one note field.`

### Fast Access

Fast Access helps users quickly use login data without opening the full editor flow.

Current direction:

- Desktop popup-style quick access
- Mobile notification-based quick access behavior
- Copy actions for common login data

Marketing angle:

- Less friction for frequent login workflows.
- Quick use without losing the focused app design.

Useful copy:

- `Access the credentials you need without digging through the full vault.`
- `Fast Access keeps common login actions close when you need them.`

### Browser Extension

ClavisPass has browser extension work for desktop/browser interaction.

Important notes:

- It should be marketed carefully depending on current release status.
- If the extension is not public yet, present it as `Browser extension support is in progress` or hide it from the main homepage until release.

Useful copy if public:

- `Connect trusted browsers to your unlocked desktop app.`
- `Approve browser access explicitly and keep control over what can request fill data.`

Useful copy if not public:

- `Browser extension support is planned for smoother desktop workflows.`

### Import Support

ClavisPass supports imports from common sources.

Current / planned importer-related points:

- Browser exports such as Chrome / Firefox
- Bitwarden import
- KeePass / KDBX import
- Backup import/export
- pCloud legacy import path exists

Marketing angle:

- Easier migration from existing password managers.
- Lowers the first-use barrier.

Useful copy:

- `Bring your existing passwords with you.`
- `Import from browser exports, Bitwarden, and KeePass/KDBX.`
- `Start from your current vault instead of rebuilding everything by hand.`

### Attachments And Previews

Entries can contain attachments.

Current capabilities:

- File attachments inside the vault
- Limits per file and per entry
- Image/PDF preview work exists in the app
- Attachments are stored with the vault and synced with it

Marketing angle:

- Useful for documents, IDs, certificates, insurance papers, recovery files, and related scans.
- Should be described with care because attachments can make vaults larger.

Useful copy:

- `Keep related files next to the entry they belong to.`
- `Attach documents, images, and PDFs to your encrypted vault.`

### Organization

Organization features:

- folders
- favorites
- pinned entries
- manual reorder
- module filters
- search
- tags
- templates for new entries

Marketing angle:

- ClavisPass is not only secure; it is pleasant to manage over time.
- Good for people with large vaults.

Useful copy:

- `Find what you need quickly with folders, tags, filters, favorites, and pinned entries.`
- `Keep large vaults readable with flexible organization tools.`

### Expiry And Security Maintenance

Expiry-related features:

- Expiry module
- Expiry overview
- Expiry filter/tool
- Simple local expiry reminders on mobile

Security analysis:

- Password quality/risk analysis exists in the app.

Marketing angle:

- Helps users maintain their vault instead of only storing data.

Useful copy:

- `Track expiring items before they become a problem.`
- `Review weak or risky passwords from inside your vault.`

### Desktop Polish

Desktop-specific strengths:

- Tauri-based native shell
- Custom titlebar and window controls
- macOS-style and classic window controls
- system tray behavior
- autostart / start minimized
- transparent/rounded window handling
- deep-link support for opening vault files
- local vault file provider

Marketing angle:

- Feels like a real desktop app, not just a webpage.
- Good for users who care about local workflows.

Useful copy:

- `A real desktop app with local vault file support.`
- `Designed for everyday use on Windows, macOS, and Linux.`

## Suggested Homepage Structure

### Hero

Headline options:

- `ClavisPass`
- `Private password management, synced your way.`
- `Your passwords, encrypted locally.`

Best recommendation:

Headline:

> `ClavisPass`

Subheadline:

> `A privacy-focused password manager that encrypts your vault locally and syncs through providers you control.`

Primary CTA:

> `Download ClavisPass`

Secondary CTA:

> `View on GitHub`

Small trust line:

> `Built by Arratel. Local-first. Cross-platform.`

### Section: Why ClavisPass

Three pillars:

1. `Local-first security`
   - Your vault is encrypted on your device before sync.
2. `Sync without lock-in`
   - Use supported cloud providers or a local vault file.
3. `Flexible entries`
   - Store passwords, 2FA, cards, documents, notes, attachments, and more.

### Section: Features

Good feature cards:

- Local encryption
- Bring-your-own-sync
- Modular entries
- Fast Access
- Browser extension support
- Imports from Bitwarden/KeePass/browser exports
- Tags, folders, favorites, pins
- Attachments and previews
- Expiry tracking and reminders
- Cross-platform apps

### Section: Security

Keep this section confident but precise.

Good copy:

> `ClavisPass is designed so readable vault data stays on your device. Your master password is not sent to a ClavisPass server, and sync providers only receive encrypted vault data.`

Bullets:

- Argon2id key derivation
- XChaCha20-Poly1305 authenticated encryption
- Secrets kept out of reactive UI state
- Local secure storage for provider tokens
- Automatic session locking
- Clipboard auto-clear setting

Avoid:

- `unhackable`
- `military-grade`
- `100% secure`
- `externally audited`

### Section: Sync

Good copy:

> `ClavisPass does not force your vault into one hosted account. Store and sync encrypted vault data through providers such as Dropbox, Google Drive, device storage, or a local vault file on desktop.`

### Section: Modules / What You Can Store

Use a visual grid grouped by purpose:

- Login: password, username, URL, email, TOTP, recovery codes
- Identity: person, address, company, phone, documents
- Finance: credit card, PIN, expiry
- Files: attachments, notes
- Technical: WiFi, keys, custom fields
- Organization: folders, tags, favorites, pins

### Section: Import

Good copy:

> `Already using another password manager? Import your existing data from popular formats and move into ClavisPass without rebuilding your vault manually.`

Mention:

- Bitwarden
- KeePass/KDBX
- Chrome exports
- Firefox exports
- backups

### Section: Platforms

Status wording should match current release reality.

Suggested public wording:

- `Windows`
- `macOS`
- `Linux`
- `Android`
- `iOS planned`

If store releases are not live yet, use:

- `Desktop builds available through GitHub Releases`
- `Android build available`
- `Store releases are being prepared`

### Section: Open Source / GitHub

Good copy:

> `ClavisPass is developed openly on GitHub so users can inspect the project, follow releases, and report issues.`

CTA:

> `View source on GitHub`

## Store Listing Copy

### Short Description

`A private, local-first password manager with encrypted sync and flexible vault entries.`

### Longer Description

`ClavisPass is a privacy-focused password manager built around local encryption. Your vault is encrypted on your device before it is stored or synced, so supported storage providers only handle encrypted vault data. Organize passwords, 2FA codes, recovery codes, notes, cards, documents, attachments, and more with flexible modules, folders, tags, favorites, and pinned entries.`

### Feature Bullets

- Local-first vault encryption
- Sync through supported providers you control
- Flexible modular entries
- Passwords, 2FA, recovery codes, cards, documents, notes, and attachments
- Folders, tags, favorites, pins, filters, and search
- Import from Bitwarden, KeePass/KDBX, and browser exports
- Cross-platform desktop and mobile experience

## SEO Keywords

Primary:

- password manager
- private password manager
- encrypted password manager
- local password manager
- open source password manager
- cross-platform password manager

Secondary:

- KeePass alternative
- Bitwarden alternative
- password manager with Dropbox sync
- password manager with Google Drive sync
- local-first password manager
- offline password manager
- encrypted vault
- TOTP password manager
- password manager with attachments

German:

- Passwortmanager
- privater Passwortmanager
- verschlüsselter Passwortmanager
- lokaler Passwortmanager
- Open Source Passwortmanager
- Passwortmanager mit Dropbox Sync
- Passwortmanager mit Google Drive Sync
- KeePass Alternative
- Bitwarden Alternative
- Passwort Tresor
- verschlüsselter Tresor

## FAQ Ideas

### Does ClavisPass store my passwords on a server?

No mandatory ClavisPass server is required for the core vault flow. Vault data is encrypted locally before it is stored or synced through supported providers.

### Can my cloud provider read my passwords?

The sync provider receives encrypted vault data. Plaintext vault contents and the master password are handled locally by the app.

### What happens if I forget my master password?

The vault is encrypted with the master password. Without it, encrypted vault data cannot be decrypted. The website should explain this clearly and encourage safe backup habits.

### Which platforms are supported?

Windows, macOS, Linux, and Android are relevant now. iOS is planned / in development depending on release status.

### Can I import my existing passwords?

Yes, ClavisPass supports importing from browser exports and password-manager formats such as Bitwarden and KeePass/KDBX.

### Is ClavisPass open source?

Yes, the project is available on GitHub.

### Does ClavisPass work offline?

The vault is local-first. Sync requires the selected provider, but vault access can work independently of a central ClavisPass account once the vault is available on the device.

## Visual Direction

The site should look:

- focused
- trustworthy
- modern
- calm
- not like a generic AI-generated SaaS landing page

Good visuals:

- Real app screenshots
- Desktop window screenshot
- Mobile vault list screenshot
- Entry editor screenshot showing modules
- Security architecture diagram
- Sync provider diagram

Avoid:

- generic shield illustrations
- random abstract gradient blobs
- fake dashboard mockups
- too much purple/blue gradient as the only visual identity
- exaggerated security claims

## Suggested Screenshot Set

1. Home screen with entries, filters, and tool chips.
2. Edit screen with modules, tags, folders, and add-module tools.
3. Security/settings screen.
4. Fast Access popup or mobile quick access.
5. Import screen showing Bitwarden/KeePass/browser import.
6. Attachment preview or document-style entry.
7. Analysis screen with password risk overview.

## Brand Details

Product:

- `ClavisPass`

Parent brand:

- `Arratel`

Current public website:

- `https://clavispass.arratel.dev/`

Contact:

- `clavispass@arratel.dev`

GitHub:

- `https://github.com/ClavisPass/ClavisPass`

Preferred naming:

- `ClavisPass by Arratel`
- `Arratel` with normal capitalization, not all caps

## Trust And Compliance Notes

For a password manager website, trust matters more than hype.

Include:

- clear explanation of local encryption
- clear warning that forgotten master passwords cannot simply be recovered
- links to source code
- contact email
- privacy policy
- imprint / legal notice if targeting Germany/EU
- release downloads from official channels only

Good pages to create:

- `/`
- `/download`
- `/security`
- `/privacy`
- `/imprint`
- `/terms`
- `/contact`
- `/faq`

Legal draft files for these pages are available in:

- `docs/legal/privacy-policy.de.md`
- `docs/legal/terms-of-use.de.md`
- `docs/legal/imprint.de.md`
- `docs/legal/legal-publishing-checklist.md`

Optional later:

- `/docs`
- `/import`
- `/browser-extension`
- `/roadmap`

## Tone Guide

Use simple, confident language.

Good:

- `Your vault stays encrypted before it is synced.`
- `Use the cloud provider you already trust.`
- `Organize more than passwords.`
- `Built for everyday use across desktop and mobile.`

Less good:

- `The most secure password manager ever.`
- `Military-grade encryption.`
- `Never worry about security again.`
- `AI-powered next-gen vault experience.`

## Conversion Priorities

The homepage should make these things obvious within the first few seconds:

1. This is a password manager.
2. It is privacy-focused and local-first.
3. It supports desktop and mobile.
4. It can sync through user-controlled providers.
5. It is actively built and downloadable.

Primary CTA:

- Download

Secondary CTA:

- GitHub

Tertiary CTA:

- Contact

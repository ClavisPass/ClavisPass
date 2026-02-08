# ClavisPass
<p align="center">
  <img src="/assets/icon.svg" alt="Screenshot" width="300" />
</p>

**Take control of your passwords – securely and seamlessly.**  
ClavisPass is a modern, privacy-focused password manager that works *with your own cloud*. Use Dropbox (or any other file-based sync) to securely manage your encrypted vault across all your devices.

---

## Features

- **Local Encryption Only**  
  Your data is encrypted on your device using modern cryptography and never leaves your hands unprotected.

- **Sync with Your Cloud**  
  Use Dropbox (or any cloud provider) to sync your vault privately without a centralized server.

- **Cross-Platform**  
  Available for **Linux, Windows, macOS, iOS**, and **Android** – one experience across all devices.

- **Simple & Focused Design**  
  No bloat, just what you need to manage your credentials — clean, fast, and minimal.

---

## Platforms

| Platform | Status |
|---------|--------|
| 🖥️ Windows | ✅ Released |
| 🐧 Linux   | ✅ Released |
| 🍎 macOS   | ✅ Released |
| 📱 Android | ✅ Released |
| 📱 iOS     | 🚧 Coming soon |

---

## Installation

Download the latest release for your platform from the [Releases Page](https://github.com/ClavisPass/ClavisPass/releases).

---

## Security-Oriented Architecture Overview

This project follows a **security-first client architecture** with a strong emphasis on **minimizing the exposure of sensitive data in memory**, **centralizing trust boundaries**, and **making security-critical responsibilities explicit and auditable**.

The core guiding principle is:

> **Secrets exist in exactly one place, for the shortest possible time, and are never part of reactive UI state.**

---

## Cryptography & Encryption Model

ClavisPass uses a **modern, audited cryptographic design** based on industry-standard primitives.
All encryption and decryption happens **locally on the client device**.  
At no point does the application or any sync provider gain access to plaintext data or encryption keys.

The security model follows a strict **zero-knowledge approach**.

### Key Derivation

Your master password is never used directly as an encryption key.

Instead, ClavisPass derives a strong encryption key using:

- **Argon2id** (memory-hard password hashing)
- A **random per-vault salt**
- Configured to resist brute-force and GPU-based attacks

This ensures that even if an attacker gains access to your encrypted vault file,
offline attacks remain computationally expensive.

### Vault Encryption

Vault contents are encrypted using:

- **XChaCha20-Poly1305 (IETF)**
- 256-bit encryption key
- Authenticated encryption (AEAD)

This provides:
- Confidentiality (data cannot be read)
- Integrity (data cannot be modified undetected)
- Authentication (tampering is reliably detected)

Each encryption operation uses a **unique random nonce** and includes
additional authenticated metadata to protect the vault structure itself.

### Platform Consistency

The same cryptographic design is used across:
- Web
- Mobile (iOS / Android)
- Desktop (Windows / macOS / Linux)

This guarantees that vaults are fully portable and behave identically on all platforms.

---

## Authentication & Master Secret Handling

### Design Goals
- Avoid storing secrets in React state or context values
- Prevent accidental leakage via re-renders, props, logs, or DevTools
- Keep cryptographic material **ephemeral and non-reactive**

### Implementation

The master password is **never stored in React state**.

Instead:
- It is held **only in memory** using a `useRef` inside `AuthProvider`
- The React context exposes **functions**, not the secret itself

```ts
const masterRef = useRef<string | null>(null);
```

The context API deliberately provides:
- `getMaster()` – nullable, non-reactive access
- `requireMaster()` – explicit failure if no secret is present

This ensures:
- No component can accidentally subscribe to secret changes
- No re-render is ever triggered by secret updates
- Secrets are not visible through React DevTools or context inspection

### Session Lifecycle
- Sessions are time-boxed (automatic logout after a fixed interval)
- Logout **actively wipes the secret from memory**
- All timers are centrally managed and cleaned up on unmount

---

## Vault Architecture & Trust Boundaries

The vault is split into **two strictly separated layers**.

---

### 1. VaultSession (Authoritative & Secret-Capable)

Responsibilities:
- Holds the **full decrypted vault**
- Lives outside React (non-reactive)
- Performs all mutations and dirty-state tracking
- Acts as the **single source of truth**

This layer is the only place where full vault data exists.

---

### 2. VaultProvider (UI-Safe Projection)

The React-facing vault context **never exposes raw secrets**.

It provides only:
- `EntryMeta[]` – derived, non-sensitive metadata
- Folder structures and UI-safe state
- Controlled write helpers (`update`, `upsertEntry`, `deleteEntry`)

Secrets are accessed **on-demand only**:

```ts
getSecretValue(entryId, module)
getSecretPayload(entryId, module)
```

Guarantees:
- Secrets are never stored in React state
- Secrets are fetched only when explicitly required (e.g. copy, decrypt)
- UI components remain secure by default

---

## Module Policy System

All module behavior is governed by a **central policy registry**.

Each module declares:
- Its classification (`meta`, `secret`, `hybrid`, `structured`)
- How metadata is extracted
- How secret payloads are derived

```ts
export const MODULE_POLICY satisfies Record<ManagedModules, ModulePolicy>;
```

Benefits:
- **Compile-time enforcement** that every module is handled
- Immediate TypeScript errors when adding a new module without integration
- One auditable location for all security-relevant logic

---

## Defensive Defaults

- Unknown or unsupported modules always fall back to a **safe renderer**
- Missing policies result in `null` secrets (secure default)
- Rendering never fails hard due to malformed or future module data

---

## Summary

This architecture intentionally:
- Keeps secrets **out of React state**
- Centralizes all sensitive logic
- Minimizes the blast radius of bugs or misuse
- Makes security decisions explicit and reviewable

The result is a system that is **predictable, auditable, and resilient by design**, without sacrificing developer ergonomics.

---

## Screenshots

> *(Insert screenshots or a GIF of your app here to make the project visually appealing)*

---

## Tech Stack

### Frontend
- [React Native](https://reactnative.dev/) via [Expo](https://docs.expo.dev/versions/latest/)
- [React Native Paper](https://callstack.github.io/react-native-paper/docs/)
- [Material Design Icons](https://pictogrammers.com/library/mdi/)

### Backend / Plattform
- [Tauri](https://tauri.app/) – safe Desktop-Framework with Rust
- [Rust](https://www.rust-lang.org/) – for native Performance & Encryption
- [Dropbox API](https://www.dropbox.com/developers) – as Cloud-Synchronisation

### Security
- End-to-end encryption using **XChaCha20-Poly1305**
- Memory-hard key derivation via **Argon2id**
- Local key management – no external servers involved

### CI / CD & Deployment
- GitHub Actions – automated builds, code signing, and release uploads
- Expo OTA Updates – over-the-air updates for mobile platforms
- GitHub Pages – hosts the homepage and automatically serves the `updater.json`

## FAQ

> See the [FAQ section on the homepage](https://clavispass.github.io/ClavisPass/) for common questions and answers.

---

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

## Homepage

[https://clavispass.github.io/ClavisPass/](https://clavispass.github.io/ClavisPass/)
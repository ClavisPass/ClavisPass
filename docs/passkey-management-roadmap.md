# ClavisPass Passkey Management Roadmap

This roadmap plans passkey support for ClavisPass as a local-first password
manager. It focuses on storing and managing passkeys in the vault first, while
leaving room for browser extension WebAuthn mediation later.

## Product Scope

ClavisPass should support passkeys in two distinct ways:

1. Store and manage passkeys for external websites and apps.
2. Later, use stored passkeys through the browser extension to sign in to those
   websites and apps.

This roadmap does not cover using a passkey to unlock or log in to ClavisPass
itself. That is a separate authentication feature.

## Core Principles

- Passkeys are vault credentials, not ordinary text fields.
- Private key material must remain encrypted in the vault.
- Browser extension and native bridge payloads must be narrowly scoped.
- Entry list metadata, search indexes, filters, history views, and browser
  suggestions must not expose secret passkey fields.
- RP ID matching must be strict before any future signing operation.
- The implementation should preserve ClavisPass' local-first model.
- The data model should stay compatible with future FIDO CXP/CXF import and
  export work where practical.

## Phase 0: Architecture Decision

Goal: decide the passkey trust boundary before implementation starts.

Decisions:

- Add passkeys as a dedicated vault module, tentatively `PASSKEY`.
- Treat RP ID, RP name, and display account labels as safe metadata.
- Treat private key, credential ID, user handle, and raw WebAuthn/CXF payloads as
  secret material unless a later review proves otherwise.
- Keep key access and future signing in the desktop/vault boundary, not in the
  extension's long-lived state.
- Use the existing browser extension native messaging bridge as the future
  mediation path.

## Phase 1: Vault Passkey Module

Goal: allow users to manually store, view, edit, and organize passkeys inside
ClavisPass.

Implementation areas:

- Add `PASSKEY` to `src/features/vault/model/ModulesEnum.ts`.
- Add a passkey module schema under `src/features/vault/model/modules`.
- Register the schema in `src/features/vault/model/ModulesType.ts`.
- Add default data in `src/features/vault/utils/getModuleData.ts`.
- Add rendering in `src/features/vault/utils/getModule.tsx`.
- Add `PasskeyModule.tsx` under `src/features/vault/components/modules`.
- Add module name and icon mappings.
- Add passkeys to the Add Module modal and module filter.
- Update the typed i18n contract and English/German translations.
- Update `src/features/vault/utils/modulePolicy.ts`.

Initial data model:

```ts
type PasskeyModule = {
  id: string;
  module: "PASSKEY";
  relyingPartyId: string;
  relyingPartyName: string;
  userName: string;
  userDisplayName: string;
  userHandle: string;
  credentialId: string;
  publicKey: string;
  privateKey: string;
  algorithm: string;
  transports: string[];
  backupEligible: boolean;
  backupState: boolean;
  createdAt?: string;
  lastUsedAt?: string;
  source?: string;
};
```

Security expectation:

- `modulePolicy` should expose at most RP ID, RP name, and account display
  labels as metadata.
- `getSecretFor(entry, ModulesEnum.PASSKEY)` should return the structured
  passkey payload only when explicitly requested.
- The module must not accidentally make private key material searchable or
  visible in list projections.

## Phase 2: Extension Bridge Preparation

Goal: make the existing browser extension and native bridge passkey-aware
without implementing WebAuthn signing yet.

Implementation areas:

- Extend bridge suggestion types with passkey metadata such as `hasPasskey` and
  optionally `passkeyCount`.
- Add RP ID/domain matching helpers separate from password URL matching.
- Keep existing password autofill behavior unchanged.
- Show passkey availability in the extension popup.
- Avoid returning private key material through existing fill-data commands.
- Add bridge protocol versioning before adding passkey commands.

Possible future command names:

- `searchPasskeysByRpId`
- `getPasskeyMetadataForEntry` (implemented as a metadata-only V2 command)
- `createPasskeyFromBrowser`
- `assertPasskeyForBrowser`
- `savePasskeyFromBrowser`

Bridge rule:

The extension may request a passkey operation, but the vault side should own
secret access and signing. The extension should receive only the WebAuthn result
needed by the page.

## Phase 3: Import And Export Preparation

Goal: avoid a proprietary dead end before passkey portability is implemented.

Implementation areas:

- Track FIDO Credential Exchange Protocol and Credential Exchange Format
  compatibility.
- Map ClavisPass fields to likely CXF passkey fields.
- Preserve unknown passkey fields in a controlled structured area if needed.
- Decide how Bitwarden and 1Password passkey exports should be handled.
- Update import flows to report unsupported passkeys clearly until real import
  is implemented.

Near-term stance:

- Do not silently discard passkeys during import.
- If passkey import is unsupported, show a clear unsupported-data report.
- Prefer a future structured import over storing passkeys as arbitrary notes.

## Phase 4: WebAuthn Mediation In The Extension

Goal: use stored ClavisPass passkeys for real website sign-in and passkey
creation.

Required capabilities:

- Detect WebAuthn creation requests from `navigator.credentials.create()`.
- Detect WebAuthn authentication requests from `navigator.credentials.get()`.
- Match requests against RP ID and allowed credential IDs.
- Show a ClavisPass selection/confirmation UI.
- Ask the desktop/vault side to create or sign credentials.
- Return a valid WebAuthn response to the page.

Key design questions:

- Whether to use extension WebAuthn APIs where available.
- Whether page-world script injection is required for browser compatibility.
- How to support conditional UI passkey flows.
- How to handle browser differences across Chromium, Firefox, Safari, and Edge.
- How to require user verification before signing.

Security requirements:

- Never sign for an RP ID that does not match the current page context.
- Never expose private key material to page scripts.
- Avoid keeping passkey secrets in extension state.
- Add clear desktop activity for passkey creation and use.

Current status:

- Detection spike implemented in the extension content script for
  `navigator.credentials.create()` and `navigator.credentials.get()`.
- The spike reports active passkey requests to the background worker and popup,
  but deliberately forwards the original browser call unchanged.
- RP-ID validation is implemented for detected requests. It uses strict
  same-host or parent-domain matching and does not reuse password autofill
  related-domain heuristics.
- The popup displays matching ClavisPass passkeys for a valid detected request
  through the metadata-only bridge command. Explicit selection signs supported
  requests; selection stays disabled for requests requiring local verification.
- `allowCredentials` IDs from `navigator.credentials.get()` are captured as
  request data and matched inside the desktop/Vault bridge through
  `matchPasskeysForRequest`; stored credential IDs are not returned to the
  extension.
- The native Vault bridge can now select native-only passkey assertion material
  for a specific entry/module/RP request, including credential ID, user handle,
  key material, algorithm, and backup flags. This is tested and intentionally
  separate from metadata commands.
- Native WebAuthn helpers exist for base64url encoding/decoding, SHA-256
  hashing, `clientDataJSON` construction, assertion `authenticatorData`
  construction, assertion signature payload construction, and a serializable
  assertion credential response envelope. They can also build the native
  assertion signing context up to the exact byte payload that a private key must
  sign. ES256/P-256 signing from base64url-encoded PKCS#8 key material is
  implemented and tested with signature verification, matching Bitwarden's
  exported passkey key-value shape.
- Passkey modules include a `signCount` field. The native assertion command uses
  the stored module value and no longer accepts a client-supplied sign count.
  Before returning an assertion, the host reserves its counter through the
  app-side vault write path. Counterless credentials remain at zero; positive
  counters increment from the newer of the app value and host snapshot. The
  app also records `lastUsedAt` for the issued assertion. Counter overflow,
  ambiguous credentials, and expired reservations fail closed. Bitwarden
  imports preserve exported counters instead of resetting them.
  Concurrent native writers use a shared OS file lock for the write queue.
  Reservation updates mark the vault dirty through its normal save path; they
  do not guarantee that encrypted storage has already flushed to disk.
- Native passkey matching uses strict RP IDs, preserving `www.` and rejecting
  URLs, ports, paths and malformed domain labels. Unusable non-empty
  `allowCredentials` lists do not fall back to unrestricted discovery.
  Invalid backup flags (backed up but not backup eligible) are rejected.
- Extension and native signing validate the serialized origin, HTTPS (with a
  local HTTP exception for `localhost`), exact/parent RP scope and public
  suffixes including private suffixes such as `github.io`. The extension uses
  `tldts`; the native host uses `url` and `psl`. IP-address RP IDs and origins
  containing userinfo, paths or fragments are rejected. Both sides have tests
  for these cases. Keep both bundled suffix-list dependencies current.
- Bridge protocol V4 includes `assertPasskeyForBrowser`, which resolves native
  passkey material from the unlocked vault snapshot, validates the selected RP
  and allowed credential IDs through the existing matching path, signs the
  assertion natively, and returns a WebAuthn assertion credential envelope. This
  is connected to page interception for explicitly selected sign-in requests.
- The extension page-world hook can now pause `navigator.credentials.get()`
  passkey requests with a request ID, keep them pending for explicit popup
  selection, call `assertPasskeyForBrowser`, and deliver the signed assertion
  back to the page as a WebAuthn-shaped credential object. Requests time out
  back to the browser's native WebAuthn flow if ClavisPass does not complete
  them.
- The returned assertion object now sets WebAuthn-related prototypes where the
  browser exposes them, includes `authenticatorAttachment`, implements
  `toJSON()`, and clears pending background requests when tabs close or
  navigate.
- Assertion requests that require WebAuthn user verification are rejected until
  ClavisPass has a real local verification step. The extension also re-checks
  the active tab origin immediately before signing, so a request cannot be
  completed after the user navigates to a different origin.
- The native V4 assertion command also rejects `userVerified: true`, so UV
  cannot be claimed by bypassing the extension UI and calling the host directly.
- A local WebAuthn sign-in test page exists at
  `browser-extension/test-pages/webauthn-get.html` and can be served with
  `npm run extension:test-page:webauthn` from the repo root. It is intended for
  manual end-to-end verification with an unlocked desktop vault and a passkey
  whose RP ID is `localhost`.
- A matching local test fixture generator exists at
  `browser-extension/scripts/generate-webauthn-test-passkey.js` and can be run
  with `npm run extension:test-fixture:webauthn`. It prints an ES256/P-256
  passkey module template for RP ID `localhost`.
- Credential creation, broad browser compatibility hardening, and end-to-end
  site verification are still not implemented.

## Remaining Work

Verification on 2026-10-16: root test suite (139 tests), native bridge library
suite (33 tests), app/extension TypeScript checks and extension production
build pass. No real unlocked-vault/browser end-to-end ceremony was run.

- Run a real browser end-to-end test with the local WebAuthn test page, the
  built extension, the native messaging host, and an unlocked ClavisPass desktop
  session.
- Harden the page-world credential object against browser compatibility issues
  and sites that perform strict `PublicKeyCredential` checks.
- Add a dedicated user confirmation surface beyond the popup prototype, with
  clearer audit/status feedback in the desktop app.
- Add real local user verification before supporting WebAuthn requests with
  `userVerification: "required"`.
- Implement `navigator.credentials.create()` handling for creating new
  passkeys from browser registration ceremonies and saving them into the vault.
- Verify durable saving of reserved positive counters before an assertion is
  returned, including crash/restart recovery. Current reservation guarantees
  monotonic values within the active app session; independent devices and
  restoring older backups cannot provide a shared monotonic counter. Prefer
  zero-counter credentials for synced passkeys. `lastUsedAt` means assertion
  issuance, not confirmation that the relying party accepted the sign-in.
- Add broader tests for invalid RP IDs, stale request IDs, missing desktop
  sessions, unsupported algorithms, and allowed-credential mismatches.
- Run cross-browser integration tests for the bundled Public Suffix Lists,
  IDNA, frame contexts and browser-specific WebAuthn object behavior. Unit tests
  cover public suffixes and native origin validation; real browser coverage is
  still pending.
- Research and plan Android/iOS platform credential provider integration later;
  mobile can reuse the vault data model, but not the browser-extension flow.

## Phase 5: Platform Integration

Goal: evaluate native passkey-provider behavior beyond the browser extension.

Research areas:

- Windows 11 third-party passkey provider support.
- Android credential provider integration.
- iOS/macOS limitations around third-party passkey managers.
- Browser support for extension-based WebAuthn mediation.
- QR/hybrid flows for using a passkey from another device.

This phase should come after the vault model and extension bridge are stable.

## Phase 6: Security, UX, And Verification

Goal: make passkey management trustworthy and understandable.

UX requirements:

- Explain the difference between passwords, TOTP, recovery codes, and passkeys.
- Clearly label RP ID and account identity.
- Hide sensitive fields by default.
- Warn before copying or revealing private key material.
- Show whether a passkey is synced/backup eligible when known.
- Keep passkey entries easy to find without leaking secrets.

Verification:

- Run TypeScript checks for vault and extension changes.
- Add module policy tests for metadata and secret extraction.
- Add parsing tests for old vaults without passkey modules.
- Add bridge tests to ensure passkey secrets are not returned by password fill
  commands.
- Add RP ID matching tests before any signing implementation.
- Run `graphify update .` after code edits in this repository.

## Recommended First Milestone

Build Phase 1 plus the passkey-aware read-only parts of Phase 2:

- Add `PASSKEY` as a vault module.
- Add safe metadata policy.
- Add edit/view UI.
- Add i18n and module picker/filter support.
- Add extension search metadata such as `hasPasskey`.
- Do not implement WebAuthn signing yet.

This creates a useful and safe foundation while keeping the more complex
browser mediation work isolated for a later milestone.

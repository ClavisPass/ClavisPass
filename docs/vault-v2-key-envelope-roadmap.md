# Vault V2 Key Envelope Roadmap

This note captures the crypto architecture change for moving Argon2id out of the normal sync hot path.

Status: implemented as the default write path. V1 remains readable for migration.

## Goal

Make save, reload, merge, backup export, and provider sync faster during an unlocked session without weakening the master-password based security model.

The intended direction is a new vault envelope format:

- Argon2id derives a key-encryption-key from the master password.
- A random vault data key encrypts and decrypts the vault payload.
- The vault data key is wrapped by the master-password derived key and stored inside the encrypted vault envelope.
- During an unlocked session, the app keeps the unwrapped vault data key only in memory.
- Normal encrypt/decrypt operations use the vault data key directly and do not rerun Argon2id.

This keeps ClavisPass local-first. No ClavisPass backend is required, and sync providers still store only encrypted vault data.

## Current V1 Behavior

The current V1 envelope derives the AEAD key directly from the master password for every encryption and decryption:

```text
master password + Argon2id salt -> AEAD key
AEAD key + nonce -> encrypted vault payload
```

This means a normal sync save can pay the Argon2id cost twice:

```text
remote vault decrypt -> Argon2id
local vault encrypt  -> Argon2id
```

The current V1 settings are intentionally expensive:

- `opslimit = 3`
- `memlimit = 64 MiB`

Those parameters are good for offline attack resistance, but they are a poor fit for repeated work inside an already-unlocked session.

## V2 Behavior

V2 should split password verification/key wrapping from vault payload encryption:

```text
master password + Argon2id salt -> wrapping key
random vault data key            -> encrypted/wrapped by wrapping key
vault payload                    -> encrypted by vault data key
```

Unlock flow:

1. Parse V2 envelope.
2. Derive wrapping key with Argon2id.
3. Decrypt/unwrap the vault data key.
4. Decrypt the vault payload with the vault data key.
5. Store the decrypted vault in `VaultSession`.
6. Keep the unwrapped vault data key in a non-reactive in-memory session boundary.

Normal save flow while unlocked:

1. Export full data from `VaultSession`.
2. Encrypt payload with the in-memory vault data key and a fresh nonce.
3. Persist the V2 envelope through the selected provider.

Argon2id should not run again until the user unlocks again, changes master password, imports/migrates a vault, or explicitly rotates keys.

## Migration Strategy

V2 does not need to preserve old-client write compatibility.

This is acceptable because the current real-world user base can be coordinated. Before migration, all active devices should be updated. Once any updated device writes V2, old app versions should be treated as unable to open or safely sync that vault.

Required behavior:

- New clients must continue to read V1.
- New clients must write V2 by default.
- A V1 vault should migrate to V2 after successful unlock and next save.
- Backup export should write V2 after the feature ships.
- Backup import should accept both V1 and V2.
- Old clients are not expected to read V2.

Rollout guardrails:

- Warn active testers/users to update all devices before editing the shared vault.
- Export a backup before the first V2 write.
- Avoid letting an old device overwrite the migrated remote vault with V1 after migration.

## Session Boundary

The vault data key must follow the same design spirit as the current master password handling:

- Do not put the vault data key in React state.
- Do not expose the raw key through context values.
- Keep it in a non-reactive in-memory holder.
- Clear it on lock/logout/session expiry.
- Clear it on screen-lock forced logout.
- Clear or replace it on master-password change and vault-file switch.

Likely implementation options:

- Extend `VaultSession` to hold session crypto material alongside decrypted data.
- Or introduce a sibling `VaultCryptoSession` module in `src/infrastructure/crypto/vault`.

The final design should preserve the current `AuthProvider` and `VaultProvider` trust boundaries.

## Envelope Design Notes

The V2 schema should include explicit metadata for both key wrapping and payload encryption.

Suggested shape:

```ts
{
  v: 2,
  kdf: {
    alg: "argon2id",
    opslimit: number,
    memlimit: number,
    salt_b64: string,
    keylen: number
  },
  keywrap: {
    alg: "xchacha20poly1305-ietf",
    nonce_b64: string,
    aad_b64: string,
    wrapped_key_b64: string
  },
  aead: {
    alg: "xchacha20poly1305-ietf",
    nonce_b64: string,
    aad_b64: string
  },
  ct_b64: string
}
```

Open design choices:

- Whether to use XChaCha20-Poly1305 directly for wrapping or a named KDF/key-wrap construction.
- Whether to include separate AAD domains for key wrapping and payload encryption.
- Whether to rotate the vault data key only on explicit request or also on master-password change.
- Whether to persist a migration marker in local metadata for UX warnings.

Important invariant:

- Payload encryption must use a fresh nonce for every write.
- Key wrapping should use a fresh nonce whenever the key is rewrapped.

## Master Password Change

V2 should make master-password changes cheaper and cleaner.

Expected behavior:

1. Verify current master password.
2. Keep the existing vault data key.
3. Derive a new wrapping key from the new master password and a new KDF salt.
4. Rewrap the vault data key.
5. Persist the V2 envelope.

The full vault payload does not need to be re-encrypted solely because the master password changed, although the implementation may choose to re-encrypt the payload with a fresh nonce as part of the save.

## Testing Plan

Unit tests:

- V1 decrypt still works.
- V2 encrypt/decrypt roundtrip works.
- V1 decrypt followed by V2 encrypt migrates payload without data loss.
- Wrong master password fails for V2.
- Tampered wrapped key fails.
- Tampered payload ciphertext fails.
- Tampered AAD fails.
- Master-password change rewraps the vault data key and keeps payload data intact.

Provider/runtime tests:

- Dropbox fetch/decrypt/save/upload with V2.
- Google Drive fetch/decrypt/save/upload with V2.
- Device/local sync with V2.
- Local vault file open/save with V2.
- Backup export/import with V2.
- Desktop and mobile providers produce byte-compatible behavior.

Security-sensitive manual checks:

- Lock/logout clears decrypted data and unwrapped key material.
- Session expiry clears decrypted data and key material.
- Screen lock forced logout clears decrypted data and key material.
- Browser extension bridge does not receive raw vault data keys.

## Implementation Phases

1. Add V2 schema and V2 crypto helpers beside the existing V1 code.
2. Add a non-reactive session holder for the unwrapped vault data key.
3. Update `decryptVaultContent` to accept V1 and V2.
4. Update unlock flows to seed the crypto session when V2 is opened.
5. Update `encryptVaultContent` to write V2 by default.
6. Add V1-to-V2 migration behavior on next save.
7. Update master-password change to rewrap the vault key.
8. Update backup import/export and local file switch paths.
9. Add tests for cross-format migration and provider parity.
10. Update project context, README/security docs, and tester release notes.

## Non-Goals

- Do not add a ClavisPass-hosted backend for this.
- Do not add provider metadata conflict checks as part of this change.
- Do not weaken Argon2id parameters merely to improve perceived sync speed.
- Do not expose vault data keys through React state, props, logs, context values, or browser-extension IPC.

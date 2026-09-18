# Crypto Context

Use this before changing vault encryption, decrypt/encrypt call paths, key wrapping, migration, crypto providers, or tests around vault format compatibility.

## Core Files

- `src/infrastructure/crypto/encryptVaultContent.ts`
- `src/infrastructure/crypto/decryptVaultContent.ts`
- `src/infrastructure/crypto/vault/VaultCryptoSession.ts`
- `src/infrastructure/crypto/vault/v2/VaultV2.ts`
- `src/infrastructure/crypto/vault/v2/VaultV2Schema.ts`
- `src/infrastructure/crypto/vault/v1/VaultV1.ts`
- `src/infrastructure/crypto/provider/*`

## Current Vault Format

The active write format is V2 key-envelope.

- V2 wraps a random vault data key using password-derived key material.
- V2 encrypts vault payloads with XChaCha20-Poly1305.
- `VaultCryptoSession` holds the unwrapped V2 vault data key during an unlocked session.
- `encryptVaultContent` writes V2 by default.
- `decryptVaultContent` reads V1 and V2.
- V1 remains readable for migration; the next normal save after a V1 unlock writes V2.

## Critical Rules

- Do not change KDF, AEAD, AAD, envelope schema, or provider loading casually.
- Master-password change must force rewrap of the vault data key.
- Lock/logout/session expiry must clear `VaultCryptoSession`.
- Web/native crypto providers must preserve the same envelope contract.
- Separate importer crypto helpers are not necessarily part of the ClavisPass vault format.

## Verification

For crypto work, inspect the end-to-end runtime path and run focused tests around V1 read compatibility, V2 roundtrip, provider parity, rewrap behavior, and session cleanup.

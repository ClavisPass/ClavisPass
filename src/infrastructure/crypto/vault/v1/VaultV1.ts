import type { CryptoProvider } from "../../provider/CryptoProvider";
import VaultDataType from "../../../../features/vault/model/VaultDataType";

// Defaults (später tunen / Settings)
const OPSLIMIT_DEFAULT = 3;
const MEMLIMIT_DEFAULT = 64 * 1024 * 1024; // 64 MiB

export type VaultV1 = {
  v: 1;
  kdf: {
    alg: "argon2id";
    opslimit: number;
    memlimit: number;
    salt_b64: string;
    keylen: number;
  };
  aead: {
    alg: "xchacha20poly1305-ietf";
    nonce_b64: string;
    aad_b64: string;
  };
  ct_b64: string; // ciphertext (inkl. mac, combined)
};

/**
 * AAD muss bei encrypt/decrypt identisch sein.
 * Nicht geheim, schützt aber die Header-Authentizität.
 */
function makeAadBytes(crypto: CryptoProvider): Uint8Array {
  // Stabil halten, NICHT mit salt/nonce mischen.
  const aadObj = { v: 1, kdf: "argon2id", aead: "xchacha20poly1305-ietf" };
  return crypto.toBytesUtf8(JSON.stringify(aadObj));
}

export async function encryptVaultV1(
  crypto: CryptoProvider,
  masterPassword: string,
  payload: VaultDataType,
  opts?: { opslimit?: number; memlimit?: number }
): Promise<string> {
  await crypto.ready();

  const opslimit = opts?.opslimit ?? OPSLIMIT_DEFAULT;
  const memlimit = opts?.memlimit ?? MEMLIMIT_DEFAULT;

  const salt = crypto.randomBytes(crypto.PWHASH_SALTBYTES());
  const keylen = crypto.AEAD_KEYBYTES();
  const key = crypto.pwhash(keylen, masterPassword, salt, opslimit, memlimit);

  const nonce = crypto.randomBytes(crypto.AEAD_NONCEBYTES());
  const aad = makeAadBytes(crypto);

  const plaintext = crypto.toBytesUtf8(JSON.stringify(payload));

  // Provider order: (plaintext, aad, nonce, key)
  const ciphertextCombined = crypto.aeadEncrypt(plaintext, aad, nonce, key);

  const out: VaultV1 = {
    v: 1,
    kdf: {
      alg: "argon2id",
      opslimit,
      memlimit,
      salt_b64: crypto.toBase64(salt),
      keylen,
    },
    aead: {
      alg: "xchacha20poly1305-ietf",
      nonce_b64: crypto.toBase64(nonce),
      aad_b64: crypto.toBase64(aad),
    },
    ct_b64: crypto.toBase64(ciphertextCombined),
  };

  return JSON.stringify(out);
}

export async function decryptVaultV1(
  crypto: CryptoProvider,
  vault: VaultV1,
  masterPassword: string
): Promise<VaultDataType> {
  await crypto.ready();

  if (vault.v !== 1) {
    throw new Error(`Unsupported vault version: ${String((vault as any).v)}`);
  }

  const salt = crypto.fromBase64(vault.kdf.salt_b64);
  const nonce = crypto.fromBase64(vault.aead.nonce_b64);

  // Fallback falls aad_b64 fehlt (sollte eigentlich nie fehlen)
  const aad = vault.aead?.aad_b64
    ? crypto.fromBase64(vault.aead.aad_b64)
    : makeAadBytes(crypto);

  const ct = crypto.fromBase64(vault.ct_b64);

    const keyLen = vault.kdf.keylen ?? crypto.AEAD_KEYBYTES();

  const ops = Number(vault.kdf.opslimit);
  const mem = Number(vault.kdf.memlimit);

  // Try a few likely memlimit interpretations (bytes vs KiB/MiB mismatches)
  const memCandidates = [
    mem,                    // bytes (canonical)
    Math.floor(mem / 1024),  // KiB
    mem * 1024,              // mem stored in KiB
    Math.floor(mem / (1024 * 1024)), // MiB
    mem * 1024 * 1024,       // mem stored in MiB
  ].filter((x) => Number.isFinite(x) && x > 0);

  const opsCandidates = Array.from(new Set([ops, Math.max(1, Math.floor(ops))]))
    .filter((x) => Number.isFinite(x) && x > 0);

  let lastErr: unknown = null;

  for (const o of opsCandidates) {
    for (const m of memCandidates) {
      try {
        const key = crypto.pwhash(keyLen, masterPassword, salt, o, m);
        const plaintextBytes = crypto.aeadDecrypt(ct, aad, nonce, key);
        const plaintext = crypto.fromBytesUtf8(plaintextBytes);
        return JSON.parse(plaintext) as VaultDataType;
      } catch (e) {
        lastErr = e;
      }
    }
  }

  throw (lastErr instanceof Error ? lastErr : new Error(String(lastErr)));

}

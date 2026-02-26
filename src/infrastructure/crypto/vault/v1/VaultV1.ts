import type { CryptoProvider } from "../../provider/CryptoProvider";
import VaultDataType from "../../../../features/vault/model/VaultDataType";
import { makeV1AadBytes } from "./aad";

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

export async function encryptVaultV1(
  crypto: CryptoProvider,
  masterPassword: string,
  payload: VaultDataType,
  opts?: { opslimit?: number; memlimit?: number },
): Promise<string> {
  await crypto.ready();

  const opslimit = Math.trunc(opts?.opslimit ?? OPSLIMIT_DEFAULT);
  const memlimit = Math.trunc(opts?.memlimit ?? MEMLIMIT_DEFAULT);

  if (!Number.isSafeInteger(opslimit) || opslimit <= 0) {
    throw new Error(`[VaultV1] bad opslimit: ${String(opslimit)}`);
  }
  if (!Number.isSafeInteger(memlimit) || memlimit <= 0) {
    throw new Error(`[VaultV1] bad memlimit: ${String(memlimit)}`);
  }

  const salt = crypto.randomBytes(crypto.PWHASH_SALTBYTES());
  const keylen = crypto.AEAD_KEYBYTES();
  const key = crypto.pwhash(keylen, masterPassword, salt, opslimit, memlimit);
  console.log("[VaultV1] key_b64 (encrypt)", crypto.toBase64(key));

  const nonce = crypto.randomBytes(crypto.AEAD_NONCEBYTES());
  const aad = makeV1AadBytes();

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
  masterPassword: string,
): Promise<VaultDataType> {
  await crypto.ready();

  console.log("[VaultV1] kdf params", vault.kdf);

  if (vault.v !== 1) {
    throw new Error(`Unsupported vault version: ${String((vault as any).v)}`);
  }

  const salt = crypto.fromBase64(vault.kdf.salt_b64);
  const nonce = crypto.fromBase64(vault.aead.nonce_b64);

  // Fallback falls aad_b64 fehlt (sollte eigentlich nie fehlen)
  const aad = crypto.fromBase64(vault.aead.aad_b64);

  const ct = crypto.fromBase64(vault.ct_b64);

  const keyLen = vault.kdf.keylen ?? crypto.AEAD_KEYBYTES();

  const ops = vault.kdf.opslimit;
  const mem = vault.kdf.memlimit;

  // Hard guards: libsodium braucht unsigned integers
  if (!Number.isSafeInteger(ops) || ops <= 0) {
    throw new Error(`[VaultV1] invalid opslimit: ${String(ops)}`);
  }
  if (!Number.isSafeInteger(mem) || mem <= 0) {
    throw new Error(`[VaultV1] invalid memlimit: ${String(mem)}`);
  }

  try {
    const key = crypto.pwhash(keyLen, masterPassword, salt, ops, mem);
    console.log("[VaultV1] key_b64 (decrypt)", crypto.toBase64(key));
    const plaintextBytes = crypto.aeadDecrypt(ct, aad, nonce, key);
    const plaintext = crypto.fromBytesUtf8(plaintextBytes);
    return JSON.parse(plaintext) as VaultDataType;
  } catch (e) {
    throw e instanceof Error ? e : new Error(String(e));
  }
}

import type { CryptoProvider } from "../../provider/CryptoProvider";
import type VaultDataType from "../../../../features/vault/model/VaultDataType";
import { makeV1AadBytes } from "./aad";
import type { VaultV1 } from "./VaultV1Schema";

const OPSLIMIT_DEFAULT = 3;
const MEMLIMIT_DEFAULT = 64 * 1024 * 1024;

function assertPositiveSafeInteger(value: number, label: string) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`[VaultV1] invalid ${label}: ${String(value)}`);
  }
}

export async function encryptVaultV1(
  crypto: CryptoProvider,
  masterPassword: string,
  payload: VaultDataType,
  opts?: {
    opslimit?: number;
    memlimit?: number;
    salt?: Uint8Array;
    nonce?: Uint8Array;
  },
): Promise<string> {
  await crypto.ready();

  const opslimit = Math.trunc(opts?.opslimit ?? OPSLIMIT_DEFAULT);
  const memlimit = Math.trunc(opts?.memlimit ?? MEMLIMIT_DEFAULT);

  assertPositiveSafeInteger(opslimit, "opslimit");
  assertPositiveSafeInteger(memlimit, "memlimit");

  const salt = opts?.salt ?? crypto.randomBytes(crypto.PWHASH_SALTBYTES());
  const keylen = crypto.AEAD_KEYBYTES();
  const key = crypto.pwhash(keylen, masterPassword, salt, opslimit, memlimit);
  const nonce = opts?.nonce ?? crypto.randomBytes(crypto.AEAD_NONCEBYTES());
  const aad = makeV1AadBytes();
  const plaintext = crypto.toBytesUtf8(JSON.stringify(payload));
  const ciphertextCombined = crypto.aeadEncrypt(plaintext, aad, nonce, key);

  assertPositiveSafeInteger(keylen, "keylen");
  if (salt.length !== crypto.PWHASH_SALTBYTES()) {
    throw new Error(`[VaultV1] invalid salt length: ${salt.length}`);
  }
  if (nonce.length !== crypto.AEAD_NONCEBYTES()) {
    throw new Error(`[VaultV1] invalid nonce length: ${nonce.length}`);
  }

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

  if (vault.v !== 1) {
    throw new Error(`Unsupported vault version: ${String((vault as { v?: unknown }).v)}`);
  }

  assertPositiveSafeInteger(vault.kdf.opslimit, "opslimit");
  assertPositiveSafeInteger(vault.kdf.memlimit, "memlimit");
  assertPositiveSafeInteger(vault.kdf.keylen, "keylen");

  const salt = crypto.fromBase64(vault.kdf.salt_b64);
  const nonce = crypto.fromBase64(vault.aead.nonce_b64);
  const aad = crypto.fromBase64(vault.aead.aad_b64);
  const expectedAad = makeV1AadBytes();
  const ciphertext = crypto.fromBase64(vault.ct_b64);

  if (
    aad.length !== expectedAad.length ||
    aad.some((value, index) => value !== expectedAad[index])
  ) {
    throw new Error("[VaultV1] unsupported AAD metadata");
  }

  const key = crypto.pwhash(
    vault.kdf.keylen,
    masterPassword,
    salt,
    vault.kdf.opslimit,
    vault.kdf.memlimit,
  );

  const plaintextBytes = crypto.aeadDecrypt(ciphertext, aad, nonce, key);
  const plaintext = crypto.fromBytesUtf8(plaintextBytes);
  return JSON.parse(plaintext) as VaultDataType;
}

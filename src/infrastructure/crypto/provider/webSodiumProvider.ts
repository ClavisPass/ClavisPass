import sodium from "libsodium-wrappers-sumo";
import type { CryptoProvider } from "./CryptoProvider";

const te = new TextEncoder();
const td = new TextDecoder();

function ensureLen(name: string, b: Uint8Array, expected: number) {
  if (b.length !== expected) {
    throw new Error(`[webSodiumProvider] bad ${name} length: ${b.length} (expected ${expected})`);
  }
}

// Hardcode constants to match RN provider (avoid “variant” drift)
const XCHACHA20POLY1305_KEYBYTES = 32;
const XCHACHA20POLY1305_NPUBBYTES = 24;
const PWHASH_SALTBYTES = 16;

export const webSodiumProvider: CryptoProvider = {
  ready: async () => {
    await sodium.ready;
  },

  // UTF8
  toBytesUtf8: (input: string) => te.encode(input),
  fromBytesUtf8: (input: Uint8Array) => td.decode(input),

  // Base64 (Vault wire format)
  toBase64: (input: Uint8Array) =>
    sodium.to_base64(input, sodium.base64_variants.ORIGINAL),
  fromBase64: (input: string) =>
    sodium.from_base64(String(input), sodium.base64_variants.ORIGINAL),

  // RNG
  randomBytes: (size: number) => {
    const out = sodium.randombytes_buf(Number(size));
    if (!(out instanceof Uint8Array)) {
      // wrappers always returns Uint8Array, but keep it strict
      return new Uint8Array(out as any);
    }
    if (out.length !== size) {
      throw new Error(
        `[webSodiumProvider] randombytes_buf returned ${out.length} bytes (expected ${size})`
      );
    }
    return out;
  },

  // KDF: Argon2id via crypto_pwhash (byte-identical)
  pwhash: (outLen, password, salt, opslimit, memlimit) => {
    ensureLen("salt", salt, PWHASH_SALTBYTES);

    const passBytes = te.encode(String(password));

    // critical: ensure these are numbers (not stringy)
    const out = Number(outLen);
    const ops = Number(opslimit);
    const mem = Number(memlimit);

    const key = sodium.crypto_pwhash(
      out,
      passBytes,
      salt,
      ops,
      mem,
      sodium.crypto_pwhash_ALG_ARGON2ID13
    );

    if (!(key instanceof Uint8Array)) return new Uint8Array(key as any);
    if (key.length !== outLen) {
      throw new Error(`[webSodiumProvider] pwhash returned ${key.length} bytes (expected ${outLen})`);
    }
    return key;
  },

  // AEAD: XChaCha20-Poly1305 IETF
  // Interface order: (plaintext, aad, nonce, key)
  aeadEncrypt: (plaintext, aad, nonce, key) => {
    ensureLen("nonce", nonce, XCHACHA20POLY1305_NPUBBYTES);
    ensureLen("key", key, XCHACHA20POLY1305_KEYBYTES);

    const ct = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
      plaintext,
      aad,
      null,
      nonce,
      key
    );

    return ct instanceof Uint8Array ? ct : new Uint8Array(ct as any);
  },

  // Interface order: (ciphertextCombined, aad, nonce, key)
  aeadDecrypt: (ciphertextCombined, aad, nonce, key) => {
    ensureLen("nonce", nonce, XCHACHA20POLY1305_NPUBBYTES);
    ensureLen("key", key, XCHACHA20POLY1305_KEYBYTES);

    const pt = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
      null,
      ciphertextCombined,
      aad,
      nonce,
      key
    );

    return pt instanceof Uint8Array ? pt : new Uint8Array(pt as any);
  },

  // constants (fixed)
  PWHASH_SALTBYTES: () => PWHASH_SALTBYTES,
  AEAD_KEYBYTES: () => XCHACHA20POLY1305_KEYBYTES,
  AEAD_NONCEBYTES: () => XCHACHA20POLY1305_NPUBBYTES,
};

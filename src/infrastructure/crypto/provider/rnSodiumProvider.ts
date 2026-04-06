import * as sodium from "react-native-sodium-jsi";
import { fromByteArray, toByteArray } from "base64-js";
import type { CryptoProvider } from "./CryptoProvider";

const te = new TextEncoder();
const td = new TextDecoder();

const XCHACHA20POLY1305_KEYBYTES =
  sodium.constants.crypto_aead_xchacha20poly1305_IETF_KEYBYTES ?? 32;
const XCHACHA20POLY1305_NPUBBYTES =
  sodium.constants.crypto_aead_xchacha20poly1305_IETF_NPUBBYTES ?? 24;
const PWHASH_SALTBYTES = sodium.constants.crypto_pwhash_SALTBYTES ?? 16;
const ALG_ARGON2ID13 = sodium.constants.crypto_pwhash_ALG_ARGON2ID13 ?? 2;

function bytesToHex(u8: Uint8Array): string {
  let out = "";
  for (let i = 0; i < u8.length; i += 1) {
    out += u8[i]!.toString(16).padStart(2, "0");
  }
  return out;
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;

  if (clean.length % 2 !== 0 || !/^[0-9a-fA-F]*$/.test(clean)) {
    throw new Error("[rnSodiumProvider] invalid hex string");
  }

  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function ensureLen(name: string, value: Uint8Array, expected: number) {
  if (value.length !== expected) {
    throw new Error(
      `[rnSodiumProvider] bad ${name} length: ${value.length} (expected ${expected})`,
    );
  }
}

export const rnSodiumProvider: CryptoProvider = {
  ready: async () => {},

  toBytesUtf8: (value: string) => te.encode(value),
  fromBytesUtf8: (value: Uint8Array) => td.decode(value),

  toBase64: (value: Uint8Array) => fromByteArray(value),
  fromBase64: (value: string) => toByteArray(value),

  randomBytes: (size: number): Uint8Array => {
    const raw = sodium.randombytes_buf(Number(size));
    const out = hexToBytes(raw);
    if (out.length !== size) {
      throw new Error(
        `[rnSodiumProvider] randombytes_buf returned ${out.length} bytes (expected ${size})`,
      );
    }
    return out;
  },

  pwhash: (
    outLen: number,
    password: string,
    salt: Uint8Array,
    opslimit: number,
    memlimit: number,
  ): Uint8Array => {
    ensureLen("salt", salt, PWHASH_SALTBYTES);

    const raw = sodium.crypto_pwhash(
      Number(outLen),
      String(password),
      bytesToHex(salt),
      Number(opslimit),
      Number(memlimit),
      ALG_ARGON2ID13,
    );

    const key = hexToBytes(raw);
    if (key.length !== outLen) {
      throw new Error(
        `[rnSodiumProvider] crypto_pwhash wrong length: ${key.length} (expected ${outLen})`,
      );
    }
    return key;
  },

  aeadEncrypt: (
    plaintext: Uint8Array,
    aad: Uint8Array,
    nonce: Uint8Array,
    key: Uint8Array,
  ): Uint8Array => {
    ensureLen("nonce", nonce, XCHACHA20POLY1305_NPUBBYTES);
    ensureLen("key", key, XCHACHA20POLY1305_KEYBYTES);

    const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
      td.decode(plaintext),
      bytesToHex(nonce),
      bytesToHex(key),
      td.decode(aad),
    );

    return toByteArray(ciphertext);
  },

  aeadDecrypt: (
    ciphertextCombined: Uint8Array,
    aad: Uint8Array,
    nonce: Uint8Array,
    key: Uint8Array,
  ): Uint8Array => {
    ensureLen("nonce", nonce, XCHACHA20POLY1305_NPUBBYTES);
    ensureLen("key", key, XCHACHA20POLY1305_KEYBYTES);

    const plaintext = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
      fromByteArray(ciphertextCombined),
      bytesToHex(nonce),
      bytesToHex(key),
      td.decode(aad),
    );

    return te.encode(plaintext);
  },

  PWHASH_SALTBYTES: () => PWHASH_SALTBYTES,
  AEAD_KEYBYTES: () => XCHACHA20POLY1305_KEYBYTES,
  AEAD_NONCEBYTES: () => XCHACHA20POLY1305_NPUBBYTES,
};

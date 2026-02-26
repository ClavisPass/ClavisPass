import * as sodium from "react-native-sodium-jsi";
import { fromByteArray, toByteArray } from "base64-js";

const te = new TextEncoder();
const td = new TextDecoder();

const XCHACHA20POLY1305_KEYBYTES = 32;
const XCHACHA20POLY1305_NPUBBYTES = 24;
const PWHASH_SALTBYTES = 16;
const ALG_ARGON2ID13 = 2;

// ---------- enc helpers ----------
function bytesToBase64(b: Uint8Array): string {
  return fromByteArray(b);
}
function base64ToBytes(s: string): Uint8Array {
  return toByteArray(s);
}

function isHexString(s: string): boolean {
  const clean = s.startsWith("0x") ? s.slice(2) : s;
  return clean.length % 2 === 0 && /^[0-9a-fA-F]+$/.test(clean);
}
function bytesToHex(u8: Uint8Array): string {
  let out = "";
  for (let i = 0; i < u8.length; i++) out += u8[i]!.toString(16).padStart(2, "0");
  return out;
}
function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (!isHexString(clean)) throw new Error("[rnSodiumProvider] invalid hex string");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function ensureLen(name: string, b: Uint8Array, expected: number) {
  if (!(b instanceof Uint8Array)) {
    throw new Error(`[rnSodiumProvider] bad ${name} type: ${Object.prototype.toString.call(b)}`);
  }
  if (b.length !== expected) {
    throw new Error(`[rnSodiumProvider] bad ${name} length: ${b.length} (expected ${expected})`);
  }
}

function normalizeBytes(x: unknown, ctx = "unknown"): Uint8Array {
  if (x instanceof Uint8Array) return x;
  if (x instanceof ArrayBuffer) return new Uint8Array(x);

  if (x && typeof x === "object" && ArrayBuffer.isView(x as any)) {
    const v = x as ArrayBufferView;
    return new Uint8Array(v.buffer, v.byteOffset, v.byteLength);
  }

  if (typeof x === "string") {
    // Many JSI funcs return either hex or base64 strings.
    if (isHexString(x)) return hexToBytes(x);
    try {
      return base64ToBytes(x);
    } catch {
      throw new Error(`[rnSodiumProvider] ${ctx}: string output is neither hex nor base64`);
    }
  }

  if (x && typeof x === "object" && typeof (x as any).bytes === "string") {
    return normalizeBytes((x as any).bytes, ctx);
  }

  throw new Error(`[rnSodiumProvider] ${ctx}: unexpected output type`);
}

function bytesEq(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

// ---------- pwhash negotiation ----------
type PwhashMode =
  | { pass: "raw"; salt: "hex" | "base64" }
  | { pass: "hex"; salt: "hex" | "base64" };

let cachedPwhashMode: PwhashMode | null = null;

function pwhashImpl(
  fn: any,
  mode: PwhashMode,
  outLen: number,
  password: string,
  salt: Uint8Array,
  ops: number,
  mem: number,
): Uint8Array {
  const passArg =
    mode.pass === "raw" ? String(password) : bytesToHex(te.encode(String(password)));
  const saltArg =
    mode.salt === "hex" ? bytesToHex(salt) : bytesToBase64(salt);

  const raw = fn(outLen, passArg, saltArg, ops, mem, ALG_ARGON2ID13);
  if (raw == null || raw === false) throw new Error("crypto_pwhash failed (null/false)");
  const key = normalizeBytes(raw, "crypto_pwhash");
  if (key.length !== outLen) throw new Error(`crypto_pwhash wrong length: ${key.length}`);
  return key;
}

// ---------- AEAD negotiation ----------
type AeadMode =
  | { enc: "hex" | "base64"; arity: 4; order: "m_ad_n_k" | "m_n_k_ad" }
  | { enc: "hex" | "base64"; arity: 5; order: "m_ad_n_k" }; // libsodium-like (m,ad,nsec,npub,k) in some wrappers

let cachedAeadMode: AeadMode | null = null;

function encStr(enc: "hex" | "base64", b: Uint8Array): string {
  return enc === "hex" ? bytesToHex(b) : bytesToBase64(b);
}

function aeadEncryptTry(
  fnEnc: any,
  mode: AeadMode,
  m: Uint8Array,
  ad: Uint8Array,
  npub: Uint8Array,
  k: Uint8Array,
): Uint8Array {
  const ms = encStr(mode.enc, m);
  const ads = encStr(mode.enc, ad);
  const ns = encStr(mode.enc, npub);
  const ks = encStr(mode.enc, k);
  const nsec = ""; // NEVER null in many JSI builds

  let raw: any;
  if (mode.arity === 4) {
    raw = mode.order === "m_ad_n_k" ? fnEnc(ms, ads, ns, ks) : fnEnc(ms, ns, ks, ads);
  } else {
    // 5 args: (m, ad, nsec, npub, k)
    raw = fnEnc(ms, ads, nsec, ns, ks);
  }

  if (raw == null || raw === false) throw new Error("aead_encrypt returned null/false");
  return normalizeBytes(raw, "aead_encrypt");
}

function aeadDecryptTry(
  fnDec: any,
  mode: AeadMode,
  c: Uint8Array,
  ad: Uint8Array,
  npub: Uint8Array,
  k: Uint8Array,
): Uint8Array | null {
  const cs = encStr(mode.enc, c);
  const ads = encStr(mode.enc, ad);
  const ns = encStr(mode.enc, npub);
  const ks = encStr(mode.enc, k);
  const nsec = "";

  let raw: any;
  try {
    if (mode.arity === 4) {
      raw = mode.order === "m_ad_n_k" ? fnDec(cs, ads, ns, ks) : fnDec(cs, ns, ks, ads);
    } else {
      // 5 args: (nsec, c, ad, npub, k) OR sometimes (nsec,c,ad,npub,k) exactly
      raw = fnDec(nsec, cs, ads, ns, ks);
    }
  } catch (e) {
    return null;
  }

  if (raw == null || raw === false) return null;
  return normalizeBytes(raw, "aead_decrypt");
}

export const rnSodiumProvider = {
  ready: async () => {},

  // UTF8
  toBytesUtf8: (s: string) => te.encode(s),
  fromBytesUtf8: (b: Uint8Array) => td.decode(b),

  // Base64 (Vault JSON only)
  toBase64: (b: Uint8Array) => fromByteArray(b),
  fromBase64: (s: string) => toByteArray(s),

  AEAD_NONCEBYTES: () => XCHACHA20POLY1305_NPUBBYTES,
  AEAD_KEYBYTES: () => XCHACHA20POLY1305_KEYBYTES,
  PWHASH_SALTBYTES: () => PWHASH_SALTBYTES,

  randomBytes: (size: number): Uint8Array => {
    const fn = (sodium as any).randombytes_buf;
    if (typeof fn !== "function") throw new Error("[rnSodiumProvider] randombytes_buf not available");
    const out = normalizeBytes(fn(Number(size)), "randombytes_buf");
    if (out.length !== size) {
      throw new Error(`[rnSodiumProvider] randombytes_buf returned ${out.length} bytes (expected ${size})`);
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

    const fn = (sodium as any).crypto_pwhash;
    if (typeof fn !== "function") throw new Error("[rnSodiumProvider] crypto_pwhash not available");

    const out = Number(outLen);
    const ops = Number(opslimit);
    const mem = Number(memlimit);

    const candidates: PwhashMode[] = cachedPwhashMode
      ? [cachedPwhashMode]
      : [
          { pass: "raw", salt: "hex" },
          { pass: "hex", salt: "hex" },
          { pass: "raw", salt: "base64" },
          { pass: "hex", salt: "base64" },
        ];

    let lastErr: any = null;
    for (const mode of candidates) {
      try {
        const key = pwhashImpl(fn, mode, out, password, salt, ops, mem);
        cachedPwhashMode = mode;
        return key;
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
  },

  aeadEncrypt: (plaintext: Uint8Array, aad: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array => {
    ensureLen("nonce", nonce, XCHACHA20POLY1305_NPUBBYTES);
    ensureLen("key", key, XCHACHA20POLY1305_KEYBYTES);

    const fnEnc = (sodium as any).crypto_aead_xchacha20poly1305_ietf_encrypt;
    const fnDec = (sodium as any).crypto_aead_xchacha20poly1305_ietf_decrypt;
    if (typeof fnEnc !== "function") throw new Error("[rnSodiumProvider] aead encrypt not available");
    if (typeof fnDec !== "function") throw new Error("[rnSodiumProvider] aead decrypt not available");

    const candidates: AeadMode[] = cachedAeadMode
      ? [cachedAeadMode]
      : [
          { enc: "base64", arity: 4, order: "m_ad_n_k" },
          { enc: "base64", arity: 4, order: "m_n_k_ad" },
          { enc: "hex", arity: 4, order: "m_ad_n_k" },
          { enc: "hex", arity: 4, order: "m_n_k_ad" },
          { enc: "base64", arity: 5, order: "m_ad_n_k" },
          { enc: "hex", arity: 5, order: "m_ad_n_k" },
        ];

    let lastErr: any = null;

    for (const mode of candidates) {
      try {
        const ct = aeadEncryptTry(fnEnc, mode, plaintext, aad, nonce, key);

        // Self-check: decrypt immediately, must match plaintext
        const pt = aeadDecryptTry(fnDec, mode, ct, aad, nonce, key);
        if (!pt) throw new Error("self-check decrypt failed");
        if (!bytesEq(pt, plaintext)) throw new Error("self-check plaintext mismatch");

        cachedAeadMode = mode;
        return ct;
      } catch (e) {
        lastErr = e;
      }
    }

    throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
  },

  aeadDecrypt: (ciphertext: Uint8Array, aad: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array => {
    ensureLen("nonce", nonce, XCHACHA20POLY1305_NPUBBYTES);
    ensureLen("key", key, XCHACHA20POLY1305_KEYBYTES);

    

    const fnDec = (sodium as any).crypto_aead_xchacha20poly1305_ietf_decrypt;
    if (typeof fnDec !== "function") throw new Error("[rnSodiumProvider] aead decrypt not available");

    const candidates: AeadMode[] = cachedAeadMode
      ? [cachedAeadMode]
      : [
          { enc: "base64", arity: 4, order: "m_ad_n_k" },
          { enc: "base64", arity: 4, order: "m_n_k_ad" },
          { enc: "hex", arity: 4, order: "m_ad_n_k" },
          { enc: "hex", arity: 4, order: "m_n_k_ad" },
          { enc: "base64", arity: 5, order: "m_ad_n_k" },
          { enc: "hex", arity: 5, order: "m_ad_n_k" },
        ];

    let lastErr: any = null;

    for (const mode of candidates) {
      const pt = aeadDecryptTry(fnDec, mode, ciphertext, aad, nonce, key);
      if (pt) {
        cachedAeadMode = mode;
        return pt;
      }
      lastErr = new Error("[rnSodiumProvider] auth failed");
    }

    throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
  },
} as const;
import * as sodium from "react-native-sodium-jsi";
import { fromByteArray, toByteArray } from "base64-js";

const te = new TextEncoder();
const td = new TextDecoder();

// libsodium Konstanten (stabil)
const XCHACHA20POLY1305_KEYBYTES = 32;
const XCHACHA20POLY1305_NPUBBYTES = 24;
const PWHASH_SALTBYTES = 16;

// libsodium crypto_pwhash_ALG_ARGON2ID13 = 2
const ALG_ARGON2ID13 = 2;

// ---------- base64 helpers (für Vault JSON) ----------
function bytesToBase64(b: Uint8Array): string {
  return fromByteArray(b);
}
function base64ToBytes(b64: string): Uint8Array {
  return toByteArray(b64);
}

// ---------- hex helpers (für JSI calls) ----------
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
  if (!isHexString(clean)) throw new Error("Invalid hex string");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

/**
 * react-native-sodium-jsi gibt häufig HEX-Strings zurück.
 * Wichtig: HEX zuerst versuchen, sonst decodest du HEX als base64 → falsche Längen (z.B. 24 statt 16).
 */
function normalizeBytes(x: unknown, ctx: string): Uint8Array {
  if (x instanceof Uint8Array) return x;
  if (x instanceof ArrayBuffer) return new Uint8Array(x);

  if (typeof x === "string") {
    if (isHexString(x)) return hexToBytes(x);
    return base64ToBytes(x);
  }

  if (Array.isArray(x) && x.every((n) => typeof n === "number")) {
    return new Uint8Array(x as number[]);
  }

  throw new Error(`[rnSodiumProvider] ${ctx}: unexpected output type`);
}

function ensureLen(name: string, b: Uint8Array, expected: number) {
  if (b.length !== expected) {
    throw new Error(`[rnSodiumProvider] bad ${name} length: ${b.length} (expected ${expected})`);
  }
}

// ---------- pwhash caller cache ----------
type PwhashCaller = (
  outLen: number,
  pass: string,
  salt: Uint8Array,
  opslimit: number,
  memlimit: number
) => Uint8Array;

let cachedPwhashCaller: PwhashCaller | null = null;

function buildPwhashCaller(): PwhashCaller {
  const fn = (sodium as any).crypto_pwhash;
  if (typeof fn !== "function") {
    throw new Error("[rnSodiumProvider] crypto_pwhash is not available");
  }

  return (outLen, password, salt, opslimit, memlimit) => {
    const passStr = String(password);
    const saltHex = bytesToHex(salt);
    const ops = Number(opslimit);
    const mem = Number(memlimit);
    const out = Number(outLen);

    // Diese Library will bei dir offenbar sehr oft String-Inputs.
    // Wir probieren deshalb NUR String-Varianten.
    const candidates: any[][] = [
      // (outLen, pass, saltHex, ops, mem, alg)
      [out, passStr, saltHex, ops, mem, ALG_ARGON2ID13],
      // outLen am Ende
      [passStr, saltHex, ops, mem, out, ALG_ARGON2ID13],
      // ohne alg
      [out, passStr, saltHex, ops, mem],
      [passStr, saltHex, ops, mem, out],
    ];

    let lastErr: any = null;

    for (const args of candidates) {
      try {
        const raw = fn(...args);
        const u8 = normalizeBytes(raw, "crypto_pwhash");
        if (u8.length === outLen) {
          // cache exact signature we just used
          const signature = args.map((v) => typeof v);
          cachedPwhashCaller = (o, p, s, op, me) => {
            const P = String(p);
            const S = bytesToHex(s);
            const OP = Number(op);
            const ME = Number(me);
            const O = Number(o);

            // rebuild by same “shape”
            const rebuilt = args.slice();
            // replace values by position
            for (let i = 0; i < rebuilt.length; i++) {
              if (typeof rebuilt[i] === "number") {
                // heuristic: outLen matches out, ops matches ops, mem matches mem
                if (rebuilt[i] === out) rebuilt[i] = O;
                else if (rebuilt[i] === ops) rebuilt[i] = OP;
                else if (rebuilt[i] === mem) rebuilt[i] = ME;
              } else if (typeof rebuilt[i] === "string") {
                if (rebuilt[i] === passStr) rebuilt[i] = P;
                else if (rebuilt[i] === saltHex) rebuilt[i] = S;
              }
            }

            const r = fn(...rebuilt);
            const outU8 = normalizeBytes(r, "crypto_pwhash");
            if (outU8.length !== o) {
              throw new Error("[rnSodiumProvider] crypto_pwhash returned wrong length after caching");
            }
            return outU8;
          };

          return u8;
        }
      } catch (e) {
        lastErr = e;
      }
    }

    throw lastErr ?? new Error("[rnSodiumProvider] crypto_pwhash failed");
  };
}

export const rnSodiumProvider = {
  ready: async () => {
    // JSI module: usually immediately available
  },

  // ---------- UTF8 ----------
  toBytesUtf8: (input: string): Uint8Array => te.encode(input),
  fromBytesUtf8: (input: Uint8Array): string => td.decode(input),

  // ---------- Base64 (Vault JSON) ----------
  toBase64: (input: Uint8Array): string => bytesToBase64(input),
  fromBase64: (input: string): Uint8Array => base64ToBytes(String(input)),

  // ---------- RNG ----------
  randomBytes: (size: number): Uint8Array => {
    const fn = (sodium as any).randombytes_buf;
    if (typeof fn !== "function") {
      throw new Error("[rnSodiumProvider] randombytes_buf is not available");
    }

    const raw = fn(Number(size));
    const u8 = normalizeBytes(raw, "randombytes_buf");

    if (u8.length !== size) {
      throw new Error(
        `[rnSodiumProvider] randombytes_buf returned ${u8.length} bytes (expected ${size})`
      );
    }
    return u8;
  },

  // ---------- constants ----------
  AEAD_NONCEBYTES: () => XCHACHA20POLY1305_NPUBBYTES,
  AEAD_KEYBYTES: () => XCHACHA20POLY1305_KEYBYTES,
  PWHASH_SALTBYTES: () => PWHASH_SALTBYTES,

  // ---------- KDF (Argon2id) ----------
  pwhash: (
    outLen: number,
    password: string,
    salt: Uint8Array,
    opslimit: number,
    memlimit: number
  ): Uint8Array => {
    ensureLen("salt", salt, PWHASH_SALTBYTES);

    if (!cachedPwhashCaller) cachedPwhashCaller = buildPwhashCaller();
    return cachedPwhashCaller(outLen, password, salt, opslimit, memlimit);
  },

  // ---------- AEAD (XChaCha20-Poly1305 IETF) ----------
  // IMPORTANT: react-native-sodium-jsi in deiner Umgebung will KEIN "nsec=null".
  // Nutze 4-Arg Varianten.
  aeadEncrypt: (
    plaintext: Uint8Array,
    aad: Uint8Array,
    nonce: Uint8Array,
    key: Uint8Array
  ): Uint8Array => {
    ensureLen("nonce", nonce, XCHACHA20POLY1305_NPUBBYTES);
    ensureLen("key", key, XCHACHA20POLY1305_KEYBYTES);

    const fn = (sodium as any).crypto_aead_xchacha20poly1305_ietf_encrypt;
    if (typeof fn !== "function") {
      throw new Error("[rnSodiumProvider] aead encrypt is not available");
    }

    const pt = bytesToHex(plaintext);
    const a = bytesToHex(aad);
    const n = bytesToHex(nonce);
    const k = bytesToHex(key);

    // Try the two most common 4-arg layouts
    try {
      const raw = fn(pt, a, n, k);
      return normalizeBytes(raw, "aead_encrypt");
    } catch {
      const raw = fn(pt, n, k, a);
      return normalizeBytes(raw, "aead_encrypt");
    }
  },

  aeadDecrypt: (
    ciphertextCombined: Uint8Array,
    aad: Uint8Array,
    nonce: Uint8Array,
    key: Uint8Array
  ): Uint8Array => {
    ensureLen("nonce", nonce, XCHACHA20POLY1305_NPUBBYTES);
    ensureLen("key", key, XCHACHA20POLY1305_KEYBYTES);

    const fn = (sodium as any).crypto_aead_xchacha20poly1305_ietf_decrypt;
    if (typeof fn !== "function") {
      throw new Error("[rnSodiumProvider] aead decrypt is not available");
    }

    const ct = bytesToHex(ciphertextCombined);
    const a = bytesToHex(aad);
    const n = bytesToHex(nonce);
    const k = bytesToHex(key);

    try {
      const raw = fn(ct, a, n, k);
      return normalizeBytes(raw, "aead_decrypt");
    } catch {
      const raw = fn(ct, n, k, a);
      return normalizeBytes(raw, "aead_decrypt");
    }
  },
} as const;

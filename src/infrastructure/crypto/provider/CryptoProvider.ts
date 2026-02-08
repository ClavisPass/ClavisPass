export interface CryptoProvider {
  ready(): Promise<void>;

  // utf8
  toBytesUtf8(s: string): Uint8Array;
  fromBytesUtf8(b: Uint8Array): string;

  // base64
  toBase64(bytes: Uint8Array): string;
  fromBase64(b64: string): Uint8Array;

  // rng
  randomBytes(len: number): Uint8Array;

  // kdf
  pwhash(outLen: number, password: string, salt: Uint8Array, opslimit: number, memlimit: number): Uint8Array;

  // aead
  aeadEncrypt(plaintext: Uint8Array, aad: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array;
  aeadDecrypt(ciphertextCombined: Uint8Array, aad: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array;

  // constants
  PWHASH_SALTBYTES(): number;
  AEAD_KEYBYTES(): number;
  AEAD_NONCEBYTES(): number;
}

const te = new TextEncoder();

export const V2_KEYWRAP_AAD_OBJECT = {
  v: 2,
  purpose: "vault-key-wrap",
  kdf: "argon2id",
  aead: "xchacha20poly1305-ietf",
} as const;

export const V2_PAYLOAD_AAD_OBJECT = {
  v: 2,
  purpose: "vault-payload",
  aead: "xchacha20poly1305-ietf",
} as const;

export function makeV2KeywrapAadBytes(): Uint8Array {
  return te.encode(JSON.stringify(V2_KEYWRAP_AAD_OBJECT));
}

export function makeV2PayloadAadBytes(): Uint8Array {
  return te.encode(JSON.stringify(V2_PAYLOAD_AAD_OBJECT));
}

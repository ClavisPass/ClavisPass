/**
 * AAD (Additional Authenticated Data) ist NICHT geheim.
 * Es sorgt dafür, dass Header-Metadaten nicht unbemerkt manipuliert werden können.
 *
 * Muss bei encrypt/decrypt exakt identisch erzeugt werden.
 * Deswegen: zentral hier, minimal und stabil halten.
 */

const te = new TextEncoder();

export const V1_AAD_OBJECT = {
  v: 1,
  kdf: "argon2id",
  aead: "xchacha20poly1305-ietf",
} as const;

export function makeV1AadBytes(): Uint8Array {
  return te.encode(JSON.stringify(V1_AAD_OBJECT));
}

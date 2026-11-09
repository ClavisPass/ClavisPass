import type { CryptoProvider } from "../provider/CryptoProvider";
import type { RecoverySlot } from "./VaultV3Schema";

const KEY_BYTES = 32;

export function generateRecoveryKey(crypto: CryptoProvider): string {
  const bytes = crypto.randomBytes(KEY_BYTES);
  try {
    const hex = Array.from(bytes, (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
    return hex.toUpperCase().match(/.{8}/g)!.join("-");
  } finally {
    bytes.fill(0);
  }
}

function decodeRecoveryKey(value: string): Uint8Array {
  const hex = value.replace(/[\s-]/g, "");
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) throw new Error("Invalid recovery key");
  return Uint8Array.from({ length: KEY_BYTES }, (_, i) =>
    parseInt(hex.slice(i * 2, i * 2 + 2), 16),
  );
}

const recoveryAad = (crypto: CryptoProvider) =>
  crypto.toBytesUtf8("clavispass:v3:recovery-key-wrap");

export function wrapRecoveryKey(
  crypto: CryptoProvider,
  recoveryKey: string,
  dataKey: Uint8Array,
): RecoverySlot {
  const key = decodeRecoveryKey(recoveryKey);
  const nonce = crypto.randomBytes(crypto.AEAD_NONCEBYTES());
  // The native provider accepts UTF-8 plaintext; encode the binary key first.
  const plaintext = crypto.toBytesUtf8(crypto.toBase64(dataKey));
  try {
    return {
      nonce_b64: crypto.toBase64(nonce),
      wrapped_key_b64: crypto.toBase64(
        crypto.aeadEncrypt(plaintext, recoveryAad(crypto), nonce, key),
      ),
    };
  } finally {
    key.fill(0);
    plaintext.fill(0);
  }
}

export function unwrapRecoveryKey(
  crypto: CryptoProvider,
  recoveryKey: string,
  slot: RecoverySlot,
): Uint8Array {
  const key = decodeRecoveryKey(recoveryKey);
  let plaintext: Uint8Array | undefined;
  try {
    const nonce = crypto.fromBase64(slot.nonce_b64);
    if (nonce.length !== crypto.AEAD_NONCEBYTES())
      throw new Error("Invalid recovery nonce");
    plaintext = crypto.aeadDecrypt(
      crypto.fromBase64(slot.wrapped_key_b64),
      recoveryAad(crypto),
      nonce,
      key,
    );
    const dataKey = crypto.fromBase64(crypto.fromBytesUtf8(plaintext));
    if (dataKey.length !== crypto.AEAD_KEYBYTES()) {
      dataKey.fill(0);
      throw new Error("Invalid recovered data key");
    }
    return dataKey;
  } finally {
    key.fill(0);
    plaintext?.fill(0);
  }
}

// Bind the version and recovery slot to the ciphertext to detect stripping or substitution.
export function makeV3PayloadAad(
  crypto: CryptoProvider,
  recovery?: RecoverySlot,
): Uint8Array {
  return crypto.toBytesUtf8(
    JSON.stringify({
      v: 3,
      purpose: "vault-payload",
      aead: "xchacha20poly1305-ietf",
      recovery: recovery
        ? {
            nonce_b64: recovery.nonce_b64,
            wrapped_key_b64: recovery.wrapped_key_b64,
          }
        : null,
    }),
  );
}

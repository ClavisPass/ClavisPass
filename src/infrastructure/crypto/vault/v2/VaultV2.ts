import type VaultDataType from "../../../../features/vault/model/VaultDataType";
import type { CryptoProvider } from "../../provider/CryptoProvider";
import { VaultCryptoSession } from "../VaultCryptoSession";
import { makeV2KeywrapAadBytes, makeV2PayloadAadBytes } from "./aad";
import type { VaultV2 } from "./VaultV2Schema";

const OPSLIMIT_DEFAULT = 3;
const MEMLIMIT_DEFAULT = 64 * 1024 * 1024;

function assertPositiveSafeInteger(value: number, label: string) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`[VaultV2] invalid ${label}: ${String(value)}`);
  }
}

function assertBytesEqual(
  actual: Uint8Array,
  expected: Uint8Array,
  label: string,
) {
  if (
    actual.length !== expected.length ||
    actual.some((value, index) => value !== expected[index])
  ) {
    throw new Error(`[VaultV2] unsupported ${label} metadata`);
  }
}

function assertV2Lengths(crypto: CryptoProvider, vault: VaultV2) {
  assertPositiveSafeInteger(vault.kdf.opslimit, "opslimit");
  assertPositiveSafeInteger(vault.kdf.memlimit, "memlimit");
  assertPositiveSafeInteger(vault.kdf.keylen, "keylen");

  const salt = crypto.fromBase64(vault.kdf.salt_b64);
  const keywrapNonce = crypto.fromBase64(vault.keywrap.nonce_b64);
  const payloadNonce = crypto.fromBase64(vault.aead.nonce_b64);

  if (salt.length !== crypto.PWHASH_SALTBYTES()) {
    throw new Error(`[VaultV2] invalid salt length: ${salt.length}`);
  }
  if (keywrapNonce.length !== crypto.AEAD_NONCEBYTES()) {
    throw new Error(
      `[VaultV2] invalid keywrap nonce length: ${keywrapNonce.length}`,
    );
  }
  if (payloadNonce.length !== crypto.AEAD_NONCEBYTES()) {
    throw new Error(
      `[VaultV2] invalid payload nonce length: ${payloadNonce.length}`,
    );
  }
}

function createWrappedDataKey(
  crypto: CryptoProvider,
  masterPassword: string,
  dataKey: Uint8Array,
  opts?: {
    opslimit?: number;
    memlimit?: number;
    salt?: Uint8Array;
    keywrapNonce?: Uint8Array;
  },
): { kdf: VaultV2["kdf"]; keywrap: VaultV2["keywrap"] } {
  const opslimit = Math.trunc(opts?.opslimit ?? OPSLIMIT_DEFAULT);
  const memlimit = Math.trunc(opts?.memlimit ?? MEMLIMIT_DEFAULT);

  assertPositiveSafeInteger(opslimit, "opslimit");
  assertPositiveSafeInteger(memlimit, "memlimit");

  const salt = opts?.salt ?? crypto.randomBytes(crypto.PWHASH_SALTBYTES());
  if (salt.length !== crypto.PWHASH_SALTBYTES()) {
    throw new Error(`[VaultV2] invalid salt length: ${salt.length}`);
  }

  const wrappingKeyLen = crypto.AEAD_KEYBYTES();
  const wrappingKey = crypto.pwhash(
    wrappingKeyLen,
    masterPassword,
    salt,
    opslimit,
    memlimit,
  );
  const keywrapNonce =
    opts?.keywrapNonce ?? crypto.randomBytes(crypto.AEAD_NONCEBYTES());
  if (keywrapNonce.length !== crypto.AEAD_NONCEBYTES()) {
    throw new Error(
      `[VaultV2] invalid keywrap nonce length: ${keywrapNonce.length}`,
    );
  }

  const keywrapAad = makeV2KeywrapAadBytes();
  const dataKeyText = crypto.toBytesUtf8(crypto.toBase64(dataKey));
  const wrappedDataKey = crypto.aeadEncrypt(
    dataKeyText,
    keywrapAad,
    keywrapNonce,
    wrappingKey,
  );

  return {
    kdf: {
      alg: "argon2id",
      opslimit,
      memlimit,
      salt_b64: crypto.toBase64(salt),
      keylen: wrappingKeyLen,
    },
    keywrap: {
      alg: "xchacha20poly1305-ietf",
      nonce_b64: crypto.toBase64(keywrapNonce),
      aad_b64: crypto.toBase64(keywrapAad),
      wrapped_key_b64: crypto.toBase64(wrappedDataKey),
    },
  };
}

export async function encryptVaultV2(
  crypto: CryptoProvider,
  masterPassword: string,
  payload: VaultDataType,
  opts?: {
    forceRewrap?: boolean;
    opslimit?: number;
    memlimit?: number;
    salt?: Uint8Array;
    keywrapNonce?: Uint8Array;
    payloadNonce?: Uint8Array;
    dataKey?: Uint8Array;
  },
): Promise<string> {
  await crypto.ready();

  let session = VaultCryptoSession.getV2Session();
  const sessionMatchesVault =
    !!session && (!session.vaultId || session.vaultId === payload.vaultId);
  if (!sessionMatchesVault) {
    session = null;
  }
  const shouldRewrap = opts?.forceRewrap || !session;

  if (!session) {
    const dataKey = opts?.dataKey ?? crypto.randomBytes(crypto.AEAD_KEYBYTES());
    if (dataKey.length !== crypto.AEAD_KEYBYTES()) {
      throw new Error(`[VaultV2] invalid data key length: ${dataKey.length}`);
    }
    const wrapped = createWrappedDataKey(crypto, masterPassword, dataKey, opts);
    session = {
      dataKey,
      vaultId: payload.vaultId,
      kdf: wrapped.kdf,
      keywrap: wrapped.keywrap,
    };
  } else if (shouldRewrap) {
    const wrapped = createWrappedDataKey(
      crypto,
      masterPassword,
      session.dataKey,
      opts,
    );
    session = {
      dataKey: session.dataKey,
      vaultId: payload.vaultId,
      kdf: wrapped.kdf,
      keywrap: wrapped.keywrap,
    };
  }

  const payloadNonce =
    opts?.payloadNonce ?? crypto.randomBytes(crypto.AEAD_NONCEBYTES());
  if (payloadNonce.length !== crypto.AEAD_NONCEBYTES()) {
    throw new Error(
      `[VaultV2] invalid payload nonce length: ${payloadNonce.length}`,
    );
  }

  const payloadAad = makeV2PayloadAadBytes();
  const plaintext = crypto.toBytesUtf8(JSON.stringify(payload));
  const ciphertextCombined = crypto.aeadEncrypt(
    plaintext,
    payloadAad,
    payloadNonce,
    session.dataKey,
  );

  const out: VaultV2 = {
    v: 2,
    kdf: session.kdf,
    keywrap: session.keywrap,
    aead: {
      alg: "xchacha20poly1305-ietf",
      nonce_b64: crypto.toBase64(payloadNonce),
      aad_b64: crypto.toBase64(payloadAad),
    },
    ct_b64: crypto.toBase64(ciphertextCombined),
  };

  VaultCryptoSession.setV2Session(session);
  return JSON.stringify(out);
}

export async function decryptVaultV2(
  crypto: CryptoProvider,
  vault: VaultV2,
  masterPassword: string,
): Promise<VaultDataType> {
  await crypto.ready();

  if (vault.v !== 2) {
    throw new Error(
      `Unsupported vault version: ${String((vault as { v?: unknown }).v)}`,
    );
  }

  assertV2Lengths(crypto, vault);

  const salt = crypto.fromBase64(vault.kdf.salt_b64);
  const keywrapNonce = crypto.fromBase64(vault.keywrap.nonce_b64);
  const keywrapAad = crypto.fromBase64(vault.keywrap.aad_b64);
  const expectedKeywrapAad = makeV2KeywrapAadBytes();
  const wrappedDataKey = crypto.fromBase64(vault.keywrap.wrapped_key_b64);

  assertBytesEqual(keywrapAad, expectedKeywrapAad, "keywrap AAD");

  const wrappingKey = crypto.pwhash(
    vault.kdf.keylen,
    masterPassword,
    salt,
    vault.kdf.opslimit,
    vault.kdf.memlimit,
  );

  const dataKey = crypto.aeadDecrypt(
    wrappedDataKey,
    keywrapAad,
    keywrapNonce,
    wrappingKey,
  );
  let normalizedDataKey = dataKey;
  if (dataKey.length !== crypto.AEAD_KEYBYTES()) {
    try {
      normalizedDataKey = crypto.fromBase64(crypto.fromBytesUtf8(dataKey));
    } catch (error) {
      throw new Error("[VaultV2] invalid wrapped data key encoding", {
        cause: error,
      });
    }
  }

  if (normalizedDataKey.length !== crypto.AEAD_KEYBYTES()) {
    throw new Error(
      `[VaultV2] invalid data key length: ${normalizedDataKey.length}`,
    );
  }

  const payloadNonce = crypto.fromBase64(vault.aead.nonce_b64);
  const payloadAad = crypto.fromBase64(vault.aead.aad_b64);
  const expectedPayloadAad = makeV2PayloadAadBytes();
  const ciphertext = crypto.fromBase64(vault.ct_b64);

  assertBytesEqual(payloadAad, expectedPayloadAad, "payload AAD");

  const plaintextBytes = crypto.aeadDecrypt(
    ciphertext,
    payloadAad,
    payloadNonce,
    normalizedDataKey,
  );
  const plaintext = crypto.fromBytesUtf8(plaintextBytes);
  const payload = JSON.parse(plaintext) as VaultDataType;

  VaultCryptoSession.setV2Session({
    dataKey: normalizedDataKey,
    vaultId: payload.vaultId,
    kdf: vault.kdf,
    keywrap: vault.keywrap,
  });

  return payload;
}

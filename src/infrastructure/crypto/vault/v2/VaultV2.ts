import type VaultDataType from "../../../../features/vault/model/VaultDataType";
import { VaultDataTypeSchema } from "../../../../features/vault/model/VaultDataType";
import type { CryptoProvider } from "../../provider/CryptoProvider";
import {
  VaultCryptoSession,
  type VaultCryptoSessionState,
} from "../VaultCryptoSession";
import type { VaultV3 } from "../VaultV3Schema";
import {
  makeV3PayloadAad,
  unwrapRecoveryKey,
  wrapRecoveryKey,
} from "../recoveryKey";
import { makeV2KeywrapAadBytes, makeV2PayloadAadBytes } from "./aad";
import type { VaultV2 } from "./VaultV2Schema";

const OPSLIMIT_DEFAULT = 3;
const MEMLIMIT_DEFAULT = 64 * 1024 * 1024;
type KeyEnvelope = VaultV2 | VaultV3;

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

function assertV2Lengths(crypto: CryptoProvider, vault: KeyEnvelope) {
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

  const keywrapNonce =
    opts?.keywrapNonce ?? crypto.randomBytes(crypto.AEAD_NONCEBYTES());
  if (keywrapNonce.length !== crypto.AEAD_NONCEBYTES()) {
    throw new Error(
      `[VaultV2] invalid keywrap nonce length: ${keywrapNonce.length}`,
    );
  }

  const wrappingKeyLen = crypto.AEAD_KEYBYTES();
  const wrappingKey = crypto.pwhash(
    wrappingKeyLen,
    masterPassword,
    salt,
    opslimit,
    memlimit,
  );
  const keywrapAad = makeV2KeywrapAadBytes();
  const dataKeyText = crypto.toBytesUtf8(crypto.toBase64(dataKey));
  let wrappedDataKey: Uint8Array;
  try {
    wrappedDataKey = crypto.aeadEncrypt(
      dataKeyText,
      keywrapAad,
      keywrapNonce,
      wrappingKey,
    );
  } finally {
    wrappingKey.fill(0);
    dataKeyText.fill(0);
  }

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
    recoveryChange?: string | null;
    session?: VaultCryptoSessionState | null;
    commitSession?: boolean;
  },
): Promise<string> {
  await crypto.ready();

  const live =
    opts?.session === undefined ? VaultCryptoSession.getV2Session() : null;
  const previous = opts?.session === undefined ? live : opts.session;
  const matching =
    previous && (!previous.vaultId || previous.vaultId === payload.vaultId)
      ? previous
      : null;
  const formatVersion =
    opts?.recoveryChange !== null &&
    (matching?.formatVersion === 3 || opts?.recoveryChange !== undefined)
      ? 3
      : 2;
  // Changing/removing a recovery key must also revoke its ability to open future
  // ciphertext using an older copy of the envelope.
  const rotateDataKey = Boolean(
    matching?.recovery && opts?.recoveryChange !== undefined,
  );
  let dataKey: Uint8Array | undefined;
  let plaintext: Uint8Array | undefined;
  try {
    dataKey =
      matching && !rotateDataKey
        ? new Uint8Array(matching.dataKey)
        : opts?.dataKey
          ? new Uint8Array(opts.dataKey)
          : crypto.randomBytes(crypto.AEAD_KEYBYTES());
    if (dataKey.length !== crypto.AEAD_KEYBYTES())
      throw new Error("Invalid vault data key length");

    const { kdf, keywrap } =
      matching && !opts?.forceRewrap && !rotateDataKey
        ? matching
        : createWrappedDataKey(crypto, masterPassword, dataKey, opts);
    const recovery =
      opts?.recoveryChange === undefined
        ? matching?.recovery
        : opts.recoveryChange === null
          ? undefined
          : wrapRecoveryKey(crypto, opts.recoveryChange, dataKey);
    const payloadNonce =
      opts?.payloadNonce ?? crypto.randomBytes(crypto.AEAD_NONCEBYTES());
    if (payloadNonce.length !== crypto.AEAD_NONCEBYTES())
      throw new Error("Invalid vault payload nonce length");
    const payloadAad =
      formatVersion === 3
        ? makeV3PayloadAad(crypto, recovery)
        : makeV2PayloadAadBytes();
    plaintext = crypto.toBytesUtf8(JSON.stringify(payload));
    const ciphertext = crypto.aeadEncrypt(
      plaintext,
      payloadAad,
      payloadNonce,
      dataKey,
    );
    const fields = {
      kdf,
      keywrap,
      aead: {
        alg: "xchacha20poly1305-ietf" as const,
        nonce_b64: crypto.toBase64(payloadNonce),
        aad_b64: crypto.toBase64(payloadAad),
      },
      ct_b64: crypto.toBase64(ciphertext),
    };
    if (formatVersion === 3 && !recovery)
      throw new Error("Missing recovery key slot");
    const out: KeyEnvelope = recovery
      ? { v: 3, ...fields, recovery }
      : { v: 2, ...fields };
    if (opts?.commitSession !== false) {
      VaultCryptoSession.setV2Session({
        dataKey,
        vaultId: payload.vaultId,
        kdf,
        keywrap,
        formatVersion,
        recovery,
      });
    }
    return JSON.stringify(out);
  } finally {
    live?.dataKey.fill(0);
    dataKey?.fill(0);
    plaintext?.fill(0);
  }
}

export async function openVaultKeyEnvelope(
  crypto: CryptoProvider,
  vault: KeyEnvelope,
  credential: { password: string } | { recoveryKey: string },
): Promise<{ payload: VaultDataType; session: VaultCryptoSessionState }> {
  await crypto.ready();
  assertV2Lengths(crypto, vault);
  const recovery = vault.v === 3 ? vault.recovery : undefined;
  const payloadAad = crypto.fromBase64(vault.aead.aad_b64);
  assertBytesEqual(
    payloadAad,
    vault.v === 3
      ? makeV3PayloadAad(crypto, recovery)
      : makeV2PayloadAadBytes(),
    "payload AAD",
  );
  let dataKey: Uint8Array | undefined;
  let plaintext: Uint8Array | undefined;
  try {
    if ("recoveryKey" in credential) {
      if (!recovery) throw new Error("Vault recovery is not configured");
      dataKey = unwrapRecoveryKey(crypto, credential.recoveryKey, recovery);
    } else {
      const keywrapAad = crypto.fromBase64(vault.keywrap.aad_b64);
      assertBytesEqual(keywrapAad, makeV2KeywrapAadBytes(), "keywrap AAD");
      const wrappingKey = crypto.pwhash(
        vault.kdf.keylen,
        credential.password,
        crypto.fromBase64(vault.kdf.salt_b64),
        vault.kdf.opslimit,
        vault.kdf.memlimit,
      );
      let raw: Uint8Array | undefined;
      try {
        raw = crypto.aeadDecrypt(
          crypto.fromBase64(vault.keywrap.wrapped_key_b64),
          keywrapAad,
          crypto.fromBase64(vault.keywrap.nonce_b64),
          wrappingKey,
        );
        dataKey =
          raw.length === crypto.AEAD_KEYBYTES()
            ? new Uint8Array(raw)
            : crypto.fromBase64(crypto.fromBytesUtf8(raw));
      } finally {
        wrappingKey.fill(0);
        raw?.fill(0);
      }
    }
    if (dataKey.length !== crypto.AEAD_KEYBYTES())
      throw new Error("Invalid vault data key length");
    plaintext = crypto.aeadDecrypt(
      crypto.fromBase64(vault.ct_b64),
      payloadAad,
      crypto.fromBase64(vault.aead.nonce_b64),
      dataKey,
    );
    const payload = VaultDataTypeSchema.parse(
      JSON.parse(crypto.fromBytesUtf8(plaintext)),
    );
    return {
      payload,
      session: {
        dataKey,
        vaultId: payload.vaultId,
        kdf: vault.kdf,
        keywrap: vault.keywrap,
        formatVersion: vault.v,
        recovery,
      },
    };
  } catch (error) {
    dataKey?.fill(0);
    throw error;
  } finally {
    plaintext?.fill(0);
  }
}

export async function decryptVaultV2(
  crypto: CryptoProvider,
  vault: KeyEnvelope,
  masterPassword: string,
  options?: { commitSession?: boolean },
): Promise<VaultDataType> {
  const { payload, session } = await openVaultKeyEnvelope(crypto, vault, {
    password: masterPassword,
  });
  try {
    if (options?.commitSession !== false) VaultCryptoSession.setV2Session(session);
    return payload;
  } finally {
    session.dataKey.fill(0);
  }
}

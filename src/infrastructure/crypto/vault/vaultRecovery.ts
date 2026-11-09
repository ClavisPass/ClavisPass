import VaultDataType, {
  VaultDataTypeSchema,
} from "../../../features/vault/model/VaultDataType";
import { getCryptoProvider } from "../provider";
import { VaultV1Schema } from "./v1/VaultV1Schema";
import { decryptVaultV1 } from "./v1/VaultV1";
import { VaultV2Schema } from "./v2/VaultV2Schema";
import { encryptVaultV2, openVaultKeyEnvelope } from "./v2/VaultV2";
import { VaultV3Schema } from "./VaultV3Schema";
import { generateRecoveryKey } from "./recoveryKey";
import {
  VaultCryptoSession,
  type VaultCryptoSessionState,
} from "./VaultCryptoSession";

export async function createRecoveryKey(): Promise<string> {
  const crypto = await getCryptoProvider();
  await crypto.ready();
  return generateRecoveryKey(crypto);
}

export function supportsVaultRecovery(content: string): boolean {
  try {
    const parsed = VaultV3Schema.safeParse(JSON.parse(content));
    return parsed.success && Boolean(parsed.data.recovery);
  } catch {
    return false;
  }
}

export async function verifyVaultRecoveryKey(
  content: string,
  key: string,
): Promise<void> {
  const crypto = await getCryptoProvider();
  const envelope = VaultV3Schema.parse(JSON.parse(content));
  const opened = await openVaultKeyEnvelope(crypto, envelope, {
    recoveryKey: key,
  });
  opened.session.dataKey.fill(0);
}

// These operations prepare a write without changing the active unlock session.
// The caller commits it only after the expected ciphertext was replaced.
export async function prepareVaultRecoveryChange(
  content: string,
  masterPassword: string,
  activeVaultId: string,
  key: string | null,
) {
  const crypto = await getCryptoProvider();
  const raw: unknown = JSON.parse(content);
  const v1 = VaultV1Schema.safeParse(raw);
  let session: VaultCryptoSessionState | null = null;
  try {
    let payload: VaultDataType;
    if (v1.success) {
      payload = VaultDataTypeSchema.parse(
        await decryptVaultV1(crypto, v1.data, masterPassword),
      );
    } else {
      const opened = await openVaultKeyEnvelope(
        crypto,
        VaultV3Schema.or(VaultV2Schema).parse(raw),
        { password: masterPassword },
      );
      session = opened.session;
      payload = opened.payload;
    }
    if (payload.vaultId && payload.vaultId !== activeVaultId) {
      throw new Error("Active vault does not match the saved vault");
    }
    return await encryptVaultV2(
      crypto,
      masterPassword,
      { ...payload, vaultId: activeVaultId },
      {
        session,
        recoveryChange: key,
        commitSession: false,
      },
    );
  } finally {
    session?.dataKey.fill(0);
  }
}

export async function prepareVaultPasswordRecovery(
  content: string,
  key: string,
  newPassword: string,
) {
  const crypto = await getCryptoProvider();
  const envelope = VaultV3Schema.parse(JSON.parse(content));
  const { payload, session } = await openVaultKeyEnvelope(crypto, envelope, {
    recoveryKey: key,
  });
  try {
    return await encryptVaultV2(crypto, newPassword, payload, {
      session,
      recoveryChange: key,
      forceRewrap: true,
      commitSession: false,
    });
  } finally {
    session.dataKey.fill(0);
  }
}

export async function prepareV3VaultPasswordChange(
  content: string,
  password: string,
  newPassword: string,
  activePayload: VaultDataType,
) {
  const crypto = await getCryptoProvider();
  const envelope = VaultV3Schema.parse(JSON.parse(content));
  const { payload, session } = await openVaultKeyEnvelope(crypto, envelope, {
    password,
  });
  try {
    if (!payload.vaultId || payload.vaultId !== activePayload.vaultId) {
      throw new Error("Active vault does not match the saved vault");
    }
    return await encryptVaultV2(crypto, newPassword, activePayload, {
      session,
      forceRewrap: true,
      commitSession: false,
    });
  } finally {
    session.dataKey.fill(0);
  }
}

// Check the prepared file with the password before writing, then publish its
// session only on success. No unlocked data is put into component state.
export async function persistPreparedRecoveryVault(
  content: string,
  password: string,
  persist: (vaultId: string | undefined) => Promise<void>,
  canActivate: () => boolean,
) {
  const crypto = await getCryptoProvider();
  const envelope = VaultV3Schema.or(VaultV2Schema).parse(JSON.parse(content));
  const { payload, session } = await openVaultKeyEnvelope(crypto, envelope, {
    password,
  });
  try {
    if (!canActivate()) throw new Error("Vault operation was cancelled");
    await persist(payload.vaultId);
    if (!canActivate()) return null;
    VaultCryptoSession.setV2Session(session);
    return payload;
  } finally {
    session.dataKey.fill(0);
  }
}

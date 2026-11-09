import { VaultDataTypeSchema } from "../../features/vault/model/VaultDataType";
import getEmptyData from "../../features/vault/utils/getEmptyData";
import { getCryptoProvider } from "./provider";
import { VaultCryptoSession } from "./vault/VaultCryptoSession";
import { decryptVaultV1 } from "./vault/v1/VaultV1";
import { VaultV1Schema } from "./vault/v1/VaultV1Schema";
import { decryptVaultV2 } from "./vault/v2/VaultV2";
import { VaultV2Schema } from "./vault/v2/VaultV2Schema";
import { VaultV3Schema } from "./vault/VaultV3Schema";
import { LATEST_VAULT_FORMAT, readVaultVersion } from "./vault/vaultFormatVersion";

export type DecryptVaultContentResult =
  | {
      ok: true;
      payload: ReturnType<typeof VaultDataTypeSchema.parse>;
      format: "v1" | "v2" | "v3";
    }
  | { ok: false; reason: "FORMAT" | "AUTH_FAILED" | "UPDATE_REQUIRED"; error?: unknown };

export const decryptVaultContent = async (
  content: string,
  masterPassword: string,
  options?: { commitSession?: boolean },
): Promise<DecryptVaultContentResult> => {
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(content);
  } catch (e) {
    return { ok: false, reason: "FORMAT", error: e };
  }

  if ((readVaultVersion(parsedJson) ?? 0) > LATEST_VAULT_FORMAT) {
    return { ok: false, reason: "UPDATE_REQUIRED" };
  }

  const v1 = VaultV1Schema.safeParse(parsedJson);
  if (v1.success) {
    try {
      const cryptoProvider = await getCryptoProvider();
      const decryptedVault = await decryptVaultV1(
        cryptoProvider,
        v1.data,
        masterPassword,
      );
      if (options?.commitSession !== false) VaultCryptoSession.clear();
      const payload =
        VaultDataTypeSchema.parse(decryptedVault) ?? getEmptyData();
      return { ok: true, payload, format: "v1" };
    } catch (e) {
      return { ok: false, reason: "AUTH_FAILED", error: e };
    }
  }

  const envelope = VaultV3Schema.or(VaultV2Schema).safeParse(parsedJson);
  if (envelope.success) {
    try {
      const cryptoProvider = await getCryptoProvider();
      const decryptedVault = await decryptVaultV2(
        cryptoProvider,
        envelope.data,
        masterPassword,
        options,
      );
      const payload =
        VaultDataTypeSchema.parse(decryptedVault) ?? getEmptyData();
      return { ok: true, payload, format: envelope.data.v === 3 ? "v3" : "v2" };
    } catch (e) {
      return { ok: false, reason: "AUTH_FAILED", error: e };
    }
  }

  return { ok: false, reason: "FORMAT" };
};

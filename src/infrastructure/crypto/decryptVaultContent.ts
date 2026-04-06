import { VaultDataTypeSchema } from "../../features/vault/model/VaultDataType";
import getEmptyData from "../../features/vault/utils/getEmptyData";
import { getCryptoProvider } from "./provider";
import { decryptVaultV1 } from "./vault/v1/VaultV1";
import { VaultV1Schema } from "./vault/v1/VaultV1Schema";

export type DecryptVaultContentResult =
  | { ok: true; payload: ReturnType<typeof VaultDataTypeSchema.parse>; format: "v1" }
  | { ok: false; reason: "FORMAT" | "AUTH_FAILED"; error?: unknown };

export const decryptVaultContent = async (
  content: string,
  masterPassword: string,
): Promise<DecryptVaultContentResult> => {
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(content);
  } catch (e) {
    return { ok: false, reason: "FORMAT", error: e };
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
      const payload = VaultDataTypeSchema.parse(decryptedVault) ?? getEmptyData();
      return { ok: true, payload, format: "v1" };
    } catch (e) {
      return { ok: false, reason: "AUTH_FAILED", error: e };
    }
  }

  return { ok: false, reason: "FORMAT" };
};

import { VaultDataTypeSchema } from "../../features/vault/model/VaultDataType";
import getEmptyData from "../../features/vault/utils/getEmptyData";

import CryptoType, { CryptoTypeSchema } from "./legacy/CryptoType";
import { decrypt as legacyDecrypt } from "./legacy/CryptoLayer";

// V1 bleibt optional für später
import { decryptVaultV1 } from "./vault/v1/VaultV1";
import { VaultV1Schema } from "./vault/v1/VaultV1Schema";

export type DecryptVaultContentResult =
  | { ok: true; payload: ReturnType<typeof VaultDataTypeSchema.parse>; format: "legacy" | "v1" }
  | { ok: false; reason: "FORMAT" | "AUTH_FAILED"; error?: unknown };

type DecryptOptions = {
  allowV1?: boolean;
};

export const decryptVaultContent = async (
  content: string,
  masterPassword: string,
  opts: DecryptOptions = {},
): Promise<DecryptVaultContentResult> => {
  const allowV1 = opts.allowV1 ?? false;

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(content);
  } catch (e) {
    return { ok: false, reason: "FORMAT", error: e };
  }

  const legacy = CryptoTypeSchema.safeParse(parsedJson);
  if (legacy.success) {
    try {
      const decrypted = legacyDecrypt(legacy.data as CryptoType, masterPassword);
      const jsonData = JSON.parse(decrypted);
      const payload = VaultDataTypeSchema.parse(jsonData) ?? getEmptyData();
      return { ok: true, payload, format: "legacy" };
    } catch (e) {
      return { ok: false, reason: "AUTH_FAILED", error: e };
    }
  }

  const { getCryptoProvider } = await import("./provider");
  const cryptoProvider = await getCryptoProvider();
  if (allowV1) {
    const v1 = VaultV1Schema.safeParse(parsedJson);
    if (v1.success) {
      try {
        const decryptedVault = await decryptVaultV1(cryptoProvider, v1.data, masterPassword);
        const payload = VaultDataTypeSchema.parse(decryptedVault) ?? getEmptyData();
        return { ok: true, payload, format: "v1" };
      } catch (e) {
        return { ok: false, reason: "AUTH_FAILED", error: e };
      }
    }
  }

  return { ok: false, reason: "FORMAT" };
};
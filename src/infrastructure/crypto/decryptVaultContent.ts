import { VaultDataTypeSchema } from "../../features/vault/model/VaultDataType";
import getEmptyData from "../../features/vault/utils/getEmptyData";

import CryptoType, { CryptoTypeSchema } from "./legacy/CryptoType";
import { decrypt as legacyDecrypt } from "./legacy/CryptoLayer";

import type { CryptoProvider } from "./provider/CryptoProvider";
import { decryptVaultV1, encryptVaultV1 } from "./vault/v1/VaultV1";
import { VaultV1Schema } from "./vault/v1/VaultV1Schema";

export type DecryptVaultContentResult =
  | {
      ok: true;
      payload: ReturnType<typeof VaultDataTypeSchema.parse>;
      migratedVaultJson?: string;
    }
  | { ok: false; reason: "FORMAT" | "AUTH_FAILED"; error?: unknown };

export const decryptVaultContent = async (
  crypto: CryptoProvider,
  content: string,
  masterPassword: string
): Promise<DecryptVaultContentResult> => {
  let parsedJson: unknown;

  // 1) content muss JSON sein
  try {
    parsedJson = JSON.parse(content);
  } catch (e) {
    return { ok: false, reason: "FORMAT", error: e };
  }

  // 2) V1?
  const v1 = VaultV1Schema.safeParse(parsedJson);
  if (v1.success) {
    try {
      const decryptedVault = await decryptVaultV1(crypto, v1.data, masterPassword);
      const payload = VaultDataTypeSchema.parse(decryptedVault) ?? getEmptyData();
      return { ok: true, payload };
    } catch (e) {
      return { ok: false, reason: "AUTH_FAILED", error: e };
    }
  }

  // 3) Legacy?
  const legacy = CryptoTypeSchema.safeParse(parsedJson);
  if (legacy.success) {
    try {
      const decrypted = legacyDecrypt(legacy.data as CryptoType, masterPassword);
      const jsonData = JSON.parse(decrypted);
      const payload = VaultDataTypeSchema.parse(jsonData) ?? getEmptyData();

      // migrate to V1
      const migratedVaultJson = await encryptVaultV1(crypto, masterPassword, payload);

      return { ok: true, payload, migratedVaultJson };
    } catch (e) {
      return { ok: false, reason: "AUTH_FAILED", error: e };
    }
  }

  // 4) Unbekanntes Format
  return { ok: false, reason: "FORMAT" };
};

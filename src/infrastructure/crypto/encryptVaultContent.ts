import VaultDataType from "../../features/vault/model/VaultDataType";
import { encrypt as legacyEncrypt } from "./legacy/CryptoLayer";
// V1 bleibt drin, aber ungenutzt
import { encryptVaultV1 } from "./vault/v1/VaultV1";

export type EncryptVaultContentResult =
  | { ok: true; content: string }
  | { ok: false; error: unknown };

export type EncryptMode = "legacy" | "v1";

export const encryptVaultContent = async (
  payload: VaultDataType,
  masterPassword: string,
  options?: {
    mode?: EncryptMode;
    lastUpdated?: string;
  },
): Promise<EncryptVaultContentResult> => {
  try {
    const mode: EncryptMode = options?.mode ?? "legacy";

    if (mode === "legacy") {
      const encrypted = await legacyEncrypt(
        payload,
        masterPassword,
        options?.lastUpdated,
      );

      return {
        ok: true,
        content: JSON.stringify(encrypted),
      };
    }

    const { getCryptoProvider } = await import("./provider");
    const cryptoProvider = await getCryptoProvider();
    if (mode === "v1") {
      const json = await encryptVaultV1(
        cryptoProvider,
        masterPassword,
        payload,
      );

      return {
        ok: true,
        content: json,
      };
    }

    throw new Error("Unsupported encrypt mode");
  } catch (e) {
    return { ok: false, error: e };
  }
};
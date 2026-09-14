import VaultDataType from "../../features/vault/model/VaultDataType";
import { getCryptoProvider } from "./provider";
import { encryptVaultV1 } from "./vault/v1/VaultV1";
import { encryptVaultV2 } from "./vault/v2/VaultV2";

export type EncryptVaultContentResult =
  | { ok: true; content: string }
  | { ok: false; error: unknown };

export type EncryptMode = "v1" | "v2";
export const DEFAULT_ENCRYPT_MODE: EncryptMode = "v2";

export const encryptVaultContent = async (
  payload: VaultDataType,
  masterPassword: string,
  options?: {
    mode?: EncryptMode;
    lastUpdated?: string;
    forceRewrap?: boolean;
  },
): Promise<EncryptVaultContentResult> => {
  try {
    const mode: EncryptMode = options?.mode ?? DEFAULT_ENCRYPT_MODE;

    const cryptoProvider = await getCryptoProvider();
    const json =
      mode === "v1"
        ? await encryptVaultV1(cryptoProvider, masterPassword, payload)
        : await encryptVaultV2(cryptoProvider, masterPassword, payload, {
            forceRewrap: options?.forceRewrap,
          });

    return {
      ok: true,
      content: json,
    };
  } catch (e) {
    return { ok: false, error: e };
  }
};

import VaultDataType from "../../features/vault/model/VaultDataType";
import { getCryptoProvider } from "./provider";
import { encryptVaultV1 } from "./vault/v1/VaultV1";

export type EncryptVaultContentResult =
  | { ok: true; content: string }
  | { ok: false; error: unknown };

export type EncryptMode = "v1";
export const DEFAULT_ENCRYPT_MODE: EncryptMode = "v1";

export const encryptVaultContent = async (
  payload: VaultDataType,
  masterPassword: string,
  options?: {
    mode?: EncryptMode;
    lastUpdated?: string;
  },
): Promise<EncryptVaultContentResult> => {
  try {
    const mode: EncryptMode = options?.mode ?? DEFAULT_ENCRYPT_MODE;

    const cryptoProvider = await getCryptoProvider();
    const json = await encryptVaultV1(
      cryptoProvider,
      masterPassword,
      payload,
    );

    return {
      ok: true,
      content: json,
    };
  } catch (e) {
    return { ok: false, error: e };
  }
};

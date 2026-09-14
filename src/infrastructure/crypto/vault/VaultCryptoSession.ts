import type { VaultV2 } from "./v2/VaultV2Schema";

type VaultCryptoSessionState = {
  dataKey: Uint8Array;
  vaultId?: string;
  kdf: VaultV2["kdf"];
  keywrap: VaultV2["keywrap"];
};

let session: VaultCryptoSessionState | null = null;

const cloneBytes = (value: Uint8Array) => new Uint8Array(value);

export const VaultCryptoSession = {
  hasDataKey(): boolean {
    return session !== null;
  },

  setV2Session(params: VaultCryptoSessionState): void {
    session = {
      dataKey: cloneBytes(params.dataKey),
      vaultId: params.vaultId,
      kdf: { ...params.kdf },
      keywrap: { ...params.keywrap },
    };
  },

  getV2Session(): VaultCryptoSessionState | null {
    if (!session) return null;

    return {
      dataKey: cloneBytes(session.dataKey),
      vaultId: session.vaultId,
      kdf: { ...session.kdf },
      keywrap: { ...session.keywrap },
    };
  },

  clear(): void {
    if (session?.dataKey) {
      session.dataKey.fill(0);
    }
    session = null;
  },
};

import type { VaultV2 } from "./v2/VaultV2Schema";
import type { RecoverySlot } from "./VaultV3Schema";

export type VaultCryptoSessionState = {
  dataKey: Uint8Array;
  vaultId?: string;
  kdf: VaultV2["kdf"];
  keywrap: VaultV2["keywrap"];
  formatVersion?: 2 | 3;
  recovery?: RecoverySlot;
};

let session: VaultCryptoSessionState | null = null;

const cloneBytes = (value: Uint8Array) => new Uint8Array(value);
const cloneSession = (value: VaultCryptoSessionState): VaultCryptoSessionState => ({
  ...value,
  dataKey: cloneBytes(value.dataKey),
  kdf: { ...value.kdf },
  keywrap: { ...value.keywrap },
  recovery: value.recovery ? { ...value.recovery } : undefined,
});

export const VaultCryptoSession = {
  hasDataKey(): boolean {
    return session !== null;
  },

  setV2Session(params: VaultCryptoSessionState): void {
    const next = cloneSession(params);
    session?.dataKey.fill(0);
    session = next;
  },
  hasRecoveryKey(): boolean {
    return Boolean(session?.recovery);
  },

  getV2Session(): VaultCryptoSessionState | null {
    if (!session) return null;

    return cloneSession(session);
  },

  clear(): void {
    if (session?.dataKey) {
      session.dataKey.fill(0);
    }
    session = null;
  },
};

import VaultData from "./VaultData";

type VaultSessionState = {
  data: VaultData;
  dirty: boolean;
  unlockedAt: number;
};

export default VaultSessionState;

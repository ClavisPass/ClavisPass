import VaultDataType from "./VaultDataType";

type VaultSessionState = {
  data: VaultDataType;
  dirty: boolean;
  unlockedAt: number;
};

export default VaultSessionState;

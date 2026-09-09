import VaultDataType from "../model/VaultDataType";
import { createVaultId } from "./vaultIdentity";

function getEmptyData() {
  let data: VaultDataType = {
    version: "1",
    vaultId: createVaultId(),
    folder: [],
    values: [],
    devices: [],
    deletedEntries: [],
  };
  return data;
}

export default getEmptyData;

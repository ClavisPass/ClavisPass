import VaultDataType from "../model/VaultDataType";

function getEmptyData() {
  let data: VaultDataType = {
    version: "1",
    folder: [],
    values: [],
  };
  return data;
}

export default getEmptyData;

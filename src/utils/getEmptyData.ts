import DataType from "../types/DataType";

function getEmptyData() {
  let data: DataType = {
    version: "",
    folder: [],
    values: [],
  };
  return data;
}

export default getEmptyData;

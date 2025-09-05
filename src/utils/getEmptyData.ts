import DataType from "../types/DataType";

function getEmptyData() {
  let data: DataType = {
    version: "1",
    folder: [],
    values: [],
  };
  return data;
}

export default getEmptyData;

import DataType from "../types/DataType";
import { getDateTime } from "./Timestamp";

function getEmptyData() {
  const dateTime = getDateTime();
  let data: DataType = {
    version: "",
    lastUpdated: dateTime,
    folder: [],
    values: [],
  };
  return data;
}

export default getEmptyData;

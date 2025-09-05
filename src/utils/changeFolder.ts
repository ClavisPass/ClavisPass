import { DataContextType } from "../contexts/DataProvider";
import DataType from "../types/DataType";
import FolderType from "../types/FolderType";

const changeFolder = (folder: FolderType[], data: DataContextType) => {
  let newData = { ...data.data } as DataType;
  if (newData) {
    newData.folder = folder;
  }
  data.setData(newData);
};

export default changeFolder;

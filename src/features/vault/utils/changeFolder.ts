import { DataContextType } from "../../../app/providers/DataProvider";
import DataType from "../model/DataType";
import FolderType from "../model/FolderType";

const changeFolder = (folder: FolderType[], data: DataContextType) => {
  let newData = { ...data.data } as DataType;
  if (newData) {
    newData.folder = folder;
  }
  data.setData(newData);
};

export default changeFolder;

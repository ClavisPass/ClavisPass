import DataType from "../types/DataType";

const changeFolder = (folder: string[], data: any) => {
  let newData = { ...data.data } as DataType;
  if (newData) {
    newData.folder = folder;
  }
  data.setData(newData);
};

export default changeFolder;

import CryptoType from "../../types/CryptoType";
import uploadFileToDropbox from "./uploadFileToDropbox";

const uploadData = async (
  token: string | null,
  tokenType: string | null,
  fileContent: CryptoType,
  fileName: string,
  callback?: () => void
) => {
  if (token && tokenType)
    uploadFileToDropbox(token, fileContent, fileName, callback);
};

export default uploadData;

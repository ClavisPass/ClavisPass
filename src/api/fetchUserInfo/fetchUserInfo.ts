import UserInfoType from "../../types/UserInfoType";
import fetchDropboxUserInfo from "./fetchDropboxUserInfo";

const fetchUserInfo = async (
  token: string,
  tokenType: "Dropbox" | "GoogleDrive" | null,
  setUserInfo: (data: UserInfoType) => void,
  callback?: () => void
) => {
  if (tokenType === "Dropbox") {
    fetchDropboxUserInfo(token, setUserInfo, callback);
    return;
  }
  if (tokenType === "GoogleDrive") {
    //fetchGoogleDriveUserInfo(token, setUserInfo, callback);
    return;
  }
};

export default fetchUserInfo;

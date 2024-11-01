import UserInfoType from "../types/UserInfoType";

const fetchGoogleDriveUserInfo = async (
  token: string,
  setUserInfo: (data: UserInfoType) => void,
  callback?: ()=> void
) => {
  if (token) {
    try {
      const fields = "user,storageQuota";
      const response: any = await fetch(
        `https://www.googleapis.com/drive/v3/about?fields=${encodeURIComponent(fields)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data.user);
        const userData: UserInfoType = {
          username: data.user.displayName,
          avatar: data.user.photoLink,
        };
        setUserInfo(userData);
      } else {
        const errorData = await response.json();
        console.error("Error fetching user info:", errorData);
        callback?.();
      }
    } catch (error) {
      console.error("Network error:", error);
      callback?.();
    }
  }
};

const fetchDropboxUserInfo = async (
  token: string,
  setUserInfo: (data: UserInfoType) => void,
  callback?: ()=> void
) => {
  if (token) {
    try {
      const response = await fetch(
        "https://api.dropboxapi.com/2/users/get_current_account",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        callback?.();
        throw new Error("Failed to fetch user information");
      }

      const data = await response.json();
      console.log(data);
      const userData: UserInfoType = {
        username: data.name.display_name,
        avatar: data.profile_photo_url,
      };
      setUserInfo(userData);
    } catch (error) {
      console.error("Network error:", error);
      callback?.();
    }
  }
};

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
    fetchGoogleDriveUserInfo(token, setUserInfo, callback);
    return;
  }
};

export default fetchUserInfo;

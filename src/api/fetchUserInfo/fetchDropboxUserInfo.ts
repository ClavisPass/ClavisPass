import UserInfoType from "../../types/UserInfoType";

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
      const userData: UserInfoType = {
        username: data.name.display_name,
        avatar: data.profile_photo_url,
      };
      setUserInfo(userData);
      callback?.();
    } catch (error) {
      console.error("Network error:", error);
      callback?.();
    }
  }
  else{
    callback?.();
  }
};

export default fetchDropboxUserInfo;

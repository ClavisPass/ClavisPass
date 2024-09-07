const fetchUserInfo = async (
  token: string,
  setUserInfo: (data: any) => void
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
        setUserInfo(data.user);
      } else {
        const errorData = await response.json();
        console.error("Error fetching user info:", errorData);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }
};

export default fetchUserInfo;

const fetchDriveFiles = async (token: string) => {
  const response = await fetch("https://www.googleapis.com/drive/v3/files", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  console.log(data);
};

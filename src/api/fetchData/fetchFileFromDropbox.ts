const fetchFileFromDropbox = async (
  accessToken: string,
  fileName: string
): Promise<string | null> => {
  try {
    const response = await fetch(
      "https://content.dropboxapi.com/2/files/download",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Dropbox-API-Arg": JSON.stringify({
            path: `/${fileName}`,
          }),
        },
      }
    );

    if (!response.ok) {
      //throw new Error(`Failed to download file: ${response.statusText}`);
      return null
    }

    const fileContent = await response.text();
    return fileContent;
  } catch (error) {
    console.error("Error downloading file:", error);
    return null;
  }
};

export default fetchFileFromDropbox;

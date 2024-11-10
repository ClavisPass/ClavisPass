const fetchFileFromDropbox = async (
  token: string,
  fileName: string
): Promise<string | null> => {
  try {
    console.log("DAS HIER WIRD BENUTZT: "+token);
    const response = await fetch(
      "https://content.dropboxapi.com/2/files/download",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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

    // Lies den Blob als Text
    const fileContent = await response.text();

    return fileContent;
  } catch (error) {
    console.error("Error downloading file:", error);
    return null;
  }
};

const fetchData = async (
  token: string | null,
  tokenType: string | null,
  fileName: string
): Promise<string | null> => {
  if (token && tokenType) {
    try {
      const data = await fetchFileFromDropbox(token, fileName);
      return data; // Gibt das validierte DataType-Objekt zurück, wenn erfolgreich
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }
  return null;
};

export default fetchData;

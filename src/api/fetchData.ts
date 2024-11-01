import DataType, { DataTypeSchema } from "../types/DataType";

const fetchFileFromDropbox = async (
  token: string,
  fileName: string
): Promise<DataType | null> => {
  try {
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
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    // Lies den Blob als Text
    const fileContent = await response.text();

    try {
      const jsonData = JSON.parse(fileContent);

      // Validiere die Struktur des JSON mit Zod
      const parsedData = DataTypeSchema.parse(jsonData);
      return parsedData; // Gültiges JSON zurückgeben
    } catch (jsonError) {
      console.error("Error parsing or validating JSON:", jsonError);
      return null;
    }
  } catch (error) {
    console.error("Error downloading file:", error);
    return null;
  }
};

const fetchData = async (
  token: string | null,
  tokenType: string | null,
  fileName: string
): Promise<DataType | null> => {
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

import DataType from "../types/DataType";

const uploadFileToDropbox = async (
  token: string,
  fileContent: DataType,
  fileName: string
) => {
  const response = await fetch(
    "https://content.dropboxapi.com/2/files/upload",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Dropbox-API-Arg": JSON.stringify({
          path: `/${fileName}`,
          mode: "overwrite",
          autorename: false,
          mute: false,
        }),
        "Content-Type": "application/octet-stream",
      },
      body: JSON.stringify(fileContent),
    }
  );

  if (!response.ok) {
    throw new Error("Fehler beim Hochladen der Datei");
  }

  const data = await response.json();
  console.log("Datei hochgeladen:", data);
};

const uploadData = async (
  token: string | null,
  tokenType: string | null,
  fileContent: DataType,
  fileName: string
) => {
  if (token && tokenType) uploadFileToDropbox(token, fileContent, fileName);
};

export default uploadData;

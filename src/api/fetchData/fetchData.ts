import fetchFileFromDropbox from "./fetchFileFromDropbox";

const fetchData = async (
  accessToken: string | null,
  tokenType: string | null,
  fileName: string
): Promise<string | null> => {
  if (accessToken && tokenType) {
    try {
      const data = await fetchFileFromDropbox(accessToken, fileName);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }
  return null;
};

export default fetchData;

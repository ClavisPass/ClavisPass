import Provider from "./Provider";

interface FetchFileParams {
  provider: Provider;
  accessToken: string;
  /**
   * Für Dropbox: Dateiname/Pfad
   * Für Google Drive: fileId oder Pfad je nach Implementierung
   */
  remotePath: string;
}

export default FetchFileParams;
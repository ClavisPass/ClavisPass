import CryptoType from "../../crypto/CryptoType";
import Provider from "./Provider";

export interface UploadFileParams {
  provider: Provider;
  accessToken: string;
  remotePath: string;
  content: CryptoType;
  onCompleted?: () => void;
}

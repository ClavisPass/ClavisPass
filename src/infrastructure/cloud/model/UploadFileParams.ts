import CryptoType from "../../crypto/legacy/CryptoType";
import Provider from "./Provider";

export type UploadContent = CryptoType | string;

export interface UploadFileParams {
  provider: Provider;
  accessToken: string;
  remotePath: string;
  content: UploadContent;
  onCompleted?: () => void;
}

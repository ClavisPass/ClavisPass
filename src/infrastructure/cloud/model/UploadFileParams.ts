import Provider from "./Provider";

export type UploadContent = string;

export interface UploadFileParams {
  provider: Provider;
  accessToken: string;
  remotePath: string;
  content: UploadContent;
  onCompleted?: () => void;
}

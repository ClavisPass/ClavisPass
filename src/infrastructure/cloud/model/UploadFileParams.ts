import Provider from "./Provider";
import { VaultSnapshot } from "./VaultFetchResult";

export type UploadContent = string;

export interface UploadFileParams {
  provider: Provider;
  accessToken: string;
  remotePath: string;
  content: UploadContent;
  onCompleted?: () => void;
  vaultId?: string;
  expected: VaultSnapshot;
  allowRecoveryRemoval?: boolean;
}

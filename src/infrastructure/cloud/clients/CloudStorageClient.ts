import { UploadFileParams } from "../model/UploadFileParams";
import TokenRefreshParams from "../model/oauth/TokenRefreshParams";
import TokenRefreshResult from "../model/oauth/TokenRefreshResult";
import * as DropboxClient from "./DropboxClient";
import * as GoogleDriveClient from "./GoogleDriveClient";
import * as DeviceStorageClient from "./DeviceStorageClient";
import * as ClavisPassHubClient from "./ClavisPassHubClient";
import * as LocalFileClient from "./LocalFileClient";

import { logger } from "../../logging/logger";
import Provider from "../model/Provider";
import UserInfoType from "../../../features/sync/model/UserInfoType";
import { triggerGlobalError } from "../../events/errorBus";
import { VaultFetchResult, VaultSnapshot } from "../model/VaultFetchResult";
import { getVaultFormatVersion, LATEST_VAULT_FORMAT } from "../../crypto/vault/vaultFormatVersion";

let pendingVaultOperation: Promise<unknown> = Promise.resolve();

/** Serialize operations that can change the active vault's crypto session. */
export function runVaultOperation<T>(operation: () => Promise<T>): Promise<T> {
  const next = pendingVaultOperation.then(operation);
  pendingVaultOperation = next.catch(() => {});
  return next;
}

export function canWriteRecoveryVault(provider: Provider | null | undefined) {
  return provider === "device" || provider === "dropbox" || provider === "clavispassHub";
}

function assertUnchangedVault(current: VaultFetchResult, expected: VaultSnapshot) {
  if (current.status === "not_found" && expected.status === "not_found") return;
  if (current.status === "ok" && expected.status === "ok" &&
      current.content === expected.content && current.revision === expected.revision) return;
  throw new Error("The saved vault changed or could not be checked before writing");
}

export const fetchUserInfo = async (
  token: string,
  provider: Provider,
  setUserInfo: (data: UserInfoType) => void,
  callback?: () => void,
): Promise<void> => {
  switch (provider) {
    case "dropbox":
      return DropboxClient.fetchUserInfo(token, setUserInfo, callback);

    case "googleDrive":
      return GoogleDriveClient.fetchUserInfo(token, setUserInfo, callback);

    case "device":
      return DeviceStorageClient.fetchUserInfo(token, setUserInfo, callback);

    case "clavispassHub":
      return ClavisPassHubClient.fetchUserInfo(token, setUserInfo, callback);

    case "localFile":
      return LocalFileClient.fetchUserInfo(token, setUserInfo, callback);

    default: {
      const _exhaustiveCheck: never = provider as never;
      logger.error(
        "[CloudStorage] Unsupported provider for user info:",
        provider,
      );
      triggerGlobalError({
        title: "CloudStorage",
        message: "Upload fehlgeschlagen. Bitte versuche es später erneut.",
        code: "FETCH_USER_INFORMATION_FAILED",
      });
      callback?.();
      return;
    }
  }
};

export const fetchRemoteVaultFile = async (params: {
  provider: Provider;
  accessToken: string;
  remotePath: string;
}): Promise<VaultFetchResult> => {
  const { provider, accessToken, remotePath } = params;

  try {
    switch (provider) {
      case "dropbox":
        return await DropboxClient.fetchFile(accessToken, remotePath);

      case "googleDrive":
        return await GoogleDriveClient.fetchFile(accessToken, remotePath);

      case "device":
        return await DeviceStorageClient.fetchFile();

      case "clavispassHub":
        return await ClavisPassHubClient.fetchFile(accessToken, remotePath);

      case "localFile":
        return await LocalFileClient.fetchFile(accessToken);

      default: {
        const _exhaustiveCheck: never = provider;
        return {
          status: "error",
          message: `Unsupported provider: ${String(provider)}`,
        };
      }
    }
  } catch (e) {
    logger.error("[CloudStorage] fetchRemoteVaultFileSafe failed:", e);
    return { status: "error", message: "Fetch failed", cause: e };
  }
};

export const uploadRemoteVaultFile = async (
  params: UploadFileParams,
): Promise<void> => {
  const { provider, accessToken, remotePath, content, onCompleted, vaultId, expected, allowRecoveryRemoval } =
    params;
  const previous = expected.status === "ok" ? expected.content : null;
  const previousVersion = previous === null ? null : getVaultFormatVersion(previous);
  const nextVersion = getVaultFormatVersion(content);
  if (previousVersion !== null && previousVersion > LATEST_VAULT_FORMAT) {
    throw new Error("The saved vault requires a newer app version");
  }
  if (provider === "googleDrive" && (previousVersion === 3 || nextVersion === 3)) {
    throw new Error("This provider does not support checked recovery vault writes");
  }
  if (previousVersion === 3 && nextVersion !== 3 &&
      !(allowRecoveryRemoval && nextVersion === 2)) {
    throw new Error("A recovery vault cannot be silently downgraded");
  }

  switch (provider) {
    case "dropbox":
      return DropboxClient.uploadFile(
        accessToken,
        content,
        remotePath,
        onCompleted,
        vaultId,
        expected.status === "not_found" ? null : expected.revision,
        previous,
      );

    case "googleDrive":
      // Drive does not document an atomic precondition for this upload API.
      assertUnchangedVault(await GoogleDriveClient.fetchFile(accessToken, remotePath), expected);
      return GoogleDriveClient.uploadFile(
        accessToken,
        content,
        remotePath,
        onCompleted,
        vaultId,
      );
    case "device":
      return DeviceStorageClient.uploadFile(content, onCompleted, vaultId, previous, allowRecoveryRemoval);
    case "clavispassHub":
      return ClavisPassHubClient.uploadFile(
        accessToken,
        content,
        remotePath,
        onCompleted,
        expected.status === "not_found" ? null : expected.revision,
        previous,
        vaultId,
      );
    case "localFile":
      assertUnchangedVault(await LocalFileClient.fetchFile(accessToken), expected);
      return LocalFileClient.uploadFile(accessToken, content, onCompleted);
    default: {
      logger.error("[CloudStorage] Unsupported provider for upload:", provider);
      throw new Error("Unsupported cloud storage provider");
    }
  }
};

export const refreshAccessToken = async (
  params: TokenRefreshParams,
): Promise<TokenRefreshResult> => {
  const { provider, refreshToken } = params;

  switch (provider) {
    case "dropbox":
      return DropboxClient.refreshAccessToken(refreshToken);
    case "googleDrive":
      return GoogleDriveClient.refreshAccessToken(refreshToken);
    case "device":
      throw new Error("[OAuth] Device provider does not support token refresh");
    case "clavispassHub":
      return ClavisPassHubClient.refreshAccessToken(refreshToken);
    case "localFile":
      throw new Error(
        "[OAuth] Local file provider does not support token refresh",
      );
    default: {
      throw new Error(`[OAuth] Unsupported provider: ${String(provider)}`);
    }
  }
};

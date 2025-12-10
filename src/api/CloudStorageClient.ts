import FetchFileParams from "../types/api/cloudStorage/FetchFileParams";
import RemoteFileContent from "../types/api/cloudStorage/RemoteFileContent";
import { UploadFileParams } from "../types/api/cloudStorage/UploadFileParams";
import TokenRefreshParams from "../types/api/oauth/TokenRefreshParams";
import TokenRefreshResult from "../types/api/oauth/TokenRefreshResult";
import * as DropboxClient from "./DropboxClient";
import * as GoogleDriveClient from "./GoogleDriveClient";
import * as DeviceStorageClient from "./DeviceStorageClient";

import { logger } from "../utils/logger";
import Provider from "../types/api/Provider";
import UserInfoType from "../types/UserInfoType";
import { triggerGlobalError } from "../events/errorBus";

export const fetchUserInfo = async (
  token: string,
  provider: Provider,
  setUserInfo: (data: UserInfoType) => void,
  callback?: () => void
): Promise<void> => {
  switch (provider) {
    case "dropbox":
      return DropboxClient.fetchUserInfo(token, setUserInfo, callback);

    case "googleDrive":
      return GoogleDriveClient.fetchUserInfo(token, setUserInfo, callback);

    case "device":
      return DeviceStorageClient.fetchUserInfo(token, setUserInfo, callback);

    default: {
      const _exhaustiveCheck: never = provider as never;
      logger.error(
        "[CloudStorage] Unsupported provider for user info:",
        provider
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

export const fetchRemoteVaultFile = async (
  params: FetchFileParams
): Promise<RemoteFileContent> => {
  const { provider, accessToken, remotePath } = params;

  switch (provider) {
    case "dropbox":
      return DropboxClient.fetchFile(accessToken, remotePath);
    case "googleDrive":
      return GoogleDriveClient.fetchFile(accessToken, remotePath);
    case "device":
      return DeviceStorageClient.fetchFile();
    default: {
      const _exhaustiveCheck: never = provider;
      logger.error("[CloudStorage] Unsupported provider:", provider);
      return null;
    }
  }
};

export const uploadRemoteVaultFile = async (
  params: UploadFileParams
): Promise<void> => {
  const { provider, accessToken, remotePath, content, onCompleted } = params;

  try {
    await DeviceStorageClient.uploadFile(content);
  } catch (error) {
    logger.error(
      "[CloudStorage] Fehler beim lokalen Speichern über DeviceStorageClient:",
      error
    );
  }

  switch (provider) {
    case "dropbox":
      return DropboxClient.uploadFile(
        accessToken,
        content,
        remotePath,
        onCompleted
      );

    case "googleDrive":
      return GoogleDriveClient.uploadFile(
        accessToken,
        content,
        remotePath,
        onCompleted
      );
    case "device":
      break;
    default: {
      const _exhaustiveCheck: never = provider;
      logger.error("[CloudStorage] Unsupported provider for upload:", provider);
      throw new Error("Unsupported cloud storage provider");
    }
  }
};

export const refreshAccessToken = async (
  params: TokenRefreshParams
): Promise<TokenRefreshResult> => {
  const { provider, refreshToken } = params;

  switch (provider) {
    case "dropbox":
      return DropboxClient.refreshAccessToken(refreshToken);
    case "googleDrive":
      return GoogleDriveClient.refreshAccessToken(refreshToken);
    case "device":
      throw new Error("[OAuth] Device provider does not support token refresh");
    default: {
      const _exhaustiveCheck: never = provider;
      throw new Error(`[OAuth] Unsupported provider: ${String(provider)}`);
    }
  }
};

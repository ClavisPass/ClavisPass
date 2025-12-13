import RemoteFileContent from "../../types/api/cloudStorage/RemoteFileContent";
import TokenRefreshResult from "../../types/api/oauth/TokenRefreshResult";
import { GOOGLE_CLIENT_ID } from "@env";
import CryptoType from "../crypto/CryptoType";
import { logger } from "../logging/logger";
import UserInfoType from "../../features/sync/model/UserInfoType";
import { triggerGlobalError } from "../events/errorBus";
import * as DeviceStorageClient from "./DeviceStorageClient";

export const fetchUserInfo = async (
  token: string,
  setUserInfo: (data: UserInfoType) => void,
  callback?: () => void
): Promise<void> => {
  if (!token) {
    callback?.();
    return;
  }

  try {
    const response = await fetch(
      "https://www.googleapis.com/drive/v3/about?fields=user",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      callback?.();
      triggerGlobalError({
        title: "GoogleDrive",
        message: "Network error while fetching user info.",
        code: "FETCH_USER_INFORMATION_FAILED",
      });
      throw new Error("Failed to fetch Google Drive user information");
    }

    const data = await response.json();

    const user = data.user ?? {};
    const userData: UserInfoType = {
      username: user.displayName ?? user.emailAddress ?? "Google Drive User",
      avatar: user.photoLink ?? null,
    };

    setUserInfo(userData);
    callback?.();
  } catch (error) {
    logger.error(
      "[GoogleDrive] Network error while fetching user info:",
      error
    );
    triggerGlobalError({
      title: "GoogleDrive",
      message: "Network error while fetching user info.",
      code: "FETCH_USER_INFORMATION_FAILED",
    });
    callback?.();
  }
};

export const fetchFile = async (
  accessToken: string,
  fileId: string
): Promise<RemoteFileContent> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(
        fileId
      )}?alt=media`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      logger.warn(
        `[GoogleDrive] Failed to download file "${fileId}": ${response.status} ${response.statusText}`
      );
      return null;
    }

    const fileContent = await response.text();
    return fileContent;
  } catch (error) {
    logger.error("[GoogleDrive] Error downloading file:", error);
    triggerGlobalError({
      title: "GoogleDrive",
      message: "Error downloading file.",
      code: "FETCH_FILE_FAILED",
    });
    return null;
  }
};

export const uploadFile = async (
  accessToken: string,
  content: CryptoType,
  fileId: string,
  onCompleted?: () => void
): Promise<void> => {
  try {
    await DeviceStorageClient.uploadFile(content);
  } catch (error) {
    logger.error(
      "[GoogleDrive] DeviceStorage save failed (continuing):",
      error
    );
  }

  const uploadEndpoint = `https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(
    fileId
  )}?uploadType=media`;

  const response = await fetch(uploadEndpoint, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/octet-stream",
    },
    // Wenn du statt JSON-String reinen Ciphertext hast (z. B. Uint8Array),
    // kannst du den hier direkt als body verwenden.
    body: JSON.stringify(content),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    logger.error(
      `[GoogleDrive] Error uploading file "${fileId}":`,
      response.status,
      response.statusText,
      errorText
    );
    triggerGlobalError({
      title: "GoogleDrive",
      message: "Error uploading file.",
      code: "UPLOAD_FILE_FAILED",
    });
    throw new Error("Error uploading the file to Google Drive");
  }

  // Optional: Response auswerten
  // const data = await response.json();

  onCompleted?.();
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<TokenRefreshResult> => {
  const tokenEndpoint = "https://oauth2.googleapis.com/token";

  try {
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: GOOGLE_CLIENT_ID,
        //client_secret: GOOGLE_CLIENT_SECRET,
      }).toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      logger.error("[GoogleDrive] Error refreshing token:", data);
      triggerGlobalError({
        title: "GoogleDrive",
        message: "Error during token refresh.",
        code: "TOKEN_REFRESH_FAILED",
      });
      throw new Error(
        data.error_description || "Failed to refresh Google Drive token"
      );
    }

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      scope: data.scope,
      tokenType: data.token_type,
    };
  } catch (error) {
    logger.error("[GoogleDrive] Error during token refresh:", error);
    triggerGlobalError({
      title: "GoogleDrive",
      message: "Error during token refresh.",
      code: "TOKEN_REFRESH_FAILED",
    });
    throw error;
  }
};

import RemoteFileContent from "../model/RemoteFileContent";
import TokenRefreshResult from "../model/oauth/TokenRefreshResult";
import { DROPBOX_CLIENT_ID } from "@env";
import CryptoType from "../../crypto/CryptoType";
import { logger } from "../../logging/logger";
import UserInfoType from "../../../features/sync/model/UserInfoType";
import { triggerGlobalError } from "../../events/errorBus";
import * as DeviceStorageClient from "./DeviceStorageClient";
import { VaultFetchResult } from "../model/VaultFetchResult";

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
      "https://api.dropboxapi.com/2/users/get_current_account",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      callback?.();
      triggerGlobalError({
        title: "Dropbox",
        message: "Network error while fetching user info.",
        code: "FETCH_USER_INFORMATION_FAILED",
      });
      throw new Error("Failed to fetch Dropbox user information");
    }

    const data = await response.json();
    const userData: UserInfoType = {
      username: data.name?.display_name ?? "Dropbox User",
      avatar: data.profile_photo_url ?? null,
    };

    setUserInfo(userData);
    callback?.();
  } catch (error) {
    logger.error("[Dropbox] Network error while fetching user info:", error);
    triggerGlobalError({
      title: "Dropbox",
      message: "Network error while fetching user info.",
      code: "FETCH_USER_INFORMATION_FAILED",
    });
    callback?.();
  }
};

export const fetchFile = async (
  accessToken: string,
  filePath: string
): Promise<VaultFetchResult> => {
  const normalizedPath = filePath.startsWith("/") ? filePath : `/${filePath}`;

  try {
    const response = await fetch("https://content.dropboxapi.com/2/files/download", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Dropbox-API-Arg": JSON.stringify({ path: normalizedPath }),
      },
    });

    if (response.ok) {
      const content = await response.text();
      return { status: "ok", content };
    }

    // Dropbox: Not found kommt oft als 409 + JSON error payload
    const bodyText = await response.text().catch(() => "");
    let body: any = null;
    try { body = bodyText ? JSON.parse(bodyText) : null; } catch {}

    const isNotFound =
      response.status === 409 &&
      body?.error_summary?.includes("path/not_found");

    if (isNotFound) {
      return { status: "not_found" };
    }

    logger.warn("[Dropbox] fetch failed:", response.status, response.statusText, bodyText);

    return {
      status: "error",
      message: `Dropbox fetch failed (${response.status})`,
      cause: bodyText,
    };
  } catch (e) {
    logger.warn("[Dropbox] network/error:", e);
    return { status: "error", message: "Dropbox network error", cause: e };
  }
};

export const uploadFile = async (
  accessToken: string,
  content: CryptoType,
  filePath: string,
  onCompleted?: () => void
): Promise<void> => {
  try {
    await DeviceStorageClient.uploadFile(content);
  } catch (error) {
    logger.error("[Dropbox] DeviceStorage save failed (continuing):", error);
  }

  const uploadEndpoint = "https://content.dropboxapi.com/2/files/upload";

  const normalizedPath = filePath.startsWith("/") ? filePath : `/${filePath}`;

  const response = await fetch(uploadEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Dropbox-API-Arg": JSON.stringify({
        path: normalizedPath,
        mode: "overwrite",
        autorename: false,
        mute: false,
      }),
      "Content-Type": "application/octet-stream",
    },
    body: JSON.stringify(content),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    logger.error(
      `[Dropbox] Fehler beim Hochladen der Datei "${normalizedPath}":`,
      response.status,
      response.statusText,
      errorText
    );
    triggerGlobalError({
      title: "Dropbox",
      message: "Error uploading file.",
      code: "UPLOAD_FILE_FAILED",
    });
    throw new Error("Error uploading the file to Dropbox");
  }

  // Optional: Response auswerten
  // const data = await response.json();

  onCompleted?.();
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<TokenRefreshResult> => {
  const tokenEndpoint = "https://api.dropboxapi.com/oauth2/token";

  try {
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: DROPBOX_CLIENT_ID,
      }).toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      logger.error("[Dropbox] Error refreshing token:", data);
      triggerGlobalError({
        title: "Dropbox",
        message: "Error during token refresh.",
        code: "TOKEN_REFRESH_FAILED",
      });
      throw new Error(
        data.error_description || "Failed to refresh Dropbox token"
      );
    }

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      scope: data.scope,
      tokenType: data.token_type,
    };
  } catch (error) {
    logger.error("[Dropbox] Error during token refresh:", error);
    triggerGlobalError({
      title: "Dropbox",
      message: "Error during token refresh.",
      code: "TOKEN_REFRESH_FAILED",
    });
    throw error;
  }
};

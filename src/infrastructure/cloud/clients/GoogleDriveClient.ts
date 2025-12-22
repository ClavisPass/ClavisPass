// GoogleDriveClient.ts (FINAL, appDataFolder)
//
// Keine Verwendung von uploadType=media.
// Upsert: list -> (PATCH multipart) oder (POST multipart).

import TokenRefreshResult from "../model/oauth/TokenRefreshResult";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "@env";
import CryptoType from "../../crypto/CryptoType";
import { logger } from "../../logging/logger";
import UserInfoType from "../../../features/sync/model/UserInfoType";
import { triggerGlobalError } from "../../events/errorBus";
import * as DeviceStorageClient from "./DeviceStorageClient";
import { VaultFetchResult } from "../model/VaultFetchResult";

const DRIVE_API = "https://www.googleapis.com/drive/v3";
const DRIVE_UPLOAD_API = "https://www.googleapis.com/upload/drive/v3";
const SPACE = "appDataFolder";

function escapeDriveQueryString(value: string) {
  return value.replace(/'/g, "\\'");
}

async function readTextSafe(res: Response) {
  return await res.text().catch(() => "");
}

async function readJsonSafe(res: Response) {
  const text = await readTextSafe(res);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function findFileIdByName(
  accessToken: string,
  name: string
): Promise<string | null> {
  const q = `name='${escapeDriveQueryString(name)}' and trashed=false`;

  const url =
    `${DRIVE_API}/files?` +
    new URLSearchParams({
      q,
      spaces: SPACE,
      fields: "files(id,name)",
      pageSize: "1",
    }).toString();

  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await readJsonSafe(res);

  if (!res.ok) {
    logger.error("[GoogleDrive] findFileIdByName failed:", res.status, data);
    throw new Error("Google Drive file lookup failed");
  }

  const id = (data as any)?.files?.[0]?.id ?? null;
  logger.info("[GoogleDrive] findFileIdByName", { name, id });
  return id;
}

function buildMultipartBody(
  metadata: Record<string, any>,
  contentText: string,
  boundary: string
) {
  return (
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: application/octet-stream\r\n\r\n` +
    `${contentText}\r\n` +
    `--${boundary}--`
  );
}

/**
 * Upsert im appDataFolder:
 * - PATCH multipart mit echter fileId (niemals name!)
 * - POST multipart wenn nicht vorhanden
 */
async function upsertByName(
  accessToken: string,
  name: string,
  contentText: string
): Promise<void> {
  const boundary = `----clavispass-${Math.random().toString(16).slice(2)}`;
  const fileId = await findFileIdByName(accessToken, name);

  const method = fileId ? "PATCH" : "POST";
  const url = fileId
    ? `${DRIVE_UPLOAD_API}/files/${encodeURIComponent(fileId)}?uploadType=multipart`
    : `${DRIVE_UPLOAD_API}/files?uploadType=multipart`;

  logger.info("[GoogleDrive] upsertByName", { name, fileId, method, url });

  const metadata: Record<string, any> = fileId
  ? { name }
  : { name, parents: ["appDataFolder"] };
  const body = buildMultipartBody(metadata, contentText, boundary);

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  const data = await readJsonSafe(res);
  logger.info("[GoogleDrive] upsert response", data);

  if (!res.ok) {
    logger.error(`[GoogleDrive] Upsert failed for "${name}":`, res.status, data);
    throw new Error("Error uploading the file to Google Drive");
  }
}

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
  filePath: string
): Promise<VaultFetchResult> => {
  const name = filePath;

  try {
    const fileId = await findFileIdByName(accessToken, name);

    if (!fileId) {
      return { status: "not_found" };
    }

    const url = `${DRIVE_API}/files/${encodeURIComponent(fileId)}?alt=media`;
    logger.info("[GoogleDrive] fetchFile", { name, fileId, url });

    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.ok) {
      const content = await response.text();
      return { status: "ok", content };
    }

    const body = await readJsonSafe(response);

    if (response.status === 404) {
      return { status: "not_found" };
    }

    logger.warn("[GoogleDrive] fetch failed:", response.status, body);

    return {
      status: "error",
      message: `Google Drive fetch failed (${response.status})`,
      cause: body,
    };
  } catch (e) {
    logger.warn("[GoogleDrive] network/error:", e);
    return { status: "error", message: "Google Drive network error", cause: e };
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
    logger.error("[GoogleDrive] DeviceStorage save failed (continuing):", error);
  }

  const name = filePath;

  try {
    await upsertByName(accessToken, name, JSON.stringify(content));
    onCompleted?.();
  } catch (error) {
    logger.error(`[GoogleDrive] Error uploading file "${name}":`, error);
    triggerGlobalError({
      title: "Google Drive",
      message: "Error uploading file.",
      code: "UPLOAD_FILE_FAILED",
    });
    throw new Error("Error uploading the file to Google Drive");
  }
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<TokenRefreshResult> => {
  const tokenEndpoint = "https://oauth2.googleapis.com/token";

  try {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: GOOGLE_CLIENT_ID,
    });

    if (GOOGLE_CLIENT_SECRET) {
      body.set("client_secret", GOOGLE_CLIENT_SECRET);
    }

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await readJsonSafe(response);

    if (!response.ok) {
      logger.error("[GoogleDrive] Error refreshing token:", data);
      triggerGlobalError({
        title: "Google Drive",
        message: "Error during token refresh.",
        code: "TOKEN_REFRESH_FAILED",
      });
      throw new Error(
        (data as any)?.error_description || "Failed to refresh Google token"
      );
    }

    return {
      accessToken: (data as any)?.access_token,
      expiresIn: (data as any)?.expires_in,
      scope: (data as any)?.scope,
      tokenType: (data as any)?.token_type,
    };
  } catch (error) {
    logger.error("[GoogleDrive] Error during token refresh:", error);
    triggerGlobalError({
      title: "Google Drive",
      message: "Error during token refresh.",
      code: "TOKEN_REFRESH_FAILED",
    });
    throw error;
  }
};

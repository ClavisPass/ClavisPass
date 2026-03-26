import { triggerGlobalError } from "../../events/errorBus";
import { logger } from "../../logging/logger";
import { getOrCreateDeviceId } from "../../device/deviceId";
import UserInfoType from "../../../features/sync/model/UserInfoType";
import ClavisPassHubDiscoveryResult from "../model/ClavisPassHubDiscoveryResult";
import { VaultFetchResult } from "../model/VaultFetchResult";
import TokenRefreshResult from "../model/oauth/TokenRefreshResult";
import { UploadContent } from "../model/UploadFileParams";
import * as DeviceStorageClient from "./DeviceStorageClient";
import {
  clearClavisPassHubVaultEtag,
  getClavisPassHubHostUrl,
  getClavisPassHubVaultEtag,
  setClavisPassHubHostUrl,
  setClavisPassHubLastUsername,
  setClavisPassHubVaultEtag,
} from "./ClavisPassHubConfig";

type HubTokenResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresAt?: number;
  username?: string;
  role?: string;
};

type HubApiErrorPayload = {
  code?: string;
  message?: string;
  error?: string;
};

type VaultMetaResponse = {
  etag?: string | null;
  size?: number;
  updatedAt?: number;
  contentType?: string;
};

type DiscoveryResponse = {
  product?: string;
  status?: string;
  authType?: string;
  selfHosted?: boolean;
};

type HubClientError = Error & {
  code?: string;
  status?: number;
  cause?: unknown;
};

type LoginParams = {
  hostUrl: string;
  username: string;
  password: string;
  deviceId?: string;
};

function createHubError(
  message: string,
  extras?: { code?: string; status?: number; cause?: unknown }
): HubClientError {
  const error = new Error(message) as HubClientError;
  error.code = extras?.code;
  error.status = extras?.status;
  error.cause = extras?.cause;
  return error;
}

function normalizeHostUrl(hostUrl: string): string {
  return hostUrl.trim().replace(/\/+$/, "");
}

function isAbsoluteHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

export function normalizeClavisPassHubHostUrl(hostUrl: string): string {
  return normalizeHostUrl(hostUrl);
}

export function looksLikeClavisPassHubHostUrl(hostUrl: string): boolean {
  return isAbsoluteHttpUrl(normalizeClavisPassHubHostUrl(hostUrl));
}

function calculateExpiresIn(expiresAt?: number): number | undefined {
  if (!expiresAt || Number.isNaN(expiresAt)) return undefined;

  const expiresAtMs = expiresAt > 1_000_000_000_000 ? expiresAt : expiresAt * 1000;
  const expiresInSeconds = Math.floor((expiresAtMs - Date.now()) / 1000);

  return expiresInSeconds > 0 ? expiresInSeconds : undefined;
}

async function readTextSafe(response: Response): Promise<string> {
  return await response.text().catch(() => "");
}

async function readJsonSafe<T = unknown>(response: Response): Promise<T | null> {
  const text = await readTextSafe(response);
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function getConfiguredHostUrl(): Promise<string> {
  const hostUrl = await getClavisPassHubHostUrl();

  if (!hostUrl) {
    throw createHubError("ClavisPass Hub host URL is missing.", {
      code: "HOST_URL_MISSING",
    });
  }

  return hostUrl;
}

function getFriendlyErrorMessage(
  payload: HubApiErrorPayload | null,
  fallback: string
): string {
  return payload?.message || payload?.error || fallback;
}

async function parseHubError(
  response: Response,
  fallbackMessage: string
): Promise<HubClientError> {
  const payload = await readJsonSafe<HubApiErrorPayload>(response);
  const message = getFriendlyErrorMessage(payload, fallbackMessage);
  return createHubError(message, {
    code: payload?.code,
    status: response.status,
    cause: payload,
  });
}

function triggerHubError(title: string, message: string, code: string): void {
  triggerGlobalError({
    title,
    message,
    code,
  });
}

function summarizeVaultText(value: string) {
  return {
    length: value.length,
    empty: value.length === 0,
    prefix: JSON.stringify(value.slice(0, 24)),
    looksLikeJson: value.trimStart().startsWith("{"),
  };
}

export async function checkDiscovery(
  hostUrl: string
): Promise<ClavisPassHubDiscoveryResult> {
  const normalizedHostUrl = normalizeClavisPassHubHostUrl(hostUrl);

  if (!normalizedHostUrl) {
    return { status: "idle" };
  }

  if (!looksLikeClavisPassHubHostUrl(normalizedHostUrl)) {
    return {
      status: "error",
      message: "Bitte eine gültige URL mit http:// oder https:// eingeben.",
    };
  }

  let response: Response;
  try {
    response = await fetch(`${normalizedHostUrl}/api/discovery`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
  } catch (error) {
    logger.warn("[ClavisPassHub] Discovery request failed:", error);
    return {
      status: "error",
      message: "Host nicht erreichbar.",
    };
  }

  if (!response.ok) {
    return {
      status: "error",
      message:
        response.status === 404
          ? "Discovery-Endpoint nicht gefunden."
          : "Server antwortet nicht wie erwartet.",
    };
  }

  const data = await readJsonSafe<DiscoveryResponse>(response);

  if (!data) {
    return {
      status: "error",
      message: "Discovery-Antwort ist kein gültiges JSON.",
    };
  }

  if (data.product !== "ClavisPass Hub" || data.status !== "ok") {
    return {
      status: "error",
      message: "Server ist keine gültige ClavisPass-Hub-Instanz.",
    };
  }

  return {
    status: "success",
    normalizedHostUrl,
  };
}

async function fetchVaultMeta(
  accessToken: string
): Promise<{ exists: boolean; etag: string | null }> {
  const hostUrl = await getConfiguredHostUrl();
  const response = await fetch(`${hostUrl}/api/vault/meta`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (response.status === 404) {
    await clearClavisPassHubVaultEtag();
    logger.info("[ClavisPassHub] fetchVaultMeta: vault not found.");
    return { exists: false, etag: null };
  }

  if (!response.ok) {
    throw await parseHubError(
      response,
      "Failed to load vault metadata from ClavisPass Hub."
    );
  }

  const data = ((await response.json()) ?? {}) as VaultMetaResponse;
  const etag =
    typeof data.etag === "string" && data.etag.length > 0 ? data.etag : null;

  if (etag) {
    await setClavisPassHubVaultEtag(etag);
  } else {
    await clearClavisPassHubVaultEtag();
  }

  logger.info("[ClavisPassHub] fetchVaultMeta:", {
    exists: true,
    etag,
    size: data.size,
    updatedAt: data.updatedAt,
    contentType: data.contentType,
  });

  return { exists: true, etag };
}

async function ensureVaultEtagForUpload(
  accessToken: string
): Promise<{ exists: boolean; etag: string | null }> {
  const storedEtag = await getClavisPassHubVaultEtag();

  if (storedEtag) {
    logger.info("[ClavisPassHub] Using stored ETag for upload.", {
      etag: storedEtag,
    });
    return { exists: true, etag: storedEtag };
  }

  logger.info(
    "[ClavisPassHub] No stored ETag before upload, loading remote vault metadata."
  );
  return await fetchVaultMeta(accessToken);
}

export async function login(
  params: LoginParams
): Promise<HubTokenResponse> {
  const normalizedHostUrl = normalizeHostUrl(params.hostUrl);

  if (!isAbsoluteHttpUrl(normalizedHostUrl)) {
    throw createHubError("Please enter a valid Host URL including http:// or https://.", {
      code: "INVALID_HOST_URL",
    });
  }

  const deviceId = params.deviceId || (await getOrCreateDeviceId());

  let response: Response;
  try {
    response = await fetch(`${normalizedHostUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: params.username.trim(),
        password: params.password,
        deviceId,
      }),
    });
  } catch (error) {
    throw createHubError("Network error while connecting to ClavisPass Hub.", {
      code: "NETWORK_ERROR",
      cause: error,
    });
  }

  if (!response.ok) {
    throw await parseHubError(response, "Unable to sign in to ClavisPass Hub.");
  }

  const data = (await response.json()) as HubTokenResponse;

  await setClavisPassHubHostUrl(normalizedHostUrl);
  await setClavisPassHubLastUsername(params.username);
  await clearClavisPassHubVaultEtag();

  return data;
}

export const logout = async (
  accessToken: string,
  refreshToken: string
): Promise<void> => {
  try {
    const hostUrl = await getConfiguredHostUrl();
    await fetch(`${hostUrl}/api/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });
  } catch (error) {
    logger.warn("[ClavisPassHub] Logout request failed:", error);
  } finally {
    await clearClavisPassHubVaultEtag();
  }
};

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
    const hostUrl = await getConfiguredHostUrl();
    const response = await fetch(`${hostUrl}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const hubError = await parseHubError(
        response,
        "Failed to fetch ClavisPass Hub user information."
      );

      triggerHubError(
        "ClavisPass Hub",
        hubError.code === "USER_DISABLED"
          ? "Your ClavisPass Hub account has been disabled."
          : "Network error while fetching user info.",
        "FETCH_USER_INFORMATION_FAILED"
      );

      throw hubError;
    }

    const data = await response.json();
    setUserInfo({
      username: data?.username ?? "ClavisPass Hub User",
      avatar:
        typeof data?.avatarUrl === "string" && data.avatarUrl.trim().length > 0
          ? data.avatarUrl
          : null,
    });
    callback?.();
  } catch (error) {
    logger.error("[ClavisPassHub] Failed to fetch user info:", error);
    if ((error as HubClientError)?.code === "HOST_URL_MISSING") {
      triggerHubError(
        "ClavisPass Hub",
        "Host URL is missing. Please sign in again.",
        "FETCH_USER_INFORMATION_FAILED"
      );
    }
    callback?.();
  }
};

export const fetchFile = async (
  accessToken: string,
  _filePath: string
): Promise<VaultFetchResult> => {
  try {
    const hostUrl = await getConfiguredHostUrl();
    const response = await fetch(`${hostUrl}/api/vault`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "text/plain",
      },
    });

    if (response.ok) {
      const etag = response.headers.get("etag");
      if (etag) {
        await setClavisPassHubVaultEtag(etag);
      }

      const content = await response.text();
      logger.info("[ClavisPassHub] fetchFile payload summary:", {
        status: response.status,
        contentType: response.headers.get("content-type"),
        etag,
        ...summarizeVaultText(content),
      });
      return { status: "ok", content };
    }

    if (response.status === 404) {
      await clearClavisPassHubVaultEtag();
      logger.info("[ClavisPassHub] fetchFile: vault not found, cleared ETag.");
      return { status: "not_found" };
    }

    const hubError = await parseHubError(
      response,
      "Failed to load vault from ClavisPass Hub."
    );

    if (hubError.code === "USER_DISABLED") {
      triggerHubError(
        "ClavisPass Hub",
        "Your ClavisPass Hub account has been disabled.",
        "FETCH_REMOTE_VAULT_FAILED"
      );
    }

    logger.warn(
      "[ClavisPassHub] fetchFile failed:",
      response.status,
      hubError.code,
      hubError.message
    );

    return {
      status: "error",
      message: hubError.message,
      cause: hubError,
    };
  } catch (error) {
    logger.warn("[ClavisPassHub] network/error:", error);
    return {
      status: "error",
      message: "ClavisPass Hub network error",
      cause: error,
    };
  }
};

export const uploadFile = async (
  accessToken: string,
  content: UploadContent,
  _filePath: string,
  onCompleted?: () => void
): Promise<void> => {
  try {
    await DeviceStorageClient.uploadFile(content);
  } catch (error) {
    logger.error("[ClavisPassHub] DeviceStorage save failed (continuing):", error);
  }

  try {
    const payload =
      typeof content === "string" ? content : JSON.stringify(content);
    const hostUrl = await getConfiguredHostUrl();
    const remoteState = await ensureVaultEtagForUpload(accessToken);
    const etag = remoteState.etag;
    const contentType =
      typeof content === "string"
        ? "text/plain; charset=utf-8"
        : "application/json; charset=utf-8";

    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": contentType,
    };

    if (etag) {
      headers["If-Match"] = etag;
    }

    logger.info("[ClavisPassHub] uploadFile payload summary:", {
      contentType,
      remoteExists: remoteState.exists,
      hasEtag: !!etag,
      etag,
      payloadType: typeof content,
      ...summarizeVaultText(payload),
    });

    let response: Response;
    response = await fetch(`${hostUrl}/api/vault`, {
      method: "PUT",
      headers,
      body: payload,
    });

    if (!response.ok) {
      const hubError = await parseHubError(
        response,
        "Failed to upload vault to ClavisPass Hub."
      );
      const requiresIfMatch =
        hubError.code === "IF_MATCH_REQUIRED" ||
        response.status === 428 ||
        hubError.message.includes("If-Match header is required");

      if (requiresIfMatch) {
        logger.warn(
          "[ClavisPassHub] Upload failed because If-Match was required. Refreshing remote metadata."
        );
        await fetchVaultMeta(accessToken);
      }

      if (
        response.status === 409 ||
        response.status === 412 ||
        hubError.code === "ETAG_MISMATCH" ||
        requiresIfMatch
      ) {
        triggerHubError(
          "ClavisPass Hub",
          "Sync conflict detected. Please reload before saving again.",
          "ETAG_MISMATCH"
        );
        throw createHubError(
          requiresIfMatch
            ? "If-Match header required while uploading vault."
            : "ETag mismatch while uploading vault.",
          {
            code: requiresIfMatch ? "IF_MATCH_REQUIRED" : "ETAG_MISMATCH",
            status: response.status,
            cause: hubError,
          }
        );
      }

      if (hubError.code === "USER_DISABLED") {
        triggerHubError(
          "ClavisPass Hub",
          "Your ClavisPass Hub account has been disabled.",
          "UPLOAD_FILE_FAILED"
        );
      } else {
        triggerHubError(
          "ClavisPass Hub",
          hubError.message || "Error uploading file.",
          "UPLOAD_FILE_FAILED"
        );
      }

      throw hubError;
    }

    const nextEtag = response.headers.get("etag");
    if (nextEtag) {
      await setClavisPassHubVaultEtag(nextEtag);
    }

    logger.info("[ClavisPassHub] uploadFile completed:", {
      status: response.status,
      responseContentType: response.headers.get("content-type"),
      previousEtag: etag,
      nextEtag,
      remoteExists: remoteState.exists,
      ...summarizeVaultText(payload),
    });

    onCompleted?.();
  } catch (error) {
    const hubError = error as HubClientError;

    if (hubError.code === "HOST_URL_MISSING") {
      triggerHubError(
        "ClavisPass Hub",
        "Host URL is missing. Please sign in again.",
        "UPLOAD_FILE_FAILED"
      );
    } else if (!hubError.code && !hubError.status) {
      triggerHubError(
        "ClavisPass Hub",
        "Network error while uploading vault.",
        "UPLOAD_FILE_FAILED"
      );
    }

    throw error;
  }
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<TokenRefreshResult> => {
  try {
    const hostUrl = await getConfiguredHostUrl();

    const response = await fetch(`${hostUrl}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) {
      const hubError = await parseHubError(
        response,
        "Failed to refresh ClavisPass Hub token."
      );

      if (hubError.code === "USER_DISABLED") {
        triggerHubError(
          "ClavisPass Hub",
          "Your ClavisPass Hub account has been disabled.",
          "TOKEN_REFRESH_FAILED"
        );
      } else {
        triggerHubError(
          "ClavisPass Hub",
          hubError.message || "Error during token refresh.",
          "TOKEN_REFRESH_FAILED"
        );
      }

      throw hubError;
    }

    const data = (await response.json()) as HubTokenResponse;

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: calculateExpiresIn(data.expiresAt),
      tokenType: data.tokenType,
    };
  } catch (error) {
    const hubError = error as HubClientError;

    if (hubError.code === "HOST_URL_MISSING") {
      triggerHubError(
        "ClavisPass Hub",
        "Host URL is missing. Please sign in again.",
        "TOKEN_REFRESH_FAILED"
      );
    } else if (!hubError.code && !hubError.status) {
      triggerHubError(
        "ClavisPass Hub",
        "Network error during token refresh.",
        "TOKEN_REFRESH_FAILED"
      );
    }
    throw error;
  }
};

import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "../../logging/logger";

const HOST_URL_KEY = "CLAVISPASS_HUB_HOST_URL";
const LAST_USERNAME_KEY = "CLAVISPASS_HUB_LAST_USERNAME";
const VAULT_ETAG_KEY = "CLAVISPASS_HUB_VAULT_ETAG";

function normalizeHostUrl(hostUrl: string): string {
  return hostUrl.trim().replace(/\/+$/, "");
}

export async function getClavisPassHubHostUrl(): Promise<string | null> {
  try {
    const value = await AsyncStorage.getItem(HOST_URL_KEY);
    if (!value) return null;
    return normalizeHostUrl(value);
  } catch (error) {
    logger.error("[ClavisPassHubConfig] Failed to read host URL:", error);
    return null;
  }
}

export async function setClavisPassHubHostUrl(hostUrl: string): Promise<string> {
  const normalized = normalizeHostUrl(hostUrl);
  await AsyncStorage.setItem(HOST_URL_KEY, normalized);
  return normalized;
}

export async function getClavisPassHubLastUsername(): Promise<string> {
  try {
    return (await AsyncStorage.getItem(LAST_USERNAME_KEY)) ?? "";
  } catch (error) {
    logger.error("[ClavisPassHubConfig] Failed to read username:", error);
    return "";
  }
}

export async function setClavisPassHubLastUsername(
  username: string
): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_USERNAME_KEY, username.trim());
  } catch (error) {
    logger.error("[ClavisPassHubConfig] Failed to persist username:", error);
  }
}

export async function getClavisPassHubVaultEtag(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(VAULT_ETAG_KEY);
  } catch (error) {
    logger.error("[ClavisPassHubConfig] Failed to read ETag:", error);
    return null;
  }
}

export async function setClavisPassHubVaultEtag(etag: string): Promise<void> {
  try {
    await AsyncStorage.setItem(VAULT_ETAG_KEY, etag);
  } catch (error) {
    logger.error("[ClavisPassHubConfig] Failed to persist ETag:", error);
  }
}

export async function clearClavisPassHubVaultEtag(): Promise<void> {
  try {
    await AsyncStorage.removeItem(VAULT_ETAG_KEY);
  } catch (error) {
    logger.error("[ClavisPassHubConfig] Failed to clear ETag:", error);
  }
}


import { Platform } from "react-native";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_ID_ANDROID,
  GOOGLE_CLIENT_ID_DESKTOP,
  GOOGLE_CLIENT_ID_IOS,
  GOOGLE_CLIENT_SECRET_DESKTOP,
} from "@env";

const GOOGLE_REDIRECT_PATH = "/oauth2redirect";
const GOOGLE_LOOPBACK_HOST = "127.0.0.1";

function normalizeClientId(value: string | undefined): string {
  const trimmed = value?.trim() ?? "";

  if (!trimmed || trimmed.toLowerCase() === "empty") {
    return "";
  }

  return trimmed;
}

function toReverseClientIdScheme(clientId: string): string | null {
  const suffix = ".apps.googleusercontent.com";

  if (!clientId || !clientId.endsWith(suffix)) {
    return null;
  }

  const prefix = clientId.slice(0, -suffix.length);
  if (!prefix) {
    return null;
  }

  return `com.googleusercontent.apps.${prefix}`;
}

export function getGoogleClientIdForCurrentPlatform(): string {
  const fallbackClientId = normalizeClientId(GOOGLE_CLIENT_ID);

  if (Platform.OS === "ios") {
    return normalizeClientId(GOOGLE_CLIENT_ID_IOS) || fallbackClientId;
  }

  if (Platform.OS === "android") {
    return normalizeClientId(GOOGLE_CLIENT_ID_ANDROID) || fallbackClientId;
  }

  return getGoogleDesktopClientId();
}

export function getGoogleDesktopClientId(): string {
  return (
    normalizeClientId(GOOGLE_CLIENT_ID_DESKTOP) ||
    normalizeClientId(GOOGLE_CLIENT_ID)
  );
}

export function getGoogleDesktopClientSecret(): string {
  return normalizeClientId(GOOGLE_CLIENT_SECRET_DESKTOP);
}

export function buildGoogleLoopbackRedirectUri(port: number): string {
  return `http://${GOOGLE_LOOPBACK_HOST}:${port}`;
}

export function getGoogleMobileRedirectUri(): string | null {
  const clientId = getGoogleClientIdForCurrentPlatform();
  const scheme = toReverseClientIdScheme(clientId);

  if (!scheme) {
    return null;
  }

  return `${scheme}:${GOOGLE_REDIRECT_PATH}`;
}

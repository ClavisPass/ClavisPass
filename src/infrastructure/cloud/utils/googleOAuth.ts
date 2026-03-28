import { Platform } from "react-native";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_ID_ANDROID,
  GOOGLE_CLIENT_ID_DESKTOP,
  GOOGLE_CLIENT_ID_IOS,
} from "@env";

const GOOGLE_REDIRECT_PATH = "/oauth2redirect";

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
  if (Platform.OS === "ios") {
    return GOOGLE_CLIENT_ID_IOS || GOOGLE_CLIENT_ID;
  }

  if (Platform.OS === "android") {
    return GOOGLE_CLIENT_ID_ANDROID || GOOGLE_CLIENT_ID;
  }

  return GOOGLE_CLIENT_ID_DESKTOP || GOOGLE_CLIENT_ID;
}

export function getGoogleMobileRedirectUri(): string | null {
  const clientId = getGoogleClientIdForCurrentPlatform();
  const scheme = toReverseClientIdScheme(clientId);

  if (!scheme) {
    return null;
  }

  return `${scheme}:${GOOGLE_REDIRECT_PATH}`;
}

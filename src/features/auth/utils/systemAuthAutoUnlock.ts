import { Platform } from "react-native";

const SUPPRESS_NEXT_SYSTEM_AUTH_AUTO_UNLOCK =
  "clavispass:suppress-next-system-auth-auto-unlock";

export function suppressNextSystemAuthAutoUnlock() {
  if (Platform.OS !== "web" || typeof sessionStorage === "undefined") return;

  try {
    sessionStorage.setItem(SUPPRESS_NEXT_SYSTEM_AUTH_AUTO_UNLOCK, "1");
  } catch {}
}

export function consumeSystemAuthAutoUnlockSuppression() {
  if (Platform.OS !== "web" || typeof sessionStorage === "undefined") {
    return false;
  }

  try {
    const suppressed =
      sessionStorage.getItem(SUPPRESS_NEXT_SYSTEM_AUTH_AUTO_UNLOCK) === "1";
    sessionStorage.removeItem(SUPPRESS_NEXT_SYSTEM_AUTH_AUTO_UNLOCK);
    return suppressed;
  } catch {
    return false;
  }
}

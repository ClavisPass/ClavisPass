import { Platform } from "react-native";

// Optional: Expo native info (iOS/Android)
let ExpoDevice: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ExpoDevice = require("expo-device");
} catch {
  ExpoDevice = null;
}

type DeviceIdentity = {
  hostname: string;
  platform: string;
};

async function tryGetTauriDeviceIdentity(): Promise<DeviceIdentity | null> {
  // Web === Desktop renderer (Tauri)
  if (Platform.OS !== "web") return null;

  try {
    const { invoke } = await import("@tauri-apps/api/core");
    return (await invoke("get_device_identity")) as DeviceIdentity;
  } catch {
    // In deinem Desktop-Setup soll das eigentlich immer gehen, aber wir geben null zurück,
    // damit Save/Sync nicht hart crasht, falls Tauri-Backend noch nicht updated ist.
    return null;
  }
}

/**
 * Desktop (web/tauri): hostname
 * Mobile (ios/android): expo-device deviceName/modelName
 */
export async function getDeviceDisplayName(): Promise<string> {
  // Desktop/Tauri
  const tauri = await tryGetTauriDeviceIdentity();
  if (tauri?.hostname?.trim()) return tauri.hostname.trim();

  // Mobile
  if (Platform.OS === "ios" || Platform.OS === "android") {
    const expoName =
      ExpoDevice?.deviceName ||
      ExpoDevice?.modelName ||
      ExpoDevice?.modelId ||
      null;

    if (expoName && String(expoName).trim()) return String(expoName).trim();

    // minimal fallback
    return Platform.OS === "ios" ? "iPhone/iPad" : "Android device";
  }

  // If you *ever* run true browser web, you can change this later.
  // For now: keep deterministic fallback.
  return "Desktop";
}

/**
 * Desktop (web/tauri): "windows • x86_64" (or whatever your command returns)
 * Mobile: "iOS" / "Android"
 */
export async function getPlatformString(): Promise<string> {
  // Desktop/Tauri
  const tauri = await tryGetTauriDeviceIdentity();
  if (tauri?.platform?.trim()) return tauri.platform.trim();

  // Mobile
  if (Platform.OS === "ios") return "iOS";
  if (Platform.OS === "android") return "Android";

  // deterministic fallback
  return Platform.OS;
}

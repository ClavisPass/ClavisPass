import { useEffect, useState } from "react";
import { Platform } from "react-native";

declare global {
  interface Window {
    __TAURI__?: unknown;
    __TAURI_INTERNALS__?: unknown;
    __TAURI_IPC__?: unknown;
  }
}

let detectedTauriPromise: Promise<boolean> | null = null;

export function isWebPlatform() {
  return Platform.OS === "web";
}

export function isTauriEnvironment() {
  if (!isWebPlatform() || typeof window === "undefined") {
    return false;
  }

  return Boolean(
    window.__TAURI__ || window.__TAURI_INTERNALS__ || window.__TAURI_IPC__,
  );
}

export async function detectTauriEnvironment(): Promise<boolean> {
  if (isTauriEnvironment()) {
    return true;
  }

  if (!isWebPlatform()) {
    return false;
  }

  if (!detectedTauriPromise) {
    detectedTauriPromise = (async () => {
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        return typeof invoke === "function";
      } catch {
        return false;
      }
    })();
  }

  return detectedTauriPromise;
}

export function useIsTauriEnvironment() {
  const [isTauri, setIsTauri] = useState(isTauriEnvironment());

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const detected = await detectTauriEnvironment();
      if (!cancelled) {
        setIsTauri(detected);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return isTauri;
}

export default isTauriEnvironment;

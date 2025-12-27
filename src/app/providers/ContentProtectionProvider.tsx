// ContentProtectionProvider.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Platform } from "react-native";

/**
 * Native (iOS/Android) screen-capture control via expo-screen-capture.
 * We lazy-import so web/tauri builds don't pull native modules unnecessarily.
 */
async function applyNativeContentProtection(enabled: boolean): Promise<void> {
  if (Platform.OS === "web") return;

  try {
    const ScreenCapture = await import("expo-screen-capture");
    if (enabled) {
      await ScreenCapture.preventScreenCaptureAsync();
    } else {
      await ScreenCapture.allowScreenCaptureAsync();
    }
  } catch (e) {
    // If expo-screen-capture isn't available for some reason, surface the error
    // so the caller can decide whether to rollback UI state.
    throw e;
  }
}

/**
 * Best-effort detection for "running inside Tauri".
 * - Works by attempting to import Tauri API.
 * - In a normal browser bundle, the import often fails (caught).
 */
async function detectTauri(): Promise<boolean> {
  if (Platform.OS !== "web") return false;
  try {
    const { invoke } = await import("@tauri-apps/api/core");
    return typeof invoke === "function";
  } catch {
    return false;
  }
}

async function applyTauriContentProtection(enabled: boolean): Promise<void> {
  if (Platform.OS !== "web") return;

  const { invoke } = await import("@tauri-apps/api/core");
  await invoke("set_content_protection", { enabled });
}

export type ContentProtectionContextValue = {
  /** Current session state (not persisted). */
  enabled: boolean;

  /** True if we believe a desktop policy can be applied (Tauri on web). */
  supportsDesktopToggle: boolean;

  /** Sets the session state and applies platform-specific behavior (Tauri + native hooks). */
  setEnabled: (next: boolean) => Promise<void>;

  /** Convenience helper. */
  toggle: () => Promise<void>;
};

const ContentProtectionContext =
  createContext<ContentProtectionContextValue | null>(null);

/**
 * ContentProtectionProvider (session-only)
 * - Centralizes all switching logic:
 *   - iOS/Android: expo-screen-capture prevent/allow
 *   - Tauri (web): invoke("set_content_protection", ...)
 * - No persistence: after restart defaultEnabled applies again.
 */
export function ContentProtectionProvider({
  children,
  defaultEnabled = true,
}: {
  children: ReactNode;
  defaultEnabled?: boolean;
}) {
  const [enabled, setEnabledState] = useState<boolean>(defaultEnabled);
  const [supportsDesktopToggle, setSupportsDesktopToggle] =
    useState<boolean>(false);

  // Ensure detection is performed once per app session (web only)
  const detectedRef = useRef(false);

  const ensureDetected = useCallback(async () => {
    if (detectedRef.current) return;
    detectedRef.current = true;

    const isTauri = await detectTauri();
    setSupportsDesktopToggle(isTauri);
  }, []);

  /**
   * Apply protection for the current platform, best-effort.
   * For web:
   * - only applies if we're inside Tauri (supportsDesktopToggle = true)
   * For native:
   * - always applies via expo-screen-capture
   */
  const applyForPlatform = useCallback(
    async (next: boolean) => {
      if (Platform.OS === "web") {
        await ensureDetected();
        if (!supportsDesktopToggle) return;
        await applyTauriContentProtection(next);
        return;
      }

      await applyNativeContentProtection(next);
    },
    [ensureDetected, supportsDesktopToggle]
  );

  /**
   * Set enabled:
   * - OS first, then state (prevents UI from claiming "off" if OS call fails)
   */
  const setEnabled = useCallback(
    async (next: boolean) => {
      await applyForPlatform(next);
      setEnabledState(next);
    },
    [applyForPlatform]
  );

  const toggle = useCallback(async () => {
    await setEnabled(!enabled);
  }, [enabled, setEnabled]);

  /**
   * Initial application:
   * - When provider mounts, apply defaultEnabled for the current platform.
   * - This replaces the old <ContentProtection enabled={...}/> side-effect components.
   */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await applyForPlatform(enabled);
      } catch {
        // If initial apply fails, we keep state. You can optionally flip supportsDesktopToggle off.
        // We intentionally do not change state here to avoid surprising the user on startup.
      }
    })();

    return () => {
      cancelled = true;
    };
    // applyForPlatform is stable enough; enabled is initial state unless you change defaultEnabled
  }, [applyForPlatform]); // do NOT include enabled; we only want initial apply here.

  const value = useMemo<ContentProtectionContextValue>(
    () => ({ enabled, supportsDesktopToggle, setEnabled, toggle }),
    [enabled, supportsDesktopToggle, setEnabled, toggle]
  );

  return (
    <ContentProtectionContext.Provider value={value}>
      {children}
    </ContentProtectionContext.Provider>
  );
}

export function useContentProtection(): ContentProtectionContextValue {
  const ctx = useContext(ContentProtectionContext);
  if (!ctx) {
    throw new Error(
      "useContentProtection must be used within ContentProtectionProvider"
    );
  }
  return ctx;
}

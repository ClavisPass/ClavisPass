import { useEffect } from "react";
import { Platform } from "react-native";

import { useAuth } from "../../../app/providers/AuthProvider";
import { useVault } from "../../../app/providers/VaultProvider";
import { logger } from "../../../infrastructure/logging/logger";

const BRIDGE_SESSION_HEARTBEAT_MS = 1500;

function BrowserBridgeSessionSync() {
  const auth = useAuth();
  const vault = useVault();

  useEffect(() => {
    if (Platform.OS !== "web") return;

    let cancelled = false;

    const syncBridgeSession = async () => {
      try {
        const { invoke } = await import("@tauri-apps/api/core");

        if (!auth.isLoggedIn || !vault.isUnlocked || !auth.getMaster()) {
          await invoke("bridge_clear_session");
          return;
        }

        const snapshot = vault.exportFullData();
        await invoke("bridge_publish_session", { vault: snapshot });
      } catch (error) {
        if (!cancelled) {
          logger.warn("[BrowserBridge] Failed to sync desktop bridge session:", error);
        }
      }
    };

    void syncBridgeSession();

    const heartbeat = setInterval(() => {
      void (async () => {
        try {
          if (!auth.isLoggedIn || !vault.isUnlocked || !auth.getMaster()) {
            return;
          }

          await syncBridgeSession();
        } catch (error) {
          if (!cancelled) {
            logger.warn("[BrowserBridge] Failed to heartbeat desktop bridge session:", error);
          }
        }
      })();
    }, BRIDGE_SESSION_HEARTBEAT_MS);

    return () => {
      cancelled = true;
      clearInterval(heartbeat);
    };
  }, [
    auth,
    vault,
    auth.isLoggedIn,
    vault.isUnlocked,
    vault.dirty,
    vault.entries,
    vault.folders,
  ]);

  return null;
}

export default BrowserBridgeSessionSync;

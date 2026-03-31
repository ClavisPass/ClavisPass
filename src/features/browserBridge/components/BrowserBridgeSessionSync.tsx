import { useEffect } from "react";
import { Platform } from "react-native";

import { useAuth } from "../../../app/providers/AuthProvider";
import { useVault } from "../../../app/providers/VaultProvider";
import { logger } from "../../../infrastructure/logging/logger";

function BrowserBridgeSessionSync() {
  const auth = useAuth();
  const vault = useVault();

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const timer = setTimeout(() => {
      void (async () => {
        try {
          const { invoke } = await import("@tauri-apps/api/core");

          if (!auth.isLoggedIn || !vault.isUnlocked || !auth.getMaster()) {
            await invoke("bridge_clear_session");
            return;
          }

          const snapshot = vault.exportFullData();
          await invoke("bridge_publish_session", { vault: snapshot });
        } catch (error) {
          logger.warn("[BrowserBridge] Failed to sync desktop bridge session:", error);
        }
      })();
    }, 180);

    return () => clearTimeout(timer);
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

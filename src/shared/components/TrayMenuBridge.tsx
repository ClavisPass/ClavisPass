import React, { useEffect, useRef } from "react";
import type { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../app/providers/AuthProvider";
import { useSetting } from "../../app/providers/SettingsProvider";
import type { AppTabsParamList } from "../../app/navigation/model/types";
import { logger } from "../../infrastructure/logging/logger";
import { detectTauriEnvironment } from "../../infrastructure/platform/isTauri";

type Props = {
  navigationRef: NavigationContainerRefWithCurrent<AppTabsParamList>;
};

type TauriEvent = {
  payload: unknown;
};

export default function TrayMenuBridge({ navigationRef }: Props) {
  const auth = useAuth();
  const { t, i18n } = useTranslation();
  const { value: closeBehavior } = useSetting("CLOSE_BEHAVIOR");
  const i18nReady = i18n.isInitialized;

  const logoutRef = useRef(auth.logout);
  const isLoggedInRef = useRef(auth.isLoggedIn);
  const navigationRefRef = useRef(navigationRef);

  useEffect(() => {
    logoutRef.current = auth.logout;
    isLoggedInRef.current = auth.isLoggedIn;
    navigationRefRef.current = navigationRef;
  }, [auth.logout, auth.isLoggedIn, navigationRef]);

  useEffect(() => {
    let cancelled = false;
    const unlistenFns: Array<() => void> = [];

    void (async () => {
      try {
        if (!(await detectTauriEnvironment()) || cancelled) return;

        const [{ listen }, { invoke }] = await Promise.all([
          import("@tauri-apps/api/event"),
          import("@tauri-apps/api/core"),
        ]);

        const hadPendingLock = await invoke<boolean>(
          "claim_pending_lock_request",
        );
        if (hadPendingLock && !cancelled) {
          logoutRef.current();
        }

        const unlistenLock = await listen<TauriEvent>("tray://lock-vault", () => {
          logoutRef.current();
          void (async () => {
            try {
              await invoke("claim_pending_lock_request");
            } catch (error) {
              logger.warn(
                "[TrayMenuBridge] Failed to clear pending lock request:",
                error,
              );
            }
          })();
        });
        if (cancelled) {
          unlistenLock();
          return;
        }
        unlistenFns.push(unlistenLock);

        const unlistenSettings = await listen<TauriEvent>(
          "tray://open-settings",
          () => {
            const nav = navigationRefRef.current;
            if (!isLoggedInRef.current || !nav.isReady()) return;

            nav.navigate("SettingsStack", { screen: "Settings" });
          },
        );
        if (cancelled) {
          unlistenSettings();
          return;
        }
        unlistenFns.push(unlistenSettings);
      } catch (error) {
        logger.warn("[TrayMenuBridge] Failed to register tray events:", error);
      }
    })();

    return () => {
      cancelled = true;
      unlistenFns.forEach((unlisten) => unlisten());
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (!i18nReady) return;

      try {
        if (!(await detectTauriEnvironment()) || cancelled) return;

        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("update_tray_menu", {
          labels: {
            show: t("tray:show"),
            lockVault: t("tray:lockVault"),
            settings: t("tray:settings"),
            settingsEnabled: auth.isLoggedIn,
            quit: t("tray:quit"),
          },
        });
      } catch (error) {
        logger.warn("[TrayMenuBridge] Failed to update tray menu:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [auth.isLoggedIn, i18n.language, i18nReady, t]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        if (!(await detectTauriEnvironment()) || cancelled) return;

        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("set_close_behavior", { behavior: closeBehavior });
      } catch (error) {
        logger.warn(
          "[TrayMenuBridge] Failed to sync native close behavior:",
          error,
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [closeBehavior]);

  return null;
}

import React, { useEffect, useRef } from "react";
import type { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../app/providers/AuthProvider";
import type { AppTabsParamList } from "../../app/navigation/model/types";
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
      if (!(await detectTauriEnvironment()) || cancelled) return;

      const { listen } = await import("@tauri-apps/api/event");

      const unlistenLock = await listen<TauriEvent>("tray://lock-vault", () => {
        logoutRef.current();
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
    })();

    return () => {
      cancelled = true;
      unlistenFns.forEach((unlisten) => unlisten());
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (!(await detectTauriEnvironment()) || cancelled) return;

      const { invoke } = await import("@tauri-apps/api/core");
      await invoke("update_tray_menu", {
        labels: {
          show: t("tray:show"),
          lockVault: t("tray:lockVault"),
          settings: t("tray:settings"),
          quit: t("tray:quit"),
        },
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [i18n.language, t]);

  return null;
}

import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Clipboard from "expo-clipboard";
import { logger } from "../../../infrastructure/logging/logger";
import { detectTauriEnvironment } from "../../../infrastructure/platform/isTauri";
import { get as getSetting } from "../../../infrastructure/storage/store";
import {
  FAST_ACCESS_NOTIFICATION_CATEGORY,
  FAST_ACCESS_POPUP_LABEL,
  FAST_ACCESS_READY_EVENT,
  FAST_ACCESS_UPDATE_EVENT,
} from "../constants";
import { hideMobileFastAccess, showMobileFastAccess } from "./mobileFastAccessStore";

let notificationListenerSet = false;
let notificationCategorySet = false;
let notificationHandlerSet = false;
let lastNotificationId: string | null = null;
let notificationPermissionGranted: boolean | null = null;
let activeFastAccessKey: string | null = null;
let activeSessionKey: string | null = null;
let popupReady = false;
let popupReadyListenerSet = false;
let popupReadyResolvers: Array<() => void> = [];

function buildFastAccessKey(title: string, username: string, password: string) {
  return `${activeSessionKey ?? "no-session"}::${title}::${username}::${password}`;
}

function resolvePopupReady() {
  popupReady = true;
  popupReadyResolvers.forEach((resolve) => resolve());
  popupReadyResolvers = [];
}

async function isNotificationStillPresented(notificationId: string) {
  try {
    const presented = await Notifications.getPresentedNotificationsAsync();
    return presented.some((item) => item.request.identifier === notificationId);
  } catch (error) {
    logger.warn(
      "[FastAccess] Failed to inspect presented notifications:",
      error,
    );
    return true;
  }
}

async function ensurePopupReadyListener() {
  if (popupReadyListenerSet) {
    return;
  }

  if (!(await detectTauriEnvironment())) {
    return;
  }

  const { listen } = await import("@tauri-apps/api/event");
  await listen(FAST_ACCESS_READY_EVENT, () => {
    resolvePopupReady();
  });
  popupReadyListenerSet = true;
}

async function waitForPopupReady(timeoutMs = 2000) {
  if (popupReady) {
    return;
  }

  await new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      popupReadyResolvers = popupReadyResolvers.filter((item) => item !== onReady);
      resolve();
    }, timeoutMs);

    const onReady = () => {
      clearTimeout(timer);
      resolve();
    };

    popupReadyResolvers.push(onReady);
  });
}

async function configureMobileFastAccess() {
  if (!notificationHandlerSet) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldShowBanner: true,
        shouldShowList: false,
        shouldSetBadge: false,
      }),
    });
    notificationHandlerSet = true;
  }

  if (!notificationCategorySet) {
    await Notifications.setNotificationCategoryAsync(FAST_ACCESS_NOTIFICATION_CATEGORY, [
      {
        identifier: "COPY_USERNAME",
        buttonTitle: "Username",
        options: { isDestructive: false, opensAppToForeground: false },
      },
      {
        identifier: "COPY_PASSWORD",
        buttonTitle: "Password",
        options: { isDestructive: false, opensAppToForeground: false },
      },
    ]);
    notificationCategorySet = true;
  }

  if (!notificationListenerSet) {
    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = (response.notification.request.content.data as {
        username?: string;
        password?: string;
        title?: string;
      }) || { username: "", password: "" };

      switch (response.actionIdentifier) {
        case "COPY_USERNAME":
          if (data.username) Clipboard.setStringAsync(data.username);
          break;
        case "COPY_PASSWORD":
          if (data.password) Clipboard.setStringAsync(data.password);
          break;
        case Notifications.DEFAULT_ACTION_IDENTIFIER:
          showMobileFastAccess({
            title: data.title ?? response.notification.request.content.title ?? "Fast Access",
            username: data.username ?? "",
            password: data.password ?? "",
          });
          break;
      }
    });
    notificationListenerSet = true;
  }
}

export async function prepareFastAccess() {
  if (await detectTauriEnvironment()) {
    await ensurePopupReadyListener();
    return;
  }

  if (notificationPermissionGranted !== true) {
    const permissions = await Notifications.getPermissionsAsync();
    if (permissions.status === "granted") {
      notificationPermissionGranted = true;
    } else {
      const requested = await Notifications.requestPermissionsAsync();
      notificationPermissionGranted = requested.status === "granted";
    }
  }

  if (notificationPermissionGranted) {
    await configureMobileFastAccess();
  }
}

async function ensurePopupWindow() {
  if (!(await detectTauriEnvironment())) {
    throw new Error("Fast access popup is only available in Tauri.");
  }
  const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");
  let win = await WebviewWindow.getByLabel(FAST_ACCESS_POPUP_LABEL);
  if (win) return win;

  popupReady = false;

  win = new WebviewWindow(FAST_ACCESS_POPUP_LABEL, {
    width: 320,
    height: 150,
    decorations: false,
    resizable: false,
    alwaysOnTop: true,
    visible: false,
    focus: true,
    title: "Fast Access",
  });

  await new Promise<void>((resolve, reject) => {
    win.once("tauri://created", async () => {
      await positionPopup();
      await win.show();
      resolve();
    });
    win.once("tauri://error", (e) => reject(e));
  });

  return win;
}

export async function openFastAccess(
  title: string,
  username: string,
  password: string
) {
  if (await detectTauriEnvironment()) {
    try {
      await prepareFastAccess();
      const win = await ensurePopupWindow();
      await positionPopup();
      await win.show();
      await waitForPopupReady();
      await win.emit(FAST_ACCESS_UPDATE_EVENT, { title, username, password });
    } catch (err) {
      logger.error("Popup-Fenster konnte nicht erstellt/gezeigt werden:", err);
    }
    return;
  }

  await prepareFastAccess();

  if (!notificationPermissionGranted) {
    logger.warn("Permission denied");
    return;
  }

  const nextKey = buildFastAccessKey(title, username, password);
  if (lastNotificationId) {
    const stillPresented = await isNotificationStillPresented(lastNotificationId);
    if (!stillPresented) {
      lastNotificationId = null;
      activeFastAccessKey = null;
    }
  }

  if (lastNotificationId && activeFastAccessKey === nextKey) {
    return;
  }

  if (lastNotificationId) {
    try {
      await Notifications.dismissNotificationAsync(lastNotificationId);
    } catch (error) {
      logger.warn("[FastAccess] Failed to dismiss previous notification:", error);
    }
    lastNotificationId = null;
  }

  lastNotificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      categoryIdentifier: FAST_ACCESS_NOTIFICATION_CATEGORY,
      body: username,
      sound: false,
      data: { title, username, password },
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: null,
  });
  activeFastAccessKey = nextKey;
}

export async function hideFastAccess() {
  if (await detectTauriEnvironment()) {
    try {
      const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");
      const win = await WebviewWindow.getByLabel(FAST_ACCESS_POPUP_LABEL);
      if (win) {
        await win.hide();
      }
    } catch (err) {
      logger.error("Fehler beim Verstecken des Fensters:", err);
    }
  } else {
    hideMobileFastAccess();

    if (lastNotificationId) {
      await Notifications.dismissNotificationAsync(lastNotificationId);
      lastNotificationId = null;
      return;
    }

    await Notifications.dismissAllNotificationsAsync();
  }

  activeFastAccessKey = null;
}

export async function syncFastAccessSession(sessionKey: string | null) {
  if (activeSessionKey === sessionKey) {
    return;
  }

  activeSessionKey = sessionKey;
  activeFastAccessKey = null;
  hideMobileFastAccess();

  if (await detectTauriEnvironment()) {
    const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");
    const win = await WebviewWindow.getByLabel(FAST_ACCESS_POPUP_LABEL);
    if (win) {
      try {
        await win.hide();
      } catch (error) {
        logger.warn("[FastAccess] Failed to hide popup for session sync:", error);
      }
    }
    return;
  }

  if (lastNotificationId) {
    try {
      await Notifications.dismissNotificationAsync(lastNotificationId);
    } catch (error) {
      logger.warn("[FastAccess] Failed to dismiss session notification:", error);
    }
    lastNotificationId = null;
  }

  if (sessionKey === null) {
    try {
      await Notifications.dismissAllNotificationsAsync();
    } catch (error) {
      logger.warn("[FastAccess] Failed to dismiss stale notifications:", error);
    }
  }
}

export async function cleanupFastAccessOnStartup(hasActiveSession: boolean) {
  activeSessionKey = hasActiveSession ? activeSessionKey : null;
  activeFastAccessKey = null;
  hideMobileFastAccess();

  if (await detectTauriEnvironment()) {
    const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");
    const win = await WebviewWindow.getByLabel(FAST_ACCESS_POPUP_LABEL);
    if (win) {
      try {
        await win.hide();
      } catch (error) {
        logger.warn("[FastAccess] Failed to hide popup during startup cleanup:", error);
      }
    }
    return;
  }

  if (!hasActiveSession) {
    try {
      await Notifications.dismissAllNotificationsAsync();
    } catch (error) {
      logger.warn("[FastAccess] Failed startup cleanup for stale notifications:", error);
    }
  }

  lastNotificationId = null;
}

export async function positionPopup() {
  if (!(await detectTauriEnvironment())) {
    return;
  }
  const [{ WebviewWindow }, { currentMonitor, LogicalPosition }] =
    await Promise.all([
      import("@tauri-apps/api/webviewWindow"),
      import("@tauri-apps/api/window"),
    ]);
  const win = await WebviewWindow.getByLabel(FAST_ACCESS_POPUP_LABEL);
  if (!win) {
    logger.warn("Popup-Fenster nicht gefunden");
    return;
  }

  const monitor = await currentMonitor();
  if (!monitor) {
    logger.warn("Kein Monitor gefunden");
    return;
  }

  const { width, height } = monitor.size;
  const { x: screenX, y: screenY } = monitor.position;

  const windowWidth = 320;
  const windowHeight = 150;
  const marginX = 20;
  const marginY = 60;
  const position = await getSetting("FAST_ACCESS_POSITION");

  const x =
    position === "top-left" || position === "bottom-left"
      ? screenX + marginX
      : screenX + width - windowWidth - marginX;
  const y =
    position === "top-left" || position === "top-right"
      ? screenY + marginX
      : screenY + height - windowHeight - marginY;

  await win.setPosition(new LogicalPosition(x, y));
}

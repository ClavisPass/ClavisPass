import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Clipboard from "expo-clipboard";
import { listen } from "@tauri-apps/api/event";
import { currentMonitor, LogicalPosition } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { logger } from "../../../infrastructure/logging/logger";
import {
  FAST_ACCESS_NOTIFICATION_CATEGORY,
  FAST_ACCESS_POPUP_LABEL,
  FAST_ACCESS_READY_EVENT,
  FAST_ACCESS_UPDATE_EVENT,
} from "../constants";

let notificationListenerSet = false;
let notificationCategorySet = false;
let notificationHandlerSet = false;
let lastNotificationId: string | null = null;
let notificationPermissionGranted: boolean | null = null;
let popupReady = false;
let popupReadyListenerSet = false;
let popupReadyResolvers: Array<() => void> = [];

function resolvePopupReady() {
  popupReady = true;
  popupReadyResolvers.forEach((resolve) => resolve());
  popupReadyResolvers = [];
}

async function ensurePopupReadyListener() {
  if (popupReadyListenerSet) {
    return;
  }

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
      }) || { username: "", password: "" };

      switch (response.actionIdentifier) {
        case "COPY_USERNAME":
          if (data.username) Clipboard.setStringAsync(data.username);
          break;
        case "COPY_PASSWORD":
          if (data.password) Clipboard.setStringAsync(data.password);
          break;
      }
    });
    notificationListenerSet = true;
  }
}

export async function prepareFastAccess() {
  if (Platform.OS === "web") {
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
      await positionPopupBottomRight();
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
  if (Platform.OS === "web") {
    try {
      await prepareFastAccess();
      const win = await ensurePopupWindow();
      await positionPopupBottomRight();
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

  lastNotificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      categoryIdentifier: FAST_ACCESS_NOTIFICATION_CATEGORY,
      body: username,
      sound: false,
      data: { username: username, password: password },
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: null,
  });
}

export async function hideFastAccess() {
  if (Platform.OS === "web") {
    try {
      const win = await WebviewWindow.getByLabel(FAST_ACCESS_POPUP_LABEL);
      if (win) {
        await win.hide();
      }
    } catch (err) {
      logger.error("Fehler beim Verstecken des Fensters:", err);
    }
  } else {
    if (lastNotificationId) {
      await Notifications.dismissNotificationAsync(lastNotificationId);
      lastNotificationId = null;
      return;
    }

    await Notifications.dismissAllNotificationsAsync();
  }
}

export async function positionPopupBottomRight() {
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

  const x = screenX + width - windowWidth - 20;
  const y = screenY + height - windowHeight - 60;

  await win.setPosition(new LogicalPosition(x, y));
}

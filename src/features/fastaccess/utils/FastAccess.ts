import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Clipboard from "expo-clipboard";
import { logger } from "../../../infrastructure/logging/logger";
import { detectTauriEnvironment } from "../../../infrastructure/platform/isTauri";
import { get as getSetting, set as setSetting } from "../../../infrastructure/storage/store";
import {
  FAST_ACCESS_NOTIFICATION_CATEGORY,
  FAST_ACCESS_POSITION_CHANGED_EVENT,
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

const FAST_ACCESS_WINDOW_WIDTH = 320;
const FAST_ACCESS_WINDOW_HEIGHT = 150;
const FAST_ACCESS_MARGIN_X = 20;
const FAST_ACCESS_MARGIN_TOP = 20;
const FAST_ACCESS_MARGIN_BOTTOM = 60;

function sleepAsync(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
  const position = await getSetting("FAST_ACCESS_POSITION");

  const x =
    position === "top-left" || position === "bottom-left"
      ? screenX + FAST_ACCESS_MARGIN_X
      : screenX + width - FAST_ACCESS_WINDOW_WIDTH - FAST_ACCESS_MARGIN_X;
  const y =
    position === "top-left" || position === "top-right"
      ? screenY + FAST_ACCESS_MARGIN_TOP
      : screenY + height - FAST_ACCESS_WINDOW_HEIGHT - FAST_ACCESS_MARGIN_BOTTOM;

  await win.setPosition(new LogicalPosition(x, y));
}

async function animatePopupToPosition(targetX: number, targetY: number) {
  if (!(await detectTauriEnvironment())) {
    return;
  }

  const [{ getCurrentWindow, LogicalPosition }] = await Promise.all([
    import("@tauri-apps/api/window"),
    import("@tauri-apps/api/window"),
  ]);

  const win = getCurrentWindow();
  const current = await win.outerPosition();
  const steps = 8;

  for (let index = 1; index <= steps; index++) {
    const progress = index / steps;
    const eased = 1 - Math.pow(1 - progress, 3);
    const nextX = current.x + (targetX - current.x) * eased;
    const nextY = current.y + (targetY - current.y) * eased;
    await win.setPosition(new LogicalPosition(nextX, nextY));
    await sleepAsync(10);
  }
}

export async function snapPopupToNearestCorner() {
  if (!(await detectTauriEnvironment())) {
    return;
  }

  const [{ getCurrentWindow, LogicalPosition }, { currentMonitor }, { emit }] = await Promise.all([
    import("@tauri-apps/api/window"),
    import("@tauri-apps/api/window"),
    import("@tauri-apps/api/event"),
  ]);

  const win = getCurrentWindow();
  const monitor = await currentMonitor();
  if (!monitor) {
    logger.warn("Kein Monitor gefunden");
    return;
  }

  const [position, size] = await Promise.all([
    win.outerPosition(),
    win.outerSize(),
  ]);

  const { width, height } = monitor.size;
  const { x: screenX, y: screenY } = monitor.position;

  const windowCenterX = position.x + size.width / 2;
  const windowCenterY = position.y + size.height / 2;

  const corners = [
    {
      value: "top-left",
      x: screenX + FAST_ACCESS_MARGIN_X + FAST_ACCESS_WINDOW_WIDTH / 2,
      y: screenY + FAST_ACCESS_MARGIN_TOP + FAST_ACCESS_WINDOW_HEIGHT / 2,
    },
    {
      value: "top-right",
      x:
        screenX +
        width -
        FAST_ACCESS_MARGIN_X -
        FAST_ACCESS_WINDOW_WIDTH / 2,
      y: screenY + FAST_ACCESS_MARGIN_TOP + FAST_ACCESS_WINDOW_HEIGHT / 2,
    },
    {
      value: "bottom-left",
      x: screenX + FAST_ACCESS_MARGIN_X + FAST_ACCESS_WINDOW_WIDTH / 2,
      y:
        screenY +
        height -
        FAST_ACCESS_MARGIN_BOTTOM -
        FAST_ACCESS_WINDOW_HEIGHT / 2,
    },
    {
      value: "bottom-right",
      x:
        screenX +
        width -
        FAST_ACCESS_MARGIN_X -
        FAST_ACCESS_WINDOW_WIDTH / 2,
      y:
        screenY +
        height -
        FAST_ACCESS_MARGIN_BOTTOM -
        FAST_ACCESS_WINDOW_HEIGHT / 2,
    },
  ] as const;

  const nearestCorner = corners.reduce((best, current) => {
    const bestDistance = Math.hypot(best.x - windowCenterX, best.y - windowCenterY);
    const currentDistance = Math.hypot(
      current.x - windowCenterX,
      current.y - windowCenterY,
    );
    return currentDistance < bestDistance ? current : best;
  });

  await setSetting("FAST_ACCESS_POSITION", nearestCorner.value);
  const targetX =
    nearestCorner.value === "top-left" || nearestCorner.value === "bottom-left"
      ? screenX + FAST_ACCESS_MARGIN_X
      : screenX + width - FAST_ACCESS_WINDOW_WIDTH - FAST_ACCESS_MARGIN_X;
  const targetY =
    nearestCorner.value === "top-left" || nearestCorner.value === "top-right"
      ? screenY + FAST_ACCESS_MARGIN_TOP
      : screenY + height - FAST_ACCESS_WINDOW_HEIGHT - FAST_ACCESS_MARGIN_BOTTOM;

  await animatePopupToPosition(targetX, targetY);
  await win.setPosition(new LogicalPosition(targetX, targetY));
  await emit(FAST_ACCESS_POSITION_CHANGED_EVENT, { value: nearestCorner.value });
}

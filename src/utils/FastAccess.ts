import { emit } from "@tauri-apps/api/event";

import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Clipboard from "expo-clipboard";
import { currentMonitor, LogicalPosition } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

let notificationListenerSet = false;

async function ensurePopupWindow() {
  let win = await WebviewWindow.getByLabel("popup");
  if (win) return win;

  win = new WebviewWindow("popup", {
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
      const win = await ensurePopupWindow();
      await positionPopupBottomRight();
      await win.show();
    } catch (err) {
      console.error("Popup-Fenster konnte nicht erstellt/gezeigt werden:", err);
    }
    emit("show-popup", { title, username, password });
    return;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn("Permission denied");
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowBanner: true,
      shouldShowList: false,
      shouldSetBadge: false,
    }),
  });

  await Notifications.setNotificationCategoryAsync("PASSWORD_POPUP", [
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

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      categoryIdentifier: "PASSWORD_POPUP",
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
      let tauri = require("@tauri-apps/api/core");
      await tauri.invoke("plugin:window|hide", { label: "popup" });
    } catch (err) {
      console.error("Fehler beim Verstecken des Fensters:", err);
    }
  } else {
    await Notifications.dismissAllNotificationsAsync();
  }
}

export async function positionPopupBottomRight() {
  const win = await WebviewWindow.getByLabel("popup");
  if (!win) {
    console.warn("Popup-Fenster nicht gefunden");
    return;
  }

  const monitor = await currentMonitor();
  if (!monitor) {
    console.warn("Kein Monitor gefunden");
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

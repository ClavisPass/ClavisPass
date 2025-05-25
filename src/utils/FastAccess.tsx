import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import React from "react";
import FastAccessType from "../types/FastAccessType";
import * as Clipboard from "expo-clipboard";

const copyToClipboard = async (value: string) => {
  await Clipboard.setStringAsync(value);
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function FastAccess() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
    }
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return <></>;
}

export async function openFastAccess(
  setFastAccess: (fastAccess: FastAccessType) => void,
  fastAccess: FastAccessType
) {
  if (fastAccess === null) return;
  if (Platform.OS === "web") {
    setFastAccess(fastAccess);
  } else {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: fastAccess.title,
        body: fastAccess.username,
        vibrate: [0, 250, 250, 250],
        categoryIdentifier: "fast_access",
        priority: "max",
        sticky: true,
        interruptionLevel: "critical",
        sound: "default",
      },
      trigger: null,
    });

    Notifications.setNotificationCategoryAsync("fast_access", [
      {
        identifier: "copy_username",
        buttonTitle: "Username",
        options: { opensAppToForeground: false },
      },
      {
        identifier: "clear",
        buttonTitle: "clear",
        options: { opensAppToForeground: true, isDestructive: true },
      },
      {
        identifier: "copy_password",
        buttonTitle: "Password",
        options: { opensAppToForeground: false },
      },
    ]);

    Notifications.addNotificationResponseReceivedListener((response) => {
      const { actionIdentifier } = response;
      if (actionIdentifier === "copy_username") {
        copyToClipboard(fastAccess.username);
      } else if (actionIdentifier === "clear") {
        copyToClipboard("");
        removeAllNotifications();
      } else if (actionIdentifier === "copy_password") {
        copyToClipboard(fastAccess.password);
      }
    });
  }
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      enableVibrate: true,
    });
  }

  if (Device.isDevice && Platform.OS !== "web") {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
    } catch (e) {
      token = `${e}`;
    }
  }

  return token;
}

export async function removeAllNotifications() {
  await Notifications.dismissAllNotificationsAsync();
}

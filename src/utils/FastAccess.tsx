import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import { BackHandler } from 'react-native';
import React from "react";

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

export async function openFastAccess(setModules: () => void) {
  if (Platform.OS === "web") {
    setModules();
  } else {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Neue Nachricht 📬",
        //body: "Hier ist der Text der Benachrichtigung",
        data: { data: "beispieldaten", test: { test1: "mehr daten" } },
        vibrate: [0, 250, 250, 250],
        categoryIdentifier: "fast_access",
        priority: "max", // Oder "high" für leicht reduzierte Wichtigkeit
      },
      trigger: null,
    });

    Notifications.setNotificationCategoryAsync('fast_access', [
      {
        identifier: 'open_app',
        buttonTitle: 'App öffnen',
        options: { opensAppToForeground: true },
      },
      {
        identifier: 'dismiss',
        buttonTitle: 'Schließen',
        options: {},
      },
      {
        identifier: 'custom_action',
        buttonTitle: 'Benutzerdefinierte Aktion',
        options: {},
      },
    ]);

    Notifications.addNotificationResponseReceivedListener((response) => {
      const { actionIdentifier } = response;
      if (actionIdentifier === 'open_app') {
        console.log("App öffnen wurde ausgewählt");
        setModules(); // Ihre benutzerdefinierte Funktion aufrufen
      } else if (actionIdentifier === 'dismiss') {
        console.log("Benachrichtigung wurde geschlossen");
      } else if (actionIdentifier === 'custom_action') {
        console.log("Benutzerdefinierte Aktion wurde ausgewählt");
        // Implementieren Sie hier Ihre benutzerdefinierte Logik
      }
    });

    function minimizeApp() {
      if (Platform.OS === 'android') {
        BackHandler.exitApp(); // Beendet oder minimiert die App
      } else {
        console.log('App minimieren ist auf iOS nicht möglich.');
      }
    }
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
      alert("Failed to get push token for push notification!");
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
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  }

  return token;
}

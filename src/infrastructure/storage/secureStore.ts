import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { detectTauriEnvironment } from "../platform/isTauri";
import { getDesktopDistributionStorageKey } from "./distributionStorage";

let nativeSecureStore: any;

if (Platform.OS === "ios" || Platform.OS === "android") {
  nativeSecureStore = require("expo-secure-store");
}

async function getTauriCore() {
  if (!(await detectTauriEnvironment())) {
    throw new Error("Tauri secure storage is not available in this environment.");
  }

  return import("@tauri-apps/api/core");
}

const getWebStorageKey = (key: string) => `ClavisPass-SecureStore-${key}`;

async function useWebFallback() {
  return Platform.OS === "web" && !(await detectTauriEnvironment());
}

export const saveData = async (key: string, value: string) => {
  const scopedKey = getDesktopDistributionStorageKey(key);

  if (Platform.OS === "ios" || Platform.OS === "android") {
    await nativeSecureStore.setItemAsync(scopedKey, value);
    return;
  }

  if (await useWebFallback()) {
    await AsyncStorage.setItem(getWebStorageKey(scopedKey), value);
    return;
  }

  const tauri = await getTauriCore();
  await tauri.invoke("save_key", { key: scopedKey, value });
};

export const getData = async (key: string) => {
  const scopedKey = getDesktopDistributionStorageKey(key);

  if (Platform.OS === "ios" || Platform.OS === "android") {
    return (await nativeSecureStore.getItemAsync(scopedKey)) as string;
  }

  if (await useWebFallback()) {
    return await AsyncStorage.getItem(getWebStorageKey(scopedKey));
  }

  const tauri = await getTauriCore();
  return (await tauri.invoke("get_key", { key: scopedKey })) as string;
};

export const removeData = async (key: string) => {
  const scopedKey = getDesktopDistributionStorageKey(key);

  if (Platform.OS === "ios" || Platform.OS === "android") {
    await nativeSecureStore.deleteItemAsync(scopedKey);
    return;
  }

  if (await useWebFallback()) {
    await AsyncStorage.removeItem(getWebStorageKey(scopedKey));
    return;
  }

  const tauri = await getTauriCore();
  await tauri.invoke("remove_key", { key: scopedKey });
};

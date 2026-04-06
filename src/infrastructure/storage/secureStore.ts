import { Platform } from "react-native";
import { detectTauriEnvironment } from "../platform/isTauri";

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

export const saveData = async (key: string, value: string) => {
  if (Platform.OS === "ios" || Platform.OS === "android") {
    await nativeSecureStore.setItemAsync(key, value);
    return;
  }

  const tauri = await getTauriCore();
  await tauri.invoke("save_key", { key, value });
};

export const getData = async (key: string) => {
  if (Platform.OS === "ios" || Platform.OS === "android") {
    return (await nativeSecureStore.getItemAsync(key)) as string;
  }

  const tauri = await getTauriCore();
  return (await tauri.invoke("get_key", { key })) as string;
};

export const removeData = async (key: string) => {
  if (Platform.OS === "ios" || Platform.OS === "android") {
    await nativeSecureStore.deleteItemAsync(key);
    return;
  }

  const tauri = await getTauriCore();
  await tauri.invoke("remove_key", { key });
};

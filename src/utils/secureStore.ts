import { Platform } from "react-native";

let SecureStore: any;
let tauri: any;

if (Platform.OS === "ios" || Platform.OS === "android") {
  SecureStore = require("expo-secure-store");
}

if (Platform.OS === "web") {
    tauri = require("@tauri-apps/api/tauri");
}

export const saveData = async (key: string, value: string) => {
  if (Platform.OS === "ios" || Platform.OS === "android") {
    await SecureStore.setItemAsync(key, value);
  } else if (Platform.OS === "web") {
    await tauri.invoke('save_key', { key, value });
  }
};

export const getData = async (key: string) => {
  if (Platform.OS === "ios" || Platform.OS === "android") {
    return await SecureStore.getItemAsync(key);
  } else if (Platform.OS === "web") {
    return await tauri.invoke('get_key', { key });;
  }
};

export const removeData = async (key: string) => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      await SecureStore.deleteItemAsync(key);
    } else if (Platform.OS === "web") {
      await tauri.invoke('remove_key', { key });
    }
  };

import AsyncStorage from "@react-native-async-storage/async-storage";

export enum Data {
  Test = "test",
}

export const set = async (key: Data, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(error);
  }
};

export const get = async (key: Data) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    return "";
  }
};

import AsyncStorage from "@react-native-async-storage/async-storage";

export enum Data {
  Test = "test",
}

export const set = async (key: Data, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
  }
};

export const get = async () => {
  try {
    return await AsyncStorage.getItem("my-key");
  } catch (e) {
    return "";
  }
};

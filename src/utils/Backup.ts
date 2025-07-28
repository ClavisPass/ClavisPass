import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoType, { CryptoTypeSchema } from "../types/CryptoType";

const BACKUP_KEY = "BACKUP";

export const saveBackup = async (data: CryptoType) => {
  const json = JSON.stringify(data);
  await AsyncStorage.setItem(BACKUP_KEY, json);
};

export const loadBackup = async (): Promise<CryptoType | null> => {
  const data = await AsyncStorage.getItem(BACKUP_KEY);
  if (!data) return null;
  return CryptoTypeSchema.parse(JSON.parse(data));
};

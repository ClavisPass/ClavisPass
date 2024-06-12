import CryptoJS from "react-native-crypto-js";
import DataType, { DataTypeSchema } from "../types/DataType";

export function encrypt(data: DataType, secret: string) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
}

export function decrypt(ciphertext: string, secret: string) {
  try {
    let bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    let loadedData: DataType = DataTypeSchema.parse(
      JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    );
    return loadedData;
  } catch (error) {
    throw new Error("Data can't be parsed! | " + error);
  }
}

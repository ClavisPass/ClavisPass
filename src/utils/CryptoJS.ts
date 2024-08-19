import CryptoJS from "react-native-crypto-js";
import DataType from "../types/DataType";

export function encrypt(data: DataType, secret: string) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
}

export function decrypt(ciphertext: string, secret: string) {
  try {
    return CryptoJS.AES.decrypt(ciphertext, secret).toString(CryptoJS.enc.Utf8)
  } catch (error) {
    throw new Error("Data can't be parsed! | " + error);
  }
}

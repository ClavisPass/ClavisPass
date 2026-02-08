import * as Crypto from "expo-crypto";
import CryptoJS from "crypto-js";
import VaultDataType from "../../../features/vault/model/VaultDataType";
import { getDateTime } from "../../../shared/utils/Timestamp";
import CryptoType from "./CryptoType";

const getRandomBytes = async (size: number) => {
  const randomBytes = await Crypto.getRandomBytesAsync(size);
  return CryptoJS.lib.WordArray.create(randomBytes);
};

// Passwort-basierte Schlüsselableitung
const deriveKey = (password: string, salt: CryptoJS.lib.WordArray) => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  });
};

export const encrypt = async (
  data: VaultDataType,
  password: string,
  lastUpdated?: string
) => {
  const salt = await getRandomBytes(16);
  const iv = await getRandomBytes(12);
  const key = deriveKey(password, salt);

  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    lastUpdated: lastUpdated ? lastUpdated : getDateTime(),
    ciphertext: encrypted.toString(),
    salt: salt.toString(),
    iv: iv.toString(),
  } as CryptoType;
};

export const decrypt:any = (crypto: CryptoType, password: string) => {
  const key = deriveKey(password, CryptoJS.enc.Hex.parse(crypto.salt));
  const decrypted = CryptoJS.AES.decrypt(crypto.ciphertext, key, {
    iv: CryptoJS.enc.Hex.parse(crypto.iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};

import CryptoJS from "crypto-js";
import DataType from "../types/DataType";
import CryptoType from "../types/CryptoType";

// Passwort-basierte Schlüsselableitung
const deriveKey = (password: string, salt: CryptoJS.lib.WordArray) => {
  return CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32, iterations: 1000 });
};

// Verschlüsseln
export const encrypt = (data: DataType, password: string) => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const iv = CryptoJS.lib.WordArray.random(96 / 8);
  const key = deriveKey(password, salt);

  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    ciphertext: encrypted.toString(),
    salt: salt.toString(),
    iv: iv.toString(),
  } as CryptoType;
};

// Entschlüsseln
export const decrypt = (crypto: CryptoType, password: string) => {
  const key = deriveKey(password, CryptoJS.enc.Hex.parse(crypto.salt));
  const decrypted = CryptoJS.AES.decrypt(crypto.ciphertext, key, {
    iv: CryptoJS.enc.Hex.parse(crypto.iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};
import { Platform } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { getData, removeData, saveData } from "./secureStore";

const MASTER_KEY = "ClavisPass-Master";

export const authenticateUser = async () => {
  if (Platform.OS === "web") {
    // WebAuthn für Web
    if (!window.PublicKeyCredential) return false;
    try {
      const publicKeyOptions = {
        challenge: Uint8Array.from("randomString", (c) => c.charCodeAt(0)), // Beispiel-Challenge
        timeout: 60000, // Timeout in Millisekunden
        rpId: window.location.hostname, // Die Root-Domain deiner App
        allowCredentials: [], // Zulassen aller Methoden
        userVerification: "preferred" as UserVerificationRequirement, // Nutzerverifizierung ist bevorzugt, aber nicht erforderlich
      };

      const credentials = await navigator.credentials.get({
        publicKey: publicKeyOptions,
      });
      return !!credentials;
    } catch {
      return false;
    }
  } else if (Platform.OS === "ios" || Platform.OS === "android") {
    // Expo Local Authentication für mobile Geräte
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return false;

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) return false;

    const result = await LocalAuthentication.authenticateAsync();
    return result.success;
  }
  return false;
};

export const isUsingAuthentication = async (): Promise<boolean> => {
  try {
    const value = await loadAuthentication();
    if(value !== null && value !== undefined && value !== "") return true;
    return false;
  } catch (error) {
    console.error("Fehler beim Überprüfen der Authentifizierung:", error);
    return false;
  }
};

export const removeAuthentication = async () => {
  try {
    await removeData(MASTER_KEY);
  } catch (error) {
    console.error("Fehler beim Entfernen des Master Passwort:", error);
  }
};

export const loadAuthentication = async () => {
  try {
    const value = await getData(MASTER_KEY);
    return value;
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
    return null;
  }
};

export const saveAuthentication = async (master: string) => {
  saveData(MASTER_KEY, master)
    .then(() => {
    })
    .catch((error) =>
      console.error("Fehler beim Speichern des Master Passworts:", error)
    );
};

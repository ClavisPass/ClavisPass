import { Platform } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

export const authenticateUser = async () => {
  if (Platform.OS === "web") {
    // WebAuthn für Web
    if (!window.PublicKeyCredential) return false;
    try {
        const publicKeyOptions = {
            challenge: Uint8Array.from("randomString", c => c.charCodeAt(0)), // Beispiel-Challenge
            timeout: 60000, // Timeout in Millisekunden
            rpId: window.location.hostname, // Die Root-Domain deiner App
            allowCredentials: [], // Zulassen aller Methoden
            userVerification: "preferred" as UserVerificationRequirement, // Nutzerverifizierung ist bevorzugt, aber nicht erforderlich
          };
    
          const credentials = await navigator.credentials.get({
            publicKey: publicKeyOptions,
          });
    
          console.log("Authentication successful:", credentials);
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
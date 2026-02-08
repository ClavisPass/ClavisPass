import { Platform } from "react-native";
import type { CryptoProvider } from "./CryptoProvider";

export async function getCryptoProvider(): Promise<CryptoProvider> {
  if (Platform.OS === "web") {
    const { webSodiumProvider } = await import("./webSodiumProvider");
    await webSodiumProvider.ready();
    return webSodiumProvider;
  }

  // native (android/ios) – NUR dynamisch importieren, damit Web nicht crasht
  const { rnSodiumProvider } = await import("./rnSodiumProvider");
  await rnSodiumProvider.ready();
  return rnSodiumProvider;
}

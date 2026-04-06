import type { CryptoProvider } from "./CryptoProvider";
import { verifyProviderInDev } from "./verifyProviderInDev";
import { webSodiumProvider } from "./webSodiumProvider";

export async function getCryptoProvider(): Promise<CryptoProvider> {
  await webSodiumProvider.ready();
  await verifyProviderInDev(webSodiumProvider);
  return webSodiumProvider;
}

import type { CryptoProvider } from "./CryptoProvider";
import { rnSodiumProvider } from "./rnSodiumProvider";
import { verifyProviderInDev } from "./verifyProviderInDev";

export async function getCryptoProvider(): Promise<CryptoProvider> {
  await rnSodiumProvider.ready();
  await verifyProviderInDev(rnSodiumProvider);
  return rnSodiumProvider;
}

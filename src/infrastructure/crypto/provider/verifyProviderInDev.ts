import type { CryptoProvider } from "./CryptoProvider";

let providerSelfTestPromise: Promise<void> | null = null;

export async function verifyProviderInDev(crypto: CryptoProvider) {
  if (!__DEV__) return;

  if (!providerSelfTestPromise) {
    providerSelfTestPromise = import("../vault/v1/verifyVaultV1Provider").then(
      ({ verifyVaultV1Provider }) => verifyVaultV1Provider(crypto),
    );
  }

  await providerSelfTestPromise;
}

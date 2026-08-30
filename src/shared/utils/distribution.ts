export type AppDistribution = "direct" | "store";

function readDistributionEnv(): string | undefined {
  return process.env.EXPO_PUBLIC_CLAVISPASS_DISTRIBUTION;
}

export function getAppDistribution(): AppDistribution {
  return readDistributionEnv() === "store" ? "store" : "direct";
}

export function isStoreDistribution() {
  return getAppDistribution() === "store";
}

export function shouldUseDesktopUpdater() {
  return !isStoreDistribution();
}

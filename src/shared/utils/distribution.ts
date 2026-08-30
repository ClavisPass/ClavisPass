export type AppDistribution = "direct" | "store" | "demo";

function readDistributionEnv(): string | undefined {
  return process.env.EXPO_PUBLIC_CLAVISPASS_DISTRIBUTION;
}

export function getAppDistribution(): AppDistribution {
  if (readDistributionEnv() === "demo") return "demo";
  return readDistributionEnv() === "store" ? "store" : "direct";
}

export function isStoreDistribution() {
  return getAppDistribution() === "store";
}

export function isDemoDistribution() {
  return getAppDistribution() === "demo";
}

export function shouldUseDesktopUpdater() {
  return getAppDistribution() === "direct";
}

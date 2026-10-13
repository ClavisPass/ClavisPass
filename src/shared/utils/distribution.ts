import { isTauriEnvironment } from "../../infrastructure/platform/isTauri";

export type AppDistribution = "direct" | "store" | "demo";
export type MobileDistribution = "apk" | "playStore" | "unknown";

function readDistributionEnv(): string | undefined {
  return process.env.EXPO_PUBLIC_CLAVISPASS_DISTRIBUTION;
}

function readMobileDistributionEnv(): string | undefined {
  return process.env.EXPO_PUBLIC_CLAVISPASS_MOBILE_DISTRIBUTION;
}

export function getAppDistribution(): AppDistribution {
  if (readDistributionEnv() === "demo" && !isTauriEnvironment()) return "demo";
  return readDistributionEnv() === "store" ? "store" : "direct";
}

export function getMobileDistribution(): MobileDistribution {
  const distribution = readMobileDistributionEnv();
  if (distribution === "apk" || distribution === "playStore") {
    return distribution;
  }

  return "unknown";
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

export function shouldUseMobileBinaryUpdater() {
  return getMobileDistribution() === "apk";
}

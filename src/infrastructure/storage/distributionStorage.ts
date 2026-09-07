import { Platform } from "react-native";

import { getAppDistribution } from "../../shared/utils/distribution";

export function getDesktopDistributionStorageKey(key: string) {
  if (Platform.OS !== "web") return key;

  const distribution = getAppDistribution();
  if (distribution === "direct") return key;

  return `${distribution}:${key}`;
}

import Constants from "expo-constants";
import { Platform } from "react-native";

const DEFAULT_MOBILE_UPDATE_MANIFEST_URL =
  "https://github.com/ClavisPass/ClavisPass/releases/latest/download/mobile-version.json";

type MobileUpdateManifest = {
  latest?: string;
  minimumSupported?: string;
  downloadUrl?: string;
  androidApkUrl?: string;
  androidUrl?: string;
  iosUrl?: string;
  appStoreUrl?: string;
  message?: Partial<Record<"de" | "en", string>>;
};

export type MobileBinaryUpdate = {
  latest: string;
  required: boolean;
  downloadUrl: string;
  message?: string;
};

const parseVersion = (version: string): number[] =>
  version
    .split(/[.+-]/)
    .slice(0, 3)
    .map((part) => Number.parseInt(part, 10))
    .map((part) => (Number.isFinite(part) ? part : 0));

const compareVersions = (left: string, right: string): number => {
  const a = parseVersion(left);
  const b = parseVersion(right);

  for (let i = 0; i < 3; i += 1) {
    if ((a[i] ?? 0) > (b[i] ?? 0)) return 1;
    if ((a[i] ?? 0) < (b[i] ?? 0)) return -1;
  }

  return 0;
};

const getAppVersion = (): string =>
  Constants.expoConfig?.version ??
  Constants.manifest2?.extra?.expoClient?.version ??
  "0.0.0";

const getMobileUpdateManifestUrl = (): string | null => {
  const configuredUrl = Constants.expoConfig?.extra?.mobileUpdateManifestUrl;
  if (typeof configuredUrl === "string" && configuredUrl.trim().length > 0) {
    return configuredUrl;
  }

  return DEFAULT_MOBILE_UPDATE_MANIFEST_URL;
};

const getManifestDownloadUrl = (
  manifest: MobileUpdateManifest,
): string | null => {
  if (Platform.OS === "android") {
    return (
      manifest.androidApkUrl ??
      manifest.androidUrl ??
      manifest.downloadUrl ??
      null
    );
  }

  if (Platform.OS === "ios") {
    return (
      manifest.iosUrl ?? manifest.appStoreUrl ?? manifest.downloadUrl ?? null
    );
  }

  return manifest.downloadUrl ?? null;
};

export async function checkMobileBinaryUpdate(
  language?: string,
): Promise<MobileBinaryUpdate | null> {
  const manifestUrl = getMobileUpdateManifestUrl();
  if (!manifestUrl) return null;

  const response = await fetch(manifestUrl, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Mobile update manifest request failed: ${response.status}`,
    );
  }

  const manifest = (await response.json()) as MobileUpdateManifest;
  const currentVersion = getAppVersion();
  const latest = manifest.latest;
  const downloadUrl = getManifestDownloadUrl(manifest);

  if (!latest || !downloadUrl) return null;

  const required =
    typeof manifest.minimumSupported === "string" &&
    compareVersions(currentVersion, manifest.minimumSupported) < 0;
  const updateAvailable = compareVersions(currentVersion, latest) < 0;

  if (!required && !updateAvailable) return null;

  return {
    latest,
    required,
    downloadUrl,
    message:
      manifest.message?.[language?.startsWith("de") ? "de" : "en"] ?? undefined,
  };
}

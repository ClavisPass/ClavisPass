import Constants from "expo-constants";

export function getAppScheme(): string {
  const expoScheme =
    typeof Constants.expoConfig?.scheme === "string"
      ? Constants.expoConfig.scheme
      : null;

  if (expoScheme && expoScheme.length > 0) {
    return expoScheme;
  }

  const appVariant =
    typeof (Constants.expoConfig?.extra as any)?.appVariant === "string"
      ? (Constants.expoConfig?.extra as any).appVariant
      : "production";

  return appVariant === "development" ? "clavispass-dev" : "clavispass";
}

export function getAppRedirectUri(): string {
  return `${getAppScheme()}://redirect`;
}

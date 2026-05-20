const { withInfoPlist } = require("@expo/config-plugins");

const GOOGLE_CLIENT_ID_SUFFIX = ".apps.googleusercontent.com";

function normalizeClientId(value) {
  const trimmed = value?.trim?.() ?? "";
  return trimmed && trimmed.toLowerCase() !== "empty" ? trimmed : "";
}

function toReverseClientIdScheme(clientId) {
  const normalized = normalizeClientId(clientId);

  if (!normalized.endsWith(GOOGLE_CLIENT_ID_SUFFIX)) {
    return "";
  }

  const prefix = normalized.slice(0, -GOOGLE_CLIENT_ID_SUFFIX.length);
  return prefix ? `com.googleusercontent.apps.${prefix}` : "";
}

function ensureUrlScheme(infoPlist, scheme) {
  if (!scheme) {
    return infoPlist;
  }

  const existingTypes = Array.isArray(infoPlist.CFBundleURLTypes)
    ? infoPlist.CFBundleURLTypes
    : [];

  const hasScheme = existingTypes.some((type) =>
    Array.isArray(type?.CFBundleURLSchemes)
      ? type.CFBundleURLSchemes.includes(scheme)
      : false
  );

  if (hasScheme) {
    return infoPlist;
  }

  return {
    ...infoPlist,
    CFBundleURLTypes: [
      ...existingTypes,
      {
        CFBundleURLName: "Google OAuth",
        CFBundleURLSchemes: [scheme],
      },
    ],
  };
}

module.exports = function withIosGoogleOAuthScheme(config) {
  return withInfoPlist(config, (cfg) => {
    const scheme = toReverseClientIdScheme(process.env.GOOGLE_CLIENT_ID_IOS);
    cfg.modResults = ensureUrlScheme(cfg.modResults, scheme);
    return cfg;
  });
};

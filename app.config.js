// app.config.js

export default ({ config }) => {
  const variant = process.env.APP_VARIANT ?? "production";
  const isDev = variant === "development";

  return {
    ...config,
    name: isDev ? "ClavisPass (Dev)" : "ClavisPass",
    slug: "clavispass",
    scheme: isDev ? "clavispass-dev" : "clavispass",

    ios: {
      ...(config.ios ?? {}),
      bundleIdentifier: isDev
        ? "com.clavispass.app.dev"
        : "com.clavispass.app",
    },

    android: {
      ...(config.android ?? {}),
      package: isDev
        ? "com.clavispass.app.dev"
        : "com.clavispass.app",
    },
    extra: {
      ...(config.extra ?? {}),
      appVariant: variant,
    },
  };
};
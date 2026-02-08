export default ({ config }) => {
  const variant = process.env.APP_VARIANT || "production";
  const isDev = variant === "development";

  return {
    ...config,

    name: isDev ? "ClavisPass - Dev" : "ClavisPass",

    // Deep link scheme unterscheiden (wichtig wenn beide parallel installiert sind)
    scheme: isDev ? "clavispass-dev" : "clavispass",

    extra: {
      ...(config.extra ?? {}),
      appVariant: variant,
    },

    plugins: [
      ...(config.plugins ?? []),

      // identifiers switch (Android + iOS)
      "./plugins/withAndroidApplicationId",
      "./plugins/withIosBundleIdentifier",
    ],
  };
};

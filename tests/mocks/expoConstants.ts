const Constants = {
  statusBarHeight: 0,
  expoConfig: {
    scheme: "clavispass",
    extra: {
      appVariant: "production",
    },
  } as any,
};

export function setExpoConfig(expoConfig: any) {
  Constants.expoConfig = expoConfig;
}

export function resetExpoConfig() {
  Constants.expoConfig = {
    scheme: "clavispass",
    extra: {
      appVariant: "production",
    },
  };
}

export default Constants;

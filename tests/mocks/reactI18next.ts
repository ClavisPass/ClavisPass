export function useTranslation() {
  return {
    t: (key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue ?? key,
    i18n: {
      language: "en",
      changeLanguage: async () => undefined,
    },
  };
}

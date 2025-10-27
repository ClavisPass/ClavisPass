export type TranslationSchema = {
  bar: {
    Home: string;
    Analysis: string;
    Settings: string;
    Logout: string;
  };
  common: {
    language: string;
  };
  home: {
    search: string;
    favorite: string;
    entries: string;
    sortByTitle: string;
    sortByCreated: string;
    sortByLastUpdated: string;
  };
  settings: {
    title: string;
    appearance: string;
    languageLabel: string;
  };
};
export const DEFAULT_NS = "common" as const;

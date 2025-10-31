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
    sync: string;
    system: string;
    appearance: string;
    authentication: string;
    fastAccess: string;
    backup: string;
    import: string;
    links: string;
    autostart: string;
    startMinimized: string;
    minimizeToTray: string;
    showHide: string;
    language: string;
    dateFormat: string;
    timeFormat: string;
    changeMasterPassword: string;
    useSystemAuth: string;
    autoOpenFastAccess: string;
    importBackup: string;
    exportBackup: string;
    importPasswords: string;
    website: string;
  };
  analysis: {
    averageEntropy: string;
    strong: string;
    medium: string;
    weak: string;
  };
  analysisDetail: {
    entropy: string;
    letters: string;
    digits: string;
    characters: string;
    yourPassword: string;
    statistics: string;
    pattern: string;
    repeatedSequences: string;
  };
};
export const DEFAULT_NS = "common" as const;

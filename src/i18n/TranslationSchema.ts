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
    card: string;
    twofa: string;
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
  greetings: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
    13: string;
    14: string;
    15: string;
    16: string;
    17: string;
    18: string;
    19: string;
    20: string;
  };
};
export const DEFAULT_NS = "common" as const;

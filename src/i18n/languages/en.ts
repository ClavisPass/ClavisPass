import { TranslationSchema } from "../TranslationSchema";

const en: TranslationSchema = {
  bar: {
    Home: "Home",
    Analysis: "Analysis",
    Settings: "Settings",
    Logout: "Logout",
  },
  common: {
    language: "Language",
  },
  home: {
    search: "Search",
    favorite: "Favorite",
    entries: "Entries",
    sortByTitle: "Sort by Title",
    sortByCreated: "Sort by Created",
    sortByLastUpdated: "Sort by Last Updated",
  },
  settings: {
    sync: "Sync",
    system: "System",
    appearance: "Appearance",
    authentication: "Authentication",
    fastAccess: "Fast Access",
    backup: "Backup",
    import: "Import",
    links: "Links",
    autostart: "Autostart",
    startMinimized: "Start Minimized",
    minimizeToTray: "Minimize to Tray",
    showHide: "Show/Hide",
    language: "Language",
    dateFormat: "Date Format",
    timeFormat: "Time Format",
    changeMasterPassword: "Change Master Password",
    useSystemAuth: "Use System Authentication",
    autoOpenFastAccess: "Auto Open Fast Access",
    importBackup: "Import",
    exportBackup: "Export",
    importPasswords: "Import {{title}} Passwords",
    website: "Website",
  },
  analysis: {
    averageEntropy: "Ø Entropy",
    strong: "Strong",
    medium: "Medium",
    weak: "Weak",
  },
  analysisDetail: {
    entropy: "Entropy",
    letters: "Letters",
    digits: "Digits",
    characters: "Characters",
    yourPassword: "Your Password",
    statistics: "Statistics",
    pattern: "Pattern",
    repeatedSequences: "Repeated Sequences",
  }
};

export default en;

import { TranslationSchema } from "../TranslationSchema";

const de: TranslationSchema = {
  bar: {
    Home: "Startseite",
    Analysis: "Analyse",
    Settings: "Einstellungen",
    Logout: "Abmelden",
  },
  common: {
    language: "Sprache",
  },
  home: {
    search: "Suche",
    favorite: "Favorit",
    entries: "Einträge",
    sortByTitle: "Nach Titel sortieren",
    sortByCreated: "Nach Erstellungsdatum sortieren",
    sortByLastUpdated: "Nach letztem Update sortieren",
  },
  settings: {
    sync: "Synchronisation",
    system: "System",
    appearance: "Erscheinungsbild",
    authentication: "Authentifizierung",
    fastAccess: "Schneller Zugriff",
    backup: "Backup",
    import: "Import",
    links: "Links",
    autostart: "Autostart",
    startMinimized: "Minimiert starten",
    minimizeToTray: "In Tray minimieren",
    showHide: "Anzeigen/Verbergen",
    language: "Sprache",
    dateFormat: "Datumsformat",
    timeFormat: "Zeitformat",
    changeMasterPassword: "Master-Passwort ändern",
    useSystemAuth: "Systemauthentifizierung verwenden",
    autoOpenFastAccess: "Schnellen Zugriff automatisch öffnen",
    importBackup: "Importieren",
    exportBackup: "Exportieren",
    importPasswords: "{{title}}-Passwörter importieren",
    website: "Webseite",
  },
  analysis: {
    averageEntropy: "Ø Entropie",
    strong: "Stark",
    medium: "Mittel",
    weak: "Schwach",
  },
  analysisDetail: {
    entropy: "Entropie",
    letters: "Buchstaben",
    digits: "Ziffern",
    characters: "Zeichen",
    yourPassword: "Ihr Passwort",
    statistics: "Statistiken",
    pattern: "Muster",
    repeatedSequences: "Wiederholte Sequenzen",
  }
};

export default de;

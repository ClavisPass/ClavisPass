import { StringFormat } from "expo-clipboard";
import { unknown } from "zod";

export type TranslationSchema = {
  bar: {
    Home: string;
    Analysis: string;
    Settings: string;
    Logout: string;
  };
  common: {
    none: string;
    capslockOn: string;
    cancel: string;
    delete: string;
    deleteEntryText: string;
    discardChangesText: string;
    discardChangesTitle: string;
    discard: string;
    change: string;
    save: string;
    setExpiry: string;
    current: string;
    addFolder: string;
    passwordLength: string;
    includeUppercase: string;
    includeNumbers: string;
    includeSymbols: string;
    use: string;
    reset: string;
    verify: string;
    reload: string;
    back: string;
    next: string;
    done: string;
    offline: string;
    copiedFor: string;
    connected: string;
    notConnected: string;
    favorites: string;
    allModules: string;
    recentlyUsed: string;
  };
  login: {
    masterPassword: string;
    newMasterPassword: string;
    confirmMasterPassword: string;
    login: string;
    setNewPassword: string;
    noBackupFound: string;
    backupTitle: string;
    enterMasterPassword: string;
    cloudSave: string;
    deviceSave: string;
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
    security: string;
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
    hours: string;
    minutes: string;
    seconds: string;
    copyDuration: string;
    copyDurationOff: string;
    sessionDuration: string;
    contentProtection: string;
    scanqrcode: string;
    showqrcode: string;
    manageDevices: string;
  };
  analysis: {
    topFindings: string;
    noFindings: string;
    strengthDistribution: string;

    securityScore: string;
    scoreHint: string;

    strong: string;
    medium: string;
    weak: string;

    all: string;
    itemsToFix: string;
    reused: string;
    similar: string;

    badge: {
      reused: string;
      similar: string;
      short: string;
      sequential: string;
      repeated: string;
      variant: string;
    };

    finding: {
      reused: string;
      weak: string;
      short: string;
      variants: string;
      sequential: string;
    };
  };

  analysisDetail: {
    title: string;
    yourPassword: string;
    statistics: string;
    entropy: string;
    letters: string;
    digits: string;
    characters: string;
    pattern: string;
    repeatedChars: string;
    sequentialPatterns: string;
    revealHint: string;

    editEntry: string;

    whyRisky: string;
    whyHint: string;
    advancedDetails: string;

    severityHigh: string;
    severityMedium: string;
    severityLow: string;

    riskCritical: string;
    riskHigh: string;
    riskMedium: string;
    riskLow: string;
    riskOk: string;

    strengthVsRiskTitle: string;
    strengthVsRiskBase: string;
    strengthVsRiskDrivers: string;
    strengthVsRiskDriversFallback: string;
    strengthVsRiskNoteStrongButRisky: string;
    strengthVsRiskMeta: string;

    driverReused: string;
    driverSimilar: string;
    driverShort: string;
    driverSequential: string;
    driverRepeated: string;

    whyReused: string;
    whyWeak: string;
    whyShort: string;
    whySimilar: string;
    whySequential: string;
    whyRepeated: string;
    whyOk: string;

    riskScore: string;
    riskScoreValue: string;
    bitsValue: string;
    countPercent: string;
  };
  devices: {
    title: string;
    you: string;

    status: {
      new: string;
      active: string;
      archived: string;
    };

    sections: {
      new: string;
      active: string;
      archived: string;
    };
    hintLine: string;

    toggleArchivedOn: string;
    toggleArchivedOff: string;

    empty: string;
    emptyNew: string;
    emptyActive: string;
    emptyArchived: string;

    lastShort: string;
    lastWrite: string;
    firstWrite: string;
    id: string;
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
  modules: {
    customField: string;
    digitalCard: string;
    email: string;
    expiry: string;
    key: string;
    note: string;
    password: string;
    phoneNumber: string;
    task: string;
    title: string;
    totp: string;
    unknown: string;
    url: string;
    username: string;
    wifi: string;
    created: string;
    lastUpdated: string;
    unknownModule: string;
    recoveryCodes: string;
    recoveryCodesPlaceholder: string;
    recoveryCodesHelp: string;
  };
  moduleTemplates: {
    password: string;
    wifi: string;
    key: string;
    digitalCard: string;
    tasklist: string;
    empty: string;
  };
};
export const DEFAULT_NS = "common" as const;

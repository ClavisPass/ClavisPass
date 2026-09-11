import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "./components/branding/BrandLogo";
import { sendRuntimeMessage } from "../shared/messages";
import { EXTENSION_THEME_STORAGE_KEY, isExtensionThemeMode } from "../shared/theme";
import type { SearchEntrySuggestion } from "../shared/bridge";
import type {
  DesktopBridgeStatusView,
  DesktopEntrySuggestionsView,
  DomainAutofillMode,
  FillExecutionResult,
  SavePromptDecision,
  SavePromptResolution
} from "../shared/types";
import {
  CLAVISPASS_BRAND_NAME
} from "../../../src/shared/branding/brand";

const STATUS_REFRESH_INTERVAL_MS = 2000;
const CLAVISPASS_WEBSITE_URL = "https://clavispass.arratel.dev/";
const CLAVISPASS_CONTACT_URL = "mailto:clavispass@arratel.dev";

type RefreshStatusOptions = {
  reloadSuggestions?: boolean;
  silent?: boolean;
};
type ThemeMode = "light" | "dark";
type Language = "en" | "de";

const translations = {
  en: {
    checkingDesktopApp: "Checking Desktop App",
    checkingDesktopAppDetail: "Trying to reach the ClavisPass native messaging host.",
    waitingForTab: "Waiting for active tab context.",
    notReachable: "Not reachable",
    protocolError: "Protocol error",
    unpaired: "Unpaired",
    pairingPending: "Pairing pending",
    locked: "Locked",
    notReady: "Not ready",
    ready: "Ready",
    noIdentity: "No username or email",
    switchToMode: "Switch to {{mode}} mode",
    light: "Light",
    dark: "Dark",
    language: "Language",
    trustBrowserTitle: "Trust this browser in ClavisPass",
    trustBrowserDetail: "Go to the desktop app and approve the browser request. After that, come back here.",
    unpairedTitle: "Browser access is not trusted",
    unpairedDetail: "Open ClavisPass Desktop to review and approve this browser.",
    lockedTitle: "Unlock ClavisPass Desktop",
    lockedDetail: "Your vault must be unlocked before this extension can fill passwords.",
    notReadyTitle: "ClavisPass is not ready yet",
    notReadyDetail: "Finish setup or unlock your vault in the desktop app.",
    readyTitle: "Ready to fill",
    readyDetail: "Choose a matching login for this website.",
    unreachableTitle: "Open ClavisPass Desktop",
    unreachableDetail: "Install or open the ClavisPass desktop app to connect the extension.",
    desktopInstallHint: "If ClavisPass Desktop is not installed yet, download it first. After installation, open the app once so the browser connection can be registered.",
    bridgeAttentionTitle: "Bridge needs attention",
    openDesktopApp: "Open desktop app",
    downloadClavisPass: "Download ClavisPass",
    openWebsite: "Open ClavisPass website",
    contactSupport: "Contact ClavisPass",
    autofillMode: "Autofill mode",
    autofillModeEnabled: "All actions",
    autofillModeHideInline: "No page button",
    autofillModeBadgeOnly: "Badge only",
    autofillModeDisabled: "Never autofill",
    savePromptEnabled: "Save suggestions on",
    savePromptDisabledLabel: "Save suggestions off",
    disableSavePrompts: "Do not suggest saving",
    searchMatches: "Search matches",
    diagnostics: "Diagnostics",
    matchedPasswords: "{{count}} matches",
    cachedMatches: "Cached matches",
    opening: "Opening...",
    details: "Details",
    invalidStatus: "The desktop bridge returned an invalid status response.",
    statusFailedTitle: "Status Check Failed",
    statusFailedDetail: "The popup could not get a desktop bridge status from the background service.",
    unknownPopupError: "Unknown popup error.",
    suggestionsFailed: "Could not load desktop suggestions.",
    desktopOpenFailed: "The desktop app could not be opened.",
    fillFailed: "Fill failed for the active page.",
    saveSuggestion: "Save suggestion",
    saveEntryPrompt: "Save {{title}}?",
    updateEntryPrompt: "Update {{title}}?",
    noUsernameCaptured: "No username captured from this login form.",
    username: "Username",
    url: "URL",
    working: "Working...",
    saveEntry: "Save entry",
    updateEntry: "Update entry",
    dismiss: "Dismiss",
    promptStatus: "Prompt status",
    suggestions: "Suggestions",
    matchesTitle: "Matches for this website",
    website: "Website",
    noSearchableDomain: "No searchable domain",
    domainMissingUrl: "No active tab URL is available.",
    domainUnsupportedProtocol: "This page does not expose a searchable website domain.",
    domainMissingDomain: "No searchable domain could be derived from the active tab.",
    domainInvalidUrl: "The active tab URL could not be parsed safely.",
    couldNotLoadSuggestions: "Could not load suggestions",
    loadingSuggestions: "Loading suggestions",
    loadingSuggestionsDetail: "ClavisPass is asking the desktop app for matching entries.",
    noMatchesFound: "No matches found",
    noMatchesDetail: "No desktop entries matched this domain yet.",
    favourite: "Fav",
    matchedVia: "Matched via {{host}}",
    password: "Password",
    totp: "TOTP",
    filling: "Filling...",
    fill: "Fill",
    fillState: "Fill state",
    selectedEntry: "Selected entry",
    filled: "Filled",
    filledDetail: "Login filled on this page.",
    noFields: "No fields",
    noFieldsDetail: "No compatible login fields were found on this page.",
    failed: "Failed",
    failedDetail: "ClavisPass could not fill this page.",
    fillingNow: "ClavisPass is filling the active page now.",
    fillHint: "Choose fill to send this login to the active page.",
    fieldFilled: "{{field}} filled"
  },
  de: {
    checkingDesktopApp: "Desktop-App wird gepr\u00fcft",
    checkingDesktopAppDetail: "ClavisPass versucht, den Native-Messaging-Host zu erreichen.",
    waitingForTab: "Warte auf den aktuellen Tab.",
    notReachable: "Nicht erreichbar",
    protocolError: "Protokollfehler",
    unpaired: "Nicht vertraut",
    pairingPending: "Freigabe offen",
    locked: "Gesperrt",
    notReady: "Nicht bereit",
    ready: "Bereit",
    noIdentity: "Kein Benutzername oder keine E-Mail",
    switchToMode: "Zu {{mode}} wechseln",
    light: "Hell",
    dark: "Dunkel",
    language: "Sprache",
    trustBrowserTitle: "Browser in ClavisPass vertrauen",
    trustBrowserDetail: "Gehe zur Desktop-App und best\u00e4tige die Browser-Anfrage. Danach bist du hier bereit.",
    unpairedTitle: "Browser-Zugriff ist nicht vertraut",
    unpairedDetail: "\u00d6ffne ClavisPass Desktop, um diesen Browser zu pr\u00fcfen und freizugeben.",
    lockedTitle: "ClavisPass Desktop entsperren",
    lockedDetail: "Dein Vault muss entsperrt sein, bevor die Erweiterung Passw\u00f6rter ausf\u00fcllen kann.",
    notReadyTitle: "ClavisPass ist noch nicht bereit",
    notReadyDetail: "Schlie\u00dfe die Einrichtung ab oder entsperre deinen Vault in der Desktop-App.",
    readyTitle: "Bereit zum Ausf\u00fcllen",
    readyDetail: "W\u00e4hle einen passenden Login f\u00fcr diese Website.",
    unreachableTitle: "ClavisPass Desktop \u00f6ffnen",
    unreachableDetail: "Installiere oder \u00f6ffne ClavisPass Desktop, um die Erweiterung zu verbinden.",
    desktopInstallHint: "Falls ClavisPass Desktop noch nicht installiert ist, lade die App zuerst herunter. Nach der Installation einmal \u00f6ffnen, damit die Browser-Verbindung registriert werden kann.",
    bridgeAttentionTitle: "Bridge braucht Aufmerksamkeit",
    openDesktopApp: "Desktop-App \u00f6ffnen",
    downloadClavisPass: "ClavisPass herunterladen",
    openWebsite: "ClavisPass-Webseite \u00f6ffnen",
    contactSupport: "ClavisPass kontaktieren",
    autofillMode: "Autofill-Modus",
    autofillModeEnabled: "Alle Aktionen",
    autofillModeHideInline: "Kein Seitenbutton",
    autofillModeBadgeOnly: "Nur Badge",
    autofillModeDisabled: "Nie autofillen",
    savePromptEnabled: "Speichervorschläge an",
    savePromptDisabledLabel: "Speichervorschläge aus",
    disableSavePrompts: "Speichern nicht vorschlagen",
    searchMatches: "Treffer suchen",
    diagnostics: "Diagnose",
    matchedPasswords: "{{count}} Treffer",
    cachedMatches: "Gecachte Treffer",
    opening: "\u00d6ffne...",
    details: "Details",
    invalidStatus: "Die Desktop-Bridge hat einen ung\u00fcltigen Status zur\u00fcckgegeben.",
    statusFailedTitle: "Statuspr\u00fcfung fehlgeschlagen",
    statusFailedDetail: "Das Popup konnte keinen Desktop-Bridge-Status vom Hintergrunddienst abrufen.",
    unknownPopupError: "Unbekannter Popup-Fehler.",
    suggestionsFailed: "Desktop-Vorschl\u00e4ge konnten nicht geladen werden.",
    desktopOpenFailed: "Die Desktop-App konnte nicht ge\u00f6ffnet werden.",
    fillFailed: "Ausf\u00fcllen der aktiven Seite fehlgeschlagen.",
    saveSuggestion: "Speichervorschlag",
    saveEntryPrompt: "{{title}} speichern?",
    updateEntryPrompt: "{{title}} aktualisieren?",
    noUsernameCaptured: "Aus diesem Login-Formular wurde kein Benutzername erkannt.",
    username: "Benutzername",
    url: "URL",
    working: "Arbeite...",
    saveEntry: "Eintrag speichern",
    updateEntry: "Eintrag aktualisieren",
    dismiss: "Verwerfen",
    promptStatus: "Prompt-Status",
    suggestions: "Vorschl\u00e4ge",
    matchesTitle: "Treffer f\u00fcr diese Website",
    website: "Website",
    noSearchableDomain: "Keine durchsuchbare Domain",
    domainMissingUrl: "Keine URL f\u00fcr den aktiven Tab verf\u00fcgbar.",
    domainUnsupportedProtocol: "Diese Seite stellt keine durchsuchbare Website-Domain bereit.",
    domainMissingDomain: "Aus dem aktiven Tab konnte keine durchsuchbare Domain ermittelt werden.",
    domainInvalidUrl: "Die URL des aktiven Tabs konnte nicht sicher gelesen werden.",
    couldNotLoadSuggestions: "Vorschl\u00e4ge konnten nicht geladen werden",
    loadingSuggestions: "Vorschl\u00e4ge werden geladen",
    loadingSuggestionsDetail: "ClavisPass fragt die Desktop-App nach passenden Eintr\u00e4gen.",
    noMatchesFound: "Keine Treffer gefunden",
    noMatchesDetail: "Noch kein Desktop-Eintrag passt zu dieser Domain.",
    favourite: "Fav",
    matchedVia: "Treffer \u00fcber {{host}}",
    password: "Passwort",
    totp: "TOTP",
    filling: "F\u00fclle aus...",
    fill: "Ausf\u00fcllen",
    fillState: "Ausf\u00fcllstatus",
    selectedEntry: "Ausgew\u00e4hlter Eintrag",
    filled: "Ausgef\u00fcllt",
    filledDetail: "Login auf dieser Seite ausgef\u00fcllt.",
    noFields: "Keine Felder",
    noFieldsDetail: "Auf dieser Seite wurden keine passenden Login-Felder gefunden.",
    failed: "Fehlgeschlagen",
    failedDetail: "ClavisPass konnte diese Seite nicht ausf\u00fcllen.",
    fillingNow: "ClavisPass f\u00fcllt die aktive Seite jetzt aus.",
    fillHint: "W\u00e4hle Ausf\u00fcllen, um diesen Login an die aktive Seite zu senden.",
    fieldFilled: "{{field}} ausgef\u00fcllt"
  }
} satisfies Record<Language, Record<string, string>>;

type TranslationKey = keyof typeof translations.en;

function translate(language: Language, key: TranslationKey, values?: Record<string, string>) {
  let text = translations[language][key];
  if (!values) {
    return text;
  }

  for (const [name, value] of Object.entries(values)) {
    text = text.replaceAll(`{{${name}}}`, value);
  }

  return text;
}

function isDesktopBridgeStatusView(value: unknown): value is DesktopBridgeStatusView {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<DesktopBridgeStatusView>;
  return (
    candidate.transport === "native-messaging" &&
    typeof candidate.state === "string" &&
    typeof candidate.label === "string" &&
    typeof candidate.detail === "string"
  );
}

function formatStateLabel(state: DesktopBridgeStatusView["state"], t: (key: TranslationKey) => string): string {
  switch (state) {
    case "host_unreachable":
      return t("notReachable");
    case "protocol_error":
      return t("protocolError");
    case "unpaired":
      return t("unpaired");
    case "pending":
      return t("pairingPending");
    case "locked":
      return t("locked");
    case "not_ready":
      return t("notReady");
    case "ready":
      return t("ready");
  }
}

function describeIdentity(item: SearchEntrySuggestion, t: (key: TranslationKey) => string): string {
  return item.email ?? item.username ?? t("noIdentity");
}

function domainDetailText(
  domain: DesktopEntrySuggestionsView["domain"],
  t: (key: TranslationKey) => string
): string {
  switch (domain.reason) {
    case "missing_url":
      return t("domainMissingUrl");
    case "unsupported_protocol":
      return t("domainUnsupportedProtocol");
    case "missing_domain":
      return t("domainMissingDomain");
    case "invalid_url":
      return t("domainInvalidUrl");
    default:
      return domain.detail;
  }
}

function getInitialTheme(): ThemeMode {
  const stored = localStorage.getItem(EXTENSION_THEME_STORAGE_KEY) ?? localStorage.getItem("clavispass-popup-theme");
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getInitialLanguage(): Language {
  const stored = localStorage.getItem("clavispass-popup-language");
  if (stored === "en" || stored === "de") {
    return stored;
  }

  return navigator.language.toLowerCase().startsWith("de") ? "de" : "en";
}

function getStatusContent(status: DesktopBridgeStatusView, t: (key: TranslationKey) => string) {
  switch (status.state) {
    case "pending":
      return {
        tone: "attention",
        title: t("trustBrowserTitle"),
        detail: t("trustBrowserDetail"),
        action: t("openDesktopApp")
      };
    case "unpaired":
      return {
        tone: "attention",
        title: t("unpairedTitle"),
        detail: t("unpairedDetail"),
        action: t("openDesktopApp")
      };
    case "locked":
      return {
        tone: "attention",
        title: t("lockedTitle"),
        detail: t("lockedDetail"),
        action: t("openDesktopApp")
      };
    case "not_ready":
      return {
        tone: "attention",
        title: t("notReadyTitle"),
        detail: t("notReadyDetail"),
        action: t("openDesktopApp")
      };
    case "ready":
      return {
        tone: "ready",
        title: t("readyTitle"),
        detail: t("readyDetail"),
        action: t("openDesktopApp")
      };
    case "host_unreachable":
      return {
        tone: "blocked",
        title: t("unreachableTitle"),
        detail: t("unreachableDetail"),
        action: t("openDesktopApp")
      };
    case "protocol_error":
      return {
        tone: "blocked",
        title: t("bridgeAttentionTitle"),
        detail: status.detail,
        action: t("openDesktopApp")
      };
  }
}

export function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme);
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const t = (key: TranslationKey, values?: Record<string, string>) =>
    translate(language, key, values);
  const initialStatus: DesktopBridgeStatusView = {
    transport: "native-messaging",
    state: "host_unreachable",
    label: t("checkingDesktopApp"),
    detail: t("checkingDesktopAppDetail")
  };
  const initialSuggestions: DesktopEntrySuggestionsView = {
    domain: {
      isSupported: false,
      detail: t("waitingForTab")
    },
    items: []
  };
  const [status, setStatus] = useState<DesktopBridgeStatusView>(initialStatus);
  const [suggestions, setSuggestions] = useState<DesktopEntrySuggestionsView>(initialSuggestions);
  const [selectedEntryId, setSelectedEntryId] = useState<string>();
  const [fillResult, setFillResult] = useState<FillExecutionResult>();
  const [pendingPrompt, setPendingPrompt] = useState<SavePromptDecision>();
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [isResolvingPrompt, setIsResolvingPrompt] = useState(false);
  const [isOpeningDesktopApp, setIsOpeningDesktopApp] = useState(false);
  const [inlineAutofillHost, setInlineAutofillHost] = useState<string>();
  const [autofillMode, setAutofillMode] = useState<DomainAutofillMode>("enabled");
  const [autofillDisabled, setAutofillDisabled] = useState(false);
  const [popupSuggestionsDisabled, setPopupSuggestionsDisabled] = useState(false);
  const [savePromptDisabled, setSavePromptDisabled] = useState(false);
  const [isUpdatingInlinePreference, setIsUpdatingInlinePreference] = useState(false);
  const [suggestionQuery, setSuggestionQuery] = useState("");
  const [error, setError] = useState<string>();
  const [searchError, setSearchError] = useState<string>();
  const isRefreshingRef = useStateRef(isRefreshing);
  const isBusyRef = useStateRef(
    isLoadingSuggestions ||
      isFilling ||
      isResolvingPrompt ||
      isOpeningDesktopApp
  );
  const year = new Date().getFullYear();
  const extensionVersion = chrome.runtime.getManifest().version;

  async function refreshPendingPrompt(): Promise<void> {
    const response = await sendRuntimeMessage("prompt:getPending", undefined);
    setPendingPrompt(response.prompt);
  }

  async function refreshSuggestions(nextStatus: DesktopBridgeStatusView): Promise<void> {
    setSelectedEntryId(undefined);
    setFillResult(undefined);
    setSearchError(undefined);

    if (nextStatus.state !== "ready") {
      setSuggestions(initialSuggestions);
      return;
    }

    setIsLoadingSuggestions(true);

    try {
      const nextSuggestions = await sendRuntimeMessage("bridge:getSuggestions", undefined);
      setSuggestions(nextSuggestions);
      setSearchError(nextSuggestions.error);
    } catch (suggestionError) {
      setSuggestions(initialSuggestions);
      setSearchError(suggestionError instanceof Error ? suggestionError.message : t("suggestionsFailed"));
    } finally {
      setIsLoadingSuggestions(false);
    }
  }

  async function refreshInlineAutofillPreference(): Promise<void> {
    try {
      const preference = await sendRuntimeMessage("autofill:getInlinePreferenceForActiveTab", undefined);
      setInlineAutofillHost(preference.normalizedHost);
      setAutofillMode(preference.policy.mode);
      setAutofillDisabled(preference.autofillDisabled);
      setPopupSuggestionsDisabled(preference.popupSuggestionsDisabled);
      setSavePromptDisabled(preference.savePromptDisabled);
    } catch {
      setInlineAutofillHost(undefined);
      setAutofillMode("enabled");
      setAutofillDisabled(false);
      setPopupSuggestionsDisabled(false);
      setSavePromptDisabled(false);
    }
  }

  async function refreshStatus(options: RefreshStatusOptions = {}): Promise<void> {
    const reloadSuggestions = options.reloadSuggestions ?? true;
    if (!options.silent) {
      setIsRefreshing(true);
    }
    setError(undefined);

    try {
      const nextStatus = await sendRuntimeMessage("bridge:getStatus", undefined);
      if (!isDesktopBridgeStatusView(nextStatus)) {
        throw new Error(t("invalidStatus"));
      }

      setStatus(nextStatus);
      await Promise.all([
        reloadSuggestions ? refreshSuggestions(nextStatus) : Promise.resolve(),
        refreshPendingPrompt(),
        refreshInlineAutofillPreference()
      ]);
    } catch (statusError) {
      setStatus({
        transport: "native-messaging",
        state: "protocol_error",
        label: t("statusFailedTitle"),
        detail: t("statusFailedDetail")
      });
      setSuggestions(initialSuggestions);
      setError(statusError instanceof Error ? statusError.message : t("unknownPopupError"));
    } finally {
      if (!options.silent) {
        setIsRefreshing(false);
      }
    }
  }

  async function handleOpenDesktopApp(): Promise<void> {
    setIsOpeningDesktopApp(true);

    try {
      await sendRuntimeMessage("bridge:openDesktopApp", {
        appScheme: status.appScheme
      });
    } catch (openError) {
      setError(openError instanceof Error ? openError.message : t("desktopOpenFailed"));
    } finally {
      setIsOpeningDesktopApp(false);
    }
  }

  async function openExternalUrl(url: string): Promise<void> {
    await chrome.tabs.create({
      url,
      active: true
    });
    window.close();
  }

  async function handleUpdateAutofillMode(normalizedHost: string, mode: DomainAutofillMode): Promise<void> {
    setIsUpdatingInlinePreference(true);

    try {
      const preference = await sendRuntimeMessage("autofill:updatePolicyForActiveSite", {
        normalizedHost,
        mode
      });
      setInlineAutofillHost(preference.normalizedHost);
      setAutofillMode(preference.policy.mode);
      setAutofillDisabled(preference.autofillDisabled);
      setPopupSuggestionsDisabled(preference.popupSuggestionsDisabled);
      setSavePromptDisabled(preference.savePromptDisabled);
    } catch (preferenceError) {
      setError(preferenceError instanceof Error ? preferenceError.message : t("unknownPopupError"));
    } finally {
      setIsUpdatingInlinePreference(false);
    }
  }

  async function handleToggleSavePrompts(normalizedHost: string): Promise<void> {
    setIsUpdatingInlinePreference(true);

    try {
      const preference = await sendRuntimeMessage("autofill:updatePolicyForActiveSite", {
        normalizedHost,
        savePromptDisabled: !savePromptDisabled
      });
      setInlineAutofillHost(preference.normalizedHost);
      setAutofillMode(preference.policy.mode);
      setAutofillDisabled(preference.autofillDisabled);
      setPopupSuggestionsDisabled(preference.popupSuggestionsDisabled);
      setSavePromptDisabled(preference.savePromptDisabled);
    } catch (preferenceError) {
      setError(preferenceError instanceof Error ? preferenceError.message : t("unknownPopupError"));
    } finally {
      setIsUpdatingInlinePreference(false);
    }
  }

  async function handleFill(entryId: string): Promise<void> {
    setSelectedEntryId(entryId);
    setFillResult(undefined);
    setIsFilling(true);

    try {
      const result = await sendRuntimeMessage("bridge:fillActiveTab", { entryId });
      setFillResult(result);
    } catch (fillError) {
      setFillResult({
        status: "failed",
        detail: fillError instanceof Error ? fillError.message : t("fillFailed")
      });
    } finally {
      setIsFilling(false);
    }
  }

  async function handlePromptResolution(decision: SavePromptResolution): Promise<void> {
    if (!pendingPrompt) {
      return;
    }

    setIsResolvingPrompt(true);

    try {
      const result = await sendRuntimeMessage("prompt:resolve", {
        promptId: pendingPrompt.id,
        decision
      });
      setPendingPrompt(result.prompt);
      if (result.applied) {
        await refreshStatus({ reloadSuggestions: true });
      }
    } finally {
      setIsResolvingPrompt(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    void chrome.storage.local.get(EXTENSION_THEME_STORAGE_KEY)
      .then((stored) => {
        const storedTheme = stored[EXTENSION_THEME_STORAGE_KEY];
        if (!cancelled && isExtensionThemeMode(storedTheme)) {
          setThemeMode(storedTheme);
        }
      })
      .catch(() => {
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    localStorage.setItem(EXTENSION_THEME_STORAGE_KEY, themeMode);
    void chrome.storage.local.set({ [EXTENSION_THEME_STORAGE_KEY]: themeMode });
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem("clavispass-popup-language", language);
  }, [language]);

  useEffect(() => {
    void refreshStatus({ reloadSuggestions: true });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "hidden" || isRefreshingRef.current || isBusyRef.current) {
        return;
      }

      void refreshStatus({
        reloadSuggestions: status.state !== "ready",
        silent: true
      });
    }, STATUS_REFRESH_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isBusyRef, isRefreshingRef, status.state]);

  const statusContent = getStatusContent(status, t);
  const busy =
    isRefreshing ||
    isLoadingSuggestions ||
    isFilling ||
    isResolvingPrompt ||
    isOpeningDesktopApp ||
    isUpdatingInlinePreference;
  const normalizedSuggestionQuery = suggestionQuery.trim().toLowerCase();
  const filteredSuggestions = normalizedSuggestionQuery
    ? suggestions.items.filter((item) =>
        [
          item.title,
          item.username,
          item.email,
          item.matchedHost
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedSuggestionQuery))
      )
    : suggestions.items;
  const passwordMatchCount = suggestions.items.filter((item) => item.hasPassword).length;
  const showNativeHostInstallHint = status.state === "host_unreachable";

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-lockup">
          <BrandLogo className="header-logo" />
          <p className="brand-title">{CLAVISPASS_BRAND_NAME}</p>
        </div>
        <div className="header-actions" aria-label="ClavisPass links">
          <button
            aria-label={t("openWebsite")}
            className="header-icon-button"
            title={t("openWebsite")}
            type="button"
            onClick={() => void openExternalUrl(CLAVISPASS_WEBSITE_URL)}
          >
            <ExternalLinkIcon />
          </button>
          <button
            aria-label={t("contactSupport")}
            className="header-icon-button"
            title={t("contactSupport")}
            type="button"
            onClick={() => void openExternalUrl(CLAVISPASS_CONTACT_URL)}
          >
            <MailIcon />
          </button>
        </div>
      </header>

      <section className="controls-bar" aria-label="Popup settings">
        {status.state === "ready" && inlineAutofillHost ? (
          <span className="top-context-pill" title={inlineAutofillHost}>
            {inlineAutofillHost}
          </span>
        ) : status.state !== "ready" ? (
          <span className="top-context-pill">
            {formatStateLabel(status.state, t)}
          </span>
        ) : (
          <span aria-hidden="true" />
        )}
        <div className="controls-actions">
          <button
            aria-label={t("switchToMode", { mode: themeMode === "dark" ? t("light") : t("dark") })}
            className="theme-toggle"
            type="button"
            onClick={() => setThemeMode((current) => current === "dark" ? "light" : "dark")}
          >
            <span className="theme-toggle-track">
              <span className="theme-toggle-thumb" />
            </span>
            <span>{themeMode === "dark" ? t("dark") : t("light")}</span>
          </button>
          <div className="language-toggle" aria-label={t("language")}>
            <button
              className={language === "en" ? "language-option language-option-active" : "language-option"}
              type="button"
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
            <button
              className={language === "de" ? "language-option language-option-active" : "language-option"}
              type="button"
              onClick={() => setLanguage("de")}
            >
              DE
            </button>
          </div>
        </div>
      </section>

      {status.state !== "ready" ? (
        <section className={`status-card status-card-${statusContent.tone}`}>
          <div className="status-head">
            <div>
              <p className="status-title">{statusContent.title}</p>
            </div>
          </div>

          <div className="status-copy">
            <p className="status-large">{statusContent.detail}</p>
          </div>

          {showNativeHostInstallHint ? (
            <div className="info-panel">
              <p>{t("desktopInstallHint")}</p>
            </div>
          ) : status.lastError ? (
            <div className="error-panel">
              <p className="meta-label">{t("details")}</p>
              <p>{status.lastError.message}</p>
              {status.lastError.details ? <p className="error-inline">{status.lastError.details}</p> : null}
            </div>
          ) : null}

          {error ? <p className="error-inline">{error}</p> : null}

          {inlineAutofillHost ? (
            <div className="site-preference-panel">
              <div>
                <p className="meta-label">{t("website")}</p>
                <p className="site-preference-host">{inlineAutofillHost}</p>
              </div>
              <div className="site-preference-actions">
                <select
                  aria-label={t("autofillMode")}
                  className="site-mode-select"
                  disabled={isUpdatingInlinePreference}
                  value={autofillMode}
                  onChange={(event) =>
                    void handleUpdateAutofillMode(
                      inlineAutofillHost,
                      event.currentTarget.value as DomainAutofillMode
                    )
                  }
                >
                  <option value="enabled">{t("autofillModeEnabled")}</option>
                  <option value="hide-inline">{t("autofillModeHideInline")}</option>
                  <option value="badge-only">{t("autofillModeBadgeOnly")}</option>
                  <option value="disabled">{t("autofillModeDisabled")}</option>
                </select>
                <button
                  aria-label={t("disableSavePrompts")}
                  className={savePromptDisabled ? "site-inline-toggle site-inline-toggle-muted" : "site-inline-toggle"}
                  disabled={isUpdatingInlinePreference}
                  title={t("disableSavePrompts")}
                  type="button"
                  onClick={() => void handleToggleSavePrompts(inlineAutofillHost)}
                >
                  {savePromptDisabled ? t("savePromptDisabledLabel") : t("savePromptEnabled")}
                </button>
              </div>
            </div>
          ) : null}

          <div className="desktop-action-group">
            <button className="refresh-button" type="button" onClick={() => void handleOpenDesktopApp()} disabled={busy}>
              {isOpeningDesktopApp ? t("opening") : statusContent.action}
            </button>
            <button
              className="row-button desktop-download-button"
              type="button"
              onClick={() => void openExternalUrl(CLAVISPASS_WEBSITE_URL)}
            >
              {t("downloadClavisPass")}
            </button>
          </div>
        </section>
      ) : null}

      {pendingPrompt ? (
        <section className="prompt-card">
          <div className="section-header-row">
            <div>
              <p className="meta-label">{t("saveSuggestion")}</p>
              <p className="section-title">
                {pendingPrompt.kind === "create"
                  ? t("saveEntryPrompt", { title: pendingPrompt.suggestedTitle })
                  : t("updateEntryPrompt", { title: pendingPrompt.existingEntryTitle ?? pendingPrompt.suggestedTitle })}
              </p>
            </div>
            <span className={`status-badge status-${pendingPrompt.kind === "create" ? "ready" : "pending"}`}>{pendingPrompt.kind}</span>
          </div>
          <p className="subtle">{pendingPrompt.candidate.username ? `${t("username")}: ${pendingPrompt.candidate.username}` : t("noUsernameCaptured")}</p>
          <p className="subtle">{t("url")}: {pendingPrompt.candidate.url}</p>
          <div className="suggestion-actions">
            <button className="row-button row-button-primary" type="button" disabled={isResolvingPrompt} onClick={() => void handlePromptResolution(pendingPrompt.kind === "create" ? "save" : "update")}>
              {isResolvingPrompt ? t("working") : pendingPrompt.kind === "create" ? t("saveEntry") : t("updateEntry")}
            </button>
            <button className="row-button" type="button" disabled={isResolvingPrompt} onClick={() => void handlePromptResolution("dismiss")}>
              {t("dismiss")}
            </button>
          </div>
        </section>
      ) : null}

      {status.state === "ready" ? (
        <section className="suggestions-card">
          <div className="suggestions-toolbar">
            {inlineAutofillHost ? (
              <div className="site-controls">
                <select
                  aria-label={t("autofillMode")}
                  className="site-mode-select"
                  disabled={isUpdatingInlinePreference}
                  value={autofillMode}
                  onChange={(event) =>
                    void handleUpdateAutofillMode(
                      inlineAutofillHost,
                      event.currentTarget.value as DomainAutofillMode
                    )
                  }
                >
                  <option value="enabled">{t("autofillModeEnabled")}</option>
                  <option value="hide-inline">{t("autofillModeHideInline")}</option>
                  <option value="badge-only">{t("autofillModeBadgeOnly")}</option>
                  <option value="disabled">{t("autofillModeDisabled")}</option>
                </select>
              </div>
            ) : null}
            <span className="diagnostic-pill diagnostic-pill-ok">
              {t("matchedPasswords", { count: String(passwordMatchCount) })}
            </span>
          </div>

          {!suggestions.domain.isSupported ? (
            <div className="empty-card">
              <p className="section-title">{t("noSearchableDomain")}</p>
              <p className="subtle">{domainDetailText(suggestions.domain, t)}</p>
            </div>
          ) : searchError ? (
            <div className="empty-card">
              <p className="section-title">{t("couldNotLoadSuggestions")}</p>
              <p className="subtle">{searchError}</p>
            </div>
          ) : popupSuggestionsDisabled ? (
            <div className="empty-card">
              <p className="section-title">{t("autofillModeBadgeOnly")}</p>
              <p className="subtle">{t("matchedPasswords", { count: String(passwordMatchCount) })}</p>
            </div>
          ) : isLoadingSuggestions ? (
            <div className="empty-card">
              <p className="section-title">{t("loadingSuggestions")}</p>
              <p className="subtle">{t("loadingSuggestionsDetail")}</p>
            </div>
          ) : suggestions.items.length === 0 ? (
            <div className="empty-card">
              <p className="section-title">{t("noMatchesFound")}</p>
              <p className="subtle">{t("noMatchesDetail")}</p>
            </div>
          ) : (
            <>
              {suggestions.items.length > 4 ? (
                <input
                  aria-label={t("searchMatches")}
                  className="suggestion-search"
                  placeholder={t("searchMatches")}
                  type="search"
                  value={suggestionQuery}
                  onChange={(event) => setSuggestionQuery(event.currentTarget.value)}
                />
              ) : null}

              {filteredSuggestions.length === 0 ? (
                <div className="empty-card">
                  <p className="section-title">{t("noMatchesFound")}</p>
                  <p className="subtle">{t("noMatchesDetail")}</p>
                </div>
              ) : (
                <div className="suggestion-list">
                  {filteredSuggestions.map((item) => (
                    <article className="suggestion-row" key={item.entryId}>
                      <div className="suggestion-main">
                        <div className="suggestion-copy">
                          <div className="suggestion-title-row">
                            <p className="suggestion-title">{item.title}</p>
                            {item.fav ? <span className="flag-pill">{t("favourite")}</span> : null}
                          </div>
                          <p className="suggestion-identity">{describeIdentity(item, t)}</p>
                          {item.matchedHost && item.matchedHost !== suggestions.domain.normalizedHost ? (
                            <p className="suggestion-host">{t("matchedVia", { host: item.matchedHost })}</p>
                          ) : null}
                        </div>
                        <div className="suggestion-side">
                          <div className="hint-row">
                            {item.hasTotp ? <span className="hint-pill">{t("totp")}</span> : null}
                          </div>
                          <button
                            className={
                              fillResult?.status === "filled" && selectedEntryId === item.entryId
                                ? "suggestion-fill-button suggestion-fill-button-success"
                                : "suggestion-fill-button"
                            }
                            type="button"
                            onClick={() => void handleFill(item.entryId)}
                            disabled={isFilling || autofillDisabled}
                          >
                            <span className="suggestion-fill-icon" aria-hidden="true">
                              {fillResult?.status === "filled" && selectedEntryId === item.entryId ? (
                                <CheckIcon />
                              ) : (
                                <FillIcon />
                              )}
                            </span>
                            <span>
                              {isFilling && selectedEntryId === item.entryId
                                ? t("filling")
                                : fillResult?.status === "filled" && selectedEntryId === item.entryId
                                  ? t("filled")
                                  : t("fill")}
                            </span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}

        </section>
      ) : null}

      <footer className="app-footer">
        <span>{"\u00a9"} {CLAVISPASS_BRAND_NAME} by Arratel {year}</span>
        <span>Version {extensionVersion}</span>
      </footer>
    </main>
  );
}

function ExternalLinkIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
      <path d="M10 6H6.8C5.8 6 5 6.8 5 7.8v9.4c0 1 .8 1.8 1.8 1.8h9.4c1 0 1.8-.8 1.8-1.8V14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M14 5h5v5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="m13 11 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
      <path d="M4.8 6h14.4c1 0 1.8.8 1.8 1.8v8.4c0 1-.8 1.8-1.8 1.8H4.8c-1 0-1.8-.8-1.8-1.8V7.8C3 6.8 3.8 6 4.8 6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function FillIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 24 24" width="15">
      <path d="M5 12h12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
      <path d="m13 8 4 4-4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
      <path d="M5 5h5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
      <path d="M5 19h5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 24 24" width="15">
      <path d="m5 12 4 4 10-10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
    </svg>
  );
}

function useStateRef<T>(value: T) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}

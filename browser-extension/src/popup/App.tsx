import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "./components/branding/BrandLogo";
import { sendRuntimeMessage } from "../shared/messages";
import type { SearchEntrySuggestion } from "../shared/bridge";
import type {
  DesktopBridgeStatusView,
  DesktopEntrySuggestionsView,
  FillExecutionResult,
  SavePromptDecision,
  SavePromptResolution
} from "../shared/types";
import {
  CLAVISPASS_BRAND_NAME
} from "../../../src/shared/branding/brand";

const STATUS_REFRESH_INTERVAL_MS = 2000;

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
    unreachableDetail: "The extension cannot reach the desktop app yet.",
    bridgeAttentionTitle: "Bridge needs attention",
    openDesktopApp: "Open desktop app",
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
    noFields: "No fields",
    failed: "Failed",
    fillingNow: "ClavisPass is filling the active page now.",
    fillHint: "Choose fill to send this login to the active page.",
    fieldFilled: "{{field}} filled"
  },
  de: {
    checkingDesktopApp: "Desktop-App wird geprüft",
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
    trustBrowserDetail: "Gehe zur Desktop-App und bestätige die Browser-Anfrage. Danach bist du hier bereit.",
    unpairedTitle: "Browser-Zugriff ist nicht vertraut",
    unpairedDetail: "Öffne ClavisPass Desktop, um diesen Browser zu prüfen und freizugeben.",
    lockedTitle: "ClavisPass Desktop entsperren",
    lockedDetail: "Dein Vault muss entsperrt sein, bevor die Erweiterung Passwörter ausfüllen kann.",
    notReadyTitle: "ClavisPass ist noch nicht bereit",
    notReadyDetail: "Schließe die Einrichtung ab oder entsperre deinen Vault in der Desktop-App.",
    readyTitle: "Bereit zum Ausfüllen",
    readyDetail: "Wähle einen passenden Login für diese Website.",
    unreachableTitle: "ClavisPass Desktop öffnen",
    unreachableDetail: "Die Erweiterung kann die Desktop-App noch nicht erreichen.",
    bridgeAttentionTitle: "Bridge braucht Aufmerksamkeit",
    openDesktopApp: "Desktop-App öffnen",
    opening: "Öffne...",
    details: "Details",
    invalidStatus: "Die Desktop-Bridge hat einen ungültigen Status zurückgegeben.",
    statusFailedTitle: "Statusprüfung fehlgeschlagen",
    statusFailedDetail: "Das Popup konnte keinen Desktop-Bridge-Status vom Hintergrunddienst abrufen.",
    unknownPopupError: "Unbekannter Popup-Fehler.",
    suggestionsFailed: "Desktop-Vorschläge konnten nicht geladen werden.",
    desktopOpenFailed: "Die Desktop-App konnte nicht geöffnet werden.",
    fillFailed: "Ausfüllen der aktiven Seite fehlgeschlagen.",
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
    suggestions: "Vorschläge",
    matchesTitle: "Treffer für diese Website",
    website: "Website",
    noSearchableDomain: "Keine durchsuchbare Domain",
    couldNotLoadSuggestions: "Vorschläge konnten nicht geladen werden",
    loadingSuggestions: "Vorschläge werden geladen",
    loadingSuggestionsDetail: "ClavisPass fragt die Desktop-App nach passenden Einträgen.",
    noMatchesFound: "Keine Treffer gefunden",
    noMatchesDetail: "Noch kein Desktop-Eintrag passt zu dieser Domain.",
    favourite: "Fav",
    matchedVia: "Treffer über {{host}}",
    password: "Passwort",
    totp: "TOTP",
    filling: "Fülle aus...",
    fill: "Ausfüllen",
    fillState: "Ausfüllstatus",
    selectedEntry: "Ausgewählter Eintrag",
    filled: "Ausgefüllt",
    noFields: "Keine Felder",
    failed: "Fehlgeschlagen",
    fillingNow: "ClavisPass füllt die aktive Seite jetzt aus.",
    fillHint: "Wähle Ausfüllen, um diesen Login an die aktive Seite zu senden.",
    fieldFilled: "{{field}} ausgefüllt"
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

function selectedEntryTitle(items: SearchEntrySuggestion[], entryId?: string): string | undefined {
  return items.find((item) => item.entryId === entryId)?.title;
}

function getInitialTheme(): ThemeMode {
  const stored = localStorage.getItem("clavispass-popup-theme");
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
  const [error, setError] = useState<string>();
  const [searchError, setSearchError] = useState<string>();
  const isRefreshingRef = useStateRef(isRefreshing);
  const isBusyRef = useStateRef(
    isLoadingSuggestions ||
      isFilling ||
      isResolvingPrompt ||
      isOpeningDesktopApp
  );

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
        refreshPendingPrompt()
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
    document.documentElement.dataset.theme = themeMode;
    localStorage.setItem("clavispass-popup-theme", themeMode);
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

  const selectedTitle = selectedEntryTitle(suggestions.items, selectedEntryId);
  const statusContent = getStatusContent(status, t);
  const busy =
    isRefreshing ||
    isLoadingSuggestions ||
    isFilling ||
    isResolvingPrompt ||
    isOpeningDesktopApp;

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-lockup">
          <BrandLogo className="header-logo" />
          <p className="brand-title">{CLAVISPASS_BRAND_NAME}</p>
        </div>
      </header>

      <section className="controls-bar" aria-label="Popup settings">
        {status.state !== "ready" ? (
          <span className={`status-badge status-${status.state}`}>
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
              <p className="meta-label">{CLAVISPASS_BRAND_NAME}</p>
              <p className="status-title">{statusContent.title}</p>
            </div>
          </div>

          <div className="status-copy">
            <p className="status-large">{statusContent.detail}</p>
          </div>

          {status.lastError ? (
            <div className="error-panel">
              <p className="meta-label">{t("details")}</p>
              <p>{status.lastError.message}</p>
              {status.lastError.details ? <p className="error-inline">{status.lastError.details}</p> : null}
            </div>
          ) : null}

          {error ? <p className="error-inline">{error}</p> : null}

          <div className="suggestion-actions">
            <button className="refresh-button" type="button" onClick={() => void handleOpenDesktopApp()} disabled={busy}>
              {isOpeningDesktopApp ? t("opening") : statusContent.action}
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
          <div className="section-header-row">
            <div>
              <p className="meta-label">{t("suggestions")}</p>
              <p className="section-title">{t("matchesTitle")}</p>
            </div>
            {suggestions.domain.normalizedHost ? <span className="domain-pill">{suggestions.domain.normalizedHost}</span> : null}
          </div>

          {!suggestions.domain.isSupported ? (
            <div className="empty-card">
              <p className="section-title">{t("noSearchableDomain")}</p>
              <p className="subtle">{suggestions.domain.detail}</p>
            </div>
          ) : searchError ? (
            <div className="empty-card">
              <p className="section-title">{t("couldNotLoadSuggestions")}</p>
              <p className="subtle">{searchError}</p>
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
            <div className="suggestion-list">
              {suggestions.items.map((item) => (
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
                      <button className="row-button row-button-primary suggestion-fill-button" type="button" onClick={() => void handleFill(item.entryId)} disabled={isFilling}>
                        {isFilling && selectedEntryId === item.entryId ? t("filling") : t("fill")}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {selectedEntryId ? (
            <div className="inline-status">
              <div>
                <p className="meta-label">{t("fillState")}</p>
                <p className="subtle">
                  {isFilling
                    ? t("fillingNow")
                    : fillResult
                      ? fillResult.detail
                      : `${t("fillHint")} ${selectedTitle ?? t("selectedEntry")}`}
                </p>
              </div>
              {fillResult ? (
                <span className={`status-badge status-${fillResult.status === "filled" ? "ready" : fillResult.status === "no_fields" ? "not_ready" : "protocol_error"}`}>
                  {fillResult.status === "filled" ? t("filled") : fillResult.status === "no_fields" ? t("noFields") : t("failed")}
                </span>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}

function useStateRef<T>(value: T) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}

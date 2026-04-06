import { useEffect, useState } from "react";
import { BrandHeader } from "./components/branding/BrandHeader";
import { BrandLogo } from "./components/branding/BrandLogo";
import { sendRuntimeMessage } from "../shared/messages";
import type { SearchEntrySuggestion } from "../shared/bridge";
import type {
  DesktopBridgeStatusView,
  DesktopEntrySuggestionsView,
  FillExecutionResult,
  PreparedFillSummary,
  SavePromptDecision,
  SavePromptResolution,
  ContentDebugResponse
} from "../shared/types";
import {
  CLAVISPASS_BRAND_NAME,
  CLAVISPASS_POPUP_DESCRIPTION,
  CLAVISPASS_POPUP_EYEBROW,
  CLAVISPASS_POPUP_TITLE
} from "../../../src/shared/branding/brand";

const INITIAL_STATUS: DesktopBridgeStatusView = {
  transport: "native-messaging",
  state: "host_unreachable",
  label: "Checking Desktop App",
  detail: "Trying to reach the ClavisPass native messaging host."
};

const INITIAL_SUGGESTIONS: DesktopEntrySuggestionsView = {
  domain: {
    isSupported: false,
    detail: "Waiting for active tab context."
  },
  items: []
};

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

function formatStateLabel(state: DesktopBridgeStatusView["state"]): string {
  switch (state) {
    case "host_unreachable":
      return "Not reachable";
    case "protocol_error":
      return "Protocol error";
    case "unpaired":
      return "Unpaired";
    case "pending":
      return "Pairing pending";
    case "locked":
      return "Locked";
    case "not_ready":
      return "Not ready";
    case "ready":
      return "Ready";
  }
}

function describeIdentity(item: SearchEntrySuggestion): string {
  return item.email ?? item.username ?? "No username or email";
}

function selectedEntryTitle(items: SearchEntrySuggestion[], entryId?: string): string | undefined {
  return items.find((item) => item.entryId === entryId)?.title;
}

export function App() {
  const [status, setStatus] = useState<DesktopBridgeStatusView>(INITIAL_STATUS);
  const [suggestions, setSuggestions] = useState<DesktopEntrySuggestionsView>(INITIAL_SUGGESTIONS);
  const [selectedEntryId, setSelectedEntryId] = useState<string>();
  const [preparedFill, setPreparedFill] = useState<PreparedFillSummary>();
  const [fillResult, setFillResult] = useState<FillExecutionResult>();
  const [pendingPrompt, setPendingPrompt] = useState<SavePromptDecision>();
  const [promptMessage, setPromptMessage] = useState<string>();
  const [contentDebug, setContentDebug] = useState<ContentDebugResponse>();
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isPreparingFill, setIsPreparingFill] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [isResolvingPrompt, setIsResolvingPrompt] = useState(false);
  const [isLoadingDebug, setIsLoadingDebug] = useState(false);
  const [isOpeningDesktopApp, setIsOpeningDesktopApp] = useState(false);
  const [error, setError] = useState<string>();
  const [searchError, setSearchError] = useState<string>();

  async function refreshPendingPrompt(): Promise<void> {
    const response = await sendRuntimeMessage("prompt:getPending", undefined);
    setPendingPrompt(response.prompt);
  }

  async function refreshSuggestions(nextStatus: DesktopBridgeStatusView): Promise<void> {
    setSelectedEntryId(undefined);
    setPreparedFill(undefined);
    setFillResult(undefined);
    setSearchError(undefined);

    if (nextStatus.state !== "ready") {
      setSuggestions(INITIAL_SUGGESTIONS);
      return;
    }

    setIsLoadingSuggestions(true);

    try {
      const nextSuggestions = await sendRuntimeMessage("bridge:getSuggestions", undefined);
      setSuggestions(nextSuggestions);
      setSearchError(nextSuggestions.error);
    } catch (suggestionError) {
      setSuggestions(INITIAL_SUGGESTIONS);
      setSearchError(suggestionError instanceof Error ? suggestionError.message : "Could not load desktop suggestions.");
    } finally {
      setIsLoadingSuggestions(false);
    }
  }

  async function refreshStatus(): Promise<void> {
    setIsRefreshing(true);
    setError(undefined);

    try {
      const nextStatus = await sendRuntimeMessage("bridge:getStatus", undefined);
      if (!isDesktopBridgeStatusView(nextStatus)) {
        throw new Error("The desktop bridge returned an invalid status response.");
      }

      setStatus(nextStatus);
      await Promise.all([refreshSuggestions(nextStatus), refreshPendingPrompt()]);
    } catch (statusError) {
      setStatus({
        transport: "native-messaging",
        state: "protocol_error",
        label: "Status Check Failed",
        detail: "The popup could not get a desktop bridge status from the background service."
      });
      setSuggestions(INITIAL_SUGGESTIONS);
      setError(statusError instanceof Error ? statusError.message : "Unknown popup error.");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function refreshContentDebug(): Promise<void> {
    setIsLoadingDebug(true);

    try {
      const result = await sendRuntimeMessage("bridge:getContentDebug", undefined);
      setContentDebug(result);
    } finally {
      setIsLoadingDebug(false);
    }
  }

  async function handleOpenDesktopApp(): Promise<void> {
    setIsOpeningDesktopApp(true);

    try {
      const result = await sendRuntimeMessage("bridge:openDesktopApp", undefined);
      setPromptMessage(result.detail);
    } catch (openError) {
      setPromptMessage(
        openError instanceof Error
          ? openError.message
          : "The desktop app could not be opened."
      );
    } finally {
      setIsOpeningDesktopApp(false);
    }
  }

  async function handlePrepareFill(entryId: string): Promise<void> {
    setSelectedEntryId(entryId);
    setPreparedFill(undefined);
    setFillResult(undefined);
    setIsPreparingFill(true);

    try {
      const result = await sendRuntimeMessage("bridge:prepareFillForActiveTab", { entryId });
      if (result.status === "ready") {
        setPreparedFill(result.entry);
      }
      if (result.status === "failed") {
        setFillResult({
          status: "failed",
          detail: result.detail
        });
      }
    } catch (prepareError) {
      setFillResult({
        status: "failed",
        detail: prepareError instanceof Error ? prepareError.message : "Fill preparation failed."
      });
    } finally {
      setIsPreparingFill(false);
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
        detail: fillError instanceof Error ? fillError.message : "Fill failed for the active page."
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
      setPromptMessage(result.message);
      if (result.applied) {
        await refreshStatus();
      }
    } finally {
      setIsResolvingPrompt(false);
    }
  }

  useEffect(() => {
    void refreshStatus();
  }, []);

  const selectedTitle = selectedEntryTitle(suggestions.items, selectedEntryId);

  return (
    <main className="app-shell">
      <BrandHeader
        eyebrow={CLAVISPASS_POPUP_EYEBROW}
        title={CLAVISPASS_POPUP_TITLE}
        description={CLAVISPASS_POPUP_DESCRIPTION}
        visual={<BrandLogo className="brand-logo" />}
      />

      <section className="status-card">
        <div className="status-head">
          <div>
            <p className="meta-label">Transport</p>
            <p className="status-title">{status.transport}</p>
          </div>
          <span className={`status-badge status-${status.state}`}>{formatStateLabel(status.state)}</span>
        </div>

        <div className="status-copy">
          <p className="section-title">{status.label}</p>
          <p className="subtle">{status.detail}</p>
        </div>

        <div className="status-grid">
          <div className="info-block">
            <p className="meta-label">Pairing</p>
            <p>{status.pairingStatus ?? "unknown"}</p>
          </div>
          <div className="info-block">
            <p className="meta-label">App state</p>
            <p>{status.appState ?? "unknown"}</p>
          </div>
          <div className="info-block">
            <p className="meta-label">Current domain</p>
            <p>{suggestions.domain.host ?? "Unavailable"}</p>
          </div>
          <div className="info-block">
            <p className="meta-label">Lookup domain</p>
            <p>{suggestions.domain.normalizedHost ?? "Unavailable"}</p>
          </div>
          <div className="info-block">
            <p className="meta-label">Desktop app</p>
            <p>{status.desktopName ?? CLAVISPASS_BRAND_NAME}</p>
          </div>
          <div className="info-block">
            <p className="meta-label">Host version</p>
            <p>{status.hostVersion ?? "unknown"}</p>
          </div>
        </div>

        {status.lastError ? (
          <div className="error-panel">
            <p className="meta-label">Bridge error</p>
            <p>{status.lastError.message}</p>
            {status.lastError.details ? <p className="error-inline">{status.lastError.details}</p> : null}
          </div>
        ) : null}

        {error ? <p className="error-inline">{error}</p> : null}

        <div className="suggestion-actions">
          <button className="refresh-button" type="button" onClick={() => void refreshStatus()} disabled={isRefreshing || isLoadingSuggestions || isPreparingFill || isFilling || isResolvingPrompt || isLoadingDebug || isOpeningDesktopApp}>
            {isRefreshing ? "Checking..." : isLoadingSuggestions ? "Loading suggestions..." : "Refresh"}
          </button>
          <button className="row-button" type="button" onClick={() => void handleOpenDesktopApp()} disabled={isOpeningDesktopApp || isRefreshing}>
            {isOpeningDesktopApp ? "Opening app..." : "Open app"}
          </button>
          <button className="row-button" type="button" onClick={() => void refreshContentDebug()} disabled={isRefreshing || isLoadingDebug}>
            {isLoadingDebug ? "Checking page..." : "Page debug"}
          </button>
        </div>
      </section>

      {contentDebug ? (
        <section className="prepare-card">
          <div className="section-header-row">
            <div>
              <p className="meta-label">Page debug</p>
              <p className="section-title">{contentDebug.status === "ok" ? "Content script reachable" : "Content script failed"}</p>
            </div>
            <span className={`status-badge status-${contentDebug.status === "ok" ? "ready" : "protocol_error"}`}>{contentDebug.status}</span>
          </div>
          <p className="subtle">{contentDebug.detail}</p>
          {contentDebug.info ? (
            <div className="status-grid">
              <div className="info-block">
                <p className="meta-label">Password fields</p>
                <p>{contentDebug.info.passwordFieldCount}</p>
              </div>
              <div className="info-block">
                <p className="meta-label">Visible password</p>
                <p>{contentDebug.info.visiblePasswordFieldCount}</p>
              </div>
              <div className="info-block">
                <p className="meta-label">Forms</p>
                <p>{contentDebug.info.formsCount}</p>
              </div>
              <div className="info-block">
                <p className="meta-label">Iframes</p>
                <p>{contentDebug.info.iframeCount}</p>
              </div>
              <div className="info-block">
                <p className="meta-label">Text-like inputs</p>
                <p>{contentDebug.info.textLikeFieldCount}</p>
              </div>
              <div className="info-block">
                <p className="meta-label">Inline button</p>
                <p>{contentDebug.info.inlineButtonVisible ? "visible" : "missing"}</p>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {pendingPrompt ? (
        <section className="prompt-card">
          <div className="section-header-row">
            <div>
              <p className="meta-label">Save suggestion</p>
              <p className="section-title">{pendingPrompt.kind === "create" ? `Save ${pendingPrompt.suggestedTitle}?` : `Update ${pendingPrompt.existingEntryTitle ?? pendingPrompt.suggestedTitle}?`}</p>
            </div>
            <span className={`status-badge status-${pendingPrompt.kind === "create" ? "ready" : "pending"}`}>{pendingPrompt.kind}</span>
          </div>
          <p className="subtle">{pendingPrompt.candidate.username ? `Username: ${pendingPrompt.candidate.username}` : "No username captured from this login form."}</p>
          <p className="subtle">URL: {pendingPrompt.candidate.url}</p>
          <div className="suggestion-actions">
            <button className="row-button row-button-primary" type="button" disabled={isResolvingPrompt} onClick={() => void handlePromptResolution(pendingPrompt.kind === "create" ? "save" : "update")}>
              {isResolvingPrompt ? "Working..." : pendingPrompt.kind === "create" ? "Save entry" : "Update entry"}
            </button>
            <button className="row-button" type="button" disabled={isResolvingPrompt} onClick={() => void handlePromptResolution("dismiss")}>
              Dismiss
            </button>
          </div>
        </section>
      ) : null}

      {!pendingPrompt && promptMessage ? (
        <section className="prepare-card">
          <p className="meta-label">Prompt status</p>
          <p className="subtle">{promptMessage}</p>
        </section>
      ) : null}

      <section className="suggestions-card">
        <div className="section-header-row">
          <div>
            <p className="meta-label">Suggestions</p>
            <p className="section-title">Matches for this website</p>
          </div>
          {suggestions.domain.normalizedHost ? <span className="domain-pill">{suggestions.domain.normalizedHost}</span> : null}
        </div>

        {status.state !== "ready" ? (
          <div className="empty-card">
            <p className="section-title">Suggestions unavailable</p>
            <p className="subtle">The desktop app must be paired, unlocked and ready before domain suggestions can load.</p>
          </div>
        ) : !suggestions.domain.isSupported ? (
          <div className="empty-card">
            <p className="section-title">No searchable domain</p>
            <p className="subtle">{suggestions.domain.detail}</p>
          </div>
        ) : searchError ? (
          <div className="empty-card">
            <p className="section-title">Could not load suggestions</p>
            <p className="subtle">{searchError}</p>
          </div>
        ) : isLoadingSuggestions ? (
          <div className="empty-card">
            <p className="section-title">Loading suggestions</p>
            <p className="subtle">ClavisPass is asking the desktop app for matching entries.</p>
          </div>
        ) : suggestions.items.length === 0 ? (
          <div className="empty-card">
            <p className="section-title">No matches found</p>
            <p className="subtle">No desktop entries matched this domain yet.</p>
          </div>
        ) : (
          <div className="suggestion-list">
            {suggestions.items.map((item) => (
              <article className="suggestion-row" key={item.entryId}>
                <div className="suggestion-main">
                  <div className="suggestion-copy">
                    <div className="suggestion-title-row">
                      <p className="suggestion-title">{item.title}</p>
                      {item.fav ? <span className="flag-pill">Fav</span> : null}
                    </div>
                    <p className="suggestion-identity">{describeIdentity(item)}</p>
                    {item.matchedHost && item.matchedHost !== suggestions.domain.normalizedHost ? (
                      <p className="suggestion-host">Matched via {item.matchedHost}</p>
                    ) : null}
                  </div>
                  <div className="hint-row">
                    {item.hasPassword ? <span className="hint-pill">Password</span> : null}
                    {item.hasTotp ? <span className="hint-pill">TOTP</span> : null}
                  </div>
                </div>
                <div className="suggestion-actions">
                  <button className="row-button" type="button" onClick={() => void handlePrepareFill(item.entryId)} disabled={isPreparingFill || isFilling}>
                    {isPreparingFill && selectedEntryId === item.entryId ? "Preparing..." : "Prepare"}
                  </button>
                  <button className="row-button row-button-primary" type="button" onClick={() => void handleFill(item.entryId)} disabled={isPreparingFill || isFilling}>
                    {isFilling && selectedEntryId === item.entryId ? "Filling..." : "Fill"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedEntryId ? (
        <section className="prepare-card">
          <div className="section-header-row">
            <div>
              <p className="meta-label">Fill state</p>
              <p className="section-title">{preparedFill?.title ?? selectedTitle ?? "Selected entry"}</p>
            </div>
            {fillResult ? (
              <span className={`status-badge status-${fillResult.status === "filled" ? "ready" : fillResult.status === "no_fields" ? "not_ready" : "protocol_error"}`}>
                {fillResult.status === "filled" ? "Filled" : fillResult.status === "no_fields" ? "No fields" : "Failed"}
              </span>
            ) : preparedFill ? (
              <span className="status-badge status-ready">Prepared</span>
            ) : null}
          </div>

          {isPreparingFill ? <p className="subtle">Secure fill data is being requested from the desktop app.</p> : null}
          {isFilling ? <p className="subtle">ClavisPass is filling the active page now.</p> : null}
          {!isPreparingFill && !isFilling && fillResult ? <p className="subtle">{fillResult.detail}</p> : null}
          {!isPreparingFill && !isFilling && !fillResult && preparedFill ? <p className="subtle">Fill data is ready for the active tab. You can trigger the actual fill now.</p> : null}
          {!isPreparingFill && !isFilling && !fillResult && !preparedFill ? <p className="subtle">Choose a suggestion to prepare or fill the active page.</p> : null}

          {preparedFill ? (
            <div className="hint-row hint-row-left">
              {preparedFill.hasUsername ? <span className="hint-pill">Username ready</span> : null}
              {preparedFill.hasPassword ? <span className="hint-pill">Password ready</span> : null}
              {preparedFill.hasTotp ? <span className="hint-pill">TOTP ready</span> : null}
            </div>
          ) : null}

          {fillResult?.filledFields?.length ? (
            <div className="hint-row hint-row-left">
              {fillResult.filledFields.map((field) => (
                <span className="hint-pill" key={field}>{field} filled</span>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}

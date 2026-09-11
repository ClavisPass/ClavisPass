import { BackgroundMessageRouter } from "./router";
import { DesktopBridgeService } from "./bridge";
import { ExtensionState } from "./state";
import { getActiveDomainContext } from "./tab-context";
import { isExtensionMessage } from "../shared/messages";
import {
  clearAutofillDomainCache,
  getCachedAutofillMatchCountForUrl,
  getAutofillEligibilityForUrl,
  rememberAutofillSuggestions
} from "./autofill-cache";
import {
  getInlineAutofillPreferenceForUrl,
  setInlineAutofillDisabledForHost,
  updateAutofillPolicyForHost
} from "./autofill-preferences";
import type { ContentMessage } from "../shared/content-messages";
import type { FillDataResult, SearchEntrySuggestion } from "../shared/bridge";
import type { BrowserWriteResult, CreateEntryFromBrowserPayload, UpdateEntryFromBrowserPayload } from "../shared/bridge";
import type { ContentDebugResponse, FillExecutionResult, OpenDesktopAppPayload, PromptResolutionResult, SavePromptCandidate } from "../shared/types";
import { getNormalizedDomainFromUrl } from "../shared/domain";

const desktopBridge = new DesktopBridgeService();
const state = new ExtensionState();

const BADGE_BACKGROUND_COLOR = "#787ff6";
const BADGE_TEXT_COLOR = "#ffffff";
const CONTEXT_MENU_FILL_ID = "clavispass-fill-first-match";
const DESKTOP_LAUNCH_TAB_CLOSE_DELAY_MS = 1200;

function isScriptablePageUrl(url: string | undefined): boolean {
  if (!url) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

async function injectContentScriptIntoTab(tabId: number): Promise<void> {
  await chrome.scripting.executeScript({
    target: { tabId, allFrames: true },
    files: ["content/index.js"]
  });
}

async function injectContentScriptIntoOpenTabs(): Promise<void> {
  const tabs = await chrome.tabs.query({ url: ["http://*/*", "https://*/*"] });

  await Promise.all(
    tabs
      .map((tab) => tab.id)
      .filter((tabId): tabId is number => typeof tabId === "number")
      .map(async (tabId) => {
        try {
          await injectContentScriptIntoTab(tabId);
        } catch {
        }
      })
  );
}

async function getActiveTabId(): Promise<number | undefined> {
  const [activeTab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  });

  return typeof activeTab?.id === "number" ? activeTab.id : undefined;
}

async function getActiveTab() {
  const [activeTab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  });

  return activeTab;
}

function formatBadgeCount(count: number): string {
  if (count <= 0) {
    return "";
  }

  return count > 99 ? "99+" : String(count);
}

async function setTabBadge(tabId: number, count: number): Promise<void> {
  await chrome.action.setBadgeBackgroundColor({ color: BADGE_BACKGROUND_COLOR });
  if ("setBadgeTextColor" in chrome.action) {
    await chrome.action.setBadgeTextColor({ color: BADGE_TEXT_COLOR });
  }
  await chrome.action.setBadgeText({
    tabId,
    text: formatBadgeCount(count)
  });
}

async function clearTabBadge(tabId: number): Promise<void> {
  await chrome.action.setBadgeText({
    tabId,
    text: ""
  });
}

async function refreshBadgeForTab(tabId: number, url?: string): Promise<void> {
  const pageUrl = url;
  if (!pageUrl || !isScriptablePageUrl(pageUrl)) {
    await clearTabBadge(tabId);
    return;
  }

  const domain = getNormalizedDomainFromUrl(pageUrl);
  if (!domain) {
    await clearTabBadge(tabId);
    return;
  }

  const cachedCount = await getCachedAutofillMatchCountForUrl(pageUrl);

  try {
    const status = await desktopBridge.getDesktopBridgeStatus();

    if (status.state === "unpaired") {
      await clearTabBadge(tabId);
      return;
    }

    if (status.state === "ready") {
      const suggestions = await loadSuggestionsForDomain(domain);
      await rememberAutofillSuggestions(domain, suggestions);
      await setTabBadge(tabId, suggestions.filter((item) => item.hasPassword).length);
      return;
    }
  } catch {
  }

  await setTabBadge(tabId, cachedCount ?? 0);
}

async function refreshBadgeForActiveTab(): Promise<void> {
  const activeTab = await getActiveTab();
  if (typeof activeTab?.id !== "number") {
    return;
  }

  await refreshBadgeForTab(activeTab.id, activeTab.url);
}

async function getActiveTabInlineAutofillPreference() {
  const activeTab = await getActiveTab();
  if (!activeTab?.url) {
    return {
      isSupported: false,
      policy: {
        mode: "enabled" as const,
        savePromptDisabled: false
      },
      inlineAutofillDisabled: false,
      autofillDisabled: false,
      popupSuggestionsDisabled: false,
      savePromptDisabled: false
    };
  }

  return getInlineAutofillPreferenceForUrl(activeTab.url);
}

async function isAutofillDisabledForTab(tab: chrome.tabs.Tab | undefined): Promise<boolean> {
  if (!tab?.url) {
    return false;
  }

  const preference = await getInlineAutofillPreferenceForUrl(tab.url);
  return preference.autofillDisabled;
}

async function openDesktopApp(payload?: OpenDesktopAppPayload): Promise<{ success: boolean; detail: string }> {
  const preferredScheme =
    payload?.appScheme === "clavispass" || payload?.appScheme === "clavispass-dev"
      ? payload.appScheme
      : undefined;
  const launchUrls = preferredScheme
    ? [`${preferredScheme}://redirect`]
    : ["clavispass://redirect"];
  let lastError: unknown;
  let attempted = false;

  for (const url of launchUrls) {
    try {
      const tab = await chrome.tabs.create({
        url,
        active: true
      });
      scheduleDesktopLaunchTabClose(tab.id, url);
      attempted = true;
    } catch (error) {
      lastError = error;
    }
  }

  if (attempted) {
    return {
      success: true,
      detail: "Tried to open the ClavisPass desktop app."
    };
  }

  return {
    success: false,
    detail:
      lastError instanceof Error
        ? lastError.message
        : "The browser could not open the ClavisPass desktop app."
  };
}

function scheduleDesktopLaunchTabClose(tabId: number | undefined, launchUrl: string): void {
  if (typeof tabId !== "number") {
    return;
  }

  globalThis.setTimeout(() => {
    void chrome.tabs.get(tabId)
      .then((tab) => {
        if (tab.url === launchUrl || tab.pendingUrl === launchUrl) {
          return chrome.tabs.remove(tabId);
        }
      })
      .catch(() => {
      });
  }, DESKTOP_LAUNCH_TAB_CLOSE_DELAY_MS);
}

async function prepareFillForActiveTab(entryId: string): Promise<{ tabId?: number; fillData?: FillDataResult; result: import("../shared/types").PrepareFillForActiveTabResult }> {
  const tabId = await getActiveTabId();

  if (typeof tabId !== "number") {
    return {
      result: {
        status: "failed",
        detail: "No active browser tab is available for a fill preparation."
      }
    };
  }

  try {
    const fillData = await desktopBridge.getDesktopFillData(entryId);
    const record = state.setPreparedFill(tabId, fillData);

    return {
      tabId,
      fillData,
      result: {
        status: "ready",
        detail: "Fill data loaded and prepared for the active tab.",
        entry: {
          entryId: fillData.entryId,
          title: fillData.title,
          hasUsername: Boolean(fillData.username),
          hasPassword: Boolean(fillData.password),
          hasTotp: Boolean(fillData.totp),
          preparedAt: record.preparedAt
        }
      }
    };
  } catch (error) {
    state.clearPreparedFill(tabId);
    return {
      tabId,
      result: {
        status: "failed",
        detail: error instanceof Error ? error.message : "Desktop fill data could not be loaded."
      }
    };
  }
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function isMissingReceiverError(error: unknown): boolean {
  return error instanceof Error && error.message.includes("Receiving end does not exist");
}

async function ensureContentScriptReady(tabId: number): Promise<void> {
  let injected = false;
  let lastError: unknown;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const response = await sendMessageToRegisteredFrames<ContentDebugResponse>(tabId, {
        type: "content:getDebugInfo",
        payload: undefined
      });

      if (response && typeof response === "object" && response.status === "ok") {
        return;
      }
    } catch (error) {
      lastError = error;

      if (!injected && isMissingReceiverError(error)) {
        injected = true;
        await injectContentScriptIntoTab(tabId);
      }
    }

    await delay(180);
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("The content script did not become reachable in time.");
}

async function sendMessageToRegisteredFrames<TResponse>(tabId: number, message: ContentMessage): Promise<TResponse> {
  const registeredFrames = state.getRegisteredFrames(tabId);
  const frameIds = registeredFrames.length > 0 ? registeredFrames.map((frame) => frame.frameId) : [0];

  let firstReachableResponse: TResponse | undefined;
  let lastError: unknown;

  for (const frameId of frameIds) {
    try {
      const response = await chrome.tabs.sendMessage(tabId, message, { frameId });
      if (response !== undefined) {
        firstReachableResponse = response as TResponse;

        if (
          response &&
          typeof response === "object" &&
          "status" in response &&
          ((response as { status?: string }).status === "filled" ||
            (response as { status?: string }).status === "ok")
        ) {
          return response as TResponse;
        }
      }
    } catch (error) {
      lastError = error;
    }
  }

  try {
    const response = await chrome.tabs.sendMessage(tabId, message);
    if (response !== undefined) {
      return response as TResponse;
    }
  } catch (error) {
    lastError = error;
  }

  if (firstReachableResponse !== undefined) {
    return firstReachableResponse;
  }

  throw lastError instanceof Error ? lastError : new Error("The active page did not respond from any registered frame.");
}

async function sendFillMessage(tabId: number, fillData: FillDataResult): Promise<FillExecutionResult> {
  const response = await sendMessageToRegisteredFrames<FillExecutionResult>(tabId, {
    type: "content:fillData",
    payload: { fillData }
  });

  if (response && typeof response === "object" && "status" in response) {
    return response;
  }

  return {
    status: "failed",
    detail: "The active page returned an invalid fill response."
  };
}

async function sendContentDebugMessage(tabId: number): Promise<ContentDebugResponse> {
  const response = await sendMessageToRegisteredFrames<ContentDebugResponse>(tabId, {
    type: "content:getDebugInfo",
    payload: undefined
  });

  if (response && typeof response === "object" && "status" in response) {
    return response;
  }

  return {
    status: "failed",
    detail: "The active page returned an invalid debug response."
  };
}

async function refreshInlineAutofillInTab(tabId: number): Promise<void> {
  try {
    await ensureContentScriptReady(tabId);
    await sendMessageToRegisteredFrames(tabId, {
      type: "content:refreshInlineAutofill",
      payload: undefined
    });
  } catch {
  }
}

async function showAutofillPickerInTab(tabId: number): Promise<void> {
  await ensureContentScriptReady(tabId);
  await sendMessageToRegisteredFrames(tabId, {
    type: "content:showAutofillPicker",
    payload: undefined
  });
}

async function fillPreparedDataInTab(tabId: number, fillData: FillDataResult): Promise<FillExecutionResult> {
  try {
    await ensureContentScriptReady(tabId);
    return await sendFillMessage(tabId, fillData);
  } catch (error) {
    if (isMissingReceiverError(error)) {
      return {
        status: "failed",
        detail: "ClavisPass could not attach to the active page context yet. Try once again in a moment."
      };
    }

    return {
      status: "failed",
      detail: error instanceof Error ? error.message : "The content script could not be started on the active page."
    };
  }
}

async function fillFirstAvailableMatchInActiveTab(): Promise<FillExecutionResult> {
  const activeTab = await getActiveTab();
  const tabId = typeof activeTab?.id === "number" ? activeTab.id : undefined;

  if (typeof tabId !== "number" || !activeTab?.url) {
    return {
      status: "failed",
      detail: "No active browser tab is available for autofill."
    };
  }

  if (await isAutofillDisabledForTab(activeTab)) {
    return {
      status: "failed",
      detail: "Autofill is disabled for this website."
    };
  }

  const domain = getNormalizedDomainFromUrl(activeTab.url);
  if (!domain) {
    return {
      status: "failed",
      detail: "No searchable domain is available for the active tab."
    };
  }

  const suggestions = await loadSuggestionsForDomain(domain);
  await rememberAutofillSuggestions(domain, suggestions);
  await setTabBadge(tabId, suggestions.filter((item) => item.hasPassword).length);

  const passwordSuggestions = suggestions.filter((item) => item.hasPassword);
  if (passwordSuggestions.length > 1) {
    await showAutofillPickerInTab(tabId);
    return {
      status: "failed",
      detail: "Multiple matching ClavisPass logins are available."
    };
  }

  const entry = passwordSuggestions[0] ?? suggestions[0];
  if (!entry) {
    return {
      status: "failed",
      detail: "No matching ClavisPass login is available for this website."
    };
  }

  const fillData = await desktopBridge.getDesktopFillData(entry.entryId);
  return fillPreparedDataInTab(tabId, fillData);
}

async function loadSuggestionsForDomain(domain: string): Promise<SearchEntrySuggestion[]> {
  return desktopBridge.searchDesktopEntriesByDomain(domain);
}

async function evaluateSavePromptCandidate(candidate: SavePromptCandidate) {
  const domain = getNormalizedDomainFromUrl(candidate.url);
  if (!domain || !candidate.password) {
    return { accepted: false, promptCreated: false };
  }

  const preference = await getInlineAutofillPreferenceForUrl(candidate.url);
  if (preference.savePromptDisabled) {
    return { accepted: true, promptCreated: false };
  }

  try {
    const suggestions = await loadSuggestionsForDomain(domain);
    const matchingSuggestions = suggestions.filter((item) => {
      if (!candidate.username) {
        return false;
      }

      const normalizedCandidate = candidate.username.trim().toLowerCase();
      return item.username?.trim().toLowerCase() === normalizedCandidate || item.email?.trim().toLowerCase() === normalizedCandidate;
    });

    const existingFillDataById = new Map<string, FillDataResult>();

    for (const item of matchingSuggestions) {
      try {
        const fillData = await desktopBridge.getDesktopFillData(item.entryId);
        existingFillDataById.set(item.entryId, fillData);
      } catch {
      }
    }

    const result = state.evaluateSavePromptCandidate(candidate, suggestions, existingFillDataById);
    return {
      accepted: true,
      promptCreated: result.promptCreated
    };
  } catch {
    return {
      accepted: false,
      promptCreated: false
    };
  }
}

function buildCreatePayload(prompt: import("../shared/types").SavePromptDecision): CreateEntryFromBrowserPayload | null {
  if (!prompt.candidate.password || !prompt.candidate.url || !prompt.matchedHostname) {
    return null;
  }

  return {
    title: prompt.suggestedTitle,
    username: prompt.candidate.username,
    password: prompt.candidate.password,
    url: prompt.candidate.url,
    matchedHost: prompt.matchedHostname
  };
}

function buildUpdatePayload(prompt: import("../shared/types").SavePromptDecision): UpdateEntryFromBrowserPayload | null {
  if (
    prompt.kind !== "update" ||
    !prompt.existingEntryId ||
    !prompt.candidate.password ||
    !prompt.candidate.url ||
    !prompt.matchedHostname
  ) {
    return null;
  }

  return {
    entryId: prompt.existingEntryId,
    title: prompt.existingEntryTitle ?? prompt.suggestedTitle,
    username: prompt.candidate.username,
    password: prompt.candidate.password,
    url: prompt.candidate.url,
    matchedHost: prompt.matchedHostname
  };
}

function toAppliedResult(
  prompt: import("../shared/types").SavePromptDecision,
  result: BrowserWriteResult
) {
  return {
    kind: prompt.kind,
    entryId: result.entryId,
    title: result.title ?? prompt.existingEntryTitle ?? prompt.suggestedTitle,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt
  } as const;
}

async function resolvePromptWithDesktopWrite(
  promptId: string,
  decision: import("../shared/types").SavePromptResolution
): Promise<PromptResolutionResult> {
  if (decision === "dismiss") {
    return state.resolvePendingPrompt(promptId, decision);
  }

  const prompt = state.consumePendingPrompt(promptId);
  if (!prompt) {
    return {
      prompt: state.getPendingPrompt(),
      message: "No matching save prompt is currently pending."
    };
  }

  try {
    if (prompt.kind === "create" && decision === "save") {
      const payload = buildCreatePayload(prompt);
      if (!payload) {
        throw new Error("The captured login data was incomplete and could not be saved.");
      }

      const result = await desktopBridge.createEntryFromBrowser(payload);
      return state.buildPromptAppliedResult(prompt, toAppliedResult(prompt, result));
    }

    if (prompt.kind === "update" && decision === "update") {
      const payload = buildUpdatePayload(prompt);
      if (!payload) {
        throw new Error("The captured login data was incomplete and could not be updated.");
      }

      const result = await desktopBridge.updateEntryFromBrowser(payload);
      return state.buildPromptAppliedResult(prompt, toAppliedResult(prompt, result));
    }

    return {
      message: "The selected prompt action did not match the current save suggestion."
    };
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "ClavisPass Desktop could not apply the browser save request."
    };
  }
}

const router = new BackgroundMessageRouter({
  "bridge:getStatus": async () => desktopBridge.getDesktopBridgeStatus(),
  "bridge:getSuggestions": async () => {
    const domain = await getActiveDomainContext();

    if (!domain.isSupported || !domain.normalizedHost) {
      return {
        domain,
        items: []
      };
    }

    try {
      const items = await loadSuggestionsForDomain(domain.normalizedHost);
      await rememberAutofillSuggestions(domain.normalizedHost, items);
      const tabId = await getActiveTabId();
      if (typeof tabId === "number") {
        await setTabBadge(tabId, items.filter((item) => item.hasPassword).length);
      }

      return {
        domain,
        items
      };
    } catch (error) {
      return {
        domain,
        items: [],
        error: error instanceof Error ? error.message : "Desktop suggestions could not be loaded."
      };
    }
  },
  "bridge:getAutofillEligibility": async (payload, context) => {
    const eligibility = await getAutofillEligibilityForUrl(payload.url, desktopBridge);
    const tabId = context.sender.tab?.id;
    if (typeof tabId === "number") {
      await setTabBadge(tabId, eligibility.matchCount ?? 0);
    }

    return eligibility;
  },
  "autofill:getInlinePreferenceForActiveTab": async () => getActiveTabInlineAutofillPreference(),
  "autofill:setInlineDisabledForActiveSite": async (payload) => {
    const result = await setInlineAutofillDisabledForHost(payload.normalizedHost, payload.disabled === true);
    const tabId = await getActiveTabId();
    if (typeof tabId === "number") {
      void refreshInlineAutofillInTab(tabId);
    }

    return result;
  },
  "autofill:updatePolicyForActiveSite": async (payload) => {
    const result = await updateAutofillPolicyForHost(payload.normalizedHost, {
      ...(payload.mode ? { mode: payload.mode } : {}),
      ...(typeof payload.savePromptDisabled === "boolean"
        ? { savePromptDisabled: payload.savePromptDisabled }
        : {})
    });
    const tabId = await getActiveTabId();
    if (typeof tabId === "number") {
      void refreshInlineAutofillInTab(tabId);
    }

    return result;
  },
  "bridge:prepareFillForActiveTab": async (payload) => {
    const prepared = await prepareFillForActiveTab(payload.entryId);
    return prepared.result;
  },
  "bridge:fillActiveTab": async (payload) => {
    if (await isAutofillDisabledForTab(await getActiveTab())) {
      return {
        status: "failed",
        detail: "Autofill is disabled for this website."
      };
    }

    const prepared = await prepareFillForActiveTab(payload.entryId);
    if (prepared.result.status !== "ready" || typeof prepared.tabId !== "number" || !prepared.fillData) {
      return {
        status: "failed",
        detail: prepared.result.detail
      };
    }

    try {
      return await fillPreparedDataInTab(prepared.tabId, prepared.fillData);
    } finally {
      state.clearPreparedFill(prepared.tabId);
    }
  },
  "bridge:getFillDataForEntry": async (payload) => desktopBridge.getDesktopFillData(payload.entryId),
  "bridge:getContentDebug": async () => {
    const activeTab = await getActiveTab();
    const tabId = typeof activeTab?.id === "number" ? activeTab.id : undefined;

    if (typeof tabId !== "number") {
      return {
        status: "failed",
        detail: "No active tab is available for page diagnostics."
      };
    }

    if (!isScriptablePageUrl(activeTab?.url)) {
      return {
        status: "failed",
        detail: "This page is not scriptable. Open a normal http or https website and try again."
      };
    }

    try {
      await ensureContentScriptReady(tabId);
      return await sendContentDebugMessage(tabId);
    } catch (error) {
      return {
        status: "failed",
        detail: isMissingReceiverError(error)
          ? "ClavisPass could not attach to the active page context yet. Try once again in a moment."
          : error instanceof Error
            ? error.message
            : "Page diagnostics could not reach the active tab."
      };
    }
  },
  "bridge:openDesktopApp": async (payload) => openDesktopApp(payload),
  "prompt:getPending": async () => ({
    prompt: state.getPendingPrompt()
  }),
  "prompt:resolve": async (payload) => resolvePromptWithDesktopWrite(payload.promptId, payload.decision),
  "content:savePromptCandidate": async (payload) => evaluateSavePromptCandidate(payload),
  "content:ready": async (payload, context) => {
    const tabId = context.sender.tab?.id;
    const frameId = context.sender.frameId ?? 0;

    if (typeof tabId === "number") {
      state.registerFrame(tabId, frameId, payload.url);
    }

    return {
      acknowledged: true
    };
  }
});

function createContextMenus(): void {
  if (!chrome.contextMenus) {
    return;
  }

  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: CONTEXT_MENU_FILL_ID,
      title: "Fill with ClavisPass",
      contexts: ["editable"],
      documentUrlPatterns: ["http://*/*", "https://*/*"]
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  console.info("ClavisPass extension installed with native messaging bridge support.");
  createContextMenus();
  void clearAutofillDomainCache();
  void injectContentScriptIntoOpenTabs();
  void refreshBadgeForActiveTab();
});

chrome.runtime.onStartup.addListener(() => {
  createContextMenus();
  void refreshBadgeForActiveTab();
});

chrome.contextMenus?.onClicked.addListener((info) => {
  if (info.menuItemId !== CONTEXT_MENU_FILL_ID) {
    return;
  }

  void fillFirstAvailableMatchInActiveTab();
});

chrome.commands?.onCommand.addListener((command) => {
  if (command !== "fill-first-match") {
    return;
  }

  void fillFirstAvailableMatchInActiveTab();
});

chrome.tabs.onActivated.addListener(() => {
  void refreshBadgeForActiveTab();
});

chrome.tabs.onRemoved.addListener((tabId) => {
  state.clearPreparedFill(tabId);
  state.clearFramesForTab(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading") {
    state.clearPreparedFill(tabId);
    state.clearFramesForTab(tabId);
    void clearTabBadge(tabId);
  }

  if (changeInfo.url || changeInfo.status === "complete") {
    void chrome.tabs.get(tabId).then((tab) => refreshBadgeForTab(tabId, tab.url)).catch(() => {
    });
  }
});

chrome.runtime.onMessage.addListener((rawMessage, sender, sendResponse) => {
  if (!isExtensionMessage(rawMessage)) {
    return false;
  }

  void router
    .handle(rawMessage, { sender })
    .then((response) => {
      sendResponse(response);
    })
    .catch((error) => {
      console.error("Failed to handle runtime message", error);
      sendResponse({
        transport: "native-messaging",
        state: "protocol_error",
        label: "Internal Bridge Error",
        detail: error instanceof Error ? error.message : "Unknown background error."
      });
    });

  return true;
});

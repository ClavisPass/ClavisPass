import { BackgroundMessageRouter } from "./router";
import { DesktopBridgeService } from "./bridge";
import { ExtensionState } from "./state";
import { getActiveDomainContext } from "./tab-context";
import { isExtensionMessage } from "../shared/messages";
import type { ContentMessage } from "../shared/content-messages";
import type { FillDataResult, SearchEntrySuggestion } from "../shared/bridge";
import type { ContentDebugResponse, FillExecutionResult, SavePromptCandidate } from "../shared/types";
import { getNormalizedDomainFromUrl } from "../shared/domain";

const desktopBridge = new DesktopBridgeService();
const state = new ExtensionState();

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

async function openDesktopApp(): Promise<{ success: boolean; detail: string }> {
  const launchUrls = ["clavispass://redirect", "clavispass-dev://redirect"];
  let lastError: unknown;

  for (const url of launchUrls) {
    try {
      const createdTab = await chrome.tabs.create({
        url,
        active: false
      });

      if (typeof createdTab.id === "number") {
        setTimeout(() => {
          void chrome.tabs.remove(createdTab.id!).catch(() => {
          });
        }, 1200);
      }

      return {
        success: true,
        detail: "Tried to open the ClavisPass desktop app."
      };
    } catch (error) {
      lastError = error;
    }
  }

  return {
    success: false,
    detail:
      lastError instanceof Error
        ? lastError.message
        : "The browser could not open the ClavisPass desktop app."
  };
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

async function loadSuggestionsForDomain(domain: string): Promise<SearchEntrySuggestion[]> {
  return desktopBridge.searchDesktopEntriesByDomain(domain);
}

async function evaluateSavePromptCandidate(candidate: SavePromptCandidate) {
  const domain = getNormalizedDomainFromUrl(candidate.url);
  if (!domain || !candidate.password) {
    return { accepted: false, promptCreated: false };
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
      return {
        domain,
        items: await loadSuggestionsForDomain(domain.normalizedHost)
      };
    } catch (error) {
      return {
        domain,
        items: [],
        error: error instanceof Error ? error.message : "Desktop suggestions could not be loaded."
      };
    }
  },
  "bridge:prepareFillForActiveTab": async (payload) => {
    const prepared = await prepareFillForActiveTab(payload.entryId);
    return prepared.result;
  },
  "bridge:fillActiveTab": async (payload) => {
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
  "bridge:openDesktopApp": async () => openDesktopApp(),
  "prompt:getPending": async () => ({
    prompt: state.getPendingPrompt()
  }),
  "prompt:resolve": async (payload) => state.resolvePendingPrompt(payload.promptId, payload.decision),
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

chrome.runtime.onInstalled.addListener(() => {
  console.info("ClavisPass extension installed with native messaging bridge support.");
  void injectContentScriptIntoOpenTabs();
});

chrome.tabs.onRemoved.addListener((tabId) => {
  state.clearPreparedFill(tabId);
  state.clearFramesForTab(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading") {
    state.clearPreparedFill(tabId);
    state.clearFramesForTab(tabId);
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

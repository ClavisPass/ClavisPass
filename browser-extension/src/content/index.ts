import { sendRuntimeMessage } from "../shared/messages";
import { isContentMessage } from "../shared/content-messages";
import { executeFill } from "./fill";
import { classifyFieldSnapshot, createFieldSnapshot, extractSavePromptCandidate, isVisibleFieldCandidate } from "../shared/forms";
import type { ContentDebugInfo } from "../shared/types";

declare global {
  interface Window {
    __clavispassContentScriptLoaded?: boolean;
    __clavispassInlineRefresh?: () => void;
  }
}

const INLINE_ROOT_ID = "clavispass-inline-root";
const INLINE_STYLE_ID = "clavispass-inline-style";

function registerContentFrame(): void {
  void sendRuntimeMessage("content:ready", {
    url: window.location.href
  }).catch(() => {
  });
}

function setupSavePromptListener(): void {
  document.addEventListener(
    "submit",
    (event) => {
      const target = event.target;
      if (!(target instanceof HTMLFormElement)) {
        return;
      }

      const candidate = extractSavePromptCandidate(target, window.location.href);
      if (!candidate) {
        return;
      }

      window.setTimeout(() => {
        void sendRuntimeMessage("content:savePromptCandidate", candidate);
      }, 250);
    },
    true
  );
}

function getDebugInfo(): ContentDebugInfo {
  const inputs = [...document.querySelectorAll("input")].filter(
    (input): input is HTMLInputElement => input instanceof HTMLInputElement
  );

  const passwordFields = inputs.filter((input) => input.type === "password");
  const visiblePasswordFields = passwordFields.filter((input) => isVisibleFieldCandidate(input));
  const textLikeFields = inputs.filter((input) => ["text", "email", "search", "tel", "number", "password"].includes(input.type || "text"));

  return {
    contentScriptLoaded: true,
    pageUrl: window.location.href,
    passwordFieldCount: passwordFields.length,
    visiblePasswordFieldCount: visiblePasswordFields.length,
    textLikeFieldCount: textLikeFields.length,
    iframeCount: document.querySelectorAll("iframe").length,
    formsCount: document.querySelectorAll("form").length,
    inlineButtonVisible: Boolean(document.getElementById(INLINE_ROOT_ID))
  };
}

function setupFillListener(): void {
  chrome.runtime.onMessage.addListener((rawMessage, _sender, sendResponse) => {
    if (!isContentMessage(rawMessage)) {
      return false;
    }

    if (rawMessage.type === "content:getDebugInfo") {
      sendResponse({
        status: "ok",
        detail: `Content script responded from ${window.location.href}`,
        info: getDebugInfo()
      });
      return true;
    }

    if (rawMessage.type !== "content:fillData") {
      return false;
    }

    try {
      const fillPayload = rawMessage.payload;
      if (!fillPayload) {
        sendResponse({
          status: "failed",
          detail: "The page received an empty fill payload."
        });
        return true;
      }

      const result = executeFill(fillPayload.fillData, document);
      sendResponse(result);
    } catch (error) {
      sendResponse({
        status: "failed",
        detail: error instanceof Error ? error.message : "Fill execution failed on the active page."
      });
    }

    return true;
  });
}

function ensureInlineStyles(): void {
  if (document.getElementById(INLINE_STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = INLINE_STYLE_ID;
  style.textContent = `
    #${INLINE_ROOT_ID} {
      position: absolute;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      gap: 8px;
      pointer-events: auto;
    }

    #${INLINE_ROOT_ID} button {
      all: initial;
      font-family: Arial, sans-serif;
      font-size: 12px;
      font-weight: 700;
      color: white;
      background: linear-gradient(135deg, #787ff6 0%, #69c4ff 100%);
      border-radius: 999px;
      padding: 8px 12px;
      cursor: pointer;
      box-shadow: rgba(120, 127, 246, 0.22) 0px 8px 20px;
      border: none;
      line-height: 1;
    }

    #${INLINE_ROOT_ID} .clavispass-inline-note {
      font-family: Arial, sans-serif;
      font-size: 12px;
      color: #141826;
      background: rgba(255, 255, 255, 0.96);
      border: 1px solid #e8e8ec;
      border-radius: 999px;
      padding: 7px 10px;
      box-shadow: rgba(99, 99, 99, 0.11) 0px 2px 8px 0px;
      white-space: nowrap;
    }
  `;

  document.documentElement.appendChild(style);
}

function getPrimaryPasswordField(): HTMLInputElement | undefined {
  const inputs = [...document.querySelectorAll("input")].filter(
    (input): input is HTMLInputElement => input instanceof HTMLInputElement
  );

  return inputs.find((input, index) => {
    if (!isVisibleFieldCandidate(input)) {
      return false;
    }

    const snapshot = createFieldSnapshot(input, index);
    const classification = classifyFieldSnapshot(snapshot);
    return classification.kind === "password";
  });
}

function getOrCreateInlineRoot(): HTMLDivElement {
  let root = document.getElementById(INLINE_ROOT_ID) as HTMLDivElement | null;
  if (root) {
    return root;
  }

  root = document.createElement("div");
  root.id = INLINE_ROOT_ID;

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "ClavisPass";

  const note = document.createElement("div");
  note.className = "clavispass-inline-note";
  note.textContent = "Ready";

  button.addEventListener("click", () => {
    void handleInlineAction(button, note);
  });

  root.appendChild(button);
  root.appendChild(note);
  document.documentElement.appendChild(root);
  return root;
}

async function handleInlineAction(button: HTMLButtonElement, note: HTMLDivElement): Promise<void> {
  const originalLabel = button.textContent ?? "ClavisPass";
  button.textContent = "Checking...";
  button.disabled = true;
  note.textContent = "Looking for matching entries...";

  try {
    const suggestions = await sendRuntimeMessage("bridge:getSuggestions", undefined);
    if (suggestions.items.length === 0) {
      note.textContent = "No matching entries for this page.";
      return;
    }

    if (suggestions.items.length > 1) {
      note.textContent = `${suggestions.items.length} matches found. Open the popup to choose one.`;
      return;
    }

    const result = await sendRuntimeMessage("bridge:fillActiveTab", {
      entryId: suggestions.items[0].entryId
    });

    note.textContent = result.detail;
  } catch (error) {
    note.textContent = error instanceof Error ? error.message : "ClavisPass could not reach the page.";
  } finally {
    button.textContent = originalLabel;
    button.disabled = false;
  }
}

function positionInlineRoot(): void {
  ensureInlineStyles();
  const passwordField = getPrimaryPasswordField();
  const existingRoot = document.getElementById(INLINE_ROOT_ID) as HTMLDivElement | null;

  if (!passwordField) {
    existingRoot?.remove();
    return;
  }

  const root = getOrCreateInlineRoot();
  const rect = passwordField.getBoundingClientRect();
  const top = window.scrollY + rect.top + Math.max((rect.height - 32) / 2, 0);
  const left = window.scrollX + rect.right - 120;

  root.style.top = `${Math.max(top, window.scrollY + 8)}px`;
  root.style.left = `${Math.max(left, window.scrollX + 8)}px`;
}

function setupInlineTrigger(): void {
  let rafId = 0;

  const refresh = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }

    rafId = requestAnimationFrame(() => {
      positionInlineRoot();
    });
  };

  window.__clavispassInlineRefresh = refresh;

  const observer = new MutationObserver(() => refresh());
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["type", "name", "id", "autocomplete", "placeholder", "class", "style", "hidden"]
  });

  window.addEventListener("scroll", refresh, true);
  window.addEventListener("resize", refresh);
  refresh();
}

registerContentFrame();

if (!window.__clavispassContentScriptLoaded) {
  window.__clavispassContentScriptLoaded = true;
  setupFillListener();
  setupSavePromptListener();
  setupInlineTrigger();
} else {
  window.__clavispassInlineRefresh?.();
}

export {};

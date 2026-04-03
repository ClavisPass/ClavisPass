import { sendRuntimeMessage } from "../shared/messages";
import { isContentMessage } from "../shared/content-messages";
import { executeFill, previewFill } from "./fill";
import { classifyFieldSnapshot, createFieldSnapshot, extractSavePromptCandidate, isVisibleFieldCandidate } from "../shared/forms";
import type { ContentDebugInfo } from "../shared/types";
import type { FillDataResult } from "../shared/bridge";

declare global {
  interface Window {
    __clavispassContentScriptLoaded?: boolean;
    __clavispassInlineRefresh?: () => void;
  }
}

const INLINE_ROOT_ID = "clavispass-inline-root";
const INLINE_STYLE_ID = "clavispass-inline-style";
const INLINE_BUTTON_TITLE = "Fill with ClavisPass";
const INLINE_LOGO = `
  <svg viewBox="0 0 1080 1080" aria-hidden="true" focusable="false">
    <path d="M478.678 145.834C535.884 138.414 585.754 121.531 628.335 98.647C671.044 121.599 721.092 138.516 778.497 145.901C719.667 193.161 671.262 248.886 628.635 309.926C585.988 248.858 537.564 193.109 478.678 145.834Z" fill="white"/>
    <path d="M565.198 499.942C479.15 437.845 427.04 380.143 395.22 319.688C359.89 252.538 349.638 182.241 344.735 99.539C453.47 186.758 538.587 295.389 612.02 416.24L565.198 499.942Z" fill="white"/>
    <path d="M820.867 161.445C817.562 214.998 810.65 260.544 786.819 304.044C760.45 352.203 713.415 397.677 628.335 449.048C618.969 443.392 610.058 437.802 601.579 432.271C601.579 432.271 630.876 382.002 632.396 379.395C683.896 295.957 743.647 220.922 820.867 161.445Z" fill="white"/>
  </svg>
`;

interface InlinePreviewState {
  entryId: string;
  restore: () => void;
  committed: boolean;
}

let inlinePreviewState: InlinePreviewState | undefined;
let inlinePreviewRequestId = 0;

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
      pointer-events: auto;
    }

    #${INLINE_ROOT_ID} button {
      all: unset;
      box-sizing: border-box;
      display: grid;
      place-items: center;
      position: relative;
      overflow: hidden;
      width: 42px;
      height: 34px;
      background: linear-gradient(135deg, #787ff6 0%, #69c4ff 100%);
      border-radius: 999px;
      cursor: pointer;
      box-shadow: rgba(120, 127, 246, 0.28) 0px 10px 24px;
      transition: box-shadow 140ms ease, opacity 140ms ease, filter 140ms ease;
      opacity: 0.98;
    }

    #${INLINE_ROOT_ID} button::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(120deg, transparent 22%, rgba(255, 255, 255, 0.32) 50%, transparent 78%);
      transform: translateX(-140%);
      transition: transform 260ms ease;
      pointer-events: none;
    }

    #${INLINE_ROOT_ID} button:hover {
      box-shadow: rgba(120, 127, 246, 0.36) 0px 12px 28px;
      filter: saturate(1.08) brightness(1.04);
    }

    #${INLINE_ROOT_ID} button:hover::after {
      transform: translateX(140%);
    }

    #${INLINE_ROOT_ID} button svg {
      position: relative;
      z-index: 1;
      width: 24px;
      height: 24px;
      display: block;
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
  button.title = INLINE_BUTTON_TITLE;
  button.setAttribute("aria-label", INLINE_BUTTON_TITLE);
  button.innerHTML = INLINE_LOGO;

  button.addEventListener("mouseenter", () => {
    void previewInlineAction(button);
  });
  button.addEventListener("mouseleave", () => {
    clearInlinePreview();
  });
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    void commitInlineAction(button);
  });

  root.appendChild(button);
  document.documentElement.appendChild(root);
  return root;
}

function setInlineButtonState(button: HTMLButtonElement, title: string): void {
  button.title = title;
  button.setAttribute("aria-label", title);
}

function clearInlinePreview(): void {
  if (!inlinePreviewState || inlinePreviewState.committed) {
    return;
  }

  inlinePreviewState.restore();
  inlinePreviewState = undefined;

  const button = document.querySelector<HTMLButtonElement>(`#${INLINE_ROOT_ID} button`);
  if (button) {
    setInlineButtonState(button, INLINE_BUTTON_TITLE);
  }
}

async function loadSingleInlineFillData(): Promise<
  | { status: "ready"; fillData: FillDataResult }
  | { status: "empty"; detail: string }
  | { status: "multiple"; detail: string }
> {
  const suggestions = await sendRuntimeMessage("bridge:getSuggestions", undefined);

  if (suggestions.items.length === 0) {
    return {
      status: "empty",
      detail: "No matching entries for this page."
    };
  }

  if (suggestions.items.length > 1) {
    return {
      status: "multiple",
      detail: "Multiple matches found. Open the popup to choose one."
    };
  }

  const fillData = await sendRuntimeMessage("bridge:getFillDataForEntry", {
    entryId: suggestions.items[0].entryId
  });

  return {
    status: "ready",
    fillData
  };
}

async function previewInlineAction(button: HTMLButtonElement): Promise<void> {
  if (inlinePreviewState?.committed) {
    return;
  }

  const requestId = ++inlinePreviewRequestId;
  setInlineButtonState(button, "Looking for matching entries...");

  try {
    const candidate = await loadSingleInlineFillData();
    if (requestId !== inlinePreviewRequestId) {
      return;
    }

    if (candidate.status !== "ready") {
      clearInlinePreview();
      setInlineButtonState(button, candidate.detail);
      return;
    }

    clearInlinePreview();
    const preview = previewFill(candidate.fillData, document);

    if (preview.result.status !== "filled") {
      setInlineButtonState(button, preview.result.detail);
      return;
    }

    inlinePreviewState = {
      entryId: candidate.fillData.entryId,
      restore: preview.restore,
      committed: false
    };

    setInlineButtonState(button, "Preview active. Click to keep the filled values.");
  } catch (error) {
    if (requestId !== inlinePreviewRequestId) {
      return;
    }

    clearInlinePreview();
    setInlineButtonState(
      button,
      error instanceof Error ? error.message : "ClavisPass could not reach the page."
    );
  }
}

async function commitInlineAction(button: HTMLButtonElement): Promise<void> {
  if (inlinePreviewState && !inlinePreviewState.committed) {
    inlinePreviewState.committed = true;
    setInlineButtonState(button, "Filled with ClavisPass.");
    return;
  }

  const candidate = await loadSingleInlineFillData();
  if (candidate.status !== "ready") {
    setInlineButtonState(button, candidate.detail);
    return;
  }

  const result = executeFill(candidate.fillData, document);
  setInlineButtonState(button, result.status === "filled" ? "Filled with ClavisPass." : result.detail);
}

function positionInlineRoot(): void {
  ensureInlineStyles();
  const passwordField = getPrimaryPasswordField();
  const existingRoot = document.getElementById(INLINE_ROOT_ID) as HTMLDivElement | null;

  if (!passwordField) {
    clearInlinePreview();
    existingRoot?.remove();
    return;
  }

  const root = getOrCreateInlineRoot();
  const button = root.querySelector("button");
  const rect = passwordField.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();
  const top = window.scrollY + rect.top + Math.max((rect.height - rootRect.height) / 2, 0);
  const left = window.scrollX + rect.left - rootRect.width - 10;

  root.style.top = `${Math.max(top, window.scrollY + 8)}px`;
  root.style.left = `${Math.max(left, window.scrollX + 8)}px`;

  if (button && !inlinePreviewState?.committed) {
    setInlineButtonState(button, INLINE_BUTTON_TITLE);
  }
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

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
  <svg viewBox="0 0 1080 1080" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
    <g transform="matrix(1.67587,0,0,1.74365,-366.657,-477.218)">
      <g transform="matrix(1,0,0,1.08209,0.502861,41.5011)">
        <path d="M288.857,324.383C384.853,311.928 468.535,283.596 540,245.197C611.68,283.711 695.651,312.099 792.011,324.495C693.27,403.812 612.016,497.341 540.504,599.811C468.957,497.293 387.661,403.724 288.857,324.383Z" fill="white"/>
      </g>
      <g transform="matrix(0.674354,0,0,0.648143,175.513,217.837)">
        <path d="M434.139,917.703C289.78,813.531 202.333,716.705 148.924,615.274C89.601,502.613 72.395,384.634 64.17,245.936C246.691,392.332 389.535,574.621 512.834,777.337C511.268,779.967 509.706,782.6 508.146,785.236C508.041,785.413 507.938,785.593 507.837,785.773L434.139,917.703Z" fill="white"/>
      </g>
      <g transform="matrix(1,0,0,1,0.502861,26.6667)">
        <path d="M862.724,350.572C857.177,440.468 845.574,516.935 805.569,589.956C761.291,670.777 682.322,747.088 540,833.279C524.328,823.787 509.419,814.409 495.235,805.128C495.235,805.128 544.244,720.806 546.785,716.433C632.969,576.457 732.982,450.591 862.724,350.572Z" fill="white"/>
      </g>
    </g>
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
        void sendRuntimeMessage("content:savePromptCandidate", candidate).catch(() => {
        });
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
      border: 1px solid #787ff6;
      border-radius: 12px;
      cursor: pointer;
      box-shadow: rgba(120, 127, 246, 0.28) 0px 10px 24px;
      transition: box-shadow 140ms ease, opacity 140ms ease, filter 140ms ease;
      opacity: 0.98;
    }

    #${INLINE_ROOT_ID} button::after {
      content: "";
      position: absolute;
      inset: 50%;
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.34);
      opacity: 0;
      pointer-events: none;
      transform: translate(-50%, -50%) scale(1);
      transition: opacity 180ms ease, transform 280ms ease;
    }

    #${INLINE_ROOT_ID} button:hover {
      box-shadow: rgba(120, 127, 246, 0.36) 0px 12px 28px;
      filter: saturate(1.05) brightness(1.03);
    }

    #${INLINE_ROOT_ID} button:hover::after {
      opacity: 1;
      transform: translate(-50%, -50%) scale(8);
    }

    #${INLINE_ROOT_ID} button svg {
      position: relative;
      z-index: 1;
      width: 22px;
      height: 22px;
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
  try {
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
  } catch (error) {
    setInlineButtonState(
      button,
      error instanceof Error ? error.message : "ClavisPass could not fill this page."
    );
  }
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
  const gap = 8;
  const viewportPadding = 8;
  const topInViewport = rect.top + Math.max((rect.height - rootRect.height) / 2, 0);
  const rightInViewport = rect.right + gap;
  const leftFallbackInViewport = rect.left - rootRect.width - gap;
  const maxTopInViewport = window.innerHeight - rootRect.height - viewportPadding;
  const maxLeftInViewport = window.innerWidth - rootRect.width - viewportPadding;
  const canPlaceRight = rightInViewport + rootRect.width <= window.innerWidth - viewportPadding;
  const leftInViewport = canPlaceRight ? rightInViewport : leftFallbackInViewport;
  const clampedTop = Math.min(
    Math.max(topInViewport, viewportPadding),
    Math.max(maxTopInViewport, viewportPadding)
  );
  const clampedLeft = Math.min(
    Math.max(leftInViewport, viewportPadding),
    Math.max(maxLeftInViewport, viewportPadding)
  );

  root.style.top = `${window.scrollY + clampedTop}px`;
  root.style.left = `${window.scrollX + clampedLeft}px`;

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

import { sendRuntimeMessage } from "../shared/messages";
import { isContentMessage } from "../shared/content-messages";
import { EXTENSION_THEME_STORAGE_KEY, isExtensionThemeMode, type ExtensionThemeMode } from "../shared/theme";
import { executeFill, previewFill } from "./fill";
import { classifyFieldSnapshot, createFieldSnapshot, extractSavePromptCandidate, isVisibleFieldCandidate } from "../shared/forms";
import type { AutofillEligibilityResult, ContentDebugInfo, FillExecutionResult } from "../shared/types";
import type { FillDataResult, SearchEntrySuggestion } from "../shared/bridge";

declare global {
  interface Window {
    __clavispassContentScriptLoaded?: boolean;
    __clavispassInlineRefresh?: () => void;
  }
}

const INLINE_ROOT_ID = "clavispass-inline-root";
const INLINE_PICKER_ID = "clavispass-inline-picker";
const INLINE_STYLE_ID = "clavispass-inline-style";
const INLINE_BUTTON_TITLE = "Fill with ClavisPass";
const INLINE_ELIGIBILITY_REFRESH_MS = 3000;
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const INLINE_LOGO_PATHS = [
  {
    transform: "matrix(1,0,0,1.08209,0.502861,41.5011)",
    d: "M288.857,324.383C384.853,311.928 468.535,283.596 540,245.197C611.68,283.711 695.651,312.099 792.011,324.495C693.27,403.812 612.016,497.341 540.504,599.811C468.957,497.293 387.661,403.724 288.857,324.383Z",
  },
  {
    transform: "matrix(0.674354,0,0,0.648143,175.513,217.837)",
    d: "M434.139,917.703C289.78,813.531 202.333,716.705 148.924,615.274C89.601,502.613 72.395,384.634 64.17,245.936C246.691,392.332 389.535,574.621 512.834,777.337C511.268,779.967 509.706,782.6 508.146,785.236C508.041,785.413 507.938,785.593 507.837,785.773L434.139,917.703Z",
  },
  {
    transform: "matrix(1,0,0,1,0.502861,26.6667)",
    d: "M862.724,350.572C857.177,440.468 845.574,516.935 805.569,589.956C761.291,670.777 682.322,747.088 540,833.279C524.328,823.787 509.419,814.409 495.235,805.128C495.235,805.128 544.244,720.806 546.785,716.433C632.969,576.457 732.982,450.591 862.724,350.572Z",
  },
];

const contentText = navigator.language.toLowerCase().startsWith("de")
  ? {
      chooseLogin: "Login ausw\u00e4hlen",
      close: "Schlie\u00dfen",
      noUsername: "Kein Benutzername"
    }
  : {
      chooseLogin: "Choose login",
      close: "Close",
      noUsername: "No username"
    };

interface InlinePreviewState {
  entryId: string;
  restore: () => void;
  committed: boolean;
}

let inlinePreviewState: InlinePreviewState | undefined;
let inlinePreviewRequestId = 0;
let inlineEligibilityRequestId = 0;
let inlinePickerCleanup: (() => void) | undefined;
let extensionThemeMode: ExtensionThemeMode | undefined;
let inlineEligibility = {
  checkedAt: 0,
  hasMatches: false,
  pending: false,
  url: "",
  inlineAutofillDisabled: false,
  desktopState: undefined as AutofillEligibilityResult["desktopState"] | undefined,
  appScheme: undefined as string | undefined
};

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

    if (rawMessage.type === "content:refreshInlineAutofill") {
      void refreshInlineEligibility();
      sendResponse({
        refreshed: true
      });
      return true;
    }

    if (rawMessage.type === "content:showAutofillPicker") {
      void showAutofillPicker();
      sendResponse({
        shown: true
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
      width: 40px;
      height: 32px;
      background: rgba(120, 127, 246, 0.11);
      border: 1px solid rgba(120, 127, 246, 0.22);
      border-radius: 12px;
      cursor: pointer;
      box-shadow: rgba(20, 24, 38, 0.12) 0px 8px 18px;
      backdrop-filter: blur(10px);
      transition: background 140ms ease, border-color 140ms ease, box-shadow 140ms ease, opacity 140ms ease;
      opacity: 0.96;
    }

    #${INLINE_ROOT_ID} button:hover {
      background: rgba(120, 127, 246, 0.16);
      border-color: rgba(120, 127, 246, 0.34);
      box-shadow: rgba(20, 24, 38, 0.16) 0px 10px 22px;
    }

    #${INLINE_ROOT_ID} button svg {
      position: relative;
      z-index: 1;
      width: 20px;
      height: 20px;
      display: block;
    }

    #${INLINE_PICKER_ID} {
      all: initial;
      --clavispass-picker-background: #ffffff;
      --clavispass-picker-border: rgba(120, 127, 246, 0.28);
      --clavispass-picker-title: #787ff6;
      --clavispass-picker-text: #141826;
      --clavispass-picker-muted: #5f667a;
      --clavispass-picker-hover: rgba(120, 127, 246, 0.09);
      --clavispass-picker-logo-bg: rgba(120, 127, 246, 0.12);
      --clavispass-picker-shadow: rgba(20, 24, 38, 0.18) 0px 14px 34px;
      --clavispass-picker-divider: rgba(20, 24, 38, 0.08);
      box-sizing: border-box;
      position: absolute;
      z-index: 2147483647;
      width: min(300px, calc(100vw - 16px));
      max-height: min(300px, calc(100vh - 16px));
      overflow: hidden;
      background: var(--clavispass-picker-background);
      border: 1px solid var(--clavispass-picker-border);
      border-radius: 12px;
      box-shadow: var(--clavispass-picker-shadow);
      color: var(--clavispass-picker-text);
      font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
      pointer-events: auto;
    }

    #${INLINE_PICKER_ID}[data-theme="dark"] {
      --clavispass-picker-background: #292929;
      --clavispass-picker-border: rgba(120, 127, 246, 0.34);
      --clavispass-picker-title: #9ca1ff;
      --clavispass-picker-text: #f4f2f7;
      --clavispass-picker-muted: #c6c2cf;
      --clavispass-picker-hover: rgba(120, 127, 246, 0.16);
      --clavispass-picker-logo-bg: rgba(120, 127, 246, 0.18);
      --clavispass-picker-shadow: rgba(0, 0, 0, 0.42) 0px 18px 38px;
      --clavispass-picker-divider: rgba(255, 255, 255, 0.09);
    }

    @media (prefers-color-scheme: dark) {
      #${INLINE_PICKER_ID}:not([data-theme]) {
        --clavispass-picker-background: #292929;
        --clavispass-picker-border: rgba(120, 127, 246, 0.34);
        --clavispass-picker-title: #9ca1ff;
        --clavispass-picker-text: #f4f2f7;
        --clavispass-picker-muted: #c6c2cf;
        --clavispass-picker-hover: rgba(120, 127, 246, 0.16);
        --clavispass-picker-logo-bg: rgba(120, 127, 246, 0.18);
        --clavispass-picker-shadow: rgba(0, 0, 0, 0.42) 0px 18px 38px;
        --clavispass-picker-divider: rgba(255, 255, 255, 0.09);
      }
    }

    #${INLINE_PICKER_ID} * {
      box-sizing: border-box;
      font-family: inherit;
    }

    #${INLINE_PICKER_ID} .clavispass-picker-head {
      align-items: center;
      border-bottom: 1px solid var(--clavispass-picker-divider);
      display: flex;
      gap: 8px;
      justify-content: space-between;
      padding: 10px 10px 8px;
    }

    #${INLINE_PICKER_ID} .clavispass-picker-title {
      color: var(--clavispass-picker-title);
      font-size: 13px;
      font-weight: 700;
      line-height: 1.2;
      margin: 0;
    }

    #${INLINE_PICKER_ID} .clavispass-picker-close {
      all: unset;
      align-items: center;
      border-radius: 8px;
      color: var(--clavispass-picker-muted);
      cursor: pointer;
      display: inline-flex;
      font-size: 18px;
      height: 26px;
      justify-content: center;
      line-height: 1;
      width: 26px;
    }

    #${INLINE_PICKER_ID} .clavispass-picker-close:hover {
      background: var(--clavispass-picker-hover);
      color: var(--clavispass-picker-title);
    }

    #${INLINE_PICKER_ID} .clavispass-picker-close svg {
      display: block;
      height: 15px;
      width: 15px;
    }

    #${INLINE_PICKER_ID} .clavispass-picker-list {
      display: flex;
      flex-direction: column;
      max-height: 248px;
      overflow-y: auto;
      padding: 0;
    }

    #${INLINE_PICKER_ID} .clavispass-picker-item {
      all: unset;
      align-items: center;
      border-bottom: 1px solid var(--clavispass-picker-divider);
      cursor: pointer;
      display: flex;
      gap: 9px;
      min-height: 48px;
      padding: 8px 12px;
    }

    #${INLINE_PICKER_ID} .clavispass-picker-item:last-child {
      border-bottom: 0;
    }

    #${INLINE_PICKER_ID} .clavispass-picker-item:hover {
      background: var(--clavispass-picker-hover);
    }

    #${INLINE_PICKER_ID} .clavispass-picker-mark {
      align-items: center;
      background: var(--clavispass-picker-logo-bg);
      border-radius: 9px;
      color: #787ff6;
      display: inline-flex;
      flex: 0 0 auto;
      height: 30px;
      justify-content: center;
      width: 30px;
    }

    #${INLINE_PICKER_ID} .clavispass-picker-copy {
      min-width: 0;
    }

    #${INLINE_PICKER_ID} .clavispass-picker-name,
    #${INLINE_PICKER_ID} .clavispass-picker-identity {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    #${INLINE_PICKER_ID} .clavispass-picker-name {
      color: var(--clavispass-picker-text);
      font-size: 13px;
      font-weight: 700;
      line-height: 1.25;
    }

    #${INLINE_PICKER_ID} .clavispass-picker-identity {
      color: var(--clavispass-picker-muted);
      font-size: 12px;
      line-height: 1.35;
      margin-top: 2px;
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
  button.appendChild(createInlineLogo());

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

function createInlineLogo(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NAMESPACE, "svg");
  svg.setAttribute("viewBox", "0 0 1080 1080");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  const rootGroup = document.createElementNS(SVG_NAMESPACE, "g");
  rootGroup.setAttribute("transform", "matrix(1.67587,0,0,1.74365,-366.657,-477.218)");

  for (const pathDefinition of INLINE_LOGO_PATHS) {
    const pathIndex = rootGroup.childElementCount;
    const group = document.createElementNS(SVG_NAMESPACE, "g");
    group.setAttribute("transform", pathDefinition.transform);

    const path = document.createElementNS(SVG_NAMESPACE, "path");
    path.setAttribute("d", pathDefinition.d);
    path.setAttribute("fill", pathIndex === 1 ? "#69c4ff" : "#787ff6");

    group.appendChild(path);
    rootGroup.appendChild(group);
  }

  svg.appendChild(rootGroup);
  return svg;
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

function removeInlineRoot(): void {
  clearInlinePreview();
  document.getElementById(INLINE_ROOT_ID)?.remove();
}

function removeInlinePicker(): void {
  inlinePickerCleanup?.();
  inlinePickerCleanup = undefined;
  document.getElementById(INLINE_PICKER_ID)?.remove();
}

function applyThemeToInlinePicker(): void {
  const picker = document.getElementById(INLINE_PICKER_ID);
  if (!picker) {
    return;
  }

  if (extensionThemeMode) {
    picker.dataset.theme = extensionThemeMode;
  } else {
    delete picker.dataset.theme;
  }
}

function setupExtensionThemeSync(): void {
  void chrome.storage.local.get(EXTENSION_THEME_STORAGE_KEY)
    .then((stored) => {
      const storedTheme = stored[EXTENSION_THEME_STORAGE_KEY];
      extensionThemeMode = isExtensionThemeMode(storedTheme) ? storedTheme : undefined;
      applyThemeToInlinePicker();
    })
    .catch(() => {
    });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") {
      return;
    }

    const change = changes[EXTENSION_THEME_STORAGE_KEY];
    if (!change) {
      return;
    }

    extensionThemeMode = isExtensionThemeMode(change.newValue) ? change.newValue : undefined;
    applyThemeToInlinePicker();
  });
}

async function refreshInlineEligibility(): Promise<void> {
  const requestId = ++inlineEligibilityRequestId;
  const url = window.location.href;

  inlineEligibility = {
    ...inlineEligibility,
    pending: true,
    url
  };

  try {
    const eligibility = await sendRuntimeMessage("bridge:getAutofillEligibility", { url });
    if (requestId !== inlineEligibilityRequestId || url !== window.location.href) {
      return;
    }

    inlineEligibility = {
      checkedAt: Date.now(),
      hasMatches: eligibility.hasMatches,
      pending: false,
      url,
      inlineAutofillDisabled: eligibility.inlineAutofillDisabled ?? false,
      desktopState: eligibility.desktopState,
      appScheme: eligibility.appScheme
    };
  } catch {
    if (requestId !== inlineEligibilityRequestId) {
      return;
    }

    inlineEligibility = {
      checkedAt: Date.now(),
      hasMatches: false,
      pending: false,
      url,
      inlineAutofillDisabled: false,
      desktopState: undefined,
      appScheme: undefined
    };
  } finally {
    if (requestId === inlineEligibilityRequestId) {
      positionInlineRoot();
    }
  }
}

function isInlineDesktopReady(): boolean {
  return inlineEligibility.desktopState === "ready";
}

async function openDesktopForInlineAction(button: HTMLButtonElement): Promise<void> {
  const message =
    inlineEligibility.desktopState === "locked"
      ? "Unlock ClavisPass Desktop to fill this page."
      : "Open ClavisPass Desktop to fill this page.";
  setInlineButtonState(button, message);

  try {
    await sendRuntimeMessage("bridge:openDesktopApp", {
      appScheme: inlineEligibility.appScheme
    });
  } catch {
  }
}

async function loadSingleInlineFillData(): Promise<
  | { status: "ready"; fillData: FillDataResult }
  | { status: "empty"; detail: string }
  | { status: "multiple"; detail: string }
> {
  const suggestions = await sendRuntimeMessage("bridge:getSuggestions", undefined);
  const passwordSuggestions = suggestions.items.filter((item) => item.hasPassword);

  if (passwordSuggestions.length === 0) {
    return {
      status: "empty",
      detail: "No matching entries for this page."
    };
  }

  if (passwordSuggestions.length > 1) {
    return {
      status: "multiple",
      detail: "Multiple matches found. Open the popup to choose one."
    };
  }

  const fillData = await sendRuntimeMessage("bridge:getFillDataForEntry", {
    entryId: passwordSuggestions[0].entryId
  });

  return {
    status: "ready",
    fillData
  };
}

function createPickerLogo(): SVGSVGElement {
  const svg = createInlineLogo();
  svg.setAttribute("width", "17");
  svg.setAttribute("height", "17");
  return svg;
}

function createCloseIcon(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NAMESPACE, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  const firstLine = document.createElementNS(SVG_NAMESPACE, "path");
  firstLine.setAttribute("d", "M6 6l12 12");
  firstLine.setAttribute("stroke", "currentColor");
  firstLine.setAttribute("stroke-linecap", "round");
  firstLine.setAttribute("stroke-width", "2.4");

  const secondLine = document.createElementNS(SVG_NAMESPACE, "path");
  secondLine.setAttribute("d", "M18 6L6 18");
  secondLine.setAttribute("stroke", "currentColor");
  secondLine.setAttribute("stroke-linecap", "round");
  secondLine.setAttribute("stroke-width", "2.4");

  svg.appendChild(firstLine);
  svg.appendChild(secondLine);
  return svg;
}

function getSuggestionIdentity(item: SearchEntrySuggestion): string {
  return item.email || item.username || contentText.noUsername;
}

function positionPicker(picker: HTMLDivElement): void {
  const passwordField = getPrimaryPasswordField();
  const anchor = document.getElementById(INLINE_ROOT_ID) || passwordField;
  if (!anchor) {
    return;
  }

  const rect = anchor.getBoundingClientRect();
  const pickerRect = picker.getBoundingClientRect();
  const viewportPadding = 8;
  const gap = 8;
  const maxLeft = window.innerWidth - pickerRect.width - viewportPadding;
  const maxTop = window.innerHeight - pickerRect.height - viewportPadding;
  const preferredLeft = rect.left;
  const preferredTop = rect.bottom + gap;
  const fallbackTop = rect.top - pickerRect.height - gap;
  const top = preferredTop + pickerRect.height <= window.innerHeight - viewportPadding
    ? preferredTop
    : fallbackTop;

  picker.style.left = `${window.scrollX + Math.min(Math.max(preferredLeft, viewportPadding), Math.max(maxLeft, viewportPadding))}px`;
  picker.style.top = `${window.scrollY + Math.min(Math.max(top, viewportPadding), Math.max(maxTop, viewportPadding))}px`;
}

async function fillSuggestionFromPicker(entryId: string, picker: HTMLDivElement): Promise<void> {
  let result: FillExecutionResult;

  try {
    const fillData = await sendRuntimeMessage("bridge:getFillDataForEntry", { entryId });
    result = executeFill(fillData, document);
  } catch (error) {
    picker.querySelector(".clavispass-picker-title")!.textContent =
      error instanceof Error ? error.message : "ClavisPass could not fill this page.";
    return;
  }

  if (result.status === "filled") {
    removeInlinePicker();
    return;
  }

  picker.querySelector(".clavispass-picker-title")!.textContent = result.detail;
}

async function showAutofillPicker(): Promise<void> {
  ensureInlineStyles();
  clearInlinePreview();
  removeInlinePicker();

  const suggestions = await sendRuntimeMessage("bridge:getSuggestions", undefined);
  const passwordSuggestions = suggestions.items.filter((item) => item.hasPassword);
  if (passwordSuggestions.length === 0) {
    return;
  }

  if (passwordSuggestions.length === 1) {
    const fillData = await sendRuntimeMessage("bridge:getFillDataForEntry", {
      entryId: passwordSuggestions[0].entryId
    });
    executeFill(fillData, document);
    return;
  }

  const picker = document.createElement("div");
  picker.id = INLINE_PICKER_ID;
  picker.setAttribute("role", "dialog");
  picker.setAttribute("aria-label", "Choose ClavisPass login");
  applyThemeToInlinePicker();

  const head = document.createElement("div");
  head.className = "clavispass-picker-head";

  const title = document.createElement("p");
  title.className = "clavispass-picker-title";
  title.textContent = contentText.chooseLogin;

  const close = document.createElement("button");
  close.className = "clavispass-picker-close";
  close.type = "button";
  close.setAttribute("aria-label", contentText.close);
  close.appendChild(createCloseIcon());
  close.addEventListener("click", removeInlinePicker);

  head.appendChild(title);
  head.appendChild(close);

  const list = document.createElement("div");
  list.className = "clavispass-picker-list";

  for (const item of passwordSuggestions) {
    const button = document.createElement("button");
    button.className = "clavispass-picker-item";
    button.type = "button";

    const mark = document.createElement("span");
    mark.className = "clavispass-picker-mark";
    mark.appendChild(createPickerLogo());

    const copy = document.createElement("span");
    copy.className = "clavispass-picker-copy";

    const name = document.createElement("span");
    name.className = "clavispass-picker-name";
    name.textContent = item.title;

    const identity = document.createElement("span");
    identity.className = "clavispass-picker-identity";
    identity.textContent = getSuggestionIdentity(item);

    copy.appendChild(name);
    copy.appendChild(identity);
    button.appendChild(mark);
    button.appendChild(copy);
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      void fillSuggestionFromPicker(item.entryId, picker);
    });

    list.appendChild(button);
  }

  picker.appendChild(head);
  picker.appendChild(list);
  document.documentElement.appendChild(picker);
  applyThemeToInlinePicker();
  positionPicker(picker);

  const handleOutsidePointerDown = (event: PointerEvent) => {
    if (!picker.contains(event.target as Node)) {
      removeInlinePicker();
    }
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      removeInlinePicker();
    }
  };

  document.addEventListener("pointerdown", handleOutsidePointerDown, true);
  document.addEventListener("keydown", handleKeyDown, true);
  inlinePickerCleanup = () => {
    document.removeEventListener("pointerdown", handleOutsidePointerDown, true);
    document.removeEventListener("keydown", handleKeyDown, true);
  };
}

async function previewInlineAction(button: HTMLButtonElement): Promise<void> {
  if (inlinePreviewState?.committed) {
    return;
  }

  if (!isInlineDesktopReady()) {
    setInlineButtonState(
      button,
      inlineEligibility.desktopState === "locked"
        ? "Unlock ClavisPass Desktop to fill this page."
        : "Open ClavisPass Desktop to fill this page."
    );
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
    if (!isInlineDesktopReady()) {
      await openDesktopForInlineAction(button);
      return;
    }

    if (inlinePreviewState && !inlinePreviewState.committed) {
      inlinePreviewState.committed = true;
      setInlineButtonState(button, "Filled with ClavisPass.");
      return;
    }

    const candidate = await loadSingleInlineFillData();
    if (candidate.status !== "ready") {
      if (candidate.status === "multiple") {
        await showAutofillPicker();
        return;
      }

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

  if (!passwordField) {
    removeInlineRoot();
    return;
  }

  const now = Date.now();
  const isEligibilityStale =
    inlineEligibility.url !== window.location.href ||
    now - inlineEligibility.checkedAt > INLINE_ELIGIBILITY_REFRESH_MS;

  if (isEligibilityStale && !inlineEligibility.pending) {
    void refreshInlineEligibility();
  }

  if (inlineEligibility.inlineAutofillDisabled || !inlineEligibility.hasMatches) {
    removeInlineRoot();
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
  const canPlaceLeft = leftFallbackInViewport >= viewportPadding;
  const canPlaceInside = rect.width >= rootRect.width + 20 && rect.height >= rootRect.height - 2;
  const insideInViewport = rect.right - rootRect.width - 6;
  const leftInViewport = canPlaceRight
    ? rightInViewport
    : canPlaceLeft
      ? leftFallbackInViewport
      : canPlaceInside
        ? insideInViewport
        : leftFallbackInViewport;
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
  window.setInterval(refresh, INLINE_ELIGIBILITY_REFRESH_MS);
  refresh();
}

registerContentFrame();

if (!window.__clavispassContentScriptLoaded) {
  window.__clavispassContentScriptLoaded = true;
  setupExtensionThemeSync();
  setupFillListener();
  setupSavePromptListener();
  setupInlineTrigger();
} else {
  window.__clavispassInlineRefresh?.();
}

export {};

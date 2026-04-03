export type LockState = "locked" | "unlocked";
export type BridgeStatus = "disconnected" | "pairing-required" | "ready" | "error";

export interface VaultEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  totp?: string;
  urls: string[];
  updatedAt: string;
}

export interface EntrySuggestion {
  entryId: string;
  title: string;
  username: string;
  matchedUrl: string;
  matchScore: number;
}

export interface SessionSnapshot {
  lockState: LockState;
  unlockedAt?: number;
  autoLockAt?: number;
  autoLockTimeoutMs: number;
  entryCount: number;
  bridgeStatus: BridgeStatus;
}

export interface ActiveTabContext {
  tabId?: number;
  url?: string;
  origin?: string;
  hostname?: string;
  protocol?: string;
  isSupported: boolean;
}

export interface ActiveDomainContext {
  host?: string;
  normalizedHost?: string;
  isSupported: boolean;
  detail: string;
}

export interface DesktopEntrySuggestionsView {
  domain: ActiveDomainContext;
  items: import("./bridge").SearchEntrySuggestion[];
  error?: string;
}

export interface PreparedFillSummary {
  entryId: string;
  title: string;
  hasUsername: boolean;
  hasPassword: boolean;
  hasTotp: boolean;
  preparedAt: number;
}

export interface PrepareFillForActiveTabResult {
  status: "ready" | "failed";
  detail: string;
  entry?: PreparedFillSummary;
}

export interface FillExecutionResult {
  status: "filled" | "no_fields" | "failed";
  detail: string;
  filledFields?: Array<"username" | "password" | "totp">;
}

export interface ContentDebugInfo {
  contentScriptLoaded: boolean;
  pageUrl: string;
  passwordFieldCount: number;
  visiblePasswordFieldCount: number;
  textLikeFieldCount: number;
  iframeCount: number;
  formsCount: number;
  inlineButtonVisible: boolean;
}

export interface ContentDebugResponse {
  status: "ok" | "failed";
  detail: string;
  info?: ContentDebugInfo;
}

export type EntryActionType = "autofill" | "copy-username" | "copy-password" | "copy-totp";

export interface EntryActionResult {
  success: boolean;
  action: EntryActionType;
  message: string;
}

export type FormFieldKind = "username" | "password" | "totp";

export interface LoginFieldMap {
  username?: string;
  password?: string;
  totp?: string;
}

export interface FormFieldSnapshot {
  key: string;
  type: string;
  name: string;
  id: string;
  autocomplete: string;
  placeholder: string;
  labelText: string;
  ariaLabel: string;
  inputMode: string;
  maxLength?: number;
  disabled: boolean;
  readOnly: boolean;
  hidden: boolean;
  visible: boolean;
  suspicious: boolean;
}

export interface DetectedForm {
  formId: string;
  actionOrigin: string;
  fieldMap: LoginFieldMap;
  hasPasswordField: boolean;
  hasVisibleUsernameCandidate: boolean;
  visibleFieldCount: number;
  totalRelevantFieldCount: number;
}

export interface LoginFormDetectedPayload {
  pageUrl: string;
  pageOrigin: string;
  forms: DetectedForm[];
}

export interface SavePromptCandidate {
  url: string;
  username?: string;
  password?: string;
}

export interface AutofillPayload {
  entry: VaultEntry;
}

export type SavePromptKind = "create" | "update";
export type SavePromptResolution = "save" | "update" | "dismiss";

export interface SavePromptDecision {
  id: string;
  kind: SavePromptKind;
  candidate: SavePromptCandidate;
  suggestedTitle: string;
  existingEntryId?: string;
  existingEntryTitle?: string;
  matchedHostname?: string;
  createdAt: number;
}

export interface PromptResolutionPayload {
  promptId: string;
  decision: SavePromptResolution;
}

export interface PromptResolutionResult {
  prompt?: SavePromptDecision;
  message: string;
}

export interface PendingPromptResponse {
  prompt?: SavePromptDecision;
}

export interface SavePromptCaptureResult {
  accepted: boolean;
  promptCreated: boolean;
}

export interface BridgePairingState {
  state: import("./bridge").PairingStatus;
  pairedAt?: string;
  peerName?: string;
}

export interface DesktopBridgeStatusSnapshot {
  status: BridgeStatus;
  transport: "native-messaging";
  pairing: BridgePairingState;
  appVersion?: string;
  lastError?: string;
}

export interface BridgeFillData {
  entryId: string;
  username: string;
  password: string;
  totp?: string;
}

export interface DesktopBridgeStatusView {
  transport: "native-messaging";
  state:
    | "host_unreachable"
    | "protocol_error"
    | "unpaired"
    | "pending"
    | "locked"
    | "not_ready"
    | "ready";
  label: string;
  detail: string;
  pairingStatus?: import("./bridge").PairingStatus;
  appState?: "ready" | "locked" | "not_ready";
  appVersion?: string;
  hostVersion?: string;
  desktopName?: string;
  lastError?: import("./bridge").BridgeError;
}

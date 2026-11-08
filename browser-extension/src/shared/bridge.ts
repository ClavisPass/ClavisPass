export type PairingStatus = "unpaired" | "pending" | "paired";

export interface BridgeClientInfo {
  extensionId: string;
  name: string;
  version: string;
  instanceId: string;
}

export interface BridgeError {
  code:
    | "host_unreachable"
    | "timeout"
    | "protocol_error"
    | "desktop_error"
    | "unknown";
  message: string;
  details?: string;
}

export interface GetStatusResult {
  hostName: string;
  protocolVersion: number;
  ready: boolean;
  pairingStatus: PairingStatus;
  appVersion?: string;
  appScheme?: "clavispass" | "clavispass-dev" | string;
  peer?: {
    extensionId: string;
    clientName?: string;
    clientVersion?: string;
    clientInstanceId?: string;
  };
  sessionUpdatedAtMs?: number;
}

export interface SearchEntriesByDomainPayload {
  domain: string;
}

export interface SearchEntrySuggestion {
  entryId: string;
  title: string;
  fav?: boolean;
  folderId?: string;
  username?: string;
  email?: string;
  hasPassword: boolean;
  hasTotp: boolean;
  hasPasskey: boolean;
  matchedHost?: string;
}

export interface GetFillDataForEntryPayload {
  entryId: string;
}

export interface GetPasskeyMetadataForEntryPayload {
  entryId: string;
}

export interface MatchPasskeysForRequestPayload {
  rpId: string;
  allowedCredentialIds?: string[];
}

export interface AssertPasskeyForBrowserPayload {
  entryId: string;
  moduleId?: string;
  rpId: string;
  challenge: string;
  origin: string;
  allowedCredentialIds?: string[];
  userVerified?: boolean;
}

export interface FillDataResult {
  entryId: string;
  title: string;
  username?: string;
  password: string;
  totp?: string;
}

export interface PasskeyCredentialMetadata {
  moduleId?: string;
  relyingPartyId: string;
  relyingPartyName?: string;
  userName?: string;
  userDisplayName?: string;
  transports?: string[];
  backupEligible?: boolean;
  backupState?: boolean;
  createdAt?: string;
  lastUsedAt?: string;
  source?: string;
}

export interface PasskeyMetadataResult {
  entryId: string;
  title: string;
  passkeys: PasskeyCredentialMetadata[];
}

export interface PasskeyRequestCandidate {
  entryId: string;
  entryTitle: string;
  moduleId?: string;
  relyingPartyId: string;
  relyingPartyName?: string;
  userName?: string;
  userDisplayName?: string;
}

export interface MatchPasskeysForRequestResult {
  passkeys: PasskeyRequestCandidate[];
}

export interface AssertionAuthenticatorResponse {
  authenticatorData: string;
  clientDataJSON: string;
  signature: string;
  userHandle?: string;
}

export interface AssertionPublicKeyCredential {
  id: string;
  rawId: string;
  type: "public-key";
  response: AssertionAuthenticatorResponse;
  clientExtensionResults: Record<string, unknown>;
}

export interface CreateEntryFromBrowserPayload {
  title: string;
  username?: string;
  password: string;
  url: string;
  matchedHost: string;
  email?: string;
  folderId?: string;
  totp?: string;
}

export interface UpdateEntryFromBrowserPayload {
  entryId: string;
  title?: string;
  username?: string;
  password: string;
  url: string;
  matchedHost: string;
  email?: string;
  totp?: string;
}

export interface BrowserWriteResult {
  entryId: string;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type BridgeCommand =
  | "getStatus"
  | "searchEntriesByDomain"
  | "getFillDataForEntry"
  | "getPasskeyMetadataForEntry"
  | "matchPasskeysForRequest"
  | "assertPasskeyForBrowser"
  | "createEntryFromBrowser"
  | "updateEntryFromBrowser";

export interface BridgePairingContext {
  status: PairingStatus;
}

export interface BridgeRequestPayloadMap {
  getStatus: undefined;
  searchEntriesByDomain: SearchEntriesByDomainPayload;
  getFillDataForEntry: GetFillDataForEntryPayload;
  getPasskeyMetadataForEntry: GetPasskeyMetadataForEntryPayload;
  matchPasskeysForRequest: MatchPasskeysForRequestPayload;
  assertPasskeyForBrowser: AssertPasskeyForBrowserPayload;
  createEntryFromBrowser: CreateEntryFromBrowserPayload;
  updateEntryFromBrowser: UpdateEntryFromBrowserPayload;
}

export interface BridgeResultMap {
  getStatus: GetStatusResult;
  searchEntriesByDomain: SearchEntrySuggestion[];
  getFillDataForEntry: FillDataResult;
  getPasskeyMetadataForEntry: PasskeyMetadataResult;
  matchPasskeysForRequest: MatchPasskeysForRequestResult;
  assertPasskeyForBrowser: AssertionPublicKeyCredential;
  createEntryFromBrowser: BrowserWriteResult;
  updateEntryFromBrowser: BrowserWriteResult;
}

export interface BridgeRequest<T extends BridgeCommand = BridgeCommand> {
  id: string;
  version: number;
  command: T;
  payload: BridgeRequestPayloadMap[T];
  client: BridgeClientInfo;
  pairing?: BridgePairingContext;
}

export interface BridgeResponse<T extends BridgeCommand = BridgeCommand> {
  id: string;
  ok: boolean;
  result?: BridgeResultMap[T];
  error?: BridgeError;
}

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
  matchedHost?: string;
}

export interface GetFillDataForEntryPayload {
  entryId: string;
}

export interface FillDataResult {
  entryId: string;
  title: string;
  username?: string;
  password: string;
  totp?: string;
}

export type BridgeCommand = "getStatus" | "searchEntriesByDomain" | "getFillDataForEntry";

export interface BridgePairingContext {
  status: PairingStatus;
}

export interface BridgeRequestPayloadMap {
  getStatus: undefined;
  searchEntriesByDomain: SearchEntriesByDomainPayload;
  getFillDataForEntry: GetFillDataForEntryPayload;
}

export interface BridgeResultMap {
  getStatus: GetStatusResult;
  searchEntriesByDomain: SearchEntrySuggestion[];
  getFillDataForEntry: FillDataResult;
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

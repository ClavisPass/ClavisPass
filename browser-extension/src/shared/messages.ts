import type {
  DesktopBridgeStatusView,
  DesktopEntrySuggestionsView,
  FillExecutionResult,
  PendingPromptResponse,
  PrepareFillForActiveTabResult,
  PromptResolutionPayload,
  PromptResolutionResult,
  SavePromptCaptureResult,
  SavePromptCandidate,
  ContentDebugResponse
  ,
  OpenDesktopAppResult
} from "./types";
import type { GetFillDataForEntryPayload } from "./bridge";

export type MessageMap = {
  "bridge:getStatus": {
    request: undefined;
    response: DesktopBridgeStatusView;
  };
  "bridge:getSuggestions": {
    request: undefined;
    response: DesktopEntrySuggestionsView;
  };
  "bridge:prepareFillForActiveTab": {
    request: GetFillDataForEntryPayload;
    response: PrepareFillForActiveTabResult;
  };
  "bridge:fillActiveTab": {
    request: GetFillDataForEntryPayload;
    response: FillExecutionResult;
  };
  "bridge:getContentDebug": {
    request: undefined;
    response: ContentDebugResponse;
  };
  "bridge:openDesktopApp": {
    request: undefined;
    response: OpenDesktopAppResult;
  };
  "prompt:getPending": {
    request: undefined;
    response: PendingPromptResponse;
  };
  "prompt:resolve": {
    request: PromptResolutionPayload;
    response: PromptResolutionResult;
  };
  "content:savePromptCandidate": {
    request: SavePromptCandidate;
    response: SavePromptCaptureResult;
  };
  "content:ready": {
    request: { url: string };
    response: { acknowledged: true };
  };
};

export type MessageType = keyof MessageMap;

export type RequestFor<T extends MessageType> = MessageMap[T]["request"];
export type ResponseFor<T extends MessageType> = MessageMap[T]["response"];

export interface ExtensionMessage<T extends MessageType = MessageType> {
  type: T;
  payload: RequestFor<T>;
}

export function sendRuntimeMessage<T extends MessageType>(
  type: T,
  payload: RequestFor<T>
): Promise<ResponseFor<T>> {
  return chrome.runtime.sendMessage({ type, payload } satisfies ExtensionMessage<T>);
}

export function isExtensionMessage(value: unknown): value is ExtensionMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ExtensionMessage>;
  return typeof candidate.type === "string" && "payload" in candidate;
}

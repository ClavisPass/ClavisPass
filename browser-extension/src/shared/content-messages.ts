import type { FillDataResult } from "./bridge";
import type { FillExecutionResult, ContentDebugInfo } from "./types";

export type ContentMessageMap = {
  "content:fillData": {
    request: {
      fillData: FillDataResult;
    };
    response: FillExecutionResult;
  };
  "content:getDebugInfo": {
    request: undefined;
    response: ContentDebugInfo;
  };
};

export type ContentMessageType = keyof ContentMessageMap;

export type ContentRequestFor<T extends ContentMessageType> = ContentMessageMap[T]["request"];
export type ContentResponseFor<T extends ContentMessageType> = ContentMessageMap[T]["response"];

export interface ContentMessage<T extends ContentMessageType = ContentMessageType> {
  type: T;
  payload: ContentRequestFor<T>;
}

export function isContentMessage(value: unknown): value is ContentMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ContentMessage>;
  return typeof candidate.type === "string" && "payload" in candidate;
}

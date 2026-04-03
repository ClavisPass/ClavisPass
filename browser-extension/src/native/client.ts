import { getBridgeClientInfo } from "./identity";
import {
  BRIDGE_PROTOCOL_VERSION,
  BRIDGE_TIMEOUT_MS,
  NATIVE_HOST_NAME,
  type BridgeCommand,
  type BridgePairingContext,
  type BridgeRequest,
  type BridgeRequestPayloadMap,
  type BridgeResponse,
  type BridgeResultMap
} from "./protocol";
import type { BridgeError } from "../shared/bridge";

export class NativeMessagingError extends Error {
  constructor(public readonly bridgeError: BridgeError) {
    super(bridgeError.message);
    this.name = "NativeMessagingError";
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(
        new NativeMessagingError({
          code: "timeout",
          message: `Desktop bridge request timed out after ${timeoutMs}ms.`
        })
      );
    }, timeoutMs);

    void promise
      .then((value) => {
        clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

function toBridgeError(error: unknown): BridgeError {
  if (error instanceof NativeMessagingError) {
    return error.bridgeError;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes("native host") || message.includes("native messaging host not found")) {
      return {
        code: "host_unreachable",
        message: "Desktop app is not reachable via native messaging.",
        details: error.message
      };
    }

    return {
      code: "unknown",
      message: error.message
    };
  }

  return {
    code: "unknown",
    message: "Unknown native messaging failure."
  };
}

function validateBridgeResponse<T extends BridgeCommand>(
  command: T,
  requestId: string,
  response: unknown
): BridgeResponse<T> {
  if (!response || typeof response !== "object") {
    throw new NativeMessagingError({
      code: "protocol_error",
      message: "Desktop app returned an invalid response envelope."
    });
  }

  const candidate = response as Partial<BridgeResponse<T>>;
  if (candidate.id !== requestId || typeof candidate.ok !== "boolean") {
    throw new NativeMessagingError({
      code: "protocol_error",
      message: "Desktop app returned a malformed response.",
      details: `Command: ${command}`
    });
  }

  return candidate as BridgeResponse<T>;
}

export class NativeMessagingClient {
  constructor(
    private readonly hostName: string = NATIVE_HOST_NAME,
    private readonly timeoutMs: number = BRIDGE_TIMEOUT_MS
  ) {}

  async request<T extends BridgeCommand>(
    command: T,
    payload: BridgeRequestPayloadMap[T],
    pairing?: BridgePairingContext
  ): Promise<BridgeResultMap[T]> {
    const client = await getBridgeClientInfo();
    const requestId = `${command}:${Date.now()}:${crypto.randomUUID()}`;

    const request: BridgeRequest<T> = {
      id: requestId,
      version: BRIDGE_PROTOCOL_VERSION,
      command,
      payload,
      client,
      pairing
    };

    try {
      const rawResponse = await withTimeout(
        chrome.runtime.sendNativeMessage(this.hostName, request),
        this.timeoutMs
      );

      const response = validateBridgeResponse(command, requestId, rawResponse);
      if (!response.ok) {
        throw new NativeMessagingError(
          response.error ?? {
            code: "desktop_error",
            message: "Desktop app rejected the request."
          }
        );
      }

      if (typeof response.result === "undefined") {
        throw new NativeMessagingError({
          code: "protocol_error",
          message: "Desktop app returned no result."
        });
      }

      return response.result;
    } catch (error) {
      throw new NativeMessagingError(toBridgeError(error));
    }
  }
}

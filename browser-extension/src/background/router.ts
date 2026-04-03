import type {
  ExtensionMessage,
  MessageType,
  RequestFor,
  ResponseFor
} from "../shared/messages";

export interface BackgroundMessageContext {
  sender: chrome.runtime.MessageSender;
}

type BackgroundHandler<T extends MessageType> = (
  payload: RequestFor<T>,
  context: BackgroundMessageContext
) => Promise<ResponseFor<T>> | ResponseFor<T>;

export type BackgroundHandlerMap = {
  [K in MessageType]: BackgroundHandler<K>;
};

export class BackgroundMessageRouter {
  constructor(private readonly handlers: BackgroundHandlerMap) {}

  async handle<T extends MessageType>(
    message: ExtensionMessage<T>,
    context: BackgroundMessageContext
  ): Promise<ResponseFor<T>> {
    const handler = this.handlers[message.type] as BackgroundHandler<T>;
    return handler(message.payload, context);
  }
}

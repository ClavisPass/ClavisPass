import ClipboardCopyPayload from "./ClipboardCopyPayload";

type Handler = (payload: ClipboardCopyPayload) => void;

const handlers = new Set<Handler>();

export function emitClipboardCopied(payload: ClipboardCopyPayload) {
  handlers.forEach((h) => h(payload));
}

export function subscribeClipboardCopied(handler: Handler) {
  handlers.add(handler);
}

export function unsubscribeClipboardCopied(handler: Handler) {
  handlers.delete(handler);
}

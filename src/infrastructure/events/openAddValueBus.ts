type Handler = () => void;

const handlers = new Set<Handler>();
const requestHandlers = new Set<Handler>();

export function emitOpenAddValue() {
  handlers.forEach((handler) => handler());
}

export function emitOpenAddValueRequest() {
  requestHandlers.forEach((handler) => handler());
}

export function subscribeOpenAddValue(handler: Handler) {
  handlers.add(handler);
}

export function unsubscribeOpenAddValue(handler: Handler) {
  handlers.delete(handler);
}

export function subscribeOpenAddValueRequest(handler: Handler) {
  requestHandlers.add(handler);
}

export function unsubscribeOpenAddValueRequest(handler: Handler) {
  requestHandlers.delete(handler);
}

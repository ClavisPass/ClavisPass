type Handler = () => void;

const handlers = new Set<Handler>();

export function emitOpenAddValue() {
  handlers.forEach((handler) => handler());
}

export function subscribeOpenAddValue(handler: Handler) {
  handlers.add(handler);
}

export function unsubscribeOpenAddValue(handler: Handler) {
  handlers.delete(handler);
}

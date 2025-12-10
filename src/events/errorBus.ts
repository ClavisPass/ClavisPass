import GlobalErrorPayload from "../types/GlobalErrorPayload";

type Listener = (error: GlobalErrorPayload) => void;

const listeners = new Set<Listener>();

export function subscribeGlobalError(listener: Listener) {
  listeners.add(listener);
}

export function unsubscribeGlobalError(listener: Listener) {
  listeners.delete(listener);
}

export function triggerGlobalError(error: GlobalErrorPayload) {
  for (const listener of listeners) {
    try {
      listener(error);
    } catch (e) {
      console.error("[GlobalError] Listener failed:", e);
    }
  }
}

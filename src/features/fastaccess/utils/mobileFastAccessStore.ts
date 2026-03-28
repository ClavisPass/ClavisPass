import FastAccessPayload from "../model/FastAccessPayload";

type Listener = (payload: FastAccessPayload | null) => void;

let currentPayload: FastAccessPayload | null = null;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener(currentPayload));
}

export function showMobileFastAccess(payload: FastAccessPayload) {
  currentPayload = payload;
  emit();
}

export function hideMobileFastAccess() {
  currentPayload = null;
  emit();
}

export function subscribeMobileFastAccess(listener: Listener) {
  listeners.add(listener);
  listener(currentPayload);

  return () => {
    listeners.delete(listener);
  };
}

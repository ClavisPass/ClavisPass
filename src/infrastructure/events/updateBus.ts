import type { Update } from "@tauri-apps/plugin-updater";

type Listener = (update: Update | null) => void;

const listeners = new Set<Listener>();

export function subscribeUpdateCheck(listener: Listener) {
  listeners.add(listener);
}

export function unsubscribeUpdateCheck(listener: Listener) {
  listeners.delete(listener);
}

export function publishUpdateCheck(update: Update | null) {
  for (const listener of listeners) {
    try {
      listener(update);
    } catch (error) {
      console.error("[UpdateBus] Listener failed:", error);
    }
  }
}

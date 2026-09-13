import { useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_AUTO_HIDE_MS = 30_000;

let activeRevealId: string | null = null;
const listeners = new Set<() => void>();

function emitRevealChange() {
  listeners.forEach((listener) => listener());
}

export function concealActiveSecretReveal() {
  if (!activeRevealId) return;

  activeRevealId = null;
  emitRevealChange();
}

type Options = {
  autoHideMs?: number;
};

export function useExclusiveSecretReveal(id: string, options?: Options) {
  const autoHideMs = options?.autoHideMs ?? DEFAULT_AUTO_HIDE_MS;
  const [activeId, setActiveId] = useState(activeRevealId);
  const isRevealed = activeId === id;

  useEffect(() => {
    const listener = () => setActiveId(activeRevealId);
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
      if (activeRevealId === id) {
        activeRevealId = null;
        emitRevealChange();
      }
    };
  }, [id]);

  useEffect(() => {
    if (!isRevealed || autoHideMs <= 0) return;

    const timeout = setTimeout(() => {
      if (activeRevealId === id) {
        concealActiveSecretReveal();
      }
    }, autoHideMs);

    return () => clearTimeout(timeout);
  }, [autoHideMs, id, isRevealed]);

  const reveal = useCallback(() => {
    activeRevealId = id;
    emitRevealChange();
  }, [id]);

  const conceal = useCallback(() => {
    if (activeRevealId === id) {
      concealActiveSecretReveal();
    }
  }, [id]);

  const toggle = useCallback(() => {
    if (activeRevealId === id) {
      concealActiveSecretReveal();
      return;
    }

    activeRevealId = id;
    emitRevealChange();
  }, [id]);

  return useMemo(
    () => ({ isRevealed, reveal, conceal, toggle }),
    [conceal, isRevealed, reveal, toggle],
  );
}

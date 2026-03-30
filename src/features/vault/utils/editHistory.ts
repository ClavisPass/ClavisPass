import { useCallback, useMemo, useState } from "react";
import ValuesType from "../model/ValuesType";

const DEFAULT_COALESCE_WINDOW_MS = 1200;
const MAX_LOG_ENTRIES = 200;

export type EditHistoryActionType =
  | "init"
  | "title"
  | "favorite"
  | "folder"
  | "modules"
  | "module"
  | "system"
  | "undo"
  | "redo"
  | "save";

export type EditHistoryMeta = {
  action: EditHistoryActionType;
  label: string;
  coalesceKey?: string;
  coalesceWindowMs?: number;
};

export type EditSessionLogEntry = {
  id: string;
  action: EditHistoryActionType;
  label: string;
  timestamp: string;
};

type HistoryEntry = {
  snapshot: ValuesType;
  meta: EditHistoryMeta;
  timestamp: number;
};

type HistoryState = {
  entries: HistoryEntry[];
  index: number;
  log: EditSessionLogEntry[];
};

type Updater = ValuesType | ((current: ValuesType) => ValuesType);

const cloneValue = (value: ValuesType): ValuesType =>
  JSON.parse(JSON.stringify(value)) as ValuesType;

const areValuesEqual = (left: ValuesType, right: ValuesType) =>
  JSON.stringify(left) === JSON.stringify(right);

const createLogEntry = (meta: EditHistoryMeta): EditSessionLogEntry => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  action: meta.action,
  label: meta.label,
  timestamp: new Date().toISOString(),
});

const appendLog = (
  log: EditSessionLogEntry[],
  meta: EditHistoryMeta
): EditSessionLogEntry[] => {
  const next = [...log, createLogEntry(meta)];
  return next.length > MAX_LOG_ENTRIES
    ? next.slice(next.length - MAX_LOG_ENTRIES)
    : next;
};

const shouldCoalesce = (
  previous: HistoryEntry | undefined,
  nextMeta: EditHistoryMeta,
  now: number
) => {
  if (!previous) return false;
  if (!nextMeta.coalesceKey) return false;
  if (previous.meta.coalesceKey !== nextMeta.coalesceKey) return false;

  const windowMs =
    nextMeta.coalesceWindowMs ?? DEFAULT_COALESCE_WINDOW_MS;

  return now - previous.timestamp <= windowMs;
};

export function useEditHistory(initialValue: ValuesType) {
  const [history, setHistory] = useState<HistoryState>(() => ({
    entries: [
      {
        snapshot: cloneValue(initialValue),
        meta: {
          action: "init",
          label: "Editor opened",
        },
        timestamp: Date.now(),
      },
    ],
    index: 0,
    log: [],
  }));

  const value = history.entries[history.index].snapshot;

  const applyChange = useCallback((updater: Updater, meta: EditHistoryMeta) => {
    setHistory((prev) => {
      const currentEntry = prev.entries[prev.index];
      const currentValue = currentEntry.snapshot;
      const nextValue =
        typeof updater === "function"
          ? (updater as (current: ValuesType) => ValuesType)(currentValue)
          : updater;

      const nextSnapshot = cloneValue(nextValue);
      if (areValuesEqual(currentValue, nextSnapshot)) {
        return prev;
      }

      const now = Date.now();
      const entries = prev.entries.slice(0, prev.index + 1);
      const coalesce = shouldCoalesce(entries[entries.length - 1], meta, now);

      if (coalesce && entries.length > 1) {
        entries[entries.length - 1] = {
          snapshot: nextSnapshot,
          meta,
          timestamp: now,
        };

        return {
          entries,
          index: entries.length - 1,
          log: appendLog(prev.log, meta),
        };
      }

      entries.push({
        snapshot: nextSnapshot,
        meta,
        timestamp: now,
      });

      return {
        entries,
        index: entries.length - 1,
        log: appendLog(prev.log, meta),
      };
    });
  }, []);

  const replaceCurrent = useCallback(
    (updater: Updater, meta?: Partial<EditHistoryMeta>) => {
      setHistory((prev) => {
        const currentEntry = prev.entries[prev.index];
        const currentValue = currentEntry.snapshot;
        const nextValue =
          typeof updater === "function"
            ? (updater as (current: ValuesType) => ValuesType)(currentValue)
            : updater;
        const entries = [...prev.entries];

        entries[prev.index] = {
          snapshot: cloneValue(nextValue),
          meta: {
            ...currentEntry.meta,
            ...meta,
          },
          timestamp: Date.now(),
        };

        return {
          ...prev,
          entries,
        };
      });
    },
    []
  );

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.index === 0) return prev;

      return {
        ...prev,
        index: prev.index - 1,
        log: appendLog(prev.log, {
          action: "undo",
          label: "Undid latest change",
        }),
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.index >= prev.entries.length - 1) return prev;

      return {
        ...prev,
        index: prev.index + 1,
        log: appendLog(prev.log, {
          action: "redo",
          label: "Restored change",
        }),
      };
    });
  }, []);

  const reset = useCallback((nextValue: ValuesType, meta?: EditHistoryMeta) => {
    setHistory({
      entries: [
        {
          snapshot: cloneValue(nextValue),
          meta: meta ?? {
            action: "save",
            label: "Saved changes",
          },
          timestamp: Date.now(),
        },
      ],
      index: 0,
      log: meta ? [createLogEntry(meta)] : [],
    });
  }, []);

  return useMemo(
    () => ({
      value,
      canUndo: history.index > 0,
      canRedo: history.index < history.entries.length - 1,
      sessionLog: history.log,
      applyChange,
      replaceCurrent,
      undo,
      redo,
      reset,
    }),
    [applyChange, history.index, history.entries.length, history.log, redo, replaceCurrent, reset, undo, value]
  );
}

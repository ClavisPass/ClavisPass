// settings/SettingsContext.tsx
import React from "react";
import type { DataKey, StoreValueMap } from "../../infrastructure/storage/store";
import * as store from "../../infrastructure/storage/store";

type SettingsState = Partial<{ [K in DataKey]: StoreValueMap[K] }>;

type SettingsContextValue = {
  getSetting: <K extends DataKey>(key: K) => StoreValueMap[K];
  peekSetting: <K extends DataKey>(key: K) => StoreValueMap[K] | undefined;
  setSetting: <K extends DataKey>(
    key: K,
    value: StoreValueMap[K]
  ) => Promise<void>;
  refreshSetting: <K extends DataKey>(key: K) => Promise<void>;
  isReady: boolean;
};

const SettingsContext = React.createContext<SettingsContextValue | null>(null);

const DEFAULT_KEYS = Object.keys(store.storeSchema) as DataKey[];

export function SettingsProvider({
  children,
  preloadKeys = DEFAULT_KEYS,
}: {
  children: React.ReactNode;
  preloadKeys?: DataKey[];
}) {
  const [state, setState] = React.useState<SettingsState>({});
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const entries = await Promise.all(
          preloadKeys.map(async (k) => [k, await store.get(k)] as const)
        );

        if (!cancelled) {
          const next = Object.fromEntries(entries) as SettingsState;
          setState(next);
          setIsReady(true);
        }
      } catch {
        if (!cancelled) setIsReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [preloadKeys]);

  const peekSetting = React.useCallback(
    <K extends DataKey>(key: K): StoreValueMap[K] | undefined => {
      return state[key] as StoreValueMap[K] | undefined;
    },
    [state]
  );

  const getSetting = React.useCallback(
    <K extends DataKey>(key: K): StoreValueMap[K] => {
      const cached = state[key] as StoreValueMap[K] | undefined;
      if (cached !== undefined) return cached;

      return store.storeSchema[key].default as StoreValueMap[K];
    },
    [state]
  );

  const setSetting = React.useCallback(
    async <K extends DataKey>(key: K, value: StoreValueMap[K]) => {
      await store.set(key, value);
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const refreshSetting = React.useCallback(
    async <K extends DataKey>(key: K) => {
      const v = await store.get(key);
      setState((prev) => ({ ...prev, [key]: v }));
    },
    []
  );

  const ctx: SettingsContextValue = React.useMemo(
    () => ({ getSetting, peekSetting, setSetting, refreshSetting, isReady }),
    [getSetting, peekSetting, setSetting, refreshSetting, isReady]
  );

  return (
    <SettingsContext.Provider value={ctx}>{children}</SettingsContext.Provider>
  );
}

export function useSetting<K extends DataKey>(key: K) {
  const ctx = React.useContext(SettingsContext);
  if (!ctx) throw new Error("useSetting must be used within SettingsProvider");

  const { getSetting, peekSetting, setSetting, refreshSetting, isReady } = ctx;

  // Sofort verfügbar: Cache oder Default
  const value = getSetting(key);

  // Lazy-load: wenn noch nicht im Cache, aus AsyncStorage nachziehen
  React.useEffect(() => {
    if (peekSetting(key) === undefined) {
      void refreshSetting(key);
    }
  }, [key, peekSetting, refreshSetting]);

  const setValue = React.useCallback(
    (next: StoreValueMap[K]) => setSetting(key, next),
    [key, setSetting]
  );

  const refresh = React.useCallback(
    () => refreshSetting(key),
    [key, refreshSetting]
  );

  return { value, setValue, refresh, isReady };
}

export function useSettings() {
  const ctx = React.useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}

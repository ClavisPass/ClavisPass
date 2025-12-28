import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useCallback,
} from "react";

import type VaultDataType from "../../features/vault/model/VaultDataType";
import type FolderType from "../../features/vault/model/FolderType";
import type ValuesType from "../../features/vault/model/ValuesType";

import ModulesEnum from "../../features/vault/model/ModulesEnum";

import {
  buildEntryMeta,
  EntryMeta,
  getSecretFor,
} from "../../features/vault/utils/modulePolicy";

import { VaultSession } from "../../features/vault/utils/VaultSession";
import VaultDeviceType from "../../features/vault/model/VaultDeviceType";

type VaultData = NonNullable<VaultDataType>;

export type VaultContextType = {
  // Meta / UI-safe state
  isUnlocked: boolean;
  entries: EntryMeta[];
  folders: FolderType[];
  dirty: boolean;

  // Session control
  unlockWithDecryptedVault: (decrypted: VaultData) => void;
  lock: () => void;

  // Refresh derived meta state from session
  refresh: () => void;

  // Secrets (on-demand)
  getSecretValue: (entryId: string, module: ModulesEnum) => string | null;
  getSecretPayload: (entryId: string, module: ModulesEnum) => unknown;

  // Writes (mutate session, mark dirty)
  upsertEntry: (entry: ValuesType) => void;
  deleteEntry: (id: string) => void;

  // Generic update helper (for small mutations)
  update: (recipe: (draft: VaultData) => void) => void;

  // Explicit folder write helper (common in UI)
  setFolders: (folders: FolderType[]) => void;

  // Persistence helpers (encrypt+save+sync outside)
  exportFullData: () => VaultData;
  markSaved: () => void;
  devices: VaultDeviceType[];
};

const VaultContext = createContext<VaultContextType | null>(null);

export function VaultProvider({ children }: { children: ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  // UI-safe derived state
  const [entries, setEntries] = useState<EntryMeta[]>([]);
  const [folders, setFoldersState] = useState<FolderType[]>([]);
  const [devices, setDevices] = useState<VaultDeviceType[]>([]);
  const [dirty, setDirty] = useState(false);

  const refresh = useCallback(() => {
    const metas = VaultSession.getValues().map(buildEntryMeta);
    setEntries(metas);

    // Folder list is non-secret meta
    const fs = VaultSession.getFolders();
    setFoldersState(fs);

    setDirty(VaultSession.isDirty());
    const ds = VaultSession.getDevices();
    setDevices(ds);
  }, []);

  const unlockWithDecryptedVault = useCallback(
    (decrypted: VaultData) => {
      VaultSession.unlock(decrypted);
      setIsUnlocked(true);
      refresh();
    },
    [refresh]
  );

  const lock = useCallback(() => {
    VaultSession.lock();
    setIsUnlocked(false);
    setEntries([]);
    setFoldersState([]);
    setDirty(false);
    setDevices([]);
  }, []);

  const getSecretPayload = useCallback(
    (entryId: string, module: ModulesEnum): unknown => {
      const entry = VaultSession.getEntry(entryId);
      if (!entry) return null;
      return getSecretFor(entry, module);
    },
    []
  );

  const getSecretValue = useCallback(
    (entryId: string, module: ModulesEnum): string | null => {
      const payload = getSecretPayload(entryId, module);
      return typeof payload === "string" ? payload : null;
    },
    [getSecretPayload]
  );

  const upsertEntry = useCallback(
    (entry: ValuesType) => {
      VaultSession.upsertEntry(entry);
      refresh();
    },
    [refresh]
  );

  const deleteEntry = useCallback(
    (id: string) => {
      VaultSession.deleteEntry(id);
      refresh();
    },
    [refresh]
  );

  const exportFullData = useCallback(() => VaultSession.exportFullData(), []);

  const markSaved = useCallback(() => {
    VaultSession.markSaved();
    refresh();
  }, [refresh]);

  /**
   * Single write gateway:
   * - snapshot -> mutate -> replace session -> refresh
   */
  const update = useCallback(
    (recipe: (draft: VaultData) => void) => {
      if (!isUnlocked) return;

      const snapshot = VaultSession.exportFullData();

      // shallow clone for safe mutation patterns
      const next: VaultData = {
        ...snapshot,
        folder: [...(snapshot.folder ?? [])],
        values: [...(snapshot.values ?? [])],
        devices: [...(snapshot.devices ?? [])], // ✅ NEW
      };

      recipe(next);

      // replace session data
      VaultSession.unlock(next);

      // ensure dirty on update-path (if your VaultSession supports it)
      if (typeof (VaultSession as any).markDirty === "function") {
        (VaultSession as any).markDirty();
      }

      refresh();
    },
    [isUnlocked, refresh]
  );

  const setFolders = useCallback(
    (nextFolders: FolderType[]) => {
      update((draft) => {
        draft.folder = nextFolders;
      });
    },
    [update]
  );

  const value = useMemo<VaultContextType>(
    () => ({
      isUnlocked,
      entries,
      folders,
      devices,
      dirty,
      unlockWithDecryptedVault,
      lock,
      refresh,
      getSecretValue,
      getSecretPayload,
      upsertEntry,
      deleteEntry,
      update,
      setFolders,
      exportFullData,
      markSaved,
    }),
    [
      isUnlocked,
      entries,
      folders,
      devices,
      dirty,
      unlockWithDecryptedVault,
      lock,
      refresh,
      getSecretValue,
      getSecretPayload,
      upsertEntry,
      deleteEntry,
      update,
      setFolders,
      exportFullData,
      markSaved,
    ]
  );

  return (
    <VaultContext.Provider value={value}>{children}</VaultContext.Provider>
  );
}

export function useVault() {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error("useVault must be used within VaultProvider");
  return ctx;
}

import FolderType from "../model/FolderType";
import ValuesType from "../model/ValuesType";
import VaultData from "../model/VaultData";
import VaultSessionState from "../model/VaultSessionState";

let session: VaultSessionState | null = null;

export const VaultSession = {
  isUnlocked(): boolean {
    return session !== null;
  },

  unlock(decrypted: VaultData) {
    session = { data: decrypted, dirty: false, unlockedAt: Date.now() };
  },

  lock() {
    session = null;
  },

  isDirty(): boolean {
    return !!session?.dirty;
  },

  markDirty() {
    if (session) session.dirty = true;
  },

  getValues(): ValuesType[] {
    return session?.data.values ?? [];
  },

  getEntry(id: string): ValuesType | null {
    return session?.data.values.find((v) => v.id === id) ?? null;
  },

  updateEntry(id: string, updater: (prev: ValuesType) => ValuesType) {
    if (!session) throw new Error("Vault locked");

    const idx = session.data.values.findIndex((v) => v.id === id);
    if (idx < 0) throw new Error("Entry not found");

    const nextValues = [...session.data.values];
    nextValues[idx] = updater(nextValues[idx]);

    session.data = { ...session.data, values: nextValues };
    session.dirty = true;
  },

  exportFullData(): VaultData {
    if (!session) throw new Error("Vault locked");
    return session.data;
  },

  markSaved() {
    if (session) session.dirty = false;
  },

  getFolders(): FolderType[] {
    return session?.data.folder ?? [];
  },

  upsertEntry(entry: ValuesType) {
    if (!session) throw new Error("Vault locked");

    const idx = session.data.values.findIndex((v) => v.id === entry.id);
    const nextValues = [...session.data.values];

    if (idx >= 0) nextValues[idx] = entry;
    else nextValues.push(entry);

    session.data = { ...session.data, values: nextValues };
    session.dirty = true;
  },

  deleteEntry(id: string) {
    if (!session) throw new Error("Vault locked");

    session.data = {
      ...session.data,
      values: session.data.values.filter((v) => v.id !== id),
    };
    session.dirty = true;
  },
};

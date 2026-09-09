import FolderType from "../model/FolderType";
import ValuesType from "../model/ValuesType";
import VaultDataType, { VaultEntryTombstone } from "../model/VaultDataType";
import VaultDeviceType from "../model/VaultDeviceType";

type VaultData = NonNullable<VaultDataType>;

export type VaultMergeConflict = {
  id: string;
  reason: "sameTimestampDifferentContent";
  kept: "local";
  copied: "remote";
  copyId: string;
};

export type VaultMergeSummary = {
  addedLocalEntries: number;
  addedRemoteEntries: number;
  deletedByLocalTombstone: number;
  deletedByRemoteTombstone: number;
  discardedRemoteConflictCopies: number;
  conflicts: VaultMergeConflict[];
  keptLocalEntries: number;
  keptRemoteEntries: number;
  mergedDevices: number;
  mergedFolders: number;
};

export type VaultMergeResult = {
  vault: VaultData;
  summary: VaultMergeSummary;
};

export type VaultMergeOptions = {
  sameTimestampConflictStrategy?: "copyRemote" | "keepRemote";
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const timestamp = (value: string | undefined | null) => {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const stableVaultStringify = (value: unknown): string => {
  if (Array.isArray(value)) {
    return `[${value.map(stableVaultStringify).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => {
        const record = value as Record<string, unknown>;
        return `${JSON.stringify(key)}:${stableVaultStringify(record[key])}`;
      })
      .join(",")}}`;
  }

  return JSON.stringify(value);
};

const areSame = (left: unknown, right: unknown) =>
  stableVaultStringify(left) === stableVaultStringify(right);

export const areVaultDataEqual = (left: VaultData, right: VaultData) =>
  areSame(left, right);

const latestTombstone = (
  left?: VaultEntryTombstone,
  right?: VaultEntryTombstone,
) => {
  if (!left) return right;
  if (!right) return left;
  return timestamp(right.deletedAt) > timestamp(left.deletedAt) ? right : left;
};

const addLatestTombstones = (
  map: Map<string, VaultEntryTombstone>,
  tombstones: readonly VaultEntryTombstone[] | undefined,
) => {
  for (const tombstone of tombstones ?? []) {
    const current = map.get(tombstone.id);
    map.set(tombstone.id, latestTombstone(current, tombstone)!);
  }
};

const entryIsDeletedBy = (
  entry: ValuesType,
  tombstone: VaultEntryTombstone | undefined,
) => {
  if (!tombstone) return false;
  return timestamp(tombstone.deletedAt) >= timestamp(entry.lastUpdated);
};

const makeConflictCopy = (
  entry: ValuesType,
  existingIds: Set<string>,
): ValuesType => {
  const baseId = `${entry.id}-remote-conflict`;
  let copyId = baseId;
  let suffix = 2;

  while (existingIds.has(copyId)) {
    copyId = `${baseId}-${suffix}`;
    suffix += 1;
  }

  existingIds.add(copyId);

  return {
    ...clone(entry),
    id: copyId,
    title: `${entry.title} (Remote conflict copy)`,
  };
};

const conflictCopyWasDeleted = (
  entry: ValuesType,
  tombstonesById: Map<string, VaultEntryTombstone>,
) => {
  const baseId = `${entry.id}-remote-conflict`;
  const tombstone = tombstonesById.get(baseId);
  if (!tombstone) return false;
  return timestamp(tombstone.deletedAt) >= timestamp(entry.lastUpdated);
};

const remoteConflictCopyPattern = /^(.*)-remote-conflict(?:-\d+)?$/;
const conflictCopyTitleSuffix = " (Remote conflict copy)";

const getConflictCopyBaseId = (entryId: string) =>
  remoteConflictCopyPattern.exec(entryId)?.[1];

const normalizeConflictCopyForBase = (
  entry: ValuesType,
  baseId: string,
): ValuesType => ({
  ...clone(entry),
  id: baseId,
  title: entry.title.endsWith(conflictCopyTitleSuffix)
    ? entry.title.slice(0, -conflictCopyTitleSuffix.length)
    : entry.title,
});

const entryContentFingerprint = (entry: ValuesType) =>
  stableVaultStringify({
    externalRefs: entry.externalRefs ?? null,
    fav: entry.fav,
    folder: entry.folder ?? null,
    modules: entry.modules ?? [],
    pinnedAt: entry.pinnedAt ?? null,
    tags: entry.tags ?? [],
    title: entry.title,
  });

const conflictCopyMatchesBaseEntry = (
  conflictCopy: ValuesType,
  baseEntry: ValuesType,
) =>
  entryContentFingerprint(
    normalizeConflictCopyForBase(conflictCopy, baseEntry.id),
  ) === entryContentFingerprint(baseEntry);

const mergeFolders = (
  localFolders: readonly FolderType[] | undefined,
  remoteFolders: readonly FolderType[] | undefined,
) => {
  const byId = new Map<string, FolderType>();

  for (const folder of localFolders ?? []) {
    byId.set(folder.id, clone(folder));
  }

  for (const folder of remoteFolders ?? []) {
    if (!byId.has(folder.id)) byId.set(folder.id, clone(folder));
  }

  return Array.from(byId.values());
};

const mergeDevices = (
  localDevices: readonly VaultDeviceType[] | undefined,
  remoteDevices: readonly VaultDeviceType[] | undefined,
) => {
  const byId = new Map<string, VaultDeviceType>();

  for (const device of localDevices ?? []) {
    byId.set(device.id, clone(device));
  }

  for (const device of remoteDevices ?? []) {
    const current = byId.get(device.id);
    if (!current) {
      byId.set(device.id, clone(device));
      continue;
    }

    byId.set(
      device.id,
      timestamp(device.lastSeenAt) > timestamp(current.lastSeenAt)
        ? clone(device)
        : current,
    );
  }

  return Array.from(byId.values());
};

export function mergeVaultData(
  localVault: VaultData,
  remoteVault: VaultData,
  options: VaultMergeOptions = {},
) {
  const sameTimestampConflictStrategy =
    options.sameTimestampConflictStrategy ?? "copyRemote";
  const localById = new Map(
    (localVault.values ?? []).map((entry) => [entry.id, entry]),
  );
  const remoteById = new Map(
    (remoteVault.values ?? []).map((entry) => [entry.id, entry]),
  );
  const tombstonesById = new Map<string, VaultEntryTombstone>();
  const mergedValues: ValuesType[] = [];
  const existingIds = new Set<string>();
  const summary: VaultMergeSummary = {
    addedLocalEntries: 0,
    addedRemoteEntries: 0,
    deletedByLocalTombstone: 0,
    deletedByRemoteTombstone: 0,
    discardedRemoteConflictCopies: 0,
    conflicts: [],
    keptLocalEntries: 0,
    keptRemoteEntries: 0,
    mergedDevices: 0,
    mergedFolders: 0,
  };

  addLatestTombstones(tombstonesById, localVault.deletedEntries);
  addLatestTombstones(tombstonesById, remoteVault.deletedEntries);

  const pushEntry = (entry: ValuesType) => {
    const next = clone(entry);
    existingIds.add(next.id);
    mergedValues.push(next);
  };

  for (const localEntry of localVault.values ?? []) {
    const remoteEntry = remoteById.get(localEntry.id);
    const tombstone = tombstonesById.get(localEntry.id);

    if (!remoteEntry) {
      if (entryIsDeletedBy(localEntry, tombstone)) {
        summary.deletedByRemoteTombstone += 1;
        continue;
      }

      summary.addedLocalEntries += 1;
      pushEntry(localEntry);
      continue;
    }

    if (
      entryIsDeletedBy(localEntry, tombstone) &&
      entryIsDeletedBy(remoteEntry, tombstone)
    ) {
      summary.deletedByRemoteTombstone += 1;
      continue;
    }

    if (areSame(localEntry, remoteEntry)) {
      pushEntry(localEntry);
      continue;
    }

    const localUpdatedAt = timestamp(localEntry.lastUpdated);
    const remoteUpdatedAt = timestamp(remoteEntry.lastUpdated);

    if (localUpdatedAt > remoteUpdatedAt) {
      summary.keptLocalEntries += 1;
      pushEntry(localEntry);
      continue;
    }

    if (remoteUpdatedAt > localUpdatedAt) {
      summary.keptRemoteEntries += 1;
      pushEntry(remoteEntry);
      continue;
    }

    if (conflictCopyWasDeleted(remoteEntry, tombstonesById)) {
      summary.discardedRemoteConflictCopies += 1;
      pushEntry(localEntry);
      continue;
    }

    if (sameTimestampConflictStrategy === "keepRemote") {
      summary.keptRemoteEntries += 1;
      pushEntry(remoteEntry);
      continue;
    }

    const conflictCopy = makeConflictCopy(remoteEntry, existingIds);
    summary.conflicts.push({
      id: localEntry.id,
      reason: "sameTimestampDifferentContent",
      kept: "local",
      copied: "remote",
      copyId: conflictCopy.id,
    });
    pushEntry(localEntry);
    pushEntry(conflictCopy);
  }

  for (const remoteEntry of remoteVault.values ?? []) {
    if (localById.has(remoteEntry.id)) continue;

    const conflictBaseId = getConflictCopyBaseId(remoteEntry.id);
    const localBaseEntry = conflictBaseId
      ? localById.get(conflictBaseId)
      : undefined;
    if (
      localBaseEntry &&
      conflictCopyMatchesBaseEntry(remoteEntry, localBaseEntry)
    ) {
      summary.discardedRemoteConflictCopies += 1;
      continue;
    }

    const tombstone = tombstonesById.get(remoteEntry.id);
    if (entryIsDeletedBy(remoteEntry, tombstone)) {
      summary.deletedByLocalTombstone += 1;
      continue;
    }

    summary.addedRemoteEntries += 1;
    pushEntry(remoteEntry);
  }

  const liveIds = new Set(mergedValues.map((entry) => entry.id));
  const mergedTombstones = Array.from(tombstonesById.values())
    .filter((tombstone) => !liveIds.has(tombstone.id))
    .map(clone);

  const mergedFolders = mergeFolders(localVault.folder, remoteVault.folder);
  const mergedDevices = mergeDevices(localVault.devices, remoteVault.devices);
  summary.mergedFolders = mergedFolders.length;
  summary.mergedDevices = mergedDevices.length;

  return {
    vault: {
      ...clone(localVault),
      folder: mergedFolders,
      values: mergedValues,
      devices: mergedDevices,
      deletedEntries: mergedTombstones,
    },
    summary,
  } satisfies VaultMergeResult;
}

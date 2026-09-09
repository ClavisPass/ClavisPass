import { describe, expect, it } from "vitest";
import ModulesEnum from "../model/ModulesEnum";
import VaultDataType from "../model/VaultDataType";
import ValuesType from "../model/ValuesType";
import { mergeVaultData } from "./mergeVaultData";

const baseDate = "2026-05-21T10:00:00.000Z";

function entry(id: string, title: string, lastUpdated = baseDate): ValuesType {
  return {
    id,
    title,
    fav: false,
    created: baseDate,
    lastUpdated,
    folder: null,
    modules: [
      {
        id: `${id}-password`,
        module: ModulesEnum.PASSWORD,
        value: `${title}-secret`,
      },
    ] as any,
  };
}

function vault(overrides: Partial<VaultDataType> = {}): VaultDataType {
  return {
    version: "1",
    folder: [],
    values: [],
    devices: [],
    deletedEntries: [],
    ...overrides,
  };
}

describe("mergeVaultData", () => {
  it("adds entries that exist on only one side", () => {
    const result = mergeVaultData(
      vault({ values: [entry("local-only", "Local")] }),
      vault({ values: [entry("remote-only", "Remote")] }),
    );

    expect(result.vault.values.map((value) => value.id)).toEqual([
      "local-only",
      "remote-only",
    ]);
    expect(result.summary.addedLocalEntries).toBe(1);
    expect(result.summary.addedRemoteEntries).toBe(1);
  });

  it("keeps a deleted entry deleted when a tombstone is newer", () => {
    const result = mergeVaultData(
      vault({
        values: [entry("entry-1", "Old local", "2026-05-21T10:00:00.000Z")],
      }),
      vault({
        deletedEntries: [
          {
            id: "entry-1",
            deletedAt: "2026-05-21T11:00:00.000Z",
            deletedByDeviceId: "remote-device",
          },
        ],
      }),
    );

    expect(result.vault.values).toEqual([]);
    expect(result.vault.deletedEntries).toEqual([
      {
        id: "entry-1",
        deletedAt: "2026-05-21T11:00:00.000Z",
        deletedByDeviceId: "remote-device",
      },
    ]);
    expect(result.summary.deletedByRemoteTombstone).toBe(1);
  });

  it("keeps a newer entry when an older tombstone exists", () => {
    const result = mergeVaultData(
      vault({
        deletedEntries: [
          {
            id: "entry-1",
            deletedAt: "2026-05-21T10:00:00.000Z",
          },
        ],
      }),
      vault({
        values: [entry("entry-1", "Resurrected", "2026-05-21T11:00:00.000Z")],
      }),
    );

    expect(result.vault.values.map((value) => value.id)).toEqual(["entry-1"]);
    expect(result.vault.values[0].title).toBe("Resurrected");
    expect(result.vault.deletedEntries).toEqual([]);
  });

  it("keeps the newer copy when both sides changed the same entry", () => {
    const result = mergeVaultData(
      vault({
        values: [entry("entry-1", "Local", "2026-05-21T11:00:00.000Z")],
      }),
      vault({
        values: [entry("entry-1", "Remote", "2026-05-21T12:00:00.000Z")],
      }),
    );

    expect(result.vault.values).toHaveLength(1);
    expect(result.vault.values[0].title).toBe("Remote");
    expect(result.summary.keptRemoteEntries).toBe(1);
  });

  it("creates a conflict copy when timestamps match but content differs", () => {
    const result = mergeVaultData(
      vault({ values: [entry("entry-1", "Local", baseDate)] }),
      vault({ values: [entry("entry-1", "Remote", baseDate)] }),
    );

    expect(result.vault.values.map((value) => value.id)).toEqual([
      "entry-1",
      "entry-1-remote-conflict",
    ]);
    expect(result.vault.values.map((value) => value.title)).toEqual([
      "Local",
      "Remote (Remote conflict copy)",
    ]);
    expect(result.summary.conflicts).toEqual([
      {
        id: "entry-1",
        reason: "sameTimestampDifferentContent",
        kept: "local",
        copied: "remote",
        copyId: "entry-1-remote-conflict",
      },
    ]);
  });

  it("can keep the remote entry instead of creating a copy when timestamps match", () => {
    const result = mergeVaultData(
      vault({ values: [entry("entry-1", "Local", baseDate)] }),
      vault({ values: [entry("entry-1", "Remote", baseDate)] }),
      { sameTimestampConflictStrategy: "keepRemote" },
    );

    expect(result.vault.values).toHaveLength(1);
    expect(result.vault.values[0].id).toBe("entry-1");
    expect(result.vault.values[0].title).toBe("Remote");
    expect(result.summary.keptRemoteEntries).toBe(1);
    expect(result.summary.conflicts).toEqual([]);
  });

  it("does not recreate a deleted conflict copy for the same unresolved conflict", () => {
    const result = mergeVaultData(
      vault({
        values: [entry("entry-1", "Local", baseDate)],
        deletedEntries: [
          {
            id: "entry-1-remote-conflict",
            deletedAt: "2026-05-21T10:00:01.000Z",
          },
        ],
      }),
      vault({ values: [entry("entry-1", "Remote", baseDate)] }),
    );

    expect(result.vault.values.map((value) => value.id)).toEqual(["entry-1"]);
    expect(result.vault.values[0].title).toBe("Local");
    expect(result.vault.deletedEntries).toEqual([
      {
        id: "entry-1-remote-conflict",
        deletedAt: "2026-05-21T10:00:01.000Z",
      },
    ]);
    expect(result.summary.discardedRemoteConflictCopies).toBe(1);
    expect(result.summary.conflicts).toEqual([]);
  });

  it("does not add a remote conflict copy when the same content already exists as the local base entry", () => {
    const webEntry = entry("entry-1", "Web", baseDate);
    const webConflictCopy = {
      ...webEntry,
      id: "entry-1-remote-conflict",
      created: "2026-05-21T09:59:59.000Z",
      lastUpdated: "2026-05-21T10:00:01.000Z",
      title: "Web (Remote conflict copy)",
    };

    const result = mergeVaultData(
      vault({ values: [webEntry] }),
      vault({
        values: [entry("entry-1", "Mobile", baseDate), webConflictCopy],
      }),
    );

    expect(result.vault.values.map((value) => value.id)).toEqual([
      "entry-1",
      "entry-1-remote-conflict",
    ]);
    expect(result.vault.values.map((value) => value.title)).toEqual([
      "Web",
      "Mobile (Remote conflict copy)",
    ]);
    expect(result.summary.discardedRemoteConflictCopies).toBe(1);
    expect(result.summary.conflicts).toEqual([
      {
        id: "entry-1",
        reason: "sameTimestampDifferentContent",
        kept: "local",
        copied: "remote",
        copyId: "entry-1-remote-conflict",
      },
    ]);
  });

  it("unions folders and keeps the device with the newest lastSeenAt", () => {
    const result = mergeVaultData(
      vault({
        folder: [{ id: "folder-local", name: "Local" }],
        devices: [
          {
            id: "device-123",
            name: "Old name",
            platform: "ios",
            firstSeenAt: baseDate,
            lastSeenAt: "2026-05-21T10:00:00.000Z",
          },
        ],
      }),
      vault({
        folder: [{ id: "folder-remote", name: "Remote" }],
        devices: [
          {
            id: "device-123",
            name: "New name",
            platform: "ios",
            firstSeenAt: baseDate,
            lastSeenAt: "2026-05-21T11:00:00.000Z",
          },
        ],
      }),
    );

    expect(result.vault.folder.map((folder) => folder.id)).toEqual([
      "folder-local",
      "folder-remote",
    ]);
    expect(result.vault.devices).toEqual([
      {
        id: "device-123",
        name: "New name",
        platform: "ios",
        firstSeenAt: baseDate,
        lastSeenAt: "2026-05-21T11:00:00.000Z",
      },
    ]);
  });
});

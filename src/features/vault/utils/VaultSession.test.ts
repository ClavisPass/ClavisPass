import { beforeEach, describe, expect, it } from "vitest";
import ModulesEnum from "../model/ModulesEnum";
import VaultDataType from "../model/VaultDataType";
import { VaultSession } from "./VaultSession";

function vaultData(): VaultDataType {
  return {
    version: "1",
    folder: [{ id: "folder-1", name: "Private" }],
    devices: [],
    values: [
      {
        id: "entry-1",
        title: "Example",
        fav: false,
        created: "2026-05-21T10:00:00.000Z",
        lastUpdated: "2026-05-21T10:00:00.000Z",
        folder: null,
        modules: [
          {
            id: "password-1",
            module: ModulesEnum.PASSWORD,
            value: "secret",
          },
        ] as any,
      },
    ],
  };
}

describe("VaultSession", () => {
  beforeEach(() => {
    VaultSession.lock();
  });

  it("tracks lock and unlock state", () => {
    expect(VaultSession.isUnlocked()).toBe(false);

    VaultSession.unlock(vaultData());

    expect(VaultSession.isUnlocked()).toBe(true);
    expect(VaultSession.isDirty()).toBe(false);
    expect(VaultSession.getValues()).toHaveLength(1);
    expect(VaultSession.getFolders()).toEqual([{ id: "folder-1", name: "Private" }]);
  });

  it("marks the session dirty when entries change and clean after save", () => {
    VaultSession.unlock(vaultData());

    VaultSession.upsertEntry({
      ...VaultSession.getValues()[0],
      title: "Changed",
    });

    expect(VaultSession.isDirty()).toBe(true);
    expect(VaultSession.getEntry("entry-1")?.title).toBe("Changed");

    VaultSession.markSaved();

    expect(VaultSession.isDirty()).toBe(false);
  });

  it("adds and deletes entries", () => {
    VaultSession.unlock(vaultData());

    VaultSession.upsertEntry({
      id: "entry-2",
      title: "Second",
      fav: true,
      created: "2026-05-21T11:00:00.000Z",
      lastUpdated: "2026-05-21T11:00:00.000Z",
      folder: null,
      modules: [],
    });

    expect(VaultSession.getEntry("entry-2")?.title).toBe("Second");

    VaultSession.deleteEntry("entry-1");

    expect(VaultSession.getEntry("entry-1")).toBeNull();
    expect(VaultSession.getValues().map((value) => value.id)).toEqual(["entry-2"]);
  });

  it("throws for writes while locked", () => {
    expect(() => VaultSession.upsertEntry({} as any)).toThrow("Vault locked");
    expect(() => VaultSession.deleteEntry("entry-1")).toThrow("Vault locked");
    expect(() => VaultSession.exportFullData()).toThrow("Vault locked");
  });
});

import { describe, expect, it } from "vitest";
import ModulesEnum from "../model/ModulesEnum";
import ValuesType from "../model/ValuesType";
import { buildEntryMeta, getSecretFor } from "./modulePolicy";

function entry(overrides: Partial<ValuesType> = {}): ValuesType {
  return {
    id: "entry-1",
    title: "Example",
    fav: true,
    created: "2026-05-21T10:00:00.000Z",
    lastUpdated: "2026-05-21T10:05:00.000Z",
    folder: { id: "folder-1", name: "Private" } as any,
    modules: [],
    ...overrides,
  };
}

describe("modulePolicy", () => {
  it("extracts metadata without leaking classic secrets", () => {
    const value = entry({
      modules: [
        { id: "u1", module: ModulesEnum.USERNAME, value: "alice" },
        { id: "p1", module: ModulesEnum.PASSWORD, value: "super-secret" },
        { id: "n1", module: ModulesEnum.NOTE, value: "private note" },
        { id: "t1", module: ModulesEnum.TOTP, value: "totp-secret" },
      ] as any,
    });

    expect(buildEntryMeta(value)).toEqual({
      id: "entry-1",
      title: "Example",
      fav: true,
      created: "2026-05-21T10:00:00.000Z",
      lastUpdated: "2026-05-21T10:05:00.000Z",
      folderId: "folder-1",
      username: "alice",
    });
  });

  it("keeps WiFi name and type in metadata but exposes the password only as secret", () => {
    const value = entry({
      modules: [
        {
          id: "wifi-1",
          module: ModulesEnum.WIFI,
          wifiName: "Office",
          wifiType: "WPA",
          value: "wifi-password",
        },
      ] as any,
    });

    expect(buildEntryMeta(value)).toMatchObject({
      wifiName: "Office",
      wifiType: "WPA",
    });
    expect(getSecretFor(value, ModulesEnum.WIFI)).toBe("wifi-password");
  });

  it("returns structured custom field secrets", () => {
    const value = entry({
      modules: [
        {
          id: "custom-1",
          module: ModulesEnum.CUSTOM_FIELD,
          title: "License",
          value: "ABC-123",
        },
      ] as any,
    });

    expect(getSecretFor(value, ModulesEnum.CUSTOM_FIELD)).toEqual([
      { id: "custom-1", title: "License", value: "ABC-123" },
    ]);
  });

  it("uses null as the secure default for unknown modules", () => {
    expect(getSecretFor(entry(), ModulesEnum.UNKNOWN)).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { upsertVaultDevice } from "./vaultDevices";

describe("upsertVaultDevice", () => {
  it("updates an existing device by stable id", () => {
    const result = upsertVaultDevice(
      [
        {
          id: "device_stable",
          name: "Workstation",
          platform: "windows x64",
          firstSeenAt: "2026-05-01T08:00:00.000Z",
          lastSeenAt: "2026-05-01T08:00:00.000Z",
        },
      ],
      {
        id: "device_stable",
        name: "Workstation",
        platform: "windows x64",
      },
      "2026-05-02T08:00:00.000Z"
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "device_stable",
      firstSeenAt: "2026-05-01T08:00:00.000Z",
      lastSeenAt: "2026-05-02T08:00:00.000Z",
    });
  });

  it("migrates an old random install id when name and platform match", () => {
    const result = upsertVaultDevice(
      [
        {
          id: "old-random-install-id",
          name: "Workstation",
          platform: "windows x64",
          firstSeenAt: "2026-05-01T08:00:00.000Z",
          lastSeenAt: "2026-05-01T08:00:00.000Z",
        },
      ],
      {
        id: "device_stable",
        name: " workstation ",
        platform: "Windows   x64",
      },
      "2026-05-02T08:00:00.000Z"
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "device_stable",
      name: " workstation ",
      platform: "Windows   x64",
      firstSeenAt: "2026-05-01T08:00:00.000Z",
      lastSeenAt: "2026-05-02T08:00:00.000Z",
    });
  });

  it("collapses multiple old install ids for the same device identity", () => {
    const result = upsertVaultDevice(
      [
        {
          id: "other-device",
          name: "Phone",
          platform: "Android",
          firstSeenAt: "2026-05-03T08:00:00.000Z",
          lastSeenAt: "2026-05-03T08:00:00.000Z",
        },
        {
          id: "old-random-install-id-a",
          name: "Workstation",
          platform: "windows x64",
          firstSeenAt: "2026-05-02T08:00:00.000Z",
          lastSeenAt: "2026-05-02T08:00:00.000Z",
        },
        {
          id: "old-random-install-id-b",
          name: "workstation",
          platform: "Windows   x64",
          firstSeenAt: "2026-05-01T08:00:00.000Z",
          lastSeenAt: "2026-05-01T08:00:00.000Z",
        },
      ],
      {
        id: "device_stable",
        name: "Workstation",
        platform: "windows x64",
      },
      "2026-05-04T08:00:00.000Z"
    );

    expect(result).toHaveLength(2);
    expect(result).toContainEqual(
      expect.objectContaining({
        id: "other-device",
      })
    );
    expect(result).toContainEqual(
      expect.objectContaining({
        id: "device_stable",
        firstSeenAt: "2026-05-01T08:00:00.000Z",
        lastSeenAt: "2026-05-04T08:00:00.000Z",
      })
    );
  });
});

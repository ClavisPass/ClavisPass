import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithAppProviders, textContent } from "../../tests/render/render";
import DevicesScreen from "./DevicesScreen";

let devices: any[] = [];

vi.mock("../infrastructure/device/deviceId", () => ({
  getOrCreateDeviceId: async () => "device-self",
}));

vi.mock("../app/providers/VaultProvider", () => ({
  useVault: () => ({
    devices,
  }),
}));

describe("DevicesScreen rendering", () => {
  beforeEach(() => {
    devices = [];
  });

  it("renders the empty devices page", async () => {
    const renderer = await renderWithAppProviders(
      <DevicesScreen navigation={{ goBack: vi.fn() } as any} route={{} as any} />,
    );

    expect(textContent(renderer)).toContain("Devices");
    expect(textContent(renderer)).toContain("No devices registered yet");
  });

  it("renders known devices", async () => {
    devices = [
      {
        id: "device-self",
        name: "Desktop",
        platform: "Windows",
        firstSeenAt: "2026-05-21T08:00:00.000Z",
        lastSeenAt: "2026-05-21T09:00:00.000Z",
      },
    ];

    const renderer = await renderWithAppProviders(
      <DevicesScreen navigation={{ goBack: vi.fn() } as any} route={{} as any} />,
    );

    expect(textContent(renderer)).toContain("Desktop");
    expect(textContent(renderer)).toContain("Windows");
    expect(textContent(renderer)).toContain("You");
  });
});

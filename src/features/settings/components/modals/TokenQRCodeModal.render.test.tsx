import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithAppProviders, textContent } from "../../../../../tests/render/render";
import TokenQRCodeModal from "./TokenQRCodeModal";

vi.mock("../../../../app/providers/CloudProvider", () => ({
  useToken: () => ({
    provider: "dropbox",
    refreshToken: "refresh-token",
  }),
}));

describe("TokenQRCodeModal rendering", () => {
  it("renders the QR modal for Dropbox", async () => {
    const renderer = await renderWithAppProviders(
      <TokenQRCodeModal visible setVisible={vi.fn()} />,
    );

    expect(textContent(renderer)).toContain("settings:showqrcode");
    expect(textContent(renderer)).toContain("settings:scanqrcode");
    expect(textContent(renderer)).toContain("Dropbox");
  });
});

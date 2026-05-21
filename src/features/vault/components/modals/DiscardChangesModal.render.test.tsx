import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithAppProviders, textContent } from "../../../../../tests/render/render";
import DiscardChangesModal from "./DiscardChangesModal";

describe("DiscardChangesModal rendering", () => {
  it("renders the discard confirmation", async () => {
    const renderer = await renderWithAppProviders(
      <DiscardChangesModal visible setVisible={vi.fn()} onDiscard={vi.fn()} />,
    );

    expect(textContent(renderer)).toContain("common:discardChangesTitle");
    expect(textContent(renderer)).toContain("common:discardChangesText");
    expect(textContent(renderer)).toContain("common:discard");
  });
});

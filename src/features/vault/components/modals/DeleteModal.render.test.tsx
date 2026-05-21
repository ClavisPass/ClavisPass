import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithAppProviders, textContent } from "../../../../../tests/render/render";
import DeleteModal from "./DeleteModal";

describe("DeleteModal rendering", () => {
  it("renders the delete confirmation content when visible", async () => {
    const renderer = await renderWithAppProviders(
      <DeleteModal visible setVisible={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(textContent(renderer)).toContain("common:delete");
    expect(textContent(renderer)).toContain("common:deleteEntryText");
    expect(textContent(renderer)).toContain("common:cancel");
  });

  it("renders nothing when hidden", async () => {
    const renderer = await renderWithAppProviders(
      <DeleteModal visible={false} setVisible={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(renderer.toJSON()).toBeNull();
  });
});

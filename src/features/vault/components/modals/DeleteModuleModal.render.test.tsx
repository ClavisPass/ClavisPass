import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithAppProviders, textContent } from "../../../../../tests/render/render";
import DeleteModuleModal from "./DeleteModuleModal";

describe("DeleteModuleModal rendering", () => {
  it("renders the module delete confirmation", async () => {
    const renderer = await renderWithAppProviders(
      <DeleteModuleModal visible setVisible={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(textContent(renderer)).toContain("common:deleteModuleText");
    expect(textContent(renderer)).toContain("common:cancel");
  });
});

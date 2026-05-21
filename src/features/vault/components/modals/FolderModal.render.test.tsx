import React from "react";
import { describe, expect, it, vi } from "vitest";
import { setPlatform } from "../../../../../tests/mocks/reactNative";
import { renderWithAppProviders, textContent } from "../../../../../tests/render/render";
import FolderModal from "./FolderModal";

const update = vi.fn();

vi.mock("../../../../app/providers/VaultProvider", () => ({
  useVault: () => ({
    update,
  }),
}));

vi.mock("../lists/DraggableFolderListWeb", () => ({
  default: ({ folder }: { folder: Array<{ name: string }> }) => (
    <>{folder.map((item) => item.name).join(" ")}</>
  ),
}));

vi.mock("../lists/DraggableFolderList", () => ({
  default: ({ folder }: { folder: Array<{ name: string }> }) => (
    <>{folder.map((item) => item.name).join(" ")}</>
  ),
}));

describe("FolderModal rendering", () => {
  it("renders folder management content and existing folders", async () => {
    setPlatform("web");

    const renderer = await renderWithAppProviders(
      <FolderModal
        visible
        setVisible={vi.fn()}
        folder={[{ id: "folder-1", name: "Private" }]}
      />,
    );

    expect(textContent(renderer)).toContain("common:addFolder");
    expect(textContent(renderer)).toContain("common:manageFoldersDescription");
    expect(textContent(renderer)).toContain("Private");
  });
});

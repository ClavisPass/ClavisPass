import { describe, expect, it } from "vitest";

import { orderPinnedFirst } from "./pinnedEntries";

describe("pinnedEntries", () => {
  it("keeps pinned entries first without reordering pinned entries by timestamp", () => {
    const olderPinned = {
      id: "older-pinned",
      pinnedAt: "2026-01-01T10:00:00.000Z",
    };
    const unpinned = {
      id: "unpinned",
      pinnedAt: null,
    };
    const newerPinned = {
      id: "newer-pinned",
      pinnedAt: "2026-01-02T10:00:00.000Z",
    };

    expect(orderPinnedFirst([olderPinned, unpinned, newerPinned])).toEqual([
      olderPinned,
      newerPinned,
      unpinned,
    ]);
  });
});

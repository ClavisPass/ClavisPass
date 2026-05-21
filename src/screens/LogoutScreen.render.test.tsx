import React from "react";
import { describe, expect, it } from "vitest";
import { renderBare } from "../../tests/render/render";
import LogoutScreen from "./LogoutScreen";

describe("LogoutScreen rendering", () => {
  it("renders without crashing", async () => {
    const renderer = await renderBare(
      <LogoutScreen navigation={{} as any} route={{} as any} />,
    );

    expect(renderer.toJSON()).toBeNull();
  });
});

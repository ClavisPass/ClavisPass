import React from "react";
import { act } from "react-test-renderer";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithAppProviders } from "../../../../tests/render/render";
import { setPlatform } from "../../../../tests/mocks/reactNative";
import { set } from "../../../infrastructure/storage/store";
import lightTheme from "../../ui/theme";
import darkTheme from "../../ui/theme-darkmode";
import AdaptiveMenu from "./AdaptiveMenu";

afterEach(() => setPlatform("web"));

describe("native action menu", () => {
  it("updates sheet labels when switching themes and keeps actions usable", async () => {
    setPlatform("android");
    const action = vi.fn();
    const setVisible = vi.fn();
    const renderer = await renderWithAppProviders(
      <AdaptiveMenu
        visible
        setVisible={setVisible}
        positionY={0}
        items={[{ key: "sort", label: "Sort tasks", onPress: action }]}
      />,
    );
    const text = () => renderer.root.findByType("PaperText" as any);
    expect(text().props.style.color).toBe(lightTheme.colors.onSurface);
    await act(async () => {
      await set("THEME_PREFERENCE", "dark");
    });
    expect(text().props.style.color).toBe(darkTheme.colors.onSurface);
    await act(async () =>
      renderer.root.findByType("PaperTouchableRipple" as any).props.onPress(),
    );
    expect(action).toHaveBeenCalledOnce();
    expect(setVisible).toHaveBeenCalledWith(false);
    await act(async () => {
      await set("THEME_PREFERENCE", "light");
    });
    expect(text().props.style.color).toBe(lightTheme.colors.onSurface);
    await act(async () => renderer.unmount());
  });
});

import React from "react";
import { act } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";
import { renderWithAppProviders } from "../../../../tests/render/render";
import { useTheme } from "../../../app/providers/ThemeProvider";
import { get, resetAppSettings } from "../../../infrastructure/storage/store";
import GlassAppearanceSettings from "./GlassAppearanceSettings";
import type { GlassAppearance } from "../../../shared/ui/glassAppearance";

vi.mock("@react-native-assets/slider", () => ({
  Slider: (props: Record<string, unknown>) =>
    React.createElement("GlassSlider", props),
}));

describe("glass appearance controls", () => {
  it("previews without writes, persists on release and resets to the original look", async () => {
    let appearance!: GlassAppearance;
    function Preview() {
      appearance = useTheme().glassAppearance;
      return <GlassAppearanceSettings />;
    }
    const renderer = await renderWithAppProviders(<Preview />);
    const sliders = () => renderer.root.findAllByType("GlassSlider" as any);
    expect(appearance).toEqual({ transparency: 50, tintStrength: 100 });
    await act(async () => sliders()[0].props.onValueChange(75));
    expect(appearance.transparency).toBe(75);
    expect(await get("GLASS_TRANSPARENCY")).toBe(50);
    await act(async () => {
      sliders()[0].props.onSlidingComplete(75);
      await Promise.resolve();
    });
    expect(await get("GLASS_TRANSPARENCY")).toBe(75);
    expect(appearance.transparency).toBe(75);
    await act(async () => {
      sliders()[1].props.onValueChange(250);
      sliders()[1].props.onSlidingComplete(250);
      await Promise.resolve();
    });
    expect(await get("GLASS_TINT_STRENGTH")).toBe(250);
    await act(async () => {
      renderer.root.findByType("PaperButton" as any).props.onPress();
      await Promise.resolve();
    });
    expect(appearance).toEqual({ transparency: 50, tintStrength: 100 });
    expect(await get("GLASS_TRANSPARENCY")).toBe(50);
    expect(await get("GLASS_TINT_STRENGTH")).toBe(100);
    await act(async () => renderer.unmount());
  });

  it("includes glass values in the general settings reset", async () => {
    const renderer = await renderWithAppProviders(<GlassAppearanceSettings />);
    await act(async () => {
      renderer.root
        .findAllByType("GlassSlider" as any)[0]
        .props.onSlidingComplete(90);
      await Promise.resolve();
    });
    expect(await get("GLASS_TRANSPARENCY")).toBe(90);
    await act(async () => {
      await resetAppSettings();
    });
    expect(await get("GLASS_TRANSPARENCY")).toBe(50);
    expect(
      renderer.root.findAllByType("GlassSlider" as any)[0].props.value,
    ).toBe(50);
    await act(async () => renderer.unmount());
  });
});

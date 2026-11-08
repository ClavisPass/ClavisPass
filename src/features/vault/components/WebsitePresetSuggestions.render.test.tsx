import React from "react";
import { act } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";
import {
  renderWithAppProviders,
  renderBare,
  textContent,
} from "../../../../tests/render/render";
import WebsitePresetSuggestions from "./WebsitePresetSuggestions";
import { findWebsitePresets } from "../utils/websitePresets";
import { applyWebsitePreset } from "../utils/websitePresets";
import { useEditHistory } from "../utils/editHistory";
import getTemplate from "../utils/getTemplate";
import TemplateEnum from "../model/TemplateEnum";

vi.mock("expo-image", () => ({
  Image: (props: Record<string, unknown>) =>
    React.createElement("ExpoImage", props),
}));

describe("website preset suggestions", () => {
  it("restores title and all modules with a single undo, and supports redo", async () => {
    const initial = { ...getTemplate(TemplateEnum.PASSWORD), title: "am" };
    let history!: ReturnType<typeof useEditHistory>;
    function Editor() {
      history = useEditHistory(initial);
      return null;
    }
    const renderer = await renderBare(<Editor />);
    const preset = findWebsitePresets("amazon")[0];
    await act(async () =>
      history.applyChange((entry) => applyWebsitePreset(entry, preset), {
        action: "modules",
        label: "Preset",
      }),
    );
    const applied = history.value;
    expect(applied.title).toBe("Amazon");
    expect(applied.modules).toHaveLength(initial.modules.length + 1);
    await act(async () => history.undo());
    expect(history.value).toEqual(initial);
    expect(history.canUndo).toBe(false);
    await act(async () => history.redo());
    expect(history.value).toEqual(applied);
    await act(async () => renderer.unmount());
  });
  it("shows names and target domains and lets users select or dismiss", async () => {
    const onSelect = vi.fn();
    const onDismiss = vi.fn();
    const presets = findWebsitePresets("a");
    const renderer = await renderWithAppProviders(
      <WebsitePresetSuggestions
        presets={presets}
        onSelect={onSelect}
        onDismiss={onDismiss}
      />,
    );
    expect(textContent(renderer)).toContain("Amazon");
    expect(textContent(renderer)).toContain("amazon.de");
    expect(textContent(renderer)).not.toContain("common:websitePresets");
    const images = renderer.root.findAllByType("ExpoImage" as any);
    expect(images).toHaveLength(presets.length);
    expect(images[0].props.source).toBe(
      "https://www.google.com/s2/favicons?domain=www.amazon.de&sz=128",
    );
    await act(async () => images[0].props.onError());
    expect(renderer.root.findAllByType("ExpoImage" as any)).toHaveLength(
      presets.length - 1,
    );
    const buttons = renderer.root.findAllByType("PaperTouchableRipple" as any);
    expect(buttons).toHaveLength(presets.length + 1);
    await act(async () => buttons[0].props.onPress());
    expect(onSelect).toHaveBeenCalledExactlyOnceWith(presets[0]);
    await act(async () => buttons[buttons.length - 1].props.onPress());
    expect(onDismiss).toHaveBeenCalledOnce();
    expect(
      renderer.root.findByType("ScrollView" as any).props
        .keyboardShouldPersistTaps,
    ).toBe("always");
  });

  it("does not occupy space when no websites match", async () => {
    const renderer = await renderWithAppProviders(
      <WebsitePresetSuggestions
        presets={[]}
        onSelect={vi.fn()}
        onDismiss={vi.fn()}
      />,
    );
    expect(
      renderer.root.findAllByType("PaperTouchableRipple" as any),
    ).toHaveLength(0);
    expect(textContent(renderer)).not.toContain("common:websitePresets");
  });
});

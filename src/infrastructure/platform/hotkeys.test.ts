import { describe, expect, it } from "vitest";
import {
  DEFAULT_HOTKEYS,
  getDefaultHotkeys,
  MACOS_DEFAULT_HOTKEYS,
  normalizeHotkeySettings,
} from "./hotkeys";

describe("hotkeys", () => {
  it("keeps the existing default hotkeys for non-mac platforms", () => {
    expect(getDefaultHotkeys("default")).toEqual(DEFAULT_HOTKEYS);
  });

  it("uses macOS-safe defaults without Alt+L", () => {
    expect(getDefaultHotkeys("macos")).toEqual(MACOS_DEFAULT_HOTKEYS);
    expect(getDefaultHotkeys("macos").lockVault).toBe("Ctrl+Shift+L");
  });

  it("migrates legacy defaults to current platform defaults", () => {
    expect(normalizeHotkeySettings(DEFAULT_HOTKEYS, MACOS_DEFAULT_HOTKEYS)).toEqual(
      MACOS_DEFAULT_HOTKEYS,
    );
  });
});

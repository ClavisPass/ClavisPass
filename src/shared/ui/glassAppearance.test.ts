import { describe, expect, it } from "vitest";
import {
  DEFAULT_GLASS_APPEARANCE,
  glassLayerOpacity,
  normalizeGlassAppearance,
} from "./glassAppearance";

describe("glass appearance", () => {
  it("preserves the existing light and dark background layers by default", () => {
    for (const opacity of [0.54, 0.78, 0.24, 0.34]) {
      expect(
        glassLayerOpacity(opacity, DEFAULT_GLASS_APPEARANCE.transparency),
      ).toBeCloseTo(opacity);
      expect(glassLayerOpacity(opacity, 0)).toBe(1);
      expect(glassLayerOpacity(opacity, 100)).toBe(0);
      expect(glassLayerOpacity(opacity, 25)).toBeGreaterThan(opacity);
      expect(glassLayerOpacity(opacity, 75)).toBeLessThan(opacity);
    }
  });

  it("keeps corrupted or out-of-range stored values inside usable bounds", () => {
    expect(
      normalizeGlassAppearance({ transparency: Infinity, tintStrength: NaN }),
    ).toEqual(DEFAULT_GLASS_APPEARANCE);
    expect(
      normalizeGlassAppearance({ transparency: -10, tintStrength: 400 }),
    ).toEqual({ transparency: 0, tintStrength: 300 });
    expect(
      normalizeGlassAppearance({ transparency: 120, tintStrength: -10 }),
    ).toEqual({ transparency: 100, tintStrength: 0 });
  });
});

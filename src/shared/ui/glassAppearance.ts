export type GlassAppearance = {
  transparency: number;
  tintStrength: number;
};

export const DEFAULT_GLASS_APPEARANCE: GlassAppearance = {
  transparency: 50,
  tintStrength: 100,
};

export function normalizeGlassAppearance(
  value: GlassAppearance,
): GlassAppearance {
  return {
    transparency: Number.isFinite(value.transparency)
      ? Math.min(100, Math.max(0, value.transparency))
      : 50,
    tintStrength: Number.isFinite(value.tintStrength)
      ? Math.min(300, Math.max(0, value.tintStrength))
      : 100,
  };
}

/** 50 preserves the existing look; 0 is opaque and 100 removes the app tint. */
export function glassLayerOpacity(base: number, transparency: number): number {
  const amount = normalizeGlassAppearance({
    transparency,
    tintStrength: 100,
  }).transparency;
  return amount <= 50
    ? 1 - ((1 - base) * amount) / 50
    : (base * (100 - amount)) / 50;
}

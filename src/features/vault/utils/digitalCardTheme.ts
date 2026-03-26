import ModulesEnum from "../model/ModulesEnum";
import type ValuesType from "../model/ValuesType";

export type DigitalCardPalette = {
  sourceUrl: string | null;
  faviconUrl: string | null;
  accentColor: string | null;
  hostname: string | null;
};

function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    return new URL(trimmed).toString();
  } catch {
    try {
      return new URL(`https://${trimmed}`).toString();
    } catch {
      return null;
    }
  }
}

export function extractUrlFromEntry(entry: ValuesType): string | null {
  const urlModule = entry.modules.find((module) => module.module === ModulesEnum.URL);
  const rawValue = typeof (urlModule as any)?.value === "string" ? (urlModule as any).value : "";
  return normalizeUrl(rawValue);
}

export function buildFaviconUrl(sourceUrl: string | null): string | null {
  if (!sourceUrl) return null;

  try {
    const parsed = new URL(sourceUrl);
    const hostname = parsed.hostname;
    if (!hostname) return null;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  } catch {
    return null;
  }
}

export function getHostnameLabel(sourceUrl: string | null): string | null {
  if (!sourceUrl) return null;

  try {
    const hostname = new URL(sourceUrl).hostname;
    return hostname.replace(/^www\./i, "");
  } catch {
    return null;
  }
}

export async function resolveDigitalCardPalette(
  entry: ValuesType
): Promise<DigitalCardPalette> {
  const sourceUrl = extractUrlFromEntry(entry);
  return resolveDigitalCardPaletteFromUrl(sourceUrl);
}

export async function resolveDigitalCardPaletteFromUrl(
  sourceUrl: string | null
): Promise<DigitalCardPalette> {
  const faviconUrl = buildFaviconUrl(sourceUrl);
  const hostname = getHostnameLabel(sourceUrl);

  return {
    sourceUrl,
    faviconUrl,
    accentColor: null,
    hostname,
  };
}

function hexToRgb(color: string): { r: number; g: number; b: number } | null {
  const normalized = color.trim();
  const match = normalized.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;

  const hex = match[1].length === 3
    ? match[1]
        .split("")
        .map((char) => char + char)
        .join("")
    : match[1];

  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

export function withAlpha(color: string, alpha: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const bounded = Math.max(0, Math.min(1, alpha));
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bounded})`;
}

export function mixColors(colorA: string, colorB: string, weight = 0.5): string {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);

  if (!a || !b) return colorA;

  const bounded = Math.max(0, Math.min(1, weight));
  const mix = (left: number, right: number) =>
    Math.round(left * (1 - bounded) + right * bounded);

  const r = mix(a.r, b.r);
  const g = mix(a.g, b.g);
  const bl = mix(a.b, b.b);

  return `rgb(${r}, ${g}, ${bl})`;
}

export function getReadableTextColor(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return "#111111";

  const luminance =
    (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;

  return luminance > 0.62 ? "#111111" : "#ffffff";
}

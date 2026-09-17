export type WindowCornerStyle = "rounded" | "soft" | "square";

export function resolveWindowCornerRadius(style: WindowCornerStyle): number {
  if (style === "square") return 0;
  if (style === "soft") return 12;
  return 6;
}

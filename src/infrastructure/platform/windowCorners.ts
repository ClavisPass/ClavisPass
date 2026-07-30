export type WindowCornerStyle = "rounded" | "square";

export function resolveWindowCornerRadius(style: WindowCornerStyle): number {
  if (style === "square") return 0;
  return 6;
}

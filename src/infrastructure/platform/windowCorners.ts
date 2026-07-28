import { isMacWebRuntime } from "./isTauri";

export type WindowCornerStyle = "system" | "rounded" | "square";

export function resolveWindowCornerRadius(style: WindowCornerStyle): number {
  if (style === "rounded") return 6;
  if (style === "square") return 0;
  return isMacWebRuntime() ? 0 : 6;
}

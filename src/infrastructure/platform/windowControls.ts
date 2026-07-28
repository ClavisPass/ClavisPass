import { isMacWebRuntime } from "./isTauri";

export type WindowControlsStyle = "system" | "left" | "right";
export type WindowControlsSide = "left" | "right";

export function resolveWindowControlsSide(
  style: WindowControlsStyle,
): WindowControlsSide {
  if (style === "left" || style === "right") return style;
  return isMacWebRuntime() ? "left" : "right";
}

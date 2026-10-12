import { isTauriEnvironment } from "../../infrastructure/platform/isTauri";

export const TITLEBAR_HEIGHT = isTauriEnvironment() ? 40 : 0;
export const TITLEBAR_CONTROLS_WIDTH = 78;
export const TITLEBAR_WINDOWS_CONTROL_BUTTON_WIDTH = 50;
export const TITLEBAR_WINDOWS_CONTROLS_GAP = 2;
export const TITLEBAR_RIGHT_CONTROLS_WIDTH =
  TITLEBAR_WINDOWS_CONTROL_BUTTON_WIDTH * 2 + TITLEBAR_WINDOWS_CONTROLS_GAP;

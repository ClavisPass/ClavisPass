import { isTauriEnvironment } from "../../infrastructure/platform/isTauri";

export const TITLEBAR_HEIGHT = isTauriEnvironment() ? 40 : 0;
export const TITLEBAR_CONTROLS_WIDTH = 78;

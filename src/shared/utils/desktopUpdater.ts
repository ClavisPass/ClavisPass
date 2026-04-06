import type { Update } from "@tauri-apps/plugin-updater";

import { detectTauriEnvironment } from "../../infrastructure/platform/isTauri";

export async function checkForDesktopUpdate() {
  if (!(await detectTauriEnvironment())) {
    return null;
  }

  const { check } = await import("@tauri-apps/plugin-updater");
  return await check();
}

export async function installDesktopUpdate(
  update: Update,
  onEvent?: Parameters<Update["downloadAndInstall"]>[0],
) {
  if (!(await detectTauriEnvironment())) {
    throw new Error("Desktop updates are only available in Tauri.");
  }

  const { relaunch } = await import("@tauri-apps/plugin-process");
  await update.downloadAndInstall(onEvent);
  await relaunch();
}

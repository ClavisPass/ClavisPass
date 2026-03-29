import { check, type Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export async function checkForDesktopUpdate() {
  return await check();
}

export async function installDesktopUpdate(
  update: Update,
  onEvent?: Parameters<Update["downloadAndInstall"]>[0]
) {
  await update.downloadAndInstall(onEvent);
  await relaunch();
}

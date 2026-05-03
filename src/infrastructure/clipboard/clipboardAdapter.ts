import * as Clipboard from "expo-clipboard";
import { isTauriEnvironment, isWebPlatform } from "../platform/isTauri";

async function tryNavigatorWriteText(value: string): Promise<boolean> {
  if (
    !isWebPlatform() ||
    typeof navigator === "undefined" ||
    !navigator.clipboard?.writeText
  ) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

async function tryNavigatorReadText(): Promise<string | null> {
  if (
    !isWebPlatform() ||
    typeof navigator === "undefined" ||
    !navigator.clipboard?.readText
  ) {
    return null;
  }

  try {
    return await navigator.clipboard.readText();
  } catch {
    return null;
  }
}

export async function setClipboardText(value: string) {
  if (isTauriEnvironment()) {
    if (value === "") {
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("clear_clipboard_text");
        return true;
      } catch {
      }
    }

    const wroteWithNavigator = await tryNavigatorWriteText(value);
    if (wroteWithNavigator) {
      return true;
    }
  }

  return Clipboard.setStringAsync(value);
}

export async function getClipboardText(): Promise<string | null> {
  if (isTauriEnvironment()) {
    const navigatorValue = await tryNavigatorReadText();
    if (navigatorValue !== null) {
      return navigatorValue;
    }
  }

  try {
    return await Clipboard.getStringAsync();
  } catch {
    return null;
  }
}

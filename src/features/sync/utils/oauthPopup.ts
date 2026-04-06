import { detectTauriEnvironment } from "../../../infrastructure/platform/isTauri";

export const OAUTH_POPUP_LABEL = "oauth-popup";

export async function closeOAuthPopupWindow() {
  if (!(await detectTauriEnvironment())) {
    return;
  }
  const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");
  const popup = await WebviewWindow.getByLabel(OAUTH_POPUP_LABEL);

  if (!popup) {
    return;
  }

  await popup.close();
}

export async function openOAuthPopupWindow(url: string, title: string) {
  if (!(await detectTauriEnvironment())) {
    return null;
  }
  const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");
  const existing = await WebviewWindow.getByLabel(OAUTH_POPUP_LABEL);

  if (existing) {
    try {
      await existing.close();
    } catch {}
  }

  const popup = new WebviewWindow(OAUTH_POPUP_LABEL, {
    url,
    title,
    width: 720,
    height: 840,
    center: true,
    visible: true,
    focus: true,
    resizable: true,
    zoomHotkeysEnabled: false,
    dragDropEnabled: false,
    devtools: false,
  });

  await new Promise<void>((resolve, reject) => {
    popup.once("tauri://created", () => resolve());
    popup.once("tauri://error", (error) => reject(error));
  });

  return popup;
}

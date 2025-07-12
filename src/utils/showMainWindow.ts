import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

async function showMainWindow() {
  const win = await WebviewWindow.getByLabel("main");
  if (!win) {
    return;
  }
  await win.show();
}

export default showMainWindow;
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import * as store from "../utils/store";

async function showMainWindow() {
  const stored = await store.get("START_BEHAVIOR");
  if(stored === "hidden") return;
  const win = await WebviewWindow.getByLabel("main");
  if (!win) {
    return;
  }
  await win.show();
}

export default showMainWindow;
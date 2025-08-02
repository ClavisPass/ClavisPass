import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import * as store from "../utils/store";
import { getMatches } from '@tauri-apps/plugin-cli';

async function showMainWindow() {
  const stored = await store.get("START_BEHAVIOR");
  const matches = await getMatches();
  const startedHidden = matches.args.hidden?.value === true;
  if (stored === "hidden" && startedHidden) return;
  const win = await WebviewWindow.getByLabel("main");
  if (!win) {
    return;
  }
  await win.show();
}

export default showMainWindow;
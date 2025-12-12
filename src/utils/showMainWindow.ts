import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { getMatches } from "@tauri-apps/plugin-cli";
import * as store from "../utils/store";

type StartBehavior = "shown" | "hidden";

async function showMainWindow(startBehavior?: StartBehavior) {
  const stored = startBehavior ?? (await store.get("START_BEHAVIOR"));

  const matches = await getMatches();
  const startedHidden = matches.args.hidden?.value === true;

  if (stored === "hidden" && startedHidden) return;

  const win = await WebviewWindow.getByLabel("main");
  if (!win) return;

  await win.show();
}

export default showMainWindow;

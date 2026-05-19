import { detectTauriEnvironment } from "./isTauri";
import * as store from "../storage/store";

type StartBehavior = "shown" | "hidden";

async function showMainWindow(startBehavior?: StartBehavior) {
  if (!(await detectTauriEnvironment())) {
    return;
  }

  const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");

  const stored = startBehavior ?? (await store.get("START_BEHAVIOR"));

  let startedHidden = false;
  try {
    const { getMatches } = await import("@tauri-apps/plugin-cli");
    const matches = await getMatches();
    startedHidden = matches.args.hidden?.value === true;
  } catch {
    startedHidden = false;
  }

  if (stored === "hidden" && startedHidden) return;

  const win = await WebviewWindow.getByLabel("main");
  if (!win) return;

  await win.show();
  await win.unminimize();
  await win.setFocus();
}

export default showMainWindow;

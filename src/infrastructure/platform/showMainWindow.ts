import { detectTauriEnvironment } from "./isTauri";
import * as store from "../storage/store";

type StartBehavior = "shown" | "hidden";

async function showMainWindow(startBehavior?: StartBehavior) {
  if (!(await detectTauriEnvironment())) {
    return;
  }

  const [{ WebviewWindow }, { getMatches }] = await Promise.all([
    import("@tauri-apps/api/webviewWindow"),
    import("@tauri-apps/plugin-cli"),
  ]);

  const stored = startBehavior ?? (await store.get("START_BEHAVIOR"));

  const matches = await getMatches();
  const startedHidden = matches.args.hidden?.value === true;

  if (stored === "hidden" && startedHidden) return;

  const win = await WebviewWindow.getByLabel("main");
  if (!win) return;

  await win.show();
}

export default showMainWindow;

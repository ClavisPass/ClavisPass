import * as Clipboard from "expo-clipboard";
import { clipboardClearScheduler } from "./clipboardClearScheduler";

/**
 * Copies a value to the clipboard and schedules an auto-clear guarded by
 * "only clear if clipboard still matches the last copied value".
 */
export async function copyWithAutoClear(value: string, durationMs: number) {
  await Clipboard.setStringAsync(value);

  const safeDurationMs = Math.max(0, Math.floor(durationMs ?? 0));
  clipboardClearScheduler.scheduleClear(value, safeDurationMs);
}

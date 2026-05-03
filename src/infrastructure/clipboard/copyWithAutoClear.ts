import { clipboardClearScheduler } from "./clipboardClearScheduler";
import {
  clipboardOwnership,
  ClipboardContentKind,
} from "./clipboardOwnership";
import { setClipboardText } from "./clipboardAdapter";

type CopyWithAutoClearOptions = {
  kind?: ClipboardContentKind;
  sensitive?: boolean;
};

/**
 * Copies a value to the clipboard and schedules an auto-clear guarded by
 * "only clear if clipboard still matches the last copied value".
 */
export async function copyWithAutoClear(
  value: string,
  durationMs: number,
  options?: CopyWithAutoClearOptions
) {
  await setClipboardText(value);

  const safeDurationMs = Math.max(0, Math.floor(durationMs ?? 0));
  clipboardOwnership.trackCopy(value, {
    kind: options?.kind,
    sensitive: options?.sensitive,
    expiresAtMs: safeDurationMs > 0 ? Date.now() + safeDurationMs : null,
  });
  clipboardClearScheduler.scheduleClear(safeDurationMs);
}

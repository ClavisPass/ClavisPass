import * as React from "react";
import { copyWithAutoClear } from "../../infrastructure/clipboard/copyWithAutoClear";
import { useSetting } from "../../app/providers/SettingsProvider";
import { ClipboardContentKind } from "../../infrastructure/clipboard/clipboardOwnership";

type CopyOptions = {
  durationMs?: number;
  kind?: ClipboardContentKind;
  sensitive?: boolean;
};

export function useClipboardCopy() {
  const { value: copyDurationSeconds } = useSetting("COPY_DURATION");

  const copy = React.useCallback(
    async (value: string, options?: CopyOptions) => {
      const durationMs =
        options?.durationMs ??
        Math.max(0, Math.floor((copyDurationSeconds ?? 0) * 1000));

      await copyWithAutoClear(value, durationMs, {
        kind: options?.kind,
        sensitive: options?.sensitive,
      });

      return { durationMs };
    },
    [copyDurationSeconds]
  );

  return { copy };
}

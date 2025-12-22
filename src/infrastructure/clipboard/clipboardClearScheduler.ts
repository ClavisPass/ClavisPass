import * as Clipboard from "expo-clipboard";

type TimeoutHandle = ReturnType<typeof setTimeout>;

class ClipboardClearScheduler {
  private clearTimer: TimeoutHandle | null = null;
  private lastCopiedValue: string | null = null;

  /**
   * Schedules a clipboard clear after durationMs.
   * Any new schedule cancels the previous one and restarts the full duration.
   */
  scheduleClear(valueJustCopied: string, durationMs: number) {
    this.cancel();

    this.lastCopiedValue = valueJustCopied;

    if (durationMs <= 0) return;

    this.clearTimer = setTimeout(async () => {
      try {
        const current = await Clipboard.getStringAsync();
        if (current === this.lastCopiedValue) {
          await Clipboard.setStringAsync("");
        }
      } catch {
      } finally {
        this.clearTimer = null;
      }
    }, durationMs);
  }

  cancel() {
    if (this.clearTimer) {
      clearTimeout(this.clearTimer);
      this.clearTimer = null;
    }
  }


  async clearNowIfMatchesLast() {
    try {
      const current = await Clipboard.getStringAsync();
      if (current === this.lastCopiedValue) {
        await Clipboard.setStringAsync("");
      }
    } catch {
      // ignore
    } finally {
      this.cancel();
    }
  }
}

export const clipboardClearScheduler = new ClipboardClearScheduler();

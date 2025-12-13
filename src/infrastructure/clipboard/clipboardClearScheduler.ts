// clipboardClearScheduler.ts
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
        // Only clear if clipboard still contains what we last copied via this scheduler
        if (current === this.lastCopiedValue) {
          await Clipboard.setStringAsync("");
        }
      } catch {
        // intentionally ignore
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

  /** Optional: if you ever want to clear immediately (still guarded) */
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

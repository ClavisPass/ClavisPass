import { clipboardOwnership } from "./clipboardOwnership";

class ClipboardClearScheduler {
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  scheduleClear(durationMs: number) {
    this.cancel();

    const ms = Math.max(0, Math.floor(durationMs));

    if (ms === 0) {
      return;
    }

    this.timeoutId = setTimeout(() => {
      void this.forceClear();
    }, ms);
  }

  cancel() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }

  async forceClear() {
    try {
      await clipboardOwnership.clearIfClipboardStillOwned();
    } catch {
    } finally {
      this.cancel();
    }
  }

  async forceClearSensitive() {
    try {
      await clipboardOwnership.clearSensitiveIfClipboardStillOwned();
    } catch {
    } finally {
      this.cancel();
    }
  }
}

export const clipboardClearScheduler = new ClipboardClearScheduler();

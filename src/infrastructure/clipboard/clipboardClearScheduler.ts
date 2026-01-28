import * as Clipboard from "expo-clipboard";

class ClipboardClearScheduler {
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private lastValue: string | null = null;

  scheduleClear(value: string, durationMs: number) {
    this.cancel();
    this.lastValue = value;

    const ms = Math.max(0, Math.floor(durationMs));

    if (ms === 0) {
      void this.forceClear(); // best effort
      return;
    }

    this.timeoutId = setTimeout(() => {
      void this.forceClearIfStillMatches(value);
    }, ms);
  }

  cancel() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }

  private async safeReadClipboard(): Promise<string | null> {
    try {
      return await Clipboard.getStringAsync();
    } catch {
      return null;
    }
  }

  async forceClear() {
    try {
      if (!this.lastValue) return;

      const current = await this.safeReadClipboard();
      if (current === null) {
        return;
      }

      if (current === this.lastValue) {
        await Clipboard.setStringAsync("");
      }
    } catch {
    } finally {
      this.lastValue = null;
      this.cancel();
    }
  }

  private async forceClearIfStillMatches(value: string) {
    try {
      const current = await this.safeReadClipboard();
      if (current === null) {
        return;
      }

      if (current === value) {
        await Clipboard.setStringAsync("");
      }
    } catch {
    } finally {
      if (this.lastValue === value) this.lastValue = null;
      this.cancel();
    }
  }
}

export const clipboardClearScheduler = new ClipboardClearScheduler();

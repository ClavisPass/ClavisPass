import { getClipboardText, setClipboardText } from "./clipboardAdapter";

export type ClipboardContentKind =
  | "generic"
  | "username"
  | "password"
  | "totp"
  | "pin"
  | "key"
  | "recovery-code";

type TrackClipboardCopyOptions = {
  kind?: ClipboardContentKind;
  sensitive?: boolean;
  expiresAtMs?: number | null;
};

type OwnedClipboardRecord = {
  kind: ClipboardContentKind;
  sensitive: boolean;
  fingerprint: string;
  copiedAtMs: number;
  expiresAtMs: number | null;
};

function fingerprintValue(value: string): string {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}

class ClipboardOwnership {
  private activeRecord: OwnedClipboardRecord | null = null;

  trackCopy(value: string, options?: TrackClipboardCopyOptions) {
    this.activeRecord = {
      kind: options?.kind ?? "generic",
      sensitive: options?.sensitive ?? true,
      fingerprint: fingerprintValue(value),
      copiedAtMs: Date.now(),
      expiresAtMs: options?.expiresAtMs ?? null,
    };
  }

  getActiveRecord() {
    return this.activeRecord;
  }

  clearTracking() {
    this.activeRecord = null;
  }

  private async safeReadClipboard(): Promise<string | null> {
    return getClipboardText();
  }

  private matchesActiveRecord(value: string) {
    if (!this.activeRecord) {
      return false;
    }

    return fingerprintValue(value) === this.activeRecord.fingerprint;
  }

  async clearIfClipboardStillOwned() {
    const record = this.activeRecord;
    if (!record) {
      return;
    }

    try {
      const current = await this.safeReadClipboard();
      if (current === null) {
        return;
      }

      if (this.matchesActiveRecord(current)) {
        await setClipboardText("");
      }
    } catch {
    } finally {
      if (this.activeRecord === record) {
        this.activeRecord = null;
      }
    }
  }

  async clearSensitiveIfClipboardStillOwned() {
    if (!this.activeRecord?.sensitive) {
      return;
    }

    await this.clearIfClipboardStillOwned();
  }
}

export const clipboardOwnership = new ClipboardOwnership();

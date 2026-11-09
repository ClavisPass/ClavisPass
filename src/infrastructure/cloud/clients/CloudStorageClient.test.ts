import { afterEach, describe, expect, it, vi } from "vitest";
import { uploadRemoteVaultFile } from "./CloudStorageClient";

const target = {
  accessToken: "test-token",
  remotePath: "clavispass.lock",
};
const v2 = JSON.stringify({ v: 2 });
const v3 = JSON.stringify({ v: 3 });

afterEach(() => vi.unstubAllGlobals());

describe("checked vault writes", () => {
  it("rejects a normal write that would remove the recovery envelope", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    await expect(uploadRemoteVaultFile({
      ...target,
      provider: "dropbox",
      content: v2,
      expected: { status: "ok", content: v3, revision: "v3-revision" },
    })).rejects.toThrow("cannot be silently downgraded");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects a recovery upgrade on Drive without attempting a write", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    await expect(uploadRemoteVaultFile({
      ...target,
      provider: "googleDrive",
      content: v3,
      expected: { status: "ok", content: v2 },
    })).rejects.toThrow("does not support checked recovery vault writes");
    expect(fetch).not.toHaveBeenCalled();
  });
});

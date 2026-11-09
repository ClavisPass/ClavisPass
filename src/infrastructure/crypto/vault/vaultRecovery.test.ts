import { beforeEach, describe, expect, it, vi } from "vitest";
import getEmptyData from "../../../features/vault/utils/getEmptyData";
import { webSodiumProvider } from "../provider/webSodiumProvider";
import { encryptVaultContent } from "../encryptVaultContent";
import { decryptVaultContent } from "../decryptVaultContent";
import { encryptVaultV1 } from "./v1/VaultV1";
import { VaultV1Schema } from "./v1/VaultV1Schema";
import { VaultV2Schema } from "./v2/VaultV2Schema";
import { openVaultKeyEnvelope } from "./v2/VaultV2";
import { VaultV3Schema } from "./VaultV3Schema";
import { VaultCryptoSession } from "./VaultCryptoSession";
import {
  createRecoveryKey,
  persistPreparedRecoveryVault,
  prepareVaultRecoveryChange,
  prepareV3VaultPasswordChange,
  prepareVaultPasswordRecovery,
  supportsVaultRecovery,
  verifyVaultRecoveryKey,
} from "./vaultRecovery";

vi.mock("../provider", () => ({
  getCryptoProvider: async () => webSodiumProvider,
}));

const master = "original passphrase for tests";
const nextMaster = "replacement passphrase for tests";
const testVault = () => ({
  ...getEmptyData(),
  folder: [{ id: "folder-1", name: "Example", icon: "folder" }],
});

async function encrypted(payload = testVault(), recoveryKey?: string) {
  const result = await encryptVaultContent(payload, master, { recoveryKey });
  if (!result.ok) throw result.error;
  return result.content;
}

describe("opt-in vault recovery", () => {
  beforeEach(() => VaultCryptoSession.clear());

  it("writes V2 by default and only introduces V3 when recovery is enabled", async () => {
    const payload = testVault();
    const v2 = await encrypted(payload);
    expect(VaultV2Schema.safeParse(JSON.parse(v2)).success).toBe(true);
    expect(supportsVaultRecovery(v2)).toBe(false);
    const key = await createRecoveryKey();
    const v3 = await prepareVaultRecoveryChange(
      v2,
      master,
      payload.vaultId!,
      key,
    );
    expect(VaultV1Schema.safeParse(JSON.parse(v3)).success).toBe(false);
    expect(VaultV2Schema.safeParse(JSON.parse(v3)).success).toBe(false);
    expect(v3).not.toContain(key);
    expect(VaultCryptoSession.hasRecoveryKey()).toBe(false);
    await expect(decryptVaultContent(v3, master)).resolves.toMatchObject({
      ok: true,
      format: "v3",
      payload,
    });
    await expect(verifyVaultRecoveryKey(v3, key)).resolves.toBeUndefined();
  });

  it("recovers the original contents with a new password, without opening a session before saving", async () => {
    const payload = testVault();
    const key = await createRecoveryKey();
    const original = await encrypted(payload, key);
    VaultCryptoSession.clear();
    await expect(
      verifyVaultRecoveryKey(original, key.toLowerCase().replace(/-/g, " ")),
    ).resolves.toBeUndefined();
    await expect(verifyVaultRecoveryKey(original, "123456")).rejects.toThrow();
    await expect(
      verifyVaultRecoveryKey(original, await createRecoveryKey()),
    ).rejects.toThrow();
    const changed = await prepareVaultPasswordRecovery(
      original,
      key,
      nextMaster,
    );
    expect(VaultCryptoSession.hasDataKey()).toBe(false);
    await expect(
      persistPreparedRecoveryVault(
        changed,
        nextMaster,
        async () => {
          throw new Error("write failed");
        },
        () => true,
      ),
    ).rejects.toThrow("write failed");
    expect(VaultCryptoSession.hasDataKey()).toBe(false);
    const persist = vi.fn(async () => {
      expect(VaultCryptoSession.hasDataKey()).toBe(false);
    });
    await expect(
      persistPreparedRecoveryVault(changed, nextMaster, persist, () => true),
    ).resolves.toMatchObject(payload);
    expect(persist).toHaveBeenCalledWith(payload.vaultId);
    expect(VaultCryptoSession.hasRecoveryKey()).toBe(true);
    await expect(decryptVaultContent(changed, master)).resolves.toMatchObject({
      ok: false,
    });
    await expect(
      decryptVaultContent(changed, nextMaster),
    ).resolves.toMatchObject({ ok: true, payload });
    await expect(verifyVaultRecoveryKey(changed, key)).resolves.toBeUndefined();
  });

  it("rejects a stripped, swapped, or downgraded recovery envelope", async () => {
    const original = JSON.parse(
      await encrypted(testVault(), await createRecoveryKey()),
    );
    const other = JSON.parse(
      await encrypted(testVault(), await createRecoveryKey()),
    );
    const stripped = { ...original };
    delete stripped.recovery;
    for (const tampered of [
      stripped,
      { ...stripped, v: 2 },
      { ...original, recovery: other.recovery },
    ]) {
      await expect(
        decryptVaultContent(JSON.stringify(tampered), master),
      ).resolves.toMatchObject({ ok: false });
    }
  });

  it("preserves recovery across an ordinary save and master password change", async () => {
    const payload = testVault();
    const key = await createRecoveryKey();
    const initial = await encrypted(payload, key);
    const saved = await encrypted(payload);
    const updated = await prepareV3VaultPasswordChange(
      saved,
      master,
      nextMaster,
      payload,
    );
    const slot = (content: string) =>
      VaultV3Schema.parse(JSON.parse(content)).recovery;
    expect(slot(saved)).toEqual(slot(initial));
    expect(slot(updated)).toEqual(slot(initial));
    await expect(verifyVaultRecoveryKey(updated, key)).resolves.toBeUndefined();
    await expect(
      decryptVaultContent(updated, nextMaster),
    ).resolves.toMatchObject({ ok: true, payload });
  });

  it("rotates the data key on replacement and removal, and still reads older copies", async () => {
    const payload = testVault();
    const oldKey = await createRecoveryKey();
    const newKey = await createRecoveryKey();
    const initial = await encrypted(payload, oldKey);
    const replaced = await prepareVaultRecoveryChange(
      initial,
      master,
      payload.vaultId!,
      newKey,
    );
    const disabled = await prepareVaultRecoveryChange(
      replaced,
      master,
      payload.vaultId!,
      null,
    );
    await expect(
      verifyVaultRecoveryKey(initial, oldKey),
    ).resolves.toBeUndefined();
    await expect(verifyVaultRecoveryKey(replaced, oldKey)).rejects.toThrow();
    await expect(
      verifyVaultRecoveryKey(replaced, newKey),
    ).resolves.toBeUndefined();
    expect(supportsVaultRecovery(disabled)).toBe(false);
    const open = async (content: string) =>
      openVaultKeyEnvelope(
        webSodiumProvider,
        VaultV3Schema.or(VaultV2Schema).parse(JSON.parse(content)),
        { password: master },
      );
    const keys = await Promise.all([
      open(initial),
      open(replaced),
      open(disabled),
    ]);
    try {
      expect(keys[0].session.dataKey).not.toEqual(keys[1].session.dataKey);
      expect(keys[1].session.dataKey).not.toEqual(keys[2].session.dataKey);
      expect(keys[2].payload).toMatchObject(payload);
      expect(VaultV2Schema.safeParse(JSON.parse(disabled)).success).toBe(true);
    } finally {
      for (const { session } of keys) session.dataKey.fill(0);
    }
  });

  it("only upgrades a legacy vault after confirming its password and identity", async () => {
    const payload = testVault();
    const legacy = await encryptVaultV1(webSodiumProvider, master, payload);
    const key = await createRecoveryKey();
    await expect(
      prepareVaultRecoveryChange(legacy, "wrong", payload.vaultId!, key),
    ).rejects.toThrow();
    await expect(
      prepareVaultRecoveryChange(legacy, master, "other-vault", key),
    ).rejects.toThrow();
    const upgraded = await prepareVaultRecoveryChange(
      legacy,
      master,
      payload.vaultId!,
      key,
    );
    await expect(
      verifyVaultRecoveryKey(upgraded, key),
    ).resolves.toBeUndefined();
  });
});

import { describe, expect, it, beforeEach, vi } from "vitest";

import getEmptyData from "../../../../features/vault/utils/getEmptyData";
import { webSodiumProvider } from "../../provider/webSodiumProvider";

vi.mock("../../provider", () => ({
  getCryptoProvider: async () => webSodiumProvider,
}));

import { decryptVaultContent } from "../../decryptVaultContent";
import { encryptVaultContent } from "../../encryptVaultContent";
import { VaultCryptoSession } from "../VaultCryptoSession";
import { encryptVaultV1 } from "../v1/VaultV1";
import { VaultV2Schema } from "./VaultV2Schema";
import { makeV2KeywrapAadBytes } from "./aad";

describe("Vault V2 envelope", () => {
  beforeEach(() => {
    VaultCryptoSession.clear();
  });

  it("encrypts and decrypts V2 vaults", async () => {
    const payload = getEmptyData();
    const encrypted = await encryptVaultContent(payload, "master-password");

    expect(encrypted.ok).toBe(true);
    if (!encrypted.ok) throw encrypted.error;

    const parsed = VaultV2Schema.parse(JSON.parse(encrypted.content));
    expect(parsed.v).toBe(2);

    VaultCryptoSession.clear();
    const decrypted = await decryptVaultContent(
      encrypted.content,
      "master-password",
    );

    expect(decrypted.ok).toBe(true);
    if (!decrypted.ok) throw decrypted.error;
    expect(decrypted.format).toBe("v2");
    expect(decrypted.payload.vaultId).toBe(payload.vaultId);
  });

  it("rejects a wrong master password", async () => {
    const encrypted = await encryptVaultContent(getEmptyData(), "correct");
    expect(encrypted.ok).toBe(true);
    if (!encrypted.ok) throw encrypted.error;

    VaultCryptoSession.clear();
    const decrypted = await decryptVaultContent(encrypted.content, "wrong");

    expect(decrypted.ok).toBe(false);
    if (decrypted.ok) throw new Error("expected decrypt failure");
    expect(decrypted.reason).toBe("AUTH_FAILED");
  });

  it("reads V1 and writes V2 by default on the next save", async () => {
    const payload = getEmptyData();
    const v1 = await encryptVaultV1(
      webSodiumProvider,
      "master-password",
      payload,
    );

    const decrypted = await decryptVaultContent(v1, "master-password");
    expect(decrypted.ok).toBe(true);
    if (!decrypted.ok) throw decrypted.error;
    expect(decrypted.format).toBe("v1");

    const migrated = await encryptVaultContent(
      decrypted.payload,
      "master-password",
    );
    expect(migrated.ok).toBe(true);
    if (!migrated.ok) throw migrated.error;

    const parsed = VaultV2Schema.parse(JSON.parse(migrated.content));
    expect(parsed.v).toBe(2);
  });

  it("wraps the data key as base64 text for mobile-safe AEAD payloads", async () => {
    const encrypted = await encryptVaultContent(
      getEmptyData(),
      "master-password",
    );
    expect(encrypted.ok).toBe(true);
    if (!encrypted.ok) throw encrypted.error;

    const parsed = VaultV2Schema.parse(JSON.parse(encrypted.content));
    const wrappingKey = webSodiumProvider.pwhash(
      parsed.kdf.keylen,
      "master-password",
      webSodiumProvider.fromBase64(parsed.kdf.salt_b64),
      parsed.kdf.opslimit,
      parsed.kdf.memlimit,
    );
    const wrappedPlaintext = webSodiumProvider.aeadDecrypt(
      webSodiumProvider.fromBase64(parsed.keywrap.wrapped_key_b64),
      makeV2KeywrapAadBytes(),
      webSodiumProvider.fromBase64(parsed.keywrap.nonce_b64),
      wrappingKey,
    );
    const wrappedText = webSodiumProvider.fromBytesUtf8(wrappedPlaintext);

    expect(wrappedPlaintext.length).toBe(44);
    expect(webSodiumProvider.fromBase64(wrappedText)).toHaveLength(32);
  });

  it("does not reuse an unlocked data key for a different vault id", async () => {
    const first = getEmptyData();
    const second = { ...getEmptyData(), vaultId: "other-vault" };

    const encryptedFirst = await encryptVaultContent(first, "master-password");
    expect(encryptedFirst.ok).toBe(true);
    if (!encryptedFirst.ok) throw encryptedFirst.error;
    const firstEnvelope = VaultV2Schema.parse(
      JSON.parse(encryptedFirst.content),
    );

    const encryptedSecond = await encryptVaultContent(
      second,
      "master-password",
    );
    expect(encryptedSecond.ok).toBe(true);
    if (!encryptedSecond.ok) throw encryptedSecond.error;
    const secondEnvelope = VaultV2Schema.parse(
      JSON.parse(encryptedSecond.content),
    );

    expect(secondEnvelope.keywrap.wrapped_key_b64).not.toBe(
      firstEnvelope.keywrap.wrapped_key_b64,
    );
  });
});

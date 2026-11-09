import { beforeEach, describe, expect, it } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchFile, uploadFile } from "./DeviceStorageClient";

describe("DeviceStorageClient", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("does not let a stale save overwrite a recovery setup", async () => {
    const old = '{"v":2,"ct_b64":"before"}';
    const recovery = '{"v":3,"ct_b64":"after"}';
    await uploadFile(old, undefined, "vault-main", null);
    const upgrade = uploadFile(recovery, undefined, "vault-main", old);
    const stale = uploadFile(old, undefined, "vault-main", old);
    const result = await Promise.allSettled([upgrade, stale]);
    expect(result.map(({ status }) => status)).toEqual(["fulfilled", "rejected"]);
    await expect(uploadFile(old, undefined, "vault-main")).rejects.toThrow();
    await expect(uploadFile(recovery, undefined, "vault-main")).rejects.toThrow();
    await expect(fetchFile()).resolves.toMatchObject({ status: "ok", content: recovery });
  });

  it("requires an explicit checked removal to return a recovery vault to V2", async () => {
    const recovery = '{"v":3,"ct_b64":"before"}';
    const disabled = '{"v":2,"ct_b64":"after"}';
    await uploadFile(recovery, undefined, "vault-main", null);
    await expect(uploadFile(disabled, undefined, "vault-main", recovery)).rejects.toThrow();
    await expect(uploadFile(disabled, undefined, "vault-main", "stale", true)).rejects.toThrow();
    await uploadFile(disabled, undefined, "vault-main", recovery, true);
    await expect(fetchFile()).resolves.toMatchObject({ status: "ok", content: disabled });
  });

  it("stores vault-specific local sync copies while keeping the legacy cache", async () => {
    await uploadFile("encrypted-content", undefined, "vault-main");

    await expect(AsyncStorage.getItem("LOCAL_SYNC")).resolves.toBe(
      "encrypted-content",
    );
    await expect(AsyncStorage.getItem("LOCAL_SYNC:vault-main")).resolves.toBe(
      "encrypted-content",
    );
    await expect(AsyncStorage.getItem("ACTIVE_LOCAL_VAULT_ID")).resolves.toBe(
      "vault-main",
    );
  });

  it("loads the active vault-specific local sync copy first", async () => {
    await AsyncStorage.setItem("LOCAL_SYNC", "legacy-content");
    await AsyncStorage.setItem("LOCAL_SYNC:vault-main", "vault-content");
    await AsyncStorage.setItem("ACTIVE_LOCAL_VAULT_ID", "vault-main");

    await expect(fetchFile()).resolves.toEqual({
      status: "ok",
      content: "vault-content",
      updatedAt: undefined,
    });
  });

  it("falls back to the legacy local sync copy when the active copy is missing", async () => {
    await AsyncStorage.setItem("LOCAL_SYNC", "legacy-content");
    await AsyncStorage.setItem("ACTIVE_LOCAL_VAULT_ID", "vault-main");

    await expect(fetchFile()).resolves.toEqual({
      status: "ok",
      content: "legacy-content",
      updatedAt: undefined,
    });
  });
});

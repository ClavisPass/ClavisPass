import { beforeEach, describe, expect, it } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchFile, uploadFile } from "./DeviceStorageClient";

describe("DeviceStorageClient", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
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

import { beforeEach, describe, expect, it, vi } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModulesEnum from "../../features/vault/model/ModulesEnum";
import { get, set, subscribe } from "./store";

const storageMock = AsyncStorage as typeof AsyncStorage & {
  __setRaw(key: string, value: string): void;
};

describe("store", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("returns schema defaults when nothing is stored", async () => {
    await expect(get("THEME_PREFERENCE")).resolves.toBe("light");
    await expect(get("AUTOSAVE_DELAY")).resolves.toBe(30);
    await expect(get("ONBOARDING_DONE")).resolves.toBe(false);
  });

  it("falls back to defaults for invalid stored values", async () => {
    storageMock.__setRaw("THEME_PREFERENCE", "system");
    storageMock.__setRaw("COPY_DURATION", "not-a-number");
    storageMock.__setRaw("ONBOARDING_DONE", "maybe");

    await expect(get("THEME_PREFERENCE")).resolves.toBe("light");
    await expect(get("COPY_DURATION")).resolves.toBe(20);
    await expect(get("ONBOARDING_DONE")).resolves.toBe(false);
  });

  it("normalizes booleans stored as 1 or 0", async () => {
    storageMock.__setRaw("FAVORITE_FILTER", "1");
    storageMock.__setRaw("TWOFA_FILTER", "0");

    await expect(get("FAVORITE_FILTER")).resolves.toBe(true);
    await expect(get("TWOFA_FILTER")).resolves.toBe(false);
  });

  it("deduplicates and filters favorite modules", async () => {
    await set("FAVORITE_MODULES", [
      ModulesEnum.PASSWORD,
      ModulesEnum.PASSWORD,
      "NOPE" as ModulesEnum,
      ModulesEnum.TOTP,
    ]);

    await expect(get("FAVORITE_MODULES")).resolves.toEqual([
      ModulesEnum.PASSWORD,
      ModulesEnum.TOTP,
    ]);
  });

  it("notifies subscribers when a value changes", async () => {
    const listener = vi.fn();
    const unsubscribe = subscribe("AUTOSAVE_DELAY", listener);

    await set("AUTOSAVE_DELAY", 5);
    unsubscribe();
    await set("AUTOSAVE_DELAY", 30);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(5);
  });
});

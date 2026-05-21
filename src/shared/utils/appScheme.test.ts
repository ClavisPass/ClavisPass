import { beforeEach, describe, expect, it } from "vitest";
import { resetExpoConfig, setExpoConfig } from "../../../tests/mocks/expoConstants";
import { getAppRedirectUri, getAppScheme } from "./appScheme";

describe("appScheme", () => {
  beforeEach(() => {
    resetExpoConfig();
  });

  it("uses the configured Expo scheme", () => {
    setExpoConfig({ scheme: "clavispass-custom", extra: {} });

    expect(getAppScheme()).toBe("clavispass-custom");
    expect(getAppRedirectUri()).toBe("clavispass-custom://redirect");
  });

  it("falls back to the production scheme", () => {
    setExpoConfig({ extra: { appVariant: "production" } });

    expect(getAppScheme()).toBe("clavispass");
  });

  it("falls back to the development scheme for development variants", () => {
    setExpoConfig({ extra: { appVariant: "development" } });

    expect(getAppScheme()).toBe("clavispass-dev");
    expect(getAppRedirectUri()).toBe("clavispass-dev://redirect");
  });
});

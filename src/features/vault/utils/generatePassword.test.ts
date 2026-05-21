import { afterEach, describe, expect, it, vi } from "vitest";
import generatePassword from "./generatePassword";

describe("generatePassword", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("generates lowercase-only passwords when all options are disabled", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    expect(generatePassword(4, false, false, false)).toBe("aaaa");
  });

  it("respects the requested length", () => {
    const password = generatePassword(32, true, true, true);

    expect(password).toHaveLength(32);
  });

  it("can pick characters from the enabled uppercase range", () => {
    vi.spyOn(Math, "random").mockReturnValue(26 / 52);

    expect(generatePassword(1, true, false, false)).toBe("A");
  });
});

import { describe, expect, it } from "vitest";
import ModulesEnum from "../../vault/model/ModulesEnum";
import { PasskeyModuleTypeSchema } from "../../vault/model/modules/PasskeyModuleType";
import type ValuesType from "../../vault/model/ValuesType";
import { reservePasskeyAssertion } from "./reservePasskeyAssertion";

const now = "2026-10-16T10:00:00.000Z";
const payload = {
  entryId: "entry",
  moduleId: "passkey",
  relyingPartyId: "example.com",
  credentialId: "a-_b",
  minimumSignCount: 0,
};
function entry(signCount = 0): ValuesType {
  return {
    id: "entry", title: "Example", created: now, lastUpdated: now, fav: false, folder: null,
    modules: [PasskeyModuleTypeSchema.parse({
      id: "passkey", module: ModulesEnum.PASSKEY,
      relyingPartyId: "Example.COM.", credentialId: "a+/b=", privateKey: "native-only-key", signCount,
    })],
  };
}

describe("reservePasskeyAssertion", () => {
  it("keeps counterless credentials at zero and updates usage without mutating the snapshot", () => {
    const original = entry();
    const reserved = reservePasskeyAssertion(original, payload, now);
    expect(reserved.signCount).toBe(0);
    expect(reserved.entry.modules[0]).toMatchObject({ lastUsedAt: now, privateKey: "native-only-key" });
    expect(original.modules[0]).not.toHaveProperty("lastUsedAt");
  });

  it("allocates different positive counters for consecutive requests using the same old snapshot", () => {
    const stalePayload = { ...payload, minimumSignCount: 41 };
    const first = reservePasskeyAssertion(entry(41), stalePayload, now);
    const second = reservePasskeyAssertion(first.entry, stalePayload, now);
    expect(first.signCount).toBe(42);
    expect(second.signCount).toBe(43);
  });

  it("never rolls a counter below the host snapshot", () => {
    expect(reservePasskeyAssertion(entry(1), { ...payload, minimumSignCount: 50 }, now).signCount).toBe(51);
  });

  it.each([
    { entryId: "other" }, { moduleId: "other" },
    { relyingPartyId: "evil.example" }, { credentialId: "other" },
    { minimumSignCount: -1 }, { minimumSignCount: 0x100000000 },
  ])("rejects mismatched credentials or invalid counters: %j", (change) => {
    expect(() => reservePasskeyAssertion(entry(), { ...payload, ...change }, now)).toThrow();
  });

  it("rejects ambiguous credentials when no module is selected", () => {
    const original = entry();
    original.modules.push({ ...original.modules[0], id: "duplicate" });
    expect(() => reservePasskeyAssertion(original, { ...payload, moduleId: null }, now)).toThrow("PASSKEY_NOT_FOUND");
  });

  it("fails on overflow instead of wrapping or reusing the previous counter", () => {
    expect(() => reservePasskeyAssertion(entry(0xffffffff), payload, now)).toThrow("SIGN_COUNT_EXHAUSTED");
  });

  it("validates the persisted unsigned 32-bit counter format", () => {
    expect(() => entry(0x100000000)).toThrow();
    expect(() => entry(1.5)).toThrow();
  });
});

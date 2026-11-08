import { describe, expect, it } from "vitest";

import { validateWebAuthnRpId } from "../../../../browser-extension/src/shared/domain";

describe("validateWebAuthnRpId", () => {
  it("accepts exact and parent-domain RP IDs for secure origins", () => {
    expect(validateWebAuthnRpId("https://login.example.com", "login.example.com")).toMatchObject({
      status: "valid",
      effectiveRpId: "login.example.com",
      originHost: "login.example.com",
    });

    expect(validateWebAuthnRpId("https://login.example.com", "example.com")).toMatchObject({
      status: "valid",
      effectiveRpId: "example.com",
      originHost: "login.example.com",
    });
  });

  it("rejects RP IDs that are not equal to or a parent domain of the origin", () => {
    expect(validateWebAuthnRpId("https://example.com", "login.example.com")).toMatchObject({
      status: "invalid",
      effectiveRpId: "login.example.com",
      originHost: "example.com",
    });

    expect(validateWebAuthnRpId("https://evil-example.com", "example.com")).toMatchObject({
      status: "invalid",
      effectiveRpId: "example.com",
      originHost: "evil-example.com",
    });
  });

  it("rejects insecure non-local origins before matching RP IDs", () => {
    expect(validateWebAuthnRpId("http://example.com", "example.com")).toMatchObject({
      status: "unsupported",
      originHost: "example.com",
    });
  });

  it.each([
    ["https://example.com", "com"],
    ["https://shop.example.co.uk", "co.uk"],
    ["https://alice.github.io", "github.io"],
    ["https://example.com", "https://example.com"],
    ["https://example.com", "example.com:443"],
    ["https://example.com", "example.com/path"],
    ["https://example.com", ""],
    ["https://example.com", "example..com"],
    ["https://127.0.0.1", "127.0.0.1"],
    ["http://127.0.0.1", "127.0.0.1"],
    ["ftp://localhost", "localhost"],
    ["https://example.com/path", "example.com"],
    ["https://user@example.com", "example.com"],
    ["https://example.com#fragment", "example.com"],
  ])("rejects invalid origin/RP pair %s / %s", (origin, rpId) => {
    expect(validateWebAuthnRpId(origin, rpId).status).not.toBe("valid");
  });

  it.each([
    ["http://localhost:8787", "localhost"],
    ["https://alice.github.io", "alice.github.io"],
    ["https://login.example.co.uk", "example.co.uk"],
    ["https://login.example.com:8443", "example.com"],
  ])("accepts valid origin/RP pair %s / %s", (origin, rpId) => {
    expect(validateWebAuthnRpId(origin, rpId).status).toBe("valid");
  });
});

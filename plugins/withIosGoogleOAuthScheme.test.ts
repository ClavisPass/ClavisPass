import { describe, expect, it } from "vitest";

const {
  ensureUrlScheme,
  toReverseClientIdScheme,
} = require("./withIosGoogleOAuthScheme");

describe("withIosGoogleOAuthScheme helpers", () => {
  it("converts an iOS Google client ID to the reverse client ID scheme", () => {
    expect(
      toReverseClientIdScheme("1234567890-iosabc.apps.googleusercontent.com"),
    ).toBe("com.googleusercontent.apps.1234567890-iosabc");
  });

  it("ignores missing and invalid client IDs", () => {
    expect(toReverseClientIdScheme("")).toBe("");
    expect(toReverseClientIdScheme("empty")).toBe("");
    expect(toReverseClientIdScheme("not-google")).toBe("");
  });

  it("adds the Google OAuth URL scheme without removing existing schemes", () => {
    const infoPlist = {
      CFBundleURLTypes: [{ CFBundleURLSchemes: ["clavispass"] }],
    };

    expect(ensureUrlScheme(infoPlist, "com.googleusercontent.apps.123")).toEqual({
      CFBundleURLTypes: [
        { CFBundleURLSchemes: ["clavispass"] },
        {
          CFBundleURLName: "Google OAuth",
          CFBundleURLSchemes: ["com.googleusercontent.apps.123"],
        },
      ],
    });
  });

  it("does not duplicate an existing Google OAuth URL scheme", () => {
    const infoPlist = {
      CFBundleURLTypes: [
        { CFBundleURLSchemes: ["com.googleusercontent.apps.123"] },
      ],
    };

    expect(ensureUrlScheme(infoPlist, "com.googleusercontent.apps.123")).toBe(
      infoPlist,
    );
  });
});

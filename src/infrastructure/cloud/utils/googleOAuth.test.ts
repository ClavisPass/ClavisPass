import { beforeEach, describe, expect, it } from "vitest";
import { resetEnv, setEnv } from "../../../../tests/mocks/env";
import { setPlatform } from "../../../../tests/mocks/reactNative";
import {
  buildGoogleLoopbackRedirectUri,
  getGoogleClientIdForCurrentPlatform,
  getGoogleDesktopClientId,
  getGoogleDesktopClientSecret,
  getGoogleMobileRedirectUri,
} from "./googleOAuth";

describe("googleOAuth", () => {
  beforeEach(() => {
    resetEnv();
    setPlatform("web");
  });

  it("builds the mobile redirect URI from the Android client ID", () => {
    setPlatform("android");
    setEnv({
      GOOGLE_CLIENT_ID_ANDROID:
        "1234567890-androidabc.apps.googleusercontent.com",
    });

    expect(getGoogleClientIdForCurrentPlatform()).toBe(
      "1234567890-androidabc.apps.googleusercontent.com",
    );
    expect(getGoogleMobileRedirectUri()).toBe(
      "com.googleusercontent.apps.1234567890-androidabc:/oauth2redirect",
    );
  });

  it("builds the mobile redirect URI from the iOS client ID", () => {
    setPlatform("ios");
    setEnv({
      GOOGLE_CLIENT_ID_IOS: "1234567890-iosabc.apps.googleusercontent.com",
    });

    expect(getGoogleMobileRedirectUri()).toBe(
      "com.googleusercontent.apps.1234567890-iosabc:/oauth2redirect",
    );
  });

  it("returns null for missing or invalid mobile client IDs", () => {
    setPlatform("android");
    setEnv({ GOOGLE_CLIENT_ID_ANDROID: "not-a-google-client-id" });

    expect(getGoogleMobileRedirectUri()).toBeNull();
  });

  it("uses desktop credentials on web", () => {
    setPlatform("web");
    setEnv({
      GOOGLE_CLIENT_ID: "fallback.apps.googleusercontent.com",
      GOOGLE_CLIENT_ID_DESKTOP: "desktop.apps.googleusercontent.com",
      GOOGLE_CLIENT_SECRET_DESKTOP: "desktop-secret",
    });

    expect(getGoogleClientIdForCurrentPlatform()).toBe(
      "desktop.apps.googleusercontent.com",
    );
    expect(getGoogleDesktopClientId()).toBe("desktop.apps.googleusercontent.com");
    expect(getGoogleDesktopClientSecret()).toBe("desktop-secret");
    expect(buildGoogleLoopbackRedirectUri(57771)).toBe("http://127.0.0.1:57771");
  });
});

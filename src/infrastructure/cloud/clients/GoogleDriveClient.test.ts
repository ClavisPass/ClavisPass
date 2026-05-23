import { beforeEach, describe, expect, it, vi } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { resetEnv, setEnv } from "../../../../tests/mocks/env";
import { setPlatform } from "../../../../tests/mocks/reactNative";
import {
  fetchFile,
  refreshAccessToken,
  uploadFile,
} from "./GoogleDriveClient";

function response({
  ok,
  status,
  statusText = "",
  body = "",
}: {
  ok: boolean;
  status: number;
  statusText?: string;
  body?: unknown;
}) {
  const text = typeof body === "string" ? body : JSON.stringify(body);
  return {
    ok,
    status,
    statusText,
    text: vi.fn().mockResolvedValue(text),
    json: vi.fn().mockImplementation(async () => {
      if (typeof body !== "string") return body;
      return JSON.parse(body);
    }),
  } as any;
}

describe("GoogleDriveClient", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    resetEnv();
    setPlatform("android");
    setEnv({
      GOOGLE_CLIENT_ID_ANDROID:
        "1234567890-androidabc.apps.googleusercontent.com",
    });
    vi.restoreAllMocks();
  });

  it("refreshes access tokens with the platform client ID", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      response({
        ok: true,
        status: 200,
        body: {
          access_token: "access-token",
          expires_in: 3599,
          scope: "drive.appdata",
          token_type: "Bearer",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(refreshAccessToken("refresh-token")).resolves.toEqual({
      accessToken: "access-token",
      expiresIn: 3599,
      scope: "drive.appdata",
      tokenType: "Bearer",
    });

    const body = new URLSearchParams(fetchMock.mock.calls[0][1].body);
    expect(body.get("grant_type")).toBe("refresh_token");
    expect(body.get("refresh_token")).toBe("refresh-token");
    expect(body.get("client_id")).toBe(
      "1234567890-androidabc.apps.googleusercontent.com",
    );
    expect(body.has("client_secret")).toBe(false);
  });

  it("preserves Google OAuth errors from failed token refreshes", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        response({
          ok: false,
          status: 400,
          body: {
            error: "invalid_grant",
            error_description: "Token has been expired or revoked.",
          },
        }),
      ),
    );

    await expect(refreshAccessToken("refresh-token")).rejects.toMatchObject({
      message: "Token has been expired or revoked.",
      oauthError: "invalid_grant",
      oauthErrorDescription: "Token has been expired or revoked.",
    });
  });

  it("returns not_found when the appDataFolder file does not exist", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        response({
          ok: true,
          status: 200,
          body: { files: [] },
        }),
      ),
    );

    await expect(fetchFile("access-token", "clavispass.lock")).resolves.toEqual({
      status: "not_found",
    });
  });

  it("downloads the media content for the matched appDataFolder file", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        response({
          ok: true,
          status: 200,
          body: { files: [{ id: "file-id", name: "clavispass.lock" }] },
        }),
      )
      .mockResolvedValueOnce(
        response({ ok: true, status: 200, body: "encrypted-content" }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchFile("access-token", "clavispass.lock")).resolves.toEqual({
      status: "ok",
      content: "encrypted-content",
    });

    expect(fetchMock.mock.calls[1][0]).toBe(
      "https://www.googleapis.com/drive/v3/files/file-id?alt=media",
    );
  });

  it("creates a new appDataFolder file when upload does not find an existing one", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        response({
          ok: true,
          status: 200,
          body: { files: [] },
        }),
      )
      .mockResolvedValueOnce(
        response({
          ok: true,
          status: 200,
          body: { id: "created-file-id" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);
    const onCompleted = vi.fn();

    await uploadFile(
      "access-token",
      "encrypted-content",
      "clavispass.lock",
      onCompleted,
    );

    expect(fetchMock.mock.calls[1][0]).toBe(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    );
    expect(fetchMock.mock.calls[1][1].method).toBe("POST");
    expect(fetchMock.mock.calls[1][1].body).toContain(
      JSON.stringify({ name: "clavispass.lock", parents: ["appDataFolder"] }),
    );
    expect(fetchMock.mock.calls[1][1].body).toContain("encrypted-content");
    await expect(AsyncStorage.getItem("LOCAL_SYNC")).resolves.toBe(
      "encrypted-content",
    );
    expect(onCompleted).toHaveBeenCalledTimes(1);
  });

  it("patches an existing appDataFolder file when upload finds one", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        response({
          ok: true,
          status: 200,
          body: { files: [{ id: "existing-file-id", name: "clavispass.lock" }] },
        }),
      )
      .mockResolvedValueOnce(response({ ok: true, status: 200, body: {} }));
    vi.stubGlobal("fetch", fetchMock);

    await uploadFile("access-token", "encrypted-content", "clavispass.lock");

    expect(fetchMock.mock.calls[1][0]).toBe(
      "https://www.googleapis.com/upload/drive/v3/files/existing-file-id?uploadType=multipart",
    );
    expect(fetchMock.mock.calls[1][1].method).toBe("PATCH");
    expect(fetchMock.mock.calls[1][1].body).toContain(
      JSON.stringify({ name: "clavispass.lock" }),
    );
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setEnv } from "../../../../tests/mocks/env";
import {
  fetchFile,
  refreshAccessToken,
  uploadFile,
} from "./DropboxClient";

function response({
  ok,
  status,
  statusText = "",
  body = "",
  revision,
}: {
  ok: boolean;
  status: number;
  statusText?: string;
  body?: unknown;
  revision?: string;
}) {
  const text = typeof body === "string" ? body : JSON.stringify(body);
  return {
    ok,
    status,
    statusText,
    headers: new Headers(revision ? { "Dropbox-API-Result": JSON.stringify({ rev: revision }) } : {}),
    text: vi.fn().mockResolvedValue(text),
    json: vi.fn().mockImplementation(async () => {
      if (typeof body !== "string") return body;
      return JSON.parse(body);
    }),
  } as any;
}

describe("DropboxClient", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    setEnv({ DROPBOX_CLIENT_ID: "dropbox-client" });
    vi.restoreAllMocks();
  });

  it("refreshes access tokens with the configured Dropbox client ID", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      response({
        ok: true,
        status: 200,
        body: {
          access_token: "access-token",
          expires_in: 14400,
          scope: "files.content.read",
          token_type: "bearer",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(refreshAccessToken("refresh-token")).resolves.toEqual({
      accessToken: "access-token",
      expiresIn: 14400,
      scope: "files.content.read",
      tokenType: "bearer",
    });

    const body = fetchMock.mock.calls[0][1].body as string;
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dropboxapi.com/oauth2/token",
      expect.objectContaining({ method: "POST" }),
    );
    expect(new URLSearchParams(body).get("grant_type")).toBe("refresh_token");
    expect(new URLSearchParams(body).get("refresh_token")).toBe("refresh-token");
    expect(new URLSearchParams(body).get("client_id")).toBe("dropbox-client");
  });

  it("maps Dropbox path/not_found responses to not_found", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        response({
          ok: false,
          status: 409,
          body: { error_summary: "path/not_found/..." },
        }),
      ),
    );

    await expect(fetchFile("access-token", "clavispass.lock")).resolves.toEqual({
      status: "not_found",
    });
  });

  it("normalizes download paths before calling Dropbox", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      response({ ok: true, status: 200, body: "vault-content", revision: "downloaded-revision" }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchFile("access-token", "clavispass.lock")).resolves.toEqual({
      status: "ok",
      content: "vault-content",
      revision: "downloaded-revision",
    });

    expect(fetchMock.mock.calls[0][1].headers["Dropbox-API-Arg"]).toBe(
      JSON.stringify({ path: "/clavispass.lock" }),
    );
  });

  it("updates only the downloaded revision and caches the accepted write", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      response({ ok: true, status: 200, body: { id: "file-id" } }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const onCompleted = vi.fn();

    await uploadFile(
      "access-token",
      "encrypted-content",
      "clavispass.lock",
      onCompleted,
      undefined,
      "downloaded-revision",
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://content.dropboxapi.com/2/files/upload",
      expect.objectContaining({
        method: "POST",
        body: "encrypted-content",
      }),
    );
    expect(fetchMock.mock.calls[0][1].headers["Dropbox-API-Arg"]).toBe(
      JSON.stringify({
        path: "/clavispass.lock",
        mode: { ".tag": "update", update: "downloaded-revision" },
        strict_conflict: true,
        autorename: false,
        mute: false,
      }),
    );
    await expect(AsyncStorage.getItem("LOCAL_SYNC")).resolves.toBe(
      "encrypted-content",
    );
    expect(onCompleted).toHaveBeenCalledTimes(1);
  });

  it("does not retry or cache an upload rejected for a stale revision", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      response({ ok: false, status: 409, body: { error_summary: "path/conflict/file" } }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const onCompleted = vi.fn();

    await expect(uploadFile("token", "stale", "clavispass.lock", onCompleted, undefined, "stale-revision"))
      .rejects.toThrow();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(onCompleted).not.toHaveBeenCalled();
    await expect(AsyncStorage.getItem("LOCAL_SYNC")).resolves.toBeNull();
  });
});

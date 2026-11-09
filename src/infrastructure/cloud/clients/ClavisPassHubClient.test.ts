import { beforeEach, describe, expect, it, vi } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getClavisPassHubVaultEtag,
  setClavisPassHubHostUrl,
  setClavisPassHubVaultEtag,
} from "./ClavisPassHubConfig";
import { fetchFile, uploadFile } from "./ClavisPassHubClient";

function response({
  ok,
  status,
  body = "",
  headers = {},
}: {
  ok: boolean;
  status: number;
  body?: unknown;
  headers?: Record<string, string>;
}) {
  const text = typeof body === "string" ? body : JSON.stringify(body);
  const normalizedHeaders = new Map(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]),
  );

  return {
    ok,
    status,
    text: vi.fn().mockResolvedValue(text),
    json: vi.fn().mockImplementation(async () => {
      if (typeof body !== "string") return body;
      return JSON.parse(body);
    }),
    headers: {
      get: vi.fn(
        (key: string) => normalizedHeaders.get(key.toLowerCase()) ?? null,
      ),
    },
  } as any;
}

describe("ClavisPassHubClient", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await setClavisPassHubHostUrl("https://hub.example.com");
    vi.restoreAllMocks();
  });

  it("maps GET /api/vault 404 VAULT_NOT_FOUND to not_found and clears the stored ETag", async () => {
    await setClavisPassHubVaultEtag("stale-etag");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        response({
          ok: false,
          status: 404,
          body: {
            error: "VAULT_NOT_FOUND",
            message: "Vault does not exist yet",
          },
        }),
      ),
    );

    await expect(fetchFile("access-token", "clavispass.lock")).resolves.toEqual({
      status: "not_found",
    });
    await expect(getClavisPassHubVaultEtag()).resolves.toBeNull();
  });

  it("keeps unexpected GET /api/vault 404 responses as errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        response({
          ok: false,
          status: 404,
          body: { error: "ROUTE_NOT_FOUND", message: "Not found" },
        }),
      ),
    );

    await expect(
      fetchFile("access-token", "clavispass.lock"),
    ).resolves.toMatchObject({
      status: "error",
      message: "Not found",
    });
  });

  it("creates a first Hub vault with a missing-file precondition", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        response({
          ok: false,
          status: 404,
          body: {
            error: "VAULT_NOT_FOUND",
            message: "Vault does not exist yet",
          },
        }),
      )
      .mockResolvedValueOnce(
        response({
          ok: true,
          status: 200,
          body: "",
          headers: { etag: "created-etag" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchFile("access-token", "clavispass.lock")).resolves.toEqual({
      status: "not_found",
    });
    await uploadFile("access-token", "encrypted-content", "clavispass.lock", undefined, null);

    expect(fetchMock.mock.calls[1][0]).toBe("https://hub.example.com/api/vault");
    expect(fetchMock.mock.calls[1][1]).toMatchObject({
      method: "PUT",
      body: "encrypted-content",
    });
    expect(fetchMock.mock.calls[1][1].headers["Content-Type"]).toBe(
      "text/plain; charset=utf-8",
    );
    expect(fetchMock.mock.calls[1][1].headers["If-Match"]).toBeUndefined();
    expect(fetchMock.mock.calls[1][1].headers["If-None-Match"]).toBe("*");
    await expect(getClavisPassHubVaultEtag()).resolves.toBe("created-etag");
  });

  it("uses the ETag from the downloaded content even if another request stored a newer one", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      response({
        ok: true,
        status: 200,
        body: "",
        headers: { etag: "next-etag" },
      }),
    ).mockResolvedValueOnce(
      response({ ok: true, status: 200, body: "read-content", headers: { etag: "read-etag" } }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const snapshot = await fetchFile("access-token", "clavispass.lock");
    expect(snapshot).toMatchObject({ content: "read-content", revision: "read-etag" });
    if (snapshot.status !== "ok") throw new Error("Expected a vault snapshot");
    await setClavisPassHubVaultEtag("newer-etag");
    await uploadFile("access-token", "encrypted-content", "clavispass.lock", undefined, snapshot.revision);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][1].headers["If-Match"]).toBe("read-etag");
    await expect(getClavisPassHubVaultEtag()).resolves.toBe("next-etag");
  });

  it("does not blind-overwrite an existing Hub vault when no ETag is available", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      uploadFile("access-token", "encrypted-content", "clavispass.lock"),
    ).rejects.toMatchObject({ code: "ETAG_MISSING" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not retry or cache a rejected stale Hub write", async () => {
    const fetchMock = vi.fn().mockResolvedValue(response({ ok: false, status: 412 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(uploadFile("token", "stale", "clavispass.lock", undefined, "stale-etag"))
      .rejects.toMatchObject({ code: "ETAG_MISMATCH" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await expect(AsyncStorage.getItem("LOCAL_SYNC")).resolves.toBeNull();
  });
});

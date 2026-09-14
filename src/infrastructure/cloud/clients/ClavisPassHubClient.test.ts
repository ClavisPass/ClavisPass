import { beforeEach, describe, expect, it, vi } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  clearClavisPassHubVaultEtag,
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

  it("uploads a first Hub vault without If-Match after fetchFile returned not_found", async () => {
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
    await uploadFile("access-token", "encrypted-content", "clavispass.lock");

    expect(fetchMock.mock.calls[1][0]).toBe("https://hub.example.com/api/vault");
    expect(fetchMock.mock.calls[1][1]).toMatchObject({
      method: "PUT",
      body: "encrypted-content",
    });
    expect(fetchMock.mock.calls[1][1].headers["Content-Type"]).toBe(
      "text/plain; charset=utf-8",
    );
    expect(fetchMock.mock.calls[1][1].headers["If-Match"]).toBeUndefined();
    await expect(getClavisPassHubVaultEtag()).resolves.toBe("created-etag");
  });

  it("uses the stored ETag on later Hub uploads", async () => {
    await setClavisPassHubVaultEtag("current-etag");
    const fetchMock = vi.fn().mockResolvedValue(
      response({
        ok: true,
        status: 200,
        body: "",
        headers: { etag: "next-etag" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await uploadFile("access-token", "encrypted-content", "clavispass.lock");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1].headers["If-Match"]).toBe("current-etag");
    await expect(getClavisPassHubVaultEtag()).resolves.toBe("next-etag");
  });

  it("does not blind-overwrite an existing Hub vault when no ETag is available", async () => {
    await clearClavisPassHubVaultEtag();
    const fetchMock = vi.fn().mockResolvedValue(
      response({
        ok: true,
        status: 200,
        body: { etag: null },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      uploadFile("access-token", "encrypted-content", "clavispass.lock"),
    ).rejects.toMatchObject({ code: "ETAG_MISSING" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

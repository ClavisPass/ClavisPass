import { describe, expect, it } from "vitest";

import ModulesEnum from "../../vault/model/ModulesEnum";
import type ValuesType from "../../vault/model/ValuesType";
import { deriveIdentityClusters } from "./deriveIdentityClusters";

function entry(
  id: string,
  title: string,
  modules: ValuesType["modules"],
): ValuesType {
  return {
    id,
    title,
    modules,
    fav: false,
    folder: null,
    created: "2026-01-01T00:00:00.000Z",
    lastUpdated: "2026-01-01T00:00:00.000Z",
  };
}

describe("deriveIdentityClusters", () => {
  it("builds email identities and consolidates websites, info types, usernames, and risks", () => {
    const clusters = deriveIdentityClusters([
      entry("1", "Mail", [
        { id: "email-1", module: ModulesEnum.E_MAIL, value: "Me@example.com" },
        { id: "user-1", module: ModulesEnum.USERNAME, value: "ricardo" },
        { id: "url-1", module: ModulesEnum.URL, value: "https://mail.example.com" },
        { id: "pw-1", module: ModulesEnum.PASSWORD, value: "same-password" },
      ]),
      entry("2", "Shop", [
        { id: "email-2", module: ModulesEnum.E_MAIL, value: "me@example.com" },
        { id: "url-2", module: ModulesEnum.URL, value: "shop.example.com/login" },
        { id: "pw-2", module: ModulesEnum.PASSWORD, value: "same-password" },
      ]),
      entry("3", "Forum", [
        { id: "user-3", module: ModulesEnum.USERNAME, value: "forum-user" },
        { id: "pw-3", module: ModulesEnum.PASSWORD, value: "short" },
      ]),
    ]);

    expect(clusters).toHaveLength(1);
    expect(clusters[0]).toMatchObject({
      id: "email:me@example.com",
      email: "me@example.com",
      riskCount: 2,
    });
    expect(clusters[0].entries.map((item) => item.title)).toEqual([
      "Mail",
      "Shop",
    ]);
    expect(clusters[0].usernames).toEqual(["ricardo"]);
    expect(clusters[0].domains).toEqual([
      "mail.example.com",
      "shop.example.com",
    ]);
    expect(clusters[0].moduleTypes).toEqual([
      ModulesEnum.PASSWORD,
      ModulesEnum.URL,
      ModulesEnum.USERNAME,
    ]);
  });
});

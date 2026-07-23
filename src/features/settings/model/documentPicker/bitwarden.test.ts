import { describe, expect, it } from "vitest";

import ModulesEnum from "../../../vault/model/ModulesEnum";
import importBitwarden from "./bitwarden";

describe("importBitwarden", () => {
  it("maps common Bitwarden JSON items to ClavisPass modules", () => {
    const result = importBitwarden(
      JSON.stringify({
        encrypted: false,
        folders: [{ id: "folder-1", name: "Work" }],
        items: [
          {
            name: "Example",
            type: 1,
            favorite: true,
            folderId: "folder-1",
            creationDate: "2026-01-01T10:00:00.000Z",
            revisionDate: "2026-01-02T10:00:00.000Z",
            notes: "private note",
            login: {
              username: "alice",
              password: "secret",
              totp: "JBSWY3DPEHPK3PXP",
              uris: [{ uri: "https://example.com" }, { uri: "https://app.example.com" }],
            },
            fields: [{ name: "Customer", value: "ACME", type: 0 }],
          },
          {
            name: "Identity",
            type: 4,
            identity: {
              firstName: "Ada",
              lastName: "Lovelace",
              email: "ada@example.com",
              phone: "+49 123",
              address1: "Main St 1",
              city: "Berlin",
              company: "Analytical Engines",
              passportNumber: "P123",
              passportExpirationDate: "2031-05-01T00:00:00.000Z",
            },
          },
          {
            name: "Card",
            type: 3,
            card: {
              cardholderName: "Ada Lovelace",
              brand: "Visa",
              number: "4111111111111111",
              expMonth: "12",
              expYear: "2030",
              code: "123",
            },
          },
        ],
      }),
    );

    expect(result.folders).toHaveLength(1);
    expect(result.values).toHaveLength(3);
    expect(result.values[0].folder?.name).toBe("Work");
    expect(result.values[0].fav).toBe(true);
    expect(
      result.values[0].modules.filter((m) => m.module === ModulesEnum.URL),
    ).toHaveLength(2);
    expect(result.values[0].modules.some((m) => m.module === ModulesEnum.TOTP)).toBe(true);
    expect(result.values[1].modules.some((m) => m.module === ModulesEnum.PERSON)).toBe(true);
    expect(result.values[1].modules.some((m) => m.module === ModulesEnum.ADDRESS)).toBe(true);
    expect(result.values[1].modules.some((m) => m.module === ModulesEnum.COMPANY)).toBe(true);
    expect(result.values[1].modules.some((m) => m.module === ModulesEnum.DOCUMENT)).toBe(true);
    expect(result.values[1].modules.some((m) => m.module === ModulesEnum.EXPIRY)).toBe(true);
    expect(result.values[2].modules.some((m) => m.module === ModulesEnum.CREDIT_CARD)).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { MODULE_ICON } from "../model/ModuleIconsEnum";
import ModulesEnum from "../model/ModulesEnum";
import type ValuesType from "../model/ValuesType";
import { getValueIcon } from "./getValueIcon";

function entry(modules: ValuesType["modules"]): Pick<ValuesType, "modules"> {
  return { modules };
}

describe("getValueIcon", () => {
  it("uses specific icons for high-signal module types", () => {
    expect(
      getValueIcon(
        entry([{ id: "wifi-1", module: ModulesEnum.WIFI, value: "" } as any]),
      ),
    ).toBe(MODULE_ICON[ModulesEnum.WIFI]);
    expect(
      getValueIcon(
        entry([{ id: "key-1", module: ModulesEnum.KEY, value: "" } as any]),
      ),
    ).toBe(MODULE_ICON[ModulesEnum.KEY]);
    expect(
      getValueIcon(
        entry([{ id: "task-1", module: ModulesEnum.TASK, value: "" } as any]),
      ),
    ).toBe("checkbox-multiple-marked");
    expect(
      getValueIcon(
        entry([
          {
            id: "card-1",
            module: ModulesEnum.DIGITAL_CARD,
            value: "",
          } as any,
        ]),
      ),
    ).toBe("credit-card-multiple");
    expect(
      getValueIcon(
        entry([{ id: "pin-1", module: ModulesEnum.PIN, value: "" } as any]),
      ),
    ).toBe(MODULE_ICON[ModulesEnum.PIN]);
    expect(
      getValueIcon(
        entry([{ id: "email-1", module: ModulesEnum.E_MAIL, value: "" } as any]),
      ),
    ).toBe(MODULE_ICON[ModulesEnum.E_MAIL]);
    expect(
      getValueIcon(
        entry([
          { id: "username-1", module: ModulesEnum.USERNAME, value: "" } as any,
        ]),
      ),
    ).toBe(MODULE_ICON[ModulesEnum.USERNAME]);
    expect(
      getValueIcon(
        entry([
          {
            id: "phone-1",
            module: ModulesEnum.PHONE_NUMBER,
            value: "",
          } as any,
        ]),
      ),
    ).toBe(MODULE_ICON[ModulesEnum.PHONE_NUMBER]);
    expect(
      getValueIcon(
        entry([{ id: "totp-1", module: ModulesEnum.TOTP, value: "" } as any]),
      ),
    ).toBe(MODULE_ICON[ModulesEnum.TOTP]);
    expect(
      getValueIcon(
        entry([{ id: "expiry-1", module: ModulesEnum.EXPIRY, value: "" } as any]),
      ),
    ).toBe(MODULE_ICON[ModulesEnum.EXPIRY]);
    expect(
      getValueIcon(
        entry([
          {
            id: "recovery-1",
            module: ModulesEnum.RECOVERY_CODES,
            value: "",
          } as any,
        ]),
      ),
    ).toBe(MODULE_ICON[ModulesEnum.RECOVERY_CODES]);
    expect(
      getValueIcon(
        entry([
          {
            id: "custom-1",
            module: ModulesEnum.CUSTOM_FIELD,
            value: "",
          } as any,
        ]),
      ),
    ).toBe(MODULE_ICON[ModulesEnum.CUSTOM_FIELD]);
  });

  it("only treats entries as notes when all modules are notes", () => {
    expect(
      getValueIcon(
        entry([{ id: "note-1", module: ModulesEnum.NOTE, value: "" } as any]),
      ),
    ).toBe(MODULE_ICON[ModulesEnum.NOTE]);
    expect(
      getValueIcon(
        entry([
          { id: "note-1", module: ModulesEnum.NOTE, value: "" } as any,
          {
            id: "password-1",
            module: ModulesEnum.PASSWORD,
            value: "",
          } as any,
        ]),
      ),
    ).toBe("lock");
  });

  it("only uses simple field icons when all modules are the same simple field", () => {
    const passwordModule = {
      id: "password-1",
      module: ModulesEnum.PASSWORD,
      value: "",
    } as any;

    expect(
      getValueIcon(
        entry([
          { id: "pin-1", module: ModulesEnum.PIN, value: "" } as any,
          passwordModule,
        ]),
      ),
    ).toBe("lock");
    expect(
      getValueIcon(
        entry([
          { id: "email-1", module: ModulesEnum.E_MAIL, value: "" } as any,
          passwordModule,
        ]),
      ),
    ).toBe("lock");
    expect(
      getValueIcon(
        entry([
          { id: "username-1", module: ModulesEnum.USERNAME, value: "" } as any,
          passwordModule,
        ]),
      ),
    ).toBe("lock");
    expect(
      getValueIcon(
        entry([
          {
            id: "phone-1",
            module: ModulesEnum.PHONE_NUMBER,
            value: "",
          } as any,
          passwordModule,
        ]),
      ),
    ).toBe("lock");
  });

  it("uses the TOTP icon for TOTP entries with optional recovery codes only", () => {
    expect(
      getValueIcon(
        entry([
          { id: "totp-1", module: ModulesEnum.TOTP, value: "" } as any,
          {
            id: "recovery-1",
            module: ModulesEnum.RECOVERY_CODES,
            value: "",
          } as any,
        ]),
      ),
    ).toBe(MODULE_ICON[ModulesEnum.TOTP]);
    expect(
      getValueIcon(
        entry([
          { id: "totp-1", module: ModulesEnum.TOTP, value: "" } as any,
          {
            id: "password-1",
            module: ModulesEnum.PASSWORD,
            value: "",
          } as any,
        ]),
      ),
    ).toBe("lock");
  });

  it("keeps normal password entries on the neutral lock icon", () => {
    expect(
      getValueIcon(
        entry([
          {
            id: "password-1",
            module: ModulesEnum.PASSWORD,
            value: "",
          } as any,
        ]),
      ),
    ).toBe("lock");
  });

  it("keeps URL-only entries on the neutral lock icon", () => {
    expect(
      getValueIcon(
        entry([{ id: "url-1", module: ModulesEnum.URL, value: "" } as any]),
      ),
    ).toBe("lock");
  });
});

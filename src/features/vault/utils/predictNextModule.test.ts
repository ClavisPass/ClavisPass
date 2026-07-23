import { describe, expect, it } from "vitest";
import ModulesEnum from "../model/ModulesEnum";
import { ModuleType } from "../model/ModulesType";
import predictNextModule from "./predictNextModule";

function module(module: ModulesEnum): ModuleType {
  return {
    id: module,
    module,
  } as ModuleType;
}

describe("predictNextModule", () => {
  it("keeps the existing login flow", () => {
    expect(predictNextModule([module(ModulesEnum.USERNAME)])).toBe(
      ModulesEnum.PASSWORD,
    );
    expect(
      predictNextModule([
        module(ModulesEnum.E_MAIL),
        module(ModulesEnum.PASSWORD),
      ]),
    ).toBe(ModulesEnum.URL);
    expect(
      predictNextModule([
        module(ModulesEnum.E_MAIL),
        module(ModulesEnum.PASSWORD),
        module(ModulesEnum.URL),
      ]),
    ).toBe(ModulesEnum.NOTE);
  });

  it("suggests identity follow-up modules", () => {
    expect(predictNextModule([module(ModulesEnum.PERSON)])).toBe(
      ModulesEnum.ADDRESS,
    );
    expect(
      predictNextModule([module(ModulesEnum.PERSON), module(ModulesEnum.ADDRESS)]),
    ).toBe(ModulesEnum.PHONE_NUMBER);
    expect(
      predictNextModule([
        module(ModulesEnum.PERSON),
        module(ModulesEnum.ADDRESS),
        module(ModulesEnum.PHONE_NUMBER),
      ]),
    ).toBe(ModulesEnum.E_MAIL);
  });

  it("suggests document expiry and attachment follow-ups", () => {
    expect(predictNextModule([module(ModulesEnum.DOCUMENT)])).toBe(
      ModulesEnum.EXPIRY,
    );
    expect(
      predictNextModule([
        module(ModulesEnum.DOCUMENT),
        module(ModulesEnum.EXPIRY),
      ]),
    ).toBe(ModulesEnum.ATTACHMENT);
    expect(
      predictNextModule([module(ModulesEnum.DOCUMENT), module(ModulesEnum.NOTE)]),
    ).toBeNull();
  });

  it("suggests notes and expiry for related modules", () => {
    expect(predictNextModule([module(ModulesEnum.COMPANY)])).toBe(
      ModulesEnum.ADDRESS,
    );
    expect(predictNextModule([module(ModulesEnum.ATTACHMENT)])).toBe(
      ModulesEnum.NOTE,
    );
    expect(predictNextModule([module(ModulesEnum.RECOVERY_CODES)])).toBe(
      ModulesEnum.NOTE,
    );
    expect(predictNextModule([module(ModulesEnum.WIFI)])).toBe(
      ModulesEnum.NOTE,
    );
    expect(predictNextModule([module(ModulesEnum.CREDIT_CARD)])).toBe(
      ModulesEnum.EXPIRY,
    );
    expect(predictNextModule([module(ModulesEnum.DIGITAL_CARD)])).toBe(
      ModulesEnum.EXPIRY,
    );
  });
});

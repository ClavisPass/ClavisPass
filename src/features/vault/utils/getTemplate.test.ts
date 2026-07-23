import { describe, expect, it } from "vitest";
import ModulesEnum from "../model/ModulesEnum";
import TemplateEnum from "../model/TemplateEnum";
import getTemplate from "./getTemplate";

function modules(template: TemplateEnum) {
  return getTemplate(template).modules.map((module) => module.module);
}

describe("getTemplate", () => {
  it("creates identity template modules", () => {
    expect(modules(TemplateEnum.IDENTITY)).toEqual([
      ModulesEnum.PERSON,
      ModulesEnum.ADDRESS,
      ModulesEnum.PHONE_NUMBER,
      ModulesEnum.E_MAIL,
      ModulesEnum.COMPANY,
    ]);
  });

  it("creates document template modules", () => {
    expect(modules(TemplateEnum.DOCUMENT)).toEqual([
      ModulesEnum.DOCUMENT,
      ModulesEnum.EXPIRY,
      ModulesEnum.ATTACHMENT,
      ModulesEnum.NOTE,
    ]);
  });

  it("creates credit card template modules", () => {
    expect(modules(TemplateEnum.CREDIT_CARD)).toEqual([
      ModulesEnum.CREDIT_CARD,
      ModulesEnum.EXPIRY,
      ModulesEnum.NOTE,
    ]);
  });

  it("creates bank account template modules", () => {
    expect(modules(TemplateEnum.BANK_ACCOUNT)).toEqual([
      ModulesEnum.TITLE,
      ModulesEnum.URL,
      ModulesEnum.USERNAME,
      ModulesEnum.PASSWORD,
      ModulesEnum.NOTE,
    ]);
  });
});

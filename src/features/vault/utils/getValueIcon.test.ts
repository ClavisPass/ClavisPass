import { describe, expect, it } from "vitest";
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
    ).toBe("wifi");
    expect(
      getValueIcon(
        entry([{ id: "key-1", module: ModulesEnum.KEY, value: "" } as any]),
      ),
    ).toBe("key-variant");
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
  });

  it("only treats entries as notes when all modules are notes", () => {
    expect(
      getValueIcon(
        entry([{ id: "note-1", module: ModulesEnum.NOTE, value: "" } as any]),
      ),
    ).toBe("note");
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
});

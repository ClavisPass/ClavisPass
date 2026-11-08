import { describe, expect, it } from "vitest";
import { moduleScrollOffset } from "./moduleScrollVisibility";

describe("module scroll visibility", () => {
  const base = {
    viewport: { top: 100, bottom: 400 },
    input: { top: 380, bottom: 424 },
    trailingBottom: 462,
    offset: 200,
    maxOffset: 900,
  };

  it("reveals the task and prediction together with the smallest scroll", () => {
    const next = moduleScrollOffset(base);
    expect(next).toBe(262);
    const delta = next - base.offset;
    expect(base.input.top - delta).toBeGreaterThanOrEqual(base.viewport.top);
    expect(base.trailingBottom - delta).toBeLessThanOrEqual(
      base.viewport.bottom,
    );
    expect(
      moduleScrollOffset({
        ...base,
        offset: next,
        input: {
          top: base.input.top - delta,
          bottom: base.input.bottom - delta,
        },
        trailingBottom: base.trailingBottom - delta,
      }),
    ).toBe(next);
  });

  it("does not scroll to the metadata/footer when both controls are already visible", () => {
    expect(
      moduleScrollOffset({
        ...base,
        input: { top: 240, bottom: 284 },
        trailingBottom: 322,
      }),
    ).toBe(200);
  });

  it("prioritizes the input when the keyboard leaves too little room for the group", () => {
    expect(
      moduleScrollOffset({ ...base, viewport: { top: 350, bottom: 400 } }),
    ).toBe(224);
  });

  it("does not alternate between the top and bottom of an oversized multiline task", () => {
    const input = { top: 150, bottom: 550 };
    const next = moduleScrollOffset({ ...base, input });
    expect(next).toBe(350);
    expect(
      moduleScrollOffset({
        ...base,
        offset: next,
        input: { top: 0, bottom: 400 },
      }),
    ).toBe(next);
  });

  it("clamps offsets to the real scroll range and can reveal an input above the viewport", () => {
    expect(moduleScrollOffset({ ...base, maxOffset: 220 })).toBe(220);
    expect(
      moduleScrollOffset({
        ...base,
        offset: 10,
        input: { top: 0, bottom: 44 },
        trailingBottom: 80,
      }),
    ).toBe(0);
  });
});

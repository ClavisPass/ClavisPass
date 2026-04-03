import type { FillDataResult } from "../shared/bridge";
import type { FillExecutionResult } from "../shared/types";
import { buildAutofillPlan } from "../shared/forms";

function emitInputEvents(input: HTMLInputElement): void {
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function setInputValue(input: HTMLInputElement, value: string): void {
  input.focus();
  const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  descriptor?.set?.call(input, value);

  if (!descriptor?.set) {
    input.value = value;
  }

  emitInputEvents(input);
}

export function executeFill(fillData: FillDataResult, root: ParentNode = document): FillExecutionResult {
  const plan = buildAutofillPlan(fillData, root);
  if (!plan) {
    return {
      status: "no_fields",
      detail: "No unambiguous login or TOTP fields were found on this page."
    };
  }

  const filledFields: Array<"username" | "password" | "totp"> = [];

  if (plan.usernameField && fillData.username) {
    setInputValue(plan.usernameField, fillData.username);
    filledFields.push("username");
  }

  if (plan.passwordField && fillData.password) {
    setInputValue(plan.passwordField, fillData.password);
    filledFields.push("password");
  }

  if (plan.totpField && fillData.totp) {
    setInputValue(plan.totpField, fillData.totp);
    filledFields.push("totp");
  }

  if (filledFields.length === 0) {
    return {
      status: "no_fields",
      detail: "No compatible visible fields were available for this entry."
    };
  }

  return {
    status: "filled",
    detail: `Filled ${filledFields.join(", ")} on the active page.`,
    filledFields
  };
}

import type { FillDataResult } from "../shared/bridge";
import type { FillExecutionResult } from "../shared/types";
import { buildAutofillPlan } from "../shared/forms";

interface FillTarget {
  kind: "username" | "password" | "totp";
  input: HTMLInputElement;
  value: string;
}

interface FillSnapshot {
  input: HTMLInputElement;
  previousValue: string;
}

export interface FillPreviewResult {
  result: FillExecutionResult;
  restore: () => void;
}

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

function collectFillTargets(fillData: FillDataResult, root: ParentNode): FillTarget[] | null {
  const plan = buildAutofillPlan(fillData, root);
  if (!plan) {
    return null;
  }

  const targets: FillTarget[] = [];

  if (plan.usernameField && fillData.username) {
    targets.push({
      kind: "username",
      input: plan.usernameField,
      value: fillData.username
    });
  }

  if (plan.passwordField && fillData.password) {
    targets.push({
      kind: "password",
      input: plan.passwordField,
      value: fillData.password
    });
  }

  if (plan.totpField && fillData.totp) {
    targets.push({
      kind: "totp",
      input: plan.totpField,
      value: fillData.totp
    });
  }

  return targets;
}

function buildNoFieldsResult(): FillExecutionResult {
  return {
    status: "no_fields",
    detail: "No compatible visible fields were available for this entry."
  };
}

function applyTargets(targets: FillTarget[]): FillExecutionResult {
  const filledFields: Array<"username" | "password" | "totp"> = [];

  for (const target of targets) {
    setInputValue(target.input, target.value);
    filledFields.push(target.kind);
  }

  if (filledFields.length === 0) {
    return buildNoFieldsResult();
  }

  return {
    status: "filled",
    detail: `Filled ${filledFields.join(", ")} on the active page.`,
    filledFields
  };
}

export function executeFill(fillData: FillDataResult, root: ParentNode = document): FillExecutionResult {
  const targets = collectFillTargets(fillData, root);
  if (!targets) {
    return {
      status: "no_fields",
      detail: "No unambiguous login or TOTP fields were found on this page."
    };
  }

  return applyTargets(targets);
}

export function previewFill(fillData: FillDataResult, root: ParentNode = document): FillPreviewResult {
  const targets = collectFillTargets(fillData, root);
  if (!targets) {
    return {
      result: {
        status: "no_fields",
        detail: "No unambiguous login or TOTP fields were found on this page."
      },
      restore: () => {
      }
    };
  }

  const snapshots: FillSnapshot[] = targets.map((target) => ({
    input: target.input,
    previousValue: target.input.value
  }));

  const result = applyTargets(targets);

  if (result.status !== "filled") {
    return {
      result,
      restore: () => {
      }
    };
  }

  return {
    result,
    restore: () => {
      for (const snapshot of snapshots) {
        setInputValue(snapshot.input, snapshot.previousValue);
      }
    }
  };
}

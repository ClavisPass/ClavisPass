import type { DetectedForm, FormFieldKind, FormFieldSnapshot, SavePromptCandidate } from "./types";

const USERNAME_HINTS = ["user", "email", "login", "identifier", "account", "member"];
const PASSWORD_HINTS = ["password", "pass", "pwd", "secret"];
const TOTP_HINTS = ["totp", "otp", "one-time", "verification", "2fa", "authenticator", "code"];
const TRICK_FIELD_HINTS = ["honeypot", "trap", "fake", "decoy", "website", "confirm_email"];

export interface FillableCredentialData {
  username?: string;
  password?: string;
  totp?: string;
}

export interface FieldClassificationResult {
  kind?: FormFieldKind;
  score: number;
  reasons: string[];
}

interface ClassifiedField {
  element: HTMLInputElement;
  snapshot: FormFieldSnapshot;
  classification: FieldClassificationResult;
}

interface FormCandidate {
  form?: HTMLFormElement;
  detectedForm: DetectedForm;
  usernameField?: ClassifiedField;
  passwordField?: ClassifiedField;
  totpField?: ClassifiedField;
  passwordFields: ClassifiedField[];
}

export interface AutofillPlan {
  formId: string;
  usernameField?: HTMLInputElement;
  passwordField?: HTMLInputElement;
  totpField?: HTMLInputElement;
  reason: string;
}

function normalizeText(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function collectLabelText(input: HTMLInputElement): string {
  const labels = input.labels ? [...input.labels] : [];
  return labels.map((label) => label.textContent?.trim() ?? "").join(" ");
}

function buildFieldKey(input: HTMLInputElement, index: number): string {
  return input.name || input.id || `${input.type || "text"}:${index}`;
}

function buildFieldText(snapshot: FormFieldSnapshot): string {
  return [
    snapshot.name,
    snapshot.id,
    snapshot.autocomplete,
    snapshot.placeholder,
    snapshot.labelText,
    snapshot.ariaLabel
  ]
    .join(" ")
    .toLowerCase();
}

function matchesAnyHint(text: string, hints: string[]): boolean {
  return hints.some((hint) => text.includes(hint));
}

export function isVisibleFieldCandidate(input: HTMLInputElement): boolean {
  const style = window.getComputedStyle(input);
  const rect = input.getBoundingClientRect();

  return (
    style.visibility !== "hidden" &&
    style.display !== "none" &&
    !input.disabled &&
    input.type !== "hidden" &&
    !input.hidden &&
    rect.width >= 24 &&
    rect.height >= 16 &&
    rect.bottom >= 0 &&
    rect.right >= 0
  );
}

export function isSuspiciousField(snapshot: FormFieldSnapshot): boolean {
  const text = buildFieldText(snapshot);

  if (snapshot.hidden) {
    return true;
  }

  if (!snapshot.visible && snapshot.type !== "password") {
    return true;
  }

  if (matchesAnyHint(text, TRICK_FIELD_HINTS)) {
    return true;
  }

  if (snapshot.readOnly && snapshot.type !== "password") {
    return true;
  }

  return false;
}

export function createFieldSnapshot(input: HTMLInputElement, index = 0): FormFieldSnapshot {
  const snapshot: FormFieldSnapshot = {
    key: buildFieldKey(input, index),
    type: normalizeText(input.type) || "text",
    name: normalizeText(input.name),
    id: normalizeText(input.id),
    autocomplete: normalizeText(input.autocomplete),
    placeholder: normalizeText(input.placeholder),
    labelText: normalizeText(collectLabelText(input)),
    ariaLabel: normalizeText(input.getAttribute("aria-label")),
    inputMode: normalizeText(input.inputMode),
    maxLength: input.maxLength > 0 ? input.maxLength : undefined,
    disabled: input.disabled,
    readOnly: input.readOnly,
    hidden: input.hidden || input.type === "hidden",
    visible: isVisibleFieldCandidate(input),
    suspicious: false
  };

  snapshot.suspicious = isSuspiciousField(snapshot);
  return snapshot;
}

export function classifyFieldSnapshot(snapshot: FormFieldSnapshot): FieldClassificationResult {
  const text = buildFieldText(snapshot);
  const reasons: string[] = [];

  if (snapshot.suspicious || snapshot.disabled) {
    return { score: 0, reasons: ["ignored-suspicious"] };
  }

  if (
    snapshot.type === "password" ||
    snapshot.autocomplete === "current-password" ||
    snapshot.autocomplete === "new-password" ||
    matchesAnyHint(text, PASSWORD_HINTS)
  ) {
    reasons.push("password-signals");
    return { kind: "password", score: 100, reasons };
  }

  const totpScore =
    (snapshot.autocomplete === "one-time-code" ? 90 : 0) +
    (matchesAnyHint(text, TOTP_HINTS) ? 40 : 0) +
    ((snapshot.inputMode === "numeric" || snapshot.type === "tel" || snapshot.type === "number") ? 15 : 0) +
    (snapshot.maxLength && snapshot.maxLength <= 8 ? 10 : 0);

  if (totpScore >= 50) {
    reasons.push("totp-signals");
    return { kind: "totp", score: totpScore, reasons };
  }

  const usernameScore =
    ((snapshot.type === "email" || snapshot.autocomplete === "email") ? 80 : 0) +
    (snapshot.autocomplete === "username" ? 90 : 0) +
    (matchesAnyHint(text, USERNAME_HINTS) ? 35 : 0) +
    ((snapshot.type === "text" || snapshot.type === "search") ? 5 : 0);

  if (usernameScore >= 40) {
    reasons.push("username-signals");
    return { kind: "username", score: usernameScore, reasons };
  }

  return { score: 0, reasons: ["no-strong-signal"] };
}

function chooseBestField(fields: ClassifiedField[], kind: FormFieldKind): ClassifiedField | undefined {
  return fields
    .filter((field) => field.classification.kind === kind)
    .sort((left, right) => {
      const visibilityBonusLeft = left.snapshot.visible ? 20 : 0;
      const visibilityBonusRight = right.snapshot.visible ? 20 : 0;
      return right.classification.score + visibilityBonusRight - (left.classification.score + visibilityBonusLeft);
    })[0];
}

function buildFormId(form: HTMLFormElement, index: number): string {
  const action = form.getAttribute("action") ?? "self";
  return `${index}:${action}`;
}

function getActionOrigin(form: HTMLFormElement): string {
  const action = form.getAttribute("action");
  return action ? new URL(action, window.location.href).origin : window.location.origin;
}

function buildDetachedContainer(root: ParentNode): HTMLInputElement[] {
  const inputs = [...root.querySelectorAll("input")].filter(
    (input): input is HTMLInputElement => input instanceof HTMLInputElement
  );

  return inputs.filter((input) => !input.form);
}

function collectFormInputs(form: HTMLFormElement): ClassifiedField[] {
  return [...form.querySelectorAll("input")]
    .filter((input): input is HTMLInputElement => input instanceof HTMLInputElement)
    .map((input, index) => {
      const snapshot = createFieldSnapshot(input, index);
      return {
        element: input,
        snapshot,
        classification: classifyFieldSnapshot(snapshot)
      } satisfies ClassifiedField;
    });
}

function detectFormFields(form: HTMLFormElement, index: number): FormCandidate {
  const fields = collectFormInputs(form);
  const usernameField = chooseBestField(fields, "username");
  const passwordField = chooseBestField(fields, "password");
  const totpField = chooseBestField(fields, "totp");
  const passwordFields = fields.filter((field) => field.classification.kind === "password");

  return {
    form,
    usernameField,
    passwordField,
    totpField,
    passwordFields,
    detectedForm: {
      formId: buildFormId(form, index),
      actionOrigin: getActionOrigin(form),
      fieldMap: {
        username: usernameField?.snapshot.key,
        password: passwordField?.snapshot.key,
        totp: totpField?.snapshot.key
      },
      hasPasswordField: Boolean(passwordField),
      hasVisibleUsernameCandidate: Boolean(usernameField?.snapshot.visible),
      visibleFieldCount: fields.filter((field) => field.snapshot.visible && !field.snapshot.suspicious).length,
      totalRelevantFieldCount: fields.filter((field) => field.classification.kind).length
    }
  };
}

function detectDetachedFields(root: ParentNode): FormCandidate | null {
  const inputs = buildDetachedContainer(root);
  if (inputs.length === 0) {
    return null;
  }

  const fields = inputs.map((input, index) => {
    const snapshot = createFieldSnapshot(input, index);
    return {
      element: input,
      snapshot,
      classification: classifyFieldSnapshot(snapshot)
    } satisfies ClassifiedField;
  });

  const usernameField = chooseBestField(fields, "username");
  const passwordField = chooseBestField(fields, "password");
  const totpField = chooseBestField(fields, "totp");
  const passwordFields = fields.filter((field) => field.classification.kind === "password");

  if (!passwordField && !totpField) {
    return null;
  }

  return {
    usernameField,
    passwordField,
    totpField,
    passwordFields,
    detectedForm: {
      formId: "detached",
      actionOrigin: window.location.origin,
      fieldMap: {
        username: usernameField?.snapshot.key,
        password: passwordField?.snapshot.key,
        totp: totpField?.snapshot.key
      },
      hasPasswordField: Boolean(passwordField),
      hasVisibleUsernameCandidate: Boolean(usernameField?.snapshot.visible),
      visibleFieldCount: fields.filter((field) => field.snapshot.visible && !field.snapshot.suspicious).length,
      totalRelevantFieldCount: fields.filter((field) => field.classification.kind).length
    }
  };
}

function isLikelyPasswordChangeForm(candidate: FormCandidate): boolean {
  const visiblePasswordFields = candidate.passwordFields.filter((field) => field.snapshot.visible);
  if (visiblePasswordFields.length < 2) {
    return false;
  }

  const passwordSignals = visiblePasswordFields.map((field) => buildFieldText(field.snapshot));
  const hasCurrentPasswordSignal = visiblePasswordFields.some(
    (field) => field.snapshot.autocomplete === "current-password" || buildFieldText(field.snapshot).includes("current")
  );
  const hasNewPasswordSignal = visiblePasswordFields.some(
    (field) =>
      field.snapshot.autocomplete === "new-password" ||
      buildFieldText(field.snapshot).includes("new") ||
      buildFieldText(field.snapshot).includes("confirm")
  );

  return hasCurrentPasswordSignal || hasNewPasswordSignal || passwordSignals.length >= 2;
}

export function detectLoginForms(root: ParentNode = document): DetectedForm[] {
  const forms = [...root.querySelectorAll("form")];

  return forms
    .map((form, index) => detectFormFields(form, index).detectedForm)
    .filter((form) => form.hasPasswordField || form.fieldMap.totp);
}

function scoreFormCandidate(candidate: FormCandidate, entry: FillableCredentialData): number {
  let score = 0;

  if (candidate.passwordField) {
    score += entry.password ? 100 : 0;
  }

  if (candidate.usernameField) {
    score += entry.username ? 60 : 0;
  }

  if (candidate.usernameField && candidate.passwordField) {
    score += 30;
  }

  if (candidate.totpField) {
    score += entry.totp ? 35 : 0;
  }

  score += candidate.detectedForm.visibleFieldCount * 2;
  return score;
}

export function buildAutofillPlan(entry: FillableCredentialData, root: ParentNode = document): AutofillPlan | null {
  const forms = [...root.querySelectorAll("form")];
  const detachedCandidate = detectDetachedFields(root);
  const candidates = [
    ...forms.map((form, index) => detectFormFields(form, index)),
    ...(detachedCandidate ? [detachedCandidate] : [])
  ]
    .filter((candidate) => candidate.passwordField || candidate.totpField)
    .filter((candidate) => !isLikelyPasswordChangeForm(candidate))
    .map((candidate) => ({ candidate, score: scoreFormCandidate(candidate, entry) }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score);

  if (candidates.length === 0) {
    return null;
  }

  if (candidates.length > 1 && candidates[0].score === candidates[1].score) {
    return null;
  }

  const best = candidates[0].candidate;
  return {
    formId: best.detectedForm.formId,
    usernameField: best.usernameField?.element,
    passwordField: best.passwordField?.element,
    totpField: best.totpField?.element,
    reason: `Selected form ${best.detectedForm.formId} with score ${candidates[0].score}.`
  };
}

export function extractSavePromptCandidate(form: HTMLFormElement, pageUrl: string): SavePromptCandidate | null {
  const detected = detectFormFields(form, 0);
  if (isLikelyPasswordChangeForm(detected)) {
    return null;
  }

  const fields = collectFormInputs(form);
  const usernameField = chooseBestField(fields, "username");
  const passwordField = chooseBestField(fields, "password");

  const usernameValue = usernameField?.element.value.trim();
  const passwordValue = passwordField?.element.value;

  if (!passwordValue || !passwordField?.snapshot.visible) {
    return null;
  }

  return {
    url: pageUrl,
    username: usernameValue || undefined,
    password: passwordValue
  };
}

export const formClassificationTestHelpers = {
  classifyFieldSnapshot,
  isSuspiciousField,
  buildFieldText
};

import { getNormalizedDomainFromUrl } from "../shared/domain";
import type {
  DomainAutofillMode,
  DomainAutofillPolicy,
  InlineAutofillPreferenceResult
} from "../shared/types";

const LEGACY_DISABLED_HOSTS_STORAGE_KEY = "clavispass.inlineAutofillDisabledHosts.v1";
const STORAGE_KEY = "clavispass.autofillDomainPolicies.v1";

type DomainPolicyStore = Record<string, Partial<DomainAutofillPolicy>>;

const DEFAULT_POLICY: DomainAutofillPolicy = {
  mode: "enabled",
  savePromptDisabled: false
};

function normalizeHost(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeMode(value: unknown): DomainAutofillMode {
  return value === "hide-inline" || value === "badge-only" || value === "disabled"
    ? value
    : "enabled";
}

function normalizePolicy(value: Partial<DomainAutofillPolicy> | undefined): DomainAutofillPolicy {
  return {
    mode: normalizeMode(value?.mode),
    savePromptDisabled: value?.savePromptDisabled === true
  };
}

function buildPreferenceResult(
  normalizedHost: string | undefined,
  policy: DomainAutofillPolicy,
  isSupported = true
): InlineAutofillPreferenceResult {
  return {
    isSupported,
    normalizedHost,
    policy,
    inlineAutofillDisabled: policy.mode !== "enabled",
    autofillDisabled: policy.mode === "disabled" || policy.mode === "badge-only",
    popupSuggestionsDisabled: policy.mode === "badge-only",
    savePromptDisabled: policy.savePromptDisabled
  };
}

async function writePolicyStore(policies: DomainPolicyStore): Promise<void> {
  const sorted: DomainPolicyStore = {};
  for (const host of Object.keys(policies).sort()) {
    const policy = normalizePolicy(policies[host]);
    if (policy.mode === DEFAULT_POLICY.mode && policy.savePromptDisabled === DEFAULT_POLICY.savePromptDisabled) {
      continue;
    }

    sorted[host] = policy;
  }

  await chrome.storage.local.set({ [STORAGE_KEY]: sorted });
}

async function readPolicyStore(): Promise<DomainPolicyStore> {
  const stored = (await chrome.storage.local.get(STORAGE_KEY))[STORAGE_KEY];
  const policies: DomainPolicyStore =
    stored && typeof stored === "object" && !Array.isArray(stored)
      ? stored as DomainPolicyStore
      : {};

  const legacyStored = (await chrome.storage.local.get(LEGACY_DISABLED_HOSTS_STORAGE_KEY))[LEGACY_DISABLED_HOSTS_STORAGE_KEY];
  if (Array.isArray(legacyStored)) {
    for (const item of legacyStored) {
      if (typeof item !== "string") {
        continue;
      }

      const host = normalizeHost(item);
      if (host && !policies[host]) {
        policies[host] = {
          mode: "hide-inline",
          savePromptDisabled: false
        };
      }
    }

    await writePolicyStore(policies);
    await chrome.storage.local.remove(LEGACY_DISABLED_HOSTS_STORAGE_KEY);
  }

  return policies;
}

export async function getInlineAutofillPreferenceForUrl(
  url: string
): Promise<InlineAutofillPreferenceResult> {
  const normalizedHost = getNormalizedDomainFromUrl(url);
  if (!normalizedHost) {
    return buildPreferenceResult(undefined, DEFAULT_POLICY, false);
  }

  const policies = await readPolicyStore();
  return buildPreferenceResult(normalizedHost, normalizePolicy(policies[normalizedHost]));
}

export async function setInlineAutofillDisabledForHost(
  normalizedHost: string,
  disabled: boolean
): Promise<InlineAutofillPreferenceResult> {
  return updateAutofillPolicyForHost(normalizedHost, {
    mode: disabled ? "hide-inline" : "enabled"
  });
}

export async function updateAutofillPolicyForHost(
  normalizedHost: string,
  patch: Partial<DomainAutofillPolicy>
): Promise<InlineAutofillPreferenceResult> {
  const host = normalizeHost(normalizedHost);
  const policies = await readPolicyStore();
  const nextPolicy = normalizePolicy({
    ...normalizePolicy(policies[host]),
    ...patch
  });

  policies[host] = nextPolicy;
  await writePolicyStore(policies);

  return buildPreferenceResult(host, nextPolicy);
}

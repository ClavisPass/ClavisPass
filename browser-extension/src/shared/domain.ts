import type { EntrySuggestion, VaultEntry } from "./types";
import { getDomain, parse } from "tldts";

export function normalizeLookupHost(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\d*\./, "").replace(/\.+$/, "");
}

function normalizeHost(hostname: string): string {
  return normalizeLookupHost(hostname);
}

function safeUrl(input: string): URL | undefined {
  try {
    return new URL(input);
  } catch {
    return undefined;
  }
}

export function getNormalizedDomainFromUrl(input: string): string | undefined {
  const parsed = safeUrl(input);
  if (!parsed || (parsed.protocol !== "https:" && parsed.protocol !== "http:")) {
    return undefined;
  }

  return normalizeLookupHost(parsed.hostname);
}

function normalizeRpHost(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/\.+$/, "");
}

export function validateWebAuthnRpId(
  originRaw: string,
  rpIdRaw?: string
): import("./types").WebAuthnRpValidation {
  let origin: URL;

  try {
    origin = new URL(originRaw);
  } catch {
    return {
      status: "unsupported",
      detail: "The WebAuthn request origin could not be parsed."
    };
  }

  const originHost = normalizeRpHost(origin.hostname);
  const isLocalhost = originHost === "localhost";

  if (origin.origin !== originRaw ||
      (origin.protocol !== "https:" && !(origin.protocol === "http:" && isLocalhost))) {
    return {
      status: "unsupported",
      originHost,
      detail: "Passkey requests are only accepted from secure origins."
    };
  }

  const effectiveRpId = normalizeRpHost(rpIdRaw ?? origin.hostname);
  const validLabels = effectiveRpId.length <= 253 && effectiveRpId.split(".").every(
    (label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label)
  );
  const validDomain = effectiveRpId === "localhost" || (
    !parse(effectiveRpId).isIp && getDomain(effectiveRpId, { allowPrivateDomains: true }) !== null
  );
  if (!effectiveRpId || !validLabels || !validDomain) {
    return {
      status: "invalid",
      originHost,
      detail: "The WebAuthn request did not provide a usable RP ID."
    };
  }

  const matches = originHost === effectiveRpId || originHost.endsWith(`.${effectiveRpId}`);
  return {
    status: matches ? "valid" : "invalid",
    originHost,
    effectiveRpId,
    detail: matches
      ? "The RP ID matches the current page origin."
      : "The RP ID does not match the current page origin."
  };
}

function scoreUrlMatch(pageUrl: URL, candidateUrl: URL): number {
  const pageHost = normalizeHost(pageUrl.hostname);
  const candidateHost = normalizeHost(candidateUrl.hostname);

  if (pageHost === candidateHost) {
    return 100;
  }

  if (pageHost.endsWith(`.${candidateHost}`) || candidateHost.endsWith(`.${pageHost}`)) {
    return 70;
  }

  const pageParts = pageHost.split(".");
  const candidateParts = candidateHost.split(".");
  if (pageParts.at(-2) && pageParts.at(-2) === candidateParts.at(-2)) {
    return 45;
  }

  return 0;
}

export function buildEntrySuggestions(pageUrlRaw: string, entries: VaultEntry[]): EntrySuggestion[] {
  const pageUrl = safeUrl(pageUrlRaw);
  if (!pageUrl) {
    return [];
  }

  return entries
    .flatMap((entry) =>
      entry.urls.map((entryUrl) => {
        const parsedEntryUrl = safeUrl(entryUrl);
        const matchScore = parsedEntryUrl ? scoreUrlMatch(pageUrl, parsedEntryUrl) : 0;

        return {
          entryId: entry.id,
          title: entry.title,
          username: entry.username,
          matchedUrl: entryUrl,
          matchScore
        } satisfies EntrySuggestion;
      })
    )
    .filter((item) => item.matchScore > 0)
    .sort((left, right) => right.matchScore - left.matchScore);
}

export function searchEntries(
  entries: VaultEntry[],
  query: string,
  pageUrl?: string
): EntrySuggestion[] {
  const normalizedQuery = query.trim().toLowerCase();
  const baseSuggestions = pageUrl ? buildEntrySuggestions(pageUrl, entries) : [];
  const suggestionMap = new Map<string, EntrySuggestion>();

  for (const suggestion of baseSuggestions) {
    suggestionMap.set(suggestion.entryId, suggestion);
  }

  for (const entry of entries) {
    const haystack = `${entry.title} ${entry.username} ${entry.urls.join(" ")}`.toLowerCase();
    if (!normalizedQuery || haystack.includes(normalizedQuery)) {
      if (!suggestionMap.has(entry.id)) {
        suggestionMap.set(entry.id, {
          entryId: entry.id,
          title: entry.title,
          username: entry.username,
          matchedUrl: entry.urls[0] ?? "",
          matchScore: normalizedQuery ? 25 : 10
        });
      }
    }
  }

  return [...suggestionMap.values()].sort((left, right) => right.matchScore - left.matchScore);
}

import type { EntrySuggestion, VaultEntry } from "./types";

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

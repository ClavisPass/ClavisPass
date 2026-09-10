import type { SearchEntrySuggestion } from "../shared/bridge";
import type { AutofillEligibilityResult, DesktopBridgeStatusView } from "../shared/types";
import { getNormalizedDomainFromUrl } from "../shared/domain";
import type { DesktopBridgeService } from "./bridge";

const STORAGE_KEY = "clavispass.autofillDomainCache.v1";
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface DomainAutofillCacheEntry {
  normalizedHost: string;
  hasMatches: boolean;
  matchCount?: number;
  checkedAt: number;
}

type DomainAutofillCache = Record<string, DomainAutofillCacheEntry>;

async function readCache(): Promise<DomainAutofillCache> {
  const stored = (await chrome.storage.local.get(STORAGE_KEY))[STORAGE_KEY];
  return stored && typeof stored === "object" && !Array.isArray(stored)
    ? stored as DomainAutofillCache
    : {};
}

async function writeCache(cache: DomainAutofillCache): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: cache });
}

function isFresh(entry: DomainAutofillCacheEntry | undefined, now = Date.now()): boolean {
  return Boolean(entry && now - entry.checkedAt <= CACHE_TTL_MS);
}

function countPasswordSuggestions(suggestions: SearchEntrySuggestion[]): number {
  return suggestions.filter((item) => item.hasPassword).length;
}

function getCachedMatchCount(entry: DomainAutofillCacheEntry | undefined): number {
  if (!entry?.hasMatches) {
    return 0;
  }

  return typeof entry.matchCount === "number" ? entry.matchCount : 1;
}

export async function clearAutofillDomainCache(): Promise<void> {
  await chrome.storage.local.remove(STORAGE_KEY);
}

export async function rememberAutofillSuggestions(
  normalizedHost: string,
  suggestions: SearchEntrySuggestion[]
): Promise<void> {
  const cache = await readCache();
  const matchCount = countPasswordSuggestions(suggestions);
  cache[normalizedHost] = {
    normalizedHost,
    hasMatches: matchCount > 0,
    matchCount,
    checkedAt: Date.now()
  };

  await writeCache(cache);
}

export async function getCachedAutofillMatchCountForUrl(url: string): Promise<number | undefined> {
  const normalizedHost = getNormalizedDomainFromUrl(url);
  if (!normalizedHost) {
    return undefined;
  }

  const cache = await readCache();
  const cachedEntry = cache[normalizedHost];

  if (!cachedEntry) {
    return undefined;
  }

  return getCachedMatchCount(cachedEntry);
}

export async function getAutofillEligibilityForUrl(
  url: string,
  desktopBridge: DesktopBridgeService
): Promise<AutofillEligibilityResult> {
  const normalizedHost = getNormalizedDomainFromUrl(url);

  if (!normalizedHost) {
    return {
      isSupported: false,
      hasMatches: false,
      source: "none",
      detail: "No searchable domain could be derived from this page."
    };
  }

  const cache = await readCache();
  const cachedEntry = cache[normalizedHost];
  const cachedFresh = isFresh(cachedEntry);
  let status: DesktopBridgeStatusView | undefined;

  try {
    status = await desktopBridge.getDesktopBridgeStatus();
  } catch {
  }

  if (status?.state === "unpaired") {
    await clearAutofillDomainCache();
    return {
      isSupported: true,
      normalizedHost,
      hasMatches: false,
      source: "none",
      desktopState: status.state,
      appScheme: status.appScheme,
      detail: "Browser access is not trusted yet."
    };
  }

  if (status?.state === "ready") {
    try {
      const suggestions = await desktopBridge.searchDesktopEntriesByDomain(normalizedHost);
      const matchCount = countPasswordSuggestions(suggestions);
      await rememberAutofillSuggestions(normalizedHost, suggestions);

      return {
        isSupported: true,
        normalizedHost,
        hasMatches: matchCount > 0,
        matchCount,
        source: "desktop",
        desktopState: status.state,
        appScheme: status.appScheme,
        detail:
          matchCount > 0
            ? "Matching ClavisPass entries are available for this page."
            : "No matching ClavisPass entries are available for this page."
      };
    } catch {
      if (cachedEntry?.hasMatches) {
        const matchCount = getCachedMatchCount(cachedEntry);
        return {
          isSupported: true,
          normalizedHost,
          hasMatches: true,
          matchCount,
          source: cachedFresh ? "cache" : "stale-cache",
          desktopState: status.state,
          appScheme: status.appScheme,
          detail: "Cached ClavisPass matches are available for this page."
        };
      }
    }
  }

  if (cachedEntry?.hasMatches) {
    const matchCount = getCachedMatchCount(cachedEntry);
    return {
      isSupported: true,
      normalizedHost,
      hasMatches: true,
      matchCount,
      source: cachedFresh ? "cache" : "stale-cache",
      desktopState: status?.state,
      appScheme: status?.appScheme,
      detail: "Cached ClavisPass matches are available for this page."
    };
  }

  return {
    isSupported: true,
    normalizedHost,
    hasMatches: false,
    matchCount: 0,
    source: cachedEntry ? (cachedFresh ? "cache" : "stale-cache") : "none",
    desktopState: status?.state,
    appScheme: status?.appScheme,
    detail: cachedEntry
      ? "Cached ClavisPass matches are not available for this page."
      : "No cached ClavisPass match is available for this page."
  };
}

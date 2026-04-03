import type { ActiveDomainContext } from "../shared/types";

function sanitizeHost(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/\.+$/, "");
}

function normalizeLookupHost(hostname: string): string {
  return sanitizeHost(hostname).replace(/^www\d*\./, "");
}

function parseActiveDomain(url: string | undefined): ActiveDomainContext {
  if (!url) {
    return {
      isSupported: false,
      detail: "No active tab URL is available."
    };
  }

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
      return {
        isSupported: false,
        host: sanitizeHost(parsedUrl.hostname),
        detail: "This page does not expose a searchable website domain."
      };
    }

    const host = sanitizeHost(parsedUrl.hostname);
    const normalizedHost = normalizeLookupHost(parsedUrl.hostname);

    if (!normalizedHost) {
      return {
        isSupported: false,
        host,
        detail: "No searchable domain could be derived from the active tab."
      };
    }

    return {
      isSupported: true,
      host,
      normalizedHost,
      detail: "Domain ready for desktop suggestions."
    };
  } catch {
    return {
      isSupported: false,
      detail: "The active tab URL could not be parsed safely."
    };
  }
}

export async function getActiveDomainContext(): Promise<ActiveDomainContext> {
  const [activeTab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  });

  return parseActiveDomain(activeTab?.url);
}

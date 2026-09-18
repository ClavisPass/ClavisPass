import ModulesEnum from "../../vault/model/ModulesEnum";
import type ValuesType from "../../vault/model/ValuesType";

export type IdentityClusterEntry = {
  id: string;
  title: string;
  domains: string[];
  moduleTypes: ModulesEnum[];
  hasRisk: boolean;
};

export type IdentityCluster = {
  id: string;
  email: string;
  usernames: string[];
  domains: string[];
  moduleTypes: ModulesEnum[];
  entries: IdentityClusterEntry[];
  riskCount: number;
};

function normalizeSignal(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function getModuleValue(module: any) {
  return String(module?.value ?? "").trim();
}

function getEntrySignals(entry: ValuesType) {
  const emails = new Set<string>();
  const usernames = new Set<string>();

  for (const module of entry.modules ?? []) {
    if (module.module === ModulesEnum.E_MAIL) {
      const email = normalizeSignal((module as any).value);
      if (email.includes("@")) emails.add(email);
    }

    if (module.module === ModulesEnum.USERNAME) {
      const username = normalizeSignal((module as any).value);
      if (username) usernames.add(username);
    }
  }

  return {
    emails: [...emails],
    usernames: [...usernames],
  };
}

function getEntryDomains(entry: ValuesType) {
  const domains = new Set<string>();

  for (const module of entry.modules ?? []) {
    if (module.module !== ModulesEnum.URL) continue;

    const raw = getModuleValue(module);
    if (!raw) continue;

    try {
      const parsed = new URL(raw.includes("://") ? raw : `https://${raw}`);
      if (parsed.hostname) domains.add(parsed.hostname.replace(/^www\./, ""));
    } catch {
      const fallback = raw
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .split("/")[0]
        .trim();
      if (fallback) domains.add(fallback);
    }
  }

  return [...domains];
}

function getEntryModuleTypes(entry: ValuesType) {
  return sortUnique(
    (entry.modules ?? [])
      .map((module) => module.module as ModulesEnum)
      .filter((module) => module !== ModulesEnum.E_MAIL),
  ) as ModulesEnum[];
}

function getEntryPasswordValues(entry: ValuesType) {
  return (entry.modules ?? [])
    .filter((module) => module.module === ModulesEnum.PASSWORD)
    .map((module) => getModuleValue(module))
    .filter(Boolean);
}

function buildPasswordUseCounts(values: ValuesType[]) {
  const counts = new Map<string, number>();

  for (const entry of values) {
    for (const password of getEntryPasswordValues(entry)) {
      counts.set(password, (counts.get(password) ?? 0) + 1);
    }
  }

  return counts;
}

function entryHasSimplePasswordRisk(
  entry: ValuesType,
  passwordUseCounts: Map<string, number>,
) {
  return getEntryPasswordValues(entry).some(
    (password) => password.length < 12 || (passwordUseCounts.get(password) ?? 0) > 1,
  );
}

function sortUnique(values: Iterable<string>) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function deriveIdentityClusters(values: ValuesType[]): IdentityCluster[] {
  const passwordUseCounts = buildPasswordUseCounts(values);
  const clusters = new Map<string, IdentityCluster>();

  for (const entry of values ?? []) {
    const signals = getEntrySignals(entry);
    if (signals.emails.length === 0) continue;

    const domains = getEntryDomains(entry);
    const moduleTypes = getEntryModuleTypes(entry);
    const hasRisk = entryHasSimplePasswordRisk(entry, passwordUseCounts);

    for (const email of signals.emails) {
      const clusterId = `email:${email}`;
      const existing =
        clusters.get(clusterId) ??
        ({
          id: clusterId,
          email,
          usernames: [],
          domains: [],
          moduleTypes: [],
          entries: [],
          riskCount: 0,
        } satisfies IdentityCluster);

      existing.usernames = sortUnique([
        ...existing.usernames,
        ...signals.usernames,
      ]);
      existing.domains = sortUnique([...existing.domains, ...domains]);
      existing.moduleTypes = sortUnique([
        ...existing.moduleTypes,
        ...moduleTypes,
      ]) as ModulesEnum[];
      existing.entries.push({
        id: entry.id,
        title: entry.title,
        domains,
        moduleTypes,
        hasRisk,
      });
      if (hasRisk) existing.riskCount += 1;

      clusters.set(clusterId, existing);
    }
  }

  return [...clusters.values()].sort((a, b) => {
    if (b.entries.length !== a.entries.length) {
      return b.entries.length - a.entries.length;
    }
    if (b.riskCount !== a.riskCount) return b.riskCount - a.riskCount;
    return a.email.localeCompare(b.email);
  });
}

import * as Crypto from "expo-crypto";

const HIBP_RANGE_ENDPOINT = "https://api.pwnedpasswords.com/range/";
const requestCache = new Map<string, Promise<number | null>>();

async function sha1Upper(input: string): Promise<string> {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA1,
    input
  );
  return digest.toUpperCase();
}

async function fetchRange(prefix: string): Promise<string> {
  const response = await fetch(`${HIBP_RANGE_ENDPOINT}${prefix}`, {
    method: "GET",
    headers: {
      "Add-Padding": "true",
    },
  });

  if (!response.ok) {
    throw new Error(`HIBP lookup failed with status ${response.status}`);
  }

  return response.text();
}

export async function getPwnedCountForPassword(
  password: string
): Promise<number | null> {
  const normalized = String(password ?? "");
  if (!normalized) return 0;

  const sha1 = await sha1Upper(normalized);

  if (!requestCache.has(sha1)) {
    requestCache.set(
      sha1,
      (async () => {
        try {
          const prefix = sha1.slice(0, 5);
          const suffix = sha1.slice(5);
          const body = await fetchRange(prefix);

          for (const line of body.split("\n")) {
            const [rangeSuffix, countRaw] = line.trim().split(":");
            if (!rangeSuffix || !countRaw) continue;
            if (rangeSuffix.toUpperCase() !== suffix) continue;

            const count = Number.parseInt(countRaw, 10);
            return Number.isFinite(count) ? count : 0;
          }

          return 0;
        } catch {
          return null;
        }
      })()
    );
  }

  return requestCache.get(sha1)!;
}

export async function getPwnedCountsForPasswords(
  passwords: string[],
  concurrency = 6
): Promise<Map<string, number | null>> {
  const unique = Array.from(new Set(passwords.filter(Boolean)));
  const out = new Map<string, number | null>();

  for (let index = 0; index < unique.length; index += concurrency) {
    const chunk = unique.slice(index, index + concurrency);
    const results = await Promise.all(
      chunk.map(async (password) => [password, await getPwnedCountForPassword(password)] as const)
    );

    for (const [password, count] of results) {
      out.set(password, count);
    }
  }

  return out;
}

import * as Crypto from "expo-crypto";
import ModulesEnum from "../../vault/model/ModulesEnum";
import WifiModuleType from "../../vault/model/modules/WifiModuleType";
import { ValuesListType } from "../../vault/model/ValuesType";
import passwordEntropy from "./Entropy";
import PasswordStrengthLevel from "../model/PasswordStrengthLevel";
import CachedAnalysisItem from "../model/CachedAnalysisItem";
import CacheResult from "../model/CacheResult";

export const normalize = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

const MIN_LENGTH = 12;

const THRESH_BITS = {
  weakMax: 40,
  mediumMax: 60,
};

export function strengthFromEntropyBits(bits: number): PasswordStrengthLevel {
  if (bits < THRESH_BITS.weakMax) return PasswordStrengthLevel.WEAK;
  if (bits < THRESH_BITS.mediumMax) return PasswordStrengthLevel.MEDIUM;
  return PasswordStrengthLevel.STRONG;
}

export function hasRepeatedChars(pw: string): boolean {
  return /(.)\1{2,}/.test(pw);
}

export function findSequentialTriples(pw: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < pw.length - 2; i++) {
    const a = pw[i],
      b = pw[i + 1],
      c = pw[i + 2];

    const isNum = /\d/.test(a) && /\d/.test(b) && /\d/.test(c);
    const isAlpha =
      /[a-zA-Z]/.test(a) && /[a-zA-Z]/.test(b) && /[a-zA-Z]/.test(c);

    if (isNum) {
      const na = a.charCodeAt(0),
        nb = b.charCodeAt(0),
        nc = c.charCodeAt(0);
      if (nb === na + 1 && nc === na + 2) out.push(pw.slice(i, i + 3));
    } else if (isAlpha) {
      const ca = a.toLowerCase().charCodeAt(0);
      const cb = b.toLowerCase().charCodeAt(0);
      const cc = c.toLowerCase().charCodeAt(0);
      if (cb === ca + 1 && cc === ca + 2) out.push(pw.slice(i, i + 3));
    }
  }
  return Array.from(new Set(out));
}

// Variant-Key (heuristisch, lokal)
export function canonicalizeForVariants(pw: string): string {
  const lower = pw.toLowerCase();
  const leet = lower
    .replace(/@/g, "a")
    .replace(/\$/g, "s")
    .replace(/0/g, "o")
    .replace(/1/g, "l")
    .replace(/3/g, "e")
    .replace(/5/g, "s")
    .replace(/7/g, "t");

  return leet
    .replace(/[\s]+/g, "")
    .replace(/[\W_]+$/g, "")
    .replace(/\d+$/g, "")
    .replace(/(password|passwort|admin|login)$/g, "")
    .trim();
}

// Pepper aus master ableiten (kein Persistieren)
export async function deriveAnalysisPepperFromMaster(
  master: string
): Promise<string> {
  const input = `ClavisPass|analysisPepper|v1|${master}`;
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, input);
}

// Fingerprint für Reuse
export async function fingerprintPassword(
  pepper: string,
  password: string
): Promise<string> {
  const input = `${pepper}\u0000${password}`;
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, input);
}

export async function buildAnalysisCache(
  values: ValuesListType,
  pepper: string
): Promise<CacheResult> {
  const tmp: Array<{
    item: CachedAnalysisItem;
    reuseFp: string;
    variantKey: string;
  }> = [];

  for (const value of values) {
    const normalizedValueTitle = normalize(value.title);

    for (const mod of value.modules) {
      const isPwd = mod.module === ModulesEnum.PASSWORD;
      const isWifi = mod.module === ModulesEnum.WIFI;
      if (!isPwd && !isWifi) continue;

      const pwd = isPwd
        ? String((mod as any).value)
        : (mod as WifiModuleType).value;
      const title = isPwd
        ? value.title
        : ((mod as WifiModuleType).wifiName ?? value.title);
      const normalizedTitle = isPwd ? normalizedValueTitle : normalize(title);

      const entropyBits = passwordEntropy(pwd);
      const strength = strengthFromEntropyBits(entropyBits);

      const reuseFp = await fingerprintPassword(pepper, pwd);
      const variantKey = canonicalizeForVariants(pwd);

      tmp.push({
        reuseFp,
        variantKey,
        item: {
          ref: {
            valueId: value.id,
            moduleId: (mod as any).id,
            type: isPwd ? ModulesEnum.PASSWORD : ModulesEnum.WIFI,
          },
          title,
          normalizedTitle,
          entropyBits,
          strength,
          flags: {
            isShort: pwd.length < MIN_LENGTH,
            hasSequential: findSequentialTriples(pwd).length > 0,
            hasRepeatedChars: hasRepeatedChars(pwd),
            reuseGroupSize: 1,
            variantGroupSize: 1,
          },
        },
      });
    }
  }

  const reuseMap = new Map<string, number>();
  for (const x of tmp)
    reuseMap.set(x.reuseFp, (reuseMap.get(x.reuseFp) ?? 0) + 1);

  const variantMap = new Map<string, number>();
  for (const x of tmp) {
    const k = x.variantKey;
    if (!k || k.length < 4) continue;
    variantMap.set(k, (variantMap.get(k) ?? 0) + 1);
  }

  let weak = 0,
    medium = 0,
    strong = 0;
  let reused = 0,
    variants = 0,
    short = 0,
    sequential = 0;

  const list = tmp.map(({ item, reuseFp, variantKey }) => {
    const rg = reuseMap.get(reuseFp) ?? 1;
    const vg =
      variantKey && variantKey.length >= 4
        ? (variantMap.get(variantKey) ?? 1)
        : 1;

    item.flags.reuseGroupSize = rg;
    item.flags.variantGroupSize = vg;

    if (item.strength === PasswordStrengthLevel.WEAK) weak++;
    else if (item.strength === PasswordStrengthLevel.MEDIUM) medium++;
    else strong++;

    if (rg >= 2) reused++;
    if (vg >= 2) variants++;
    if (item.flags.isShort) short++;
    if (item.flags.hasSequential) sequential++;

    return item;
  });

  const findings = [
    { key: "reused", count: reused },
    { key: "weak", count: weak },
    { key: "short", count: short },
    { key: "variants", count: variants },
    { key: "sequential", count: sequential },
  ].filter((f) => f.count > 0);

  return {
    list,
    counts: { weak, medium, strong, reused, variants, short, sequential },
    findings,
  };
}

// features/analysis/utils/riskModel.ts
import PasswordStrengthLevel from "../model/PasswordStrengthLevel";
import { passwordEntropyBits } from "./Entropy";
import { findSequentialTriples, hasRepeatedChars, strengthFromEntropyBits } from "./analysisEngine";

export type Severity = "Critical" | "High" | "Medium" | "Low" | "OK";
export type IssueKey = "reused" | "similar" | "weak" | "short" | "sequential" | "repeated";

const MIN_LENGTH = 12;

const WEIGHTS: Record<IssueKey, number> = {
  reused: 60,
  weak: 45,
  short: 25,
  similar: 20,
  sequential: 15,
  repeated: 10,
};

export function severityForRiskScore(score: number): Severity {
  if (score >= 90) return "Critical";
  if (score >= 60) return "High";
  if (score >= 30) return "Medium";
  if (score > 0) return "Low";
  return "OK";
}

export function riskScoreFromCached(strength: PasswordStrengthLevel, flags: any): number {
  const reused = (flags?.reuseGroupSize ?? 0) >= 2;
  const similar = (flags?.variantGroupSize ?? 0) >= 2;
  const short = !!flags?.isShort;
  const sequential = !!flags?.hasSequential;
  const repeated = !!flags?.hasRepeatedChars;
  const weak = strength === PasswordStrengthLevel.WEAK;

  let score = 0;
  if (reused) score += WEIGHTS.reused;
  if (weak) score += WEIGHTS.weak;
  if (short) score += WEIGHTS.short;
  if (similar) score += WEIGHTS.similar;
  if (sequential) score += WEIGHTS.sequential;
  if (repeated) score += WEIGHTS.repeated;

  return Math.min(100, score);
}

export function evaluatePasswordForDetail(password: string, reuseCount: number, variantCount: number) {
  const pw = String(password ?? "");
  const length = pw.length;

  const sequentialTriples = findSequentialTriples(pw);
  const repeated = hasRepeatedChars(pw);
  const short = length > 0 && length < MIN_LENGTH;

  // strength now uses the same entropy metric + penalties
  const entropyBits = passwordEntropyBits(pw, {
    capBits: 128,
    penalties: {
      veryShort: short,
      sequentialTriples: sequentialTriples.length > 0,
      repeatedChars: repeated,
    },
  });

  const strength = strengthFromEntropyBits(entropyBits);
  const flags = {
    reuseGroupSize: reuseCount,
    variantGroupSize: variantCount,
    isShort: short,
    hasSequential: sequentialTriples.length > 0,
    hasRepeatedChars: repeated,
  };

  const riskScore = riskScoreFromCached(strength, flags);
  const severity = severityForRiskScore(riskScore);

  return { entropyBits, strength, riskScore, severity, sequentialTriples, repeated, short };
}

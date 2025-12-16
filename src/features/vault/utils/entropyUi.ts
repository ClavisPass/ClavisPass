import PasswordStrengthLevel from "../../analysis/model/PasswordStrengthLevel";
import { strengthFromEntropyBits } from "../../analysis/utils/analysisEngine";
import passwordEntropy from "../../analysis/utils/Entropy";

export const ENTROPY_CAP_BITS = 128;

export function entropyToProgress(entropyBits: number): number {
  if (entropyBits <= 0) return 0;
  const p = entropyBits / ENTROPY_CAP_BITS;
  return p > 1 ? 1 : p;
}

export function entropyToStrength(entropyBits: number): PasswordStrengthLevel {
  return strengthFromEntropyBits(entropyBits) as PasswordStrengthLevel;
}

export function computeEntropyBitsForUi(password: string): number {
  return passwordEntropy(password);
}

/**
 * Entropy (bits) as a conservative UI metric.
 *
 * Model: log2(|charset|^length) = length * log2(|charset|)
 * where |charset| is estimated from the *types* of characters present.
 *
 */

const log2 = (n: number) => Math.log(n) / Math.LN2;

// Basic Unicode-aware classification.
// - Uses Unicode property escapes (requires JS runtime support; Hermes supports it in modern RN).
// - Fallback to ASCII regex if needed.
const hasUnicodeProps = (() => {
  try {
    // Some runtimes accept \p{L} but behave inconsistently for other properties.
    // Only enable Unicode property regexes if ALL properties we rely on are supported.
    // eslint-disable-next-line no-new
    new RegExp("\\p{Ll}", "u");
    // eslint-disable-next-line no-new
    new RegExp("\\p{Lu}", "u");
    // eslint-disable-next-line no-new
    new RegExp("\\p{L}", "u");
    // eslint-disable-next-line no-new
    new RegExp("\\p{Nd}", "u");
    // eslint-disable-next-line no-new
    new RegExp("[\\p{S}\\p{P}]", "u");
    return true;
  } catch {
    return false;
  }
})();

const RE = hasUnicodeProps
  ? {
      lower: /\p{Ll}/u, // lowercase letter
      upper: /\p{Lu}/u, // uppercase letter
      letter: /\p{L}/u, // any letter
      digit: /\p{Nd}/u, // decimal digit
      symbolOrPunct: /[\p{S}\p{P}]/u, // symbols + punctuation
      space: /\s/u,
    }
  : {
      lower: /[a-z]/,
      upper: /[A-Z]/,
      letter: /[a-zA-Z]/,
      digit: /[0-9]/,
      symbolOrPunct: /[^a-zA-Z0-9\s]/,
      space: /\s/,
    };

/**
 * Conservative charset size estimates.
 * These are *not* the full Unicode ranges—intentionally conservative for UI.
 *
 * - letters: assume "latin-ish" size when any letters appear
 * - digits: 10
 * - symbols: typical printable ASCII symbols (~33)
 * - space: counts as 1 additional char if whitespace appears
 */
const CHARSET_SIZES = {
  lower: 26,
  upper: 26,
  // if you see "letters but not clearly lower/upper", treat as 52
  lettersFallback: 52,
  digits: 10,
  symbols: 33,
  space: 1,
};

export type EntropyOptions = {
  // Cap output to keep UI sane; 128 bits is already very strong for passwords.
  capBits?: number;

  // Optional penalties (in bits) to apply for known weak patterns.
  // You can feed these from your other analysis functions.
  penalties?: {
    sequentialTriples?: boolean; // e.g. "abc", "123"
    repeatedChars?: boolean; // e.g. "aaa", "111"
    veryShort?: boolean; // length < 12
  };
};

export function estimateCharsetSize(password: string): number {
  if (!password) return 0;

  const hasLower = RE.lower.test(password);
  const hasUpper = RE.upper.test(password);
  const hasLetter = RE.letter.test(password);
  const hasDigit = RE.digit.test(password);
  const hasSymbol = RE.symbolOrPunct.test(password);
  const hasSpace = RE.space.test(password);

  let size = 0;

  // Letters:
  // - If both lower and upper -> 52
  // - Else if only lower -> 26
  // - Else if only upper -> 26
  // - Else if some letters (but no case detection, e.g. scripts without case) -> 52 fallback
  if (hasLower && hasUpper) size += CHARSET_SIZES.lower + CHARSET_SIZES.upper;
  else if (hasLower) size += CHARSET_SIZES.lower;
  else if (hasUpper) size += CHARSET_SIZES.upper;
  else if (hasLetter) size += CHARSET_SIZES.lettersFallback;

  if (hasDigit) size += CHARSET_SIZES.digits;
  if (hasSymbol) size += CHARSET_SIZES.symbols;
  if (hasSpace) size += CHARSET_SIZES.space;

  return size;
}

export function passwordEntropyBits(
  password: string,
  options?: EntropyOptions
): number {
  if (!password) return 0;

  const capBits = options?.capBits ?? 128;

  const charset = estimateCharsetSize(password);

  // If charset can't be estimated (edge case), return 0
  if (charset <= 1) return 0;

  // Use code points length (handles emojis / surrogate pairs better)
  const length = Array.from(password).length;

  let bits = length * log2(charset);

  // Optional, conservative penalties
  const p = options?.penalties;
  if (p?.veryShort) bits -= 10; // short passwords get a clear penalty
  if (p?.sequentialTriples) bits -= 6; // common sequential patterns
  if (p?.repeatedChars) bits -= 6; // repeated sequences

  // Clamp to [0, capBits]
  if (bits < 0) bits = 0;
  if (bits > capBits) bits = capBits;

  return Math.round(bits);
}

export default function passwordEntropy(password: string): number {
  // Default: no penalties here (you can apply penalties in detail analysis if you want)
  return passwordEntropyBits(password, { capBits: 128 });
}

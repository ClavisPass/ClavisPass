// utils/totp.ts
import * as OTPAuth from 'otpauth';

export type TotpAlgo = 'SHA1' | 'SHA256' | 'SHA512';

export function parseOtpauth(uri: string) {
  if (!uri?.startsWith('otpauth://')) throw new Error('Invalid otpauth URI');
  const parsed = OTPAuth.URI.parse(uri);
  if (!(parsed instanceof OTPAuth.TOTP)) throw new Error('Only TOTP supported');

  const totp = parsed as OTPAuth.TOTP;
  const { issuer, label, algorithm, digits, period, secret } = totp;

  // label kann "Issuer:account" sein – OTPAuth parsed das bereits ins Feld "label"
  // Wir trennen optional in Issuer/Account:
  let account = label;
  let issuerFromLabel: string | undefined;
  if (label.includes(':')) {
    const [iss, ...rest] = label.split(':');
    issuerFromLabel = iss;
    account = rest.join(':');
  }

  // Base32 secret als String
  const secret_b32 = secret?.toString() ?? '';
  const algo = (algorithm?.toUpperCase?.() || 'SHA1') as TotpAlgo;

  return {
    issuer: issuer || issuerFromLabel,
    account,
    secret_b32,
    digits: (digits as 6 | 7 | 8) ?? 6,
    period: period ?? 30,
    algorithm: (['SHA1', 'SHA256', 'SHA512'].includes(algo) ? algo : 'SHA1') as TotpAlgo,
    label,
  };
}

export function buildOtpauth({
  issuer,
  account,
  secret_b32,
  digits = 6,
  period = 30,
  algorithm = 'SHA1',
}: {
  issuer?: string;
  account?: string;
  secret_b32: string;
  digits?: 6 | 7 | 8;
  period?: number;
  algorithm?: TotpAlgo;
}) {
  const totp = new OTPAuth.TOTP({
    issuer,
    label: account ?? 'TOTP',
    algorithm,
    digits,
    period,
    secret: OTPAuth.Secret.fromBase32(secret_b32.replace(/\s+/g, ''))
  });
  return OTPAuth.URI.stringify(totp);
}

export function codeFromUri(otpauth: string): { code: string; remaining: number; info: ReturnType<typeof parseOtpauth> } {
  const parsed = OTPAuth.URI.parse(otpauth);
  if (!(parsed instanceof OTPAuth.TOTP)) throw new Error('Only TOTP supported');

  const totp = parsed as OTPAuth.TOTP;
  const code = totp.generate();

  const period = totp.period ?? 30;
  const now = Math.floor(Date.now() / 1000);
  const remaining = period - (now % period);

  return { code, remaining, info: parseOtpauth(otpauth) };
}

import ExpiryStatus from "../model/ExpiryStatus";

const DEFAULT_WARN = 24 * 60 * 60 * 1000;

export function getStatus(
  isoOrNull: string | null,
  nowMs = Date.now(),
  warnBeforeMs = DEFAULT_WARN
): { status: ExpiryStatus; remainingMs: number } {
  if (!isoOrNull) return { status: "empty", remainingMs: Infinity };
  const ts = Date.parse(isoOrNull);
  if (isNaN(ts)) return { status: "empty", remainingMs: Infinity };

  const remaining = ts - nowMs;
  if (remaining <= 0) return { status: "expired", remainingMs: remaining };
  if (remaining <= warnBeforeMs)
    return { status: "dueSoon", remainingMs: remaining };
  return { status: "active", remainingMs: remaining };
}

export function formatRelative(remainingMs: number): string {
  const abs = Math.abs(remainingMs);
  const sign = remainingMs >= 0 ? 1 : -1;

  const mins = Math.floor(abs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (days >= 1) return sign > 0 ? `in ${days} d` : `${days} d ago`;
  if (hours >= 1) return sign > 0 ? `in ${hours} h` : `${hours} h ago`;
  if (mins >= 1) return sign > 0 ? `in ${mins} min` : `${mins} min ago`;
  return sign > 0 ? `now` : `just expired`;
}

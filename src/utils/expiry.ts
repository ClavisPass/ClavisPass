import ExpiryStatus from "../types/ExpiryStatus";

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

/** erzeugt eine ISO-Zeit (UTC) aus lokalem Datum + Uhrzeit */
export function toIsoUtcFromLocal(
  date: Date,
  hours: number,
  minutes: number
): string {
  const local = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
    0,
    0
  );
  return local.toISOString(); // als UTC speichern
}

/** Hilfsformat für UI */
export function formatAbsoluteLocal(iso: string, locale = "de-DE"): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

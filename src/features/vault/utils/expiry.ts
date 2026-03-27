import ExpiryStatus from "../model/ExpiryStatus";

const DEFAULT_WARN = 24 * 60 * 60 * 1000;

export type RelativeExpiryInfo =
  | { kind: "future"; unit: "day" | "hour" | "minute"; value: number }
  | { kind: "past"; unit: "day" | "hour" | "minute"; value: number }
  | { kind: "now" }
  | { kind: "justExpired" };

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

export function getRelativeInfo(remainingMs: number): RelativeExpiryInfo {
  const abs = Math.abs(remainingMs);
  const sign = remainingMs >= 0 ? 1 : -1;

  const mins = Math.floor(abs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (days >= 1) {
    return sign > 0
      ? { kind: "future", unit: "day", value: days }
      : { kind: "past", unit: "day", value: days };
  }
  if (hours >= 1) {
    return sign > 0
      ? { kind: "future", unit: "hour", value: hours }
      : { kind: "past", unit: "hour", value: hours };
  }
  if (mins >= 1) {
    return sign > 0
      ? { kind: "future", unit: "minute", value: mins }
      : { kind: "past", unit: "minute", value: mins };
  }
  return sign > 0 ? { kind: "now" } : { kind: "justExpired" };
}

export function formatRelative(remainingMs: number): string {
  const info = getRelativeInfo(remainingMs);
  if (info.kind === "future") return `in ${info.value} ${info.unit}`;
  if (info.kind === "past") return `${info.value} ${info.unit} ago`;
  if (info.kind === "now") return "now";
  return "just expired";
}

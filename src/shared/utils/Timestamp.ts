export function getDateTime() {
  return new Date().toJSON();
}

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
  return local.toISOString();
}

export function formatAbsoluteLocal(
  iso: string,
  localeDate = "de-DE",
  localeTime = "de-DE"
): string {
  const d = new Date(iso);
  return `${formatAbsoluteDate(iso, localeDate)}  ${formatAbsoluteTime(iso, localeTime)}`;
}

export function formatAbsoluteDate(iso: string, locale = "de-DE"): string {
  if (!iso) return "";
  if (locale === "") return "";
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function formatAbsoluteTime(iso: string, locale = "de-DE"): string {
  if (!iso) return "";
  if (locale === "") return "";
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

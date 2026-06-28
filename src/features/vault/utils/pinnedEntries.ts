import ValuesType from "../model/ValuesType";

export function isPinnedEntry(entry: Pick<ValuesType, "pinnedAt">) {
  return typeof entry.pinnedAt === "string" && entry.pinnedAt.length > 0;
}

export function comparePinnedFirst<T extends Pick<ValuesType, "pinnedAt">>(
  a: T,
  b: T,
) {
  const aPinned = isPinnedEntry(a);
  const bPinned = isPinnedEntry(b);

  if (aPinned !== bPinned) return aPinned ? -1 : 1;
  if (!aPinned || !bPinned) return 0;

  return Date.parse(b.pinnedAt ?? "") - Date.parse(a.pinnedAt ?? "");
}

export function orderPinnedFirst<T extends Pick<ValuesType, "pinnedAt">>(
  values: T[],
) {
  return [...values].sort(comparePinnedFirst);
}

export function sortPinnedFirst<T extends Pick<ValuesType, "pinnedAt">>(
  values: T[],
  compareWithinGroup: (a: T, b: T) => number,
) {
  return [...values].sort((a, b) => {
    const pinned = comparePinnedFirst(a, b);
    if (pinned !== 0) return pinned;
    return compareWithinGroup(a, b);
  });
}

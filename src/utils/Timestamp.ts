export function getDateTime() {
  return new Date().toJSON();
}

export function formatDateTime(date: string) {
  return new Date(date).toLocaleString();
}

export function compare(newer: string, later: string) {
  const date1 = new Date(newer);
  const date2 = new Date(later);
  return date1 > date2;
}

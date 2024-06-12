export function getDateTime() {
  return new Date().toJSON();
}

export function formatDateTime(date: string) {
  return new Date(date).toLocaleString();
}

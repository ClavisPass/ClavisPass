export function getDefaultIdentityName(email: string) {
  const localPart = email.split("@")[0]?.trim() || email.trim();
  const spaced = localPart
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!spaced) return email;

  return spaced
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

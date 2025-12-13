// ---------- PKCE Helpers ----------
export async function createPkcePair() {
  const codeVerifier = base64Url(randomBytes(32));
  const codeChallenge = await toCodeChallenge(codeVerifier);
  return { codeVerifier, codeChallenge, method: "S256" as const };
}
function randomBytes(length: number) {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return arr;
}
function base64Url(bytes: Uint8Array | ArrayBuffer) {
  const buf = bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : bytes;
  let bin = "";
  for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
async function toCodeChallenge(verifier: string) {
  const enc = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return base64Url(digest);
}

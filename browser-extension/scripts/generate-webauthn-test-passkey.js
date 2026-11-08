import { generateKeyPairSync, randomBytes } from "node:crypto";

function toBase64Url(bytes) {
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

const { privateKey, publicKey } = generateKeyPairSync("ec", {
  namedCurve: "prime256v1",
});

const module = {
  module: "PASSKEY",
  relyingPartyId: "localhost",
  relyingPartyName: "Local WebAuthn Test",
  userName: "clavispass-test",
  userDisplayName: "ClavisPass Test User",
  userHandle: toBase64Url(randomBytes(16)),
  credentialId: toBase64Url(randomBytes(32)),
  publicKey: toBase64Url(publicKey.export({ type: "spki", format: "der" })),
  privateKey: toBase64Url(privateKey.export({ type: "pkcs8", format: "der" })),
  algorithm: "public-key / ECDSA / P-256",
  transports: ["internal"],
  backupEligible: false,
  backupState: false,
  createdAt: new Date().toISOString(),
  source: "ClavisPass local WebAuthn test fixture",
};

console.log(JSON.stringify(module, null, 2));

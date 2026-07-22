import type { Argon2Type, Argon2Version } from "kdbxweb/dist/types/crypto/crypto-engine";
import type { KdbxImportResult } from "./mapKdbxToClavisPass";

import { mapKdbxToClavisPass } from "./mapKdbxToClavisPass";

let argon2Configured = false;

async function configureKdbxArgon2(kdbxweb: typeof import("kdbxweb")) {
  if (argon2Configured) return;

  const argon2 = require("argon2-browser/dist/argon2-bundled.min.js") as {
    hash: (params: {
      pass: Uint8Array;
      salt: Uint8Array;
      time: number;
      mem: number;
      hashLen: number;
      parallelism: number;
      type: Argon2Type;
      version: Argon2Version;
    }) => Promise<{ hash: Uint8Array }>;
  };

  kdbxweb.CryptoEngine.setArgon2Impl(
    async (
      password,
      salt,
      memory,
      iterations,
      length,
      parallelism,
      type,
      version,
    ) => {
      const result = await argon2.hash({
        pass: new Uint8Array(password),
        salt: new Uint8Array(salt),
        time: iterations,
        mem: memory,
        hashLen: length,
        parallelism,
        type,
        version,
      });

      return result.hash.buffer.slice(
        result.hash.byteOffset,
        result.hash.byteOffset + result.hash.byteLength,
      ) as ArrayBuffer;
    },
  );

  argon2Configured = true;
}

export async function importKdbx(
  data: ArrayBuffer,
  password: string,
): Promise<KdbxImportResult> {
  const kdbxweb = await import("kdbxweb");
  await configureKdbxArgon2(kdbxweb);

  const credentials = new kdbxweb.Credentials(
    kdbxweb.ProtectedValue.fromString(password),
  );
  const kdbx = await kdbxweb.Kdbx.load(data, credentials);

  return mapKdbxToClavisPass(kdbx);
}

import getEmptyData from "../../../../features/vault/utils/getEmptyData";
import type { CryptoProvider } from "../../provider/CryptoProvider";
import { decryptVaultV1, encryptVaultV1 } from "./VaultV1";
import { VaultV1Schema } from "./VaultV1Schema";

const TEST_MASTER_PASSWORD = "ClavisPass::VaultV1::SelfTest";

const TEST_PAYLOAD = getEmptyData();

export async function verifyVaultV1Provider(
  crypto: CryptoProvider,
): Promise<void> {
  const salt = new Uint8Array(crypto.PWHASH_SALTBYTES());
  const nonce = new Uint8Array(crypto.AEAD_NONCEBYTES());

  for (let index = 0; index < salt.length; index += 1) {
    salt[index] = (index * 13 + 7) % 256;
  }

  for (let index = 0; index < nonce.length; index += 1) {
    nonce[index] = (index * 17 + 11) % 256;
  }

  const content = await encryptVaultV1(
    crypto,
    TEST_MASTER_PASSWORD,
    TEST_PAYLOAD,
    {
      opslimit: 3,
      memlimit: 64 * 1024 * 1024,
      salt,
      nonce,
    },
  );

  const parsed = VaultV1Schema.parse(JSON.parse(content));
  const decrypted = await decryptVaultV1(
    crypto,
    parsed,
    TEST_MASTER_PASSWORD,
  );

  if (JSON.stringify(decrypted) !== JSON.stringify(TEST_PAYLOAD)) {
    throw new Error("[VaultV1] provider self-test payload mismatch");
  }
}

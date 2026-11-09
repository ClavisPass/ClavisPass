import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../app/providers/AuthProvider";
import { useToken } from "../../../app/providers/CloudProvider";
import { useVault } from "../../../app/providers/VaultProvider";
import { canWriteRecoveryVault, fetchRemoteVaultFile, runVaultOperation, uploadRemoteVaultFile } from "../../../infrastructure/cloud/clients/CloudStorageClient";
import { VaultCryptoSession } from "../../../infrastructure/crypto/vault/VaultCryptoSession";
import {
  persistPreparedRecoveryVault,
  prepareVaultRecoveryChange,
} from "../../../infrastructure/crypto/vault/vaultRecovery";
import VaultRecoverySetupDialog from "../../auth/components/VaultRecoverySetupDialog";
import SettingsItem from "./SettingsItem";

export default function RecoveryKeySettingsItem() {
  const { t } = useTranslation();
  const { provider, accessToken, ensureFreshAccessToken } = useToken();
  const auth = useAuth();
  const vault = useVault();
  const activeProvider = useRef(provider);
  activeProvider.current = provider;
  const [visible, setVisible] = useState(false);
  const configured = VaultCryptoSession.hasRecoveryKey();
  const available = canWriteRecoveryVault(provider) && vault.isUnlocked;

  const save = async (key: string | null, dialogCurrent: () => boolean) => {
    const password = auth.getMaster();
    const vaultId = vault.exportFullData().vaultId;
    if (!password || !vaultId || !provider || !canWriteRecoveryVault(provider)) {
      throw new Error("Recovery settings require an unlocked vault");
    }
    const isCurrent = () => {
      if (
        !dialogCurrent() ||
        activeProvider.current !== provider ||
        auth.getMaster() !== password
      )
        return false;
      try {
        return vault.exportFullData().vaultId === vaultId;
      } catch {
        return false;
      }
    };
    await runVaultOperation(async () => {
      if (!isCurrent()) throw new Error("Vault session changed");
      const token = provider === "device" ? "" : accessToken ?? (await ensureFreshAccessToken());
      if (token === null) throw new Error("Missing provider credentials");
      const target = { provider, accessToken: token, remotePath: "clavispass.lock" };
      const saved = await fetchRemoteVaultFile(target);
      if (saved.status !== "ok" || !isCurrent())
        throw new Error("The saved vault is unavailable");
      const next = await prepareVaultRecoveryChange(
        saved.content,
        password,
        vaultId,
        key,
      );
      await persistPreparedRecoveryVault(
        next,
        password,
        (id) => uploadRemoteVaultFile({
          ...target,
          content: next,
          vaultId: id,
          expected: saved,
          allowRecoveryRemoval: key === null,
        }),
        isCurrent,
      );
    });
  };

  return (
    <>
      <SettingsItem
        leadingIcon="key-outline"
        subtitle={t(
          !available
            ? "login:recoveryProviderUnsupported"
            : configured
              ? "login:recoveryEnabled"
              : "login:recoveryDisabled",
        )}
        onPress={available ? () => setVisible(true) : undefined}
      >
        {t("login:recoveryTitle")}
      </SettingsItem>
      {visible && available ? (
        <VaultRecoverySetupDialog
          cloudVault={provider !== "device"}
          configured={configured}
          verifyPassword={(password) =>
            Boolean(password) && password === auth.getMaster()
          }
          onDismiss={() => setVisible(false)}
          onSave={save}
        />
      ) : null}
    </>
  );
}

import React, {
  useState,
} from "react";
import SettingsSwitch from "./SettingsSwitch";
import { useTranslation } from "react-i18next";
import { useContentProtection } from "../../../app/providers/ContentProtectionProvider";

export function ContentProtectionSettingsToggle() {
  const { enabled, setEnabled } = useContentProtection();
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
      <SettingsSwitch
        label={t("settings:contentProtection")}
        leadingIcon="shield-lock"
        value={enabled}
        disabled={busy}
         onValueChange={async (next) => {
              setBusy(true);
              setError(null);
              try {
                await setEnabled(next);
              } catch (e: any) {
                setError(String(e));
              } finally {
                setBusy(false);
              }
            }}
      />
  );
}

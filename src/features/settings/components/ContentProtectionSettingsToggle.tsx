import React, {
  useState,
} from "react";
import SettingsSwitch from "./SettingsSwitch";
import { useTranslation } from "react-i18next";
import { useContentProtection } from "../../../app/providers/ContentProtectionProvider";
import type { SettingInfo } from "./SettingInfoButton";

type Props = {
  info?: SettingInfo;
};

export function ContentProtectionSettingsToggle(props: Props) {
  const { enabled, setEnabled } = useContentProtection();
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
      <SettingsSwitch
        label={t("settings:contentProtection")}
        value={enabled}
        disabled={busy}
        info={props.info}
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

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import DarkModeSwitch from "./DarkModeSwitch";
import SettingsDivider from "./SettingsDivider";
import SettingsDropdownItem from "./SettingsDropdownItem";

import { useSetting } from "../../../app/providers/SettingsProvider";
import { AppLanguage } from "../../../shared/i18n/types";
import { i18n } from "../../../shared/i18n";
import {
  formatAbsoluteDate,
  formatAbsoluteTime,
} from "../../../shared/utils/Timestamp";
import {
  detectTauriEnvironment,
  isTauriEnvironment,
} from "../../../infrastructure/platform/isTauri";

type Props = {
  dropdownMaxWidth?: number;
  size?: "large" | "small";
};

const AppearanceSettingsSection: React.FC<Props> = ({
  dropdownMaxWidth = 120,
  size = "large",
}) => {
  const { t } = useTranslation();

  const { value: language, setValue: setLanguageSetting } =
    useSetting("LANGUAGE");
  const { value: dateFormat, setValue: setDateFormatSetting } =
    useSetting("DATE_FORMAT");
  const { value: timeFormat, setValue: setTimeFormatSetting } =
    useSetting("TIME_FORMAT");
  const {
    value: windowControlsStyle,
    setValue: setWindowControlsStyleSetting,
  } = useSetting("WINDOW_CONTROLS_STYLE");
  const { value: windowCornerStyle, setValue: setWindowCornerStyleSetting } =
    useSetting("WINDOW_CORNER_STYLE");
  const [isTauri, setIsTauri] = useState(isTauriEnvironment());

  useEffect(() => {
    void (async () => {
      setIsTauri(await detectTauriEnvironment());
    })();
  }, []);

  return (
    <>
      <DarkModeSwitch size={size} />
      <SettingsDivider />

      <SettingsDropdownItem
        value={language}
        setValue={(lang) => {
          i18n.changeLanguage(lang);
          setLanguageSetting(lang as AppLanguage);
        }}
        label={t("settings:language")}
        options={[
          { label: "Deutsch", value: "de" },
          { label: "English", value: "en" },
        ]}
      />

      {isTauri ? (
        <>
          <SettingsDivider />

          <SettingsDropdownItem
            value={windowControlsStyle}
            setValue={(style) => {
              setWindowControlsStyleSetting(
                style as "system" | "left" | "right",
              );
            }}
            label={t("settings:windowControlsStyle")}
            info={{
              title: t("settings:infoWindowControlsTitle"),
              body: t("settings:infoWindowControlsBody"),
            }}
            dropdownMaxWidth={dropdownMaxWidth}
            options={[
              {
                label: t("settings:windowControlsSystem"),
                value: "system",
              },
              {
                label: t("settings:windowControlsLeft"),
                value: "left",
              },
              {
                label: t("settings:windowControlsRight"),
                value: "right",
              },
            ]}
          />

          <SettingsDivider />

          <SettingsDropdownItem
            value={windowCornerStyle}
            setValue={(style) => {
              setWindowCornerStyleSetting(style as "rounded" | "square");
            }}
            label={t("settings:windowCornerStyle")}
            info={{
              title: t("settings:infoWindowCornersTitle"),
              body: t("settings:infoWindowCornersBody"),
            }}
            dropdownMaxWidth={dropdownMaxWidth}
            options={[
              {
                label: t("settings:windowCornerRounded"),
                value: "rounded",
              },
              {
                label: t("settings:windowCornerSquare"),
                value: "square",
              },
            ]}
          />
        </>
      ) : null}

      <SettingsDivider />

      <SettingsDropdownItem
        value={dateFormat}
        setValue={(df) => {
          setDateFormatSetting(df as "de-DE" | "en-US");
        }}
        label={t("settings:dateFormat")}
        dropdownMaxWidth={dropdownMaxWidth}
        options={[
          {
            label: formatAbsoluteDate(new Date().toISOString(), "de-DE"),
            value: "de-DE",
          },
          {
            label: formatAbsoluteDate(new Date().toISOString(), "en-US"),
            value: "en-US",
          },
        ]}
      />

      <SettingsDivider />

      <SettingsDropdownItem
        value={timeFormat}
        setValue={(tf) => {
          setTimeFormatSetting(tf as "de-DE" | "en-US");
        }}
        label={t("settings:timeFormat")}
        options={[
          {
            label: formatAbsoluteTime(new Date().toISOString(), "de-DE"),
            value: "de-DE",
          },
          {
            label: formatAbsoluteTime(new Date().toISOString(), "en-US"),
            value: "en-US",
          },
        ]}
      />
    </>
  );
};

export default AppearanceSettingsSection;

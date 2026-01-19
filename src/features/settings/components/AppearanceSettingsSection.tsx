import React from "react";
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
          { label: "English", value: "en" },
          { label: "Deutsch", value: "de" },
        ]}
      />

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
            label: formatAbsoluteDate(
              new Date().toISOString(),
              "de-DE"
            ),
            value: "de-DE",
          },
          {
            label: formatAbsoluteDate(
              new Date().toISOString(),
              "en-US"
            ),
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
            label: formatAbsoluteTime(
              new Date().toISOString(),
              "de-DE"
            ),
            value: "de-DE",
          },
          {
            label: formatAbsoluteTime(
              new Date().toISOString(),
              "en-US"
            ),
            value: "en-US",
          },
        ]}
      />
    </>
  );
};

export default AppearanceSettingsSection;

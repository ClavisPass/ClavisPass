import React from "react";
import type { AdaptiveDropdownOption } from "../../../shared/components/dropdowns/AdaptiveDropdown";
import AdaptiveDropdown from "../../../shared/components/dropdowns/AdaptiveDropdown";
import SettingInfoButton, { SettingInfo } from "./SettingInfoButton";
import SettingsItem from "./SettingsItem";

type Props = {
  value: string;
  setValue: (value: string) => void;
  options: AdaptiveDropdownOption[];
  label?: string;
  leadingIcon?: string;
  info?: SettingInfo;
  subtitle?: string;

  // Web sizing
  dropdownMaxWidth?: number;
  dropdownMinWidth?: number;
  yOffset?: number;

  // Native sizing
  nativeSnapPoints?: (string | number)[];
};

export default function SettingsDropdownItem({
  value,
  setValue,
  options,
  label,
  leadingIcon,
  info,
  subtitle,
  dropdownMaxWidth = 260,
  dropdownMinWidth = 200,
  yOffset = 6,
  nativeSnapPoints,
}: Props) {
  return (
    <AdaptiveDropdown
      value={value}
      setValue={setValue}
      options={options}
      dropdownMaxWidth={dropdownMaxWidth}
      dropdownMinWidth={dropdownMinWidth}
      yOffset={yOffset}
      nativeSnapPoints={nativeSnapPoints}
      itemTextAlign="right"
      renderTrigger={({ selectedLabel, toggle }) => (
        <SettingsItem
          leadingIcon={leadingIcon}
          rightText={String(selectedLabel)}
          subtitle={subtitle}
          afterLabel={info ? <SettingInfoButton {...info} compact /> : undefined}
          rightIcon="chevron-down"
          onPress={toggle}
        >
          {label}
        </SettingsItem>
      )}
    />
  );
}

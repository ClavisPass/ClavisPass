import React from "react";
import type { AdaptiveDropdownOption } from "../../../shared/components/dropdowns/AdaptiveDropdown";
import AdaptiveDropdown from "../../../shared/components/dropdowns/AdaptiveDropdown";
import { MenuItem } from "../../../shared/components/menus/MenuItem";
import AnimatedPressable from "../../../shared/components/AnimatedPressable";
import SettingInfoButton, { SettingInfo } from "./SettingInfoButton";

type Props = {
  value: string;
  setValue: (value: string) => void;
  options: AdaptiveDropdownOption[];
  label?: string;
  leadingIcon?: string;
  info?: SettingInfo;

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
      renderTrigger={({ selectedLabel, open }) => (
        <AnimatedPressable onPress={open}>
          <MenuItem
            leadingIcon={leadingIcon}
            rightText={String(selectedLabel)}
            afterLabel={
              info ? <SettingInfoButton {...info} compact /> : undefined
            }
          >
            {label}
          </MenuItem>
        </AnimatedPressable>
      )}
    />
  );
}

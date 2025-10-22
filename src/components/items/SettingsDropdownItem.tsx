import { useState } from "react";
import { View } from "react-native";
import { MenuItem } from "./MenuItem";
import { Dropdown, DropdownInputProps } from "react-native-paper-dropdown";
import type { Option as DropdownOption } from "react-native-paper-dropdown";
import { useTheme } from "../../contexts/ThemeProvider";

type Props = {
  options: DropdownOption[];
  label?: string;
  leadingIcon?: string;
};

function SettingsDropdownItem({ options, label, leadingIcon }: Props) {
  const { theme } = useTheme();
  const [value, setValue] = useState<string>(options?.[0]?.value ?? "");

  const CustomDropdownInput = ({ selectedLabel }: DropdownInputProps) => (
    <MenuItem leadingIcon={leadingIcon} label={label} rightText={selectedLabel}>
      {"Language"}
    </MenuItem>
  );

  return (
    <View style={{ overflow: "hidden" }}>
      <Dropdown
        CustomDropdownInput={CustomDropdownInput}
        menuContentStyle={{
          overflow: "hidden",
          backgroundColor: theme.colors.background,
          boxShadow: theme.colors.shadow,
        }}
        mode="flat"
        hideMenuHeader
        options={options}
        value={value}
        onSelect={(v) => setValue(v ?? "")}
      />
    </View>
  );
}

export default SettingsDropdownItem;

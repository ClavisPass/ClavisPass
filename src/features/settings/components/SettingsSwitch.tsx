import { Switch } from "react-native-paper";
import SettingsItem from "./SettingsItem";
import SettingInfoButton, { SettingInfo } from "./SettingInfoButton";

type Props = {
  label: string;
  value: boolean;
  onValueChange: (checked: boolean) => void;
  leadingIcon?: string;
  disabled?: boolean;
  info?: SettingInfo;
  subtitle?: string;
};

const SettingsSwitch = (props: Props) => {
  return (
    <SettingsItem
      leadingIcon={props.leadingIcon}
      minWidth={0}
      onPress={props.disabled ? undefined : () => props.onValueChange(!props.value)}
      subtitle={props.subtitle}
      afterLabel={
        props.info ? <SettingInfoButton {...props.info} compact /> : null
      }
      rightIcon={null}
      trailing={
        <Switch
          value={props.value}
          onValueChange={props.onValueChange}
          disabled={props.disabled}
        />
      }
    >
      {props.label}
    </SettingsItem>
  );
};

export default SettingsSwitch;

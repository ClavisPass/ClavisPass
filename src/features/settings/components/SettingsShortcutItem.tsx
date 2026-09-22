import { ReactNode } from "react";
import SettingsItem from "./SettingsItem";

type Props = {
  children: ReactNode;
  shortcut: string;
  onPress?: () => void;
  subtitle?: string;
};

function SettingsShortcutItem(props: Props) {
  return (
    <SettingsItem
      onPress={props.onPress}
      rightText={props.shortcut}
      subtitle={props.subtitle}
      rightIcon={null}
    >
      {props.children}
    </SettingsItem>
  );
}

export default SettingsShortcutItem;

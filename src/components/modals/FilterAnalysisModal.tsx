import Modal from "./Modal";
import { View } from "react-native";
import Divider from "../Divider";
import SettingsSwitch from "../SettingsSwitch";
import getPasswordStrengthIcon from "../../utils/getPasswordStrengthIcon";
import PasswordStrengthLevel from "../../enums/PasswordStrengthLevel";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  strong: boolean;
  setStrong: (value: boolean) => void;
  medium: boolean;
  setMedium: (value: boolean) => void;
  weak: boolean;
  setWeak: (value: boolean) => void;
};

function FilterAnalysisModal(props: Props) {
  const hideModal = () => props.setVisible(false);

  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <View style={{ width: 280, height: 177 }}>
        <SettingsSwitch
          label="Strong"
          leadingIcon={getPasswordStrengthIcon(PasswordStrengthLevel.STRONG)}
          value={props.strong}
          onValueChange={props.setStrong}
        />
        <Divider />
        <SettingsSwitch
          label="Medium"
          leadingIcon={getPasswordStrengthIcon(PasswordStrengthLevel.MEDIUM)}
          value={props.medium}
          onValueChange={props.setMedium}
        />
        <Divider />
        <SettingsSwitch
          label="Weak"
          leadingIcon={getPasswordStrengthIcon(PasswordStrengthLevel.WEAK)}
          value={props.weak}
          onValueChange={props.setWeak}
        />
      </View>
    </Modal>
  );
}

export default FilterAnalysisModal;

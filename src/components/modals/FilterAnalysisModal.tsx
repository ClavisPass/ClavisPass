import Modal from "./Modal";
import { View } from "react-native";
import Divider from "../Divider";
import SettingsSwitch from "../SettingsSwitch";
import getPasswordStrengthIcon from "../../utils/getPasswordStrengthIcon";
import PasswordStrengthLevel from "../../enums/PasswordStrengthLevel";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const hideModal = () => props.setVisible(false);

  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <View style={{ width: 280, height: 177 }}>
        <SettingsSwitch
          label={t("analysis:strong")}
          leadingIcon={getPasswordStrengthIcon(PasswordStrengthLevel.STRONG)}
          value={props.strong}
          onValueChange={props.setStrong}
        />
        <Divider />
        <SettingsSwitch
          label={t("analysis:medium")}
          leadingIcon={getPasswordStrengthIcon(PasswordStrengthLevel.MEDIUM)}
          value={props.medium}
          onValueChange={props.setMedium}
        />
        <Divider />
        <SettingsSwitch
          label={t("analysis:weak")}
          leadingIcon={getPasswordStrengthIcon(PasswordStrengthLevel.WEAK)}
          value={props.weak}
          onValueChange={props.setWeak}
        />
      </View>
    </Modal>
  );
}

export default FilterAnalysisModal;

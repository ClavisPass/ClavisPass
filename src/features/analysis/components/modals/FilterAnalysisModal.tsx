import Modal from "../../../../shared/components/modals/Modal";
import { View, StyleSheet } from "react-native";
import Divider from "../../../../shared/components/Divider";
import SettingsSwitch from "../../../settings/components/SettingsSwitch";
import getPasswordStrengthIcon from "../../utils/getPasswordStrengthIcon";
import PasswordStrengthLevel from "../../model/PasswordStrengthLevel";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../app/providers/ThemeProvider";

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
  const { theme } = useTheme();
  const { t } = useTranslation();
  const hideModal = () => props.setVisible(false);

  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <View
        style={{
          width: 280,
          height: 177,
          borderRadius: 12,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.outlineVariant,
        }}
      >
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

import { ScrollView } from "react-native";
import { useTranslation } from "react-i18next";

import Modal from "../../../../shared/components/modals/Modal";
import ModalSurface from "../../../../shared/components/modals/ModalSurface";
import SettingsDivider from "../SettingsDivider";
import SettingsItem from "../SettingsItem";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onOpenChromeStore: () => void;
  onOpenFirefoxStore: () => void;
};

function BrowserExtensionsModal({
  visible,
  onDismiss,
  onOpenChromeStore,
  onOpenFirefoxStore,
}: Props) {
  const { t } = useTranslation();

  const runAndClose = (action: () => void) => {
    onDismiss();
    action();
  };

  return (
    <Modal visible={visible} onDismiss={onDismiss}>
      <ModalSurface
        width={340}
        maxHeight={460}
        title={t("settings:browserExtensions")}
        description={t("settings:browserExtensionModalHint")}
        padded={false}
        separatedHeader
      >
        <ScrollView showsVerticalScrollIndicator>
          <SettingsItem
            leadingIcon="google-chrome"
            rightIcon="open-in-new"
            onPress={() => runAndClose(onOpenChromeStore)}
          >
            {t("settings:browserExtensionChromeStore")}
          </SettingsItem>
          <SettingsDivider />
          <SettingsItem
            leadingIcon="firefox"
            rightIcon="open-in-new"
            onPress={() => runAndClose(onOpenFirefoxStore)}
          >
            {t("settings:browserExtensionFirefoxStore")}
          </SettingsItem>
        </ScrollView>
      </ModalSurface>
    </Modal>
  );
}

export default BrowserExtensionsModal;

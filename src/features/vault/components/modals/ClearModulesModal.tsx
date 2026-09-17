import { useTranslation } from "react-i18next";
import ConfirmationModal from "../../../../shared/components/modals/ConfirmationModal";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onClear: () => void;
};

function ClearModulesModal(props: Props) {
  const { t } = useTranslation();

  return (
    <ConfirmationModal
      visible={props.visible}
      title={`${t("common:clearModules")}?`}
      message={t("common:clearModulesText")}
      cancelLabel={t("common:cancel")}
      confirmLabel={t("common:clearModules")}
      onDismiss={() => props.setVisible(false)}
      onConfirm={props.onClear}
      destructive
    />
  );
}

export default ClearModulesModal;

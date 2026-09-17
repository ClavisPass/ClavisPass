import { useTranslation } from "react-i18next";
import ConfirmationModal from "../../../../shared/components/modals/ConfirmationModal";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onDiscard: () => void;
};

function DiscardChangesModal(props: Props) {
  const { t } = useTranslation();
  const hideModal = () => props.setVisible(false);

  return (
    <ConfirmationModal
      visible={props.visible}
      title={t("common:discardChangesTitle")}
      message={t("common:discardChangesText")}
      cancelLabel={t("common:cancel")}
      confirmLabel={t("common:discard")}
      onDismiss={hideModal}
      onConfirm={props.onDiscard}
    />
  );
}

export default DiscardChangesModal;

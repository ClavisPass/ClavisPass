import { useTranslation } from "react-i18next";
import ConfirmationModal from "../../../../shared/components/modals/ConfirmationModal";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onDelete: () => void;
};

function DeleteModal(props: Props) {
  const { t } = useTranslation();
  const hideModal = () => props.setVisible(false);

  return (
    <ConfirmationModal
      visible={props.visible}
      title={`${t("common:delete")}?`}
      message={t("common:deleteEntryText")}
      cancelLabel={t("common:cancel")}
      confirmLabel={t("common:delete")}
      onDismiss={hideModal}
      onConfirm={props.onDelete}
      destructive
    />
  );
}

export default DeleteModal;

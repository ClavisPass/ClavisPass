import { useTranslation } from "react-i18next";
import ConfirmationModal from "../../../../shared/components/modals/ConfirmationModal";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onDelete: () => void;
};

function DeleteModuleModal(props: Props) {
  const { t } = useTranslation();

  return (
    <ConfirmationModal
      visible={props.visible}
      title={`${t("common:delete")}?`}
      message={t("common:deleteModuleText")}
      cancelLabel={t("common:cancel")}
      confirmLabel={t("common:delete")}
      onDismiss={() => props.setVisible(false)}
      onConfirm={props.onDelete}
      destructive
    />
  );
}

export default DeleteModuleModal;

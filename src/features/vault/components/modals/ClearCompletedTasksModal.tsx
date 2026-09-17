import { useTranslation } from "react-i18next";
import ConfirmationModal from "../../../../shared/components/modals/ConfirmationModal";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onClear: () => void;
};

function ClearCompletedTasksModal(props: Props) {
  const { t } = useTranslation();

  return (
    <ConfirmationModal
      visible={props.visible}
      title={`${t("common:clearCompletedTasks")}?`}
      message={t("common:clearCompletedTasksText")}
      cancelLabel={t("common:cancel")}
      confirmLabel={t("common:delete")}
      onDismiss={() => props.setVisible(false)}
      onConfirm={props.onClear}
      destructive
    />
  );
}

export default ClearCompletedTasksModal;

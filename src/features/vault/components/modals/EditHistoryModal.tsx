import { ScrollView, StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useTheme } from "../../../../app/providers/ThemeProvider";
import Modal from "../../../../shared/components/modals/Modal";
import ModalSurface from "../../../../shared/components/modals/ModalSurface";
import { formatAbsoluteTime } from "../../../../shared/utils/Timestamp";
import {
  EditHistoryActionType,
  EditSessionLogEntry,
} from "../../utils/editHistory";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  entries: EditSessionLogEntry[];
};

const ACTION_ICON: Record<EditHistoryActionType, string> = {
  init: "circle-outline",
  title: "format-title",
  favorite: "star-outline",
  pin: "pin-outline",
  tags: "tag-outline",
  folder: "folder-outline",
  modules: "view-list-outline",
  module: "puzzle-outline",
  system: "cog-outline",
  undo: "undo-variant",
  redo: "redo-variant",
  save: "content-save",
};

function EditHistoryModal(props: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const hideModal = () => props.setVisible(false);
  const items = [...props.entries].reverse();
  const getLabel = (entry: EditSessionLogEntry) => {
    switch (entry.action) {
      case "title":
        return t("common:editHistoryTitleUpdated");
      case "module":
        return t("common:editHistoryModuleUpdated");
      case "modules":
        return entry.label;
      case "favorite":
        return t("common:editHistoryFavoriteUpdated");
      case "pin":
        return t("common:editHistoryPinUpdated");
      case "tags":
        return t("common:editHistoryTagsUpdated");
      case "folder":
        return entry.label;
      case "undo":
        return t("common:editHistoryUndo");
      case "redo":
        return t("common:editHistoryRedo");
      case "save":
        return t("common:editHistorySaved");
      case "init":
        return t("common:editHistoryOpened");
      default:
        return entry.label;
    }
  };

  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <ModalSurface
        width={340}
        minHeight={220}
        maxHeight={440}
        title={t("common:editHistory")}
        description={t("common:editHistoryDescription")}
        contentStyle={{ gap: 12 }}
      >
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="bodyMedium" style={{ opacity: 0.72 }}>
              {t("common:editHistoryEmpty")}
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ gap: 8 }}>
            {items.map((entry) => (
              <View
                key={entry.id}
                style={[
                  styles.item,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.outlineVariant,
                  },
                ]}
              >
                <View style={styles.iconWrap}>
                  <Icon
                    source={ACTION_ICON[entry.action] ?? "circle-outline"}
                    size={18}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                  <Text variant="bodyMedium">{getLabel(entry)}</Text>
                  <Text variant="bodySmall" style={{ opacity: 0.65 }}>
                    {formatAbsoluteTime(entry.timestamp)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </ModalSurface>
    </Modal>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconWrap: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default EditHistoryModal;

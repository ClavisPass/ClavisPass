import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { Icon, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useTheme } from "../../../../app/providers/ThemeProvider";
import AnimatedPressable from "../../../../shared/components/AnimatedPressable";
import Modal from "../../../../shared/components/modals/Modal";
import FolderType from "../../model/FolderType";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  folders: FolderType[];
  selectedFolder: FolderType | null | undefined;
  onSelectFolder: (folder: FolderType | null) => void;
};

function FolderSelectModal(props: Props) {
  const { theme, darkmode } = useTheme();
  const { t } = useTranslation();
  const { height } = useWindowDimensions();
  const hasMatchingSelectedFolder = Boolean(
    props.selectedFolder &&
      props.folders.some((folder) => folder.id === props.selectedFolder?.id),
  );

  const hideModal = () => props.setVisible(false);
  const modalHeight = height > 760 ? 420 : 320;

  const renderFolderItem = (
    label: string,
    onPress: () => void,
    selected: boolean
  ) => (
    <AnimatedPressable
      onPress={() => {
        onPress();
        hideModal();
      }}
      style={[
        styles.item,
        {
          backgroundColor: selected
            ? theme.colors.secondaryContainer
            : theme.colors.background,
          borderColor: selected
            ? theme.colors.primary
            : darkmode
              ? theme.colors.outlineVariant
              : "white",
        },
      ]}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemLabelWrap}>
          <Icon source="folder" size={20} color={theme.colors.primary} />
          <Text variant="bodyLarge" numberOfLines={1}>
            {label}
          </Text>
        </View>
        {selected ? (
          <Icon source="check" size={20} color={theme.colors.primary} />
        ) : null}
      </View>
    </AnimatedPressable>
  );

  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <View
        style={[
          styles.container,
          {
            height: modalHeight,
            backgroundColor: theme.colors.elevation.level2,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
        <View style={styles.header}>
          <Text variant="titleLarge">{t("common:selectFolder")}</Text>
          <Text variant="bodyMedium" style={{ opacity: 0.72 }}>
            {t("common:selectFolderDescription")}
          </Text>
        </View>

        <ScrollView
          style={{ width: "100%" }}
          contentContainerStyle={[
            styles.listContent,
            Platform.OS === "web" ? { width: "100%" } : null,
          ]}
          showsVerticalScrollIndicator={Platform.OS !== "web"}
        >
          {renderFolderItem(
            t("common:none"),
            () => props.onSelectFolder(null),
            !hasMatchingSelectedFolder
          )}
          {props.folders.map((folder) =>
            renderFolderItem(
              folder.name,
              () => props.onSelectFolder(folder),
              props.selectedFolder?.id === folder.id
            )
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    alignItems: "stretch",
    justifyContent: "center",
    flexDirection: "column",
    width: 340,
    gap: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  header: {
    gap: 4,
    paddingBottom: 2,
  },
  listContent: {
    gap: 8,
  },
  item: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  itemContent: {
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  itemLabelWrap: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

export default FolderSelectModal;

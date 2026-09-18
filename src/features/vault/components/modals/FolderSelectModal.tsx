import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useTheme } from "../../../../app/providers/ThemeProvider";
import AnimatedPressable from "../../../../shared/components/AnimatedPressable";
import Modal from "../../../../shared/components/modals/Modal";
import ModalSurface from "../../../../shared/components/modals/ModalSurface";
import FolderType from "../../model/FolderType";
import {
  DEFAULT_FOLDER_ICON,
  getFolderColor,
  getFolderIcon,
} from "../../utils/folderAppearance";
import AppIcon from "../../../../shared/components/icons/AppIcon";

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
  const modalHeight = Math.min(
    height > 760 ? 420 : 320,
    Math.max(260, height - 96),
  );

  const renderFolderItem = (
    key: string,
    label: string,
    onPress: () => void,
    selected: boolean,
    folder?: FolderType | null,
  ) => (
    <AnimatedPressable
      key={key}
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
          <AppIcon
            name={folder ? getFolderIcon(folder) : DEFAULT_FOLDER_ICON}
            size={20}
            color={
              folder
                ? (getFolderColor(folder) ?? theme.colors.primary)
                : theme.colors.primary
            }
          />
          <Text variant="bodyLarge" numberOfLines={1}>
            {label}
          </Text>
        </View>
        {selected ? (
          <AppIcon name="check" size={20} color={theme.colors.primary} />
        ) : null}
      </View>
    </AnimatedPressable>
  );

  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <ModalSurface
        width={340}
        height={modalHeight}
        title={t("common:selectFolder")}
        description={t("common:selectFolderDescription")}
        contentStyle={styles.surfaceContent}
      >
        <ScrollView
          style={{ width: "100%" }}
          contentContainerStyle={[
            styles.listContent,
            Platform.OS === "web" ? { width: "100%" } : null,
          ]}
          showsVerticalScrollIndicator={Platform.OS !== "web"}
        >
          {renderFolderItem(
            "__none__",
            t("common:none"),
            () => props.onSelectFolder(null),
            !hasMatchingSelectedFolder,
            null,
          )}
          {props.folders.map((folder) =>
            renderFolderItem(
              folder.id,
              folder.name,
              () => props.onSelectFolder(folder),
              props.selectedFolder?.id === folder.id,
              folder,
            ),
          )}
        </ScrollView>
      </ModalSurface>
    </Modal>
  );
}

const styles = StyleSheet.create({
  surfaceContent: {
    flex: 1,
    paddingTop: 0,
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

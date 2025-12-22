import React, { useCallback } from "react";
import { Pressable, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { Icon, IconButton, Text } from "react-native-paper";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import FolderType from "../../model/FolderType";
import AnimatedPressable from "../../../../shared/components/AnimatedPressable";
import { useTranslation } from "react-i18next";

type Props = {
  folder: FolderType[];
  setSelectedFolder?: (folder: FolderType | null) => void;
  deleteFolder: (folder: FolderType) => void;
  draggableDisabled?: boolean;
  persistFolderOrder: (nextFolders: FolderType[]) => void;
};

function DraggableFolderList(props: Props) {
  const { globalStyles, theme } = useTheme();
  const { t } = useTranslation();

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<FolderType>) => {
      return (
        <View
          style={{
            width: "100%",
            backgroundColor: theme.colors.background,
            borderRadius: 12,
            marginBottom: 4,
            opacity: isActive ? 0.9 : 1,
          }}
        >
          <View style={[globalStyles.folderContainer]}>
            <Pressable onPressIn={drag} disabled={props.draggableDisabled}>
              <Icon source="drag" size={20} />
            </Pressable>

            <AnimatedPressable
              style={{
                borderRadius: 12,
                padding: 10,
                flex: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
              onPress={
                props.setSelectedFolder
                  ? () => props.setSelectedFolder?.(item)
                  : undefined
              }
            >
              <>
                <Icon source="folder" color={theme.colors.primary} size={20} />
                <Text
                  style={{
                    userSelect: "none",
                    fontWeight: "bold",
                    fontSize: 15,
                  }}
                  variant="bodyMedium"
                >
                  {item.name}
                </Text>
              </>
            </AnimatedPressable>

            <IconButton
              icon="close"
              size={14}
              style={{ margin: 0 }}
              onPress={() => props.deleteFolder(item)}
            />
          </View>
        </View>
      );
    },
    [
      globalStyles.folderContainer,
      props.deleteFolder,
      props.draggableDisabled,
      props.setSelectedFolder,
      theme.colors.background,
      theme.colors.primary,
    ]
  );

  return (
    <View style={{ flex: 1, width: "100%" }}>
      {props.setSelectedFolder && (
        <View
          style={{
            width: "100%",
            backgroundColor: theme.colors.background,
            borderRadius: 12,
            marginBottom: 4,
          }}
        >
          <View style={[globalStyles.folderContainer]}>
            <Icon source="minus" size={20} />

            <AnimatedPressable
              style={{
                borderRadius: 12,
                padding: 10,
                flex: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginRight: 30,
                overflow: "hidden",
              }}
              onPress={() => props.setSelectedFolder?.(null)}
            >
              <>
                <Icon source="folder" size={20} color={theme.colors.primary} />
                <Text
                  style={{
                    userSelect: "none",
                    fontWeight: "bold",
                    fontSize: 15,
                  }}
                  variant="bodyMedium"
                >
                  {t("common:none")}
                </Text>
              </>
            </AnimatedPressable>
          </View>
        </View>
      )}
      <DraggableFlatList
        data={props.folder}
        renderItem={renderItem}
        keyExtractor={(item, index) => `drag-item-${item.id}-${index}`}
        activationDistance={props.draggableDisabled ? 10_000 : 8}
        scrollEnabled={!props.draggableDisabled}
        onDragEnd={(event) => {
          if (props.draggableDisabled) return;
          if (event?.data) props.persistFolderOrder(event.data);
        }}
      />
    </View>
  );
}

export default DraggableFolderList;

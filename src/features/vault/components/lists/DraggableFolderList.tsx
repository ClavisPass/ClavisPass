import React, { useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { Icon, IconButton, Text } from "react-native-paper";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import FolderType from "../../model/FolderType";
import AnimatedPressable from "../../../../shared/components/AnimatedPressable";
import { useTranslation } from "react-i18next";
import { getFolderIcon } from "../../utils/folderAppearance";
import { useDeferredDragStart } from "../../../../shared/hooks/useDeferredDragStart";

type Props = {
  folder: FolderType[];
  setSelectedFolder?: (folder: FolderType | null) => void;
  deleteFolder: (folder: FolderType) => void;
  openAppearance: (folder: FolderType) => void;
  draggableDisabled?: boolean;
  persistFolderOrder: (nextFolders: FolderType[]) => void;
};

const dragDropAnimationConfig = {
  damping: 32,
  mass: 0.12,
  overshootClamping: true,
  restDisplacementThreshold: 1,
  restSpeedThreshold: 1,
  stiffness: 420,
};

function FolderDragHandle({
  disabled,
  onPendingEnd,
  onPendingStart,
  onDragStart,
}: {
  disabled?: boolean;
  onPendingEnd?: () => void;
  onPendingStart?: () => void;
  onDragStart?: () => void;
}) {
  const deferredDragStartProps = useDeferredDragStart(onDragStart, undefined, {
    onPendingEnd,
    onPendingStart,
    startImmediately: true,
  });

  return (
    <Pressable disabled={disabled} {...deferredDragStartProps}>
      <Icon source="drag" size={20} />
    </Pressable>
  );
}

function DraggableFolderList(props: Props) {
  const { globalStyles, theme } = useTheme();
  const { t } = useTranslation();
  const [localFolders, setLocalFolders] = useState(props.folder);
  const [nativeScrollEnabled, setNativeScrollEnabled] = useState(true);

  useEffect(() => {
    setLocalFolders(props.folder);
  }, [props.folder]);

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
            <FolderDragHandle
              disabled={props.draggableDisabled}
              onPendingStart={() => setNativeScrollEnabled(false)}
              onPendingEnd={() => setNativeScrollEnabled(true)}
              onDragStart={drag}
            />

            <AnimatedPressable
              borderless={false}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => props.openAppearance(item)}
            >
              <Icon
                source={getFolderIcon(item)}
                color={item.color ?? theme.colors.primary}
                size={20}
              />
            </AnimatedPressable>

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
      props.openAppearance,
      props.setSelectedFolder,
      theme.colors.background,
      theme.colors.primary,
    ],
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
                overflow: "hidden",
              }}
              onPress={() => props.setSelectedFolder?.(null)}
            >
              <>
                <Icon
                  source="folder-outline"
                  size={20}
                  color={theme.colors.primary}
                />
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
        data={localFolders}
        extraData={localFolders}
        renderItem={renderItem}
        keyExtractor={(item) => `drag-item-${item.id}`}
        activationDistance={props.draggableDisabled ? 10_000 : 0}
        animationConfig={dragDropAnimationConfig}
        scrollEnabled={!props.draggableDisabled && nativeScrollEnabled}
        onDragEnd={(event) => {
          if (props.draggableDisabled) return;
          if (!event?.data) return;
          setLocalFolders(event.data);
          props.persistFolderOrder(event.data);
        }}
      />
    </View>
  );
}

export default DraggableFolderList;

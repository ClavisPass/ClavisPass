import React, { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { Divider, IconButton, Text } from "react-native-paper";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import FolderType from "../../model/FolderType";
import AnimatedPressable from "../../../../shared/components/AnimatedPressable";
import { useTranslation } from "react-i18next";
import { getFolderIcon } from "../../utils/folderAppearance";
import { useDeferredDragStart } from "../../../../shared/hooks/useDeferredDragStart";
import AppIcon from "../../../../shared/components/icons/AppIcon";

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

const fullWidthDividerStyle = {
  marginLeft: 0,
  marginRight: 0,
  width: "100%" as const,
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
      <AppIcon name="drag" size={20} />
    </Pressable>
  );
}

function DraggableFolderList(props: Props) {
  const { globalStyles, theme } = useTheme();
  const { t } = useTranslation();
  const [localFolders, setLocalFolders] = useState(props.folder);
  const [nativeScrollEnabled, setNativeScrollEnabled] = useState(true);
  const [dragging, setDragging] = useState(false);

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
            opacity: isActive ? 0.9 : 1,
          }}
        >
          <View
            style={[
              globalStyles.folderContainer,
              {
                height: 48,
                paddingHorizontal: 10,
                backgroundColor: "transparent",
                gap: 8,
              },
            ]}
          >
            <FolderDragHandle
              disabled={props.draggableDisabled}
              onPendingStart={() => setNativeScrollEnabled(false)}
              onPendingEnd={() => setNativeScrollEnabled(true)}
              onDragStart={drag}
            />

            <AnimatedPressable
              borderless={false}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: theme.colors.outlineVariant,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.colors.surfaceVariant,
              }}
              onPress={() => props.openAppearance(item)}
            >
              <AppIcon
                name={getFolderIcon(item)}
                color={item.color ?? theme.colors.primary}
                size={20}
              />
            </AnimatedPressable>

            <AnimatedPressable
              style={{
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 2,
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
                    fontWeight: "600",
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
              size={16}
              iconColor={theme.colors.onSurfaceVariant}
              style={{ margin: 0, width: 30, height: 30 }}
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
      theme.colors.onSurfaceVariant,
      theme.colors.outlineVariant,
      theme.colors.primary,
      theme.colors.surfaceVariant,
    ],
  );

  return (
    <View style={{ flex: 1, width: "100%" }}>
      {props.setSelectedFolder && (
        <View
          style={{
            width: "100%",
            backgroundColor: theme.colors.background,
          }}
        >
          <View
            style={[
              globalStyles.folderContainer,
              {
                height: 48,
                paddingHorizontal: 10,
                backgroundColor: "transparent",
                gap: 8,
              },
            ]}
          >
            <AppIcon name="minus" size={20} />

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
                <AppIcon
                  name="folder-outline"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text
                  style={{
                    userSelect: "none",
                    fontWeight: "600",
                    fontSize: 15,
                  }}
                  variant="bodyMedium"
                >
                  {t("common:none")}
                </Text>
              </>
            </AnimatedPressable>
          </View>
          {localFolders.length > 0 ? (
            <Divider style={fullWidthDividerStyle} />
          ) : null}
        </View>
      )}
      <DraggableFlatList
        data={localFolders}
        extraData={localFolders}
        renderItem={renderItem}
        keyExtractor={(item) => `drag-item-${item.id}`}
        ItemSeparatorComponent={
          dragging ? undefined : () => <Divider style={fullWidthDividerStyle} />
        }
        activationDistance={props.draggableDisabled ? 10_000 : 0}
        animationConfig={dragDropAnimationConfig}
        scrollEnabled={!props.draggableDisabled && nativeScrollEnabled}
        onDragBegin={() => setDragging(true)}
        onDragEnd={(event) => {
          setDragging(false);
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

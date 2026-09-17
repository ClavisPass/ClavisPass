import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
} from "@hello-pangea/dnd";

import { StyleSheet, View } from "react-native";
import { Divider, IconButton, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import FolderType from "../../model/FolderType";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import AnimatedPressable from "../../../../shared/components/AnimatedPressable";
import { getFolderIcon } from "../../utils/folderAppearance";
import AppIcon from "../../../../shared/components/icons/AppIcon";

type Props = {
  folder: FolderType[];
  setSelectedFolder?: (folder: FolderType | null) => void;
  deleteFolder: (folder: FolderType) => void;
  openAppearance: (folder: FolderType) => void;
  draggableDisabled?: boolean;
  persistFolderOrder: (nextFolders: FolderType[]) => void;
};

const reorder = (list: FolderType[], startIndex: number, endIndex: number) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: "none",
  top: "auto",
  left: "auto",
  ...draggableStyle,
});

const getListStyle = () => ({
  flex: 1,
  width: "100%",
  overflowX: "hidden" as const,
  overflowY: "auto" as const,
  paddingRight: 2,
  marginRight: -2,
});

const fullWidthDividerStyle = {
  marginLeft: 0,
  marginRight: 0,
  width: "100%" as const,
};

function DraggableFolderListWeb(props: Props) {
  const { globalStyles, theme } = useTheme();
  const { t } = useTranslation();

  const onDragEnd = (result: DropResult) => {
    if (props.draggableDisabled) return;
    if (!result.destination) return;

    const reordered = reorder(
      props.folder,
      result.source.index,
      result.destination.index,
    );

    props.persistFolderOrder(reordered);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="droppable"
        isDropDisabled={!!props.draggableDisabled}
      >
        {(provided: DroppableProvided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle()}
          >
            {props.setSelectedFolder && (
              <>
                <View
                  style={[
                    globalStyles.folderContainer,
                    {
                      height: 48,
                      paddingHorizontal: 10,
                      backgroundColor: theme.colors.background,
                      gap: 8,
                    },
                  ]}
                >
                  <AppIcon name="minus" size={20} />

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
                {props.folder.length > 0 ? (
                  <Divider style={fullWidthDividerStyle} />
                ) : null}
              </>
            )}

            {props.folder.map((item: FolderType, index: number) => (
              <React.Fragment key={item.id + "-" + index}>
                <Draggable
                  draggableId={item.id + "-" + index}
                  index={index}
                  isDragDisabled={!!props.draggableDisabled}
                >
                  {(
                    provided: DraggableProvided,
                    snapshot: DraggableStateSnapshot,
                  ) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style,
                        ),
                        opacity: props.draggableDisabled ? 0.8 : 1,
                      }}
                    >
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
                          <AppIcon name="drag" size={20} />

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
                              size={20}
                              color={item.color ?? theme.colors.primary}
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
                    </div>
                  )}
                </Draggable>
                {index < props.folder.length - 1 ? (
                  <Divider style={fullWidthDividerStyle} />
                ) : null}
              </React.Fragment>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default DraggableFolderListWeb;

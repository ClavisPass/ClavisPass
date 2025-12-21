import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DroppableStateSnapshot,
} from "@hello-pangea/dnd";

import { View } from "react-native";
import { Icon, IconButton, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import FolderType from "../../model/FolderType";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import AnimatedPressable from "../../../../shared/components/AnimatedPressable";
import { useVault } from "../../../../app/providers/VaultProvider";


type Props = {
  folder: FolderType[];
  setSelectedFolder?: (folder: FolderType | null) => void;
  deleteFolder: (folder: FolderType) => void;
  draggableDisabled?: boolean;
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

const getListStyle = (isDraggingOver: boolean) => ({
  flex: 1,
  width: "100%",
  overflow: "auto",
  gap: "8px",
});

function DraggableFolderListWeb(props: Props) {
  const { globalStyles, theme } = useTheme();
  const { t } = useTranslation();
  const vault = useVault();

  const persistFolderOrder = (nextFolders: FolderType[]) => {
    vault.update((draft) => {
      draft.folder = nextFolders;
    });
  };

  const onDragEnd = (result: DropResult) => {
    if (props.draggableDisabled) return;
    if (!result.destination) return;

    const reordered = reorder(
      props.folder,
      result.source.index,
      result.destination.index
    );

    persistFolderOrder(reordered);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="droppable"
        isDropDisabled={!!props.draggableDisabled}
      >
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {props.setSelectedFolder && (
              <View style={[globalStyles.folderContainer, { marginBottom: 4 }]}>
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
                  }}
                  onPress={() => props.setSelectedFolder?.(null)}
                >
                  <>
                    <Icon
                      source="folder"
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
            )}

            {props.folder.map((item: FolderType, index: number) => (
              <Draggable
                key={item.id + "-" + index}
                draggableId={item.id + "-" + index}
                index={index}
                isDragDisabled={!!props.draggableDisabled}
              >
                {(
                  provided: DraggableProvided,
                  snapshot: DraggableStateSnapshot
                ) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      ),
                      marginBottom: 4,
                      opacity: props.draggableDisabled ? 0.8 : 1,
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        backgroundColor: theme.colors.background,
                        borderRadius: 12,
                      }}
                    >
                      <View style={globalStyles.folderContainer}>
                        <Icon source="drag" size={20} />

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
                            <Icon
                              source="folder"
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
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default DraggableFolderListWeb;
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
import { Icon, IconButton, Text, TouchableRipple } from "react-native-paper";
import theme from "../../../ui/theme";
import { useTheme } from "../../../contexts/ThemeProvider";
import changeFolder from "../../../utils/changeFolder";
import { DataContextType, useData } from "../../../contexts/DataProvider";
import FolderType from "../../../types/FolderType";

type Props = {
  data: DataContextType;
  folder: FolderType[];
  setSelectedFolder?: (folder: FolderType | null) => void;
  deleteFolder: (folder: FolderType) => void;
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
  const { globalStyles } = useTheme();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reordered = reorder(
      props.folder,
      result.source.index,
      result.destination.index
    );

    changeFolder(reordered, props.data);
    props.data.setShowSave(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {props.setSelectedFolder && (
              <View style={[globalStyles.folderContainer, { marginBottom: 4 }]}>
                <Icon source="minus" size={20} />

                <TouchableRipple
                  style={{
                    borderRadius: 12,
                    padding: 10,
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginRight: 30
                  }}
                  onPress={() => props.setSelectedFolder?.(null)}
                  rippleColor="rgba(0, 0, 0, .32)"
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
                      {"None"}
                    </Text>
                  </>
                </TouchableRipple>
              </View>
            )}
            {props.folder.map((item: FolderType, index: number) => (
              <Draggable
                key={item.id + "-" + index}
                draggableId={item.id + "-" + index}
                index={index}
              >
                {(
                  provided: DraggableProvided,
                  snapshot: DraggableStateSnapshot
                ) => {
                  const isLast = index === props.folder.length - 1;
                  return (
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
                      }}
                    >
                      <View style={globalStyles.folderContainer}>
                        <Icon source="drag" size={20} />

                        <TouchableRipple
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
                          rippleColor="rgba(0, 0, 0, .32)"
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
                        </TouchableRipple>

                        <IconButton
                          icon="close"
                          size={14}
                          style={{ margin: 0 }}
                          onPress={() => props.deleteFolder(item)}
                        />
                      </View>
                    </div>
                  );
                }}
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

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

import ValuesType from "../../../types/ValuesType";
import ModulesType, { ModuleType } from "../../../types/ModulesType";
import getModule from "../../../utils/getModule";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { useTheme } from "../../../contexts/ThemeProvider";
import FastAccessType from "../../../types/FastAccessType";
import MetaInformationModule from "../../modules/MetaInformationModule";
import { StackNavigationProp } from "@react-navigation/stack/lib/typescript/src/types";
import { RootStackParamList } from "../../../stacks/Stack";

type Props = {
  value: ValuesType;
  setValue: (value: ValuesType) => void;
  changeModules: (data: ModulesType) => void;
  deleteModule: (id: string) => void;
  changeModule: (module: ModuleType) => void;
  edit: boolean;
  setDiscardoChanges: () => void;
  showAddModuleModal: () => void;
  fastAccess: FastAccessType | null;
  navigation: StackNavigationProp<RootStackParamList, "Edit", undefined>
};

const reorder = (list: any, startIndex: number, endIndex: number) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: "none",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  flex: 1,
  width: "100%",
  overflow: "auto",
});

function DraggableModulesListWeb(props: Props) {
  const { theme } = useTheme();
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reordered = reorder(
      props.value.modules,
      result.source.index,
      result.destination.index
    );

    props.changeModules(reordered);
    props.setDiscardoChanges();
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
            {props.value.modules.map((item: ModuleType, index: number) => (
              <Draggable
                key={item.id}
                draggableId={item.id}
                index={index}
                isDragDisabled={!props.edit}
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
                      marginBottom: 8,
                    }}
                  >
                    {getModule(
                      item,
                      props.edit,
                      () => {},
                      props.deleteModule,
                      props.changeModule,
                      props.fastAccess,
                      props.navigation
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {props.edit ? (
              <View
                style={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <IconButton
                  icon={"plus"}
                  iconColor={theme.colors.primary}
                  style={{ margin: 0 }}
                  onPress={props.showAddModuleModal}
                  size={20}
                  selected={true}
                  mode="contained-tonal"
                />
              </View>
            ) : (
              <MetaInformationModule
                lastUpdated={props.value.lastUpdated}
                created={props.value.created}
              />
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default DraggableModulesListWeb;

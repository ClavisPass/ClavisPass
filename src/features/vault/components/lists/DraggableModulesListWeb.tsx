import React, { use, useEffect, useRef, useState } from "react";
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
import { Chip, IconButton } from "react-native-paper";
import { useTranslation } from "react-i18next";
import ModulesEnum from "../../model/ModulesEnum";
import ModulesType, { ModuleType } from "../../model/ModulesType";
import ValuesType from "../../model/ValuesType";
import FastAccessType from "../../../fastaccess/model/FastAccessType";
import { RootStackParamList } from "../../../../app/navigation/stacks/Stack";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import predictNextModule from "../../utils/predictNextModule";
import getModule from "../../utils/getModule";
import getModuleNameByEnum from "../../utils/getModuleNameByEnum";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Props = {
  value: ValuesType;
  setValue: (value: ValuesType) => void;
  changeModules: (data: ModulesType) => void;
  deleteModule: (id: string) => void;
  changeModule: (module: ModuleType) => void;
  addModule: (module: ModulesEnum) => void;
  setDiscardoChanges: () => void;
  showAddModuleModal: () => void;
  fastAccess: FastAccessType | null;
  navigation: NativeStackNavigationProp<RootStackParamList, "Edit", undefined>;
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
  const { t } = useTranslation();
  const [modulePrediction, setModulePrediction] = useState<ModulesEnum | null>(
    null
  );

  const listRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

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

  useEffect(() => {
    setModulePrediction(predictNextModule(props.value.modules));
  }, [props.value.modules]);

  const modulesLength = props.value.modules.length;
  const prevLenRef = useRef(modulesLength);
  useEffect(() => {
    if (modulesLength > prevLenRef.current) {
      scrollToBottom();
    }
    prevLenRef.current = modulesLength;
  }, [modulesLength]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            {...provided.droppableProps}
            ref={(el) => {
              provided.innerRef(el);
              listRef.current = el;
            }}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {props.value.modules.map((item: ModuleType, index: number) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
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
                      () => {},
                      props.deleteModule,
                      props.changeModule,
                      props.fastAccess,
                      props.navigation,
                      props.value.title
                    )}
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}

            <div ref={bottomRef} style={{ height: 1 }} />

            <View
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                paddingBottom: 8,
                position: "relative",
              }}
            >
              {modulePrediction && (
                <Chip
                  icon={"plus"}
                  onPress={() => {
                    props.addModule(modulePrediction);
                    setTimeout(scrollToBottom, 0);
                  }}
                  style={{ position: "absolute", left: 8 }}
                >
                  {getModuleNameByEnum(modulePrediction, t)}
                </Chip>
              )}

              <IconButton
                icon={"plus"}
                iconColor={theme.colors.primary}
                style={{ margin: 0 }}
                onPress={() => {
                  props.showAddModuleModal();
                }}
                size={20}
                selected={true}
                mode="contained-tonal"
              />
            </View>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default DraggableModulesListWeb;

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

import ValuesType from "../../../types/ValuesType";
import ModulesType, { ModuleType } from "../../../types/ModulesType";
import getModule from "../../../utils/getModule";
import { View } from "react-native";
import { Chip, IconButton } from "react-native-paper";
import { useTheme } from "../../../contexts/ThemeProvider";
import FastAccessType from "../../../types/FastAccessType";
import MetaInformationModule from "../../modules/MetaInformationModule";
import { StackNavigationProp } from "@react-navigation/stack/lib/typescript/src/types";
import { RootStackParamList } from "../../../stacks/Stack";
import ModulesEnum from "../../../enums/ModulesEnum";
import predictNextModule from "../../../utils/predictNextModule";
import getModuleNameByEnum from "../../../utils/getModuleNameByEnum";
import { useTranslation } from "react-i18next";

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
  navigation: StackNavigationProp<RootStackParamList, "Edit", undefined>;
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
  const [modulePrediction, setModulePrediction] = useState<ModulesEnum | null>(null);

  // ⬇️ Refs für Scrollen
  const listRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    // Methode 1: Sentinel
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    // (Optional) Methode 2: direkt scrollen
    // if (listRef.current) {
    //   listRef.current.scroll({ top: listRef.current.scrollHeight, behavior: "smooth" });
    // }
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
    // (typisch: nach Reorder nicht auto scrollen)
  };

  // 🧠 Vorhersage aktualisieren
  useEffect(() => {
    setModulePrediction(predictNextModule(props.value.modules));
  }, [props.value.modules]);

  // ✅ Auto-Scroll wenn Anzahl der Module steigt (neues Element unten)
  const modulesLength = props.value.modules.length;
  const prevLenRef = useRef(modulesLength);
  useEffect(() => {
    if (modulesLength > prevLenRef.current) {
      // neues Item hinzugekommen -> nach unten
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
            // ⬇️ beide Refs kombinieren (Pangea braucht seinen innerRef)
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
                      props.navigation
                    )}
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}

            {/* ⬇️ Scroll-Sentinel am Ende */}
            <div ref={bottomRef} style={{ height: 1 }} />

            {/* Footer mit Add-Buttons */}
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

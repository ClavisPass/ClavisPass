import React, { useEffect, useRef, useState } from "react";
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

import { StyleSheet, View } from "react-native";
import { Chip, IconButton, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import ModulesEnum from "../../model/ModulesEnum";
import ModulesType, { ModuleType } from "../../model/ModulesType";
import ValuesType from "../../model/ValuesType";
import FastAccessType from "../../../fastaccess/model/FastAccessType";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import predictNextModule from "../../utils/predictNextModule";
import getModule from "../../utils/getModule";
import getModuleNameByEnum from "../../utils/getModuleNameByEnum";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../../../app/navigation/model/types";

type Props = {
  value: ValuesType;
  changeModules: (data: ModulesType) => void;
  deleteModule: (id: string) => void;
  changeModule: (module: ModuleType) => void;
  addModule: (module: ModulesEnum) => void;
  showAddModuleModal: () => void;
  fastAccess: FastAccessType | null;
  navigation: NativeStackNavigationProp<HomeStackParamList, "Edit", undefined>;
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

const styles = StyleSheet.create({
  footer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    paddingBottom: 8,
    position: "relative",
  },
  predictionChip: {
    position: "absolute",
    left: 8,
    maxWidth: "60%",
  },
  predictionChipContent: {
    flexShrink: 1,
    minWidth: 0,
  },
});

function DraggableModulesListWeb(props: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [modulePrediction, setModulePrediction] = useState<ModulesEnum | null>(
    null
  );
  const [footerWidth, setFooterWidth] = useState(0);
  const [predictionChipWidth, setPredictionChipWidth] = useState(0);

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

  const addButtonBaseWidth = 40;
  const leftPadding = 8;
  const safetyGap = 4;
  const centeredButtonLeft = Math.max(0, (footerWidth - addButtonBaseWidth) / 2);
  const predictionChipRight = leftPadding + predictionChipWidth;
  const requiredShift =
    footerWidth > 0
      ? Math.max(0, predictionChipRight + safetyGap - centeredButtonLeft)
      : 0;

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
              style={styles.footer}
              onLayout={(event) => {
                setFooterWidth(event.nativeEvent.layout.width);
              }}
            >
              {modulePrediction && (
                <Chip
                  icon={"plus"}
                  onPress={() => {
                    props.addModule(modulePrediction);
                    setTimeout(scrollToBottom, 0);
                  }}
                  style={styles.predictionChip}
                  onLayout={(event) => {
                    setPredictionChipWidth(event.nativeEvent.layout.width);
                  }}
                  compact
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.predictionChipContent}
                  >
                    {getModuleNameByEnum(modulePrediction, t)}
                  </Text>
                </Chip>
              )}

              <IconButton
                icon={"plus"}
                iconColor={theme.colors.primary}
                style={{ margin: 0, transform: [{ translateX: requiredShift }] }}
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

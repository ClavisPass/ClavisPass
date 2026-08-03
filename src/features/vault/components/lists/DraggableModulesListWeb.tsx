import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DropResult,
  Droppable,
  DroppableProvided,
} from "@hello-pangea/dnd";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { ModuleType } from "../../model/ModulesType";
import getModule from "../../utils/getModule";
import predictNextModule from "../../utils/predictNextModule";
import {
  DraggableModulesFooter,
  DraggableModulesListProps,
  reorderModules,
} from "./DraggableModulesList.shared";
import { WebDragHandlePropsProvider } from "../EditRowControlsContainer";

const getItemStyle = (draggableStyle: any) => ({
  userSelect: "none",
  ...draggableStyle,
});

function DraggableModulesListWeb(props: DraggableModulesListProps) {
  const { t } = useTranslation();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const modulePrediction = useMemo(
    () => predictNextModule(props.value.modules),
    [props.value.modules],
  );

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      props.changeModules(
        reorderModules(
          props.value.modules,
          result.source.index,
          result.destination.index,
        ),
      );
    },
    [props.changeModules, props.value.modules],
  );

  const previousLengthRef = useRef(props.value.modules.length);
  useEffect(() => {
    const nextLength = props.value.modules.length;
    if (nextLength > previousLengthRef.current) {
      scrollToBottom();
    }
    previousLengthRef.current = nextLength;
  }, [props.value.modules.length, scrollToBottom]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="modules-droppable">
        {(provided: DroppableProvided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              flex: 1,
              width: "100%",
              overflow: "auto",
            }}
          >
            {props.value.modules.map((item: ModuleType, index: number) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(draggableProvided: DraggableProvided) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    style={{
                      ...getItemStyle(draggableProvided.draggableProps.style),
                      marginBottom: 8,
                    }}
                  >
                    <WebDragHandlePropsProvider
                      dragHandleProps={draggableProvided.dragHandleProps}
                    >
                      {getModule(
                        item,
                        () => {},
                        props.deleteModule,
                        props.changeModule,
                        props.fastAccess,
                        props.navigation,
                        props.value.title,
                      )}
                    </WebDragHandlePropsProvider>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
            <div ref={bottomRef} style={{ height: 1 }} />

            <DraggableModulesFooter
              modulePrediction={modulePrediction}
              onAddPredictedModule={() => {
                if (!modulePrediction) return;
                props.addModule(modulePrediction);
                setTimeout(scrollToBottom, 0);
              }}
              t={t}
            />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default DraggableModulesListWeb;

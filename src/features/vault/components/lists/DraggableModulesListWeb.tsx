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
    <div style={{ flex: 1, width: "100%", position: "relative" }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="modules-droppable">
          {(provided: DroppableProvided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: "100%",
                width: "100%",
                overflow: "auto",
                paddingBottom: props.footer ? 0 : undefined,
                boxSizing: "border-box",
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
                          props.moduleAutoFocus ?? true,
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
              {props.footer ? (
                <div style={{ marginTop: "auto", paddingTop: 8 }}>
                  {props.footer}
                </div>
              ) : null}
            </div>
          )}
        </Droppable>
        {props.stickyFooter ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: props.stickyFooterBottomInset ?? 0,
              zIndex: 10,
            }}
          >
            {props.stickyFooter}
          </div>
        ) : null}
      </DragDropContext>
    </div>
  );
}

export default DraggableModulesListWeb;

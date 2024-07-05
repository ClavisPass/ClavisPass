import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ValuesType from "../../types/ValuesType";
import ModulesType, { ModuleType } from "../../types/ModulesType";
import getModule from "../../utils/getModule";

type Props = {
  value: ValuesType;
  setValue: (value: ValuesType) => void;
  changeModules: (data: ModulesType) => void;
  deleteModule: (id: string) => void;
  edit: boolean;
};

// a little function to help us with reordering the result
const reorder = (list: any, startIndex: any, endIndex: any) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: "none",
  //background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  //background: isDraggingOver ? "lightblue" : "lightgrey",
  flex: 1,
  width: "100%",
});

function DraggableModulesListWeb(props: Props) {
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const itemsChange = reorder(
      props.value.modules,
      result.source.index,
      result.destination.index
    );
    props.changeModules(itemsChange);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {props.value.modules.map((item: ModuleType, index: number) => (
              <Draggable
                isDragDisabled={!props.edit}
                key={item.id}
                draggableId={item.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    {getModule(item, props.edit, () => {}, props.deleteModule)}
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

export default DraggableModulesListWeb;

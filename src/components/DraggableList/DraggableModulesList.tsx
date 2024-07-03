import React, { useCallback, useEffect } from "react";
import { View, Pressable } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
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

function DraggableModulesList(props: Props) {
  useEffect(() => {
    console.log(props.edit);
  }, [props.edit]);
  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<ModuleType>) => {
      return (
        <Pressable
          onLongPress={() => {
            //if (props.edit) {
            console.log(props.edit);
            drag();
            //}
          }}
        >
          {getModule(item, props.edit, () => {}, props.deleteModule)}
        </Pressable>
      );
    },
    [props.edit]
  );

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <DraggableFlatList
        data={props.value.modules}
        renderItem={renderItem}
        keyExtractor={(item, index) => `draggable-item-${item.id}`}
        onDragEnd={({ data }) => props.changeModules(data)}
      />
    </View>
  );
}

export default DraggableModulesList;

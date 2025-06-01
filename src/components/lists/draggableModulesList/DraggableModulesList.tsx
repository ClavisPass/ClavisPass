import React, { useCallback } from "react";
import { View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import ValuesType from "../../../types/ValuesType";
import ModulesType, { ModuleType } from "../../../types/ModulesType";
import getModule from "../../../utils/getModule";

type Props = {
  value: ValuesType;
  setValue: (value: ValuesType) => void;
  changeModules: (data: ModulesType) => void;
  deleteModule: (id: string) => void;
  changeModule: (module: ModuleType) => void;
  edit: boolean;
  setDiscardoChanges: () => void;
};

function DraggableModulesList(props: Props) {
  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<ModuleType>) => {
      return getModule(
        item,
        props.edit,
        drag,
        props.deleteModule,
        props.changeModule
      );
    },
    [props.edit, props.value]
  );

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <DraggableFlatList
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        data={props.value.modules}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => {
          props.setValue({
            ...props.value,
            modules: data,
          });
          props.setDiscardoChanges();
        }}
      />
    </View>
  );
}

export default DraggableModulesList;

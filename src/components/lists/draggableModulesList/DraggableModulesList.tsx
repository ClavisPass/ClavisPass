import React, { useCallback } from "react";
import { View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import ValuesType from "../../../types/ValuesType";
import ModulesType, { ModuleType } from "../../../types/ModulesType";
import getModule from "../../../utils/getModule";
import { IconButton } from "react-native-paper";
import { useTheme } from "../../../contexts/ThemeProvider";

type Props = {
  value: ValuesType;
  setValue: (value: ValuesType) => void;
  changeModules: (data: ModulesType) => void;
  deleteModule: (id: string) => void;
  changeModule: (module: ModuleType) => void;
  edit: boolean;
  setDiscardoChanges: () => void;
  showAddModuleModal: () => void;
};

function DraggableModulesList(props: Props) {
  const { theme } = useTheme();
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
        ListFooterComponent={
          <>
            {props.edit && (
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
            )}
          </>
        }
      />
    </View>
  );
}

export default DraggableModulesList;

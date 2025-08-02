import React, { useCallback } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import ValuesType from "../../../types/ValuesType";
import ModulesType, { ModuleType } from "../../../types/ModulesType";
import getModule from "../../../utils/getModule";
import { IconButton } from "react-native-paper";
import { useTheme } from "../../../contexts/ThemeProvider";
import FastAccessType from "../../../types/FastAccessType";
import MetaInformationModule from "../../modules/MetaInformationModule";

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
        props.changeModule,
        props.fastAccess
      );
    },
    [props.edit, props.value]
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, width: "100%" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={40}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            keyboardShouldPersistTaps="handled"
            ListFooterComponent={
              props.edit ? (
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
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
              )
            }
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default DraggableModulesList;

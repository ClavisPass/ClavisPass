import React, { useCallback, useEffect, useState } from "react";
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
import { Chip, IconButton } from "react-native-paper";
import { useTheme } from "../../../contexts/ThemeProvider";
import FastAccessType from "../../../types/FastAccessType";
import MetaInformationModule from "../../modules/MetaInformationModule";
import { StackNavigationProp } from "@react-navigation/stack/lib/typescript/src/types";
import { RootStackParamList } from "../../../stacks/Stack";
import ModulesEnum from "../../../enums/ModulesEnum";
import predictNextModule from "../../../utils/predictNextModule";
import getModuleNameByEnum from "../../../utils/getModuleNameByEnum";

type Props = {
  value: ValuesType;
  setValue: (value: ValuesType) => void;
  changeModules: (data: ModulesType) => void;
  deleteModule: (id: string) => void;
  changeModule: (module: ModuleType) => void;
  addModule: (module: ModulesEnum) => void;
  edit: boolean;
  setDiscardoChanges: () => void;
  showAddModuleModal: () => void;
  fastAccess: FastAccessType | null;
  navigation: StackNavigationProp<RootStackParamList, "Edit", undefined>;
};

function DraggableModulesList(props: Props) {
  const { theme } = useTheme();

  const [modulePrediction, setModulePrediction] = useState<ModulesEnum | null>(
    null
  );

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<ModuleType>) => {
      return getModule(
        item,
        props.edit,
        drag,
        props.deleteModule,
        props.changeModule,
        props.fastAccess,
        props.navigation
      );
    },
    [props.edit, props.value]
  );

  useEffect(() => {
    setModulePrediction(predictNextModule(props.value.modules));
  }, [props.value.modules]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, width: "100%" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={40}
    >
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
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          ListFooterComponent={
            props.edit ? (
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {modulePrediction && (
                  <Chip
                    icon={"plus"}
                    onPress={() => {
                      props.addModule(modulePrediction);
                    }}
                    style={{ position: "absolute", left: 8 }}
                  >
                    {getModuleNameByEnum(modulePrediction)}
                  </Chip>
                )}
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
    </KeyboardAvoidingView>
  );
}

export default DraggableModulesList;

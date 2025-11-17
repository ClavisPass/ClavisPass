import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import ValuesType from "../../../types/ValuesType";
import ModulesType, { ModuleType } from "../../../types/ModulesType";
import getModule from "../../../utils/getModule";
import { Chip, IconButton } from "react-native-paper";
import { useTheme } from "../../../contexts/ThemeProvider";
import FastAccessType from "../../../types/FastAccessType";
import { StackNavigationProp } from "@react-navigation/stack/lib/typescript/src/types";
import { RootStackParamList } from "../../../stacks/Stack";
import ModulesEnum from "../../../enums/ModulesEnum";
import predictNextModule from "../../../utils/predictNextModule";
import getModuleNameByEnum from "../../../utils/getModuleNameByEnum";
import { InteractionManager } from "react-native";
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

function DraggableModulesList(props: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [modulePrediction, setModulePrediction] = useState<ModulesEnum | null>(null);

  // ⬇️ Ref auf die Liste + Content-Höhe für Fallback
  const listRef = useRef<any>(null);
  const contentHeightRef = useRef(0);

  const scrollToBottom = () => {
    const list = listRef.current as any;
    if (!list) return;

    // Versuch 1: native scrollToEnd (von FlatList)
    if (typeof list.scrollToEnd === "function") {
      // Kurz warten, bis Layout fertig ist
      requestAnimationFrame(() => {
        InteractionManager.runAfterInteractions(() => {
          list.scrollToEnd({ animated: true });
        });
      });
      return;
    }

    // Fallback: scrollToOffset mit bekannter Content-Höhe
    requestAnimationFrame(() => {
      InteractionManager.runAfterInteractions(() => {
        const target = Math.max(0, contentHeightRef.current - 1);
        if (typeof list.scrollToOffset === "function") {
          list.scrollToOffset({ offset: target, animated: true });
        }
      });
    });
  };

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<ModuleType>) => {
      return getModule(
        item,
        drag,
        props.deleteModule,
        props.changeModule,
        props.fastAccess,
        props.navigation,
        props.value.title
      );
    },
    [props.value, props.fastAccess, props.navigation, props.deleteModule, props.changeModule]
  );

  useEffect(() => {
    setModulePrediction(predictNextModule(props.value.modules));
  }, [props.value.modules]);

  // ✅ Auto-Scroll wenn Anzahl der Module steigt (neues Modul hinzugefügt)
  const prevLenRef = useRef(props.value.modules.length);
  useEffect(() => {
    const curr = props.value.modules.length;
    const prev = prevLenRef.current;
    if (curr > prev) {
      scrollToBottom();
    }
    prevLenRef.current = curr;
  }, [props.value.modules.length]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, width: "100%" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={40}
    >
      <View style={{ flex: 1, width: "100%" }}>
        <DraggableFlatList
          ref={listRef}
          data={props.value.modules}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => {
            props.setValue({
              ...props.value,
              modules: data,
            });
            props.setDiscardoChanges();
            // Nach Reorder kein Auto-Scroll
          }}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          // Fallback-Daten für scrollToOffset
          onContentSizeChange={(_, height) => {
            contentHeightRef.current = height;
          }}
          ListFooterComponent={
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
                    // Optionales sofortiges Feedback; der Effekt oben greift ohnehin
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
                  // Optional sofort scrollen (Effekt deckt es später ab)
                  setTimeout(scrollToBottom, 0);
                }}
                size={20}
                selected={true}
                mode="contained-tonal"
              />
            </View>
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

export default DraggableModulesList;

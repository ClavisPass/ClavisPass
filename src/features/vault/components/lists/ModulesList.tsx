import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  InteractionManager,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

import { ModuleType } from "../../model/ModulesType";
import getModule from "../../utils/getModule";
import predictNextModule from "../../utils/predictNextModule";
import {
  DraggableModulesFooter,
  DraggableModulesListProps,
} from "./DraggableModulesList.shared";

type Props = Omit<DraggableModulesListProps, "changeModules">;

function ModulesList(props: Props) {
  const { t } = useTranslation();

  const scrollRef = useRef<ScrollView>(null);
  const previousLengthRef = useRef(props.value.modules.length);

  const modulePrediction = useMemo(
    () => predictNextModule(props.value.modules),
    [props.value.modules],
  );

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      InteractionManager.runAfterInteractions(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      });
    });
  }, []);

  useEffect(() => {
    const nextLength = props.value.modules.length;
    if (nextLength > previousLengthRef.current) {
      scrollToBottom();
    }
    previousLengthRef.current = nextLength;
  }, [props.value.modules.length, scrollToBottom]);

  const renderModule = useCallback(
    (item: ModuleType) =>
      getModule(
        item,
        undefined,
        props.deleteModule,
        props.changeModule,
        props.fastAccess,
        props.navigation,
        props.value.title,
      ),
    [
      props.changeModule,
      props.deleteModule,
      props.fastAccess,
      props.navigation,
      props.value.title,
    ],
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, width: "100%" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={40}
    >
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
      >
        {props.value.modules.map((item) => (
          <View key={item.id}>{renderModule(item)}</View>
        ))}
        <DraggableModulesFooter
          modulePrediction={modulePrediction}
          onAddPredictedModule={() => {
            if (!modulePrediction) return;
            props.addModule(modulePrediction);
            setTimeout(scrollToBottom, 0);
          }}
          t={t}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default React.memo(ModulesList);

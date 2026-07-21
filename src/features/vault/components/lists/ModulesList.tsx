import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

import { useTheme } from "../../../../app/providers/ThemeProvider";
import { ModuleType } from "../../model/ModulesType";
import getModule from "../../utils/getModule";
import predictNextModule from "../../utils/predictNextModule";
import {
  DraggableModulesFooter,
  DraggableModulesListProps,
  getFooterButtonShift,
} from "./DraggableModulesList.shared";

type Props = Omit<DraggableModulesListProps, "changeModules"> & {
  openReorderScreen: () => void;
};

function ModulesList(props: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [footerWidth, setFooterWidth] = useState(0);
  const [predictionChipWidth, setPredictionChipWidth] = useState(0);

  const scrollRef = useRef<ScrollView>(null);
  const previousLengthRef = useRef(props.value.modules.length);

  const modulePrediction = useMemo(
    () => predictNextModule(props.value.modules),
    [props.value.modules],
  );

  const requiredShift = useMemo(
    () => getFooterButtonShift(footerWidth, predictionChipWidth),
    [footerWidth, predictionChipWidth],
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

  const handleFooterLayout = useCallback((event: LayoutChangeEvent) => {
    setFooterWidth(event.nativeEvent.layout.width);
  }, []);

  const handlePredictionChipLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setPredictionChipWidth(event.nativeEvent.layout.width);
    },
    [],
  );

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
          onOpenAddModuleModal={() => {
            Keyboard.dismiss();
            props.showAddModuleModal();
            setTimeout(scrollToBottom, 0);
          }}
          onOpenReorderScreen={props.openReorderScreen}
          canReorder={props.value.modules.length > 1}
          onFooterLayout={handleFooterLayout}
          onPredictionChipLayout={handlePredictionChipLayout}
          requiredShift={requiredShift}
          theme={theme}
          t={t}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default React.memo(ModulesList);

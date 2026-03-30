import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
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

function DraggableModulesList(props: DraggableModulesListProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [footerWidth, setFooterWidth] = useState(0);
  const [predictionChipWidth, setPredictionChipWidth] = useState(0);

  const listRef = useRef<any>(null);
  const contentHeightRef = useRef(0);
  const pendingKeyboardAwareScrollRef = useRef(false);
  const keyboardRetryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const modulePrediction = useMemo(
    () => predictNextModule(props.value.modules),
    [props.value.modules]
  );

  const requiredShift = useMemo(
    () => getFooterButtonShift(footerWidth, predictionChipWidth),
    [footerWidth, predictionChipWidth]
  );

  const scrollToBottom = useCallback(() => {
    const list = listRef.current as any;
    if (!list) return;

    if (typeof list.scrollToEnd === "function") {
      requestAnimationFrame(() => {
        InteractionManager.runAfterInteractions(() => {
          list.scrollToEnd({ animated: true });
        });
      });
      return;
    }

    requestAnimationFrame(() => {
      InteractionManager.runAfterInteractions(() => {
        const target = Math.max(0, contentHeightRef.current - 1);
        if (typeof list.scrollToOffset === "function") {
          list.scrollToOffset({ offset: target, animated: true });
        }
      });
    });
  }, []);

  const scheduleKeyboardAwareScroll = useCallback(() => {
    pendingKeyboardAwareScrollRef.current = true;
    scrollToBottom();
  }, [scrollToBottom]);

  const renderItem = useCallback(
    ({ item, drag }: RenderItemParams<ModuleType>) =>
      getModule(
        item,
        drag,
        props.deleteModule,
        props.changeModule,
        props.fastAccess,
        props.navigation,
        props.value.title
      ),
    [
      props.changeModule,
      props.deleteModule,
      props.fastAccess,
      props.navigation,
      props.value.title,
    ]
  );

  const handleFooterLayout = useCallback((event: LayoutChangeEvent) => {
    setFooterWidth(event.nativeEvent.layout.width);
  }, []);

  const handlePredictionChipLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setPredictionChipWidth(event.nativeEvent.layout.width);
    },
    []
  );

  const previousLengthRef = useRef(props.value.modules.length);
  useEffect(() => {
    const nextLength = props.value.modules.length;
    if (nextLength > previousLengthRef.current) {
      scheduleKeyboardAwareScroll();
    }
    previousLengthRef.current = nextLength;
  }, [props.value.modules.length, scheduleKeyboardAwareScroll]);

  useEffect(() => {
    const handleKeyboardShown = () => {
      if (!pendingKeyboardAwareScrollRef.current) return;

      scrollToBottom();

      if (keyboardRetryTimeoutRef.current) {
        clearTimeout(keyboardRetryTimeoutRef.current);
      }

      keyboardRetryTimeoutRef.current = setTimeout(() => {
        scrollToBottom();
        pendingKeyboardAwareScrollRef.current = false;
        keyboardRetryTimeoutRef.current = null;
      }, 120);
    };

    const handleKeyboardHidden = () => {
      pendingKeyboardAwareScrollRef.current = false;
      if (keyboardRetryTimeoutRef.current) {
        clearTimeout(keyboardRetryTimeoutRef.current);
        keyboardRetryTimeoutRef.current = null;
      }
    };

    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      handleKeyboardShown
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardHidden
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      if (keyboardRetryTimeoutRef.current) {
        clearTimeout(keyboardRetryTimeoutRef.current);
      }
    };
  }, [scrollToBottom]);

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
            props.changeModules(data);
          }}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          onContentSizeChange={(_, height) => {
            contentHeightRef.current = height;
          }}
          ListFooterComponent={
            <DraggableModulesFooter
              modulePrediction={modulePrediction}
              onAddPredictedModule={() => {
                if (!modulePrediction) return;
                props.addModule(modulePrediction);
                setTimeout(scheduleKeyboardAwareScroll, 0);
              }}
              onOpenAddModuleModal={() => {
                props.showAddModuleModal();
                setTimeout(scrollToBottom, 0);
              }}
              onFooterLayout={handleFooterLayout}
              onPredictionChipLayout={handlePredictionChipLayout}
              requiredShift={requiredShift}
              theme={theme}
              t={t}
            />
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

export default DraggableModulesList;

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { useTranslation } from "react-i18next";

import { ModuleType } from "../../model/ModulesType";
import getModule from "../../utils/getModule";
import predictNextModule from "../../utils/predictNextModule";
import {
  DraggableModulesFooter,
  DraggableModulesListProps,
} from "./DraggableModulesList.shared";
import { NativeDragHandleScrollLockProvider } from "../EditRowControlsContainer";

const dragDropAnimationConfig = {
  damping: 32,
  mass: 0.12,
  overshootClamping: true,
  restDisplacementThreshold: 1,
  restSpeedThreshold: 1,
  stiffness: 420,
};

function DraggableModulesList(props: DraggableModulesListProps) {
  const { t } = useTranslation();

  const listRef = useRef<any>(null);
  const contentHeightRef = useRef(0);
  const pendingKeyboardAwareScrollRef = useRef(false);
  const keyboardRetryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [localModules, setLocalModules] = useState(props.value.modules);
  const [nativeScrollEnabled, setNativeScrollEnabled] = useState(true);

  useEffect(() => {
    setLocalModules(props.value.modules);
  }, [props.value.modules]);

  const modulePrediction = useMemo(
    () => predictNextModule(localModules),
    [localModules],
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

  const previousLengthRef = useRef(localModules.length);
  useEffect(() => {
    const nextLength = localModules.length;
    if (nextLength > previousLengthRef.current) {
      scheduleKeyboardAwareScroll();
    }
    previousLengthRef.current = nextLength;
  }, [localModules.length, scheduleKeyboardAwareScroll]);

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
      handleKeyboardShown,
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardHidden,
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
        <NativeDragHandleScrollLockProvider
          onPendingStart={() => setNativeScrollEnabled(false)}
          onPendingEnd={() => setNativeScrollEnabled(true)}
        >
          <DraggableFlatList
            ref={listRef}
            data={localModules}
            extraData={localModules}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            onDragEnd={({ data }) => {
              setLocalModules(data);
              props.changeModules(data);
            }}
            activationDistance={0}
            animationConfig={dragDropAnimationConfig}
            scrollEnabled={nativeScrollEnabled}
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
                t={t}
              />
            }
          />
        </NativeDragHandleScrollLockProvider>
      </View>
    </KeyboardAvoidingView>
  );
}

export default DraggableModulesList;

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  findNodeHandle,
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  UIManager,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import { ModuleType } from "../../model/ModulesType";
import getModule from "../../utils/getModule";
import predictNextModule from "../../utils/predictNextModule";
import {
  DraggableModulesFooter,
  DraggableModulesListProps,
} from "./DraggableModulesList.shared";
import { SCROLLBAR_CONTENT_GAP } from "../../../../shared/ui/glass";

type Props = Omit<DraggableModulesListProps, "changeModules">;
const KEYBOARD_FOCUSED_INPUT_CLEARANCE = 96;

function getFocusedInput() {
  const textInputState = (TextInput as any).State;
  return (
    textInputState?.currentlyFocusedInput?.() ??
    textInputState?.currentlyFocusedField?.() ??
    null
  );
}

function measureInWindow(
  target: any,
  callback: (x: number, y: number, width: number, height: number) => void,
) {
  if (!target) return false;

  if (typeof target.measureInWindow === "function") {
    target.measureInWindow(callback);
    return true;
  }

  const node = typeof target === "number" ? target : findNodeHandle(target);
  if (!node) return false;

  UIManager.measureInWindow(node, callback);
  return true;
}

function ModulesList(props: Props) {
  const { t } = useTranslation();
  const stickyFooterClearance = props.stickyFooter ? 56 : 0;

  const scrollRef = useRef<ScrollView>(null);
  const previousLengthRef = useRef(props.value.modules.length);
  const footerHeightRef = useRef(0);
  const viewportHeightRef = useRef(0);
  const contentHeightRef = useRef(0);
  const scrollOffsetRef = useRef(0);
  const keyboardTopRef = useRef<number | null>(null);
  const keyboardRetryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [visibleFooterHeight, setVisibleFooterHeight] = useState(0);
  const [keyboardBottomInset, setKeyboardBottomInset] = useState(0);
  const stickyFooterBottom = useSharedValue(0);
  const stickyFooterAnimatedStyle = useAnimatedStyle(() => ({
    bottom: stickyFooterBottom.value,
  }));

  const updateVisibleFooterHeight = useCallback(() => {
    if (!props.stickyFooter || !props.footer) return;

    const footerHeight = footerHeightRef.current;
    const viewportHeight = viewportHeightRef.current;
    const contentHeight = contentHeightRef.current;
    if (footerHeight <= 0 || viewportHeight <= 0 || contentHeight <= 0) return;

    const footerTop = Math.max(0, contentHeight - footerHeight);
    const visibleBottom = scrollOffsetRef.current + viewportHeight;
    const nextVisibleFooterHeight = Math.max(
      0,
      Math.min(footerHeight, visibleBottom - footerTop - 8),
    );

    setVisibleFooterHeight((current) =>
      Math.abs(current - nextVisibleFooterHeight) < 1
        ? current
        : nextVisibleFooterHeight,
    );
  }, [props.footer, props.stickyFooter]);

  const modulePrediction = useMemo(
    () => predictNextModule(props.value.modules),
    [props.value.modules],
  );

  useEffect(() => {
    stickyFooterBottom.value = withTiming(
      (props.stickyFooterBottomInset ?? 0) + visibleFooterHeight,
      {
        duration: 80,
        easing: Easing.out(Easing.cubic),
      },
    );
  }, [
    props.stickyFooterBottomInset,
    stickyFooterBottom,
    visibleFooterHeight,
  ]);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      InteractionManager.runAfterInteractions(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      });
    });
  }, []);

  const ensureFocusedInputVisible = useCallback(() => {
    if (Platform.OS === "web") return;

    requestAnimationFrame(() => {
      InteractionManager.runAfterInteractions(() => {
        const focusedInput = getFocusedInput();
        const scrollView = scrollRef.current as any;
        if (!focusedInput || !scrollView) return;

        measureInWindow(scrollView, (_sx, scrollY, _sw, scrollHeight) => {
          measureInWindow(focusedInput, (_ix, inputY, _iw, inputHeight) => {
            const keyboardTop = keyboardTopRef.current;
            const visibleTop = scrollY + 8;
            const visibleBottom =
              (keyboardTop === null
                ? scrollY + scrollHeight
                : Math.min(scrollY + scrollHeight, keyboardTop)) -
              KEYBOARD_FOCUSED_INPUT_CLEARANCE;
            const inputTop = inputY;
            const inputBottom = inputY + inputHeight;

            if (inputBottom > visibleBottom) {
              scrollRef.current?.scrollTo({
                y: scrollOffsetRef.current + inputBottom - visibleBottom,
                animated: true,
              });
              return;
            }

            if (inputTop < visibleTop) {
              scrollRef.current?.scrollTo({
                y: Math.max(0, scrollOffsetRef.current - (visibleTop - inputTop)),
                animated: true,
              });
            }
          });
        });
      });
    });
  }, []);

  const scheduleFocusedInputVisibilityCheck = useCallback(() => {
    ensureFocusedInputVisible();

    if (keyboardRetryTimeoutRef.current) {
      clearTimeout(keyboardRetryTimeoutRef.current);
    }

    keyboardRetryTimeoutRef.current = setTimeout(() => {
      ensureFocusedInputVisible();
      keyboardRetryTimeoutRef.current = null;
    }, 180);
  }, [ensureFocusedInputVisible]);

  useEffect(() => {
    const nextLength = props.value.modules.length;
    if (nextLength > previousLengthRef.current) {
      scrollToBottom();
    }
    previousLengthRef.current = nextLength;
  }, [props.value.modules.length, scrollToBottom]);

  useEffect(() => {
    if (Platform.OS === "web") return undefined;

    const handleKeyboardShown = (event: any) => {
      keyboardTopRef.current = event.endCoordinates?.screenY ?? null;
      setKeyboardBottomInset(Math.max(0, event.endCoordinates?.height ?? 0));
      scheduleFocusedInputVisibilityCheck();
    };

    const handleKeyboardHidden = () => {
      keyboardTopRef.current = null;
      setKeyboardBottomInset(0);
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
  }, [scheduleFocusedInputVisibilityCheck]);

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
        props.moduleAutoFocus ?? true,
      ),
    [
      props.changeModule,
      props.deleteModule,
      props.fastAccess,
      props.navigation,
      props.value.title,
      props.moduleAutoFocus,
    ],
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, width: "100%", position: "relative" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={40}
    >
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1, width: "100%" }}
        onLayout={(event) => {
          viewportHeightRef.current = event.nativeEvent.layout.height;
          updateVisibleFooterHeight();
        }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingRight: props.rightPadding ?? SCROLLBAR_CONTENT_GAP,
          paddingTop: props.topPadding ?? 0,
          paddingBottom:
            (props.footer ? 0 : (props.bottomPadding ?? 12)) +
            keyboardBottomInset +
            (keyboardBottomInset > 0 ? KEYBOARD_FOCUSED_INPUT_CLEARANCE : 0),
        }}
        onContentSizeChange={(_, height) => {
          contentHeightRef.current = height;
          updateVisibleFooterHeight();
          if (keyboardTopRef.current !== null) {
            scheduleFocusedInputVisibilityCheck();
          }
        }}
        onScroll={(event) => {
          scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
          updateVisibleFooterHeight();
        }}
        scrollEventThrottle={16}
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
        {stickyFooterClearance > 0 ? (
          <View style={{ height: stickyFooterClearance }} />
        ) : null}
        {props.footer ? (
          <View
            onLayout={(event) => {
              footerHeightRef.current = event.nativeEvent.layout.height;
              updateVisibleFooterHeight();
            }}
            style={{ marginTop: "auto" as any, paddingTop: 8 }}
          >
            {props.footer}
          </View>
        ) : null}
      </ScrollView>
      {props.stickyFooter ? (
        <Animated.View
          pointerEvents="box-none"
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              zIndex: 10,
            },
            stickyFooterAnimatedStyle,
          ]}
        >
          {props.stickyFooter}
        </Animated.View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

export default React.memo(ModulesList);

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
import { moduleScrollOffset } from "../../utils/moduleScrollVisibility";

type Props = Omit<DraggableModulesListProps, "changeModules">;
const INPUT_SPACING = 8;
const LAYOUT_SETTLE_DELAY = 80;

function getFocusedInput() {
  const textInputState = (TextInput as any).State;
  return textInputState?.currentlyFocusedInput?.() ?? null;
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
  const footerBottomPadding =
    props.footerBottomPadding ?? props.bottomPadding ?? 12;

  const scrollRef = useRef<ScrollView>(null);
  const previousLengthRef = useRef(props.value.modules.length);
  const requestedFocusIdRef = useRef<string | null>(null);
  const lastModuleRef = useRef<View>(null);
  const predictionRef = useRef<View>(null);
  const footerHeightRef = useRef(0);
  const viewportHeightRef = useRef(0);
  const contentHeightRef = useRef(0);
  const scrollOffsetRef = useRef(0);
  const keyboardTopRef = useRef<number | null>(null);
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealGenerationRef = useRef(0);
  const lastScrollTargetRef = useRef<number | null>(null);
  const [visibleFooterHeight, setVisibleFooterHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardOverlap, setKeyboardOverlap] = useState(0);
  // Keep Save above the keyboard rather than moving it up with the metadata.
  const footerLift = keyboardVisible ? 0 : visibleFooterHeight;
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

    const footerTop = Math.max(
      0,
      contentHeight - keyboardOverlap - footerHeight,
    );
    const visibleBottom =
      scrollOffsetRef.current + viewportHeight - keyboardOverlap;
    const nextVisibleFooterHeight = Math.max(
      0,
      Math.min(footerHeight, visibleBottom - footerTop - 8),
    );

    setVisibleFooterHeight((current) =>
      Math.abs(current - nextVisibleFooterHeight) < 1
        ? current
        : nextVisibleFooterHeight,
    );
  }, [props.footer, props.stickyFooter, keyboardOverlap]);

  const modulePrediction = useMemo(
    () => predictNextModule(props.value.modules),
    [props.value.modules],
  );

  useEffect(() => {
    stickyFooterBottom.value = withTiming(
      (props.stickyFooterBottomInset ?? 0) + keyboardOverlap + footerLift,
      {
        duration: 80,
        easing: Easing.out(Easing.cubic),
      },
    );
  }, [
    props.stickyFooterBottomInset,
    keyboardOverlap,
    stickyFooterBottom,
    footerLift,
  ]);

  const updateKeyboardOverlap = useCallback(() => {
    if (Platform.OS === "web") return;
    measureInWindow(scrollRef.current, (_x, y, _width, height) => {
      const keyboardTop = keyboardTopRef.current;
      const overlap =
        keyboardTop === null ? 0 : Math.max(0, y + height - keyboardTop);
      setKeyboardOverlap((current) =>
        Math.abs(current - overlap) < 1 ? current : overlap,
      );
    });
  }, []);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      InteractionManager.runAfterInteractions(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      });
    });
  }, []);

  const ensureFocusedInputVisible = useCallback(() => {
    if (Platform.OS === "web") return;
    const generation = revealGenerationRef.current;

    requestAnimationFrame(() => {
      InteractionManager.runAfterInteractions(() => {
        if (generation !== revealGenerationRef.current) return;
        const focusedInput = getFocusedInput();
        const scrollView = scrollRef.current as any;
        if (!focusedInput || !scrollView) return;
        const measuredOffset = scrollOffsetRef.current;

        measureInWindow(scrollView, (_sx, scrollY, _sw, scrollHeight) => {
          measureInWindow(focusedInput, (_ix, inputY, _iw, inputHeight) => {
            const keyboardTop = keyboardTopRef.current;
            const visibleTop =
              scrollY + (props.topPadding ?? 0) + INPUT_SPACING;
            const visibleBottom =
              (keyboardTop === null
                ? scrollY + scrollHeight
                : Math.min(scrollY + scrollHeight, keyboardTop)) -
              stickyFooterClearance -
              footerLift -
              (props.stickyFooterBottomInset ?? 0) -
              INPUT_SPACING;

            const reveal = (trailingBottom?: number) => {
              if (
                generation !== revealGenerationRef.current ||
                Math.abs(scrollOffsetRef.current - measuredOffset) >= 1
              )
                return;
              const nextOffset = moduleScrollOffset({
                viewport: { top: visibleTop, bottom: visibleBottom },
                input: { top: inputY, bottom: inputY + inputHeight },
                trailingBottom,
                offset: measuredOffset,
                maxOffset: contentHeightRef.current - viewportHeightRef.current,
              });
              if (Math.abs(nextOffset - scrollOffsetRef.current) < 1) return;
              if (
                lastScrollTargetRef.current !== null &&
                Math.abs(nextOffset - lastScrollTargetRef.current) < 1
              )
                return;
              lastScrollTargetRef.current = nextOffset;
              scrollRef.current?.scrollTo({ y: nextOffset, animated: true });
            };

            if (
              !modulePrediction ||
              !lastModuleRef.current ||
              !predictionRef.current
            ) {
              reveal();
              return;
            }
            measureInWindow(
              lastModuleRef.current,
              (_x, lastY, _w, lastHeight) => {
                if (
                  inputY < lastY - 1 ||
                  inputY + inputHeight > lastY + lastHeight + 1
                ) {
                  reveal();
                  return;
                }
                measureInWindow(
                  predictionRef.current,
                  (_px, predictionY, _pw, predictionHeight) => {
                    reveal(predictionY + predictionHeight);
                  },
                );
              },
            );
          });
        });
      });
    });
  }, [
    modulePrediction,
    props.topPadding,
    props.stickyFooterBottomInset,
    stickyFooterClearance,
    footerLift,
  ]);

  const scheduleFocusedInputVisibilityCheck = useCallback(() => {
    if (Platform.OS === "web") return;
    revealGenerationRef.current += 1;

    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current);
    }

    revealTimeoutRef.current = setTimeout(() => {
      revealTimeoutRef.current = null;
      ensureFocusedInputVisible();
    }, LAYOUT_SETTLE_DELAY);
  }, [ensureFocusedInputVisible]);

  const cancelPendingReveal = useCallback(() => {
    revealGenerationRef.current += 1;
    lastScrollTargetRef.current = null;
    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current);
      revealTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => cancelPendingReveal, [cancelPendingReveal]);

  useEffect(() => {
    if (keyboardVisible) scheduleFocusedInputVisibilityCheck();
  }, [keyboardVisible, scheduleFocusedInputVisibilityCheck]);

  useEffect(() => {
    const nextLength = props.value.modules.length;
    if (nextLength > previousLengthRef.current) {
      if (Platform.OS === "web") scrollToBottom();
      else scheduleFocusedInputVisibilityCheck();
    }
    previousLengthRef.current = nextLength;
  }, [
    props.value.modules.length,
    scrollToBottom,
    scheduleFocusedInputVisibilityCheck,
  ]);

  useEffect(() => {
    const requestedId = requestedFocusIdRef.current;
    if (
      !requestedId ||
      !props.value.modules.some((module) => module.id === requestedId)
    )
      return;
    requestedFocusIdRef.current = null;
    scheduleFocusedInputVisibilityCheck();
  }, [props.value.modules, scheduleFocusedInputVisibilityCheck]);

  useEffect(() => {
    if (Platform.OS === "web") return undefined;

    const handleKeyboardShown = (event: any) => {
      keyboardTopRef.current = event.endCoordinates?.screenY ?? null;
      setKeyboardVisible(true);
      updateKeyboardOverlap();
      scheduleFocusedInputVisibilityCheck();
    };

    const handleKeyboardHidden = () => {
      keyboardTopRef.current = null;
      setKeyboardVisible(false);
      setKeyboardOverlap(0);
      cancelPendingReveal();
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
    };
  }, [
    scheduleFocusedInputVisibilityCheck,
    updateKeyboardOverlap,
    cancelPendingReveal,
  ]);

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
        item.id === requestedFocusIdRef.current ||
          (props.moduleAutoFocus ?? true),
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
          const height = event.nativeEvent.layout.height;
          const heightChanged =
            Math.abs(viewportHeightRef.current - height) >= 1;
          viewportHeightRef.current = height;
          updateVisibleFooterHeight();
          updateKeyboardOverlap();
          if (heightChanged && keyboardTopRef.current !== null)
            scheduleFocusedInputVisibilityCheck();
        }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingRight: props.rightPadding ?? SCROLLBAR_CONTENT_GAP,
          paddingTop: props.topPadding ?? 0,
          paddingBottom:
            (props.footer ? 0 : (props.bottomPadding ?? 12)) + keyboardOverlap,
        }}
        onContentSizeChange={(_, height) => {
          const heightChanged =
            Math.abs(contentHeightRef.current - height) >= 1;
          contentHeightRef.current = height;
          updateVisibleFooterHeight();
          if (heightChanged && keyboardTopRef.current !== null) {
            scheduleFocusedInputVisibilityCheck();
          }
        }}
        onScroll={(event) => {
          scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
          updateVisibleFooterHeight();
        }}
        onScrollBeginDrag={cancelPendingReveal}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
      >
        {props.value.modules.map((item, index) => (
          <View
            key={item.id}
            ref={
              index === props.value.modules.length - 1
                ? lastModuleRef
                : undefined
            }
            collapsable={false}
          >
            {renderModule(item)}
          </View>
        ))}
        <View ref={predictionRef} collapsable={false}>
          <DraggableModulesFooter
            modulePrediction={modulePrediction}
            onAddPredictedModule={() => {
              if (!modulePrediction) return;
              requestedFocusIdRef.current =
                props.addModule(modulePrediction) ?? null;
            }}
            t={t}
          />
        </View>
        {stickyFooterClearance > 0 ? (
          <View style={{ height: stickyFooterClearance + INPUT_SPACING }} />
        ) : null}
        {props.footer ? (
          <View
            onLayout={(event) => {
              footerHeightRef.current = event.nativeEvent.layout.height;
              updateVisibleFooterHeight();
            }}
            style={{
              marginTop: "auto" as any,
              paddingTop: 8,
              paddingBottom:
                footerBottomPadding +
                (keyboardVisible ? stickyFooterClearance : 0),
            }}
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

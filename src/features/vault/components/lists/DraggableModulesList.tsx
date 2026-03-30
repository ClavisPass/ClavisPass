import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { Chip, IconButton, Text } from "react-native-paper";

import { InteractionManager } from "react-native";
import { useTranslation } from "react-i18next";
import ValuesType from "../../model/ValuesType";
import FastAccessType from "../../../fastaccess/model/FastAccessType";
import ModulesEnum from "../../model/ModulesEnum";
import ModulesType, { ModuleType } from "../../model/ModulesType";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import predictNextModule from "../../utils/predictNextModule";
import getModule from "../../utils/getModule";
import getModuleNameByEnum from "../../utils/getModuleNameByEnum";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../../../app/navigation/model/types";

const styles = StyleSheet.create({
  footer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    paddingBottom: 8,
    position: "relative",
  },
  predictionChip: {
    position: "absolute",
    left: 8,
    maxWidth: "60%",
  },
  predictionChipContent: {
    flexShrink: 1,
    minWidth: 0,
  },
});

type Props = {
  value: ValuesType;
  changeModules: (data: ModulesType) => void;
  deleteModule: (id: string) => void;
  changeModule: (module: ModuleType) => void;
  addModule: (module: ModulesEnum) => void;
  showAddModuleModal: () => void;
  fastAccess: FastAccessType | null;
  navigation: NativeStackNavigationProp<HomeStackParamList, "Edit", undefined>;
};

function DraggableModulesList(props: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [modulePrediction, setModulePrediction] = useState<ModulesEnum | null>(null);
  const [footerWidth, setFooterWidth] = useState(0);
  const [predictionChipWidth, setPredictionChipWidth] = useState(0);

  // ⬇️ Ref auf die Liste + Content-Höhe für Fallback
  const listRef = useRef<any>(null);
  const contentHeightRef = useRef(0);
  const pendingKeyboardAwareScrollRef = useRef(false);
  const keyboardRetryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

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

  const scheduleKeyboardAwareScroll = useCallback(() => {
    pendingKeyboardAwareScrollRef.current = true;
    scrollToBottom();
  }, []);

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

  const prevLenRef = useRef(props.value.modules.length);
  useEffect(() => {
    const curr = props.value.modules.length;
    const prev = prevLenRef.current;
    if (curr > prev) {
      scheduleKeyboardAwareScroll();
    }
    prevLenRef.current = curr;
  }, [props.value.modules.length, scheduleKeyboardAwareScroll]);

  useEffect(() => {
    if (Platform.OS === "web") return;

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

    const showSub = Keyboard.addListener("keyboardDidShow", handleKeyboardShown);
    const hideSub = Keyboard.addListener("keyboardDidHide", handleKeyboardHidden);

    return () => {
      showSub.remove();
      hideSub.remove();
      if (keyboardRetryTimeoutRef.current) {
        clearTimeout(keyboardRetryTimeoutRef.current);
      }
    };
  }, []);

  const handleFooterLayout = useCallback((event: LayoutChangeEvent) => {
    setFooterWidth(event.nativeEvent.layout.width);
  }, []);

  const handlePredictionChipLayout = useCallback((event: LayoutChangeEvent) => {
    setPredictionChipWidth(event.nativeEvent.layout.width);
  }, []);

  const addButtonBaseWidth = 40;
  const leftPadding = 8;
  const safetyGap = 4;
  const centeredButtonLeft = Math.max(0, (footerWidth - addButtonBaseWidth) / 2);
  const predictionChipRight = leftPadding + predictionChipWidth;
  const requiredShift =
    footerWidth > 0
      ? Math.max(0, predictionChipRight + safetyGap - centeredButtonLeft)
      : 0;

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
            // Nach Reorder kein Auto-Scroll
          }}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          // Fallback-Daten für scrollToOffset
          onContentSizeChange={(_, height) => {
            contentHeightRef.current = height;
          }}
          ListFooterComponent={
            <View style={styles.footer} onLayout={handleFooterLayout}>
              {modulePrediction && (
                <Chip
                  icon={"plus"}
                  onPress={() => {
                    props.addModule(modulePrediction);
                    setTimeout(scheduleKeyboardAwareScroll, 0);
                  }}
                  style={styles.predictionChip}
                  onLayout={handlePredictionChipLayout}
                  compact
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.predictionChipContent}
                  >
                    {getModuleNameByEnum(modulePrediction, t)}
                  </Text>
                </Chip>
              )}
              <IconButton
                icon={"plus"}
                iconColor={theme.colors.primary}
                style={{ margin: 0, transform: [{ translateX: requiredShift }] }}
                onPress={() => {
                  props.showAddModuleModal();
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

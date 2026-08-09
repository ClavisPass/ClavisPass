import React, { useEffect, useRef, useState } from "react";
import { Platform, TextInput as NativeTextInput, View } from "react-native";
import { Checkbox } from "react-native-paper";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Props from "../../model/ModuleProps";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import TaskModuleType from "../../model/modules/TaskModuleType";
import { EditRowControlsContainer } from "../EditRowControlsContainer";
import { useTranslation } from "react-i18next";

const TASK_LINE_HEIGHT = 18;
const SINGLE_LINE_GROWTH_THRESHOLD = 80;
const TASK_MODULE_SPACING = 4;
const TASK_NATIVE_HEIGHT_PADDING = 12;

function TaskModule(props: TaskModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles, theme } = useTheme();
  const { t } = useTranslation();
  const webTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [value, setValue] = useState(props.value);
  const [checked, setChecked] = useState(props.completed);
  const MIN_HEIGHT = Platform.OS === "web" ? 36 : 44;
  const [inputHeight, setInputHeight] = useState<number>(MIN_HEIGHT);
  const keepsSingleLineHeight =
    !value.includes("\n") && value.length <= SINGLE_LINE_GROWTH_THRESHOLD;
  const isSingleLine = keepsSingleLineHeight;
  const animatedInputHeight = useSharedValue(inputHeight);
  const animatedInputStyle = useAnimatedStyle(() => ({
    height: animatedInputHeight.value,
  }));

  useEffect(() => {
    animatedInputHeight.value = withTiming(inputHeight, {
      duration: 240,
      easing: Easing.out(Easing.cubic),
    });
  }, [animatedInputHeight, inputHeight]);

  React.useLayoutEffect(() => {
    if (Platform.OS !== "web") return;

    const textarea = webTextareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    const nextHeight = keepsSingleLineHeight
      ? MIN_HEIGHT
      : Math.max(MIN_HEIGHT, textarea.scrollHeight);
    textarea.style.height = "100%";

    setInputHeight((prev) => (prev === nextHeight ? prev : nextHeight));
  }, [keepsSingleLineHeight, MIN_HEIGHT, value]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    setChecked(props.completed);
  }, [props.completed]);

  useEffect(() => {
    if (didMount.current) {
      const newModule: TaskModuleType = {
        id: props.id,
        module: props.module,
        value,
        completed: checked,
      };
      props.changeModule(newModule);
    } else {
      didMount.current = true;
    }
  }, [value, checked]);

  return (
    <View
      style={{
        marginLeft: 8,
        marginRight: 8,
        marginBottom: TASK_MODULE_SPACING,
        borderRadius: 12,
        backgroundColor: theme.colors.background,
        boxShadow: theme.colors.shadow,
        alignSelf: "stretch",
      }}
    >
      <EditRowControlsContainer
        id={props.id}
        onDragStart={props.onDragStart}
        onDelete={props.deleteModule}
        swipeActionRightInset={8}
        swipeActionBottomInset={TASK_MODULE_SPACING}
      >
        <View
          style={[
            globalStyles.moduleView,
            {
              padding: 0,
              paddingRight: 36,
              justifyContent: "flex-start",
              width: undefined,
              flex: 1,
            },
          ]}
        >
          <Checkbox
            status={checked ? "checked" : "unchecked"}
            onPress={() => setChecked(!checked)}
          />
          {Platform.OS === "web" ? (
            <Animated.View
              style={[{ flex: 1, minWidth: 0 }, animatedInputStyle]}
            >
              <textarea
                ref={webTextareaRef}
                autoFocus={value === ""}
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
                placeholder={t("modules:task")}
                rows={1}
                style={
                  {
                    background: "transparent",
                    border: 0,
                    boxSizing: "border-box",
                    color: checked ? "gray" : theme.colors.onSurface,
                    display: "block",
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                    fontSize: 15,
                    fontWeight: theme.fonts.bodyLarge.fontWeight,
                    height: "100%",
                    letterSpacing: theme.fonts.bodyLarge.letterSpacing,
                    lineHeight: `${TASK_LINE_HEIGHT}px`,
                    margin: 0,
                    minHeight: MIN_HEIGHT,
                    outline: "none",
                    overflow: "hidden",
                    padding: isSingleLine ? "9px 0" : "6px 0",
                    resize: "none",
                    textDecoration: checked ? "line-through" : "none",
                    width: "100%",
                  } as React.CSSProperties
                }
              />
            </Animated.View>
          ) : (
            <View style={{ flex: 1, minWidth: 0 }}>
              <NativeTextInput
                autoFocus={value === "" ? true : false}
                multiline
                scrollEnabled={false}
                onContentSizeChange={(e) => {
                  const contentHeight = Math.ceil(
                    e.nativeEvent.contentSize.height,
                  );
                  const nextHeight = keepsSingleLineHeight
                    ? MIN_HEIGHT
                    : Math.max(
                        MIN_HEIGHT,
                        contentHeight + TASK_NATIVE_HEIGHT_PADDING,
                      );
                  setInputHeight((prev) =>
                    Math.abs(prev - nextHeight) < 2 ? prev : nextHeight,
                  );
                }}
                style={[
                  {
                    backgroundColor: "transparent",
                    color: checked ? "gray" : theme.colors.onSurface,
                    flex: 1,
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                    fontSize: 15,
                    fontWeight: theme.fonts.bodyLarge.fontWeight,
                    height: inputHeight,
                    lineHeight: TASK_LINE_HEIGHT,
                    margin: 0,
                    minHeight: MIN_HEIGHT,
                    outlineStyle: "none" as any,
                    paddingHorizontal: 0,
                    paddingVertical: isSingleLine ? 0 : 6,
                    borderWidth: 0,
                    textAlignVertical: isSingleLine ? "center" : "top",
                    textDecorationLine: checked ? "line-through" : "none",
                  },
                ]}
                value={value}
                onChangeText={setValue}
                placeholder={t("modules:task")}
                placeholderTextColor={theme.colors.outline}
              />
            </View>
          )}
        </View>
      </EditRowControlsContainer>
    </View>
  );
}

export default TaskModule;

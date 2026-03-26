import React, { useEffect, useRef, useState } from "react";
import { Platform, View } from "react-native";
import { TextInput, Checkbox } from "react-native-paper";
import Props from "../../model/ModuleProps";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import TaskModuleType from "../../model/modules/TaskModuleType";
import { EditRowControlsContainer } from "../EditRowControlsContainer";
import { useTranslation } from "react-i18next";

function TaskModule(props: TaskModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles, theme } = useTheme();
  const { t } = useTranslation();
  const [value, setValue] = useState(props.value);
  const [checked, setChecked] = useState(props.completed);

  const MIN_HEIGHT = 36;
  const [inputHeight, setInputHeight] = useState<number>(MIN_HEIGHT);

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
        marginBottom: 8,
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
      >
        <View
          style={[
            globalStyles.moduleView,
            {
              padding: 0,
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
          <View style={{ flex: 1, minWidth: 0 }}>
            <TextInput
              autoFocus={value === "" ? true : false}
              mode="outlined"
              multiline
              scrollEnabled={false}
              dense
              onContentSizeChange={(e) => {
                const nextHeight = Math.max(
                  MIN_HEIGHT,
                  Math.ceil(e.nativeEvent.contentSize.height)
                );
                setInputHeight((prev) => (prev === nextHeight ? prev : nextHeight));
              }}
              outlineStyle={[
                globalStyles.outlineStyle,
                { borderWidth: 0, padding: 0 },
              ]}
              contentStyle={[
                checked
                  ? { color: "gray", textDecorationLine: "line-through" }
                  : null,
                {
                  textAlignVertical: "top",
                  paddingHorizontal: 0,
                  paddingVertical: Platform.OS === "web" ? 6 : 4,
                  margin: 0,
                  borderWidth: 0,
                  lineHeight: 18,
                },
              ]}
              style={[
                globalStyles.textInputStyle,
                {
                  backgroundColor: "transparent",
                  padding: 0,
                  paddingHorizontal: 0,
                  paddingVertical: 0,
                  borderWidth: 0,
                  minHeight: MIN_HEIGHT,
                  height: inputHeight,
                  justifyContent: "center",
                },
              ]}
              value={value}
              onChangeText={setValue}
              placeholder={t("modules:task")}
            />
          </View>
        </View>
      </EditRowControlsContainer>
    </View>
  );
}

export default TaskModule;

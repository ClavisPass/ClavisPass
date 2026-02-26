import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { TextInput, Text, Checkbox } from "react-native-paper";
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

  // NEU: dynamische Höhe für das TextInput
  const [inputHeight, setInputHeight] = useState<number>(0);
  const MIN_HEIGHT = 30; // Grundhöhe einer Zeile (anpassen, wenn du 'dense' nutzt)

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
              marginRight: 21,
            },
          ]}
        >
          <Checkbox
            status={checked ? "checked" : "unchecked"}
            onPress={() => setChecked(!checked)}
          />
          <View style={{ flex: 1, marginRight: 8 }}>
            <TextInput
              autoFocus={value === "" ? true : false}
              mode="outlined"
              multiline
              scrollEnabled={false}
              dense
              onContentSizeChange={(e) =>
                setInputHeight(e.nativeEvent.contentSize.height)
              }
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
                  paddingVertical: 0,
                  margin: 0,
                  borderWidth: 0,
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
                  height: Math.max(MIN_HEIGHT, inputHeight),
                },
              ]}
              value={value}
              onChangeText={setValue}
            />
          </View>
        </View>
      </EditRowControlsContainer>
    </View>
  );
}

export default TaskModule;

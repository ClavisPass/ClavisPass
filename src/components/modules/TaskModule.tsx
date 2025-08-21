import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { TextInput, Text, Checkbox } from "react-native-paper";
import Props from "../../types/ModuleProps";
import { useTheme } from "../../contexts/ThemeProvider";
import TaskModuleType from "../../types/modules/TaskModuleType";
import { EditRowControlsContainer } from "../container/EditRowControlsContainer";

function TaskModule(props: TaskModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles, theme } = useTheme();
  const [value, setValue] = useState(props.value);
  const [checked, setChecked] = useState(props.completed);

  useEffect(() => {
    if (didMount.current) {
      const newModule: TaskModuleType = {
        id: props.id,
        module: props.module,
        value: value,
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
        flex: 1,
      }}
    >
      <EditRowControlsContainer
        id={props.id}
        edit={props.edit}
        onDragStart={props.onDragStart}
        onDelete={props.edit ? props.deleteModule : undefined}
      >
        <View
          style={[
            globalStyles.moduleView,
            {
              padding: 0,
            },
          ]}
        >
          <Checkbox
            status={checked ? "checked" : "unchecked"}
            onPress={() => {
              setChecked(!checked);
            }}
          />
          <View style={{ height: 40, flex: 1, flexGrow: 1 }}>
            <TextInput
              placeholder="Task..."
              outlineStyle={[
                globalStyles.outlineStyle,
                { borderWidth: 0, padding: 0 },
              ]}
              contentStyle={checked ? { color: "gray" } : undefined}
              style={[
                globalStyles.textInputStyle,
                {
                  backgroundColor: "transparent",
                  padding: 0,
                },
              ]}
              value={value}
              mode="outlined"
              onChangeText={(text) => setValue(text)}
            />
          </View>
        </View>
      </EditRowControlsContainer>
    </View>
  );
}

export default TaskModule;

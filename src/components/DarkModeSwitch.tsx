import { Pressable, View } from "react-native";
import { useTheme } from "../contexts/ThemeProvider";
import { useEffect, useState } from "react";
import { RadioButton } from "react-native-paper";
import theme from "../ui/theme";
import darkTheme from "../ui/theme-darkmode";

type CheckedType = "light" | "dark";

type Props = {
  value: CheckedType;
  checked: CheckedType;
  setChecked: (checked: CheckedType) => void;
  theme: any;
};

function DarkModeSwitchPreview(props: Props) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}
    >
      <Pressable
        onPress={() => props.setChecked(props.value)}
        style={{
          height: 80,
          width: 120,
          backgroundColor: props.theme.colors.elevation.level2,
          borderRadius: 10,
          padding: 8,
          borderWidth: 2,
          borderColor: theme.colors.primary,
          gap: 6,
        }}
      >
        <View
          style={{
            backgroundColor: props.theme.colors.background,
            width: "100%",
            flex: 1,
            borderRadius: 10,
          }}
        ></View>
        <View
          style={{
            backgroundColor: props.theme.colors.background,
            width: "100%",
            flex: 1,
            borderRadius: 10,
          }}
        ></View>
      </Pressable>
      <View>
        <RadioButton
          value={props.value}
          status={props.checked === props.value ? "checked" : "unchecked"}
          onPress={() => props.setChecked(props.value)}
        />
      </View>
    </View>
  );
}

function DarkModeSwitch() {
  const { darkmode, setDarkmode } = useTheme();
  const [checked, setChecked] = useState<CheckedType>(
    darkmode ? "dark" : "light"
  );
  useEffect(() => {
    setDarkmode(checked === "dark");
  }, [checked, darkmode]);
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 6,
        marginTop: 10,
        marginLeft: 10,
        marginBottom: 4,
      }}
    >
      <DarkModeSwitchPreview
        value="light"
        checked={checked}
        setChecked={setChecked}
        theme={theme}
      />
      <DarkModeSwitchPreview
        value="dark"
        checked={checked}
        setChecked={setChecked}
        theme={darkTheme}
      />
    </View>
  );
}

export default DarkModeSwitch;

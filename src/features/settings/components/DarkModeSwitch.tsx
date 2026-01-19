import { Pressable, View } from "react-native";
import { useTheme } from "../../../app/providers/ThemeProvider";
import { useMemo, useState } from "react";
import { RadioButton } from "react-native-paper";
import theme from "../../../shared/ui/theme";
import darkTheme from "../../../shared/ui/theme-darkmode";

type CheckedType = "light" | "dark";
type Size = "large" | "small";

type PreviewProps = {
  value: CheckedType;
  checked: CheckedType;
  onSelect: (checked: CheckedType) => void;
  theme: any;
  size: Size;
};

function DarkModeSwitchPreview({ value, checked, onSelect, theme, size }: PreviewProps) {
  const dimensions = useMemo(() => {
    if (size === "small") {
      return { container: { width: 88, height: 58, padding: 6, radius: 8 }, blockRadius: 6 };
    }
    return { container: { width: 120, height: 80, padding: 8, radius: 10 }, blockRadius: 10 };
  }, [size]);

  return (
    <View style={{ alignItems: "center", justifyContent: "center", gap: size === "small" ? 2 : 4 }}>
      <Pressable
        onPress={() => onSelect(value)}
        style={{
          width: dimensions.container.width,
          height: dimensions.container.height,
          backgroundColor: theme.colors.elevation.level2,
          borderRadius: dimensions.container.radius,
          padding: dimensions.container.padding,
          borderWidth: 2,
          borderColor: checked === value ? theme.colors.primary : "transparent",
          gap: size === "small" ? 4 : 6,
        }}
      >
        <View style={{ backgroundColor: theme.colors.background, flex: 1, borderRadius: dimensions.blockRadius }} />
        <View style={{ backgroundColor: theme.colors.background, flex: 1, borderRadius: dimensions.blockRadius }} />
      </Pressable>

      <RadioButton
        value={value}
        status={checked === value ? "checked" : "unchecked"}
        onPress={() => onSelect(value)}
      />
    </View>
  );
}

type Props = { size?: Size };

export default function DarkModeSwitch({ size = "large" }: Props) {
  const { darkmode, setDarkmode } = useTheme();
  const [checked, setChecked] = useState<CheckedType>(darkmode ? "dark" : "light");

  const onSelect = (v: CheckedType) => {
    setChecked(v);
    setDarkmode(v === "dark");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        gap: size === "small" ? 8 : 6,
        marginTop: size === "small" ? 6 : 10,
        marginLeft: size === "small" ? 0 : 10,
        marginBottom: size === "small" ? 0 : 4,
        justifyContent: "center",
      }}
    >
      <DarkModeSwitchPreview value="light" checked={checked} onSelect={onSelect} theme={theme} size={size} />
      <DarkModeSwitchPreview value="dark" checked={checked} onSelect={onSelect} theme={darkTheme} size={size} />
    </View>
  );
}

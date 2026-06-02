import { ReactNode } from "react";
import { View } from "react-native";
import { Text, Icon } from "react-native-paper";
import { useTheme } from "../../../app/providers/ThemeProvider";
import AnimatedPressable from "../AnimatedPressable";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  leadingIcon?: string;
  leadingIconColor?: string;
  leading?: ReactNode;
  selected?: boolean;
  selectedColor?: string;
  label?: string;
  rightText?: string;
  rightIcon?: string;
};
export function MenuItem(props: Props) {
  const { theme } = useTheme();
  const selectedBackgroundColor = "rgba(120, 127, 246, 0.18)";

  return (
    <View style={{ height: 44 }}>
      <Ripple onPress={props.onPress}>
        <View
          style={{
            flex: 1,
            display: "flex",
            padding: 10,
            minWidth: 140,
            minHeight: 30,
            height: 30,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            justifyContent: "space-between",
            backgroundColor: props.selected
              ? selectedBackgroundColor
              : "transparent",
            borderLeftWidth: props.selected ? 3 : 0,
            borderLeftColor: props.selectedColor ?? theme.colors.primary,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            {props.leading ?? (props.leadingIcon && (
              <Icon
                size={20}
                color={props.leadingIconColor ?? theme.colors.primary}
                source={props.leadingIcon}
              />
            ))}
            {props.label ? (
              <View style={{ display: "flex", flexDirection: "column" }}>
                <Text
                  variant="labelSmall"
                  style={{ userSelect: "none", color: theme.colors.primary }}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {props.label}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ userSelect: "none" }}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {props.children}
                </Text>
              </View>
            ) : (
              <Text
                variant="bodyLarge"
                style={{ userSelect: "none" }}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {props.children}
              </Text>
            )}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            {props.rightText && (
              <Text
                variant="bodyLarge"
                style={{ userSelect: "none", color: theme.colors.primary }}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {props.rightText}
              </Text>
            )}
            {props.rightIcon ? (
              <Icon
                size={20}
                color={theme.colors.primary}
                source={props.rightIcon}
              />
            ) : null}
          </View>
        </View>
      </Ripple>
    </View>
  );
}

function Ripple(props: { onPress?: () => void; children: ReactNode }) {
  if (props.onPress) {
    return (
      <AnimatedPressable
        onPress={props.onPress}
        style={{
          cursor: "pointer",
          flex: 1,
        }}
      >
        {props.children}
      </AnimatedPressable>
    );
  } else {
    return props.children;
  }
}

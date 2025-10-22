import { ReactNode } from "react";
import { View } from "react-native";
import { Text, Icon } from "react-native-paper";
import { useTheme } from "../../contexts/ThemeProvider";
import AnimatedPressable from "../AnimatedPressable";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  leadingIcon?: string;
  selected?: boolean;
  label?: string;
  rightText?: string;
};
export function MenuItem(props: Props) {
  const { theme } = useTheme();
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
              ? "rgba(0, 0, 0, 0.137)"
              : "transparent",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            {props.leadingIcon && (
              <Icon
                size={20}
                color={theme.colors.primary}
                source={props.leadingIcon}
              />
            )}
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

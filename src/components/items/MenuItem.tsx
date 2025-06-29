import { ReactNode } from "react";
import { View } from "react-native";
import { TouchableRipple, Text, Icon } from "react-native-paper";
import { useTheme } from "../../contexts/ThemeProvider";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  leadingIcon?: string;
  selected?: boolean;
  label?: string;
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
            backgroundColor: props.selected
              ? "rgba(0, 0, 0, 0.137)"
              : "transparent",
          }}
        >
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
      </Ripple>
    </View>
  );
}

function Ripple(props: { onPress?: () => void; children: ReactNode}) {
  if(props.onPress) {
    return (
      <TouchableRipple
        onPress={props.onPress}
        style={{
          cursor: "pointer",
          flex: 1,
        }}
        rippleColor="rgba(0, 0, 0, .32)"
      >
        {props.children}
      </TouchableRipple>
  );
  }
  else{
    return props.children;
  }
}

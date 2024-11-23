import { ReactNode } from "react";
import { Platform, View } from "react-native";
import { TouchableRipple, Text, Icon } from "react-native-paper";
import theme from "../../ui/theme";
import MenuContainerWeb from "./container/MenuContainerWeb";
import MenuContainer from "./container/MenuContainer";

type MenuItemProps = {
  children: ReactNode;
  onPress?: () => void;
  leadingIcon?: string;
};
export function MenuItem(props: MenuItemProps) {
  return (
    <TouchableRipple
      onPress={props.onPress}
      style={{
        cursor: props.onPress ? "pointer" : "auto",
        flex: 1,
      }}
      rippleColor="rgba(0, 0, 0, .32)"
    >
      <View
        style={{
          flex: 1,
          display: "flex",
          padding: 14,
          minWidth: 140,
          minHeight: 50,
          height: 50,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
      >
        {props.leadingIcon && (
          <Icon
            size={20}
            color={theme.colors.primary}
            source={props.leadingIcon}
          />
        )}
        <Text variant="bodyLarge" style={{ userSelect: "none" }}>
          {props.children}
        </Text>
      </View>
    </TouchableRipple>
  );
}

type Props = {
  children: ReactNode;
  visible: boolean;
  onDismiss: () => void;
  positionY: number;
};
function Menu(props: Props) {
  if (Platform.OS === "web")
    return (
      <MenuContainerWeb
        visible={props.visible}
        onDismiss={props.onDismiss}
        positionY={props.positionY}
      >
        {props.children}
      </MenuContainerWeb>
    );

  return (
    <MenuContainer
      visible={props.visible}
      onDismiss={props.onDismiss}
      positionY={props.positionY}
    >
      {props.children}
    </MenuContainer>
  );
}

export default Menu;

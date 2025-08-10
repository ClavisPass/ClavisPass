import { ReactNode } from "react";
import { View } from "react-native";
import { TouchableRipple, Text, Icon } from "react-native-paper";
import { useTheme } from "../../contexts/ThemeProvider";

type Props = {
  children: ReactNode;
  onPress: () => void;
  leadingIcon: string;
};
function CategoryItem(props: Props) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        borderRadius: 12,
        overflow: "hidden",
        flex: 1,
        backgroundColor: theme.colors?.secondaryContainer,
      }}
    >
      <TouchableRipple
        onPress={props.onPress}
        style={{
          cursor: "pointer",
          flex: 1,
        }}
        rippleColor="rgba(0, 0, 0, .32)"
      >
        <View
          style={{
            display: "flex",
            padding: 8,
            gap: 4,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Icon
            size={20}
            color={theme.colors.primary}
            source={props.leadingIcon}
          />
          <Text
            variant="bodyLarge"
            style={{ userSelect: "none" }}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {props.children}
          </Text>
        </View>
      </TouchableRipple>
    </View>
  );
}

export default CategoryItem;

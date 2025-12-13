import { ReactNode } from "react";
import { View } from "react-native";
import { Text, Icon } from "react-native-paper";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import AnimatedPressable from "../../../../shared/components/AnimatedPressable";

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
      <AnimatedPressable
        onPress={props.onPress}
        style={{
          cursor: "pointer",
          flex: 1,
        }}
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
      </AnimatedPressable>
    </View>
  );
}

export default CategoryItem;

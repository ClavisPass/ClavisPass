import { ReactNode } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import AnimatedPressable from "../../../../shared/components/AnimatedPressable";
import { getAppChipSurfaceStyle } from "../../../../shared/components/chips/AppChip";
import AppIcon from "../../../../shared/components/icons/AppIcon";

type Props = {
  children: ReactNode;
  onPress: () => void;
  leadingIcon: string;
};
function CategoryItem(props: Props) {
  const { darkmode, theme } = useTheme();
  const contentColor = theme.colors.onSurfaceVariant;
  return (
    <View
      style={{
        ...getAppChipSurfaceStyle({ darkmode }),
        borderRadius: 12,
        overflow: "hidden",
        flex: 1,
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
          <AppIcon
            size={20}
            color={theme.colors.primary}
            name={props.leadingIcon}
          />
          <Text
            variant="bodyLarge"
            style={{ color: contentColor, userSelect: "none" }}
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

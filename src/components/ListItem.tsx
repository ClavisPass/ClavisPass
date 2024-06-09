import React, { ReactNode } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import {
  Divider,
  Icon,
  IconButton,
  Text,
  TouchableRipple,
} from "react-native-paper";
import ValuesType from "../types/ValuesType";
import theme from "../ui/theme";

const styles = StyleSheet.create({
  container: {
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  ripple: {
    padding: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

type Props = {
  item: ValuesType;
  onPress: () => void;
};

function ListItem(props: Props) {
  return (
    <View style={styles.container}>
      <TouchableRipple
        style={styles.ripple}
        onPress={props.onPress}
        rippleColor="rgba(0, 0, 0, .32)"
      >
        <>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Icon color={"lightgray"} source={props.item.icon} size={20} />
            <Text variant="bodyMedium" style={{ userSelect: "none" }}>
              {"test"}
            </Text>
          </View>
          <Icon
            color={theme.colors.primary}
            source={"chevron-right"}
            size={20}
          />
        </>
      </TouchableRipple>
    </View>
  );
}

export default ListItem;

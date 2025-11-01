import React from "react";
import { StyleSheet, View } from "react-native";
import ValuesType from "../../types/ValuesType";
import { useTheme } from "../../contexts/ThemeProvider";

import AnimatedPressable from "../AnimatedPressable";
import Animated, { FadeInDown } from "react-native-reanimated";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import QRCode from "react-qr-code";
import DigitalCardType from "../../types/DigitalCardType";

import { Text } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  ripple: {
    padding: 0,
    paddingLeft: 8,
    paddingRight: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    overflow: "hidden",
  },
});

type Props = {
  title: string;
  value: string;
  type: DigitalCardType;
  item: ValuesType;
  onPress: () => void;
  key?: React.Key;
  index: number;
};

function CardItem(props: Props) {
  const { theme } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(props.index * 50).duration(250)}
      key={props.key}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors?.background,
          boxShadow: theme.colors?.shadow,
        },
      ]}
    >
      <AnimatedPressable
        key={props.key}
        style={styles.ripple}
        onPress={props.onPress}
      >
        <View style={{ flex: 1, display: "flex", flexDirection: "column", padding: 8 }}>
          <Text>{props.title}</Text>
          <View
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              height: 96,
            }}
          >
            {props.value !== "" ? (
              props.type === "QR-Code" ? (
                <QRCode value={props.value} size={90} />
              ) : (
                <Barcode
                  height={70}
                  format={props.type}
                  value={props.value}
                  text={props.value}
                />
              )
            ) : null}
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default CardItem;

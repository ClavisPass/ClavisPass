import React from "react";
import { StyleSheet, View } from "react-native";
import ValuesType from "../../types/ValuesType";
import { useTheme } from "../../contexts/ThemeProvider";

import AnimatedPressable from "../AnimatedPressable";
import Animated, { FadeInDown } from "react-native-reanimated";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import QRCode from "react-qr-code";
import DigitalCardType from "../../types/DigitalCardType";

import { Divider, Text } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  ripple: {
    padding: 8,
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
  onPressEdit: () => void;
  onPress: () => void;
  key?: React.Key;
  index: number;
};

function CardItem(props: Props) {
  const { theme, darkmode } = useTheme();

  if(props.value === "") {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(props.index * 50).duration(250)}
      key={props.key}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors?.background,
          boxShadow: theme.colors?.shadow,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: darkmode ? theme.colors.outlineVariant : "white",
        },
      ]}
    >
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AnimatedPressable
          key={props.key}
          style={[styles.ripple]}
          onPress={props.onPressEdit}
        >
          <Text>{props.title}</Text>
        </AnimatedPressable>
        <Divider />
        <View
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            height: 120,
            overflow: "hidden",
          }}
        >
          <AnimatedPressable
            key={props.key}
            style={[
              styles.ripple,
              { justifyContent: "center", alignItems: "center" },
            ]}
            onPress={props.onPress}
          >
            <View
              style={{ padding: 8, backgroundColor: "white", borderRadius: 12 }}
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
          </AnimatedPressable>
        </View>
      </View>
    </Animated.View>
  );
}

export default CardItem;

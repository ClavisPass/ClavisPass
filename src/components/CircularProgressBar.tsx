import React from "react";
import { View, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

import { Text } from "react-native-paper";

type Props = {
  fill: number;
  maxValue: number;
  color: string;
};

function CircularProgressBar(props: Props) {
  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={60}
        width={6}
        fill={props.fill} // Fortschrittswert in Prozent
        tintColor={props.color} // Farbe des Fortschrittsbalkens
        backgroundColor="#d3d3d341"
        rotation={0}
        lineCap="round"
      >
        {(fill) => (
          <Text variant="bodyMedium" style={[{color: props.color}, {fontWeight: "bold", fontSize: 16, userSelect: "none"}]}>
            {`${Math.round(fill)}%`}
          </Text>
        )}
      </AnimatedCircularProgress>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  }
});

export default CircularProgressBar;

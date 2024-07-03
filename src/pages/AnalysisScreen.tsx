import Constants from "expo-constants";
import React from "react";
import { StyleSheet } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { TitlebarHeight } from "../components/CustomTitlebar";
import { StatusBar } from "expo-status-bar";
import AnimatedContainer from "../components/AnimatedContainer";
import { useFocusEffect } from "@react-navigation/native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginLeft: 4,
    marginRight: 4,
    marginTop: Constants.statusBarHeight,
  },
});

function AnalysisScreen({ navigation }: { navigation: any }) {
  const [value, setValue] = React.useState("");
  return (
    <AnimatedContainer
      style={{ marginTop: Constants.statusBarHeight }}
      useFocusEffect={useFocusEffect}
    >
      <StatusBar
        animated={true}
        style="dark"
        backgroundColor="transparent"
        translucent={true}
      />
      <TitlebarHeight />
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: "safe",
            label: "Safe",
          },
          {
            value: "weak",
            label: "Weak",
          },
          { value: "risk", label: "Risk" },
        ]}
      />
    </AnimatedContainer>
  );
}

export default AnalysisScreen;

import Constants from "expo-constants";
import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import globalStyles from "../ui/globalStyles";
import { TitlebarHeight } from "../components/CustomTitlebar";
import { StatusBar } from "expo-status-bar";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginLeft: 4,
    marginRight: 4,
    marginTop: Constants.statusBarHeight,
  },
});

function AnalysisScreen() {
  const [value, setValue] = React.useState("");
  return (
    <View
      style={[globalStyles.container, { marginTop: Constants.statusBarHeight }]}
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
    </View>
  );
}

export default AnalysisScreen;

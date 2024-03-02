import Constants from "expo-constants";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import globalStyles from "../ui/globalStyles";

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
    <SafeAreaView style={globalStyles.container}>
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
    </SafeAreaView>
  );
}

export default AnalysisScreen;

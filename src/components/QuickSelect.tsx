import React from "react";
import { View, StyleSheet } from "react-native";
import ModulesType from "../types/ModulesType";
import { TitlebarHeight } from "./CustomTitlebar";
import Button from "./Button";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

type Props = {
  modules: ModulesType;
  setModules: (modules: ModulesType | null) => void;
};

function QuickSelect(props: Props) {
  return (
    <View style={styles.container}>
      <TitlebarHeight />
      <Button
        text={"Go Back"}
        onPress={() => {
          props.setModules(null);
        }}
      />
    </View>
  );
}

export default QuickSelect;

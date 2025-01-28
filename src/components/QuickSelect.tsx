import React from "react";
import { View, StyleSheet } from "react-native";
import ModulesType from "../types/ModulesType";
import { IconButton } from "react-native-paper";
import { useTheme } from "../contexts/ThemeProvider";

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
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <IconButton
        icon={"account"}
        mode={"contained"}
        containerColor={theme.colors.primary}
        iconColor={"white"}
        size={26}
        onPress={() => {
          //
        }}
      />
      <IconButton
        icon={"form-textbox-password"}
        mode={"contained"}
        containerColor={theme.colors.primary}
        iconColor={"white"}
        size={26}
        onPress={() => {
          //props.setModules(null);
        }}
      />
      <IconButton
        icon={"arrow-left"}
        mode={"contained-tonal"}
        selected
        iconColor={theme.colors.primary}
        size={26}
        onPress={() => {
          props.setModules(null);
        }}
      />
    </View>
  );
}

export default QuickSelect;

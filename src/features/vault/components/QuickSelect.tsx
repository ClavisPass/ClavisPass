import React from "react";
import { View, StyleSheet } from "react-native";

import { IconButton } from "react-native-paper";
import { useTheme } from "../../../app/providers/ThemeProvider";
import FastAccessType from "../../fastaccess/model/FastAccessType";
import { useClipboardCopy } from "../../../shared/hooks/useClipboardCopy";

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
  fastAccess: FastAccessType;
  setFastAccess: (fastAccess: FastAccessType) => void;
};

function QuickSelect(props: Props) {
  const { theme } = useTheme();
  const { copy } = useClipboardCopy();

  return (
    <View style={styles.container}>
      <IconButton
        disabled={!props.fastAccess?.username}
        icon={"account"}
        mode={"contained"}
        containerColor={theme.colors.primary}
        iconColor={"white"}
        size={26}
        onPress={() => {
          void copy(props.fastAccess?.username ?? "", { kind: "username" });
        }}
      />
      <IconButton
        disabled={!props.fastAccess?.password}
        icon={"form-textbox-password"}
        mode={"contained"}
        containerColor={theme.colors.primary}
        iconColor={"white"}
        size={26}
        onPress={() => {
          void copy(props.fastAccess?.password ?? "", { kind: "password" });
        }}
      />
      <IconButton
        icon={"arrow-left"}
        mode={"contained-tonal"}
        selected
        iconColor={theme.colors.primary}
        size={26}
        onPress={() => {
          props.setFastAccess(null);
        }}
      />
    </View>
  );
}

export default QuickSelect;

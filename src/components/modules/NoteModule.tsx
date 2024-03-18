import React from "react";
import { StyleSheet } from "react-native";

import { Text, TextInput } from "react-native-paper";

import NoteModuleType from "../../types/modules/NoteModuleType";
import ModuleContainer from "../ModuleContainer";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    width: "100%",
    flex: 1,
  },
});

function NoteModule(props: NoteModuleType) {
  const [value, setValue] = React.useState(props.value);
  return (
    <ModuleContainer title={"Note"}>
      <TextInput
        value={value}
        mode="outlined"
        onChangeText={(text) => setValue(text)}
      />
    </ModuleContainer>
  );
}

export default NoteModule;

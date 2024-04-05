import React from "react";
import { StyleSheet } from "react-native";

import { Text, TextInput } from "react-native-paper";

import NoteModuleType from "../../types/modules/NoteModuleType";
import ModuleContainer from "../ModuleContainer";
import globalStyles from "../../ui/globalStyles";

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

type Props = {
  edit: boolean;
};

function NoteModule(props: NoteModuleType & Props) {
  const [value, setValue] = React.useState(props.value);
  return (
    <ModuleContainer title={"Note"} edit={props.edit}>
      <TextInput
        outlineStyle={globalStyles.outlineStyle}
        style={globalStyles.textInputStyle}
        value={value}
        mode="outlined"
        onChangeText={(text) => setValue(text)}
        autoCapitalize="none"
      />
    </ModuleContainer>
  );
}

export default NoteModule;

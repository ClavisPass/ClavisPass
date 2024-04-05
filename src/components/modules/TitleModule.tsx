import React from "react";
import { StyleSheet } from "react-native";

import { Text, TextInput } from "react-native-paper";

import TitleModuleType from "../../types/modules/TitleModuleType";
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

function TitleModule(props: TitleModuleType & Props) {
  const [value, setValue] = React.useState(props.value);
  return (
    <ModuleContainer title={"Title"} edit={props.edit}>
      <TextInput
        outlineStyle={globalStyles.outlineStyle}
        style={globalStyles.textInputStyle}
        value={value}
        mode="outlined"
        onChangeText={(text) => setValue(text)}
      />
    </ModuleContainer>
  );
}

export default TitleModule;

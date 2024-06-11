import React from "react";

import { IconButton, TextInput } from "react-native-paper";

import URLModuleType from "../../types/modules/URLModuleType";
import ModuleContainer from "../ModuleContainer";
import globalStyles from "../../ui/globalStyles";
import Props from "../../types/ModuleProps";
import { View } from "react-native";
import theme from "../../ui/theme";

import * as WebBrowser from "expo-web-browser";

function URLModule(props: URLModuleType & Props) {
  const [value, setValue] = React.useState(props.value);
  return (
    <ModuleContainer
      id={props.id}
      title={"URL"}
      edit={props.edit}
      delete={props.edit}
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
      deleteModule={props.deleteModule}
    >
      <View style={globalStyles.moduleView}>
        <TextInput
          outlineStyle={globalStyles.outlineStyle}
          style={globalStyles.textInputStyle}
          value={value}
          mode="outlined"
          onChangeText={(text) => setValue(text)}
          autoCapitalize="none"
          autoComplete="url"
          textContentType="URL"
          keyboardType="url"
        />
        {/*<IconButton
          icon="play"
          iconColor={theme.colors.primary}
          size={20}
          onPress={() => WebBrowser.openBrowserAsync(props.value)}
        />*/}
      </View>
    </ModuleContainer>
  );
}

export default URLModule;

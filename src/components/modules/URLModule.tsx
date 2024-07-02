import React, { useEffect, useState } from "react";

import { IconButton, TextInput } from "react-native-paper";

import URLModuleType from "../../types/modules/URLModuleType";
import ModuleContainer from "../ModuleContainer";
import globalStyles from "../../ui/globalStyles";
import Props from "../../types/ModuleProps";
import { Platform, View } from "react-native";

import { open } from "@tauri-apps/api/shell";

import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import validator from "validator";
import theme from "../../ui/theme";

function URLModule(props: URLModuleType & Props) {
  const [value, setValue] = useState(props.value);
  const [isValid, setIsValid] = useState(false);

  const _handlePressButtonAsync = async (url: string) => {
    let result = await WebBrowser.openBrowserAsync(url);
    //setResult(result);
  };

  const fillUrl = () => {
    let url = value;
    if (
      validator.isURL(value) &&
      url.charAt(0) == "h" &&
      url.charAt(1) == "t" &&
      url.charAt(2) == "t" &&
      url.charAt(3) == "p" &&
      url.charAt(4) == "s" &&
      url.charAt(5) == ":" &&
      url.charAt(6) == "/" &&
      url.charAt(7) == "/" &&
      url.charAt(url.length - 1) == "/"
    )
      return;
    if (
      url.charAt(0) != "w" &&
      url.charAt(1) != "w" &&
      url.charAt(2) != "w" &&
      url.charAt(3) != "." &&
      url.charAt(0) != "h" &&
      url.charAt(1) != "t" &&
      url.charAt(2) != "t" &&
      url.charAt(3) != "p" &&
      url.charAt(4) != "s" &&
      url.charAt(5) != ":" &&
      url.charAt(6) != "/" &&
      url.charAt(7) != "/"
    ) {
      url = "www." + url;
    }
    if (
      url.charAt(0) == "w" &&
      url.charAt(1) == "w" &&
      url.charAt(2) == "w" &&
      url.charAt(3) == "." &&
      url.charAt(0) != "h" &&
      url.charAt(1) != "t" &&
      url.charAt(2) != "t" &&
      url.charAt(3) != "p" &&
      url.charAt(4) != "s" &&
      url.charAt(5) != ":" &&
      url.charAt(6) != "/" &&
      url.charAt(7) != "/"
    ) {
      url = "https://" + url;
    }
    if (url.charAt(url.length - 1) != "/") {
      url = url + "/";
    }
    setValue(url);
  };

  useEffect(() => {
    setIsValid(validator.isURL(value));
  }, [value]);

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
          outlineStyle={[
            globalStyles.outlineStyle,
            !isValid ? { borderColor: theme.colors.error } : null,
          ]}
          style={globalStyles.textInputStyle}
          value={value}
          mode="outlined"
          onChangeText={(text) => {
            setValue(text);
          }}
          onBlur={fillUrl}
          autoCapitalize="none"
          autoComplete="url"
          textContentType="URL"
          keyboardType="url"
        />
        {
          <IconButton
            icon="play"
            iconColor={theme.colors.primary}
            size={20}
            onPress={async () => {
              if (Platform.OS === "web") {
                await open(value);
              } else {
                Linking.openURL(value);
              }
            }}
          />
        }
      </View>
    </ModuleContainer>
  );
}

export default URLModule;

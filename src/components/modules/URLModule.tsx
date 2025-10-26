import React, { useEffect, useRef, useState } from "react";

import { Icon, IconButton, TextInput } from "react-native-paper";

import URLModuleType from "../../types/modules/URLModuleType";
import ModuleContainer from "../container/ModuleContainer";
import Props from "../../types/ModuleProps";
import { Platform, View } from "react-native";

import { open } from "@tauri-apps/plugin-shell";

import * as Linking from "expo-linking";

import validator from "validator";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import { useTheme } from "../../contexts/ThemeProvider";

import { Image } from "expo-image";

function URLModule(props: URLModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles, theme } = useTheme();
  const [value, setValue] = useState(props.value);
  const [isValid, setIsValid] = useState(false);

  const getFavIcon = (value: string) => {
    if (value !== "" && isValid) {
      const string =
        "https://www.google.com/s2/favicons?domain=" + value + "&sz=64";
      return string;
    }
    return "";
  };

  const [url, setUrl] = useState(getFavIcon(props.value));

  const fillUrl = () => {
    let url = value;
    if (value === "") {
      return;
    }
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
    setUrl(getFavIcon(value));
  }, [value, isValid]);

  useEffect(() => {
    if (didMount.current) {
      const newModule: URLModuleType = {
        id: props.id,
        module: props.module,
        value: value,
      };
      props.changeModule(newModule);
    } else {
      didMount.current = true;
    }
  }, [value]);

  return (
    <ModuleContainer
      id={props.id}
      title={"URL"}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.URL}
      fastAccess={props.fastAccess}
    >
      <View style={globalStyles.moduleView}>
        <View style={{ width: 30, alignItems: "center", marginRight: 4 }}>
          {url !== "" && isValid ? (
            <Image
              style={{ width: 30, height: 30, margin: 0, borderRadius: 8 }}
              source={url}
              contentFit="cover"
              transition={250}
            />
          ) : (
            <Icon color={"lightgray"} source={"web-remove"} size={20} />
          )}
        </View>
        <View style={{ height: 40, flex: 1 }}>
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
        </View>
        {
          <IconButton
            icon="open-in-new"
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

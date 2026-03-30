import React, { useEffect, useRef, useState } from "react";

import { Icon, IconButton, TextInput } from "react-native-paper";

import URLModuleType from "../../model/modules/URLModuleType";
import ModuleContainer from "../ModuleContainer";
import Props from "../../model/ModuleProps";
import { Platform, View } from "react-native";

import { open } from "@tauri-apps/plugin-shell";

import * as Linking from "expo-linking";
import { useTheme } from "../../../../app/providers/ThemeProvider";

import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import ModulesEnum from "../../model/ModulesEnum";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";
import {
  buildFaviconUrl,
  normalizeUrl,
} from "../../utils/digitalCardTheme";

function URLModule(props: URLModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles, theme } = useTheme();
  const { t } = useTranslation();
  const [value, setValue] = useState(props.value);
  useEffect(() => {
    setValue(props.value);
  }, [props.value]);
  const normalizedUrl = normalizeUrl(value);
  const isValid = value.trim() === "" || normalizedUrl !== null;
  const faviconUrl = buildFaviconUrl(normalizedUrl);

  const fillUrl = () => {
    if (value.trim() === "") return;

    const nextValue = normalizeUrl(value);
    if (nextValue) {
      setValue(nextValue);
    }
  };

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
      title={t("modules:url")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.URL]}
      fastAccess={props.fastAccess}
    >
      <View style={globalStyles.moduleView}>
        <View style={{ width: 30, alignItems: "center", marginRight: 4 }}>
          {faviconUrl && isValid ? (
            <Image
              style={{ width: 30, height: 30, margin: 0, borderRadius: 8 }}
              source={faviconUrl}
              contentFit="cover"
              transition={250}
            />
          ) : (
            <Icon color={"lightgray"} source={"web-remove"} size={20} />
          )}
        </View>
        <View style={{ height: 40, flex: 1 }}>
          <TextInput
            autoFocus={value === "" ? true : false}
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
        <IconButton
          icon="open-in-new"
          iconColor={theme.colors.primary}
          size={20}
          disabled={!normalizedUrl}
          onPress={async () => {
            if (!normalizedUrl) return;

            if (Platform.OS === "web") {
              await open(normalizedUrl);
            } else {
              Linking.openURL(normalizedUrl);
            }
          }}
        />
      </View>
    </ModuleContainer>
  );
}

export default URLModule;

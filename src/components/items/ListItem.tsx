import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Icon, IconButton, Text, TouchableRipple } from "react-native-paper";
import ValuesType from "../../types/ValuesType";
import ModulesEnum from "../../enums/ModulesEnum";

import * as Clipboard from "expo-clipboard";

import { Image } from "expo-image";
import { useTheme } from "../../contexts/ThemeProvider";

import extractFastAccessObject from "../../utils/extractFastAccessObject";

const styles = StyleSheet.create({
  container: {
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 4,
    borderRadius: 12,
    overflow: "hidden",
    height: 44,
  },
  ripple: {
    padding: 0,
    paddingLeft: 8,
    paddingRight: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
});

type Props = {
  item: ValuesType;
  onPress: () => void;
  key?: React.Key;
};

function ListItem(props: Props) {
  const { theme } = useTheme();

  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("lock");

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const urlResult = props.item.modules.filter(
      (module) => module.module === ModulesEnum.URL
    );
    if (urlResult.length > 0) {
      if (urlResult[0].value !== "") {
        const string =
          "https://www.google.com/s2/favicons?domain=" +
          urlResult[0].value +
          "&sz=64";
        setUrl(string);
      } else {
        determineIcon();
      }
    } else {
      determineIcon();
    }
  }, [props.item, props.item.modules]);

  const copyToClipboard = async (value: string) => {
    await Clipboard.setStringAsync(value);
  };

  const determineIcon = () => {
    setUrl("");
    const keyResult = props.item.modules.filter(
      (module) => module.module === ModulesEnum.KEY
    );
    if (keyResult.length > 0) {
      setIcon("key-variant");
    } else {
      const wifiResult = props.item.modules.filter(
        (module) => module.module === ModulesEnum.WIFI
      );
      if (wifiResult.length > 0) {
        setIcon("wifi");
      } else {
        setIcon("lock");
      }
    }
  };
  return (
    <View
      key={props.key}
      style={[styles.container, { backgroundColor: theme.colors?.background, boxShadow: theme.colors?.shadow }]}
      onPointerEnter={() => Platform.OS === "web" && setHovered(true)}
      onPointerLeave={() => Platform.OS === "web" && setHovered(false)}
    >
      <TouchableRipple
        key={props.key}
        style={styles.ripple}
        onPress={props.onPress}
        rippleColor="rgba(0, 0, 0, .32)"
      >
        <>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            {url !== "" ? (
              <Image
                style={{ width: 30, height: 30, margin: 0, borderRadius: 8 }}
                source={url}
                contentFit="cover"
                transition={250}
                pointerEvents="none"
              />
            ) : (
              <View
                style={{
                  width: 30,
                  height: 30,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon color={"lightgray"} source={icon} size={26} />
              </View>
            )}
            <Text variant="bodyMedium" style={{ userSelect: "none" }}>
              {props.item.title}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            {hovered &&
              (() => {
                const fastAccessObject = extractFastAccessObject(
                  props.item.modules,
                  props.item.title
                );
                return (
                  <>
                    <IconButton
                      icon={"account"}
                      mode={"contained-tonal"}
                      size={20}
                      iconColor={theme.colors?.primary}
                      style={{ margin: 0, padding: 0, height: 30, width: 30 }}
                      onPress={() => {
                        copyToClipboard(fastAccessObject.username);
                      }}
                    />
                    <IconButton
                      icon={"form-textbox-password"}
                      mode={"contained"}
                      size={20}
                      iconColor={theme.colors?.primary}
                      style={{ margin: 0, padding: 0, height: 30, width: 30 }}
                      onPress={() => {
                        copyToClipboard(fastAccessObject.password);
                      }}
                    />
                  </>
                );
              })()}
            <Icon
              color={theme.colors?.primary}
              source={"chevron-right"}
              size={20}
            />
          </View>
        </>
      </TouchableRipple>
    </View>
  );
}

export default ListItem;

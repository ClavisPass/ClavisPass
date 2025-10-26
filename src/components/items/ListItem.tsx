import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Icon, IconButton, Text } from "react-native-paper";
import ValuesType from "../../types/ValuesType";
import ModulesEnum from "../../enums/ModulesEnum";

import * as Clipboard from "expo-clipboard";

import { Image } from "expo-image";
import { useTheme } from "../../contexts/ThemeProvider";

import extractFastAccessObject from "../../utils/extractFastAccessObject";
import AnimatedPressable from "../AnimatedPressable";

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
    overflow: "hidden",
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
    const wifiResult = props.item.modules.filter(
      (module) => module.module === ModulesEnum.WIFI
    );
    if (wifiResult.length > 0) {
      setIcon("wifi");
      return
    }

    const keyResult = props.item.modules.filter(
      (module) => module.module === ModulesEnum.KEY
    );
    if (keyResult.length > 0) {
      setIcon("key-variant");
      return
    }

    const taskResult = props.item.modules.filter(
      (module) => module.module === ModulesEnum.TASK
    );
    if (taskResult.length > 0) {
      setIcon("checkbox-multiple-marked");
      return
    }

    const digitalCardResult = props.item.modules.filter(
      (module) => module.module === ModulesEnum.DIGITAL_CARD
    );
    if (digitalCardResult.length > 0) {
      setIcon("credit-card-multiple");
      return
    }

    setIcon("lock");
  };
  return (
    <View
      key={props.key}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors?.background,
          boxShadow: theme.colors?.shadow,
        },
      ]}
      onPointerEnter={() => Platform.OS === "web" && setHovered(true)}
      onPointerLeave={() => Platform.OS === "web" && setHovered(false)}
    >
      <AnimatedPressable
        key={props.key}
        style={styles.ripple}
        onPress={props.onPress}
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
              gap: 2,
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
                      size={22}
                      iconColor={theme.colors?.primary}
                      style={{
                        margin: 0,
                        padding: 0,
                        height: 30,
                        width: 30,
                        borderRadius: 12,
                        borderBottomRightRadius: 0,
                        borderTopRightRadius: 0,
                      }}
                      onPress={() => {
                        copyToClipboard(fastAccessObject ? fastAccessObject.username : "");
                      }}
                    />
                    <IconButton
                      icon={"form-textbox-password"}
                      mode={"contained"}
                      size={22}
                      iconColor={theme.colors?.primary}
                      style={{
                        margin: 0,
                        padding: 0,
                        height: 30,
                        width: 30,
                        borderRadius: 12,
                        borderBottomLeftRadius: 0,
                        borderTopLeftRadius: 0,
                      }}
                      onPress={() => {
                        copyToClipboard(fastAccessObject ? fastAccessObject.password : "");
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
      </AnimatedPressable>
    </View>
  );
}

export default ListItem;

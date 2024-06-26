import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Icon, Text, TouchableRipple } from "react-native-paper";
import ValuesType from "../types/ValuesType";
import theme from "../ui/theme";
import ModulesEnum from "../enums/ModulesEnum";

import { Image } from "expo-image";
import FastAccess, { openFastAccess } from "../utils/FastAccess";
import { useQuickSelect } from "../contexts/QuickSelectProvider";

const styles = StyleSheet.create({
  container: {
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  ripple: {
    padding: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

type Props = {
  item: ValuesType;
  onPress: () => void;
};

function ListItem(props: Props) {
  const { setModules } = useQuickSelect();

  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("lock");
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
  }, [props.item]);

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
    <View style={styles.container}>
      <TouchableRipple
        style={styles.ripple}
        onPress={props.onPress}
        rippleColor="rgba(0, 0, 0, .32)"
        onLongPress={() => {
          openFastAccess(() => setModules(props.item.modules));
        }}
      >
        <>
          <FastAccess />
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
                style={{ width: 22, height: 22, margin: 0 }}
                source={url}
                contentFit="cover"
                transition={250}
              />
            ) : (
              <Icon color={"lightgray"} source={icon} size={20} />
            )}
            <Text variant="bodyMedium" style={{ userSelect: "none" }}>
              {props.item.title}
            </Text>
          </View>
          <Icon
            color={theme.colors.primary}
            source={"chevron-right"}
            size={20}
          />
        </>
      </TouchableRipple>
    </View>
  );
}

export default ListItem;

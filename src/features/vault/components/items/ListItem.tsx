import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Button, Icon, Text } from "react-native-paper";
import ValuesType from "../../model/ValuesType";
import ModulesEnum from "../../model/ModulesEnum";

import { Image } from "expo-image";
import { useTheme } from "../../../../app/providers/ThemeProvider";

import extractFastAccessObject from "../../../fastaccess/utils/extractFastAccessObject";
import AnimatedPressable from "../../../../shared/components/AnimatedPressable";
import Animated, { FadeInDown } from "react-native-reanimated";
import { emitClipboardCopied } from "../../../../infrastructure/events/clipboardBus";
import { useClipboardCopy } from "../../../../shared/hooks/useClipboardCopy";

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
  left: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    minWidth: 0,
    flexShrink: 1,
  },
  right: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  title: {
    userSelect: "none",
    flexShrink: 1,
  },
  iconBox: {
    width: 30,
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  chip: {
    margin: 0,
    height: 30,
    borderRadius: 12,
    minWidth: 0,
  },
  chipLeft: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  chipRight: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  chipContent: {
    height: 30,
    paddingHorizontal: 8,
  },
  chipUser: {
    maxWidth: 150,
  },
  chipPass: {
    maxWidth: 120,
  },
  chipText: {
    userSelect: "none",
  },
});

const ellipsize = (s: string, max = 16) => {
  if (!s) return "";
  if (s.length <= max) return s;
  return s.slice(0, Math.max(0, max - 1)) + "…";
};

const maskPassword = (pw: string, maxDots = 10) => {
  if (!pw) return "";
  const dots = "•".repeat(Math.min(pw.length, maxDots));
  return pw.length > maxDots ? `${dots}…` : dots;
};

type Props = {
  item: ValuesType;
  onPress: () => void;
  key?: React.Key;
  index: number;
};

function ListItem(props: Props) {
  const { theme, darkmode } = useTheme();
  const { copy } = useClipboardCopy();

  const usernameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const passwordTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("lock");
  const [hovered, setHovered] = useState(false);

  const [usernameIcon, setUsernameIcon] = useState("account");
  const [passwordIcon, setPasswordIcon] = useState("form-textbox-password");

  const clearUsernameTimer = () => {
    if (usernameTimerRef.current) {
      clearTimeout(usernameTimerRef.current);
      usernameTimerRef.current = null;
    }
  };

  const clearPasswordTimer = () => {
    if (passwordTimerRef.current) {
      clearTimeout(passwordTimerRef.current);
      passwordTimerRef.current = null;
    }
  };

  const resetUsernameIcon = () => {
    clearUsernameTimer();
    setUsernameIcon("account");
  };

  const resetPasswordIcon = () => {
    clearPasswordTimer();
    setPasswordIcon("form-textbox-password");
  };

  useEffect(() => {
    // cleanup on unmount
    return () => {
      clearUsernameTimer();
      clearPasswordTimer();
    };
  }, []);

  useEffect(() => {
    const urlResult = props.item.modules.filter(
      (module) => module.module === ModulesEnum.URL
    );

    if (urlResult.length > 0 && urlResult[0].value !== "") {
      const string =
        "https://www.google.com/s2/favicons?domain=" +
        urlResult[0].value +
        "&sz=64";
      setUrl(string);
    } else {
      setUrl("");
      determineIcon();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.item, props.item.modules]);

  // Optional aber sinnvoll: wenn hover weg ist, nie "check" hängen lassen
  useEffect(() => {
    if (!hovered) {
      resetUsernameIcon();
      resetPasswordIcon();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered]);

  const copyToClipboard = async (
    value: string,
    type: "username" | "password"
  ) => {
    if (!value) return;

    // Wenn ich username kopiere, soll password sofort wieder normal sein (und umgekehrt)
    if (type === "username") resetPasswordIcon();
    else resetUsernameIcon();

    const { durationMs } = await copy(value);

    if (type === "username") {
      clearUsernameTimer();
      setUsernameIcon("check");
      usernameTimerRef.current = setTimeout(() => {
        setUsernameIcon("account");
        usernameTimerRef.current = null;
      }, 1000);
    } else {
      clearPasswordTimer();
      setPasswordIcon("check");
      passwordTimerRef.current = setTimeout(() => {
        setPasswordIcon("form-textbox-password");
        passwordTimerRef.current = null;
      }, 1000);
    }

    if (!durationMs || durationMs <= 0) return;
    emitClipboardCopied({
      durationMs,
      createdAt: Date.now(),
    });
  };

  const determineIcon = () => {
    const modules = props.item.modules;

    if (modules.some((m) => m.module === ModulesEnum.WIFI)) {
      setIcon("wifi");
      return;
    }
    if (modules.some((m) => m.module === ModulesEnum.KEY)) {
      setIcon("key-variant");
      return;
    }
    if (modules.some((m) => m.module === ModulesEnum.TASK)) {
      setIcon("checkbox-multiple-marked");
      return;
    }
    if (modules.some((m) => m.module === ModulesEnum.DIGITAL_CARD)) {
      setIcon("credit-card-multiple");
      return;
    }

    setIcon("lock");
  };

  const fastAccessObject = useMemo(() => {
    if (!hovered) return null;
    return extractFastAccessObject(props.item.modules, props.item.title);
  }, [hovered, props.item.modules, props.item.title]);

  return (
    <Animated.View
      entering={FadeInDown.delay(props.index * 50).duration(250)}
      key={props.key}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors?.background,
          boxShadow: theme.colors?.shadow,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: darkmode ? theme.colors.outlineVariant : "white",
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
          <View style={styles.left}>
            {url !== "" ? (
              <Image
                style={{ width: 30, height: 30, margin: 0, borderRadius: 8 }}
                source={url}
                contentFit="cover"
                transition={250}
                pointerEvents="none"
              />
            ) : (
              <View style={styles.iconBox}>
                <Icon color={"lightgray"} source={icon} size={26} />
              </View>
            )}

            <Text
              variant="bodyMedium"
              style={styles.title}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {props.item.title}
            </Text>
          </View>

          <View style={styles.right}>
            {hovered && fastAccessObject && (
              <View style={styles.chipRow}>
                <Button
                  mode="contained-tonal"
                  compact
                  icon={usernameIcon}
                  onPress={() =>
                    copyToClipboard(fastAccessObject.username, "username")
                  }
                  style={[styles.chip, styles.chipLeft, styles.chipUser]}
                  contentStyle={styles.chipContent}
                >
                  <Text numberOfLines={1} style={styles.chipText}>
                    {ellipsize(fastAccessObject.username, 18)}
                  </Text>
                </Button>

                <Button
                  mode="contained-tonal"
                  compact
                  icon={passwordIcon}
                  onPress={() =>
                    copyToClipboard(fastAccessObject.password, "password")
                  }
                  style={[styles.chip, styles.chipRight, styles.chipPass]}
                  contentStyle={styles.chipContent}
                >
                  <Text numberOfLines={1} style={styles.chipText}>
                    {maskPassword(fastAccessObject.password)}
                  </Text>
                </Button>
              </View>
            )}

            <Icon
              color={theme.colors?.primary}
              source={"chevron-right"}
              size={20}
            />
          </View>
        </>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default ListItem;
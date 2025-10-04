import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import * as Progress from "react-native-progress";

import ModuleContainer from "../container/ModuleContainer";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import Props from "../../types/ModuleProps";
import { codeFromUri, parseOtpauth } from "../../utils/totp";
import { useTheme } from "../../contexts/ThemeProvider";
import TotpModuleType from "../../types/modules/TotpModuleType";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../stacks/Stack";
import CopyToClipboard from "../buttons/CopyToClipboard";
import CircularProgressBar from "../CircularProgressBar";
import { AnimatedCircularProgress } from "react-native-circular-progress";

type TotpModuleModuleProps = {
  navigation: StackNavigationProp<RootStackParamList, "Edit", undefined>;
};

function useToggleTransition(show: boolean, duration = 220) {
  const progress = React.useRef(new Animated.Value(show ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: show ? 1 : 0,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [show, duration, progress]);

  const shownStyle = {
    opacity: progress,
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [8, 0],
        }),
      },
      {
        scale: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.98, 1],
        }),
      },
    ],
  } as const;

  const hiddenStyle = {
    opacity: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8],
        }),
      },
      {
        scale: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.98],
        }),
      },
    ],
  } as const;

  return { shownStyle, hiddenStyle };
}

const styles = StyleSheet.create({
  switcher: {
    position: "relative",
    flex: 1,
    minHeight: 96, // sorgt dafür, dass der Container nicht einklappt
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
  },
});

function TotpModule(props: TotpModuleType & Props & TotpModuleModuleProps) {
  const didMount = useRef(false);
  const { globalStyles, theme } = useTheme();

  const [editValue, setEditValue] = useState(false);

  const { shownStyle, hiddenStyle } = useToggleTransition(editValue);

  const [value, setValue] = useState(props.value);
  const [code, setCode] = useState<string>("------");
  const [remaining, setRemaining] = useState<number>(30);
  const [importVisible, setImportVisible] = useState(false);

  const info = useMemo(() => {
    try {
      return parseOtpauth(value);
    } catch {
      return undefined;
    }
  }, [value]);

  useEffect(() => {
    if (didMount.current) {
      const newModule: TotpModuleType = {
        id: props.id,
        module: props.module,
        value,
      };
      props.changeModule(newModule);
    } else {
      didMount.current = true;
    }
  }, [value]);

  // tick: code + remaining jede Sekunde
  useEffect(() => {
    let timer: any;
    const tick = () => {
      try {
        const { code, remaining } = codeFromUri(value);
        setCode(code);
        setRemaining(remaining);
      } catch {
        setCode("------");
        setRemaining(0);
      }
    };
    tick();
    timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [value]);

  const progress = useMemo(() => {
    const p = info?.period ?? 30;
    return 1 - remaining / p;
  }, [remaining, info?.period]);

  return (
    <ModuleContainer
      id={props.id}
      title={"Two-Factor Auth"}
      edit={props.edit}
      deletable={props.edit}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.TOTP}
      fastAccess={props.fastAccess}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          paddingRight: 10,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: 4,
          }}
        >
          <IconButton
            selected
            mode="contained-tonal"
            iconColor={theme.colors.primary}
            icon="barcode-scan"
            size={20}
            onPress={() => {
              props.navigation.navigate("TotpScan", {
                setOtpauth: (uri: string) => setValue(uri),
              });
            }}
          />
          <IconButton
            selected
            mode="contained-tonal"
            iconColor={theme.colors.primary}
            icon="swap-horizontal"
            size={20}
            onPress={() => {
              setEditValue((s) => !s);
            }}
          />
        </View>

        <View style={styles.switcher}>
          <Animated.View
            style={[styles.layer, shownStyle]}
            pointerEvents={editValue ? "auto" : "none"}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                flex: 1,
                paddingTop: 5,
              }}
            >
              <View style={{ height: 40, flex: 1 }}>
                <TextInput
                  outlineStyle={globalStyles.outlineStyle}
                  style={globalStyles.textInputStyle}
                  value={value}
                  mode="outlined"
                  onChangeText={(text) => setValue(text)}
                  autoComplete="one-time-code"
                  keyboardType="visible-password"
                />
              </View>
            </View>
          </Animated.View>

          <Animated.View
            style={[styles.layer, hiddenStyle]}
            pointerEvents={editValue ? "none" : "auto"}
          >
            <View
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",

              }}
            >
              {value !== "" ? (
                <View
                  style={[
                    globalStyles.moduleView,
                    {
                      flex: 1,
                      display: "flex",
                      justifyContent: "space-between",
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ opacity: 0.7, marginTop: 4, marginLeft: 6 }}>
                      {info?.issuer ? `${info.issuer} • ` : ""}
                      {info?.account ?? ""}
                    </Text>
                    <View style={[globalStyles.moduleView, {alignItems: "flex-start", justifyContent: "flex-start"}]}>
                      <Text
                        style={{
                          fontSize: 34,
                          fontVariant: ["tabular-nums"],
                          letterSpacing: 2,
                          color: theme.colors.primary,
                        }}
                      >
                        {code
                          ? `${code.slice(0, 3)} ${code.slice(3)}`
                          : "--- ---"}
                      </Text>
                      <CopyToClipboard value={code} />
                    </View>
                  </View>
                  <View style={{ width: 60, height: 60 }}>
                    <AnimatedCircularProgress
                      size={60}
                      width={6}
                      fill={(1 - remaining / (info?.period ?? 30)) * 100}
                      tintColor={theme.colors.primary}
                      backgroundColor="#d3d3d341"
                      rotation={0}
                      lineCap="round"
                    >
                      {() => (
                        <Text
                          variant="bodyMedium"
                          style={[
                            { color: theme.colors.primary },
                            {
                              fontWeight: "bold",
                              fontSize: 16,
                              userSelect: "none",
                            },
                          ]}
                        >
                          {`${remaining}s`}
                        </Text>
                      )}
                    </AnimatedCircularProgress>
                  </View>
                </View>
              ) : (
                <Button
                  style={{ borderRadius: 12 }}
                  icon={"barcode-scan"}
                  mode="contained-tonal"
                  textColor={theme.colors.primary}
                  onPress={() => {
                    props.navigation.navigate("TotpScan", {
                      setOtpauth: (uri: string) => setValue(uri),
                    });
                  }}
                >
                  Scan Code
                </Button>
              )}
            </View>
          </Animated.View>
        </View>
      </View>
    </ModuleContainer>
  );
}

export default TotpModule;

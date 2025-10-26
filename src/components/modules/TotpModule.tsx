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

const styles = StyleSheet.create({
  switcher: {
    position: "relative",
    flex: 1,
    minHeight: 96,
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
  },
});

function TotpModule(props: TotpModuleType & Props & TotpModuleModuleProps) {
  const didMount = useRef(false);
  const { globalStyles, theme } = useTheme();

  const [value, setValue] = useState(props.value);
  const [code, setCode] = useState<string>("------");
  const [remaining, setRemaining] = useState<number>(30);

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
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.TOTP}
      fastAccess={props.fastAccess}
    >
      <View style={globalStyles.moduleView}>
        {value !== "" ? (
          <View
            style={{
              paddingTop: 8,
              flex: 1,
              display: "flex",
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
            }}
          >
            <AnimatedCircularProgress
              size={54}
              width={6}
              fill={(1 - remaining / (info?.period ?? 30)) * 100}
              tintColor={theme.colors.primary}
              backgroundColor="#d3d3d341"
              rotation={0}
              lineCap="round"
              style={{ alignItems: "center", justifyContent: "center" }}
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
            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 34,
                    fontVariant: ["tabular-nums"],
                    letterSpacing: 2,
                    color: theme.colors.primary,
                  }}
                >
                  {code ? `${code.slice(0, 3)} ${code.slice(3)}` : "--- ---"}
                </Text>
                <CopyToClipboard value={code} margin={0}/>
              </View>
              <Text style={{ opacity: 0.7 }}>
                {info?.issuer ? `${info.issuer} • ` : ""}
                {info?.account ?? ""}
              </Text>
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
    </ModuleContainer>
  );
}

export default TotpModule;

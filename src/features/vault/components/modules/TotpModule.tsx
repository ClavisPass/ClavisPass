import React, { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

import ModuleContainer from "../ModuleContainer";
import Props from "../../model/ModuleProps";
import { codeFromUri, parseOtpauth } from "../../utils/totp";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import TotpModuleType from "../../model/modules/TotpModuleType";
import CopyToClipboard from "../../../../shared/components/buttons/CopyToClipboard";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useTranslation } from "react-i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ModulesEnum from "../../model/ModulesEnum";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";
import { HomeStackParamList } from "../../../../app/navigation/model/types";

export function Totp(props: { value: string }) {
  const { theme } = useTheme();

  const [code, setCode] = useState<string>("------");
  const [remaining, setRemaining] = useState<number>(30);

  const info = useMemo(() => {
    try {
      return parseOtpauth(props.value);
    } catch {
      return undefined;
    }
  }, [props.value]);

  useEffect(() => {
    let timer: any;
    const tick = () => {
      try {
        const { code, remaining } = codeFromUri(props.value);
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
  }, [props.value]);

  return (
    <View
      style={{
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
          <CopyToClipboard value={code} margin={0} />
        </View>
        <Text style={{ opacity: 0.7 }}>
          {info?.issuer ? `${info.issuer} • ` : ""}
          {info?.account ?? ""}
        </Text>
      </View>
    </View>
  );
}

type TotpModuleModuleProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, "Edit", undefined>;
};

function TotpModule(props: TotpModuleType & Props & TotpModuleModuleProps) {
  const didMount = useRef(false);
  const { globalStyles, theme } = useTheme();
  const { t } = useTranslation();

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
      title={t("modules:totp")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.TOTP]}
      fastAccess={props.fastAccess}
    >
      <View style={[globalStyles.moduleView]}>
        {value !== "" ? (
          <Totp value={value} />
        ) : (
          <Button
            style={{ borderRadius: 12, marginRight: 21 }}
            icon={"qrcode-scan"}
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

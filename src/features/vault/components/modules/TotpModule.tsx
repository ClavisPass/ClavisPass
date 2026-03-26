import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Divider, Text } from "react-native-paper";

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

const styles = StyleSheet.create({
  content: {
    width: "100%",
  },
  card: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  headerLeft: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  progressWrap: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
  },
  codeSurface: {
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 8,
    paddingVertical: 12,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  codeText: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: 2,
    fontVariant: ["tabular-nums"],
    userSelect: "none",
    flexShrink: 1,
  },
  scanButton: {
    borderRadius: 12,
  },
});

export function Totp(props: { value: string; variant?: "module" | "list" }) {
  const { theme, darkmode } = useTheme();

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

  const primaryLabel = info?.issuer ?? info?.account ?? "Authenticator";
  const secondaryLabel =
    info?.issuer && info?.account
      ? info.account
      : info?.issuer ?? info?.account ?? "";
  const isListVariant = props.variant === "list";
  const headerPaddingVertical = isListVariant ? 12 : 8;
  const bodyPaddingTop = isListVariant ? 14 : 8;
  const bodyPaddingBottom = isListVariant ? 14 : 8;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isListVariant ? "transparent" : theme.colors.background,
          borderColor: isListVariant
            ? "transparent"
            : darkmode
              ? theme.colors.outlineVariant
              : "white",
          borderWidth: isListVariant ? 0 : StyleSheet.hairlineWidth,
        },
      ]}
    >
      <View style={[styles.header, { paddingVertical: headerPaddingVertical }]}>
        <View style={styles.headerLeft}>
          <Text
            variant="labelMedium"
            style={{ color: theme.colors.primary, fontWeight: "700" }}
            numberOfLines={1}
          >
            {primaryLabel}
          </Text>
          <Text
            numberOfLines={1}
            style={{ opacity: 0.72, color: theme.colors.onSurface }}
          >
            {secondaryLabel}
          </Text>
        </View>
        <View style={styles.progressWrap}>
          <AnimatedCircularProgress
            size={54}
            width={6}
            fill={(1 - remaining / (info?.period ?? 30)) * 100}
            tintColor={theme.colors.primary}
            backgroundColor={darkmode ? "rgba(255,255,255,0.10)" : "#d3d3d341"}
            rotation={0}
            lineCap="round"
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            {() => (
              <Text
                variant="bodyMedium"
                style={{
                  color: theme.colors.primary,
                  fontWeight: "700",
                  fontSize: 15,
                  userSelect: "none",
                }}
              >
                {`${remaining}s`}
              </Text>
            )}
          </AnimatedCircularProgress>
        </View>
      </View>
      <Divider />
      <View
        style={[
          styles.body,
          { paddingTop: bodyPaddingTop, paddingBottom: bodyPaddingBottom },
        ]}
      >
        <View
          style={[
            styles.codeSurface,
            {
              backgroundColor: theme.colors.surfaceVariant,
              borderColor: darkmode
                ? theme.colors.outlineVariant
                : "rgba(0, 0, 0, 0.06)",
            },
          ]}
        >
          <Text style={[styles.codeText, { color: theme.colors.primary }]}>
            {code ? `${code.slice(0, 3)} ${code.slice(3)}` : "--- ---"}
          </Text>
          <CopyToClipboard value={code} margin={0} />
        </View>
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

  return (
    <ModuleContainer
      id={props.id}
      title={t("modules:totp")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.TOTP]}
      fastAccess={props.fastAccess}
    >
      <View style={[globalStyles.moduleView, styles.content]}>
        {value !== "" ? (
          <Totp value={value} />
        ) : (
          <Button
            style={styles.scanButton}
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

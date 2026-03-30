import Barcode from "@kichiyaki/react-native-barcode-generator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { DropdownInputProps } from "react-native-paper-dropdown";
import QRCode from "react-qr-code";

import { HomeStackParamList } from "../../../../app/navigation/model/types";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import AnimatedPressable from "../../../../shared/components/AnimatedPressable";
import DigitalCardType, {
  DIGITAL_CARD_TYPES,
} from "../../model/DigitalCardType";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";
import Props from "../../model/ModuleProps";
import DigitalCardModuleType from "../../model/modules/DigitalCardModuleType";


import ModulesEnum from "../../model/ModulesEnum";
import ModuleContainer from "../ModuleContainer";

type DigitalCardModuleProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, "Edit", undefined>;
  title: string;
};

function isDigitalCardType(x: unknown): x is DigitalCardType {
  return (
    typeof x === "string" && DIGITAL_CARD_TYPES.includes(x as DigitalCardType)
  );
}

const styles = StyleSheet.create({
  emptyButtonWrap: {
    width: "100%",
    alignItems: "center",
  },
  previewWrap: {
    width: "100%",
    alignItems: "center",
  },
  switcher: {
    position: "relative",
    flex: 1,
    minHeight: 96, // sorgt dafür, dass der Container nicht einklappt
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
  },
  emptyButton: {
    borderRadius: 12,
    minWidth: 170,
    transform: [{ translateX: -14 }],
  },
  previewSurface: {
    transform: [{ translateX: -14 }],
  },
});

function DigitalCardModule(
  props: DigitalCardModuleType & Props & DigitalCardModuleProps,
) {
  const didMount = useRef(false);
  const { globalStyles, theme } = useTheme();
  const { t } = useTranslation();

  const OPTIONS = useMemo(
    () => DIGITAL_CARD_TYPES.map((t) => ({ label: t, value: t })),
    [],
  );

  const CustomDropdownInput = useCallback(
    ({ selectedLabel, rightIcon }: DropdownInputProps) => (
      <TextInput
        outlineStyle={[globalStyles.outlineStyle]}
        style={globalStyles.textInputStyle}
        mode="outlined"
        value={selectedLabel}
        right={rightIcon}
      />
    ),
    [globalStyles],
  );

  const [value, setValue] = useState(props.value);
  const [type, setType] = useState<DigitalCardType>(
    props.type as DigitalCardType,
  );

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    if (isDigitalCardType(props.type)) {
      setType(props.type);
    }
  }, [props.type]);

  useEffect(() => {
    if (didMount.current) {
      const newModule: DigitalCardModuleType = {
        id: props.id,
        module: props.module,
        type,
        value,
      };
      props.changeModule(newModule);
    } else {
      didMount.current = true;
    }
  }, [type, value]);

  return (
    <ModuleContainer
      id={props.id}
      title={t("modules:digitalCard")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.DIGITAL_CARD]}
      fastAccess={props.fastAccess}
    >
      <View style={[globalStyles.moduleView]}>
        <AnimatedPressable
          key={props.key}
          style={[{ borderRadius: 12, width: "100%" }]}
          onPress={
            value !== ""
              ? () => {
                  props.navigation.navigate("CardDetails", {
                    value,
                    title: props.title,
                    type,
                    sourceUrl: null,
                    faviconUrl: null,
                    accentColor: null,
                  });
                }
              : undefined
          }
        >
          <View
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              height: 112,
              borderRadius: 12,
              padding: 8,
              width: "100%",
              backgroundColor: theme.colors.background,
            }}
          >
            {value !== "" ? (
              <View style={styles.previewWrap}>
                <View
                  style={[
                    styles.previewSurface,
                    {
                      padding: 10,
                      backgroundColor: "white",
                      borderRadius: 16,
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: "rgba(0, 0, 0, 0.06)",
                    },
                  ]}
                >
                  {type === "QR-Code" ? (
                    <QRCode value={value} size={90} />
                  ) : (
                    <Barcode
                      height={70}
                      format={type}
                      value={value}
                      text={value}
                    />
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.emptyButtonWrap}>
                <Button
                  style={styles.emptyButton}
                  icon="barcode-scan"
                  mode="contained-tonal"
                  textColor={theme.colors.primary}
                  onPress={() => {
                    props.navigation.navigate("DigitalCardScan", {
                      setData: (data: string, scanType: string) => {
                        setType(scanType as DigitalCardType);
                        setValue(data);
                      },
                    });
                  }}
                >
                  Scan Code
                </Button>
              </View>
            )}
          </View>
        </AnimatedPressable>
      </View>
    </ModuleContainer>
  );
}

export default DigitalCardModule;

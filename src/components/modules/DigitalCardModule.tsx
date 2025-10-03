import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import { Button, IconButton, TextInput } from "react-native-paper";
import { Dropdown, DropdownInputProps } from "react-native-paper-dropdown";

import ModuleContainer from "../container/ModuleContainer";
import Props from "../../types/ModuleProps";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import { useTheme } from "../../contexts/ThemeProvider";
import DigitalCardModuleType from "../../types/modules/DigitalCardModuleType";
import DigitalCardType, {
  DIGITAL_CARD_TYPES,
} from "../../types/DigitalCardType";
import QRCode from "react-qr-code";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import { StackNavigationProp } from "@react-navigation/stack/lib/typescript/src/types";
import { RootStackParamList } from "../../stacks/Stack";

type DigitalCardModuleProps = {
  navigation: StackNavigationProp<RootStackParamList, "Edit", undefined>;
};

function isDigitalCardType(x: unknown): x is DigitalCardType {
  return (
    typeof x === "string" && DIGITAL_CARD_TYPES.includes(x as DigitalCardType)
  );
}

/** Cross-platform Toggle Transition (opacity + translateY + slight scale) */
function useToggleTransition(show: boolean, duration = 220) {
  const progress = React.useRef(new Animated.Value(show ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: show ? 1 : 0,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true, // opacity & transform -> safe on iOS/Android/Web
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

function DigitalCardModule(
  props: DigitalCardModuleType & Props & DigitalCardModuleProps
) {
  const didMount = useRef(false);
  const { globalStyles, theme } = useTheme();

  const OPTIONS = useMemo(
    () => DIGITAL_CARD_TYPES.map((t) => ({ label: t, value: t })),
    []
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
    [globalStyles]
  );

  const [value, setValue] = useState(props.value);
  const [type, setType] = useState<DigitalCardType>(
    props.type as DigitalCardType
  );
  const [editValue, setEditValue] = useState(false);

  const { shownStyle, hiddenStyle } = useToggleTransition(editValue);

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
      title="Digital Card"
      edit={props.edit}
      deletable={props.edit}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.DIGITAL_CARD}
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
              props.navigation.navigate("DigitalCardScan", {
                setData: (data: string, scanType: string) => {
                  setType(scanType as DigitalCardType);
                  setValue(data);
                },
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

        {/* Switcher mit Cross-Fade/Slide */}
        <View style={styles.switcher}>
          {/* Edit-Ansicht (eingeblendet wenn editValue=true) */}
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
              <View style={globalStyles.moduleView}>
                <View style={{ borderRadius: 12, overflow: "hidden", flex: 1 }}>
                  <Dropdown
                    CustomDropdownInput={CustomDropdownInput}
                    menuContentStyle={{
                      borderRadius: 12,
                      backgroundColor: theme.colors.background,
                      boxShadow: theme.colors.shadow,
                      overflow: "hidden",
                    }}
                    mode="flat"
                    hideMenuHeader
                    options={OPTIONS}
                    value={type}
                    onSelect={(v?: string) => {
                      if (isDigitalCardType(v)) setType(v);
                    }}
                  />
                </View>
              </View>
              <View style={globalStyles.moduleView}>
                <View style={{ height: 40, flex: 1 }}>
                  <TextInput
                    placeholder="Card Number"
                    outlineStyle={globalStyles.outlineStyle}
                    style={globalStyles.textInputStyle}
                    value={value}
                    mode="outlined"
                    onChangeText={setValue}
                  />
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Anzeige-Ansicht (ausgeblendet wenn editValue=true) */}
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
                height: 96,
                paddingRight: 48,
              }}
            >
              {value !== "" ? (
                type === "QR-Code" ? (
                  <QRCode value={value} size={90} />
                ) : (
                  <Barcode
                    height={70}
                    format={type}
                    value={value}
                    text={value}
                  />
                )
              ) : (
                <Button
                  style={{ borderRadius: 12 }}
                  icon={"barcode-scan"}
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
              )}
            </View>
          </Animated.View>
        </View>
      </View>
    </ModuleContainer>
  );
}

export default DigitalCardModule;

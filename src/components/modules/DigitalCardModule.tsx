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
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.DIGITAL_CARD}
      fastAccess={props.fastAccess}
    >
      <View style={globalStyles.moduleView}>
        <View
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            height: 96,
            //paddingRight: 48,
          }}
        >
          {value !== "" ? (
            type === "QR-Code" ? (
              <QRCode value={value} size={90} />
            ) : (
              <Barcode height={70} format={type} value={value} text={value} />
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
      </View>
    </ModuleContainer>
  );
}

export default DigitalCardModule;

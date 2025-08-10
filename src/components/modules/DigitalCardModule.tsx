import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import { Dropdown, DropdownInputProps } from "react-native-paper-dropdown";

import ModuleContainer from "../container/ModuleContainer";
import Props from "../../types/ModuleProps";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import { useTheme } from "../../contexts/ThemeProvider";
import DigitalCardModuleType from "../../types/modules/DigitalCardModuleType";
import DigitalCardType, {
  DIGITAL_CARD_TYPES,
} from "../../types/DigitalCardType";
import CopyToClipboard from "../buttons/CopyToClipboard";
import QRCode from "react-qr-code";
import Barcode from "@kichiyaki/react-native-barcode-generator";

function isDigitalCardType(x: unknown): x is DigitalCardType {
  return (
    typeof x === "string" && DIGITAL_CARD_TYPES.includes(x as DigitalCardType)
  );
}

function DigitalCardModule(props: DigitalCardModuleType & Props) {
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
      delete={props.edit}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.DIGITAL_CARD}
      fastAccess={props.fastAccess}
    >
      {props.edit ? (
        <View
          style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}
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
            <IconButton
              iconColor={theme.colors.primary}
              icon="barcode-scan"
              size={20}
            />
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
            <CopyToClipboard value={value} />
          </View>
        </View>
      ) : (
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            height: 102,
          }}
        >
          {type === "QR-Code" ? (
            <QRCode value={value} size={90} />
          ) : (
            <Barcode format={type} value={value} text={value} />
          )}
        </View>
      )}
    </ModuleContainer>
  );
}

export default DigitalCardModule;

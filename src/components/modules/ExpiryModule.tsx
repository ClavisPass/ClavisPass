import React, { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { Button, Chip, IconButton, Text } from "react-native-paper";
import * as Progress from "react-native-progress";

import ModuleContainer from "../container/ModuleContainer";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import Props from "../../types/ModuleProps";
import {
  getStatus,
  formatRelative,
  formatAbsoluteLocal,
} from "../../utils/expiry";
import { useTheme } from "../../contexts/ThemeProvider";
import ExpiryPickerModal from "../modals/ExpiryPickerModal";
import ExpiryModuleType from "../../types/modules/ExpiryModuleType";

function ExpiryModule(props: ExpiryModuleType & Props) {
  const didMount = useRef(false);
  const { globalStyles, theme } = useTheme();

  const warnBeforeMs = props.warnBeforeMs ?? 24 * 60 * 60 * 1000;

  const [value, setValue] = useState<string>(props.value ?? "");
  const [tick, setTick] = useState(0);
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    if (didMount.current) {
      const newModule: ExpiryModuleType = {
        id: props.id,
        module: props.module,
        value: value,
        warnBeforeMs,
      };
      props.changeModule(newModule);
    } else {
      didMount.current = true;
    }
  }, [value]);

  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const statusInfo = useMemo(
    () => getStatus(value, Date.now(), warnBeforeMs),
    [value, tick, warnBeforeMs]
  );

  const colorByStatus =
    statusInfo.status === "expired"
      ? theme.colors.error
      : statusInfo.status === "dueSoon"
        ? "yellow"
        : theme.colors.primary;

  const progress =
    statusInfo.status === "active" || statusInfo.status === "dueSoon"
      ? 1 - Math.min(1, Math.max(0, statusInfo.remainingMs / warnBeforeMs))
      : 1;

  return (
    <ModuleContainer
      id={props.id}
      title={"Expiry"}
      edit={props.edit}
      deletable={props.edit}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.EXPIRY}
      fastAccess={props.fastAccess}
    >
      <View style={globalStyles.moduleView}>
        <View style={{ flex: 1 }}>
          {value ? (
            <>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                {formatAbsoluteLocal(value, "de-DE")}
              </Text>
              <Text style={{ opacity: 0.7, marginTop: 2 }}>
                {statusInfo.status === "expired"
                  ? `Expired (${formatRelative(statusInfo.remainingMs)})`
                  : `Expires ${formatRelative(statusInfo.remainingMs)}`}
              </Text>
            </>
          ) : null}
        </View>
      </View>

      {value ? (
        <View style={globalStyles.moduleView}>
          <IconButton
            style={{ margin: 0, marginLeft: 8, marginRight: 8 }}
            iconColor={theme.colors.primary}
            icon="pencil"
            size={18}
            onPress={() => setPickerVisible(true)}
          />
          <IconButton
            style={{ margin: 0, marginLeft: 0, marginRight: 8 }}
            iconColor={theme.colors.primary}
            icon="delete-outline"
            size={18}
            onPress={() => setValue("")}
          />
        </View>
      ) : (
        <View
          style={[globalStyles.moduleView, { justifyContent: "center" }]}
        >
          <Button
            style={{ borderRadius: 12 }}
            mode="contained-tonal"
            onPress={() => setPickerVisible(true)}
            icon="calendar"
          >
            Set expiry date
          </Button>
        </View>
      )}

      <ExpiryPickerModal
        visible={pickerVisible}
        setVisible={setPickerVisible}
        initialIso={value ?? undefined}
        onConfirm={(iso) => setValue(iso)}
      />
    </ModuleContainer>
  );
}

export default ExpiryModule;

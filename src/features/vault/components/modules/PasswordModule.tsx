import React, { useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import * as Progress from "react-native-progress";
import { useTranslation } from "react-i18next";
import { Text } from "react-native-paper";

import PasswordModuleType from "../../model/modules/PasswordModuleType";
import ModuleContainer from "../ModuleContainer";
import Props from "../../model/ModuleProps";

import CopyToClipboard from "../../../../shared/components/buttons/CopyToClipboard";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import PasswordTextbox from "../../../../shared/components/PasswordTextbox";
import PasswordGeneratorModal from "../modals/PasswordGeneratorModal";

import PasswordStrengthLevel from "../../../analysis/model/PasswordStrengthLevel";
import {
  computeEntropyBitsForUi,
  entropyToProgress,
  entropyToStrength,
} from "../../utils/entropyUi";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";
import ModulesEnum from "../../model/ModulesEnum";
import AppChip from "../../../../shared/components/chips/AppChip";

const styles = StyleSheet.create({
  strengthContainer: {
    flex: 1,
    gap: 6,
  },
  strengthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 2,
  },
  strengthActions: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
  },
  strengthLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  strengthRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  strengthProgress: {
    paddingHorizontal: 2,
  },
  copySpacer: {
    width: 40,
    marginLeft: 8,
  },
  generatorChip: {
    minHeight: 30,
  },
  generatorChipText: {
    flexShrink: 1,
  },
});

function PasswordModule(props: PasswordModuleType & Props) {
  const didMount = useRef(false);
  const { t } = useTranslation();
  const { globalStyles, theme } = useTheme();
  const [value, setValue] = useState(props.value);
  const [strengthLabel, setStrengthLabel] = useState(t("analysis:strong"));
  const getStrengthColor = (strength: PasswordStrengthLevel) => {
    if (strength === PasswordStrengthLevel.WEAK) return theme.colors.error;
    if (strength === PasswordStrengthLevel.MEDIUM) return theme.colors.warning;
    return theme.colors.success;
  };

  const [entropyPercentage, setEntropyPercentage] = useState(0);
  const [progressbarColor, setProgressbarColor] = useState(
    getStrengthColor(PasswordStrengthLevel.STRONG),
  );

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    const entropyBits = computeEntropyBitsForUi(value);
    const strength = entropyToStrength(entropyBits);
    const progress = entropyToProgress(entropyBits);

    setProgressbarColor(getStrengthColor(strength));
    setStrengthLabel(t(`analysis:${strength.toLowerCase()}`));
    setEntropyPercentage(progress);
  }, [t, value]);

  useEffect(() => {
    if (didMount.current) {
      const newModule: PasswordModuleType = {
        id: props.id,
        module: props.module,
        value: value,
      };
      props.changeModule(newModule);
    } else {
      didMount.current = true;
    }
  }, [value]);

  return (
    <ModuleContainer
      id={props.id}
      title={t("modules:password")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.PASSWORD]}
      fastAccess={props.fastAccess}
    >
      <View style={globalStyles.moduleView}>
        <View style={{ height: 40, flex: 1 }}>
          <PasswordTextbox
            autofocus={props.autoFocus !== false && value === ""}
            setValue={setValue}
            value={value}
            placeholder=""
            exclusiveRevealId={`vault:${props.id}:password`}
          />
        </View>
        <CopyToClipboard value={value} kind="password" />
      </View>

      <View style={styles.strengthRow}>
        <View style={styles.strengthContainer}>
          <View style={styles.strengthProgress}>
            <Progress.Bar
              progress={entropyPercentage}
              color={progressbarColor}
              width={null}
              borderWidth={0}
              unfilledColor={theme.colors.outlineVariant}
              height={4}
            />
          </View>

          <View style={styles.strengthHeader}>
            <View style={styles.strengthLabelGroup}>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {t("modules:passwordStrength")}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: progressbarColor, fontWeight: "600" }}
              >
                {strengthLabel}
              </Text>
            </View>
            <View style={styles.strengthActions}>
              <AppChip
                compact
                onPress={() => {
                  Keyboard.dismiss();
                  setVisible(true);
                }}
                style={styles.generatorChip}
                textStyle={[
                  styles.generatorChipText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {t("common:generatePassword")}
              </AppChip>
            </View>
          </View>
        </View>
        <View style={styles.copySpacer} />
      </View>

      <PasswordGeneratorModal
        visible={visible}
        setVisible={setVisible}
        changePassword={setValue}
      />
    </ModuleContainer>
  );
}

export default PasswordModule;

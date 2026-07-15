import React from "react";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { Divider, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useTheme } from "../../../../app/providers/ThemeProvider";
import Modal from "../../../../shared/components/modals/Modal";
import { MenuItem } from "../../../../shared/components/menus/MenuItem";
import ModulesEnum from "../../model/ModulesEnum";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";
import getModuleNameByEnum from "../../utils/getModuleNameByEnum";

type Props = {
  visible: boolean;
  selectedModules: ModulesEnum[];
  onToggleModule: (module: ModulesEnum) => void;
  onDismiss: () => void;
};

export const FILTERABLE_MODULES: ModulesEnum[] = [
  ModulesEnum.USERNAME,
  ModulesEnum.PASSWORD,
  ModulesEnum.URL,
  ModulesEnum.E_MAIL,
  ModulesEnum.PHONE_NUMBER,
  ModulesEnum.TOTP,
  ModulesEnum.DIGITAL_CARD,
  ModulesEnum.NOTE,
  ModulesEnum.TASK,
  ModulesEnum.EXPIRY,
  ModulesEnum.PIN,
  ModulesEnum.KEY,
  ModulesEnum.WIFI,
  ModulesEnum.RECOVERY_CODES,
  ModulesEnum.CUSTOM_FIELD,
];

function ModuleFilterModal(props: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { height, width } = useWindowDimensions();
  const selected = React.useMemo(
    () => new Set(props.selectedModules),
    [props.selectedModules],
  );
  const modalMaxHeight = Math.max(280, Math.min(460, height - 112));
  const listMaxHeight = Math.max(180, modalMaxHeight - 98);

  return (
    <Modal visible={props.visible} onDismiss={props.onDismiss}>
      <View
        style={{
          width: Math.min(340, width - 32),
          maxHeight: modalMaxHeight,
          borderRadius: 12,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.outlineVariant,
          backgroundColor: theme.colors.background,
        }}
      >
        <View
          style={{
            gap: 3,
            paddingHorizontal: 14,
            paddingTop: 12,
            paddingBottom: 10,
          }}
        >
          <Text variant="titleMedium">{t("home:moduleFilterTitle")}</Text>
          <Text variant="bodySmall" style={{ opacity: 0.72 }}>
            {t("home:moduleFilterText")}
          </Text>
        </View>

        <Divider />

        <ScrollView
          style={{ maxHeight: listMaxHeight }}
          showsVerticalScrollIndicator
        >
          {FILTERABLE_MODULES.map((module, index) => {
            const isSelected = selected.has(module);
            return (
              <View key={module}>
                {index > 0 ? <Divider /> : null}
                <MenuItem
                  leadingIcon={MODULE_ICON[module]}
                  selected={isSelected}
                  onPress={() => props.onToggleModule(module)}
                  rightIcon={isSelected ? "check" : undefined}
                >
                  {getModuleNameByEnum(module, t)}
                </MenuItem>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

export default ModuleFilterModal;

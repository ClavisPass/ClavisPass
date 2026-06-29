import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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
  const selected = React.useMemo(
    () => new Set(props.selectedModules),
    [props.selectedModules],
  );

  return (
    <Modal visible={props.visible} onDismiss={props.onDismiss}>
      <View
        style={{
          width: 320,
          maxHeight: 520,
          padding: 14,
          gap: 12,
          borderRadius: 12,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.outlineVariant,
          backgroundColor: theme.colors.background,
        }}
      >
        <View style={{ gap: 4 }}>
          <Text variant="headlineSmall">{t("home:moduleFilterTitle")}</Text>
          <Text variant="bodyMedium" style={{ opacity: 0.72 }}>
            {t("home:moduleFilterText")}
          </Text>
        </View>

        <ScrollView>
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

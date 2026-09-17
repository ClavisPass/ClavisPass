import React from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { Divider } from "react-native-paper";
import { useTranslation } from "react-i18next";

import Modal from "../../../../shared/components/modals/Modal";
import ModalSurface from "../../../../shared/components/modals/ModalSurface";
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
  ModulesEnum.ADDRESS,
  ModulesEnum.COMPANY,
  ModulesEnum.CREDIT_CARD,
  ModulesEnum.DOCUMENT,
  ModulesEnum.USERNAME,
  ModulesEnum.PASSWORD,
  ModulesEnum.PERSON,
  ModulesEnum.URL,
  ModulesEnum.E_MAIL,
  ModulesEnum.PHONE_NUMBER,
  ModulesEnum.TOTP,
  ModulesEnum.DIGITAL_CARD,
  ModulesEnum.NOTE,
  ModulesEnum.TASK,
  ModulesEnum.EXPIRY,
  ModulesEnum.ATTACHMENT,
  ModulesEnum.PIN,
  ModulesEnum.KEY,
  ModulesEnum.WIFI,
  ModulesEnum.RECOVERY_CODES,
  ModulesEnum.CUSTOM_FIELD,
];

function ModuleFilterModal(props: Props) {
  const { t } = useTranslation();
  const { height } = useWindowDimensions();
  const selected = React.useMemo(
    () => new Set(props.selectedModules),
    [props.selectedModules],
  );
  const modalMaxHeight = Math.max(280, Math.min(460, height - 112));
  const listMaxHeight = Math.max(180, modalMaxHeight - 98);

  return (
    <Modal visible={props.visible} onDismiss={props.onDismiss}>
      <ModalSurface
        width={340}
        maxHeight={modalMaxHeight}
        title={t("home:moduleFilterTitle")}
        description={t("home:moduleFilterText")}
        padded={false}
        separatedHeader
      >
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
      </ModalSurface>
    </Modal>
  );
}

export default ModuleFilterModal;

import ModulesEnum from "../../enums/ModulesEnum";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import Modal from "./Modal";
import { View } from "react-native";
import { MenuItem } from "../items/MenuItem";
import Divider from "../Divider";

type Props = {
  addModule: (module: ModulesEnum) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

function AddModuleModal(props: Props) {
  const hideModal = () => props.setVisible(false);
  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <View style={{ width: 280, minHeight: 354 }}>
        <MenuItem
          leadingIcon={ModuleIconsEnum.USERNAME}
          onPress={() => {
            props.addModule(ModulesEnum.USERNAME);
          }}
        >
          {"Username"}
        </MenuItem>
        <Divider />
        <MenuItem
          leadingIcon={ModuleIconsEnum.E_MAIL}
          onPress={() => {
            props.addModule(ModulesEnum.E_MAIL);
          }}
        >
          {"E-Mail"}
        </MenuItem>
        <Divider />
        <MenuItem
          leadingIcon={ModuleIconsEnum.PASSWORD}
          onPress={() => {
            props.addModule(ModulesEnum.PASSWORD);
          }}
        >
          {"Password"}
        </MenuItem>
        <Divider />
        <MenuItem
          leadingIcon={ModuleIconsEnum.URL}
          onPress={() => {
            props.addModule(ModulesEnum.URL);
          }}
        >
          {"URL"}
        </MenuItem>
        <Divider />
        <MenuItem
          leadingIcon={ModuleIconsEnum.WIFI}
          onPress={() => {
            props.addModule(ModulesEnum.WIFI);
          }}
        >
          {"Wifi"}
        </MenuItem>
        <Divider />
        <MenuItem
          leadingIcon={ModuleIconsEnum.KEY}
          onPress={() => {
            props.addModule(ModulesEnum.KEY);
          }}
        >
          {"Key"}
        </MenuItem>
        <Divider />
        <MenuItem
          leadingIcon={ModuleIconsEnum.CUSTOM_FIELD}
          onPress={() => {
            props.addModule(ModulesEnum.CUSTOM_FIELD);
          }}
        >
          {"Custom Field"}
        </MenuItem>
        <Divider />
        <MenuItem
          leadingIcon={ModuleIconsEnum.NOTE}
          onPress={() => {
            props.addModule(ModulesEnum.NOTE);
          }}
        >
          {"Note"}
        </MenuItem>
      </View>
    </Modal>
  );
}

export default AddModuleModal;

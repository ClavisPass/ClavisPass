import { useState } from "react";
import { StyleSheet } from "react-native";
import { Menu } from "react-native-paper";
import ModulesEnum from "../../enums/ModulesEnum";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import Modal from "react-native-modal";

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: "white",
    padding: 20,
  },
});

type Props = {
  addModule: (module: ModulesEnum) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

function AddModuleModal(props: Props) {
  const hideModal = () => props.setVisible(false);
  return (
    <Modal
      isVisible={props.visible}
      onBackdropPress={hideModal}
      style={styles.containerStyle}
    >
      <Menu.Item
        leadingIcon={ModuleIconsEnum.USERNAME}
        onPress={() => {
          props.addModule(ModulesEnum.USERNAME);
        }}
        title="Username"
      />
      <Menu.Item
        leadingIcon={ModuleIconsEnum.E_MAIL}
        onPress={() => {
          props.addModule(ModulesEnum.E_MAIL);
        }}
        title="E-Mail"
      />
      <Menu.Item
        leadingIcon={ModuleIconsEnum.PASSWORD}
        onPress={() => {
          props.addModule(ModulesEnum.PASSWORD);
        }}
        title="Password"
      />
      <Menu.Item
        leadingIcon={ModuleIconsEnum.URL}
        onPress={() => {
          props.addModule(ModulesEnum.URL);
        }}
        title="URL"
      />
      <Menu.Item
        leadingIcon={ModuleIconsEnum.WIFI}
        onPress={() => {
          props.addModule(ModulesEnum.WIFI);
        }}
        title="Wifi"
      />
      <Menu.Item
        leadingIcon={ModuleIconsEnum.KEY}
        onPress={() => {
          props.addModule(ModulesEnum.KEY);
        }}
        title="Key"
      />
      <Menu.Item
        leadingIcon={ModuleIconsEnum.CUSTOM_FIELD}
        onPress={() => {
          props.addModule(ModulesEnum.CUSTOM_FIELD);
        }}
        title="Custom Field"
      />
      <Menu.Item
        leadingIcon={ModuleIconsEnum.NOTE}
        onPress={() => {
          props.addModule(ModulesEnum.NOTE);
        }}
        title="Note"
      />
    </Modal>
  );
}

export default AddModuleModal;

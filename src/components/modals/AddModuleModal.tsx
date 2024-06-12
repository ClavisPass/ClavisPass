import { useState } from "react";
import { StyleSheet } from "react-native";
import { Menu, Modal } from "react-native-paper";
import ModulesEnum from "../../enums/ModulesEnum";

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
      visible={props.visible}
      onDismiss={hideModal}
      contentContainerStyle={styles.containerStyle}
    >
      <Menu.Item
        leadingIcon="account"
        onPress={() => {
          props.addModule(ModulesEnum.USERNAME);
        }}
        title="Username"
      />
      <Menu.Item
        leadingIcon="email"
        onPress={() => {
          props.addModule(ModulesEnum.E_MAIL);
        }}
        title="E-Mail"
      />
      <Menu.Item
        leadingIcon="form-textbox-password"
        onPress={() => {
          props.addModule(ModulesEnum.PASSWORD);
        }}
        title="Password"
      />
      <Menu.Item
        leadingIcon="web"
        onPress={() => {
          props.addModule(ModulesEnum.URL);
        }}
        title="URL"
      />
      <Menu.Item
        leadingIcon="wifi"
        onPress={() => {
          props.addModule(ModulesEnum.WIFI);
        }}
        title="Wifi"
      />
      <Menu.Item
        leadingIcon="key-variant"
        onPress={() => {
          props.addModule(ModulesEnum.KEY);
        }}
        title="Key"
      />
      <Menu.Item
        leadingIcon="pencil-box"
        onPress={() => {
          props.addModule(ModulesEnum.CUSTOM_FIELD);
        }}
        title="Custom Field"
      />
      <Menu.Item
        leadingIcon="note"
        onPress={() => {
          props.addModule(ModulesEnum.NOTE);
        }}
        title="Note"
      />
    </Modal>
  );
}

export default AddModuleModal;

import Modal from "./Modal";
import { View } from "react-native";
import ValueIconsEnum from "../../enums/ValueIconsEnum";
import TemplateEnum from "../../enums/TemplateEnum";
import getTemplate from "../../utils/getTemplate";
import { TextInput } from "react-native-paper";
import { MenuItem } from "../items/MenuItem";
import Divider from "../Divider";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  navigation: any;
};

function AddValueModal(props: Props) {
  const hideModal = () => props.setVisible(false);
  const navigateToAddValue = (template: TemplateEnum) => {
    props.navigation.navigate("Edit", {
      value: getTemplate(template),
    });
    props.setVisible(false);
  };
  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <View style={{ width: 280, height: 177 }}>
        <MenuItem
          leadingIcon={ValueIconsEnum.PASSWORD}
          onPress={() => {
            navigateToAddValue(TemplateEnum.PASSWORD);
          }}
        >
          {"Password"}
        </MenuItem>
        <Divider />
        <MenuItem
          leadingIcon={ValueIconsEnum.WIFI}
          onPress={() => {
            navigateToAddValue(TemplateEnum.WIFI);
          }}
        >
          {"Wifi"}
        </MenuItem>
        <Divider />
        <MenuItem
          leadingIcon={ValueIconsEnum.KEY}
          onPress={() => {
            navigateToAddValue(TemplateEnum.KEY);
          }}
        >
          {"Key"}
        </MenuItem>
        <Divider />
        <MenuItem
          leadingIcon={ValueIconsEnum.BLANK}
          onPress={() => {
            navigateToAddValue(TemplateEnum.BLANK);
          }}
        >
          {"Blank"}
        </MenuItem>
      </View>
    </Modal>
  );
}

export default AddValueModal;

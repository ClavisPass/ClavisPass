import Modal from "./Modal";
import { View } from "react-native";
import ValueIconsEnum from "../../enums/ValueIconsEnum";
import TemplateEnum from "../../enums/TemplateEnum";
import getTemplate from "../../utils/getTemplate";
import CategoryItem from "../items/CategoryItem";
import FolderType from "../../types/FolderType";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  navigation: any;
  favorite: boolean;
  folder: FolderType | null;
};

function AddValueModal(props: Props) {
  const hideModal = () => props.setVisible(false);
  const navigateToAddValue = (template: TemplateEnum) => {
    props.navigation.navigate("Edit", {
      value: getTemplate(template),
      favorite: props.favorite,
      folder: props.folder,
    });
    props.setVisible(false);
  };
  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <View
        style={{
          height: 224,
          width: 280,
          display: "flex",
          flexDirection: "column",
          padding: 8,
          gap: 8,
        }}
      >
        <View
          style={{ height: 64, display: "flex", flexDirection: "row", gap: 8 }}
        >
          <CategoryItem
            leadingIcon={ValueIconsEnum.PASSWORD}
            onPress={() => {
              navigateToAddValue(TemplateEnum.PASSWORD);
            }}
          >
            {"Password"}
          </CategoryItem>
          <CategoryItem
            leadingIcon={ValueIconsEnum.WIFI}
            onPress={() => {
              navigateToAddValue(TemplateEnum.WIFI);
            }}
          >
            {"Wifi"}
          </CategoryItem>
        </View>
        <View
          style={{ height: 64, display: "flex", flexDirection: "row", gap: 8 }}
        >
          <CategoryItem
            leadingIcon={ValueIconsEnum.KEY}
            onPress={() => {
              navigateToAddValue(TemplateEnum.KEY);
            }}
          >
            {"Key"}
          </CategoryItem>
          <CategoryItem
            leadingIcon={ValueIconsEnum.DIGITAL_CARD}
            onPress={() => {
              navigateToAddValue(TemplateEnum.DIGITAL_CARD);
            }}
          >
            {"Digital Card"}
          </CategoryItem>
        </View>
        <View
          style={{ height: 64, display: "flex", flexDirection: "row", gap: 8 }}
        >
          <CategoryItem
            leadingIcon={ValueIconsEnum.TASKLIST}
            onPress={() => {
              navigateToAddValue(TemplateEnum.TASKLIST);
            }}
          >
            {"Tasklist"}
          </CategoryItem>
          <CategoryItem
            leadingIcon={ValueIconsEnum.BLANK}
            onPress={() => {
              navigateToAddValue(TemplateEnum.BLANK);
            }}
          >
            {"Empty"}
          </CategoryItem>
        </View>
      </View>
    </Modal>
  );
}

export default AddValueModal;

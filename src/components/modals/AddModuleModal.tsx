import ModulesEnum from "../../enums/ModulesEnum";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import Modal from "./Modal";
import { Dimensions, ScrollView, View } from "react-native";
import CategoryItem from "../items/CategoryItem";

type Props = {
  addModule: (module: ModulesEnum) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

function AddModuleModal(props: Props) {
  const { height } = Dimensions.get("window");
  const hideModal = () => props.setVisible(false);
  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <ScrollView
        style={{
          width: 280,
          height: height > 700 ? 368 : 296,
          display: "flex",
          flexDirection: "column",
          padding: 8,
          paddingBottom: 0,
        }}
      >
        <View
          style={{
            height: 64,
            display: "flex",
            flexDirection: "row",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <CategoryItem
            leadingIcon={ModuleIconsEnum.USERNAME}
            onPress={() => {
              props.addModule(ModulesEnum.USERNAME);
            }}
          >
            {"Username"}
          </CategoryItem>
          <CategoryItem
            leadingIcon={ModuleIconsEnum.E_MAIL}
            onPress={() => {
              props.addModule(ModulesEnum.E_MAIL);
            }}
          >
            {"E-Mail"}
          </CategoryItem>
        </View>
        <View
          style={{
            height: 64,
            display: "flex",
            flexDirection: "row",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <CategoryItem
            leadingIcon={ModuleIconsEnum.PASSWORD}
            onPress={() => {
              props.addModule(ModulesEnum.PASSWORD);
            }}
          >
            {"Password"}
          </CategoryItem>
          <CategoryItem
            leadingIcon={ModuleIconsEnum.WIFI}
            onPress={() => {
              props.addModule(ModulesEnum.WIFI);
            }}
          >
            {"Wifi"}
          </CategoryItem>
        </View>
        <View
          style={{
            height: 64,
            display: "flex",
            flexDirection: "row",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <CategoryItem
            leadingIcon={ModuleIconsEnum.URL}
            onPress={() => {
              props.addModule(ModulesEnum.URL);
            }}
          >
            {"URL"}
          </CategoryItem>
          <CategoryItem
            leadingIcon={ModuleIconsEnum.DIGITAL_CARD}
            onPress={() => {
              props.addModule(ModulesEnum.DIGITAL_CARD);
            }}
          >
            {"Digital Card"}
          </CategoryItem>
        </View>
        <View
          style={{
            height: 64,
            display: "flex",
            flexDirection: "row",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <CategoryItem
            leadingIcon={ModuleIconsEnum.KEY}
            onPress={() => {
              props.addModule(ModulesEnum.KEY);
            }}
          >
            {"Key"}
          </CategoryItem>
          <CategoryItem
            leadingIcon={ModuleIconsEnum.CUSTOM_FIELD}
            onPress={() => {
              props.addModule(ModulesEnum.CUSTOM_FIELD);
            }}
          >
            {"Custom Field"}
          </CategoryItem>
        </View>
        <View
          style={{
            height: 64,
            display: "flex",
            flexDirection: "row",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <CategoryItem
            leadingIcon={ModuleIconsEnum.PHONE_NUMBER}
            onPress={() => {
              props.addModule(ModulesEnum.PHONE_NUMBER);
            }}
          >
            {"Phone Number"}
          </CategoryItem>
          <CategoryItem
            leadingIcon={ModuleIconsEnum.TASK}
            onPress={() => {
              props.addModule(ModulesEnum.TASK);
            }}
          >
            {"Task"}
          </CategoryItem>
        </View>
        <View
          style={{
            height: 64,
            display: "flex",
            flexDirection: "row",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <CategoryItem
            leadingIcon={ModuleIconsEnum.TOTP}
            onPress={() => {
              props.addModule(ModulesEnum.TOTP);
            }}
          >
            {"Two-Factor Auth"}
          </CategoryItem>
          <CategoryItem
            leadingIcon={ModuleIconsEnum.NOTE}
            onPress={() => {
              props.addModule(ModulesEnum.NOTE);
            }}
          >
            {"Note"}
          </CategoryItem>
        </View>
      </ScrollView>
    </Modal>
  );
}

export default AddModuleModal;

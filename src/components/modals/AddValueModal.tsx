import Modal from "./Modal";
import { View, StyleSheet } from "react-native";
import ValueIconsEnum from "../../enums/ValueIconsEnum";
import TemplateEnum from "../../enums/TemplateEnum";
import getTemplate from "../../utils/getTemplate";
import CategoryItem from "../items/CategoryItem";
import FolderType from "../../types/FolderType";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeProvider";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  navigation: any;
  favorite: boolean;
  folder: FolderType | null;
};

function AddValueModal(props: Props) {
  const { t } = useTranslation();
  const { theme } = useTheme();
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
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.outlineVariant,
          borderRadius: 12,
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
            {t("moduleTemplates:password")}
          </CategoryItem>
          <CategoryItem
            leadingIcon={ValueIconsEnum.WIFI}
            onPress={() => {
              navigateToAddValue(TemplateEnum.WIFI);
            }}
          >
            {t("moduleTemplates:wifi")}
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
            {t("moduleTemplates:key")}
          </CategoryItem>
          <CategoryItem
            leadingIcon={ValueIconsEnum.DIGITAL_CARD}
            onPress={() => {
              navigateToAddValue(TemplateEnum.DIGITAL_CARD);
            }}
          >
            {t("moduleTemplates:digitalCard")}
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
            {t("moduleTemplates:tasklist")}
          </CategoryItem>
          <CategoryItem
            leadingIcon={ValueIconsEnum.BLANK}
            onPress={() => {
              navigateToAddValue(TemplateEnum.BLANK);
            }}
          >
            {t("moduleTemplates:empty")}
          </CategoryItem>
        </View>
      </View>
    </Modal>
  );
}

export default AddValueModal;

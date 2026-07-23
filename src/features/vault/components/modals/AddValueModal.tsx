import Modal from "../../../../shared/components/modals/Modal";
import { ScrollView, View, StyleSheet, useWindowDimensions } from "react-native";
import ValueIconsEnum from "../../model/ValueIconsEnum";
import TemplateEnum from "../../model/TemplateEnum";
import getTemplate from "../../utils/getTemplate";
import CategoryItem from "../items/CategoryItem";
import FolderType from "../../model/FolderType";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../../../app/navigation/model/types";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  navigation: NativeStackNavigationProp<HomeStackParamList, "Home", undefined>;
  favorite: boolean;
  folder: FolderType | null;
  searchstring: string | null;
};

function AddValueModal(props: Props) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { height } = useWindowDimensions();
  const modalMaxHeight = Math.max(220, Math.min(440, height * 0.8));
  const hideModal = () => props.setVisible(false);
  const navigateToAddValue = (template: TemplateEnum) => {
    props.navigation.navigate("Edit", {
      value: getTemplate(template),
      favorite: props.favorite,
      folder: props.folder,
      searchstring: props.searchstring,
    });
    props.setVisible(false);
  };
  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <View
        style={{
          maxHeight: modalMaxHeight,
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
        <ScrollView
          style={{ maxHeight: modalMaxHeight - 16 }}
          contentContainerStyle={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{ height: 64, display: "flex", flexDirection: "row", gap: 8 }}
          >
            <CategoryItem
              leadingIcon={ValueIconsEnum.BLANK}
              onPress={() => {
                navigateToAddValue(TemplateEnum.BLANK);
              }}
            >
              {t("moduleTemplates:empty")}
            </CategoryItem>
            <CategoryItem
              leadingIcon={ValueIconsEnum.PASSWORD}
              onPress={() => {
                navigateToAddValue(TemplateEnum.PASSWORD);
              }}
            >
              {t("moduleTemplates:password")}
            </CategoryItem>
          </View>
          <View
            style={{ height: 64, display: "flex", flexDirection: "row", gap: 8 }}
          >
            <CategoryItem
              leadingIcon={ValueIconsEnum.WIFI}
              onPress={() => {
                navigateToAddValue(TemplateEnum.WIFI);
              }}
            >
              {t("moduleTemplates:wifi")}
            </CategoryItem>
            <CategoryItem
              leadingIcon={ValueIconsEnum.KEY}
              onPress={() => {
                navigateToAddValue(TemplateEnum.KEY);
              }}
            >
              {t("moduleTemplates:key")}
            </CategoryItem>
          </View>
          <View
            style={{ height: 64, display: "flex", flexDirection: "row", gap: 8 }}
          >
            <CategoryItem
              leadingIcon={ValueIconsEnum.IDENTITY}
              onPress={() => {
                navigateToAddValue(TemplateEnum.IDENTITY);
              }}
            >
              {t("moduleTemplates:identity")}
            </CategoryItem>
            <CategoryItem
              leadingIcon={ValueIconsEnum.DOCUMENT}
              onPress={() => {
                navigateToAddValue(TemplateEnum.DOCUMENT);
              }}
            >
              {t("moduleTemplates:document")}
            </CategoryItem>
          </View>
          <View
            style={{ height: 64, display: "flex", flexDirection: "row", gap: 8 }}
          >
            <CategoryItem
              leadingIcon={ValueIconsEnum.CREDIT_CARD}
              onPress={() => {
                navigateToAddValue(TemplateEnum.CREDIT_CARD);
              }}
            >
              {t("moduleTemplates:creditCard")}
            </CategoryItem>
            <CategoryItem
              leadingIcon={ValueIconsEnum.BANK_ACCOUNT}
              onPress={() => {
                navigateToAddValue(TemplateEnum.BANK_ACCOUNT);
              }}
            >
              {t("moduleTemplates:bankAccount")}
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
              leadingIcon={ValueIconsEnum.NOTE}
              onPress={() => {
                navigateToAddValue(TemplateEnum.NOTE);
              }}
            >
              {t("moduleTemplates:note")}
            </CategoryItem>
          </View>
          <View
            style={{ height: 64, display: "flex", flexDirection: "row", gap: 8 }}
          >
            <CategoryItem
              leadingIcon={ValueIconsEnum.TWO_FACTOR}
              onPress={() => {
                navigateToAddValue(TemplateEnum.TWO_FACTOR);
              }}
            >
              {t("moduleTemplates:twoFactor")}
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
        </ScrollView>
      </View>
    </Modal>
  );
}

export default AddValueModal;

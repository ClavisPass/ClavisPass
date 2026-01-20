import React from "react";

import { Divider } from "react-native-paper";

import ShowQRCodeButton from "../../settings/components/buttons/ShowQRCodeButton";
import UserInformation from "../../sync/components/UserInformation";
import UserInfoType from "../../sync/model/UserInfoType";
import SettingsItem from "../../settings/components/SettingsItem";
import SettingsDivider from "../../settings/components/SettingsDivider";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "../../../app/navigation/model/types";

type Props = {
  navigation: NativeStackNavigationProp<SettingsStackParamList, "Settings", undefined>;
  setUserInfo?: (userInfo: UserInfoType) => void;
};

function Auth(props: Props) {
  const { t } = useTranslation();
  return (
    <View>
      <UserInformation setUserInfo={props.setUserInfo} />
      <Divider />
      <SettingsItem
        leadingIcon={"qrcode-scan"}
        onPress={() => props.navigation.navigate("Scan")}
      >
        {t("settings:scanqrcode")}
      </SettingsItem>
      <SettingsDivider />
      <ShowQRCodeButton />
    </View>
  );
}

export default Auth;

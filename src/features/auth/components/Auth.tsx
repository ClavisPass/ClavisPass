import React, { useState } from "react";

import { Divider } from "react-native-paper";

import { Button } from "react-native-paper";

import ShowQRCodeButton from "../../settings/components/buttons/ShowQRCodeButton";
import UserInformation from "../../sync/components/UserInformation";
import UserInfoType from "../../sync/model/UserInfoType";
import SettingsItem from "../../settings/components/SettingsItem";
import SettingsDivider from "../../settings/components/SettingsDivider";
import { View } from "react-native";

type Props = {
  navigation: any;
  setUserInfo?: (userInfo: UserInfoType) => void;
};

function Auth(props: Props) {
  return (
    <View>
      <UserInformation setUserInfo={props.setUserInfo} />
      <Divider />
      <SettingsItem
        leadingIcon={"qrcode-scan"}
        onPress={() => props.navigation.navigate("Scan")}
      >
        Scan QR-Code
      </SettingsItem>
      <SettingsDivider />
      <ShowQRCodeButton />
    </View>
  );
}

export default Auth;

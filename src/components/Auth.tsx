import React, { useState } from "react";

import { Divider } from "react-native-paper";

import { Button } from "react-native-paper";

import ShowQRCodeButton from "./buttons/ShowQRCodeButton";
import UserInformation from "./UserInformation";
import UserInfoType from "../types/UserInfoType";
import SettingsItem from "./items/SettingsItem";
import SettingsDivider from "./SettingsDivider";

type Props = {
  navigation: any;
  changeEditTokenVisibility?: (value: boolean) => void;
  setUserInfo?: (userInfo: UserInfoType) => void;
};

function Auth(props: Props) {
  return (
    <>
      <UserInformation
        setUserInfo={props.setUserInfo}
        changeEditTokenVisibility={props.changeEditTokenVisibility}
      />
      <Divider />
      <SettingsItem
        leadingIcon={"qrcode-scan"}
        onPress={() => props.navigation.navigate("Scan")}
      >
        Scan QR-Code
      </SettingsItem>
      <SettingsDivider />
      <ShowQRCodeButton />
      
    </>
  );
}

export default Auth;

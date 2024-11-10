import React, { useState } from "react";

import { Divider } from "react-native-paper";

import { Button } from "react-native-paper";

import ShowQRCodeButton from "./buttons/ShowQRCodeButton";
import UserInformation from "./UserInformation";
import EditTokenModal from "./modals/EditTokenModal";
import UserInfoType from "../types/UserInfoType";

type Props = {
  navigation: any;
  changeEditTokenVisibility?: (value: boolean) => void;
  setUserInfo?: (userInfo: UserInfoType) => void;
};

function Auth(props: Props) {
  return (
    <>
      <UserInformation setUserInfo={props.setUserInfo} changeEditTokenVisibility={props.changeEditTokenVisibility} />
      <Divider />
      <Button
        icon={"qrcode-scan"}
        mode="contained-tonal"
        onPress={() => props.navigation.navigate("Scan")}
      >
        Scan QR-Code
      </Button>
      <ShowQRCodeButton />
    </>
  );
}

export default Auth;

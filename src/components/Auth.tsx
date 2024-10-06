import React, { useState } from "react";

import { Divider } from "react-native-paper";

import { Button } from "react-native-paper";

import ShowQRCodeButton from "./buttons/ShowQRCodeButton";
import UserInformation from "./UserInformation";
import EditTokenModal from "./modals/EditTokenModal";

type Props = {
  navigation: any;
  changeEditTokenVisibility?: (value: boolean) => void;
};

function Auth(props: Props) {
  return (
    <>
      <UserInformation changeEditTokenVisibility={props.changeEditTokenVisibility} />
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

import React from "react";

import { Divider } from "react-native-paper";

import { Button } from "react-native-paper";

import ShowQRCodeButton from "./buttons/ShowQRCodeButton";
import GoogleDriveUser from "./GoogleDriveUser";

type Props = {
  navigation: any
}

function GoogleDrive(props: Props) {
  return (
    <>
      <GoogleDriveUser />
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

export default GoogleDrive;

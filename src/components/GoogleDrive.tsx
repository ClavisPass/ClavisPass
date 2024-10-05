import React from "react";

import { Chip, Divider } from "react-native-paper";

import { Button } from "react-native-paper";

import ShowQRCodeButton from "./buttons/ShowQRCodeButton";
import UserInformation from "./UserInformation";
import { useToken } from "../contexts/TokenProvider";

type Props = {
  navigation: any
}

function GoogleDrive(props: Props) {
  const {tokenType} = useToken()
  return (
    <>
      <UserInformation />
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

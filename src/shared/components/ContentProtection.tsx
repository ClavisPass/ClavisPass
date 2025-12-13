import React, { useEffect } from "react";
import * as ScreenCapture from "expo-screen-capture";
import WebSpecific from "../../infrastructure/platform/WebSpecific";
import { Platform } from "react-native";

function PreventScreenCapture() {
  const _activate = async () => {
    await ScreenCapture.preventScreenCaptureAsync();
  };

  useEffect(() => {
    if (Platform.OS !== "web") _activate();
  }, []);
  return <></>;
}

function AllowScreenCapture() {
  const _deactivate = async () => {
    await ScreenCapture.allowScreenCaptureAsync();
  };

  useEffect(() => {
    if (Platform.OS !== "web") _deactivate();
  }, []);
  return <></>;
}

type Props = {
  enabled: boolean;
};

function ContentProtection(props: Props) {
  return (
    <WebSpecific notIn={true}>
      {props.enabled ? PreventScreenCapture() : AllowScreenCapture()}
    </WebSpecific>
  );
}

export default ContentProtection;

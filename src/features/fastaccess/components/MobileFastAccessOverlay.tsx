import React from "react";
import { Platform, View } from "react-native";
import { Icon, IconButton, Text, TextInput } from "react-native-paper";
import Modal from "../../../shared/components/modals/Modal";
import PasswordTextbox from "../../../shared/components/PasswordTextbox";
import CopyToClipboard from "../../../shared/components/buttons/CopyToClipboard";
import { useTheme } from "../../../app/providers/ThemeProvider";
import FastAccessPayload from "../model/FastAccessPayload";
import {
  hideMobileFastAccess,
  subscribeMobileFastAccess,
} from "../utils/mobileFastAccessStore";
import { hideFastAccess } from "../utils/FastAccess";

function MobileFastAccessOverlay() {
  const { theme, globalStyles } = useTheme();
  const [payload, setPayload] = React.useState<FastAccessPayload | null>(null);

  React.useEffect(() => {
    if (Platform.OS === "web") {
      return;
    }

    return subscribeMobileFastAccess(setPayload);
  }, []);

  if (Platform.OS === "web") {
    return null;
  }

  const visible = payload !== null;

  const close = () => {
    hideMobileFastAccess();
    hideFastAccess().catch(() => {});
  };

  return (
    <Modal visible={visible} onDismiss={close}>
      <View
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 16,
          gap: 12,
          backgroundColor: theme.colors.background,
          borderRadius: 16,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              flex: 1,
              paddingRight: 8,
            }}
          >
            <Icon
              color={theme.colors.primary}
              size={20}
              source={"tooltip-account"}
            />
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.primary, flexShrink: 1 }}
            >
              {payload?.title ?? ""}
            </Text>
          </View>
          <IconButton
            icon="close"
            size={20}
            iconColor={theme.colors.primary}
            onPress={close}
            style={{ margin: 0 }}
          />
        </View>

        <View style={globalStyles.moduleView}>
          <View style={{ height: 40, flexGrow: 1 }}>
            <TextInput
              outlineStyle={globalStyles.outlineStyle}
              style={globalStyles.textInputStyle}
              value={payload?.username ?? ""}
              mode="outlined"
            />
          </View>
          <CopyToClipboard value={payload?.username ?? ""} disabled={!payload?.username} />
        </View>

        <View style={globalStyles.moduleView}>
          <PasswordTextbox value={payload?.password ?? ""} placeholder="" />
          <CopyToClipboard value={payload?.password ?? ""} disabled={!payload?.password} />
        </View>
      </View>
    </Modal>
  );
}

export default MobileFastAccessOverlay;

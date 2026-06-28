import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useTheme } from "../../../app/providers/ThemeProvider";
import Modal from "../../../shared/components/modals/Modal";
import TooltipIconButton from "../../../shared/components/buttons/TooltipIconButton";

export type SettingInfo = {
  title: string;
  body: string;
  bullets?: string[];
};

type Props = SettingInfo & {
  compact?: boolean;
};

const styles = StyleSheet.create({
  modal: {
    width: 330,
    maxWidth: "100%",
    padding: 16,
  },
  body: {
    marginTop: 8,
  },
  bulletList: {
    marginTop: 12,
    gap: 6,
  },
  bulletRow: {
    flexDirection: "row",
    gap: 8,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 18,
  },
  button: {
    borderRadius: 12,
  },
  compactButton: {
    width: 24,
    height: 24,
    marginLeft: -4,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
  },
});

function SettingInfoButton({ title, body, bullets, compact }: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [visible, setVisible] = React.useState(false);
  const openInfo = (event?: any) => {
    event?.stopPropagation?.();
    setVisible(true);
  };

  return (
    <>
      <TooltipIconButton
        tooltip={t("common:moreInfo")}
        icon="information-outline"
        size={compact ? 15 : 20}
        iconColor={theme.colors.primary}
        onPress={openInfo}
        style={compact ? styles.compactButton : { margin: 0 }}
      />
      <Modal visible={visible} onDismiss={() => setVisible(false)}>
        <View style={styles.modal}>
          <Text variant="titleLarge">{title}</Text>
          <Text
            variant="bodyMedium"
            style={[styles.body, { color: theme.colors.onSurfaceVariant }]}
          >
            {body}
          </Text>
          {bullets?.length ? (
            <View style={styles.bulletList}>
              {bullets.map((bullet) => (
                <View key={bullet} style={styles.bulletRow}>
                  <View
                    style={[
                      styles.bulletDot,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  />
                  <Text
                    variant="bodyMedium"
                    style={{ flex: 1, color: theme.colors.onSurfaceVariant }}
                  >
                    {bullet}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
          <View style={styles.actions}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => setVisible(false)}
            >
              {t("common:done")}
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
}

export default SettingInfoButton;

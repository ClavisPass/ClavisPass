import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import Modal from "../../../../shared/components/modals/Modal";
import ExpiryOverviewItem, {
  type ExpiryOverviewEntry,
} from "../items/ExpiryOverviewItem";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  items: ExpiryOverviewEntry[];
};

const styles = StyleSheet.create({
  container: {
    width: 360,
    maxWidth: "100%",
    maxHeight: 480,
    padding: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  listWrap: {
    width: "100%",
    height: 320,
  },
  empty: {
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function ExpiryOverviewModal(props: Props) {
  const { t } = useTranslation();
  const isWeb = Platform.OS === "web";

  return (
    <Modal visible={props.visible} onDismiss={() => props.setVisible(false)}>
      <View
        style={[
          styles.container,
          isWeb ? { maxHeight: 420 } : null,
        ]}
      >
        <View style={styles.header}>
          <Text variant="titleLarge">{t("home:expiries")}</Text>
        </View>

        {props.items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={{ opacity: 0.72 }}>{t("home:noExpiries")}</Text>
          </View>
        ) : (
          <View style={[styles.listWrap, isWeb ? { height: 260 } : null]}>
            <FlashList
              data={props.items}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => {
                const { key, ...rest } = item;
                return <ExpiryOverviewItem key={key} {...rest} />;
              }}
              estimatedItemSize={84}
              contentContainerStyle={styles.listContent}
            />
          </View>
        )}
      </View>
    </Modal>
  );
}

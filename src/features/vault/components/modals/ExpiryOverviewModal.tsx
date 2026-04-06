import React from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

import AdaptiveMenu from "../../../../shared/components/menus/AdaptiveMenu";
import { MenuItem } from "../../../../shared/components/menus/MenuItem";
import ExpiryOverviewItem, {
  type ExpiryOverviewEntry,
} from "../items/ExpiryOverviewItem";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  items: ExpiryOverviewEntry[];
  positionY: number;
  nativeSnapPoints?: (string | number)[];
};

const styles = StyleSheet.create({
  listWrap: {
    width: 360,
    maxWidth: "100%",
  },
  scrollContent: {
    padding: 4,
    paddingTop: 6,
    paddingBottom: 6,
  },
  empty: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function ExpiryOverviewModal(props: Props) {
  const { t } = useTranslation();
  const isWeb = Platform.OS === "web";

  const topContent = (
    <MenuItem>{`${props.items.length} ${t("home:entries")}`}</MenuItem>
  );

  const customContent =
    props.items.length === 0 ? (
      <View style={styles.empty}>
        <Text style={{ opacity: 0.72 }}>{t("home:noExpiries")}</Text>
      </View>
    ) : (
      <View style={styles.listWrap}>
        <ScrollView
          style={isWeb ? { maxHeight: 260 } : { maxHeight: 340 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={Platform.OS !== "web"}
        >
          {props.items.map((item) => {
            const { key, ...rest } = item;
            return <ExpiryOverviewItem key={key} {...rest} />;
          })}
        </ScrollView>
      </View>
    );

  return (
    <AdaptiveMenu
      visible={props.visible}
      setVisible={props.setVisible}
      positionY={props.positionY}
      nativeSnapPoints={props.nativeSnapPoints}
      topContent={topContent}
      customContent={customContent}
      items={[]}
    />
  );
}

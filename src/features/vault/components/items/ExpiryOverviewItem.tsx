import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import AnimatedPressable from "../../../../shared/components/AnimatedPressable";
import { useTheme } from "../../../../app/providers/ThemeProvider";

export type ExpiryOverviewEntry = {
  key: string;
  title: string;
  absoluteLabel: string;
  relativeLabel: string;
  statusLabel: string;
  status: "active" | "dueSoon" | "expired";
  onPress: () => void;
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  ripple: {
    paddingHorizontal: 8,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  left: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  statusChip: {
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
    flexShrink: 0,
  },
});

export default function ExpiryOverviewItem(props: ExpiryOverviewEntry) {
  const { theme, darkmode } = useTheme();

  const statusColor =
    props.status === "expired"
      ? theme.colors.error
      : props.status === "dueSoon"
        ? "#D9A400"
        : theme.colors.primary;
  const emphasisStatusChip = darkmode && props.status === "expired";
  const statusChipBackground = emphasisStatusChip
    ? statusColor
    : darkmode
      ? `${statusColor}22`
      : `${statusColor}18`;
  const statusChipTextColor = emphasisStatusChip ? "#ffffff" : statusColor;
  const statusIconColor = emphasisStatusChip ? "#ffffff" : statusColor;

  return (
    <View style={styles.container}>
      <AnimatedPressable style={styles.ripple} onPress={props.onPress}>
        <View style={styles.ripple}>
          <View
            style={[
              styles.left,
              {
                backgroundColor: statusChipBackground,
              },
            ]}
          >
            <Icon source="calendar-clock" size={16} color={statusIconColor} />
          </View>

          <View style={styles.content}>
            <View style={styles.row}>
              <Text
                numberOfLines={1}
                style={{
                  fontWeight: "700",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {props.title}
              </Text>
              <View
                style={[
                  styles.statusChip,
                  {
                    backgroundColor: statusChipBackground,
                  },
                ]}
              >
                <Text
                  style={{
                    color: statusChipTextColor,
                    fontWeight: "700",
                  }}
                >
                  {props.statusLabel}
                </Text>
              </View>
            </View>

            <Text style={{ color: theme.colors.primary, marginTop: 2 }}>
              {props.absoluteLabel}
            </Text>
            <Text
              numberOfLines={1}
              style={{ opacity: 0.72, marginTop: 1, color: theme.colors.onSurface }}
            >
              {props.relativeLabel}
            </Text>
          </View>
        </View>
      </AnimatedPressable>
    </View>
  );
}

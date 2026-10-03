import React from "react";
import { StyleSheet, View } from "react-native";

import { useTheme } from "../../../app/providers/ThemeProvider";
import AppIcon from "../../../shared/components/icons/AppIcon";

type IdentityEmailLogoProps = {
  email: string;
  size?: number;
};

export default function IdentityEmailLogo({
  email: _email,
  size = 40,
}: IdentityEmailLogoProps) {
  const { theme } = useTheme();
  const logoStyle = {
    width: size,
    height: size,
    borderRadius: Math.round(size * 0.32),
  };

  return (
    <View
      style={[
        styles.fallback,
        logoStyle,
        { backgroundColor: `${theme.colors.primary}18` },
      ]}
    >
      <AppIcon
        name="account-outline"
        size={Math.max(18, Math.round(size * 0.6))}
        color={theme.colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    justifyContent: "center",
  },
});

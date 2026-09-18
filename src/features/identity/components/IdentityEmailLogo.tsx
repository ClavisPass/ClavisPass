import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Image } from "expo-image";

import { useTheme } from "../../../app/providers/ThemeProvider";
import AppIcon from "../../../shared/components/icons/AppIcon";
import {
  buildFaviconUrl,
  normalizeUrl,
} from "../../vault/utils/digitalCardTheme";

const failedFaviconUrls = new Set<string>();
const nonSelectableImageStyle =
  Platform.OS === "web"
    ? ({
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitUserDrag: "none",
      } as any)
    : null;

function getEmailFaviconDomain(email: string) {
  const domain = email.split("@")[1]?.trim().toLowerCase() ?? "";
  const parts = domain.split(".").filter(Boolean);
  if (parts.length <= 2) return domain;
  return parts.slice(-2).join(".");
}

type IdentityEmailLogoProps = {
  email: string;
  size?: number;
};

export default function IdentityEmailLogo({
  email,
  size = 40,
}: IdentityEmailLogoProps) {
  const { theme } = useTheme();
  const domain = getEmailFaviconDomain(email);
  const faviconUrl = buildFaviconUrl(normalizeUrl(domain)) ?? "";
  const [faviconFailed, setFaviconFailed] = useState(
    faviconUrl !== "" && failedFaviconUrls.has(faviconUrl),
  );

  useEffect(() => {
    setFaviconFailed(faviconUrl !== "" && failedFaviconUrls.has(faviconUrl));
  }, [faviconUrl]);

  const logoStyle = {
    width: size,
    height: size,
    borderRadius: 8,
  };

  if (faviconUrl && !faviconFailed) {
    return (
      <Image
        style={[logoStyle, nonSelectableImageStyle]}
        source={faviconUrl}
        contentFit="cover"
        transition={220}
        onError={() => {
          failedFaviconUrls.add(faviconUrl);
          setFaviconFailed(true);
        }}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        logoStyle,
        { backgroundColor: `${theme.colors.primary}18` },
      ]}
    >
      <AppIcon
        name="email-outline"
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

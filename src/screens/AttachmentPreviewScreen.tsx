import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Text } from "react-native-paper";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { HomeStackParamList } from "../app/navigation/model/types";
import { useTheme } from "../app/providers/ThemeProvider";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import Header from "../shared/components/Header";
import { getAttachmentPreview } from "../features/vault/utils/attachmentPreviewStore";

type AttachmentPreviewScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "AttachmentPreview"
>;

function getExtension(name: string): string {
  const match = /\.([a-z0-9]+)$/i.exec(name);
  return match?.[1]?.toLowerCase() ?? "";
}

function getDataUri(file: { name: string; mimeType?: string; dataBase64: string }) {
  const extension = getExtension(file.name);
  const mimeType =
    file.mimeType ||
    (extension === "pdf"
      ? "application/pdf"
      : ["jpg", "jpeg"].includes(extension)
      ? "image/jpeg"
      : extension === "png"
      ? "image/png"
      : extension === "gif"
      ? "image/gif"
      : extension === "webp"
      ? "image/webp"
      : "text/plain");

  return `data:${mimeType};base64,${file.dataBase64}`;
}

function AttachmentPreviewScreen({
  route,
  navigation,
}: AttachmentPreviewScreenProps) {
  const { globalStyles, theme } = useTheme();
  const { t } = useTranslation();
  const file = getAttachmentPreview(route.params.previewId);

  const dataUri = useMemo(() => (file ? getDataUri(file) : ""), [file]);
  const extension = file ? getExtension(file.name) : "";
  const isPdf = file?.mimeType === "application/pdf" || extension === "pdf";
  const isImage =
    file?.mimeType?.startsWith("image/") ||
    ["avif", "gif", "jpeg", "jpg", "png", "svg", "webp"].includes(extension);

  return (
    <AnimatedContainer style={globalStyles.container}>
      <Header title={file?.name ?? ""} onPress={() => navigation.goBack()} />
      <View
        style={[
          styles.previewSurface,
          { backgroundColor: theme.colors.elevation.level1 },
        ]}
      >
        {!file ? (
          <Text style={{ color: theme.colors.onSurfaceVariant }}>
            {t("modules:attachmentPreviewMissing")}
          </Text>
        ) : isPdf ? (
          React.createElement("iframe" as any, {
            src: dataUri,
            title: file.name,
            style: iframeStyle,
          })
        ) : isImage ? (
          <Image source={dataUri} style={styles.image} contentFit="contain" />
        ) : (
          <Text style={{ color: theme.colors.onSurfaceVariant }}>
            {t("modules:attachmentPreviewUnavailable")}
          </Text>
        )}
      </View>
    </AnimatedContainer>
  );
}

const styles = StyleSheet.create({
  previewSurface: {
    flex: 1,
    width: "100%",
    padding: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

const iframeStyle = {
  width: "100%",
  height: "100%",
  border: "none",
  borderRadius: 12,
};

export default AttachmentPreviewScreen;

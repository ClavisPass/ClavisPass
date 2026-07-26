import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import * as FileSystem from "expo-file-system/legacy";
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

type PdfComponentType = React.ComponentType<{
  source: { uri: string };
  style: any;
  trustAllCerts?: boolean;
  onError?: () => void;
}>;

function getExtension(name: string): string {
  const match = /\.([a-z0-9]+)$/i.exec(name);
  return match?.[1]?.toLowerCase() ?? "";
}

function getSafeFileName(name: string): string {
  return name.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_") || "attachment";
}

function getImageDataUri(file: {
  name: string;
  mimeType?: string;
  dataBase64: string;
}) {
  const extension = getExtension(file.name);
  const mimeType =
    file.mimeType ||
    (["jpg", "jpeg"].includes(extension)
      ? "image/jpeg"
      : extension === "png"
      ? "image/png"
      : extension === "gif"
      ? "image/gif"
      : extension === "webp"
      ? "image/webp"
      : "image/*");

  return `data:${mimeType};base64,${file.dataBase64}`;
}

function AttachmentPreviewScreen({
  route,
  navigation,
}: AttachmentPreviewScreenProps) {
  const { globalStyles, theme } = useTheme();
  const { t } = useTranslation();
  const file = getAttachmentPreview(route.params.previewId);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [PdfComponent, setPdfComponent] = useState<PdfComponentType | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const extension = file ? getExtension(file.name) : "";
  const isPdf = file?.mimeType === "application/pdf" || extension === "pdf";
  const isImage =
    file?.mimeType?.startsWith("image/") ||
    ["avif", "gif", "heic", "jpeg", "jpg", "png", "webp"].includes(extension);
  const imageUri = useMemo(() => (file ? getImageDataUri(file) : ""), [file]);

  useEffect(() => {
    let cancelled = false;

    if (!file || !isPdf) {
      setPdfUri(null);
      setPdfComponent(null);
      return;
    }

    const writePdf = async () => {
      try {
        const pdfModule = require("react-native-pdf");
        const NextPdfComponent = (pdfModule.default ??
          pdfModule) as PdfComponentType;
        const path = `${FileSystem.cacheDirectory}clavispass-preview-${file.id}-${getSafeFileName(file.name)}`;
        await FileSystem.writeAsStringAsync(path, file.dataBase64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        if (!cancelled) {
          setPdfComponent(() => NextPdfComponent);
          setPdfUri(path);
        }
      } catch {
        if (!cancelled) setError(t("modules:attachmentPreviewFailed"));
      }
    };

    void writePdf();

    return () => {
      cancelled = true;
    };
  }, [file, isPdf, t]);

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
        ) : error ? (
          <Text style={{ color: theme.colors.error }}>{error}</Text>
        ) : isPdf && pdfUri && PdfComponent ? (
          <PdfComponent
            source={{ uri: pdfUri }}
            style={styles.pdf}
            trustAllCerts={false}
            onError={() => setError(t("modules:attachmentPreviewFailed"))}
          />
        ) : isPdf ? (
          <Text style={{ color: theme.colors.onSurfaceVariant }}>
            {t("modules:attachmentPreviewLoadingPdf")}
          </Text>
        ) : isImage ? (
          <Image source={imageUri} style={styles.image} contentFit="contain" />
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
  pdf: {
    flex: 1,
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default AttachmentPreviewScreen;

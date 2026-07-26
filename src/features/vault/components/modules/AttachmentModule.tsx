import React, { useEffect, useMemo, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { fromByteArray, toByteArray } from "base64-js";
import { Button, Icon, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { HomeStackParamList } from "../../../../app/navigation/model/types";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import TooltipIconButton from "../../../../shared/components/buttons/TooltipIconButton";
import AnimatedPressable from "../../../../shared/components/AnimatedPressable";
import createUniqueID from "../../../../shared/utils/createUniqueID";
import ModulesEnum from "../../model/ModulesEnum";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";
import Props from "../../model/ModuleProps";
import AttachmentModuleType, {
  AttachmentFile,
} from "../../model/modules/AttachmentModuleType";
import ModuleContainer from "../ModuleContainer";
import { setAttachmentPreview } from "../../utils/attachmentPreviewStore";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_ENTRY_ATTACHMENT_SIZE = 25 * 1024 * 1024;
const MAX_FILES = 10;

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 102.4) / 10} KB`;
  return `${Math.round(size / 1024 / 102.4) / 10} MB`;
}

function getFileNameFromPath(path: string): string {
  return path.split(/[\\/]/).filter(Boolean).pop() ?? "attachment";
}

async function pickDesktopAttachment(): Promise<AttachmentFile | null> {
  const tauriDialog = require("@tauri-apps/plugin-dialog");
  const selected = await tauriDialog.open({
    multiple: false,
    directory: false,
  });

  if (!selected || Array.isArray(selected)) return null;

  const tauriFs = require("@tauri-apps/plugin-fs");
  const bytes = (await tauriFs.readFile(selected)) as Uint8Array;

  return {
    id: createUniqueID(),
    name: getFileNameFromPath(selected),
    size: bytes.byteLength,
    dataBase64: fromByteArray(bytes),
  };
}

async function pickMobileAttachment(): Promise<AttachmentFile | null> {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (result.canceled || result.assets.length === 0) return null;

  const asset = result.assets[0];
  const dataBase64 = await FileSystem.readAsStringAsync(asset.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return {
    id: createUniqueID(),
    name: asset.name ?? "attachment",
    mimeType: asset.mimeType,
    size: asset.size ?? Math.ceil((dataBase64.length * 3) / 4),
    dataBase64,
  };
}

async function saveDesktopAttachment(file: AttachmentFile) {
  const tauriDialog = require("@tauri-apps/plugin-dialog");
  const filePath = await tauriDialog.save({
    defaultPath: file.name,
  });

  if (!filePath) return;

  const tauriFs = require("@tauri-apps/plugin-fs");
  await tauriFs.writeFile(filePath, toByteArray(file.dataBase64));
}

function getSafeFileName(file: AttachmentFile): string {
  return file.name.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_") || "attachment";
}

async function writeMobileCacheAttachment(file: AttachmentFile) {
  const fileUri = `${FileSystem.cacheDirectory}${getSafeFileName(file)}`;

  await FileSystem.writeAsStringAsync(fileUri, file.dataBase64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return fileUri;
}

async function shareMobileAttachment(file: AttachmentFile) {
  const fileUri = await writeMobileCacheAttachment(file);

  await Sharing.shareAsync(fileUri, {
    mimeType: file.mimeType,
    dialogTitle: file.name,
  });
}

function getFileExtension(file: AttachmentFile): string {
  const name = file.name.toLowerCase();
  const match = /\.([a-z0-9]+)$/.exec(name);
  return match?.[1] ?? "";
}

function getAttachmentIcon(file: AttachmentFile): string {
  const mime = file.mimeType?.toLowerCase() ?? "";
  const extension = getFileExtension(file);

  if (mime === "application/pdf" || extension === "pdf") return "file-pdf-box";
  if (
    mime.startsWith("image/") ||
    ["avif", "gif", "heic", "jpeg", "jpg", "png", "svg", "webp"].includes(
      extension,
    )
  ) {
    return "file-image";
  }
  if (
    mime.startsWith("video/") ||
    ["avi", "m4v", "mkv", "mov", "mp4", "webm"].includes(extension)
  ) {
    return "file-video";
  }
  if (
    mime.startsWith("audio/") ||
    ["flac", "m4a", "mp3", "ogg", "wav"].includes(extension)
  ) {
    return "file-music";
  }
  if (["7z", "gz", "rar", "tar", "zip"].includes(extension)) {
    return "folder-zip";
  }
  if (["csv", "xls", "xlsx"].includes(extension)) return "file-table";
  if (["doc", "docx", "odt", "rtf"].includes(extension)) return "file-word";
  if (["ppt", "pptx"].includes(extension)) return "file-powerpoint";
  if (
    [
      "css",
      "html",
      "js",
      "json",
      "jsx",
      "md",
      "ts",
      "tsx",
      "txt",
      "xml",
      "yaml",
      "yml",
    ].includes(extension)
  ) {
    return "file-code";
  }

  return "file-outline";
}

function canPreviewAttachment(file: AttachmentFile): boolean {
  const mime = file.mimeType?.toLowerCase() ?? "";
  const extension = getFileExtension(file);

  return (
    mime === "application/pdf" ||
    mime.startsWith("image/") ||
    mime.startsWith("text/") ||
    ["pdf", "avif", "gif", "heic", "jpeg", "jpg", "md", "png", "svg", "txt", "webp"].includes(
      extension,
    )
  );
}

function AttachmentModule(props: AttachmentModuleType & Props) {
  const didMount = useRef(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [files, setFiles] = useState<AttachmentFile[]>(props.files ?? []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFiles(props.files ?? []);
  }, [props.files]);

  useEffect(() => {
    if (didMount.current) {
      props.changeModule({
        id: props.id,
        module: props.module,
        files,
      });
    } else {
      didMount.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const totalSize = useMemo(
    () => files.reduce((sum, file) => sum + file.size, 0),
    [files],
  );

  const addAttachment = async () => {
    setError(null);

    try {
      if (files.length >= MAX_FILES) {
        setError(t("modules:attachmentTooMany", { count: MAX_FILES }));
        return;
      }

      const file =
        Platform.OS === "web"
          ? await pickDesktopAttachment()
          : await pickMobileAttachment();

      if (!file) return;

      if (file.size > MAX_FILE_SIZE) {
        setError(
          t("modules:attachmentFileTooLarge", {
            limit: formatBytes(MAX_FILE_SIZE),
          }),
        );
        return;
      }

      if (totalSize + file.size > MAX_ENTRY_ATTACHMENT_SIZE) {
        setError(
          t("modules:attachmentEntryTooLarge", {
            limit: formatBytes(MAX_ENTRY_ATTACHMENT_SIZE),
          }),
        );
        return;
      }

      setFiles((current) => [...current, file]);
    } catch {
      setError(t("modules:attachmentReadFailed"));
    }
  };

  const removeAttachment = (id: string) => {
    setError(null);
    setFiles((current) => current.filter((file) => file.id !== id));
  };

  const saveAttachment = async (file: AttachmentFile) => {
    setError(null);

    try {
      if (Platform.OS === "web") {
        await saveDesktopAttachment(file);
      } else {
        await shareMobileAttachment(file);
      }
    } catch {
      setError(t("modules:attachmentSaveFailed"));
    }
  };

  const previewAttachment = (file: AttachmentFile) => {
    setError(null);

    const previewId = setAttachmentPreview(file);
    navigation.navigate("AttachmentPreview", { previewId });
  };

  return (
    <ModuleContainer
      id={props.id}
      title={t("modules:attachment")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.ATTACHMENT]}
      fastAccess={props.fastAccess}
    >
      <View style={styles.container}>
        {files.length === 0 ? (
          <Text variant="bodySmall" style={styles.mutedText}>
            {t("modules:attachmentEmpty")}
          </Text>
        ) : (
          <View style={styles.fileList}>
            {files.map((file) => {
              const canPreview = canPreviewAttachment(file);

              return (
                <View
                  key={file.id}
                  style={[
                    styles.fileRowFrame,
                    {
                      borderColor: theme.colors.outlineVariant,
                      backgroundColor: theme.colors.surface,
                    },
                  ]}
                >
                  <AnimatedPressable
                    disabled={!canPreview}
                    onPress={() => {
                      previewAttachment(file);
                    }}
                    style={styles.fileRowPressable}
                    rippleColor="rgba(120, 127, 246, 0.18)"
                  >
                    <View style={styles.fileRow}>
                      <View style={styles.fileIcon}>
                        <Icon
                          source={getAttachmentIcon(file)}
                          size={20}
                          color={theme.colors.primary}
                        />
                      </View>
                      <View style={styles.fileText}>
                        <Text variant="bodyMedium" numberOfLines={1}>
                          {file.name}
                        </Text>
                        <Text variant="bodySmall" style={styles.mutedText}>
                          {formatBytes(file.size)}
                        </Text>
                      </View>
                      <TooltipIconButton
                        tooltip={t("modules:attachmentSave")}
                        icon="download"
                        size={19}
                        iconColor={theme.colors.primary}
                        onPress={() => {
                          void saveAttachment(file);
                        }}
                        style={styles.iconButton}
                      />
                      <TooltipIconButton
                        tooltip={t("modules:attachmentRemove")}
                        icon="close"
                        size={19}
                        iconColor={theme.colors.error}
                        onPress={() => removeAttachment(file.id)}
                        style={styles.iconButton}
                      />
                    </View>
                  </AnimatedPressable>
                </View>
              );
            })}
          </View>
        )}

        {error ? (
          <Text variant="bodySmall" style={{ color: theme.colors.error }}>
            {error}
          </Text>
        ) : (
          <Text variant="bodySmall" style={styles.mutedText}>
            {t("modules:attachmentHelp", {
              fileLimit: formatBytes(MAX_FILE_SIZE),
              entryLimit: formatBytes(MAX_ENTRY_ATTACHMENT_SIZE),
            })}
          </Text>
        )}

        <Button
          compact
          icon="paperclip-plus"
          mode="contained-tonal"
          onPress={addAttachment}
          style={styles.addButton}
          textColor={theme.colors.primary}
        >
          {t("modules:attachmentAdd")}
        </Button>
      </View>
    </ModuleContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  fileList: {
    gap: 6,
  },
  fileRowFrame: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  fileRowPressable: {
    minHeight: 44,
  },
  fileRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 2,
    paddingVertical: 4,
    gap: 8,
  },
  fileIcon: {
    width: 24,
    alignItems: "center",
  },
  fileText: {
    flex: 1,
    minWidth: 0,
  },
  mutedText: {
    opacity: 0.72,
    userSelect: "none",
  },
  iconButton: {
    width: 32,
    height: 32,
    margin: 0,
  },
  addButton: {
    borderRadius: 12,
    alignSelf: "flex-start",
  },
});

export default AttachmentModule;

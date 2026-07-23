import React, { ReactNode, useEffect, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { Button, Icon, Text, TextInput } from "react-native-paper";
import { Platform, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ValuesListType } from "../../../vault/model/ValuesType";
import importChrome from "./chrome";
import importFirefox from "./firefox";
import importBitwarden from "./bitwarden";
import Modal from "../../../../shared/components/modals/Modal";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import SettingsItem from "../../components/SettingsItem";
import { logger } from "../../../../infrastructure/logging/logger";
import { useVault } from "../../../../app/providers/VaultProvider";
import FolderType from "../../../vault/model/FolderType";

type PendingKdbxFile = {
  data: ArrayBuffer;
  name: string;
};

const styles = StyleSheet.create({
  passwordModal: {
    width: 320,
    maxWidth: "100%",
    padding: 16,
    gap: 12,
    borderRadius: 12,
  },
  passwordModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  passwordModalIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  passwordModalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  passwordModalButton: {
    borderRadius: 12,
  },
});

export enum DocumentTypeEnum {
  FIREFOX,
  CHROME,
  PCLOUD,
  KDBX,
  BITWARDEN,
}

type Props = {
  title: string;
  icon: string;
  leading?: ReactNode;
  type: DocumentTypeEnum;
};

function Import(props: Props) {
  const vault = useVault();
  const { t } = useTranslation();
  const { globalStyles, theme } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [eyeIcon, setEyeIcon] = useState("eye");
  const [pendingKdbxFile, setPendingKdbxFile] =
    useState<PendingKdbxFile | null>(null);

  useEffect(() => {
    setEyeIcon(secureTextEntry ? "eye" : "eye-off");
  }, [secureTextEntry]);

  const saveValues = (values: ValuesListType) => {
    if (!vault.isUnlocked) return;

    vault.update((draft) => {
      const existing = draft.values ?? [];
      draft.values = [...existing, ...values];
    });
  };

  const saveKdbxValues = (values: ValuesListType, folders: FolderType[]) => {
    if (!vault.isUnlocked) return;

    vault.update((draft) => {
      const existingFolders = draft.folder ?? [];
      const nextFolders = [...existingFolders];
      const folderByImportedId = new Map<string, FolderType>();

      folders.forEach((folder) => {
        const existing = existingFolders.find(
          (current) =>
            current.name.trim().toLocaleLowerCase() ===
            folder.name.trim().toLocaleLowerCase(),
        );

        if (existing) {
          folderByImportedId.set(folder.id, existing);
          return;
        }

        folderByImportedId.set(folder.id, folder);
        nextFolders.push(folder);
      });

      draft.folder = nextFolders;
      draft.values = [
        ...(draft.values ?? []),
        ...values.map((entry) => ({
          ...entry,
          folder: entry.folder
            ? (folderByImportedId.get(entry.folder.id) ?? entry.folder)
            : null,
        })),
      ];
    });
  };

  const readFile = async (uri: any) => {
    try {
      const response = await fetch(uri);
      const fileData = await response.text();
      return fileData;
    } catch (error) {
      return null;
    }
  };

  const readFileBuffer = async (uri: any) => {
    try {
      const response = await fetch(uri);
      return await response.arrayBuffer();
    } catch {
      return null;
    }
  };

  const readDesktopKdbxFile = async (): Promise<PendingKdbxFile | null> => {
    const tauriDialog = require("@tauri-apps/plugin-dialog");
    const filePath = await tauriDialog.open({
      multiple: false,
      directory: false,
      filters: [
        {
          name: "KeePass KDBX",
          extensions: ["kdbx"],
        },
      ],
    });

    if (!filePath || Array.isArray(filePath)) return null;

    const tauriFs = require("@tauri-apps/plugin-fs");
    const bytes = (await tauriFs.readFile(filePath)) as Uint8Array;
    return {
      data: bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset + bytes.byteLength,
      ) as ArrayBuffer,
      name: filePath.split(/[\\/]/).filter(Boolean).pop() ?? "KeePass.kdbx",
    };
  };

  const pickKdbxFile = async (): Promise<PendingKdbxFile | null> => {
    if (Platform.OS === "web") return readDesktopKdbxFile();

    const result: any = await DocumentPicker.getDocumentAsync(
      pickerOptions(),
    );

    if (result.canceled !== false) return null;

    const fileData = await readFileBuffer(result.assets[0].uri);
    if (!fileData) {
      logger.error("[Import] Failed to read KDBX file data");
      return null;
    }

    return {
      data: fileData,
      name: result.assets[0].name ?? "KeePass.kdbx",
    };
  };

  const openKdbxPasswordModal = async () => {
    try {
      const file = await pickKdbxFile();
      if (!file) return;

      setValue("");
      setPendingKdbxFile(file);
      setModalVisible(true);
    } catch (error) {
      logger.error("[Import] Error picking KDBX document:", error);
    }
  };

  const importSelectedKdbxFile = async () => {
    if (!pendingKdbxFile) return;

    try {
      const { importKdbx } = await import("./keepass/importKdbx");
      const imported = await importKdbx(pendingKdbxFile.data, value);
      saveKdbxValues(imported.values, imported.folders);
      setPendingKdbxFile(null);
      setValue("");
      setModalVisible(false);
    } catch (error) {
      logger.error("[Import] Error importing KDBX document:", error);
    }
  };

  const pickerOptions = () => {
    if (
      props.type === DocumentTypeEnum.CHROME ||
      props.type === DocumentTypeEnum.FIREFOX
    ) {
      return { type: "text/csv" };
    }

    if (props.type === DocumentTypeEnum.KDBX) {
      return {
        type: [
          "application/x-keepass2",
          "application/octet-stream",
          "application/vnd.keepass",
          "*/*",
        ],
      };
    }

    return { type: "application/json" };
  };

  const pickDocument = async () => {
    try {
      const result: any = await DocumentPicker.getDocumentAsync(
        pickerOptions(),
      );

      if (result.canceled !== false) return;

      if (props.type === DocumentTypeEnum.KDBX) {
        const fileData = await readFileBuffer(result.assets[0].uri);
        if (!fileData) {
          logger.error("[Import] Failed to read KDBX file data");
          return;
        }

        const { importKdbx } = await import("./keepass/importKdbx");
        const imported = await importKdbx(fileData, value);
        saveKdbxValues(imported.values, imported.folders);
        return;
      }

      const fileData = await readFile(result.assets[0].uri);
      if (!fileData) {
        logger.error("[Import] Failed to read file data");
        return;
      }

      if (props.type === DocumentTypeEnum.CHROME) {
        const imported = importChrome(fileData);
        if (imported) saveValues(imported);
        return;
      }

      if (props.type === DocumentTypeEnum.FIREFOX) {
        const imported = importFirefox(fileData);
        if (imported) saveValues(imported);
        return;
      }

      if (props.type === DocumentTypeEnum.BITWARDEN) {
        const imported = importBitwarden(fileData);
        saveKdbxValues(imported.values, imported.folders);
        return;
      }

      if (props.type === DocumentTypeEnum.PCLOUD) {
        const { default: importpCloud } = await import("./pcloud");
        const imported = importpCloud(fileData, value);
        saveValues(imported);
        return;
      }
    } catch (error) {
      logger.error("[Import] Error picking document:", error);
    }
  };

  return (
    <>
      <SettingsItem
        leadingIcon={props.icon}
        leading={props.leading}
        onPress={
          props.type === DocumentTypeEnum.KDBX
            ? () => {
                void openKdbxPasswordModal();
              }
            : props.type === DocumentTypeEnum.PCLOUD
            ? () => {
                setValue("");
                setModalVisible(true);
              }
            : pickDocument
        }
      >
        {t("settings:importPasswords", { title: props.title })}
      </SettingsItem>

      {(props.type === DocumentTypeEnum.PCLOUD ||
        props.type === DocumentTypeEnum.KDBX) && (
        <Modal
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
            setPendingKdbxFile(null);
          }}
        >
          <View
            style={[
              props.type === DocumentTypeEnum.KDBX
                ? styles.passwordModal
                : { margin: 6 },
              props.type === DocumentTypeEnum.KDBX
                ? {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.outlineVariant,
                    borderWidth: StyleSheet.hairlineWidth,
                  }
                : null,
            ]}
          >
            {props.type === DocumentTypeEnum.KDBX ? (
              <>
                <View style={styles.passwordModalHeader}>
                  <View
                    style={[
                      styles.passwordModalIcon,
                      { backgroundColor: theme.colors.secondaryContainer },
                    ]}
                  >
                    <Icon
                      source="key-chain"
                      size={20}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text variant="titleMedium">
                      {t("settings:keepassPasswordTitle")}
                    </Text>
                    {pendingKdbxFile ? (
                      <Text variant="bodySmall" numberOfLines={1}>
                        {pendingKdbxFile.name}
                      </Text>
                    ) : null}
                  </View>
                </View>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  {t("settings:keepassPasswordText")}
                </Text>
              </>
            ) : (
              <Text>{t("settings:pcloudMasterPassword")}</Text>
            )}

            <TextInput
              outlineStyle={globalStyles.outlineStyle}
              style={globalStyles.textInputStyle}
              value={value}
              mode="outlined"
              onChangeText={(text) => setValue(text)}
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
              right={
                <TextInput.Icon
                  animated
                  icon={eyeIcon}
                  color={theme.colors.primary}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                />
              }
            />

            {props.type === DocumentTypeEnum.KDBX ? (
              <View style={styles.passwordModalActions}>
                <Button
                  style={styles.passwordModalButton}
                  onPress={() => {
                    setPendingKdbxFile(null);
                    setModalVisible(false);
                  }}
                >
                  {t("common:cancel")}
                </Button>
                <Button
                  mode="contained"
                  style={styles.passwordModalButton}
                  disabled={value.length === 0}
                  onPress={() => {
                    void importSelectedKdbxFile();
                  }}
                >
                  {t("settings:keepassImportAction")}
                </Button>
              </View>
            ) : (
              <Button
                onPress={() => {
                  pickDocument();
                  setModalVisible(false);
                }}
              >
                Ok
              </Button>
            )}
          </View>
        </Modal>
      )}
    </>
  );
}

export default Import;

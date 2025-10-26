import React, { useEffect, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { Button, Text, TextInput } from "react-native-paper";
import { ValuesListType } from "../../types/ValuesType";
import { useData } from "../../contexts/DataProvider";
import DataType from "../../types/DataType";
import importChrome from "./chrome";
import importFirefox from "./firefox";
import importpCloud from "./pcloud";
import Modal from "../../components/modals/Modal";
import { useTheme } from "../../contexts/ThemeProvider";
import { View } from "react-native";
import SettingsItem from "../../components/items/SettingsItem";

export enum DocumentTypeEnum {
  FIREFOX,
  CHROME,
  PCLOUD,
}

type Props = {
  title: string;
  icon: string;
  type: DocumentTypeEnum;
};

function Import(props: Props) {
  const data = useData();
  const { globalStyles, theme } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const [eyeIcon, setEyeIcon] = useState("eye");

  useEffect(() => {
    if (secureTextEntry) {
      setEyeIcon("eye");
    } else {
      setEyeIcon("eye-off");
    }
  }, [secureTextEntry]);

  const saveValues = (values: ValuesListType) => {
    let newData = { ...data.data } as DataType;
    if (newData) newData.values = [...newData.values, ...values];
    data.setData(newData);
    data.setShowSave(true);
  };

  const pickDocument = async () => {
    try {
      const result: any = await DocumentPicker.getDocumentAsync(
        props.type === DocumentTypeEnum.CHROME ||
          props.type === DocumentTypeEnum.FIREFOX
          ? {
              type: "text/csv",
            }
          : { type: "application/json" }
      );
      if (result.canceled === false) {
        const fileData = await readFile(result.assets[0].uri);
        if (fileData) {
          if (props.type === DocumentTypeEnum.CHROME) {
            const data = importChrome(fileData);
            if (data) {
              saveValues(data);
            }
            return;
          }
          if (props.type === DocumentTypeEnum.FIREFOX) {
            const data = importFirefox(fileData);
            if (data) {
              saveValues(data);
            }
            return;
          }
          if (props.type === DocumentTypeEnum.PCLOUD) {
            const data = importpCloud(fileData, value);
            saveValues(data);
            return;
          }
        } else {
          console.error("Failed to read file data");
        }
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
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

  return (
    <>
      <SettingsItem
        leadingIcon={props.icon}
        onPress={
          props.type === DocumentTypeEnum.PCLOUD
            ? () => {
                setValue("");
                setModalVisible(true);
              }
            : pickDocument
        }
      >
        Import {props.title} Passwords
      </SettingsItem>
      {props.type === DocumentTypeEnum.PCLOUD && (
        <Modal
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
          }}
        >
          <View style={{ margin: 6 }}>
            <Text>Enter Master Password of pCloud</Text>
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
            <Button
              onPress={() => {
                pickDocument();
                setModalVisible(false);
              }}
            >
              Ok
            </Button>
          </View>
        </Modal>
      )}
    </>
  );
}

export default Import;

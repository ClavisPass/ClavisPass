import React, { useState } from "react";
import { View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Papa from "papaparse";
import * as FileSystem from "expo-file-system";
import { Button } from "react-native-paper";
import ValuesType, { ValuesListType } from "../../types/ValuesType";
import createUniqueID from "../../utils/createUniqueID";
import getModuleData from "../../utils/getModuleData";
import ModulesEnum from "../../enums/ModulesEnum";
import { getDateTime } from "../../utils/Timestamp";
import { useData } from "../../contexts/DataProvider";
import DataType from "../../types/DataType";

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

  const importFirefox = (fileData: string) => {
    const parsedData: any = Papa.parse(fileData);
    if (parsedData.errors.length > 0) {
      console.error("Error parsing CSV:", parsedData.errors);
    } else {
      const data = parsedData.data;
      const dateTime = getDateTime();
      let allValues: ValuesListType = [];
      for (var i = 2; i < data.length; i++) {
        const current = data[i];
        let value: ValuesType = {
          id: createUniqueID(),
          title: current[1],
          modules: [],
          folder: "",
          fav: false,
          created: dateTime,
          lastUpdated: dateTime,
        };
        let url = getModuleData(ModulesEnum.URL);
        let username = getModuleData(ModulesEnum.USERNAME);
        let password = getModuleData(ModulesEnum.PASSWORD);
        if (url && username && password) {
          if (current[0]) {
            url.value = current[0];
          }
          if (current[1]) {
            username.value = current[1];
          }
          if (current[2]) {
            password.value = current[2];
          }
          value.modules = [username, password, url];
        }
        allValues = [...allValues, value];
      }
      saveValues(allValues);
    }
  };

  const importChrome = (fileData: string) => {
    const parsedData: any = Papa.parse(fileData);
    if (parsedData.errors.length > 0) {
      console.error("Error parsing CSV:", parsedData.errors);
    } else {
      const data = parsedData.data;
      const dateTime = getDateTime();
      let allValues: ValuesListType = [];
      for (var i = 1; i < data.length; i++) {
        const current = data[i];
        let value: ValuesType = {
          id: createUniqueID(),
          title: current[0],
          modules: [],
          folder: "",
          fav: false,
          created: dateTime,
          lastUpdated: dateTime,
        };
        let url = getModuleData(ModulesEnum.URL);
        let username = getModuleData(ModulesEnum.USERNAME);
        let password = getModuleData(ModulesEnum.PASSWORD);
        let note = getModuleData(ModulesEnum.NOTE);
        if (url && username && password && note) {
          if (current[1]) {
            url.value = current[1];
          }
          if (current[2]) {
            username.value = current[2];
          }
          if (current[3]) {
            password.value = current[3];
          }
          value.modules = [username, password, url];
          if (current[4] && current[4] !== "") {
            note.value = current[4];
            value.modules = [...value.modules, note];
          }
        }
        allValues = [...allValues, value];
      }
      saveValues(allValues);
    }
  };

  const saveValues = (values: ValuesListType) => {
    let newData = { ...data.data } as DataType;
    if (newData) newData.values = [...newData.values, ...values];
    data.setData(newData);
  };

  const pickDocument = async () => {
    console.log("Pick document function called");
    try {
      const result: any = await DocumentPicker.getDocumentAsync(
        props.type === DocumentTypeEnum.CHROME ||
          props.type === DocumentTypeEnum.FIREFOX
          ? {
              type: "text/csv",
            }
          : { type: "text/json" }
      );
      if (result.canceled === false) {
        const fileData = await readFile(result.assets[0].uri);
        if (fileData) {
          if (props.type === DocumentTypeEnum.CHROME) {
            importChrome(fileData);
            return;
          }
          if (props.type === DocumentTypeEnum.FIREFOX) {
            importFirefox(fileData);
            return;
          }
          if (props.type === DocumentTypeEnum.PCLOUD) {
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
    console.log("Reading file");
    try {
      const response = await fetch(uri);
      const fileData = await response.text();
      return fileData;
    } catch (error) {
      return null;
    }
  };

  return (
    <Button icon={props.icon} mode="contained-tonal" onPress={pickDocument}>
      {props.title} Passwords
    </Button>
  );
}

export default Import;

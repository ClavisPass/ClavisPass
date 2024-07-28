import React, { useState } from "react";
import { View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Papa from "papaparse";
import * as FileSystem from "expo-file-system";
import { Button } from "react-native-paper";

type Props = {
  title: string;
  icon: string;
};

function Import(props: Props) {
  const [fileUri, setFileUri] = useState(null);
  const [csvData, setCsvData] = useState([]);

  const pickDocument = async () => {
    console.log("Pick document function called");
    try {
      const result: any = await DocumentPicker.getDocumentAsync({
        type: "text/csv",
      });
      if (result.canceled === false) {
        setFileUri(result.assets[0].uri);
        const fileData = await readFile(result.assets[0].uri);
        if (fileData) {
          const parsedData: any = Papa.parse(fileData);
          if (parsedData.errors.length > 0) {
            console.error("Error parsing CSV:", parsedData.errors);
          } else {
            console.log(parsedData.data);
            setCsvData(parsedData.data);
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

import React, { ReactNode, useState } from "react";
import { View, Button, FlatList, TextInput, SafeAreaView } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Papa from "papaparse";
import * as FileSystem from "expo-file-system";

type Props = {
  //children: ReactNode;
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
            console.log(parsedData.data)
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
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
         <Button title="Pick a file" onPress={pickDocument} />
      </View>
    </View>
  );
}

export default Import;

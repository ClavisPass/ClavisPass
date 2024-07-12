import React from "react";

import type { StackScreenProps } from "@react-navigation/stack";
import globalStyles from "../ui/globalStyles";
import AnimatedContainer from "../components/AnimatedContainer";
import { Platform } from "react-native";
import DraggableFolderListWeb from "../components/draggableFolderList/DraggableFolderListWeb";
import DraggableFolderList from "../components/draggableFolderList/DraggableFolderList";
import Header from "../components/Header";
import { TitlebarHeight } from "../components/CustomTitlebar";

type RootStackParamList = {
  params: {
    folder: string[];
    setFolder: (folder: string[]) => void;
  };
};

type Props = StackScreenProps<RootStackParamList>;

function EditFolderListScreen({ route, navigation }: Props) {
  return (
    <AnimatedContainer style={globalStyles.container}>
      <TitlebarHeight />
      <Header
        title={"Edit Folder"}
        onPress={() => {
          navigation.goBack();
        }}
      ></Header>
      {Platform.OS === "web" ? (
        <DraggableFolderListWeb
          folder={route.params.folder}
          setFolder={route.params.setFolder}
        />
      ) : (
        <DraggableFolderList
          folder={route.params.folder}
          setFolder={route.params.setFolder}
        />
      )}
    </AnimatedContainer>
  );
}

export default EditFolderListScreen;

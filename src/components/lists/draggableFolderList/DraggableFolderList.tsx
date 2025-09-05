import React, { useCallback } from "react";
import { Pressable, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { Icon, IconButton, Text, TouchableRipple } from "react-native-paper";
import theme from "../../../ui/theme";
import { useTheme } from "../../../contexts/ThemeProvider";
import { DataContextType } from "../../../contexts/DataProvider";
import changeFolder from "../../../utils/changeFolder";
import FolderType from "../../../types/FolderType";

type Props = {
  data: DataContextType;
  folder: FolderType[];
  setSelectedFolder?: (folder: FolderType) => void;
  deleteFolder: (folder: FolderType) => void;
};

function DraggableFolderList(props: Props) {
  const { globalStyles } = useTheme();
  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<FolderType>) => {
      return (
        <View style={[globalStyles.folderContainer, { marginBottom: 4 }]}>
          <Pressable onPressIn={drag}>
            <Icon source="drag" size={20} />
          </Pressable>
          <TouchableRipple
            style={{
              borderRadius: 12,
              padding: 10,
              flex: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
            onPress={
              props.setSelectedFolder
                ? () => {
                    props.setSelectedFolder?.(item);
                  }
                : undefined
            }
            rippleColor="rgba(0, 0, 0, .32)"
          >
            <>
              <Icon source="folder" color={theme.colors.primary} size={20} />
              <Text
                style={{
                  userSelect: "none",
                  fontWeight: "bold",
                  fontSize: 15,
                }}
                variant="bodyMedium"
              >
                {item.name}
              </Text>
            </>
          </TouchableRipple>
          <IconButton
            icon="close"
            size={14}
            style={{ margin: 0 }}
            onPress={() => {
              props.deleteFolder(item);
            }}
          />
        </View>
      );
    },
    [props.folder]
  );

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <DraggableFlatList
        data={props.folder}
        renderItem={renderItem}
        keyExtractor={(item, index) => `drag-item-${item.id}-${index}`}
        onDragEnd={(event) => {
          if (event?.data) {
            changeFolder(event.data, props.data);
            props.data.setShowSave(true);
          }
        }}
      />
    </View>
  );
}

export default DraggableFolderList;

import React, { useCallback } from "react";
import { Pressable, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { Icon, IconButton, Text, TouchableRipple } from "react-native-paper";
import theme from "../../../ui/theme";
import { useTheme } from "../../../contexts/ThemeProvider";
import { useData } from "../../../contexts/DataProvider";
import changeFolder from "../../../utils/changeFolder";

type Props = {
  folder: string[];
  setSelectedFolder?: (folder: string) => void;
  deleteFolder: (folder: string) => void;
};

function DraggableFolderList(props: Props) {
  const dataData = useData();
  const { globalStyles } = useTheme();
  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<string>) => {
      return (
        <View style={globalStyles.folderContainer}>
          <Pressable onPressIn={drag}>
            <Icon source="drag" size={20} />
          </Pressable>
          <TouchableRipple
            style={{
              borderRadius: 12,
              padding: 6,
              flexGrow: 1,
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
                {item}
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
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        data={props.folder}
        renderItem={renderItem}
        keyExtractor={(item, index) => `drag-item-${item}-${index}`}
        onDragEnd={({ data }) => {
          changeFolder(data, dataData);
          dataData.setShowSave(true);
        }}
      />
    </View>
  );
}

export default DraggableFolderList;

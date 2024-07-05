import React, { useCallback, useEffect } from "react";
import { Pressable, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import globalStyles from "../../ui/globalStyles";
import { Divider, Icon, IconButton, Text } from "react-native-paper";
import theme from "../../ui/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type Props = {
  folder: string[];
  setFolder: (folder: string[]) => void;
  draggableDisabled: boolean;
};

function DraggableFolderList(props: Props) {
  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<string>) => {
      return (
        <View style={globalStyles.folderContainer}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Pressable
              onPressIn={() => {
                if (props.draggableDisabled == false) drag;
              }}
            >
              <Icon source="drag" size={20} />
            </Pressable>
            <Icon source="folder" color={theme.colors.primary} size={20} />
            <Text
              style={{
                userSelect: "none",
                fontWeight: "bold",
                fontSize: 15,
                color: theme.colors.primary,
              }}
              variant="bodyMedium"
            >
              {item}
            </Text>
          </View>
          <IconButton
            //style={{ margin: 0 }}
            icon="close"
            iconColor={theme.colors.error}
            size={20}
            onPress={() => {}}
          />
        </View>
      );
    },
    [props.folder]
  );

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <DraggableFlatList
        ItemSeparatorComponent={Divider}
        data={[...props.folder]}
        renderItem={renderItem}
        keyExtractor={(item, index) => `drag-item-${item}-${index}`}
        onDragEnd={({ data }) => props.setFolder(data)}
      />
    </View>
  );
}

export default DraggableFolderList;

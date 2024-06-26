import React, { useRef } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Chip, IconButton } from "react-native-paper";
import WebSpecific from "./platformSpecific/WebSpecific";

const styles = StyleSheet.create({
  chip: {
    marginRight: 4,
    borderRadius: 15,
  },
});

type Props = {
  folder: string[] | undefined;
  selectedFav: boolean;
  setSelectedFav: (selectedFav: boolean) => void;
  selectedFolder: string;
  setSelectedFolder: (selectedFolder: string) => void;
};

function FolderFilter(props: Props) {
  const flatListRef = useRef<FlatList>(null);
  return (
    <View
      style={{
        padding: 4,
        maxHeight: 50,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <WebSpecific>
        <IconButton
          icon={"chevron-left"}
          style={{ margin: 0 }}
          onPress={() => {
            flatListRef?.current?.scrollToIndex({
              animated: true,
              index: 0,
            });
          }}
          size={12}
        />
      </WebSpecific>
      <View style={{ flexBasis: "auto", flexShrink: 1 }}>
        <FlatList
          ref={flatListRef}
          data={props.folder}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 1 }}
          ListHeaderComponent={() => {
            return (
              <Chip
                icon={"star"}
                selected={props.selectedFav}
                showSelectedOverlay={true}
                onPress={() => {
                  props.setSelectedFav(!props.selectedFav);
                  if (props.selectedFav) {
                    props.setSelectedFav(false);
                  } else {
                    props.setSelectedFav(true);
                  }
                }}
                style={styles.chip}
              >
                {"Favorite"}
              </Chip>
            );
          }}
          renderItem={({ item }) => (
            <Chip
              icon={"folder"}
              selected={props.selectedFolder == item ? true : false}
              showSelectedOverlay={true}
              onPress={() => {
                if (props.selectedFolder != item) {
                  props.setSelectedFolder(item);
                } else {
                  props.setSelectedFolder("");
                }
              }}
              style={styles.chip}
            >
              {item}
            </Chip>
          )}
        />
      </View>
      <WebSpecific>
        <IconButton
          icon={"chevron-right"}
          style={{ margin: 0 }}
          onPress={() => {
            const indexEnd: number = flatListRef?.current?.props?.data?.length
              ? flatListRef?.current?.props?.data?.length - 1
              : 0;
            flatListRef?.current?.scrollToIndex({
              animated: true,
              index: 6,
            });
          }}
          size={12}
        />
      </WebSpecific>
    </View>
  );
}

export default FolderFilter;

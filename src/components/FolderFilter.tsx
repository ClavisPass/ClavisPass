import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
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
  setFolderModalVisible: (folderModalVisible: boolean) => void;
};

function FolderFilter(props: Props) {
  const flatListRef: any = useRef<FlatList>(null);
  const [currentOffset, setCurrentOffset] = useState(0);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.x;
    setCurrentOffset(offsetY);
  };

  const change = (direction: "+" | "-") => {
    const { width } = Dimensions.get("window");
    let nextOffset = 0;
    if (direction === "+") nextOffset = currentOffset + width - 100;
    if (direction === "-") nextOffset = currentOffset - width - 100;
    flatListRef?.current?.scrollToOffset({
      animated: true,
      offset: nextOffset,
    });
  };

  return (
    <View
      style={{
        padding: 4,
        maxHeight: 50,
        width: "100%",
        //flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <WebSpecific>
        <IconButton
          icon={"chevron-left"}
          style={{ margin: 0 }}
          onPress={() => change("-")}
          size={12}
        />
      </WebSpecific>
      <View style={{ flexBasis: "auto", flexShrink: 1, overflow: "hidden" }}>
        <FlatList
          ref={flatListRef}
          data={["Favorite", ...(props.folder ? props.folder : [])]}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{flexShrink: 1 }}
          onScroll={handleScroll}
          renderItem={({ item, index }) => (
            <>
              {index === 0 && item === "Favorite" ? (
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
              ) : (
                <Chip
                  key={index}
                  icon={"folder"}
                  selected={props.selectedFolder == item ? true : false}
                  showSelectedOverlay={true}
                  onPress={() => {
                    if (props.selectedFolder != item) {
                      props.setSelectedFolder("" + item);
                    } else {
                      props.setSelectedFolder("");
                    }
                  }}
                  style={styles.chip}
                >
                  {item}
                </Chip>
              )}
            </>
          )}
        />
      </View>
      <IconButton
        icon={"plus"}
        style={{ margin: 0 }}
        onPress={() => props.setFolderModalVisible(true)}
        size={12}
      />
      <WebSpecific>
        <IconButton
          icon={"chevron-right"}
          style={{ margin: 0 }}
          onPress={() => change("+")}
          size={12}
        />
      </WebSpecific>
    </View>
  );
}

export default FolderFilter;

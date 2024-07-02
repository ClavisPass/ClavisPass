import React, { createRef, useRef, useState } from "react";
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
  const flatListRef: any = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <View
      style={{
        padding: 4,
        maxHeight: 50,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        //flex: 1,
      }}
    >
      <WebSpecific>
        <IconButton
          icon={"chevron-left"}
          style={{ margin: 0 }}
          onPress={() => {
            let newIndex = currentIndex - 3;
            if (newIndex < 0) newIndex = 0;
            flatListRef?.current?.scrollToIndex({
              animated: true,
              index: newIndex,
            });
            setCurrentIndex(newIndex);
          }}
          size={12}
        />
      </WebSpecific>
      <View style={{ flexBasis: "auto", flexShrink: 1 }}>
        <FlatList
          ref={flatListRef}
          data={["Favorite", ...(props.folder ? props.folder : [])]}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 1 }}
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
      <WebSpecific>
        <IconButton
          icon={"chevron-right"}
          style={{ margin: 0 }}
          onPress={() => {
            const indexEnd: number = flatListRef?.current?.props?.data?.length
              ? flatListRef?.current?.props?.data?.length - 1
              : 0;
            let newIndex = currentIndex + 3;
            if (newIndex > indexEnd) newIndex = indexEnd;
            flatListRef?.current?.scrollToIndex({
              animated: true,
              index: newIndex,
            });
            setCurrentIndex(newIndex);
          }}
          size={12}
        />
      </WebSpecific>
    </View>
  );
}

export default FolderFilter;

import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Chip, Divider, IconButton } from "react-native-paper";
import WebSpecific from "./platformSpecific/WebSpecific";
import AnimatedOpacityContainer from "./container/AnimatedOpacityContainer/AnimatedOpacityContainer";
import { MenuItem } from "./items/MenuItem";
import { useTheme } from "../contexts/ThemeProvider";
import FolderType from "../types/FolderType";

const styles = StyleSheet.create({
  chip: {
    marginRight: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
});

type Props = {
  folder: FolderType[] | undefined;
  selectedFav: boolean;
  setSelectedFav: (selectedFav: boolean) => void;
  selectedFolder: FolderType | null;
  setSelectedFolder: (selectedFolder: FolderType | null) => void;
  setFolderModalVisible: (folderModalVisible: boolean) => void;
};

function FolderFilter(props: Props) {
  const { width, height } = useWindowDimensions();
  const { theme } = useTheme();

  const flatListRef: any = useRef<FlatList>(null);
  const [currentOffset, setCurrentOffset] = useState(0);

  const [showAddButton, setShowAddButton] = useState(false);

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
    <>
      {width > 600 ? (
        <View
          style={{
            maxWidth: 240,
            width: 160,
            flexDirection: "row",
            paddingRight: 4,
            overflow: "hidden",
          }}
          onPointerEnter={() => setShowAddButton(true)}
          onPointerLeave={() => setShowAddButton(false)}
        >
          <FlatList
            ref={flatListRef}
            data={
              [
                { id: "fav", name: "Favorite" },
                ...(props.folder ? props.folder : []),
              ] as FolderType[]
            }
            style={{ flexShrink: 1 }}
            onScroll={handleScroll}
            renderItem={({ item, index }) => (
              <>
                {index === 0 && item.id === "fav" ? (
                  <MenuItem
                    key={index}
                    leadingIcon={"star"}
                    selected={props.selectedFav}
                    onPress={() => {
                      props.setSelectedFav(!props.selectedFav);
                      if (props.selectedFav) {
                        props.setSelectedFav(false);
                      } else {
                        props.setSelectedFav(true);
                      }
                    }}
                  >
                    {"Favorite"}
                  </MenuItem>
                ) : (
                  <>
                    <Divider style={{ marginRight: 4 }} />
                    <MenuItem
                      key={index}
                      leadingIcon={"folder"}
                      selected={
                        props.selectedFolder?.id === item.id ? true : false
                      }
                      onPress={() => {
                        if (props.selectedFolder != item) {
                          props.setSelectedFolder(item);
                        } else {
                          props.setSelectedFolder(null);
                        }
                      }}
                    >
                      {item.name}
                    </MenuItem>
                  </>
                )}
              </>
            )}
            ListFooterComponent={
              <View
                key={"lastitem-0"}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AnimatedOpacityContainer visible={showAddButton}>
                  <IconButton
                    icon={"plus"}
                    iconColor={theme.colors.primary}
                    style={{ margin: 0 }}
                    onPress={() => props.setFolderModalVisible(true)}
                    size={20}
                    selected={true}
                    mode="contained-tonal"
                  />
                </AnimatedOpacityContainer>
              </View>
            }
          />
          <Divider style={{ width: 1, height: "100%" }} />
        </View>
      ) : (
        <View
          style={{
            padding: 4,
            paddingTop: 8,
            paddingBottom: 4,
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
              onPress={() => change("-")}
              size={12}
            />
          </WebSpecific>
          <View
            style={{ flexBasis: "auto", flexShrink: 1, overflow: "hidden" }}
          >
            <FlatList
              ref={flatListRef}
              data={
                [
                  { id: "fav", name: "Favorite" },
                  ...(props.folder ? props.folder : []),
                ] as FolderType[]
              }
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ flexShrink: 1 }}
              onScroll={handleScroll}
              renderItem={({ item, index }) => (
                <>
                  {index === 0 && item.id === "fav" ? (
                    <Chip
                      key={index}
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
                          props.setSelectedFolder(item);
                        } else {
                          props.setSelectedFolder(null);
                        }
                      }}
                      style={styles.chip}
                    >
                      {item.name}
                    </Chip>
                  )}
                </>
              )}
            />
          </View>
          <IconButton
            icon={"plus"}
            iconColor={theme.colors.primary}
            style={{ margin: 0, marginLeft: 4 }}
            onPress={() => props.setFolderModalVisible(true)}
            size={12}
            mode="contained-tonal"
            selected={true}
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
      )}
    </>
  );
}

export default FolderFilter;

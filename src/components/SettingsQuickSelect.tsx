import React, { useRef, useState } from "react";
import {
  Dimensions,
  findNodeHandle,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  UIManager,
  useWindowDimensions,
  View,
} from "react-native";
import { Chip, Divider, IconButton } from "react-native-paper";
import WebSpecific from "./platformSpecific/WebSpecific";
import { MenuItem } from "./items/MenuItem";
import { useTheme } from "../contexts/ThemeProvider";
import QuickSelectItem from "../types/QuickSelectItem";

const styles = StyleSheet.create({
  chip: {
    marginRight: 4,
    borderRadius: 12,
  },
});

type Props = {
  items: QuickSelectItem[];
  scrollRef: React.RefObject<ScrollView | null>;
};

function SettingsQuickSelect(props: Props) {
  const { width, height } = useWindowDimensions();
  const { theme } = useTheme();

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

  const scrollToRef = (ref: React.RefObject<View | null>) => {
    if (!ref.current || !props.scrollRef.current) return;

    if (Platform.OS === "web") {
      (ref.current as any)?.scrollIntoView?.({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    const scrollViewNode = findNodeHandle(props.scrollRef.current);
    const targetNode = findNodeHandle(ref.current);

    if (!scrollViewNode || !targetNode) {
      console.warn("ScrollView oder Ziel-Element nicht gefunden");
      return;
    }

    UIManager.measureLayout(
      targetNode,
      scrollViewNode,
      () => {
        console.warn("Layout messen fehlgeschlagen");
      },
      (_x, y) => {
        props.scrollRef.current?.scrollTo({ y, animated: true });
      }
    );
  };

  return (
    <>
      {width > 600 ? (
        <View
          style={{
            maxWidth: 240,
            width: 150,
            flexDirection: "row",
            overflow: "hidden",
          }}
        >
          <FlatList
            showsVerticalScrollIndicator={false}
            ref={flatListRef}
            data={props.items}
            style={{ flexShrink: 1 }}
            onScroll={handleScroll}
            renderItem={({ item, index }) => {
              const isMobile =
                Platform.OS === "ios" || Platform.OS === "android";

              const shouldRender =
                item.plattform === null ||
                item.plattform === Platform.OS ||
                (item.plattform === "mobile" && isMobile);

              if (!shouldRender) return null;
              return (
                <>
                  {index !== 0 ? <Divider style={{ marginRight: 4 }} /> : null}
                  <MenuItem
                    key={index}
                    leadingIcon={item.icon}
                    onPress={() => {
                      scrollToRef(item.ref);
                    }}
                  >
                    {item.title}
                  </MenuItem>
                </>
              );
            }}
          />
          <Divider style={{ width: 1, height: "100%", margin: 0 }} />
        </View>
      ) : (
        <View
          style={{
            padding: 8,
            paddingTop: 0,
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
              data={props.items}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ flexShrink: 1 }}
              onScroll={handleScroll}
              renderItem={({ item, index }) => {
                const isMobile =
                  Platform.OS === "ios" || Platform.OS === "android";

                const shouldRender =
                  item.plattform === null ||
                  item.plattform === Platform.OS ||
                  (item.plattform === "mobile" && isMobile);

                if (!shouldRender) return null;
                return (
                  <Chip
                    key={index}
                    icon={item.icon}
                    showSelectedOverlay={true}
                    onPress={() => {
                      scrollToRef(item.ref);
                    }}
                    style={styles.chip}
                  >
                    {item.title}
                  </Chip>
                );
              }}
            />
          </View>
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

export default SettingsQuickSelect;

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Chip, Divider, IconButton } from "react-native-paper";
import WebSpecific from "../../../infrastructure/platform/WebSpecific";
import AnimatedOpacityContainer from "../../../shared/components/container/AnimatedOpacityContainer";
import { MenuItem } from "./items/MenuItem";
import { useTheme } from "../../../app/providers/ThemeProvider";
import FolderType from "../model/FolderType";
import Animated, {
  clamp,
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { DraggableHandle } from "../../../shared/components/DraggableHandle";
import { get, set } from "../../../infrastructure/storage/store";
import { useTranslation } from "react-i18next";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
  selectedCard: boolean;
  setSelectedCard: (selectedCard: boolean) => void;
  selected2FA: boolean;
  setSelected2FA: (selected2FA: boolean) => void;
};

function FolderFilter(props: Props) {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const flatListRef: any = useRef<FlatList>(null);
  const [currentOffset, setCurrentOffset] = useState(0);

  const [showAddButton, setShowAddButton] = useState(false);

  const [sidebarWidth, setSidebarWidth] = useState(180);
  const MIN_W = 20;
  const MAX_W = 420;

  const handleResize = useCallback(
    (dx: number) => {
      setSidebarWidth((w) =>
        clamp(w + dx, MIN_W, Math.min(MAX_W, Math.max(MIN_W, width * 0.6)))
      );
    },
    [width]
  );

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

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const saved = await get("SIDEBAR_WIDTH");
        const clamped = clamp(
          saved ?? 180,
          MIN_W,
          Math.min(MAX_W, Math.max(MIN_W, width * 0.6))
        );
        if (isMounted) setSidebarWidth(clamped);
      } catch (e) {}
    })();
    return () => {
      isMounted = false;
    };
  }, [width]);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      set("SIDEBAR_WIDTH", sidebarWidth);
    }, 150);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [sidebarWidth]);

  return (
    <>
      {width > 600 ? (
        <View
          style={{
            maxWidth: Math.min(MAX_W, width * 0.6),
            width: sidebarWidth,
            minWidth: MIN_W,
            flexDirection: "row",
            paddingRight: 4,
            overflow: "hidden",
          }}
          onPointerEnter={() => setShowAddButton(true)}
          onPointerLeave={() => setShowAddButton(false)}
        >
          <FlatList
            showsVerticalScrollIndicator={false}
            ref={flatListRef}
            data={[...(props.folder ? props.folder : [])] as FolderType[]}
            style={{ flexShrink: 1 }}
            onScroll={handleScroll}
            renderItem={({ item, index }) => (
              <Animated.View layout={LinearTransition.duration(120)}>
                <Divider />
                <MenuItem
                  key={index}
                  leadingIcon={"folder"}
                  selected={props.selectedFolder?.id === item.id ? true : false}
                  onPress={() => {
                    props.setSelected2FA(false);
                    props.setSelectedCard(false);
                    if (props.selectedFolder != item) {
                      props.setSelectedFolder(item);
                    } else {
                      props.setSelectedFolder(null);
                    }
                  }}
                >
                  {item.name}
                </MenuItem>
              </Animated.View>
            )}
            ListHeaderComponent={
              <>
                <MenuItem
                  leadingIcon={"two-factor-authentication"}
                  selected={props.selected2FA}
                  onPress={() => {
                    props.setSelected2FA(!props.selected2FA);
                    props.setSelectedCard(false);
                    props.setSelectedFav(false);
                    props.setSelectedFolder(null);
                  }}
                >
                  {t("home:twofa")}
                </MenuItem>
                <Divider />
                <MenuItem
                  leadingIcon={"credit-card-multiple"}
                  selected={props.selectedCard}
                  onPress={() => {
                    props.setSelectedCard(!props.selectedCard);
                    props.setSelected2FA(false);
                    props.setSelectedFav(false);
                    props.setSelectedFolder(null);
                  }}
                >
                  {t("home:card")}
                </MenuItem>
                <Divider />
                <MenuItem
                  leadingIcon={"star"}
                  selected={props.selectedFav}
                  onPress={() => {
                    props.setSelectedFav(!props.selectedFav);
                    props.setSelected2FA(false);
                    props.setSelectedCard(false);
                  }}
                >
                  {t("home:favorite")}
                </MenuItem>
              </>
            }
            ListFooterComponent={
              <View
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
          <View
            style={{
              width: 1,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Divider style={{ width: 1, height: "100%" }} />
            <DraggableHandle
              onDeltaX={handleResize}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              }}
            />
          </View>
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
              data={[...(props.folder ? props.folder : [])] as FolderType[]}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ flexShrink: 1 }}
              onScroll={handleScroll}
              ListHeaderComponent={
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Chip
                    icon={() => null}
                    selected={props.selected2FA}
                    showSelectedOverlay={true}
                    onPress={() => {
                      props.setSelected2FA(!props.selected2FA);
                      props.setSelectedCard(false);
                      props.setSelectedFav(false);
                      props.setSelectedFolder(null);
                    }}
                    style={styles.chip}
                  >
                    <MaterialCommunityIcons
                      name="two-factor-authentication"
                      size={18}
                      color={theme.colors.primary}
                    />
                  </Chip>
                  <Chip
                    icon={() => null}
                    selected={props.selectedCard}
                    showSelectedOverlay={true}
                    onPress={() => {
                      props.setSelectedCard(!props.selectedCard);
                      props.setSelected2FA(false);
                      props.setSelectedFav(false);
                      props.setSelectedFolder(null);
                    }}
                    style={styles.chip}
                  >
                    <MaterialCommunityIcons
                      name="credit-card-multiple"
                      size={18}
                      color={theme.colors.primary}
                    />
                  </Chip>
                  <Chip
                    icon={() => null}
                    selected={props.selectedFav}
                    showSelectedOverlay={true}
                    onPress={() => {
                      props.setSelectedFav(!props.selectedFav);
                      props.setSelected2FA(false);
                      props.setSelectedCard(false);
                    }}
                    style={styles.chip}
                  >
                    <MaterialCommunityIcons
                      name="star"
                      size={18}
                      color={theme.colors.primary}
                    />
                  </Chip>
                </View>
              }
              renderItem={({ item, index }) => (
                <Animated.View layout={LinearTransition.duration(120)}>
                  <Chip
                    key={index}
                    icon={"folder"}
                    selected={props.selectedFolder == item ? true : false}
                    showSelectedOverlay={true}
                    onPress={() => {
                      props.setSelected2FA(false);
                      props.setSelectedCard(false);
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
                </Animated.View>
              )}
              ListFooterComponent={
                <View
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    icon={"plus"}
                    iconColor={theme.colors.primary}
                    style={{ marginLeft: 0, alignSelf: "center" }}
                    onPress={() => props.setFolderModalVisible(true)}
                    size={12}
                    mode="contained-tonal"
                    selected={true}
                  />
                </View>
              }
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

export default FolderFilter;

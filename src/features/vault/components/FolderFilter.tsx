import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Chip, Divider, IconButton } from "react-native-paper";
import AnimatedOpacityContainer from "../../../shared/components/container/AnimatedOpacityContainer";
import { MenuItem } from "../../../shared/components/menus/MenuItem";
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
import {
  getFolderColor,
  getFolderIcon,
} from "../utils/folderAppearance";

const styles = StyleSheet.create({
  chip: {
    marginRight: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  narrowScrollContainer: {
    flexBasis: "auto",
    flexShrink: 1,
    overflow: "hidden",
  },
  narrowScrollContainerWeb: {
    flex: 1,
    height: 32,
    minWidth: 0,
  },
  narrowList: {
    flexShrink: 1,
  },
  narrowListWeb: {
    flex: 1,
    height: 32,
    minWidth: 0,
  },
  narrowListContentWeb: {
    alignItems: "center",
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
  disabled?: boolean;
};

function FolderFilter(props: Props) {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const flatListRef: any = useRef<FlatList>(null);
  const horizontalOffsetRef = useRef(0);
  const horizontalTargetOffsetRef = useRef(0);
  const horizontalAnimationFrameRef = useRef<number | null>(null);
  const horizontalContentWidthRef = useRef(0);
  const horizontalViewportWidthRef = useRef(0);

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

  const getMaxHorizontalOffset = useCallback(
    () =>
      Math.max(
        0,
        horizontalContentWidthRef.current - horizontalViewportWidthRef.current
      ),
    []
  );

  const animateHorizontalScroll = useCallback(() => {
    const current = horizontalOffsetRef.current;
    const target = Math.min(
      horizontalTargetOffsetRef.current,
      getMaxHorizontalOffset()
    );
    const distance = target - current;

    if (Math.abs(distance) < 0.5) {
      horizontalOffsetRef.current = target;
      horizontalTargetOffsetRef.current = target;
      horizontalAnimationFrameRef.current = null;
      flatListRef.current?.scrollToOffset({ animated: false, offset: target });
      return;
    }

    const next = current + distance * 0.28;
    horizontalOffsetRef.current = next;
    flatListRef.current?.scrollToOffset({ animated: false, offset: next });
    horizontalAnimationFrameRef.current =
      window.requestAnimationFrame(animateHorizontalScroll);
  }, [getMaxHorizontalOffset]);

  const startSmoothHorizontalScroll = useCallback(
    (targetOffset: number) => {
      horizontalTargetOffsetRef.current = Math.min(
        Math.max(0, targetOffset),
        getMaxHorizontalOffset()
      );

      if (horizontalAnimationFrameRef.current === null) {
        horizontalAnimationFrameRef.current = window.requestAnimationFrame(
          animateHorizontalScroll
        );
      }
    },
    [animateHorizontalScroll, getMaxHorizontalOffset]
  );

  const handleHorizontalScroll = (event: any) => {
    const offset = event?.nativeEvent?.contentOffset?.x ?? 0;
    horizontalOffsetRef.current = offset;
    if (horizontalAnimationFrameRef.current === null) {
      horizontalTargetOffsetRef.current = offset;
    }
  };

  const handleHorizontalWheel = useCallback((event: any) => {
    if (Platform.OS !== "web") return;

    const nativeEvent = event?.nativeEvent ?? event;
    const deltaX = nativeEvent?.deltaX ?? 0;
    const deltaY = nativeEvent?.deltaY ?? 0;
    const rawDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
    const deltaMode = nativeEvent?.deltaMode ?? 0;
    const delta =
      deltaMode === 1
        ? rawDelta * 16
        : deltaMode === 2
          ? rawDelta * horizontalViewportWidthRef.current
          : rawDelta;
    if (!delta) return;

    nativeEvent?.preventDefault?.();
    startSmoothHorizontalScroll(horizontalTargetOffsetRef.current + delta);
  }, [startSmoothHorizontalScroll]);

  const horizontalWheelProps =
    Platform.OS === "web" ? ({ onWheel: handleHorizontalWheel } as any) : {};

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

  useEffect(
    () => () => {
      if (
        Platform.OS === "web" &&
        horizontalAnimationFrameRef.current !== null
      ) {
        window.cancelAnimationFrame(horizontalAnimationFrameRef.current);
      }
    },
    []
  );

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
            renderItem={({ item, index }) => (
              <Animated.View layout={LinearTransition.duration(120)}>
                <Divider />
                <MenuItem
                  key={index}
                  leadingIcon={getFolderIcon(item)}
                  leadingIconColor={getFolderColor(item) ?? theme.colors.primary}
                  selectedColor={getFolderColor(item) ?? undefined}
                  selected={props.selectedFolder?.id === item.id ? true : false}
                  onPress={props.disabled ? undefined : () => {
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
                onPress={props.disabled ? undefined : () => {
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
                  onPress={props.disabled ? undefined : () => {
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
                  onPress={props.disabled ? undefined : () => {
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
                    onPress={
                      props.disabled
                        ? undefined
                        : () => props.setFolderModalVisible(true)
                    }
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
            paddingTop: props.disabled ? 10 : 8,
            paddingBottom: 4,
            maxHeight: 50,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: props.disabled ? 4 : 0,
          }}
        >
          <View
            {...horizontalWheelProps}
            onLayout={(event) => {
              horizontalViewportWidthRef.current =
                event.nativeEvent.layout.width;
            }}
            style={[
              styles.narrowScrollContainer,
              Platform.OS === "web" && styles.narrowScrollContainerWeb,
            ]}
          >
            <FlatList
              ref={flatListRef}
              data={[...(props.folder ? props.folder : [])] as FolderType[]}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={[
                styles.narrowList,
                Platform.OS === "web" && styles.narrowListWeb,
              ]}
              contentContainerStyle={
                Platform.OS === "web" ? styles.narrowListContentWeb : undefined
              }
              onContentSizeChange={(contentWidth) => {
                horizontalContentWidthRef.current = contentWidth;
              }}
              scrollEventThrottle={16}
              onScroll={handleHorizontalScroll}
              ListHeaderComponent={
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Chip
                    icon={() => null}
                    selected={props.selected2FA}
                    showSelectedOverlay={true}
                    onPress={props.disabled ? undefined : () => {
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
                    onPress={props.disabled ? undefined : () => {
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
                    onPress={props.disabled ? undefined : () => {
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
                    icon={() => (
                      <MaterialCommunityIcons
                        name={getFolderIcon(item)}
                        size={18}
                        color={getFolderColor(item) ?? theme.colors.primary}
                      />
                    )}
                    selected={props.selectedFolder == item ? true : false}
                    showSelectedOverlay={true}
                    onPress={props.disabled ? undefined : () => {
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
                    onPress={
                      props.disabled
                        ? undefined
                        : () => props.setFolderModalVisible(true)
                    }
                    size={12}
                    mode="contained-tonal"
                    selected={true}
                  />
                </View>
              }
            />
          </View>
        </View>
      )}
    </>
  );
}

export default FolderFilter;

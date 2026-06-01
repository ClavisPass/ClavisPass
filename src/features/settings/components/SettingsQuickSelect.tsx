import React, { useCallback, useEffect, useRef } from "react";
import {
  findNodeHandle,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  UIManager,
  useWindowDimensions,
  View,
} from "react-native";
import { Chip, Divider } from "react-native-paper";
import { MenuItem } from "../../../shared/components/menus/MenuItem";
import QuickSelectItem from "../model/QuickSelectItem";
import { logger } from "../../../infrastructure/logging/logger";

const styles = StyleSheet.create({
  chip: {
    marginRight: 4,
    borderRadius: 12,
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
  items: QuickSelectItem[];
  scrollRef: React.RefObject<ScrollView | null>;
};

function SettingsQuickSelect(props: Props) {
  const { width } = useWindowDimensions();

  const flatListRef: any = useRef<FlatList>(null);
  const horizontalOffsetRef = useRef(0);
  const horizontalTargetOffsetRef = useRef(0);
  const horizontalAnimationFrameRef = useRef<number | null>(null);
  const horizontalContentWidthRef = useRef(0);
  const horizontalViewportWidthRef = useRef(0);

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

  const handleHorizontalWheel = useCallback(
    (event: any) => {
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
    },
    [startSmoothHorizontalScroll]
  );

  const horizontalWheelProps =
    Platform.OS === "web" ? ({ onWheel: handleHorizontalWheel } as any) : {};

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
      logger.warn("ScrollView oder Ziel-Element nicht gefunden");
      return;
    }

    UIManager.measureLayout(
      targetNode,
      scrollViewNode,
      () => {
        logger.warn("Layout messen fehlgeschlagen");
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
            maxWidth: 280,
            width: 180,
            flexDirection: "row",
            overflow: "hidden",
          }}
        >
          <FlatList
            showsVerticalScrollIndicator={false}
            ref={flatListRef}
            data={props.items}
            style={{ flexShrink: 1 }}
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
                  {index !== 0 ? <Divider /> : null}
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
              data={props.items}
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
        </View>
      )}
    </>
  );
}

export default SettingsQuickSelect;

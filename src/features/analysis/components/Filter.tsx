import React, { memo, useRef } from "react";
import { View, FlatList, Dimensions, StyleSheet, Platform } from "react-native";
import { Chip, Divider, IconButton } from "react-native-paper";
import WebSpecific from "../../../infrastructure/platform/WebSpecific";
import { MenuItem } from "../../../shared/components/menus/MenuItem";

type RiskBucket = "all" | "itemsToFix" | "reused" | "weak" | "similar";
type FilterItem = { key: RiskBucket; title: string };

const styles = StyleSheet.create({
  chip: {
    marginRight: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
});

type FiltersNarrowProps = {
  filterItems: FilterItem[];
  bucket: RiskBucket;
  setBucket: (b: RiskBucket) => void;
};

export const FiltersNarrow = memo(function FiltersNarrow({
  filterItems,
  bucket,
  setBucket,
}: FiltersNarrowProps) {
  const filterListRef = useRef<FlatList<FilterItem>>(null);
  const filterOffsetRef = useRef(0);

  const onFilterScrollEnd = (event: any) => {
    const x = event?.nativeEvent?.contentOffset?.x ?? 0;
    filterOffsetRef.current = x;
  };

  const scrollFiltersTo = (offset: number) => {
    const next = Math.max(0, offset);
    filterOffsetRef.current = next;
    filterListRef.current?.scrollToOffset({ animated: true, offset: next });
  };

  const change = (direction: "+" | "-") => {
    const { width } = Dimensions.get("window");
    const step = Math.max(120, width - 140);
    const cur = filterOffsetRef.current ?? 0;
    const next = direction === "+" ? cur + step : cur - step;
    scrollFiltersTo(next);
  };

  return (
    <View
      style={{
        marginHorizontal: 8,
        marginTop: 8,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <WebSpecific>
        <IconButton icon="chevron-left" style={{ margin: 0 }} onPress={() => change("-")} size={12} />
      </WebSpecific>

      <View style={{ flexShrink: 1, overflow: "hidden" }}>
        <FlatList
          ref={filterListRef}
          data={filterItems}
          horizontal
          keyExtractor={(it) => it.key}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScrollEndDrag={onFilterScrollEnd}
          onMomentumScrollEnd={onFilterScrollEnd}
          renderItem={({ item }) => (
            <Chip
              icon={() => null}
              selected={bucket === item.key}
              showSelectedOverlay
              onPress={() => setBucket(item.key)}
              style={styles.chip}
            >
              {item.title}
            </Chip>
          )}
        />
      </View>

      <WebSpecific>
        <IconButton icon="chevron-right" style={{ margin: 0 }} onPress={() => change("+")} size={12} />
      </WebSpecific>
    </View>
  );
});

type FiltersWideProps = {
  filterItems: FilterItem[];
  bucket: RiskBucket;
  setBucket: (b: RiskBucket) => void;
};

export const FiltersWide = memo(function FiltersWide({
  filterItems,
  bucket,
  setBucket,
}: FiltersWideProps) {
  return (
    <View style={{ marginTop: 8, borderRadius: 12, overflow: "hidden" }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filterItems}
        keyExtractor={(it) => it.key}
        renderItem={({ item, index }) => (
          <>
            {index !== 0 ? <Divider /> : null}
            <MenuItem selected={bucket === item.key} onPress={() => setBucket(item.key)}>
              {item.title}
            </MenuItem>
          </>
        )}
      />
    </View>
  );
});

import React, { memo } from "react";
import { View, FlatList, StyleSheet, Platform } from "react-native";
import { Divider } from "react-native-paper";
import { MenuItem } from "../../../shared/components/menus/MenuItem";
import AppChip from "../../../shared/components/chips/AppChip";

type FilterItem = { key: string; title: string };

const styles = StyleSheet.create({
  chip: {
    borderRadius: 12,
    overflow: "hidden",
  },
  filterList: {
    flexGrow: 0,
    minWidth: 0,
    width: "100%",
  },
  filterListContent: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  filterSeparator: {
    width: 8,
  },
});

type FiltersNarrowProps = {
  filterItems: FilterItem[];
  bucket: string;
  setBucket: (b: string) => void;
};

export const FiltersNarrow = memo(function FiltersNarrow({
  filterItems,
  bucket,
  setBucket,
}: FiltersNarrowProps) {
  return (
    <View
      style={{
        width: "100%",
      }}
    >
      <FlatList
        data={filterItems}
        horizontal
        keyExtractor={(it) => it.key}
        showsHorizontalScrollIndicator={Platform.OS === "web"}
        style={styles.filterList}
        contentContainerStyle={styles.filterListContent}
        ItemSeparatorComponent={() => <View style={styles.filterSeparator} />}
        renderItem={({ item }) => (
          <AppChip
            icon={() => null}
            selected={bucket === item.key}
            showSelectedOverlay
            onPress={() => setBucket(item.key)}
            style={styles.chip}
          >
            {item.title}
          </AppChip>
        )}
      />
    </View>
  );
});

type FiltersWideProps = {
  filterItems: FilterItem[];
  bucket: string;
  setBucket: (b: string) => void;
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

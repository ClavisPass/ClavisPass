import React from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Divider, IconButton } from "react-native-paper";
import { useTranslation } from "react-i18next";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";

import { useOnline } from "../../../../app/providers/OnlineProvider";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import { useVault } from "../../../../app/providers/VaultProvider";

import Menu from "../../../../shared/components/menus/Menu";
import { MenuItem } from "../../../../shared/components/menus/MenuItem";

const ITEM_HEIGHT = 44;

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;

  // Web: Menu positioning
  positionY: number;

  openEditFolder: () => void; // aktuell nicht genutzt
  refreshData: () => void;

  // Native sizing
  nativeSnapPoints?: (string | number)[];
};

function HomeFilterMenu(props: Props) {
  const { theme } = useTheme();
  const vault = useVault();
  const { isOnline } = useOnline();
  const { t } = useTranslation();
  const { height: winH } = useWindowDimensions();

  // -----------------------------
  // Shared: sort state + actions
  // -----------------------------
  const [sortByTitleMode, setSortByTitleMode] = React.useState<"asc" | "desc">(
    "asc"
  );
  const [sortByTitleIcon, setSortByTitleIcon] = React.useState<
    "sort-alphabetical-ascending" | "sort-alphabetical-descending"
  >("sort-alphabetical-ascending");

  const [sortByCreatedMode, setSortByCreatedMode] = React.useState<
    "asc" | "desc"
  >("asc");
  const [sortByCreatedIcon, setSortByCreatedIcon] = React.useState<
    "sort-bool-ascending-variant" | "sort-bool-descending-variant"
  >("sort-bool-ascending-variant");

  const [sortByLastUpdatedMode, setSortByLastUpdatedMode] = React.useState<
    "asc" | "desc"
  >("asc");
  const [sortByLastUpdatedIcon, setSortByLastUpdatedIcon] = React.useState<
    "sort-clock-ascending" | "sort-clock-descending"
  >("sort-clock-ascending");

  const close = React.useCallback(() => {
    props.setVisible(false);
  }, [props]);

  const sortByTitle = (sort: "asc" | "desc") => {
    if (!vault.isUnlocked) return;

    vault.update((draft) => {
      const values = [...(draft.values ?? [])];
      values.sort((a, b) =>
        sort === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      );
      draft.values = values;
    });

    if (sort === "asc") {
      setSortByTitleMode("desc");
      setSortByTitleIcon("sort-alphabetical-descending");
    } else {
      setSortByTitleMode("asc");
      setSortByTitleIcon("sort-alphabetical-ascending");
    }
  };

  const sortByCreated = (sort: "asc" | "desc") => {
    if (!vault.isUnlocked) return;

    vault.update((draft) => {
      const values = [...(draft.values ?? [])];
      values.sort((a, b) => {
        const aDate = new Date(a.created).getTime();
        const bDate = new Date(b.created).getTime();
        return sort === "asc" ? aDate - bDate : bDate - aDate;
      });
      draft.values = values;
    });

    if (sort === "asc") {
      setSortByCreatedMode("desc");
      setSortByCreatedIcon("sort-bool-descending-variant");
    } else {
      setSortByCreatedMode("asc");
      setSortByCreatedIcon("sort-bool-ascending-variant");
    }
  };

  const sortByLastUpdated = (sort: "asc" | "desc") => {
    if (!vault.isUnlocked) return;

    vault.update((draft) => {
      const values = [...(draft.values ?? [])];
      values.sort((a, b) => {
        const aDate = new Date(a.lastUpdated).getTime();
        const bDate = new Date(b.lastUpdated).getTime();
        return sort === "asc" ? aDate - bDate : bDate - aDate;
      });
      draft.values = values;
    });

    if (sort === "asc") {
      setSortByLastUpdatedMode("desc");
      setSortByLastUpdatedIcon("sort-clock-descending");
    } else {
      setSortByLastUpdatedMode("asc");
      setSortByLastUpdatedIcon("sort-clock-ascending");
    }
  };

  const entryCount = vault.entries.length;

  // -----------------------------
  // WEB: keep the old dropdown Menu
  // -----------------------------
  if (Platform.OS === "web") {
    return (
      <Menu
        visible={props.visible}
        onDismiss={close}
        positionY={props.positionY}
      >
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <MenuItem>{`${entryCount} ${t("home:entries")}`}</MenuItem>
            <IconButton
              disabled={!isOnline}
              icon="refresh"
              size={20}
              iconColor={theme.colors.primary}
              onPress={() => {
                props.refreshData();
                close();
              }}
            />
          </View>

          <Divider />

          <MenuItem
            leadingIcon={sortByTitleIcon}
            onPress={() => {
              sortByTitle(sortByTitleMode);
              close();
            }}
          >
            {t("home:sortByTitle")}
          </MenuItem>

          <Divider />

          <MenuItem
            leadingIcon={sortByCreatedIcon}
            onPress={() => {
              sortByCreated(sortByCreatedMode);
              close();
            }}
          >
            {t("home:sortByCreated")}
          </MenuItem>

          <Divider />

          <MenuItem
            leadingIcon={sortByLastUpdatedIcon}
            onPress={() => {
              sortByLastUpdated(sortByLastUpdatedMode);
              close();
            }}
          >
            {t("home:sortByLastUpdated")}
          </MenuItem>
        </>
      </Menu>
    );
  }

  // -----------------------------
  // NATIVE: BottomSheet with backdrop
  // -----------------------------
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const snapPoints = React.useMemo<(string | number)[]>(() => {
    if (props.nativeSnapPoints?.length) return props.nativeSnapPoints;

    // Header + Divider + 3 Items + Bottom padding
    const desired = 72 + ITEM_HEIGHT * 3 + 80;
    const max = Math.min(winH * 0.7, 520);
    return [Math.min(desired, max)];
  }, [props.nativeSnapPoints, winH]);

  React.useEffect(() => {
    if (props.visible) bottomSheetModalRef.current?.present();
    else bottomSheetModalRef.current?.dismiss();
  }, [props.visible]);

  const closeSheet = React.useCallback(() => {
    close();
    bottomSheetModalRef.current?.dismiss();
  }, [close]);

  const renderBackdrop = React.useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  const SheetItem = React.useCallback(
    ({
      icon,
      label,
      onPress,
      withDivider = true,
    }: {
      icon: any;
      label: string;
      onPress: () => void;
      withDivider?: boolean;
    }) => (
      <View>
        <MenuItem
          leadingIcon={icon}
          onPress={() => {
            onPress();
            closeSheet();
          }}
        >
          {label}
        </MenuItem>
        {withDivider ? (
          <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />
        ) : null}
      </View>
    ),
    [closeSheet, theme.colors.outlineVariant]
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      enableDismissOnClose
      stackBehavior="replace"
      backdropComponent={renderBackdrop}
      onDismiss={() => {
        if (props.visible) close();
      }}
      style={{
        borderColor: theme.colors.outlineVariant,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderRadius: 0,
      }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.primary }}
      backgroundStyle={{
        backgroundColor: theme.colors.background,
        borderRadius: 0,
      }}
    >
      <BottomSheetView style={{ paddingBottom: 60 }}>
        <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />

        <View
          style={{
            paddingRight: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MenuItem>{`${entryCount} ${t("home:entries")}`}</MenuItem>

          <IconButton
            disabled={!isOnline}
            icon="refresh"
            size={20}
            iconColor={theme.colors.primary}
            onPress={() => {
              props.refreshData();
              closeSheet();
            }}
          />
        </View>

        <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />

        <SheetItem
          icon={sortByTitleIcon}
          label={t("home:sortByTitle")}
          onPress={() => sortByTitle(sortByTitleMode)}
        />

        <SheetItem
          icon={sortByCreatedIcon}
          label={t("home:sortByCreated")}
          onPress={() => sortByCreated(sortByCreatedMode)}
        />

        <SheetItem
          icon={sortByLastUpdatedIcon}
          label={t("home:sortByLastUpdated")}
          onPress={() => sortByLastUpdated(sortByLastUpdatedMode)}
          withDivider={false}
        />

        <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

export default HomeFilterMenu;

import React from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useOnline } from "../../../../app/providers/OnlineProvider";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import { useVault } from "../../../../app/providers/VaultProvider";

import AdaptiveMenu, {
  AdaptiveMenuItem,
} from "../../../../shared/components/menus/AdaptiveMenu";
import { MenuItem } from "../../../../shared/components/menus/MenuItem";

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

  const items = React.useMemo<AdaptiveMenuItem[]>(
    () => [
      {
        key: "sort-title",
        icon: sortByTitleIcon,
        label: t("home:sortByTitle"),
        onPress: () => sortByTitle(sortByTitleMode),
      },
      {
        key: "sort-created",
        icon: sortByCreatedIcon,
        label: t("home:sortByCreated"),
        onPress: () => sortByCreated(sortByCreatedMode),
      },
      {
        key: "sort-updated",
        icon: sortByLastUpdatedIcon,
        label: t("home:sortByLastUpdated"),
        onPress: () => sortByLastUpdated(sortByLastUpdatedMode),
        withDivider: false,
      },
    ],
    [
      sortByCreatedIcon,
      sortByCreatedMode,
      sortByLastUpdatedIcon,
      sortByLastUpdatedMode,
      sortByTitleIcon,
      sortByTitleMode,
      t,
    ]
  );

  const topContent = (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <MenuItem>{`${entryCount} ${t("home:entries")}`}</MenuItem>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 1,
            height: 24,
            backgroundColor: theme.colors.outlineVariant,
            opacity: 0.7,
          }}
        />
        <IconButton
        style={{ marginLeft: 20, marginRight: 20 }}
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
    </View>
  );

  return (
    <AdaptiveMenu
      visible={props.visible}
      setVisible={props.setVisible}
      positionY={props.positionY}
      nativeSnapPoints={props.nativeSnapPoints}
      topContent={topContent}
      items={items}
    />
  );
}

export default HomeFilterMenu;

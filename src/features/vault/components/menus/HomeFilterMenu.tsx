import React from "react";
import { Divider, IconButton } from "react-native-paper";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import Menu from "../../../../shared/components/menus/Menu";
import { MenuItem } from "../../../../shared/components/menus/MenuItem";
import { useOnline } from "../../../../app/providers/OnlineProvider";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import { useVault } from "../../../../app/providers/VaultProvider";


type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  positionY: number;
  openEditFolder: () => void;
  refreshData: () => void;
};

function HomeFilterMenu(props: Props) {
  const { theme } = useTheme();
  const vault = useVault();
  const { isOnline } = useOnline();
  const { t } = useTranslation();

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

  const sortByTitle = (sort: "asc" | "desc") => {
    if (!vault.isUnlocked) return;

    vault.update((draft) => {
      const values = [...(draft.values ?? [])];
      values.sort((a, b) => {
        if (sort === "asc") return a.title.localeCompare(b.title);
        return b.title.localeCompare(a.title);
      });
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

  return (
    <Menu
      visible={props.visible}
      onDismiss={() => {
        props.setVisible(false);
      }}
      positionY={props.positionY}
    >
      <>
        <View
          style={{
            display: "flex",
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
              props.setVisible(false);
            }}
          />
        </View>

        <Divider />

        <MenuItem
          leadingIcon={sortByTitleIcon}
          onPress={() => {
            sortByTitle(sortByTitleMode);
          }}
        >
          {t("home:sortByTitle")}
        </MenuItem>

        <Divider />

        <MenuItem
          leadingIcon={sortByCreatedIcon}
          onPress={() => {
            sortByCreated(sortByCreatedMode);
          }}
        >
          {t("home:sortByCreated")}
        </MenuItem>

        <Divider />

        <MenuItem
          leadingIcon={sortByLastUpdatedIcon}
          onPress={() => {
            sortByLastUpdated(sortByLastUpdatedMode);
          }}
        >
          {t("home:sortByLastUpdated")}
        </MenuItem>
      </>
    </Menu>
  );
}

export default HomeFilterMenu;
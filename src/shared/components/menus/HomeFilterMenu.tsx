import React from "react";
import { Divider, IconButton } from "react-native-paper";
import DataType from "../../../features/vault/model/DataType";
import { View } from "react-native";
import Menu from "./Menu";
import { useData } from "../../../app/providers/DataProvider";
import { MenuItem } from "../../../features/vault/components/items/MenuItem";
import { useOnline } from "../../../app/providers/OnlineProvider";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../app/providers/ThemeProvider";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  data: DataType;
  setData: (data: DataType) => void;
  positionY: number;
  openEditFolder: () => void;
  refreshData: () => void;
};
function HomeFilterMenu(props: Props) {
  const { theme } = useTheme();
  const data = useData();
  const { isOnline } = useOnline();
  const { t } = useTranslation();

  const [sortByTitleMode, setSortByTitleMode] = React.useState<"asc" | "desc">("asc");
  const [sortByTitleIcon, setSortByTitleIcon] = React.useState<"sort-alphabetical-ascending" | "sort-alphabetical-descending">("sort-alphabetical-ascending");

  const [sortByCreatedMode, setSortByCreatedMode] = React.useState<"asc" | "desc">("asc");
  const [sortByCreatedIcon, setSortByCreatedIcon] = React.useState<"sort-bool-ascending-variant" | "sort-bool-descending-variant">("sort-bool-ascending-variant");

  const [sortByLastUpdatedMode, setSortByLastUpdatedMode] = React.useState<"asc" | "desc">("asc");
  const [sortByLastUpdatedIcon, setSortByLastUpdatedIcon] = React.useState<"sort-clock-ascending" | "sort-clock-descending">("sort-clock-ascending");

  const sortByTitle = (sort: "asc" | "desc") => {
    let newData = { ...props.data } as DataType;
    if (newData) {
      newData.values = newData.values.sort(function (a, b) {
        if (sort == "asc") {
          if (a.title < b.title) {
            return -1;
          }
          if (a.title > b.title) {
            return 1;
          }
        }
        if (sort == "desc") {
          if (a.title > b.title) {
            return -1;
          }
          if (a.title < b.title) {
            return 1;
          }
        }

        return 0;
      });

      if (sort == "asc") {
        setSortByTitleMode("desc");
        setSortByTitleIcon("sort-alphabetical-descending");
      } else {
        setSortByTitleMode("asc");
        setSortByTitleIcon("sort-alphabetical-ascending");
      }
      props.setData(newData);
    }
  };

  const sortByCreated = (sort: "asc" | "desc") => {
    let newData = { ...props.data } as DataType;
    if (newData) {
      newData.values = newData.values.sort(function (a, b) {
        let aDate = new Date(a.created);
        let bDate = new Date(b.created);
        if (sort == "asc") {
          if (aDate < bDate) {
            return -1;
          }
          if (aDate > bDate) {
            return 1;
          }
        }
        if (sort == "desc") {
          if (aDate > bDate) {
            return -1;
          }
          if (aDate < bDate) {
            return 1;
          }
        }

        return 0;
      });
      if (sort == "asc") {
        setSortByCreatedMode("desc");
        setSortByCreatedIcon("sort-bool-descending-variant");
      } else {
        setSortByCreatedMode("asc");
        setSortByCreatedIcon("sort-bool-ascending-variant");
      }
      props.setData(newData);
    }
  };

  const sortByLastUpdated = (sort: "asc" | "desc") => {
    let newData = { ...props.data } as DataType;
    if (newData) {
      newData.values = newData.values.sort(function (a, b) {
        let aDate = new Date(a.lastUpdated);
        let bDate = new Date(b.lastUpdated);
        if (sort == "asc") {
          if (aDate < bDate) {
            return -1;
          }
          if (aDate > bDate) {
            return 1;
          }
        }
        if (sort == "desc") {
          if (aDate > bDate) {
            return -1;
          }
          if (aDate < bDate) {
            return 1;
          }
        }

        return 0;
      });
      if (sort == "asc") {
        setSortByLastUpdatedMode("desc");
        setSortByLastUpdatedIcon("sort-clock-descending");
      } else {
        setSortByLastUpdatedMode("asc");
        setSortByLastUpdatedIcon("sort-clock-ascending");
      }
      props.setData(newData);
    }
  };

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
          <MenuItem>{`${props.data?.values.length} ${t("home:entries")}`}</MenuItem>
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
            data.setShowSave(true);
          }}
        >
          {t("home:sortByTitle")}
        </MenuItem>
        <Divider />
        <MenuItem
          leadingIcon={sortByCreatedIcon}
          onPress={() => {
            sortByCreated(sortByCreatedMode);
            data.setShowSave(true);
          }}
        >
          {t("home:sortByCreated")}
        </MenuItem>
        <Divider />
        <MenuItem
          leadingIcon={sortByLastUpdatedIcon}
          onPress={() => {
            sortByLastUpdated(sortByLastUpdatedMode);
            data.setShowSave(true);
          }}
        >
          {t("home:sortByLastUpdated")}
        </MenuItem>
      </>
    </Menu>
  );
}

export default HomeFilterMenu;

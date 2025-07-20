import React from "react";
import { Divider, IconButton } from "react-native-paper";
import DataType from "../../types/DataType";
import { View } from "react-native";
import theme from "../../ui/theme";
import Menu from "./Menu";
import { useData } from "../../contexts/DataProvider";
import { MenuItem } from "../items/MenuItem";

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
  const data = useData();

  const sort = (sort: "asc" | "desc") => {
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
      props.setData(newData);
    }
  };

  const sortCreated = (sort: "asc" | "desc") => {
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
      props.setData(newData);
    }
  };

  const sortLastUpdated = (sort: "asc" | "desc") => {
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
          <MenuItem>{props.data?.values.length + " Entries"}</MenuItem>
          <IconButton
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
          leadingIcon="sort-ascending"
          onPress={() => {
            sort("asc");
            data.setShowSave(true);
            props.setVisible(false);
          }}
        >
          {"Sort Ascending"}
        </MenuItem>
        <Divider />
        <MenuItem
          leadingIcon="sort-descending"
          onPress={() => {
            sort("desc");
            data.setShowSave(true);
            props.setVisible(false);
          }}
        >
          {"Sort Descending"}
        </MenuItem>
        <Divider />
        <MenuItem
          leadingIcon="sort-clock-ascending"
          onPress={() => {
            sortCreated("asc");
            data.setShowSave(true);
            props.setVisible(false);
          }}
        >
          {"Created"}
        </MenuItem>
        <Divider />
        <MenuItem
          leadingIcon="sort-clock-ascending"
          onPress={() => {
            sortLastUpdated("asc");
            data.setShowSave(true);
            props.setVisible(false);
          }}
        >
          {"Last Updated"}
        </MenuItem>
      </>
    </Menu>
  );
}

export default HomeFilterMenu;

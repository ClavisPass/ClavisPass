import React from "react";
import { Divider, IconButton } from "react-native-paper";
import { useAuth } from "../../contexts/AuthProvider";
import DataType from "../../types/DataType";
import { View } from "react-native";
import theme from "../../ui/theme";
import Menu, { MenuItem } from "./Menu";
import { useData } from "../../contexts/DataProvider";

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
  const auth = useAuth();
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
        {/* 
        <MenuItem
          leadingIcon="folder-outline"
          onPress={() => {
            props.openEditFolder();
            props.setVisible(false);
          }}
        >
          {"Add/Edit Folder"}
        </MenuItem>
        */}
        <MenuItem
          leadingIcon="sort-ascending"
          onPress={() => {
            sort("asc");
            data.setShowSave(true);
            props.setVisible(false);
          }}
        >
          {"sort ascending"}
        </MenuItem>
        <MenuItem
          leadingIcon="sort-descending"
          onPress={() => {
            sort("desc");
            data.setShowSave(true);
            props.setVisible(false);
          }}
        >
          {"sort descending"}
        </MenuItem>
        <Divider />
        <MenuItem leadingIcon="logout" onPress={auth.logout}>
          {"Logout"}
        </MenuItem>
      </>
    </Menu>
  );
}

export default HomeFilterMenu;

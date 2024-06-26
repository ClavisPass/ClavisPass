import { useState } from "react";
import { Divider, IconButton, Menu } from "react-native-paper";
import { ValuesListType } from "../../types/ValuesType";
import { useAuth } from "../../contexts/AuthProvider";
import DataType from "../../types/DataType";
import { ModuleType } from "../../types/ModulesType";
import ModulesEnum from "../../enums/ModulesEnum";

type Props = {
  data: DataType;
  setData: (data: DataType) => void;
};
function HomeFilterMenu(props: Props) {
  const auth = useAuth();
  const [showMenu, setShowMenu] = useState(false);

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
      contentStyle={{
        backgroundColor: "white",
        borderRadius: 22,
        borderTopRightRadius: 4,
      }}
      style={{ backgroundColor: "transparent", borderRadius: 22 }}
      elevation={2}
      visible={showMenu}
      onDismiss={() => {
        setShowMenu(false);
      }}
      anchorPosition={"bottom"}
      anchor={
        <IconButton
          icon="sort-variant"
          size={25}
          onPress={() => {
            setShowMenu(true);
          }}
          iconColor="white"
        />
      }
    >
      <Menu.Item
        style={{
          cursor: "auto",
          borderTopLeftRadius: 22,
          borderTopRightRadius: 4,
          backgroundColor: "white",
        }}
        title={props.data?.values.length + " Entries"}
      />
      <Divider />
      <Menu.Item
        style={{
          backgroundColor: "white",
        }}
        leadingIcon="sort-ascending"
        onPress={() => {
          sort("asc");
          setShowMenu(false);
        }}
        title="sort ascending"
      />
      <Menu.Item
        style={{
          backgroundColor: "white",
        }}
        leadingIcon="sort-descending"
        onPress={() => {
          sort("desc");
          setShowMenu(false);
        }}
        title="sort descending"
      />
      <Divider />
      <Menu.Item
        style={{
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          backgroundColor: "white",
        }}
        leadingIcon="logout"
        onPress={auth.logout}
        title="Logout"
      />
    </Menu>
  );
}

export default HomeFilterMenu;

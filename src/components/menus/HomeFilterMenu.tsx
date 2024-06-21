import { useState } from "react";
import { Divider, IconButton, Menu } from "react-native-paper";
import { ValuesListType } from "../../types/ValuesType";
import { useAuth } from "../../contexts/AuthProvider";

type Props = {
  values?: ValuesListType;
  sort: (sort: "asc" | "desc") => void;
};
function HomeFilterMenu(props: Props) {
  const auth = useAuth();
  const [showMenu, setShowMenu] = useState(false);
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
        title={props.values?.length + " Entries"}
      />
      <Divider />
      <Menu.Item
        style={{
          backgroundColor: "white",
        }}
        leadingIcon="sort-ascending"
        onPress={() => {
          props.sort("asc");
        }}
        title="sort ascending"
      />
      <Menu.Item
        style={{
          backgroundColor: "white",
        }}
        leadingIcon="sort-descending"
        onPress={() => {
          props.sort("desc");
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

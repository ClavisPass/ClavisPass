import { useState } from "react";
import { Divider, IconButton, Menu } from "react-native-paper";
import { ValuesListType } from "../../types/ValuesType";
import theme from "../../ui/theme";
import { formatDateTime } from "../../utils/Timestamp";

type Props = {
  created: string;
  lastUpdated: string;
};
function EditMetaInfMenu(props: Props) {
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
          icon="dots-vertical"
          size={20}
          iconColor={theme.colors.primary}
          onPress={() => {
            setShowMenu(true);
          }}
        />
      }
    >
      <Menu.Item
        style={{
          borderTopLeftRadius: 22,
          borderTopRightRadius: 4,
          backgroundColor: "white",
        }}
        leadingIcon={"folder"}
        title={"change Folder"}
        onPress={() => {}}
      />
      <Divider />
      <Menu.Item
        style={{
          backgroundColor: "white",
        }}
        title={"created: " + formatDateTime(props.created)}
      />
      <Menu.Item
        style={{
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          backgroundColor: "white",
        }}
        title={"last updated: " + formatDateTime(props.lastUpdated)}
      />
    </Menu>
  );
}

export default EditMetaInfMenu;

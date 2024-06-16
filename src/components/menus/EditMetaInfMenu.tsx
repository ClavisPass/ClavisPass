import { useState } from "react";
import { Divider, IconButton, Menu } from "react-native-paper";
import theme from "../../ui/theme";
import { formatDateTime } from "../../utils/Timestamp";
import { View } from "react-native";

type Props = {
  created: string;
  lastUpdated: string;
  folder: string;
};
function EditMetaInfMenu(props: Props) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <Menu
      testID="1234"
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
      <View style={{ display: "flex", flexDirection: "row" }}>
        <Menu.Item
          style={{
            flexGrow: 1,
            borderTopLeftRadius: 22,
            borderTopRightRadius: 4,
            backgroundColor: "white",
            cursor: "auto",
          }}
          leadingIcon={"folder"}
          title={props.folder === "" ? "None" : props.folder}
        />
        <IconButton
          icon="pencil"
          size={20}
          iconColor={theme.colors.primary}
          onPress={() => {
            //setShowMenu(true);
          }}
        />
      </View>
      <Divider />
      <Menu.Item
        style={{
          backgroundColor: "white",
          cursor: "auto",
        }}
        title={"created: " + formatDateTime(props.created)}
      />
      <Menu.Item
        style={{
          cursor: "auto",
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

import { ReactNode, useState } from "react";
import { Divider } from "react-native-paper";
import { formatDateTime } from "../../utils/Timestamp";
import { View } from "react-native";
import Menu, { MenuItem } from "./Menu";
import { useData } from "../../contexts/DataProvider";
import ValuesType from "../../types/ValuesType";
import DataType from "../../types/DataType";
import DeleteModal from "../modals/DeleteModal";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setFolderModalVisible: (visible: boolean) => void;
  created: string;
  lastUpdated: string;
  value: ValuesType;
  folderList: string[];
  favButton: ReactNode;
  positionY: number;
  goBack: () => void;
};
function EditMetaInfMenu(props: Props) {
  const data = useData();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const deleteValue = (id: string) => {
    let newData = { ...data.data } as DataType;
    let valueToChange: any = newData?.values?.filter(
      (item: ValuesType) => item.id !== id
    );
    if (newData) {
      newData.values = valueToChange;
      data.setData(newData);
    }
    props.setVisible(false);
    props.goBack();
  };

  return (
    <>
      <Menu
        visible={props.visible}
        onDismiss={() => {
          props.setVisible(false);
        }}
        positionY={props.positionY}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MenuItem
            leadingIcon={"folder-outline"}
            onPress={() => {
              props.setFolderModalVisible(true);
            }}
          >
            {props.value.folder === "" ? "None" : props.value.folder}
          </MenuItem>
          {props.favButton}
        </View>
        <Divider />
        <MenuItem>{"created: " + formatDateTime(props.created)}</MenuItem>
        <MenuItem>
          {"last updated: " + formatDateTime(props.lastUpdated)}
        </MenuItem>
        <Divider />
        <MenuItem
          leadingIcon={"delete-outline"}
          onPress={() => {
            setDeleteModalVisible(true);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
      <DeleteModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onDelete={() => {
          deleteValue(props.value.id);
        }}
      />
    </>
  );
}

export default EditMetaInfMenu;

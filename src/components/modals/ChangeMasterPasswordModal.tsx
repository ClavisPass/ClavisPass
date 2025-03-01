import { View } from "react-native";
import Modal from "./Modal";
import { useData } from "../../contexts/DataProvider";
import { useState } from "react";
import PasswordTextbox from "../PasswordTextbox";
import { Text } from "react-native-paper";
import Button from "../buttons/Button";
import { useTheme } from "../../contexts/ThemeProvider";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

function ChangeMasterPasswordModal(props: Props) {
  const data = useData();
  const { theme } = useTheme();

  const [passwordConfirmed, setPasswordConfirmed] = useState(false);

  const [capsLock, setCapsLock] = useState(false);

  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");

  const hideModal = () => props.setVisible(false);

  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <View
        style={{
          padding: 16,
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          height: 350,
          width: 300,
          cursor: "auto",
        }}
      >
        {passwordConfirmed ? (
          <>
            <PasswordTextbox
              autofocus
              setValue={setValue}
              value={value}
              placeholder="New Master Password"
            />
            <PasswordTextbox
              setValue={setValue2}
              value={value2}
              placeholder="Reenter Master Password"
            />
            <Button text={"Set Password"} onPress={() => {}}></Button>
          </>
        ) : (
          <>
            <PasswordTextbox
              setCapsLock={setCapsLock}
              //textInputRef={textInputRef}
              //errorColor={error}
              autofocus
              setValue={setValue}
              value={value}
              placeholder="Enter Master Password"
              onSubmitEditing={() => {}}
            />
            <Button text={"Login"} onPress={() => {}}></Button>
          </>
        )}
        {capsLock && (
          <Text style={{ color: theme.colors.primary, marginTop: 10 }}>
            Caps Lock is activated
          </Text>
        )}
      </View>
    </Modal>
  );
}

export default ChangeMasterPasswordModal;

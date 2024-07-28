import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  IconButton,
  Portal,
  Switch,
  Text,
  TextInput,
} from "react-native-paper";
import getColors from "../../ui/linearGradient";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";
import theme from "../../ui/theme";
import Button from "../Button";

import generatePassword from "../../utils/generatePassword";
import CopyToClipboard from "../CopyToClipboard";
import Modal from "./Modal";
import { useTheme } from "../../contexts/ThemeProvider";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 4,
  },
});

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  changePassword: (password: string) => void;
};

function PasswordGeneratorModal(props: Props) {
  const { globalStyles } = useTheme();
  const [valueSlider, setvalueSlider] = useState(20);

  const [upperInclude, setupperInclude] = useState(true);
  const [numberInclude, setNumberInclude] = useState(true);
  const [symbolInclude, setSymbolInclude] = useState(true);

  const generate = () => {
    setGenPassword(
      generatePassword(valueSlider, upperInclude, numberInclude, symbolInclude)
    );
  };

  const [genPassword, setGenPassword] = useState(
    generatePassword(valueSlider, upperInclude, numberInclude, symbolInclude)
  );

  useEffect(() => {
    generate();
  }, [upperInclude, numberInclude, symbolInclude]);

  const hideModal = () => props.setVisible(false);
  return (
    <Portal>
      <Modal visible={props.visible} onDismiss={hideModal}>
        <LinearGradient
          colors={getColors()}
          style={{ padding: 3, width: 300, borderRadius: 20 }}
          end={{ x: 0.1, y: 0.2 }}
          dither={true}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 16,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ width: "100%", height: 40 }}>
              <TextInput
                outlineStyle={[globalStyles.outlineStyle]}
                style={[globalStyles.textInputStyle, { textAlign: "center" }]}
                value={genPassword}
                mode="outlined"
                autoCapitalize="none"
                readOnly={true}
              />
            </View>
            <View
              style={{
                //width: "100%",
                display: "flex",
                flexDirection: "row",
                margin: 2,
                alignItems: "center",
              }}
            >
              <IconButton
                iconColor={theme.colors.primary}
                icon="autorenew"
                size={20}
                onPress={generate}
              />
              <Slider
                value={valueSlider}
                onValueChange={setvalueSlider}
                onSlidingComplete={generate}
                style={{ width: 200, height: 40 }}
                minimumValue={1}
                maximumValue={50}
                step={1}
                minimumTrackTintColor="lightgray"
                maximumTrackTintColor="lightgray"
                thumbTintColor={theme.colors.primary}
              />
              <CopyToClipboard value={genPassword} />
            </View>
            <View style={styles.container}>
              <Text style={{ userSelect: "none" }} variant="bodyLarge">
                {"Password Length: " + valueSlider}
              </Text>
            </View>
            <View style={styles.container}>
              <Text variant="bodyLarge">{"include Uppercase"}</Text>
              <Switch
                value={upperInclude}
                onValueChange={() => {
                  setupperInclude(!upperInclude);
                }}
              />
            </View>
            <View style={styles.container}>
              <Text style={{ userSelect: "none" }} variant="bodyLarge">{"include Numbers"}</Text>
              <Switch
                value={numberInclude}
                onValueChange={() => setNumberInclude(!numberInclude)}
              />
            </View>
            <View style={styles.container}>
              <Text style={{ userSelect: "none" }} variant="bodyLarge">{"include Symbols"}</Text>
              <Switch
                value={symbolInclude}
                onValueChange={() => setSymbolInclude(!symbolInclude)}
              />
            </View>
            <Button
              onPress={() => {
                props.changePassword(genPassword);
                hideModal();
              }}
              text="Use"
            />
          </View>
        </LinearGradient>
      </Modal>
    </Portal>
  );
}

export default PasswordGeneratorModal;

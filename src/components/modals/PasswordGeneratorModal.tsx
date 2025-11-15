import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Divider,
  IconButton,
  Portal,
  Switch,
  Text,
  TextInput,
} from "react-native-paper";
import getColors from "../../ui/linearGradient";
import { LinearGradient } from "expo-linear-gradient";
import { Slider } from "@react-native-assets/slider";

import generatePassword from "../../utils/generatePassword";
import CopyToClipboard from "../buttons/CopyToClipboard";
import Modal from "./Modal";
import { useTheme } from "../../contexts/ThemeProvider";
import Button from "../buttons/Button";
import { useTranslation } from "react-i18next";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 4,
    height: 40,
    padding: 8,
  },
});

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  changePassword: (password: string) => void;
};

function PasswordGeneratorModal(props: Props) {
  const { globalStyles, theme } = useTheme();
  const {t} = useTranslation();
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
          <View
            style={{
              backgroundColor: theme.colors?.background,
              padding: 8,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: theme.colors.outlineVariant,
              width: 300,
            }}
          >
            <View style={{ width: "100%", height: 40, marginBottom: 8 }}>
              <TextInput
                outlineStyle={[globalStyles.outlineStyle]}
                style={[globalStyles.textInputStyle, { textAlign: "center" }]}
                value={genPassword}
                mode="outlined"
                autoCapitalize="none"
                readOnly={true}
              />
            </View>
            <Divider
              style={{ marginBottom: 0, marginTop: 0, height: 1, width: 270 }}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                height: 40,
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
            <Divider
              style={{ marginBottom: 0, marginTop: 0, height: 1, width: 270 }}
            />
            <View style={styles.container}>
              <Text style={{ userSelect: "none" }} variant="bodyLarge">
                {t("common:passwordLength")}
              </Text>
              <Text style={{ userSelect: "none" }} variant="bodyLarge">
                {valueSlider}
              </Text>
            </View>
            <Divider
              style={{ marginBottom: 0, marginTop: 0, height: 1, width: 270 }}
            />
            <View style={styles.container}>
              <Text variant="bodyLarge">{t("common:includeUppercase")}</Text>
              <Switch
                value={upperInclude}
                onValueChange={() => {
                  setupperInclude(!upperInclude);
                }}
              />
            </View>
            <Divider
              style={{ marginBottom: 0, marginTop: 0, height: 1, width: 270 }}
            />
            <View style={styles.container}>
              <Text style={{ userSelect: "none" }} variant="bodyLarge">
                {t("common:includeNumbers")}
              </Text>
              <Switch
                value={numberInclude}
                onValueChange={() => setNumberInclude(!numberInclude)}
              />
            </View>
            <Divider
              style={{ marginBottom: 0, marginTop: 0, height: 1, width: 270 }}
            />
            <View style={styles.container}>
              <Text style={{ userSelect: "none" }} variant="bodyLarge">
                {t("common:includeSymbols")}
              </Text>
              <Switch
                value={symbolInclude}
                onValueChange={() => setSymbolInclude(!symbolInclude)}
              />
            </View>
            <Divider
              style={{ marginBottom: 8, marginTop: 0, height: 1, width: 270 }}
            />
            <Button
              maxWidth={300}
              text={t("common:use")}
              onPress={() => {
                props.changePassword(genPassword);
                hideModal();
              }}
              color={theme.colors.primary}
            />
          </View>
      </Modal>
    </Portal>
  );
}

export default PasswordGeneratorModal;

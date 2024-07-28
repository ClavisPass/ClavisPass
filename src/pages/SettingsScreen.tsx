import React, { useEffect } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Button, Divider, Switch, Text } from "react-native-paper";
import SettingsItem from "../components/SettingsItem";
import { TitlebarHeight } from "../components/CustomTitlebar";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import AnimatedContainer from "../components/AnimatedContainer";
import { useFocusEffect } from "@react-navigation/native";
import WebSpecific from "../components/platformSpecific/WebSpecific";
import { useTheme } from "../contexts/ThemeProvider";
//import Import from "../components/documentPicker/Import";

const styles = StyleSheet.create({
  surface: {
    padding: 8,
    height: 80,
    width: "100%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  scrollView: {
    width: "100%",
  },
  container: {
    width: 200,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    margin: 6,
  },
});

function SettingsScreen({ navigation }: { navigation: any }) {
  const [startup, setStartup] = React.useState(false);

  const { darkmode, setDarkmode } = useTheme();

  /*const changeAutoStart = async (startup: boolean) => {
    if (startup) {
      await enable();
      setStartup(true);
    } else {
      await disable();
      setStartup(false);
    }
  };

  const getAutoStart = async () => {
    const value = await isEnabled();
    setStartup(value);
  };

  useEffect(() => {
    getAutoStart();
  }, []);*/

  return (
    <AnimatedContainer
      style={{ marginTop: Constants.statusBarHeight }}
      useFocusEffect={useFocusEffect}
    >
      <StatusBar
        animated={true}
        style="dark"
        backgroundColor="transparent"
        translucent={true}
      />
      <TitlebarHeight />
      <ScrollView style={styles.scrollView}>
        <WebSpecific>
          <SettingsItem title={"System"}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              <Text>Autostart</Text>
              <Switch
                value={startup}
                onValueChange={(checked) => {
                  console.log(checked);
                  //changeAutoStart(checked);
                }}
              />
            </View>
          </SettingsItem>
        </WebSpecific>
        <SettingsItem title={"Import Passwords"}>
          <View style={styles.container}>
            <Button
              icon="firefox"
              mode="contained-tonal"
              onPress={() => console.log("Pressed")}
            >
              Firefox Passwords
            </Button>
            <Button
              icon="google-chrome"
              mode="contained-tonal"
              onPress={() => console.log("Pressed")}
            >
              Chrome Passwords
            </Button>
            <Button
              icon="circle-outline"
              mode="contained-tonal"
              onPress={() => console.log("Pressed")}
            >
              pCloud Passwords
            </Button>
            
          </View>
          <Text variant="titleMedium">{"Export"}</Text>
          <Divider />
          <View style={styles.container}>
            <Button
              icon="export"
              mode="contained-tonal"
              onPress={() => console.log("Pressed")}
            >
              Export Passwords
            </Button>
          </View>
        </SettingsItem>
        <SettingsItem title={"Design"}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Text>darkmode</Text>
            <Switch
              value={darkmode}
              onValueChange={(checked) => {
                setDarkmode(checked);
              }}
            />
          </View>
        </SettingsItem>
        <SettingsItem title={"test"}>
          <Text>Surface</Text>
        </SettingsItem>
        <SettingsItem title={"test"}>
          <Text>Surface</Text>
        </SettingsItem>
        <SettingsItem title={"test"}>
          <Text>Surface</Text>
        </SettingsItem>
        <SettingsItem title={"test"}>
          <Text>Surface</Text>
        </SettingsItem>
      </ScrollView>
    </AnimatedContainer>
  );
}

export default SettingsScreen;

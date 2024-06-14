import React from "react";
import { View, StyleSheet } from "react-native";
import globalStyles from "../ui/globalStyles";
import { useAuth } from "../contexts/AuthProvider";
import Button from "../components/Button";
import TypeWriterComponent from "../components/TypeWriter";
import FadeInView from "../components/FadeInView";
import CustomTitlebar from "../components/CustomTitlebar";

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
});

function LoginScreen({ navigation }: { navigation: any }) {
  const auth = useAuth();
  return (
    <View style={globalStyles.container}>
      <View
        id={"titlebar"}
        style={{
          width: "100%",
          display: "flex",
          flexDirection:"row",
          justifyContent: "space-between",
        }}
      >
        <View></View>
        <CustomTitlebar />
      </View>
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <TypeWriterComponent />
        <Button text={"Login"} onPress={() => auth.login("1234")}></Button>
      </View>
    </View>
  );
}

export default LoginScreen;

import React from "react";
import { View, StyleSheet } from "react-native";
import globalStyles from "../ui/globalStyles";
import { useAuth } from "../contexts/AuthProvider";
import Button from "../components/Button";
import TypeWriterComponent from "../components/TypeWriter";
import FadeInView from "../components/FadeInView";

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
    <View
      style={[
        globalStyles.container,
        { alignItems: "center", justifyContent: "center" },
      ]}
    >
      <TypeWriterComponent />
      <Button text={"Login"} onPress={() => auth.login("1234")}></Button>
    </View>
  );
}

export default LoginScreen;

import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import globalStyles from "../ui/globalStyles";
import { useAuth } from "../contexts/AuthProvider";

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

function LoginScreen() {
  const auth = useAuth();
  return (
    <View style={globalStyles.container}>
      <Button mode="contained" onPress={() => auth.login("1234")}>Login</Button>
    </View>
  );
}

export default LoginScreen;

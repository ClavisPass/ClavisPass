import React from "react";
import { View, StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthProvider";
import Button from "../components/Button";
import TypeWriterComponent from "../components/TypeWriter";
import AnimatedContainer from "../components/AnimatedContainer";
import ContentProtection from "../components/ContentProtection";

function LoginScreen() {
  const auth = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <AnimatedContainer>
        <ContentProtection enabled={false} />
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <TypeWriterComponent />
          <Button text={"Login"} onPress={() => auth.login("1234")}></Button>
        </View>
      </AnimatedContainer>
    </View>
  );
}

export default LoginScreen;

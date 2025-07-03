import React, { useEffect } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useAuth } from "../contexts/AuthProvider";

function LogoutScreen({ navigation }: { navigation: any }) {
const { logout } = useAuth();
  useEffect(() => {
    logout();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator />
    </View>
  );
}

export default LogoutScreen;

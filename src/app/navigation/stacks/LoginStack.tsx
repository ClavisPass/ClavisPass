import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../../../screens/LoginScreen";
import ScanScreen from "../../../screens/ScanScreen";
import { LoginStackParamList } from "../model/types";

const Stack = createNativeStackNavigator<LoginStackParamList>();

export default function LoginStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Scan" component={ScanScreen} />
    </Stack.Navigator>
  );
}

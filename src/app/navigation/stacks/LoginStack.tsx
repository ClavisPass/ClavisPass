import Stack from "./Stack";
import LoginScreen from "../../../screens/LoginScreen";
import ScanScreen from "../../../screens/ScanScreen";

function LoginStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Scan" component={ScanScreen} />
    </Stack.Navigator>
  );
}

export default LoginStack;

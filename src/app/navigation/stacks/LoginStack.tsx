import Stack from "./Stack";
import transitionSpecConfig from "../../configs/TransitionSpecConfig";
import LoginScreen from "../../../screens/LoginScreen";
import ScanScreen from "../../../screens/ScanScreen";

function LoginStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: "vertical",
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          transitionSpec: {
            open: transitionSpecConfig,
            close: transitionSpecConfig,
          },
        }}
      />
      <Stack.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          headerShown: false,
          transitionSpec: {
            open: transitionSpecConfig,
            close: transitionSpecConfig,
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default LoginStack;

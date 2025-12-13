import Stack from "./Stack";
import transitionSpecConfig from "../../config/TransitionSpecConfig";
import LogoutScreen from "../../../screens/LogoutScreen";

function LogoutStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: "vertical",
      }}
    >
      <Stack.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          headerShown: false,
          transitionSpec: {
            open: transitionSpecConfig,
            close: transitionSpecConfig,
          },
          detachPreviousScreen: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default LogoutStack;

import Stack from "./Stack";
import transitionSpecConfig from "../../config/TransitionSpecConfig";
import SettingsScreen from "../../../screens/SettingsScreen";
import ScanScreen from "../../../screens/ScanScreen";

function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureDirection: "vertical",
      }}
    >
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          transitionSpec: {
            open: transitionSpecConfig,
            close: transitionSpecConfig,
          },
          detachPreviousScreen: false,
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

export default SettingsStack;

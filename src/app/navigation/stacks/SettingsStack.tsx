import Stack from "./Stack";
import SettingsScreen from "../../../screens/SettingsScreen";
import ScanScreen from "../../../screens/ScanScreen";

function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Scan" component={ScanScreen} />
    </Stack.Navigator>
  );
}

export default SettingsStack;

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SettingsScreen from "../../../screens/SettingsScreen";
import ScanScreen from "../../../screens/ScanScreen";
import { SettingsStackParamList } from "../model/types";
import DevicesScreen from "../../../screens/DevicesScreen";
import BrowserExtensionsScreen from "../../../screens/BrowserExtensionsScreen";
import BrowserExtensionSetupScreen from "../../../screens/BrowserExtensionSetupScreen";

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Scan" component={ScanScreen} />
      <Stack.Screen name="Devices" component={DevicesScreen} />
      <Stack.Screen
        name="BrowserExtensionSetup"
        component={BrowserExtensionSetupScreen}
      />
      <Stack.Screen
        name="BrowserExtensions"
        component={BrowserExtensionsScreen}
      />
    </Stack.Navigator>
  );
}

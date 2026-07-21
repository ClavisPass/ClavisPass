import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../../../screens/HomeScreen";
import EditScreen from "../../../screens/EditScreen";
import ReorderScreen from "../../../screens/ReorderScreen";
import DigitalCardScanScreen from "../../../screens/DigitalCardScanScreen";
import TotpScanScreen from "../../../screens/TotpScanScreen";
import CardDetailsScreen from "../../../screens/CardDetailsScreen";
import NoteEditorScreen from "../../../screens/NoteEditorScreen";
import { HomeStackParamList } from "../model/types";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
        freezeOnBlur: true,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Edit" component={EditScreen} />
      <Stack.Screen name="Reorder" component={ReorderScreen} />
      <Stack.Screen name="DigitalCardScan" component={DigitalCardScanScreen} />
      <Stack.Screen name="TotpScan" component={TotpScanScreen} />
      <Stack.Screen name="NoteEditor" component={NoteEditorScreen} />
      <Stack.Screen name="CardDetails" component={CardDetailsScreen} />
    </Stack.Navigator>
  );
}

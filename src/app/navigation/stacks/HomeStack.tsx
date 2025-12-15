import Stack from "./Stack";
import HomeScreen from "../../../screens/HomeScreen";
import EditScreen from "../../../screens/EditScreen";
import DigitalCardScanScreen from "../../../screens/DigitalCardScanScreen";
import TotpScanScreen from "../../../screens/TotpScanScreen";
import CardDetailsScreen from "../../../screens/CardDetailsScreen";

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Edit" component={EditScreen} />
      <Stack.Screen name="DigitalCardScan" component={DigitalCardScanScreen} />
      <Stack.Screen name="TotpScan" component={TotpScanScreen} />
      <Stack.Screen name="CardDetails" component={CardDetailsScreen} />
    </Stack.Navigator>
  );
}

export default HomeStack;

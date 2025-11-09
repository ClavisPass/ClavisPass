import Stack from "./Stack";
import transitionSpecConfig from "../configs/TransitionSpecConfig";
import HomeScreen from "../pages/HomeScreen";
import EditScreen from "../pages/EditScreen";
import DigitalCardScanScreen from "../pages/DigitalCardScanScreen";
import TotpScanScreen from "../pages/TotpScanScreen";
import CardDetailsScreen from "../pages/CardDetailsScreen";

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureDirection: "vertical",
        gestureEnabled: true,
        detachPreviousScreen: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          transitionSpec: {
            open: transitionSpecConfig,
            close: transitionSpecConfig,
          },
        }}
      />
      <Stack.Screen
        name="Edit"
        component={EditScreen}
        options={{
          headerShown: false,
          transitionSpec: {
            open: transitionSpecConfig,
            close: transitionSpecConfig,
          },
        }}
      />
      <Stack.Screen
        name="DigitalCardScan"
        component={DigitalCardScanScreen}
        options={{
          headerShown: false,
          transitionSpec: {
            open: transitionSpecConfig,
            close: transitionSpecConfig,
          },
        }}
      />
      <Stack.Screen
        name="TotpScan"
        component={TotpScanScreen}
        options={{
          headerShown: false,
          transitionSpec: {
            open: transitionSpecConfig,
            close: transitionSpecConfig,
          },
        }}
      />
      <Stack.Screen
        name="CardDetails"
        component={CardDetailsScreen}
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

export default HomeStack;

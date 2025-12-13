import Stack from "./Stack";
import transitionSpecConfig from "../../configs/TransitionSpecConfig";
import HomeScreen from "../../../screens/HomeScreen";
import EditScreen from "../../../screens/EditScreen";
import DigitalCardScanScreen from "../../../screens/DigitalCardScanScreen";
import TotpScanScreen from "../../../screens/TotpScanScreen";
import CardDetailsScreen from "../../../screens/CardDetailsScreen";
import { useTheme } from "../../providers/ThemeProvider";

function HomeStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureDirection: "vertical",
        detachPreviousScreen: false,
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
        cardShadowEnabled: false,
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

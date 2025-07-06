import Stack from "./Stack";
import transitionSpecConfig from "../configs/TransitionSpecConfig";
import HomeScreen from "../pages/HomeScreen";
import EditScreen from "../pages/EditScreen";

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
          detachPreviousScreen: false,
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
    </Stack.Navigator>
  );
}

export default HomeStack;

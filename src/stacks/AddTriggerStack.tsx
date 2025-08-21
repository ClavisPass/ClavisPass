import Stack from "./Stack";
import transitionSpecConfig from "../configs/TransitionSpecConfig";
import AddTriggerScreen from "../pages/AddTriggerScreen";

function AddTriggerStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        gestureDirection: "vertical",
      }}
    >
      <Stack.Screen
        name="AddTrigger"
        component={AddTriggerScreen}
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

export default AddTriggerStack;

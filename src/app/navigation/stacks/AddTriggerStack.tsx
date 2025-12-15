import Stack from "./Stack";
import AddTriggerScreen from "../../../screens/AddTriggerScreen";

function AddTriggerStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name="AddTrigger" component={AddTriggerScreen} />
    </Stack.Navigator>
  );
}

export default AddTriggerStack;

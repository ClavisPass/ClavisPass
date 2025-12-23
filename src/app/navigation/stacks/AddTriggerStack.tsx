import AddTriggerScreen from "../../../screens/AddTriggerScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AddTriggerStackParamList } from "../model/types";

const Stack = createNativeStackNavigator<AddTriggerStackParamList>();

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

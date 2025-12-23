import LogoutScreen from "../../../screens/LogoutScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogoutStackParamList } from "../model/types";

const Stack = createNativeStackNavigator<LogoutStackParamList>();

function LogoutStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name="Logout" component={LogoutScreen} />
    </Stack.Navigator>
  );
}

export default LogoutStack;

import Stack from "./Stack";
import LogoutScreen from "../../../screens/LogoutScreen";

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

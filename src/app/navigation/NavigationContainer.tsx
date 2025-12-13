import { NavigationContainer } from "@react-navigation/native";
import LoginStack from "./stacks/LoginStack";
import ProtectedRoute from "./ProtectedRoute";
import TabNavigator from "./TabNavigator";
import UpdateManager from "../../shared/components/UpdateManager";
import { useTheme } from "../providers/ThemeProvider";
function NavigationnContainer() {
  const { navigationTheme } = useTheme();
  return (
    <NavigationContainer theme={navigationTheme}>
      <ProtectedRoute loginScreen={<LoginStack />}>
        <TabNavigator />
        <UpdateManager />
      </ProtectedRoute>
    </NavigationContainer>
  );
}

export default NavigationnContainer;

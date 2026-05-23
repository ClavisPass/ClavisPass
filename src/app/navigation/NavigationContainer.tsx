import {
  NavigationContainer as ReactNavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import LoginStack from "./stacks/LoginStack";
import ProtectedRoute from "../auth/ProtectedRoute";
import TabNavigator from "./TabNavigator";
import UpdateManager from "../../shared/components/UpdateManager";
import { useTheme } from "../providers/ThemeProvider";
import TrayMenuBridge from "../../shared/components/TrayMenuBridge";
import type { AppTabsParamList } from "./model/types";
function NavigationnContainer() {
  const { navigationTheme } = useTheme();
  const navigationRef = useNavigationContainerRef<AppTabsParamList>();

  return (
    <ReactNavigationContainer ref={navigationRef} theme={navigationTheme}>
      <ProtectedRoute loginScreen={<LoginStack />}>
        <TrayMenuBridge navigationRef={navigationRef} />
        <TabNavigator />
        <UpdateManager />
      </ProtectedRoute>
    </ReactNavigationContainer>
  );
}

export default NavigationnContainer;

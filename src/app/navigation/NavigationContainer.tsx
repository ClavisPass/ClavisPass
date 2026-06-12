import React from "react";
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
import {
  subscribeOpenAddValueRequest,
  unsubscribeOpenAddValueRequest,
} from "../../infrastructure/events/openAddValueBus";
function NavigationnContainer() {
  const { navigationTheme } = useTheme();
  const navigationRef = useNavigationContainerRef<AppTabsParamList>();

  React.useEffect(() => {
    const openAddValue = () => {
      if (!navigationRef.isReady()) return;

      navigationRef.navigate("HomeStack", {
        screen: "Home",
        params: { triggerAdd: Date.now() },
      });
    };

    subscribeOpenAddValueRequest(openAddValue);
    return () => unsubscribeOpenAddValueRequest(openAddValue);
  }, [navigationRef]);

  return (
    <ReactNavigationContainer ref={navigationRef} theme={navigationTheme}>
      <TrayMenuBridge navigationRef={navigationRef} />
      <ProtectedRoute loginScreen={<LoginStack />}>
        <TabNavigator />
      </ProtectedRoute>
      <UpdateManager />
    </ReactNavigationContainer>
  );
}

export default NavigationnContainer;

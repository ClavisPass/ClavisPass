import React from "react";
import {
  NavigationContainer as ReactNavigationContainer,
  useNavigationContainerRef,
  type NavigationState,
  type PartialState,
  type Route,
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

const titlebarLightRoutes = new Set(["Home", "Reorder", "ModuleReorder"]);
const titlebarContentDragRoutes = new Set(["Home", "Reorder", "ModuleReorder"]);

function getFocusedRouteName(
  state?: NavigationState | PartialState<NavigationState>,
): string | undefined {
  if (!state || !state.routes.length) return undefined;

  const route = state.routes[
    state.index ?? state.routes.length - 1
  ] as Route<string> & {
    state?: NavigationState | PartialState<NavigationState>;
  };

  return getFocusedRouteName(route.state) ?? route.name;
}

function NavigationnContainer() {
  const {
    navigationTheme,
    setHeaderWhite,
    setTitlebarCenterGap,
    setTitlebarOverlayDragEnabled,
  } = useTheme();
  const navigationRef = useNavigationContainerRef<AppTabsParamList>();

  const syncTitlebarState = React.useCallback(() => {
    if (!navigationRef.isReady()) return;

    const routeName = getFocusedRouteName(navigationRef.getRootState());
    setHeaderWhite(titlebarLightRoutes.has(routeName ?? ""));
    setTitlebarCenterGap(0);
    setTitlebarOverlayDragEnabled(
      !titlebarContentDragRoutes.has(routeName ?? ""),
    );
  }, [
    navigationRef,
    setHeaderWhite,
    setTitlebarCenterGap,
    setTitlebarOverlayDragEnabled,
  ]);

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
    <ReactNavigationContainer
      ref={navigationRef}
      theme={navigationTheme}
      onReady={syncTitlebarState}
      onStateChange={syncTitlebarState}
    >
      <TrayMenuBridge navigationRef={navigationRef} />
      <ProtectedRoute loginScreen={<LoginStack />}>
        <TabNavigator />
      </ProtectedRoute>
      <UpdateManager />
    </ReactNavigationContainer>
  );
}

export default NavigationnContainer;

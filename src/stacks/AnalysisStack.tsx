import Stack from "./Stack";
import transitionSpecConfig from "../configs/TransitionSpecConfig";
import AnalysisScreen from "../pages/AnalysisScreen";
import AnalysisDetailScreen from "../pages/AnalysisDetailScreen";

function AnalysisStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureDirection: "vertical",
      }}
    >
      <Stack.Screen
        name="Analysis"
        component={AnalysisScreen}
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
        name="AnalysisDetail"
        component={AnalysisDetailScreen}
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

export default AnalysisStack;

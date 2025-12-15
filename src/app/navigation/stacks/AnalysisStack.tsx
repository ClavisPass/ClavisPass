import Stack from "./Stack";
import AnalysisScreen from "../../../screens/AnalysisScreen";
import AnalysisDetailScreen from "../../../screens/AnalysisDetailScreen";

function AnalysisStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name="Analysis" component={AnalysisScreen} />
      <Stack.Screen name="AnalysisDetail" component={AnalysisDetailScreen} />
    </Stack.Navigator>
  );
}

export default AnalysisStack;

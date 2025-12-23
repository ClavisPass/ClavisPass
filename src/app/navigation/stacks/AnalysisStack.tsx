import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AnalysisScreen from "../../../screens/AnalysisScreen";
import AnalysisDetailScreen from "../../../screens/AnalysisDetailScreen";
import { AnalysisStackParamList } from "../model/types";

const Stack = createNativeStackNavigator<AnalysisStackParamList>();

export default function AnalysisStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="Analysis" component={AnalysisScreen} />
      <Stack.Screen name="AnalysisDetail" component={AnalysisDetailScreen} />
    </Stack.Navigator>
  );
}

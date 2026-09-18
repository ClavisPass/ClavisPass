import { createNativeStackNavigator } from "@react-navigation/native-stack";

import IdentitiesScreen from "../../../screens/IdentitiesScreen";
import IdentityDetailScreen from "../../../screens/IdentityDetailScreen";
import { IdentityStackParamList } from "../model/types";

const Stack = createNativeStackNavigator<IdentityStackParamList>();

export default function IdentityStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="Identities" component={IdentitiesScreen} />
      <Stack.Screen name="IdentityDetail" component={IdentityDetailScreen} />
    </Stack.Navigator>
  );
}

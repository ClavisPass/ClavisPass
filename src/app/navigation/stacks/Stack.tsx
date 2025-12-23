import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../model/types";

const Stack = createNativeStackNavigator<RootStackParamList>();
export default Stack;

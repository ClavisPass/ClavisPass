import { createStackNavigator } from "@react-navigation/stack";
import ValuesType from "../types/ValuesType";
import { CachedPasswordsType } from "../pages/AnalysisScreen";

export type RootStackParamList = {
  Home: {
    triggerAdd: boolean | undefined;
  };
  Edit: {
    value: ValuesType;
  };
  Analysis: undefined;
  AnalysisDetail: {
    value: CachedPasswordsType;
  };
  Settings: undefined;
  Login: undefined;
  Scan: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default Stack;
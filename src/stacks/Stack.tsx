import { createStackNavigator } from "@react-navigation/stack";
import ValuesType from "../types/ValuesType";
import { CachedPasswordsType } from "../pages/AnalysisScreen";
import FolderType from "../types/FolderType";

export type RootStackParamList = {
  Home: {
    triggerAdd: boolean | undefined;
  };
  Edit: {
    value: ValuesType;
    favorite?: boolean;
    folder?: FolderType | null;
  };
  Analysis: undefined;
  AnalysisDetail: {
    value: CachedPasswordsType;
  };
  Settings: undefined;
  Login: undefined;
  Scan: undefined;
  DigitalCardScan: {
    setData: (data: string, type: string) => void;
  };
  Logout: undefined;
  AddTrigger: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default Stack;

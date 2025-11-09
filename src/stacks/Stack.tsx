import { createStackNavigator } from "@react-navigation/stack";
import ValuesType from "../types/ValuesType";
import { CachedPasswordsType } from "../pages/AnalysisScreen";
import FolderType from "../types/FolderType";
import DigitalCardType from "../types/DigitalCardType";

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
  TotpScan: {
    setOtpauth: (uri: string) => void;
  };
  Logout: undefined;
  AddTrigger: undefined;
  CardDetails: {
    value: string;
    title: string;
    type: DigitalCardType;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

export default Stack;

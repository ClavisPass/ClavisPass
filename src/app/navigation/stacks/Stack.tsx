import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ValuesType from "../../../features/vault/model/ValuesType";
import { CachedPasswordsType } from "../../../screens/AnalysisScreen";
import FolderType from "../../../features/vault/model/FolderType";
import DigitalCardType from "../../../features/vault/model/DigitalCardType";

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

const Stack = createNativeStackNavigator<RootStackParamList>();

export default Stack;

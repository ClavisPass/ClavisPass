import type { NavigatorScreenParams } from "@react-navigation/native";
import FolderType from "../../../features/vault/model/FolderType";
import DigitalCardType from "../../../features/vault/model/DigitalCardType";
import ValuesType from "../../../features/vault/model/ValuesType";
import AnalysisRef from "../../../features/analysis/model/AnalysisRef";

export type HomeStackParamList = {
  Home: { triggerAdd?: boolean } | undefined;
  Edit: { value: ValuesType; favorite?: boolean; folder?: FolderType | null };
  DigitalCardScan: { setData: (data: string, type: string) => void };
  TotpScan: { setOtpauth: (uri: string) => void };
  CardDetails: { value: string; title: string; type: DigitalCardType };
};

export type AnalysisStackParamList = {
  Analysis: undefined;
  AnalysisDetail: { ref: AnalysisRef };
};

export type SettingsStackParamList = {
  Settings: undefined;
  Scan: undefined;
  Devices: undefined;
};

export type LoginStackParamList = {
  Login: undefined;
  Scan: undefined;
};

export type LogoutStackParamList = {
  Logout: undefined;
};

export type AddTriggerStackParamList = {
  AddTrigger: undefined;
};

export type AppTabsParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  AnalysisStack: NavigatorScreenParams<AnalysisStackParamList>;
  AddTriggerStack: NavigatorScreenParams<AddTriggerStackParamList>;
  SettingsStack: NavigatorScreenParams<SettingsStackParamList>;
  LogoutStack: NavigatorScreenParams<LogoutStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<LoginStackParamList>;
  App: NavigatorScreenParams<AppTabsParamList>;
  Scan: undefined;
};

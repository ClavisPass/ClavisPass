import type { NavigatorScreenParams } from "@react-navigation/native";
import FolderType from "../../../features/vault/model/FolderType";
import DigitalCardType from "../../../features/vault/model/DigitalCardType";
import ValuesType from "../../../features/vault/model/ValuesType";
import AnalysisRef from "../../../features/analysis/model/AnalysisRef";

export type HomeStackParamList = {
  Home: { triggerAdd?: boolean | number } | undefined;
  Edit: {
    value: ValuesType;
    favorite?: boolean;
    folder?: FolderType | null;
    searchstring?: string | null;
  };
  DigitalCardScan: { setData: (data: string, type: string) => void };
  TotpScan: { setOtpauth: (uri: string) => void };
  NoteEditor: {
    value: string;
    title: string;
    setValue: (value: string) => void;
    variant?: "plain" | "markdown" | "snippet";
    setVariant?: (variant: "plain" | "markdown" | "snippet") => void;
    displayMode?: "compact" | "normal" | "large";
    setDisplayMode?: (mode: "compact" | "normal" | "large") => void;
    language?: "text" | "json" | "yaml" | "env" | "shell";
    setLanguage?: (
      language: "text" | "json" | "yaml" | "env" | "shell",
    ) => void;
    showLineNumbers?: boolean;
    setShowLineNumbers?: (show: boolean) => void;
    wrapLines?: boolean;
    setWrapLines?: (wrap: boolean) => void;
  };
  CardDetails: {
    value: string;
    title: string;
    type: DigitalCardType;
    sourceUrl?: string | null;
    faviconUrl?: string | null;
    accentColor?: string | null;
  };
};

export type AnalysisStackParamList = {
  Analysis: undefined;
  AnalysisDetail: { ref: AnalysisRef };
};

export type SettingsStackParamList = {
  Settings: undefined;
  Scan: undefined;
  Devices: undefined;
  BrowserExtensionSetup: undefined;
  BrowserExtensions: undefined;
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

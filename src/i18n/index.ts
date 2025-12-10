import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./languages/en";
import de from "./languages/de";
import { DEFAULT_NS } from "./TranslationSchema";

export const resources = {
  en: {
    [DEFAULT_NS]: en.common,
    bar: en.bar,
    login: en.login,
    home: en.home,
    settings: en.settings,
    analysis: en.analysis,
    analysisDetail: en.analysisDetail,
    greetings: en.greetings,
    modules: en.modules,
    moduleTemplates: en.moduleTemplates,
  },
  de: {
    [DEFAULT_NS]: de.common,
    bar: de.bar,
    login: de.login,
    home: de.home,
    settings: de.settings,
    analysis: de.analysis,
    analysisDetail: de.analysisDetail,
    greetings: de.greetings,
    modules: de.modules,
    moduleTemplates: de.moduleTemplates,
  },
} as const;

export async function initI18n(initialLng: keyof typeof resources) {
  if (i18n.isInitialized) return i18n;
  await i18n.use(initReactI18next).init({
    resources,
    lng: initialLng,
    fallbackLng: "en",
    ns: [
      DEFAULT_NS,
      "bar",
      "login",
      "home",
      "settings",
      "analysis",
      "analysisDetail",
      "greetings",
      "modules",
      "moduleTemplates",
    ],
    defaultNS: DEFAULT_NS,
    interpolation: { escapeValue: false },
    returnNull: false,
  });
  return i18n;
}

export { i18n };

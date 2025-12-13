import { useEffect, useRef } from "react";
import { useSetting } from "../../app/providers/SettingsProvider";
import { initI18n, i18n } from "../i18n";
import { toAppLanguage } from "../i18n/types";

function I18nBridge() {
  const { value: language, isReady } = useSetting("LANGUAGE");
  const didInitRef = useRef(false);

  useEffect(() => {
    if (!isReady) return;

    const lang = toAppLanguage(language);

    (async () => {
      if (!didInitRef.current) {
        await initI18n(lang);
        didInitRef.current = true;
        return;
      }
      await i18n.changeLanguage(lang);
    })();
  }, [language, isReady]);

  return null;
}

export default I18nBridge;

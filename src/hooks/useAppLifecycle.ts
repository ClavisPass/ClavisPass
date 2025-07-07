import { useEffect, useRef } from "react";
import { AppState, Platform } from "react-native";

export default function useAppLifecycle({
  onBackground,
  onForeground,
}: {
  onBackground: () => void;
  onForeground: () => void;
}) {
  const lastVisible = useRef<boolean>(true);
  const blocked = useRef(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const entered = useRef(true);

  const block = () => {
    blocked.current = true;
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      blocked.current = false;
    }, 300);
  };

  useEffect(() => {
    if (Platform.OS === "web") {
      const handleFocus = () => {
        if (entered.current) {
          onForeground();
          return;
        }
        if (blocked.current || lastVisible.current) return;
        lastVisible.current = true;
        block();
        onForeground();
      };

      const handleBlur = () => {
        if (entered.current) {
          return;
        }
        if (blocked.current || !lastVisible.current) return;
        lastVisible.current = false;
        block();
        onBackground();
      };

      const handleMouseEnter = () => {
        entered.current = true;
      };

      const handleMouseLeave = () => {
        entered.current = false;
      };

      window.addEventListener("focus", handleFocus);
      window.addEventListener("blur", handleBlur);
      document.addEventListener("mouseenter", handleMouseEnter);
      document.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        window.removeEventListener("focus", handleFocus);
        window.removeEventListener("blur", handleBlur);
        document.removeEventListener("mouseenter", handleMouseEnter);
        document.removeEventListener("mouseleave", handleMouseLeave);
        if (timeout.current) clearTimeout(timeout.current);
      };
    } else {
      const subscription = AppState.addEventListener("change", (state) => {
        if (state === "active") {
          onForeground();
        } else if (state === "background") {
          onBackground();
        }
      });

      return () => {
        subscription.remove();
      };
    }
  }, []);
}

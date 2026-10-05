import { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useAuth } from "../providers/AuthProvider";
import { useTheme } from "../providers/ThemeProvider";
import { useIsTauriEnvironment } from "../../infrastructure/platform/isTauri";

type Props = {
  children: ReactNode;
  loginScreen: ReactNode;
};

const ProtectedRoute = ({ children, loginScreen }: Props) => {
  const auth = useAuth();
  const { theme } = useTheme();
  const isTauri = useIsTauriEnvironment();
  const isAuthed = auth.getMaster() != null;

  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(150)}
      style={[
        styles.container,
        { backgroundColor: isTauri ? "transparent" : theme.colors.background },
      ]}
      collapsable={false}
    >
      {isAuthed ? children : loginScreen}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, position: "relative" },
});

export default ProtectedRoute;

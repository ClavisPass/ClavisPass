import { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useAuth } from "../contexts/AuthProvider";
import { useTheme } from "../contexts/ThemeProvider";

type Props = {
  children: ReactNode;
  loginScreen: ReactNode;
};

const ProtectedRoute = ({ children, loginScreen }: Props) => {
  const auth = useAuth();
  const { theme } = useTheme();
  const isAuthed = auth.master != null;

  return (
    // Fester Container, kein Layout-Animation hier
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View
        key={isAuthed ? "authed" : "login"}
        entering={FadeIn.duration(220)}
        exiting={FadeOut.duration(180)}
        style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.background }]}
        collapsable={false}
      >
        {isAuthed ? children : loginScreen}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, position: "relative" },
});

export default ProtectedRoute;

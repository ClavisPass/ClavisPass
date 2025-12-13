import { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useAuth } from "../providers/AuthProvider";
import { useTheme } from "../providers/ThemeProvider";

type Props = {
  children: ReactNode;
  loginScreen: ReactNode;
};

const ProtectedRoute = ({ children, loginScreen }: Props) => {
  const auth = useAuth();
  const { theme } = useTheme();
  const isAuthed = auth.master != null;

  return (
    <Animated.View
      //key={isAuthed ? "authed" : "login"}
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(150)}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
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

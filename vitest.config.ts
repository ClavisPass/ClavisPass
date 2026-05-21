import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "plugins/**/*.test.ts"],
    setupFiles: ["tests/setup.ts"],
    clearMocks: true,
    restoreMocks: true,
  },
  resolve: {
    alias: {
      "@env": path.resolve(__dirname, "tests/mocks/env.ts"),
      "react-native": path.resolve(__dirname, "tests/mocks/reactNative.ts"),
      "@react-native-async-storage/async-storage": path.resolve(
        __dirname,
        "tests/mocks/asyncStorage.ts",
      ),
      "expo-constants": path.resolve(__dirname, "tests/mocks/expoConstants.ts"),
      "expo-linear-gradient": path.resolve(
        __dirname,
        "tests/mocks/expoLinearGradient.ts",
      ),
      "expo-status-bar": path.resolve(
        __dirname,
        "tests/mocks/expoStatusBar.ts",
      ),
      "react-i18next": path.resolve(__dirname, "tests/mocks/reactI18next.ts"),
      "react-native-paper": path.resolve(
        __dirname,
        "tests/mocks/reactNativePaper.tsx",
      ),
      "react-native-reanimated": path.resolve(
        __dirname,
        "tests/mocks/reactNativeReanimated.tsx",
      ),
      "react-qr-code": path.resolve(__dirname, "tests/mocks/reactQrCode.tsx"),
      "@react-navigation/native": path.resolve(
        __dirname,
        "tests/mocks/reactNavigationNative.ts",
      ),
    },
  },
});

import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsProvider } from "../../src/app/providers/SettingsProvider";
import { ThemeProvider } from "../../src/app/providers/ThemeProvider";

export async function renderWithAppProviders(element: React.ReactElement) {
  await AsyncStorage.clear();

  let renderer: TestRenderer.ReactTestRenderer;

  await act(async () => {
    renderer = TestRenderer.create(
      <SettingsProvider>
        <ThemeProvider>{element}</ThemeProvider>
      </SettingsProvider>,
    );
    await Promise.resolve();
    await Promise.resolve();
  });

  return renderer!;
}

export async function renderBare(element: React.ReactElement) {
  let renderer: TestRenderer.ReactTestRenderer;

  await act(async () => {
    renderer = TestRenderer.create(element);
    await Promise.resolve();
  });

  return renderer!;
}

export function textContent(renderer: TestRenderer.ReactTestRenderer) {
  const parts: string[] = [];

  function visit(node: any) {
    if (typeof node === "string" || typeof node === "number") {
      parts.push(String(node));
      return;
    }

    if (!node || typeof node !== "object") {
      return;
    }

    const children = Array.isArray(node.children) ? node.children : [];
    children.forEach(visit);
  }

  visit(renderer.toJSON());
  return parts.join(" ");
}
